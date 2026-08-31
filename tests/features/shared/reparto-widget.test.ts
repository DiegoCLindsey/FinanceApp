// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import {
  leerRepartoWidget,
  repartoWidget,
  resumenReparto,
  resumenRepartoDoble,
  sincronizarRepartoWidget,
} from '@/features/shared/reparto-widget';
import type { Persona, Reparto } from '@/state/schema';

const YO: Persona = { _id: 'default', nombre: 'Yo', esPorDefecto: true, activo: true };
const PAREJA: Persona = { _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true };
const GATOS: Persona = { _id: 'p3', nombre: 'Gatos', esPorDefecto: false, activo: true };
const INACTIVA: Persona = { _id: 'p4', nombre: 'Ex-compi', esPorDefecto: false, activo: false };

function montar(html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

describe('repartoWidget — cuándo se muestra', () => {
  it('con una sola persona activa, no hay widget: nada que repartir', () => {
    expect(repartoWidget('Reparto de consumo', undefined, [YO], 'consumo')).toBe('');
  });

  it('con dos o más personas activas, sí aparece', () => {
    expect(repartoWidget('Reparto de consumo', undefined, [YO, PAREJA], 'consumo')).not.toBe('');
  });

  it('una persona inactiva no cuenta para el mínimo de dos', () => {
    expect(repartoWidget('Reparto', undefined, [YO, INACTIVA], 'consumo')).toBe('');
  });

  it('una persona inactiva SÍ se lista si ya estaba en el reparto que se edita', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'default' }, { personaId: 'p4' }] };
    const html = repartoWidget('Reparto', reparto, [YO, PAREJA, INACTIVA], 'consumo');
    expect(html).toContain('Ex-compi');
  });
});

describe('leerRepartoWidget', () => {
  it('sin modo elegido, no hay reparto (undefined)', () => {
    const raiz = montar(repartoWidget('R', undefined, [YO, PAREJA], 'consumo'));
    expect(leerRepartoWidget(raiz, 'consumo')).toBeUndefined();
  });

  it('modo elegido pero nadie marcado tampoco es un reparto', () => {
    const raiz = montar(repartoWidget('R', undefined, [YO, PAREJA], 'consumo'));
    (raiz.querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement).value = 'partesIguales';
    expect(leerRepartoWidget(raiz, 'consumo')).toBeUndefined();
  });

  it('partes iguales con dos personas marcadas', () => {
    const raiz = montar(repartoWidget('R', undefined, [YO, PAREJA], 'consumo'));
    (raiz.querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement).value = 'partesIguales';
    raiz.querySelectorAll<HTMLInputElement>('.reparto-persona').forEach((c) => (c.checked = true));
    expect(leerRepartoWidget(raiz, 'consumo')).toEqual({
      modo: 'partesIguales',
      participantes: [{ personaId: 'default' }, { personaId: 'p2' }],
    });
  });

  it('porcentaje: lee el valor tecleado por participante', () => {
    const raiz = montar(repartoWidget('R', undefined, [YO, PAREJA], 'pago'));
    (raiz.querySelector('[data-reparto-modo="pago"]') as HTMLSelectElement).value = 'porcentaje';
    const chkPareja = raiz.querySelector<HTMLInputElement>('.reparto-persona[value="p2"]')!;
    chkPareja.checked = true;
    (raiz.querySelector('[data-reparto-valor="pago"][data-persona="p2"]') as HTMLInputElement).value = '100';
    expect(leerRepartoWidget(raiz, 'pago')).toEqual({ modo: 'porcentaje', participantes: [{ personaId: 'p2', valor: 100 }] });
  });

  it('un valor no numérico se omite (queda sin valor, no NaN)', () => {
    const raiz = montar(repartoWidget('R', undefined, [YO, PAREJA], 'consumo'));
    (raiz.querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement).value = 'importe';
    const chk = raiz.querySelector<HTMLInputElement>('.reparto-persona[value="p2"]')!;
    chk.checked = true;
    (raiz.querySelector('[data-reparto-valor="consumo"][data-persona="p2"]') as HTMLInputElement).value = '';
    expect(leerRepartoWidget(raiz, 'consumo')).toEqual({ modo: 'importe', participantes: [{ personaId: 'p2' }] });
  });

  it('dos widgets (consumo y pago) en el mismo contenedor no se pisan', () => {
    const raiz = montar(
      repartoWidget('Consumo', undefined, [YO, PAREJA], 'consumo') + repartoWidget('Pago', undefined, [YO, PAREJA], 'pago'),
    );
    (raiz.querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement).value = 'partesIguales';
    raiz.querySelectorAll<HTMLInputElement>('[data-reparto-persona="consumo"]').forEach((c) => (c.checked = true));
    (raiz.querySelector('[data-reparto-modo="pago"]') as HTMLSelectElement).value = 'porcentaje';
    const chkPagoPareja = raiz.querySelector<HTMLInputElement>('[data-reparto-persona="pago"][value="p2"]')!;
    chkPagoPareja.checked = true;
    (raiz.querySelector('[data-reparto-valor="pago"][data-persona="p2"]') as HTMLInputElement).value = '100';

    expect(leerRepartoWidget(raiz, 'consumo')).toEqual({
      modo: 'partesIguales',
      participantes: [{ personaId: 'default' }, { personaId: 'p2' }],
    });
    expect(leerRepartoWidget(raiz, 'pago')).toEqual({ modo: 'porcentaje', participantes: [{ personaId: 'p2', valor: 100 }] });
  });

  it('sin widget en el DOM, devuelve undefined en vez de lanzar', () => {
    const raiz = montar('<div>vacío</div>');
    expect(leerRepartoWidget(raiz, 'consumo')).toBeUndefined();
  });
});

describe('sincronizarRepartoWidget', () => {
  it('oculta los participantes cuando el modo vuelve a "sin reparto"', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'default' }, { personaId: 'p2' }] };
    const raiz = montar(repartoWidget('R', reparto, [YO, PAREJA], 'consumo'));
    expect((raiz.querySelector('[data-reparto-participantes="consumo"]') as HTMLElement).style.display).toBe('');

    (raiz.querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement).value = '';
    sincronizarRepartoWidget(raiz, 'consumo');
    expect((raiz.querySelector('[data-reparto-participantes="consumo"]') as HTMLElement).style.display).toBe('none');
  });

  it('muestra los inputs de valor solo en porcentaje/importe', () => {
    const raiz = montar(repartoWidget('R', undefined, [YO, PAREJA], 'consumo'));
    const valorInput = () => raiz.querySelector('[data-reparto-valor="consumo"]') as HTMLElement;

    (raiz.querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement).value = 'partesIguales';
    sincronizarRepartoWidget(raiz, 'consumo');
    expect(valorInput().style.display).toBe('none');

    (raiz.querySelector('[data-reparto-modo="consumo"]') as HTMLSelectElement).value = 'porcentaje';
    sincronizarRepartoWidget(raiz, 'consumo');
    expect(valorInput().style.display).toBe('');
  });

  it('sin widget en el DOM no lanza', () => {
    const raiz = montar('<div>vacío</div>');
    expect(() => sincronizarRepartoWidget(raiz, 'consumo')).not.toThrow();
  });
});

describe('resumenReparto / resumenRepartoDoble', () => {
  const personas = [YO, PAREJA, GATOS];

  it('sin reparto, resumen vacío', () => {
    expect(resumenReparto(undefined, personas)).toBe('');
  });

  it('con reparto, lista nombres y el modo', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'default' }, { personaId: 'p2' }] };
    expect(resumenReparto(reparto, personas)).toBe('Yo, Pareja (partes iguales)');
  });

  it('un id de persona que ya no existe se muestra como "?"', () => {
    const reparto: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'borrada', valor: 100 }] };
    expect(resumenReparto(reparto, personas)).toBe('? (%)');
  });

  it('resumenRepartoDoble: ambos vacíos → vacío', () => {
    expect(resumenRepartoDoble(undefined, undefined, personas)).toBe('');
  });

  it('resumenRepartoDoble: el ejemplo del pedido — paga uno, consumen dos', () => {
    // "yo pago el 100% de la luz y lo consumimos mi pareja y yo"
    const pago: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'default', valor: 100 }] };
    const consumo: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'default' }, { personaId: 'p2' }] };
    expect(resumenRepartoDoble(consumo, pago, personas)).toBe('Paga: Yo (%) · Consume: Yo, Pareja (partes iguales)');
  });

  it('resumenRepartoDoble: el otro ejemplo — pareja paga, los gatos consumen', () => {
    const pago: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'p2', valor: 100 }] };
    const consumo: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'p3', valor: 100 }] };
    expect(resumenRepartoDoble(consumo, pago, personas)).toBe('Paga: Pareja (%) · Consume: Gatos (%)');
  });

  it('resumenRepartoDoble: si son idénticos, se muestra una sola vez', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'default' }, { personaId: 'p2' }] };
    expect(resumenRepartoDoble(reparto, reparto, personas)).toBe('Reparto: Yo, Pareja (partes iguales)');
  });
});
