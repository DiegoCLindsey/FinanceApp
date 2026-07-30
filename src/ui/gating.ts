// ── ui/gating ─────────────────────────────────────────────────────────────────
// Aplica los feature flags a la interfaz (F2, tarea 2.4).
//
// Mientras las vistas siguen siendo las legacy, el gating actúa sobre el DOM del
// shell: oculta las entradas del sidebar de las funcionalidades desactivadas y,
// si la vista abierta se desactiva, redirige al dashboard. Cuando las vistas se
// porten a `src/features/` (tarea 1.7), cada manifest declarará su flag y este
// módulo pasará a consultar el registro de vistas en lugar del DOM.

import type { Flags } from '@/flags/service';

/** Feature → vista legacy (`data-view` del sidebar). */
export const VISTA_POR_FEATURE: Record<string, string> = {
  expenses: 'expenses',
  loans: 'loans',
  nominas: 'nominas',
  accounts: 'accounts',
  supuestos: 'escenarios',
  inflacion: 'inflacion',
  fiscalidad: 'rentas',
  margenes: 'margenes',
};

export interface GatingDeps {
  flags: Flags;
  document?: Document;
  /** Router legacy; se usa para redirigir si la vista activa se desactiva. */
  router?: { navigate: (view: string) => void };
}

export function createGating({ flags, document: doc = document, router }: GatingDeps) {
  function vistaActiva(): string | null {
    const activo = doc.querySelector<HTMLElement>('.nav-btn.active[data-view]');
    return activo?.dataset.view ?? null;
  }

  function apply(): void {
    let redirigir = false;
    for (const [featureId, view] of Object.entries(VISTA_POR_FEATURE)) {
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

    if (redirigir) {
      const r = router ?? (globalThis as { Router?: { navigate: (v: string) => void } }).Router;
      r?.navigate('dashboard');
    }
  }

  return { apply, vistaPara: (featureId: string) => VISTA_POR_FEATURE[featureId] };
}
