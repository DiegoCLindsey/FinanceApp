// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { instalarAvisoGuardado } from '@/ui/guardado';
import { crearRegistroCambios } from '@/state/cambios';

// Todos los avisos comparten el mismo id en `document`, que sobrevive entre
// tests: si no se desmontan, el temporizador de cierre de un test anterior
// borra el aviso del siguiente a media comprobación.
let desmontar: (() => void) | null = null;

function montar(over: { guardar?: () => Promise<void>; hayDestino?: () => boolean; msExito?: number } = {}) {
  document.body.innerHTML = '<div id="toast-container"></div>';
  const cambios = crearRegistroCambios();
  const guardar = over.guardar ?? vi.fn(async () => {});
  const aviso = instalarAvisoGuardado({
    cambios,
    hayDestino: over.hayDestino ?? (() => true),
    guardar,
    msExito: over.msExito ?? 20,
  });
  desmontar = () => aviso.detener();
  return { cambios, guardar, aviso };
}

const caja = () => document.getElementById('aviso-guardado');
const texto = () => caja()?.querySelector('span')?.textContent ?? '';
const botonPorTexto = (t: string) =>
  [...(caja()?.querySelectorAll('button') ?? [])].find((b) => b.textContent === t) as HTMLButtonElement | undefined;

describe('aviso de cambios sin guardar', () => {
  beforeEach(() => {
    desmontar?.();
    desmontar = null;
    document.body.innerHTML = '';
  });

  it('no aparece si no ha cambiado nada', () => {
    montar();
    expect(caja()).toBeNull();
  });

  it('aparece en cuanto cambia algo', () => {
    const { cambios } = montar();
    cambios.marcar('expenses');
    expect(texto()).toBe('Tienes cambios sin guardar.');
    expect(botonPorTexto('Guardar ahora')).toBeTruthy();
    expect(botonPorTexto('Ocultar')).toBeTruthy();
  });

  it('sin destino de copia no avisa: no habría nada que subir', () => {
    const { cambios } = montar({ hayDestino: () => false });
    cambios.marcar('expenses');
    expect(caja()).toBeNull();
  });

  it('«Ocultar» lo quita', () => {
    const { cambios, aviso } = montar();
    cambios.marcar('expenses');
    botonPorTexto('Ocultar')!.click();
    expect(caja()).toBeNull();
    expect(aviso.estado()).toBe('oculto');
  });

  it('ocultar NO es guardar: un cambio nuevo lo vuelve a sacar', () => {
    const { cambios } = montar();
    cambios.marcar('expenses');
    botonPorTexto('Ocultar')!.click();
    cambios.marcar('loans');
    expect(texto()).toBe('Tienes cambios sin guardar.');
  });

  it('«Guardar ahora» enseña Subiendo… y después ¡Guardado!, y se cierra solo', async () => {
    let resolver: (() => void) | null = null;
    const guardar = vi.fn(() => new Promise<void>((r) => (resolver = r)));
    const { cambios } = montar({ guardar, msExito: 400 });

    cambios.marcar('expenses');
    const enCurso = botonPorTexto('Guardar ahora')!.click();
    void enCurso;
    expect(texto()).toBe('Subiendo…');
    expect(caja()?.querySelector('.guardado-giro')).toBeTruthy();

    resolver!();
    await vi.waitFor(() => expect(texto()).toBe('¡Guardado!'));
    // Y se cierra solo pasado `msExito`, sin que nadie lo toque.
    await vi.waitFor(() => expect(caja()).toBeNull(), { timeout: 2000 });
  });

  it('un cambio hecho MIENTRAS sube deja el aviso pendiente al terminar', async () => {
    // Es el caso que se rompe solo si se confirma «guardado» contra la revisión
    // de cuando termina la subida en vez de la que se llevó.
    let resolver: (() => void) | null = null;
    const guardar = vi.fn(() => new Promise<void>((r) => (resolver = r)));
    const { cambios } = montar({ guardar, msExito: 400 });

    cambios.marcar('expenses');
    botonPorTexto('Guardar ahora')!.click();
    cambios.marcar('loans'); // entra con la copia en vuelo

    resolver!();
    await vi.waitFor(() => expect(texto()).toBe('¡Guardado!'));
    // No se cierra: vuelve a avisar, porque el segundo cambio sigue sin subir.
    await vi.waitFor(() => expect(texto()).toBe('Tienes cambios sin guardar.'), { timeout: 2000 });
  });

  it('dos guardados a la vez son uno solo', async () => {
    let resolver: (() => void) | null = null;
    const guardar = vi.fn(() => new Promise<void>((r) => (resolver = r)));
    const { cambios, aviso } = montar({ guardar });

    cambios.marcar('expenses');
    const a = aviso.guardarAhora();
    const b = aviso.guardarAhora(); // el temporizador salta mientras
    resolver!();
    await Promise.all([a, b]);
    expect(guardar).toHaveBeenCalledOnce();
  });

  it('si la subida falla lo dice y ofrece reintentar', async () => {
    const guardar = vi.fn(async () => {
      throw new Error('sin red');
    });
    const { cambios, aviso } = montar({ guardar });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    cambios.marcar('expenses');
    await aviso.guardarAhora();
    expect(texto()).toBe('No se ha podido guardar.');
    expect(botonPorTexto('Reintentar')).toBeTruthy();
    expect(aviso.estado()).toBe('error');
    error.mockRestore();
  });

  it('tras un fallo, reintentar puede salir bien', async () => {
    let fallar = true;
    const guardar = vi.fn(async () => {
      if (fallar) throw new Error('sin red');
    });
    const { cambios, aviso } = montar({ guardar, msExito: 400 });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    cambios.marcar('expenses');
    await aviso.guardarAhora();
    fallar = false;
    botonPorTexto('Reintentar')!.click();
    await vi.waitFor(() => expect(texto()).toBe('¡Guardado!'));
    error.mockRestore();
  });

  it('detener lo retira y deja de escuchar', () => {
    const { cambios, aviso } = montar();
    cambios.marcar('expenses');
    aviso.detener();
    expect(caja()).toBeNull();
    cambios.marcar('loans');
    expect(caja()).toBeNull();
  });

  it('sin contenedor no revienta', () => {
    document.body.innerHTML = '';
    const cambios = crearRegistroCambios();
    instalarAvisoGuardado({ cambios, hayDestino: () => true, guardar: async () => {} });
    expect(() => cambios.marcar('expenses')).not.toThrow();
  });
});
