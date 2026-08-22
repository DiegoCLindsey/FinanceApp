// ── features/loans/optimizer-modal ────────────────────────────────────────────
// Optimizador de amortizaciones: formulario de parámetros, plan manual y
// comparativa de frecuencias.
//
// El plan calculado se guarda en el estado del módulo, no se serializa dentro de
// un `onclick` — el legacy hacía
// `onclick="LoansModule.aplicarPlanOptimizado(${JSON.stringify(plan)...})"`,
// que además de ser enorme rompía en cuanto un nombre de préstamo traía comillas.

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import { saldoRealCuenta } from '@/core/accounts';
import { compararFrecuencias, optimizarAmortizaciones, type ComparativaFila, type PlanItem } from '@/engine/optimizer';
import type { Account, AppConfig, Expense, Loan, Nomina } from '@/state/schema';
import { esc, onChange, onClick, toast } from '../accounting/dom';
import { featureActiva } from '@/flags/guard';
import { campo, selector } from './forms';

export interface OptimizerModalDeps {
  loans: () => Loan[];
  expenses: () => Expense[];
  accounts: () => Account[];
  nominas: () => Nomina[];
  config: () => AppConfig;
  /** Persiste las amortizaciones del plan. */
  guardarAmortizaciones: (loanId: string, amortizaciones: NonNullable<Loan['amortizaciones']>) => void;
  hoy: () => ISODate;
  /** Re-render de la vista, abriendo las tarjetas indicadas. */
  refrescar: (abrir?: string[]) => void;
}

/** Prefijo de las amortizaciones generadas por el optimizador. */
const PREFIJO_OPT = 'opt_';

const esOptimizada = (id: unknown) => String(id).startsWith(PREFIJO_OPT);

export function createOptimizerModal(deps: OptimizerModalDeps) {
  // Resultado vivo de la última comparativa, para poder aplicar una fila.
  let comparativa: { resultados: ComparativaFila[]; saldoBase: number; fechaObjetivo: ISODate } | null = null;
  let planManual: { plan: PlanItem[]; tipoAmort: string } | null = null;

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');

  function abrirModal(titulo: string, html: string): HTMLElement | null {
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return null;
    el.innerHTML = `<div class="modal-title">${esc(titulo)}</div>${html}`;
    ov.classList.remove('hidden');
    return el;
  }

  const cerrar = () => overlay()?.classList.add('hidden');

  /** Borra las amortizaciones de un plan anterior. Devuelve si había alguna. */
  function limpiarPlanPrevio(): boolean {
    let habia = false;
    for (const loan of deps.loans()) {
      const sinOpt = (loan.amortizaciones || []).filter((a) => !esOptimizada(a._id));
      if (sinOpt.length !== (loan.amortizaciones || []).length) {
        deps.guardarAmortizaciones(loan._id, sinOpt);
        habia = true;
      }
    }
    return habia;
  }

  // ── Formulario de parámetros ────────────────────────────────────────────────

  /**
   * Ejecuta un cálculo del motor y convierte el corte por feature flag en un
   * aviso, en vez de dejar que reviente por dentro sin que se vea nada.
   *
   * El motor lanza cuando la funcionalidad está desactivada (ver `flags/guard`).
   * Aquí no se distingue "apagado" de cualquier otro fallo a propósito: en ambos
   * casos lo correcto es no pintar resultados y decir por qué.
   */
  function conAviso<T>(fn: () => T): T | null {
    try {
      return fn();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'No se ha podido completar el cálculo', 'err');
      return null;
    }
  }

  function abrir(): void {
    if (!featureActiva('optimizador')) {
      toast('El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.', 'err');
      return;
    }
    const loans = deps.loans().filter((l) => l.activo && !l.simulacion);
    if (loans.length === 0) {
      toast('No hay préstamos activos para optimizar', 'err');
      return;
    }
    const config = deps.config();
    const cuentas = deps.accounts().filter((a) => a.activo && !a.simulacion);
    const principalId = cuentas.find((a) => a.esCuentaPrincipal)?._id ?? cuentas[0]?._id ?? '';
    const fechaSugerida = config.dashboardEnd || `${Number(deps.hoy().slice(0, 4)) + 5}-01-01`;

    const el = abrirModal(
      '✨ Optimizar amortizaciones',
      `
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${
          cuentas
            .map(
              (
                a,
              ) => `<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${esc(a._id)}"${a._id === principalId ? ' checked' : ''} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${esc(a.nombre)}${a._id === principalId ? ' <span class="badge badge-blue" style="font-size:10px">principal</span>' : ''}</span>
                <span class="text-sm" style="color:var(--text3)">${esc(formatEUR(saldoRealCuenta(a)))}</span>
              </label>`,
            )
            .join('') || '<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'
        }
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${loans
          .map(
            (
              l,
            ) => `<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${esc(l._id)}"${l.tin >= 5 ? ' checked' : ''} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${esc(l.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${esc(l.tin)}% TIN</span>
            </label>`,
          )
          .join('')}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${campo('opt-horizonte', 'Horizonte (meses)', 'number', 60, '60')}
        ${campo('opt-frecuencia', 'Frecuencia manual (cada N meses)', 'number', 1, '1')}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${campo('opt-min', 'Importe mínimo por amortización (€)', 'number', 500, '500')}
        ${selector(
          'opt-tipo',
          'Efecto de la amortización',
          [
            ['plazo', 'Reducir plazo (mantener cuota)'],
            ['cuota', 'Reducir cuota (mantener plazo)'],
          ],
          'plazo',
        )}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${campo('opt-fecha-primera', 'Fecha primera amortización', 'date', '')}
        ${campo('opt-fecha-obj', 'Fecha objetivo para comparar saldo', 'date', fechaSugerida)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`,
    );
    if (!el) return;

    pintarMargenes(el);
    onChange(el, '.opt-acc-radio', () => pintarMargenes(el));
    onClick(el, '[data-opt-todos]', () => {
      const checks = [...el.querySelectorAll<HTMLInputElement>('.opt-loan-check')];
      const todos = checks.every((c) => c.checked);
      checks.forEach((c) => (c.checked = !todos));
    });
    onClick(el, '[data-cancelar]', cerrar);
    onClick(el, '[data-opt-calcular]', () => calcularPlanManual(el));
    onClick(el, '[data-opt-comparar]', () => compararFrecuenciasUI(el));
  }

  /** Márgenes aplicables a la cuenta de origen elegida. */
  function pintarMargenes(el: HTMLElement): void {
    const accId = el.querySelector<HTMLInputElement>('.opt-acc-radio:checked')?.value;
    const margenes = (deps.config().margenesSeguridad || []).filter((m) => m.activo !== false);
    const aplicables = margenes.filter((m) => !m.cuentas || m.cuentas.length === 0 || (accId && m.cuentas.includes(accId)));
    const wrap = el.querySelector('#opt-margenes-wrap');
    if (!wrap) return;
    wrap.innerHTML =
      aplicables.length === 0
        ? '<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>'
        : aplicables
            .map(
              (
                m,
              ) => `<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${esc(m._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${esc(m.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!m.cuentas || m.cuentas.length === 0 ? 'Todas las cuentas' : 'Esta cuenta'}</span>
              </label>`,
            )
            .join('');
  }

  /** Lee los parámetros del formulario ANTES de sustituir el modal. */
  function leerParametros(el: HTMLElement) {
    const num = (sel: string, def: number, min = 0) => {
      const v = parseFloat((el.querySelector(sel) as HTMLInputElement | null)?.value ?? '');
      return Number.isFinite(v) ? Math.max(min, v) : def;
    };
    const checks = [...el.querySelectorAll<HTMLInputElement>('.opt-loan-check')];
    const seleccionados = checks.filter((c) => c.checked).map((c) => c.value);
    return {
      horizonte: Math.round(num('#opt-horizonte', 60, 1)),
      frecuencia: Math.round(num('#opt-frecuencia', 1, 1)),
      minAmortizable: num('#opt-min', 500),
      tipoAmort: (el.querySelector('#opt-tipo') as HTMLSelectElement | null)?.value || 'plazo',
      fechaObjetivo: (el.querySelector('#opt-fecha-obj') as HTMLInputElement | null)?.value || null,
      fechaPrimeraAmort: (el.querySelector('#opt-fecha-primera') as HTMLInputElement | null)?.value || null,
      // null = todos; el motor lo interpreta así y evita filtrar de más
      loanIds: checks.length === 0 || seleccionados.length === checks.length ? null : seleccionados,
      sourceAccountId: el.querySelector<HTMLInputElement>('.opt-acc-radio:checked')?.value ?? null,
      selectedMarginIds: [...el.querySelectorAll<HTMLInputElement>('.opt-margin-check:checked')].map((i) => i.value),
    };
  }

  const datosMotor = () => ({
    loans: deps.loans(),
    expenses: deps.expenses(),
    accounts: deps.accounts(),
    config: deps.config(),
    nominas: deps.nominas(),
  });

  function sinResultados(mensaje: string, detalle = ''): void {
    const el = abrirModal(
      'Sin resultados',
      `<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${esc(mensaje)}</div>
        ${detalle ? `<div class="text-sm mt-8" style="color:var(--text3)">${esc(detalle)}</div>` : ''}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`,
    );
    if (el) {
      onClick(el, '[data-opt-volver]', abrir);
      onClick(el, '[data-cancelar]', cerrar);
    }
  }

  // ── Plan manual ─────────────────────────────────────────────────────────────

  function calcularPlanManual(el: HTMLElement): void {
    const p = leerParametros(el);
    if (limpiarPlanPrevio()) toast('Plan anterior eliminado, recalculando…');
    const { loans, expenses, accounts, config, nominas } = datosMotor();

    const resultado = conAviso(() =>
      optimizarAmortizaciones(loans, expenses, accounts, config, {
        frecuencia: p.frecuencia,
        mesesHorizonte: p.horizonte,
        minAmortizable: p.minAmortizable,
        tipoAmort: p.tipoAmort,
        fechaPrimeraAmort: p.fechaPrimeraAmort,
        loanIds: p.loanIds,
        nominas,
        sourceAccountId: p.sourceAccountId,
        selectedMarginIds: p.selectedMarginIds,
      }),
    );
    if (!resultado) return;

    if (resultado.plan.length === 0) {
      sinResultados(
        `No hay excedente suficiente respetando los ${resultado.margenesAplicados} márgenes de seguridad activos en los próximos ${p.horizonte} meses para generar amortizaciones por encima del mínimo de ${formatEUR(p.minAmortizable)}.`,
        'Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.',
      );
      return;
    }

    planManual = { plan: resultado.plan, tipoAmort: p.tipoAmort };
    const titulo = `✨ Plan de optimización · ${p.frecuencia === 1 ? 'Mensual' : `Cada ${p.frecuencia} meses`} · ${p.horizonte}m`;
    const el2 = abrirModal(
      titulo,
      `
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${esc(formatEUR(resultado.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${esc(formatEUR(resultado.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${esc(formatEUR(resultado.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${resultado.margenesAplicados}</div></div>
      </div>
      ${resultado.resumenPorLoan.map(tarjetaResumenLoan).join('')}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${resultado.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${resultado.plan.map((p2) => filaPlan(p2, true)).join('')}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">
        Las amortizaciones se añaden como <strong>simulaciones</strong> y no afectan tus datos reales
        hasta que las conviertas en reales manualmente desde cada préstamo.
      </div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Descartar</button>
        <button class="btn-primary" data-opt-aplicar>Aplicar plan como simulación</button>
      </div>`,
    );
    if (!el2) return;
    onClick(el2, '[data-opt-volver]', abrir);
    onClick(el2, '[data-cancelar]', cerrar);
    onClick(el2, '[data-opt-aplicar]', () => {
      if (planManual) aplicarPlan(planManual.plan, planManual.tipoAmort);
    });
  }

  // ── Comparativa de frecuencias ──────────────────────────────────────────────

  function compararFrecuenciasUI(el: HTMLElement): void {
    const p = leerParametros(el);
    limpiarPlanPrevio();
    const { loans, expenses, accounts, config, nominas } = datosMotor();

    const resultado = conAviso(() =>
      compararFrecuencias(loans, expenses, accounts, config, {
        horizonte: p.horizonte,
        minAmortizable: p.minAmortizable,
        tipoAmort: p.tipoAmort,
        fechaObjetivo: p.fechaObjetivo,
        frecuencias: [1, 2, 3, 6, 12],
        fechaPrimeraAmort: p.fechaPrimeraAmort,
        loanIds: p.loanIds,
        nominas,
        sourceAccountId: p.sourceAccountId,
        selectedMarginIds: p.selectedMarginIds,
      }),
    );
    if (!resultado) return;

    if (resultado.resultados.length === 0) {
      sinResultados('No hay excedente suficiente en ninguna frecuencia.');
      return;
    }

    comparativa = resultado;
    const { resultados, saldoBase, fechaObjetivo } = resultado;
    const filas = resultados
      .map((r) => {
        const mejores = [r.esMejorIntereses && '💰 +intereses', r.esMejorSaldo && '🏦 +saldo', r.esMejorValor && '⭐ +valor total']
          .filter(Boolean)
          .join(' ');
        return `<tr style="${r.esMejorValor ? 'background:rgba(46,230,168,0.06);' : ''}">
          <td style="font-weight:600">${esc(r.label)}</td>
          <td class="num">${r.numAmortizaciones}</td>
          <td class="num neg">${esc(formatEUR(r.totalAmortizado))}</td>
          <td class="num pos">${esc(formatEUR(r.ahorroIntereses))}</td>
          <td class="num ${r.saldoObjetivo >= saldoBase ? 'pos' : 'neg'}">${esc(formatEUR(r.saldoObjetivo))}</td>
          <td class="num pos">${esc(formatEUR(r.valorTotal))}</td>
          <td style="font-size:11px">${mejores}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${r.frecuencia}">Usar</button></td>
        </tr>`;
      })
      .join('');

    const el2 = abrirModal(
      `📊 Comparativa de frecuencias · hasta ${fechaObjetivo}`,
      `
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${esc(fechaObjetivo)}: <strong>${esc(formatEUR(saldoBase))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${esc(fechaObjetivo.slice(0, 7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`,
    );
    if (!el2) return;
    onClick(el2, '[data-opt-volver]', abrir);
    onClick(el2, '[data-cancelar]', cerrar);
    onClick(el2, '[data-opt-usar]', (btn) => aplicarDesdeComparador(Number(btn.getAttribute('data-opt-usar'))));
  }

  function aplicarDesdeComparador(frecuencia: number): void {
    const fila = comparativa?.resultados.find((r) => r.frecuencia === frecuencia);
    if (!fila) return;
    limpiarPlanPrevio();
    aplicarPlan(fila.plan, fila.plan[0]?.tipoAmort || 'plazo', {
      titulo: `✨ Plan ${fila.label} · aplicado`,
      resumen: fila,
      fechaObjetivo: comparativa?.fechaObjetivo,
    });
  }

  // ── Aplicación del plan ─────────────────────────────────────────────────────

  function aplicarPlan(
    plan: PlanItem[],
    tipoAmort: string,
    detalle?: { titulo: string; resumen: ComparativaFila; fechaObjetivo?: ISODate },
  ): void {
    if (plan.length === 0) return;
    const porLoan = new Map<string, NonNullable<Loan['amortizaciones']>>();
    for (const p of plan) {
      const lista = porLoan.get(p.loanId) ?? [];
      lista.push({
        _id: `${PREFIJO_OPT}${p.mes}_${p.loanId}`,
        fecha: p.fechaAmort,
        cantidad: p.cantidadAmort,
        tipo: tipoAmort,
        simulacion: true,
      });
      porLoan.set(p.loanId, lista);
    }

    let aplicados = 0;
    for (const loan of deps.loans()) {
      const nuevas = porLoan.get(loan._id);
      if (!nuevas) continue;
      const conservadas = (loan.amortizaciones || []).filter((a) => !esOptimizada(a._id));
      deps.guardarAmortizaciones(loan._id, [...conservadas, ...nuevas]);
      aplicados += 1;
    }

    toast(`Plan aplicado: ${plan.length} amortizaciones en ${aplicados} préstamo${aplicados !== 1 ? 's' : ''} (simulación)`);
    if (detalle) mostrarDetalleAplicado(detalle);
    else cerrar();
    deps.refrescar([...porLoan.keys()]);
  }

  function mostrarDetalleAplicado({
    titulo,
    resumen,
    fechaObjetivo,
  }: {
    titulo: string;
    resumen: ComparativaFila;
    fechaObjetivo?: ISODate;
  }): void {
    const el = abrirModal(
      titulo,
      `
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${esc(formatEUR(resumen.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${esc(formatEUR(resumen.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${esc(fechaObjetivo?.slice(0, 7) ?? '')}</div><div class="stat-value pos">${esc(formatEUR(resumen.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${esc(formatEUR(resumen.totalComisiones))}</div></div>
      </div>
      ${resumen.resumenPorLoan.map(tarjetaResumenLoan).join('')}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${resumen.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${resumen.plan.map((p) => filaPlan(p, false)).join('')}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`,
    );
    if (el) onClick(el, '[data-cancelar]', cerrar);
  }

  return {
    abrir,
    get planManual() {
      return planManual;
    },
    get comparativa() {
      return comparativa;
    },
  };
}

// ── Fragmentos compartidos ────────────────────────────────────────────────────

function filaPlan(p: PlanItem, conSaldos: boolean): string {
  const comision = p.comision > 0 ? `<br><span style="font-size:9px;color:var(--text3)">+${esc(formatEUR(p.comision))} com.</span>` : '';
  return `<tr>
    <td class="num">${esc(p.mes)}</td>
    <td>${esc(p.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${p.tin.toFixed(2)}%</td>
    <td class="num">${esc(formatEUR(p.capitalAntes))}</td>
    <td class="num neg">${esc(formatEUR(p.cantidadAmort))}${comision}</td>
    <td class="num">${esc(formatEUR(p.capitalDespues))}</td>
    ${conSaldos ? `<td class="num" style="color:var(--text3)">${esc(formatEUR(p.saldoDisponible))} → ${esc(formatEUR(p.saldoDespues))}</td>` : ''}
  </tr>`;
}

function tarjetaResumenLoan(r: {
  nombre: string;
  tin: number;
  fechaFinSin: string;
  fechaFinCon: string;
  mesesAhorrados: number;
  ahorroIntereses: number;
  numAmortizaciones: number;
  totalAmortizado: number;
}): string {
  return `<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${esc(r.nombre)}</span>
      <span class="badge badge-yellow">${esc(r.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${esc(r.fechaFinSin)}</div>
        <div class="num pos">${esc(r.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${r.mesesAhorrados > 0 ? `${r.mesesAhorrados}m` : '—'}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${esc(formatEUR(r.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${r.numAmortizaciones} amorts.</div><div class="num">${esc(formatEUR(r.totalAmortizado))}</div></div>
    </div>
  </div>`;
}

export { todayISO };
