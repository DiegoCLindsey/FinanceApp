// ── features/expenses ─────────────────────────────────────────────────────────
// Gastos, ingresos y transferencias recurrentes: las **estimaciones** del
// sistema (F1, tarea 1.7 — port de `expenses/expenses.js`).
//
// Cambios respecto a la versión legacy, además del tipado:
//   · delegación de eventos en lugar de `onclick="ExpensesModule.x('<id>')"`,
//     que interpolaba ids de usuario dentro de código JavaScript;
//   · todo el texto del usuario se escapa antes de interpolarlo;
//   · desaparece el historial de precios (migración v7, tarea 4.8): los importes
//     reales viven ahora en Contabilidad como transacciones, que además
//     alimentan el análisis de precisión y "sugerir ajuste".
//
// Los escenarios siguen siendo los legacy; se sustituyen por Supuestos en F5,
// y por eso su selector se lee del store sin depender de EscenariosModule.

import { formatEUR } from '@/core/money';
import { labelDiaPago, todayISO, type ISODate } from '@/core/dates';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Account, Escenario, Expense, Persona, TipoExpense } from '@/state/schema';
import { confirmar, esc, onChange, onClick, toast } from '../accounting/dom';
import { diaPagoWidget, leerDiaPago, sincronizarDiaPago } from '../shared/dia-pago';
import { leerRepartoWidget, repartoWidget, resumenRepartoDoble, sincronizarRepartoWidget } from '../shared/reparto-widget';

export interface ExpensesStoreLike {
  get(key: 'expenses'): Expense[];
  get(key: 'accounts'): Account[];
  get(key: 'escenarios'): Escenario[];
  get(key: 'personas'): Persona[];
  addItem(col: 'expenses', item: Omit<Expense, '_id'> & { _id?: string }): Expense;
  updateItem(col: 'expenses', id: string, patch: Partial<Expense>): void;
  removeItem(col: 'expenses', id: string): void;
}

export interface ExpensesViewDeps {
  store: ExpensesStoreLike;
  onDatosCambiados?: () => void;
  /** Inyectable para que los tests no dependan del día en que se ejecutan. */
  hoy?: () => ISODate;
}

const ICONO =
  'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z';

/** Columnas ordenables de la tabla. */
type ClaveOrden = 'concepto' | 'tipo' | 'cuantia' | 'tipoFrecuencia';

interface EstadoVista {
  mostrarExpirados: boolean;
  orden: ClaveOrden;
  sentido: 1 | -1;
  tipo: '' | TipoExpense;
  cuenta: string;
  desde: string;
  hasta: string;
  busqueda: string;
  tags: Set<string>;
}

const FRECUENCIAS: [string, string][] = [
  ['extraordinario', 'Único / Extraordinario'],
  ['diaria', 'Diaria'],
  ['mensual', 'Mensual'],
];

export function createExpensesFeature(deps: ExpensesViewDeps): FeatureManifest {
  const hoy = deps.hoy ?? todayISO;

  // Estado de interfaz (filtros y orden): no es del usuario, no va al store.
  const estado: EstadoVista = {
    mostrarExpirados: false,
    orden: 'concepto',
    sentido: 1,
    tipo: '',
    cuenta: '',
    desde: '',
    hasta: '',
    busqueda: '',
    tags: new Set(),
  };

  const notificar = () => deps.onDatosCambiados?.();
  const cuentas = () => deps.store.get('accounts');
  const nombreCuenta = (id: string | undefined) => cuentas().find((a) => a._id === (id || 'default'))?.nombre ?? (id || 'default');

  // ── Selección ───────────────────────────────────────────────────────────────

  function visibles(): Expense[] {
    const t = hoy();
    let lista = [...deps.store.get('expenses')];
    if (!estado.mostrarExpirados) lista = lista.filter((e) => !e.fechaFin || e.fechaFin >= t);
    if (estado.tipo) lista = lista.filter((e) => e.tipo === estado.tipo);
    if (estado.cuenta) lista = lista.filter((e) => (e.cuenta || 'default') === estado.cuenta);
    if (estado.desde) lista = lista.filter((e) => (e.fechaInicio ?? '') >= estado.desde);
    if (estado.hasta) lista = lista.filter((e) => (e.fechaInicio ?? '') <= estado.hasta);
    if (estado.busqueda) {
      const q = estado.busqueda.toLowerCase();
      lista = lista.filter((e) => e.concepto.toLowerCase().includes(q));
    }
    if (estado.tags.size > 0) lista = lista.filter((e) => (e.tags || []).some((tag) => estado.tags.has(tag)));

    return lista.sort((a, b) => {
      const av = a[estado.orden] ?? '';
      const bv = b[estado.orden] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * estado.sentido;
      return String(av).localeCompare(String(bv)) * estado.sentido;
    });
  }

  /** Todas las etiquetas en uso, antes de aplicar el filtro por etiqueta. */
  function todasLasTags(): string[] {
    return [...new Set(deps.store.get('expenses').flatMap((e) => e.tags || []))].filter(Boolean).sort();
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function cabecera(clave: ClaveOrden, etiqueta: string): string {
    const flecha = estado.orden === clave ? (estado.sentido === 1 ? '↑' : '↓') : '';
    return `<span class="exp-col-head" data-orden="${clave}">${esc(etiqueta)} <span class="sort-arrow">${flecha}</span></span>`;
  }

  function opcionesCuenta(sel: string, incluirTodas = false): string {
    const todas = incluirTodas ? `<option value="">Todas las cuentas</option>` : '';
    return (
      todas +
      cuentas()
        .filter((a) => a.activo !== false)
        .map((a) => `<option value="${esc(a._id)}"${a._id === sel ? ' selected' : ''}>${esc(a.nombre)}</option>`)
        .join('')
    );
  }

  function fila(exp: Expense): string {
    const esTransferencia = exp.tipo === 'transferencia';
    const resumenReparto = resumenRepartoDoble(exp.repartoConsumo, exp.repartoPago, deps.store.get('personas'));
    const dia = labelDiaPago(exp.diaPago ?? '');
    const frecuencia =
      exp.tipoFrecuencia === 'extraordinario'
        ? 'Único'
        : `Cada ${exp.frecuencia ?? 1} ${exp.tipoFrecuencia === 'diaria' ? 'día(s)' : 'mes(es)'}${dia ? ` · ${dia}` : ''}`;
    const expirado = !!exp.fechaFin && exp.fechaFin < hoy();
    const badgeTipo = esTransferencia
      ? '<span class="badge badge-purple">⇄ transf.</span>'
      : exp.tipo === 'ingreso'
        ? '<span class="badge badge-active">ingreso</span>'
        : '<span class="badge badge-red">gasto</span>';
    const cuenta = esTransferencia
      ? `${esc(nombreCuenta(exp.cuenta))} → ${esc(nombreCuenta(exp.cuentaDestino))}`
      : esc(nombreCuenta(exp.cuenta));

    const tags = (exp.tags || [])
      .map(
        (t) =>
          `<span class="tag${estado.tags.has(t) ? ' active' : ''}" data-tag="${esc(t)}" title="Filtrar por ${esc(t)}">${esc(t)}</span>`,
      )
      .join('');

    return `<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${esc(exp.concepto)}</div>
        <div class="tag-list mt-4">${tags}</div>
      </div>
      <div>${badgeTipo}</div>
      <div class="num ${exp.tipo === 'ingreso' ? 'pos' : esTransferencia ? '' : 'neg'}">${esTransferencia ? '⇄ ' : ''}${esc(formatEUR(exp.cuantia))}</div>
      <div class="text-sm">${esc(frecuencia)}</div>
      <div class="text-sm exp-col-hide">${cuenta}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${esc(exp._id)}"${exp.activo ? ' checked' : ''}/><span class="toggle-slider"></span></label>
        ${exp.tipo === 'gasto' && exp.clasificacion === 'deseo' ? '<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>' : ''}
        ${exp.tipo === 'gasto' && exp.clasificacion === null ? '<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>' : ''}
        ${exp.basico ? '<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>' : ''}
        ${exp.ajustadaDesdeId ? `<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${esc(exp.ajustadaEn ?? '')}">ajustada</span>` : ''}
        ${resumenReparto ? `<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${esc(resumenReparto)}">👥 reparto</span>` : ''}
        ${expirado ? '<span class="badge badge-inactive">Exp.</span>' : ''}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${esc(exp._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${esc(exp._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${esc(exp._id)}">✕</button>
      </div>
    </div>`;
  }

  function render(container: HTMLElement): void {
    const lista = visibles();
    const tags = todasLasTags();

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Gastos e <span>Ingresos</span></h1>
        <div class="page-actions">
          <label class="flex gap-8 items-center" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" data-expirados${estado.mostrarExpirados ? ' checked' : ''}/><span class="toggle-slider"></span></label>
            Expirados
          </label>
          <button class="btn-primary" data-nuevo>+ Nuevo</button>
        </div>
      </div>
      <div class="filter-bar">
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${esc(estado.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${estado.tipo === 'gasto' ? ' selected' : ''}>Gastos</option>
          <option value="ingreso"${estado.tipo === 'ingreso' ? ' selected' : ''}>Ingresos</option>
          <option value="transferencia"${estado.tipo === 'transferencia' ? ' selected' : ''}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${opcionesCuenta(estado.cuenta, true)}</select>
        <input class="form-input" type="date" data-f-desde value="${esc(estado.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${esc(estado.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${
        tags.length > 0
          ? `<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${tags.map((t) => `<span class="tag${estado.tags.has(t) ? ' active' : ''}" data-tag="${esc(t)}">${esc(t)}</span>`).join('')}
              ${estado.tags.size > 0 ? `<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>` : ''}
            </div>`
          : ''
      }
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${cabecera('concepto', 'Concepto')} ${cabecera('tipo', 'Tipo')} ${cabecera('cuantia', 'Cuantía')} ${cabecera('tipoFrecuencia', 'Frecuencia')}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${lista.length === 0 ? '<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>' : lista.map(fila).join('')}
      </div>`;
  }

  // ── Formulario ──────────────────────────────────────────────────────────────

  function formularioHtml(exp: Partial<Expense> | null): string {
    const esTransferencia = exp?.tipo === 'transferencia';
    const escenarios = deps.store.get('escenarios');
    const personas = deps.store.get('personas');
    const seleccionados = exp?.escenarioIds || [];
    const campo = (id: string, label: string, tipo: string, valor: string | number, placeholder = '') =>
      `<div class="form-group"><label class="form-label">${esc(label)}</label>
       <input class="form-input" type="${tipo}" id="${id}" value="${esc(valor)}" placeholder="${esc(placeholder)}"/></div>`;

    return `
      <div class="grid-2">
        ${campo('ef-concepto', 'Concepto', 'text', exp?.concepto ?? '', 'Ej: Alquiler')}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${exp?.tipo === 'gasto' || !exp?.tipo ? ' selected' : ''}>Gasto</option>
            <option value="ingreso"${exp?.tipo === 'ingreso' ? ' selected' : ''}>Ingreso</option>
            <option value="transferencia"${esTransferencia ? ' selected' : ''}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${campo('ef-cuantia', 'Cuantía (€)', 'number', exp?.cuantia ?? '', '500')}
        ${campo('ef-frecuencia', 'Frecuencia', 'number', exp?.frecuencia ?? 1, '1')}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${FRECUENCIAS.map(([v, l]) => `<option value="${v}"${(exp?.tipoFrecuencia ?? 'mensual') === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${campo('ef-fecha-ini', 'Fecha inicio', 'date', exp?.fechaInicio ?? hoy())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${opcionesCuenta(exp?.cuenta ?? 'default')}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${esTransferencia ? '' : ' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${opcionesCuenta(exp?.cuentaDestino ?? 'default')}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${exp?.activo !== false ? ' checked' : ''}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${exp?._id ? ' open' : ''}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${campo('ef-fecha-fin', 'Fecha fin (opcional)', 'date', exp?.fechaFin ?? '')}</div>
          <div class="mt-8">${diaPagoWidget(exp?.diaPago, 'exp')}</div>
          <div id="ef-basico-wrap"${esTransferencia ? ' style="display:none"' : ''}>
            <div class="mt-8" id="ef-clasificacion-wrap"${exp?.tipo === 'ingreso' ? ' style="display:none"' : ''}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${(exp?.clasificacion ?? 'necesidad') === 'necesidad' ? ' selected' : ''}>Necesidad</option>
                  <option value="deseo"${exp?.clasificacion === 'deseo' ? ' selected' : ''}>Deseo</option>
                  <option value=""${exp?.clasificacion === null ? ' selected' : ''}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${esc((exp?.tags || []).join(', '))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${exp?.basico ? ' checked' : ''}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${exp?.tipo === 'ingreso' ? '' : ' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${exp?.sujetoIRPF ? ' checked' : ''}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${
            escenarios.length > 0
              ? `<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${escenarios
                      .map(
                        (e) => `<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${seleccionados.includes(e._id) ? esc(e.color || 'var(--accent)') : 'var(--border)'}">
                          <input type="checkbox" class="ef-escenario" value="${esc(e._id)}"${seleccionados.includes(e._id) ? ' checked' : ''}/>
                          ${esc(e.nombre)}
                        </label>`,
                      )
                      .join('')}
                  </div></div>`
              : ''
          }
          ${
            esTransferencia
              ? ''
              : `${repartoWidget('Reparto de consumo', exp?.repartoConsumo, personas, 'consumo')}
                 ${repartoWidget('Reparto de pago', exp?.repartoPago, personas, 'pago')}`
          }
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${esc(exp?._id ?? '')}">Guardar</button>
      </div>`;
  }

  /** Muestra/oculta los bloques que dependen del tipo elegido. */
  function sincronizarTipo(content: HTMLElement): void {
    const tipo = (content.querySelector('#ef-tipo') as HTMLSelectElement | null)?.value ?? 'gasto';
    const mostrar = (sel: string, visible: boolean) => {
      const el = content.querySelector<HTMLElement>(sel);
      if (el) el.style.display = visible ? '' : 'none';
    };
    mostrar('#ef-destino-wrap', tipo === 'transferencia');
    mostrar('#ef-basico-wrap', tipo !== 'transferencia');
    mostrar('#ef-irpf-wrap', tipo === 'ingreso');
    mostrar('#ef-clasificacion-wrap', tipo === 'gasto');
  }

  function abrirFormulario(exp: Partial<Expense> | null, titulo: string, refrescar: () => void): void {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    content.innerHTML = `<div class="modal-title">${esc(titulo)}</div>${formularioHtml(exp)}`;
    overlay.classList.remove('hidden');

    onChange(content, '#ef-tipo', () => sincronizarTipo(content));
    onChange(content, '[data-dp-modo]', () => sincronizarDiaPago(content));
    onChange(content, '[data-reparto-modo="consumo"]', () => sincronizarRepartoWidget(content, 'consumo'));
    onChange(content, '[data-reparto-modo="pago"]', () => sincronizarRepartoWidget(content, 'pago'));
    onClick(content, '[data-cancelar]', () => overlay.classList.add('hidden'));
    onClick(content, '[data-guardar]', (el) => {
      if (guardar(content, el.getAttribute('data-guardar') || '')) {
        overlay.classList.add('hidden');
        refrescar();
      }
    });
  }

  /** Lee el formulario y persiste. Devuelve false si la validación falla. */
  function guardar(content: HTMLElement, id: string): boolean {
    const val = (sel: string) => (content.querySelector(sel) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
    const marcado = (sel: string) => !!(content.querySelector(sel) as HTMLInputElement | null)?.checked;

    const tipo = (val('#ef-tipo') || 'gasto') as TipoExpense;
    const esTransferencia = tipo === 'transferencia';
    const concepto = val('#ef-concepto').trim();
    const cuantia = parseFloat(val('#ef-cuantia'));
    if (!concepto || !Number.isFinite(cuantia)) {
      toast('Concepto y cuantía obligatorios', 'err');
      return false;
    }

    const clasificacionRaw = val('#ef-clasificacion');
    const datos: Omit<Expense, '_id'> = {
      concepto,
      tipo,
      cuantia,
      frecuencia: parseInt(val('#ef-frecuencia'), 10) || 1,
      tipoFrecuencia: (val('#ef-tipo-frec') || 'mensual') as Expense['tipoFrecuencia'],
      fechaInicio: val('#ef-fecha-ini'),
      fechaFin: val('#ef-fecha-fin') || null,
      diaPago: leerDiaPago(content),
      cuenta: val('#ef-cuenta'),
      cuentaDestino: esTransferencia ? val('#ef-cuenta-dest') || 'default' : undefined,
      activo: marcado('#ef-activo'),
      basico: !esTransferencia && marcado('#ef-basico'),
      sujetoIRPF: !esTransferencia && marcado('#ef-sujetoIRPF'),
      // Una transferencia no se clasifica; en gasto, '' significa "sin clasificar"
      clasificacion: tipo === 'gasto' ? ((clasificacionRaw || null) as Expense['clasificacion']) : undefined,
      tags: esTransferencia
        ? ['transferencia']
        : val('#ef-tags')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
      escenarioIds: [...content.querySelectorAll<HTMLInputElement>('.ef-escenario:checked')].map((i) => i.value),
      repartoConsumo: esTransferencia ? undefined : leerRepartoWidget(content, 'consumo'),
      repartoPago: esTransferencia ? undefined : leerRepartoWidget(content, 'pago'),
    };

    if (id) {
      deps.store.updateItem('expenses', id, datos);
      toast('Actualizado');
    } else {
      deps.store.addItem('expenses', datos);
      toast('Creado');
    }
    notificar();
    return true;
  }

  // ── Cableado ────────────────────────────────────────────────────────────────

  function wire(container: HTMLElement, refrescar: () => void): void {
    const buscar = container.querySelector<HTMLInputElement>('[data-busqueda]');
    let debounce: ReturnType<typeof setTimeout> | undefined;
    buscar?.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        estado.busqueda = buscar.value;
        refrescar();
        // Devolver el foco: el re-render sustituye el input bajo el cursor
        const nuevo = container.querySelector<HTMLInputElement>('[data-busqueda]');
        nuevo?.focus();
        nuevo?.setSelectionRange(nuevo.value.length, nuevo.value.length);
      }, 250);
    });

    onChange(container, '[data-expirados]', (el) => {
      estado.mostrarExpirados = (el as HTMLInputElement).checked;
      refrescar();
    });
    onChange(container, '[data-f-tipo]', (el) => {
      estado.tipo = (el as HTMLSelectElement).value as EstadoVista['tipo'];
      refrescar();
    });
    onChange(container, '[data-f-cuenta]', (el) => {
      estado.cuenta = (el as HTMLSelectElement).value;
      refrescar();
    });
    onChange(container, '[data-f-desde]', (el) => {
      estado.desde = (el as HTMLInputElement).value;
      refrescar();
    });
    onChange(container, '[data-f-hasta]', (el) => {
      estado.hasta = (el as HTMLInputElement).value;
      refrescar();
    });
    onClick(container, '[data-limpiar]', () => {
      estado.tipo = '';
      estado.cuenta = '';
      estado.desde = '';
      estado.hasta = '';
      estado.busqueda = '';
      estado.tags = new Set();
      refrescar();
    });
    onClick(container, '[data-limpiar-tags]', () => {
      estado.tags = new Set();
      refrescar();
    });
    onClick(container, '[data-tag]', (el) => {
      const tag = el.getAttribute('data-tag') as string;
      if (estado.tags.has(tag)) estado.tags.delete(tag);
      else estado.tags.add(tag);
      refrescar();
    });
    onClick(container, '[data-orden]', (el) => {
      const clave = el.getAttribute('data-orden') as ClaveOrden;
      if (estado.orden === clave) estado.sentido = estado.sentido === 1 ? -1 : 1;
      else {
        estado.orden = clave;
        estado.sentido = 1;
      }
      refrescar();
    });

    onClick(container, '[data-nuevo]', () => abrirFormulario(null, 'Nuevo gasto/ingreso', refrescar));
    onClick(container, '[data-editar]', (el) => {
      const exp = deps.store.get('expenses').find((e) => e._id === el.getAttribute('data-editar'));
      if (exp) abrirFormulario(exp, 'Editar', refrescar);
    });
    onClick(container, '[data-duplicar]', (el) => {
      const exp = deps.store.get('expenses').find((e) => e._id === el.getAttribute('data-duplicar'));
      if (!exp) return;
      // Sin _id: el formulario lo tratará como alta
      const { _id: _descartado, ...resto } = exp;
      abrirFormulario({ ...resto, concepto: `${exp.concepto} (copia)` }, 'Duplicar movimiento', refrescar);
    });
    onClick(container, '[data-borrar]', (el) => {
      if (!confirmar('¿Eliminar?')) return;
      deps.store.removeItem('expenses', el.getAttribute('data-borrar') as string);
      toast('Eliminado');
      notificar();
      refrescar();
    });
    onChange(container, '[data-activo]', (el) => {
      const input = el as HTMLInputElement;
      deps.store.updateItem('expenses', input.getAttribute('data-activo') as string, { activo: input.checked });
      notificar();
      refrescar();
    });
  }

  return {
    id: 'expenses',
    route: 'expenses',
    nombre: 'Gastos e Ingresos',
    flagId: 'expenses',
    seccion: 1, // "Mi dinero"
    iconoPath: ICONO,
    mount(container: HTMLElement) {
      const refrescar = () => render(container);
      render(container);
      // Un solo cableado por montaje: los handlers van por delegación, así que
      // sobreviven a los re-render del contenido.
      if (container.dataset.wired !== '1') {
        wire(container, refrescar);
        container.dataset.wired = '1';
      }
    },
  };
}
