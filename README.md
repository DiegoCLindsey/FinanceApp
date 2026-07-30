# FinanceApp — Arquitectura por componentes

## Estructura de ficheros

```
financeapp/
├── index.html                    ← Entry point. Ensambla todo el HTML, CSS y scripts.
│
├── common/                       ← Código compartido sin dependencias de UI
│   ├── variables.css             ← Design tokens (:root CSS variables)
│   ├── base.css                  ← Reset, body, utilidades, scrollbar
│   ├── components.css            ← Botones, cards, forms, tablas, badges, toggles, tags
│   ├── crypto.js                 ← CryptoService (AES-GCM, PBKDF2) — sin dependencias
│   ├── storage.js                ← StorageAdapter (localStorage) — sin dependencias
│   └── state.js                  ← State (gestión de estado + migraciones) — depende de storage.js
│
├── finance-math/
│   └── finance-math.js           ← FinanceMath (cálculos financieros puros) — depende de State
│
├── ui/
│   ├── ui.css                    ← Shell layout, sidebar, modal, toast, welcome, wizard
│   └── ui.js                     ← UI (toast, modal, helpers de formulario) — depende de State
│
├── auth/
│   ├── auth.html                 ← Fragmento HTML del overlay de auth (referencia, no incluido vía JS)
│   ├── auth.css                  ← Estilos del overlay de auth
│   └── auth.js                   ← GDriveService + AuthModule — depende de CryptoService, State, UI
│
├── finance-math/
│   └── finance-math.js           ← FinanceMath — 1019 líneas de cálculo puro
│
├── dashboard/
│   ├── dashboard.css             ← Score gauge, OHLC, extracto, exec summary, desviación
│   ├── dashboard.js              ← DashboardModule — depende de State, FinanceMath, UI, GoalsModule
│   └── history.js                ← HistoryModule — depende de State, FinanceMath, UI
│
├── loans/
│   ├── loans.css                 ← Loan cards, amort-item
│   └── loans.js                  ← LoansModule — depende de State, FinanceMath, UI
│
├── expenses/
│   ├── expenses.css              ← Expense table
│   └── expenses.js               ← ExpensesModule — depende de State, FinanceMath, UI
│
├── accounts/
│   └── accounts.js               ← AccountsModule — depende de State, FinanceMath, UI
│
├── calendar/
│   ├── calendar.css              ← Calendar grid
│   └── calendar.js               ← CalendarModule — depende de State, FinanceMath, UI
│
├── goals/
│   ├── goals.css                 ← Goal progress bars
│   └── goals.js                  ← GoalsModule — depende de State, FinanceMath, UI
│
├── onboarding/
│   └── onboarding.js             ← OnboardingModule — depende de State, UI
│
├── router/
│   └── router.js                 ← Router — depende de todos los módulos de vista
│
└── data-io/
    └── data-io.js                ← DataIO (export/import JSON) — depende de State, UI, Router, OnboardingModule
```

## Orden de carga de scripts (index.html)

1. `common/crypto.js`       — sin dependencias
2. `common/storage.js`      — sin dependencias
3. `common/state.js`        — depende de storage
4. `finance-math/finance-math.js` — depende de state
5. `ui/ui.js`               — depende de state
6. `loans/loans.js`         — depende de state, finance-math, ui
7. `expenses/expenses.js`   — depende de state, finance-math, ui
8. `accounts/accounts.js`   — depende de state, finance-math, ui
9. `goals/goals.js`         — depende de state, finance-math, ui  ← debe ir ANTES de dashboard
10. `dashboard/history.js`  — depende de state, finance-math, ui
11. `dashboard/dashboard.js`— depende de state, finance-math, ui, GoalsModule
12. `calendar/calendar.js`  — depende de state, finance-math, ui
13. `onboarding/onboarding.js` — depende de state, ui
14. `router/router.js`      — depende de todos los módulos de vista
15. `data-io/data-io.js`    — depende de state, ui, router, onboarding
16. `auth/auth.js`          — depende de todo (inicia la app)

## Servir localmente

```bash
npm ci            # una vez
npm run build     # compila src/ → assets/financeapp-core.js
python3 -m http.server 8080
# → http://localhost:8080
```

El paso `npm run build` compila el paquete nuevo (`src/`, TypeScript) a un único
script clásico que `index.html` carga antes de los módulos legacy. Si te lo
saltas, la app sigue funcionando: solo faltarán los módulos nuevos (el propio
`index.html` lo avisa por consola). El bundle está en `.gitignore` y se genera
en CI antes de desplegar.

## Estructura en migración

El repo contiene dos capas que conviven durante la refactorización:

- **Legacy** (raíz: `common/`, `dashboard/`, `expenses/`, …): scripts globales
  sin bundler, lo que hoy ve el usuario.
- **Nuevo** (`src/`): TypeScript modular y tipado — `core/` (dominio puro),
  `engine/` (motor de proyección por providers), `state/` (store + migraciones),
  `flags/` (feature flags). Se publica en `window.FinanceApp` para que el legacy
  lo consuma progresivamente.

El plan de migración, el análisis de features y las decisiones tomadas están en
[`docs/`](docs/). Los cálculos del código nuevo están verificados contra el
legacy con tests de paridad de igualdad estricta.

## Comandos

```bash
npm test           # suite completa (vitest)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint src tests
npm run format     # prettier --write
npm run build      # bundle del core
```

## Desplegar en GitHub Pages

1. Subir la carpeta `financeapp/` a un repositorio de GitHub
2. Settings → Pages → Source: `main` branch, carpeta `/` (root) o `/financeapp`
3. No requiere ninguna configuración adicional (solo ficheros estáticos)

## Notas de diseño

- **Sin bundler, sin npm**: todo carga como scripts globales clásicos (`<script src="...">`)
- **Sin ES modules**: se usa el patrón IIFE de módulo revelador (`const X = (() => { ... return {...}; })()`)
  para mantener compatibilidad total con `python -m http.server` sin CORS issues
- **Zero cambios de lógica**: refactorización puramente estructural, código 1:1 con v0.8.6
- **CSS en cascada**: `variables.css` → `base.css` → `components.css` → `ui.css` → módulos específicos
