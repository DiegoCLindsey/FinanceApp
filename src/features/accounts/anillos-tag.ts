// ── features/accounts/anillos-tag ─────────────────────────────────────────────
// Un anillo por etiqueta: gasto real frente a lo previsto en el periodo.
//
// Es un MEDIDOR, no un quesito: cada anillo responde a «¿cuánto me he comido de
// lo que tenía previsto en esta etiqueta?», que es una razón contra un límite.
// No es un reparto del total —un movimiento con dos etiquetas cuenta en las
// dos—, así que las porciones de una tarta no sumarían el gasto y engañarían.
//
// El color es de estado (dentro / al límite / pasado), nunca identidad: la
// etiqueta va escrita debajo y las cifras al lado, así que nada depende de
// distinguir un color. SVG en línea, como el resto de gráficas del paquete: no
// merece la pena arrastrar Chart.js para esto.

import { formatEUR } from '@/core/money';
import type { TagCierre } from '@/accounting/cierre-mes';
import { esc } from '../accounting/dom';

const RADIO = 26;
const GROSOR = 7;
const LADO = (RADIO + GROSOR) * 2;
const VUELTA = 2 * Math.PI * RADIO;

/** Cuántos anillos se pintan antes de resumir el resto en una línea. */
const MAXIMO = 12;

interface Estado {
  color: string;
  fraccion: number;
  /** Texto del centro, en una o dos líneas: en 45 px no cabe más. */
  etiqueta: string[];
}

/**
 * Estado del anillo. El caso «previsto 0 y gasto real» no es un 0 %: es gasto
 * que nadie había previsto, y se pinta el anillo entero en ámbar para que se
 * vea que ahí no había plan, no que se cumplió.
 */
function estadoDe(t: TagCierre): Estado {
  if (t.estimado <= 0) {
    return t.real > 0
      ? { color: 'var(--yellow)', fraccion: 1, etiqueta: ['sin', 'prever'] }
      : { color: 'var(--text3)', fraccion: 0, etiqueta: ['—'] };
  }
  const pct = (t.real / t.estimado) * 100;
  const color = pct > 110 ? 'var(--red)' : pct > 100 ? 'var(--yellow)' : 'var(--accent)';
  return { color, fraccion: Math.min(1, t.real / t.estimado), etiqueta: [`${Math.round(pct)}%`] };
}

function anillo(t: TagCierre): string {
  const { color, fraccion, etiqueta } = estadoDe(t);
  const centro = LADO / 2;
  const titulo = `${t.tag}: real ${formatEUR(t.real)} de ${formatEUR(t.estimado)} previsto (${t.desviacion >= 0 ? '+' : ''}${formatEUR(t.desviacion)})`;

  return `
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${LADO} ${LADO}" style="width:78px;height:78px" role="img" aria-label="${esc(titulo)}">
        <title>${esc(titulo)}</title>
        <circle cx="${centro}" cy="${centro}" r="${RADIO}" fill="none" stroke="var(--bg3)" stroke-width="${GROSOR}"/>
        <circle cx="${centro}" cy="${centro}" r="${RADIO}" fill="none" stroke="${color}" stroke-width="${GROSOR}"
                stroke-linecap="round" stroke-dasharray="${(VUELTA * fraccion).toFixed(2)} ${VUELTA.toFixed(2)}"
                transform="rotate(-90 ${centro} ${centro})"/>
        ${etiqueta
          .map((linea, i) => {
            const tam = etiqueta.length > 1 ? 9 : 12;
            const y = centro + (etiqueta.length > 1 ? i * 10 - 1 : 4);
            return `<text x="${centro}" y="${y}" text-anchor="middle" font-size="${tam}" font-family="var(--font-mono)" fill="var(--text2)">${esc(linea)}</text>`;
          })
          .join('')}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${esc(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${esc(formatEUR(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${esc(formatEUR(t.estimado))}</div>
    </div>`;
}

export function renderAnillosTag(tags: TagCierre[]): string {
  if (tags.length === 0) {
    return '<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';
  }

  const visibles = tags.slice(0, MAXIMO);
  const resto = tags.slice(MAXIMO);
  const sumaResto = resto.reduce((s, t) => s + t.real, 0);

  return `
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${visibles.map(anillo).join('')}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${resto.length > 0 ? `<span style="color:var(--text3)">y ${resto.length} etiqueta(s) más, ${esc(formatEUR(sumaResto))}</span>` : ''}
    </div>`;
}
