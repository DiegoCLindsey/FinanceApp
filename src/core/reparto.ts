// ── core/reparto ──────────────────────────────────────────────────────────────
// Cuánto de un gasto, una nómina o un préstamo corresponde a cada persona.
//
// Sin `Reparto` (el caso normal: nadie ha tocado nada), el 100% es de la
// persona por defecto — por eso `calcularReparto` acepta `undefined` y no un
// `Reparto` obligatorio con un único participante.
//
// Regla única para los tres modos: lo que los participantes NO reclaman
// explícitamente cae en la persona por defecto (añadida si no estaba ya entre
// los participantes, o sumada a su parte si sí lo estaba) — el mismo
// principio que rige la ausencia total de reparto, aplicado al «resto» de un
// reparto parcial. Si los participantes reclaman MÁS del 100% (o más importe
// del que hay), se escala todo proporcionalmente para que quepa exacto: no
// hay overbooking posible en un gasto real.
//
// Los céntimos que sobran o faltan por redondeo NUNCA se pierden: se calculan
// una vez sobre el total en céntimos y el resto se reparte entero, así que la
// suma de las partes es SIEMPRE exactamente el total — invariante necesario
// para que el desglose por persona del dashboard cuadre con el total general.

import { toCents, fromCents } from './money';
import type { Persona, Reparto } from '@/state/schema';

/**
 * Id de la persona por defecto AHORA MISMO — no es necesariamente `'default'`:
 * el usuario puede haber marcado a otra persona como "por defecto" desde la
 * ventana de Personas. Todo el que necesite saber quién es la persona por
 * defecto para repartir algo debe pasar por aquí, no asumir el id de fábrica.
 */
export function idPersonaPorDefecto(personas: Persona[]): string {
  return personas.find((p) => p.esPorDefecto)?._id ?? personas[0]?._id ?? 'default';
}

export interface ParticipacionCalculada {
  personaId: string;
  /** Importe en euros, ya redondeado a céntimo. */
  importe: number;
}

/** Enteros que suman exactamente `totalCts`, repartidos lo más igual posible. */
function repartirEntero(totalCts: number, n: number): number[] {
  if (n <= 0) return [];
  const signo = totalCts < 0 ? -1 : 1;
  const abs = Math.abs(totalCts);
  const base = Math.floor(abs / n);
  const resto = abs - base * n;
  return Array.from({ length: n }, (_, i) => signo * (base + (i < resto ? 1 : 0)));
}

/** Añade `restoCts` a la persona por defecto (o la crea como participante) sin duplicar ni perder céntimos. */
function conResto(ids: string[], cts: number[], restoCts: number, idPersonaDefecto: string): { ids: string[]; cts: number[] } {
  if (restoCts === 0) return { ids, cts };
  const idx = ids.indexOf(idPersonaDefecto);
  if (idx >= 0) {
    const nuevosCts = [...cts];
    nuevosCts[idx] += restoCts;
    return { ids, cts: nuevosCts };
  }
  return { ids: [...ids, idPersonaDefecto], cts: [...cts, restoCts] };
}

/**
 * Reparte `importeTotal` (euros) entre las personas del `Reparto`. Sin
 * reparto, o con una lista de participantes vacía, el 100% es de
 * `idPersonaDefecto`.
 */
export function calcularReparto(
  importeTotal: number,
  reparto: Reparto | null | undefined,
  idPersonaDefecto: string,
): ParticipacionCalculada[] {
  const totalCts = toCents(importeTotal);

  if (!reparto || reparto.participantes.length === 0) {
    return [{ personaId: idPersonaDefecto, importe: fromCents(totalCts) }];
  }

  const ids = reparto.participantes.map((p) => p.personaId);

  if (reparto.modo === 'partesIguales') {
    const cts = repartirEntero(totalCts, ids.length);
    return ids.map((personaId, i) => ({ personaId, importe: fromCents(cts[i]) }));
  }

  // porcentaje | importe: cada participante reclama una cantidad explícita.
  const reclamadoCts = reparto.participantes.map((p) => {
    const valor = Math.max(0, p.valor ?? 0);
    return reparto.modo === 'porcentaje' ? Math.round((totalCts * valor) / 100) : toCents(valor);
  });
  const sumaReclamadaCts = reclamadoCts.reduce((a, b) => a + b, 0);
  // El total puede ser negativo (un ingreso repartido, por ejemplo); lo que
  // importa para saber si hay sobre-reclamo es la magnitud, no el signo.
  const sobreReclamado = Math.abs(sumaReclamadaCts) > Math.abs(totalCts) && sumaReclamadaCts !== 0;

  if (sobreReclamado) {
    const factor = totalCts / sumaReclamadaCts;
    const escaladoCts = reclamadoCts.map((c) => Math.round(c * factor));
    // El redondeo del escalado puede dejar un céntimo suelto: al primer
    // participante, para que la suma cuadre exacta sin inventar una regla de
    // reparto de más sobre un caso que ya es un error de los datos de entrada.
    const sumaEscalada = escaladoCts.reduce((a, b) => a + b, 0);
    if (escaladoCts.length > 0) escaladoCts[0] += totalCts - sumaEscalada;
    return ids.map((personaId, i) => ({ personaId, importe: fromCents(escaladoCts[i]) }));
  }

  const restoCts = totalCts - sumaReclamadaCts;
  const { ids: idsFinal, cts: ctsFinal } = conResto(ids, reclamadoCts, restoCts, idPersonaDefecto);
  return idsFinal.map((personaId, i) => ({ personaId, importe: fromCents(ctsFinal[i]) }));
}

/** Lo mínimo de un evento de caja (extracto legacy o motor nuevo) para poder atribuirlo a una persona. */
export interface EventoConFuente {
  cuantia: number;
  tipo: string;
  sourceType: string;
  sourceId: string;
}

/** Lo mínimo de un gasto, préstamo o nómina para poder repartirlo. */
export interface ItemConReparto {
  _id: string;
  repartoConsumo?: Reparto;
  repartoPago?: Reparto;
}

export interface AgregadoPersona {
  personaId: string;
  /** Lo que esta persona paga: gastos + cuotas de préstamo, por `repartoPago`. */
  pago: number;
  /** Lo que esta persona consume: los mismos gastos y cuotas, por `repartoConsumo`. */
  consumo: number;
  /** Ingresos de nómina que le corresponden, por `repartoConsumo` (quién los percibe). */
  ingresos: number;
}

/**
 * Busca el gasto/préstamo/nómina que originó un evento. Los eventos de nómina
 * añaden un sufijo al id para IRPF, SS o cada componente de retribución
 * flexible (`<id>_irpf`, `<id>_ss`, `<id>_flex_<comp>`) — de ahí el `startsWith`,
 * no solo la igualdad exacta.
 */
function buscarFuente(items: ItemConReparto[], sourceId: string): ItemConReparto | undefined {
  return items.find((x) => x._id === sourceId || sourceId.startsWith(`${x._id}_`));
}

/**
 * Agrega, persona a persona, cuánto paga y cuánto consume de gastos y cuotas
 * de préstamo, y cuánto ingresa de nómina — a partir de los eventos de caja ya
 * calculados por el motor de proyección (el extracto legacy o el nuevo), para
 * que el desglose por persona del dashboard cuadre exactamente con las mismas
 * cifras que ya enseña el resto del cuadro de mando, mes a mes.
 *
 * Alcance deliberadamente limitado a gastos (`tipo: 'gasto'`), cuotas de
 * préstamo e ingresos de nómina — lo mismo que cubre el reparto en los
 * formularios. Otros orígenes (intereses de cuenta, aportaciones, impuestos de
 * inversión...) no llevan reparto y quedan fuera del desglose.
 */
export function agregarPorPersona(
  eventos: EventoConFuente[],
  fuentes: { expenses: ItemConReparto[]; loans: ItemConReparto[]; nominas: ItemConReparto[] },
  personas: Persona[],
): AgregadoPersona[] {
  const idDefecto = idPersonaPorDefecto(personas);
  const totales = new Map<string, AgregadoPersona>();
  const de = (id: string): AgregadoPersona => {
    let a = totales.get(id);
    if (!a) {
      a = { personaId: id, pago: 0, consumo: 0, ingresos: 0 };
      totales.set(id, a);
    }
    return a;
  };
  // Todas las personas aparecen aunque no tengan movimiento, para que el
  // dashboard pueda enseñar "0 €" en vez de omitirlas.
  for (const p of personas) de(p._id);

  for (const ev of eventos) {
    const importe = Math.abs(ev.cuantia);
    if (importe === 0) continue;

    if (ev.sourceType === 'expense' && ev.tipo === 'gasto') {
      const item = buscarFuente(fuentes.expenses, ev.sourceId);
      for (const p of calcularReparto(importe, item?.repartoPago, idDefecto)) de(p.personaId).pago += p.importe;
      for (const p of calcularReparto(importe, item?.repartoConsumo, idDefecto)) de(p.personaId).consumo += p.importe;
    } else if (ev.sourceType === 'loan') {
      const item = buscarFuente(fuentes.loans, ev.sourceId);
      for (const p of calcularReparto(importe, item?.repartoPago, idDefecto)) de(p.personaId).pago += p.importe;
      for (const p of calcularReparto(importe, item?.repartoConsumo, idDefecto)) de(p.personaId).consumo += p.importe;
    } else if (ev.sourceType === 'nomina' && ev.tipo === 'ingreso') {
      const item = buscarFuente(fuentes.nominas, ev.sourceId);
      for (const p of calcularReparto(importe, item?.repartoConsumo, idDefecto)) de(p.personaId).ingresos += p.importe;
    }
  }
  return [...totales.values()];
}

/**
 * Ids de las personas implicadas —como pagadoras o como consumidoras— en un
 * elemento con dos repartos independientes. Sin reparto en ninguno de los
 * dos, solo está implicada la persona por defecto (es la misma regla de
 * `calcularReparto`, aplicada a "quién aparece" en vez de a "cuánto le toca").
 * La usan tanto las pestañas por persona (nóminas, préstamos) como la
 * agregación del dashboard.
 */
export function personasImplicadas(
  repartoConsumo: Reparto | null | undefined,
  repartoPago: Reparto | null | undefined,
  idPersonaDefecto: string,
): Set<string> {
  const de = (r: Reparto | null | undefined): string[] =>
    !r || r.participantes.length === 0 ? [idPersonaDefecto] : r.participantes.map((p) => p.personaId);
  return new Set([...de(repartoConsumo), ...de(repartoPago)]);
}
