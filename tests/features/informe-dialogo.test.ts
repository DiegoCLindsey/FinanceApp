// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { abrirCrearInforme, periodoDe } from '@/features/informe/dialogo';

const HOY = '2026-11-20';

describe('periodoDe', () => {
  it('cada opción da su periodo', () => {
    expect(periodoDe('alrededor', HOY)).toEqual({ desde: '2026-05-01', hasta: '2027-05-31' });
    expect(periodoDe('ultimos12', HOY)).toEqual({ desde: '2025-12-01', hasta: HOY });
    expect(periodoDe('anio', HOY)).toEqual({ desde: '2026-01-01', hasta: '2026-12-31' });
    expect(periodoDe('proximos12', HOY)).toEqual({ desde: '2026-11-21', hasta: '2027-11-30' });
  });
  it('el personalizado ordena las fechas y, sin ellas, usa el de por defecto', () => {
    expect(periodoDe('personalizado', HOY, '2027-01-01', '2026-03-01')).toEqual({ desde: '2026-03-01', hasta: '2027-01-01' });
    expect(periodoDe('personalizado', HOY)).toEqual(periodoDe('alrededor', HOY));
  });
});

describe('ventana «Crear informe»', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="toast-container"></div><div id="modal-overlay" class="hidden"><div id="modal-box"><div id="modal-content"></div></div></div>`;
    URL.createObjectURL = vi.fn(() => 'blob:informe');
    URL.revokeObjectURL = vi.fn();
  });

  it('abre el informe del periodo elegido en una pestaña', () => {
    const construir = vi.fn(() => '<!doctype html><title>x</title>');
    const open = vi.fn(() => ({}) as Window);
    abrirCrearInforme({ construir, hoy: HOY, proyecto: 'Mis finanzas', win: { open } });
    const radio = document.querySelector('input[value="ultimos12"]') as HTMLInputElement;
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    (document.querySelector('[data-inf-ver]') as HTMLElement).click();
    expect(construir).toHaveBeenCalledWith('2025-12-01', HOY);
    expect(open).toHaveBeenCalledWith('blob:informe', '_blank');
  });

  it('si el navegador bloquea la pestaña, lo descarga', () => {
    const clicks: string[] = [];
    const original = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      clicks.push(this.download);
    };
    try {
      abrirCrearInforme({ construir: () => '<!doctype html>', hoy: HOY, proyecto: 'Casa de Ana', win: { open: () => null } });
      (document.querySelector('[data-inf-ver]') as HTMLElement).click();
    } finally {
      HTMLAnchorElement.prototype.click = original;
    }
    // La ventana recuerda el último periodo elegido: aquí, el del test anterior.
    expect(clicks).toEqual(['informe-casa-de-ana-2025-12-01-a-2026-11-20.html']);
  });
});
