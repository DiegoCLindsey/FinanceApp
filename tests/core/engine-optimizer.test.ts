// Paridad legacy ↔ engine: optimizador de amortizaciones y comparador de
// frecuencias (Fase 1, tarea 1.5), incluida la mejora de rendimiento.
import { describe, it, expect, beforeAll } from 'vitest';
import { optimizarAmortizaciones, compararFrecuencias, createStatementMemo } from '@/engine/optimizer';
import type { StatementAccount } from '@/engine/statement';
import type { LoanItem } from '@/engine/providers/loans';
import type { BasicoExpense, MargenSeguridad } from '@/engine/margins';
import { FeatureDeshabilitadaError, instalarConsultaFlags } from '@/flags/guard';
import { resumenPrestamo } from '@/core/loan';

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
  // Hallazgo (2026-07-30, corregido el 2026-08-06): se documentó que el memo
  // compartido entre frecuencias ahorraba proyecciones. Casi nunca: cada
  // frecuencia amortiza en fechas distintas, así que las claves solo coinciden
  // en el primer mes, y solo si el día 15 todavía no ha pasado (el optimizador
  // descarta las fechas con `dia15 < hoy`). La mejora de rendimiento medida
  // (~1,8x) viene ENTERAMENTE de que `capPendienteAntes` use la caché de
  // `resumenPrestamo` en lugar de recalcular la tabla en cada préstamo × mes.
  //
  // La versión anterior de este test no inyectaba `hoy` y afirmaba `hits === 0`:
  // pasaba solo pasado el día 15 de cada mes y fallaba durante la primera
  // quincena. Es el mismo tropiezo que ya se corrigió en accounting-view.
  const comparar = (hoy: Date) => {
    const memo = createStatementMemo();
    compararFrecuencias(
      loans,
      expenses,
      accounts,
      config,
      { horizonte: 36, minAmortizable: 500, tipoAmort: 'plazo', frecuencias: [1, 2, 3, 6, 12], hoy } as any,
      memo,
    );
    return memo.stats();
  };

  it('pasado el día 15 ninguna clave del comparador se repite: cero aciertos', () => {
    const { hits, misses } = comparar(new Date(2026, 6, 20));
    expect(misses).toBeGreaterThan(0);
    expect(hits).toBe(0);
  });

  it('antes del día 15 solo coincide esa primera fecha, compartida por las cinco frecuencias', () => {
    const { hits, misses } = comparar(new Date(2026, 6, 6));
    expect(misses).toBeGreaterThan(0);
    // Cuatro frecuencias reaprovechan lo que proyectó la primera
    expect(hits).toBe(4);
  });
});

describe('el optimizador respeta su feature flag', () => {
  // Ocultar el botón no impide llamar a la función: basta un DOM viejo en
  // pantalla o una llamada desde la consola. Y devolver un plan cuando la
  // funcionalidad está apagada es peor que no responder, porque el usuario no
  // tiene forma de saber que esos números no valen.
  it('lanza si "optimizador" está desactivado', () => {
    const quitar = instalarConsultaFlags((id) => id !== 'optimizador');
    try {
      expect(() => optimizarAmortizaciones(loans, expenses, accounts, config, { mesesHorizonte: 12 })).toThrow(FeatureDeshabilitadaError);
    } finally {
      quitar();
    }
  });

  it('lanza si "comparador-frecuencias" está desactivado', () => {
    const quitar = instalarConsultaFlags((id) => id !== 'comparador-frecuencias');
    try {
      expect(() => compararFrecuencias(loans, expenses, accounts, config, { horizonte: 12 })).toThrow(FeatureDeshabilitadaError);
    } finally {
      quitar();
    }
  });

  it('el comparador también cae si lo que falta es el optimizador del que depende', () => {
    const quitar = instalarConsultaFlags((id) => id !== 'optimizador');
    try {
      expect(() => compararFrecuencias(loans, expenses, accounts, config, { horizonte: 12 })).toThrow(FeatureDeshabilitadaError);
    } finally {
      quitar();
    }
  });

  it('con los flags puestos calcula con normalidad', () => {
    const quitar = instalarConsultaFlags(() => true);
    try {
      expect(() => optimizarAmortizaciones(loans, expenses, accounts, config, { mesesHorizonte: 12 })).not.toThrow();
    } finally {
      quitar();
    }
  });
});

describe('capital pendiente de un préstamo cancelado por una amortización', () => {
  // Un préstamo puede acabar de dos formas: agotando su cuadro, o cancelado por
  // una amortización. En el segundo caso la ÚLTIMA FILA ORDINARIA conserva el
  // capital de ANTES de esa amortización, y la fila que lo deja a cero es la de
  // amortización. Mirando solo las ordinarias, el capital vivo se quedaba
  // congelado en ese valor fantasma para siempre.
  //
  // Con datos reales del usuario eso producía 59 amortizaciones planificadas por
  // 1.185.782 € sobre un préstamo que no debía nada, con "Cap. antes" idéntico
  // mes tras mes y un ahorro de intereses de 0,00 € — la única cifra honesta,
  // porque efectivamente no se ahorraba nada.
  const cancelado: LoanItem = {
    _id: 'lc',
    nombre: 'Coche (cancelado antes de tiempo)',
    capital: 30000,
    tin: 9.82,
    meses: 48,
    fechaInicio: '2023-01-10',
    activo: true,
    simulacion: false,
    comisionAmort: 1,
    cuenta: 'a1',
    tags: [],
    amortizaciones: [{ _id: 'm1', fecha: '2024-06-20', cantidad: 25000, tipo: 'plazo' }],
  } as LoanItem;

  const conSaldoDeSobra: StatementAccount[] = [
    {
      _id: 'a1',
      nombre: 'Corriente',
      activo: true,
      esCuentaPrincipal: true,
      saldoInicial: 600000,
      fechaInicialSaldo: '2026-01-01',
      historicoSaldos: [],
      aportaciones: [],
      modeloFondo: 'cuenta',
      interes: 0,
    } as unknown as StatementAccount,
  ];

  const cfg = { ...config, dashboardStart: '2026-08-01', margenesSeguridad: [] };
  const opciones = { mesesHorizonte: 60, minAmortizable: 500, tipoAmort: 'plazo', hoy: new Date(2026, 7, 19) };

  it('la tabla deja el préstamo a cero, aunque la última cuota ordinaria no lo diga', () => {
    const { tabla } = resumenPrestamo(cancelado);
    const ordinarias = tabla.filter((r) => !r.esAmortizacion);
    expect(ordinarias[ordinarias.length - 1].capitalPendiente).toBeGreaterThan(20000);
    expect(tabla[tabla.length - 1].esAmortizacion).toBe(true);
    expect(tabla[tabla.length - 1].capitalPendiente).toBeLessThan(0.01);
  });

  it('no planifica ni una amortización sobre un préstamo ya pagado', () => {
    const quitar = instalarConsultaFlags(() => true);
    try {
      const r = optimizarAmortizaciones([cancelado], [], conSaldoDeSobra, cfg, opciones);
      expect(r.plan).toHaveLength(0);
      expect(r.totalAmortizado).toBe(0);
      expect(r.resumenPorLoan).toHaveLength(0);
    } finally {
      quitar();
    }
  });

  it('sobre un préstamo vivo sí planifica, y el capital baja de una a otra', () => {
    // La contraprueba: el arreglo no puede haber dejado el optimizador mudo.
    const vivo = { ...cancelado, _id: 'lv', capital: 120000, meses: 240, fechaInicio: '2024-01-10', amortizaciones: [] } as LoanItem;
    const quitar = instalarConsultaFlags(() => true);
    try {
      const r = optimizarAmortizaciones([vivo], [], conSaldoDeSobra, cfg, { ...opciones, mesesHorizonte: 6 });
      expect(r.plan.length).toBeGreaterThan(0);
      expect(r.totalAhorroIntereses).toBeGreaterThan(0);
      // Lo que el pantallazo enseñaba clavado: cada amortización parte de menos
      // capital que la anterior.
      const capitales = r.plan.map((p) => p.capitalAntes);
      for (let i = 1; i < capitales.length; i++) {
        expect(capitales[i]).toBeLessThan(capitales[i - 1]);
      }
    } finally {
      quitar();
    }
  });
});
