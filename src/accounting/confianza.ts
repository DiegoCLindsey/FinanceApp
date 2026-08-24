// ── accounting/confianza ──────────────────────────────────────────────────────
// Cuánto puede desviarse la proyección, medido con lo que ya ha pasado.
//
// La proyección del dashboard es UNA LÍNEA: «el 14 de marzo tendrás 24.312,87 €».
// Eso es falso con una precisión que nadie tiene. El súper varía, la luz varía, y
// la aplicación **ya sabe cuánto** varían: el analizador de precisión guarda, mes
// a mes, la diferencia entre lo estimado y lo real de cada gasto.
//
// Este módulo convierte esa diferencia observada en una banda alrededor de la
// línea. No es Monte Carlo —que se retiró con razón, porque pedía al usuario
// varianzas inventadas—: es aritmética sobre datos medidos.
//
// ── Los dos supuestos, dichos en voz alta ────────────────────────────────────
//
//  1. **Los errores de estimaciones distintas son independientes.** Se suman en
//     cuadrado (σ² total = Σ σ²ᵢ) en vez de sumarse a pelo. Si un mes malo lo es
//     para todo a la vez —una mudanza, un viaje—, la banda se queda corta. Se
//     asume igual porque la alternativa (sumar linealmente) da una banda tan
//     ancha que deja de decir nada.
//  2. **El error de cada mes es independiente del anterior.** Por eso el ruido
//     acumulado crece con √n y no con n: dos meses de error no se suman, se
//     compensan en parte. Es el comportamiento de un paseo aleatorio.
//  3. **La media tampoco se conoce.** Se ha medido con unos pocos meses, así
//     que se sabe con un error de σ/√n. Y ese error NO se compensa: si tu gasto
//     medio real es 40 € más de lo que crees, son 40 € más *todos* los meses.
//     Se acumula linealmente, y por eso a tres años vista es el término que
//     manda. Ignorarlo —que es lo que hacía la primera versión de esto— daba
//     una banda tan estrecha que en la práctica no se veía: prometía sobre la
//     proyección a largo plazo una precisión que no se tiene.
//
// Los dos términos se combinan en cuadrado, como errores independientes que
// son: ancho(m) = z · √( (σ·√m)² + (σ_deriva·m)² ).
//
// Con menos de tres meses de dato real no se devuelve nada: una desviación
// típica sobre dos puntos es un número, pero no es información.

import { roundMoney } from '@/core/money';
import type { PrecisionEstimacion } from './precision';

/** Meses de dato real que necesita una estimación para contar. */
const MESES_MINIMOS = 3;

export interface Variabilidad {
  /** Desviación típica del error de UN mes, agregada, en euros. */
  sigmaMensual: number;
  /**
   * Error de la propia media mensual (σ/√n agregado), en euros.
   *
   * Es lo mal que se conoce el centro de la proyección, no lo que oscila
   * alrededor de él. Se acumula linealmente (supuesto 3 de la cabecera).
   */
  sigmaDeriva: number;
  /** Estimaciones que han aportado datos. */
  estimaciones: number;
  /** Meses de historia de la estimación con menos datos. */
  mesesMinimos: number;
  /** Meses de historia de la que más tiene. */
  mesesMaximos: number;
  /** Hay datos suficientes para que la banda signifique algo. */
  fiable: boolean;
}

/** Por debajo de medio céntimo mensual no hay variabilidad, hay coma flotante. */
function aplastar(x: number): number {
  return x < 0.005 ? 0 : x;
}

/** Desviación típica muestral. `null` si no hay puntos suficientes. */
export function desviacionTipica(valores: number[]): number | null {
  if (valores.length < 2) return null;
  const media = valores.reduce((s, v) => s + v, 0) / valores.length;
  // Muestral (n − 1): estimamos la desviación de la población a partir de una
  // muestra pequeña, y dividir por n la subestimaría.
  const varianza = valores.reduce((s, v) => s + (v - media) ** 2, 0) / (valores.length - 1);
  return Math.sqrt(varianza);
}

/**
 * Mide cuánto se desvía en un mes típico el conjunto de las estimaciones.
 *
 * Solo cuentan las que tienen al menos `MESES_MINIMOS` meses con dato real.
 */
export function medirVariabilidad(analisis: PrecisionEstimacion[]): Variabilidad {
  const sigmas: number[] = [];
  const derivas: number[] = [];
  const largos: number[] = [];

  for (const a of analisis) {
    if (a.meses.length < MESES_MINIMOS) continue;
    const sigma = desviacionTipica(a.meses.map((m) => m.desviacion));
    if (sigma === null) continue;
    sigmas.push(sigma);
    // Error típico de la media de esta estimación: σ/√n. Cuantos más meses de
    // historia, mejor se conoce su gasto medio y menos deriva aporta.
    derivas.push(sigma / Math.sqrt(a.meses.length));
    largos.push(a.meses.length);
  }

  if (sigmas.length === 0) {
    return { sigmaMensual: 0, sigmaDeriva: 0, estimaciones: 0, mesesMinimos: 0, mesesMaximos: 0, fiable: false };
  }

  // Suma en cuadrado: errores independientes (supuesto 1 de la cabecera).
  const sigmaMensual = Math.sqrt(sigmas.reduce((s, v) => s + v * v, 0));
  const sigmaDeriva = Math.sqrt(derivas.reduce((s, v) => s + v * v, 0));

  return {
    // Sin redondear a céntimos: no son importes, son parámetros que luego se
    // multiplican por decenas de meses, y ahí medio céntimo de recorte se nota.
    // Solo se aplasta el ruido de coma flotante, para que «sin variabilidad»
    // siga siendo exactamente 0 y no 3·10⁻¹⁵.
    sigmaMensual: aplastar(sigmaMensual),
    sigmaDeriva: aplastar(sigmaDeriva),
    estimaciones: sigmas.length,
    mesesMinimos: Math.min(...largos),
    mesesMaximos: Math.max(...largos),
    fiable: true,
  };
}

/**
 * Media banda a `meses` vista, en euros.
 *
 * Dos términos, combinados en cuadrado:
 *   · el ruido mensual, que crece con √meses (supuesto 2);
 *   · la deriva por no conocer la media, que crece con meses (supuesto 3).
 *
 * `z` son desviaciones típicas: 1 ≈ 68 % de los casos, 2 ≈ 95 %.
 *
 * `sigmaDeriva` es opcional y vale 0 por defecto: así el ruido se puede pedir
 * suelto, que es lo que hacen los tests que fijan el crecimiento en √meses.
 */
export function bandaAcumulada(sigmaMensual: number, meses: number, z = 1, sigmaDeriva = 0): number {
  if (meses <= 0) return 0;
  const ruido = Math.max(0, sigmaMensual) * Math.sqrt(meses);
  const deriva = Math.max(0, sigmaDeriva) * meses;
  if (ruido === 0 && deriva === 0) return 0;
  return roundMoney(z * Math.hypot(ruido, deriva));
}

export interface PuntoBanda {
  fecha: string;
  /** Saldo proyectado, tal cual. */
  saldo: number;
  arriba: number;
  abajo: number;
}

export interface EventoExtracto {
  fecha: string;
  saldoAcum: number;
}

export interface OpcionesBanda {
  /** Desviaciones típicas de ancho. Por defecto 1. */
  z?: number;
  /** Desde cuándo se acumula incertidumbre. Por defecto, el primer punto. */
  desde?: string;
}

/**
 * Envuelve un extracto proyectado en una banda de confianza.
 *
 * Devuelve `[]` si no hay datos suficientes: es preferible no pintar nada a
 * pintar una banda inventada, que daría una falsa sensación de rigor justo en
 * la pantalla donde el usuario decide.
 */
export function bandaDeConfianza(extracto: EventoExtracto[], variabilidad: Variabilidad, opciones: OpcionesBanda = {}): PuntoBanda[] {
  if (!variabilidad.fiable || extracto.length === 0) return [];
  const { z = 1 } = opciones;

  const origen = opciones.desde ?? extracto[0].fecha;
  const [ay, am] = origen.slice(0, 7).split('-').map(Number);

  return extracto.map((e) => {
    const [ey, em] = e.fecha.slice(0, 7).split('-').map(Number);
    const meses = Math.max(0, (ey - ay) * 12 + (em - am));
    const ancho = bandaAcumulada(variabilidad.sigmaMensual, meses, z, variabilidad.sigmaDeriva);
    return {
      fecha: e.fecha,
      saldo: e.saldoAcum,
      arriba: roundMoney(e.saldoAcum + ancho),
      abajo: roundMoney(e.saldoAcum - ancho),
    };
  });
}

/** Frase para el rótulo del gráfico. */
export function describirBanda(v: Variabilidad, z = 1): string {
  if (!v.fiable) {
    return 'Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.';
  }
  if (v.sigmaMensual === 0) {
    // Desviarse SIEMPRE lo mismo no es incertidumbre, es un sesgo: la banda
    // sería una raya. Y un sesgo se arregla ajustando la estimación, que es
    // justo lo que ofrece el cierre de mes.
    return (
      'Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. ' +
      'Si se desvían de forma sistemática, ajústalas desde el cierre de mes.'
    );
  }
  const pct = z >= 2 ? '95 %' : '68 %';
  // «6–6 meses» se lee fatal: cuando todas las estimaciones tienen el mismo
  // historial, se dice una cifra y ya.
  const meses = v.mesesMinimos === v.mesesMaximos ? `${v.mesesMinimos}` : `${v.mesesMinimos}–${v.mesesMaximos}`;
  return (
    `Banda de ±${z} desviación${z !== 1 ? 'es' : ''} típica${z !== 1 ? 's' : ''} (${pct} de los casos), ` +
    `medida sobre ${v.estimaciones} estimación${v.estimaciones !== 1 ? 'es' : ''} con ${meses} mes${v.mesesMaximos !== 1 ? 'es' : ''} de datos reales. ` +
    'Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.'
  );
}
