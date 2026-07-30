// Paridad legacy ↔ engine: providers de préstamos, intereses, aportaciones y
// retenciones (Fase 1, tarea 1.4). Igualdad estricta.
import { describe, it, expect, beforeAll } from 'vitest';
import { proyectarPrestamos, type LoanItem } from '@/engine/providers/loans';
import { proyectarInteresesCuentas, type InterestAccount } from '@/engine/providers/interests';
import { proyectarAportaciones, type ContributionAccount } from '@/engine/providers/contributions';
import { proyectarRetencionesFiscales, type WithholdingExpense } from '@/engine/providers/withholdings';
import { TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';
import type { DateRange } from '@/engine/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

const range: DateRange = { start: '2026-01-01', end: '2027-06-30' };

describe('paridad provider de préstamos', () => {
  const loans: LoanItem[] = [
    { _id: 'l1', nombre: 'Hipoteca', activo: true, capital: 150000, tin: 2.5, meses: 300, fechaInicio: '2025-03-01', comisionAmort: 0.5, amortizaciones: [{ fecha: '2026-04-10', cantidad: 5000, tipo: 'plazo', simulacion: true }], cuenta: 'default', tags: ['hipoteca'] },
    { _id: 'l2', nombre: 'Coche', activo: true, capital: 12000, tin: 5, meses: 48, fechaInicio: '2025-06-01', cuenta: 'acc2', tags: [], diaPago: 'dia:5' },
    { _id: 'l3', nombre: 'Off', activo: false, capital: 9000, tin: 4, meses: 24, fechaInicio: '2026-01-01', cuenta: 'default', tags: [] },
  ];
  it('proyectarPrestamos idéntico (con y sin filtro)', () => {
    expect(proyectarPrestamos(loans, range)).toEqual(FM.proyectarPrestamos(loans, range.start, range.end));
    expect(proyectarPrestamos(loans, range, ['acc2'])).toEqual(FM.proyectarPrestamos(loans, range.start, range.end, ['acc2']));
  });
});

describe('paridad provider de intereses', () => {
  const accounts: InterestAccount[] = [
    { _id: 'a1', nombre: 'Remunerada', activo: true, interes: 3, periodoCobro: 'mensual', saldoInicial: 10000, fechaInicialSaldo: '2026-01-01', historicoSaldos: [] },
    { _id: 'a2', nombre: 'Semanal', activo: true, interes: 2.2, periodoCobro: 'semanal', saldoInicial: 5000, fechaInicialSaldo: '2025-12-01', historicoSaldos: [{ fecha: '2026-02-01', saldo: 7000 }] },
    { _id: 'a3', nombre: 'SinInteres', activo: true, interes: 0, saldoInicial: 999 },
  ];
  const movimientos = [
    { fecha: '2026-01-15', concepto: 'x', cuantia: 1200, tipo: 'ingreso' as const, tags: [], cuenta: 'a1', sourceId: 's1', sourceType: 'expense' },
    { fecha: '2026-02-20', concepto: 'y', cuantia: 400, tipo: 'gasto' as const, tags: [], cuenta: 'a1', sourceId: 's2', sourceType: 'expense' },
    { fecha: '2026-03-01', concepto: 'z', cuantia: 900, tipo: 'ingreso' as const, tags: [], cuenta: 'a2', sourceId: 's3', sourceType: 'expense' },
  ];
  it('proyectarInteresesCuentas idéntico (vía generarExtracto: la función legacy es interna)', () => {
    const r = { start: '2026-01-01', end: '2026-12-31' };
    // Sin gastos/préstamos/nóminas, el extracto legacy contiene solo los
    // eventos de interés; se comparan sin los campos de ancla (delta/saldoAcum).
    const config = { dashboardStart: r.start, dashboardEnd: r.end, fechaReferencia: r.start };
    const legacy = FM.generarExtracto([], [], accounts, config, null, [])
      .map(({ delta: _d, saldoAcum: _s, ...ev }: Record<string, unknown>) => ev);
    const nuestro = proyectarInteresesCuentas(accounts, r, null, []);
    const orden = (a: { fecha: string; cuenta: string }, b: { fecha: string; cuenta: string }) =>
      a.fecha.localeCompare(b.fecha) || a.cuenta.localeCompare(b.cuenta);
    expect([...nuestro].sort(orden)).toEqual([...legacy].sort(orden));
    // Con movimientos: mismo cálculo de saldo medio por periodo
    const legacyConMovs = FM.generarExtracto([], movimientos.map((m) => ({
      _id: m.sourceId, activo: true, concepto: m.concepto, cuantia: m.cuantia, tipo: m.tipo,
      tipoFrecuencia: 'extraordinario', fechaInicio: m.fecha, tags: m.tags, cuenta: m.cuenta,
    })), accounts, config, null, [])
      .filter((e: { sourceType: string }) => e.sourceType === 'account-interest')
      .map(({ delta: _d, saldoAcum: _s, ...ev }: Record<string, unknown>) => ev);
    const nuestroConMovs = proyectarInteresesCuentas(accounts, r, null, movimientos);
    expect([...nuestroConMovs].sort(orden)).toEqual([...legacyConMovs].sort(orden));
  });
});

describe('paridad provider de aportaciones', () => {
  const accounts: ContributionAccount[] = [
    { _id: 'f1', nombre: 'Indexado', activo: true, modeloFondo: 'inversion', planAportaciones: [{ _id: 'p1', importe: 300, periodicidad: 'mensual', fechaInicio: '2026-01-20', cuentaOrigen: 'default' }] },
    { _id: 'f2', nombre: 'Plan', activo: true, modeloFondo: 'pension', planAportaciones: [{ _id: 'p2', importe: 500, periodicidad: 'trimestral', fechaInicio: '2025-11-30', fechaFin: '2026-12-31', cuentaOrigen: 'acc2' }] },
    { _id: 'f3', nombre: 'Normal', activo: true, modeloFondo: 'cuenta', planAportaciones: [{ _id: 'p3', importe: 100 }] },
  ];
  it('proyectarAportaciones idéntico', () => {
    expect(proyectarAportaciones(accounts, range)).toEqual(FM.proyectarAportaciones(accounts, range.start, range.end));
    expect(proyectarAportaciones(accounts, range, ['f2', 'acc2'])).toEqual(FM.proyectarAportaciones(accounts, range.start, range.end, ['f2', 'acc2']));
  });
});

describe('paridad provider de retenciones', () => {
  const expenses: WithholdingExpense[] = [
    { _id: 'i1', activo: true, concepto: 'Freelance', cuantia: 2500, tipo: 'ingreso', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2026-01-05', tags: ['irpf', 'fiscal'], cuenta: 'default', sujetoIRPF: true },
    { _id: 'i2', activo: true, concepto: 'Premio', cuantia: 10000, tipo: 'ingreso', tipoFrecuencia: 'extraordinario', fechaInicio: '2026-03-01', tags: ['irpf', 'fiscal'], cuenta: 'default', sujetoIRPF: true },
    { _id: 'i3', activo: true, concepto: 'SinIRPF', cuantia: 800, tipo: 'ingreso', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2026-01-01', tags: [], cuenta: 'default' },
  ];
  it('proyectarRetencionesFiscales idéntico (config → tramos explícitos)', () => {
    const config = { tramos_irpf: TRAMOS_IRPF_DEFAULT };
    expect(proyectarRetencionesFiscales(expenses, TRAMOS_IRPF_DEFAULT, range)).toEqual(
      FM.proyectarRetencionesFiscales(expenses, config, range.start, range.end),
    );
  });
});
