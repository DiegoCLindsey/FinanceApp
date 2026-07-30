// Tipos compartidos de la cadena de migraciones (fichero propio para que las
// migraciones no importen del índice y no haya ciclos).

/** Estado sin tipar tal como viene de localStorage o de un backup JSON. */
export type RawState = Record<string, unknown>;

export interface MigrationContext {
  hoyISO: string;
  finISO: string;
}

export interface Migration {
  /** Versión a la que lleva el estado. */
  version: number;
  describe: string;
  migrate(raw: RawState, ctx: MigrationContext): RawState;
}
