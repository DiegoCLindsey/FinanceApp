// @vitest-environment happy-dom
// Vista de Inflación portada al paquete nuevo, incluida la importación de IPC
// del Banco Mundial con `fetch` inyectado (F1, tarea 1.7).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createInflationFeature } from '@/features/inflation';
import { createIpcSource, parsearRespuestaWB } from '@/features/inflation/ipc-source';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { PeriodoInflacion } from '@/core/inflation';

const HOY = new Date(2026, 6, 30);

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

/** Respuesta realista del Banco Mundial (más reciente primero, con huecos). */
const respuestaWB = [
  { page: 1, pages: 1, total: 5 },
  [
    { date: '2025', value: 2.812345 },
    { date: '2024', value: 3.1 },
    { date: '2023', value: null }, // hueco: se descarta
    { date: '2022', value: 8.39 },
    { date: '2021', value: 3.09 },
  ],
];

function entorno({
  periodos = [],
  activo = false,
  fetchImpl,
}: { periodos?: PeriodoInflacion[]; activo?: boolean; fetchImpl?: typeof fetch } = {}) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.set('inflacion', periodos);
  store.patchConfig({ usarInflacion: activo });
  const flags = createFlags(store);
  flags.setEnabled('inflacion', true);
  const onDatosCambiados = vi.fn();
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(createInflationFeature({ store, onDatosCambiados, ipc: createIpcSource({ fetchImpl }) }));
  return { store, flags, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-inflacion') as HTMLElement;
const modal = () => document.getElementById('modal-content') as HTMLElement;
const esperar = () => new Promise((r) => setTimeout(r, 0));

describe('fuente de IPC', () => {
  it('parsea la respuesta del Banco Mundial descartando huecos y ordenando', () => {
    expect(parsearRespuestaWB(respuestaWB)).toEqual([
      { year: 2021, tasa: 3.09 },
      { year: 2022, tasa: 8.39 },
      { year: 2024, tasa: 3.1 },
      { year: 2025, tasa: 2.81 }, // redondeado a 2 decimales
    ]);
  });

  it('tolera respuestas inesperadas sin lanzar', () => {
    expect(parsearRespuestaWB(null)).toEqual([]);
    expect(parsearRespuestaWB([{}, null])).toEqual([]);
    expect(parsearRespuestaWB('nope')).toEqual([]);
  });

  it('cachea y permite invalidar', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => respuestaWB }) as unknown as typeof fetch;
    const src = createIpcSource({ fetchImpl });
    await src.obtener();
    await src.obtener();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    src.invalidar();
    await src.obtener();
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('devuelve null si la petición falla', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 }) as unknown as typeof fetch;
    expect(await createIpcSource({ fetchImpl }).obtener()).toBeNull();
    const red = vi.fn().mockRejectedValue(new Error('sin red')) as unknown as typeof fetch;
    expect(await createIpcSource({ fetchImpl: red }).obtener()).toBeNull();
  });
});

describe('vista de inflación', () => {
  beforeEach(() => montarShell());

  it('se registra en planificación y muestra el aviso de módulo opcional cuando está vacía', () => {
    const { registry } = entorno();
    expect(registry.routes()).toContain('inflacion');
    registry.mount('inflacion');
    expect(vista().textContent).toContain('Módulo opcional');
    expect(vista().textContent).toContain('Sin periodos configurados');
  });

  it('lista los periodos ordenados de más reciente a más antiguo', () => {
    const { registry } = entorno({
      periodos: [
        { _id: 'a', year: 2024, tasa: 3.1 },
        { _id: 'b', year: 2026, tasa: 2 },
      ],
    });
    registry.mount('inflacion');
    const años = [...vista().querySelectorAll('[data-periodo]')].map((f) => f.textContent?.trim().slice(0, 4));
    expect(años).toEqual(['2026', '2024']);
  });

  it('muestra el equivalente mensual de la tasa', () => {
    const { registry } = entorno({ periodos: [{ _id: 'a', year: 2027, tasa: 12 }] });
    registry.mount('inflacion');
    // (1.12)^(1/12) − 1 = 0,949 %/mes
    expect(vista().textContent).toContain('0.949%/mes');
  });

  it('el toggle activa el módulo y muestra los factores acumulados', () => {
    const { registry, store, onDatosCambiados } = entorno({ periodos: [{ _id: 'a', year: 2026, tasa: 3 }] });
    registry.mount('inflacion');
    expect(vista().textContent).not.toContain('Inflación acumulada +5 años');

    const toggle = vista().querySelector<HTMLInputElement>('[data-toggle-inflacion]') as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    expect(store.get('config').usarInflacion).toBe(true);
    expect(onDatosCambiados).toHaveBeenCalled();
    expect(vista().textContent).toContain('Inflación acumulada +5 años');
    expect(vista().textContent).toContain('Inflación acumulada +10 años');
  });

  it('añade un periodo desde el formulario, con previsualización', () => {
    const { registry, store } = entorno();
    registry.mount('inflacion');
    (vista().querySelector('[data-nuevo-periodo]') as HTMLElement).click();

    const tasa = modal().querySelector('#inf-tasa') as HTMLInputElement;
    tasa.value = '3.5';
    tasa.dispatchEvent(new Event('input', { bubbles: true }));
    expect(modal().querySelector('#inf-preview')?.textContent).toContain('%/mes');

    (modal().querySelector('#inf-year') as HTMLInputElement).value = '2027';
    (modal().querySelector('[data-inf-guardar]') as HTMLElement).click();

    expect(store.get('inflacion')).toHaveLength(1);
    expect(store.get('inflacion')[0]).toMatchObject({ year: 2027, tasa: 3.5 });
  });

  it('rechaza año y tasa inválidos, y años duplicados', () => {
    const { registry, store } = entorno({ periodos: [{ _id: 'a', year: 2026, tasa: 3 }] });
    registry.mount('inflacion');

    (vista().querySelector('[data-nuevo-periodo]') as HTMLElement).click();
    (modal().querySelector('#inf-year') as HTMLInputElement).value = '1500';
    (modal().querySelector('#inf-tasa') as HTMLInputElement).value = '3';
    (modal().querySelector('[data-inf-guardar]') as HTMLElement).click();
    expect(store.get('inflacion')).toHaveLength(1);

    (modal().querySelector('#inf-year') as HTMLInputElement).value = '2027';
    (modal().querySelector('#inf-tasa') as HTMLInputElement).value = '250';
    (modal().querySelector('[data-inf-guardar]') as HTMLElement).click();
    expect(store.get('inflacion')).toHaveLength(1);

    // Año que ya existe
    (modal().querySelector('#inf-year') as HTMLInputElement).value = '2026';
    (modal().querySelector('#inf-tasa') as HTMLInputElement).value = '4';
    (modal().querySelector('[data-inf-guardar]') as HTMLElement).click();
    expect(store.get('inflacion')).toHaveLength(1);
  });

  it('edita un periodo existente', () => {
    const { registry, store } = entorno({ periodos: [{ _id: 'a', year: 2026, tasa: 3 }] });
    registry.mount('inflacion');
    (vista().querySelector('[data-editar-periodo]') as HTMLElement).click();
    expect((modal().querySelector('#inf-tasa') as HTMLInputElement).value).toBe('3');

    (modal().querySelector('#inf-tasa') as HTMLInputElement).value = '4.25';
    (modal().querySelector('[data-inf-guardar]') as HTMLElement).click();
    expect(store.get('inflacion')[0].tasa).toBe(4.25);
  });

  it('elimina un periodo tras confirmar', () => {
    const { registry, store } = entorno({ periodos: [{ _id: 'a', year: 2026, tasa: 3 }] });
    registry.mount('inflacion');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    (vista().querySelector('[data-borrar-periodo]') as HTMLElement).click();
    expect(store.get('inflacion')).toHaveLength(0);
  });

  it('importa el IPC del Banco Mundial marcando lo nuevo y respetando lo existente', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => respuestaWB }) as unknown as typeof fetch;
    const { registry, store } = entorno({ periodos: [{ _id: 'x', year: 2022, tasa: 8.39 }], fetchImpl });
    registry.mount('inflacion');

    (vista().querySelector('[data-importar-ipc]') as HTMLElement).click();
    await esperar();

    const checks = [...modal().querySelectorAll<HTMLInputElement>('.ipc-chk')];
    expect(checks.length).toBeGreaterThan(0);
    // El año ya guardado aparece deshabilitado y sin marcar
    const ya = checks.find((c) => c.dataset.year === '2022') as HTMLInputElement;
    expect(ya.disabled).toBe(true);
    expect(modal().textContent).toContain('ya guardado');
    expect(modal().textContent).toContain('3 periodos nuevos disponibles');

    (modal().querySelector('[data-ipc-importar]') as HTMLElement).click();

    const años = store
      .get('inflacion')
      .map((p) => p.year)
      .sort();
    expect(años).toEqual([2021, 2022, 2024, 2025]); // no duplica 2022
    expect(document.getElementById('modal-overlay')?.classList.contains('hidden')).toBe(true);
  });

  it('el selector "desde el año" filtra la lista de importación', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => respuestaWB }) as unknown as typeof fetch;
    const { registry } = entorno({ fetchImpl });
    registry.mount('inflacion');
    (vista().querySelector('[data-importar-ipc]') as HTMLElement).click();
    await esperar();

    const total = modal().querySelectorAll('.ipc-chk').length;
    const desde = modal().querySelector('#ipc-desde') as HTMLSelectElement;
    desde.value = '2024';
    desde.dispatchEvent(new Event('change', { bubbles: true }));
    expect(modal().querySelectorAll('.ipc-chk').length).toBeLessThan(total);
    expect(modal().querySelectorAll('.ipc-chk')).toHaveLength(2); // 2024 y 2025
  });

  it('avisa si la API no responde', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchImpl = vi.fn().mockRejectedValue(new Error('sin red')) as unknown as typeof fetch;
    const { registry } = entorno({ fetchImpl });
    registry.mount('inflacion');
    (vista().querySelector('[data-importar-ipc]') as HTMLElement).click();
    await esperar();
    expect(modal().textContent).toContain('No se pudo conectar');
  });

  it('desactivar su flag la retira de las rutas', () => {
    const { registry, flags } = entorno();
    flags.setEnabled('inflacion', false);
    expect(registry.routes()).not.toContain('inflacion');
  });
});
