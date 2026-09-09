// ── features/accounting/precision-panel ───────────────────────────────────────
// Precisión agregada POR ETIQUETA y ajuste en bloque de las estimaciones.
//
// La tabla estimación a estimación que había aquí se retiró: repetía lo que ya
// enseña el cierre justo encima (previsto, real y desviación de cada una, con
// su botón de ajuste), y para ver de un vistazo dónde te desvías funcionan
// mejor los anillos por etiqueta del cierre. Lo que no estaba en ninguna otra
// parte —el agregado por etiqueta y el ajuste en bloque— se queda.

import { formatEUR } from '@/core/money';
import type { Adjuster, Sugerencia } from '@/accounting/adjust';
import { sugerirAjuste } from '@/accounting/adjust';
import type { PrecisionAnalyzer, PrecisionEstimacion } from '@/accounting/precision';
import type { ISODate } from '@/core/dates';
import type { Expense } from '@/state/schema';
import { confirmar, esc, eurColor, onClick, precisionBadge, toast } from '../accounting/dom';

export interface PrecisionPanelDeps {
  precision: PrecisionAnalyzer;
  adjuster: Adjuster;
  estimaciones: () => Expense[];
  onDatosCambiados: () => void;
  /** Fecha de corte del ajuste. Inyectable para que los tests no dependan del día. */
  hoy: () => ISODate;
  /**
   * Intervalo al que limitar la comparación, o `null` para el histórico
   * completo. Lo manda el modo del cierre, que está justo encima: sería
   * desconcertante cerrar un periodo y que la tabla de precisión de debajo
   * hablase de otros meses.
   */
  rango?: () => { desde: ISODate; hasta: ISODate } | null;
}

interface FilaAnalisis {
  analisis: PrecisionEstimacion;
  estimacion: Expense;
  sugerencia: Sugerencia | null;
}

function calcularFilas(deps: PrecisionPanelDeps): FilaAnalisis[] {
  const estimaciones = deps.estimaciones();
  const rango = deps.rango?.() ?? null;
  const porId = new Map(estimaciones.map((e) => [e._id, e]));
  return deps.precision
    .analizarTodas(estimaciones, rango ? { desde: rango.desde, hasta: rango.hasta } : {})
    .map((analisis) => {
      const estimacion = porId.get(analisis.estimacionId) as Expense;
      return { analisis, estimacion, sugerencia: sugerirAjuste(analisis, estimacion.cuantia) };
    })
    .filter((f) => !!f.estimacion);
}

/** Qué meses entran en la comparación, dicho en una frase. */
function alcance(deps: PrecisionPanelDeps): string {
  const rango = deps.rango?.() ?? null;
  if (!rango) return 'Se comparan solo los meses ya cerrados que tengan movimientos reales.';
  return esc(
    `Limitado al periodo de la cabecera (${rango.desde} → ${rango.hasta}): se comparan los meses ya cerrados que caen dentro, ` +
      `recortados al intervalo. El mes en curso nunca entra.`,
  );
}

export function renderPrecisionPanel(deps: PrecisionPanelDeps): string {
  const filas = calcularFilas(deps);
  const conDatos = filas.filter((f) => f.analisis.precision !== null);
  const conSugerencia = filas.filter((f) => f.sugerencia !== null);
  const porTag = deps.precision.analizarPorTag(filas.map((f) => f.analisis));

  if (conDatos.length === 0) {
    return `
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar${deps.rango?.() ? ' en el periodo de la cabecera' : ''}. Registra movimientos
          y asígnalos a una estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada
          previsión, con la opción de ajustarla.
        </div>
      </div>`;
  }

  const filasTag = porTag
    .map(
      (t) => `
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${esc(t.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${t.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${esc(formatEUR(t.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${esc(formatEUR(t.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${eurColor(t.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${precisionBadge(t.precision)}</td>
      </tr>`,
    )
    .join('');

  const th = (texto: string, alineado: 'left' | 'right' = 'left') =>
    `<th style="padding:7px 8px;text-align:${alineado};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${texto}</th>`;

  return `
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${
          conSugerencia.length > 0
            ? `<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${conSugerencia.length})</button>`
            : ''
        }
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${alcance(deps)}
        ${
          conSugerencia.length > 0
            ? `Hay ${conSugerencia.length} estimación(es) que se desvían de forma sistemática. Al ajustar, la
               estimación actual se cierra hoy y se crea su continuación con el importe corregido: el pasado se
               mantiene tal como lo estimaste.`
            : 'Ninguna estimación se desvía lo bastante como para proponer un cambio de importe.'
        }
      </div>
    </div>

    <div class="card mb-14">
      <div class="card-title">Precisión conjunta por etiqueta</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${th('Etiqueta')}${th('Estimaciones', 'right')}${th('Estimado', 'right')}${th('Real', 'right')}${th('Desviación', 'right')}${th('Precisión', 'right')}
          </tr></thead>
          <tbody>${filasTag || `<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

export function wirePrecisionPanel(container: HTMLElement, deps: PrecisionPanelDeps, refrescar: () => void): void {
  onClick(container, '#ajustar-todas', () => {
    const sugerencias = calcularFilas(deps)
      .map((f) => f.sugerencia)
      .filter((s): s is Sugerencia => s !== null);
    if (sugerencias.length === 0) return;
    const listado = sugerencias.map((s) => `• ${s.concepto}: ${formatEUR(s.cuantiaActual)} → ${formatEUR(s.cuantiaSugerida)}`).join('\n');
    if (!confirmar(`Se van a ajustar ${sugerencias.length} estimaciones:\n\n${listado}\n\n¿Continuar?`)) return;
    const { aplicadas, errores } = deps.adjuster.aplicarTodas(sugerencias, { hoy: deps.hoy() });
    toast(
      errores.length > 0 ? `${aplicadas.length} ajustadas, ${errores.length} con error` : `${aplicadas.length} estimaciones ajustadas`,
      errores.length > 0 ? 'warn' : 'ok',
    );
    deps.onDatosCambiados();
    refrescar();
  });
}
