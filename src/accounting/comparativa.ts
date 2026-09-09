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
  estimado: number;
  real: number;
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
 * cruzar varios meses). Solo cuenta el gasto: comparar la nómina con lo que
 * entró de verdad es otro problema (igual que en `cerrarMes`).
 */
export function compararIntervalo(ledger: Ledger, estimaciones: Expense[], desde: ISODate, hasta: ISODate): MesComparativa[] {
  const deGasto = estimaciones.filter((e) => e.tipo === 'gasto' && e.activo !== false);
  return mesesEntre(desde, hasta).map((mes) => {
    const estimado = roundMoney(deGasto.reduce((s, e) => s + estimadoDelMes(e, mes), 0));
    const real = roundMoney(
      ledger
        .transacciones({ desde: `${mes}-01`, hasta: finDeMes(mes), tipo: 'gasto' })
        .reduce((s, t) => s + Math.abs(t.importeCts) / 100, 0),
    );
    return { mes, estimado, real };
  });
}
