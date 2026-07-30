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

/**
 * v5 (2026-07): formaliza el esquema y limpia los restos de las features
 * eliminadas (Monte Carlo, inflación legacy, colección `history`); añade
 * `config.features` para los feature flags de F2.
 */
export const SCHEMA_VERSION = 5;

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
  /** Se retira en F4 cuando Contabilidad lo sustituya (docs/03, B4). */
  historialPrecios?: { fecha: ISODate; cuantia: number }[];
  escenarioIds: string[];
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
  inflacion: PeriodoInflacion[];
  tramosIRPFHistorico: TablaFiscalAnual[];
  tramosGananciasCapitalHistorico: TablaFiscalAnual[];
  escenarios: Escenario[];
  config: AppConfig;
}

export type CollectionKey = Exclude<keyof AppState, 'config'>;

export const TRAMOS_IRPF_FALLBACK: Tramos = [[0, 19], [12450, 24], [20200, 30], [35200, 37], [60000, 45], [300000, 47]];
export const TRAMOS_AHORRO_FALLBACK: Tramos = [[0, 19], [6000, 21], [50000, 23], [200000, 27], [300000, 28]];

/** Cuenta que siempre debe existir. */
export function defaultAccount(hoyISO: ISODate): Account {
  return {
    _id: 'default', nombre: 'Default', descripcion: 'Cuenta principal',
    saldo: 0, saldoInicial: 0, fechaInicialSaldo: hoyISO, historicoSaldos: [],
    interes: 0, periodoCobro: 'mensual', activo: true, simulacion: false,
    esCuentaPrincipal: true, modeloFondo: 'cuenta', aportaciones: [],
    planAportaciones: [], escenarioIds: [],
  };
}

export function defaultConfig(hoyISO: ISODate, finISO: ISODate): AppConfig {
  return {
    dashboardStart: hoyISO,
    dashboardEnd: finISO,
    fechaReferencia: hoyISO,
    colchonMeses: 6, colchonTipo: 'meses', colchonFijo: 0, colchonPuntos: [],
    showColchon: true, margenesSeguridad: [],
    usarInflacion: false,
    tramos_irpf: TRAMOS_IRPF_FALLBACK,
    tramosGananciasCapital: TRAMOS_AHORRO_FALLBACK,
    showExecSummary: true, showCriticos: true, showHistorico: true, histCuenta: '',
    analisisCollapsed: false,
    activeTagsFilter: [], tagCategorias: [], tagGrupos: [],
    saludUmbralAhorroVerde: 20, saludUmbralAhorroAmarillo: 10,
    saludUmbralDTIVerde: 30, saludUmbralDTIAmarillo: 40,
    saludRegla: [50, 30, 20], saludExcluirHipoteca: false, saludTagHipoteca: 'hipoteca',
    storageMode: 'local', autoSave: false, autoSaveInterval: 15,
    onboardingDone: false, escenarioActivo: null,
    features: {},
  };
}

export function defaultState(hoyISO: ISODate, finISO: ISODate): AppState {
  return {
    loans: [], expenses: [], accounts: [defaultAccount(hoyISO)], nominas: [],
    goals: [], inflacion: [], tramosIRPFHistorico: [], tramosGananciasCapitalHistorico: [],
    escenarios: [], config: defaultConfig(hoyISO, finISO),
  };
}
