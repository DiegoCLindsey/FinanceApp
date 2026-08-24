// ── engine/margins ────────────────────────────────────────────────────────────
// Reservas mínimas de saldo: colchón económico y márgenes de seguridad con
// waypoints temporales (importe fijo o N meses de gasto básico).
// Paridad exacta con FinanceMath (calcGastoBasicoMensual, calcColchon,
// calcColchonEnFecha, calcMargenEnFecha, detectarCrucesMargenes,
// saldosPorCuentaEnExtracto).
//
// NOTA: en la tarea 1.9 el colchón se consolidará como un margen predefinido
// (decisión del usuario, docs/03-informe-redundancias.md B2). Hasta entonces se
// conservan ambos con su semántica actual para no romper paridad.

import { formatLocalDate, type ISODate } from '@/core/dates';
import { cuotaMensual } from '@/core/loan';
import { formatEUR } from '@/core/money';
import { saldoRealCuenta, type AccountLike } from '@/core/accounts';
import { proyectarGastos, type ExpenseLike } from './providers/expenses';
import type { CashEvent } from './types';

export interface BasicoExpense extends ExpenseLike {
  basico?: boolean;
}

export interface BasicoLoan {
  capital: number;
  tin: number;
  meses: number;
  basico?: boolean;
  activo?: boolean;
  simulacion?: boolean;
}

export interface PuntoReserva {
  _id?: string;
  fecha: ISODate;
  tipo: 'fijo' | 'meses' | string;
  importe?: number;
  meses?: number;
}

export interface MargenSeguridad {
  _id?: string;
  nombre: string;
  activo?: boolean;
  cuentas?: string[];
  puntos?: PuntoReserva[];
}

export interface ColchonConfig {
  colchonTipo?: 'meses' | 'fijo' | string;
  colchonFijo?: number;
  colchonMeses?: number;
  colchonPuntos?: PuntoReserva[];
}

/**
 * Gasto básico del mes siguiente (base del colchón).
 * `hoy` es inyectable; el legacy usa `new Date()` interno.
 */
export function calcGastoBasicoMensual(expenses: BasicoExpense[], hoy: Date = new Date()): number {
  const hoyStr = formatLocalDate(hoy);
  const finMes = new Date(hoy);
  finMes.setMonth(finMes.getMonth() + 1);
  const finMesStr = formatLocalDate(finMes);
  const gastosBasicos = expenses.filter((e) => e.basico && e.activo && e.tipo === 'gasto');
  const expEvents = proyectarGastos(gastosBasicos, { start: hoyStr, end: finMesStr });
  return expEvents.reduce((s, e) => s + Math.abs(e.cuantia), 0);
}

function cuotasBasicasMensuales(loans: BasicoLoan[] | null | undefined): number {
  return (loans || [])
    .filter((l) => l.basico && l.activo && !l.simulacion)
    .reduce((s, l) => s + cuotaMensual(l.capital, l.tin, l.meses), 0);
}

/** Colchón económico: importe fijo o N meses de (gasto básico + cuotas básicas). */
export function calcColchon(expenses: BasicoExpense[], config: ColchonConfig, loans: BasicoLoan[], hoy?: Date): number {
  if (config.colchonTipo === 'fijo' && (config.colchonFijo || 0) > 0) return config.colchonFijo as number;
  const totalMes = calcGastoBasicoMensual(expenses, hoy);
  return (totalMes + cuotasBasicasMensuales(loans)) * (config.colchonMeses || 6);
}

/** Colchón aplicable en una fecha, respetando la línea temporal de waypoints. */
export function calcColchonEnFecha(
  expenses: BasicoExpense[],
  config: ColchonConfig,
  loans: BasicoLoan[],
  fecha: ISODate,
  hoy?: Date,
): number {
  const puntos = [...(config.colchonPuntos || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const p = puntos.filter((pt) => pt.fecha <= fecha).pop();
  if (!p) return calcColchon(expenses, config, loans, hoy);
  if (p.tipo === 'fijo') return p.importe || 0;
  const totalMes = calcGastoBasicoMensual(expenses, hoy);
  return (totalMes + cuotasBasicasMensuales(loans)) * (p.meses || 6);
}

/**
 * Objetivo de un margen de seguridad en una fecha (0 = sin restricción).
 * fallbackToFirst: si ningún waypoint precede a `fecha`, usa el primero — lo
 * emplea el optimizador para que un límite con fecha futura siga aplicando.
 */
export function calcMargenEnFecha(
  margen: MargenSeguridad,
  expenses: BasicoExpense[],
  _config: ColchonConfig,
  loans: BasicoLoan[],
  fecha: ISODate,
  fallbackToFirst = false,
  hoy?: Date,
): number {
  const puntos = [...(margen.puntos || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const p = puntos.filter((pt) => pt.fecha <= fecha).pop() || (fallbackToFirst ? puntos[0] : null);
  if (!p) return 0;
  if (p.tipo === 'fijo') return p.importe || 0;
  const totalMes = calcGastoBasicoMensual(expenses, hoy);
  return (totalMes + cuotasBasicasMensuales(loans)) * (p.meses || 1);
}

export interface SaldosSnapshot {
  fecha: ISODate;
  saldos: Record<string, number>;
}

/**
 * Efecto de un evento sobre el saldo: negativo si sale dinero.
 *
 * `cuantia` es la MAGNITUD —los proveedores emiten un gasto de 950 € como
 * `cuantia: 950`, no como −950— y el signo vive en `delta`, que pone
 * `generarExtracto`. Sumar `cuantia` a pelo hacía que todas las cuentas
 * subieran siempre, gastos incluidos.
 */
function efecto(ev: CashEvent): number {
  if (typeof ev.delta === 'number') return ev.delta;
  return ev.tipo === 'ingreso' ? Math.abs(ev.cuantia) : -Math.abs(ev.cuantia);
}

/** Saldo corriente por cuenta, paralelo al extracto. */
export function saldosPorCuentaEnExtracto(extracto: CashEvent[], accounts: (AccountLike & { _id: string })[]): SaldosSnapshot[] {
  const running: Record<string, number> = {};
  for (const acc of accounts) running[acc._id] = saldoRealCuenta(acc);
  return extracto.map((ev) => {
    if (ev.cuenta && running[ev.cuenta] !== undefined) running[ev.cuenta] += efecto(ev);
    return { fecha: ev.fecha, saldos: { ...running } };
  });
}

export interface AlertaMargen {
  tipo: 'bajo_margen' | 'recuperacion_margen';
  fecha: ISODate;
  saldo: number;
  target: number;
  nombre: string;
  mensaje: string;
}

/** Cruces por debajo (y recuperaciones) del objetivo de cada margen activo. */
export function detectarCrucesMargenes(
  margenes: MargenSeguridad[] | null | undefined,
  extracto: CashEvent[],
  saldosPorCuenta: SaldosSnapshot[],
  expenses: BasicoExpense[],
  config: ColchonConfig,
  loans: BasicoLoan[],
  hoy?: Date,
): AlertaMargen[] {
  const alertas: AlertaMargen[] = [];
  for (const margen of (margenes || []).filter((m) => m.activo !== false)) {
    let dentroAlerta = false;
    for (let i = 0; i < extracto.length; i++) {
      const ev = extracto[i];
      const target = calcMargenEnFecha(margen, expenses, config, loans, ev.fecha, false, hoy);
      if (target <= 0) {
        dentroAlerta = false;
        continue;
      }
      const saldo =
        !margen.cuentas || margen.cuentas.length === 0
          ? (ev.saldoAcum as number)
          : margen.cuentas.reduce((s, id) => s + (saldosPorCuenta[i]?.saldos?.[id] || 0), 0);
      if (saldo < target && !dentroAlerta) {
        dentroAlerta = true;
        alertas.push({
          tipo: 'bajo_margen',
          fecha: ev.fecha,
          saldo,
          target,
          nombre: margen.nombre,
          mensaje: `⚠ ${margen.nombre}: ${formatEUR(saldo)} < ${formatEUR(target)} desde ${ev.fecha}`,
        });
      } else if (saldo >= target && dentroAlerta) {
        dentroAlerta = false;
        alertas.push({
          tipo: 'recuperacion_margen',
          fecha: ev.fecha,
          saldo,
          target,
          nombre: margen.nombre,
          mensaje: `✓ ${margen.nombre}: recuperado el ${ev.fecha}`,
        });
      }
    }
  }
  return alertas;
}
