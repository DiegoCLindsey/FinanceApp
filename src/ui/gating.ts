// ── ui/gating ─────────────────────────────────────────────────────────────────
// Aplica los feature flags a la interfaz (F2, tarea 2.4).
//
// Dos ámbitos distintos:
//
// 1. **Vistas** (entradas del sidebar). Se ocultan las de funcionalidades
//    desactivadas y, si la vista abierta se desactiva, se redirige al
//    dashboard.
//
// 2. **Sub-funcionalidades dentro de una vista** — la pestaña de precisión
//    de estimaciones, los paneles del dashboard… Estas no tienen entrada en
//    el sidebar, así que el gating por vista no las tocaba y sus botones
//    salían aunque la funcionalidad estuviera apagada. Ahora cualquier
//    elemento marcado con `data-feature="<id>"` desaparece si su flag está
//    desactivado, venga de una vista nueva o del shell legacy.
//
// El barrido se repite ante cada cambio del DOM (`observar`), porque las vistas
// se repintan enteras con `innerHTML` y un barrido único en el arranque se
// perdería en el primer re-render.
//
// Ocultar no basta como garantía: un DOM viejo, un enlace guardado o una llamada
// desde la consola se saltan esto. La segunda línea de defensa está en
// `flags/guard`, que hace fallar la operación en vez de devolver resultados.

import type { Flags } from '@/flags/service';

/** Feature → vista legacy (`data-view` del sidebar). */
export const VISTA_POR_FEATURE: Record<string, string> = {
  expenses: 'expenses',
  loans: 'loans',
  nominas: 'nominas',
  accounts: 'accounts',
  margenes: 'margenes',
};

export interface GatingDeps {
  flags: Flags;
  document?: Document;
  /** Router legacy; se usa para redirigir si la vista activa se desactiva. */
  router?: { navigate: (view: string) => void };
  /**
   * Rutas de las vistas del paquete nuevo (`{ ruta: flagId }`), que se registran
   * en tiempo de ejecución y no están en el mapa estático de vistas legacy.
   */
  rutasExtra?: () => Record<string, string>;
}

/**
 * Oculta todo lo marcado con `data-feature` cuyo flag esté desactivado.
 *
 * Además de ocultarlo lo marca `disabled` y con `aria-hidden` si es un control:
 * un botón con `display:none` sigue siendo enfocable por teclado en algunos
 * navegadores, y sigue respondiendo a un `.click()` mediante programación.
 *
 * Se exporta suelta para poder llamarla desde una vista concreta justo después
 * de repintar, sin esperar al observador.
 */
export function aplicarGateDom(raiz: ParentNode, activa: (featureId: string) => boolean): void {
  raiz.querySelectorAll<HTMLElement>('[data-feature]').forEach((el) => {
    const id = el.dataset.feature;
    if (!id) return;
    const ok = activa(id);
    el.style.display = ok ? '' : 'none';
    if (ok) {
      el.removeAttribute('aria-hidden');
      if ('disabled' in el) (el as HTMLElement & { disabled: boolean }).disabled = false;
    } else {
      el.setAttribute('aria-hidden', 'true');
      if ('disabled' in el) (el as HTMLElement & { disabled: boolean }).disabled = true;
    }
  });
}

export function createGating({ flags, document: doc = document, router, rutasExtra }: GatingDeps) {
  function vistaActiva(): string | null {
    const activo = doc.querySelector<HTMLElement>('.nav-btn.active[data-view]');
    return activo?.dataset.view ?? null;
  }

  function apply(): void {
    let redirigir = false;
    // Vistas legacy (mapa estático) + vistas nuevas (registro en runtime)
    const extra = Object.entries(rutasExtra?.() ?? {}).map(([ruta, flagId]) => [flagId, ruta] as [string, string]);
    for (const [featureId, view] of [...Object.entries(VISTA_POR_FEATURE), ...extra]) {
      const activa = flags.isEnabled(featureId);
      const btn = doc.querySelector<HTMLElement>(`.nav-btn[data-view="${view}"]`);
      if (btn) {
        // El <li> agrupa varias vistas: se oculta el botón, no la sección
        btn.style.display = activa ? '' : 'none';
      }
      if (!activa && vistaActiva() === view) redirigir = true;
    }
    // Las secciones del sidebar sin ningún botón visible se ocultan enteras
    doc.querySelectorAll<HTMLElement>('.nav-section').forEach((section) => {
      const botones = [...section.querySelectorAll<HTMLElement>('.nav-btn[data-view]')];
      if (botones.length === 0) return;
      const algunoVisible = botones.some((b) => b.style.display !== 'none');
      section.style.display = algunoVisible ? '' : 'none';
    });

    // Sub-funcionalidades dentro de las vistas
    aplicarGateDom(doc, (id) => flags.isEnabled(id));

    if (redirigir) {
      const r = router ?? (globalThis as { Router?: { navigate: (v: string) => void } }).Router;
      r?.navigate('dashboard');
    }
  }

  /**
   * Vuelve a barrer `data-feature` ante cualquier cambio del DOM.
   *
   * Las vistas se repintan reemplazando `innerHTML` entero, así que un barrido
   * único en el arranque se pierde en cuanto el usuario navega o se refresca
   * una tarjeta. El observador es la forma de cubrir también las vistas legacy,
   * que no consultan los flags al pintar.
   *
   * Se desconecta mientras aplica sus propios cambios: si no, cada `display`
   * que escribe dispara otra notificación y se realimenta.
   */
  function observar(raiz: Node = doc.body): () => void {
    if (typeof MutationObserver === 'undefined') return () => {};
    let aplicando = false;
    const obs = new MutationObserver(() => {
      if (aplicando) return;
      aplicando = true;
      try {
        aplicarGateDom(doc, (id) => flags.isEnabled(id));
      } finally {
        aplicando = false;
      }
    });
    obs.observe(raiz, { childList: true, subtree: true });
    return () => obs.disconnect();
  }

  return { apply, observar, vistaPara: (featureId: string) => VISTA_POR_FEATURE[featureId] };
}
