// ── features/accounts ─────────────────────────────────────────────────────────
// Cuentas y fondos, fusionada con Contabilidad real (simplificación grande,
// 2026-09): eran dos vistas separadas, pero Contabilidad ya exigía tener
// Cuentas activa y el histórico de saldos de Cuentas pasa por el ledger de
// Contabilidad desde F4 — dos rutas para lo mismo. Ahora es una sola vista
// con pestañas (ver tabs.ts): Cuentas, Movimientos, Importar CSV, Cierre y
// precisión. Los paneles de contabilidad (transactions-panel.ts,
// import-panel.ts, cierre-panel.ts, precision-panel.ts) se movieron aquí tal
// cual desde la antigua `features/accounting/`, que solo conserva `dom.ts`
// (helpers de DOM compartidos por medio proyecto, no específicos de
// contabilidad).
//
// Cambios respecto a la versión legacy, además del tipado:
//   · delegación de eventos: se van los `onclick="AccountsModule.x('<id>')"`, y
//     con ellos el riesgo de romper el atributo con comillas en un nombre;
//   · el histórico de saldos pasa a ser el de puntos de control del ledger
//     (F4). Antes lo escribían dos módulos sobre el mismo campo y el ledger
//     machacaba lo añadido desde aquí (ver historico.ts);
//   · los flujos del período de un fondo salen del motor (`proyectarTransferencias`),
//     no de un contador de ocurrencias propio que además seguía hablando de
//     frecuencias ('trimestral', 'semestral', 'anual') que el esquema ya no
//     tiene — con el esquema actual contaba 0 y no lo notaba nadie;
//   · las tablas de tramos de ganancias de capital ya se pueden definir por
//     ejercicio, que es lo que el motor lleva resolviendo desde 1.5;
//   · el selector de tipo no ofrece "Plan de pensiones": esta vista los filtra
//     (los gestiona Nóminas), así que crear uno aquí lo hacía desaparecer.

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import { modeloFondoDe } from '@/core/accounts';
import { crearResolverTramos } from '@/core/tax/tables';
import { TRAMOS_IRPF_DEFAULT, type Tramos } from '@/core/tax/irpf';
import { TRAMOS_AHORRO_DEFAULT } from '@/core/tax/ahorro';
import { generarExtracto, type StatementAccount } from '@/engine/statement';
import type { CashEvent } from '@/engine/types';
import type { PlanAportacion } from '@/engine/providers/contributions';
import type { PeriodoInflacion } from '@/core/inflation';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Account, AppConfig, Expense, Loan, Nomina, TablaFiscalAnual } from '@/state/schema';
import type { Ledger } from '@/accounting/ledger';
import type { TagService } from '@/accounting/tags';
import type { PrecisionAnalyzer } from '@/accounting/precision';
import type { Adjuster } from '@/accounting/adjust';
import { confirmar, esc, onClick, toast } from '../accounting/dom';
import { carteraFiscalHtml, renderAccountCard, FLUJOS_VACIOS, type CardCtx, type FlujosCuenta, type LineaFlujo } from './card';
import { construirCuenta, formularioCuenta, wireFormularioCuenta } from './form';
import { historicoDeCuenta, historicoHtml } from './historico';
import { createTramosGananciasModal } from './tramos-ganancias';
import { pestanasCuentasHtml, type PestanaCuentas } from './tabs';
import { renderTransactionsPanel, wireTransactionsPanel, type EstadoPanel } from './transactions-panel';
import { renderPrecisionPanel, wirePrecisionPanel } from './precision-panel';
import { estadoImportInicial, renderImportPanel, wireImportPanel, type EstadoImport } from './import-panel';
import { estadoCierreInicial, renderCierrePanel, wireCierrePanel, type EstadoCierre } from './cierre-panel';

export interface AccountsStoreLike {
  get(key: 'accounts'): Account[];
  get(key: 'expenses'): Expense[];
  get(key: 'loans'): Loan[];
  get(key: 'nominas'): Nomina[];
  get(key: 'inflacion'): PeriodoInflacion[];
  get(key: 'tramosIRPFHistorico'): TablaFiscalAnual[];
  get(key: 'tramosGananciasCapitalHistorico'): TablaFiscalAnual[];
  get(key: 'config'): AppConfig;
  set(key: 'accounts', value: Account[]): void;
  set(key: 'tramosGananciasCapitalHistorico', value: TablaFiscalAnual[]): void;
  patchConfig(patch: Partial<AppConfig>): void;
  addItem(col: 'accounts', item: Omit<Account, '_id'> & { _id?: string }): Account;
  updateItem(col: 'accounts', id: string, patch: Partial<Account>): void;
  removeItem(col: 'accounts', id: string): void;
}

export interface AccountsViewDeps {
  store: AccountsStoreLike;
  /** Puntos de control: el ledger manda sobre el pasado desde F4. */
  ledger: Ledger;
  tags: TagService;
  precision: PrecisionAnalyzer;
  adjuster: Adjuster;
  onDatosCambiados?: () => void;
  /** Inyectable para que los tests no dependan del día en que se ejecutan. */
  hoy?: () => ISODate;
}

const ICONO =
  'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z';

export function createAccountsFeature(deps: AccountsViewDeps): FeatureManifest {
  const hoy = deps.hoy ?? todayISO;
  const notificar = () => deps.onDatosCambiados?.();

  /** Modo de la tarjeta de fondo de inversión, por cuenta. */
  const invModo = new Map<string, 'real' | 'proyeccion'>();

  // ── Pestaña activa y estado de los paneles de contabilidad ──────────────────
  // Cuentas y Contabilidad eran dos vistas separadas; ahora son pestañas de la
  // misma (ver tabs.ts). El estado de cada panel es de interfaz, no del
  // usuario, así que no va al store — igual que hacía la vista de Contabilidad.
  let tabActiva: PestanaCuentas = 'cuentas';
  const estadoTx: EstadoPanel = { cuentaId: '', mes: hoy().slice(0, 7), filtroTexto: '' };
  const estadoImport: EstadoImport = estadoImportInicial();
  const estadoCierre: EstadoCierre = estadoCierreInicial();

  const estimaciones = () => deps.store.get('expenses');
  const cuentasTodas = () => deps.store.get('accounts');

  const txDeps = {
    ledger: deps.ledger,
    accounts: cuentasTodas,
    estimaciones,
    tagsConocidas: () => deps.tags.todas(),
    onDatosCambiados: notificar,
    hoy,
  };
  const impDeps = { ledger: deps.ledger, accounts: cuentasTodas, onDatosCambiados: notificar };
  const cierreDeps = {
    ledger: deps.ledger,
    precision: deps.precision,
    adjuster: deps.adjuster,
    estimaciones,
    onDatosCambiados: notificar,
    hoy,
  };
  const precDeps = { precision: deps.precision, adjuster: deps.adjuster, estimaciones, onDatosCambiados: notificar, hoy };

  const config = () => deps.store.get('config');
  const nombreCuenta = (id: string) => deps.store.get('accounts').find((a) => a._id === id)?.nombre ?? id;

  const tramosIRPF = (): Tramos =>
    crearResolverTramos(deps.store.get('tramosIRPFHistorico'), config().tramos_irpf ?? TRAMOS_IRPF_DEFAULT)(Number(hoy().slice(0, 4)));
  const resolverGanancias = () =>
    crearResolverTramos(deps.store.get('tramosGananciasCapitalHistorico'), config().tramosGananciasCapital ?? TRAMOS_AHORRO_DEFAULT);
  const tramosGanancias = (): Tramos => resolverGanancias()(Number(hoy().slice(0, 4)));

  // ── Flujos proyectados sobre los fondos ─────────────────────────────────────

  /**
   * Aportaciones y reembolsos de cada cuenta dentro del período del dashboard,
   * tal y como los proyecta el motor (una sola pasada para todas las cuentas).
   * De ahí sale también la retención del art. 101 de los reembolsos, que antes
   * la vista aproximaba por su cuenta.
   */
  function calcularFlujos(): Map<string, FlujosCuenta> {
    const cfg = config();
    const accounts = deps.store.get('accounts');
    const eventos = generarExtracto({
      loans: [],
      expenses: deps.store.get('expenses').filter((e) => e.tipo === 'transferencia'),
      accounts: accounts as StatementAccount[],
      config: { dashboardStart: cfg.dashboardStart, dashboardEnd: cfg.dashboardEnd, fechaReferencia: cfg.dashboardStart },
      nominas: [],
      resolverTramosGanancias: resolverGanancias(),
    });

    const mapa = new Map<string, FlujosCuenta>();
    const dameFlujos = (id: string) => {
      let f = mapa.get(id);
      if (!f) {
        f = { entradas: [], salidas: [], totalAportaciones: 0, totalReembolsos: 0, retencion: 0 };
        mapa.set(id, f);
      }
      return f;
    };
    /** Las ocurrencias de una misma transferencia se agrupan en una línea. */
    const acumular = (lineas: LineaFlujo[], ev: CashEvent) => {
      const clave = `${ev.sourceId}`;
      const existente = lineas.find((l) => l.concepto === clave);
      const linea = existente ?? { concepto: clave, contraparte: '', total: 0, ocurrencias: 0 };
      linea.total += Math.abs(ev.cuantia);
      linea.ocurrencias += 1;
      if (!existente) lineas.push(linea);
    };

    for (const ev of eventos) {
      if (!ev.cuenta) continue;
      const f = dameFlujos(ev.cuenta);
      if (ev.sourceType === 'transfer-in' || ev.sourceType === 'traspaso-in') {
        f.totalAportaciones += Math.abs(ev.cuantia);
        acumular(f.entradas, ev);
      } else if (ev.sourceType === 'transfer-out' || ev.sourceType === 'traspaso-out') {
        f.totalReembolsos += Math.abs(ev.cuantia);
        acumular(f.salidas, ev);
      } else if (ev.sourceType === 'investment-tax') {
        f.retencion += Math.abs(ev.cuantia);
      }
    }

    // Las líneas se guardan con el id de la transferencia; se traducen a texto
    const expenses = deps.store.get('expenses');
    for (const f of mapa.values()) {
      for (const [lineas, propia] of [
        [f.entradas, 'cuenta'],
        [f.salidas, 'cuentaDestino'],
      ] as const) {
        for (const l of lineas) {
          const exp = expenses.find((e) => e._id === l.concepto);
          l.contraparte = nombreCuenta(exp?.[propia] ?? 'default');
          l.concepto = exp?.concepto || (propia === 'cuenta' ? 'Aportación' : 'Reembolso');
        }
      }
    }
    return mapa;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function render(container: HTMLElement): void {
    const accionesCuentas =
      tabActiva === 'cuentas'
        ? `<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`
        : '';

    let contenido: string;
    if (tabActiva === 'cuentas') {
      const todas = deps.store.get('accounts');
      // Los planes de pensiones se gestionan en Nóminas: su fiscalidad es la del
      // trabajo (ver features/salaries/pensions.ts).
      const cuentas = todas.filter((a) => modeloFondoDe(a) !== 'pension');
      const flujos = calcularFlujos();
      const ctx: CardCtx = {
        config: config(),
        inflacion: deps.store.get('inflacion'),
        nominas: deps.store.get('nominas'),
        tramosIRPF: tramosIRPF(),
        tramosGanancias: tramosGanancias(),
        flujos: (id) => flujos.get(id) ?? FLUJOS_VACIOS,
        invModo: (id) => invModo.get(id) ?? 'proyeccion',
      };
      contenido = `${carteraFiscalHtml(cuentas, ctx.tramosGanancias)}<div class="grid-3">${cuentas.map((a) => renderAccountCard(a, ctx)).join('')}</div>`;
    } else if (tabActiva === 'movimientos') {
      contenido = `<div id="acc-tx"></div>`;
    } else if (tabActiva === 'importar') {
      contenido = `<div id="acc-import"></div>`;
    } else {
      contenido = `<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>`;
    }

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${accionesCuentas}
      </div>
      ${pestanasCuentasHtml(tabActiva)}
      ${contenido}`;

    const refrescar = () => render(container);
    if (tabActiva === 'movimientos') {
      const zona = container.querySelector<HTMLElement>('#acc-tx') as HTMLElement;
      zona.innerHTML = renderTransactionsPanel(txDeps, estadoTx);
      wireTransactionsPanel(zona, txDeps, estadoTx, refrescar);
    } else if (tabActiva === 'importar') {
      const zona = container.querySelector<HTMLElement>('#acc-import') as HTMLElement;
      zona.innerHTML = renderImportPanel(impDeps, estadoImport);
      wireImportPanel(zona, impDeps, estadoImport, refrescar);
    } else if (tabActiva === 'cierre') {
      const zonaCierre = container.querySelector<HTMLElement>('#acc-cierre') as HTMLElement;
      const zonaPrec = container.querySelector<HTMLElement>('#acc-precision') as HTMLElement;
      zonaCierre.innerHTML = renderCierrePanel(cierreDeps, estadoCierre);
      zonaPrec.innerHTML = renderPrecisionPanel(precDeps);
      wireCierrePanel(zonaCierre, cierreDeps, estadoCierre, refrescar);
      wirePrecisionPanel(zonaPrec, precDeps, refrescar);
    }
  }

  // ── Modales ─────────────────────────────────────────────────────────────────

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrarModal = () => overlay()?.classList.add('hidden');

  function abrirModal(titulo: string, html: string): HTMLElement | null {
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return null;
    el.innerHTML = titulo ? `<div class="modal-title">${esc(titulo)}</div>${html}` : html;
    ov.classList.remove('hidden');
    onClick(el, '[data-cancelar]', cerrarModal);
    return el;
  }

  function abrirFormularioCuenta(id: string | null, refrescar: () => void): void {
    const acc = id ? (deps.store.get('accounts').find((a) => a._id === id) ?? null) : null;
    const plan: PlanAportacion[] = [...(acc?.planAportaciones ?? [])].map((p) => ({ ...p }));
    // El saldo conocido sale del ledger, que es quien manda sobre el pasado
    const saldoAnterior = acc ? saldoConocido(acc) : null;
    const el = abrirModal(
      id ? 'Editar cuenta / fondo' : 'Nueva cuenta / fondo',
      formularioCuenta(acc, {
        nominas: deps.store.get('nominas'),
        hoy: hoy(),
        saldoActual: saldoAnterior ?? 0,
      }),
    );
    if (!el) return;
    wireFormularioCuenta(el, plan, hoy());

    onClick(el, '[data-guardar-acc]', (btn) => {
      const editId = btn.getAttribute('data-guardar-acc') || '';
      const { datos, punto, error } = construirCuenta(el, plan, acc, saldoAnterior, hoy());
      if (error) return toast(error, 'err');

      let cuentaId = editId;
      if (editId) deps.store.updateItem('accounts', editId, datos);
      else cuentaId = deps.store.addItem('accounts', datos as Omit<Account, '_id'>)._id;
      if (punto) deps.ledger.registrarPuntoControl(cuentaId, punto.fecha, punto.saldo, punto.nota);

      toast(editId ? 'Actualizada' : 'Cuenta / fondo creado');
      notificar();
      cerrarModal();
      refrescar();
    });
  }

  /** Último saldo real conocido de la cuenta: su punto de control más reciente. */
  function saldoConocido(acc: Account): number | null {
    const puntos = deps.ledger.puntosControl(acc._id);
    if (puntos.length > 0) return historicoDeCuenta(puntos)[0].saldo;
    return acc.saldo ?? null;
  }

  function abrirHistorico(accId: string, refrescar: () => void): void {
    const acc = deps.store.get('accounts').find((a) => a._id === accId);
    if (!acc) return;
    const el = abrirModal(
      'Histórico de saldos',
      historicoHtml(acc.nombre, accId, historicoDeCuenta(deps.ledger.puntosControl(accId)), acc.saldoInicial || 0, hoy()),
    );
    if (!el) return;

    const reabrir = () => {
      refrescar();
      abrirHistorico(accId, refrescar);
    };

    onClick(el, '[data-hist-anadir]', () => {
      const fecha = (el.querySelector('#hi-fecha') as HTMLInputElement | null)?.value ?? '';
      const saldo = parseFloat((el.querySelector('#hi-saldo') as HTMLInputElement | null)?.value ?? '');
      const nota = (el.querySelector('#hi-nota') as HTMLInputElement | null)?.value.trim() ?? '';
      if (!fecha || !Number.isFinite(saldo)) return toast('Fecha y saldo requeridos', 'err');
      deps.ledger.registrarPuntoControl(accId, fecha, saldo, nota || undefined);
      toast('Punto añadido');
      notificar();
      reabrir();
    });
    onClick(el, '[data-hist-borrar]', (btn) => {
      const [, puntoId] = (btn.getAttribute('data-hist-borrar') || '').split('|');
      deps.ledger.eliminarPuntoControl(puntoId);
      toast('Eliminado');
      notificar();
      reabrir();
    });
    onClick(el, '[data-hist-inicial]', (btn) => {
      const [cuentaId, puntoId] = (btn.getAttribute('data-hist-inicial') || '').split('|');
      const punto = deps.ledger.puntosControl(cuentaId).find((p) => p._id === puntoId);
      if (!punto) return;
      const saldo = historicoDeCuenta([punto])[0].saldo;
      deps.store.updateItem('accounts', cuentaId, { saldoInicial: saldo, fechaInicialSaldo: punto.fecha });
      toast(`Punto inicial → ${punto.fecha} (${formatEUR(saldo)})`);
      notificar();
      reabrir();
    });
  }

  /** Recalibra el arranque del extracto: saldo inicial = saldo real de hoy. */
  function actualizarSaldoBase(refrescar: () => void): void {
    const activas = deps.store.get('accounts').filter((a) => a.activo);
    if (activas.length === 0) return toast('No hay cuentas activas', 'err');
    const t = hoy();
    const lineas = activas.map((a) => `• ${a.nombre}: ${formatEUR(saldoConocido(a) ?? a.saldoInicial ?? 0)}`).join('\n');
    if (
      !confirmar(
        `¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${t})?\n\n${lineas}\n\nEsto recalibra el punto de arranque del dashboard.`,
      )
    )
      return;
    for (const a of activas) {
      deps.store.updateItem('accounts', a._id, { saldoInicial: saldoConocido(a) ?? a.saldoInicial ?? 0, fechaInicialSaldo: t });
    }
    toast('Saldo base actualizado');
    notificar();
    refrescar();
  }

  // ── Cableado ────────────────────────────────────────────────────────────────

  function wire(container: HTMLElement, refrescar: () => void, tramos: ReturnType<typeof createTramosGananciasModal>): void {
    onClick(container, '[data-cuentas-tab]', (el) => {
      tabActiva = (el.getAttribute('data-cuentas-tab') as PestanaCuentas) || 'cuentas';
      refrescar();
    });
    onClick(container, '[data-nueva-acc]', () => abrirFormularioCuenta(null, refrescar));
    onClick(container, '[data-editar-acc]', (el) => abrirFormularioCuenta(el.getAttribute('data-editar-acc'), refrescar));
    onClick(container, '[data-tramos-ganancias]', () => tramos.abrir());
    onClick(container, '[data-reset-base]', () => actualizarSaldoBase(refrescar));
    onClick(container, '[data-hist-acc]', (el) => abrirHistorico(el.getAttribute('data-hist-acc') as string, refrescar));

    onClick(container, '[data-principal-acc]', (el) => {
      const id = el.getAttribute('data-principal-acc') as string;
      deps.store.set(
        'accounts',
        deps.store.get('accounts').map((a) => ({ ...a, esCuentaPrincipal: a._id === id })),
      );
      toast('Cuenta marcada como principal');
      notificar();
      refrescar();
    });

    onClick(container, '[data-borrar-acc]', (el) => {
      const id = el.getAttribute('data-borrar-acc') as string;
      const accounts = deps.store.get('accounts');
      if (accounts.length <= 1) return toast('Debe existir al menos una cuenta', 'err');
      if (!confirmar('¿Eliminar cuenta?')) return;
      deps.store.removeItem('accounts', id);
      // `removeItem` no revisa invariantes: si se ha ido la principal, hay que
      // designar otra o los gastos nuevos se quedan sin cuenta por defecto.
      const restantes = deps.store.get('accounts');
      if (restantes.length > 0 && !restantes.some((a) => a.esCuentaPrincipal)) {
        deps.store.set(
          'accounts',
          restantes.map((a, i) => (i === 0 ? { ...a, esCuentaPrincipal: true } : a)),
        );
      }
      toast('Cuenta eliminada');
      notificar();
      refrescar();
    });

    onClick(container, '[data-inv-modo]', (el) => {
      const [id, modo] = (el.getAttribute('data-inv-modo') || '').split('|');
      invModo.set(id, modo === 'real' ? 'real' : 'proyeccion');
      refrescar();
    });
  }

  let tramosModal: ReturnType<typeof createTramosGananciasModal> | null = null;

  return {
    id: 'accounts',
    route: 'accounts',
    nombre: 'Cuentas y contabilidad',
    flagId: 'accounts',
    seccion: 1, // "Mi dinero"
    iconoPath: ICONO,
    mount(container: HTMLElement) {
      const refrescar = () => render(container);
      tramosModal ??= createTramosGananciasModal({
        store: deps.store,
        onDatosCambiados: () => {
          notificar();
          refrescar();
        },
        año: () => Number(hoy().slice(0, 4)),
      });
      render(container);
      if (container.dataset.wired !== '1') {
        wire(container, refrescar, tramosModal);
        container.dataset.wired = '1';
      }
    },
  };
}
