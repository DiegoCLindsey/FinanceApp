// ── engine/providers/expenses ─────────────────────────────────────────────────
// Proyección de gastos/ingresos recurrentes (no transferencias).
// Paridad exacta con FinanceMath.proyectarGastos (tests/core/engine.test.ts).

import { formatLocalDate, parseLocalDate, resolverDiaEfectivo, type DiaPago, type ISODate } from '@/core/dates';
import type { AccountFilter, CashEvent, DateRange } from '../types';

export interface HistorialPrecio {
  fecha: ISODate;
  cuantia: number;
}

export interface ExpenseLike {
  _id: string;
  concepto: string;
  cuantia: number;
  tipo: 'gasto' | 'ingreso' | 'transferencia' | string;
  tipoFrecuencia: 'mensual' | 'diaria' | 'extraordinario' | string;
  frecuencia?: number;
  fechaInicio?: ISODate;
  fechaFin?: ISODate | null;
  diaPago?: DiaPago;
  cuenta?: string;
  tags?: string[];
  activo?: boolean;
  historialPrecios?: HistorialPrecio[];
}

// Cuantía efectiva: media del año más reciente del historial de precios si
// existe, si no la configurada. (Se retirará en F4 — docs/02, tarea 4.8.)
export function cuantiaEfectiva(exp: ExpenseLike): number {
  const hist = (exp.historialPrecios || []).filter((h) => h.cuantia > 0);
  if (!hist.length) return exp.cuantia;
  const sorted = [...hist].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const lastYear = parseLocalDate(sorted[0].fecha).getFullYear();
  const entries = sorted.filter((h) => parseLocalDate(h.fecha).getFullYear() === lastYear);
  if (!entries.length) return exp.cuantia;
  return entries.reduce((s, h) => s + h.cuantia, 0) / entries.length;
}

export function proyectarGastos(expenses: ExpenseLike[], range: DateRange, filtroAccounts: AccountFilter = null): CashEvent[] {
  const events: CashEvent[] = [];
  const dS = parseLocalDate(range.start);
  const dE = parseLocalDate(range.end);
  for (const exp of expenses) {
    if (!exp.activo) continue;
    if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(exp.cuenta || 'default')) continue;
    const dI = parseLocalDate(exp.fechaInicio || range.start);
    const dF = exp.fechaFin ? parseLocalDate(exp.fechaFin) : dE;
    const cuantia = cuantiaEfectiva(exp);
    const push = (fecha: ISODate) =>
      events.push({
        fecha,
        concepto: exp.concepto,
        cuantia,
        tipo: exp.tipo as 'gasto' | 'ingreso',
        tags: exp.tags || [],
        cuenta: exp.cuenta || 'default',
        sourceId: exp._id,
        sourceType: 'expense',
      });

    if (exp.tipoFrecuencia === 'extraordinario') {
      if (dI >= dS && dI <= dE && dI <= dF) push(exp.fechaInicio!);
    } else if (exp.tipoFrecuencia === 'mensual') {
      const freq = Math.max(1, exp.frecuencia || 1);
      let year = dI.getFullYear();
      let month = dI.getMonth();
      const maxIter = Math.ceil(240 / freq) + 2; // límite de seguridad: 20 años
      for (let iter = 0; iter < maxIter; iter++) {
        const fechaEfectiva =
          resolverDiaEfectivo(year, month, exp.diaPago || '') ||
          (() => {
            const dayOfMonth = dI.getDate();
            const lastDay = new Date(year, month + 1, 0).getDate();
            return formatLocalDate(new Date(year, month, Math.min(dayOfMonth, lastDay)));
          })();
        const dEfect = parseLocalDate(fechaEfectiva);
        if (dEfect > dE || dEfect > dF) break;
        if (dEfect >= dS && dEfect >= dI) push(fechaEfectiva);
        month += freq;
        if (month >= 12) {
          year += Math.floor(month / 12);
          month = month % 12;
        }
      }
    } else if (exp.tipoFrecuencia === 'diaria') {
      const stepMs = Math.max(1, exp.frecuencia || 1) * 86400000;
      let d = new Date(Math.max(dI.getTime(), dS.getTime()));
      if (dI < dS) {
        const steps = Math.ceil((dS.getTime() - dI.getTime()) / stepMs);
        d = new Date(dI.getTime() + steps * stepMs);
      }
      while (d <= dE && d <= dF) {
        push(formatLocalDate(d));
        d = new Date(d.getTime() + stepMs);
      }
    }
  }
  return events;
}
