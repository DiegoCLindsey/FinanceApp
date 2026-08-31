# Colchón: tope por meses restantes de cada cuota

El usuario pidió revisar el dashboard: donde apareciera «necesidades» debía
separarse en «cuotas» y «gastos básicos» aunque las dos alimenten el mismo
colchón, y el colchón por defecto debía cubrir X meses (configurable) de
gasto básico **más `min(X,Y)` meses de cada cuota**, donde Y son los meses
que le quedan a esa cuota concreta — no los X meses enteros si a la cuota
le queda menos que eso.

## Lo que había en el dashboard

`gastosBasicosMediaMes`/`gastosDeseoMediaMes` en `dashboard.js` ya separaban
básicos de deuda: la dona «Distribución media mensual (periodo)» pinta
«Necesidades» (básicos) y «Deuda» (cuotas + amortizaciones) como segmentos
independientes, con sus propias filas en la leyenda. No había ningún sitio
en el dashboard etiquetando la suma de ambos como «necesidades» — esa parte
del encargo ya estaba hecha.

## Lo que sí estaba mal: el colchón en sí

El colchón (`calcColchon`/`calcColchonEnFecha`, en
`finance-math/finance-math.js` y su paridad en `src/engine/margins.ts`) sí
tenía el bug descrito. Fórmula anterior:

```
(gastoBasicoMensual + Σ cuotaMensual(préstamo básico)) × mesesColchón
```

Todas las cuotas de préstamos básicos se multiplicaban por los mismos X
meses que el gasto básico, sin mirar cuánto le quedaba a cada préstamo. Una
hipoteca a 20 años y un préstamo que termina el mes que viene contribuían
igual al colchón — de sobra para la hipoteca, pero también de más para el
préstamo que está a punto de desaparecer del gasto mensual.

## La fórmula nueva

```
colchón = gastoBasicoMensual × X + Σ_préstamos_básicos [ cuotaMensual × min(X, Y) ]
```

donde `Y` son los meses de cuota ORDINARIA (no las filas de amortización
extra) que le quedan al préstamo desde la fecha de referencia, leídos de su
tabla de amortización real (`resumenPrestamo(loan).tabla`, ya existente y
con tests de paridad propios) — así que una amortización parcial que
acortó el plazo también acorta correctamente el colchón que ese préstamo
necesita, sin reimplementar el motor de amortización.

Nuevo helper en ambos ficheros (`cuotasBasicasConTope`/
`_cuotasBasicasConTope`), en paralelo al `cuotasBasicasMensuales` que ya
existía — que se **deja intacto** y lo sigue usando `calcMargenEnFecha`
(los márgenes de seguridad genéricos que configura el usuario): el encargo
era específicamente sobre el colchón, no sobre esa feature hermana, y
tocarla habría sido ensanchar el cambio sin que nadie lo pidiera.

`fecha` importa: `calcColchon` usa "hoy" (coherente con que ya usa "hoy"
para el gasto básico); `calcColchonEnFecha` usa la fecha del waypoint que
esté activo — para saber cuánto colchón hacía falta EN ESE MOMENTO, los
meses restantes de cada cuota también se cuentan desde ese momento, no
desde hoy.

## Un efecto colateral necesario

`resumenPrestamo` exige `fechaInicio` (y opcionalmente comisiones/
amortizaciones/día de pago) — campos que `BasicoLoan` (el tipo del
préstamo tal y como lo veían las funciones de colchón) no tenía, porque
antes le bastaba con `capital/tin/meses`. Ahora `BasicoLoan extends
LoanInput`. Los dos puntos de llamada reales (`dashboard.js`,
`src/features/accounts/index.ts`) ya pasan préstamos completos del State,
así que no cambia nada en producción; solo hubo que añadir `fechaInicio` a
los préstamos de prueba de `tests/core/engine-analysis.test.ts`, que antes
se construían con el mínimo imprescindible.

## Verificación

- `tests/core/engine-analysis.test.ts`: paridad legacy↔nuevo intacta (las
  mismas comparaciones de siempre, ahora con la fórmula nueva en los dos
  sitios) más dos tests nuevos con cifras verificadas a mano: una cuota de
  100 €/mes con 2 meses restantes y colchón a 6 meses da 200 € (no 600 €);
  la misma cuota con 158 meses restantes da los 600 € enteros.
- `npm test`: 1230 tests en verde (1228 + los 2 nuevos).
- `node tools/qa/comprobar-estaticos.mjs` y `npm run lint` limpios.
- `npm run build`: bundle regenerado y committeado (`assets/financeapp-core.js`).
