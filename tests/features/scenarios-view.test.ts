// @vitest-environment happy-dom
// Vista de Escenarios portada al paquete nuevo (1.7 — 8/9): tarjetas,
// activación, formulario, filtro de cuentas y tabla comparativa.
//
// Chart.js no existe en el entorno de tests (llega por CDN en el shell), así
// que la vista debe seguir funcionando sin gráfico. Hay un test que lo fija.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createScenariosFeature } from '@/features/scenarios';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Account, Escenario, Expense, Loan } from '@/state/schema';

const HOY = new Date(2026, 6, 31);

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"></li>
      <li class="nav-section"><button class="nav-btn" data-view="escenarios"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container"><div id="view-dashboard" class="view active"></div></main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const escenario = (extra: Partial<Escenario> = {}): Escenario => ({
  _id: 'e1',
  nombre: 'Amortizo agresivo',
  color: '#6366f1',
  descripcion: '',
  fechaFin: null,
  ...extra,
});

const cuenta = (extra: Partial<Account> = {}): Account => ({
  _id: 'a1',
  nombre: 'Principal',
  saldo: 20000,
  saldoInicial: 20000,
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

const gasto = (extra: Partial<Expense> = {}): Expense => ({
  _id: 'x1',
  concepto: 'Alquiler',
  cuantia: 900,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  frecuencia: 1,
  fechaInicio: '2026-01-01',
  cuenta: 'a1',
  tags: [],
  activo: true,
  escenarioIds: [],
  ...extra,
});

function entorno({
  escenarios = [escenario()],
  accounts = [cuenta()],
  expenses = [gasto()],
  loans = [],
  escenarioActivo = null,
}: {
  escenarios?: Escenario[];
  accounts?: Account[];
  expenses?: Expense[];
  loans?: Loan[];
  escenarioActivo?: string | null;
} = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.set('escenarios', escenarios);
  store.set('accounts', accounts);
  store.set('expenses', expenses);
  store.set('loans', loans);
  store.patchConfig({ dashboardStart: '2026-01-01', dashboardEnd: '2026-12-31', fechaReferencia: '2026-01-01', escenarioActivo });
  const flags = createFlags(store);
  flags.setEnabled('supuestos', true);
  const onDatosCambiados = vi.fn();
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(createScenariosFeature({ store, onDatosCambiados }));
  return { store, flags, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-escenarios') as HTMLElement;
const modal = () => document.getElementById('modal-content') as HTMLElement;
const overlayOculto = () => document.getElementById('modal-overlay')?.classList.contains('hidden');
const clic = (raiz: HTMLElement, sel: string) => (raiz.querySelector(sel) as HTMLElement | null)?.click();

beforeEach(() => {
  montarShell();
  vi.restoreAllMocks();
});

describe('lista de escenarios', () => {
  it('sin escenarios explica para qué sirven', () => {
    entorno({ escenarios: [] }).registry.mount('escenarios');
    expect(vista().innerHTML).toContain('¿Qué son los escenarios?');
    expect(vista().querySelector('#esc-comparativa')).toBeNull();
  });

  it('sin Chart.js pinta la tabla y avisa en lugar de romperse', () => {
    entorno().registry.mount('escenarios');
    expect(vista().querySelector('#chart-comparacion')).toBeNull();
    expect(vista().innerHTML).toContain('necesita Chart.js');
    expect(vista().querySelector('#esc-comparativa')).not.toBeNull();
  });

  it('cuenta los elementos asignados por colección', () => {
    const { registry } = entorno({
      expenses: [gasto({ _id: 'x1', escenarioIds: ['e1'] }), gasto({ _id: 'x2' })],
      accounts: [cuenta(), cuenta({ _id: 'a2', nombre: 'Ahorro', esCuentaPrincipal: false, escenarioIds: ['e1'] })],
    });
    registry.mount('escenarios');
    expect(vista().innerHTML).toContain('1 gasto · 1 cuenta');
  });

  it('cuenta las amortizaciones asignadas aunque su préstamo sea de base', () => {
    const prestamo: Loan = {
      _id: 'l1',
      nombre: 'Hipoteca',
      capital: 100000,
      tin: 3,
      meses: 240,
      fechaInicio: '2024-01-01',
      amortizaciones: [{ _id: 'am1', fecha: '2026-06-01', cantidad: 5000, escenarioIds: ['e1'] }],
      tags: [],
      activo: true,
      escenarioIds: [],
    };
    entorno({ loans: [prestamo] }).registry.mount('escenarios');
    expect(vista().innerHTML).toContain('1 amortización');
  });

  it('sin elementos asignados lo dice', () => {
    entorno().registry.mount('escenarios');
    expect(vista().innerHTML).toContain('Sin elementos asignados');
  });

  it('escapa el nombre y la descripción', () => {
    entorno({ escenarios: [escenario({ nombre: '<img src=x onerror=alert(1)>', descripcion: '<b>x</b>' })] }).registry.mount('escenarios');
    expect(vista().innerHTML).not.toContain('<img src=x');
    expect(vista().innerHTML).not.toContain('<b>x</b>');
  });
});

describe('activar y desactivar', () => {
  it('activa un escenario y lo anuncia en la cabecera', () => {
    const { store, registry, onDatosCambiados } = entorno();
    registry.mount('escenarios');
    clic(vista(), '[data-activar-esc="e1"]');
    expect(store.get('config').escenarioActivo).toBe('e1');
    expect(vista().innerHTML).toContain('Escenario activo: Amortizo agresivo');
    expect(onDatosCambiados).toHaveBeenCalled();
  });

  it('vuelve a la base', () => {
    const { store, registry } = entorno({ escenarioActivo: 'e1' });
    registry.mount('escenarios');
    expect(vista().innerHTML).toContain('● Activo');
    clic(vista(), '[data-desactivar-esc]');
    expect(store.get('config').escenarioActivo).toBeNull();
    expect(vista().innerHTML).not.toContain('● Activo');
  });
});

describe('formulario', () => {
  it('exige nombre', () => {
    const { store, registry } = entorno({ escenarios: [] });
    registry.mount('escenarios');
    clic(vista(), '[data-nuevo-esc]');
    clic(modal(), '[data-guardar-esc]');
    expect(store.get('escenarios')).toHaveLength(0);
    expect(overlayOculto()).toBe(false);
  });

  it('crea un escenario con color y fecha objetivo', () => {
    const { store, registry } = entorno({ escenarios: [] });
    registry.mount('escenarios');
    clic(vista(), '[data-nuevo-esc]');
    (modal().querySelector('#esc-nombre') as HTMLInputElement).value = 'Cambio de trabajo';
    (modal().querySelector('#esc-fecha-fin') as HTMLInputElement).value = '2028-12-31';
    clic(modal(), '[data-color-esc="#10b981"]');
    clic(modal(), '[data-guardar-esc]');

    const [e] = store.get('escenarios');
    expect(e.nombre).toBe('Cambio de trabajo');
    expect(e.fechaFin).toBe('2028-12-31');
    expect(e.color).toBe('#10b981');
    expect(overlayOculto()).toBe(true);
  });

  it('edita uno existente conservando su id', () => {
    const { store, registry } = entorno();
    registry.mount('escenarios');
    clic(vista(), '[data-editar-esc="e1"]');
    (modal().querySelector('#esc-nombre') as HTMLInputElement).value = 'Renombrado';
    clic(modal(), '[data-guardar-esc]');
    expect(store.get('escenarios')).toHaveLength(1);
    expect(store.get('escenarios')[0]._id).toBe('e1');
    expect(store.get('escenarios')[0].nombre).toBe('Renombrado');
  });
});

describe('eliminar', () => {
  it('no elimina si se cancela', () => {
    const { store, registry } = entorno();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    registry.mount('escenarios');
    clic(vista(), '[data-borrar-esc="e1"]');
    expect(store.get('escenarios')).toHaveLength(1);
  });

  it('devuelve a la base los elementos asignados y desactiva el escenario', () => {
    const prestamo: Loan = {
      _id: 'l1',
      nombre: 'Hipoteca',
      capital: 100000,
      tin: 3,
      meses: 240,
      fechaInicio: '2024-01-01',
      amortizaciones: [{ _id: 'am1', fecha: '2026-06-01', cantidad: 5000, escenarioIds: ['e1'] }],
      tags: [],
      activo: true,
      escenarioIds: ['e1'],
    };
    const { store, registry } = entorno({
      loans: [prestamo],
      expenses: [gasto({ escenarioIds: ['e1'] })],
      accounts: [cuenta({ escenarioIds: ['e1'] })],
      escenarioActivo: 'e1',
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    registry.mount('escenarios');
    clic(vista(), '[data-borrar-esc="e1"]');

    expect(store.get('escenarios')).toHaveLength(0);
    expect(store.get('config').escenarioActivo).toBeNull();
    expect(store.get('loans')[0].escenarioIds).toEqual([]);
    expect(store.get('loans')[0].amortizaciones[0].escenarioIds).toEqual([]);
    expect(store.get('expenses')[0].escenarioIds).toEqual([]);
    expect(store.get('accounts')[0].escenarioIds).toEqual([]);
  });
});

describe('comparativa', () => {
  it('compara el saldo del escenario contra la base en la fecha objetivo', () => {
    // Un gasto extra de 500 €/mes solo en el escenario: 12 meses de proyección
    const { registry } = entorno({
      expenses: [gasto(), gasto({ _id: 'x2', concepto: 'Extra', cuantia: 500, escenarioIds: ['e1'] })],
    });
    registry.mount('escenarios');
    const tabla = (vista().querySelector('#esc-comparativa') as HTMLElement).textContent?.replace(/\s+/g, ' ') ?? '';
    expect(tabla).toContain('Amortizo agresivo');
    expect(tabla).toContain('2026-12-31'); // sin fechaFin usa el fin del dashboard
    expect(tabla).toContain('-6000,00'); // 500 × 12 menos que la base
  });

  it('usa la fecha objetivo del escenario cuando la tiene', () => {
    entorno({ escenarios: [escenario({ fechaFin: '2027-06-30' })] }).registry.mount('escenarios');
    expect((vista().querySelector('#esc-comparativa') as HTMLElement).textContent).toContain('2027-06-30');
  });

  it('apagar una cuenta repinta la comparativa sin tocar las tarjetas', () => {
    const { registry } = entorno({
      accounts: [cuenta(), cuenta({ _id: 'a2', nombre: 'Ahorro', esCuentaPrincipal: false, saldoInicial: 5000, saldo: 5000 })],
    });
    registry.mount('escenarios');
    const antes = (vista().querySelector('#esc-comparativa') as HTMLElement).textContent;

    clic(vista(), '[data-toggle-cuenta="a2"]');
    const despues = (vista().querySelector('#esc-comparativa') as HTMLElement).textContent;
    expect(despues).not.toBe(antes);
    // La pastilla queda tachada y la tarjeta del escenario sigue ahí
    expect((vista().querySelector('[data-toggle-cuenta="a2"]') as HTMLElement).getAttribute('style')).toContain('line-through');
    expect(vista().innerHTML).toContain('Amortizo agresivo');
  });

  it('con una sola cuenta no ofrece el filtro', () => {
    entorno().registry.mount('escenarios');
    expect(vista().querySelector('[data-toggle-cuenta]')).toBeNull();
  });
});
