// ── state/storage/local ───────────────────────────────────────────────────────
// Adapter sobre localStorage. Usa las MISMAS claves físicas que el State legacy
// para que el store nuevo lea los datos existentes del usuario sin exportar ni
// importar nada.
//
// Ojo con la doble capa de prefijos, que es la fuente de un bug ya corregido:
//   · clave lógica  → `state_<colección>` / `state__schemaVersion`  (KEY_PREFIX)
//   · clave física  → `financeapp_state_<colección>`                (NAMESPACE)
// El `StorageAdapter` legacy (common/storage.js) antepone `financeapp_` a todo
// lo que escribe, así que el adapter nuevo tiene que hacer exactamente lo mismo.

import type { StorageAdapter } from './types';

/** Prefijo lógico de las colecciones, tal como las nombra el store. */
export const KEY_PREFIX = 'state_';
export const VERSION_KEY = 'state__schemaVersion';

/** Espacio de nombres físico en localStorage, compartido con el State legacy. */
export const NAMESPACE = 'financeapp_';

/**
 * Clave del sello de última modificación. La escriben los DOS mundos —este
 * adapter y `common/storage.js`— porque la pregunta que responde es una sola:
 * ¿se ha tocado algo aquí desde la última vez que se trajo la copia de la nube?
 */
export const CLAVE_SELLO = 'state__modificadoEn';

export function createLocalStorageAdapter(backing: Storage = localStorage, namespace: string = NAMESPACE): StorageAdapter {
  const fisica = (key: string) => `${namespace}${key}`;
  return {
    get<T>(key: string): T | null {
      try {
        const raw = backing.getItem(fisica(key));
        return raw === null ? null : (JSON.parse(raw) as T);
      } catch {
        return null; // valor corrupto: se trata como ausente
      }
    },
    set<T>(key: string, value: T): void {
      try {
        backing.setItem(fisica(key), JSON.stringify(value));
        // Sello de última modificación, compartido con el StorageAdapter legacy
        // (common/storage.js). Sin esto, un cambio hecho desde una vista nueva
        // no movería el sello y la copia de la nube lo pisaría en la siguiente
        // recarga sin avisar: exactamente el fallo que el sello viene a evitar.
        if (key !== CLAVE_SELLO) backing.setItem(fisica(CLAVE_SELLO), JSON.stringify(Date.now()));
      } catch (e) {
        // Cuota agotada o modo privado: no debe tumbar la app
        console.error('No se pudo guardar en localStorage:', key, e);
      }
    },
    remove(key: string): void {
      try {
        backing.removeItem(fisica(key));
      } catch {
        /* no-op */
      }
    },
    keys(): string[] {
      const out: string[] = [];
      for (let i = 0; i < backing.length; i++) {
        const k = backing.key(i);
        if (k?.startsWith(namespace)) out.push(k.slice(namespace.length));
      }
      return out;
    },
  };
}

/**
 * Recupera las claves escritas sin espacio de nombres por las compilaciones en
 * las que el adapter olvidaba el prefijo `financeapp_` (desplegadas el
 * 2026-07-30). Aquellas escrituras iban a un juego de claves paralelo que ni el
 * State legacy ni la exportación veían.
 *
 * Regla de resolución: **manda el dato canónico**. Una clave huérfana solo se
 * adopta si la canónica no existe, de modo que nunca puede pisar datos buenos.
 * Las huérfanas se borran siempre, adoptadas o no, para que la recuperación sea
 * idempotente y no quede basura en localStorage.
 *
 * @returns las claves lógicas adoptadas (para poder registrarlo).
 */
export function adoptarClavesHuerfanas(backing: Storage = localStorage, namespace: string = NAMESPACE): string[] {
  const huerfanas: string[] = [];
  for (let i = 0; i < backing.length; i++) {
    const k = backing.key(i);
    // Solo las del store nuevo: `state_*` sin espacio de nombres.
    if (k?.startsWith(KEY_PREFIX) && !k.startsWith(namespace)) huerfanas.push(k);
  }

  const adoptadas: string[] = [];
  for (const clave of huerfanas) {
    try {
      const valor = backing.getItem(clave);
      if (valor !== null && backing.getItem(`${namespace}${clave}`) === null) {
        backing.setItem(`${namespace}${clave}`, valor);
        adoptadas.push(clave);
      }
      backing.removeItem(clave);
    } catch {
      /* una clave problemática no debe abortar la recuperación */
    }
  }
  return adoptadas;
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
