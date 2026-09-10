// ── accounting/comparativa ────────────────────────────────────────────────────
// Real vs. estimado mes a mes, para un intervalo cualquiera (F4, alta).
//
// A diferencia de `cierre-mes` — que es un RITUAL sobre un único mes cerrado,
// con reparto por estimación y detección de lo "sin prever" — esto es una
// vista exploratoria: cuánto se preveía gastar cada mes del intervalo elegido
// frente a lo que de verdad salió, sin exigir que el mes esté cerrado ni
// desglosar por concepto. Sirve para ver de un vistazo si un rango de varios
// meses se ha ido de lo previsto.

import { roundMoney } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { Expense } from '@/state/schema';
import type { Ledger } from './ledger';
import { estimadoDelMes } from './precision';

export interface MesComparativa {
  mes: string; // 'YYYY-MM'
  /** Gasto previsto y gasto real del mes. */
  estimado: number;
  real: number;
  /** Ingreso previsto y real. */
  ingresosEstimados: number;
  ingresosReales: number;
  /** Ingresos menos gastos: la cifra que no se descuadra por un traspaso. */
  netoEstimado: number;
  netoReal: number;
}

/** Último día de un mes 'YYYY-MM', en ISO. */
function finDeMes(mes: string): ISODate {
  const [y, m] = mes.split('-').map(Number);
  return `${mes}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
}

/** Todos los meses 'YYYY-MM' entre `desde` y `hasta`, ambos inclusive. */
export function mesesEntre(desde: ISODate, hasta: ISODate): string[] {
  const meses: string[] = [];
  let [y, m] = desde.slice(0, 7).split('-').map(Number);
  const [yFin, mFin] = hasta.slice(0, 7).split('-').map(Number);
  while (y < yFin || (y === yFin && m <= mFin)) {
    meses.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return meses;
}

/**
 * Real vs. estimado, mes a mes, para el intervalo `desde`–`hasta` (que puede
 * cruzar varios meses).
 *
 * Se comparan las tres magnitudes: gasto, ingreso y el neto. Mirar solo el
 * gasto engaña en cuanto hay traspasos entre cuentas propias sin marcar como
 * transferencia: el cargo aparece como gasto y el abono de la otra cuenta no lo
 * compensa en ninguna parte, así que la desviación se dispara sin que se haya
 * gastado un euro de más. El neto no tiene ese problema.
 */
export function compararIntervalo(ledger: Ledger, estimaciones: Expense[], desde: ISODate, hasta: ISODate): MesComparativa[] {
  const activas = (tipo: Expense['tipo']) => estimaciones.filter((e) => e.tipo === tipo && e.activo !== false);
  const deGasto = activas('gasto');
  const deIngreso = activas('ingreso');

  return mesesEntre(desde, hasta).map((mes) => {
    const rango = { desde: `${mes}-01`, hasta: finDeMes(mes) };
    const sumar = (tipo: 'gasto' | 'ingreso') =>
      roundMoney(ledger.transacciones({ ...rango, tipo }).reduce((s, t) => s + Math.abs(t.importeCts) / 100, 0));
    const previsto = (lista: Expense[]) => roundMoney(lista.reduce((s, e) => s + estimadoDelMes(e, mes), 0));

    const estimado = previsto(deGasto);
    const real = sumar('gasto');
    const ingresosEstimados = previsto(deIngreso);
    const ingresosReales = sumar('ingreso');
    return {
      mes,
      estimado,
      real,
      ingresosEstimados,
      ingresosReales,
      netoEstimado: roundMoney(ingresosEstimados - estimado),
      netoReal: roundMoney(ingresosReales - real),
    };
  });
}
