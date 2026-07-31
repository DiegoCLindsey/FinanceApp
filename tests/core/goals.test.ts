// Objetivos de ahorro: saldo del objetivo y proyección de cumplimiento
// (core/goals). Cubre las dos correcciones respecto al legacy documentadas en
// el módulo: el fin de mes en hora local y el extracto generado una sola vez.
import { describe, it, expect, vi } from 'vitest';
import { cuentasDelObjetivo, proyectarFechaCumplimiento, saldoParaObjetivo, type CuentaObjetivo, type EventoSaldo } from '@/core/goals';

const cuenta = (extra: Partial<CuentaObjetivo> = {}): CuentaObjetivo => ({
  _id: 'a1',
  activo: true,
  simulacion: false,
  saldoInicial: 1000,
  fechaInicialSaldo: '2026-01-01',
  historicoSaldos: [],
  ...extra,
});

const sinExtracto = { extractoCuenta: () => [] as EventoSaldo[], colchonEnFecha: () => 0, hoy: new Date(2026, 6, 15) };

describe('cuentas del objetivo', () => {
  const cuentas = [
    cuenta({ _id: 'a1' }),
    cuenta({ _id: 'a2' }),
    cuenta({ _id: 'inactiva', activo: false }),
    cuenta({ _id: 'sim', simulacion: true }),
  ];

  it('sin cuentaIds usa todas las activas y descarta simulaciones e inactivas', () => {
    expect(cuentasDelObjetivo({}, cuentas).map((c) => c._id)).toEqual(['a1', 'a2']);
    expect(cuentasDelObjetivo({ cuentaIds: [] }, cuentas).map((c) => c._id)).toEqual(['a1', 'a2']);
  });

  it('con cuentaIds usa exactamente esas, aunque estén inactivas o sean simuladas', () => {
    expect(cuentasDelObjetivo({ cuentaIds: ['a2', 'sim'] }, cuentas).map((c) => c._id)).toEqual(['a2', 'sim']);
  });
});

describe('saldo para el objetivo', () => {
  it('suma el último punto de control de cada cuenta, no el saldo inicial', () => {
    const cuentas = [
      cuenta({ _id: 'a1', saldoInicial: 1000, historicoSaldos: [{ fecha: '2026-05-01', saldo: 2500 }] }),
      cuenta({ _id: 'a2', saldoInicial: 300 }),
    ];
    expect(saldoParaObjetivo({}, cuentas)).toBe(2800);
  });

  it('descuenta el colchón por defecto y nunca baja de cero', () => {
    const cuentas = [cuenta({ saldoInicial: 1000 })];
    expect(saldoParaObjetivo({}, cuentas, 400)).toBe(600);
    expect(saldoParaObjetivo({}, cuentas, 5000)).toBe(0);
  });

  it('con usarColchon a false lo ignora', () => {
    expect(saldoParaObjetivo({ usarColchon: false }, [cuenta({ saldoInicial: 1000 })], 400)).toBe(1000);
  });
});

describe('proyección de la fecha de cumplimiento', () => {
  it('devuelve null sin importe objetivo o sin cuentas', () => {
    expect(proyectarFechaCumplimiento({}, [cuenta()], sinExtracto)).toBeNull();
    expect(proyectarFechaCumplimiento({ targetAmount: 0 }, [cuenta()], sinExtracto)).toBeNull();
    expect(proyectarFechaCumplimiento({ targetAmount: 100 }, [], sinExtracto)).toBeNull();
  });

  it('encuentra el primer mes en que el saldo proyectado alcanza la meta', () => {
    // 500 €/mes a partir de agosto, arrancando de 1.000 €
    const eventos: EventoSaldo[] = [
      { fecha: '2026-08-31', saldoAcum: 1500 },
      { fecha: '2026-09-30', saldoAcum: 2000 },
      { fecha: '2026-10-31', saldoAcum: 2500 },
    ];
    const deps = { ...sinExtracto, extractoCuenta: () => eventos };
    expect(proyectarFechaCumplimiento({ targetAmount: 2000 }, [cuenta()], deps)).toBe('2026-09');
    expect(proyectarFechaCumplimiento({ targetAmount: 2501 }, [cuenta()], deps)).toBeNull();
  });

  it('evalúa el saldo al ÚLTIMO día del mes, no al penúltimo', () => {
    // El legacy calculaba el fin de mes con toISOString() sobre medianoche
    // local, que en España devuelve el día anterior: este evento del día 31 se
    // le quedaba fuera y la meta parecía alcanzarse un mes más tarde.
    const deps = { ...sinExtracto, extractoCuenta: () => [{ fecha: '2026-08-31', saldoAcum: 5000 }] };
    expect(proyectarFechaCumplimiento({ targetAmount: 5000 }, [cuenta()], deps)).toBe('2026-08');
  });

  it('descuenta el colchón vigente en cada mes', () => {
    const deps = {
      ...sinExtracto,
      extractoCuenta: () => [{ fecha: '2026-08-31', saldoAcum: 5000 }],
      colchonEnFecha: (f: string) => (f < '2026-09-01' ? 3000 : 0),
    };
    expect(proyectarFechaCumplimiento({ targetAmount: 5000 }, [cuenta()], deps)).toBe('2026-09');
    expect(proyectarFechaCumplimiento({ targetAmount: 5000, usarColchon: false }, [cuenta()], deps)).toBe('2026-08');
  });

  it('suma varias cuentas y pide el extracto de cada una una sola vez', () => {
    const extractos: Record<string, EventoSaldo[]> = {
      a1: [{ fecha: '2026-08-31', saldoAcum: 3000 }],
      a2: [{ fecha: '2026-09-30', saldoAcum: 2000 }],
    };
    const extractoCuenta = vi.fn((acc: CuentaObjetivo) => extractos[acc._id] ?? []);
    const cuentas = [cuenta({ _id: 'a1' }), cuenta({ _id: 'a2' })];

    expect(proyectarFechaCumplimiento({ targetAmount: 5000 }, cuentas, { ...sinExtracto, extractoCuenta })).toBe('2026-09');
    // Dos cuentas, dos llamadas: no una por cada uno de los 120 meses
    expect(extractoCuenta).toHaveBeenCalledTimes(2);
  });

  it('respeta el horizonte configurado', () => {
    const deps = { ...sinExtracto, extractoCuenta: () => [{ fecha: '2027-01-31', saldoAcum: 9000 }], horizonteMeses: 3 };
    expect(proyectarFechaCumplimiento({ targetAmount: 9000 }, [cuenta()], deps)).toBeNull();
    expect(proyectarFechaCumplimiento({ targetAmount: 9000 }, [cuenta()], { ...deps, horizonteMeses: 12 })).toBe('2027-01');
  });

  it('sin eventos parte del saldo real de la cuenta', () => {
    const cuentas = [cuenta({ saldoInicial: 4000, historicoSaldos: [{ fecha: '2026-06-01', saldo: 7000 }] })];
    expect(proyectarFechaCumplimiento({ targetAmount: 7000 }, cuentas, sinExtracto)).toBe('2026-08');
  });
});
