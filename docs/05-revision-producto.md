# 05 — Revisión de producto y plan de acción

> Revisión hecha como PO sobre el estado **actual** (tras el planificador y el
> restilizado), no sobre el plan de refactor. Complementa a
> `03-informe-redundancias.md`, que es de 2026-07-30 y ha quedado desfasado en
> algún punto (ver §1.5, ya corregido allí).
>
> Fecha: 2026-08-23. Base: QA automatizado de las 14 vistas (`tools/qa`).

---

## 0. Para quién es esto

FinanceApp la usa **una persona**, en su móvil y en su portátil, para responder
a tres preguntas:

1. ¿Cuánto dinero voy a tener dentro de N meses?
2. ¿Puedo permitirme *esto*?
3. ¿Voy por donde dije que iría?

Todo lo que no sirva a una de las tres compite por atención con lo que sí.
Ése es el criterio que se usa abajo.

---

## 1. Qué encontró el QA

Recorrido automático de las 14 vistas a 1400 px y a 390 px reales, midiendo
errores de consola, desbordes y texto fuera de caja. Estado final: **0, 0 y 0**.

### 1.1 Actualizar el saldo de una cuenta no llegaba al dashboard `✅ arreglado`

El fallo que reportó el usuario. `saldoEnFecha` resolvía el empate de fechas
entre el ancla (`saldoInicial` @ `fechaInicialSaldo`) y los puntos de
`historicoSaldos` a favor del ancla. Como actualizar el saldo escribe un punto
con la fecha de **hoy**, y toda cuenta recién creada tiene el ancla también en
hoy, el saldo nuevo no llegaba a ningún sitio.

Lo grave no es el empate: es que **`calcDesviacion` ya lo resolvía al revés**.
Había dos implementaciones de «cuál es el saldo en esta fecha» que discrepaban,
así que la tarjeta «Saldo real vs proyectado» y el KPI podían enseñar cifras
distintas de la misma cuenta. Ahora hay un test de paridad legacy ↔ núcleo.

### 1.2 Importes saliéndose de las tarjetas `✅ arreglado`

`grid-3` fija dentro de una tarjeta de cuenta de 365 px deja ~110 px por celda;
un importe de seis cifras a 22 px pide ~142. En «Fondo de inversión ·
Proyección» los tres números se pisaban y se salían de la pantalla.

### 1.3 «2.779,86 €/paga neto» no cabía en Nóminas `✅ arreglado`

`formatEUR` separa el importe del € con un espacio **duro**, así que era un
único token sin punto de corte en una columna de 80 px.

### 1.4 Un agujero en la verificación, con dos víctimas `✅ arreglado`

Dos regresiones llegaron a producción por el mismo hueco: **`tsc` solo mira
`src/`, ESLint solo mira `src/` y `tests/`, y del CSS no se ocupaba nadie**.

1. En `dashboard.css`, un `*/` cerraba un comentario antes de tiempo y el texto
   suelto que quedaba detrás se comía la regla siguiente.
2. En `dashboard.js`, un comentario HTML con backticks **dentro de un template
   literal** cortó la cadena y dejó el fichero sin parsear: el dashboard entero
   en blanco.

El segundo lo cometí durante esta misma revisión, lo que confirma que no es
mala suerte sino falta de red. Ahora `npm run check:estaticos` pasa
`node --check` por todo el JS servido tal cual y valida comentarios y llaves de
todo el CSS; está en `verify` y en CI. Se comprobó que detecta los dos casos
reales reintroduciéndolos a propósito.

### 1.5 La documentación mentía en un punto `✅ arreglado`

`03-informe-redundancias.md` da las **velas OHLC** por eliminadas (C1,
«✅ Eliminado»). Pero existe el flag `velas-saldo`, encendido por defecto, y el
usuario pidió expresamente recuperarlas en agosto. Un agente que lea ese
documento concluiría que puede borrar código vivo. Corregido, con un aviso al
principio de ese documento que remite a éste para el estado actual.

### 1.6 El dashboard enlazaba a una vista que puede estar apagada `✅ arreglado`

La tarjeta de configuración dice «Los márgenes de seguridad se configuran en
*Márgenes de seguridad*» con un enlace a `margenes`. Ese flag viene **apagado
por defecto**, y el enlace no estaba gateado: un usuario nuevo veía un enlace a
un apartado que no tiene en el menú. Resuelto con `data-feature="margenes"`.

---

## 2. Las tres «planificaciones» se solapan

Es el problema de producto más serio que queda, y no es un bug: es que hay
**tres conceptos con nombres que se pisan**.

| Módulo | Qué hace de verdad | Se llama |
|---|---|---|
| `scenarios` | Filtra lo que YA existe: «¿y si quito este gasto?» | «Escenarios» en el menú, flag `supuestos` |
| `planner` | Reparte el flujo FUTURO entre objetivos que compiten | «Objetivos financieros» |
| `planner`, pestaña 5 | Compara planes A/B/C | «Escenarios», otra vez |

Y por debajo, dos entidades llamadas «objetivo»:

- `goals` — «Objetivos de ahorro», dentro de *Cuentas y ahorro*. Sigue saldos
  reales de unas cuentas.
- `Objetivo` del planificador — compite por el flujo mensual.

La migración 008 **copia** los `goals` al planificador pero **no los borra**, a
propósito, por si la conversión salía mal (`docs/03-planner.md` §2.1). Eso era
razonable durante el desarrollo; hoy el usuario ve la misma idea en dos sitios,
con números que no cuadran entre sí porque miden cosas distintas.

**Propuesta.** Renombrar para que cada cosa se llame como es, y retirar el
duplicado:

- `scenarios` → **«Supuestos»** (que es como ya se llama su flag).
- pestaña 5 del planificador → **«Comparar planes»**.
- `goals` → se retira de *Cuentas y ahorro* dejando un aviso que lleva al
  planificador. La migración ya lleva tiempo en uso.

---

## 3. Qué se queda, qué se va, qué falta

### 3.1 Núcleo — intocable

Dashboard, Gastos e Ingresos, Préstamos, Nóminas, Cuentas y ahorro. Es la razón
de ser: sin esto no hay proyección.

### 3.2 Se queda, encendido

| Feature | Por qué |
|---|---|
| Contabilidad real | Es la única fuente de «lo que pasó de verdad». Sostiene la pregunta 3 |
| Objetivos financieros (planner) | Sostiene la pregunta 2. Recién terminado |
| Resumen ejecutivo | Cinco cifras arriba del todo; es lo que se mira a diario |
| Puntos críticos | Avisa de descubiertos antes de que pasen. Barato y de alto valor |
| Precisión de estimaciones | Es el bucle de mejora del modelo |

### 3.3 Se queda, pero apagado por defecto — correcto

Inflación, Fiscalidad, Márgenes de seguridad, Optimizador, Comparador de
frecuencias. Todas son de nicho y todas tienen sentido para quien las quiera.
El flag ya hace su trabajo; no hay que tocar nada salvo el enlace de §1.6.

### 3.4 Candidatas a retirar

| Qué | Por qué | Riesgo |
|---|---|---|
| `goals` en *Cuentas y ahorro* | Duplica los objetivos del planificador (§2) | Bajo: la migración ya copió los datos |
| Dropbox | Exige un token de developer que **caduca**. Firebase ya sincroniza y el export JSON ya respalda. El usuario decidió mantenerlo en julio, pero conviene revisitarlo ahora que la nube funciona | Medio: es decisión suya |
| `historialPrecios` por gasto | Cambia la cuantía proyectada en silencio, sin reflejarlo en el formulario. Ya estaba previsto retirarlo cuando Contabilidad lo sustituyera (B4) | Bajo |

### 3.5 Lo que falta — por valor descendente

**1 · Importar movimientos del banco (CSV / Norma 43).** Hoy **todo** se teclea
a mano. Es, con diferencia, la mayor fricción de la aplicación y lo que hace que
una herramienta así se abandone a los dos meses. Con Contabilidad ya construida,
falta la puerta de entrada.

**2 · Cierre de mes.** El bucle está a medias: se estima (Dashboard) y se
registra lo real (Contabilidad), pero no hay un momento en el que la aplicación
diga «en marzo estimaste 420 € de súper y fueron 511; ¿ajusto?». Es el enganche
plan-vs-real que `03-planner.md` deja explícitamente pendiente, y es lo que
convierte la aplicación en algo que aprende.

**3 · PWA.** No hay `manifest.webmanifest` ni service worker. Se usa en el móvil
y no se puede instalar ni abrir sin red. **SaldoSocialNFC, del mismo autor, ya
lo tiene resuelto**: se puede copiar el enfoque casi tal cual. Coste bajo,
beneficio diario.

**4 · Avisos con antelación.** «Próximos cargos» ya existe. Falta el paso
siguiente: «el 12 de marzo bajas de tu margen». El motor ya detecta los cruces
(`detectarCrucesMargenes`); falta subirlos a donde se vean.

**5 · Búsqueda global.** Con 14 apartados, encontrar «aquel gasto del seguro»
obliga a recordar en qué vista estaba.

---

## 4. Plan de acción

Ordenado por relación valor/coste. Los tres primeros son de esta tanda.

| # | Acción | Estado |
|---|---|---|
| 1 | Arreglar el saldo que no se reflejaba (§1.1) | ✅ hecho |
| 2 | Arreglar los desbordes de importes (§1.2, §1.3) | ✅ hecho |
| 3 | Banco de QA automatizado de las 14 vistas | ✅ hecho |
| 4 | Gatear el enlace a Márgenes (§1.6) | ✅ hecho |
| 5 | Corregir la documentación desfasada de las velas (§1.5) | ✅ hecho |
| 5b | Comprobador de sintaxis de JS legacy y CSS, en `verify` y en CI (§1.4) | ✅ hecho |
| 6 | Renombrar Escenarios → Supuestos y pestaña 5 → Comparar planes (§2) | ✅ hecho |
| 7 | Retirar `goals` de Cuentas dejando puente al planificador | ⬜ requiere decisión |
| 8 | PWA: manifest + service worker | ⬜ propuesto |
| 9 | Importar CSV de movimientos | ⬜ propuesto |
| 10 | Cierre de mes (plan vs real) | ⬜ propuesto |

Del 7 al 10 **no se ejecutan sin decisión del usuario**: el 7 borra una vista
que él ve todos los días, y del 8 al 10 son módulos nuevos, no retoques.
