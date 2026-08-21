// ── features/planner/form ─────────────────────────────────────────────────────
// Formularios de objetivo y de vehículo (docs/03-planner.md §3.1 y §3.2).
//
// Hasta ahora la vista solo leía: los objetivos entraban por la migración o
// editando el JSON a mano. Aquí está el alta y la edición.
//
// Los importes se escriben en EUROS y se guardan en CÉNTIMOS; la conversión
// vive solo en `leerObjetivo`/`leerVehiculo` para que no se escape a ningún
// otro sitio.

import { capitalParaRenta } from '@/planner/finanzas';
import type { Liquidez, ModoAsignacion, Objetivo, Riesgo, TipoObjetivo, Vehiculo } from '@/planner/tipos';
import { esc } from '../accounting/dom';

// ── Conversión ────────────────────────────────────────────────────────────────

export const aCentimos = (v: string | number): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};
export const aEuros = (c: number): string => (c / 100).toFixed(2);
/** Tanto por uno → porcentaje para el input, y vuelta. */
const aPct = (t: number): string => (t * 100).toFixed(2);
const dePct = (v: string): number => {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n / 100 : 0;
};

// ── Catálogos ─────────────────────────────────────────────────────────────────

const TIPOS: [TipoObjetivo, string][] = [
  ['AHORRO_OBJETIVO', 'Ahorrar una cantidad'],
  ['AMORTIZAR_DEUDA', 'Amortizar deuda'],
  ['INVERSION_PERPETUA', 'Independencia económica'],
  ['APORTACION_FIJA', 'Aportación periódica'],
];

const MODOS: [ModoAsignacion, string][] = [
  ['CUOTA_POR_FECHA', 'Cuota para llegar a la fecha'],
  ['ABSORBE_TODO', 'Se lleva todo lo disponible'],
  ['ABSORBE_RESIDUAL', 'Recibe lo que sobre'],
  ['FIJO', 'Importe fijo al mes'],
];

const LIQUIDEZ: [Liquidez, string][] = [
  ['INMEDIATA', 'Inmediata'],
  ['MEDIA', 'Media (con preaviso o penalización)'],
  ['BLOQUEADA_HASTA_JUBILACION', 'Bloqueada hasta la jubilación'],
];

const RIESGOS: [Riesgo, string][] = [
  ['NULO', 'Nulo'],
  ['BAJO', 'Bajo'],
  ['MEDIO', 'Medio'],
  ['ALTO', 'Alto'],
];

/** Modo que tiene sentido por defecto para cada tipo. */
export const MODO_SUGERIDO: Record<TipoObjetivo, ModoAsignacion> = {
  AHORRO_OBJETIVO: 'CUOTA_POR_FECHA',
  AMORTIZAR_DEUDA: 'ABSORBE_TODO',
  INVERSION_PERPETUA: 'ABSORBE_RESIDUAL',
  APORTACION_FIJA: 'FIJO',
};

// ── Piezas ────────────────────────────────────────────────────────────────────

const campo = (id: string, label: string, tipo: string, valor: string | number, ayuda = '', extra = ''): string =>
  `<div class="form-group">
    <label class="form-label" for="${id}">${label}</label>
    <input class="form-input" id="${id}" type="${tipo}" value="${esc(valor)}" ${extra}>
    ${ayuda ? `<div class="text-sm mt-4" style="color:var(--text3)">${ayuda}</div>` : ''}
  </div>`;

const selector = (id: string, label: string, opciones: [string, string][], sel: string, ayuda = ''): string =>
  `<div class="form-group">
    <label class="form-label" for="${id}">${label}</label>
    <select class="form-input" id="${id}">
      ${opciones.map(([v, t]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(t)}</option>`).join('')}
    </select>
    ${ayuda ? `<div class="text-sm mt-4" style="color:var(--text3)">${ayuda}</div>` : ''}
  </div>`;

// ── Formulario de objetivo ────────────────────────────────────────────────────

export function formularioObjetivo(o: Objetivo | null, vehiculos: Vehiculo[], siguientePrioridad: number): string {
  const esNuevo = o === null;
  const tipo = o?.tipo ?? 'AHORRO_OBJETIVO';
  const modo = o?.modoAsignacion ?? MODO_SUGERIDO[tipo];
  const derivado = !!o?.rentaDeseada;

  const opcionesVehiculo: [string, string][] =
    vehiculos.length > 0 ? vehiculos.map((v) => [v._id, v.nombre] as [string, string]) : [['', '— no hay vehículos: crea uno primero —']];

  return `
    <div class="grid-2" style="gap:10px">
      ${campo('ob-nombre', 'Nombre', 'text', o?.nombre ?? '', '', 'placeholder="Entrada del piso"')}
      ${campo('ob-prioridad', 'Prioridad', 'number', o?.prioridad ?? siguientePrioridad, 'Menor número = se sirve antes', 'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${selector('ob-tipo', 'Tipo', TIPOS as [string, string][], tipo)}
      ${selector('ob-modo', 'Cómo pide dinero', MODOS as [string, string][], modo)}
    </div>
    <div class="text-sm mb-12" id="ob-modo-ayuda" style="color:var(--text3);line-height:1.6"></div>

    <!-- Independencia económica: capital o renta (§2.6) -->
    <div id="ob-bloque-perpetua" style="display:${tipo === 'INVERSION_PERPETUA' ? 'block' : 'none'}">
      <div class="card mb-12" style="background:var(--bg3);padding:12px">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer">
            <input type="radio" name="ob-derivar" value="capital"${derivado ? '' : ' checked'} style="accent-color:var(--accent)">
            Defino el capital
          </label>
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer">
            <input type="radio" name="ob-derivar" value="renta"${derivado ? ' checked' : ''} style="accent-color:var(--accent)">
            Defino la renta que quiero
          </label>
        </div>
        <div id="ob-renta-campos" style="display:${derivado ? 'block' : 'none'}">
          <div class="grid-2" style="gap:10px">
            ${campo('ob-renta', 'Renta neta mensual (€)', 'number', aEuros(o?.rentaDeseada?.rentaNetaMensual ?? 200000), '', 'step="0.01"')}
            ${campo('ob-swr', 'Tasa de retiro seguro (%)', 'number', ((o?.rentaDeseada?.tasaRetiroSeguro ?? 0.04) * 100).toFixed(2), '', 'step="0.1"')}
          </div>
          ${campo('ob-fiscal', 'Tipo fiscal efectivo al retirar (%)', 'number', ((o?.rentaDeseada?.tipoFiscalEfectivo ?? 0.2) * 100).toFixed(2), '', 'step="0.5"')}
          <div class="text-sm mt-8" style="color:var(--yellow);line-height:1.6">
            Capital necesario: <strong id="ob-capital-derivado" style="font-family:var(--font-mono)">—</strong>
          </div>
          <div class="text-sm mt-6" style="color:var(--text3);line-height:1.6">
            Un 4 % está calibrado para que la cartera aguante <strong>unos 30 años</strong> con alta probabilidad,
            <strong>no</strong> para que el capital no baje nunca. Si no quieres tocar el principal —por ejemplo
            porque haya herencia prevista— lo prudente es 3–3,5 %.
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-importe" style="display:${derivado ? 'none' : 'block'}">
        ${campo('ob-importe', 'Importe objetivo (€)', 'number', aEuros(o?.importeObjetivo ?? 0), 'Deja 0 si no tiene meta (un cubo perpetuo)', 'step="0.01"')}
      </div>
      ${campo('ob-fecha', 'Fecha límite', 'month', o?.fechaLimite ?? '', 'Vacío = lo antes posible')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${campo('ob-saldo', 'Ya acumulado (€)', 'number', aEuros(o?.saldoActual ?? 0), 'Con lo que arranca el objetivo', 'step="0.01"')}
      ${selector('ob-vehiculo', 'Vehículo', opcionesVehiculo, o?.vehiculoId ?? opcionesVehiculo[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${modo === 'FIJO' ? 'block' : 'none'}">
        ${campo('ob-fijo', 'Importe fijo mensual (€)', 'number', aEuros(o?.importeFijoMensual ?? 0), '', 'step="0.01"')}
      </div>
      <div id="ob-bloque-residual" style="display:${modo === 'ABSORBE_RESIDUAL' ? 'block' : 'none'}">
        ${campo('ob-peso', 'Peso del residual', 'number', o?.pesoResidual ?? 1, 'Si hay varios, reparte en proporción', 'min="0" step="0.5"')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="ob-notas">Notas</label>
      <textarea class="form-input" id="ob-notas" rows="2" style="resize:vertical;font-family:var(--font-sans)">${esc(o?.notas ?? '')}</textarea>
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${esNuevo ? '' : '<button class="btn-secondary" data-ob-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ob-cancelar>Cancelar</button>
      <button class="btn-primary" data-ob-guardar>${esNuevo ? 'Crear objetivo' : 'Guardar'}</button>
    </div>`;
}

/** Lee el formulario. Devuelve null si falta lo imprescindible. */
export function leerObjetivo(raiz: HTMLElement, anterior: Objetivo | null, siguientePrioridad: number): Objetivo | null {
  const val = (id: string): string => (raiz.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';
  const nombre = val('ob-nombre').trim();
  if (!nombre) return null;

  const tipo = val('ob-tipo') as TipoObjetivo;
  const modo = val('ob-modo') as ModoAsignacion;
  const derivar = (raiz.querySelector('input[name="ob-derivar"]:checked') as HTMLInputElement | null)?.value === 'renta';
  const usaRenta = tipo === 'INVERSION_PERPETUA' && derivar;

  return {
    _id: anterior?._id ?? `obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    nombre,
    tipo,
    // Con capital derivado, `importeObjetivo` queda a null: manda la derivación,
    // que es lo que el usuario está editando.
    importeObjetivo: usaRenta ? null : aCentimos(val('ob-importe')),
    fechaLimite: val('ob-fecha') || null,
    prioridad: Math.max(1, Number(val('ob-prioridad')) || siguientePrioridad),
    modoAsignacion: modo,
    vehiculoId: val('ob-vehiculo'),
    saldoActual: aCentimos(val('ob-saldo')),
    estado: anterior?.estado ?? 'PENDIENTE',
    notas: val('ob-notas'),
    ...(modo === 'FIJO' ? { importeFijoMensual: aCentimos(val('ob-fijo')) } : {}),
    ...(modo === 'ABSORBE_RESIDUAL' ? { pesoResidual: Math.max(0, Number(val('ob-peso')) || 1) } : {}),
    ...(usaRenta
      ? {
          rentaDeseada: {
            rentaNetaMensual: aCentimos(val('ob-renta')),
            tasaRetiroSeguro: dePct(val('ob-swr')),
            tipoFiscalEfectivo: dePct(val('ob-fiscal')),
          },
        }
      : { rentaDeseada: null }),
  };
}

/** Capital derivado en vivo, para el rótulo del formulario. */
export function capitalDerivado(raiz: HTMLElement): string {
  const val = (id: string): string => (raiz.querySelector(`#${id}`) as HTMLInputElement | null)?.value ?? '';
  try {
    const { capitalNecesario } = capitalParaRenta({
      rentaNetaMensual: aCentimos(val('ob-renta')),
      tasaRetiroSeguro: dePct(val('ob-swr')),
      tipoFiscalEfectivo: dePct(val('ob-fiscal')),
    });
    return `${(capitalNecesario / 100).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`;
  } catch {
    // Parámetros imposibles (SWR 0, fiscalidad 100 %): se dice, no se inventa.
    return 'no calculable con esos parámetros';
  }
}

// ── Formulario de vehículo ────────────────────────────────────────────────────

export interface OpcionCuenta {
  _id: string;
  nombre: string;
}
export interface OpcionPrestamo {
  _id: string;
  nombre: string;
  tin: number;
}

export function formularioVehiculo(v: Vehiculo | null, cuentas: OpcionCuenta[], prestamos: OpcionPrestamo[]): string {
  const esNuevo = v === null;
  const esDeuda = !!v?.esDeuda;

  const opcCuentas: [string, string][] = [['', '— ninguna —'], ...cuentas.map((c) => [c._id, c.nombre] as [string, string])];
  const opcPrestamos: [string, string][] = [
    ['', '— ninguno —'],
    ...prestamos.map((p) => [p._id, `${p.nombre} (${p.tin} % TIN)`] as [string, string]),
  ];

  return `
    <div class="card mb-12" style="background:rgba(0,229,160,0.05);border-color:rgba(0,229,160,0.22);padding:12px">
      <div class="text-sm" style="color:var(--text2);line-height:1.7">
        <strong>Amortizar deuda también rinde.</strong> El interés que dejas de pagar es un retorno
        <strong>garantizado</strong>: un préstamo al 9 % «renta» más, y sin riesgo, que un fondo al 5 %. Por eso
        suele encabezar la prioridad, aunque cueste verlo como una inversión.
      </div>
    </div>

    <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:13px;cursor:pointer">
      <input type="checkbox" id="ve-deuda"${esDeuda ? ' checked' : ''} style="accent-color:var(--accent)">
      Este vehículo amortiza un préstamo
    </label>

    <div id="ve-bloque-prestamo" style="display:${esDeuda ? 'block' : 'none'}">
      ${selector('ve-prestamo', 'Préstamo', opcPrestamos, v?.prestamoId ?? '', 'Su TIN se usará como rentabilidad')}
    </div>

    ${campo('ve-nombre', 'Nombre', 'text', v?.nombre ?? '', '', 'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${campo(
        've-rent',
        'Rentabilidad REAL anual (%)',
        'number',
        aPct(v?.rentabilidadRealAnual ?? 0),
        'Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %',
        'step="0.1"',
      )}
      ${campo('ve-fiscal', 'Fiscalidad al retirar (%)', 'number', aPct(v?.fiscalidadRetirada ?? 0), 'Tipo efectivo sobre la plusvalía', 'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${selector('ve-liquidez', 'Liquidez', LIQUIDEZ as [string, string][], v?.liquidez ?? 'INMEDIATA')}
      ${selector('ve-riesgo', 'Riesgo', RIESGOS as [string, string][], v?.riesgo ?? 'NULO')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${campo('ve-tope', 'Tope de aportación anual (€)', 'number', v?.topeAportacionAnual ? aEuros(v.topeAportacionAnual) : '', 'Vacío = sin tope. Pensiones: 1500', 'step="0.01"')}
      ${selector('ve-cuenta', 'Cuenta asociada', opcCuentas, v?.cuentaId ?? '', 'Enlaza con una cuenta que ya tengas')}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${esNuevo ? '' : '<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${esNuevo ? 'Crear vehículo' : 'Guardar'}</button>
    </div>`;
}

export function leerVehiculo(raiz: HTMLElement, anterior: Vehiculo | null): Vehiculo | null {
  const val = (id: string): string => (raiz.querySelector(`#${id}`) as HTMLInputElement | null)?.value ?? '';
  const nombre = val('ve-nombre').trim();
  if (!nombre) return null;

  const esDeuda = (raiz.querySelector('#ve-deuda') as HTMLInputElement | null)?.checked ?? false;
  const tope = val('ve-tope').trim();

  return {
    _id: anterior?._id ?? `veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    nombre,
    rentabilidadRealAnual: dePct(val('ve-rent')),
    liquidez: val('ve-liquidez') as Liquidez,
    fiscalidadRetirada: dePct(val('ve-fiscal')),
    topeAportacionAnual: tope ? aCentimos(tope) : null,
    riesgo: val('ve-riesgo') as Riesgo,
    cuentaId: val('ve-cuenta') || null,
    prestamoId: esDeuda ? val('ve-prestamo') || null : null,
    esDeuda,
  };
}

/** Explicación del modo, para el rótulo que cambia al elegir. */
export const AYUDA_MODO: Record<ModoAsignacion, string> = {
  CUOTA_POR_FECHA:
    'Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.',
  ABSORBE_TODO: 'Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.',
  ABSORBE_RESIDUAL: 'No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.',
  FIJO: 'Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero.',
};
