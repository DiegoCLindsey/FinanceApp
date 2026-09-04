// Simulaciones: línea canónica vs. línea con simulaciones (core/scenarios).
import { describe, it, expect } from 'vitest';
import { haySimulaciones, sinSimulaciones } from '@/core/scenarios';

describe('línea canónica vs. línea con simulaciones', () => {
  // Una amortización simulada queda marcada `simulacion: true` dentro del
  // préstamo. No aparece en la lista de gastos —no es un gasto— pero sí
  // mueve la curva de saldo, mientras los resúmenes del dashboard la
  // excluían. Dos criterios distintos para las mismas cifras.
  const datos = () => ({
    loans: [
      {
        _id: 'l1',
        nombre: 'Coche',
        amortizaciones: [
          { _id: 'a1', fecha: '2027-01-15', cantidad: 1000 },
          { _id: 'sim_2030-05_l1', fecha: '2030-05-15', cantidad: 15000, simulacion: true },
        ],
      },
      { _id: 'l2', nombre: 'Hipoteca simulada', simulacion: true, amortizaciones: [] },
    ],
    expenses: [{ _id: 'e1' }, { _id: 'e2', simulacion: true }],
    nominas: [{ _id: 'n1' }],
    accounts: [{ _id: 'c1' }, { _id: 'c2', simulacion: true }],
  });

  it('lo canónico deja fuera préstamos, gastos y cuentas simulados', () => {
    const c = sinSimulaciones(datos());
    expect(c.loans.map((l) => l._id)).toEqual(['l1']);
    expect(c.expenses.map((e) => e._id)).toEqual(['e1']);
    expect(c.accounts.map((a) => a._id)).toEqual(['c1']);
    expect(c.nominas.map((n) => n._id)).toEqual(['n1']);
  });

  it('deja fuera las amortizaciones simuladas pero conserva las reales', () => {
    const [coche] = sinSimulaciones(datos()).loans;
    expect(coche.amortizaciones!.map((a) => (a as { _id: string })._id)).toEqual(['a1']);
  });

  it('no muta la entrada', () => {
    const d = datos();
    sinSimulaciones(d);
    expect(d.loans[0].amortizaciones).toHaveLength(2);
    expect(d.loans).toHaveLength(2);
  });

  it('detecta que hay simulaciones, incluso escondidas dentro de un préstamo real', () => {
    expect(haySimulaciones(datos())).toBe(true);
    const soloAmort: Parameters<typeof haySimulaciones>[0] = {
      loans: [{ _id: 'l1', amortizaciones: [{ _id: 'sim_x', simulacion: true }] }],
      expenses: [],
      nominas: [],
      accounts: [],
    };
    expect(haySimulaciones(soloAmort)).toBe(true);
  });

  it('sin nada simulado, lo canónico es idéntico y no hay aviso que dar', () => {
    const limpio: Parameters<typeof haySimulaciones>[0] = {
      loans: [{ _id: 'l1', amortizaciones: [{ _id: 'a1' }] }],
      expenses: [{ _id: 'e1' }],
      nominas: [],
      accounts: [],
    };
    expect(haySimulaciones(limpio)).toBe(false);
    expect(sinSimulaciones(limpio).loans[0].amortizaciones).toHaveLength(1);
  });
});
