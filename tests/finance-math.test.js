// ── Tests de caracterización del núcleo de cálculo (Fase 0, tarea 0.3) ─────────
// Fijan el comportamiento ACTUAL de finance-math/finance-math.js contra el código real.
// Son el contrato de paridad durante el refactor (docs/02-plan-refactor.md):
// si uno de estos tests rompe, el refactor ha cambiado un resultado numérico.
// Los valores esperados se capturaron ejecutando el código en el commit 260955a.
import { describe, it, expect, beforeAll } from 'vitest';

let FM;
beforeAll(async () => {
  await import('../finance-math/finance-math.js');
  FM = globalThis.FinanceMath;
});

describe('préstamos', () => {
  it('cuotaMensual: sistema francés', () => {
    expect(FM.cuotaMensual(100000, 3, 360)).toBeCloseTo(421.60403372945603, 8);
  });
  it('cuotaMensual: tipo 0% divide capital entre meses', () => {
    expect(FM.cuotaMensual(12000, 0, 24)).toBe(500);
  });
  it('calcTAE con y sin comisión de apertura', () => {
    expect(FM.calcTAE(10000, 5, 60, 1)).toBeCloseTo(5.551204658328057, 8);
    expect(FM.calcTAE(10000, 5, 60, 0)).toBeCloseTo(5.116189788173298, 8);
  });
  it('tablaAmortizacion: liquida el capital en el plazo', () => {
    const tabla = FM.tablaAmortizacion(10000, 4, 12, '2026-01-10');
    expect(tabla).toHaveLength(12);
    expect(tabla.reduce((s, r) => s + r.interes, 0)).toBeCloseTo(217.988503466955, 8);
    expect(tabla.reduce((s, r) => s + r.amortizacion, 0)).toBeCloseTo(10000, 6);
    expect(tabla[tabla.length - 1].capitalPendiente).toBe(0);
  });
  it('tablaAmortizacion: amortización parcial tipo plazo reduce intereses y añade comisión', () => {
    const tabla = FM.tablaAmortizacion(10000, 4, 24, '2026-01-10', 1,
      [{ fecha: '2026-06-01', cantidad: 3000, tipo: 'plazo' }], {});
    expect(tabla).toHaveLength(18); // 17 cuotas + 1 fila AMORT
    expect(tabla.filter(r => r.esAmortizacion)).toHaveLength(1);
    expect(tabla.reduce((s, r) => s + r.interes, 0)).toBeCloseTo(259.62871125084985, 8);
    expect(tabla.reduce((s, r) => s + r.comisionAmort, 0)).toBeCloseTo(30, 8);
  });
  it('resumenPrestamo: totales y fecha fin', () => {
    const r = FM.resumenPrestamo({ capital: 150000, tin: 2.5, meses: 300, fechaInicio: '2025-03-01', comisionApertura: 0.5, comisionAmort: 0, amortizaciones: [] });
    expect(r.cuota).toBeCloseTo(672.9251011149062, 8);
    expect(r.totalIntereses).toBeCloseTo(51877.53033448199, 6);
    expect(r.tae).toBeCloseTo(2.574587620055846, 8);
    expect(r.costoTotal).toBeCloseTo(52627.53033448199, 6);
    expect(r.fechaFin).toBe('2050-02-01');
    expect(r.mesesReales).toBe(300);
  });
});

describe('día de pago efectivo', () => {
  it('dia:N con clamp a fin de mes', () => {
    expect(FM.resolverDiaEfectivo(2026, 1, 'dia:31')).toBe('2026-02-28');
    expect(FM.resolverDiaEfectivo(2026, 0, 'dia:31')).toBe('2026-01-31');
  });
  it('dia:ultimo', () => {
    expect(FM.resolverDiaEfectivo(2026, 1, 'dia:ultimo')).toBe('2026-02-28');
  });
  it('nthweekday: primer lunes y último viernes', () => {
    expect(FM.resolverDiaEfectivo(2026, 6, 'nthweekday:1:1')).toBe('2026-07-06');
    expect(FM.resolverDiaEfectivo(2026, 6, 'nthweekday:-1:5')).toBe('2026-07-31');
  });
  it('sin diaPago devuelve null / fecha intacta', () => {
    expect(FM.resolverDiaEfectivo(2026, 3, '')).toBeNull();
    expect(FM.ajustarFechaPago('2026-04-07', '')).toBe('2026-04-07');
  });
});

describe('IRPF y fiscalidad', () => {
  it('calcIRPF: tramos progresivos', () => {
    expect(FM.calcIRPF(30000, [[0, 19], [12450, 24], [20200, 30]])).toBeCloseTo(7165.5, 8);
    expect(FM.calcIRPF(0, [[0, 19], [12450, 24]])).toBe(0);
  });
  it('calcBaseImponibleTrabajo: SS 6,35% + art.19.2 + reducción art.20', () => {
    expect(FM.calcBaseImponibleTrabajo(20000, 0)).toBeCloseTo(10922.5, 8);
    expect(FM.calcBaseImponibleTrabajo(20000, 2400)).toBeCloseTo(7028, 8);
    expect(FM.calcBaseImponibleTrabajo(15000, 0)).toBeCloseTo(4745.5, 8);
  });
  it('calcGananciasCapital: tramos del ahorro y plusvalía no positiva', () => {
    expect(FM.calcGananciasCapital(10000, [[0, 19], [6000, 21], [50000, 23], [200000, 27], [300000, 28]])).toBeCloseTo(1980, 8);
    expect(FM.calcGananciasCapital(-5, null)).toBe(0);
    expect(FM.calcGananciasCapital(0, null)).toBe(0);
  });
  it('calcImpuestoPension: grava solo el beneficio proporcional retirado', () => {
    const acc = { modeloFondo: 'pension', impuestoRetirada: 30, saldoInicial: 0, historicoSaldos: [{ fecha: '2026-01-01', saldo: 12000 }], aportaciones: [{ fecha: '2020-01-01', cantidad: 10000 }] };
    // beneficio 2000/12000; retiro 6000 → beneficio retirado 1000 → 30% = 300
    expect(FM.calcImpuestoPension(acc, 6000)).toBe(300);
  });
});

describe('inflación', () => {
  it('calcFactorInflacion: un año completo ≈ tasa anual (año de 365.25 días)', () => {
    expect(FM.calcFactorInflacion([{ year: 2026, tasa: 2 }], '2026-01-01', '2027-01-01')).toBeCloseTo(1.019986174850818, 10);
  });
  it('calcFactorInflacion: compone tasas de años distintos', () => {
    expect(FM.calcFactorInflacion([{ year: 2026, tasa: 2 }, { year: 2027, tasa: 4 }], '2026-07-01', '2027-07-01')).toBeCloseTo(1.0298485214315334, 10);
  });
  it('calcFactorInflacion: rango invertido o sin periodos → 1', () => {
    expect(FM.calcFactorInflacion([{ year: 2026, tasa: 2 }], '2027-01-01', '2026-01-01')).toBe(1);
    expect(FM.calcFactorInflacion([], '2026-01-01', '2027-01-01')).toBe(1);
  });
  it('calcTipoRealFisher', () => {
    expect(FM.calcTipoRealFisher(3, 2)).toBeCloseTo(0.9803921568627416, 10);
  });
});

describe('proyección de gastos', () => {
  it('mensual: respeta fechaInicio y rango', () => {
    const evs = FM.proyectarGastos([{ _id: 'g1', activo: true, concepto: 'Gym', cuantia: 50, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2026-01-15', tags: ['ocio'] }], '2026-01-01', '2026-06-30');
    expect(evs).toHaveLength(6);
    expect(evs[0].fecha).toBe('2026-01-15');
    expect(evs[5].fecha).toBe('2026-06-15');
  });
  it('mensual cada 2 meses con fechaInicio anterior al rango y fechaFin', () => {
    const evs = FM.proyectarGastos([{ _id: 'g2', activo: true, concepto: 'X', cuantia: 100, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 2, fechaInicio: '2025-11-10', fechaFin: '2026-03-31', tags: [] }], '2026-01-01', '2026-12-31');
    expect(evs.map(e => e.fecha)).toEqual(['2026-01-10', '2026-03-10']);
  });
  it('diaria cada N días alinea el primer evento dentro del rango', () => {
    const evs = FM.proyectarGastos([{ _id: 'g3', activo: true, concepto: 'D', cuantia: 10, tipo: 'gasto', tipoFrecuencia: 'diaria', frecuencia: 10, fechaInicio: '2026-01-01', tags: [] }], '2026-01-15', '2026-02-15');
    expect(evs.map(e => e.fecha)).toEqual(['2026-01-21', '2026-01-31', '2026-02-10']);
  });
  it('extraordinario: solo si cae dentro del rango', () => {
    const gasto = { _id: 'g5', activo: true, concepto: 'E', cuantia: 999, tipo: 'gasto', tipoFrecuencia: 'extraordinario', fechaInicio: '2026-05-01', tags: [] };
    expect(FM.proyectarGastos([gasto], '2026-01-01', '2026-12-31')).toHaveLength(1);
    expect(FM.proyectarGastos([gasto], '2026-06-01', '2026-12-31')).toHaveLength(0);
  });
  it('proyecta la cuantía configurada aunque arrastre un historialPrecios viejo (v7)', () => {
    // Antes de v7 el motor usaba en silencio la media del último año del
    // historial. Ese comportamiento se retiró: la contabilidad real es ahora la
    // fuente del pasado y "sugerir ajuste" quien propone cambiar la cuantía.
    const evs = FM.proyectarGastos([{ _id: 'g4', activo: true, concepto: 'H', cuantia: 80, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2026-01-01', tags: [], historialPrecios: [{ fecha: '2025-06-01', cuantia: 90 }, { fecha: '2025-09-01', cuantia: 110 }] }], '2026-01-01', '2026-01-31');
    expect(evs[0].cuantia).toBe(80);
  });
  it('gasto inactivo no genera eventos', () => {
    expect(FM.proyectarGastos([{ _id: 'g6', activo: false, concepto: 'off', cuantia: 10, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2026-01-01', tags: [] }], '2026-01-01', '2026-12-31')).toHaveLength(0);
  });
});

describe('saldos con ancla saldoInicial/fechaInicialSaldo', () => {
  const acc = { saldoInicial: 1000, fechaInicialSaldo: '2026-01-10', historicoSaldos: [{ fecha: '2025-12-01', saldo: 500 }, { fecha: '2026-02-01', saldo: 1500 }] };
  it('antes del ancla usa historicoSaldos crudo', () => {
    expect(FM.saldoEnFecha(acc, '2025-12-15')).toBe(500);
    expect(FM.saldoEnFecha(acc, '2025-01-01')).toBe(0);
  });
  it('en el ancla y después: el ancla supera a los puntos previos', () => {
    expect(FM.saldoEnFecha(acc, '2026-01-10')).toBe(1000);
    expect(FM.saldoEnFecha(acc, '2026-03-01')).toBe(1500);
  });
  it('saldoRealCuenta: último punto de control', () => {
    expect(FM.saldoRealCuenta(acc)).toBe(1500);
    expect(FM.saldoRealCuenta({ saldoInicial: 42, historicoSaldos: [] })).toBe(42);
  });
});

describe('salud financiera', () => {
  it('métricas derivadas y semáforos con umbrales por defecto', () => {
    const s = FM.calcSaludFinanciera({ ingresos: 3000, cuotas: 600, cuotasHipoteca: 500, gastosBasicos: 900, gastosOtros: 600, amortizaciones: 0 }, {});
    expect(s.tasaAhorro).toBe(30);
    expect(s.dti).toBe(20);
    expect(s.pctNecesidades).toBe(50);
    expect(s.semAhorro).toBe('verde');
    expect(s.semDTI).toBe('verde');
  });
  it('sin ingresos → métricas null y semáforos neutrales', () => {
    const s = FM.calcSaludFinanciera({ ingresos: 0, cuotas: 100, gastosBasicos: 50, gastosOtros: 0, amortizaciones: 0, cuotasHipoteca: 0 }, {});
    expect(s.tasaAhorro).toBeNull();
    expect(s.semAhorro).toBe('neutral');
    expect(s.semDTI).toBe('neutral');
  });
});

describe('generarExtracto (integración)', () => {
  const accounts = [{ _id: 'default', nombre: 'Default', activo: true, esCuentaPrincipal: true, saldoInicial: 5000, fechaInicialSaldo: '2026-01-01', historicoSaldos: [], interes: 0 }];
  const loans = [{ _id: 'l1', nombre: 'Coche', activo: true, capital: 12000, tin: 5, meses: 48, fechaInicio: '2025-06-01', comisionApertura: 0, comisionAmort: 0, amortizaciones: [], cuenta: 'default' }];
  const expenses = [
    { _id: 'e1', activo: true, concepto: 'Alquiler', cuantia: 800, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2025-01-01', tags: ['vivienda'], cuenta: 'default' },
    { _id: 'e2', activo: true, concepto: 'Ingreso extra', cuantia: 1500, tipo: 'ingreso', tipoFrecuencia: 'extraordinario', fechaInicio: '2026-03-10', tags: [], cuenta: 'default' },
  ];
  const nominas = [{ _id: 'n1', nombre: 'Sueldo', activo: true, bruto: 30000, nPagas: 12, irpfModo: 'manual', irpfPct: 15, representacion: 'simplificado', fechaInicio: '2025-01-05', cuenta: 'default', tags: [], grupoNomina: '' }];
  const config = { dashboardStart: '2026-01-01', dashboardEnd: '2026-06-30', fechaReferencia: '2026-01-01', tramos_irpf: [[0, 19], [12450, 24], [20200, 30], [35200, 37], [60000, 45], [300000, 47]] };

  it('compone gastos + préstamos + nóminas con saldo acumulado anclado', () => {
    const ext = FM.generarExtracto(loans, expenses, accounts, config, null, nominas);
    expect(ext).toHaveLength(19); // 6 alquiler + 1 extra + 6 cuotas + 6 nóminas
    const byType = {};
    ext.forEach(e => { byType[e.sourceType] = (byType[e.sourceType] || 0) + 1; });
    expect(byType).toEqual({ expense: 7, loan: 6, nomina: 6 });
    // Primer evento arranca del saldo ancla (5000 − 800 alquiler)
    expect(ext[0]).toMatchObject({ fecha: '2026-01-01', sourceId: 'e1', delta: -800, saldoAcum: 4200 });
    // Nómina neta simplificada: 2500 − SS 6,35% (158,75) − IRPF 15% (375) = 1966,25
    expect(ext.find(e => e.sourceType === 'nomina').cuantia).toBeCloseTo(1966.25, 8);
    expect(ext[ext.length - 1].saldoAcum).toBeCloseTo(11839.390862913446, 6);
  });

  it('invariante: saldo final = saldo ancla + suma de deltas', () => {
    const ext = FM.generarExtracto(loans, expenses, accounts, config, null, nominas);
    const sumDeltas = ext.reduce((s, e) => s + e.delta, 0);
    expect(ext[ext.length - 1].saldoAcum).toBeCloseTo(5000 + sumDeltas, 6);
  });

  it('detectarPuntosCriticos sobre el extracto: sin cruces con estos datos', () => {
    const ext = FM.generarExtracto(loans, expenses, accounts, config, null, nominas);
    expect(FM.detectarPuntosCriticos(ext, 0)).toHaveLength(0);
    // Con colchón de 6000 hay al menos una entrada bajo_colchon y una recuperación
    const pts = FM.detectarPuntosCriticos(ext, 6000);
    expect(pts.some(p => p.tipo === 'bajo_colchon')).toBe(true);
    expect(pts.some(p => p.tipo === 'recuperacion_colchon')).toBe(true);
  });
});

describe('utilidades', () => {
  it('eur formatea en es-ES', () => {
    // Normaliza espacios (Intl usa NBSP/NNBSP segun version de ICU)
    expect(FM.eur(1234.5).replace(/\s/g, '')).toBe('1234,50\u20ac');
    expect(FM.eur(null).replace(/\s/g, '')).toBe('0,00\u20ac');
  });
  it('sumarPorTags ignora transferencias y amortizaciones', () => {
    const m = FM.sumarPorTags([
      { tipo: 'gasto', tags: ['a'], cuantia: 10, sourceType: 'expense' },
      { tipo: 'gasto', tags: ['a'], cuantia: 5, sourceType: 'transfer-out' },
      { tipo: 'gasto', tags: ['a'], cuantia: 7, sourceType: 'loan-amort' },
      { tipo: 'gasto', tags: [], cuantia: 3, sourceType: 'expense' },
    ], 'gasto');
    expect(m.get('a')).toBe(10);
    expect(m.get('sin_tag')).toBeUndefined(); // tags:[] no itera → no cae en sin_tag
  });
});
