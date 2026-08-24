// ── engine/avisos ─────────────────────────────────────────────────────────────
// Lo que va a pasar y todavía se puede evitar.
//
// La aplicación ya detectaba los cruces —`detectarPuntosCriticos` para el saldo
// negativo y el colchón, `detectarCrucesMargenes` para los márgenes— pero solo
// los enseñaba como un contador («⚠ 2 cruces») dentro del resumen ejecutivo, o
// escondidos en la vista de márgenes. Un aviso que hay que ir a buscar no es un
// aviso.
//
// Este módulo los convierte en una lista corta, fechada y ordenada por urgencia.
// Tres reglas, y las tres son de las que se notan:
//
//  1. **Uno por causa.** Una proyección que se hunde bajo el colchón durante
//     ocho meses genera un cruce por cada vaivén. Solo interesa el PRIMERO: es
//     la fecha a partir de la cual hay problema. El resto es la misma noticia
//     repetida.
//  2. **Horizontes distintos por gravedad.** Quedarse en números rojos importa
//     aunque sea a un año: da tiempo a cambiar algo. Rozar el colchón dentro de
//     diez meses, no: a esa distancia el dato está dentro del margen de error y
//     avisar de ello solo enseña al usuario a ignorar los avisos.
//  3. **Un cruce más pequeño que la incertidumbre no se afirma, se sugiere.**
//     Si la banda de confianza (`accounting/confianza`) a esa fecha es de
//     ±2.000 € y la proyección se pasa del colchón por 300 €, decir «bajas de tu
//     colchón» es falso. Se dice «podrías bajar». Es opcional: el motor no
//     depende de contabilidad, recibe una función.

import { diasEntre, parseLocalDate, todayISO, type ISODate } from '@/core/dates';
import { formatEUR } from '@/core/money';
import type { PuntoCritico } from './analysis';
import type { AlertaMargen, ColchonConfig, MargenSeguridad } from './margins';

export type GravedadAviso = 'critico' | 'aviso';

export interface Aviso {
  /** Estable para una misma causa: sirve para no repetir el aviso al repintar. */
  id: string;
  gravedad: GravedadAviso;
  fecha: ISODate;
  /** Días desde hoy. Nunca negativo: el pasado no se avisa. */
  dias: number;
  /** El plazo dicho como lo diría una persona: «en tres semanas». */
  plazo: string;
  titulo: string;
  detalle: string;
  /** El cruce cabe dentro del margen de error: puede no llegar a pasar. */
  incierto: boolean;
}

export interface EntradaAvisos {
  puntosCriticos?: PuntoCritico[];
  crucesMargenes?: AlertaMargen[];
}

export interface OpcionesAvisos {
  hoy?: ISODate;
  /** Hasta cuándo se avisa de lo grave. Por defecto un año. */
  horizonteCritico?: number;
  /** Hasta cuándo se avisa del resto. Por defecto cuatro meses. */
  horizonteAviso?: number;
  /** Cuántos avisos como mucho. Por defecto 4. */
  maximo?: number;
  /** Media banda de confianza a `dias` vista, en euros. Ver regla 3. */
  incertidumbre?: (dias: number) => number;
}

/**
 * El colchón económico global, expresado como un margen de seguridad más.
 *
 * `detectarCrucesMargenes` ya resuelve el objetivo **fecha a fecha** respetando
 * los waypoints; el colchón tiene exactamente la misma forma pero vive en otra
 * rama del código. Envolverlo evita la alternativa mala: aproximar el colchón
 * por su valor de hoy y avisar de cruces que no son.
 *
 * Devuelve `null` cuando el colchón está apagado o no llega a nada.
 */
export function colchonComoMargen(config: (ColchonConfig & { showColchon?: boolean }) | null | undefined): MargenSeguridad | null {
  if (!config || config.showColchon === false) return null;
  const puntos = config.colchonPuntos ?? [];
  if (puntos.length > 0) return { nombre: 'Colchón', puntos: [...puntos] };

  // Sin waypoints, el colchón vale lo mismo desde siempre. Un punto anclado en
  // el pasado reproduce eso dentro del mecanismo de márgenes.
  const fijo = config.colchonTipo === 'fijo' && (config.colchonFijo || 0) > 0;
  if (fijo) return { nombre: 'Colchón', puntos: [{ fecha: '1970-01-01', tipo: 'fijo', importe: config.colchonFijo }] };
  // `|| 6` y no `?? 6` a propósito: es lo que hace `calcColchon`, donde 0 meses
  // significa «el valor por defecto». Divergir aquí rompería la paridad y el
  // aviso hablaría de un colchón distinto del que se pinta en el gráfico.
  return { nombre: 'Colchón', puntos: [{ fecha: '1970-01-01', tipo: 'meses', meses: config.colchonMeses || 6 }] };
}

/** Días naturales entre dos fechas ISO. Envoltorio del de `core/dates`. */
export function diasEntreISO(desde: ISODate, hasta: ISODate): number {
  return diasEntre(parseLocalDate(desde), parseLocalDate(hasta));
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** «2026-11-24» → «24 de noviembre». Con el año solo si no es el de `hoy`. */
export function fechaEnPalabras(fecha: ISODate, hoy: ISODate): string {
  const [y, m, d] = fecha.split('-').map(Number);
  const mismoAño = fecha.slice(0, 4) === hoy.slice(0, 4);
  return `${d} de ${MESES[m - 1]}${mismoAño ? '' : ` de ${y}`}`;
}

/** El plazo dicho como lo diría una persona, no en días sueltos. */
export function describirPlazo(dias: number): string {
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'mañana';
  if (dias < 7) return `en ${dias} días`;
  if (dias < 14) return 'en una semana';
  if (dias < 31) return `en ${Math.round(dias / 7)} semanas`;
  if (dias < 45) return 'en un mes';
  return `en ${Math.round(dias / 30)} meses`;
}

interface Candidato {
  id: string;
  gravedad: GravedadAviso;
  fecha: ISODate;
  /** Cuánto se pasa del umbral, en euros positivos. */
  distancia: number;
  titulo: (incierto: boolean) => string;
  detalle: (fechaTexto: string) => string;
}

/**
 * Convierte los cruces ya detectados en avisos con antelación.
 *
 * Devuelve como mucho `maximo`, del más cercano al más lejano, y solo los que
 * están por delante: un cruce que ya ha ocurrido no es un aviso, es historia.
 */
export function construirAvisos(entrada: EntradaAvisos, opciones: OpcionesAvisos = {}): Aviso[] {
  const { hoy = todayISO(), horizonteCritico = 365, horizonteAviso = 120, maximo = 4, incertidumbre } = opciones;

  const candidatos: Candidato[] = [];

  for (const p of entrada.puntosCriticos ?? []) {
    if (p.tipo === 'saldo_negativo') {
      candidatos.push({
        id: 'saldo-negativo',
        gravedad: 'critico',
        fecha: p.fecha,
        distancia: Math.abs(p.saldo),
        titulo: (i) => (i ? 'Podrías quedarte en números rojos' : 'Te quedas en números rojos'),
        detalle: (f) => `El ${f} el saldo proyectado baja a ${formatEUR(p.saldo)}.`,
      });
    } else if (p.tipo === 'bajo_colchon') {
      candidatos.push({
        id: 'bajo-colchon',
        gravedad: 'aviso',
        fecha: p.fecha,
        distancia: Math.abs(p.saldo),
        titulo: (i) => (i ? 'Podrías bajar de tu colchón' : 'Bajas de tu colchón'),
        detalle: (f) => `El ${f} el saldo queda en ${formatEUR(p.saldo)}, por debajo del colchón.`,
      });
    }
    // 'recuperacion_colchon' es una buena noticia, y las buenas noticias no son
    // avisos: enseñarlas aquí diluye las que sí piden hacer algo.
  }

  for (const a of entrada.crucesMargenes ?? []) {
    if (a.tipo !== 'bajo_margen') continue;
    candidatos.push({
      id: `margen:${a.nombre}`,
      gravedad: 'aviso',
      fecha: a.fecha,
      distancia: Math.max(0, a.target - a.saldo),
      titulo: (i) => (i ? `Podrías bajar de «${a.nombre}»` : `Bajas de «${a.nombre}»`),
      detalle: (f) => `El ${f} tendrías ${formatEUR(a.saldo)}, y el margen pide ${formatEUR(a.target)}.`,
    });
  }

  // Regla 1: uno por causa, el más cercano.
  const primeros = new Map<string, Candidato>();
  for (const c of candidatos) {
    const previo = primeros.get(c.id);
    if (!previo || c.fecha < previo.fecha) primeros.set(c.id, c);
  }

  const avisos: Aviso[] = [];
  for (const c of primeros.values()) {
    const dias = diasEntreISO(hoy, c.fecha);
    if (dias < 0) continue; // ya ha pasado
    // Regla 2: el horizonte depende de la gravedad.
    if (dias > (c.gravedad === 'critico' ? horizonteCritico : horizonteAviso)) continue;
    // Regla 3: si el cruce cabe en el margen de error, no se afirma.
    const margen = incertidumbre ? incertidumbre(dias) : 0;
    const incierto = margen > 0 && c.distancia < margen;
    avisos.push({
      id: c.id,
      gravedad: c.gravedad,
      fecha: c.fecha,
      dias,
      plazo: describirPlazo(dias),
      titulo: c.titulo(incierto),
      detalle: c.detalle(fechaEnPalabras(c.fecha, hoy)),
      incierto,
    });
  }

  // Por fecha: lo que primero hay que atender va primero. La gravedad NO manda
  // sobre la fecha —un descubierto dentro de ocho meses no es más urgente que
  // quedarte sin colchón la semana que viene—, solo desempata.
  const orden = { critico: 0, aviso: 1 };
  avisos.sort((a, b) => a.fecha.localeCompare(b.fecha) || orden[a.gravedad] - orden[b.gravedad]);
  return avisos.slice(0, maximo);
}
