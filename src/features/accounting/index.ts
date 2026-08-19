// ── features/accounting ───────────────────────────────────────────────────────
// Vista de Contabilidad real (F4, tarea 4.3). Primera vista escrita en el
// paquete nuevo: se registra con un manifest y el shell la aloja igual que a las
// legacy (ver src/app/feature-registry.ts).

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Ledger } from '@/accounting/ledger';
import type { TagService } from '@/accounting/tags';
import type { PrecisionAnalyzer } from '@/accounting/precision';
import type { Adjuster } from '@/accounting/adjust';
import type { Account, Expense } from '@/state/schema';
import { esc } from './dom';
import { renderTransactionsPanel, wireTransactionsPanel, type EstadoPanel } from './transactions-panel';
import { renderPrecisionPanel, wirePrecisionPanel } from './precision-panel';

export interface AccountingViewDeps {
  ledger: Ledger;
  tags: TagService;
  precision: PrecisionAnalyzer;
  adjuster: Adjuster;
  accounts: () => Account[];
  estimaciones: () => Expense[];
  /** Se llama cuando cambian los datos, para refrescar otras vistas. */
  onDatosCambiados?: () => void;
  /**
   * Fecha de "hoy" de la vista: corte de los ajustes, saldo actual y mes por
   * defecto. Inyectable para que los tests no dependan del día en que se
   * ejecutan (un test que fijaba 2026-07-30 se rompía al día siguiente).
   */
  hoy?: () => ISODate;
}

const ICONO = 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z';

export function createAccountingFeature(deps: AccountingViewDeps): FeatureManifest {
  // El estado de la vista (cuenta y mes seleccionados) vive aquí: es estado de
  // interfaz, no del usuario, así que no va al store.
  const estado: EstadoPanel = {
    cuentaId: '',
    mes: (deps.hoy ?? todayISO)().slice(0, 7),
    filtroTexto: '',
  };

  const notificar = () => deps.onDatosCambiados?.();
  const hoy = deps.hoy ?? todayISO;

  const txDeps = {
    ledger: deps.ledger,
    accounts: deps.accounts,
    estimaciones: deps.estimaciones,
    tagsConocidas: () => deps.tags.todas(),
    onDatosCambiados: notificar,
    hoy,
  };

  const precDeps = {
    precision: deps.precision,
    adjuster: deps.adjuster,
    estimaciones: deps.estimaciones,
    onDatosCambiados: notificar,
    hoy,
  };

  function render(container: HTMLElement): void {
    const saldoHoy = deps.ledger.saldoTotal(hoy());
    const ultima = deps.ledger.ultimaFecha();
    const nTx = deps.ledger.transacciones().length;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Contabilidad <span>real</span></h1>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--accent)">
        📒 Lo que registras aquí es el <strong>histórico real</strong>: manda sobre las
        estimaciones para el pasado. Las estimaciones siguen proyectando el futuro, y con
        estos datos puedes medir su acierto y ajustarlas.
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Saldo real hoy</div>
          <div class="stat-value" style="font-size:1.3rem">${esc(formatEUR(saldoHoy))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${nTx}</div>
          <div style="font-size:11px;color:var(--text3)">${ultima ? `último: ${esc(ultima)}` : 'ninguno todavía'}</div>
        </div>
      </div>

      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;

    const zonaTx = container.querySelector<HTMLElement>('#acc-transacciones') as HTMLElement;
    const zonaPrec = container.querySelector<HTMLElement>('#acc-precision') as HTMLElement;

    zonaTx.innerHTML = renderTransactionsPanel(txDeps, estado);
    zonaPrec.innerHTML = renderPrecisionPanel(precDeps);

    // Se re-renderiza toda la vista en cada cambio: es simple y suficiente para
    // el volumen de datos de esta pantalla (y evita estados intermedios raros).
    const refrescar = () => render(container);
    wireTransactionsPanel(zonaTx, txDeps, estado, refrescar);
    wirePrecisionPanel(zonaPrec, precDeps, refrescar);
  }

  return {
    id: 'contabilidad',
    route: 'contabilidad',
    nombre: 'Contabilidad',
    flagId: 'contabilidad',
    seccion: 1, // "Mi dinero"
    iconoPath: ICONO,
    mount: render,
  };
}
