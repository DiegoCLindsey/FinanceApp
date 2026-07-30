// @vitest-environment happy-dom
// Sesión persistente entre recargas y cierre automático por inactividad.
// Responde a: "al actualizar la ventana se vuelve a preguntar por el método de
// acceso"; la sesión solo debe cerrarse a mano, porque el acceso deje de ser
// válido, o por el límite de inactividad si el usuario lo configura.
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { createSessionService, vigilarInactividad, SESSION_KEY, OPCIONES_AUTOLOGOUT } from '@/auth/session';

const MINUTO = 60_000;

/** Reloj controlable: nada de esperas reales en los tests. */
function reloj(inicio = 1_700_000_000_000) {
  let t = inicio;
  return { ahora: () => t, avanzarMin: (m: number) => (t += m * MINUTO) };
}

beforeEach(() => localStorage.clear());

describe('registro de sesión', () => {
  it('abre, persiste y se relee tras una "recarga"', () => {
    const s1 = createSessionService();
    s1.abrir({ modo: 'firebase', email: 'a@b.com', passphrase: 'clave' });

    // Instancia nueva = nueva carga de la página
    const reg = createSessionService().leer();
    expect(reg).toMatchObject({ modo: 'firebase', email: 'a@b.com', passphrase: 'clave' });
  });

  it('sin sesión abierta no devuelve nada', () => {
    expect(createSessionService().leer()).toBeNull();
    expect(createSessionService().activa).toBe(false);
  });

  it('el modo local no guarda passphrase', () => {
    const s = createSessionService();
    s.abrir({ modo: 'local' });
    expect(s.leer()).toMatchObject({ modo: 'local' });
    expect(s.leer()?.passphrase).toBeUndefined();
  });

  it('cerrar borra el registro', () => {
    const s = createSessionService();
    s.abrir({ modo: 'dropbox', passphrase: 'x' });
    s.cerrar();
    expect(s.leer()).toBeNull();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('abrir de nuevo reemplaza el registro anterior', () => {
    const s = createSessionService();
    s.abrir({ modo: 'local' });
    s.abrir({ modo: 'firebase', email: 'z@z.com', passphrase: 'k' });
    expect(s.leer()?.modo).toBe('firebase');
  });
});

describe('registros ilegibles', () => {
  it.each([
    ['JSON inválido', '{no'],
    ['modo desconocido', '{"modo":"ftp","creadaEn":1,"ultimoUso":1}'],
    ['sin marcas de tiempo', '{"modo":"local"}'],
    ['marcas no numéricas', '{"modo":"local","creadaEn":"ayer","ultimoUso":"hoy"}'],
    ['nulo', 'null'],
  ])('%s se descarta en vez de romper el arranque', (_caso, contenido) => {
    localStorage.setItem(SESSION_KEY, contenido);
    expect(createSessionService().leer()).toBeNull();
  });
});

describe('cierre automático por inactividad', () => {
  it('con el valor por defecto (0) la sesión no caduca nunca', () => {
    const r = reloj();
    const s = createSessionService({ ahora: r.ahora }); // autoLogoutMinutos → 0
    s.abrir({ modo: 'local' });

    r.avanzarMin(60 * 24 * 365);
    expect(s.caducada()).toBe(false);
    expect(s.leer()).not.toBeNull();
  });

  it('caduca al superar el límite y limpia el registro al leerlo', () => {
    const r = reloj();
    const s = createSessionService({ ahora: r.ahora, autoLogoutMinutos: () => 15 });
    s.abrir({ modo: 'firebase', passphrase: 'k' });

    r.avanzarMin(14);
    expect(s.caducada()).toBe(false);
    expect(s.leer()).not.toBeNull();

    r.avanzarMin(1); // justo en el límite: 15 min
    expect(s.caducada()).toBe(true);
    expect(s.leer()).toBeNull();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('tocar reinicia el contador de inactividad', () => {
    const r = reloj();
    const s = createSessionService({ ahora: r.ahora, autoLogoutMinutos: () => 15 });
    s.abrir({ modo: 'local' });

    r.avanzarMin(14);
    s.tocar();
    r.avanzarMin(14);

    expect(s.caducada()).toBe(false);
    expect(Math.round(s.inactividadMinutos() as number)).toBe(14);
  });

  it('tocar sin sesión no crea ninguna', () => {
    const s = createSessionService();
    s.tocar();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('un límite absurdo (NaN o negativo) se trata como "nunca"', () => {
    const r = reloj();
    const s = createSessionService({ ahora: r.ahora, autoLogoutMinutos: () => NaN });
    s.abrir({ modo: 'local' });
    r.avanzarMin(1000);
    expect(s.caducada()).toBe(false);
  });
});

describe('vigilancia mientras la pestaña está abierta', () => {
  // Cada vigilante deja un intervalo y unos listeners vivos: si no se detienen,
  // el de un test cierra la sesión del siguiente.
  const abiertos: (() => void)[] = [];
  const vigilar = (deps: Parameters<typeof vigilarInactividad>[0]) => {
    const detener = vigilarInactividad(deps);
    abiertos.push(detener);
    return detener;
  };

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    while (abiertos.length) abiertos.pop()!();
    vi.useRealTimers();
  });

  it('cierra la sesión y avisa al superarse el límite', () => {
    const r = reloj();
    const s = createSessionService({ ahora: r.ahora, autoLogoutMinutos: () => 15 });
    s.abrir({ modo: 'local' });
    const onCaducada = vi.fn();
    vigilar({ sesion: s, onCaducada, intervaloMs: 1000 });

    vi.advanceTimersByTime(1000);
    expect(onCaducada).not.toHaveBeenCalled();

    r.avanzarMin(20);
    vi.advanceTimersByTime(1000);

    expect(onCaducada).toHaveBeenCalledTimes(1);
    expect(s.leer()).toBeNull();

    // No vuelve a avisar aunque siga corriendo el reloj
    vi.advanceTimersByTime(10_000);
    expect(onCaducada).toHaveBeenCalledTimes(1);
  });

  it('la actividad del usuario mantiene viva la sesión', () => {
    const r = reloj();
    const s = createSessionService({ ahora: r.ahora, autoLogoutMinutos: () => 15 });
    s.abrir({ modo: 'local' });
    const onCaducada = vi.fn();
    vigilar({ sesion: s, onCaducada, intervaloMs: 1000 });

    r.avanzarMin(14);
    document.dispatchEvent(new Event('keydown')); // el usuario teclea
    r.avanzarMin(14);
    vi.advanceTimersByTime(1000);

    expect(onCaducada).not.toHaveBeenCalled();
  });

  it('detener deja de vigilar y de escuchar', () => {
    const r = reloj();
    const s = createSessionService({ ahora: r.ahora, autoLogoutMinutos: () => 15 });
    s.abrir({ modo: 'local' });
    const onCaducada = vi.fn();
    const detener = vigilar({ sesion: s, onCaducada, intervaloMs: 1000 });

    detener();
    r.avanzarMin(60);
    vi.advanceTimersByTime(5000);

    expect(onCaducada).not.toHaveBeenCalled();
    // El vigilante ya no toca nada; el registro sigue ahí (lo limpiará el
    // siguiente `leer`, que es quien aplica la caducidad).
    expect(localStorage.getItem(SESSION_KEY)).not.toBeNull();
  });
});

describe('opciones de la UI', () => {
  it('la primera opción es "nunca" y todas son minutos válidos', () => {
    expect(OPCIONES_AUTOLOGOUT[0].minutos).toBe(0);
    for (const o of OPCIONES_AUTOLOGOUT) {
      expect(Number.isInteger(o.minutos)).toBe(true);
      expect(o.minutos).toBeGreaterThanOrEqual(0);
      expect(o.etiqueta.length).toBeGreaterThan(0);
    }
  });
});
