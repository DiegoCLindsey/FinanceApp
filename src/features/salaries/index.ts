// ── features/salaries ─────────────────────────────────────────────────────────
// Rendimientos del trabajo: nóminas (agrupadas por pagador) y planes de
// pensiones (F1, tarea 1.7 — port de `nominas/nominas.js`).
//
// Cambios respecto a la versión legacy, además del tipado:
//   · el IRPF de grupo sale de `core/tax/nomina-grupo`, donde está una sola vez
//     y con tests; en la vista estaba escrito tres veces, y una de las tres
//     (`irpfMarginal`) era código muerto que nadie llamaba;
//   · delegación de eventos en lugar de `onclick="NominasModule.x(...)"`;
//   · todo el texto del usuario se escapa antes de interpolarlo.

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import { crearResolverTramos } from '@/core/tax/tables';
import { TRAMOS_IRPF_DEFAULT, type Tramos } from '@/core/tax/irpf';
import { agruparNominas, desgloseNomina, irpfGrupo } from '@/core/tax/nomina-grupo';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Account, AppConfig, Escenario, Nomina, PeriodoInflacion, TablaFiscalAnual } from './store-tipos';
import { confirmar, esc, onChange, onClick, toast } from '../accounting/dom';
import { formularioNomina, leerFormulario, wireFormulario, type ComponenteFlex } from './form';
import { createTramosModal } from './tramos';
import {
  construirPension,
  esPlanPension,
  formularioPension,
  renderPensionesSection,
  wireFormularioPension,
  type AportacionPlan,
} from './pensions';

export interface SalariesStoreLike {
  get(key: 'nominas'): Nomina[];
  get(key: 'accounts'): Account[];
  get(key: 'escenarios'): Escenario[];
  get(key: 'inflacion'): PeriodoInflacion[];
  get(key: 'tramosIRPFHistorico'): TablaFiscalAnual[];
  get(key: 'config'): AppConfig;
  set(key: 'tramosIRPFHistorico', value: TablaFiscalAnual[]): void;
  patchConfig(patch: Partial<AppConfig>): void;
  addItem(col: 'nominas', item: Omit<Nomina, '_id'> & { _id?: string }): Nomina;
  updateItem(col: 'nominas', id: string, patch: Partial<Nomina>): void;
  removeItem(col: 'nominas', id: string): void;
  addItem(col: 'accounts', item: Omit<Account, '_id'> & { _id?: string }): Account;
  updateItem(col: 'accounts', id: string, patch: Partial<Account>): void;
  removeItem(col: 'accounts', id: string): void;
  getPrincipalAccountId(): string;
}

export interface SalariesViewDeps {
  store: SalariesStoreLike;
  onDatosCambiados?: () => void;
  /** Inyectable para que los tests no dependan del día en que se ejecutan. */
  hoy?: () => ISODate;
}

const ICONO =
  'M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z';

export function createSalariesFeature(deps: SalariesViewDeps): FeatureManifest {
  const hoy = deps.hoy ?? todayISO;
  const notificar = () => deps.onDatosCambiados?.();

  /** Tramos del ejercicio en curso, resolviendo el histórico. */
  function tramosDelAño(): Tramos {
    const cfg = deps.store.get('config');
    return crearResolverTramos(deps.store.get('tramosIRPFHistorico'), cfg.tramos_irpf ?? TRAMOS_IRPF_DEFAULT)(Number(hoy().slice(0, 4)));
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function filaNomina(n: Nomina, grupo: Nomina[] | null, tramos: Tramos): string {
    const d = desgloseNomina(n, grupo, tramos);
    const enGrupo = !!grupo && n.irpfModo !== 'manual';
    const badges = [
      n.mesActualizacionIPC
        ? `<span class="badge badge-blue" title="Actualización IPC en el mes ${n.mesActualizacionIPC}">IPC m${n.mesActualizacionIPC}</span>`
        : '',
      d.flexAnual > 0
        ? `<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${esc(formatEUR(d.flexAnual))}/año</span>`
        : '',
      Math.abs(d.ssPct - 6.35) > 0.01
        ? `<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${d.ssPct.toFixed(2)}%</span>`
        : '',
    ].join('');

    return `<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${esc(n.nombre || '—')}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${badges}</div>
      </div>
      <div class="num">${esc(formatEUR(d.brutoAnual))}
        ${d.flexAnual > 0 ? `<div class="text-sm" style="color:var(--accent)">Diner. ${esc(formatEUR(d.baseDineraria))}</div>` : ''}
        <div class="text-sm" style="color:var(--text2)">${esc(formatEUR(d.netoPorPaga))}/paga neto</div></div>
      <div class="text-sm">${d.nPagas} pagas</div>
      <div class="text-sm ${enGrupo ? 'neg' : ''}">${
        n.irpfModo === 'manual' ? `${esc(n.irpfPct ?? 0)}% (manual)` : `${d.irpfPct.toFixed(1)}% (auto)`
      }${enGrupo ? ' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>' : ''}</div>
      <div>${
        n.representacion === 'simplificado'
          ? '<span class="badge badge-orange">Simplificado</span>'
          : '<span class="badge badge-purple">Detallado</span>'
      }</div>
      <div class="text-sm exp-col-hide">${esc(nombreCuenta(n.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${esc(n._id)}"${n.activo !== false ? ' checked' : ''}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${esc(n._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${esc(n._id)}">✕</button>
      </div>
    </div>`;
  }

  const nombreCuenta = (id: string | undefined) =>
    deps.store.get('accounts').find((a) => a._id === (id || 'default'))?.nombre ?? (id || 'default');

  function bloqueGrupo(nombre: string, noms: Nomina[], tramos: Tramos): string {
    const totalBruto = noms.reduce((s, n) => s + (n.bruto || 0), 0);
    const total = irpfGrupo(noms, tramos);
    const pct = totalBruto > 0 ? (total / totalBruto) * 100 : 0;
    return `<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${esc(nombre)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${esc(formatEUR(totalBruto))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${pct.toFixed(1)}%</strong> (${esc(formatEUR(total))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${noms.map((n) => filaNomina(n, noms, tramos)).join('')}
      </div>
    </div>`;
  }

  function render(container: HTMLElement): void {
    const tramos = tramosDelAño();
    const nominas = [...deps.store.get('nominas')].sort((a, b) => (b.bruto || 0) - (a.bruto || 0));
    const { grupos, sueltas } = agruparNominas(nominas);
    const planes = deps.store.get('accounts').filter(esPlanPension);
    const activas = nominas.filter((n) => n.activo !== false);

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${
        deps.store.get('inflacion').length > 0
          ? `<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>`
          : ''
      }
      ${nominas.length === 0 ? '<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>' : ''}
      ${[...grupos.entries()].map(([nombre, noms]) => bloqueGrupo(nombre, noms, tramos)).join('')}
      ${
        sueltas.length > 0
          ? `<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${sueltas.map((n) => filaNomina(n, null, tramos)).join('')}
             </div>`
          : ''
      }

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${renderPensionesSection(planes, activas, tramos, hoy())}</div>`;
  }

  // ── Modales ─────────────────────────────────────────────────────────────────

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrarModal = () => overlay()?.classList.add('hidden');

  function abrirModal(titulo: string, html: string): HTMLElement | null {
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return null;
    el.innerHTML = `<div class="modal-title">${esc(titulo)}</div>${html}`;
    ov.classList.remove('hidden');
    onClick(el, '[data-cancelar]', cerrarModal);
    return el;
  }

  function abrirFormularioNomina(id: string | null, refrescar: () => void): void {
    const n = id ? (deps.store.get('nominas').find((x) => x._id === id) ?? null) : null;
    const flex: ComponenteFlex[] = [...((n?.retribucionFlexible as ComponenteFlex[]) ?? [])].map((c) => ({ ...c }));
    const depsForm = {
      accounts: deps.store.get('accounts'),
      escenarios: deps.store.get('escenarios'),
      nominas: deps.store.get('nominas'),
      cuentaPrincipal: deps.store.getPrincipalAccountId(),
      tramos: tramosDelAño(),
      hoy: hoy(),
    };
    const el = abrirModal(id ? 'Editar nómina' : 'Nueva nómina', formularioNomina(n, depsForm));
    if (!el) return;

    wireFormulario(el, flex, depsForm, id ?? '');
    onClick(el, '[data-guardar-nomina]', (btn) => {
      const datos = leerFormulario(el, flex);
      if (!datos.nombre || datos.bruto <= 0) return toast('Nombre y bruto anual son obligatorios', 'err');
      const editId = btn.getAttribute('data-guardar-nomina') || '';
      const completo = { ...datos, activo: true, tags: ['nomina'] };
      if (editId) {
        deps.store.updateItem('nominas', editId, completo as Partial<Nomina>);
        toast('Nómina actualizada');
      } else {
        deps.store.addItem('nominas', completo as Omit<Nomina, '_id'>);
        toast('Nómina creada');
      }
      notificar();
      cerrarModal();
      refrescar();
    });
  }

  function abrirFormularioPension(id: string | null, refrescar: () => void): void {
    const acc = id ? (deps.store.get('accounts').find((a) => a._id === id) ?? null) : null;
    const plan: AportacionPlan[] = [...((acc?.planAportaciones as AportacionPlan[]) ?? [])].map((p) => ({ ...p }));
    const el = abrirModal(
      id ? 'Editar plan de pensiones' : 'Nuevo plan de pensiones',
      formularioPension(acc, { nominas: deps.store.get('nominas'), escenarios: deps.store.get('escenarios'), hoy: hoy() }),
    );
    if (!el) return;

    wireFormularioPension(el, plan, hoy());
    onClick(el, '[data-guardar-pension]', (btn) => {
      const { datos, error } = construirPension(el, plan, acc, hoy());
      if (error) return toast(error, 'err');
      const editId = btn.getAttribute('data-guardar-pension') || '';
      if (editId) {
        deps.store.updateItem('accounts', editId, datos);
        toast('Plan actualizado');
      } else {
        deps.store.addItem('accounts', datos as Omit<Account, '_id'>);
        toast('Plan creado');
      }
      notificar();
      cerrarModal();
      refrescar();
    });
  }

  // ── Cableado ────────────────────────────────────────────────────────────────

  function wire(container: HTMLElement, refrescar: () => void, tramosModal: ReturnType<typeof createTramosModal>): void {
    onClick(container, '[data-nueva-nomina]', () => abrirFormularioNomina(null, refrescar));
    onClick(container, '[data-editar-nom]', (el) => abrirFormularioNomina(el.getAttribute('data-editar-nom'), refrescar));
    onClick(container, '[data-borrar-nom]', (el) => {
      if (!confirmar('¿Eliminar esta nómina?')) return;
      deps.store.removeItem('nominas', el.getAttribute('data-borrar-nom') as string);
      toast('Eliminada');
      notificar();
      refrescar();
    });
    onChange(container, '[data-activo-nom]', (el) => {
      const input = el as HTMLInputElement;
      deps.store.updateItem('nominas', input.getAttribute('data-activo-nom') as string, { activo: input.checked });
      notificar();
      refrescar();
    });

    onClick(container, '[data-tramos]', () => tramosModal.abrir());

    onClick(container, '[data-nueva-pension]', () => abrirFormularioPension(null, refrescar));
    onClick(container, '[data-editar-pension]', (el) => abrirFormularioPension(el.getAttribute('data-editar-pension'), refrescar));
    onClick(container, '[data-borrar-pension]', (el) => {
      if (!confirmar('¿Eliminar este plan de pensiones?')) return;
      deps.store.removeItem('accounts', el.getAttribute('data-borrar-pension') as string);
      toast('Plan eliminado');
      notificar();
      refrescar();
    });
  }

  let tramosModal: ReturnType<typeof createTramosModal> | null = null;

  return {
    id: 'nominas',
    route: 'nominas',
    nombre: 'Nóminas',
    flagId: 'nominas',
    seccion: 1, // "Mi dinero"
    iconoPath: ICONO,
    mount(container: HTMLElement) {
      const refrescar = () => render(container);
      tramosModal ??= createTramosModal({
        store: deps.store,
        onDatosCambiados: () => {
          notificar();
          refrescar();
        },
        año: () => Number(hoy().slice(0, 4)),
      });
      render(container);
      if (container.dataset.wired !== '1') {
        wire(container, refrescar, tramosModal);
        container.dataset.wired = '1';
      }
    },
  };
}
