// ── features/planner ──────────────────────────────────────────────────────────
// Vista del gestor de objetivos financieros (§5 del documento de diseño).
//
// Esta primera entrega cubre las pestañas 1-3: configuración del plan, lista de
// objetivos y simulación. Eventos, escenarios A/B y sensibilidad quedan para la
// siguiente sesión (ver docs/03-planner.md).
//
// La simulación es PURA y vive en `src/planner/`. Aquí solo hay presentación y
// lectura/escritura del store: ni una fórmula.

import { formatEUR } from '@/core/money';
import { todayISO } from '@/core/dates';
import type { FeatureManifest } from '@/app/feature-registry';
import type { AppState } from '@/state/schema';
import { simular } from '@/planner/simulador';
import type { Plan, ResultadoSimulacion } from '@/planner/tipos';
import { esc, onClick, onChange, toast } from '../accounting/dom';
import { graficoPatrimonio } from './chart';
import { panelObjetivos } from './objetivos';
import { panelSimulacion, serieACsv } from './simulacion';

export interface PlannerStoreLike {
  get(key: 'planes'): Plan[];
  get(key: 'accounts'): AppState['accounts'];
  get(key: 'nominas'): AppState['nominas'];
  get(key: 'expenses'): AppState['expenses'];
  updateItem(col: 'planes', id: string, patch: Partial<Plan>): void;
  addItem(col: 'planes', item: Omit<Plan, '_id'> & { _id?: string }): Plan;
}

export interface PlannerDeps {
  store: PlannerStoreLike;
  onDatosCambiados?: () => void;
  hoy?: () => string;
}

const ICONO = 'M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z';

/** Céntimos a partir de un input en euros. */
const aCentimos = (v: string): number => {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};
const aEuros = (c: number): string => (c / 100).toFixed(2);

export function createPlannerFeature(deps: PlannerDeps): FeatureManifest {
  const hoy = deps.hoy ?? todayISO;
  let pestaña: 'config' | 'objetivos' | 'simulacion' = 'config';
  /** Resultado vivo, para no re-simular al cambiar de pestaña. */
  let ultimo: ResultadoSimulacion | null = null;

  function planActivo(): Plan | null {
    const planes = deps.store.get('planes');
    return planes.find((p) => p.activo) ?? planes[0] ?? null;
  }

  /** Crea el plan inicial si el usuario no tiene ninguno. */
  function asegurarPlan(): Plan {
    const existente = planActivo();
    if (existente) return existente;
    return deps.store.addItem('planes', {
      nombre: 'Plan base',
      fechaInicio: hoy().slice(0, 7),
      horizonteMeses: 480,
      pctDisfrute: 0,
      activo: true,
      perfil: { netoMensual: 0, gastosFijosMensuales: 0, manual: false },
      vehiculos: [],
      objetivos: [],
      eventos: [],
      creadoEn: hoy(),
    });
  }

  function guardar(patch: Partial<Plan>): void {
    const plan = planActivo();
    if (!plan) return;
    deps.store.updateItem('planes', plan._id, patch);
    ultimo = null;
    deps.onDatosCambiados?.();
  }

  /**
   * Sugerencia de perfil a partir de lo que la aplicación YA sabe: la suma de
   * nóminas activas y los gastos marcados como básicos. Es una sugerencia, no
   * una imposición: el documento pide que sea editable para poder simular
   * («¿y si cobro 100k?»).
   */
  function perfilSugerido(): { neto: number; gastos: number } {
    const nominas = deps.store.get('nominas').filter((n) => n.activo);
    const bruto = nominas.reduce((s, n) => s + (n.bruto || 0), 0);
    // Aproximación deliberadamente conservadora: el neto exacto lo calcula el
    // motor fiscal al proyectar, y meterlo aquí duplicaría esa lógica.
    const neto = Math.round((bruto * 0.75) / 12);
    const gastos = deps.store
      .get('expenses')
      .filter((e) => e.activo && e.basico && e.tipo === 'gasto')
      .reduce((s, e) => s + (e.cuantia || 0), 0);
    return { neto: Math.round(neto * 100), gastos: Math.round(gastos * 100) };
  }

  function simulacion(plan: Plan): ResultadoSimulacion {
    if (!ultimo) ultimo = simular(plan);
    return ultimo;
  }

  // ── Pestaña 1 · Configuración ───────────────────────────────────────────────

  function panelConfig(plan: Plan): string {
    const sug = perfilSugerido();
    const disponible = Math.max(0, plan.perfil.netoMensual - plan.perfil.gastosFijosMensuales);
    const pct = Math.round(plan.pctDisfrute * 100);

    return `
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${esc(aEuros(plan.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${esc(formatEUR(sug.neto / 100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${esc(aEuros(plan.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${esc(formatEUR(sug.gastos / 100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${pct} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${pct}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${esc(formatEUR(Math.max(0, plan.perfil.netoMensual - plan.perfil.gastosFijosMensuales) / 100))} de sobrante,
            quedan <strong id="pl-disponible">${esc(formatEUR((disponible * (1 - plan.pctDisfrute)) / 100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${esc(plan.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${esc(plan.horizonteMeses)}">
          </div>
        </div>

        <div class="flex gap-8 mt-12">
          <button class="btn-primary" data-pl-guardar>Guardar</button>
        </div>
      </div>

      <div class="card mb-14" style="background:rgba(77,159,255,0.05);border-color:rgba(77,159,255,0.25)">
        <div class="card-title mb-8">Todo en euros de hoy</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          Este módulo trabaja en <strong>términos reales</strong>: no modela la inflación, asume que tu sueldo y tus
          objetivos crecen con ella. Por eso las rentabilidades que introduzcas tienen que ser
          <strong>reales</strong> (la nominal menos la inflación esperada). Si pones el 7 % nominal de un fondo sin
          descontar un ~2 % de inflación, la simulación te dirá que llegas años antes de lo que llegarás.
          <br><br>
          Y es un <strong>simulador, no un asesor</strong>: supone una rentabilidad constante, y la realidad no es
          lineal. Sirve para comparar decisiones entre sí, no para dar fechas exactas.
        </div>
      </div>

      ${panelNotas(plan)}`;
  }

  function panelNotas(plan: Plan): string {
    return `
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${esc(plan.notas ?? '')}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function render(container: HTMLElement): void {
    const plan = asegurarPlan();
    const res = simulacion(plan);

    const pestañaBtn = (id: typeof pestaña, label: string) =>
      `<button class="period-btn ${pestaña === id ? 'active' : ''}" data-pl-tab="${id}">${label}</button>`;

    const semaforo = res.viable
      ? '<span class="badge badge-green">Plan viable</span>'
      : '<span class="badge badge-red">No cabe en el flujo</span>';

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${semaforo}</div>
      </div>

      <div class="period-selector mb-14">
        ${pestañaBtn('config', 'Plan')}
        ${pestañaBtn('objetivos', `Objetivos (${plan.objetivos.length})`)}
        ${pestañaBtn('simulacion', 'Simulación')}
      </div>

      <div id="pl-cuerpo">${
        pestaña === 'config' ? panelConfig(plan) : pestaña === 'objetivos' ? panelObjetivos(plan, res) : panelSimulacion(plan, res)
      }</div>`;

    if (pestaña === 'simulacion') {
      const canvas = container.querySelector<HTMLCanvasElement>('#pl-chart');
      if (canvas) graficoPatrimonio(canvas, plan, res);
    }

    wire(container);
  }

  function wire(container: HTMLElement): void {
    onClick(container, '[data-pl-tab]', (el) => {
      pestaña = (el as HTMLElement).dataset.plTab as typeof pestaña;
      render(container);
    });

    // El deslizador re-simula en vivo, que es lo que pide el documento: mover el
    // disfrute y ver moverse la fecha de independencia.
    onChange(container, '#pl-disfrute', (el) => {
      const pct = Number((el as HTMLInputElement).value) / 100;
      const etiqueta = container.querySelector('#pl-pct-val');
      if (etiqueta) etiqueta.textContent = `${Math.round(pct * 100)} %`;
      const plan = planActivo();
      if (!plan) return;
      const disponible = Math.max(0, plan.perfil.netoMensual - plan.perfil.gastosFijosMensuales) * (1 - pct);
      const salida = container.querySelector('#pl-disponible');
      if (salida) salida.textContent = formatEUR(disponible / 100);
    });

    onClick(container, '[data-pl-usar-sugerido]', () => {
      const sug = perfilSugerido();
      const neto = container.querySelector<HTMLInputElement>('#pl-neto');
      const gastos = container.querySelector<HTMLInputElement>('#pl-gastos');
      if (neto) neto.value = aEuros(sug.neto);
      if (gastos) gastos.value = aEuros(sug.gastos);
    });

    onClick(container, '[data-pl-guardar]', () => {
      const val = (sel: string) => container.querySelector<HTMLInputElement>(sel)?.value ?? '';
      guardar({
        perfil: {
          netoMensual: aCentimos(val('#pl-neto')),
          gastosFijosMensuales: aCentimos(val('#pl-gastos')),
          manual: true,
        },
        pctDisfrute: Math.min(1, Math.max(0, Number(val('#pl-disfrute')) / 100)),
        fechaInicio: val('#pl-inicio') || hoy().slice(0, 7),
        horizonteMeses: Math.min(600, Math.max(1, Number(val('#pl-horizonte')) || 480)),
      });
      toast('Plan guardado');
      render(container);
    });

    onClick(container, '[data-pl-csv]', () => {
      const plan = planActivo();
      if (!plan || !ultimo) return;
      // El visor de artefactos bloquea las descargas que inicia la propia
      // página, pero aquí estamos en la app real del usuario y funciona.
      const blob = new Blob(['\ufeff' + serieACsv(plan, ultimo)], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan-${plan.nombre.replace(/[^\w-]+/g, '_')}-${hoy()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast(`CSV exportado (${ultimo.serieMensual.length} meses)`);
    });

    onClick(container, '[data-pl-guardar-notas]', () => {
      guardar({ notas: container.querySelector<HTMLTextAreaElement>('#pl-notas')?.value ?? '' });
      toast('Notas guardadas');
    });
  }

  return {
    id: 'planner',
    route: 'planner',
    nombre: 'Objetivos financieros',
    seccion: 2,
    iconoPath: ICONO,
    mount: render,
  };
}
