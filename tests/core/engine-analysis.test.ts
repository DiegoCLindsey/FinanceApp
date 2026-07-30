// Paridad legacy ↔ engine: colchón, márgenes de seguridad y análisis del
// extracto (Fase 1, tarea 1.4).
import { describe, it, expect, beforeAll } from 'vitest';
import { generarExtracto, type StatementAccount } from '@/engine/statement';
import {
  calcGastoBasicoMensual, calcColchon, calcColchonEnFecha, calcMargenEnFecha,
  saldosPorCuentaEnExtracto, detectarCrucesMargenes,
  type BasicoExpense, type BasicoLoan, type MargenSeguridad,
} from '@/engine/margins';
import { detectarPuntosCriticos, mediaMensualGastos, calcDesviacion } from '@/engine/analysis';
import type { CashEvent } from '@/engine/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;

const accounts: StatementAccount[] = [
  { _id: 'default', nombre: 'Principal', activo: true, esCuentaPrincipal: true, saldoInicial: 3000, fechaInicialSaldo: '2026-01-01', historicoSaldos: [{ fecha: '2026-03-01', saldo: 2500 }, { fecha: '2026-05-01', saldo: 4100 }], interes: 0 },
  { _id: 'acc2', nombre: 'Secundaria', activo: true, saldoInicial: 1500, fechaInicialSaldo: '2026-01-01', historicoSaldos: [{ fecha: '2026-04-01', saldo: 1800 }], interes: 0 },
];

const expenses: BasicoExpense[] = [
  { _id: 'e1', activo: true, basico: true, concepto: 'Alquiler', cuantia: 850, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2025-01-01', tags: ['vivienda'], cuenta: 'default' },
  { _id: 'e2', activo: true, basico: true, concepto: 'Luz', cuantia: 90, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 2, fechaInicio: '2025-02-05', tags: ['suministros'], cuenta: 'default' },
  { _id: 'e3', activo: true, basico: false, concepto: 'Ocio', cuantia: 200, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2025-01-20', tags: ['ocio'], cuenta: 'acc2' },
  { _id: 'e4', activo: true, concepto: 'Nómina manual', cuantia: 1900, tipo: 'ingreso', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2025-01-25', tags: [], cuenta: 'default' },
];

const loans: BasicoLoan[] = [
  { capital: 90000, tin: 2.2, meses: 240, basico: true, activo: true },
  { capital: 8000, tin: 6, meses: 36, basico: false, activo: true },
  { capital: 5000, tin: 4, meses: 24, basico: true, activo: true, simulacion: true },
];

const margenes: MargenSeguridad[] = [
  { _id: 'm1', nombre: 'Reserva global', activo: true, cuentas: [], puntos: [{ _id: 'p1', fecha: '2026-01-01', tipo: 'fijo', importe: 4000 }, { _id: 'p2', fecha: '2026-07-01', tipo: 'meses', meses: 3 }] },
  { _id: 'm2', nombre: 'Solo secundaria', activo: true, cuentas: ['acc2'], puntos: [{ _id: 'p3', fecha: '2026-02-01', tipo: 'fijo', importe: 1200 }] },
  { _id: 'm3', nombre: 'Futuro', activo: true, cuentas: [], puntos: [{ _id: 'p4', fecha: '2027-01-01', tipo: 'fijo', importe: 9000 }] },
  { _id: 'm4', nombre: 'Inactivo', activo: false, cuentas: [], puntos: [{ _id: 'p5', fecha: '2026-01-01', tipo: 'fijo', importe: 99999 }] },
];

const config = {
  dashboardStart: '2026-01-01',
  dashboardEnd: '2026-12-31',
  fechaReferencia: '2026-01-01',
  colchonTipo: 'meses' as const,
  colchonMeses: 6,
  colchonFijo: 0,
  colchonPuntos: [{ _id: 'cp1', fecha: '2026-06-01', tipo: 'fijo' as const, importe: 7000 }],
};

let extracto: CashEvent[];

beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
  const stateData: Record<string, unknown> = { accounts, nominas: [], config, inflacion: [], tramosIRPFHistorico: [], tramosGananciasCapitalHistorico: [] };
  (globalThis as any).State = {
    get: (k: string) => stateData[k],
    accountName: (id: string) => accounts.find((a) => a._id === id)?.nombre ?? id,
  };
  extracto = generarExtracto({ loans: [], expenses: expenses as any, accounts, config });
});

describe('paridad colchón y gasto básico', () => {
  it('calcGastoBasicoMensual idéntico (mismo instante)', () => {
    expect(calcGastoBasicoMensual(expenses)).toBe(FM.calcGastoBasicoMensual(expenses));
  });
  it('calcColchon idéntico en modo meses y fijo', () => {
    expect(calcColchon(expenses, config, loans)).toBe(FM.calcColchon(expenses, config, loans));
    const cfgFijo = { ...config, colchonTipo: 'fijo', colchonFijo: 12000 };
    expect(calcColchon(expenses, cfgFijo, loans)).toBe(FM.calcColchon(expenses, cfgFijo, loans));
    // colchonFijo = 0 con tipo fijo cae al cálculo por meses (quirk del legacy)
    const cfgFijoCero = { ...config, colchonTipo: 'fijo', colchonFijo: 0 };
    expect(calcColchon(expenses, cfgFijoCero, loans)).toBe(FM.calcColchon(expenses, cfgFijoCero, loans));
  });
  it('calcColchonEnFecha idéntico antes y después del waypoint', () => {
    for (const fecha of ['2026-01-15', '2026-05-31', '2026-06-01', '2026-12-31']) {
      expect(calcColchonEnFecha(expenses, config, loans, fecha)).toBe(FM.calcColchonEnFecha(expenses, config, loans, fecha));
    }
  });
});

describe('paridad márgenes de seguridad', () => {
  it('calcMargenEnFecha idéntico (waypoints fijo/meses, sin waypoint previo, fallback)', () => {
    const fechas = ['2025-12-01', '2026-01-01', '2026-03-15', '2026-07-01', '2026-09-30', '2027-06-01'];
    for (const m of margenes) {
      for (const fecha of fechas) {
        expect(calcMargenEnFecha(m, expenses, config, loans, fecha)).toBe(FM.calcMargenEnFecha(m, expenses, config, loans, fecha));
        expect(calcMargenEnFecha(m, expenses, config, loans, fecha, true)).toBe(FM.calcMargenEnFecha(m, expenses, config, loans, fecha, true));
      }
    }
    // Margen sin puntos → 0
    expect(calcMargenEnFecha({ nombre: 'vacio' }, expenses, config, loans, '2026-01-01')).toBe(0);
  });
  it('saldosPorCuentaEnExtracto idéntico', () => {
    expect(saldosPorCuentaEnExtracto(extracto, accounts)).toEqual(FM.saldosPorCuentaEnExtracto(extracto, accounts));
  });
  it('detectarCrucesMargenes idéntico (global, por cuentas, e inactivos ignorados)', () => {
    const saldos = saldosPorCuentaEnExtracto(extracto, accounts);
    expect(detectarCrucesMargenes(margenes, extracto, saldos, expenses, config, loans)).toEqual(
      FM.detectarCrucesMargenes(margenes, extracto, saldos, expenses, config, loans),
    );
    expect(detectarCrucesMargenes([], extracto, saldos, expenses, config, loans)).toEqual([]);
  });
});

describe('paridad análisis del extracto', () => {
  it('detectarPuntosCriticos idéntico con y sin colchón', () => {
    for (const colchon of [0, 1000, 4500, 50000]) {
      expect(detectarPuntosCriticos(extracto, colchon)).toEqual(FM.detectarPuntosCriticos(extracto, colchon));
    }
  });
  it('mediaMensualGastos idéntica', () => {
    expect(mediaMensualGastos(extracto, config)).toBe(FM.mediaMensualGastos(extracto, config));
  });
  it('calcDesviacion idéntica (LOCF multi-cuenta)', () => {
    expect(calcDesviacion(extracto, accounts)).toEqual(FM.calcDesviacion(extracto, accounts));
    expect(calcDesviacion([], accounts)).toEqual([]);
  });
});
