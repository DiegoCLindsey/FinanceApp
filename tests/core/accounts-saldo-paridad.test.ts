// Paridad legacy ↔ núcleo para `saldoEnFecha`. Las dos implementaciones tienen
// que dar el mismo número: el legacy es quien pinta el dashboard y el núcleo
// quien alimenta a `src/engine`, y si discrepan el usuario ve dos saldos
// distintos para la misma cuenta.
import { beforeAll, describe, expect, it } from 'vitest';
import { saldoEnFecha, type AccountLike } from '@/core/accounts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FM = (globalThis as any).FinanceMath;
});

const casos: { nombre: string; acc: AccountLike; fechas: string[] }[] = [
  {
    nombre: 'ancla y punto el mismo día',
    acc: {
      _id: 'a',
      saldoInicial: 8400,
      fechaInicialSaldo: '2026-08-22',
      historicoSaldos: [{ _id: 'p1', fecha: '2026-08-22', saldo: 12000, nota: '' }],
    },
    fechas: ['2026-08-21', '2026-08-22', '2026-08-23'],
  },
  {
    nombre: 'dos puntos el mismo día',
    acc: {
      _id: 'b',
      saldoInicial: 100,
      fechaInicialSaldo: '2026-01-01',
      historicoSaldos: [
        { _id: 'p1', fecha: '2026-05-10', saldo: 500, nota: '' },
        { _id: 'p2', fecha: '2026-05-10', saldo: 700, nota: '' },
      ],
    },
    fechas: ['2026-01-01', '2026-05-09', '2026-05-10', '2026-12-31'],
  },
  {
    nombre: 'puntos anteriores al ancla',
    acc: {
      _id: 'c',
      saldoInicial: 8400,
      fechaInicialSaldo: '2026-06-01',
      historicoSaldos: [{ _id: 'p1', fecha: '2026-01-15', saldo: 3000, nota: '' }],
    },
    fechas: ['2026-01-01', '2026-01-15', '2026-05-31', '2026-06-01', '2026-09-01'],
  },
  {
    nombre: 'sin ancla',
    acc: {
      _id: 'd',
      saldoInicial: 0,
      fechaInicialSaldo: '',
      historicoSaldos: [{ _id: 'p1', fecha: '2026-03-01', saldo: 250, nota: '' }],
    },
    fechas: ['2026-02-01', '2026-03-01', '2026-04-01'],
  },
];

describe('saldoEnFecha · paridad legacy ↔ núcleo', () => {
  for (const { nombre, acc, fechas } of casos) {
    it(nombre, () => {
      for (const f of fechas) {
        expect({ f, v: saldoEnFecha(acc, f) }).toEqual({ f, v: FM.saldoEnFecha(acc, f) });
      }
    });
  }
});
