// ==================== CRYPTO_SERVICE ====================
const CryptoService = (() => {
  const ENC = 'AES-GCM', HASH = 'SHA-256', ITERATIONS = 200_000;

  // ── Primitivas base ───────────────────────────────────────────────────────────
  function generateSalt() { return crypto.getRandomValues(new Uint8Array(16)); }

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
    return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...new Uint8Array(cipher)))}`;
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
  async function encryptPortable(passphrase, data) {
    const salt    = generateSalt();
    const key     = await deriveKey(passphrase, salt);
    const payload = await encrypt(key, data);                 // "iv:ct"
    const saltB64 = btoa(String.fromCharCode(...salt));
    return `${saltB64}:${payload}`;                           // "salt:iv:ct"
  }

  async function decryptPortable(passphrase, payload) {
    // Separar en exactamente tres partes: salt, iv, ct
    const idx1    = payload.indexOf(':');
    const rest    = payload.slice(idx1 + 1);                  // "iv:ct"
    const saltB64 = payload.slice(0, idx1);
    const salt    = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
    const key     = await deriveKey(passphrase, salt);
    return decrypt(key, rest);
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
