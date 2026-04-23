// Depends on: State, UI, Router, OnboardingModule
const DataIO = (() => {

  // ── Export ──────────────────────────────────────────────────────────────────
  function exportJSON() {
    const snapshot = {
      _v: 1,
      _app: 'financeapp',
      _ts: new Date().toISOString(),
      loans:     State.get('loans')     || [],
      expenses:  State.get('expenses')  || [],
      accounts:  State.get('accounts')  || [],
      history:   State.get('history')   || [],
      goals:     State.get('goals')     || [],
      config:    State.get('config')    || {},
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const date = new Date().toISOString().slice(0,10);
    a.href     = url;
    a.download = `financeapp-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('Exportado correctamente ✓');
  }

  // ── Import ───────────────────────────────────────────────────────────────────
  async function importFromFile(file) {
    if (!file || !file.name.endsWith('.json')) {
      UI.toast('Selecciona un archivo .json', 'err'); return;
    }
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await applyImport(data);
    } catch(e) {
      UI.toast('Error al leer el archivo: ' + e.message, 'err');
    }
  }

  async function applyImport(data) {
    // Basic validation
    if (!data || typeof data !== 'object') {
      UI.toast('Archivo inválido', 'err'); return;
    }
    // Accept both raw state dump and versioned backup
    const loans     = data.loans     || [];
    const expenses  = data.expenses  || [];
    const accounts  = data.accounts  || [];
    const history   = data.history   || [];
    const goals     = data.goals     || [];
    const config    = data.config    || {};

    if (!Array.isArray(loans) || !Array.isArray(expenses)) {
      UI.toast('Formato de backup no reconocido', 'err'); return;
    }

    // Confirm if there's existing data
    const hasData = loans.length || expenses.length || (accounts.length > 1);
    if (hasData && !window.confirm(`¿Sustituir los datos actuales con el backup?\n(${loans.length} préstamos, ${expenses.length} gastos, ${accounts.length} cuentas)`)) {
      return;
    }

    // Apply to state
    State.set('loans',     loans);
    State.set('expenses',  expenses);
    State.set('accounts',  accounts);
    State.set('history',   history);
    State.set('goals',     goals);
    State.set('config',    config);

    // Run migrations
    State.ensureDefaultAccount();
    // (same migrations as State.load)
    const accs = (State.get('accounts')||[]).map(a => ({
      saldoInicial:0, fechaInicialSaldo:new Date().toISOString().slice(0,10), historicoSaldos:[], ...a
    }));
    State.set('accounts', accs);
    const cfg = State.get('config');
    delete cfg.saldoInicial; delete cfg.saldoInicialFecha;
    if (cfg.colchonMeses===undefined)  cfg.colchonMeses=6;
    if (cfg.showColchon===undefined)   cfg.showColchon=true;
    if (cfg.showHistorico===undefined) cfg.showHistorico=true;
    if (cfg.histCuenta===undefined)    cfg.histCuenta='';
    State.set('config', cfg);

    // Hide welcome overlay if visible
    document.getElementById('welcome-overlay')?.classList.add('hidden');

    UI.toast(`Importado: ${loans.length} préstamos, ${expenses.length} gastos, ${accounts.length} cuentas`);

    // Re-render current view
    Router.navigate('dashboard');
  }

  // ── Check if app has meaningful data ─────────────────────────────────────────
  function hasData() {
    const loans    = State.get('loans')    || [];
    const expenses = State.get('expenses') || [];
    const accounts = State.get('accounts') || [];
    const history  = State.get('history')  || [];
    // Default account alone doesn't count as "has data"
    const realAccounts = accounts.filter(a => a._id !== 'default' || a.saldoInicial > 0 || (a.historicoSaldos||[]).length > 0);
    return loans.length > 0 || expenses.length > 0 || realAccounts.length > 0 || history.length > 0;
  }

  // ── Welcome overlay ──────────────────────────────────────────────────────────
  function showWelcomeIfEmpty() {
    if (hasData()) return;
    document.getElementById('welcome-overlay')?.classList.remove('hidden');
  }

  function hideWelcome() {
    document.getElementById('welcome-overlay')?.classList.add('hidden');
  }

  // ── Wire up all buttons & drag events ────────────────────────────────────────
  function init() {
    // Sidebar export
    document.getElementById('btn-export')?.addEventListener('click', exportJSON);

    // Sidebar import (file picker)
    const sidebarInput = document.getElementById('import-file-input');
    document.getElementById('btn-import')?.addEventListener('click', () => sidebarInput?.click());
    sidebarInput?.addEventListener('change', e => {
      const f = e.target.files?.[0]; if (f) importFromFile(f);
      sidebarInput.value = '';
    });

    // Welcome overlay buttons
    const welcomeInput = document.getElementById('welcome-file-input');
    document.getElementById('welcome-import-btn')?.addEventListener('click', () => welcomeInput?.click());
    welcomeInput?.addEventListener('change', e => {
      const f = e.target.files?.[0]; if (f) importFromFile(f);
      welcomeInput.value = '';
    });
    document.getElementById('welcome-start-btn')?.addEventListener('click', () => {
      hideWelcome();
      const cfg = State.get('config');
      if (!cfg.onboardingDone) OnboardingModule.show();
    });

    // Welcome drop zone click → file picker
    const dropZone = document.getElementById('welcome-drop-hint');
    dropZone?.addEventListener('click', () => welcomeInput?.click());

    // Drag & drop on the welcome drop zone
    const setupDrop = (el) => {
      if (!el) return;
      el.addEventListener('dragover',  e => { e.preventDefault(); dropZone?.classList.add('drag-over'); });
      el.addEventListener('dragleave', e => { if (!el.contains(e.relatedTarget)) dropZone?.classList.remove('drag-over'); });
      el.addEventListener('drop',      e => {
        e.preventDefault();
        dropZone?.classList.remove('drag-over');
        const f = e.dataTransfer?.files?.[0];
        if (f) importFromFile(f);
      });
    };
    setupDrop(document.getElementById('welcome-drop-zone'));

    // Also accept drag & drop anywhere in the app (not just welcome screen)
    document.addEventListener('dragover',  e => e.preventDefault());
    document.addEventListener('drop', e => {
      e.preventDefault();
      const f = e.dataTransfer?.files?.[0];
      if (f?.name?.endsWith('.json')) {
        if (window.confirm(`¿Importar "${f.name}"?`)) importFromFile(f);
      }
    });
  }

  return { init, exportJSON, importFromFile, hasData, showWelcomeIfEmpty, hideWelcome };
})();
