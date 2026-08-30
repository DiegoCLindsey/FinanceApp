// ── state/proyectos ──────────────────────────────────────────────────────────
// Varios proyectos para un mismo usuario: cada uno es una instancia separada de
// FinanceApp (sus propias cuentas, gastos, préstamos... todo), en el MISMO
// localStorage, distinguidos por un prefijo de espacio de nombres distinto.
//
// El proyecto `default` es especial: usa el espacio de nombres `financeapp_`
// de siempre, SIN el segmento `p_<id>_`. Es lo que hace que activar esta
// funcionalidad no mueva ni un byte de los datos de quien ya usaba la app —
// su proyecto único pasa a llamarse "Mis finanzas" sin que nada se copie ni se
// migre. Solo puede eliminarse; el resto de operaciones (renombrar, duplicar,
// importar desde/hacia él) funcionan igual que con cualquier otro.
//
// El registro de proyectos (la lista y cuál está activo) vive en dos claves
// SIN namespacing por proyecto — si estuvieran namespaced, cada proyecto vería
// una lista distinta, que es justo lo contrario de lo que hace falta para
// poder cambiar entre ellos.

import { COLECCIONES } from './colecciones';
import { CLAVE_SELLO, KEY_PREFIX, NAMESPACE, VERSION_KEY, createLocalStorageAdapter } from './storage/local';

export interface Proyecto {
  _id: string;
  nombre: string;
  creadoEn: number;
  actualizadoEn: number;
}

const CLAVE_PROYECTOS = `${NAMESPACE}meta_proyectos`;
const CLAVE_ACTIVO = `${NAMESPACE}meta_proyectoActivo`;

export const PROYECTO_DEFECTO_ID = 'default';
const NOMBRE_DEFECTO = 'Mis finanzas';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Espacio de nombres físico de un proyecto. El `default` no lleva segmento. */
export function namespaceDeProyecto(id: string): string {
  return id === PROYECTO_DEFECTO_ID ? NAMESPACE : `${NAMESPACE}p_${id}_`;
}

/**
 * Claves LÓGICAS (sin espacio de nombres) que forman el estado de un proyecto:
 * una por cada colección del esquema, más la versión y el sello. Se derivan de
 * `COLECCIONES` — la misma lista que ya usan las copias de seguridad — para no
 * volver a escribir a mano una quinta lista que se quede atrás si el esquema
 * gana una colección nueva.
 */
function clavesLogicasDeEstado(): string[] {
  return [...COLECCIONES.map((c) => `${KEY_PREFIX}${c}`), VERSION_KEY, CLAVE_SELLO];
}

export function crearServicioProyectos(storage: Storage = localStorage) {
  function leerLista(): Proyecto[] {
    try {
      const raw = storage.getItem(CLAVE_PROYECTOS);
      if (!raw) return [];
      const arr: unknown = JSON.parse(raw);
      return Array.isArray(arr) ? (arr as Proyecto[]) : [];
    } catch {
      return [];
    }
  }

  function escribirLista(lista: Proyecto[]): void {
    storage.setItem(CLAVE_PROYECTOS, JSON.stringify(lista));
  }

  /**
   * Todos los proyectos, garantizando que `default` siempre aparece — es
   * donde vivían los datos antes de que existiera esta funcionalidad, así que
   * su entrada se siembra sola en el primer acceso en vez de exigir una
   * migración explícita.
   */
  function listar(): Proyecto[] {
    const lista = leerLista();
    if (lista.some((p) => p._id === PROYECTO_DEFECTO_ID)) return lista;
    const ahora = Date.now();
    const conDefecto = [{ _id: PROYECTO_DEFECTO_ID, nombre: NOMBRE_DEFECTO, creadoEn: ahora, actualizadoEn: ahora }, ...lista];
    escribirLista(conDefecto);
    return conDefecto;
  }

  function activo(): string {
    try {
      const raw = storage.getItem(CLAVE_ACTIVO);
      if (!raw) return PROYECTO_DEFECTO_ID;
      const id: unknown = JSON.parse(raw);
      return typeof id === 'string' && id ? id : PROYECTO_DEFECTO_ID;
    } catch {
      return PROYECTO_DEFECTO_ID;
    }
  }

  /**
   * Marca qué proyecto está activo. NO recarga la página ni reconstruye nada
   * — el store, el adapter, la sesión legacy... todo eso se calcula una sola
   * vez al arrancar (`bootstrap()`), así que cambiar de proyecto de verdad
   * exige releer esta página desde cero. Eso lo decide quien llame a esto.
   */
  function establecerActivo(id: string): void {
    storage.setItem(CLAVE_ACTIVO, JSON.stringify(id));
  }

  function crear(nombre: string): Proyecto {
    const limpio = nombre.trim() || 'Proyecto sin nombre';
    const ahora = Date.now();
    const proyecto: Proyecto = { _id: uid(), nombre: limpio, creadoEn: ahora, actualizadoEn: ahora };
    escribirLista([...listar(), proyecto]);
    return proyecto;
  }

  function renombrar(id: string, nombre: string): void {
    const limpio = nombre.trim();
    if (!limpio) return;
    escribirLista(listar().map((p) => (p._id === id ? { ...p, nombre: limpio, actualizadoEn: Date.now() } : p)));
  }

  /**
   * Copia TODO el estado de un proyecto a uno nuevo — es una instancia
   * independiente desde ese instante, no un enlace ni una referencia. Copia
   * colección a colección por su clave lógica en vez de barrer todo lo que
   * empiece por el espacio de nombres del origen: para `default`, ese prefijo
   * (`financeapp_`) también cubre el registro de proyectos, la sesión, la
   * huella biométrica y los proyectos DE OTROS — barrerlo entero se llevaría
   * por delante cosas que no son datos de este proyecto.
   */
  function duplicar(id: string, nombreNuevo?: string): Proyecto {
    const origen = listar().find((p) => p._id === id);
    if (!origen) throw new Error('Proyecto no encontrado.');
    const nsOrigen = namespaceDeProyecto(id);
    const nuevo: Proyecto = {
      _id: uid(),
      nombre: nombreNuevo?.trim() || `${origen.nombre} (copia)`,
      creadoEn: Date.now(),
      actualizadoEn: Date.now(),
    };
    const nsDestino = namespaceDeProyecto(nuevo._id);
    for (const claveLogica of clavesLogicasDeEstado()) {
      const valor = storage.getItem(`${nsOrigen}${claveLogica}`);
      if (valor === null) continue;
      storage.setItem(`${nsDestino}${claveLogica}`, valor);
    }
    escribirLista([...listar(), nuevo]);
    return nuevo;
  }

  /**
   * Borra un proyecto y todo su estado. El `default` no se puede eliminar
   * (es donde cae cualquier instalación sin proyectos configurados, y
   * borrarlo dejaría a la app sin ningún sitio natural donde aterrizar); el
   * proyecto ACTIVO tampoco, para no dejar la sesión en curso apuntando a un
   * espacio de nombres que ya no tiene registro — hay que cambiar a otro
   * primero.
   */
  function eliminar(id: string): void {
    if (id === PROYECTO_DEFECTO_ID) throw new Error('No se puede eliminar el proyecto original.');
    if (id === activo()) throw new Error('No se puede eliminar el proyecto activo. Cambia a otro primero.');
    const lista = listar();
    if (!lista.some((p) => p._id === id)) return;
    const ns = namespaceDeProyecto(id);
    for (const claveLogica of clavesLogicasDeEstado()) storage.removeItem(`${ns}${claveLogica}`);
    escribirLista(lista.filter((p) => p._id !== id));
  }

  return { listar, activo, establecerActivo, crear, renombrar, duplicar, eliminar };
}

export type ServicioProyectos = ReturnType<typeof crearServicioProyectos>;

/**
 * Lee, en crudo, algunas colecciones de OTRO proyecto (no el activo) — para
 * poder importarlas sin salir de la sesión actual. Usa el mismo adapter que
 * el store para no reinventar el parseo ni el espacio de nombres.
 */
export function leerColeccionesDeProyecto(storage: Storage, idOrigen: string, colecciones: string[]): Record<string, unknown[]> {
  const adapter = createLocalStorageAdapter(storage, namespaceDeProyecto(idOrigen));
  const out: Record<string, unknown[]> = {};
  for (const col of colecciones) {
    const v = adapter.get(`${KEY_PREFIX}${col}`);
    out[col] = Array.isArray(v) ? v : [];
  }
  return out;
}

/**
 * Da ids nuevos a todo lo leído de otro proyecto, y reescribe cualquier
 * referencia cruzada que apuntara a esos ids (cuenta, escenarioIds,
 * cuentaIds...) — sin enumerar a mano cada campo que pueda contener un id: se
 * recorre el valor entero y se sustituye cualquier STRING que coincida
 * exactamente con un id antiguo. Colisionar con un id ajeno por casualidad de
 * texto libre es, en la práctica, imposible (el formato de `uid()` no es algo
 * que nadie teclee sin querer en un campo de texto).
 *
 * Sin este paso, importar "Gastos" desde otro proyecto traería referencias a
 * cuentas que solo existen allí — un id que no está en ningún sitio de este
 * proyecto, y que la vista de gastos no sabría mostrar. Importando también las
 * colecciones de las que dependen (p. ej. Cuentas junto con Gastos) el mapa de
 * ids cubre esas referencias igual que las de la propia colección.
 */
export function remapearIds(colecciones: Record<string, unknown[]>): Record<string, unknown[]> {
  const mapa = new Map<string, string>();
  for (const items of Object.values(colecciones)) {
    for (const item of items) {
      const id = (item as { _id?: unknown } | null)?._id;
      if (typeof id === 'string' && !mapa.has(id)) mapa.set(id, uid());
    }
  }

  function reescribir(valor: unknown): unknown {
    if (typeof valor === 'string') return mapa.get(valor) ?? valor;
    if (Array.isArray(valor)) return valor.map(reescribir);
    if (valor && typeof valor === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(valor)) out[k] = reescribir(v);
      return out;
    }
    return valor;
  }

  const out: Record<string, unknown[]> = {};
  for (const [col, items] of Object.entries(colecciones)) out[col] = items.map(reescribir);
  return out;
}
