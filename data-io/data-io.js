// Depends on: State, UI, Router, OnboardingModule, FirebaseService, DropboxService
const DataIO = (() => {

  let _autoSaveTimer = null;

  // ── Export JSON ─────────────────────────────────────────────────────────────
  function exportJSON() {
    const snapshot = {
      _v: 2, _app: 'financeapp', _ts: new Date().toISOString(),
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
    a.href     = url;
    a.download = `financeapp-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('Exportado correctamente ✓');
  }

  // ── Import from file ─────────────────────────────────────────────────────────
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

  // ── Apply import ─────────────────────────────────────────────────────────────
  async function applyImport(data) {
    if (!data || typeof data !== 'object') { UI.toast('Archivo inválido', 'err'); return; }
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
    const hasData = loans.length || expenses.length || (accounts.length > 1);
    if (hasData && !window.confirm(`¿Sustituir los datos actuales con el backup?\n(${loans.length} préstamos, ${expenses.length} gastos, ${accounts.length} cuentas)`)) return;

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

    State.ensureDefaultAccount();
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

    document.getElementById('welcome-overlay')?.classList.add('hidden');
    UI.toast(`Importado: ${loans.length} préstamos, ${expenses.length} gastos, ${accounts.length} cuentas`);
    Router.navigate('dashboard');
  }

  // ── Firebase helpers ─────────────────────────────────────────────────────────
  async function _exportFirebaseToJSON() {
    const backup = await FirebaseService.downloadBackup();
    if (!backup) { UI.toast('Sin copia en Firebase todavía.', 'warn'); return; }
    const snapshot = { _v:2, _app:'financeapp', _ts:new Date().toISOString(), ...backup };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `financeapp-firebase-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('Backup de Firebase exportado ✓');
  }

  async function _importJSONToFirebase(file) {
    if (!file || !file.name.endsWith('.json')) { UI.toast('Selecciona un archivo .json', 'err'); return; }
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') { UI.toast('Archivo inválido', 'err'); return; }
    if (!window.confirm('¿Subir este archivo a Firebase y sobrescribir el backup remoto?')) return;
    await applyImport(data);
    await FirebaseService.uploadBackup();
    UI.toast('Datos importados y subidos a Firebase ✓');
  }

  // ── Auto-save ────────────────────────────────────────────────────────────────
  function initAutoSave() {
    _stopAutoSave();
    const cfg = State.get('config');
    if (!cfg.autoSave) return;
    if (!FirebaseService.isConnected() && !DropboxService.isConnected()) return;
    const ms = Math.max(1, cfg.autoSaveInterval || 15) * 60 * 1000;
    _autoSaveTimer = setInterval(async () => {
      try {
        if      (FirebaseService.isConnected()) await FirebaseService.uploadBackup();
        else if (DropboxService.isConnected())  await DropboxService.uploadBackup();
      } catch (e) { console.warn('Auto-save error:', e.message); }
    }, ms);
  }

  function _stopAutoSave() {
    if (_autoSaveTimer) { clearInterval(_autoSaveTimer); _autoSaveTimer = null; }
  }

  function _saveAutoSaveCfg(enabled, interval) {
    const cfg = State.get('config');
    cfg.autoSave = enabled;
    cfg.autoSaveInterval = Math.max(1, parseInt(interval) || 15);
    State.set('config', cfg);
    initAutoSave();
  }

  // ── Modal "Administrar datos" ─────────────────────────────────────────────────
  function openDataModal() {
    const fbx = FirebaseService.isConnected();
    const dbx = DropboxService.isConnected();
    const cfg = State.get('config');

    const fbxSection = fbx ? `
      <div class="dm-section">
        <div class="dm-section-head">
          <span class="dm-badge dm-badge--firebase">🔥 Firebase</span>
          <span class="dm-section-email">${FirebaseService.currentUserEmail()}</span>
        </div>
        <div class="dm-grid">
          <button class="btn-primary dm-btn" id="dm-fbx-save">Guardar ahora</button>
          <button class="btn-secondary dm-btn" id="dm-fbx-load">Cargar copia</button>
        </div>
        <div class="dm-grid">
          <button class="btn-secondary dm-btn" id="dm-fbx-to-json">↓ Firebase → JSON</button>
          <button class="btn-secondary dm-btn" id="dm-fbx-from-json">↑ JSON → Firebase</button>
        </div>
        <div class="dm-autosave">
          <label>
            <input type="checkbox" id="dm-autosave" ${cfg.autoSave ? 'checked' : ''}>
            Guardar automáticamente cada
          </label>
          <input type="number" id="dm-autosave-mins" class="dm-autosave-interval"
                 value="${cfg.autoSaveInterval || 15}" min="1" max="120"
                 ${!cfg.autoSave ? 'disabled' : ''}>
          <span style="font-size:12px;color:var(--text3)">min</span>
        </div>
        <div class="dm-logout-row">
          <button class="btn-secondary dm-btn" id="dm-fbx-logout" style="color:var(--red)">Cerrar sesión Firebase</button>
        </div>
      </div>` : '';

    const dbxSection = dbx ? `
      <div class="dm-section">
        <div class="dm-section-head">
          <span class="dm-badge dm-badge--dropbox">☁ Dropbox</span>
        </div>
        <div class="dm-grid">
          <button class="btn-primary dm-btn" id="dm-dbx-save">Guardar ahora</button>
          <button class="btn-secondary dm-btn" id="dm-dbx-logout" style="color:var(--red)">Desconectar</button>
        </div>
      </div>` : '';

    const noCloud = (!fbx && !dbx) ? `
      <div class="dm-section" style="border-left:3px solid var(--accent)">
        <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px">Sin copia de seguridad en la nube</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.5">
          Tus datos solo están en este dispositivo. Conecta la nube para tenerlos siempre a salvo y sincronizados.
        </div>
        <div class="dm-grid">
          <button class="btn-firebase dm-btn" id="dm-connect-firebase" style="font-size:12px">🔥 Firebase</button>
          <button class="btn-dropbox dm-btn" id="dm-connect-dropbox" style="font-size:12px">☁ Dropbox</button>
        </div>
      </div>` : '';

    UI.openModal(`
      <div class="dm-modal">
        <div class="dm-section">
          <div class="dm-section-head">
            <span class="dm-badge dm-badge--local">Dispositivo</span>
          </div>
          <div class="dm-grid">
            <button class="btn-secondary dm-btn" id="dm-export">↓ Exportar JSON</button>
            <button class="btn-secondary dm-btn" id="dm-import">↑ Importar JSON</button>
          </div>
        </div>
        ${fbxSection}${dbxSection}${noCloud}
      </div>`, 'Administrar datos');

    // Upgrade to cloud (shown when no cloud connected)
    if (!fbx && !dbx) {
      document.getElementById('dm-connect-firebase')?.addEventListener('click', () => AuthModule.connectCloud('firebase'));
      document.getElementById('dm-connect-dropbox')?.addEventListener('click',  () => AuthModule.connectCloud('dropbox'));
    }

    // Local
    document.getElementById('dm-export')?.addEventListener('click', exportJSON);
    document.getElementById('dm-import')?.addEventListener('click', () => document.getElementById('import-file-input')?.click());

    // Firebase
    if (fbx) {
      document.getElementById('dm-fbx-save')?.addEventListener('click', async () => {
        const btn = document.getElementById('dm-fbx-save');
        btn.disabled = true; btn.textContent = '…';
        try { await FirebaseService.uploadBackup(); UI.toast('Guardado en Firebase ✓'); }
        catch (e) { UI.toast('Error: ' + e.message, 'err'); btn.disabled = false; btn.textContent = 'Guardar ahora'; }
      });

      document.getElementById('dm-fbx-load')?.addEventListener('click', async () => {
        if (!window.confirm('¿Cargar la copia de Firebase? Se sustituirán los datos locales.')) return;
        const btn = document.getElementById('dm-fbx-load');
        btn.disabled = true; btn.textContent = '…';
        try {
          const backup = await FirebaseService.downloadBackup();
          if (!backup) { UI.toast('Sin copia en Firebase todavía.', 'warn'); btn.disabled = false; btn.textContent = 'Cargar copia'; return; }
          UI.closeModal();
          await applyImport(backup);
        } catch (e) { UI.toast('Error: ' + e.message, 'err'); btn.disabled = false; btn.textContent = 'Cargar copia'; }
      });

      document.getElementById('dm-fbx-to-json')?.addEventListener('click', async () => {
        try { await _exportFirebaseToJSON(); } catch (e) { UI.toast('Error: ' + e.message, 'err'); }
      });

      document.getElementById('dm-fbx-from-json')?.addEventListener('click', () =>
        document.getElementById('fbx-import-file-input')?.click()
      );

      const toggle = document.getElementById('dm-autosave');
      const minsEl = document.getElementById('dm-autosave-mins');
      toggle?.addEventListener('change', () => {
        minsEl.disabled = !toggle.checked;
        _saveAutoSaveCfg(toggle.checked, minsEl.value);
      });
      minsEl?.addEventListener('change', () => _saveAutoSaveCfg(toggle.checked, minsEl.value));

      document.getElementById('dm-fbx-logout')?.addEventListener('click', async () => {
        if (!window.confirm('¿Cerrar sesión de Firebase?')) return;
        _stopAutoSave();
        await FirebaseService.logout();
        document.getElementById('btn-fbx-whitelist')?.classList.add('hidden');
        document.getElementById('fbx-user-email').textContent = '';
        UI.closeModal();
        UI.toast('Firebase: sesión cerrada');
      });
    }

    // Dropbox
    if (dbx) {
      document.getElementById('dm-dbx-save')?.addEventListener('click', async () => {
        const btn = document.getElementById('dm-dbx-save');
        btn.disabled = true; btn.textContent = '…';
        try { await DropboxService.uploadBackup(); UI.toast('Guardado en Dropbox ✓'); }
        catch (e) { UI.toast('Error: ' + e.message, 'err'); btn.disabled = false; btn.textContent = 'Guardar ahora'; }
      });

      document.getElementById('dm-dbx-logout')?.addEventListener('click', () => {
        if (!window.confirm('¿Desconectar Dropbox?')) return;
        _stopAutoSave();
        DropboxService.forget();
        UI.closeModal();
        UI.toast('Dropbox desconectado');
      });
    }
  }

  // ── Has data ─────────────────────────────────────────────────────────────────
  function hasData() {
    const loans    = State.get('loans')    || [];
    const expenses = State.get('expenses') || [];
    const accounts = State.get('accounts') || [];
    const history  = State.get('history')  || [];
    const realAccounts = accounts.filter(a => a._id !== 'default' || a.saldoInicial > 0 || (a.historicoSaldos||[]).length > 0);
    return loans.length > 0 || expenses.length > 0 || realAccounts.length > 0 || history.length > 0;
  }

  function showWelcomeIfEmpty() {
    if (hasData()) return;
    document.getElementById('welcome-overlay')?.classList.remove('hidden');
  }

  function hideWelcome() {
    document.getElementById('welcome-overlay')?.classList.add('hidden');
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    // Botón único de gestión de datos
    document.getElementById('btn-data-mgmt')?.addEventListener('click', openDataModal);

    // File inputs (hidden, triggered desde el modal)
    const localInput = document.getElementById('import-file-input');
    localInput?.addEventListener('change', e => {
      const f = e.target.files?.[0]; if (f) importFromFile(f);
      localInput.value = '';
    });

    const fbxInput = document.getElementById('fbx-import-file-input');
    fbxInput?.addEventListener('change', async e => {
      const f = e.target.files?.[0];
      if (f) { try { await _importJSONToFirebase(f); } catch(err) { UI.toast('Error: ' + err.message, 'err'); } }
      fbxInput.value = '';
    });

    // Welcome overlay
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

    const dropZone = document.getElementById('welcome-drop-hint');
    dropZone?.addEventListener('click', () => welcomeInput?.click());

    const setupDrop = (el) => {
      if (!el) return;
      el.addEventListener('dragover',  e => { e.preventDefault(); dropZone?.classList.add('drag-over'); });
      el.addEventListener('dragleave', e => { if (!el.contains(e.relatedTarget)) dropZone?.classList.remove('drag-over'); });
      el.addEventListener('drop',      e => {
        e.preventDefault(); dropZone?.classList.remove('drag-over');
        const f = e.dataTransfer?.files?.[0]; if (f) importFromFile(f);
      });
    };
    setupDrop(document.getElementById('welcome-drop-zone'));

    document.addEventListener('dragover',  e => e.preventDefault());
    document.addEventListener('drop', e => {
      e.preventDefault();
      const f = e.dataTransfer?.files?.[0];
      if (f?.name?.endsWith('.json')) { if (window.confirm(`¿Importar "${f.name}"?`)) importFromFile(f); }
    });
  }

  return {
    init, exportJSON, importFromFile, applyImport,
    hasData, showWelcomeIfEmpty, hideWelcome,
    openDataModal, initAutoSave,
  };
})();
