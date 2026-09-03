// ── core/scenarios ────────────────────────────────────────────────────────────
// Simulaciones: distinguir lo canónico (comprometido) de lo simulado (un
// tanteo) dentro de las mismas colecciones.
//
// `simulacion` es un eje independiente de a qué escenario pertenece algo: dice
// que un elemento es un tanteo, no un compromiso. El dashboard proyecta las
// dos versiones (con y sin simulaciones) y pinta las dos.

/**
 * Cualquier elemento que pueda venir marcado como simulación.
 *
 * El índice no es decorativo: sin él la interfaz solo tendría propiedades
 * opcionales y TypeScript la trata como "tipo débil", rechazando cualquier
 * objeto que no comparta ninguna propiedad con ella — es decir, casi todos los
 * gastos y nóminas reales, que puede que no lleven el flag.
 */
export interface Simulable {
  simulacion?: boolean;
  [clave: string]: unknown;
}

export interface LoanSimulable extends Simulable {
  amortizaciones?: Simulable[];
}

/**
 * Recorta las colecciones a lo CANÓNICO: fuera todo lo marcado como simulación.
 *
 * El problema que resuelve: los resúmenes del dashboard ya excluían los
 * préstamos simulados (`l.activo && !l.simulacion`) pero la curva de saldo los
 * incluía, porque el proveedor solo miraba `activo`. Las dos cifras salían de
 * criterios distintos.
 *
 * Ahora no se esconde nada: se proyectan las dos versiones y se pintan las dos.
 */
export function sinSimulaciones<L extends LoanSimulable, E extends Simulable, N extends Simulable, A extends Simulable>(entrada: {
  loans: L[];
  expenses: E[];
  nominas: N[];
  accounts: A[];
}): { loans: L[]; expenses: E[]; nominas: N[]; accounts: A[] } {
  const real = (i: Simulable) => !i.simulacion;
  return {
    loans: entrada.loans.filter(real).map((l) => ({ ...l, amortizaciones: (l.amortizaciones || []).filter(real) })),
    expenses: entrada.expenses.filter(real),
    nominas: entrada.nominas.filter(real),
    accounts: entrada.accounts.filter(real),
  };
}

/** ¿Hay algo simulado que esté alterando la proyección? */
export function haySimulaciones<L extends LoanSimulable, E extends Simulable, N extends Simulable, A extends Simulable>(entrada: {
  loans: L[];
  expenses: E[];
  nominas: N[];
  accounts: A[];
}): boolean {
  const marcado = (i: Simulable) => !!i.simulacion;
  return (
    entrada.loans.some((l) => marcado(l) || (l.amortizaciones || []).some(marcado)) ||
    entrada.expenses.some(marcado) ||
    entrada.nominas.some(marcado) ||
    entrada.accounts.some(marcado)
  );
}
