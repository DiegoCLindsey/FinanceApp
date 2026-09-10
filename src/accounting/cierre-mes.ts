// ── accounting/cierre-mes ─────────────────────────────────────────────────────
// Cierre de mes: comparar lo que se estimó con lo que pasó de verdad.
//
// El bucle de la aplicación es estimar → vivir → registrar → comparar →
// ajustar. Estaba roto en «comparar»: había un panel de precisión, pero era una
// tabla permanente y agregada, no un MOMENTO. Sin un momento nadie compara, y
// sin comparar las estimaciones envejecen sin que nadie se entere.
//
// Este módulo responde a tres preguntas sobre un mes concreto:
//
//   1. ¿Cuánto me desvié en total?
//   2. ¿En qué me desvié? (por estimación, ordenado por lo que más duele)
//   3. ¿Qué gasté que no tenía previsto? — la pregunta que no se hacía nadie,
//      y donde suele estar la diferencia de verdad.
//
// Puro: entran datos, salen números. Sin DOM.

import { roundMoney } from '@/core/money';
import { etiquetaPeriodicidad, parseLocalDate, vigenteEnRango, type ISODate } from '@/core/dates';
import { proyectarNominas, type TramosResolver } from '@/engine/providers/salaries';
import { proyectarPrestamos } from '@/engine/providers/loans';
import type { Expense, Loan, Nomina, Transaccion } from '@/state/schema';
import type { Ledger } from './ledger';
import { estimadoEnRango, type PrecisionEstimacion } from './precision';
import { sugerirAjuste, type Sugerencia } from './adjust';

export interface FilaCierre {
  estimacionId: string;
  concepto: string;
  /** Qué se está comparando: lo que se preveía gastar o lo que se preveía cobrar. */
  tipo: 'gasto' | 'ingreso';
  /** De dónde sale lo previsto: una estimación, una nómina o la cuota de un préstamo. */
  origen: OrigenPrevision;
  /** Cada cuánto se paga («cada semana», «cada trimestre»), tal cual se enseña. */
  periodicidad: string;
  tags: string[];
  estimado: number;
  real: number;
  /** real − estimado. Positivo = se gastó de más. */
  desviacion: number;
  /** Sin ningún movimiento real ese mes. */
  sinMovimiento: boolean;
  /** Ajuste propuesto, si la desviación es sistemática y significativa. */
  sugerencia: Sugerencia | null;
}

export interface GrupoSinEstimacion {
  concepto: string;
  /** Concepto normalizado: identifica al grupo para omitirlo o asignarlo entero. */
  clave: string;
  total: number;
  movimientos: number;
  /** Ids de los movimientos del grupo, para asignarlos de una vez. */
  ids: string[];
}

/** Gasto real y previsto de una etiqueta dentro del periodo. */
export interface TagCierre {
  tag: string;
  estimado: number;
  real: number;
  desviacion: number;
}

export type OrigenPrevision = 'estimacion' | 'nomina' | 'prestamo';

/**
 * Algo previsible con un importe esperado en el periodo, venga de donde venga.
 *
 * No todo lo previsible es una «estimación»: la nómina vive en su colección y
 * la cuota del préstamo se deriva de su cuadro de amortización. Mientras el
 * cierre solo miraba `expenses`, lo previsto salía a cero por el lado de los
 * ingresos y la hipoteca aparecía como gasto imprevisto todos los meses.
 */
export interface Prevision {
  _id: string;
  concepto: string;
  tipo: 'gasto' | 'ingreso';
  tags: string[];
  estimado: number;
  origen: OrigenPrevision;
  /** Cada cuánto toca pagar, en palabras. */
  periodicidad: string;
  /** Cuantía nominal de CADA pago; solo las estimaciones se pueden ajustar. */
  cuantia?: number;
}

export interface CierreMes {
  /** Mes del inicio del periodo. Con un cierre de mes, ese mes. */
  mes: string; // 'YYYY-MM'
  desde: ISODate;
  hasta: ISODate;
  /** Gasto previsto para el mes, sumando todas las estimaciones. */
  estimado: number;
  /** Gasto real del mes. */
  real: number;
  desviacion: number;
  /** Ingreso previsto para el periodo, sumando las estimaciones de ingreso. */
  ingresosEstimados: number;
  ingresosReales: number;
  /** real − previsto en los ingresos (positivo = ha entrado más de lo previsto). */
  desviacionIngresos: number;
  /** Ingresos menos gastos, previstos y reales, y su desviación. */
  netoEstimado: number;
  netoReal: number;
  desviacionNeta: number;
  /** Filas de gasto y de ingreso, ordenadas por lo que más se desvía. */
  filas: FilaCierre[];
  /** Gasto real que no cuadra con ninguna estimación, agrupado por concepto. */
  sinEstimacion: GrupoSinEstimacion[];
  totalSinEstimacion: number;
  /** Ingreso real que no cuadra con ninguna estimación (el otro lado de un traspaso, típicamente). */
  ingresosSinPrever: GrupoSinEstimacion[];
  totalIngresosSinPrever: number;
  /** Gasto previsto y real por etiqueta, para comparar de un vistazo. */
  porTag: TagCierre[];
  /**
   * Duración del periodo en meses (con decimales: medio mes vale 0,5). Los
   * totales de un intervalo largo no dicen nada por sí solos — 21.000 € es
   * mucho o poco según si son de un mes o de cinco—, así que la vista divide
   * por aquí para enseñar también la media mensual.
   */
  meses: number;
  /** Conceptos que el usuario ha marcado para no contar, y lo que suman. */
  omitidos: GrupoSinEstimacion[];
  totalOmitido: number;
  /** El mes no tiene ni un movimiento registrado. */
  vacio: boolean;
}

/**
 * Duración del periodo en meses, contando los trozos de mes por separado: un
 * intervalo del 15 de abril al 30 de junio son 0,5 + 1 + 1 = 2,5 meses, no
 * «tres meses» ni «77 días / 30».
 */
export function mesesDelPeriodo(desde: ISODate, hasta: ISODate): number {
  if (hasta < desde) return 0;
  let meses = 0;
  let [y, m] = desde.slice(0, 7).split('-').map(Number);
  while (`${y}-${String(m).padStart(2, '0')}` <= hasta.slice(0, 7)) {
    const diasMes = new Date(y, m, 0).getDate();
    const primero = `${y}-${String(m).padStart(2, '0')}-01`;
    const ultimo = `${y}-${String(m).padStart(2, '0')}-${String(diasMes).padStart(2, '0')}`;
    const ini = desde > primero ? desde : primero;
    const fin = hasta < ultimo ? hasta : ultimo;
    const dias = (parseLocalDate(fin).getTime() - parseLocalDate(ini).getTime()) / 86400000 + 1;
    meses += dias / diasMes;
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return meses;
}

/** Primer y último día del mes, en ISO. */
export function rangoDelMes(mes: string): { desde: ISODate; hasta: ISODate } {
  const [y, m] = mes.split('-').map(Number);
  const ultimo = new Date(y, m, 0).getDate();
  return { desde: `${mes}-01`, hasta: `${mes}-${String(ultimo).padStart(2, '0')}` };
}

/** Mes anterior al de la fecha dada: el último que se puede cerrar. */
export function mesAnterior(hoy: ISODate): string {
  const [y, m] = hoy.slice(0, 7).split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Normaliza un concepto para agrupar: minúsculas, sin acentos ni dígitos. */
function claveConcepto(concepto: string): string {
  return concepto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Reparte cada movimiento entre las estimaciones, **como mucho una**.
 *
 * El analizador de precisión mira una estimación cada vez, así que le da igual
 * que un movimiento encaje con varias. Aquí no: si «Alquiler» y «Reforma baño»
 * comparten la etiqueta `vivienda`, el recibo del alquiler se contaría en las
 * dos filas y la suma de las filas ya no cuadraría con el gasto real del mes.
 * En una pantalla cuyo trabajo es cuadrar cifras, eso la invalida entera.
 *
 * Criterio, en este orden:
 *   1. la asignación explícita (`estimacionId`) manda siempre;
 *   2. si no la hay, gana la estimación que comparta MÁS etiquetas;
 *   3. a igualdad, la primera por id, para que el reparto sea estable entre
 *      repintados.
 *
 * Una estimación que ya tiene movimientos asignados a mano no compite por
 * etiqueta: se entiende que el usuario la lleva de forma explícita.
 */
function repartir<T extends { _id: string; tags?: string[] }>(
  gastos: Transaccion[],
  deGasto: T[],
  tieneAsignadas: (id: string) => boolean,
): Map<string, Transaccion[]> {
  const porEstimacion = new Map<string, Transaccion[]>(deGasto.map((e) => [e._id, []]));
  const candidatas = deGasto.filter((e) => !tieneAsignadas(e._id) && (e.tags?.length ?? 0) > 0);

  for (const t of gastos) {
    if (t.estimacionId && porEstimacion.has(t.estimacionId)) {
      (porEstimacion.get(t.estimacionId) as Transaccion[]).push(t);
      continue;
    }
    if (t.estimacionId) continue; // asignada a una estimación que aquí no cuenta

    let mejor: T | null = null;
    let mejorComunes = 0;
    for (const e of candidatas) {
      const comunes = (e.tags ?? []).filter((tag) => t.tags.includes(tag)).length;
      if (comunes === 0) continue;
      if (comunes > mejorComunes || (comunes === mejorComunes && mejor && e._id < mejor._id)) {
        mejor = e;
        mejorComunes = comunes;
      }
    }
    if (mejor) (porEstimacion.get(mejor._id) as Transaccion[]).push(t);
  }

  return porEstimacion;
}

export interface OpcionesCierre {
  /** Análisis de precisión ya calculado, para no repetirlo. */
  analisis?: PrecisionEstimacion[];
  hoy?: ISODate;
  /** Nóminas activas: lo previsto por el lado de los ingresos vive aquí. */
  nominas?: Nomina[];
  /** Préstamos activos: la cuota es lo más previsible que hay. */
  loans?: Loan[];
  /** Tramos de IRPF por año, para calcular el neto de las nóminas. */
  resolverTramosIRPF?: TramosResolver;
  /** Claves de concepto que el usuario ha decidido no contar en el cierre. */
  omitidos?: string[];
}

/** Lo previsto en el periodo, viniendo de estimaciones, nóminas y préstamos. */
export function previsionesDelPeriodo(estimaciones: Expense[], desde: ISODate, hasta: ISODate, opciones: OpcionesCierre = {}): Prevision[] {
  // Solo lo que estaba vivo en el periodo: una estimación dada de alta después
  // no «preveía 0 €», es que no le tocaba. Si se cuela, se lleva por etiqueta el
  // gasto real de meses en los que no existía y sale una fila de 0 € previstos
  // contra cientos de euros reales.
  const activas = estimaciones.filter(
    (e) => e.tipo !== 'transferencia' && e.activo !== false && vigenteEnRango(e.fechaInicio, e.fechaFin, desde, hasta),
  );
  const previsiones: Prevision[] = activas.map((e) => ({
    _id: e._id,
    concepto: e.concepto,
    tipo: e.tipo === 'ingreso' ? 'ingreso' : 'gasto',
    tags: e.tags ?? [],
    estimado: roundMoney(estimadoEnRango(e, desde, hasta)),
    origen: 'estimacion',
    periodicidad: etiquetaPeriodicidad(e.tipoFrecuencia, e.frecuencia),
    cuantia: e.cuantia,
  }));

  // Nóminas: se cuenta el NETO, que es lo que llega al banco. Da igual que la
  // nómina esté en representación detallada (bruto como ingreso y SS/IRPF como
  // gastos): esos dos gastos no son movimientos reales, así que se restan aquí
  // en vez de aparecer como previsiones de gasto que nunca se cumplen.
  const nominas = (opciones.nominas ?? []).filter((n) => n.activo !== false && vigenteEnRango(n.fechaInicio, n.fechaFin, desde, hasta));
  if (nominas.length > 0) {
    const eventos = proyectarNominas(nominas, { start: desde, end: hasta }, null, [], opciones.resolverTramosIRPF);
    for (const nom of nominas) {
      const suyos = eventos.filter((e) => e.sourceId === nom._id || e.sourceId.startsWith(`${nom._id}_`));
      const neto = suyos.reduce((s, e) => s + (e.tipo === 'ingreso' ? Math.abs(e.cuantia) : -Math.abs(e.cuantia)), 0);
      previsiones.push({
        _id: nom._id,
        concepto: nom.nombre,
        tipo: 'ingreso',
        tags: nom.tags ?? [],
        estimado: roundMoney(neto),
        origen: 'nomina',
        periodicidad: `${nom.nPagas} pagas al año`,
      });
    }
  }

  const loans = (opciones.loans ?? []).filter((l) => l.activo !== false);
  if (loans.length > 0) {
    const eventos = proyectarPrestamos(loans, { start: desde, end: hasta });
    for (const loan of loans) {
      const suyos = eventos.filter((e) => e.sourceId === loan._id);
      if (suyos.length === 0) continue;
      previsiones.push({
        _id: loan._id,
        concepto: `Cuota ${loan.nombre}`,
        tipo: 'gasto',
        tags: loan.tags ?? [],
        estimado: roundMoney(suyos.reduce((s, e) => s + Math.abs(e.cuantia), 0)),
        origen: 'prestamo',
        periodicidad: 'cuota mensual',
      });
    }
  }

  return previsiones;
}

/**
 * Cierra un mes: compara estimado con real y propone ajustes.
 *
 * Solo se consideran las estimaciones de tipo gasto: comparar la nómina con lo
 * que entró de verdad es otro problema (y otra pantalla).
 */
export function cerrarMes(ledger: Ledger, estimaciones: Expense[], mes: string, opciones: OpcionesCierre = {}): CierreMes {
  const { desde, hasta } = rangoDelMes(mes);
  return { ...cerrarPeriodo(ledger, estimaciones, desde, hasta, opciones), mes };
}

/**
 * Lo mismo sobre un intervalo cualquiera, que puede cruzar varios meses o
 * cortar uno por la mitad — el periodo que esté configurado en la cabecera,
 * sin obligar a cerrar mes a mes.
 *
 * El estimado NO se calcula sumando meses enteros: se le pide al motor la
 * proyección del rango exacto (`estimadoEnRango`), así que un intervalo que
 * empiece a mitad de mes no se lleva el gasto previsto de los días anteriores
 * y lo estimado sigue siendo comparable con lo real.
 */
export function cerrarPeriodo(
  ledger: Ledger,
  estimaciones: Expense[],
  desde: ISODate,
  hasta: ISODate,
  opciones: OpcionesCierre = {},
): CierreMes {
  const delMes = ledger.transacciones({ desde, hasta });
  const omitidos = new Set(opciones.omitidos ?? []);

  // Las transferencias entre cuentas propias no son gasto ni ingreso real: el
  // dinero solo ha cambiado de cuenta, así que contarlas aquí duplicaría la
  // compra real que se paga luego desde la cuenta de destino. Lo omitido a mano
  // se trata igual: el usuario ya ha dicho que eso no es gasto suyo.
  const cuenta = (t: Transaccion) => t.tipo !== 'transferencia' && !omitidos.has(claveConcepto(t.concepto));
  const gastos = delMes.filter((t) => cuenta(t) && t.importeCts < 0);
  const ingresos = delMes.filter((t) => cuenta(t) && t.importeCts > 0);
  const fuera = delMes.filter((t) => t.tipo !== 'transferencia' && omitidos.has(claveConcepto(t.concepto)));

  const porId = new Map((opciones.analisis ?? []).map((a) => [a.estimacionId, a]));
  const previsiones = previsionesDelPeriodo(estimaciones, desde, hasta, opciones);
  const conAsignadas = (lista: Prevision[]) =>
    new Set(lista.filter((p) => ledger.transacciones({ estimacionId: p._id }).length > 0).map((p) => p._id));

  const deGasto = previsiones.filter((p) => p.tipo === 'gasto');
  const deIngreso = previsiones.filter((p) => p.tipo === 'ingreso');
  // Cada lado se reparte contra los movimientos de su signo: una nómina no debe
  // quedarse con un recibo por compartir etiqueta.
  const repartoGasto = repartir(gastos, deGasto, (id) => conAsignadas(deGasto).has(id));
  const repartoIngreso = repartir(ingresos, deIngreso, (id) => conAsignadas(deIngreso).has(id));

  const contadasGasto = new Set<string>();
  const contadasIngreso = new Set<string>();

  const filaDe = (prev: Prevision, suyas: Transaccion[], marcar: Set<string>): FilaCierre => {
    for (const t of suyas) marcar.add(t._id);
    const real = roundMoney(suyas.reduce((s, t) => s + Math.abs(t.importeCts) / 100, 0));
    const analisis = prev.origen === 'estimacion' ? porId.get(prev._id) : undefined;
    return {
      estimacionId: prev._id,
      concepto: prev.concepto,
      tipo: prev.tipo,
      origen: prev.origen,
      periodicidad: prev.periodicidad,
      tags: prev.tags,
      estimado: prev.estimado,
      real,
      desviacion: roundMoney(real - prev.estimado),
      sinMovimiento: suyas.length === 0,
      // Solo se ajustan las estimaciones: la cuota de un préstamo la manda el
      // cuadro de amortización y la nómina, el contrato.
      sugerencia: analisis ? sugerirAjuste(analisis, prev.cuantia ?? 0, { hoy: opciones.hoy }) : null,
    };
  };

  const filasGasto = deGasto.map((p) => filaDe(p, repartoGasto.get(p._id) ?? [], contadasGasto));
  const filasIngreso = deIngreso.map((p) => filaDe(p, repartoIngreso.get(p._id) ?? [], contadasIngreso));

  // Lo que se movió sin que ninguna previsión lo cubriera. Se agrupa por
  // concepto normalizado para que veinte compras del súper no salgan de una en
  // una, que es lo que hace ilegible una lista así.
  const agrupar = (movimientos: Transaccion[], contadas: Set<string>): GrupoSinEstimacion[] => {
    const grupos = new Map<string, GrupoSinEstimacion>();
    for (const t of movimientos) {
      if (contadas.has(t._id)) continue;
      const clave = claveConcepto(t.concepto);
      const g = grupos.get(clave) ?? { concepto: t.concepto, clave, total: 0, movimientos: 0, ids: [] };
      g.total = roundMoney(g.total + Math.abs(t.importeCts) / 100);
      g.movimientos += 1;
      g.ids.push(t._id);
      grupos.set(clave, g);
    }
    return [...grupos.values()].sort((a, b) => b.total - a.total);
  };
  const sinEstimacion = agrupar(gastos, contadasGasto);
  const ingresosSinPrever = agrupar(ingresos, contadasIngreso);
  const listaOmitidos = agrupar(fuera, new Set());

  const estimado = roundMoney(filasGasto.reduce((s, f) => s + f.estimado, 0));
  const real = roundMoney(gastos.reduce((s, t) => s + Math.abs(t.importeCts) / 100, 0));
  const ingresosEstimados = roundMoney(filasIngreso.reduce((s, f) => s + f.estimado, 0));
  const ingresosReales = roundMoney(ingresos.reduce((s, t) => s + t.importeCts / 100, 0));

  return {
    mes: desde.slice(0, 7),
    desde,
    hasta,
    estimado,
    real,
    desviacion: roundMoney(real - estimado),
    ingresosEstimados,
    ingresosReales,
    desviacionIngresos: roundMoney(ingresosReales - ingresosEstimados),
    // El neto es la cifra honesta cuando parte del gasto es un traspaso entre
    // cuentas propias sin marcar: el cargo sale como gasto y el abono vuelve
    // como ingreso, así que mirando solo los gastos la desviación se dispara.
    netoEstimado: roundMoney(ingresosEstimados - estimado),
    netoReal: roundMoney(ingresosReales - real),
    desviacionNeta: roundMoney(ingresosReales - real - (ingresosEstimados - estimado)),
    // Lo que más duele primero: la desviación mayor en valor absoluto.
    filas: [...filasGasto, ...filasIngreso].sort((a, b) => Math.abs(b.desviacion) - Math.abs(a.desviacion)),
    sinEstimacion,
    totalSinEstimacion: roundMoney(sinEstimacion.reduce((s, g) => s + g.total, 0)),
    ingresosSinPrever,
    totalIngresosSinPrever: roundMoney(ingresosSinPrever.reduce((s, g) => s + g.total, 0)),
    porTag: gastoPorTag(deGasto, gastos),
    meses: mesesDelPeriodo(desde, hasta),
    omitidos: listaOmitidos,
    totalOmitido: roundMoney(listaOmitidos.reduce((s, g) => s + g.total, 0)),
    vacio: delMes.length === 0,
  };
}

/**
 * Gasto previsto y real por etiqueta.
 *
 * Se calcula sobre los movimientos, no sobre las filas, para que el gasto que
 * ninguna previsión cubría también aparezca: una etiqueta con 400 € reales y
 * 0 € previstos es exactamente lo que hay que ver. Un movimiento con varias
 * etiquetas cuenta entero en cada una (como en el análisis por etiqueta), así
 * que la suma de los anillos puede pasarse del total: cada anillo responde
 * «¿cuánto me he desviado en ESTA etiqueta?», no «¿qué parte del total es?».
 */
function gastoPorTag(previsiones: Prevision[], gastos: Transaccion[]): TagCierre[] {
  const acc = new Map<string, { estimado: number; real: number }>();
  const suma = (tags: string[], campo: 'estimado' | 'real', importe: number) => {
    for (const tag of tags.length > 0 ? tags : ['sin etiqueta']) {
      const v = acc.get(tag) ?? { estimado: 0, real: 0 };
      v[campo] += importe;
      acc.set(tag, v);
    }
  };
  for (const p of previsiones) suma(p.tags, 'estimado', p.estimado);
  for (const t of gastos) suma(t.tags, 'real', Math.abs(t.importeCts) / 100);

  return [...acc.entries()]
    .map(([tag, v]) => ({
      tag,
      estimado: roundMoney(v.estimado),
      real: roundMoney(v.real),
      desviacion: roundMoney(v.real - v.estimado),
    }))
    .filter((t) => t.estimado > 0 || t.real > 0)
    .sort((a, b) => b.real - a.real || b.estimado - a.estimado);
}

/** Meses con movimientos registrados, del más reciente al más antiguo. */
export function mesesConDatos(ledger: Ledger): string[] {
  const meses = new Set<string>();
  for (const t of ledger.transacciones()) meses.add(t.fecha.slice(0, 7));
  return [...meses].sort().reverse();
}
