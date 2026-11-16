// @vitest-environment happy-dom
//
// BUG-01: el `State` legacy y el store nuevo tenían cada uno su copia en
// memoria de las mismas claves de localStorage y se pisaban. Con el paquete
// nuevo cargado, `State` es ahora una fachada del store.
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createStore, type Store } from '@/state/store';
import { createLocalStorageAdapter } from '@/state/storage/local';

interface StateLegacy {
  get(k: string): unknown;
  set(k: string, v: unknown): void;
  load(): Promise<void>;
  addItem(col: string, item: Record<string, unknown>): { _id: string };
  updateItem(col: string, id: string, patch: Record<string, unknown>): void;
  removeItem(col: string, id: string): void;
  accountName(id: string): string;
  getPrincipalAccountId(): string;
}

const g = globalThis as unknown as { State: StateLegacy; window: { FinanceApp?: { store: Store } } };
const enDisco = (clave: string) => JSON.parse(localStorage.getItem(`financeapp_state_${clave}`) ?? 'null');

beforeAll(async () => {
  // @ts-expect-error scripts clásicos del legacy, sin tipos
  await import('../../common/storage.js');
  // @ts-expect-error scripts clásicos del legacy, sin tipos
  await import('../../common/state.js');
});

describe('State legacy como fachada del store', () => {
  let store: Store;
  beforeEach(() => {
    localStorage.clear();
    store = createStore({ adapter: createLocalStorageAdapter(localStorage) });
    store.load();
    g.window.FinanceApp = { store } as never;
  });

  it('lo que crea el legacy lo ve el store, y no se pierde con la siguiente escritura del store', () => {
    g.State.addItem('expenses', { concepto: 'Nómina', cuantia: 2500, tipo: 'ingreso', tipoFrecuencia: 'mensual', activo: true, tags: [] });
    g.State.addItem('expenses', { concepto: 'Alquiler', cuantia: 800, tipo: 'gasto', tipoFrecuencia: 'mensual', activo: true, tags: [] });
    expect(store.get('expenses').map((e) => e.concepto)).toEqual(['Nómina', 'Alquiler']);

    store.addItem('expenses', { concepto: 'Luz', cuantia: 60, tipo: 'gasto', tipoFrecuencia: 'mensual', activo: true, tags: [] });
    expect((enDisco('expenses') as { concepto: string }[]).map((e) => e.concepto)).toEqual(['Nómina', 'Alquiler', 'Luz']);
    expect((g.State.get('expenses') as unknown[]).length).toBe(3);
  });

  it('el saldo que fija el legacy sobrevive a una edición de cuentas desde el store', () => {
    g.State.updateItem('accounts', 'default', { saldoInicial: 5000 });
    store.updateItem('accounts', 'default', { nombre: 'Cuenta nómina' });
    expect(enDisco('accounts')[0]).toMatchObject({ saldoInicial: 5000, nombre: 'Cuenta nómina' });
    expect(g.State.accountName('default')).toBe('Cuenta nómina');
  });

  it('config: los cambios de un lado y del otro conviven', () => {
    g.State.set('config', { ...(g.State.get('config') as object), autoSave: true, autoLogoutMinutos: 15 });
    store.patchConfig({ features: { margenes: true } });
    g.State.set('config', { ...(g.State.get('config') as object), analisisCollapsed: true });
    expect(enDisco('config')).toMatchObject({
      autoSave: true,
      autoLogoutMinutos: 15,
      analisisCollapsed: true,
      features: { margenes: true },
    });
  });

  it('un borrado hecho por el legacy no resucita y se puede deshacer', () => {
    const a = g.State.addItem('expenses', {
      concepto: 'Simulado',
      cuantia: 1,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      activo: true,
      tags: [],
    });
    g.State.removeItem('expenses', a._id);
    store.addItem('expenses', { concepto: 'Otro', cuantia: 1, tipo: 'gasto', tipoFrecuencia: 'mensual', activo: true, tags: [] });
    expect((enDisco('expenses') as { concepto: string }[]).map((e) => e.concepto)).toEqual(['Otro']);
  });

  it('las colecciones retiradas del esquema no se persisten', () => {
    g.State.set('goals', [{ _id: 'x' }]);
    expect(localStorage.getItem('financeapp_state_goals')).toBeNull();
    expect(g.State.get('escenarios')).toEqual([]);
  });

  it('sin paquete nuevo sigue funcionando con su propia copia', async () => {
    delete g.window.FinanceApp;
    localStorage.clear();
    await g.State.load();
    g.State.addItem('loans', { nombre: 'Coche' });
    expect((enDisco('loans') as unknown[]).length).toBe(1);
  });
});
