// ── informe/modelo ────────────────────────────────────────────────────────────
// «Crear informe»: el cálculo. Puro: entran datos, sale el informe; el HTML
// está en `informe/html.ts`.
//
// El informe responde a dos preguntas, y tiene que poder sumarse a mano:
//
//   1. ¿Cuadra el pasado con el futuro? Un único puente de saldo, partido en
//      «hoy»: el pasado sale de las cuentas reales y el futuro de la previsión,
//      y el saldo real de hoy es a la vez el final de uno y el arranque del
//      otro. Cada tramo se cierra con su residuo NOMBRADO (traspasos, saldos
//      anotados…), nunca con un «otros» que esconda una diferencia.
//
//   2. ¿Qué se previó y qué pasó? Para el tramo pasado, lo previsto (las
//      estimaciones, nóminas y cuotas del cierre de mes) frente a lo que
//      registran las cuentas, por grupo, por mes y por estimación.
//
// Fuentes, y por qué cada una:
//   · pasado real  → el libro de movimientos (`ledger`), que es la verdad del
//     pasado desde F4; una cuenta sin ningún dato en él cae a su saldo inicial;
//   · pasado previsto → `cerrarPeriodo`, el mismo cálculo del cierre de mes,
//     para que el informe y esa pantalla digan lo mismo;
//   · futuro → el extracto del motor, el mismo que el cuadro de mando.

import { formatLocalDate, parseLocalDate, sumarDias, todayISO, type ISODate } from '@/core/dates';
import { formatEUR, roundMoney } from '@/core/money';
import {
  cerrarPeriodo,
  claveConcepto,
  type CierreMes,
  type FilaCierre,
  type GrupoSinEstimacion,
  type OpcionesCierre,
} from '@/accounting/cierre-mes';
import type { Ledger } from '@/accounting/ledger';
import { desgloseDelMes, esFactura, finDeMes, mesesEntre, type EstimacionImprevistos } from '@/engine/mes';
import type { CashEvent } from '@/engine/types';
import type { Account, Expense, Transaccion } from '@/state/schema';

// ── Entrada ───────────────────────────────────────────────────────────────────

export interface EntradaInforme {
  desde: ISODate;
  hasta: ISODate;
  hoy?: ISODate;
  /** Nombre del proyecto, para la cabecera. */
  proyecto: string;
  /** Cuentas incluidas (normalmente, las activas). */
  cuentas: Account[];
  gastos: Expense[];
  ledger: Ledger;
  /**
   * Extracto estimado entre dos fechas, anclado en `fechaReferencia`. Debe ser
   * el MISMO motor que el cuadro de mando (FinanceMath en el navegador).
   */
  generarExtracto: (desde: ISODate, hasta: ISODate, fechaReferencia: ISODate) => CashEvent[];
  /** Saldo de una cuenta que no tiene datos en el libro (su saldo inicial). */
  saldoSinLibro: (cuenta: Account, fecha: ISODate) => number;
  /** Opciones del cierre: nóminas, préstamos, tramos, conceptos omitidos. */
  opcionesCierre: OpcionesCierre;
  /** Estimación de imprevistos, para la reserva del tramo futuro. */
  imprevistos?: EstimacionImprevistos | null;
  /** Imprevistos ya marcados en el mes en curso (para no reservarlos dos veces). */
  imprevistosMesEnCurso?: number;
  /**
   * Lo que enseña el cuadro de mando para el mismo periodo: su saldo de hoy y
   * su saldo final. Si no coinciden con los del informe, se dice de dónde sale
   * la diferencia (el cuadro de mando arranca de su propio saldo de hoy).
   */
  cuadroDeMando?: { saldoHoy: number; saldoFinal: number } | null;
}

// ── Salida ────────────────────────────────────────────────────────────────────

export interface PasoPuente {
  concepto: string;
  /** Explicación corta, para el informe. */
  nota?: string;
  importe: number;
  /** Subtotal: se pinta como saldo, no como movimiento. */
  saldo?: boolean;
}

export interface FilaMes {
  mes: string;
  tipo: 'real' | 'en-curso' | 'previsto';
  saldoInicial: number;
  ingresos: number;
  gastos: number;
  /** ingresos − gastos */
  neto: number;
  /** Lo que mueve el saldo sin ser ingreso ni gasto: saldoFinal − saldoInicial − neto. */
  otros: number;
  saldoFinal: number;
  /** Solo en los meses con pasado: lo previsto para ese tramo y la desviación del neto. */
  netoPrevisto?: number;
  desviacion?: number;
}

export type Grupo = 'ingresos' | 'prestamos' | 'facturas' | 'otros' | 'imprevistos' | 'sinPrever';

export interface FilaGrupo {
  grupo: Grupo;
  nombre: string;
  previsto: number;
  real: number;
  desviacion: number;
}

export interface FilaCuenta {
  _id: string;
  nombre: string;
  saldoInicio: number;
  saldoHoy: number;
  saldoFinal: number;
  /** Último dato real (movimiento o saldo anotado), o null si no hay ninguno. */
  ultimoDato: ISODate | null;
  /** De dónde sale el saldo real: el libro de movimientos o el saldo inicial. */
  fuente: 'movimientos' | 'saldo inicial';
}

export interface Comprobacion {
  ok: boolean;
  texto: string;
}

export interface Informe {
  proyecto: string;
  generadoEl: string;
  desde: ISODate;
  hasta: ISODate;
  hoy: ISODate;
  /** Fecha de corte efectiva: el pasado llega hasta aquí (incluida). */
  corte: ISODate;
  tienePasado: boolean;
  tieneFuturo: boolean;
  saldoInicio: number;
  saldoHoy: number;
  saldoFinal: number;
  reservaImprevistos: number;
  saldoFinalConReserva: number;
  /** Lo que debías tener hoy según lo previsto desde el inicio del periodo. */
  saldoHoyPrevisto: number;
  puente: PasoPuente[];
  meses: FilaMes[];
  grupos: FilaGrupo[];
  /** Estimaciones que más se desviaron en el pasado. */
  desviaciones: FilaCierre[];
  sinPrever: GrupoSinEstimacion[];
  totalSinPrever: number;
  cuentas: FilaCuenta[];
  minimo: { saldo: number; fecha: ISODate } | null;
  /** Serie para la gráfica: saldo real, previsto desde el inicio y previsión. */
  serie: { fecha: ISODate; real?: number; previstoInicio?: number; prevision?: number }[];
  comprobaciones: Comprobacion[];
  avisos: string[];
  imprevistos: EstimacionImprevistos | null;
  /** El cierre del tramo pasado, por si la vista quiere más detalle. */
  cierre: CierreMes | null;
}

// ── Utilidades ────────────────────────────────────────────────────────────────

const cts = (n: number) => Math.round(n * 100);
const eur = (c: number) => c / 100;
const efecto = (e: CashEvent) => (e.tipo === 'ingreso' ? Math.abs(e.cuantia) : -Math.abs(e.cuantia));
const minFecha = (a: ISODate, b: ISODate) => (a < b ? a : b);
const maxFecha = (a: ISODate, b: ISODate) => (a > b ? a : b);
const INTERNOS = new Set(['transfer-out', 'transfer-in', 'aportacion-out', 'aportacion-in']);

/** Ledger que solo ve los movimientos de las cuentas incluidas. */
function ledgerDeCuentas(ledger: Ledger, ids: Set<string>): Ledger {
  return { ...ledger, transacciones: (f = {}) => ledger.transacciones(f).filter((t) => ids.has(t.cuentaId)) };
}

// ── Construcción ──────────────────────────────────────────────────────────────

export function construirInforme(e: EntradaInforme): Informe {
  const hoy = e.hoy ?? todayISO();
  const desde = e.desde;
  const hasta = e.hasta < e.desde ? e.desde : e.hasta;
  const vispera = sumarDias(desde, -1);
  // El pasado llega hasta hoy incluido, sin salirse del periodo.
  const corte = hoy < desde ? vispera : minFecha(hoy, hasta);
  const tienePasado = corte >= desde;
  const tieneFuturo = corte < hasta;
  const ids = new Set(e.cuentas.map((c) => c._id));
  const ledger = ledgerDeCuentas(e.ledger, ids);
  const omitidos = new Set(e.opcionesCierre.omitidos ?? []);

  // ── Saldo real de cada cuenta en una fecha ────────────────────────────────
  const conLibro = new Set(
    e.cuentas
      .filter((c) => e.ledger.puntosControl(c._id).length > 0 || e.ledger.transacciones({ cuentaId: c._id }).length > 0)
      .map((c) => c._id),
  );
  const saldoReal = (c: Account, fecha: ISODate) => (conLibro.has(c._id) ? e.ledger.saldoCuenta(c._id, fecha) : e.saldoSinLibro(c, fecha));
  const saldoRealTotal = (fecha: ISODate) => eur(e.cuentas.reduce((s, c) => s + cts(saldoReal(c, fecha)), 0));
  const ultimoDato = (c: Account, fecha: ISODate): ISODate | null => {
    if (!conLibro.has(c._id)) return c.fechaInicialSaldo || null;
    const fechas = [
      ...e.ledger
        .puntosControl(c._id)
        .filter((p) => p.origen !== 'derivado' && p.fecha <= fecha)
        .map((p) => p.fecha),
      ...e.ledger.transacciones({ cuentaId: c._id, hasta: fecha }).map((t) => t.fecha),
    ];
    return fechas.length ? fechas.sort().pop()! : null;
  };

  const saldoInicio = saldoRealTotal(vispera);
  const saldoHoy = tienePasado ? saldoRealTotal(corte) : saldoInicio;

  // ── Pasado real: los movimientos, clasificados ───────────────────────────
  const clasificar = (lista: Transaccion[]) => {
    let ingresos = 0;
    let gastos = 0;
    let traspasos = 0;
    let omitido = 0;
    for (const t of lista) {
      if (t.tipo === 'transferencia') traspasos += t.importeCts;
      else if (omitidos.has(claveConcepto(t.concepto))) omitido += t.importeCts;
      else if (t.importeCts > 0) ingresos += t.importeCts;
      else gastos -= t.importeCts;
    }
    return { ingresos, gastos, traspasos, omitido };
  };
  const movsPasado = tienePasado ? ledger.transacciones({ desde, hasta: corte }) : [];
  const realPasado = clasificar(movsPasado);
  const cierre = tienePasado ? cerrarPeriodo(ledger, e.gastos, desde, corte, { ...e.opcionesCierre, hoy }) : null;

  // ── Futuro: el extracto del motor, anclado hoy ────────────────────────────
  const inicioFuturo = tieneFuturo ? maxFecha(sumarDias(corte, 1), desde) : hasta;
  const eventosFuturo = tieneFuturo
    ? e
        .generarExtracto(inicioFuturo, hasta, inicioFuturo)
        .filter((ev) => ev.fecha >= inicioFuturo && ev.fecha <= hasta && (!ev.cuenta || ids.has(ev.cuenta) || !ev.cuenta))
    : [];
  const efectoFuturo = eventosFuturo.reduce((s, ev) => s + cts(efecto(ev)), 0);
  const saldoFinal = eur(cts(saldoHoy) + efectoFuturo);

  const desgloseFuturo = (evs: CashEvent[]) => {
    const d = desgloseDelMes(evs, e.gastos, e.opcionesCierre.loans ?? [], hoy);
    const total = evs.reduce((s, ev) => s + cts(efecto(ev)), 0);
    const ingresos = cts(d.ingresosNetos);
    const gastos = cts(d.gastosTotales);
    const rentabilidad = evs.filter((ev) => ev.sourceType === 'account-interest').reduce((s, ev) => s + cts(efecto(ev)), 0);
    const internos = evs.filter((ev) => INTERNOS.has(ev.sourceType)).reduce((s, ev) => s + cts(efecto(ev)), 0);
    return { d, total, ingresos, gastos, rentabilidad, internos, resto: total - (ingresos - gastos) - rentabilidad - internos };
  };
  const futuro = desgloseFuturo(eventosFuturo);

  // ── Reserva para imprevistos del tramo futuro ─────────────────────────────
  // El mes en curso reserva lo que falte hasta la estimación (como la tarjeta
  // «Este mes»); los siguientes, la estimación entera, o la parte proporcional
  // si el periodo acaba a mitad de mes.
  let reservaCts = 0;
  const media = e.imprevistos && e.imprevistos.meses > 0 ? e.imprevistos.mediaMensual : 0;
  if (tieneFuturo && media > 0) {
    for (const mes of mesesEntre(inicioFuturo.slice(0, 7), hasta.slice(0, 7))) {
      if (mes === hoy.slice(0, 7)) {
        reservaCts += Math.max(0, cts(media) - cts(e.imprevistosMesEnCurso ?? 0));
        continue;
      }
      const ini = maxFecha(`${mes}-01`, inicioFuturo);
      const fin = minFecha(finDeMes(mes), hasta);
      const diasMes = Number(finDeMes(mes).slice(8, 10));
      const dias = Math.round((parseLocalDate(fin).getTime() - parseLocalDate(ini).getTime()) / 86400000) + 1;
      reservaCts += Math.round((cts(media) * dias) / diasMes);
    }
  }
  const reservaImprevistos = eur(reservaCts);

  // ── Lo previsto para el pasado, anclado en el saldo real del inicio ───────
  const netoPrevistoPasado = cierre ? cts(cierre.netoEstimado) : 0;
  const saldoHoyPrevisto = eur(cts(saldoInicio) + netoPrevistoPasado);

  // ── Puente ────────────────────────────────────────────────────────────────
  const ajusteSaldos =
    cts(saldoHoy) - (cts(saldoInicio) + realPasado.ingresos - realPasado.gastos + realPasado.traspasos + realPasado.omitido);
  const puente: PasoPuente[] = [{ concepto: `Saldo real al empezar (${vispera})`, importe: saldoInicio, saldo: true }];
  if (tienePasado) {
    puente.push(
      { concepto: 'Ingresos reales', importe: eur(realPasado.ingresos) },
      { concepto: 'Gastos reales', importe: -eur(realPasado.gastos) },
    );
    if (realPasado.traspasos)
      puente.push({
        concepto: 'Traspasos entre cuentas',
        nota: 'deberían sumar cero; si no, falta un lado',
        importe: eur(realPasado.traspasos),
      });
    if (realPasado.omitido) puente.push({ concepto: 'Conceptos omitidos en el cierre', importe: eur(realPasado.omitido) });
    if (ajusteSaldos) {
      puente.push({
        concepto: 'Ajuste por saldos anotados',
        nota: 'saldos reales anotados a mano y cuentas sin movimientos: lo que no explican los movimientos registrados',
        importe: eur(ajusteSaldos),
      });
    }
    puente.push({ concepto: `Saldo real hoy (${corte})`, importe: saldoHoy, saldo: true });
  }
  if (tieneFuturo) {
    puente.push(
      { concepto: 'Ingresos previstos', nota: 'netos de retenciones de nómina', importe: eur(futuro.ingresos) },
      { concepto: 'Gastos previstos', importe: -eur(futuro.gastos) },
    );
    if (futuro.rentabilidad) puente.push({ concepto: 'Intereses y rentabilidad previstos', importe: eur(futuro.rentabilidad) });
    if (futuro.internos) puente.push({ concepto: 'Movimientos entre cuentas previstos', importe: eur(futuro.internos) });
    if (futuro.resto) puente.push({ concepto: 'Otros movimientos previstos', importe: eur(futuro.resto) });
    puente.push({ concepto: `Saldo previsto al final (${hasta})`, importe: saldoFinal, saldo: true });
    if (reservaCts > 0) {
      puente.push(
        {
          concepto: 'Reserva para imprevistos',
          nota: e.imprevistos ? `media de ${e.imprevistos.meses} meses` : undefined,
          importe: -reservaImprevistos,
        },
        { concepto: 'Saldo previsto con la reserva', importe: eur(cts(saldoFinal) - reservaCts), saldo: true },
      );
    }
  }

  // ── Mes a mes ─────────────────────────────────────────────────────────────
  const meses: FilaMes[] = [];
  let saldoCorriente = cts(saldoInicio);
  for (const mes of mesesEntre(desde.slice(0, 7), hasta.slice(0, 7))) {
    const ini = maxFecha(`${mes}-01`, desde);
    const fin = minFecha(finDeMes(mes), hasta);
    const saldoIni = saldoCorriente;
    let ingresos = 0;
    let gastos = 0;
    let saldoFin: number;
    let netoPrevisto: number | undefined;
    const pasadoDelMes = ini <= corte;
    const futuroDelMes = fin > corte;
    if (pasadoDelMes) {
      const finPasado = minFecha(fin, corte);
      const c = cerrarPeriodo(ledger, e.gastos, ini, finPasado, { ...e.opcionesCierre, hoy });
      ingresos += cts(c.ingresosReales);
      gastos += cts(c.real);
      netoPrevisto = cts(c.netoEstimado);
      saldoFin = cts(saldoRealTotal(finPasado));
    } else {
      saldoFin = saldoIni;
    }
    if (futuroDelMes) {
      const evs = eventosFuturo.filter((ev) => ev.fecha >= maxFecha(ini, inicioFuturo) && ev.fecha <= fin);
      const f = desgloseFuturo(evs);
      ingresos += f.ingresos;
      gastos += f.gastos;
      saldoFin += f.total;
    }
    const neto = ingresos - gastos;
    meses.push({
      mes,
      tipo: pasadoDelMes && futuroDelMes ? 'en-curso' : pasadoDelMes ? 'real' : 'previsto',
      saldoInicial: eur(saldoIni),
      ingresos: eur(ingresos),
      gastos: eur(gastos),
      neto: eur(neto),
      otros: eur(saldoFin - saldoIni - neto),
      saldoFinal: eur(saldoFin),
      ...(netoPrevisto !== undefined && !futuroDelMes ? { netoPrevisto: eur(netoPrevisto), desviacion: eur(neto - netoPrevisto) } : {}),
    });
    saldoCorriente = saldoFin;
  }

  // ── Previsto frente a real, por grupo ─────────────────────────────────────
  const grupos: FilaGrupo[] = [];
  if (cierre) {
    const gastoPorId = new Map(e.gastos.map((g) => [g._id, g]));
    const grupoDe = (f: FilaCierre): Grupo => {
      if (f.tipo === 'ingreso') return 'ingresos';
      if (f.origen === 'prestamo') return 'prestamos';
      const g = gastoPorId.get(f.estimacionId);
      if (g?.imprevisto) return 'imprevistos';
      if (g && esFactura(g)) return 'facturas';
      return 'otros';
    };
    const nombres: Record<Grupo, string> = {
      ingresos: 'Ingresos',
      prestamos: 'Préstamos',
      facturas: 'Facturas',
      otros: 'Otros gastos',
      imprevistos: 'Imprevistos previstos',
      sinPrever: 'Gasto sin prever',
    };
    const acc = new Map<Grupo, { previsto: number; real: number }>();
    for (const f of cierre.filas) {
      const g = grupoDe(f);
      const v = acc.get(g) ?? { previsto: 0, real: 0 };
      v.previsto += cts(f.estimado);
      v.real += cts(f.real);
      acc.set(g, v);
    }
    acc.set('sinPrever', { previsto: 0, real: cts(cierre.totalSinEstimacion) });
    const ingresosSinPrever = cts(cierre.totalIngresosSinPrever);
    if (ingresosSinPrever) {
      const v = acc.get('ingresos') ?? { previsto: 0, real: 0 };
      v.real += ingresosSinPrever;
      acc.set('ingresos', v);
    }
    for (const g of ['ingresos', 'prestamos', 'facturas', 'otros', 'imprevistos', 'sinPrever'] as Grupo[]) {
      const v = acc.get(g);
      if (!v || (v.previsto === 0 && v.real === 0)) continue;
      grupos.push({ grupo: g, nombre: nombres[g], previsto: eur(v.previsto), real: eur(v.real), desviacion: eur(v.real - v.previsto) });
    }
  }

  // ── Cuentas ───────────────────────────────────────────────────────────────
  const efectoPorCuenta = new Map<string, number>();
  for (const ev of eventosFuturo) efectoPorCuenta.set(ev.cuenta || '', (efectoPorCuenta.get(ev.cuenta || '') ?? 0) + cts(efecto(ev)));
  const cuentas: FilaCuenta[] = e.cuentas.map((c) => {
    const ini = saldoReal(c, vispera);
    const hoyC = tienePasado ? saldoReal(c, corte) : ini;
    return {
      _id: c._id,
      nombre: c.nombre,
      saldoInicio: roundMoney(ini),
      saldoHoy: roundMoney(hoyC),
      saldoFinal: eur(cts(hoyC) + (efectoPorCuenta.get(c._id) ?? 0)),
      ultimoDato: ultimoDato(c, corte),
      fuente: conLibro.has(c._id) ? 'movimientos' : 'saldo inicial',
    };
  });
  const sinCuenta = efectoPorCuenta.get('') ?? 0;

  // ── Mínimo previsto y serie para la gráfica ───────────────────────────────
  let minimo: Informe['minimo'] = null;
  if (tieneFuturo) {
    let s = cts(saldoHoy);
    minimo = { saldo: saldoHoy, fecha: corte < desde ? desde : corte };
    for (const ev of [...eventosFuturo].sort((a, b) => a.fecha.localeCompare(b.fecha))) {
      s += cts(efecto(ev));
      if (eur(s) < minimo.saldo) minimo = { saldo: eur(s), fecha: ev.fecha };
    }
  }
  const serie: Informe['serie'] = [
    { fecha: vispera, real: saldoInicio, ...(tienePasado ? { previstoInicio: saldoInicio } : { prevision: saldoInicio }) },
  ];
  let previstoCorriente = cts(saldoInicio);
  for (const m of meses) {
    const fin = minFecha(finDeMes(m.mes), hasta);
    if (m.tipo === 'real') {
      previstoCorriente += cts(m.netoPrevisto ?? 0);
      serie.push({ fecha: fin, real: m.saldoFinal, previstoInicio: eur(previstoCorriente) });
    } else if (m.tipo === 'en-curso') {
      serie.push({ fecha: corte, real: saldoHoy, previstoInicio: saldoHoyPrevisto, prevision: saldoHoy });
      serie.push({ fecha: fin, prevision: m.saldoFinal });
    } else {
      serie.push({ fecha: fin, prevision: m.saldoFinal });
    }
  }
  // Si el corte cae justo en fin de mes, el último real ya es «hoy»: que la
  // previsión arranque de ahí.
  const ultimoReal = [...serie].reverse().find((p) => p.real !== undefined);
  if (ultimoReal && tieneFuturo && ultimoReal.prevision === undefined) ultimoReal.prevision = ultimoReal.real;

  // ── Comprobaciones: que todo suma ─────────────────────────────────────────
  const suma = (pasos: PasoPuente[]) => pasos.reduce((s, p) => s + (p.saldo ? 0 : cts(p.importe)), 0);
  const tramoFuturo = puente.slice(
    puente.findIndex((p) => p.concepto.startsWith('Saldo real hoy')) + 1 || 1,
    puente.findIndex((p) => p.concepto.startsWith('Saldo previsto al final')),
  );
  const comprobaciones: Comprobacion[] = [];
  const cuadra = (a: number, b: number) => Math.abs(a - b) <= 1;
  if (tienePasado) {
    const tramoPasado = puente.slice(
      1,
      puente.findIndex((p) => p.concepto.startsWith('Saldo real hoy')),
    );
    comprobaciones.push({
      ok: cuadra(cts(saldoInicio) + suma(tramoPasado), cts(saldoHoy)),
      texto: 'El saldo inicial más los movimientos del pasado da el saldo real de hoy.',
    });
    comprobaciones.push({
      ok: cuadra(cts(cierre?.ingresosReales ?? 0), realPasado.ingresos) && cuadra(cts(cierre?.real ?? 0), realPasado.gastos),
      texto: 'Los ingresos y gastos reales del puente son los mismos que los del cierre de mes.',
    });
  }
  if (tieneFuturo) {
    comprobaciones.push({
      ok: cuadra(cts(saldoHoy) + suma(tramoFuturo), cts(saldoFinal)),
      texto: 'El saldo de hoy más lo previsto da el saldo final.',
    });
  }
  if (e.cuadroDeMando && tieneFuturo) {
    const dm = e.cuadroDeMando;
    const igual = cuadra(cts(dm.saldoFinal), cts(saldoFinal));
    const fmt = (n: number) => `${n < 0 ? '\u2212' : ''}${formatEUR(Math.abs(n))}`;
    comprobaciones.push({
      ok: igual,
      texto: igual
        ? 'El saldo final coincide con el del cuadro de mando.'
        : `El cuadro de mando prevé ${fmt(dm.saldoFinal)} al final, ${fmt(dm.saldoFinal - saldoFinal)} de diferencia. Parte de ${fmt(dm.saldoHoy)} como saldo de hoy y el informe de ${fmt(saldoHoy)}, el de tus cuentas: actualiza el saldo de las cuentas en Cuentas para que coincidan.`,
    });
  }
  const ultimaFila = meses[meses.length - 1];
  comprobaciones.push({
    ok: !ultimaFila || cuadra(cts(ultimaFila.saldoFinal), cts(saldoFinal)),
    texto: 'La tabla mes a mes acaba en el mismo saldo que el puente.',
  });
  comprobaciones.push({
    ok: cuadra(cuentas.reduce((s, c) => s + cts(c.saldoFinal), 0) + sinCuenta, cts(saldoFinal)),
    texto: 'La suma de las cuentas da el saldo total, hoy y al final.',
  });
  if (cierre) {
    const totalGrupos = grupos.filter((g) => g.grupo !== 'ingresos').reduce((s, g) => s + cts(g.real), 0);
    comprobaciones.push({ ok: cuadra(totalGrupos, cts(cierre.real)), texto: 'Los grupos de gasto suman el gasto real del pasado.' });
  }

  // ── Avisos sobre la calidad de los datos ──────────────────────────────────
  const avisos: string[] = [];
  const hace30 = sumarDias(corte, -30);
  for (const c of cuentas) {
    if (!c.ultimoDato) avisos.push(`«${c.nombre}» no tiene ningún dato real: su saldo es el inicial.`);
    else if (tienePasado && c.ultimoDato < hace30)
      avisos.push(`«${c.nombre}»: el último dato real es del ${c.ultimoDato}. Lo que pasó después no está en el informe.`);
  }
  if (tienePasado && movsPasado.length === 0) {
    avisos.push('No hay movimientos registrados en el pasado del periodo: lo «real» sale solo de los saldos anotados.');
  }
  if (cierre && cierre.sinEstimacion.length > 0) {
    avisos.push(
      `${cierre.sinEstimacion.length} conceptos de gasto (${formatEUR(cierre.totalSinEstimacion)}) no están asignados a ninguna estimación. Asígnalos u omítelos en Cuentas → Cierre y precisión.`,
    );
  }
  if (Math.abs(ajusteSaldos) > 100 * 100) {
    avisos.push('El ajuste por saldos anotados es grande: faltan movimientos por registrar o importar entre esos saldos.');
  }
  if (realPasado.traspasos && Math.abs(realPasado.traspasos) > 100) {
    avisos.push('Los traspasos entre cuentas no suman cero: probablemente falta el otro lado de alguno (una cuenta sin importar).');
  }

  return {
    proyecto: e.proyecto,
    generadoEl: formatLocalDate(new Date()),
    desde,
    hasta,
    hoy,
    corte,
    tienePasado,
    tieneFuturo,
    saldoInicio,
    saldoHoy,
    saldoFinal,
    reservaImprevistos,
    saldoFinalConReserva: eur(cts(saldoFinal) - reservaCts),
    saldoHoyPrevisto,
    puente,
    meses,
    grupos,
    desviaciones: (cierre?.filas ?? []).filter((f) => Math.abs(f.desviacion) >= 0.01).slice(0, 10),
    sinPrever: (cierre?.sinEstimacion ?? []).slice(0, 10),
    totalSinPrever: cierre?.totalSinEstimacion ?? 0,
    cuentas,
    minimo,
    serie,
    comprobaciones,
    avisos,
    imprevistos: e.imprevistos ?? null,
    cierre,
  };
}
