// ── accounting/cierre-mes ─────────────────────────────────────────────────────
// Cierre de mes: comparar lo que se estimó con lo que pasó de verdad.
//
// El bucle de la aplicación es estimar → vivir → registrar → comparar →
// ajustar. Estaba roto en «comparar»: había un panel de precisión, pero era una
// tabla permanente y agregada, no un MOMENTO. Sin un momento nadie compara, y
// sin comparar las estimaciones envejecen sin que nadie se entere.
//
// Este módulo responde a tres preguntas sobre un mes concreto:
//
//   1. ¿Cuánto me desvié en total?
//   2. ¿En qué me desvié? (por estimación, ordenado por lo que más duele)
//   3. ¿Qué gasté que no tenía previsto? — la pregunta que no se hacía nadie,
//      y donde suele estar la diferencia de verdad.
//
// Puro: entran datos, salen números. Sin DOM.

import { roundMoney } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { Expense, Transaccion } from '@/state/schema';
import type { Ledger } from './ledger';
import { estimadoDelMes, type PrecisionEstimacion } from './precision';
import { sugerirAjuste, type Sugerencia } from './adjust';

export interface FilaCierre {
  estimacionId: string;
  concepto: string;
  tags: string[];
  estimado: number;
  real: number;
  /** real − estimado. Positivo = se gastó de más. */
  desviacion: number;
  /** Sin ningún movimiento real ese mes. */
  sinMovimiento: boolean;
  /** Ajuste propuesto, si la desviación es sistemática y significativa. */
  sugerencia: Sugerencia | null;
}

export interface GrupoSinEstimacion {
  concepto: string;
  total: number;
  movimientos: number;
}

export interface CierreMes {
  mes: string; // 'YYYY-MM'
  /** Gasto previsto para el mes, sumando todas las estimaciones. */
  estimado: number;
  /** Gasto real del mes. */
  real: number;
  desviacion: number;
  ingresosReales: number;
  filas: FilaCierre[];
  /** Gasto real que no cuadra con ninguna estimación, agrupado por concepto. */
  sinEstimacion: GrupoSinEstimacion[];
  totalSinEstimacion: number;
  /** El mes no tiene ni un movimiento registrado. */
  vacio: boolean;
}

/** Primer y último día del mes, en ISO. */
export function rangoDelMes(mes: string): { desde: ISODate; hasta: ISODate } {
  const [y, m] = mes.split('-').map(Number);
  const ultimo = new Date(y, m, 0).getDate();
  return { desde: `${mes}-01`, hasta: `${mes}-${String(ultimo).padStart(2, '0')}` };
}

/** Mes anterior al de la fecha dada: el último que se puede cerrar. */
export function mesAnterior(hoy: ISODate): string {
  const [y, m] = hoy.slice(0, 7).split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Normaliza un concepto para agrupar: minúsculas, sin acentos ni dígitos. */
function claveConcepto(concepto: string): string {
  return concepto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Reparte cada movimiento entre las estimaciones, **como mucho una**.
 *
 * El analizador de precisión mira una estimación cada vez, así que le da igual
 * que un movimiento encaje con varias. Aquí no: si «Alquiler» y «Reforma baño»
 * comparten la etiqueta `vivienda`, el recibo del alquiler se contaría en las
 * dos filas y la suma de las filas ya no cuadraría con el gasto real del mes.
 * En una pantalla cuyo trabajo es cuadrar cifras, eso la invalida entera.
 *
 * Criterio, en este orden:
 *   1. la asignación explícita (`estimacionId`) manda siempre;
 *   2. si no la hay, gana la estimación que comparta MÁS etiquetas;
 *   3. a igualdad, la primera por id, para que el reparto sea estable entre
 *      repintados.
 *
 * Una estimación que ya tiene movimientos asignados a mano no compite por
 * etiqueta: se entiende que el usuario la lleva de forma explícita.
 */
function repartir(gastos: Transaccion[], deGasto: Expense[], tieneAsignadas: (id: string) => boolean): Map<string, Transaccion[]> {
  const porEstimacion = new Map<string, Transaccion[]>(deGasto.map((e) => [e._id, []]));
  const candidatas = deGasto.filter((e) => !tieneAsignadas(e._id) && (e.tags?.length ?? 0) > 0);

  for (const t of gastos) {
    if (t.estimacionId && porEstimacion.has(t.estimacionId)) {
      (porEstimacion.get(t.estimacionId) as Transaccion[]).push(t);
      continue;
    }
    if (t.estimacionId) continue; // asignada a una estimación que aquí no cuenta

    let mejor: Expense | null = null;
    let mejorComunes = 0;
    for (const e of candidatas) {
      const comunes = (e.tags ?? []).filter((tag) => t.tags.includes(tag)).length;
      if (comunes === 0) continue;
      if (comunes > mejorComunes || (comunes === mejorComunes && mejor && e._id < mejor._id)) {
        mejor = e;
        mejorComunes = comunes;
      }
    }
    if (mejor) (porEstimacion.get(mejor._id) as Transaccion[]).push(t);
  }

  return porEstimacion;
}

export interface OpcionesCierre {
  /** Análisis de precisión ya calculado, para no repetirlo. */
  analisis?: PrecisionEstimacion[];
  hoy?: ISODate;
}

/**
 * Cierra un mes: compara estimado con real y propone ajustes.
 *
 * Solo se consideran las estimaciones de tipo gasto: comparar la nómina con lo
 * que entró de verdad es otro problema (y otra pantalla).
 */
export function cerrarMes(ledger: Ledger, estimaciones: Expense[], mes: string, opciones: OpcionesCierre = {}): CierreMes {
  const { desde, hasta } = rangoDelMes(mes);
  const delMes = ledger.transacciones({ desde, hasta });

  const gastos = delMes.filter((t) => t.importeCts < 0);
  const ingresos = delMes.filter((t) => t.importeCts > 0);

  const deGasto = estimaciones.filter((e) => e.tipo === 'gasto' && e.activo !== false);
  const porId = new Map((opciones.analisis ?? []).map((a) => [a.estimacionId, a]));

  const conAsignadas = new Set(deGasto.filter((e) => ledger.transacciones({ estimacionId: e._id }).length > 0).map((e) => e._id));
  const reparto = repartir(gastos, deGasto, (id) => conAsignadas.has(id));

  const yaContadas = new Set<string>();

  const filas: FilaCierre[] = deGasto.map((exp) => {
    const suyas = reparto.get(exp._id) ?? [];
    for (const t of suyas) yaContadas.add(t._id);

    const real = roundMoney(suyas.reduce((s, t) => s + Math.abs(t.importeCts) / 100, 0));
    const estimado = roundMoney(estimadoDelMes(exp, mes));
    const analisis = porId.get(exp._id);

    return {
      estimacionId: exp._id,
      concepto: exp.concepto,
      tags: exp.tags ?? [],
      estimado,
      real,
      desviacion: roundMoney(real - estimado),
      sinMovimiento: suyas.length === 0,
      sugerencia: analisis ? sugerirAjuste(analisis, exp.cuantia, { hoy: opciones.hoy }) : null,
    };
  });

  // Lo que se gastó sin que ninguna estimación lo previera. Se agrupa por
  // concepto normalizado para que veinte compras del súper no salgan de una en
  // una, que es lo que hace ilegible una lista así.
  const grupos = new Map<string, GrupoSinEstimacion>();
  for (const t of gastos) {
    if (yaContadas.has(t._id)) continue;
    const k = claveConcepto(t.concepto);
    const g = grupos.get(k) ?? { concepto: t.concepto, total: 0, movimientos: 0 };
    g.total = roundMoney(g.total + Math.abs(t.importeCts) / 100);
    g.movimientos += 1;
    grupos.set(k, g);
  }
  const sinEstimacion = [...grupos.values()].sort((a, b) => b.total - a.total);

  const estimado = roundMoney(filas.reduce((s, f) => s + f.estimado, 0));
  const real = roundMoney(gastos.reduce((s, t) => s + Math.abs(t.importeCts) / 100, 0));

  return {
    mes,
    estimado,
    real,
    desviacion: roundMoney(real - estimado),
    ingresosReales: roundMoney(ingresos.reduce((s, t) => s + t.importeCts / 100, 0)),
    // Lo que más duele primero: la desviación mayor en valor absoluto.
    filas: filas.sort((a, b) => Math.abs(b.desviacion) - Math.abs(a.desviacion)),
    sinEstimacion,
    totalSinEstimacion: roundMoney(sinEstimacion.reduce((s, g) => s + g.total, 0)),
    vacio: delMes.length === 0,
  };
}

/** Meses con movimientos registrados, del más reciente al más antiguo. */
export function mesesConDatos(ledger: Ledger): string[] {
  const meses = new Set<string>();
  for (const t of ledger.transacciones()) meses.add(t.fecha.slice(0, 7));
  return [...meses].sort().reverse();
}
