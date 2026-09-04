// ── features/accounting/transactions-panel ────────────────────────────────────
// Movimientos reales del periodo: alta rápida, edición, borrado, asignación a
// una estimación y puntos de control de saldo (F4, tarea 4.3).

import { formatEUR, fromCents } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import type { Ledger } from '@/accounting/ledger';
import type { Account, Expense, TipoTransaccion } from '@/state/schema';
import { confirmar, esc, eurColor, numero, onChange, onClick, tagChips, toast, valor } from '../accounting/dom';

export interface TransactionsPanelDeps {
  ledger: Ledger;
  accounts: () => Account[];
  estimaciones: () => Expense[];
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
  mes: string; // 'YYYY-MM'
  filtroTexto: string;
}

function rangoMes(mes: string): { desde: ISODate; hasta: ISODate } {
  const [y, m] = mes.split('-').map(Number);
  const ultimo = new Date(y, m, 0).getDate();
  return { desde: `${mes}-01`, hasta: `${mes}-${String(ultimo).padStart(2, '0')}` };
}

export function renderTransactionsPanel(deps: TransactionsPanelDeps, estado: EstadoPanel): string {
  const { ledger } = deps;
  const hoy = (deps.hoy ?? todayISO)();
  const cuentas = deps.accounts().filter((a) => a.activo);
  const { desde, hasta } = rangoMes(estado.mes);
  const filtro = { cuentaId: estado.cuentaId || undefined, desde, hasta, texto: estado.filtroTexto || undefined };
  const movimientos = ledger.transacciones(filtro);
  const estimaciones = deps.estimaciones().filter((e) => e.tipo !== 'transferencia');

  const gastos = movimientos.filter((t) => t.importeCts < 0).reduce((s, t) => s + t.importeCts, 0);
  const ingresos = movimientos.filter((t) => t.importeCts > 0).reduce((s, t) => s + t.importeCts, 0);

  const saldoCuenta = estado.cuentaId ? ledger.saldoCuenta(estado.cuentaId, hasta) : ledger.saldoTotal(hasta);
  const puntos = estado.cuentaId ? ledger.puntosControl(estado.cuentaId) : ledger.puntosControl();

  const opcionesCuenta = cuentas
    .map((a) => `<option value="${esc(a._id)}"${a._id === estado.cuentaId ? ' selected' : ''}>${esc(a.nombre)}</option>`)
    .join('');
  const opcionesEstimacion = (seleccionada?: string | null) =>
    `<option value="">— sin asignar —</option>` +
    estimaciones
      .map(
        (e) =>
          `<option value="${esc(e._id)}"${e._id === seleccionada ? ' selected' : ''}>${esc(e.concepto)} (${esc(formatEUR(e.cuantia))})</option>`,
      )
      .join('');

  const filas = movimientos
    .map(
      (t) => `
      <tr data-tx="${esc(t._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${esc(t.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${esc(t.concepto)}</td>
        <td style="padding:7px 8px">${tagChips(t.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${esc(deps.accounts().find((a) => a._id === t.cuentaId)?.nombre ?? t.cuentaId)}</td>
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
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${opcionesCuenta}</select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Mes</label>
            <input class="form-input" type="month" id="acc-mes" value="${esc(estado.mes)}" style="width:140px"/>
          </div>
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

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg3)">
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Fecha</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Etiquetas</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Cuenta</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Importe</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filas || `<tr><td colspan="7" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>`}
            </tbody>
          </table>
        </div>
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
