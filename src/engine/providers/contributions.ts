// ── engine/providers/contributions ────────────────────────────────────────────
// Aportaciones programadas (planAportaciones) a fondos de inversión y planes de
// pensiones: par gasto (cuenta origen) / ingreso (fondo destino).
// Paridad exacta con FinanceMath.proyectarAportaciones.

import { formatLocalDate, parseLocalDate, type ISODate } from '@/core/dates';
import { modeloFondoDe, type AccountLike } from '@/core/accounts';
import type { AccountFilter, CashEvent, DateRange } from '../types';

export interface PlanAportacion {
  _id: string;
  importe: number;
  periodicidad?: 'mensual' | 'trimestral' | 'semestral' | 'anual' | string;
  fechaInicio?: ISODate;
  fechaFin?: ISODate | null;
  cuentaOrigen?: string;
}

export interface ContributionAccount extends AccountLike {
  _id: string;
  nombre: string;
  activo?: boolean;
  planAportaciones?: PlanAportacion[];
}

export function proyectarAportaciones(
  accounts: ContributionAccount[],
  range: DateRange,
  filtroAccounts: AccountFilter = null,
): CashEvent[] {
  const events: CashEvent[] = [];
  const dS = parseLocalDate(range.start);
  const dE = parseLocalDate(range.end);
  for (const acc of accounts) {
    const modelo = modeloFondoDe(acc);
    if (modelo === 'cuenta' || !acc.activo) continue;
    const plan = acc.planAportaciones || [];
    for (const ap of plan) {
      if (!ap.importe || ap.importe <= 0) continue;
      const dI = parseLocalDate(ap.fechaInicio || range.start);
      const dF = ap.fechaFin ? parseLocalDate(ap.fechaFin) : dE;
      const origen = ap.cuentaOrigen || 'default';
      const addO = !filtroAccounts || !filtroAccounts.length || filtroAccounts.includes(origen);
      const addD = !filtroAccounts || !filtroAccounts.length || filtroAccounts.includes(acc._id);
      const tag = modelo === 'pension' ? 'pension' : 'capital-mobiliario';
      const pushAport = (fecha: ISODate) => {
        if (addO) events.push({ fecha, concepto: `Aportación → ${acc.nombre}`, cuantia: ap.importe, tipo: 'gasto', tags: ['aportacion', 'transferencia', tag], cuenta: origen, sourceId: ap._id, sourceType: 'aportacion-out' });
        if (addD) events.push({ fecha, concepto: `Aportación ${acc.nombre} (${ap.periodicidad || 'mensual'})`, cuantia: ap.importe, tipo: 'ingreso', tags: ['aportacion', 'transferencia', tag], cuenta: acc._id, sourceId: ap._id, sourceType: 'aportacion-in' });
      };
      const freq = ({ mensual: 1, trimestral: 3, semestral: 6, anual: 12 } as Record<string, number>)[ap.periodicidad || 'mensual'] || 1;
      let year = dI.getFullYear();
      let month = dI.getMonth();
      const maxIter = Math.ceil(240 / freq) + 2;
      for (let i = 0; i < maxIter; i++) {
        const maxDay = new Date(year, month + 1, 0).getDate();
        const fe = formatLocalDate(new Date(year, month, Math.min(dI.getDate(), maxDay)));
        const dE2 = parseLocalDate(fe);
        if (dE2 > dE || dE2 > dF) break;
        if (dE2 >= dS && dE2 >= dI) pushAport(fe);
        month += freq;
        if (month >= 12) {
          year += Math.floor(month / 12);
          month = month % 12;
        }
      }
    }
  }
  return events;
}
