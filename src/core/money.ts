// ── core/money ────────────────────────────────────────────────────────────────
// Política de precisión del dominio nuevo (docs/02-plan-refactor.md):
// - Los importes persistidos y presentados se redondean a céntimos.
// - Los cálculos intermedios (tablas, proyecciones) mantienen precisión completa
//   en float para conservar paridad con el motor legacy; el paso a céntimos
//   ocurre en los bordes (persistencia/presentación).

/** Euros → céntimos enteros (redondeo half-away-from-zero). */
export function toCents(eur: number): number {
  return Math.sign(eur) * Math.round(Math.abs(eur) * 100);
}

/** Céntimos enteros → euros. */
export function fromCents(cents: number): number {
  return cents / 100;
}

/** Redondeo monetario a 2 decimales (half-away-from-zero, estable con negativos). */
export function roundMoney(eur: number): number {
  return fromCents(toCents(eur));
}

/** Formato €. Mantiene el comportamiento de FinanceMath.eur (null/undefined → 0). */
export function formatEUR(n: number | null | undefined): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n || 0);
}

/** Formato porcentaje con 2 decimales. Paridad con FinanceMath.pct. */
export function formatPct(n: number | null | undefined): string {
  return (n || 0).toFixed(2) + '%';
}
