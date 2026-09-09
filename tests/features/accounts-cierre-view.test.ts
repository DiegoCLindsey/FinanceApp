// @vitest-environment happy-dom
// Panel de cierre de mes, ahora pestaña "Cierre y precisión" de la vista
// fusionada Cuentas y Contabilidad: comparación, gasto sin prever y
// aplicación de ajustes.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createAccountsFeature } from '@/features/accounts';
import { createLedger, type Ledger } from '@/accounting/ledger';
import { createTagService } from '@/accounting/tags';
import { createPrecisionAnalyzer } from '@/accounting/precision';
import { createAdjuster } from '@/accounting/adjust';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Expense } from '@/state/schema';

const HOY = new Date(2026, 7, 15); // 2026-08-15
const HOY_ISO = '2026-08-15';

const gasto = (extra: Partial<Expense> = {}): Omit<Expense, '_id'> => ({
  concepto: 'Luz',
  cuantia: 100,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  frecuencia: 1,
  fechaInicio: '2025-01-10',
  fechaFin: null,
  tags: ['casa'],
  activo: true,
  ...extra,
});

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="expenses"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container">
      <div id="view-dashboard" class="view active"></div>
    </main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

function entorno() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const ledger = createLedger(store);
  const flags = createFlags(store);
  const onDatosCambiados = vi.fn();

  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(
    createAccountsFeature({
      store,
      ledger,
      tags: createTagService(store),
      precision: createPrecisionAnalyzer(ledger),
      adjuster: createAdjuster(store),
      hoy: () => HOY_ISO,
      onDatosCambiados,
    }),
  );
  return { store, ledger, registry, onDatosCambiados };
}

const contenedor = () => document.getElementById('view-accounts') as HTMLElement;
const cierre = () => document.getElementById('acc-cierre') as HTMLElement;
const clic = (sel: string) => cierre().querySelector<HTMLElement>(sel)?.click();

const registrar = (ledger: Ledger, fecha: string, importe: number, concepto: string, extra: Record<string, unknown> = {}) =>
  ledger.registrar({ fecha, cuentaId: 'default', importe, concepto, tipo: 'gasto', ...extra });

/** Monta la vista fusionada y va directamente a la pestaña de cierre. */
function montarEnCierre(registry: ReturnType<typeof entorno>['registry']): void {
  registry.mount('accounts');
  (contenedor().querySelector('[data-cuentas-tab="cierre"]') as HTMLElement).click();
}

describe('cierre de mes', () => {
  beforeEach(() => montarShell());

  it('sin movimientos invita a importar en vez de enseñar ceros', () => {
    const { store, registry } = entorno();
    store.addItem('expenses', gasto());
    montarEnCierre(registry);
    expect(cierre().textContent).toContain('No hay movimientos registrados');
    expect(cierre().textContent).toContain('Importa el extracto');
  });

  it('por defecto enseña el mes anterior si tiene datos', () => {
    const { store, ledger, registry } = entorno();
    store.addItem('expenses', gasto());
    registrar(ledger, '2026-07-10', 130, 'Endesa julio', { tags: ['casa'] });
    registrar(ledger, '2026-06-10', 90, 'Endesa junio', { tags: ['casa'] });
    montarEnCierre(registry);

    const sel = cierre().querySelector('#cie-mes option[selected]') as HTMLOptionElement;
    expect(sel.value).toBe('2026-07');
  });

  it('compara previsto con real y colorea la desviación', () => {
    const { store, ledger, registry } = entorno();
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    registrar(ledger, '2026-07-10', 130, 'Endesa julio', { tags: ['casa'] });
    montarEnCierre(registry);

    const txt = cierre().textContent ?? '';
    expect(txt).toContain('Gasto');
    expect(txt).toContain('previsto');
    expect(txt).toContain('Dónde te desviaste');
    expect(cierre().innerHTML).toContain('var(--red)'); // gastó de más
  });

  it('destaca el gasto que no estaba previsto', () => {
    const { store, ledger, registry } = entorno();
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 100, 'Endesa', { tags: ['casa'] });
    registrar(ledger, '2026-07-12', 60, 'BAR PEPE', { tags: ['ocio'] });
    registrar(ledger, '2026-07-19', 40, 'BAR PEPE', { tags: ['ocio'] });
    montarEnCierre(registry);

    const txt = cierre().textContent ?? '';
    expect(txt).toContain('Gasto que no tenías previsto');
    expect(txt).toContain('BAR PEPE');
  });

  it('si todo estaba previsto lo dice', () => {
    const { store, ledger, registry } = entorno();
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 100, 'Endesa', { tags: ['casa'] });
    montarEnCierre(registry);
    expect(cierre().textContent).toContain('Todo el gasto estaba previsto');
  });

  it('marca las estimaciones que no tuvieron ningún movimiento', () => {
    const { store, ledger, registry } = entorno();
    store.addItem('expenses', gasto({ concepto: 'Gimnasio', cuantia: 45, tags: ['salud'] }));
    registrar(ledger, '2026-07-10', 30, 'OTRA', { tags: ['ocio'] });
    montarEnCierre(registry);
    expect(cierre().innerHTML).toContain('sin movimiento');
  });

  it('cambiar de mes recalcula', () => {
    const { store, ledger, registry } = entorno();
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 130, 'JULIO', { tags: ['casa'] });
    registrar(ledger, '2026-06-10', 500, 'JUNIO', { tags: ['casa'] });
    montarEnCierre(registry);

    const sel = cierre().querySelector<HTMLSelectElement>('#cie-mes') as HTMLSelectElement;
    // Las opciones van de más nueva a más vieja: 2026-07, 2026-06.
    sel.selectedIndex = 1;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    expect(cierre().textContent).toContain('500');
  });

  it('propone ajuste cuando la desviación es sistemática y lo aplica', () => {
    const { store, ledger, registry, onDatosCambiados } = entorno();
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    for (const mes of ['2026-04', '2026-05', '2026-06', '2026-07']) {
      registrar(ledger, `${mes}-10`, 150, `Endesa ${mes}`, { estimacionId: luz._id });
    }
    montarEnCierre(registry);

    const boton = cierre().querySelector<HTMLElement>('[data-cie-ajustar]');
    expect(boton).not.toBeNull();

    boton?.click();
    // El ajuste cierra la estimación vieja y abre una nueva con el importe corregido.
    const vivas = store.get('expenses').filter((e) => e.fechaFin === null);
    expect(vivas).toHaveLength(1);
    expect(vivas[0].cuantia).toBeGreaterThan(100);
    expect(onDatosCambiados).toHaveBeenCalled();
  });

  it('«ajustar todas» aplica todas las sugerencias de una vez', () => {
    const { store, ledger, registry } = entorno();
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['luz'] }));
    const sup = store.addItem('expenses', gasto({ concepto: 'Súper', cuantia: 400, tags: ['super'] }));
    for (const mes of ['2026-04', '2026-05', '2026-06', '2026-07']) {
      registrar(ledger, `${mes}-10`, 150, 'LUZ', { estimacionId: luz._id });
      registrar(ledger, `${mes}-11`, 600, 'SUPER', { estimacionId: sup._id });
    }
    montarEnCierre(registry);

    expect(cierre().innerHTML).toContain('data-cie-ajustar-todas');
    clic('[data-cie-ajustar-todas]');

    const vivas = store.get('expenses').filter((e) => e.fechaFin === null);
    expect(vivas).toHaveLength(2);
    expect(vivas.every((e) => e.cuantia > 100)).toBe(true);
  });

  it('sin desviación sistemática no ofrece ajustar', () => {
    const { store, ledger, registry } = entorno();
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    registrar(ledger, '2026-07-10', 101, 'Endesa', { estimacionId: luz._id });
    montarEnCierre(registry);
    expect(cierre().innerHTML).not.toContain('data-cie-ajustar-todas');
  });
});

// El intervalo de la cabecera del dashboard puede cruzar varios meses o cortar
// uno por la mitad; el cierre tiene que poder calcularse sobre él tal cual.
describe('cierre sobre el periodo de la cabecera', () => {
  beforeEach(() => montarShell());

  /** Entorno con el intervalo de la cabecera puesto y tres recibos mensuales. */
  function conPeriodo(desde: string, hasta: string) {
    const env = entorno();
    env.store.set('config', { ...env.store.get('config'), dashboardStart: desde, dashboardEnd: hasta });
    env.store.addItem('expenses', gasto()); // 100 €/mes, día 10
    registrar(env.ledger, '2026-04-10', 90, 'ABRIL', { tags: ['casa'] });
    registrar(env.ledger, '2026-05-10', 110, 'MAYO', { tags: ['casa'] });
    registrar(env.ledger, '2026-06-10', 100, 'JUNIO', { tags: ['casa'] });
    return env;
  }

  const precision = () => document.getElementById('acc-precision') as HTMLElement;

  it('arranca en modo mes, con su selector', () => {
    const { registry } = conPeriodo('2026-04-15', '2026-06-20');
    montarEnCierre(registry);
    expect(cierre().textContent).toContain('Cierre de mes');
    expect(cierre().querySelector('#cie-mes')).not.toBeNull();
  });

  it('al elegir el periodo cierra el intervalo entero y enseña sus fechas', () => {
    const { registry } = conPeriodo('2026-04-15', '2026-06-20');
    montarEnCierre(registry);
    clic('[data-cie-modo="periodo"]');

    const txt = cierre().textContent ?? '';
    expect(txt).toContain('Cierre del periodo');
    expect(txt).toContain('2026-04-15');
    expect(txt).toContain('2026-06-20');
    // Mayo (110) y junio (100); el recibo del 10 de abril queda fuera.
    expect(txt).toContain('210');
    expect(cierre().querySelector('#cie-mes')).toBeNull();
  });

  it('el estimado se recorta al intervalo, no cuenta meses enteros', () => {
    const { registry } = conPeriodo('2026-04-15', '2026-06-20');
    montarEnCierre(registry);
    clic('[data-cie-modo="periodo"]');
    // Dos pagos proyectados dentro del rango (mayo y junio), no tres.
    expect(cierre().textContent).toContain('200');
  });

  it('la tabla de precisión de debajo sigue el mismo periodo', () => {
    const { registry } = conPeriodo('2026-04-15', '2026-06-20');
    montarEnCierre(registry);
    expect(precision().textContent).toContain('Se comparan solo los meses ya cerrados');

    clic('[data-cie-modo="periodo"]');
    expect(precision().textContent).toContain('Limitado al periodo de la cabecera');
  });

  it('se puede volver al cierre por meses', () => {
    const { registry } = conPeriodo('2026-04-15', '2026-06-20');
    montarEnCierre(registry);
    clic('[data-cie-modo="periodo"]');
    clic('[data-cie-modo="mes"]');
    expect(cierre().textContent).toContain('Cierre de mes');
    expect(cierre().querySelector('#cie-mes')).not.toBeNull();
  });

  it('un periodo sin movimientos lo dice en vez de enseñar ceros', () => {
    const { registry } = conPeriodo('2026-01-01', '2026-02-28');
    montarEnCierre(registry);
    clic('[data-cie-modo="periodo"]');
    expect(cierre().textContent).toContain('No hay movimientos registrados');
  });
});
