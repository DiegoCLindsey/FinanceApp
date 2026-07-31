// ── core/loan ─────────────────────────────────────────────────────────────────
// Préstamos: cuota (sistema francés), TAE (Newton-Raphson), tabla de
// amortización con amortizaciones parciales y resumen con caché.
// Paridad exacta con FinanceMath (tests de paridad en tests/core/loan.test.ts).
//
// Nota de paridad: el avance de meses usa Date#setMonth, que en fechas de fin
// de mes desborda (31 ene + 1 mes → 3 mar). Se conserva a propósito hasta que
// un golden test documente el cambio (docs/02-plan-refactor.md, principio 3).

import { ajustarFechaPago, formatLocalDate, parseLocalDate, type DiaPago, type ISODate } from './dates';

export interface Amortizacion {
  _id?: string;
  fecha: ISODate;
  cantidad: number;
  tipo?: 'plazo' | 'cuota' | string;
  simulacion?: boolean;
  /** Escenarios a los que pertenece; en F5 lo sustituyen los supuestos (diffs). */
  escenarioIds?: string[];
}

export interface LoanInput {
  capital: number;
  tin: number; // % anual
  meses: number;
  fechaInicio: ISODate;
  comisionApertura?: number; // % sobre capital
  comisionAmort?: number; // % sobre cantidad amortizada
  diaPago?: DiaPago;
  amortizaciones?: Amortizacion[];
}

export interface FilaAmortizacion {
  mes: number | 'AMORT';
  fecha: ISODate;
  cuota: number;
  interes: number;
  amortizacion: number;
  comisionAmort: number;
  capitalPendiente: number;
  esAmortizacion: boolean;
  simulacion: boolean;
}

export interface ResumenPrestamo {
  cuota: number;
  totalIntereses: number;
  tae: number;
  costoTotal: number;
  comAp: number;
  totalComAm: number;
  fechaFin: ISODate | '';
  mesesReales: number;
  tabla: FilaAmortizacion[];
}

/** Cuota mensual del sistema francés; con tipo 0 divide capital entre meses. */
export function cuotaMensual(capital: number, tinAnual: number, meses: number): number {
  const r = tinAnual / 100 / 12;
  if (r === 0) return capital / meses;
  return (capital * r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
}

/** TAE por Newton-Raphson incorporando la comisión de apertura. */
export function calcTAE(capital: number, tinAnual: number, meses: number, comApertura = 0): number {
  const cuota = cuotaMensual(capital, tinAnual, meses);
  const neto = capital * (1 - comApertura / 100);
  let r = tinAnual / 100 / 12;
  for (let i = 0; i < 200; i++) {
    const vp = (cuota * (1 - Math.pow(1 + r, -meses))) / r;
    const f = vp - neto;
    const df = cuota * ((meses * Math.pow(1 + r, -(meses + 1))) / r - (1 - Math.pow(1 + r, -meses)) / (r * r));
    const nr = r - f / df;
    if (Math.abs(nr - r) < 1e-10) {
      r = nr;
      break;
    }
    r = nr;
  }
  return (Math.pow(1 + r, 12) - 1) * 100;
}

/**
 * Tabla de amortización completa. Las amortizaciones parciales se intercalan
 * por fecha; tipo 'plazo' recalcula los meses restantes manteniendo la cuota,
 * cualquier otro tipo recalcula la cuota manteniendo el plazo.
 */
export function tablaAmortizacion(
  capital: number,
  tinAnual: number,
  meses: number,
  fechaInicio: ISODate,
  comAmort = 0,
  amortizaciones: Amortizacion[] = [],
  loan: Pick<LoanInput, 'diaPago'> = {},
): FilaAmortizacion[] {
  const rows: FilaAmortizacion[] = [];
  let cap = capital;
  const cur = parseLocalDate(fechaInicio);
  const r = tinAnual / 100 / 12;
  let mr = meses;
  let cuota = cuotaMensual(cap, tinAnual, mr);
  const amorts = [...amortizaciones].sort((a, b) => a.fecha.localeCompare(b.fecha));
  let ai = 0;
  for (let mes = 1; mes <= meses * 2 && cap > 0.01; mes++) {
    const fd = new Date(cur);
    cur.setMonth(cur.getMonth() + 1);
    const fs = ajustarFechaPago(formatLocalDate(fd), loan.diaPago || '');
    while (ai < amorts.length && amorts[ai].fecha <= fs) {
      const am = amorts[ai];
      const cost = am.cantidad * (comAmort / 100);
      cap -= am.cantidad;
      cap = Math.max(0, cap);
      if (am.tipo === 'plazo') {
        mr = Math.ceil(-Math.log(1 - (cap * r) / cuota) / Math.log(1 + r));
      } else {
        mr = meses - mes + 1;
        cuota = cuotaMensual(cap, tinAnual, mr);
      }
      rows.push({
        mes: 'AMORT',
        fecha: am.fecha,
        cuota: 0,
        interes: 0,
        amortizacion: am.cantidad,
        comisionAmort: cost,
        capitalPendiente: cap,
        esAmortizacion: true,
        simulacion: am.simulacion || false,
      });
      ai++;
      if (cap < 0.01) break;
    }
    if (cap < 0.01) break;
    const int = cap * r;
    const am = Math.min(cuota - int, cap);
    cap -= am;
    if (cap < 0.01) cap = 0;
    rows.push({
      mes,
      fecha: fs,
      cuota,
      interes: int,
      amortizacion: am,
      comisionAmort: 0,
      capitalPendiente: cap,
      esAmortizacion: false,
      simulacion: false,
    });
    mr--;
    if (mr <= 0 || cap < 0.01) break;
  }
  return rows;
}

// Caché de resúmenes — clave determinista de todos los inputs (paridad con legacy).
const resumenCache = new Map<string, ResumenPrestamo>();

export function resumenPrestamo(loan: LoanInput): ResumenPrestamo {
  const amorts = loan.amortizaciones || [];
  const key = `${loan.capital}|${loan.tin}|${loan.meses}|${loan.fechaInicio}|${loan.comisionAmort || 0}|${loan.comisionApertura || 0}|${loan.diaPago || ''}|${amorts
    .slice()
    .sort((a, b) => `${a.fecha}|${a.cantidad}|${a.tipo || ''}`.localeCompare(`${b.fecha}|${b.cantidad}|${b.tipo || ''}`))
    .map((a) => `${a.fecha}:${a.cantidad}:${a.tipo || ''}`)
    .join(';')}`;
  const cached = resumenCache.get(key);
  if (cached) return cached;
  const { capital, tin, meses, fechaInicio, comisionAmort, comisionApertura } = loan;
  const tabla = tablaAmortizacion(capital, tin, meses, fechaInicio, comisionAmort || 0, amorts, loan);
  const totalIntereses = tabla.reduce((s, r) => s + r.interes, 0);
  const totalComAm = tabla.reduce((s, r) => s + r.comisionAmort, 0);
  const comAp = capital * ((comisionApertura || 0) / 100);
  const ordinarias = tabla.filter((r) => !r.esAmortizacion);
  const result: ResumenPrestamo = {
    cuota: cuotaMensual(capital, tin, meses),
    totalIntereses,
    tae: calcTAE(capital, tin, meses, comisionApertura || 0),
    costoTotal: totalIntereses + totalComAm + comAp,
    comAp,
    totalComAm,
    fechaFin: ordinarias.slice(-1)[0]?.fecha || '',
    mesesReales: ordinarias.length,
    tabla,
  };
  resumenCache.set(key, result);
  return result;
}

export interface ResumenPrestamoConAhorro extends ResumenPrestamo {
  /** Mismo préstamo sin ninguna amortización anticipada. */
  sinAmort: ResumenPrestamo;
  /** Intereses que se ahorran gracias a las amortizaciones. */
  ahorroIntereses: number;
  /** Meses que se acorta el préstamo (positivo = termina antes). */
  ahorroTiempo: number;
  /** Comisiones pagadas por amortizar. */
  costeTotalAmort: number;
  /** Ahorro de intereses menos el coste de amortizar. */
  ahorroNeto: number;
  /** Capital + intereses + comisión de apertura + comisiones de amortización. */
  totalPagado: number;
}

/**
 * Resumen con la comparativa contra el mismo préstamo sin amortizar, que es lo
 * que la vista necesita para enseñar cuánto aportan las amortizaciones.
 * Paridad exacta con FinanceMath.resumenPrestamoConAhorro.
 */
export function resumenPrestamoConAhorro(loan: LoanInput): ResumenPrestamoConAhorro {
  const base = resumenPrestamo(loan);
  const sinAmort = resumenPrestamo({ ...loan, amortizaciones: [] });
  const ahorroIntereses = sinAmort.totalIntereses - base.totalIntereses;
  const ahorroTiempo = sinAmort.mesesReales - base.mesesReales;
  const costeTotalAmort = base.totalComAm;
  return {
    ...base,
    sinAmort,
    ahorroIntereses,
    ahorroTiempo,
    costeTotalAmort,
    ahorroNeto: ahorroIntereses - costeTotalAmort,
    totalPagado: loan.capital + base.totalIntereses + base.comAp + base.totalComAm,
  };
}
