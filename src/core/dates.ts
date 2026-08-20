// ── core/dates ────────────────────────────────────────────────────────────────
// Helpers de fecha únicos para todo el dominio. Regla de oro: las fechas del
// dominio son strings `YYYY-MM-DD` interpretados en hora LOCAL. Nunca usar
// `Date.toISOString()` para serializar una fecha local (retrocede un día en
// husos al oeste de UTC — riesgo §5.1 de docs/01-analisis-features.md).

export type ISODate = string; // 'YYYY-MM-DD'

/** Serializa un Date usando sus componentes locales (corrige el bug de toISOString). */
export function formatLocalDate(d: Date): ISODate {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parsea 'YYYY-MM-DD' a medianoche local (equivalente a new Date(iso+'T00:00:00')). */
export function parseLocalDate(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Fecha de hoy en local, como ISODate. */
export function todayISO(): ISODate {
  return formatLocalDate(new Date());
}

/** Último día del mes (month0 es 0-based). */
export function lastDayOfMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

/** Día del mes con clamp al último día real (p.ej. 31 → 28 en febrero). */
export function clampedDate(year: number, month0: number, day: number): ISODate {
  return formatLocalDate(new Date(year, month0, Math.min(day, lastDayOfMonth(year, month0))));
}

// ── Día de pago efectivo ──────────────────────────────────────────────────────
// Formato diaPago:
//   ''               → sin ajuste
//   'dia:N'          → día N del mes (1-31, con clamp)
//   'dia:ultimo'     → último día del mes
//   'nthweekday:N:W' → N-ésimo (1-5) día de la semana W (0=Dom…6=Sáb); N=-1 → último

export type DiaPago = string;

export function resolverDiaEfectivo(year: number, month0: number, diaPago: DiaPago): ISODate | null {
  if (!diaPago) return null;
  if (diaPago.startsWith('dia:')) {
    const spec = diaPago.slice(4);
    if (spec === 'ultimo') return formatLocalDate(new Date(year, month0 + 1, 0));
    const n = parseInt(spec);
    if (!isNaN(n)) return clampedDate(year, month0, n);
  }
  if (diaPago.startsWith('nthweekday:')) {
    const parts = diaPago.split(':');
    const nth = parseInt(parts[1]);
    const wd = parseInt(parts[2]);
    if (nth === -1) {
      const last = new Date(year, month0 + 1, 0);
      while (last.getDay() !== wd) last.setDate(last.getDate() - 1);
      return formatLocalDate(last);
    }
    const d = new Date(year, month0, 1);
    while (d.getDay() !== wd) d.setDate(d.getDate() + 1);
    d.setDate(d.getDate() + (nth - 1) * 7);
    if (d.getMonth() !== month0) d.setDate(d.getDate() - 7);
    return formatLocalDate(d);
  }
  return null;
}

/** Aplica diaPago a una fecha ISO manteniendo año/mes, cambiando solo el día. */
export function ajustarFechaPago(fechaISO: ISODate, diaPago: DiaPago): ISODate {
  if (!diaPago) return fechaISO;
  const d = parseLocalDate(fechaISO);
  return resolverDiaEfectivo(d.getFullYear(), d.getMonth(), diaPago) ?? fechaISO;
}

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const ORDINAL: Record<string, string> = { '-1': 'último', '1': '1º', '2': '2º', '3': '3º', '4': '4º', '5': '5º' };

export function labelDiaPago(diaPago: DiaPago): string {
  if (!diaPago) return '';
  if (diaPago.startsWith('dia:')) {
    const s = diaPago.slice(4);
    return s === 'ultimo' ? 'Último día del mes' : `Día ${s} del mes`;
  }
  if (diaPago.startsWith('nthweekday:')) {
    const parts = diaPago.split(':');
    const nth = parts[1];
    const wd = parseInt(parts[2]);
    return `${ORDINAL[nth] || nth + 'º'} ${DIAS_SEMANA[wd]} del mes`;
  }
  return diaPago;
}

/**
 * Días de calendario entre dos fechas locales.
 *
 * Restar milisegundos y dividir por 86 400 000 NO da días de calendario: en los
 * cambios de hora un día dura 23 o 25 horas, así que la cuenta se desvía una
 * fracción de día por cada transición atravesada. Sobre una capitalización
 * compuesta ese error se arrastra. Normalizando a UTC las tres componentes de
 * cada fecha la resta es exacta, porque UTC no tiene horario de verano.
 *
 * Los tests corrían en UTC, donde el fallo es invisible.
 */
export function diasEntre(desde: Date, hasta: Date): number {
  const a = Date.UTC(desde.getFullYear(), desde.getMonth(), desde.getDate());
  const b = Date.UTC(hasta.getFullYear(), hasta.getMonth(), hasta.getDate());
  return Math.round((b - a) / 86400000);
}
