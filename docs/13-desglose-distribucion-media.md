# Detalle de "Distribución media mensual": de dónde salen los números

Petición del usuario, en el mismo hilo que el arreglo del colchón (`docs/12`):
poder pulsar la tarjeta "Distribución media mensual (periodo)" del dashboard y
ver qué gastos e ingresos concretos componen cada apartado (Necesidades,
etiquetas promovidas, Deseos, Deuda, Ahorro est.), no solo el total.

## Qué se añadió

- Botón "🔍 Ver datos" en la cabecera de la tarjeta →
  `DashboardModule.verDetalleDistribucionMedia()` → `UI.openModal(...)` (el
  modal genérico que ya usa el resto de la app — cierre por `#modal-close` o
  clic fuera, nada nuevo).
- El desglose se calcula una vez por `render()`, junto al resto de agregados
  de la tarjeta, y se guarda en `_ultimoDesgloseDistribucion` (mismo patrón
  que `_ultimasGraficas`/`_ultimoExpensesFiltrados`: evita recalcular al
  pulsar el botón, y sigue el precedente ya establecido en el fichero).
- **Los mismos filtros que ya usan `gastosBasicosMediaMes` /
  `gastosDeseoMediaMes` / `cuotasMediaMes` / `amortizacionesMediaMes` /
  `_tagPromoMediaMes`** — a propósito: el detalle tiene que sumar EXACTAMENTE
  lo mismo que pinta cada porción del donut, o el modal mentiría. Si esos
  filtros cambian en el futuro, este desglose tiene que cambiar con ellos
  (está anotado en el comentario del código).
- Cada evento se agrupa por concepto (`expenses.find(...).concepto` para
  gasto de ficha, `loans.find(...).nombre` para cuotas/amortizaciones,
  `e.concepto` para el IRPF/SS de una nómina en modo detallado — que ya
  cuentan como básico desde `docs/11` §12), sumado en media mensual y
  ordenado de mayor a menor.
- "Ahorro est." no tiene eventos propios (es un resto, no una lista de
  movimientos), así que el modal muestra la resta en vez de una lista:
  Ingresos − Necesidades − Deseos [− etiquetas] − Deuda.

## Verificación

En Chromium (esta parte no depende de Chart.js, así que sí se pudo probar de
verdad en esta sandbox sin salida a red): con un alquiler de 850€ básico, dos
gastos "deseo" y una cuota de coche, el modal desglosa cada importe por
concepto y los totales de cada sección **coinciden exactamente** con los que
ya mostraba la leyenda de la tarjeta antes de abrirlo. Abre y cierra con el
modal estándar de la app. `node --check`, `comprobar-estaticos.mjs` y los
1230 tests, limpios (el cambio es enteramente `dashboard.js`, sin tests
propios).
