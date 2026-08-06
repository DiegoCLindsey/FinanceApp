// ── features/taxes/declaracion ────────────────────────────────────────────────
// Pestaña "Declaración Renta": formulario de datos que la aplicación no conoce
// y cuadro del borrador. La aritmética entera vive en `core/tax/renta`.

import { formatEUR } from '@/core/money';
import type { Declaracion, ExtrasDeclaracion } from '@/core/tax/renta';
import { esc } from '../accounting/dom';

const fila = (label: string, valor: number, color = 'var(--text)', sangrado = false) =>
  `<tr>
    <td style="padding:5px ${sangrado ? '20px' : '10px'} 5px 10px;font-size:12px;color:var(--text2)">${label}</td>
    <td style="text-align:right;font-weight:600;color:${color};font-size:12px;padding:5px 10px">${esc(formatEUR(valor))}</td>
  </tr>`;

const seccion = (label: string) =>
  `<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${esc(label)}</td></tr>`;

/** Cuadro del borrador. `fila` recibe etiquetas ya escapadas o literales. */
export function cuadroDeclaracion(r: Declaracion): string {
  const hayAhorro = r.capMobiliario !== 0 || r.gananciasFondos !== 0;
  const filasAhorro = hayAhorro
    ? `${fila('Capital mobiliario (dividendos, intereses)', r.capMobiliario, 'var(--text)', true)}
       ${fila('Ganancias patrimoniales (fondos/acciones)', r.gananciasFondos, r.gananciasFondos >= 0 ? 'var(--text)' : 'var(--green)', true)}`
    : '<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>';

  const colorResultado = r.resultado > 0 ? 'var(--red)' : 'var(--green)';
  const etiquetaResultado = r.resultado > 0 ? '🔴 A PAGAR' : '🟢 A DEVOLVER';

  return `
    <table style="width:100%;border-collapse:collapse">
      ${seccion('RENDIMIENTOS DEL TRABAJO')}
      ${fila('Ingresos íntegros del trabajo', r.brutoTotal, 'var(--text)', true)}
      ${r.flexTotal > 0 ? fila('− Retribución flexible exenta (Art. 42 LIRPF)', -r.flexTotal, 'var(--green)', true) : ''}
      ${r.flexTotal > 0 ? fila('= Ingresos sujetos a IRPF', r.brutoIRPF) : ''}
      ${fila('− Cotizaciones SS (≈6,35 %)', -r.cotizSS, 'var(--red)', true)}
      ${fila('− Gastos deducibles (Art. 19.2 LIRPF)', -r.gastosArt19, 'var(--red)', true)}
      ${fila('= Rendimiento neto trabajo', r.RNT)}
      ${fila('− Reducción Art. 20 LIRPF', -r.reducArt20, 'var(--green)', true)}
      ${r.deducPP > 0 ? fila(`− Aportaciones a planes de pensiones (${esc(formatEUR(r.aportPP))}, límite ${esc(formatEUR(r.limPP))})`, -r.deducPP, 'var(--green)', true) : ''}
      ${r.otrosIngresos > 0 ? fila('+ Otros ingresos sujetos a IRPF', r.otrosIngresos, 'var(--text)', true) : ''}
      ${r.capInmobiliario !== 0 ? fila('+ Capital inmobiliario neto', r.capInmobiliario, r.capInmobiliario >= 0 ? 'var(--text)' : 'var(--green)', true) : ''}
      ${r.otrasCorto !== 0 ? fila('± Otras ganancias a corto plazo', r.otrasCorto, 'var(--text)', true) : ''}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${esc(formatEUR(r.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${esc(formatEUR(r.cuotaGen))}</td>
      </tr>

      ${seccion('BASE DEL AHORRO')}
      ${filasAhorro}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${esc(formatEUR(r.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${esc(formatEUR(r.cuotaAho))}</td>
      </tr>

      ${seccion('RESULTADO')}
      ${fila('Cuota íntegra total', r.cuotaIntegra, 'var(--red)')}
      ${fila('− Retenciones en nómina', -r.retNomina, 'var(--green)', true)}
      ${r.retCapital !== 0 ? fila('− Retenciones de capital mobiliario', -r.retCapital, 'var(--green)', true) : ''}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${etiquetaResultado}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${colorResultado}">${esc(formatEUR(Math.abs(r.resultado)))}</td>
      </tr>
    </table>`;
}

export interface DeclaracionTabDeps {
  año: number;
  extras: ExtrasDeclaracion;
  declaracion: Declaracion;
  /** Nombres y brutos de las nóminas detectadas. */
  nominas: { nombre: string; bruto: number }[];
  /** Nombres de los planes de pensiones detectados. */
  planes: string[];
}

const campoExtra = (id: string, label: string, valor: number, ayuda = '') =>
  `<div class="form-group mt-8">
    <label class="form-label">${esc(label)}</label>
    <input type="number" id="${id}" class="form-input" value="${esc(valor)}" placeholder="0" data-rex/>
    ${ayuda ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">${esc(ayuda)}</div>` : ''}
  </div>`;

export function tabDeclaracion(deps: DeclaracionTabDeps): string {
  const ex = deps.extras;
  const avisoSinNominas =
    deps.nominas.length === 0
      ? `<div class="auth-hint mb-12" style="border-color:var(--yellow)">
           ⚠️ No tienes nóminas configuradas. Ve a <strong>Nóminas</strong> para añadir tus ingresos del trabajo.
         </div>`
      : '';

  return `
    <div class="auth-hint mb-12" style="border-color:var(--accent)">
      📋 Estimación orientativa de tu declaración de la renta <strong>${deps.año}</strong> con los datos de la aplicación.
      Los rendimientos del trabajo se detectan automáticamente; introduce a mano lo que la aplicación no conoce.
      <strong>No sustituye el asesoramiento fiscal profesional.</strong>
    </div>
    ${avisoSinNominas}

    <div class="grid-2" style="gap:16px;align-items:start">
      <div>
        <div class="card" style="padding:16px;margin-bottom:12px">
          <div class="card-title mb-12">Datos adicionales</div>
          <div class="text-sm mb-8" style="color:var(--text2)">Importes anuales que la aplicación no calcula sola.</div>
          ${campoExtra('rex-inmobiliario', 'Capital inmobiliario neto (alquileres − gastos)', ex.capInmobiliario ?? 0)}
          ${campoExtra('rex-mobiliario', 'Capital mobiliario (dividendos, intereses)', ex.capMobiliario ?? 0)}
          ${campoExtra(
            'rex-ganancias',
            'Ganancias / pérdidas patrimoniales (fondos, acciones)',
            ex.gananciasFondos ?? 0,
            'Positivo = ganancia · Negativo = pérdida compensable',
          )}
          ${campoExtra('rex-otras', 'Otras ganancias a corto plazo (menos de 1 año)', ex.otrasCorto ?? 0)}
          ${campoExtra(
            'rex-ret-cap',
            'Retenciones de capital ya aplicadas',
            ex.retCapital ?? 0,
            'Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen',
          )}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${
            deps.nominas.length > 0
              ? deps.nominas.map((n) => `• ${esc(n.nombre)}: ${esc(formatEUR(n.bruto))} brutos/año`).join('<br>')
              : '— Sin nóminas —'
          }
          ${
            deps.planes.length > 0
              ? `<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${deps.planes.map((p) => `• ${esc(p)}`).join('<br>')}`
              : ''
          }
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${deps.año}</div>
        <div id="renta-cuadro">${cuadroDeclaracion(deps.declaracion)}</div>
      </div>
    </div>`;
}
