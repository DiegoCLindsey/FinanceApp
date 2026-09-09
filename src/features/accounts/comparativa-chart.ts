// ── features/accounts/comparativa-chart ───────────────────────────────────────
// SVG en línea del real vs. estimado por mes (F4, alta). Sin Chart.js: es la
// única gráfica de todo `src/`, y arrastrar una dependencia de canvas +
// mocking en los tests por un solo gráfico no compensaba. Un SVG generado a
// mano es tan grande como el propio marcado y se puede probar con jsdom/
// happy-dom sin más.

import { formatEUR } from '@/core/money';
import { nombreMes, esc } from '../accounting/dom';
import type { MesComparativa } from '@/accounting/comparativa';

const ANCHO = 640;
const ALTO = 200;
const PAD = { top: 14, right: 16, bottom: 26, left: 54 };

/** Primeras tres letras del nombre del mes, para el eje X. */
function mesCorto(mes: string): string {
  return nombreMes(mes).slice(0, 3);
}

export function renderComparativaSvg(datos: MesComparativa[]): string {
  if (datos.length === 0) {
    return '<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';
  }

  const anchoUtil = ANCHO - PAD.left - PAD.right;
  const altoUtil = ALTO - PAD.top - PAD.bottom;
  const maxValor = Math.max(1, ...datos.flatMap((d) => [d.estimado, d.real]));
  const x = (i: number) => PAD.left + (datos.length === 1 ? anchoUtil / 2 : (i / (datos.length - 1)) * anchoUtil);
  const y = (v: number) => PAD.top + altoUtil - (Math.max(0, v) / maxValor) * altoUtil;

  const puntosEstimado = datos.map((d, i) => `${x(i)},${y(d.estimado)}`).join(' ');
  const puntosReal = datos.map((d, i) => `${x(i)},${y(d.real)}`).join(' ');

  // La línea de "real" lleva un punto por mes: son observaciones concretas.
  // La de "estimado" es una proyección continua y NO lleva marcadores — un
  // punto ahí sugeriría un dato discreto que no existe.
  const circulosReal = datos
    .map(
      (d, i) =>
        `<circle cx="${x(i).toFixed(1)}" cy="${y(d.real).toFixed(1)}" r="3" fill="var(--accent)"><title>${esc(nombreMes(d.mes))}: ${esc(formatEUR(d.real))}</title></circle>`,
    )
    .join('');

  const etiquetasX = datos
    .map(
      (d, i) =>
        `<text x="${x(i).toFixed(1)}" y="${ALTO - 8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${esc(mesCorto(d.mes))}</text>`,
    )
    .join('');

  return `
    <svg viewBox="0 0 ${ANCHO} ${ALTO}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Gasto real frente a estimado por mes">
      <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${ALTO - PAD.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${PAD.left}" y1="${ALTO - PAD.bottom}" x2="${ANCHO - PAD.right}" y2="${ALTO - PAD.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${PAD.top + 8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${esc(formatEUR(maxValor))}</text>
      <polyline points="${puntosEstimado}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${puntosReal}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${circulosReal}
      ${etiquetasX}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`;
}
