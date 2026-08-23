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

**Coste**: medio. **Requisito**: varios meses de contabilidad, o sea que gana
valor con el tiempo. Es la mejora natural *después* del cierre de mes.

### 3.2 Avisos con antelación

`detectarCrucesMargenes` ya calcula cuándo se cruza un umbral. Nadie lo enseña
hasta que abres la vista de márgenes. Debería estar arriba del dashboard:
«el 12 de marzo bajas de tu colchón». Coste bajo, el cálculo ya existe.

### 3.3 Deshacer

Borrar un gasto, una cuenta o una transacción es inmediato e irreversible. En una
aplicación cuyo valor es la confianza en sus datos, la falta de deshacer hace que
el usuario dude antes de tocar nada. Un historial de una sola posición
(«Deshecho» en el aviso flotante) cubre el 90 % de los sustos.

### 3.4 Búsqueda global

Con doce apartados, encontrar «aquel recibo del seguro» obliga a recordar en qué
vista estaba.

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
5. Banda de confianza (§3.1) — necesita 3 y 4 en uso. ⬜
6. Avisos con antelación (§3.2). ⬜
7. Deshacer (§3.3). ⬜

Del 5 en adelante queda propuesto, no hecho: el 5 necesita meses de datos reales
para valer algo, y del 6 y 7 conviene decidir antes dónde viven.
