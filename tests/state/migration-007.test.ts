// Migración v7: `historialPrecios` deja de existir y cada entrada se convierte
// en una transacción real enlazada a su estimación (F4, tarea 4.8).
import { describe, it, expect } from 'vitest';
import { migrateTo7 } from '@/state/migrations/007-price-history';
import { runMigrations } from '@/state/migrations';
import { createStore } from '@/state/store';
import { createMemoryAdapter, KEY_PREFIX, VERSION_KEY } from '@/state/storage/local';
import { SCHEMA_VERSION } from '@/state/schema';
import type { Transaccion } from '@/state/schema';

const CTX = { hoyISO: '2026-07-31', finISO: '2027-07-31' };
const migrar = (raw: Record<string, unknown>) => migrateTo7(raw, CTX);

const gasto = (extra: Record<string, unknown> = {}) => ({
  _id: 'e1',
  concepto: 'Luz',
  cuantia: 80,
  tipo: 'gasto',
  cuenta: 'acc1',
  tags: ['casa', 'suministros'],
  historialPrecios: [
    { _id: 'h1', fecha: '2025-06-01', cuantia: 90, nota: 'Factura junio' },
    { _id: 'h2', fecha: '2025-09-01', cuantia: 110.55 },
  ],
  ...extra,
});

describe('migración v7', () => {
  it('convierte cada entrada del historial en una transacción enlazada', () => {
    const out = migrar({ expenses: [gasto()] });
    const tx = out.transacciones as Transaccion[];

    expect(tx).toHaveLength(2);
    expect(tx[0]).toMatchObject({
      fecha: '2025-06-01',
      cuentaId: 'acc1',
      importeCts: -9000, // gasto → negativo, en céntimos
      concepto: 'Luz',
      tags: ['casa', 'suministros'],
      estimacionId: 'e1',
      tipo: 'gasto',
      origen: 'importado',
      nota: 'Factura junio',
    });
    // Céntimos exactos, sin arrastre de coma flotante
    expect(tx[1].importeCts).toBe(-11055);
    expect(tx[1].nota).toBe('Importado del historial de precios');
  });

  it('retira el campo de todas las estimaciones', () => {
    const out = migrar({ expenses: [gasto(), { _id: 'e2', concepto: 'Sin historial', cuantia: 10, tipo: 'gasto' }] });
    for (const e of out.expenses as Record<string, unknown>[]) {
      expect('historialPrecios' in e).toBe(false);
    }
    // El resto de campos se conserva intacto
    expect((out.expenses as Record<string, unknown>[])[0]).toMatchObject({ _id: 'e1', concepto: 'Luz', cuantia: 80 });
  });

  it('un ingreso genera transacciones positivas', () => {
    const out = migrar({ expenses: [gasto({ tipo: 'ingreso' })] });
    expect((out.transacciones as Transaccion[]).map((t) => t.importeCts)).toEqual([9000, 11055]);
    expect((out.transacciones as Transaccion[])[0].tipo).toBe('ingreso');
  });

  it('respeta las transacciones que ya existían y las ordena por fecha', () => {
    const previa: Transaccion = {
      _id: 'tx0',
      fecha: '2026-01-15',
      cuentaId: 'acc1',
      importeCts: -500,
      concepto: 'Café',
      tags: [],
      tipo: 'gasto',
      origen: 'manual',
    };
    const out = migrar({ expenses: [gasto()], transacciones: [previa] });
    const tx = out.transacciones as Transaccion[];
    expect(tx).toHaveLength(3);
    expect(tx.map((t) => t.fecha)).toEqual(['2025-06-01', '2025-09-01', '2026-01-15']);
    expect(tx.find((t) => t._id === 'tx0')).toEqual(previa);
  });

  it('es idempotente: reaplicarla no duplica transacciones', () => {
    const primera = migrar({ expenses: [gasto()] });
    // El historial ya no está, pero un backup mezclado podría traerlo otra vez
    const segunda = migrar({ ...primera, expenses: [gasto()] });
    expect(segunda.transacciones as Transaccion[]).toHaveLength(2);
  });

  it('descarta entradas con fecha o importe inválidos sin lanzar', () => {
    const out = migrar({
      expenses: [
        gasto({
          historialPrecios: [
            { fecha: 'ayer', cuantia: 10 },
            { fecha: '2025-01-01', cuantia: 0 },
            { fecha: '2025-01-02', cuantia: -5 },
            { fecha: '2025-01-03', cuantia: 'mucho' },
            null,
            { fecha: '2025-01-04', cuantia: 12 }, // la única válida
          ],
        }),
      ],
    });
    expect(out.transacciones as Transaccion[]).toHaveLength(1);
    expect((out.transacciones as Transaccion[])[0].fecha).toBe('2025-01-04');
  });

  it('tolera un estado sin gastos, con basura o con campos ausentes', () => {
    expect(() => migrar({})).not.toThrow();
    expect(migrar({}).transacciones).toEqual([]);
    expect(() => migrar({ expenses: 'nope' })).not.toThrow();
    expect(() => migrar({ expenses: [{ _id: 'x', historialPrecios: 'nope' }] })).not.toThrow();
    // Sin _id no se puede enlazar: se descarta el historial, no se inventa nada
    expect(migrar({ expenses: [{ concepto: 'Huérfano', historialPrecios: [{ fecha: '2025-01-01', cuantia: 5 }] }] }).transacciones).toEqual(
      [],
    );
  });

  it('la cuenta cae en "default" si la estimación no tenía', () => {
    const out = migrar({ expenses: [gasto({ cuenta: undefined })] });
    expect((out.transacciones as Transaccion[])[0].cuentaId).toBe('default');
  });

  it('una transferencia se importa como gasto, sin inventar el signo', () => {
    const out = migrar({ expenses: [gasto({ tipo: 'transferencia' })] });
    expect((out.transacciones as Transaccion[])[0].tipo).toBe('gasto');
    expect((out.transacciones as Transaccion[])[0].importeCts).toBeLessThan(0);
  });
});

describe('v7 dentro de la cadena completa', () => {
  it('un backup v4 con historial llega a v7 con las transacciones creadas', () => {
    const { state, applied } = runMigrations(
      {
        expenses: [gasto()],
        accounts: [{ _id: 'acc1', nombre: 'Principal', activo: true, esCuentaPrincipal: true }],
      },
      4,
      CTX,
    );
    expect(applied).toEqual([5, 6, 7]);
    expect(state.transacciones).toHaveLength(2);
    expect('historialPrecios' in state.expenses[0]).toBe(false);
  });

  it('el store persiste el resultado y sube la versión del esquema', () => {
    const adapter = createMemoryAdapter({
      [VERSION_KEY]: 6,
      [`${KEY_PREFIX}expenses`]: [gasto()],
      [`${KEY_PREFIX}accounts`]: [{ _id: 'acc1', nombre: 'P', activo: true, esCuentaPrincipal: true, historicoSaldos: [] }],
    });
    const store = createStore({ adapter, hoy: new Date(2026, 6, 31) });
    const { applied } = store.load();

    expect(applied).toEqual([7]);
    expect(store.get('transacciones')).toHaveLength(2);
    expect(store.schemaVersion).toBe(SCHEMA_VERSION);
    expect(adapter.get(VERSION_KEY)).toBe(SCHEMA_VERSION);
    // Y una segunda carga no vuelve a migrar ni duplica nada
    const store2 = createStore({ adapter, hoy: new Date(2026, 6, 31) });
    expect(store2.load().applied).toEqual([]);
    expect(store2.get('transacciones')).toHaveLength(2);
  });
});
