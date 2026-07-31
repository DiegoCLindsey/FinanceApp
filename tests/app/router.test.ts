// @vitest-environment happy-dom
// Router del shell (router/router.js). Es legacy y global, pero aloja las vistas
// portadas y fue justo lo que falló en producción, así que se prueba cargando el
// fichero real en el entorno de test.
//
// Regresión de un fallo reportado por el usuario: al pulsar Gastos, Préstamos,
// Inflación o Márgenes no ocurría NADA — ni siquiera un error. El navegador
// había mezclado ficheros de dos despliegues (GitHub Pages cachea cada uno por
// separado) y el router servido no conocía esas rutas, así que `navigate`
// retornaba en silencio.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FUENTE = readFileSync(resolve(__dirname, '../../router/router.js'), 'utf-8');

interface RouterAPI {
  init: () => void;
  navigate: (view: string) => void;
  rerender: () => void;
}

const toasts: { mensaje: string; tipo?: string }[] = [];

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar" id="sidebar"><ul class="nav-list">
      <li class="nav-section">
        <button class="nav-btn active" data-view="dashboard"></button>
        <button class="nav-btn" data-view="expenses"></button>
        <button class="nav-btn" data-view="inflacion"></button>
      </li>
    </ul></nav>
    <div class="main-area"><main class="view-container">
      <div id="view-dashboard" class="view"></div>
      <div id="view-expenses" class="view hidden"></div>
      <div id="view-inflacion" class="view hidden"></div>
    </main></div>
    <div id="sidebar-overlay" class="hidden"></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>
    <button id="btn-features"></button>`;
}

/** Carga router.js con los globales que necesita, como haría el navegador. */
function cargarRouter({
  modulosLegacy = ['DashboardModule'],
  rutasNuevas = {} as Record<string, string>,
  habilitadas = Object.keys({} as Record<string, string>),
  mount = vi.fn(),
}: {
  modulosLegacy?: string[];
  rutasNuevas?: Record<string, string>;
  habilitadas?: string[];
  mount?: ReturnType<typeof vi.fn>;
} = {}): { router: RouterAPI; mount: ReturnType<typeof vi.fn>; render: ReturnType<typeof vi.fn> } {
  const w = globalThis as unknown as Record<string, unknown>;
  const render = vi.fn();
  w.UI = {
    toast: (mensaje: string, tipo?: string) => toasts.push({ mensaje, tipo }),
    openModal: vi.fn(),
    closeModal: vi.fn(),
  };
  w.FinanceApp = {
    app: {
      has: (ruta: string) => ruta in rutasNuevas && habilitadas.includes(ruta),
      routes: () => Object.keys(rutasNuevas).filter((r) => habilitadas.includes(r)),
      flagPorRuta: () => rutasNuevas,
      mount,
      attachToShell: vi.fn(),
    },
    ui: { applyGating: vi.fn(), openFeatures: vi.fn() },
  };

  // Los módulos legacy se declaran con `const` en el ámbito global del script,
  // igual que en el navegador: NO son propiedades de `window`. Reproducirlo
  // importa, porque buscarlos en `window` devuelve undefined para todos y deja
  // las vistas en blanco (fallo real que este test detecta).
  const preambulo = modulosLegacy.map((n) => `const ${n} = __render;`).join('\n');
  const factory = new Function('__render', `${preambulo}\n${FUENTE}\n;return Router;`) as (r: unknown) => RouterAPI;
  const router = factory({ render });
  w.Router = router;
  return { router, mount, render };
}

beforeEach(() => {
  toasts.length = 0;
  montarShell();
});

describe('rutas del paquete nuevo', () => {
  it('monta una vista registrada y activa', () => {
    const { router, mount } = cargarRouter({ rutasNuevas: { expenses: 'expenses' }, habilitadas: ['expenses'] });
    router.navigate('expenses');

    expect(mount).toHaveBeenCalledWith('expenses');
    expect(document.getElementById('view-expenses')?.classList.contains('hidden')).toBe(false);
    expect(document.querySelector('.nav-btn[data-view="expenses"]')?.classList.contains('active')).toBe(true);
  });

  it('el clic del sidebar navega tras init()', () => {
    const { router, mount } = cargarRouter({ rutasNuevas: { expenses: 'expenses' }, habilitadas: ['expenses'] });
    router.init();
    (document.querySelector('.nav-btn[data-view="expenses"]') as HTMLElement).click();

    expect(mount).toHaveBeenCalledWith('expenses');
  });

  it('una vista registrada pero desactivada avisa en vez de no hacer nada', () => {
    const { router, mount } = cargarRouter({ rutasNuevas: { inflacion: 'inflacion' }, habilitadas: [] });
    router.navigate('inflacion');

    expect(mount).not.toHaveBeenCalled();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].mensaje).toMatch(/desactivada/i);
    expect(toasts[0].tipo).toBe('warn');
  });

  it('una ruta desconocida avisa y deja rastro en consola', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { router } = cargarRouter({ rutasNuevas: {} });
    router.navigate('no-existe');

    expect(toasts).toHaveLength(1);
    expect(toasts[0].tipo).toBe('err');
    expect(error).toHaveBeenCalledWith(expect.stringContaining('no-existe'));
    // El mensaje debe apuntar a la causa real para poder diagnosticarlo
    expect(error.mock.calls[0][0]).toMatch(/cach[ée]/i);
  });

  it('rerender vuelve a montar la vista nueva activa', () => {
    const { router, mount } = cargarRouter({ rutasNuevas: { expenses: 'expenses' }, habilitadas: ['expenses'] });
    router.navigate('expenses');
    mount.mockClear();
    router.rerender();

    expect(mount).toHaveBeenCalledWith('expenses');
  });
});

describe('resistencia a despliegues mezclados', () => {
  it('se define aunque falten módulos legacy que declara', () => {
    // Es el fallo que dejaba `Router` sin definir y la aplicación entera muerta:
    // referenciar un módulo legacy ausente lanzaba ReferenceError al evaluar.
    expect(() => cargarRouter({ modulosLegacy: [] })).not.toThrow();
  });

  it('navegar a una vista legacy cuyo módulo falta no lanza', () => {
    const { router } = cargarRouter({ modulosLegacy: [] });
    expect(() => router.navigate('dashboard')).not.toThrow();
    expect(document.getElementById('view-dashboard')?.classList.contains('hidden')).toBe(false);
  });

  it('funciona sin el paquete nuevo (bundle no cargado)', () => {
    const w = globalThis as unknown as Record<string, unknown>;
    const { router, render } = cargarRouter();
    delete w.FinanceApp;

    expect(() => router.navigate('dashboard')).not.toThrow();
    expect(render).toHaveBeenCalled();
  });
});

describe('vistas legacy', () => {
  it('renderiza la vista legacy y oculta las demás', () => {
    const { router, render } = cargarRouter({ rutasNuevas: { expenses: 'expenses' }, habilitadas: ['expenses'] });
    router.navigate('expenses');
    router.navigate('dashboard');

    expect(render).toHaveBeenCalled();
    expect(document.getElementById('view-dashboard')?.classList.contains('hidden')).toBe(false);
    expect(document.getElementById('view-expenses')?.classList.contains('hidden')).toBe(true);
  });

  it('cierra el sidebar móvil al navegar', () => {
    const { router } = cargarRouter();
    document.getElementById('sidebar')?.classList.add('open');
    document.getElementById('sidebar-overlay')?.classList.remove('hidden');
    router.navigate('dashboard');

    expect(document.getElementById('sidebar')?.classList.contains('open')).toBe(false);
    expect(document.getElementById('sidebar-overlay')?.classList.contains('hidden')).toBe(true);
  });
});
