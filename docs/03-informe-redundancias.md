# 03 — Informe de features redundantes, innecesarias o confusas

Candidatas a eliminación o consolidación, con su justificación. **Ninguna se elimina sin
decisión del usuario**; la columna "Decisión" se rellena cuando el usuario responda.

## A. Código muerto (eliminación segura, sin impacto funcional)

| # | Feature | Justificación | Decisión |
|---|---|---|---|
| A1 | `calendar/calendar.js` (vista calendario) | No se carga en `index.html`, no tiene contenedor ni ruta. Inaccesible para el usuario | Pendiente |
| A2 | `dashboard/history.js` (HistoryModule) + colección `state.history` | Se carga pero nunca se invoca. La colección `history` solo la usa este módulo muerto. Su propósito (histórico real) lo cubrirá el módulo de Contabilidad (F4) | Pendiente |
| A3 | `FinanceMath.proyectarInversiones` | Restos del modelo antiguo de inversiones por escenario (migrado a cuentas). Exportada, cero llamadores | Pendiente |

## B. Sistemas duplicados / solapados (consolidar)

| # | Feature | Justificación | Decisión |
|---|---|---|---|
| B1 | Inflación legacy: `config.inflacionGlobal` + `exp.inflacion` + `aplicarInflacion` | Convive con el módulo de inflación por periodos (`usarInflacion` + IPC). Dos sistemas para lo mismo; si ambos están activos puede haber doble conteo; el legacy solo se aplica en el dashboard (extracto y otras vistas no lo ven → números inconsistentes entre vistas) | Pendiente |
| B2 | Colchón con waypoints (`colchonPuntos`, `colchonTipo`, `colchonFijo`) vs Márgenes de seguridad | Los márgenes generalizan al colchón (umbral por cuentas + waypoints fijo/meses). Mantener ambos duplica configuración y confunde: dos sitios donde definir "reserva mínima" con reglas distintas. Propuesta: el colchón pasa a ser un margen predefinido | Pendiente |
| B3 | `tagCategorias` vs `tagGrupos` | Dos mecanismos distintos de agrupar tags en gráficos (promoción a categoría del donut vs grupos en charts de tags), configurados en sitios distintos. Propuesta: un único concepto "grupo de tags" con opción de mostrarlo como categoría | Pendiente |
| B4 | `historialPrecios` por gasto (media del último año → cuantía efectiva) | La contabilidad real (F4) registrará precios reales y el ajuste de estimaciones lo hará explícito. Hoy además es confuso: cambia la cuantía proyectada silenciosamente sin reflejarlo en el formulario | Pendiente |

## C. Features de nicho o dudoso valor (candidatas a flag off por defecto o eliminación)

| # | Feature | Justificación | Decisión |
|---|---|---|---|
| C1 | Velas OHLC del saldo | Visualización de trading aplicada a saldo personal; información redundante con la curva de evolución + flujo mensual, y difícil de interpretar para el usuario objetivo | Pendiente |
| C2 | Monte Carlo (`showMC`, `mcIteraciones`) + campos `varianza` en gastos y nóminas | Coste computacional alto, valor dudoso con varianzas inventadas por el usuario; añade 2 campos de formulario que confunden. Si se mantiene: tras feature flag, off por defecto | Pendiente |
| C3 | Simulador de prestación por desempleo (SEPE) | Muy nicho y sensible a cambios normativos (IPREM 2025 hardcodeado). Si se mantiene: tras feature flag | Pendiente |
| C4 | Sincronización Dropbox | Requiere token de developer generado a mano que **caduca** (UX mala, soporte costoso). Firebase ya cubre la sincronización; export JSON cubre el backup manual | Pendiente |

## D. Ya decidido por el usuario (no requiere pregunta)

- **Escenarios** → serán sustituidos por **Supuestos** (F5), con migración automática.
- `tests/nomina.test.cjs` → sustituido por tests de caracterización reales (F0).
- Tooling roto de `src/v2` → reparado/retirado en F0–F1.

## Registro de decisiones

*(rellenar con la respuesta del usuario)*

| Fecha | Items | Decisión | Notas |
|---|---|---|---|
| | | | |
