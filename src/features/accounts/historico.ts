// ── features/accounts/historico ───────────────────────────────────────────────
// Histórico de saldos de una cuenta = sus puntos de control del ledger.
//
// En el legacy esto vivía en `accounts[].historicoSaldos` y lo editaba la propia
// vista. Desde F4 el ledger es el source of truth del pasado y replica el
// resultado en `historicoSaldos` para el motor y las vistas que aún son legacy
// (`sincronizarConLegacy`). Escribir aquí a mano dejaba dos escritores del mismo
// campo, y el siguiente punto de control registrado desde Contabilidad borraba
// lo que se hubiera añadido desde Cuentas.

import { formatEUR, fromCents } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { PuntoControl } from '@/state/schema';
import { esc } from '../accounting/dom';

export interface HistoricoVista {
  _id: string;
  fecha: ISODate;
  saldo: number;
  nota?: string;
  /** Calculado por el ledger (uno por semana), no tecleado por el usuario. */
  derivado: boolean;
}

/** Puntos de control de la cuenta, del más reciente al más antiguo. */
export function historicoDeCuenta(puntos: PuntoControl[]): HistoricoVista[] {
  return [...puntos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((p) => ({ _id: p._id, fecha: p.fecha, saldo: fromCents(p.saldoCts), nota: p.nota, derivado: p.origen === 'derivado' }));
}

export function historicoHtml(
  nombreCuenta: string,
  accId: string,
  historico: HistoricoVista[],
  saldoInicial: number,
  hoy: ISODate,
): string {
  const filas = historico
    .map(
      (
        h,
      ) => `<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${h.derivado ? ';opacity:0.75' : ''}">
        <span class="num" style="min-width:110px">${esc(h.fecha)}</span>
        <span class="num" style="flex:1;color:${h.saldo >= saldoInicial ? 'var(--accent)' : 'var(--red)'}">${esc(formatEUR(h.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${h.derivado ? '<span class="badge">semanal · calculado</span>' : esc(h.nota ?? '')}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${esc(accId)}|${esc(h._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${esc(accId)}|${esc(h._id)}">✕</button>
      </div>`,
    )
    .join('');

  const derivados = historico.filter((h) => h.derivado).length;

  return `
    <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
      <div class="card-title" style="margin:0">Histórico — ${esc(nombreCuenta)}</div>
      <button class="btn-secondary btn-sm" data-hist-semanal="${esc(accId)}"
        title="Recalcula un punto por semana con el saldo al cierre de cada una, a partir de los movimientos">↻ Recalcular semanal</button>
    </div>
    <div class="text-sm mt-4 mb-8" style="color:var(--text3)">
      ${derivados > 0 ? `${derivados} de los puntos son semanales calculados del ledger; el resto los has registrado tú y mandan sobre el saldo.` : 'Los puntos que registras aquí anclan el saldo. «Recalcular semanal» añade además un punto por semana con lo que dicen los movimientos.'}
    </div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${historico.length === 0 ? '<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>' : filas}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${esc(hoy)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${esc(accId)}">Añadir</button>
    </div>`;
}
