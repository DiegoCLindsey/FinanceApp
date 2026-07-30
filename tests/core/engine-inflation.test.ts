// Paridad legacy ↔ engine: eventos de inflación (Fase 1, tarea 1.4).
import { describe, it, expect, beforeAll } from 'vitest';
import { proyectarInflacionGastos, proyectarPerdidaAhorro } from '@/engine/providers/inflation-events';
import type { ExpenseLike } from '@/engine/providers/expenses';
import type { DateRange } from '@/engine/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

const range: DateRange = { start: '2026-01-01', end: '2027-12-31' };
const periodos = [
  { year: 2026, tasa: 2.5 },
  { year: 2027, tasa: 3.1 },
];
const gastos: ExpenseLike[] = [
  {
    _id: 'g1',
    activo: true,
    concepto: 'Alquiler',
    cuantia: 800,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2025-06-01',
    tags: [],
    cuenta: 'default',
  },
  {
    _id: 'g2',
    activo: true,
    concepto: 'Seguro',
    cuantia: 600,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 6,
    fechaInicio: '2026-03-01',
    fechaFin: '2027-03-01',
    tags: [],
    cuenta: 'acc2',
  },
  {
    _id: 'g3',
    activo: true,
    concepto: 'Diario',
    cuantia: 10,
    tipo: 'gasto',
    tipoFrecuencia: 'diaria',
    frecuencia: 1,
    fechaInicio: '2026-01-01',
    tags: [],
    cuenta: 'default',
  },
];

describe('paridad eventos de inflación', () => {
  it('proyectarInflacionGastos idéntico (sin y con filtro)', () => {
    expect(proyectarInflacionGastos(gastos, periodos, range, null, 'principal')).toEqual(
      FM.proyectarInflacionGastos(gastos, periodos, range.start, range.end, null, 'principal'),
    );
    expect(proyectarInflacionGastos(gastos, periodos, range, ['acc2'], 'principal')).toEqual(
      FM.proyectarInflacionGastos(gastos, periodos, range.start, range.end, ['acc2'], 'principal'),
    );
    expect(proyectarInflacionGastos(gastos, [], range)).toEqual([]);
  });
  it('proyectarPerdidaAhorro idéntico', () => {
    expect(proyectarPerdidaAhorro(25000, periodos, range, 'principal')).toEqual(
      FM.proyectarPerdidaAhorro(25000, periodos, range.start, range.end, 'principal'),
    );
    expect(proyectarPerdidaAhorro(0, periodos, range)).toEqual([]);
  });
});
