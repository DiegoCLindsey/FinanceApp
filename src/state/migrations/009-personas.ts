// ── Migración → v9 ────────────────────────────────────────────────────────────
// Personas: quién hay en el proyecto, para poder repartir un gasto, una nómina
// o un préstamo entre varias. Instalaciones existentes no tienen esta
// colección — se siembra con una única persona por defecto («Yo»), que es
// exactamente donde ya caía todo implícitamente (nadie ha tenido que repartir
// nada hasta ahora). No hace falta tocar ni un gasto: la ausencia de
// `repartoConsumo`/`repartoPago` en un elemento YA significa «100% de la
// persona por defecto» — ver `core/reparto.ts` — así que esta migración no
// tiene nada que retro-rellenar en `loans`/`expenses`/`nominas`.

import { PERSONA_DEFECTO_ID, defaultPersona } from '../schema';
import type { MigrationContext, RawState } from './types';

export function migrateTo9(raw: RawState, _ctx: MigrationContext): RawState {
  const out: RawState = { ...raw };

  // Idempotente: si ya hay alguna persona con el id de por defecto, esta
  // migración ya corrió (o el estado viene de una copia que ya la traía).
  const actuales = Array.isArray(out.personas) ? (out.personas as Array<{ _id?: unknown }>) : [];
  if (actuales.some((p) => p?._id === PERSONA_DEFECTO_ID)) return out;

  out.personas = [defaultPersona(), ...actuales];
  return out;
}
