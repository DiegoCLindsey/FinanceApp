// BUG-06: la migración 010 no llegaba a ejecutarse porque el store no leía del
// almacenamiento las colecciones que debía retirar. La 011 termina el trabajo.
import { describe, expect, it } from 'vitest';
import { createStore } from '@/state/store';
import { createMemoryAdapter, VERSION_KEY } from '@/state/storage/local';
import { migrateTo11, ETIQUETA_SUPUESTO } from '@/state/migrations/011-supuestos-archivados';
import { SCHEMA_VERSION } from '@/state/schema';

const ctx = { hoyISO: '2026-11-16', finISO: '2027-11-16' };
const gasto = (extra: Record<string, unknown>) => ({
  cuantia: 500,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  activo: true,
  tags: [],
  ...extra,
});

function almacenV10ConRestos() {
  return createMemoryAdapter({
    [VERSION_KEY]: 10,
    state_expenses: [
      gasto({ _id: 'real', concepto: 'Alquiler', escenarioIds: [] }),
      gasto({ _id: 'hip', concepto: 'Solo en supuesto', escenarioIds: ['esc1'], tags: ['ocio'] }),
    ],
    state_loans: [
      {
        _id: 'l1',
        nombre: 'Hipoteca',
        activo: true,
        tags: [],
        amortizaciones: [
          { _id: 'a1', fecha: '2027-01-01', cantidad: 1000 },
          { _id: 'a2', fecha: '2027-06-01', cantidad: 5000, escenarioIds: ['esc1'] },
        ],
      },
    ],
    state_config: { escenarioActivo: 'esc1', colchonMeses: 3 },
    state_escenarios: [{ _id: 'esc1', nombre: '¿Y si…?' }],
    state_planes: [
      { _id: 'plan_base', objetivos: [] },
      { _id: 'p1', objetivos: [{ nombre: 'Coche' }] },
    ],
    state_goals: [{ _id: 'g1' }],
  });
}

describe('migración 011', () => {
  it('desactiva y etiqueta lo que solo existía en un supuesto, sin borrarlo', () => {
    const adapter = almacenV10ConRestos();
    const store = createStore({ adapter });
    expect(store.load().applied).toEqual([11]);

    const [real, hip] = store.get('expenses');
    expect(real).toMatchObject({ activo: true, tags: [] });
    expect(real).not.toHaveProperty('escenarioIds');
    expect(hip).toMatchObject({ activo: false, tags: ['ocio', ETIQUETA_SUPUESTO] });
    expect(hip).not.toHaveProperty('escenarioIds');
  });

  it('saca del préstamo las amortizaciones de un supuesto y las archiva', () => {
    const store = createStore({ adapter: almacenV10ConRestos() });
    store.load();
    expect(store.get('loans')[0].amortizaciones.map((a) => a._id)).toEqual(['a1']);
    const archivo = store.get('config').archivoMigracion011;
    expect(archivo?.amortizaciones).toHaveLength(1);
    expect(archivo?.amortizaciones[0]).toMatchObject({ _id: 'a2', loanId: 'l1', loanNombre: 'Hipoteca' });
    expect(archivo?.desactivados).toBe(1);
  });

  it('archiva los planes con datos y borra las claves huérfanas', () => {
    const adapter = almacenV10ConRestos();
    const store = createStore({ adapter });
    store.load();
    expect(store.get('config').archivoMigracion011?.planes.map((p) => p._id)).toEqual(['p1']);
    expect(store.get('config')).not.toHaveProperty('escenarioActivo');
    expect(store.get('config').colchonMeses).toBe(3);
    for (const k of ['state_escenarios', 'state_planes', 'state_goals']) expect(adapter.get(k)).toBeNull();
    expect(adapter.get(VERSION_KEY)).toBe(SCHEMA_VERSION);
  });

  it('una segunda carga no cambia nada', () => {
    const adapter = almacenV10ConRestos();
    createStore({ adapter }).load();
    const antes = JSON.stringify(
      adapter
        .keys()
        .sort()
        .map((k) => [k, adapter.get(k)]),
    );
    const store2 = createStore({ adapter });
    expect(store2.load().applied).toEqual([]);
    expect(
      JSON.stringify(
        adapter
          .keys()
          .sort()
          .map((k) => [k, adapter.get(k)]),
      ),
    ).toBe(antes);
  });

  it('sobre un estado limpio no toca nada ni crea archivo', () => {
    const limpio = { expenses: [gasto({ _id: 'x', concepto: 'A' })], loans: [], nominas: [], accounts: [], config: { colchonMeses: 6 } };
    const out = migrateTo11(structuredClone(limpio), ctx);
    expect(out.expenses).toEqual(limpio.expenses);
    expect(out.config).toEqual({ colchonMeses: 6 });
  });

  it('nunca desactiva la cuenta principal aunque viniera marcada con un supuesto', () => {
    const out = migrateTo11({ accounts: [{ _id: 'default', esCuentaPrincipal: true, activo: true, escenarioIds: ['e'] }] }, ctx);
    expect((out.accounts as { activo: boolean }[])[0].activo).toBe(true);
  });
});

describe('BUG-16: un almacenamiento incompleto arranca con valores por defecto', () => {
  it('solo versión y gastos: el resto sale de fábrica', () => {
    const adapter = createMemoryAdapter({ [VERSION_KEY]: SCHEMA_VERSION, state_expenses: [gasto({ _id: 'x', concepto: 'A' })] });
    const store = createStore({ adapter });
    expect(store.load().applied).toEqual([]);
    expect(store.get('config').features).toEqual({});
    expect(store.get('config').colchonMeses).toBe(6);
    expect(store.get('loans')).toEqual([]);
    expect(store.get('personas')).toHaveLength(1);
    expect(store.get('accounts')[0]._id).toBe('default');
    expect(store.get('expenses')).toHaveLength(1);
  });

  it('una config parcial conserva lo suyo y completa lo que falta', () => {
    const adapter = createMemoryAdapter({ [VERSION_KEY]: SCHEMA_VERSION, state_config: { colchonMeses: 2 } });
    const store = createStore({ adapter });
    store.load();
    expect(store.get('config')).toMatchObject({ colchonMeses: 2, showColchon: true, tagGrupos: [] });
  });
});
