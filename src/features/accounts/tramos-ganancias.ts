// ── features/accounts/tramos-ganancias ────────────────────────────────────────
// Editor de los tramos del impuesto sobre ganancias de capital (art. 49 LIRPF),
// con tabla por defecto y tablas por ejercicio fiscal.
//
// El legacy solo dejaba editar la tabla por defecto (`config.tramosGananciasCapital`)
// aunque el motor ya resolvía `tramosGananciasCapitalHistorico` por año: la
// colección existía y no había forma de rellenarla desde la interfaz. Aquí se
// edita igual que la del IRPF (ver features/salaries/tramos.ts).

import { TRAMOS_AHORRO_DEFAULT } from '@/core/tax/ahorro';
import type { Tramos } from '@/core/tax/irpf';
import type { AppConfig, TablaFiscalAnual } from '@/state/schema';
import { confirmar, esc, onClick, toast } from '../accounting/dom';

export interface TramosGananciasStoreLike {
  get(key: 'config'): AppConfig;
  get(key: 'tramosGananciasCapitalHistorico'): TablaFiscalAnual[];
  set(key: 'tramosGananciasCapitalHistorico', value: TablaFiscalAnual[]): void;
  patchConfig(patch: Partial<AppConfig>): void;
}

export interface TramosGananciasDeps {
  store: TramosGananciasStoreLike;
  onDatosCambiados: () => void;
  año: () => number;
}

type Edicion = null | 'default' | number;

const resumen = (t: Tramos) =>
  t
    .slice(0, 3)
    .map(([, p]) => `${p}%`)
    .join(' · ') + (t.length > 3 ? ' …' : '');

export function createTramosGananciasModal(deps: TramosGananciasDeps) {
  let editando: Edicion = null;
  /** Filas en edición; se vuelcan desde el DOM antes de añadir o quitar. */
  let filas: Tramos = [];

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrar = () => overlay()?.classList.add('hidden');
  const porDefecto = (): Tramos => deps.store.get('config').tramosGananciasCapital ?? TRAMOS_AHORRO_DEFAULT;

  function abrirModal(titulo: string, html: string): HTMLElement | null {
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return null;
    el.innerHTML = `<div class="modal-title">${esc(titulo)}</div>${html}`;
    ov.classList.remove('hidden');
    onClick(el, '[data-cerrar]', cerrar);
    return el;
  }

  function abrir(): void {
    editando = null;
    const historico = [...deps.store.get('tramosGananciasCapitalHistorico')].sort((a, b) => a.año - b.año);
    const estiloFila =
      'display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center';

    const el = abrirModal(
      'Tramos — Ganancias de capital',
      `
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${estiloFila}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${esc(resumen(porDefecto()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${historico
          .map(
            (e) => `<div style="${estiloFila}">
              <span style="font-weight:600;font-size:13px">${e.año}</span>
              <span class="text-sm" style="color:var(--text2)">${esc(resumen(e.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${e.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${e.año}">✕</button>
              </div>
            </div>`,
          )
          .join('')}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${deps.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`,
    );
    if (!el) return;

    onClick(el, '[data-editar-tg]', (btn) => {
      const v = btn.getAttribute('data-editar-tg') as string;
      abrirEditor(v === 'default' ? 'default' : Number(v));
    });
    onClick(el, '[data-borrar-tg]', (btn) => {
      const año = Number(btn.getAttribute('data-borrar-tg'));
      if (!confirmar(`¿Eliminar la tabla del ejercicio ${año}?`)) return;
      deps.store.set(
        'tramosGananciasCapitalHistorico',
        deps.store.get('tramosGananciasCapitalHistorico').filter((e) => e.año !== año),
      );
      toast(`Tabla ${año} eliminada`);
      deps.onDatosCambiados();
      abrir();
    });
    onClick(el, '[data-anadir-anyo-tg]', () => {
      const año = parseInt((el.querySelector('#tg-new-year') as HTMLInputElement | null)?.value ?? '', 10);
      if (!año || año < 2000 || año > 2100) return toast('Año inválido', 'err');
      const actual = deps.store.get('tramosGananciasCapitalHistorico');
      if (actual.some((e) => e.año === año)) return toast('Ya existe una tabla para ese año', 'err');
      deps.store.set('tramosGananciasCapitalHistorico', [
        ...actual,
        { _id: Date.now().toString(36), año, tramos: porDefecto().map((t) => [...t] as [number, number]) },
      ]);
      deps.onDatosCambiados();
      abrirEditor(año);
    });
  }

  function filasHtml(): string {
    return filas
      .map(
        ([desde, pct], i) => `<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${i}" value="${desde}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${i}" value="${pct}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${i}">✕</button>
          </div>
        </div>`,
      )
      .join('');
  }

  /** Vuelca lo escrito en el DOM a `filas`, para no perderlo al repintar. */
  function sincronizar(el: HTMLElement): void {
    filas = [...el.querySelectorAll<HTMLInputElement>('[data-tg-min]')].map((input, i) => {
      const pct = el.querySelector<HTMLInputElement>(`[data-tg-pct="${i}"]`);
      return [parseFloat(input.value) || 0, parseFloat(pct?.value ?? '') || 0] as [number, number];
    });
  }

  function abrirEditor(cual: Exclude<Edicion, null>): void {
    editando = cual;
    const historico = deps.store.get('tramosGananciasCapitalHistorico');
    const origen = cual === 'default' ? porDefecto() : (historico.find((e) => e.año === cual)?.tramos ?? porDefecto());
    filas = origen.map((t) => [...t] as [number, number]);

    const el = abrirModal(
      `Ganancias de capital — ${cual === 'default' ? 'Por defecto' : cual}`,
      `
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${filasHtml()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`,
    );
    if (!el) return;

    const repintar = () => {
      const cont = el.querySelector('#tg-rows');
      if (cont) cont.innerHTML = filasHtml();
    };
    onClick(el, '[data-volver-tg]', abrir);
    onClick(el, '[data-tg-anadir]', () => {
      sincronizar(el);
      filas.push([0, 0]);
      repintar();
    });
    onClick(el, '[data-tg-borrar]', (btn) => {
      sincronizar(el);
      filas.splice(Number(btn.getAttribute('data-tg-borrar')), 1);
      repintar();
    });
    onClick(el, '[data-tg-guardar]', () => {
      sincronizar(el);
      const ordenados = [...filas].sort((a, b) => a[0] - b[0]);
      if (ordenados.length === 0) return toast('Añade al menos un tramo', 'err');

      if (editando === 'default') {
        deps.store.patchConfig({ tramosGananciasCapital: ordenados });
        toast('Tabla por defecto guardada');
      } else {
        deps.store.set(
          'tramosGananciasCapitalHistorico',
          deps.store.get('tramosGananciasCapitalHistorico').map((e) => (e.año === editando ? { ...e, tramos: ordenados } : e)),
        );
        toast(`Tabla ${editando} guardada`);
      }
      deps.onDatosCambiados();
      abrir();
    });
  }

  return { abrir };
}
