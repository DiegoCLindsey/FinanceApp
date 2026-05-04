import { describe, it, expect } from 'vitest';
import {
  resolvePaymentDate,
  adjustPaymentDate,
  labelPaymentDay,
  calculateTAE,
  calculateLoanSchedule,
  loanSummary,
  calculateEarlyRepaymentSavings,
  calculateIRPF,
  getCurrentBalance,
  getBalanceAtDate,
  projectExpenses,
  projectLoanPayments,
  projectTransfers,
  generateStatement,
  calculateSafetyCushion,
  calculateNetWorth,
  monthlyExpenseAverage,
  detectCriticalPoints,
  calculateFinancialScore,
} from './finance-math';
import {
  loanFactory,
  earlyRepaymentFactory,
  expenseFactory,
  accountFactory,
  configFactory,
} from '@/test-utils/factories';

// ── resolvePaymentDate ────────────────────────────────────────────────────────
describe('resolvePaymentDate', () => {
  it('returns the clamped day for dia:N format', () => {
    expect(resolvePaymentDate(2024, 1, 'dia:15')).toBe('2024-02-15');
  });

  it('clamps day to last day of the month (Feb)', () => {
    expect(resolvePaymentDate(2024, 1, 'dia:31')).toBe('2024-02-29'); // 2024 is leap
    expect(resolvePaymentDate(2023, 1, 'dia:31')).toBe('2023-02-28'); // 2023 is not
  });

  it('returns the last day of the month for dia:ultimo', () => {
    expect(resolvePaymentDate(2024, 0, 'dia:ultimo')).toBe('2024-01-31');
    expect(resolvePaymentDate(2024, 1, 'dia:ultimo')).toBe('2024-02-29');
  });

  it('resolves the 2nd Tuesday (nthweekday:2:2) correctly', () => {
    // January 2024: 1st Tue = 2nd, 2nd Tue = 9th
    expect(resolvePaymentDate(2024, 0, 'nthweekday:2:2')).toBe('2024-01-09');
  });

  it('resolves the last Monday (nthweekday:-1:1) correctly', () => {
    // January 2024: last Monday = 29th
    expect(resolvePaymentDate(2024, 0, 'nthweekday:-1:1')).toBe('2024-01-29');
  });

  it('returns null for empty diaPago', () => {
    expect(resolvePaymentDate(2024, 0, '')).toBeNull();
  });
});

// ── adjustPaymentDate ─────────────────────────────────────────────────────────
describe('adjustPaymentDate', () => {
  it('adjusts the day within the same month', () => {
    expect(adjustPaymentDate('2024-03-01', 'dia:15')).toBe('2024-03-15');
  });

  it('returns original date when diaPago is empty', () => {
    expect(adjustPaymentDate('2024-03-15', '')).toBe('2024-03-15');
  });
});

// ── labelPaymentDay ───────────────────────────────────────────────────────────
describe('labelPaymentDay', () => {
  it('returns human label for dia:N', () => {
    expect(labelPaymentDay('dia:15')).toBe('Día 15 del mes');
  });

  it('returns human label for dia:ultimo', () => {
    expect(labelPaymentDay('dia:ultimo')).toBe('Último día del mes');
  });

  it('returns human label for nthweekday', () => {
    // weekday index 2 = Tuesday (0=Sun, 1=Mon, 2=Tue)
    expect(labelPaymentDay('nthweekday:2:2')).toBe('2º martes del mes');
  });

  it('returns empty string for empty input', () => {
    expect(labelPaymentDay('')).toBe('');
  });
});

// ── calculateTAE ──────────────────────────────────────────────────────────────
describe('calculateTAE', () => {
  it('equals TIN when there are no fees (within 0.1%)', () => {
    const tae = calculateTAE(10000, 5, 12, 0);
    expect(tae).toBeCloseTo(5, 0);
  });

  it('is greater than TIN when there is an opening fee', () => {
    const tae = calculateTAE(10000, 5, 12, 1);
    expect(tae).toBeGreaterThan(5);
  });

  it('returns 0 when TIN is 0 and there are no fees', () => {
    const tae = calculateTAE(10000, 0, 12, 0);
    expect(tae).toBeCloseTo(0, 4);
  });

  it('opening fee has a larger impact on shorter loans', () => {
    const taeShort = calculateTAE(10000, 5, 12, 1);
    const taeLong = calculateTAE(10000, 5, 120, 1);
    expect(taeShort).toBeGreaterThan(taeLong);
  });
});

// ── calculateLoanSchedule ─────────────────────────────────────────────────────
describe('calculateLoanSchedule', () => {
  it('returns exactly N regular installment rows for an N-month loan', () => {
    const loan = loanFactory({ meses: 12 });
    const schedule = calculateLoanSchedule(loan);
    const regular = schedule.filter((r) => !r.esAmortizacion);
    expect(regular).toHaveLength(12);
  });

  it('has a remaining balance of ~0 after the last installment', () => {
    const loan = loanFactory({ capital: 10000, tin: 5, meses: 12 });
    const schedule = calculateLoanSchedule(loan);
    const last = schedule.filter((r) => !r.esAmortizacion).at(-1)!;
    expect(last.capitalPendiente).toBeCloseTo(0, 0);
  });

  it('has interest decreasing and principal increasing each installment', () => {
    const loan = loanFactory({ capital: 10000, tin: 5, meses: 12 });
    const schedule = calculateLoanSchedule(loan).filter((r) => !r.esAmortizacion);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].interes).toBeLessThanOrEqual(schedule[i - 1].interes);
      expect(schedule[i].amortizacion).toBeGreaterThanOrEqual(schedule[i - 1].amortizacion);
    }
  });

  it('has constant monthly payment (within rounding) for all installments', () => {
    const loan = loanFactory({ capital: 10000, tin: 5, meses: 12 });
    const schedule = calculateLoanSchedule(loan).filter((r) => !r.esAmortizacion);
    const cuotas = schedule.map((r) => r.cuota);
    const first = cuotas[0];
    cuotas.forEach((c) => expect(c).toBeCloseTo(first, 2));
  });

  it('returns empty array for a loan with 0 capital', () => {
    const loan = loanFactory({ capital: 0, meses: 12 });
    expect(calculateLoanSchedule(loan)).toHaveLength(0);
  });

  it('handles TIN = 0 correctly (no interest, equal principal payments)', () => {
    const loan = loanFactory({ capital: 1200, tin: 0, meses: 12 });
    const schedule = calculateLoanSchedule(loan).filter((r) => !r.esAmortizacion);
    expect(schedule).toHaveLength(12);
    schedule.forEach((r) => {
      expect(r.interes).toBeCloseTo(0, 5);
      expect(r.amortizacion).toBeCloseTo(100, 2);
    });
  });

  it('inserts AMORT rows and shortens the schedule (tipo: plazo)', () => {
    const loan = loanFactory({
      capital: 10000,
      tin: 5,
      meses: 24,
      amortizaciones: [
        earlyRepaymentFactory({ fecha: '2024-07-01', cantidad: 3000, tipo: 'plazo' }),
      ],
    });
    const without = calculateLoanSchedule({ ...loan, amortizaciones: [] }).filter(
      (r) => !r.esAmortizacion
    );
    const with_ = calculateLoanSchedule(loan).filter((r) => !r.esAmortizacion);
    expect(with_.length).toBeLessThan(without.length);
  });

  it('respects comisionAmort on early repayment rows', () => {
    const loan = loanFactory({
      capital: 10000,
      tin: 5,
      meses: 24,
      comisionAmort: 1,
      amortizaciones: [earlyRepaymentFactory({ fecha: '2024-07-01', cantidad: 2000 })],
    });
    const amortRow = calculateLoanSchedule(loan).find((r) => r.esAmortizacion)!;
    expect(amortRow.comisionAmort).toBeCloseTo(20, 2); // 1% of 2000
  });
});

// ── loanSummary ───────────────────────────────────────────────────────────────
describe('loanSummary', () => {
  it('totalPagado equals capital + totalIntereses (no fees, no early repayments)', () => {
    const loan = loanFactory({ capital: 10000, tin: 5, meses: 12 });
    const s = loanSummary(loan);
    expect(s.totalPagado).toBeCloseTo(s.totalIntereses + 10000, 0);
  });

  it('capitalPendiente is ~0 after loan term', () => {
    const loan = loanFactory({ capital: 10000, tin: 5, meses: 12 });
    expect(loanSummary(loan).capitalPendiente).toBeCloseTo(0, 0);
  });

  it('TAE is greater than TIN when there is an opening fee', () => {
    const loan = loanFactory({ capital: 10000, tin: 5, meses: 12, comisionApertura: 1 });
    const s = loanSummary(loan);
    expect(s.tae).toBeGreaterThan(5);
  });
});

// ── calculateEarlyRepaymentSavings ────────────────────────────────────────────
describe('calculateEarlyRepaymentSavings', () => {
  it('saves interest when an early repayment is made', () => {
    const loan = loanFactory({
      capital: 10000,
      tin: 5,
      meses: 24,
      amortizaciones: [earlyRepaymentFactory({ fecha: '2024-06-01', cantidad: 3000 })],
    });
    const result = calculateEarlyRepaymentSavings(loan);
    expect(result.interestSaved).toBeGreaterThan(0);
  });

  it('netSavings = interestSaved - feesPaid', () => {
    const loan = loanFactory({
      capital: 10000,
      tin: 5,
      meses: 24,
      comisionAmort: 1,
      amortizaciones: [earlyRepaymentFactory({ fecha: '2024-06-01', cantidad: 3000 })],
    });
    const r = calculateEarlyRepaymentSavings(loan);
    expect(r.netSavings).toBeCloseTo(r.interestSaved - r.feesPaid, 2);
  });

  it('saves months with tipo:plazo repayment', () => {
    const loan = loanFactory({
      capital: 10000,
      tin: 5,
      meses: 24,
      amortizaciones: [
        earlyRepaymentFactory({ fecha: '2024-06-01', cantidad: 3000, tipo: 'plazo' }),
      ],
    });
    expect(calculateEarlyRepaymentSavings(loan).monthsSaved).toBeGreaterThan(0);
  });
});

// ── calculateIRPF ─────────────────────────────────────────────────────────────
describe('calculateIRPF', () => {
  const tramos: [number, number][] = [
    [0, 19],
    [12450, 24],
    [20200, 30],
    [35200, 37],
    [60000, 45],
  ];

  it('applies only the first bracket when income is below the second threshold', () => {
    // 10000 × 19% = 1900
    expect(calculateIRPF(10000, tramos)).toBeCloseTo(1900, 0);
  });

  it('applies brackets progressively for income crossing multiple thresholds', () => {
    // 0–12450 at 19%: 2365.5
    // 12450–20000 at 24%: 1812
    // Total: 4177.5
    expect(calculateIRPF(20000, tramos)).toBeCloseTo(4177.5, 0);
  });

  it('returns 0 for income of 0', () => {
    expect(calculateIRPF(0, tramos)).toBe(0);
  });

  it('returns 0 for empty brackets', () => {
    expect(calculateIRPF(50000, [])).toBe(0);
  });

  it('is consistent: higher income always results in higher tax', () => {
    expect(calculateIRPF(30000, tramos)).toBeGreaterThan(calculateIRPF(20000, tramos));
  });
});

// ── getCurrentBalance / getBalanceAtDate ──────────────────────────────────────
describe('getCurrentBalance', () => {
  it('returns saldoInicial when no history', () => {
    const acc = accountFactory({ saldoInicial: 1000, historicoSaldos: [] });
    expect(getCurrentBalance(acc)).toBe(1000);
  });

  it('returns the most recent historico entry', () => {
    const acc = accountFactory({
      saldoInicial: 1000,
      historicoSaldos: [
        { _id: 'h1', fecha: '2024-01-01', saldo: 1500 },
        { _id: 'h2', fecha: '2024-06-01', saldo: 2000 },
        { _id: 'h3', fecha: '2024-03-01', saldo: 1800 },
      ],
    });
    expect(getCurrentBalance(acc)).toBe(2000);
  });
});

describe('getBalanceAtDate', () => {
  it('returns saldoInicial when no history precedes fecha', () => {
    const acc = accountFactory({
      saldoInicial: 500,
      historicoSaldos: [{ _id: 'h1', fecha: '2024-06-01', saldo: 800 }],
    });
    expect(getBalanceAtDate(acc, '2024-01-01')).toBe(500);
  });

  it('returns the most recent historico entry on or before fecha', () => {
    const acc = accountFactory({
      saldoInicial: 500,
      historicoSaldos: [
        { _id: 'h1', fecha: '2024-01-01', saldo: 800 },
        { _id: 'h2', fecha: '2024-06-01', saldo: 1200 },
      ],
    });
    expect(getBalanceAtDate(acc, '2024-03-01')).toBe(800);
    expect(getBalanceAtDate(acc, '2024-06-01')).toBe(1200);
    expect(getBalanceAtDate(acc, '2024-12-31')).toBe(1200);
  });
});

// ── projectExpenses ───────────────────────────────────────────────────────────
describe('projectExpenses', () => {
  it('projects a monthly expense once per month in a 3-month window', () => {
    const exp = expenseFactory({
      fechaInicio: '2024-01-01',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      diaPago: 'dia:1',
    });
    const events = projectExpenses([exp], '2024-01-01', '2024-03-31');
    expect(events).toHaveLength(3);
    expect(events[0].fecha).toBe('2024-01-01');
    expect(events[1].fecha).toBe('2024-02-01');
    expect(events[2].fecha).toBe('2024-03-01');
  });

  it('projects a one-off extraordinary expense exactly once', () => {
    const exp = expenseFactory({
      fechaInicio: '2024-02-15',
      tipoFrecuencia: 'extraordinario',
    });
    const events = projectExpenses([exp], '2024-01-01', '2024-12-31');
    expect(events).toHaveLength(1);
    expect(events[0].fecha).toBe('2024-02-15');
  });

  it('skips inactive expenses', () => {
    const exp = expenseFactory({ activo: false });
    expect(projectExpenses([exp], '2024-01-01', '2024-12-31')).toHaveLength(0);
  });

  it('skips transfer-type expenses', () => {
    const exp = expenseFactory({ tipo: 'transferencia' });
    expect(projectExpenses([exp], '2024-01-01', '2024-12-31')).toHaveLength(0);
  });

  it('respects filtroAccounts — excludes expenses on other accounts', () => {
    const exp = expenseFactory({ cuenta: 'account-2' });
    const events = projectExpenses([exp], '2024-01-01', '2024-12-31', ['account-1']);
    expect(events).toHaveLength(0);
  });

  it('stops projecting after fechaFin', () => {
    const exp = expenseFactory({
      fechaInicio: '2024-01-01',
      fechaFin: '2024-02-28',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      diaPago: 'dia:1',
    });
    const events = projectExpenses([exp], '2024-01-01', '2024-12-31');
    expect(events).toHaveLength(2); // Jan + Feb only
  });
});

// ── projectLoanPayments ───────────────────────────────────────────────────────
describe('projectLoanPayments', () => {
  it('projects N installment events for an N-month loan inside the window', () => {
    const loan = loanFactory({ capital: 12000, tin: 5, meses: 12, fechaInicio: '2024-01-01' });
    const events = projectLoanPayments([loan], '2024-01-01', '2024-12-31');
    const installments = events.filter((e) => e.sourceType === 'loan');
    expect(installments).toHaveLength(12);
  });

  it('all loan payment events have negative cuantia', () => {
    const loan = loanFactory({ capital: 12000, tin: 5, meses: 6, fechaInicio: '2024-01-01' });
    const events = projectLoanPayments([loan], '2024-01-01', '2024-12-31');
    events
      .filter((e) => e.sourceType === 'loan')
      .forEach((e) => {
        expect(e.cuantia).toBeLessThan(0);
      });
  });

  it('skips inactive loans', () => {
    const loan = loanFactory({ activo: false });
    expect(projectLoanPayments([loan], '2024-01-01', '2024-12-31')).toHaveLength(0);
  });
});

// ── projectTransfers ──────────────────────────────────────────────────────────
describe('projectTransfers', () => {
  it('generates a debit (transfer-out) and credit (transfer-in) pair', () => {
    const exp = expenseFactory({
      tipo: 'transferencia',
      tipoFrecuencia: 'extraordinario',
      fechaInicio: '2024-03-15',
      cuenta: 'acc-a',
      cuentaDestino: 'acc-b',
      cuantia: 500,
    });
    const events = projectTransfers([exp], '2024-01-01', '2024-12-31');
    expect(events).toHaveLength(2);
    const out = events.find((e) => e.sourceType === 'transfer-out')!;
    const inn = events.find((e) => e.sourceType === 'transfer-in')!;
    expect(out.tipo).toBe('gasto');
    expect(inn.tipo).toBe('ingreso');
    expect(out.cuantia).toBe(500);
    expect(inn.cuantia).toBe(500);
  });

  it('skips non-transfer expenses', () => {
    const exp = expenseFactory({ tipo: 'gasto' });
    expect(projectTransfers([exp], '2024-01-01', '2024-12-31')).toHaveLength(0);
  });
});

// ── generateStatement ─────────────────────────────────────────────────────────
describe('generateStatement', () => {
  it('produces a sorted list of entries with a running saldoAcum', () => {
    const acc = accountFactory({ saldoInicial: 5000, historicoSaldos: [] });
    const exp = expenseFactory({
      cuantia: 100,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      diaPago: 'dia:1',
      fechaInicio: '2024-01-01',
      cuenta: acc._id,
    });
    const cfg = configFactory({ dashboardStart: '2024-01-01', dashboardEnd: '2024-03-31' });
    const stmt = generateStatement([], [exp], [acc], cfg);

    expect(stmt.length).toBeGreaterThan(0);
    // Entries are sorted by date
    for (let i = 1; i < stmt.length; i++) {
      expect(stmt[i].fecha >= stmt[i - 1].fecha).toBe(true);
    }
    // saldoAcum decreases by 100 each month (expense)
    expect(stmt[0].saldoAcum).toBeCloseTo(4900, 0);
    expect(stmt[1].saldoAcum).toBeCloseTo(4800, 0);
  });

  it('includes both expense and loan payment events', () => {
    const acc = accountFactory({ saldoInicial: 20000, historicoSaldos: [] });
    const loan = loanFactory({
      capital: 12000,
      tin: 5,
      meses: 3,
      fechaInicio: '2024-01-01',
      cuenta: acc._id,
    });
    const exp = expenseFactory({
      cuantia: 50,
      cuenta: acc._id,
      fechaInicio: '2024-01-15',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      diaPago: 'dia:15',
    });
    const cfg = configFactory({ dashboardStart: '2024-01-01', dashboardEnd: '2024-03-31' });
    const stmt = generateStatement([loan], [exp], [acc], cfg);
    const types = new Set(stmt.map((e) => e.sourceType));
    expect(types.has('loan')).toBe(true);
    expect(types.has('expense')).toBe(true);
  });

  it('delta is positive for income, negative for expense', () => {
    const acc = accountFactory({ saldoInicial: 10000 });
    const income = expenseFactory({
      tipo: 'ingreso',
      cuantia: 200,
      cuenta: acc._id,
      fechaInicio: '2024-01-01',
      tipoFrecuencia: 'extraordinario',
    });
    const expense = expenseFactory({
      tipo: 'gasto',
      cuantia: 100,
      cuenta: acc._id,
      fechaInicio: '2024-01-02',
      tipoFrecuencia: 'extraordinario',
    });
    const cfg = configFactory({ dashboardStart: '2024-01-01', dashboardEnd: '2024-01-31' });
    const stmt = generateStatement([], [income, expense], [acc], cfg);
    expect(stmt.find((e) => e.tipo === 'gasto')!.delta).toBeLessThan(0);
    expect(stmt.find((e) => e.tipo === 'ingreso')!.delta).toBeGreaterThan(0);
  });
});

// ── calculateSafetyCushion ────────────────────────────────────────────────────
describe('calculateSafetyCushion', () => {
  it('returns colchonFijo when colchonTipo is fijo', () => {
    const cfg = configFactory({ colchonTipo: 'fijo', colchonFijo: 3000 });
    expect(calculateSafetyCushion([], cfg)).toBe(3000);
  });

  it('returns 0 when no basic expenses exist', () => {
    const exp = expenseFactory({ basico: false });
    const cfg = configFactory({ colchonTipo: 'meses', colchonMeses: 6 });
    expect(calculateSafetyCushion([exp], cfg)).toBe(0);
  });

  it('returns N months of basic expenses', () => {
    const today = new Date().toISOString().slice(0, 10);
    const exp = expenseFactory({
      basico: true,
      activo: true,
      tipo: 'gasto',
      cuantia: 100,
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      fechaInicio: today,
    });
    const cfg = configFactory({ colchonTipo: 'meses', colchonMeses: 6 });
    const cushion = calculateSafetyCushion([exp], cfg);
    expect(cushion).toBeGreaterThan(0);
  });
});

// ── calculateNetWorth ─────────────────────────────────────────────────────────
describe('calculateNetWorth', () => {
  it('equals total assets when there are no loans', () => {
    const acc = accountFactory({ saldoInicial: 5000 });
    expect(calculateNetWorth([], [acc])).toBe(5000);
  });

  it('subtracts outstanding loan principal from total assets', () => {
    const acc = accountFactory({ saldoInicial: 20000 });
    // Long-term future loan so principal is still outstanding
    const futureStart = new Date();
    futureStart.setMonth(futureStart.getMonth() + 1);
    const loan = loanFactory({
      capital: 10000,
      tin: 3,
      meses: 360,
      fechaInicio: futureStart.toISOString().slice(0, 10),
    });
    const worth = calculateNetWorth([loan], [acc]);
    expect(worth).toBeLessThan(20000);
    expect(worth).toBeGreaterThan(9000); // sanity check: assets - full debt
  });

  it('ignores simulation loans', () => {
    const acc = accountFactory({ saldoInicial: 5000 });
    const loan = loanFactory({ capital: 3000, simulacion: true });
    expect(calculateNetWorth([loan], [acc])).toBe(5000);
  });
});

// ── monthlyExpenseAverage ─────────────────────────────────────────────────────
describe('monthlyExpenseAverage', () => {
  it('returns average monthly spend over the dashboard window', () => {
    const acc = accountFactory({ saldoInicial: 50000 });
    const exp = expenseFactory({
      cuantia: 300,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      diaPago: 'dia:1',
      fechaInicio: '2024-01-01',
      cuenta: acc._id,
    });
    const cfg = configFactory({ dashboardStart: '2024-01-01', dashboardEnd: '2024-12-31' });
    const stmt = generateStatement([], [exp], [acc], cfg);
    const avg = monthlyExpenseAverage(stmt, cfg);
    expect(avg).toBeCloseTo(300, 0);
  });
});

// ── detectCriticalPoints ──────────────────────────────────────────────────────
describe('detectCriticalPoints', () => {
  it('returns empty array when balance never drops below cushion', () => {
    const acc = accountFactory({ saldoInicial: 10000 });
    const cfg = configFactory({ dashboardStart: '2024-01-01', dashboardEnd: '2024-03-31' });
    const stmt = generateStatement([], [], [acc], cfg);
    expect(detectCriticalPoints(stmt, 1000)).toHaveLength(0);
  });

  it('flags saldo_negativo when balance crosses zero', () => {
    const acc = accountFactory({ saldoInicial: 100 });
    const exp = expenseFactory({
      cuantia: 200,
      tipo: 'gasto',
      tipoFrecuencia: 'extraordinario',
      fechaInicio: '2024-01-15',
      cuenta: acc._id,
    });
    const cfg = configFactory({ dashboardStart: '2024-01-01', dashboardEnd: '2024-01-31' });
    const stmt = generateStatement([], [exp], [acc], cfg);
    const pts = detectCriticalPoints(stmt, 0);
    expect(pts.some((p) => p.tipo === 'saldo_negativo')).toBe(true);
  });

  it('flags bajo_colchon when balance drops below cushion threshold', () => {
    const acc = accountFactory({ saldoInicial: 500 });
    const exp = expenseFactory({
      cuantia: 200,
      tipo: 'gasto',
      tipoFrecuencia: 'extraordinario',
      fechaInicio: '2024-01-15',
      cuenta: acc._id,
    });
    const cfg = configFactory({ dashboardStart: '2024-01-01', dashboardEnd: '2024-01-31' });
    const stmt = generateStatement([], [exp], [acc], cfg);
    const pts = detectCriticalPoints(stmt, 400);
    expect(pts.some((p) => p.tipo === 'bajo_colchon')).toBe(true);
  });
});

// ── calculateFinancialScore ───────────────────────────────────────────────────
describe('calculateFinancialScore', () => {
  it('returns total in 0–100 range', () => {
    const acc = accountFactory({ saldoInicial: 20000 });
    const income = expenseFactory({
      tipo: 'ingreso',
      cuantia: 3000,
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
    });
    const expense = expenseFactory({
      tipo: 'gasto',
      cuantia: 1000,
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
    });
    const cfg = configFactory();
    const stmt = generateStatement([], [income, expense], [acc], cfg);
    const score = calculateFinancialScore(stmt, [], [income, expense], [acc], cfg);
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
  });

  it('returns Excelente label when savings rate is high and no debt', () => {
    const acc = accountFactory({ saldoInicial: 50000 });
    const income = expenseFactory({
      tipo: 'ingreso',
      cuantia: 5000,
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
    });
    const expense = expenseFactory({
      tipo: 'gasto',
      cuantia: 500,
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
    });
    const cfg = configFactory();
    const stmt = generateStatement([], [income, expense], [acc], cfg);
    const score = calculateFinancialScore(stmt, [], [income, expense], [acc], cfg);
    expect(score.label).toBe('Excelente');
    expect(score.total).toBeGreaterThanOrEqual(80);
  });

  it('exposes ingresosMes, gastosFijosMes, ahorroMes, cuotasMes', () => {
    const income = expenseFactory({
      tipo: 'ingreso',
      cuantia: 3000,
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
    });
    const expense = expenseFactory({
      tipo: 'gasto',
      cuantia: 800,
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
    });
    const acc = accountFactory({ saldoInicial: 10000 });
    const cfg = configFactory();
    const stmt = generateStatement([], [income, expense], [acc], cfg);
    const score = calculateFinancialScore(stmt, [], [income, expense], [acc], cfg);
    expect(score.ingresosMes).toBe(3000);
    expect(score.gastosFijosMes).toBe(800);
    expect(score.cuotasMes).toBe(0);
  });
});
