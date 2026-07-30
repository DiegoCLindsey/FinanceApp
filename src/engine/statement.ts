// ── engine/statement ──────────────────────────────────────────────────────────
// Composición del extracto: concatena los providers, ordena por fecha y ancla
// el saldo real conocido en fechaReferencia reconstruyendo hacia atrás y hacia
// adelante. Paridad exacta con FinanceMath.generarExtracto / saldoHoy /
// recomputarSaldoAcum. Dependencias inyectadas en lugar de State global.

import { todayISO, type ISODate } from '@/core/dates';
import { saldoEnFecha, saldoRealCuenta, type AccountLike } from '@/core/accounts';
import type { PeriodoInflacion } from '@/core/inflation';
import type { Tramos } from '@/core/tax/irpf';
import { proyectarGastos, type ExpenseLike } from './providers/expenses';
import { proyectarPrestamos, type LoanItem } from './providers/loans';
import { proyectarTransferencias, type TransferDeps, type TransferExpense } from './providers/transfers';
import { proyectarAportaciones, type ContributionAccount } from './providers/contributions';
import { proyectarInteresesCuentas, type InterestAccount } from './providers/interests';
import { proyectarRetencionesFiscales, type WithholdingExpense } from './providers/withholdings';
import { proyectarNominas, type NominaItem, type TramosResolver } from './providers/salaries';
import { proyectarInflacionGastos, proyectarPerdidaAhorro } from './providers/inflation-events';
import type { AccountFilter, CashEvent } from './types';

export interface StatementAccount extends AccountLike, InterestAccount, ContributionAccount {
  _id: string;
  nombre: string;
  activo?: boolean;
  esCuentaPrincipal?: boolean;
}

export interface StatementConfig {
  dashboardStart: ISODate;
  dashboardEnd: ISODate;
  fechaReferencia?: ISODate;
  usarInflacion?: boolean;
  tramos_irpf?: Tramos;
}

export interface StatementInput {
  loans: LoanItem[];
  expenses: (ExpenseLike & TransferExpense & WithholdingExpense)[];
  accounts: StatementAccount[];
  config: StatementConfig;
  filtroAccounts?: AccountFilter;
  nominas?: NominaItem[];
  inflacionPeriodos?: PeriodoInflacion[];
  resolverTramosIRPF?: TramosResolver;
  resolverTramosGanancias?: TramosResolver;
}

// Núcleo bidireccional: retrocede desde fechaReferencia invirtiendo los
// movimientos y proyecta hacia adelante con normalidad.
function aplicarSaldoRef(sortedEvents: CashEvent[], cuentasActivas: AccountLike[], config: StatementConfig): CashEvent[] {
  const raw = config.fechaReferencia || config.dashboardStart;
  const fechaRef = raw < config.dashboardStart ? config.dashboardStart : raw > config.dashboardEnd ? config.dashboardEnd : raw;
  const saldoRef = cuentasActivas.reduce((s, a) => s + saldoEnFecha(a, fechaRef), 0);

  const past = sortedEvents.filter((e) => e.fecha < fechaRef);
  const future = sortedEvents.filter((e) => e.fecha >= fechaRef);

  const pastResult: CashEvent[] = [];
  let saldo = saldoRef;
  for (const ev of [...past].reverse()) {
    const d = ev.tipo === 'ingreso' ? Math.abs(ev.cuantia) : -Math.abs(ev.cuantia);
    pastResult.unshift({ ...ev, delta: d, saldoAcum: saldo });
    saldo -= d;
  }

  const futureResult: CashEvent[] = [];
  saldo = saldoRef;
  for (const ev of future) {
    const d = ev.tipo === 'ingreso' ? Math.abs(ev.cuantia) : -Math.abs(ev.cuantia);
    saldo += d;
    futureResult.push({ ...ev, delta: d, saldoAcum: saldo });
  }

  return [...pastResult, ...futureResult];
}

/** Recomputa delta/saldoAcum sobre un array de eventos ya existente. */
export function recomputarSaldoAcum(
  events: CashEvent[],
  accounts: StatementAccount[],
  config: StatementConfig,
  filtroAccounts: AccountFilter = null,
): CashEvent[] {
  const cuentasActivas = accounts.filter(
    (a) => a.activo && (!filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(a._id)),
  );
  return aplicarSaldoRef(
    [...events].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    cuentasActivas,
    config,
  );
}

export function generarExtracto(input: StatementInput): CashEvent[] {
  const { loans, expenses, accounts, config } = input;
  const filtroAccounts = input.filtroAccounts ?? null;
  const nominas = input.nominas ?? [];
  const inflacionPeriodos = input.inflacionPeriodos ?? [];
  const range = { start: config.dashboardStart, end: config.dashboardEnd };

  const gastos = expenses.filter((e) => e.tipo !== 'transferencia');
  const transferencias = expenses.filter((e) => e.tipo === 'transferencia');
  const transferDeps: TransferDeps = {
    accounts,
    nominas,
    resolverTramosIRPF: input.resolverTramosIRPF,
    resolverTramosGanancias: input.resolverTramosGanancias,
  };

  let allEvents: CashEvent[] = [];
  allEvents = allEvents.concat(proyectarGastos(gastos, range, filtroAccounts));
  allEvents = allEvents.concat(proyectarPrestamos(loans, range, filtroAccounts));
  allEvents = allEvents.concat(proyectarTransferencias(transferencias, range, filtroAccounts, transferDeps));
  allEvents = allEvents.concat(proyectarAportaciones(accounts, range, filtroAccounts));
  const intereses = proyectarInteresesCuentas(accounts, range, filtroAccounts, allEvents);
  allEvents = allEvents.concat(intereses);
  allEvents = allEvents.concat(proyectarRetencionesFiscales(expenses, config.tramos_irpf, range, filtroAccounts));
  allEvents = allEvents.concat(proyectarNominas(nominas, range, filtroAccounts, inflacionPeriodos, input.resolverTramosIRPF));
  if (config.usarInflacion && inflacionPeriodos.length > 0) {
    const principalId = (accounts.find((a) => a.activo && a.esCuentaPrincipal) || accounts.find((a) => a.activo) || { _id: 'default' })._id;
    allEvents = allEvents.concat(proyectarInflacionGastos(gastos, inflacionPeriodos, range, filtroAccounts, principalId));
    const cuentasAct = accounts.filter(
      (a) => a.activo && (!filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(a._id)),
    );
    const saldoIni = cuentasAct.reduce((s, a) => s + saldoEnFecha(a, config.dashboardStart), 0);
    allEvents = allEvents.concat(proyectarPerdidaAhorro(saldoIni, inflacionPeriodos, range, principalId));
  }
  allEvents.sort((a, b) => a.fecha.localeCompare(b.fecha));
  const cuentasActivas = accounts.filter(
    (a) => a.activo && (!filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(a._id)),
  );
  return aplicarSaldoRef(allEvents, cuentasActivas, config);
}

/** Saldo a día de hoy según el extracto (o saldo real si no hay eventos pasados). */
export function saldoHoy(extracto: CashEvent[], accounts: StatementAccount[], filtroAccounts: AccountFilter = null): number {
  const today = todayISO();
  const cuentasActivas = accounts.filter(
    (a) => a.activo && (!filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(a._id)),
  );
  const saldo = cuentasActivas.reduce((s, a) => s + saldoRealCuenta(a), 0);
  const past = extracto.filter((e) => e.fecha <= today);
  if (past.length === 0) return saldo;
  return past[past.length - 1].saldoAcum as number;
}

/** Suma |cuantia| por tag para un tipo, ignorando transferencias y amortizaciones. */
export function sumarPorTags(extracto: CashEvent[], tipo: 'gasto' | 'ingreso'): Map<string, number> {
  const m = new Map<string, number>();
  for (const ev of extracto) {
    if (ev.tipo !== tipo) continue;
    if (ev.sourceType === 'transfer-out' || ev.sourceType === 'transfer-in' || ev.sourceType === 'loan-amort') continue;
    for (const t of ev.tags || ['sin_tag']) m.set(t, (m.get(t) || 0) + Math.abs(ev.cuantia));
  }
  return m;
}
