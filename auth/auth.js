// Depends on: CryptoService, StorageAdapter, State, UI, DataIO, Router
//
// Google Drive backup — arquitectura:
//
//  • OAuth 2.0 con PKCE (sin client_secret, 100% client-side)
//  • Scope: https://www.googleapis.com/auth/drive.appdata
//    → Solo accede a la carpeta oculta de la app en el Drive del usuario.
//      El usuario no puede ver estos archivos desde drive.google.com.
//      Tú tampoco. Solo esta app puede leerlos.
//  • Archivo: financeapp_backup.enc en appDataFolder
//  • Cifrado: AES-GCM con contraseña local del usuario (PBKDF2 → 256-bit key)
//    Los datos suben SIEMPRE cifrados. Google no puede leerlos.
//
// Setup (una vez, por el desarrollador):
//  1. Google Cloud Console → New Project
//  2. APIs & Services → Enable "Google Drive API"
//  3. OAuth consent screen → External, agregar scope drive.appdata
//  4. Credentials → OAuth 2.0 Client ID → Web application
//     Authorized JavaScript origins: https://TU_USUARIO.github.io
//  5. Pegar el Client ID en GDRIVE_CLIENT_ID abajo
//
const GDRIVE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const GDRIVE_SCOPE     = 'https://www.googleapis.com/auth/drive.appdata';
const GDRIVE_FILE_NAME = 'financeapp_backup.enc';

const GDriveService = (() => {
  let _accessToken = null;
  let _cryptoKey   = null;
  const LS_TOKEN   = 'financeapp_gdrive_token';
  const LS_EXPIRY  = 'financeapp_gdrive_expiry';

  // ── PKCE helpers ─────────────────────────────────────────────────────────────
  function base64url(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
  async function generateCodeVerifier() {
    const arr = crypto.getRandomValues(new Uint8Array(32));
    return base64url(arr);
  }
  async function generateCodeChallenge(verifier) {
    const enc = new TextEncoder().encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', enc);
    return base64url(hash);
  }

  // ── OAuth flow ────────────────────────────────────────────────────────────────
  // Abre popup OAuth, espera el token por postMessage, devuelve access_token
  async function authenticate() {
    if (GDRIVE_CLIENT_ID === 'YOUR_CLIENT_ID.apps.googleusercontent.com') {
      throw new Error('Configura GDRIVE_CLIENT_ID en el código. Ver instrucciones en el comentario del módulo.');
    }
    const verifier   = await generateCodeVerifier();
    const challenge  = await generateCodeChallenge(verifier);
    const state      = base64url(crypto.getRandomValues(new Uint8Array(8)));
    const redirectUri = window.location.origin + window.location.pathname;

    localStorage.setItem('gdrive_pkce_verifier', verifier);
    localStorage.setItem('gdrive_pkce_state', state);

    const params = new URLSearchParams({
      client_id:             GDRIVE_CLIENT_ID,
      redirect_uri:          redirectUri,
      response_type:         'code',
      scope:                 GDRIVE_SCOPE,
      code_challenge:        challenge,
      code_challenge_method: 'S256',
      state,
      access_type:           'online',
      prompt:                'consent',
    });

    // Redirect-based OAuth (works on GitHub Pages — no popups needed)
    localStorage.setItem('gdrive_oauth_pending', '1');
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();
  }

  // Llamado al cargar la página — detecta si venimos del redirect OAuth
  async function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const state  = params.get('state');
    if (!code || !localStorage.getItem('gdrive_oauth_pending')) return false;

    const savedState    = localStorage.getItem('gdrive_pkce_state');
    const savedVerifier = localStorage.getItem('gdrive_pkce_verifier');
    localStorage.removeItem('gdrive_oauth_pending');
    localStorage.removeItem('gdrive_pkce_state');
    localStorage.removeItem('gdrive_pkce_verifier');

    if (state !== savedState) throw new Error('OAuth state mismatch. Posible ataque CSRF.');

    // Limpiar la URL (quitar code y state)
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // Intercambiar code por access_token via proxy-free endpoint
    // Google no permite exchange client-side sin client_secret para apps web tradicionales.
    // Usamos el implicit flow token endpoint de Google Identity Services (token model)
    // que devuelve el token directamente sin exchange.
    // Alternativa: usar Google Identity Services (GIS) tokenClient.
    // Para PKCE en SPA sin backend, usamos el token endpoint con grant_type=authorization_code
    // y sin client_secret (Google lo permite para apps registradas como "Web application" con PKCE).
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     GDRIVE_CLIENT_ID,
        redirect_uri:  cleanUrl,
        grant_type:    'authorization_code',
        code_verifier: savedVerifier,
      })
    });
    if (!tokenResp.ok) {
      const err = await tokenResp.json().catch(()=>({}));
      throw new Error('Token exchange failed: ' + (err.error_description || err.error || tokenResp.status));
    }
    const tokenData = await tokenResp.json();
    _accessToken = tokenData.access_token;
    const expiry = Date.now() + (tokenData.expires_in || 3600) * 1000;
    localStorage.setItem(LS_TOKEN, _accessToken);
    localStorage.setItem(LS_EXPIRY, String(expiry));
    return true;
  }

  function loadSavedToken() {
    const token  = localStorage.getItem(LS_TOKEN);
    const expiry = parseInt(localStorage.getItem(LS_EXPIRY) || '0');
    if (token && Date.now() < expiry - 60000) { _accessToken = token; return true; }
    return false;
  }

  function isConnected() { return !!_accessToken; }

  function disconnect() {
    _accessToken = null;
    _cryptoKey   = null;
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_EXPIRY);
    localStorage.removeItem('financeapp_gdrive_salt');
  }

  async function setupKey(password) {
    let saltB64 = localStorage.getItem('financeapp_gdrive_salt');
    let salt;
    if (saltB64) {
      salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
    } else {
      salt = CryptoService.generateSalt();
      saltB64 = btoa(String.fromCharCode(...salt));
      localStorage.setItem('financeapp_gdrive_salt', saltB64);
    }
    _cryptoKey = await CryptoService.deriveKey(password, salt);
  }

  // ── Drive API calls ──────────────────────────────────────────────────────────
  async function findFile() {
    const resp = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${GDRIVE_FILE_NAME}'&fields=files(id,name,modifiedTime)`,
      { headers: { Authorization: 'Bearer ' + _accessToken } }
    );
    if (!resp.ok) throw new Error('Drive list failed: ' + resp.status);
    const data = await resp.json();
    return data.files?.[0] || null;
  }

  async function uploadBackup() {
    if (!_accessToken || !_cryptoKey) throw new Error('No conectado o sin clave.');
    // Serializar todo el estado
    const state = {};
    for (const k of ['loans','expenses','accounts','history','goals','config']) {
      state[k] = State.get(k);
    }
    const encrypted = await CryptoService.encrypt(_cryptoKey, state);
    const blob      = new Blob([encrypted], { type: 'text/plain' });
    const existing  = await findFile();

    if (existing) {
      // Update
      const resp = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media`,
        { method: 'PATCH', headers: { Authorization: 'Bearer ' + _accessToken, 'Content-Type': 'text/plain' }, body: blob }
      );
      if (!resp.ok) throw new Error('Drive update failed: ' + resp.status);
    } else {
      // Create in appDataFolder
      const meta = JSON.stringify({ name: GDRIVE_FILE_NAME, parents: ['appDataFolder'] });
      const form  = new FormData();
      form.append('metadata', new Blob([meta], { type: 'application/json' }));
      form.append('file', blob);
      const resp = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        { method: 'POST', headers: { Authorization: 'Bearer ' + _accessToken }, body: form }
      );
      if (!resp.ok) throw new Error('Drive create failed: ' + resp.status);
    }
  }

  async function downloadBackup() {
    if (!_accessToken || !_cryptoKey) throw new Error('No conectado o sin clave.');
    const file = await findFile();
    if (!file) return null; // no backup exists yet
    const resp = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      { headers: { Authorization: 'Bearer ' + _accessToken } }
    );
    if (!resp.ok) throw new Error('Drive download failed: ' + resp.status);
    const encrypted = await resp.text();
    try {
      return await CryptoService.decrypt(_cryptoKey, encrypted);
    } catch {
      throw new Error('No se pudo descifrar. Contraseña incorrecta o backup corrupto.');
    }
  }

  return {
    authenticate, handleOAuthCallback, loadSavedToken, isConnected, disconnect,
    setupKey, uploadBackup, downloadBackup,
  };
})();

// ── AuthModule — orquesta el flujo de inicio ─────────────────────────────────
const AuthModule = (() => {
  function showErr(msg) {
    const el = document.getElementById('gdrive-error');
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  }

  async function init() {
    // Detectar callback OAuth (venimos de redirect de Google)
    const isCallback = await GDriveService.handleOAuthCallback().catch(err => {
      console.error('OAuth callback error:', err);
      showErr(err.message);
      return false;
    });

    if (isCallback) {
      // Venimos del redirect — mostrar campo de contraseña
      document.getElementById('auth-overlay').classList.remove('hidden');
      document.getElementById('main-shell').classList.add('hidden');
      document.getElementById('btn-gdrive').classList.add('hidden');
      document.getElementById('gdrive-pass-section').classList.remove('hidden');
      document.getElementById('gdrive-password').placeholder = 'Contraseña para descifrar tu backup';
      document.getElementById('btn-gdrive-confirm').textContent = 'Cargar backup de Drive';
      document.getElementById('btn-gdrive-confirm').onclick = async () => {
        const pw = document.getElementById('gdrive-password').value;
        if (!pw) { showErr('Introduce tu contraseña'); return; }
        try {
          await GDriveService.setupKey(pw);
          const backup = await GDriveService.downloadBackup();
          if (backup) {
            for (const [k, v] of Object.entries(backup)) {
              if (v !== undefined) StorageAdapter.set('state_' + k, v);
            }
            UI.toast('Backup cargado desde Drive ✓');
          } else {
            UI.toast('Drive conectado. No hay backup previo.');
          }
          await launch(true);
        } catch (err) { showErr(err.message); }
      };
      return;
    }

    // Intentar recuperar token guardado (sesión previa)
    if (GDriveService.loadSavedToken()) {
      document.getElementById('auth-overlay').classList.remove('hidden');
      document.getElementById('main-shell').classList.add('hidden');
      document.getElementById('btn-gdrive').classList.add('hidden');
      document.getElementById('gdrive-pass-section').classList.remove('hidden');
      document.getElementById('gdrive-password').placeholder = 'Contraseña de tu backup Drive';
      document.getElementById('btn-gdrive-confirm').textContent = 'Desbloquear';
      document.getElementById('btn-gdrive-confirm').onclick = async () => {
        const pw = document.getElementById('gdrive-password').value;
        if (!pw) { showErr('Introduce tu contraseña'); return; }
        try {
          await GDriveService.setupKey(pw);
          const backup = await GDriveService.downloadBackup();
          if (backup) {
            for (const [k, v] of Object.entries(backup)) {
              if (v !== undefined) StorageAdapter.set('state_' + k, v);
            }
          }
          await launch(true);
        } catch (err) { showErr(err.message); }
      };
      return;
    }

    // Primera vez — mostrar pantalla de inicio
    document.getElementById('btn-gdrive').onclick = async () => {
      try { await GDriveService.authenticate(); }
      catch (err) { showErr(err.message); }
    };

    document.getElementById('btn-local').onclick = () => launch(false);

    document.getElementById('auth-overlay').classList.remove('hidden');
  }

  async function launch(withDrive) {
    await State.load();
    document.getElementById('auth-overlay').classList.add('hidden');
    document.getElementById('main-shell').classList.remove('hidden');

    // Mostrar botón Drive en sidebar si conectado
    if (withDrive && GDriveService.isConnected()) {
      document.getElementById('btn-gdrive-save').classList.remove('hidden');
      document.getElementById('btn-gdrive-disconnect').classList.remove('hidden');
    }

    // Botón guardar en Drive
    document.getElementById('btn-gdrive-save').onclick = async () => {
      const label = document.getElementById('gdrive-save-label');
      label.textContent = '⏳ Guardando…';
      try {
        await GDriveService.uploadBackup();
        UI.toast('Backup guardado en Drive ✓');
        label.textContent = '☁ Drive';
      } catch (err) {
        UI.toast('Error: ' + err.message, 'err');
        label.textContent = '☁ Drive';
      }
    };

    // Botón desconectar Drive
    document.getElementById('btn-gdrive-disconnect').onclick = () => {
      if (!UI.confirm('¿Desconectar Google Drive? El backup en Drive no se borrará.')) return;
      GDriveService.disconnect();
      document.getElementById('btn-gdrive-save').classList.add('hidden');
      document.getElementById('btn-gdrive-disconnect').classList.add('hidden');
      UI.toast('Google Drive desconectado');
    };

    DataIO.init();
    Router.init();
    DataIO.showWelcomeIfEmpty();
  }

  return { init };
})();
