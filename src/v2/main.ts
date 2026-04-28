import './app.css';
import './views/DashboardView';
import './views/LoanListView';
import './views/ExpenseListView';

// ── Theme initialisation ──────────────────────────────────────────────────────
type Theme = 'dark' | 'light' | 'system';

function applyTheme(theme: Theme): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
  document.documentElement.setAttribute('data-theme', resolved);
}

function initTheme(): void {
  const saved = (localStorage.getItem('financeapp_theme') as Theme | null) ?? 'system';
  applyTheme(saved);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = (localStorage.getItem('financeapp_theme') as Theme | null) ?? 'system';
    if (current === 'system') applyTheme('system');
  });
}

// ── Navigation ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'gastos', label: '💸 Gastos' },
  { id: 'prestamos', label: '🏦 Préstamos' },
  { id: 'cuentas', label: '💳 Cuentas' },
  { id: 'calendario', label: '📅 Calendario' },
];

// Derives the V1 root from the Vite base URL (/FinanceApp/v2/ → /FinanceApp/)
const V1_HREF = import.meta.env.BASE_URL.replace(/v2\/?$/, '') || '/';

function renderSidebar(active: string): string {
  const links = NAV_ITEMS.map(
    ({ id, label }) =>
      `<a href="#${id}" class="${active === id ? 'active' : ''}" data-view="${id}">${label}</a>`
  ).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar__logo">
        <div class="sidebar__logo-mark">F</div>
        <span class="sidebar__logo-text">FinanceApp</span>
        <span class="sidebar__logo-v2">V2</span>
      </div>
      <nav class="sidebar__nav">${links}</nav>
      <div class="sidebar__footer">
        <a href="${V1_HREF}" class="sidebar__back-v1">← Versión estable (V1)</a>
      </div>
    </aside>
  `;
}

// ── WIP placeholder view ──────────────────────────────────────────────────────
function renderWipView(viewName: string): string {
  return `
    <div class="wip-card">
      <div class="wip-card__icon">🚧</div>
      <h1 class="wip-card__title">${viewName} — En construcción</h1>
      <p class="wip-card__desc">
        Esta vista se está migrando a V2 con TypeScript, Web Components y arquitectura SOLID.
      </p>
    </div>
  `;
}

// ── Router ────────────────────────────────────────────────────────────────────
function getActiveView(): string {
  return location.hash.replace('#', '') || 'dashboard';
}

function renderView(viewId: string, viewLabel: string): string {
  if (viewId === 'dashboard') return '<fin-dashboard></fin-dashboard>';
  if (viewId === 'prestamos') return '<fin-loan-list></fin-loan-list>';
  if (viewId === 'gastos') return '<fin-expense-list></fin-expense-list>';
  return renderWipView(viewLabel);
}

function render(): void {
  const view = getActiveView();
  const viewLabel = NAV_ITEMS.find((n) => n.id === view)?.label ?? view;

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(view)}
      <main class="main-content">
        ${renderView(view, viewLabel)}
      </main>
    </div>
  `;

  app.querySelectorAll('[data-view]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = (el as HTMLElement).dataset.view ?? 'dashboard';
      history.pushState(null, '', `#${viewId}`);
      render();
    });
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
initTheme();
render();
window.addEventListener('popstate', render);
