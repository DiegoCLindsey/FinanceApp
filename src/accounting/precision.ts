// ── accounting/precision ──────────────────────────────────────────────────────
// Análisis de precisión de las estimaciones frente al gasto real y ajuste
// automático (F4, tareas 4.5, 4.6 y 4.7).
//
// Cómo se compara (decisiones explícitas, porque la precisión de los números es
// el requisito principal):
//   · Solo se comparan MESES CERRADOS con datos reales: un mes sin ninguna
//     transacción relacionada no cuenta como "he acertado 0", cuenta como "no
//     hay dato". Así una estimación nueva no aparece con 0 % de precisión.
//   · El importe estimado de un mes es lo que el motor proyecta para ese mes
//     (respeta frecuencias, día de pago y vigencia), no la cuantía nominal.
//   · precision = 100 − |real − estimado| / estimado × 100, acotada a [0, 100].
//     Si el estimado del mes es 0 y hay real, la precisión de ese mes es 0.
//   · La precisión agregada pondera por el importe estimado, de modo que un mes
//     de 500 € pesa más que uno de 5 € (evita que un mes marginal domine).

import { parseLocalDate, todayISO, type ISODate } from '@/core/dates';
import { roundMoney } from '@/core/money';
import { proyectarGastos, type ExpenseLike } from '@/engine/providers/expenses';
import type { Expense } from '@/state/schema';
import type { Ledger } from './ledger';

export interface MesComparado {
  mes: string; // 'YYYY-MM'
  estimado: number;
  real: number;
  desviacion: number; // real − estimado (con signo)
  precision: number; // 0..100
}

export interface PrecisionEstimacion {
  estimacionId: string;
  concepto: string;
  tags: string[];
  /** Meses cerrados con dato real, del más antiguo al más reciente. */
  meses: MesComparado[];
  estimadoTotal: number;
  realTotal: number;
  desviacionTotal: number;
  /** Precisión ponderada por importe estimado, 0..100. `null` si no hay datos. */
  precision: number | null;
  /** Media real mensual de los últimos meses comparables (base del ajuste). */
  mediaRealReciente: number | null;
  /** true si el real supera sistemáticamente al estimado. */
  infraestimada: boolean;
}

export interface PrecisionTag {
  tag: string;
  estimadoTotal: number;
  realTotal: number;
  desviacionTotal: number;
  precision: number | null;
  estimaciones: number;
}

export interface OpcionesPrecision {
  /** Nº de meses hacia atrás a considerar. Por defecto 12. */
  mesesHistorial?: number;
  /** Nº de meses recientes para la media del ajuste. Por defecto 3. */
  mesesMedia?: number;
  /** Hoy (inyectable para tests). */
  hoy?: ISODate;
}

/** Precisión de un mes: 100 − error relativo, acotada a [0, 100]. */
export function precisionMes(estimado: number, real: number): number {
  if (estimado === 0) return real === 0 ? 100 : 0;
  const error = Math.abs(real - estimado) / Math.abs(estimado);
  return Math.max(0, Math.min(100, (1 - error) * 100));
}

/** Primer día del mes anterior a `fecha`, en formato 'YYYY-MM'. */
function mesesCerrados(hoyISO: ISODate, cuantos: number): string[] {
  const hoy = parseLocalDate(hoyISO);
  const meses: string[] = [];
  // El mes en curso no está cerrado: se empieza en el anterior
  for (let i = 1; i <= cuantos; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return meses.reverse();
}

function rangoMes(mes: string): { inicio: ISODate; fin: ISODate } {
  const [y, m] = mes.split('-').map(Number);
  const fin = new Date(y, m, 0);
  return { inicio: `${mes}-01`, fin: `${mes}-${String(fin.getDate()).padStart(2, '0')}` };
}

/** Importe estimado que el motor proyecta para una estimación en un mes. */
function estimadoDelMes(exp: Expense, mes: string): number {
  const { inicio, fin } = rangoMes(mes);
  const eventos = proyectarGastos([exp as ExpenseLike], { start: inicio, end: fin });
  return eventos.reduce((s, e) => s + Math.abs(e.cuantia), 0);
}

export function createPrecisionAnalyzer(ledger: Ledger) {
  /**
   * Compara una estimación con sus transacciones reales relacionadas. Se
   * consideran relacionadas las transacciones con `estimacionId` igual a la
   * estimación; si no hay ninguna asignada explícitamente, se usan las que
   * comparten al menos una etiqueta con ella (más laxo, pero es lo que el
   * usuario espera cuando etiqueta sin asignar).
   */
  function analizarEstimacion(exp: Expense, opciones: OpcionesPrecision = {}): PrecisionEstimacion {
    const { mesesHistorial = 12, mesesMedia = 3, hoy = todayISO() } = opciones;

    const asignadas = ledger.transacciones({ estimacionId: exp._id });
    const usarTags = asignadas.length === 0 && (exp.tags?.length ?? 0) > 0;
    const relacionadas = usarTags ? ledger.transacciones({ tags: exp.tags }) : asignadas;

    const realPorMes = new Map<string, number>();
    for (const t of relacionadas) {
      const mes = t.fecha.slice(0, 7);
      realPorMes.set(mes, (realPorMes.get(mes) ?? 0) + Math.abs(t.importeCts) / 100);
    }

    const meses: MesComparado[] = [];
    for (const mes of mesesCerrados(hoy, mesesHistorial)) {
      const real = realPorMes.get(mes);
      if (real === undefined) continue; // sin dato real: no es un fallo, es un hueco
      const estimado = roundMoney(estimadoDelMes(exp, mes));
      meses.push({
        mes,
        estimado,
        real: roundMoney(real),
        desviacion: roundMoney(real - estimado),
        precision: precisionMes(estimado, real),
      });
    }

    const estimadoTotal = roundMoney(meses.reduce((s, m) => s + m.estimado, 0));
    const realTotal = roundMoney(meses.reduce((s, m) => s + m.real, 0));
    // Ponderada por importe estimado; si todo lo estimado es 0, media simple
    const pesoTotal = meses.reduce((s, m) => s + Math.abs(m.estimado), 0);
    const precision =
      meses.length === 0
        ? null
        : pesoTotal > 0
          ? meses.reduce((s, m) => s + m.precision * Math.abs(m.estimado), 0) / pesoTotal
          : meses.reduce((s, m) => s + m.precision, 0) / meses.length;

    const recientes = meses.slice(-mesesMedia);
    const mediaRealReciente = recientes.length > 0 ? roundMoney(recientes.reduce((s, m) => s + m.real, 0) / recientes.length) : null;

    return {
      estimacionId: exp._id,
      concepto: exp.concepto,
      tags: exp.tags ?? [],
      meses,
      estimadoTotal,
      realTotal,
      desviacionTotal: roundMoney(realTotal - estimadoTotal),
      precision,
      mediaRealReciente,
      infraestimada: realTotal > estimadoTotal,
    };
  }

  /** Analiza todas las estimaciones activas de tipo gasto/ingreso. */
  function analizarTodas(expenses: Expense[], opciones: OpcionesPrecision = {}): PrecisionEstimacion[] {
    return expenses
      .filter((e) => e.tipo !== 'transferencia')
      .map((e) => analizarEstimacion(e, opciones))
      .sort((a, b) => {
        // Primero las que tienen datos y peor precisión: son las accionables
        if (a.precision === null && b.precision === null) return a.concepto.localeCompare(b.concepto);
        if (a.precision === null) return 1;
        if (b.precision === null) return -1;
        return a.precision - b.precision;
      });
  }

  /** Precisión agregada por etiqueta, sobre los análisis individuales. */
  function analizarPorTag(analisis: PrecisionEstimacion[]): PrecisionTag[] {
    const acc = new Map<string, { estimado: number; real: number; pesoPrecision: number; peso: number; n: number }>();
    for (const a of analisis) {
      if (a.precision === null) continue;
      for (const tag of a.tags.length > 0 ? a.tags : ['sin_tag']) {
        const actual = acc.get(tag) ?? { estimado: 0, real: 0, pesoPrecision: 0, peso: 0, n: 0 };
        actual.estimado += a.estimadoTotal;
        actual.real += a.realTotal;
        actual.pesoPrecision += a.precision * Math.abs(a.estimadoTotal);
        actual.peso += Math.abs(a.estimadoTotal);
        actual.n += 1;
        acc.set(tag, actual);
      }
    }
    return [...acc.entries()]
      .map(([tag, v]) => ({
        tag,
        estimadoTotal: roundMoney(v.estimado),
        realTotal: roundMoney(v.real),
        desviacionTotal: roundMoney(v.real - v.estimado),
        precision: v.peso > 0 ? v.pesoPrecision / v.peso : null,
        estimaciones: v.n,
      }))
      .sort((a, b) => (a.precision ?? 101) - (b.precision ?? 101));
  }

  return { analizarEstimacion, analizarTodas, analizarPorTag };
}

export type PrecisionAnalyzer = ReturnType<typeof createPrecisionAnalyzer>;
