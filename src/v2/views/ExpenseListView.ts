import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import type { Expense, TipoMovimiento } from '@/types/domain';

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
  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
  }

  protected template(): string {
    const { expenses, accounts } = appStore.getState();
    const accountName = (id: string) => accounts.find((a) => a._id === id)?.nombre ?? id;

    if (expenses.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">💸</div>
          <h1 class="wip-card__title">Sin movimientos registrados</h1>
          <p class="wip-card__desc">Registra tus ingresos, gastos y transferencias recurrentes para proyectar tu flujo de caja.</p>
        </div>`;
    }

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

        ${incomes.length > 0 ? this._group('Ingresos', incomes, accountName) : ''}
        ${gastos.length > 0 ? this._group('Gastos', gastos, accountName) : ''}
        ${transfers.length > 0 ? this._group('Transferencias', transfers, accountName) : ''}
        ${inactive.length > 0 ? this._group('Inactivos', inactive, accountName, true) : ''}
      </div>`;
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
          ${list.map((e) => this._row(e, accountName)).join('')}
        </div>
      </section>`;
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
            ${basicBadge}${irpfBadge}${tags}
          </div>
        </div>
      </div>`;
  }
}

customElements.define('fin-expense-list', ExpenseListView);
