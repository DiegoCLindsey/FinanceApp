// ── features/planner/eventos-ui ───────────────────────────────────────────────
// Pestaña 4: línea temporal de eventos con plantillas para los casos frecuentes
// (§5, pestaña 4 del documento de diseño).

import { formatEUR } from '@/core/money';
import { PLANTILLAS, describirEvento, type PlantillaEvento } from '@/planner/eventos';
import { diferenciaMeses } from '@/planner/simulador';
import type { Evento, Plan } from '@/planner/tipos';
import { esc } from '../accounting/dom';

const eur = (centimos: number): string => formatEUR(centimos / 100);

const ICONO_TIPO: Record<Evento['tipo'], string> = {
  INYECCION_CAPITAL: '💰',
  CAMBIO_GASTOS_FIJOS: '🏷️',
  CAMBIO_INGRESOS: '📈',
  NUEVA_DEUDA: '🔑',
};

export function panelEventos(plan: Plan): string {
  const ordenados = [...plan.eventos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const nombreObjetivo = (id: string | null | undefined) => (id ? plan.objetivos.find((o) => o._id === id)?.nombre : undefined);

  return `
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${PLANTILLAS.map(
          (p) => `<button class="btn-secondary btn-sm" data-pl-plantilla="${esc(p.id)}"
            style="display:flex;align-items:center;gap:6px;padding:7px 12px">
            <span style="font-size:14px">${p.icono}</span>
            <span style="font-size:12px">${esc(p.nombre)}</span>
          </button>`,
        ).join('')}
      </div>
    </div>

    ${
      ordenados.length === 0
        ? `<div class="card" style="text-align:center;padding:30px 20px">
             <div style="font-size:24px;margin-bottom:8px">📅</div>
             <div class="text-sm" style="color:var(--text2);max-width:50ch;margin:0 auto;line-height:1.7">
               Todavía no hay eventos. Sin ellos el plan asume que tus ingresos y tus gastos se quedan como están
               durante todo el horizonte, cosa que no pasa nunca.
             </div>
           </div>`
        : `<div class="card">
             <div class="card-title mb-12">Línea temporal (${ordenados.length})</div>
             ${ordenados.map((ev) => fila(ev, plan, nombreObjetivo(ev.objetivoDestinoId))).join('')}
           </div>`
    }`;
}

function fila(ev: Evento, plan: Plan, destino: string | undefined): string {
  const desplazamiento = diferenciaMeses(plan.fechaInicio, ev.fecha);
  const cuando =
    desplazamiento < 0
      ? 'antes del inicio del plan'
      : desplazamiento === 0
        ? 'en el primer mes'
        : `dentro de ${desplazamiento} mes${desplazamiento !== 1 ? 'es' : ''}`;
  const fuera = desplazamiento < 0 || desplazamiento >= plan.horizonteMeses;

  return `
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${ICONO_TIPO[ev.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${esc(ev.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${esc(cuando)}</span>
          ${fuera ? '<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>' : ''}
        </div>
        <div style="font-size:12px;margin-top:3px">${esc(describirEvento(ev, destino))}</div>
        ${ev.notas ? `<div style="font-size:11px;color:var(--text3);margin-top:2px">${esc(ev.notas)}</div>` : ''}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${esc(ev._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`;
}

// ── Formulario ────────────────────────────────────────────────────────────────

export function formularioEvento(
  plantilla: PlantillaEvento,
  ev: Evento | null,
  plan: Plan,
  valoresPorDefecto: Record<string, number>,
): string {
  const campos = plantilla.campos
    .map((c) => {
      const v = valoresPorDefecto[c.id];
      return `<div class="form-group">
        <label class="form-label" for="ev-${esc(c.id)}">${esc(c.etiqueta)}</label>
        <input class="form-input" type="number" step="0.01" id="ev-${esc(c.id)}" value="${v !== undefined ? (v / 100).toFixed(2) : ''}">
        ${c.ayuda ? `<div class="text-sm mt-4" style="color:var(--text3)">${esc(c.ayuda)}</div>` : ''}
      </div>`;
    })
    .join('');

  const objetivos: [string, string][] = [
    ['', '— al reparto general —'],
    ...plan.objetivos.map((o) => [o._id, o.nombre] as [string, string]),
  ];

  return `
    <div class="text-sm mb-14" style="color:var(--text2);line-height:1.7">${plantilla.icono} ${esc(plantilla.descripcion)}</div>

    <div class="form-group">
      <label class="form-label" for="ev-fecha">Mes en que ocurre</label>
      <input class="form-input" type="month" id="ev-fecha" value="${esc(ev?.fecha ?? plan.fechaInicio)}">
    </div>

    ${campos}

    <div class="card mb-12" style="background:var(--bg3);padding:10px 12px">
      <div class="text-sm" style="color:var(--text3)">Importe que se aplicará</div>
      <div id="ev-resultado" style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--accent);margin-top:2px">—</div>
    </div>

    ${
      plantilla.tipo === 'INYECCION_CAPITAL'
        ? `<div class="form-group">
             <label class="form-label" for="ev-destino">¿A qué objetivo va?</label>
             <select class="form-input" id="ev-destino">
               ${objetivos.map(([v, t]) => `<option value="${esc(v)}"${v === (ev?.objetivoDestinoId ?? '') ? ' selected' : ''}>${esc(t)}</option>`).join('')}
             </select>
             <div class="text-sm mt-4" style="color:var(--text3)">
               Dirigida a un objetivo lo completa antes y libera su cuota; al reparto general entra como ingreso extra de ese mes.
             </div>
           </div>`
        : ''
    }

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${ev ? '<button class="btn-secondary" data-ev-borrar style="color:var(--red)">Borrar</button>' : ''}
      <button class="btn-secondary" data-ev-cancelar>Cancelar</button>
      <button class="btn-primary" data-ev-guardar>${ev ? 'Guardar' : 'Añadir evento'}</button>
    </div>`;
}

/** Valores de los campos de la plantilla, en céntimos. */
export function leerCampos(raiz: HTMLElement, plantilla: PlantillaEvento): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of plantilla.campos) {
    const v = (raiz.querySelector(`#ev-${c.id}`) as HTMLInputElement | null)?.value ?? '';
    const n = parseFloat(String(v).replace(',', '.'));
    out[c.id] = Number.isFinite(n) ? Math.round(n * 100) : 0;
  }
  return out;
}

export const previsualizar = (plantilla: PlantillaEvento, valores: Record<string, number>): string => eur(plantilla.calcular(valores));
