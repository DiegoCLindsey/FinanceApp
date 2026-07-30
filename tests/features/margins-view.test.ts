// @vitest-environment happy-dom
// Vista de Márgenes de seguridad portada al paquete nuevo (F1, tarea 1.7).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createMarginsFeature } from '@/features/margins';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';
import type { MargenSeguridad } from '@/engine/margins';

const HOY = new Date(2026, 6, 30); // 2026-07-30

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="expenses"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="inflacion"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container">
      <div id="view-dashboard" class="view active"></div>
    </main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const margenFijo: MargenSeguridad = {
  _id: 'm1',
  nombre: 'Reserva mínima',
  activo: true,
  cuentas: [],
  puntos: [{ _id: 'p1', fecha: '2026-01-01', tipo: 'fijo', importe: 4000 }],
};

function entorno(margenes: MargenSeguridad[] = []) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.patchConfig({ margenesSeguridad: margenes });
  store.set('expenses', [
    {
      _id: 'e1',
      concepto: 'Alquiler',
      cuantia: 800,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      fechaInicio: '2025-01-10',
      fechaFin: null,
      tags: [],
      activo: true,
      basico: true,
      escenarioIds: [],
    },
  ]);
  const flags = createFlags(store);
  flags.setEnabled('margenes', true);
  const onDatosCambiados = vi.fn();
  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(createMarginsFeature({ store, onDatosCambiados }));
  return { store, flags, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-margenes') as HTMLElement;
const modal = () => document.getElementById('modal-content') as HTMLElement;

describe('vista de márgenes', () => {
  beforeEach(() => montarShell());

  it('se registra en la sección de planificación con su ruta', () => {
    const { registry } = entorno();
    expect(registry.routes()).toContain('margenes');
    const btn = document.querySelector<HTMLElement>('.nav-btn[data-view="margenes"]');
    expect(btn?.textContent).toContain('Márgenes');
    expect(document.querySelectorAll('.nav-section')[2].contains(btn as Node)).toBe(true);
  });

  it('muestra el estado vacío cuando no hay márgenes', () => {
    const { registry } = entorno();
    registry.mount('margenes');
    expect(vista().textContent).toContain('Sin márgenes definidos');
  });

  it('pinta una tarjeta por margen con su umbral de hoy', () => {
    const { registry } = entorno([margenFijo]);
    registry.mount('margenes');
    const texto = vista().textContent ?? '';
    expect(texto).toContain('Reserva mínima');
    expect(texto).toContain('Todas las cuentas activas');
    expect(texto).toContain('4000'); // umbral fijo vigente
    expect(vista().querySelectorAll('[data-punto]')).toHaveLength(1);
  });

  it('un margen de tipo meses muestra el equivalente en euros', () => {
    const { registry } = entorno([
      { _id: 'm2', nombre: 'Tres meses', activo: true, cuentas: [], puntos: [{ _id: 'p', fecha: '2026-01-01', tipo: 'meses', meses: 3 }] },
    ]);
    registry.mount('margenes');
    // 3 meses × 800 € de gasto básico mensual
    expect(vista().textContent).toContain('2400');
  });

  it('un margen inactivo no muestra su cuerpo', () => {
    const { registry } = entorno([{ ...margenFijo, activo: false }]);
    registry.mount('margenes');
    expect(vista().textContent).toContain('Inactivo');
    expect(vista().querySelectorAll('[data-punto]')).toHaveLength(0);
  });

  it('el toggle activa y desactiva persistiendo en config', () => {
    const { registry, store, onDatosCambiados } = entorno([margenFijo]);
    registry.mount('margenes');
    const toggle = vista().querySelector<HTMLInputElement>('[data-toggle-margen]') as HTMLInputElement;
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    expect(store.get('config').margenesSeguridad?.[0].activo).toBe(false);
    expect(onDatosCambiados).toHaveBeenCalled();
  });

  it('añade y elimina waypoints', () => {
    const { registry, store } = entorno([margenFijo]);
    registry.mount('margenes');

    (vista().querySelector('[data-add-punto]') as HTMLElement).click();
    expect(store.get('config').margenesSeguridad?.[0].puntos).toHaveLength(2);
    expect(vista().querySelectorAll('[data-punto]')).toHaveLength(2);

    (vista().querySelector('[data-borrar-punto]') as HTMLElement).click();
    expect(store.get('config').margenesSeguridad?.[0].puntos).toHaveLength(1);
  });

  it('edita un waypoint inline y recalcula el umbral', () => {
    const { registry, store } = entorno([margenFijo]);
    registry.mount('margenes');

    const importe = vista().querySelector<HTMLInputElement>('[data-campo="importe"]') as HTMLInputElement;
    importe.value = '5500';
    importe.dispatchEvent(new Event('change', { bubbles: true }));

    expect(store.get('config').margenesSeguridad?.[0].puntos?.[0].importe).toBe(5500);
    expect(vista().textContent).toContain('5500');
  });

  it('cambiar el tipo de waypoint alterna importe y meses', () => {
    const { registry, store } = entorno([margenFijo]);
    registry.mount('margenes');

    const tipo = vista().querySelector<HTMLSelectElement>('[data-campo="tipo"]') as HTMLSelectElement;
    tipo.value = 'meses';
    tipo.dispatchEvent(new Event('change', { bubbles: true }));

    expect(store.get('config').margenesSeguridad?.[0].puntos?.[0].tipo).toBe('meses');
    expect(vista().querySelector('[data-campo="meses"]')).not.toBeNull();
    expect(vista().querySelector('[data-campo="importe"]')).toBeNull();
  });

  it('elimina un margen tras confirmar', () => {
    const { registry, store } = entorno([margenFijo]);
    registry.mount('margenes');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    (vista().querySelector('[data-borrar-margen]') as HTMLElement).click();
    expect(store.get('config').margenesSeguridad).toHaveLength(0);
  });

  it('no elimina si se cancela la confirmación', () => {
    const { registry, store } = entorno([margenFijo]);
    registry.mount('margenes');
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    (vista().querySelector('[data-borrar-margen]') as HTMLElement).click();
    expect(store.get('config').margenesSeguridad).toHaveLength(1);
  });

  it('crea un margen nuevo desde el formulario', () => {
    const { registry, store } = entorno();
    registry.mount('margenes');
    (vista().querySelector('[data-nuevo-margen]') as HTMLElement).click();

    expect(document.getElementById('modal-overlay')?.classList.contains('hidden')).toBe(false);
    (modal().querySelector('#mg-nombre') as HTMLInputElement).value = 'Colchón viajes';
    (modal().querySelector('#mg-p-importe') as HTMLInputElement).value = '1500';
    (modal().querySelector('[data-guardar-margen]') as HTMLElement).click();

    const lista = store.get('config').margenesSeguridad ?? [];
    expect(lista).toHaveLength(1);
    expect(lista[0].nombre).toBe('Colchón viajes');
    expect(lista[0].puntos?.[0].importe).toBe(1500);
    expect(lista[0].activo).toBe(true);
    expect(document.getElementById('modal-overlay')?.classList.contains('hidden')).toBe(true);
  });

  it('exige nombre al guardar', () => {
    const { registry, store } = entorno();
    registry.mount('margenes');
    (vista().querySelector('[data-nuevo-margen]') as HTMLElement).click();
    (modal().querySelector('[data-guardar-margen]') as HTMLElement).click();
    expect(store.get('config').margenesSeguridad).toHaveLength(0);
  });

  it('edita nombre y cuentas de un margen existente', () => {
    const { registry, store } = entorno([margenFijo]);
    store.set('accounts', [
      { ...store.get('accounts')[0], _id: 'default', nombre: 'Principal' },
      {
        _id: 'ahorro',
        nombre: 'Ahorro',
        activo: true,
        esCuentaPrincipal: false,
        saldoInicial: 0,
        fechaInicialSaldo: '2026-01-01',
        historicoSaldos: [],
        interes: 0,
        modeloFondo: 'cuenta',
        escenarioIds: [],
      },
    ]);
    registry.mount('margenes');
    (vista().querySelector('[data-editar-margen]') as HTMLElement).click();

    (modal().querySelector('#mg-nombre') as HTMLInputElement).value = 'Reserva renombrada';
    const chip = modal().querySelector<HTMLInputElement>('.mg-acc-chip[value="ahorro"]') as HTMLInputElement;
    chip.checked = true;
    chip.dispatchEvent(new Event('change', { bubbles: true }));
    (modal().querySelector('[data-guardar-margen]') as HTMLElement).click();

    const m = store.get('config').margenesSeguridad?.[0];
    expect(m?.nombre).toBe('Reserva renombrada');
    expect(m?.cuentas).toEqual(['ahorro']);
    // Al editar no se toca la lista de waypoints
    expect(m?.puntos).toHaveLength(1);
  });

  it('escapa el nombre del margen', () => {
    const { registry } = entorno([{ ...margenFijo, nombre: '<img src=x onerror=alert(1)>' }]);
    registry.mount('margenes');
    expect(vista().querySelector('img')).toBeNull();
    expect(vista().innerHTML).toContain('&lt;img');
  });

  it('desactivar su flag la retira del sidebar y de las rutas', () => {
    const { registry, flags } = entorno([margenFijo]);
    flags.setEnabled('margenes', false);
    expect(registry.routes()).not.toContain('margenes');
    expect(registry.mount('margenes')).toBe(false);
  });
});
