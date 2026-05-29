import { BaseComponent } from '@/core/BaseComponent';
import { appStore, upsertExpense } from '@/core/store';
import { calculateBudgetProgress } from '@/finance-math/finance-math';
import type { Expense, TipoMovimiento, BudgetProgress, ClasificacionGasto } from '@/types/domain';

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const FREQ_LABEL: Record<string, string> = {
  mensual: 'mensual',
  diaria: 'diaria',
  extraordinario: 'única vez',
};

const TYPE_LABEL: Record<TipoMovimiento, string> = {
  gasto: 'Gasto',
  ingreso: 'Ingreso',
  transferencia: 'Transferencia',
};

const TYPE_COLOR: Record<TipoMovimiento, string> = {
  gasto: 'var(--accent-red)',
  ingreso: 'var(--accent-green)',
  transferencia: 'var(--accent-blue)',
};

export class ExpenseListView extends BaseComponent {
  private _openMenuId: string | null = null;

  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
    this.on('click', (e: MouseEvent) => this._handleClick(e));
  }

  private _handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    // Classification button inside the context menu
    const classBtn = target.closest<HTMLElement>('[data-classify]');
    if (classBtn) {
      e.stopPropagation();
      const id = classBtn.dataset.expId!;
      const raw = classBtn.dataset.classify!;
      const clasificacion: ClasificacionGasto =
        raw === 'necesidad' ? 'necesidad' : raw === 'deseo' ? 'deseo' : null;
      const exp = appStore.getState().expenses.find((ex) => ex._id === id);
      if (exp) {
        upsertExpense({ ...exp, clasificacion });
        this._openMenuId = null;
        // store update triggers invalidate() via subscription
      }
      return;
    }

    // Menu toggle button (⋮)
    const toggleBtn = target.closest<HTMLElement>('[data-menu-toggle]');
    if (toggleBtn) {
      e.stopPropagation();
      const id = toggleBtn.dataset.menuToggle!;
      this._openMenuId = this._openMenuId === id ? null : id;
      this.invalidate();
      return;
    }

    // Click outside any open menu → close
    if (this._openMenuId !== null && !target.closest('[data-exp-menu]')) {
      this._openMenuId = null;
      this.invalidate();
    }
  }

  protected template(): string {
    const { expenses, accounts, config } = appStore.getState();
    const accountName = (id: string) => accounts.find((a) => a._id === id)?.nombre ?? id;

    if (expenses.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">💸</div>
          <h1 class="wip-card__title">Sin movimientos registrados</h1>
          <p class="wip-card__desc">Registra tus ingresos, gastos y transferencias recurrentes para proyectar tu flujo de caja.</p>
        </div>`;
    }

    const budgetProgress = calculateBudgetProgress(expenses, config);

    const active = expenses.filter((e) => e.activo);
    const inactive = expenses.filter((e) => !e.activo);

    const byType = (tipo: TipoMovimiento) => active.filter((e) => e.tipo === tipo);
    const incomes = byType('ingreso');
    const gastos = byType('gasto');
    const transfers = byType('transferencia');

    const monthlyIncome = incomes
      .filter((e) => e.tipoFrecuencia === 'mensual')
      .reduce((s, e) => s + e.cuantia, 0);
    const monthlyExpense = gastos
      .filter((e) => e.tipoFrecuencia === 'mensual')
      .reduce((s, e) => s + e.cuantia, 0);

    return `
      <div class="expenses">
        <h1 class="view-title">Gastos e Ingresos</h1>

        <div class="exp-summary">
          <div class="exp-summary__item">
            <span class="exp-summary__label">Ingresos recurrentes</span>
            <span class="exp-summary__value exp-summary__value--green">${eur(monthlyIncome)}/mes</span>
          </div>
          <div class="exp-summary__item">
            <span class="exp-summary__label">Gastos recurrentes</span>
            <span class="exp-summary__value exp-summary__value--red">${eur(monthlyExpense)}/mes</span>
          </div>
          <div class="exp-summary__item">
            <span class="exp-summary__label">Balance mensual</span>
            <span class="exp-summary__value ${monthlyIncome - monthlyExpense >= 0 ? 'exp-summary__value--green' : 'exp-summary__value--red'}">${eur(monthlyIncome - monthlyExpense)}/mes</span>
          </div>
        </div>

        ${budgetProgress.length > 0 ? this._budgets(budgetProgress) : ''}

        ${incomes.length > 0 ? this._group('Ingresos', incomes, accountName) : ''}
        ${gastos.length > 0 ? this._group('Gastos', gastos, accountName) : ''}
        ${transfers.length > 0 ? this._group('Transferencias', transfers, accountName) : ''}
        ${inactive.length > 0 ? this._group('Inactivos', inactive, accountName, true) : ''}
      </div>`;
  }

  private _budgets(items: BudgetProgress[]): string {
    const rows = items
      .map((b) => {
        const tagLabel =
          b.tag === '*' ? 'Total gastos' : b.tag === '__sin_tag__' ? 'Sin categoría' : b.tag;
        const barColor =
          b.estado === 'exceeded'
            ? 'var(--accent-red)'
            : b.estado === 'warning'
              ? 'var(--accent-yellow)'
              : 'var(--accent-green)';
        const width = Math.min(b.pct, 100).toFixed(1);
        const alertBadge = b.alertar ? '<span class="exp-badge exp-badge--alert">⚠</span>' : '';
        return `
          <div class="budget-row">
            <div class="budget-row__top">
              <span class="budget-row__tag">${tagLabel}${alertBadge}</span>
              <span class="budget-row__amounts">${eur(b.gasto)} / ${eur(b.limite)}</span>
            </div>
            <div class="budget-row__bar">
              <div class="budget-row__fill" style="width:${width}%;background:${barColor}"></div>
            </div>
            <div class="budget-row__pct" style="color:${barColor}">${b.pct.toFixed(0)}%</div>
          </div>`;
      })
      .join('');

    return `
      <section class="budget-section">
        <h2 class="exp-group__title">Presupuestos <span class="exp-group__count">${items.length}</span></h2>
        <div class="budget-list">${rows}</div>
      </section>`;
  }

  private _group(
    title: string,
    list: Expense[],
    accountName: (id: string) => string,
    muted = false
  ): string {
    return `
      <section class="exp-group${muted ? ' exp-group--muted' : ''}">
        <h2 class="exp-group__title">${title} <span class="exp-group__count">${list.length}</span></h2>
        <div class="exp-table">
          ${list.map((e) => this._entry(e, accountName)).join('')}
        </div>
      </section>`;
  }

  private _entry(exp: Expense, accountName: (id: string) => string): string {
    const isOpen = this._openMenuId === exp._id;
    return `
      <div class="exp-entry${isOpen ? ' exp-entry--open' : ''}">
        ${this._row(exp, accountName)}
        ${isOpen ? this._menu(exp) : ''}
      </div>`;
  }

  private _row(exp: Expense, accountName: (id: string) => string): string {
    const color = TYPE_COLOR[exp.tipo];
    const freqLabel = FREQ_LABEL[exp.tipoFrecuencia] ?? exp.tipoFrecuencia;
    const freqN = exp.frecuencia > 1 ? ` · cada ${exp.frecuencia}` : '';
    const tags = exp.tags?.length
      ? exp.tags.map((t) => `<span class="exp-tag">${t}</span>`).join('')
      : '';
    const basicBadge = exp.basico ? '<span class="exp-badge exp-badge--basic">básico</span>' : '';
    const irpfBadge = exp.sujetoIRPF ? '<span class="exp-badge exp-badge--irpf">IRPF</span>' : '';
    const clasificacionBadge =
      exp.tipo === 'gasto'
        ? exp.clasificacion === 'necesidad'
          ? '<span class="exp-badge exp-badge--necesidad">necesidad</span>'
          : exp.clasificacion === 'deseo'
            ? '<span class="exp-badge exp-badge--deseo">deseo</span>'
            : '<span class="exp-badge exp-badge--sin-clasificar">sin clasificar</span>'
        : '';
    const menuBtn =
      exp.tipo === 'gasto'
        ? `<button class="exp-row__menu-btn" data-menu-toggle="${exp._id}" aria-label="Opciones de clasificación">⋮</button>`
        : '';

    return `
      <div class="exp-row">
        <div class="exp-row__type" style="background:${color}20;color:${color}">
          ${TYPE_LABEL[exp.tipo]}
        </div>
        <div class="exp-row__body">
          <div class="exp-row__top">
            <span class="exp-row__name">${exp.concepto}</span>
            <span class="exp-row__amount" style="color:${color}">${eur(exp.cuantia)}</span>
          </div>
          <div class="exp-row__meta">
            <span class="exp-row__freq">${freqLabel}${freqN}</span>
            <span class="exp-row__account">${accountName(exp.cuenta)}</span>
            ${basicBadge}${irpfBadge}${clasificacionBadge}${tags}
          </div>
        </div>
        ${menuBtn}
      </div>`;
  }

  private _menu(exp: Expense): string {
    const c = exp.clasificacion;
    return `
      <div class="exp-menu" data-exp-menu>
        <span class="exp-menu__label">Clasificar como</span>
        <div class="exp-menu__actions">
          <button class="exp-menu__btn${c === 'necesidad' ? ' exp-menu__btn--active exp-menu__btn--necesidad' : ''}"
            data-classify="necesidad" data-exp-id="${exp._id}">Necesidad</button>
          <button class="exp-menu__btn${c === 'deseo' ? ' exp-menu__btn--active exp-menu__btn--deseo' : ''}"
            data-classify="deseo" data-exp-id="${exp._id}">Deseo</button>
          <button class="exp-menu__btn${!c ? ' exp-menu__btn--active' : ''}"
            data-classify="" data-exp-id="${exp._id}">Sin clasificar</button>
        </div>
      </div>`;
  }
}

customElements.define('fin-expense-list', ExpenseListView);
