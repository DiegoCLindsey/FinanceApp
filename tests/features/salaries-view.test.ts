// @vitest-environment happy-dom
// Vista de Rendimientos del Trabajo portada al paquete nuevo (1.7 — 5/9):
// nóminas agrupadas, tramos IRPF por ejercicio y planes de pensiones.
//
// Recordatorio del entorno: happy-dom ignora el atributo `selected` al parsear
// innerHTML (ver docs/02-plan-refactor.md), así que los <select> se manejan
// fijando `.value` a mano.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createSalariesFeature } from '@/features/salaries';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { Account, Nomina } from '@/state/schema';

const HOY = new Date(2026, 6, 31);
const HOY_ISO = '2026-07-31';

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="nominas"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="escenarios"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container"><div id="view-dashboard" class="view active"></div></main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const nomina = (extra: Partial<Nomina> = {}): Nomina => ({
  _id: 'n1',
  nombre: 'Empresa S.A.',
  bruto: 36000,
  nPagas: 12,
  irpfModo: 'auto',
  irpfPct: 0,
  representacion: 'detallado',
  cuenta: 'acc1',
  activo: true,
  tags: ['nomina'],
  grupoNomina: '',
  escenarioIds: [],
  ...extra,
});

function entorno({
  nominas = [nomina()],
  planes = [],
  historico = [],
}: { nominas?: Nomina[]; planes?: Partial<Account>[]; historico?: { _id: string; año: number; tramos: [number, number][] }[] } = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const base = store.get('accounts')[0];
  store.set('accounts', [
    { ...base, _id: 'acc1', nombre: 'Nómina' },
    ...planes.map((p, i) => ({ ...base, _id: `pen${i}`, esCuentaPrincipal: false, modeloFondo: 'pension', ...p }) as Account),
  ] as Account[]);
  store.set('nominas', nominas);
  store.set('tramosIRPFHistorico', historico as never);
  const flags = createFlags(store);
  flags.setEnabled('nominas', true);
  const onDatosCambiados = vi.fn();
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(createSalariesFeature({ store, onDatosCambiados, hoy: () => HOY_ISO }));
  return { store, flags, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-nominas') as HTMLElement;
const modal = () => document.getElementById('modal-content') as HTMLElement;
const overlayOculto = () => document.getElementById('modal-overlay')?.classList.contains('hidden');
const filas = () => [...vista().querySelectorAll('.exp-table-row')];
const escribir = (sel: string, valor: string) => {
  (modal().querySelector(sel) as HTMLInputElement).value = valor;
};
const fijar = (sel: string, valor: string) => {
  const el = modal().querySelector(sel) as HTMLSelectElement;
  el.value = valor;
  el.dispatchEvent(new Event('change', { bubbles: true }));
};

describe('lista de nóminas', () => {
  beforeEach(() => montarShell());

  it('se registra y lista las nóminas sueltas', () => {
    const { registry } = entorno();
    expect(registry.routes()).toContain('nominas');
    registry.mount('nominas');
    expect(filas()).toHaveLength(1);
    expect(vista().textContent).toContain('Empresa S.A.');
    expect(vista().textContent).toContain('12 pagas');
  });

  it('sin nóminas muestra el vacío', () => {
    const { registry } = entorno({ nominas: [] });
    registry.mount('nominas');
    expect(vista().textContent).toContain('Sin nóminas configuradas');
  });

  it('escapa el nombre del usuario', () => {
    const { registry } = entorno({ nominas: [nomina({ nombre: '<img src=x onerror=alert(1)>' })] });
    registry.mount('nominas');
    expect(vista().querySelector('img')).toBeNull();
    expect(vista().textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('agrupa por pagador y muestra el IRPF efectivo del grupo', () => {
    const { registry } = entorno({
      nominas: [
        nomina({ _id: 'a', nombre: 'Principal', bruto: 45000, grupoNomina: 'casa' }),
        nomina({ _id: 'b', nombre: 'Secundaria', bruto: 12000, grupoNomina: 'casa' }),
        nomina({ _id: 'c', nombre: 'Suelta', bruto: 8000 }),
      ],
    });
    registry.mount('nominas');

    expect(vista().textContent).toContain('Grupo: casa');
    expect(vista().textContent).toContain('IRPF efectivo');
    expect(filas()).toHaveLength(3);
    // Las agrupadas se marcan como tipo marginal
    expect(vista().innerHTML).toContain('marginal');
  });

  it('la nómina secundaria de un grupo tributa más que si estuviera sola', () => {
    // Se lee por patrón, no por posición del <div>: indexar la fila la ataba al
    // número exacto de divs de la plantilla y cualquier retoque de maquetación
    // la rompía dando NaN.
    const tipoAuto = (t: string) => parseFloat(t.match(/(\d+\.\d)% \(auto\)/)?.[1] ?? 'NaN');

    const sola = entorno({ nominas: [nomina({ _id: 'b', bruto: 12000 })] });
    sola.registry.mount('nominas');
    const pctSola = tipoAuto(filas()[0].textContent ?? '');
    expect(Number.isFinite(pctSola)).toBe(true);

    montarShell();
    const enGrupo = entorno({
      nominas: [nomina({ _id: 'a', bruto: 45000, grupoNomina: 'casa' }), nomina({ _id: 'b', bruto: 12000, grupoNomina: 'casa' })],
    });
    enGrupo.registry.mount('nominas');
    const textos = filas().map((f) => f.textContent ?? '');
    // La de 12.000 € aparece con un tipo mayor que aislada
    const filaSecundaria = textos.find((t) => t.includes('12.000')) ?? '';
    const pctGrupo = tipoAuto(filaSecundaria);

    expect(pctGrupo).toBeGreaterThan(pctSola);
  });

  it('muestra las etiquetas de IPC, retribución flexible y SS personalizada', () => {
    const { registry } = entorno({
      nominas: [nomina({ mesActualizacionIPC: 3, ssPct: 4.7, retribucionFlexible: [{ importe: 100 }] as never })],
    });
    registry.mount('nominas');
    expect(vista().textContent).toContain('IPC m3');
    expect(vista().textContent).toContain('SS 4.70%');
    expect(vista().textContent).toContain('RF ');
  });

  it('el interruptor activa y desactiva sin abrir el formulario', () => {
    const { registry, store, onDatosCambiados } = entorno();
    registry.mount('nominas');
    const toggle = vista().querySelector<HTMLInputElement>('[data-activo-nom="n1"]') as HTMLInputElement;
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    expect(store.get('nominas')[0].activo).toBe(false);
    expect(onDatosCambiados).toHaveBeenCalled();
    expect(overlayOculto()).toBe(true);
  });
});

describe('formulario de nómina', () => {
  beforeEach(() => montarShell());

  const abrirNueva = (registry: ReturnType<typeof entorno>['registry']) => {
    registry.mount('nominas');
    (vista().querySelector('[data-nueva-nomina]') as HTMLElement).click();
  };
  const guardar = () => (modal().querySelector('[data-guardar-nomina]') as HTMLElement).click();

  it('crea una nómina con los valores del formulario', () => {
    const { registry, store, onDatosCambiados } = entorno({ nominas: [] });
    abrirNueva(registry);

    escribir('#nf-nombre', 'Nueva S.L.');
    escribir('#nf-bruto', '42000');
    guardar();

    expect(store.get('nominas')).toHaveLength(1);
    expect(store.get('nominas')[0]).toMatchObject({ nombre: 'Nueva S.L.', bruto: 42000, activo: true, tags: ['nomina'] });
    expect(onDatosCambiados).toHaveBeenCalled();
    expect(overlayOculto()).toBe(true);
  });

  it('exige nombre y bruto positivo', () => {
    const { registry, store } = entorno({ nominas: [] });
    abrirNueva(registry);

    guardar();
    expect(store.get('nominas')).toHaveLength(0);
    expect(overlayOculto()).toBe(false);

    escribir('#nf-nombre', 'Sin bruto');
    escribir('#nf-bruto', '0');
    guardar();
    expect(store.get('nominas')).toHaveLength(0);
  });

  it('la vista previa desglosa bruto, SS, IRPF y neto por paga', () => {
    const { registry } = entorno({ nominas: [] });
    abrirNueva(registry);
    escribir('#nf-bruto', '36000');
    (modal().querySelector('#nf-bruto') as HTMLInputElement).dispatchEvent(new Event('input', { bubbles: true }));

    const preview = modal().querySelector('#nf-preview')?.textContent ?? '';
    expect(preview).toContain('Vista previa');
    expect(preview).toContain('SS empleado');
    expect(preview).toContain('IRPF anual');
    expect(preview).toContain('Neto/paga');
  });

  it('el modo manual muestra el campo de porcentaje y lo aplica', () => {
    const { registry, store } = entorno({ nominas: [] });
    abrirNueva(registry);
    expect((modal().querySelector('#nf-irpfpct-wrap') as HTMLElement).style.display).toBe('none');

    fijar('#nf-irpfmodo', 'manual');
    expect((modal().querySelector('#nf-irpfpct-wrap') as HTMLElement).style.display).toBe('');

    escribir('#nf-nombre', 'Manual');
    escribir('#nf-bruto', '30000');
    escribir('#nf-irpfpct', '15');
    guardar();

    expect(store.get('nominas')[0]).toMatchObject({ irpfModo: 'manual', irpfPct: 15 });
  });

  it('el número de pagas personalizado se guarda', () => {
    const { registry, store } = entorno({ nominas: [] });
    abrirNueva(registry);
    fijar('#nf-npagas', 'custom');
    expect((modal().querySelector('#nf-custom-pagas-wrap') as HTMLElement).style.display).toBe('');

    escribir('#nf-nombre', 'Trece pagas');
    escribir('#nf-bruto', '30000');
    escribir('#nf-npagas-custom', '13');
    guardar();

    expect(store.get('nominas')[0].nPagas).toBe(13);
  });

  it('añade y quita componentes de retribución flexible', () => {
    const { registry, store } = entorno({ nominas: [] });
    abrirNueva(registry);
    escribir('#nf-nombre', 'Con flexible');
    escribir('#nf-bruto', '30000');

    escribir('#fc-importe', '100');
    (modal().querySelector('[data-flex-anadir]') as HTMLElement).click();
    expect(modal().textContent).toContain('Transporte');

    escribir('#fc-importe', '50');
    (modal().querySelector('[data-flex-anadir]') as HTMLElement).click();
    expect(modal().querySelectorAll('[data-flex-borrar]')).toHaveLength(2);

    (modal().querySelector('[data-flex-borrar="0"]') as HTMLElement).click();
    expect(modal().querySelectorAll('[data-flex-borrar]')).toHaveLength(1);

    guardar();
    expect(store.get('nominas')[0].retribucionFlexible).toHaveLength(1);
    expect(store.get('nominas')[0].retribucionFlexible?.[0]).toMatchObject({ importe: 50 });
  });

  it('avisa si la nómina entra en un grupo que ya tiene otras', () => {
    const { registry } = entorno({ nominas: [nomina({ _id: 'a', nombre: 'Principal', grupoNomina: 'casa' })] });
    abrirNueva(registry);
    escribir('#nf-grupo', 'casa');
    (modal().querySelector('#nf-grupo') as HTMLInputElement).dispatchEvent(new Event('input', { bubbles: true }));

    expect(modal().querySelector('#nf-preview')?.textContent).toContain('tipo marginal del grupo');
  });

  it('edita una nómina conservando su id', () => {
    const { registry, store } = entorno();
    registry.mount('nominas');
    (vista().querySelector('[data-editar-nom="n1"]') as HTMLElement).click();

    expect((modal().querySelector('#nf-nombre') as HTMLInputElement).value).toBe('Empresa S.A.');
    escribir('#nf-bruto', '40000');
    guardar();

    expect(store.get('nominas')).toHaveLength(1);
    expect(store.get('nominas')[0]).toMatchObject({ _id: 'n1', bruto: 40000 });
  });

  it('elimina tras confirmar', () => {
    const { registry, store } = entorno();
    registry.mount('nominas');
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false);
    (vista().querySelector('[data-borrar-nom="n1"]') as HTMLElement).click();
    expect(store.get('nominas')).toHaveLength(1);

    confirmar.mockReturnValue(true);
    (vista().querySelector('[data-borrar-nom="n1"]') as HTMLElement).click();
    expect(store.get('nominas')).toHaveLength(0);
  });

  it('sin una segunda persona, no aparece el widget de reparto', () => {
    const { registry } = entorno({ nominas: [] });
    abrirNueva(registry);
    expect(modal().querySelector('[data-reparto="consumo"]')).toBeNull();
  });

  it('con dos personas, guarda el reparto de pago', () => {
    const { registry, store } = entorno({ nominas: [] });
    store.set('personas', [...store.get('personas'), { _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true }]);
    abrirNueva(registry);
    escribir('#nf-nombre', 'Con reparto');
    escribir('#nf-bruto', '30000');

    fijar('[data-reparto-modo="pago"]', 'porcentaje');
    const chk = modal().querySelector<HTMLInputElement>('[data-reparto-persona="pago"][value="p2"]')!;
    chk.checked = true;
    (modal().querySelector('[data-reparto-valor="pago"][data-persona="p2"]') as HTMLInputElement).value = '50';
    guardar();

    expect(store.get('nominas')[0].repartoPago).toEqual({ modo: 'porcentaje', participantes: [{ personaId: 'p2', valor: 50 }] });
  });
});

describe('pestañas por persona', () => {
  beforeEach(() => montarShell());

  it('sin una segunda persona activa, no aparecen pestañas', () => {
    const { registry } = entorno();
    registry.mount('nominas');
    expect(vista().querySelector('[data-persona-tab]')).toBeNull();
  });

  it('con dos personas, filtra la lista al elegir una pestaña', () => {
    const miNomina = nomina({ _id: 'n1', nombre: 'Mía' });
    const nominaPareja = nomina({
      _id: 'n2',
      nombre: 'De mi pareja',
      repartoPago: { modo: 'porcentaje', participantes: [{ personaId: 'p2', valor: 100 }] },
    });
    const { registry, store } = entorno({ nominas: [miNomina, nominaPareja] });
    store.set('personas', [...store.get('personas'), { _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true }]);
    registry.mount('nominas');

    expect(filas()).toHaveLength(2); // "Todas", por defecto

    (vista().querySelector('[data-persona-tab="p2"]') as HTMLElement).click();
    expect(filas()).toHaveLength(1);
    expect(vista().textContent).toContain('De mi pareja');
    expect(vista().textContent).not.toContain('Mía');

    (vista().querySelector('[data-persona-tab=""]') as HTMLElement).click(); // "Todas" de nuevo
    expect(filas()).toHaveLength(2);
  });

  it('una nómina sin reparto solo aparece en la pestaña de la persona por defecto', () => {
    const sinReparto = nomina({ _id: 'n1', nombre: 'Sin repartir' });
    const { registry, store } = entorno({ nominas: [sinReparto] });
    store.set('personas', [...store.get('personas'), { _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true }]);
    registry.mount('nominas');

    (vista().querySelector('[data-persona-tab="p2"]') as HTMLElement).click();
    expect(filas()).toHaveLength(0);

    (vista().querySelector('[data-persona-tab="default"]') as HTMLElement).click();
    expect(filas()).toHaveLength(1);
  });
});

describe('tramos IRPF por ejercicio', () => {
  beforeEach(() => montarShell());

  const abrirTramos = (registry: ReturnType<typeof entorno>['registry']) => {
    registry.mount('nominas');
    (vista().querySelector('[data-tramos]') as HTMLElement).click();
  };

  it('lista la tabla por defecto y los ejercicios guardados', () => {
    const { registry } = entorno({ historico: [{ _id: 't1', año: 2025, tramos: [[0, 20]] }] });
    abrirTramos(registry);

    expect(modal().textContent).toContain('Por defecto');
    expect(modal().textContent).toContain('2025');
    expect(modal().querySelector('[data-editar-tabla="default"]')).not.toBeNull();
  });

  it('añade una tabla para un año nuevo y rechaza duplicados y años inválidos', () => {
    const { registry, store } = entorno();
    abrirTramos(registry);

    (modal().querySelector('#irpf-new-year') as HTMLInputElement).value = '1800';
    (modal().querySelector('[data-anadir-anyo]') as HTMLElement).click();
    expect(store.get('tramosIRPFHistorico')).toHaveLength(0);

    (modal().querySelector('#irpf-new-year') as HTMLInputElement).value = '2027';
    (modal().querySelector('[data-anadir-anyo]') as HTMLElement).click();
    expect(store.get('tramosIRPFHistorico')).toHaveLength(1);
    expect(store.get('tramosIRPFHistorico')[0].año).toBe(2027);
    // Abre el editor de ese año directamente
    expect(modal().textContent).toContain('2027');

    abrirTramos(registry);
    (modal().querySelector('#irpf-new-year') as HTMLInputElement).value = '2027';
    (modal().querySelector('[data-anadir-anyo]') as HTMLElement).click();
    expect(store.get('tramosIRPFHistorico')).toHaveLength(1);
  });

  it('edita, añade y quita tramos, guardándolos ordenados', () => {
    const { registry, store } = entorno({ historico: [{ _id: 't1', año: 2025, tramos: [[0, 20]] }] });
    abrirTramos(registry);
    (modal().querySelector('[data-editar-tabla="2025"]') as HTMLElement).click();

    (modal().querySelector('[data-tr-anadir]') as HTMLElement).click();
    expect(modal().querySelectorAll('[data-tr-min]')).toHaveLength(2);

    // Se introduce desordenado a propósito: debe guardarse ascendente
    (modal().querySelector('[data-tr-min="0"]') as HTMLInputElement).value = '30000';
    (modal().querySelector('[data-tr-pct="0"]') as HTMLInputElement).value = '35';
    (modal().querySelector('[data-tr-min="1"]') as HTMLInputElement).value = '0';
    (modal().querySelector('[data-tr-pct="1"]') as HTMLInputElement).value = '19';
    (modal().querySelector('[data-tr-guardar]') as HTMLElement).click();

    expect(store.get('tramosIRPFHistorico')[0].tramos).toEqual([
      [0, 19],
      [30000, 35],
    ]);
  });

  it('lo escrito no se pierde al añadir otro tramo', () => {
    const { registry } = entorno({ historico: [{ _id: 't1', año: 2025, tramos: [[0, 20]] }] });
    abrirTramos(registry);
    (modal().querySelector('[data-editar-tabla="2025"]') as HTMLElement).click();

    (modal().querySelector('[data-tr-pct="0"]') as HTMLInputElement).value = '21';
    (modal().querySelector('[data-tr-anadir]') as HTMLElement).click();

    expect((modal().querySelector('[data-tr-pct="0"]') as HTMLInputElement).value).toBe('21');
  });

  it('guardar la tabla por defecto actualiza la configuración', () => {
    const { registry, store } = entorno();
    abrirTramos(registry);
    (modal().querySelector('[data-editar-tabla="default"]') as HTMLElement).click();

    (modal().querySelector('[data-tr-pct="0"]') as HTMLInputElement).value = '18';
    (modal().querySelector('[data-tr-guardar]') as HTMLElement).click();

    expect(store.get('config').tramos_irpf[0][1]).toBe(18);
  });

  it('elimina una tabla tras confirmar', () => {
    const { registry, store } = entorno({ historico: [{ _id: 't1', año: 2025, tramos: [[0, 20]] }] });
    abrirTramos(registry);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    (modal().querySelector('[data-borrar-tabla="2025"]') as HTMLElement).click();

    expect(store.get('tramosIRPFHistorico')).toHaveLength(0);
  });
});

describe('planes de pensiones', () => {
  beforeEach(() => montarShell());

  const plan = (extra: Partial<Account> = {}): Partial<Account> => ({
    nombre: 'Plan ING',
    saldo: 20000,
    saldoInicial: 0,
    fechaInicialSaldo: '2024-01-01',
    bloqueoMeses: 120,
    impuestoRetirada: 24,
    historicoSaldos: [{ _id: 'h1', fecha: '2026-01-01', saldo: 20000 }],
    aportaciones: [{ _id: 'a1', fecha: '2026-02-01', cantidad: 1000 }],
    ...extra,
  });

  it('sin planes invita a crear uno', () => {
    const { registry } = entorno();
    registry.mount('nominas');
    expect(vista().textContent).toContain('Sin planes de pensiones');
  });

  it('muestra la tarjeta con valor, aportado del año y ahorro fiscal', () => {
    const { registry } = entorno({ planes: [plan()] });
    registry.mount('nominas');

    expect(vista().textContent).toContain('Plan ING');
    expect(vista().textContent).toContain('Valor actual');
    expect(vista().textContent).toContain('Ahorro IRPF est.');
    expect(vista().textContent).toContain('Tipo fijo configurado: 24%');
  });

  it('un plan asociado a un grupo usa el tipo marginal del grupo', () => {
    const { registry } = entorno({
      nominas: [nomina({ bruto: 60000, grupoNomina: 'casa' })],
      planes: [plan({ grupoNomina: 'casa' })],
    });
    registry.mount('nominas');
    expect(vista().textContent).toContain('Tipo marginal grupo "casa"');
  });

  it('crea un plan y registra el saldo inicial en el histórico', () => {
    const { registry, store } = entorno();
    registry.mount('nominas');
    (vista().querySelector('[data-nueva-pension]') as HTMLElement).click();

    escribir('#pen-nombre', 'Plan nuevo');
    escribir('#pen-saldo', '5000');
    (modal().querySelector('[data-guardar-pension]') as HTMLElement).click();

    const creado = store.get('accounts').find((a) => a.nombre === 'Plan nuevo');
    expect(creado).toBeDefined();
    expect(creado?.modeloFondo).toBe('pension');
    expect(creado?.historicoSaldos).toHaveLength(1);
    expect(creado?.aportaciones?.[0].cantidad).toBe(5000);
  });

  it('exige nombre', () => {
    const { registry, store } = entorno();
    const antes = store.get('accounts').length;
    registry.mount('nominas');
    (vista().querySelector('[data-nueva-pension]') as HTMLElement).click();
    (modal().querySelector('[data-guardar-pension]') as HTMLElement).click();

    expect(store.get('accounts')).toHaveLength(antes);
    expect(overlayOculto()).toBe(false);
  });

  it('cambiar el saldo añade un punto al histórico y la diferencia como aportación', () => {
    const { registry, store } = entorno({ planes: [plan()] });
    registry.mount('nominas');
    (vista().querySelector('[data-editar-pension]') as HTMLElement).click();

    escribir('#pen-saldo', '23000');
    (modal().querySelector('[data-guardar-pension]') as HTMLElement).click();

    const actualizado = store.get('accounts').find((a) => a.nombre === 'Plan ING') as Account;
    expect(actualizado.historicoSaldos).toHaveLength(2);
    expect(actualizado.aportaciones).toHaveLength(2);
    expect(actualizado.aportaciones?.[1].cantidad).toBe(3000);
  });

  it('elegir grupo oculta el tipo fijo y lo guarda a cero', () => {
    const { registry, store } = entorno({ nominas: [nomina({ grupoNomina: 'casa' })] });
    registry.mount('nominas');
    (vista().querySelector('[data-nueva-pension]') as HTMLElement).click();

    escribir('#pen-nombre', 'Con grupo');
    escribir('#pen-impuesto', '30');
    fijar('#pen-grupo', 'casa');
    expect((modal().querySelector('#pen-impuesto-wrap') as HTMLElement).style.display).toBe('none');
    (modal().querySelector('[data-guardar-pension]') as HTMLElement).click();

    const creado = store.get('accounts').find((a) => a.nombre === 'Con grupo') as Account;
    expect(creado.grupoNomina).toBe('casa');
    expect(creado.impuestoRetirada).toBe(0);
  });

  it('añade y quita aportaciones programadas', () => {
    const { registry, store } = entorno();
    registry.mount('nominas');
    (vista().querySelector('[data-nueva-pension]') as HTMLElement).click();
    escribir('#pen-nombre', 'Con aportaciones');

    escribir('#paport-importe', '200');
    (modal().querySelector('[data-aport-anadir]') as HTMLElement).click();
    expect(modal().querySelectorAll('[data-aport-borrar]')).toHaveLength(1);

    escribir('#paport-importe', '300');
    (modal().querySelector('[data-aport-anadir]') as HTMLElement).click();
    (modal().querySelector('[data-aport-borrar="0"]') as HTMLElement).click();
    expect(modal().querySelectorAll('[data-aport-borrar]')).toHaveLength(1);

    (modal().querySelector('[data-guardar-pension]') as HTMLElement).click();
    const creado = store.get('accounts').find((a) => a.nombre === 'Con aportaciones') as Account;
    expect(creado.planAportaciones).toHaveLength(1);
    expect(creado.planAportaciones?.[0]).toMatchObject({ importe: 300 });
  });

  it('elimina un plan tras confirmar', () => {
    const { registry, store } = entorno({ planes: [plan()] });
    registry.mount('nominas');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    (vista().querySelector('[data-borrar-pension]') as HTMLElement).click();

    expect(store.get('accounts').some((a) => a.nombre === 'Plan ING')).toBe(false);
  });

  it('desactivar su flag la retira de las rutas', () => {
    const { registry, flags } = entorno();
    flags.setEnabled('nominas', false);
    expect(registry.routes()).not.toContain('nominas');
  });
});
