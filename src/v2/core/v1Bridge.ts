/**
 * V1→V2 data bridge.
 *
 * V1 persists each state slice as a separate localStorage key:
 *   financeapp_state_loans, financeapp_state_expenses, …
 *
 * V2 persists the full AppState as a single key (financeapp_v2_state).
 *
 * On first launch of V2, if there is no V2 state but V1 data exists, this
 * module reads and converts it so users see their existing data immediately.
 */
import type { AppState, AppConfig, Loan, Expense, Account, Goal } from '@/types/domain';

const V1_PREFIX = 'financeapp_';

function v1read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(V1_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function hasV1Data(): boolean {
  return localStorage.getItem(V1_PREFIX + 'state_loans') !== null;
}

/**
 * Reads V1 localStorage slices and converts them into a V2 AppState.
 * Returns null if no V1 data is present.
 *
 * Missing V2 fields are filled with safe defaults so the V2 store never
 * receives a partially-typed object.
 */
export function migrateFromV1(): AppState | null {
  if (!hasV1Data()) return null;

  const loans: Loan[] = (v1read<Partial<Loan>[]>('state_loans') ?? []).map(
    (l): Loan => ({
      _id: l._id ?? crypto.randomUUID(),
      nombre: l.nombre ?? '',
      capital: l.capital ?? 0,
      tin: l.tin ?? 0,
      meses: l.meses ?? 1,
      fechaInicio: l.fechaInicio ?? new Date().toISOString().slice(0, 10),
      comisionApertura: l.comisionApertura ?? 0,
      comisionAmort: l.comisionAmort ?? 0,
      diaPago: l.diaPago ?? '',
      cuenta: l.cuenta ?? 'default',
      simulacion: l.simulacion ?? false,
      activo: l.activo ?? true,
      amortizaciones: l.amortizaciones ?? [],
    })
  );

  const expenses: Expense[] = (v1read<Partial<Expense>[]>('state_expenses') ?? []).map(
    (e): Expense => ({
      _id: e._id ?? crypto.randomUUID(),
      concepto: e.concepto ?? '',
      tipo: e.tipo ?? 'gasto',
      cuantia: e.cuantia ?? 0,
      frecuencia: e.frecuencia ?? 1,
      tipoFrecuencia: e.tipoFrecuencia ?? 'mensual',
      fechaInicio: e.fechaInicio ?? new Date().toISOString().slice(0, 10),
      fechaFin: e.fechaFin,
      diaPago: e.diaPago ?? '',
      cuenta: e.cuenta ?? 'default',
      cuentaDestino: e.cuentaDestino,
      activo: e.activo ?? true,
      basico: e.basico ?? false,
      varianza: e.varianza ?? 0,
      inflacion: e.inflacion ?? 0,
      sujetoIRPF: e.sujetoIRPF ?? false,
      tags: e.tags ?? [],
    })
  );

  const accounts: Account[] = (v1read<Partial<Account>[]>('state_accounts') ?? []).map(
    (a): Account => ({
      _id: a._id ?? crypto.randomUUID(),
      nombre: a.nombre ?? '',
      saldo: a.saldo ?? 0,
      saldoInicial: a.saldoInicial ?? 0,
      fechaInicialSaldo: a.fechaInicialSaldo ?? new Date().toISOString().slice(0, 10),
      interes: a.interes ?? 0,
      periodoCobro: a.periodoCobro ?? 'mensual',
      descripcion: a.descripcion,
      activo: a.activo ?? true,
      simulacion: a.simulacion ?? false,
      esCuentaPrincipal: a.esCuentaPrincipal ?? false,
      esFondoPension: a.esFondoPension ?? false,
      bloqueoMeses: a.bloqueoMeses ?? 120,
      impuestoRetirada: a.impuestoRetirada ?? 0,
      historicoSaldos: a.historicoSaldos ?? [],
      aportaciones: a.aportaciones ?? [],
    })
  );

  const now = new Date();
  const v1Cfg = v1read<Partial<AppConfig>>('state_config') ?? {};
  const config: AppConfig = {
    dashboardStart: new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10),
    dashboardEnd: new Date(now.getFullYear(), 11, 31).toISOString().slice(0, 10),
    colchonMeses: 6,
    colchonTipo: 'meses',
    colchonFijo: 0,
    showColchon: true,
    showHistorico: false,
    histCuenta: '',
    showMC: false,
    mcIteraciones: 300,
    inflacionGlobal: 0,
    tramos_irpf: [
      [0, 19],
      [12450, 24],
      [20200, 30],
      [35200, 37],
      [60000, 45],
      [300000, 47],
    ],
    onboardingDone: false,
    showExecSummary: true,
    showCriticos: true,
    divisaBase: 'EUR',
    locale: 'es',
    theme: 'dark',
    // V1 fields (may be present — applied after defaults)
    ...v1Cfg,
    // presupuestos is V2-only; V1 never has it so this is safe
    presupuestos: [],
  };

  const goals: Goal[] = (v1read<Array<Record<string, unknown>>>('state_goals') ?? []).map(
    (g, i): Goal => ({
      _id: (g._id as string) ?? crypto.randomUUID(),
      nombre: (g.nombre as string) ?? '',
      targetAmount: (g.targetAmount as number) ?? 0,
      targetDate: g.targetDate as string | undefined,
      prioridad: (g.prioridad as number) ?? i + 1,
      color: (g.color as string) ?? '#4d9fff',
      usarColchon: (g.usarColchon as boolean) ?? true,
      completado: (g.completado as boolean) ?? false,
      // V1 had cuentaId (single); V2 uses cuentaIds (array)
      cuentaIds: Array.isArray(g.cuentaIds)
        ? (g.cuentaIds as string[])
        : g.cuentaId
          ? [g.cuentaId as string]
          : [],
    })
  );

  return { loans, expenses, accounts, goals, config };
}
