// ── engine/precision-saldo ────────────────────────────────────────────────────
// Cuánto se equivoca la previsión, medido CONTRA EL SALDO REAL.
//
// Cada corrección con saldo real (`FinanceMath._corregirConSaldoReal`) es un
// error medido de la previsión a un mes vista: desde el saldo real anterior,
// con todo lo previsto entre medias, se esperaba X y había Y. Ese error lo
// incluye TODO —gastos sin estimar, imprevistos, movimientos sin registrar,
// fechas que bailan—, y solo necesita saldos anotados: no depende de clasificar
// movimientos en Cuentas, que es la parte que el usuario no tiene fina.
//
// De la serie de errores salen dos cifras:
//   · el SESGO: de media, ¿acabas el mes mejor o peor de lo previsto?
//   · la DISPERSIÓN: cuánto varía ese error de un mes a otro.
//
// ── Qué errores cuentan ──────────────────────────────────────────────────────
//   · Solo los de previsiones a un mes: entre el saldo real anterior y este,
//     de 20 a 45 días. Más cerca o más lejos no son comparables.
//   · No el primero de la serie: no parte de un saldo real sino del ancla.
//   · Ni los ATÍPICOS. Si anotas el saldo el 27 y la nómina que se preveía el
//     28 llega el 29, sale un «error» de una nómina entera que no lo es. Un mes
//     es atípico si se aleja de la mediana más de 3,5 desviaciones robustas
//     (mediana de las distancias: un solo mes raro no la mueve) Y además más
//     del 30 % de lo que entra en un mes (mínimo 100 €): con pocos meses, la
//     medida robusta sola apartaba meses normales solo porque los demás se
//     parecían mucho entre sí. Se apartan diciendo cuáles y, si hay un
//     movimiento grande previsto a ±3 días, cuál podría ser la causa.
//
// ── La banda ─────────────────────────────────────────────────────────────────
// Se devuelve como `Variabilidad`, la misma forma que usa `bandaDeConfianza`:
//   · sigmaMensual = la dispersión: ruido que se compensa en parte, crece con √m;
//   · sigmaDeriva  = √(sesgo² + dispersión²/n): lo que NO se compensa, crece
//     con m. Un sesgo medido es un error que se repite todos los meses, y
//     encima la media se conoce con un error de σ/√n.

import type { Variabilidad } from '@/accounting/confianza';

/** Lo que hace falta de un evento del extracto. */
export interface EventoConSaldo {
  fecha: string;
  concepto?: string;
  cuantia?: number;
  tipo?: string;
  sourceType?: string;
  delta?: number;
  saldoPrevisto?: number;
  saldoReal?: number;
  desdeSaldoReal?: string | null;
}

export interface ErrorMensual {
  /** Fecha del saldo real que se compara. */
  fecha: string;
  /** Fecha del saldo real anterior, desde el que se hizo la previsión. */
  desde: string;
  dias: number;
  previsto: number;
  real: number;
  /** real − previsto: positivo, acabaste mejor de lo previsto. */
  error: number;
  /** Por qué no cuenta, si no cuenta. */
  descartado?: string;
}

export interface PrecisionSaldo {
  /** Los errores que cuentan, en orden. */
  errores: ErrorMensual[];
  /** Los apartados por atípicos, con el motivo. */
  atipicos: ErrorMensual[];
  /** Media de los errores que cuentan. Positivo: acabas mejor de lo previsto. */
  sesgo: number;
  /** Desviación típica de esos errores. */
  dispersion: number;
  /** Para `bandaDeConfianza` / `describirBanda`. */
  variabilidad: Variabilidad;
}

export const MESES_MINIMOS_SALDO = 3;
const DIAS_MIN = 20;
const DIAS_MAX = 45;
/** Un mes es atípico si se aleja de la mediana más de esto, en desviaciones robustas. */
const UMBRAL_ATIPICO = 3.5;
/** …y más que esta parte de lo que entra en un mes (un desfase de fechas mueve pagos grandes). */
const PARTE_DE_LOS_INGRESOS = 0.3;
const ATIPICO_MINIMO = 100;
const INTERNOS = new Set(['transfer-out', 'transfer-in', 'aportacion-out', 'aportacion-in', 'ajuste-saldo-real']);

const dia = (f: string) => Date.UTC(Number(f.slice(0, 4)), Number(f.slice(5, 7)) - 1, Number(f.slice(8, 10))) / 86400000;
const mediana = (v: number[]) => {
  const o = [...v].sort((a, b) => a - b);
  const m = o.length >> 1;
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
};
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Mide la precisión con el extracto CORREGIDO (generado con
 * `corregirConSaldoReal: true`) de los meses pasados.
 *
 * `hasta`: solo cuentan los saldos reales hasta esta fecha (hoy).
 */
export function medirPrecisionConSaldo(extracto: EventoConSaldo[], hasta: string): PrecisionSaldo {
  const candidatos: ErrorMensual[] = [];
  for (const e of extracto) {
    if (e.sourceType !== 'ajuste-saldo-real' || !e.desdeSaldoReal || e.fecha > hasta) continue;
    const dias = dia(e.fecha) - dia(e.desdeSaldoReal);
    if (dias < DIAS_MIN || dias > DIAS_MAX) continue;
    candidatos.push({
      fecha: e.fecha,
      desde: e.desdeSaldoReal,
      dias,
      previsto: r2(e.saldoPrevisto ?? 0),
      real: r2(e.saldoReal ?? 0),
      error: r2(e.delta ?? 0),
    });
  }

  // Atípicos, con mediana y MAD (×1,4826 ≈ desviación típica si los errores
  // fueran normales). Con menos de 4 meses no se aparta nada: no hay con qué
  // comparar.
  const atipicos: ErrorMensual[] = [];
  let errores = candidatos;
  if (candidatos.length >= 4) {
    const med = mediana(candidatos.map((c) => c.error));
    const mad = 1.4826 * mediana(candidatos.map((c) => Math.abs(c.error - med)));
    // Lo que entra en un mes, de media, en el periodo medido (sin traspasos ni intereses).
    const fechas = extracto.map((ev) => ev.fecha).sort();
    const meses = fechas.length ? Math.max(1, (dia(fechas[fechas.length - 1]) - dia(fechas[0])) / 30.44) : 1;
    const ingresos = extracto
      .filter((ev) => ev.tipo === 'ingreso' && !INTERNOS.has(ev.sourceType ?? '') && ev.sourceType !== 'account-interest')
      .reduce((s, ev) => s + Math.abs(ev.cuantia ?? 0), 0);
    const limite = Math.max(UMBRAL_ATIPICO * mad, PARTE_DE_LOS_INGRESOS * (ingresos / meses), ATIPICO_MINIMO);
    errores = [];
    for (const c of candidatos) {
      if (Math.abs(c.error - med) <= limite) {
        errores.push(c);
        continue;
      }
      // ¿Un movimiento grande previsto a ±3 días del saldo? Probable desfase.
      const cerca = extracto
        .filter(
          (ev) =>
            !INTERNOS.has(ev.sourceType ?? '') &&
            (ev.tipo === 'ingreso' || ev.tipo === 'gasto') &&
            Math.abs(dia(ev.fecha) - dia(c.fecha)) <= 3 &&
            Math.abs(ev.cuantia ?? 0) >= Math.abs(c.error - med) * 0.5,
        )
        .sort((a, b) => Math.abs(b.cuantia ?? 0) - Math.abs(a.cuantia ?? 0))[0];
      atipicos.push({
        ...c,
        descartado: cerca
          ? `posible desfase de fechas con «${cerca.concepto ?? 'un movimiento'}» (previsto el ${cerca.fecha})`
          : 'mes atípico',
      });
    }
  }

  const n = errores.length;
  const sesgo = n ? errores.reduce((s, e) => s + e.error, 0) / n : 0;
  const dispersion = n >= 2 ? Math.sqrt(errores.reduce((s, e) => s + (e.error - sesgo) ** 2, 0) / (n - 1)) : 0;
  const fiable = n >= MESES_MINIMOS_SALDO;
  return {
    errores,
    atipicos,
    sesgo: r2(sesgo),
    dispersion: r2(dispersion),
    variabilidad: {
      sigmaMensual: fiable ? dispersion : 0,
      sigmaDeriva: fiable ? Math.sqrt(sesgo ** 2 + dispersion ** 2 / n) : 0,
      estimaciones: n,
      mesesMinimos: n,
      mesesMaximos: n,
      fiable,
    },
  };
}

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.abs(n));

/** Frase para el rótulo de la gráfica de saldo. */
export function describirPrecisionSaldo(p: PrecisionSaldo): string {
  const n = p.errores.length;
  if (!p.variabilidad.fiable) {
    return (
      `Para medir cuánto se desvía la previsión hacen falta al menos ${MESES_MINIMOS_SALDO} meses seguidos con saldo real anotado` +
      `${n ? ` (hay ${n})` : ''}: se compara lo que se preveía a un mes con el saldo que hubo.`
    );
  }
  const sentido =
    Math.abs(p.sesgo) < 0.5
      ? 'de media, acabas el mes justo en lo previsto'
      : `de media, acabas el mes ${eur(p.sesgo)} ${p.sesgo > 0 ? 'mejor' : 'peor'} de lo previsto`;
  const atip = p.atipicos.length
    ? ` Se apartan ${p.atipicos.length} ${p.atipicos.length === 1 ? 'mes atípico' : 'meses atípicos'}: ${p.atipicos
        .map((a) => `${a.fecha} (${a.error > 0 ? '+' : '−'}${eur(a.error)}, ${a.descartado})`)
        .join('; ')}.`
    : '';
  const mesesES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const mesCorto = (f: string) => `${mesesES[Number(f.slice(5, 7)) - 1]} ${f.slice(0, 4)}`;
  const tramo = `${mesCorto(p.errores[0].fecha)} – ${mesCorto(p.errores[n - 1].fecha)}`;
  return (
    `Margen de error medido con tu saldo real en ${n} meses (${tramo}): ${sentido}, con una dispersión de ±${eur(p.dispersion)} al mes. ` +
    `La banda (±1 desviación típica, el 68 % de los casos) se ensancha con el tiempo, y más deprisa si hay sesgo: un error que se repite se acumula cada mes.` +
    atip
  );
}
