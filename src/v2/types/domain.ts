// ── Payment day format ──────────────────────────────────────────────────────
// 'dia:N'          → Day N of the month (1–31, clamped to last day)
// 'dia:ultimo'     → Last day of the month
// 'nthweekday:N:W' → Nth (1–5, or -1=last) weekday W (0=Sun…6=Sat) of the month
export type DiaPago = string;

// ── Frequencies ─────────────────────────────────────────────────────────────
export type TipoFrecuencia = 'extraordinario' | 'diaria' | 'mensual';
export type TipoMovimiento = 'gasto' | 'ingreso' | 'transferencia';
export type TipoAmortizacion = 'plazo' | 'cuota';
export type PeriodoCobro = 'diario' | 'semanal' | 'mensual';

// ── Loan ────────────────────────────────────────────────────────────────────
export interface EarlyRepayment {
  _id: string;
  fecha: string; // ISO date
  cantidad: number;
  tipo: TipoAmortizacion;
  simulacion: boolean;
}

export interface Loan {
  _id: string;
  nombre: string;
  capital: number;
  tin: number; // Annual rate in % (e.g. 5 for 5%)
  meses: number;
  fechaInicio: string; // ISO date
  comisionApertura: number; // % of capital (e.g. 1 for 1%)
  comisionAmort: number; // % on early repayment amount
  diaPago: DiaPago;
  cuenta: string; // Account _id
  simulacion: boolean;
  activo: boolean;
  amortizaciones: EarlyRepayment[];
}

// ── Expense / Income / Transfer ─────────────────────────────────────────────
export interface Expense {
  _id: string;
  concepto: string;
  tipo: TipoMovimiento;
  cuantia: number;
  frecuencia: number; // Interval: every N days or N months
  tipoFrecuencia: TipoFrecuencia;
  fechaInicio: string; // ISO date
  fechaFin?: string; // ISO date — undefined means no end
  diaPago: DiaPago;
  cuenta: string; // Account _id
  cuentaDestino?: string; // Account _id (transfers only)
  activo: boolean;
  basico: boolean; // Counts toward safety cushion
  varianza: number; // % variance for Monte Carlo (0 = deterministic)
  inflacion: number; // Annual inflation % (0 = use global config)
  sujetoIRPF: boolean;
  tags: string[];
}

// ── Account ──────────────────────────────────────────────────────────────────
export interface BalanceRecord {
  _id: string;
  fecha: string; // ISO date
  saldo: number;
  nota?: string;
}

export interface PensionContribution {
  _id: string;
  fecha: string; // ISO date
  cantidad: number; // Amount at acquisition price
}

export interface Account {
  _id: string;
  nombre: string;
  saldo: number; // Current balance
  saldoInicial: number; // Balance at fechaInicialSaldo
  fechaInicialSaldo: string; // ISO date — base date for projections
  interes: number; // Annual return % (e.g. 3.5 for 3.5%)
  periodoCobro: PeriodoCobro;
  descripcion?: string;
  activo: boolean;
  simulacion: boolean;
  esCuentaPrincipal: boolean;
  esFondoPension: boolean;
  // Pension fund fields (only relevant when esFondoPension = true)
  bloqueoMeses: number; // Lock period in months
  impuestoRetirada: number; // Tax % on profit at withdrawal
  historicoSaldos: BalanceRecord[];
  aportaciones: PensionContribution[];
}

// ── Savings Goal ─────────────────────────────────────────────────────────────
export interface Goal {
  _id: string;
  nombre: string;
  targetAmount: number;
  targetDate?: string; // ISO date — optional deadline
  prioridad: number; // 1 = highest
  color: string; // CSS color
  usarColchon: boolean; // Deduct safety cushion before counting progress
  completado: boolean;
  cuentaIds: string[]; // Account _ids to count toward this goal
}

// ── Budget entry (new in V2) ─────────────────────────────────────────────────
export interface BudgetEntry {
  _id: string;
  tag: string; // '*' for global budget
  limite: number; // Monthly cap in base currency
  alertas: boolean;
  umbralAlerta: number; // % at which to alert (default 80)
  activo: boolean;
}

// ── IRPF tax bracket ─────────────────────────────────────────────────────────
// [minIncome, ratePercent] — sorted ascending by minIncome
export type IrpfBracket = [number, number];

// ── App configuration ─────────────────────────────────────────────────────────
export interface AppConfig {
  dashboardStart: string; // ISO date
  dashboardEnd: string; // ISO date
  colchonMeses: number;
  colchonTipo: 'meses' | 'fijo';
  colchonFijo: number;
  showColchon: boolean;
  showHistorico: boolean;
  histCuenta: string;
  showMC: boolean;
  mcIteraciones: number;
  inflacionGlobal: number; // Annual % (e.g. 2.5)
  tramos_irpf: IrpfBracket[];
  onboardingDone: boolean;
  showExecSummary: boolean;
  showCriticos: boolean;
  divisaBase: string; // ISO 4217, default 'EUR'
  locale: string; // BCP 47, default 'es'
  theme: 'dark' | 'light' | 'system';
  presupuestos: BudgetEntry[];
}

// ── Full app state ────────────────────────────────────────────────────────────
export interface AppState {
  loans: Loan[];
  expenses: Expense[];
  accounts: Account[];
  goals: Goal[];
  config: AppConfig;
}

// ── Derived / computed types ──────────────────────────────────────────────────
export interface LoanScheduleRow {
  mes: number | 'AMORT';
  fecha: string;
  cuota: number;
  interes: number;
  amortizacion: number;
  comisionAmort: number;
  capitalPendiente: number;
  esAmortizacion: boolean;
  simulacion: boolean;
}

export interface LoanSummary {
  cuotaMensual: number;
  tae: number;
  totalPagado: number;
  totalIntereses: number;
  fechaFin: string;
  capitalPendiente: number;
}

export interface ExtractoEntry {
  fecha: string;
  concepto: string;
  cuantia: number; // Negative = expense/outflow, positive = income/inflow
  tipo: TipoMovimiento;
  cuenta: string;
  cuentaDestino?: string;
  tag?: string;
  saldoProyectado?: number;
}

export interface FinancialScore {
  total: number; // 0–100
  ratioGastosFijos: number;
  ratioGastosBasicos: number;
  tasaAhorro: number;
  ratioDeuda: number;
  coberturaColchon: number;
  ratioLiquidez: number;
  tendenciaAhorro: number;
  diversificacionIngresos: number;
}
