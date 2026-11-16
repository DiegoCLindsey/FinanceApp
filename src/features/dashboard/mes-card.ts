// ── features/dashboard/mes-card ───────────────────────────────────────────────
// Tarjeta «Este mes» del cuadro de mando: préstamos, facturas, otros gastos y
// margen de ahorro. Los números vienen de `engine/mes`; aquí solo se pintan.
// Todo el texto del usuario pasa por `esc()`.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { BloqueMes, DesgloseMes } from '@/engine/mes';
import { esc, nombreMes } from '../accounting/dom';

const dia = (f: ISODate) => String(Number(f.slice(8, 10)));

function detalle(b: BloqueMes, hoy: ISODate): string {
  if (b.partidas.length === 0) return '';
  const filas = b.partidas
    .map((p) => {
      const dias = p.fechas.length > 4 ? `${p.fechas.length} cargos` : `día ${p.fechas.map(dia).join(', ')}`;
      const hecho = p.fechas.every((f) => f <= hoy);
      return `<div class="mes-fila${hecho ? ' mes-fila--hecha' : ''}">
        <span class="mes-fila-nombre" title="${esc(p.concepto)}">${esc(p.concepto)}</span>
        <span class="mes-fila-dia">${esc(dias)}</span>
        <span class="mes-fila-importe">${esc(formatEUR(p.total))}</span>
      </div>`;
    })
    .join('');
  return `<details class="mes-detalle"><summary>${b.partidas.length} ${b.partidas.length === 1 ? 'concepto' : 'conceptos'}</summary>${filas}</details>`;
}

function bloque(titulo: string, ayuda: string, b: BloqueMes, hoy: ISODate, clase: string): string {
  const progreso = b.total > 0 ? Math.min(100, (b.vencido / b.total) * 100) : 0;
  const pie =
    b.total <= 0
      ? '<span>Nada previsto</span>'
      : b.pendiente <= 0.004
        ? '<span>Ya cargado todo</span>'
        : `<span>Quedan <strong>${esc(formatEUR(b.pendiente))}</strong></span><span>cargado ${esc(formatEUR(b.vencido))}</span>`;
  return `<section class="mes-bloque ${clase}" aria-label="${esc(titulo)}">
    <div class="mes-bloque-titulo" title="${esc(ayuda)}">${esc(titulo)}</div>
    <div class="mes-bloque-total">${esc(formatEUR(b.total))}</div>
    <div class="mes-barra" role="img" aria-label="${Math.round(progreso)} % ya cargado"><span style="width:${progreso.toFixed(1)}%"></span></div>
    <div class="mes-bloque-pie">${pie}</div>
    ${detalle(b, hoy)}
  </section>`;
}

/** HTML de la tarjeta. `mes` en formato `YYYY-MM`. */
export function tarjetaMes(d: DesgloseMes, mes: string, hoy: ISODate): string {
  const positivo = d.margen >= 0;
  const pct = d.margenPct === null ? '' : ` · ${d.margenPct.toFixed(0)} % de lo que entra`;
  return `<div class="card mes-card" data-mes-card>
    <div class="mes-cabecera">
      <div class="card-title" style="margin:0">Este mes · ${esc(nombreMes(mes))}</div>
      <div class="mes-ingresos">Entran <strong>${esc(formatEUR(d.ingresosNetos))}</strong> netos</div>
    </div>
    <div class="mes-rejilla">
      ${bloque('Préstamos', 'Cuotas y amortizaciones previstas este mes', d.prestamos, hoy, 'mes-bloque--prestamos')}
      ${bloque('Facturas', 'Gastos fijos y recurrentes: recibos, alquiler, seguros, suscripciones. Se puede marcar a mano en cada gasto.', d.facturas, hoy, 'mes-bloque--facturas')}
      ${bloque('Otros gastos', 'El resto de gastos previstos: compra, ocio, puntuales', d.otros, hoy, 'mes-bloque--otros')}
      <section class="mes-bloque mes-bloque--margen ${positivo ? 'es-positivo' : 'es-negativo'}" aria-label="Margen de ahorro esperado">
        <div class="mes-bloque-titulo" title="Ingresos netos menos préstamos, facturas y otros gastos">Margen de ahorro</div>
        <div class="mes-bloque-total">${positivo ? '+' : '−'}${esc(formatEUR(Math.abs(d.margen)))}</div>
        <div class="mes-bloque-pie"><span>${positivo ? 'Te sobra' : 'Te falta'}${esc(pct)}</span></div>
        <div class="mes-bloque-pie"><span>Gastos previstos: ${esc(formatEUR(d.gastosTotales))}</span></div>
      </section>
    </div>
  </div>`;
}
