// ── Tests de paridad legacy ↔ core nuevo (Fase 1, tareas 1.2/1.3) ─────────────
// Ejecutan el motor legacy (finance-math.js) y el core TypeScript sobre las
// mismas entradas y exigen igualdad EXACTA (tolerancia 0 salvo donde se indica).
// Si uno de estos tests rompe, las dos implementaciones han divergido.
import { describe, it, expect, beforeAll } from 'vitest';
import * as core from '@/core';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

describe('paridad préstamos', () => {
  const casos = [
    { capital: 100000, tin: 3, meses: 360 },
    { capital: 12000, tin: 0, meses: 24 },
    { capital: 8000, tin: 7.5, meses: 60 },
    { capital: 250000, tin: 1.9, meses: 300 },
    { capital: 500, tin: 12, meses: 6 },
  ];
  it('cuotaMensual idéntica', () => {
    for (const c of casos) {
      expect(core.cuotaMensual(c.capital, c.tin, c.meses)).toBe(FM.cuotaMensual(c.capital, c.tin, c.meses));
    }
  });
  it('calcTAE idéntica', () => {
    for (const c of casos.filter((c) => c.tin > 0)) {
      for (const com of [0, 0.5, 1, 2]) {
        expect(core.calcTAE(c.capital, c.tin, c.meses, com)).toBe(FM.calcTAE(c.capital, c.tin, c.meses, com));
      }
    }
  });
  it('tablaAmortizacion idéntica (sin y con amortizaciones parciales, plazo y cuota)', () => {
    const amortsSets: core.Amortizacion[][] = [
      [],
      [{ fecha: '2026-06-01', cantidad: 3000, tipo: 'plazo' }],
      [{ fecha: '2026-06-01', cantidad: 2000, tipo: 'cuota' }, { fecha: '2027-01-15', cantidad: 1500, tipo: 'plazo' }],
    ];
    for (const amorts of amortsSets) {
      for (const diaPago of ['', 'dia:5', 'dia:ultimo', 'nthweekday:1:1']) {
        const a = core.tablaAmortizacion(20000, 4.2, 48, '2026-01-10', 1, amorts, { diaPago });
        const b = FM.tablaAmortizacion(20000, 4.2, 48, '2026-01-10', 1, amorts, { diaPago });
        expect(a).toEqual(b);
      }
    }
  });
  it('resumenPrestamo idéntico', () => {
    const loan = { capital: 150000, tin: 2.5, meses: 300, fechaInicio: '2025-03-01', comisionApertura: 0.5, comisionAmort: 0.25, amortizaciones: [{ fecha: '2026-09-01', cantidad: 5000, tipo: 'plazo' as const }] };
    expect(core.resumenPrestamo(loan)).toEqual(FM.resumenPrestamo(loan));
  });
});

describe('paridad día efectivo', () => {
  it('resolverDiaEfectivo idéntico en un grid amplio', () => {
    const specs = ['', 'dia:1', 'dia:15', 'dia:28', 'dia:29', 'dia:30', 'dia:31', 'dia:ultimo',
      'nthweekday:1:1', 'nthweekday:2:3', 'nthweekday:5:5', 'nthweekday:-1:0', 'nthweekday:-1:5', 'garbage'];
    for (let year = 2024; year <= 2028; year++) {
      for (let m = 0; m < 12; m++) {
        for (const spec of specs) {
          expect(core.resolverDiaEfectivo(year, m, spec)).toBe(FM.resolverDiaEfectivo(year, m, spec));
        }
      }
    }
  });
  it('ajustarFechaPago y labelDiaPago idénticos', () => {
    for (const spec of ['', 'dia:31', 'dia:ultimo', 'nthweekday:-1:5', 'nthweekday:3:2']) {
      expect(core.ajustarFechaPago('2026-02-10', spec)).toBe(FM.ajustarFechaPago('2026-02-10', spec));
      expect(core.labelDiaPago(spec)).toBe(FM.labelDiaPago(spec));
    }
  });
});

describe('paridad fiscalidad', () => {
  it('calcIRPF y calcBaseImponibleTrabajo idénticos en rango 0–400k', () => {
    for (let base = 0; base <= 400000; base += 3777) {
      expect(core.calcIRPF(base, core.TRAMOS_IRPF_DEFAULT)).toBe(FM.calcIRPF(base, core.TRAMOS_IRPF_DEFAULT));
      for (const flex of [0, 1200, 3600]) {
        expect(core.calcBaseImponibleTrabajo(base, flex)).toBe(FM.calcBaseImponibleTrabajo(base, flex));
      }
    }
  });
  it('retencionMensual idéntica', () => {
    for (const s of [0, 14000, 22000, 30000, 65000, 120000]) {
      expect(core.retencionMensual(s, core.TRAMOS_IRPF_DEFAULT)).toBe(FM.retencionMensual(s, core.TRAMOS_IRPF_DEFAULT));
    }
  });
  it('calcGananciasCapital idéntica en rango −10k–500k', () => {
    for (let p = -10000; p <= 500000; p += 7919) {
      expect(core.calcGananciasCapital(p, null)).toBe(FM.calcGananciasCapital(p, null));
      expect(core.calcGananciasCapital(p, core.TRAMOS_AHORRO_DEFAULT)).toBe(FM.calcGananciasCapital(p, core.TRAMOS_AHORRO_DEFAULT));
    }
  });
});

describe('paridad inflación', () => {
  const periodos = [
    { year: 2024, tasa: 3.2 },
    { year: 2025, tasa: 2.8 },
    { year: 2026, tasa: 2.0 },
    { year: 2028, tasa: 4.5 },
  ];
  const rangos: [string, string][] = [
    ['2024-01-01', '2027-01-01'],
    ['2025-06-15', '2026-06-15'],
    ['2023-01-01', '2030-12-31'],
    ['2026-03-01', '2026-03-02'],
    ['2027-01-01', '2026-01-01'], // invertido
  ];
  it('calcFactorInflacion idéntica', () => {
    for (const [f, t] of rangos) {
      expect(core.calcFactorInflacion(periodos, f, t)).toBe(FM.calcFactorInflacion(periodos, f, t));
      expect(core.calcFactorInflacion([], f, t)).toBe(FM.calcFactorInflacion([], f, t));
    }
  });
  it('calcInflacionMediaAnual y ajustarPrecioReal idénticas', () => {
    for (const [f, t] of rangos) {
      expect(core.calcInflacionMediaAnual(periodos, f, t, 1.5)).toBe(FM.calcInflacionMediaAnual(periodos, f, t, 1.5));
      expect(core.ajustarPrecioReal(1000, periodos, f, t)).toBe(FM.ajustarPrecioReal(1000, periodos, f, t));
    }
  });
  it('calcTipoRealFisher idéntica', () => {
    for (const [nom, inf] of [[3, 2], [0, 5], [7, -1], [2, 2]]) {
      expect(core.calcTipoRealFisher(nom, inf)).toBe(FM.calcTipoRealFisher(nom, inf));
    }
  });
});

describe('paridad salud financiera', () => {
  it('calcSaludFinanciera idéntica en varios escenarios y configs', () => {
    const mets = [
      { ingresos: 3000, cuotas: 600, cuotasHipoteca: 500, gastosBasicos: 900, gastosOtros: 600, amortizaciones: 0 },
      { ingresos: 0, cuotas: 100, cuotasHipoteca: 0, gastosBasicos: 50, gastosOtros: 0, amortizaciones: 0 },
      { ingresos: 2000, cuotas: 900, cuotasHipoteca: 700, gastosBasicos: 800, gastosOtros: 500, amortizaciones: 200 },
    ];
    const configs = [
      {},
      { saludExcluirHipoteca: true },
      { saludUmbralAhorroVerde: 25, saludUmbralAhorroAmarillo: 5, saludUmbralDTIVerde: 20, saludUmbralDTIAmarillo: 35, saludRegla: [55, 25, 20] },
    ];
    for (const met of mets) {
      for (const cfg of configs) {
        expect(core.calcSaludFinanciera(met, cfg)).toEqual(FM.calcSaludFinanciera(met, cfg));
      }
    }
  });
});

describe('paridad formato', () => {
  it('formatEUR/formatPct idénticos a eur/pct', () => {
    for (const n of [0, 1234.5, -987.654, null, undefined]) {
      expect(core.formatEUR(n)).toBe(FM.eur(n));
      expect(core.formatPct(n)).toBe(FM.pct(n));
    }
  });
});
