# Sistema visual — «cristal»

> Portado de [SaldoSocialNFC](https://github.com/DiegoCLindsey/SaldoSocialNFC)
> (`css/app.css` de ese repo), a petición del usuario: «revisa la interfaz de
> saldonfc (tipo cristal, moderna) y aplica ese estilo a financeapp».
>
> Última actualización: 2026-08-22.

---

## 1. Qué se copió

| De SaldoSocialNFC | Cómo llega a FinanceApp |
|---|---|
| Tinta `#070b12` + aurora difuminada de fondo | `.aurora` en `common/base.css`, `<div class="aurora">` en `index.html` |
| Superficies translúcidas (blanco al 4,5 % / 7,5 %) | `--surface`, `--surface-strong` |
| Filos de un píxel (blanco al 6 % / 10 %) | `--hairline-soft`, `--hairline` |
| Acento menta → cian en degradado, con halo | `--accent`, `--accent2`, `--gradient-accent`, `--glow-accent` |
| Botones en píldora | `--radius-pill` en `.btn-*` |
| Esquinas de 20-26 px | `--radius-lg`, modales a 26 px |
| Tipografía Outfit, una sola familia | `--font-sans`; `--font-mono` es un ALIAS suyo |
| Cromo opaco para barras fijas | `--chrome` + `backdrop-filter` |

**No** se copió el tema claro. FinanceApp es oscura y punto; `color-scheme:
dark` está declarado. Si algún día hace falta, el patrón de SaldoSocialNFC es
`:root[data-theme="light"]` redefiniendo solo los tokens.

---

## 2. Decisiones

### 2.1 Los nombres viejos de los tokens se conservan

`--bg2`, `--border`, `--accent`… siguen existiendo y ahora apuntan a la paleta
nueva. Buena parte de la interfaz se pinta con **estilos en línea dentro de
plantillas** (`src/features/**`, `dashboard/dashboard.js`): cientos de
`style="background:var(--bg3)"`. Reapuntar los tokens repinta todo eso de golpe;
reescribir cada plantilla habría sido un diff de miles de líneas con el mismo
resultado.

Para código nuevo, usa los nombres nuevos: `--surface`, `--hairline`, `--ink-800`.

### 2.2 El fondo opaco va en `<html>`, no en `<body>`

La aurora es un hijo de `<body>` con `z-index: -1`. En el orden de pintado, el
fondo de un bloque en flujo se pinta DESPUÉS de las capas de z-index negativo,
así que un `background` opaco en `<body>` la taparía. En `<html>` no, porque ése
es el fondo del lienzo.

Corolario: `.view-container` es **transparente**. Si alguien le vuelve a poner
`background: var(--bg)`, la aurora desaparece del área de contenido.

### 2.3 `backdrop-filter` solo en el cromo

Lo llevan la barra lateral, la cabecera móvil, la barra de periodo, los modales,
los avisos y la tarjeta de acceso. Las tarjetas de contenido **no**: hay decenas
por vista y el desenfoque se nota al hacer scroll. Usan un degradado
translúcido (`linear-gradient(160deg, var(--surface-strong), var(--surface))`),
que es lo mismo que hace `.card` en SaldoSocialNFC.

### 2.4 Modales en tinta opaca

`.modal-box`, `.welcome-card` y `.wizard-card` van en `--ink-800`, no en
cristal: encima de un gráfico a todo color un formulario translúcido no se lee.
El fondo que hay detrás ya se desenfoca desde el overlay.

### 2.5 Se acabó la monoespaciada

SaldoSocialNFC usa Outfit para todo y alinea las cifras con `tabular-nums`.
Aquí igual: `body` lleva `font-variant-numeric: tabular-nums` y
`font-feature-settings: 'tnum'`, y `--font-mono` es un alias de `--font-sans`.

Se mantiene `--font-code` (monoespaciada de sistema) para lo que es código de
verdad: el textarea donde se pega la configuración de Firebase.

### 2.6 Los botones de proveedor no llevan `nowrap`

«Firebase — sincronización en tiempo real» dentro de una tarjeta de 380 px no
cabe en una línea. Antes llevaban `white-space: nowrap` y el texto se salía del
botón en cuanto la tipografía cargada era un poco más ancha de lo previsto (se
vio en la verificación con el navegador, con Outfit sin cargar). Ahora parten en
dos líneas.

---

## 3. Colores incrustados en JS

Las configuraciones de Chart.js llevan los colores como literales. Se
actualizaron todos en `dashboard/dashboard.js` y `src/features/planner/chart.ts`:

| Antes | Ahora | Qué es |
|---|---|---|
| `#00e5a0` | `#2ee6a8` | menta (acento) |
| `#ff4d6d` | `#ff6b6b` | coral (negativo) |
| `#ffd166` | `#ffb020` | ámbar (aviso) |
| `#13161e` | `#111a28` | fondo de los tooltips |
| `#252a38` | `rgba(255,255,255,0.12)` | borde de los tooltips |
| `#1a1e28` / rejillas | `rgba(255,255,255,0.07)` | líneas de rejilla |
| `#8b92a8` / `#555d77` | `#a9b6cc` / `#6b7b96` | rótulos de los ejes |
| `#e8eaf2` | `#eef3fb` | texto de los tooltips |

Las **paletas categóricas** (series de un gráfico apilado, colores de objetivos)
se dejaron como estaban salvo la menta: son colores arbitrarios para distinguir
series, y armonizarlos con el acento los habría acercado entre sí. El `#4d9fff`
de «Necesidades» tampoco se tocó: pasarlo a cian lo habría dejado a un paso de
la menta de «Ahorro» en el mismo donut.

---

## 4. Verificación

Se comprobó en Chromium sin cabecera contra un servidor local, con datos
sembrados en `localStorage`: cuadro de mando, gastos, objetivos financieros,
modal de datos, pantalla de acceso, las tres animaciones de carga y el ancho de
móvil.

Dos avisos sobre ese entorno, para quien repita la comprobación:

- **No hay red saliente para el navegador**: ni Outfit (Google Fonts) ni Chart.js
  (jsDelivr) cargan, así que las capturas salen con una tipografía de reserva y
  sin gráficos. El maquetado sí es válido.
- **`--virtual-time-budget` congela las animaciones**: un modal capturado a media
  animación `pop-in` parece translúcido y no lo es. Añade
  `--force-prefers-reduced-motion`.

### Pendiente, no introducido aquí

A 390 px de ancho el contenido **desborda horizontalmente**. Se comprobó contra
el CSS anterior al restilizado y ya pasaba: no es una regresión de este cambio,
pero está sin arreglar.
