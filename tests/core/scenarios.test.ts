// Escenarios: filtro por pertenencia y serie mensual de saldo (core/scenarios).
// Fija las dos correcciones respecto a la vista legacy.
import { describe, it, expect } from 'vitest';
import {
  filtrarPorEscenario,
  saldoEnFechaExtracto,
  serieMensual,
  visibleEnEscenario,
  type Asignable,
  type EntradaFiltro,
  type EventoExtracto,
} from '@/core/scenarios';

describe('pertenencia a un escenario', () => {
  it('lo que no tiene escenarios es de la base y sale siempre', () => {
    expect(visibleEnEscenario({}, null)).toBe(true);
    expect(visibleEnEscenario({ escenarioIds: [] }, 'e1')).toBe(true);
  });

  it('lo asignado solo sale con su escenario activo', () => {
    const item = { escenarioIds: ['e1', 'e2'] };
    expect(visibleEnEscenario(item, null)).toBe(false);
    expect(visibleEnEscenario(item, 'e1')).toBe(true);
    expect(visibleEnEscenario(item, 'e3')).toBe(false);
  });
});

describe('filtro de colecciones', () => {
  interface Item extends Asignable {
    _id: string;
  }
  interface Prestamo extends Item {
    amortizaciones: Item[];
  }
  const entrada: EntradaFiltro<Prestamo, Item, Item, Item> = {
    loans: [
      { _id: 'l1', amortizaciones: [{ _id: 'a1' }, { _id: 'a2', escenarioIds: ['e1'] }] },
      { _id: 'l2', escenarioIds: ['e1'], amortizaciones: [] },
    ],
    expenses: [{ _id: 'x1' }, { _id: 'x2', escenarioIds: ['e2'] }],
    nominas: [{ _id: 'n1' }],
    accounts: [{ _id: 'c1' }, { _id: 'c2', escenarioIds: ['e1'] }],
  };

  it('en la base solo quedan los elementos sin asignar', () => {
    const r = filtrarPorEscenario(entrada, null);
    expect(r.loans.map((l) => l._id)).toEqual(['l1']);
    expect(r.expenses.map((e) => e._id)).toEqual(['x1']);
    expect(r.accounts.map((a) => a._id)).toEqual(['c1']);
  });

  it('una amortización puede pertenecer a un escenario aunque su préstamo sea de base', () => {
    // Es el caso de uso principal: "¿y si amortizo agresivamente?"
    expect(filtrarPorEscenario(entrada, null).loans[0].amortizaciones.map((a) => a._id)).toEqual(['a1']);
    expect(filtrarPorEscenario(entrada, 'e1').loans[0].amortizaciones.map((a) => a._id)).toEqual(['a1', 'a2']);
  });

  it('no muta la entrada', () => {
    filtrarPorEscenario(entrada, 'e1');
    expect(entrada.loans[0].amortizaciones).toHaveLength(2);
  });
});

describe('serie mensual de saldo', () => {
  const eventos: EventoExtracto[] = [
    { fecha: '2026-01-15', saldoAcum: 24100, delta: -900 },
    { fecha: '2026-01-28', saldoAcum: 25600, delta: 1500 },
    { fecha: '2026-03-15', saldoAcum: 24700, delta: -900 },
  ];

  it('sin eventos no hay serie', () => {
    expect(serieMensual([], '2026-01-01', '2026-03-31')).toEqual([]);
  });

  it('parte del saldo real, no de cero: el legacy sumaba deltas desde el origen', () => {
    // Antes del primer apunte el saldo es 24.100 + 900 = 25.000
    const serie = serieMensual(eventos, '2026-01-01', '2026-03-31');
    expect(serie[0].y).toBe(25600); // cierre de enero
    expect(serie.map((p) => p.y)).toEqual([25600, 25600, 24700]);
  });

  it('etiqueta cada punto con SU mes, sin desplazarlo por el huso horario', () => {
    // El legacy leía la clave con toISOString() sobre medianoche local, que en
    // España devuelve el mes anterior para el día 1.
    const serie = serieMensual(eventos, '2026-01-01', '2026-03-31');
    expect(serie.map((p) => p.mes)).toEqual(['2026-01', '2026-02', '2026-03']);
    // Y la x del primer punto cae en enero, no en diciembre
    expect(new Date(serie[0].x).getMonth()).toBe(0);
  });

  it('arrastra el último saldo conocido en los meses sin movimientos', () => {
    const serie = serieMensual(eventos, '2026-01-01', '2026-06-30');
    expect(serie).toHaveLength(6);
    expect(serie.slice(2).every((p) => p.y === 24700)).toBe(true);
  });

  it('los meses previos al primer apunte llevan el saldo de partida', () => {
    const serie = serieMensual(eventos, '2025-11-01', '2026-01-31');
    expect(serie.map((p) => p.mes)).toEqual(['2025-11', '2025-12', '2026-01']);
    expect(serie[0].y).toBe(25000);
    expect(serie[1].y).toBe(25000);
  });

  it('cruza el cambio de año sin saltarse diciembre', () => {
    const finDeAño: EventoExtracto[] = [
      { fecha: '2026-11-10', saldoAcum: 100, delta: 100 },
      { fecha: '2027-01-10', saldoAcum: 300, delta: 200 },
    ];
    expect(serieMensual(finDeAño, '2026-11-01', '2027-01-31').map((p) => p.mes)).toEqual(['2026-11', '2026-12', '2027-01']);
  });

  it('un rango invertido no produce serie', () => {
    expect(serieMensual(eventos, '2026-06-01', '2026-01-31')).toEqual([]);
  });
});

describe('saldo en una fecha del extracto', () => {
  const eventos: EventoExtracto[] = [
    { fecha: '2026-01-15', saldoAcum: 100 },
    { fecha: '2026-02-15', saldoAcum: 200 },
  ];

  it('toma el último apunte en o antes de la fecha', () => {
    expect(saldoEnFechaExtracto(eventos, '2026-01-31')).toBe(100);
    expect(saldoEnFechaExtracto(eventos, '2026-02-15')).toBe(200);
    expect(saldoEnFechaExtracto(eventos, '2026-12-31')).toBe(200);
  });

  it('devuelve null si no hay ningún apunte anterior', () => {
    expect(saldoEnFechaExtracto(eventos, '2025-12-31')).toBeNull();
    expect(saldoEnFechaExtracto([], '2026-01-01')).toBeNull();
  });
});
