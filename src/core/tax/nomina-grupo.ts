// ── core/tax/nomina-grupo ─────────────────────────────────────────────────────
// IRPF de las nóminas de un mismo grupo (pagador conjunto).
//
// Un "grupo de nóminas" son varias percepciones que tributan juntas: las
// reducciones (Seguridad Social, art. 19.2, art. 20) se aplican sobre el total
// del grupo, no nómina a nómina, y el tipo que soporta cada una depende de las
// que se le apilan debajo. Por eso una segunda nómina pequeña puede tributar al
// tipo marginal del conjunto y no al suyo propio.
//
// Esta aritmética vivía duplicada tres veces dentro de la vista legacy
// (`nominas/nominas.js`): en el total del grupo, en cada fila y en un
// `irpfMarginal` que ni siquiera llegaba a llamarse. Aquí está una sola vez y
// con tests.

import { calcBaseImponibleTrabajo, calcIRPF, type Tramos } from './irpf';

/** Cotización del empleado por defecto (contingencias comunes + desempleo + FP). */
export const SS_PCT_DEFECTO = 6.35;

export interface ComponenteFlexibleLike {
  importe?: number;
}

export interface NominaGrupoLike {
  _id: string;
  bruto?: number;
  nPagas?: number;
  irpfModo?: 'auto' | 'manual' | string;
  irpfPct?: number;
  ssPct?: number;
  retribucionFlexible?: ComponenteFlexibleLike[];
}

/** Retribución flexible anualizada (se configura como importe mensual). */
export function flexAnual(n: NominaGrupoLike): number {
  return (n.retribucionFlexible || []).reduce((s, c) => s + (c.importe || 0) * 12, 0);
}

/**
 * Parte dineraria del bruto: lo que queda tras la retribución flexible, que
 * está exenta de IRPF y de cotización.
 */
export function baseDineraria(n: NominaGrupoLike): number {
  return Math.max(0, (n.bruto || 0) - flexAnual(n));
}

/**
 * Orden de apilamiento dentro del grupo: de mayor a menor bruto. El desempate
 * por `_id` es deliberado — sin él, dos nóminas con el mismo bruto se apilaban
 * cada una "por debajo" de la otra y la suma de las filas no cuadraba con el
 * total del grupo (ver nota en `irpfNomina`).
 */
function ordenApilado(grupo: NominaGrupoLike[]): NominaGrupoLike[] {
  return [...grupo].sort((a, b) => (b.bruto || 0) - (a.bruto || 0) || String(a._id).localeCompare(String(b._id)));
}

/** Reparto de la base imponible del grupo, proporcional a la parte dineraria. */
function imponiblePorNomina(grupo: NominaGrupoLike[]): Map<string, number> {
  const totalBruto = grupo.reduce((s, n) => s + (n.bruto || 0), 0);
  const totalFlex = grupo.reduce((s, n) => s + flexAnual(n), 0);
  const totalDinerario = Math.max(0, totalBruto - totalFlex);
  const imponibleGrupo = calcBaseImponibleTrabajo(totalBruto, totalFlex);

  const out = new Map<string, number>();
  for (const n of grupo) {
    out.set(n._id, totalDinerario > 0 ? imponibleGrupo * (baseDineraria(n) / totalDinerario) : 0);
  }
  return out;
}

/**
 * IRPF anual de UNA nómina.
 *
 * · modo manual → el porcentaje que haya fijado el usuario sobre la parte
 *   dineraria (la flexible está exenta);
 * · sin grupo → tributa sola, con sus propias reducciones;
 * · con grupo → tramo marginal: se calcula el impuesto del grupo hasta ella y
 *   se le resta el de las que se le apilan debajo.
 *
 * La suma de todas las nóminas de un grupo es exactamente `irpfGrupo` — hay un
 * test que lo fija, incluido el caso de brutos empatados, donde la vista legacy
 * se quedaba corta porque su filtro `> bruto` descartaba a los empatados.
 */
export function irpfNomina(nomina: NominaGrupoLike, grupo: NominaGrupoLike[] | null, tramos: Tramos): number {
  if (nomina.irpfModo === 'manual') return baseDineraria(nomina) * ((nomina.irpfPct || 0) / 100);

  if (!grupo || grupo.length === 0) {
    return calcIRPF(calcBaseImponibleTrabajo(nomina.bruto || 0, flexAnual(nomina)), tramos);
  }

  // Solo las de modo automático comparten el apilado: una manual no consume
  // tramo del resto, se calcula por su cuenta.
  const automaticas = ordenApilado(grupo.filter((n) => n.irpfModo !== 'manual'));
  const imponibles = imponiblePorNomina(grupo);

  let acumulado = 0;
  for (const n of automaticas) {
    const propio = imponibles.get(n._id) ?? 0;
    if (n._id === nomina._id) return calcIRPF(acumulado + propio, tramos) - calcIRPF(acumulado, tramos);
    acumulado += propio;
  }
  // No estaba en el grupo: se trata como independiente
  return calcIRPF(calcBaseImponibleTrabajo(nomina.bruto || 0, flexAnual(nomina)), tramos);
}

/** IRPF anual del grupo completo. */
export function irpfGrupo(grupo: NominaGrupoLike[], tramos: Tramos): number {
  return grupo.reduce((s, n) => s + irpfNomina(n, grupo, tramos), 0);
}

export interface DesgloseNomina {
  brutoAnual: number;
  flexAnual: number;
  /** Bruto menos retribución flexible: la base de IRPF y de cotización. */
  baseDineraria: number;
  nPagas: number;
  ssPct: number;
  ssAnual: number;
  irpfAnual: number;
  /** Tipo efectivo sobre la parte dineraria. */
  irpfPct: number;
  netoPorPaga: number;
}

/** Todo lo que la vista necesita de una nómina, en una sola pasada. */
export function desgloseNomina(nomina: NominaGrupoLike, grupo: NominaGrupoLike[] | null, tramos: Tramos): DesgloseNomina {
  const brutoAnual = nomina.bruto || 0;
  const flex = flexAnual(nomina);
  const base = Math.max(0, brutoAnual - flex);
  const nPagas = nomina.nPagas || 12;
  const ssPct = nomina.ssPct ?? SS_PCT_DEFECTO;
  const ssAnual = base * (ssPct / 100);
  const irpfAnual = irpfNomina(nomina, grupo, tramos);

  return {
    brutoAnual,
    flexAnual: flex,
    baseDineraria: base,
    nPagas,
    ssPct,
    ssAnual,
    irpfAnual,
    irpfPct: base > 0 ? (irpfAnual / base) * 100 : 0,
    netoPorPaga: (base - ssAnual - irpfAnual) / nPagas,
  };
}

/** Agrupa por `grupoNomina`; la cadena vacía significa "sin grupo". */
export function agruparNominas<T extends NominaGrupoLike & { grupoNomina?: string }>(
  nominas: T[],
): { grupos: Map<string, T[]>; sueltas: T[] } {
  const grupos = new Map<string, T[]>();
  const sueltas: T[] = [];
  for (const n of nominas) {
    const g = n.grupoNomina || '';
    if (!g) {
      sueltas.push(n);
      continue;
    }
    const lista = grupos.get(g) ?? [];
    lista.push(n);
    grupos.set(g, lista);
  }
  return { grupos, sueltas };
}
