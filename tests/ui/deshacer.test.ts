// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { instalarDeshacer } from '@/ui/deshacer';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';

/* eslint-disable @typescript-eslint/no-explicit-any */
const HOY = new Date(2026, 6, 30);

const gasto = (concepto: string) =>
  ({
    concepto,
    cuantia: 10,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    tags: [],
    activo: true,
    escenarioIds: [],
  }) as any;

function montar() {
  document.body.innerHTML = '<div id="toast-container"></div>';
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const rerender = vi.fn();
  const detener = instalarDeshacer({ store: store as never, rerender });
  return { store, rerender, detener };
}

const avisos = () => [...document.querySelectorAll('#toast-container .toast')] as HTMLElement[];
const botonDeshacer = () => document.querySelector('#toast-container button') as HTMLButtonElement | null;

describe('aviso de deshacer', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('no enseña nada mientras no se borra', () => {
    const { store } = montar();
    store.addItem('expenses', gasto('Alquiler'));
    expect(avisos()).toHaveLength(0);
  });

  it('al borrar aparece el aviso, con el nombre de lo borrado', () => {
    const { store } = montar();
    const g = store.addItem('expenses', gasto('Gimnasio'));
    store.removeItem('expenses', g._id);
    expect(avisos()).toHaveLength(1);
    expect(avisos()[0].textContent).toContain('El gasto «Gimnasio»');
    expect(botonDeshacer()?.textContent).toBe('Deshacer');
  });

  it('el nombre va como TEXTO: un concepto con HTML no se interpreta', () => {
    const { store } = montar();
    const g = store.addItem('expenses', gasto('<img src=x onerror=alert(1)>'));
    store.removeItem('expenses', g._id);
    expect(document.querySelector('#toast-container img')).toBeNull();
    expect(avisos()[0].textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('pulsar Deshacer restaura y repinta', () => {
    const { store, rerender } = montar();
    const g = store.addItem('expenses', gasto('Gimnasio'));
    store.removeItem('expenses', g._id);
    expect(store.get('expenses')).toHaveLength(0);

    botonDeshacer()?.click();
    expect(store.get('expenses')).toHaveLength(1);
    expect(rerender).toHaveBeenCalledOnce();
    // El aviso con el botón desaparece y queda la confirmación.
    expect(botonDeshacer()).toBeNull();
    expect(document.querySelector('#toast-container .toast-ok')?.textContent).toBe('Deshecho.');
  });

  it('un segundo borrado sustituye al aviso anterior en vez de apilarse', () => {
    const { store } = montar();
    const a = store.addItem('expenses', gasto('Alquiler'));
    const b = store.addItem('expenses', gasto('Luz'));
    store.removeItem('expenses', a._id);
    store.removeItem('expenses', b._id);
    expect(avisos()).toHaveLength(1);
    expect(avisos()[0].textContent).toContain('«Luz»');
  });

  it('un cambio que no es un borrado no vuelve a levantar el aviso', () => {
    const { store } = montar();
    const g = store.addItem('expenses', gasto('Gimnasio'));
    store.removeItem('expenses', g._id);
    const antes = avisos()[0];
    store.patchConfig({ colchonMeses: 9 });
    expect(avisos()).toHaveLength(1);
    expect(avisos()[0]).toBe(antes); // el MISMO nodo, no uno nuevo
  });

  it('el aviso se retira solo al cabo de su tiempo', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="toast-container"></div>';
    const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
    store.load();
    instalarDeshacer({ store: store as never, duracionMs: 1000 });
    const g = store.addItem('expenses', gasto('Gimnasio'));
    store.removeItem('expenses', g._id);
    expect(avisos()).toHaveLength(1);
    vi.advanceTimersByTime(1001);
    expect(avisos()).toHaveLength(0);
  });

  it('detener desengancha y deja de avisar', () => {
    const { store, detener } = montar();
    detener();
    const g = store.addItem('expenses', gasto('Gimnasio'));
    store.removeItem('expenses', g._id);
    expect(avisos()).toHaveLength(0);
  });

  it('sin contenedor no revienta', () => {
    document.body.innerHTML = '';
    const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
    store.load();
    instalarDeshacer({ store: store as never });
    const g = store.addItem('expenses', gasto('Gimnasio'));
    expect(() => store.removeItem('expenses', g._id)).not.toThrow();
  });
});
