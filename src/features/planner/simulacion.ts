// ── features/planner/simulacion ───────────────────────────────────────────────
// Pestaña 3: gráfico de patrimonio, línea de fases, hitos, avisos y tabla mes a
// mes exportable (§5, pestaña 3).

import { formatEUR } from '@/core/money';
import type { Plan, ResultadoSimulacion } from '@/planner/tipos';
import { esc } from '../accounting/dom';

const eur = (centimos: number): string => formatEUR(centimos / 100);

export function panelSimulacion(plan: Plan, res: ResultadoSimulacion, pagina = 0): string {
  return `
    ${panelAvisos(res)}
    ${resumen(plan, res)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${panelHitos(res)}
    ${panelFases(plan, res)}
    ${tablaMensual(plan, res, pagina)}`;
}

// ── Avisos y propuestas (§3.3) ────────────────────────────────────────────────

function panelAvisos(res: ResultadoSimulacion): string {
  if (res.avisos.length === 0 && res.propuestas.length === 0) return '';

  const color = { error: 'var(--red)', atencion: 'var(--yellow)', info: 'var(--text2)' };
  const avisos = res.avisos
    .map(
      (a) => `<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
        <span style="color:${color[a.severidad]};flex-shrink:0">${a.severidad === 'error' ? '✕' : '⚠'}</span>
        <span style="color:var(--text2)">${esc(a.mensaje)}</span>
      </div>`,
    )
    .join('');

  const propuestas =
    res.propuestas.length > 0
      ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
           <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Cómo hacerlo encajar — elige una:</div>
           ${res.propuestas
             .map(
               (p) => `<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:4px">
             <span style="color:var(--accent);flex-shrink:0">→</span><span style="color:var(--text2)">${esc(p.mensaje)}</span>
           </div>`,
             )
             .join('')}
         </div>`
      : '';

  const borde = res.viable ? 'rgba(255,209,102,0.28)' : 'rgba(255,77,109,0.3)';
  const fondo = res.viable ? 'rgba(255,209,102,0.05)' : 'rgba(255,77,109,0.05)';

  return `<div class="card mb-14" style="background:${fondo};border-color:${borde}">
    <div class="card-title mb-8">${res.viable ? 'Cosas a revisar' : 'El plan no cabe en tu flujo de caja'}</div>
    ${avisos}${propuestas}
  </div>`;
}

// ── Resumen ───────────────────────────────────────────────────────────────────

function resumen(plan: Plan, res: ResultadoSimulacion): string {
  const dato = (label: string, valor: string, sub = '') =>
    `<div class="stat-card">
      <div class="stat-label">${esc(label)}</div>
      <div class="stat-value" style="font-size:18px">${esc(valor)}</div>
      ${sub ? `<div class="stat-sub">${esc(sub)}</div>` : ''}
    </div>`;

  const ultimo = res.serieMensual[res.serieMensual.length - 1];

  return `<div class="grid-4 mb-14">
    ${dato('Patrimonio final', eur(res.resumen.patrimonioFinal), ultimo ? `en ${ultimo.mes}` : '')}
    ${dato('Total aportado', eur(res.resumen.totalAportado), `${res.mesesSimulados} meses simulados`)}
    ${dato('Total a disfrute', eur(res.resumen.totalDisfrute), `${Math.round(plan.pctDisfrute * 100)} % del sobrante`)}
    ${dato(
      'Independencia',
      res.resumen.mesIndependencia ?? '—',
      res.resumen.mesIndependencia ? 'objetivo perpetuo cubierto' : 'sin objetivo de independencia',
    )}
  </div>`;
}

// ── Hitos ─────────────────────────────────────────────────────────────────────

function panelHitos(res: ResultadoSimulacion): string {
  if (res.hitos.length === 0) {
    return `<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
      <div class="text-sm" style="color:var(--text3)">Ningún objetivo se completa dentro del horizonte.</div></div>`;
  }

  return `<div class="card mb-14">
    <div class="card-title mb-12">Hitos</div>
    ${res.hitos
      .map(
        (
          h,
        ) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;align-items:center;gap:9px">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:11px">${esc(h.mes)}</span>
          <span style="font-weight:600">${esc(h.nombre)}</span>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono)">${esc(eur(h.importeFinal))}</div>
          ${h.cuotaLiberada > 0 ? `<div style="font-size:10px;color:var(--text3)">libera ${esc(eur(h.cuotaLiberada))}/mes</div>` : ''}
        </div>
      </div>`,
      )
      .join('')}
  </div>`;
}

// ── Fases ─────────────────────────────────────────────────────────────────────

function panelFases(plan: Plan, res: ResultadoSimulacion): string {
  if (res.fases.length <= 1) return '';
  const nombre = (id: string) => plan.objetivos.find((o) => o._id === id)?.nombre ?? id;

  return `<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${res.fases
      .map(
        (f, i) => `<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${i + 1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${esc(f.desde)} → ${esc(f.hasta)} <span style="color:var(--text3);font-weight:400">(${f.meses} mes${f.meses !== 1 ? 'es' : ''})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${esc(f.objetivosActivos.map(nombre).join(' · ') || 'sin asignaciones')}</div>
        </div>
      </div>`,
      )
      .join('')}
  </div>`;
}

// ── Tabla mes a mes ───────────────────────────────────────────────────────────

/**
 * Filas por página. La serie puede tener 480 meses: pintarlas todas de golpe
 * mete miles de celdas en el DOM y la pestaña se arrastra al desplazarse.
 */
const FILAS_POR_PAGINA = 60;

function tablaMensual(plan: Plan, res: ResultadoSimulacion, pagina = 0): string {
  if (res.serieMensual.length === 0) return '';
  const objetivos = [...plan.objetivos].sort((a, b) => a.prioridad - b.prioridad);
  const paginas = Math.ceil(res.serieMensual.length / FILAS_POR_PAGINA);
  const p = Math.min(Math.max(0, pagina), paginas - 1);
  const filas = res.serieMensual.slice(p * FILAS_POR_PAGINA, (p + 1) * FILAS_POR_PAGINA);

  const cabecera = ['Mes', 'Disponible', ...objetivos.map((o) => o.nombre), 'Sin asignar', 'Patrimonio']
    .map(
      (h) =>
        `<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${esc(h)}</th>`,
    )
    .join('');

  const cuerpo = filas
    .map((f) => {
      const celdas = objetivos
        .map((o) => {
          const a = f.asignaciones.find((x) => x.objetivoId === o._id);
          const v = a?.asignado ?? 0;
          return `<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${v > 0 ? 'var(--text)' : 'var(--text3)'}">${esc(v > 0 ? eur(v) : '·')}</td>`;
        })
        .join('');
      return `<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${esc(f.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${esc(eur(f.disponible))}</td>
        ${celdas}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${esc(f.sinAsignar > 0 ? eur(f.sinAsignar) : '·')}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${esc(eur(f.patrimonioTotal))}</td>
      </tr>`;
    })
    .join('');

  const navegacion =
    paginas > 1
      ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${p - 1}"${p === 0 ? ' disabled' : ''}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${p * FILAS_POR_PAGINA + 1}–${Math.min((p + 1) * FILAS_POR_PAGINA, res.serieMensual.length)} de ${res.serieMensual.length}
           </span>
           <button class="btn-secondary btn-sm" data-pl-pagina="${p + 1}"${p >= paginas - 1 ? ' disabled' : ''}>Siguientes →</button>
         </div>`
      : '';

  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Mes a mes</span>
      <button class="btn-secondary btn-sm" data-pl-csv>Exportar CSV</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr style="border-bottom:1px solid var(--border2)">${cabecera}</tr></thead>
        <tbody>${cuerpo}</tbody>
      </table>
    </div>
    ${navegacion}
  </div>`;
}

/** Serie mensual completa en CSV. Separador `;` y coma decimal, para Excel en español. */
export function serieACsv(plan: Plan, res: ResultadoSimulacion): string {
  const objetivos = [...plan.objetivos].sort((a, b) => a.prioridad - b.prioridad);
  const num = (c: number) => (c / 100).toFixed(2).replace('.', ',');

  const cabecera = [
    'Mes',
    'Neto',
    'Gastos fijos',
    'Disfrute',
    'Disponible',
    ...objetivos.map((o) => o.nombre),
    'Sin asignar',
    'Patrimonio',
  ];
  const filas = res.serieMensual.map((f) =>
    [
      f.mes,
      num(f.netoMensual),
      num(f.gastosFijos),
      num(f.disfrute),
      num(f.disponible),
      ...objetivos.map((o) => num(f.asignaciones.find((a) => a.objetivoId === o._id)?.asignado ?? 0)),
      num(f.sinAsignar),
      num(f.patrimonioTotal),
    ].join(';'),
  );
  return [cabecera.join(';'), ...filas].join('\n');
}
