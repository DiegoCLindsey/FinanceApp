// ==================== AUTH ====================
// Depends on: CryptoService (common/crypto.js), StorageAdapter (common/storage.js),
//             State (common/state.js), UI (ui/ui.js),
//             DataIO (data-io/data-io.js), Router (router/router.js)

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
  const FILE_PATH   = '/financeapp_backup.enc';
  const LS_TOKEN    = 'financeapp_dbx_token_enc';  // token cifrado con la passphrase
  const LS_SALT     = 'financeapp_dbx_salt';

  let _token      = null;   // access token en claro (solo en memoria)
  let _cryptoKey  = null;   // clave AES-GCM derivada de la passphrase

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

    _token     = token.trim();
    _cryptoKey = key;
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
    _token     = plain.t;
    _cryptoKey = key;
    return true;
  }

  // ── Estado ────────────────────────────────────────────────────────────────────
  function hasSavedSession() { return !!localStorage.getItem(LS_TOKEN); }
  function isConnected()     { return !!_token && !!_cryptoKey; }

  function forget() {
    _token     = null;
    _cryptoKey = null;
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_SALT);
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
  async function uploadBackup() {
    if (!isConnected()) throw new Error('No conectado a Dropbox.');

    // Serializar estado
    const snapshot = {};
    for (const k of ['loans', 'expenses', 'accounts', 'history', 'goals', 'config']) {
      snapshot[k] = State.get(k);
    }

    // Cifrar
    const cipher = await CryptoService.encrypt(_cryptoKey, snapshot);
    const blob   = new Blob([cipher], { type: 'text/plain' });

    // Subir con overwrite
    const resp = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method:  'POST',
      headers: {
        Authorization:    'Bearer ' + _token,
        'Content-Type':   'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path:       FILE_PATH,
          mode:       'overwrite',
          autorename: false,
          mute:       true,
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
  async function downloadBackup() {
    if (!isConnected()) throw new Error('No conectado a Dropbox.');

    const resp = await fetch('https://content.dropboxapi.com/2/files/download', {
      method:  'POST',
      headers: {
        Authorization:    'Bearer ' + _token,
        'Dropbox-API-Arg': JSON.stringify({ path: FILE_PATH }),
      },
    });

    // 409 = fichero no existe todavía (primer uso)
    if (resp.status === 409) return null;
    if (resp.status === 401) throw new Error('Token de Dropbox inválido o expirado.');
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error('Error al descargar de Dropbox: ' + (err?.error_summary || resp.status));
    }

    const cipher = await resp.text();
    try {
      return await CryptoService.decrypt(_cryptoKey, cipher);
    } catch {
      throw new Error('No se pudo descifrar el backup. Clave de cifrado incorrecta.');
    }
  }

  return {
    setup, unlock, hasSavedSession, isConnected, forget,
    uploadBackup, downloadBackup,
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

  // ── Helpers de UI ─────────────────────────────────────────────────────────────
  function _showStep(id) {
    ['auth-step-select', 'auth-step-dropbox', 'auth-step-unlock'].forEach(s => {
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

    // ── Modal de instrucciones ─────────────────────────────────────────────────
    document.getElementById('btn-dbx-help')?.addEventListener('click', () => {
      document.getElementById('dbx-help-overlay')?.classList.remove('hidden');
    });
    document.getElementById('btn-dbx-help-close')?.addEventListener('click', () => {
      document.getElementById('dbx-help-overlay')?.classList.add('hidden');
    });

    // ── ¿Hay sesión guardada? → ir directamente al desbloqueo ─────────────────
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

    document.getElementById('btn-local')?.addEventListener('click', () => {
      launch(false);
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

        await launch(true);
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

        await launch(true);
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
      if (!confirm('¿Olvidar la cuenta de Dropbox? Los datos locales no se borrarán, pero tendrás que volver a conectar con tu token.')) return;
      DropboxService.forget();
      _showStep('auth-step-select');
      // Reconectar listeners del selector
      document.getElementById('btn-dropbox')?.addEventListener('click', () => {
        _showStep('auth-step-dropbox');
        _wireDropboxStep();
      });
      document.getElementById('btn-local')?.addEventListener('click', () => launch(false));
    });

    setTimeout(() => document.getElementById('dbx-unlock-passphrase')?.focus(), 50);
  }

  // ── Launch: arrancar la app ────────────────────────────────────────────────────
  async function launch(withDropbox) {
    await State.load();
    document.getElementById('auth-overlay').classList.add('hidden');
    document.getElementById('main-shell').classList.remove('hidden');

    if (withDropbox && DropboxService.isConnected()) {
      document.getElementById('btn-dbx-save').classList.remove('hidden');
      document.getElementById('btn-dbx-disconnect').classList.remove('hidden');
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

    DataIO.init();
    Router.init();
    DataIO.showWelcomeIfEmpty();
  }

  return { init };
})();
