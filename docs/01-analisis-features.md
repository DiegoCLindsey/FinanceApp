# 01 — Análisis de features implementadas

Inventario exhaustivo de la funcionalidad actual, documentado a partir de la lectura del
código en la rama principal (commit `260955a`). Cada entrada indica dónde vive, qué hace y
su estado: ✅ vivo · ⚠️ legacy/solapado · ☠️ muerto (no se carga o no se invoca).

## 1. Infraestructura y servicios comunes

### 1.1 Persistencia y estado — `common/storage.js`, `common/state.js` ✅
- `StorageAdapter`: wrapper mínimo sobre `localStorage` (get/set JSON).
- `State`: singleton con el estado completo de la app. Esquema versión 4 con migraciones
  in-line en `load()` (campos nuevos de cuentas, `escenarioId`→`escenarioIds[]`, formato
  `diaPago`, defaults de config…).
- Colecciones: `loans`, `expenses`, `accounts`, `history` (⚠️ legacy, ver §8), `nominas`,
  `goals`, `inflacion`, `tramosGananciasCapitalHistorico`, `tramosIRPFHistorico`,
  `escenarios`, `config`.
- `config` contiene ~40 claves: rango del dashboard, `fechaReferencia`, colchón
  (meses/fijo + `colchonPuntos`), Monte Carlo, inflación, tramos fiscales por defecto,
  umbrales de salud financiera, escenario activo, filtros de tags persistidos
  (`activeTagsFilter`, `tagCategorias`, `tagGrupos`), modo de storage, autosave,
  `margenesSeguridad` (los márgenes viven dentro de config, no como colección).
- Garantiza cuenta `default` y exactamente una `esCuentaPrincipal`.

### 1.2 Cifrado — `common/crypto.js` ✅
`CryptoService`: AES-256-GCM con clave derivada por PBKDF2. Usado para cifrar los backups
antes de subirlos a Firebase/Dropbox (cifrado cliente, la nube nunca ve datos en claro).

### 1.3 Autenticación y sincronización — `auth/auth.js`, `firebase/firebase-service.js` ✅
- Tres modos de almacenamiento: **local** (sin cuenta), **Firebase** (OAuth Google +
  Firestore + whitelist de emails + cifrado cliente) y **Dropbox** (token manual de
  developer app + backup cifrado). Pantallas de setup/unlock para cada uno.
- Gestión de whitelist desde la UI para el admin de Firebase.

### 1.4 Import/Export y autosave — `data-io/data-io.js` ✅
Export/import JSON completo del estado (drag&drop en pantalla de bienvenida incluido),
modal "Administrar datos", autosave a la nube con intervalo configurable.

### 1.5 Onboarding — `onboarding/onboarding.js` ✅
Wizard inicial de 4 pasos: saldo inicial, primer ingreso, primer gasto, colchón.

### 1.6 Shell de UI — `ui/ui.js`, `router/router.js`, `index.html` ✅
- `UI`: toasts, modal genérico, helpers de formulario, widget de "día de pago efectivo".
- `Router`: 9 vistas (dashboard, expenses, loans, accounts, nominas, inflacion,
  escenarios, rentas, margenes). Sidebar responsive con menú móvil.
- `PeriodBar` global (en `index.html`): rango de fechas del análisis con presets
  1M/3M/6M/1Y/5Y/10Y; persiste en `config.dashboardStart/End`.

## 2. Núcleo de cálculo — `finance-math/finance-math.js` (1.847 líneas)

Biblioteca de cálculo (IIFE global) de la que dependen todas las vistas. Funciones por área:

### 2.1 Préstamos
- `cuotaMensual(capital, tin, meses)` — sistema francés; caso tipo 0.
- `calcTAE` — Newton-Raphson sobre el flujo con comisión de apertura.
- `tablaAmortizacion` — tabla completa con amortizaciones parciales intercaladas, en dos
  modos: reducir `plazo` (recalcula meses restantes) o reducir `cuota`.
- `resumenPrestamo` — totales (intereses, TAE, coste total, fecha fin) con **caché** por
  clave determinista de inputs; `resumenPrestamoConAhorro` — comparativa con/sin
  amortizaciones (ahorro en intereses y en tiempo).

### 2.2 Recurrencia de pagos ("día efectivo")
`resolverDiaEfectivo` / `ajustarFechaPago` / `labelDiaPago` — formato `dia:N`,
`dia:ultimo`, `nthweekday:N:W` (p.ej. "último viernes del mes"), con clamp a fin de mes.

### 2.3 Proyección de eventos (motor del extracto)
Cada función genera eventos `{fecha, concepto, cuantia, tipo, tags, cuenta, sourceId, sourceType}`:
- `proyectarGastos` — frecuencias mensual (cada N meses), diaria (cada N días) y
  extraordinario; usa `_cuantiaEfectivaExp` (media del último año de `historialPrecios`
  si existe, si no la cuantía configurada).
- `proyectarPrestamos` — cuotas y amortizaciones desde la tabla.
- `proyectarTransferencias` — pares gasto/ingreso entre cuentas; detecta **traspasos**
  entre fondos (sin tributación); genera retención 19% sobre plusvalía proporcional en
  reembolsos de fondos de inversión y el IRPF de rescate en planes de pensiones (tipo
  marginal real del grupo de nóminas si está configurado).
- `proyectarInteresesCuentas` — interés compuesto por periodo (diario/semanal/mensual)
  sobre saldo medio del periodo, alimentado por el resto de eventos.
- `proyectarAportaciones` — planes de aportación periódica a fondos (par salida/entrada).
- `proyectarNominas` — pagas (nPagas ≤ 12 espaciadas; > 12 con extras en jun/dic/mar/sep),
  IRPF por tramos del ejercicio con **apilamiento marginal por grupo de nóminas**,
  retribución flexible (art. 42 LIRPF: reduce base y genera recargas a cuentas
  beneficio), SS 6,35 % sobre base cash, actualización por IPC en mes configurable,
  representación `detallado` (bruto + gastos SS/IRPF) o `simplificado` (neto).
- `proyectarRetencionesFiscales` — retención IRPF para ingresos manuales `sujetoIRPF`.
- `proyectarInflacionGastos` — evento mensual "incremento coste de vida" (cesta de gastos
  mensuales × factor de inflación acumulada).
- `proyectarPerdidaAhorro` — erosión mensual del saldo por inflación (evento de gasto).
- `proyectarInversiones` — ☠️ **muerta**: inversiones de escenarios, modelo ya migrado
  a cuentas; exportada pero sin ningún llamador.
- `generarExtracto` — pipeline que concatena todo lo anterior, ordena y aplica
  `_aplicarSaldoRef`: núcleo **bidireccional** que ancla el saldo real conocido en
  `fechaReferencia` y reconstruye hacia atrás/adelante.

### 2.4 Saldos
- `saldoRealCuenta` (último punto de control), `saldoEnFecha` (ancla
  `saldoInicial@fechaInicialSaldo` + `historicoSaldos`, con semántica distinta antes y
  después del ancla), `saldoHoy`, `saldosPorCuentaEnExtracto`, `recomputarSaldoAcum`.

### 2.5 Análisis
- `agruparOHLC` (velas semana/mes/año), `sumarPorTags`, `mediaMensualGastos`,
  `detectarPuntosCriticos` (saldo negativo / bajo colchón / recuperación),
  `calcColchon` / `calcColchonEnFecha` (waypoints `colchonPuntos`),
  `calcMargenEnFecha` + `detectarCrucesMargenes` (márgenes de seguridad),
  `calcDesviacion` (real vs estimado con LOCF multi-cuenta),
  `calcSaludFinanciera` (tasa de ahorro, DTI con/sin hipoteca, regla 50/30/20,
  semáforos configurables), `monteCarlo` (perturbación gaussiana de gastos/nóminas con
  `varianza`, percentiles p10–p90).

### 2.6 Fiscalidad
- `calcIRPF` (tramos progresivos), `calcBaseImponibleTrabajo` (SS 6,35 %, gastos
  art. 19.2 hasta 2.000 €, reducción art. 20), `retencionMensual`,
  `tramosIRPFParaAño` / `tramosGananciasParaAño` (tablas por ejercicio con fallback),
  `calcGananciasCapital` (tramos del ahorro), `calcFondoInversion` (plusvalía, impuesto
  latente, neto), `calcFondosPension` (disponible/bloqueado FIFO con `bloqueoMeses`),
  `calcImpuestoPension`, `calcTipoMarginalPension`, `calcTipoMarginalGrupo`,
  `calcPrestacionParo` (SEPE: tabla días cotizados→prestación, base reguladora, topes
  IPREM por hijos, tramos 70 %/50 %).

### 2.7 Inflación
`calcFactorInflacion` (compuesto por días/año con tasas anuales), `calcInflacionMediaAnual`,
`calcTipoRealFisher`, `ajustarPrecioReal`, y ⚠️ `aplicarInflacion` — sistema **legacy**
paralelo (`inflacionGlobal` de config + `exp.inflacion` por gasto) aplicado como
post-proceso solo en el dashboard.

### 2.8 Optimización
- `optimizarAmortizaciones` — planifica amortizaciones parciales mes a mes respetando
  márgenes de seguridad, cuenta origen con atribución proporcional de eventos sin cuenta,
  ordena préstamos por TIN. **Coste alto**: regenera el extracto completo por cada mes
  del horizonte.
- `compararFrecuencias` — corre el optimizador para varias frecuencias y compara ahorro
  de intereses / saldo final / valor total.

### 2.9 Escenarios
`filtrarPorEscenario` — visibilidad de items por `escenarioIds` (base + escenario activo).

## 3. Vistas

### 3.1 Dashboard — `dashboard/dashboard.js` (1.730 líneas) ✅
KPIs del mes en curso (ingresos, gastos básicos/deseo con clasificación necesidad/deseo,
cuotas), resumen ejecutivo colapsable, "próximos 7 días", objetivos de ahorro, resumen de
préstamos, distribución media mensual (donut necesidades/deseos/cuotas con **promoción de
tags a categoría propia** vía `tagCategorias`), desglose "otros gastos", distribución de
saldos por cuenta (donut), evolución del saldo (línea con colchón, bandas Monte Carlo
opcionales, marcadores de fecha fin de préstamos), panel "análisis avanzado" colapsable:
salud financiera (semáforos + regla 50/30/20 + DTI), ingresos vs gastos por categoría,
gastos por etiqueta (filtro persistido, grupos vía `tagGrupos`, modo por
grupos/desglosado), media mensual por etiqueta, velas OHLC, extracto proyectado completo,
flujo de caja mensual, desviación real vs estimado, y panel de configuración (colchón,
MC, umbrales de salud, inflación…).

### 3.2 Gastos e ingresos — `expenses/expenses.js` ✅
CRUD de gastos/ingresos/transferencias. Frecuencias, día de pago efectivo, fechas de
vigencia, cuenta origen/destino, tags libres, clasificación necesidad/deseo (menú
contextual incluido), marca `basico` (entra en colchón), `varianza` (Monte Carlo),
`sujetoIRPF`, inflación por gasto (legacy), asignación a escenarios, historial de precios
por gasto (media anual → cuantía efectiva), duplicar, filtros (tipo, cuenta, fechas,
texto, tags) y ordenación.

### 3.3 Préstamos — `loans/loans.js` ✅
CRUD con TIN/TAE/comisiones, tabla de amortización, amortizaciones parciales
(plazo/cuota, con escenarios), ahorro nominal y **real** (descontando inflación) por
amortización, tipo real Fisher, cuota del mes actual, ocultar finalizados, tags,
`mostrarFechaFinEnDashboard`, marca `basico`.

### 3.4 Cuentas y ahorro — `accounts/accounts.js` + `goals/goals.js` ✅
CRUD de cuentas con 4 modelos (`cuenta`, `inversion`, `pension`, `beneficio`):
remuneración con periodo de cobro, beneficio real vs inflación, plusvalía y fiscalidad de
fondos (cartera fiscal agregada), disponible/bloqueado FIFO en pensiones, planes de
aportación periódica, histórico de saldos (puntos de control) por cuenta, cuenta
principal, cuentas beneficio (tarjetas transporte/restaurante con límites exentos 1.500 €
/ 2.640 € y ahorro fiscal estimado). Sección embebida de **objetivos de ahorro**
(GoalsModule): prioridad, cuentas asociadas, uso de colchón, proyección de fecha de
cumplimiento simulando el extracto mes a mes, completar objetivo.

### 3.5 Nóminas — `nominas/nominas.js` ✅
CRUD con bruto anual, nPagas, IRPF auto (por tramos, con **grupos** de tributación
conjunta que apilan el marginal) o manual, retribución flexible por componentes con
cuenta beneficio asociada, actualización IPC, varianza (MC), representación
detallado/simplificado, y **simulador de prestación por desempleo** (precarga desde una
nómina, cálculo SEPE completo, botón "aplicar como nómina" que da de baja la nómina y
crea la prestación).

### 3.6 Inflación — `inflacion/inflacion.js` ✅
Tasas anuales por periodo, importación de IPC histórico de España desde la **API del
World Bank** con preview y selección, activación del módulo (`usarInflacion`), muestra
equivalencia mensual y factor restante del año.

### 3.7 Escenarios — `escenarios/escenarios.js` ✅ (a sustituir por "Supuestos")
CRUD de escenarios (nombre, color, fecha fin), activación global (todo el dashboard se
recalcula con base + items del escenario), asignación por item (préstamos,
amortizaciones, gastos, nóminas, cuentas llevan `escenarioIds[]`), tabla comparativa
entre escenarios (saldo final proyectado al horizonte común) con filtro de cuentas
excluidas.

### 3.8 Fiscalidad — `rentas/rentas.js` ✅
Resumen fiscal consolidado (trabajo + plusvalías latentes), **simulador de declaración de
la renta** (base general y del ahorro, reducción por aportaciones a planes, cuotas
íntegras, retenciones estimadas → resultado a pagar/devolver), editor de tablas de tramos
por ejercicio (IRPF e impuesto del ahorro históricos).

### 3.9 Márgenes de seguridad — `margenes/margenes.js` ✅
Umbrales mínimos de saldo con waypoints temporales (importe fijo o N meses de gasto
básico), por subconjunto de cuentas, alertas de cruce en el dashboard, integración con el
optimizador de amortizaciones (limitan cuánto amortizar). Guardados en
`config.margenesSeguridad`.

## 4. Código muerto y legacy detectado

| Item | Evidencia | Acción propuesta |
|---|---|---|
| ☠️ `calendar/calendar.js` (CalendarModule) | No se incluye en `index.html`, no existe `#view-calendar`, no está en el Router | Eliminar |
| ☠️ `dashboard/history.js` (HistoryModule) | Se carga en `index.html` pero **nadie lo invoca** (grep: solo se referencia a sí mismo) | Eliminar; su función la absorbe el módulo de Contabilidad |
| ☠️ `FinanceMath.proyectarInversiones` | Exportada, 0 llamadores | Eliminar |
| ⚠️ Colección `state.history` | Solo la usan HistoryModule (muerto) y el export de DataIO | Migrar a Contabilidad y retirar |
| ⚠️ Inflación legacy (`config.inflacionGlobal`, `exp.inflacion`, `aplicarInflacion`) | Sistema paralelo al módulo de inflación por periodos; solo lo aplica el dashboard como post-proceso | Consolidar en el módulo de inflación |
| ⚠️ Tooling roto (`vite.config.ts`, eslint/format scripts → `src/v2/`) | `src/v2` eliminado en PR #75 | Reparado en Fase 0 (vitest); resto en F1 |
| ⚠️ `tests/nomina.test.cjs` | Copias inline de las funciones, no testea el código real | Sustituido por tests de caracterización (F0) |

## 5. Riesgos de precisión detectados (a corregir en F1)

1. **Fechas vía `Date.toISOString()`**: todo el código construye fechas locales
   (`new Date(y, m, d)`) y las serializa con `toISOString()` (UTC). En timezones al
   oeste de UTC cada fecha retrocede un día. Hoy funciona "de casualidad" en UTC/Europa.
   → Sustituir por un helper `formatLocalDate` único.
2. **Aritmética en coma flotante con euros**: acumulaciones largas (tablas de
   amortización a 30 años, extractos de 10 años) arrastran error de redondeo. → Política
   única: computar en céntimos (enteros) o redondear solo en presentación.
3. **Meses de 30,44 días**: usado para "media mensual" y "meses restantes" en varios
   sitios; correcto como aproximación estadística pero inconsistente entre módulos
   (algunos usan aritmética de calendario). → Unificar criterio.
4. **`monteCarlo` y `optimizarAmortizaciones`** regeneran proyecciones completas en bucle
   (O(meses × extracto)); el caché existente solo cubre `resumenPrestamo`. → Memoización
   del extracto e iteración incremental.
5. **`aplicarInflacion`** hace `expenses.find` por evento (O(n·m)) y puede solaparse con
   `proyectarInflacionGastos` si ambos sistemas de inflación están activos (doble conteo).
