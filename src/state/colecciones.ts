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

/**
 * ¿Este estado es, en la práctica, el de fábrica?
 *
 * Existe para una decisión concreta: si al conectar la nube el local resulta
 * ser el estado por defecto, no hay nada que decidir — se restaura sin
 * preguntar. Antes de esto, la aplicación preguntaba «¿qué copia conservas?»
 * incluso en un dispositivo recién estrenado, porque comprobaba SI el estado
 * se había tocado (un sello de tiempo), no si tenía datos reales debajo.
 *
 * El sello de última modificación no sirve para esto: el propio arranque de
 * la aplicación persiste el estado por defecto al migrar, así que un
 * dispositivo sin usar también tiene un sello «reciente» — ver la nota larga
 * en `common/state.js` sobre el bug de versiones de esquema compartidas. Por
 * eso esta función mira el CONTENIDO, no cuándo se escribió.
 *
 * Una cuenta cuenta como «de fábrica» solo si es exactamente la `default` sin
 * saldo inicial ni histórico: cualquier otra cosa —otro nombre, otro id, un
 * saldo, un punto de control— es una cuenta que el usuario ha tocado.
 */
export function esEstadoVacioOPorDefecto(snapshot: Record<string, unknown>): boolean {
  const arr = (k: string): unknown[] => {
    const v = snapshot[k];
    return Array.isArray(v) ? v : [];
  };
  // config, accounts y personas se miran aparte; el resto basta con que estén
  // vacías.
  const colecciones = COLECCIONES.filter((k) => k !== 'config' && k !== 'accounts' && k !== 'personas');
  if (!colecciones.every((k) => arr(k).length === 0)) return false;

  // La migración 009 siembra SIEMPRE una persona por defecto, tenga o no el
  // usuario datos reales — igual que la cuenta `default` y el plan
  // `plan_base`. Sin este caso especial, un dispositivo recién estrenado con
  // la persona de fábrica nunca se detectaría como vacío.
  const personas = arr('personas') as Array<{ _id?: unknown }>;
  const esPersonasDeFabrica = personas.length === 0 || (personas.length === 1 && personas[0]?._id === 'default');
  if (!esPersonasDeFabrica) return false;

  const cuentas = arr('accounts') as Array<{ _id?: unknown; saldoInicial?: unknown; historicoSaldos?: unknown }>;
  return cuentas.every(
    (a) =>
      a._id === 'default' &&
      // Cualquier saldo inicial distinto de cero es un dato real, incluido uno
      // negativo (una cuenta que arranca en descubierto sigue siendo un dato
      // que el usuario ha tecleado, no el valor de fábrica).
      !(typeof a.saldoInicial === 'number' && a.saldoInicial !== 0) &&
      !(Array.isArray(a.historicoSaldos) && a.historicoSaldos.length > 0),
  );
}

/** Clave con la que una copia declara el esquema con el que se hizo. */
export const CLAVE_VERSION_COPIA = '_schemaVersion';

/**
 * ¿Con qué versión de esquema se hizo esta copia?
 *
 * Importar o restaurar una copia la escribía tal cual y recargaba el store,
 * pero la versión guardada en el almacenamiento seguía siendo la actual, así
 * que **las migraciones no corrían**: una copia antigua (con `goals`, con
 * gastos de un supuesto, sin `personas`…) entraba a medio migrar (docs/14,
 * BUG-27). Las copias llevan ahora su versión; para las anteriores se deduce
 * del contenido, de la más vieja a la más nueva, con una señal por migración:
 *
 *   sin `config.features`                     → 4  (anterior al esquema formal)
 *   sin `transacciones`                        → 5  (anterior a la contabilidad)
 *   algún gasto con `historialPrecios`         → 6
 *   sin `personas`                             → 8
 *   con restos de supuestos o del planificador → 10 (falta la limpieza de la 011)
 *   en otro caso                               → `actual`
 *
 * Deducir de menos es peor que deducir de más: una migración de más sobre datos
 * ya migrados puede duplicar (la 006 reimportaría el histórico), y una de menos
 * solo deja algo sin limpiar. Por eso cada regla exige una señal positiva.
 */
export function inferirVersionDeCopia(copia: Record<string, unknown>, actual: number): number {
  const declarada = copia[CLAVE_VERSION_COPIA];
  if (typeof declarada === 'number' && Number.isFinite(declarada)) return Math.min(declarada, actual);

  const arr = (k: string): Record<string, unknown>[] => (Array.isArray(copia[k]) ? (copia[k] as Record<string, unknown>[]) : []);
  const config = copia.config && typeof copia.config === 'object' ? (copia.config as Record<string, unknown>) : null;

  if (config && config.features === undefined) return 4;
  if (copia.transacciones === undefined && copia.expenses !== undefined) return 5;
  if (arr('expenses').some((e) => Array.isArray(e.historialPrecios) && e.historialPrecios.length > 0)) return 6;
  if (copia.personas === undefined && copia.expenses !== undefined) return 8;

  const conSupuesto = (items: Record<string, unknown>[]) => items.some((i) => Array.isArray(i.escenarioIds) && i.escenarioIds.length > 0);
  const restos =
    copia.escenarios !== undefined ||
    copia.planes !== undefined ||
    copia.goals !== undefined ||
    conSupuesto(arr('expenses')) ||
    conSupuesto(arr('loans')) ||
    conSupuesto(arr('nominas')) ||
    conSupuesto(arr('accounts')) ||
    arr('loans').some((l) => conSupuesto(Array.isArray(l.amortizaciones) ? (l.amortizaciones as Record<string, unknown>[]) : []));
  if (restos) return Math.min(10, actual);

  return actual;
}
