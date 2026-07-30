# Documentación del proyecto de refactorización

Esta carpeta contiene el análisis y el plan maestro de la refactorización de FinanceApp.
Está pensada para que **cualquier agente o desarrollador pueda continuar el trabajo** sin
contexto previo.

| Documento | Contenido |
|---|---|
| [01-analisis-features.md](01-analisis-features.md) | Inventario completo de features implementadas, módulo a módulo, con notas de estado (vivo/muerto/legacy) |
| [02-plan-refactor.md](02-plan-refactor.md) | Plan maestro por fases y tareas: refactor SOLID, feature flags, tests, contabilidad real, supuestos, precisión de estimaciones |
| [03-informe-redundancias.md](03-informe-redundancias.md) | Features redundantes, innecesarias o confusas — pendientes de decisión del usuario |

## Cómo continuar el trabajo

1. Lee `02-plan-refactor.md` y localiza la **primera tarea no marcada como hecha** (`[ ]`).
2. Cada tarea lista sus ficheros afectados y criterios de aceptación. No empieces una fase
   sin cerrar la anterior salvo que la tarea diga explícitamente que es paralelizable.
3. Antes de tocar código de cálculo, ejecuta los tests: `npm test`. Los tests de
   caracterización de `tests/` definen el comportamiento actual: **si un test rompe, el
   refactor ha cambiado un resultado numérico** y hay que justificarlo en el commit.
4. Marca las tareas completadas editando la checkbox del plan en el mismo PR/commit.
5. Las decisiones pendientes del usuario están en `03-informe-redundancias.md`. No
   elimines ninguna feature de la lista sin confirmación registrada en ese documento.

## Estado actual del repo (2026-07-30)

- **Dos capas conviven**: la app legacy (scripts globales en la raíz) sigue siendo lo
  que ve el usuario; el paquete nuevo (`src/`, TypeScript) se compila a
  `assets/financeapp-core.js` y se publica en `window.FinanceApp` para que el legacy
  lo consuma progresivamente (*strangler fig*).
- **Núcleo de cálculo portado por completo** con paridad de igualdad estricta frente al
  legacy: `core/` (fechas locales, dinero, préstamos, IRPF, ahorro, pensiones,
  inflación, salud, cuentas, tablas fiscales), `engine/` (8 providers + statement +
  análisis + márgenes + optimizador), `state/` (store tipado + migraciones v5) y
  `flags/` (registro de 22 features + servicio con dependencias y perfiles).
- **Pipeline reparado**: `npm run build` estaba roto desde el PR #75 y con él el deploy
  a Pages; `ci.yml` estaba rojo por prettier. Ver tarea 1.1b del plan.
- Tests: 127 en verde (`npm test`). `tests/finance-math.test.js` son los de
  caracterización del legacy (contrato de paridad); `tests/core/`, `tests/state/` y
  `tests/flags/` cubren el paquete nuevo. `tests/nomina.test.cjs` es un test legado
  standalone con copias inline (se retirará al completar F3).
