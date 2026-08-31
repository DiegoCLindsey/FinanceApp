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
 *
 * `planes` se comprueba aparte y NO basta con que esté vacía: la migración 008
 * crea un plan `plan_base` (con un vehículo por cuenta y cero objetivos) en
 * TODA instalación nueva, tenga o no el usuario datos reales. Sin este caso
 * especial, `planes.length === 0` nunca sería cierto y esta función no
 * detectaría NUNCA un dispositivo recién estrenado — justo el caso que existe
 * para cubrir.
 */
export function esEstadoVacioOPorDefecto(snapshot: Record<string, unknown>): boolean {
  const arr = (k: string): unknown[] => {
    const v = snapshot[k];
    return Array.isArray(v) ? v : [];
  };
  // config, accounts, planes y personas se miran aparte; el resto basta con
  // que estén vacías.
  const colecciones = COLECCIONES.filter((k) => k !== 'config' && k !== 'accounts' && k !== 'planes' && k !== 'personas');
  if (!colecciones.every((k) => arr(k).length === 0)) return false;

  const planes = arr('planes') as Array<{ _id?: unknown; objetivos?: unknown }>;
  const esPlanDeFabrica =
    planes.length === 0 ||
    (planes.length === 1 && planes[0]?._id === 'plan_base' && !(Array.isArray(planes[0]?.objetivos) && planes[0].objetivos.length > 0));
  if (!esPlanDeFabrica) return false;

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
