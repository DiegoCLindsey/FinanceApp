// ── features/dashboard/mes-card ───────────────────────────────────────────────
// Tarjeta «Este mes» del cuadro de mando: préstamos, facturas, otros gastos y
// margen de ahorro. Los números vienen de `engine/mes`; aquí solo se pintan.
// Todo el texto del usuario pasa por `esc()`.
//
// El cuerpo (los cuatro bloques) se comparte con la ventana de meses
// anteriores, que enseña el mismo desglose para un mes pasado o para el
// acumulado de un periodo.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { BloqueMes, DesgloseMes } from '@/engine/mes';
import { esc, nombreMes } from '../accounting/dom';

/**
 * Colores de los tres grupos. Validados juntos sobre la superficie oscura, y
 * en ESTE orden de apilado (préstamos abajo, otros arriba): el par
 * préstamos/otros no queda nunca contiguo, que es el único que daltónicos no
 * distinguirían bien. La tarjeta y las barras usan los mismos.
 */
export const COLORES_GRUPO = { prestamos: '#9085e9', facturas: '#d95926', otros: '#3987e5' } as const;

const dia = (f: ISODate) => String(Number(f.slice(8, 10)));

export interface OpcionesCuerpo {
  hoy: ISODate;
  /** Abrir el detalle de cada bloque. */
  abierto?: boolean;
  /**
   * Para el acumulado de un periodo: en vez de «cargado / queda», cada bloque
   * enseña su media mensual sobre este número de meses.
   */
  meses?: number;
}

function detalle(b: BloqueMes, o: OpcionesCuerpo): string {
  if (b.partidas.length === 0) return '';
  const filas = b.partidas
    .map((p) => {
      const cuando =
        o.meses !== undefined
          ? `${p.fechas.length} ${p.fechas.length === 1 ? 'cargo' : 'cargos'}`
          : p.fechas.length > 4
            ? `${p.fechas.length} cargos`
            : `día ${p.fechas.map(dia).join(', ')}`;
      const hecho = o.meses === undefined && p.fechas.every((f) => f <= o.hoy);
      return `<div class="mes-fila${hecho ? ' mes-fila--hecha' : ''}">
        <span class="mes-fila-nombre" title="${esc(p.concepto)}">${esc(p.concepto)}</span>
        <span class="mes-fila-dia">${esc(cuando)}</span>
        <span class="mes-fila-importe">${esc(formatEUR(p.total))}</span>
      </div>`;
    })
    .join('');
  return `<details class="mes-detalle"${o.abierto ? ' open' : ''}><summary>${b.partidas.length} ${b.partidas.length === 1 ? 'concepto' : 'conceptos'}</summary>${filas}</details>`;
}

function bloque(titulo: string, ayuda: string, b: BloqueMes, o: OpcionesCuerpo, clase: string): string {
  const progreso = b.total > 0 ? Math.min(100, (b.vencido / b.total) * 100) : 0;
  let pie: string;
  if (b.total <= 0) pie = '<span>Nada previsto</span>';
  else if (o.meses !== undefined) pie = `<span>Media <strong>${esc(formatEUR(b.total / Math.max(1, o.meses)))}</strong>/mes</span>`;
  else if (b.pendiente <= 0.004) pie = '<span>Ya cargado todo</span>';
  else pie = `<span>Quedan <strong>${esc(formatEUR(b.pendiente))}</strong></span><span>cargado ${esc(formatEUR(b.vencido))}</span>`;
  const barra =
    o.meses !== undefined
      ? ''
      : `<div class="mes-barra" role="img" aria-label="${Math.round(progreso)} % ya cargado"><span style="width:${progreso.toFixed(1)}%"></span></div>`;
  return `<section class="mes-bloque ${clase}" aria-label="${esc(titulo)}">
    <div class="mes-bloque-titulo" title="${esc(ayuda)}"><span class="mes-punto" aria-hidden="true"></span>${esc(titulo)}</div>
    <div class="mes-bloque-total">${esc(formatEUR(b.total))}</div>
    ${barra}
    <div class="mes-bloque-pie">${pie}</div>
    ${detalle(b, o)}
  </section>`;
}

/** Los cuatro bloques: préstamos, facturas, otros y margen. */
export function cuerpoDesglose(d: DesgloseMes, o: OpcionesCuerpo): string {
  const positivo = d.margen >= 0;
  const pct = d.margenPct === null ? '' : ` · ${Math.abs(d.margenPct).toFixed(0)} % de lo que entra`;
  const media =
    o.meses !== undefined && o.meses > 1
      ? `<div class="mes-bloque-pie"><span>Media ${positivo ? '+' : '−'}${esc(formatEUR(Math.abs(d.margen) / o.meses))}/mes</span></div>`
      : '';
  return `<div class="mes-rejilla">
      ${bloque('Préstamos', 'Cuotas y amortizaciones previstas', d.prestamos, o, 'mes-bloque--prestamos')}
      ${bloque('Facturas', 'Gastos fijos y recurrentes: recibos, alquiler, seguros, suscripciones. Se puede marcar a mano en cada gasto.', d.facturas, o, 'mes-bloque--facturas')}
      ${bloque('Otros gastos', 'El resto de gastos previstos: compra, ocio, puntuales', d.otros, o, 'mes-bloque--otros')}
      <section class="mes-bloque mes-bloque--margen ${positivo ? 'es-positivo' : 'es-negativo'}" aria-label="Margen de ahorro esperado">
        <div class="mes-bloque-titulo" title="Ingresos netos menos préstamos, facturas y otros gastos">Margen de ahorro</div>
        <div class="mes-bloque-total">${positivo ? '+' : '−'}${esc(formatEUR(Math.abs(d.margen)))}</div>
        <div class="mes-bloque-pie"><span>${positivo ? 'Te sobra' : 'Te falta'}${esc(pct)}</span></div>
        ${media}
        <div class="mes-bloque-pie"><span>Gastos previstos: ${esc(formatEUR(d.gastosTotales))}</span></div>
      </section>
    </div>`;
}

/** HTML de la tarjeta. `mes` en formato `YYYY-MM`. */
export function tarjetaMes(d: DesgloseMes, mes: string, hoy: ISODate): string {
  return `<div class="card mes-card" data-mes-card>
    <div class="mes-cabecera">
      <div class="card-title" style="margin:0">Este mes · ${esc(nombreMes(mes))}</div>
      <div class="mes-cabecera-der">
        <span class="mes-ingresos">Entran <strong>${esc(formatEUR(d.ingresosNetos))}</strong> netos</span>
        <button type="button" class="btn-secondary btn-sm" data-mes-historico>Meses anteriores</button>
      </div>
    </div>
    ${cuerpoDesglose(d, { hoy })}
  </div>`;
}
