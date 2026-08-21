// ── features/planner/escenarios-ui ────────────────────────────────────────────
// Pestaña 5: comparativa entre planes y análisis de sensibilidad (§5 pestaña 5
// y §4 del documento de diseño).

import { formatEUR } from '@/core/money';
import { compararHitos } from '@/planner/eventos';
import { describirDesplazamiento, type EjeSensibilidad } from '@/planner/sensibilidad';
import { simular } from '@/planner/simulador';
import type { Plan } from '@/planner/tipos';
import { esc } from '../accounting/dom';

const eur = (centimos: number): string => formatEUR(centimos / 100);

export function panelEscenarios(planes: Plan[], activoId: string, sensibilidad: EjeSensibilidad[] | null): string {
  return `
    ${listaPlanes(planes, activoId)}
    ${planes.length > 1 ? comparativa(planes) : ''}
    ${panelSensibilidad(sensibilidad)}`;
}

// ── Planes ────────────────────────────────────────────────────────────────────

function listaPlanes(planes: Plan[], activoId: string): string {
  return `<div class="card mb-14">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Planes (${planes.length})</span>
      <div class="flex gap-8 flex-wrap">
        <button class="btn-secondary btn-sm" data-pl-duplicar>Duplicar el activo</button>
        <button class="btn-secondary btn-sm" data-pl-exportar>Exportar JSON</button>
        <button class="btn-secondary btn-sm" data-pl-importar>Importar JSON</button>
      </div>
    </div>

    ${planes
      .map((p) => {
        const esActivo = p._id === activoId;
        return `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);flex-wrap:wrap">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-weight:600;font-size:13px">${esc(p.nombre)}</span>
            ${esActivo ? '<span class="badge badge-green" style="font-size:10px">activo</span>' : ''}
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">
            ${p.objetivos.length} objetivo${p.objetivos.length !== 1 ? 's' : ''} ·
            ${p.eventos.length} evento${p.eventos.length !== 1 ? 's' : ''} ·
            desde ${esc(p.fechaInicio)}${p.creadoEn ? ` · creado ${esc(p.creadoEn)}` : ''}
          </div>
        </div>
        <div class="flex gap-5 flex-wrap">
          ${esActivo ? '' : `<button class="btn-secondary btn-sm" data-pl-activar="${esc(p._id)}" style="font-size:11px;padding:2px 9px">Usar este</button>`}
          <button class="btn-secondary btn-sm" data-pl-renombrar="${esc(p._id)}" style="font-size:11px;padding:2px 9px">Renombrar</button>
          ${planes.length > 1 ? `<button class="btn-secondary btn-sm" data-pl-borrar-plan="${esc(p._id)}" style="font-size:11px;padding:2px 9px;color:var(--red)">Borrar</button>` : ''}
        </div>
      </div>`;
      })
      .join('')}
  </div>`;
}

// ── Comparativa A/B ───────────────────────────────────────────────────────────

function comparativa(planes: Plan[]): string {
  // Con muchos planes la tabla deja de leerse; se comparan los tres primeros,
  // que es lo que el documento pide (A/B/C).
  const comparados = planes.slice(0, 3);
  const resultados = comparados.map((p) => ({ plan: p, res: simular(p) }));
  const filas = compararHitos(resultados.map(({ plan, res }) => ({ nombre: plan.nombre, hitos: res.hitos })));

  const cabecera = ['Hito', ...comparados.map((p) => p.nombre)]
    .map((h, i) => `<th style="text-align:${i === 0 ? 'left' : 'right'};padding:6px 8px;font-size:11px;color:var(--text3)">${esc(h)}</th>`)
    .join('');

  const cuerpo = filas
    .map(
      (f) => `<tr>
      <td style="padding:5px 8px;font-size:12px">${esc(f.nombre)}</td>
      ${f.meses
        .map((mes, i) => {
          const dif = f.diferencias[i];
          const color = dif === null || dif === 0 ? 'var(--text2)' : dif < 0 ? 'var(--accent)' : 'var(--red)';
          const nota =
            i === 0 || dif === null || dif === 0 ? '' : `<div style="font-size:10px;color:${color}">${dif > 0 ? '+' : ''}${dif} m</div>`;
          return `<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${color}">
            ${esc(mes ?? 'no llega')}${nota}
          </td>`;
        })
        .join('')}
    </tr>`,
    )
    .join('');

  const resumenFinal = resultados
    .map(
      ({ plan, res }) => `<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${esc(plan.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${esc(eur(res.resumen.patrimonioFinal))}</div>
      <div style="font-size:10px;color:${res.viable ? 'var(--accent)' : 'var(--red)'}">${res.viable ? 'viable' : 'no cabe en el flujo'}</div>
    </div>`,
    )
    .join('');

  return `<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${resumenFinal}</div>
    ${
      filas.length === 0
        ? '<div class="text-sm" style="color:var(--text3)">Ninguno de los planes completa objetivos dentro de su horizonte.</div>'
        : `<div style="overflow-x:auto">
             <table style="width:100%;border-collapse:collapse">
               <thead><tr style="border-bottom:1px solid var(--border2)">${cabecera}</tr></thead>
               <tbody>${cuerpo}</tbody>
             </table>
           </div>
           <div class="text-sm mt-8" style="color:var(--text3)">
             Los hitos se emparejan por nombre. La diferencia es respecto al primer plan de la tabla.
           </div>`
    }
  </div>`;
}

// ── Sensibilidad ──────────────────────────────────────────────────────────────

function panelSensibilidad(ejes: EjeSensibilidad[] | null): string {
  if (!ejes) {
    return `<div class="card">
      <div class="card-title mb-8">Análisis de sensibilidad</div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.7">
        Vuelve a simular moviendo una palanca cada vez y te dice cuánto adelanta o retrasa el plan.
        Son diez simulaciones, así que se calcula solo cuando lo pides.
      </div>
      <button class="btn-primary" data-pl-sensibilidad>Calcular</button>
    </div>`;
  }

  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${ejes.map(eje).join('')}
    <div class="text-sm mt-8" style="color:var(--text3);line-height:1.6">
      El desplazamiento es sobre el <strong>último hito</strong> del plan: cuándo terminarías de cumplirlo todo.
    </div>
  </div>`;
}

function eje(e: EjeSensibilidad): string {
  return `<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${esc(e.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${esc(e.descripcion)}</div>
    ${e.variantes
      .map((v) => {
        const d = v.desplazamientoMeses;
        const color = d === null ? 'var(--text3)' : d === 0 ? 'var(--text2)' : d < 0 ? 'var(--accent)' : 'var(--red)';
        return `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${v.esBase ? 'border-top:1px solid var(--border);border-bottom:1px solid var(--border);' : ''}">
        <span style="${v.esBase ? 'font-weight:700' : 'color:var(--text2)'}">${esc(v.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${color};font-size:11px">${esc(describirDesplazamiento(d))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${esc(eur(v.patrimonioFinal))}</span>
        </span>
      </div>`;
      })
      .join('')}
  </div>`;
}
