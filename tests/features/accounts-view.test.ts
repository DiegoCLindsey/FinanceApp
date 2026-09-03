// @vitest-environment happy-dom
// Vista de Cuentas y Ahorro portada al paquete nuevo (1.7 — 6/9): tarjetas de
// cuenta y fondo, formulario, histórico sobre el ledger y tramos de ganancias
// de capital por ejercicio.
//
// Recordatorio del entorno: happy-dom ignora el atributo `selected` al parsear
// innerHTML (ver docs/02-plan-refactor.md), así que los <select> se manejan
// fijando `.value` a mano y comprobando `option[selected]` en el HTML.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createAccountsFeature } from '@/features/accounts';
import { carteraFiscalHtml, renderAccountCard, FLUJOS_VACIOS, type CardCtx } from '@/features/accounts/card';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createLedger } from '@/accounting/ledger';
import { createFlags } from '@/flags/service';
import { TRAMOS_AHORRO_FALLBACK, TRAMOS_IRPF_FALLBACK, type Account, type Expense, type Nomina } from '@/state/schema';

const HOY = new Date(2026, 6, 31);
const HOY_ISO = '2026-07-31';

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="accounts"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container"><div id="view-dashboard" class="view active"></div></main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const cuenta = (extra: Partial<Account> = {}): Account => ({
  _id: 'a1',
  nombre: 'Cuenta ING',
  saldo: 10000,
  saldoInicial: 10000,
  fechaInicialSaldo: '2026-01-01',
  historicoSaldos: [],
  interes: 0,
  periodoCobro: 'mensual',
  activo: true,
  simulacion: false,
  esCuentaPrincipal: true,
  modeloFondo: 'cuenta',
  aportaciones: [],
  planAportaciones: [],
  ...extra,
});

function entorno({
  accounts = [cuenta()],
  expenses = [],
  nominas = [],
}: {
  accounts?: Account[];
  expenses?: Expense[];
  nominas?: Nomina[];
} = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.set('accounts', accounts);
  store.set('expenses', expenses);
  store.set('nominas', nominas);
  store.patchConfig({ dashboardStart: '2026-01-01', dashboardEnd: '2026-12-31' });
  const flags = createFlags(store);
  flags.setEnabled('accounts', true);
  const ledger = createLedger(store);
  const onDatosCambiados = vi.fn();
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(
    createAccountsFeature({
      store,
      ledger,
      onDatosCambiados,
      hoy: () => HOY_ISO,
    }),
  );
  return { store, ledger, flags, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-accounts') as HTMLElement;
const modal = () => document.getElementById('modal-content') as HTMLElement;
const overlayOculto = () => document.getElementById('modal-overlay')?.classList.contains('hidden');
const clic = (raiz: HTMLElement, sel: string) => (raiz.querySelector(sel) as HTMLElement | null)?.click();
const escribir = (sel: string, valor: string) => {
  (modal().querySelector(sel) as HTMLInputElement).value = valor;
};

const ctxBase: CardCtx = {
  config: {
    dashboardStart: '2026-01-01',
    dashboardEnd: '2026-12-31',
    usarInflacion: false,
  } as CardCtx['config'],
  inflacion: [],
  nominas: [],
  tramosIRPF: TRAMOS_IRPF_FALLBACK,
  tramosGanancias: TRAMOS_AHORRO_FALLBACK,
  flujos: () => FLUJOS_VACIOS,
  invModo: () => 'proyeccion',
};

beforeEach(() => {
  montarShell();
  vi.restoreAllMocks();
});

describe('tarjeta de cuenta', () => {
  it('muestra saldo inicial, saldo actual y ausencia de histórico', () => {
    const html = renderAccountCard(cuenta(), ctxBase);
    expect(html).toContain('Saldo inicial');
    expect(html).toContain('Saldo actual');
    expect(html).toContain('Sin histórico');
    expect(html).toContain('Sin remuneración');
  });

  it('el saldo actual sale del último punto de control, no de saldoInicial', () => {
    const acc = cuenta({
      saldoInicial: 10000,
      historicoSaldos: [
        { _id: 'p1', fecha: '2026-05-01', saldo: 12000 },
        { _id: 'p2', fecha: '2026-06-01', saldo: 13500 },
      ],
    });
    const html = renderAccountCard(acc, ctxBase);
    expect(html).toContain('13.500');
    expect(html).toContain('2 puntos en histórico');
  });

  it('escapa el nombre y la descripción', () => {
    const html = renderAccountCard(cuenta({ nombre: '<img src=x onerror=alert(1)>', descripcion: '<b>ojo</b>' }), ctxBase);
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<b>ojo</b>');
    expect(html).toContain('&lt;img src=x');
  });

  it('con rentabilidad estima los intereses del período del dashboard', () => {
    const html = renderAccountCard(cuenta({ interes: 3 }), ctxBase);
    expect(html).toContain('Remuneración estimada');
    expect(html).toContain('Intereses brutos');
    expect(html).not.toContain('Beneficio real');
  });

  it('el beneficio real solo aparece con el módulo de inflación activo y datos', () => {
    const periodos = [{ _id: 'i1', year: 2026, tasa: 3 }];
    const conDatos = { ...ctxBase, inflacion: periodos };
    expect(renderAccountCard(cuenta({ interes: 3 }), conDatos)).not.toContain('Beneficio real');

    const activo = { ...conDatos, config: { ...ctxBase.config, usarInflacion: true } };
    const html = renderAccountCard(cuenta({ interes: 3 }), activo);
    expect(html).toContain('Pérdida poder adq.');
    expect(html).toContain('Beneficio real');
  });

  it('la cuenta principal no ofrece el botón de marcarla como principal', () => {
    expect(renderAccountCard(cuenta({ esCuentaPrincipal: true }), ctxBase)).not.toContain('data-principal-acc');
    expect(renderAccountCard(cuenta({ esCuentaPrincipal: false }), ctxBase)).toContain('data-principal-acc');
  });
});

describe('tarjeta beneficio', () => {
  const tarjeta = cuenta({ _id: 'ben', modeloFondo: 'beneficio', tipoBeneficio: 'transporte', esCuentaPrincipal: false });
  const nomina = (extra: Partial<Nomina> = {}): Nomina => ({
    _id: 'n1',
    nombre: 'Empresa',
    bruto: 40000,
    nPagas: 12,
    irpfModo: 'auto',
    irpfPct: 0,
    representacion: 'detallado',
    cuenta: 'a1',
    activo: true,
    tags: ['nomina'],
    grupoNomina: '',
    ...extra,
  });

  it('sin nómina vinculada lo dice en vez de callarse', () => {
    expect(renderAccountCard(tarjeta, ctxBase)).toContain('Sin nómina vinculada');
  });

  it('suma las recargas de las nóminas y avisa si superan el límite exento', () => {
    const noms = [nomina({ retribucionFlexible: [{ tipo: 'transporte', importe: 200, cuenta: 'ben' }] })];
    const html = renderAccountCard(tarjeta, { ...ctxBase, nominas: noms });
    expect(html).toContain('Recarga mensual');
    expect(html).toContain('excede límite'); // 200 × 12 = 2.400 > 1.500
    expect(html).toContain('Ahorro IRPF estimado');
  });

  it('el ahorro fiscal se calcula sobre el importe exento y el marginal de la base', () => {
    // 200 €/mes = 2.400 €/año, pero solo 1.500 están exentos.
    // `bruto` YA es anual: 40.000 − 2.400 de flexible, menos las reducciones,
    // deja una base imponible en el tramo del 30 % → 1.500 × 30 % = 450 €.
    // El legacy hacía `bruto × nPagas` aquí y se iba al 47 % (705 €).
    const noms = [nomina({ retribucionFlexible: [{ tipo: 'transporte', importe: 200, cuenta: 'ben' }] })];
    const html = renderAccountCard(tarjeta, { ...ctxBase, nominas: noms });
    expect(html).toContain('(30%)');
    expect(html).toContain('450,00');
  });

  it('con grupo de nóminas usa el marginal del grupo, no el de una sola', () => {
    const enGrupo = { ...tarjeta, grupoNomina: 'Familia' };
    const noms = [
      nomina({
        _id: 'n1',
        bruto: 20000,
        grupoNomina: 'Familia',
        retribucionFlexible: [{ tipo: 'transporte', importe: 50, cuenta: 'ben' }],
      }),
      nomina({ _id: 'n2', bruto: 20000, grupoNomina: 'Familia' }),
    ];
    const html = renderAccountCard(enGrupo, { ...ctxBase, nominas: noms });
    expect(html).toContain('grupo &quot;Familia&quot;');
  });
});

describe('cartera de fondos de inversión', () => {
  const fondo = cuenta({
    _id: 'f1',
    nombre: 'Vanguard Global',
    modeloFondo: 'inversion',
    esCuentaPrincipal: false,
    saldoInicial: 15000,
    aportaciones: [{ _id: 'ap1', fecha: '2024-01-01', cantidad: 10000 }],
  });

  it('no se pinta si no hay fondos de inversión', () => {
    expect(carteraFiscalHtml([cuenta()], TRAMOS_AHORRO_FALLBACK)).toBe('');
  });

  it('agrega valor, coste base, plusvalía e impuesto', () => {
    const html = carteraFiscalHtml([cuenta(), fondo], TRAMOS_AHORRO_FALLBACK);
    expect(html).toContain('Cartera — Fondos de Inversión');
    expect(html).toContain('Coste base total');
    expect(html).toContain('Plusvalía latente (50.0%)'); // 5.000 sobre 10.000
    expect(html).toContain('Impuesto estimado');
  });

  it('la tarjeta del fondo alterna entre situación real y proyección', () => {
    expect(renderAccountCard(fondo, ctxBase)).toContain('Valor proyectado');
    const real = renderAccountCard(fondo, { ...ctxBase, invModo: () => 'real' });
    expect(real).toContain('Valor actual');
    expect(real).not.toContain('Valor proyectado');
  });

  it('sin transferencias en el período invita a crearlas', () => {
    expect(renderAccountCard(fondo, ctxBase)).toContain('Gastos e Ingresos');
  });
});

describe('vista completa', () => {
  it('pinta una tarjeta por cuenta y oculta los planes de pensiones', () => {
    const { registry } = entorno({
      accounts: [cuenta(), cuenta({ _id: 'p1', nombre: 'Plan Pensiones', modeloFondo: 'pension', esCuentaPrincipal: false })],
    });
    registry.mount('accounts');
    expect(vista().innerHTML).toContain('Cuenta ING');
    expect(vista().innerHTML).not.toContain('Plan Pensiones');
  });

  it('marca otra cuenta como principal y deja solo una', () => {
    const { store, registry } = entorno({
      accounts: [cuenta(), cuenta({ _id: 'a2', nombre: 'Ahorro', esCuentaPrincipal: false })],
    });
    registry.mount('accounts');
    clic(vista(), '[data-principal-acc="a2"]');
    const principales = store.get('accounts').filter((a) => a.esCuentaPrincipal);
    expect(principales.map((a) => a._id)).toEqual(['a2']);
  });

  it('no deja borrar la última cuenta', () => {
    const { store, registry } = entorno();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    registry.mount('accounts');
    clic(vista(), '[data-borrar-acc="a1"]');
    expect(store.get('accounts')).toHaveLength(1);
  });

  it('al borrar la principal designa otra: los gastos nuevos necesitan una', () => {
    const { store, registry } = entorno({
      accounts: [cuenta(), cuenta({ _id: 'a2', nombre: 'Ahorro', esCuentaPrincipal: false })],
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    registry.mount('accounts');
    clic(vista(), '[data-borrar-acc="a1"]');
    expect(store.get('accounts')).toHaveLength(1);
    expect(store.get('accounts')[0].esCuentaPrincipal).toBe(true);
  });

  it('el conmutador real/proyección de un fondo repinta la tarjeta', () => {
    const { registry } = entorno({
      accounts: [
        cuenta({
          _id: 'f1',
          modeloFondo: 'inversion',
          saldoInicial: 15000,
          aportaciones: [{ _id: 'ap1', fecha: '2024-01-01', cantidad: 10000 }],
        }),
      ],
    });
    registry.mount('accounts');
    expect(vista().innerHTML).toContain('Valor proyectado');
    clic(vista(), '[data-inv-modo="f1|real"]');
    expect(vista().innerHTML).toContain('Valor actual');
    expect(vista().innerHTML).not.toContain('Valor proyectado');
  });
});

describe('formulario de cuenta', () => {
  it('no ofrece crear planes de pensiones (se gestionan en Nóminas)', () => {
    const { registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-nueva-acc]');
    expect(modal().innerHTML).toContain('Fondo de inversión');
    expect(modal().innerHTML).not.toContain('Plan de pensiones');
  });

  it('exige nombre', () => {
    const { store, registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-nueva-acc]');
    escribir('#ac-nombre', '   ');
    clic(modal(), '[data-guardar-acc]');
    expect(store.get('accounts')).toHaveLength(1);
    expect(overlayOculto()).toBe(false);
  });

  it('crea una cuenta y registra su saldo como punto de control', () => {
    const { store, ledger, registry, onDatosCambiados } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-nueva-acc]');
    escribir('#ac-nombre', 'Ahorro');
    escribir('#ac-saldo', '2500');
    escribir('#ac-saldo-ini', '2000');
    clic(modal(), '[data-guardar-acc]');

    const nueva = store.get('accounts').find((a) => a.nombre === 'Ahorro') as Account;
    expect(nueva).toBeDefined();
    expect(nueva.saldoInicial).toBe(2000);
    const puntos = ledger.puntosControl(nueva._id);
    expect(puntos).toHaveLength(1);
    expect(puntos[0].saldoCts).toBe(250000);
    expect(puntos[0].fecha).toBe(HOY_ISO);
    // El puente con el legacy replica el punto en historicoSaldos
    expect((store.get('accounts').find((a) => a._id === nueva._id) as Account).historicoSaldos).toHaveLength(1);
    expect(onDatosCambiados).toHaveBeenCalled();
    expect(overlayOculto()).toBe(true);
  });

  it('una cuenta nueva con saldo 0 no ancla ningún punto', () => {
    const { store, ledger, registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-nueva-acc]');
    escribir('#ac-nombre', 'Vacía');
    escribir('#ac-saldo', '0');
    clic(modal(), '[data-guardar-acc]');
    const nueva = store.get('accounts').find((a) => a.nombre === 'Vacía') as Account;
    expect(ledger.puntosControl(nueva._id)).toHaveLength(0);
  });

  it('editar sin tocar el saldo no crea puntos de control nuevos', () => {
    const { store, ledger, registry } = entorno();
    ledger.registrarPuntoControl('a1', '2026-06-01', 10000, 'Extracto');
    registry.mount('accounts');
    clic(vista(), '[data-editar-acc="a1"]');
    escribir('#ac-nombre', 'Cuenta ING renombrada');
    clic(modal(), '[data-guardar-acc]');

    expect(store.get('accounts')[0].nombre).toBe('Cuenta ING renombrada');
    expect(ledger.puntosControl('a1')).toHaveLength(1);
  });

  it('cambiar el saldo de un fondo registra punto y aportación (coste base)', () => {
    const { store, ledger, registry } = entorno({
      accounts: [cuenta({ modeloFondo: 'inversion', aportaciones: [{ _id: 'ap1', fecha: '2024-01-01', cantidad: 10000 }] })],
    });
    ledger.registrarPuntoControl('a1', '2026-06-01', 10000);
    registry.mount('accounts');
    clic(vista(), '[data-editar-acc="a1"]');
    escribir('#ac-saldo', '12000');
    clic(modal(), '[data-guardar-acc]');

    expect(ledger.puntosControl('a1')).toHaveLength(2);
    const aportaciones = (store.get('accounts')[0].aportaciones ?? []).map((a) => a.cantidad);
    expect(aportaciones).toEqual([10000, 2000]);
  });

  it('el grupo de nóminas solo se guarda en las tarjetas beneficio', () => {
    const { store, registry } = entorno({
      accounts: [cuenta({ grupoNomina: 'Familia' })],
      nominas: [
        {
          _id: 'n1',
          nombre: 'Empresa',
          bruto: 30000,
          nPagas: 12,
          irpfModo: 'auto',
          irpfPct: 0,
          representacion: 'detallado',
          cuenta: 'a1',
          activo: true,
          tags: [],
          grupoNomina: 'Familia',
        },
      ],
    });
    registry.mount('accounts');
    clic(vista(), '[data-editar-acc="a1"]');
    clic(modal(), '[data-guardar-acc]');
    // Sigue siendo 'cuenta': se conserva el grupo previo en vez de borrarlo
    expect(store.get('accounts')[0].grupoNomina).toBe('Familia');
  });
});

describe('histórico de saldos (puntos de control)', () => {
  it('lista los puntos del ledger, no los de la cuenta', () => {
    const { store, ledger, registry } = entorno();
    ledger.registrarPuntoControl('a1', '2026-03-01', 8000, 'Extracto marzo');
    // Un histórico "a mano" en la cuenta no debe salir: manda el ledger
    store.updateItem('accounts', 'a1', {
      historicoSaldos: [...store.get('accounts')[0].historicoSaldos, { _id: 'x', fecha: '2026-04-01', saldo: 99999 }],
    });
    registry.mount('accounts');
    clic(vista(), '[data-hist-acc="a1"]');

    expect(modal().innerHTML).toContain('Extracto marzo');
    expect(modal().innerHTML).not.toContain('99.999');
  });

  it('añade un punto de control con fecha y saldo', () => {
    const { ledger, registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-hist-acc="a1"]');
    escribir('#hi-fecha', '2026-07-01');
    escribir('#hi-saldo', '11500');
    escribir('#hi-nota', 'Extracto julio');
    clic(modal(), '[data-hist-anadir]');

    const puntos = ledger.puntosControl('a1');
    expect(puntos).toHaveLength(1);
    expect(puntos[0].saldoCts).toBe(1150000);
    expect(puntos[0].nota).toBe('Extracto julio');
  });

  it('rechaza un punto sin saldo', () => {
    const { ledger, registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-hist-acc="a1"]');
    escribir('#hi-saldo', '');
    clic(modal(), '[data-hist-anadir]');
    expect(ledger.puntosControl('a1')).toHaveLength(0);
  });

  it('borra un punto de control', () => {
    const { ledger, registry } = entorno();
    const punto = ledger.registrarPuntoControl('a1', '2026-03-01', 8000);
    registry.mount('accounts');
    clic(vista(), '[data-hist-acc="a1"]');
    clic(modal(), `[data-hist-borrar="a1|${punto._id}"]`);
    expect(ledger.puntosControl('a1')).toHaveLength(0);
  });

  it('reestablece el punto inicial del extracto desde un punto de control', () => {
    const { store, ledger, registry } = entorno();
    const punto = ledger.registrarPuntoControl('a1', '2026-03-01', 8000);
    registry.mount('accounts');
    clic(vista(), '[data-hist-acc="a1"]');
    clic(modal(), `[data-hist-inicial="a1|${punto._id}"]`);

    const acc = store.get('accounts')[0];
    expect(acc.saldoInicial).toBe(8000);
    expect(acc.fechaInicialSaldo).toBe('2026-03-01');
  });

  it('"actualizar saldo base" recalibra todas las cuentas activas a hoy', () => {
    const { store, ledger, registry } = entorno({
      accounts: [cuenta(), cuenta({ _id: 'a2', nombre: 'Ahorro', esCuentaPrincipal: false, saldoInicial: 500 })],
    });
    ledger.registrarPuntoControl('a1', '2026-06-01', 12345);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    registry.mount('accounts');
    clic(vista(), '[data-reset-base]');

    const [a1, a2] = store.get('accounts');
    expect(a1.saldoInicial).toBe(12345);
    expect(a1.fechaInicialSaldo).toBe(HOY_ISO);
    // Sin puntos de control, cae en el saldo declarado de la cuenta
    expect(a2.fechaInicialSaldo).toBe(HOY_ISO);
  });
});

describe('tramos de ganancias de capital', () => {
  it('lista la tabla por defecto y permite añadir un ejercicio', () => {
    const { store, registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-tramos-ganancias]');
    expect(modal().innerHTML).toContain('Por defecto');
    expect(modal().innerHTML).toContain('19%');

    escribir('#tg-new-year', '2027');
    clic(modal(), '[data-anadir-anyo-tg]');
    const historico = store.get('tramosGananciasCapitalHistorico');
    expect(historico.map((e) => e.año)).toEqual([2027]);
    // Y abre el editor de ese ejercicio
    expect(modal().innerHTML).toContain('Ganancias de capital — 2027');
  });

  it('rechaza un año fuera de rango y los duplicados', () => {
    const { store, registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-tramos-ganancias]');
    escribir('#tg-new-year', '1800');
    clic(modal(), '[data-anadir-anyo-tg]');
    expect(store.get('tramosGananciasCapitalHistorico')).toHaveLength(0);

    escribir('#tg-new-year', '2027');
    clic(modal(), '[data-anadir-anyo-tg]');
    clic(modal(), '[data-volver-tg]');
    escribir('#tg-new-year', '2027');
    clic(modal(), '[data-anadir-anyo-tg]');
    expect(store.get('tramosGananciasCapitalHistorico')).toHaveLength(1);
  });

  it('guarda la tabla por defecto ordenada y sin perder lo escrito al añadir filas', () => {
    const { store, registry } = entorno();
    registry.mount('accounts');
    clic(vista(), '[data-tramos-ganancias]');
    clic(modal(), '[data-editar-tg="default"]');

    escribir('[data-tg-min="0"]', '30000');
    escribir('[data-tg-pct="0"]', '25');
    clic(modal(), '[data-tg-anadir]');
    // Lo escrito sobrevive al repintado
    expect((modal().querySelector('[data-tg-min="0"]') as HTMLInputElement).value).toBe('30000');

    escribir('[data-tg-min="5"]', '0');
    escribir('[data-tg-pct="5"]', '19');
    clic(modal(), '[data-tg-guardar]');

    const tramos = store.get('config').tramosGananciasCapital;
    expect(tramos[0]).toEqual([0, 19]);
    expect(tramos.some(([desde, pct]) => desde === 30000 && pct === 25)).toBe(true);
  });

  it('elimina una tabla de ejercicio tras confirmar', () => {
    const { store, registry } = entorno();
    store.set('tramosGananciasCapitalHistorico', [{ _id: 't1', año: 2027, tramos: TRAMOS_AHORRO_FALLBACK }]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    registry.mount('accounts');
    clic(vista(), '[data-tramos-ganancias]');
    clic(modal(), '[data-borrar-tg="2027"]');
    expect(store.get('tramosGananciasCapitalHistorico')).toHaveLength(0);
  });
});
