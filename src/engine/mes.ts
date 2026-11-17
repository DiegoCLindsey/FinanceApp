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
// sitio, no se gasta); los intereses de cuentas y fondos (ver RENDIMIENTOS);
// y el IRPF y la SS de una nómina en modo «detallado»:
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
  /** Gasto imprevisto: va a su propio bloque, antes que factura. */
  imprevisto?: boolean;
  fechaInicio?: ISODate;
}

/** Lo que hace falta de un movimiento real para contarlo como imprevisto. */
export interface MovimientoReal {
  _id: string;
  fecha: ISODate;
  concepto: string;
  importeCts: number;
  tipo?: string;
  estimacionId?: string | null;
  imprevisto?: boolean;
}

/**
 * ¿Este movimiento real cuenta como imprevisto? Solo si está marcado, es una
 * salida, no es un traspaso entre cuentas propias, y NO está asignado a una
 * estimación: asignado, ya cuenta a través de ella y se contaría dos veces.
 */
export function esMovimientoImprevisto(m: MovimientoReal): boolean {
  return m.imprevisto === true && m.importeCts < 0 && m.tipo !== 'transferencia' && !m.estimacionId;
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
  /** Lo marcado como imprevisto: gastos estimados y movimientos reales. */
  imprevistos: BloqueMes;
  /** Préstamos + facturas + otros + imprevistos. */
  gastosTotales: number;
  /**
   * Estimación de imprevistos aplicada a este mes (media de los últimos 12),
   * o null si no se aplicó ninguna. Solo se aplica al mes en curso.
   */
  estimacionImprevistos: number | null;
  /**
   * Lo que se aparta para imprevistos que aún no han llegado: la estimación
   * menos lo ya marcado este mes, nunca negativa.
   */
  reservaImprevistos: number;
  /** Ingresos netos − gastos totales − reserva para imprevistos. */
  margen: number;
  /** Margen sobre ingresos netos, en %. `null` sin ingresos. */
  margenPct: number | null;
}

const INTERNOS = new Set(['transfer-out', 'transfer-in', 'aportacion-out', 'aportacion-in']);
/**
 * Intereses y rentabilidad de cuentas y fondos: no cuentan como ingreso del
 * mes. No es dinero que entre para gastar —se queda en la propia cuenta, y en
 * un fondo ni siquiera es líquido— y en un fondo de inversión al 6 % podía
 * sumar cientos de euros de «margen de ahorro» que no existen. Además su
 * cálculo depende de desde qué fecha se genera el extracto (docs/14, BUG-28):
 * contarlo hacía que el mismo mes diera cifras distintas en la tarjeta y en el
 * histórico.
 */
const RENDIMIENTOS = new Set(['account-interest']);
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
export interface OpcionesDesglose {
  /** Movimientos reales de ESTE mes (se cuentan los imprevistos sin asignar). */
  movimientos?: MovimientoReal[];
  /** Estimación mensual de imprevistos a reservar este mes. */
  estimacionImprevistos?: number | null;
}

export function desgloseDelMes(
  eventos: CashEvent[],
  gastos: GastoClasificable[],
  prestamos: PrestamoNombrado[],
  hoy: ISODate,
  opciones: OpcionesDesglose = {},
): DesgloseMes {
  const gastoPorId = new Map(gastos.map((g) => [g._id, g]));
  const prestamoPorId = new Map(prestamos.map((p) => [p._id, p]));
  const propios = eventos.filter((e) => !INTERNOS.has(e.sourceType ?? '') && !RENDIMIENTOS.has(e.sourceType ?? ''));

  const ingresosBrutos = propios.filter((e) => e.tipo === 'ingreso').reduce((s, e) => s + cts(e.cuantia), 0);
  const retenciones = propios.filter(esRetencionNomina).reduce((s, e) => s + cts(e.cuantia), 0);

  const dePrestamo: CashEvent[] = [];
  const deFactura: CashEvent[] = [];
  const deImprevisto: CashEvent[] = [];
  const resto: CashEvent[] = [];
  for (const e of propios) {
    if (e.tipo !== 'gasto' || esRetencionNomina(e)) continue;
    const gasto = e.sourceType === 'expense' ? gastoPorId.get(e.sourceId ?? '') : undefined;
    if (e.sourceType === 'loan' || e.sourceType === 'loan-amort') dePrestamo.push(e);
    else if (gasto?.imprevisto) deImprevisto.push(e);
    else if (gasto && esFactura(gasto)) deFactura.push(e);
    else resto.push(e);
  }
  // Movimientos reales marcados como imprevisto, agrupados por concepto: tres
  // visitas al taller son UNA fila con tres cargos.
  for (const m of opciones.movimientos ?? []) {
    if (!esMovimientoImprevisto(m)) continue;
    const clave = sinAcentos(m.concepto).replace(/\s+/g, ' ').trim();
    deImprevisto.push({
      fecha: m.fecha,
      concepto: m.concepto,
      cuantia: m.importeCts / 100,
      tipo: 'gasto',
      tags: [],
      cuenta: '',
      sourceId: `mov:${clave}`,
      sourceType: 'movimiento',
    } as unknown as CashEvent);
  }

  const nombreGasto = (e: CashEvent) => gastoPorId.get(e.sourceId ?? '')?.concepto ?? e.concepto;
  const prestamosB = bloque(dePrestamo, hoy, (e) => prestamoPorId.get(e.sourceId ?? '')?.nombre ?? e.concepto);
  const facturasB = bloque(deFactura, hoy, nombreGasto);
  const otrosB = bloque(resto, hoy, nombreGasto);
  const imprevistosB = bloque(deImprevisto, hoy, nombreGasto);

  const ingresosCts = ingresosBrutos - retenciones;
  const gastosCts = cts(prestamosB.total) + cts(facturasB.total) + cts(otrosB.total) + cts(imprevistosB.total);
  const estimacion = opciones.estimacionImprevistos ?? null;
  const reservaCts = estimacion !== null ? Math.max(0, cts(estimacion) - cts(imprevistosB.total)) : 0;
  const ingresosNetos = ingresosCts / 100;
  const margen = (ingresosCts - gastosCts - reservaCts) / 100;
  return {
    ingresosNetos,
    prestamos: prestamosB,
    facturas: facturasB,
    otros: otrosB,
    imprevistos: imprevistosB,
    gastosTotales: gastosCts / 100,
    estimacionImprevistos: estimacion,
    reservaImprevistos: reservaCts / 100,
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

// ── Varios meses ──────────────────────────────────────────────────────────────

/** Meses `YYYY-MM` entre dos meses, ambos incluidos y en orden. */
export function mesesEntre(desde: string, hasta: string): string[] {
  const [y1, m1] = desde.split('-').map(Number);
  const [y2, m2] = hasta.split('-').map(Number);
  if (![y1, m1, y2, m2].every(Number.isFinite)) return [];
  const out: string[] = [];
  for (let y = y1, m = m1; y < y2 || (y === y2 && m <= m2); m === 12 ? ((m = 1), y++) : m++) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    if (out.length > 240) break; // 20 años: un periodo así es un error de entrada
  }
  return out;
}

/** Suma `n` meses a un mes `YYYY-MM` (n puede ser negativo). */
export function sumarMesesA(mes: string, n: number): string {
  const [y, m] = mes.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export interface DesgloseDeMes {
  mes: string;
  desglose: DesgloseMes;
}

/**
 * El desglose de `desgloseDelMes` para cada mes de la lista, a partir de un
 * único extracto que los cubra todos. Los meses sin ningún evento salen a cero:
 * un mes vacío también es un dato, y saltárselo descolocaría las barras.
 */
export function desglosePorMeses(
  eventos: CashEvent[],
  gastos: GastoClasificable[],
  prestamos: PrestamoNombrado[],
  meses: string[],
  hoy: ISODate,
  opciones: { movimientos?: MovimientoReal[]; estimacion?: { mes: string; importe: number } | null } = {},
): DesgloseDeMes[] {
  const porMes = new Map<string, CashEvent[]>(meses.map((m) => [m, []]));
  for (const e of eventos) porMes.get(e.fecha.slice(0, 7))?.push(e);
  const movsPorMes = new Map<string, MovimientoReal[]>(meses.map((m) => [m, []]));
  for (const m of opciones.movimientos ?? []) movsPorMes.get(m.fecha.slice(0, 7))?.push(m);
  return meses.map((mes) => ({
    mes,
    desglose: desgloseDelMes(porMes.get(mes) ?? [], gastos, prestamos, hoy, {
      movimientos: movsPorMes.get(mes),
      estimacionImprevistos: opciones.estimacion?.mes === mes ? opciones.estimacion.importe : null,
    }),
  }));
}

function sumarBloques(bloques: BloqueMes[]): BloqueMes {
  const porId = new Map<string, { concepto: string; total: number; vencido: number; fechas: ISODate[] }>();
  for (const b of bloques) {
    for (const p of b.partidas) {
      const acc = porId.get(p.id) ?? { concepto: p.concepto, total: 0, vencido: 0, fechas: [] };
      acc.total += cts(p.total);
      acc.vencido += cts(p.vencido);
      acc.fechas.push(...p.fechas);
      porId.set(p.id, acc);
    }
  }
  const partidas: PartidaMes[] = [...porId.entries()]
    .map(([id, p]) => ({ id, concepto: p.concepto, total: p.total / 100, vencido: p.vencido / 100, fechas: p.fechas.sort() }))
    .sort((a, b) => b.total - a.total || a.concepto.localeCompare(b.concepto));
  const total = [...porId.values()].reduce((s, p) => s + p.total, 0);
  const vencido = [...porId.values()].reduce((s, p) => s + p.vencido, 0);
  return { total: total / 100, vencido: vencido / 100, pendiente: (total - vencido) / 100, partidas };
}

/**
 * Acumulado de varios meses: cada bloque suma sus partidas por concepto (el
 * mismo gasto en seis meses es UNA fila con seis cargos), y el margen y su
 * porcentaje se recalculan sobre los totales, no se promedian.
 */
export function sumarDesgloses(lista: DesgloseMes[]): DesgloseMes {
  const prestamos = sumarBloques(lista.map((d) => d.prestamos));
  const facturas = sumarBloques(lista.map((d) => d.facturas));
  const otros = sumarBloques(lista.map((d) => d.otros));
  const imprevistos = sumarBloques(lista.map((d) => d.imprevistos));
  const ingresosCts = lista.reduce((s, d) => s + Math.round(d.ingresosNetos * 100), 0);
  const gastosCts = cts(prestamos.total) + cts(facturas.total) + cts(otros.total) + cts(imprevistos.total);
  const reservaCts = lista.reduce((s, d) => s + cts(d.reservaImprevistos), 0);
  const ingresosNetos = ingresosCts / 100;
  const margen = (ingresosCts - gastosCts - reservaCts) / 100;
  return {
    ingresosNetos,
    prestamos,
    facturas,
    otros,
    imprevistos,
    gastosTotales: gastosCts / 100,
    estimacionImprevistos: null,
    reservaImprevistos: reservaCts / 100,
    margen,
    margenPct: ingresosNetos > 0 ? (margen / ingresosNetos) * 100 : null,
  };
}

// ── Estimación de imprevistos ─────────────────────────────────────────────────

export interface EstimacionImprevistos {
  /** Lo que se espera gastar en imprevistos en un mes. */
  mediaMensual: number;
  /** Total marcado como imprevisto en la ventana. */
  total: number;
  /** Meses sobre los que se ha hecho la media (1–12; 0 si no hay datos). */
  meses: number;
  /** Primer y último mes de la ventana usada. */
  desde: string | null;
  hasta: string | null;
}

/**
 * Media mensual de lo marcado como imprevisto en los 12 meses ANTERIORES a
 * `mes` (el mes en curso no entra: está a medias y bajaría la media).
 *
 * Se divide entre 12, salvo que el seguimiento empezara hace menos: entonces
 * entre los meses que hay desde `primerDato` (el primer movimiento registrado
 * o el primer imprevisto, lo que sea antes). Dividir siempre entre 12 a quien
 * lleva dos meses usando la aplicación daría una estimación seis veces menor
 * que la real.
 */
export function estimarImprevistos(porMes: DesgloseDeMes[], mes: string, primerDato: ISODate | null): EstimacionImprevistos {
  const vacio: EstimacionImprevistos = { mediaMensual: 0, total: 0, meses: 0, desde: null, hasta: null };
  if (!primerDato) return vacio;
  const desdeVentana = sumarMesesA(mes, -12);
  const hastaVentana = sumarMesesA(mes, -1);
  const desde = primerDato.slice(0, 7) > desdeVentana ? primerDato.slice(0, 7) : desdeVentana;
  if (desde > hastaVentana) return vacio;
  const meses = mesesEntre(desde, hastaVentana);
  const totalCts = porMes.filter((m) => m.mes >= desde && m.mes <= hastaVentana).reduce((s, m) => s + cts(m.desglose.imprevistos.total), 0);
  return {
    mediaMensual: Math.round(totalCts / meses.length) / 100,
    total: totalCts / 100,
    meses: meses.length,
    desde,
    hasta: hastaVentana,
  };
}

export interface FuenteMes {
  /** Extracto estimado entre dos fechas, con los mismos filtros que la vista. */
  generarExtracto: (desde: ISODate, hasta: ISODate) => CashEvent[];
  gastos: GastoClasificable[];
  prestamos: PrestamoNombrado[];
  /** Movimientos reales (todos; aquí se filtran). */
  movimientos: MovimientoReal[];
  hoy: ISODate;
}

/** Último día de un mes `YYYY-MM`. */
export function finDeMes(mes: string): ISODate {
  const [y, m] = mes.split('-').map(Number);
  return `${mes}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
}

/** Primer dato de seguimiento: primer movimiento real o primer gasto imprevisto. */
export function primerDatoDeSeguimiento(f: Pick<FuenteMes, 'gastos' | 'movimientos'>): ISODate | null {
  let primero: string | null = null;
  for (const m of f.movimientos) if (!primero || m.fecha < primero) primero = m.fecha;
  for (const g of f.gastos) if (g.imprevisto && g.fechaInicio && (!primero || g.fechaInicio < primero)) primero = g.fechaInicio;
  return primero;
}

/** La estimación de imprevistos para `mes`, con el extracto de los 12 meses anteriores. */
export function estimacionImprevistosPara(mes: string, f: FuenteMes): EstimacionImprevistos {
  const meses = mesesEntre(sumarMesesA(mes, -12), sumarMesesA(mes, -1));
  const eventos = f.generarExtracto(`${meses[0]}-01`, finDeMes(meses[meses.length - 1]));
  const porMes = desglosePorMeses(eventos, f.gastos, f.prestamos, meses, f.hoy, { movimientos: f.movimientos });
  return estimarImprevistos(porMes, mes, primerDatoDeSeguimiento(f));
}

/**
 * Desglose del mes en curso con la reserva de imprevistos aplicada. Es lo que
 * pinta la tarjeta «Este mes»; la ventana de meses anteriores usa lo mismo.
 */
export function mesEnCurso(f: FuenteMes, eventosDelMes: CashEvent[]): { desglose: DesgloseMes; estimacion: EstimacionImprevistos } {
  const mes = f.hoy.slice(0, 7);
  const estimacion = estimacionImprevistosPara(mes, f);
  const movimientos = f.movimientos.filter((m) => m.fecha.startsWith(mes));
  const desglose = desgloseDelMes(eventosDelMes, f.gastos, f.prestamos, f.hoy, {
    movimientos,
    estimacionImprevistos: estimacion.meses > 0 ? estimacion.mediaMensual : null,
  });
  return { desglose, estimacion };
}
