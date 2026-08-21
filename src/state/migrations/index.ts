// ── state/migrations ──────────────────────────────────────────────────────────
// Cadena de migraciones versionadas: una migración = un fichero numerado que
// lleva el estado de la versión N-1 a la N. `runMigrations` las aplica en orden
// desde la versión detectada. Deben ser idempotentes y no lanzar ante datos
// parciales (los backups viejos traen campos ausentes o de más).

import { SCHEMA_VERSION, type AppState } from '../schema';
import { migrateTo5 } from './005-normalize';
import { migrateTo6 } from './006-accounting';
import { migrateTo7 } from './007-price-history';
import { migrateTo8 } from './008-planner';
import type { Migration, MigrationContext, RawState } from './types';

const MIGRATIONS: Migration[] = [
  { version: 5, describe: 'Formaliza el esquema; limpia restos de features eliminadas; añade config.features', migrate: migrateTo5 },
  {
    version: 6,
    describe: 'Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)',
    migrate: migrateTo6,
  },
  {
    version: 7,
    describe: 'Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación',
    migrate: migrateTo7,
  },
  {
    version: 8,
    describe: 'Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta',
    migrate: migrateTo8,
  },
];

/**
 * Claves de localStorage que ya no forman parte de AppState pero que las
 * migraciones necesitan leer. El store las carga además de las del esquema.
 */
export const LEGACY_KEYS = ['history'] as const;

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
