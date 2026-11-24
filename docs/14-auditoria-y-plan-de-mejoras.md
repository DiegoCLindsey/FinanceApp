# 14 — Auditoría completa y plan de mejoras

> Fecha: 2026-11-16 · Base: `main` en `5e7c405` (esquema v10).
> Cubre: fallos de código e interfaz, seguridad, mejoras de lo que ya existe,
> funcionalidades nuevas y UI/UX componente a componente.
> Está escrito para que **un agente pueda coger una tarea por su ID y ejecutarla
> sin más contexto**.

---

## 0. Cómo usar este documento

### 0.1 Formato de las tareas

Cada tarea tiene un ID estable (`BUG-`, `SEC-`, `UX-`, `MEJ-`, `NEW-`, `TEC-`),
y estos campos:

| Campo | Significado |
|---|---|
| **Prioridad** | `P0` pierde o corrompe datos · `P1` rompe un flujo o expone datos · `P2` molesta o degrada · `P3` pulido |
| **Esfuerzo** | `S` < medio día · `M` 1–2 días · `L` más de 2 días o toca arquitectura |
| **Evidencia** | `✔ reproducido` (en navegador o con un test) · `◐ por lectura` (el código lo muestra, no se ha ejecutado) · `? contrastar` (hay que comprobar un dato externo antes de tocar) |
| **Ficheros** | Dónde está el problema, con línea cuando es estable |
| **Hecho cuando** | Criterios de aceptación comprobables |

Para marcar una tarea como hecha, cambia su `[ ]` por `[x]` en el mismo commit
que la resuelve.

### 0.2 Reglas para quien implemente

1. `npm run verify` en verde antes de cada commit (typecheck, lint, estáticos,
   prettier, tests). La suite actual son **1077 tests en 58 ficheros, todos en
   verde**.
2. Si tocas `src/`, ejecuta `npm run build` y añade `assets/financeapp-core.js`
   al commit: el bundle **sí** está versionado y CI lo compara (job «Bundle al
   día»).
3. Todo fallo de la sección 3 se arregla **con un test que falle antes del
   arreglo**. En varios se indica cuál.
4. Los cálculos tienen tests de paridad con el legacy (`tests/core/parity.test.ts`).
   Si un cambio altera un resultado numérico a propósito (p. ej. `BUG-21`), hay
   que actualizar el test y decirlo en el commit.
5. No añadas dependencias de ejecución sin necesidad: la aplicación se sirve
   como estáticos en GitHub Pages y no tiene backend.
6. Texto de interfaz en español de España, tuteando, sin jerga técnica.
7. Las tareas marcadas **«requiere decisión»** no se empiezan sin que el
   propietario lo confirme: retiran o reintroducen algo que él decidió.

### 0.3 Orden recomendado

Ver la hoja de ruta de la sección 9. En corto: primero `BUG-25` y `BUG-01` a `BUG-06`
(pérdida de datos), después seguridad `SEC-01`, `SEC-04`, `SEC-07`, después la
cabecera móvil (`UX-01`) y el orden del cuadro de mando (`UX-12`).

---

## 1. Para quién es la aplicación

De `docs/05-revision-producto.md`, que sigue vigente: **una persona, en su móvil
y en su portátil**, residente fiscal en España, que quiere responder a tres
preguntas:

1. ¿Cuánto dinero voy a tener dentro de N meses?
2. ¿Puedo permitirme *esto*?
3. ¿Voy por donde dije que iría?

De ahí salen los criterios con los que se ha priorizado todo lo de abajo:

- **Los datos no se pueden perder ni mezclar.** Usa dos dispositivos, así que la
  sincronización es el punto más delicado, no un extra.
- **El móvil es de consulta y captura rápida; el portátil, de configuración.**
  Lo que se mira a diario tiene que caber en la primera pantalla del móvil.
- **No es contable.** Quiere teclear lo mínimo: importar del banco y que la
  aplicación aprenda.
- **La confianza en el número es el producto.** Un neto de nómina 80 € fuera de
  la realidad invalida la proyección entera.
- Puede convivir con otra persona (existe «Personas»), pero no es una
  aplicación colaborativa.

Queda fuera, a propósito: agregación bancaria PSD2, multimoneda, inversión
avanzada, y todo lo que exija un servidor propio.

---

## 2. Resumen

### 2.1 Método

- Lectura del código servido: `index.html`, todo el legacy (`auth/`, `common/`,
  `data-io/`, `firebase/`, `router/`, `ui/`, `onboarding/`, `sw.js`), el núcleo
  de `src/` (estado, migraciones, proyectos, sesión, biometría, flags, guardado,
  importación CSV, IRPF y nóminas) y de forma dirigida `dashboard/dashboard.js`
  y las vistas de `src/features/`.
- Ejecución real en Chromium sin cabecera, zona horaria `Europe/Madrid`:
  escritorio 1400×900 y iPhone 13 (390×664). Recorrido completo del alta
  (acceso → bienvenida → asistente → vistas), y un segundo recorrido con datos
  sembrados (3 cuentas, 8 estimaciones, 2 préstamos, 1 nómina, 40 movimientos)
  midiendo desbordes, dianas táctiles y foco.
- Tests desechables sobre el código real para confirmar tres hallazgos
  (migración 010, duplicados del CSV, IRPF).
- **No se ha podido probar** contra Firebase ni Dropbox reales (sin
  credenciales): todo lo de la nube es `◐ por lectura`.

### 2.2 Lo más importante

| # | Hallazgo | Tarea |
|---|---|---|
| 0 | **Cada elemento creado desde un formulario se guarda tantas veces como modales se hayan abierto desde la última recarga** (el 4.º gasto se crea 4 veces; tras cancelar 5 formularios, 10). Afecta a gastos, préstamos, amortizaciones, nóminas, cuentas y márgenes | `BUG-25` |
| 1 | Lo que se introduce en el asistente inicial **se borra** al crear el primer gasto desde la vista de Gastos. El legacy y el paquete nuevo guardan cada uno su copia en memoria y se pisan | `BUG-01` |
| 2 | Con autoguardado, un dispositivo que se queda abierto **sobrescribe la nube cada 15 min con datos viejos**; el otro dispositivo, al abrir, restaura esa copia vieja sin preguntar | `BUG-03` |
| 3 | Teclear mal la clave de cifrado al desbloquear **sobrescribe la lista de proyectos** de la nube con una copia ilegible | `BUG-04` |
| 4 | La migración 010 no llega a limpiar nada: los gastos que solo existían dentro de un «supuesto» **pasan a contar como reales** | `BUG-06` |
| 5 | El cuadro de mando no escapa ningún texto del usuario. Un backup manipulado ejecuta código y puede leer la clave de cifrado, que está en claro en `localStorage` | `SEC-01`, `SEC-03` |
| 6 | La copia en Firebase es un único documento sin comprimir: dejará de poder subirse al pasar de ~1 MiB (unos 3.500–4.000 movimientos) | `BUG-05` |
| 7 | En móvil la cabecera fija ocupa **251 de 664 px (38 %)** en todas las vistas, y lo que responde a las tres preguntas está al final del cuadro de mando | `UX-01`, `UX-12` |
| 8 | El neto de nómina calculado se desvía del real: no aplica el mínimo personal y reparte la Seguridad Social entre 14 pagas | `BUG-21` |

### 2.3 Recuento

| Sección | Tareas | P0 | P1 | P2 | P3 |
|---|---:|---:|---:|---:|---:|
| 3 · Fallos | 28 | 8 | 10 | 9 | 1 |
| 4 · Seguridad | 11 | 0 | 5 | 5 | 1 |
| 5 · UI/UX | 29 | 0 | 7 | 16 | 6 |
| 6 · Mejoras de lo existente | 12 | — | — | — | — |
| 7 · Funcionalidades nuevas | 8 | — | — | — | — |
| 8 · Técnica y documentación | 8 | — | — | — | — |

---

## 3. Fallos

### 3.1 Pérdida o corrupción de datos (P0)

#### [x] BUG-01 · Dos copias del estado en memoria que se pisan

- **Prioridad** P0 · **Esfuerzo** M · **Evidencia** ✔ reproducido
- **Ficheros** `common/state.js` (todo), `src/main.ts:350` (`refrescarLegacy`),
  y todos los puntos que escriben por `State.*`:
  `onboarding/onboarding.js:71-97`, `dashboard/dashboard.js:453-457, 465, 2117-2185`,
  `data-io/data-io.js:113-120, 181, 219`, `auth/auth.js:1000`, `index.html:610`.
- **Problema.** `State` (legacy) y `store` (`src/state/store.ts`) leen y
  escriben las mismas claves de `localStorage`, pero cada uno mantiene su copia
  en memoria. El puente solo va en un sentido: cuando escribe una vista nueva se
  llama a `State.load()`. Cuando escribe el legacy, **nadie avisa al store**, y
  su siguiente escritura sobre esa colección devuelve al almacenamiento la copia
  vieja.
- **Reproducción** (hecha): acceso local → «Empezar desde cero» → asistente con
  saldo 5000, ingreso «Nómina», gasto «Alquiler» → abrir *Gastos e Ingresos*:
  **lista vacía** → «+ Nuevo» «Luz» → `financeapp_state_expenses` contiene solo
  `["Luz"]`. Lo mismo ocurre con el saldo inicial al tocar cualquier cuenta.
- **Otros síntomas de la misma causa**
  - «Quitar simulaciones» (`limpiarSimulaciones`) borra por `State`; la
    siguiente edición desde una vista nueva las resucita.
  - Los ajustes que guarda el legacy en `config` (autoguardado, cierre por
    inactividad, `onboardingDone`, paneles plegados, filtros de etiquetas) se
    pierden cuando el store escribe `config` (al cambiar un flag o el periodo),
    y al revés.
- **Solución.** Que haya una sola copia. Convertir `State` en una fachada del
  store cuando `window.FinanceApp` existe:
  - `State.get(k)` → `FinanceApp.store.get(k)`; `State.set(k, v)` →
    `store.set(k, v)`; `addItem/updateItem/removeItem` → los del store (así
    además ganan «Deshacer»); `State.load()` → no hace nada salvo
    `ensureDefaultAccount`.
  - Las claves que el esquema ya no tiene (`goals`, `escenarios`) devuelven `[]`.
  - Conservar la implementación actual solo como reserva si el bundle no cargó.
  - Con esto `refrescarLegacy` se reduce a repintar el cuadro de mando.
- **Hecho cuando**
  - Test nuevo (happy-dom, cargando `common/state.js` con un store real):
    `State.addItem('expenses', …)` seguido de `store.addItem('expenses', …)`
    deja los dos elementos en el almacenamiento.
  - El recorrido del asistente de arriba termina con 3 filas en Gastos.
  - `State.set('config', …)` seguido de `store.patchConfig(…)` conserva ambos
    cambios.

#### [x] BUG-25 · Cada formulario guarda tantas veces como modales se hayan abierto en la sesión

- **Prioridad** P0 · **Esfuerzo** S · **Evidencia** ✔ reproducido
- **Ficheros** `src/features/accounting/dom.ts:57-69` (`onClick`, `onChange`) y
  todos los que cablean sobre `#modal-content`:
  `src/features/expenses/index.ts:326-342`,
  `src/features/loans/index.ts:246-253, 263, 269, 330`,
  `src/features/salaries/index.ts:224, 243, 271`, `src/features/salaries/tramos.ts`,
  `src/features/accounts/index.ts:303, 323, 361-389`,
  `src/features/accounts/tramos-ganancias.ts`, `src/features/margins/index.ts:234-250`.
- **Problema.** `#modal-content` es **un único elemento que vive toda la
  sesión**. Cada vez que se abre un formulario se le cambia el `innerHTML` y se
  le añaden listeners delegados nuevos con `onClick(content, '[data-guardar]', …)`,
  pero los anteriores **nunca se quitan** (cambiar `innerHTML` no elimina los
  listeners del propio contenedor). Al pulsar «Guardar» se ejecutan todos los
  acumulados, y cada uno hace su `store.addItem`.
  Las vistas sí se protegen de esto (`container.dataset.wired`); los modales no.
- **Reproducción** (hecha, en Gastos, sin recargar):

  | Acción | Resultado |
  |---|---|
  | 1.er gasto | 1 copia |
  | 2.º gasto | 2 copias |
  | 3.er gasto | 3 copias |
  | 4.º gasto | 4 copias |
  | abrir y **cancelar** 5 veces, luego crear uno | **10 copias** |

  Cuenta cualquier apertura, también editar, duplicar y cancelar: de ahí las
  «decenas» tras un rato de uso. Recargar la página pone el contador a cero,
  por eso parece aleatorio.
- **Alcance.** Todo lo que se crea desde un modal: gastos e ingresos, préstamos,
  amortizaciones, nóminas, aportaciones a pensiones, cuentas, puntos del
  histórico de saldo, márgenes, y años y tramos de las tablas fiscales. Al
  **editar**, el mismo cambio se aplica N veces (sin daño visible, salvo los
  avisos repetidos). «Cancelar» y los `change` también se disparan N veces.
- **Solución.**
  1. Un único punto de apertura de modal en `src/` (`abrirModal(titulo, html)`
     compartido, hoy copiado en cuatro ficheros) que **entregue un contenedor
     limpio en cada apertura**: crear un `AbortController` por apertura, pasar
     su `signal` a `onClick`/`onChange` (tercer argumento de
     `addEventListener`) y abortar el anterior al abrir o cerrar.
  2. `onClick`/`onChange` aceptan `{ signal }` opcional.
  3. Deshabilitar «Guardar» al primer clic hasta que termine, como segunda
     barrera contra el doble toque.
  4. Queda absorbido por el componente de diálogo de `UX-03`, pero **no esperar
     a él**: este arreglo es de medio día.
- **Limpieza de lo ya duplicado** *(requiere decisión)*. Ofrecer en
  «Administrar datos» una acción «Buscar duplicados»: agrupa elementos idénticos
  en todo salvo `_id` creados en el mismo segundo (el `_id` empieza por la marca
  de tiempo en base 36) y deja elegir cuáles borrar, con copia previa. No
  borrar nada automáticamente.
- **Hecho cuando**
  - Test (happy-dom): abrir y cancelar el formulario de gasto 5 veces, crear
    uno → `store.get('expenses').length === 1`. El mismo test para préstamo,
    amortización, nómina, cuenta y margen.
  - Test: tras 3 aperturas, editar un gasto llama a `updateItem` una vez.

#### [x] BUG-26 · El paquete nuevo no veía los módulos antiguos

- **Prioridad** P0 · **Esfuerzo** S · **Evidencia** ✔ reproducido (encontrado al arreglar `BUG-01`)
- **Ficheros** final de `common/state.js`, `common/storage.js`, `ui/ui.js`,
  `dashboard/dashboard.js`, `data-io/data-io.js`, `auth/auth.js`,
  `firebase/firebase-service.js`, `onboarding/onboarding.js`, `index.html`
- **Problema.** Los módulos legacy se declaran con `const` en el ámbito global,
  y eso **no** crea propiedad en `window`. El bundle los busca con
  `globalThis.UI`, `globalThis.State`, `globalThis.FirebaseService`… y recibía
  `undefined` para todos menos `Router` (el único que se publicaba a mano).
  En silencio:
  - los avisos («Creado», «Actualizado», errores de validación) de las vistas
    nuevas no se mostraban;
  - el aviso «Tienes cambios sin guardar» no aparecía nunca;
  - **el autoguardado no subía nada**: encontraba el aviso, este no encontraba
    destino y fallaba sin decirlo;
  - la lista de proyectos no se subía al crear o renombrar uno;
  - el cierre por inactividad leía una configuración atrasada.
- **Solución aplicada.** Cada módulo legacy se publica en `globalThis` al final
  de su fichero. Como el autoguardado vuelve a funcionar, ahora solo sube si hay
  cambios pendientes (primera parte de `BUG-03`).

#### [x] BUG-02 · El cuadro de mando sale vacío al terminar el asistente

- **Prioridad** P0 (es la primera impresión) · **Esfuerzo** S · **Evidencia** ✔ reproducido
- **Ficheros** `dashboard/dashboard.js:498` (`abrir`), `onboarding/onboarding.js:95-100`
- **Problema.** Tras el asistente, con 5.000 € de saldo, el cuadro de mando
  muestra «saldo 0,00 €» y la gráfica plana. `abrir()` decide si recalcula
  mirando el registro de cambios (`FinanceApp.cambios`), y las escrituras del
  legacy no lo marcan.
- **Solución.** Queda resuelto por `BUG-01` (toda escritura pasa por el store y
  marca cambios). Además, `finish()` debe llamar a `PeriodBar.init()` para que
  la barra refleje el saldo recién introducido.
- **Hecho cuando** al terminar el asistente, el saldo de la barra y la gráfica
  muestran el saldo introducido sin pulsar «Actualizar».

#### [x] BUG-03 · La sincronización puede destruir cambios sin avisar

- **Prioridad** P0 · **Esfuerzo** L · **Evidencia** ◐ por lectura
- **Ficheros** `data-io/data-io.js:154-171` (temporizador),
  `auth/auth.js:472-522` (`_sincronizarDesdeNube`),
  `firebase/firebase-service.js:316-346` (`uploadBackup`), `src/ui/guardado.ts`.
- **Problema.** Tres defectos que se encadenan:
  1. El temporizador de autoguardado llama a `guardarAhora()` **siempre**, haya
     o no cambios (`data-io.js:160-166`).
  2. `uploadBackup()` escribe sin mirar si la copia remota ha cambiado desde la
     última vez que este dispositivo la vio.
  3. Al arrancar, `fechaLocal <= fechaNube` se interpreta como «el local no se
     ha tocado» y se vuelca la nube encima **sin preguntar** (`auth.js:488`).
     Compara además el reloj del dispositivo con el del servidor.
- **Escenario.** Portátil abierto con autoguardado. En el móvil se añaden gastos
  a las 12:00 y se suben. A las 12:10 el portátil, que no ha cambiado nada, sube
  su copia de las 9:00. Al abrir el móvil por la tarde: su sello local (12:00)
  es anterior al de la nube (12:10) → se restaura la copia de las 9:00. Los
  gastos del mediodía han desaparecido de los dos sitios.
- **Efecto secundario molesto.** Con el autoguardado apagado (valor de fábrica),
  cualquier edición sin subir hace que la siguiente recarga pregunte «Hay dos
  versiones de tus datos», aunque la nube sea simplemente la versión anterior de
  este mismo dispositivo.
- **Solución.**
  1. Autoguardado: salir si la marca de agua de `guardado` no está pendiente.
     Exponer `Guardado.hayPendiente()` y usarlo en el temporizador.
  2. Guardar, por proyecto, la **versión base**: el `updatedAt` (o un contador
     `rev` propio dentro del documento) de la copia remota que este dispositivo
     bajó o subió por última vez (`state__baseNube`, sin mover el sello).
  3. Antes de subir: leer solo los metadatos remotos. Si `rev` remoto ≠ base →
     no subir; abrir el diálogo de conflicto. En Firestore, hacerlo dentro de
     una transacción para que no haya carrera.
  4. Al arrancar, decidir con la base, no con relojes:

     | Remoto respecto a la base | Local modificado | Acción |
     |---|---|---|
     | igual | no | nada |
     | igual | sí | subir sin preguntar |
     | distinto | no | bajar sin preguntar |
     | distinto | sí | diálogo de conflicto |
  5. Antes de cualquier volcado desde la nube, guardar un punto de restauración
     local (ver `MEJ-10`).
- **Hecho cuando**
  - Tests de la tabla anterior con un servicio de nube simulado.
  - Test: el temporizador no llama a `guardar` si no hay cambios.
  - Test: subir con `rev` remoto distinto de la base no escribe y devuelve
    conflicto.
- **Mejora de fondo** en `MEJ-01` (fusión por elemento).
- **Aplicado (2026-11-16).** Revisión `rev` por subida, base y sello de
  sincronización por proyecto (`StorageAdapter.marcarSincronizado`), tabla de
  decisión en `_sincronizarDesdeNube`, `AuthModule.guardarEnNube()` como único
  camino de guardado (pregunta en conflicto), y punto de restauración de una
  posición antes de cualquier volcado o importación («Volver a esa copia» en
  Administrar datos). Probado con dos dispositivos contra una nube simulada
  (15 comprobaciones). **Pendiente**: la comprobación y la escritura no van en
  una transacción de Firestore (queda una ventana de milisegundos), y los tests
  son de navegador y aún no están en CI (`TEC-02`).

#### [x] BUG-04 · Una clave mal tecleada sobrescribe la lista de proyectos remota

- **Prioridad** P0 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `auth/auth.js:448-458, 472-479, 942-951`,
  `firebase/firebase-service.js:396-409`
- **Problema.** En el desbloqueo, `_sincronizarDesdeNube` llama **primero** a
  `_sincronizarRegistroProyectos`. Con una clave errónea,
  `downloadRegistroProyectos()` no puede descifrar y devuelve `null` (como si no
  existiera), y a continuación `uploadRegistroProyectos()` sube la lista local
  cifrada **con la clave errónea**. Después `downloadBackup()` falla y se
  muestra «clave incorrecta», pero el daño ya está hecho: en un dispositivo
  nuevo la lista remota (con los proyectos creados en otros dispositivos) se ha
  sustituido por `[default]` ilegible.
- **Solución.**
  - Validar la clave antes de escribir nada: mover la sincronización del
    registro **después** de un `downloadBackup()` correcto.
  - `downloadRegistroProyectos()` debe distinguir «no existe» (`null`) de «no se
    puede descifrar» (lanzar error), y el llamante no debe subir tras un error.
  - Si no hay ningún backup con el que validar (cuenta nueva), validar contra el
    registro si existe.
- **Hecho cuando** hay un test con un servicio simulado: clave errónea → cero
  escrituras remotas.

#### [x] BUG-05 · La copia en Firebase tiene un techo de ~1 MiB

- **Prioridad** P0 (latente) · **Esfuerzo** M · **Evidencia** ◐ por lectura y cálculo
- **Ficheros** `firebase/firebase-service.js:336-345`, `common/crypto.js`
- **Problema.** Toda la copia va en un campo de **un** documento de Firestore,
  cuyo límite es 1 MiB. El contenido es JSON → AES-GCM → base64 (+33 %), sin
  comprimir. Un movimiento ocupa ~200 bytes en JSON (~270 en la copia): el
  límite llega hacia los 3.500–4.000 movimientos, es decir, dos o tres años de
  extractos importados de un par de cuentas. A partir de ahí `set()` falla
  siempre y la copia deja de actualizarse.
- **Solución.**
  1. Comprimir antes de cifrar con `CompressionStream('gzip')` (JSON repetitivo
     comprime 8–10×). Nuevo formato `version: 3` con marca de compresión;
     `decryptPortable` debe seguir leyendo las versiones anteriores.
  2. Si aun así supera ~900 KB, trocear en documentos `backup__0…n` con un
     manifiesto (`partes`, `rev`), escritos en un `batch`.
  3. Mostrar el tamaño de la copia en «Administrar datos» y avisar al 70 %.
- **Aplicado (2026-11-16).** El punto 1 (gzip antes de cifrar, formato `gz1:`,
  lectura compatible con el anterior). **Pendientes** los puntos 2 y 3: con la
  compresión el techo pasa a decenas de miles de movimientos.
- **Hecho cuando**
  - Test de ida y vuelta con 20.000 movimientos sintéticos.
  - Test de compatibilidad: una copia `version: 2` se sigue pudiendo leer.

#### [x] BUG-06 · La migración 010 no limpia nada y convierte supuestos en realidad

- **Prioridad** P0 para quien usó «Supuestos» o el planificador · **Esfuerzo** M · **Evidencia** ✔ reproducido con test
- **Ficheros** `src/state/migrations/index.ts:49` (`LEGACY_KEYS`),
  `src/state/migrations/010-simplificacion.ts:51-53`, `src/state/store.ts:48-70`
- **Problema.** `store.load()` solo lee del almacenamiento las claves del
  esquema actual más `LEGACY_KEYS = ['history']`. Las colecciones `escenarios`,
  `planes` y `goals` nunca llegan a `migrateTo10`, que al no verlas cree que ya
  se ejecutó y **sale sin hacer nada**. Consecuencias (comprobadas con un
  almacenamiento v9):
  - los elementos conservan `escenarioIds`, y como ya nadie filtra por
    escenario, un gasto que solo existía dentro de un supuesto **entra en la
    proyección real**;
  - los planes con objetivos no se archivan en ningún sitio;
  - `financeapp_state_escenarios`, `…_planes` y `…_goals` se quedan huérfanas
    para siempre.
- **Solución.** Migración **011** (no reescribir la 010, que ya se aplicó):
  1. Añadir `escenarios`, `planes`, `goals` a `LEGACY_KEYS`.
  2. Para cada elemento de `loans`, `expenses`, `nominas`, `accounts` (y
     amortizaciones) con `escenarioIds` no vacío: **desactivarlo**
     (`activo: false`), quitar el campo y añadir la etiqueta
     `supuesto-archivado`. No borrarlo.
  3. Quitar `escenarioIds` vacíos.
  4. Archivar los planes con datos en `state__archivo_planes` (fuera del
     esquema, incluida en las copias) y borrar las tres claves huérfanas.
  5. Idempotente por contenido, no por ausencia de colecciones.
  6. Avisar una vez al usuario: «Hemos desactivado N elementos que venían de un
     supuesto. Revísalos en Gastos (filtro “supuesto-archivado”)».
- **Hecho cuando** el test con el almacenamiento v9 del párrafo anterior deja el
  gasto inactivo, sin `escenarioIds`, con el plan archivado y sin claves
  huérfanas; y una segunda carga no cambia nada.

### 3.2 Flujos rotos (P1)

#### [x] BUG-27 · Una copia antigua importada o restaurada no pasaba por las migraciones

- **Prioridad** P1 · **Esfuerzo** S · **Evidencia** ◐ por lectura (encontrado al hacer `BUG-06`)
- **Ficheros** `src/main.ts` (`datos.aplicar`, `datos.snapshot`), `src/state/colecciones.ts`
- **Problema.** Aplicar una copia escribía sus colecciones y recargaba el store,
  pero la versión de esquema guardada seguía siendo la actual: las migraciones
  no corrían. Un JSON de hace meses entraba a medio migrar.
- **Solución aplicada.** Las copias llevan `_schemaVersion`; para las anteriores
  se deduce del contenido (`inferirVersionDeCopia`). Al aplicar se escribe esa
  versión y las colecciones retiradas que traiga, y el store migra al recargar.

#### [ ] BUG-28 · Los intereses de las cuentas dependen del día desde el que se genera el extracto

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔ reproducido (encontrado al hacer «Meses anteriores»)
- **Ficheros** `finance-math/finance-math.js:326-390` (`proyectarInteresesCuentas`)
  y su gemelo `src/engine/providers/interests.ts`
- **Problema.** El interés arranca del saldo en `dateStart` (el primer día del
  rango pedido) y avanza en periodos contados desde ese día. Consecuencias:
  1. Si el rango empieza antes de `fechaInicialSaldo` de la cuenta, el saldo de
     partida es 0, el ancla no entra como movimiento, y la cuenta **no genera
     interés en todo el rango**. Con un fondo al 6 % anclado el 1-sep, el mismo
     noviembre daba 606 € de rentabilidad generado solo y 0 € generado desde junio.
  2. El día del abono y el saldo medio dependen del día de inicio del rango:
     el mismo mes da intereses distintos según el periodo visible (32,50 € frente
     a 2,86 € en una cuenta remunerada). Es una de las causas de que las cifras
     «bailen» (`MEJ-13`).
- **Solución.** Calcular los intereses sobre periodos anclados al calendario
  (o a `fechaInicialSaldo`), arrancando del saldo real en el primer día de cada
  periodo según `saldoEnFecha` tras aplicar el ancla, e independientes del rango
  pedido; recortar al rango solo al final. Actualizar los tests de paridad del
  legacy y del motor nuevo en el mismo commit.
- **Mitigación ya aplicada.** El desglose de «Este mes» y «Meses anteriores»
  no cuenta intereses ni rentabilidad como ingreso.

#### [x] BUG-07 · El asistente duplica el ingreso y el gasto al volver atrás

- **Prioridad** P1 · **Esfuerzo** S · **Evidencia** ✔ reproducido
- **Ficheros** `onboarding/onboarding.js:65-90`
- **Problema.** `next()` llama siempre a `saveCurrentStep()`, que hace
  `State.addItem`. Paso de ingreso → Siguiente → Anterior → Siguiente crea dos
  «Nómina».
- **Solución.** Guardar las respuestas en un objeto del asistente y escribir una
  sola vez en `finish()`. «Anterior» debe rellenar los campos con lo ya
  contestado.
- **Hecho cuando** el recorrido anterior deja un solo ingreso, y volver atrás
  conserva lo tecleado.

#### [x] BUG-08 · Los atajos de periodo terminan un día antes, y «hoy» es ayer de madrugada

- **Prioridad** P1 · **Esfuerzo** S · **Evidencia** ✔ reproducido
- **Ficheros** `index.html:572` (`hoyISO`), `index.html:618-631` (`applyPreset`),
  `src/ui/features-modal.ts:139`
- **Problema.** `applyPreset` construye la fecha en hora local y la serializa
  con `toISOString()` (UTC). En España, `1M` desde 2026-11-16 da **2026-12-15**.
  `hoyISO()` devuelve la fecha de ayer entre las 00:00 y la 01:00/02:00. Es el
  mismo fallo que ya se corrigió en el resto del código (`core/dates`).
- **Solución.** Usar `FinanceApp.core.formatLocalDate` / `todayISO`, con una
  función local de reserva idéntica a `_hoyLocal()`.
- **Hecho cuando** hay un test con `TZ=Europe/Madrid`: `1M` desde el 16-nov da
  el 16-dic; `1Y` desde el 29-feb de un bisiesto da el 28-feb.

#### [x] BUG-09 · Conectar la nube desde el modo local deja la aplicación con los controles duplicados

- **Prioridad** P1 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `auth/auth.js:996-1023` (`launch`), `auth/auth.js:1159-1170`
  (`connectCloud`), `router/router.js:149-173`, `data-io/data-io.js:512-564`
- **Problema.** `connectCloud` vuelve a mostrar el acceso y, al terminar, llama
  de nuevo a `launch()` **sin recargar**. `Router.init()` y `DataIO.init()`
  registran sus listeners por segunda vez: el botón del menú móvil abre y cierra
  en el mismo clic (no se abre), «Funcionalidades» se abre dos veces, cada
  importación de JSON pregunta e importa dos veces, y el arrastrar-y-soltar
  global se duplica.
- **Solución.** Al terminar de conectar, registrar la sesión y hacer
  `location.reload()` (el arranque ya sabe reanudar). Además, proteger
  `Router.init` y `DataIO.init` con un indicador de «ya iniciado».
- **Hecho cuando** tras conectar desde el modo local el menú móvil se abre con
  un toque y un JSON se importa una sola vez.

#### [x] BUG-10 · Los pasos de acceso acumulan listeners al ir y volver

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `auth/auth.js:675-710, 766-860`
- **Problema.** `_wireDropboxStep` y `_wireFirebaseSetupStep` añaden listeners
  cada vez que se entra en el paso. Dropbox → Volver → Dropbox → «Conectar»
  ejecuta `setup` dos veces; en Firebase se lanzan dos ventanas emergentes y la
  segunda muestra «Inicio de sesión cancelado» aunque la primera vaya bien.
- **Solución.** Cablear cada paso una sola vez en `init()`.

#### [x] BUG-11 · Dos movimientos idénticos el mismo día se importan como uno

- **Prioridad** P1 · **Esfuerzo** S · **Evidencia** ✔ reproducido con test
- **Ficheros** `src/accounting/importar-csv.ts:412-426` (`prepararFilas`)
- **Problema.** La segunda fila con la misma fecha, importe y concepto se marca
  `duplicada` (`vistas.has(k)`) y por defecto no se importa. Dos cafés iguales
  el mismo día descuadran el saldo.
- **Solución.** Contar multiplicidades: una fila es duplicada solo si el número
  de apariciones en el fichero hasta ella no supera las que **ya existen** en la
  cuenta con esa clave. Dentro del mismo fichero nunca se descarta.
- **Hecho cuando**: fichero con 2 iguales y 0 existentes → 0 duplicadas; con 1
  existente → 1 duplicada; reimportar el mismo fichero → todas duplicadas.

#### [x] BUG-12 · Sin conexión no se puede entrar si se usa la nube

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ◐ por lectura
- **Ficheros** `firebase/firebase-service.js:248-284`, `auth/auth.js:361-393`,
  `sw.js:34`, `index.html:511-513`
- **Problema.** La PWA promete abrir sin red, pero en modo Firebase:
  - el SDK se carga de `www.gstatic.com`, que el service worker no cachea, así
    que sin red `firebase` no existe;
  - `restoreSession` hace `getIdToken(true)` y, si falla **por la red**, cierra
    la sesión de Firebase (`signOut`) como si el acceso se hubiera revocado;
  - cualquier error al sincronizar en `_reanudar` devuelve a la pantalla de
    desbloqueo, que exige Google y por tanto red.

  Los datos están en el dispositivo, pero no hay forma de verlos. En Dropbox
  ocurre lo mismo con `_verifyToken`.
- **Solución.**
  - Distinguir error de red (`auth/network-request-failed`, `TypeError` de
    `fetch`, `navigator.onLine === false`) de acceso revocado. Con error de red:
    arrancar con los datos locales, mostrar «Sin conexión · los cambios se
    subirán al volver» y reintentar al evento `online`.
  - Servir el SDK desde el propio origen (ver `SEC-02`) o añadir su host a la
    caché del service worker.
- **Hecho cuando** con la red cortada y sesión previa, la aplicación abre con
  los datos locales y un aviso; al volver la red sincroniza según `BUG-03`.

#### [x] BUG-13 · El selector de acceso de emergencia aparece sin botones que funcionen

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `auth/auth.js:608-614` frente a `auth/auth.js:617-672`
- **Problema.** A los 8 s el «salvavidas» muestra el selector de método, pero
  los listeners de sus botones se registran después de `await _reanudar()`, que
  es justo lo que está colgado.
- **Solución.** Registrar los listeners al principio de `init()`. Si el usuario
  elige otro método mientras `_reanudar` sigue pendiente, ignorar su resultado.

#### [ ] BUG-14 · Un proyecto eliminado reaparece, y su copia remota no se borra

- **Prioridad** P2 · **Esfuerzo** M · **Evidencia** ◐ por lectura
- **Ficheros** `src/state/proyectos.ts:157-191`, `firebase/firebase-service.js:383-409`
- **Problema.** `fusionarRemotos` nunca borra: otro dispositivo que aún tenga el
  proyecto lo vuelve a subir. Y `backup_<id>` se queda en Firestore.
- **Solución.** Lápidas: `eliminadoEn` en el registro (se conservan 90 días); la
  fusión respeta la más reciente entre `actualizadoEn` y `eliminadoEn`. Al
  eliminar con nube conectada, borrar también el documento remoto.

#### [x] BUG-15 · Si el almacenamiento se llena, los cambios se pierden en silencio

- **Prioridad** P1 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `src/state/storage/local.ts:38-51`, `common/storage.js:22-25`
- **Problema.** El adapter nuevo captura el error de cuota y solo escribe en
  consola; el legacy ni lo captura (`get` hace `JSON.parse` sin `try`, así que
  un valor corrupto impide arrancar). El usuario sigue trabajando convencido de
  que se guarda.
- **Solución.** Que `set` devuelva si pudo escribir; ante un fallo, aviso fijo
  «No se ha podido guardar: el almacenamiento está lleno» con acceso a exportar.
  Mostrar el uso en «Administrar datos». `try/catch` en `common/storage.js`.
  A medio plazo, `TEC-06`.

#### [x] BUG-16 · Un almacenamiento incompleto deja la aplicación sin arrancar

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ✔ reproducido con test
- **Ficheros** `src/state/store.ts:48-70`
- **Problema.** Con la versión de esquema al día pero alguna clave ausente o
  corrupta (el adapter trata lo corrupto como ausente), `load()` deja esa
  colección `undefined`. Si es `config`, `flags` falla en el arranque y solo
  queda el cuadro de mando.
- **Solución.** Tras migrar: `state = { ...defaultState(), ...migrado }`, con
  `config = { ...defaultConfig(), ...migrado.config }`, y arrays garantizados.
- **Hecho cuando** un almacenamiento con solo `state__schemaVersion = 10` y
  `state_expenses` arranca con el resto por defecto.

#### [x] BUG-17 · El formulario de gastos acepta datos imposibles y borra las etiquetas de las transferencias

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `src/features/expenses/index.ts:345-393`
- **Problema.** Se aceptan cuantía 0 o negativa, fecha de fin anterior a la de
  inicio, fecha de inicio vacía y transferencias con la misma cuenta de origen y
  destino. Al guardar una transferencia, las etiquetas se sustituyen por
  `['transferencia']`.
- **Solución.** Validar con mensaje junto al campo; en transferencias, añadir la
  etiqueta `transferencia` sin quitar las demás. Revisar con el mismo criterio
  los formularios de préstamos (`capital`, `meses` > 0, `tin` ≥ 0), nóminas y
  cuentas, que hoy no muestran errores de validación.

#### [x] BUG-18 · «JSON → Firebase» sube aunque se cancele, y «Cargar copia» pregunta dos veces

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `data-io/data-io.js:63-80, 142-151, 328-338`
- **Problema.** `applyImport` tiene su propia confirmación y no devuelve si se
  aplicó. Si se cancela esa segunda pregunta, `_importJSONToFirebase` sube
  igualmente los datos actuales y dice «importados y subidos».
- **Solución.** `applyImport(data, { confirmar: false })` que devuelva
  `true/false`; una sola pregunta por flujo.

#### [ ] BUG-19 · Una etiqueta o un nombre con comilla rompe los botones del cuadro de mando

- **Prioridad** P2 · **Esfuerzo** incluido en `SEC-01` · **Evidencia** ◐ por lectura
- **Ficheros** `dashboard/dashboard.js:714, 1226, 1229`
- **Problema.** `onclick="DashboardModule.toggleTag('${t}')"`: una etiqueta como
  `d'ocio` produce un error de sintaxis y el filtro deja de responder.

#### [x] BUG-20 · Dos pestañas abiertas se pisan

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Problema.** Cada pestaña guarda colecciones enteras desde su copia en
  memoria. No se escucha el evento `storage`.
- **Solución.** Escuchar `storage` sobre las claves del proyecto activo →
  `FinanceApp.datos.recargar()` y repintar. Si hay un formulario abierto, avisar
  en vez de recargar debajo.

#### [ ] BUG-21 · El neto de nómina calculado se aleja del real

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔ el cálculo actual · `? contrastar` las cifras oficiales
- **Ficheros** `src/core/tax/irpf.ts:55-62`, `src/engine/providers/salaries.ts:120-135`,
  `src/core/tax/nomina-grupo.ts:18`, `src/features/salaries/form.ts:155-156`
- **Problema.**
  1. **No se resta el mínimo personal y familiar.** Para 42.000 € brutos el
     modo automático retiene 9.514,71 € (22,65 %); restando la cuota del mínimo
     personal (5.550 € → 1.054,50 €) serían 8.460,21 € (20,14 %). Son ~88 € al
     mes de neto de menos, todos los meses de la proyección.
  2. **La Seguridad Social se reparte entre todas las pagas** (`ssAnual / nPagas`).
     En la realidad se cotiza en 12 mensualidades con las extras prorrateadas:
     con 14 pagas, cada mensualidad real lleva más descuento y cada extra,
     ninguno. La forma del flujo de caja mensual sale distinta de la del banco.
  3. **Tipos incoherentes.** La base del IRPF descuenta siempre un 6,35 % fijo e
     ignora el `ssPct` de la nómina; el evento de SS se calcula sobre el bruto
     menos la retribución flexible y la base del IRPF sobre el bruto entero; el
     valor por defecto es 6,35 pero el texto de ayuda suma 6,48 (incluye el
     MEI).
  4. **Sin base máxima de cotización**: en sueldos altos la SS sale de más.
  5. **Constantes sin año** (reducción del art. 20, 2.000 € de gastos, tipos de
     cotización), cuando los tramos sí se pueden versionar por ejercicio.
- **Solución.** Tabla de parámetros por ejercicio en `src/core/tax/tables.ts`
  (tipo de cotización del trabajador con MEI, base máxima, reducción por
  rendimientos del trabajo, mínimo personal), resuelta por el año de cada paga
  igual que los tramos. Cuota = escala(base) − escala(mínimo). SS en 12
  mensualidades. Un solo `ssPct` usado en los dos sitios.
  **Antes de cambiar nada**, contrastar cada cifra con la AEAT y la Seguridad
  Social para el ejercicio en curso y dejar la fuente en un comentario.
- **Hecho cuando**
  - Hay 3 casos de referencia (p. ej. 20.000, 42.000 y 90.000 € brutos, soltero
    sin hijos) cuyo tipo de retención coincide con la calculadora de la AEAT
    con ±0,3 puntos.
  - Los tests de paridad afectados se actualizan y se explica en el commit.
- Complemento de producto en `MEJ-04`.

#### [x] BUG-22 · La caché del service worker crece sin límite

- **Prioridad** P3 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `sw.js:24, 51-60`
- **Problema.** Cada despliegue estrena URLs `?v=<sha>` que se añaden a
  `financeapp-v1`; `VERSION` no cambia nunca, así que nada se purga.
- **Solución.** En el despliegue, sustituir `VERSION` por el SHA; o al activar,
  borrar las entradas cuyo `?v` no sea el actual. Añadir el aviso «Hay una
  versión nueva · Recargar» (el mensaje `skip-waiting` ya existe, falta la
  interfaz).

#### [x] BUG-23 · El borrado de una cuenta deja huérfanos

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ◐ por lectura (a confirmar al implementar)
- **Ficheros** `src/features/accounts/index.ts:445-460`
- **Problema.** Se elimina la cuenta con «¿Eliminar cuenta?» sin tratar lo que
  cuelga de ella: movimientos, puntos de control, estimaciones, nóminas,
  préstamos y transferencias que la referencian.
- **Solución.** Antes de borrar, contar las referencias y ofrecer: mover a otra
  cuenta, o desactivar la cuenta en lugar de borrarla (recomendado si tiene
  movimientos). El «Deshacer» debe restaurar el conjunto.

#### [x] BUG-24 · La ayuda de Firebase indica un método de acceso que la aplicación no usa

- **Prioridad** P1 (por su efecto en `SEC-04`) · **Esfuerzo** S · **Evidencia** ✔
- **Ficheros** `index.html:325`, `firebase/firebase-service.js:4-9, 122-202`
- **Problema.** Paso 2 de las instrucciones: «Activa Authentication →
  Email/Password». La aplicación solo entra con Google. `login()` y `register()`
  son código muerto.
- **Solución.** Cambiar el paso a «Google», eliminar `login`/`register` y
  corregir la cabecera del fichero. Ver `SEC-04`.

---

## 4. Seguridad

### 4.1 Modelo de amenazas, en dos líneas

Todo el estado vive **en claro** en `localStorage`; lo que va a la nube va
cifrado con AES-GCM y una clave derivada (PBKDF2) de una frase que solo conoce el
usuario. El diseño protege bien **frente al proveedor de nube**. Lo que no
protege es frente a (a) código que se ejecute en el origen y (b) alguien con el
dispositivo desbloqueado. Las tareas van en ese orden.

#### [ ] SEC-01 · XSS almacenado en el cuadro de mando

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ◐ por lectura
- **Ficheros** `dashboard/dashboard.js` — no tiene función de escapado. Puntos
  con texto del usuario en `innerHTML`: líneas 152, 208, 288, 296, 300, 714,
  921, 936-941, 1145, 1175, 1226, 1229, 1246; y 25 manejadores `onclick`/`onchange`
  en línea que interpolan ids y etiquetas.
- **Vector.** Importar un backup JSON preparado por otra persona (o una copia
  manipulada), con un concepto como `<img src=x onerror=…>`. Las vistas nuevas
  sí escapan (`esc()` en `src/features/accounting/dom.ts`); el cuadro de mando,
  que es lo primero que se pinta, no.
- **Impacto.** Ejecución de código en el origen: lectura de todos los datos, de
  la clave de cifrado (`financeapp_session`, en claro — `SEC-03`) y de la sesión
  de Firebase; es decir, acceso a la copia de la nube.
- **Solución.**
  1. Función `_esc` (la misma tabla que `auth.js:396`, con comilla simple) en
     todo texto interpolado, incluidos los atributos `title`.
  2. Sustituir los manejadores en línea por `data-*` y un único listener
     delegado en el contenedor (patrón `onClick` de `accounting/dom.ts`).
  3. Las etiquetas de Chart.js no se interpretan como HTML: no tocarlas.
- **Hecho cuando**
  - Test: con un estado cuyos conceptos, nombres de cuenta, de préstamo y
    etiquetas son `"><img src=x onerror=window.__xss=1>` y `d'ocio`, el
    cuadro de mando se pinta, `window.__xss` no existe y el filtro por etiqueta
    funciona.
  - `grep -c 'onclick=\|onchange=' dashboard/dashboard.js` → 0.

#### [ ] SEC-02 · Sin política de contenido y con scripts de terceros sin fijar

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔
- **Ficheros** `index.html:22-23, 511-513` (Chart.js y Firebase desde CDN, sin
  `integrity`), `index.html:440-451` (manejadores en línea), `index.html:556-649`
  (scripts en línea)
- **Problema.** Cualquier compromiso de jsDelivr o gstatic ejecuta código con
  acceso total. No hay CSP que limite el daño de `SEC-01`.
- **Solución.**
  1. Servir Chart.js, su adaptador y Firebase desde el propio origen (añadirlos
     como dependencias y empaquetarlos con Vite, cargando Firebase solo cuando
     el usuario elige ese modo — ver `TEC-07`). Mientras tanto, `integrity` +
     `crossorigin` en las cinco etiquetas.
  2. Mover los scripts en línea a ficheros y los `onchange`/`onclick` de la
     barra de periodo a listeners.
  3. Añadir `<meta http-equiv="Content-Security-Policy">` (GitHub Pages no deja
     poner cabeceras): `default-src 'self'; script-src 'self'; style-src 'self'
     'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;
     connect-src 'self' https://*.googleapis.com https://*.firebaseio.com
     https://api.dropboxapi.com https://content.dropboxapi.com;
     frame-src https://*.firebaseapp.com; img-src 'self' data:; object-src 'none';
     base-uri 'self'`. Ajustar con la consola abierta hasta que no haya
     violaciones en los tres modos de acceso.
- **Depende de** `SEC-01` (sin manejadores en línea).

#### [ ] SEC-03 · La clave de cifrado se guarda en claro y el bloqueo es solo visual

- **Prioridad** P2 (P1 si el equipo es compartido) · **Esfuerzo** L · **Evidencia** ◐ por lectura
- **Ficheros** `src/auth/session.ts` (`RegistroSesion.passphrase`),
  `src/auth/biometria.ts`, `auth/auth.js:562-569, 656-671`
- **Problema.** Está documentado como decisión consciente, pero tiene tres
  efectos que el usuario no espera:
  1. La clave está en `localStorage` mientras dure la sesión: cualquier XSS la
     obtiene, y con ella la copia de la nube.
  2. «Cerrar sesión» y el cierre por inactividad no protegen los datos: siguen
     en claro, y tras cerrar sesión basta pulsar **«Empezar ahora»** (modo
     local) para verlos todos.
  3. La huella envuelve la clave con WebAuthn-PRF, pero la misma clave está al
     lado sin envolver mientras hay sesión.
- **Solución por pasos.**
  - *Paso 1 (S):* decir la verdad en la interfaz. En «Sesión»: «Cerrar sesión
    desconecta la nube; tus datos siguen en este dispositivo». No ofrecer el
    cierre por inactividad en modo local.
  - *Paso 2 (M):* no guardar la frase. Derivar una clave maestra una vez,
    guardarla como `CryptoKey` **no extraíble** en IndexedDB y cifrar las copias
    con una clave de datos envuelta por ella (formato `version: 4`; exige sal
    fija por cuenta, guardada junto a la copia).
  - *Paso 3 (L, requiere decisión):* cifrado en reposo opcional («Bloquear con
    clave»): el estado se guarda cifrado y se descifra al desbloquear con clave
    o huella. Solo entonces el bloqueo protege de verdad.

#### [ ] SEC-04 · Las reglas de Firestore no exigen correo verificado ni proveedor

- **Prioridad** P1 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `firebase/firestore.rules:12-22`, `index.html:325`
- **Problema.** `isWhitelisted()` solo compara `request.auth.token.email`. Si el
  proveedor Email/Password está activo (y las instrucciones lo piden,
  `BUG-24`), cualquiera puede registrarse con un correo de la lista blanca que
  aún no tenga cuenta, sin verificarlo, y pasar por autorizado; si ese correo es
  administrador, gestionar la lista. No vería los datos de nadie (van por `uid`
  y cifrados), pero sí la lista de correos, y podría revocar accesos.
- **Solución.**
  ```
  function isWhitelisted() {
    return request.auth != null
      && request.auth.token.email_verified == true
      && request.auth.token.firebase.sign_in_provider == 'google.com'
      && exists(/databases/$(database)/documents/whitelist/$(request.auth.token.email));
  }
  ```
  Además: limitar tamaño y forma de los documentos de `users/{uid}/data`
  (`cipher` es string, `version` es int), y guardar los ids de la lista en
  minúsculas (ya se hace al añadir; documentarlo para el alta manual).
  Probar con el emulador de reglas.

#### [ ] SEC-05 · La frase de cifrado puede ser de 4 caracteres y no se confirma

- **Prioridad** P1 · **Esfuerzo** S–M · **Evidencia** ✔
- **Ficheros** `auth/auth.js:73, 825`, `index.html:235`, `common/crypto.js:3`
- **Problema.** Mínimo 4 caracteres con PBKDF2-SHA256 a 200.000 iteraciones: una
  copia robada se rompe por fuerza bruta en poco tiempo. Al crearla se teclea
  **una sola vez**: una errata deja la primera copia irrecuperable. No existe
  «cambiar clave».
- **Solución.** Mínimo 12 caracteres o 4 palabras, con medidor; pedirla dos
  veces al crearla; subir a 600.000 iteraciones guardando el número en la
  cabecera del formato (las copias antiguas se leen con 200.000 y se reescriben
  con el nuevo valor al guardar); acción «Cambiar clave de cifrado» que descifra
  y vuelve a subir todos los proyectos y actualiza sesión y huella.

#### [ ] SEC-06 · XSS en la ventana «Gestionar accesos»

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ◐ por lectura
- **Ficheros** `auth/auth.js:1060-1083`
- **Problema.** `e.email`, `e.addedBy` y `loadErr` van a `innerHTML` y a
  `onclick` sin escapar. Solo un administrador puede escribir en la lista, así
  que el alcance es entre administradores.
- **Solución.** `_esc` y `data-*` con listener delegado; quitar
  `AuthModule._wlRemove/_wlSetAdmin` del objeto público.

#### [ ] SEC-07 · El origen se comparte con otras aplicaciones y con las previews

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ◐ por lectura
- **Ficheros** `.github/workflows/deploy-preview.yml`, configuración de Pages
- **Problema.** En `usuario.github.io/FinanceApp/` el origen es
  `usuario.github.io`, compartido con **todos** los proyectos Pages del usuario
  y con `…/FinanceApp/preview/<rama>/`. `localStorage` es por origen:
  - abrir una preview ejecuta código sin revisar sobre los datos reales, y una
    migración nueva los deja en un esquema que producción no entiende;
  - un fallo en cualquier otra aplicación del mismo origen expone estos datos y
    la clave.
- **Solución.** Dominio o subdominio propio para producción (CNAME en Pages) y
  previews en **otro** origen (otro repositorio de Pages o un servicio de
  previews). Como mínimo inmediato: que el build de preview inyecte un prefijo
  de almacenamiento distinto (`window.FINANCEAPP_NS = 'financeapp_preview_'`,
  leído por `common/storage.js` y `src/state/storage/local.ts`) y muestre en el
  banner que usa datos de prueba.

#### [ ] SEC-08 · El despliegue arrastra un paso muerto con un secreto y publica de más

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ✔
- **Ficheros** `.github/workflows/deploy.yml:44-58, 101-112`,
  `.github/workflows/deploy-preview.yml:78-92`, `gdrive-setup-tutorial.html`
- **Problema.** Los pasos «Inject Google Drive credentials» sustituyen
  `%%GDRIVE_CLIENT_SECRET%%` en `auth/auth.js`, que ya no contiene esos
  marcadores. Si alguien los reintroduce, un *client secret* acabaría en un
  fichero público. El `rsync` publica `docs/`, `tools/`, `.github/`,
  `package*.json`, configuraciones y el tutorial de Drive.
- **Solución.** Borrar ambos pasos, los secretos `GDRIVE_*` del repositorio y
  `gdrive-setup-tutorial.html`. Cambiar el `rsync` a lista de inclusión
  (`index.html`, `sw.js`, `manifest.webmanifest`, `favicon.svg`, `assets/`,
  `auth/`, `common/`, `dashboard/`, `data-io/`, `expenses/`, `finance-math/`,
  `firebase/`, `loans/`, `onboarding/`, `router/`, `ui/`). Fijar las acciones de
  terceros por SHA.

#### [ ] SEC-09 · Importar y exportar sin red de seguridad

- **Prioridad** P2 · **Esfuerzo** M · **Evidencia** ◐ por lectura
- **Ficheros** `data-io/data-io.js:33-125`, `src/state/colecciones.ts`
- **Problema.** El JSON exportado va en claro, con todas las finanzas. Al
  importar no se valida la forma (tipos, longitudes) y se sobrescribe sin copia
  previa ni vuelta atrás.
- **Solución.** Opción «Exportar cifrado» (mismo formato que la nube, extensión
  propia); validador de esquema antes de aplicar, que rechace tipos inesperados
  y recorte cadenas desmesuradas; punto de restauración automático antes de
  importar o restaurar (`MEJ-10`), con «Deshacer importación» en el aviso.

#### [ ] SEC-10 · Dropbox depende de un token pegado a mano que caduca a las 4 horas — *requiere decisión*

- **Prioridad** P2 · **Esfuerzo** M · **Evidencia** ✔ (el propio código lo avisa)
- **Ficheros** `auth/auth.js:24-255`, `index.html:277-354`
- **Problema.** Pide generar un token en la consola de desarrollador de Dropbox.
  Caduca a las 4 h, así que cada sesión exige repetirlo. No sincroniza la lista
  de proyectos ni ofrece «Cargar copia» ni autoguardado.
- **Opciones.** (a) OAuth con PKCE y *refresh token* (no necesita secreto en el
  cliente), igualando lo que hace Firebase; (b) retirarlo, como ya proponía
  `docs/05`. Recomendación: **(b)**, salvo que se use de verdad.

#### [ ] SEC-11 · Enlaces externos sin `rel="noopener"`

- **Prioridad** P3 · **Esfuerzo** S
- **Ficheros** `index.html:286, 324, 343`, `auth/auth.js:722`
- **Solución.** `rel="noopener noreferrer"` en los cuatro.

---

## 5. UI / UX por componente

Medidas tomadas en iPhone 13 (390×664 px útiles) y 1400×900. No hay desbordes
horizontales ni errores de consola en ninguna vista.

### 5.1 Estructura general

#### [ ] UX-01 · La cabecera fija ocupa el 38 % de la pantalla del móvil

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔ medido
- **Ficheros** `index.html:438-454`, `ui/ui.css:66-72`
- **Problema.** Logotipo + barra de periodo + saldo + «Buscar» suman 251 px
  fijos; quedan 413 px para el contenido, en **todas** las vistas, incluidas las
  que no usan el periodo (Préstamos, Nóminas, Cuentas). En Gastos la primera
  fila de la lista queda fuera de la primera pantalla.
- **Solución.**
  - En móvil, una sola línea: `☰  16 nov 26 → 16 nov 27 ▾  🔍`. Al tocar el
    periodo se abre una hoja con las dos fechas, los atajos y «Simulación
    desde».
  - Mostrar el periodo solo donde aplica: cuadro de mando, cierre y precisión,
    márgenes.
  - Los atajos, como control segmentado que marca el activo y parte de **hoy**,
    no de la fecha de inicio actual.
  - «Simulación desde» pasa a ajustes avanzados con el valor «hoy» por defecto;
    eliminar su duplicado «Fecha referencia» del cuadro de mando (`UX-14`).
- **Hecho cuando** en 390×664 la cabecera mide ≤ 64 px y el contenido ≥ 590 px.
- **Aplicado (2026-11-16), parcial.** En móvil la barra se pliega en una línea («Periodo 1 sep 26 → 31 dic 27 ▾» + buscar): la cabecera fija pasa de 251 a 109 px y el contenido de 413 a 555 px. **Pendiente**: mostrarla solo en las vistas que usan el periodo, atajos como control segmentado y sacar «Simulación desde» a ajustes.

#### [ ] UX-02 · Navegación: sin botón atrás, sin direcciones y con menú de hamburguesa

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔
- **Ficheros** `router/router.js`, `src/app/feature-registry.ts`
- **Problema.** No hay rutas en la URL: el botón o gesto «atrás» saca de la
  aplicación, recargar vuelve siempre al cuadro de mando, y no se puede guardar
  un acceso directo a una vista. En móvil todo está tras la hamburguesa.
- **Solución.** Rutas con *hash* (`#/gastos`, `#/cuentas/movimientos`),
  `history.pushState` al navegar y al abrir un modal (atrás lo cierra),
  restaurar la última vista. En móvil, barra inferior con cuatro destinos:
  Inicio, Gastos, Cuentas, Más (Préstamos, Nóminas, Proyectos, Personas,
  Funcionalidades, Datos). Respetar `env(safe-area-inset-bottom)`.

#### [ ] UX-03 · Los modales no se comportan como diálogos

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔ (Escape no cierra ninguno)
- **Ficheros** `ui/ui.js:5-6`, `index.html:496-501`, `src/ui/*-modal.ts`,
  formularios de `src/features/*`
- **Problema.** Sin `role="dialog"` ni `aria-modal`; Escape no cierra; el foco
  no entra (queda en el botón que lo abrió) ni queda atrapado ni se devuelve;
  hay un único modal global, de modo que un diálogo sustituye al anterior y al
  cerrarse hay que reabrir el primero a mano (ver el comentario de
  `data-io.js:479-485`). En móvil «Guardar» queda bajo el pliegue.
- **Solución.** Un componente de diálogo en `src/ui/dialogo.ts` con pila, foco
  inicial en el primer campo, trampa de foco, Escape, devolución del foco,
  `aria-labelledby`, y pie fijo con las acciones. Intro envía el formulario.
  Migrar `UI.openModal` a ese componente.
- **Aplicado (2026-11-16), parcial.** Escape cierra; `role="dialog"`, `aria-modal` y nombre accesible con el título; el foco entra (primer campo con ratón, la ventana con dedo), no sale con el tabulador y vuelve a quien abrió. **Pendiente**: pila de modales, pie fijo con las acciones e Intro para enviar.

#### [ ] UX-04 · Confirmaciones y peticiones con ventanas nativas del navegador

- **Prioridad** P2 · **Esfuerzo** M · **Evidencia** ✔ (26 `confirm`, 4 `prompt`)
- **Ficheros** `src/ui/personas-modal.ts:158`, `src/ui/proyectos-modal.ts:218, 228`,
  `src/features/accounts/transactions-panel.ts:768`, y los `confirmar()` de las vistas
- **Problema.** `confirm`/`prompt` rompen el estilo, en PWA instalada muestran
  el dominio, y no permiten explicar qué se borra. Además se pide confirmación
  («¿Eliminar?», sin decir qué) para borrados que **ya tienen «Deshacer»**.
- **Solución.** Borrados simples: sin pregunta, con el aviso «Deshacer» que ya
  existe. Borrados en cascada (cuenta, proyecto, simulaciones): diálogo propio
  que nombre el elemento y sus consecuencias. Renombrar e importes: edición en
  línea.

#### [ ] UX-05 · Accesibilidad básica

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔ medido
- **Hallazgos**
  - 15 de 15 etiquetas del formulario de gasto sin `for`; ocurre en todos los
    formularios generados con el patrón `campo()`.
  - Botones de icono sin nombre accesible: menú móvil, duplicar, editar, `✕`.
  - Dianas táctiles por debajo de 44 px: botones de icono 32×32, eliminar
    41×32, etiquetas 22 px de alto, atajos de periodo 25 px, interruptores
    38×22, botones secundarios 29 px.
  - Solo 3 reglas de foco en todo el CSS; `dashboard.css` y `ui.css`, ninguna.
  - Texto de 10–11 px en `--text3` (#6b7b96): contraste ≈ 4,6:1 sobre el fondo,
    menor sobre las tarjetas.
  - Los avisos (`toast`) no se anuncian (`aria-live`).
  - Las gráficas no tienen alternativa textual.
- **Solución.** `for`/`id` en el generador de campos; `aria-label` en los
  iconos; `min-height: 44px` en controles táctiles bajo `(pointer: coarse)`;
  `:focus-visible` global; subir `--text3` a ~#8291ab y el mínimo de texto a
  12 px; `role="status" aria-live="polite"` en el contenedor de avisos;
  resumen textual bajo cada gráfica («Mínimo previsto: 1.240 € el 3 de marzo»).
- **Hecho cuando** axe-core no da infracciones serias en las seis vistas.

#### [ ] UX-06 · Fechas, importes y frecuencias con formato de máquina

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ✔
- **Ejemplos.** «Ref. 2026-11-16», «último saldo real: 2026-09-01», «(2026-11)»,
  «Cada 1 mes(es)», «Cada 12 mes(es)», ejes con «156.000,00 €».
- **Solución.** Un formateador único: «16 nov 2026», «noviembre de 2026»,
  «Mensual / Cada 2 meses / Anual / Semanal», ejes compactos («156 mil €»).

#### [ ] UX-07 · Estados vacíos sin siguiente paso

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ✔
- **Problema.** Gastos sin datos dice «Sin resultados.», igual que cuando un
  filtro no encuentra nada.
- **Solución.** Vacío real: explicación de una línea y botón de la acción
  principal («Añade tu primer gasto», «Importa un extracto»). Vacío por filtro:
  «Ningún gasto coincide» + «Limpiar filtros».

#### [ ] UX-08 · Avisos flotantes

- **Prioridad** P3 · **Esfuerzo** S
- **Ficheros** `ui/ui.js:4`, `ui/ui.css:78`
- **Solución.** Duración proporcional al texto (mínimo 4 s, errores hasta
  cerrarlos), encima de la barra inferior en móvil, máximo tres apilados.

#### [ ] UX-09 · Tema claro — *opcional*

- **Prioridad** P3 · **Esfuerzo** M
- Solo existe tema oscuro (`color-scheme: dark`). Al sol, en el móvil, un tema
  claro se lee mejor. Los colores ya son *tokens* en `common/variables.css`;
  faltan los incrustados en JS (`docs/04-sistema-visual.md` los lista).

### 5.2 Acceso y alta

#### [ ] UX-10 · La pantalla de acceso promete lo que no hay y enseña demasiado

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ✔
- **Ficheros** `index.html:166-195`
- **Problema.** «Firebase — sincronización en tiempo real»: no es en tiempo
  real, es una copia que se sube a mano o cada N minutos. «Firebase» y «Dropbox»
  son nombres de proveedor, no de beneficio.
- **Solución.** «Solo en este dispositivo» / «Con copia cifrada en la nube
  (Google)». Dropbox, si sigue (`SEC-10`), bajo «Otras opciones». Una línea
  sobre la clave: «Solo tú la conoces. Si la pierdes, la copia no se puede
  recuperar».

#### [ ] UX-11 · El asistente inicial

- **Prioridad** P2 · **Esfuerzo** M · **Evidencia** ✔
- **Ficheros** `onboarding/onboarding.js`
- **Problema.** Además de `BUG-01`, `BUG-02` y `BUG-07`: solo se puede saltar en
  el primer paso; no pregunta el día de cobro; no valida; la cuenta se queda
  llamándose «Default»; termina en un cuadro de mando sin guía.
- **Solución.** «Omitir» en todos los pasos; nombre de la cuenta; día de cobro
  de la nómina; varios gastos fijos en el mismo paso (lista con «+ otro»); al
  terminar, una tarjeta «Siguientes pasos» en el cuadro de mando (añadir más
  gastos, importar un extracto, activar la copia) que desaparece al completarla.
  Portarlo a `src/` (`TEC-01`).

### 5.3 Cuadro de mando

#### [ ] UX-12 · Lo que responde a las tres preguntas está al final

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔
- **Ficheros** `dashboard/dashboard.js` (orden de `render`), `src/features/dashboard/hero.ts`
- **Problema.** Orden actual en móvil: tarjeta **Configuración** (toda la
  primera pantalla) → pestañas → evolución del saldo → velas → tres anillos →
  y al final las tarjetas «Este mes» (saldo actual, cierre estimado, ahorro
  esperado, gastos estimados).
- **Solución.** Primera pantalla, en este orden:
  1. **Hoy tienes** X € (con la fecha del último saldo real).
  2. **A fin de periodo tendrás** Y € (± banda si hay contabilidad).
  3. **Tu punto más bajo** será Z € el día D — en rojo si cruza el colchón o un
     margen, con el aviso de antelación que ya calcula `engine/avisos.ts`.
  4. **Este mes**: ingresos, gastos, ahorro esperado.
  5. Próximos 7 días.

  Después la gráfica, y el resto bajo pestañas. La configuración sale del flujo
  (`UX-14`).
- **Hecho cuando** en 390×664, sin desplazar, se ven los puntos 1 a 3.
- **Aplicado (2026-11-16), parcial.** La tarjeta «Este mes» (`NEW-09`) es lo primero que se ve y la de Configuración nace plegada. **Pendiente**: saldo de hoy, saldo a fin de periodo y punto más bajo en la primera pantalla; sacar la configuración a un botón ⚙ (`UX-14`).

#### [ ] UX-13 · Gráficas

- **Prioridad** P2 · **Esfuerzo** M · **Evidencia** ✔
- **Problemas y solución.**
  - «Velas del saldo»: el eje empieza en 0 y con saldos altos las velas son
    rayas ilegibles → eje automático con margen; en móvil, ocultarlas tras
    «Ver detalle».
  - Tres anillos seguidos («Distribución media mensual», «Desglose otros
    gastos», «Distribución de saldos») → dejar uno; los otros dos como barras
    horizontales ordenadas, que se leen mejor con más de cuatro categorías.
  - Nombres truncados («Fondo indexado M…») → dos líneas o `title`.
  - Modos «▲ Apilado» y «▽ Apilado» con el mismo nombre → «Apilado» y
    «Apilado inverso», o quitar uno.
  - En táctil, mostrar el valor al arrastrar el dedo, no solo al pasar el ratón.
  - Marcar «hoy» con una línea vertical y distinguir pasado (real) de futuro
    (estimado) con trazo continuo y discontinuo.

#### [ ] UX-14 · Controles duplicados y configuración en primer plano

- **Prioridad** P2 · **Esfuerzo** S · **Evidencia** ✔
- **Problema.** Dos botones «Actualizar» en la misma pantalla; «Fecha
  referencia» repite «Simulación desde»; «Filtrar cuentas» y «Etiquetas como
  categoría propia» son ajustes que se tocan una vez y ocupan la cabecera
  siempre; la línea «Ref. …: Cuenta nómina 5230,55 € · …» repite los saldos.
- **Solución.** Un icono ⚙ que abre «Ajustes del cuadro de mando». El filtro de
  cuentas, como selector compacto junto al título. Quitar «Actualizar» cuando
  el recálculo perezoso (ya implementado) lo hace innecesario; si los datos
  están caducados, un aviso «Hay cambios · Recalcular».

#### [ ] UX-15 · Pestañas del cuadro de mando

- **Prioridad** P3 · **Esfuerzo** S
- En móvil las cuatro pestañas (Resumen, Préstamos, Por persona, Análisis por
  etiquetas) ocupan dos líneas → carrusel horizontal. «Por persona» solo debe
  aparecer si hay más de una persona.

### 5.4 Gastos e ingresos

#### [ ] UX-16 · En móvil la fila pierde información y acciones

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔
- **Ficheros** `expenses/expenses.css:10-11`, `src/features/expenses/index.ts` (`fila`)
- **Problema.** Por debajo de 900 px se ocultan (`.exp-col-hide`) la cuenta, el
  interruptor **Activo** y todas las marcas (básico, deseo, reparto, expirado,
  ajustada): en móvil no se puede activar ni desactivar un gasto. La cabecera
  de tabla se parte en dos líneas sin utilidad.
- **Solución.** Tarjeta apilada en móvil: concepto e importe arriba; debajo
  frecuencia · cuenta · marcas; el interruptor a la derecha; duplicar, editar y
  eliminar dentro de un menú «⋯». Sustituir la cabecera por «Ordenar por ▾».

#### [ ] UX-17 · El formulario de gasto

- **Prioridad** P1 · **Esfuerzo** M · **Evidencia** ✔
- **Problema.** «Frecuencia: 1» + «Tipo frecuencia: Mensual» obliga a traducir
  («anual» = 12 + Mensual; «semanal» = 7 + Diaria). El día de cobro y la fecha
  de fin están dentro de «Opciones». Las etiquetas son un texto separado por
  comas. El foco no entra en «Concepto». «Único» sigue mostrando «Frecuencia».
- **Solución.** Un solo selector «Se repite»: No (fecha) · Cada semana · Cada
  mes · Cada 2/3/6 meses · Cada año · Personalizado (N días/meses). Día de
  cobro visible cuando se repite por meses. Etiquetas como fichas con
  autocompletado de las existentes. Importe con `inputmode="decimal"`
  aceptando coma. Opción «Guardar y añadir otro».

#### [ ] UX-18 · La lista no suma ni agrupa

- **Prioridad** P2 · **Esfuerzo** M
- **Solución.** Cabecera de resumen de lo filtrado: ingresos/mes, gastos/mes
  (prorrateando anuales y semanales), neto. Segmentos «Gastos · Ingresos ·
  Transferencias» en lugar de un desplegable. Agrupar por etiqueta opcional.
  Los puntuales ya pasados se archivan solos bajo «Pasados». Filtros de fecha
  plegados tras «Filtros».

#### [ ] UX-19 · «Eliminar» siempre a la vista junto a «Editar»

- **Prioridad** P2 · **Esfuerzo** S
- El botón rojo `✕` está a 8 px del de editar, con dianas de 32 px. Llevarlo al
  menú «⋯» o al pie del formulario de edición. Aplica igual a Préstamos,
  Nóminas y Cuentas.

### 5.5 Préstamos

#### [ ] UX-20 · Tarjeta y cuadro de amortización

- **Prioridad** P2 · **Esfuerzo** M
- **Solución.** Cabecera de la tarjeta con las tres cifras que importan: cuota
  actual, capital pendiente hoy, fecha de fin (y barra de progreso). Cuadro de
  amortización plegado por años, con primera columna fija en móvil. Acción
  principal «¿Y si amortizo…?» (importe, fecha, reducir cuota o plazo) con el
  ahorro de intereses a la vista; hoy está dentro de la tarjeta sin destacar.
  Validación del formulario (`BUG-17`).

### 5.6 Nóminas

#### [ ] UX-21 · El dato principal debe ser el neto que llega al banco

- **Prioridad** P2 · **Esfuerzo** M
- **Solución.** Tarjeta: «Neto mensual X € · Paga extra Y € (junio y
  diciembre)». Formulario en dos niveles: básico (bruto anual, número de pagas,
  cuenta, día de cobro) y avanzado (IRPF manual, SS, retribución flexible,
  grupo, IPC). Campo «Mi neto real es…» que calibra el IRPF manual para que el
  cálculo coincida con la nómina (`MEJ-04`).

### 5.7 Cuentas y contabilidad

#### [ ] UX-22 · Cabecera y tarjetas de cuenta

- **Prioridad** P2 · **Esfuerzo** M · **Evidencia** ✔
- **Problema.** En móvil la cabecera apila tres botones grandes; el primero es
  «⚙ Tramos ganancias capital», un ajuste fiscal que casi nunca se toca.
  «Actualizar saldo base» no explica qué hace. Las tarjetas repiten «Sin
  histórico» hasta tres veces y dan el mismo peso al saldo inicial que al
  actual.
- **Solución.** Acción principal única («+ Cuenta»); el resto, en «⋯». Tarjeta:
  saldo actual grande con su fecha («a 16 nov»), y debajo una línea de detalle;
  el saldo inicial solo en edición. Acción directa «Actualizar saldo» en cada
  tarjeta (es el gesto más frecuente). Orden: principal, resto de cuentas,
  inversión, pensiones.

#### [ ] UX-23 · Movimientos

- **Prioridad** P2 · **Esfuerzo** M
- **Ficheros** `src/features/accounts/transactions-panel.ts:343, 394, 768`
- **Problema.** El importe se edita con `window.prompt`. La estimación se
  asigna con un desplegable de 11 px. No hay selección múltiple.
- **Solución.** Edición en línea o en hoja; selector de estimación con búsqueda;
  selección múltiple para asignar, etiquetar o borrar varios a la vez; filtro
  «sin asignar» destacado con su contador.

#### [ ] UX-24 · Importar CSV

- **Prioridad** P2 · **Esfuerzo** M
- **Ficheros** `src/features/accounts/import-panel.ts`
- **Solución.** Zona de arrastrar y soltar; recordar el mapeo de columnas por
  cuenta; vista previa que marque las filas con error y por qué; al terminar,
  resumen («128 importados, 3 duplicados, 1 con error») con «Deshacer esta
  importación» (guardar un `loteId` en cada movimiento) y pregunta opcional por
  el saldo final para crear el punto de control.

#### [ ] UX-25 · Cierre y precisión

- **Prioridad** P2 · **Esfuerzo** S
- Hay que ir a buscarlo. Añadir en el cuadro de mando, del día 1 al 10, la
  tarjeta «Octubre está sin cerrar · Revisar» y el resultado del último cierre
  («Gastaste 142 € más de lo estimado»).

### 5.8 Ventanas del menú

#### [ ] UX-26 · Administrar datos

- **Prioridad** P2 · **Esfuerzo** M
- **Ficheros** `data-io/data-io.js:230-380`
- **Problema.** Mezcla proveedor, sesión y huella sin decir lo esencial: cuándo
  fue la última copia. Dropbox no tiene «Cargar copia» ni autoguardado y
  Firebase sí. Los botones «↓ Firebase → JSON» y «↑ JSON → Firebase» son
  crípticos.
- **Solución.** Tres bloques: **Copia en la nube** (estado: «Última copia hoy a
  las 14:02 · 84 KB · todo guardado», Guardar ahora, Restaurar, autoguardado),
  **Fichero** (Exportar, Importar), **Sesión y bloqueo**. Mismas acciones para
  cualquier proveedor.

#### [ ] UX-27 · Proyectos y Personas

- **Prioridad** P3 · **Esfuerzo** S
- Renombrar en línea en vez de `prompt`. Al cambiar de proyecto con cambios sin
  subir, avisar antes de recargar. En Personas, color elegible y explicación de
  una línea de para qué sirve («para repartir gastos; si vives solo, no la
  necesitas»).

#### [ ] UX-28 · Funcionalidades

- **Prioridad** P3 · **Esfuerzo** S
- «Sincronización en la nube» y «Autoguardado» aparecen como interruptores,
  pero se gestionan en «Administrar datos»: enlazar o unificar. Los flags que
  dependen de otro deben decir de cuál al estar bloqueados (ya existe
  `bloqueadaPor`).

#### [ ] UX-29 · Buscador

- **Prioridad** P3 · **Esfuerzo** S
- Añadir acciones además de datos («Nuevo gasto», «Importar extracto»,
  «Guardar ahora») y mostrar las últimas búsquedas al abrir. En móvil el botón
  «Buscar» pasa a ser un icono en la cabecera (`UX-01`).

---

## 6. Mejoras sobre lo que ya existe

Ordenadas por valor para el usuario descrito en la sección 1.

#### [ ] MEJ-01 · Sincronización que fusiona en lugar de elegir — Esfuerzo L

Hoy un conflicto obliga a tirar una de las dos copias enteras. Añadir a cada
elemento `actualizadoEn` y, para los borrados, lápidas por colección; al
sincronizar, fusionar por `_id` quedándose con la versión más reciente de cada
elemento. `config` se fusiona clave a clave. El diálogo de conflicto queda solo
para el caso de un mismo elemento editado en los dos sitios. Construir sobre
`BUG-03`. Es la mejora de mayor impacto para quien usa móvil y portátil.

#### [ ] MEJ-02 · Guardado automático de verdad — Esfuerzo M

Con nube conectada, activado por defecto: subir 30 s después del último cambio y
al ocultarse la pestaña (`visibilitychange`), no cada N minutos. Sustituir el
aviso «Tienes cambios sin guardar» por un indicador discreto y permanente en la
cabecera: «✓ Guardado · hace 2 min» / «Guardando…» / «Sin conexión · 3 cambios
pendientes». Requiere `BUG-03`.

#### [ ] MEJ-03 · Importación de extractos — Esfuerzo M–L

- Aceptar **Excel** (`.xls/.xlsx`), que es lo que exportan por defecto varios
  bancos españoles, y **Norma 43**. Cargar el lector de Excel solo al usarlo.
- **Reglas que aprenden**: al asignar «MERCADONA…» a la estimación
  «Supermercado», ofrecer «Hacer siempre lo mismo con los que contengan
  “MERCADONA”». Aplicarlas en cada importación y mostrarlas en una lista
  editable.
- **Traspasos entre cuentas propias**: detectar pares de mismo importe y signo
  contrario en fechas cercanas y marcarlos como transferencia.
- Corregir duplicados (`BUG-11`).

#### [ ] MEJ-04 · Nóminas fiables — Esfuerzo M

Tras `BUG-21`: situación familiar mínima (hijos, declaración conjunta) para el
mínimo personal y familiar; «calibrar con mi nómina real» (se introduce el neto
de un mes normal y el de una extra, y la aplicación ajusta el tipo); aviso anual
«revisa tu retención de enero».

#### [ ] MEJ-05 · Hipotecas a tipo variable — Esfuerzo M

Hoy «variable» es solo una etiqueta. Añadir revisiones (fecha, nuevo tipo) que
recalculen la cuota desde esa fecha, y un «¿y si el tipo sube/baja 1 punto?»
que muestre la nueva cuota sin guardar nada.

#### [ ] MEJ-06 · Seguimiento del mes en curso — Esfuerzo M

El cierre mira meses terminados. Añadir «Este mes» en vivo: por categoría,
gastado frente a estimado con barra de progreso y el ritmo («llevas el 80 % del
súper a día 16»). Responde a la pregunta 3 sin esperar a fin de mes.

#### [ ] MEJ-07 · Avisos con antelación — Esfuerzo S–M

El motor ya detecta los cruces (`src/engine/avisos.ts`). Mostrarlos en la
primera pantalla (`UX-12`) y, opcionalmente, como notificación local al abrir la
aplicación. Incluir los cargos anuales grandes («En 10 días: seguro del coche,
480 €»).

#### [ ] MEJ-08 · Proyectos — Esfuerzo S

Lápidas y borrado remoto (`BUG-14`); sincronizar la lista también con Dropbox si
se mantiene; mostrar en cada proyecto cuándo se subió por última vez.

#### [ ] MEJ-09 · Personas: quién debe a quién — Esfuerzo M

Ya se distingue quién paga de quién consume. Falta el resultado: para el periodo,
el saldo entre personas («Ana debe 184,30 € a Luis») y un botón «Liquidar» que
lo deje a cero creando el movimiento. Comprobar antes qué muestra hoy la pestaña
«Por persona» para no duplicar.

#### [ ] MEJ-10 · Puntos de restauración locales — Esfuerzo M

Guardar automáticamente las últimas 5 copias completas (IndexedDB) antes de
cada importación, restauración desde la nube, migración o borrado masivo, con
«Restaurar» en «Administrar datos». En modo local, recordar cada 30 días que se
exporte una copia.

#### [ ] MEJ-11 · Deshacer más cosas — Esfuerzo M

Hoy solo se deshace el último borrado, durante 15 s. Extenderlo a ediciones y a
lotes (importación, «quitar simulaciones», borrado múltiple).

#### [ ] MEJ-12 · Sacar los datos — Esfuerzo S

Exportar a CSV los movimientos reales y el extracto proyectado; hoja de estilos
de impresión para el cuadro de mando (un «informe del periodo» en una página).

#### [ ] MEJ-13 · Estimaciones del mes que «bailan» — Esfuerzo M — *pedido por el propietario (2026-11-16)*

Las cifras estimadas por periodo cambian de un día para otro sin que cambien los
datos. Antes de tocar, **reproducir y medir** con un estado fijo variando solo
«hoy» y el periodo. Sospechosos, por orden:
1. Medias mensuales calculadas dividiendo por días/30,44 sobre una ventana que
   depende de «hoy» o del periodo elegido, en vez de por meses naturales.
2. Gastos con periodicidad en días («cada 7/14/30 días») que caen 4 o 5 veces
   según el mes: es correcto, pero hay que mostrarlo como rango o media, no
   como salto.
3. Mezcla de real y estimado dentro del mes en curso según la fecha de
   «Simulación desde».
4. Cuotas anuales prorrateadas en unas tarjetas y no en otras.
5. La gráfica de saldo suaviza con curva entre eventos: el trazo debería ser
   escalonado.

Criterio de «fino»: el total estimado de un mes natural **no cambia** al avanzar
el día dentro de ese mes ni al cambiar el periodo visible, salvo que entren
datos reales. Test que lo fije.

**Aplicado (2026-11-16), parcial.** (1) Las medias mensuales dividen por meses
de calendario (`engine/mes.mesesDeCalendario`) en vez de milisegundos/30,44.
(2) Los atajos de periodo dan N meses exactos (del 16 al 15): con un día de más
lo que vence ese día contaba dos veces. (3) La tarjeta «Este mes» sale del mes
natural completo y no depende del periodo ni del día. (4) La línea de saldo
estimado es escalonada, sin curva entre cargos. **Pendiente**: reproducir con
los datos reales del propietario qué cifra concreta sigue bailando (puntos 2 a
4 de la lista de sospechosos) y fijarla con un test.

---

## 7. Funcionalidades nuevas

Solo las que sirven a una de las tres preguntas de la sección 1.

#### [ ] NEW-01 · «¿Puedo permitírmelo?» — Esfuerzo M — pregunta 2

Tras retirar Supuestos y el planificador (migración 010), la pregunta 2 no tiene
respuesta directa. Sin recuperar aquella complejidad: un botón en el cuadro de
mando que pide **importe, fecha y, si se quiere, financiación** (meses y tipo), y
responde en el acto, sin guardar nada: saldo mínimo resultante y cuándo, si
cruza el colchón, y cuántos meses tarda en recuperarse. Con «Guardarlo como
gasto» si se decide. Reutiliza `generarExtracto` con un evento añadido.

#### [ ] NEW-02 · Apunte rápido desde el móvil — Esfuerzo M

Botón flotante «+» en todas las vistas: importe, concepto (con sugerencias de
los últimos), cuenta. Tres toques. Añadir `shortcuts` al manifiesto («Nuevo
gasto», «Actualizar saldo») para lanzarlo desde el icono de la aplicación.

#### [ ] NEW-03 · Detectar gastos recurrentes que no están estimados — Esfuerzo M — pregunta 1

Con los movimientos importados, encontrar cargos que se repiten (mismo comercio,
periodicidad e importe parecidos) sin estimación asociada, y proponer:
«Netflix, 13,99 € cada mes desde marzo · Añadir a mis gastos». Es la forma más
barata de mejorar la proyección sin teclear.

#### [ ] NEW-04 · Calendario de cobros y pagos — Esfuerzo M

Vista de mes con los cargos y abonos previstos por día y el saldo proyectado al
final de cada día (rojo si baja del colchón). Amplía «Próximos 7 días». El
legacy tuvo un `CalendarModule` muerto: no rescatarlo, hacerlo sobre el motor
nuevo.

#### [ ] NEW-05 · Patrimonio neto — Esfuerzo S

Una cifra y una línea: cuentas + inversión + pensiones − capital pendiente de
los préstamos, con su evolución. Todos los datos existen ya.

#### [ ] NEW-06 · Metas de ahorro ligeras — Esfuerzo M — *requiere decisión*

Los objetivos se retiraron al simplificar. Si se echan de menos: una meta =
nombre, importe, fecha y cuenta, y un único indicador («a este ritmo llegas en
mayo de 2027, dos meses tarde»). Sin prioridades ni reparto de flujo, que es lo
que complicó el planificador.

#### [ ] NEW-07 · Revisión anual de contratos — Esfuerzo S

Para gastos anuales o marcados como «revisable» (seguros, suscripciones, luz):
aviso 30 días antes de la renovación con el importe del año anterior.

#### [ ] NEW-08 · Compartir un proyecto con otra persona — Esfuerzo L — *requiere decisión*

Para quien lleva las cuentas en pareja: un proyecto bajo una ruta compartida de
Firestore con su propia clave de cifrado, que cada uno desbloquea. Exige
`MEJ-01` (fusión) y reglas nuevas. Solo si hay demanda real.

#### [x] NEW-09 · «Este mes» desglosado: préstamos, facturas, resto y margen de ahorro — Esfuerzo M — *pedido por el propietario (2026-11-16)*

En la primera pantalla del cuadro de mando (va con `UX-12`), para el mes en
curso:

| Bloque | Qué suma |
|---|---|
| **Préstamos** | Cuotas y amortizaciones previstas del mes (`sourceType: 'loan'`) |
| **Facturas** | Gastos fijos recurrentes: ver detección abajo |
| **Otros gastos esperados** | El resto de gastos estimados del mes (variables, puntuales) |
| **Margen de ahorro esperado** | Ingresos del mes − los tres bloques anteriores, en € y en % de los ingresos |

Cada bloque: importe total, cuánto ha vencido ya y cuánto queda por cargar en
lo que resta de mes, y al tocarlo, la lista de conceptos con su día.

**Cómo detectar una «factura».** Por este orden, de modo que funcione sin tocar
nada y se pueda corregir a mano:
1. Marca explícita: campo nuevo `Expense.esFactura?: boolean` (interruptor
   «Es una factura / recibo» en el formulario).
2. Si no hay marca, heurística: gasto **recurrente** (no «único», no diario),
   con día de cargo fijo o periodicidad de 1, 2, 3, 6 o 12 meses, y clasificado
   como necesidad o básico.
3. Refuerzo por etiqueta o concepto: `luz`, `gas`, `agua`, `internet`, `fibra`,
   `móvil`, `teléfono`, `seguro`, `comunidad`, `alquiler`, `ibi`, `basuras`,
   `suscripción`, y los comercios que `NEW-03` detecte como recurrentes.
4. Lo que la heurística proponga se enseña una vez como sugerencia («Hemos
   tratado estos 6 gastos como facturas · Revisar») y la respuesta se guarda en
   `esFactura`.

**Hecho cuando**: la suma de los cuatro bloques cuadra con «Gastos estimados» y
«Ahorro esperado» actuales para el mismo mes; hay tests del clasificador; los
anuales solo cuentan en el mes en que vencen.

#### [x] NEW-10 · «Meses anteriores» desde la tarjeta «Este mes» — *pedido por el propietario (2026-11-17)*

Botón en la tarjeta que abre una ventana con: periodo seleccionable (3, 6 o 12
meses, este año o meses a elegir, hasta 36), barras apiladas de préstamos,
facturas y otros gastos por mes, gráfica aparte de impacto en el ahorro (margen
de cada mes y acumulado del periodo), selección de mes al pulsar cualquiera de
las dos gráficas o su ficha (desglose por grupo y concepto, como en la
tarjeta), y vista «Acumulado del periodo» con totales y media mensual por
grupo. Importes estimados, como la tarjeta. **Siguiente paso posible**: un
conmutador «estimado / real» que use los movimientos importados y su
asignación a estimaciones.

**Añadido (2026-11-20)**: tercera vista, «Media del periodo», entre «Mes
seleccionado» y «Acumulado del periodo»: cada grupo y cada concepto divididos
entre los meses del periodo (los vacíos cuentan), con el total del periodo en
cada bloque y el margen medio recalculado sobre las cifras redondeadas.

**Añadido (2026-11-20)**: la ventana pasa a llamarse «Otros meses» y mira
también al futuro: periodos de previsión (próximos 3, 6 o 12 meses, el año
completo, y fechas a elegir sin límite en el mes en curso). Los meses futuros
salen de lo configurado (gastos, nóminas, préstamos) y reservan la estimación
de imprevistos, que se ve como un tramo translúcido «Imprevistos estimados» en
las barras y se descuenta del margen. La zona de previsión va sombreada en las
dos gráficas y las fichas de los meses futuros llevan borde discontinuo.

#### [x] NEW-11 · Imprevistos: marca, seguimiento y estimación automática — *pedido por el propietario (2026-11-17)*

- **Marca «Imprevisto»** en un gasto (interruptor en el formulario, solo para
  gastos) y en un movimiento real (⚡ en su fila, casilla al registrarlo, y
  «⚡ Imprevisto» en los grupos sin prever del cierre de mes, que marca todos
  sus movimientos). Un movimiento marcado solo cuenta si NO está asignado a una
  estimación: asignado, cuenta a través de ella y no se duplica. La marca de
  imprevisto tiene prioridad sobre la de factura.
- **Quinto bloque «Imprevistos»** en «Este mes» y cuarta serie, arriba del
  todo, en las barras de «Meses anteriores» (color validado para daltonismo
  con los otros tres).
- **Estimación automática**: media mensual de lo marcado en los 12 meses
  anteriores al mes en curso (sin contarlo); con menos de un año de
  seguimiento, entre los meses que hay desde el primer movimiento registrado o
  el primer imprevisto. En el mes en curso se reserva lo que falte hasta la
  estimación y se descuenta del margen de ahorro; si ya se ha gastado más, se
  avisa de cuánto se ha pasado.
- **Pendiente, a decidir**: llevar la estimación también a la proyección de
  saldo (gráfica y extracto) como un gasto mensual sintético.

#### [x] NEW-12 · «Crear informe»: pasado real y previsión, cuadrados — *pedido por el propietario (2026-11-20)*

Botón «Crear informe» en el menú lateral y en la cabecera del cuadro de mando.
Se elige el periodo (seis meses atrás y seis adelante, últimos 12 meses, el año,
próximos 12 meses o fechas a elegir) y el informe se abre en una pestaña como
página autónoma —sin red, lista para imprimir o guardar como PDF— o se descarga
como `.html`.

**Diseño (revisado el 2026-11-20: contra el saldo de las cuentas).** El
propietario pidió que el informe no use la contabilidad desglosada: lo real es
el **saldo de cada cuenta** en cada fecha (saldo inicial y saldos anotados, con
`FinanceMath.saldoEnFecha`, lo mismo que el cuadro de mando) y lo previsto es el
extracto del mismo motor que el cuadro de mando. No se mira movimiento a
movimiento. El periodo se parte en el **último saldo real conocido** (el
«corte», `fechaUltimoSaldoConocido`), que es también donde el cuadro de mando
ancla su previsión: por eso los dos dan el mismo saldo final.

1. **Resumen**: saldo real al empezar, último saldo real, diferencia frente a
   lo previsto, saldo final previsto (con la reserva para imprevistos) y el
   mínimo previsto; gráfica con el saldo real, lo que se preveía al empezar el
   periodo y la previsión desde el corte.
   **Puente de saldo**: saldo real al empezar + ingresos previstos − gastos
   previstos (± intereses y traspasos) = saldo previsto al corte; ± diferencia
   con el saldo real = saldo real al corte; + lo previsto hasta el final =
   saldo previsto al final; − reserva para imprevistos.
2. **El pasado, saldo previsto frente a saldo real**: «debías tener», «tienes»,
   diferencia; y lo que estaba previsto en ese tramo por grupo (solo previsto:
   la diferencia no se reparte entre grupos).
3. **Mes a mes**: los meses pasados acaban en el saldo real de sus cuentas; en
   cada fila, saldo inicial + ingresos − gastos + otros + diferencia = saldo
   final. El mes del corte es real + previsto; los siguientes, previsión.
4. **Cuentas**: al empezar, previsto y real en el corte, diferencia, final
   previsto y fecha del último saldo anotado.
5. **Comprobaciones** (puente, tabla, cuentas, cuadro de mando) y **avisos**:
   cuentas sin saldo o con el último de hace más de 30 días, meses sin ningún
   saldo anotado, y que desde el corte hasta hoy ya es previsión.

**Limitación conocida**: una cuenta que no se actualiza cuenta con su último
saldo anotado también en el corte (igual que en el cuadro de mando), así que lo
que se le preveía desde entonces aparece como diferencia. El informe lo avisa.
Proyectar cada cuenta desde su propio último dato exige cambiar también el
ancla del cuadro de mando (`_anclaSaldo`).

#### [x] BUG-29 · El cuadro de mando y «Otros meses» no cuadraban — *propietario (2026-11-20)*

Comparando mes a mes la gráfica de saldo, las barras de ingresos y gastos y
«Otros meses», con los mismos datos:

1. **Intereses y rentabilidad.** La línea de saldo y la barra «Ingresos» los
   contaban; el margen de «Otros meses» no (a propósito: no es dinero para
   gastar). Con un fondo al 6 % la diferencia era de ~640 €/mes. Ahora el
   margen sigue sin contarlos, pero cada mes dice «con +X de intereses y
   rentabilidad, el saldo sube Y», la gráfica de ahorro añade la línea «Saldo
   (con intereses)», y en las barras del cuadro de mando van en su propia serie.
2. **Reserva de imprevistos.** «Otros meses» la descontaba en los meses futuros
   y la proyección del cuadro de mando no. Ahora la decide el toggle de abajo,
   y cuando está activo la reserva va dentro del extracto: la cuentan la línea
   de saldo, el mínimo, las alertas, las barras, la tarjeta, «Otros meses» y el
   informe.
3. **Barras de ingresos y gastos.** Las aportaciones a fondos contaban como
   ingreso (la entrada en el fondo) sin contar como gasto; las amortizaciones
   anticipadas no salían en «Cuotas»; los gastos que no vienen de una ficha
   (impuestos de fondos, inflación) no salían en ninguna barra. Ahora ingresos
   + rentabilidad − gastos − reserva de cada barra es exactamente lo que se
   mueve la línea de saldo (la ayuda emergente lo dice).

Comprobado en el navegador: barras, línea de saldo y «Otros meses» coinciden
al céntimo mes a mes, con el toggle activo y apagado. La única diferencia que
queda es a propósito: los imprevistos REALES registrados en Cuentas cuentan en
«Otros meses» pero no están en la previsión; el bloque de imprevistos lo dice.

#### [x] NEW-13 · Toggle «Contar imprevistos» — *propietario (2026-11-20)*

En la tarjeta «Este mes» y en «Otros meses» (la misma opción,
`config.contarImprevistos`, activa por defecto). Activo: desde hoy, la
proyección aparta la estimación de imprevistos (media de lo marcado en los 12
meses anteriores): en el mes en curso lo que falta hasta la media, fechado hoy;
desde el mes siguiente la media entera el día 1. La calcula
`engine/mes.reservaParaProyeccion` y la mete `FinanceMath.generarExtracto` como
eventos `imprevisto-estimado` (`config.reservaImprevistos`, que no se guarda).
El informe la toma del mismo extracto. Apagado: no se aparta nada en ninguna
pantalla.

#### [x] BUG-30 · No se podía escribir el año en los campos de fecha — *propietario (2026-11-24)*

Dos causas, revisadas en todos los campos de fecha (30 por dispositivo,
medidos en el navegador en escritorio y móvil):

1. **Anchos fijos.** Cinco campos eran más estrechos que la fecha y el año
   quedaba cortado: el punto de un margen de seguridad (130 px, necesita 144)
   y los de Cuentas `acc-mes`, `acc-periodo-desde/hasta` (140, necesitan 165);
   la barra de periodo y el intervalo de Cuentas iban al límite. Regla común en
   `common/components.css`: un campo de fecha o de mes nunca es más estrecho que
   su contenido (`min-width: max-content`), sea cual sea la tipografía o el
   formato de fecha.
2. **Repintar mientras se escribe.** Chrome dispara `change` en cuanto lo
   escrito forma una fecha completa, y como los campos llegan rellenos eso
   pasa con la primera tecla. Las pantallas que guardan y repintan en `change`
   (puntos de un margen, barra de periodo, filtros de Cuentas, «Otros meses»)
   sustituían el campo a mitad de escribir. `ui/campos-fecha` (instalado al
   arrancar) aguanta ese `change` mientras se teclea y lo dispara una vez al
   salir del campo o con Intro; elegir en el calendario sigue aplicando al
   momento. Ojo: en ese momento Chrome deja el foco en las piezas internas del
   campo y `document.activeElement` es el `<body>`; solo `:focus-within` lo ve.

Comprobado tecleando fechas completas en esos cinco campos, en escritorio y
móvil, sin desbordes en ninguna pantalla.

#### [x] NEW-14 · Previsión corregida con saldo real — *propietario (2026-11-24)*

Sin corregir, la línea de saldo sale de UN solo saldo real (el de «Simulación
desde») y lo demás se proyecta: el error de cada mes se arrastra a todos los
siguientes. Toggle «Corregir con saldo real» en «Evolución del saldo»
(`config.corregirConSaldoReal`, apagado por defecto): cada cuenta vuelve a su
último saldo real de cada mes y la previsión sigue desde ahí (si se preveían
1000 € a fin de enero y hubo 800, febrero parte de 800).

- Motor: `FinanceMath._corregirConSaldoReal`, dentro de `generarExtracto`.
  Una vez al mes, en la última fecha con algún saldo real, el TOTAL vuelve a la
  suma de `saldoEnFecha` de las cuentas: la misma regla que la serie
  «Histórico» y que el ancla, así que la línea corregida pasa justo por los
  puntos reales en los que corrige. Cada corrección es UN evento por fecha,
  `tipo: 'ajuste'`, `sourceType: 'ajuste-saldo-real'`, sin cuenta, con el
  salto en `delta` y lo previsto y lo real (`saldoPrevisto`, `saldoReal`):
  mueve el saldo, pero no cuenta como ingreso ni gasto en ninguna parte.
- Primera versión (corregida el mismo día tras verla con datos reales): iba
  cuenta a cuenta. Con varias cuentas el mismo día la línea escalonada pintaba
  picos con los totales intermedios (hasta saldos negativos que no existían), y
  una cuenta sin actualizar seguía sumando lo previsto para ella, así que la
  línea se separaba del histórico.
- Gráfica: la línea corregida es la principal (y de ella salen el saldo final,
  el mínimo y las alertas); la previsión sin corregir va atenuada y
  discontinua; cada corrección es un punto con lo que se preveía y lo que había.
- El informe sigue comparando previsto frente a real a su manera (su extracto
  es el sin corregir); la comprobación contra el cuadro de mando usa el
  cuadro de mando tal como esté.

#### [x] NEW-15 · Margen de error medido contra el saldo real — *propietario (2026-11-24)*

La banda «Margen de error» de «Evolución del saldo» salía de la contabilidad de
Cuentas (cada gasto estimado frente a los movimientos asignados), que exige
tener los movimientos bien clasificados; el propietario indica que esa parte
no está fina. Ahora sale SOLO de los saldos reales (`engine/precision-saldo`):

- Cada corrección con saldo real (NEW-14) es el error de la previsión a un
  mes: desde el saldo real anterior, con todo lo previsto entre medias, se
  esperaba X y había Y. Se mide siempre sobre los 13 meses anteriores a hoy,
  esté o no activo el toggle, y también cuentan los meses acertados (0 €).
- Cuentan los de 20 a 45 días entre saldos reales, no el primero de la serie
  (parte del ancla), y no los atípicos: a más de 3,5 desviaciones robustas de
  la mediana Y más del 30 % de lo que entra en un mes (mín. 100 €), el tamaño
  de un desfase de fechas con un pago grande. Se dicen, con la causa probable
  si hay un movimiento grande previsto a ±3 días.
- Rótulo: «de media, acabas el mes X € mejor/peor de lo previsto, con una
  dispersión de ±Y € al mes». Banda: ruido = dispersión (crece con √m) y
  deriva = √(sesgo² + dispersión²/n) (crece con m: un sesgo se repite cada mes).
- Con menos de 3 meses medidos no hay banda, y el rótulo lo explica.

Pendiente, si se quiere: aplicar el sesgo a la previsión (una línea «ajustada
por el sesgo») con un toggle aparte; y llevar la cifra al informe.

**Descartado**: conexión directa con bancos (PSD2 exige servidor y licencia),
multimoneda, categorización con servicios externos (los datos saldrían del
dispositivo), y simulación Monte Carlo (ya se retiró).

---

## 8. Técnica y documentación

#### [ ] TEC-01 · Terminar la migración a `src/` — Esfuerzo L

Quedan en legacy: `dashboard/dashboard.js` (2.190 líneas), `auth/auth.js`,
`data-io/data-io.js`, `onboarding/`, `router/`, `ui/ui.js`, `common/state.js`,
`finance-math/` (1.736 líneas, ya portado y duplicado en `src/core` y
`src/engine`). Es la causa de fondo de `BUG-01`, `BUG-09`, `SEC-01` y `SEC-02`.
Orden sugerido: `state.js` como fachada (`BUG-01`) → router con rutas (`UX-02`)
→ onboarding → data-io y auth → cuadro de mando por pestañas → retirar
`finance-math.js`.

#### [ ] TEC-02 · Pruebas de extremo a extremo en CI — Esfuerzo M

Ninguno de los fallos P0 de este documento lo detecta la suite actual, porque
todos ocurren **entre** las dos capas. Añadir Playwright (ya disponible en el
entorno) con cinco flujos: alta completa, alta y edición de un gasto, importar
CSV, exportar e importar JSON, y dos dispositivos contra una nube simulada.
Servir Chart.js desde local como hace `tools/qa`. Zona horaria fija
`Europe/Madrid`.

#### [ ] TEC-03 · Documentación que ya no describe el repositorio — Esfuerzo S

- `README.md`: lista ficheros que no existen (`loans/loans.js`, `calendar/`,
  `goals/`, `dashboard/history.js`…), dice «sin bundler, sin npm» y que el
  bundle está en `.gitignore`.
- `docs/README.md`: «Estado actual (2026-07-30)», 127 tests, bundle no
  versionado.
- `vite.config.ts` e `index.html:527`: comentarios que dicen que el bundle no se
  versiona.
- `docs/03-planner.md`, `docs/03-informe-redundancias.md` y partes de
  `docs/05`: describen funciones retiradas en la v10. Añadir un aviso de
  «histórico» al principio.
- `firebase/firebase-service.js:4-9`: habla de «email + contraseña».

#### [ ] TEC-04 · Código muerto — Esfuerzo S

`FirebaseService.login/register`; `CryptoService.createVerificationToken/verifyKey`
(restos de Drive); `FinanceMath.filtrarPorEscenario`; las listas de reserva con
`goals` y `escenarios` en `auth.js:181`, `firebase-service.js:329` y
`data-io.js:26`; `auth/auth.html`; `gdrive-setup-tutorial.html`; el sorteo de
tres animaciones de carga (dejar una).

#### [ ] TEC-05 · Identificadores — Esfuerzo S

`uid()` es `Date.now()` + 5 caracteres aleatorios, repetido en tres ficheros.
Con importaciones en lote y dos dispositivos, usar `crypto.randomUUID()` en un
único helper.

#### [ ] TEC-06 · Almacenamiento en IndexedDB — Esfuerzo L

`localStorage` es síncrono, tiene ~5 MB por origen (compartido con los demás
proyectos y con otras aplicaciones del mismo origen, `SEC-07`) y guarda cada
colección entera en cada cambio. El store ya trabaja contra un `StorageAdapter`:
añadir uno sobre IndexedDB con migración automática desde `localStorage`.
Necesario antes de `MEJ-10`.

#### [ ] TEC-07 · Carga inicial — Esfuerzo M

Se descargan siempre tres scripts de Firebase y Chart.js desde CDN, bloqueando,
aunque el usuario use el modo local o no esté en el cuadro de mando. Cargar
Firebase solo al elegir ese modo y Chart.js al pintar la primera gráfica; servir
la fuente Outfit desde el propio origen. Unifica con `SEC-02`.

#### [ ] TEC-08 · PWA — Esfuerzo S

`shortcuts` en el manifiesto (`NEW-02`); aviso de versión nueva (`BUG-22`);
comprobar que el icono *maskable* tiene zona segura; pantalla «sin conexión»
coherente con `BUG-12`.

---

## 9. Hoja de ruta

| Fase | Objetivo | Tareas |
|---|---|---|
| **0 · Que no se pierda nada** | Cerrar todos los P0 y poner la red que los habría detectado | `BUG-25` (el primero: medio día y es el que más se sufre), `BUG-01`, `BUG-02`, `BUG-03`, `BUG-04`, `BUG-06`, `BUG-07`, `TEC-02` (flujos de alta y de dos dispositivos), `MEJ-10` (mínimo: copia previa a restaurar) |
| **1 · Seguridad y robustez** | Cerrar la vía de ejecución de código y los fallos de acceso | `SEC-01`, `SEC-04` + `BUG-24`, `SEC-05`, `SEC-07`, `SEC-08`, `BUG-05`, `BUG-08`, `BUG-09`, `BUG-11`, `BUG-12`, `BUG-15`, `BUG-16` |
| **2 · El móvil** | Que la consulta diaria quepa en una pantalla | `UX-12` + `NEW-09` + `MEJ-13` (primero: pedido expreso), `UX-01`, `UX-02`, `UX-03`, `UX-05`, `UX-14`, `UX-16`, `UX-17` |
| **3 · Confianza en el número** | Que la proyección se parezca al banco | `BUG-21`, `MEJ-04`, `MEJ-03`, `NEW-03`, `MEJ-06` |
| **4 · Sincronización sin pensar** | Dos dispositivos sin diálogos | `MEJ-01`, `MEJ-02`, `BUG-14`, `BUG-20`, `UX-26` |
| **5 · Las tres preguntas** | Respuesta directa a cada una | `NEW-01`, `MEJ-07`, `NEW-02`, `NEW-05`, `NEW-04` |
| **6 · Fondo** | Quitar la causa de los fallos de la fase 0 | `TEC-01`, `SEC-02`, `SEC-03` (pasos 2–3), `TEC-06`, `TEC-07`, resto de `UX-` y `TEC-` |

Dependencias que conviene respetar: `BUG-01` antes de cualquier otra tarea que
toque el legacy · `BUG-03` antes de `MEJ-01` y `MEJ-02` · `SEC-01` antes de
`SEC-02` · `UX-03` antes de `UX-04` y de los formularios · `BUG-21` antes de
`MEJ-04` · `TEC-06` antes de `MEJ-10` completo.

---

## 10. Apéndice: cómo se reprodujo

Para repetir las comprobaciones (o convertirlas en los tests de `TEC-02`):

- **Sin servidor**: Playwright abre `file:///…/index.html` e intercepta las
  peticiones a jsDelivr para servir Chart.js desde una copia local
  (`npm pack chart.js@4.4.3 chartjs-adapter-date-fns@3.0.0`); las de Google se
  abortan. Contexto con `timezoneId: 'Europe/Madrid'`.
- **Duplicados (`BUG-25`)**: en Gastos, repetir `[data-nuevo]` → rellenar
  `#ef-concepto`, `#ef-cuantia` → `#modal-content [data-guardar]` y contar
  `FinanceApp.store.get('expenses')` tras cada alta.
- **Alta**: `#btn-local` → `#welcome-start-btn` → asistente
  (`.wizard-actions .btn-primary` / `.btn-secondary`, campos `#wiz-saldo`,
  `#wiz-inc-concepto`, `#wiz-inc-cuantia`, `#wiz-exp-concepto`,
  `#wiz-exp-cuantia`) → comparar `localStorage['financeapp_state_expenses']`
  con `FinanceApp.store.get('expenses')`.
- **Datos sembrados**: por `FinanceApp.store.set/addItem` y `State.load()`,
  luego recargar.
- **Desplazamiento**: el que se desplaza es `main.view-container`, no el
  documento; las capturas de página completa no sirven, hay que mover su
  `scrollTop`.
- **Migración 010**: `createStore({ adapter: createMemoryAdapter({ state__schemaVersion: 9, state_expenses: [{…, escenarioIds: ['esc1'] }], state_escenarios: […], state_planes: […] }) }).load()`.
- **CSV**: `prepararFilas(analizarCsv('Fecha;Concepto;Importe\n01/11/2026;CAFE;-1,20\n01/11/2026;CAFE;-1,20\n'), mapeo, [])` → `[false, true]`.
- **IRPF**: `calcIRPF(desgloseBaseTrabajo(42000, 0).baseImponible, TRAMOS_IRPF_DEFAULT)` → 9.514,71.
