// ── engine/dashboard ──────────────────────────────────────────────────────────
// Agregados del dashboard: totales del periodo, medias mensuales, métricas del
// mes en curso, resumen de préstamos e intereses de cuentas remuneradas.
//
// Todo esto vivía dentro de `render()` en `dashboard/dashboard.js` — 160 líneas
// de aritmética mezcladas con la plantilla, sin un solo test. Aquí son
// funciones puras que reciben el extracto ya proyectado, de modo que la vista
// (cuando se porte, tarea 1.7) solo tenga que pintar.
//
// Correcciones deliberadas respecto al legacy, todas con test:
//
//  · el rango del mes en curso se calcula en hora LOCAL. El legacy hacía
//    `new Date(y, m+1, 0).toISOString().slice(0,10)`, que en España devuelve el
//    día ANTERIOR: el último día del mes se quedaba fuera de los KPIs del mes,
//    y con él cualquier gasto o nómina que cayera en él. Lo mismo en
//    `_cuotasDelMes` para las cuotas de inicio y fin de periodo.
//  · "hoy" es inyectable en lugar de `new Date().toISOString()`, que además de
//    depender del huso adelantaba el día antes de las 02:00 en horario de
//    verano peninsular.

import { formatLocalDate, lastDayOfMonth, parseLocalDate, type ISODate } from '@/core/dates';
import { saldoRealCuenta } from '@/core/accounts';
import { resumenPrestamo, type LoanInput } from '@/core/loan';
import type { CashEvent } from './types';
import { sumarPorTags, type StatementAccount } from './statement';

/** Milisegundos de un mes medio; el legacy usa esta misma constante. */
const MS_MES = 30.44 * 86400000;

export interface ExpenseClasificable {
  _id: string;
  /** 'deseo' = gasto prescindible; null = excluido del cómputo; resto = necesidad. */
  clasificacion?: string | null;
}

export interface LoanDashboard extends LoanInput {
  _id: string;
  /** La vista lo necesita para anunciar los préstamos que terminan. */
  nombre?: string;
  activo?: boolean;
  simulacion?: boolean;
  tags?: string[];
  mostrarFechaFinEnDashboard?: boolean;
}

/** Rango [primer día, último día] del mes de una fecha, en hora local. */
export function rangoMesDe(fecha: Date): { desde: ISODate; hasta: ISODate } {
  const y = fecha.getFullYear();
  const m = fecha.getMonth();
  return { desde: formatLocalDate(new Date(y, m, 1)), hasta: formatLocalDate(new Date(y, m, lastDayOfMonth(y, m))) };
}

/** Rango del mes 'YYYY-MM', en hora local. */
export function rangoMes(mes: string): { desde: ISODate; hasta: ISODate } {
  const [y, m] = mes.split('-').map(Number);
  return rangoMesDe(new Date(y, m - 1, 1));
}

/** Meses (fraccionarios) que abarca un periodo; nunca menos de uno. */
export function mesesDelPeriodo(desde: ISODate, hasta: ISODate): number {
  return Math.max(1, (parseLocalDate(hasta).getTime() - parseLocalDate(desde).getTime()) / MS_MES);
}

/** Las transferencias entre cuentas propias no son ni gasto ni ingreso. */
export const sinTransferencias = (eventos: CashEvent[]): CashEvent[] =>
  eventos.filter((e) => e.sourceType !== 'transfer-out' && e.sourceType !== 'transfer-in');

const suma = (eventos: CashEvent[]) => eventos.reduce((s, e) => s + Math.abs(e.cuantia), 0);

/** Reparto de los gastos de estimaciones entre necesidad y deseo. */
function gastosPorClasificacion(eventos: CashEvent[], expenses: ExpenseClasificable[]): { basicos: number; deseo: number } {
  const clasePorId = new Map(expenses.map((e) => [e._id, e.clasificacion]));
  let basicos = 0;
  let deseo = 0;
  for (const ev of eventos) {
    if (ev.tipo !== 'gasto' || ev.sourceType !== 'expense') continue;
    const c = clasePorId.get(ev.sourceId ?? '');
    if (c === null) continue; // excluido del cómputo a propósito
    if (c === 'deseo') deseo += Math.abs(ev.cuantia);
    else basicos += Math.abs(ev.cuantia);
  }
  return { basicos, deseo };
}

export interface MetricasFlujo {
  ingresos: number;
  cuotas: number;
  cuotasHipoteca: number;
  amortizaciones: number;
  gastosBasicos: number;
  gastosDeseo: number;
  /** Todo lo que sale: cuotas + básicos + deseo. */
  gastosTotales: number;
  intereses: number;
}

export interface FlujoDeps {
  expenses: ExpenseClasificable[];
  /** Préstamos etiquetados como hipoteca, para poder excluirlos de la salud. */
  hipotecaIds: Set<string>;
  /**
   * Préstamos ya arrancados. Solo se usa en el mes en curso: una cuota de un
   * préstamo que empieza el año que viene no es un gasto de este mes.
   */
  loanIdsIniciados?: Set<string>;
  /** Divisor para pasar de total del periodo a media mensual (1 = totales). */
  entreMeses?: number;
}

/** Métricas de flujo de un conjunto de eventos, ya sin transferencias. */
export function metricasFlujo(eventos: CashEvent[], deps: FlujoDeps): MetricasFlujo {
  const div = deps.entreMeses && deps.entreMeses > 0 ? deps.entreMeses : 1;
  const esCuota = (e: CashEvent) => e.sourceType === 'loan' && e.tipo === 'gasto';
  const iniciados = deps.loanIdsIniciados;

  const ingresos = suma(eventos.filter((e) => e.tipo === 'ingreso'));
  const cuotas = suma(eventos.filter((e) => esCuota(e) && (!iniciados || iniciados.has(e.sourceId ?? ''))));
  const cuotasHipoteca = suma(eventos.filter((e) => esCuota(e) && deps.hipotecaIds.has(e.sourceId ?? '')));
  const amortizaciones = suma(eventos.filter((e) => e.sourceType === 'loan-amort'));
  const intereses = suma(eventos.filter((e) => e.sourceType === 'account-interest'));
  const { basicos, deseo } = gastosPorClasificacion(eventos, deps.expenses);

  return {
    ingresos: ingresos / div,
    cuotas: cuotas / div,
    cuotasHipoteca: cuotasHipoteca / div,
    amortizaciones: amortizaciones / div,
    gastosBasicos: basicos / div,
    gastosDeseo: deseo / div,
    gastosTotales: (cuotas + basicos + deseo) / div,
    intereses: intereses / div,
  };
}

// ── Préstamos ─────────────────────────────────────────────────────────────────

export interface ResumenPrestamosPeriodo {
  deudaInicio: number;
  deudaFin: number;
  /** Intereses que ahorran las amortizaciones hechas dentro del periodo. */
  ahorroIntereses: number;
  ahorroInteresesMes: number;
  cuotasInicio: number;
  cuotasFin: number;
  /** Préstamos que terminan dentro del periodo y quieren anunciarlo. */
  finEnPeriodo: { loan: LoanDashboard; fechaFin: ISODate }[];
}

/** Deuda viva sumando el capital pendiente de cada préstamo en una fecha. */
function deudaEnFecha(loans: LoanDashboard[], fecha: ISODate): number {
  return loans.reduce((s, l) => {
    const filas = resumenPrestamo(l).tabla.filter((r) => !r.esAmortizacion && r.fecha <= fecha);
    return s + (filas.length > 0 ? filas[filas.length - 1].capitalPendiente : l.capital || 0);
  }, 0);
}

export function resumenPrestamosPeriodo(loans: LoanDashboard[], desde: ISODate, hasta: ISODate, meses: number): ResumenPrestamosPeriodo {
  const activos = loans.filter((l) => l.activo && !l.simulacion && (l.fechaInicio || '') <= hasta);

  const ahorroIntereses = activos.reduce((s, l) => {
    const enPeriodo = (l.amortizaciones || []).filter((a) => a.fecha >= desde && a.fecha <= hasta);
    if (enPeriodo.length === 0) return s;
    const conAmort = resumenPrestamo(l).totalIntereses;
    const sinAmort = resumenPrestamo({
      ...l,
      amortizaciones: (l.amortizaciones || []).filter((a) => a.fecha < desde || a.fecha > hasta),
    }).totalIntereses;
    return s + Math.max(0, sinAmort - conAmort);
  }, 0);

  const finEnPeriodo = activos
    .filter((l) => l.mostrarFechaFinEnDashboard !== false)
    .map((l) => ({ loan: l, fechaFin: resumenPrestamo(l).fechaFin }))
    .filter((x): x is { loan: LoanDashboard; fechaFin: ISODate } => !!x.fechaFin && x.fechaFin >= desde && x.fechaFin <= hasta);

  const tablas = activos.map((l) => resumenPrestamo(l).tabla);
  const cuotasDelMes = (mes: string) => {
    const { desde: ini, hasta: fin } = rangoMes(mes);
    return tablas.reduce((s, tabla) => {
      const fila = tabla.find((r) => !r.esAmortizacion && r.fecha >= ini && r.fecha <= fin);
      return s + (fila ? fila.cuota : 0);
    }, 0);
  };

  return {
    deudaInicio: deudaEnFecha(activos, desde),
    deudaFin: deudaEnFecha(activos, hasta),
    ahorroIntereses,
    ahorroInteresesMes: meses > 0 ? ahorroIntereses / meses : 0,
    cuotasInicio: cuotasDelMes(desde.slice(0, 7)),
    cuotasFin: cuotasDelMes(hasta.slice(0, 7)),
    finEnPeriodo,
  };
}

// ── Intereses de cuentas remuneradas ──────────────────────────────────────────

export interface InteresPorCuenta {
  nombre: string;
  interes: number;
  total: number;
}

/** Intereses proyectados por cuenta en el periodo, de mayor a menor. */
export function interesesPorCuenta(eventos: CashEvent[], accounts: StatementAccount[]): InteresPorCuenta[] {
  return accounts
    .filter((a) => a.activo && (a.interes ?? 0) > 0)
    .map((a) => ({
      nombre: a.nombre,
      interes: a.interes as number,
      total: suma(eventos.filter((e) => e.sourceType === 'account-interest' && e.sourceId === a._id)),
    }))
    .filter((a) => a.total > 0)
    .sort((a, b) => b.total - a.total);
}

// ── Gasto por etiqueta, con grupos ────────────────────────────────────────────

/**
 * Cómo se reparte el gasto de un movimiento entre sus etiquetas cuando hay
 * "grupos de etiquetas" (`config.tagGrupos`):
 *
 *  · 'desglosado': la etiqueta de grupo se retira y el gasto cuenta bajo las
 *    demás. Si TODAS sus etiquetas eran de grupo, no cuenta en ningún sitio.
 *  · 'porgrupos': si el gasto lleva alguna etiqueta de grupo, cuenta solo bajo
 *    esas; si no, bajo las suyas normales.
 */
export type ModoGrupoTags = 'desglosado' | 'porgrupos';

/**
 * Gasto acumulado por etiqueta en el periodo.
 *
 * REGRESIÓN CORREGIDA (introducida el 2026-07-30, detectada el 2026-08-06):
 * esta función existía en `dashboard/dashboard.js` como `_tagMapConGrupos` y el
 * commit que retiró el gráfico de velas OHLC se la llevó por delante sin querer,
 * dejando las dos llamadas en pie. Desde entonces `renderChartTags` lanzaba
 * `ReferenceError` en cada pintado, y como las seis gráficas se dibujan en un
 * mismo `setTimeout`, se llevaba por delante también las cuatro siguientes:
 * solo sobrevivía la curva de saldo. Ahora vive aquí, con tests.
 */
export function sumarGastosPorTag(
  extracto: CashEvent[],
  grupoTags: Set<string> = new Set(),
  modo: ModoGrupoTags = 'desglosado',
): Map<string, number> {
  if (grupoTags.size === 0) return sumarPorTags(extracto, 'gasto');

  const mapa = new Map<string, number>();
  for (const ev of extracto) {
    if (ev.tipo !== 'gasto') continue;
    const tags = ev.tags || [];
    const deGrupo = tags.filter((t) => grupoTags.has(t));
    const sueltas = tags.filter((t) => !grupoTags.has(t));
    const efectivas = modo === 'porgrupos' && deGrupo.length > 0 ? deGrupo : sueltas;
    for (const tag of efectivas) mapa.set(tag, (mapa.get(tag) || 0) + Math.abs(ev.cuantia));
  }
  return mapa;
}

/** Etiquetas ordenadas por gasto, aplicando el filtro activo de la vista. */
export function gastoPorTagOrdenado(
  extracto: CashEvent[],
  opciones: { grupoTags?: Set<string>; modo?: ModoGrupoTags; activos?: Set<string>; entreMeses?: number } = {},
): { tag: string; total: number }[] {
  const activos = opciones.activos;
  const div = opciones.entreMeses && opciones.entreMeses > 0 ? opciones.entreMeses : 1;
  return [...sumarGastosPorTag(extracto, opciones.grupoTags, opciones.modo).entries()]
    .filter(([tag]) => !activos || activos.size === 0 || activos.has(tag))
    .map(([tag, total]) => ({ tag, total: total / div }))
    .sort((a, b) => b.total - a.total);
}

// ── Totales del periodo ───────────────────────────────────────────────────────

export interface TotalesPeriodo {
  saldoBase: number;
  saldoFinal: number;
  totalGastos: number;
  totalIngresos: number;
  tags: string[];
}

export function totalesPeriodo(extracto: CashEvent[], cuentasActivas: StatementAccount[]): TotalesPeriodo {
  const saldoBase = cuentasActivas.reduce((s, a) => s + saldoRealCuenta(a), 0);
  return {
    saldoBase,
    saldoFinal: extracto.length > 0 ? (extracto[extracto.length - 1].saldoAcum ?? saldoBase) : saldoBase,
    totalGastos: suma(extracto.filter((e) => e.tipo === 'gasto')),
    totalIngresos: suma(extracto.filter((e) => e.tipo === 'ingreso')),
    tags: [...new Set(extracto.flatMap((e) => e.tags || []))],
  };
}

/** Cuentas que entran en el dashboard según el filtro de la barra superior. */
export function cuentasVisibles(accounts: StatementAccount[], filtroAccounts: string[] | null): StatementAccount[] {
  return accounts.filter((a) => a.activo && (!filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(a._id)));
}

/** Préstamos etiquetados como hipoteca, según la etiqueta configurada. */
export function idsHipoteca(loans: LoanDashboard[], tagHipoteca = 'hipoteca'): Set<string> {
  return new Set(loans.filter((l) => (l.tags || []).includes(tagHipoteca)).map((l) => l._id));
}

/** Préstamos cuya primera cuota ya ha pasado. */
export function idsPrestamosIniciados(loans: LoanDashboard[], hoy: ISODate): Set<string> {
  return new Set(loans.filter((l) => (l.fechaInicio || '') <= hoy).map((l) => l._id));
}
