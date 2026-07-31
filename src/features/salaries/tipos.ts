// Tipos que comparten los módulos de la vista de nóminas. Fichero propio para
// que `pensions.ts` no tenga que importar del índice y no haya ciclos.
export type { Account, Escenario, Nomina } from '@/state/schema';
export type { PuntoSaldo as PuntoSaldoLike } from '@/core/accounts';
