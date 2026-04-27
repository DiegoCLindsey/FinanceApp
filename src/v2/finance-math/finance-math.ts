import type { Loan, LoanScheduleRow, LoanSummary, EarlyRepayment } from '@/types/domain';

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Monthly payment for a constant-installment (French amortization) loan. */
function monthlyPayment(capital: number, tinAnual: number, meses: number): number {
  const r = tinAnual / 100 / 12;
  if (r === 0) return capital / meses;
  return (capital * r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
}

// ── Payment date resolution ───────────────────────────────────────────────────

/**
 * Resolves the effective payment date for a given year/month based on the
 * diaPago format:
 *   'dia:N'          → Day N (clamped to last day of month)
 *   'dia:ultimo'     → Last day of month
 *   'nthweekday:N:W' → Nth weekday W (0=Sun…6=Sat), N=-1 means last
 */
export function resolvePaymentDate(
  year: number,
  month0: number,
  diaPago: string
): string | null {
  if (!diaPago) return null;

  if (diaPago.startsWith('dia:')) {
    const spec = diaPago.slice(4);
    if (spec === 'ultimo') {
      return new Date(year, month0 + 1, 0).toISOString().slice(0, 10);
    }
    const n = parseInt(spec, 10);
    if (!isNaN(n)) {
      const maxDay = new Date(year, month0 + 1, 0).getDate();
      return new Date(year, month0, Math.min(n, maxDay)).toISOString().slice(0, 10);
    }
  }

  if (diaPago.startsWith('nthweekday:')) {
    const parts = diaPago.split(':');
    const nth = parseInt(parts[1], 10);
    const wd = parseInt(parts[2], 10);
    if (nth === -1) {
      const last = new Date(year, month0 + 1, 0);
      while (last.getDay() !== wd) last.setDate(last.getDate() - 1);
      return last.toISOString().slice(0, 10);
    }
    const d = new Date(year, month0, 1);
    while (d.getDay() !== wd) d.setDate(d.getDate() + 1);
    d.setDate(d.getDate() + (nth - 1) * 7);
    if (d.getMonth() !== month0) d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  }

  return null;
}

/** Adjusts an ISO date to the effective payment day within the same month. */
export function adjustPaymentDate(fechaISO: string, diaPago: string): string {
  if (!diaPago) return fechaISO;
  const d = new Date(fechaISO + 'T00:00:00');
  return resolvePaymentDate(d.getFullYear(), d.getMonth(), diaPago) ?? fechaISO;
}

/** Human-readable label for a diaPago string. */
export function labelPaymentDay(diaPago: string): string {
  const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const ORDINALS: Record<string, string> = {
    '-1': 'último',
    '1': '1º',
    '2': '2º',
    '3': '3º',
    '4': '4º',
    '5': '5º',
  };
  if (!diaPago) return '';
  if (diaPago.startsWith('dia:')) {
    const s = diaPago.slice(4);
    return s === 'ultimo' ? 'Último día del mes' : `Día ${s} del mes`;
  }
  if (diaPago.startsWith('nthweekday:')) {
    const parts = diaPago.split(':');
    const nth = parts[1];
    const wd = parseInt(parts[2], 10);
    return `${ORDINALS[nth] ?? nth + 'º'} ${DAYS[wd]} del mes`;
  }
  return diaPago;
}

// ── TAE (Annual Equivalent Rate) ─────────────────────────────────────────────

/**
 * Calculates the TAE (Tasa Anual Equivalente / APR) using Newton-Raphson.
 * The TAE accounts for the opening fee (comisionApertura) which reduces
 * the net capital received while maintaining the same monthly payments.
 */
export function calculateTAE(
  capital: number,
  tinAnual: number,
  meses: number,
  comisionAperturaPercent = 0
): number {
  // Edge case: TIN = 0 and no fees → TAE = 0
  if (tinAnual === 0 && comisionAperturaPercent === 0) return 0;

  const cuota = monthlyPayment(capital, tinAnual, meses);
  const neto = capital * (1 - comisionAperturaPercent / 100);
  let r = Math.max(tinAnual / 100 / 12, 1e-10);

  for (let i = 0; i < 200; i++) {
    const vp = (cuota * (1 - Math.pow(1 + r, -meses))) / r;
    const f = vp - neto;
    const df =
      cuota *
      ((meses * Math.pow(1 + r, -(meses + 1))) / r -
        (1 - Math.pow(1 + r, -meses)) / (r * r));
    const nr = r - f / df;
    if (Math.abs(nr - r) < 1e-10) {
      r = nr;
      break;
    }
    r = nr;
  }

  return (Math.pow(1 + r, 12) - 1) * 100;
}

// ── Loan amortization schedule ───────────────────────────────────────────────

/**
 * Builds the full French amortization schedule for a loan, incorporating
 * any scheduled early repayments (amortizaciones anticipadas).
 *
 * Early repayments of type 'plazo' recalculate the remaining term;
 * type 'cuota' recalculates the monthly payment keeping the term.
 */
export function calculateLoanSchedule(loan: Loan): LoanScheduleRow[] {
  const { capital, tin, meses, fechaInicio, comisionAmort, amortizaciones, diaPago } = loan;
  const rows: LoanScheduleRow[] = [];
  let cap = capital;
  let cur = new Date(fechaInicio + 'T00:00:00');
  const r = tin / 100 / 12;
  let mr = meses;
  let cuota = monthlyPayment(cap, tin, mr);

  const amorts = [...amortizaciones].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );
  let ai = 0;

  for (let mes = 1; mes <= meses * 2 && cap > 0.01; mes++) {
    const fd = new Date(cur);
    cur.setMonth(cur.getMonth() + 1);
    const fs = adjustPaymentDate(fd.toISOString().slice(0, 10), diaPago ?? '');

    // Apply any early repayments due before or on this payment date
    while (ai < amorts.length && amorts[ai].fecha <= fs) {
      const am: EarlyRepayment = amorts[ai];
      const cost = am.cantidad * (comisionAmort / 100);
      cap = Math.max(0, cap - am.cantidad);

      if (am.tipo === 'plazo') {
        mr = r === 0 ? Math.ceil(cap / cuota) : Math.ceil(-Math.log(1 - (cap * r) / cuota) / Math.log(1 + r));
      } else {
        mr = meses - mes + 1;
        cuota = monthlyPayment(cap, tin, mr);
      }

      rows.push({
        mes: 'AMORT',
        fecha: am.fecha,
        cuota: 0,
        interes: 0,
        amortizacion: am.cantidad,
        comisionAmort: cost,
        capitalPendiente: cap,
        esAmortizacion: true,
        simulacion: am.simulacion ?? false,
      });
      ai++;
      if (cap < 0.01) break;
    }

    if (cap < 0.01) break;

    const int = cap * r;
    const am = Math.min(cuota - int, cap);
    cap = cap - am;
    if (cap < 0.01) cap = 0;

    rows.push({
      mes,
      fecha: fs,
      cuota,
      interes: int,
      amortizacion: am,
      comisionAmort: 0,
      capitalPendiente: cap,
      esAmortizacion: false,
      simulacion: false,
    });

    mr--;
    if (mr <= 0 || cap < 0.01) break;
  }

  return rows;
}

// ── Loan summary ─────────────────────────────────────────────────────────────

/** Computes high-level loan metrics from its amortization schedule. */
export function loanSummary(loan: Loan): LoanSummary {
  const schedule = calculateLoanSchedule(loan);
  const regularRows = schedule.filter((r) => !r.esAmortizacion);
  const earlyRows = schedule.filter((r) => r.esAmortizacion);

  const cuotaMensual = regularRows[0]?.cuota ?? 0;
  const totalPagado =
    regularRows.reduce((s, r) => s + r.cuota, 0) +
    earlyRows.reduce((s, r) => s + r.amortizacion + r.comisionAmort, 0);
  const totalIntereses = regularRows.reduce((s, r) => s + r.interes, 0);
  const fechaFin = schedule.at(-1)?.fecha ?? loan.fechaInicio;
  const capitalPendiente = schedule.at(-1)?.capitalPendiente ?? 0;
  const tae = calculateTAE(loan.capital, loan.tin, loan.meses, loan.comisionApertura);

  return { cuotaMensual, tae, totalPagado, totalIntereses, fechaFin, capitalPendiente };
}

// ── Early repayment savings ───────────────────────────────────────────────────

/**
 * Calculates the interest saved (net of early repayment fees) by comparing
 * the total cost of the loan with vs. without the early repayments.
 */
export function calculateEarlyRepaymentSavings(loan: Loan): {
  interestSaved: number;
  feesPaid: number;
  netSavings: number;
  monthsSaved: number;
} {
  const withAmorts = loanSummary(loan);
  const withoutAmorts = loanSummary({ ...loan, amortizaciones: [] });

  const interestSaved = withoutAmorts.totalIntereses - withAmorts.totalIntereses;
  const feesPaid = calculateLoanSchedule(loan)
    .filter((r) => r.esAmortizacion)
    .reduce((s, r) => s + r.comisionAmort, 0);

  const scheduleWith = calculateLoanSchedule(loan).filter((r) => !r.esAmortizacion);
  const scheduleWithout = calculateLoanSchedule({ ...loan, amortizaciones: [] }).filter(
    (r) => !r.esAmortizacion
  );

  return {
    interestSaved,
    feesPaid,
    netSavings: interestSaved - feesPaid,
    monthsSaved: scheduleWithout.length - scheduleWith.length,
  };
}

// ── IRPF tax calculation ──────────────────────────────────────────────────────

/**
 * Calculates income tax due given an annual gross income and progressive
 * tax brackets. Each bracket is [minIncome, ratePercent].
 */
export function calculateIRPF(
  baseImponible: number,
  tramos: [number, number][]
): number {
  if (!tramos.length || baseImponible <= 0) return 0;

  const sorted = [...tramos].sort((a, b) => a[0] - b[0]);
  let tax = 0;

  for (let i = 0; i < sorted.length; i++) {
    const [min, rate] = sorted[i];
    const max = sorted[i + 1]?.[0] ?? Infinity;
    if (baseImponible <= min) break;
    const taxableInBracket = Math.min(baseImponible, max) - min;
    tax += taxableInBracket * (rate / 100);
  }

  return tax;
}
