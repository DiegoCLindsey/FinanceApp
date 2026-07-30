// Paridad legacy ↔ core para saldos de cuentas y fiscalidad de pensiones/fondos
// (Fase 1, tarea 1.3). Igualdad estricta.
import { describe, it, expect, beforeAll } from 'vitest';
import * as core from '@/core';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

const cuentas: core.AccountLike[] = [
  { saldoInicial: 1000, fechaInicialSaldo: '2026-01-10', historicoSaldos: [{ fecha: '2025-12-01', saldo: 500 }, { fecha: '2026-02-01', saldo: 1500 }] },
  { saldoInicial: 0, historicoSaldos: [] },
  { saldoInicial: 42 },
  { saldoInicial: 100, fechaInicialSaldo: '2026-05-01', historicoSaldos: [{ fecha: '2026-04-01', saldo: 900 }, { fecha: '2026-06-01', saldo: 1100 }, { fecha: '2026-05-15', saldo: 1050 }] },
];

describe('paridad saldos de cuenta', () => {
  it('saldoRealCuenta idéntico', () => {
    for (const acc of cuentas) {
      expect(core.saldoRealCuenta(acc)).toBe(FM.saldoRealCuenta(acc));
    }
  });
  it('saldoEnFecha idéntico en un grid de fechas', () => {
    const fechas = ['2025-01-01', '2025-12-15', '2026-01-09', '2026-01-10', '2026-03-01', '2026-04-20', '2026-05-10', '2026-07-01'];
    for (const acc of cuentas) {
      for (const f of fechas) {
        expect(core.saldoEnFecha(acc, f)).toBe(FM.saldoEnFecha(acc, f));
      }
    }
  });
});

describe('paridad pensiones y fondos', () => {
  const plan: core.AccountLike = {
    modeloFondo: 'pension',
    impuestoRetirada: 30,
    bloqueoMeses: 120,
    saldoInicial: 0,
    historicoSaldos: [{ fecha: '2026-01-01', saldo: 12000 }],
    aportaciones: [
      { fecha: '2014-01-01', cantidad: 4000 },
      { fecha: '2020-01-01', cantidad: 6000 },
      { fecha: '2026-01-01', cantidad: 500 },
    ],
  };
  const fondo: core.AccountLike = {
    modeloFondo: 'inversion',
    saldoInicial: 10000,
    historicoSaldos: [{ fecha: '2026-03-01', saldo: 15000 }],
    aportaciones: [{ fecha: '2024-01-01', cantidad: 9000 }],
  };

  it('calcFondosPension idéntico (mismo instante)', () => {
    // El legacy usa new Date() interno; el core lo inyecta (default: ahora).
    expect(core.calcFondosPension(plan)).toEqual(FM.calcFondosPension(plan));
    expect(core.calcFondosPension({ modeloFondo: 'cuenta' })).toBeNull();
    expect(FM.calcFondosPension({ modeloFondo: 'cuenta' })).toBeNull();
  });
  it('calcImpuestoPension idéntico', () => {
    for (const retiro of [0, 1000, 6000, 12000, 20000]) {
      expect(core.calcImpuestoPension(plan, retiro)).toBe(FM.calcImpuestoPension(plan, retiro));
      expect(core.calcImpuestoPension(plan, retiro, 45)).toBe(FM.calcImpuestoPension(plan, retiro, 45));
    }
  });
  it('calcTipoMarginalPension idéntico', () => {
    const nominas = [
      { _id: 'n1', bruto: 2500, nPagas: 12, activo: true, grupoNomina: 'casa' },
      { _id: 'n2', bruto: 1800, nPagas: 14, activo: true, grupoNomina: 'casa' },
      { _id: 'n3', bruto: 3000, nPagas: 12, activo: false, grupoNomina: 'casa' },
    ];
    const tramos = core.TRAMOS_IRPF_DEFAULT;
    const planGrupo = { ...plan, grupoNomina: 'casa' };
    expect(core.calcTipoMarginalPension(planGrupo, nominas, tramos)).toBe(FM.calcTipoMarginalPension(planGrupo, nominas, tramos));
    expect(core.calcTipoMarginalPension(plan, nominas, tramos)).toBe(FM.calcTipoMarginalPension(plan, nominas, tramos));
  });
  it('calcFondoInversion idéntico (legacy sin State usa tramos default)', () => {
    // El legacy resuelve los tramos vía State (aquí: defaults); el core los recibe.
    expect(core.calcFondoInversion(fondo, core.TRAMOS_AHORRO_DEFAULT)).toEqual(FM.calcFondoInversion(fondo, null));
    expect(core.calcFondoInversion({ modeloFondo: 'cuenta' }, null)).toBeNull();
  });
});
