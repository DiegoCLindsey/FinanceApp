// Agregados del dashboard (engine/dashboard). Paridad con la aritmética que
// vivía dentro de `render()` en dashboard/dashboard.js, más las correcciones
// de huso horario que allí estaban sin detectar.
import { describe, it, expect, beforeAll } from 'vitest';
import {
  cuentasVisibles,
  gastoPorTagOrdenado,
  idsHipoteca,
  idsPrestamosIniciados,
  interesesPorCuenta,
  mesesDelPeriodo,
  metricasFlujo,
  rangoMes,
  rangoMesDe,
  resumenPrestamosPeriodo,
  sinTransferencias,
  sumarGastosPorTag,
  totalesPeriodo,
  type LoanDashboard,
} from '@/engine/dashboard';
import type { CashEvent } from '@/engine/types';
import type { StatementAccount } from '@/engine/statement';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

const ev = (e: Partial<CashEvent>): CashEvent =>
  ({ fecha: '2026-03-15', concepto: '', cuantia: 0, tipo: 'gasto', tags: [], cuenta: 'a1', ...e }) as CashEvent;

describe('rangos de mes en hora local', () => {
  it('el último día de un mes de 31 es el 31, no el 30', () => {
    // El legacy usaba new Date(y, m+1, 0).toISOString(), que en España resta un día
    expect(rangoMes('2026-01')).toEqual({ desde: '2026-01-01', hasta: '2026-01-31' });
    expect(rangoMes('2026-07')).toEqual({ desde: '2026-07-01', hasta: '2026-07-31' });
  });

  it('acierta con los meses cortos y con febrero bisiesto', () => {
    expect(rangoMes('2026-02').hasta).toBe('2026-02-28');
    expect(rangoMes('2028-02').hasta).toBe('2028-02-29');
    expect(rangoMes('2026-04').hasta).toBe('2026-04-30');
  });

  it('rangoMesDe usa el mes local de la fecha dada', () => {
    expect(rangoMesDe(new Date(2026, 11, 31))).toEqual({ desde: '2026-12-01', hasta: '2026-12-31' });
  });
});

describe('meses del periodo', () => {
  it('coincide con la constante de mes medio del motor legacy', () => {
    const meses = mesesDelPeriodo('2026-01-01', '2026-12-31');
    const esperado = (new Date(2026, 11, 31).getTime() - new Date(2026, 0, 1).getTime()) / (30.44 * 86400000);
    expect(meses).toBeCloseTo(esperado, 10);
  });

  it('nunca baja de un mes, aunque el periodo sea de un día', () => {
    expect(mesesDelPeriodo('2026-01-01', '2026-01-02')).toBe(1);
  });
});

describe('métricas de flujo', () => {
  const expenses = [
    { _id: 'x1' }, // sin clasificar = necesidad
    { _id: 'x2', clasificacion: 'deseo' },
    { _id: 'x3', clasificacion: null }, // excluido a propósito
    { _id: 'x4', clasificacion: 'necesidad' },
  ];
  const eventos = [
    ev({ tipo: 'ingreso', cuantia: 2500, sourceType: 'nomina' }),
    ev({ tipo: 'gasto', cuantia: 900, sourceType: 'expense', sourceId: 'x1' }),
    ev({ tipo: 'gasto', cuantia: 200, sourceType: 'expense', sourceId: 'x2' }),
    ev({ tipo: 'gasto', cuantia: 999, sourceType: 'expense', sourceId: 'x3' }),
    ev({ tipo: 'gasto', cuantia: 100, sourceType: 'expense', sourceId: 'x4' }),
    ev({ tipo: 'gasto', cuantia: 600, sourceType: 'loan', sourceId: 'l1' }),
    ev({ tipo: 'gasto', cuantia: 400, sourceType: 'loan', sourceId: 'l2' }),
    ev({ tipo: 'gasto', cuantia: 5000, sourceType: 'loan-amort', sourceId: 'l1' }),
    ev({ tipo: 'ingreso', cuantia: 12, sourceType: 'account-interest', sourceId: 'a1' }),
  ];
  const deps = { expenses, hipotecaIds: new Set(['l1']) };

  it('separa necesidad de deseo y descarta lo excluido', () => {
    const m = metricasFlujo(eventos, deps);
    expect(m.gastosBasicos).toBe(1000); // 900 + 100
    expect(m.gastosDeseo).toBe(200);
    expect(m.gastosTotales).toBe(2200); // 1000 cuotas + 1000 básicos + 200 deseo
  });

  it('las amortizaciones no cuentan como cuota', () => {
    const m = metricasFlujo(eventos, deps);
    expect(m.cuotas).toBe(1000);
    expect(m.amortizaciones).toBe(5000);
  });

  it('aísla la cuota de la hipoteca por su etiqueta', () => {
    expect(metricasFlujo(eventos, deps).cuotasHipoteca).toBe(600);
  });

  it('un préstamo que aún no ha arrancado no aporta cuota al mes en curso', () => {
    const m = metricasFlujo(eventos, { ...deps, loanIdsIniciados: new Set(['l1']) });
    expect(m.cuotas).toBe(600);
    // La hipoteca sí se sigue midiendo aparte, sobre todos los eventos
    expect(m.cuotasHipoteca).toBe(600);
  });

  it('los intereses de cuenta cuentan como ingreso, además de aparte', () => {
    const m = metricasFlujo(eventos, deps);
    expect(m.intereses).toBe(12);
    expect(m.ingresos).toBe(2512); // nómina + intereses, igual que el legacy
  });

  it('divide entre los meses para dar la media', () => {
    const m = metricasFlujo(eventos, { ...deps, entreMeses: 4 });
    expect(m.ingresos).toBe(2512 / 4);
    expect(m.gastosBasicos).toBe(250);
  });

  it('un divisor de cero o negativo no produce infinitos', () => {
    expect(metricasFlujo(eventos, { ...deps, entreMeses: 0 }).ingresos).toBe(2512);
  });

  it('las transferencias entre cuentas propias se descartan antes de sumar', () => {
    const conTransf = [
      ...eventos,
      ev({ tipo: 'gasto', cuantia: 300, sourceType: 'transfer-out' }),
      ev({ tipo: 'ingreso', cuantia: 300, sourceType: 'transfer-in' }),
    ];
    expect(sinTransferencias(conTransf)).toHaveLength(eventos.length);
    expect(metricasFlujo(sinTransferencias(conTransf), deps)).toEqual(metricasFlujo(eventos, deps));
  });
});

describe('resumen de préstamos del periodo', () => {
  const hipoteca: LoanDashboard = {
    _id: 'l1',
    nombre: 'Hipoteca',
    capital: 120000,
    tin: 3,
    meses: 240,
    fechaInicio: '2024-01-01',
    amortizaciones: [],
    activo: true,
  };

  it('la deuda viva baja a lo largo del periodo', () => {
    const r = resumenPrestamosPeriodo([hipoteca], '2026-01-01', '2026-12-31', 12);
    expect(r.deudaInicio).toBeGreaterThan(r.deudaFin);
    expect(r.deudaFin).toBeGreaterThan(0);
  });

  it('coincide con el capital pendiente que da el motor legacy', () => {
    const { tabla } = FM.resumenPrestamo(hipoteca);
    const filas = tabla.filter((r: any) => !r.esAmortizacion && r.fecha <= '2026-12-31');
    const esperado = filas[filas.length - 1].capitalPendiente;
    expect(resumenPrestamosPeriodo([hipoteca], '2026-01-01', '2026-12-31', 12).deudaFin).toBeCloseTo(esperado, 6);
  });

  it('descarta los simulados, los inactivos y los que empiezan después del periodo', () => {
    const otros: LoanDashboard[] = [
      { ...hipoteca, _id: 'sim', simulacion: true },
      { ...hipoteca, _id: 'off', activo: false },
      { ...hipoteca, _id: 'futuro', fechaInicio: '2030-01-01' },
    ];
    const r = resumenPrestamosPeriodo(otros, '2026-01-01', '2026-12-31', 12);
    expect(r.deudaInicio).toBe(0);
    expect(r.cuotasInicio).toBe(0);
  });

  it('el ahorro de intereses solo cuenta las amortizaciones dentro del periodo', () => {
    const conAmort: LoanDashboard = {
      ...hipoteca,
      amortizaciones: [{ _id: 'a1', fecha: '2026-06-01', cantidad: 10000, tipo: 'plazo' }],
    };
    const dentro = resumenPrestamosPeriodo([conAmort], '2026-01-01', '2026-12-31', 12);
    expect(dentro.ahorroIntereses).toBeGreaterThan(0);
    expect(dentro.ahorroInteresesMes).toBeCloseTo(dentro.ahorroIntereses / 12, 10);

    // La misma amortización, con el periodo mirando a otro año: sin ahorro imputable
    const fuera = resumenPrestamosPeriodo([conAmort], '2027-01-01', '2027-12-31', 12);
    expect(fuera.ahorroIntereses).toBe(0);
  });

  it('anuncia los préstamos que terminan dentro del periodo, y solo esos', () => {
    const corto: LoanDashboard = { ...hipoteca, _id: 'corto', capital: 6000, meses: 12, fechaInicio: '2026-01-01' };
    const r = resumenPrestamosPeriodo([hipoteca, corto], '2026-01-01', '2026-12-31', 12);
    expect(r.finEnPeriodo.map((x) => x.loan._id)).toEqual(['corto']);
  });

  it('respeta mostrarFechaFinEnDashboard: false', () => {
    const corto: LoanDashboard = {
      ...hipoteca,
      _id: 'corto',
      capital: 6000,
      meses: 12,
      fechaInicio: '2026-01-01',
      mostrarFechaFinEnDashboard: false,
    };
    expect(resumenPrestamosPeriodo([corto], '2026-01-01', '2026-12-31', 12).finEnPeriodo).toEqual([]);
  });

  it('las cuotas de inicio y fin salen de la tabla de amortización', () => {
    const r = resumenPrestamosPeriodo([hipoteca], '2026-01-01', '2026-12-31', 12);
    const cuota = FM.cuotaMensual(120000, 3, 240);
    expect(r.cuotasInicio).toBeCloseTo(cuota, 6);
    expect(r.cuotasFin).toBeCloseTo(cuota, 6);
  });

  it('encuentra la cuota del último mes aunque caiga el día 31', () => {
    // Con el fin de mes calculado por toISOString() el día 31 quedaba fuera
    const dia31: LoanDashboard = { ...hipoteca, _id: 'd31', fechaInicio: '2024-01-31', diaPago: 'dia:31' };
    expect(resumenPrestamosPeriodo([dia31], '2026-01-01', '2026-12-31', 12).cuotasFin).toBeGreaterThan(0);
  });
});

describe('gasto por etiqueta con grupos de etiquetas', () => {
  // REGRESIÓN: `_tagMapConGrupos` desapareció del dashboard el 2026-07-30 al
  // retirar el gráfico de velas, dejando sus dos llamadas en pie. Estos tests
  // fijan el comportamiento que se perdió.
  const eventos = [
    ev({ tipo: 'gasto', cuantia: 100, tags: ['ocio', 'variable'] }),
    ev({ tipo: 'gasto', cuantia: 200, tags: ['comida', 'variable'] }),
    ev({ tipo: 'gasto', cuantia: 50, tags: ['variable'] }), // solo etiqueta de grupo
    ev({ tipo: 'gasto', cuantia: 300, tags: ['vivienda'] }), // sin etiqueta de grupo
    ev({ tipo: 'ingreso', cuantia: 2000, tags: ['nomina'] }),
  ];
  const grupo = new Set(['variable']);

  it('sin grupos se comporta como la suma normal por etiqueta', () => {
    const m = sumarGastosPorTag(eventos);
    expect(m.get('ocio')).toBe(100);
    expect(m.get('variable')).toBe(350); // 100 + 200 + 50
    expect(m.has('nomina')).toBe(false); // los ingresos no entran
  });

  it('en desglosado la etiqueta de grupo se retira y el resto se reparte', () => {
    const m = sumarGastosPorTag(eventos, grupo, 'desglosado');
    expect(m.get('ocio')).toBe(100);
    expect(m.get('comida')).toBe(200);
    expect(m.get('vivienda')).toBe(300);
    expect(m.has('variable')).toBe(false);
  });

  it('en desglosado, un gasto cuyas etiquetas son todas de grupo no cuenta', () => {
    const total = [...sumarGastosPorTag(eventos, grupo, 'desglosado').values()].reduce((s, v) => s + v, 0);
    expect(total).toBe(600); // los 50 del gasto solo-grupo se quedan fuera
  });

  it('en porgrupos el gasto cuenta bajo su grupo, y los demás bajo los suyos', () => {
    const m = sumarGastosPorTag(eventos, grupo, 'porgrupos');
    expect(m.get('variable')).toBe(350); // 100 + 200 + 50
    expect(m.get('vivienda')).toBe(300); // sin grupo: bajo su etiqueta
    expect(m.has('ocio')).toBe(false);
  });

  it('ordena de mayor a menor y respeta el filtro de etiquetas activas', () => {
    const filas = gastoPorTagOrdenado(eventos, { grupoTags: grupo, modo: 'desglosado' });
    expect(filas.map((f) => f.tag)).toEqual(['vivienda', 'comida', 'ocio']);

    const soloOcio = gastoPorTagOrdenado(eventos, { grupoTags: grupo, activos: new Set(['ocio']) });
    expect(soloOcio).toEqual([{ tag: 'ocio', total: 100 }]);
  });

  it('divide entre los meses para dar la media mensual', () => {
    const filas = gastoPorTagOrdenado(eventos, { grupoTags: grupo, entreMeses: 4 });
    expect(filas[0]).toEqual({ tag: 'vivienda', total: 75 });
  });
});

describe('totales y cuentas visibles', () => {
  const cuenta = (extra: Partial<StatementAccount>): StatementAccount =>
    ({
      _id: 'a1',
      nombre: 'Principal',
      activo: true,
      saldoInicial: 1000,
      fechaInicialSaldo: '2026-01-01',
      historicoSaldos: [],
      interes: 0,
      ...extra,
    }) as StatementAccount;

  it('el saldo base suma el saldo real de las cuentas visibles', () => {
    const cuentas = [cuenta({}), cuenta({ _id: 'a2', saldoInicial: 500 })];
    expect(totalesPeriodo([], cuentas).saldoBase).toBe(1500);
  });

  it('sin extracto el saldo final es el saldo base', () => {
    const t = totalesPeriodo([], [cuenta({})]);
    expect(t.saldoFinal).toBe(t.saldoBase);
  });

  it('con extracto el saldo final es el último acumulado', () => {
    const eventos = [ev({ saldoAcum: 900 }), ev({ fecha: '2026-04-15', saldoAcum: 800 })];
    expect(totalesPeriodo(eventos, [cuenta({})]).saldoFinal).toBe(800);
  });

  it('suma gastos e ingresos en positivo y recoge las etiquetas', () => {
    const eventos = [
      ev({ tipo: 'gasto', cuantia: 900, tags: ['vivienda'] }),
      ev({ tipo: 'ingreso', cuantia: 2500, tags: ['nomina', 'vivienda'] }),
    ];
    const t = totalesPeriodo(eventos, []);
    expect(t.totalGastos).toBe(900);
    expect(t.totalIngresos).toBe(2500);
    expect(t.tags.sort()).toEqual(['nomina', 'vivienda']);
  });

  it('el filtro de cuentas de la barra superior recorta las visibles', () => {
    const cuentas = [cuenta({}), cuenta({ _id: 'a2' }), cuenta({ _id: 'off', activo: false })];
    expect(cuentasVisibles(cuentas, null).map((a) => a._id)).toEqual(['a1', 'a2']);
    expect(cuentasVisibles(cuentas, []).map((a) => a._id)).toEqual(['a1', 'a2']);
    expect(cuentasVisibles(cuentas, ['a2']).map((a) => a._id)).toEqual(['a2']);
  });
});

describe('intereses por cuenta', () => {
  const cuentas = [
    { _id: 'a1', nombre: 'ING', activo: true, interes: 2.5 },
    { _id: 'a2', nombre: 'Ahorro', activo: true, interes: 1 },
    { _id: 'a3', nombre: 'Sin remunerar', activo: true, interes: 0 },
  ] as StatementAccount[];

  it('ordena de mayor a menor y descarta las que no generan nada', () => {
    const eventos = [
      ev({ sourceType: 'account-interest', sourceId: 'a1', cuantia: 30, tipo: 'ingreso' }),
      ev({ sourceType: 'account-interest', sourceId: 'a2', cuantia: 80, tipo: 'ingreso' }),
    ];
    expect(interesesPorCuenta(eventos, cuentas).map((x) => x.nombre)).toEqual(['Ahorro', 'ING']);
  });

  it('sin eventos no devuelve ninguna cuenta', () => {
    expect(interesesPorCuenta([], cuentas)).toEqual([]);
  });
});

describe('conjuntos auxiliares', () => {
  const loans: LoanDashboard[] = [
    { _id: 'l1', nombre: 'Hipoteca', capital: 1, tin: 1, meses: 1, fechaInicio: '2020-01-01', amortizaciones: [], tags: ['hipoteca'] },
    { _id: 'l2', nombre: 'Coche', capital: 1, tin: 1, meses: 1, fechaInicio: '2030-01-01', amortizaciones: [], tags: [] },
  ];

  it('identifica la hipoteca por la etiqueta configurada', () => {
    expect([...idsHipoteca(loans)]).toEqual(['l1']);
    expect([...idsHipoteca(loans, 'vivienda')]).toEqual([]);
  });

  it('un préstamo que empieza en el futuro no está iniciado', () => {
    expect([...idsPrestamosIniciados(loans, '2026-07-31')]).toEqual(['l1']);
  });
});
