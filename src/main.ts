// ── src/main.ts ───────────────────────────────────────────────────────────────
// Punto de entrada del paquete nuevo (F1, tarea 1.1).
//
// Estrategia de migración incremental ("strangler fig"): este bundle se carga
// ANTES de los scripts legacy y publica los servicios tipados en
// `window.FinanceApp`. Los módulos legacy pueden ir consumiéndolos uno a uno, y
// las vistas se portan a `src/features/` sin un "big bang".
//
// La app legacy sigue funcionando aunque este bundle no esté presente (por
// ejemplo si se sirve el repo sin compilar): nada de lo legacy depende todavía
// de `window.FinanceApp`, y los consumidores deben comprobar su existencia.

import * as core from './core';
import * as engine from './engine/statement';
import * as analysis from './engine/analysis';
import * as margins from './engine/margins';
import * as optimizer from './engine/optimizer';
import { proyectarGastos } from './engine/providers/expenses';
import { proyectarPrestamos } from './engine/providers/loans';
import { proyectarTransferencias } from './engine/providers/transfers';
import { proyectarNominas } from './engine/providers/salaries';
import { proyectarInteresesCuentas } from './engine/providers/interests';
import { proyectarAportaciones } from './engine/providers/contributions';
import { proyectarRetencionesFiscales } from './engine/providers/withholdings';
import { proyectarInflacionGastos, proyectarPerdidaAhorro } from './engine/providers/inflation-events';
import { createStore, type Store } from './state/store';
import { createLocalStorageAdapter } from './state/storage/local';
import { SCHEMA_VERSION } from './state/schema';
import { createFlags, type Flags } from './flags/service';
import { FEATURES, featuresPorGrupo } from './flags/registry';
import { createFeaturesModal } from './ui/features-modal';
import { createGating } from './ui/gating';

export interface FinanceAppNamespace {
  version: number;
  core: typeof core;
  engine: {
    generarExtracto: typeof engine.generarExtracto;
    recomputarSaldoAcum: typeof engine.recomputarSaldoAcum;
    saldoHoy: typeof engine.saldoHoy;
    sumarPorTags: typeof engine.sumarPorTags;
    providers: {
      proyectarGastos: typeof proyectarGastos;
      proyectarPrestamos: typeof proyectarPrestamos;
      proyectarTransferencias: typeof proyectarTransferencias;
      proyectarNominas: typeof proyectarNominas;
      proyectarInteresesCuentas: typeof proyectarInteresesCuentas;
      proyectarAportaciones: typeof proyectarAportaciones;
      proyectarRetencionesFiscales: typeof proyectarRetencionesFiscales;
      proyectarInflacionGastos: typeof proyectarInflacionGastos;
      proyectarPerdidaAhorro: typeof proyectarPerdidaAhorro;
    };
    analysis: typeof analysis;
    margins: typeof margins;
    optimizer: typeof optimizer;
  };
  /** Store tipado ya cargado (migraciones aplicadas). */
  store: Store;
  /** Servicio de feature flags sobre el store. */
  flags: Flags;
  featureRegistry: { all: typeof FEATURES; porGrupo: typeof featuresPorGrupo };
  ui: {
    /** Abre la ventana de configuración de funcionalidades. */
    openFeatures: () => void;
    /** Re-aplica el gating de los flags al shell (sidebar y vista activa). */
    applyGating: () => void;
  };
}

function bootstrap(): FinanceAppNamespace {
  const store = createStore({ adapter: createLocalStorageAdapter() });
  const { applied } = store.load();
  if (applied.length > 0) {
    console.info(`[FinanceApp] Migraciones aplicadas: ${applied.join(', ')} (esquema v${SCHEMA_VERSION})`);
  }
  const flags = createFlags(store);
  const gating = createGating({ flags });
  const featuresModal = createFeaturesModal({
    flags,
    onChange: () => {
      gating.apply();
      // Re-render de la vista activa para que refleje el cambio de inmediato
      (globalThis as { Router?: { rerender?: () => void } }).Router?.rerender?.();
    },
  });

  return {
    version: SCHEMA_VERSION,
    core,
    engine: {
      generarExtracto: engine.generarExtracto,
      recomputarSaldoAcum: engine.recomputarSaldoAcum,
      saldoHoy: engine.saldoHoy,
      sumarPorTags: engine.sumarPorTags,
      providers: {
        proyectarGastos,
        proyectarPrestamos,
        proyectarTransferencias,
        proyectarNominas,
        proyectarInteresesCuentas,
        proyectarAportaciones,
        proyectarRetencionesFiscales,
        proyectarInflacionGastos,
        proyectarPerdidaAhorro,
      },
      analysis,
      margins,
      optimizer,
    },
    store,
    flags,
    featureRegistry: { all: FEATURES, porGrupo: featuresPorGrupo },
    ui: { openFeatures: featuresModal.open, applyGating: gating.apply },
  };
}

declare global {
  interface Window {
    FinanceApp?: FinanceAppNamespace;
  }
}

// El bundle se carga como script clásico: publicar en window es intencionado.
if (typeof window !== 'undefined') {
  const app = bootstrap();
  window.FinanceApp = app;

  // El shell legacy se monta después de este script (y el sidebar se revela al
  // pasar la autenticación), así que el gating se aplica cuando el DOM está listo
  // y de nuevo tras cada navegación.
  const aplicarGating = () => app.ui.applyGating();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicarGating, { once: true });
  } else {
    aplicarGating();
  }
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('.nav-btn[data-view]')) setTimeout(aplicarGating, 0);
  });
}

export { bootstrap };
