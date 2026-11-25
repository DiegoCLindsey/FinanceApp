// ── core/periodo ──────────────────────────────────────────────────────────────
// El periodo que mira la aplicación (cuadro de mando, gráficas, informes…).
//
// Dos modos (`config.periodoModo`):
//   · «Hoy ± X» (por defecto): de hoy menos X meses a hoy más X meses, con X =
//     6, 12 o 24 (`config.periodoMeses`). Las fechas NO se guardan: se calculan
//     al leer la configuración (state/store, `get('config')`), así que el
//     periodo avanza solo con los días y abrir la aplicación no escribe nada.
//     Guardarlas cada día haría que dos dispositivos cambiasen la config a
//     diario y la sincronización preguntaría por un conflicto casi siempre.
//   · «Intervalo específico»: las fechas guardadas, como siempre.

import { formatLocalDate, parseLocalDate, type ISODate } from './dates';

export type PeriodoModo = 'relativo' | 'especifico';
export const MESES_RELATIVOS = [6, 12, 24] as const;
export const MESES_RELATIVOS_DEFECTO = 12;

/** Suma meses sin desbordar el mes: 31 ago − 6 meses = 28/29 feb, no 3 mar. */
function sumarMeses(fecha: ISODate, n: number): ISODate {
  const d = parseLocalDate(fecha);
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const ultimo = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
  r.setDate(Math.min(d.getDate(), ultimo));
  return formatLocalDate(r);
}

/** Meses válidos del modo relativo; cualquier otro valor cae en el de por defecto. */
export function mesesRelativos(n: unknown): number {
  return (MESES_RELATIVOS as readonly number[]).includes(Number(n)) ? Number(n) : MESES_RELATIVOS_DEFECTO;
}

/** «Hoy ± meses»: los dos extremos incluidos. */
export function periodoAlrededorDe(hoy: ISODate, meses: number): { desde: ISODate; hasta: ISODate } {
  const m = mesesRelativos(meses);
  return { desde: sumarMeses(hoy, -m), hasta: sumarMeses(hoy, m) };
}

interface ConPeriodo {
  dashboardStart: ISODate;
  dashboardEnd: ISODate;
  periodoModo?: PeriodoModo;
  periodoMeses?: number;
}

/** La config con las fechas del periodo resueltas para `hoy`. Misma referencia si no cambia nada. */
export function resolverPeriodo<C extends ConPeriodo>(config: C, hoy: ISODate): C {
  if (config.periodoModo === 'especifico') return config;
  const { desde, hasta } = periodoAlrededorDe(hoy, config.periodoMeses ?? MESES_RELATIVOS_DEFECTO);
  if (config.dashboardStart === desde && config.dashboardEnd === hasta) return config;
  return { ...config, dashboardStart: desde, dashboardEnd: hasta };
}

/**
 * Al ESCRIBIR la config: quien pone unas fechas concretas está pidiendo un
 * intervalo específico (la barra de periodo, un asistente, los tests). Si el
 * modo no cambia de forma explícita en la misma escritura y las fechas nuevas
 * no son las de «hoy ± X», pasa a específico.
 */
export function normalizarPeriodoAlGuardar<C extends ConPeriodo>(anterior: C, nueva: C, hoy: ISODate): C {
  if (nueva.periodoModo !== anterior.periodoModo) return nueva;
  if (nueva.periodoModo === 'especifico') return nueva;
  const cambianFechas = nueva.dashboardStart !== anterior.dashboardStart || nueva.dashboardEnd !== anterior.dashboardEnd;
  if (!cambianFechas) return nueva;
  const { desde, hasta } = periodoAlrededorDe(hoy, nueva.periodoMeses ?? MESES_RELATIVOS_DEFECTO);
  if (nueva.dashboardStart === desde && nueva.dashboardEnd === hasta) return nueva;
  return { ...nueva, periodoModo: 'especifico' };
}
