// Margen de error medido contra el saldo real: cada corrección es el error de
// la previsión a un mes; de ahí salen el sesgo, la dispersión y la banda.
import { describe, expect, it } from 'vitest';
import { describirPrecisionSaldo, medirPrecisionConSaldo, type EventoConSaldo } from '@/engine/precision-saldo';

/** Una corrección del motor: el saldo real de `fecha` frente a lo previsto. */
const corr = (fecha: string, error: number, desde: string | null): EventoConSaldo => ({
  fecha,
  sourceType: 'ajuste-saldo-real',
  tipo: 'ajuste',
  delta: error,
  saldoPrevisto: 1000,
  saldoReal: 1000 + error,
  desdeSaldoReal: desde,
});
const nomina = (fecha: string): EventoConSaldo => ({ fecha, concepto: 'Nómina', cuantia: 2000, tipo: 'ingreso', sourceType: 'nomina' });

/** Fin de mes de 2026: 31 ene, 28 feb, 31 mar… */
const FINES = ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30', '2026-05-31', '2026-06-30', '2026-07-31'];
const serie = (errores: number[]) => errores.map((e, i) => corr(FINES[i], e, i === 0 ? null : FINES[i - 1]));

describe('medirPrecisionConSaldo', () => {
  it('sesgo y dispersión de los errores a un mes; el primero no cuenta', () => {
    // el primero parte del ancla, no de un saldo real: fuera
    const p = medirPrecisionConSaldo(serie([999, 100, 200, 300]), '2026-12-31');
    expect(p.errores.map((e) => e.error)).toEqual([100, 200, 300]);
    expect(p.sesgo).toBe(200);
    expect(p.dispersion).toBe(100);
    expect(p.variabilidad.fiable).toBe(true);
    expect(p.variabilidad.sigmaMensual).toBeCloseTo(100, 6);
    // lo que no se compensa: el sesgo y el error de la media
    expect(p.variabilidad.sigmaDeriva).toBeCloseTo(Math.sqrt(200 ** 2 + 100 ** 2 / 3), 6);
  });

  it('con menos de 3 meses no hay banda', () => {
    const p = medirPrecisionConSaldo(serie([0, 100, 200]), '2026-12-31');
    expect(p.variabilidad.fiable).toBe(false);
    expect(p.variabilidad.sigmaMensual).toBe(0);
    expect(describirPrecisionSaldo(p)).toContain('al menos 3 meses');
  });

  it('solo previsiones a un mes: 20 a 45 días entre saldos reales', () => {
    const ev = [
      corr('2026-01-31', 0, null),
      corr('2026-02-10', 50, '2026-01-31'), // 10 días: fuera
      corr('2026-04-30', 70, '2026-02-10'), // 79 días: fuera
      corr('2026-05-31', 10, '2026-04-30'),
    ];
    expect(medirPrecisionConSaldo(ev, '2026-12-31').errores.map((e) => e.fecha)).toEqual(['2026-05-31']);
  });

  it('nada posterior a hoy', () => {
    const p = medirPrecisionConSaldo(serie([0, 10, 20, 30, 40]), '2026-03-31');
    expect(p.errores.map((e) => e.fecha)).toEqual(['2026-02-28', '2026-03-31']);
  });

  it('aparta un mes atípico y dice la causa probable: la nómina a ±3 días', () => {
    const ev = [...serie([0, 100, 120, 90, -1900, 110, 95]), nomina('2026-05-29')];
    const p = medirPrecisionConSaldo(ev, '2026-12-31');
    expect(p.atipicos.map((a) => a.fecha)).toEqual(['2026-05-31']);
    expect(p.atipicos[0].descartado).toContain('«Nómina»');
    expect(p.errores).toHaveLength(5);
    expect(p.sesgo).toBeCloseTo((100 + 120 + 90 + 110 + 95) / 5, 2);
    const texto = describirPrecisionSaldo(p);
    expect(texto).toContain('mejor de lo previsto');
    expect(texto).toContain('1 mes atípico');
  });

  it('con pocos meses muy parecidos, un mes normal NO se aparta', () => {
    // −470, −430, −550, −440 y dos meses buenos (0 y +160): nada del tamaño de
    // un pago grande (la nómina es de 2000 € al mes)
    const ev = [...serie([0, 0, -470, 160, -430, -550, -440]), ...FINES.map((f) => nomina(f.slice(0, 8) + '28'))];
    const p = medirPrecisionConSaldo(ev, '2026-12-31');
    expect(p.atipicos).toEqual([]);
    expect(p.errores).toHaveLength(6);
  });

  it('las correcciones de 0 € también cuentan: un mes acertado es un dato', () => {
    const p = medirPrecisionConSaldo(serie([5, 0, 0, 0]), '2026-12-31');
    expect(p.errores).toHaveLength(3);
    expect(p.sesgo).toBe(0);
    expect(describirPrecisionSaldo(p)).toContain('justo en lo previsto');
  });
});
