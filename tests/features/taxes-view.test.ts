// @vitest-environment happy-dom
// Vista de Fiscalidad portada al paquete nuevo (1.7 — 7/9): resumen, pestañas,
// borrador de la declaración y análisis de fondos y planes de pensiones.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createTaxesFeature } from '@/features/taxes';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Account, Expense, Nomina } from '@/state/schema';

const HOY = new Date(2026, 6, 31);
const HOY_ISO = '2026-07-31';

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"></li>
      <li class="nav-section"><button class="nav-btn" data-view="rentas"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container"><div id="view-dashboard" class="view active"></div></main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const nomina = (extra: Partial<Nomina> = {}): Nomina => ({
  _id: 'n1',
  nombre: 'Empresa S.A.',
  bruto: 40000,
  nPagas: 12,
  irpfModo: 'auto',
  irpfPct: 0,
  representacion: 'detallado',
  cuenta: 'default',
  activo: true,
  tags: ['nomina'],
  grupoNomina: '',
  escenarioIds: [],
  ...extra,
});

const cuenta = (extra: Partial<Account> = {}): Account => ({
  _id: 'a1',
  nombre: 'Cuenta',
  saldo: 0,
  saldoInicial: 0,
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
  escenarioIds: [],
  ...extra,
});

const fondo = cuenta({
  _id: 'f1',
  nombre: 'Vanguard Global',
  modeloFondo: 'inversion',
  esCuentaPrincipal: false,
  saldoInicial: 15000,
  aportaciones: [{ _id: 'ap1', fecha: '2024-01-01', cantidad: 10000 }],
});

const plan = cuenta({
  _id: 'p1',
  nombre: 'Plan de Pensiones ING',
  modeloFondo: 'pension',
  esCuentaPrincipal: false,
  saldoInicial: 12000,
  bloqueoMeses: 120,
  impuestoRetirada: 24,
  aportaciones: [
    { _id: 'x1', fecha: '2015-01-01', cantidad: 8000 },
    { _id: 'x2', fecha: '2026-03-01', cantidad: 1000 },
  ],
});

function entorno({
  nominas = [nomina()],
  accounts = [cuenta()],
  expenses = [],
}: { nominas?: Nomina[]; accounts?: Account[]; expenses?: Expense[] } = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.set('nominas', nominas);
  store.set('accounts', accounts);
  store.set('expenses', expenses);
  const flags = createFlags(store);
  flags.setEnabled('fiscalidad', true);
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(createTaxesFeature({ store, hoy: () => HOY_ISO }));
  return { store, flags, registry };
}

const vista = () => document.getElementById('view-rentas') as HTMLElement;
const clic = (sel: string) => (vista().querySelector(sel) as HTMLElement | null)?.click();
const cuadro = () => (vista().querySelector('#renta-cuadro') as HTMLElement).textContent?.replace(/\s+/g, ' ') ?? '';

beforeEach(() => {
  montarShell();
  vi.restoreAllMocks();
});

describe('resumen y navegación', () => {
  it('sin nóminas ni fondos no pinta el resumen', () => {
    entorno({ nominas: [] }).registry.mount('rentas');
    expect(vista().querySelector('.exec-summary')).toBeNull();
    expect(vista().innerHTML).toContain('Fiscalidad');
  });

  it('el resumen habla en importes anuales y descuenta la Seguridad Social', () => {
    entorno().registry.mount('rentas');
    const resumen = (vista().querySelector('.exec-summary') as HTMLElement).textContent ?? '';
    expect(resumen).toContain('IRPF trabajo');
    expect(resumen).toContain('/año');
    // 40.000 brutos: el neto está por debajo del bruto y muy por encima de cero.
    // El legacy hacía (bruto × 12) − IRPF × 12 y daba cientos de miles.
    const neto = Number(((resumen.match(/Neto trabajo([\d.,]+)/) || [])[1] || '0').replace(/\./g, '').replace(',', '.'));
    expect(neto).toBeGreaterThan(20000);
    expect(neto).toBeLessThan(40000);
  });

  it('arranca en la declaración y cambia de pestaña sin repintar el resumen', () => {
    entorno().registry.mount('rentas');
    expect(vista().innerHTML).toContain('Borrador — Ejercicio 2026');

    clic('[data-tab-fisc="trabajo"]');
    expect(vista().innerHTML).toContain('Nóminas activas — importes anuales');
    expect(vista().innerHTML).not.toContain('Borrador — Ejercicio');

    clic('[data-tab-fisc="inmobiliario"]');
    expect(vista().innerHTML).toContain('En construcción');

    clic('[data-tab-fisc="declaracion"]');
    expect(vista().innerHTML).toContain('Borrador — Ejercicio 2026');
  });
});

describe('borrador de la declaración', () => {
  it('avisa si no hay nóminas configuradas', () => {
    entorno({ nominas: [] }).registry.mount('rentas');
    expect(vista().innerHTML).toContain('No tienes nóminas configuradas');
  });

  it('lista las nóminas y los planes detectados', () => {
    entorno({ nominas: [nomina()], accounts: [cuenta(), plan] }).registry.mount('rentas');
    expect(vista().innerHTML).toContain('Empresa S.A.');
    expect(vista().innerHTML).toContain('Plan de Pensiones ING');
  });

  it('escapa el nombre de la nómina', () => {
    entorno({ nominas: [nomina({ nombre: '<img src=x onerror=alert(1)>' })] }).registry.mount('rentas');
    expect(vista().innerHTML).not.toContain('<img src=x');
  });

  it('con una sola nómina el resultado sale a cero', () => {
    entorno().registry.mount('rentas');
    expect(cuadro()).toContain('A DEVOLVER');
    expect(cuadro()).toMatch(/A DEVOLVER 0,00/);
  });

  it('escribir en los campos manuales recalcula solo el cuadro', () => {
    entorno().registry.mount('rentas');
    const antes = vista().querySelector('#rex-mobiliario') as HTMLInputElement;
    antes.value = '5000';
    antes.dispatchEvent(new Event('input', { bubbles: true }));

    expect(cuadro()).toContain('BASE IMPONIBLE DEL AHORRO');
    expect(cuadro()).toContain('5000,00');
    // El input sigue en el DOM con su valor: no se ha repintado la pestaña
    expect((vista().querySelector('#rex-mobiliario') as HTMLInputElement).value).toBe('5000');
  });

  it('los importes manuales sobreviven al cambio de pestaña', () => {
    entorno().registry.mount('rentas');
    const campo = vista().querySelector('#rex-mobiliario') as HTMLInputElement;
    campo.value = '7000';
    campo.dispatchEvent(new Event('input', { bubbles: true }));

    clic('[data-tab-fisc="trabajo"]');
    clic('[data-tab-fisc="declaracion"]');
    expect((vista().querySelector('#rex-mobiliario') as HTMLInputElement).value).toBe('7000');
    expect(cuadro()).toContain('7000,00');
  });

  it('las aportaciones del año a planes de pensiones se deducen', () => {
    entorno({ accounts: [cuenta(), plan] }).registry.mount('rentas');
    // Solo la de 2026 (1.000 €), no la de 2015
    expect(cuadro()).toContain('Aportaciones a planes de pensiones');
    expect(cuadro()).toContain('1000,00');
    expect(cuadro()).toContain('A DEVOLVER');
  });

  it('los ingresos sujetos a IRPF entran anualizados por su periodo', () => {
    const ingreso: Expense = {
      _id: 'e1',
      concepto: 'Alquiler trastero',
      cuantia: 100,
      tipo: 'ingreso',
      tipoFrecuencia: 'mensual',
      frecuencia: 3, // cada tres meses → 400 €/año, no 3.600
      tags: [],
      activo: true,
      sujetoIRPF: true,
      escenarioIds: [],
    };
    entorno({ nominas: [], expenses: [ingreso] }).registry.mount('rentas');
    expect(cuadro()).toContain('Otros ingresos sujetos a IRPF');
    expect(cuadro()).toContain('400,00');
    expect(cuadro()).not.toContain('3600,00');
  });
});

describe('pestaña de capital mobiliario', () => {
  it('sin fondos remite a Cuentas y Ahorro', () => {
    entorno().registry.mount('rentas');
    clic('[data-tab-fisc="mobiliario"]');
    expect(vista().innerHTML).toContain('Sin fondos de inversión');
  });

  it('resume la cartera y detalla cada fondo', () => {
    entorno({ accounts: [cuenta(), fondo] }).registry.mount('rentas');
    clic('[data-tab-fisc="mobiliario"]');
    const html = vista().innerHTML;
    expect(html).toContain('Cartera de fondos — resumen');
    expect(html).toContain('Vanguard Global');
    expect(html).toContain('Plusvalía latente (+50.0%)'); // 5.000 sobre 10.000
    expect(html).toContain('Neto tras liquidar');
    expect(html).toContain('Tipo marginal'); // tabla de tramos del ahorro
  });

  it('escapa el nombre del fondo', () => {
    entorno({ accounts: [cuenta(), { ...fondo, nombre: '<b>x</b>' }] }).registry.mount('rentas');
    clic('[data-tab-fisc="mobiliario"]');
    expect(vista().innerHTML).not.toContain('<b>x</b>');
  });
});

describe('pestaña de rendimientos del trabajo', () => {
  it('presenta los importes como anuales y con la cotización descontada', () => {
    entorno().registry.mount('rentas');
    clic('[data-tab-fisc="trabajo"]');
    const html = vista().innerHTML;
    expect(html).toContain('Bruto anual total');
    expect(html).toContain('Cotización SS anual');
    expect(html).toContain('Neto anual');
    expect(html).not.toContain('Bruto mensual');
  });

  it('el IRPF de la pestaña cuadra con el del resumen', () => {
    const { registry } = entorno();
    registry.mount('rentas');
    const resumen = (vista().querySelector('.exec-summary') as HTMLElement).textContent ?? '';
    const irpfResumen = (resumen.match(/IRPF trabajo([\d.,]+)/) || [])[1];
    clic('[data-tab-fisc="trabajo"]');
    expect(vista().innerHTML.replace(/&nbsp;| /g, ' ')).toContain(irpfResumen as string);
  });

  it('marca la aportación que supera el límite deducible', () => {
    const excedido = { ...plan, aportaciones: [{ _id: 'x', fecha: '2026-02-01', cantidad: 3000 }] };
    entorno({ accounts: [cuenta(), excedido] }).registry.mount('rentas');
    clic('[data-tab-fisc="trabajo"]');
    expect(vista().innerHTML).toContain('supera el límite deducible');
  });

  it('sin planes de pensiones remite a Nóminas', () => {
    entorno().registry.mount('rentas');
    clic('[data-tab-fisc="trabajo"]');
    expect(vista().innerHTML).toContain('Sin planes de pensiones');
  });
});
