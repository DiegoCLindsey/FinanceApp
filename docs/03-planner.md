# Gestor de Objetivos Financieros — estado de la implementación

> Documento de continuidad. El diseño de alto nivel es el que trajo el usuario;
> aquí se registra **qué está hecho, qué decisiones se tomaron y qué queda**,
> para poder retomarlo en otra sesión sin releerlo todo.
>
> Última actualización: 2026-08-21.

---

## 0. Contexto rellenado (§0 del documento de diseño)

- **Stack.** Sin backend. Shell legacy en JS de navegador + dominio en
  TypeScript (`src/`) compilado por Vite a un bundle IIFE. Persistencia en
  `localStorage` con migraciones versionadas; copia cifrada opcional en
  Firebase/Dropbox.
- **Moneda.** Conviven dos convenciones: el legacy usa euros en `float`, el
  dominio nuevo usa **céntimos enteros** (`core/money`). **Este módulo usa
  céntimos**, como pide la §3.4.
- **Reutilización.** Resuelto así:

  | El documento pide | Se reutiliza | Cómo |
  |---|---|---|
  | `Vehiculo` (§2.5) | `Account` | `Vehiculo.cuentaId` apunta a la cuenta, que ya trae `interes`, `bloqueoMeses` e `impuestoRetirada`. El vehículo solo añade `topeAportacionAnual` y `riesgo` |
  | `PerfilFinanciero` (§2.2) | `nominas` + `expenses.basico` | `perfilSugerido()` propone; el usuario puede sobrescribir |
  | `Plan` (§2.1) | — | Se mantiene SEPARADO de `escenarios`: aquéllos filtran lo que ya existe, un plan reparte flujo futuro |
  | `Objetivo` (§2.3) | `goals` | **Absorbido.** Ver §2 |

---

## 1. Qué está hecho

Pasos **1 a 5** del orden sugerido (§8). Los pasos 1-3 son el núcleo y están
completos con tests.

### Núcleo (`src/planner/`, sin DOM ni almacenamiento)

- **`finanzas.ts`** — PMT, valor futuro, meses hasta objetivo, rendimiento
  mensual y derivación de capital por SWR. Caso `i = 0` por rama aparte.
  25 tests.
- **`tipos.ts`** — modelo de dominio completo del §2, incluidos `Evento`,
  `Vehiculo`, `Plan` y todas las salidas del §4.
- **`simulador.ts`** — bucle mensual del §3.2: eventos → disponible → cascada →
  rentabilidad → estados. Encadenamiento, topes fiscales por año natural,
  detección de inviabilidad y propuestas cuantificadas. 31 tests.

### Persistencia

- `SCHEMA_VERSION` 7 → **8**; colección `planes` en el estado.
- **Migración `008-planner.ts`**: absorbe `goals`. 19 tests.

### Interfaz (`src/features/planner/`)

Pestañas 1-3 del §5: configuración del plan, lista de objetivos y simulación
(gráfico apilado por vehículo, hitos, fases, avisos, propuestas y tabla mes a
mes con exportación a CSV). Flag `planner`, activo por defecto.

**Los 9 casos de referencia de la §9 están cubiertos por tests.** Dos de ellos
tenían el valor redondeado en el documento (820 € y 1.100 €); se fijó el exacto
—821,25 € y 1.101,09 €— comprobado aparte, porque un caso de referencia solo
sirve para detectar desviaciones si es preciso.

---

## 2. Decisiones tomadas

### 2.1 `goals` se absorbe (elección del usuario)

Había dos entidades llamadas «objetivo»: `goals` **seguía** (apuntaba a cuentas
y medía progreso sobre saldos reales) y `Objetivo` **planifica** (compite por el
flujo mensual). Dos pantallas con el mismo nombre era inasumible.

La migración convierte cada goal conservando id, nombre, importe, fecha,
prioridad y estado. **El saldo de partida NO se copia** de las cuentas: un goal
medía el saldo VIVO de sus cuentas, y arrastrarlo aquí contaría el mismo dinero
dos veces en cuanto la cuenta siguiera alimentándose. Se arranca a cero y hay
que fijarlo a mano.

`goals` **no se borra**: si la conversión sale mal, el original sigue ahí. Lo
retirará una migración posterior, cuando el módulo lleve tiempo en uso.

### 2.2 Política del tope fiscal

El documento dejaba abierto («definir política y testearla»). Elegido:
**aportar hasta agotar el tope y reanudar en enero**, no prorratear el año. Es
más fiel a cómo funciona la desgravación. Con 200 €/mes y tope de 1.500 €: siete
meses completos, 100 € el octavo, nada hasta diciembre, y 200 € otra vez en
enero. Está en un test.

### 2.3 `ABSORBE_TODO` no cuenta como déficit

Reclama todo lo que le falta por definición. Contarlo como compromiso marcaba
inviable cualquier plan con una amortización pendiente. Solo cuentan como
compromiso `CUOTA_POR_FECHA` y `FIJO`.

### 2.4 Semántica de `fechaLimite`

Es «tenerlo **para** ese mes». Un objetivo de 12.000 € a 12 meses desde 2026-01
con fecha 2027-01 aporta 1.000 €/mes y se completa en **2026-12**: llega a
tiempo, no tarde.

---

## 3. Qué queda pendiente

En orden de valor. Los pasos 6 y 7 del §8 del documento, más lo que se recortó
de las pestañas 1-3.

### 3.1 Alta y edición de objetivos — **lo más urgente**

Ahora mismo la vista **solo lee**. Los objetivos entran por la migración o
editando el JSON. Falta:

- Formulario de alta/edición (nombre, tipo, importe, fecha, modo, vehículo,
  saldo actual, notas).
- Borrado con confirmación.
- **Reordenar por arrastre** (§5, pestaña 2): el orden ES la prioridad.
- Alternar entre «defino el capital» y «defino la renta que quiero» en
  `INVERSION_PERPETUA`, con la advertencia del SWR (§2.6). El cálculo ya está
  hecho (`capitalParaRenta`), falta el interruptor en la UI.

### 3.2 Gestión de vehículos

La migración crea uno por cuenta, pero no hay forma de crear, editar ni borrar.
Falta sobre todo el vehículo de **`AMORTIZAR_DEUDA`**, que apunta a un `Loan` y
cuya «rentabilidad» es el TIN evitado — y la UI tiene que explicarlo, porque es
contraintuitivo que pagar deuda aparezca como inversión (§2.5).

**Aviso pendiente:** la migración traslada `Account.interes` tal cual a
`rentabilidadRealAnual`, pero ese interés es **nominal**. Hay que avisar en la
UI de que se revise, o restar una inflación estimada.

### 3.3 Eventos (paso 6)

El motor ya los aplica y están testeados; **falta la pestaña 4**: línea temporal
editable con plantillas para los casos frecuentes (venta de vivienda,
nacimiento, subida de sueldo).

### 3.4 Escenarios y sensibilidad (paso 7)

- Pestaña 5: comparativa A/B/C, duplicar plan, tabla de diferencias en fechas de
  hitos.
- Análisis de sensibilidad (§4): re-ejecutar variando rentabilidad (−2…+2
  puntos), `pctDisfrute` (±10) e ingresos (±20 %), y presentarlo como «cuántos
  años adelanta o retrasa cada palanca».

### 3.5 Persistencia avanzada (§6)

- Versionado de planes: snapshots con fecha para comparar el plan de hoy con el
  de hace un año frente a la realidad ejecutada.
- Export/import JSON del plan completo.
- Punto de enganche plan vs. real, apoyándose en el módulo de contabilidad.

### 3.6 Detalles menores

- La tabla mes a mes pinta 60 filas; el resto solo por CSV. Con horizontes de
  480 meses habría que paginar o virtualizar.
- `perfilSugerido()` estima el neto como el 75 % del bruto. Es deliberadamente
  burdo: el neto exacto lo calcula el motor fiscal al proyectar, y duplicar esa
  lógica aquí sería justo lo que el documento pide evitar. Conviene enchufarlo
  al motor real.
- El selector de plan activo (§5, pestaña 1) no existe: se usa el primero
  marcado `activo`.
- La pestaña 6 (notas en Markdown) está como textarea de texto plano.

---

## 4. Fuera de alcance, por decisión del documento (§7)

Fiscalidad detallada del rescate de pensiones, Monte Carlo y secuencia de
retornos, precios inmobiliarios, conexión con brókers y recomendaciones de
producto. **v1 asume rentabilidad constante y la UI lo dice.**
