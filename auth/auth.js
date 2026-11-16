// ==================== AUTH ====================
// Depends on: CryptoService (common/crypto.js), StorageAdapter (common/storage.js),
//             State (common/state.js), UI (ui/ui.js),
//             DataIO (data-io/data-io.js), Router (router/router.js),
//             FirebaseService (firebase/firebase-service.js)

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
  /**
   * Ruta del backup en Dropbox. El proyecto `default` usa la de siempre, sin
   * sufijo — así una cuenta Dropbox ya conectada antes de que existieran los
   * proyectos sigue encontrando su copia exactamente donde la dejó. El resto
   * de proyectos tienen su propio fichero, independiente: la CONEXIÓN a
   * Dropbox (el token) es del dispositivo y se comparte entre proyectos, pero
   * cada proyecto sube y baja su propia copia.
   */
  function FILE_PATH() {
    const id = window.FinanceApp?.proyectos?.activo?.()?._id;
    return !id || id === 'default' ? '/financeapp_backup.enc' : `/financeapp_backup_${id}.enc`;
  }
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

  // ── Reanudar sesión sin interacción ──────────────────────────────────────────
  // `unlock` solo descifra el token guardado; no dice nada de si Dropbox lo
  // sigue aceptando (los tokens de acceso caducan a las 4 h). Aquí se comprueba
  // contra la API, que es el criterio que pide el usuario: token válido → seguir,
  // token inválido → fuera.
  async function restore(passphrase) {
    if (!hasSavedSession()) return false;
    try {
      await unlock(passphrase);
      await _verifyToken(_token);
      return true;
    } catch (err) {
      // `fetch` sin red lanza TypeError: eso no dice nada del token.
      if (err instanceof TypeError || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
        const e = new Error('Sin conexión.'); e.code = 'sin-red';
        _token = null; _cryptoKey = null; _passphrase = null;
        throw e;
      }
      _token = null;
      _cryptoKey = null;
      _passphrase = null;
      return false;
    }
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

  /** Fecha (ms) del backup visto en la última descarga; null si no se sabe. */
  let _ultimaFechaBackup = null;
  function ultimaFechaBackup() { return _ultimaFechaBackup; }

  // Revisión de la copia remota (el `rev` que Dropbox asigna a cada versión
  // del fichero). Ver la nota equivalente en firebase-service.js.
  let _ultimaRev = null;
  function ultimaRevBackup() { return _ultimaRev; }
  async function revRemota() {
    if (!isConnected()) throw new Error('No conectado a Dropbox.');
    const resp = await _apiPost('https://api.dropboxapi.com/2/files/get_metadata', { path: FILE_PATH() });
    if (resp.status === 409) return null;   // no existe todavía
    if (resp.status === 401) throw new Error('Token de Dropbox inválido o expirado.');
    if (!resp.ok) throw new Error('No se pudo consultar la copia en Dropbox (HTTP ' + resp.status + ').');
    const meta = await resp.json().catch(() => ({}));
    return meta.rev || null;
  }

  // ── Subir backup cifrado ──────────────────────────────────────────────────────
  // Usa encryptPortable: genera sal+IV frescos y los embebe en el payload.
  // Formato en Dropbox: "salt_b64:iv_b64:ct_b64"
  // Cualquier dispositivo con la passphrase correcta puede descifrarlo.
  async function uploadBackup({ forzar = false } = {}) {
    if (!isConnected()) throw new Error('No conectado a Dropbox.');

    if (!forzar) {
      const remota = await revRemota();
      if (remota && remota !== StorageAdapter.baseNube()) {
        const e = new Error('La copia de la nube ha cambiado desde otro dispositivo.');
        e.code = 'conflicto-nube';
        throw e;
      }
    }
    const selloAlEmpezar = StorageAdapter.modificadoEn();

    // Ver la nota en firebase-service.js: del almacenamiento y con la lista del
    // esquema, que es la única que no se queda atrás.
    const snapshot = window.FinanceApp?.datos?.snapshot?.()
      ?? (() => {
        console.warn('[Dropbox] El paquete nuevo no está: la copia irá incompleta.');
        const out = {};
        for (const k of ['loans', 'expenses', 'accounts', 'goals', 'nominas', 'inflacion', 'tramosGananciasCapitalHistorico', 'tramosIRPFHistorico', 'escenarios', 'config']) {
          out[k] = State.get(k);
        }
        return out;
      })();

    // Cifrado portátil: sal embebida, no depende del localStorage local
    const cipher = await CryptoService.encryptPortable(_passphrase, snapshot);
    const blob   = new Blob([cipher], { type: 'text/plain' });

    const resp = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method:  'POST',
      headers: {
        Authorization:     'Bearer ' + _token,
        'Content-Type':    'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: FILE_PATH(), mode: 'overwrite', autorename: false, mute: true,
        }),
      },
      body: blob,
    });

    if (resp.status === 401) throw new Error('Token de Dropbox inválido o expirado.');
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error('Error al subir a Dropbox: ' + (err?.error_summary || resp.status));
    }
    const meta = await resp.json().catch(() => ({}));
    _ultimaRev = meta.rev || null;
    StorageAdapter.marcarSincronizado(_ultimaRev, selloAlEmpezar);
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
        'Dropbox-API-Arg': JSON.stringify({ path: FILE_PATH() }),
      },
    });

    if (resp.status === 409) return null;   // fichero no existe todavía
    if (resp.status === 401) throw new Error('Token de Dropbox inválido o expirado.');
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error('Error al descargar de Dropbox: ' + (err?.error_summary || resp.status));
    }

    // Dropbox devuelve los metadatos del fichero en esta cabecera; de ahí sale
    // la fecha con la que comparar contra la copia local.
    try {
      const meta = JSON.parse(resp.headers.get('Dropbox-API-Result') || '{}');
      _ultimaFechaBackup = meta.server_modified ? Date.parse(meta.server_modified) : null;
      _ultimaRev = meta.rev || null;
    } catch { _ultimaFechaBackup = null; _ultimaRev = null; }

    const cipher = await resp.text();
    try {
      return await CryptoService.decryptPortable(_passphrase, cipher);
    } catch {
      throw new Error('No se pudo descifrar el backup. Clave de cifrado incorrecta.');
    }
  }

  /** ¿Es esta la clave activa ahora mismo? No expone `_passphrase`, solo dice si coincide. */
  function esClaveActual(passphrase) {
    return !!_passphrase && passphrase === _passphrase;
  }

  return {
    setup, unlock, restore, hasSavedSession, isConnected, forget,
    uploadBackup, downloadBackup, ultimaFechaBackup, ultimaRevBackup, revRemota, tokenAgeHours, couldBeExpired, esClaveActual,
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
  // Cada paso del acceso se cablea UNA vez. Antes se añadían los listeners en
  // cada entrada al paso, así que «Dropbox → Volver → Dropbox → Conectar»
  // conectaba dos veces, y en Firebase se abrían dos ventanas de Google
  // (docs/14, BUG-10).
  const _cableados = new Set();
  function _unaVez(clave) {
    if (_cableados.has(clave)) return false;
    _cableados.add(clave);
    return true;
  }
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

  /**
   * ¿El almacenamiento local es, en la práctica, el estado de fábrica?
   *
   * La decisión de verdad vive en `state/colecciones.esEstadoVacioOPorDefecto`
   * (TypeScript, con sus propios tests): mira el CONTENIDO de cada colección,
   * no si `state__modificadoEn` está puesto — un sello reciente no significa
   * que haya datos reales debajo, porque el propio arranque de la aplicación
   * persiste el estado por defecto al migrar (ver la nota larga en
   * `common/state.js` sobre el bug de versiones de esquema compartidas).
   *
   * Si el paquete nuevo no cargó, se cae a una comprobación mínima con lo que
   * `State` conoce — peor, pero mejor que preguntar siempre.
   */
  function _localEsVacioOPorDefecto() {
    if (window.FinanceApp?.datos?.esVacioOPorDefecto) return window.FinanceApp.datos.esVacioOPorDefecto();
    const loans    = (State.get('loans')    || []).length;
    const expenses = (State.get('expenses') || []).length;
    const accounts = (State.get('accounts') || []).filter(a => a._id !== 'default' || (a.saldoInicial || 0) !== 0).length;
    return loans + expenses + accounts === 0;
  }

  /** Resumen legible de qué hay guardado localmente, para el diálogo de confirmación. */
  function _resumenLocalParaMigracion() {
    const loans    = (State.get('loans')    || []).length;
    const expenses = (State.get('expenses') || []).length;
    const accounts = (State.get('accounts') || []).filter(a => a._id !== 'default' || a.saldoInicial > 0).length;
    return [
      expenses > 0 ? `${expenses} gasto${expenses !== 1 ? 's/ingresos' : '/ingreso'}` : '',
      loans    > 0 ? `${loans} préstamo${loans !== 1 ? 's' : ''}` : '',
      accounts > 0 ? `${accounts} cuenta${accounts !== 1 ? 's' : ''}` : '',
    ].filter(Boolean).join(', ');
  }

  // ── Migration helper: si la nube está vacía y hay datos locales, ofrece subirlos
  async function _offerMigration(service, modeName) {
    // Misma ruta que el arranque: si hay copia en la nube Y datos locales que
    // no coinciden, se pregunta en vez de pisar. Antes se volcaba a ciegas.
    const backup = await service.downloadBackup();
    if (backup) {
      await _sincronizarDesdeNube(service, modeName);
      return;
    }
    // Sin backup en la nube: solo se ofrece subir si de verdad hay algo que
    // subir, no el estado de fábrica.
    if (!_localEsVacioOPorDefecto()) {
      const parts = _resumenLocalParaMigracion();
      if (window.confirm(`Tienes ${parts} guardados localmente.\n¿Subir estos datos a ${modeName} ahora?`)) {
        await service.uploadBackup();
        UI.toast('Datos locales subidos a la nube ✓');
        return;
      }
    }
    UI.toast(`${modeName} conectado. Sin backup previo.`);
  }

  // ── Sesión persistente ────────────────────────────────────────────────────────
  // La sirve el paquete nuevo (src/auth/session.ts). Si el bundle no cargó, se
  // devuelve un stub inerte: la app vuelve a pedir el acceso en cada recarga,
  // como antes, pero sigue funcionando.
  const _STUB_SESION = { leer: () => null, abrir: () => null, cerrar: () => {}, tocar: () => {}, vigilar: () => () => {} };
  function _sesion() { return window.FinanceApp?.session ?? _STUB_SESION; }
  let _detenerVigilancia = null;

  /**
   * Intenta reanudar la sesión guardada sin preguntar nada.
   * @returns true si se ha arrancado la app; false si hay que pedir acceso.
   */
  async function _reanudar() {
    const reg = _sesion().leer();   // devuelve null si ha caducado por inactividad
    if (!reg) return false;

    try {
      if (reg.modo === 'local') {
        await launch('local', { reanudando: true });
        return true;
      }

      if (reg.modo === 'firebase') {
        if (!reg.passphrase) return false;
        const user = await FirebaseService.restoreSession(FirebaseService.getConfig());
        if (!user) return false;              // token caducado/revocado → fuera
        FirebaseService.setPassphrase(reg.passphrase);
        await _sincronizarDesdeNube(FirebaseService, 'Firebase');
        await launch('firebase', { reanudando: true });
        return true;
      }

      if (reg.modo === 'dropbox') {
        if (!reg.passphrase) return false;
        if (!(await DropboxService.restore(reg.passphrase))) return false;
        await _sincronizarDesdeNube(DropboxService, 'Dropbox');
        await launch('dropbox', { reanudando: true });
        return true;
      }
    } catch (err) {
      // Sin red, los datos siguen estando en este dispositivo: se entra con
      // ellos y se sincroniza al volver la conexión. Lo que NO vale es dejar
      // al usuario en una pantalla de acceso que exige red para pasar.
      if (_esErrorDeRed(err)) {
        console.warn('[auth] Sin conexión: se arranca con los datos de este dispositivo.');
        await launch(reg.modo, { reanudando: true });
        _avisarSinConexion();
        return true;
      }
      console.error('[auth] No se pudo reanudar la sesión:', err);
      return false;
    }
    return false;
  }

  function _esErrorDeRed(err) {
    return err?.code === 'sin-red' || err?.code === 'unavailable' || err?.code === 'auth/network-request-failed'
      || (typeof navigator !== 'undefined' && navigator.onLine === false)
      || (err instanceof TypeError && /fetch|network/i.test(err.message || ''));
  }

  /** Aviso fijo de «sin conexión», con la vuelta a sincronizar cuando haya red. */
  function _avisarSinConexion() {
    const host = document.getElementById('toast-container');
    if (!host || document.getElementById('aviso-sin-conexion')) return;
    const el = document.createElement('div');
    el.id = 'aviso-sin-conexion';
    el.className = 'toast toast-warn';
    el.setAttribute('role', 'status');
    el.style.cssText = 'display:flex;align-items:center;gap:12px';
    const texto = document.createElement('span');
    texto.style.flex = '1';
    texto.textContent = 'Sin conexión: estás viendo los datos de este dispositivo. Los cambios se subirán al volver la red.';
    el.appendChild(texto);
    host.appendChild(el);
    const alVolver = () => {
      texto.textContent = 'Conexión recuperada.';
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn-primary btn-sm';
      b.textContent = 'Sincronizar';
      // Recargar es la forma de volver a pasar por la sincronización completa
      // (subir, bajar o preguntar). Lo decide el usuario: puede estar a medias.
      b.addEventListener('click', () => window.location.reload());
      el.appendChild(b);
    };
    if (navigator.onLine) alVolver();
    else window.addEventListener('online', alVolver, { once: true });
  }

  /** Escapado para el HTML del diálogo de conflicto. */
  function _esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  /** Resumen de una copia, para que el usuario pueda distinguirlas. */
  function _resumirCopia(datos) {
    const n = k => Array.isArray(datos?.[k]) ? datos[k].length : 0;
    return [
      `${n('expenses')} gastos/ingresos`,
      `${n('loans')} préstamos`,
      `${n('accounts')} cuentas`,
      `${n('nominas')} nóminas`,
    ].join(' · ');
  }

  const _fmtFecha = ms => ms
    ? new Date(ms).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
    : 'fecha desconocida';

  /**
   * Vuelca una copia de la nube al almacenamiento local.
   *
   * Y RECARGA el store del paquete nuevo. Esto último no es un detalle: el store
   * se carga cuando arranca la página, y esta restauración pasa después, al
   * entrar. Sin releer, su copia en memoria seguía siendo la de antes de
   * restaurar, y la primera vez que el usuario tocaba cualquier cosa desde una
   * vista nueva se reescribía el almacenamiento con los datos VIEJOS. Era una de
   * las dos causas de «recargo y aparecen datos antiguos».
   */
  const LS_RESPALDO = 'financeapp_respaldo_previo';
  /**
   * Guarda lo que hay AHORA en este dispositivo antes de pisarlo con otra
   * copia. Una sola posición: es la red para «he restaurado lo que no era».
   */
  function _guardarPuntoDeRestauracion(motivo) {
    try {
      const datos = window.FinanceApp?.datos?.snapshot?.();
      if (!datos) return;
      const proyecto = window.FinanceApp?.proyectos?.activo?.()?._id || 'default';
      localStorage.setItem(LS_RESPALDO, JSON.stringify({ cuando: Date.now(), motivo, proyecto, datos }));
    } catch (e) {
      // Sin sitio para el respaldo no se bloquea la restauración: se avisa.
      console.warn('[auth] No se ha podido guardar el punto de restauración:', e.message);
    }
  }
  /** El punto de restauración del proyecto activo, o null. */
  function puntoDeRestauracion() {
    try {
      const r = JSON.parse(localStorage.getItem(LS_RESPALDO) || 'null');
      const proyecto = window.FinanceApp?.proyectos?.activo?.()?._id || 'default';
      return r && r.datos && r.proyecto === proyecto ? r : null;
    } catch { return null; }
  }
  /** Devuelve el dispositivo a como estaba antes de la última restauración. */
  function restaurarPuntoDeRestauracion() {
    const r = puntoDeRestauracion();
    if (!r) return false;
    const aplicar = window.FinanceApp?.datos?.aplicar;
    if (!aplicar) return false;
    aplicar(r.datos);            // sella: vuelve a ser un cambio local pendiente de subir
    localStorage.removeItem(LS_RESPALDO);
    return true;
  }

  function _volcar(backup, fechaNube, revNube) {
    _guardarPuntoDeRestauracion('restaurar-nube');
    const aplicar = window.FinanceApp?.datos?.aplicar;
    if (aplicar) {
      // sellar:false → lo que baja de la nube no es una modificación tuya.
      aplicar(backup, { sellar: false });
    } else {
      for (const [k, v] of Object.entries(backup)) {
        if (v !== undefined) StorageAdapter.setRestaurando('state_' + k, v);
      }
    }
    StorageAdapter.sellar(fechaNube || Date.now());
    // Local y nube coinciden ahora en esta revisión.
    StorageAdapter.marcarSincronizado(revNube || null);
  }

  /**
   * Fusiona el registro de proyectos (ids y nombres, no sus datos) con el de
   * la nube, en las dos direcciones: primero trae los que faltan aquí — así
   * un proyecto creado en OTRO dispositivo aparece sin más que volver a
   * entrar — y sube el resultado, para que un proyecto creado en ESTE
   * dispositivo llegue también a los demás sin esperar al próximo
   * autoguardado. Silencioso: es una sincronización de fondo, no una acción
   * que el usuario haya pedido, y `service` puede no implementarlo (Dropbox,
   * de momento) — en ese caso no hace nada.
   */
  async function _sincronizarRegistroProyectos(service) {
    const proyectos = window.FinanceApp?.proyectos;
    if (!service.downloadRegistroProyectos || !proyectos?.fusionarRemotos) return;
    try {
      const remotos = await service.downloadRegistroProyectos();
      if (remotos) proyectos.fusionarRemotos(remotos);
      await service.uploadRegistroProyectos?.();
    } catch (e) {
      console.warn('[auth] No se ha podido sincronizar la lista de proyectos:', e.message);
    }
  }

  /**
   * Sincroniza desde la nube al arrancar.
   *
   * ANTES: se descargaba y se volcaba encima del local SIN comparar nada. Como
   * el autoguardado viene apagado de fábrica, cualquier cambio que no hubieras
   * subido a mano desaparecía en la siguiente recarga — borrabas un gasto y
   * volvía. Pérdida de datos en silencio.
   *
   * AHORA: si las dos copias no coinciden se pregunta, con las dos fechas y el
   * contenido de cada una delante. Solo se aplica sin preguntar cuando no hay
   * nada que perder: primera restauración, o local sin tocar desde la última vez.
   */
  async function _sincronizarDesdeNube(service, nombre) {
    // PRIMERO la copia: descifrarla es lo que valida la clave. La lista de
    // proyectos se sincroniza después, porque sincronizarla escribe en la nube
    // y con la clave mal tecleada se sobrescribía con una copia ilegible
    // (docs/14, BUG-04). Si la clave es incorrecta, esto lanza y no se escribe
    // nada.
    const backup = await service.downloadBackup();
    await _sincronizarRegistroProyectos(service);
    if (!backup) {
      // La nube está vacía y aquí hay datos: se sube la primera copia. Antes se
      // quedaba sin subir hasta que el usuario cambiara algo o le diera a mano.
      if (!_localEsVacioOPorDefecto()) {
        try { await service.uploadBackup(); }
        catch (e) { console.warn('[auth] No se ha podido subir la primera copia:', e.message); }
      }
      return;
    }

    const fechaNube  = service.ultimaFechaBackup?.() ?? null;
    const revNube    = service.ultimaRevBackup?.() ?? null;
    const base       = StorageAdapter.baseNube();
    const fechaLocal = StorageAdapter.modificadoEn();
    const bajar = (avisar) => {
      _volcar(backup, fechaNube, revNube);
      if (avisar) UI.toast(`Datos restaurados desde ${nombre} ✓`);
    };

    // Sin sello local no hay nada que proteger: es la primera restauración.
    if (!fechaLocal) { bajar(true); return; }

    if (base && revNube) {
      // Camino normal: se decide con revisiones, no con relojes.
      //
      //   nube respecto a la base | local modificado | acción
      //   igual                   | no               | nada
      //   igual                   | sí               | subir sin preguntar
      //   distinta                | no               | bajar sin preguntar
      //   distinta                | sí               | preguntar
      const modificado = StorageAdapter.modificadoDesdeSync();
      if (base === revNube) {
        if (modificado) {
          try { await service.uploadBackup(); }
          catch (e) { console.warn('[auth] No se han podido subir los cambios pendientes:', e.message); }
        }
        return;
      }
      if (!modificado) { bajar(false); return; }
    } else if (fechaNube && fechaLocal <= fechaNube) {
      // Dispositivo que aún no tiene base (primera vez tras esta versión): se
      // mantiene el criterio anterior por fechas, una sola vez.
      bajar(false);
      return;
    }

    // El sello puede ser reciente sin que haya datos reales debajo — un
    // dispositivo recién estrenado persiste su estado de fábrica al arrancar.
    if (_localEsVacioOPorDefecto()) { bajar(true); return; }

    const eleccion = await _preguntarConflicto({
      nombre,
      fechaNube,
      fechaLocal,
      resumenNube:  _resumirCopia(backup),
      resumenLocal: _resumirCopia({
        expenses: State.get('expenses'), loans: State.get('loans'),
        accounts: State.get('accounts'), nominas: State.get('nominas'),
      }),
    });

    if (eleccion === 'nube') {
      bajar(true);
    } else {
      // Se conserva lo local y se sube, para que la nube deje de ir por detrás.
      try {
        await service.uploadBackup({ forzar: true });
        UI.toast('Se conservan tus datos de este dispositivo y se han subido ✓');
      } catch (e) {
        console.error('[auth] No se ha podido subir la copia local:', e);
        UI.toast('Se conservan tus datos de este dispositivo (no se han podido subir)', 'warn');
      }
    }
  }

  /** El servicio de nube conectado ahora mismo, con su nombre. */
  function _servicioActivo() {
    if (FirebaseService.isConnected()) return { service: FirebaseService, nombre: 'Firebase' };
    if (DropboxService.isConnected())  return { service: DropboxService,  nombre: 'Dropbox' };
    return null;
  }

  /**
   * Guarda en la nube, resolviendo el conflicto si otro dispositivo ha subido
   * entre medias. Es el único camino por el que deben pasar «Guardar ahora» y
   * el autoguardado. Devuelve 'subido' o 'restaurado'.
   */
  let _resolviendoConflicto = null;
  async function guardarEnNube() {
    const activo = _servicioActivo();
    if (!activo) throw new Error('No hay ningún destino de copia conectado.');
    const { service, nombre } = activo;
    try {
      await service.uploadBackup();
      return 'subido';
    } catch (e) {
      if (e?.code !== 'conflicto-nube') throw e;
    }
    // Un solo diálogo aunque el temporizador y el botón coincidan.
    if (_resolviendoConflicto) return _resolviendoConflicto;
    _resolviendoConflicto = (async () => {
      const backup = await service.downloadBackup();
      if (!backup) { await service.uploadBackup({ forzar: true }); return 'subido'; }
      const eleccion = await _preguntarConflicto({
        nombre,
        fechaNube:  service.ultimaFechaBackup?.() ?? null,
        fechaLocal: StorageAdapter.modificadoEn(),
        resumenNube:  _resumirCopia(backup),
        resumenLocal: _resumirCopia({
          expenses: State.get('expenses'), loans: State.get('loans'),
          accounts: State.get('accounts'), nominas: State.get('nominas'),
        }),
      });
      if (eleccion === 'nube') {
        _volcar(backup, service.ultimaFechaBackup?.() ?? null, service.ultimaRevBackup?.() ?? null);
        UI.toast(`Datos restaurados desde ${nombre} ✓`);
        // Todo lo que hay en pantalla viene de los datos anteriores.
        setTimeout(() => window.location.reload(), 600);
        return 'restaurado';
      }
      await service.uploadBackup({ forzar: true });
      return 'subido';
    })().finally(() => { _resolviendoConflicto = null; });
    return _resolviendoConflicto;
  }

  /** Diálogo de conflicto. Resuelve con 'nube' o 'local'. */
  function _preguntarConflicto({ nombre, fechaNube, fechaLocal, resumenNube, resumenLocal }) {
    return new Promise(resolve => {
      const ov = document.createElement('div');
      ov.className = 'auth-overlay';
      ov.style.zIndex = '1200';
      ov.innerHTML = `
        <div class="auth-card" style="max-width:520px">
          <div class="auth-section-title" style="margin-bottom:6px">Hay dos versiones de tus datos</div>
          <p style="font-size:12px;color:var(--text2);line-height:1.6;margin:0 0 16px">
            La copia de ${_esc(nombre)} y la de este dispositivo no coinciden. Elige cuál conservar;
            la otra se sustituye. Si eliges la de ${_esc(nombre)}, la de este
            dispositivo se guarda como punto de restauración en «Administrar datos».
          </p>
          <button class="btn-secondary full-width" data-elige="local" style="text-align:left;padding:12px 14px;margin-bottom:10px">
            <div style="font-weight:700;font-size:13px;margin-bottom:3px">Este dispositivo</div>
            <div style="font-size:11px;color:var(--text3)">${_esc(_fmtFecha(fechaLocal))}</div>
            <div style="font-size:11px;color:var(--text2);margin-top:3px">${_esc(resumenLocal)}</div>
          </button>
          <button class="btn-secondary full-width" data-elige="nube" style="text-align:left;padding:12px 14px">
            <div style="font-weight:700;font-size:13px;margin-bottom:3px">Copia de ${_esc(nombre)}</div>
            <div style="font-size:11px;color:var(--text3)">${_esc(_fmtFecha(fechaNube))}</div>
            <div style="font-size:11px;color:var(--text2);margin-top:3px">${_esc(resumenNube)}</div>
          </button>
          <p style="font-size:11px;color:var(--text3);line-height:1.6;margin:14px 0 0">
            Si conservas las de este dispositivo se subirán a ${_esc(nombre)} para que dejen de ir por detrás.
          </p>
        </div>`;
      ov.addEventListener('click', e => {
        const b = e.target.closest('[data-elige]');
        if (!b) return;
        ov.remove();
        resolve(b.dataset.elige);
      });
      document.body.appendChild(ov);
    });
  }

  /** Cierra la sesión y devuelve al usuario a la pantalla de inicio. */
  async function logout({ olvidarCuenta = false } = {}) {
    _sesion().cerrar();
    if (FirebaseService.isConnected() || FirebaseService.hasSavedSession()) {
      await (olvidarCuenta ? FirebaseService.forget() : FirebaseService.logout());
    }
    if (olvidarCuenta && DropboxService.hasSavedSession()) DropboxService.forget();
    window.location.reload();
  }

  // ── Pantalla de carga ─────────────────────────────────────────────────────────
  // La pinta index.html antes que nada (ver el bloque #carga). Se retira cuando
  // ya se sabe qué enseñar: la aplicación o el selector de método de acceso.
  let _cargaRetirada = false;
  const _cargaDesde = Date.now();
  /**
   * Tiempo mínimo en pantalla.
   *
   * Sin sesión que reanudar la decisión es inmediata, y entonces la pantalla de
   * carga aparecía y se iba en ~50 ms: un parpadeo, que es exactamente lo que
   * veníamos a quitar. No es una espera artificial —si decidir cuesta más de
   * 400 ms no se añade ni un milisegundo—, es evitar el destello.
   */
  const CARGA_MIN_MS = 400;

  function _quitarCarga() {
    if (_cargaRetirada) return;
    _cargaRetirada = true;
    clearTimeout(_cargaSalvavidas);
    const el = document.getElementById('carga');
    if (!el) return;
    const espera = Math.max(0, CARGA_MIN_MS - (Date.now() - _cargaDesde));
    setTimeout(() => {
      el.classList.add('se-va');
      // Se retira del DOM al acabar el fundido; con `hidden` bastaría, pero así
      // no queda un elemento a pantalla completa capturando clics si el CSS
      // no llegara a cargar.
      setTimeout(() => el.remove(), 320);
    }, espera);
  }

  /**
   * Salvavidas. Si `_reanudar()` se queda colgado —Firebase sin responder, red
   * caída a medias— la pantalla de carga se quedaría eternamente y el usuario
   * no tendría ni forma de entrar en modo local. A los 8 segundos se rinde y
   * enseña el selector de acceso.
   */
  const _cargaSalvavidas = setTimeout(() => {
    if (_cargaRetirada) return;
    console.warn('[auth] La reanudación tarda demasiado; se muestra el selector de acceso.');
    document.getElementById('auth-overlay')?.classList.remove('hidden');
    _showStep('auth-step-select');
    _quitarCarga();
  }, 8000);

  // ── Init ──────────────────────────────────────────────────────────────────────
  async function init() {
    // El selector se cablea ANTES de intentar reanudar. El salvavidas de los
    // 8 segundos lo enseña mientras `_reanudar()` sigue colgado, y con los
    // listeners registrados después de ese `await` aparecía con los botones
    // muertos: justo cuando más falta hacían (docs/14, BUG-13).
    _cablearSelector();

    // Reanudar antes de enseñar nada. El overlay de acceso nace oculto, así que
    // mientras esto decide solo se ve la pantalla de carga.
    if (await _reanudar()) return;
    // El usuario ya ha entrado por su cuenta desde el selector de emergencia.
    if (_lanzada) return;

    // No hay sesión que reanudar: hay que pedir método de acceso.
    document.getElementById('auth-overlay').classList.remove('hidden');
    _quitarCarga();

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
  }

  /** Listeners del selector de método y de las ventanas de ayuda. Una sola vez. */
  function _cablearSelector() {
    if (!_unaVez('selector')) return;

    document.getElementById('btn-dbx-help')?.addEventListener('click', () => {
      document.getElementById('dbx-help-overlay')?.classList.remove('hidden');
    });
    document.getElementById('btn-dbx-help-close')?.addEventListener('click', () => {
      document.getElementById('dbx-help-overlay')?.classList.add('hidden');
    });
    document.getElementById('btn-fbx-help')?.addEventListener('click', () => {
      document.getElementById('fbx-help-overlay')?.classList.remove('hidden');
    });
    document.getElementById('btn-fbx-help-close')?.addEventListener('click', () => {
      document.getElementById('fbx-help-overlay')?.classList.add('hidden');
    });

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
    setTimeout(() => document.getElementById('dbx-token')?.focus(), 50);
    if (!_unaVez('dropbox')) return;

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
        await _offerMigration(DropboxService, 'Dropbox');
        await launch('dropbox', { passphrase: pass });
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

    _ofrecerDesbloqueoConHuella('dropbox', document.getElementById('dbx-unlock-passphrase'), 'btn-dropbox-unlock');
    setTimeout(() => document.getElementById('dbx-unlock-passphrase')?.focus(), 50);
    if (!_unaVez('dropbox-unlock')) return;

    const doUnlock = async () => {
      _err('dbx-unlock-error', '');
      const pass = document.getElementById('dbx-unlock-passphrase')?.value;
      if (!pass) { _err('dbx-unlock-error', 'Introduce tu clave de cifrado.'); return; }

      _setBusy('btn-dropbox-unlock', true, 'Desbloquear');
      try {
        await DropboxService.unlock(pass);

        // Sincronización con comprobación de conflicto (ver _sincronizarDesdeNube)
        await _sincronizarDesdeNube(DropboxService, 'Dropbox');

        await launch('dropbox', { passphrase: pass });
        window.FinanceApp?.biometria?.marcarDesbloqueo?.();
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
  }

  // ── Paso: configuración inicial Firebase ──────────────────────────────────────
  function _wireFirebaseSetupStep() {
    _err('fbx-setup-error', '');

    // "Usar mi propio Firebase": oculto cuando hay config inyectada desde CI.
    // Sin config inyectada: si hay config guardada en localStorage, se usa en silencio (colapsado);
    // si no hay ninguna config, expandir automáticamente para que el usuario sepa qué hacer.
    const ownProject = document.getElementById('fbx-own-project');
    if (FirebaseService.hasInjectedConfig()) {
      ownProject?.classList.add('hidden');
    } else {
      ownProject?.classList.remove('hidden');
      const savedCfg = FirebaseService.getConfig();
      if (savedCfg) {
        const ta = document.getElementById('fbx-config-json');
        if (ta) ta.value = JSON.stringify(savedCfg, null, 2);
        // Config guardada → se usará automáticamente, no hace falta expandir
      } else {
        // Sin ninguna config: expandir para que el usuario la pegue antes de continuar
        if (ownProject) ownProject.open = true;
        _err('fbx-setup-error', 'Introduce la configuración de tu proyecto Firebase para continuar.');
      }
    }

    if (!_unaVez('firebase-setup')) return;

    document.getElementById('btn-firebase-back')?.addEventListener('click', () => {
      _showStep('auth-step-select');
    });

    // Resolve Firebase config: CI-injected takes priority, then textarea JSON
    const _resolveConfig = () => {
      let config = FirebaseService.getConfig();
      if (config) return { config, err: null };
      const configText = document.getElementById('fbx-config-json')?.value?.trim();
      if (!configText) return { config: null, err: 'Pega la configuración de tu proyecto Firebase en "Usar mi propio proyecto Firebase".' };
      try { config = JSON.parse(configText); } catch {
        return { config: null, err: 'El JSON de configuración no es válido.' };
      }
      if (!config?.apiKey || !config?.projectId) return { config: null, err: 'Faltan campos obligatorios (apiKey, projectId).' };
      return { config, err: null };
    };

    // Post-auth (called once passphrase is set)
    const _afterAuth = async (passphrase) => {
      await _offerMigration(FirebaseService, 'Firebase');
      await launch('firebase', { passphrase });
    };

    // ── Fase 2: passphrase ────────────────────────────────────────────────────
    const _showPassphrasePhase = (email) => {
      document.getElementById('fbx-phase-login')?.classList.add('hidden');
      const phase2 = document.getElementById('fbx-phase-passphrase');
      phase2?.classList.remove('hidden');
      const emailEl = document.getElementById('fbx-connected-email');
      if (emailEl) emailEl.textContent = email;
      setTimeout(() => document.getElementById('fbx-passphrase')?.focus(), 50);
    };

    const _doPassphrase = async () => {
      _err('fbx-passphrase-error', '');
      const passphrase = document.getElementById('fbx-passphrase')?.value;
      if (!passphrase || passphrase.length < 4) {
        _err('fbx-passphrase-error', 'La clave debe tener al menos 4 caracteres.');
        return;
      }
      _setBusy('btn-fbx-passphrase-ok', true, 'Continuar');
      try {
        FirebaseService.setPassphrase(passphrase);
        await _afterAuth(passphrase);
      } catch (err) {
        _err('fbx-passphrase-error', err.message);
      } finally {
        _setBusy('btn-fbx-passphrase-ok', false, 'Continuar');
      }
    };

    document.getElementById('btn-fbx-passphrase-ok')?.addEventListener('click', _doPassphrase);
    document.getElementById('fbx-passphrase')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') _doPassphrase();
    });

    // ── Fase 1: Google OAuth ──────────────────────────────────────────────────
    document.getElementById('btn-firebase-google')?.addEventListener('click', async () => {
      _err('fbx-setup-error', '');
      const { config, err: cfgErr } = _resolveConfig();
      if (cfgErr) { _err('fbx-setup-error', cfgErr); return; }

      _setBusy('btn-firebase-google', true, 'Acceder con Google');
      try {
        const user = await FirebaseService.loginWithGoogle(config);
        _showPassphrasePhase(user.email);
      } catch (err) {
        _err('fbx-setup-error', err.message);
        _setBusy('btn-firebase-google', false, 'Acceder con Google');
      }
    });
  }

  // ── Desbloqueo con huella (WebAuthn + PRF) ────────────────────────────────────
  // La lógica de cifrado vive en src/auth/biometria.ts; aquí solo se pinta el
  // botón y se engancha al flujo de acceso ya existente.
  //
  // Al pulsarlo, la huella recupera la passphrase y se mete en el MISMO campo
  // que se rellenaría a mano, disparando el MISMO botón "Continuar" /
  // "Desbloquear" — así el camino biométrico corre la lógica exacta de
  // siempre (sincronizar, lanzar la app…) sin duplicarla en dos sitios que
  // podrían acabar divergiendo.
  function _ofrecerDesbloqueoConHuella(modo, inputEl, botonContinuarId) {
    // Idempotente: si esta pantalla se recablea (p.ej. "Cambiar cuenta"), no
    // se acumulan botones.
    document.getElementById('bio-unlock-wrap')?.remove();

    const bio = window.FinanceApp?.biometria;
    const cred = bio?.leerCredencial?.();
    if (!bio || !cred || cred.modo !== modo || !inputEl) return;

    const contenedor = inputEl.closest('.form-group') || inputEl.parentElement;
    if (!contenedor?.parentElement) return;

    const envoltorio = document.createElement('div');
    envoltorio.id = 'bio-unlock-wrap';
    envoltorio.style.marginBottom = '10px';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-secondary full-width';
    btn.textContent = '👆 Desbloquear con huella';

    const errorEl = document.createElement('div');
    errorEl.className = 'auth-error hidden';
    errorEl.style.marginTop = '6px';

    btn.addEventListener('click', async () => {
      errorEl.classList.add('hidden');
      const textoOriginal = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Verificando…';
      try {
        const passphrase = await bio.desbloquear();
        inputEl.value = passphrase;
        document.getElementById(botonContinuarId)?.click();
      } catch (e) {
        // Cancelar el gesto biométrico (Esc / "Cancelar" en el diálogo del
        // sistema) no es un error que merezca alarmar: se queda el campo
        // manual, como si el botón no se hubiera pulsado.
        if (e?.name !== 'NotAllowedError') {
          errorEl.textContent = e.message || 'No se ha podido desbloquear con huella.';
          errorEl.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        btn.textContent = textoOriginal;
      }
    });

    envoltorio.appendChild(btn);
    envoltorio.appendChild(errorEl);
    contenedor.parentElement.insertBefore(envoltorio, contenedor);
  }

  // ── Paso: desbloqueo de sesión Firebase guardada ─────────────────────────────
  function _wireFirebaseUnlockStep() {
    _err('fbx-unlock-error', '');

    const savedEmail = document.getElementById('fbx-unlock-saved-email');
    if (savedEmail) savedEmail.textContent = FirebaseService.savedEmail() || '';
    if (!_unaVez('firebase-unlock')) return;

    // Fase 2: passphrase
    const _showUnlockPassphrase = (email) => {
      document.getElementById('fbx-unlock-phase-login')?.classList.add('hidden');
      const phase2 = document.getElementById('fbx-unlock-phase-passphrase');
      phase2?.classList.remove('hidden');
      const emailEl = document.getElementById('fbx-unlock-connected-email');
      if (emailEl) emailEl.textContent = email;
      _ofrecerDesbloqueoConHuella('firebase', document.getElementById('fbx-unlock-passphrase'), 'btn-firebase-unlock');
      setTimeout(() => document.getElementById('fbx-unlock-passphrase')?.focus(), 50);
    };

    const doUnlock = async () => {
      _err('fbx-unlock-passphrase-error', '');
      const passphrase = document.getElementById('fbx-unlock-passphrase')?.value;
      if (!passphrase) { _err('fbx-unlock-passphrase-error', 'Introduce tu clave de cifrado.'); return; }

      _setBusy('btn-firebase-unlock', true, 'Continuar');
      try {
        FirebaseService.setPassphrase(passphrase);
        await _sincronizarDesdeNube(FirebaseService, 'Firebase');
        await launch('firebase', { passphrase });
        // Da igual si "soy yo" se demostró con huella o tecleando: la gracia
        // cuenta desde cualquier desbloqueo correcto.
        window.FinanceApp?.biometria?.marcarDesbloqueo?.();
      } catch (err) {
        _err('fbx-unlock-passphrase-error', err.message);
      } finally {
        _setBusy('btn-firebase-unlock', false, 'Continuar');
      }
    };

    document.getElementById('btn-firebase-unlock')?.addEventListener('click', doUnlock);
    document.getElementById('fbx-unlock-passphrase')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doUnlock();
    });

    // Fase 1: Google OAuth
    document.getElementById('btn-firebase-google-unlock')?.addEventListener('click', async () => {
      _err('fbx-unlock-error', '');
      const config = FirebaseService.getConfig();
      if (!config) {
        _err('fbx-unlock-error', 'Configuración de Firebase no encontrada. Usa "Cambiar cuenta".');
        return;
      }
      _setBusy('btn-firebase-google-unlock', true, 'Continuar con Google');
      try {
        const user = await FirebaseService.loginWithGoogle(config);
        _showUnlockPassphrase(user.email);
      } catch (err) {
        _err('fbx-unlock-error', err.message);
        _setBusy('btn-firebase-google-unlock', false, 'Continuar con Google');
      }
    });

    document.getElementById('btn-firebase-forget')?.addEventListener('click', async () => {
      await FirebaseService.forget();
      _showStep('auth-step-firebase-setup');
      _wireFirebaseSetupStep();
    });
  }

  // ── Launch: arrancar la app ────────────────────────────────────────────────────
  // mode: 'local' | 'dropbox' | 'firebase'
  // `passphrase` solo llega desde los flujos interactivos: al reanudar ya está
  // guardada y no hay que reescribirla.
  let _lanzada = false;
  async function launch(mode, { passphrase, reanudando = false } = {}) {
    // La aplicación se monta UNA vez por carga de página. «Conectar la nube»
    // desde el modo local volvía a pasar por aquí sin recargar, y `Router.init`
    // y `DataIO.init` registraban sus listeners por segunda vez: el menú móvil
    // se abría y cerraba en el mismo toque, y cada JSON se importaba dos veces
    // (docs/14, BUG-09). Se deja constancia de la sesión nueva y se recarga: el
    // arranque ya sabe reanudarla.
    if (_lanzada) {
      // Una reanudación que termina tarde, cuando el usuario ya entró desde el
      // selector de emergencia, no debe llevárselo por delante.
      if (reanudando) return;
      const c = State.get('config');
      if (c.storageMode !== mode) State.set('config', { ...c, storageMode: mode });
      _sesion().abrir({ modo: mode, passphrase, email: FirebaseService.currentUserEmail() || undefined });
      window.location.reload();
      return;
    }
    _lanzada = true;
    await State.load();

    const cfg = State.get('config');
    if (cfg.storageMode !== mode) { cfg.storageMode = mode; State.set('config', cfg); }

    document.getElementById('auth-overlay').classList.add('hidden');
    document.getElementById('main-shell').classList.remove('hidden');
    _quitarCarga();
    PeriodBar.init(State.get('config'));

    if (mode === 'firebase' && FirebaseService.isConnected()) {
      const emailEl = document.getElementById('fbx-user-email');
      if (emailEl) emailEl.textContent = FirebaseService.currentUserEmail();
      if (FirebaseService.isAdmin()) {
        document.getElementById('btn-fbx-whitelist')?.classList.remove('hidden');
      }
    }

    document.getElementById('btn-fbx-whitelist')?.addEventListener('click', _openWhitelistModal);

    _registrarSesion(mode, passphrase);

    DataIO.init();
    DataIO.initAutoSave();
    Router.init();
    DataIO.showWelcomeIfEmpty();
  }

  /**
   * Deja constancia de la sesión para poder reanudarla en la próxima recarga y
   * arranca la vigilancia de inactividad (solo hace algo si el usuario ha
   * configurado un cierre automático).
   */
  function _registrarSesion(mode, passphrase) {
    const sesion = _sesion();
    const previa = sesion.leer();
    // Reanudación (mismo modo y sin passphrase nueva) → basta con marcar uso.
    // Cualquier otro caso reemplaza el registro: el usuario puede haber cambiado
    // de método de acceso o de clave.
    if (previa && previa.modo === mode && !passphrase) sesion.tocar();
    else sesion.abrir({ modo: mode, passphrase, email: FirebaseService.currentUserEmail() || undefined });

    _detenerVigilancia?.();
    _detenerVigilancia = sesion.vigilar(() => {
      UI.toast('Sesión cerrada por inactividad');
      setTimeout(() => window.location.reload(), 1200);
    });
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
          <td style="padding:8px 6px;text-align:center">
            ${e.email === me
              ? `<span style="font-size:11px;color:var(--accent)">(tú)</span>`
              : `<input type="checkbox" title="Admin" ${e.isAdmin ? 'checked' : ''}
                   onchange="AuthModule._wlSetAdmin('${e.email}', this.checked)">`
            }
          </td>
          <td style="padding:8px 4px;text-align:right">
            ${e.email !== me
              ? `<button onclick="AuthModule._wlRemove('${e.email}')"
                   style="background:none;border:none;cursor:pointer;color:var(--red);font-size:18px;line-height:1;padding:2px 6px"
                   title="Revocar acceso">×</button>`
              : ''
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
                <th style="padding:6px 10px;font-size:11px;color:var(--text3);text-align:center;font-weight:500">Admin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="4" style="padding:16px 10px;text-align:center;color:var(--text3);font-size:13px">Sin entradas</td></tr>`}</tbody>
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

    AuthModule._wlSetAdmin = async (email, isAdmin) => {
      try {
        await FirebaseService.setUserAdmin(email, isAdmin);
        UI.toast(isAdmin ? `${email} es ahora admin` : `${email} ya no es admin`);
      } catch (e) {
        UI.toast(e.message, 'err');
        await render();
      }
    };

    await render();
  }

  function connectCloud(target) {
    UI.closeModal();
    document.getElementById('auth-overlay')?.classList.remove('hidden');
    document.getElementById('main-shell')?.classList.add('hidden');
    if (target === 'firebase') {
      _showStep('auth-step-firebase-setup');
      _wireFirebaseSetupStep();
    } else {
      _showStep('auth-step-dropbox');
      _wireDropboxStep();
    }
  }

  return { init, launch, logout, connectCloud, guardarEnNube, _sincronizar: _sincronizarDesdeNube, puntoDeRestauracion, restaurarPuntoDeRestauracion, _wlRemove: null, _wlSetAdmin: null };
})();

// Publicado para el paquete nuevo: ver la nota al final de common/state.js.
globalThis.DropboxService = DropboxService;
globalThis.AuthModule = AuthModule;
