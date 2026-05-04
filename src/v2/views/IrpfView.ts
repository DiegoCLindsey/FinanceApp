import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import { calculateFiscalProjection } from '@/finance-math/finance-math';

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const pct = (n: number) => `${n.toFixed(1)} %`;

export class IrpfView extends BaseComponent {
  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
  }

  protected template(): string {
    const { expenses, accounts, config } = appStore.getState();

    const irpfIncomes = expenses.filter((e) => e.activo && e.tipo === 'ingreso' && e.sujetoIRPF);

    if (irpfIncomes.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">🧾</div>
          <h1 class="wip-card__title">Sin ingresos sujetos a IRPF</h1>
          <p class="wip-card__desc">Activa la opción "sujeto a IRPF" en tus ingresos para proyectar tu declaración anual.</p>
        </div>`;
    }

    if (!config.tramos_irpf || config.tramos_irpf.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">🧾</div>
          <h1 class="wip-card__title">Tramos IRPF no configurados</h1>
          <p class="wip-card__desc">Configura los tramos del IRPF en Ajustes para usar el asistente fiscal.</p>
        </div>`;
    }

    const fp = calculateFiscalProjection(expenses, accounts, config);

    const resultadoColor = fp.cuotaIRPF > 0 ? 'var(--accent-red)' : 'var(--accent-green)';

    return `
      <div class="irpf">
        <h1 class="view-title">Optimización Fiscal IRPF</h1>

        <div class="irpf-disclaimer">
          ⚠️ Estimación orientativa basada en los datos introducidos. No constituye asesoramiento fiscal profesional.
        </div>

        <div class="irpf-kpis">
          ${this._kpi('Base imponible', eur(fp.baseImponible), 'neutral')}
          ${this._kpi('Cuota IRPF', eur(fp.cuotaIRPF), 'negative')}
          ${this._kpi('Tipo efectivo', pct(fp.tipoEfectivo), 'neutral')}
          ${this._kpi('Tipo marginal', pct(fp.tipoMarginal), 'neutral')}
        </div>

        <div class="irpf-section">
          <h2 class="irpf-section__title">Proyección de la declaración</h2>
          <div class="irpf-row">
            <span>Base imponible anual estimada</span>
            <span>${eur(fp.baseImponible)}</span>
          </div>
          <div class="irpf-row">
            <span>Cuota íntegra (tramos configurados)</span>
            <span style="color:var(--accent-red)">${eur(fp.cuotaIRPF)}</span>
          </div>
          <div class="irpf-row irpf-row--total">
            <span>Resultado estimado</span>
            <span style="color:${resultadoColor}">${eur(fp.cuotaIRPF)}</span>
          </div>
        </div>

        ${fp.ahorroFiscalPension > 0 ? this._pensionAction(fp) : ''}

        <div class="irpf-section">
          <h2 class="irpf-section__title">Tramos aplicados</h2>
          ${this._tramos(config.tramos_irpf, fp.baseImponible)}
        </div>
      </div>`;
  }

  private _kpi(label: string, value: string, variant: 'positive' | 'negative' | 'neutral'): string {
    return `
      <div class="kpi-card">
        <div class="kpi-card__label">${label}</div>
        <div class="kpi-card__value kpi-card__value--${variant}">${value}</div>
      </div>`;
  }

  private _pensionAction(fp: ReturnType<typeof calculateFiscalProjection>): string {
    return `
      <div class="irpf-action irpf-action--pension">
        <div class="irpf-action__icon">💡</div>
        <div class="irpf-action__body">
          <div class="irpf-action__title">Oportunidad: Plan de pensiones</div>
          <p class="irpf-action__desc">
            Puedes aportar hasta <strong>${eur(fp.margenDeduccionPension)}</strong> más a tu plan de pensiones
            (límite anual: ${eur(fp.limiteDeduccionPension)}, aportado este año: ${eur(fp.pensionContribuidoAnyo)}).
          </p>
          <p class="irpf-action__desc">
            Al tipo marginal del <strong>${fp.tipoMarginal.toFixed(1)}%</strong>,
            esto supone un ahorro fiscal de
            <strong style="color:var(--accent-green)">${eur(fp.ahorroFiscalPension)}</strong>.
          </p>
        </div>
        <div class="irpf-action__saving">${eur(fp.ahorroFiscalPension)}</div>
      </div>`;
  }

  private _tramos(tramos: [number, number][], base: number): string {
    const sorted = [...tramos].sort((a, b) => a[0] - b[0]);
    const rows = sorted.map(([min, rate], i) => {
      const max = sorted[i + 1]?.[0] ?? Infinity;
      const applies = base > min;
      const taxable = applies ? Math.min(base, max === Infinity ? base : max) - min : 0;
      const tax = taxable * (rate / 100);
      return `
        <div class="irpf-row${applies ? '' : ' irpf-row--muted'}">
          <span>${min.toLocaleString('es-ES')}€ – ${max === Infinity ? '∞' : max.toLocaleString('es-ES') + '€'}</span>
          <span>${rate}%</span>
          <span>${applies ? eur(tax) : '—'}</span>
        </div>`;
    });
    return rows.join('');
  }
}

customElements.define('fin-irpf', IrpfView);
