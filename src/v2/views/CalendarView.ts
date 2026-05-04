import { BaseComponent } from '@/core/BaseComponent';
import { appStore } from '@/core/store';
import { generateStatement } from '@/finance-math/finance-math';
import type { StatementEntry } from '@/types/domain';

const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const TYPE_COLOR: Record<string, string> = {
  gasto: 'var(--accent-red)',
  ingreso: 'var(--accent-green)',
  transferencia: 'var(--accent-blue)',
};

function monthKey(iso: string): string {
  return iso.slice(0, 7); // "YYYY-MM"
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-');
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

function fmtDay(iso: string): string {
  return iso.slice(8); // "DD"
}

export class CalendarView extends BaseComponent {
  private _months = 3;

  override connectedCallback(): void {
    this.connectStore(appStore);
    super.connectedCallback();
  }

  protected template(): string {
    const { loans, expenses, accounts, config } = appStore.getState();

    if (accounts.length === 0 && loans.length === 0 && expenses.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">📅</div>
          <h1 class="wip-card__title">Sin datos para mostrar</h1>
          <p class="wip-card__desc">Añade cuentas, préstamos o gastos para ver el calendario de movimientos proyectados.</p>
        </div>`;
    }

    const today = new Date().toISOString().slice(0, 10);

    // Build a window: from start of current month to end of requested month span
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth() + this._months, 0);
    const windowEnd = endDate.toISOString().slice(0, 10);

    // Override config dates to get the right window
    const windowConfig = { ...config, dashboardStart: today, dashboardEnd: windowEnd };
    const statement = generateStatement(loans, expenses, accounts, windowConfig);

    if (statement.length === 0) {
      return `
        <div class="wip-card">
          <div class="wip-card__icon">📅</div>
          <h1 class="wip-card__title">Sin movimientos proyectados</h1>
          <p class="wip-card__desc">No se han encontrado movimientos en los próximos ${this._months} meses.</p>
        </div>`;
    }

    // Group by month
    const byMonth = new Map<string, StatementEntry[]>();
    for (const entry of statement) {
      const key = monthKey(entry.fecha);
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key)!.push(entry);
    }

    const monthsHtml = [...byMonth.entries()]
      .map(([key, entries]) => this._month(key, entries))
      .join('');

    const totalInflow = statement.filter((e) => e.delta > 0).reduce((s, e) => s + e.delta, 0);
    const totalOutflow = statement.filter((e) => e.delta < 0).reduce((s, e) => s + e.delta, 0);

    return `
      <div class="calendar">
        <div class="cal-header">
          <h1 class="view-title">Calendario</h1>
          <div class="cal-range-btns">
            ${[1, 3, 6, 12]
              .map(
                (m) => `
              <button class="cal-range-btn${this._months === m ? ' cal-range-btn--active' : ''}"
                data-months="${m}">${m}M</button>`
              )
              .join('')}
          </div>
        </div>

        <div class="cal-summary">
          <div class="cal-summary__item">
            <span class="cal-summary__label">Entradas</span>
            <span class="cal-summary__value cal-summary__value--green">${eur(totalInflow)}</span>
          </div>
          <div class="cal-summary__item">
            <span class="cal-summary__label">Salidas</span>
            <span class="cal-summary__value cal-summary__value--red">${eur(Math.abs(totalOutflow))}</span>
          </div>
          <div class="cal-summary__item">
            <span class="cal-summary__label">Balance</span>
            <span class="cal-summary__value ${totalInflow + totalOutflow >= 0 ? 'cal-summary__value--green' : 'cal-summary__value--red'}">${eur(totalInflow + totalOutflow)}</span>
          </div>
        </div>

        ${monthsHtml}
      </div>`;
  }

  private _month(key: string, entries: StatementEntry[]): string {
    const inflow = entries.filter((e) => e.delta > 0).reduce((s, e) => s + e.delta, 0);
    const outflow = entries.filter((e) => e.delta < 0).reduce((s, e) => s + e.delta, 0);
    const lastBalance = entries[entries.length - 1].saldoAcum;

    return `
      <section class="cal-month">
        <div class="cal-month__header">
          <h2 class="cal-month__title">${monthLabel(key)}</h2>
          <div class="cal-month__totals">
            <span class="cal-month__inflow">+${eur(inflow)}</span>
            <span class="cal-month__outflow">${eur(outflow)}</span>
            <span class="cal-month__balance">${eur(lastBalance)}</span>
          </div>
        </div>
        <div class="cal-events">
          ${entries.map((e) => this._event(e)).join('')}
        </div>
      </section>`;
  }

  private _event(e: StatementEntry): string {
    const color = TYPE_COLOR[e.tipo] ?? 'var(--text-secondary)';
    const sign = e.delta >= 0 ? '+' : '';

    return `
      <div class="cal-event${e.simulacion ? ' cal-event--sim' : ''}">
        <div class="cal-event__day">${fmtDay(e.fecha)}</div>
        <div class="cal-event__body">
          <span class="cal-event__name">${e.concepto}</span>
          ${e.tags?.length ? `<span class="cal-event__tag">${e.tags[0]}</span>` : ''}
        </div>
        <div class="cal-event__right">
          <span class="cal-event__amount" style="color:${color}">${sign}${eur(Math.abs(e.delta))}</span>
          <span class="cal-event__balance">${eur(e.saldoAcum)}</span>
        </div>
      </div>`;
  }

  protected override afterRender(): void {
    this.querySelectorAll('[data-months]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._months = parseInt((btn as HTMLElement).dataset.months ?? '3', 10);
        this.invalidate();
      });
    });
  }
}

customElements.define('fin-calendar', CalendarView);
