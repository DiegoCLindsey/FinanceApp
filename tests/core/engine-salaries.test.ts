// Paridad legacy ↔ engine: provider de nóminas (Fase 1, tarea 1.4).
// El legacy sin State resuelve los tramos por defecto; el core recibe el
// resolver inyectado (default = mismos tramos), así que la comparación es justa.
import { describe, it, expect, beforeAll } from 'vitest';
import { proyectarNominas, type NominaItem } from '@/engine/providers/salaries';
import { TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';
import type { DateRange } from '@/engine/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

const range: DateRange = { start: '2026-01-01', end: '2027-12-31' };
const config = { tramos_irpf: TRAMOS_IRPF_DEFAULT };
const periodos = [
  { year: 2026, tasa: 2.5 },
  { year: 2027, tasa: 3.1 },
];

const nominas: NominaItem[] = [
  // Grupo con dos nóminas (apilamiento marginal), una con flex y detallado
  {
    _id: 'n1',
    nombre: 'Titular',
    activo: true,
    bruto: 42000,
    nPagas: 12,
    irpfModo: 'auto',
    representacion: 'detallado',
    fechaInicio: '2025-01-05',
    cuenta: 'default',
    tags: ['nomina'],
    grupoNomina: 'casa',
    retribucionFlexible: [{ _id: 'fx1', tipo: 'restaurante', importe: 180, cuenta: 'benef1' }],
  },
  {
    _id: 'n2',
    nombre: 'Pareja',
    activo: true,
    bruto: 28000,
    nPagas: 14,
    irpfModo: 'auto',
    representacion: 'simplificado',
    fechaInicio: '2025-03-10',
    cuenta: 'acc2',
    tags: [],
    grupoNomina: 'casa',
  },
  // Standalone con IRPF manual e IPC
  {
    _id: 'n3',
    nombre: 'Freelance',
    activo: true,
    bruto: 18000,
    nPagas: 12,
    irpfModo: 'manual',
    irpfPct: 12,
    representacion: 'simplificado',
    fechaInicio: '2026-02-01',
    fechaFin: '2027-06-30',
    cuenta: 'default',
    tags: [],
    grupoNomina: '',
    mesActualizacionIPC: 1,
  },
  // Inactiva
  {
    _id: 'n4',
    nombre: 'Off',
    activo: false,
    bruto: 50000,
    nPagas: 12,
    irpfModo: 'auto',
    representacion: 'simplificado',
    fechaInicio: '2026-01-01',
    cuenta: 'default',
    tags: [],
    grupoNomina: 'casa',
  },
];

describe('paridad provider de nóminas', () => {
  it('proyectarNominas idéntico sin IPC', () => {
    expect(proyectarNominas(nominas, range)).toEqual(FM.proyectarNominas(nominas, config, range.start, range.end, null, []));
  });
  it('proyectarNominas idéntico con IPC activo', () => {
    expect(proyectarNominas(nominas, range, null, periodos)).toEqual(
      FM.proyectarNominas(nominas, config, range.start, range.end, null, periodos),
    );
  });
  it('proyectarNominas idéntico con filtro de cuentas (incluida la cuenta beneficio)', () => {
    for (const filtro of [['default'], ['acc2'], ['benef1'], ['default', 'benef1']]) {
      expect(proyectarNominas(nominas, range, filtro, periodos)).toEqual(
        FM.proyectarNominas(nominas, config, range.start, range.end, filtro, periodos),
      );
    }
  });
});

describe('nóminas encadenadas con cobro el día 1 (caso reportado)', () => {
  // El usuario puso que su nómina acababa en octubre y la siguiente empezaba en
  // noviembre, y los ingresos desaparecieron de octubre en adelante.
  //
  // Eran dos fallos sumados, ambos invisibles en UTC:
  //   1. resolverDiaEfectivo devolvía el día ANTERIOR, así que el cobro del
  //      día 1 de noviembre aterrizaba el 31 de octubre.
  //   2. La gráfica de categorías cerraba cada mes con toISOString(), o sea el
  //      penúltimo día, así que octubre terminaba el 30.
  // El cobro caía en el hueco entre los dos meses y no salía en ninguno.
  const A = {
    _id: 'nA',
    nombre: 'Nómina actual',
    bruto: 42000,
    nPagas: 12,
    irpfModo: 'auto',
    representacion: 'detallado',
    fechaInicio: '2024-11-01',
    fechaFin: '2026-10-31',
    cuenta: 'a1',
    activo: true,
    tags: [],
    grupoNomina: '',
    ssPct: 6.35,
  };
  const B = {
    _id: 'nB',
    nombre: 'Nómina nueva',
    bruto: 48000,
    nPagas: 12,
    irpfModo: 'auto',
    representacion: 'detallado',
    fechaInicio: '2026-11-01',
    fechaFin: null,
    cuenta: 'a1',
    activo: true,
    tags: [],
    grupoNomina: '',
    ssPct: 6.35,
  };

  const ingresosPorMes = () => {
    const evs = proyectarNominas([A, B] as never[], { start: '2026-08-01', end: '2027-02-28' });
    const m: Record<string, number> = {};
    for (const e of evs) {
      if (e.tipo !== 'ingreso') continue;
      m[e.fecha.slice(0, 7)] = (m[e.fecha.slice(0, 7)] || 0) + e.cuantia;
    }
    return m;
  };

  it('no deja ningún mes sin ingreso al empalmar una nómina con la siguiente', () => {
    const m = ingresosPorMes();
    for (const mes of ['2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01', '2027-02']) {
      expect(m[mes], `${mes} se ha quedado sin ingresos`).toBeGreaterThan(0);
    }
  });

  it('el cobro del día 1 cae el día 1, no el último del mes anterior', () => {
    const evs = proyectarNominas([B] as never[], { start: '2026-11-01', end: '2026-12-31' });
    const fechas = evs.filter((e) => e.tipo === 'ingreso').map((e) => e.fecha);
    expect(fechas).toContain('2026-11-01');
    expect(fechas).toContain('2026-12-01');
    expect(fechas).not.toContain('2026-10-31');
  });

  it('cada nómina cobra en su tramo y no se solapan', () => {
    const evs = proyectarNominas([A, B] as never[], { start: '2026-08-01', end: '2027-02-28' });
    const de = (id: string) => evs.filter((e) => e.sourceId === id && e.tipo === 'ingreso').map((e) => e.fecha);
    expect(de('nA').every((f) => f <= '2026-10-31')).toBe(true);
    expect(de('nB').every((f) => f >= '2026-11-01')).toBe(true);
  });
});
