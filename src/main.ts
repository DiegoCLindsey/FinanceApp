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
import * as avisos from './engine/avisos';
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
import { crearRegistroCambios, type RegistroCambios } from './state/cambios';
import { aplicarCopia, COLECCIONES, faltantesEnCopia, snapshotParaCopia } from './state/colecciones';
import { adoptarClavesHuerfanas, createLocalStorageAdapter } from './state/storage/local';
import { SCHEMA_VERSION } from './state/schema';
import { createFlags, type Flags } from './flags/service';
import { FEATURES, featuresPorGrupo } from './flags/registry';
import { createFeaturesModal } from './ui/features-modal';
import { createGating } from './ui/gating';
import { instalarDeshacer } from './ui/deshacer';
import { instalarBuscador } from './ui/buscador';
import { instalarAvisoGuardado, type Guardado } from './ui/guardado';
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
import { createPlannerFeature } from './features/planner';
import { createLedger, type Ledger } from './accounting/ledger';
import { createTagService, type TagService } from './accounting/tags';
import { createPrecisionAnalyzer, type PrecisionAnalyzer } from './accounting/precision';
import { createAdjuster, sugerirAjuste, type Adjuster } from './accounting/adjust';
import { bandaAcumulada, bandaDeConfianza, describirBanda, medirVariabilidad } from './accounting/confianza';
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
    /** Avisos con antelación sobre los cruces ya detectados. */
    avisos: typeof avisos;
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
    /**
     * Engancha el aviso flotante con «Deshacer» a los borrados del store.
     * Devuelve el `detener`.
     */
    instalarDeshacer: () => () => void;
    /** Monta la búsqueda global (Ctrl+K y lupa). Devuelve el `detener`. */
    instalarBuscador: () => () => void;
    /**
     * Monta el aviso de «cambios sin guardar». Lo consume `data-io` para que el
     * temporizador de autoguardado enseñe el mismo «Subiendo… → ¡Guardado!».
     */
    avisoGuardado: Guardado | null;
  };
  /** Registro de vistas del paquete nuevo; lo consulta el router del shell. */
  app: FeatureRegistry;
  /** Sesión persistente entre recargas; la consume auth/auth.js. */
  session: SessionService & {
    /** Arranca la vigilancia de inactividad; devuelve el `detener`. */
    vigilar: (onCaducada: () => void) => () => void;
    opciones: typeof OPCIONES_AUTOLOGOUT;
  };
  /**
   * Señal única de «ha cambiado algo». De ella cuelgan el recálculo perezoso de
   * las gráficas y el aviso de cambios sin guardar. Ver `state/cambios`.
   */
  cambios: RegistroCambios;
  /** Copias de seguridad: una sola lista de colecciones para las cuatro rutas. */
  datos: {
    /** Todas las colecciones del esquema. */
    colecciones: typeof COLECCIONES;
    /** Copia completa leída del almacenamiento (no de una copia en memoria). */
    snapshot: () => Record<string, unknown>;
    /**
     * Vuelca una copia y RECARGA el store. Sin la recarga, el store se queda
     * con lo de antes y la primera escritura resucita los datos viejos.
     */
    aplicar: (copia: Record<string, unknown>, opciones?: { sellar?: boolean }) => string[];
    /** Colecciones que la copia no trae y que se quedan como estaban. */
    faltantes: (copia: Record<string, unknown>) => string[];
    /** Relee el almacenamiento en el store (tras una escritura externa). */
    recargar: () => void;
  };
  /** Contabilidad real (F4): ledger, etiquetas compartidas y precisión. */
  accounting: {
    ledger: Ledger;
    tags: TagService;
    precision: PrecisionAnalyzer;
    adjuster: Adjuster;
    sugerirAjuste: typeof sugerirAjuste;
    /** Banda de confianza de la proyección, medida con la contabilidad real. */
    medirVariabilidad: typeof medirVariabilidad;
    bandaDeConfianza: typeof bandaDeConfianza;
    bandaAcumulada: typeof bandaAcumulada;
    describirBanda: typeof describirBanda;
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
  // El adapter se guarda: las copias de seguridad se leen y se escriben DESDE
  // EL ALMACENAMIENTO, no desde ninguna copia en memoria. Ver `state/colecciones`.
  const almacen = createLocalStorageAdapter();
  const store = createStore({ adapter: almacen });
  const cambios = crearRegistroCambios();
  const { applied } = store.load();
  if (applied.length > 0) {
    console.info(`[FinanceApp] Migraciones aplicadas: ${applied.join(', ')} (esquema v${SCHEMA_VERSION})`);
  }
  // Cualquier escritura en el store marca los datos como cambiados. Va aquí y
  // no en cada vista por lo mismo que el deshacer: el store es el embudo por el
  // que pasan todos los cambios, así que engancharlo una vez lo cubre todo y
  // ninguna pantalla futura puede olvidarse de avisar.
  store.subscribe((clave) => cambios.marcar(clave));

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
  app.register(createPlannerFeature({ store, onDatosCambiados: refrescarLegacy }));
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
      avisos,
      optimizer,
      dashboard,
    },
    store,
    flags,
    featureRegistry: { all: FEATURES, porGrupo: featuresPorGrupo },
    ui: {
      openFeatures: featuresModal.open,
      applyGating: gating.apply,
      watchGating: () => gating.observar(),
      instalarDeshacer: () =>
        instalarDeshacer({
          store,
          // Restaurar es un cambio de datos como cualquier otro, así que hace
          // falta lo MISMO que hace `refrescarLegacy` tras guardar: releer el
          // State legacy —que es una copia aparte— y luego repintar. Solo
          // repintar dejaría el cuadro de mando enseñando el dato viejo.
          rerender: () => {
            const g = globalThis as { State?: { load?: () => unknown }; Router?: { rerender?: () => void } };
            g.State?.load?.();
            g.Router?.rerender?.();
          },
        }),
      // Lo rellena `arrancarAvisoGuardado()` al montar el shell; hasta entonces
      // es null y quien lo consulte debe comprobarlo.
      avisoGuardado: null as Guardado | null,
      instalarBuscador: () =>
        instalarBuscador({
          // Lecturas directas y no `snapshot()`: esto se llama en CADA tecla y
          // snapshot clona el estado entero. La búsqueda solo lee.
          estado: () => ({
            accounts: store.get('accounts'),
            expenses: store.get('expenses'),
            loans: store.get('loans'),
            nominas: store.get('nominas'),
            escenarios: store.get('escenarios'),
            planes: store.get('planes'),
            goals: store.get('goals'),
            transacciones: store.get('transacciones'),
          }),
          // Lo que vive en una vista apagada por un flag no se ofrece: llevaría
          // a una pantalla que no existe.
          rutasDisponibles: () => app.routes(),
          navegar: (ruta) => (globalThis as { Router?: { navigate?: (v: string) => void } }).Router?.navigate?.(ruta),
        }),
    },
    app,
    session: Object.assign(sesion, {
      vigilar: (onCaducada: () => void) => vigilarInactividad({ sesion, onCaducada }),
      opciones: OPCIONES_AUTOLOGOUT,
    }),
    cambios,
    datos: {
      colecciones: COLECCIONES,
      snapshot: () => snapshotParaCopia(almacen) as Record<string, unknown>,
      aplicar: (copia, { sellar = true } = {}) => {
        // `setRestaurando` del legacy escribe SIN mover el sello de última
        // modificación: lo que baja de la nube no es una modificación tuya.
        const escribir = sellar
          ? (k: string, v: unknown) => almacen.set(k, v)
          : (k: string, v: unknown) => {
              const legacy = (globalThis as { StorageAdapter?: { setRestaurando?: (k: string, v: unknown) => void } }).StorageAdapter;
              if (legacy?.setRestaurando) legacy.setRestaurando(k, v);
              else almacen.set(k, v);
            };
        const escritas = aplicarCopia(escribir, copia);
        // Recargar NO es opcional. El store se carga al arrancar la página, y
        // una restauración o un import ocurren después: sin releer, su copia en
        // memoria sigue siendo la de antes y la siguiente escritura devuelve al
        // almacenamiento los datos viejos. Es la causa de «recargo y vuelven
        // datos antiguos». Además, así una copia con esquema viejo pasa por las
        // migraciones en vez de quedarse a medias.
        store.load();
        cambios.marcar('copia-restaurada');
        return escritas;
      },
      faltantes: (copia) => faltantesEnCopia(copia),
      recargar: () => {
        store.load();
        cambios.marcar('recarga-externa');
      },
    },
    accounting: { ledger, tags, precision, adjuster, sugerirAjuste, medirVariabilidad, bandaDeConfianza, bandaAcumulada, describirBanda },
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
      app.ui.instalarDeshacer();
      app.ui.instalarBuscador();
      // El aviso de cambios sin guardar. Solo tiene sentido con un destino de
      // copia configurado: sin nube no hay nada que subir y el aviso sería ruido.
      const g = globalThis as {
        FirebaseService?: { isConnected?: () => boolean; uploadBackup?: () => Promise<void> };
        DropboxService?: { isConnected?: () => boolean; uploadBackup?: () => Promise<void> };
      };
      const destino = () =>
        g.FirebaseService?.isConnected?.() ? g.FirebaseService : g.DropboxService?.isConnected?.() ? g.DropboxService : null;
      app.ui.avisoGuardado = instalarAvisoGuardado({
        cambios: app.cambios,
        hayDestino: () => destino() !== null,
        guardar: async () => {
          const s = destino();
          if (!s?.uploadBackup) throw new Error('No hay ningún destino de copia conectado.');
          await s.uploadBackup();
        },
      });
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
