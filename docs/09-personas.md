# 09 — Personas y reparto

> Repartir un gasto, una nómina o un préstamo entre varias personas de la
> casa, con dos ejes independientes: quién lo paga y quién lo consume. Y una
> reorganización del dashboard en pestañas, pedida en el mismo turno.
>
> Fecha: 2026-08-30.

---

## 1. Pedido

> «Añade también soporte para "personas" o "convivientes" o algún nombre
> genérico. La idea es que haya una persona por defecto, pero se pueda tener
> en un proyecto en cuenta a más de una persona. Por defecto irán a la
> persona por defecto, pero podrán repartirse (a partes iguales, % o cantidad
> exacta) entre varias personas. El reparto puede ser de consumo o reparto de
> pago (por ejemplo yo pago el 100% de la luz y lo consumimos mi pareja y yo;
> mi pareja paga el 100% de las cosas de los gatos y los gatos consumen en
> 100%) algo así. Esto aplica a Gastos, nóminas (aquí permitir hacer
> pestañitas separadas), préstamos (también aquí) de momento. En el
> dashboard, habrá un apartado que sea consumo y gasto por "persona".
>
> De paso vamos a mejorar el aspecto del dashboard. Separa la vista en
> pestañas para mayor legibilidad.»

Dos piezas: un reparto de dos ejes (pago / consumo) aplicable a Gastos,
Nóminas y Préstamos, con pestañas por persona en estas dos últimas, y una
sección nueva en el dashboard; y, aparte, reorganizar el propio dashboard en
pestañas.

## 2. Diseño: un reparto es opcional, y son DOS

El nombre elegido es «personas» — «convivientes» encajaba peor con el caso
de una persona que reparte con alguien fuera de casa (una hipoteca a medias
con un hermano, por ejemplo).

Cada gasto, nómina o préstamo puede llevar HASTA DOS repartos independientes,
`repartoPago` y `repartoConsumo`, ambos opcionales:

```ts
export type ModoReparto = 'partesIguales' | 'porcentaje' | 'importe';
export interface ParticipacionPersona { personaId: string; valor?: number; }
export interface Reparto { modo: ModoReparto; participantes: ParticipacionPersona[]; }
```

Sin reparto — el caso normal, y el único que existía antes de este trabajo —
el 100% es de la persona por defecto. Por eso `Reparto | undefined`, y no un
`Reparto` obligatorio con un único participante: no migra ni un gasto
existente, y la app de una sola persona no ve nada nuevo (ver más abajo,
§4). Los dos ejemplos del pedido son, con este modelo:

```
Luz (100 €):     repartoPago    = 100% Yo
                 repartoConsumo = partes iguales, Yo + Pareja

Gatos (40 €):    repartoPago    = 100% Pareja
                 repartoConsumo = (sin definir → 100% persona por defecto)
```

El segundo caso es deliberado: el pedido dice que «los gatos consumen al
100%», pero los gatos no son una persona del sistema — no hay reparto de
consumo que expresar, y dejarlo sin definir (100% de la persona por defecto)
es la lectura más simple del caso «esto lo pago yo... digo, mi pareja, y ya
está» cuando no hay nadie más real con quien repartir el consumo.

## 3. `core/reparto.ts`: el motor de cálculo, sin DOM

### Una regla única para los tres modos

`calcularReparto(importeTotal, reparto, idPersonaDefecto)` reparte un
importe entre los participantes de un `Reparto`. Los tres modos comparten
una sola regla: lo que los participantes NO reclaman explícitamente cae en
la persona por defecto (se le suma a su parte si ya estaba entre los
participantes, o se añade como participante nuevo si no). Es la misma idea
que rige la ausencia total de reparto, aplicada al «resto» de uno parcial —
así que «reparte el 60% con tu pareja, el resto es tuyo» no exige escribir
el 40% que falta.

Si los participantes reclaman MÁS del 100% (o más importe del que hay), no
hay overbooking posible en un gasto real: se escala todo proporcionalmente
para que quepa exacto, con el céntimo suelto del redondeo al primer
participante.

### El invariante de la suma exacta

Los cálculos se hacen en céntimos (`toCents`/`fromCents`), y el resto de
cada reparto se reparte entero — nunca se pierde ni se inventa un céntimo.
La suma de las partes calculadas es SIEMPRE exactamente el importe total,
sea cual sea el modo. Es necesario porque el desglose por persona del
dashboard tiene que cuadrar con las mismas cifras que ya enseña el resto del
cuadro de mando — una discrepancia de un céntimo, multiplicada por meses,
sería visible.

### `agregarPorPersona`: reutilizar el extracto, no reinventarlo

La agregación para el dashboard no recalcula nada del engine financiero:
toma el mismo extracto de eventos de caja (`FinanceMath.generarExtracto`,
`sourceType`/`sourceId`/`tipo`/`cuantia`) del que ya salen todas las demás
medias mensuales del dashboard, y por cada evento de gasto, cuota de
préstamo o ingreso de nómina, reparte su importe con `calcularReparto`
contra el `repartoPago`/`repartoConsumo` del elemento que lo originó.

```ts
agregarPorPersona(eventos, { expenses, loans, nominas }, personas)
  → [{ personaId, pago, consumo, ingresos }, ...]
```

Los eventos de nómina llevan un sufijo en el id para IRPF, Seguridad Social o
cada componente de retribución flexible (`<id>_irpf`, `<id>_ss`,
`<id>_flex_<comp>`) — `buscarFuente` los reconoce con `startsWith`, no con
igualdad exacta, para no perderlos.

Alcance deliberadamente limitado a lo mismo que cubre el reparto en los
formularios: gastos (`tipo: 'gasto'`), cuotas de préstamo
(`sourceType: 'loan'`, sin incluir amortizaciones extraordinarias — llevan
`sourceType: 'loan-amort'` y no se reparten) e ingresos de nómina (por
`repartoConsumo` únicamente: quién los percibe, no quién los «paga»). Otros
orígenes — intereses de cuenta, aportaciones, impuestos — no llevan reparto
y quedan fuera.

### `personasImplicadas`: quién aparece, no cuánto le toca

```ts
personasImplicadas(repartoConsumo, repartoPago, idPersonaDefecto) → Set<string>
```

Devuelve el conjunto de ids de personas implicadas —como pagadoras o como
consumidoras— en un elemento con sus dos repartos. La usan tanto las
pestañas por persona de Nóminas y Préstamos (§5) como, indirectamente, el
mismo principio que usa `agregarPorPersona`.

### `idPersonaPorDefecto`: no es `'default'`

```ts
idPersonaPorDefecto(personas) → personas.find(p => p.esPorDefecto)?._id ?? ...
```

El id de fábrica de la persona por defecto es `'default'`, pero el usuario
puede mover el marcador «por defecto» a otra persona desde la ventana de
Personas (§4). Todo el que necesite saber quién es la persona por defecto
para repartir algo pasa por esta función — nunca asume el id.

36 tests en `tests/core/reparto.test.ts` cubren los tres modos (incluido el
reparto del resto por redondeo y los casos de sobre-reclamo), los dos
ejemplos del pedido palabra por palabra, y el conjunto de casos de
`agregarPorPersona` (sufijos de nómina, orígenes excluidos, personas sin
movimiento).

## 4. `ui/personas-modal.ts`: la ventana «Personas»

CRUD sobre la colección `personas`, reutilizando el mismo modal compartido
que `proyectos-modal.ts` y `features-modal.ts`. Cada persona:

```ts
export interface Persona {
  _id: string;
  nombre: string;
  color?: string;
  esPorDefecto: boolean;
  activo: boolean;
}
```

Reglas de la ventana:
- La persona por defecto no lleva botón de eliminar, ni la última persona
  activa que quede (siempre tiene que haber alguien a quien atribuir lo que
  no se reparte explícitamente).
- «Hacer por defecto» mueve el marcador de forma atómica
  (`store.set('personas', lista.map(...))`) — nunca hay dos personas por
  defecto a la vez, ni ninguna.
- Desactivar una persona la saca de los widgets de reparto y de las
  pestañas nuevas, pero no toca ningún reparto ya guardado que la
  mencione — sigue apareciendo donde ya estaba, solo deja de ofrecerse
  para repartos nuevos.

Se abre desde un botón nuevo en el pie del sidebar («Personas», junto a
«Proyectos» y «Funcionalidades»).

## 5. Los tres formularios: el mismo widget, dos veces

`src/features/shared/reparto-widget.ts` sigue el mismo patrón que
`dia-pago.ts`: `repartoWidget(título, reparto, personas, prefijo) → HTML`,
más `sincronizarRepartoWidget`/`leerRepartoWidget` para mostrar/ocultar según
el modo elegido y leer el resultado del formulario. El prefijo
(`'consumo'` / `'pago'`) es lo que permite pintar el MISMO widget dos veces
en un formulario sin que los ids de sus campos choquen.

Con menos de dos personas activas el widget no pinta nada — la app de una
sola persona no ve ningún control nuevo, ni en el formulario ni en las
tarjetas.

Los tres sitios donde aplica:

- **Gastos** (`features/expenses`): los dos widgets (pago y consumo) en el
  formulario, y un resumen (`resumenRepartoDoble`) en cada fila de la lista
  cuando hay algo repartido.
- **Nóminas** (`features/salaries`): los dos widgets en el formulario
  (`repartoConsumo` aquí es «quién percibe este ingreso»), más pestañas por
  persona (`tabsPersonaHtml`, solo con ≥2 personas activas) que filtran la
  lista ANTES de agrupar por `grupoNomina` — así una pestaña de una persona
  concreta puede mostrar una nómina de un grupo incompleta, que es lo
  correcto: las cuotas/IRPF de ESA persona, no las del grupo entero. Las
  cifras resumen (cuotas, periodo, pensiones) se calculan sobre la lista SIN
  filtrar, porque son resúmenes globales, no por pestaña.
- **Préstamos** (`features/loans`): igual que Nóminas — los dos widgets en
  el formulario y las mismas pestañas por persona, filtrando la lista de
  tarjetas antes de renderizar.

## 6. El dashboard: sección nueva y reorganización en pestañas

### 6.1 «Consumo y gasto por persona»

Dentro del propio `render()` de `dashboard/dashboard.js`, justo donde ya se
calculan el resto de medias mensuales del periodo (mismo `evSinTransf`,
mismo `numMeses`), una llamada a `agregarPorPersona`:

```js
const personas = window.FinanceApp?.store?.get('personas') || [];
const agregadoPersonas = personasActivas.length >= 2
  ? window.FinanceApp.core.agregarPorPersona(evSinTransf, { expenses, loans, nominas }, personas)
  : [];
```

`personas` no vive en el `State` legacy — `common/state.js` nunca la añadió
a su `DEFAULT_STATE` a propósito (es una colección exclusiva del paquete
nuevo) — así que se lee de `window.FinanceApp.store` directamente, igual que
ya hacía ese mismo fichero con `window.FinanceApp.core`/`.accounting`/
`.engine`/`.cambios` para todo lo que tampoco está modelado en `State`.

La sección (una tarjeta por persona con tres barras — paga, consume,
ingresa — a media mensual del periodo) solo aparece con dos o más personas
activas, la misma condición que ya rige el widget de reparto y las pestañas
de Nóminas/Préstamos.

### 6.2 Pestañas: envolver, no reescribir

El `render()` del dashboard es una plantilla de más de 600 líneas con ocho
gráficas de Chart.js. Reescribir su lógica interna para hacerlo por pestañas
habría sido mucho riesgo por una mejora que es, en el fondo, de
organización visual — así que las pestañas envuelven las secciones que ya
existían, sin tocar ni una fórmula:

```
Resumen           → Hero KPIs, avisos, próximos 7 días, config, resumen ejecutivo, stats
Préstamos         → la sección «Préstamos» que ya existía
Por persona       → la sección nueva de §6.1
Gráficas          → donuts, evolución del saldo, velas
Análisis avanzado → el bloque colapsable que ya existía (tags, breakdown, media por etiqueta)
```

Cada sección top-level de la plantilla queda envuelta en un
`<div data-dash-tab-panel="...">`, con `display:none` en las que no son la
pestaña activa. `dashTab` vive fuera de `render()` (como `chartMode` o
`ventanaVelas`): cambiar de pestaña no repinta el dashboard entero, y
cambiar un filtro no devuelve a la pestaña «Resumen».

**El problema de Chart.js y `display:none`.** Todas las gráficas se siguen
creando en cada render, estén o no a la vista — como antes. El problema es
que una gráfica creada contra un `<canvas>` cuyo antepasado tiene
`display:none` no tiene dónde medir, y se queda con tamaño cero. La
solución no es hacer lazy-render por pestaña (habría que trocear el único
temporizador que hoy crea las ocho gráficas juntas, con su propio manejo de
errores aislado por gráfica): `setDashTab(tab)` cambia qué panel se ve y
pide `resize()` a TODAS las gráficas ya creadas —

```js
requestAnimationFrame(() => Object.values(charts).forEach(c => { try { c.resize(); } catch {} }));
```

— lo que las obliga a recalcular su tamaño contra el contenedor que acaba de
hacerse visible. Es la técnica estándar para gráficas de Chart.js dentro de
pestañas, y no exige tocar la lógica de creación de ninguna gráfica.

## 7. Migración

`009-personas.ts`: si no existe ya una persona con id `default`, siembra
`[defaultPersona(), ...personas_del_usuario]`. Idempotente (no toca nada si
ya existe), y no pisa ninguna persona que el usuario haya creado.

`esEstadoVacioOPorDefecto()` (`state/colecciones.ts`) — el que decide si una
instalación está «vacía» para no ofrecer el diálogo de conflicto al
conectar una nube con datos — se extendió para reconocer que
`[defaultPersona()]` (una sola persona, la de fábrica) también cuenta como
vacío. Sin este caso especial, la migración de personas rompería otra vez el
bug que ya se arregló para `plan_base`/proyectos: una colección sembrada de
fábrica en cada instalación hace que «¿está vacío?» no dé nunca que sí.

## 8. Verificación

- 36 tests de `core/reparto.ts` (los tres modos, los dos ejemplos del
  pedido palabra por palabra, `agregarPorPersona`, `personasImplicadas`,
  `idPersonaPorDefecto`).
- 21 tests de `features/shared/reparto-widget.ts` (umbral de visibilidad,
  lectura de los tres modos, dos widgets independientes en el mismo
  formulario sin colisión de ids).
- 11 tests de `ui/personas-modal.ts` contra un store real.
- 5 tests de la migración 009.
- Tests de Gastos, Nóminas y Préstamos actualizados con el reparto y las
  pestañas por persona.
- Suite completa: 1219 tests, typecheck y lint limpios.
- Flujo completo en Chromium sin cabecera, a 1400 px y a 390 px: entrada
  local, datos sembrados con los dos ejemplos del pedido («Luz» al 100%
  pago/50-50 consumo, «Gastos gatos» al 100% pago sin reparto de consumo),
  las cinco pestañas del dashboard (incluida «Por persona», con las cifras
  exactas del ejemplo: Yo paga 100,08 €, consume 90,07 € e ingresa
  2501,92 €/mes; Pareja paga 40,03 € y consume 50,04 €), y la ventana
  «Personas» abierta desde el sidebar en móvil.
