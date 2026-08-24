// ── ui/deshacer ───────────────────────────────────────────────────────────────
// El aviso flotante con el botón «Deshacer».
//
// La lógica de qué se puede deshacer vive en `state/deshacer` y el registro en
// `store.removeItem`; aquí solo está la parte que se ve. Se engancha a las
// notificaciones del store, así que **ninguna pantalla tiene que acordarse de
// llamar a nada**: basta con que borre por `store.removeItem`, que es lo que ya
// hacen las doce.

import { describirItem, type BorradoRegistrado } from '@/state/deshacer';

export interface DepsDeshacer {
  store: {
    subscribe(listener: (key: string) => void): () => void;
    borradoPendiente(): BorradoRegistrado | null;
    deshacerBorrado(): BorradoRegistrado | null;
  };
  /** Dónde se cuelga el aviso. Por defecto, el contenedor del shell. */
  contenedor?: () => HTMLElement | null;
  /** Repintar la vista actual tras restaurar. */
  rerender?: () => void;
  /** Cuánto se enseña el aviso. Debe caber en la ventana de `state/deshacer`. */
  duracionMs?: number;
}

const CLASE = 'toast toast-deshacer';

/**
 * Enseña «X eliminado · Deshacer» cada vez que se borra algo.
 *
 * Devuelve la función para desengancharlo.
 */
export function instalarDeshacer(deps: DepsDeshacer): () => void {
  const { store, rerender, duracionMs = 12_000 } = deps;
  const contenedor = deps.contenedor ?? (() => document.getElementById('toast-container'));

  let visible: HTMLElement | null = null;
  let temporizador: ReturnType<typeof setTimeout> | null = null;
  // Qué borrado está ya anunciado. Sin esto, cualquier `set` posterior sobre
  // otra colección volvería a levantar el mismo aviso.
  let anunciado: BorradoRegistrado | null = null;

  function quitar() {
    if (temporizador) clearTimeout(temporizador);
    temporizador = null;
    visible?.remove();
    visible = null;
  }

  function mostrar(borrado: BorradoRegistrado) {
    const host = contenedor();
    if (!host) return;
    quitar();

    const el = document.createElement('div');
    el.className = CLASE;
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.gap = '12px';

    const texto = document.createElement('span');
    // textContent, no innerHTML: el nombre lo escribe el usuario.
    texto.textContent = `${describirItem(borrado.col, borrado.item)} se ha eliminado.`;
    texto.style.flex = '1';

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'btn-secondary btn-sm';
    boton.textContent = 'Deshacer';
    boton.style.flexShrink = '0';
    boton.addEventListener('click', () => {
      const restaurado = store.deshacerBorrado();
      quitar();
      if (!restaurado) return;
      // El aviso de vuelta se pinta solo si hay dónde: si el contenedor ha
      // desaparecido con un cambio de vista, no pasa nada.
      const host2 = contenedor();
      if (host2) {
        const ok = document.createElement('div');
        ok.className = 'toast toast-ok';
        ok.textContent = 'Deshecho.';
        host2.appendChild(ok);
        setTimeout(() => ok.remove(), 2500);
      }
      rerender?.();
    });

    el.appendChild(texto);
    el.appendChild(boton);
    host.appendChild(el);
    visible = el;
    temporizador = setTimeout(quitar, duracionMs);
  }

  const desuscribir = store.subscribe(() => {
    const pendiente = store.borradoPendiente();
    if (!pendiente) {
      // Ya no hay nada que deshacer (se deshizo o caducó): fuera el aviso.
      anunciado = null;
      quitar();
      return;
    }
    if (pendiente === anunciado) return;
    anunciado = pendiente;
    mostrar(pendiente);
  });

  return () => {
    desuscribir();
    quitar();
  };
}
