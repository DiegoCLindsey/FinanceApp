# 07 — Datos, guardado y recálculo

> Por qué «recargo y vuelven datos antiguos», por qué las gráficas no se
> enteraban de nada, por qué el diálogo de conflicto salía siempre y el botón
> de guardado se quedaba en «…», y el desbloqueo con huella nuevo.
>
> Fecha: 2026-08-24, ampliado 2026-08-26.

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

## 2.4 El botón de guardado se quedaba en «…» aunque el guardado fuera bien

Reportado junto con lo anterior: *«Siempre uso el botón de guardar datos
manualmente que muestra el "guardado correctamente", sin embargo, sigue
apareciendo el "..." en el botón.»*

### La causa: el reseteo solo vivía en el `catch`

Los manejadores de `dm-fbx-save` y `dm-dbx-save` (`data-io/data-io.js`)
deshabilitaban el botón y lo ponían en `…` antes de subir la copia, y lo
devolvían a `Guardar ahora` — pero solo dentro del `catch`:

```js
try { await FirebaseService.uploadBackup(); UI.toast('Guardado en Firebase ✓'); }
catch (e) { UI.toast('Error: ' + e.message, 'err'); btn.disabled = false; btn.textContent = 'Guardar ahora'; }
```

En el camino feliz —que es el único que importa aquí, porque el usuario decía
ver el toast de «guardado correctamente»— nada volvía a tocar el botón. Se
quedaba deshabilitado y en `…` hasta la siguiente vez que se abriera el modal
y se regenerara desde cero.

**Arreglado**: el reseteo se movió a `finally`, así se ejecuta tanto si el
guardado sale bien como si falla:

```js
try { await FirebaseService.uploadBackup(); UI.toast('Guardado en Firebase ✓'); }
catch (e) { UI.toast('Error: ' + e.message, 'err'); }
finally { btn.disabled = false; btn.textContent = 'Guardar ahora'; }
```

Verificado en un navegador real con `FirebaseService.uploadBackup` mockeado
para resolver con retraso: se observaron los tres estados en orden (reposo →
`…`/deshabilitado → reposo/habilitado de nuevo), tanto para Firebase como para
Dropbox.

---

## 4. Desbloqueo con huella dactilar

> «Me gustaría implementar el guardado/cargado con huella dactilar en la PWA.
> Que pida la contraseña de guardado, la cifre con la huella y la pida para
> descifrar y guardar con la clave guardada. Si la huella no está habilitada o
> disponible, símplemente se pedirá la contraseña si aplica. (no pedir
> contraseña en los próximos X minutos)»

### El mecanismo: WebAuthn + la extensión PRF

`src/auth/biometria.ts` es el módulo nuevo. No inventa un segundo secreto: la
clave de cifrado de la nube ya se guarda en claro en la sesión persistida (ver
la nota larga en `auth/session.ts`) porque protege la copia **frente al
proveedor** (Firebase/Dropbox), no frente a quien tiene el dispositivo en la
mano — el localStorage ya expone todo lo demás igual. Lo que da la huella es
una forma más cómoda de volver a demostrar «soy yo» sin teclear la clave cada
vez, no un cambio de ese modelo de amenaza.

El mecanismo es una credencial WebAuthn de plataforma con la extensión `prf`:
tras verificar la huella (o Face ID, o Windows Hello — lo que dé el
autenticador), el navegador entrega 32 bytes deterministas ligados a esa
credencial y a una entrada fija (`salt`). Esos bytes, pasados por HKDF-SHA256,
son la clave AES-GCM que envuelve la passphrase. Sin la huella no hay forma de
volver a obtener esos bytes, así que sin ella no se descifra nada.

Registrar hace `navigator.credentials.create()` y, si el autenticador no
entrega los bytes PRF en ese mismo paso (algunos no lo hacen), un
`get()` inmediato de refuerzo con la misma entrada. Desbloquear siempre usa
`get()`.

### Dónde vive el secreto

Cuatro claves de localStorage nuevas, deliberadamente **fuera** del prefijo
`state_` que respalda `state/colecciones.ts`: `financeapp_bio_credencial`,
`financeapp_bio_secreto`, `financeapp_bio_ultimo_desbloqueo`,
`financeapp_bio_gracia_min`. Son secretos de este dispositivo, ligados a su
autenticador — meterlos en una copia de seguridad los llevaría a otro
dispositivo donde no sirven de nada.

### Activar la huella no reutiliza una passphrase a ciegas

El toggle de la sección "👆 Huella" del modal "Administrar datos" pide
confirmar la clave de cifrado actual antes de envolverla — no reutiliza en
silencio lo que hubiera en memoria. Para evitar que un despiste al escribirla
envuelva la clave equivocada (y rompa el desbloqueo más adelante sin ningún
aviso hasta mucho después), se comprueba contra la clave realmente activa con
un verificador nuevo y estrecho — `FirebaseService.esClaveActual(passphrase)` /
`DropboxService.esClaveActual(passphrase)` — que no expone la clave, solo dice
si coincide.

### Un bug real, encontrado probando el flujo completo en un navegador

`UI.openModal`/`closeModal` no llevan pila: hay un único contenedor de modal,
y abrir uno nuevo **sustituye** el contenido del anterior. El diálogo de
confirmación de clave (`_pedirPassphraseParaHuella`) abre su propio modal
sobre el mismo contenedor que "Administrar datos" — así que al terminar
(`UI.closeModal()`), lo que se cerraba era el modal entero, no solo el
diálogo de confirmación. El usuario volvía de golpe a la aplicación, sin ver
que el interruptor había quedado activado ni la fila de minutos de gracia.

Se encontró simulando el flujo real en Chromium sin cabecera (WebAuthn
mockeado, cifrado real): el toggle y la fila de gracia, releídos por
`document.getElementById` justo después de registrar la credencial, ya no
estaban en el documento — habían quedado en un `#modal-content` que el
segundo `openModal()` había reemplazado. **Arreglado** reabriendo
"Administrar datos" (`openDataModal()`) al terminar el flujo del interruptor,
en los tres desenlaces (cancelado, clave incorrecta, activado), para que
siempre se repinte desde el estado real en vez de tocar referencias sueltas.

### Gracia: se resuelve como una extensión de la sesión, no un mecanismo aparte

«No pedir contraseña en los próximos X minutos» se implementó como un gancho
inyectado en `auth/session.ts`: `caducada()` acepta una función
`graciaActiva()` y, mientras da `true`, la sesión nunca se da por caducada,
sin importar la inactividad. Como `caducada()` es el único sitio que decide
esto — tanto al recargar como en el vigilante de inactividad en segundo
plano— un solo gancho cubre los dos casos.

`dentroDeGracia()` exige que haya una credencial de huella registrada en este
dispositivo antes de conceder nada: sin eso, la gracia no significa nada — es
un beneficio de haber activado la huella, no un cambio de comportamiento de
serie para quien nunca la ha configurado. `marcarDesbloqueo()` se llama tanto
tras un desbloqueo con huella como tras uno manual con la clave tecleada a
mano, para que el mecanismo sea el mismo dé igual cómo se haya demostrado
«soy yo».

Los minutos de gracia son configurables (por defecto 5, `0` los apaga). Un
primer intento confundía «nunca se ha configurado nada» con «se guardó un 0
explícito», y devolvía el valor por defecto en los dos casos — deshaciendo en
silencio un apagado intencionado. Lo cazaron los propios tests nuevos.

### Verificación

- 20 tests nuevos en `tests/auth/biometria.test.ts` (round-trip criptográfico
  real con `crypto.subtle`, WebAuthn mockeado; ceremonia única y de dos pasos;
  credencial ajena que no descifra nada legible; `olvidar()`).
- 4 tests nuevos en `tests/auth/session.test.ts` para el gancho de gracia,
  incluido el vigilante de inactividad en segundo plano.
- Flujo completo en Chromium sin cabecera, en dos procesos separados: uno
  registra la huella desde el modal "Administrar datos" (con la clave
  correcta, y con una incorrecta para comprobar que se rechaza), el otro
  arranca ya con esa credencial guardada y comprueba que el botón "👆
  Desbloquear con huella" de la pantalla de acceso descifra exactamente la
  misma passphrase y completa el acceso — la prueba de que el envoltorio
  sobrevive de verdad entre sesiones del navegador, no solo dentro del mismo
  proceso de test.
- Capturas a 1400 px y a 390 px de viewport real (vía el envoltorio de
  `<iframe>` de `tools/qa/movil.html` — un `--window-size` sin cabecera no
  baja de 500 px, así que sin el iframe todo parece desbordar): la sección
  "Huella" del modal y el botón de la pantalla de acceso encajan en las dos
  anchuras.

---

## 5. Lo que sigue pendiente

- Una cuenta sigue teniendo **tres fuentes de verdad** para su saldo (`saldo`,
  `saldoInicial`@fecha, `historicoSaldos`). Es deuda conocida y exige migración.
- El estado sigue viviendo **por duplicado**: `State` legacy y el store nuevo,
  con puentes en las dos direcciones (`refrescarLegacy` y `datos.recargar`). Los
  dos fallos de este documento salen de esa duplicación. Se cierra al portar el
  modal de datos y el cuadro de mando.
