// Unit tests propios de core/dates y core/money (Fase 1, tarea 1.2).
import { describe, it, expect } from 'vitest';
import { clampedDate, diasEntre, formatLocalDate, lastDayOfMonth, parseLocalDate, resolverDiaEfectivo, todayISO } from '@/core/dates';
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

describe('fechas civiles en husos con desfase positivo', () => {
  // Estos tests solo tienen sentido fuera de UTC. La configuración de vitest
  // fija TZ=Europe/Madrid justamente para que esta familia de errores no pueda
  // volver a esconderse: en UTC todos pasan aunque el código esté mal.
  it('el entorno de tests NO corre en UTC', () => {
    // Si esto falla, alguien ha quitado el TZ de vitest.config.ts y la suite ha
    // dejado de proteger contra los desfases de fecha.
    expect(new Date(2026, 6, 15).getTimezoneOffset()).toBeLessThan(0);
  });

  it('el día 1 del mes no se cae al mes anterior', () => {
    // El legacy resolvía esto con toISOString() y devolvía 2026-10-31
    expect(resolverDiaEfectivo(2026, 10, 'dia:1')).toBe('2026-11-01');
  });

  it('el día 1 de enero no se cae al año anterior', () => {
    // Este era el peor: cambiaba el ejercicio fiscal del cobro
    expect(resolverDiaEfectivo(2026, 0, 'dia:1')).toBe('2026-01-01');
  });

  it('el último día del mes es el último, no el penúltimo', () => {
    expect(resolverDiaEfectivo(2026, 9, 'dia:ultimo')).toBe('2026-10-31');
    expect(resolverDiaEfectivo(2026, 10, 'dia:ultimo')).toBe('2026-11-30');
    expect(resolverDiaEfectivo(2027, 1, 'dia:ultimo')).toBe('2027-02-28');
  });

  it('formatLocalDate no adelanta la fecha en verano ni en invierno', () => {
    expect(formatLocalDate(new Date(2026, 6, 15))).toBe('2026-07-15'); // CEST, +2
    expect(formatLocalDate(new Date(2026, 0, 15))).toBe('2026-01-15'); // CET, +1
  });
});

describe('días de calendario', () => {
  it('cuenta días completos, no fracciones de milisegundos', () => {
    expect(diasEntre(new Date(2026, 0, 1), new Date(2026, 0, 31))).toBe(30);
    expect(diasEntre(new Date(2026, 0, 1), new Date(2027, 0, 1))).toBe(365);
    expect(diasEntre(new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe(0);
  });

  it('el cambio de hora no descuadra la cuenta', () => {
    // 2026-03-29 es el paso a horario de verano (día de 23 h) y 2026-10-25 la
    // vuelta (día de 25 h). Restando milisegundos salían 29,96 y 30,04 días.
    expect(diasEntre(new Date(2026, 2, 15), new Date(2026, 3, 14))).toBe(30);
    expect(diasEntre(new Date(2026, 9, 15), new Date(2026, 10, 14))).toBe(30);
  });

  it('un rango invertido da negativo', () => {
    expect(diasEntre(new Date(2026, 0, 31), new Date(2026, 0, 1))).toBe(-30);
  });
});
