// @vitest-environment happy-dom
// Adapter de localStorage: espacio de nombres compartido con el State legacy y
// recuperación de las claves que se escribieron fuera de él.
//
// Regresión de un bug real: el adapter escribía `state_<colección>` mientras que
// el StorageAdapter legacy (common/storage.js) usa `financeapp_state_<colección>`.
// El store nuevo leía un juego de claves vacío y sus escrituras eran invisibles
// para la app legacy y para la exportación.
import { describe, it, expect, beforeEach } from 'vitest';
import { adoptarClavesHuerfanas, createLocalStorageAdapter, KEY_PREFIX, NAMESPACE, VERSION_KEY } from '@/state/storage/local';
import { createStore } from '@/state/store';

const HOY = new Date(2026, 6, 30);

/** Escribe como lo hace common/storage.js: prefijo `financeapp_`. */
function escribirLegacy(clave: string, valor: unknown) {
  localStorage.setItem(`${NAMESPACE}${clave}`, JSON.stringify(valor));
}

beforeEach(() => localStorage.clear());

describe('espacio de nombres del adapter', () => {
  it('escribe en las mismas claves físicas que el State legacy', () => {
    const adapter = createLocalStorageAdapter();
    adapter.set(`${KEY_PREFIX}expenses`, [{ _id: 'e1' }]);

    expect(localStorage.getItem('financeapp_state_expenses')).toBe('[{"_id":"e1"}]');
    expect(localStorage.getItem('state_expenses')).toBeNull();
  });

  it('lee los datos que dejó el State legacy', () => {
    escribirLegacy('state_expenses', [{ _id: 'e1', nombre: 'Luz' }]);
    expect(createLocalStorageAdapter().get(`${KEY_PREFIX}expenses`)).toEqual([{ _id: 'e1', nombre: 'Luz' }]);
  });

  it('remove y keys operan sobre el espacio de nombres', () => {
    const adapter = createLocalStorageAdapter();
    escribirLegacy('state_loans', []);
    localStorage.setItem('ajeno', '1'); // clave de otra cosa: no debe aparecer

    expect(adapter.keys()).toEqual(['state_loans']);
    adapter.remove(`${KEY_PREFIX}loans`);
    expect(localStorage.getItem('financeapp_state_loans')).toBeNull();
    expect(localStorage.getItem('ajeno')).toBe('1');
  });

  it('un valor corrupto se trata como ausente, no lanza', () => {
    localStorage.setItem('financeapp_state_expenses', '{no es json');
    expect(createLocalStorageAdapter().get(`${KEY_PREFIX}expenses`)).toBeNull();
  });

  it('el store carga los datos reales del usuario legacy', () => {
    escribirLegacy('state_expenses', [
      { _id: 'e1', nombre: 'Luz', cantidad: 80, frecuencia: 'mensual', fechaInicio: '2025-01-01', activo: true },
    ]);
    escribirLegacy('state_accounts', [
      { _id: 'default', nombre: 'Default', saldo: 1234, esCuentaPrincipal: true, activo: true, historicoSaldos: [] },
    ]);
    escribirLegacy(VERSION_KEY, 4);

    const store = createStore({ adapter: createLocalStorageAdapter(), hoy: HOY });
    store.load();

    expect(store.get('expenses')).toHaveLength(1);
    expect(store.get('accounts')[0].saldo).toBe(1234);
  });
});

describe('recuperación de claves huérfanas', () => {
  it('adopta lo que no existe en el espacio de nombres y borra el original', () => {
    localStorage.setItem('state_transacciones', '[{"_id":"t1"}]');

    expect(adoptarClavesHuerfanas()).toEqual(['state_transacciones']);
    expect(localStorage.getItem('financeapp_state_transacciones')).toBe('[{"_id":"t1"}]');
    expect(localStorage.getItem('state_transacciones')).toBeNull();
  });

  it('el dato canónico manda: una huérfana nunca pisa datos buenos', () => {
    escribirLegacy('state_expenses', [{ _id: 'bueno' }]);
    localStorage.setItem('state_expenses', '[]'); // lo que escribió la build con el bug

    expect(adoptarClavesHuerfanas()).toEqual([]);
    expect(JSON.parse(localStorage.getItem('financeapp_state_expenses') as string)).toEqual([{ _id: 'bueno' }]);
    expect(localStorage.getItem('state_expenses')).toBeNull(); // limpia igualmente
  });

  it('no toca claves ajenas al store', () => {
    localStorage.setItem('financeapp_auth_token', 'xxx');
    localStorage.setItem('otra_cosa', '1');

    adoptarClavesHuerfanas();

    expect(localStorage.getItem('financeapp_auth_token')).toBe('xxx');
    expect(localStorage.getItem('otra_cosa')).toBe('1');
  });

  it('es idempotente: la segunda pasada no encuentra nada', () => {
    localStorage.setItem('state_puntosControl', '[]');
    expect(adoptarClavesHuerfanas()).toHaveLength(1);
    expect(adoptarClavesHuerfanas()).toHaveLength(0);
  });

  it('la contabilidad escrita por la build con el bug sobrevive a la migración', () => {
    // Usuario legacy en v4 + contabilidad huérfana escrita el 2026-07-30
    escribirLegacy('state_accounts', [
      { _id: 'default', nombre: 'Default', saldo: 100, esCuentaPrincipal: true, activo: true, historicoSaldos: [] },
    ]);
    escribirLegacy(VERSION_KEY, 4);
    localStorage.setItem(
      'state_transacciones',
      JSON.stringify([{ _id: 't1', fecha: '2026-07-01', cuentaId: 'default', importeCts: -1500, concepto: 'Café', tags: [] }]),
    );

    adoptarClavesHuerfanas();
    const store = createStore({ adapter: createLocalStorageAdapter(), hoy: HOY });
    store.load();

    expect(store.get('transacciones')).toHaveLength(1);
    expect(store.get('transacciones')[0].concepto).toBe('Café');
    expect(store.get('accounts')[0].saldo).toBe(100);
  });
});
