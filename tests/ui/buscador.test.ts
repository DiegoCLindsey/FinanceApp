// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { instalarBuscador } from '@/ui/buscador';

/* eslint-disable @typescript-eslint/no-explicit-any */

const estado = {
  accounts: [{ _id: 'cc', nombre: 'Cuenta corriente', saldoInicial: 8400 }],
  expenses: [
    { _id: 'e1', concepto: 'Seguro coche', cuantia: 480, tipo: 'gasto', cuenta: 'cc', tags: [] },
    { _id: 'e2', concepto: 'Seguro de hogar', cuantia: 210, tipo: 'gasto', cuenta: 'cc', tags: [] },
  ],
  loans: [{ _id: 'l1', nombre: 'Hipoteca', capital: 120000, cuenta: 'cc', tags: [] }],
} as any;

// El atajo de teclado se engancha a `document`, que sobrevive entre tests: si
// no se desmontan, se van acumulando buscadores y el de un test abre la ventana
// de otro.
let desmontar: (() => void) | null = null;

function montar(over: Partial<Parameters<typeof instalarBuscador>[0]> = {}) {
  document.body.innerHTML = '<div id="period-bar"></div>';
  const navegar = vi.fn();
  const detener = instalarBuscador({ estado: () => estado, navegar, ...over });
  desmontar = detener;
  return { navegar, detener };
}

const boton = () => document.getElementById('btn-buscador') as HTMLButtonElement | null;
const overlay = () => document.getElementById('buscador-overlay') as HTMLElement | null;
const input = () => overlay()?.querySelector('input') as HTMLInputElement | null;
const filas = () => [...(overlay()?.querySelectorAll('.buscador-fila') ?? [])] as HTMLElement[];
const activa = () => overlay()?.querySelector('.buscador-fila.activa') as HTMLElement | null;

function teclear(texto: string) {
  const i = input()!;
  i.value = texto;
  i.dispatchEvent(new Event('input'));
}

function tecla(key: string, extra: KeyboardEventInit = {}) {
  input()!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra }));
}

describe('buscador global', () => {
  beforeEach(() => {
    desmontar?.();
    desmontar = null;
    document.body.innerHTML = '';
  });

  it('pone la lupa en la barra de periodo', () => {
    montar();
    expect(boton()).not.toBeNull();
    expect(boton()?.textContent).toContain('Buscar');
  });

  it('sin barra de periodo no revienta ni monta el botón', () => {
    document.body.innerHTML = '';
    expect(() => instalarBuscador({ estado: () => estado, navegar: vi.fn() })).not.toThrow();
    expect(boton()).toBeNull();
  });

  it('no crea la ventana hasta que hace falta', () => {
    montar();
    expect(overlay()).toBeNull();
    boton()!.click();
    expect(overlay()).not.toBeNull();
  });

  it('Ctrl+K abre y vuelve a cerrar', () => {
    montar();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
    expect(overlay()?.style.display).not.toBe('none');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
    expect(overlay()?.style.display).toBe('none');
  });

  it('⌘K también, que es lo que se pulsa en un Mac', () => {
    montar();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true, cancelable: true }));
    expect(overlay()?.style.display).not.toBe('none');
  });

  it('una K sin modificador no abre nada: se estaría escribiendo', () => {
    montar();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true, cancelable: true }));
    expect(overlay()).toBeNull();
  });

  it('con menos de dos letras lo dice en vez de listar todo', () => {
    montar();
    boton()!.click();
    teclear('s');
    expect(filas()).toHaveLength(0);
    expect(overlay()?.textContent).toContain('al menos dos letras');
  });

  it('lista los resultados con su tipo', () => {
    montar();
    boton()!.click();
    teclear('seguro');
    expect(filas()).toHaveLength(2);
    expect(filas()[0].textContent).toContain('Seguro coche');
    expect(filas()[0].textContent).toContain('Gasto');
  });

  it('sin resultados lo dice', () => {
    montar();
    boton()!.click();
    teclear('zzzz');
    expect(filas()).toHaveLength(0);
    expect(overlay()?.textContent).toContain('Nada que se parezca');
  });

  it('las flechas mueven la selección y dan la vuelta', () => {
    montar();
    boton()!.click();
    teclear('seguro');
    expect(activa()?.textContent).toContain('Seguro coche');
    tecla('ArrowDown');
    expect(activa()?.textContent).toContain('Seguro de hogar');
    tecla('ArrowDown'); // vuelve al primero
    expect(activa()?.textContent).toContain('Seguro coche');
    tecla('ArrowUp'); // y hacia arriba desde el primero, al último
    expect(activa()?.textContent).toContain('Seguro de hogar');
  });

  it('Intro navega a la vista donde vive el resultado y cierra', () => {
    const { navegar } = montar();
    boton()!.click();
    teclear('hipoteca');
    tecla('Enter');
    expect(navegar).toHaveBeenCalledWith('loans');
    expect(overlay()?.style.display).toBe('none');
  });

  it('pulsar una fila hace lo mismo que Intro', () => {
    const { navegar } = montar();
    boton()!.click();
    teclear('seguro');
    filas()[1].click();
    expect(navegar).toHaveBeenCalledWith('expenses');
  });

  it('Intro sin resultados no navega a ningún sitio', () => {
    const { navegar } = montar();
    boton()!.click();
    teclear('zzzz');
    tecla('Enter');
    expect(navegar).not.toHaveBeenCalled();
  });

  it('Escape cierra', () => {
    montar();
    boton()!.click();
    tecla('Escape');
    expect(overlay()?.style.display).toBe('none');
  });

  it('al reabrir, la caja viene vacía', () => {
    montar();
    boton()!.click();
    teclear('seguro');
    tecla('Escape');
    boton()!.click();
    expect(input()?.value).toBe('');
    expect(filas()).toHaveLength(0);
  });

  it('no ofrece lo que vive en una vista apagada', () => {
    const { navegar } = montar({ rutasDisponibles: () => ['expenses'] });
    boton()!.click();
    teclear('hipoteca');
    expect(filas()).toHaveLength(0);
    tecla('Enter');
    expect(navegar).not.toHaveBeenCalled();
  });

  it('los nombres van como TEXTO: un concepto con HTML no se interpreta', () => {
    const conHtml = { expenses: [{ _id: 'x', concepto: '<img src=x onerror=alert(1)> seguro', tipo: 'gasto', tags: [] }] } as any;
    montar({ estado: () => conHtml });
    boton()!.click();
    teclear('seguro');
    expect(overlay()?.querySelector('img')).toBeNull();
    expect(filas()[0].textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('detener retira el botón, la ventana y el atajo', () => {
    const { detener } = montar();
    boton()!.click();
    detener();
    expect(boton()).toBeNull();
    expect(overlay()).toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
    expect(overlay()).toBeNull();
  });
});
