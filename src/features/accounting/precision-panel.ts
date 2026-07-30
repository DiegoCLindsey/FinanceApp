// ── features/accounting/precision-panel ───────────────────────────────────────
// Precisión de las estimaciones frente al gasto real, por estimación y agregada
// por etiqueta, con "Sugerir ajuste" por fila y "Ajustar todas" (F4, 4.3/4.5-4.7).

import { formatEUR } from '@/core/money';
import type { Adjuster, Sugerencia } from '@/accounting/adjust';
import { sugerirAjuste } from '@/accounting/adjust';
import type { PrecisionAnalyzer, PrecisionEstimacion } from '@/accounting/precision';
import type { Expense } from '@/state/schema';
import { confirmar, esc, eurColor, nombreMes, onClick, precisionBadge, precisionBadge as badge, tagChips, toast } from './dom';

export interface PrecisionPanelDeps {
  precision: PrecisionAnalyzer;
  adjuster: Adjuster;
  estimaciones: () => Expense[];
  onDatosCambiados: () => void;
}

interface FilaAnalisis {
  analisis: PrecisionEstimacion;
  estimacion: Expense;
  sugerencia: Sugerencia | null;
}

function calcularFilas(deps: PrecisionPanelDeps): FilaAnalisis[] {
  const estimaciones = deps.estimaciones();
  const porId = new Map(estimaciones.map((e) => [e._id, e]));
  return deps.precision
    .analizarTodas(estimaciones)
    .map((analisis) => {
      const estimacion = porId.get(analisis.estimacionId) as Expense;
      return { analisis, estimacion, sugerencia: sugerirAjuste(analisis, estimacion.cuantia) };
    })
    .filter((f) => !!f.estimacion);
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
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;
  }

  const filasHtml = conDatos
    .map(({ analisis, estimacion, sugerencia }) => {
      const detalleMeses = analisis.meses
        .slice(-6)
        .map((m) => `${nombreMes(m.mes)}: ${formatEUR(m.estimado)} → ${formatEUR(m.real)} (${m.precision.toFixed(0)}%)`)
        .join(' · ');
      return `
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${esc(estimacion.concepto)}</div>
          <div style="margin-top:3px">${tagChips(analisis.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${esc(detalleMeses)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${esc(formatEUR(analisis.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${esc(formatEUR(analisis.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${eurColor(analisis.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${badge(analisis.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${
            sugerencia
              ? `<button class="btn-secondary" data-sugerir="${esc(analisis.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${esc(sugerencia.motivo)}">Sugerir ajuste → ${esc(formatEUR(sugerencia.cuantiaSugerida))}</button>`
              : '<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'
          }
        </td>
      </tr>`;
    })
    .join('');

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
        <span class="card-title" style="margin:0">Precisión de las estimaciones</span>
        ${
          conSugerencia.length > 0
            ? `<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${conSugerencia.length})</button>`
            : ''
        }
      </div>
      <div class="text-sm mb-10" style="color:var(--text2);line-height:1.6">
        Se comparan solo los meses ya cerrados que tengan movimientos reales. Al ajustar, la
        estimación actual se cierra hoy y se crea su continuación con el importe corregido:
        el pasado se mantiene tal como lo estimaste.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${th('Estimación')}${th('Estimado', 'right')}${th('Real', 'right')}${th('Desviación', 'right')}${th('Precisión', 'right')}${th('', 'right')}
          </tr></thead>
          <tbody>${filasHtml}</tbody>
        </table>
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
  onClick(container, '[data-sugerir]', (el) => {
    const id = el.dataset.sugerir as string;
    const fila = calcularFilas(deps).find((f) => f.analisis.estimacionId === id);
    if (!fila?.sugerencia) return;
    const s = fila.sugerencia;
    const mensaje =
      `${s.concepto}\n\n${s.motivo} (precisión ${s.precision.toFixed(1)}%).\n\n` +
      `Estimación actual: ${formatEUR(s.cuantiaActual)}\n` +
      `Nueva estimación: ${formatEUR(s.cuantiaSugerida)}\n\n` +
      `La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;
    if (!confirmar(mensaje)) return;
    deps.adjuster.aplicar(id, s.cuantiaSugerida);
    toast(`Estimación ajustada a ${formatEUR(s.cuantiaSugerida)}`);
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(container, '#ajustar-todas', () => {
    const sugerencias = calcularFilas(deps)
      .map((f) => f.sugerencia)
      .filter((s): s is Sugerencia => s !== null);
    if (sugerencias.length === 0) return;
    const listado = sugerencias.map((s) => `• ${s.concepto}: ${formatEUR(s.cuantiaActual)} → ${formatEUR(s.cuantiaSugerida)}`).join('\n');
    if (!confirmar(`Se van a ajustar ${sugerencias.length} estimaciones:\n\n${listado}\n\n¿Continuar?`)) return;
    const { aplicadas, errores } = deps.adjuster.aplicarTodas(sugerencias);
    toast(
      errores.length > 0 ? `${aplicadas.length} ajustadas, ${errores.length} con error` : `${aplicadas.length} estimaciones ajustadas`,
      errores.length > 0 ? 'warn' : 'ok',
    );
    deps.onDatosCambiados();
    refrescar();
  });
}
