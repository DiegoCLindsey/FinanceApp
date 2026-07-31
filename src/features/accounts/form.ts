// ── features/accounts/form ────────────────────────────────────────────────────
// Formulario de cuenta / fondo.
//
// Diferencias respecto al legacy (`accounts/accounts.js`), además del tipado:
//   · sin `onclick="AccountsModule.saveAccount('<id>')"`: data-attrs + delegación;
//   · el selector de tipo NO ofrece "Plan de pensiones". La vista de cuentas
//     filtra los planes (los gestiona Nóminas, porque su fiscalidad es la del
//     trabajo), así que crear uno aquí lo hacía desaparecer sin explicación;
//   · el cambio de saldo no escribe `historicoSaldos` a mano: devuelve el punto
//     de control que el índice registra en el ledger, que es quien manda sobre
//     el pasado desde F4. Antes había dos escritores del mismo campo y el
//     ledger machacaba lo que la vista de cuentas hubiera añadido.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import { modeloFondoDe } from '@/core/accounts';
import type { Account, Escenario, Nomina } from '@/state/schema';
import type { PlanAportacion } from '@/engine/providers/contributions';
import { esc, onChange, onClick, toast } from '../accounting/dom';
import { campo, checkboxesEscenarios, selector } from '../loans/forms';

/** Modelos que esta vista sabe crear y editar (pensión se gestiona en Nóminas). */
export const MODELOS_CUENTA: [string, string][] = [
  ['cuenta', 'Cuenta bancaria'],
  ['inversion', 'Fondo de inversión'],
  ['beneficio', 'Tarjeta beneficio'],
];

export interface FormularioCuentaDeps {
  escenarios: Escenario[];
  nominas: Nomina[];
  hoy: ISODate;
  /** Último saldo real conocido (punto de control más reciente del ledger). */
  saldoActual: number;
}

function aportacionesHtml(plan: PlanAportacion[]): string {
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
      <input class="form-input" type="number" id="aport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="aport-periodo" style="font-size:12px">
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
      <input class="form-input" type="date" id="aport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="aport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`;
}

export function formularioCuenta(acc: Account | null, deps: FormularioCuentaDeps): string {
  const modelo = acc ? modeloFondoDe(acc) : 'cuenta';
  const grupos = [...new Set(deps.nominas.filter((n) => n.grupoNomina).map((n) => n.grupoNomina))];
  const oculto = (visible: boolean) => (visible ? '' : ' style="display:none"');

  return `
    <div class="grid-2">
      ${campo('ac-nombre', 'Nombre', 'text', acc?.nombre ?? '', 'Ej: Cuenta ING, Fondo Vanguard')}
      ${selector('ac-modelo', 'Tipo', MODELOS_CUENTA, modelo)}
    </div>
    <div class="grid-2 mt-8">
      ${campo('ac-saldo', 'Saldo actual (€)', 'number', deps.saldoActual, '5000')}
      ${campo('ac-saldo-ini', 'Saldo inicial (€)', 'number', acc?.saldoInicial ?? 0, '5000')}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${campo('ac-interes', 'Rentabilidad anual (%)', 'number', acc?.interes ?? 0, '7')}
      ${campo('ac-fecha-ini', 'Fecha saldo inicial', 'date', acc?.fechaInicialSaldo ?? deps.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${acc?.activo !== false ? ' checked' : ''}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${acc ? ' open' : ''}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${selector(
            'ac-periodo',
            'Capitalización',
            [
              ['diario', 'Diario'],
              ['semanal', 'Semanal'],
              ['mensual', 'Mensual'],
            ],
            acc?.periodoCobro ?? 'mensual',
          )}
        </div>
        <div id="ac-inversion-hint"${oculto(modelo === 'inversion')}>
          <div class="auth-hint mt-8" style="border-color:#10b981">
            📈 <strong>Fondo de inversión:</strong> la tarjeta muestra la plusvalía latente y el impuesto estimado
            sobre ganancias de capital con los tramos configurados en esta misma vista.
          </div>
        </div>
        <div id="ac-beneficio-fields"${oculto(modelo === 'beneficio')}>
          <div class="auth-hint mt-8" style="border-color:var(--accent)">
            🎫 <strong>Tarjeta beneficio:</strong> se recarga mensualmente desde la nómina. Los gastos
            (metro, restaurante) se registran como movimientos sobre esta cuenta.
          </div>
          <div class="form-group mt-8">
            ${selector(
              'ac-tipo-beneficio',
              'Tipo de beneficio',
              [
                ['transporte', 'Transporte (límite 1.500 €/año)'],
                ['restaurante', 'Restaurante (límite 2.640 €/año)'],
                ['otros', 'Otros beneficios'],
              ],
              acc?.tipoBeneficio ?? 'transporte',
            )}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${grupos.map((g) => `<option value="${esc(g)}"${acc?.grupoNomina === g ? ' selected' : ''}>${esc(g)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${esc(acc?.descripcion ?? '')}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${acc?.simulacion ? ' checked' : ''}/><span class="toggle-slider"></span></label>
        </div>
        ${checkboxesEscenarios(deps.escenarios, acc?.escenarioIds ?? [], 'ac-escenario')}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${esc(acc?._id ?? '')}">Guardar</button>
    </div>`;
}

/** Cablea el editor de aportaciones y los bloques que dependen del tipo. */
export function wireFormularioCuenta(el: HTMLElement, plan: PlanAportacion[], hoy: ISODate): void {
  const pintar = () => {
    const cont = el.querySelector('#ac-aport-container');
    if (cont) cont.innerHTML = aportacionesHtml(plan);
  };

  onChange(el, '#ac-modelo', (sel) => {
    const valor = (sel as HTMLSelectElement).value;
    const mostrar = (id: string, visible: boolean) => {
      const bloque = el.querySelector<HTMLElement>(id);
      if (bloque) bloque.style.display = visible ? '' : 'none';
    };
    mostrar('#ac-inversion-hint', valor === 'inversion');
    mostrar('#ac-beneficio-fields', valor === 'beneficio');
  });

  onClick(el, '[data-aport-anadir]', () => {
    const importe = parseFloat((el.querySelector('#aport-importe') as HTMLInputElement | null)?.value ?? '') || 0;
    if (!importe) return toast('Importe requerido', 'err');
    plan.push({
      _id: Date.now().toString(36),
      importe,
      periodicidad: (el.querySelector('#aport-periodo') as HTMLSelectElement | null)?.value || 'mensual',
      fechaInicio: (el.querySelector('#aport-inicio') as HTMLInputElement | null)?.value || hoy,
      fechaFin: (el.querySelector('#aport-fin') as HTMLInputElement | null)?.value || '',
    });
    pintar();
  });
  onClick(el, '[data-aport-borrar]', (btn) => {
    plan.splice(Number(btn.getAttribute('data-aport-borrar')), 1);
    pintar();
  });

  pintar();
}

/** Punto de control a registrar tras guardar, si el saldo ha cambiado. */
export interface PuntoPendiente {
  fecha: ISODate;
  saldo: number;
  nota: string;
}

export interface CuentaConstruida {
  datos: Partial<Account>;
  /** Se registra en el ledger; el ledger replica en `historicoSaldos`. */
  punto?: PuntoPendiente;
  error?: string;
}

/**
 * Construye la cuenta a persistir a partir del formulario.
 *
 * Igual que el legacy, un saldo distinto del último conocido genera un punto de
 * control, y en fondos (inversión) la subida se registra además como aportación
 * — es lo que alimenta el coste base y, con él, la plusvalía latente.
 */
export function construirCuenta(
  el: HTMLElement,
  plan: PlanAportacion[],
  existente: Account | null,
  saldoAnterior: number | null,
  hoy: ISODate,
): CuentaConstruida {
  const val = (sel: string) => (el.querySelector(sel) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
  const num = (sel: string, def = 0) => {
    const v = parseFloat(val(sel));
    return Number.isFinite(v) ? v : def;
  };
  const marcado = (sel: string) => !!(el.querySelector(sel) as HTMLInputElement | null)?.checked;

  const nombre = val('#ac-nombre').trim();
  if (!nombre) return { datos: {}, error: 'Nombre obligatorio' };

  const modelo = (val('#ac-modelo') || 'cuenta') as Account['modeloFondo'];
  const esBeneficio = modelo === 'beneficio';
  const nuevoSaldo = num('#ac-saldo');

  const datos: Partial<Account> = {
    nombre,
    saldo: nuevoSaldo,
    saldoInicial: num('#ac-saldo-ini'),
    fechaInicialSaldo: val('#ac-fecha-ini') || hoy,
    interes: num('#ac-interes'),
    periodoCobro: val('#ac-periodo') || 'mensual',
    descripcion: val('#ac-desc').trim(),
    activo: marcado('#ac-activo'),
    simulacion: marcado('#ac-sim'),
    escenarioIds: [...el.querySelectorAll<HTMLInputElement>('.ac-escenario:checked')].map((i) => i.value),
    modeloFondo: modelo,
    planAportaciones: plan,
    tipoBeneficio: esBeneficio ? val('#ac-tipo-beneficio') || 'transporte' : undefined,
    // El grupo solo aplica a las tarjetas beneficio; en el resto se conserva
    grupoNomina: esBeneficio ? val('#ac-beneficio-grupo') : (existente?.grupoNomina ?? ''),
    // Campos que una cuenta nueva necesita completos; al editar son un patch y
    // no deben pisar lo que ya hay (el histórico lo lleva el ledger).
    ...(existente ? {} : { historicoSaldos: [], aportaciones: [], esCuentaPrincipal: false }),
  };

  // Cuenta nueva con saldo 0: no hay nada que anclar (igual que el legacy)
  if (!existente && nuevoSaldo <= 0) return { datos };
  const cambia = saldoAnterior === null || Math.abs(nuevoSaldo - saldoAnterior) > 0.005;
  if (!cambia) return { datos };

  if (modelo === 'inversion' && nuevoSaldo > (saldoAnterior ?? 0)) {
    const id = Date.now().toString(36);
    datos.aportaciones = [
      ...(existente?.aportaciones ?? []),
      { _id: `${id}a`, fecha: existente ? hoy : (datos.fechaInicialSaldo ?? hoy), cantidad: nuevoSaldo - (saldoAnterior ?? 0) },
    ];
  }

  return { datos, punto: { fecha: hoy, saldo: nuevoSaldo, nota: existente ? 'Actualización manual' : 'Saldo inicial' } };
}
