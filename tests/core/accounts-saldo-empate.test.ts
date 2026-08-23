// Regresión: «actualicé el saldo de una cuenta y el dashboard no se enteró».
//
// Actualizar el saldo desde el formulario de cuentas NO escribe `saldoInicial`:
// registra un punto de control en `historicoSaldos` con la fecha de hoy. En una
// cuenta cuyo ancla `fechaInicialSaldo` es también hoy —toda cuenta recién
// creada lo es— el empate de fechas lo ganaba el ancla, así que el saldo nuevo
// no llegaba ni al KPI ni a la proyección.
import { describe, expect, it } from 'vitest';
import { saldoEnFecha, saldoRealCuenta, type AccountLike } from '@/core/accounts';

const cuenta = (extra: Partial<AccountLike> = {}): AccountLike => ({
  _id: 'a',
  activo: true,
  saldoInicial: 8400,
  fechaInicialSaldo: '2026-08-22',
  historicoSaldos: [],
  ...extra,
});

describe('saldoEnFecha · empate entre el ancla y un punto de control', () => {
  it('con la misma fecha manda el punto de control', () => {
    const acc = cuenta({
      historicoSaldos: [{ _id: 'p1', fecha: '2026-08-22', saldo: 12000, nota: 'Actualización manual' }],
    });
    expect(saldoEnFecha(acc, '2026-08-22')).toBe(12000);
    expect(saldoEnFecha(acc, '2026-08-23')).toBe(12000);
  });

  it('el orden dentro de historicoSaldos no cambia el resultado', () => {
    const acc = cuenta({
      historicoSaldos: [
        { _id: 'p2', fecha: '2026-08-22', saldo: 12000, nota: 'segundo' },
        { _id: 'p1', fecha: '2026-08-20', saldo: 9000, nota: 'primero' },
      ],
    });
    expect(saldoEnFecha(acc, '2026-08-22')).toBe(12000);
  });

  it('varios puntos el mismo día: gana el último de la lista', () => {
    const acc = cuenta({
      historicoSaldos: [
        { _id: 'p1', fecha: '2026-08-22', saldo: 12000, nota: 'uno' },
        { _id: 'p2', fecha: '2026-08-22', saldo: 15000, nota: 'dos' },
      ],
    });
    expect(saldoEnFecha(acc, '2026-08-22')).toBe(15000);
  });

  it('el ancla sigue mandando sobre los puntos ANTERIORES a ella', () => {
    const acc = cuenta({
      historicoSaldos: [{ _id: 'p1', fecha: '2026-01-15', saldo: 3000, nota: 'viejo' }],
    });
    expect(saldoEnFecha(acc, '2026-08-22')).toBe(8400);
  });

  it('un punto posterior al ancla sigue ganando', () => {
    const acc = cuenta({
      fechaInicialSaldo: '2026-01-01',
      historicoSaldos: [{ _id: 'p1', fecha: '2026-08-22', saldo: 12000, nota: 'nuevo' }],
    });
    expect(saldoEnFecha(acc, '2026-08-22')).toBe(12000);
  });

  it('antes del ancla no se inventa el saldo del ancla', () => {
    const acc = cuenta({ fechaInicialSaldo: '2026-08-22' });
    expect(saldoEnFecha(acc, '2026-01-01')).toBe(0);
  });

  it('saldoRealCuenta y saldoEnFecha(hoy) coinciden tras actualizar', () => {
    const acc = cuenta({
      historicoSaldos: [{ _id: 'p1', fecha: '2026-08-22', saldo: 12000, nota: 'Actualización manual' }],
    });
    expect(saldoRealCuenta(acc)).toBe(saldoEnFecha(acc, '2026-08-22'));
  });
});
