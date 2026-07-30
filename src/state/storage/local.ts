// ── state/storage/local ───────────────────────────────────────────────────────
// Adapter sobre localStorage. Usa las MISMAS claves que el State legacy
// (`state_<colección>`, `state__schemaVersion`) para que el cambio al store
// nuevo lea los datos ya existentes del usuario sin exportar/importar nada.

import type { StorageAdapter } from './types';

export const KEY_PREFIX = 'state_';
export const VERSION_KEY = 'state__schemaVersion';

export function createLocalStorageAdapter(backing: Storage = localStorage): StorageAdapter {
  return {
    get<T>(key: string): T | null {
      try {
        const raw = backing.getItem(key);
        return raw === null ? null : (JSON.parse(raw) as T);
      } catch {
        return null; // valor corrupto: se trata como ausente
      }
    },
    set<T>(key: string, value: T): void {
      try {
        backing.setItem(key, JSON.stringify(value));
      } catch (e) {
        // Cuota agotada o modo privado: no debe tumbar la app
        console.error('No se pudo guardar en localStorage:', key, e);
      }
    },
    remove(key: string): void {
      try {
        backing.removeItem(key);
      } catch {
        /* no-op */
      }
    },
    keys(): string[] {
      const out: string[] = [];
      for (let i = 0; i < backing.length; i++) {
        const k = backing.key(i);
        if (k) out.push(k);
      }
      return out;
    },
  };
}

/** Adapter en memoria — para tests y para el modo "sin persistencia". */
export function createMemoryAdapter(seed: Record<string, unknown> = {}): StorageAdapter {
  const data = new Map<string, string>(Object.entries(seed).map(([k, v]) => [k, JSON.stringify(v)]));
  return {
    get<T>(key: string): T | null {
      const raw = data.get(key);
      if (raw === undefined) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    set<T>(key: string, value: T): void {
      data.set(key, JSON.stringify(value));
    },
    remove(key: string): void {
      data.delete(key);
    },
    keys(): string[] {
      return [...data.keys()];
    },
  };
}
