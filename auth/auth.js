// ==================== AUTH ====================
// Depends on: CryptoService (common/crypto.js), StorageAdapter (common/storage.js),
//             State (common/state.js), UI (ui/ui.js),
//             DataIO (data-io/data-io.js), Router (router/router.js),
//             FirebaseService (firebase/firebase-service.js)

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE DRIVE — DESACTIVADO
// El servicio GDriveService se conserva en el código pero no se presenta
// al usuario. No eliminar: puede reactivarse en el futuro.
// ─────────────────────────────────────────────────────────────────────────────
/* GDRIVE_DISABLED_START
const GDRIVE_CLIENT_ID     = '%%GDRIVE_CLIENT_ID%%';
const GDRIVE_CLIENT_SECRET = '%%GDRIVE_CLIENT_SECRET%%';
const GDRIVE_SCOPE         = 'https://www.googleapis.com/auth/drive.appdata';
const GDRIVE_FILE_NAME     = 'financeapp_backup.enc';

const GDriveService = (() => {
  // ... implementación completa preservada, ver historial de git ...
  // Tipo: Desktop app + PKCE + client_secret (no confidencial para este tipo)
  // Para reactivar: descomentar este bloque y restaurar los botones en index.html
  return {};
})();
GDRIVE_DISABLED_END */


// ─────────────────────────────────────────────────────────────────────────────
// DROPBOX SERVICE
//
// Flujo de usuario:
//   1. El usuario genera un token de acceso en dropbox.com/developers/apps
//      (tipo App folder, scopes files.content.read + files.content.write)
//   2. Pega el token + elige una clave de cifrado en la pantalla de inicio
//   3. El token se guarda cifrado en localStorage (clave = passphrase del usuario)
//   4. Los datos se cifran con AES-GCM antes de subir — Dropbox nunca ve texto claro
//
// Aislamiento multi-usuario:
//   Cada token solo da acceso a la carpeta /Apps/<nombre_app>/ del propietario.
//   El aislamiento lo garantiza Dropbox en su backend — no hay forma de que
//   un usuario acceda a los datos de otro.
//
// Fichero en Dropbox: /financeapp_backup.enc (texto cifrado)
// ─────────────────────────────────────────────────────────────────────────────
const DropboxService = (() => {
  const FILE_PATH      = '/financeapp_backup.enc';
  const LS_TOKEN       = 'financeapp_dbx_token_enc';  // token cifrado con la passphrase
  const LS_SALT        = 'financeapp_dbx_salt';
  const LS_TOKEN_META  = 'financeapp_dbx_token_meta'; // { savedAt: ISO string }

  let _token      = null;   // access token en claro (solo en memoria)
  let _cryptoKey  = null;   // clave AES-GCM derivada de la passphrase (para token local)
  let _passphrase = null;   // passphrase en claro (solo en memoria, para encryptPortable)

  // ── Derivar clave y cifrar/descifrar el token guardado ───────────────────────
  async function _deriveKey(passphrase) {
    let saltB64 = localStorage.getItem(LS_SALT);
    let salt;
    if (saltB64) {
      salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
    } else {
      salt    = CryptoService.generateSalt();
      saltB64 = btoa(String.fromCharCode(...salt));
      localStorage.setItem(LS_SALT, saltB64);
    }
    return CryptoService.deriveKey(passphrase, salt);
  }

  // ── Verificar token contra la API de Dropbox ─────────────────────────────────
  async function _verifyToken(token) {
    const resp = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
      method:  'POST',
      headers: { Authorization: 'Bearer ' + token },
    });
    if (resp.status === 401) throw new Error('Token inválido o revocado. Comprueba que el token es correcto y que los permisos files.content.read y files.content.write están activos.');
    if (!resp.ok)            throw new Error('Error al verificar el token con Dropbox (HTTP ' + resp.status + ').');
    return true;
  }

  // ── Setup inicial: verificar token + derivar clave + guardar token cifrado ───
  async function setup(token, passphrase) {
    if (!token || !token.trim())      throw new Error('El token no puede estar vacío.');
    if (!passphrase || passphrase.length < 4) throw new Error('La clave de cifrado debe tener al menos 4 caracteres.');

    await _verifyToken(token.trim());

    const key         = await _deriveKey(passphrase);
    const tokenCipher = await CryptoService.encrypt(key, { t: token.trim() });
    localStorage.setItem(LS_TOKEN, tokenCipher);
    localStorage.setItem(LS_TOKEN_META, JSON.stringify({ savedAt: new Date().toISOString() }));

    _token      = token.trim();
    _cryptoKey  = key;
    _passphrase = passphrase;
  }

  // ── Desbloqueo: descifrar token guardado con la passphrase ──────────────────
  async function unlock(passphrase) {
    const tokenCipher = localStorage.getItem(LS_TOKEN);
    if (!tokenCipher) throw new Error('No hay sesión guardada.');
    const key = await _deriveKey(passphrase);
    let plain;
    try {
      plain = await CryptoService.decrypt(key, tokenCipher);
    } catch {
      throw new Error('Clave incorrecta. Los datos no se pueden descifrar.');
    }
    if (!plain?.t) throw new Error('Sesión corrupta. Olvida la cuenta y vuelve a conectar.');
    _token      = plain.t;
    _cryptoKey  = key;
    _passphrase = passphrase;
    return true;
  }

  // ── Estado ────────────────────────────────────────────────────────────────────
  function hasSavedSession() { return !!localStorage.getItem(LS_TOKEN); }
  function isConnected()     { return !!_token && !!_cryptoKey; }

  function forget() {
    _token      = null;
    _cryptoKey  = null;
    _passphrase = null;
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_SALT);
    localStorage.removeItem(LS_TOKEN_META);
  }

  function tokenAgeHours() {
    try {
      const meta = JSON.parse(localStorage.getItem(LS_TOKEN_META) || 'null');
      if (!meta?.savedAt) return null;
      return (Date.now() - new Date(meta.savedAt).getTime()) / 3600000;
    } catch { return null; }
  }

  function couldBeExpired() {
    const h = tokenAgeHours();
    return h !== null && h >= 4;
  }

  // ── Dropbox API helpers ───────────────────────────────────────────────────────
  async function _apiPost(url, body, extraHeaders = {}) {
    const resp = await fetch(url, {
      method:  'POST',
      headers: {
        Authorization:  'Bearer ' + _token,
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      body: JSON.stringify(body),
    });
    return resp;
  }

  // ── Subir backup cifrado ──────────────────────────────────────────────────────
  // Usa encryptPortable: genera sal+IV frescos y los embebe en el payload.
  // Formato en Dropbox: "salt_b64:iv_b64:ct_b64"
  // Cualquier dispositivo con la passphrase correcta puede descifrarlo.
  async function uploadBackup() {
    if (!isConnected()) throw new Error('No conectado a Dropbox.');

    const snapshot = {};
    for (const k of ['loans', 'expenses', 'accounts', 'history', 'goals', 'nominas', 'inflacion', 'tramosGananciasCapitalHistorico', 'tramosIRPFHistorico', 'escenarios', 'config']) {
      snapshot[k] = State.get(k);
    }

    // Cifrado portátil: sal embebida, no depende del localStorage local
    const cipher = await CryptoService.encryptPortable(_passphrase, snapshot);
    const blob   = new Blob([cipher], { type: 'text/plain' });

    const resp = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method:  'POST',
      headers: {
        Authorization:     'Bearer ' + _token,
        'Content-Type':    'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: FILE_PATH, mode: 'overwrite', autorename: false, mute: true,
        }),
      },
      body: blob,
    });

    if (resp.status === 401) throw new Error('Token de Dropbox inválido o expirado.');
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error('Error al subir a Dropbox: ' + (err?.error_summary || resp.status));
    }
  }

  // ── Descargar y descifrar backup ─────────────────────────────────────────────
  // Usa decryptPortable: extrae la sal del propio payload antes de derivar la clave.
  // No usa localStorage — funciona igual en cualquier dispositivo.
  async function downloadBackup() {
    if (!isConnected()) throw new Error('No conectado a Dropbox.');

    const resp = await fetch('https://content.dropboxapi.com/2/files/download', {
      method:  'POST',
      headers: {
        Authorization:     'Bearer ' + _token,
        'Dropbox-API-Arg': JSON.stringify({ path: FILE_PATH }),
      },
    });

    if (resp.status === 409) return null;   // fichero no existe todavía
    if (resp.status === 401) throw new Error('Token de Dropbox inválido o expirado.');
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error('Error al descargar de Dropbox: ' + (err?.error_summary || resp.status));
    }

    const cipher = await resp.text();
    try {
      return await CryptoService.decryptPortable(_passphrase, cipher);
    } catch {
      throw new Error('No se pudo descifrar el backup. Clave de cifrado incorrecta.');
    }
  }

  return {
    setup, unlock, hasSavedSession, isConnected, forget,
    uploadBackup, downloadBackup, tokenAgeHours, couldBeExpired,
  };
})();


// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODULE
// Gestiona los tres estados de la pantalla de inicio:
//   • step-select  → selector de método (Dropbox / local)
//   • step-dropbox → formulario de primera conexión
//   • step-unlock  → desbloqueo de sesión guardada
// ─────────────────────────────────────────────────────────────────────────────
const AuthModule = (() => {

  const ALL_STEPS = [
    'auth-step-select',
    'auth-step-dropbox',
    'auth-step-unlock',
    'auth-step-firebase-setup',
    'auth-step-firebase-unlock',
  ];

  // ── Helpers de UI ─────────────────────────────────────────────────────────────
  function _showStep(id) {
    ALL_STEPS.forEach(s => {
      document.getElementById(s)?.classList.toggle('hidden', s !== id);
    });
  }
  function _err(elId, msg) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (msg) { el.textContent = msg; el.classList.remove('hidden'); }
    else      { el.classList.add('hidden'); el.textContent = ''; }
  }
  function _setBusy(btnId, busy, label) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled    = busy;
    btn.textContent = busy ? '…' : label;
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  async function init() {
    // Mostrar overlay de auth al arrancar
    document.getElementById('auth-overlay').classList.remove('hidden');

    // ── Modal de instrucciones Dropbox ────────────────────────────────────────
    document.getElementById('btn-dbx-help')?.addEventListener('click', () => {
      document.getElementById('dbx-help-overlay')?.classList.remove('hidden');
    });
    document.getElementById('btn-dbx-help-close')?.addEventListener('click', () => {
      document.getElementById('dbx-help-overlay')?.classList.add('hidden');
    });

    // ── Modal de instrucciones Firebase ───────────────────────────────────────
    document.getElementById('btn-fbx-help')?.addEventListener('click', () => {
      document.getElementById('fbx-help-overlay')?.classList.remove('hidden');
    });
    document.getElementById('btn-fbx-help-close')?.addEventListener('click', () => {
      document.getElementById('fbx-help-overlay')?.classList.add('hidden');
    });

    // ── ¿Hay sesión Firebase guardada? ────────────────────────────────────────
    if (FirebaseService.hasSavedSession()) {
      _showStep('auth-step-firebase-unlock');
      _wireFirebaseUnlockStep();
      return;
    }

    // ── ¿Hay sesión Dropbox guardada? ─────────────────────────────────────────
    if (DropboxService.hasSavedSession()) {
      _showStep('auth-step-unlock');
      _wireUnlockStep();
      return;
    }

    // ── Primera vez → selector ─────────────────────────────────────────────────
    _showStep('auth-step-select');

    document.getElementById('btn-dropbox')?.addEventListener('click', () => {
      _showStep('auth-step-dropbox');
      _wireDropboxStep();
    });

    document.getElementById('btn-firebase')?.addEventListener('click', () => {
      _showStep('auth-step-firebase-setup');
      _wireFirebaseSetupStep();
    });

    document.getElementById('btn-local')?.addEventListener('click', () => {
      launch('local');
    });
  }

  // ── Paso: formulario de primera conexión Dropbox ─────────────────────────────
  function _wireDropboxStep() {
    _err('dbx-error', '');

    document.getElementById('btn-dropbox-back')?.addEventListener('click', () => {
      _showStep('auth-step-select');
    });

    const doConnect = async () => {
      _err('dbx-error', '');
      const token = document.getElementById('dbx-token')?.value?.trim();
      const pass  = document.getElementById('dbx-passphrase')?.value;

      if (!token) { _err('dbx-error', 'Introduce el token de Dropbox.'); return; }
      if (!pass)  { _err('dbx-error', 'Introduce una clave de cifrado.'); return; }

      _setBusy('btn-dropbox-connect', true, 'Conectar y continuar');
      try {
        await DropboxService.setup(token, pass);

        // Intentar descargar backup existente
        const backup = await DropboxService.downloadBackup();
        if (backup) {
          for (const [k, v] of Object.entries(backup)) {
            if (v !== undefined) StorageAdapter.set('state_' + k, v);
          }
          UI.toast('Backup cargado desde Dropbox ✓');
        } else {
          UI.toast('Dropbox conectado. Sin backup previo — empezando desde cero.');
        }

        await launch('dropbox');
      } catch (err) {
        _err('dbx-error', err.message);
      } finally {
        _setBusy('btn-dropbox-connect', false, 'Conectar y continuar');
      }
    };

    document.getElementById('btn-dropbox-connect')?.addEventListener('click', doConnect);
    document.getElementById('dbx-passphrase')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doConnect();
    });

    // Foco en el primer campo vacío
    const tokenEl = document.getElementById('dbx-token');
    setTimeout(() => tokenEl?.focus(), 50);
  }

  // ── Paso: desbloqueo de sesión guardada ───────────────────────────────────────
  function _wireUnlockStep() {
    _err('dbx-unlock-error', '');

    // Aviso de posible caducidad del token
    const warningEl = document.getElementById('dbx-expiry-warning');
    if (warningEl && DropboxService.couldBeExpired()) {
      const h = Math.floor(DropboxService.tokenAgeHours());
      warningEl.innerHTML =
        `⚠ El token se guardó hace ${h} horas y puede haber caducado (límite: 4 h). ` +
        `Si la conexión falla, genera uno nuevo:<br><a href="https://www.dropbox.com/developers/apps" ` +
        `target="_blank" style="color:var(--yellow);font-weight:600;text-decoration:underline">` +
        `Abrir Dropbox Developers →</a>`;
      warningEl.classList.remove('hidden');
    }

    const doUnlock = async () => {
      _err('dbx-unlock-error', '');
      const pass = document.getElementById('dbx-unlock-passphrase')?.value;
      if (!pass) { _err('dbx-unlock-error', 'Introduce tu clave de cifrado.'); return; }

      _setBusy('btn-dropbox-unlock', true, 'Desbloquear');
      try {
        await DropboxService.unlock(pass);

        // Sincronizar datos desde Dropbox al arrancar
        const backup = await DropboxService.downloadBackup();
        if (backup) {
          for (const [k, v] of Object.entries(backup)) {
            if (v !== undefined) StorageAdapter.set('state_' + k, v);
          }
          UI.toast('Datos sincronizados desde Dropbox ✓');
        }

        await launch('dropbox');
      } catch (err) {
        _err('dbx-unlock-error', err.message);
      } finally {
        _setBusy('btn-dropbox-unlock', false, 'Desbloquear');
      }
    };

    document.getElementById('btn-dropbox-unlock')?.addEventListener('click', doUnlock);
    document.getElementById('dbx-unlock-passphrase')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doUnlock();
    });

    document.getElementById('btn-dropbox-forget')?.addEventListener('click', () => {
      DropboxService.forget();
      _showStep('auth-step-dropbox');
      _wireDropboxStep();
    });

    setTimeout(() => document.getElementById('dbx-unlock-passphrase')?.focus(), 50);
  }

  // ── Paso: configuración inicial Firebase ──────────────────────────────────────
  function _wireFirebaseSetupStep() {
    _err('fbx-setup-error', '');

    // Si la config viene de secrets (CI), ocultar el textarea — el usuario solo ve email/pass
    const configRow = document.getElementById('fbx-config-row');
    if (FirebaseService.hasInjectedConfig()) {
      configRow?.classList.add('hidden');
    } else {
      configRow?.classList.remove('hidden');
      // Prerellenar con config guardada en localStorage si existe
      const savedCfg = FirebaseService.getConfig();
      if (savedCfg && !window.FIREBASE_CONFIG) {
        const ta = document.getElementById('fbx-config-json');
        if (ta) ta.value = JSON.stringify(savedCfg, null, 2);
      }
    }

    document.getElementById('btn-firebase-back')?.addEventListener('click', () => {
      _showStep('auth-step-select');
    });

    // Toggle login / registro
    const btnLogin    = document.getElementById('fbx-mode-login');
    const btnRegister = document.getElementById('fbx-mode-register');
    const passConfirm = document.getElementById('fbx-passphrase-confirm-row');
    let mode = 'login';

    const setMode = (m) => {
      mode = m;
      btnLogin?.classList.toggle('active', m === 'login');
      btnRegister?.classList.toggle('active', m === 'register');
      passConfirm?.classList.toggle('hidden', m !== 'register');
      document.getElementById('btn-firebase-connect').textContent =
        m === 'register' ? 'Registrar y continuar' : 'Entrar';
    };
    btnLogin?.addEventListener('click',    () => setMode('login'));
    btnRegister?.addEventListener('click', () => setMode('register'));
    setMode('login');

    const doConnect = async () => {
      _err('fbx-setup-error', '');
      const configText = document.getElementById('fbx-config-json')?.value?.trim();
      const email      = document.getElementById('fbx-email')?.value?.trim();
      const password   = document.getElementById('fbx-password')?.value;
      const passphrase = document.getElementById('fbx-passphrase')?.value;
      const passConf   = document.getElementById('fbx-passphrase-confirm')?.value;

      if (!configText) { _err('fbx-setup-error', 'Pega la configuración de tu proyecto Firebase.'); return; }
      if (!email)      { _err('fbx-setup-error', 'Introduce tu email.'); return; }
      if (!password)   { _err('fbx-setup-error', 'Introduce tu contraseña.'); return; }
      if (!passphrase) { _err('fbx-setup-error', 'Introduce una clave de cifrado para tus datos.'); return; }

      // Usar config inyectada por CI, o la pegada manualmente en el textarea
      let config = FirebaseService.getConfig();
      if (!config) {
        if (!configText) { _err('fbx-setup-error', 'Pega la configuración de tu proyecto Firebase.'); return; }
        try { config = JSON.parse(configText); } catch {
          _err('fbx-setup-error', 'El JSON de configuración no es válido.'); return;
        }
      }
      if (!config?.apiKey || !config?.projectId) {
        _err('fbx-setup-error', 'Faltan campos obligatorios (apiKey, projectId).'); return;
      }

      if (mode === 'register') {
        if (passphrase !== passConf) { _err('fbx-setup-error', 'Las claves de cifrado no coinciden.'); return; }
      }

      _setBusy('btn-firebase-connect', true, mode === 'register' ? 'Registrar y continuar' : 'Entrar');
      try {
        if (mode === 'register') {
          await FirebaseService.register(config, email, password, passphrase);
        } else {
          await FirebaseService.login(config, email, password, passphrase);
        }

        const backup = await FirebaseService.downloadBackup();
        if (backup) {
          for (const [k, v] of Object.entries(backup)) {
            if (v !== undefined) StorageAdapter.set('state_' + k, v);
          }
          UI.toast('Datos cargados desde Firebase ✓');
        } else {
          UI.toast('Firebase conectado. Sin backup previo.');
        }

        await launch('firebase');
      } catch (err) {
        _err('fbx-setup-error', err.message);
      } finally {
        _setBusy('btn-firebase-connect', true, mode === 'register' ? 'Registrar y continuar' : 'Entrar');
        _setBusy('btn-firebase-connect', false, mode === 'register' ? 'Registrar y continuar' : 'Entrar');
      }
    };

    document.getElementById('btn-firebase-connect')?.addEventListener('click', doConnect);
    document.getElementById('fbx-passphrase')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doConnect();
    });

    setTimeout(() => document.getElementById('fbx-email')?.focus(), 50);
  }

  // ── Paso: desbloqueo de sesión Firebase guardada ─────────────────────────────
  function _wireFirebaseUnlockStep() {
    _err('fbx-unlock-error', '');

    // Prerellenar email
    const emailEl = document.getElementById('fbx-unlock-email');
    if (emailEl) emailEl.value = FirebaseService.savedEmail();

    const doUnlock = async () => {
      _err('fbx-unlock-error', '');
      const email      = document.getElementById('fbx-unlock-email')?.value?.trim();
      const password   = document.getElementById('fbx-unlock-password')?.value;
      const passphrase = document.getElementById('fbx-unlock-passphrase')?.value;

      if (!password)   { _err('fbx-unlock-error', 'Introduce tu contraseña de Firebase.'); return; }
      if (!passphrase) { _err('fbx-unlock-error', 'Introduce tu clave de cifrado.'); return; }

      _setBusy('btn-firebase-unlock', true, 'Entrar');
      try {
        const config = FirebaseService.getConfig();
        if (!config) throw new Error('Configuración de Firebase no encontrada. Usa "Cambiar cuenta".');

        await FirebaseService.login(config, email, password, passphrase);

        const backup = await FirebaseService.downloadBackup();
        if (backup) {
          for (const [k, v] of Object.entries(backup)) {
            if (v !== undefined) StorageAdapter.set('state_' + k, v);
          }
          UI.toast('Datos sincronizados desde Firebase ✓');
        }

        await launch('firebase');
      } catch (err) {
        _err('fbx-unlock-error', err.message);
      } finally {
        _setBusy('btn-firebase-unlock', false, 'Entrar');
      }
    };

    document.getElementById('btn-firebase-unlock')?.addEventListener('click', doUnlock);
    document.getElementById('fbx-unlock-passphrase')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doUnlock();
    });

    document.getElementById('btn-firebase-forget')?.addEventListener('click', async () => {
      await FirebaseService.forget();
      _showStep('auth-step-firebase-setup');
      _wireFirebaseSetupStep();
    });

    setTimeout(() => document.getElementById('fbx-unlock-password')?.focus(), 50);
  }

  // ── Launch: arrancar la app ────────────────────────────────────────────────────
  // mode: 'local' | 'dropbox' | 'firebase'
  async function launch(mode) {
    await State.load();

    // Guardar modo de almacenamiento en config
    const cfg = State.get('config');
    if (cfg.storageMode !== mode) {
      cfg.storageMode = mode;
      State.set('config', cfg);
    }

    document.getElementById('auth-overlay').classList.add('hidden');
    document.getElementById('main-shell').classList.remove('hidden');
    PeriodBar.init(State.get('config'));

    if (mode === 'dropbox' && DropboxService.isConnected()) {
      document.getElementById('btn-dbx-save').classList.remove('hidden');
      document.getElementById('btn-dbx-disconnect').classList.remove('hidden');
    }

    if (mode === 'firebase' && FirebaseService.isConnected()) {
      ['btn-fbx-save','btn-fbx-pull','btn-fbx-push','btn-fbx-export-json',
       'btn-fbx-import-json','btn-fbx-whitelist','btn-fbx-disconnect'].forEach(id => {
        document.getElementById(id)?.classList.remove('hidden');
      });
      const emailEl = document.getElementById('fbx-user-email');
      if (emailEl) emailEl.textContent = FirebaseService.currentUserEmail();
    }

    // Botón guardar en Dropbox
    document.getElementById('btn-dbx-save')?.addEventListener('click', async () => {
      const label = document.getElementById('dbx-save-label');
      label.textContent = '⏳ Guardando…';
      try {
        await DropboxService.uploadBackup();
        UI.toast('Backup guardado en Dropbox ✓');
      } catch (err) {
        UI.toast('Error Dropbox: ' + err.message, 'err');
      } finally {
        label.textContent = '☁ Dropbox';
      }
    });

    // Botón desconectar Dropbox
    document.getElementById('btn-dbx-disconnect')?.addEventListener('click', () => {
      if (!UI.confirm('¿Desconectar Dropbox? El backup en Dropbox no se borrará.')) return;
      DropboxService.forget();
      document.getElementById('btn-dbx-save').classList.add('hidden');
      document.getElementById('btn-dbx-disconnect').classList.add('hidden');
      UI.toast('Dropbox desconectado');
    });

    // Botón guardar en Firebase
    document.getElementById('btn-fbx-save')?.addEventListener('click', async () => {
      const label = document.getElementById('fbx-save-label');
      label.textContent = '⏳ Guardando…';
      try {
        await FirebaseService.uploadBackup();
        UI.toast('Backup guardado en Firebase ✓');
      } catch (err) {
        UI.toast('Error Firebase: ' + err.message, 'err');
      } finally {
        label.textContent = '🔥 Firebase';
      }
    });

    // Botón gestionar accesos (whitelist)
    document.getElementById('btn-fbx-whitelist')?.addEventListener('click', _openWhitelistModal);

    // Botón desconectar Firebase
    document.getElementById('btn-fbx-disconnect')?.addEventListener('click', async () => {
      if (!UI.confirm('¿Cerrar sesión de Firebase? Los datos en la nube no se borrarán.')) return;
      await FirebaseService.logout();
      ['btn-fbx-save','btn-fbx-pull','btn-fbx-push','btn-fbx-export-json',
       'btn-fbx-import-json','btn-fbx-whitelist','btn-fbx-disconnect'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
      });
      const emailEl = document.getElementById('fbx-user-email');
      if (emailEl) emailEl.textContent = '';
      UI.toast('Firebase: sesión cerrada');
    });

    DataIO.init();
    Router.init();
    DataIO.showWelcomeIfEmpty();
  }

  // ── Modal de gestión de lista blanca ─────────────────────────────────────────
  async function _openWhitelistModal() {
    const me = FirebaseService.currentUserEmail();

    const render = async () => {
      let entries = [];
      let loadErr = '';
      try {
        entries = await FirebaseService.listWhitelist();
        entries.sort((a, b) => a.email.localeCompare(b.email));
      } catch (e) {
        loadErr = e.message;
      }

      const rows = entries.map(e => `
        <tr>
          <td style="padding:8px 10px;font-size:13px;color:var(--text)">${e.email}</td>
          <td style="padding:8px 10px;font-size:11px;color:var(--text3)">${e.addedBy || '—'}</td>
          <td style="padding:8px 4px;text-align:right">
            ${e.email === me
              ? `<span style="font-size:11px;color:var(--accent)">(tú)</span>`
              : `<button onclick="AuthModule._wlRemove('${e.email}')"
                   style="background:none;border:none;cursor:pointer;color:var(--red);font-size:18px;line-height:1;padding:2px 6px"
                   title="Revocar acceso">×</button>`
            }
          </td>
        </tr>`).join('');

      const html = `
        <div style="min-width:320px">
          ${loadErr ? `<div class="auth-error" style="margin-bottom:12px">${loadErr}</div>` : ''}
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <thead>
              <tr style="border-bottom:1px solid var(--border)">
                <th style="padding:6px 10px;font-size:11px;color:var(--text3);text-align:left;font-weight:500">Email</th>
                <th style="padding:6px 10px;font-size:11px;color:var(--text3);text-align:left;font-weight:500">Añadido por</th>
                <th></th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="3" style="padding:16px 10px;text-align:center;color:var(--text3);font-size:13px">Sin entradas</td></tr>`}</tbody>
          </table>
          <div style="display:flex;gap:8px;align-items:flex-end">
            <div style="flex:1">
              <label class="form-label" style="font-size:11px">Añadir email</label>
              <input type="email" id="wl-new-email" class="auth-input"
                     placeholder="nuevo@usuario.com" style="margin-top:4px"/>
            </div>
            <button id="wl-add-btn" class="btn-firebase"
                    style="padding:10px 16px;white-space:nowrap">Añadir</button>
          </div>
          <div id="wl-error" class="auth-error hidden" style="margin-top:8px"></div>
        </div>`;

      UI.openModal(html, 'Gestionar accesos');

      document.getElementById('wl-add-btn')?.addEventListener('click', async () => {
        const emailInput = document.getElementById('wl-new-email');
        const errEl      = document.getElementById('wl-error');
        const email      = emailInput?.value?.trim();
        errEl.classList.add('hidden');

        if (!email) { errEl.textContent = 'Introduce un email.'; errEl.classList.remove('hidden'); return; }

        document.getElementById('wl-add-btn').disabled = true;
        try {
          await FirebaseService.addToWhitelist(email);
          await render();  // refrescar la lista
        } catch (e) {
          errEl.textContent = e.message;
          errEl.classList.remove('hidden');
          document.getElementById('wl-add-btn').disabled = false;
        }
      });

      document.getElementById('wl-new-email')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('wl-add-btn')?.click();
      });

      setTimeout(() => document.getElementById('wl-new-email')?.focus(), 50);
    };

    // Exponer función de eliminación globalmente (necesaria para onclick inline)
    AuthModule._wlRemove = async (email) => {
      if (!UI.confirm(`¿Revocar acceso a ${email}? No podrá iniciar sesión.`)) return;
      try {
        await FirebaseService.removeFromWhitelist(email);
        await render();
      } catch (e) {
        UI.toast(e.message, 'err');
      }
    };

    await render();
  }

  return { init, launch, _wlRemove: null };
})();
