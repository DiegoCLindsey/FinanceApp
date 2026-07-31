# 02 — Plan maestro de refactorización y evolución

Plan por fases y tareas. Cada tarea tiene checkbox de progreso, ficheros afectados y
criterios de aceptación (CA). Las fases son secuenciales salvo indicación; dentro de una
fase, las tareas marcadas ∥ son paralelizables.

**Principios transversales**

- **Precisión primero**: ningún cambio puede alterar un resultado numérico sin test que
  lo documente. Los tests de caracterización (F0) son el contrato.
- **SOLID**: una responsabilidad por módulo; el motor de proyección se abre por
  extensión (nuevos *event providers*) sin modificar el pipeline; las vistas dependen de
  interfaces (servicios), no de implementaciones.
- **La app sigue funcionando al final de cada fase** (no hay "big bang").
- Dinero en **céntimos enteros** en el dominio nuevo; formateo solo en presentación.
- Fechas siempre `YYYY-MM-DD` generadas con helper local (nunca `toISOString` sobre
  fechas locales).

---

## Fase 0 — Estabilización de infraestructura (EN CURSO)

> Objetivo: poder testear el código actual tal cual, sin refactorizar todavía.

- [x] **0.1 Reparar vitest** — `vitest.config.ts` apuntaba a `src/v2` (borrado).
      Ahora incluye `tests/**/*.test.{ts,js}` sin thresholds hasta F3.
- [x] **0.2 Export dual del núcleo** — `finance-math/finance-math.js` publica
      `FinanceMath` en `globalThis`, sin afectar al navegador (script clásico).
      CA: la app sigue cargando como script global; `import` + `globalThis.FinanceMath`
      funciona en los tests bajo Node.
- [x] **0.3 Tests de caracterización del núcleo** — `tests/finance-math.test.js`:
      préstamos (cuota, TAE, tabla, amortizaciones parciales), día efectivo, IRPF y base
      imponible, ganancias de capital, inflación, proyección de gastos, saldos con ancla,
      salud financiera, prestación por desempleo, extracto de integración.
      CA: `npm test` verde; cubren las ramas principales de cada función pura.
- [x] **0.4 Actualizar scripts npm y eslint** a las rutas reales del repo.
- [x] **0.5 CI** — GitHub Action (`.github/workflows/test.yml`) que ejecuta lint + tests en cada PR.

## Incidencias de producción resueltas

> Reportadas por el usuario sobre el despliegue real. Se documentan porque las
> tres tienen trampas que conviene no repetir.

- [x] **P.1 El store nuevo no veía los datos del usuario** — `createLocalStorageAdapter`
      leía y escribía `state_<colección>`, pero el `StorageAdapter` legacy
      (`common/storage.js`) antepone `financeapp_` a **todo**. Resultado: el store
      del paquete nuevo arrancaba con el estado por defecto y sus escrituras iban
      a un juego de claves paralelo invisible para la app legacy y para la
      exportación. Las vistas ya portadas (Márgenes, Inflación, Contabilidad)
      aparecían vacías.
      **Regla:** la clave lógica sigue siendo `state_<colección>` (así la nombra
      el store); el **espacio de nombres físico** `financeapp_` lo pone el adapter
      de localStorage y solo él. Todo test que toque localStorage directamente
      debe usar `NAMESPACE` de `src/state/storage/local.ts`.
      `adoptarClavesHuerfanas()` recupera lo que escribieron las compilaciones con
      el bug (manda el dato canónico; las huérfanas se borran siempre → idempotente).
      Se ejecuta una vez en `bootstrap()`; puede retirarse cuando haya pasado
      tiempo suficiente desde el 2026-07-30.
- [x] **P.2 "Ejecuta npm run build para habilitar esta ventana"** — el botón de
      Funcionalidades llevaba un `alert` de desarrollador en un `onclick` inline.
      Ahora lo cablea `router.js` y, si `window.FinanceApp` no está, abre un modal
      que explica qué ha pasado y ofrece recargar sin caché.
      Dos causas posibles se han cerrado de raíz:
      · `bootstrap()` va en `try/catch` y deja el motivo en `window.FinanceAppError`
        en vez de dejar el namespace sin definir y sin pista alguna;
      · el despliegue publica `index.html` con `?v=<sha>` en la etiqueta del bundle,
        porque la CDN cachea `index.html` y `assets/financeapp-core.js` por separado
        y un index nuevo podía quedar emparejado con un bundle viejo o con un 404.
      **Aviso para quien depure el bundle en local:** contiene identificadores no
      ASCII (`año`). Si se carga desde una página **sin `<meta charset>`**, el
      navegador lo decodifica como latin-1 y falla con `SyntaxError: missing )
      after argument list`. `index.html` declara UTF-8, así que en la app real no
      ocurre; en páginas de prueba hay que declararlo.
- [x] **P.3 Cada recarga volvía a pedir método de acceso y contraseña** —
      `src/auth/session.ts` guarda un registro de sesión (`financeapp_session`) y
      `AuthModule._reanudar()` la reanuda **antes** de mostrar nada, comprobando
      que el acceso sigue siendo válido:
      · Firebase → `restoreSession()` espera a `onAuthStateChanged`, fuerza un
        refresco del ID token contra el servidor y revalida la lista blanca;
      · Dropbox → `restore()` descifra el token guardado y lo verifica contra la
        API (los tokens de acceso caducan a las 4 h);
      · local → arranca directamente.
      Si la validación falla se cierra la sesión y se pide acceso otra vez. La
      sesión **no caduca sola** salvo que se configure `config.autoLogoutMinutos`
      (0 = nunca, por defecto), que la UI ofrece en Administrar datos → Sesión
      junto al cierre manual. Mientras la pestaña está abierta,
      `vigilarInactividad()` aplica el límite sin esperar a la recarga.
      **Compromiso conocido:** reanudar sin preguntar exige guardar la clave de
      cifrado en localStorage. No añade exposición local (el estado completo ya
      está ahí en claro); lo que protege es la copia en la nube frente al
      proveedor. Para equipos compartidos, `autoLogoutMinutos` acota la ventana.
      Si el bundle no carga, `auth.js` usa un stub inerte y se comporta como antes.

## Fase 1 — Refactor SOLID + modularización (TypeScript, ESM)

> Objetivo: migrar a `src/` con módulos ES tipados y build de Vite, manteniendo paridad
> funcional verificada por los tests de F0. Migración módulo a módulo, no big bang: se
> crea el paquete nuevo y las vistas viejas se van moviendo encima.

Estructura objetivo:

```
src/
├── core/            # dominio puro, sin DOM ni State global
│   ├── money.ts     # céntimos, redondeo, formato EUR
│   ├── dates.ts     # fechas locales, iteradores de meses, día efectivo
│   ├── loan.ts      # cuota, TAE, tabla amortización
│   ├── tax/         # irpf.ts, ahorro.ts, pension.ts, paro.ts
│   ├── inflation.ts
│   └── health.ts    # salud financiera
├── engine/          # motor de proyección
│   ├── types.ts     # CashEvent, EventProvider (interfaz)
│   ├── providers/   # expenses, loans, transfers, salaries, interests,
│   │                # contributions, inflation  (1 provider = 1 fichero)
│   ├── statement.ts # generarExtracto + ancla bidireccional
│   ├── montecarlo.ts
│   └── optimizer.ts # amortizaciones (con memoización de extracto)
├── state/           # store tipado
│   ├── schema.ts    # tipos de todas las colecciones + versión
│   ├── migrations/  # una migración = un fichero numerado
│   ├── store.ts     # get/set/subscribe (event bus para re-render selectivo)
│   └── storage/     # adapters: local, firebase, dropbox
├── features/        # una carpeta por vista; cada una exporta un FeatureManifest
├── flags/           # registro de feature flags (F2)
└── app/             # shell, router, period bar, bootstrap
```

- [x] **1.1 Bootstrap del paquete** — COMPLETADA. `src/main.ts` arranca el store
      (con migraciones) y los flags, y publica `window.FinanceApp` (core, engine con
      sus providers, análisis, márgenes, optimizador, store y flags). `vite.config.ts`
      compila `src/` a un único script clásico `assets/financeapp-core.js`
      (47 kB / 17 kB gzip, gitignored), que `index.html` carga ANTES de los scripts
      legacy — estrategia *strangler fig*: la app legacy sigue funcionando y puede ir
      consumiendo lo nuevo módulo a módulo.
      OJO al retocar vite.config: el nombre del global del bundle es
      `FinanceAppBundle`, no `FinanceApp`, porque el wrapper IIFE asigna
      `window[name] = exports` DESPUÉS de ejecutar el módulo y sobrescribiría el
      namespace.
      CA verificado en Chromium headless sobre la app real: migración v5 aplicada
      sobre localStorage, cuenta principal resuelta, flags leídos/escritos y
      persistidos, extracto generado, y `index.html` carga sin errores de consola.
- [x] **1.1b Reparar el pipeline** — `npm run build` fallaba desde el PR #75
      (buscaba `src/v2/index.html`), lo que **abortaba el deploy a GitHub Pages**;
      `ci.yml` estaba rojo por `format:check` y su fallo bloqueaba el job de tests.
      Arreglado: build reapuntado, prettier aplicado a `src/` y `tests/` con
      `.prettierrc.json`, `deploy.yml` reescrito (ya no hay `/v2/`; publica el
      bundle y falla explícitamente si no se generó), `deploy-preview.yml` compila
      el core y excluye `node_modules`/`src`/`tests` del publicado, y se retira el
      `test.yml` que yo había añadido (duplicaba `ci.yml`). También se elimina
      `.env.production` (VITE_BASE_URL del build antiguo).
- [x] **1.2 `core/dates` + `core/money`** — `src/core/dates.ts` (formatLocalDate
      corrige el bug de `toISOString`, parseLocalDate, clampedDate, día efectivo) y
      `src/core/money.ts` (céntimos, roundMoney, formatEUR). Política de precisión
      documentada en money.ts: cálculo interno en float por paridad con legacy;
      céntimos en bordes (persistencia/presentación).
- [x] **1.3 Portar `core/` fiscal y préstamos** — COMPLETADA. Portados con paridad
      exacta verificada (`tests/core/parity.test.ts`, igualdad estricta): loan.ts
      (cuota, TAE, tabla, resumen con caché), tax/irpf.ts, tax/ahorro.ts,
      inflation.ts, health.ts, accounts.ts (saldoRealCuenta/saldoEnFecha) y
      tax/pension.ts (calcFondosPension con 'hoy' inyectable, calcImpuestoPension,
      calcTipoMarginalPension, calcFondoInversion con tramos explícitos).
      Cerrado con `core/tax/tables.ts`: `resolverTablaAnual` /
      `crearResolverTramos` sustituyen a tramosIRPFParaAño y
      tramosGananciasParaAño como funciones puras (el histórico y el default
      entran por parámetro), con paridad verificada; el store los cablea a sus
      datos. `calcTipoMarginalGrupo` no se porta: solo lo usaba la vista de
      nóminas, que lo recalcula inline; se resolverá al portar la vista (1.7).
      CA cumplido: paridad exacta (tolerancia 0).
- [x] **1.4 Motor de proyección como providers** — COMPLETADA. Contratos en
      `src/engine/types.ts` (CashEvent, DateRange, EventProvider) y primer provider
      portado con paridad exacta: `providers/expenses.ts` (proyectarGastos +
      cuantiaEfectiva), loans, interests (verificado vía generarExtracto: la
      función legacy es interna), contributions y withholdings (retenciones, con
      tramos explícitos), salaries (nóminas: grupos IRPF, IPC, flex, con resolver
      de tramos inyectado) e inflation-events (coste de vida + erosión del ahorro).
      Hecho también: transfers.ts (traspasos, retención de reembolsos, IRPF de
      rescates; deps inyectadas) y `statement.ts` (generarExtracto con ancla
      bidireccional, recomputarSaldoAcum, saldoHoy, sumarPorTags) — paridad del
      extracto COMPLETO verificada en tests/core/engine-statement.test.ts con
      mock de State para el legacy. Cerrado también el análisis: `margins.ts`
      (calcGastoBasicoMensual con 'hoy' inyectable, calcColchon, calcColchonEnFecha,
      calcMargenEnFecha, saldosPorCuentaEnExtracto, detectarCrucesMargenes) y
      `analysis.ts` (detectarPuntosCriticos, mediaMensualGastos, calcDesviacion).
      El optimizador va en 1.5. CA cumplido: extracto y análisis idénticos al
      actual, verificado con igualdad estricta.
- [x] **1.5 Optimización de cálculo** — `engine/optimizer.ts` portado con paridad
      exacta (optimizarAmortizaciones y compararFrecuencias, incluidas todas las
      variantes: frecuencias, tipo plazo/cuota, loanIds, cuenta origen, filtro de
      márgenes, fechaPrimeraAmort). Mejora medida: **~1,8× más rápido** en el
      comparador (5 frecuencias, horizonte 36m).
      CORRECCIÓN (2026-07-30): al sustituir el test de tiempos por uno
      determinista se comprobó que la mejora viene **enteramente** de que
      `capPendienteAntes` use la caché de `resumenPrestamo` en vez de recalcular
      la tabla en cada préstamo×mes. `createStatementMemo` **no produce ni un
      acierto** en los flujos actuales (ni dentro de una corrida ni entre
      frecuencias, porque sus fechas de amortización no coinciden); se mantiene
      por ser barato, proteger de llamadas repetidas idénticas desde la UI y ser
      la base de 6.3. Hay un test que fija este hecho para que la documentación
      no vuelva a desviarse.
      Nota: el test de wall-clock se retiró por inestable (fallaba ~1 de cada 4
      ejecuciones en CI compartida). `aplicarInflacion` ya no existe (1.8).
- [x] **1.6 Store tipado + migraciones versionadas** — COMPLETADA.
      `state/schema.ts` (AppState tipado completo + defaults + SCHEMA_VERSION=5),
      `state/migrations/` (cadena numerada; la 005 normaliza cualquier estado
      previo: escenarioId→escenarioIds, diaPago legado, esFondoPension→modeloFondo,
      cuentaId→cuentaIds, limpieza de los campos de las features retiradas en 1.8,
      y `config.features` para F2), `state/store.ts` (get/set tipados, patchConfig,
      subscribe por clave para re-render selectivo, CRUD, snapshot/replaceAll,
      resolvers de tramos) y `state/storage/` (adapter localStorage con las MISMAS
      claves que el legacy + adapter en memoria para tests).
      CA cumplido: un backup v4 realista (con campos legados, arrays nulos y
      basura) migra a estado válido; migración idempotente; sin excepciones ante
      datos corruptos. NOTA: la clave `state_history` no se destruye — la
      migración de Contabilidad (4.1) importará esos puntos al ledger.
- [~] **1.7 Portar vistas a `features/`** — EN CURSO. Infraestructura lista y
      validada con la primera vista real (Contabilidad, tarea 4.3):
      `src/app/feature-registry.ts` + manifests `{ id, route, nombre, flagId,
      seccion, iconoPath, mount, unmount? }`, con el router legacy delegando en el
      registro. Pendiente: portar las 9 vistas legacy (dashboard, expenses, loans,
      accounts+goals, nominas, inflacion, escenarios→supuestos, rentas, margenes),
      ∥ entre ellas. **Portadas hasta ahora (3/9): `margenes` →
      `src/features/margins`, `inflacion` → `src/features/inflation` y
      `expenses` → `src/features/expenses`.** En cada
      una se retira su fichero legacy y su entrada del router; el botón y el
      contenedor que ya existían en index.html se reutilizan, así que la
      navegación no cambia para el usuario.
      En inflación, la descarga del IPC se aisló en `ipc-source.ts` con `fetch`
      inyectable, de modo que el parseo de la respuesta del Banco Mundial y el
      manejo de fallos se testean sin red. OJO: la API real
      (api.worldbank.org) NO es alcanzable desde el contenedor de desarrollo,
      así que el camino de éxito solo está verificado con la respuesta real
      simulada; el de fallo sí se comprobó en navegador.
      Al portar cada una se retiran sus puentes temporales (el de
      `historicoSaldos` del ledger con la de cuentas, y el `State.load()` que la
      vista de contabilidad hace para que el dashboard legacy vea los datos
      nuevos). CA: paridad funcional razonable; sin `onclick=` global inline
      (delegación de eventos, como en features/accounting).
      Al portar gastos salió el widget de "día efectivo", ahora en
      `src/features/shared/dia-pago.ts` y reutilizable por préstamos y nóminas.
      **TRAMPA DEL ENTORNO DE TESTS:** happy-dom (v15 y v20) ignora el atributo
      `selected` al parsear `innerHTML` — el `selectedIndex` de un `<select>`
      creado así se queda en 1 (o −1), marque lo que marque el HTML. Los
      navegadores reales sí lo respetan (verificado en Chromium). Para probar un
      `<select>`: comprobar `option[selected]` en el HTML para la dirección
      "pintar", y fijar `.value` a mano para la dirección "leer". Si un test de
      `<select>` pasa por casualidad, probablemente esté comprobando la opción 1.
- [x] **1.8 Retirar código muerto y features aprobadas** — hecho por adelantado en F0+
      (2026-07-30): calendar, HistoryModule + colección `history`,
      `proyectarInversiones`, inflación legacy, Monte Carlo + varianzas, velas OHLC,
      simulador de paro. Ver registro en `03-informe-redundancias.md`.
- [ ] **1.9 Consolidaciones aprobadas** — (a) colchón → margen de seguridad
      predefinido (migrar `colchonMeses/colchonFijo/colchonPuntos` a un margen
      "Colchón" y retirar la config duplicada; goals y puntos críticos pasan a leer
      del margen); (b) unificar `tagCategorias` + `tagGrupos` en un único concepto
      "grupo de tags" con opción "mostrar como categoría". CA: migración automática
      de datos existentes + tests.

## Fase 2 — Feature flags con configuración por usuario

> Objetivo: activar/desactivar funcionalidades desde la propia interfaz, con
> configuración salvable/cargable por usuario.

- [x] **2.1 Registro de flags** — COMPLETADA. `src/flags/registry.ts` con 22
      features declaradas en 5 grupos (Esenciales, Mi dinero, Planificación,
      Análisis del dashboard, Datos), cada una con `{ id, nombre, descripcion,
      grupo, porDefecto, dependencias[], nucleo? }`. El dashboard es `nucleo`
      (no desactivable). Lo de nicho arranca apagado (inflación, fiscalidad,
      márgenes, optimizador, comparador, autoguardado). Tests de integridad del
      catálogo: ids únicos, dependencias existentes, grafo sin ciclos, cobertura
      de grupos. Nota: Monte Carlo, OHLC y el simulador de paro fueron eliminados
      (2026-07-30), no necesitan flag.
- [x] **2.2 Estado y persistencia** — COMPLETADA. `src/flags/service.ts` sobre
      `config.features` del store, así que la configuración viaja con los datos del
      usuario (localStorage, backups en la nube y export/import JSON) sin trabajo
      extra. Integridad de dependencias en ambos sentidos: activar arrastra
      dependencias transitivas, desactivar apaga en cascada, e `isEnabled`
      revalida en lectura para que un perfil inconsistente no deje una feature
      encendida sin lo que necesita (`bloqueadaPor` lo reporta a la UI).
      Perfiles exportables (`exportProfile`/`importProfile`) que ignoran ids
      desconocidos y completan ausentes con su defecto.
      CA cumplido: roundtrip export→import conserva los flags (test).
- [x] **2.3 Ventana de configuración** — COMPLETADA. `src/ui/features-modal.ts`:
      modal "Funcionalidades" abierto desde el botón del sidebar, con toggles
      agrupados por sección, descripción de cada feature, aviso "Requiere: X"
      cuando una dependencia está apagada, y botones guardar/cargar perfil y
      restablecer. Reutiliza el modal legacy (#modal-overlay) si existe y crea el
      suyo si no, y usa las clases del design system (sin CSS nuevo). El HTML se
      escapa. Verificado en Chromium real y con tests happy-dom.
      CA parcial: el sidebar y la vista activa reaccionan al instante (ver 2.4);
      el gating de las tarjetas del dashboard queda pendiente de portar esa vista
      (1.7) — hoy el dashboard se regenera entero en cada render legacy.
- [~] **2.4 Gating transversal** — PARCIAL (mejorado). El gating ya consulta el
      registro de vistas nuevas (`rutasExtra`), así que una vista del paquete nuevo
      se oculta del sidebar y deja de montarse con solo declarar su flag en el
      manifest — sin tocar el módulo de gating. `src/ui/gating.ts` oculta las entradas
      del sidebar de las features desactivadas (y la sección entera si se queda sin
      vistas visibles), y redirige al dashboard si se desactiva la vista abierta. Se
      aplica al cargar, tras cada navegación y tras cada cambio en la ventana de
      funcionalidades. Mapa `VISTA_POR_FEATURE` con test que verifica que solo
      referencia ids del catálogo.
      Pendiente: (a) gating de las secciones del dashboard y (b) de los providers
      del motor — ambos requieren que el dashboard y el statement se consuman desde
      el paquete nuevo, es decir la tarea 1.7. Al portar cada vista, su manifest
      declarará su flag y este módulo pasará a leer el registro de vistas en vez
      del DOM.

## Fase 3 — QA: cobertura de tests completa

> Objetivo: tests unitarios a nivel de línea y rama del núcleo, y de flujo completo de
> cada feature, antes de construir los módulos nuevos encima.

- [ ] **3.1 Unit tests `core/`** — objetivo cobertura: líneas ≥ 95 %, ramas ≥ 90 %.
      Casos límite documentados: tipo 0 %, meses 1, amortización > capital pendiente,
      años bisiestos, `dia:31` en febrero, tramos vacíos, inflación negativa…
- [ ] **3.2 Unit tests `engine/`** — cada provider aislado con fixtures; statement con
      golden files (extractos completos serializados y versionados en `tests/fixtures/`).
- [ ] **3.3 Tests de flujo por feature** (happy-dom): crear gasto → aparece en extracto
      y dashboard; crear préstamo + amortización → ahorro correcto; activar escenario →
      filtrado; onboarding completo; export→wipe→import = estado idéntico.
- [ ] **3.4 Property-based tests** (fast-check) para invariantes: la tabla de
      amortización siempre liquida el capital; IRPF monótono no decreciente con la base;
      extracto = suma de deltas.
- [ ] **3.5 Thresholds en CI** — activar en `vitest.config.ts`: core 95/90, global 85/75.
      Retirar `tests/nomina.test.cjs` (sustituido).

## Fase 4 — Módulo de contabilidad real

> Objetivo: registrar gastos/ingresos **reales** por cuenta, conviviendo con las
> estimaciones y compartiendo el mismo sistema de tags. El histórico pasa a pertenecer a
> contabilidad y es el *source of truth* del pasado.

- [x] **4.1 Modelo de datos** — COMPLETADA. `state/schema.ts` v6 con `transacciones`
      (importes en **céntimos enteros con signo**, para que sumar miles de
      movimientos no arrastre error) y `puntosControl`. Migración
      `006-accounting.ts` que importa los `historicoSaldos` de cada cuenta y la
      clave huérfana `state_history` (preservada a propósito en la v5), ignorando
      entradas con fecha o importe inválidos y sin duplicar al re-migrar.
      BUG ENCONTRADO Y CORREGIDO: la migración 005 construía el estado desde cero
      y descartaba las colecciones que no conocía, de modo que importar un backup
      v6 declarándolo como v4 **borraba la contabilidad del usuario**. Ahora parte
      de `{...raw}` y solo sobrescribe lo que normaliza; hay test de regresión.
      Diseño original de la tarea, ya cumplido: nueva colección `transacciones`:
      `{ _id, fecha, cuentaId, importeCts (con signo), concepto, tags[],
      estimacionId?, tipo: 'gasto'|'ingreso'|'ajuste', origen: 'manual'|'importado' }`
      y `puntosControl` (los `historicoSaldos` actuales migran aquí).
- [x] **4.2 TagService compartido** — COMPLETADA. `accounting/tags.ts`: los tags se
      derivan del uso (sin registro aparte) y `uso()` los agrega de estimaciones y
      transacciones en el mismo espacio de nombres; `renombrar`/`fusionar`/`eliminar`
      actúan sobre gastos, transacciones, préstamos, nóminas Y las agrupaciones de
      config (tagCategorias, tagGrupos, activeTagsFilter), deduplicando (renombrar
      sobre un tag existente = fusionar). `soloEn()` detecta descuadres entre lo
      estimado y lo real. CA verificado en test y en navegador.
- [x] **4.3 Vista Contabilidad** — COMPLETADA, escrita en el paquete nuevo
      (decisión del usuario, 2026-07-30). `src/features/accounting/`:
      · `index.ts` exporta el **manifest** de la vista (id, ruta, flag, sección del
        sidebar, icono, mount) — es la primera vista del sistema nuevo y el patrón
        a seguir al portar las demás en 1.7.
      · `transactions-panel.ts`: tabla de movimientos del periodo con filtros
        (cuenta, mes, texto), alta rápida con autocompletado de etiquetas, edición
        de importe, borrado, selector de estimación relacionada por fila, y panel de
        puntos de control de saldo real.
      · `precision-panel.ts`: tabla de precisión por estimación (con desglose de los
        últimos meses), tabla de precisión conjunta por etiqueta, botón
        "Sugerir ajuste → X €" por fila y "Ajustar automáticamente todas (N)", ambos
        con confirmación que lista los cambios.
      · `dom.ts`: helpers de presentación con escapado de HTML y delegación de
        eventos (sin `onclick=` inline).
      Infraestructura añadida: `src/app/feature-registry.ts` (registro de vistas con
      manifests, que crea el contenedor y el botón de sidebar, monta/desmonta y
      respeta los flags) y un hook de ~8 líneas en `router/router.js` para que el
      shell aloje vistas nuevas y legacy a la vez.
      Verificado con 18 tests happy-dom y end-to-end en Chromium sobre index.html.
      Diseño original: tabla mensual por cuenta: columnas de gasto/ingreso
      real, alta rápida, edición inline, filtros por tag/cuenta/periodo, asignación de
      cada transacción a una estimación relacionada (selector "este gasto tiene que ver
      con la estimación X / tag A").
- [~] **4.4 Histórico como source of truth** — PARCIAL (motor listo, cableado
      pendiente). `accounting/ledger.ts` deriva el saldo real de cualquier fecha como
      "último punto de control + transacciones posteriores", con la regla de que un
      punto de control posterior manda sobre las transacciones anteriores (si el banco
      dice otra cosa, el banco gana). Todo en céntimos: 1000 sumas de 0,01 € dan
      exactamente 10 € (test).
      PUENTE TEMPORAL: `registrarPuntoControl` replica en
      `accounts[].historicoSaldos`, que es lo que leen el motor y la vista legacy; se
      retira al portar la vista de cuentas (1.7).
      Pendiente: que `saldoEnFecha` del engine lea del ledger para el pasado y que la
      vista de desviación se alimente de aquí — ambos requieren 1.7.
- [x] **4.5 Análisis de precisión** — COMPLETADA. `accounting/precision.ts` con las
      decisiones de cálculo documentadas en el propio módulo: solo se comparan meses
      CERRADOS que tengan dato real (un mes sin datos es un hueco, no un 0 % de
      acierto, así una estimación nueva no aparece como fallida); el estimado de cada
      mes es lo que **proyecta el motor** (respeta frecuencias, día de pago y
      vigencia), no la cuantía nominal; la precisión agregada se pondera por importe
      estimado para que un mes marginal no domine. Relaciona por `estimacionId` y, si
      no hay ninguna asignada, por etiqueta compartida. `analizarPorTag` da la
      precisión conjunta por etiqueta. Diseño original:
      `precision = 100 − |real − estimado| / estimado × 100` sobre el periodo comparable
      (solo meses con datos reales). Vista "Precisión de estimaciones": fila por
      estimación con su(s) tag(s), estimado vs real mensual, % de precisión, y precisión
      conjunta por etiqueta.
- [x] **4.6 Sugerir ajuste** — COMPLETADA (lógica; el botón va con la vista, 4.3).
      `accounting/adjust.ts`: `sugerirAjuste` propone la media real de los últimos N
      meses comparables (N configurable, 3 por defecto) y devuelve `null` si no hay
      datos, si la precisión ya es buena (umbral 90 %) o si la variación es
      insignificante (<5 %), para no generar ruido. `aplicar` hace exactamente lo
      pedido: cierra la original con `fechaFin = hoy` y crea la copia con
      `fechaInicio = hoy`, heredando el `fechaFin` original si lo tenía y la cuantía
      ajustada, enlazadas por `ajustadaDesdeId` (+ `cadena()` para auditar el
      historial de ajustes). No sobrescribe: así los meses pasados se siguen
      proyectando con lo que se estimó entonces y la desviación histórica sigue
      siendo comparable. Diseño original:
      1) la estimación original recibe `fechaFin = hoy`;
      2) se crea una copia con `fechaInicio = hoy`, `fechaFin` = la original (si tenía)
      y la cuantía ajustada;
      3) ambas quedan enlazadas (`ajustadaDesdeId`) para trazabilidad.
      CA: test de flujo completo del ajuste, incluyendo estimaciones sin fechaFin.
- [x] **4.7 "Ajustar automáticamente todas"** — COMPLETADA (lógica).
      `aplicarTodas(sugerencias)` ajusta en bloque y devuelve `{aplicadas, errores}`
      para que la UI liste los cambios en la confirmación. El modal de confirmación
      va con la vista (4.3).
- [x] **4.8 Retirar `historialPrecios`** — COMPLETADA (aprobada 2026-07-30).
      Migración v7 (`007-price-history.ts`): cada entrada del historial pasa a ser
      una transacción real (`origen: 'importado'`, `estimacionId` = la estimación),
      y el campo desaparece del esquema. Retirados `_cuantiaEfectivaExp`
      (finance-math) y `cuantiaEfectiva` (engine/providers/expenses), y con ellos
      la UI de historial al portar la vista de gastos.
      **Cambio de comportamiento visible y buscado:** un gasto con historial se
      proyectaba con la media del último año en vez de con su cuantía; esa media
      era invisible y no se podía desactivar. Ahora se proyecta la cuantía
      configurada, y quien propone cambiarla es "sugerir ajuste" (4.6), que se
      apoya en esas mismas transacciones. Los tests de caracterización del motor
      que fijaban la media se reescribieron para fijar el comportamiento nuevo.

## Fase 5 — Supuestos (puntos de guardado con diffs; sustituyen a Escenarios)

> Objetivo: sistema de "what-if" basado en diffs sobre la información canónica, con
> biblioteca revisitable.

- [ ] **5.1 Motor de diffs** — formato por operación:
      `{ coleccion, op: 'add'|'update'|'remove', id, campos? {antes, despues} }`.
      Aplicación como **overlay**: el store expone la vista combinada
      (canónico + diff del supuesto activo) sin mutar el canónico. Reversible y
      serializable. CA: aplicar→revertir = identidad; property test.
- [ ] **5.2 Ciclo de vida** — `SupuestosService`: iniciar (todo cambio posterior se
      escribe en el overlay), pausar/reanudar, finalizar (guarda el diff en la
      biblioteca), descartar, y **aplicar al canónico** (promocionar los cambios).
- [ ] **5.3 Marcado visual** — mientras hay un supuesto activo: banner global
      persistente, y cada item modificado/añadido se marca (borde/badge de color del
      supuesto) en todas las vistas; panel "cambios de este supuesto" con lista de
      operaciones y navegación al item.
- [ ] **5.4 Biblioteca de supuestos** — vista que sustituye a Escenarios: lista de
      diffs guardados (nombre, color, descripción, fecha), revisitar (re-aplicar sobre
      el canónico **actual**, con resolución de conflictos: item borrado → operación se
      omite y se reporta), comparativa de saldo proyectado entre supuestos (paridad con
      la comparativa de escenarios actual).
- [ ] **5.5 Migración de escenarios** — cada escenario existente se convierte en un
      supuesto (items con `escenarioIds` → operaciones `add` del diff). Retirar
      `escenarioIds`, `filtrarPorEscenario` y la vista antigua. CA: backup v4/v5 con
      escenarios importa y produce supuestos equivalentes (mismo saldo proyectado).

## Fase 6 — Limpieza final y documentación

- [ ] **6.1 Ejecutar las eliminaciones aprobadas** en `03-informe-redundancias.md`.
- [ ] **6.2 README y docs de arquitectura actualizados**; guía de contribución con el
      flujo de tests.
- [ ] **6.3 Auditoría de rendimiento final** (dashboard < 100 ms re-render con 10 años
      de horizonte y 200 items). Incluye la oportunidad diferida de 1.5: sustituir los
      extractos anidados de `saldosAt()` por un único extracto truncado — cambia
      decimales del interés del último periodo, así que necesita golden test propio
      y nota de cambio de comportamiento.

---

## Decisiones de diseño ya tomadas

1. **Convivencia estimaciones/contabilidad**: son colecciones separadas que comparten
   tags y cuentas. El extracto pasado se construye desde contabilidad; el futuro, desde
   estimaciones. `fechaReferencia` es la frontera.
2. **Supuestos = diffs, no copias**: nunca se duplica el estado completo; un supuesto
   guardado se re-evalúa contra el canónico vigente al revisitarlo.
3. **Los tests de caracterización de F0 son el contrato de paridad** durante F1. Si un
   refactor cambia un número, o es un bug documentado (lista §5 del análisis) y se
   corrige el test explícitamente en ese commit, o el refactor está mal.
4. **Feature flags a nivel de manifest**, no de `if` dispersos: cada feature se registra
   (vista, providers, tarjetas de dashboard) y el gating es del registro.
