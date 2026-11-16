// @vitest-environment happy-dom
//
// BUG-25: `#modal-content` vive toda la sesión y cada apertura de formulario le
// añadía listeners sin quitar los anteriores, así que «Guardar» creaba tantas
// copias como modales se hubieran abierto desde la última recarga.
import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createExpensesFeature } from '@/features/expenses';
import { createLoansFeature } from '@/features/loans';
import { contenedorModalLimpio, onClick } from '@/features/accounting/dom';

function montarShell(): HTMLElement {
  document.body.innerHTML = `
    <div id="toast-container"></div>
    <div id="vista"></div>
    <div id="modal-overlay" class="hidden"><div id="modal-box"><div id="modal-content"></div></div></div>`;
  return document.getElementById('vista') as HTMLElement;
}

const pulsar = (sel: string) => (document.querySelector(sel) as HTMLElement).click();
const escribir = (sel: string, v: string) => ((document.querySelector(sel) as HTMLInputElement).value = v);

describe('los formularios en modal guardan una sola vez', () => {
  let vista: HTMLElement;
  beforeEach(() => {
    vista = montarShell();
  });

  it('contenedorModalLimpio suelta los listeners de la apertura anterior', () => {
    let veces = 0;
    for (let i = 0; i < 3; i++) {
      const el = contenedorModalLimpio() as HTMLElement;
      el.innerHTML = '<button data-x>x</button>';
      onClick(el, '[data-x]', () => veces++);
    }
    pulsar('[data-x]');
    expect(veces).toBe(1);
    expect(document.querySelectorAll('#modal-content')).toHaveLength(1);
  });

  it('gasto: abrir y cancelar varias veces y crear uno deja UN gasto', () => {
    const store = createStore({ adapter: createMemoryAdapter() });
    store.load();
    createExpensesFeature({ store }).mount(vista);

    for (let i = 0; i < 5; i++) {
      pulsar('[data-nuevo]');
      pulsar('#modal-content [data-cancelar]');
    }
    for (const nombre of ['Luz', 'Agua', 'Gas']) {
      pulsar('[data-nuevo]');
      escribir('#ef-concepto', nombre);
      escribir('#ef-cuantia', '10');
      pulsar('#modal-content [data-guardar]');
    }
    expect(store.get('expenses').map((e) => e.concepto)).toEqual(['Luz', 'Agua', 'Gas']);
  });

  it('préstamo: el tercero de la sesión se crea una sola vez', () => {
    const store = createStore({ adapter: createMemoryAdapter() });
    store.load();
    createLoansFeature({ store }).mount(vista);
    const botonNuevo = [...vista.querySelectorAll('button')].find((b) => /nuevo/i.test(b.textContent ?? '')) as HTMLElement;

    for (let i = 0; i < 3; i++) {
      botonNuevo.click();
      const modal = document.getElementById('modal-content') as HTMLElement;
      const campos = [...modal.querySelectorAll<HTMLInputElement>('input')];
      for (const c of campos) {
        if (c.type === 'text') c.value = `Préstamo ${i}`;
        else if (c.type === 'number' && !c.value) c.value = '12';
      }
      (modal.querySelector('[data-guardar-loan]') as HTMLElement).click();
    }
    expect(store.get('loans')).toHaveLength(3);
    const nombres = store.get('loans').map((l) => l.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
  });
});
