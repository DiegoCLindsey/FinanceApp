// @vitest-environment happy-dom
// Pestañas "Movimientos" y "Cierre y precisión" (panel de precisión) de la
// vista fusionada Cuentas y Contabilidad — antes vivían en la vista
// independiente "Contabilidad" (features/accounting, retirada al fusionarla
// con Cuentas).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createAccountsFeature } from '@/features/accounts';
import { createLedger } from '@/accounting/ledger';
import { createTagService } from '@/accounting/tags';
import { createPrecisionAnalyzer } from '@/accounting/precision';
import { createAdjuster } from '@/accounting/adjust';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Expense, Loan, Nomina } from '@/state/schema';

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
    </main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
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
  const feature = createAccountsFeature({
    store,
    ledger,
    tags: createTagService(store),
    precision: createPrecisionAnalyzer(ledger),
    adjuster: createAdjuster(store),
    hoy: () => '2026-07-30',
    onDatosCambiados,
  });
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(feature);
  return { store, ledger, flags, feature, registry, estimacion, onDatosCambiados };
}

function contenedor(): HTMLElement {
  return document.getElementById('view-accounts') as HTMLElement;
}

/** Cambia de pestaña dentro de la vista ya montada. */
function irAPestana(id: 'cuentas' | 'movimientos' | 'importar' | 'cierre'): void {
  (contenedor().querySelector<HTMLElement>(`[data-cuentas-tab="${id}"]`) as HTMLElement).click();
}

describe('vista fusionada — pestaña Movimientos', () => {
  beforeEach(() => montarShell());

  it('pinta la tabla de movimientos', () => {
    const { registry } = entorno({ conDatos: true });
    expect(registry.mount('accounts')).toBe(true);
    irAPestana('movimientos');
    const c = contenedor();
    expect(c.querySelector('#acc-tx table')).not.toBeNull();
  });

  it('el filtro de mes limita los movimientos mostrados', () => {
    const { registry } = entorno({ conDatos: true });
    registry.mount('accounts');
    irAPestana('movimientos');
    // Mes por defecto: julio 2026, sin movimientos
    expect(contenedor().querySelectorAll('[data-tx]')).toHaveLength(0);

    const mes = contenedor().querySelector<HTMLInputElement>('#acc-mes') as HTMLInputElement;
    mes.value = '2026-05';
    mes.dispatchEvent(new Event('change', { bubbles: true }));
    expect(contenedor().querySelectorAll('[data-tx]')).toHaveLength(1);
  });

  it('registra un movimiento desde el formulario', () => {
    const { registry, ledger, onDatosCambiados } = entorno();
    registry.mount('accounts');
    irAPestana('movimientos');
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
    registry.mount('accounts');
    irAPestana('movimientos');
    (contenedor().querySelector('#nt-guardar') as HTMLElement).click();
    expect(ledger.transacciones()).toHaveLength(0);

    (contenedor().querySelector('#nt-concepto') as HTMLInputElement).value = 'Sin importe';
    (contenedor().querySelector('#nt-guardar') as HTMLElement).click();
    expect(ledger.transacciones()).toHaveLength(0);
  });

  it('registra un saldo real y lo usa como ancla', () => {
    const { registry, ledger } = entorno();
    registry.mount('accounts');
    irAPestana('movimientos');
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
    registry.mount('accounts');
    irAPestana('movimientos');

    const select = contenedor().querySelector<HTMLSelectElement>('[data-tx-estimacion]') as HTMLSelectElement;
    select.value = estimacion._id;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(ledger.transacciones()[0].estimacionId).toBe(estimacion._id);
  });

  it('la estimación relacionada también ofrece préstamos y nóminas activos', () => {
    const { registry, store, ledger } = entorno();
    const prestamo = store.addItem('loans', {
      nombre: 'Hipoteca',
      capital: 100000,
      tin: 2,
      meses: 240,
      fechaInicio: '2020-01-01',
      amortizaciones: [],
      tags: [],
      activo: true,
    } satisfies Omit<Loan, '_id'>);
    store.addItem('nominas', {
      nombre: 'Trabajo',
      bruto: 30000,
      nPagas: 12,
      irpfModo: 'auto',
      irpfPct: 15,
      representacion: 'simplificado',
      cuenta: 'default',
      activo: true,
      tags: [],
      grupoNomina: 'principal',
    } satisfies Omit<Nomina, '_id'>);
    // Uno inactivo: no debe aparecer en el selector.
    store.addItem('loans', {
      nombre: 'Cancelado',
      capital: 500,
      tin: 1,
      meses: 12,
      fechaInicio: '2020-01-01',
      amortizaciones: [],
      tags: [],
      activo: false,
    });

    const cuota = ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 400, concepto: 'Cuota hipoteca', tipo: 'gasto' });
    registry.mount('accounts');
    irAPestana('movimientos');

    const html = contenedor().innerHTML;
    expect(html).toContain('Préstamo: Hipoteca');
    expect(html).toContain('Nómina: Trabajo');
    expect(html).not.toContain('Cancelado');

    const select = contenedor().querySelector<HTMLSelectElement>(`[data-tx-estimacion="${cuota._id}"]`) as HTMLSelectElement;
    select.value = prestamo._id;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(ledger.transacciones().find((t) => t._id === cuota._id)?.estimacionId).toBe(prestamo._id);
  });

  it('reclasifica un movimiento a transferencia y deja de contar como gasto', () => {
    const { registry, ledger } = entorno();
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 100, concepto: 'Compra', tipo: 'gasto' });
    const traspaso = ledger.registrar({
      fecha: '2026-07-06',
      cuentaId: 'default',
      importe: 300,
      concepto: 'Traspaso a Ahorro',
      tipo: 'gasto',
    });
    registry.mount('accounts');
    irAPestana('movimientos');

    expect(contenedor().textContent).toContain('Gastos: -400,00');

    const select = contenedor().querySelector<HTMLSelectElement>(`[data-tx-tipo="${traspaso._id}"]`) as HTMLSelectElement;
    select.value = 'transferencia';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(ledger.transacciones().find((t) => t._id === traspaso._id)?.tipo).toBe('transferencia');
    // El importe no cambia, pero deja de sumar en "Gastos".
    expect(ledger.transacciones().find((t) => t._id === traspaso._id)?.importeCts).toBe(-30000);
    expect(contenedor().textContent).toContain('Gastos: -100,00');
  });

  it('vista agrupada: agrupa por concepto exacto en un periodo y asigna la estimación de golpe', () => {
    const { registry, ledger, estimacion } = entorno();
    ledger.registrar({ fecha: '2026-05-08', cuentaId: 'default', importe: 12.99, concepto: 'Netflix', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-06-08', cuentaId: 'default', importe: 15.99, concepto: 'Netflix', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-08', cuentaId: 'default', importe: 15.99, concepto: 'Netflix', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 20, concepto: 'Único', tipo: 'gasto' });

    registry.mount('accounts');
    irAPestana('movimientos');
    (contenedor().querySelector('[data-acc-vista="agrupado"]') as HTMLElement).click();

    const html = contenedor().innerHTML;
    expect(html).toContain('Netflix');
    expect(html).toContain('3 movimientos');
    expect(html).not.toContain('Único'); // no se repite: no forma grupo

    // Aún no hay detalle desplegado.
    expect(contenedor().querySelectorAll('[data-tx-estimacion]')).toHaveLength(0);
    (contenedor().querySelector('[data-grp-detalle="Netflix"]') as HTMLElement).click();
    expect(contenedor().querySelectorAll('[data-tx-estimacion]')).toHaveLength(3);

    const select = contenedor().querySelector<HTMLSelectElement>('[data-grp-estimacion="Netflix"]') as HTMLSelectElement;
    select.value = estimacion._id;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const netflix = ledger.transacciones({ texto: 'netflix' });
    expect(netflix).toHaveLength(3);
    expect(netflix.every((t) => t.estimacionId === estimacion._id)).toBe(true);
    // El movimiento suelto no se ha tocado.
    expect(ledger.transacciones({ texto: 'único' })[0].estimacionId).toBeNull();
  });

  it('vista de intervalo: filtra por fechas concretas de varios meses y compara real vs estimado', () => {
    const { registry, ledger } = entorno();
    ledger.registrar({ fecha: '2026-03-05', cuentaId: 'default', importe: 40, concepto: 'Marzo', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 60, concepto: 'Julio', tipo: 'gasto' });

    registry.mount('accounts');
    irAPestana('movimientos');
    // Vista mensual (julio 2026 por defecto): no ve marzo.
    expect(contenedor().textContent).not.toContain('Marzo');

    (contenedor().querySelector('[data-acc-vista="intervalo"]') as HTMLElement).click();
    const desde = contenedor().querySelector<HTMLInputElement>('#acc-intervalo-desde') as HTMLInputElement;
    desde.value = '2026-03-01';
    desde.dispatchEvent(new Event('change', { bubbles: true }));

    const html = contenedor().innerHTML;
    expect(html).toContain('Marzo');
    expect(html).toContain('Julio');
    expect(html).toContain('Real frente a estimado');
    // El intervalo por defecto llega hasta julio: marzo-julio son 5 meses.
    expect((html.match(/<polyline/g) ?? []).length).toBe(2);
    // Solo la línea "real" lleva marcadores por punto — la de "estimado" no.
    expect((html.match(/<circle/g) ?? []).length).toBe(5);
  });

  it('vista agrupada: asigna varias etiquetas a un grupo y compara lo traspasado con el gasto real', () => {
    const { registry, ledger } = entorno();
    // Traspasos recurrentes a otra cuenta que en la práctica cubren varias categorías.
    ledger.registrar({ fecha: '2026-06-01', cuentaId: 'default', importe: 300, concepto: 'Traspaso a Ahorro', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-01', cuentaId: 'default', importe: 300, concepto: 'Traspaso a Ahorro', tipo: 'gasto' });
    // Gasto real, ya con las etiquetas que se van a asignar al grupo.
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 150, concepto: 'Gasolinera', tipo: 'gasto', tags: ['gasolina'] });
    ledger.registrar({ fecha: '2026-06-15', cuentaId: 'default', importe: 100, concepto: 'Super', tipo: 'gasto', tags: ['super'] });

    registry.mount('accounts');
    irAPestana('movimientos');
    (contenedor().querySelector('[data-acc-vista="agrupado"]') as HTMLElement).click();
    (contenedor().querySelector('[data-grp-detalle="Traspaso a Ahorro"]') as HTMLElement).click();

    const input = contenedor().querySelector<HTMLInputElement>('[data-grp-tags="Traspaso a Ahorro"]') as HTMLInputElement;
    input.value = 'gasolina, super';
    (contenedor().querySelector('[data-grp-tags-asignar="Traspaso a Ahorro"]') as HTMLElement).click();

    const traspasos = ledger.transacciones({ texto: 'traspaso' });
    expect(traspasos.every((t) => t.tags.includes('gasolina') && t.tags.includes('super'))).toBe(true);

    const texto = contenedor().textContent ?? '';
    expect(texto).toContain('Traspasado');
    expect(texto).toContain('600,00'); // 300 + 300
    expect(texto).toContain('Gastado en esas etiquetas');
    expect(texto).toContain('250,00'); // 150 + 100
    expect(texto).toContain('Diferencia');
    expect(texto).toContain('-350,00'); // 250 − 600
  });

  it('escapa el contenido de texto de los movimientos', () => {
    const { registry, ledger } = entorno();
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 10, concepto: '<img src=x onerror=alert(1)>', tipo: 'gasto' });
    registry.mount('accounts');
    irAPestana('movimientos');
    expect(contenedor().querySelector('img')).toBeNull();
    expect(contenedor().innerHTML).toContain('&lt;img');
  });
});

describe('vista fusionada — pestaña Cierre y precisión (panel de precisión)', () => {
  beforeEach(() => montarShell());

  it('sin datos reales el panel de precisión explica qué hacer', () => {
    const { registry } = entorno();
    registry.mount('accounts');
    irAPestana('cierre');
    expect(contenedor().textContent).toContain('Todavía no hay datos reales');
    expect(contenedor().querySelector('[data-sugerir]')).toBeNull();
  });

  it('muestra la precisión conjunta por etiqueta', () => {
    const { registry } = entorno({ conDatos: true });
    registry.mount('accounts');
    irAPestana('cierre');
    const texto = contenedor().textContent ?? '';
    expect(texto).toContain('Precisión conjunta por etiqueta');
    expect(texto).toContain('casa');
    // Estimado 200 vs real 310 → precisión 45 %
    expect(texto).toContain('45.0%');
  });

  it('el desglose estimación a estimación es el del cierre, no una segunda tabla', () => {
    const { registry } = entorno({ conDatos: true });
    registry.mount('accounts');
    irAPestana('cierre');
    // La tabla duplicada ya no está; el detalle por estimación vive en el cierre.
    expect(contenedor().querySelector('[data-sugerir]')).toBeNull();
    expect(contenedor().textContent).toContain('Dónde te desviaste');
  });

  it('el botón de ajuste del cierre propone la media real y la aplica', () => {
    const { registry, store, estimacion } = entorno({ conDatos: true });
    registry.mount('accounts');
    irAPestana('cierre');
    const boton = contenedor().querySelector<HTMLElement>('[data-cie-ajustar]') as HTMLElement;
    expect(boton.textContent).toContain('155'); // media de 150 y 160

    boton.click();

    const expenses = store.get('expenses');
    expect(expenses).toHaveLength(2);
    expect(expenses.find((e) => e._id === estimacion._id)?.fechaFin).toBe('2026-07-30');
    const nueva = expenses.find((e) => e.ajustadaDesdeId === estimacion._id);
    expect(nueva?.cuantia).toBe(155);
    expect(nueva?.fechaInicio).toBe('2026-07-30');
  });

  it('cancelar la confirmación de «ajustar todas» no aplica nada', () => {
    const { registry, store } = entorno({ conDatos: true });
    registry.mount('accounts');
    irAPestana('cierre');
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    (contenedor().querySelector('#ajustar-todas') as HTMLElement).click();
    expect(store.get('expenses')).toHaveLength(1);
  });

  it('"ajustar todas" aplica las sugerencias en bloque', () => {
    const { registry, store, ledger } = entorno({ conDatos: true });
    // Segunda estimación también desviada
    const otra = store.addItem('expenses', { ...estimacionLuz, concepto: 'Agua', cuantia: 50, tags: ['agua'] });
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 90, concepto: 'Canal', tipo: 'gasto', estimacionId: otra._id });
    registry.mount('accounts');
    irAPestana('cierre');

    const boton = contenedor().querySelector<HTMLElement>('#ajustar-todas') as HTMLElement;
    expect(boton.textContent).toContain('(2)');

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    boton.click();

    const expenses = store.get('expenses');
    expect(expenses).toHaveLength(4); // 2 cerradas + 2 continuaciones
    expect(expenses.filter((e) => e.ajustadaDesdeId)).toHaveLength(2);
  });
});

// Un extracto importado son cientos de movimientos, y cada fila lleva dos
// desplegables con todas las previsiones: pintarlos todos tarda y deja una
// página imposible de recorrer.
describe('vista fusionada — paginado de movimientos', () => {
  beforeEach(() => montarShell());

  /** 120 movimientos en mayo de 2026, más de dos páginas. */
  function conMuchos() {
    const env = entorno();
    for (let i = 0; i < 120; i++) {
      env.ledger.registrar({
        fecha: `2026-05-${String((i % 28) + 1).padStart(2, '0')}`,
        cuentaId: 'default',
        importe: 10 + i,
        concepto: `COMPRA ${i}`,
        tipo: 'gasto',
      });
    }
    env.registry.mount('accounts');
    irAPestana('movimientos');
    const mes = contenedor().querySelector<HTMLInputElement>('#acc-mes') as HTMLInputElement;
    mes.value = '2026-05';
    mes.dispatchEvent(new Event('change', { bubbles: true }));
    return env;
  }

  const filas = () => contenedor().querySelectorAll('[data-tx]').length;
  const pulsar = (sel: string) => (contenedor().querySelector(sel) as HTMLElement).click();

  it('solo pinta la primera página y dice cuántos hay en total', () => {
    conMuchos();
    expect(filas()).toBe(50);
    expect(contenedor().textContent).toContain('1–50 de 120 movimientos');
    expect(contenedor().textContent).toContain('página 1 de 3');
  });

  it('«siguiente» avanza y la última página va corta', () => {
    conMuchos();
    pulsar('[data-acc-pagina="2"]');
    expect(contenedor().textContent).toContain('51–100 de 120');
    pulsar('[data-acc-pagina="3"]');
    expect(filas()).toBe(20);
    expect(contenedor().textContent).toContain('101–120 de 120');
  });

  it('los totales son los de todo el filtro, no los de la página', () => {
    const { ledger } = conMuchos();
    const total = ledger.transacciones({ desde: '2026-05-01', hasta: '2026-05-31' }).reduce((s, t) => s + Math.abs(t.importeCts), 0);
    // 120 gastos de 10..129 € → 8340 €
    expect(total).toBe(834000);
    expect(contenedor().textContent).toContain('8340,00');
  });

  it('se puede pedir verlos todos', () => {
    conMuchos();
    const select = contenedor().querySelector('[data-acc-por-pagina]') as HTMLSelectElement;
    select.value = '0';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(filas()).toBe(120);
  });

  it('cambiar de filtro vuelve a la primera página', () => {
    conMuchos();
    pulsar('[data-acc-pagina="3"]');
    const mes = contenedor().querySelector<HTMLInputElement>('#acc-mes') as HTMLInputElement;
    mes.value = '2026-06';
    mes.dispatchEvent(new Event('change', { bubbles: true }));
    mes.value = '2026-05';
    mes.dispatchEvent(new Event('change', { bubbles: true }));
    expect(contenedor().textContent).toContain('1–50 de 120');
  });
});
