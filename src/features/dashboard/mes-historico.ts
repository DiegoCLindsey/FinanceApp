// ── features/dashboard/mes-historico ──────────────────────────────────────────
// Ventana «Meses anteriores» de la tarjeta «Este mes»: el mismo desglose
// (préstamos, facturas, otros gastos y margen de ahorro) para cada mes de un
// periodo elegido, con:
//
//   · barras apiladas de los gastos de cada mes;
//   · una gráfica aparte de impacto en el ahorro: el margen de cada mes y el
//     ahorro acumulado del periodo (la misma unidad, el mismo eje);
//   · al pulsar un mes —en cualquiera de las dos gráficas o en su ficha— el
//     desglose por grupo y concepto de ese mes, como en la tarjeta;
//   · y el acumulado de los tres grupos en todo el periodo.
//
// Los importes son los ESTIMADOS (lo que preveían tus gastos, préstamos y
// nóminas para cada mes), igual que la tarjeta: lo real frente a lo estimado
// vive en Cuentas → Cierre y precisión.
//
// Chart.js llega del CDN como global; si no ha cargado (sin red), la ventana
// funciona igual sin las gráficas: las fichas de cada mes también seleccionan.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { CashEvent } from '@/engine/types';
import {
  desglosePorMeses,
  mesesEntre,
  sumarDesgloses,
  sumarMesesA,
  estimacionImprevistosPara,
  mediaDeDesgloses,
  type DesgloseDeMes,
  type EstimacionImprevistos,
  type MovimientoReal,
  type GastoClasificable,
  type PrestamoNombrado,
} from '@/engine/mes';
import { contenedorModalLimpio, esc, nombreMes, onChange, onClick } from '../accounting/dom';
import { COLORES_GRUPO, cuerpoDesglose } from './mes-card';

export interface HistoricoDeps {
  /** Extracto estimado (sin recortar por cuentas internas) entre dos fechas. */
  generarExtracto: (desde: ISODate, hasta: ISODate) => CashEvent[];
  gastos: GastoClasificable[];
  prestamos: PrestamoNombrado[];
  hoy: ISODate;
  /** Movimientos reales: de ahí salen los marcados como imprevisto. */
  movimientos?: MovimientoReal[];
  doc?: Document;
}

type Preset = '3' | '6' | '12' | 'anio' | 'personalizado';
type Vista = 'mes' | 'media' | 'acumulado';

/** Lo que el usuario eligió la última vez, mientras dure la sesión. */
const recuerdo: { preset: Preset; desde?: string; hasta?: string; vista: Vista } = { preset: '6', vista: 'mes' };

/** Máximo de meses de un periodo personalizado: más barras no se leen. */
const MAX_MESES = 36;

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const mesCorto = (mes: string) => `${MESES_CORTOS[Number(mes.slice(5, 7)) - 1]} ${mes.slice(2, 4)}`;

const eurCompacto = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 });
const conSigno = (n: number) => `${n >= 0 ? '+' : '−'}${formatEUR(Math.abs(n))}`;

/** Lo mínimo de Chart.js que se usa, para no depender de sus tipos. */
interface ChartLike {
  destroy(): void;
  update(modo?: string): void;
  data: { datasets: { backgroundColor?: unknown; borderColor?: unknown; pointBackgroundColor?: unknown }[] };
  getElementsAtEventForMode(ev: unknown, modo: string, opciones: { intersect: boolean }, usarFinal: boolean): { index: number }[];
}
type ChartCtor = new (canvas: HTMLCanvasElement, config: unknown) => ChartLike;

let graficas: ChartLike[] = [];
function destruirGraficas(): void {
  for (const g of graficas) {
    try {
      g.destroy();
    } catch {
      /* el lienzo ya no existe */
    }
  }
  graficas = [];
}

/** Meses del periodo elegido. El último nunca pasa del mes en curso. */
export function rangoDe(preset: Preset, mesActual: string, desde?: string, hasta?: string): string[] {
  if (preset === 'anio') return mesesEntre(`${mesActual.slice(0, 4)}-01`, mesActual);
  if (preset === 'personalizado' && desde && hasta) {
    const fin = hasta > mesActual ? mesActual : hasta;
    const lista = mesesEntre(desde <= fin ? desde : fin, fin);
    return lista.slice(-MAX_MESES);
  }
  const n = Number(preset) || 6;
  return mesesEntre(sumarMesesA(mesActual, -(n - 1)), mesActual);
}

/** Abre la ventana. Devuelve el contenedor (útil en los tests). */
export function abrirHistoricoMeses(deps: HistoricoDeps): HTMLElement | null {
  const doc = deps.doc ?? document;
  const overlay = doc.getElementById('modal-overlay');
  const limpio = contenedorModalLimpio(doc);
  if (!overlay || !limpio) return null;
  const content: HTMLElement = limpio;
  doc.getElementById('modal-box')?.classList.add('modal-box--ancho');

  const mesActual = deps.hoy.slice(0, 7);
  let datos: DesgloseDeMes[] = [];
  // Por defecto, el último mes CERRADO: quien pide «meses anteriores» viene a
  // mirar el pasado; el mes en curso ya lo tiene en la tarjeta.
  let seleccionado = sumarMesesA(mesActual, -1);
  const movimientos = deps.movimientos ?? [];
  // La estimación de imprevistos del mes en curso, la misma que la tarjeta. Se
  // calcula una vez al abrir: no depende del periodo que se esté mirando.
  let estimacion: EstimacionImprevistos | null = null;
  try {
    estimacion = estimacionImprevistosPara(mesActual, { ...deps, movimientos });
  } catch (e) {
    console.error('[Meses anteriores] No se ha podido estimar los imprevistos:', e);
  }

  function calcular(): void {
    const meses = rangoDe(recuerdo.preset, mesActual, recuerdo.desde, recuerdo.hasta);
    if (meses.length === 0) {
      datos = [];
      return;
    }
    const ultimo = meses[meses.length - 1];
    const [y, m] = ultimo.split('-').map(Number);
    const finMes = `${ultimo}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
    const eventos = deps.generarExtracto(`${meses[0]}-01`, finMes);
    datos = desglosePorMeses(eventos, deps.gastos, deps.prestamos, meses, deps.hoy, {
      movimientos,
      // Solo el mes en curso reserva para imprevistos: en los pasados ya se
      // sabe lo que hubo.
      estimacion: estimacion && estimacion.meses > 0 ? { mes: mesActual, importe: estimacion.mediaMensual } : null,
    });
    if (!meses.includes(seleccionado)) seleccionado = meses.length > 1 ? meses[meses.length - 2] : meses[0];
  }

  // ── HTML ────────────────────────────────────────────────────────────────────

  function selectorPeriodo(): string {
    const opcion = (valor: Preset, texto: string) =>
      `<button type="button" class="period-btn${recuerdo.preset === valor ? ' active' : ''}" data-hist-preset="${valor}" aria-pressed="${recuerdo.preset === valor}">${texto}</button>`;
    const personal =
      recuerdo.preset === 'personalizado'
        ? `<div class="hist-rango">
            <label>Desde <input class="form-input" type="month" data-hist-desde value="${esc(recuerdo.desde ?? '')}" max="${mesActual}"/></label>
            <label>Hasta <input class="form-input" type="month" data-hist-hasta value="${esc(recuerdo.hasta ?? mesActual)}" max="${mesActual}"/></label>
          </div>`
        : '';
    return `<div class="hist-filtros" role="group" aria-label="Periodo">
        ${opcion('3', '3 meses')}${opcion('6', '6 meses')}${opcion('12', '12 meses')}${opcion('anio', 'Este año')}${opcion('personalizado', 'Elegir…')}
      </div>${personal}`;
  }

  function fichas(): string {
    return datos
      .map(({ mes, desglose }) => {
        const activo = recuerdo.vista === 'mes' && mes === seleccionado;
        const enCurso = mes === mesActual;
        return `<button type="button" class="hist-ficha${activo ? ' activa' : ''}" data-hist-mes="${mes}" aria-pressed="${activo}"
            title="${esc(nombreMes(mes))}${enCurso ? ' (en curso)' : ''}: gastos ${esc(formatEUR(desglose.gastosTotales))}, margen ${esc(conSigno(desglose.margen))}">
          <span class="hist-ficha-mes">${esc(mesCorto(mes))}${enCurso ? '*' : ''}</span>
          <span class="hist-ficha-margen ${desglose.margen >= 0 ? 'es-positivo' : 'es-negativo'}">${esc(conSigno(desglose.margen))}</span>
        </button>`;
      })
      .join('');
  }

  function detalle(): string {
    if (datos.length === 0) return '';
    if (recuerdo.vista === 'media') {
      const lista = datos.map((d) => d.desglose);
      const media = mediaDeDesgloses(lista);
      const acumulado = sumarDesgloses(lista);
      const titulo = `${nombreMes(datos[0].mes)} – ${nombreMes(datos[datos.length - 1].mes)}`;
      const enCurso = datos.some((d) => d.mes === mesActual);
      return `<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Media mensual · ${datos.length} ${datos.length === 1 ? 'mes' : 'meses'}</div>
          <div class="text-sm" style="color:var(--text3)">${esc(titulo)}${enCurso ? ' · incluye el mes en curso' : ''}</div></div>
          <span class="mes-ingresos">Entran <strong>${esc(formatEUR(media.ingresosNetos))}</strong> netos al mes</span>
        </div>
        ${cuerpoDesglose(media, { hoy: deps.hoy, media: { meses: datos.length, acumulado } })}`;
    }
    if (recuerdo.vista === 'acumulado') {
      const acc = sumarDesgloses(datos.map((d) => d.desglose));
      const titulo = `${nombreMes(datos[0].mes)} – ${nombreMes(datos[datos.length - 1].mes)}`;
      return `<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Acumulado · ${datos.length} ${datos.length === 1 ? 'mes' : 'meses'}</div>
          <div class="text-sm" style="color:var(--text3)">${esc(titulo)}</div></div>
          <span class="mes-ingresos">Entraron <strong>${esc(formatEUR(acc.ingresosNetos))}</strong> netos</span>
        </div>
        ${cuerpoDesglose(acc, { hoy: deps.hoy, meses: datos.length })}`;
    }
    const d = datos.find((x) => x.mes === seleccionado) ?? datos[datos.length - 1];
    const enCurso = d.mes === mesActual;
    return `<div class="hist-detalle-cab">
        <div class="card-title" style="margin:0">${esc(nombreMes(d.mes))}${enCurso ? ' · en curso' : ''}</div>
        <span class="mes-ingresos">Entraron <strong>${esc(formatEUR(d.desglose.ingresosNetos))}</strong> netos</span>
      </div>
      ${cuerpoDesglose(d.desglose, { hoy: deps.hoy, abierto: true, estimacion: enCurso ? estimacion : null })}`;
  }

  function resumenGraficas(): { gastos: string; ahorro: string } {
    if (datos.length === 0) return { gastos: '', ahorro: '' };
    const acc = sumarDesgloses(datos.map((d) => d.desglose));
    const peor = datos.reduce((a, b) => (b.desglose.margen < a.desglose.margen ? b : a));
    const mayor = datos.reduce((a, b) => (b.desglose.gastosTotales > a.desglose.gastosTotales ? b : a));
    return {
      gastos: `Gastos previstos por mes, de ${nombreMes(datos[0].mes)} a ${nombreMes(datos[datos.length - 1].mes)}. El mes de más gasto fue ${nombreMes(mayor.mes)}, con ${formatEUR(mayor.desglose.gastosTotales)}.`,
      ahorro: `Margen de ahorro de cada mes y acumulado. En el periodo: ${conSigno(acc.margen)}. El peor mes fue ${nombreMes(peor.mes)}, con ${conSigno(peor.desglose.margen)}.`,
    };
  }

  function render(): void {
    destruirGraficas();
    calcular();
    const resumen = resumenGraficas();
    const acc = datos.length ? sumarDesgloses(datos.map((d) => d.desglose)) : null;
    const hayChart = typeof (globalThis as { Chart?: unknown }).Chart === 'function';
    content.innerHTML = `
      <div class="modal-title">Meses anteriores</div>
      ${selectorPeriodo()}
      ${
        datos.length === 0
          ? '<p class="text-sm" style="margin-top:14px">Elige un mes de inicio anterior o igual al de fin.</p>'
          : `
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Gastos por mes</h3>
          <span class="text-sm" style="color:var(--text3)">Toca un mes para ver su desglose</span>
        </div>
        <div class="hist-estimacion">${
          estimacion && estimacion.meses > 0
            ? `<span class="mes-punto" style="--grupo:${COLORES_GRUPO.imprevistos}" aria-hidden="true"></span>Imprevistos estimados: <strong>${esc(formatEUR(estimacion.mediaMensual))}/mes</strong> · media de lo marcado en ${estimacion.meses} ${estimacion.meses === 1 ? 'mes' : 'meses'} (${esc(formatEUR(estimacion.total))} en total)`
            : 'Marca gastos o movimientos como «Imprevisto» y aquí aparecerá cuánto suelen costarte al mes.'
        }
        </div>
        ${hayChart ? `<div class="hist-lienzo"><canvas data-hist-gastos role="img" aria-label="${esc(resumen.gastos)}"></canvas></div>` : ''}
      </section>
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Impacto en el ahorro</h3>
          <span class="hist-total ${acc && acc.margen >= 0 ? 'es-positivo' : 'es-negativo'}">Acumulado ${esc(conSigno(acc?.margen ?? 0))}</span>
        </div>
        ${hayChart ? `<div class="hist-lienzo hist-lienzo--bajo"><canvas data-hist-ahorro role="img" aria-label="${esc(resumen.ahorro)}"></canvas></div>` : ''}
      </section>
      <div class="hist-fichas" role="group" aria-label="Meses del periodo">${fichas()}</div>
      ${datos.some((d) => d.mes === mesActual) ? '<div class="text-sm" style="color:var(--text3);margin-top:4px">* Mes en curso: incluye lo que queda por cargar.</div>' : ''}
      <div class="hist-filtros hist-vista" role="group" aria-label="Qué desglose ver">
        <button type="button" class="period-btn${recuerdo.vista === 'mes' ? ' active' : ''}" data-hist-vista="mes" aria-pressed="${recuerdo.vista === 'mes'}">Mes seleccionado</button>
        <button type="button" class="period-btn${recuerdo.vista === 'media' ? ' active' : ''}" data-hist-vista="media" aria-pressed="${recuerdo.vista === 'media'}">Media del periodo</button>
        <button type="button" class="period-btn${recuerdo.vista === 'acumulado' ? ' active' : ''}" data-hist-vista="acumulado" aria-pressed="${recuerdo.vista === 'acumulado'}">Acumulado del periodo</button>
      </div>
      <div data-hist-detalle>${detalle()}</div>`
      }`;
    if (hayChart && datos.length > 0) pintarGraficas();
  }

  /** Cambia el mes seleccionado sin rehacer las gráficas. */
  function seleccionar(mes: string): void {
    seleccionado = mes;
    recuerdo.vista = 'mes';
    const fichasEl = content.querySelector('.hist-fichas');
    if (fichasEl) fichasEl.innerHTML = fichas();
    content.querySelectorAll<HTMLElement>('[data-hist-vista]').forEach((b) => {
      const activo = b.dataset.histVista === 'mes';
      b.classList.toggle('active', activo);
      b.setAttribute('aria-pressed', String(activo));
    });
    const det = content.querySelector('[data-hist-detalle]');
    if (det) det.innerHTML = detalle();
    resaltar();
  }

  // ── Gráficas ────────────────────────────────────────────────────────────────

  const TEXTO = '#8b98ad';
  const REJILLA = 'rgba(255,255,255,0.06)';
  const SUPERFICIE = '#141b27';
  const POSITIVO = '#2ee6a8';
  const NEGATIVO = '#ff6b6b';
  const ACUMULADO = '#c9d3e3';

  /** El mes seleccionado a color pleno; el resto, atenuado. */
  const atenuar = (hex: string, i: number) => {
    if (recuerdo.vista !== 'mes' || datos[i]?.mes === seleccionado) return hex;
    return `${hex}66`;
  };

  function resaltar(): void {
    const [barras, ahorro] = graficas;
    if (barras) {
      const grupos = [COLORES_GRUPO.prestamos, COLORES_GRUPO.facturas, COLORES_GRUPO.otros, COLORES_GRUPO.imprevistos];
      barras.data.datasets.forEach((ds, k) => (ds.backgroundColor = datos.map((_, i) => atenuar(grupos[k], i))));
      barras.update('none');
    }
    if (ahorro) {
      const ds = ahorro.data.datasets[0];
      ds.backgroundColor = datos.map((d, i) => atenuar(d.desglose.margen >= 0 ? POSITIVO : NEGATIVO, i));
      ahorro.update('none');
    }
  }

  /**
   * Leyenda con el color BASE de cada serie. Por defecto Chart.js toma el de la
   * primera barra, que aquí cambia (atenuada si no es el mes elegido, roja si
   * ese mes fue negativo) y la leyenda dejaba de identificar la serie.
   */
  const leyenda = (colores: string[]) => ({
    position: 'top',
    align: 'start',
    labels: {
      color: '#c9d3e3',
      boxWidth: 10,
      boxHeight: 10,
      usePointStyle: true,
      font: { size: 12 },
      generateLabels: (chart: { data: { datasets: { label?: string }[] }; isDatasetVisible(i: number): boolean }) =>
        chart.data.datasets.map((ds, i) => ({
          text: ds.label ?? '',
          fillStyle: colores[i],
          strokeStyle: colores[i],
          lineWidth: 0,
          pointStyle: 'rectRounded',
          fontColor: '#c9d3e3',
          hidden: !chart.isDatasetVisible(i),
          datasetIndex: i,
        })),
    },
  });

  function pintarGraficas(): void {
    const Chart = (globalThis as { Chart?: ChartCtor }).Chart as ChartCtor;
    const etiquetas = datos.map((d) => (d.mes === mesActual ? `${mesCorto(d.mes)}*` : mesCorto(d.mes)));
    const ejes = (apilado: boolean) => ({
      x: { stacked: apilado, grid: { display: false }, ticks: { color: TEXTO, font: { size: 11 } }, border: { color: REJILLA } },
      y: {
        stacked: apilado,
        grid: { color: REJILLA },
        border: { display: false },
        ticks: { color: TEXTO, font: { size: 11 }, maxTicksLimit: 5, callback: (v: number) => eurCompacto.format(v) },
      },
    });
    const alPulsar = (ev: unknown, _els: unknown, chart: ChartLike) => {
      const pts = chart.getElementsAtEventForMode(ev, 'index', { intersect: false }, true);
      if (pts.length > 0 && datos[pts[0].index]) seleccionar(datos[pts[0].index].mes);
    };
    const comunes = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      interaction: { mode: 'index', intersect: false },
      onClick: alPulsar,
      onHover: (ev: { native?: { target?: HTMLElement } }, els: unknown[]) => {
        const t = ev.native?.target;
        if (t) t.style.cursor = els.length ? 'pointer' : 'default';
      },
    };
    const tooltip = (pie?: (i: number) => string) => ({
      backgroundColor: '#0d131d',
      borderColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      titleColor: '#eef3fb',
      bodyColor: '#c9d3e3',
      footerColor: '#8b98ad',
      padding: 10,
      callbacks: {
        title: (items: { dataIndex: number }[]) => nombreMes(datos[items[0].dataIndex].mes),
        label: (c: { dataset: { label: string }; raw: number }) => ` ${c.dataset.label}: ${formatEUR(c.raw)}`,
        ...(pie ? { footer: (items: { dataIndex: number }[]) => pie(items[0].dataIndex) } : {}),
      },
    });

    // 1 · Gastos por mes, apilados. Préstamos abajo (lo más fijo), otros arriba.
    const lienzoGastos = content.querySelector<HTMLCanvasElement>('[data-hist-gastos]');
    if (lienzoGastos) {
      const serie = (label: string, color: string, valores: number[], arriba: boolean) => ({
        label,
        data: valores,
        backgroundColor: datos.map((_, i) => atenuar(color, i)),
        // 2 px de superficie entre tramos, y esquinas redondeadas solo arriba.
        borderColor: SUPERFICIE,
        borderWidth: { top: 2 },
        borderSkipped: 'bottom',
        borderRadius: arriba ? { topLeft: 4, topRight: 4 } : 0,
        maxBarThickness: 38,
      });
      graficas.push(
        new Chart(lienzoGastos, {
          type: 'bar',
          data: {
            labels: etiquetas,
            datasets: [
              serie(
                'Préstamos',
                COLORES_GRUPO.prestamos,
                datos.map((d) => d.desglose.prestamos.total),
                false,
              ),
              serie(
                'Facturas',
                COLORES_GRUPO.facturas,
                datos.map((d) => d.desglose.facturas.total),
                false,
              ),
              serie(
                'Otros gastos',
                COLORES_GRUPO.otros,
                datos.map((d) => d.desglose.otros.total),
                false,
              ),
              // Arriba del todo: es lo que varía de un mes a otro y donde se
              // mira primero.
              serie(
                'Imprevistos',
                COLORES_GRUPO.imprevistos,
                datos.map((d) => d.desglose.imprevistos.total),
                true,
              ),
            ],
          },
          options: {
            ...comunes,
            scales: ejes(true),
            plugins: {
              legend: leyenda([COLORES_GRUPO.prestamos, COLORES_GRUPO.facturas, COLORES_GRUPO.otros, COLORES_GRUPO.imprevistos]),
              tooltip: tooltip((i) => `Total: ${formatEUR(datos[i].desglose.gastosTotales)}`),
            },
          },
        }),
      );
    }

    // 2 · Impacto en el ahorro: margen de cada mes (barras verde/rojo) y el
    //     acumulado del periodo (línea). Misma unidad, un solo eje.
    const lienzoAhorro = content.querySelector<HTMLCanvasElement>('[data-hist-ahorro]');
    if (lienzoAhorro) {
      let corrido = 0;
      const acumulado = datos.map((d) => (corrido = Math.round((corrido + d.desglose.margen) * 100) / 100));
      graficas.push(
        new Chart(lienzoAhorro, {
          type: 'bar',
          data: {
            labels: etiquetas,
            datasets: [
              {
                type: 'bar',
                label: 'Margen del mes',
                data: datos.map((d) => d.desglose.margen),
                backgroundColor: datos.map((d, i) => atenuar(d.desglose.margen >= 0 ? POSITIVO : NEGATIVO, i)),
                borderRadius: 4,
                borderSkipped: false,
                maxBarThickness: 38,
                order: 2,
              },
              {
                type: 'line',
                label: 'Ahorro acumulado',
                data: acumulado,
                borderColor: ACUMULADO,
                backgroundColor: ACUMULADO,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBorderColor: SUPERFICIE,
                pointBorderWidth: 2,
                tension: 0,
                order: 1,
              },
            ],
          },
          options: {
            ...comunes,
            scales: ejes(false),
            plugins: {
              legend: leyenda([POSITIVO, ACUMULADO]),
              tooltip: tooltip((i) => {
                const d = datos[i].desglose;
                return d.margenPct === null ? '' : `${d.margenPct.toFixed(0)} % de lo que entró`;
              }),
            },
          },
        }),
      );
    }
  }

  // ── Eventos (delegados: el contenedor es nuevo en cada apertura) ─────────────

  onClick(content, '[data-hist-preset]', (el) => {
    const p = el.getAttribute('data-hist-preset') as Preset;
    recuerdo.preset = p;
    if (p === 'personalizado') {
      // Arranca con lo que se estaba viendo, para no partir de cero.
      const actuales = datos.map((d) => d.mes);
      recuerdo.desde = recuerdo.desde ?? actuales[0] ?? sumarMesesA(mesActual, -5);
      recuerdo.hasta = recuerdo.hasta ?? actuales[actuales.length - 1] ?? mesActual;
    }
    render();
  });
  onChange(content, '[data-hist-desde], [data-hist-hasta]', () => {
    const desde = (content.querySelector('[data-hist-desde]') as HTMLInputElement | null)?.value;
    const hasta = (content.querySelector('[data-hist-hasta]') as HTMLInputElement | null)?.value;
    if (desde) recuerdo.desde = desde;
    if (hasta) recuerdo.hasta = hasta;
    render();
  });
  onClick(content, '[data-hist-mes]', (el) => seleccionar(el.getAttribute('data-hist-mes') as string));
  onClick(content, '[data-hist-vista]', (el) => {
    recuerdo.vista = el.getAttribute('data-hist-vista') as Vista;
    content.querySelectorAll<HTMLElement>('[data-hist-vista]').forEach((b) => {
      const activo = b.dataset.histVista === recuerdo.vista;
      b.classList.toggle('active', activo);
      b.setAttribute('aria-pressed', String(activo));
    });
    const fichasEl = content.querySelector('.hist-fichas');
    if (fichasEl) fichasEl.innerHTML = fichas();
    const det = content.querySelector('[data-hist-detalle]');
    if (det) det.innerHTML = detalle();
    resaltar();
  });

  render();
  overlay.classList.remove('hidden');
  return content;
}
