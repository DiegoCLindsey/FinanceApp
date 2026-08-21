# Gestor de Objetivos Financieros — estado de la implementación

> Documento de continuidad. El diseño de alto nivel es el que trajo el usuario;
> aquí se registra **qué está hecho, qué decisiones se tomaron y qué queda**,
> para poder retomarlo en otra sesión sin releerlo todo.
>
> Última actualización: 2026-08-21. **El plan de implementación está COMPLETO**:
> pasos 1 a 7 del §8 del documento de diseño.

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

**Los siete pasos** del orden sugerido (§8), con 133 tests propios.

### Núcleo (`src/planner/`, sin DOM ni almacenamiento)

- **`finanzas.ts`** — PMT, valor futuro, meses hasta objetivo, rendimiento
  mensual y derivación de capital por SWR. Caso `i = 0` por rama aparte.
  25 tests.
- **`tipos.ts`** — modelo de dominio completo del §2, incluidos `Evento`,
  `Vehiculo`, `Plan` y todas las salidas del §4.
- **`simulador.ts`** — bucle mensual del §3.2: eventos → disponible → cascada →
  rentabilidad → estados. Encadenamiento, topes fiscales por año natural,
  detección de inviabilidad y propuestas cuantificadas. 31 tests.
- **`sensibilidad.ts`** — los tres ejes del §4 (rentabilidad ±2 puntos, disfrute
  ±10, ingresos ±20 %), medidos en meses de adelanto o retraso del último hito.
  16 tests.
- **`eventos.ts`** — plantillas de los casos frecuentes del §2.7 y utilidades de
  escenarios (duplicar plan, comparar hitos). 20 tests.

### Persistencia

- `SCHEMA_VERSION` 7 → **8**; colección `planes` en el estado.
- **Migración `008-planner.ts`**: absorbe `goals`. 19 tests.

### Interfaz (`src/features/planner/`)

Pestañas 1-3 del §5: configuración del plan, lista de objetivos y simulación
(gráfico apilado por vehículo, hitos, fases, avisos, propuestas y tabla mes a
mes con exportación a CSV). Flag `planner`, activo por defecto.

**Edición completa** (`form.ts`):

- Alta, edición y borrado de **objetivos**, con los campos específicos de cada
  modo apareciendo solo cuando aplican y una explicación del modo elegido que
  cambia al vuelo.
- **Reordenar arrastrando**: el orden ES la prioridad, y tras cada movimiento se
  renumeran todos de 1 a N. Dejar huecos o empates haría que la cascada
  dependiera del orden de inserción, que es invisible para el usuario.
- Alternar entre «defino el capital» y «defino la renta que quiero» en
  `INVERSION_PERPETUA`, con el capital derivado en vivo y la advertencia del SWR
  (§2.6). Cuando se deriva, `importeObjetivo` queda a `null`: manda la
  derivación, que es lo que el usuario está editando.
- Alta, edición y borrado de **vehículos**, incluido el de `AMORTIZAR_DEUDA`:
  al elegir un préstamo, su TIN entra como rentabilidad y se propone el nombre.
  Un vehículo en uso no se puede borrar.
- Al cambiar el tipo de objetivo se sugiere el modo que le corresponde.

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

## 3. Estado de cierre

Todas las pestañas del §5 están implementadas:

| Pestaña | Estado |
|---|---|
| 1 · Configuración | Perfil, deslizador de disfrute en vivo, horizonte, notas |
| 2 · Objetivos | Alta, edición, borrado, reordenar arrastrando, vehículos |
| 3 · Simulación | Gráfico apilado, hitos, fases, avisos, propuestas, tabla paginada, CSV |
| 4 · Eventos | Línea temporal con las cinco plantillas, previsualización del importe |
| 5 · Escenarios | Lista de planes, activar, renombrar, borrar, duplicar, comparativa A/B/C, sensibilidad, export/import JSON |
| 6 · Notas | Dentro de la pestaña 1 (texto plano, no Markdown renderizado) |

### Decisiones de la última tanda

- **La sensibilidad se calcula bajo demanda.** Son diez simulaciones; hacerlas en
  cada repintado dejaría la pestaña inservible con horizontes de 480 meses.
- **Duplicar renueva TODOS los identificadores** y reescribe las referencias
  internas. Si dos planes compartieran ids, editar un objetivo en uno tocaría el
  del otro en cuanto algo los buscara por id.
- **El duplicado y el importado nacen inactivos.** Nunca se pisa el plan que el
  usuario está usando; se cambia cuando él lo dice.
- **La importación valida antes de aceptar.** Un JSON cualquiera no es un plan, y
  meterlo reventaría el simulador con un error incomprensible.
- **Los hitos se comparan por NOMBRE**, que es lo único común entre planes con
  ids distintos. Si un plan no alcanza un hito, sale `null`, no un cero.
- **Los vehículos migrados llevan `revisarRentabilidad`.** Su rentabilidad viene
  del `interes` de una cuenta, que es NOMINAL, y este módulo trabaja en términos
  reales. La marca se quita al guardarlos desde el formulario, que sí explica la
  diferencia.

### Limitaciones conocidas, deliberadas

- **`perfilSugerido()` estima el neto como el 75 % del bruto.** Es burdo a
  propósito: el neto exacto lo calcula el motor fiscal al proyectar, y duplicar
  esa lógica aquí sería justo lo que el documento pide evitar. Enchufarlo al
  motor real es la mejora pendiente más clara.
- **La comparativa se limita a tres planes.** Con más, la tabla deja de leerse.
- **Las notas son texto plano**, no Markdown renderizado.
- **Versionado de planes con snapshots** (§6): no implementado. Duplicar un plan
  cubre el caso práctico —guardar el de hoy antes de cambiarlo— pero no hay
  comparación automática contra la realidad ejecutada.
- **Punto de enganche plan vs. real** (§6): tampoco. Requiere decidir cómo se
  emparejan los objetivos del plan con las transacciones de contabilidad, que es
  una decisión de producto, no de implementación.

---

## 4. Fuera de alcance, por decisión del documento (§7)

Fiscalidad detallada del rescate de pensiones, Monte Carlo y secuencia de
retornos, precios inmobiliarios, conexión con brókers y recomendaciones de
producto. **v1 asume rentabilidad constante y la UI lo dice.**
