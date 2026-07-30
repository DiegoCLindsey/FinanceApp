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

- App productiva: scripts globales sin bundler (`index.html` + carpetas por módulo), desplegable en GitHub Pages.
- Tooling (`vite.config.ts`, parte de `eslint.config.js`, scripts npm de lint/format) apuntaba a `src/v2/`, carpeta **eliminada** en el PR #75. La configuración de vitest ya está reparada (Fase 0).
- Tests: `tests/` contiene tests de caracterización vitest contra el código real; `tests/nomina.test.cjs` es un test legado standalone con copias inline (se retirará al completar F3).
