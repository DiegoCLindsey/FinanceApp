// ── features/inflation ───────────────────────────────────────────────────────
// Estimaciones de inflación por periodos anuales (F1, tarea 1.7 — port de
// `inflacion/inflacion.js`).
//
// Cambios respecto al legacy, además del tipado:
//   · delegación de eventos en lugar de `onclick=` inline;
//   · la descarga del IPC se aísla en `ipc-source.ts` con `fetch` inyectable,
//     de modo que el parseo se puede testear sin red;
//   · el factor acumulado se calcula con `core/inflation` (ya verificado contra
//     el legacy con tests de paridad).

import { calcFactorInflacion, type PeriodoInflacion } from '@/core/inflation';
import { formatLocalDate, todayISO } from '@/core/dates';
import type { FeatureManifest } from '@/app/feature-registry';
import type { AppConfig } from '@/state/schema';
import { confirmar, esc, onChange, onClick, toast } from '../accounting/dom';
import { createIpcSource, type IpcSource, type TasaAnual } from './ipc-source';

export interface InflationStoreLike {
  get(key: 'inflacion'): PeriodoInflacion[];
  get(key: 'config'): AppConfig;
  addItem(col: 'inflacion', item: Omit<PeriodoInflacion, '_id'>): PeriodoInflacion;
  updateItem(col: 'inflacion', id: string, patch: Partial<PeriodoInflacion>): void;
  removeItem(col: 'inflacion', id: string): void;
  patchConfig(patch: Partial<AppConfig>): void;
}

export interface InflationViewDeps {
  store: InflationStoreLike;
  ipc?: IpcSource;
  onDatosCambiados?: () => void;
}

const ICONO = 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z';

/** Color de la tasa según su magnitud (misma escala que la versión legacy). */
function colorTasa(tasa: number): string {
  return tasa > 5 ? 'var(--red)' : tasa > 2.5 ? 'var(--yellow)' : 'var(--accent)';
}

export function createInflationFeature(deps: InflationViewDeps): FeatureManifest {
  const { store } = deps;
  const ipc = deps.ipc ?? createIpcSource();

  const periodos = (): PeriodoInflacion[] => store.get('inflacion') ?? [];

  function notificar(): void {
    deps.onDatosCambiados?.();
  }

  // ── Modal de importación de IPC ────────────────────────────────────────────
  function cuerpoImportacion(datos: TasaAnual[] | null, desdeAnio: number): string {
    if (!datos || datos.length === 0) {
      return `
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;
    }

    const existentes = new Set(periodos().map((p) => p.year));
    const filtrados = datos.filter((d) => d.year >= desdeAnio).reverse(); // más reciente primero
    const nuevos = filtrados.filter((d) => !existentes.has(d.year)).length;
    const años = [...new Set(datos.map((d) => d.year))].sort((a, b) => a - b);

    const filas = filtrados
      .map(
        (d) => `
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${d.year}" data-tasa="${d.tasa}" ${existentes.has(d.year) ? 'disabled' : 'checked'}/>
          <span style="font-family:var(--font-mono);font-weight:600">${d.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${colorTasa(d.tasa)}">${d.tasa.toFixed(2)}%</span>
          ${existentes.has(d.year) ? '<span style="font-size:10px;color:var(--text3)">ya guardado</span>' : '<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`,
      )
      .join('');

    return `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${años.map((y) => `<option value="${y}"${y === desdeAnio ? ' selected' : ''}>${y}</option>`).join('')}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${datos[0].year}–${datos[datos.length - 1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${filas}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${nuevos} periodo${nuevos !== 1 ? 's' : ''} nuevo${nuevos !== 1 ? 's' : ''} disponible${nuevos !== 1 ? 's' : ''}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${nuevos === 0 ? 'disabled' : ''}>↓ Importar seleccionados</button>
        </div>
      </div>`;
  }

  function añoInicialSugerido(datos: TasaAnual[] | null): number {
    if (!datos || datos.length === 0) return 2000;
    return Math.max(datos[0].year, new Date().getFullYear() - 25);
  }

  async function abrirImportacion(refrescar: () => void): Promise<void> {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`;
    overlay.classList.remove('hidden');

    const pintar = (datos: TasaAnual[] | null, desde: number) => {
      const body = document.getElementById('ipc-body');
      if (body) body.innerHTML = cuerpoImportacion(datos, desde);
    };

    const datos = await ipc.obtener();
    pintar(datos, añoInicialSugerido(datos));

    onClick(content, '[data-ipc-cerrar]', () => overlay.classList.add('hidden'));

    onChange(content, '#ipc-desde', (el) => {
      pintar(ipc.enCache, parseInt((el as HTMLSelectElement).value));
    });

    onClick(content, '[data-ipc-recargar]', () => {
      ipc.invalidar();
      const body = document.getElementById('ipc-body');
      if (body) body.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>';
      void ipc.obtener(true).then((d) => pintar(d, añoInicialSugerido(d)));
    });

    onClick(content, '[data-ipc-importar]', () => {
      const marcados = [...content.querySelectorAll<HTMLInputElement>('.ipc-chk:checked:not(:disabled)')];
      if (marcados.length === 0) return toast('Nada seleccionado', 'err');
      const existentes = new Set(periodos().map((p) => p.year));
      let importados = 0;
      for (const chk of marcados) {
        const year = parseInt(chk.dataset.year ?? '');
        const tasa = parseFloat(chk.dataset.tasa ?? '');
        if (!Number.isFinite(year) || !Number.isFinite(tasa) || existentes.has(year)) continue;
        store.addItem('inflacion', { year, tasa });
        existentes.add(year);
        importados++;
      }
      overlay.classList.add('hidden');
      toast(`${importados} periodo${importados !== 1 ? 's' : ''} importado${importados !== 1 ? 's' : ''} correctamente`);
      notificar();
      refrescar();
    });
  }

  // ── Formulario de periodo ──────────────────────────────────────────────────
  function abrirFormulario(id: string | null, refrescar: () => void): void {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    const p = id ? periodos().find((x) => x._id === id) : null;

    content.innerHTML = `
      <div class="modal-title">${id ? 'Editar periodo de inflación' : 'Nuevo periodo de inflación'}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${p?.year ?? new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${p?.tasa ?? ''}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${esc(id ?? '')}">Guardar</button>
      </div>`;
    overlay.classList.remove('hidden');

    const preview = () => {
      const tasa = parseFloat((content.querySelector('#inf-tasa') as HTMLInputElement | null)?.value ?? '');
      const box = content.querySelector('#inf-preview') as HTMLElement | null;
      if (!box) return;
      if (!Number.isFinite(tasa) || tasa <= 0) {
        box.innerHTML = '';
        return;
      }
      const mensual = (Math.pow(1 + tasa / 100, 1 / 12) - 1) * 100;
      const f5 = Math.pow(1 + tasa / 100, 5);
      box.innerHTML = `Con un ${tasa}% anual: <strong>${mensual.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${f5.toFixed(3)}</strong> (+${((f5 - 1) * 100).toFixed(1)}%)`;
    };
    content.querySelector('#inf-tasa')?.addEventListener('input', preview);
    preview();

    onClick(content, '[data-inf-cerrar]', () => overlay.classList.add('hidden'));

    onClick(content, '[data-inf-guardar]', (el) => {
      const editId = el.getAttribute('data-inf-guardar') || '';
      const year = parseInt((content.querySelector('#inf-year') as HTMLInputElement).value);
      const tasa = parseFloat((content.querySelector('#inf-tasa') as HTMLInputElement).value);
      if (!Number.isFinite(year) || year < 1900 || year > 2200) return toast('Año inválido', 'err');
      if (!Number.isFinite(tasa) || tasa < 0 || tasa > 100) return toast('Tasa inválida (0–100%)', 'err');

      const otros = periodos().filter((p) => p._id !== editId);
      if (otros.some((p) => p.year === year)) return toast('Ya existe un periodo para ese año', 'err');

      if (editId) {
        store.updateItem('inflacion', editId, { year, tasa });
        toast('Periodo actualizado');
      } else {
        store.addItem('inflacion', { year, tasa });
        toast('Periodo añadido');
      }
      overlay.classList.add('hidden');
      notificar();
      refrescar();
    });
  }

  // ── Vista ──────────────────────────────────────────────────────────────────
  function fila(p: PeriodoInflacion, hoy: string): string {
    const mensual = (Math.pow(1 + p.tasa / 100, 1 / 12) - 1) * 100;
    const hasta = `${p.year}-12-31`;
    const factor = hasta > hoy ? calcFactorInflacion([p], hoy, hasta) : null;
    return `
      <div class="exp-table-row" data-periodo="${esc(p._id ?? '')}">
        <div style="font-weight:600;font-family:var(--font-mono)">${p.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${p.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${mensual.toFixed(3)}%/mes</div>
        <div class="num">${factor !== null ? `×${factor.toFixed(3)}` : '—'}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${esc(p._id ?? '')}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${esc(p._id ?? '')}" title="Eliminar">✕</button>
        </div>
      </div>`;
  }

  function render(container: HTMLElement): void {
    const lista = periodos();
    const activo = store.get('config').usarInflacion || false;
    const orden = [...lista].sort((a, b) => b.year - a.year);

    const hoy = todayISO();
    const año = new Date().getFullYear();
    const d5 = formatLocalDate(new Date(año + 5, 0, 1));
    const d10 = formatLocalDate(new Date(año + 10, 0, 1));
    const f5 = activo && lista.length > 0 ? calcFactorInflacion(lista, hoy, d5) : null;
    const f10 = activo && lista.length > 0 ? calcFactorInflacion(lista, hoy, d10) : null;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${
        !activo && lista.length === 0
          ? `<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
        <div style="font-weight:600;font-size:14px;margin-bottom:6px">Módulo opcional</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Registra la tasa de inflación estimada de cada año y las proyecciones mostrarán el coste
          en <strong>euros de hoy</strong>. Útil para comparar el coste real de un préstamo largo o
          ver cómo se erosiona el ahorro. Para un uso básico puedes ignorarlo.
        </div>
      </div>`
          : ''
      }

      <div class="card mb-14" style="padding:16px 20px">
        <div class="flex gap-16 items-center" style="flex-wrap:wrap;justify-content:space-between">
          <div>
            <div style="font-weight:600;font-size:15px">Usar estimaciones de inflación</div>
            <div class="text-sm" style="color:var(--text3);margin-top:4px">
              Aplica la inflación acumulada año a año a las proyecciones.
            </div>
          </div>
          <label class="toggle" style="flex-shrink:0">
            <input type="checkbox" data-toggle-inflacion ${activo ? 'checked' : ''}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${
          f5 !== null && f10 !== null
            ? `<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${f5.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((f5 - 1) * 100).toFixed(1)}%)</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +10 años</div>
            <div class="stat-value neg">×${f10.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((f10 - 1) * 100).toFixed(1)}%)</span></div>
          </div>
        </div>`
            : ''
        }
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          <span class="exp-col-head">Año</span>
          <span class="exp-col-head">Tasa anual (%)</span>
          <span class="exp-col-head">Equivalente mensual</span>
          <span class="exp-col-head">Factor acumulado desde hoy</span>
          <span></span>
        </div>
        ${
          orden.length === 0
            ? '<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>'
            : orden.map((p) => fila(p, hoy)).join('')
        }
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;

    const refrescar = () => render(container);

    onChange(container, '[data-toggle-inflacion]', (el) => {
      const activar = (el as HTMLInputElement).checked;
      store.patchConfig({ usarInflacion: activar });
      toast(activar ? 'Estimaciones de inflación activadas' : 'Estimaciones de inflación desactivadas');
      notificar();
      refrescar();
    });

    onClick(container, '[data-nuevo-periodo]', () => abrirFormulario(null, refrescar));
    onClick(container, '[data-editar-periodo]', (el) => abrirFormulario(el.getAttribute('data-editar-periodo'), refrescar));
    onClick(container, '[data-importar-ipc]', () => void abrirImportacion(refrescar));

    onClick(container, '[data-borrar-periodo]', (el) => {
      if (!confirmar('¿Eliminar este periodo de inflación?')) return;
      store.removeItem('inflacion', el.getAttribute('data-borrar-periodo') as string);
      toast('Periodo eliminado');
      notificar();
      refrescar();
    });
  }

  return {
    id: 'inflacion',
    route: 'inflacion',
    nombre: 'Inflación',
    flagId: 'inflacion',
    seccion: 2, // "Planificación"
    iconoPath: ICONO,
    mount: render,
  };
}
