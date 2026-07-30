// ── accounting/tags ───────────────────────────────────────────────────────────
// Servicio de etiquetas compartido (F4, tarea 4.2).
//
// Las etiquetas no son una colección aparte: se derivan del uso. Lo que este
// servicio garantiza es que **estimaciones y contabilidad comparten el mismo
// espacio de nombres**: un tag creado al registrar un gasto real aparece en el
// autocompletado de las estimaciones y al revés, y renombrar o fusionar actúa
// sobre las dos colecciones a la vez (y sobre las agrupaciones de la config).

import type { AppConfig, AppState } from '@/state/schema';

/** Claves del estado donde viven etiquetas. */
type TagKey = 'expenses' | 'transacciones' | 'loans' | 'nominas' | 'config';

export interface TagStoreLike {
  get<K extends TagKey>(key: K): AppState[K];
  set<K extends Exclude<TagKey, 'config'>>(key: K, value: AppState[K]): void;
  patchConfig(patch: Partial<AppConfig>): void;
}

export interface UsoTag {
  tag: string;
  /** Nº de estimaciones (gastos/ingresos previstos) que lo usan. */
  estimaciones: number;
  /** Nº de transacciones reales que lo usan. */
  reales: number;
  total: number;
}

/** Normaliza un tag: sin espacios sobrantes y en minúsculas. */
export function normalizarTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function createTagService(store: TagStoreLike) {
  /** Uso de cada etiqueta en ambos mundos, ordenado por uso total. */
  function uso(): UsoTag[] {
    const mapa = new Map<string, UsoTag>();
    const anota = (tag: string, campo: 'estimaciones' | 'reales') => {
      const clave = normalizarTag(tag);
      if (!clave) return;
      const actual = mapa.get(clave) ?? { tag: clave, estimaciones: 0, reales: 0, total: 0 };
      actual[campo] += 1;
      actual.total += 1;
      mapa.set(clave, actual);
    };
    for (const e of store.get('expenses')) for (const t of e.tags ?? []) anota(t, 'estimaciones');
    for (const t of store.get('transacciones')) for (const tag of t.tags ?? []) anota(tag, 'reales');
    return [...mapa.values()].sort((a, b) => b.total - a.total || a.tag.localeCompare(b.tag));
  }

  /** Todas las etiquetas conocidas (para autocompletado). */
  function todas(): string[] {
    return uso().map((u) => u.tag);
  }

  /** Etiquetas que solo existen en un lado, útil para detectar descuadres. */
  function soloEn(lado: 'estimaciones' | 'reales'): string[] {
    return uso()
      .filter((u) => (lado === 'estimaciones' ? u.reales === 0 : u.estimaciones === 0))
      .map((u) => u.tag);
  }

  function reemplazarEnLista(tags: string[] | undefined, de: string, a: string | null): string[] {
    const origen = normalizarTag(de);
    const lista = (tags ?? []).map(normalizarTag);
    if (!lista.includes(origen)) return tags ?? [];
    const sinOrigen = lista.filter((t) => t !== origen);
    if (a === null) return [...new Set(sinOrigen)];
    return [...new Set([...sinOrigen, normalizarTag(a)])];
  }

  /**
   * Renombra una etiqueta en TODAS las colecciones que la usan (estimaciones,
   * transacciones, préstamos, nóminas) y en las agrupaciones de la config.
   * Si el destino ya existe en un item, el resultado se deduplica — es decir,
   * renombrar sobre un tag existente equivale a fusionar.
   */
  function renombrar(de: string, a: string): { cambiados: number } {
    const destino = normalizarTag(a);
    if (!destino) throw new Error('El nuevo nombre de la etiqueta no puede estar vacío');
    return aplicar(de, destino);
  }

  /** Fusiona varias etiquetas en una sola. */
  function fusionar(origenes: string[], destino: string): { cambiados: number } {
    let cambiados = 0;
    for (const origen of origenes) {
      if (normalizarTag(origen) === normalizarTag(destino)) continue;
      cambiados += aplicar(origen, normalizarTag(destino)).cambiados;
    }
    return { cambiados };
  }

  /** Elimina una etiqueta de todos los items que la usan. */
  function eliminar(tag: string): { cambiados: number } {
    return aplicar(tag, null);
  }

  function aplicar(de: string, a: string | null): { cambiados: number } {
    let cambiados = 0;

    const expenses = store.get('expenses').map((e) => {
      const tags = reemplazarEnLista(e.tags, de, a);
      if (tags !== e.tags) cambiados += 1;
      return tags === e.tags ? e : { ...e, tags };
    });
    store.set('expenses', expenses);

    const transacciones = store.get('transacciones').map((t) => {
      const tags = reemplazarEnLista(t.tags, de, a);
      if (tags !== t.tags) cambiados += 1;
      return tags === t.tags ? t : { ...t, tags };
    });
    store.set('transacciones', transacciones);

    const loans = store.get('loans').map((l) => {
      const tags = reemplazarEnLista(l.tags, de, a);
      if (tags !== l.tags) cambiados += 1;
      return tags === l.tags ? l : { ...l, tags };
    });
    store.set('loans', loans);

    const nominas = store.get('nominas').map((n) => {
      const tags = reemplazarEnLista(n.tags, de, a);
      if (tags !== n.tags) cambiados += 1;
      return tags === n.tags ? n : { ...n, tags };
    });
    store.set('nominas', nominas);

    // Agrupaciones y filtros guardados en config
    const config = store.get('config');
    const origen = normalizarTag(de);
    const mapCfg = (lista: string[] | undefined): string[] => {
      const actual = (lista ?? []).map(normalizarTag);
      if (!actual.includes(origen)) return lista ?? [];
      const sin = actual.filter((t) => t !== origen);
      return a === null ? [...new Set(sin)] : [...new Set([...sin, a])];
    };
    const patch: Partial<AppConfig> = {};
    const nuevosFiltros = mapCfg(config.activeTagsFilter);
    const nuevasCategorias = mapCfg(config.tagCategorias);
    const nuevosGrupos = mapCfg(config.tagGrupos);
    if (nuevosFiltros !== config.activeTagsFilter) patch.activeTagsFilter = nuevosFiltros;
    if (nuevasCategorias !== config.tagCategorias) patch.tagCategorias = nuevasCategorias;
    if (nuevosGrupos !== config.tagGrupos) patch.tagGrupos = nuevosGrupos;
    if (Object.keys(patch).length > 0) store.patchConfig(patch);

    return { cambiados };
  }

  return { uso, todas, soloEn, renombrar, fusionar, eliminar };
}

export type TagService = ReturnType<typeof createTagService>;
