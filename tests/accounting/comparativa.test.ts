import { describe, it, expect } from 'vitest';
import { createLedger } from '@/accounting/ledger';
import { compararIntervalo, mesesEntre } from '@/accounting/comparativa';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import type { Expense } from '@/state/schema';

const HOY = new Date(2026, 6, 30); // 2026-07-30

const estimacion = (over: Partial<Expense> = {}): Expense => ({
  _id: 'e1',
  concepto: 'Luz',
  cuantia: 100,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  frecuencia: 1,
  fechaInicio: '2025-01-10',
  fechaFin: null,
  tags: ['casa'],
  activo: true,
  ...over,
});

function entorno() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  return { store, ledger: createLedger(store) };
}

describe('mesesEntre', () => {
  it('lista los meses del rango, ambos inclusive', () => {
    expect(mesesEntre('2026-05-15', '2026-07-03')).toEqual(['2026-05', '2026-06', '2026-07']);
  });

  it('un solo mes', () => {
    expect(mesesEntre('2026-07-01', '2026-07-31')).toEqual(['2026-07']);
  });

  it('cruza el año', () => {
    expect(mesesEntre('2025-11-10', '2026-02-05')).toEqual(['2025-11', '2025-12', '2026-01', '2026-02']);
  });
});

describe('compararIntervalo', () => {
  it('un mes con estimado y real', () => {
    const { store, ledger } = entorno();
    store.set('expenses', [estimacion({ cuantia: 100 })]);
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 130, concepto: 'Endesa', tipo: 'gasto' });

    const filas = compararIntervalo(ledger, store.get('expenses'), '2026-07-01', '2026-07-31');
    expect(filas).toEqual([
      { mes: '2026-07', estimado: 100, real: 130, ingresosEstimados: 0, ingresosReales: 0, netoEstimado: -100, netoReal: -130 },
    ]);
  });

  it('varios meses, incluidos los que no tienen ningún movimiento real', () => {
    const { store, ledger } = entorno();
    store.set('expenses', [estimacion({ cuantia: 100 })]);
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 90, concepto: 'Endesa junio', tipo: 'gasto' });

    const filas = compararIntervalo(ledger, store.get('expenses'), '2026-06-01', '2026-08-15');
    expect(filas.map((f) => [f.mes, f.estimado, f.real])).toEqual([
      ['2026-06', 100, 90],
      ['2026-07', 100, 0],
      ['2026-08', 100, 0],
    ]);
  });

  it('el gasto no se mezcla con ingresos ni traspasos, pero el ingreso se compara aparte', () => {
    const { store, ledger } = entorno();
    store.set('expenses', [estimacion({ cuantia: 100 })]);
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 130, concepto: 'Endesa', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-11', cuentaId: 'default', importe: 1800, concepto: 'Nómina', tipo: 'ingreso' });
    ledger.registrar({ fecha: '2026-07-12', cuentaId: 'default', importe: 300, concepto: 'Traspaso', tipo: 'transferencia' });

    const filas = compararIntervalo(ledger, store.get('expenses'), '2026-07-01', '2026-07-31');
    // La transferencia no cuenta en ningún lado; el ingreso cuenta como ingreso.
    expect(filas[0]).toMatchObject({ estimado: 100, real: 130, ingresosReales: 1800, netoReal: 1670 });
  });

  it('ignora las estimaciones inactivas y separa las de ingreso', () => {
    const { store, ledger } = entorno();
    store.set('expenses', [
      estimacion({ cuantia: 100 }),
      estimacion({ _id: 'e2', activo: false, cuantia: 999 }),
      estimacion({ _id: 'e3', tipo: 'ingreso', cuantia: 999 }),
    ]);

    const filas = compararIntervalo(ledger, store.get('expenses'), '2026-07-01', '2026-07-31');
    expect(filas[0]).toMatchObject({ estimado: 100, real: 0, ingresosEstimados: 999, netoEstimado: 899 });
  });
});
