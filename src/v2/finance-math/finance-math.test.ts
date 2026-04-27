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
} from './finance-math';
import { loanFactory, earlyRepaymentFactory } from '@/test-utils/factories';

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
