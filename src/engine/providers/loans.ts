// ── engine/providers/loans ────────────────────────────────────────────────────
// Cuotas y amortizaciones parciales de préstamos, desde la tabla de amortización.
// Paridad exacta con FinanceMath.proyectarPrestamos.

import { resumenPrestamo, type LoanInput } from '@/core/loan';
import type { AccountFilter, CashEvent, DateRange } from '../types';

export interface LoanItem extends LoanInput {
  _id: string;
  nombre: string;
  activo?: boolean;
  cuenta?: string;
  tags?: string[];
  simulacion?: boolean;
}

export function proyectarPrestamos(loans: LoanItem[], range: DateRange, filtroAccounts: AccountFilter = null): CashEvent[] {
  const events: CashEvent[] = [];
  for (const loan of loans) {
    if (!loan.activo) continue;
    if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(loan.cuenta || 'default')) continue;
    const { tabla } = resumenPrestamo(loan);
    for (const row of tabla) {
      if (row.fecha >= range.start && row.fecha <= range.end) {
        if (!row.esAmortizacion) {
          events.push({
            fecha: row.fecha,
            concepto: `Cuota ${loan.nombre}`,
            cuantia: -row.cuota,
            tipo: 'gasto',
            tags: ['prestamo', ...(loan.tags || [])],
            cuenta: loan.cuenta || 'default',
            sourceId: loan._id,
            sourceType: 'loan',
            simulacion: loan.simulacion || false,
          });
        } else {
          events.push({
            fecha: row.fecha,
            concepto: `Amort. ${loan.nombre}`,
            cuantia: -(row.amortizacion + row.comisionAmort),
            tipo: 'gasto',
            tags: ['amortizacion', ...(loan.tags || [])],
            cuenta: loan.cuenta || 'default',
            sourceId: loan._id,
            sourceType: 'loan-amort',
            simulacion: row.simulacion || false,
          });
        }
      }
    }
  }
  return events;
}
