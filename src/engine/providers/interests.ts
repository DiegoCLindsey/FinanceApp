// ── engine/providers/interests ────────────────────────────────────────────────
// Interés de cuentas remuneradas con saldo dinámico por periodo: recibe el
// resto de eventos proyectados (SIN intereses) y calcula el saldo medio de
// cada periodo de cobro. Paridad exacta con FinanceMath.proyectarInteresesCuentas.

import { formatLocalDate, parseLocalDate } from '@/core/dates';
import { saldoEnFecha, type AccountLike } from '@/core/accounts';
import type { AccountFilter, CashEvent, DateRange } from '../types';

export interface InterestAccount extends AccountLike {
  _id: string;
  nombre: string;
  activo?: boolean;
  interes?: number; // % anual
  periodoCobro?: 'diario' | 'semanal' | 'mensual' | string;
}

export function proyectarInteresesCuentas(
  accounts: InterestAccount[],
  range: DateRange,
  filtroAccounts: AccountFilter = null,
  extractoSinIntereses: CashEvent[] = [],
): CashEvent[] {
  const events: CashEvent[] = [];
  for (const acc of accounts) {
    if (!acc.activo || !acc.interes || acc.interes <= 0) continue;
    if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(acc._id)) continue;
    const dS = parseLocalDate(range.start);
    const dE = parseLocalDate(range.end);
    const periodoCobro = acc.periodoCobro || 'mensual';
    const isMonthly = periodoCobro === 'mensual';
    // Mensual: aritmética de calendario (evita drift de 30,44 días);
    // diario/semanal: ms fijos.
    const periodoMsFixed = isMonthly ? null : ({ diario: 86400000, semanal: 7 * 86400000 } as Record<string, number>)[periodoCobro] || 86400000;
    const paFijo = isMonthly ? 1 / 12 : (periodoMsFixed as number) / (365.25 * 86400000);

    let saldoCuenta = saldoEnFecha(acc, range.start);

    const movsCuenta = extractoSinIntereses
      .filter((e) => e.cuenta === acc._id)
      .map((e) => ({ fecha: e.fecha, delta: e.tipo === 'ingreso' ? Math.abs(e.cuantia) : -Math.abs(e.cuantia) }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    let movIdx = 0;
    let d = new Date(dS);

    while (d <= dE) {
      const dNext = isMonthly
        ? new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
        : new Date(d.getTime() + (periodoMsFixed as number));
      const periodoFin = new Date(Math.min(dNext.getTime(), dE.getTime() + 1));
      const periodoFinStr = formatLocalDate(periodoFin);

      let deltaTotal = 0;
      while (movIdx < movsCuenta.length && movsCuenta[movIdx].fecha < periodoFinStr) {
        deltaTotal += movsCuenta[movIdx].delta;
        movIdx++;
      }

      const saldoInicio = saldoCuenta;
      const saldoFin = saldoCuenta + deltaTotal;
      const saldoMedio = Math.max(0, (saldoInicio + saldoFin) / 2);
      saldoCuenta = saldoFin;

      const pa = isMonthly ? paFijo : (periodoFin.getTime() - d.getTime()) / (365.25 * 86400000);
      const ip = saldoMedio * (Math.pow(1 + acc.interes / 100, pa) - 1);
      if (ip > 0.001) {
        events.push({
          fecha: formatLocalDate(d),
          concepto: `Interés ${acc.nombre}`,
          cuantia: ip,
          tipo: 'ingreso',
          tags: ['interes', 'cuenta'],
          cuenta: acc._id,
          sourceId: acc._id,
          sourceType: 'account-interest',
        });
      }
      d = dNext;
    }
  }
  return events;
}
