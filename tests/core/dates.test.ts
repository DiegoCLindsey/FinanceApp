// Unit tests propios de core/dates y core/money (Fase 1, tarea 1.2).
import { describe, it, expect } from 'vitest';
import { formatLocalDate, parseLocalDate, lastDayOfMonth, clampedDate, resolverDiaEfectivo, todayISO } from '@/core/dates';
import { toCents, fromCents, roundMoney } from '@/core/money';

describe('core/dates', () => {
  it('formatLocalDate usa componentes locales (no UTC)', () => {
    // Construida en local: debe volver idéntica aunque el huso no sea UTC
    expect(formatLocalDate(new Date(2026, 0, 31))).toBe('2026-01-31');
    expect(formatLocalDate(new Date(2026, 11, 1))).toBe('2026-12-01');
  });
  it('parseLocalDate ↔ formatLocalDate es identidad', () => {
    for (const iso of ['2024-02-29', '2026-01-01', '2030-12-31']) {
      expect(formatLocalDate(parseLocalDate(iso))).toBe(iso);
    }
  });
  it('lastDayOfMonth con bisiestos', () => {
    expect(lastDayOfMonth(2024, 1)).toBe(29);
    expect(lastDayOfMonth(2026, 1)).toBe(28);
    expect(lastDayOfMonth(2026, 0)).toBe(31);
  });
  it('clampedDate ajusta al fin de mes', () => {
    expect(clampedDate(2026, 1, 31)).toBe('2026-02-28');
    expect(clampedDate(2024, 1, 31)).toBe('2024-02-29');
    expect(clampedDate(2026, 3, 15)).toBe('2026-04-15');
  });
  it('resolverDiaEfectivo: casos límite', () => {
    expect(resolverDiaEfectivo(2026, 5, '')).toBeNull();
    expect(resolverDiaEfectivo(2026, 5, 'nonsense')).toBeNull();
    // 5º viernes de un mes con solo 4 viernes → retrocede una semana (4º)
    expect(resolverDiaEfectivo(2026, 1, 'nthweekday:5:5')).toBe('2026-02-27');
  });
  it('todayISO tiene formato ISO', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('core/money', () => {
  it('toCents/fromCents con redondeo half-away-from-zero', () => {
    expect(toCents(10.005)).toBe(1001);
    expect(toCents(-10.005)).toBe(-1001);
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(fromCents(1001)).toBe(10.01);
  });
  it('roundMoney estable con negativos', () => {
    expect(roundMoney(2.675)).toBe(2.68);
    expect(roundMoney(-2.675)).toBe(-2.68);
    expect(roundMoney(100)).toBe(100);
  });
});
