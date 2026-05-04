import type { Loan, Expense, Account, Goal, AppConfig, EarlyRepayment } from '@/types/domain';

let idCounter = 1;
function uid(): string {
  return `test-${idCounter++}`;
}

export function loanFactory(overrides: Partial<Loan> = {}): Loan {
  return {
    _id: uid(),
    nombre: 'Préstamo test',
    capital: 10000,
    tin: 5,
    meses: 12,
    fechaInicio: '2024-01-01',
    comisionApertura: 0,
    comisionAmort: 0,
    diaPago: 'dia:1',
    cuenta: 'account-1',
    simulacion: false,
    activo: true,
    amortizaciones: [],
    ...overrides,
  };
}

export function earlyRepaymentFactory(overrides: Partial<EarlyRepayment> = {}): EarlyRepayment {
  return {
    _id: uid(),
    fecha: '2024-06-01',
    cantidad: 1000,
    tipo: 'plazo',
    simulacion: false,
    ...overrides,
  };
}

export function expenseFactory(overrides: Partial<Expense> = {}): Expense {
  return {
    _id: uid(),
    concepto: 'Gasto test',
    tipo: 'gasto',
    cuantia: 100,
    frecuencia: 1,
    tipoFrecuencia: 'mensual',
    fechaInicio: '2024-01-01',
    diaPago: 'dia:1',
    cuenta: 'account-1',
    activo: true,
    basico: false,
    varianza: 0,
    inflacion: 0,
    sujetoIRPF: false,
    tags: [],
    ...overrides,
  };
}

export function accountFactory(overrides: Partial<Account> = {}): Account {
  return {
    _id: uid(),
    nombre: 'Cuenta test',
    saldo: 5000,
    saldoInicial: 5000,
    fechaInicialSaldo: '2024-01-01',
    interes: 0,
    periodoCobro: 'mensual',
    activo: true,
    simulacion: false,
    esCuentaPrincipal: true,
    esFondoPension: false,
    bloqueoMeses: 0,
    impuestoRetirada: 0,
    historicoSaldos: [],
    aportaciones: [],
    ...overrides,
  };
}

export function goalFactory(overrides: Partial<Goal> = {}): Goal {
  return {
    _id: uid(),
    nombre: 'Meta test',
    targetAmount: 3000,
    prioridad: 1,
    color: '#00e5a0',
    usarColchon: false,
    completado: false,
    cuentaIds: [],
    ...overrides,
  };
}

export function configFactory(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    dashboardStart: '2024-01-01',
    dashboardEnd: '2024-12-31',
    colchonMeses: 3,
    colchonTipo: 'meses',
    colchonFijo: 0,
    showColchon: true,
    showHistorico: false,
    histCuenta: '',
    showMC: false,
    mcIteraciones: 1000,
    inflacionGlobal: 2.5,
    tramos_irpf: [
      [0, 19],
      [12450, 24],
      [20200, 30],
      [35200, 37],
      [60000, 45],
      [300000, 47],
    ],
    onboardingDone: true,
    showExecSummary: false,
    showCriticos: true,
    divisaBase: 'EUR',
    locale: 'es',
    theme: 'dark',
    presupuestos: [],
    ...overrides,
  };
}
