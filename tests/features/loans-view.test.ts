// @vitest-environment happy-dom
// Vista de Préstamos portada al paquete nuevo (F1, tarea 1.7 — 4/9), incluidos
// los formularios de préstamo y amortización y el optimizador.
//
// Recordatorio del entorno: happy-dom ignora el atributo `selected` al parsear
// innerHTML (ver docs/02-plan-refactor.md), así que los `<select>` se manejan
// fijando `.value` a mano y comprobando `option[selected]` en el HTML.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createLoansFeature } from '@/features/loans';
import { renderLoanCard } from '@/features/loans/card';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Account, Loan } from '@/state/schema';

const HOY = new Date(2026, 6, 31);
const HOY_ISO = '2026-07-31';

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="loans"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="escenarios"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container"><div id="view-dashboard" class="view active"></div></main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const prestamo = (extra: Partial<Loan> = {}): Loan => ({
  _id: 'l1',
  nombre: 'Hipoteca',
  capital: 120000,
  tin: 3,
  meses: 240,
  fechaInicio: '2024-01-01',
  comisionApertura: 0,
  comisionAmort: 0,
  amortizaciones: [],
  cuenta: 'acc1',
  tags: ['vivienda'],
  activo: true,
  escenarioIds: [],
  ...extra,
});

function entorno({
  loans = [prestamo()],
  escenarios = [],
  inflacion = [],
  usarInflacion = false,
}: {
  loans?: Loan[];
  escenarios?: { _id: string; nombre: string }[];
  inflacion?: { _id: string; year: number; tasa: number }[];
  usarInflacion?: boolean;
} = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const base = store.get('accounts')[0];
  store.set('accounts', [
    { ...base, _id: 'acc1', nombre: 'Nómina', saldo: 20000, saldoInicial: 20000, fechaInicialSaldo: '2024-01-01' },
    { ...base, _id: 'acc2', nombre: 'Ahorro', esCuentaPrincipal: false, saldo: 5000, saldoInicial: 5000, fechaInicialSaldo: '2024-01-01' },
  ] as Account[]);
  store.set('loans', loans);
  store.set('escenarios', escenarios as never);
  store.set('inflacion', inflacion);
  store.patchConfig({ usarInflacion, dashboardStart: '2026-01-01', dashboardEnd: '2026-12-31' });
  const flags = createFlags(store);
  flags.setEnabled('loans', true);
  const onDatosCambiados = vi.fn();
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(createLoansFeature({ store, onDatosCambiados, hoy: () => HOY_ISO }));
  return { store, flags, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-loans') as HTMLElement;
const modal = () => document.getElementById('modal-content') as HTMLElement;
const overlayOculto = () => document.getElementById('modal-overlay')?.classList.contains('hidden');
const tarjetas = () => [...vista().querySelectorAll('.loan-card')];
const escribir = (sel: string, valor: string) => {
  (modal().querySelector(sel) as HTMLInputElement).value = valor;
};
const ctxBase = {
  periodos: [],
  usarInflacion: false,
  hoy: HOY_ISO,
  cuotaMes: 0,
  completado: false,
  nombreEscenario: (id: string) => id,
  personas: [],
};

describe('tarjeta de préstamo', () => {
  it('muestra cuota, intereses, TAE y fecha fin', () => {
    const html = renderLoanCard(prestamo(), ctxBase);
    expect(html).toContain('Cuota mensual');
    expect(html).toContain('Total intereses');
    expect(html).toContain('TAE');
    expect(html).toContain('2043-12'); // 240 meses desde 2024-01
  });

  it('escapa el nombre y las etiquetas', () => {
    const html = renderLoanCard(prestamo({ nombre: '<img src=x onerror=alert(1)>', tags: ['<b>x</b>'] }), ctxBase);
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<b>x</b>');
    expect(html).toContain('&lt;img src=x');
  });

  it('sin amortizaciones invita a optimizar; con ellas muestra el ahorro', () => {
    expect(renderLoanCard(prestamo(), ctxBase)).toContain('¿Quieres pagar menos intereses?');

    const conAmort = prestamo({ amortizaciones: [{ _id: 'a1', fecha: '2026-01-01', cantidad: 10000, tipo: 'plazo', simulacion: false }] });
    const html = renderLoanCard(conAmort, ctxBase);
    expect(html).toContain('Ahorro por amortizaciones');
    expect(html).toContain('Plazo acortado');
    expect(html).not.toContain('¿Quieres pagar menos intereses?');
  });

  it('el TIN real aparece en cuanto hay periodos de inflación, aunque el módulo esté apagado', () => {
    const periodos = [{ _id: 'i1', year: 2025, tasa: 3 }];
    expect(renderLoanCard(prestamo(), ctxBase)).not.toContain('TIN real');
    expect(renderLoanCard(prestamo(), { ...ctxBase, periodos })).toContain('TIN real');
  });

  it('el coste en euros de hoy solo sale con el módulo de inflación activo', () => {
    const periodos = [{ _id: 'i1', year: 2025, tasa: 3 }];
    expect(renderLoanCard(prestamo(), { ...ctxBase, periodos })).not.toContain('Coste ajustado a inflación');
    expect(renderLoanCard(prestamo(), { ...ctxBase, periodos, usarInflacion: true })).toContain('Coste ajustado a inflación');
  });

  it('compara contra el plan sin amortizar cuando las hay', () => {
    const periodos = [{ _id: 'i1', year: 2025, tasa: 3 }];
    const conAmort = prestamo({ amortizaciones: [{ _id: 'a1', fecha: '2026-01-01', cantidad: 10000, tipo: 'plazo', simulacion: false }] });
    const html = renderLoanCard(conAmort, { ...ctxBase, periodos, usarInflacion: true });
    expect(html).toContain('Real sin amortizar');
    expect(html).toContain('Real con amortizar');
  });

  it('marca las amortizaciones simuladas y su efecto', () => {
    const conAmort = prestamo({
      amortizaciones: [
        { _id: 'a1', fecha: '2026-01-01', cantidad: 5000, tipo: 'plazo', simulacion: true },
        { _id: 'a2', fecha: '2026-06-01', cantidad: 3000, tipo: 'cuota', simulacion: false },
      ],
    });
    const html = renderLoanCard(conAmort, ctxBase);
    expect(html).toContain('SIM');
    expect(html).toContain('REAL');
    expect(html).toContain('↓ plazo');
    expect(html).toContain('↓ cuota');
  });
});

describe('vista de préstamos', () => {
  beforeEach(() => montarShell());

  it('se registra y lista los préstamos ordenados por TIN descendente', () => {
    const { registry } = entorno({
      loans: [prestamo({ _id: 'l1', nombre: 'Barato', tin: 2 }), prestamo({ _id: 'l2', nombre: 'Caro', tin: 8 })],
    });
    expect(registry.routes()).toContain('loans');
    registry.mount('loans');
    const nombres = tarjetas().map((c) => c.querySelector('.loan-card-title')?.textContent);
    expect(nombres).toEqual(['Caro', 'Barato']);
  });

  it('sin préstamos muestra el vacío', () => {
    const { registry } = entorno({ loans: [] });
    registry.mount('loans');
    expect(vista().textContent).toContain('Sin préstamos');
  });

  it('oculta los finalizados y ofrece mostrarlos', () => {
    // 12 meses desde 2020 → terminó hace años
    const { registry } = entorno({
      loans: [prestamo(), prestamo({ _id: 'l2', nombre: 'Coche', fechaInicio: '2020-01-01', meses: 12, tin: 6 })],
    });
    registry.mount('loans');
    expect(tarjetas()).toHaveLength(1);

    const boton = vista().querySelector('[data-toggle-finalizados]') as HTMLElement;
    expect(boton.textContent).toContain('finalizados (1)');
    boton.click();
    expect(tarjetas()).toHaveLength(2);
    expect(vista().textContent).toContain('✓ Finalizado');
  });

  it('resume las cuotas del mes y la media del periodo', () => {
    const { registry } = entorno();
    registry.mount('loans');
    expect(vista().textContent).toContain('Cuotas este mes');
    expect(vista().textContent).toContain('Cuota media del período');
    expect(vista().textContent).toContain('1 préstamo activo este mes');
  });

  it('un préstamo que aún no ha empezado no cuenta para la cuota del mes', () => {
    const { registry } = entorno({ loans: [prestamo({ fechaInicio: '2030-01-01' })] });
    registry.mount('loans');
    expect(vista().textContent).not.toContain('Cuotas este mes');
  });

  it('la cabecera pliega y despliega la tarjeta, y el estado sobrevive al re-render', () => {
    const { registry } = entorno();
    registry.mount('loans');
    const body = () => vista().querySelector('[data-body-loan="l1"]') as HTMLElement;
    expect(body().classList.contains('open')).toBe(false);

    (vista().querySelector('[data-toggle-loan="l1"]') as HTMLElement).click();
    expect(body().classList.contains('open')).toBe(true);

    registry.mount('loans'); // re-render
    expect(body().classList.contains('open')).toBe(true);
  });

  it('pulsar un botón de la cabecera no pliega la tarjeta', () => {
    const { registry } = entorno();
    registry.mount('loans');
    (vista().querySelector('[data-editar-loan="l1"]') as HTMLElement).click();
    expect((vista().querySelector('[data-body-loan="l1"]') as HTMLElement).classList.contains('open')).toBe(false);
    expect(overlayOculto()).toBe(false); // abrió el formulario, eso sí
  });
});

describe('formulario de préstamo', () => {
  beforeEach(() => montarShell());

  it('crea un préstamo con amortizaciones vacías', () => {
    const { registry, store, onDatosCambiados } = entorno({ loans: [] });
    registry.mount('loans');
    (vista().querySelector('[data-nuevo-loan]') as HTMLElement).click();

    escribir('#f-nombre', 'Coche');
    escribir('#f-capital', '15000');
    escribir('#f-tin', '5.5');
    escribir('#f-meses', '60');
    escribir('#f-fecha', '2026-08-01');
    (modal().querySelector('[data-guardar-loan]') as HTMLElement).click();

    expect(store.get('loans')).toHaveLength(1);
    expect(store.get('loans')[0]).toMatchObject({ nombre: 'Coche', capital: 15000, tin: 5.5, meses: 60, amortizaciones: [] });
    expect(onDatosCambiados).toHaveBeenCalled();
    expect(overlayOculto()).toBe(true);
  });

  it('exige nombre, capital, TIN y plazo', () => {
    const { registry, store } = entorno({ loans: [] });
    registry.mount('loans');
    (vista().querySelector('[data-nuevo-loan]') as HTMLElement).click();

    (modal().querySelector('[data-guardar-loan]') as HTMLElement).click();
    expect(store.get('loans')).toHaveLength(0);
    expect(overlayOculto()).toBe(false);

    escribir('#f-nombre', 'Sin cifras');
    (modal().querySelector('[data-guardar-loan]') as HTMLElement).click();
    expect(store.get('loans')).toHaveLength(0);
  });

  it('guarda el día efectivo y las etiquetas', () => {
    const { registry, store } = entorno({ loans: [] });
    registry.mount('loans');
    (vista().querySelector('[data-nuevo-loan]') as HTMLElement).click();
    escribir('#f-nombre', 'Hipoteca');
    escribir('#f-capital', '100000');
    escribir('#f-tin', '2');
    escribir('#f-meses', '120');
    escribir('#f-tags', 'hipoteca, vivienda');

    const modo = modal().querySelector('[data-dp-modo]') as HTMLSelectElement;
    modo.value = 'dia';
    modo.dispatchEvent(new Event('change', { bubbles: true }));
    (modal().querySelector('[data-dp-dnum]') as HTMLSelectElement).value = '5';
    (modal().querySelector('[data-guardar-loan]') as HTMLElement).click();

    expect(store.get('loans')[0]).toMatchObject({ diaPago: 'dia:5', tags: ['hipoteca', 'vivienda'] });
  });

  it('edita conservando id y amortizaciones', () => {
    const amortizaciones = [{ _id: 'a1', fecha: '2026-01-01', cantidad: 5000, tipo: 'plazo', simulacion: false }];
    const { registry, store } = entorno({ loans: [prestamo({ amortizaciones })] });
    registry.mount('loans');
    (vista().querySelector('[data-editar-loan="l1"]') as HTMLElement).click();

    expect((modal().querySelector('#f-nombre') as HTMLInputElement).value).toBe('Hipoteca');
    escribir('#f-tin', '2.5');
    (modal().querySelector('[data-guardar-loan]') as HTMLElement).click();

    expect(store.get('loans')).toHaveLength(1);
    expect(store.get('loans')[0]).toMatchObject({ _id: 'l1', tin: 2.5 });
    expect(store.get('loans')[0].amortizaciones).toHaveLength(1);
  });

  it('elimina tras confirmar', () => {
    const { registry, store } = entorno();
    registry.mount('loans');
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false);
    (vista().querySelector('[data-borrar-loan="l1"]') as HTMLElement).click();
    expect(store.get('loans')).toHaveLength(1);

    confirmar.mockReturnValue(true);
    (vista().querySelector('[data-borrar-loan="l1"]') as HTMLElement).click();
    expect(store.get('loans')).toHaveLength(0);
  });

  it('el selector de escenarios guarda la selección', () => {
    const { registry, store } = entorno({ loans: [], escenarios: [{ _id: 's1', nombre: 'Paro' }] });
    registry.mount('loans');
    (vista().querySelector('[data-nuevo-loan]') as HTMLElement).click();
    escribir('#f-nombre', 'Con escenario');
    escribir('#f-capital', '1000');
    escribir('#f-tin', '1');
    escribir('#f-meses', '12');
    (modal().querySelector('.loan-escenario') as HTMLInputElement).checked = true;
    (modal().querySelector('[data-guardar-loan]') as HTMLElement).click();

    expect(store.get('loans')[0].escenarioIds).toEqual(['s1']);
  });

  it('sin una segunda persona, no aparece el widget de reparto', () => {
    const { registry } = entorno({ loans: [] });
    registry.mount('loans');
    (vista().querySelector('[data-nuevo-loan]') as HTMLElement).click();
    expect(modal().querySelector('[data-reparto="consumo"]')).toBeNull();
  });

  it('con dos personas, guarda el reparto de consumo', () => {
    const { registry, store } = entorno({ loans: [] });
    store.set('personas', [...store.get('personas'), { _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true }]);
    registry.mount('loans');
    (vista().querySelector('[data-nuevo-loan]') as HTMLElement).click();
    escribir('#f-nombre', 'Con reparto');
    escribir('#f-capital', '10000');
    escribir('#f-tin', '3');
    escribir('#f-meses', '48');

    const modo = modal().querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement;
    modo.value = 'partesIguales';
    modo.dispatchEvent(new Event('change', { bubbles: true }));
    modal()
      .querySelectorAll<HTMLInputElement>('[data-reparto-persona="consumo"]')
      .forEach((c) => (c.checked = true));
    (modal().querySelector('[data-guardar-loan]') as HTMLElement).click();

    expect(store.get('loans')[0].repartoConsumo?.modo).toBe('partesIguales');
    expect(store.get('loans')[0].repartoConsumo?.participantes).toHaveLength(2);
  });
});

describe('préstamos: pestañas por persona', () => {
  beforeEach(() => montarShell());

  it('sin una segunda persona activa, no aparecen pestañas', () => {
    const { registry } = entorno();
    registry.mount('loans');
    expect(vista().querySelector('[data-persona-tab]')).toBeNull();
  });

  it('con dos personas, filtra las tarjetas al elegir una pestaña', () => {
    const mio = prestamo({ _id: 'l1', nombre: 'Mío' });
    const deLaPareja = prestamo({
      _id: 'l2',
      nombre: 'De mi pareja',
      repartoPago: { modo: 'porcentaje', participantes: [{ personaId: 'p2', valor: 100 }] },
    });
    const { registry, store } = entorno({ loans: [mio, deLaPareja] });
    store.set('personas', [...store.get('personas'), { _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true }]);
    registry.mount('loans');

    expect(tarjetas()).toHaveLength(2);

    (vista().querySelector('[data-persona-tab="p2"]') as HTMLElement).click();
    expect(tarjetas()).toHaveLength(1);
    expect(vista().textContent).toContain('De mi pareja');
    expect(vista().textContent).not.toContain('Mío');

    (vista().querySelector('[data-persona-tab=""]') as HTMLElement).click(); // "Todas"
    expect(tarjetas()).toHaveLength(2);
  });
});

describe('amortizaciones', () => {
  beforeEach(() => montarShell());

  it('añade una amortización y despliega la tarjeta', () => {
    const { registry, store } = entorno();
    registry.mount('loans');
    (vista().querySelector('[data-amort-loan="l1"]') as HTMLElement).click();

    escribir('#am-fecha', '2027-01-01');
    escribir('#am-cant', '8000');
    (modal().querySelector('#am-tipo') as HTMLSelectElement).value = 'plazo';
    (modal().querySelector('[data-guardar-amort]') as HTMLElement).click();

    const amorts = store.get('loans')[0].amortizaciones;
    expect(amorts).toHaveLength(1);
    expect(amorts?.[0]).toMatchObject({ fecha: '2027-01-01', cantidad: 8000, tipo: 'plazo' });
    expect((vista().querySelector('[data-body-loan="l1"]') as HTMLElement).classList.contains('open')).toBe(true);
  });

  it('rechaza fecha o cantidad inválidas', () => {
    const { registry, store } = entorno();
    registry.mount('loans');
    (vista().querySelector('[data-amort-loan="l1"]') as HTMLElement).click();

    escribir('#am-cant', '0');
    (modal().querySelector('[data-guardar-amort]') as HTMLElement).click();
    expect(store.get('loans')[0].amortizaciones).toHaveLength(0);

    escribir('#am-cant', '-500');
    (modal().querySelector('[data-guardar-amort]') as HTMLElement).click();
    expect(store.get('loans')[0].amortizaciones).toHaveLength(0);
  });

  it('edita una amortización existente por su id', () => {
    const amortizaciones = [{ _id: 'a1', fecha: '2026-01-01', cantidad: 5000, tipo: 'cuota', simulacion: false }];
    const { registry, store } = entorno({ loans: [prestamo({ amortizaciones })] });
    registry.mount('loans');
    (vista().querySelector('[data-toggle-loan="l1"]') as HTMLElement).click();
    (vista().querySelector('[data-editar-amort="l1|a1"]') as HTMLElement).click();

    expect((modal().querySelector('#am-cant') as HTMLInputElement).value).toBe('5000');
    escribir('#am-cant', '7500');
    (modal().querySelector('[data-guardar-amort]') as HTMLElement).click();

    expect(store.get('loans')[0].amortizaciones).toHaveLength(1);
    expect(store.get('loans')[0].amortizaciones?.[0]).toMatchObject({ _id: 'a1', cantidad: 7500 });
  });

  it('elimina una amortización', () => {
    const amortizaciones = [
      { _id: 'a1', fecha: '2026-01-01', cantidad: 5000, tipo: 'cuota', simulacion: false },
      { _id: 'a2', fecha: '2026-06-01', cantidad: 3000, tipo: 'plazo', simulacion: false },
    ];
    const { registry, store } = entorno({ loans: [prestamo({ amortizaciones })] });
    registry.mount('loans');
    (vista().querySelector('[data-toggle-loan="l1"]') as HTMLElement).click();
    (vista().querySelector('[data-borrar-amort="l1|a1"]') as HTMLElement).click();

    expect(store.get('loans')[0].amortizaciones?.map((a) => a._id)).toEqual(['a2']);
  });
});

describe('optimizador', () => {
  beforeEach(() => montarShell());

  it('avisa si no hay préstamos activos', () => {
    const { registry } = entorno({ loans: [prestamo({ activo: false })] });
    registry.mount('loans');
    (vista().querySelector('[data-optimizar]') as HTMLElement).click();
    expect(overlayOculto()).toBe(true); // no abre modal, solo avisa
  });

  it('abre el formulario con cuentas, préstamos y márgenes', () => {
    const { registry } = entorno({ loans: [prestamo({ tin: 8 })] });
    registry.mount('loans');
    (vista().querySelector('[data-optimizar]') as HTMLElement).click();

    expect(modal().querySelectorAll('.opt-acc-radio')).toHaveLength(2);
    expect(modal().querySelectorAll('.opt-loan-check')).toHaveLength(1);
    // TIN >= 5 viene marcado por defecto
    expect((modal().querySelector('.opt-loan-check') as HTMLInputElement).checked).toBe(true);
    expect(modal().textContent).toContain('Sin márgenes configurados');
  });

  it('"Seleccionar todo" alterna las casillas', () => {
    const { registry } = entorno({ loans: [prestamo({ tin: 2 }), prestamo({ _id: 'l2', nombre: 'Otro', tin: 8 })] });
    registry.mount('loans');
    (vista().querySelector('[data-optimizar]') as HTMLElement).click();

    (modal().querySelector('[data-opt-todos]') as HTMLElement).click();
    let checks = [...modal().querySelectorAll<HTMLInputElement>('.opt-loan-check')];
    expect(checks.every((c) => c.checked)).toBe(true);

    (modal().querySelector('[data-opt-todos]') as HTMLElement).click();
    checks = [...modal().querySelectorAll<HTMLInputElement>('.opt-loan-check')];
    expect(checks.every((c) => !c.checked)).toBe(true);
  });

  it('sin excedente ofrece volver a los parámetros', () => {
    // Sin ingresos ni saldo suficiente el optimizador no encuentra plan
    const { registry } = entorno({ loans: [prestamo({ tin: 8 })] });
    registry.mount('loans');
    (vista().querySelector('[data-optimizar]') as HTMLElement).click();
    escribir('#opt-min', '999999');
    (modal().querySelector('[data-opt-calcular]') as HTMLElement).click();

    expect(modal().textContent).toContain('Sin excedente disponible');
    (modal().querySelector('[data-opt-volver]') as HTMLElement).click();
    expect(modal().textContent).toContain('Optimizar amortizaciones');
  });

  it('el plan calculado se puede aplicar como simulación', () => {
    const { registry, store } = entorno({ loans: [prestamo({ tin: 9, capital: 20000, meses: 60 })] });
    registry.mount('loans');
    (vista().querySelector('[data-optimizar]') as HTMLElement).click();
    escribir('#opt-min', '100');
    escribir('#opt-horizonte', '24');
    (modal().querySelector('[data-opt-calcular]') as HTMLElement).click();

    // Con 20.000 € de saldo y sin márgenes definidos, debe salir plan
    expect(modal().textContent).toContain('Plan mes a mes');
    (modal().querySelector('[data-opt-aplicar]') as HTMLElement).click();

    const amorts = store.get('loans')[0].amortizaciones ?? [];
    expect(amorts.length).toBeGreaterThan(0);
    expect(amorts.every((a) => a.simulacion)).toBe(true);
    expect(amorts.every((a) => String(a._id).startsWith('opt_'))).toBe(true);
  });

  it('recalcular sustituye el plan anterior en vez de acumularlo', () => {
    const { registry, store } = entorno({ loans: [prestamo({ tin: 9, capital: 20000, meses: 60 })] });
    registry.mount('loans');
    const calcularYAplicar = (horizonte: string) => {
      (vista().querySelector('[data-optimizar]') as HTMLElement).click();
      escribir('#opt-min', '100');
      escribir('#opt-horizonte', horizonte);
      (modal().querySelector('[data-opt-calcular]') as HTMLElement).click();
      (modal().querySelector('[data-opt-aplicar]') as HTMLElement).click();
    };
    calcularYAplicar('24');
    const primeras = (store.get('loans')[0].amortizaciones ?? []).length;
    calcularYAplicar('12');
    const segundas = store.get('loans')[0].amortizaciones ?? [];

    expect(primeras).toBeGreaterThan(0);
    expect(segundas.length).toBeLessThanOrEqual(primeras);
    // Ninguna duplicada
    expect(new Set(segundas.map((a) => a._id)).size).toBe(segundas.length);
  });

  it('una amortización manual sobrevive al plan del optimizador', () => {
    const manual = { _id: 'mia', fecha: '2026-09-01', cantidad: 1000, tipo: 'plazo', simulacion: false };
    const { registry, store } = entorno({ loans: [prestamo({ tin: 9, capital: 20000, meses: 60, amortizaciones: [manual] })] });
    registry.mount('loans');
    (vista().querySelector('[data-optimizar]') as HTMLElement).click();
    escribir('#opt-min', '100');
    escribir('#opt-horizonte', '24');
    (modal().querySelector('[data-opt-calcular]') as HTMLElement).click();
    (modal().querySelector('[data-opt-aplicar]') as HTMLElement).click();

    expect(store.get('loans')[0].amortizaciones?.some((a) => a._id === 'mia')).toBe(true);
  });

  it('la comparativa lista frecuencias y permite usar una', () => {
    const { registry, store } = entorno({ loans: [prestamo({ tin: 9, capital: 20000, meses: 60 })] });
    registry.mount('loans');
    (vista().querySelector('[data-optimizar]') as HTMLElement).click();
    escribir('#opt-min', '100');
    escribir('#opt-horizonte', '24');
    (modal().querySelector('[data-opt-comparar]') as HTMLElement).click();

    expect(modal().textContent).toContain('Comparativa de frecuencias');
    const usar = modal().querySelector('[data-opt-usar]') as HTMLElement;
    expect(usar).not.toBeNull();
    usar.click();

    expect(modal().textContent).toContain('aplicado');
    expect((store.get('loans')[0].amortizaciones ?? []).length).toBeGreaterThan(0);
  });

  it('desactivar su flag la retira de las rutas', () => {
    const { registry, flags } = entorno();
    flags.setEnabled('loans', false);
    expect(registry.routes()).not.toContain('loans');
  });
});
