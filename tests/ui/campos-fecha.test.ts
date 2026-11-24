// @vitest-environment happy-dom
// Escribir una fecha entera: mientras se teclea, el `change` del campo se
// aguanta hasta salir de él o pulsar Intro; lo demás pasa al momento.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { instalarCamposFecha } from '@/ui/campos-fecha';

let retirar: () => void;
let campo: HTMLInputElement;
let cambios: string[];

beforeEach(() => {
  // Un contenedor nuevo en cada prueba: los manejadores no se acumulan.
  document.body.innerHTML = '<div><input type="date" value="2026-11-24"/><input type="text"/></div>';
  campo = document.querySelector('input[type="date"]') as HTMLInputElement;
  cambios = [];
  // Como las pantallas: el manejador escucha `change` en un contenedor.
  (document.body.firstElementChild as HTMLElement).addEventListener('change', (e) => cambios.push((e.target as HTMLInputElement).value));
  retirar = instalarCamposFecha(window);
});
afterEach(() => retirar());

const teclear = (tecla: string) => campo.dispatchEvent(new KeyboardEvent('keydown', { key: tecla, bubbles: true }));
const cambiar = (valor: string) => {
  campo.value = valor;
  campo.dispatchEvent(new Event('change', { bubbles: true }));
};

describe('campos de fecha', () => {
  it('mientras se teclea, el change se aguanta y sale una vez al salir del campo', () => {
    campo.focus();
    teclear('1');
    cambiar('2026-11-15');
    teclear('0');
    cambiar('2026-03-15');
    teclear('2');
    cambiar('2031-03-15');
    expect(cambios).toEqual([]);
    campo.blur();
    expect(cambios).toEqual(['2031-03-15']);
  });

  it('Intro también confirma', () => {
    campo.focus();
    teclear('5');
    cambiar('2026-11-05');
    teclear('Enter');
    expect(cambios).toEqual(['2026-11-05']);
    // y salir después no lo repite
    campo.blur();
    expect(cambios).toEqual(['2026-11-05']);
  });

  it('elegir en el calendario (sin teclear) pasa al momento', () => {
    campo.focus();
    cambiar('2027-01-10');
    expect(cambios).toEqual(['2027-01-10']);
  });

  it('un cambio sin el foco en el campo (por código) pasa al momento', () => {
    teclear('1');
    cambiar('2027-01-10');
    expect(cambios).toEqual(['2027-01-10']);
  });

  it('otros campos no se tocan', () => {
    const texto = document.querySelector('input[type="text"]') as HTMLInputElement;
    texto.focus();
    texto.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
    texto.value = 'x';
    texto.dispatchEvent(new Event('change', { bubbles: true }));
    expect(cambios).toEqual(['x']);
  });

  it('instalarlo dos veces no lo duplica', () => {
    expect(instalarCamposFecha(window)).toBe(retirar);
  });
});
