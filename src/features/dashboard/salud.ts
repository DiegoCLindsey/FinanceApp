// ── features/dashboard/salud ──────────────────────────────────────────────────
// Panel de salud financiera del dashboard: capacidad de ahorro, endeudamiento
// (DTI) y reparto según la regla 50/30/20, más el formulario de umbrales.
//
// La aritmética sale entera de `core/health.ts`; aquí solo hay presentación.
// En el legacy esto vivía dentro de `dashboard/dashboard.js` con los umbrales
// interpolados a mano y los botones con `onclick=` global.

import { formatEUR } from '@/core/money';
import type { Semaforo, SaludFinanciera } from '@/core/health';
import { esc } from '../accounting/dom';

/** Color de cada estado del semáforo. */
const COLOR: Record<Semaforo, string> = {
  verde: '#00e5a0',
  amarillo: '#ffd166',
  rojo: '#ff4d6d',
  neutral: 'var(--text3)',
};

const punto = (sem: Semaforo) =>
  `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${COLOR[sem]};flex-shrink:0"></span>`;

/** Porcentaje con un decimal; un guion si no hay dato. */
export const pct = (v: number | null | undefined): string => (v !== null && v !== undefined ? `${v.toFixed(1)}%` : '—');

const tarjeta = (cuerpo: string) =>
  `<div style="background:var(--bg3);border-radius:var(--radius);padding:14px;border:1px solid var(--border)">${cuerpo}</div>`;

/** Los tres indicadores de salud. Sin ingresos proyectados no hay nada que medir. */
export function panelSalud(s: SaludFinanciera | null): string {
  if (!s || s.ingresos < 0.01) {
    return '<div class="text-sm" style="text-align:center;padding:20px;color:var(--text3)">Sin ingresos proyectados en el período seleccionado.</div>';
  }

  const cuotasDTI = s.excluyeHipoteca ? s.cuotas - s.cuotasHipoteca : s.cuotas;

  const ahorro = tarjeta(`
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
      ${punto(s.semAhorro)}<span style="font-size:12px;font-weight:600;color:var(--text2)">Capacidad de ahorro</span>
    </div>
    <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:${COLOR[s.semAhorro]};line-height:1">${esc(pct(s.tasaAhorro))}</div>
    <div style="font-size:11px;color:var(--text3);margin-top:3px">${esc(formatEUR(s.ahorroReal))}/mes</div>
    <div style="margin-top:8px;font-size:10px;color:var(--text3)">🟢 ≥${esc(s.umbralAhorroVerde)}% &nbsp;🟡 ≥${esc(s.umbralAhorroAmarillo)}% &nbsp;🔴 debajo</div>`);

  const dti = tarjeta(`
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
      ${punto(s.semDTI)}<span style="font-size:12px;font-weight:600;color:var(--text2)">Endeudamiento (DTI)</span>
    </div>
    <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:${COLOR[s.semDTI]};line-height:1">${esc(pct(s.dti))}</div>
    <div style="font-size:11px;color:var(--text3);margin-top:3px">Cuotas: ${esc(formatEUR(cuotasDTI))}/mes</div>
    ${
      s.excluyeHipoteca && s.cuotasHipoteca > 0.01
        ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--text3)">
             DTI total (con hipoteca): ${esc(pct(s.dtiTotal))}<br>Hipoteca: ${esc(formatEUR(s.cuotasHipoteca))}/mes
           </div>`
        : ''
    }
    <div style="margin-top:8px;font-size:10px;color:var(--text3)">🟢 &lt;${esc(s.umbralDTIVerde)}% &nbsp;🟡 &lt;${esc(s.umbralDTIAmarillo)}% &nbsp;🔴 encima</div>`);

  const filas: { label: string; val: number | null; sem: Semaforo; obj: string }[] = [
    { label: 'Necesidades', val: s.pctNecesidades, sem: s.semNecesidades, obj: `≤${s.regla[0]}%` },
    { label: 'Deseos', val: s.pctDeseos, sem: s.semDeseos, obj: `≤${s.regla[1]}%` },
    { label: 'Ahorro', val: s.tasaAhorro, sem: s.semAhorroRegla, obj: `≥${s.regla[2]}%` },
  ];

  const reparto = tarjeta(`
    <div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:10px">Distribución (regla ${esc(s.regla.join('/'))})</div>
    ${filas
      .map(
        (r) => `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px">
        <span style="display:flex;align-items:center;gap:5px;font-size:12px;color:var(--text2)">${punto(r.sem)} ${esc(r.label)}</span>
        <span style="font-family:var(--font-mono);font-size:12px">
          <span style="color:${COLOR[r.sem]}">${esc(pct(r.val))}</span>
          <span style="color:var(--text3);font-size:10px;margin-left:3px">${esc(r.obj)}</span>
        </span>
      </div>`,
      )
      .join('')}
    <div style="font-size:10px;color:var(--text3);margin-top:4px">Ajustable en ⚙ Umbrales</div>`);

  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px">${ahorro}${dti}${reparto}</div>`;
}

// ── Configuración de umbrales ─────────────────────────────────────────────────

export interface UmbralesSalud {
  saludUmbralAhorroVerde: number;
  saludUmbralAhorroAmarillo: number;
  saludUmbralDTIVerde: number;
  saludUmbralDTIAmarillo: number;
  saludRegla: number[];
  saludExcluirHipoteca: boolean;
  saludTagHipoteca: string;
}

/** Valores recomendados; los repone el botón "Restaurar". */
export const UMBRALES_RECOMENDADOS: UmbralesSalud = {
  saludUmbralAhorroVerde: 20,
  saludUmbralAhorroAmarillo: 10,
  saludUmbralDTIVerde: 30,
  saludUmbralDTIAmarillo: 40,
  saludRegla: [50, 30, 20],
  saludExcluirHipoteca: false,
  saludTagHipoteca: 'hipoteca',
};

const numerito = (id: string, valor: number, ancho = 60) =>
  `<input type="number" class="form-input" id="${id}" value="${esc(valor)}" min="0" max="100" style="width:${ancho}px;font-size:12px;padding:3px 6px">`;

export function formularioUmbrales(cfg: Partial<UmbralesSalud>): string {
  const r = cfg.saludRegla ?? UMBRALES_RECOMENDADOS.saludRegla;
  const bloque = (titulo: string, cuerpo: string) =>
    `<div><div style="font-size:11px;color:var(--text3);margin-bottom:6px">${titulo}</div>${cuerpo}</div>`;

  return `
    <div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:12px">Configurar umbrales</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
      ${bloque(
        'Tasa de ahorro',
        `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:11px;color:var(--text2)">🟢 ≥</span>
          ${numerito('salud-ahorro-verde', cfg.saludUmbralAhorroVerde ?? 20)}
          <span style="font-size:11px;color:var(--text2)">% &nbsp;🔴 &lt;</span>
          ${numerito('salud-ahorro-rojo', cfg.saludUmbralAhorroAmarillo ?? 10)}
          <span style="font-size:11px;color:var(--text2)">%</span>
        </div>`,
      )}
      ${bloque(
        'Endeudamiento (DTI)',
        `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:11px;color:var(--text2)">🟢 &lt;</span>
          ${numerito('salud-dti-verde', cfg.saludUmbralDTIVerde ?? 30)}
          <span style="font-size:11px;color:var(--text2)">% &nbsp;🔴 ≥</span>
          ${numerito('salud-dti-rojo', cfg.saludUmbralDTIAmarillo ?? 40)}
          <span style="font-size:11px;color:var(--text2)">%</span>
        </div>`,
      )}
      ${bloque(
        'Regla de distribución <span style="color:var(--text3)">(Nec./Deseos/Ahorro — recomendado: 50/30/20)</span>',
        `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          ${numerito('salud-regla-0', r[0], 55)}<span style="color:var(--text3)">/</span>
          ${numerito('salud-regla-1', r[1], 55)}<span style="color:var(--text3)">/</span>
          ${numerito('salud-regla-2', r[2], 55)}
        </div>`,
      )}
      ${bloque(
        'Hipoteca en el DTI',
        `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <label class="toggle"><input type="checkbox" id="salud-excl-hipoteca"${cfg.saludExcluirHipoteca ? ' checked' : ''}><span class="toggle-slider"></span></label>
          <span style="font-size:12px;color:var(--text2)">Excluir hipoteca del DTI principal</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:11px;color:var(--text3)">Tag hipoteca:</span>
          <input type="text" class="form-input" id="salud-tag-hipoteca" value="${esc(cfg.saludTagHipoteca || 'hipoteca')}" style="width:100px;font-size:12px;padding:3px 6px">
        </div>`,
      )}
    </div>
    <div style="display:flex;gap:8px;margin-top:14px;align-items:center">
      <button class="btn-primary btn-sm" data-salud-guardar>Guardar</button>
      <button class="btn-secondary btn-sm" data-salud-reset>Restaurar recomendados (50/30/20)</button>
    </div>`;
}

/**
 * Lee el formulario. Los umbrales se sanean aquí y no al pintarlos: un valor
 * fuera de [0, 100] o sin número deja el semáforo en un estado imposible de
 * interpretar, y el legacy los guardaba tal cual venían del input.
 */
export function leerUmbrales(raiz: HTMLElement): UmbralesSalud {
  const num = (id: string, porDefecto: number): number => {
    const v = parseFloat((raiz.querySelector(`#${id}`) as HTMLInputElement | null)?.value ?? '');
    if (!Number.isFinite(v)) return porDefecto;
    return Math.min(100, Math.max(0, v));
  };
  const tag = (raiz.querySelector('#salud-tag-hipoteca') as HTMLInputElement | null)?.value.trim();

  return {
    saludUmbralAhorroVerde: num('salud-ahorro-verde', 20),
    saludUmbralAhorroAmarillo: num('salud-ahorro-rojo', 10),
    saludUmbralDTIVerde: num('salud-dti-verde', 30),
    saludUmbralDTIAmarillo: num('salud-dti-rojo', 40),
    saludRegla: [num('salud-regla-0', 50), num('salud-regla-1', 30), num('salud-regla-2', 20)],
    saludExcluirHipoteca: !!(raiz.querySelector('#salud-excl-hipoteca') as HTMLInputElement | null)?.checked,
    saludTagHipoteca: tag || 'hipoteca',
  };
}
