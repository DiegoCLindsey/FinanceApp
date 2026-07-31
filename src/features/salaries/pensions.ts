// ── features/salaries/pensions ────────────────────────────────────────────────
// Planes de pensiones: tarjetas de resumen y formulario.
//
// Viven en la colección `accounts` (con `modeloFondo: 'pension'`), pero se
// gestionan desde esta vista porque su fiscalidad es la del trabajo: el rescate
// tributa por los tramos generales del IRPF, y asociar el plan a un grupo de
// nóminas le da el tipo marginal real de ese grupo.
//
// Al portar la vista de cuentas conviene revisar si esta sección debería
// mudarse allí (docs/02-plan-refactor.md, tarea 1.7).

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import { calcFondosPension, calcTipoMarginalPension } from '@/core/tax/pension';
import type { Tramos } from '@/core/tax/irpf';
import type { Account, Escenario, Nomina, PuntoSaldoLike } from './tipos';
import { confirmar, esc, onChange, onClick, toast } from '../accounting/dom';
import { checkboxesEscenarios } from '../loans/forms';

/** Aportación programada en edición. */
export interface AportacionPlan {
  _id: string;
  importe: number;
  periodicidad: string;
  fechaInicio: ISODate;
  fechaFin?: string;
}

/** Límite anual de aportación con derecho a reducción en la base del IRPF. */
const LIMITE_APORTACION_ANUAL = 1500;

const campo = (id: string, label: string, tipo: string, valor: string | number, placeholder = '') =>
  `<div class="form-group"><label class="form-label">${esc(label)}</label>
   <input class="form-input" type="${tipo}" id="${id}" value="${esc(valor)}" placeholder="${esc(placeholder)}"/></div>`;

const selector = (id: string, label: string, opciones: [string, string][], sel: string) =>
  `<div class="form-group"><label class="form-label">${esc(label)}</label>
   <select class="form-select" id="${id}">
     ${opciones.map(([v, l]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`).join('')}
   </select></div>`;

// `esFondoPension` era el flag legacy; la migración v5 lo sustituyó por
// `modeloFondo`, y el código legacy que queda ya lee este primero.
export const esPlanPension = (a: Account): boolean => (a.modeloFondo || 'cuenta') === 'pension';

// ── Tarjetas ──────────────────────────────────────────────────────────────────

export function renderPensionesSection(planes: Account[], nominasActivas: Nomina[], tramos: Tramos, hoy: ISODate): string {
  if (planes.length === 0) {
    return `<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`;
  }
  return `<div class="grid-3">${planes.map((p) => tarjetaPension(p, nominasActivas, tramos, hoy)).join('')}</div>`;
}

function tarjetaPension(p: Account, nominasActivas: Nomina[], tramos: Tramos, hoy: ISODate): string {
  const pension = calcFondosPension(p);
  if (!pension) return '';
  const tipo = calcTipoMarginalPension(p, nominasActivas, tramos);
  const año = hoy.slice(0, 4);
  const aportadoEsteAño = (p.aportaciones || []).filter((a) => a.fecha >= `${año}-01-01`).reduce((s, a) => s + a.cantidad, 0);
  // Solo lo aportado hasta el límite genera derecho a reducción
  const ahorroFiscal = Math.min(aportadoEsteAño, LIMITE_APORTACION_ANUAL) * (tipo / 100);

  return `<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${esc(p.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${p.grupoNomina ? `<span class="badge badge-blue">Grupo: ${esc(p.grupoNomina)}</span>` : ''}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${esc(p._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${esc(p._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${esc(formatEUR(pension.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${esc(formatEUR(pension.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${pension.beneficio >= 0 ? 'pos' : 'neg'}">${esc(formatEUR(pension.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${esc(formatEUR(pension.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${esc(formatEUR(pension.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${esc(año)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${aportadoEsteAño > LIMITE_APORTACION_ANUAL ? 'neg' : ''}">${esc(formatEUR(aportadoEsteAño))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${esc(formatEUR(ahorroFiscal))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${
      p.grupoNomina ? `Tipo marginal grupo "${esc(p.grupoNomina)}": ${tipo}%` : `Tipo fijo configurado: ${p.impuestoRetirada || 0}%`
    }</div>
    ${pension.proxDesbloqueo ? `<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${esc(pension.proxDesbloqueo)}</div>` : ''}
  </div>`;
}

// ── Formulario ────────────────────────────────────────────────────────────────

function aportacionesHtml(plan: AportacionPlan[]): string {
  const filas = plan
    .map(
      (p, i) => `<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${esc(p.fechaInicio || '—')}</span>
        <span style="flex:1;font-size:12px">${esc(formatEUR(p.importe))} / ${esc(p.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${esc(p.fechaFin || 'indefinido')}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${i}">✕</button>
      </div>`,
    )
    .join('');

  return `<div>${filas || '<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="paport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="paport-periodo" style="font-size:12px">
        ${[
          ['mensual', 'Mensual'],
          ['trimestral', 'Trimestral'],
          ['semestral', 'Semestral'],
          ['anual', 'Anual'],
        ]
          .map(([v, l]) => `<option value="${v}">${l}</option>`)
          .join('')}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="paport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="paport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`;
}

export interface FormularioPensionDeps {
  nominas: Nomina[];
  escenarios: Escenario[];
  hoy: ISODate;
}

export function formularioPension(acc: Account | null, deps: FormularioPensionDeps): string {
  const historico = [...((acc?.historicoSaldos as PuntoSaldoLike[]) ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const saldoActual = historico[0] ? historico[0].saldo : (acc?.saldo ?? 0);
  const grupos = [...new Set(deps.nominas.filter((n) => n.grupoNomina).map((n) => n.grupoNomina as string))];
  const usaGrupo = !!acc?.grupoNomina;

  return `
    <div class="grid-2">
      ${campo('pen-nombre', 'Nombre del plan', 'text', acc?.nombre ?? '', 'Ej: Plan de Pensiones ING')}
      ${campo('pen-saldo', 'Saldo actual (€)', 'number', saldoActual, '5000')}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${campo('pen-saldo-ini', 'Saldo inicial (€)', 'number', acc?.saldoInicial ?? 0, '0')}
      ${campo('pen-fecha-ini', 'Fecha saldo inicial', 'date', acc?.fechaInicialSaldo ?? deps.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${campo('pen-interes', 'Rentabilidad anual (%)', 'number', acc?.interes ?? 0, '4')}
      ${selector(
        'pen-periodo',
        'Capitalización',
        [
          ['diario', 'Diario'],
          ['mensual', 'Mensual'],
          ['anual', 'Anual'],
        ],
        acc?.periodoCobro ?? 'mensual',
      )}
    </div>
    <div class="grid-2 mt-8">
      ${campo('pen-bloqueo', 'Bloqueo (meses)', 'number', acc?.bloqueoMeses ?? 120, '120')}
      <div id="pen-impuesto-wrap"${usaGrupo ? ' style="display:none"' : ''}>
        ${campo('pen-impuesto', '% impuesto retirada (fijo)', 'number', acc?.impuestoRetirada ?? 0, '24')}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${grupos.map((g) => `<option value="${esc(g)}"${acc?.grupoNomina === g ? ' selected' : ''}>${esc(g)}</option>`).join('')}
      </select>
      ${grupos.length === 0 ? '<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>' : ''}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${esc(acc?.descripcion ?? '')}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${acc?.activo !== false ? ' checked' : ''}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${acc?.simulacion ? ' checked' : ''}/><span class="toggle-slider"></span></label>
    </div>
    ${checkboxesEscenarios(deps.escenarios, acc?.escenarioIds ?? [], 'pen-escenario')}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${esc(acc?._id ?? '')}">Guardar</button>
    </div>`;
}

/** Cablea el editor de aportaciones y el campo condicional del tipo fijo. */
export function wireFormularioPension(el: HTMLElement, plan: AportacionPlan[], hoy: ISODate): void {
  const pintar = () => {
    const cont = el.querySelector('#pen-aport-container');
    if (cont) cont.innerHTML = aportacionesHtml(plan);
  };
  onChange(el, '#pen-grupo', (sel) => {
    // Con grupo, el tipo sale del marginal del grupo: el fijo deja de aplicar
    const wrap = el.querySelector<HTMLElement>('#pen-impuesto-wrap');
    if (wrap) wrap.style.display = (sel as HTMLSelectElement).value ? 'none' : '';
  });
  onClick(el, '[data-aport-anadir]', () => {
    const importe = parseFloat((el.querySelector('#paport-importe') as HTMLInputElement | null)?.value ?? '') || 0;
    if (!importe) return toast('Importe requerido', 'err');
    plan.push({
      _id: Date.now().toString(36),
      importe,
      periodicidad: (el.querySelector('#paport-periodo') as HTMLSelectElement | null)?.value || 'mensual',
      fechaInicio: (el.querySelector('#paport-inicio') as HTMLInputElement | null)?.value || hoy,
      fechaFin: (el.querySelector('#paport-fin') as HTMLInputElement | null)?.value || '',
    });
    pintar();
  });
  onClick(el, '[data-aport-borrar]', (btn) => {
    plan.splice(Number(btn.getAttribute('data-aport-borrar')), 1);
    pintar();
  });
  pintar();
}

/**
 * Construye la cuenta a persistir. Si el saldo cambia, añade un punto al
 * histórico y —si ha subido— registra la diferencia como aportación, que es lo
 * que alimenta el coste base y el ahorro fiscal del año.
 */
export function construirPension(
  el: HTMLElement,
  plan: AportacionPlan[],
  existente: Account | null,
  hoy: ISODate,
): { datos: Partial<Account>; error?: string } {
  const val = (sel: string) => (el.querySelector(sel) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
  const num = (sel: string, def = 0) => {
    const v = parseFloat(val(sel));
    return Number.isFinite(v) ? v : def;
  };
  const marcado = (sel: string) => !!(el.querySelector(sel) as HTMLInputElement | null)?.checked;

  const nombre = val('#pen-nombre').trim();
  if (!nombre) return { datos: {}, error: 'Nombre obligatorio' };

  const nuevoSaldo = num('#pen-saldo');
  const grupoNomina = val('#pen-grupo');

  const base: Partial<Account> = {
    nombre,
    grupoNomina,
    saldo: nuevoSaldo,
    saldoInicial: num('#pen-saldo-ini'),
    fechaInicialSaldo: val('#pen-fecha-ini') || hoy,
    interes: num('#pen-interes'),
    periodoCobro: val('#pen-periodo') || 'mensual',
    modeloFondo: 'pension',
    bloqueoMeses: parseInt(val('#pen-bloqueo'), 10) || 120,
    // Con grupo el tipo se deriva del marginal: guardar un fijo confundiría
    impuestoRetirada: grupoNomina ? 0 : num('#pen-impuesto'),
    planAportaciones: plan,
    descripcion: val('#pen-desc').trim(),
    activo: marcado('#pen-activo'),
    simulacion: marcado('#pen-sim'),
    escenarioIds: [...el.querySelectorAll<HTMLInputElement>('.pen-escenario:checked')].map((i) => i.value),
  };

  const historico = [...((existente?.historicoSaldos as PuntoSaldoLike[]) ?? [])];
  const aportaciones = [...(existente?.aportaciones ?? [])];
  const ordenado = [...historico].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const saldoAnterior = ordenado[0]?.saldo ?? existente?.saldo ?? null;
  const id = Date.now().toString(36);

  if (!existente) {
    if (nuevoSaldo > 0) {
      historico.push({ _id: id, fecha: hoy, saldo: nuevoSaldo, nota: 'Saldo inicial' });
      aportaciones.push({ _id: `${id}a`, fecha: base.fechaInicialSaldo ?? hoy, cantidad: nuevoSaldo });
    }
  } else if (saldoAnterior === null || Math.abs(nuevoSaldo - saldoAnterior) > 0.005) {
    historico.push({ _id: id, fecha: hoy, saldo: nuevoSaldo, nota: 'Actualización manual' });
    if (nuevoSaldo > (saldoAnterior ?? 0)) aportaciones.push({ _id: `${id}a`, fecha: hoy, cantidad: nuevoSaldo - (saldoAnterior ?? 0) });
  }

  return { datos: { ...base, historicoSaldos: historico, aportaciones } as Partial<Account> };
}

export { todayISO, confirmar };
