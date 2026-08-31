# 10 — El registro de proyectos también viaja a la nube

> Un proyecto creado en un dispositivo era invisible en cualquier otro,
> aunque sus datos sí se hubieran subido a Firebase. La lista de proyectos en
> sí nunca salía del dispositivo que la creó.
>
> Fecha: 2026-08-31.

---

## 1. Pedido

> «He creado en un dispositivo un proyecto nuevo y no lo puedo ver al cargar
> los datos en mi PC. Revisa que esté funcionando correctamente el
> guardado/cargado de proyectos en Firebase.»

## 2. Diagnóstico

`uploadBackup`/`downloadBackup` (`firebase/firebase-service.js`) suben y
bajan los DATOS de un proyecto — cuentas, gastos, préstamos... — en un
documento de Firestore por proyecto: `backup` para `default`, `backup_<id>`
para cualquier otro (`docs/08-proyectos.md`, §"Las copias en la nube son por
proyecto, no globales"). Funciona bien para eso.

El problema es lo que hace falta ANTES de poder pedir esa copia: saber que
el proyecto existe y cuál es su id. Esa información —la lista de proyectos
en sí, `{ _id, nombre, creadoEn, actualizadoEn }`— vivía SOLO en
`localStorage` (`financeapp_meta_proyectos`, ver `state/proyectos.ts`), y no
salía de ahí en ningún punto del código: ni `uploadBackup` ni
`downloadBackup` la tocan, y `_sincronizarDesdeNube` (`auth/auth.js`), el
único sitio donde la app trae algo de la nube al arrancar, solo pedía el
backup del proyecto que YA estuviera activo en ese dispositivo.

Consecuencia exacta del pedido: crear un proyecto en el móvil añade una
entrada nueva al `financeapp_meta_proyectos` DEL MÓVIL. El PC nunca se
entera — su propio registro local no cambia solo porque el móvil suba datos
a un documento de Firestore cuyo id el PC no tiene forma de adivinar. El
proyecto podía tener sus datos perfectamente subidos y seguir siendo
invisible en cualquier otro dispositivo.

## 3. Diseño: el registro es su propio documento, sincronizado en las dos direcciones

Un documento de Firestore FIJO — no depende del proyecto activo, es
justamente lo contrario: `users/<uid>/data/proyectos` — guarda la lista
completa, cifrada igual que un backup normal (`CryptoService.encryptPortable`
con la passphrase del usuario: los nombres de los proyectos son datos suyos
como cualquier otro).

```
firebase/firebase-service.js
  uploadRegistroProyectos()    → sube window.FinanceApp.proyectos.listar()
  downloadRegistroProyectos()  → baja y descifra esa lista, o null
```

### Fusión, no sustitución

`state/proyectos.ts` gana una función nueva:

```ts
fusionarRemotos(remotos: Proyecto[]): Proyecto[]
```

Añade los proyectos remotos que faltan localmente, y para los que ya existen
en los dos sitios se queda con el que tenga `actualizadoEn` más reciente.
Nunca borra un proyecto local que no esté en la lista remota — la remota
puede ir por detrás sin más motivo que "ese dispositivo aún no ha podido
subir su último cambio", y sustituir la lista entera se llevaría por delante
un proyecto real. El precio de fusionar en vez de sustituir es que un
proyecto ELIMINADO en un dispositivo puede tardar en desaparecer de otro que
llevaba tiempo sin conectarse — aceptable: converge en el próximo `crear`,
`renombrar`, `duplicar` o `eliminar` de cualquiera de los dos, que vuelve a
subir la lista con quien la tocó.

### Cuándo se sube y cuándo se baja

- **Al arrancar / iniciar sesión / reanudar sesión** (`auth/auth.js`,
  `_sincronizarRegistroProyectos`, llamada desde `_sincronizarDesdeNube`
  ANTES incluso del backup del proyecto activo): baja el registro remoto,
  lo fusiona con el local, y sube el resultado. Bidireccional en el mismo
  paso — así un dispositivo que se conecta por primera vez en semanas se
  pone al día con lo que otros hayan creado, y a la vez entrega lo que él
  sabía y los demás no.
- **Al crear, renombrar, duplicar o eliminar un proyecto**
  (`src/main.ts`, `proyectosAPI`): sube el registro actualizado de
  inmediato si hay una nube conectada — no espera al próximo autoguardado
  ni a que el usuario tenga algo más que guardar. Es lo que hace que crear
  un proyecto en el móvil lo lleve a la nube en el momento, no cuando el
  usuario vuelva a tocar un gasto.

Las dos rutas son "best-effort": si falla (sin conexión, lo que sea), se
registra en consola y no se interrumpe nada — igual que el resto de
escrituras en segundo plano de este arranque (el aviso de guardado, el
autoguardado).

### Por qué en `main.ts` y no en `state/proyectos.ts`

`crearServicioProyectos` es un módulo puro sobre un `Storage` cualquiera —
así es como tiene sus propios tests sin depender de Firebase ni de
`window`. Acoplarlo a Firebase ahí habría roto esa independencia para todos
sus consumidores, tests incluidos. El wrapper `proyectosAPI` en
`bootstrap()` (`main.ts`) ya hacía de puente entre el servicio puro y
`window.FinanceApp.proyectos` — es donde vive el resto de la fontanería
legacy (mismo patrón que `g.FirebaseService` para el aviso de guardado, unas
líneas más abajo en el mismo fichero), así que es donde toca añadir "y de
paso, sube el registro".

### Alcance: Firebase, no Dropbox

`DropboxService` tiene exactamente el mismo hueco (su propio `FILE_PATH()`
por proyecto, sin ningún sitio donde viva la lista). `_sincronizarRegistroProyectos`
está escrita para funcionar con cualquier `service` que implemente
`downloadRegistroProyectos`/`uploadRegistroProyectos` — con Dropbox, que no
los tiene, simplemente no hace nada (la llamada es opcional y se
comprueba antes). Si se pide luego, añadir la pareja de funciones a
`DropboxService` (un fichero en vez de un documento de Firestore) basta;
esta función no necesita tocarse.

## 4. Verificación

- 4 tests nuevos de `fusionarRemotos` en `tests/state/proyectos.test.ts`
  (añade lo que falta, no borra lo local, gana el más reciente en un
  conflicto de nombre, no revienta con entradas remotas inválidas) — 27 en
  total en ese fichero.
- `node tools/qa/comprobar-estaticos.mjs`: sintaxis de `firebase-service.js`
  y `auth.js` limpia (son legacy, sin cobertura de tests como el resto de
  ese directorio).
- Suite completa: 1228 tests, typecheck y lint limpios.
- Flujo completo en Chromium, simulando dos dispositivos con
  `window.FirebaseService` sustituido por un doble que registra las subidas
  en memoria:
  - Crear, renombrar y eliminar un proyecto disparan la subida del registro
    cuando hay una nube "conectada".
  - `fusionarRemotos` con un proyecto que solo existía en la copia remota lo
    hace aparecer de inmediato en `window.FinanceApp.proyectos.listar()` — y
    en la ventana «Proyectos» ya abierta, con todos sus botones (incluido
    «Cambiar a este»), sin recargar la página.
- De paso: la colección `personas` (añadida en `docs/09-personas.md`) no
  tenía etiqueta en la sección "Importar de otro proyecto" de esa misma
  ventana — salía en minúscula, sin traducir. Una línea en
  `ETIQUETAS_COLECCION` (`ui/proyectos-modal.ts`).
