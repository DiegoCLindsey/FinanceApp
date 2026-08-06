// ── features/taxes/tabs ───────────────────────────────────────────────────────
// Pestañas de capital mobiliario, rendimientos del trabajo y capital
// inmobiliario. Solo presentación: los importes llegan ya calculados.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import { calcFondoInversion, calcFondosPension } from '@/core/tax/pension';
import { desgloseNomina, tipoMarginalGrupo } from '@/core/tax/nomina-grupo';
import { LIMITE_APORTACION_PENSION } from '@/core/tax/renta';
import type { Tramos } from '@/core/tax/irpf';
import type { Account, Nomina } from '@/state/schema';
import { esc } from '../accounting/dom';
import { tablaTramos } from './tramos-table';

const vacio = (icono: string, titulo: string, texto: string) =>
  `<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${icono}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${esc(titulo)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${texto}</div>
  </div>`;

const stat = (label: string, valor: string, clase = '') =>
  `<div class="stat-card"><div class="stat-label">${esc(label)}</div><div class="stat-value ${clase}">${esc(valor)}</div></div>`;

const linea = (label: string, valor: string, clase = '') =>
  `<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${esc(label)}</span><span class="num ${clase}">${esc(valor)}</span></div>`;

// ── Capital mobiliario ────────────────────────────────────────────────────────

export function tabCapitalMobiliario(accounts: Account[], tramos: Tramos, nombreEscenario: (id: string) => string): string {
  const fondos = accounts.filter((a) => (a.modeloFondo || 'cuenta') === 'inversion');
  if (fondos.length === 0) {
    return vacio(
      '📈',
      'Sin fondos de inversión',
      'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.',
    );
  }

  let totalSaldo = 0;
  let totalCostBase = 0;
  let totalImpuesto = 0;

  const tarjetas = fondos
    .map((f) => {
      const inv = calcFondoInversion(f, tramos);
      if (!inv) return '';
      totalSaldo += inv.saldo;
      totalCostBase += inv.costBase;
      totalImpuesto += inv.impuesto;
      const pct = inv.costBase > 0 ? (inv.plusvalia / inv.costBase) * 100 : 0;
      const escenarios = (f.escenarioIds || [])
        .map((id) => `<span class="badge badge-yellow">🔭 ${esc(nombreEscenario(id))}</span>`)
        .join('');

      return `
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${esc(f.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${escenarios}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${stat('Valor actual', formatEUR(inv.saldo))}
            ${stat('Coste base (aportado)', formatEUR(inv.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${stat(`Plusvalía latente (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`, formatEUR(inv.plusvalia), inv.plusvalia >= 0 ? 'pos' : 'neg')}
            ${stat('Imp. ganancias de capital (est.)', formatEUR(inv.impuesto), 'neg')}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${esc(formatEUR(inv.neto))}</span>
          </div>
        </div>`;
    })
    .join('');

  return `
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${stat('Valor total de la cartera', formatEUR(totalSaldo))}
        ${stat('Total aportado (coste base)', formatEUR(totalCostBase))}
        ${stat('Plusvalía latente total', formatEUR(totalSaldo - totalCostBase), totalSaldo - totalCostBase >= 0 ? 'pos' : 'neg')}
      </div>
      <div class="grid-2" style="gap:8px">
        ${stat('Impuesto estimado si se liquida todo', formatEUR(totalImpuesto), 'neg')}
        ${stat('Neto tras impuestos (cartera completa)', formatEUR(totalSaldo - totalImpuesto), 'pos')}
      </div>
    </div>

    ${tarjetas}

    <div class="card mt-16">
      <div class="card-title mb-12">Marco fiscal — Fondos de inversión</div>
      <div class="grid-2" style="gap:16px;margin-bottom:16px">
        <div style="padding:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius)">
          <div style="font-weight:600;margin-bottom:6px;color:#10b981">✓ Traspaso (fondo → fondo)</div>
          <div class="text-sm" style="color:var(--text2);line-height:1.6">
            <strong>Sin tributación</strong> (art. 94 LIRPF). Diferimiento fiscal total: la plusvalía latente queda acumulada
            y la base de coste se traslada al nuevo fondo.
          </div>
        </div>
        <div style="padding:14px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius)">
          <div style="font-weight:600;margin-bottom:6px;color:var(--red)">€ Reembolso (fondo → cuenta corriente)</div>
          <div class="text-sm" style="color:var(--text2);line-height:1.6">
            Tributa como <strong>ganancia patrimonial</strong> en la base del ahorro, con retención del <strong>19 %</strong>
            sobre la plusvalía proporcional al importe retirado.
          </div>
        </div>
      </div>
      <div style="margin-bottom:4px;font-size:12px;font-weight:600;color:var(--text2)">Tramos de ganancias patrimoniales (base del ahorro)</div>
      ${tablaTramos(tramos)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`;
}

// ── Rendimientos del trabajo ──────────────────────────────────────────────────

export interface TrabajoTabDeps {
  nominas: Nomina[];
  planes: Account[];
  tramos: Tramos;
  hoy: ISODate;
}

/**
 * Resumen anual de las nóminas activas y de los planes de pensiones.
 * El legacy calculaba aquí el IRPF con `calcIRPF(bruto)` sobre el bruto crudo
 * (sin cotización, sin art. 19.2/20 y sin apilado de grupo) y además etiquetaba
 * los importes como "mensual" cuando `bruto` es anual. Ahora sale de
 * `desgloseNomina`, la misma función que usa la vista de Nóminas.
 */
export function tabRendimientosTrabajo(deps: TrabajoTabDeps): string {
  const { nominas, planes, tramos } = deps;
  const grupoDe = (n: Nomina) => (n.grupoNomina ? nominas.filter((x) => (x.grupoNomina || '') === n.grupoNomina) : null);

  const desgloses = nominas.map((n) => ({ n, d: desgloseNomina(n, grupoDe(n), tramos) }));
  const totalBruto = desgloses.reduce((s, x) => s + x.d.brutoAnual, 0);
  const totalIRPF = desgloses.reduce((s, x) => s + x.d.irpfAnual, 0);
  const totalSS = desgloses.reduce((s, x) => s + x.d.ssAnual, 0);

  const tarjetasNominas =
    desgloses.length === 0
      ? '<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>'
      : desgloses
          .map(
            ({ n, d }) => `
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${esc(n.nombre)}</div>
          ${linea('Bruto anual', formatEUR(d.brutoAnual))}
          ${d.flexAnual > 0 ? linea('− Retribución flexible exenta', formatEUR(-d.flexAnual), 'pos') : ''}
          ${linea('− Cotización SS', formatEUR(-d.ssAnual), 'neg')}
          ${linea(`− IRPF estimado (${d.irpfPct.toFixed(1)} %)`, formatEUR(-d.irpfAnual), 'neg')}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${esc(formatEUR(d.baseDineraria - d.ssAnual - d.irpfAnual))}</span>
          </div>
        </div>`,
          )
          .join('');

  // Tipo marginal del conjunto: es el que ahorra un euro aportado al plan
  const pctMarginal = tipoMarginalGrupo(nominas, tramos);
  const inicioAño = `${deps.hoy.slice(0, 4)}-01-01`;

  const tarjetasPlanes =
    planes.length === 0
      ? '<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>'
      : planes
          .map((p) => {
            const pension = calcFondosPension(p);
            if (!pension) return '';
            const aportado = (p.aportaciones || []).filter((a) => a.fecha >= inicioAño).reduce((s, a) => s + a.cantidad, 0);
            const deducible = Math.min(aportado, LIMITE_APORTACION_PENSION);
            const ahorro = (deducible * pctMarginal) / 100;
            const supera = aportado > LIMITE_APORTACION_PENSION;

            return `
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${esc(p.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${linea('Valor actual', formatEUR(pension.saldo))}
          ${linea('Coste base (total aportado)', formatEUR(pension.costBase))}
          ${linea('Revalorización', formatEUR(pension.beneficio), pension.beneficio >= 0 ? 'pos' : 'neg')}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${esc(deps.hoy.slice(0, 4))}</div>
            ${linea('Aportado', `${formatEUR(aportado)}${supera ? ' ⚠' : ''}`, supera ? 'neg' : '')}
            ${linea('Límite deducible', formatEUR(LIMITE_APORTACION_PENSION))}
            ${linea(`Ahorro IRPF est. (marginal ${pctMarginal} %)`, formatEUR(ahorro), 'pos')}
            ${supera ? `<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${esc(formatEUR(LIMITE_APORTACION_PENSION))})</div>` : ''}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${pension.proxDesbloqueo ? `· Próx. desbloqueo: ${esc(pension.proxDesbloqueo)}` : ''}
          </div>
        </div>`;
          })
          .join('');

  return `
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${stat('Bruto anual total', formatEUR(totalBruto))}
        ${stat('Cotización SS anual', formatEUR(totalSS), 'neg')}
        ${stat('IRPF estimado anual', formatEUR(totalIRPF), 'neg')}
        ${stat('Neto anual', formatEUR(totalBruto - totalSS - totalIRPF), 'pos')}
      </div>
      <div class="grid-3">${tarjetasNominas}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${esc(formatEUR(LIMITE_APORTACION_PENSION))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${tarjetasPlanes}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${tablaTramos(tramos)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`;
}

// ── Capital inmobiliario ──────────────────────────────────────────────────────

const tarjetaInfo = (titulo: string, texto: string) =>
  `<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${esc(titulo)}</div>
    <div class="text-sm" style="color:var(--text3)">${esc(texto)}</div>
  </div>`;

export function tabCapitalInmobiliario(): string {
  return `
    <div class="card" style="text-align:center;padding:56px 32px;border:2px dashed var(--border)">
      <div style="font-size:44px;margin-bottom:16px">🏠</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:8px">Capital Inmobiliario</div>
      <span class="badge" style="margin-bottom:20px;font-size:12px;padding:5px 14px;background:rgba(99,102,241,0.12);color:var(--accent)">En construcción</span>
      <div class="text-sm" style="color:var(--text2);max-width:480px;margin:0 auto 28px;line-height:1.6">
        Aquí podrás gestionar <strong>ingresos por alquiler</strong>, aplicar la reducción del 60 % para arrendamiento de
        vivienda habitual y deducir los gastos correspondientes. Mientras tanto, introduce el rendimiento neto a mano en
        la pestaña <strong>Declaración Renta</strong>.
      </div>
      <div class="grid-2" style="max-width:480px;margin:0 auto;gap:12px;text-align:left">
        ${tarjetaInfo('Rendimientos íntegros', 'Alquileres, subarriendos y cesión de derechos sobre inmuebles')}
        ${tarjetaInfo('Gastos deducibles', 'IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación')}
        ${tarjetaInfo('Reducción del 60 %', 'Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)')}
        ${tarjetaInfo('Base general del IRPF', 'Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.')}
      </div>
    </div>`;
}
