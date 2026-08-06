// ── core/tax/irpf ─────────────────────────────────────────────────────────────
// IRPF de rendimientos del trabajo. Paridad exacta con FinanceMath (tests de
// paridad en tests/core/). Tramos: [[desde, tipo%], ...].

export type Tramos = [number, number][];

export const TRAMOS_IRPF_DEFAULT: Tramos = [
  [0, 19],
  [12450, 24],
  [20200, 30],
  [35200, 37],
  [60000, 45],
  [300000, 47],
];

/** Cuota íntegra por tramos progresivos. */
export function calcIRPF(baseImponible: number, tramos: Tramos): number {
  const sorted = [...tramos].sort((a, b) => a[0] - b[0]);
  let impuesto = 0;
  let base = baseImponible;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const [min, tipo] = sorted[i];
    if (base <= min) continue;
    impuesto += (base - min) * (tipo / 100);
    base = min;
  }
  return impuesto;
}

/** Desglose de cómo se llega de un bruto del trabajo a su base imponible. */
export interface DesgloseBaseTrabajo {
  /** Bruto menos la retribución flexible exenta (art. 42 LIRPF). */
  baseIRPF: number;
  /** Cotización a la Seguridad Social del empleado. */
  cotizSS: number;
  /** Otros gastos deducibles del art. 19.2 LIRPF (tope 2.000 €). */
  gastosArt19: number;
  /** Rendimiento neto del trabajo. */
  RNT: number;
  /** Reducción por rendimientos bajos del art. 20 LIRPF. */
  reducArt20: number;
  /** Base imponible resultante. */
  baseImponible: number;
}

/**
 * Camino completo de bruto a base imponible del trabajo. Lo usa la vista de
 * fiscalidad para enseñar cada línea del cuadro de la declaración; antes lo
 * recalculaba por su cuenta y podía desviarse de lo que decían las nóminas.
 *
 * `flexAnual`: retribución flexible anual (art. 42), exenta.
 * OJO: la cotización se calcula sobre el bruto COMPLETO, no sobre el dinerario
 * — así lo hace el motor legacy y así se mantiene por paridad.
 */
export function desgloseBaseTrabajo(bruto: number, flexAnual: number): DesgloseBaseTrabajo {
  const baseIRPF = Math.max(0, bruto - (flexAnual || 0));
  const cotizSS = bruto * 0.0635;
  const gastosArt19 = Math.min(2000, baseIRPF);
  const RNT = Math.max(0, baseIRPF - cotizSS - gastosArt19);
  const reducArt20 = RNT <= 15876 ? 7302 : RNT <= 21622 ? Math.max(0, 7302 - 1.75 * (RNT - 15876)) : 0;
  return { baseIRPF, cotizSS, gastosArt19, RNT, reducArt20, baseImponible: Math.max(0, RNT - reducArt20) };
}

/**
 * Base imponible de rendimientos del trabajo tras SS (6,35 %), gastos del
 * art. 19.2 (hasta 2.000 €) y reducción del art. 20 LIRPF.
 * flexAnual: retribución flexible anual (art. 42) que reduce la base.
 */
export function calcBaseImponibleTrabajo(bruto: number, flexAnual: number): number {
  return desgloseBaseTrabajo(bruto, flexAnual).baseImponible;
}

/** Retención mensual estimada = IRPF(salario anual) / 12. */
export function retencionMensual(salarioAnual: number, tramos: Tramos): number {
  return calcIRPF(salarioAnual, tramos) / 12;
}
