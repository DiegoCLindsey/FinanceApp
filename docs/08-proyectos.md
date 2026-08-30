# 08 — Varios proyectos

> Varias instancias separadas de FinanceApp para un mismo usuario: cada
> proyecto tiene sus propias cuentas, gastos, préstamos... todo. Se puede
> cambiar entre ellos, duplicar uno entero, y traer colecciones sueltas de un
> proyecto a otro.
>
> Fecha: 2026-08-30.

---

## 1. Pedido

> «Añade funcionalidad para poder tener varios proyectos para un mismo
> usuario. Cada proyecto será una instancia diferente de FinanceApp, con sus
> gastos y todo separado. Se podrán importar de un proyecto a otro las cosas
> y se podrán duplicar proyectos.»

Tres piezas: proyectos separados de verdad (no una vista filtrada del mismo
estado), duplicar uno entero, e importar piezas sueltas de uno a otro.

## 2. Diseño: un espacio de nombres de localStorage por proyecto

Todo el estado de la aplicación —el store nuevo (`state/store.ts`) y el
`State` legacy (`common/state.js`)— ya pasa por un único punto de contacto con
`localStorage`: el `StorageAdapter`. Los dos escriben bajo el mismo prefijo
físico, `financeapp_`. El adapter nuevo (`state/storage/local.ts`) además ya
aceptaba un `namespace` inyectable desde antes de este trabajo (para tests),
así que la pieza que faltaba no era tocar el store — era decidir QUÉ prefijo
usar en cada arranque, y hacer que el resto del sistema (el `StorageAdapter`
legacy, y las rutas de copia en la nube) lo siguiera.

Un proyecto es, por tanto, un espacio de nombres:

```
default            → financeapp_state_...              (el de siempre)
cualquier otro id  → financeapp_p_<id>_state_...
```

`default` es especial y no lleva segmento. Es la decisión que hace que
activar esta funcionalidad no mueva ni un byte de los datos de quien ya
usaba la app: su proyecto único pasa a llamarse «Mis finanzas» (el nombre se
siembra solo, la primera vez que se lee el registro) sin ningún paso de
migración. Solo tiene una restricción que el resto de proyectos no tiene: no
se puede eliminar — ver más abajo por qué.

### El registro: dos claves fuera de cualquier proyecto

```
financeapp_meta_proyectos       → [{ _id, nombre, creadoEn, actualizadoEn }, ...]
financeapp_meta_proyectoActivo  → "<id>"
```

Si estas dos claves llevaran el prefijo de un proyecto, cada proyecto vería
un registro distinto — exactamente lo contrario de lo que hace falta para
poder cambiar entre ellos. Todo esto vive en `src/state/proyectos.ts`
(`crearServicioProyectos`), con 23 tests.

### Cambiar de proyecto recarga la página

`bootstrap()` (`src/main.ts`) calcula el espacio de nombres activo UNA vez,
al arrancar, y con él construye el adapter, el store, el ledger, las 12
vistas registradas, la sesión... todo. No hay ningún mecanismo para
reconstruir esa cadena en caliente a media sesión (y añadirlo solo para esto
sería una reestructuración mucho más grande que la propia funcionalidad).
Cambiar de proyecto, por tanto, escribe qué proyecto tocará cargar la próxima
vez (`proyectos.cambiarA`) y recarga — `location.reload()` — para que
`bootstrap()` vuelva a correr entero con el nuevo espacio de nombres. Es la
misma solución, y la misma razón, por la que activar o desactivar una
funcionalidad opcional relee el shell entero en vez de intentar
desmontar y remontar cada pieza a mano.

### El puente legacy: `StorageAdapter.P` pasa de constante a función

`common/storage.js` escribía todo bajo un `const P = 'financeapp_'` capturado
al evaluarse el módulo. Se cambió a una función que consulta
`window.FinanceApp.proyectos.activo()` en cada llamada — no en el arranque,
sino en cada `get`/`set`/`remove` — con una caída al prefijo de siempre si el
paquete nuevo no ha podido cargar. Como este fichero se carga DESPUÉS de
`assets/financeapp-core.js` (ver el orden de scripts en `index.html`),
`window.FinanceApp` existe siempre para cuando de verdad se llama a estas
funciones, aunque no exista todavía en el instante en que el módulo se
evalúa.

### Las copias en la nube son por proyecto, no globales

Firebase (`firebase/firebase-service.js`) guardaba el backup siempre en el
documento `users/<uid>/data/backup`; Dropbox (`auth/auth.js`,
`DropboxService`) siempre en `/financeapp_backup.enc`. Los dos pasan a
depender del proyecto activo — `backup_<id>` / `/financeapp_backup_<id>.enc`
— **excepto** `default`, que conserva el nombre de siempre por la misma razón
que el espacio de nombres local: una cuenta ya conectada antes de que
existieran los proyectos sigue encontrando su copia exactamente donde la
dejó.

Lo que NO se hizo por-proyecto, a propósito: la CONEXIÓN (con qué cuenta de
Firebase has iniciado sesión, o qué token de Dropbox hay guardado) sigue
siendo del dispositivo, compartida entre proyectos. Pedir que cada proyecto
tenga su propio inicio de sesión en la nube habría sido mucho más fricción
por un beneficio que el pedido original no pedía — lo que hace falta es que
los DATOS estén separados, no la cuenta con la que se suben.

### Lo que es a propósito del dispositivo, no del proyecto

La credencial de huella (`financeapp_bio_*`, ver `auth/biometria.ts`), el
token de Dropbox, la configuración de Firebase, la sesión persistida
(`financeapp_session`) y el registro de proyectos en sí — ninguna de estas
claves lleva namespacing por proyecto. Son todas secretos o preferencias del
DISPOSITIVO, no datos del proyecto: duplicar un proyecto no debe llevarse la
huella a la copia (no tendría sentido: es la misma huella, del mismo
dispositivo), y cambiar de proyecto no debe cerrar la sesión.

## 3. Duplicar: copia exacta, colección a colección

`proyectos.duplicar(id)` NO barre todo lo que empiece por el espacio de
nombres del origen — para `default`, ese prefijo (`financeapp_`) también
cubre el registro de proyectos, la sesión, la huella y los proyectos DE
OTROS, así que barrerlo entero se llevaría por delante cosas que no son
datos del proyecto que se está duplicando. En vez de eso, copia colección a
colección por su clave lógica (`state_<col>` para cada `col` de
`state/colecciones.COLECCIONES`, más la versión de esquema y el sello) — la
misma lista que ya usan las cuatro rutas de copia de seguridad, así que una
colección nueva en el esquema no exige acordarse de tocar esto también.

La copia es independiente desde ese instante: mismos datos, mismos ids
internos (no hace falta cambiarlos — vive en un espacio de nombres propio,
así que no puede colisionar con nada), pero tocar una no toca la otra.

## 4. Importar: colecciones sueltas, con referencias cruzadas corregidas

Traer una colección entera de otro proyecto con los MISMOS ids que allí sí
sería peligroso: si el proyecto activo ya tiene un elemento con ese id (por
ejemplo, los dos proyectos tienen una cuenta `default` creada por la misma
migración de fábrica), importar los pisaría o los confundiría. Por eso
`remapearIds` (`state/proyectos.ts`) da un id NUEVO a cada elemento
importado, y — esto es lo que hace que sea usable, no solo seguro — reescribe
cualquier referencia cruzada que apuntara a esos ids (`cuenta`,
`escenarioIds`, `cuentaIds`...) sin tener que enumerar a mano cada campo que
pueda contenerlas: recorre el valor entero y sustituye cualquier STRING que
coincida EXACTAMENTE con un id antiguo. Colisionar por casualidad de texto
libre es, en la práctica, imposible — el formato de los ids no es algo que
nadie teclee sin querer en un campo de nombre o de notas.

Esto tiene un límite conocido y documentado en la propia ventana: si se
importan gastos que dependen de una cuenta SIN importar también esa cuenta,
la referencia se queda apuntando a un id que no está en ningún sitio del
proyecto activo — no revienta nada (la vista de gastos ya sabe mostrar una
cuenta desconocida), pero la referencia no sirve. El aviso en la propia
ventana («si importas gastos o préstamos que dependen de una cuenta, importa
también esa cuenta») es la solución elegida: explicar la regla en vez de
intentar adivinar automáticamente qué colecciones dependientes hace falta
arrastrar.

Importar NO exige recargar la página — a diferencia de cambiar de proyecto,
que sí reconstruye todo `bootstrap()`, importar solo añade filas al store ya
cargado (`store.set(col, [...actuales, ...nuevos])`), y el módulo re-sincroniza
el `State` legacy y repinta la vista activa (`Router.rerender()`) con el
mismo mecanismo que ya usaba `ui/deshacer.ts`.

## 5. La ventana «Proyectos»

`src/ui/proyectos-modal.ts` reutiliza el modal compartido (`#modal-overlay` /
`#modal-content`), igual que `ui/features-modal.ts`: cambiar de proyecto,
crear, renombrar, duplicar, eliminar, e importar, todo en una sola ventana en
vez de repartido entre varias. Se abre desde un botón nuevo en el pie del
sidebar («Proyectos», junto a «Funcionalidades» y «Administrar datos») y
desde una insignia siempre visible bajo el logo que enseña el nombre del
proyecto activo — sin ella no habría forma, de un vistazo, de saber en cuál
de varios proyectos se está.

Reglas de la propia ventana, no solo del servicio:
- El proyecto `default` nunca lleva botón de eliminar.
- El proyecto ACTIVO tampoco lo lleva (hay que cambiar a otro primero — el
  servicio ya lo impide, la ventana simplemente no ofrece el botón).
- La sección de importar solo aparece si hay al menos otro proyecto.
- Renombrar y duplicar piden el nombre con `prompt()`; en un entorno donde no
  existe (o el usuario cancela), no pasa nada.

## 6. Verificación

- 23 tests de `state/proyectos.ts` (registro, namespace, duplicar, eliminar,
  lectura cruzada, remapeo de ids con referencias cruzadas).
- 15 tests de `ui/proyectos-modal.ts` contra el servicio REAL (no un doble):
  crear, renombrar, duplicar, eliminar, cambiar (con confirmación y
  cancelación), e importar, incluida la ausencia de la sección de importar
  con un solo proyecto.
- Flujo completo en Chromium sin cabecera, en DOS procesos separados:
  - Uno, con datos sembrados en el proyecto `default`: abre la ventana, crea
    un proyecto, duplica `default` y comprueba que la copia tiene EXACTAMENTE
    las mismas cuentas que el original (mismo JSON), e importa la colección
    de cuentas de la copia al proyecto activo (4 → 8 cuentas).
  - El otro arranca en frío con OTRO proyecto ya activo (simulando una
    recarga justo después de cambiar): comprueba que la insignia enseña su
    nombre, que sus cuentas son el estado de fábrica (una cuenta `Default` a
    cero) y no las sembradas — y que los datos del proyecto `default`
    siguen intactos bajo su propia clave, sin tocar.
  - Capturas a 1400 px y a 390 px de viewport real (vía el envoltorio de
    `<iframe>` de `tools/qa/movil.html`, por el mismo motivo que en el resto
    de este proyecto: `--window-size` sin cabecera no baja de 500 px).
