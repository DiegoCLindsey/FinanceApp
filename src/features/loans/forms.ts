// ── features/loans/forms ──────────────────────────────────────────────────────
// Formularios de préstamo y de amortización anticipada.
// Sin `onclick="LoansModule.saveLoan('<id>')"`: los botones llevan data-attrs y
// el cableado va por delegación desde index.ts.

import { todayISO } from '@/core/dates';
import type { Account, Escenario, Loan, Persona } from '@/state/schema';
import { esc } from '../accounting/dom';
import { diaPagoWidget } from '../shared/dia-pago';
import { repartoWidget } from '../shared/reparto-widget';

export const campo = (id: string, label: string, tipo: string, valor: string | number, placeholder = '') =>
  `<div class="form-group"><label class="form-label">${esc(label)}</label>
   <input class="form-input" type="${tipo}" id="${id}" value="${esc(valor)}" placeholder="${esc(placeholder)}"/></div>`;

export const selector = (id: string, label: string, opciones: [string, string][], sel: string) =>
  `<div class="form-group"><label class="form-label">${esc(label)}</label>
   <select class="form-select" id="${id}">
     ${opciones.map(([v, l]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`).join('')}
   </select></div>`;

const interruptor = (id: string, label: string, activo: boolean, nota = '') =>
  `<label class="form-label">${esc(label)}</label>
   <label class="toggle"><input type="checkbox" id="${id}"${activo ? ' checked' : ''}/><span class="toggle-slider"></span></label>
   ${nota ? `<span class="text-sm" style="margin-left:6px">${esc(nota)}</span>` : ''}`;

export function checkboxesEscenarios(escenarios: Escenario[], seleccionados: string[], clase: string): string {
  if (escenarios.length === 0) return '';
  return `<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${escenarios
        .map(
          (e) => `<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${seleccionados.includes(e._id) ? esc(e.color || 'var(--accent)') : 'var(--border)'}">
            <input type="checkbox" class="${esc(clase)}" value="${esc(e._id)}"${seleccionados.includes(e._id) ? ' checked' : ''}/>
            ${esc(e.nombre)}
          </label>`,
        )
        .join('')}
    </div></div>`;
}

const opcionesCuenta = (accounts: Account[], sel: string) =>
  accounts
    .filter((a) => a.activo !== false)
    .map((a) => `<option value="${esc(a._id)}"${a._id === sel ? ' selected' : ''}>${esc(a.nombre)}</option>`)
    .join('');

export function formularioPrestamo(
  loan: Loan | null,
  accounts: Account[],
  escenarios: Escenario[],
  personas: Persona[],
  hoy = todayISO(),
): string {
  return `
    <div class="grid-2">
      ${campo('f-nombre', 'Nombre del préstamo', 'text', loan?.nombre ?? '', 'Ej: Hipoteca ING')}
      ${campo('f-capital', 'Importe pendiente (€)', 'number', loan?.capital ?? '', '150000')}
    </div>
    <div class="grid-3 mt-8">
      ${campo('f-tin', 'Tipo de interés TIN (%)', 'number', loan?.tin ?? '', '2.5')}
      ${campo('f-meses', 'Plazo (meses)', 'number', loan?.meses ?? '', '360')}
      ${campo('f-fecha', 'Fecha de inicio', 'date', loan?.fechaInicio ?? hoy)}
    </div>

    <details class="form-advanced mt-12"${loan?._id ? ' open' : ''}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${opcionesCuenta(accounts, loan?.cuenta ?? 'default')}</select></div>
          ${diaPagoWidget(loan?.diaPago, 'loan')}
        </div>
        <div class="mt-8">
          ${selector(
            'f-tipo-tasa',
            'Tipo de interés',
            [
              ['fijo', 'Tipo fijo — la cuota no varía'],
              ['variable', 'Tipo variable — la cuota puede cambiar con el mercado'],
            ],
            loan?.tipoTasa ?? 'fijo',
          )}
        </div>
        <div class="grid-2 mt-8">
          ${campo('f-com-ap', 'Com. apertura (%)', 'number', loan?.comisionApertura ?? 0, '1')}
          ${campo('f-com-am', 'Com. amort. anticipada (%)', 'number', loan?.comisionAmort ?? 0, '0.5')}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${esc((loan?.tags ?? []).join(', '))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${interruptor('f-basico', 'Gasto básico', loan?.basico !== false, 'Incluir la cuota en el cálculo del colchón económico')}
        </div>
        ${checkboxesEscenarios(escenarios, loan?.escenarioIds ?? [], 'loan-escenario')}
        ${repartoWidget('Reparto de consumo', loan?.repartoConsumo, personas, 'consumo')}
        ${repartoWidget('Reparto de pago', loan?.repartoPago, personas, 'pago')}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${interruptor('f-activo', 'Activo', loan?.activo !== false)}
          <span style="margin-left:12px"></span>
          ${interruptor('f-sim', 'Simulación', !!loan?.simulacion)}
          <span style="margin-left:12px"></span>
          ${interruptor('f-mostrar-fin', 'Mostrar fin en dashboard', loan?.mostrarFechaFinEnDashboard !== false)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${esc(loan?._id ?? '')}">Guardar</button>
    </div>`;
}

type AmortizacionLoan = NonNullable<Loan['amortizaciones']>[number];

export function formularioAmortizacion(loanId: string, am: AmortizacionLoan | null, escenarios: Escenario[], hoy = todayISO()): string {
  return `
    <div class="grid-2">
      ${campo('am-fecha', 'Fecha', 'date', am?.fecha ?? hoy)}
      ${campo('am-cant', 'Cantidad (€)', 'number', am?.cantidad ?? '', '10000')}
    </div>
    <div class="mt-8">
      ${selector(
        'am-tipo',
        'Efecto',
        [
          ['cuota', 'Reducir cuota (mantener plazo)'],
          ['plazo', 'Reducir plazo (mantener cuota)'],
        ],
        am?.tipo ?? 'cuota',
      )}
    </div>
    ${checkboxesEscenarios(escenarios, (am as { escenarioIds?: string[] } | null)?.escenarioIds ?? [], 'amort-escenario')}
    <div class="form-row mt-8">
      ${interruptor('am-sim', 'Simulación', !!am?.simulacion)}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${esc(loanId)}|${esc(am?._id ?? '')}">${am ? 'Guardar cambios' : 'Añadir'}</button>
    </div>`;
}
