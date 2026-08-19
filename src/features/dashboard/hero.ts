// ── features/dashboard/hero ───────────────────────────────────────────────────
// Cabecera del cuadro de mando: aviso de escenario activo, los cuatro KPI
// grandes y la lista de cargos de los próximos siete días.
//
// Todo lo que se pinta aquí viene ya calculado de `engine/dashboard.ts`; este
// módulo solo da formato. Correcciones respecto al legacy, todas comentadas en
// su sitio: fechas locales en vez de `toISOString()`, escapado del texto que
// escribe el usuario y botones por `data-*` en lugar de `onclick=` global.

import { formatEUR } from '@/core/money';
import { formatLocalDate, parseLocalDate, todayISO, type ISODate } from '@/core/dates';
import type { CashEvent } from '@/engine/types';
import { esc } from '../accounting/dom';

export interface EscenarioActivo {
  _id: string;
  nombre?: string;
  descripcion?: string;
  color?: string;
}

/**
 * Banda que recuerda que el dashboard está mirando un escenario y no la
 * realidad. `nombre` y `descripcion` los escribe el usuario: van escapados
 * (el legacy los interpolaba crudos y un apóstrofo rompía la vista).
 */
export function avisoEscenario(escenario: EscenarioActivo | null): string {
  if (!escenario) return '';
  const color = escenario.color || '#6366f1';
  const desc = escenario.descripcion ? `<span style="color:var(--text3);margin-left:8px">${esc(escenario.descripcion)}</span>` : '';

  return `<div class="card mb-14" style="padding:10px 16px;background:rgba(99,102,241,0.07);border:1px solid ${esc(color)}44;display:flex;align-items:center;gap:12px">
    <span style="font-size:16px">🔭</span>
    <div style="flex:1;font-size:13px">
      <span style="font-weight:600;color:${esc(color)}">Escenario: ${esc(escenario.nombre || escenario._id)}</span>${desc}
    </div>
    <button class="btn-secondary btn-sm" data-dash-salir-escenario>✕ Salir</button>
  </div>`;
}

export interface KpisHero {
  /** Saldo real a día de hoy, ya con el histórico aplicado. */
  saldoHoy: number;
  ingresosMes: number;
  gastosMes: number;
}

const item = (label: string, valor: string, clase: string, sub: string) =>
  `<div class="dash-hero-item">
    <div class="dash-hero-label">${label}</div>
    <div class="dash-hero-val ${clase}">${esc(valor)}</div>
    <div class="dash-hero-sub">${esc(sub)}</div>
  </div>`;

/**
 * Los cuatro números grandes. `hoy` es inyectable porque si no la vista no se
 * puede testear: el legacy leía `new Date()` aquí dentro.
 */
export function heroKpis(k: KpisHero, hoy: ISODate = todayISO()): string {
  const mes = hoy.slice(0, 7);
  const ahorro = k.ingresosMes - k.gastosMes;

  return `<div class="dash-hero mb-14">
    ${item('Saldo actual', formatEUR(k.saldoHoy), k.saldoHoy >= 0 ? 'pos' : 'neg', hoy)}
    ${item('Ingresos este mes', formatEUR(k.ingresosMes), 'pos', mes)}
    ${item('Gastos este mes', formatEUR(k.gastosMes), k.gastosMes > 0 ? 'neg' : '', 'cuotas + básicos + otros')}
    ${item('Ahorro est. mes', `${ahorro >= 0 ? '+' : ''}${formatEUR(ahorro)}`, ahorro >= 0 ? 'pos' : 'neg', mes)}
  </div>`;
}

/**
 * Cargos que vencen dentro de los próximos `dias` días.
 *
 * El legacy calculaba el límite con `Date.now() + 7*86400000` y `toISOString()`:
 * dos errores encadenados. El milisegundaje se come (o regala) una hora en los
 * cambios de hora, y `toISOString()` sobre una fecha local devuelve el día
 * anterior en husos con desfase positivo, que es el nuestro. Aquí se suma sobre
 * el calendario y se formatea en local.
 */
export function proximosCargos(extracto: CashEvent[], hoy: ISODate = todayISO(), dias = 7, maximo = 6): string {
  const limite = parseLocalDate(hoy);
  limite.setDate(limite.getDate() + dias);
  const hasta = formatLocalDate(limite);

  const prox = extracto
    .filter((e) => e.fecha >= hoy && e.fecha <= hasta && e.tipo === 'gasto' && e.sourceType !== 'transfer-out')
    .slice(0, maximo);
  if (!prox.length) return '';

  return `<div class="card mb-14" style="padding:12px 16px">
    <div class="card-title mb-10">📅 Próximos ${esc(dias)} días</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${prox
        .map(
          (e) => `<div style="display:flex;justify-content:space-between;align-items:center;font-size:13px">
        <div><span style="color:var(--text3);font-size:11px;margin-right:8px;font-family:var(--font-mono)">${esc(e.fecha.slice(5))}</span>${esc(e.concepto)}</div>
        <span style="font-family:var(--font-mono);color:var(--red)">${esc(formatEUR(e.cuantia))}</span>
      </div>`,
        )
        .join('')}
    </div>
  </div>`;
}

export interface CuentaPill {
  _id: string;
  nombre: string;
  simulacion?: boolean;
}

/** Filtro de cuentas de la barra superior. */
export function pastillasCuentas(accounts: CuentaPill[], filtro: string[]): string {
  return accounts
    .map(
      (a) =>
        `<span class="acc-pill ${filtro.includes(a._id) ? 'active' : ''} ${a.simulacion ? 'sim' : ''}" data-dash-cuenta="${esc(a._id)}">${esc(a.nombre)}${a.simulacion ? ' ◌' : ''}</span>`,
    )
    .join('');
}
