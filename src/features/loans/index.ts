// ── features/loans ────────────────────────────────────────────────────────────
// Préstamos (F1, tarea 1.7 — port de `loans/loans.js`).
//
// Cambios respecto a la versión legacy, además del tipado:
//   · delegación de eventos en lugar de `onclick="LoansModule.x('<id>')"`. El
//     caso peor era el botón "Aplicar plan", que serializaba el plan entero
//     dentro del atributo con `JSON.stringify(...).replace(/"/g,'&quot;')` — se
//     rompía en cuanto un nombre de préstamo traía comillas;
//   · todo el texto del usuario se escapa;
//   · el resumen con ahorro sale de `core/loan` (paridad verificada con el
//     motor legacy), no de FinanceMath.
//
// Las tarjetas abiertas se conservan entre re-render, como en el legacy: el
// usuario despliega un préstamo, edita una amortización y espera seguir viendo
// el cuadro.

import { formatEUR } from '@/core/money';
import { parseLocalDate, todayISO, type ISODate } from '@/core/dates';
import { resumenPrestamo, type LoanInput } from '@/core/loan';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Account, AppConfig, Escenario, Expense, Loan, Nomina } from '@/state/schema';
import type { PeriodoInflacion } from '@/core/inflation';
import { confirmar, esc, onClick, toast } from '../accounting/dom';
import { leerDiaPago, sincronizarDiaPago } from '../shared/dia-pago';
import { renderLoanCard } from './card';
import { formularioAmortizacion, formularioPrestamo } from './forms';
import { createOptimizerModal } from './optimizer-modal';

export interface LoansStoreLike {
  get(key: 'loans'): Loan[];
  get(key: 'expenses'): Expense[];
  get(key: 'accounts'): Account[];
  get(key: 'nominas'): Nomina[];
  get(key: 'escenarios'): Escenario[];
  get(key: 'inflacion'): PeriodoInflacion[];
  get(key: 'config'): AppConfig;
  addItem(col: 'loans', item: Omit<Loan, '_id'> & { _id?: string }): Loan;
  updateItem(col: 'loans', id: string, patch: Partial<Loan>): void;
  removeItem(col: 'loans', id: string): void;
}

export interface LoansViewDeps {
  store: LoansStoreLike;
  onDatosCambiados?: () => void;
  /** Inyectable para que los tests no dependan del día en que se ejecutan. */
  hoy?: () => ISODate;
}

const ICONO =
  'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z';

export function createLoansFeature(deps: LoansViewDeps): FeatureManifest {
  const hoy = deps.hoy ?? todayISO;
  let mostrarFinalizados = false;
  /** Tarjetas desplegadas, para restaurarlas tras cada re-render. */
  const abiertas = new Set<string>();
  let optimizador: ReturnType<typeof createOptimizerModal> | null = null;

  const notificar = () => deps.onDatosCambiados?.();
  const escenarios = () => deps.store.get('escenarios');
  const nombreEscenario = (id: string) => escenarios().find((e) => e._id === id)?.nombre ?? id;

  /** Un préstamo está finalizado si su última cuota ordinaria ya pasó. */
  function estaFinalizado(loan: Loan): boolean {
    if (!loan.activo || loan.simulacion) return false;
    const ordinarias = resumenPrestamo(loan as LoanInput).tabla.filter((r) => !r.esAmortizacion);
    if (ordinarias.length === 0) return true;
    return ordinarias[ordinarias.length - 1].fecha < hoy();
  }

  // ── Cabecera con las cuotas ─────────────────────────────────────────────────

  function cuotasDelMes(loans: Loan[], finalizados: Set<string>) {
    const t = hoy();
    const mes = t.slice(0, 7);
    const porLoan = new Map<string, number>();
    let total = 0;
    // Solo los que ya han arrancado: un préstamo futuro no tiene cuota este mes
    for (const loan of loans) {
      if (!loan.activo || loan.simulacion || finalizados.has(loan._id) || (loan.fechaInicio || '') > t) continue;
      const filas = resumenPrestamo(loan as LoanInput).tabla.filter((r) => !r.esAmortizacion && r.fecha.startsWith(mes));
      const cuota = filas.length > 0 ? filas[0].cuota : 0;
      porLoan.set(loan._id, cuota);
      total += cuota;
    }
    return { porLoan, total, activos: [...porLoan.values()].filter((c) => c > 0).length };
  }

  /** Cuota media mensual dentro del horizonte del dashboard. */
  function cuotaMediaPeriodo(loans: Loan[]): { media: number; desde: ISODate; hasta: ISODate } {
    const cfg = deps.store.get('config');
    const desde = cfg.dashboardStart;
    const hasta = cfg.dashboardEnd;
    const meses = Math.max(1, (parseLocalDate(hasta).getTime() - parseLocalDate(desde).getTime()) / (30.44 * 86400000));
    let total = 0;
    for (const loan of loans) {
      if (!loan.activo || loan.simulacion) continue;
      total += resumenPrestamo(loan as LoanInput)
        .tabla.filter((r) => !r.esAmortizacion && r.fecha >= desde && r.fecha <= hasta)
        .reduce((s, r) => s + r.cuota, 0);
    }
    return { media: total / meses, desde, hasta };
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function render(container: HTMLElement): void {
    const todos = [...deps.store.get('loans')].sort((a, b) => b.tin - a.tin);
    const finalizados = new Set(todos.filter(estaFinalizado).map((l) => l._id));
    const visibles = mostrarFinalizados ? todos : todos.filter((l) => !finalizados.has(l._id));
    const cuotas = cuotasDelMes(todos, finalizados);
    const periodo = cuotaMediaPeriodo(todos);
    const config = deps.store.get('config');
    const periodos = deps.store.get('inflacion');

    const mesLargo = new Date(parseLocalDate(hoy())).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${finalizados.size > 0 ? `<button class="btn-secondary btn-sm" data-toggle-finalizados>${mostrarFinalizados ? 'Ocultar' : 'Mostrar'} finalizados (${finalizados.size})</button>` : ''}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${
        cuotas.total > 0 || periodo.media > 0.01
          ? `<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${
                   cuotas.total > 0
                     ? `<div>
                          <div class="stat-label">Cuotas este mes (${esc(mesLargo)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${esc(formatEUR(cuotas.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${cuotas.activos} préstamo${cuotas.activos !== 1 ? 's' : ''} activo${cuotas.activos !== 1 ? 's' : ''} este mes</div>
                        </div>`
                     : ''
                 }
                 ${
                   periodo.media > 0.01
                     ? `<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${esc(formatEUR(periodo.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${esc(periodo.desde)} → ${esc(periodo.hasta)}</div>
                        </div>`
                     : ''
                 }
               </div>
             </div>`
          : ''
      }
      <div id="loans-list">
        ${
          visibles.length === 0
            ? '<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>'
            : visibles
                .map((l) =>
                  renderLoanCard(l, {
                    periodos,
                    usarInflacion: !!config.usarInflacion,
                    hoy: hoy(),
                    cuotaMes: cuotas.porLoan.get(l._id) ?? 0,
                    completado: finalizados.has(l._id),
                    nombreEscenario,
                  }),
                )
                .join('')
        }
      </div>`;

    // Restaurar las tarjetas que estaban desplegadas
    for (const body of container.querySelectorAll<HTMLElement>('[data-body-loan]')) {
      if (abiertas.has(body.dataset.bodyLoan ?? '')) body.classList.add('open');
    }
  }

  // ── Modales ─────────────────────────────────────────────────────────────────

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrarModal = () => overlay()?.classList.add('hidden');

  function abrirModal(titulo: string, html: string): HTMLElement | null {
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return null;
    el.innerHTML = `<div class="modal-title">${esc(titulo)}</div>${html}`;
    ov.classList.remove('hidden');
    onClick(el, '[data-cancelar]', cerrarModal);
    return el;
  }

  function abrirFormularioPrestamo(id: string | null, refrescar: () => void): void {
    const loan = id ? (deps.store.get('loans').find((l) => l._id === id) ?? null) : null;
    const el = abrirModal(
      id ? 'Editar préstamo' : 'Nuevo préstamo',
      formularioPrestamo(loan, deps.store.get('accounts'), escenarios(), hoy()),
    );
    if (!el) return;
    el.addEventListener('change', (ev) => {
      if ((ev.target as HTMLElement)?.matches('[data-dp-modo]')) sincronizarDiaPago(el);
    });
    onClick(el, '[data-guardar-loan]', (btn) => {
      if (guardarPrestamo(el, btn.getAttribute('data-guardar-loan') || '')) {
        cerrarModal();
        refrescar();
      }
    });
  }

  function guardarPrestamo(el: HTMLElement, id: string): boolean {
    const val = (sel: string) => (el.querySelector(sel) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
    const marcado = (sel: string) => !!(el.querySelector(sel) as HTMLInputElement | null)?.checked;

    const nombre = val('#f-nombre').trim();
    const capital = parseFloat(val('#f-capital'));
    const tin = parseFloat(val('#f-tin'));
    const meses = parseInt(val('#f-meses'), 10);
    if (!nombre || !Number.isFinite(capital) || !Number.isFinite(tin) || !Number.isFinite(meses)) {
      toast('Completa los campos obligatorios', 'err');
      return false;
    }

    const datos: Omit<Loan, '_id' | 'amortizaciones'> = {
      nombre,
      capital,
      tin,
      meses,
      fechaInicio: val('#f-fecha'),
      comisionApertura: parseFloat(val('#f-com-ap')) || 0,
      comisionAmort: parseFloat(val('#f-com-am')) || 0,
      diaPago: leerDiaPago(el),
      cuenta: val('#f-cuenta'),
      simulacion: marcado('#f-sim'),
      activo: marcado('#f-activo'),
      mostrarFechaFinEnDashboard: marcado('#f-mostrar-fin'),
      tipoTasa: val('#f-tipo-tasa'),
      basico: marcado('#f-basico'),
      tags: val('#f-tags')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      escenarioIds: [...el.querySelectorAll<HTMLInputElement>('.loan-escenario:checked')].map((i) => i.value),
    };

    if (id) {
      deps.store.updateItem('loans', id, datos);
      toast('Préstamo actualizado');
    } else {
      deps.store.addItem('loans', { ...datos, amortizaciones: [] });
      toast('Préstamo creado');
    }
    notificar();
    return true;
  }

  function abrirFormularioAmortizacion(loanId: string, amortId: string | null, refrescar: (abrir?: string[]) => void): void {
    const loan = deps.store.get('loans').find((l) => l._id === loanId);
    if (!loan) return;
    const am = amortId ? ((loan.amortizaciones || []).find((a) => a._id === amortId) ?? null) : null;
    const el = abrirModal(amortId ? 'Editar amortización' : 'Añadir amortización', formularioAmortizacion(loanId, am, escenarios(), hoy()));
    if (!el) return;
    onClick(el, '[data-guardar-amort]', (btn) => {
      const [lid, aid] = (btn.getAttribute('data-guardar-amort') || '').split('|');
      if (guardarAmortizacion(el, lid, aid)) {
        cerrarModal();
        refrescar([lid]);
      }
    });
  }

  function guardarAmortizacion(el: HTMLElement, loanId: string, amortId: string): boolean {
    const val = (sel: string) => (el.querySelector(sel) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
    const fecha = val('#am-fecha');
    const cantidad = parseFloat(val('#am-cant'));
    if (!fecha || !Number.isFinite(cantidad) || cantidad <= 0) {
      toast('Fecha y cantidad requeridas', 'err');
      return false;
    }
    const loan = deps.store.get('loans').find((l) => l._id === loanId);
    if (!loan) return false;

    const datos = {
      fecha,
      cantidad,
      tipo: val('#am-tipo'),
      simulacion: !!(el.querySelector('#am-sim') as HTMLInputElement | null)?.checked,
      escenarioIds: [...el.querySelectorAll<HTMLInputElement>('.amort-escenario:checked')].map((i) => i.value),
    };
    const actuales = loan.amortizaciones || [];
    const amortizaciones = amortId
      ? actuales.map((a) => (a._id === amortId ? { ...a, ...datos } : a))
      : [...actuales, { _id: Date.now().toString(36), ...datos }];

    deps.store.updateItem('loans', loanId, { amortizaciones });
    toast(amortId ? 'Amortización actualizada' : 'Amortización añadida');
    notificar();
    return true;
  }

  // ── Cableado ────────────────────────────────────────────────────────────────

  function wire(container: HTMLElement, refrescar: (abrir?: string[]) => void, optimizador: ReturnType<typeof createOptimizerModal>): void {
    onClick(container, '[data-toggle-finalizados]', () => {
      mostrarFinalizados = !mostrarFinalizados;
      refrescar();
    });
    onClick(container, '[data-nuevo-loan]', () => abrirFormularioPrestamo(null, refrescar));
    onClick(container, '[data-optimizar]', () => optimizador.abrir());

    // La cabecera pliega/despliega, salvo cuando el clic viene de un botón suyo
    onClick(container, '[data-toggle-loan]', (el, ev) => {
      if ((ev.target as HTMLElement)?.closest('button')) return;
      const id = el.getAttribute('data-toggle-loan') as string;
      const body = [...container.querySelectorAll<HTMLElement>('[data-body-loan]')].find((b) => b.dataset.bodyLoan === id);
      const abierto = body?.classList.toggle('open');
      if (abierto) abiertas.add(id);
      else abiertas.delete(id);
    });

    onClick(container, '[data-editar-loan]', (el) => abrirFormularioPrestamo(el.getAttribute('data-editar-loan'), refrescar));
    onClick(container, '[data-borrar-loan]', (el) => {
      if (!confirmar('¿Eliminar préstamo?')) return;
      const id = el.getAttribute('data-borrar-loan') as string;
      deps.store.removeItem('loans', id);
      abiertas.delete(id);
      toast('Eliminado');
      notificar();
      refrescar();
    });
    onClick(container, '[data-amort-loan]', (el) => {
      const id = el.getAttribute('data-amort-loan') as string;
      abiertas.add(id); // tras guardar, el usuario quiere ver el cuadro
      abrirFormularioAmortizacion(id, null, refrescar);
    });
    onClick(container, '[data-editar-amort]', (el) => {
      const [loanId, amortId] = (el.getAttribute('data-editar-amort') || '').split('|');
      abiertas.add(loanId);
      abrirFormularioAmortizacion(loanId, amortId, refrescar);
    });
    onClick(container, '[data-borrar-amort]', (el) => {
      const [loanId, amortId] = (el.getAttribute('data-borrar-amort') || '').split('|');
      const loan = deps.store.get('loans').find((l) => l._id === loanId);
      if (!loan) return;
      deps.store.updateItem('loans', loanId, { amortizaciones: (loan.amortizaciones || []).filter((a) => a._id !== amortId) });
      toast('Amortización eliminada');
      notificar();
      refrescar([loanId]);
    });
  }

  return {
    id: 'loans',
    route: 'loans',
    nombre: 'Préstamos',
    flagId: 'loans',
    seccion: 1, // "Mi dinero"
    iconoPath: ICONO,
    mount(container: HTMLElement) {
      const refrescar = (abrir: string[] = []) => {
        for (const id of abrir) abiertas.add(id);
        render(container);
      };
      // El optimizador guarda el último plan calculado: se crea una vez por
      // montaje del contenedor, no en cada navegación.
      optimizador ??= createOptimizerModal({
        loans: () => deps.store.get('loans'),
        expenses: () => deps.store.get('expenses'),
        accounts: () => deps.store.get('accounts'),
        nominas: () => deps.store.get('nominas'),
        config: () => deps.store.get('config'),
        guardarAmortizaciones: (loanId, amortizaciones) => {
          deps.store.updateItem('loans', loanId, { amortizaciones });
          notificar();
        },
        hoy,
        refrescar,
      });
      render(container);
      if (container.dataset.wired !== '1') {
        wire(container, refrescar, optimizador);
        container.dataset.wired = '1';
      }
    },
  };
}
