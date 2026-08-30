// ── features/salaries/form ────────────────────────────────────────────────────
// Formulario de nómina, con vista previa en vivo del desglose (bruto → SS →
// IRPF → neto por paga) y editor de retribución flexible.
//
// La retribución flexible (art. 42 LIRPF) está exenta de IRPF y de cotización,
// así que reduce la base dineraria: es la diferencia clave entre "bruto total" y
// lo que de verdad se cobra y tributa.

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import { calcBaseImponibleTrabajo, calcIRPF, type Tramos } from '@/core/tax/irpf';
import { SS_PCT_DEFECTO } from '@/core/tax/nomina-grupo';
import type { Account, Escenario, Nomina, Persona } from '@/state/schema';
import { esc, onChange, onClick, toast } from '../accounting/dom';
import { checkboxesEscenarios } from '../loans/forms';
import { leerRepartoWidget, repartoWidget, sincronizarRepartoWidget } from '../shared/reparto-widget';

/** Componente de retribución flexible en edición. */
export interface ComponenteFlex {
  _id: string;
  tipo: 'transporte' | 'restaurante' | 'otros' | string;
  importe: number;
  cuenta?: string;
}

/** Límites orientativos mensuales de exención (informativos, no bloquean). */
const LIMITES_FLEX: Record<string, number | null> = { transporte: 125, restaurante: 220, otros: null };
const ETIQUETA_FLEX: Record<string, string> = { transporte: 'Transporte', restaurante: 'Restaurante', otros: 'Otros' };

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const campo = (id: string, label: string, tipo: string, valor: string | number, placeholder = '') =>
  `<div class="form-group"><label class="form-label">${esc(label)}</label>
   <input class="form-input" type="${tipo}" id="${id}" value="${esc(valor)}" placeholder="${esc(placeholder)}"/></div>`;

const opcionesCuenta = (accounts: Account[], sel: string) =>
  accounts
    .filter((a) => a.activo !== false)
    .map((a) => `<option value="${esc(a._id)}"${a._id === sel ? ' selected' : ''}>${esc(a.nombre)}</option>`)
    .join('');

/** Lista editable de componentes de retribución flexible. */
export function flexHtml(plan: ComponenteFlex[], accounts: Account[]): string {
  const filas = plan
    .map((c, i) => {
      const cuenta = accounts.find((a) => a._id === c.cuenta);
      const limite = LIMITES_FLEX[c.tipo];
      const excede = limite !== null && limite !== undefined && c.importe > limite;
      return `<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${esc(ETIQUETA_FLEX[c.tipo] ?? c.tipo)}</span>
        <span style="flex:1;font-size:12px">${esc(formatEUR(c.importe))}/mes${
          excede ? ` <span style="color:var(--red)" title="Supera el límite orientativo de ${esc(formatEUR(limite))}/mes">⚠</span>` : ''
        }</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${
          cuenta ? esc(cuenta.nombre) : '<span style="color:var(--yellow)">Sin cuenta</span>'
        }</span>
        <button class="btn-danger btn-sm" data-flex-borrar="${i}">✕</button>
      </div>`;
    })
    .join('');

  const utilizables = accounts.filter((a) => (a.modeloFondo || 'cuenta') !== 'pension' && a.activo !== false);
  const conBeneficio = utilizables.filter((a) => (a.modeloFondo || 'cuenta') === 'beneficio');

  return `<div style="margin-bottom:8px">${filas || '<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin componentes. Añade transporte o restaurante.</div>'}</div>
    <div class="grid-3 mt-6" style="gap:6px">
      <select class="form-select" id="fc-tipo" style="font-size:12px">
        <option value="transporte">Transporte</option>
        <option value="restaurante">Restaurante</option>
        <option value="otros">Otros</option>
      </select>
      <input class="form-input" type="number" id="fc-importe" placeholder="€/mes" min="0" style="font-size:12px"/>
      <select class="form-select" id="fc-cuenta" style="font-size:12px">
        <option value="">Sin cuenta vinculada</option>
        ${utilizables.map((a) => `<option value="${esc(a._id)}">${esc(a.nombre)}${(a.modeloFondo || 'cuenta') === 'beneficio' ? ' ★' : ''}</option>`).join('')}
      </select>
    </div>
    ${
      conBeneficio.length === 0
        ? '<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>'
        : ''
    }
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`;
}

export interface FormularioNominaDeps {
  accounts: Account[];
  escenarios: Escenario[];
  nominas: Nomina[];
  personas: Persona[];
  cuentaPrincipal: string;
  tramos: Tramos;
  hoy?: ISODate;
}

export function formularioNomina(n: Nomina | null, deps: FormularioNominaDeps): string {
  const hoy = deps.hoy ?? todayISO();
  const nPagas = n?.nPagas ?? 12;
  const estandar = [12, 14, 16].includes(nPagas);

  return `
    <div class="grid-2">
      ${campo('nf-nombre', 'Nombre / Empresa', 'text', n?.nombre ?? '', 'Ej: Empresa S.A.')}
      ${campo('nf-bruto', 'Bruto anual (€)', 'number', n?.bruto ?? '', '30000')}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12, 14, 16].map((v) => `<option value="${v}"${estandar && nPagas === v ? ' selected' : ''}>${v} pagas</option>`).join('')}
          <option value="custom"${estandar ? '' : ' selected'}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${opcionesCuenta(deps.accounts, n?.cuenta ?? deps.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${n?._id ? ' open' : ''}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${campo('nf-fecha-ini', 'Fecha inicio', 'date', n?.fechaInicio ?? hoy)}
          ${campo('nf-fecha-fin', 'Fecha fin (opcional)', 'date', n?.fechaFin ?? '')}
        </div>
        <div class="grid-2 mt-8">
          ${campo('nf-grupo', 'Grupo (opcional)', 'text', n?.grupoNomina ?? '', 'Ej: Empresa principal')}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${MESES.map((m, i) => `<option value="${i + 1}"${n?.mesActualizacionIPC === i + 1 ? ' selected' : ''}>${esc(m)} (${i + 1})</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid-2 mt-8">
          <div class="form-group" id="nf-custom-pagas-wrap"${estandar ? ' style="display:none"' : ''}>
            <label class="form-label">Nº pagas (personalizado)</label>
            <input class="form-input" type="number" id="nf-npagas-custom" min="1" max="24" value="${nPagas}"/>
          </div>
          <div class="form-group"><label class="form-label">Modo IRPF</label>
            <select class="form-select" id="nf-irpfmodo">
              <option value="auto"${(n?.irpfModo ?? 'auto') === 'auto' ? ' selected' : ''}>Auto (tramos)</option>
              <option value="manual"${n?.irpfModo === 'manual' ? ' selected' : ''}>Manual (%)</option>
            </select>
          </div>
        </div>
        <div id="nf-irpfpct-wrap" class="mt-8"${n?.irpfModo === 'manual' ? '' : ' style="display:none"'}>
          ${campo('nf-irpfpct', 'Retención IRPF (%)', 'number', n?.irpfPct ?? 0, '20')}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${(n?.representacion ?? 'detallado') === 'detallado' ? ' selected' : ''}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${n?.representacion === 'simplificado' ? ' selected' : ''}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${(n?.ssPct ?? SS_PCT_DEFECTO).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
            <div class="text-sm mt-4" style="color:var(--text3)">CC 4,70 + Desempleo 1,55 + FP 0,10 + MEI 0,13</div>
          </div>
        </div>
        <div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px">Retribución flexible
            <span style="font-weight:400;color:var(--text3);font-size:11px">(art. 42 LIRPF — exento IRPF y SS)</span></div>
          <div class="auth-hint mb-8" style="border-color:var(--accent)">
            Los importes mensuales reducen la base IRPF. Límites orientativos:
            <strong>transporte €125/mes</strong> (€1.500/año) · <strong>restaurante €220/mes</strong> (~€11/día × 20 días).
          </div>
          <div id="flex-comp-container"></div>
        </div>
        ${checkboxesEscenarios(deps.escenarios, n?.escenarioIds ?? [], 'nom-escenario')}
        ${repartoWidget('Reparto de consumo', n?.repartoConsumo, deps.personas, 'consumo')}
        ${repartoWidget('Reparto de pago', n?.repartoPago, deps.personas, 'pago')}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${esc(n?._id ?? '')}">Guardar</button>
    </div>`;
}

/** Lee del formulario los valores que alimentan la vista previa y el guardado. */
export function leerFormulario(el: HTMLElement, flex: ComponenteFlex[]) {
  const val = (sel: string) => (el.querySelector(sel) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
  const num = (sel: string, def = 0) => {
    const v = parseFloat(val(sel));
    return Number.isFinite(v) ? v : def;
  };
  const seleccion = val('#nf-npagas');
  const nPagas = seleccion === 'custom' ? parseInt(val('#nf-npagas-custom'), 10) || 12 : parseInt(seleccion, 10) || 12;

  return {
    nombre: val('#nf-nombre').trim(),
    bruto: num('#nf-bruto'),
    nPagas,
    irpfModo: (val('#nf-irpfmodo') || 'auto') as 'auto' | 'manual',
    irpfPct: num('#nf-irpfpct'),
    ssPct: num('#nf-sspct', SS_PCT_DEFECTO),
    representacion: (val('#nf-representacion') || 'detallado') as 'detallado' | 'simplificado',
    fechaInicio: val('#nf-fecha-ini'),
    fechaFin: val('#nf-fecha-fin') || null,
    cuenta: val('#nf-cuenta'),
    grupoNomina: val('#nf-grupo').trim(),
    mesActualizacionIPC: parseInt(val('#nf-mes-ipc'), 10) || null,
    escenarioIds: [...el.querySelectorAll<HTMLInputElement>('.nom-escenario:checked')].map((i) => i.value),
    retribucionFlexible: flex,
    repartoConsumo: leerRepartoWidget(el, 'consumo'),
    repartoPago: leerRepartoWidget(el, 'pago'),
  };
}

/**
 * Vista previa del desglose. Se calcula aislada (sin grupo) a propósito: el
 * usuario está editando ESTA nómina y todavía puede cambiarle el grupo, así que
 * mostrarle el marginal del conjunto sería confuso. El aviso de grupo advierte
 * de que el número final se recalculará apilado.
 */
export function previewHtml(el: HTMLElement, flex: ComponenteFlex[], deps: FormularioNominaDeps, idActual: string): string {
  const d = leerFormulario(el, flex);
  const flexAnual = flex.reduce((s, c) => s + (c.importe || 0) * 12, 0);
  const base = Math.max(0, d.bruto - flexAnual);
  const ssAnual = base * (d.ssPct / 100);
  const irpfAnual =
    d.irpfModo === 'manual' ? base * (d.irpfPct / 100) : calcIRPF(calcBaseImponibleTrabajo(d.bruto, flexAnual), deps.tramos);
  const netoDinerario = base - ssAnual - irpfAnual;
  const brutoPorPaga = base / d.nPagas;
  const ssPorPaga = ssAnual / d.nPagas;
  const irpfPorPaga = irpfAnual / d.nPagas;
  const netoPorPaga = brutoPorPaga - ssPorPaga - irpfPorPaga;

  const otrasEnGrupo = d.grupoNomina ? deps.nominas.filter((m) => m.grupoNomina === d.grupoNomina && m._id !== idActual) : [];
  const avisoGrupo =
    otrasEnGrupo.length > 0
      ? `<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${esc(d.grupoNomina)}" con ${esc(
          otrasEnGrupo.map((m) => m.nombre).join(', '),
        )} — el IRPF final se calculará al tipo marginal del grupo.</div>`
      : '';

  const filaFlex =
    flexAnual > 0
      ? `<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${esc(formatEUR(flexAnual))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${esc(formatEUR(base))}</span>`
      : '';

  return `<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${esc(formatEUR(d.bruto))}</span>
      ${filaFlex}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${esc(formatEUR(ssAnual))} (${d.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${esc(formatEUR(irpfAnual))} (${base > 0 ? ((irpfAnual / base) * 100).toFixed(1) : '0'}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${esc(formatEUR(netoDinerario))}</span>
      ${flexAnual > 0 ? `<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${esc(formatEUR(flexAnual))}</span>` : ''}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${esc(formatEUR(netoPorPaga))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${
        d.representacion === 'simplificado'
          ? `ingreso ${esc(formatEUR(netoPorPaga))}/paga`
          : `ingreso ${esc(formatEUR(brutoPorPaga))} − SS ${esc(formatEUR(ssPorPaga))} − IRPF ${esc(formatEUR(irpfPorPaga))}`
      }${flexAnual > 0 ? ' + recargas flex' : ''}</span>
    </div>${avisoGrupo}`;
}

/** Cablea la vista previa, el editor de flexible y los campos condicionales. */
export function wireFormulario(el: HTMLElement, flex: ComponenteFlex[], deps: FormularioNominaDeps, idActual: string): void {
  const pintarFlex = () => {
    const cont = el.querySelector('#flex-comp-container');
    if (cont) cont.innerHTML = flexHtml(flex, deps.accounts);
  };
  const pintarPreview = () => {
    const box = el.querySelector('#nf-preview');
    if (box) box.innerHTML = previewHtml(el, flex, deps, idActual);
  };
  const refrescar = () => {
    // Campos que solo aplican a un modo concreto
    const mostrar = (sel: string, visible: boolean) => {
      const n = el.querySelector<HTMLElement>(sel);
      if (n) n.style.display = visible ? '' : 'none';
    };
    mostrar('#nf-custom-pagas-wrap', (el.querySelector('#nf-npagas') as HTMLSelectElement | null)?.value === 'custom');
    mostrar('#nf-irpfpct-wrap', (el.querySelector('#nf-irpfmodo') as HTMLSelectElement | null)?.value === 'manual');
    pintarPreview();
  };

  el.addEventListener('input', (ev) => {
    if ((ev.target as HTMLElement)?.closest('#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct')) pintarPreview();
  });
  onChange(el, '#nf-npagas, #nf-irpfmodo, #nf-representacion', refrescar);
  onChange(el, '[data-reparto-modo="consumo"]', () => sincronizarRepartoWidget(el, 'consumo'));
  onChange(el, '[data-reparto-modo="pago"]', () => sincronizarRepartoWidget(el, 'pago'));

  onClick(el, '[data-flex-anadir]', () => {
    const tipo = (el.querySelector('#fc-tipo') as HTMLSelectElement | null)?.value || 'transporte';
    const importe = parseFloat((el.querySelector('#fc-importe') as HTMLInputElement | null)?.value ?? '') || 0;
    if (!importe) return toast('Importe requerido', 'err');
    flex.push({
      _id: Date.now().toString(36),
      tipo,
      importe,
      cuenta: (el.querySelector('#fc-cuenta') as HTMLSelectElement | null)?.value || '',
    });
    pintarFlex();
    pintarPreview();
  });
  onClick(el, '[data-flex-borrar]', (btn) => {
    flex.splice(Number(btn.getAttribute('data-flex-borrar')), 1);
    pintarFlex();
    pintarPreview();
  });

  pintarFlex();
  pintarPreview();
}
