// ── planner/finanzas ──────────────────────────────────────────────────────────
// Fórmulas financieras del gestor de objetivos (§3.1 del documento de diseño).
//
// TODO EN CÉNTIMOS ENTEROS. Los importes entran y salen como enteros; los tipos
// de interés son los únicos números en coma flotante, y ahí es inevitable. El
// redondeo se hace UNA vez, al final de cada fórmula, y siempre hacia arriba en
// las aportaciones necesarias: quedarse corto por un céntimo significa no llegar
// al objetivo, que es el error que sí duele.
//
// TÉRMINOS REALES. Todas las rentabilidades son reales (nominal − inflación),
// como fija el principio 1 del documento. Aquí no se modela la inflación.

/** Rentabilidad real ANUAL en tanto por uno: 0.05 = 5 %. */
export type TasaAnual = number;

/** Importe en céntimos enteros. */
export type Centimos = number;

/** Umbral por debajo del cual una tasa se trata como cero (ver `esCero`). */
const EPSILON_TASA = 1e-12;

/**
 * ¿La tasa es cero a efectos de cálculo?
 *
 * Las fórmulas de anualidades dividen entre `(1+i)^n − 1`, que tiende a 0 con i.
 * Con una cuenta sin remunerar (i = 0) eso es una división por cero; con tasas
 * absurdamente pequeñas, una pérdida de precisión que devuelve cifras sin
 * sentido. Los dos casos se desvían a la variante lineal.
 */
export const esCero = (i: number): boolean => Math.abs(i) < EPSILON_TASA;

/** Tasa mensual a partir de la anual. El documento usa división simple. */
export const mensual = (anual: TasaAnual): number => anual / 12;

/**
 * Aportación mensual necesaria para llegar a `objetivo` en `meses`.
 *
 *   PMT = (FV − PV·(1+i)^n) · i / ((1+i)^n − 1)
 *
 * Devuelve 0 si ya se ha llegado: un objetivo cubierto no debe seguir pidiendo
 * dinero, que es lo que libera su cuota hacia el siguiente (§2.4).
 */
export function cuotaNecesaria(objetivo: Centimos, saldoActual: Centimos, meses: number, tasaAnual: TasaAnual): Centimos {
  if (meses <= 0) return Math.max(0, Math.ceil(objetivo - saldoActual));
  const restante = objetivo - saldoActual;
  if (restante <= 0) return 0;

  const i = mensual(tasaAnual);
  if (esCero(i)) return Math.ceil(restante / meses);

  const factor = Math.pow(1 + i, meses);
  const pmt = ((objetivo - saldoActual * factor) * i) / (factor - 1);
  // Si el saldo ya crece solo hasta pasarse del objetivo, no hace falta aportar.
  return pmt <= 0 ? 0 : Math.ceil(pmt);
}

/**
 * Valor futuro de un saldo con aportaciones mensuales constantes.
 *
 *   FV = PV·(1+i)^n + PMT·((1+i)^n − 1) / i
 */
export function valorFuturo(saldoActual: Centimos, cuota: Centimos, meses: number, tasaAnual: TasaAnual): Centimos {
  if (meses <= 0) return Math.round(saldoActual);
  const i = mensual(tasaAnual);
  if (esCero(i)) return Math.round(saldoActual + cuota * meses);

  const factor = Math.pow(1 + i, meses);
  return Math.round(saldoActual * factor + (cuota * (factor - 1)) / i);
}

/**
 * Meses hasta alcanzar `objetivo` aportando `cuota` al mes.
 *
 *   n = ln( (FV·i + PMT) / (PV·i + PMT) ) / ln(1+i)
 *
 * Devuelve `null` cuando no se alcanza nunca: sin aportación y sin rentabilidad
 * suficiente, el logaritmo recibiría un argumento no positivo. Eso NO es un
 * error de cálculo, es una respuesta legítima ("así no llegas"), y quien llama
 * tiene que distinguirla de "llegas en 0 meses".
 */
export function mesesHasta(objetivo: Centimos, saldoActual: Centimos, cuota: Centimos, tasaAnual: TasaAnual): number | null {
  if (saldoActual >= objetivo) return 0;

  const i = mensual(tasaAnual);
  if (esCero(i)) {
    if (cuota <= 0) return null;
    return Math.ceil((objetivo - saldoActual) / cuota);
  }

  const num = objetivo * i + cuota;
  const den = saldoActual * i + cuota;
  if (num <= 0 || den <= 0) return null;

  const n = Math.log(num / den) / Math.log(1 + i);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.ceil(n);
}

/** Un mes de rendimiento sobre un saldo. */
export function rendimientoMensual(saldo: Centimos, tasaAnual: TasaAnual): Centimos {
  const i = mensual(tasaAnual);
  if (esCero(i)) return 0;
  return Math.round(saldo * i);
}

// ── Independencia económica (§2.6) ────────────────────────────────────────────

export interface DerivacionCapital {
  /** Renta NETA mensual deseada, en céntimos. */
  rentaNetaMensual: Centimos;
  /** Tasa de retiro seguro anual (SWR). 0.04 = 4 %. */
  tasaRetiroSeguro: number;
  /** Tipo fiscal efectivo sobre lo retirado. 0.20 = 20 %. */
  tipoFiscalEfectivo: number;
}

export interface CapitalNecesario {
  retiroBrutoAnual: Centimos;
  capitalNecesario: Centimos;
}

/**
 * Capital necesario para sostener una renta.
 *
 *   retiroBrutoAnual = (renta × 12) / (1 − tipoFiscal)
 *   capitalNecesario = retiroBrutoAnual / SWR
 *
 * Un SWR del 4 % está calibrado para que la cartera aguante ~30 años con alta
 * probabilidad, NO para que el capital no decrezca nunca. Quien quiera no tocar
 * principal debería usar 3–3,5 %. La UI tiene que decirlo (§2.6).
 */
export function capitalParaRenta({ rentaNetaMensual, tasaRetiroSeguro, tipoFiscalEfectivo }: DerivacionCapital): CapitalNecesario {
  if (tasaRetiroSeguro <= 0) throw new RangeError('La tasa de retiro seguro tiene que ser mayor que cero.');
  if (tipoFiscalEfectivo >= 1) throw new RangeError('El tipo fiscal efectivo no puede llegar al 100 %.');

  const retiroBrutoAnual = Math.round((rentaNetaMensual * 12) / (1 - tipoFiscalEfectivo));
  return { retiroBrutoAnual, capitalNecesario: Math.round(retiroBrutoAnual / tasaRetiroSeguro) };
}

/** La inversa: qué renta neta mensual sostiene un capital dado. */
export function rentaDeCapital(capital: Centimos, tasaRetiroSeguro: number, tipoFiscalEfectivo: number): Centimos {
  const brutoAnual = capital * tasaRetiroSeguro;
  return Math.round((brutoAnual * (1 - tipoFiscalEfectivo)) / 12);
}
