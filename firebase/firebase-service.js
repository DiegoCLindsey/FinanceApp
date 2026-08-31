// ==================== FIREBASE_SERVICE ====================
// Depends on: CryptoService (common/crypto.js), State (common/state.js)
//
// Seguridad:
//   • Firebase Auth gestiona identidad (email + contraseña)
//   • Lista blanca por email en Firestore /whitelist/{email}
//   • Los datos se cifran con AES-GCM-256 ANTES de subir a Firestore
//   • La passphrase de cifrado NUNCA se envía a Firebase
//   • Ni el admin puede leer entradas de otros usuarios en claro

const FirebaseService = (() => {
  const LS_CONFIG = 'financeapp_fbx_config';  // JSON de configuración del proyecto Firebase
  const LS_EMAIL  = 'financeapp_fbx_email';   // Último email autenticado

  /**
   * Id del documento de backup en Firestore. El proyecto `default` usa
   * `'backup'`, el de siempre — así una cuenta ya conectada antes de que
   * existieran los proyectos (financeapp) sigue encontrando su copia donde la
   * dejó. El resto tienen su propio documento: la cuenta de Firebase (quién
   * ha iniciado sesión) es del dispositivo/navegador y se comparte entre
   * proyectos, pero cada proyecto sube y baja su propia copia.
   */
  function _backupDocId() {
    const id = window.FinanceApp?.proyectos?.activo?.()?._id;
    return !id || id === 'default' ? 'backup' : `backup_${id}`;
  }

  let _app        = null;
  let _auth       = null;
  let _db         = null;
  let _user       = null;
  let _passphrase = null;   // solo en memoria, nunca persiste
  let _isAdmin    = false;

  // ── Gestión de configuración ─────────────────────────────────────────────────
  // Prioridad: 1) window.FIREBASE_CONFIG (inyectado por CI desde secrets)
  //            2) localStorage (introducido manualmente por el usuario en la UI)

  function isConfigured() {
    return !!(window.FIREBASE_CONFIG?.apiKey) || !!localStorage.getItem(LS_CONFIG);
  }

  function getConfig() {
    if (window.FIREBASE_CONFIG?.apiKey) return window.FIREBASE_CONFIG;
    try { return JSON.parse(localStorage.getItem(LS_CONFIG)); } catch { return null; }
  }

  // Solo persiste en localStorage si NO hay config inyectada (modo manual)
  function _saveConfig(cfg) {
    if (!window.FIREBASE_CONFIG?.apiKey) {
      localStorage.setItem(LS_CONFIG, JSON.stringify(cfg));
    }
  }

  // Indica si la config viene de secrets (no hace falta UI)
  function hasInjectedConfig() {
    return !!(window.FIREBASE_CONFIG?.apiKey);
  }

  function hasSavedSession() {
    return isConfigured() && !!localStorage.getItem(LS_EMAIL);
  }

  function savedEmail() {
    return localStorage.getItem(LS_EMAIL) || '';
  }

  function isConnected() {
    return !!_user;
  }

  function currentUserEmail() {
    return _user?.email || '';
  }

  // ── Inicialización de Firebase ───────────────────────────────────────────────
  const APP_NAME = 'financeapp';

  function _initApp(cfg) {
    if (_app) return;
    try {
      _app = firebase.initializeApp(cfg, APP_NAME);
    } catch (err) {
      if (err.code === 'app/duplicate-app') {
        _app = firebase.app(APP_NAME);
      } else {
        throw err;
      }
    }
    _auth = _app.auth();
    _db   = _app.firestore();
  }

  // ── Verificación de lista blanca ─────────────────────────────────────────────
  // La regla de Firestore también lo aplica en servidor; aquí es UX feedback.
  async function _checkWhitelist(email) {
    try {
      const doc = await _db.collection('whitelist').doc(email).get();
      if (!doc.exists) {
        throw new Error('Tu dirección de correo no está autorizada. Solicita acceso al administrador.');
      }
    } catch (err) {
      if (err.message.includes('autorizada')) throw err;
      // Error de permisos = no está en la lista
      if (err.code === 'permission-denied') {
        throw new Error('Tu dirección de correo no está autorizada. Solicita acceso al administrador.');
      }
      throw new Error('No se pudo verificar el acceso: ' + err.message);
    }
  }

  async function _loadAdminStatus(email) {
    try {
      const doc = await _db.collection('whitelist').doc(email.trim()).get();
      _isAdmin = doc.exists && doc.data().isAdmin === true;
    } catch {
      _isAdmin = false;
    }
  }

  // ── Inicio de sesión ─────────────────────────────────────────────────────────
  async function login(config, email, password, passphrase) {
    if (!email || !password)  throw new Error('Email y contraseña son obligatorios.');
    if (!passphrase || passphrase.length < 4) throw new Error('La clave de cifrado debe tener al menos 4 caracteres.');

    try { _initApp(config); } catch (err) {
      throw new Error('Configuración de Firebase inválida: ' + err.message);
    }

    let userCredential;
    try {
      userCredential = await _auth.signInWithEmailAndPassword(email.trim(), password);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        throw new Error('Credenciales incorrectas. Comprueba email y contraseña.');
      }
      if (err.code === 'auth/wrong-password') throw new Error('Contraseña incorrecta.');
      if (err.code === 'auth/invalid-email')  throw new Error('Formato de email inválido.');
      if (err.code === 'auth/too-many-requests') throw new Error('Demasiados intentos fallidos. Espera unos minutos.');
      throw new Error('Error de autenticación: ' + err.message);
    }

    _user = userCredential.user;

    try {
      await _checkWhitelist(email.trim());
    } catch (err) {
      await _auth.signOut().catch(() => {});
      _user = null;
      throw err;
    }

    _passphrase = passphrase;
    _saveConfig(config);
    localStorage.setItem(LS_EMAIL, email.trim());
    await _loadAdminStatus(email.trim());
    return _user;
  }

  // ── Registro de nueva cuenta ─────────────────────────────────────────────────
  // Solo funciona si el email ya está en la lista blanca (el admin lo añade antes).
  // La verificación ocurre DESPUÉS de crear la cuenta Auth, cuando ya hay token
  // para leer Firestore. Si no está en la lista, se borra la cuenta recién creada.
  async function register(config, email, password, passphrase) {
    if (!email || !password)  throw new Error('Email y contraseña son obligatorios.');
    if (password.length < 6)  throw new Error('La contraseña debe tener al menos 6 caracteres.');
    if (!passphrase || passphrase.length < 4) throw new Error('La clave de cifrado debe tener al menos 4 caracteres.');

    try { _initApp(config); } catch (err) {
      throw new Error('Configuración de Firebase inválida: ' + err.message);
    }

    let userCredential;
    try {
      userCredential = await _auth.createUserWithEmailAndPassword(email.trim(), password);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Este email ya está registrado. Usa el inicio de sesión normal.');
      }
      if (err.code === 'auth/weak-password') throw new Error('Contraseña demasiado débil (mínimo 6 caracteres).');
      if (err.code === 'auth/invalid-email')  throw new Error('Formato de email inválido.');
      throw new Error('Error al registrar: ' + err.message);
    }

    _user = userCredential.user;

    // Verificar lista blanca con el token ya disponible
    try {
      await _checkWhitelist(email.trim());
    } catch (err) {
      await _user.delete().catch(() => {});
      await _auth.signOut().catch(() => {});
      _user = null;
      throw err;
    }

    _passphrase = passphrase;
    _saveConfig(config);
    localStorage.setItem(LS_EMAIL, email.trim());
    await _loadAdminStatus(email.trim());
    return _user;
  }

  // ── Inicio de sesión con Google (OAuth) ──────────────────────────────────────
  async function loginWithGoogle(config) {
    try { _initApp(config); } catch (err) {
      throw new Error('Configuración de Firebase inválida: ' + err.message);
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    let userCredential;
    try {
      userCredential = await _auth.signInWithPopup(provider);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        throw new Error('Inicio de sesión cancelado.');
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error('El navegador bloqueó la ventana emergente. Permite popups para este sitio e inténtalo de nuevo.');
      }
      throw new Error('Error al autenticar con Google: ' + err.message);
    }

    _user = userCredential.user;
    const email = _user.email;

    try {
      await _checkWhitelist(email);
    } catch (err) {
      await _auth.signOut().catch(() => {});
      _user = null;
      throw err;
    }

    _saveConfig(config);
    localStorage.setItem(LS_EMAIL, email);
    await _loadAdminStatus(email);
    return _user;
  }

  // ── Reanudar sesión sin interacción ──────────────────────────────────────────
  // El SDK de Firebase persiste la sesión (IndexedDB) y refresca el ID token
  // solo. Al recargar, `currentUser` se resuelve de forma asíncrona, así que hay
  // que esperar al primer evento de onAuthStateChanged.
  //
  // Devuelve el usuario si el token sigue siendo válido, o null si no hay sesión
  // o ha dejado de serlo — en cuyo caso el llamante debe echar al usuario.
  async function restoreSession(config, { timeoutMs = 8000 } = {}) {
    if (!config) return null;
    try { _initApp(config); } catch { return null; }

    const user = await new Promise(resolve => {
      let resuelto = false;
      const finalizar = (u) => { if (!resuelto) { resuelto = true; resolve(u); } };
      const unsub = _auth.onAuthStateChanged(
        u => { unsub(); finalizar(u); },
        () => { unsub(); finalizar(null); }
      );
      // Si el SDK no contesta (offline con IndexedDB bloqueado), no colgamos el arranque
      setTimeout(() => finalizar(null), timeoutMs);
    });
    if (!user) return null;

    // El token puede estar caducado o revocado: forzar refresco lo comprueba
    // contra el servidor, que es lo que hace válida a la sesión.
    try {
      await user.getIdToken(true);
    } catch {
      await _auth.signOut().catch(() => {});
      return null;
    }

    _user = user;
    try {
      await _checkWhitelist(user.email);   // el acceso puede haberse revocado
    } catch {
      await _auth.signOut().catch(() => {});
      _user = null;
      return null;
    }
    localStorage.setItem(LS_EMAIL, user.email);
    await _loadAdminStatus(user.email);
    return _user;
  }

  // ── Cierre de sesión ─────────────────────────────────────────────────────────
  async function logout() {
    if (_auth) await _auth.signOut().catch(() => {});
    _user       = null;
    _passphrase = null;
    _isAdmin    = false;
    localStorage.removeItem(LS_EMAIL);
  }

  // ── Olvidar cuenta (borra config local y elimina app Firebase) ──────────────
  async function forget() {
    if (_auth) await _auth.signOut().catch(() => {});
    if (_app)  await _app.delete().catch(() => {});
    _app        = null;
    _auth       = null;
    _db         = null;
    _user       = null;
    _passphrase = null;
    _isAdmin    = false;
    localStorage.removeItem(LS_CONFIG);
    localStorage.removeItem(LS_EMAIL);
  }

  // ── Subir backup cifrado a Firestore ─────────────────────────────────────────
  // Los datos se cifran con AES-GCM-256 + PBKDF2 ANTES de llegar a Firebase.
  // Firebase solo almacena el ciphertext: "salt_b64:iv_b64:ct_b64"
  /** Fecha (ms) del backup visto en la última descarga; null si no se sabe. */
  let _ultimaFechaBackup = null;
  function ultimaFechaBackup() { return _ultimaFechaBackup; }

  async function uploadBackup() {
    if (!isConnected()) throw new Error('No autenticado en Firebase.');
    if (!_passphrase)   throw new Error('Clave de cifrado no disponible.');

    // Del ALMACENAMIENTO y con la lista del esquema, no de `State.get` con una
    // lista escrita a mano. Lo de antes fallaba por los dos lados: `State` es
    // una copia en memoria que puede ir por detrás de lo que hay en disco, y la
    // lista no incluía planes, transacciones ni puntos de control, así que el
    // planificador y la contabilidad no se subían a la nube. Nunca.
    const snapshot = window.FinanceApp?.datos?.snapshot?.()
      ?? (() => {
        console.warn('[Firebase] El paquete nuevo no está: la copia irá incompleta.');
        const out = {};
        for (const k of ['loans','expenses','accounts','goals','nominas','inflacion',
                         'tramosGananciasCapitalHistorico','tramosIRPFHistorico','escenarios','config']) {
          out[k] = State.get(k);
        }
        return out;
      })();

    const cipher = await CryptoService.encryptPortable(_passphrase, snapshot);

    await _db
      .collection('users').doc(_user.uid)
      .collection('data').doc(_backupDocId())
      .set({
        cipher,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        version:   2,
      });
  }

  // ── Descargar y descifrar backup de Firestore ────────────────────────────────
  async function downloadBackup() {
    if (!isConnected()) throw new Error('No autenticado en Firebase.');
    if (!_passphrase)   throw new Error('Clave de cifrado no disponible.');

    const doc = await _db
      .collection('users').doc(_user.uid)
      .collection('data').doc(_backupDocId())
      .get();

    if (!doc.exists) return null;

    // updatedAt se guardaba en Firestore y se tiraba aquí, así que era imposible
    // saber si la copia de la nube era más nueva o más vieja que la local.
    const { cipher, updatedAt } = doc.data();
    _ultimaFechaBackup = updatedAt?.toMillis ? updatedAt.toMillis() : null;
    try {
      return await CryptoService.decryptPortable(_passphrase, cipher);
    } catch {
      throw new Error('No se pudo descifrar el backup. ¿Es correcta la clave de cifrado?');
    }
  }

  // ── Registro de proyectos (la lista, no los datos de cada uno) ──────────────
  // `uploadBackup`/`downloadBackup` suben y bajan los DATOS de un proyecto,
  // en un documento por proyecto (`_backupDocId()`). Pero para pedir esa copia
  // hace falta conocer el id de antemano — y ese id solo vivía en el registro
  // LOCAL de cada dispositivo (`window.FinanceApp.proyectos`, ver
  // `state/proyectos.ts`), que nunca viajaba a ningún sitio. Resultado: un
  // proyecto creado en un dispositivo era invisible en cualquier otro, por
  // mucho que sus datos sí se hubieran subido.
  //
  // Este documento, FIJO (no depende del proyecto activo), guarda esa lista
  // — igual de cifrada que un backup normal, por la misma razón: los nombres
  // de los proyectos son datos del usuario como cualquier otro.
  function _registroDocId() { return 'proyectos'; }

  async function uploadRegistroProyectos() {
    if (!isConnected() || !_passphrase) return;
    const lista = window.FinanceApp?.proyectos?.listar?.();
    if (!lista) return;
    const cipher = await CryptoService.encryptPortable(_passphrase, lista);
    await _db
      .collection('users').doc(_user.uid)
      .collection('data').doc(_registroDocId())
      .set({ cipher, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), version: 1 });
  }

  async function downloadRegistroProyectos() {
    if (!isConnected() || !_passphrase) return null;
    const doc = await _db
      .collection('users').doc(_user.uid)
      .collection('data').doc(_registroDocId())
      .get();
    if (!doc.exists) return null;
    try {
      const lista = await CryptoService.decryptPortable(_passphrase, doc.data().cipher);
      return Array.isArray(lista) ? lista : null;
    } catch {
      return null;   // clave incorrecta: se ignora aquí, downloadBackup ya lo habrá avisado
    }
  }

  // ── Gestión de lista blanca ───────────────────────────────────────────────────

  async function listWhitelist() {
    if (!isConnected()) throw new Error('No autenticado en Firebase.');
    const snap = await _db.collection('whitelist').get();
    return snap.docs.map(d => ({ email: d.id, ...d.data() }));
  }

  async function addToWhitelist(email) {
    if (!isConnected()) throw new Error('No autenticado en Firebase.');
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes('@')) throw new Error('Email inválido.');
    await _db.collection('whitelist').doc(normalized).set({
      addedAt:  firebase.firestore.FieldValue.serverTimestamp(),
      addedBy:  _user.email,
    });
  }

  async function removeFromWhitelist(email) {
    if (!isConnected()) throw new Error('No autenticado en Firebase.');
    const normalized = email.trim().toLowerCase();
    if (normalized === _user.email.toLowerCase()) {
      throw new Error('No puedes eliminarte a ti mismo de la lista.');
    }
    await _db.collection('whitelist').doc(normalized).delete();
  }

  // ── Actualizar passphrase en memoria (sin re-autenticar) ─────────────────────
  function setPassphrase(passphrase) {
    _passphrase = passphrase;
  }

  /**
   * ¿Es esta la clave activa ahora mismo? No expone `_passphrase`: solo dice
   * si coincide. La usa el desbloqueo con huella para comprobar que lo que el
   * usuario ha vuelto a teclear es de verdad la clave en uso, y no envolver un
   * error de tecleo que rompería el desbloqueo la próxima vez sin que nadie
   * se entere hasta entonces.
   */
  function esClaveActual(passphrase) {
    return !!_passphrase && passphrase === _passphrase;
  }

  function isAdmin() { return _isAdmin; }

  async function setUserAdmin(email, adminStatus) {
    if (!isConnected()) throw new Error('No autenticado en Firebase.');
    await _db.collection('whitelist').doc(email.trim().toLowerCase()).update({ isAdmin: adminStatus });
  }

  return {
    isConfigured, getConfig, hasInjectedConfig, hasSavedSession, savedEmail,
    isConnected, currentUserEmail, isAdmin,
    login, register, loginWithGoogle, restoreSession, logout, forget,
    uploadBackup, downloadBackup, ultimaFechaBackup, setPassphrase, esClaveActual,
    uploadRegistroProyectos, downloadRegistroProyectos,
    listWhitelist, addToWhitelist, removeFromWhitelist, setUserAdmin,
  };
})();
