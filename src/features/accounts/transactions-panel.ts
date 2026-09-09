// ── features/accounting/transactions-panel ────────────────────────────────────
// Movimientos reales del periodo: alta rápida, edición, borrado, asignación a
// una estimación y puntos de control de saldo (F4, tarea 4.3).

import { formatEUR, fromCents } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import type { Ledger } from '@/accounting/ledger';
import { compararIntervalo } from '@/accounting/comparativa';
import type { Account, Expense, Loan, Nomina, Transaccion, TipoTransaccion } from '@/state/schema';
import { confirmar, esc, eurColor, numero, onChange, onClick, tagChips, toast, valor } from '../accounting/dom';
import { renderComparativaSvg } from './comparativa-chart';

const ETIQUETA_TIPO: Record<TipoTransaccion, string> = {
  gasto: 'Gasto',
  ingreso: 'Ingreso',
  ajuste: 'Ajuste',
  transferencia: 'Transferencia propia',
};

export interface TransactionsPanelDeps {
  ledger: Ledger;
  accounts: () => Account[];
  estimaciones: () => Expense[];
  /** Préstamos activos: la cuota real se puede relacionar con su préstamo. */
  loans: () => Loan[];
  /** Nóminas activas: el ingreso real se puede relacionar con su nómina. */
  nominas: () => Nomina[];
  /** Etiquetas conocidas, para el datalist de autocompletado. */
  tagsConocidas: () => string[];
  onDatosCambiados: () => void;
  /**
   * "Hoy" de la vista. Inyectable, y no `todayISO()` suelto: el panel lo usa
   * para la fecha por defecto de los formularios, y si no coincide con el mes
   * que se está mirando, el movimiento recién creado no aparece en la lista.
   */
  hoy?: () => ISODate;
}

export interface EstadoPanel {
  cuentaId: string;
  mes: string; // 'YYYY-MM' — vista mensual
  filtroTexto: string;
  /**
   * Vista agrupada (F4, alta): mismo concepto EXACTO repetido dentro de un
   * periodo de varios meses, para poder asignarles la estimación relacionada
   * a todos de golpe en vez de fila a fila — el caso típico es un cargo
   * recurrente ("Netflix", "Gimnasio…") cuyo importe varía mes a mes.
   */
  vista: 'mensual' | 'intervalo' | 'agrupado';
  periodoDesde: string; // 'YYYY-MM'
  periodoHasta: string; // 'YYYY-MM'
  /** Conceptos con la fila de detalle desplegada, en la vista agrupada. */
  detalleAbierto: Set<string>;
  /**
   * Vista de intervalo (F4, alta): fechas concretas, día a día, en vez de un
   * mes cerrado — el filtro de la lista puede cruzar varios meses. Debajo se
   * enseña el real frente a lo estimado de ese mismo intervalo.
   */
  intervaloDesde: ISODate;
  intervaloHasta: ISODate;
}

/** Estado inicial del panel: vista mensual del mes actual, con un periodo de
 * seis meses hacia atrás ya listo por si se cambia a la vista agrupada o de
 * intervalo. */
export function estadoPanelInicial(mesActual: string): EstadoPanel {
  return {
    cuentaId: '',
    mes: mesActual,
    filtroTexto: '',
    vista: 'mensual',
    periodoDesde: mesAntes(mesActual, 5),
    periodoHasta: mesActual,
    detalleAbierto: new Set(),
    intervaloDesde: rangoMes(mesAntes(mesActual, 5)).desde,
    intervaloHasta: rangoMes(mesActual).hasta,
  };
}

function rangoMes(mes: string): { desde: ISODate; hasta: ISODate } {
  const [y, m] = mes.split('-').map(Number);
  const ultimo = new Date(y, m, 0).getDate();
  return { desde: `${mes}-01`, hasta: `${mes}-${String(ultimo).padStart(2, '0')}` };
}

/** `mes` menos `n` meses, en formato 'YYYY-MM'. */
function mesAntes(mes: string, n: number): string {
  const [y, m] = mes.split('-').map(Number);
  const d = new Date(y, m - 1 - n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Primer día de `desde` al último día de `hasta` (ambos 'YYYY-MM'). */
function rangoPeriodo(desdeMes: string, hastaMes: string): { desde: ISODate; hasta: ISODate } {
  // Si el usuario los deja al revés, se intercambian: pedir un rango vacío no
  // ayuda a nadie y es un error tipeando, no una intención.
  const [d, h] = desdeMes <= hastaMes ? [desdeMes, hastaMes] : [hastaMes, desdeMes];
  return { desde: rangoMes(d).desde, hasta: rangoMes(h).hasta };
}

/** Igual que `rangoPeriodo`, pero con fechas concretas ('YYYY-MM-DD') en vez de meses. */
function rangoIntervalo(desde: ISODate, hasta: ISODate): { desde: ISODate; hasta: ISODate } {
  return desde <= hasta ? { desde, hasta } : { desde: hasta, hasta: desde };
}

export interface GrupoConcepto {
  concepto: string;
  movimientos: Transaccion[];
  total: number; // céntimos, con signo
  /** La estimación asignada, si TODOS los movimientos del grupo comparten la misma (o ninguno). */
  estimacionComun: string | null;
  /** Unión de las etiquetas de todos los movimientos del grupo. */
  tagsComunes: string[];
}

/**
 * Agrupa movimientos por concepto EXACTO (tras recortar espacios). Solo
 * interesan los que se repiten — un concepto suelto no tiene nada que
 * asignar en bloque que no se pueda hacer ya fila a fila.
 */
export function agruparPorConcepto(movimientos: Transaccion[]): GrupoConcepto[] {
  const porConcepto = new Map<string, Transaccion[]>();
  for (const t of movimientos) {
    const clave = t.concepto.trim();
    const grupo = porConcepto.get(clave);
    if (grupo) grupo.push(t);
    else porConcepto.set(clave, [t]);
  }
  return [...porConcepto.entries()]
    .filter(([, txs]) => txs.length > 1)
    .map(([concepto, txs]) => {
      const asignaciones = new Set(txs.map((t) => t.estimacionId ?? null));
      return {
        concepto,
        movimientos: txs.slice().sort((a, b) => a.fecha.localeCompare(b.fecha)),
        total: txs.reduce((s, t) => s + t.importeCts, 0),
        estimacionComun: asignaciones.size === 1 ? (asignaciones.values().next().value ?? null) : null,
        tagsComunes: [...new Set(txs.flatMap((t) => t.tags))].sort(),
      };
    })
    .sort((a, b) => b.movimientos.length - a.movimientos.length || a.concepto.localeCompare(b.concepto));
}

export interface ReconciliacionGrupo {
  tags: string[];
  transferidoCts: number; // valor absoluto del total del grupo
  gastadoCts: number; // gasto real con esas etiquetas, fuera del grupo
  diferenciaCts: number; // gastadoCts − transferidoCts
}

/**
 * Compara un grupo con etiquetas asignadas frente al gasto real que esas
 * etiquetas representan FUERA del propio grupo, en el mismo periodo.
 *
 * El caso de uso: un traspaso grande y recurrente a otra cuenta ("Traspaso a
 * Ahorro") que en la práctica cubre varias categorías de gasto (gasolina,
 * súper, gasto personal...) pagadas desde esa segunda cuenta. Sin esto, cada
 * traspaso se ve como un bloque opaco; con etiquetas asignadas se puede
 * comprobar si lo traspasado cuadra con lo que realmente se gastó en esas
 * categorías, o si hay una diferencia que investigar.
 */
export function reconciliarGrupo(grupo: GrupoConcepto, movimientosDelPeriodo: Transaccion[]): ReconciliacionGrupo | null {
  if (grupo.tagsComunes.length === 0) return null;
  const idsGrupo = new Set(grupo.movimientos.map((t) => t._id));
  const gastadoCts = movimientosDelPeriodo
    .filter((t) => !idsGrupo.has(t._id) && t.tipo === 'gasto' && t.tags.some((tag) => grupo.tagsComunes.includes(tag)))
    .reduce((s, t) => s + Math.abs(t.importeCts), 0);
  const transferidoCts = Math.abs(grupo.total);
  return { tags: grupo.tagsComunes, transferidoCts, gastadoCts, diferenciaCts: gastadoCts - transferidoCts };
}

function reconciliacionHtml(rec: ReconciliacionGrupo | null): string {
  if (!rec) {
    return '<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';
  }
  const color = rec.diferenciaCts === 0 ? 'var(--text2)' : rec.diferenciaCts > 0 ? 'var(--red)' : 'var(--accent)';
  const signo = rec.diferenciaCts > 0 ? '+' : '';
  return `
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${esc(formatEUR(fromCents(rec.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${esc(formatEUR(fromCents(rec.gastadoCts)))}</strong></span>
      <span style="color:${color}">Diferencia: <strong style="font-family:var(--font-mono)">${signo}${esc(formatEUR(fromCents(rec.diferenciaCts)))}</strong></span>
    </div>`;
}

export function renderTransactionsPanel(deps: TransactionsPanelDeps, estado: EstadoPanel): string {
  const { ledger } = deps;
  const hoy = (deps.hoy ?? todayISO)();
  const cuentas = deps.accounts().filter((a) => a.activo);
  const agrupado = estado.vista === 'agrupado';
  const intervalo = estado.vista === 'intervalo';
  const { desde, hasta } = agrupado
    ? rangoPeriodo(estado.periodoDesde, estado.periodoHasta)
    : intervalo
      ? rangoIntervalo(estado.intervaloDesde, estado.intervaloHasta)
      : rangoMes(estado.mes);
  const filtro = { cuentaId: estado.cuentaId || undefined, desde, hasta, texto: estado.filtroTexto || undefined };
  const movimientos = ledger.transacciones(filtro);
  const estimaciones = deps.estimaciones().filter((e) => e.tipo !== 'transferencia');
  // La "estimación relacionada" no es solo el gasto/ingreso previsto: un pago
  // real también se puede atar a su préstamo, y un ingreso a su nómina, para
  // saber de un vistazo con qué cuota o con qué paga se corresponde.
  const opcionesRelacion: { _id: string; etiqueta: string }[] = [
    ...estimaciones.map((e) => ({ _id: e._id, etiqueta: `${esc(e.concepto)} (${esc(formatEUR(e.cuantia))})` })),
    ...deps
      .loans()
      .filter((l) => l.activo)
      .map((l) => ({ _id: l._id, etiqueta: `Préstamo: ${esc(l.nombre)}` })),
    ...deps
      .nominas()
      .filter((n) => n.activo)
      .map((n) => ({ _id: n._id, etiqueta: `Nómina: ${esc(n.nombre)}` })),
  ];

  // Las transferencias entre cuentas propias no son gasto ni ingreso real:
  // solo han cambiado de cuenta (ver TipoTransaccion en el esquema). Contarlas
  // aquí duplicaría la compra real que se paga luego desde la otra cuenta.
  const gastos = movimientos.filter((t) => t.tipo !== 'transferencia' && t.importeCts < 0).reduce((s, t) => s + t.importeCts, 0);
  const ingresos = movimientos.filter((t) => t.tipo !== 'transferencia' && t.importeCts > 0).reduce((s, t) => s + t.importeCts, 0);

  const saldoCuenta = estado.cuentaId ? ledger.saldoCuenta(estado.cuentaId, hasta) : ledger.saldoTotal(hasta);
  const puntos = estado.cuentaId ? ledger.puntosControl(estado.cuentaId) : ledger.puntosControl();

  const opcionesCuenta = cuentas
    .map((a) => `<option value="${esc(a._id)}"${a._id === estado.cuentaId ? ' selected' : ''}>${esc(a.nombre)}</option>`)
    .join('');
  const opcionesEstimacion = (seleccionada?: string | null) =>
    `<option value="">— sin asignar —</option>` +
    opcionesRelacion
      .map((o) => `<option value="${esc(o._id)}"${o._id === seleccionada ? ' selected' : ''}>${o.etiqueta}</option>`)
      .join('');
  const opcionesTipo = (seleccionado: TipoTransaccion) =>
    (Object.keys(ETIQUETA_TIPO) as TipoTransaccion[])
      .map((t) => `<option value="${t}"${t === seleccionado ? ' selected' : ''}>${ETIQUETA_TIPO[t]}</option>`)
      .join('');

  const filas = movimientos
    .map(
      (t) => `
      <tr data-tx="${esc(t._id)}" style="border-bottom:1px solid var(--border)${t.tipo === 'transferencia' ? ';opacity:0.7' : ''}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${esc(t.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${esc(t.concepto)}</td>
        <td style="padding:7px 8px">${tagChips(t.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${esc(deps.accounts().find((a) => a._id === t.cuentaId)?.nombre ?? t.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${esc(t._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${opcionesTipo(t.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${esc(t._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${opcionesEstimacion(t.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${eurColor(fromCents(t.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${esc(t._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${esc(t._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`,
    )
    .join('');

  // El real-vs-estimado del intervalo mira el gasto proyectado mes a mes, así
  // que no depende de la cuenta ni del texto buscado — es una vista de
  // conjunto, no del filtro de la tabla.
  const datosComparativa = intervalo ? compararIntervalo(ledger, estimaciones, desde, hasta) : [];

  // Para la reconciliación de grupo hace falta el gasto real de TODAS las
  // cuentas del periodo (el traspaso sale de una cuenta, pero lo que cubre se
  // gasta normalmente en otra), no solo de la cuenta que esté filtrada.
  const movimientosDelPeriodo = agrupado ? ledger.transacciones({ desde, hasta }) : [];

  const grupos = agrupado ? agruparPorConcepto(movimientos) : [];
  const filasGrupo = grupos
    .map((g) => {
      const abierto = estado.detalleAbierto.has(g.concepto);
      const configGrupo = abierto
        ? `<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${tagChips(g.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${esc(g.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${esc(g.concepto)}">Asignar</button>
               </div>
               ${reconciliacionHtml(reconciliarGrupo(g, movimientosDelPeriodo))}
             </td>
           </tr>`
        : '';
      const detalle = abierto
        ? g.movimientos
            .map(
              (t) => `
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${esc(t.fecha)}</span> · ${esc(deps.accounts().find((a) => a._id === t.cuentaId)?.nombre ?? t.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${esc(t._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${opcionesEstimacion(t.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${eurColor(fromCents(t.importeCts))}</td>
              <td></td>
            </tr>`,
            )
            .join('')
        : '';
      return `
      <tr data-grp="${esc(g.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${esc(g.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${abierto ? '▾' : '▸'}</button>
          <span style="font-size:13px">${esc(g.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${g.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${esc(g.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${g.movimientos.length} movimientos del grupo de golpe">${opcionesEstimacion(g.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${eurColor(fromCents(g.total))}</td>
        <td></td>
      </tr>${configGrupo}${detalle}`;
    })
    .join('');

  const filasPuntos = puntos
    .slice()
    .reverse()
    .slice(0, 8)
    .map(
      (p) => `
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${esc(p.fecha)}</span>
        <span style="color:var(--text3)">${esc(deps.accounts().find((a) => a._id === p.cuentaId)?.nombre ?? p.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${esc(formatEUR(fromCents(p.saldoCts)))}</span>
        ${p.nota ? `<span style="color:var(--text3)">${esc(p.nota)}</span>` : ''}
        <button class="btn-secondary" data-pc-borrar="${esc(p._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`,
    )
    .join('');

  return `
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin-bottom:10px">
          <div class="card-title" style="margin:0">Movimientos reales</div>
          <div class="flex gap-6">
            <button class="btn-secondary btn-sm" data-acc-vista="mensual" style="${estado.vista === 'mensual' ? 'background:var(--accent);color:#04120c;border-color:var(--accent)' : ''}">Mes</button>
            <button class="btn-secondary btn-sm" data-acc-vista="intervalo" style="${intervalo ? 'background:var(--accent);color:#04120c;border-color:var(--accent)' : ''}" title="Elige un rango de fechas concreto, aunque cruce varios meses">Intervalo</button>
            <button class="btn-secondary btn-sm" data-acc-vista="agrupado" style="${agrupado ? 'background:var(--accent);color:#04120c;border-color:var(--accent)' : ''}" title="Agrupa los gastos que se repiten con el mismo concepto en un periodo, para asignarles la estimación de golpe">Agrupar por concepto</button>
          </div>
        </div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${opcionesCuenta}</select>
          </div>
          ${
            agrupado
              ? `<div class="form-group" style="margin:0">
                   <label class="form-label">Desde</label>
                   <input class="form-input" type="month" id="acc-periodo-desde" value="${esc(estado.periodoDesde)}" style="width:140px"/>
                 </div>
                 <div class="form-group" style="margin:0">
                   <label class="form-label">Hasta</label>
                   <input class="form-input" type="month" id="acc-periodo-hasta" value="${esc(estado.periodoHasta)}" style="width:140px"/>
                 </div>`
              : intervalo
                ? `<div class="form-group" style="margin:0">
                     <label class="form-label">Desde</label>
                     <input class="form-input" type="date" id="acc-intervalo-desde" value="${esc(estado.intervaloDesde)}" style="width:150px"/>
                   </div>
                   <div class="form-group" style="margin:0">
                     <label class="form-label">Hasta</label>
                     <input class="form-input" type="date" id="acc-intervalo-hasta" value="${esc(estado.intervaloHasta)}" style="width:150px"/>
                   </div>`
                : `<div class="form-group" style="margin:0">
                     <label class="form-label">Mes</label>
                     <input class="form-input" type="month" id="acc-mes" value="${esc(estado.mes)}" style="width:140px"/>
                   </div>`
          }
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${esc(estado.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${eurColor(fromCents(gastos))}</span>
          <span>Ingresos: ${eurColor(fromCents(ingresos))}</span>
          <span>Neto: ${eurColor(fromCents(ingresos + gastos))}</span>
          <span style="margin-left:auto">Saldo a ${esc(hasta)}: <strong>${esc(formatEUR(saldoCuenta))}</strong></span>
        </div>

        ${
          agrupado
            ? `<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${esc(estado.periodoDesde)} y ${esc(estado.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               <div style="overflow-x:auto">
                 <table style="width:100%;border-collapse:collapse">
                   <thead>
                     <tr style="background:var(--bg3)">
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Repeticiones</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                       <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Total</th>
                       <th></th>
                     </tr>
                   </thead>
                   <tbody>
                     ${filasGrupo || `<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>`}
                   </tbody>
                 </table>
               </div>`
            : `<div style="overflow-x:auto">
                 <table style="width:100%;border-collapse:collapse">
                   <thead>
                     <tr style="background:var(--bg3)">
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Fecha</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Etiquetas</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Cuenta</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Tipo</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                       <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Importe</th>
                       <th></th>
                     </tr>
                   </thead>
                   <tbody>
                     ${filas || `<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>`}
                   </tbody>
                 </table>
               </div>
               ${
                 intervalo
                   ? `<div class="divider"></div>
                      <div class="card-title mb-8">Real frente a estimado — ${esc(desde)} → ${esc(hasta)}</div>
                      ${renderComparativaSvg(datosComparativa)}`
                   : ''
               }`
        }
      </div>

      <div>
        <div class="card mb-14">
          <div class="card-title">Registrar movimiento</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${esc(hoy)}"/></div>
            <div class="form-group"><label class="form-label">Tipo</label>
              <select class="form-input" id="nt-tipo">
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
                <option value="ajuste">Ajuste</option>
                <option value="transferencia">Transferencia entre mis cuentas</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Concepto</label><input class="form-input" type="text" id="nt-concepto" placeholder="Compra supermercado"/></div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="nt-importe" step="0.01" min="0" placeholder="0,00"/></div>
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${opcionesCuenta}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${deps
              .tagsConocidas()
              .map((t) => `<option value="${esc(t)}"></option>`)
              .join('')}</datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${opcionesEstimacion(null)}</select>
            <div class="text-sm mt-4" style="color:var(--text3)">Si la dejas sin asignar, se relaciona por etiqueta.</div>
          </div>
          <button class="btn-primary full-width" id="nt-guardar">Registrar</button>
        </div>

        <div class="card">
          <div class="card-title">Saldo real conocido</div>
          <div class="text-sm mb-8" style="color:var(--text2)">
            Ancla el histórico: el saldo de cualquier fecha se calcula desde el último punto
            de control más los movimientos posteriores. Si el banco dice otra cosa, manda el punto.
          </div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${esc(hoy)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${opcionesCuenta}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${filasPuntos ? `<div class="mt-12">${filasPuntos}</div>` : ''}
        </div>
      </div>
    </div>`;
}

/** Cablea los eventos del panel. Se llama tras cada render. */
export function wireTransactionsPanel(
  container: HTMLElement,
  deps: TransactionsPanelDeps,
  estado: EstadoPanel,
  refrescar: () => void,
): void {
  const { ledger } = deps;

  onChange(container, '#acc-cuenta', (el) => {
    estado.cuentaId = (el as HTMLSelectElement).value;
    refrescar();
  });
  onChange(container, '#acc-mes', (el) => {
    estado.mes = (el as HTMLInputElement).value || estado.mes;
    refrescar();
  });
  onClick(container, '[data-acc-vista]', (el) => {
    estado.vista = (el.getAttribute('data-acc-vista') as EstadoPanel['vista']) || 'mensual';
    refrescar();
  });
  onChange(container, '#acc-periodo-desde', (el) => {
    estado.periodoDesde = (el as HTMLInputElement).value || estado.periodoDesde;
    refrescar();
  });
  onChange(container, '#acc-periodo-hasta', (el) => {
    estado.periodoHasta = (el as HTMLInputElement).value || estado.periodoHasta;
    refrescar();
  });
  onChange(container, '#acc-intervalo-desde', (el) => {
    estado.intervaloDesde = (el as HTMLInputElement).value || estado.intervaloDesde;
    refrescar();
  });
  onChange(container, '#acc-intervalo-hasta', (el) => {
    estado.intervaloHasta = (el as HTMLInputElement).value || estado.intervaloHasta;
    refrescar();
  });
  onClick(container, '[data-grp-detalle]', (el) => {
    const concepto = el.getAttribute('data-grp-detalle') as string;
    if (estado.detalleAbierto.has(concepto)) estado.detalleAbierto.delete(concepto);
    else estado.detalleAbierto.add(concepto);
    refrescar();
  });
  onChange(container, '[data-grp-estimacion]', (el) => {
    const concepto = el.getAttribute('data-grp-estimacion') as string;
    const valorNuevo = (el as HTMLSelectElement).value || null;
    // Mismo filtro que pintó el grupo (cuenta, periodo y búsqueda): la
    // asignación en bloque solo debe tocar lo que el usuario está viendo.
    const { desde, hasta } = rangoPeriodo(estado.periodoDesde, estado.periodoHasta);
    const movimientos = ledger.transacciones({
      cuentaId: estado.cuentaId || undefined,
      desde,
      hasta,
      texto: estado.filtroTexto || undefined,
    });
    const grupo = agruparPorConcepto(movimientos).find((g) => g.concepto === concepto);
    if (!grupo) return;
    for (const t of grupo.movimientos) ledger.asignarEstimacion(t._id, valorNuevo);
    toast(`Estimación asignada a ${grupo.movimientos.length} movimientos`);
    deps.onDatosCambiados();
    refrescar();
  });
  onClick(container, '[data-grp-tags-asignar]', (el) => {
    const concepto = el.getAttribute('data-grp-tags-asignar') as string;
    const entrada = el.closest('tr')?.querySelector<HTMLInputElement>('[data-grp-tags]') ?? null;
    const nuevas = (entrada?.value ?? '')
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (nuevas.length === 0) return toast('Escribe al menos una etiqueta', 'err');
    const { desde, hasta } = rangoPeriodo(estado.periodoDesde, estado.periodoHasta);
    const movimientos = ledger.transacciones({
      cuentaId: estado.cuentaId || undefined,
      desde,
      hasta,
      texto: estado.filtroTexto || undefined,
    });
    const grupo = agruparPorConcepto(movimientos).find((g) => g.concepto === concepto);
    if (!grupo) return;
    // Se une con las etiquetas que ya tuviera cada movimiento: asignar en
    // bloque no debe borrar una etiqueta puesta a mano en uno solo.
    for (const t of grupo.movimientos) {
      ledger.actualizar(t._id, { tags: [...new Set([...t.tags, ...nuevas])] });
    }
    toast(`Etiquetas añadidas a ${grupo.movimientos.length} movimientos`);
    deps.onDatosCambiados();
    refrescar();
  });
  const buscar = container.querySelector<HTMLInputElement>('#acc-buscar');
  buscar?.addEventListener('input', () => {
    estado.filtroTexto = buscar.value;
    // Se filtra en cliente: no hace falta debounce agresivo, pero se evita
    // re-renderizar en cada tecla con un microretardo.
    clearTimeout((buscar as HTMLInputElement & { _t?: number })._t);
    (buscar as HTMLInputElement & { _t?: number })._t = window.setTimeout(refrescar, 200);
  });

  onClick(container, '#nt-guardar', () => {
    const concepto = valor(container, '#nt-concepto').trim();
    const importe = numero(container, '#nt-importe');
    if (!concepto) return toast('Indica un concepto', 'err');
    if (!(importe > 0)) return toast('Indica un importe mayor que cero', 'err');
    const tags = valor(container, '#nt-tags')
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    ledger.registrar({
      fecha: valor(container, '#nt-fecha') || (deps.hoy ?? todayISO)(),
      cuentaId: valor(container, '#nt-cuenta'),
      importe,
      concepto,
      tags,
      tipo: valor(container, '#nt-tipo') as TipoTransaccion,
      estimacionId: valor(container, '#nt-estimacion') || null,
    });
    toast('Movimiento registrado');
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(container, '[data-tx-borrar]', (el) => {
    const id = el.dataset.txBorrar as string;
    if (!confirmar('¿Eliminar este movimiento?')) return;
    ledger.eliminar(id);
    toast('Movimiento eliminado');
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(container, '[data-tx-editar]', (el) => {
    const id = el.dataset.txEditar as string;
    const tx = ledger.transacciones().find((t) => t._id === id);
    if (!tx) return;
    const nuevoImporte = window.prompt(`Importe de "${tx.concepto}" (€)`, String(Math.abs(fromCents(tx.importeCts))));
    if (nuevoImporte === null) return;
    const parsed = parseFloat(nuevoImporte.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0) return toast('Importe no válido', 'err');
    ledger.actualizar(id, { importe: parsed });
    toast('Movimiento actualizado');
    deps.onDatosCambiados();
    refrescar();
  });

  onChange(container, '[data-tx-estimacion]', (el) => {
    const id = el.getAttribute('data-tx-estimacion') as string;
    ledger.asignarEstimacion(id, (el as HTMLSelectElement).value || null);
    toast('Asignación actualizada');
    deps.onDatosCambiados();
  });

  // Reclasificar el tipo de un movimiento ya registrado — el caso de uso es
  // marcar como "transferencia" un traspaso entre cuentas propias que se
  // había importado como gasto/ingreso, sin tocar su importe ni su fecha.
  onChange(container, '[data-tx-tipo]', (el) => {
    const id = el.getAttribute('data-tx-tipo') as string;
    ledger.actualizar(id, { tipo: (el as HTMLSelectElement).value as TipoTransaccion });
    toast('Tipo actualizado');
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(container, '#pc-guardar', () => {
    const saldoTexto = valor(container, '#pc-saldo');
    if (saldoTexto.trim() === '') return toast('Indica el saldo', 'err');
    const saldo = numero(container, '#pc-saldo');
    ledger.registrarPuntoControl(
      valor(container, '#pc-cuenta'),
      valor(container, '#pc-fecha') || (deps.hoy ?? todayISO)(),
      saldo,
      valor(container, '#pc-nota').trim() || undefined,
    );
    toast('Saldo real registrado');
    deps.onDatosCambiados();
    refrescar();
  });

  onClick(container, '[data-pc-borrar]', (el) => {
    if (!confirmar('¿Eliminar este punto de control?')) return;
    ledger.eliminarPuntoControl(el.dataset.pcBorrar as string);
    toast('Punto de control eliminado');
    deps.onDatosCambiados();
    refrescar();
  });
}
