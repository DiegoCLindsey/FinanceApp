// Paridad legacy ↔ engine nuevo: provider de gastos (Fase 1, tarea 1.4).
import { describe, it, expect, beforeAll } from 'vitest';
import { proyectarGastos, type ExpenseLike } from '@/engine/providers/expenses';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

const fixtures: ExpenseLike[] = [
  {
    _id: 'g1',
    activo: true,
    concepto: 'Gym',
    cuantia: 50,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2026-01-15',
    tags: ['ocio'],
    cuenta: 'default',
  },
  {
    _id: 'g2',
    activo: true,
    concepto: 'Seguro',
    cuantia: 300,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 6,
    fechaInicio: '2025-08-20',
    fechaFin: '2027-06-30',
    tags: ['seguros'],
    cuenta: 'acc2',
  },
  {
    _id: 'g3',
    activo: true,
    concepto: 'Compra',
    cuantia: 80,
    tipo: 'gasto',
    tipoFrecuencia: 'diaria',
    frecuencia: 7,
    fechaInicio: '2025-12-01',
    tags: ['super'],
    cuenta: 'default',
  },
  {
    _id: 'g4',
    activo: true,
    concepto: 'Bonus',
    cuantia: 2000,
    tipo: 'ingreso',
    tipoFrecuencia: 'extraordinario',
    fechaInicio: '2026-04-01',
    tags: ['extra'],
    cuenta: 'default',
  },
  {
    _id: 'g5',
    activo: false,
    concepto: 'Inactivo',
    cuantia: 99,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2026-01-01',
    tags: [],
    cuenta: 'default',
  },
  {
    _id: 'g6',
    activo: true,
    concepto: 'Alquiler',
    cuantia: 800,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2024-02-29',
    diaPago: 'dia:ultimo',
    tags: ['vivienda'],
    cuenta: 'default',
  },
  {
    _id: 'g7',
    activo: true,
    concepto: 'Clases',
    cuantia: 120,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2026-01-01',
    diaPago: 'nthweekday:1:1',
    tags: ['formacion'],
    cuenta: 'default',
  },
];

describe('paridad provider de gastos', () => {
  const rangos: [string, string][] = [
    ['2026-01-01', '2026-06-30'],
    ['2025-06-01', '2028-01-01'],
    ['2026-03-10', '2026-03-10'],
  ];
  it('proyectarGastos idéntico (sin filtro y con filtro de cuentas)', () => {
    for (const [start, end] of rangos) {
      expect(proyectarGastos(fixtures, { start, end })).toEqual(FM.proyectarGastos(fixtures, start, end));
      expect(proyectarGastos(fixtures, { start, end }, ['acc2'])).toEqual(FM.proyectarGastos(fixtures, start, end, ['acc2']));
      expect(proyectarGastos(fixtures, { start, end }, [])).toEqual(FM.proyectarGastos(fixtures, start, end, []));
    }
  });
  it('la cuantía proyectada es siempre la configurada (v7 retiró historialPrecios)', () => {
    // fixtures[6] tenía historial de precios con media 120 ≠ cuantía 120 antes
    // de v7; hoy solo cuenta `cuantia`, y el legacy hace lo mismo (paridad).
    expect(proyectarGastos([fixtures[6]], { start: '2026-01-01', end: '2026-01-31' })[0].cuantia).toBe(120);
  });
});
