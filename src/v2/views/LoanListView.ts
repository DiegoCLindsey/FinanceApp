import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import { calculateLoanSchedule, loanSummary } from '@/finance-math/finance-math';
import type { Loan } from '@/types/domain';

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const pct = (n: number) => `${n.toFixed(2)} %`;

const fmtDate = (iso: string) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export class LoanListView extends BaseComponent {
  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
  }

  protected template(): string {
    const { loans } = appStore.getState();
    const active = loans.filter((l) => l.activo && !l.simulacion);
    const sims = loans.filter((l) => l.simulacion);

    if (loans.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">🏦</div>
          <h1 class="wip-card__title">Sin préstamos registrados</h1>
          <p class="wip-card__desc">Tus préstamos hipotecarios, personales y de consumo aparecerán aquí.</p>
        </div>`;
    }

    const today = new Date().toISOString().slice(0, 10);

    return `
      <div class="loans">
        <h1 class="view-title">Préstamos</h1>

        ${active.length > 0 ? this._section('Activos', active, today) : ''}
        ${sims.length > 0 ? this._section('Simulaciones', sims, today) : ''}
      </div>`;
  }

  private _section(title: string, list: Loan[], today: string): string {
    return `
      <section class="loan-section">
        <h2 class="loan-section__title">${title}</h2>
        <div class="loan-cards">
          ${list.map((l) => this._card(l, today)).join('')}
        </div>
      </section>`;
  }

  private _card(loan: Loan, today: string): string {
    const s = loanSummary(loan);
    const schedule = calculateLoanSchedule(loan);
    const paid = schedule.filter((r) => !r.esAmortizacion && r.fecha <= today);
    const remaining = schedule.filter((r) => !r.esAmortizacion && r.fecha > today);
    const currentPrincipal =
      paid.length > 0 ? paid[paid.length - 1].capitalPendiente : loan.capital;

    const progressPct =
      loan.capital > 0
        ? (((loan.capital - currentPrincipal) / loan.capital) * 100).toFixed(1)
        : '0';

    const progressColor =
      parseFloat(progressPct) >= 75
        ? 'var(--accent-green)'
        : parseFloat(progressPct) >= 40
          ? 'var(--accent-blue)'
          : 'var(--accent-yellow)';

    return `
      <div class="loan-card${loan.simulacion ? ' loan-card--sim' : ''}">
        <div class="loan-card__header">
          <div>
            <div class="loan-card__name">${loan.nombre}</div>
            <div class="loan-card__meta">
              TIN ${pct(loan.tin)} · TAE ${pct(s.tae)} · ${loan.meses} meses
            </div>
          </div>
          <div class="loan-card__cuota">
            <div class="loan-card__cuota-value">${eur(s.cuotaMensual)}</div>
            <div class="loan-card__cuota-label">/mes</div>
          </div>
        </div>

        <div class="loan-card__progress">
          <div class="loan-card__progress-bar">
            <div class="loan-card__progress-fill"
              style="width:${progressPct}%;background:${progressColor}"></div>
          </div>
          <div class="loan-card__progress-labels">
            <span>Pagado ${progressPct}%</span>
            <span>${remaining.length} cuotas restantes</span>
          </div>
        </div>

        <div class="loan-card__stats">
          <div class="loan-card__stat">
            <span class="loan-card__stat-label">Capital inicial</span>
            <span class="loan-card__stat-value">${eur(loan.capital)}</span>
          </div>
          <div class="loan-card__stat">
            <span class="loan-card__stat-label">Pendiente</span>
            <span class="loan-card__stat-value">${eur(currentPrincipal)}</span>
          </div>
          <div class="loan-card__stat">
            <span class="loan-card__stat-label">Total intereses</span>
            <span class="loan-card__stat-value loan-card__stat-value--red">${eur(s.totalIntereses)}</span>
          </div>
          <div class="loan-card__stat">
            <span class="loan-card__stat-label">Fin previsto</span>
            <span class="loan-card__stat-value">${fmtDate(s.fechaFin)}</span>
          </div>
        </div>

        ${
          loan.amortizaciones.length > 0
            ? `<div class="loan-card__amorts">
            ${loan.amortizaciones.length} amortización${loan.amortizaciones.length !== 1 ? 'es' : ''} anticipada${loan.amortizaciones.length !== 1 ? 's' : ''} registrada${loan.amortizaciones.length !== 1 ? 's' : ''}
          </div>`
            : ''
        }
      </div>`;
  }
}

customElements.define('fin-loan-list', LoanListView);
