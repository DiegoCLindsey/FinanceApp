// ── accounting/adjust ─────────────────────────────────────────────────────────
// "Sugerir ajuste" y "ajustar automáticamente todas" (F4, tareas 4.6 y 4.7).
//
// Al aceptar un ajuste NO se sobrescribe la estimación: se cierra la vigente y
// se crea su continuación con el importe corregido. Así el histórico sigue
// cuadrando (los meses pasados se siguen proyectando con lo que se estimó
// entonces) y el futuro usa el importe aprendido de los datos reales:
//
//   estimación original ──────────┤ fechaFin = hoy
//                                 ├────────────────── copia con cuantía ajustada
//                                 hoy            fechaFin original (si tenía)
//
// La copia queda enlazada por `ajustadaDesdeId` para poder auditar la cadena.

import { todayISO, type ISODate } from '@/core/dates';
import { roundMoney } from '@/core/money';
import type { Expense } from '@/state/schema';
import type { PrecisionEstimacion } from './precision';

export interface AjusteStoreLike {
  get(key: 'expenses'): Expense[];
  set(key: 'expenses', value: Expense[]): void;
}

export interface Sugerencia {
  estimacionId: string;
  concepto: string;
  cuantiaActual: number;
  cuantiaSugerida: number;
  /** Diferencia sugerida − actual. */
  diferencia: number;
  /** % de variación respecto a la actual. */
  variacionPct: number;
  precision: number;
  mesesConsiderados: number;
  motivo: string;
}

export interface ResultadoAjuste {
  estimacionCerrada: Expense;
  estimacionNueva: Expense;
}

export interface OpcionesAjuste {
  hoy?: ISODate;
  /** Precisión por debajo de la cual se considera que merece ajuste. */
  umbralPrecision?: number;
  /** Variación mínima (%) para molestar al usuario con una sugerencia. */
  variacionMinimaPct?: number;
}

/**
 * Sugerencia de ajuste a partir de un análisis de precisión. Devuelve `null`
 * cuando no hay datos suficientes, la precisión ya es buena o el cambio sería
 * insignificante — no se sugiere ruido.
 */
export function sugerirAjuste(analisis: PrecisionEstimacion, cuantiaActual: number, opciones: OpcionesAjuste = {}): Sugerencia | null {
  const { umbralPrecision = 90, variacionMinimaPct = 5 } = opciones;
  if (analisis.precision === null || analisis.mediaRealReciente === null) return null;
  if (analisis.meses.length === 0) return null;
  if (analisis.precision >= umbralPrecision) return null;

  const sugerida = roundMoney(analisis.mediaRealReciente);
  const diferencia = roundMoney(sugerida - cuantiaActual);
  const variacionPct = cuantiaActual !== 0 ? (diferencia / Math.abs(cuantiaActual)) * 100 : sugerida !== 0 ? 100 : 0;
  if (Math.abs(variacionPct) < variacionMinimaPct) return null;

  const n = analisis.meses.slice(-3).length;
  return {
    estimacionId: analisis.estimacionId,
    concepto: analisis.concepto,
    cuantiaActual: roundMoney(cuantiaActual),
    cuantiaSugerida: sugerida,
    diferencia,
    variacionPct,
    precision: analisis.precision,
    mesesConsiderados: n,
    motivo:
      diferencia > 0
        ? `El gasto real de los últimos ${n} meses supera lo estimado`
        : `El gasto real de los últimos ${n} meses es inferior a lo estimado`,
  };
}

export function createAdjuster(store: AjusteStoreLike) {
  function uid(): string {
    return `exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }

  /**
   * Aplica un ajuste: cierra la estimación vigente hoy y crea su continuación
   * con la cuantía nueva, heredando el resto de la configuración.
   */
  function aplicar(estimacionId: string, cuantiaNueva: number, opciones: OpcionesAjuste = {}): ResultadoAjuste {
    const hoy = opciones.hoy ?? todayISO();
    const expenses = store.get('expenses');
    const original = expenses.find((e) => e._id === estimacionId);
    if (!original) throw new Error(`La estimación ${estimacionId} no existe`);

    const cerrada: Expense = { ...original, fechaFin: hoy };
    const nueva: Expense = {
      ...original,
      _id: uid(),
      cuantia: roundMoney(cuantiaNueva),
      fechaInicio: hoy,
      fechaFin: original.fechaFin ?? null,
      // El historial de precios pertenece a la estimación anterior
      ajustadaDesdeId: original._id,
      ajustadaEn: hoy,
    };

    const siguiente = expenses.map((e) => (e._id === estimacionId ? cerrada : e));
    siguiente.push(nueva);
    store.set('expenses', siguiente);

    return { estimacionCerrada: cerrada, estimacionNueva: nueva };
  }

  /**
   * Ajusta en bloque todas las estimaciones con sugerencia. Devuelve lo aplicado
   * para que la UI pueda listarlo en la confirmación.
   */
  function aplicarTodas(
    sugerencias: Sugerencia[],
    opciones: OpcionesAjuste = {},
  ): { aplicadas: ResultadoAjuste[]; errores: { estimacionId: string; error: string }[] } {
    const aplicadas: ResultadoAjuste[] = [];
    const errores: { estimacionId: string; error: string }[] = [];
    for (const s of sugerencias) {
      try {
        aplicadas.push(aplicar(s.estimacionId, s.cuantiaSugerida, opciones));
      } catch (e) {
        errores.push({ estimacionId: s.estimacionId, error: (e as Error).message });
      }
    }
    return { aplicadas, errores };
  }

  /** Cadena de ajustes de una estimación, de la más antigua a la más reciente. */
  function cadena(estimacionId: string): Expense[] {
    const expenses = store.get('expenses');
    const porId = new Map(expenses.map((e) => [e._id, e]));
    const inicio = porId.get(estimacionId);
    if (!inicio) return [];
    // Hacia atrás
    const atras: Expense[] = [];
    let cursor: Expense | undefined = inicio;
    const vistos = new Set<string>();
    while (cursor?.ajustadaDesdeId && !vistos.has(cursor._id)) {
      vistos.add(cursor._id);
      const padre = porId.get(cursor.ajustadaDesdeId);
      if (!padre) break;
      atras.unshift(padre);
      cursor = padre;
    }
    // Hacia adelante
    const adelante: Expense[] = [];
    let actual = inicio;
    const vistosAdelante = new Set<string>([inicio._id]);
    for (;;) {
      const hijo = expenses.find((e) => e.ajustadaDesdeId === actual._id && !vistosAdelante.has(e._id));
      if (!hijo) break;
      vistosAdelante.add(hijo._id);
      adelante.push(hijo);
      actual = hijo;
    }
    return [...atras, inicio, ...adelante];
  }

  return { aplicar, aplicarTodas, cadena };
}

export type Adjuster = ReturnType<typeof createAdjuster>;
