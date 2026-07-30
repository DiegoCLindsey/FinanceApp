// ── core/tax/tables ───────────────────────────────────────────────────────────
// Resolución de tablas fiscales por ejercicio. Función pura: recibe el
// histórico y la tabla por defecto (el legacy los leía del State global).
// Paridad con FinanceMath.tramosIRPFParaAño / tramosGananciasParaAño.

import type { Tramos } from './irpf';

export interface TablaAnual {
  año: number;
  tramos: Tramos;
}

/**
 * Tramos aplicables a un ejercicio: coincidencia exacta de año; si no, la
 * entrada más reciente anterior; si no hay ninguna, la tabla por defecto.
 */
export function resolverTablaAnual(historico: TablaAnual[] | null | undefined, defaultTramos: Tramos, año: number): Tramos {
  const hist = historico || [];
  if (!hist.length) return defaultTramos;
  const match = hist.find((e) => e.año === año);
  if (match) return match.tramos;
  const earlier = hist.filter((e) => e.año < año).sort((a, b) => b.año - a.año);
  return earlier.length ? earlier[0].tramos : defaultTramos;
}

/** Crea un resolver `(año) => Tramos` para inyectar en los providers. */
export function crearResolverTramos(historico: TablaAnual[] | null | undefined, defaultTramos: Tramos): (año: number) => Tramos {
  return (año: number) => resolverTablaAnual(historico, defaultTramos, año);
}
