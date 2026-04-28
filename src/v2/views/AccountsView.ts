import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import { getCurrentBalance, calculatePensionTax } from '@/finance-math/finance-math';
import type { Account } from '@/types/domain';

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const pct = (n: number) => `${n.toFixed(2)} %`;

const PERIOD_LABEL: Record<string, string> = {
  diario: 'diario',
  semanal: 'semanal',
  mensual: 'mensual',
};

export class AccountsView extends BaseComponent {
  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
  }

  protected template(): string {
    const { accounts } = appStore.getState();

    if (accounts.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">💳</div>
          <h1 class="wip-card__title">Sin cuentas registradas</h1>
          <p class="wip-card__desc">Añade tus cuentas bancarias, fondos de inversión y planes de pensión para ver tu patrimonio.</p>
        </div>`;
    }

    const active = accounts.filter((a) => a.activo && !a.simulacion);
    const pensions = active.filter((a) => a.esFondoPension);
    const regular = active.filter((a) => !a.esFondoPension);
    const sims = accounts.filter((a) => a.simulacion);
    const inactive = accounts.filter((a) => !a.activo && !a.simulacion);

    const totalBalance = active.reduce((s, a) => s + getCurrentBalance(a), 0);

    return `
      <div class="accounts">
        <h1 class="view-title">Cuentas</h1>

        <div class="acc-total">
          <span class="acc-total__label">Saldo total</span>
          <span class="acc-total__value">${eur(totalBalance)}</span>
        </div>

        ${regular.length > 0 ? this._section('Cuentas activas', regular) : ''}
        ${pensions.length > 0 ? this._section('Planes de pensión y fondos', pensions) : ''}
        ${sims.length > 0 ? this._section('Simulaciones', sims) : ''}
        ${inactive.length > 0 ? this._section('Inactivas', inactive, true) : ''}
      </div>`;
  }

  private _section(title: string, list: Account[], muted = false): string {
    return `
      <section class="acc-section${muted ? ' acc-section--muted' : ''}">
        <h2 class="acc-section__title">${title} <span class="acc-section__count">${list.length}</span></h2>
        <div class="acc-cards">
          ${list.map((a) => this._card(a)).join('')}
        </div>
      </section>`;
  }

  private _card(acc: Account): string {
    const balance = getCurrentBalance(acc);
    const costBase = acc.aportaciones.reduce((s, a) => s + a.cantidad, 0);
    const gain = acc.esFondoPension ? balance - costBase : 0;
    const gainPct = costBase > 0 ? ((gain / costBase) * 100).toFixed(1) : null;
    const taxIfWithdraw = acc.esFondoPension ? calculatePensionTax(acc, balance) : 0;
    const balanceColor = balance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

    return `
      <div class="acc-card${acc.simulacion ? ' acc-card--sim' : ''}${!acc.activo ? ' acc-card--inactive' : ''}">
        <div class="acc-card__header">
          <div class="acc-card__name-row">
            <span class="acc-card__name">${acc.nombre}</span>
            ${acc.esCuentaPrincipal ? '<span class="acc-badge acc-badge--main">principal</span>' : ''}
            ${acc.esFondoPension ? '<span class="acc-badge acc-badge--pension">pensión</span>' : ''}
            ${acc.simulacion ? '<span class="acc-badge acc-badge--sim">simulación</span>' : ''}
          </div>
          <span class="acc-card__balance" style="color:${balanceColor}">${eur(balance)}</span>
        </div>

        <div class="acc-card__meta">
          ${acc.interes > 0 ? `<span class="acc-card__meta-item">TAE ${pct(acc.interes)}</span>` : ''}
          ${acc.interes > 0 ? `<span class="acc-card__meta-item">Cobro ${PERIOD_LABEL[acc.periodoCobro] ?? acc.periodoCobro}</span>` : ''}
          ${acc.historicoSaldos.length > 0 ? `<span class="acc-card__meta-item">${acc.historicoSaldos.length} registros</span>` : ''}
        </div>

        ${
          acc.esFondoPension
            ? `<div class="acc-card__pension">
            <div class="acc-card__pension-row">
              <span>Coste base</span><span>${eur(costBase)}</span>
            </div>
            <div class="acc-card__pension-row">
              <span>Plusvalía</span>
              <span style="color:${gain >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">
                ${eur(gain)}${gainPct !== null ? ` (${gain >= 0 ? '+' : ''}${gainPct}%)` : ''}
              </span>
            </div>
            ${
              taxIfWithdraw > 0
                ? `<div class="acc-card__pension-row acc-card__pension-row--tax">
              <span>Retención estimada</span><span style="color:var(--accent-red)">${eur(taxIfWithdraw)}</span>
            </div>`
                : ''
            }
            ${
              acc.bloqueoMeses > 0
                ? `<div class="acc-card__pension-row">
              <span>Bloqueo</span><span>${acc.bloqueoMeses} meses</span>
            </div>`
                : ''
            }
          </div>`
            : ''
        }

        ${acc.descripcion ? `<div class="acc-card__desc">${acc.descripcion}</div>` : ''}
      </div>`;
  }
}

customElements.define('fin-account-list', AccountsView);
