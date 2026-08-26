# 07 — Datos, guardado y recálculo

> Por qué «recargo y vuelven datos antiguos», por qué las gráficas no se
> enteraban de nada, y qué se ha hecho con las dos cosas.
>
> Fecha: 2026-08-24.

---

## 1. El síntoma y las dos causas

> «Añado y quito filas y durante la sesión se mantiene, pero a veces al recargar
> se traen datos antiguos. He estado pulsando el botón de guardar y nada.»

No era un fallo, eran **dos**, y ninguno estaba donde parecía.

### 1.1 La copia de seguridad estaba incompleta

Las cuatro rutas de copia —exportar a JSON, importar de JSON, subir a Firebase y
subir a Dropbox— llevaban **cada una su propia lista de colecciones escrita a
mano**. Las cuatro se habían quedado atrás:

| | ¿Se guardaba? |
|---|---|
| `planes` (planificador de objetivos financieros) | ❌ nunca |
| `transacciones` (contabilidad real, importación CSV) | ❌ nunca |
| `puntosControl` | ❌ nunca |
| `history` | pedida en las cuatro; no existe desde hace versiones |

O sea que el planificador entero y toda la contabilidad **no estaban en ninguna
copia de seguridad**. Pulsar «guardar» las subía sin ellas.

**Arreglado**: `src/state/colecciones.ts` deriva la lista **del esquema**, y las
cuatro rutas la consumen. Añadir una colección al esquema ya no exige acordarse
de tocar cuatro ficheros legacy que nadie mira.

Además la copia se lee ahora **del almacenamiento**, no de `State.get(...)`.
`State` es una copia en memoria que puede ir por detrás de lo que hay en disco;
localStorage es lo único que escriben los dos mundos.

### 1.2 El store se quedaba con los datos de antes de restaurar

Este es el que producía literalmente el síntoma descrito.

```
carga la página ──▶ el store lee localStorage        (datos de la sesión anterior)
       │
   entras y se restaura la copia de la nube ──▶ localStorage cambia
       │                                        `State` legacy sí se relee
       │                                        el store NO
       ▼
   tocas cualquier cosa desde una vista nueva
       └─▶ el store reescribe SU copia, la de antes de restaurar
           = los datos antiguos vuelven
```

El store se carga cuando arranca la página; la restauración desde la nube y el
import de un fichero pasan **después**. Nadie le decía que releyera, así que su
copia en memoria seguía siendo la vieja y la primera escritura la devolvía al
almacenamiento.

**Arreglado**: `FinanceApp.datos.aplicar()` vuelca la copia **y recarga el
store**. Lo usan la restauración desde la nube (`auth.js`) y el import
(`data-io.js`). De regalo, una copia con esquema viejo pasa ahora por las
migraciones en vez de quedarse a medias.

---

## 2. Una señal, dos interesados

Las gráficas no se actualizaban solas y había que darle a «Actualizar». Las dos
salidas fáciles eran malas: recalcular en cada navegación (el cuadro de mando
proyecta el extracto entero y monta ocho gráficas) o dejarlo como estaba.

`src/state/cambios.ts` es la señal común: **un contador de revisión que solo
sube**, alimentado desde `store.subscribe` — o sea, desde toda escritura, igual
que el deshacer. Cada interesado se queda con su **marca de agua**.

### Por qué un contador y no un booleano

Porque los dos interesados **se limpian en momentos distintos**:

- las gráficas dejan de estar sucias cuando **se repintan**;
- los datos dejan de estar sin guardar cuando **se suben**.

Con un `sucio = true` compartido, repintar el cuadro de mando borraría el aviso
de «sin guardar» y el usuario se iría convencido de haber guardado. Con marcas de
agua independientes sobre una única fuente, no puede pasar.

### 2.1 Recálculo perezoso

El router llama a `DashboardModule.abrir()`, que compara la marca: si nada ha
cambiado desde el último pintado, no toca nada; si algo cambió, relee `State` y
recalcula. **El trabajo se hace cuando se va a ver, no cuando se produce el
cambio.**

`render()` sigue siendo incondicional a propósito: lo llaman los controles del
propio cuadro de mando (filtros, pestañas, plegados) y ahí el efecto tiene que
verse en el momento.

Un detalle que solo apareció midiendo: marcar «al día» dentro del temporizador
que difiere el pintado de las gráficas dejaba una ventana de 60 ms en la que dos
navegaciones seguidas recalculaban **dos veces**. Se marca al terminar la parte
síncrona, cuando los cálculos ya están hechos y solo queda pintar.

### 2.2 Aviso de cambios sin guardar

```
sin cambios ──cambia algo──▶ «Tienes cambios sin guardar»
                               │            │
                       «Ocultar»│            │«Guardar ahora» / el temporizador
                               ▼            ▼
                           oculto      «Subiendo…» ──▶ «¡Guardado!» ──▶ se cierra
```

- **Ocultar no es guardar.** Se esconde, pero si más tarde entra otro cambio
  vuelve a aparecer.
- **Se confirma la revisión que se subió**, no la de cuando terminó la subida.
  Un cambio hecho mientras la copia volaba sigue contando como pendiente en
  cuanto acaba, en vez de darse por guardado.
- **Una subida a la vez.** Si el temporizador salta con el botón ya pulsado, se
  engancha a la que hay en vuelo.
- **Sin destino de copia configurado no se avisa**: no habría nada que subir.

El temporizador de autoguardado pasa por el mismo aviso, así que enseña el mismo
«Subiendo… → ¡Guardado!» que el botón.

---

## 2.3 El diálogo de conflicto aparecía siempre, incluso con el local vacío

Reportado después de lo anterior: *«Al iniciar sesión (siempre) dice que hay
una versión local y la de la nube (la local sin datos y la de la nube con
datos). Debe checkear bien si de verdad la versión local no es vacía/cuenta
por defecto.»*

### La causa: dos números de versión compartiendo una sola clave

`common/state.js` (legacy) y `src/state/store.ts` (nuevo) escriben la MISMA
clave física de localStorage para «versión del esquema» —
`financeapp_state__schemaVersion`— pero cada uno con **su propio número**:
legacy usa `4`, el store nuevo usa `8`.

El bundle nuevo carga y arranca **antes** que los scripts legacy (`<script>`
clásico y bloqueante, antes en `index.html`), así que en cada carga de página:

```
1. El store nuevo lee la clave. Si no vale 8, "migra" y la deja en 8.
   Al migrar, RE-PERSISTE todas sus colecciones -> resella
   `state__modificadoEn` a "ahora mismo", tenga o no datos reales.

2. Más tarde, `State.load()` (legacy) lee la MISMA clave. Como ya no vale 4
   (el paso 1 la dejó en 8), legacy cree que TAMBIÉN tiene que migrar.
   Migra (sin dañar nada: sus migraciones son idempotentes) y al final
   escribe la clave... con SU número: la deja en 4 otra vez.

3. Siguiente carga de página: la clave vuelve a valer 4, así que el store
   nuevo vuelve a pensar que tiene que migrar. Vuelta al paso 1.
```

Un ping-pong infinito. Consecuencia real: **`state__modificadoEn` se resella
a «ahora» en cada carga de página**, haya cambiado algo o no. Eso hace que el
sello local parezca siempre más reciente que el de la nube, así que
`_sincronizarDesdeNube` nunca toma el atajo «el local no se ha tocado desde
esta copia» y siempre pregunta — incluso en un dispositivo recién estrenado
cuyo único «cambio» es el propio arranque persistiendo el estado de fábrica.

**Arreglado**: si `window.FinanceApp` existe, `common/state.js` ya no migra ni
toca esa clave — se fía por completo del store nuevo, cuya migración 005
(`src/state/migrations/005-normalize.ts`) hace todo lo que hacía la rama
legacy y más. La rama legacy se conserva solo como red de seguridad para
cuando el bundle nuevo no ha podido cargar.

Verificado en un navegador real, no solo deducido: con el fix, la clave de
versión y el sello se quedan estables tras releer dos y tres veces seguidas;
revirtiendo el fix (con `git stash`) el mismo test reproduce el ping-pong
exacto que se describe arriba.

### La comprobación defensiva que se pidió, además de la causa

Aunque el ping-pong es la causa raíz, se añadió igualmente lo que se pidió
explícitamente: no preguntar si el local **de verdad** no tiene datos.
`src/state/colecciones.ts` exporta `esEstadoVacioOPorDefecto()`, que mira el
**contenido** de cada colección (no un sello de tiempo) y solo confía en el
sello para lo que el sello sí sabe: cuándo se escribió.

El primer intento de esta función fallaba con datos reales, y de una forma
instructiva: **cada instalación nueva arranca con un plan `plan_base`** (la
migración 008 crea un vehículo por cuenta y cero objetivos, tenga el usuario
datos o no), así que «`planes` debe estar vacía» no era cierto NUNCA en la
práctica — la comprobación no habría disparado jamás en el caso exacto que
existe para cubrir: un dispositivo recién estrenado. Se encontró probando
contra un `localStorage` limpio de verdad en un navegador real, no contra
datos de prueba fabricados a mano — los tests con fixtures a mano habían
pasado igual, porque nadie había escrito a mano un plan de fábrica en el
fixture. Ahora `planes` se compara contra la forma exacta que deja la
migración (un `plan_base` sin objetivos), no solo contra «vacía».

---

## 3. Lo que sigue pendiente

- Una cuenta sigue teniendo **tres fuentes de verdad** para su saldo (`saldo`,
  `saldoInicial`@fecha, `historicoSaldos`). Es deuda conocida y exige migración.
- El estado sigue viviendo **por duplicado**: `State` legacy y el store nuevo,
  con puentes en las dos direcciones (`refrescarLegacy` y `datos.recargar`). Los
  dos fallos de este documento salen de esa duplicación. Se cierra al portar el
  modal de datos y el cuadro de mando.
