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

// ── Projected cash-flow events ───────────────────────────────────────────────
export type EventSourceType =
  | 'expense'
  | 'loan'
  | 'loan-amort'
  | 'transfer-out'
  | 'transfer-in'
  | 'account-interest'
  | 'pension-tax';

export interface ProjectedEvent {
  fecha: string;
  concepto: string;
  cuantia: number;
  tipo: TipoMovimiento;
  tags: string[];
  cuenta: string;
  sourceId: string;
  sourceType: EventSourceType;
  simulacion?: boolean;
}

// StatementEntry adds running-balance fields after generateStatement()
export interface StatementEntry extends ProjectedEvent {
  delta: number; // Signed: positive = inflow, negative = outflow
  saldoAcum: number; // Running total balance
}

// ── Monte Carlo ───────────────────────────────────────────────────────────────
export interface MonteCarloPoint {
  x: number; // Unix timestamp ms
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

// ── Critical points ──────────────────────────────────────────────────────────
export type CriticalPointType = 'saldo_negativo' | 'bajo_colchon' | 'recuperacion_colchon';

export interface CriticalPoint {
  tipo: CriticalPointType;
  fecha: string;
  saldo: number;
  mensaje: string;
}

// ── Emergency fund status (#23) ──────────────────────────────────────────────
export type EmergencyFundEstado = 'critico' | 'insuficiente' | 'adecuado' | 'excelente';

export interface EmergencyFundStatus {
  gastosBasicosMensuales: number;
  colchonObjetivo: number;
  saldoDisponible: number;
  mesesCubiertos: number;
  deficit: number;
  superavit: number;
  estado: EmergencyFundEstado;
}

// ── Budget progress (#19) ─────────────────────────────────────────────────────
export interface BudgetProgress {
  tag: string;
  limite: number;
  gasto: number; // projected spend this month
  pct: number; // gasto / limite * 100
  estado: 'ok' | 'warning' | 'exceeded';
  alertar: boolean; // pct >= umbralAlerta
}

// ── Financial health score (#22 — 8 metrics) ─────────────────────────────────
export interface FinancialScore {
  total: number; // 0–100+ weighted score
  label: 'Excelente' | 'Buena' | 'Regular' | 'Atención';
  // Raw values
  ratioGastosFijos: number; // % of income
  tasaAhorro: number; // % of income saved
  ratioDeuda: number; // % of income on loan payments
  coberturaFondoEmergencia: number; // months covered by liquid assets
  ratioLiquidez: number; // liquid assets / 12-month loan obligations
  tendenciaAhorro: number | null; // % change vs prior period (null = no data)
  fuentesIngreso: number; // count of distinct active income sources
  // Monthly absolute values
  gastosFijosMes: number;
  ahorroMes: number;
  cuotasMes: number;
  ingresosMes: number;
  // Per-metric scores (0–100)
  scoreFijos: number;
  scoreAhorro: number;
  scoreDeuda: number;
  scoreCoberturaFondo: number;
  scoreLiquidez: number;
  scoreTendencia: number;
  scoreDiversificacion: number;
}

// ── IRPF fiscal projection (#28) ─────────────────────────────────────────────
export interface FiscalProjection {
  baseImponible: number; // annual sum of sujetoIRPF income
  cuotaIRPF: number; // tax from configured brackets
  tipoMarginal: number; // highest bracket rate (%) applied
  tipoEfectivo: number; // cuotaIRPF / baseImponible * 100
  limiteDeduccionPension: number; // min(8000, 30% × rendimientos netos)
  pensionContribuidoAnyo: number; // sum of pension contributions this year
  margenDeduccionPension: number; // limiteDeduccionPension - pensionContribuidoAnyo
  ahorroFiscalPension: number; // margen × tipoMarginal / 100
}

// ── Multi-scenario forecast (#25) ─────────────────────────────────────────────
export interface ScenarioParams {
  nombre: string;
  color: string;
  variacionIngresos: number; // % (e.g. +10 = incomes × 1.10)
  variacionGastos: number; // % (e.g. +15 = expenses × 1.15)
}

export interface ScenarioPoint {
  nombre: string;
  color: string;
  saldoA3M: number;
  saldoA6M: number;
  saldoA1A: number;
  saldoA3A: number;
}
