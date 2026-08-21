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
import type { Objetivo, Plan, ResultadoSimulacion } from '@/planner/tipos';
import { confirmar, esc, onClick, onChange, toast } from '../accounting/dom';
import { graficoPatrimonio } from './chart';
import { panelObjetivos } from './objetivos';
import { panelSimulacion, serieACsv } from './simulacion';
import { AYUDA_MODO, MODO_SUGERIDO, capitalDerivado, formularioObjetivo, formularioVehiculo, leerObjetivo, leerVehiculo } from './form';

export interface PlannerStoreLike {
  get(key: 'planes'): Plan[];
  get(key: 'accounts'): AppState['accounts'];
  get(key: 'nominas'): AppState['nominas'];
  get(key: 'expenses'): AppState['expenses'];
  get(key: 'loans'): AppState['loans'];
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

  // ── Edición de objetivos y vehículos ────────────────────────────────────────

  const overlay = () => document.getElementById('modal-overlay');
  const contenido = () => document.getElementById('modal-content');
  const cerrarModal = () => overlay()?.classList.add('hidden');

  function abrirModal(titulo: string, html: string): HTMLElement | null {
    const ov = overlay();
    const el = contenido();
    if (!ov || !el) return null;
    el.innerHTML = `<div class="modal-title">${esc(titulo)}</div>${html}`;
    ov.classList.remove('hidden');
    return el;
  }

  /** Escribe la lista de objetivos y vuelve a simular. */
  function guardarObjetivos(objetivos: Objetivo[]): void {
    guardar({ objetivos });
  }

  function editarObjetivo(container: HTMLElement, id: string | null): void {
    const plan = planActivo();
    if (!plan) return;
    const actual = id ? (plan.objetivos.find((o) => o._id === id) ?? null) : null;
    const siguiente = plan.objetivos.reduce((m, o) => Math.max(m, o.prioridad), 0) + 1;

    const el = abrirModal(actual ? `Editar «${actual.nombre}»` : 'Nuevo objetivo', formularioObjetivo(actual, plan.vehiculos, siguiente));
    if (!el) return;

    const refrescarAyuda = () => {
      const modo = (el.querySelector('#ob-modo') as HTMLSelectElement | null)?.value as keyof typeof AYUDA_MODO;
      const ayuda = el.querySelector('#ob-modo-ayuda');
      if (ayuda && modo) ayuda.textContent = AYUDA_MODO[modo];
      // Los campos específicos de cada modo solo se enseñan cuando aplican
      const mostrar = (sel: string, si: boolean) => {
        const b = el.querySelector<HTMLElement>(sel);
        if (b) b.style.display = si ? 'block' : 'none';
      };
      mostrar('#ob-bloque-fijo', modo === 'FIJO');
      mostrar('#ob-bloque-residual', modo === 'ABSORBE_RESIDUAL');
    };
    refrescarAyuda();

    const refrescarCapital = () => {
      const salida = el.querySelector('#ob-capital-derivado');
      if (salida) salida.textContent = capitalDerivado(el);
    };
    refrescarCapital();

    onChange(el, '#ob-modo', refrescarAyuda);

    // Al cambiar el tipo se sugiere el modo que le pega, y aparece o desaparece
    // el bloque de independencia económica.
    onChange(el, '#ob-tipo', () => {
      const tipo = (el.querySelector('#ob-tipo') as HTMLSelectElement).value as keyof typeof MODO_SUGERIDO;
      const modo = el.querySelector('#ob-modo') as HTMLSelectElement;
      if (modo) modo.value = MODO_SUGERIDO[tipo];
      const bloque = el.querySelector<HTMLElement>('#ob-bloque-perpetua');
      if (bloque) bloque.style.display = tipo === 'INVERSION_PERPETUA' ? 'block' : 'none';
      refrescarAyuda();
    });

    // Alternar entre «defino el capital» y «defino la renta» (§2.6)
    onChange(el, 'input[name="ob-derivar"]', () => {
      const renta = (el.querySelector('input[name="ob-derivar"]:checked') as HTMLInputElement | null)?.value === 'renta';
      const campos = el.querySelector<HTMLElement>('#ob-renta-campos');
      const importe = el.querySelector<HTMLElement>('#ob-bloque-importe');
      if (campos) campos.style.display = renta ? 'block' : 'none';
      if (importe) importe.style.display = renta ? 'none' : 'block';
      refrescarCapital();
    });
    onChange(el, '#ob-renta, #ob-swr, #ob-fiscal', refrescarCapital);

    onClick(el, '[data-ob-cancelar]', cerrarModal);

    onClick(el, '[data-ob-guardar]', () => {
      const leido = leerObjetivo(el, actual, siguiente);
      if (!leido) {
        toast('El objetivo necesita un nombre', 'err');
        return;
      }
      if (!leido.vehiculoId) {
        toast('Crea antes un vehículo donde meter el dinero', 'err');
        return;
      }
      const resto = plan.objetivos.filter((o) => o._id !== leido._id);
      guardarObjetivos([...resto, leido]);
      cerrarModal();
      toast(actual ? 'Objetivo actualizado' : `Objetivo «${leido.nombre}» creado`);
      render(container);
    });

    onClick(el, '[data-ob-borrar]', () => {
      if (!actual) return;
      if (!confirmar(`¿Borrar «${actual.nombre}»? Esto no se puede deshacer.`)) return;
      guardarObjetivos(plan.objetivos.filter((o) => o._id !== actual._id));
      cerrarModal();
      toast('Objetivo borrado');
      render(container);
    });
  }

  function editarVehiculo(container: HTMLElement, id: string | null): void {
    const plan = planActivo();
    if (!plan) return;
    const actual = id ? (plan.vehiculos.find((v) => v._id === id) ?? null) : null;

    const cuentas = deps.store
      .get('accounts')
      .filter((a) => a.activo)
      .map((a) => ({ _id: a._id, nombre: a.nombre }));
    const prestamos = deps.store
      .get('loans')
      .filter((l) => l.activo && !l.simulacion)
      .map((l) => ({ _id: l._id, nombre: l.nombre, tin: l.tin }));

    const el = abrirModal(actual ? `Editar «${actual.nombre}»` : 'Nuevo vehículo', formularioVehiculo(actual, cuentas, prestamos));
    if (!el) return;

    onChange(el, '#ve-deuda', () => {
      const marcado = (el.querySelector('#ve-deuda') as HTMLInputElement).checked;
      const bloque = el.querySelector<HTMLElement>('#ve-bloque-prestamo');
      if (bloque) bloque.style.display = marcado ? 'block' : 'none';
    });

    // Al elegir préstamo, su TIN entra como rentabilidad: amortizar deuda rinde
    // exactamente el interés que dejas de pagar.
    onChange(el, '#ve-prestamo', () => {
      const elegido = (el.querySelector('#ve-prestamo') as HTMLSelectElement).value;
      const prestamo = prestamos.find((p) => p._id === elegido);
      if (!prestamo) return;
      const rent = el.querySelector<HTMLInputElement>('#ve-rent');
      const nombre = el.querySelector<HTMLInputElement>('#ve-nombre');
      if (rent) rent.value = String(prestamo.tin);
      if (nombre && !nombre.value.trim()) nombre.value = `Amortizar ${prestamo.nombre}`;
    });

    onClick(el, '[data-ve-cancelar]', cerrarModal);

    onClick(el, '[data-ve-guardar]', () => {
      const leido = leerVehiculo(el, actual);
      if (!leido) {
        toast('El vehículo necesita un nombre', 'err');
        return;
      }
      const resto = plan.vehiculos.filter((v) => v._id !== leido._id);
      guardar({ vehiculos: [...resto, leido] });
      cerrarModal();
      toast(actual ? 'Vehículo actualizado' : `Vehículo «${leido.nombre}» creado`);
      render(container);
    });

    onClick(el, '[data-ve-borrar]', () => {
      if (!actual) return;
      const enUso = plan.objetivos.filter((o) => o.vehiculoId === actual._id);
      if (enUso.length > 0) {
        toast(`No se puede borrar: lo usan ${enUso.length} objetivo${enUso.length !== 1 ? 's' : ''}`, 'err');
        return;
      }
      if (!confirmar(`¿Borrar el vehículo «${actual.nombre}»?`)) return;
      guardar({ vehiculos: plan.vehiculos.filter((v) => v._id !== actual._id) });
      cerrarModal();
      toast('Vehículo borrado');
      render(container);
    });
  }

  /**
   * Reordena por arrastre. El orden ES la prioridad, así que tras mover se
   * renumeran todos de 1 a N: dejar huecos o empates haría que la cascada
   * dependiera del orden de inserción, que es invisible para el usuario.
   */
  function moverObjetivo(container: HTMLElement, origen: string, destino: string): void {
    const plan = planActivo();
    if (!plan || origen === destino) return;
    const orden = [...plan.objetivos].sort((a, b) => a.prioridad - b.prioridad);
    const iOrigen = orden.findIndex((o) => o._id === origen);
    const iDestino = orden.findIndex((o) => o._id === destino);
    if (iOrigen < 0 || iDestino < 0) return;

    const [movido] = orden.splice(iOrigen, 1);
    orden.splice(iDestino, 0, movido);
    guardarObjetivos(orden.map((o, i) => ({ ...o, prioridad: i + 1 })));
    render(container);
  }

  /** Lista compacta de vehículos, para poder editarlos sin salir de la pestaña. */
  function panelVehiculos(plan: Plan): string {
    if (plan.vehiculos.length === 0) {
      return `<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`;
    }

    return `<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${plan.vehiculos
          .map((v) => {
            const usos = plan.objetivos.filter((o) => o.vehiculoId === v._id).length;
            return `<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${esc(v._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left">
              <span style="font-weight:600;font-size:12px">${esc(v.nombre)}${v.esDeuda ? ' 🔒' : ''}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${esc((v.rentabilidadRealAnual * 100).toFixed(2))} % real · ${usos} objetivo${usos !== 1 ? 's' : ''}
              </span>
            </button>`;
          })
          .join('')}
      </div>
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

      ${
        pestaña === 'objetivos'
          ? `<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${panelVehiculos(plan)}`
          : ''
      }

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

    onClick(container, '[data-pl-nuevo-objetivo]', () => editarObjetivo(container, null));
    onClick(container, '[data-pl-nuevo-vehiculo]', () => editarVehiculo(container, null));
    onClick(container, '[data-pl-editar-vehiculo]', (el) =>
      editarVehiculo(container, (el as HTMLElement).dataset.plEditarVehiculo ?? null),
    );
    onClick(container, '[data-pl-editar-objetivo]', (el) =>
      editarObjetivo(container, (el as HTMLElement).dataset.plEditarObjetivo ?? null),
    );

    // Reordenar arrastrando. El orden es la prioridad (§5, pestaña 2).
    let arrastrado: string | null = null;
    container.querySelectorAll<HTMLElement>('[data-pl-objetivo]').forEach((fila) => {
      fila.addEventListener('dragstart', () => {
        arrastrado = fila.dataset.plObjetivo ?? null;
        fila.style.opacity = '0.45';
      });
      fila.addEventListener('dragend', () => {
        fila.style.opacity = '';
        container.querySelectorAll<HTMLElement>('[data-pl-objetivo]').forEach((f) => (f.style.borderTop = ''));
      });
      fila.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        if (arrastrado && fila.dataset.plObjetivo !== arrastrado) fila.style.borderTop = '2px solid var(--accent)';
      });
      fila.addEventListener('dragleave', () => {
        fila.style.borderTop = '';
      });
      fila.addEventListener('drop', (ev) => {
        ev.preventDefault();
        fila.style.borderTop = '';
        const destino = fila.dataset.plObjetivo;
        if (arrastrado && destino) moverObjetivo(container, arrastrado, destino);
        arrastrado = null;
      });
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
