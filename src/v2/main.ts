import './app.css';

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

// ── Version banner ────────────────────────────────────────────────────────────
function renderBanner(): string {
  const v1Href = import.meta.env.PROD ? '/FinanceApp/' : '/';
  return `
    <div class="version-banner" id="v2-banner">
      <span>Estás usando <strong>FinanceApp V2 (beta)</strong> —
        <a href="${v1Href}">Volver a V1</a>
      </span>
      <button class="version-banner__dismiss" id="banner-dismiss" aria-label="Cerrar aviso">×</button>
    </div>
  `;
}

// ── Navigation ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'gastos', label: '💸 Gastos' },
  { id: 'prestamos', label: '🏦 Préstamos' },
  { id: 'cuentas', label: '💳 Cuentas' },
  { id: 'calendario', label: '📅 Calendario' },
];

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
    </aside>
  `;
}

// ── WIP placeholder view ──────────────────────────────────────────────────────
function renderWipView(viewName: string): string {
  const v1Href = import.meta.env.PROD ? '/FinanceApp/' : '/';
  return `
    <div class="wip-card">
      <div class="wip-card__icon">🚧</div>
      <h1 class="wip-card__title">${viewName} — En construcción</h1>
      <p class="wip-card__desc">
        Esta vista se está migrando a V2 con TypeScript, Web Components y arquitectura SOLID.<br>
        Mientras tanto, puedes seguir usando la versión estable.
      </p>
      <a href="${v1Href}" class="wip-card__link">← Usar V1 estable</a>
    </div>
  `;
}

// ── Router ────────────────────────────────────────────────────────────────────
function getActiveView(): string {
  return location.hash.replace('#', '') || 'dashboard';
}

function render(): void {
  const view = getActiveView();
  const viewLabel = NAV_ITEMS.find((n) => n.id === view)?.label ?? view;

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${renderBanner()}
    <div class="app-shell">
      ${renderSidebar(view)}
      <main class="main-content">
        ${renderWipView(viewLabel)}
      </main>
    </div>
  `;

  // Banner dismiss
  document.getElementById('banner-dismiss')?.addEventListener('click', () => {
    document.getElementById('v2-banner')?.remove();
    localStorage.setItem('financeapp_v2_banner_dismissed', '1');
  });

  // SPA nav links
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
