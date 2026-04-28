import type {
  Loan,
  LoanScheduleRow,
  LoanSummary,
  EarlyRepayment,
  Expense,
  Account,
  AppConfig,
  ProjectedEvent,
  StatementEntry,
  MonteCarloPoint,
  CriticalPoint,
  FinancialScore,
} from '@/types/domain';

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
export function resolvePaymentDate(year: number, month0: number, diaPago: string): string | null {
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
      ((meses * Math.pow(1 + r, -(meses + 1))) / r - (1 - Math.pow(1 + r, -meses)) / (r * r));
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
  const cur = new Date(fechaInicio + 'T00:00:00');
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
        mr =
          r === 0
            ? Math.ceil(cap / cuota)
            : Math.ceil(-Math.log(1 - (cap * r) / cuota) / Math.log(1 + r));
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
export function calculateIRPF(baseImponible: number, tramos: [number, number][]): number {
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

// ── Account balance helpers ───────────────────────────────────────────────────

/** Returns the most recent recorded balance, or saldoInicial if no records. */
export function getCurrentBalance(acc: Account): number {
  const hist = [...acc.historicoSaldos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return hist.length > 0 ? hist[0].saldo : acc.saldoInicial;
}

/** Returns the most recent balance on or before `fecha`, or saldoInicial. */
export function getBalanceAtDate(acc: Account, fecha: string): number {
  const hist = [...acc.historicoSaldos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const entry = hist.find((h) => h.fecha <= fecha);
  return entry ? entry.saldo : acc.saldoInicial;
}

// ── Pension fund helpers ──────────────────────────────────────────────────────

/** Tax owed when withdrawing from a pension fund (applied to the benefit portion). */
export function calculatePensionTax(acc: Account, withdrawalAmount: number): number {
  if (!acc.esFondoPension || !acc.impuestoRetirada) return 0;
  const balance = getCurrentBalance(acc);
  if (balance <= 0) return 0;
  const costBase = acc.aportaciones.reduce((s, a) => s + a.cantidad, 0);
  const benefit = Math.max(0, balance - costBase);
  if (benefit <= 0) return 0;
  const benefitRatio = benefit / balance;
  return +((withdrawalAmount * benefitRatio * acc.impuestoRetirada) / 100).toFixed(2);
}

// ── Expense projection ────────────────────────────────────────────────────────

/** Projects all non-transfer expense/income events into the given date range. */
export function projectExpenses(
  expenses: Expense[],
  dateStart: string,
  dateEnd: string,
  filtroAccounts: string[] | null = null
): ProjectedEvent[] {
  const events: ProjectedEvent[] = [];
  const dS = new Date(dateStart + 'T00:00:00');
  const dE = new Date(dateEnd + 'T00:00:00');

  for (const exp of expenses) {
    if (!exp.activo || exp.tipo === 'transferencia') continue;
    if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(exp.cuenta))
      continue;

    const dI = new Date((exp.fechaInicio || dateStart) + 'T00:00:00');
    const dF = exp.fechaFin ? new Date(exp.fechaFin + 'T00:00:00') : dE;

    const push = (fecha: string) =>
      events.push({
        fecha,
        concepto: exp.concepto,
        cuantia: exp.cuantia,
        tipo: exp.tipo,
        tags: exp.tags ?? [],
        cuenta: exp.cuenta,
        sourceId: exp._id,
        sourceType: 'expense',
      });

    if (exp.tipoFrecuencia === 'extraordinario') {
      if (dI >= dS && dI <= dE && dI <= dF) push(exp.fechaInicio);
    } else if (exp.tipoFrecuencia === 'mensual') {
      const freq = Math.max(1, exp.frecuencia || 1);
      let year = dI.getFullYear();
      let month = dI.getMonth();
      const maxIter = Math.ceil(240 / freq) + 2;
      for (let iter = 0; iter < maxIter; iter++) {
        const fechaEfectiva =
          resolvePaymentDate(year, month, exp.diaPago || '') ??
          (() => {
            const day = dI.getDate();
            const last = new Date(year, month + 1, 0).getDate();
            return new Date(year, month, Math.min(day, last)).toISOString().slice(0, 10);
          })();
        const dEfect = new Date(fechaEfectiva + 'T00:00:00');
        if (dEfect > dE || dEfect > dF) break;
        if (dEfect >= dS && dEfect >= dI) push(fechaEfectiva);
        month += freq;
        if (month >= 12) {
          year += Math.floor(month / 12);
          month = month % 12;
        }
      }
    } else if (exp.tipoFrecuencia === 'diaria') {
      const stepMs = Math.max(1, exp.frecuencia) * 86400000;
      let d = new Date(Math.max(dI.getTime(), dS.getTime()));
      if (dI < dS) {
        const steps = Math.ceil((dS.getTime() - dI.getTime()) / stepMs);
        d = new Date(dI.getTime() + steps * stepMs);
      }
      while (d <= dE && d <= dF) {
        push(d.toISOString().slice(0, 10));
        d = new Date(d.getTime() + stepMs);
      }
    }
  }

  return events;
}

// ── Loan payment projection ───────────────────────────────────────────────────

/** Projects all scheduled loan payments (installments + early repayments) into the date range. */
export function projectLoanPayments(
  loans: Loan[],
  dateStart: string,
  dateEnd: string,
  filtroAccounts: string[] | null = null
): ProjectedEvent[] {
  const events: ProjectedEvent[] = [];

  for (const loan of loans) {
    if (!loan.activo) continue;
    if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(loan.cuenta))
      continue;

    const schedule = calculateLoanSchedule(loan);
    for (const row of schedule) {
      if (row.fecha < dateStart || row.fecha > dateEnd) continue;
      if (!row.esAmortizacion) {
        events.push({
          fecha: row.fecha,
          concepto: `Cuota ${loan.nombre}`,
          cuantia: -row.cuota,
          tipo: 'gasto',
          tags: ['prestamo'],
          cuenta: loan.cuenta,
          sourceId: loan._id,
          sourceType: 'loan',
          simulacion: loan.simulacion,
        });
      } else {
        events.push({
          fecha: row.fecha,
          concepto: `Amort. ${loan.nombre}`,
          cuantia: -(row.amortizacion + row.comisionAmort),
          tipo: 'gasto',
          tags: ['amortizacion'],
          cuenta: loan.cuenta,
          sourceId: loan._id,
          sourceType: 'loan-amort',
          simulacion: row.simulacion,
        });
      }
    }
  }

  return events;
}

// ── Transfer projection ───────────────────────────────────────────────────────

/** Projects transfer events, generating paired debit/credit entries per account. */
export function projectTransfers(
  expenses: Expense[],
  dateStart: string,
  dateEnd: string,
  accounts: Account[] = [],
  filtroAccounts: string[] | null = null
): ProjectedEvent[] {
  const events: ProjectedEvent[] = [];
  const dS = new Date(dateStart + 'T00:00:00');
  const dE = new Date(dateEnd + 'T00:00:00');
  const accountName = (id: string) => accounts.find((a) => a._id === id)?.nombre ?? id;

  for (const exp of expenses) {
    if (!exp.activo || exp.tipo !== 'transferencia') continue;
    if (filtroAccounts && filtroAccounts.length > 0) {
      const dest = exp.cuentaDestino ?? '';
      if (!filtroAccounts.includes(exp.cuenta) && !filtroAccounts.includes(dest)) continue;
    }

    const dI = new Date((exp.fechaInicio || dateStart) + 'T00:00:00');
    const dF = exp.fechaFin ? new Date(exp.fechaFin + 'T00:00:00') : dE;

    const pushPair = (fecha: string) => {
      const addOrigen =
        !filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(exp.cuenta);
      const addDestino =
        !filtroAccounts ||
        filtroAccounts.length === 0 ||
        filtroAccounts.includes(exp.cuentaDestino ?? '');

      if (addOrigen) {
        events.push({
          fecha,
          concepto: `Transf. → ${accountName(exp.cuentaDestino ?? '')}: ${exp.concepto}`,
          cuantia: exp.cuantia,
          tipo: 'gasto',
          tags: ['transferencia', ...(exp.tags ?? [])],
          cuenta: exp.cuenta,
          sourceId: exp._id,
          sourceType: 'transfer-out',
        });
        const cuentaOrigen = accounts.find((a) => a._id === exp.cuenta);
        if (cuentaOrigen?.esFondoPension) {
          const tax = calculatePensionTax(cuentaOrigen, exp.cuantia);
          if (tax > 0) {
            events.push({
              fecha,
              concepto: `Impuesto retirada ${cuentaOrigen.nombre}`,
              cuantia: tax,
              tipo: 'gasto',
              tags: ['impuesto', 'pension'],
              cuenta: exp.cuenta,
              sourceId: exp._id,
              sourceType: 'pension-tax',
            });
          }
        }
      }

      if (addDestino) {
        events.push({
          fecha,
          concepto: `Transf. ← ${accountName(exp.cuenta)}: ${exp.concepto}`,
          cuantia: exp.cuantia,
          tipo: 'ingreso',
          tags: ['transferencia', ...(exp.tags ?? [])],
          cuenta: exp.cuentaDestino ?? '',
          sourceId: exp._id,
          sourceType: 'transfer-in',
        });
      }
    };

    if (exp.tipoFrecuencia === 'extraordinario') {
      if (dI >= dS && dI <= dE && dI <= dF) pushPair(exp.fechaInicio);
    } else if (exp.tipoFrecuencia === 'mensual') {
      const freq = Math.max(1, exp.frecuencia || 1);
      let year = dI.getFullYear();
      let month = dI.getMonth();
      const maxIter = Math.ceil(240 / freq) + 2;
      for (let i = 0; i < maxIter; i++) {
        const fe =
          resolvePaymentDate(year, month, exp.diaPago || '') ??
          (() => {
            const d = dI.getDate();
            const l = new Date(year, month + 1, 0).getDate();
            return new Date(year, month, Math.min(d, l)).toISOString().slice(0, 10);
          })();
        const dE2 = new Date(fe + 'T00:00:00');
        if (dE2 > dE || dE2 > dF) break;
        if (dE2 >= dS && dE2 >= dI) pushPair(fe);
        month += freq;
        if (month >= 12) {
          year += Math.floor(month / 12);
          month = month % 12;
        }
      }
    } else if (exp.tipoFrecuencia === 'diaria') {
      const stepMs = Math.max(1, exp.frecuencia) * 86400000;
      let d = new Date(Math.max(dI.getTime(), dS.getTime()));
      if (dI < dS) {
        const steps = Math.ceil((dS.getTime() - dI.getTime()) / stepMs);
        d = new Date(dI.getTime() + steps * stepMs);
      }
      while (d <= dE && d <= dF) {
        pushPair(d.toISOString().slice(0, 10));
        d = new Date(d.getTime() + stepMs);
      }
    }
  }

  return events;
}

// ── Account interest projection ───────────────────────────────────────────────

/**
 * Projects interest income for remunerated accounts. Uses dynamic balance
 * computed from the starting historical balance plus events in `baseEvents`.
 */
export function projectAccountInterest(
  accounts: Account[],
  dateStart: string,
  dateEnd: string,
  filtroAccounts: string[] | null = null,
  baseEvents: ProjectedEvent[] = []
): ProjectedEvent[] {
  const events: ProjectedEvent[] = [];

  for (const acc of accounts) {
    if (!acc.activo || !acc.interes || acc.interes <= 0) continue;
    if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(acc._id)) continue;

    const dS = new Date(dateStart + 'T00:00:00');
    const dE = new Date(dateEnd + 'T00:00:00');
    const periodMs =
      (
        { diario: 86400000, semanal: 7 * 86400000, mensual: 30.44 * 86400000 } as Record<
          string,
          number
        >
      )[acc.periodoCobro ?? 'mensual'] ?? 30.44 * 86400000;
    const pa = periodMs / (365.25 * 86400000);

    let saldoCuenta = getBalanceAtDate(acc, dateStart);

    const movsCuenta = baseEvents
      .filter((e) => e.cuenta === acc._id)
      .map((e) => ({
        fecha: e.fecha,
        delta: e.tipo === 'ingreso' ? Math.abs(e.cuantia) : -Math.abs(e.cuantia),
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    let movIdx = 0;
    let d = new Date(dS);

    while (d <= dE) {
      const periodoFin = new Date(Math.min(d.getTime() + periodMs, dE.getTime() + 1));
      const periodoFinStr = periodoFin.toISOString().slice(0, 10);

      let deltaTotal = 0;
      while (movIdx < movsCuenta.length && movsCuenta[movIdx].fecha < periodoFinStr) {
        deltaTotal += movsCuenta[movIdx].delta;
        movIdx++;
      }

      const saldoInicio = saldoCuenta;
      const saldoFin = saldoCuenta + deltaTotal;
      const saldoMedio = Math.max(0, (saldoInicio + saldoFin) / 2);
      saldoCuenta = saldoFin;

      const ip = saldoMedio * (Math.pow(1 + acc.interes / 100, pa) - 1);
      if (ip > 0.001) {
        events.push({
          fecha: d.toISOString().slice(0, 10),
          concepto: `Interés ${acc.nombre}`,
          cuantia: ip,
          tipo: 'ingreso',
          tags: ['interes', 'cuenta'],
          cuenta: acc._id,
          sourceId: acc._id,
          sourceType: 'account-interest',
        });
      }

      d = new Date(d.getTime() + periodMs);
    }
  }

  return events;
}

// ── Full statement (extracto) ─────────────────────────────────────────────────

/**
 * Generates the full sorted cash-flow statement with running balance.
 * Uses the most recent historical balance on or before dashboardStart as the base.
 */
export function generateStatement(
  loans: Loan[],
  expenses: Expense[],
  accounts: Account[],
  config: AppConfig,
  filtroAccounts: string[] | null = null
): StatementEntry[] {
  const gastos = expenses.filter((e) => e.tipo !== 'transferencia');
  const transferencias = expenses.filter((e) => e.tipo === 'transferencia');

  let events: ProjectedEvent[] = [];
  events = events.concat(
    projectExpenses(gastos, config.dashboardStart, config.dashboardEnd, filtroAccounts)
  );
  events = events.concat(
    projectLoanPayments(loans, config.dashboardStart, config.dashboardEnd, filtroAccounts)
  );
  events = events.concat(
    projectTransfers(
      transferencias,
      config.dashboardStart,
      config.dashboardEnd,
      accounts,
      filtroAccounts
    )
  );
  const intereses = projectAccountInterest(
    accounts,
    config.dashboardStart,
    config.dashboardEnd,
    filtroAccounts,
    events
  );
  events = events.concat(intereses);
  events.sort((a, b) => a.fecha.localeCompare(b.fecha));

  const cuentasActivas = accounts.filter(
    (a) =>
      a.activo && (!filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(a._id))
  );
  let saldo = cuentasActivas.reduce((s, a) => s + getBalanceAtDate(a, config.dashboardStart), 0);

  return events.map((ev) => {
    const delta = ev.tipo === 'ingreso' ? Math.abs(ev.cuantia) : -Math.abs(ev.cuantia);
    saldo += delta;
    return { ...ev, delta, saldoAcum: saldo };
  });
}

// ── Safety cushion ────────────────────────────────────────────────────────────

/** Returns the target safety cushion amount (fixed or N months of basic expenses). */
export function calculateSafetyCushion(expenses: Expense[], config: AppConfig): number {
  if (config.colchonTipo === 'fijo' && config.colchonFijo > 0) return config.colchonFijo;
  const today = new Date().toISOString().slice(0, 10);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthStr = nextMonth.toISOString().slice(0, 10);
  const basicExpenses = expenses.filter((e) => e.basico && e.activo && e.tipo === 'gasto');
  const events = projectExpenses(basicExpenses, today, nextMonthStr);
  const monthlyBasic = events.reduce((s, e) => s + Math.abs(e.cuantia), 0);
  return monthlyBasic * (config.colchonMeses ?? 6);
}

// ── Net worth ─────────────────────────────────────────────────────────────────

/** Net worth = total assets (current balances) minus current outstanding loan principals. */
export function calculateNetWorth(loans: Loan[], accounts: Account[]): number {
  const today = new Date().toISOString().slice(0, 10);
  const totalAssets = accounts
    .filter((a) => a.activo)
    .reduce((s, a) => s + getCurrentBalance(a), 0);
  const totalDebt = loans
    .filter((l) => l.activo && !l.simulacion)
    .reduce((s, l) => {
      const schedule = calculateLoanSchedule(l);
      // Find most recent paid installment to get current remaining principal
      const paid = schedule.filter((r) => !r.esAmortizacion && r.fecha <= today);
      if (paid.length === 0) {
        // Loan hasn't started yet — full capital is outstanding
        const earlyPaid = schedule
          .filter((r) => r.esAmortizacion && r.fecha <= today)
          .reduce((a, r) => a + r.amortizacion, 0);
        return s + Math.max(0, l.capital - earlyPaid);
      }
      return s + paid[paid.length - 1].capitalPendiente;
    }, 0);
  return totalAssets - totalDebt;
}

// ── Monthly expense average ───────────────────────────────────────────────────

/** Average monthly expense over the dashboard window (excluding early repayments). */
export function monthlyExpenseAverage(statement: StatementEntry[], config: AppConfig): number {
  const total = statement
    .filter((e) => e.tipo === 'gasto' && e.sourceType !== 'loan-amort')
    .reduce((s, e) => s + Math.abs(e.cuantia), 0);
  const dS = new Date(config.dashboardStart + 'T00:00:00');
  const dE = new Date(config.dashboardEnd + 'T00:00:00');
  const months = Math.max(1, (dE.getTime() - dS.getTime()) / (30.44 * 86400000));
  return total / months;
}

// ── Critical points ───────────────────────────────────────────────────────────

/** Returns events where the running balance drops below zero or the safety cushion. */
export function detectCriticalPoints(
  statement: StatementEntry[],
  cushion: number
): CriticalPoint[] {
  const pts: CriticalPoint[] = [];
  let belowCushion = false;

  for (let i = 0; i < statement.length; i++) {
    const ev = statement[i];
    if (ev.saldoAcum < 0 && (i === 0 || statement[i - 1].saldoAcum >= 0)) {
      pts.push({
        tipo: 'saldo_negativo',
        fecha: ev.fecha,
        saldo: ev.saldoAcum,
        mensaje: `Saldo negativo desde ${ev.fecha}`,
      });
    }
    if (cushion > 0) {
      if (ev.saldoAcum < cushion && !belowCushion) {
        belowCushion = true;
        pts.push({
          tipo: 'bajo_colchon',
          fecha: ev.fecha,
          saldo: ev.saldoAcum,
          mensaje: `Saldo por debajo del colchón desde ${ev.fecha}`,
        });
      } else if (ev.saldoAcum >= cushion && belowCushion) {
        belowCushion = false;
        pts.push({
          tipo: 'recuperacion_colchon',
          fecha: ev.fecha,
          saldo: ev.saldoAcum,
          mensaje: `Colchón recuperado el ${ev.fecha}`,
        });
      }
    }
  }

  return pts;
}

// ── Monte Carlo simulation ────────────────────────────────────────────────────

function randNormal(): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Runs N Monte Carlo iterations perturbing expense amounts by their `varianza` %.
 * Returns percentile bands per date, or null if no expenses have varianza > 0.
 */
export function runMonteCarlo(
  loans: Loan[],
  expenses: Expense[],
  accounts: Account[],
  config: AppConfig,
  iterations = 300
): MonteCarloPoint[] | null {
  if (!expenses.some((e) => e.varianza > 0)) return null;

  const base = generateStatement(loans, expenses, accounts, config);
  if (base.length === 0) return null;

  const fechas = base.map((e) => e.fecha);
  const n = fechas.length;
  const samples: number[][] = Array.from({ length: n }, () => []);

  for (let iter = 0; iter < iterations; iter++) {
    const perturbed = expenses.map((e) => {
      if (!e.varianza) return e;
      const sigma = Math.abs(e.cuantia) * (e.varianza / 100);
      const delta = randNormal() * sigma;
      return { ...e, cuantia: e.cuantia + (e.tipo === 'gasto' ? delta : -delta) };
    });
    const stmt = generateStatement(loans, perturbed, accounts, config);
    const dateMap = new Map(stmt.map((ev) => [ev.fecha, ev.saldoAcum]));
    for (let i = 0; i < n; i++) {
      const s = dateMap.get(fechas[i]);
      if (s !== undefined) samples[i].push(s);
    }
  }

  const pct = (arr: number[], p: number): number => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor((p / 100) * (sorted.length - 1))] ?? 0;
  };

  return fechas
    .map((fecha, i) => {
      const s = samples[i];
      if (s.length === 0) return null;
      return {
        x: new Date(fecha + 'T00:00:00').getTime(),
        p10: pct(s, 10),
        p25: pct(s, 25),
        p50: pct(s, 50),
        p75: pct(s, 75),
        p90: pct(s, 90),
      };
    })
    .filter((p): p is MonteCarloPoint => p !== null);
}

// ── Financial health score ────────────────────────────────────────────────────

function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
  if (x <= x0) return y0;
  if (x >= x1) return y1;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

/**
 * Computes a 0–100 financial health score from three weighted dimensions:
 *   40% savings rate, 35% debt ratio, 25% fixed expenses ratio.
 */
export function calculateFinancialScore(
  statement: StatementEntry[],
  loans: Loan[],
  expenses: Expense[],
  _accounts: Account[],
  config: AppConfig
): FinancialScore {
  const today = new Date().toISOString().slice(0, 10);

  const ingresosMes = expenses
    .filter((e) => e.activo && e.tipo === 'ingreso' && e.tipoFrecuencia === 'mensual')
    .reduce((s, e) => s + e.cuantia, 0);

  // Fixed expenses ratio
  const gastosFijosMes = expenses
    .filter((e) => e.activo && e.tipo === 'gasto' && e.tipoFrecuencia === 'mensual')
    .reduce((s, e) => s + e.cuantia, 0);
  const pctFijos = ingresosMes > 0 ? (gastosFijosMes / ingresosMes) * 100 : null;
  const scoreFijos =
    pctFijos === null
      ? 50
      : pctFijos < 30
        ? 100
        : pctFijos < 50
          ? lerp(pctFijos, 30, 50, 100, 70)
          : pctFijos < 70
            ? lerp(pctFijos, 50, 70, 70, 30)
            : lerp(pctFijos, 70, 90, 30, 0);

  // Savings rate
  const mediaGastos = monthlyExpenseAverage(statement, config);
  const ahorroMes = ingresosMes - mediaGastos;
  const pctAhorro = ingresosMes > 0 ? (ahorroMes / ingresosMes) * 100 : null;
  const scoreAhorro =
    pctAhorro === null
      ? 50
      : pctAhorro >= 25
        ? 100
        : pctAhorro >= 10
          ? lerp(pctAhorro, 10, 25, 65, 100)
          : pctAhorro >= 0
            ? lerp(pctAhorro, 0, 10, 20, 65)
            : 0;

  // Debt ratio (active, non-simulation loans not yet finished)
  const cuotasMes = loans
    .filter((l) => {
      if (!l.activo || l.simulacion) return false;
      const last = calculateLoanSchedule(l)
        .filter((r) => !r.esAmortizacion)
        .at(-1);
      return last && last.fecha >= today;
    })
    .reduce((s, l) => s + monthlyPayment(l.capital, l.tin, l.meses), 0);
  const pctDeuda = ingresosMes > 0 ? (cuotasMes / ingresosMes) * 100 : null;
  const scoreDeuda =
    cuotasMes === 0
      ? 100
      : pctDeuda === null
        ? 50
        : pctDeuda < 15
          ? 100
          : pctDeuda < 35
            ? lerp(pctDeuda, 15, 35, 95, 45)
            : pctDeuda < 50
              ? lerp(pctDeuda, 35, 50, 45, 10)
              : 0;

  const total = Math.round(scoreAhorro * 0.4 + scoreDeuda * 0.35 + scoreFijos * 0.25);
  const label =
    total >= 80 ? 'Excelente' : total >= 60 ? 'Buena' : total >= 40 ? 'Regular' : 'Atención';

  return {
    total,
    label,
    ratioGastosFijos: pctFijos ?? 0,
    tasaAhorro: pctAhorro ?? 0,
    ratioDeuda: pctDeuda ?? 0,
    gastosFijosMes,
    ahorroMes,
    cuotasMes,
    ingresosMes,
  };
}
