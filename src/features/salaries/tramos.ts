// ── features/salaries/tramos ──────────────────────────────────────────────────
// Editor de las tablas de tramos marginales del IRPF por ejercicio fiscal.
//
// Hay una tabla "por defecto" (config.tramos_irpf) y, opcionalmente, una por
// año en `tramosIRPFHistorico`. Un año sin tabla propia usa la más reciente
// anterior, y si no hay ninguna, la de por defecto (ver core/tax/tables).

import { TRAMOS_IRPF_DEFAULT, type Tramos } from '@/core/tax/irpf';
import type { AppConfig, TablaFiscalAnual } from '@/state/schema';
import { confirmar, esc, onClick, toast } from '../accounting/dom';

export interface TramosStoreLike {
  get(key: 'config'): AppConfig;
  get(key: 'tramosIRPFHistorico'): TablaFiscalAnual[];
  set(key: 'tramosIRPFHistorico', value: TablaFiscalAnual[]): void;
  patchConfig(patch: Partial<AppConfig>): void;
}

export interface TramosModalDeps {
  store: TramosStoreLike;
  onDatosCambiados: () => void;
  /** Año de referencia para el placeholder del formulario. */
  año: () => number;
}

/** Qué se está editando: la lista, la tabla por defecto, o un ejercicio. */
type Edicion = null | 'default' | number;

const resumen = (t: Tramos) =>
  t
    .slice(0, 3)
    .map(([, p]) => `${p}%`)
    .join(' · ') + (t.length > 3 ? ' …' : '');

export function createTramosModal(deps: TramosModalDeps) {
  let editando: Edicion = null;
  /** Filas en edición; se sincronizan con el DOM antes de añadir o quitar. */
  let filas: Tramos = [];

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrar = () => overlay()?.classList.add('hidden');
  const porDefecto = (): Tramos => deps.store.get('config').tramos_irpf ?? TRAMOS_IRPF_DEFAULT;

  function abrirModal(titulo: string, html: string): HTMLElement | null {
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return null;
    el.innerHTML = `<div class="modal-title">${esc(titulo)}</div>${html}`;
    ov.classList.remove('hidden');
    onClick(el, '[data-cerrar]', cerrar);
    return el;
  }

  // ── Lista de ejercicios ─────────────────────────────────────────────────────

  function abrir(): void {
    editando = null;
    const historico = [...deps.store.get('tramosIRPFHistorico')].sort((a, b) => a.año - b.año);
    const estiloFila =
      'display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center';

    const el = abrirModal(
      'Tramos IRPF por ejercicio',
      `
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${estiloFila}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${esc(resumen(porDefecto()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${historico
          .map(
            (e) => `<div style="${estiloFila}">
              <span style="font-weight:600;font-size:13px">${e.año}</span>
              <span class="text-sm" style="color:var(--text2)">${esc(resumen(e.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${e.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${e.año}">✕</button>
              </div>
            </div>`,
          )
          .join('')}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${deps.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`,
    );
    if (!el) return;

    onClick(el, '[data-editar-tabla]', (btn) => {
      const v = btn.getAttribute('data-editar-tabla') as string;
      abrirEditor(v === 'default' ? 'default' : Number(v));
    });
    onClick(el, '[data-borrar-tabla]', (btn) => {
      const año = Number(btn.getAttribute('data-borrar-tabla'));
      if (!confirmar(`¿Eliminar la tabla del ejercicio ${año}?`)) return;
      deps.store.set(
        'tramosIRPFHistorico',
        deps.store.get('tramosIRPFHistorico').filter((e) => e.año !== año),
      );
      toast(`Tabla ${año} eliminada`);
      deps.onDatosCambiados();
      abrir();
    });
    onClick(el, '[data-anadir-anyo]', () => {
      const año = parseInt((el.querySelector('#irpf-new-year') as HTMLInputElement | null)?.value ?? '', 10);
      if (!año || año < 2000 || año > 2100) return toast('Año inválido', 'err');
      const historicoActual = deps.store.get('tramosIRPFHistorico');
      if (historicoActual.some((e) => e.año === año)) return toast('Ya existe una tabla para ese año', 'err');
      deps.store.set('tramosIRPFHistorico', [
        ...historicoActual,
        { _id: Date.now().toString(36), año, tramos: porDefecto().map((t) => [...t] as [number, number]) },
      ]);
      deps.onDatosCambiados();
      abrirEditor(año);
    });
  }

  // ── Editor de una tabla ─────────────────────────────────────────────────────

  function filasHtml(): string {
    return filas
      .map(
        ([desde, pct], i) => `<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${i}" value="${desde}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${i}" value="${pct}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${i}">✕</button>
          </div>
        </div>`,
      )
      .join('');
  }

  /** Vuelca lo escrito en el DOM a `filas`, para no perderlo al repintar. */
  function sincronizar(el: HTMLElement): void {
    const mins = [...el.querySelectorAll<HTMLInputElement>('[data-tr-min]')];
    filas = mins.map((input, i) => {
      const pct = el.querySelector<HTMLInputElement>(`[data-tr-pct="${i}"]`);
      return [parseFloat(input.value) || 0, parseFloat(pct?.value ?? '') || 0] as [number, number];
    });
  }

  function abrirEditor(cual: Exclude<Edicion, null>): void {
    editando = cual;
    const historico = deps.store.get('tramosIRPFHistorico');
    const origen = cual === 'default' ? porDefecto() : (historico.find((e) => e.año === cual)?.tramos ?? porDefecto());
    filas = origen.map((t) => [...t] as [number, number]);

    const etiqueta = cual === 'default' ? 'tabla por defecto' : `ejercicio ${cual}`;
    const el = abrirModal(
      `Tramos IRPF — ${cual === 'default' ? 'Por defecto' : cual}`,
      `
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${esc(etiqueta)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${filasHtml()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`,
    );
    if (!el) return;

    const repintar = () => {
      const cont = el.querySelector('#irpf-tramos-rows');
      if (cont) cont.innerHTML = filasHtml();
    };
    onClick(el, '[data-volver]', abrir);
    onClick(el, '[data-tr-anadir]', () => {
      sincronizar(el);
      filas.push([0, 0]);
      repintar();
    });
    onClick(el, '[data-tr-borrar]', (btn) => {
      sincronizar(el);
      filas.splice(Number(btn.getAttribute('data-tr-borrar')), 1);
      repintar();
    });
    onClick(el, '[data-tr-guardar]', () => {
      sincronizar(el);
      const ordenados = [...filas].sort((a, b) => a[0] - b[0]);
      if (ordenados.length === 0) return toast('Añade al menos un tramo', 'err');

      if (editando === 'default') {
        deps.store.patchConfig({ tramos_irpf: ordenados });
        toast('Tabla por defecto guardada');
      } else {
        deps.store.set(
          'tramosIRPFHistorico',
          deps.store.get('tramosIRPFHistorico').map((e) => (e.año === editando ? { ...e, tramos: ordenados } : e)),
        );
        toast(`Tabla ${editando} guardada`);
      }
      deps.onDatosCambiados();
      abrir();
    });
  }

  return { abrir };
}
