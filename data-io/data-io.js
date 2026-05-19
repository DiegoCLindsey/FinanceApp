// Depends on: State, UI, Router, OnboardingModule, FirebaseService
const DataIO = (() => {

  // ── Export ──────────────────────────────────────────────────────────────────
  function exportJSON() {
    const snapshot = {
      _v: 2,
      _app: 'financeapp',
      _ts: new Date().toISOString(),
      loans:      State.get('loans')      || [],
      expenses:   State.get('expenses')   || [],
      accounts:   State.get('accounts')   || [],
      history:    State.get('history')    || [],
      goals:      State.get('goals')      || [],
      nominas:    State.get('nominas')    || [],
      inflacion:  State.get('inflacion')  || [],
      tramosGananciasCapitalHistorico: State.get('tramosGananciasCapitalHistorico') || [],
      tramosIRPFHistorico: State.get('tramosIRPFHistorico') || [],
      escenarios: State.get('escenarios') || [],
      config:     State.get('config')     || {},
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
    const loans      = data.loans      || [];
    const expenses   = data.expenses   || [];
    const accounts   = data.accounts   || [];
    const history    = data.history    || [];
    const goals      = data.goals      || [];
    const nominas    = data.nominas    || [];
    const inflacion  = data.inflacion  || [];
    const tramosGananciasCapitalHistorico = data.tramosGananciasCapitalHistorico || [];
    const tramosIRPFHistorico = data.tramosIRPFHistorico || [];
    const escenarios = data.escenarios || [];
    const config     = data.config     || {};

    if (!Array.isArray(loans) || !Array.isArray(expenses)) {
      UI.toast('Formato de backup no reconocido', 'err'); return;
    }

    // Confirm if there's existing data
    const hasData = loans.length || expenses.length || (accounts.length > 1);
    if (hasData && !window.confirm(`¿Sustituir los datos actuales con el backup?\n(${loans.length} préstamos, ${expenses.length} gastos, ${accounts.length} cuentas)`)) {
      return;
    }

    // Apply to state
    State.set('loans',      loans);
    State.set('expenses',   expenses);
    State.set('accounts',   accounts);
    State.set('history',    history);
    State.set('goals',      goals);
    State.set('nominas',    nominas);
    State.set('inflacion',  inflacion);
    State.set('tramosGananciasCapitalHistorico', tramosGananciasCapitalHistorico);
    State.set('tramosIRPFHistorico', tramosIRPFHistorico);
    State.set('escenarios', escenarios);
    State.set('config',     config);

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

  // ── Firebase: subir backup manualmente ───────────────────────────────────────
  async function pushToFirebase() {
    if (!FirebaseService.isConnected()) {
      UI.toast('No estás conectado a Firebase.', 'err'); return;
    }
    try {
      await FirebaseService.uploadBackup();
      UI.toast('Datos guardados en Firebase ✓');
    } catch (err) {
      UI.toast('Error al guardar en Firebase: ' + err.message, 'err');
    }
  }

  // ── Firebase: descargar y aplicar backup ──────────────────────────────────────
  async function pullFromFirebase() {
    if (!FirebaseService.isConnected()) {
      UI.toast('No estás conectado a Firebase.', 'err'); return;
    }
    try {
      const backup = await FirebaseService.downloadBackup();
      if (!backup) { UI.toast('No hay backup en Firebase todavía.', 'warn'); return; }
      if (!window.confirm('¿Sustituir los datos locales con el backup de Firebase?')) return;
      await applyImport(backup);
    } catch (err) {
      UI.toast('Error al descargar de Firebase: ' + err.message, 'err');
    }
  }

  // ── Firebase → JSON: exportar backup remoto a archivo local ──────────────────
  async function exportFirebaseToJSON() {
    if (!FirebaseService.isConnected()) {
      UI.toast('No estás conectado a Firebase.', 'err'); return;
    }
    try {
      const backup = await FirebaseService.downloadBackup();
      if (!backup) { UI.toast('No hay backup en Firebase todavía.', 'warn'); return; }
      const snapshot = {
        _v: 2, _app: 'financeapp', _ts: new Date().toISOString(), ...backup,
      };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `financeapp-firebase-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      UI.toast('Backup de Firebase exportado a JSON ✓');
    } catch (err) {
      UI.toast('Error al exportar de Firebase: ' + err.message, 'err');
    }
  }

  // ── JSON → Firebase: importar archivo local y subirlo cifrado ────────────────
  async function importJSONToFirebase(file) {
    if (!FirebaseService.isConnected()) {
      UI.toast('No estás conectado a Firebase.', 'err'); return;
    }
    if (!file || !file.name.endsWith('.json')) {
      UI.toast('Selecciona un archivo .json', 'err'); return;
    }
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object') { UI.toast('Archivo inválido', 'err'); return; }
      if (!window.confirm('¿Subir este archivo a Firebase y sobrescribir el backup remoto?')) return;
      // Aplicar localmente primero
      await applyImport(data);
      // Luego subir
      await FirebaseService.uploadBackup();
      UI.toast('Datos importados y subidos a Firebase ✓');
    } catch (err) {
      UI.toast('Error: ' + err.message, 'err');
    }
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

    // Firebase buttons
    document.getElementById('btn-fbx-push')?.addEventListener('click', pushToFirebase);
    document.getElementById('btn-fbx-pull')?.addEventListener('click', pullFromFirebase);
    document.getElementById('btn-fbx-export-json')?.addEventListener('click', exportFirebaseToJSON);
    const fbxImportInput = document.getElementById('fbx-import-file-input');
    document.getElementById('btn-fbx-import-json')?.addEventListener('click', () => fbxImportInput?.click());
    fbxImportInput?.addEventListener('change', e => {
      const f = e.target.files?.[0]; if (f) importJSONToFirebase(f);
      fbxImportInput.value = '';
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

  return {
    init, exportJSON, importFromFile, hasData, showWelcomeIfEmpty, hideWelcome,
    pushToFirebase, pullFromFirebase, exportFirebaseToJSON, importJSONToFirebase,
  };
})();
