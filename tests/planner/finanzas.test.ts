// Fórmulas del gestor de objetivos. Los casos marcados «§9» son los de
// referencia del documento de diseño, calculados a mano.
import { describe, it, expect } from 'vitest';
import { capitalParaRenta, cuotaNecesaria, esCero, mesesHasta, rendimientoMensual, rentaDeCapital, valorFuturo } from '@/planner/finanzas';

/** Euros → céntimos, para que los casos se lean como en el documento. */
const eu = (euros: number): number => Math.round(euros * 100);
/** Céntimos → euros con dos decimales, para comparar. */
const eur = (centimos: number): number => centimos / 100;

describe('cuota necesaria', () => {
  it('§9 — 30.000 € en 36 meses al 1 % real', () => {
    // El documento dice «≈ 820 €»; el valor exacto es 821,25. Se fija el exacto,
    // comprobado aparte: un caso de referencia sirve para detectar desviaciones,
    // y para eso tiene que ser preciso.
    expect(eur(cuotaNecesaria(eu(30000), 0, 36, 0.01))).toBeCloseTo(821.25, 2);
  });

  it('§9 — 110.000 € en 96 meses al 1 % real', () => {
    // Documento: «≈ 1.100 €». Exacto: 1101,09.
    expect(eur(cuotaNecesaria(eu(110000), 0, 96, 0.01))).toBeCloseTo(1101.09, 2);
  });

  it('sin rentabilidad es un reparto lineal', () => {
    // El caso i = 0 va por otra rama: la fórmula general dividiría por cero
    expect(cuotaNecesaria(eu(12000), 0, 12, 0)).toBe(eu(1000));
    expect(cuotaNecesaria(eu(12000), eu(3000), 12, 0)).toBe(eu(750));
  });

  it('descuenta el saldo ya acumulado', () => {
    const sinSaldo = cuotaNecesaria(eu(30000), 0, 36, 0.01);
    const conSaldo = cuotaNecesaria(eu(30000), eu(10000), 36, 0.01);
    expect(conSaldo).toBeLessThan(sinSaldo);
  });

  it('un objetivo ya cubierto no pide nada — esto es lo que libera la cuota', () => {
    expect(cuotaNecesaria(eu(10000), eu(10000), 24, 0.03)).toBe(0);
    expect(cuotaNecesaria(eu(10000), eu(15000), 24, 0.03)).toBe(0);
  });

  it('tampoco pide nada si el saldo llega solo por rentabilidad', () => {
    // 10.000 € al 10 % real pasan de 12.000 € en 24 meses sin aportar un euro
    expect(cuotaNecesaria(eu(11000), eu(10000), 24, 0.1)).toBe(0);
  });

  it('sin plazo, pide de golpe lo que falta', () => {
    expect(cuotaNecesaria(eu(5000), eu(2000), 0, 0.05)).toBe(eu(3000));
    expect(cuotaNecesaria(eu(5000), eu(2000), -3, 0.05)).toBe(eu(3000));
  });

  it('redondea SIEMPRE hacia arriba', () => {
    // Quedarse corto por un céntimo es no llegar al objetivo
    const c = cuotaNecesaria(eu(10000), 0, 7, 0);
    expect(c).toBe(Math.ceil(eu(10000) / 7));
    expect(c * 7).toBeGreaterThanOrEqual(eu(10000));
  });
});

describe('valor futuro', () => {
  it('sin rentabilidad es saldo más aportaciones', () => {
    expect(valorFuturo(eu(1000), eu(100), 12, 0)).toBe(eu(2200));
  });

  it('es la inversa de la cuota necesaria', () => {
    // Aportando exactamente la cuota calculada se llega al objetivo
    const objetivo = eu(30000);
    const cuota = cuotaNecesaria(objetivo, 0, 36, 0.01);
    expect(valorFuturo(0, cuota, 36, 0.01)).toBeGreaterThanOrEqual(objetivo);
  });

  it('sin meses devuelve el saldo tal cual', () => {
    expect(valorFuturo(eu(5000), eu(300), 0, 0.05)).toBe(eu(5000));
  });

  it('la rentabilidad compone', () => {
    const simple = valorFuturo(eu(10000), 0, 12, 0);
    const compuesto = valorFuturo(eu(10000), 0, 12, 0.05);
    expect(compuesto).toBeGreaterThan(simple);
  });
});

describe('meses hasta el objetivo', () => {
  it('§9 — 10.000 € pendientes absorbiendo 3.000 €/mes se cubren en 4 meses', () => {
    expect(mesesHasta(eu(10000), 0, eu(3000), 0)).toBe(4);
  });

  it('ya alcanzado son 0 meses', () => {
    expect(mesesHasta(eu(5000), eu(5000), eu(100), 0.02)).toBe(0);
    expect(mesesHasta(eu(5000), eu(9000), eu(100), 0.02)).toBe(0);
  });

  it('devuelve null cuando no se llega nunca, en vez de un número inventado', () => {
    // Sin aportación y sin rentabilidad no hay forma de avanzar
    expect(mesesHasta(eu(5000), eu(1000), 0, 0)).toBeNull();
  });

  it('con rentabilidad se llega aunque no se aporte nada', () => {
    const n = mesesHasta(eu(2000), eu(1000), 0, 0.05);
    expect(n).not.toBeNull();
    expect(n!).toBeGreaterThan(0);
  });

  it('coincide con el valor futuro', () => {
    const n = mesesHasta(eu(30000), eu(1000), eu(500), 0.03)!;
    expect(valorFuturo(eu(1000), eu(500), n, 0.03)).toBeGreaterThanOrEqual(eu(30000));
    expect(valorFuturo(eu(1000), eu(500), n - 1, 0.03)).toBeLessThan(eu(30000));
  });
});

describe('rendimiento mensual', () => {
  it('sin tasa no rinde', () => {
    expect(rendimientoMensual(eu(10000), 0)).toBe(0);
  });

  it('es la doceava parte de la tasa anual', () => {
    expect(rendimientoMensual(eu(12000), 0.12)).toBe(eu(120));
  });
});

describe('tasas de cero', () => {
  it('reconoce el cero y lo indistinguible de cero', () => {
    expect(esCero(0)).toBe(true);
    expect(esCero(1e-15)).toBe(true);
    expect(esCero(0.0001)).toBe(false);
  });
});

describe('capital para una renta (independencia económica)', () => {
  it('§9 — 2.000 €/mes netos con SWR 4 % y fiscalidad 20 % piden ≈ 750.000 €', () => {
    const r = capitalParaRenta({ rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0.04, tipoFiscalEfectivo: 0.2 });
    expect(eur(r.retiroBrutoAnual)).toBeCloseTo(30000, 0);
    expect(eur(r.capitalNecesario)).toBeCloseTo(750000, 0);
  });

  it('§9 — la misma renta con SWR 3,5 % pide ≈ 857.000 €', () => {
    const r = capitalParaRenta({ rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0.035, tipoFiscalEfectivo: 0.2 });
    expect(eur(r.capitalNecesario)).toBeCloseTo(857142.86, 0);
  });

  it('bajar el SWR sube el capital necesario — la advertencia de la UI', () => {
    const base = capitalParaRenta({ rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0.04, tipoFiscalEfectivo: 0.2 });
    const prudente = capitalParaRenta({ rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0.03, tipoFiscalEfectivo: 0.2 });
    expect(prudente.capitalNecesario).toBeGreaterThan(base.capitalNecesario);
  });

  it('rechaza parámetros imposibles en vez de devolver infinito', () => {
    expect(() => capitalParaRenta({ rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0, tipoFiscalEfectivo: 0.2 })).toThrow(RangeError);
    expect(() => capitalParaRenta({ rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0.04, tipoFiscalEfectivo: 1 })).toThrow(RangeError);
  });

  it('la renta que sostiene un capital es la inversa', () => {
    const capital = capitalParaRenta({ rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0.04, tipoFiscalEfectivo: 0.2 }).capitalNecesario;
    expect(eur(rentaDeCapital(capital, 0.04, 0.2))).toBeCloseTo(2000, 0);
  });
});
