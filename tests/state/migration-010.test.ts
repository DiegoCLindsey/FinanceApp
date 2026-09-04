// Migración a v10: simplificación grande — retira Supuestos (escenarios), el
// planificador financiero y el puente de "Objetivos de ahorro (antiguos)".
import { describe, it, expect } from 'vitest';
import { migrateTo10 } from '@/state/migrations/010-simplificacion';

const CTX = { hoyISO: '2026-09-03', finISO: '2027-09-03' };

/** Estado realista de una instalación antigua, con las tres colecciones a retirar. */
const estadoAntiguo = () => ({
  loans: [
    {
      _id: 'l1',
      nombre: 'Hipoteca',
      capital: 120000,
      escenarioIds: ['e1'],
      amortizaciones: [
        { _id: 'a1', fecha: '2027-01-01', cantidad: 3000, escenarioIds: ['e1', 'e2'] },
        { _id: 'a2', fecha: '2027-06-01', cantidad: 1000 },
      ],
    },
  ],
  expenses: [
    { _id: 'x1', concepto: 'Alquiler', escenarioIds: [] },
    { _id: 'x2', concepto: 'Luz', escenarioIds: ['e1'] },
  ],
  nominas: [{ _id: 'n1', nombre: 'Sueldo', escenarioIds: ['e2'] }],
  accounts: [{ _id: 'c1', nombre: 'Principal', escenarioIds: [] }],
  escenarios: [
    { _id: 'e1', nombre: 'Paro 6 meses' },
    { _id: 'e2', nombre: 'Cambio de coche' },
  ],
  goals: [{ _id: 'g1', nombre: 'Viaje', targetAmount: 3000, cuentaIds: ['c1'] }],
  planes: [
    { _id: 'plan_base', nombre: 'Plan base', objetivos: [] },
    { _id: 'plan_real', nombre: 'Mi plan', objetivos: [{ _id: 'o1', nombre: 'Entrada del piso', importeObjetivo: 4000000 }] },
  ],
  // Colecciones que la migración NO debe tocar
  tramosIRPFHistorico: [{ _id: 't1', año: 2026, tramos: [[0, 19]] }],
  tramosGananciasCapitalHistorico: [{ _id: 'tg1', año: 2026, tramos: [[0, 19]] }],
  inflacion: [{ _id: 'i1', year: 2026, tasa: 2.5 }],
  personas: [{ _id: 'default', nombre: 'Yo', esPorDefecto: true, activo: true }],
  transacciones: [{ _id: 'tr1' }],
  puntosControl: [{ _id: 'pc1' }],
  config: {
    dashboardStart: '2026-01-01',
    dashboardEnd: '2026-12-31',
    escenarioActivo: 'e1',
    usarInflacion: true,
    features: {},
  },
});

describe('migración a v10', () => {
  it('no lanza con un estado realista de una instalación antigua', () => {
    expect(() => migrateTo10(estadoAntiguo(), CTX)).not.toThrow();
  });

  it('quita escenarioIds de las 4 colecciones principales', () => {
    const out = migrateTo10(estadoAntiguo(), CTX);
    expect((out.loans as Record<string, unknown>[])[0]).not.toHaveProperty('escenarioIds');
    for (const e of out.expenses as Record<string, unknown>[]) expect(e).not.toHaveProperty('escenarioIds');
    for (const n of out.nominas as Record<string, unknown>[]) expect(n).not.toHaveProperty('escenarioIds');
    for (const a of out.accounts as Record<string, unknown>[]) expect(a).not.toHaveProperty('escenarioIds');
  });

  it('quita escenarioIds anidado en cada amortización, sin perder las demás propiedades', () => {
    const out = migrateTo10(estadoAntiguo(), CTX);
    const amortizaciones = (out.loans as { amortizaciones: Record<string, unknown>[] }[])[0].amortizaciones;
    expect(amortizaciones).toHaveLength(2);
    for (const a of amortizaciones) expect(a).not.toHaveProperty('escenarioIds');
    expect(amortizaciones[0]).toMatchObject({ _id: 'a1', fecha: '2027-01-01', cantidad: 3000 });
    expect(amortizaciones[1]).toMatchObject({ _id: 'a2', fecha: '2027-06-01', cantidad: 1000 });
  });

  it('borra la colección escenarios y config.escenarioActivo', () => {
    const out = migrateTo10(estadoAntiguo(), CTX);
    expect(out).not.toHaveProperty('escenarios');
    expect(out.config).not.toHaveProperty('escenarioActivo');
    // El resto de config no se toca
    expect((out.config as Record<string, unknown>).usarInflacion).toBe(true);
    expect((out.config as Record<string, unknown>).dashboardStart).toBe('2026-01-01');
  });

  it('borra la colección goals sin archivarla (ya viajó a planes en la migración 008)', () => {
    const out = migrateTo10(estadoAntiguo(), CTX);
    expect(out).not.toHaveProperty('goals');
  });

  it('borra la colección planes, archivando solo los que tienen datos reales', () => {
    const out = migrateTo10(estadoAntiguo(), CTX);
    expect(out).not.toHaveProperty('planes');
    const archivados = out._migracion010_planesArchivados as Record<string, unknown>[];
    expect(archivados).toHaveLength(1);
    expect(archivados[0]._id).toBe('plan_real');
  });

  it('no archiva nada si el único plan es el plan_base trivial', () => {
    const estado = { ...estadoAntiguo(), planes: [{ _id: 'plan_base', nombre: 'Plan base', objetivos: [] }] };
    const out = migrateTo10(estado, CTX);
    expect(out).not.toHaveProperty('_migracion010_planesArchivados');
  });

  it('no toca las colecciones que siguen usando Salarios, Cuentas, el dashboard y la Inflación', () => {
    const out = migrateTo10(estadoAntiguo(), CTX);
    expect(out.tramosIRPFHistorico).toEqual(estadoAntiguo().tramosIRPFHistorico);
    expect(out.tramosGananciasCapitalHistorico).toEqual(estadoAntiguo().tramosGananciasCapitalHistorico);
    expect(out.inflacion).toEqual(estadoAntiguo().inflacion);
  });

  it('no toca ninguna otra colección "keep-list"', () => {
    const estado = estadoAntiguo();
    const out = migrateTo10(estado, CTX);
    expect(out.personas).toBe(estado.personas);
    expect(out.transacciones).toBe(estado.transacciones);
    expect(out.puntosControl).toBe(estado.puntosControl);
  });

  it('es idempotente: correr dos veces seguidas no cambia nada más', () => {
    const una = migrateTo10(estadoAntiguo(), CTX);
    const dos = migrateTo10(una, CTX);
    expect(dos).toEqual(una);
  });

  it('un estado ya limpio (sin escenarios/planes/goals) no cambia', () => {
    const limpio = { loans: [{ _id: 'l1' }], config: { usarInflacion: false } };
    const out = migrateTo10(limpio, CTX);
    // La guarda de idempotencia corta antes de tocar nada: mismas referencias.
    expect(out.loans).toBe(limpio.loans);
    expect(out.config).toBe(limpio.config);
  });

  it('aguanta colecciones ausentes sin lanzar', () => {
    expect(() => migrateTo10({ escenarios: [] }, CTX)).not.toThrow();
    const out = migrateTo10({ escenarios: [] }, CTX);
    expect(out.loans).toEqual([]);
    expect(out.expenses).toEqual([]);
  });
});
