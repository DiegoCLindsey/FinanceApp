// ── informe/modelo ────────────────────────────────────────────────────────────
// «Crear informe»: el cálculo. Puro: entran datos, sale el informe; el HTML
// está en `informe/html.ts`.
//
// El informe se hace CONTRA EL SALDO DE LAS CUENTAS, no contra la contabilidad
// desglosada: lo real es el saldo de cada cuenta en cada fecha —el saldo
// inicial y los saldos que el usuario anota, lo mismo que usa el cuadro de
// mando—, y lo previsto es lo que sus gastos, nóminas y préstamos decían que
// iba a pasar con ese saldo. No se mira movimiento a movimiento: se compara el
// saldo que debía haber con el que hay.
//
// El periodo se parte en el ÚLTIMO SALDO REAL CONOCIDO (el «corte»). Antes del
// corte, real frente a previsto; desde el corte, previsión. El saldo real del
// corte cierra una mitad y abre la otra, así que todo encadena:
//
//   saldo real al empezar + previsto hasta el corte = saldo previsto al corte
//   saldo previsto al corte + diferencia            = saldo real al corte
//   saldo real al corte + previsto hasta el final   = saldo previsto al final
//
// Convención de fechas, la misma que el cuadro de mando: el saldo real «en» una
// fecha es el saldo al EMPEZAR ese día; los cargos de ese día van después.

import { sumarDias, todayISO, type ISODate } from '@/core/dates';
import { formatEUR } from '@/core/money';
import { desgloseDelMes, finDeMes, mesesEntre, type EstimacionImprevistos } from '@/engine/mes';
import type { CashEvent } from '@/engine/types';
import type { Account, Expense } from '@/state/schema';

// ── Entrada ───────────────────────────────────────────────────────────────────

export interface EntradaInforme {
  desde: ISODate;
  hasta: ISODate;
  hoy?: ISODate;
  /** Nombre del proyecto, para la cabecera. */
  proyecto: string;
  /** Cuentas incluidas (las activas). */
  cuentas: Account[];
  /** Estimaciones (para clasificar lo previsto en facturas, otros, imprevistos). */
  gastos: Expense[];
  /** Préstamos (para el nombre de sus cuotas). */
  prestamos: { _id: string; nombre?: string }[];
  /**
   * Extracto previsto entre dos fechas. Debe ser el MISMO motor que el cuadro
   * de mando (FinanceMath en el navegador), para que las dos pantallas digan lo
   * mismo.
   */
  generarExtracto: (desde: ISODate, hasta: ISODate, fechaReferencia: ISODate) => CashEvent[];
  /** Saldo real de una cuenta al empezar un día (el del cuadro de mando). */
  saldoEnFecha: (cuenta: Account, fecha: ISODate) => number;
  /** Fecha del último saldo real conocido de una cuenta hasta `fecha` ('' si ninguno). */
  ultimoSaldoConocido: (cuenta: Account, fecha: ISODate) => ISODate | '' | null;
  /** Estimación de imprevistos, para la reserva del tramo futuro. */
  imprevistos?: EstimacionImprevistos | null;
  /** Imprevistos ya marcados en el mes en curso (para no reservarlos dos veces). */
  imprevistosMesEnCurso?: number;
  /** Saldo final que enseña el cuadro de mando para el mismo periodo. */
  cuadroDeMando?: { saldoFinal: number } | null;
}

// ── Salida ────────────────────────────────────────────────────────────────────

export interface PasoPuente {
  concepto: string;
  nota?: string;
  importe: number;
  /** Subtotal: se pinta como saldo, no como movimiento. */
  saldo?: boolean;
}

export interface FilaMes {
  mes: string;
  tipo: 'real' | 'en-curso' | 'previsto';
  saldoInicial: number;
  /** Lo previsto para el mes entero: ingresos netos y gastos. */
  ingresos: number;
  gastos: number;
  /** Intereses, traspasos y demás previstos que mueven el saldo. */
  otros: number;
  /** Saldo real − saldo previsto en el tramo pasado del mes (0 en los futuros). */
  desviacion: number;
  saldoFinal: number;
  /** Saldo a fin de mes si se hubiera proyectado todo desde el inicio del periodo. */
  saldoPrevistoDesdeInicio: number;
  /** ¿Alguna cuenta tiene un saldo real anotado dentro de este mes? */
  conSaldoReal: boolean;
}

export interface FilaPrevisto {
  nombre: string;
  importe: number;
}

export interface FilaCuenta {
  _id: string;
  nombre: string;
  saldoInicio: number;
  /** Saldo real en el corte. */
  saldoReal: number;
  /** Lo que se preveía para el corte, desde el saldo real del inicio. */
  saldoPrevisto: number;
  diferencia: number;
  saldoFinal: number;
  ultimoDato: ISODate | null;
}

export interface Comprobacion {
  ok: boolean;
  texto: string;
}

export interface Informe {
  proyecto: string;
  generadoEl: ISODate;
  desde: ISODate;
  hasta: ISODate;
  hoy: ISODate;
  /** Fecha del último saldo real conocido (dentro del periodo): ahí se parte. */
  corte: ISODate;
  tienePasado: boolean;
  tieneFuturo: boolean;
  saldoInicio: number;
  /** Lo previsto para el corte, desde el saldo real del inicio. */
  saldoPrevistoCorte: number;
  /** El saldo real en el corte. */
  saldoCorte: number;
  /** saldoCorte − saldoPrevistoCorte. */
  diferencia: number;
  saldoFinal: number;
  reservaImprevistos: number;
  saldoFinalConReserva: number;
  puente: PasoPuente[];
  /** Lo previsto para el tramo pasado, por grupo (solo previsto: lo real es el saldo). */
  previstoPasado: FilaPrevisto[];
  meses: FilaMes[];
  cuentas: FilaCuenta[];
  minimo: { saldo: number; fecha: ISODate } | null;
  serie: { fecha: ISODate; real?: number; previstoInicio?: number; prevision?: number }[];
  comprobaciones: Comprobacion[];
  avisos: string[];
  imprevistos: EstimacionImprevistos | null;
}

// ── Utilidades ────────────────────────────────────────────────────────────────

const cts = (n: number) => Math.round(n * 100);
const eur = (c: number) => c / 100;
const efecto = (e: CashEvent) => (e.tipo === 'ingreso' ? Math.abs(e.cuantia) : -Math.abs(e.cuantia));
const minFecha = (a: ISODate, b: ISODate) => (a < b ? a : b);
const maxFecha = (a: ISODate, b: ISODate) => (a > b ? a : b);
const conSigno = (n: number) => `${n < 0 ? '−' : '+'}${formatEUR(Math.abs(n))}`;

// ── Construcción ──────────────────────────────────────────────────────────────

export function construirInforme(e: EntradaInforme): Informe {
  const hoy = e.hoy ?? todayISO();
  const desde = e.desde;
  const hasta = e.hasta < e.desde ? e.desde : e.hasta;
  const finExclusivo = sumarDias(hasta, 1);

  // ── Saldo real ────────────────────────────────────────────────────────────
  const real = (c: Account, fecha: ISODate) => cts(e.saldoEnFecha(c, fecha));
  const realTotal = (fecha: ISODate) => e.cuentas.reduce((s, c) => s + real(c, fecha), 0);
  const ultimoDe = (c: Account, fecha: ISODate): ISODate | null => e.ultimoSaldoConocido(c, fecha) || null;

  // El corte: el último saldo real conocido de cualquier cuenta, sin pasar de
  // hoy, y recortado al periodo.
  const ultimoConocido = e.cuentas.map((c) => ultimoDe(c, hoy) ?? '').reduce((a, b) => (b > a ? b : a), '');
  const corte = !ultimoConocido || ultimoConocido < desde ? desde : minFecha(ultimoConocido, finExclusivo);
  const tienePasado = corte > desde;
  const tieneFuturo = corte <= hasta;

  // ── Lo previsto, el mismo extracto que el cuadro de mando ─────────────────
  const eventos = e
    .generarExtracto(desde, hasta, hoy)
    .filter((ev) => ev.fecha >= desde && ev.fecha <= hasta)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const efectos = (evs: CashEvent[]) => evs.reduce((s, ev) => s + cts(efecto(ev)), 0);
  const entre = (ini: ISODate, finExcl: ISODate) => eventos.filter((ev) => ev.fecha >= ini && ev.fecha < finExcl);

  /** Ingresos netos, gastos y lo demás (intereses, traspasos…) de unos eventos. */
  const flujos = (evs: CashEvent[]) => {
    const d = desgloseDelMes(evs, e.gastos, e.prestamos, hoy);
    const total = efectos(evs);
    const ingresos = cts(d.ingresosNetos);
    const gastos = cts(d.gastosTotales);
    return { d, total, ingresos, gastos, otros: total - (ingresos - gastos) };
  };

  const saldoInicio = realTotal(desde);
  const pasado = flujos(entre(desde, corte));
  const futuro = flujos(entre(corte, finExclusivo));
  const saldoPrevistoCorte = saldoInicio + pasado.total;
  const saldoCorte = tienePasado ? realTotal(corte) : saldoInicio;
  const diferencia = tienePasado ? saldoCorte - saldoPrevistoCorte : 0;
  const saldoFinal = saldoCorte + futuro.total;

  // ── Reserva para imprevistos del tramo futuro ─────────────────────────────
  let reserva = 0;
  const media = e.imprevistos && e.imprevistos.meses > 0 ? cts(e.imprevistos.mediaMensual) : 0;
  if (tieneFuturo && media > 0) {
    for (const mes of mesesEntre(corte.slice(0, 7), hasta.slice(0, 7))) {
      if (mes < hoy.slice(0, 7)) continue;
      if (mes === hoy.slice(0, 7)) {
        reserva += Math.max(0, media - cts(e.imprevistosMesEnCurso ?? 0));
        continue;
      }
      const ini = maxFecha(`${mes}-01`, corte);
      const fin = minFecha(finDeMes(mes), hasta);
      const diasMes = Number(finDeMes(mes).slice(8, 10));
      const dias = Number(fin.slice(8, 10)) - Number(ini.slice(8, 10)) + 1;
      reserva += Math.round((media * dias) / diasMes);
    }
  }

  // ── Puente ────────────────────────────────────────────────────────────────
  const puente: PasoPuente[] = [{ concepto: `Saldo real al empezar (${desde})`, importe: eur(saldoInicio), saldo: true }];
  const tramo = (f: ReturnType<typeof flujos>, cuando: string) => {
    const sufijo = cuando ? ` ${cuando}` : '';
    puente.push(
      { concepto: `Ingresos previstos${sufijo}`, nota: 'netos de retenciones de nómina', importe: eur(f.ingresos) },
      { concepto: `Gastos previstos${sufijo}`, importe: -eur(f.gastos) },
    );
    if (f.otros) puente.push({ concepto: `Intereses y traspasos previstos${sufijo}`, importe: eur(f.otros) });
  };
  let iCorte = 0;
  if (tienePasado) {
    tramo(pasado, 'hasta el corte');
    puente.push({ concepto: `Saldo previsto al ${corte}`, importe: eur(saldoPrevistoCorte), saldo: true });
    puente.push({
      concepto: 'Diferencia con el saldo real',
      nota: diferencia >= 0 ? 'tienes más de lo que preveías' : 'tienes menos de lo que preveías',
      importe: eur(diferencia),
    });
    iCorte = puente.length;
    puente.push({ concepto: `Saldo real al ${corte}`, nota: 'último saldo real conocido', importe: eur(saldoCorte), saldo: true });
  }
  let iFinal = puente.length;
  if (tieneFuturo) {
    tramo(futuro, tienePasado ? 'desde el corte' : '');
    iFinal = puente.length;
    puente.push({ concepto: `Saldo previsto al final (${hasta})`, importe: eur(saldoFinal), saldo: true });
    if (reserva > 0) {
      puente.push(
        {
          concepto: 'Reserva para imprevistos',
          nota: e.imprevistos ? `media de ${e.imprevistos.meses} ${e.imprevistos.meses === 1 ? 'mes' : 'meses'}` : undefined,
          importe: -eur(reserva),
        },
        { concepto: 'Saldo previsto con la reserva', importe: eur(saldoFinal - reserva), saldo: true },
      );
    }
  }

  // ── Lo previsto para el pasado, por grupo ─────────────────────────────────
  const previstoPasado: FilaPrevisto[] = tienePasado
    ? [
        { nombre: 'Ingresos netos', importe: eur(pasado.ingresos) },
        { nombre: 'Préstamos', importe: -pasado.d.prestamos.total },
        { nombre: 'Facturas', importe: -pasado.d.facturas.total },
        { nombre: 'Otros gastos', importe: -pasado.d.otros.total },
        { nombre: 'Imprevistos', importe: -pasado.d.imprevistos.total },
        { nombre: 'Intereses y traspasos', importe: eur(pasado.otros) },
      ].filter((f) => cts(f.importe) !== 0)
    : [];

  // ── Mes a mes ─────────────────────────────────────────────────────────────
  const meses: FilaMes[] = [];
  let saldoAnterior = saldoInicio;
  let previstoAcumulado = saldoInicio;
  for (const mes of mesesEntre(desde.slice(0, 7), hasta.slice(0, 7))) {
    const ini = maxFecha(`${mes}-01`, desde);
    const finExcl = minFecha(sumarDias(finDeMes(mes), 1), finExclusivo);
    const f = flujos(entre(ini, finExcl));
    const saldoIni = saldoAnterior;
    let saldoFin: number;
    let desviacion = 0;
    let tipo: FilaMes['tipo'];
    if (finExcl <= corte) {
      tipo = 'real';
      saldoFin = realTotal(finExcl);
      desviacion = saldoFin - saldoIni - f.total;
    } else if (ini >= corte) {
      tipo = 'previsto';
      saldoFin = saldoIni + f.total;
    } else {
      tipo = 'en-curso';
      const hastaCorte = efectos(entre(ini, corte));
      desviacion = saldoCorte - (saldoIni + hastaCorte);
      saldoFin = saldoCorte + (f.total - hastaCorte);
    }
    previstoAcumulado += f.total;
    const ultimoDia = sumarDias(finExcl, -1);
    meses.push({
      mes,
      tipo,
      saldoInicial: eur(saldoIni),
      ingresos: eur(f.ingresos),
      gastos: eur(f.gastos),
      otros: eur(f.otros),
      desviacion: eur(desviacion),
      saldoFinal: eur(saldoFin),
      saldoPrevistoDesdeInicio: eur(previstoAcumulado),
      conSaldoReal: e.cuentas.some((c) => {
        const u = ultimoDe(c, minFecha(finExcl, corte));
        return !!u && u > ini && u <= sumarDias(ultimoDia, 1);
      }),
    });
    saldoAnterior = saldoFin;
  }

  // ── Cuentas ───────────────────────────────────────────────────────────────
  const porCuenta = (evs: CashEvent[]) => {
    const m = new Map<string, number>();
    for (const ev of evs) m.set(ev.cuenta || '', (m.get(ev.cuenta || '') ?? 0) + cts(efecto(ev)));
    return m;
  };
  const pasadoPorCuenta = porCuenta(entre(desde, corte));
  const futuroPorCuenta = porCuenta(entre(corte, finExclusivo));
  const ids = new Set(e.cuentas.map((c) => c._id));
  const fuera = (m: Map<string, number>) => [...m].filter(([id]) => !ids.has(id)).reduce((s, [, v]) => s + v, 0);
  const cuentas: FilaCuenta[] = e.cuentas.map((c) => {
    const ini = real(c, desde);
    const enCorte = tienePasado ? real(c, corte) : ini;
    const previsto = ini + (pasadoPorCuenta.get(c._id) ?? 0);
    return {
      _id: c._id,
      nombre: c.nombre,
      saldoInicio: eur(ini),
      saldoReal: eur(enCorte),
      saldoPrevisto: eur(tienePasado ? previsto : ini),
      diferencia: tienePasado ? eur(enCorte - previsto) : 0,
      saldoFinal: eur(enCorte + (futuroPorCuenta.get(c._id) ?? 0)),
      ultimoDato: ultimoDe(c, hoy),
    };
  });

  // ── Mínimo previsto y serie de la gráfica ─────────────────────────────────
  let minimo: Informe['minimo'] = null;
  if (tieneFuturo) {
    let s = saldoCorte;
    let min = { saldo: s, fecha: corte };
    for (const ev of entre(corte, finExclusivo)) {
      s += cts(efecto(ev));
      if (s < min.saldo) min = { saldo: s, fecha: ev.fecha };
    }
    minimo = { saldo: eur(min.saldo), fecha: min.fecha };
  }
  const serie: Informe['serie'] = [{ fecha: desde, real: eur(saldoInicio), previstoInicio: eur(saldoInicio) }];
  if (!tienePasado) serie[0] = { fecha: desde, prevision: eur(saldoInicio) };
  for (const m of meses) {
    const fin = minFecha(finDeMes(m.mes), hasta);
    if (m.tipo === 'real') {
      serie.push({ fecha: fin, real: m.saldoFinal, previstoInicio: m.saldoPrevistoDesdeInicio });
    } else if (m.tipo === 'en-curso') {
      serie.push({ fecha: corte, real: eur(saldoCorte), previstoInicio: eur(saldoPrevistoCorte), prevision: eur(saldoCorte) });
      serie.push({ fecha: fin, previstoInicio: m.saldoPrevistoDesdeInicio, prevision: m.saldoFinal });
    } else {
      serie.push({ fecha: fin, prevision: m.saldoFinal });
    }
  }
  // Si el corte cae justo en un cambio de mes, la previsión arranca del último real.
  const ultimoReal = [...serie].reverse().find((p) => p.real !== undefined);
  if (ultimoReal && tieneFuturo && ultimoReal.prevision === undefined) ultimoReal.prevision = ultimoReal.real;

  // ── Comprobaciones ────────────────────────────────────────────────────────
  const cuadra = (a: number, b: number) => Math.abs(a - b) <= 1;
  const suma = (pasos: PasoPuente[]) => pasos.reduce((s, p) => s + (p.saldo ? 0 : cts(p.importe)), 0);
  const comprobaciones: Comprobacion[] = [];
  if (tienePasado) {
    comprobaciones.push({
      ok: cuadra(saldoInicio + suma(puente.slice(1, iCorte)), saldoCorte),
      texto: 'El saldo real al empezar más lo previsto y la diferencia da el saldo real del corte.',
    });
  }
  if (tieneFuturo) {
    comprobaciones.push({
      ok: cuadra(saldoCorte + suma(puente.slice(iCorte + 1, iFinal)), saldoFinal),
      texto: `El saldo ${tienePasado ? 'real del corte' : 'real al empezar'} más lo previsto da el saldo final.`,
    });
  }
  const ultimaFila = meses[meses.length - 1];
  comprobaciones.push({
    ok: !ultimaFila || cuadra(cts(ultimaFila.saldoFinal), saldoFinal),
    texto: 'La tabla mes a mes acaba en el mismo saldo que el puente.',
  });
  const sumaCuentas = (k: 'saldoReal' | 'saldoPrevisto' | 'saldoFinal') => cuentas.reduce((s, c) => s + cts(c[k]), 0);
  comprobaciones.push({
    ok:
      cuadra(sumaCuentas('saldoReal'), saldoCorte) &&
      cuadra(sumaCuentas('saldoPrevisto') + (tienePasado ? fuera(pasadoPorCuenta) : 0), saldoPrevistoCorte) &&
      cuadra(sumaCuentas('saldoFinal') + fuera(futuroPorCuenta), saldoFinal),
    texto: 'La suma de las cuentas da el saldo total: el real, el previsto y el final.',
  });
  if (e.cuadroDeMando && tieneFuturo) {
    const dm = e.cuadroDeMando;
    const igual = cuadra(cts(dm.saldoFinal), saldoFinal);
    comprobaciones.push({
      ok: igual,
      texto: igual
        ? 'El saldo final coincide con el del cuadro de mando.'
        : `El cuadro de mando prevé ${formatEUR(dm.saldoFinal)} al final (${conSigno(dm.saldoFinal - eur(saldoFinal))} respecto al informe).`,
    });
  }

  // ── Avisos ────────────────────────────────────────────────────────────────
  const avisos: string[] = [];
  const hace30 = sumarDias(hoy, -30);
  for (const c of cuentas) {
    if (!c.ultimoDato) avisos.push(`«${c.nombre}» no tiene ningún saldo real: cuenta como 0 €.`);
    else if (c.ultimoDato < hace30)
      avisos.push(
        `«${c.nombre}»: el último saldo real es del ${c.ultimoDato}. Actualízalo en Cuentas para que la comparación llegue hasta hoy.`,
      );
  }
  const sinSaldo = meses.filter((m) => m.tipo === 'real' && !m.conSaldoReal).map((m) => m.mes);
  if (sinSaldo.length && tienePasado) {
    avisos.push(
      `Sin ningún saldo real anotado en ${sinSaldo.join(', ')}: la diferencia de ${sinSaldo.length === 1 ? 'ese mes' : 'esos meses'} aparece en el siguiente que sí lo tiene.`,
    );
  }
  if (tienePasado && corte < hoy && corte <= hasta) {
    avisos.push(`El último saldo real es del ${corte}: desde ese día hasta hoy el informe ya es previsión.`);
  }

  return {
    proyecto: e.proyecto,
    generadoEl: todayISO(),
    desde,
    hasta,
    hoy,
    corte,
    tienePasado,
    tieneFuturo,
    saldoInicio: eur(saldoInicio),
    saldoPrevistoCorte: eur(saldoPrevistoCorte),
    saldoCorte: eur(saldoCorte),
    diferencia: eur(diferencia),
    saldoFinal: eur(saldoFinal),
    reservaImprevistos: eur(reserva),
    saldoFinalConReserva: eur(saldoFinal - reserva),
    puente,
    previstoPasado,
    meses,
    cuentas,
    minimo,
    serie,
    comprobaciones,
    avisos,
    imprevistos: e.imprevistos ?? null,
  };
}
