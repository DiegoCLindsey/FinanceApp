import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import {
  generateStatement,
  calculateNetWorth,
  getCurrentBalance,
  calculateSafetyCushion,
  calculateFinancialScore,
  detectCriticalPoints,
} from '@/finance-math/finance-math';
import type { StatementEntry, CriticalPoint } from '@/types/domain';

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export class DashboardView extends BaseComponent {
  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
  }

  protected template(): string {
    const { loans, expenses, accounts, config } = appStore.getState();

    if (accounts.length === 0 && loans.length === 0 && expenses.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">👋</div>
          <h1 class="wip-card__title">Bienvenido a FinanceApp V2</h1>
          <p class="wip-card__desc">
            Añade préstamos, gastos o cuentas para ver tu dashboard financiero en tiempo real.
          </p>
        </div>`;
    }

    const statement = generateStatement(loans, expenses, accounts, config);
    const netWorth = calculateNetWorth(loans, accounts);
    const totalBalance = accounts
      .filter((a) => a.activo)
      .reduce((s, a) => s + getCurrentBalance(a), 0);
    const cushion = calculateSafetyCushion(expenses, config);
    const score = calculateFinancialScore(statement, loans, expenses, accounts, config);
    const criticals = detectCriticalPoints(statement, cushion);

    const today = new Date().toISOString().slice(0, 10);
    const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    const upcoming = statement.filter((e) => e.fecha >= today && e.fecha <= in30).slice(0, 10);

    const scoreColor =
      score.total >= 80
        ? 'var(--accent-green)'
        : score.total >= 60
          ? 'var(--accent-blue)'
          : score.total >= 40
            ? 'var(--accent-yellow)'
            : 'var(--accent-red)';

    return `
      <div class="db">
        <h1 class="db__title">Dashboard</h1>

        <div class="db__kpis">
          ${kpiCard('Patrimonio neto', eur(netWorth), netWorth >= 0 ? 'positive' : 'negative')}
          ${kpiCard('Saldo total', eur(totalBalance), 'neutral')}
          ${kpiCard('Colchón objetivo', eur(cushion), 'neutral')}
          <div class="kpi-card">
            <div class="kpi-card__label">Score financiero</div>
            <div class="kpi-card__value" style="color:${scoreColor}">${score.total}<span class="kpi-card__unit">/100</span></div>
            <div class="kpi-card__badge" style="color:${scoreColor}">${score.label}</div>
          </div>
        </div>

        ${score.ingresosMes > 0 ? scoreDetail(score) : ''}

        ${criticals.length > 0 ? criticalsSection(criticals) : ''}

        <div class="db__upcoming">
          <h2 class="db__section-title">Próximos 30 días</h2>
          ${
            upcoming.length > 0
              ? `<div class="db__events">${upcoming.map(eventRow).join('')}</div>`
              : '<p class="db__empty">No hay eventos en los próximos 30 días</p>'
          }
        </div>
      </div>`;
  }
}

// ── Pure template helpers ─────────────────────────────────────────────────────

function kpiCard(
  label: string,
  value: string,
  variant: 'positive' | 'negative' | 'neutral'
): string {
  return `
    <div class="kpi-card">
      <div class="kpi-card__label">${label}</div>
      <div class="kpi-card__value kpi-card__value--${variant}">${value}</div>
    </div>`;
}

function bar(label: string, pct: number, color: 'green' | 'yellow' | 'red'): string {
  const width = Math.min(100, Math.max(0, pct)).toFixed(1);
  return `
    <div class="db__score-bar">
      <span class="db__score-label">${label}</span>
      <div class="db__score-track">
        <div class="db__score-fill db__score-fill--${color}" style="width:${width}%"></div>
      </div>
      <span class="db__score-pct">${pct.toFixed(1)}%</span>
    </div>`;
}

function scoreDetail(score: ReturnType<typeof calculateFinancialScore>): string {
  const fijosColor =
    score.ratioGastosFijos > 60 ? 'red' : score.ratioGastosFijos > 40 ? 'yellow' : 'green';
  const ahorroColor = score.tasaAhorro >= 20 ? 'green' : score.tasaAhorro >= 5 ? 'yellow' : 'red';
  const deudaColor = score.ratioDeuda > 35 ? 'red' : score.ratioDeuda > 20 ? 'yellow' : 'green';

  return `
    <div class="db__score-detail">
      ${bar('Gastos fijos', score.ratioGastosFijos, fijosColor)}
      ${bar('Tasa de ahorro', score.tasaAhorro, ahorroColor)}
      ${bar('Ratio deuda', score.ratioDeuda, deudaColor)}
    </div>`;
}

function criticalsSection(pts: CriticalPoint[]): string {
  const items = pts
    .slice(0, 3)
    .map((c) => {
      const icon = c.tipo === 'recuperacion_colchon' ? '✅' : '⚠️';
      return `<div class="db__critical db__critical--${c.tipo}">
        <span class="db__critical-icon">${icon}</span>
        <span>${c.mensaje}</span>
      </div>`;
    })
    .join('');
  return `<div class="db__criticals">${items}</div>`;
}

function eventRow(ev: StatementEntry): string {
  const sign = ev.delta > 0 ? '+' : '';
  const cls = ev.delta > 0 ? 'positive' : 'negative';
  const eur2 = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
  return `
    <div class="ev-row">
      <span class="ev-row__date">${fmtDate(ev.fecha)}</span>
      <span class="ev-row__label">${ev.concepto}</span>
      <span class="ev-row__delta ev-row__delta--${cls}">${sign}${eur2(ev.delta)}</span>
      <span class="ev-row__balance">${eur2(ev.saldoAcum)}</span>
    </div>`;
}

customElements.define('fin-dashboard', DashboardView);
