// ── features/loans/card ───────────────────────────────────────────────────────
// Tarjeta de un préstamo: cabecera plegable, estadísticas, análisis de ahorro
// por amortizaciones, coste ajustado a inflación y cuadro de amortización.
//
// El bloque "en euros de hoy" solo aparece si hay periodos de inflación
// cargados; el TIN real (Fisher) se muestra siempre que los haya, esté o no
// activo el módulo de inflación para gastos — es información del préstamo, no
// una proyección.

import { formatEUR, formatPct } from '@/core/money';
import { labelDiaPago } from '@/core/dates';
import { resumenPrestamoConAhorro, resumenPrestamo, type FilaAmortizacion, type LoanInput } from '@/core/loan';
import { calcFactorInflacion, calcInflacionMediaAnual, calcTipoRealFisher, type PeriodoInflacion } from '@/core/inflation';
import type { Loan, Persona } from '@/state/schema';
import { esc } from '../accounting/dom';
import { resumenRepartoDoble } from '../shared/reparto-widget';

export interface ContextoTarjeta {
  periodos: PeriodoInflacion[];
  /** `config.usarInflacion`: controla el bloque de coste en € de hoy. */
  usarInflacion: boolean;
  hoy: string;
  /** Cuota que toca pagar este mes, 0 si el préstamo aún no ha arrancado. */
  cuotaMes: number;
  completado: boolean;
  nombreEscenario: (id: string) => string;
  personas: Persona[];
}

/** Suma de intereses de una tabla deflactados a euros de hoy. */
function interesesEnEurosDeHoy(tabla: FilaAmortizacion[], periodos: PeriodoInflacion[], hoy: string): number {
  return tabla.reduce((s, r) => {
    if (r.esAmortizacion) return s;
    const f = calcFactorInflacion(periodos, hoy, r.fecha);
    return s + (f > 0 ? r.interes / f : r.interes);
  }, 0);
}

/** Coste total de un plan (cuotas + amortizaciones + comisiones) en € de hoy. */
function costeEnEurosDeHoy(tabla: FilaAmortizacion[], periodos: PeriodoInflacion[], hoy: string, comAp: number): number {
  return (
    tabla.reduce((s, r) => {
      const f = calcFactorInflacion(periodos, hoy, r.fecha);
      const importe = r.esAmortizacion ? r.amortizacion + r.comisionAmort : r.cuota;
      return s + (f > 0 ? importe / f : importe);
    }, 0) + comAp
  );
}

/**
 * Ahorro marginal de cada amortización: se recalcula el préstamo con las N
 * primeras y con las N+1 primeras, y la diferencia es lo que aporta la última.
 * Es secuencial a propósito — el orden importa, porque amortizar antes ahorra
 * más.
 */
function ahorrosPorAmortizacion(loan: Loan, periodos: PeriodoInflacion[], hoy: string) {
  const amorts = loan.amortizaciones || [];
  return amorts.map((_, idx) => {
    const base = resumenPrestamo({ ...loan, amortizaciones: amorts.slice(0, idx) } as LoanInput);
    const con = resumenPrestamo({ ...loan, amortizaciones: amorts.slice(0, idx + 1) } as LoanInput);
    return {
      nominal: base.totalIntereses - con.totalIntereses,
      real: interesesEnEurosDeHoy(base.tabla, periodos, hoy) - interesesEnEurosDeHoy(con.tabla, periodos, hoy),
    };
  });
}

const stat = (label: string, valor: string, sub = '', clase = '') =>
  `<div class="stat-card">
     <div class="stat-label">${esc(label)}</div>
     <div class="stat-value ${clase}">${valor}</div>
     ${sub}
   </div>`;

export function renderLoanCard(loan: Loan, ctx: ContextoTarjeta): string {
  const res = resumenPrestamoConAhorro(loan as LoanInput);
  const tieneAmorts = (loan.amortizaciones || []).length > 0;
  const hayInflacion = ctx.periodos.length > 0;
  const conInflac = ctx.usarInflacion && hayInflacion;

  // TIN real (Fisher) sobre la inflación media del periodo de vida del préstamo
  const inflMedia = hayInflacion ? calcInflacionMediaAnual(ctx.periodos, loan.fechaInicio || ctx.hoy, res.fechaFin || ctx.hoy, 0) : 0;
  const tinReal = hayInflacion ? calcTipoRealFisher(loan.tin || 0, inflMedia) : null;

  const ahorros = tieneAmorts && hayInflacion ? ahorrosPorAmortizacion(loan, ctx.periodos, ctx.hoy) : [];
  const ahorroRealIntereses = ahorros.length
    ? interesesEnEurosDeHoy(res.sinAmort.tabla, ctx.periodos, ctx.hoy) - interesesEnEurosDeHoy(res.tabla, ctx.periodos, ctx.hoy)
    : null;
  const ahorroRealNeto = ahorroRealIntereses === null ? null : ahorroRealIntereses - res.costeTotalAmort;

  const costeReal = conInflac ? costeEnEurosDeHoy(res.tabla, ctx.periodos, ctx.hoy, res.comAp) : null;
  const costeRealSinAmort = conInflac && tieneAmorts ? costeEnEurosDeHoy(res.sinAmort.tabla, ctx.periodos, ctx.hoy, res.comAp) : null;

  return `<div class="loan-card" style="${ctx.completado ? 'opacity:0.65' : ''}">
    <div class="loan-card-header" data-toggle-loan="${esc(loan._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${esc(loan.nombre)}</span>
        ${ctx.completado ? '<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>' : ''}
        ${loan.simulacion ? '<span class="badge badge-sim">SIM</span>' : ''}
        ${!loan.activo ? '<span class="badge badge-inactive">Inactivo</span>' : ''}
        ${loan.tipoTasa === 'variable' ? '<span class="badge badge-orange">Variable</span>' : ''}
        ${loan.basico !== false ? '<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>' : ''}
        ${(() => {
          const resumen = resumenRepartoDoble(loan.repartoConsumo, loan.repartoPago, ctx.personas);
          return resumen
            ? `<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${esc(resumen)}">👥 reparto</span>`
            : '';
        })()}
        ${(loan.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${esc(loan.tin)}%</span>
        <span class="text-sm">${esc(formatEUR(res.cuota))}/mes</span>
        <span class="text-sm">${esc(res.fechaFin || '—')}</span>
        <button class="btn-icon" data-amort-loan="${esc(loan._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${esc(loan._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${esc(loan._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${esc(loan._id)}">

      <div class="grid-4 mb-12">
        ${stat('Cuota mensual', esc(formatEUR(res.cuota)), ctx.cuotaMes > 0 ? `<div class="stat-sub" style="color:var(--accent)">Este mes: ${esc(formatEUR(ctx.cuotaMes))}</div>` : '')}
        ${stat(
          'Total intereses',
          esc(formatEUR(res.totalIntereses)),
          tieneAmorts
            ? `<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${esc(formatEUR(res.sinAmort.totalIntereses))}</div>`
            : '',
          'neg',
        )}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${esc(res.fechaFin || '—')}</div>
          ${
            tieneAmorts && res.fechaFin !== res.sinAmort.fechaFin
              ? `<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${esc(res.sinAmort.fechaFin || '—')}${res.ahorroTiempo > 0 ? ` (−${res.ahorroTiempo}m)` : ''}</div>`
              : ''
          }
        </div>
        ${stat('Total pagado', esc(formatEUR(res.totalPagado)), loan.capital ? `<div class="stat-sub">Capital: ${esc(formatEUR(loan.capital))}</div>` : '', 'neg')}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${esc(formatPct(res.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${esc(loan.tin)}%</div></div>
          ${
            tinReal !== null
              ? `<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${inflMedia.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${tinReal <= 0 ? 'var(--accent)' : tinReal < loan.tin ? 'var(--yellow)' : 'var(--text)'}">${tinReal.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${inflMedia.toFixed(1)}%)</span>
                   </div>
                 </div>`
              : ''
          }
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${esc(loan.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${esc(formatEUR(loan.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${esc(formatEUR(res.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${esc(loan.fechaInicio)}</div></div>
          ${loan.diaPago ? `<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${esc(labelDiaPago(loan.diaPago))}</div></div>` : ''}
        </div>
      </div>

      ${
        !tieneAmorts
          ? `<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${esc(loan._id)}">+ Amortizar</button>
               <button class="btn-secondary btn-sm" data-optimizar data-feature="optimizador">✨ Optimizar</button>
             </div>`
          : ''
      }

      ${
        tieneAmorts
          ? `<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${
                 ahorroRealIntereses !== null
                   ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${esc(formatEUR(res.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${esc(formatEUR(ahorroRealIntereses))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${esc(formatEUR(res.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${res.ahorroNeto >= 0 ? 'pos' : 'neg'}">${esc(formatEUR(res.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(ahorroRealNeto ?? 0) >= 0 ? 'pos' : 'neg'}" style="color:var(--yellow)">${esc(formatEUR(ahorroRealNeto ?? 0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${res.ahorroTiempo > 0 ? `${res.ahorroTiempo} meses` : '—'}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${inflMedia.toFixed(1)}% anual</div>`
                   : `<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${esc(formatEUR(res.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${esc(formatEUR(res.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${res.ahorroNeto >= 0 ? 'pos' : 'neg'}">${esc(formatEUR(res.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${res.ahorroTiempo > 0 ? `${res.ahorroTiempo} meses` : '—'}</div></div>
                      </div>`
               }
             </div>`
          : ''
      }

      ${costeReal !== null ? bloqueInflacion(loan, res.totalPagado, costeReal, costeRealSinAmort) : ''}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${conInflac ? '<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>' : ''}
          <th></th>
        </tr></thead>
        <tbody>${res.tabla.map((row) => filaTabla(row, conInflac, ctx)).join('')}</tbody>
      </table></div>

      ${
        tieneAmorts
          ? `<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(loan.amortizaciones || []).map((am, idx) => filaAmortizacion(loan._id, am, ahorros[idx] ?? null, ctx)).join('')}`
          : ''
      }
    </div>
  </div>`;
}

function bloqueInflacion(loan: Loan, totalPagado: number, costeReal: number, costeRealSinAmort: number | null): string {
  const avisoVariable =
    loan.tipoTasa === 'variable'
      ? '<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>'
      : '';

  // Con amortizaciones la comparación útil es contra el mismo plan sin ellas;
  // sin amortizaciones, contra el coste nominal.
  if (costeRealSinAmort !== null) {
    const ahorro = costeRealSinAmort - costeReal;
    const esAhorro = ahorro >= 0;
    return `<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${esc(formatEUR(costeRealSinAmort))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${esc(formatEUR(costeReal))}</div></div>
        <div><div class="stat-label">${esAhorro ? 'Ahorro real neto' : 'Sobrecoste real neto'}</div>
             <div class="num ${esAhorro ? 'pos' : 'neg'}">${esAhorro ? '−' : '+'}${esc(formatEUR(Math.abs(ahorro)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${avisoVariable}
    </div>`;
  }

  const beneficio = totalPagado - costeReal;
  const esBeneficio = beneficio >= 0;
  return `<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${esc(formatEUR(totalPagado))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${esBeneficio ? 'pos' : 'neg'}">${esc(formatEUR(costeReal))}</div></div>
      <div><div class="stat-label">${esBeneficio ? 'Ahorro por inflación' : 'Sobrecoste real'}</div>
           <div class="num ${esBeneficio ? 'pos' : 'neg'}">${esBeneficio ? '−' : '+'}${esc(formatEUR(Math.abs(beneficio)))}</div></div>
    </div>
    ${avisoVariable}
  </div>`;
}

function filaTabla(row: FilaAmortizacion, conInflac: boolean, ctx: ContextoTarjeta): string {
  let precioReal = '';
  if (conInflac && !row.esAmortizacion) {
    const f = calcFactorInflacion(ctx.periodos, ctx.hoy, row.fecha);
    precioReal = esc(formatEUR(f > 0 ? row.cuota / f : row.cuota));
  }
  return `<tr ${row.esAmortizacion ? 'style="background:var(--yellow-dim)"' : ''}>
    <td class="num">${row.esAmortizacion ? '—' : esc(row.mes)}</td>
    <td class="num">${esc(row.fecha)}</td>
    <td class="num">${row.esAmortizacion ? '—' : esc(formatEUR(row.cuota))}</td>
    <td class="num ${row.interes > 0 ? 'neg' : ''}">${esc(formatEUR(row.interes))}</td>
    <td class="num">${esc(formatEUR(row.amortizacion))}</td>
    <td class="num">${esc(formatEUR(row.capitalPendiente))}</td>
    ${conInflac ? `<td class="num pos" style="font-size:11px">${precioReal}</td>` : ''}
    <td>${row.esAmortizacion ? `<span class="badge badge-sim">AMORT${row.simulacion ? ' SIM' : ''}</span>` : ''}</td>
  </tr>`;
}

type AmortizacionLoan = NonNullable<Loan['amortizaciones']>[number];

function filaAmortizacion(
  loanId: string,
  am: AmortizacionLoan,
  ahorro: { nominal: number; real: number } | null,
  ctx: ContextoTarjeta,
): string {
  const escenarios = ((am as { escenarioIds?: string[] }).escenarioIds || [])
    .map((id) => `<span class="badge badge-yellow">🔭 ${esc(ctx.nombreEscenario(id))}</span>`)
    .join('');
  return `<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${esc(am.fecha)}</span>
    <span class="num">${esc(formatEUR(am.cantidad))}</span>
    <span class="badge ${am.simulacion ? 'badge-sim' : 'badge-active'}">${am.simulacion ? 'SIM' : 'REAL'}</span>
    <span class="badge badge-blue">${am.tipo === 'plazo' ? '↓ plazo' : '↓ cuota'}</span>
    ${escenarios}
    ${
      ahorro
        ? `<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${esc(formatEUR(ahorro.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${esc(formatEUR(ahorro.real))} real</span>
           </span>`
        : ''
    }
    <button class="btn-icon" data-editar-amort="${esc(loanId)}|${esc(am._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${esc(loanId)}|${esc(am._id)}">✕</button>
  </div>`;
}
