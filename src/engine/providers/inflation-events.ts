// ── engine/providers/inflation-events ─────────────────────────────────────────
// Eventos mensuales derivados de la inflación por periodos: incremento del
// coste de vida de la cesta de gastos mensuales y erosión del ahorro.
// Paridad exacta con FinanceMath.proyectarInflacionGastos / proyectarPerdidaAhorro.

import { formatLocalDate, parseLocalDate, todayISO } from '@/core/dates';
import { calcFactorInflacion, type PeriodoInflacion } from '@/core/inflation';
import { cuantiaEfectiva, type ExpenseLike } from './expenses';
import type { AccountFilter, CashEvent, DateRange } from '../types';

/** Gasto incremental mensual por encarecimiento de la cesta respecto a su precio base. */
export function proyectarInflacionGastos(
  expenses: ExpenseLike[],
  inflacionPeriodos: PeriodoInflacion[],
  range: DateRange,
  filtroAccounts: AccountFilter = null,
  principalCuenta = 'default',
): CashEvent[] {
  const events: CashEvent[] = [];
  if (!inflacionPeriodos || inflacionPeriodos.length === 0) return events;
  const dS = parseLocalDate(range.start);
  const dE = parseLocalDate(range.end);
  const hoyStr = todayISO();
  const gastosMensuales = expenses.filter((e) => e.activo && e.tipo === 'gasto' && e.tipoFrecuencia === 'mensual');
  let d = new Date(dS.getFullYear(), dS.getMonth(), 1);
  while (d <= dE) {
    const year = d.getFullYear();
    const month = d.getMonth();
    const mesLabel = year + '-' + String(month + 1).padStart(2, '0');
    const mesIni = mesLabel + '-01';
    const mesFin = formatLocalDate(new Date(year, month + 1, 0));
    const mesMid = formatLocalDate(new Date(year, month, 15));
    let totalInflacion = 0;
    for (const exp of gastosMensuales) {
      if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(exp.cuenta || 'default')) continue;
      if (exp.fechaInicio && exp.fechaInicio > mesFin) continue;
      if (exp.fechaFin && exp.fechaFin < mesIni) continue;
      const base = exp.fechaInicio || hoyStr;
      const factor = calcFactorInflacion(inflacionPeriodos, base, mesMid);
      if (factor <= 1) continue;
      const freq = Math.max(1, exp.frecuencia || 1);
      totalInflacion += (cuantiaEfectiva(exp) * (factor - 1)) / freq;
    }
    if (totalInflacion > 0.01) {
      events.push({
        fecha: mesMid,
        concepto: 'Incremento coste de vida',
        cuantia: totalInflacion,
        tipo: 'gasto',
        tags: ['inflacion'],
        cuenta: principalCuenta,
        sourceId: 'inflacion_vida_' + mesLabel,
        sourceType: 'inflacion',
      });
    }
    d = new Date(year, month + 1, 1);
  }
  return events;
}

/** Pérdida mensual de poder adquisitivo del saldo inicial. */
export function proyectarPerdidaAhorro(
  saldoInicial: number,
  inflacionPeriodos: PeriodoInflacion[],
  range: DateRange,
  principalCuenta = 'default',
): CashEvent[] {
  const events: CashEvent[] = [];
  if (!inflacionPeriodos || inflacionPeriodos.length === 0 || saldoInicial <= 0) return events;
  const dS = parseLocalDate(range.start);
  const dE = parseLocalDate(range.end);
  const sorted = [...inflacionPeriodos].sort((a, b) => a.year - b.year);
  let d = new Date(dS.getFullYear(), dS.getMonth(), 1);
  while (d <= dE) {
    const year = d.getFullYear();
    const month = d.getMonth();
    const mesLabel = year + '-' + String(month + 1).padStart(2, '0');
    const mesMid = formatLocalDate(new Date(year, month, 15));
    const candidates = sorted.filter((r) => r.year <= year);
    const record = candidates.length > 0 ? candidates[candidates.length - 1] : sorted[0];
    const tasaAnual = record ? record.tasa / 100 : 0;
    const tasaMensual = Math.pow(1 + tasaAnual, 1 / 12) - 1;
    const perdida = saldoInicial * tasaMensual;
    if (perdida > 0.01) {
      events.push({
        fecha: mesMid,
        concepto: 'Pérdida ahorro por inflación',
        cuantia: perdida,
        tipo: 'gasto',
        tags: ['inflacion'],
        cuenta: principalCuenta,
        sourceId: 'inflacion_ahorro_' + mesLabel,
        sourceType: 'inflacion',
      });
    }
    d = new Date(year, month + 1, 1);
  }
  return events;
}
