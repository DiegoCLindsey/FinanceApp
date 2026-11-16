// ==================== CRYPTO_SERVICE ====================
const CryptoService = (() => {
  const ENC = 'AES-GCM', HASH = 'SHA-256', ITERATIONS = 200_000;

  // ── Primitivas base ───────────────────────────────────────────────────────────
  function generateSalt() { return crypto.getRandomValues(new Uint8Array(16)); }

  // Base64 de un array de bytes, POR TROZOS.
  //
  // Lo natural sería `btoa(String.fromCharCode(...bytes))`, y así estaba: el
  // spread pasa un argumento por byte, así que el número de argumentos crece
  // con el tamaño del backup. Con una cuenta de ~800 movimientos el cifrado ya
  // son cientos de miles de bytes y la llamada moría con "Maximum call stack
  // size exceeded" — el backup no se podía subir, y solo fallaba cuando había
  // datos de verdad. Troceando a 32 KB los argumentos se quedan muy por debajo
  // del límite del motor sea cual sea el tamaño del backup.
  function bytesABase64(bytes) {
    const TROZO = 0x8000;
    let binario = '';
    for (let i = 0; i < bytes.length; i += TROZO) {
      binario += String.fromCharCode(...bytes.subarray(i, i + TROZO));
    }
    return btoa(binario);
  }

  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const km  = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, hash: HASH, iterations: ITERATIONS },
      km,
      { name: ENC, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // ── Cifrado básico con clave ya derivada: devuelve "iv_b64:ct_b64" ───────────
  // Usado internamente y para el token local (sal gestionada externamente).
  async function encrypt(key, data) {
    const iv     = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt(
      { name: ENC, iv },
      key,
      new TextEncoder().encode(JSON.stringify(data))
    );
    return `${bytesABase64(iv)}:${bytesABase64(new Uint8Array(cipher))}`;
  }

  async function decrypt(key, payload) {
    const [ivB64, ctB64] = payload.split(':');
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(ctB64), c => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt({ name: ENC, iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(plain));
  }

  // ── Cifrado portátil: sal embebida en el payload ──────────────────────────────
  // Formato: "salt_b64:iv_b64:ct_b64"
  // La sal se genera fresh en cada llamada y viaja con el ciphertext.
  // Cualquier dispositivo que tenga la passphrase puede descifrar — no depende
  // de ningún estado local (localStorage, etc.).
  // ── Compresión ───────────────────────────────────────────────────────────────
  // La copia de Firebase va en UN documento, y Firestore lo limita a 1 MiB. El
  // JSON sin comprimir + cifrado + base64 llegaba a ese techo hacia los 3.500
  // movimientos, y a partir de ahí la copia dejaba de poder subirse (docs/14,
  // BUG-05). El JSON de movimientos es muy repetitivo: gzip lo deja en la
  // décima parte. Se comprime ANTES de cifrar (lo cifrado ya no comprime).
  const PREFIJO_GZ = 'gz1:';
  const _hayCompresion = () => typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
  async function _pasarPor(stream, bytes) {
    const salida = new Blob([bytes]).stream().pipeThrough(stream);
    return new Uint8Array(await new Response(salida).arrayBuffer());
  }
  function base64ABytes(b64) { return Uint8Array.from(atob(b64), c => c.charCodeAt(0)); }

  /** Cifra bytes con una clave ya derivada. Devuelve "iv_b64:ct_b64". */
  async function _cifrarBytes(key, bytes) {
    const iv     = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt({ name: ENC, iv }, key, bytes);
    return `${bytesABase64(iv)}:${bytesABase64(new Uint8Array(cipher))}`;
  }
  async function _descifrarBytes(key, payload) {
    const [ivB64, ctB64] = payload.split(':');
    return new Uint8Array(await crypto.subtle.decrypt({ name: ENC, iv: base64ABytes(ivB64) }, key, base64ABytes(ctB64)));
  }

  /**
   * Formatos:
   *   "gz1:salt:iv:ct"  → JSON comprimido con gzip y cifrado (actual)
   *   "salt:iv:ct"      → JSON cifrado sin comprimir (anterior; se sigue leyendo)
   * Sin `CompressionStream` (navegador antiguo) se escribe el formato anterior.
   */
  async function encryptPortable(passphrase, data) {
    const salt    = generateSalt();
    const key     = await deriveKey(passphrase, salt);
    const saltB64 = bytesABase64(salt);
    if (!_hayCompresion()) return `${saltB64}:${await encrypt(key, data)}`;
    const json = new TextEncoder().encode(JSON.stringify(data));
    const gz   = await _pasarPor(new CompressionStream('gzip'), json);
    return `${PREFIJO_GZ}${saltB64}:${await _cifrarBytes(key, gz)}`;
  }

  async function decryptPortable(passphrase, payload) {
    const comprimido = payload.startsWith(PREFIJO_GZ);
    const cuerpo  = comprimido ? payload.slice(PREFIJO_GZ.length) : payload;
    // Separar en exactamente tres partes: salt, iv, ct
    const idx1    = cuerpo.indexOf(':');
    const rest    = cuerpo.slice(idx1 + 1);                   // "iv:ct"
    const salt    = base64ABytes(cuerpo.slice(0, idx1));
    const key     = await deriveKey(passphrase, salt);
    if (!comprimido) return decrypt(key, rest);
    const gz   = await _descifrarBytes(key, rest);
    const json = await _pasarPor(new DecompressionStream('gzip'), gz);
    return JSON.parse(new TextDecoder().decode(json));
  }

  // ── Helpers legacy (usados por GDrive — preservados aunque esté desactivado) ──
  async function createVerificationToken(key) { return encrypt(key, { verify: 'ok', ts: Date.now() }); }
  async function verifyKey(key, token) {
    try { const o = await decrypt(key, token); return o?.verify === 'ok'; } catch { return false; }
  }

  return {
    generateSalt, deriveKey,
    encrypt, decrypt,
    encryptPortable, decryptPortable,
    createVerificationToken, verifyKey,
  };
})();

// Export dual, igual que finance-math.js: en el navegador este fichero es un
// script clásico y `CryptoService` ya es visible globalmente; bajo Node
// ("type":"module") se evalúa como ESM, así que lo publicamos en globalThis
// para que los tests usen el código real.
globalThis.CryptoService = CryptoService;
