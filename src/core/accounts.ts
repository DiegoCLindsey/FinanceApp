// ── core/accounts ─────────────────────────────────────────────────────────────
// Saldos reales de cuentas: puntos de control (historicoSaldos) + ancla
// saldoInicial@fechaInicialSaldo. Paridad exacta con FinanceMath.
// En F4 (contabilidad real) esta lógica pasará a derivarse del ledger.

import type { ISODate } from './dates';

export interface PuntoSaldo {
  _id?: string;
  fecha: ISODate;
  saldo: number;
  nota?: string;
}

export interface Aportacion {
  _id?: string;
  fecha: ISODate;
  cantidad: number;
}

export type ModeloFondo = 'cuenta' | 'inversion' | 'pension' | 'beneficio';

export interface AccountLike {
  _id?: string;
  nombre?: string;
  saldoInicial?: number;
  fechaInicialSaldo?: ISODate;
  historicoSaldos?: PuntoSaldo[];
  aportaciones?: Aportacion[];
  modeloFondo?: ModeloFondo | string;
  esFondoPension?: boolean;
  impuestoRetirada?: number;
  bloqueoMeses?: number;
  grupoNomina?: string;
}

/** Modelo efectivo de la cuenta (compatibilidad con el campo legacy esFondoPension). */
export function modeloFondoDe(acc: AccountLike | null | undefined): string {
  return acc?.modeloFondo || (acc?.esFondoPension ? 'pension' : 'cuenta');
}

/** Saldo real actual: último punto de control, o saldoInicial si no hay. */
export function saldoRealCuenta(acc: AccountLike): number {
  const hist = [...(acc.historicoSaldos || [])].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return hist.length > 0 ? hist[0].saldo : acc.saldoInicial || 0;
}

/**
 * Saldo conocido en una fecha. El ancla saldoInicial@fechaInicialSaldo manda en
 * su fecha y posteriores (supera puntos previos al ancla); antes del ancla se
 * usan los historicoSaldos tal cual (el ancla pertenece a una fecha posterior).
 */
export function saldoEnFecha(acc: AccountLike, fecha: ISODate): number {
  const floor = acc.fechaInicialSaldo || '';

  if (!floor || fecha >= floor) {
    // `prioridad`: con la MISMA fecha manda el punto de control, no el ancla.
    // Actualizar el saldo de una cuenta escribe un punto con la fecha de hoy, y
    // en una cuenta cuyo ancla también es hoy —el caso de cualquier cuenta
    // recién creada— el empate lo ganaba el ancla porque se apila primero y el
    // orden es estable: el saldo nuevo no aparecía por ningún lado. Es el mismo
    // criterio que ya aplicaba `calcDesviacion`, que indexa por fecha y deja que
    // el punto sobrescriba al ancla.
    // Entre dos puntos del mismo día gana el registrado más tarde (índice mayor),
    // que también es lo que hace `calcDesviacion` al indexar por fecha.
    const entries: (PuntoSaldo & { prioridad: number })[] = [];
    if (floor) entries.push({ fecha: floor, saldo: acc.saldoInicial || 0, prioridad: -1 });
    (acc.historicoSaldos || []).forEach((h, i) => {
      if (h.fecha >= floor) entries.push({ ...h, prioridad: i });
    });
    entries.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.prioridad - a.prioridad);
    const entry = entries.find((h) => h.fecha <= fecha);
    return entry ? entry.saldo : acc.saldoInicial || 0;
  } else {
    const hist = [...(acc.historicoSaldos || [])].sort((a, b) => b.fecha.localeCompare(a.fecha));
    const entry = hist.find((h) => h.fecha <= fecha);
    return entry ? entry.saldo : 0;
  }
}
