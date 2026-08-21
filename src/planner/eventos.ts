// ── planner/eventos ───────────────────────────────────────────────────────────
// Plantillas de los casos frecuentes del §2.7 y utilidades de escenarios (§5,
// pestaña 5). Puro: sin DOM ni almacenamiento.
//
// Las plantillas existen porque los eventos son lo que de verdad mueve un plan
// —los cambios de vida— y describir «venta de vivienda» como
// INYECCION_CAPITAL con importe = precio − hipoteca − gastos es justo el tipo de
// cuenta que se hace mal a las once de la noche.

import type { Centimos, Evento, Mes, Plan, TipoEvento } from './tipos';

export interface CampoPlantilla {
  id: string;
  etiqueta: string;
  /** Ayuda breve; explica de dónde sale el número. */
  ayuda?: string;
  porDefecto?: number;
}

export interface PlantillaEvento {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  tipo: TipoEvento;
  campos: CampoPlantilla[];
  /** Calcula el importe final a partir de los campos, en céntimos. */
  calcular(valores: Record<string, Centimos>): Centimos;
  /** Texto que se guarda en las notas del evento. */
  resumir(valores: Record<string, Centimos>): string;
}

const eur = (c: Centimos): string => (c / 100).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const PLANTILLAS: PlantillaEvento[] = [
  {
    id: 'venta-vivienda',
    nombre: 'Venta de vivienda',
    icono: '🏠',
    descripcion:
      'Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.',
    tipo: 'INYECCION_CAPITAL',
    campos: [
      { id: 'precio', etiqueta: 'Precio de venta (€)', ayuda: 'Lo que te paga el comprador' },
      { id: 'hipoteca', etiqueta: 'Hipoteca pendiente (€)', ayuda: 'Capital vivo el día de la firma' },
      { id: 'gastos', etiqueta: 'Impuestos y gastos (€)', ayuda: 'Plusvalía municipal, IRPF de la ganancia, agencia, notaría' },
    ],
    // Restar la hipoteca y los gastos es EL cálculo de este evento. Meter el
    // precio de venta a secas infla el plan por decenas de miles de euros.
    calcular: (v) => Math.max(0, (v.precio ?? 0) - (v.hipoteca ?? 0) - (v.gastos ?? 0)),
    resumir: (v) => `Venta ${eur(v.precio ?? 0)} € − hipoteca ${eur(v.hipoteca ?? 0)} € − gastos ${eur(v.gastos ?? 0)} €`,
  },
  {
    id: 'nueva-hipoteca',
    nombre: 'Nueva hipoteca',
    icono: '🔑',
    descripcion: 'Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.',
    tipo: 'NUEVA_DEUDA',
    campos: [{ id: 'cuota', etiqueta: 'Cuota mensual (€)', ayuda: 'Se suma a tus gastos fijos a partir de ese mes' }],
    calcular: (v) => v.cuota ?? 0,
    resumir: (v) => `Cuota de ${eur(v.cuota ?? 0)} €/mes`,
  },
  {
    id: 'hijo',
    nombre: 'Llegada de un hijo',
    icono: '👶',
    descripcion: 'Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.',
    tipo: 'CAMBIO_GASTOS_FIJOS',
    campos: [
      { id: 'actuales', etiqueta: 'Gastos fijos actuales (€)', ayuda: 'Se rellena con lo que tengas en el plan' },
      { id: 'incremento', etiqueta: 'Incremento mensual (€)', ayuda: 'Guardería, ropa, sanidad…' },
    ],
    // El motor espera el NUEVO valor absoluto, no el delta: se suma aquí para
    // que quien lo rellena piense en el incremento, que es como se piensa.
    calcular: (v) => (v.actuales ?? 0) + (v.incremento ?? 0),
    resumir: (v) => `Gastos fijos ${eur(v.actuales ?? 0)} € → ${eur((v.actuales ?? 0) + (v.incremento ?? 0))} €/mes`,
  },
  {
    id: 'subida-sueldo',
    nombre: 'Subida de sueldo',
    icono: '📈',
    descripcion: 'Fija tu neto mensual en un valor nuevo desde ese mes.',
    tipo: 'CAMBIO_INGRESOS',
    campos: [
      { id: 'actual', etiqueta: 'Neto mensual actual (€)', ayuda: 'Se rellena con lo que tengas en el plan' },
      { id: 'subida', etiqueta: 'Subida mensual neta (€)', ayuda: 'Lo que te llega a la cuenta, no el bruto' },
    ],
    calcular: (v) => (v.actual ?? 0) + (v.subida ?? 0),
    resumir: (v) => `Neto ${eur(v.actual ?? 0)} € → ${eur((v.actual ?? 0) + (v.subida ?? 0))} €/mes`,
  },
  {
    id: 'inyeccion',
    nombre: 'Entrada de dinero',
    icono: '💰',
    descripcion: 'Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.',
    tipo: 'INYECCION_CAPITAL',
    campos: [{ id: 'importe', etiqueta: 'Importe (€)' }],
    calcular: (v) => v.importe ?? 0,
    resumir: (v) => `Entrada de ${eur(v.importe ?? 0)} €`,
  },
];

export const plantillaPorId = (id: string): PlantillaEvento | undefined => PLANTILLAS.find((p) => p.id === id);

/** Descripción legible de un evento ya guardado. */
export function describirEvento(ev: Evento, nombreObjetivo?: string): string {
  switch (ev.tipo) {
    case 'INYECCION_CAPITAL':
      return `Entra ${eur(ev.importe)} €${nombreObjetivo ? ` → «${nombreObjetivo}»` : ' al reparto general'}`;
    case 'CAMBIO_INGRESOS':
      return `El neto mensual pasa a ${eur(ev.importe)} €`;
    case 'CAMBIO_GASTOS_FIJOS':
      return `Los gastos fijos pasan a ${eur(ev.importe)} €/mes`;
    case 'NUEVA_DEUDA':
      return `Los gastos fijos suben ${eur(ev.importe)} €/mes`;
  }
}

// ── Escenarios (§5, pestaña 5) ────────────────────────────────────────────────

/**
 * Copia un plan entero con identificadores nuevos.
 *
 * Los ids de objetivos y vehículos se renuevan porque un plan es un agregado
 * cerrado: si dos planes compartieran ids, editar un objetivo en uno tocaría el
 * del otro en cuanto algo los buscara por id. Las referencias internas
 * (`vehiculoId`, `objetivoDestinoId`) se reescriben en consecuencia.
 */
export function duplicarPlan(plan: Plan, nombre: string, nuevoId: string, creadoEn: string): Plan {
  const sufijo = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  const mapaVeh = new Map(plan.vehiculos.map((v) => [v._id, `veh_${sufijo()}`]));
  const mapaObj = new Map(plan.objetivos.map((o) => [o._id, `obj_${sufijo()}`]));

  return {
    ...plan,
    _id: nuevoId,
    nombre,
    // El duplicado NO nace activo: el usuario decide cuándo cambiarse a él.
    activo: false,
    creadoEn,
    vehiculos: plan.vehiculos.map((v) => ({ ...v, _id: mapaVeh.get(v._id)! })),
    objetivos: plan.objetivos.map((o) => ({ ...o, _id: mapaObj.get(o._id)!, vehiculoId: mapaVeh.get(o.vehiculoId) ?? o.vehiculoId })),
    eventos: plan.eventos.map((e) => ({
      ...e,
      _id: `ev_${sufijo()}`,
      objetivoDestinoId: e.objetivoDestinoId ? (mapaObj.get(e.objetivoDestinoId) ?? null) : null,
    })),
  };
}

export interface DiferenciaHito {
  nombre: string;
  /** Mes en cada plan comparado, por índice; null si no se alcanza. */
  meses: (Mes | null)[];
  /** Meses de diferencia respecto del primero; null si falta alguno. */
  diferencias: (number | null)[];
}

/** Empareja los hitos de varios planes POR NOMBRE, que es lo único común. */
export function compararHitos(
  planes: { nombre: string; hitos: { objetivoId: string; nombre: string; mes: Mes; indice: number }[] }[],
): DiferenciaHito[] {
  const nombres = [...new Set(planes.flatMap((p) => p.hitos.map((h) => h.nombre)))];

  return nombres.map((nombre) => {
    const encontrados = planes.map((p) => p.hitos.find((h) => h.nombre === nombre) ?? null);
    const indices = encontrados.map((h) => (h ? h.indice : null));
    const referencia = indices[0];
    return {
      nombre,
      meses: encontrados.map((h) => (h ? h.mes : null)),
      diferencias: indices.map((i) => (i !== null && referencia !== null ? i - referencia : null)),
    };
  });
}
