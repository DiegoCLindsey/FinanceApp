// ── features/taxes ────────────────────────────────────────────────────────────
// Fiscalidad (F1, tarea 1.7 — port de `rentas/rentas.js`).
//
// Cambios respecto a la versión legacy, además del tipado:
//   · sin `onclick=` inline: pestañas y recálculo por delegación de eventos;
//   · cambiar de pestaña ya no repinta la vista entera. El legacy llamaba a
//     `render()` dentro de `setTab` "para actualizar los estilos", lo que
//     recalculaba la declaración y borraba lo que hubiera escrito el usuario
//     en los campos manuales;
//   · toda la aritmética sale de `core/tax/renta` y `core/tax/nomina-grupo`,
//     donde está una sola vez y con tests. La vista tenía la CUARTA copia del
//     apilado de IRPF por grupo y su propia versión de las reducciones.
//
// Errores de cálculo corregidos (ver core/tax/renta.ts y tabs.ts):
//   · el resumen y la pestaña de trabajo calculaban el IRPF con `calcIRPF` sobre
//     el bruto CRUDO —sin cotización, sin art. 19.2/20 y sin apilado de grupo—
//     de modo que no cuadraban con lo que decía la vista de Nóminas;
//   · el neto del resumen era `(bruto × 12) − IRPF × 12` sobre un bruto que ya
//     es anual, y la pestaña de trabajo etiquetaba de "mensual" importes
//     anuales y buscaba el tramo marginal con `bruto × 12`;
//   · el límite deducible de las aportaciones a planes de pensiones era
//     `min(8.000, 30 % del RNT)` en el borrador y 1.500 € en la pestaña de al
//     lado, para el mismo dato;
//   · "otros ingresos sujetos a IRPF" multiplicaba por la frecuencia en vez de
//     dividir: un ingreso trimestral contaba 36 veces al año.

import { formatEUR } from '@/core/money';
import { todayISO, type ISODate } from '@/core/dates';
import { crearResolverTramos } from '@/core/tax/tables';
import { TRAMOS_IRPF_DEFAULT, type Tramos } from '@/core/tax/irpf';
import { TRAMOS_AHORRO_DEFAULT } from '@/core/tax/ahorro';
import { calcFondoInversion } from '@/core/tax/pension';
import { desgloseNomina } from '@/core/tax/nomina-grupo';
import { calcularDeclaracion, ingresoAnual, type Declaracion, type ExtrasDeclaracion } from '@/core/tax/renta';
import type { FeatureManifest } from '@/app/feature-registry';
import type { Account, AppConfig, Escenario, Expense, Nomina, TablaFiscalAnual } from '@/state/schema';
import { esc, onClick } from '../accounting/dom';
import { cuadroDeclaracion, tabDeclaracion } from './declaracion';
import { tabCapitalInmobiliario, tabCapitalMobiliario, tabRendimientosTrabajo } from './tabs';

export interface TaxesStoreLike {
  get(key: 'accounts'): Account[];
  get(key: 'nominas'): Nomina[];
  get(key: 'expenses'): Expense[];
  get(key: 'escenarios'): Escenario[];
  get(key: 'tramosIRPFHistorico'): TablaFiscalAnual[];
  get(key: 'tramosGananciasCapitalHistorico'): TablaFiscalAnual[];
  get(key: 'config'): AppConfig;
}

export interface TaxesViewDeps {
  store: TaxesStoreLike;
  /** Inyectable para que los tests no dependan del día en que se ejecutan. */
  hoy?: () => ISODate;
}

type Pestaña = 'declaracion' | 'mobiliario' | 'trabajo' | 'inmobiliario';

const PESTAÑAS: [Pestaña, string][] = [
  ['declaracion', 'Declaración Renta'],
  ['mobiliario', 'Capital Mobiliario'],
  ['trabajo', 'Rendimientos del Trabajo'],
  ['inmobiliario', 'Capital Inmobiliario'],
];

const ICONO =
  'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z';

export function createTaxesFeature(deps: TaxesViewDeps): FeatureManifest {
  const hoy = deps.hoy ?? todayISO;
  let pestaña: Pestaña = 'declaracion';
  /** Importes que el usuario introduce a mano; sobreviven al cambio de pestaña. */
  let extras: ExtrasDeclaracion = {};

  const config = () => deps.store.get('config');
  const año = () => Number(hoy().slice(0, 4));
  const nominasActivas = () => deps.store.get('nominas').filter((n) => n.activo);
  const planes = () => deps.store.get('accounts').filter((a) => (a.modeloFondo || 'cuenta') === 'pension');
  const nombreEscenario = (id: string) => deps.store.get('escenarios').find((e) => e._id === id)?.nombre ?? id;

  const tramosGenerales = (): Tramos =>
    crearResolverTramos(deps.store.get('tramosIRPFHistorico'), config().tramos_irpf ?? TRAMOS_IRPF_DEFAULT)(año());
  const tramosAhorro = (): Tramos =>
    crearResolverTramos(deps.store.get('tramosGananciasCapitalHistorico'), config().tramosGananciasCapital ?? TRAMOS_AHORRO_DEFAULT)(año());

  // ── Declaración ─────────────────────────────────────────────────────────────

  function declaracion(): Declaracion {
    const desde = `${año()}-01-01`;
    // Las simulaciones no entran en un borrador de la renta real
    const nominas = deps.store.get('nominas').filter((n) => n.activo && !(n as { simulacion?: boolean }).simulacion);
    const aportacionesPension = planes().reduce(
      (s, p) => s + (p.aportaciones || []).filter((a) => a.fecha >= desde).reduce((ss, a) => ss + a.cantidad, 0),
      0,
    );
    const otrosIngresos = deps.store
      .get('expenses')
      .filter((e) => e.activo && e.sujetoIRPF && e.tipo === 'ingreso')
      .reduce((s, e) => s + ingresoAnual(e), 0);

    return calcularDeclaracion({
      nominas,
      aportacionesPension,
      otrosIngresos,
      extras,
      tramosGeneral: tramosGenerales(),
      tramosAhorro: tramosAhorro(),
    });
  }

  // ── Resumen ─────────────────────────────────────────────────────────────────

  /** Titulares del año: IRPF y neto del trabajo, y la carga latente de los fondos. */
  function resumen(): string {
    const tramos = tramosGenerales();
    const nominas = nominasActivas();
    const grupoDe = (n: Nomina) => (n.grupoNomina ? nominas.filter((x) => (x.grupoNomina || '') === n.grupoNomina) : null);
    const desgloses = nominas.map((n) => desgloseNomina(n, grupoDe(n), tramos));
    const brutoTotal = desgloses.reduce((s, d) => s + d.brutoAnual, 0);
    const irpfTotal = desgloses.reduce((s, d) => s + d.irpfAnual, 0);
    const ssTotal = desgloses.reduce((s, d) => s + d.ssAnual, 0);

    const fondos = deps.store.get('accounts').filter((a) => (a.modeloFondo || 'cuenta') === 'inversion');
    let plusvalia = 0;
    let impuesto = 0;
    for (const f of fondos) {
      const inv = calcFondoInversion(f, tramosAhorro());
      if (inv) {
        plusvalia += inv.plusvalia;
        impuesto += inv.impuesto;
      }
    }

    if (brutoTotal <= 0 && fondos.length === 0) return '';

    const item = (label: string, valor: string, clase: string) =>
      `<div class="exec-item"><div class="exec-item-label">${esc(label)}</div><div class="exec-item-val ${clase}">${esc(valor)}</div></div>`;

    return `<div class="exec-summary mb-14">
      ${brutoTotal > 0 ? item('IRPF trabajo', `${formatEUR(irpfTotal)}/año`, 'neg') : ''}
      ${brutoTotal > 0 ? item('Neto trabajo', `${formatEUR(brutoTotal - ssTotal - irpfTotal)}/año`, 'pos') : ''}
      ${fondos.length > 0 ? item('Plusvalía latente', formatEUR(plusvalia), plusvalia >= 0 ? 'pos' : 'neg') : ''}
      ${fondos.length > 0 ? item('Imp. potencial (inversión)', formatEUR(impuesto), 'neg') : ''}
    </div>`;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function contenidoPestaña(): string {
    if (pestaña === 'mobiliario') return tabCapitalMobiliario(deps.store.get('accounts'), tramosAhorro(), nombreEscenario);
    if (pestaña === 'trabajo')
      return tabRendimientosTrabajo({ nominas: nominasActivas(), planes: planes(), tramos: tramosGenerales(), hoy: hoy() });
    if (pestaña === 'inmobiliario') return tabCapitalInmobiliario();
    return tabDeclaracion({
      año: año(),
      extras,
      declaracion: declaracion(),
      nominas: nominasActivas().map((n) => ({ nombre: n.nombre, bruto: n.bruto || 0 })),
      planes: planes().map((p) => p.nombre),
    });
  }

  function botonPestaña(id: Pestaña, label: string): string {
    const activa = pestaña === id;
    return `<button data-tab-fisc="${id}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${activa ? '600' : '400'};
      color:${activa ? 'var(--accent)' : 'var(--text2)'};
      border-bottom:2px solid ${activa ? 'var(--accent)' : 'transparent'};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${esc(label)}</button>`;
  }

  /** Repinta solo las pestañas y el contenido; el resumen no cambia al navegar. */
  function pintarPestañas(container: HTMLElement): void {
    const barra = container.querySelector('#fisc-tabs');
    const cuerpo = container.querySelector('#fisc-tab-content');
    if (barra) barra.innerHTML = PESTAÑAS.map(([id, label]) => botonPestaña(id, label)).join('');
    if (cuerpo) cuerpo.innerHTML = contenidoPestaña();
  }

  function render(container: HTMLElement): void {
    container.innerHTML = `
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${resumen()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${PESTAÑAS.map(([id, label]) => botonPestaña(id, label)).join('')}
      </div>
      <div id="fisc-tab-content">${contenidoPestaña()}</div>`;
  }

  // ── Cableado ────────────────────────────────────────────────────────────────

  function wire(container: HTMLElement): void {
    onClick(container, '[data-tab-fisc]', (el) => {
      pestaña = (el.getAttribute('data-tab-fisc') || 'declaracion') as Pestaña;
      pintarPestañas(container);
    });

    // Los campos manuales recalculan solo el cuadro: repintar la pestaña entera
    // le quitaría el foco al usuario mientras escribe.
    container.addEventListener('input', (ev) => {
      const campo = (ev.target as HTMLElement | null)?.closest('[data-rex]');
      if (!campo) return;
      const leer = (id: string) => (container.querySelector(`#${id}`) as HTMLInputElement | null)?.value ?? '0';
      extras = {
        capInmobiliario: parseFloat(leer('rex-inmobiliario')) || 0,
        capMobiliario: parseFloat(leer('rex-mobiliario')) || 0,
        gananciasFondos: parseFloat(leer('rex-ganancias')) || 0,
        otrasCorto: parseFloat(leer('rex-otras')) || 0,
        retCapital: parseFloat(leer('rex-ret-cap')) || 0,
      };
      const cuadro = container.querySelector('#renta-cuadro');
      if (cuadro) cuadro.innerHTML = cuadroDeclaracion(declaracion());
    });
  }

  return {
    id: 'fiscalidad',
    route: 'rentas',
    nombre: 'Fiscalidad',
    flagId: 'fiscalidad',
    seccion: 2, // "Planificación"
    iconoPath: ICONO,
    mount(container: HTMLElement) {
      render(container);
      if (container.dataset.wired !== '1') {
        wire(container);
        container.dataset.wired = '1';
      }
    },
  };
}
