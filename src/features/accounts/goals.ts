// ── features/accounts/goals ───────────────────────────────────────────────────
// Puente hacia «Objetivos financieros».
//
// Aquí vivía un editor de objetivos de ahorro (`goals`). Desde que existe el
// planificador había DOS entidades llamadas «objetivo» y dos sitios para
// editarlas: `goals` seguía el saldo real de unas cuentas y `Objetivo` compite
// por el flujo mensual. Números distintos, mismo nombre, y el usuario viéndolos
// en dos pantallas (ver docs/05-revision-producto.md §2).
//
// La migración 008 ya copió cada goal al planificador y NO borró el original, a
// propósito. Este módulo pasa a ser lo que faltaba: un aviso que enseña lo que
// queda de la colección vieja y lleva a donde se gestiona ahora.
//
// La aritmética sigue en `core/goals` (con tests) y la usa el mismo puente para
// enseñar el progreso, sin permitir edición.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import { saldoParaObjetivo, type EventoSaldo } from '@/core/goals';
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
  /** Navegación a otra vista. Inyectable para los tests. */
  navegar?: (ruta: string) => void;
}

export function createGoalsSection(deps: GoalsSectionDeps) {
  function irAlPlanificador(): void {
    if (deps.navegar) return deps.navegar('planner');
    const router = (globalThis as { Router?: { navigate: (v: string) => void } }).Router;
    router?.navigate('planner');
  }

  function fila(g: Goal, accounts: Account[], colchonHoy: number): string {
    const saldo = saldoParaObjetivo(g, accounts, colchonHoy);
    const objetivo = g.targetAmount || 0;
    const progreso = objetivo > 0 ? Math.min(100, (saldo / objetivo) * 100) : 0;
    return `
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${esc(g.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${esc(formatEUR(saldo))} / ${esc(formatEUR(objetivo))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${progreso}%;background:${esc(g.color || 'var(--accent)')}"></div></div>
      </div>`;
  }

  function render(container: HTMLElement): void {
    const goals = deps.store.get('goals');

    if (goals.length === 0) {
      // Sin datos viejos no hay nada que explicar: el sitio de los objetivos es
      // el planificador y punto.
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = '';
    const accounts = deps.store.get('accounts');
    const colchonHoy = deps.colchonEnFecha(deps.hoy());
    const ordenados = [...goals].sort((a, b) => (a.prioridad || 99) - (b.prioridad || 99));

    container.innerHTML = `
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${ordenados.map((g) => fila(g, accounts, colchonHoy)).join('')}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`;
  }

  function wire(container: HTMLElement, refrescar: () => void): void {
    onClick(container, '[data-ir-planner]', () => irAlPlanificador());

    onClick(container, '[data-descartar-goals]', () => {
      const n = deps.store.get('goals').length;
      // `confirmar` es SÍNCRONA: con `await` el borrado se aplazaba a un
      // microtask y el clic volvía antes de haber borrado nada.
      if (!confirmar(`Se van a borrar ${n} objetivo${n !== 1 ? 's' : ''} de ahorro antiguos. ¿Seguro?`)) return;
      for (const g of [...deps.store.get('goals')]) deps.store.removeItem('goals', g._id);
      toast('Objetivos antiguos descartados');
      deps.onDatosCambiados();
      refrescar();
    });
  }

  return { render, wire };
}
