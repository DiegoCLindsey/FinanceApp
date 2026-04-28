import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import { projectScenarios } from '@/finance-math/finance-math';
import type { ScenarioPoint } from '@/types/domain';

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

export class ForecastView extends BaseComponent {
  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
  }

  protected template(): string {
    const { loans, expenses, accounts, config } = appStore.getState();

    if (accounts.length === 0 && loans.length === 0 && expenses.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">🔮</div>
          <h1 class="wip-card__title">Sin datos para proyectar</h1>
          <p class="wip-card__desc">Añade cuentas, préstamos o gastos para ver la previsión multi-escenario.</p>
        </div>`;
    }

    const scenarios = projectScenarios(loans, expenses, accounts, config);

    const pesimista = scenarios[0];
    const realista = scenarios[1];
    const optimista = scenarios[2];

    return `
      <div class="forecast">
        <h1 class="view-title">Previsión Multi-Escenario</h1>

        <div class="forecast-legend">
          ${scenarios
            .map(
              (s) => `
            <div class="forecast-legend__item">
              <span class="forecast-legend__dot" style="background:${s.color}"></span>
              <span>${s.nombre}</span>
            </div>`
            )
            .join('')}
        </div>

        <div class="forecast-desc">
          <p>Tres escenarios basados en variaciones de ingresos y gastos respecto a los valores actuales:</p>
          <ul class="forecast-params">
            <li><strong style="color:${pesimista.color}">Pesimista</strong>: ingresos −10%, gastos +15%</li>
            <li><strong style="color:${realista.color}">Realista</strong>: sin variación</li>
            <li><strong style="color:${optimista.color}">Optimista</strong>: ingresos +10%, gastos −10%</li>
          </ul>
        </div>

        <div class="forecast-table-wrap">
          <table class="forecast-table">
            <thead>
              <tr>
                <th>Escenario</th>
                <th>3 meses</th>
                <th>6 meses</th>
                <th>1 año</th>
                <th>3 años</th>
              </tr>
            </thead>
            <tbody>
              ${scenarios.map((s) => this._row(s)).join('')}
            </tbody>
          </table>
        </div>

        <div class="forecast-bars">
          <h2 class="forecast-bars__title">Saldo proyectado a 1 año</h2>
          ${scenarios.map((s) => this._bar(s, scenarios)).join('')}
        </div>
      </div>`;
  }

  private _row(s: ScenarioPoint): string {
    const cell = (v: number) =>
      `<td class="forecast-cell" style="color:${v >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">${eur(v)}</td>`;
    return `
      <tr>
        <td>
          <span class="forecast-scenario-name">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${s.color};margin-right:6px"></span>
            ${s.nombre}
          </span>
        </td>
        ${cell(s.saldoA3M)}${cell(s.saldoA6M)}${cell(s.saldoA1A)}${cell(s.saldoA3A)}
      </tr>`;
  }

  private _bar(s: ScenarioPoint, all: ScenarioPoint[]): string {
    const maxAbs = Math.max(...all.map((x) => Math.abs(x.saldoA1A)), 1);
    const pct = (Math.abs(s.saldoA1A) / maxAbs) * 100;
    const color = s.saldoA1A >= 0 ? s.color : 'var(--accent-red)';
    return `
      <div class="forecast-bar-row">
        <span class="forecast-bar-label">${s.nombre}</span>
        <div class="forecast-bar-track">
          <div class="forecast-bar-fill" style="width:${pct.toFixed(1)}%;background:${color}"></div>
        </div>
        <span class="forecast-bar-value" style="color:${color}">${eur(s.saldoA1A)}</span>
      </div>`;
  }
}

customElements.define('fin-forecast', ForecastView);
