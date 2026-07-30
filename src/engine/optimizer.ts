// ── engine/optimizer ──────────────────────────────────────────────────────────
// Planificador de amortizaciones anticipadas: mes a mes calcula el excedente
// disponible en la cuenta origen (respetando los márgenes de seguridad) y lo
// asigna a los préstamos con mayor TIN primero.
// Paridad exacta con FinanceMath.optimizarAmortizaciones / compararFrecuencias.
//
// OPTIMIZACIÓN (tarea 1.5) — medida: ~1,8× más rápido que el legacy en
// compararFrecuencias con 5 frecuencias y horizonte de 36 meses. Viene de:
//   1. `capPendienteAntes` usa `resumenPrestamo` (con caché) en lugar de
//      recalcular `tablaAmortizacion` en cada préstamo × mes. Es la ganancia
//      principal: la misma tabla se pedía decenas de veces.
//   2. `createStatementMemo` compartido entre las frecuencias del comparador,
//      que repiten proyecciones cuando sus planes parciales coinciden.
// Dentro de UNA corrida del optimizador el memo casi no ahorra: cada llamada
// combina una fecha y un plan distintos, así que las claves son únicas.
//
// Oportunidad pendiente (requiere golden test propio, no es paridad exacta):
// saldosAt() genera extractos anidados [hoy, dia15] para cada mes; un único
// extracto al horizonte completo, truncado por fecha, sería O(1) proyecciones
// en vez de O(meses) — pero el interés del último periodo se prorratea sobre el
// tramo truncado, así que truncar cambia decimales. Ver docs/02, tarea 6.3.
//
// QUIRK heredado: el optimizador proyecta SIN eventos de inflación (el legacy
// llama a generarExtracto sin periodos), aunque el módulo esté activo. Se
// conserva por paridad; corregirlo requiere un golden test dedicado.

import { formatLocalDate, todayISO, type ISODate } from '@/core/dates';
import { resumenPrestamo } from '@/core/loan';
import { saldoRealCuenta } from '@/core/accounts';
import { generarExtracto, type StatementAccount, type StatementConfig, type StatementInput } from './statement';
import { calcMargenEnFecha, type BasicoExpense, type BasicoLoan, type ColchonConfig, type MargenSeguridad } from './margins';
import type { LoanItem } from './providers/loans';
import type { CashEvent } from './types';

export interface OptimizerConfig extends StatementConfig, ColchonConfig {
  margenesSeguridad?: MargenSeguridad[];
}

export interface OptimizerOptions {
  frecuencia?: number;
  mesesHorizonte?: number;
  minAmortizable?: number;
  tipoAmort?: 'plazo' | 'cuota' | string;
  fechaPrimeraAmort?: ISODate | null;
  loanIds?: string[] | null;
  nominas?: StatementInput['nominas'];
  sourceAccountId?: string | null;
  selectedMarginIds?: string[] | null;
  /** Instante de referencia; el legacy usa `new Date()` interno. */
  hoy?: Date;
}

export interface PlanItem {
  mes: string;
  fechaAmort: ISODate;
  loanId: string;
  loanNombre: string;
  tin: number;
  capitalAntes: number;
  cantidadAmort: number;
  comision: number;
  capitalDespues: number;
  saldoDisponible: number;
  excedente: number;
  saldoDespues: number;
  tipoAmort: string;
}

export interface ResumenLoanOptimizado {
  loanId: string;
  nombre: string;
  tin: number;
  fechaFinSin: ISODate | '';
  fechaFinCon: ISODate | '';
  mesesAhorrados: number;
  interesesSin: number;
  interesesCon: number;
  ahorroIntereses: number;
  numAmortizaciones: number;
  totalAmortizado: number;
}

export interface OptimizerResult {
  plan: PlanItem[];
  margenesAplicados: number;
  totalAmortizado: number;
  totalComisiones: number;
  totalAhorroIntereses: number;
  resumenPorLoan: ResumenLoanOptimizado[];
}

/**
 * Memo de extractos con vida limitada a una corrida del optimizador. La clave
 * es la huella de contenido de los préstamos (lo único que cambia entre
 * llamadas) más el rango; las demás colecciones se identifican por referencia,
 * por lo que **no debe mutarse ninguna colección durante la corrida**.
 */
export function createStatementMemo() {
  const cache = new Map<string, CashEvent[]>();
  const refIds = new WeakMap<object, number>();
  let nextRefId = 1;
  let misses = 0;
  let hits = 0;

  const refId = (o: unknown): number => {
    if (!o || typeof o !== 'object') return 0;
    const existing = refIds.get(o as object);
    if (existing) return existing;
    const id = nextRefId++;
    refIds.set(o as object, id);
    return id;
  };

  const loansFingerprint = (loans: LoanItem[]): string =>
    loans
      .map((l) =>
        [l._id, l.capital, l.tin, l.meses, l.fechaInicio, l.comisionAmort || 0, l.comisionApertura || 0, l.diaPago || '', l.activo ? 1 : 0, l.cuenta || '',
          (l.amortizaciones || []).map((a) => `${a.fecha}:${a.cantidad}:${a.tipo || ''}`).sort().join(','),
        ].join('|'),
      )
      .join(';');

  function statement(input: StatementInput): CashEvent[] {
    const key = [
      loansFingerprint(input.loans),
      refId(input.expenses), refId(input.accounts), refId(input.nominas),
      refId(input.inflacionPeriodos),
      input.config.dashboardStart, input.config.dashboardEnd, input.config.fechaReferencia || '',
      input.config.usarInflacion ? 1 : 0,
      (input.filtroAccounts || []).join(','),
    ].join('#');
    const cached = cache.get(key);
    if (cached) {
      hits++;
      return cached;
    }
    misses++;
    const result = generarExtracto(input);
    cache.set(key, result);
    return result;
  }

  return { statement, stats: () => ({ hits, misses }), clear: () => cache.clear() };
}

export function optimizarAmortizaciones(
  loans: LoanItem[],
  expenses: BasicoExpense[],
  accounts: StatementAccount[],
  config: OptimizerConfig,
  options: OptimizerOptions = {},
  memo: ReturnType<typeof createStatementMemo> = createStatementMemo(),
): OptimizerResult {
  const {
    frecuencia = 1,
    mesesHorizonte = 36,
    minAmortizable = 500,
    tipoAmort = 'plazo',
    fechaPrimeraAmort = null,
    loanIds = null,
    nominas = [],
    sourceAccountId = null,
    selectedMarginIds = null,
    hoy = new Date(),
  } = options;

  const hoyStr = formatLocalDate(hoy);
  const horizonte = Math.min(120, Math.max(1, mesesHorizonte));

  const activeAccs = accounts.filter((a) => a.activo);
  const allActiveIds = activeAccs.map((a) => a._id);

  const principalAcc = activeAccs.find((a) => a.esCuentaPrincipal) || activeAccs[0];
  const srcAcc = sourceAccountId && allActiveIds.includes(sourceAccountId)
    ? activeAccs.find((a) => a._id === sourceAccountId)
    : principalAcc;
  const sourceAccId = srcAcc?._id;

  const loansActivos = loans
    .filter((l) => l.activo && !l.simulacion && (!loanIds || loanIds.includes(l._id)))
    .sort((a, b) => b.tin - a.tin);

  // selectedMarginIds: null o [] = aplicar todos; array no vacío = solo esos
  const hasMarginFilter = !!selectedMarginIds && selectedMarginIds.length > 0;
  const margenesAplicables = (config.margenesSeguridad || [])
    .filter((m) => m.activo !== false)
    .filter((m) => !m.cuentas || m.cuentas.length === 0 || m.cuentas.includes(sourceAccId as string))
    .filter((m) => !hasMarginFilter || (selectedMarginIds as string[]).includes(m._id as string));

  if (loansActivos.length === 0) {
    return { plan: [], margenesAplicados: margenesAplicables.length, totalAmortizado: 0, totalComisiones: 0, totalAhorroIntereses: 0, resumenPorLoan: [] };
  }

  const amortsPorLoan: Record<string, { _id: string; fecha: ISODate; cantidad: number; tipo: string; simulacion: boolean }[]> = {};
  for (const l of loansActivos) amortsPorLoan[l._id] = [];

  const plan: PlanItem[] = [];

  function mesInfo(i: number) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = `${year}-${String(month + 1).padStart(2, '0')}`;
    const dia15 = formatLocalDate(new Date(year, month, Math.min(15, new Date(year, month + 1, 0).getDate())));
    return { label, dia15 };
  }

  /** Capital pendiente justo antes de una fecha, con el plan ya acumulado. */
  function capPendienteAntes(loan: LoanItem, fechaAmort: ISODate): number {
    const amortizaciones = [...(loan.amortizaciones || []), ...amortsPorLoan[loan._id]];
    // resumenPrestamo aplica la misma tablaAmortizacion, pero con caché.
    const { tabla } = resumenPrestamo({ ...loan, amortizaciones });
    const filas = tabla.filter((r) => !r.esAmortizacion && r.fecha <= fechaAmort);
    if (filas.length > 0) return filas[filas.length - 1].capitalPendiente;
    const yaAmort = amortizaciones.filter((a) => a.fecha <= fechaAmort).reduce((s, a) => s + a.cantidad, 0);
    return Math.max(0, loan.capital - yaAmort);
  }

  /**
   * Saldo proyectado a una fecha (con el plan acumulado). La cuenta origen se
   * sigue con atribución proporcional de los eventos sin cuenta conocida.
   */
  function saldosAt(fecha: ISODate): { source: number; total: number } {
    const loansActualizados = loans.map((l) => ({ ...l, amortizaciones: [...(l.amortizaciones || []), ...(amortsPorLoan[l._id] || [])] }));
    const cfg = { ...config, dashboardStart: hoyStr, dashboardEnd: fecha };
    const ext = memo.statement({ loans: loansActualizados, expenses: expenses as StatementInput['expenses'], accounts, config: cfg, filtroAccounts: null, nominas });

    const totalBase = activeAccs.reduce((s, a) => s + saldoRealCuenta(a), 0);
    const sourceBase = srcAcc ? saldoRealCuenta(srcAcc) : 0;
    const srcFrac = totalBase > 0 ? sourceBase / totalBase : 1;

    let srcSaldo = sourceBase;
    let totalSaldo = totalBase;

    for (const ev of ext) {
      // delta lo fija el ancla de saldo: ingreso → +|cuantia|, gasto → −|cuantia|.
      // Usar cuantia directamente sumaría los gastos en vez de restarlos.
      const d = ev.delta ?? (ev.tipo === 'ingreso' ? Math.abs(ev.cuantia) : -Math.abs(ev.cuantia));
      if (ev.cuenta === sourceAccId) {
        srcSaldo += d;
      } else if (!allActiveIds.includes(ev.cuenta)) {
        srcSaldo += d * srcFrac;
      }
      totalSaldo = ev.saldoAcum as number;
    }

    return { source: srcSaldo, total: totalSaldo };
  }

  /** Máximo amortizable a una fecha: saldo origen menos el límite más restrictivo. */
  function maxAmortAt(fecha: ISODate): number {
    const { source } = saldosAt(fecha);
    if (source <= 0) return source;
    let maxTarget = 0;
    for (const mg of margenesAplicables) {
      const target = calcMargenEnFecha(mg, expenses, config, loans as BasicoLoan[], fecha, true, hoy);
      if (target > maxTarget) maxTarget = target;
    }
    return source - maxTarget;
  }

  const SAFETY_BUFFER = 2;

  let primerMesValido = 0;
  if (fechaPrimeraAmort) {
    for (let i = 0; i < horizonte; i++) {
      if (mesInfo(i).dia15 >= fechaPrimeraAmort) {
        primerMesValido = i;
        break;
      }
    }
  }

  for (let i = 0; i < horizonte; i++) {
    if ((i - primerMesValido) % frecuencia !== 0 || i < primerMesValido) continue;

    const { label, dia15 } = mesInfo(i);
    if (dia15 < hoyStr) continue;

    const excedente = maxAmortAt(dia15) - SAFETY_BUFFER;
    if (excedente < minAmortizable) continue;

    let excedentRestante = excedente;
    let totalAmortizadoEsteMes = 0;

    for (const loan of loansActivos) {
      if (excedentRestante < minAmortizable) break;

      const capActual = capPendienteAntes(loan, dia15);
      if (capActual < 1) continue;

      const comAmort = loan.comisionAmort || 0;
      const factorCom = 1 + comAmort / 100;
      const maxAmortNeto = Math.floor(excedentRestante / factorCom);
      const cantidadF = Math.min(maxAmortNeto, capActual);
      if (cantidadF < minAmortizable) continue;

      const cantidad = Math.min(Math.floor(cantidadF), Math.floor(capActual));
      const comision = +((cantidad * comAmort) / 100).toFixed(2);
      const costeTotal = cantidad + comision;
      if (costeTotal > excedentRestante) continue;

      amortsPorLoan[loan._id].push({ _id: `opt_${label}_${loan._id}`, fecha: dia15, cantidad, tipo: tipoAmort, simulacion: true });

      totalAmortizadoEsteMes += costeTotal;
      plan.push({
        mes: label, fechaAmort: dia15,
        loanId: loan._id, loanNombre: loan.nombre, tin: loan.tin,
        capitalAntes: capActual, cantidadAmort: cantidad, comision,
        capitalDespues: Math.max(0, capActual - cantidad),
        saldoDisponible: excedente + SAFETY_BUFFER, excedente,
        saldoDespues: excedente + SAFETY_BUFFER - totalAmortizadoEsteMes,
        tipoAmort,
      });

      excedentRestante -= costeTotal;
    }
  }

  const totalAmortizado = plan.reduce((s, p) => s + p.cantidadAmort, 0);
  const totalComisiones = plan.reduce((s, p) => s + p.comision, 0);

  const resumenPorLoan = loansActivos
    .map((loan): ResumenLoanOptimizado | null => {
      const amorts = amortsPorLoan[loan._id];
      if (!amorts.length) return null;
      const resSin = resumenPrestamo(loan);
      const resCon = resumenPrestamo({ ...loan, amortizaciones: [...(loan.amortizaciones || []), ...amorts] });
      return {
        loanId: loan._id, nombre: loan.nombre, tin: loan.tin,
        fechaFinSin: resSin.fechaFin, fechaFinCon: resCon.fechaFin,
        mesesAhorrados: resSin.mesesReales - resCon.mesesReales,
        interesesSin: resSin.totalIntereses, interesesCon: resCon.totalIntereses,
        ahorroIntereses: resSin.totalIntereses - resCon.totalIntereses,
        numAmortizaciones: amorts.length,
        totalAmortizado: amorts.reduce((s, a) => s + a.cantidad, 0),
      };
    })
    .filter((r): r is ResumenLoanOptimizado => r !== null);

  const totalAhorroIntereses = resumenPorLoan.reduce((s, r) => s + r.ahorroIntereses, 0);

  return { plan, margenesAplicados: margenesAplicables.length, totalAmortizado, totalComisiones, totalAhorroIntereses, resumenPorLoan };
}

export interface CompararOptions extends Omit<OptimizerOptions, 'frecuencia' | 'mesesHorizonte'> {
  horizonte?: number;
  fechaObjetivo?: ISODate | null;
  frecuencias?: number[];
}

export interface ComparativaFila {
  frecuencia: number;
  label: string;
  numAmortizaciones: number;
  totalAmortizado: number;
  totalComisiones: number;
  ahorroIntereses: number;
  saldoObjetivo: number;
  gananciaSaldo: number;
  valorTotal: number;
  plan: PlanItem[];
  resumenPorLoan: ResumenLoanOptimizado[];
  esMejorIntereses?: boolean;
  esMejorSaldo?: boolean;
  esMejorValor?: boolean;
}

/** Compara frecuencias de amortización por ahorro de intereses y saldo final. */
export function compararFrecuencias(
  loans: LoanItem[],
  expenses: BasicoExpense[],
  accounts: StatementAccount[],
  config: OptimizerConfig,
  options: CompararOptions = {},
): { resultados: ComparativaFila[]; saldoBase: number; fechaObjetivo: ISODate } {
  const {
    horizonte = 60,
    minAmortizable = 500,
    tipoAmort = 'plazo',
    fechaObjetivo = null,
    frecuencias = [1, 2, 3, 6, 12],
    fechaPrimeraAmort = null,
    loanIds = null,
    nominas = [],
    sourceAccountId = null,
    selectedMarginIds = null,
    hoy = new Date(),
  } = options;

  // Un único memo para toda la comparativa: las frecuencias comparten muchas
  // proyecciones intermedias (mismo plan parcial → mismo extracto).
  const memo = createStatementMemo();
  const hoyStr = formatLocalDate(hoy);
  const fechaObj = fechaObjetivo || formatLocalDate(new Date(hoy.getFullYear(), hoy.getMonth() + horizonte, 1));

  function saldoConPlan(amortsPorLoan: Record<string, { fecha: ISODate; cantidad: number; tipo: string; simulacion?: boolean }[]>): number {
    const loansConPlan = loans.map((l) => ({ ...l, amortizaciones: [...(l.amortizaciones || []), ...(amortsPorLoan[l._id] || [])] }));
    const cfgObj = { ...config, dashboardStart: hoyStr, dashboardEnd: fechaObj };
    const extracto = memo.statement({ loans: loansConPlan, expenses: expenses as StatementInput['expenses'], accounts, config: cfgObj, filtroAccounts: null, nominas });
    if (extracto.length === 0) {
      return accounts.filter((a) => a.activo).reduce((s, a) => s + saldoRealCuenta(a), 0);
    }
    const evs = extracto.filter((e) => e.fecha <= fechaObj);
    return (evs.length > 0 ? evs[evs.length - 1].saldoAcum : extracto[0].saldoAcum) as number;
  }

  const saldoBase = saldoConPlan({});

  const resultados = frecuencias
    .map((frec) => {
      const res = optimizarAmortizaciones(loans, expenses, accounts, config, {
        frecuencia: frec, mesesHorizonte: horizonte, minAmortizable, tipoAmort,
        fechaPrimeraAmort, loanIds, nominas, sourceAccountId, selectedMarginIds, hoy,
      }, memo);

      const amortsPorLoan: Record<string, { _id: string; fecha: ISODate; cantidad: number; tipo: string; simulacion: boolean }[]> = {};
      for (const l of loans) amortsPorLoan[l._id] = [];
      for (const p of res.plan) {
        amortsPorLoan[p.loanId].push({ _id: p.mes + '_' + p.loanId, fecha: p.fechaAmort, cantidad: p.cantidadAmort, tipo: tipoAmort, simulacion: true });
      }

      const saldo = saldoConPlan(amortsPorLoan);

      return {
        frecuencia: frec,
        label: frec === 1 ? 'Mensual' : `Cada ${frec} meses`,
        numAmortizaciones: res.plan.length,
        totalAmortizado: res.totalAmortizado,
        totalComisiones: res.totalComisiones,
        ahorroIntereses: res.totalAhorroIntereses,
        saldoObjetivo: saldo,
        gananciaSaldo: saldo - saldoBase,
        valorTotal: res.totalAhorroIntereses + (saldo - saldoBase),
        plan: res.plan,
        resumenPorLoan: res.resumenPorLoan,
      } as ComparativaFila;
    })
    .filter((r) => r.numAmortizaciones > 0);

  if (resultados.length > 0) {
    const maxIntereses = Math.max(...resultados.map((r) => r.ahorroIntereses));
    const maxSaldo = Math.max(...resultados.map((r) => r.saldoObjetivo));
    const maxValor = Math.max(...resultados.map((r) => r.valorTotal));
    resultados.forEach((r) => {
      r.esMejorIntereses = r.ahorroIntereses === maxIntereses;
      r.esMejorSaldo = r.saldoObjetivo === maxSaldo;
      r.esMejorValor = r.valorTotal === maxValor;
    });
  }

  return { resultados, saldoBase, fechaObjetivo: fechaObj };
}

/** Fecha de hoy por defecto para llamadas sin `hoy` explícito (conveniencia). */
export const defaultHoyISO = todayISO;
