// ── core/tax/pension ──────────────────────────────────────────────────────────
// Planes de pensiones (disponible/bloqueado FIFO, impuesto de rescate, tipo
// marginal) y fondos de inversión (plusvalía latente). Paridad con FinanceMath,
// con dos diferencias de diseño deliberadas y verificadas en los tests:
// - `hoy` es inyectable (el legacy usa new Date() interno).
// - Los tramos se pasan explícitamente (el legacy los lee del State global; en
//   ausencia de State usa los defaults, que es contra lo que se verifica).

import { formatLocalDate, type ISODate } from '../dates';
import { modeloFondoDe, saldoRealCuenta, type AccountLike } from '../accounts';
import { calcGananciasCapital } from './ahorro';
import type { Tramos } from './irpf';

export interface NominaLike {
  _id?: string;
  bruto?: number;
  nPagas?: number;
  activo?: boolean;
  grupoNomina?: string;
  retribucionFlexible?: { importe: number }[];
}

export interface FondosPension {
  saldo: number;
  disponible: number;
  bloqueado: number;
  costBase: number;
  beneficio: number;
  numAportaciones: number;
  proxDesbloqueo: ISODate | null;
}

export interface FondoInversion {
  saldo: number;
  costBase: number;
  plusvalia: number;
  impuesto: number;
  neto: number;
}

/** Resumen fiscal de un fondo de inversión (plusvalía latente y neto tras impuesto). */
export function calcFondoInversion(acc: AccountLike, tramos: Tramos | null | undefined): FondoInversion | null {
  if (modeloFondoDe(acc) !== 'inversion') return null;
  const saldo = saldoRealCuenta(acc);
  const costBase = (acc.aportaciones || []).reduce((s, a) => s + a.cantidad, 0) || acc.saldoInicial || 0;
  const plusvalia = Math.max(0, saldo - costBase);
  const impuesto = calcGananciasCapital(plusvalia, tramos);
  return { saldo, costBase, plusvalia, impuesto, neto: saldo - impuesto };
}

/** Disponible/bloqueado de un plan de pensiones, FIFO sobre las aportaciones. */
export function calcFondosPension(acc: AccountLike, hoy: Date = new Date()): FondosPension | null {
  if (modeloFondoDe(acc) !== 'pension') return null;
  const bloqueo = acc.bloqueoMeses || 120;
  const saldo = saldoRealCuenta(acc);

  const fechaLimite = formatLocalDate(new Date(hoy.getFullYear(), hoy.getMonth() - bloqueo, hoy.getDate()));
  const aportaciones = [...(acc.aportaciones || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));

  let disponible = 0;
  const costBase = aportaciones.reduce((s, a) => s + a.cantidad, 0);
  for (const ap of aportaciones) {
    if (ap.fecha <= fechaLimite) disponible += ap.cantidad;
  }

  const beneficio = Math.max(0, saldo - costBase);
  const ratioDisp = costBase > 0 ? disponible / costBase : 0;
  const dispConBeneficio = Math.min(saldo, disponible + beneficio * ratioDisp);
  const bloqReal = Math.max(0, saldo - dispConBeneficio);

  return {
    saldo,
    disponible: dispConBeneficio,
    bloqueado: bloqReal,
    costBase,
    beneficio,
    numAportaciones: aportaciones.length,
    proxDesbloqueo: aportaciones.find((a) => a.fecha > fechaLimite)?.fecha || null,
  };
}

/** Impuesto al retirar `cantidadRetirada` de un plan (grava el beneficio proporcional). */
export function calcImpuestoPension(acc: AccountLike, cantidadRetirada: number, tipoOverride?: number): number {
  const tipo = tipoOverride !== undefined ? tipoOverride : acc.impuestoRetirada;
  if (modeloFondoDe(acc) !== 'pension' || !tipo) return 0;
  const saldo = saldoRealCuenta(acc);
  if (saldo <= 0) return 0;
  const costBase = (acc.aportaciones || []).reduce((s, a) => s + a.cantidad, 0);
  const beneficio = Math.max(0, saldo - costBase);
  if (beneficio <= 0) return 0;
  const ratioBeneficio = beneficio / saldo;
  const beneficioRetirado = cantidadRetirada * ratioBeneficio;
  return +((beneficioRetirado * tipo) / 100).toFixed(2);
}

/**
 * Tipo marginal IRPF efectivo de un plan: el del grupo de nóminas si lo tiene
 * (bruto × nPagas apilado), si no el % fijo configurado en la cuenta.
 */
export function calcTipoMarginalPension(
  acc: AccountLike,
  nominas: NominaLike[] | null | undefined,
  tramos: Tramos | null | undefined,
): number {
  const grupoId = acc.grupoNomina;
  if (!grupoId) return acc.impuestoRetirada || 0;
  const grupoNoms = (nominas || []).filter((n) => (n.grupoNomina || '') === grupoId && n.activo !== false);
  const brutoAnual = grupoNoms.reduce((s, n) => s + (n.bruto || 0) * (n.nPagas || 12), 0);
  const sorted = [...(tramos || [])].sort((a, b) => a[0] - b[0]);
  let pct = sorted[0]?.[1] || 19;
  for (const [desde, p] of sorted) {
    if (brutoAnual >= desde) pct = p;
    else break;
  }
  return pct;
}
