// ── features/accounts/card ────────────────────────────────────────────────────
// Tarjeta de una cuenta/fondo y resumen de cartera de fondos de inversión.
//
// Todo el HTML sale de aquí; el cableado (delegación de eventos) vive en el
// índice de la feature. El texto del usuario se escapa siempre.

import { formatEUR } from '@/core/money';
import { parseLocalDate } from '@/core/dates';
import { modeloFondoDe, saldoEnFecha, saldoRealCuenta } from '@/core/accounts';
import { calcFactorInflacion, type PeriodoInflacion } from '@/core/inflation';
import { calcFondoInversion, calcFondosPension } from '@/core/tax/pension';
import { calcGananciasCapital } from '@/core/tax/ahorro';
import { tipoMarginalGrupo } from '@/core/tax/nomina-grupo';
import type { Tramos } from '@/core/tax/irpf';
import type { Account, AppConfig, Nomina } from '@/state/schema';
import { esc } from '../accounting/dom';

const ICONO_EDITAR =
  'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z';
const ICONO_HISTORICO =
  'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z';

/** Etiqueta y límite anual de exención de cada tipo de tarjeta beneficio. */
export const TIPOS_BENEFICIO: Record<string, { label: string; limiteAnual: number | null }> = {
  transporte: { label: 'Transporte', limiteAnual: 1500 },
  restaurante: { label: 'Restaurante', limiteAnual: 2640 },
  otros: { label: 'Otros', limiteAnual: null },
};

/** Una línea de transferencia proyectada sobre la cuenta durante el período. */
export interface LineaFlujo {
  concepto: string;
  /** Nombre de la otra cuenta implicada. */
  contraparte: string;
  /** Suma de todas las ocurrencias dentro del período. */
  total: number;
  ocurrencias: number;
}

/** Aportaciones y reembolsos proyectados sobre un fondo en el período. */
export interface FlujosCuenta {
  entradas: LineaFlujo[];
  salidas: LineaFlujo[];
  totalAportaciones: number;
  totalReembolsos: number;
  /** Retención de IRPF que el motor proyecta por los reembolsos (art. 101 LIRPF). */
  retencion: number;
}

export const FLUJOS_VACIOS: FlujosCuenta = { entradas: [], salidas: [], totalAportaciones: 0, totalReembolsos: 0, retencion: 0 };

export interface CardCtx {
  config: AppConfig;
  inflacion: PeriodoInflacion[];
  nominas: Nomina[];
  tramosIRPF: Tramos;
  tramosGanancias: Tramos;
  flujos: (accId: string) => FlujosCuenta;
  invModo: (accId: string) => 'real' | 'proyeccion';
}

// ── Cartera de fondos de inversión ────────────────────────────────────────────

/** Tarjeta agregada de todos los fondos de inversión activos. */
export function carteraFiscalHtml(accounts: Account[], tramos: Tramos): string {
  const inversiones = accounts.filter((a) => a.activo && modeloFondoDe(a) === 'inversion');
  if (inversiones.length === 0) return '';

  let saldo = 0;
  let costBase = 0;
  let plusvalia = 0;
  let impuesto = 0;
  for (const a of inversiones) {
    const r = calcFondoInversion(a, tramos);
    if (!r) continue;
    saldo += r.saldo;
    costBase += r.costBase;
    plusvalia += r.plusvalia;
    impuesto += r.impuesto;
  }
  const pct = costBase > 0 ? ((plusvalia / costBase) * 100).toFixed(1) : '0';

  return `
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${esc(formatEUR(saldo))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${esc(formatEUR(costBase))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${esc(pct)}%)</div><div class="stat-value ${plusvalia >= 0 ? 'pos' : 'neg'}">${esc(formatEUR(plusvalia))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${esc(formatEUR(impuesto))}</div><div class="stat-sub">Neto: ${esc(formatEUR(saldo - impuesto))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`;
}

// ── Bloques de la tarjeta ─────────────────────────────────────────────────────

/** Intereses estimados del período del dashboard, y su beneficio real si hay inflación. */
function remuneracionHtml(acc: Account, ctx: CardCtx): string {
  if (!acc.activo || !acc.interes || acc.interes <= 0) return '';
  const { dashboardStart: dS, dashboardEnd: dE } = ctx.config;
  const meses = Math.max(1, (parseLocalDate(dE).getTime() - parseLocalDate(dS).getTime()) / (30.44 * 86400000));
  const saldoBase = saldoEnFecha(acc, dS);
  const interesEstimado = saldoBase * (Math.pow(1 + acc.interes / 100, meses / 12) - 1);

  let real = '';
  if (ctx.config.usarInflacion && ctx.inflacion.length > 0) {
    const perdida = saldoBase * (calcFactorInflacion(ctx.inflacion, dS, dE) - 1);
    const beneficioReal = interesEstimado - perdida;
    real = `
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${esc(formatEUR(perdida))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${beneficioReal >= 0 ? 'var(--accent)' : 'var(--red)'};font-weight:600">${esc(formatEUR(beneficioReal))}</span>
      </div>`;
  }

  return `<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${esc(dS.slice(0, 7))} → ${esc(dE.slice(0, 7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${esc(formatEUR(interesEstimado))}</span>
    </div>${real}
  </div>`;
}

/**
 * Tarjeta beneficio: recargas que le llegan desde las nóminas y el ahorro de
 * IRPF que suponen. El tipo marginal sale del grupo de nóminas cuando la cuenta
 * lo declara (es el euro marginal del conjunto), y si no del bruto de la
 * primera nómina vinculada.
 */
function beneficioHtml(acc: Account, ctx: CardCtx): string {
  const tipoInfo = TIPOS_BENEFICIO[acc.tipoBeneficio ?? ''] ?? { label: 'Beneficio', limiteAnual: null };
  const { limiteAnual } = tipoInfo;

  const recargas = ctx.nominas.flatMap((n) =>
    (n.retribucionFlexible ?? []).filter((c) => c.cuenta === acc._id).map((c) => ({ nomina: n, importe: c.importe })),
  );
  const recargaMensual = recargas.reduce((s, r) => s + r.importe, 0);
  const recargaAnual = recargaMensual * 12;
  const excede = limiteAnual !== null && recargaAnual > limiteAnual;

  // Solo el importe exento (hasta el límite) ahorra impuesto
  const exento = limiteAnual !== null ? Math.min(recargaAnual, limiteAnual) : recargaAnual;
  // Sin grupo se toma la primera nómina vinculada como grupo de una: así el
  // tipo sale de su base imponible, igual que en el caso de grupo. El legacy
  // usaba aquí `bruto × nPagas` sobre el bruto, que YA es anual — multiplicaba
  // la base por doce y disparaba el tipo marginal al tramo más alto.
  const grupo = acc.grupoNomina
    ? ctx.nominas.filter((n) => (n.grupoNomina || '') === acc.grupoNomina && n.activo !== false)
    : recargas.slice(0, 1).map((r) => r.nomina);
  const tipoUsado = tipoMarginalGrupo(grupo, ctx.tramosIRPF);
  const ahorroFiscal = (exento * tipoUsado) / 100;

  const detalleTipo = acc.grupoNomina ? `grupo "${acc.grupoNomina}", tipo marginal ${tipoUsado}%` : `tipo marginal ${tipoUsado}%`;

  return `<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${esc(tipoInfo.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${esc(formatEUR(recargaMensual))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${excede ? 'neg' : 'pos'}">${esc(formatEUR(recargaAnual))}/año${excede ? ` ⚠ excede límite ${esc(formatEUR(limiteAnual as number))}` : ''}</span>
    </div>
    ${
      limiteAnual !== null
        ? `<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${esc(formatEUR(limiteAnual))}/año</span></div>`
        : ''
    }
    ${
      ahorroFiscal > 0
        ? `<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${esc(detalleTipo)}">≈ ${esc(formatEUR(ahorroFiscal))}/año <span style="font-size:10px;color:var(--text3)">(${esc(tipoUsado)}%)</span></span></div>`
        : ''
    }
    ${
      recargas.length > 0
        ? recargas
            .map((r) => `<div style="font-size:11px;color:var(--text3)">↩ ${esc(r.nomina.nombre)}: ${esc(formatEUR(r.importe))}/mes</div>`)
            .join('')
        : '<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'
    }
  </div>`;
}

function pensionHtml(acc: Account): string {
  const p = calcFondosPension(acc);
  if (!p) return '';
  return `<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${esc(formatEUR(p.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${esc(formatEUR(p.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${p.beneficio >= 0 ? 'pos' : 'neg'}">${esc(formatEUR(p.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${esc(formatEUR(p.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${p.proxDesbloqueo ? `Próx. desbloqueo: ${esc(p.proxDesbloqueo)}` : 'Todas las aportaciones disponibles'}
      · ${esc(acc.impuestoRetirada ?? 0)}% sobre beneficio al retirar · ${p.numAportaciones} aportaciones
    </div>
  </div>`;
}

/**
 * Fondo de inversión: situación real (coste base, valor, neto) o proyección al
 * fin del período con las aportaciones y reembolsos que el motor proyecta.
 */
function inversionHtml(acc: Account, ctx: CardCtx): string {
  const inv = calcFondoInversion(acc, ctx.tramosGanancias);
  if (!inv) return '';
  const cfg = ctx.config;
  const flujos = ctx.flujos(acc._id);

  const dS = parseLocalDate(cfg.dashboardStart);
  const dE = parseLocalDate(cfg.dashboardEnd);
  const mesesPeriodo = Math.max(0, (dE.getTime() - dS.getTime()) / (30.44 * 86400000));

  const totalBase = inv.saldo + flujos.totalAportaciones - flujos.totalReembolsos;
  const tasaMensual = acc.interes > 0 ? Math.pow(1 + acc.interes / 100, 1 / 12) - 1 : 0;
  const saldoProyectado =
    totalBase > 0 && mesesPeriodo > 0 ? Math.max(0, totalBase * Math.pow(1 + tasaMensual, mesesPeriodo)) : Math.max(0, totalBase);
  const costBaseProyectado = inv.costBase + flujos.totalAportaciones;
  const plusvaliaProyectada = Math.max(0, saldoProyectado - costBaseProyectado);
  const impuestoProyectado = calcGananciasCapital(plusvaliaProyectada, ctx.tramosGanancias);
  const tipoEfectivo = plusvaliaProyectada > 0 ? ((impuestoProyectado / plusvaliaProyectada) * 100).toFixed(1) : '0';
  const labelRent = acc.interes > 0 ? `${acc.interes}% anual` : 'sin rentabilidad';
  const pctPlusvaliaActual = inv.saldo > 0 ? ((inv.plusvalia / inv.saldo) * 100).toFixed(1) : '0';

  const lineas = (ls: LineaFlujo[], flecha: string, clase: string) =>
    ls
      .map(
        (l) => `<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${flecha} ${esc(l.contraparte)}: ${esc(l.concepto)}</span>
          <span class="num ${clase}">${esc(formatEUR(l.total))} · ${l.ocurrencias} mov.</span>
        </div>`,
      )
      .join('');

  const hayFlujos = flujos.entradas.length > 0 || flujos.salidas.length > 0;
  const flujosHtml = hayFlujos
    ? `<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${esc(cfg.dashboardStart.slice(0, 7))} → ${esc(cfg.dashboardEnd.slice(0, 7))})</div>
         ${lineas(flujos.entradas, '↓', 'pos')}
         ${lineas(flujos.salidas, '↑', 'neg')}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${flujos.totalAportaciones > 0 ? `<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${esc(formatEUR(flujos.totalAportaciones))}</span></div>` : ''}
           ${flujos.totalReembolsos > 0 ? `<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${esc(formatEUR(flujos.totalReembolsos))}</span></div>` : ''}
           ${
             flujos.retencion > 0
               ? `<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${esc(formatEUR(flujos.retencion))}</span></div>`
               : flujos.salidas.length > 0
                 ? '<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>'
                 : ''
           }
         </div>
       </div>`
    : '<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>';

  const modo = ctx.invModo(acc._id);
  const chip = (activo: boolean) =>
    `padding:3px 10px;border-radius:20px;border:1px solid ${activo ? 'var(--accent)' : 'var(--border)'};background:${activo ? 'var(--accent-dim)' : 'transparent'};color:${activo ? 'var(--accent)' : 'var(--text3)'};cursor:pointer;font-size:11px`;

  const stats =
    modo === 'real'
      ? `<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${esc(formatEUR(inv.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${esc(formatEUR(inv.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${esc(formatEUR(inv.neto))}</div><div class="stat-sub">${esc(pctPlusvaliaActual)}% plusvalía</div></div>
         </div>`
      : `<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${esc(formatEUR(costBaseProyectado))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${esc(formatEUR(saldoProyectado))}</div><div class="stat-sub">${esc(labelRent)} · ${esc(cfg.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${esc(formatEUR(saldoProyectado - impuestoProyectado))}</div><div class="stat-sub">${esc(tipoEfectivo)}% imp. efectivo</div></div>
         </div>`;

  return `
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${esc(acc._id)}|real" style="${chip(modo === 'real')}">Real</button>
          <button data-inv-modo="${esc(acc._id)}|proyeccion" style="${chip(modo === 'proyeccion')}">Proyección</button>
        </div>
      </div>
      ${stats}
      ${flujosHtml}
    </div>`;
}

// ── Tarjeta ───────────────────────────────────────────────────────────────────

export function renderAccountCard(acc: Account, ctx: CardCtx): string {
  const historico = [...(acc.historicoSaldos || [])].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const ultimo = historico[0];
  const saldoActual = saldoRealCuenta(acc);
  const modelo = modeloFondoDe(acc);
  const principal = acc.esCuentaPrincipal;

  const insignias = [
    principal ? '<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>' : '',
    modelo === 'pension' ? '<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>' : '',
    modelo === 'inversion' ? '<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>' : '',
    modelo === 'beneficio'
      ? `<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${esc((TIPOS_BENEFICIO[acc.tipoBeneficio ?? ''] ?? { label: 'Beneficio' }).label)}</span>`
      : '',
    acc.simulacion ? '<span class="badge badge-sim">SIM</span>' : '',
  ].join('');

  return `<div class="card" style="${principal ? 'border-color:var(--accent2)' : ''}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${esc(acc.nombre)}</span>
        ${insignias}
      </div>
      <div class="flex gap-8">
        ${!principal ? `<button class="btn-icon" data-principal-acc="${esc(acc._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>` : ''}
        <button class="btn-icon" data-hist-acc="${esc(acc._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${ICONO_HISTORICO}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${esc(acc._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${ICONO_EDITAR}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${esc(acc._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${esc(formatEUR(acc.saldoInicial || 0))}</div><div class="stat-sub">${esc(acc.fechaInicialSaldo || '—')}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${esc(formatEUR(saldoActual))}</div>${
        ultimo
          ? `<div class="stat-sub">Registro: ${esc(ultimo.fecha)}</div>`
          : '<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'
      }</div>
    </div>
    ${
      acc.interes > 0
        ? `<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${esc(acc.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${esc(acc.periodoCobro ?? 'mensual')}</span></div>`
        : '<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'
    }
    ${remuneracionHtml(acc, ctx)}
    ${modelo === 'beneficio' ? beneficioHtml(acc, ctx) : ''}
    ${modelo === 'pension' ? pensionHtml(acc) : ''}
    ${modelo === 'inversion' ? inversionHtml(acc, ctx) : ''}
    ${
      historico.length > 0
        ? `<div class="text-sm mt-8">${historico.length} punto${historico.length > 1 ? 's' : ''} en histórico · último ${esc(ultimo.fecha)}</div>`
        : '<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'
    }
    ${acc.descripcion ? `<div class="mt-8 text-sm">${esc(acc.descripcion)}</div>` : ''}
  </div>`;
}
