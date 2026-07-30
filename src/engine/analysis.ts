// ── engine/analysis ───────────────────────────────────────────────────────────
// Análisis sobre un extracto ya generado: puntos críticos, media mensual de
// gastos y desviación real vs estimado.
// Paridad exacta con FinanceMath (detectarPuntosCriticos, mediaMensualGastos,
// calcDesviacion).

import { parseLocalDate, todayISO, type ISODate } from '@/core/dates';
import { formatEUR } from '@/core/money';
import type { AccountLike } from '@/core/accounts';
import type { CashEvent } from './types';

export interface PuntoCritico {
  tipo: 'saldo_negativo' | 'bajo_colchon' | 'recuperacion_colchon';
  fecha: ISODate;
  saldo: number;
  mensaje: string;
}

/** Entradas en saldo negativo y cruces del colchón (colchon = 0 → solo negativos). */
export function detectarPuntosCriticos(extracto: CashEvent[], colchon: number): PuntoCritico[] {
  const pts: PuntoCritico[] = [];
  let dentroBajo = false;
  for (let i = 0; i < extracto.length; i++) {
    const ev = extracto[i];
    const saldo = ev.saldoAcum as number;
    if (saldo < 0 && (i === 0 || (extracto[i - 1].saldoAcum as number) >= 0)) {
      pts.push({
        tipo: 'saldo_negativo',
        fecha: ev.fecha,
        saldo,
        mensaje: `Saldo negativo (${formatEUR(saldo)}) a partir del ${ev.fecha}`,
      });
    }
    if (colchon > 0) {
      if (saldo < colchon && !dentroBajo) {
        dentroBajo = true;
        pts.push({
          tipo: 'bajo_colchon',
          fecha: ev.fecha,
          saldo,
          mensaje: `Saldo por debajo del colchón (${formatEUR(saldo)} < ${formatEUR(colchon)}) desde ${ev.fecha}`,
        });
      } else if (saldo >= colchon && dentroBajo) {
        dentroBajo = false;
        pts.push({
          tipo: 'recuperacion_colchon',
          fecha: ev.fecha,
          saldo,
          mensaje: `Recuperación del colchón el ${ev.fecha} (${formatEUR(saldo)})`,
        });
      }
    }
  }
  return pts;
}

/**
 * Media mensual de gastos del periodo (excluye amortizaciones).
 * Usa meses de 30,44 días: aproximación estadística, no aritmética de calendario.
 */
export function mediaMensualGastos(extracto: CashEvent[], config: { dashboardStart: ISODate; dashboardEnd: ISODate }): number {
  const totalGastos = extracto
    .filter((e) => e.tipo === 'gasto' && e.sourceType !== 'loan-amort')
    .reduce((s, e) => s + Math.abs(e.cuantia), 0);
  const dS = parseLocalDate(config.dashboardStart);
  const dE = parseLocalDate(config.dashboardEnd);
  const meses = Math.max(1, (dE.getTime() - dS.getTime()) / (30.44 * 86400000));
  return totalGastos / meses;
}

export interface FilaDesviacion {
  cuenta: string;
  fecha: ISODate;
  estimado: number;
  real: number;
  desv: number;
  pct: number;
}

/**
 * Desviación real vs estimado en cada fecha con punto de control conocido.
 * LOCF multi-cuenta: para cada fecha arrastra el último saldo conocido de cada
 * cuenta. En F4 el "real" pasará a derivarse del ledger de contabilidad.
 */
export function calcDesviacion(
  extracto: CashEvent[],
  accounts: (AccountLike & { _id?: string })[],
  hoyStr: ISODate = todayISO(),
): FilaDesviacion[] {
  const allDates = new Set<ISODate>();
  const dedupedByAcc = accounts.map((acc) => {
    const floor = acc.fechaInicialSaldo || '';
    const byD: Record<string, number> = {};
    if (floor && floor <= hoyStr) byD[floor] = acc.saldoInicial || 0;
    for (const h of acc.historicoSaldos || []) {
      if (h.fecha <= hoyStr && (!floor || h.fecha >= floor)) byD[h.fecha] = h.saldo;
    }
    Object.keys(byD).forEach((d) => allDates.add(d));
    return byD;
  });

  const byFecha: Record<string, number> = {};
  for (const fecha of [...allDates].sort()) {
    let total = 0;
    for (let ai = 0; ai < accounts.length; ai++) {
      const entries = Object.entries(dedupedByAcc[ai]).filter(([d]) => d <= fecha);
      if (entries.length > 0) {
        entries.sort(([a], [b]) => b.localeCompare(a));
        total += entries[0][1];
      } else {
        total += accounts[ai].saldoInicial || 0;
      }
    }
    byFecha[fecha] = total;
  }

  const rows: FilaDesviacion[] = [];
  for (const [fecha, saldoReal] of Object.entries(byFecha).sort(([a], [b]) => a.localeCompare(b))) {
    const ev = extracto.filter((e) => e.fecha <= fecha);
    const estimado = ev.length > 0 ? (ev[ev.length - 1].saldoAcum as number) : null;
    if (estimado === null) continue;
    const desv = saldoReal - estimado;
    const pct = estimado !== 0 ? (desv / Math.abs(estimado)) * 100 : 0;
    rows.push({ cuenta: 'Total', fecha, estimado, real: saldoReal, desv, pct });
  }
  return rows;
}
