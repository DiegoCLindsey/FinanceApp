// ── ui/buscador ───────────────────────────────────────────────────────────────
// La ventana de búsqueda global. Lo que decide qué sale está en `app/buscar`.
//
// Se abre con Ctrl/⌘+K o con la lupa de la barra superior, y lleva directamente
// a la vista donde vive lo encontrado. El botón lo añade este módulo, no
// index.html: si el bundle no carga, la barra se queda como estaba en vez de
// enseñar una lupa que no hace nada.

import { buscar, type Resultado } from '@/app/buscar';
import type { AppState } from '@/state/schema';

export interface DepsBuscador {
  /** Estado actual. Se pide en cada tecla: los datos cambian mientras se usa. */
  estado: () => Partial<AppState>;
  /** Rutas visibles ahora mismo, o `null` para no filtrar. */
  rutasDisponibles?: () => string[] | null;
  navegar: (ruta: string) => void;
  doc?: Document;
}

const ID_OVERLAY = 'buscador-overlay';
const ID_BOTON = 'btn-buscador';

export function instalarBuscador(deps: DepsBuscador): () => void {
  const doc = deps.doc ?? document;
  const rutas = deps.rutasDisponibles ?? (() => null);

  let overlay: HTMLElement | null = null;
  let entrada: HTMLInputElement | null = null;
  let lista: HTMLElement | null = null;
  let resultados: Resultado[] = [];
  let activo = 0;

  function construir(): HTMLElement {
    const ov = doc.createElement('div');
    ov.id = ID_OVERLAY;
    ov.className = 'modal-overlay';
    // Alineado arriba y no centrado: la lista crece hacia abajo, y con el cuadro
    // centrado cada tecla movería el sitio donde el usuario está mirando.
    ov.style.alignItems = 'flex-start';
    ov.style.paddingTop = '10vh';

    const caja = doc.createElement('div');
    caja.className = 'modal-box';
    caja.style.maxWidth = '560px';
    caja.style.padding = '14px';

    const input = doc.createElement('input');
    input.type = 'search';
    input.className = 'form-input';
    input.placeholder = 'Buscar gastos, cuentas, préstamos, movimientos…';
    input.setAttribute('aria-label', 'Buscar en toda la aplicación');
    input.autocomplete = 'off';

    const ul = doc.createElement('div');
    ul.style.marginTop = '10px';
    ul.style.maxHeight = '52vh';
    ul.style.overflowY = 'auto';

    caja.appendChild(input);
    caja.appendChild(ul);
    ov.appendChild(caja);
    doc.body.appendChild(ov);

    ov.addEventListener('click', (ev) => {
      if (ev.target === ov) cerrar();
    });
    input.addEventListener('input', () => {
      activo = 0;
      refrescar();
    });
    input.addEventListener('keydown', enTecla);

    overlay = ov;
    entrada = input;
    lista = ul;
    return ov;
  }

  function pintar() {
    if (!lista) return;
    lista.textContent = '';
    if (resultados.length === 0) {
      const vacio = doc.createElement('div');
      vacio.style.padding = '14px 4px';
      vacio.style.fontSize = '13px';
      vacio.style.color = 'var(--text3)';
      const q = entrada?.value.trim() ?? '';
      vacio.textContent = q.length < 2 ? 'Escribe al menos dos letras.' : 'Nada que se parezca a eso.';
      lista.appendChild(vacio);
      return;
    }

    resultados.forEach((r, i) => {
      const fila = doc.createElement('button');
      fila.type = 'button';
      fila.className = 'buscador-fila';
      fila.dataset.indice = String(i);
      if (i === activo) fila.classList.add('activa');

      const izq = doc.createElement('div');
      izq.style.minWidth = '0';
      const titulo = doc.createElement('div');
      // textContent: el nombre lo ha escrito el usuario.
      titulo.textContent = r.titulo;
      titulo.style.fontSize = '13px';
      titulo.style.overflow = 'hidden';
      titulo.style.textOverflow = 'ellipsis';
      titulo.style.whiteSpace = 'nowrap';
      const sub = doc.createElement('div');
      sub.textContent = r.detalle;
      sub.style.fontSize = '11px';
      sub.style.color = 'var(--text3)';
      sub.style.overflow = 'hidden';
      sub.style.textOverflow = 'ellipsis';
      sub.style.whiteSpace = 'nowrap';
      izq.appendChild(titulo);
      if (r.detalle) izq.appendChild(sub);

      const tipo = doc.createElement('span');
      tipo.className = 'tag';
      tipo.textContent = r.etiqueta;
      tipo.style.flexShrink = '0';

      fila.appendChild(izq);
      fila.appendChild(tipo);
      fila.addEventListener('click', () => abrir(i));
      lista!.appendChild(fila);
    });
  }

  function refrescar() {
    const q = entrada?.value ?? '';
    resultados = buscar(deps.estado(), q, { rutasDisponibles: rutas() });
    if (activo >= resultados.length) activo = Math.max(0, resultados.length - 1);
    pintar();
  }

  function mover(delta: number) {
    if (resultados.length === 0) return;
    // Da la vuelta por los dos extremos: bajar desde el último lleva al primero.
    activo = (activo + delta + resultados.length) % resultados.length;
    pintar();
    lista?.querySelector('.buscador-fila.activa')?.scrollIntoView?.({ block: 'nearest' });
  }

  function abrir(i: number) {
    const r = resultados[i];
    if (!r) return;
    cerrar();
    deps.navegar(r.ruta);
  }

  function enTecla(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      cerrar();
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      mover(1);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      mover(-1);
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      abrir(activo);
    }
  }

  function abrirVentana() {
    const ov = overlay ?? construir();
    ov.classList.remove('hidden');
    ov.style.display = '';
    activo = 0;
    if (entrada) {
      entrada.value = '';
      entrada.focus();
    }
    refrescar();
  }

  function cerrar() {
    if (!overlay) return;
    overlay.style.display = 'none';
    resultados = [];
  }

  function abierta(): boolean {
    return !!overlay && overlay.style.display !== 'none';
  }

  // ── Enganches ───────────────────────────────────────────────────────────────

  function atajo(ev: KeyboardEvent) {
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K')) {
      ev.preventDefault();
      if (abierta()) cerrar();
      else abrirVentana();
    }
  }
  doc.addEventListener('keydown', atajo);

  let boton: HTMLElement | null = null;
  function ponerBoton() {
    const barra = doc.getElementById('period-bar');
    if (!barra || doc.getElementById(ID_BOTON)) return;
    const b = doc.createElement('button');
    b.id = ID_BOTON;
    b.type = 'button';
    b.className = 'btn-secondary';
    b.title = 'Buscar en toda la aplicación (Ctrl+K)';
    b.setAttribute('aria-label', 'Buscar');
    b.textContent = '🔍 Buscar';
    // A la derecha del todo. La barra tiene `flex-wrap`, así que en móvil cae a
    // una fila propia en vez de estrujar los selectores de fecha.
    b.style.marginLeft = 'auto';
    b.addEventListener('click', abrirVentana);
    barra.appendChild(b);
    boton = b;
  }
  ponerBoton();

  return () => {
    doc.removeEventListener('keydown', atajo);
    boton?.remove();
    overlay?.remove();
    overlay = null;
    entrada = null;
    lista = null;
  };
}
