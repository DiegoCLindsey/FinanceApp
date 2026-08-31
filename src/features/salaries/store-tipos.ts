// Tipos del store que consume la vista de nóminas. Fichero propio para evitar
// ciclos entre el índice y los submódulos.
export type { Account, AppConfig, Escenario, Nomina, Persona, TablaFiscalAnual } from '@/state/schema';
export type { PeriodoInflacion } from '@/core/inflation';
