// ── auth/session ──────────────────────────────────────────────────────────────
// Persistencia de la sesión entre recargas.
//
// Antes, cada F5 devolvía al usuario a la pantalla de inicio: había que volver
// a elegir método de acceso y reescribir la clave de cifrado. Este servicio
// guarda lo justo para poder reanudar y deja que auth/auth.js decida:
//   · si hay registro y el token sigue siendo válido → se reanuda en silencio
//   · si el token ya no vale                          → se cierra la sesión
//   · si el usuario la cierra a mano                  → se cierra
// La sesión NO caduca sola salvo que se configure `autoLogoutMinutos`.
//
// ── Nota sobre la clave de cifrado ────────────────────────────────────────────
// Para reanudar sin volver a preguntarla hay que guardarla, y se guarda en
// localStorage. Conviene entender qué protege y qué no: el estado completo de
// la aplicación YA vive en claro en el localStorage de este origen, así que la
// clave no añade exposición local — lo que protege es la copia subida a la nube
// frente al proveedor (Firebase/Dropbox nunca ven texto claro). Quien tenga
// acceso físico o de script al navegador ya tenía acceso a los datos.
// Para un equipo compartido, `autoLogoutMinutos` acota la ventana.

export type ModoSesion = 'local' | 'dropbox' | 'firebase';

export interface RegistroSesion {
  modo: ModoSesion;
  /** Cuenta asociada, cuando el modo la tiene (Firebase). */
  email?: string;
  /** Clave de cifrado de la copia en la nube. Ausente en modo local. */
  passphrase?: string;
  /** Epoch ms en que se abrió la sesión. */
  creadaEn: number;
  /** Epoch ms del último uso; base del cierre por inactividad. */
  ultimoUso: number;
}

export const SESSION_KEY = 'financeapp_session';

const MODOS: ModoSesion[] = ['local', 'dropbox', 'firebase'];

/** Valida lo leído de localStorage: puede venir de otra versión o manipulado. */
function parsear(raw: string | null): RegistroSesion | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<RegistroSesion>;
    if (!o || !MODOS.includes(o.modo as ModoSesion)) return null;
    const creadaEn = Number(o.creadaEn);
    const ultimoUso = Number(o.ultimoUso);
    if (!Number.isFinite(creadaEn) || !Number.isFinite(ultimoUso)) return null;
    return {
      modo: o.modo as ModoSesion,
      ...(typeof o.email === 'string' ? { email: o.email } : {}),
      ...(typeof o.passphrase === 'string' ? { passphrase: o.passphrase } : {}),
      creadaEn,
      ultimoUso,
    };
  } catch {
    return null;
  }
}

export interface SessionDeps {
  storage?: Storage;
  /** Minutos de inactividad tras los que cerrar sola la sesión; 0 = nunca. */
  autoLogoutMinutos?: () => number;
  ahora?: () => number;
}

export function createSessionService({ storage, autoLogoutMinutos = () => 0, ahora = () => Date.now() }: SessionDeps = {}) {
  const store = (): Storage | null => storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);

  function escribir(reg: RegistroSesion | null): void {
    const s = store();
    if (!s) return;
    try {
      if (reg) s.setItem(SESSION_KEY, JSON.stringify(reg));
      else s.removeItem(SESSION_KEY);
    } catch {
      /* modo privado o cuota: la sesión simplemente no persistirá */
    }
  }

  function crudo(): RegistroSesion | null {
    const s = store();
    if (!s) return null;
    try {
      return parsear(s.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  /** Minutos de inactividad acumulados, o null si no hay sesión. */
  function inactividadMinutos(): number | null {
    const reg = crudo();
    return reg ? (ahora() - reg.ultimoUso) / 60000 : null;
  }

  /** ¿La sesión ha superado el límite configurado de inactividad? */
  function caducada(): boolean {
    const limite = autoLogoutMinutos();
    if (!Number.isFinite(limite) || limite <= 0) return false; // 0 = nunca caduca
    const inactiva = inactividadMinutos();
    return inactiva !== null && inactiva >= limite;
  }

  /**
   * Registro de sesión utilizable. Devuelve null —y limpia— si ha caducado, de
   * modo que quien lo consulte no tenga que acordarse de comprobarlo.
   */
  function leer(): RegistroSesion | null {
    const reg = crudo();
    if (!reg) return null;
    if (caducada()) {
      escribir(null);
      return null;
    }
    return reg;
  }

  /** Abre (o reemplaza) la sesión persistida. */
  function abrir(datos: { modo: ModoSesion; email?: string; passphrase?: string }): RegistroSesion {
    const t = ahora();
    const reg: RegistroSesion = {
      modo: datos.modo,
      ...(datos.email ? { email: datos.email } : {}),
      ...(datos.passphrase ? { passphrase: datos.passphrase } : {}),
      creadaEn: t,
      ultimoUso: t,
    };
    escribir(reg);
    return reg;
  }

  /** Marca actividad: reinicia el contador de inactividad. */
  function tocar(): void {
    const reg = crudo();
    if (!reg) return;
    escribir({ ...reg, ultimoUso: ahora() });
  }

  function cerrar(): void {
    escribir(null);
  }

  return {
    abrir,
    leer,
    tocar,
    cerrar,
    caducada,
    inactividadMinutos,
    get activa() {
      return leer() !== null;
    },
  };
}

export type SessionService = ReturnType<typeof createSessionService>;

export interface VigilanciaDeps {
  sesion: SessionService;
  /** Se invoca una sola vez cuando la sesión caduca por inactividad. */
  onCaducada: () => void;
  /** Cada cuánto comprobar, en ms. */
  intervaloMs?: number;
  setIntervalImpl?: typeof setInterval;
  clearIntervalImpl?: typeof clearInterval;
  /** Dónde escuchar la actividad del usuario. */
  target?: Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;
}

const EVENTOS_ACTIVIDAD = ['pointerdown', 'keydown', 'visibilitychange'] as const;

/**
 * Vigila la inactividad mientras la pestaña está abierta. Sin esto, el cierre
 * automático solo se aplicaría al recargar, que es justo cuando menos falta
 * hace. Devuelve la función para dejar de vigilar.
 */
export function vigilarInactividad({
  sesion,
  onCaducada,
  intervaloMs = 30_000,
  setIntervalImpl = setInterval,
  clearIntervalImpl = clearInterval,
  target = typeof document !== 'undefined' ? document : undefined,
}: VigilanciaDeps): () => void {
  let vivo = true;
  const marcar = () => {
    if (vivo) sesion.tocar();
  };
  for (const ev of EVENTOS_ACTIVIDAD) target?.addEventListener(ev, marcar);

  const id = setIntervalImpl(() => {
    if (!vivo) return;
    if (sesion.caducada()) {
      detener();
      sesion.cerrar();
      onCaducada();
    }
  }, intervaloMs);

  function detener() {
    if (!vivo) return;
    vivo = false;
    clearIntervalImpl(id);
    for (const ev of EVENTOS_ACTIVIDAD) target?.removeEventListener(ev, marcar);
  }
  return detener;
}

/** Opciones que ofrece la UI para el cierre automático. */
export const OPCIONES_AUTOLOGOUT: { minutos: number; etiqueta: string }[] = [
  { minutos: 0, etiqueta: 'Nunca (solo manualmente)' },
  { minutos: 15, etiqueta: 'Tras 15 minutos de inactividad' },
  { minutos: 60, etiqueta: 'Tras 1 hora de inactividad' },
  { minutos: 480, etiqueta: 'Tras 8 horas de inactividad' },
  { minutos: 10080, etiqueta: 'Tras 7 días de inactividad' },
];
