// ── features/scenarios ────────────────────────────────────────────────────────
// Escenarios (F1, tarea 1.7 — port de `escenarios/escenarios.js`).
//
// Un escenario agrupa elementos hipotéticos (préstamos, amortizaciones, gastos,
// nóminas, cuentas) que solo entran en la proyección cuando está activo. En F5
// esto se sustituye por Supuestos con diffs sobre lo canónico, por eso la vista
// se cuelga del flag `supuestos`.
//
// Cambios respecto a la versión legacy, además del tipado:
//   · delegación de eventos en lugar de `onclick="EscenariosModule.x('<id>')"`;
//   · todo el texto del usuario se escapa (el nombre de un escenario se
//     interpolaba crudo en la tarjeta, en la tabla y en la leyenda del gráfico);
//   · el filtro de escenario y la serie mensual salen de `core/scenarios`, con
//     tests, en lugar de vivir dentro de la vista;
//   · la instancia de Chart.js se destruye siempre antes de repintar. El legacy
//     solo lo hacía en dos de los tres caminos.
//
// Errores de cálculo corregidos (ver core/scenarios.ts):
//   · la línea del gráfico se construía sumando `delta` desde CERO, sin el saldo
//     de partida, así que no cuadraba con la tabla comparativa de justo debajo;
//   · los meses se recorrían con `toISOString()` sobre medianoche local, que en
//     España devuelve el mes anterior para el día 1: cada mes se leía en la
//     casilla equivocada y la serie salía desplazada.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import { filtrarPorEscenario, saldoEnFechaExtracto, serieMensual, type PuntoMensual } from '@/core/scenarios';
import { crearResolverTramos } from '@/core/tax/tables';
import { TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';
import { TRAMOS_AHORRO_DEFAULT } from '@/core/tax/ahorro';
import { generarExtracto, type StatementAccount } from '@/engine/statement';
import type { CashEvent } from '@/engine/types';
import type { PeriodoInflacion } from '@/core/inflation';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Account, AppConfig, Escenario, Expense, Loan, Nomina, TablaFiscalAnual } from '@/state/schema';
import { confirmar, esc, onClick, toast } from '../accounting/dom';
import { dibujarComparativa, hayChartJs, type SerieGrafico } from './chart';

export interface ScenariosStoreLike {
  get(key: 'escenarios'): Escenario[];
  get(key: 'loans'): Loan[];
  get(key: 'expenses'): Expense[];
  get(key: 'nominas'): Nomina[];
  get(key: 'accounts'): Account[];
  get(key: 'inflacion'): PeriodoInflacion[];
  get(key: 'tramosIRPFHistorico'): TablaFiscalAnual[];
  get(key: 'tramosGananciasCapitalHistorico'): TablaFiscalAnual[];
  get(key: 'config'): AppConfig;
  set(key: 'loans', value: Loan[]): void;
  set(key: 'expenses', value: Expense[]): void;
  set(key: 'nominas', value: Nomina[]): void;
  set(key: 'accounts', value: Account[]): void;
  patchConfig(patch: Partial<AppConfig>): void;
  addItem(col: 'escenarios', item: Omit<Escenario, '_id'> & { _id?: string }): Escenario;
  updateItem(col: 'escenarios', id: string, patch: Partial<Escenario>): void;
  removeItem(col: 'escenarios', id: string): void;
}

export interface ScenariosViewDeps {
  store: ScenariosStoreLike;
  onDatosCambiados?: () => void;
}

export const COLORES_ESCENARIO = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const ICONO =
  'M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z';

export function createScenariosFeature(deps: ScenariosViewDeps): FeatureManifest {
  const notificar = () => deps.onDatosCambiados?.();
  /** Cuentas que el usuario ha apagado en la comparativa. */
  const excluidas = new Set<string>();
  let grafico: { destroy(): void } | null = null;

  const config = () => deps.store.get('config');
  const escenarios = () => deps.store.get('escenarios');
  const nombreEscenario = (id: string | null) => (id ? (escenarios().find((e) => e._id === id)?.nombre ?? id) : 'Base');

  // ── Proyección ──────────────────────────────────────────────────────────────

  /** Extracto completo de un escenario (o de la base si es `null`). */
  function extractoDe(escenario: Escenario | null): { eventos: CashEvent[]; horizonte: ISODate } {
    const cfg = config();
    const filtrado = filtrarPorEscenario(
      {
        loans: deps.store.get('loans'),
        expenses: deps.store.get('expenses'),
        nominas: deps.store.get('nominas'),
        accounts: deps.store.get('accounts'),
      },
      escenario?._id ?? null,
    );

    const cuentas = excluidas.size > 0 ? filtrado.accounts.filter((a) => !excluidas.has(a._id)) : filtrado.accounts;
    // Con cuentas apagadas hay que filtrar también los gastos y préstamos que
    // cuelgan de ellas; el motor lo hace a partir de la lista de ids incluidos.
    const filtroAccounts = excluidas.size > 0 ? cuentas.map((a) => a._id) : null;

    const horizonte = escenario?.fechaFin && escenario.fechaFin > cfg.dashboardEnd ? escenario.fechaFin : cfg.dashboardEnd;

    const eventos = generarExtracto({
      loans: filtrado.loans,
      expenses: filtrado.expenses,
      accounts: cuentas as StatementAccount[],
      config: { ...cfg, dashboardEnd: horizonte },
      filtroAccounts,
      nominas: filtrado.nominas,
      inflacionPeriodos: deps.store.get('inflacion'),
      resolverTramosIRPF: crearResolverTramos(deps.store.get('tramosIRPFHistorico'), cfg.tramos_irpf ?? TRAMOS_IRPF_DEFAULT),
      resolverTramosGanancias: crearResolverTramos(
        deps.store.get('tramosGananciasCapitalHistorico'),
        cfg.tramosGananciasCapital ?? TRAMOS_AHORRO_DEFAULT,
      ),
    });
    return { eventos, horizonte };
  }

  // ── Tarjetas y tabla ────────────────────────────────────────────────────────

  /** Cuántos elementos tiene asignados el escenario, por colección. */
  function recuento(id: string): { total: number; texto: string } {
    const loans = deps.store.get('loans');
    const tiene = (i: { escenarioIds?: string[] }) => (i.escenarioIds || []).includes(id);
    const partes: [number, string, string][] = [
      [loans.filter(tiene).length, 'préstamo', 'préstamos'],
      [loans.flatMap((l) => l.amortizaciones || []).filter(tiene).length, 'amortización', 'amortizaciones'],
      [deps.store.get('expenses').filter(tiene).length, 'gasto', 'gastos'],
      [deps.store.get('accounts').filter(tiene).length, 'cuenta', 'cuentas'],
      [deps.store.get('nominas').filter(tiene).length, 'nómina', 'nóminas'],
    ];
    const total = partes.reduce((s, [n]) => s + n, 0);
    const texto = partes
      .filter(([n]) => n > 0)
      .map(([n, sing, plur]) => `${n} ${n === 1 ? sing : plur}`)
      .join(' · ');
    return { total, texto };
  }

  function tarjeta(e: Escenario, activo: string | null): string {
    const esActivo = activo === e._id;
    const color = e.color || COLORES_ESCENARIO[0];
    const { total, texto } = recuento(e._id);

    return `<div class="card mb-12" style="border-left:3px solid ${esc(color)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${esc(color)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${esc(e.nombre)}</span>
        ${esActivo ? '<span class="badge badge-yellow">● Activo</span>' : ''}
        ${e.fechaFin ? `<span class="badge badge-inactive">📅 ${esc(e.fechaFin)}</span>` : ''}
        <div class="flex gap-8">
          ${
            esActivo
              ? '<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>'
              : `<button class="btn-primary btn-sm" data-activar-esc="${esc(e._id)}">Activar</button>`
          }
          <button class="btn-secondary btn-sm" data-editar-esc="${esc(e._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${esc(e._id)}">✕</button>
        </div>
      </div>
      ${e.descripcion ? `<div class="text-sm mb-8" style="color:var(--text2)">${esc(e.descripcion)}</div>` : ''}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${total === 0 ? '<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>' : `<span>${esc(texto)}</span>`}
      </div>
    </div>`;
  }

  function tablaComparativa(lista: Escenario[]): string {
    const fechaRef = config().dashboardEnd;
    const saldoBase = saldoEnFechaExtracto(extractoDe(null).eventos, fechaRef);

    const filas = lista
      .map((e) => {
        const { eventos } = extractoDe(e);
        const fecha = e.fechaFin || fechaRef;
        const saldo = saldoEnFechaExtracto(eventos, fecha);
        const diff = saldo !== null && saldoBase !== null ? saldo - saldoBase : null;
        return `<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${esc(e.color || COLORES_ESCENARIO[0])};margin-right:6px"></span>
            ${esc(e.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${esc(fecha)}</td>
          <td class="num" style="padding:6px 10px">${saldo !== null ? esc(formatEUR(saldo)) : '—'}</td>
          <td class="num ${diff === null ? '' : diff >= 0 ? 'pos' : 'neg'}" style="padding:6px 10px">
            ${diff === null ? '—' : `${diff >= 0 ? '+' : ''}${esc(formatEUR(diff))}`}
          </td>
        </tr>`;
      })
      .join('');

    return `
      <div class="card-title" style="margin-bottom:10px">Saldo en la fecha objetivo, frente a la base</div>
      <table style="width:100%;font-size:13px;border-collapse:collapse">
        <thead>
          <tr style="color:var(--text2);border-bottom:1px solid var(--border)">
            <th style="text-align:left;padding:6px 10px">Escenario</th>
            <th style="text-align:right;padding:6px 10px">Fecha objetivo</th>
            <th style="text-align:right;padding:6px 10px">Saldo estimado</th>
            <th style="text-align:right;padding:6px 10px">vs Base</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>`;
  }

  function pastillasCuentas(): string {
    const cuentas = deps.store.get('accounts');
    if (cuentas.length <= 1) return '';
    const pastillas = cuentas
      .map((a) => {
        const fuera = excluidas.has(a._id);
        return `<button data-toggle-cuenta="${esc(a._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${fuera ? 'var(--border)' : 'var(--accent)'};
          background:${fuera ? 'transparent' : 'rgba(99,102,241,0.1)'};
          color:${fuera ? 'var(--text3)' : 'var(--text1)'};cursor:pointer;font-size:12px;
          ${fuera ? 'text-decoration:line-through;' : ''}">${esc(a.nombre)}</button>`;
      })
      .join('');
    return `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${pastillas}
    </div>`;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function destruirGrafico(): void {
    if (!grafico) return;
    try {
      grafico.destroy();
    } catch {
      // Chart.js lanza si el canvas ya no está en el DOM; da igual, se descarta
    }
    grafico = null;
  }

  function series(lista: Escenario[]): SerieGrafico[] {
    const cfg = config();
    const base = extractoDe(null);
    const out: SerieGrafico[] = [
      {
        label: 'Base (sin escenario)',
        color: '#6b7280',
        esBase: true,
        puntos: serieMensual(base.eventos, cfg.dashboardStart, cfg.dashboardEnd),
      },
    ];
    lista.forEach((e, i) => {
      const { eventos, horizonte } = extractoDe(e);
      out.push({
        label: e.nombre,
        color: e.color || COLORES_ESCENARIO[i % COLORES_ESCENARIO.length],
        puntos: serieMensual(eventos, cfg.dashboardStart, horizonte),
      });
    });
    return out;
  }

  function pintarGrafico(container: HTMLElement, lista: Escenario[]): void {
    destruirGrafico();
    const canvas = container.querySelector<HTMLCanvasElement>('#chart-comparacion');
    if (!canvas) return;
    grafico = dibujarComparativa(canvas, series(lista));
  }

  function render(container: HTMLElement): void {
    destruirGrafico();
    // Una cuenta borrada no debe seguir apagando la comparativa para siempre
    const ids = new Set(deps.store.get('accounts').map((a) => a._id));
    for (const id of [...excluidas]) if (!ids.has(id)) excluidas.delete(id);

    const lista = escenarios();
    const activo = config().escenarioActivo || null;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Mis <span>Escenarios</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo escenario</button></div>
      </div>

      ${
        activo
          ? `<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${esc(nombreEscenario(activo))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este escenario</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`
          : ''
      }

      ${
        lista.length === 0
          ? `<div class="card mb-14" style="padding:20px 24px">
               <div style="font-weight:600;font-size:14px;margin-bottom:8px">¿Qué son los escenarios?</div>
               <div class="text-sm" style="color:var(--text2);line-height:1.7;margin-bottom:12px">
                 Los escenarios sirven para probar <strong>situaciones hipotéticas</strong> sin tocar tu plan base:
                 ¿qué pasaría si amortizas la hipoteca de forma agresiva?, ¿si cambias de trabajo y sube el sueldo?,
                 ¿si abres una inversión nueva?<br><br>
                 <strong>Cómo funciona:</strong>
                 <ol style="margin:8px 0 0 16px;padding:0">
                   <li>Crea un escenario con un nombre descriptivo.</li>
                   <li>En Préstamos, Gastos, Cuentas o Nóminas, asigna los elementos que pertenecen a él.</li>
                   <li>Actívalo para ver cómo cambia la proyección del Dashboard.</li>
                 </ol>
               </div>
               <button class="btn-primary btn-sm" data-nuevo-esc>+ Crear mi primer escenario</button>
             </div>
             <div class="card" style="text-align:center;padding:32px;color:var(--text3)">
               <div style="font-size:13px">Una vez creado, asígnale préstamos, gastos o cuentas desde sus secciones, con el selector de "Escenarios" del formulario.</div>
             </div>`
          : `<div>${lista.map((e) => tarjeta(e, activo)).join('')}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${pastillasCuentas()}</div>
               ${
                 hayChartJs()
                   ? '<canvas id="chart-comparacion" height="160"></canvas>'
                   : '<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'
               }
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${tablaComparativa(lista)}</div>`
      }`;

    if (lista.length > 0) pintarGrafico(container, lista);
  }

  // ── Formulario ──────────────────────────────────────────────────────────────

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrarModal = () => overlay()?.classList.add('hidden');

  function abrirFormulario(id: string | null, refrescar: () => void): void {
    const e = id ? (escenarios().find((x) => x._id === id) ?? null) : null;
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return;
    const color = e?.color || COLORES_ESCENARIO[0];

    el.innerHTML = `
      <div class="modal-title">${id ? 'Editar escenario' : 'Nuevo escenario'}</div>
      <div class="form-group"><label class="form-label">Nombre del escenario</label>
        <input class="form-input" type="text" id="esc-nombre" value="${esc(e?.nombre ?? '')}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${esc(e?.fechaFin ?? '')}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${COLORES_ESCENARIO.map(
            (c) => `<div data-color-esc="${c}" style="width:26px;height:26px;border-radius:50%;background:${c};cursor:pointer;
              border:2px solid ${c === color ? 'white' : 'transparent'};transition:border .15s"></div>`,
          ).join('')}
        </div>
        <input type="hidden" id="esc-color" value="${esc(color)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${esc(e?.descripcion ?? '')}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${esc(id ?? '')}">${id ? 'Guardar cambios' : 'Crear escenario'}</button>
      </div>`;
    ov.classList.remove('hidden');

    onClick(el, '[data-cancelar]', cerrarModal);
    onClick(el, '[data-color-esc]', (opt) => {
      const elegido = opt.getAttribute('data-color-esc') as string;
      (el.querySelector('#esc-color') as HTMLInputElement).value = elegido;
      for (const o of el.querySelectorAll<HTMLElement>('[data-color-esc]')) {
        o.style.border = o.getAttribute('data-color-esc') === elegido ? '2px solid white' : '2px solid transparent';
      }
    });
    onClick(el, '[data-guardar-esc]', (btn) => {
      const nombre = (el.querySelector('#esc-nombre') as HTMLInputElement).value.trim();
      if (!nombre) return toast('El nombre es obligatorio', 'err');
      const datos = {
        nombre,
        fechaFin: (el.querySelector('#esc-fecha-fin') as HTMLInputElement).value || null,
        color: (el.querySelector('#esc-color') as HTMLInputElement).value || COLORES_ESCENARIO[0],
        descripcion: (el.querySelector('#esc-desc') as HTMLInputElement).value.trim(),
      };
      const editId = btn.getAttribute('data-guardar-esc') || '';
      if (editId) {
        deps.store.updateItem('escenarios', editId, datos);
        toast('Escenario actualizado');
      } else {
        deps.store.addItem('escenarios', datos);
        toast('Escenario creado');
      }
      notificar();
      cerrarModal();
      refrescar();
    });
  }

  /** Al borrar un escenario, sus elementos vuelven a la base. */
  function borrar(id: string, refrescar: () => void): void {
    if (!confirmar('¿Eliminar este escenario? Los elementos asignados perderán esta asignación.')) return;
    const sinId = <T extends { escenarioIds?: string[] }>(items: T[]): T[] =>
      items.map((i) => ({ ...i, escenarioIds: (i.escenarioIds || []).filter((x) => x !== id) }));

    deps.store.set(
      'loans',
      sinId(deps.store.get('loans')).map((l) => ({ ...l, amortizaciones: sinId(l.amortizaciones || []) })),
    );
    deps.store.set('expenses', sinId(deps.store.get('expenses')));
    deps.store.set('nominas', sinId(deps.store.get('nominas')));
    deps.store.set('accounts', sinId(deps.store.get('accounts')));
    if (config().escenarioActivo === id) deps.store.patchConfig({ escenarioActivo: null });
    deps.store.removeItem('escenarios', id);
    toast('Escenario eliminado');
    notificar();
    refrescar();
  }

  // ── Cableado ────────────────────────────────────────────────────────────────

  function wire(container: HTMLElement, refrescar: () => void): void {
    onClick(container, '[data-nuevo-esc]', () => abrirFormulario(null, refrescar));
    onClick(container, '[data-editar-esc]', (el) => abrirFormulario(el.getAttribute('data-editar-esc'), refrescar));
    onClick(container, '[data-borrar-esc]', (el) => borrar(el.getAttribute('data-borrar-esc') as string, refrescar));

    onClick(container, '[data-activar-esc]', (el) => {
      const id = el.getAttribute('data-activar-esc') as string;
      deps.store.patchConfig({ escenarioActivo: id });
      toast(`Escenario "${nombreEscenario(id)}" activado`);
      notificar();
      refrescar();
    });
    onClick(container, '[data-desactivar-esc]', () => {
      deps.store.patchConfig({ escenarioActivo: null });
      toast('Volviendo a la realidad base');
      notificar();
      refrescar();
    });

    // Apagar una cuenta solo afecta a la comparativa: se repintan el gráfico y
    // la tabla, no la vista entera (las tarjetas no cambian).
    onClick(container, '[data-toggle-cuenta]', (el) => {
      const id = el.getAttribute('data-toggle-cuenta') as string;
      if (excluidas.has(id)) excluidas.delete(id);
      else excluidas.add(id);
      const pastillas = container.querySelector('#esc-pastillas');
      if (pastillas) pastillas.innerHTML = pastillasCuentas();
      const lista = escenarios();
      const tabla = container.querySelector('#esc-comparativa');
      if (tabla) tabla.innerHTML = tablaComparativa(lista);
      pintarGrafico(container, lista);
    });
  }

  return {
    id: 'escenarios',
    route: 'escenarios',
    nombre: 'Escenarios',
    // En F5 esta vista pasa a ser "Supuestos" (diffs sobre lo canónico); el flag
    // ya es el definitivo para no tener que migrar la preferencia del usuario.
    flagId: 'supuestos',
    seccion: 2, // "Planificación"
    iconoPath: ICONO,
    mount(container: HTMLElement) {
      const refrescar = () => render(container);
      render(container);
      if (container.dataset.wired !== '1') {
        wire(container, refrescar);
        container.dataset.wired = '1';
      }
    },
    unmount() {
      destruirGrafico();
    },
  };
}

export type { PuntoMensual };
