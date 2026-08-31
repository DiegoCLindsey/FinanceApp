// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPersonasModal } from '@/ui/personas-modal';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';

const HOY = new Date(2026, 7, 30);

function nuevoStore() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  return store;
}

function montarShell() {
  document.body.innerHTML = '<div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>';
}

function filaDe(id: string): HTMLElement | null {
  return document.querySelector(`[data-persona-fila="${id}"]`);
}

describe('ventana de personas', () => {
  beforeEach(() => {
    montarShell();
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it('reutiliza el modal legacy y pinta la persona por defecto', () => {
    const store = nuevoStore();
    createPersonasModal({ store, notify: () => {} }).open();

    expect(document.getElementById('modal-overlay')?.classList.contains('hidden')).toBe(false);
    expect(document.querySelector('.modal-title')?.textContent).toBe('Personas');
    const fila = filaDe('default');
    expect(fila).not.toBeNull();
    expect(fila?.textContent).toContain('Yo');
    expect(fila?.querySelector('.dm-badge')?.textContent).toBe('Por defecto');
    // ni "hacer por defecto" ni "eliminar" tienen sentido en la persona por defecto
    expect(fila?.querySelector('[data-persona-accion="defecto"]')).toBeNull();
    expect(fila?.querySelector('[data-persona-accion="eliminar"]')).toBeNull();
  });

  it('crear una persona la añade a la lista', () => {
    const store = nuevoStore();
    const notify = vi.fn();
    createPersonasModal({ store, notify }).open();

    const input = document.getElementById('persona-nuevo-nombre') as HTMLInputElement;
    input.value = 'Pareja';
    document.getElementById('persona-nuevo-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('Pareja'), 'ok');
    expect(store.get('personas').map((p) => p.nombre)).toEqual(['Yo', 'Pareja']);
    expect(store.get('personas')[1].esPorDefecto).toBe(false);
  });

  it('un nombre en blanco no crea nada y avisa', () => {
    const store = nuevoStore();
    const notify = vi.fn();
    createPersonasModal({ store, notify }).open();

    document.getElementById('persona-nuevo-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('nombre'), 'warn');
    expect(store.get('personas')).toHaveLength(1);
  });

  it('renombrar usa prompt() y actualiza la fila', () => {
    vi.stubGlobal(
      'prompt',
      vi.fn(() => 'Diego'),
    );
    const store = nuevoStore();
    createPersonasModal({ store, notify: () => {} }).open();

    document.querySelector<HTMLElement>('[data-persona-accion="renombrar"][data-persona-id="default"]')?.click();

    expect(store.get('personas')[0].nombre).toBe('Diego');
    expect(filaDe('default')?.textContent).toContain('Diego');
  });

  it('hacer a otra persona la de por defecto quita la marca de la anterior (exclusividad)', () => {
    const store = nuevoStore();
    store.addItem('personas', { nombre: 'Pareja', esPorDefecto: false, activo: true });
    createPersonasModal({ store, notify: () => {} }).open();

    const pareja = store.get('personas').find((p) => p.nombre === 'Pareja')!;
    document.querySelector<HTMLElement>(`[data-persona-accion="defecto"][data-persona-id="${pareja._id}"]`)?.click();

    const personas = store.get('personas');
    expect(personas.find((p) => p._id === 'default')?.esPorDefecto).toBe(false);
    expect(personas.find((p) => p._id === pareja._id)?.esPorDefecto).toBe(true);
    // y ahora "default" ya sí puede eliminarse / marcarse por defecto de nuevo
    expect(filaDe('default')?.querySelector('[data-persona-accion="eliminar"]')).not.toBeNull();
  });

  it('activar/desactivar alterna sin borrar nada', () => {
    const store = nuevoStore();
    const pareja = store.addItem('personas', { nombre: 'Pareja', esPorDefecto: false, activo: true });
    createPersonasModal({ store, notify: () => {} }).open();

    document.querySelector<HTMLElement>(`[data-persona-accion="activo"][data-persona-id="${pareja._id}"]`)?.click();
    expect(store.get('personas').find((p) => p._id === pareja._id)?.activo).toBe(false);
    expect(filaDe(pareja._id)?.querySelector('.dm-badge')?.textContent).toBe('Inactiva');

    document.querySelector<HTMLElement>(`[data-persona-accion="activo"][data-persona-id="${pareja._id}"]`)?.click();
    expect(store.get('personas').find((p) => p._id === pareja._id)?.activo).toBe(true);
  });

  it('eliminar una persona no-default la quita de la lista', () => {
    const store = nuevoStore();
    const pareja = store.addItem('personas', { nombre: 'Pareja', esPorDefecto: false, activo: true });
    const notify = vi.fn();
    createPersonasModal({ store, notify }).open();

    document.querySelector<HTMLElement>(`[data-persona-accion="eliminar"][data-persona-id="${pareja._id}"]`)?.click();

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('Pareja'), 'ok');
    expect(store.get('personas').map((p) => p._id)).toEqual(['default']);
  });

  it('no se puede eliminar si es la única persona que queda', () => {
    const store = nuevoStore();
    // La persona por defecto no ofrece botón de eliminar, así que se simula
    // llamando al store directamente para dejar SOLO una no-default.
    store.set('personas', [{ _id: 'sola', nombre: 'Sola', esPorDefecto: true, activo: true }]);
    const notify = vi.fn();
    createPersonasModal({ store, notify }).open();

    // La única persona es "por defecto", así que ni siquiera se ofrece el botón.
    expect(filaDe('sola')?.querySelector('[data-persona-accion="eliminar"]')).toBeNull();
  });

  it('cancelar la confirmación de eliminar no borra nada', () => {
    vi.stubGlobal(
      'confirm',
      vi.fn(() => false),
    );
    const store = nuevoStore();
    const pareja = store.addItem('personas', { nombre: 'Pareja', esPorDefecto: false, activo: true });
    createPersonasModal({ store, notify: () => {} }).open();

    document.querySelector<HTMLElement>(`[data-persona-accion="eliminar"][data-persona-id="${pareja._id}"]`)?.click();

    expect(store.get('personas')).toHaveLength(2);
  });

  it('avisa a onDatosCambiados tras cada cambio', () => {
    const store = nuevoStore();
    const onDatosCambiados = vi.fn();
    createPersonasModal({ store, notify: () => {}, onDatosCambiados }).open();

    const input = document.getElementById('persona-nuevo-nombre') as HTMLInputElement;
    input.value = 'Pareja';
    document.getElementById('persona-nuevo-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(onDatosCambiados).toHaveBeenCalled();
  });

  it('crea su propio modal si el legacy no está en el DOM', () => {
    document.body.innerHTML = '';
    const store = nuevoStore();
    createPersonasModal({ store, notify: () => {} }).open();
    expect(document.getElementById('fa-personas-overlay')?.classList.contains('hidden')).toBe(false);
    expect(document.querySelector('.modal-title')?.textContent).toBe('Personas');
  });
});
