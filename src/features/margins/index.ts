// ── features/margins ─────────────────────────────────────────────────────────
// Márgenes de seguridad: umbrales de saldo mínimo con waypoints temporales
// (F1, tarea 1.7 — port de la vista legacy `margenes/margenes.js`).
//
// Cambios respecto a la versión legacy, además del tipado:
//   · delegación de eventos en lugar de `onclick=`/`onchange=` inline con
//     interpolación de ids en strings de JavaScript;
//   · todo el texto del usuario se escapa antes de interpolarlo;
//   · el cálculo del umbral viene de `engine/margins` (mismo resultado, ya
//     verificado contra el legacy con tests de paridad).
//
// Los márgenes viven en `config.margenesSeguridad`. La consolidación del colchón
// como margen predefinido (tarea 1.9a, aprobada) se hará al portar el dashboard,
// que es quien consume hoy el colchón.

import { formatEUR } from '@/core/money';
import { parseLocalDate, todayISO, type ISODate } from '@/core/dates';
import {
  calcGastoBasicoMensual,
  calcMargenEnFecha,
  type BasicoExpense,
  type BasicoLoan,
  type MargenSeguridad,
  type PuntoReserva,
} from '@/engine/margins';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Account, AppConfig } from '@/state/schema';
import { confirmar, esc, onChange, onClick, toast } from '../accounting/dom';

export interface MarginsStoreLike {
  get(key: 'config'): AppConfig;
  get(key: 'accounts'): Account[];
  get(key: 'expenses'): BasicoExpense[];
  get(key: 'loans'): BasicoLoan[];
  patchConfig(patch: Partial<AppConfig>): void;
}

export interface MarginsViewDeps {
  store: MarginsStoreLike;
  onDatosCambiados?: () => void;
  /**
   * "Hoy" de la vista. Inyectable, y no `todayISO()`/`new Date()` sueltos: el
   * umbral de un margen "de N meses" se calcula proyectando el gasto básico
   * desde hoy, así que sin fijarlo el resultado cambia según el día en que se
   * mire (y el test que lo cubre pasaba o fallaba según la fecha).
   */
  hoy?: () => ISODate;
}

const ICONO =
  'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function createMarginsFeature(deps: MarginsViewDeps): FeatureManifest {
  const { store } = deps;
  const hoy = deps.hoy ?? todayISO;
  const hoyDate = () => parseLocalDate(hoy());

  const margenes = (): MargenSeguridad[] => store.get('config').margenesSeguridad ?? [];

  function guardar(lista: MargenSeguridad[]): void {
    store.patchConfig({ margenesSeguridad: lista });
    deps.onDatosCambiados?.();
  }

  function conMargen(id: string, fn: (m: MargenSeguridad) => void): void {
    const lista = margenes().map((m) => ({ ...m, puntos: (m.puntos ?? []).map((p) => ({ ...p })) }));
    const m = lista.find((x) => x._id === id);
    if (!m) return;
    fn(m);
    guardar(lista);
  }

  function umbralHoy(m: MargenSeguridad): string {
    const cfg = store.get('config');
    const valor = calcMargenEnFecha(m, store.get('expenses'), cfg, store.get('loans'), hoy(), false, hoyDate());
    return formatEUR(valor);
  }

  function filaPunto(m: MargenSeguridad, p: PuntoReserva, gastoMensual: number): string {
    const esFijo = p.tipo === 'fijo';
    const equivalente = esFijo
      ? ''
      : `<span class="text-sm" style="color:var(--text3)">${esc(formatEUR((p.meses ?? 0) * gastoMensual))}</span>`;
    return `
      <tr data-punto="${esc(p._id)}" data-margen="${esc(m._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${esc(p.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${esFijo ? ' selected' : ''}>Fijo €</option>
            <option value="meses"${!esFijo ? ' selected' : ''}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${esFijo ? `<input type="number" class="form-input" style="width:90px" value="${p.importe ?? 0}" data-campo="importe"/>` : '<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${!esFijo ? `<input type="number" class="form-input" style="width:70px" value="${p.meses ?? 0}" step="0.5" data-campo="meses"/>` : '<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">${equivalente}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`;
  }

  function tarjeta(m: MargenSeguridad, cuentas: Account[], gastoMensual: number): string {
    const cuentasText =
      m.cuentas && m.cuentas.length > 0
        ? m.cuentas.map((id) => cuentas.find((a) => a._id === id)?.nombre ?? id).join(', ')
        : 'Todas las cuentas activas';

    const puntos = [...(m.puntos ?? [])].sort((a, b) => a.fecha.localeCompare(b.fecha));
    const filas = puntos.map((p) => filaPunto(m, p, gastoMensual)).join('');

    const cuerpo = m.activo
      ? `
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${esc(cuentasText)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${esc(umbralHoy(m))}</strong>
      </div>
      <div class="mt-8" style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="color:var(--text3);text-align:left;border-bottom:1px solid var(--border)">
              <th style="padding:4px 6px;font-weight:500">Fecha</th>
              <th style="padding:4px 6px;font-weight:500">Tipo</th>
              <th style="padding:4px 6px;font-weight:500">Importe €</th>
              <th style="padding:4px 6px;font-weight:500">Meses</th>
              <th style="padding:4px 6px;font-weight:500">Equiv. €</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${filas || `<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${esc(m._id)}">+ Añadir punto</button></div>`
      : '';

    return `
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${esc(m.nombre)}</span>
            <span class="badge ${m.activo ? 'badge-active' : 'badge-inactive'}">${m.activo ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${m.activo ? 'Desactivar' : 'Activar'}">
              <input type="checkbox" ${m.activo ? 'checked' : ''} data-toggle-margen="${esc(m._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${esc(m._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${esc(m._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${cuerpo}
      </div>`;
  }

  // ── Formulario (alta y edición) ────────────────────────────────────────────
  function renderFormulario(container: HTMLElement, id: string | null): void {
    const m = id ? margenes().find((x) => x._id === id) : null;
    const cuentas = store.get('accounts').filter((a) => a.activo);
    const seleccionadas = new Set(m?.cuentas ?? []);

    const chips = cuentas
      .map(
        (acc) => `
        <label class="tag" data-chip="${esc(acc._id)}" style="cursor:pointer;${seleccionadas.has(acc._id) ? 'border-color:var(--accent);color:var(--accent)' : ''}">
          <input type="checkbox" class="mg-acc-chip" value="${esc(acc._id)}" ${seleccionadas.has(acc._id) ? 'checked' : ''} style="display:none"/>
          ${esc(acc.nombre)}
        </label>`,
      )
      .join(' ');

    container.innerHTML = `
      <div class="modal-title">${id ? 'Editar margen' : 'Nuevo margen de seguridad'}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${esc(m?.nombre ?? '')}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${chips || '<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${
        !m
          ? `<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${esc(todayISO())}"/></div>
          <div class="form-group"><label class="form-label">Tipo</label>
            <select class="form-input" id="mg-p-tipo">
              <option value="fijo">Fijo €</option>
              <option value="meses">Meses de gastos básicos</option>
            </select>
          </div>
        </div>
        <div class="form-group" id="mg-p-importe-wrap"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="mg-p-importe" value="0" min="0"/></div>
        <div class="form-group" id="mg-p-meses-wrap" style="display:none"><label class="form-label">Nº meses</label><input class="form-input" type="number" id="mg-p-meses" value="1" min="0" step="0.5"/></div>
      </div>`
          : ''
      }
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar-form>Cancelar</button>
        <button class="btn-primary" data-guardar-margen="${esc(id ?? '')}">Guardar</button>
      </div>`;
  }

  function abrirFormulario(id: string | null, refrescar: () => void): void {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    renderFormulario(content, id);
    overlay.classList.remove('hidden');

    // Chips: reflejar la selección visualmente
    onChange(content, '.mg-acc-chip', (el) => {
      const input = el as HTMLInputElement;
      const chip = content.querySelector<HTMLElement>(`[data-chip="${input.value}"]`);
      if (chip) chip.style.cssText = `cursor:pointer;${input.checked ? 'border-color:var(--accent);color:var(--accent)' : ''}`;
    });
    // Tipo del punto inicial: alternar importe/meses
    onChange(content, '#mg-p-tipo', (el) => {
      const esFijo = (el as HTMLSelectElement).value === 'fijo';
      const impWrap = content.querySelector<HTMLElement>('#mg-p-importe-wrap');
      const mesWrap = content.querySelector<HTMLElement>('#mg-p-meses-wrap');
      if (impWrap) impWrap.style.display = esFijo ? '' : 'none';
      if (mesWrap) mesWrap.style.display = esFijo ? 'none' : '';
    });

    onClick(content, '[data-cerrar-form]', () => overlay.classList.add('hidden'));

    onClick(content, '[data-guardar-margen]', (el) => {
      const editId = el.getAttribute('data-guardar-margen') || '';
      const nombre = (content.querySelector('#mg-nombre') as HTMLInputElement | null)?.value.trim() ?? '';
      if (!nombre) return toast('El nombre es obligatorio', 'err');
      const cuentasSel = [...content.querySelectorAll<HTMLInputElement>('.mg-acc-chip:checked')].map((i) => i.value);

      const lista = margenes().map((x) => ({ ...x }));
      if (editId) {
        const idx = lista.findIndex((x) => x._id === editId);
        if (idx === -1) return toast('Margen no encontrado', 'err');
        lista[idx] = { ...lista[idx], nombre, cuentas: cuentasSel };
      } else {
        const tipo = ((content.querySelector('#mg-p-tipo') as HTMLSelectElement | null)?.value ?? 'fijo') as PuntoReserva['tipo'];
        const punto: PuntoReserva = {
          _id: uid(),
          fecha: ((content.querySelector('#mg-p-fecha') as HTMLInputElement | null)?.value || todayISO()) as ISODate,
          tipo,
          importe: parseFloat((content.querySelector('#mg-p-importe') as HTMLInputElement | null)?.value ?? '0') || 0,
          meses: parseFloat((content.querySelector('#mg-p-meses') as HTMLInputElement | null)?.value ?? '1') || 1,
        };
        lista.push({ _id: uid(), nombre, activo: true, cuentas: cuentasSel, puntos: [punto] });
      }
      guardar(lista);
      toast(editId ? 'Margen actualizado' : 'Margen creado');
      overlay.classList.add('hidden');
      refrescar();
    });
  }

  // ── Vista ──────────────────────────────────────────────────────────────────
  function render(container: HTMLElement): void {
    const lista = margenes();
    const cuentas = store.get('accounts');
    const gastoMensual = calcGastoBasicoMensual(store.get('expenses'), hoyDate());

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Márgenes de <span>seguridad</span></h1>
          <p class="text-sm" style="color:var(--text3);margin:4px 0 0">
            Umbrales de saldo mínimo por cuenta o grupo de cuentas. El dashboard avisa cuando la
            proyección los cruza, y el optimizador de amortizaciones los respeta.
          </p>
        </div>
        <button class="btn-primary" data-nuevo-margen>+ Añadir margen</button>
      </div>
      ${
        lista.length === 0
          ? `<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`
          : lista.map((m) => tarjeta(m, cuentas, gastoMensual)).join('')
      }`;

    const refrescar = () => render(container);

    onClick(container, '[data-nuevo-margen]', () => abrirFormulario(null, refrescar));
    onClick(container, '[data-editar-margen]', (el) => abrirFormulario(el.getAttribute('data-editar-margen'), refrescar));

    onClick(container, '[data-borrar-margen]', (el) => {
      if (!confirmar('¿Eliminar este margen de seguridad?')) return;
      guardar(margenes().filter((m) => m._id !== el.getAttribute('data-borrar-margen')));
      toast('Margen eliminado');
      refrescar();
    });

    onChange(container, '[data-toggle-margen]', (el) => {
      const id = el.getAttribute('data-toggle-margen') as string;
      conMargen(id, (m) => {
        m.activo = (el as HTMLInputElement).checked;
      });
      refrescar();
    });

    onClick(container, '[data-add-punto]', (el) => {
      const id = el.getAttribute('data-add-punto') as string;
      conMargen(id, (m) => {
        m.puntos = [...(m.puntos ?? []), { _id: uid(), fecha: todayISO(), tipo: 'fijo', importe: 0, meses: 1 }];
      });
      refrescar();
    });

    onClick(container, '[data-borrar-punto]', (el) => {
      const fila = el.closest('[data-punto]') as HTMLElement | null;
      if (!fila) return;
      const margenId = fila.dataset.margen as string;
      const puntoId = fila.dataset.punto as string;
      conMargen(margenId, (m) => {
        m.puntos = (m.puntos ?? []).filter((p) => p._id !== puntoId);
      });
      refrescar();
    });

    // Edición inline de los waypoints
    onChange(container, '[data-campo]', (el) => {
      const fila = el.closest('[data-punto]') as HTMLElement | null;
      if (!fila) return;
      const campo = el.getAttribute('data-campo') as 'fecha' | 'tipo' | 'importe' | 'meses';
      const valor = (el as HTMLInputElement | HTMLSelectElement).value;
      conMargen(fila.dataset.margen as string, (m) => {
        const p = (m.puntos ?? []).find((x) => x._id === fila.dataset.punto);
        if (!p) return;
        if (campo === 'fecha') p.fecha = valor;
        else if (campo === 'tipo') p.tipo = valor as PuntoReserva['tipo'];
        else if (campo === 'importe') p.importe = parseFloat(valor) || 0;
        else p.meses = parseFloat(valor) || 0;
      });
      refrescar();
    });
  }

  return {
    id: 'margenes',
    route: 'margenes',
    nombre: 'Márgenes de seguridad',
    flagId: 'margenes',
    seccion: 2, // "Planificación"
    iconoPath: ICONO,
    mount: render,
  };
}
