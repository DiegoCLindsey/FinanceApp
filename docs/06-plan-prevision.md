# 06 — Plan: que la aplicación ayude de verdad a prever los números

> Continuación de `05-revision-producto.md`. Aquel decía **qué** sobra y falta;
> éste responde a **cómo** y lo ejecuta.
>
> Fecha: 2026-08-23.

---

## 0. El diagnóstico en una frase

FinanceApp **proyecta muy bien y aprende muy mal**.

El motor de proyección es sólido: préstamos, nóminas, IRPF, inflación, fondos,
márgenes, objetivos que compiten por el flujo. Pero la calidad de una previsión
no depende del motor, depende de **los números que le metes**. Y ahí la
aplicación deja al usuario solo:

- Todo se teclea a mano, así que los datos reales entran tarde, mal o nunca.
- Cuando entran, nadie los confronta con lo que se había estimado.
- Las estimaciones envejecen sin que nadie avise.

El resultado es una proyección que parece precisa —seis decimales, gráficas
finas— construida sobre cifras que el usuario puso hace ocho meses a ojo.

**Todo lo que sigue ataca ese bucle**, no el motor.

```
   estimas  ──▶  vives  ──▶  registras  ──▶  comparas  ──▶  ajustas
      ▲                          │              │              │
      │                       (1) CSV       (2) cierre     (2) cierre
      └──────────────────────────────────────────────────────────┘
```

Hoy el bucle está roto en «registras» (fricción máxima) y en «comparas» (no
existe como momento).

---

## 1. Las cuatro propuestas del documento anterior

| # | Qué | Por qué | Estado |
|---|---|---|---|
| 1 | **PWA** | Se usa en el móvil; hoy no se instala ni abre sin red | ✅ |
| 2 | **Retirar `goals` de Cuentas** | Duplica los objetivos del planificador | ✅ |
| 3 | **Importar movimientos (CSV)** | Es la fricción que mata el hábito | ✅ |
| 4 | **Cierre de mes** | Cierra el bucle estimado → real → ajuste | ✅ |

### Lo que costó cada una

**PWA.** El service worker no precachea una lista de ficheros: el despliegue
versiona cada URL con `?v=<sha>` y una lista fija cachearía rutas que la
aplicación nunca pide. Las navegaciones van a la red primero — con «caché
primero» te quedarías viendo una versión vieja de una aplicación de finanzas
hasta la segunda recarga.

**Retirar `goals`.** Los datos no se tocan: la sección pasa a solo lectura, con
un puente al planificador y un botón para descartarla cuando el usuario quiera.

**Importar CSV.** El parser está aparte y con 46 tests porque es donde el dinero
se puede corromper. Dos decisiones quedaron fijadas en tests por ser ambiguas de
verdad: «10,999» se lee como millar (un separador con exactamente tres dígitos
detrás lo es en las dos convenciones) y el *Debe* es salida aunque venga sin
signo.

**Cierre de mes.** Un movimiento cuenta **como mucho para una** estimación. El
analizador de precisión mira una cada vez y le da igual solaparse, pero aquí
«Alquiler» y «Reforma» compartiendo la etiqueta `vivienda` hacían que el recibo
se contara dos veces y las filas dejaran de sumar el gasto real. En una pantalla
cuyo trabajo es cuadrar cifras, eso la invalida entera. Hay un test que exige que
filas + no previsto = gasto real.

---

## 2. Qué más quitaría

### 2.1 El «saldo actual» de las cuentas, como campo editable

Una cuenta tiene hoy **tres** fuentes de verdad para lo mismo: `saldo`,
`saldoInicial` @ `fechaInicialSaldo`, y `historicoSaldos`. De ahí salió el bug
que reportó el usuario —dos implementaciones que desempataban al revés— y de ahí
saldrán más.

Con el ledger de Contabilidad, el saldo real es **un punto de control más las
transacciones posteriores**. `saldo` sobra.

**No se toca todavía**: exige migración y el ledger aún convive con el legacy vía
`sincronizarConLegacy`. Anotado como deuda con nombre y apellidos.

### 2.2 `historialPrecios` por gasto

Ya estaba condenado (B4 del informe de redundancias): cambia la cuantía
proyectada **en silencio**. El cierre de mes hace lo mismo pero explícito y con
el usuario decidiendo. Se puede retirar en cuanto el cierre lleve un par de meses
en uso.

---

## 3. Qué más añadiría, por valor

### 3.1 Rango en vez de raya (lo más valioso que falta)

Hoy la proyección es **una línea**. Pero «tendré 24.312,87 € en marzo» es falso
con una precisión que no se tiene: el súper varía ±15 % y la app ya **sabe**
cuánto varía, porque el analizador de precisión mide la desviación histórica de
cada estimación.

La propuesta es usar esa desviación ya medida para pintar una **banda** alrededor
de la línea. No es Monte Carlo (que se eliminó con razón: pedía varianzas
inventadas por el usuario); es aritmética sobre datos observados.

Cambia la pregunta de «¿cuánto tendré?» a «¿cuánto puedo tener como poco?», que
es la que de verdad importa para decidir.

**Hecho** (`src/accounting/confianza.ts`, dibujada en «Evolución del saldo»).

#### Lo que costó: la banda no era el ruido, era la media

La primera versión sumaba solo el ruido mes a mes, que se acumula con **√meses**
porque los errores se compensan entre sí. Matemáticamente correcto, y en pantalla
**invisible**: a tres años vista salía ±1.800 € sobre un eje de 100.000 €, una
raya de cuatro píxeles.

Lo invisible era la pista de que faltaba un término. El ruido no es la mayor
incertidumbre de una proyección a tres años: la mayor es que **la media también
está estimada**. Con seis meses de datos, el gasto medio se conoce con un error
de σ/√6, y ese error **no se compensa**: si tu media real es 40 € más alta de lo
que crees, son 40 € más *todos* los meses. Se acumula linealmente.

```
ancho(m) = z · √( (σ·√m)²  +  (σ_deriva·m)² )
                  ruido        no conocer la media
```

Con los datos de QA el segundo término es 2,5 veces el primero a 36 meses. La
banda pasó de raya a envolvente, y la diferencia no es de presentación: la
versión anterior **prometía sobre el largo plazo una precisión que no se tiene**.

Dos detalles que se decidieron por el camino:

- σ y σ_deriva **no se redondean a céntimos**. No son importes, son parámetros
  que se multiplican por decenas de meses; medio céntimo de recorte ahí sí se
  nota en el resultado.
- Con σ = 0 —estimaciones que se desvían **siempre lo mismo**— no se pintan los
  dos conjuntos de datos, que serían dos rayas encima de la línea y dos entradas
  más en la leyenda. El rótulo lo explica y manda al cierre de mes, porque eso no
  es incertidumbre, es un sesgo, y un sesgo se arregla ajustando la estimación.

Y una lección de método: el fallo no lo encontró ningún test —todos pasaban, y
seguirían pasando con el modelo corto—, lo encontró **mirar la captura**. Lo
mismo que pasó con el doble conteo del cierre de mes.

### 3.2 Avisos con antelación

`detectarCrucesMargenes` ya calcula cuándo se cruza un umbral. Nadie lo enseña
hasta que abres la vista de márgenes. Debería estar arriba del dashboard:
«el 12 de marzo bajas de tu colchón». Coste bajo, el cálculo ya existe.

**Hecho** (`src/engine/avisos.ts`, tarjeta «Lo que viene» del dashboard).

#### Lo que costó: el cálculo existía, pero estaba roto

«El cálculo ya existe» resultó ser optimista. Al sembrar el QA con un margen
acotado a una cuenta y un gasto que la hunde, el aviso no salía. El motivo
estaba en `saldosPorCuentaEnExtracto`:

```js
running[ev.cuenta] += ev.cuantia;   // ← siempre suma
```

`cuantia` es la **magnitud** —un gasto de 950 € se emite como `950`, no como
`−950`— y el signo vive en `delta`, que pone `generarExtracto`. Sumando
`cuantia` a pelo, **el saldo de cada cuenta solo subía**, gastos incluidos, así
que un margen acotado a cuentas concretas **no saltaba nunca**. El margen global
sí funcionaba, porque ese usa `saldoAcum`, que sí viene con signo.

Arreglado en el motor y en el legacy a la vez, con un test de comportamiento
—no solo de paridad, que era verde con el bug en los dos lados—.

#### Tres reglas para que un aviso siga siendo un aviso

1. **Uno por causa.** Una proyección que va y viene del colchón produce un cruce
   por vaivén. Solo importa el primero.
2. **Horizonte según gravedad.** Números rojos se avisan a un año; el resto, a
   cuatro meses. Rozar el colchón dentro de diez meses está dentro del ruido, y
   avisar de eso enseña a ignorar los avisos.
3. **Lo que cabe en el margen de error no se afirma.** Aquí las dos
   funcionalidades se encuentran: si la banda de confianza (§3.1) a esa fecha es
   de ±2.000 € y la proyección se pasa del colchón por 300 €, el aviso dice
   «podrías bajar», no «bajas». El motor no depende de contabilidad: recibe una
   función y, sin ella, no matiza nada.

El colchón global se enchufa al mismo mecanismo envolviéndolo como un margen más
(`colchonComoMargen`), en vez de aproximarlo por su valor de hoy: tiene
waypoints igual que un margen y `detectarCrucesMargenes` ya los resuelve fecha a
fecha. Hay un test que exige que el objetivo resultante coincida con
`calcColchonEnFecha` en varias fechas y configuraciones.

### 3.3 Deshacer

Borrar un gasto, una cuenta o una transacción es inmediato e irreversible. En una
aplicación cuyo valor es la confianza en sus datos, la falta de deshacer hace que
el usuario dude antes de tocar nada. Un historial de una sola posición
(«Deshecho» en el aviso flotante) cubre el 90 % de los sustos.

**Hecho** (`src/state/deshacer.ts` + `src/ui/deshacer.ts`).

#### Dónde engancharlo

En `store.removeItem`, no en cada pantalla. Es el **embudo por el que pasan todos
los borrados** de la aplicación: engancharlo en un sitio da deshacer en los doce,
y ninguna pantalla futura puede olvidarse de conectarlo. El aviso se pinta
suscribiéndose al store, así que tampoco hay que llamarlo desde ningún sitio.

Tres detalles que se decidieron mirando qué pasa cuando falla:

- **Se reinserta donde estaba**, no al final; y el índice se acota al tamaño
  actual, porque entre el borrado y el deshacer la lista puede haber cambiado.
- **Borrar algo que no existe no registra nada.** Si no, un borrado fallido
  tapaba el deshacer del anterior, que sí era de verdad.
- **Deshacer recarga el `State` legacy antes de repintar.** El legacy es una
  copia aparte del estado: solo repintar dejaba el cuadro de mando enseñando el
  dato viejo. Es exactamente lo que ya hacía `refrescarLegacy` tras cada guardado.

Y una decisión de producto: el deshacer **caduca** (15 s, el tiempo del aviso).
Uno que sigue vivo media hora después es una trampa —para entonces el usuario ha
tocado otras cosas y devolver la fila a su sitio sorprende más que ayuda—.

### 3.4 Búsqueda global

Con doce apartados, encontrar «aquel recibo del seguro» obliga a recordar en qué
vista estaba. Es pedirle al usuario que se sepa la arquitectura de la aplicación
para poder usarla.

**Hecho** (`src/app/buscar.ts` + `src/ui/buscador.ts`, Ctrl/⌘+K o la lupa de la
barra superior).

Busca a la vez en gastos, ingresos, cuentas, préstamos, nóminas, supuestos,
planes, objetivos —incluidos los de dentro de cada plan, que es lo que el usuario
tiene en la cabeza— y movimientos importados, y lleva a la vista donde vive lo
encontrado.

Tres decisiones que cambian lo útil que resulta:

- **Ordena por DÓNDE empieza la coincidencia, no por cuánta hay.** Buscando
  «seg»: primero «Seguro coche» (empieza el nombre), luego «Préstamo segundo»
  (empieza una palabra), luego «Riesgo segmentado» (a mitad de palabra). A
  igualdad manda el más corto, que es el más específico.
- **Se normalizan las tildes.** Nadie escribe «Nómina» con tilde cuando busca.
- **Lo que vive en una vista apagada por un flag no se ofrece**, porque llevaría
  a una pantalla que no existe.

Y dos detalles: con menos de dos letras no lista nada —coincidiría medio catálogo
y la lista dejaría de ayudar— y los nombres se pintan con `textContent`, que los
escribe el usuario.

---

## 4. Qué mejoraría de lo que ya hay

| Qué | Problema | Cómo |
|---|---|---|
| **Dashboard** | Enseña una cifra puntual sin decir de qué se fía | Marcar visualmente hasta dónde llega el dato real y desde dónde es proyección |
| **Precisión de estimaciones** | Está enterrada dentro de Contabilidad; es reactiva | Es el corazón del bucle: debe empujar desde el cierre de mes (§1.4) |
| **Etiquetas** | `tagCategorias` y `tagGrupos` son dos mecanismos para agrupar, configurados en sitios distintos | Unificar en un concepto (ya aprobado como B3) |
| **Onboarding** | Pide muchos datos antes de enseñar nada | Arrancar con una cuenta y una nómina, y enseñar la curva ya |

---

## 5. Orden de ejecución

Primero lo que arregla el bucle, después lo que lo aprovecha.

1. **PWA** — independiente, quita fricción de acceso. ✅
2. **Retirar `goals`** — deja de haber dos «objetivos». ✅
3. **Importar CSV** — arregla «registras». ✅
4. **Cierre de mes** — arregla «comparas» y «ajustas». ✅
5. **Banda de confianza** (§3.1) — necesita 3 y 4 en uso. ✅
6. **Avisos con antelación** (§3.2). ✅
7. **Deshacer** (§3.3). ✅
8. **Búsqueda global** (§3.4). ✅

El plan queda ejecutado entero. Lo que sigue pendiente son las **deudas** de la
§2 —las tres fuentes de verdad del saldo de una cuenta y `historialPrecios`—, que
no son funcionalidades sino migraciones, y las mejoras de la §4 que siguen sin
tocar: unificar `tagCategorias` con `tagGrupos` y rebajar el onboarding.

La banda gana valor sola con el tiempo: hoy se mide sobre seis meses, y cada
cierre de mes que se hace la estrecha, porque σ_deriva baja con √n. Es la primera
funcionalidad de la aplicación que **mejora por usarla**.
