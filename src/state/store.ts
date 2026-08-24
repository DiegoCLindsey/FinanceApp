// ── state/store ───────────────────────────────────────────────────────────────
// Store tipado del estado de la aplicación. Sustituye a common/state.js:
//   · carga desde un StorageAdapter aplicando las migraciones pendientes
//   · get/set tipados por colección (sin strings sueltos)
//   · suscripciones por clave → re-render selectivo en lugar de global
// Usa las mismas claves de localStorage que el State legacy, así que lee los
// datos existentes del usuario sin conversión manual.

import { formatLocalDate, todayISO, type ISODate } from '@/core/dates';
import { crearResolverTramos } from '@/core/tax/tables';
import type { Tramos } from '@/core/tax/irpf';
import { defaultAccount, defaultState, SCHEMA_VERSION, type AppConfig, type AppState, type CollectionKey } from './schema';
import { LEGACY_KEYS, runMigrations } from './migrations';
import { KEY_PREFIX, VERSION_KEY } from './storage/local';
import { crearHistorialBorrados, type BorradoRegistrado } from './deshacer';
import type { StorageAdapter } from './storage/types';

export type StateKey = keyof AppState;
export type Listener = (key: StateKey) => void;

export interface StoreOptions {
  adapter: StorageAdapter;
  /** Instante de referencia para los valores por defecto. */
  hoy?: Date;
}

function horizonteDefecto(hoy: Date): ISODate {
  return formatLocalDate(new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate()));
}

export function createStore({ adapter, hoy = new Date() }: StoreOptions) {
  const hoyISO = formatLocalDate(hoy);
  const finISO = horizonteDefecto(hoy);
  let state: AppState = defaultState(hoyISO, finISO);
  const listeners = new Set<Listener>();
  let lastMigrations: number[] = [];
  const borrados = crearHistorialBorrados();

  function notify(key: StateKey) {
    for (const l of listeners) l(key);
  }

  function persist(key: StateKey) {
    void adapter.set(`${KEY_PREFIX}${key}`, state[key]);
  }

  /** Carga el estado persistido, migrándolo si hace falta. */
  function load(): { applied: number[] } {
    const raw: Record<string, unknown> = {};
    for (const k of Object.keys(state) as StateKey[]) {
      const val = adapter.get(`${KEY_PREFIX}${k}`);
      if (val !== null) raw[k] = val;
    }
    // Colecciones retiradas del esquema que alguna migración aún necesita leer
    for (const k of LEGACY_KEYS) {
      const val = adapter.get(`${KEY_PREFIX}${k}`);
      if (val !== null) raw[k] = val;
    }
    const storedVersion = adapter.get<number>(VERSION_KEY);
    const { state: migrated, applied } = runMigrations(raw, storedVersion, { hoyISO, finISO });
    state = migrated;
    ensureInvariants();
    if (applied.length > 0) {
      for (const k of Object.keys(state) as StateKey[]) persist(k);
      void adapter.set(VERSION_KEY, SCHEMA_VERSION);
    }
    lastMigrations = applied;
    return { applied };
  }

  /** Invariantes que deben cumplirse siempre, migrado o no. */
  function ensureInvariants() {
    if (!Array.isArray(state.accounts) || state.accounts.length === 0) {
      state.accounts = [defaultAccount(hoyISO)];
      persist('accounts');
      return;
    }
    const principales = state.accounts.filter((a) => a.esCuentaPrincipal);
    if (principales.length === 0) {
      state.accounts = state.accounts.map((a, i) => (i === 0 ? { ...a, esCuentaPrincipal: true } : a));
      persist('accounts');
    } else if (principales.length > 1) {
      let visto = false;
      state.accounts = state.accounts.map((a) => {
        if (!a.esCuentaPrincipal) return a;
        if (!visto) {
          visto = true;
          return a;
        }
        return { ...a, esCuentaPrincipal: false };
      });
      persist('accounts');
    }
  }

  function get<K extends StateKey>(key: K): AppState[K] {
    return state[key];
  }

  function set<K extends StateKey>(key: K, value: AppState[K]): void {
    state[key] = value;
    persist(key);
    notify(key);
  }

  /** Parche superficial sobre config (el patrón más común en las vistas). */
  function patchConfig(patch: Partial<AppConfig>): void {
    set('config', { ...state.config, ...patch });
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function addItem<K extends CollectionKey>(col: K, item: Omit<AppState[K][number], '_id'> & { _id?: string }): AppState[K][number] {
    const arr = [...(state[col] as unknown[])] as AppState[K];
    const nuevo = { ...item, _id: uid() } as AppState[K][number];
    (arr as unknown[]).push(nuevo);
    set(col, arr);
    return nuevo;
  }

  function updateItem<K extends CollectionKey>(col: K, id: string, patch: Partial<AppState[K][number]>): void {
    const arr = (state[col] as { _id: string }[]).map((i) => (i._id === id ? { ...i, ...patch } : i));
    set(col, arr as AppState[K]);
  }

  /**
   * Borra un elemento, dejándolo apuntado para poder deshacerlo.
   *
   * El registro vive aquí y no en cada pantalla porque `removeItem` es el
   * embudo por el que pasan TODOS los borrados de la aplicación: engancharlo en
   * un sitio da deshacer en los doce, y ninguna pantalla futura puede olvidarse
   * de conectarlo.
   */
  function removeItem<K extends CollectionKey>(col: K, id: string): void {
    const arr = state[col] as unknown as ({ _id: string } & Record<string, unknown>)[];
    const indice = arr.findIndex((i) => i._id === id);
    // Borrar algo que no está no cambia nada, y sobre todo no debe tapar el
    // deshacer del borrado anterior, que sí era de verdad.
    if (indice < 0) return;
    borrados.registrar({ col, item: arr[indice], indice });
    set(col, arr.filter((_, i) => i !== indice) as unknown as AppState[K]);
  }

  /**
   * Devuelve a su sitio lo último borrado. `null` si no hay nada que deshacer.
   *
   * Se reinserta en la posición que ocupaba, acotada al tamaño actual: entre el
   * borrado y el deshacer puede haber entrado o salido gente de la lista.
   */
  function deshacerBorrado(): BorradoRegistrado | null {
    const b = borrados.tomar();
    if (!b) return null;
    const arr = [...(state[b.col as CollectionKey] as unknown[])];
    arr.splice(Math.min(b.indice, arr.length), 0, b.item);
    set(b.col as CollectionKey, arr as unknown as AppState[CollectionKey]);
    return b;
  }

  /** Lo que se podría deshacer ahora mismo, para pintar el aviso. */
  function borradoPendiente(): BorradoRegistrado | null {
    return borrados.pendiente();
  }

  // ── Helpers de dominio de uso frecuente ─────────────────────────────────────

  function getPrincipalAccountId(): string {
    const accounts = state.accounts || [];
    const p = accounts.find((a) => a.esCuentaPrincipal && a.activo) || accounts.find((a) => a.activo);
    return p ? p._id : 'default';
  }

  function accountName(id: string): string {
    return state.accounts.find((a) => a._id === id)?.nombre ?? id;
  }

  /** Resolver de tramos IRPF por ejercicio (histórico + default de config). */
  function resolverTramosIRPF(): (año: number) => Tramos {
    return crearResolverTramos(state.tramosIRPFHistorico, state.config.tramos_irpf);
  }

  /** Resolver de tramos del ahorro por ejercicio. */
  function resolverTramosGanancias(): (año: number) => Tramos {
    return crearResolverTramos(state.tramosGananciasCapitalHistorico, state.config.tramosGananciasCapital);
  }

  /** Snapshot inmutable para export/backup. */
  function snapshot(): AppState {
    return structuredClone(state);
  }

  /** Reemplaza el estado completo (import de backup), migrándolo antes. */
  function replaceAll(raw: Record<string, unknown>, fromVersion: number | null = null): { applied: number[] } {
    const { state: migrated, applied } = runMigrations(raw, fromVersion, { hoyISO, finISO });
    state = migrated;
    ensureInvariants();
    for (const k of Object.keys(state) as StateKey[]) persist(k);
    void adapter.set(VERSION_KEY, SCHEMA_VERSION);
    for (const k of Object.keys(state) as StateKey[]) notify(k);
    return { applied };
  }

  return {
    load,
    get,
    set,
    patchConfig,
    subscribe,
    addItem,
    updateItem,
    removeItem,
    deshacerBorrado,
    borradoPendiente,
    getPrincipalAccountId,
    accountName,
    resolverTramosIRPF,
    resolverTramosGanancias,
    snapshot,
    replaceAll,
    get schemaVersion() {
      return SCHEMA_VERSION;
    },
    get migrationsApplied() {
      return [...lastMigrations];
    },
    get today() {
      return hoyISO || todayISO();
    },
  };
}

export type Store = ReturnType<typeof createStore>;
