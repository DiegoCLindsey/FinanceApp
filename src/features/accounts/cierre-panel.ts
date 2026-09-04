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
import { cerrarMes, mesAnterior, mesesConDatos, type CierreMes } from '@/accounting/cierre-mes';
import type { Expense } from '@/state/schema';
import { esc, nombreMes, onChange, onClick, toast } from '../accounting/dom';

export interface CierrePanelDeps {
  ledger: Ledger;
  precision: PrecisionAnalyzer;
  adjuster: Adjuster;
  estimaciones: () => Expense[];
  onDatosCambiados: () => void;
  hoy?: () => ISODate;
}

export interface EstadoCierre {
  /** Mes que se está mirando, 'YYYY-MM'. Vacío = el último cerrable. */
  mes: string;
}

export function estadoCierreInicial(): EstadoCierre {
  return { mes: '' };
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

function calcular(deps: CierrePanelDeps, mes: string): CierreMes {
  const hoy = (deps.hoy ?? todayISO)();
  const estimaciones = deps.estimaciones();
  const analisis = deps.precision.analizarTodas(estimaciones, { hoy });
  return cerrarMes(deps.ledger, estimaciones, mes, { analisis, hoy });
}

export function renderCierrePanel(deps: CierrePanelDeps, estado: EstadoCierre): string {
  const mes = mesEfectivo(deps, estado);
  const opciones = mesesConDatos(deps.ledger);
  if (!opciones.includes(mes)) opciones.unshift(mes);

  const c = calcular(deps, mes);

  const selector = `
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${opciones.map((m) => `<option value="${esc(m)}"${m === mes ? ' selected' : ''}>${esc(nombreMes(m))}</option>`).join('')}
    </select>`;

  if (c.vacio) {
    return `
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${selector}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${esc(nombreMes(mes))}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué se desvió el mes respecto a lo que habías previsto.
        </div>
      </div>`;
  }

  const signo = (n: number) => (n > 0 ? '+' : '');
  const colorDesv = c.desviacion > 0 ? 'var(--red)' : c.desviacion < 0 ? 'var(--accent)' : 'var(--text2)';

  return `
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Cierre de mes</div>
        ${selector}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Habías previsto</div>
          <div class="stat-value" style="font-size:1.15rem">${esc(formatEUR(c.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${esc(formatEUR(c.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${colorDesv}">${signo(c.desviacion)}${esc(formatEUR(c.desviacion))}</div>
          <div class="stat-sub">${c.desviacion > 0 ? 'de más' : c.desviacion < 0 ? 'de menos' : 'clavado'}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${c.totalSinEstimacion > 0 ? 'var(--yellow)' : 'var(--text)'}">${esc(formatEUR(c.totalSinEstimacion))}</div>
          <div class="stat-sub">${c.sinEstimacion.length} concepto${c.sinEstimacion.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      ${tablaDesviaciones(c)}
      ${bloqueSinPrever(c)}
    </div>`;
}

function tablaDesviaciones(c: CierreMes): string {
  const conAlgo = c.filas.filter((f) => f.estimado > 0 || f.real > 0);
  if (conAlgo.length === 0) {
    return '<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';
  }

  const conSugerencia = conAlgo.filter((f) => f.sugerencia);

  return `
    <div class="card-title mb-8">Dónde te desviaste</div>
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
              const color = f.desviacion > 0 ? 'var(--red)' : f.desviacion < 0 ? 'var(--accent)' : 'var(--text2)';
              const s = f.sugerencia;
              return `<tr>
                <td style="font-size:12px">
                  ${esc(f.concepto)}
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

function bloqueSinPrever(c: CierreMes): string {
  if (c.sinEstimacion.length === 0) {
    return `<div class="alert-card alert-info">
      <div class="alert-icon">✓</div>
      <div class="alert-body">
        <div class="alert-title">Todo el gasto del mes estaba previsto</div>
        <div class="alert-sub">Ningún movimiento se queda fuera de tus estimaciones.</div>
      </div>
    </div>`;
  }

  return `
    <div class="card-title mb-8">Gasto que no tenías previsto</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Movimientos que no cuadran con ninguna estimación. Si alguno se repite mes a mes, merece una estimación propia.
    </div>
    <div class="table-wrap">
      <table style="min-width:320px">
        <thead><tr>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Movimientos</th>
          <th style="cursor:default;text-align:right">Total</th>
        </tr></thead>
        <tbody>
          ${c.sinEstimacion
            .slice(0, 10)
            .map(
              (g) => `<tr>
                <td style="font-size:12px">${esc(g.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${g.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${esc(formatEUR(g.total))}</td>
              </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    ${c.sinEstimacion.length > 10 ? `<div class="text-sm mt-8" style="color:var(--text3)">…y ${c.sinEstimacion.length - 10} concepto(s) más.</div>` : ''}`;
}

export function wireCierrePanel(raiz: HTMLElement, deps: CierrePanelDeps, estado: EstadoCierre, refrescar: () => void): void {
  onChange(raiz, '#cie-mes', (el) => {
    estado.mes = (el as HTMLSelectElement).value;
    refrescar();
  });

  onClick(raiz, '[data-cie-ajustar]', (el) => {
    const id = el.dataset.cieAjustar as string;
    const c = calcular(deps, mesEfectivo(deps, estado));
    const fila = c.filas.find((f) => f.estimacionId === id);
    if (!fila?.sugerencia) return;
    deps.adjuster.aplicar(fila.sugerencia.estimacionId, fila.sugerencia.cuantiaSugerida, { hoy: (deps.hoy ?? todayISO)() });
    toast(`«${fila.concepto}» ajustada a ${formatEUR(fila.sugerencia.cuantiaSugerida)}`);
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(raiz, '[data-cie-ajustar-todas]', () => {
    const c = calcular(deps, mesEfectivo(deps, estado));
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
