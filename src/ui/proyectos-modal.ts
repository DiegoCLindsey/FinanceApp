// ── ui/proyectos-modal ────────────────────────────────────────────────────────
// Ventana "Proyectos": varios proyectos para un mismo usuario, cada uno una
// instancia separada de FinanceApp (sus propias cuentas, gastos, préstamos...
// todo). Permite cambiar de proyecto, crear, renombrar, duplicar, eliminar, e
// importar colecciones sueltas de otro proyecto al activo.
//
// Escrita sin dependencias del código legacy: reutiliza el modal existente
// (#modal-overlay / #modal-content) si está en el DOM, igual que
// `ui/features-modal.ts`.

export interface Proyecto {
  _id: string;
  nombre: string;
  creadoEn: number;
  actualizadoEn: number;
}

/** Lo mínimo del namespace `proyectos` de `window.FinanceApp` que hace falta aquí. */
export interface ProyectosAPI {
  listar(): Proyecto[];
  activo(): Proyecto;
  colecciones: string[];
  crear(nombre: string): Proyecto;
  renombrar(id: string, nombre: string): void;
  duplicar(id: string, nombreNuevo?: string): Proyecto;
  eliminar(id: string): void;
  cambiarA(id: string): void;
  importarDesde(idOrigen: string, colecciones: string[]): { importadas: string[] };
}

export interface ProyectosModalDeps {
  proyectos: ProyectosAPI;
  document?: Document;
  /** Notificación; por defecto usa el toast legacy si existe. */
  notify?: (mensaje: string, tipo?: 'ok' | 'err' | 'warn') => void;
  confirmar?: (mensaje: string) => boolean;
  /** Recarga completa de la página — la usan cambiar y duplicar+cambiar. */
  recargarPagina?: () => void;
}

const esc = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Etiquetas legibles de las colecciones que se pueden importar de un proyecto a otro. */
const ETIQUETAS_COLECCION: Record<string, string> = {
  loans: 'Préstamos',
  expenses: 'Gastos e ingresos',
  accounts: 'Cuentas',
  nominas: 'Nóminas',
  goals: 'Objetivos (antiguo)',
  planes: 'Planes (objetivos financieros)',
  transacciones: 'Contabilidad',
  puntosControl: 'Puntos de control',
  inflacion: 'Inflación',
  tramosIRPFHistorico: 'Tramos IRPF históricos',
  tramosGananciasCapitalHistorico: 'Tramos de ganancias históricos',
  escenarios: 'Supuestos',
  personas: 'Personas',
};

function etiquetaColeccion(col: string): string {
  return ETIQUETAS_COLECCION[col] ?? col;
}

function notificar(deps: ProyectosModalDeps, mensaje: string, tipo: 'ok' | 'err' | 'warn' = 'ok') {
  if (deps.notify) return deps.notify(mensaje, tipo);
  const legacy = (globalThis as { UI?: { toast?: (m: string, t?: string) => void } }).UI;
  if (legacy?.toast) return legacy.toast(mensaje, tipo);
  console.info('[FinanceApp]', mensaje);
}

function confirmarAccion(deps: ProyectosModalDeps, mensaje: string): boolean {
  if (deps.confirmar) return deps.confirmar(mensaje);
  const legacy = (globalThis as { UI?: { confirm?: (m: string) => boolean } }).UI;
  if (legacy?.confirm) return legacy.confirm(mensaje);
  return typeof confirm === 'function' ? confirm(mensaje) : true;
}

function recargar(deps: ProyectosModalDeps) {
  if (deps.recargarPagina) return deps.recargarPagina();
  location.reload();
}

/** Re-sincroniza el mundo legacy tras un cambio de datos que no recarga la página (solo el import). */
function refrescarTrasImportar() {
  const g = globalThis as { State?: { load?: () => unknown }; Router?: { rerender?: () => void } };
  g.State?.load?.();
  g.Router?.rerender?.();
}

/** Contenedor del modal: el legacy si existe, o uno propio creado al vuelo. */
function obtenerHost(doc: Document): { overlay: HTMLElement; content: HTMLElement } {
  const legacyOverlay = doc.getElementById('modal-overlay');
  const legacyContent = doc.getElementById('modal-content');
  if (legacyOverlay && legacyContent) return { overlay: legacyOverlay, content: legacyContent };
  let overlay = doc.getElementById('fa-proyectos-overlay');
  if (!overlay) {
    overlay = doc.createElement('div');
    overlay.id = 'fa-proyectos-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>';
    doc.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay?.classList.add('hidden');
    });
    overlay.querySelector('[data-proyectos-close]')?.addEventListener('click', () => overlay?.classList.add('hidden'));
  }
  return { overlay, content: doc.getElementById('fa-proyectos-content') as HTMLElement };
}

function filaProyecto(p: Proyecto, idActivo: string): string {
  const activo = p._id === idActivo;
  const esDefecto = p._id === 'default';
  return `
    <div class="dm-section" data-proyecto-fila="${esc(p._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${esc(p.nombre)}
        </div>
        ${activo ? '<span class="dm-badge dm-badge--local">Activo</span>' : ''}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${activo ? '' : `<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${esc(p._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${esc(p._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${esc(p._id)}">Duplicar</button>
        ${
          esDefecto || activo
            ? ''
            : `<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${esc(p._id)}">Eliminar</button>`
        }
      </div>
    </div>`;
}

function seccionImportar(proyectos: Proyecto[], idActivo: string, colecciones: string[]): string {
  const otros = proyectos.filter((p) => p._id !== idActivo);
  if (otros.length === 0) return '';
  const opciones = otros.map((p) => `<option value="${esc(p._id)}">${esc(p.nombre)}</option>`).join('');
  const checks = colecciones
    .map(
      (c) => `
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${esc(c)}"/> ${esc(etiquetaColeccion(c))}
      </label>`,
    )
    .join('');
  return `
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Importar de otro proyecto</span></div>
      <div style="font-size:11px;color:var(--text3);line-height:1.5;margin-bottom:10px">
        Trae colecciones de otro proyecto al activo, con ids nuevos — se añaden a
        lo que ya hay, no lo sustituyen. Si importas gastos o préstamos que
        dependen de una cuenta, importa también esa cuenta para que la
        referencia no se quede suelta.
      </div>
      <label class="form-label" style="font-size:11px">Desde</label>
      <select id="proyecto-import-origen" class="auth-input" style="margin:4px 0 10px">${opciones}</select>
      <div style="max-height:180px;overflow-y:auto;border:1px solid var(--hairline-soft);border-radius:8px;padding:6px 10px;margin-bottom:10px">
        ${checks}
      </div>
      <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-import-btn">Importar</button>
    </div>`;
}

function seccionNuevo(): string {
  return `
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`;
}

export function createProyectosModal(deps: ProyectosModalDeps) {
  const doc = deps.document ?? document;
  const { proyectos } = deps;

  function cuerpoHtml(): string {
    const lista = proyectos.listar();
    const idActivo = proyectos.activo()._id;
    return `
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${lista.map((p) => filaProyecto(p, idActivo)).join('')}
      </div>
      ${seccionNuevo()}
      ${seccionImportar(lista, idActivo, proyectos.colecciones)}`;
  }

  function render(content: HTMLElement) {
    content.innerHTML = `<div class="modal-title">Proyectos</div>${cuerpoHtml()}`;
    cablear(content);
  }

  function cablear(content: HTMLElement) {
    content.querySelectorAll<HTMLButtonElement>('[data-proyecto-accion]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.proyectoId as string;
        const accion = btn.dataset.proyectoAccion;
        const p = proyectos.listar().find((x) => x._id === id);
        if (!p) return;

        if (accion === 'cambiar') {
          if (!confirmarAccion(deps, `¿Cambiar a "${p.nombre}"? Se recargará la página.`)) return;
          proyectos.cambiarA(id);
          recargar(deps);
          return;
        }

        if (accion === 'renombrar') {
          const nuevo = typeof prompt === 'function' ? prompt('Nuevo nombre', p.nombre) : null;
          if (!nuevo || !nuevo.trim()) return;
          proyectos.renombrar(id, nuevo.trim());
          notificar(deps, 'Proyecto renombrado');
          render(content);
          return;
        }

        if (accion === 'duplicar') {
          const nombreSugerido = `${p.nombre} (copia)`;
          const nuevo = typeof prompt === 'function' ? prompt('Nombre de la copia', nombreSugerido) : nombreSugerido;
          if (nuevo === null) return;
          const copia = proyectos.duplicar(id, nuevo.trim() || nombreSugerido);
          notificar(deps, `"${copia.nombre}" creado como copia de "${p.nombre}" ✓`);
          render(content);
          return;
        }

        if (accion === 'eliminar') {
          if (!confirmarAccion(deps, `¿Eliminar "${p.nombre}"? Se borran todos sus datos y no se puede deshacer.`)) return;
          try {
            proyectos.eliminar(id);
            notificar(deps, `"${p.nombre}" eliminado`);
            render(content);
          } catch (e) {
            notificar(deps, (e as Error).message, 'err');
          }
        }
      });
    });

    content.querySelector('#proyecto-nuevo-btn')?.addEventListener('click', () => {
      const input = content.querySelector<HTMLInputElement>('#proyecto-nuevo-nombre');
      const nombre = input?.value.trim();
      if (!nombre) {
        notificar(deps, 'Ponle un nombre al proyecto', 'warn');
        return;
      }
      const nuevo = proyectos.crear(nombre);
      notificar(deps, `"${nuevo.nombre}" creado ✓`);
      render(content);
    });

    content.querySelector('#proyecto-import-btn')?.addEventListener('click', () => {
      const origen = content.querySelector<HTMLSelectElement>('#proyecto-import-origen')?.value;
      if (!origen) return;
      const seleccionadas = [...content.querySelectorAll<HTMLInputElement>('[data-proyecto-import-col]:checked')].map(
        (i) => i.dataset.proyectoImportCol as string,
      );
      if (seleccionadas.length === 0) {
        notificar(deps, 'Elige al menos una colección para importar', 'warn');
        return;
      }
      const { importadas } = proyectos.importarDesde(origen, seleccionadas);
      if (importadas.length === 0) {
        notificar(deps, 'El proyecto de origen no tenía nada en esas colecciones', 'warn');
        return;
      }
      notificar(deps, `Importado: ${importadas.map(etiquetaColeccion).join(', ')} ✓`);
      refrescarTrasImportar();
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
