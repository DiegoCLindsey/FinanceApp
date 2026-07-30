// @vitest-environment happy-dom
// Vista de Contabilidad en el paquete nuevo y registro de features
// (F4 tarea 4.3, F1 tarea 1.7 — infraestructura).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createAccountingFeature } from '@/features/accounting';
import { createLedger } from '@/accounting/ledger';
import { createTagService } from '@/accounting/tags';
import { createPrecisionAnalyzer } from '@/accounting/precision';
import { createAdjuster } from '@/accounting/adjust';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Expense } from '@/state/schema';

const HOY = new Date(2026, 6, 30); // 2026-07-30

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="expenses"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container">
      <div id="view-dashboard" class="view active"></div>
      <div id="view-expenses" class="view hidden"></div>
    </main></div>`;
}

const estimacionLuz: Omit<Expense, '_id'> = {
  concepto: 'Luz',
  cuantia: 100,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  frecuencia: 1,
  fechaInicio: '2025-01-10',
  fechaFin: null,
  tags: ['casa'],
  activo: true,
  escenarioIds: [],
};

function entorno({ conDatos = false }: { conDatos?: boolean } = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const ledger = createLedger(store);
  const flags = createFlags(store);
  const estimacion = store.addItem('expenses', estimacionLuz);

  if (conDatos) {
    ledger.registrarPuntoControl('default', '2026-04-01', 2000);
    ledger.registrar({
      fecha: '2026-05-10',
      cuentaId: 'default',
      importe: 150,
      concepto: 'Endesa mayo',
      tipo: 'gasto',
      tags: ['casa'],
      estimacionId: estimacion._id,
    });
    ledger.registrar({
      fecha: '2026-06-10',
      cuentaId: 'default',
      importe: 160,
      concepto: 'Endesa junio',
      tipo: 'gasto',
      tags: ['casa'],
      estimacionId: estimacion._id,
    });
  }

  const onDatosCambiados = vi.fn();
  const feature = createAccountingFeature({
    ledger,
    tags: createTagService(store),
    precision: createPrecisionAnalyzer(ledger),
    adjuster: createAdjuster(store),
    accounts: () => store.get('accounts'),
    estimaciones: () => store.get('expenses'),
    onDatosCambiados,
  });
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(feature);
  return { store, ledger, flags, feature, registry, estimacion, onDatosCambiados };
}

function contenedor(): HTMLElement {
  return document.getElementById('view-contabilidad') as HTMLElement;
}

describe('registro de features', () => {
  beforeEach(() => montarShell());

  it('crea el contenedor y el botón de sidebar de la vista', () => {
    const { registry } = entorno();
    expect(document.getElementById('view-contabilidad')).not.toBeNull();
    const btn = document.querySelector<HTMLElement>('.nav-btn[data-view="contabilidad"]');
    expect(btn?.textContent).toContain('Contabilidad');
    // En la sección declarada por el manifest ("Mi dinero" = índice 1)
    expect(document.querySelectorAll('.nav-section')[1].contains(btn as Node)).toBe(true);
    expect(registry.routes()).toEqual(['contabilidad']);
    expect(registry.has('contabilidad')).toBe(true);
  });

  it('no duplica contenedor ni botón al re-adjuntar', () => {
    const { registry } = entorno();
    registry.attachToShell();
    registry.attachToShell();
    expect(document.querySelectorAll('#view-contabilidad')).toHaveLength(1);
    expect(document.querySelectorAll('.nav-btn[data-view="contabilidad"]')).toHaveLength(1);
  });

  it('una feature con su flag apagado desaparece de las rutas y no se monta', () => {
    const { registry, flags } = entorno();
    flags.setEnabled('contabilidad', false);
    expect(registry.routes()).toEqual([]);
    expect(registry.has('contabilidad')).toBe(false);
    expect(registry.mount('contabilidad')).toBe(false);
  });

  it('mount devuelve false para una ruta desconocida', () => {
    const { registry } = entorno();
    expect(registry.mount('inexistente')).toBe(false);
  });

  it('flagPorRuta expone el mapa para el gating', () => {
    const { registry } = entorno();
    expect(registry.flagPorRuta()).toEqual({ contabilidad: 'contabilidad' });
  });

  it('rerender vuelve a montar la vista activa', () => {
    const { registry } = entorno();
    registry.mount('contabilidad');
    contenedor().innerHTML = '';
    registry.rerender();
    expect(contenedor().querySelector('.page-title')).not.toBeNull();
  });
});

describe('vista de contabilidad', () => {
  beforeEach(() => montarShell());

  it('pinta el resumen y los dos paneles', () => {
    const { registry } = entorno({ conDatos: true });
    expect(registry.mount('contabilidad')).toBe(true);
    const c = contenedor();
    expect(c.querySelector('.page-title')?.textContent).toContain('Contabilidad');
    expect(c.querySelector('#acc-transacciones table')).not.toBeNull();
    expect(c.querySelector('#acc-precision table')).not.toBeNull();
    // El saldo real de hoy sale del ledger: 2000 − 150 − 160
    expect(c.textContent).toContain('1690');
  });

  it('el filtro de mes limita los movimientos mostrados', () => {
    const { registry } = entorno({ conDatos: true });
    registry.mount('contabilidad');
    // Mes por defecto: julio 2026, sin movimientos
    expect(contenedor().querySelectorAll('[data-tx]')).toHaveLength(0);

    const mes = contenedor().querySelector<HTMLInputElement>('#acc-mes') as HTMLInputElement;
    mes.value = '2026-05';
    mes.dispatchEvent(new Event('change', { bubbles: true }));
    expect(contenedor().querySelectorAll('[data-tx]')).toHaveLength(1);
  });

  it('registra un movimiento desde el formulario', () => {
    const { registry, ledger, onDatosCambiados } = entorno();
    registry.mount('contabilidad');
    const c = contenedor();
    (c.querySelector('#nt-concepto') as HTMLInputElement).value = 'Agua';
    (c.querySelector('#nt-importe') as HTMLInputElement).value = '45.50';
    (c.querySelector('#nt-tags') as HTMLInputElement).value = 'casa, agua';
    (c.querySelector('#nt-guardar') as HTMLElement).click();

    const txs = ledger.transacciones();
    expect(txs).toHaveLength(1);
    expect(txs[0].importeCts).toBe(-4550);
    expect(txs[0].tags).toEqual(['casa', 'agua']);
    expect(onDatosCambiados).toHaveBeenCalled();
    // Y la vista se ha refrescado con la fila nueva
    expect(contenedor().querySelectorAll('[data-tx]')).toHaveLength(1);
  });

  it('valida concepto e importe antes de registrar', () => {
    const { registry, ledger } = entorno();
    registry.mount('contabilidad');
    (contenedor().querySelector('#nt-guardar') as HTMLElement).click();
    expect(ledger.transacciones()).toHaveLength(0);

    (contenedor().querySelector('#nt-concepto') as HTMLInputElement).value = 'Sin importe';
    (contenedor().querySelector('#nt-guardar') as HTMLElement).click();
    expect(ledger.transacciones()).toHaveLength(0);
  });

  it('registra un saldo real y lo usa como ancla', () => {
    const { registry, ledger } = entorno();
    registry.mount('contabilidad');
    const c = contenedor();
    (c.querySelector('#pc-fecha') as HTMLInputElement).value = '2026-07-01';
    (c.querySelector('#pc-saldo') as HTMLInputElement).value = '3000';
    (c.querySelector('#pc-nota') as HTMLInputElement).value = 'extracto';
    (c.querySelector('#pc-guardar') as HTMLElement).click();

    expect(ledger.puntosControl('default')).toHaveLength(1);
    expect(ledger.saldoCuenta('default', '2026-07-15')).toBe(3000);
    expect(contenedor().textContent).toContain('extracto');
  });

  it('asigna una transacción a una estimación desde el selector', () => {
    const { registry, ledger, estimacion } = entorno();
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 20, concepto: 'Suelto', tipo: 'gasto' });
    registry.mount('contabilidad');

    const select = contenedor().querySelector<HTMLSelectElement>('[data-tx-estimacion]') as HTMLSelectElement;
    select.value = estimacion._id;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(ledger.transacciones()[0].estimacionId).toBe(estimacion._id);
  });

  it('sin datos reales el panel de precisión explica qué hacer', () => {
    const { registry } = entorno();
    registry.mount('contabilidad');
    expect(contenedor().textContent).toContain('Todavía no hay datos reales');
    expect(contenedor().querySelector('[data-sugerir]')).toBeNull();
  });

  it('muestra la precisión por estimación y por etiqueta', () => {
    const { registry } = entorno({ conDatos: true });
    registry.mount('contabilidad');
    const texto = contenedor().textContent ?? '';
    expect(texto).toContain('Precisión de las estimaciones');
    expect(texto).toContain('Precisión conjunta por etiqueta');
    expect(texto).toContain('casa');
    // Estimado 200 vs real 310 → precisión 45 %
    expect(texto).toContain('45.0%');
  });

  it('el botón de sugerencia propone la media real y aplica el ajuste', () => {
    const { registry, store, estimacion } = entorno({ conDatos: true });
    registry.mount('contabilidad');
    const boton = contenedor().querySelector<HTMLElement>('[data-sugerir]') as HTMLElement;
    expect(boton.textContent).toContain('155'); // media de 150 y 160

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    boton.click();

    const expenses = store.get('expenses');
    expect(expenses).toHaveLength(2);
    expect(expenses.find((e) => e._id === estimacion._id)?.fechaFin).toBe('2026-07-30');
    const nueva = expenses.find((e) => e.ajustadaDesdeId === estimacion._id);
    expect(nueva?.cuantia).toBe(155);
    expect(nueva?.fechaInicio).toBe('2026-07-30');
  });

  it('cancelar la confirmación no aplica el ajuste', () => {
    const { registry, store } = entorno({ conDatos: true });
    registry.mount('contabilidad');
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    (contenedor().querySelector('[data-sugerir]') as HTMLElement).click();
    expect(store.get('expenses')).toHaveLength(1);
  });

  it('"ajustar todas" aplica las sugerencias en bloque', () => {
    const { registry, store, ledger } = entorno({ conDatos: true });
    // Segunda estimación también desviada
    const otra = store.addItem('expenses', { ...estimacionLuz, concepto: 'Agua', cuantia: 50, tags: ['agua'] });
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 90, concepto: 'Canal', tipo: 'gasto', estimacionId: otra._id });
    registry.mount('contabilidad');

    const boton = contenedor().querySelector<HTMLElement>('#ajustar-todas') as HTMLElement;
    expect(boton.textContent).toContain('(2)');

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    boton.click();

    const expenses = store.get('expenses');
    expect(expenses).toHaveLength(4); // 2 cerradas + 2 continuaciones
    expect(expenses.filter((e) => e.ajustadaDesdeId)).toHaveLength(2);
  });

  it('escapa el contenido de texto de los movimientos', () => {
    const { registry, ledger } = entorno();
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 10, concepto: '<img src=x onerror=alert(1)>', tipo: 'gasto' });
    registry.mount('contabilidad');
    expect(contenedor().querySelector('img')).toBeNull();
    expect(contenedor().innerHTML).toContain('&lt;img');
  });
});
