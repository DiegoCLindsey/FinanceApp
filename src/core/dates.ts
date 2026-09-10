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

/**
 * Domingo de la semana de `fecha` (semana de lunes a domingo, como el
 * calendario español). Es el día que representa a la semana entera cuando algo
 * se agrupa por semanas: el cierre.
 */
export function finDeSemana(fecha: ISODate): ISODate {
  const d = parseLocalDate(fecha);
  // getDay(): 0 = domingo. Con semana de lunes a domingo, al domingo no le
  // faltan días para acabar la suya; al resto le faltan 7 − getDay().
  const faltan = d.getDay() === 0 ? 0 : 7 - d.getDay();
  d.setDate(d.getDate() + faltan);
  return formatLocalDate(d);
}

/** Suma (o resta, con `dias` negativo) días de calendario a una fecha ISO. */
export function sumarDias(fecha: ISODate, dias: number): ISODate {
  const d = parseLocalDate(fecha);
  d.setDate(d.getDate() + dias);
  return formatLocalDate(d);
}

/**
 * Primer periodo a evaluar de una serie mensual, saltando de golpe hasta la
 * ventana sin perder la fase.
 *
 * Todas las series mensuales del motor se recorrían desde `fechaInicio` con un
 * tope de iteraciones por seguridad (20 o 25 años). Eso convertía el tope en un
 * límite de EDAD: un recibo domiciliado desde 1998 o una nómina de 1995 se
 * quedaban sin proyectar —ni un solo evento— porque el bucle se agotaba antes
 * de llegar al periodo que se estaba mirando. Y sin ruido: simplemente no
 * aparecían ni en la gráfica ni en el cierre.
 *
 * Como los pagos van cada `freq` meses desde el inicio, se puede saltar
 * directamente `floor(meses hasta la ventana / freq)` periodos: el resultado
 * cae en la ventana o justo antes, nunca después, así que no se pierde ningún
 * pago (los anteriores los descarta igual el filtro de la ventana).
 */
export function arranqueMensual(inicio: Date, ventana: Date, freq: number): { year: number; month: number } {
  const paso = Math.max(1, freq);
  const year = inicio.getFullYear();
  const month = inicio.getMonth();
  const meses = (ventana.getFullYear() - year) * 12 + (ventana.getMonth() - month);
  if (meses <= 0) return { year, month };
  const total = month + Math.floor(meses / paso) * paso;
  return { year: year + Math.floor(total / 12), month: total % 12 };
}

/**
 * ¿Estaba viva una cosa con vigencia [inicio, fin] durante [desde, hasta]?
 *
 * `inicio`/`fin` vacíos significan «desde siempre» y «para siempre». Se usa
 * para no comparar una estimación con meses en los que todavía no existía: eso
 * no es un fallo de precisión, es un mes que no le tocaba.
 */
export function vigenteEnRango(
  inicio: ISODate | null | undefined,
  fin: ISODate | null | undefined,
  desde: ISODate,
  hasta: ISODate,
): boolean {
  if (inicio && inicio > hasta) return false;
  if (fin && fin < desde) return false;
  return true;
}

/**
 * Cómo se dice una periodicidad en una línea: «cada semana», «cada trimestre»…
 *
 * La cuantía de una estimación es la de CADA PAGO, así que un previsto de 80 €
 * con una cuantía de 20 € solo se entiende si al lado pone «cada 7 días».
 */
export function etiquetaPeriodicidad(tipoFrecuencia: string, frecuencia?: number): string {
  const n = Math.max(1, Math.round(frecuencia ?? 1));
  if (tipoFrecuencia === 'extraordinario') return 'una vez';
  if (tipoFrecuencia === 'diaria') {
    if (n === 1) return 'cada día';
    if (n === 7) return 'cada semana';
    if (n === 14) return 'cada 2 semanas';
    return `cada ${n} días`;
  }
  if (n === 1) return 'cada mes';
  if (n === 3) return 'cada trimestre';
  if (n === 6) return 'cada semestre';
  if (n === 12) return 'cada año';
  return `cada ${n} meses`;
}
