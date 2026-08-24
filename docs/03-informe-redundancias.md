# 03 — Informe de features redundantes, innecesarias o confusas

Candidatas a eliminación o consolidación, con su justificación. **Ninguna se elimina sin
decisión del usuario**. Decisiones tomadas el 2026-07-30 (ver registro al final).

> ⚠️ Este documento describe decisiones de julio de 2026. Algunas se han
> revertido después: **comprueba siempre el registro del final antes de borrar
> nada**. Para el estado actual del producto, ver
> [`05-revision-producto.md`](05-revision-producto.md).

## A. Código muerto (eliminación segura, sin impacto funcional)

| # | Feature | Justificación | Decisión |
|---|---|---|---|
| A1 | `calendar/calendar.js` (vista calendario) | No se carga en `index.html`, no tiene contenedor ni ruta. Inaccesible para el usuario | ✅ Eliminado |
| A2 | `dashboard/history.js` (HistoryModule) + colección `state.history` | Se carga pero nunca se invoca. La colección `history` solo la usa este módulo muerto. Su propósito (histórico real) lo cubrirá el módulo de Contabilidad (F4) | ✅ Eliminado |
| A3 | `FinanceMath.proyectarInversiones` | Restos del modelo antiguo de inversiones por escenario (migrado a cuentas). Exportada, cero llamadores | ✅ Eliminado |

## B. Sistemas duplicados / solapados (consolidar)

| # | Feature | Justificación | Decisión |
|---|---|---|---|
| B1 | Inflación legacy: `config.inflacionGlobal` + `exp.inflacion` + `aplicarInflacion` | Convive con el módulo de inflación por periodos (`usarInflacion` + IPC). Dos sistemas para lo mismo; si ambos están activos puede haber doble conteo; el legacy solo se aplica en el dashboard (extracto y otras vistas no lo ven → números inconsistentes entre vistas) | ✅ Eliminado |
| B2 | Colchón con waypoints (`colchonPuntos`, `colchonTipo`, `colchonFijo`) vs Márgenes de seguridad | Los márgenes generalizan al colchón (umbral por cuentas + waypoints fijo/meses). Mantener ambos duplica configuración y confunde: dos sitios donde definir "reserva mínima" con reglas distintas. Propuesta: el colchón pasa a ser un margen predefinido | ✅ Aprobado — consolidar en F1 (tarea 1.9) |
| B3 | `tagCategorias` vs `tagGrupos` | Dos mecanismos distintos de agrupar tags en gráficos (promoción a categoría del donut vs grupos en charts de tags), configurados en sitios distintos. Propuesta: un único concepto "grupo de tags" con opción de mostrarlo como categoría | ✅ Aprobado — unificar en F1 (tarea 1.9) |
| B4 | `historialPrecios` por gasto (media del último año → cuantía efectiva) | La contabilidad real (F4) registrará precios reales y el ajuste de estimaciones lo hará explícito. Hoy además es confuso: cambia la cuantía proyectada silenciosamente sin reflejarlo en el formulario | ✅ Aprobado — se retira en F4 cuando Contabilidad lo sustituya (tarea 4.8) |

## C. Features de nicho o dudoso valor (candidatas a flag off por defecto o eliminación)

| # | Feature | Justificación | Decisión |
|---|---|---|---|
| C1 | Velas OHLC del saldo | Se eliminaron en julio de 2026 por redundantes con la curva de evolución. **REVERTIDO en agosto de 2026**: el usuario las pidió de vuelta expresamente («echo en falta las gráficas de vela mensuales/anuales»). Reimplementadas sin dependencia de CDN, con barras flotantes, tras el flag `velas-saldo` (encendido por defecto) | ⛔ NO eliminar — código vivo |
| C2 | Monte Carlo (`showMC`, `mcIteraciones`) + campos `varianza` en gastos y nóminas | Coste computacional alto, valor dudoso con varianzas inventadas por el usuario; añade 2 campos de formulario que confunden. Si se mantiene: tras feature flag, off por defecto | ✅ Eliminado |
| C3 | Simulador de prestación por desempleo (SEPE) | Muy nicho y sensible a cambios normativos (IPREM 2025 hardcodeado). Si se mantiene: tras feature flag | ✅ Eliminado |
| C4 | Sincronización Dropbox | Requiere token de developer generado a mano que **caduca** (UX mala, soporte costoso). Firebase ya cubre la sincronización; export JSON cubre el backup manual | ❌ Se mantiene (decisión del usuario) |

## D. Ya decidido por el usuario (no requiere pregunta)

- **Escenarios** → serán sustituidos por **Supuestos** (F5), con migración automática.
- `tests/nomina.test.cjs` → sustituido por tests de caracterización reales (F0).
- Tooling roto de `src/v2` → reparado/retirado en F0–F1.

## Registro de decisiones

| Fecha | Items | Decisión | Notas |
|---|---|---|---|
| 2026-07-30 | A1, A2, A3 (código muerto) | Eliminar | Hecho en esta rama |
| 2026-07-30 | B1 (inflación legacy) | Eliminar | Hecho en esta rama; queda solo el módulo por periodos/IPC |
| 2026-07-30 | C1 (OHLC), C2 (Monte Carlo + varianzas), C3 (simulador paro) | Eliminar | Hecho en esta rama |
| 2026-08-21 | C1 (velas del saldo) | **Revertida la eliminación** | Petición explícita del usuario. Reimplementadas mensuales y anuales en la visión general. Flag `velas-saldo` |
| 2026-07-30 | B2 (colchón→margen), B3 (unificar grupos de tags) | Consolidar | Programado como tarea 1.9 del plan (necesita migración de datos) |
| 2026-07-30 | B4 (historialPrecios) | Eliminar cuando exista el sustituto | Programado como tarea 4.8: Contabilidad + "sugerir ajuste" lo reemplazan |
| 2026-07-30 | C4 (Dropbox) | Mantener | El usuario no lo seleccionó para eliminar |
