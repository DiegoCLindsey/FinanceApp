// ── core/scenarios ────────────────────────────────────────────────────────────
// Escenarios: qué elementos entran en una proyección y cómo se resume la
// evolución del saldo mes a mes.
//
// Un elemento "de base" (sin `escenarioIds`) sale siempre; uno asignado a
// escenarios solo sale cuando el escenario activo es uno de los suyos. Paridad
// con FinanceMath.filtrarPorEscenario.
//
// En F5 esto se sustituye por Supuestos con diffs sobre lo canónico
// (docs/02-plan-refactor.md, fase 5); el filtro por pertenencia se mantiene
// mientras tanto.

import { formatLocalDate, parseLocalDate, type ISODate } from './dates';

export interface Asignable {
  escenarioIds?: string[];
}

export interface LoanConAmortizaciones extends Asignable {
  amortizaciones?: Asignable[];
}

/** ¿Este elemento entra en la proyección del escenario dado (null = base)? */
export function visibleEnEscenario(item: Asignable, escenarioId: string | null): boolean {
  const ids = item.escenarioIds || [];
  if (ids.length === 0) return true; // pertenece a la realidad base
  return !!escenarioId && ids.includes(escenarioId);
}

export interface EntradaFiltro<L, E, N, A> {
  loans: L[];
  expenses: E[];
  nominas: N[];
  accounts: A[];
}

/**
 * Recorta las colecciones a lo que ve un escenario. Las amortizaciones se
 * filtran dentro de cada préstamo: una amortización puede pertenecer a un
 * escenario aunque el préstamo sea de base — es el caso de uso principal
 * ("¿y si amortizo agresivamente?").
 */
export function filtrarPorEscenario<L extends LoanConAmortizaciones, E extends Asignable, N extends Asignable, A extends Asignable>(
  entrada: EntradaFiltro<L, E, N, A>,
  escenarioId: string | null,
): EntradaFiltro<L, E, N, A> {
  const visible = (i: Asignable) => visibleEnEscenario(i, escenarioId);
  return {
    loans: entrada.loans.filter(visible).map((l) => ({ ...l, amortizaciones: (l.amortizaciones || []).filter(visible) })),
    expenses: entrada.expenses.filter(visible),
    nominas: entrada.nominas.filter(visible),
    accounts: entrada.accounts.filter(visible),
  };
}

// ── Serie mensual de saldo ────────────────────────────────────────────────────

export interface EventoExtracto {
  fecha: ISODate;
  saldoAcum?: number;
  delta?: number;
}

export interface PuntoMensual {
  /** Milisegundos del día 15 del mes, para el eje temporal del gráfico. */
  x: number;
  /** Mes 'YYYY-MM', para leer la serie sin depender del huso horario. */
  mes: string;
  y: number;
}

const mesDe = (iso: ISODate) => iso.slice(0, 7);

function siguienteMes(mes: string): string {
  const [y, m] = mes.split('-').map(Number);
  return `${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, '0')}`;
}

/**
 * Saldo al cierre de cada mes del rango, arrastrando el último conocido en los
 * meses sin movimientos para que la línea no tenga huecos.
 *
 * Dos correcciones respecto al legacy (`escenarios/escenarios.js`):
 *
 *  1. El saldo sale de `saldoAcum`, que es lo que también usa la tabla
 *     comparativa. El legacy reconstruía un saldo por cuenta sumando `delta`
 *     desde CERO, así que la línea se olvidaba del saldo de partida: caía de
 *     los ~25.000 € reales al acumulado de flujo del periodo, y no cuadraba
 *     con la tabla que tenía justo debajo.
 *  2. Los meses se recorren con aritmética de calendario y `formatLocalDate`.
 *     El legacy avanzaba con `new Date(...)` a medianoche local y leía la clave
 *     con `toISOString().slice(0,7)`: en España eso devuelve el MES ANTERIOR
 *     para el día 1, de modo que cada mes se buscaba en la casilla equivocada.
 */
export function serieMensual(eventos: EventoExtracto[], desde?: ISODate, hasta?: ISODate): PuntoMensual[] {
  if (eventos.length === 0) return [];

  // Último saldo conocido de cada mes con movimientos
  const cierres = new Map<string, number>();
  for (const ev of eventos) {
    if (ev.saldoAcum !== undefined) cierres.set(mesDe(ev.fecha), ev.saldoAcum);
  }

  const primero = eventos[0];
  let ultimo = (primero.saldoAcum ?? 0) - (primero.delta ?? 0); // saldo antes del primer apunte

  const inicio = mesDe(desde || primero.fecha);
  const fin = mesDe(hasta || eventos[eventos.length - 1].fecha);
  if (fin < inicio) return [];

  const puntos: PuntoMensual[] = [];
  for (let mes = inicio; mes <= fin; mes = siguienteMes(mes)) {
    const cierre = cierres.get(mes);
    if (cierre !== undefined) ultimo = cierre;
    const [y, m] = mes.split('-').map(Number);
    puntos.push({ x: parseLocalDate(formatLocalDate(new Date(y, m - 1, 15))).getTime(), mes, y: ultimo });
  }
  return puntos;
}

/** Saldo proyectado en una fecha: el último apunte en o antes de ella. */
export function saldoEnFechaExtracto(eventos: EventoExtracto[], fecha: ISODate): number | null {
  let saldo: number | null = null;
  for (const ev of eventos) {
    if (ev.fecha > fecha) break;
    if (ev.saldoAcum !== undefined) saldo = ev.saldoAcum;
  }
  return saldo;
}
