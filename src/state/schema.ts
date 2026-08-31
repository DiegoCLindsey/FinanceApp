// ── state/schema ──────────────────────────────────────────────────────────────
// Esquema tipado del estado persistido. Es la fuente de verdad de la forma de
// los datos; las migraciones (state/migrations/) llevan cualquier estado antiguo
// hasta esta versión.

import type { ISODate } from '@/core/dates';
import type { PuntoSaldo, Aportacion, ModeloFondo } from '@/core/accounts';
import type { Tramos } from '@/core/tax/irpf';
import type { PeriodoInflacion } from '@/core/inflation';
import type { PlanAportacion } from '@/engine/providers/contributions';
import type { ComponenteFlexible } from '@/engine/providers/salaries';
import type { Amortizacion } from '@/core/loan';
import type { MargenSeguridad, PuntoReserva } from '@/engine/margins';
import type { Plan } from '@/planner/tipos';

/**
 * v5 (2026-07): formaliza el esquema y limpia los restos de las features
 *   eliminadas (Monte Carlo, inflación legacy, colección `history`); añade
 *   `config.features` para los feature flags de F2.
 * v6 (2026-07): módulo de contabilidad real (F4) — colecciones `transacciones`
 *   y `puntosControl`. El histórico de saldos pasa a ser de contabilidad y es el
 *   source of truth del pasado.
 * v7 (2026-07): retira `historialPrecios` de las estimaciones — cada entrada
 *   pasa a ser una transacción real enlazada a su estimación (tarea 4.8).
 */
export const SCHEMA_VERSION = 9;

/**
 * Quién hay en el proyecto — no necesariamente personas físicas: la nota
 * larga de convivencia en `docs/` usa el ejemplo de «los gatos» como
 * consumidores sin ser quien paga. Cada proyecto tiene siempre al menos una
 * persona (`esPorDefecto`), y es donde cae todo lo que no lleva reparto
 * explícito — así que activar esta funcionalidad no exige tocar ni un gasto
 * existente.
 */
export interface Persona {
  _id: string;
  nombre: string;
  color?: string;
  /** Exactamente una persona del proyecto lleva esto a `true`. */
  esPorDefecto: boolean;
  activo: boolean;
}

export type ModoReparto = 'partesIguales' | 'porcentaje' | 'importe';

export interface ParticipacionPersona {
  personaId: string;
  /**
   * Porcentaje (0-100) en modo `porcentaje`, importe absoluto en modo
   * `importe`. No se usa en `partesIguales` — cada participante pesa lo
   * mismo, así que no hay nada que teclear.
   */
  valor?: number;
}

/**
 * Cómo se reparte un gasto, una nómina o un préstamo entre varias personas.
 * CONSUMO y PAGO son repartos independientes a propósito: quien paga la luz
 * no tiene por qué ser quien la consume (piso compartido, gastos de mascotas
 * pagados por una persona y disfrutados por todos...). Sin reparto — el caso
 * normal — el 100% es de la persona por defecto del proyecto; por eso este
 * tipo nunca aparece como campo obligatorio.
 */
export interface Reparto {
  modo: ModoReparto;
  participantes: ParticipacionPersona[];
}

export interface Loan {
  _id: string;
  nombre: string;
  capital: number;
  tin: number;
  meses: number;
  fechaInicio: ISODate;
  comisionApertura?: number;
  comisionAmort?: number;
  diaPago?: string;
  tipoTasa?: 'fijo' | 'variable' | string;
  amortizaciones: Amortizacion[];
  cuenta?: string;
  tags: string[];
  activo: boolean;
  basico?: boolean;
  simulacion?: boolean;
  mostrarFechaFinEnDashboard?: boolean;
  escenarioIds: string[];
  /** Quién consume/paga esta cuota. Sin reparto, el 100% es de la persona por defecto. */
  repartoConsumo?: Reparto;
  repartoPago?: Reparto;
}

export type TipoExpense = 'gasto' | 'ingreso' | 'transferencia';
export type Clasificacion = 'necesidad' | 'deseo' | null;

export interface Expense {
  _id: string;
  concepto: string;
  cuantia: number;
  tipo: TipoExpense;
  tipoFrecuencia: 'mensual' | 'diaria' | 'extraordinario';
  frecuencia?: number;
  fechaInicio?: ISODate;
  fechaFin?: ISODate | null;
  diaPago?: string;
  cuenta?: string;
  cuentaDestino?: string;
  tags: string[];
  activo: boolean;
  basico?: boolean;
  sujetoIRPF?: boolean;
  clasificacion?: Clasificacion;
  escenarioIds: string[];
  /** Estimación de la que proviene por un ajuste automático (F4, tarea 4.6). */
  ajustadaDesdeId?: string;
  /** Fecha en la que se aplicó el ajuste que la creó. */
  ajustadaEn?: ISODate;
  /** Quién consume/paga este gasto. Sin reparto, el 100% es de la persona por defecto. */
  repartoConsumo?: Reparto;
  repartoPago?: Reparto;
}

export interface Account {
  _id: string;
  nombre: string;
  descripcion?: string;
  saldo?: number;
  saldoInicial: number;
  fechaInicialSaldo: ISODate;
  historicoSaldos: PuntoSaldo[];
  interes: number;
  periodoCobro?: 'diario' | 'semanal' | 'mensual' | string;
  activo: boolean;
  simulacion?: boolean;
  esCuentaPrincipal: boolean;
  modeloFondo: ModeloFondo;
  aportaciones?: Aportacion[];
  planAportaciones?: PlanAportacion[];
  bloqueoMeses?: number;
  impuestoRetirada?: number;
  grupoNomina?: string;
  tipoBeneficio?: 'transporte' | 'restaurante' | 'otros' | string;
  escenarioIds: string[];
}

export interface Nomina {
  _id: string;
  nombre: string;
  bruto: number;
  nPagas: number;
  irpfModo: 'auto' | 'manual';
  irpfPct: number;
  ssPct?: number;
  representacion: 'detallado' | 'simplificado';
  fechaInicio?: ISODate;
  fechaFin?: ISODate | null;
  cuenta: string;
  activo: boolean;
  tags: string[];
  grupoNomina: string;
  mesActualizacionIPC?: number | null;
  retribucionFlexible?: ComponenteFlexible[];
  escenarioIds: string[];
  /** Quién consume/percibe esta nómina. Sin reparto, el 100% es de la persona por defecto. */
  repartoConsumo?: Reparto;
  repartoPago?: Reparto;
}

export interface Goal {
  _id: string;
  nombre: string;
  targetAmount: number;
  targetDate?: ISODate | null;
  cuentaIds: string[];
  color?: string;
  prioridad: number;
  completado: boolean;
  usarColchon: boolean;
}

export interface TablaFiscalAnual {
  _id: string;
  año: number;
  tramos: Tramos;
}

// ── Contabilidad real (F4) ────────────────────────────────────────────────────

export type TipoTransaccion = 'gasto' | 'ingreso' | 'ajuste';

/**
 * Movimiento REAL de una cuenta. Los importes van en céntimos enteros con
 * signo (negativo = salida) para que las sumas del ledger no arrastren error de
 * coma flotante; el tipo se guarda además de forma explícita porque un 'ajuste'
 * puede ser de cualquier signo.
 */
export interface Transaccion {
  _id: string;
  fecha: ISODate;
  cuentaId: string;
  importeCts: number;
  concepto: string;
  tags: string[];
  /** Estimación (Expense) con la que se relaciona, para el análisis de precisión. */
  estimacionId?: string | null;
  tipo: TipoTransaccion;
  origen: 'manual' | 'importado';
  nota?: string;
}

/**
 * Saldo real conocido de una cuenta en una fecha (lo que antes eran los
 * `historicoSaldos` de la cuenta y la colección `history`). Ancla el ledger:
 * el saldo en cualquier fecha es el último punto de control más las
 * transacciones posteriores.
 */
export interface PuntoControl {
  _id: string;
  fecha: ISODate;
  cuentaId: string;
  saldoCts: number;
  nota?: string;
}

/** Sustituido por Supuestos en F5 (diffs sobre el canónico). */
export interface Escenario {
  _id: string;
  nombre: string;
  color?: string;
  descripcion?: string;
  fechaFin?: ISODate | null;
}

/** Flags de funcionalidades activas por usuario (F2). */
export type FeatureFlags = Record<string, boolean>;

export interface AppConfig {
  dashboardStart: ISODate;
  dashboardEnd: ISODate;
  fechaReferencia: ISODate;
  // Colchón — se consolida como margen predefinido en 1.9 (docs/03, B2)
  colchonMeses: number;
  colchonTipo: 'meses' | 'fijo';
  colchonFijo: number;
  colchonPuntos?: PuntoReserva[];
  showColchon: boolean;
  margenesSeguridad?: MargenSeguridad[];
  // Inflación (único sistema desde 1.8)
  usarInflacion: boolean;
  // Tablas fiscales por defecto
  tramos_irpf: Tramos;
  tramosGananciasCapital: Tramos;
  // Presentación
  showExecSummary: boolean;
  showCriticos?: boolean;
  showHistorico: boolean;
  histCuenta: string;
  analisisCollapsed: boolean;
  activeTagsFilter: string[];
  // tagCategorias + tagGrupos se unifican en 1.9 (docs/03, B3)
  tagCategorias: string[];
  tagGrupos: string[];
  // Salud financiera
  saludUmbralAhorroVerde: number;
  saludUmbralAhorroAmarillo: number;
  saludUmbralDTIVerde: number;
  saludUmbralDTIAmarillo: number;
  saludRegla: number[];
  saludExcluirHipoteca: boolean;
  saludTagHipoteca: string;
  // Almacenamiento
  storageMode: 'local' | 'firebase' | 'dropbox';
  autoSave: boolean;
  autoSaveInterval: number;
  /**
   * Minutos de inactividad tras los que se cierra la sesión sola. 0 = nunca
   * (por defecto): la sesión solo se cierra si el usuario lo pide o si el
   * token deja de ser válido.
   */
  autoLogoutMinutos: number;
  onboardingDone: boolean;
  escenarioActivo: string | null;
  features: FeatureFlags;
}

export interface AppState {
  loans: Loan[];
  expenses: Expense[];
  accounts: Account[];
  nominas: Nomina[];
  goals: Goal[];
  /** Planes del gestor de objetivos financieros (v8). */
  planes: Plan[];
  transacciones: Transaccion[];
  puntosControl: PuntoControl[];
  inflacion: PeriodoInflacion[];
  tramosIRPFHistorico: TablaFiscalAnual[];
  tramosGananciasCapitalHistorico: TablaFiscalAnual[];
  escenarios: Escenario[];
  /** Quién hay en el proyecto (v9). Siempre al menos una, la de por defecto. */
  personas: Persona[];
  config: AppConfig;
}

export type CollectionKey = Exclude<keyof AppState, 'config'>;

export const TRAMOS_IRPF_FALLBACK: Tramos = [
  [0, 19],
  [12450, 24],
  [20200, 30],
  [35200, 37],
  [60000, 45],
  [300000, 47],
];
export const TRAMOS_AHORRO_FALLBACK: Tramos = [
  [0, 19],
  [6000, 21],
  [50000, 23],
  [200000, 27],
  [300000, 28],
];

/** Cuenta que siempre debe existir. */
export function defaultAccount(hoyISO: ISODate): Account {
  return {
    _id: 'default',
    nombre: 'Default',
    descripcion: 'Cuenta principal',
    saldo: 0,
    saldoInicial: 0,
    fechaInicialSaldo: hoyISO,
    historicoSaldos: [],
    interes: 0,
    periodoCobro: 'mensual',
    activo: true,
    simulacion: false,
    esCuentaPrincipal: true,
    modeloFondo: 'cuenta',
    aportaciones: [],
    planAportaciones: [],
    escenarioIds: [],
  };
}

/** Id de la persona por defecto — estable, para no tener que ir a buscarla. */
export const PERSONA_DEFECTO_ID = 'default';

/** Persona que siempre debe existir; es donde cae todo lo sin reparto explícito. */
export function defaultPersona(): Persona {
  return { _id: PERSONA_DEFECTO_ID, nombre: 'Yo', esPorDefecto: true, activo: true };
}

export function defaultConfig(hoyISO: ISODate, finISO: ISODate): AppConfig {
  return {
    dashboardStart: hoyISO,
    dashboardEnd: finISO,
    fechaReferencia: hoyISO,
    colchonMeses: 6,
    colchonTipo: 'meses',
    colchonFijo: 0,
    colchonPuntos: [],
    showColchon: true,
    margenesSeguridad: [],
    usarInflacion: false,
    tramos_irpf: TRAMOS_IRPF_FALLBACK,
    tramosGananciasCapital: TRAMOS_AHORRO_FALLBACK,
    showExecSummary: true,
    showCriticos: true,
    showHistorico: true,
    histCuenta: '',
    analisisCollapsed: false,
    activeTagsFilter: [],
    tagCategorias: [],
    tagGrupos: [],
    saludUmbralAhorroVerde: 20,
    saludUmbralAhorroAmarillo: 10,
    saludUmbralDTIVerde: 30,
    saludUmbralDTIAmarillo: 40,
    saludRegla: [50, 30, 20],
    saludExcluirHipoteca: false,
    saludTagHipoteca: 'hipoteca',
    storageMode: 'local',
    autoSave: false,
    autoSaveInterval: 15,
    autoLogoutMinutos: 0,
    onboardingDone: false,
    escenarioActivo: null,
    features: {},
  };
}

export function defaultState(hoyISO: ISODate, finISO: ISODate): AppState {
  return {
    loans: [],
    expenses: [],
    accounts: [defaultAccount(hoyISO)],
    nominas: [],
    goals: [],
    planes: [],
    transacciones: [],
    puntosControl: [],
    inflacion: [],
    tramosIRPFHistorico: [],
    tramosGananciasCapitalHistorico: [],
    escenarios: [],
    personas: [defaultPersona()],
    config: defaultConfig(hoyISO, finISO),
  };
}
