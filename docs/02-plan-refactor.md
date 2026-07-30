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

- [ ] **1.1 Bootstrap del paquete (re-alcance)** — el switch de `index.html` al bundle
      de Vite se pospone hasta que el core esté completo, para que la app estática siga
      funcionando sin build entretanto. `src/` + typecheck/lint/tests ya están cableados
      (hecho); queda: entry `src/main.ts`, publicación de módulos legacy en `globalThis`
      y build de Vite. CA: la app arranca con datos existentes de localStorage.
- [x] **1.2 `core/dates` + `core/money`** — `src/core/dates.ts` (formatLocalDate
      corrige el bug de `toISOString`, parseLocalDate, clampedDate, día efectivo) y
      `src/core/money.ts` (céntimos, roundMoney, formatEUR). Política de precisión
      documentada en money.ts: cálculo interno en float por paridad con legacy;
      céntimos en bordes (persistencia/presentación).
- [ ] **1.3 Portar `core/` fiscal y préstamos** ∥ — EN CURSO. Portados con paridad
      exacta verificada (`tests/core/parity.test.ts`, igualdad estricta): loan.ts
      (cuota, TAE, tabla, resumen con caché), tax/irpf.ts, tax/ahorro.ts,
      inflation.ts, health.ts, accounts.ts (saldoRealCuenta/saldoEnFecha) y
      tax/pension.ts (calcFondosPension con 'hoy' inyectable, calcImpuestoPension,
      calcTipoMarginalPension, calcFondoInversion con tramos explícitos).
      Pendiente: calcTipoMarginalGrupo y los resolvers de tablas por ejercicio
      (tramosIRPFParaAño/tramosGananciasParaAño) — están acoplados al State y se
      portarán con la capa state/ (tarea 1.6). CA: paridad exacta (tolerancia 0).
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
      comparador (5 frecuencias, horizonte 36m), por (a) `capPendienteAntes` usando
      la caché de `resumenPrestamo` en vez de recalcular la tabla en cada
      préstamo×mes — la ganancia principal — y (b) `createStatementMemo` compartido
      entre frecuencias. Documentado en el propio módulo dónde el memo NO ahorra
      (dentro de una corrida cada (fecha, plan) es único) y una oportunidad
      pendiente que no es paridad exacta (truncar un único extracto al horizonte
      cambia el prorrateo del interés del último periodo → requiere golden test,
      movida a 6.3). `aplicarInflacion` ya no existe (eliminada en 1.8).
- [ ] **1.6 Store tipado + migraciones versionadas** — `state/` sustituye a
      `common/state.js`; migración v4→v5 formaliza el esquema. CA: import de un backup
      JSON v4 real produce estado válido.
- [ ] **1.7 Portar vistas a `features/`** — una tarea por vista (dashboard, expenses,
      loans, accounts+goals, nominas, inflacion, escenarios, rentas, margenes), cada una
      con su manifest `{ id, nombre, flag, route?, render }`. ∥ entre vistas una vez
      exista el shell. CA: paridad visual/funcional razonable; sin `onclick=` global
      inline (delegación de eventos).
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

- [ ] **2.1 Registro de flags** — `flags/registry.ts`: cada feature declara
      `{ id, nombre, descripcion, grupo, porDefecto, dependencias[] }`. Granularidad
      inicial: cada vista + subfeatures de nicho (inflación, optimizador, márgenes,
      salud financiera, escenarios/supuestos, contabilidad). Nota: Monte Carlo, OHLC
      y el simulador de paro fueron eliminados (2026-07-30), no necesitan flag.
- [ ] **2.2 Estado y persistencia** — `config.features: Record<flagId, boolean>` viaja
      con el estado del usuario (localStorage + backups nube + export/import JSON).
      Además, **perfiles exportables**: guardar/cargar la configuración de flags como
      JSON independiente. CA: roundtrip export→import conserva flags.
- [ ] **2.3 Ventana de configuración** — modal "Funcionalidades" accesible desde el
      sidebar: toggles agrupados, descripción por feature, aviso de dependencias
      (desactivar Inflación desactiva las vistas que dependen de ella), botones
      guardar/cargar perfil. CA: desactivar una feature oculta su entrada del sidebar,
      sus tarjetas del dashboard y sus providers del motor **sin recargar**.
- [ ] **2.4 Gating transversal** — Router, sidebar, secciones del dashboard y registro
      de providers consultan `Flags.isEnabled(id)`. CA: con todas las flags off, la app
      queda en dashboard mínimo (saldo + extracto) sin errores de consola.

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

- [ ] **4.1 Modelo de datos** — nueva colección `transacciones`:
      `{ _id, fecha, cuentaId, importeCts (con signo), concepto, tags[],
      estimacionId?, tipo: 'gasto'|'ingreso'|'ajuste', origen: 'manual'|'importado' }`
      y `puntosControl` (los `historicoSaldos` actuales migran aquí). Migración v5→v6.
- [ ] **4.2 TagService compartido** — servicio único de tags (crear, renombrar, fusionar,
      autocompletar) usado por estimaciones y contabilidad indistintamente; los tags se
      derivan del uso (sin registro separado) pero renombrar/fusionar actúa sobre ambas
      colecciones. CA: crear un tag en contabilidad lo ofrece el autocompletado de gastos
      estimados y viceversa.
- [ ] **4.3 Vista Contabilidad** — tabla mensual por cuenta: columnas de gasto/ingreso
      real, alta rápida, edición inline, filtros por tag/cuenta/periodo, asignación de
      cada transacción a una estimación relacionada (selector "este gasto tiene que ver
      con la estimación X / tag A").
- [ ] **4.4 Histórico como source of truth** — el saldo real en fecha se deriva de
      puntos de control + transacciones (`saldoEnFecha` del engine pasa a leer de
      contabilidad para el pasado; las estimaciones solo proyectan futuro desde
      `fechaReferencia`). La vista de histórico/desviación del dashboard se alimenta de
      aquí. CA: golden tests del extracto pasado con ledger.
- [ ] **4.5 Análisis de precisión** — por estimación y agregado por tag:
      `precision = 100 − |real − estimado| / estimado × 100` sobre el periodo comparable
      (solo meses con datos reales). Vista "Precisión de estimaciones": fila por
      estimación con su(s) tag(s), estimado vs real mensual, % de precisión, y precisión
      conjunta por etiqueta.
- [ ] **4.6 Sugerir ajuste** — botón por fila: propone la cuantía ajustada (media real
      de los últimos N meses comparables, N configurable, por defecto 3). Al aceptar:
      1) la estimación original recibe `fechaFin = hoy`;
      2) se crea una copia con `fechaInicio = hoy`, `fechaFin` = la original (si tenía)
      y la cuantía ajustada;
      3) ambas quedan enlazadas (`ajustadaDesdeId`) para trazabilidad.
      CA: test de flujo completo del ajuste, incluyendo estimaciones sin fechaFin.
- [ ] **4.7 "Ajustar automáticamente todas"** — aplica 4.6 a todas las filas con
      precisión < umbral configurable, con modal de confirmación que lista los cambios.
- [ ] **4.8 Retirar `historialPrecios`** (aprobado 2026-07-30) — una vez la
      contabilidad alimente el análisis de precisión, migrar los historiales de
      precios existentes a transacciones reales y eliminar `_cuantiaEfectivaExp` y la
      UI de historial de precios en gastos.

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
