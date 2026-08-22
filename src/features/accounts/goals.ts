// ── features/accounts/goals ───────────────────────────────────────────────────
// Objetivos de ahorro (port de `goals/goals.js`). Se pintan como una sección
// dentro de la vista de cuentas, igual que en el legacy, y su feature flag
// (`goals`) depende de `accounts`.
//
// La aritmética (saldo del objetivo y proyección de cumplimiento) vive en
// `core/goals`, con tests; aquí solo queda presentación y cableado.

import { formatEUR } from '@/core/money';
import { parseLocalDate, type ISODate } from '@/core/dates';
import { proyectarFechaCumplimiento, saldoParaObjetivo, type EventoSaldo } from '@/core/goals';
import type { Account, Goal } from '@/state/schema';
import { confirmar, esc, onClick, toast } from '../accounting/dom';

export interface GoalsStoreLike {
  get(key: 'goals'): Goal[];
  get(key: 'accounts'): Account[];
  addItem(col: 'goals', item: Omit<Goal, '_id'> & { _id?: string }): Goal;
  updateItem(col: 'goals', id: string, patch: Partial<Goal>): void;
  removeItem(col: 'goals', id: string): void;
}

export interface GoalsSectionDeps {
  store: GoalsStoreLike;
  /** Colchón económico aplicable a una fecha. */
  colchonEnFecha: (fecha: ISODate) => number;
  /** Extracto proyectado de una cuenta desde hoy hasta el horizonte. */
  extractoCuenta: (acc: Account) => EventoSaldo[];
  hoy: () => ISODate;
  onDatosCambiados: () => void;
}

const COLORES = ['#2ee6a8', '#4d9fff', '#ffb020', '#ff6b6b', '#a855f7', '#fb923c'];

const ICONO_EDITAR =
  'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z';

export function createGoalsSection(deps: GoalsSectionDeps) {
  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrarModal = () => overlay()?.classList.add('hidden');

  function tarjeta(g: Goal, idx: number, accounts: Account[], colchonHoy: number): string {
    const saldo = saldoParaObjetivo(g, accounts, colchonHoy);
    const objetivo = g.targetAmount || 0;
    const progreso = objetivo > 0 ? Math.min(100, (saldo / objetivo) * 100) : 0;
    const alcanzado = !g.completado && objetivo > 0 && saldo >= objetivo;

    // Meses hasta la fecha límite; null si el objetivo no tiene fecha
    const mesesRestantes = g.targetDate
      ? Math.max(0, Math.round((parseLocalDate(g.targetDate).getTime() - parseLocalDate(deps.hoy()).getTime()) / (30.44 * 86400000)))
      : null;
    const ahorroNecesario = mesesRestantes !== null && mesesRestantes > 0 ? Math.max(0, objetivo - saldo) / mesesRestantes : null;

    const fechaEstimada =
      !g.completado && !alcanzado
        ? proyectarFechaCumplimiento(g, accounts, {
            extractoCuenta: deps.extractoCuenta,
            colchonEnFecha: deps.colchonEnFecha,
            hoy: parseLocalDate(deps.hoy()),
          })
        : null;

    const nombresCuentas =
      (g.cuentaIds || []).length > 0
        ? (g.cuentaIds || []).map((id) => accounts.find((a) => a._id === id)?.nombre ?? id).join(', ')
        : 'Todas las cuentas activas';

    const insignias = [
      g.completado ? '<span class="badge badge-active">✓ Completado</span>' : '',
      alcanzado ? '<span class="badge" style="background:rgba(46,230,168,0.2);color:var(--accent)">🎉 ¡Meta alcanzada!</span>' : '',
      g.usarColchon !== false ? '<span class="badge badge-inactive" title="Colchón descontado del saldo">🛡 −colchón</span>' : '',
    ].join('');

    const colorProgreso = progreso >= 100 ? 'var(--accent)' : progreso >= 70 ? 'var(--yellow)' : 'var(--text2)';
    const clases = ['card mb-8', g.completado ? 'goal-completado' : '', alcanzado ? 'goal-alcanzado' : ''].filter(Boolean).join(' ');

    const pies = [
      ahorroNecesario !== null ? `<span>Necesitas ${esc(formatEUR(ahorroNecesario))}/mes</span>` : '',
      g.targetDate ? `<span>Meta fijada: ${esc(g.targetDate)}</span>` : '',
      fechaEstimada
        ? `<span style="color:var(--accent)">📈 Estimado: ${esc(fechaEstimada)}</span>`
        : !g.completado && !alcanzado
          ? '<span style="color:var(--text3)">Sin proyección</span>'
          : '',
      g.usarColchon !== false ? `<span>Colchón: ${esc(formatEUR(colchonHoy))}</span>` : '',
      `<span>Cuentas: ${esc(nombresCuentas)}</span>`,
    ].join('');

    return `<div class="${clases}" style="padding:14px;border:1px solid ${alcanzado ? 'var(--accent)' : 'var(--border)'}">
      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-8 items-center flex-wrap">
          <span class="goal-priority-badge">#${esc(g.prioridad || idx + 1)}</span>
          <span style="font-weight:600;font-size:14px${g.completado ? ';text-decoration:line-through;color:var(--text3)' : ''}">${esc(g.nombre)}</span>
          ${insignias}
        </div>
        <div class="flex gap-8">
          ${alcanzado ? `<button class="btn-primary btn-sm" data-completar-goal="${esc(g._id)}">Marcar completado</button>` : ''}
          <button class="btn-icon" data-editar-goal="${esc(g._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${ICONO_EDITAR}"/></svg></button>
          <button class="btn-danger btn-sm" data-borrar-goal="${esc(g._id)}">✕</button>
        </div>
      </div>
      <div class="flex justify-between mb-4">
        <span class="text-sm">${esc(formatEUR(saldo))} / ${esc(formatEUR(objetivo))}</span>
        <span class="text-sm" style="color:${colorProgreso}">${progreso.toFixed(0)}%${mesesRestantes !== null ? ` · ${mesesRestantes}m restantes` : ''}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${progreso}%;background:${esc(g.color || 'var(--accent)')}"></div></div>
      <div class="flex gap-12 mt-8 flex-wrap" style="font-size:11px;color:var(--text3)">${pies}</div>
    </div>`;
  }

  function render(container: HTMLElement): void {
    const goals = [...deps.store.get('goals')].sort((a, b) => (a.prioridad || 99) - (b.prioridad || 99));
    const accounts = deps.store.get('accounts');
    const colchonHoy = deps.colchonEnFecha(deps.hoy());

    container.innerHTML = `
      <div class="flex justify-between items-center mb-12">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro</div>
        <button class="btn-primary btn-sm" data-nuevo-goal>+ Objetivo</button>
      </div>
      ${
        goals.length === 0
          ? '<div class="text-sm" style="color:var(--text3)">Sin objetivos. Define metas de ahorro para seguirlas aquí y en el Dashboard.</div>'
          : goals.map((g, i) => tarjeta(g, i, accounts, colchonHoy)).join('')
      }`;
  }

  // ── Formulario ──────────────────────────────────────────────────────────────

  function formulario(g: Goal | null): string {
    const accounts = deps.store.get('accounts').filter((a) => a.activo && !a.simulacion);
    const goals = deps.store.get('goals');
    const prioridad = g ? g.prioridad || 1 : Math.max(0, ...goals.map((x) => x.prioridad || 0)) + 1;
    const color = g?.color || COLORES[0];

    const cuentas = accounts
      .map(
        (a) => `<label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
          <input type="checkbox" class="goal-acc-check" value="${esc(a._id)}"${(g?.cuentaIds || []).includes(a._id) ? ' checked' : ''}/>
          ${esc(a.nombre)}
        </label>`,
      )
      .join('');

    return `
      <div class="form-group"><label class="form-label">Nombre del objetivo</label>
        <input class="form-input" type="text" id="goal-nombre" value="${esc(g?.nombre ?? '')}" placeholder="Ej: Fondo de emergencia"/></div>
      <div class="grid-2 mt-8">
        <div class="form-group"><label class="form-label">Importe objetivo (€)</label>
          <input class="form-input" type="number" id="goal-amount" value="${esc(g?.targetAmount ?? '')}" placeholder="10000"/></div>
        <div class="form-group"><label class="form-label">Fecha límite (opcional)</label>
          <input class="form-input" type="date" id="goal-date" value="${esc(g?.targetDate ?? '')}"/></div>
      </div>

      <details class="form-advanced mt-12"${g ? ' open' : ''}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="form-group mt-8"><label class="form-label">Prioridad (1 = mayor)</label>
            <input class="form-input" type="number" id="goal-prio" value="${esc(prioridad)}" placeholder="1"/></div>
          <div class="form-group mt-8">
            <label class="form-label">Cuentas a considerar (vacío = todas las activas)</label>
            <div style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--bg3);border-radius:var(--radius)">
              ${cuentas || '<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
            </div>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Descontar colchón económico</label>
            <label class="toggle"><input type="checkbox" id="goal-colchon"${g?.usarColchon !== false ? ' checked' : ''}/><span class="toggle-slider"></span></label>
            <span class="text-sm" style="margin-left:6px;color:var(--text3)">Muestra el excedente sobre el mínimo de seguridad</span>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Marcar como completado</label>
            <label class="toggle"><input type="checkbox" id="goal-completado"${g?.completado ? ' checked' : ''}/><span class="toggle-slider"></span></label>
          </div>
          <div class="form-group mt-8"><label class="form-label">Color</label>
            <select class="form-select" id="goal-color">
              ${COLORES.map((c) => `<option value="${c}"${c === color ? ' selected' : ''}>${c}</option>`).join('')}
            </select></div>
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-goal="${esc(g?._id ?? '')}">Guardar</button>
      </div>`;
  }

  function abrirFormulario(id: string | null, refrescar: () => void): void {
    const g = id ? (deps.store.get('goals').find((x) => x._id === id) ?? null) : null;
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return;
    el.innerHTML = `<div class="modal-title">${id ? 'Editar objetivo' : 'Nuevo objetivo'}</div>${formulario(g)}`;
    ov.classList.remove('hidden');
    onClick(el, '[data-cancelar]', cerrarModal);

    onClick(el, '[data-guardar-goal]', (btn) => {
      const val = (sel: string) => (el.querySelector(sel) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
      const nombre = val('#goal-nombre').trim();
      if (!nombre) return toast('Nombre obligatorio', 'err');

      // El toggle del colchón viene marcado por defecto: solo desmarcarlo lo apaga
      const datos: Omit<Goal, '_id'> = {
        nombre,
        targetAmount: parseFloat(val('#goal-amount')) || 0,
        targetDate: val('#goal-date') || null,
        prioridad: parseInt(val('#goal-prio'), 10) || 1,
        color: val('#goal-color') || COLORES[0],
        usarColchon: !!(el.querySelector('#goal-colchon') as HTMLInputElement | null)?.checked,
        completado: !!(el.querySelector('#goal-completado') as HTMLInputElement | null)?.checked,
        cuentaIds: [...el.querySelectorAll<HTMLInputElement>('.goal-acc-check:checked')].map((i) => i.value),
      };

      const editId = btn.getAttribute('data-guardar-goal') || '';
      if (editId) {
        deps.store.updateItem('goals', editId, datos);
        toast('Actualizado');
      } else {
        deps.store.addItem('goals', datos);
        toast('Objetivo creado');
      }
      deps.onDatosCambiados();
      cerrarModal();
      refrescar();
    });
  }

  /** Cablea la sección. `refrescar` re-pinta la vista de cuentas completa. */
  function wire(container: HTMLElement, refrescar: () => void): void {
    onClick(container, '[data-nuevo-goal]', () => abrirFormulario(null, refrescar));
    onClick(container, '[data-editar-goal]', (el) => abrirFormulario(el.getAttribute('data-editar-goal'), refrescar));
    onClick(container, '[data-borrar-goal]', (el) => {
      if (!confirmar('¿Eliminar objetivo?')) return;
      deps.store.removeItem('goals', el.getAttribute('data-borrar-goal') as string);
      toast('Objetivo eliminado');
      deps.onDatosCambiados();
      refrescar();
    });
    onClick(container, '[data-completar-goal]', (el) => {
      deps.store.updateItem('goals', el.getAttribute('data-completar-goal') as string, { completado: true });
      toast('Objetivo marcado como completado ✓');
      deps.onDatosCambiados();
      refrescar();
    });
  }

  return { render, wire };
}
