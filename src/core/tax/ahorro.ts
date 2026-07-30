// ── core/tax/ahorro ───────────────────────────────────────────────────────────
// Impuesto sobre ganancias de capital (base del ahorro). Paridad exacta con
// FinanceMath.calcGananciasCapital.

import type { Tramos } from './irpf';

export const TRAMOS_AHORRO_DEFAULT: Tramos = [
  [0, 19],
  [6000, 21],
  [50000, 23],
  [200000, 27],
  [300000, 28],
];

/** Impuesto progresivo sobre una plusvalía. Plusvalías no positivas → 0. */
export function calcGananciasCapital(plusvalia: number, tramos?: Tramos | null): number {
  if (!plusvalia || plusvalia <= 0) return 0;
  const t = tramos || TRAMOS_AHORRO_DEFAULT;
  let impuesto = 0;
  let restante = plusvalia;
  for (let i = 0; i < t.length; i++) {
    const [desde, pct] = t[i];
    const hasta = i < t.length - 1 ? t[i + 1][0] : Infinity;
    const tributa = Math.min(restante, hasta - desde);
    if (tributa <= 0) continue;
    impuesto += tributa * (pct / 100);
    restante -= tributa;
    if (restante <= 0) break;
  }
  return impuesto;
}
