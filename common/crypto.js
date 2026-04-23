// ==================== CRYPTO_SERVICE ====================
const CryptoService = (() => {
  const ENC = 'AES-GCM', HASH = 'SHA-256', ITERATIONS = 200_000;
  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, hash: HASH, iterations: ITERATIONS }, km, { name: ENC, length: 256 }, false, ['encrypt', 'decrypt']);
  }
  function generateSalt() { return crypto.getRandomValues(new Uint8Array(16)); }
  async function encrypt(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const cipher = await crypto.subtle.encrypt({ name: ENC, iv }, key, enc.encode(JSON.stringify(data)));
    return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...new Uint8Array(cipher)))}`;
  }
  async function decrypt(key, payload) {
    const [ivB64, ctB64] = payload.split(':');
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(ctB64), c => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt({ name: ENC, iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(plain));
  }
  async function createVerificationToken(key) { return encrypt(key, { verify: 'ok', ts: Date.now() }); }
  async function verifyKey(key, token) { try { const o = await decrypt(key, token); return o?.verify === 'ok'; } catch { return false; } }
  return { deriveKey, generateSalt, encrypt, decrypt, createVerificationToken, verifyKey };
})();
