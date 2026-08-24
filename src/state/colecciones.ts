// ── state/colecciones ─────────────────────────────────────────────────────────
// Qué se guarda en una copia de seguridad. Una sola lista, en un solo sitio.
//
// Había CUATRO listas de colecciones escritas a mano —exportar a JSON, importar
// de JSON, subir a Firebase y subir a Dropbox— y las cuatro se habían quedado
// atrás. Ninguna incluía `planes`, `transacciones` ni `puntosControl`, o sea que
// el planificador de objetivos financieros entero, toda la contabilidad real y
// los puntos de control **no estaban en ninguna copia de seguridad**. Y las
// cuatro seguían pidiendo `history`, una colección que ya no existe.
//
// Ese es el fallo estructural: añadir una colección al esquema exigía acordarse
// de tocar cuatro ficheros legacy que nadie mira. Ahora la lista se deriva del
// esquema y las cuatro rutas la consumen; olvidarse deja de ser posible.

import { defaultState, type AppState } from './schema';
import type { StorageAdapter } from './storage/types';
import { KEY_PREFIX } from './storage/local';

/** Clave de una colección del estado. */
export type StateKey = keyof AppState;

/**
 * Todas las claves del estado, tomadas del esquema.
 *
 * `defaultState` tiene por construcción una entrada por colección, así que sus
 * claves SON el esquema. Derivarlo de ahí en vez de repetirlo a mano es lo que
 * hace que no se pueda volver a olvidar ninguna.
 */
export const COLECCIONES: StateKey[] = Object.keys(defaultState('1970-01-01', '1970-01-01')) as StateKey[];

/** Colecciones que ya no existen y que una copia antigua puede traer. */
export const COLECCIONES_RETIRADAS = ['history'] as const;

/**
 * Copia de seguridad leída del ALMACENAMIENTO, no de una copia en memoria.
 *
 * El estado vive por duplicado —el `State` legacy y el store nuevo tienen cada
 * uno su copia— y localStorage es lo único que ambos escriben, así que es la
 * única fuente que no puede ir por detrás. Subir desde una copia en memoria era
 * el otro camino por el que se perdían cambios recientes.
 */
export function snapshotParaCopia(adapter: StorageAdapter): Partial<AppState> {
  const out: Record<string, unknown> = {};
  for (const k of COLECCIONES) {
    const v = adapter.get(`${KEY_PREFIX}${k}`);
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out as Partial<AppState>;
}

/**
 * Deja una copia de seguridad en el estado, colección a colección.
 *
 * Solo escribe lo que la copia trae: una copia vieja sin `transacciones` no
 * debe borrar la contabilidad de este dispositivo. Devuelve las claves escritas.
 *
 * El `escribir` lo pone el llamante porque restaurar y guardar no son lo mismo:
 * una restauración desde la nube NO debe mover el sello de última modificación
 * local (ver `common/storage.js`), y un import de fichero sí.
 */
export function aplicarCopia(escribir: (claveLogica: string, valor: unknown) => void, copia: Record<string, unknown>): StateKey[] {
  const escritas: StateKey[] = [];
  for (const k of COLECCIONES) {
    const v = copia[k];
    if (v === undefined || v === null) continue;
    escribir(`${KEY_PREFIX}${k}`, v);
    escritas.push(k);
  }
  return escritas;
}

/** Colecciones que la copia NO trae y que, por tanto, se quedan como estaban. */
export function faltantesEnCopia(copia: Record<string, unknown>): StateKey[] {
  return COLECCIONES.filter((k) => copia[k] === undefined || copia[k] === null);
}
