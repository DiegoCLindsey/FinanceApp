# 11 — Rediseño del dashboard: apertura/cierre, cashflow de préstamos y análisis por persona

> El cuadro de mando ganó dos secciones nuevas ("Este mes" / "Durante el
> periodo seleccionado") con apertura y cierre de saldo, gastos con sus
> repeticiones agrupadas y el reparto disfrute/básico/ahorro; Préstamos ganó
> el mismo patrón para cuotas vivas y qué empieza o acaba; Por persona ganó
> el desglose sin promediar; y la pestaña "Gráficas" quedó absorbida en
> Resumen.
>
> Fecha: 2026-08-31.

---

## 1. Pedido

El pedido llegó en tres mensajes seguidos (el primero y el segundo
interrumpidos a media escritura), reproducidos aquí tal cual el tercero, que
es el completo:

> «Vamos a actualizar el Dashboard:
>
> **Resumen**
> - Gráfica "Evolución del saldo"
> - Gráficas de corona (en una sola línea)
> - **ESTE MES**
>   - [Open estimado vs Open real] [saldo actual vs proyectado hoy] [close
>     estimado] [Ahorro esperado]
>   - [Gastos estimados este mes] [Desglose en sumatorio si hay repeticiones]
>   - [% Disfrute (deseo) vs % Básico vs % Ahorro] (si no catalogado, se
>     considera deseo)
> - **DURANTE EL PERIODO SELECCIONADO**
>   - (la misma estructura que "Este mes")
>
> **Préstamos**
> - ESTE MES / ESTE PERIODO
>   - Cuotas vivas este mes / este periodo (qué) + sumatorio (cuánto)
>   - Qué empieza / acaba este mes / este periodo (qué) + flujo de caja
>     perdido / liberado
>
> **Personas**
> - Como está ahora, pero además desglose sumado este mes / este periodo
>
> **Gráficas** (queda absorbido)
>
> **Análisis avanzado**
> - Cambiar a "Análisis por etiquetas". Añadir rosco de gastos/ingreso por
>   persona e impacto en el proyecto (%)»

Varias piezas del pedido admitían más de una lectura razonable — qué pasaba
con el contenido que YA tenía Resumen (avisos, próximos 7 días, resumen
ejecutivo, configuración), qué saldo es "Open", y qué significa "desglose
en sumatorio si hay repeticiones" — así que antes de tocar código se
resolvieron con el usuario, en dos rondas de preguntas:

1. Velas del saldo (no mencionado explícitamente en la lista) → a Resumen,
   junto con la gráfica de saldo y las coronas.
2. Préstamos: "ESTE MES / ESTE PERIODO" → dos secciones completas, igual que
   Resumen (no un selector que alterne entre las dos).
3. El contenido actual de Resumen (avisos, próximos 7 días, resumen
   ejecutivo, configuración) → **reemplazo total**, salvo un matiz: la
   Configuración no es solo texto informativo (lleva controles reales:
   fecha de referencia, filtrar cuentas, histórico, actualizar), así que se
   queda — colapsada, arriba del todo, fuera de las pestañas, porque sus
   controles afectan a todas ellas.
4. "Open estimado vs Open real" → el saldo al INICIO del mes/periodo:
   estimado por la proyección vs el real registrado en contabilidad.
5. "Desglose en sumatorio si hay repeticiones" → agrupar por concepto
   repetido: si el mismo concepto aparece dos veces o más en el mes/periodo,
   una sola línea "Concepto ×N — total", en vez de listarlo suelto.

## 2. Resumen: apertura y cierre de un mes o un periodo

### "Open"/"Close" con lo que ya existía

Antes de esto, el dashboard ya sabía calcular dos saldos puntuales — `saldoHoy`
(proyectado a día de hoy) y `saldoEnFecha` (real, por punto de control o
`saldoInicial`, en cualquier fecha) — pero solo los usaba para "hoy" y para
el final del periodo del dashboard. Faltaba generalizarlos a UNA fecha
cualquiera, para poder pedir "el saldo al abrir el mes" del mismo modo que
ya se pedía "el saldo hoy".

```js
// Proyectado: mismo patrón que `saldoHoy` — el último evento del extracto
// GLOBAL con fecha <= X, o el saldo real de hoy si el extracto no llega
// tan atrás.
const _saldoProyectadoEn = (fecha) => {
  const past = extracto.filter(e => e.fecha <= fecha);
  return past.length > 0 ? past[past.length - 1].saldoAcum : saldoBase;
};
// Real: FinanceMath.saldoEnFecha ya existía (lo usa `_aplicarSaldoRef`
// internamente) pero no estaba expuesto para "cualquier fecha" desde el
// dashboard — sí lo estaba desde `finance-math.js`, así que solo hacía
// falta sumarlo por cuenta.
const _saldoRealEn = (fecha) => cuentasActivas.reduce((s, a) => s + FinanceMath.saldoEnFecha(a, fecha), 0);
```

"Apertura" de un mes/periodo es el saldo el día ANTERIOR a que empiece —el
saldo que se "hereda", antes de que pase nada del mes—, así que se pide en
`mesAnteriorFin`/`periodoAnteriorFin` (el último día del mes o periodo
previo), no en el primer día del mes/periodo en sí. "Cierre" es el saldo al
ÚLTIMO día del mes/periodo, que para el periodo completo ya EXISTÍA con
otro nombre (`saldoFinal`) — se reutiliza tal cual.

### Gastos con concepto repetido, agrupados

Mismo patrón visual que ya usaba la tarjeta "Gastos extraordinarios" (que
sigue existiendo, sin tocar, en Préstamos vía otro camino): agrupar por
clave y mostrar solo los que se repiten.

```js
const _gastosRepetidos = (evs) => {
  const porConcepto = new Map();
  for (const e of evs) {
    if (e.tipo !== 'gasto' || e.sourceType === 'loan-amort') continue;
    let concepto = null;
    if (e.sourceType === 'expense') concepto = expenses.find(x=>x._id===e.sourceId)?.concepto;
    else if (e.sourceType === 'loan') concepto = loans.find(x=>x._id===e.sourceId)?.nombre;
    if (!concepto) continue;
    const cur = porConcepto.get(concepto) || { count: 0, total: 0 };
    cur.count++; cur.total += Math.abs(e.cuantia);
    porConcepto.set(concepto, cur);
  }
  return [...porConcepto.entries()]
    .filter(([, v]) => v.count >= 2)   // "si hay repeticiones" — una sola vez no se agrupa
    .map(([concepto, v]) => ({ concepto, ...v }))
    .sort((a, b) => b.total - a.total);
};
```

Cubre gastos (`expenses`) y cuotas de préstamo (`loans`) — los dos orígenes
que tienen un "concepto" con el que agrupar con sentido; el resto
(intereses de cuenta, amortizaciones, aportaciones...) queda fuera, igual
que en el resto de sitios del dashboard que ya distinguían "gasto normal" de
estos orígenes.

### Disfrute vs básico vs ahorro — sin catalogar cuenta como disfrute

El dashboard ya tenía una distinción básico/deseo (`_clas`, más arriba en
el fichero) para la donut "Distribución media mensual" y las métricas de
salud financiera: ahí lo SIN CATALOGAR (`clasificacion` sin definir) cuenta
como básico — la lectura optimista, "si no se ha dicho lo contrario, es
necesario".

Este reparto nuevo usa la regla CONTRARIA a propósito, tal como lo pidió el
usuario: sin catalogar cuenta como disfrute, no como básico.

```js
// A propósito DISTINTO del resto del dashboard (`_clas`): aquí lo SIN
// CATALOGAR cuenta como disfrute, no como básico — para no ser optimista
// con el ahorro real cuando falta clasificar un gasto. `null` (excluido a
// propósito) se sigue excluyendo, igual que en el resto de sitios.
const _splitDisfruteBasico = (evs) => {
  let basico = 0, deseo = 0;
  for (const e of evs) {
    if (e.tipo !== 'gasto') continue;
    if (e.sourceType === 'loan') { basico += Math.abs(e.cuantia); continue; }
    if (e.sourceType !== 'expense') continue;
    const ex = expenses.find(x => x._id === e.sourceId);
    if (ex?.clasificacion === null) continue;               // excluido, como en el resto
    if (ex?.clasificacion === 'necesidad') basico += Math.abs(e.cuantia);
    else deseo += Math.abs(e.cuantia);                       // undefined o 'deseo' → disfrute
  }
  return { basico, deseo };
};
```

Las cuotas de préstamo cuentan siempre como básico (una hipoteca no es
disfrute), y el ahorro es lo que sobra: `ingresos − básico − deseo`. Los
porcentajes se calculan sobre `básico + deseo + max(0, ahorro)` — si el mes
sale en negativo, el ahorro se enseña en euros (negativo, visible) pero no
resta porcentaje a las otras dos categorías.

## 3. Préstamos: cuotas vivas y qué empieza/acaba

Tres funciones nuevas, parametrizadas por un rango `[fechaIni, fechaFin]`
para poder llamarlas dos veces (mes/periodo) sin duplicar lógica:

- `_cuotasVivasEn(ini, fin)`: por cada préstamo activo, suma sus cuotas
  ordinarias dentro del rango — "vivas" en el sentido de "con pago real en
  esa ventana", no solo "con fecha de inicio anterior".
- `_loansEmpiezanEn(ini, fin)`: préstamos cuya `fechaInicio` cae dentro del
  rango — lo que "empieza" a pagarse, con el flujo de caja que AÑADEN
  (su cuota nivelada, `resumenPrestamo(l).cuota`).
- `_loansTerminanEn(ini, fin)`: préstamos cuya fecha de fin REAL (ya con
  amortizaciones aplicadas, `resumenPrestamo(l).fechaFin`) cae dentro del
  rango — lo que "acaba", con el flujo de caja que LIBERAN.

Con esto, la tarjeta enseña "📌 Empieza: Coche nuevo — Añade 215,62 € de
cuotas nuevas" en rojo y "🏁 Acaba: IKEA — Libera 46,88 € de cuotas" en
verde — el mismo lenguaje ya usado en `features/loans/index.ts` para el
aviso de préstamos que terminan (PR #84 de esta misma serie de trabajo),
pero aquí también con el lado simétrico de los que EMPIEZAN, y para dos
ventanas (mes y periodo) en vez de solo "este mes".

Al ser rangos distintos, "empieza"/"acaba" del periodo puede NO incluir algo
que sí aparece en "este mes": si `dashboardStart` es hoy y un préstamo
terminó el día 1 de este mes (antes de hoy), "este mes" lo ve (su ventana
empieza el día 1) pero "el periodo" no (su ventana empieza hoy). Es
coherente con lo que significa cada ventana, no un error de redondeo.

## 4. Por persona: además de la media, los totales sin promediar

`agregarPorPersona` (ya existente, de la funcionalidad de personas) se llama
TRES veces en vez de una — sobre `evSinTransf` (para la media, como antes),
sobre `evsMesActual` (para "este mes") y sobre `evSinTransf` otra vez sin
dividir por `numMeses` (para "el periodo", que es literalmente el total sin
promediar). Cada tarjeta de persona enseña las tres cifras en una tabla
compacta debajo de las barras que ya existían, que no se han tocado.

## 5. Gráficas queda absorbido en Resumen

Todo lo que vivía en la pestaña "Gráficas" —donuts (distribución media
mensual, otros gastos, distribución de saldos), el aviso de simulaciones
activas, la gráfica "Evolución del saldo" y "Velas del saldo"— se movió,
literalmente el mismo HTML, dentro de la pestaña "Resumen", en este orden:
aviso de simulaciones → evolución del saldo → velas → coronas (las tres
donuts, en una fila) → Este mes → Periodo seleccionado. `DASH_TABS` pierde
la entrada `'graficas'`; las pestañas quedan en cuatro: Resumen, Préstamos,
Por persona, Análisis por etiquetas.

## 6. Análisis avanzado → Análisis por etiquetas, con rosco por persona

Cambio de nombre en la cabecera y en `DASH_TABS` (el resto del contenido
—breakdown mensual, gastos por etiqueta, media mensual por etiqueta— no se
ha tocado). Nueva tarjeta al lado de "Media mensual de gastos por etiqueta":
un donut de GASTO por persona (por `consumoPeriodo`, quién lo consume, no
quién lo paga — la misma distinción que ya hacía el reparto de Gastos) con
una leyenda que añade también el % de ingreso de cada persona sobre el
total. `renderChartPersonasDonut` sigue el mismo patrón que
`renderChartSaldosDonut` (canvas + leyenda, sin librería nueva).

## 7. Limpieza: código que se quedó sin ningún sitio donde pintarse

Al borrar el resumen ejecutivo y la fila de stats antigua, varias
variables se quedaron sin ningún consumidor: `saludMes`/`_metSaludMes` (y
el bloque "Salud financiera — métricas para mes actual y media" entero),
los alias `gastosFijosMes`/`gastosBasicosMes`/`ingresosMensuales`,
`totalGastos`/`totalIngresos`/`mediaMensual`, el bloque completo "Intereses
de cuentas remuneradas" (`interesesMesActual`, `interesesTotalIntervalo`,
`interesesMediaMes`, `interesesPorCuenta`), `saldosPorCuentaRender` +
`alertasMargRender`, los helpers `pctFmt`/`semColor`, y la función
`toggleExecSummary` (con su entrada en el objeto exportado). Se han
retirado en vez de dejarlos como código muerto — este fichero no tiene
comprobación de variables sin usar (es JS legacy, fuera del `tsc` del
paquete nuevo), así que nada los habría avisado en CI.

## 8. Verificación

- `node tools/qa/comprobar-estaticos.mjs`: sintaxis limpia (dashboard.js es
  legacy, sin tests unitarios, como el resto de ese directorio).
- Suite completa del paquete nuevo sin tocar: 1228 tests, typecheck y lint
  limpios (este cambio es enteramente `dashboard/dashboard.js`, JS legacy).
- Flujo completo en Chromium, con datos sembrados a propósito para forzar
  cada caso — un gasto repetido dos veces (Netflix), un gasto sin catalogar
  (disfrute por defecto), un préstamo que empieza este mes y otro que
  acaba, dos personas con reparto — a 1400 px y a 390 px:
  - Resumen: Configuración visible y colapsada por encima de las pestañas;
    evolución del saldo, velas y las tres coronas en Resumen; "Este mes" y
    "Periodo seleccionado" con las cuatro tarjetas, el desglose de gastos
    repetidos ("Netflix ×2 — 24,00 €") y el reparto disfrute/básico/ahorro,
    con las cifras verificadas a mano.
  - Préstamos: "Este mes" y "Periodo seleccionado" con cuotas vivas,
    "📌 Empieza: Coche nuevo" y "🏁 Acaba: IKEA" con sus importes.
  - Por persona: la tabla Este mes/Periodo/Media por mes debajo de las
    barras, por cada persona.
  - Análisis por etiquetas: cabecera renombrada, rosco de gasto/ingreso por
    persona con los porcentajes correctos.
  - A 390 px: la Configuración, las pestañas y las tarjetas nuevas se
    apilan mediante las mismas reglas responsive que ya existían
    (`.grid-4:has(> .stat-card)` con `auto-fit`, documentada en
    `common/components.css`) — no ha hecho falta CSS nuevo.

## 9. Ajuste posterior: selector en vez de vistas apiladas

Nada más ver el resultado, el usuario pidió cambiar "Este mes" y "Periodo
seleccionado" de dos bloques apilados (uno debajo del otro) a un selector
que muestra uno u otro — citando como modelo el propio selector
Mensual/Anual que ya tenían las velas del saldo (`ventanaVelas`,
`setVentanaVelas`): un modo activo, no dos vistas a la vez.

Un único estado nuevo, `dashScope` (`'mes' | 'periodo'`), se comparte entre
Resumen y Préstamos — las dos secciones que tenían este patrón duplicado.
Compartido a propósito: es el mismo eje conceptual en las dos pestañas, así
que cambiarlo en una y navegar a la otra debe respetar la elección, no
reiniciarla. `_selectorMesPeriodo(subtituloMes, subtituloPeriodo)` pinta los
botones (mismas clases `period-selector`/`period-btn` que ya usaban
`chartMode`/`ventanaVelas`) más el subtítulo con el rango de fechas del modo
activo; `setDashScope(v)` cambia `dashScope` y repinta.

`_seccionResumenPeriodo`/`_seccionPrestamosPeriodo` pierden su propia
cabecera (`titulo`/`subtitulo`) — ahora la da el selector — y en el punto de
llamada solo se construye la sección del modo ACTIVO, no las dos: la que no
se ve no hace falta calcularla.

La tabla "Este mes / Periodo / Media por mes" de Por persona no se ha
tocado — ya mostraba las tres cifras en columnas, en una sola fila por
persona, sin duplicar ninguna vista completa; el patrón de "apilar dos
vistas" solo aplicaba a Resumen y Préstamos.

Verificado en Chromium: el selector alterna sin duplicar contenido (una
sola aparición de "Cuotas vivas"/"Apertura" a la vez), y el estado
persiste al cambiar de pestaña Resumen → Préstamos.

## 10. Animaciones de las gráficas

El usuario preguntó por las animaciones de las gráficas; revisando el
código no había ninguna tocada — las cuatro familias usaban la que trae
Chart.js por defecto (`animation` sin configurar). Se montó una demo con
4 variantes por familia (línea, velas, barras, dona) para elegir a ojo en
vez de a ciegas. Elegidas:

- **Línea** (`renderChartSaldo`, `chart-saldo`): trazo progresivo. La línea
  se dibuja de izquierda a derecha en vez de aparecer entera. Nuevo helper
  `ANIM_TRAZO_PROGRESIVO` justo antes de `renderChartSaldo`: la `x` de cada
  punto arranca en `NaN` y la `y` arranca en el píxel del punto anterior,
  con el `delay` de cada punto encadenado al anterior — la receta oficial
  de Chart.js para «progressive line», generalizada para no depender de un
  dataset concreto (todo sale de `ctx.chart`, sirve para cualquiera de los
  datasets que se apilan en ese chart: histórico, margen, críticos…).
- **Velas** (`renderChartVelas`, `chart-velas`) y **barras**
  (`renderChartMediaMensual`/`chart-media-mensual` y
  `renderChartBreakdown`/`chart-breakdown-mensual`): aparecen escalonadas,
  de izquierda a derecha, con `delay: ctx => ctx.dataIndex * (90|100)`.
- **Dona** (`chart-gastos-tags`, `chart-expense-donut`, `chart-otros-donut`,
  `chart-saldos-donut`, `chart-personas-donut`): se queda la animación por
  defecto de Chart.js, sin cambios.

No verificado visualmente en este entorno: el Chromium sin cabecera de la
sandbox no tiene salida a internet, así que Chart.js (que carga desde
jsDelivr) nunca llega a cargar aquí — la misma trampa ya descrita en
`04-sistema-visual.md` §4. Sí verificado: sintaxis (`node --check`),
`tools/qa/comprobar-estaticos.mjs` limpio, y los 1228 tests del paquete
nuevo sin romperse (el cambio es enteramente en `dashboard.js`, sin tests
propios). Las variantes elegidas ya se vieron animando en un navegador de
verdad en la demo previa a aplicarlas, con la misma configuración de
Chart.js.
