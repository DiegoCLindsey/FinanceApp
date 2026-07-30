// ── state/migrations ──────────────────────────────────────────────────────────
// Cadena de migraciones versionadas: una migración = un fichero numerado que
// lleva el estado de la versión N-1 a la N. `runMigrations` las aplica en orden
// desde la versión detectada. Deben ser idempotentes y no lanzar ante datos
// parciales (los backups viejos traen campos ausentes o de más).

import { SCHEMA_VERSION, type AppState } from '../schema';
import { migrateTo5 } from './005-normalize';
import type { Migration, MigrationContext, RawState } from './types';

const MIGRATIONS: Migration[] = [
  { version: 5, describe: 'Formaliza el esquema; limpia restos de features eliminadas; añade config.features', migrate: migrateTo5 },
];

/**
 * Aplica las migraciones pendientes en orden. `fromVersion` puede ser null/0
 * para un estado sin versionar (pre-v4), en cuyo caso se aplican todas.
 */
export function runMigrations(raw: RawState, fromVersion: number | null, ctx: MigrationContext): { state: AppState; applied: number[] } {
  let current = raw;
  const applied: number[] = [];
  for (const m of [...MIGRATIONS].sort((a, b) => a.version - b.version)) {
    if ((fromVersion ?? 0) >= m.version) continue;
    current = m.migrate(current, ctx);
    applied.push(m.version);
  }
  return { state: current as unknown as AppState, applied };
}

export { SCHEMA_VERSION };
export type { Migration, MigrationContext, RawState };
