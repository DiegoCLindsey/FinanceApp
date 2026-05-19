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

  let _app        = null;
  let _auth       = null;
  let _db         = null;
  let _user       = null;
  let _passphrase = null;   // solo en memoria, nunca persiste

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
    return _user;
  }

  // ── Registro de nueva cuenta ─────────────────────────────────────────────────
  // Solo funciona si el email ya está en la lista blanca (el admin lo añade antes).
  async function register(config, email, password, passphrase) {
    if (!email || !password)  throw new Error('Email y contraseña son obligatorios.');
    if (password.length < 6)  throw new Error('La contraseña debe tener al menos 6 caracteres.');
    if (!passphrase || passphrase.length < 4) throw new Error('La clave de cifrado debe tener al menos 4 caracteres.');

    try { _initApp(config); } catch (err) {
      throw new Error('Configuración de Firebase inválida: ' + err.message);
    }

    // Verificar lista blanca ANTES de crear la cuenta (solo lectura de whitelist)
    // Nota: el documento whitelist/{email} debe existir (creado manualmente por admin)
    try {
      const snap = await _db.collection('whitelist').doc(email.trim()).get();
      if (!snap.exists) {
        throw new Error('Tu dirección de correo no está autorizada. Solicita acceso al administrador.');
      }
    } catch (err) {
      if (err.message.includes('autorizada')) throw err;
      if (err.code === 'permission-denied') {
        throw new Error('Tu dirección de correo no está autorizada. Solicita acceso al administrador.');
      }
      // Si no podemos leer sin autenticación, lo verificaremos después del registro
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

    // Verificar lista blanca post-registro (con el token ya disponible)
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
    return _user;
  }

  // ── Cierre de sesión ─────────────────────────────────────────────────────────
  async function logout() {
    if (_auth) await _auth.signOut().catch(() => {});
    _user       = null;
    _passphrase = null;
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
    localStorage.removeItem(LS_CONFIG);
    localStorage.removeItem(LS_EMAIL);
  }

  // ── Subir backup cifrado a Firestore ─────────────────────────────────────────
  // Los datos se cifran con AES-GCM-256 + PBKDF2 ANTES de llegar a Firebase.
  // Firebase solo almacena el ciphertext: "salt_b64:iv_b64:ct_b64"
  async function uploadBackup() {
    if (!isConnected()) throw new Error('No autenticado en Firebase.');
    if (!_passphrase)   throw new Error('Clave de cifrado no disponible.');

    const snapshot = {};
    for (const k of ['loans','expenses','accounts','history','goals','nominas','inflacion',
                     'tramosGananciasCapitalHistorico','tramosIRPFHistorico','escenarios','config']) {
      snapshot[k] = State.get(k);
    }

    const cipher = await CryptoService.encryptPortable(_passphrase, snapshot);

    await _db
      .collection('users').doc(_user.uid)
      .collection('data').doc('backup')
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
      .collection('data').doc('backup')
      .get();

    if (!doc.exists) return null;

    const { cipher } = doc.data();
    try {
      return await CryptoService.decryptPortable(_passphrase, cipher);
    } catch {
      throw new Error('No se pudo descifrar el backup. ¿Es correcta la clave de cifrado?');
    }
  }

  // ── Actualizar passphrase en memoria (sin re-autenticar) ─────────────────────
  // Útil si el usuario quiere re-descifrar con una passphrase diferente.
  function setPassphrase(passphrase) {
    _passphrase = passphrase;
  }

  return {
    isConfigured, getConfig, hasSavedSession, savedEmail,
    isConnected, currentUserEmail,
    login, register, logout, forget,
    uploadBackup, downloadBackup, setPassphrase,
  };
})();
