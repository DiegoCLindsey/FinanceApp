import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import {
  generateStatement,
  calculateNetWorth,
  getCurrentBalance,
  calculateSafetyCushion,
  calculateFinancialScore,
  calculateEmergencyFundStatus,
  detectCriticalPoints,
} from '@/finance-math/finance-math';
import type {
  StatementEntry,
  CriticalPoint,
  FinancialScore,
  EmergencyFundStatus,
} from '@/types/domain';

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
    const ef = calculateEmergencyFundStatus(expenses, accounts, config);
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

        ${emergencyFundWidget(ef, config.colchonMeses ?? 6)}

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

type BarColor = 'green' | 'yellow' | 'red';

function metricBar(label: string, rawValue: string, score: number, benchmark: string): string {
  const color: BarColor = score >= 70 ? 'green' : score >= 40 ? 'yellow' : 'red';
  const dot = score >= 70 ? '🟢' : score >= 40 ? '🟡' : '🔴';
  const width = Math.min(100, Math.max(0, score)).toFixed(1);
  return `
    <div class="db__metric">
      <div class="db__metric-top">
        <span class="db__metric-label">${dot} ${label}</span>
        <span class="db__metric-value">${rawValue}</span>
      </div>
      <div class="db__score-track">
        <div class="db__score-fill db__score-fill--${color}" style="width:${width}%"></div>
      </div>
      <div class="db__metric-bench">${benchmark}</div>
    </div>`;
}

function scoreDetail(score: FinancialScore): string {
  const fijosRaw = `${score.ratioGastosFijos.toFixed(1)}% ingresos`;
  const fijoBench =
    score.ratioGastosFijos < 30
      ? '< 30% ideal'
      : score.ratioGastosFijos < 50
        ? '30–50% aceptable'
        : '> 50% alto';

  const ahorroRaw = `${score.tasaAhorro.toFixed(1)}% ingresos`;
  const ahorroBench =
    score.tasaAhorro >= 25
      ? '≥ 25% excelente'
      : score.tasaAhorro >= 10
        ? '10–25% recomendado'
        : '< 10% mejorable';

  const deudaRaw = `${score.ratioDeuda.toFixed(1)}% ingresos`;
  const deudaBench =
    score.ratioDeuda < 15
      ? '< 15% ideal'
      : score.ratioDeuda < 35
        ? '15–35% aceptable'
        : '> 35% alto';

  const fondoRaw = `${score.coberturaFondoEmergencia.toFixed(1)} meses`;
  const fondoBench =
    score.coberturaFondoEmergencia >= 6
      ? '≥ 6 meses ideal'
      : score.coberturaFondoEmergencia >= 3
        ? '3–6 meses aceptable'
        : '< 3 meses insuficiente';

  const liqRaw = `×${Math.min(score.ratioLiquidez, 99).toFixed(1)}`;
  const liqBench =
    score.ratioLiquidez >= 1.5
      ? '> 1.5 excelente'
      : score.ratioLiquidez >= 1
        ? '1–1.5 aceptable'
        : '< 1 riesgo';

  const tendRaw =
    score.tendenciaAhorro !== null
      ? `${score.tendenciaAhorro > 0 ? '+' : ''}${score.tendenciaAhorro.toFixed(1)}%`
      : '—';
  const tendBench =
    score.tendenciaAhorro === null
      ? 'sin datos'
      : score.tendenciaAhorro > 5
        ? 'mejorando'
        : score.tendenciaAhorro > -5
          ? 'estable'
          : 'empeorando';

  const divRaw = `${score.fuentesIngreso} fuente${score.fuentesIngreso !== 1 ? 's' : ''}`;
  const divBench =
    score.fuentesIngreso >= 3
      ? '≥ 3 diversificado'
      : score.fuentesIngreso === 2
        ? '2 aceptable'
        : '1 concentrado';

  const diagnosis = buildDiagnosis(score);

  return `
    <div class="db__score-detail">
      <h2 class="db__section-title">Análisis financiero</h2>
      <div class="db__metrics-grid">
        ${metricBar('Tasa de ahorro', ahorroRaw, score.scoreAhorro, ahorroBench)}
        ${metricBar('Fondo de emergencia', fondoRaw, score.scoreCoberturaFondo, fondoBench)}
        ${metricBar('Gastos fijos', fijosRaw, score.scoreFijos, fijoBench)}
        ${metricBar('Ratio de deuda', deudaRaw, score.scoreDeuda, deudaBench)}
        ${metricBar('Liquidez', liqRaw, score.scoreLiquidez, liqBench)}
        ${metricBar('Tendencia ahorro', tendRaw, score.scoreTendencia, tendBench)}
        ${metricBar('Diversificación', divRaw, score.scoreDiversificacion, divBench)}
      </div>
      ${diagnosis ? `<div class="db__diagnosis">${diagnosis}</div>` : ''}
    </div>`;
}

function buildDiagnosis(score: FinancialScore): string {
  const metrics = [
    { name: 'tasa de ahorro', s: score.scoreAhorro },
    { name: 'fondo de emergencia', s: score.scoreCoberturaFondo },
    { name: 'gastos fijos', s: score.scoreFijos },
    { name: 'ratio de deuda', s: score.scoreDeuda },
    { name: 'liquidez', s: score.scoreLiquidez },
  ];
  const weakest = metrics.sort((a, b) => a.s - b.s)[0];
  if (weakest.s >= 70) return '';
  const urgency = weakest.s < 40 ? 'Tu mayor debilidad es' : 'Tu principal área de mejora es';
  return `${urgency} la <strong>${weakest.name}</strong>. Enfoca tus próximas acciones en mejorar este indicador.`;
}

function emergencyFundWidget(ef: EmergencyFundStatus, targetMonths: number): string {
  const pct =
    ef.colchonObjetivo > 0 ? Math.min((ef.saldoDisponible / ef.colchonObjetivo) * 100, 150) : 0;
  const barColor =
    ef.estado === 'excelente'
      ? 'var(--accent-green)'
      : ef.estado === 'adecuado'
        ? 'var(--accent-blue)'
        : ef.estado === 'insuficiente'
          ? 'var(--accent-yellow)'
          : 'var(--accent-red)';

  const estadoLabel =
    ef.estado === 'critico'
      ? '🔴 Peligro'
      : ef.estado === 'insuficiente'
        ? '🟡 Insuficiente'
        : ef.estado === 'adecuado'
          ? '🟢 Adecuado'
          : '💎 Excelente';

  const actionMsg =
    ef.estado === 'critico'
      ? `Solo cubres ${ef.mesesCubiertos.toFixed(1)} meses. Prioriza construir tu fondo de emergencia.`
      : ef.estado === 'insuficiente'
        ? `Te faltan ${eur(ef.deficit)} para alcanzar tu objetivo de ${targetMonths} meses.`
        : ef.estado === 'excelente'
          ? `Fondo excelente. El excedente de ${eur(ef.superavit)} podría invertirse.`
          : `Tu fondo de emergencia es adecuado (${ef.mesesCubiertos.toFixed(1)} de ${targetMonths} meses).`;

  return `
    <div class="db__ef-widget">
      <div class="db__ef-header">
        <h2 class="db__section-title">Fondo de emergencia</h2>
        <span class="db__ef-estado">${estadoLabel}</span>
      </div>
      <div class="db__ef-bar-wrap">
        <div class="db__ef-bar">
          <div class="db__ef-fill" style="width:${pct.toFixed(1)}%;background:${barColor}"></div>
          <div class="db__ef-target-line" style="left:${Math.min((1 / 1.5) * 100, 100).toFixed(1)}%"></div>
        </div>
        <span class="db__ef-label">${ef.mesesCubiertos.toFixed(1)} / ${targetMonths} meses</span>
      </div>
      <p class="db__ef-action">${actionMsg}</p>
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
