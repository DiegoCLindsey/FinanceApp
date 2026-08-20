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
import * as dashboard from './engine/dashboard';
import { proyectarGastos } from './engine/providers/expenses';
import { proyectarPrestamos } from './engine/providers/loans';
import { proyectarTransferencias } from './engine/providers/transfers';
import { proyectarNominas } from './engine/providers/salaries';
import { proyectarInteresesCuentas } from './engine/providers/interests';
import { proyectarAportaciones } from './engine/providers/contributions';
import { proyectarRetencionesFiscales } from './engine/providers/withholdings';
import { proyectarInflacionGastos, proyectarPerdidaAhorro } from './engine/providers/inflation-events';
import { createStore, type Store } from './state/store';
import { adoptarClavesHuerfanas, createLocalStorageAdapter } from './state/storage/local';
import { SCHEMA_VERSION } from './state/schema';
import { createFlags, type Flags } from './flags/service';
import { FEATURES, featuresPorGrupo } from './flags/registry';
import { createFeaturesModal } from './ui/features-modal';
import { createGating } from './ui/gating';
import { instalarConsultaFlags } from './flags/guard';
import { createFeatureRegistry, type FeatureRegistry } from './app/feature-registry';
import { createAccountingFeature } from './features/accounting';
import { createMarginsFeature } from './features/margins';
import { createInflationFeature } from './features/inflation';
import { createExpensesFeature } from './features/expenses';
import { createLoansFeature } from './features/loans';
import { createSalariesFeature } from './features/salaries';
import { createAccountsFeature } from './features/accounts';
import { createTaxesFeature } from './features/taxes';
import { createScenariosFeature } from './features/scenarios';
import { createLedger, type Ledger } from './accounting/ledger';
import { createTagService, type TagService } from './accounting/tags';
import { createPrecisionAnalyzer, type PrecisionAnalyzer } from './accounting/precision';
import { createAdjuster, sugerirAjuste, type Adjuster } from './accounting/adjust';
import { createSessionService, vigilarInactividad, OPCIONES_AUTOLOGOUT, type SessionService } from './auth/session';

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
    dashboard: typeof dashboard;
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
    /**
     * Arranca la vigilancia del DOM para que lo marcado con `data-feature`
     * siga oculto tras cada repintado. Devuelve el `detener`.
     */
    watchGating: () => () => void;
  };
  /** Registro de vistas del paquete nuevo; lo consulta el router del shell. */
  app: FeatureRegistry;
  /** Sesión persistente entre recargas; la consume auth/auth.js. */
  session: SessionService & {
    /** Arranca la vigilancia de inactividad; devuelve el `detener`. */
    vigilar: (onCaducada: () => void) => () => void;
    opciones: typeof OPCIONES_AUTOLOGOUT;
  };
  /** Contabilidad real (F4): ledger, etiquetas compartidas y precisión. */
  accounting: {
    ledger: Ledger;
    tags: TagService;
    precision: PrecisionAnalyzer;
    adjuster: Adjuster;
    sugerirAjuste: typeof sugerirAjuste;
  };
}

function bootstrap(): FinanceAppNamespace {
  // Recupera lo que las compilaciones con el bug del espacio de nombres
  // escribieron fuera de `financeapp_` (ver adoptarClavesHuerfanas).
  if (typeof localStorage !== 'undefined') {
    const adoptadas = adoptarClavesHuerfanas();
    if (adoptadas.length > 0) {
      console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${adoptadas.join(', ')}`);
    }
  }
  const store = createStore({ adapter: createLocalStorageAdapter() });
  const { applied } = store.load();
  if (applied.length > 0) {
    console.info(`[FinanceApp] Migraciones aplicadas: ${applied.join(', ')} (esquema v${SCHEMA_VERSION})`);
  }
  const flags = createFlags(store);
  // Segunda línea de defensa: a partir de aquí, las operaciones de las
  // funcionalidades opcionales fallan si su flag está apagado en vez de
  // devolver resultados que nadie debería estar viendo. Ver `flags/guard`.
  instalarConsultaFlags((id) => flags.isEnabled(id));
  // El límite se lee en cada comprobación, no se captura: mientras el modal de
  // datos siga siendo legacy, es `State` quien tiene la copia recién escrita y
  // la del store se queda atrás hasta la siguiente recarga. Puente temporal,
  // como `refrescarLegacy` (se retira al portar el modal de datos, tarea 1.7).
  const sesion = createSessionService({
    autoLogoutMinutos: () => {
      const legacy = (globalThis as { State?: { get?: (k: string) => { autoLogoutMinutos?: number } | undefined } }).State?.get?.('config');
      return Number(legacy?.autoLogoutMinutos ?? store.get('config').autoLogoutMinutos ?? 0);
    },
  });
  const ledger = createLedger(store);
  const tags = createTagService(store);
  const precision = createPrecisionAnalyzer(ledger);
  const adjuster = createAdjuster(store);

  // Registro de vistas nuevas. El router legacy lo consulta para alojarlas.
  const app = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  const gating = createGating({ flags, rutasExtra: () => app.flagPorRuta() });
  const featuresModal = createFeaturesModal({
    flags,
    onChange: () => {
      app.attachToShell();
      gating.apply();
      // Re-render de la vista activa para que refleje el cambio de inmediato
      (globalThis as { Router?: { rerender?: () => void } }).Router?.rerender?.();
    },
  });

  // Recarga del State legacy: comparte las claves de localStorage con el store
  // nuevo, pero mantiene su propia copia en memoria. Hasta portar el dashboard
  // (1.7), tras escribir desde una vista nueva hay que pedirle que relea.
  //
  // Y además hay que REPINTAR el dashboard si es la vista abierta: releer el
  // State no redibuja nada, así que sus gráficas se quedaban con los datos de
  // antes sin ninguna señal de estar caducadas. Solo el dashboard: las vistas
  // nuevas se refrescan solas (`deps.refrescar`) y repintarlas aquí duplicaría
  // el trabajo y les haría perder el estado abierto de sus tarjetas.
  const refrescarLegacy = () => {
    const g = globalThis as {
      State?: { load?: () => unknown };
      Router?: { rerender?: () => void; current?: () => string };
      DashboardModule?: { render?: () => void };
    };
    g.State?.load?.();
    if (g.Router?.current?.() !== 'dashboard') return;
    try {
      g.DashboardModule?.render?.();
    } catch (e) {
      // Repintar no debe tumbar la operación que acaba de guardar bien.
      console.error('[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:', e);
    }
  };

  // El ORDEN IMPORTA: el registro añade cada botón al final de su sección, así
  // que este es el orden en que aparecen en el menú. Se mantiene el que el
  // usuario ya conocía cuando los botones estaban escritos en index.html.
  // Mi dinero:
  app.register(createExpensesFeature({ store, onDatosCambiados: refrescarLegacy }));
  app.register(createLoansFeature({ store, onDatosCambiados: refrescarLegacy }));
  app.register(createSalariesFeature({ store, onDatosCambiados: refrescarLegacy }));
  app.register(
    createAccountsFeature({
      store,
      ledger,
      mostrarObjetivos: () => flags.isEnabled('goals'),
      onDatosCambiados: refrescarLegacy,
    }),
  );
  app.register(
    createAccountingFeature({
      ledger,
      tags,
      precision,
      adjuster,
      accounts: () => store.get('accounts'),
      estimaciones: () => store.get('expenses'),
      onDatosCambiados: refrescarLegacy,
    }),
  );
  // Planificación:
  app.register(createScenariosFeature({ store, onDatosCambiados: refrescarLegacy }));
  app.register(createInflationFeature({ store, onDatosCambiados: refrescarLegacy }));
  app.register(createTaxesFeature({ store }));
  app.register(createMarginsFeature({ store, onDatosCambiados: refrescarLegacy }));

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
      dashboard,
    },
    store,
    flags,
    featureRegistry: { all: FEATURES, porGrupo: featuresPorGrupo },
    ui: { openFeatures: featuresModal.open, applyGating: gating.apply, watchGating: () => gating.observar() },
    app,
    session: Object.assign(sesion, {
      vigilar: (onCaducada: () => void) => vigilarInactividad({ sesion, onCaducada }),
      opciones: OPCIONES_AUTOLOGOUT,
    }),
    accounting: { ledger, tags, precision, adjuster, sugerirAjuste },
  };
}

declare global {
  interface Window {
    FinanceApp?: FinanceAppNamespace;
    /** Diagnóstico cuando el arranque falla; la UI lo consulta para explicarlo. */
    FinanceAppError?: { mensaje: string; stack?: string };
  }
}

/**
 * Arranca y publica el namespace. Si algo falla, la app legacy tiene que seguir
 * funcionando, así que el error se captura y se deja en `window.FinanceAppError`
 * para que la UI pueda explicarlo en vez de comportarse como si el bundle no
 * existiera (que era lo que ocurría antes: un fallo aquí dejaba
 * `window.FinanceApp` sin definir y sin ninguna pista del motivo).
 */
function publicar(): FinanceAppNamespace | null {
  try {
    const app = bootstrap();
    window.FinanceApp = app;
    return app;
  } catch (e) {
    const err = e as Error;
    window.FinanceAppError = { mensaje: err?.message ?? String(e), stack: err?.stack };
    console.error('[FinanceApp] El paquete nuevo no pudo arrancar:', e);
    return null;
  }
}

// El bundle se carga como script clásico: publicar en window es intencionado.
const app = typeof window !== 'undefined' ? publicar() : null;

if (app) {
  // El shell legacy se monta después de este script (y el sidebar se revela al
  // pasar la autenticación), así que el gating se aplica cuando el DOM está listo
  // y de nuevo tras cada navegación.
  let vigilando = false;
  const aplicarGating = () => {
    app.app.attachToShell();
    app.ui.applyGating();
    // Las vistas se repintan con innerHTML, así que un barrido puntual no basta:
    // el observador mantiene oculto lo desactivado tras cada repintado.
    if (!vigilando) {
      vigilando = true;
      app.ui.watchGating();
    }
  };
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
