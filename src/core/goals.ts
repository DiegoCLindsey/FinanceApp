// ── core/goals ────────────────────────────────────────────────────────────────
// Objetivos de ahorro: saldo acumulado y proyección de la fecha de cumplimiento.
//
// Port de `goals/goals.js` con dos correcciones deliberadas (documentadas en
// docs/02-plan-refactor.md, tarea 1.7):
//
//  1. El fin de mes se calcula con `formatLocalDate`, no con `toISOString()`.
//     El legacy hacía `new Date(y, m+1, 0).toISOString().slice(0,10)` sobre una
//     fecha a medianoche local: en cualquier huso al este de Greenwich (España
//     incluida) eso devuelve el DÍA ANTERIOR, así que el saldo de cierre se
//     evaluaba el día 30 en vez del 31.
//
//  2. El extracto se genera UNA vez por cuenta, no una por cuenta y mes. El
//     legacy regeneraba el extracto completo dentro del bucle de 120 meses
//     (120 × nCuentas × nObjetivos generaciones por cada pintado de la vista).
//     Consecuencia numérica: el interés del periodo en curso. El proveedor de
//     intereses trunca el último periodo en la fecha de corte del extracto y
//     fecha el apunte al INICIO del periodo, de modo que el legacy contaba un
//     interés parcial y aquí se cuenta el del periodo entero. La diferencia es
//     de una fracción de mes de intereses sobre una proyección a años vista, y
//     puede adelantar la fecha estimada como mucho un mes.

import { formatLocalDate, type ISODate } from './dates';
import { saldoRealCuenta, type AccountLike } from './accounts';

export interface GoalLike {
  _id?: string;
  targetAmount?: number;
  /** Cuentas que suman para el objetivo. Vacío = todas las activas no simuladas. */
  cuentaIds?: string[];
  /** Descontar el colchón del saldo. Por defecto sí (solo `false` lo desactiva). */
  usarColchon?: boolean;
}

export interface CuentaObjetivo extends AccountLike {
  _id: string;
  activo?: boolean;
  simulacion?: boolean;
}

/** Evento de extracto: solo lo que necesita la proyección. */
export interface EventoSaldo {
  fecha: ISODate;
  saldoAcum?: number;
}

/** Cuentas que cuentan para el objetivo: las suyas, o todas las activas reales. */
export function cuentasDelObjetivo<T extends CuentaObjetivo>(g: GoalLike, accounts: T[]): T[] {
  const ids = g.cuentaIds && g.cuentaIds.length > 0 ? g.cuentaIds : null;
  return ids ? accounts.filter((a) => ids.includes(a._id)) : accounts.filter((a) => a.activo && !a.simulacion);
}

/**
 * Saldo real acumulado del objetivo hoy. `colchon` llega ya resuelto para que
 * esta función no dependa de la configuración; si el objetivo no lo descuenta
 * se ignora.
 */
export function saldoParaObjetivo<T extends CuentaObjetivo>(g: GoalLike, accounts: T[], colchon = 0): number {
  const total = cuentasDelObjetivo(g, accounts).reduce((s, a) => s + saldoRealCuenta(a), 0);
  return g.usarColchon !== false ? Math.max(0, total - colchon) : total;
}

export interface ProyeccionDeps<T extends CuentaObjetivo> {
  /** Extracto de una cuenta, ordenado por fecha, desde hoy hasta el horizonte. */
  extractoCuenta: (acc: T) => EventoSaldo[];
  /** Colchón aplicable en una fecha. Solo se consulta si el objetivo lo descuenta. */
  colchonEnFecha: (fecha: ISODate) => number;
  hoy?: Date;
  /** Meses a explorar hacia adelante (por defecto 120 = 10 años, como el legacy). */
  horizonteMeses?: number;
}

/**
 * Primer mes ('YYYY-MM') en que el saldo proyectado de las cuentas del objetivo
 * alcanza el importe meta. `null` si no se alcanza dentro del horizonte.
 */
export function proyectarFechaCumplimiento<T extends CuentaObjetivo>(g: GoalLike, accounts: T[], deps: ProyeccionDeps<T>): string | null {
  if (!g.targetAmount || g.targetAmount <= 0) return null;
  const cuentas = cuentasDelObjetivo(g, accounts);
  if (cuentas.length === 0) return null;

  const hoy = deps.hoy ?? new Date();
  const horizonte = deps.horizonteMeses ?? 120;
  const descuentaColchon = g.usarColchon !== false;

  // Un extracto por cuenta; el cursor avanza con los meses (ambos son monótonos)
  const seguimiento = cuentas.map((acc) => ({
    acc,
    eventos: deps.extractoCuenta(acc),
    cursor: 0,
    saldo: saldoRealCuenta(acc), // sin eventos aún: el saldo real de hoy
  }));

  for (let i = 1; i <= horizonte; i++) {
    const mes = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    const mesLabel = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}`;
    const mesFin = formatLocalDate(new Date(mes.getFullYear(), mes.getMonth() + 1, 0));

    let saldoTotal = 0;
    for (const s of seguimiento) {
      while (s.cursor < s.eventos.length && s.eventos[s.cursor].fecha <= mesFin) {
        s.saldo = s.eventos[s.cursor].saldoAcum ?? s.saldo;
        s.cursor++;
      }
      saldoTotal += s.saldo;
    }

    const colchon = descuentaColchon ? deps.colchonEnFecha(mesFin) : 0;
    if (saldoTotal - colchon >= g.targetAmount) return mesLabel;
  }
  return null;
}
