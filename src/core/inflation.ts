// ── core/inflation ────────────────────────────────────────────────────────────
// Inflación por periodos anuales [{year, tasa%}]. Paridad exacta con
// FinanceMath (calcFactorInflacion, calcInflacionMediaAnual, Fisher, deflactor).

import { diasEntre, parseLocalDate, type ISODate } from './dates';

export interface PeriodoInflacion {
  _id?: string;
  year: number;
  tasa: number; // % anual
}

/**
 * Factor de inflación compuesta entre fromDate y toDate, prorrateando por días
 * (año de 365,25 días) y usando la tasa del registro más reciente ≤ año.
 * toDate ≤ fromDate o sin periodos → 1.
 */
export function calcFactorInflacion(periodos: PeriodoInflacion[] | null | undefined, fromDate: ISODate, toDate: ISODate): number {
  if (!periodos || periodos.length === 0) return 1;
  const from = parseLocalDate(fromDate);
  const to = parseLocalDate(toDate);
  if (to <= from) return 1;

  const sorted = [...periodos].sort((a, b) => a.year - b.year);
  let factor = 1;
  let current = new Date(from);

  while (current < to) {
    const year = current.getFullYear();
    const candidates = sorted.filter((r) => r.year <= year);
    const record = candidates.length > 0 ? candidates[candidates.length - 1] : sorted[0];
    const tasa = (record ? record.tasa : 0) / 100;

    const yearEnd = new Date(year + 1, 0, 1);
    const periodEnd = yearEnd < to ? yearEnd : to;

    const dias = diasEntre(current, periodEnd);
    factor *= Math.pow(1 + tasa, dias / 365.25);
    current = periodEnd;
  }
  return factor;
}

/** Tasa media anual ponderada por días entre fromDate y toDate. */
export function calcInflacionMediaAnual(
  periodos: PeriodoInflacion[] | null | undefined,
  fromDate: ISODate,
  toDate: ISODate,
  defaultInflacion = 0,
): number {
  const from = parseLocalDate(fromDate);
  const to = parseLocalDate(toDate);
  if (to <= from) return defaultInflacion;

  const totalDias = diasEntre(from, to);
  const sorted = periodos ? [...periodos].sort((a, b) => a.year - b.year) : [];
  let weightedSum = 0;
  let current = new Date(from);

  while (current < to) {
    const year = current.getFullYear();
    const yearEnd = new Date(year + 1, 0, 1);
    const segEnd = yearEnd < to ? yearEnd : to;
    const dias = diasEntre(current, segEnd);

    const candidates = sorted.filter((r) => r.year <= year);
    const record = candidates.length > 0 ? candidates[candidates.length - 1] : null;
    const tasa = record !== null ? record.tasa : defaultInflacion;

    weightedSum += tasa * dias;
    current = segEnd;
  }
  return totalDias > 0 ? weightedSum / totalDias : defaultInflacion;
}

/** Tipo de interés real (ecuación de Fisher), en %. */
export function calcTipoRealFisher(nominalPct: number, inflacionPct: number): number {
  return ((1 + nominalPct / 100) / (1 + inflacionPct / 100) - 1) * 100;
}

/** Deflacta un importe nominal a euros de fromDate. */
export function ajustarPrecioReal(
  importe: number,
  periodos: PeriodoInflacion[] | null | undefined,
  fromDate: ISODate,
  toDate: ISODate,
): number {
  const factor = calcFactorInflacion(periodos, fromDate, toDate);
  return factor > 0 ? importe / factor : importe;
}
