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
import * as dashboard from './engine/dashboard';
import * as mes from './engine/mes';
import { tarjetaMes } from './features/dashboard/mes-card';
import { abrirHistoricoMeses } from './features/dashboard/mes-historico';
import { abrirCrearInforme } from './features/informe/dialogo';
import { construirInforme } from './informe/modelo';
import { informeHtml } from './informe/html';
import { todayISO } from './core/dates';
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
import {
  aplicarCopia,
  CLAVE_VERSION_COPIA,
  COLECCIONES,
  esEstadoVacioOPorDefecto,
  faltantesEnCopia,
  inferirVersionDeCopia,
  snapshotParaCopia,
} from './state/colecciones';
import { adoptarClavesHuerfanas, createLocalStorageAdapter, EVENTO_SIN_ESPACIO, KEY_PREFIX, VERSION_KEY } from './state/storage/local';
import { LEGACY_KEYS } from './state/migrations';
import { crearServicioProyectos, leerColeccionesDeProyecto, namespaceDeProyecto, remapearIds, type Proyecto } from './state/proyectos';
import type { AppState, CollectionKey } from './state/schema';
import { SCHEMA_VERSION } from './state/schema';
import { createFlags, type Flags } from './flags/service';
import { FEATURES, featuresPorGrupo } from './flags/registry';
import { createFeaturesModal } from './ui/features-modal';
import { createProyectosModal } from './ui/proyectos-modal';
import { createPersonasModal } from './ui/personas-modal';
import { createGating } from './ui/gating';
import { instalarDeshacer } from './ui/deshacer';
import { instalarBuscador } from './ui/buscador';
import { instalarCamposFecha } from './ui/campos-fecha';
import { instalarAvisoGuardado, type Guardado } from './ui/guardado';
import { instalarConsultaFlags } from './flags/guard';
import { createFeatureRegistry, type FeatureRegistry } from './app/feature-registry';
import { createMarginsFeature } from './features/margins';
import { createExpensesFeature } from './features/expenses';
import { createLoansFeature } from './features/loans';
import { createSalariesFeature } from './features/salaries';
import { createAccountsFeature } from './features/accounts';
import { createLedger, type Ledger } from './accounting/ledger';
import { createTagService, type TagService } from './accounting/tags';
import { createPrecisionAnalyzer, type PrecisionAnalyzer } from './accounting/precision';
import { createAdjuster, sugerirAjuste, type Adjuster } from './accounting/adjust';
import { bandaAcumulada, bandaDeConfianza, describirBanda, medirVariabilidad } from './accounting/confianza';
import { createSessionService, vigilarInactividad, OPCIONES_AUTOLOGOUT, type SessionService } from './auth/session';
import { crearBiometria, type Biometria } from './auth/biometria';

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
    dashboard: typeof dashboard;
    /** Desglose del mes en curso y meses de calendario. */
    mes: typeof mes;
  };
  /** Store tipado ya cargado (migraciones aplicadas). */
  store: Store;
  /** Servicio de feature flags sobre el store. */
  flags: Flags;
  featureRegistry: { all: typeof FEATURES; porGrupo: typeof featuresPorGrupo };
  ui: {
    /** HTML de la tarjeta «Este mes» del cuadro de mando. */
    tarjetaMes: typeof tarjetaMes;
    /** Ventana «Meses anteriores» con el mismo desglose por mes. */
    abrirHistoricoMeses: typeof abrirHistoricoMeses;
    /** Ventana «Crear informe». */
    abrirCrearInforme: () => void;
    /** Abre la ventana de configuración de funcionalidades. */
    openFeatures: () => void;
    /** Abre la ventana de proyectos: cambiar, crear, renombrar, duplicar, importar. */
    openProyectos: () => void;
    /** Abre la ventana de personas: crear, renombrar, marcar por defecto, activar/desactivar. */
    openPersonas: () => void;
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
   * Desbloqueo con huella dactilar (o el autenticador de plataforma que dé el
   * dispositivo) para la clave de cifrado de la copia en la nube. Ver
   * `auth/biometria`.
   */
  biometria: Biometria;
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
    /**
     * ¿El estado local es, en la práctica, el de fábrica? Lo usa `auth.js` para
     * no preguntar «¿qué copia conservas?» cuando el local no tiene nada real
     * que perder. Ver `state/colecciones.esEstadoVacioOPorDefecto`.
     */
    esVacioOPorDefecto: () => boolean;
  };
  /**
   * Varios proyectos para un mismo usuario: cada uno es una instancia
   * separada (sus propias cuentas, gastos, préstamos... todo), en un espacio
   * de nombres de localStorage distinto. Ver `state/proyectos`.
   */
  proyectos: {
    /** Todos los proyectos (siempre incluye `default`, el de siempre). */
    listar: () => Proyecto[];
    /** El proyecto que está cargado ahora mismo en esta pestaña. */
    activo: () => Proyecto;
    /** Colecciones que se pueden importar de un proyecto a otro (todo menos `config`). */
    colecciones: CollectionKey[];
    crear: (nombre: string) => Proyecto;
    renombrar: (id: string, nombre: string) => void;
    /** Copia el estado entero a un proyecto nuevo e independiente. */
    duplicar: (id: string, nombreNuevo?: string) => Proyecto;
    eliminar: (id: string) => void;
    /**
     * Marca qué proyecto está activo. Cambiar de proyecto de verdad exige
     * recargar la página (el store, los servicios y las vistas se calculan
     * una sola vez al arrancar) — esta función solo dice cuál tocará cargar
     * la próxima vez; recargar es cosa de quien la llame.
     */
    cambiarA: (id: string) => void;
    /**
     * Fusiona en el registro local los proyectos que llegan de la nube (por
     * id, quedándose con el más reciente de cada uno si hay conflicto) — no
     * sustituye la lista entera, para no borrar un proyecto local que la
     * copia remota todavía no conoce. La llama el puente legacy con Firebase
     * al reanudar sesión o iniciar sesión, para que un proyecto creado en
     * OTRO dispositivo aparezca aquí. Devuelve la lista ya fusionada.
     */
    fusionarRemotos: (remotos: Proyecto[]) => Proyecto[];
    /**
     * Trae colecciones de OTRO proyecto al activo, con ids nuevos y las
     * referencias cruzadas entre ellas ya corregidas (ver `remapearIds`). Se
     * añaden a lo que ya hay — no sustituye nada.
     */
    importarDesde: (idOrigen: string, colecciones: CollectionKey[]) => { importadas: CollectionKey[] };
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
  // Varios proyectos: el registro vive fuera de cualquier espacio de nombres
  // de proyecto (si no, cada proyecto vería una lista distinta), y decide qué
  // espacio de nombres usa TODO lo demás de este arranque — el adapter, el
  // store, y más abajo el puente legacy y las rutas de copia en la nube. Ver
  // `state/proyectos`.
  const proyectosSvc = crearServicioProyectos();
  const idProyectoActivo = proyectosSvc.activo();
  const namespaceActivo = namespaceDeProyecto(idProyectoActivo);

  // El adapter se guarda: las copias de seguridad se leen y se escriben DESDE
  // EL ALMACENAMIENTO, no desde ninguna copia en memoria. Ver `state/colecciones`.
  const almacen = createLocalStorageAdapter(localStorage, namespaceActivo);
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

  /**
   * Sube la lista de proyectos (ids y nombres, no sus datos) a la nube
   * conectada, si hay alguna — en segundo plano y sin bloquear ni avisar de
   * un fallo puntual, igual que el resto de escrituras "best-effort" de este
   * arranque (ver el aviso de guardado, más abajo). Sin esto, un proyecto
   * creado aquí solo lo conoce este dispositivo hasta el siguiente
   * autoguardado — o nunca, si el usuario no vuelve a tocar ningún dato.
   */
  function subirRegistroProyectos(): void {
    const g = globalThis as { FirebaseService?: { isConnected?: () => boolean; uploadRegistroProyectos?: () => Promise<void> } };
    if (!g.FirebaseService?.isConnected?.()) return;
    g.FirebaseService.uploadRegistroProyectos?.()?.catch((e: unknown) =>
      console.warn('[FinanceApp] No se ha podido subir la lista de proyectos:', e instanceof Error ? e.message : e),
    );
  }

  // Se construye aquí (no en el objeto de retorno) porque también lo necesita
  // `proyectosModal`, más abajo, para poder abrirse desde el sidebar.
  const proyectosAPI: FinanceAppNamespace['proyectos'] = {
    listar: () => proyectosSvc.listar(),
    activo: () => proyectosSvc.listar().find((p) => p._id === idProyectoActivo) ?? proyectosSvc.listar()[0],
    colecciones: COLECCIONES.filter((k): k is CollectionKey => k !== 'config'),
    crear: (nombre) => {
      const p = proyectosSvc.crear(nombre);
      subirRegistroProyectos();
      return p;
    },
    renombrar: (id, nombre) => {
      proyectosSvc.renombrar(id, nombre);
      subirRegistroProyectos();
    },
    duplicar: (id, nombreNuevo) => {
      const p = proyectosSvc.duplicar(id, nombreNuevo);
      subirRegistroProyectos();
      return p;
    },
    eliminar: (id) => {
      proyectosSvc.eliminar(id);
      subirRegistroProyectos();
    },
    cambiarA: (id) => proyectosSvc.establecerActivo(id),
    fusionarRemotos: (remotos) => proyectosSvc.fusionarRemotos(remotos),
    importarDesde: (idOrigen, colecciones) => {
      const leidas = leerColeccionesDeProyecto(localStorage, idOrigen, colecciones);
      const remapeadas = remapearIds(leidas);
      const importadas: CollectionKey[] = [];
      for (const col of colecciones) {
        const nuevos = remapeadas[col];
        if (!Array.isArray(nuevos) || nuevos.length === 0) continue;
        const actuales = store.get(col) as unknown[];
        store.set(col, [...actuales, ...nuevos] as unknown as AppState[CollectionKey]);
        importadas.push(col);
      }
      if (importadas.length > 0) cambios.marcar('importado-de-otro-proyecto');
      return { importadas };
    },
  };

  const flags = createFlags(store);
  // Segunda línea de defensa: a partir de aquí, las operaciones de las
  // funcionalidades opcionales fallan si su flag está apagado en vez de
  // devolver resultados que nadie debería estar viendo. Ver `flags/guard`.
  instalarConsultaFlags((id) => flags.isEnabled(id));
  // Que se pueda escribir una fecha entera en cualquier campo de fecha: las
  // pantallas que repintan en `change` cortaban el año (ver ui/campos-fecha).
  if (typeof window !== 'undefined') instalarCamposFecha(window);
  // El límite se lee en cada comprobación, no se captura: mientras el modal de
  // datos siga siendo legacy, es `State` quien tiene la copia recién escrita y
  // la del store se queda atrás hasta la siguiente recarga. Puente temporal,
  // como `refrescarLegacy` (se retira al portar el modal de datos, tarea 1.7).
  const biometria = crearBiometria();
  const sesion = createSessionService({
    autoLogoutMinutos: () => {
      const legacy = (globalThis as { State?: { get?: (k: string) => { autoLogoutMinutos?: number } | undefined } }).State?.get?.('config');
      return Number(legacy?.autoLogoutMinutos ?? store.get('config').autoLogoutMinutos ?? 0);
    },
    // «No pedir nada en los próximos X minutos» tras desbloquear (con huella o
    // tecleando la clave): mientras dure la gracia, un cierre por inactividad
    // no se aplica. Ver `auth/biometria`.
    graciaActiva: () => biometria.dentroDeGracia(),
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
  const proyectosModal = createProyectosModal({ proyectos: proyectosAPI });

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
  /**
   * «Crear informe». Usa el motor legacy (FinanceMath) para la previsión, que
   * es el que pinta el cuadro de mando: así el informe y la pantalla dan las
   * mismas cifras futuras.
   */
  function abrirInforme(): void {
    const g = globalThis as {
      FinanceMath?: {
        generarExtracto: (...a: unknown[]) => import('./engine/types').CashEvent[];
        saldoEnFecha: (acc: unknown, fecha: string) => number;
        fechaUltimoSaldoConocido: (cuentas: unknown[], fecha: string) => string | null;
      };
    };
    const fm = g.FinanceMath;
    if (!fm) {
      console.error('[informe] FinanceMath no está cargado');
      return;
    }
    const hoy = todayISO();
    const config = store.get('config');
    const cuentas = store.get('accounts').filter((a) => a.activo);
    const gastos = store.get('expenses');
    const loans = store.get('loans');
    const nominas = store.get('nominas');
    // Igual que el cuadro de mando: con «Contar imprevistos» activo, la
    // reserva va dentro del extracto y baja el saldo previsto.
    const contarImprevistos = config.contarImprevistos !== false;
    let reservaImprevistos: mes.ReservaParaProyeccion | null = null;
    const extractoCon =
      (reserva: mes.ReservaParaProyeccion | null, corregir = false) =>
      (desde: string, hasta: string, fechaReferencia = hoy) =>
        fm.generarExtracto(
          loans,
          gastos,
          store.get('accounts'),
          {
            ...config,
            dashboardStart: desde,
            dashboardEnd: hasta,
            fechaReferencia,
            // El informe ya compara contra el saldo real a su manera: su extracto
            // es la previsión sin corregir. El cuadro de mando, abajo, como esté.
            corregirConSaldoReal: corregir,
            ...(reserva ? { reservaImprevistos: reserva } : {}),
          },
          null,
          nominas,
          store.get('inflacion'),
        );
    const sinReserva = extractoCon(null);
    const fuente = { generarExtracto: sinReserva, gastos, prestamos: loans, movimientos: store.get('transacciones'), hoy };
    let imprevistos = null;
    try {
      const mesHoy = hoy.slice(0, 7);
      const delMes = sinReserva(`${mesHoy}-01`, mes.finDeMes(mesHoy));
      imprevistos = mes.mesEnCurso(fuente, delMes).estimacion;
      if (contarImprevistos) reservaImprevistos = mes.reservaParaProyeccion(fuente, delMes);
    } catch (e) {
      console.error('[informe] Sin estimación de imprevistos:', e);
    }
    const generarExtracto = extractoCon(reservaImprevistos);
    const proyecto = proyectosAPI.activo().nombre;
    abrirCrearInforme({
      hoy,
      proyecto,
      construir: (desde, hasta) =>
        informeHtml(
          construirInforme({
            desde,
            hasta,
            hoy,
            proyecto,
            cuentas,
            gastos,
            prestamos: loans,
            generarExtracto,
            saldoEnFecha: (c, fecha) => fm.saldoEnFecha(c, fecha),
            ultimoSaldoConocido: (c, fecha) => fm.fechaUltimoSaldoConocido([c], fecha) ?? '',
            imprevistos,
            contarImprevistos,
            cuadroDeMando: (() => {
              // Lo mismo que pinta el cuadro de mando para este periodo.
              try {
                const ext = extractoCon(reservaImprevistos, config.corregirConSaldoReal === true)(desde, hasta, hoy);
                if (ext.length === 0) return null;
                const saldoFinal = Number(ext[ext.length - 1]?.saldoAcum ?? NaN);
                return Number.isFinite(saldoFinal) ? { saldoFinal } : null;
              } catch {
                return null;
              }
            })(),
          }),
        ),
    });
  }

  const personasModal = createPersonasModal({ store, onDatosCambiados: refrescarLegacy });

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
      tags,
      precision,
      adjuster,
      onDatosCambiados: refrescarLegacy,
    }),
  );
  // Planificación:
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
      dashboard,
      mes,
    },
    store,
    flags,
    featureRegistry: { all: FEATURES, porGrupo: featuresPorGrupo },
    ui: {
      tarjetaMes,
      abrirHistoricoMeses,
      abrirCrearInforme: () => abrirInforme(),
      openFeatures: featuresModal.open,
      openProyectos: proyectosModal.open,
      openPersonas: personasModal.open,
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
    biometria,
    cambios,
    datos: {
      colecciones: COLECCIONES,
      // La copia declara con qué esquema se hizo, para que quien la restaure
      // sepa qué migraciones le faltan.
      snapshot: () => ({ ...(snapshotParaCopia(almacen) as Record<string, unknown>), [CLAVE_VERSION_COPIA]: SCHEMA_VERSION }),
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
        // Una copia antigua tiene que pasar por las migraciones que le falten:
        // se escriben también las colecciones retiradas que traiga (las leen
        // las migraciones) y se deja la versión de la COPIA, no la actual.
        for (const k of LEGACY_KEYS) {
          if (copia[k] !== undefined && copia[k] !== null) escribir(`${KEY_PREFIX}${k}`, copia[k]);
        }
        if (escritas.length > 0) escribir(VERSION_KEY, inferirVersionDeCopia(copia, SCHEMA_VERSION));
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
      esVacioOPorDefecto: () => esEstadoVacioOPorDefecto(snapshotParaCopia(almacen)),
      recargar: () => {
        store.load();
        cambios.marcar('recarga-externa');
      },
    },
    proyectos: proyectosAPI,
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
          // Por el camino que sabe resolver un conflicto con otro dispositivo
          // (pregunta en vez de pisar). El directo solo queda como reserva.
          const auth = (globalThis as { AuthModule?: { guardarEnNube?: () => Promise<string> } }).AuthModule;
          if (auth?.guardarEnNube) await auth.guardarEnNube();
          else await s.uploadBackup();
        },
      });
      // Proyecto activo, siempre visible en el sidebar — sin esto no hay forma
      // de saber, de un vistazo, en cuál de varios proyectos se está.
      const badgeProyecto = document.getElementById('sidebar-proyecto-activo');
      const nombreProyecto = document.getElementById('sidebar-proyecto-activo-nombre');
      if (badgeProyecto && nombreProyecto) {
        nombreProyecto.textContent = app.proyectos.activo().nombre;
        badgeProyecto.classList.remove('hidden');
        badgeProyecto.addEventListener('click', () => app.ui.openProyectos());
      }
      document.getElementById('btn-proyectos')?.addEventListener('click', () => app.ui.openProyectos());
      // Aviso, una sola vez, de lo que la migración 011 ha sacado de la
      // proyección: el usuario tiene que saber que hay elementos desactivados.
      const archivo = app.store.get('config').archivoMigracion011;
      if (archivo && !archivo.avisado && archivo.desactivados + archivo.amortizaciones.length > 0) {
        const n = archivo.desactivados + archivo.amortizaciones.length;
        const ui = (globalThis as { UI?: { toast?: (m: string, t?: string) => void } }).UI;
        setTimeout(
          () =>
            ui?.toast?.(
              `Se han desactivado ${n} elemento${n === 1 ? '' : 's'} que venía${n === 1 ? '' : 'n'} de un supuesto. Búscalos con la etiqueta «supuesto-archivado».`,
              'warn',
            ),
          1500,
        );
        app.store.patchConfig({ archivoMigracion011: { ...archivo, avisado: true } });
      }
      document.getElementById('btn-personas')?.addEventListener('click', () => app.ui.openPersonas());
      document.getElementById('btn-informe')?.addEventListener('click', () => app.ui.abrirCrearInforme());
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

  // ── Almacenamiento lleno ────────────────────────────────────────────────────
  // Aviso fijo, no un toast que se va: mientras esté, lo que se cambie no se
  // está guardando.
  window.addEventListener(EVENTO_SIN_ESPACIO, () => {
    if (document.getElementById('aviso-sin-espacio')) return;
    const host = document.querySelector('.view-container');
    if (!host?.parentElement) return;
    const div = document.createElement('div');
    div.id = 'aviso-sin-espacio';
    div.setAttribute('role', 'alert');
    div.className = 'card';
    div.style.cssText =
      'border:1px solid var(--red);background:rgba(255,77,109,0.09);padding:10px 16px;margin:10px 20px 0;font-size:13px;display:flex;gap:12px;align-items:center;flex-wrap:wrap';
    const texto = document.createElement('span');
    texto.style.flex = '1';
    texto.textContent =
      'No se ha podido guardar: el almacenamiento de este navegador está lleno o bloqueado. Los últimos cambios pueden perderse al recargar. Exporta una copia ahora.';
    const boton = document.createElement('button');
    boton.className = 'btn-primary btn-sm';
    boton.textContent = 'Exportar copia';
    boton.addEventListener('click', () => (globalThis as { DataIO?: { exportJSON?: () => void } }).DataIO?.exportJSON?.());
    div.append(texto, boton);
    host.parentElement.insertBefore(div, host);
  });

  // ── Otra pestaña ha cambiado los datos ───────────────────────────────────────
  // Cada pestaña guarda colecciones enteras desde su copia en memoria: sin
  // releer, la más antigua pisaba lo que acababa de guardar la otra (BUG-20).
  // `storage` solo se dispara en las DEMÁS pestañas, nunca en la que escribe.
  let relectura: ReturnType<typeof setTimeout> | null = null;
  const prefijoEstado = `${namespaceDeProyecto(app.proyectos.activo()._id)}${KEY_PREFIX}`;
  window.addEventListener('storage', (e) => {
    if (!e.key || !e.key.startsWith(prefijoEstado) || e.key.endsWith('_modificadoEn') || e.key.endsWith('_schemaVersion')) return;
    if (relectura) clearTimeout(relectura);
    relectura = setTimeout(() => {
      relectura = null;
      app.store.load();
      // Con un formulario abierto no se repinta debajo: guardará sobre el
      // estado ya releído, que es lo que importa.
      const modalAbierto = document.getElementById('modal-overlay')?.classList.contains('hidden') === false;
      if (!modalAbierto) (globalThis as { Router?: { rerender?: () => void } }).Router?.rerender?.();
    }, 150);
  });
}

export { bootstrap };
