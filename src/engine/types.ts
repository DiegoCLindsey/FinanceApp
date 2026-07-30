// ── engine/types ──────────────────────────────────────────────────────────────
// Contratos del motor de proyección. Cada fuente de flujos de caja implementa
// EventProvider; statement.ts compone los providers registrados (OCP: los
// módulos nuevos —contabilidad, supuestos— se enchufan aquí sin tocar el motor).

import type { ISODate } from '@/core/dates';

export interface CashEvent {
  fecha: ISODate;
  concepto: string;
  /** Importe SIN signo; el signo lo codifica `tipo` (paridad con el legacy). */
  cuantia: number;
  tipo: 'gasto' | 'ingreso';
  tags: string[];
  cuenta: string;
  sourceId: string;
  sourceType: string;
  simulacion?: boolean;
  /** Rellenados por statement al anclar el saldo. */
  delta?: number;
  saldoAcum?: number;
}

export interface DateRange {
  start: ISODate;
  end: ISODate;
}

/** Filtro de cuentas: null/[] = todas. */
export type AccountFilter = string[] | null;

export interface EventProvider {
  id: string;
  project(range: DateRange, filtroAccounts?: AccountFilter): CashEvent[];
}
