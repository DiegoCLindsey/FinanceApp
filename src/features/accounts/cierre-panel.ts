// ── features/accounting/cierre-panel ──────────────────────────────────────────
// Cierre de mes: el momento en que se compara lo estimado con lo que pasó.
//
// El cálculo vive en `@/accounting/cierre-mes` (puro y con tests); aquí solo hay
// presentación y cableado.
//
// Frente al panel de precisión, que es una tabla agregada y permanente, éste es
// un RITUAL sobre un mes: qué preví, qué pasó, en qué me desvié y qué gasté sin
// tenerlo previsto. Esa última pregunta es la que nadie se hacía y donde suele
// estar la diferencia de verdad.

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import type { Ledger } from '@/accounting/ledger';
import type { Adjuster } from '@/accounting/adjust';
import type { PrecisionAnalyzer } from '@/accounting/precision';
import {
  cerrarMes,
  cerrarPeriodo,
  mesAnterior,
  mesesConDatos,
  previsionesDelPeriodo,
  type CierreMes,
  type GrupoSinEstimacion,
  type OpcionesCierre,
} from '@/accounting/cierre-mes';
import type { Expense, Loan, Nomina } from '@/state/schema';
import { confirmar, esc, nombreMes, onChange, onClick, toast } from '../accounting/dom';
import { renderAnillosTag } from './anillos-tag';

export interface CierrePanelDeps {
  ledger: Ledger;
  precision: PrecisionAnalyzer;
  adjuster: Adjuster;
  estimaciones: () => Expense[];
  /** Nóminas y préstamos: lo previsible que no vive en `expenses`. */
  nominas: () => Nomina[];
  loans: () => Loan[];
  resolverTramosIRPF?: () => (año: number) => [number, number][];
  /** Conceptos que el usuario ha decidido no contar, y cómo cambiarlos. */
  omitidos: () => string[];
  setOmitidos: (claves: string[]) => void;
  onDatosCambiados: () => void;
  /** Intervalo configurado en la cabecera del dashboard. */
  periodo: () => { desde: ISODate; hasta: ISODate };
  hoy?: () => ISODate;
}

export interface EstadoCierre {
  /** Mes que se está mirando, 'YYYY-MM'. Vacío = el último cerrable. */
  mes: string;
  /**
   * `mes` cierra un mes natural; `periodo` cierra el intervalo de la cabecera,
   * que puede cruzar varios meses o cortar uno por la mitad. Se arranca en
   * `mes` porque cerrar el mes es el ritual habitual; el periodo es para
   * preguntas concretas («¿cómo fue de abril a junio?»).
   */
  modo: 'mes' | 'periodo';
}

export function estadoCierreInicial(): EstadoCierre {
  return { mes: '', modo: 'mes' };
}

/** Mes a enseñar: el elegido, o el último con datos, o el anterior a hoy. */
export function mesEfectivo(deps: CierrePanelDeps, estado: EstadoCierre): string {
  if (estado.mes) return estado.mes;
  const conDatos = mesesConDatos(deps.ledger);
  const anterior = mesAnterior((deps.hoy ?? todayISO)());
  // Se prefiere el mes anterior si tiene datos: es «el mes que toca cerrar».
  if (conDatos.includes(anterior)) return anterior;
  return conDatos[0] ?? anterior;
}

/** Calcula el cierre del modo activo: el mes elegido o el periodo del header. */
export function calcularCierre(deps: CierrePanelDeps, estado: EstadoCierre): CierreMes {
  const hoy = (deps.hoy ?? todayISO)();
  const estimaciones = deps.estimaciones();
  const comunes: OpcionesCierre = {
    hoy,
    nominas: deps.nominas(),
    loans: deps.loans(),
    resolverTramosIRPF: deps.resolverTramosIRPF?.(),
    omitidos: deps.omitidos(),
  };
  if (estado.modo === 'periodo') {
    const { desde, hasta } = deps.periodo();
    // El análisis de precisión se restringe al mismo intervalo: si no, las
    // sugerencias de ajuste hablarían de un histórico que no es el que se está
    // mirando en pantalla.
    const analisis = deps.precision.analizarTodas(estimaciones, { hoy, desde, hasta });
    return cerrarPeriodo(deps.ledger, estimaciones, desde, hasta, { ...comunes, analisis });
  }
  const analisis = deps.precision.analizarTodas(estimaciones, { hoy });
  return cerrarMes(deps.ledger, estimaciones, mesEfectivo(deps, estado), { ...comunes, analisis });
}

/** Opciones del desplegable «Asignar a…», ya en HTML, por tipo de movimiento. */
interface OpcionesAsignar {
  gasto: string;
  ingreso: string;
}

/**
 * A qué se puede asignar un grupo de imprevistos: a cualquier previsión del
 * mismo signo. Se sacan de `previsionesDelPeriodo` para que la lista sea la
 * misma que compara el cierre, préstamos y nóminas incluidos.
 */
function opcionesAsignar(deps: CierrePanelDeps): OpcionesAsignar {
  const hoy = (deps.hoy ?? todayISO)();
  const previsiones = previsionesDelPeriodo(deps.estimaciones(), hoy, hoy, {
    nominas: deps.nominas(),
    loans: deps.loans(),
    resolverTramosIRPF: deps.resolverTramosIRPF?.(),
  });
  const opciones = (tipo: 'gasto' | 'ingreso') =>
    previsiones
      .filter((p) => p.tipo === tipo)
      .map((p) => `<option value="${esc(p._id)}">${esc(p.concepto)}</option>`)
      .join('');
  return { gasto: opciones('gasto'), ingreso: opciones('ingreso') };
}

/**
 * El mismo importe repartido entre los meses del periodo. Un total de 21.000 €
 * no dice nada por sí solo: son cinco meses o uno, y la cifra cambia de
 * significado por completo.
 */
function alMes(total: number, meses: number): string {
  if (meses <= 0) return '—';
  return `${esc(formatEUR(total / meses))}/mes`;
}

/** Botón de modo, con el aspecto de pestaña seleccionada del resto de vistas. */
function botonModo(modo: EstadoCierre['modo'], activo: boolean, etiqueta: string, titulo: string): string {
  const seleccionado = activo ? 'background:var(--accent);color:#04120c;border-color:var(--accent)' : '';
  return `<button class="btn-secondary btn-sm" data-cie-modo="${modo}" title="${esc(titulo)}" style="${seleccionado}">${esc(etiqueta)}</button>`;
}

export function renderCierrePanel(deps: CierrePanelDeps, estado: EstadoCierre): string {
  const periodo = estado.modo === 'periodo';
  const mes = mesEfectivo(deps, estado);
  const opciones = mesesConDatos(deps.ledger);
  if (!opciones.includes(mes)) opciones.unshift(mes);

  const c = calcularCierre(deps, estado);
  const titulo = periodo ? 'Cierre del periodo' : 'Cierre de mes';
  const queSeCierra = periodo ? `del ${esc(c.desde)} al ${esc(c.hasta)}` : esc(nombreMes(mes));

  const controles = `
    <div class="flex gap-6 items-center flex-wrap">
      ${botonModo('mes', !periodo, 'Mes', 'Cierra un mes natural completo')}
      ${botonModo('periodo', periodo, 'Periodo del header', 'Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad')}
      ${
        periodo
          ? `<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${esc(c.desde)} → ${esc(c.hasta)}</span>`
          : `<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${opciones.map((m) => `<option value="${esc(m)}"${m === mes ? ' selected' : ''}>${esc(nombreMes(m))}</option>`).join('')}
             </select>`
      }
    </div>`;

  if (c.vacio) {
    return `
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">${titulo}</div>
          ${controles}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados ${periodo ? '' : 'en '}${queSeCierra}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué te desviaste respecto a lo que habías previsto.
        </div>
      </div>`;
  }

  const signo = (n: number) => (n > 0 ? '+' : '');
  // En neto, quedarse por debajo de lo previsto es lo malo (menos dinero del
  // esperado), justo al revés que mirando solo el gasto.
  const colorDesv = c.desviacionNeta < 0 ? 'var(--red)' : c.desviacionNeta > 0 ? 'var(--accent)' : 'var(--text2)';

  return `
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">${titulo}</div>
        ${controles}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:6px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Gasto</div>
          <div class="stat-value" style="font-size:1.15rem">${esc(formatEUR(c.real))}</div>
          <div class="stat-sub">${alMes(c.real, c.meses)} · previsto ${esc(formatEUR(c.estimado))} (${alMes(c.estimado, c.meses)})</div>
          <div class="stat-sub">${signo(c.desviacion)}${esc(formatEUR(c.desviacion))} · ${signo(c.desviacion)}${alMes(c.desviacion, c.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${esc(formatEUR(c.ingresosReales))}</div>
          <div class="stat-sub">${alMes(c.ingresosReales, c.meses)} · previsto ${esc(formatEUR(c.ingresosEstimados))} (${alMes(c.ingresosEstimados, c.meses)})</div>
          <div class="stat-sub">${signo(c.desviacionIngresos)}${esc(formatEUR(c.desviacionIngresos))} · ${signo(c.desviacionIngresos)}${alMes(c.desviacionIngresos, c.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${colorDesv}">${signo(c.desviacionNeta)}${esc(formatEUR(c.desviacionNeta))}</div>
          <div class="stat-sub">${signo(c.desviacionNeta)}${alMes(c.desviacionNeta, c.meses)}</div>
          <div class="stat-sub">neto real ${esc(formatEUR(c.netoReal))} · previsto ${esc(formatEUR(c.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${c.totalSinEstimacion > 0 ? 'var(--yellow)' : 'var(--text)'}">${esc(formatEUR(c.totalSinEstimacion))}</div>
          <div class="stat-sub">${alMes(c.totalSinEstimacion, c.meses)} · ${c.sinEstimacion.length} concepto${c.sinEstimacion.length !== 1 ? 's' : ''} de gasto</div>
          <div class="stat-sub">${c.totalIngresosSinPrever > 0 ? `${esc(formatEUR(c.totalIngresosSinPrever))} de ingreso` : 'sin ingresos sueltos'}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${esc(c.meses.toFixed(1).replace('.', ','))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${tablaDesviaciones(c)}
      ${bloqueSinPrever(c, opcionesAsignar(deps))}
      ${bloqueIngresosSinPrever(c, opcionesAsignar(deps))}
      ${bloqueOmitidos(c)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${renderAnillosTag(c.porTag)}
    </div>`;
}

function tablaDesviaciones(c: CierreMes): string {
  const conAlgo = c.filas.filter((f) => f.estimado > 0 || f.real > 0);
  if (conAlgo.length === 0) {
    return '<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';
  }

  const conSugerencia = conAlgo.filter((f) => f.sugerencia);

  return `
    <div class="card-title mb-8">Dónde te desviaste (gastos e ingresos)</div>
    <div class="table-wrap mb-12">
      <table style="min-width:460px">
        <thead><tr>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Previsto</th>
          <th style="cursor:default;text-align:right">Real</th>
          <th style="cursor:default;text-align:right">Desviación</th>
          <th style="cursor:default"></th>
        </tr></thead>
        <tbody>
          ${conAlgo
            .map((f) => {
              // Gastar de más es rojo; cobrar de más, verde.
              const malo = f.tipo === 'gasto' ? f.desviacion > 0 : f.desviacion < 0;
              const color = f.desviacion === 0 ? 'var(--text2)' : malo ? 'var(--red)' : 'var(--accent)';
              const s = f.sugerencia;
              return `<tr>
                <td style="font-size:12px">
                  ${esc(f.concepto)}
                  ${f.tipo === 'ingreso' ? '<span class="badge" style="margin-left:6px">ingreso</span>' : ''}
                  ${f.sinMovimiento ? '<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>' : ''}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${esc(formatEUR(f.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${esc(formatEUR(f.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${color}">
                  ${f.desviacion > 0 ? '+' : ''}${esc(formatEUR(f.desviacion))}
                </td>
                <td style="text-align:right">
                  ${
                    s
                      ? `<button class="btn-secondary btn-sm" data-cie-ajustar="${esc(f.estimacionId)}"
                           title="Pasar la estimación de ${esc(formatEUR(s.cuantiaActual))} a ${esc(formatEUR(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${esc(formatEUR(s.cuantiaSugerida))}</button>`
                      : ''
                  }
                </td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
    ${
      conSugerencia.length > 0
        ? `<div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
             <div class="text-sm" style="color:var(--text2)">
               ${conSugerencia.length} estimación${conSugerencia.length !== 1 ? 'es' : ''} se desvía${conSugerencia.length !== 1 ? 'n' : ''}
               de forma sistemática. Ajustarla cierra la estimación de hoy y abre una nueva con el importe corregido.
             </div>
             <button class="btn-primary btn-sm" data-cie-ajustar-todas>Ajustar todas</button>
           </div>`
        : ''
    }`;
}

/**
 * Una fila de la lista de imprevistos, con lo que se puede hacer con ella.
 *
 * Enseñar el problema sin dar la salida era la mitad del trabajo: la lista se
 * repetía mes a mes con los mismos veinte conceptos. Ahora cada grupo se puede
 * asignar entero a una previsión (deja de ser imprevisto y pasa a compararse) u
 * omitir (deja de contar, como una transferencia).
 */
function filaSinPrever(g: GrupoSinEstimacion, meses: number, opciones: string, color: string): string {
  return `<tr>
    <td style="font-size:12px">${esc(g.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${g.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${color}">${esc(formatEUR(g.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${alMes(g.total, meses)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${esc(g.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${opciones}
      </select>
      <button class="btn-secondary btn-sm" data-cie-omitir="${esc(g.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`;
}

const CABECERA_SIN_PREVER = `<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;

function bloqueSinPrever(c: CierreMes, opciones: OpcionesAsignar): string {
  if (c.sinEstimacion.length === 0) {
    return `<div class="alert-card alert-info">
      <div class="alert-icon">✓</div>
      <div class="alert-body">
        <div class="alert-title">Todo el gasto estaba previsto</div>
        <div class="alert-sub">Ningún movimiento se queda fuera de tus estimaciones.</div>
      </div>
    </div>`;
  }

  return `
    <div class="card-title mb-8">Gasto que no tenías previsto</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Movimientos que no cuadran con ninguna previsión. Asigna el grupo entero a una estimación
      (o a un préstamo) si es eso, u omítelo si no es gasto tuyo — un traspaso interno, por ejemplo.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${CABECERA_SIN_PREVER}
        <tbody>
          ${c.sinEstimacion
            .slice(0, 10)
            .map((g) => filaSinPrever(g, c.meses, opciones.gasto, 'var(--yellow)'))
            .join('')}
        </tbody>
      </table>
    </div>
    ${c.sinEstimacion.length > 10 ? `<div class="text-sm mt-8" style="color:var(--text3)">…y ${c.sinEstimacion.length - 10} concepto(s) más.</div>` : ''}`;
}

/** Lo que el usuario ha decidido no contar, con la puerta de vuelta. */
function bloqueOmitidos(c: CierreMes): string {
  if (c.omitidos.length === 0) return '';
  return `
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${c.omitidos.length} concepto(s) omitido(s), ${esc(formatEUR(c.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${c.omitidos
        .map(
          (g) => `<button class="btn-secondary btn-sm" data-cie-restaurar="${esc(g.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${esc(g.concepto)} · ${esc(formatEUR(g.total))} ✕</button>`,
        )
        .join('')}
    </div>`;
}

/**
 * Ingresos que no preveía ninguna estimación. Suelen ser el otro lado de un
 * traspaso entre cuentas propias: el cargo aparece como gasto y, si el abono no
 * se cuenta en ninguna parte, la desviación se dispara sin motivo.
 */
function bloqueIngresosSinPrever(c: CierreMes, opciones: OpcionesAsignar): string {
  if (c.ingresosSinPrever.length === 0) return '';
  return `
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${CABECERA_SIN_PREVER}
        <tbody>
          ${c.ingresosSinPrever
            .slice(0, 10)
            .map((g) => filaSinPrever(g, c.meses, opciones.ingreso, 'var(--accent)'))
            .join('')}
        </tbody>
      </table>
    </div>
    ${c.ingresosSinPrever.length > 10 ? `<div class="text-sm mt-8" style="color:var(--text3)">…y ${c.ingresosSinPrever.length - 10} concepto(s) más.</div>` : ''}`;
}

export function wireCierrePanel(raiz: HTMLElement, deps: CierrePanelDeps, estado: EstadoCierre, refrescar: () => void): void {
  onChange(raiz, '#cie-mes', (el) => {
    estado.mes = (el as HTMLSelectElement).value;
    refrescar();
  });

  onClick(raiz, '[data-cie-modo]', (el) => {
    estado.modo = (el.getAttribute('data-cie-modo') as EstadoCierre['modo']) || 'mes';
    refrescar();
  });

  // Omitir es una decisión sobre el CONCEPTO, no sobre los movimientos de este
  // periodo: si no, habría que repetirla cada mes con el mismo traspaso.
  onClick(raiz, '[data-cie-omitir]', (el) => {
    const clave = el.getAttribute('data-cie-omitir') as string;
    const actuales = deps.omitidos();
    if (actuales.includes(clave)) return;
    deps.setOmitidos([...actuales, clave]);
    toast('Concepto omitido: deja de contar en el cierre');
    refrescar();
  });

  onClick(raiz, '[data-cie-restaurar]', (el) => {
    const clave = el.getAttribute('data-cie-restaurar') as string;
    deps.setOmitidos(deps.omitidos().filter((k) => k !== clave));
    refrescar();
  });

  onChange(raiz, '[data-cie-asignar]', (el) => {
    const select = el as HTMLSelectElement;
    const clave = select.getAttribute('data-cie-asignar') as string;
    const destino = select.value;
    if (!destino) return;
    const c = calcularCierre(deps, estado);
    const grupo = [...c.sinEstimacion, ...c.ingresosSinPrever].find((g) => g.clave === clave);
    if (!grupo) return;
    if (!confirmar(`Se van a asignar ${grupo.movimientos} movimiento(s) de «${grupo.concepto}». ¿Continuar?`)) {
      select.value = '';
      return;
    }
    for (const id of grupo.ids) deps.ledger.asignarEstimacion(id, destino);
    toast(`${grupo.movimientos} movimiento(s) asignados`);
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(raiz, '[data-cie-ajustar]', (el) => {
    const id = el.dataset.cieAjustar as string;
    const c = calcularCierre(deps, estado);
    const fila = c.filas.find((f) => f.estimacionId === id);
    if (!fila?.sugerencia) return;
    deps.adjuster.aplicar(fila.sugerencia.estimacionId, fila.sugerencia.cuantiaSugerida, { hoy: (deps.hoy ?? todayISO)() });
    toast(`«${fila.concepto}» ajustada a ${formatEUR(fila.sugerencia.cuantiaSugerida)}`);
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(raiz, '[data-cie-ajustar-todas]', () => {
    const c = calcularCierre(deps, estado);
    const sugerencias = c.filas.map((f) => f.sugerencia).filter((s): s is NonNullable<typeof s> => s !== null);
    if (sugerencias.length === 0) return;
    const { aplicadas, errores } = deps.adjuster.aplicarTodas(sugerencias, { hoy: (deps.hoy ?? todayISO)() });
    toast(
      `${aplicadas.length} estimación${aplicadas.length !== 1 ? 'es' : ''} ajustada${aplicadas.length !== 1 ? 's' : ''}` +
        (errores.length > 0 ? ` · ${errores.length} con error` : ''),
    );
    deps.onDatosCambiados();
    refrescar();
  });
}
