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

import { parseLocalDate, todayISO, vigenteEnRango, type ISODate } from '@/core/dates';
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
  /** Media real mensual de los últimos meses comparables. */
  mediaRealReciente: number | null;
  /**
   * Cuánto se ha desviado el gasto real respecto a lo previsto en los últimos
   * meses comparables: real ÷ estimado. Es la base del ajuste, y no la media
   * mensual, porque `cuantia` es el importe DE CADA PAGO, no el del mes: en una
   * estimación semanal, meter la media mensual en `cuantia` la multiplicaba por
   * cuatro. Un factor no depende de la periodicidad. `null` si no hay nada
   * previsto con lo que comparar.
   */
  factorReciente: number | null;
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
  /**
   * Limita la comparación a un intervalo concreto (el de la cabecera). Si se
   * indican los dos, se ignora `mesesHistorial` y solo se comparan los meses
   * que caen dentro, RECORTADOS al intervalo: un intervalo que empieza el 15
   * de abril compara del 15 al 30, no abril entero, así que lo estimado sigue
   * siendo comparable con lo real.
   */
  desde?: ISODate;
  hasta?: ISODate;
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

/**
 * Meses cerrados que tocan el intervalo, del más antiguo al más reciente.
 *
 * El mes en curso sigue quedándose fuera aunque el intervalo lo incluya:
 * comparar medio mes vivido contra la estimación del mes entero no mide la
 * precisión, mide el día que es hoy.
 */
function mesesDelIntervalo(desde: ISODate, hasta: ISODate, hoyISO: ISODate): string[] {
  const ultimoCerrado = mesesCerrados(hoyISO, 1)[0];
  const fin = hasta.slice(0, 7) < ultimoCerrado ? hasta.slice(0, 7) : ultimoCerrado;
  const meses: string[] = [];
  let [y, m] = desde.slice(0, 7).split('-').map(Number);
  while (`${y}-${String(m).padStart(2, '0')}` <= fin) {
    meses.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return meses;
}

function rangoMes(mes: string): { inicio: ISODate; fin: ISODate } {
  const [y, m] = mes.split('-').map(Number);
  const fin = new Date(y, m, 0);
  return { inicio: `${mes}-01`, fin: `${mes}-${String(fin.getDate()).padStart(2, '0')}` };
}

/** Importe estimado que el motor proyecta para una estimación en un mes. */
/**
 * Lo que una estimación preveía para un mes concreto.
 *
 * Se exporta porque el cierre de mes necesita el estimado de un mes AUNQUE no
 * haya movimiento real: `analizarEstimacion` se salta esos meses a propósito
 * (un hueco no es un fallo de precisión), pero en un cierre «lo previsto que no
 * ha llegado» es justo lo que hay que enseñar.
 */
export function estimadoDelMes(exp: Expense, mes: string): number {
  const { inicio, fin } = rangoMes(mes);
  return estimadoEnRango(exp, inicio, fin);
}

/**
 * Lo mismo pero entre dos fechas cualesquiera, que pueden cruzar varios meses
 * o cortar uno por la mitad. No es sumar meses enteros: se le pide al motor la
 * proyección de ESE rango, así que un cierre del 15 de abril al 20 de junio
 * cuenta solo los pagos que caen dentro, no abril y junio completos.
 */
export function estimadoEnRango(exp: Expense, desde: ISODate, hasta: ISODate): number {
  const eventos = proyectarGastos([exp as ExpenseLike], { start: desde, end: hasta });
  return eventos.reduce((s, e) => s + Math.abs(e.cuantia), 0);
}

/**
 * ¿Estaba viva la estimación en ese mes?
 *
 * Un mes anterior al alta no es un 0 % de precisión: es un mes que no le tocaba
 * a esta estimación. Comparar ahí la ponía en 0 % y, peor, dejaba el ajuste
 * calculando sobre un previsto de cero. Pasa siempre que se ajusta una
 * estimación: la continuación empieza hoy y hereda las etiquetas, así que se
 * comería todo el gasto real anterior a su propia existencia.
 */
function vigenteEn(exp: Expense, mes: string): boolean {
  const { inicio, fin } = rangoMes(mes);
  return vigenteEnRango(exp.fechaInicio, exp.fechaFin, inicio, fin);
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
    const { mesesHistorial = 12, mesesMedia = 3, hoy = todayISO(), desde, hasta } = opciones;

    const asignadas = ledger.transacciones({ estimacionId: exp._id });
    const usarTags = asignadas.length === 0 && (exp.tags?.length ?? 0) > 0;
    const relacionadas = usarTags ? ledger.transacciones({ tags: exp.tags }) : asignadas;

    // Cada mes se compara sobre su trozo dentro del intervalo (el mes entero
    // cuando no hay intervalo), para que real y estimado midan lo mismo.
    const aComparar = desde && hasta ? mesesDelIntervalo(desde, hasta, hoy) : mesesCerrados(hoy, mesesHistorial);
    const rangos = new Map(
      aComparar.map((mes) => {
        const { inicio, fin } = rangoMes(mes);
        return [mes, { inicio: desde && desde > inicio ? desde : inicio, fin: hasta && hasta < fin ? hasta : fin }] as const;
      }),
    );

    const realPorMes = new Map<string, number>();
    for (const t of relacionadas) {
      const rango = rangos.get(t.fecha.slice(0, 7));
      if (!rango || t.fecha < rango.inicio || t.fecha > rango.fin) continue;
      const mes = t.fecha.slice(0, 7);
      realPorMes.set(mes, (realPorMes.get(mes) ?? 0) + Math.abs(t.importeCts) / 100);
    }

    const meses: MesComparado[] = [];
    for (const mes of aComparar) {
      const real = realPorMes.get(mes);
      if (real === undefined) continue; // sin dato real: no es un fallo, es un hueco
      if (!vigenteEn(exp, mes)) continue; // el mes es anterior al alta (o posterior a la baja)
      const rango = rangos.get(mes) as { inicio: ISODate; fin: ISODate };
      const estimado = roundMoney(estimadoEnRango(exp, rango.inicio, rango.fin));
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
    const estimadoReciente = recientes.reduce((s, m) => s + m.estimado, 0);
    const realReciente = recientes.reduce((s, m) => s + m.real, 0);
    const factorReciente = estimadoReciente > 0 ? realReciente / estimadoReciente : null;

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
      factorReciente,
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
