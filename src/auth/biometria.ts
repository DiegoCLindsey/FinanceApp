// ── auth/biometria ────────────────────────────────────────────────────────────
// Desbloqueo con huella dactilar (o Face ID, o Windows Hello: lo que dé el
// autenticador de plataforma del dispositivo) para la clave de cifrado de la
// copia en la nube.
//
// La clave de cifrado ya se guarda en claro en la sesión persistida (ver la
// nota larga en `auth/session.ts`): protege la copia subida a Firebase/Dropbox
// FRENTE AL PROVEEDOR, no frente a quien tiene el dispositivo. Este módulo no
// cambia esa amenaza — sigue sin haber ningún secreto que el propio origen no
// pueda leer—. Lo que da es una forma más cómoda de volver a demostrar «soy
// yo» tras un cierre de sesión, sin teclear la clave cada vez.
//
// ── El mecanismo: WebAuthn + la extensión PRF ────────────────────────────────
//
// Un `PublicKeyCredential` de plataforma, con la extensión `prf`, deja pedirle
// al autenticador —solo tras verificar la huella— 32 bytes deterministas
// ligados a esa credencial. Son los mismos 32 bytes cada vez que se repite la
// ceremonia con la misma credencial y la misma entrada (`salt`), y NADIE puede
// obtenerlos sin pasar la verificación biométrica. Esos bytes, pasados por
// HKDF, son la clave AES-GCM que envuelve la passphrase.
//
// No hay contraseña ni PIN de respaldo escondido en ningún sitio: sin la
// huella (o el fallback del sistema operativo que ella misma ofrezca) no se
// recupera la clave, y entonces toca teclear la passphrase, que es exactamente
// la casilla de seguridad que ya existía.
//
// ── Por qué DOS ceremonias al registrar ───────────────────────────────────────
//
// `navigator.credentials.create()` con `prf.eval` puede devolver los bytes en
// el mismo paso, pero no todos los autenticadores lo hacen — algunos solo
// entregan `prf.results` en un `get()` posterior. Registrar hace primero el
// `create()` (comprueba que el autenticador ADMITE prf) y, si no llegaron
// resultados ahí mismo, un `get()` inmediato con la misma entrada. Un roce
// extra en los autenticadores menos modernos; ninguno en los que sí devuelven
// el resultado al crear.

const RP_NAME = 'FinanceApp';
const INFO_HKDF = new TextEncoder().encode('financeapp-bio-passphrase-v1');

export type ModoBiometria = 'firebase' | 'dropbox';

export interface CredencialGuardada {
  /** id de la credencial WebAuthn, en base64url. */
  credencialId: string;
  /** Entrada fija de la extensión PRF para esta credencial, en base64. */
  salt: string;
  /** Para qué servicio se registró — informativo, no cambia el mecanismo. */
  modo: ModoBiometria;
  creadaEn: number;
}

/** Lo mínimo de la API WebAuthn que este módulo necesita, para poder mockarla en tests. */
export interface WebAuthnAPI {
  create(options: CredentialCreationOptions): Promise<PublicKeyCredential | null>;
  get(options: CredentialRequestOptions): Promise<PublicKeyCredential | null>;
  disponiblePlataforma(): Promise<boolean>;
}

export interface BiometriaDeps {
  webauthn?: WebAuthnAPI;
  subtle?: SubtleCrypto;
  storage?: Storage;
  ahora?: () => number;
  /** Genera bytes aleatorios. Inyectable para que los tests sean deterministas. */
  randomBytes?: (n: number) => Uint8Array<ArrayBuffer>;
}

/**
 * `new Uint8Array(n)` está respaldado por un `ArrayBuffer` real, nunca por un
 * `SharedArrayBuffer` — pero TS 5.7+ infiere el tipo más ancho
 * `Uint8Array<ArrayBufferLike>`, que la API WebAuthn/WebCrypto (`BufferSource`)
 * no acepta. Este helper centraliza el único sitio que lo sabe con certeza.
 */
function nuevoBuffer(n: number): Uint8Array<ArrayBuffer> {
  return new Uint8Array(new ArrayBuffer(n));
}

const LS_CREDENCIAL = 'financeapp_bio_credencial';
const LS_SECRETO = 'financeapp_bio_secreto';
const LS_ULTIMO = 'financeapp_bio_ultimo_desbloqueo';
const LS_GRACIA = 'financeapp_bio_gracia_min';
const GRACIA_POR_DEFECTO_MIN = 5;

// Nótese: NINGUNA de estas claves lleva el prefijo `state_` que
// `state/colecciones.ts` respalda — es intencionado. La credencial y la
// passphrase envuelta son secretos de ESTE dispositivo, ligados a SU
// autenticador; incluirlos en una copia de seguridad los llevaría a otro
// dispositivo donde no sirven de nada y no deberían viajar de todos modos.

function webauthnReal(): WebAuthnAPI {
  return {
    create: (o) => navigator.credentials.create(o) as Promise<PublicKeyCredential | null>,
    get: (o) => navigator.credentials.get(o) as Promise<PublicKeyCredential | null>,
    async disponiblePlataforma() {
      if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
      try {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      } catch {
        return false;
      }
    },
  };
}

// ── Codificación ──────────────────────────────────────────────────────────────
function b64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function unb64(s: string): Uint8Array<ArrayBuffer> {
  const decoded = atob(s);
  const out = nuevoBuffer(decoded.length);
  for (let i = 0; i < decoded.length; i++) out[i] = decoded.charCodeAt(i);
  return out;
}
// base64url: sin +/=, que es lo que exige `credencialId` como `id` de WebAuthn.
function b64url(buf: ArrayBuffer): string {
  return b64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64url(s: string): Uint8Array<ArrayBuffer> {
  const conRelleno = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  return unb64(conRelleno);
}

interface ExtensionesPRF {
  prf?: { enabled?: boolean; results?: { first?: ArrayBuffer } };
}

function extensionesPRF(cred: PublicKeyCredential): ExtensionesPRF {
  return cred.getClientExtensionResults() as ExtensionesPRF;
}

export function crearBiometria(deps: BiometriaDeps = {}) {
  const webauthn = deps.webauthn ?? webauthnReal();
  const subtle = deps.subtle ?? (typeof crypto !== 'undefined' ? crypto.subtle : (undefined as unknown as SubtleCrypto));
  const storage = deps.storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
  const ahora = deps.ahora ?? (() => Date.now());
  const randomBytes = deps.randomBytes ?? ((n: number) => crypto.getRandomValues(nuevoBuffer(n)));

  function requiereStorage(): Storage {
    if (!storage) throw new Error('No hay almacenamiento local disponible.');
    return storage;
  }

  /** ¿Hay autenticador de plataforma (huella, Face ID, Windows Hello…)? Solo detección de presencia, no de soporte PRF. */
  function disponible(): Promise<boolean> {
    return webauthn.disponiblePlataforma();
  }

  function leerCredencial(): CredencialGuardada | null {
    const raw = storage?.getItem(LS_CREDENCIAL);
    if (!raw) return null;
    try {
      const o = JSON.parse(raw) as Partial<CredencialGuardada>;
      if (typeof o.credencialId !== 'string' || typeof o.salt !== 'string') return null;
      return o as CredencialGuardada;
    } catch {
      return null;
    }
  }

  /** ¿Hay una credencial biométrica registrada en ESTE dispositivo? */
  function registrada(): boolean {
    return leerCredencial() !== null;
  }

  async function derivarClave(prfBytes: ArrayBuffer): Promise<CryptoKey> {
    const base = await subtle.importKey('raw', prfBytes, 'HKDF', false, ['deriveKey']);
    return subtle.deriveKey(
      { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: INFO_HKDF },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  async function cifrar(key: CryptoKey, texto: string): Promise<string> {
    const iv = randomBytes(12);
    const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(texto));
    return `${b64(iv)}:${b64(ct)}`;
  }

  async function descifrar(key: CryptoKey, payload: string): Promise<string> {
    const [ivB64, ctB64] = payload.split(':');
    const iv = unb64(ivB64);
    const ct = unb64(ctB64);
    const plano = await subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return new TextDecoder().decode(plano);
  }

  /**
   * Registra una credencial biométrica y cifra la passphrase con ella.
   *
   * `passphrase` debe ser una que YA se conoce en esta sesión (la que se
   * escribió al conectar, o la que se acaba de teclear): registrar no la pide
   * de nuevo, la envuelve.
   */
  async function registrar(passphrase: string, modo: ModoBiometria): Promise<void> {
    if (!passphrase) throw new Error('No hay clave de cifrado que envolver.');
    const salt = randomBytes(32);
    const challenge = randomBytes(32);
    const userId = randomBytes(16);

    const cred = await webauthn.create({
      publicKey: {
        challenge,
        rp: { name: RP_NAME },
        user: { id: userId, name: 'financeapp-local', displayName: 'FinanceApp en este dispositivo' },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256, por si el autenticador no admite ES256
        ],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'required' },
        extensions: { prf: { eval: { first: salt } } } as AuthenticationExtensionsClientInputs,
        timeout: 60_000,
      },
    });
    if (!cred) throw new Error('No se ha podido crear la credencial biométrica.');

    const ext = extensionesPRF(cred);
    if (!ext.prf?.enabled) {
      throw new Error('Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).');
    }

    // Algunos autenticadores devuelven los bytes ya en el create(); si no, se
    // pide con un get() inmediato, con la MISMA entrada (`salt`) para obtener
    // el mismo resultado.
    let prfBytes = ext.prf.results?.first ?? null;
    if (!prfBytes) prfBytes = await evaluarPRF(cred.rawId, salt);
    if (!prfBytes) throw new Error('El sensor no ha devuelto material de cifrado.');

    const key = await derivarClave(prfBytes);
    const secreto = await cifrar(key, passphrase);

    const meta: CredencialGuardada = { credencialId: b64url(cred.rawId), salt: b64(salt), modo, creadaEn: ahora() };
    const s = requiereStorage();
    s.setItem(LS_CREDENCIAL, JSON.stringify(meta));
    s.setItem(LS_SECRETO, secreto);
  }

  /** Segunda ceremonia para autenticadores que no devuelven `prf.results` en el `create()`. */
  async function evaluarPRF(credencialId: ArrayBuffer, salt: Uint8Array): Promise<ArrayBuffer | null> {
    const assertion = await webauthn.get({
      publicKey: {
        challenge: randomBytes(32),
        allowCredentials: [{ id: credencialId, type: 'public-key' }],
        userVerification: 'required',
        extensions: { prf: { eval: { first: salt } } } as AuthenticationExtensionsClientInputs,
        timeout: 60_000,
      },
    });
    if (!assertion) return null;
    return extensionesPRF(assertion).prf?.results?.first ?? null;
  }

  /**
   * Pide la huella y devuelve la passphrase envuelta.
   *
   * Marca el instante del desbloqueo (ver `dentroDeGracia`), tanto si viene de
   * aquí como de una entrada manual — eso lo decide quien llame a
   * `marcarDesbloqueo` desde el flujo de acceso normal.
   */
  async function desbloquear(): Promise<string> {
    const meta = leerCredencial();
    if (!meta) throw new Error('No hay huella configurada en este dispositivo.');
    const secreto = storage?.getItem(LS_SECRETO);
    if (!secreto) throw new Error('No hay clave guardada. Vuelve a activar el desbloqueo con huella.');

    const prfBytes = await evaluarPRF(unb64url(meta.credencialId).buffer as ArrayBuffer, unb64(meta.salt));
    if (!prfBytes) throw new Error('No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.');

    const key = await derivarClave(prfBytes);
    const passphrase = await descifrar(key, secreto);
    marcarDesbloqueo();
    return passphrase;
  }

  /** Olvida la credencial y la passphrase envuelta en este dispositivo. */
  function olvidar(): void {
    storage?.removeItem(LS_CREDENCIAL);
    storage?.removeItem(LS_SECRETO);
    storage?.removeItem(LS_ULTIMO);
  }

  /** Registra el instante de un desbloqueo correcto — con huella o con la clave tecleada a mano. */
  function marcarDesbloqueo(): void {
    storage?.setItem(LS_ULTIMO, String(ahora()));
  }

  /**
   * Minutos de gracia configurados. Por defecto, 5 — pero SOLO cuando nunca
   * se ha configurado nada (`raw === null`). Si se ha guardado explícitamente
   * `0` (apagar la gracia), eso hay que respetarlo, no confundirlo con "no
   * hay preferencia guardada" y devolver el 5 por defecto en su lugar.
   */
  function graciaMinutos(): number {
    const raw = storage?.getItem(LS_GRACIA);
    if (raw === null || raw === undefined) return GRACIA_POR_DEFECTO_MIN;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  /** Cambia los minutos de gracia. `0` o negativo los apaga (siempre pide algo). */
  function configurarGracia(minutos: number): void {
    storage?.setItem(LS_GRACIA, String(Math.max(0, Math.floor(minutos) || 0)));
  }

  /**
   * ¿Sigue dentro del periodo de gracia desde el último desbloqueo?
   *
   * Mientras sea `true`, no hace falta volver a pedir nada — ni huella ni
   * clave — para reanudar. Lo consume `auth/session.ts` para no dar la sesión
   * por caducada dentro de la ventana.
   *
   * Exige credencial registrada: sin ella, la gracia no significa nada — es
   * un beneficio de haber activado la huella, no un cambio de comportamiento
   * de serie para quien nunca la ha configurado.
   */
  function dentroDeGracia(): boolean {
    if (!registrada()) return false;
    const minutos = graciaMinutos();
    if (minutos <= 0) return false;
    const raw = storage?.getItem(LS_ULTIMO);
    const t = raw ? Number(raw) : NaN;
    if (!Number.isFinite(t)) return false;
    return ahora() - t < minutos * 60_000;
  }

  return {
    disponible,
    registrada,
    leerCredencial,
    registrar,
    desbloquear,
    olvidar,
    marcarDesbloqueo,
    dentroDeGracia,
    graciaMinutos,
    configurarGracia,
  };
}

export type Biometria = ReturnType<typeof crearBiometria>;
