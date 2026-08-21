// ── planner/sensibilidad ──────────────────────────────────────────────────────
// Análisis de sensibilidad (§4 del documento de diseño).
//
// Vuelve a simular variando UN parámetro cada vez y mide el impacto en las
// fechas de los hitos. La salida se presenta como «cuántos meses adelanta o
// retrasa cada palanca», que es más accionable que una cifra final aislada.
//
// Puro: entra un plan, salen números. Sin DOM ni almacenamiento.

import { simular } from './simulador';
import type { Centimos, Mes, Plan, ResultadoSimulacion } from './tipos';

/** Qué se está moviendo. */
export type Palanca = 'rentabilidad' | 'disfrute' | 'ingresos';

export interface VarianteSensibilidad {
  /** Etiqueta legible: '−2 puntos', '+20 %'… */
  etiqueta: string;
  /** Magnitud del cambio, en las unidades de la palanca. */
  delta: number;
  /** Es el plan tal cual está configurado. */
  esBase: boolean;
  viable: boolean;
  /** Mes de cada hito, por id de objetivo. */
  hitos: Record<string, Mes>;
  /**
   * Meses que se adelanta (negativo) o retrasa (positivo) el ÚLTIMO hito
   * respecto de la base. `null` si en alguno de los dos casos no se alcanza.
   */
  desplazamientoMeses: number | null;
  patrimonioFinal: Centimos;
}

export interface EjeSensibilidad {
  palanca: Palanca;
  titulo: string;
  /** Qué significa moverlo, para el rótulo de la UI. */
  descripcion: string;
  variantes: VarianteSensibilidad[];
}

/** Puntos porcentuales sobre la rentabilidad de TODOS los vehículos. */
const DELTAS_RENTABILIDAD = [-2, -1, 0, 1, 2];
/** Puntos porcentuales sobre el disfrute. */
const DELTAS_DISFRUTE = [-10, 0, 10];
/** Porcentaje sobre los ingresos. */
const DELTAS_INGRESOS = [-20, 0, 20];

/** Índice del último hito, que es el que marca «cuándo termina el plan». */
function ultimoHito(res: ResultadoSimulacion): number | null {
  if (res.hitos.length === 0) return null;
  return Math.max(...res.hitos.map((h) => h.indice));
}

function aVariante(
  etiqueta: string,
  delta: number,
  esBase: boolean,
  res: ResultadoSimulacion,
  base: ResultadoSimulacion | null,
): VarianteSensibilidad {
  const hitos: Record<string, Mes> = {};
  for (const h of res.hitos) hitos[h.objetivoId] = h.mes;

  const propio = ultimoHito(res);
  const referencia = base ? ultimoHito(base) : propio;

  return {
    etiqueta,
    delta,
    esBase,
    viable: res.viable,
    hitos,
    // Si en alguno de los dos escenarios no se llega, la diferencia no
    // significa nada: se dice `null` en vez de inventar un cero.
    desplazamientoMeses: propio !== null && referencia !== null ? propio - referencia : null,
    patrimonioFinal: res.resumen.patrimonioFinal,
  };
}

/** Aplica una variación a una copia del plan. No muta el original. */
export function planVariado(plan: Plan, palanca: Palanca, delta: number): Plan {
  if (delta === 0) return plan;

  switch (palanca) {
    case 'rentabilidad':
      return {
        ...plan,
        vehiculos: plan.vehiculos.map((v) => ({
          ...v,
          // Puntos porcentuales, no un porcentaje relativo: bajar 2 puntos un
          // fondo al 5 % lo deja al 3 %, no al 4,9 %. Nunca por debajo de cero;
          // una rentabilidad real negativa sostenida no es un escenario, es un
          // supuesto distinto.
          rentabilidadRealAnual: Math.max(0, v.rentabilidadRealAnual + delta / 100),
        })),
      };

    case 'disfrute':
      return { ...plan, pctDisfrute: Math.min(1, Math.max(0, plan.pctDisfrute + delta / 100)) };

    case 'ingresos':
      return {
        ...plan,
        perfil: { ...plan.perfil, netoMensual: Math.max(0, Math.round(plan.perfil.netoMensual * (1 + delta / 100))) },
      };
  }
}

const signo = (n: number): string => (n > 0 ? `+${n}` : String(n));

function eje(plan: Plan, palanca: Palanca, titulo: string, descripcion: string, deltas: number[], sufijo: string): EjeSensibilidad {
  const base = simular(plan);
  const variantes = deltas.map((d) =>
    aVariante(d === 0 ? 'Plan actual' : `${signo(d)} ${sufijo}`, d, d === 0, d === 0 ? base : simular(planVariado(plan, palanca, d)), base),
  );
  return { palanca, titulo, descripcion, variantes };
}

/**
 * Los tres ejes del §4.
 *
 * Son 9 simulaciones además de la base. Con horizontes de 480 meses y varios
 * objetivos eso se nota, así que la UI debe pedirlo bajo demanda y no en cada
 * repintado.
 */
export function analizarSensibilidad(plan: Plan): EjeSensibilidad[] {
  return [
    eje(
      plan,
      'rentabilidad',
      'Rentabilidad de los vehículos',
      'Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.',
      DELTAS_RENTABILIDAD,
      'puntos',
    ),
    eje(
      plan,
      'disfrute',
      'Porcentaje de disfrute',
      'Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.',
      DELTAS_DISFRUTE,
      'puntos',
    ),
    eje(plan, 'ingresos', 'Ingresos', 'Un ascenso, un cambio de trabajo o una reducción de jornada.', DELTAS_INGRESOS, '%'),
  ];
}

/** Redacta el impacto en años y meses, para el rótulo de la UI. */
export function describirDesplazamiento(meses: number | null): string {
  if (meses === null) return 'no comparable';
  if (meses === 0) return 'sin cambio';
  const abs = Math.abs(meses);
  const años = Math.floor(abs / 12);
  const resto = abs % 12;
  const partes = [años > 0 ? `${años} año${años !== 1 ? 's' : ''}` : '', resto > 0 ? `${resto} mes${resto !== 1 ? 'es' : ''}` : '']
    .filter(Boolean)
    .join(' y ');
  return meses < 0 ? `${partes} antes` : `${partes} más tarde`;
}
