// ── engine/mes ────────────────────────────────────────────────────────────────
// «¿Qué me espera este mes?» — los gastos previstos del mes en curso separados
// en lo que el usuario distingue de verdad:
//
//   · Préstamos       cuotas y amortizaciones
//   · Facturas        lo fijo y recurrente que llega solo: luz, alquiler, seguros…
//   · Otros gastos    lo demás: compra, ocio, puntuales
//   · Margen de ahorro   ingresos netos − los tres anteriores
//
// ── Qué es una «factura» ─────────────────────────────────────────────────────
// No hay un campo que lo diga en los datos que ya existen, así que se decide
// por este orden:
//
//   1. La marca explícita `esFactura` del gasto (sí / no) manda siempre.
//   2. Sin marca, tiene que ser RECURRENTE POR MESES (ni puntual ni «cada N
//      días»: la compra semanal no es una factura), y además cumplir una de:
//        a) el concepto o una etiqueta suena a recibo (luz, seguro, alquiler…);
//        b) tiene un día de cargo fijo y es una necesidad o un gasto básico.
//
// La regla (b) existe porque quien fija «el día 5» a un gasto está describiendo
// un cargo domiciliado. Sin día fijo, «Supermercado — mensual — necesidad» no
// entra: es un presupuesto, no un recibo.
//
// ── Qué NO cuenta como gasto del mes ─────────────────────────────────────────
// Transferencias y aportaciones entre cuentas propias (el dinero cambia de
// sitio, no se gasta), y el IRPF y la SS de una nómina en modo «detallado»:
// esos se restan de los ingresos para dar el neto, que es lo que llega al banco.

import type { ISODate } from '@/core/dates';
import type { CashEvent } from './types';

export interface GastoClasificable {
  _id: string;
  concepto?: string;
  tags?: string[];
  tipoFrecuencia?: string;
  frecuencia?: number;
  diaPago?: string;
  basico?: boolean;
  clasificacion?: string | null;
  /** Marca explícita del usuario. `undefined` = decidir automáticamente. */
  esFactura?: boolean;
}

export interface PrestamoNombrado {
  _id: string;
  nombre?: string;
}

/** Palabras que delatan un recibo. Se comparan sin acentos y por palabra entera. */
const PISTAS_FACTURA = [
  'luz', 'electricidad', 'gas', 'agua', 'internet', 'fibra', 'movil', 'telefono', 'telefonia', 'seguro', 'seguros',
  'comunidad', 'alquiler', 'ibi', 'basura', 'basuras', 'suscripcion', 'suscripciones', 'recibo', 'recibos', 'factura',
  'facturas', 'suministro', 'suministros', 'colegio', 'guarderia', 'academia', 'gimnasio', 'cuota', 'mutua', 'hipoteca',
  'netflix', 'spotify', 'hbo', 'disney', 'prime', 'icloud', 'youtube', 'iberdrola', 'endesa', 'naturgy', 'repsol',
  'movistar', 'vodafone', 'orange', 'digi', 'yoigo', 'masmovil', 'pepephone', 'calefaccion', 'alarma', 'parking', 'garaje',
]; // prettier-ignore

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PISTAS = new Set(PISTAS_FACTURA);

function suenaARecibo(g: GastoClasificable): boolean {
  const texto = sinAcentos([g.concepto ?? '', ...(g.tags ?? [])].join(' '));
  return texto.split(/[^a-z0-9]+/).some((palabra) => PISTAS.has(palabra));
}

/** ¿Este gasto estimado es una factura / recibo? Ver las reglas en la cabecera. */
export function esFactura(g: GastoClasificable | undefined): boolean {
  if (!g) return false;
  if (g.esFactura === true) return true;
  if (g.esFactura === false) return false;
  if ((g.tipoFrecuencia ?? 'mensual') !== 'mensual') return false;
  if (suenaARecibo(g)) return true;
  const diaFijo = !!g.diaPago && g.diaPago !== '';
  return diaFijo && (g.basico === true || g.clasificacion === 'necesidad');
}

export interface PartidaMes {
  /** Id de la estimación o del préstamo de origen. */
  id: string;
  concepto: string;
  total: number;
  /** Fechas de cargo dentro del mes, ordenadas. */
  fechas: ISODate[];
  /** Parte que ya ha vencido (fecha ≤ hoy). */
  vencido: number;
}

export interface BloqueMes {
  total: number;
  vencido: number;
  pendiente: number;
  partidas: PartidaMes[];
}

export interface DesgloseMes {
  /** Lo que entra de verdad: ingresos menos retenciones de nómina. */
  ingresosNetos: number;
  prestamos: BloqueMes;
  facturas: BloqueMes;
  otros: BloqueMes;
  gastosTotales: number;
  /** Ingresos netos − gastos totales. */
  margen: number;
  /** Margen sobre ingresos netos, en %. `null` sin ingresos. */
  margenPct: number | null;
}

const INTERNOS = new Set(['transfer-out', 'transfer-in', 'aportacion-out', 'aportacion-in']);
const esRetencionNomina = (e: CashEvent) => e.sourceType === 'nomina' && e.tipo === 'gasto';

/** Céntimos enteros para sumar: evita que 0,1 + 0,2 acabe en la pantalla. */
const cts = (n: number) => Math.round(Math.abs(n) * 100);

function bloque(eventos: CashEvent[], hoy: ISODate, nombre: (e: CashEvent) => string): BloqueMes {
  const porId = new Map<string, { concepto: string; total: number; vencido: number; fechas: ISODate[] }>();
  for (const e of eventos) {
    const id = e.sourceId ?? e.concepto;
    const p = porId.get(id) ?? { concepto: nombre(e), total: 0, vencido: 0, fechas: [] };
    const c = cts(e.cuantia);
    p.total += c;
    if (e.fecha <= hoy) p.vencido += c;
    p.fechas.push(e.fecha);
    porId.set(id, p);
  }
  const partidas: PartidaMes[] = [...porId.entries()]
    .map(([id, p]) => ({ id, concepto: p.concepto, total: p.total / 100, vencido: p.vencido / 100, fechas: p.fechas.sort() }))
    .sort((a, b) => b.total - a.total || a.concepto.localeCompare(b.concepto));
  const total = [...porId.values()].reduce((s, p) => s + p.total, 0);
  const vencido = [...porId.values()].reduce((s, p) => s + p.vencido, 0);
  return { total: total / 100, vencido: vencido / 100, pendiente: (total - vencido) / 100, partidas };
}

/**
 * Desglose de los eventos de UN mes natural.
 *
 * `eventos` debe ser el extracto de ese mes completo (del día 1 al último), no
 * un recorte del periodo que se esté mirando: así la cifra del mes no depende
 * de qué intervalo haya elegido el usuario ni de en qué día se consulte.
 */
export function desgloseDelMes(
  eventos: CashEvent[],
  gastos: GastoClasificable[],
  prestamos: PrestamoNombrado[],
  hoy: ISODate,
): DesgloseMes {
  const gastoPorId = new Map(gastos.map((g) => [g._id, g]));
  const prestamoPorId = new Map(prestamos.map((p) => [p._id, p]));
  const propios = eventos.filter((e) => !INTERNOS.has(e.sourceType ?? ''));

  const ingresosBrutos = propios.filter((e) => e.tipo === 'ingreso').reduce((s, e) => s + cts(e.cuantia), 0);
  const retenciones = propios.filter(esRetencionNomina).reduce((s, e) => s + cts(e.cuantia), 0);

  const dePrestamo: CashEvent[] = [];
  const deFactura: CashEvent[] = [];
  const resto: CashEvent[] = [];
  for (const e of propios) {
    if (e.tipo !== 'gasto' || esRetencionNomina(e)) continue;
    if (e.sourceType === 'loan' || e.sourceType === 'loan-amort') dePrestamo.push(e);
    else if (e.sourceType === 'expense' && esFactura(gastoPorId.get(e.sourceId ?? ''))) deFactura.push(e);
    else resto.push(e);
  }

  const nombreGasto = (e: CashEvent) => gastoPorId.get(e.sourceId ?? '')?.concepto ?? e.concepto;
  const prestamosB = bloque(dePrestamo, hoy, (e) => prestamoPorId.get(e.sourceId ?? '')?.nombre ?? e.concepto);
  const facturasB = bloque(deFactura, hoy, nombreGasto);
  const otrosB = bloque(resto, hoy, nombreGasto);

  const ingresosNetos = (ingresosBrutos - retenciones) / 100;
  const gastosTotales = (cts(prestamosB.total) + cts(facturasB.total) + cts(otrosB.total)) / 100;
  const margen = (Math.round(ingresosNetos * 100) - Math.round(gastosTotales * 100)) / 100;
  return {
    ingresosNetos,
    prestamos: prestamosB,
    facturas: facturasB,
    otros: otrosB,
    gastosTotales,
    margen,
    margenPct: ingresosNetos > 0 ? (margen / ingresosNetos) * 100 : null,
  };
}

/**
 * Meses que abarca un periodo, contados POR CALENDARIO y con los dos extremos
 * incluidos (que es como se generan los eventos).
 *
 * Antes se dividía la diferencia en milisegundos entre 30,44 días. Eso hace que
 * las medias mensuales «bailen»: del 1 de septiembre al 31 de diciembre del año
 * siguiente son 16 meses exactos, pero salían 15,97; y mover el periodo un par
 * de días cambiaba todas las medias aunque no entrara ni saliera ningún cargo.
 * Aquí un periodo de meses naturales completos da SIEMPRE un entero, y el pico
 * que sobra se mide en días del mes en que cae.
 */
export function mesesDeCalendario(desde: ISODate, hasta: ISODate): number {
  const [y1, m1, d1] = desde.split('-').map(Number);
  const [y2, m2, d2] = hasta.split('-').map(Number);
  if (![y1, m1, d1, y2, m2, d2].every(Number.isFinite) || hasta < desde) return 1;
  // Se trabaja con el día SIGUIENTE al final: [desde, hasta] ≡ [desde, fin).
  const fin = new Date(y2, m2 - 1, d2 + 1);
  let enteros = (fin.getFullYear() - y1) * 12 + (fin.getMonth() + 1 - m1);
  // El día `d1` puede no existir en el mes de llegada (31 → febrero): se acota.
  const ancla = (meses: number) => {
    const base = new Date(y1, m1 - 1 + meses, 1);
    const ultimo = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    return new Date(base.getFullYear(), base.getMonth(), Math.min(d1, ultimo));
  };
  if (ancla(enteros).getTime() > fin.getTime()) enteros -= 1;
  const desdeAncla = ancla(enteros);
  const diasResto = Math.round((fin.getTime() - desdeAncla.getTime()) / 86400000);
  const diasDelMes = new Date(desdeAncla.getFullYear(), desdeAncla.getMonth() + 1, 0).getDate();
  return Math.max(1 / 31, enteros + diasResto / diasDelMes);
}
