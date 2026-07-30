// Paridad legacy ↔ engine: optimizador de amortizaciones y comparador de
// frecuencias (Fase 1, tarea 1.5), incluida la mejora de rendimiento.
import { describe, it, expect, beforeAll } from 'vitest';
import { optimizarAmortizaciones, compararFrecuencias, createStatementMemo } from '@/engine/optimizer';
import type { StatementAccount } from '@/engine/statement';
import type { LoanItem } from '@/engine/providers/loans';
import type { BasicoExpense, MargenSeguridad } from '@/engine/margins';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;

const accounts: StatementAccount[] = [
  {
    _id: 'default',
    nombre: 'Principal',
    activo: true,
    esCuentaPrincipal: true,
    saldoInicial: 25000,
    fechaInicialSaldo: '2026-07-01',
    historicoSaldos: [{ fecha: '2026-07-30', saldo: 26000 }],
    interes: 0,
  },
  {
    _id: 'acc2',
    nombre: 'Secundaria',
    activo: true,
    saldoInicial: 4000,
    fechaInicialSaldo: '2026-07-01',
    historicoSaldos: [],
    interes: 1.2,
    periodoCobro: 'mensual',
  },
];

const loans: LoanItem[] = [
  {
    _id: 'l1',
    nombre: 'Hipoteca',
    activo: true,
    capital: 120000,
    tin: 3.1,
    meses: 300,
    fechaInicio: '2024-01-01',
    comisionAmort: 0.25,
    comisionApertura: 0,
    amortizaciones: [],
    cuenta: 'default',
    tags: ['hipoteca'],
  },
  {
    _id: 'l2',
    nombre: 'Coche',
    activo: true,
    capital: 15000,
    tin: 6.5,
    meses: 60,
    fechaInicio: '2025-03-01',
    comisionAmort: 0,
    comisionApertura: 0,
    amortizaciones: [],
    cuenta: 'default',
    tags: [],
  },
  {
    _id: 'l3',
    nombre: 'Simulado',
    activo: true,
    simulacion: true,
    capital: 5000,
    tin: 9,
    meses: 24,
    fechaInicio: '2026-01-01',
    amortizaciones: [],
    cuenta: 'default',
    tags: [],
  },
];

const expenses: BasicoExpense[] = [
  {
    _id: 'e1',
    activo: true,
    basico: true,
    concepto: 'Alquiler',
    cuantia: 700,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2025-01-01',
    tags: [],
    cuenta: 'default',
  },
  {
    _id: 'e2',
    activo: true,
    concepto: 'Ingresos',
    cuantia: 3200,
    tipo: 'ingreso',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2025-01-25',
    tags: [],
    cuenta: 'default',
  },
  {
    _id: 'e3',
    activo: true,
    concepto: 'Varios',
    cuantia: 450,
    tipo: 'gasto',
    tipoFrecuencia: 'mensual',
    frecuencia: 1,
    fechaInicio: '2025-01-10',
    tags: [],
    cuenta: 'acc2',
  },
];

const margenesSeguridad: MargenSeguridad[] = [
  { _id: 'm1', nombre: 'Reserva', activo: true, cuentas: [], puntos: [{ _id: 'p1', fecha: '2026-01-01', tipo: 'fijo', importe: 6000 }] },
  {
    _id: 'm2',
    nombre: 'Solo acc2',
    activo: true,
    cuentas: ['acc2'],
    puntos: [{ _id: 'p2', fecha: '2026-01-01', tipo: 'fijo', importe: 3000 }],
  },
];

const config = {
  dashboardStart: '2026-07-01',
  dashboardEnd: '2031-12-31',
  fechaReferencia: '2026-07-30',
  colchonTipo: 'meses' as const,
  colchonMeses: 6,
  margenesSeguridad,
};

beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
  const stateData: Record<string, unknown> = {
    accounts,
    nominas: [],
    config,
    inflacion: [],
    tramosIRPFHistorico: [],
    tramosGananciasCapitalHistorico: [],
  };
  (globalThis as any).State = {
    get: (k: string) => stateData[k],
    accountName: (id: string) => accounts.find((a) => a._id === id)?.nombre ?? id,
  };
});

describe('paridad optimizador de amortizaciones', () => {
  const variantes = [
    { frecuencia: 1, mesesHorizonte: 24, minAmortizable: 500, tipoAmort: 'plazo' },
    { frecuencia: 3, mesesHorizonte: 36, minAmortizable: 1000, tipoAmort: 'cuota' },
    { frecuencia: 6, mesesHorizonte: 18, minAmortizable: 500, tipoAmort: 'plazo', loanIds: ['l2'] },
    { frecuencia: 1, mesesHorizonte: 12, minAmortizable: 500, tipoAmort: 'plazo', sourceAccountId: 'acc2' },
    { frecuencia: 2, mesesHorizonte: 24, minAmortizable: 500, tipoAmort: 'plazo', selectedMarginIds: ['m1'] },
    { frecuencia: 1, mesesHorizonte: 24, minAmortizable: 500, tipoAmort: 'plazo', fechaPrimeraAmort: '2027-01-01' },
  ];
  it('optimizarAmortizaciones idéntico en todas las variantes', () => {
    for (const v of variantes) {
      const nuestro = optimizarAmortizaciones(loans, expenses, accounts, config, v as any);
      const legacy = FM.optimizarAmortizaciones(loans, expenses, accounts, config, v);
      expect(nuestro).toEqual(legacy);
    }
  });
  it('sin préstamos elegibles devuelve plan vacío igual que el legacy', () => {
    const opts = { frecuencia: 1, mesesHorizonte: 12, loanIds: ['inexistente'] };
    expect(optimizarAmortizaciones(loans, expenses, accounts, config, opts)).toEqual(
      FM.optimizarAmortizaciones(loans, expenses, accounts, config, opts),
    );
  });
  it('genera un plan no vacío (el caso base es significativo)', () => {
    const res = optimizarAmortizaciones(loans, expenses, accounts, config, { frecuencia: 1, mesesHorizonte: 24 });
    expect(res.plan.length).toBeGreaterThan(0);
    expect(res.totalAhorroIntereses).toBeGreaterThan(0);
  });
});

describe('paridad comparador de frecuencias', () => {
  it('compararFrecuencias idéntico', () => {
    const opts = { horizonte: 24, minAmortizable: 500, tipoAmort: 'plazo', frecuencias: [1, 3, 6] };
    const nuestro = compararFrecuencias(loans, expenses, accounts, config, opts as any);
    const legacy = FM.compararFrecuencias(loans, expenses, accounts, config, opts);
    expect(nuestro).toEqual(legacy);
    expect(nuestro.resultados.length).toBeGreaterThan(0);
  });
});

describe('memoización del extracto (tarea 1.5)', () => {
  it('el memo sirve el mismo extracto sin recalcular ante inputs equivalentes', () => {
    const memo = createStatementMemo();
    const input = { loans, expenses: expenses as any, accounts, config, filtroAccounts: null, nominas: [] };
    const a = memo.statement(input);
    const b = memo.statement({ ...input });
    expect(memo.stats()).toEqual({ hits: 1, misses: 1 });
    expect(b).toBe(a); // misma referencia: no se regeneró
    // Cambiar el plan de amortizaciones invalida la clave
    const conPlan = {
      ...input,
      loans: loans.map((l) => ({ ...l, amortizaciones: [{ fecha: '2027-01-15' as const, cantidad: 1000, tipo: 'plazo' }] })),
    };
    memo.statement(conPlan);
    expect(memo.stats()).toEqual({ hits: 1, misses: 2 });
  });
  it('dentro de una corrida del optimizador las claves son únicas (documenta dónde NO ahorra)', () => {
    const memo = createStatementMemo();
    optimizarAmortizaciones(loans, expenses, accounts, config, { frecuencia: 1, mesesHorizonte: 36 }, memo);
    const { hits, misses } = memo.stats();
    expect(misses).toBeGreaterThan(0);
    expect(hits).toBe(0); // cada (fecha, plan) es distinto — la ganancia viene de resumenPrestamo
  });
  it('el resultado con memo compartido es idéntico al de memos independientes', () => {
    const compartido = createStatementMemo();
    const a = optimizarAmortizaciones(loans, expenses, accounts, config, { frecuencia: 2, mesesHorizonte: 24 }, compartido);
    const b = optimizarAmortizaciones(loans, expenses, accounts, config, { frecuencia: 2, mesesHorizonte: 24 });
    expect(a).toEqual(b);
  });
  it('en el comparador las claves TAMPOCO se repiten: el memo no aporta aciertos aquí', () => {
    // Hallazgo (2026-07-30): se documentó que el memo compartido entre
    // frecuencias ahorraba proyecciones. NO es así, y este test lo fija: cada
    // frecuencia amortiza en fechas distintas (la primera elegible depende de la
    // frecuencia y del filtro `dia15 >= hoy`), así que ninguna clave coincide.
    // La mejora de rendimiento medida (~1,8x) viene ENTERAMENTE de que
    // `capPendienteAntes` use la caché de `resumenPrestamo` en lugar de
    // recalcular la tabla de amortización en cada préstamo × mes.
    // El memo se mantiene porque protege de llamadas repetidas idénticas desde
    // la UI y es la base de la optimización diferida (docs/02, tarea 6.3).
    const memo = createStatementMemo();
    compararFrecuencias(
      loans,
      expenses,
      accounts,
      config,
      { horizonte: 36, minAmortizable: 500, tipoAmort: 'plazo', frecuencias: [1, 2, 3, 6, 12] } as any,
      memo,
    );
    const { hits, misses } = memo.stats();
    expect(misses).toBeGreaterThan(0);
    expect(hits).toBe(0);
  });
});
