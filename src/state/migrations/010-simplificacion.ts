// ── Migración → v10 ───────────────────────────────────────────────────────────
// Simplificación grande: se retiran Supuestos (escenarios), el planificador
// financiero y el puente de "Objetivos de ahorro (antiguos)".
//
// Qué se limpia:
//   · `escenarioIds` en loans/expenses/nominas/accounts, incluido el que vive
//     anidado dentro de `loans[].amortizaciones[]` (un campo aparte, fácil de
//     olvidar);
//   · la colección `escenarios` y `config.escenarioActivo`;
//   · la colección `goals` — sus datos ya se copiaron a `planes` en la
//     migración 008, así que no hay pérdida real aquí;
//   · la colección `planes` — a diferencia de `goals`, aquí SÍ puede haber
//     datos que el usuario tecleó a mano (objetivos reales, no solo el
//     `plan_base` que siembra la migración 008). Antes de borrarla, cualquier
//     plan con objetivos de verdad se archiva en una clave inerte
//     (`_migracion010_planesArchivados`, fuera de `AppState`) para que no se
//     pierda sin más: no viaja por el store tipado, pero sigue en el backup
//     por si hay que recuperarla a mano.
//
// No toca `tramosIRPFHistorico`, `tramosGananciasCapitalHistorico`,
// `inflacion` ni `config.usarInflacion`: siguen siendo de Salarios, Cuentas y
// el dashboard.

import type { MigrationContext, RawState } from './types';

type Obj = Record<string, unknown>;

const asArray = (v: unknown): Obj[] => (Array.isArray(v) ? (v as Obj[]) : []);

/** Quita `escenarioIds` de un elemento, y de sus amortizaciones si las tiene. */
function sinEscenarioIds(item: Obj): Obj {
  const { escenarioIds: _escenarioIds, ...resto } = item;
  if (Array.isArray(resto.amortizaciones)) {
    resto.amortizaciones = (resto.amortizaciones as Obj[]).map((a) => {
      const { escenarioIds: _ids, ...restoAmort } = a;
      return restoAmort;
    });
  }
  return resto;
}

/** ¿Este plan tiene algo más que el `plan_base` trivial que siembra la migración 008? */
function esPlanConDatosReales(plan: Obj): boolean {
  if (plan._id !== 'plan_base') return true;
  return Array.isArray(plan.objetivos) && plan.objetivos.length > 0;
}

export function migrateTo10(raw: RawState, _ctx: MigrationContext): RawState {
  const out: RawState = { ...raw };

  // Idempotente: una vez retiradas, estas tres colecciones no vuelven a estar
  // presentes, así que su ausencia es la señal de que esta migración ya corrió.
  if (out.escenarios === undefined && out.planes === undefined && out.goals === undefined) return out;

  out.loans = asArray(out.loans).map(sinEscenarioIds);
  out.expenses = asArray(out.expenses).map(sinEscenarioIds);
  out.nominas = asArray(out.nominas).map(sinEscenarioIds);
  out.accounts = asArray(out.accounts).map(sinEscenarioIds);

  delete out.escenarios;

  if (out.config && typeof out.config === 'object') {
    const { escenarioActivo: _escenarioActivo, ...configSinEscenario } = out.config as Obj;
    out.config = configSinEscenario;
  }

  // `goals` ya se copió entero a `planes` en la migración 008; no hay nada que
  // archivar aquí.
  delete out.goals;

  const planesConDatos = asArray(out.planes).filter(esPlanConDatosReales);
  if (planesConDatos.length > 0) {
    console.warn(
      `[migración 010] Se archivan ${planesConDatos.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`,
    );
    out._migracion010_planesArchivados = planesConDatos;
  }
  delete out.planes;

  return out;
}
