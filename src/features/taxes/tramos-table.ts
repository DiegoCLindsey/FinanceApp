// Tabla de tramos marginales, compartida por las pestañas de fiscalidad.

import { formatEUR } from '@/core/money';
import type { Tramos } from '@/core/tax/irpf';
import { esc } from '../accounting/dom';

export function tablaTramos(tramos: Tramos): string {
  const filas = [...tramos]
    .sort((a, b) => a[0] - b[0])
    .map(([desde, pct], i, orden) => {
      const hasta = i < orden.length - 1 ? orden[i + 1][0] : null;
      const rango = hasta !== null ? `${formatEUR(desde)} – ${formatEUR(hasta)}` : `Más de ${formatEUR(desde)}`;
      return `<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${esc(rango)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${esc(pct)}%</td>
      </tr>`;
    })
    .join('');

  return `<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${filas}
  </table>`;
}
