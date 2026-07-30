// ── app/feature-registry ──────────────────────────────────────────────────────
// Registro de vistas del paquete nuevo (F1, tarea 1.7 — infraestructura).
//
// Cada feature declara un manifest con su ruta, su flag y cómo se monta. El
// registro se encarga de:
//   · crear su contenedor dentro de `.view-container` del shell,
//   · añadir su entrada en el sidebar (respetando el orden de secciones),
//   · montarla/desmontarla al navegar,
//   · y de que el gating de flags la oculte sin que haya que tocar nada más.
//
// El router legacy consulta este registro (ver router/router.js), de modo que
// las vistas nuevas y las viejas conviven en el mismo shell mientras dure la
// migración.

export interface FeatureManifest {
  /** Id estable; coincide con el del registro de flags si la feature es opcional. */
  id: string;
  /** Ruta de navegación (`data-view` del sidebar, `#view-<route>` del contenedor). */
  route: string;
  /** Etiqueta del sidebar. */
  nombre: string;
  /** Flag que la controla. Si no se indica, se usa `id`. */
  flagId?: string;
  /** Sección del sidebar donde aparece (índice de `.nav-section`, 0-based). */
  seccion?: number;
  /** SVG del icono (contenido interno de <svg viewBox="0 0 24 24">). */
  iconoPath?: string;
  /** Pinta la vista dentro del contenedor. Se llama en cada navegación. */
  mount(container: HTMLElement): void;
  /** Limpieza opcional al salir de la vista. */
  unmount?(container: HTMLElement): void;
}

export interface FeatureRegistryDeps {
  document?: Document;
  /** Devuelve si una feature está activa (servicio de flags). */
  isEnabled?: (flagId: string) => boolean;
}

export function createFeatureRegistry({ document: doc = document, isEnabled }: FeatureRegistryDeps = {}) {
  const manifests = new Map<string, FeatureManifest>();
  let montada: string | null = null;

  function containerId(route: string): string {
    return `view-${route}`;
  }

  /** Crea (si hace falta) el contenedor de la vista dentro del shell. */
  function ensureContainer(m: FeatureManifest): HTMLElement | null {
    const existente = doc.getElementById(containerId(m.route));
    if (existente) return existente;
    const host = doc.querySelector('.view-container');
    if (!host) return null; // el shell aún no está montado
    const div = doc.createElement('div');
    div.id = containerId(m.route);
    div.className = 'view hidden';
    host.appendChild(div);
    return div;
  }

  /** Crea (si hace falta) el botón del sidebar de la vista. */
  function ensureNavButton(m: FeatureManifest): void {
    if (doc.querySelector(`.nav-btn[data-view="${m.route}"]`)) return;
    const secciones = doc.querySelectorAll<HTMLElement>('.nav-section');
    const seccion = secciones[m.seccion ?? Math.max(0, secciones.length - 1)];
    if (!seccion) return;
    const btn = doc.createElement('button');
    btn.className = 'nav-btn';
    btn.dataset.view = m.route;
    btn.innerHTML = `${m.iconoPath ? `<svg viewBox="0 0 24 24"><path d="${m.iconoPath}"/></svg>` : ''}<span>${m.nombre}</span>`;
    seccion.appendChild(btn);
    // El router legacy cablea los clicks al iniciar; para los botones añadidos
    // después hace falta hacerlo aquí.
    btn.addEventListener('click', () => {
      const router = (globalThis as { Router?: { navigate: (v: string) => void } }).Router;
      router?.navigate(m.route);
    });
  }

  function register(m: FeatureManifest): void {
    manifests.set(m.route, m);
    ensureContainer(m);
    ensureNavButton(m);
  }

  function routes(): string[] {
    return [...manifests.keys()].filter((route) => {
      const m = manifests.get(route) as FeatureManifest;
      return !isEnabled || isEnabled(m.flagId ?? m.id);
    });
  }

  function has(route: string): boolean {
    return routes().includes(route);
  }

  /** Monta la vista de una ruta registrada. Devuelve false si no existe. */
  function mount(route: string): boolean {
    const m = manifests.get(route);
    if (!m) return false;
    if (isEnabled && !isEnabled(m.flagId ?? m.id)) return false;
    const container = ensureContainer(m);
    if (!container) return false;

    if (montada && montada !== route) {
      const anterior = manifests.get(montada);
      const contAnterior = doc.getElementById(containerId(montada));
      if (anterior?.unmount && contAnterior) anterior.unmount(contAnterior);
    }
    m.mount(container);
    montada = route;
    return true;
  }

  /** Re-monta la vista activa (por ejemplo tras cambiar los datos). */
  function rerender(): void {
    if (montada) mount(montada);
  }

  /** Mapa ruta → flag, para que el gating oculte las entradas del sidebar. */
  function flagPorRuta(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [route, m] of manifests) out[route] = m.flagId ?? m.id;
    return out;
  }

  /** Vuelve a crear contenedores y botones (tras montarse el shell legacy). */
  function attachToShell(): void {
    for (const m of manifests.values()) {
      ensureContainer(m);
      ensureNavButton(m);
    }
  }

  return {
    register,
    routes,
    has,
    mount,
    rerender,
    flagPorRuta,
    attachToShell,
    get activa() {
      return montada;
    },
  };
}

export type FeatureRegistry = ReturnType<typeof createFeatureRegistry>;
