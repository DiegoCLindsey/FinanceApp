// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { crearBiometria, type WebAuthnAPI } from '@/auth/biometria';
import { createMemoryAdapter } from '@/state/storage/local';

// happy-dom no trae WebCrypto ni `PublicKeyCredential`; `crypto.subtle` real de
// Node sí está disponible en el proceso de test y es justo lo que se quiere:
// la ceremonia WebAuthn se mockea (no hay sensor real que pinchar), pero el
// cifrado se ejecuta de verdad, así que estos tests comprueban el round-trip
// criptográfico completo, no solo que se llamó a las funciones correctas.
const subtle = globalThis.crypto.subtle;

/** Adapter de `StorageAdapter` sobre `createMemoryAdapter`, para no depender de `localStorage`. */
function storageDeMemoria(): Storage {
  const mem = createMemoryAdapter();
  return {
    getItem: (k) => (mem.get(k) as string | null) ?? null,
    setItem: (k, v) => mem.set(k, v),
    removeItem: (k) => mem.remove(k),
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage;
}

let contadorBytes = 0;
/** Bytes deterministas y DISTINTOS en cada llamada (importante: salt ≠ challenge ≠ userId). */
function randomBytesDeterminista(n: number): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(new ArrayBuffer(n));
  for (let i = 0; i < n; i++) out[i] = (contadorBytes + i) % 256;
  contadorBytes += 1000; // separa bien las llamadas sucesivas
  return out;
}

const PRF_BYTES = new Uint8Array(new ArrayBuffer(32)).map((_, i) => (i * 7 + 3) % 256).buffer;
const OTRO_PRF_BYTES = new Uint8Array(new ArrayBuffer(32)).map((_, i) => (i * 11 + 1) % 256).buffer;

interface OpcionesMock {
  /** ¿El `create()` ya trae `prf.results` (ceremonia única) o hay que pedirlo aparte con `get()`? */
  prfEnCreate?: boolean;
  prfSoportado?: boolean;
  disponible?: boolean;
  prfBytes?: ArrayBuffer;
}

function webauthnMock(opciones: OpcionesMock = {}) {
  const { prfEnCreate = true, prfSoportado = true, disponible = true, prfBytes = PRF_BYTES } = opciones;
  const create = vi.fn(async (o: CredentialCreationOptions): Promise<PublicKeyCredential | null> => {
    const rawId = (o.publicKey!.challenge as ArrayBuffer).slice(0); // cualquier ArrayBuffer distinto sirve de id falso
    return {
      rawId,
      getClientExtensionResults: () => ({
        prf: prfSoportado ? { enabled: true, ...(prfEnCreate ? { results: { first: prfBytes } } : {}) } : { enabled: false },
      }),
    } as unknown as PublicKeyCredential;
  });
  const get = vi.fn(
    async () =>
      ({
        getClientExtensionResults: () => ({ prf: { results: { first: prfBytes } } }),
      }) as unknown as PublicKeyCredential,
  );
  const disponiblePlataforma = vi.fn(async () => disponible);
  return { create, get, disponiblePlataforma } satisfies WebAuthnAPI;
}

function montar(opciones: OpcionesMock = {}) {
  const storage = storageDeMemoria();
  let t = 1_000_000;
  const webauthn = webauthnMock(opciones);
  const bio = crearBiometria({ webauthn, subtle, storage, ahora: () => t, randomBytes: randomBytesDeterminista });
  return { bio, webauthn, storage, avanzarMin: (min: number) => (t += min * 60_000) };
}

beforeEach(() => {
  contadorBytes = 0;
});

describe('disponible', () => {
  it('refleja lo que dice la plataforma', async () => {
    const { bio } = montar({ disponible: true });
    expect(await bio.disponible()).toBe(true);
    const { bio: bio2 } = montar({ disponible: false });
    expect(await bio2.disponible()).toBe(false);
  });
});

describe('registrar', () => {
  it('sin passphrase no registra nada', async () => {
    const { bio } = montar();
    await expect(bio.registrar('', 'firebase')).rejects.toThrow(/clave de cifrado/i);
  });

  it('registra con la ceremonia única (prf ya en el create)', async () => {
    const { bio, webauthn } = montar({ prfEnCreate: true });
    await bio.registrar('mi-clave-secreta', 'firebase');
    expect(webauthn.create).toHaveBeenCalledOnce();
    expect(webauthn.get).not.toHaveBeenCalled(); // no hizo falta la segunda ceremonia
    expect(bio.registrada()).toBe(true);
    expect(bio.leerCredencial()?.modo).toBe('firebase');
  });

  it('registra con dos ceremonias cuando el create() no trae los resultados', async () => {
    const { bio, webauthn } = montar({ prfEnCreate: false });
    await bio.registrar('mi-clave-secreta', 'dropbox');
    expect(webauthn.create).toHaveBeenCalledOnce();
    expect(webauthn.get).toHaveBeenCalledOnce(); // la segunda ceremonia SÍ hizo falta
    expect(bio.registrada()).toBe(true);
  });

  it('sin soporte PRF, no registra y lo explica', async () => {
    const { bio } = montar({ prfSoportado: false });
    await expect(bio.registrar('clave', 'firebase')).rejects.toThrow(/PRF/);
    expect(bio.registrada()).toBe(false);
  });

  it('sin autenticador (create devuelve null), no registra', async () => {
    const { bio, webauthn } = montar();
    webauthn.create.mockResolvedValueOnce(null);
    await expect(bio.registrar('clave', 'firebase')).rejects.toThrow();
    expect(bio.registrada()).toBe(false);
  });
});

describe('desbloquear', () => {
  it('sin credencial registrada, falla con un mensaje claro', async () => {
    const { bio } = montar();
    await expect(bio.desbloquear()).rejects.toThrow(/no hay huella/i);
  });

  it('round-trip real: lo que se registra es lo que se recupera', async () => {
    const { bio } = montar();
    await bio.registrar('correcto-caballo-batería-grapa', 'firebase');
    const recuperada = await bio.desbloquear();
    expect(recuperada).toBe('correcto-caballo-batería-grapa');
  });

  it('funciona igual si la ceremonia de registro necesitó dos toques', async () => {
    const { bio } = montar({ prfEnCreate: false });
    await bio.registrar('otra-clave', 'dropbox');
    expect(await bio.desbloquear()).toBe('otra-clave');
  });

  it('marca el instante del desbloqueo', async () => {
    const { bio } = montar();
    await bio.registrar('clave', 'firebase');
    expect(bio.dentroDeGracia()).toBe(false); // aún no se ha desbloqueado, solo registrado... aunque registrar no marca
    await bio.desbloquear();
    expect(bio.dentroDeGracia()).toBe(true);
  });

  it('un PRF distinto (dispositivo/credencial distintos) no descifra nada legible', async () => {
    // Simula un almacenamiento con una credencial ajena: el secreto se cifró
    // con una clave derivada de OTROS bytes PRF.
    const storage = storageDeMemoria();
    const bioA = crearBiometria({ webauthn: webauthnMock({ prfBytes: PRF_BYTES }), subtle, storage, randomBytes: randomBytesDeterminista });
    await bioA.registrar('secreto', 'firebase');

    const bioB = crearBiometria({
      webauthn: webauthnMock({ prfBytes: OTRO_PRF_BYTES }),
      subtle,
      storage,
      randomBytes: randomBytesDeterminista,
    });
    await expect(bioB.desbloquear()).rejects.toThrow();
  });
});

describe('olvidar', () => {
  it('borra la credencial y el secreto: desbloquear vuelve a fallar', async () => {
    const { bio } = montar();
    await bio.registrar('clave', 'firebase');
    expect(bio.registrada()).toBe(true);
    bio.olvidar();
    expect(bio.registrada()).toBe(false);
    await expect(bio.desbloquear()).rejects.toThrow();
  });
});

describe('gracia', () => {
  it('sin desbloqueo previo, no hay gracia', async () => {
    const { bio } = montar();
    await bio.registrar('clave', 'firebase');
    expect(bio.dentroDeGracia()).toBe(false);
  });

  it('sin credencial registrada, la gracia NUNCA se activa, aunque se marque un desbloqueo', () => {
    // La gracia es un beneficio de haber activado la huella, no un cambio de
    // comportamiento de serie para quien nunca la ha configurado en este
    // dispositivo.
    const { bio } = montar();
    bio.configurarGracia(30);
    bio.marcarDesbloqueo();
    expect(bio.dentroDeGracia()).toBe(false);
  });

  it('dura los minutos configurados y luego se acaba', async () => {
    const { bio, avanzarMin } = montar();
    await bio.registrar('clave', 'firebase');
    bio.configurarGracia(5);
    bio.marcarDesbloqueo();
    expect(bio.dentroDeGracia()).toBe(true);
    avanzarMin(4);
    expect(bio.dentroDeGracia()).toBe(true);
    avanzarMin(2); // total 6, por encima de 5
    expect(bio.dentroDeGracia()).toBe(false);
  });

  it('0 minutos apaga la gracia aunque se acabe de desbloquear', async () => {
    const { bio } = montar();
    await bio.registrar('clave', 'firebase');
    bio.configurarGracia(0);
    bio.marcarDesbloqueo();
    expect(bio.dentroDeGracia()).toBe(false);
  });

  it('por defecto son 5 minutos', () => {
    const { bio } = montar();
    expect(bio.graciaMinutos()).toBe(5);
  });

  it('un valor negativo o no numérico se trata como apagado', async () => {
    const { bio } = montar();
    await bio.registrar('clave', 'firebase');
    bio.configurarGracia(-3);
    bio.marcarDesbloqueo();
    expect(bio.dentroDeGracia()).toBe(false);
  });

  it('marcarDesbloqueo también lo llama un desbloqueo manual con la clave, no solo la huella', async () => {
    // Este es el mecanismo que usa auth.js: da igual cómo se ha demostrado
    // "soy yo", la gracia empieza a contar igual — siempre que la huella esté
    // activada en este dispositivo.
    const { bio } = montar();
    await bio.registrar('clave', 'firebase');
    bio.marcarDesbloqueo();
    expect(bio.dentroDeGracia()).toBe(true);
  });

  it('olvidar la credencial apaga la gracia de inmediato', async () => {
    const { bio } = montar();
    await bio.registrar('clave', 'firebase');
    bio.marcarDesbloqueo();
    expect(bio.dentroDeGracia()).toBe(true);
    bio.olvidar();
    expect(bio.dentroDeGracia()).toBe(false);
  });
});
