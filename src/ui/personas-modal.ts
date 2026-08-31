// ── ui/personas-modal ─────────────────────────────────────────────────────────
// Ventana "Personas": quién hay en el proyecto, para poder repartir gastos,
// nóminas y préstamos entre varias. A diferencia de "Proyectos", personas SÍ
// es una colección normal de `AppState` — vive en el store, viaja en las
// copias de seguridad, no exige recargar la página para nada.
//
// Reutiliza el modal compartido (#modal-overlay / #modal-content), igual que
// `ui/proyectos-modal.ts` y `ui/features-modal.ts`.

import type { Persona } from '@/state/schema';

/** Paleta compartida con `features/scenarios` — mismo criterio de color en toda la app. */
export const COLORES_PERSONA = ['#2ee6a8', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

export interface PersonasStoreLike {
  get(key: 'personas'): Persona[];
  set(key: 'personas', value: Persona[]): void;
  addItem(col: 'personas', item: Omit<Persona, '_id'> & { _id?: string }): Persona;
  updateItem(col: 'personas', id: string, patch: Partial<Persona>): void;
  removeItem(col: 'personas', id: string): void;
}

export interface PersonasModalDeps {
  store: PersonasStoreLike;
  /** Se llama tras cualquier cambio, para que quien tenga abierta una vista con personas se refresque. */
  onDatosCambiados?: () => void;
  document?: Document;
  notify?: (mensaje: string, tipo?: 'ok' | 'err' | 'warn') => void;
  confirmar?: (mensaje: string) => boolean;
}

const esc = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function notificar(deps: PersonasModalDeps, mensaje: string, tipo: 'ok' | 'err' | 'warn' = 'ok') {
  if (deps.notify) return deps.notify(mensaje, tipo);
  const legacy = (globalThis as { UI?: { toast?: (m: string, t?: string) => void } }).UI;
  if (legacy?.toast) return legacy.toast(mensaje, tipo);
  console.info('[FinanceApp]', mensaje);
}

function confirmarAccion(deps: PersonasModalDeps, mensaje: string): boolean {
  if (deps.confirmar) return deps.confirmar(mensaje);
  const legacy = (globalThis as { UI?: { confirm?: (m: string) => boolean } }).UI;
  if (legacy?.confirm) return legacy.confirm(mensaje);
  return typeof confirm === 'function' ? confirm(mensaje) : true;
}

function obtenerHost(doc: Document): { overlay: HTMLElement; content: HTMLElement } {
  const legacyOverlay = doc.getElementById('modal-overlay');
  const legacyContent = doc.getElementById('modal-content');
  if (legacyOverlay && legacyContent) return { overlay: legacyOverlay, content: legacyContent };
  let overlay = doc.getElementById('fa-personas-overlay');
  if (!overlay) {
    overlay = doc.createElement('div');
    overlay.id = 'fa-personas-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>';
    doc.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay?.classList.add('hidden');
    });
    overlay.querySelector('[data-personas-close]')?.addEventListener('click', () => overlay?.classList.add('hidden'));
  }
  return { overlay, content: doc.getElementById('fa-personas-content') as HTMLElement };
}

function filaPersona(p: Persona): string {
  const color = p.color || COLORES_PERSONA[0];
  return `
    <div class="dm-section" data-persona-fila="${esc(p._id)}" style="padding:12px 15px;${p.activo ? '' : 'opacity:.55'}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${esc(color)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${esc(p.nombre)}
        </div>
        ${p.esPorDefecto ? '<span class="dm-badge dm-badge--local">Por defecto</span>' : ''}
        ${p.activo ? '' : '<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${esc(p._id)}">Renombrar</button>
        ${
          p.esPorDefecto
            ? ''
            : `<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${esc(p._id)}">Hacer por defecto</button>`
        }
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${esc(p._id)}">${p.activo ? 'Desactivar' : 'Activar'}</button>
        ${
          p.esPorDefecto
            ? ''
            : `<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${esc(p._id)}">Eliminar</button>`
        }
      </div>
    </div>`;
}

function seccionNueva(): string {
  return `
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${COLORES_PERSONA.map(
            (c, i) =>
              `<div data-persona-color="${c}" style="width:22px;height:22px;border-radius:50%;background:${c};cursor:pointer;
                border:2px solid ${i === 0 ? 'white' : 'transparent'}"></div>`,
          ).join('')}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${COLORES_PERSONA[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`;
}

export function createPersonasModal(deps: PersonasModalDeps) {
  const doc = deps.document ?? document;
  const { store } = deps;

  function cuerpoHtml(): string {
    const lista = store.get('personas');
    return `
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${lista.map(filaPersona).join('')}
      </div>
      ${seccionNueva()}`;
  }

  function render(content: HTMLElement) {
    content.innerHTML = `<div class="modal-title">Personas</div>${cuerpoHtml()}`;
    cablear(content);
  }

  function notificarCambio() {
    deps.onDatosCambiados?.();
  }

  function cablear(content: HTMLElement) {
    content.querySelectorAll<HTMLButtonElement>('[data-persona-accion]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.personaId as string;
        const accion = btn.dataset.personaAccion;
        const lista = store.get('personas');
        const p = lista.find((x) => x._id === id);
        if (!p) return;

        if (accion === 'renombrar') {
          const nuevo = typeof prompt === 'function' ? prompt('Nuevo nombre', p.nombre) : null;
          if (!nuevo || !nuevo.trim()) return;
          store.updateItem('personas', id, { nombre: nuevo.trim() });
          notificar(deps, 'Persona renombrada');
          notificarCambio();
          render(content);
          return;
        }

        if (accion === 'defecto') {
          store.set(
            'personas',
            lista.map((x) => ({ ...x, esPorDefecto: x._id === id })),
          );
          notificar(deps, `"${p.nombre}" es ahora la persona por defecto`);
          notificarCambio();
          render(content);
          return;
        }

        if (accion === 'activo') {
          store.updateItem('personas', id, { activo: !p.activo });
          notificarCambio();
          render(content);
          return;
        }

        if (accion === 'eliminar') {
          if (lista.length <= 1) {
            notificar(deps, 'No se puede eliminar la única persona del proyecto.', 'err');
            return;
          }
          if (!confirmarAccion(deps, `¿Eliminar "${p.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`)) return;
          store.removeItem('personas', id);
          notificar(deps, `"${p.nombre}" eliminada`);
          notificarCambio();
          render(content);
        }
      });
    });

    const colorInput = content.querySelector<HTMLInputElement>('#persona-nuevo-color');
    content.querySelectorAll<HTMLElement>('[data-persona-color]').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const elegido = swatch.getAttribute('data-persona-color') as string;
        if (colorInput) colorInput.value = elegido;
        content.querySelectorAll<HTMLElement>('[data-persona-color]').forEach((s) => {
          s.style.border = s.getAttribute('data-persona-color') === elegido ? '2px solid white' : '2px solid transparent';
        });
      });
    });

    content.querySelector('#persona-nuevo-btn')?.addEventListener('click', () => {
      const input = content.querySelector<HTMLInputElement>('#persona-nuevo-nombre');
      const nombre = input?.value.trim();
      if (!nombre) {
        notificar(deps, 'Ponle un nombre a la persona', 'warn');
        return;
      }
      const color = colorInput?.value || COLORES_PERSONA[0];
      const nueva = store.addItem('personas', { nombre, color, esPorDefecto: false, activo: true });
      notificar(deps, `"${nueva.nombre}" creada ✓`);
      notificarCambio();
      render(content);
    });
  }

  function open() {
    const host = obtenerHost(doc);
    render(host.content);
    host.overlay.classList.remove('hidden');
  }

  return { open, renderInto: render };
}
