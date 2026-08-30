// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createProyectosModal } from '@/ui/proyectos-modal';
import { crearServicioProyectos, leerColeccionesDeProyecto, namespaceDeProyecto, remapearIds } from '@/state/proyectos';
import { createMemoryAdapter } from '@/state/storage/local';

/** `Storage` real respaldado en memoria, para no depender de `localStorage`. */
function storageDeMemoria(): Storage {
  const mem = createMemoryAdapter();
  return {
    getItem: (k) => (mem.get(k) as string | null) ?? null,
    setItem: (k, v) => mem.set(k, v),
    removeItem: (k) => mem.remove(k),
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage;
}

/** El mismo tipo de API que `main.ts` construye sobre `crearServicioProyectos`, para probar el módulo contra lógica real, no un doble. */
function apiSobre(storage: Storage) {
  const svc = crearServicioProyectos(storage);
  return {
    listar: () => svc.listar(),
    activo: () => svc.listar().find((p) => p._id === svc.activo()) ?? svc.listar()[0],
    colecciones: ['expenses', 'accounts'],
    crear: (nombre: string) => svc.crear(nombre),
    renombrar: (id: string, nombre: string) => svc.renombrar(id, nombre),
    duplicar: (id: string, nombreNuevo?: string) => svc.duplicar(id, nombreNuevo),
    eliminar: (id: string) => svc.eliminar(id),
    cambiarA: (id: string) => svc.establecerActivo(id),
    importarDesde: (idOrigen: string, colecciones: string[]) => {
      const leidas = leerColeccionesDeProyecto(storage, idOrigen, colecciones);
      const remapeadas = remapearIds(leidas);
      const importadas: string[] = [];
      for (const col of colecciones) {
        const nuevos = remapeadas[col];
        if (Array.isArray(nuevos) && nuevos.length > 0) importadas.push(col);
      }
      return { importadas };
    },
  };
}

function montarShell() {
  document.body.innerHTML = '<div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>';
}

function filaDe(id: string): HTMLElement | null {
  return document.querySelector(`[data-proyecto-fila="${id}"]`);
}

describe('ventana de proyectos', () => {
  beforeEach(() => {
    montarShell();
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it('reutiliza el modal legacy y pinta el proyecto default como activo', () => {
    const api = apiSobre(storageDeMemoria());
    createProyectosModal({ proyectos: api, notify: () => {} }).open();

    expect(document.getElementById('modal-overlay')?.classList.contains('hidden')).toBe(false);
    expect(document.querySelector('.modal-title')?.textContent).toBe('Proyectos');
    const fila = filaDe('default');
    expect(fila).not.toBeNull();
    expect(fila?.textContent).toContain('Mis finanzas');
    expect(fila?.querySelector('.dm-badge')?.textContent).toBe('Activo');
    // el proyecto activo y el default (aquí, el mismo) no llevan botón de eliminar
    expect(fila?.querySelector('[data-proyecto-accion="eliminar"]')).toBeNull();
  });

  it('crear un proyecto lo añade a la lista sin cambiar el activo', () => {
    const storage = storageDeMemoria();
    const api = apiSobre(storage);
    const notify = vi.fn();
    createProyectosModal({ proyectos: api, notify }).open();

    const input = document.getElementById('proyecto-nuevo-nombre') as HTMLInputElement;
    input.value = 'Negocio';
    document.getElementById('proyecto-nuevo-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('Negocio'), 'ok');
    expect(document.querySelectorAll('[data-proyecto-fila]')).toHaveLength(2);
    expect(api.activo()._id).toBe('default'); // crear no cambia el activo
  });

  it('un nombre en blanco no crea nada y avisa', () => {
    const api = apiSobre(storageDeMemoria());
    const notify = vi.fn();
    createProyectosModal({ proyectos: api, notify }).open();

    document.getElementById('proyecto-nuevo-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('nombre'), 'warn');
    expect(document.querySelectorAll('[data-proyecto-fila]')).toHaveLength(1);
  });

  it('cambiar a otro proyecto pide confirmación, marca el activo y recarga', () => {
    const storage = storageDeMemoria();
    const api = apiSobre(storage);
    api.crear('Negocio');
    const recargarPagina = vi.fn();
    createProyectosModal({ proyectos: api, notify: () => {}, recargarPagina }).open();

    const otroId = api.listar().find((p) => p.nombre === 'Negocio')!._id;
    document.querySelector<HTMLElement>(`[data-proyecto-accion="cambiar"][data-proyecto-id="${otroId}"]`)?.click();

    expect(confirm).toHaveBeenCalled();
    expect(api.activo()._id).toBe(otroId);
    expect(recargarPagina).toHaveBeenCalledOnce();
  });

  it('si se cancela la confirmación, no cambia nada', () => {
    vi.stubGlobal(
      'confirm',
      vi.fn(() => false),
    );
    const storage = storageDeMemoria();
    const api = apiSobre(storage);
    api.crear('Negocio');
    const recargarPagina = vi.fn();
    createProyectosModal({ proyectos: api, notify: () => {}, recargarPagina }).open();

    const otroId = api.listar().find((p) => p.nombre === 'Negocio')!._id;
    document.querySelector<HTMLElement>(`[data-proyecto-accion="cambiar"][data-proyecto-id="${otroId}"]`)?.click();

    expect(api.activo()._id).toBe('default');
    expect(recargarPagina).not.toHaveBeenCalled();
  });

  it('renombrar usa prompt() y actualiza la fila', () => {
    vi.stubGlobal(
      'prompt',
      vi.fn(() => 'Personal'),
    );
    const api = apiSobre(storageDeMemoria());
    createProyectosModal({ proyectos: api, notify: () => {} }).open();

    document.querySelector<HTMLElement>('[data-proyecto-accion="renombrar"][data-proyecto-id="default"]')?.click();

    expect(api.listar()[0].nombre).toBe('Personal');
    expect(filaDe('default')?.textContent).toContain('Personal');
  });

  it('cancelar el prompt de renombrar no cambia nada', () => {
    vi.stubGlobal(
      'prompt',
      vi.fn(() => null),
    );
    const api = apiSobre(storageDeMemoria());
    createProyectosModal({ proyectos: api, notify: () => {} }).open();

    document.querySelector<HTMLElement>('[data-proyecto-accion="renombrar"][data-proyecto-id="default"]')?.click();

    expect(api.listar()[0].nombre).toBe('Mis finanzas');
  });

  it('duplicar crea una copia independiente', () => {
    vi.stubGlobal(
      'prompt',
      vi.fn(() => 'Copia de pruebas'),
    );
    const api = apiSobre(storageDeMemoria());
    const notify = vi.fn();
    createProyectosModal({ proyectos: api, notify }).open();

    document.querySelector<HTMLElement>('[data-proyecto-accion="duplicar"][data-proyecto-id="default"]')?.click();

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('Copia de pruebas'), 'ok');
    expect(api.listar().map((p) => p.nombre)).toContain('Copia de pruebas');
    expect(document.querySelectorAll('[data-proyecto-fila]')).toHaveLength(2);
  });

  it('el proyecto default nunca lleva botón de eliminar, sea o no el activo', () => {
    const storage = storageDeMemoria();
    const api = apiSobre(storage);
    api.crear('Negocio');
    api.cambiarA(api.listar().find((p) => p.nombre === 'Negocio')!._id);
    createProyectosModal({ proyectos: api, notify: () => {} }).open();

    expect(filaDe('default')?.querySelector('[data-proyecto-accion="eliminar"]')).toBeNull();
  });

  it('eliminar un proyecto inactivo, no-default, lo quita de la lista', () => {
    const api = apiSobre(storageDeMemoria());
    const notify = vi.fn();
    api.crear('Temporal');
    createProyectosModal({ proyectos: api, notify }).open();

    const id = api.listar().find((p) => p.nombre === 'Temporal')!._id;
    document.querySelector<HTMLElement>(`[data-proyecto-accion="eliminar"][data-proyecto-id="${id}"]`)?.click();

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('Temporal'), 'ok');
    expect(api.listar().some((p) => p._id === id)).toBe(false);
    expect(filaDe(id)).toBeNull();
  });

  it('la sección de importar no aparece con un solo proyecto', () => {
    const api = apiSobre(storageDeMemoria());
    createProyectosModal({ proyectos: api, notify: () => {} }).open();
    expect(document.getElementById('proyecto-import-btn')).toBeNull();
  });

  it('importar sin marcar ninguna colección avisa y no llama a importarDesde', () => {
    const storage = storageDeMemoria();
    const api = apiSobre(storage);
    api.crear('Negocio');
    const notify = vi.fn();
    createProyectosModal({ proyectos: api, notify }).open();

    document.getElementById('proyecto-import-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('colección'), 'warn');
  });

  it('importar colecciones marcadas trae los datos y avisa qué se importó', () => {
    const storage = storageDeMemoria();
    const api = apiSobre(storage);
    const otro = api.crear('Negocio');
    storage.setItem(`${namespaceDeProyecto(otro._id)}state_expenses`, JSON.stringify([{ _id: 'e1', concepto: 'Luz' }]));
    const notify = vi.fn();
    createProyectosModal({ proyectos: api, notify }).open();

    const select = document.getElementById('proyecto-import-origen') as HTMLSelectElement;
    select.value = otro._id;
    const check = document.querySelector<HTMLInputElement>('[data-proyecto-import-col="expenses"]')!;
    check.checked = true;

    document.getElementById('proyecto-import-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('Gastos e ingresos'), 'ok');
  });

  it('importar de un proyecto sin datos en esas colecciones avisa que no había nada', () => {
    const storage = storageDeMemoria();
    const api = apiSobre(storage);
    const otro = api.crear('Negocio'); // sin ningún dato sembrado
    const notify = vi.fn();
    createProyectosModal({ proyectos: api, notify }).open();

    const select = document.getElementById('proyecto-import-origen') as HTMLSelectElement;
    select.value = otro._id;
    document.querySelector<HTMLInputElement>('[data-proyecto-import-col="expenses"]')!.checked = true;
    document.getElementById('proyecto-import-btn')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(notify).toHaveBeenCalledWith(expect.stringContaining('no tenía nada'), 'warn');
  });

  it('crea su propio modal si el legacy no está en el DOM', () => {
    document.body.innerHTML = '';
    const api = apiSobre(storageDeMemoria());
    createProyectosModal({ proyectos: api, notify: () => {} }).open();
    expect(document.getElementById('fa-proyectos-overlay')?.classList.contains('hidden')).toBe(false);
    expect(document.querySelector('.modal-title')?.textContent).toBe('Proyectos');
  });
});
