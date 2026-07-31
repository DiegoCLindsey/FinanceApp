// @vitest-environment happy-dom
// Vista de Gastos e Ingresos portada al paquete nuevo (F1, tarea 1.7 — 3/9),
// incluida la retirada del historial de precios (tarea 4.8).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createExpensesFeature } from '@/features/expenses';
import { diaPagoWidget, leerDiaPago, partesDiaPago, sincronizarDiaPago } from '@/features/shared/dia-pago';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Expense } from '@/state/schema';

const HOY = new Date(2026, 6, 31);
const HOY_ISO = '2026-07-31';

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="expenses"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="escenarios"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container"><div id="view-dashboard" class="view active"></div></main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const gasto = (extra: Partial<Expense> = {}): Expense => ({
  _id: 'e1',
  concepto: 'Alquiler',
  cuantia: 800,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  frecuencia: 1,
  fechaInicio: '2025-01-01',
  fechaFin: null,
  cuenta: 'acc1',
  tags: ['vivienda'],
  activo: true,
  escenarioIds: [],
  ...extra,
});

function entorno({ expenses = [gasto()], escenarios = [] }: { expenses?: Expense[]; escenarios?: { _id: string; nombre: string }[] } = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.set('accounts', [
    { ...store.get('accounts')[0], _id: 'acc1', nombre: 'Nómina' },
    { ...store.get('accounts')[0], _id: 'acc2', nombre: 'Ahorro', esCuentaPrincipal: false },
  ]);
  store.set('expenses', expenses);
  store.set('escenarios', escenarios as never);
  const flags = createFlags(store);
  flags.setEnabled('expenses', true);
  const onDatosCambiados = vi.fn();
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(createExpensesFeature({ store, onDatosCambiados, hoy: () => HOY_ISO }));
  return { store, flags, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-expenses') as HTMLElement;
const modal = () => document.getElementById('modal-content') as HTMLElement;
const overlayOculto = () => document.getElementById('modal-overlay')?.classList.contains('hidden');
const filas = () => [...vista().querySelectorAll('.exp-table-row')];
const conceptos = () => filas().map((f) => f.querySelector('.exp-table-row > div > div')?.textContent?.trim());

/**
 * happy-dom (v15) ignora el atributo `selected` al parsear innerHTML: el
 * `selectedIndex` de un <select> creado así se queda en 1 (o -1) sea cual sea la
 * opción marcada. Los navegadores reales sí lo respetan —verificado en Chromium
 * al portar esta vista—, así que la dirección "pintar el valor guardado" se
 * comprueba sobre el atributo y la dirección "leer" fijando `.value` a mano.
 */
const opcionMarcada = (raiz: ParentNode, sel: string) => raiz.querySelector(`${sel} option[selected]`)?.getAttribute('value') ?? null;
const fijar = (raiz: ParentNode, sel: string, valor: string) => {
  (raiz.querySelector(sel) as HTMLSelectElement).value = valor;
};

describe('widget de día efectivo', () => {
  it('descompone y recompone el valor serializado', () => {
    expect(partesDiaPago('dia:15')).toMatchObject({ modo: 'dia', dia: '15' });
    expect(partesDiaPago('nthweekday:-1:5')).toMatchObject({ modo: 'nthweekday', nth: '-1', wd: '5' });
    expect(partesDiaPago('')).toMatchObject({ modo: 'none' });
    expect(partesDiaPago(undefined)).toMatchObject({ modo: 'none' });
  });

  it('marca en el HTML la opción guardada', () => {
    document.body.innerHTML = diaPagoWidget('dia:ultimo');
    expect(opcionMarcada(document, '[data-dp-modo]')).toBe('dia');
    expect(opcionMarcada(document, '[data-dp-dnum]')).toBe('ultimo');

    document.body.innerHTML = diaPagoWidget('nthweekday:-1:5');
    expect(opcionMarcada(document, '[data-dp-modo]')).toBe('nthweekday');
    expect(opcionMarcada(document, '[data-dp-n]')).toBe('-1');
    expect(opcionMarcada(document, '[data-dp-wd]')).toBe('5');
  });

  it('serializa cada modo tal como lo entiende el motor', () => {
    const casos: [string, string, Record<string, string>][] = [
      ['', 'none', {}],
      ['dia:15', 'dia', { '[data-dp-dnum]': '15' }],
      ['dia:ultimo', 'dia', { '[data-dp-dnum]': 'ultimo' }],
      ['nthweekday:2:3', 'nthweekday', { '[data-dp-n]': '2', '[data-dp-wd]': '3' }],
      ['nthweekday:-1:5', 'nthweekday', { '[data-dp-n]': '-1', '[data-dp-wd]': '5' }],
    ];
    for (const [esperado, modo, piezas] of casos) {
      document.body.innerHTML = diaPagoWidget('');
      fijar(document, '[data-dp-modo]', modo);
      for (const [sel, valor] of Object.entries(piezas)) fijar(document, sel, valor);
      expect(leerDiaPago(document)).toBe(esperado);
    }
  });

  it('muestra solo las piezas del modo activo', () => {
    document.body.innerHTML = diaPagoWidget('dia:15');
    const visible = (sel: string) => (document.querySelector(sel) as HTMLElement).style.display !== 'none';
    expect(visible('[data-dp-dia]')).toBe(true);
    expect(visible('[data-dp-nth]')).toBe(false);

    (document.querySelector('[data-dp-modo]') as HTMLSelectElement).value = 'nthweekday';
    sincronizarDiaPago(document);
    expect(visible('[data-dp-dia]')).toBe(false);
    expect(visible('[data-dp-nth]')).toBe(true);
  });

  it('sin widget en el DOM devuelve vacío en vez de lanzar', () => {
    document.body.innerHTML = '<div></div>';
    expect(leerDiaPago(document)).toBe('');
    expect(() => sincronizarDiaPago(document)).not.toThrow();
  });
});

describe('vista de gastos', () => {
  beforeEach(() => montarShell());

  it('se registra y lista los movimientos', () => {
    const { registry } = entorno();
    expect(registry.routes()).toContain('expenses');
    registry.mount('expenses');
    expect(filas()).toHaveLength(1);
    expect(vista().textContent).toContain('Alquiler');
    expect(vista().textContent).toContain('Nómina'); // nombre de la cuenta, no el id
  });

  it('escapa el texto del usuario', () => {
    const { registry } = entorno({ expenses: [gasto({ concepto: '<img src=x onerror=alert(1)>', tags: ['<b>t</b>'] })] });
    registry.mount('expenses');
    expect(vista().querySelector('img')).toBeNull();
    expect(vista().querySelector('b')).toBeNull();
    expect(vista().textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('oculta los expirados salvo que se pidan', () => {
    const { registry } = entorno({
      expenses: [gasto(), gasto({ _id: 'e2', concepto: 'Viejo', fechaFin: '2025-12-31' })],
    });
    registry.mount('expenses');
    expect(filas()).toHaveLength(1);

    const toggle = vista().querySelector<HTMLInputElement>('[data-expirados]') as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));
    expect(filas()).toHaveLength(2);
  });

  it('filtra por tipo, cuenta y fechas', () => {
    const { registry } = entorno({
      expenses: [gasto(), gasto({ _id: 'e2', concepto: 'Sueldo', tipo: 'ingreso', cuenta: 'acc2', fechaInicio: '2026-03-01' })],
    });
    registry.mount('expenses');

    const cambiar = (sel: string, valor: string) => {
      const el = vista().querySelector<HTMLSelectElement | HTMLInputElement>(sel) as HTMLSelectElement;
      el.value = valor;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    cambiar('[data-f-tipo]', 'ingreso');
    expect(conceptos()).toEqual(['Sueldo']);
    cambiar('[data-f-tipo]', '');
    cambiar('[data-f-cuenta]', 'acc2');
    expect(conceptos()).toEqual(['Sueldo']);
    cambiar('[data-f-cuenta]', '');
    cambiar('[data-f-desde]', '2026-01-01');
    expect(conceptos()).toEqual(['Sueldo']);

    (vista().querySelector('[data-limpiar]') as HTMLElement).click();
    expect(filas()).toHaveLength(2);
  });

  it('filtra por etiqueta al pulsar el chip, y se puede limpiar', () => {
    const { registry } = entorno({
      expenses: [gasto(), gasto({ _id: 'e2', concepto: 'Luz', tags: ['suministros'] })],
    });
    registry.mount('expenses');

    (vista().querySelector('.tag-filter-bar [data-tag="suministros"]') as HTMLElement).click();
    expect(conceptos()).toEqual(['Luz']);

    (vista().querySelector('[data-limpiar-tags]') as HTMLElement).click();
    expect(filas()).toHaveLength(2);
  });

  it('ordena al pulsar una cabecera y alterna el sentido', () => {
    const { registry } = entorno({
      expenses: [gasto({ _id: 'e2', concepto: 'Zapatos', cuantia: 50 }), gasto({ concepto: 'Alquiler', cuantia: 800 })],
    });
    registry.mount('expenses');
    expect(conceptos()).toEqual(['Alquiler', 'Zapatos']); // orden por concepto, asc

    const cuantia = () => vista().querySelector('[data-orden="cuantia"]') as HTMLElement;
    cuantia().click();
    expect(conceptos()).toEqual(['Zapatos', 'Alquiler']);
    cuantia().click();
    expect(conceptos()).toEqual(['Alquiler', 'Zapatos']);
  });

  it('el interruptor de la fila activa y desactiva sin abrir el formulario', () => {
    const { registry, store, onDatosCambiados } = entorno();
    registry.mount('expenses');
    const toggle = vista().querySelector<HTMLInputElement>('[data-activo="e1"]') as HTMLInputElement;
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    expect(store.get('expenses')[0].activo).toBe(false);
    expect(onDatosCambiados).toHaveBeenCalled();
    expect(overlayOculto()).toBe(true);
  });
});

describe('formulario de gastos', () => {
  beforeEach(() => montarShell());

  const abrirNuevo = (registry: ReturnType<typeof entorno>['registry']) => {
    registry.mount('expenses');
    (vista().querySelector('[data-nuevo]') as HTMLElement).click();
  };
  const escribir = (sel: string, valor: string) => {
    (modal().querySelector(sel) as HTMLInputElement).value = valor;
  };
  const guardar = () => (modal().querySelector('[data-guardar]') as HTMLElement).click();

  it('crea un movimiento nuevo', () => {
    const { registry, store, onDatosCambiados } = entorno({ expenses: [] });
    abrirNuevo(registry);

    escribir('#ef-concepto', 'Gimnasio');
    escribir('#ef-cuantia', '39.5');
    escribir('#ef-tags', 'salud, ocio');
    guardar();

    expect(store.get('expenses')).toHaveLength(1);
    expect(store.get('expenses')[0]).toMatchObject({
      concepto: 'Gimnasio',
      cuantia: 39.5,
      tipo: 'gasto',
      tags: ['salud', 'ocio'],
      activo: true,
    });
    expect(onDatosCambiados).toHaveBeenCalled();
    expect(overlayOculto()).toBe(true);
  });

  it('exige concepto y cuantía, y deja el formulario abierto si faltan', () => {
    const { registry, store } = entorno({ expenses: [] });
    abrirNuevo(registry);

    guardar();
    expect(store.get('expenses')).toHaveLength(0);
    expect(overlayOculto()).toBe(false);

    escribir('#ef-concepto', 'Solo concepto');
    guardar();
    expect(store.get('expenses')).toHaveLength(0);
  });

  it('guarda el día efectivo elegido', () => {
    const { registry, store } = entorno({ expenses: [] });
    abrirNuevo(registry);
    escribir('#ef-concepto', 'Hipoteca');
    escribir('#ef-cuantia', '600');

    const modo = modal().querySelector('[data-dp-modo]') as HTMLSelectElement;
    modo.value = 'dia';
    modo.dispatchEvent(new Event('change', { bubbles: true }));
    (modal().querySelector('[data-dp-dnum]') as HTMLSelectElement).value = 'ultimo';
    guardar();

    expect(store.get('expenses')[0].diaPago).toBe('dia:ultimo');
  });

  it('una transferencia guarda cuenta destino y la etiqueta reservada', () => {
    const { registry, store } = entorno({ expenses: [] });
    abrirNuevo(registry);
    escribir('#ef-concepto', 'Traspaso');
    escribir('#ef-cuantia', '200');

    const tipo = modal().querySelector('#ef-tipo') as HTMLSelectElement;
    tipo.value = 'transferencia';
    tipo.dispatchEvent(new Event('change', { bubbles: true }));
    // El bloque de destino deja de estar oculto
    expect((modal().querySelector('#ef-destino-wrap') as HTMLElement).style.display).toBe('');
    (modal().querySelector('#ef-cuenta-dest') as HTMLSelectElement).value = 'acc2';
    guardar();

    expect(store.get('expenses')[0]).toMatchObject({
      tipo: 'transferencia',
      cuentaDestino: 'acc2',
      tags: ['transferencia'],
      basico: false,
    });
  });

  it('"sin clasificar" se guarda como null, no como cadena vacía', () => {
    const { registry, store } = entorno({ expenses: [] });
    abrirNuevo(registry);
    escribir('#ef-concepto', 'Caprichos');
    escribir('#ef-cuantia', '20');
    (modal().querySelector('#ef-clasificacion') as HTMLSelectElement).value = '';
    guardar();

    expect(store.get('expenses')[0].clasificacion).toBeNull();
  });

  it('edita un movimiento existente conservando su id', () => {
    const { registry, store } = entorno();
    registry.mount('expenses');
    (vista().querySelector('[data-editar="e1"]') as HTMLElement).click();

    expect((modal().querySelector('#ef-concepto') as HTMLInputElement).value).toBe('Alquiler');
    escribir('#ef-cuantia', '850');
    guardar();

    expect(store.get('expenses')).toHaveLength(1);
    expect(store.get('expenses')[0]).toMatchObject({ _id: 'e1', cuantia: 850 });
  });

  it('duplicar crea uno nuevo con "(copia)" sin tocar el original', () => {
    const { registry, store } = entorno();
    registry.mount('expenses');
    (vista().querySelector('[data-duplicar="e1"]') as HTMLElement).click();

    expect((modal().querySelector('#ef-concepto') as HTMLInputElement).value).toBe('Alquiler (copia)');
    guardar();

    const lista = store.get('expenses');
    expect(lista).toHaveLength(2);
    expect(lista[0]._id).toBe('e1');
    expect(lista[1]._id).not.toBe('e1');
    expect(lista[1].concepto).toBe('Alquiler (copia)');
  });

  it('elimina tras confirmar, y no elimina si se cancela', () => {
    const { registry, store } = entorno();
    registry.mount('expenses');

    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false);
    (vista().querySelector('[data-borrar="e1"]') as HTMLElement).click();
    expect(store.get('expenses')).toHaveLength(1);

    confirmar.mockReturnValue(true);
    (vista().querySelector('[data-borrar="e1"]') as HTMLElement).click();
    expect(store.get('expenses')).toHaveLength(0);
  });

  it('muestra el selector de escenarios solo si los hay, y guarda la selección', () => {
    const sinEsc = entorno({ expenses: [] });
    abrirNuevo(sinEsc.registry);
    expect(modal().querySelector('.ef-escenario')).toBeNull();

    montarShell();
    const conEsc = entorno({ expenses: [], escenarios: [{ _id: 's1', nombre: 'Paro' }] });
    abrirNuevo(conEsc.registry);
    escribir('#ef-concepto', 'Extra');
    escribir('#ef-cuantia', '10');
    (modal().querySelector('.ef-escenario') as HTMLInputElement).checked = true;
    guardar();

    expect(conEsc.store.get('expenses')[0].escenarioIds).toEqual(['s1']);
  });

  it('cancelar cierra sin guardar', () => {
    const { registry, store } = entorno({ expenses: [] });
    abrirNuevo(registry);
    escribir('#ef-concepto', 'No guardar');
    escribir('#ef-cuantia', '1');
    (modal().querySelector('[data-cancelar]') as HTMLElement).click();

    expect(overlayOculto()).toBe(true);
    expect(store.get('expenses')).toHaveLength(0);
  });

  it('ya no hay historial de precios (retirado en v7)', () => {
    const { registry } = entorno();
    registry.mount('expenses');
    expect(vista().querySelector('[data-hist-exp]')).toBeNull();
    expect(vista().textContent).not.toContain('Historial');
  });

  it('desactivar su flag la retira de las rutas', () => {
    const { registry, flags } = entorno();
    flags.setEnabled('expenses', false);
    expect(registry.routes()).not.toContain('expenses');
  });
});
