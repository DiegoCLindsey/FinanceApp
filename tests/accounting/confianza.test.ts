import { describe, expect, it } from 'vitest';
import { bandaAcumulada, bandaDeConfianza, describirBanda, desviacionTipica, medirVariabilidad } from '@/accounting/confianza';
import type { MesComparado, PrecisionEstimacion } from '@/accounting/precision';

const mes = (m: string, estimado: number, real: number): MesComparado => ({
  mes: m,
  estimado,
  real,
  desviacion: real - estimado,
  precision: 0,
});

const analisis = (meses: MesComparado[], extra: Partial<PrecisionEstimacion> = {}): PrecisionEstimacion => ({
  estimacionId: 'e1',
  concepto: 'Luz',
  tags: [],
  meses,
  estimadoTotal: 0,
  realTotal: 0,
  desviacionTotal: 0,
  precision: null,
  mediaRealReciente: null,
  infraestimada: false,
  ...extra,
});

describe('desviacionTipica', () => {
  it('muestral, dividiendo por n − 1', () => {
    // [2, 4, 4, 4, 5, 5, 7, 9]: media 5, varianza muestral 32/7
    expect(desviacionTipica([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(Math.sqrt(32 / 7), 10);
  });

  it('cero cuando todos los valores son iguales', () => {
    expect(desviacionTipica([3, 3, 3])).toBe(0);
  });

  it('null con menos de dos puntos', () => {
    expect(desviacionTipica([])).toBeNull();
    expect(desviacionTipica([5])).toBeNull();
  });

  it('no le afecta el signo de la media', () => {
    expect(desviacionTipica([-10, -20, -30])).toBeCloseTo(desviacionTipica([10, 20, 30]) as number, 10);
  });
});

describe('medirVariabilidad', () => {
  it('sin análisis no es fiable', () => {
    expect(medirVariabilidad([])).toMatchObject({ fiable: false, sigmaMensual: 0, estimaciones: 0 });
  });

  it('con menos de tres meses no cuenta la estimación', () => {
    const v = medirVariabilidad([analisis([mes('2026-05', 100, 120), mes('2026-06', 100, 90)])]);
    expect(v.fiable).toBe(false);
    expect(v.estimaciones).toBe(0);
  });

  it('con tres meses ya mide', () => {
    const v = medirVariabilidad([analisis([mes('2026-04', 100, 110), mes('2026-05', 100, 90), mes('2026-06', 100, 100)])]);
    expect(v.fiable).toBe(true);
    expect(v.estimaciones).toBe(1);
    expect(v.mesesMinimos).toBe(3);
    // desviaciones [10, -10, 0] → σ muestral = 10
    expect(v.sigmaMensual).toBeCloseTo(10, 6);
  });

  it('una estimación que nunca se desvía aporta sigma cero', () => {
    const v = medirVariabilidad([analisis([mes('2026-04', 100, 100), mes('2026-05', 100, 100), mes('2026-06', 100, 100)])]);
    expect(v.fiable).toBe(true);
    expect(v.sigmaMensual).toBe(0);
  });

  it('las estimaciones se suman EN CUADRADO, no a pelo', () => {
    const a = analisis([mes('2026-04', 100, 130), mes('2026-05', 100, 70), mes('2026-06', 100, 100)], { estimacionId: 'a' });
    const b = analisis([mes('2026-04', 200, 240), mes('2026-05', 200, 160), mes('2026-06', 200, 200)], { estimacionId: 'b' });
    // σa = 30, σb = 40 → √(30² + 40²) = 50, no 70
    const v = medirVariabilidad([a, b]);
    expect(v.sigmaMensual).toBeCloseTo(50, 6);
    expect(v.estimaciones).toBe(2);
  });

  it('la deriva es sigma partido por la raíz de los meses medidos', () => {
    const v = medirVariabilidad([analisis([mes('2026-04', 100, 110), mes('2026-05', 100, 90), mes('2026-06', 100, 100)])]);
    // σ = 10 sobre 3 meses → error de la media = 10/√3
    expect(v.sigmaDeriva).toBeCloseTo(10 / Math.sqrt(3), 2);
  });

  it('más meses de historial reducen la deriva', () => {
    // Mismas desviaciones repetidas cuatro veces: la variabilidad del mes es
    // prácticamente la misma, pero la media se conoce mucho mejor.
    const patron = [10, -10, 0];
    const corta = analisis(patron.map((d, i) => mes(`2026-0${4 + i}`, 100, 100 + d)));
    const larga = analisis(
      [...patron, ...patron, ...patron, ...patron].map((d, i) => mes(`2026-${String(i + 1).padStart(2, '0')}`, 100, 100 + d)),
    );
    const vc = medirVariabilidad([corta]);
    const vl = medirVariabilidad([larga]);
    expect(vl.sigmaDeriva).toBeLessThan(vc.sigmaDeriva / 1.5);
    // Y la relación se mantiene: deriva = σ / √n, con n los meses medidos.
    expect(vl.sigmaDeriva).toBeCloseTo(vl.sigmaMensual / Math.sqrt(12), 2);
  });

  it('informa del rango de meses disponibles', () => {
    const corta = analisis([mes('2026-04', 100, 110), mes('2026-05', 100, 90), mes('2026-06', 100, 100)], { estimacionId: 'a' });
    const larga = analisis(
      ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'].map((m) => mes(m, 100, 105)),
      { estimacionId: 'b' },
    );
    const v = medirVariabilidad([corta, larga]);
    expect(v.mesesMinimos).toBe(3);
    expect(v.mesesMaximos).toBe(5);
  });
});

describe('bandaAcumulada', () => {
  it('crece con la RAÍZ del tiempo, no en proporción', () => {
    expect(bandaAcumulada(100, 1)).toBeCloseTo(100, 6);
    expect(bandaAcumulada(100, 4)).toBeCloseTo(200, 6); // ×2, no ×4
    expect(bandaAcumulada(100, 9)).toBeCloseTo(300, 6);
  });

  it('z multiplica el ancho', () => {
    expect(bandaAcumulada(100, 4, 2)).toBeCloseTo(400, 6);
  });

  it('sin sigma o sin tiempo no hay banda', () => {
    expect(bandaAcumulada(0, 12)).toBe(0);
    expect(bandaAcumulada(100, 0)).toBe(0);
    expect(bandaAcumulada(100, -3)).toBe(0);
    expect(bandaAcumulada(0, 12, 1, 0)).toBe(0);
  });

  it('la deriva crece EN PROPORCIÓN al tiempo, no con la raíz', () => {
    // Sin ruido, solo deriva: si no conoces tu media, el error se repite cada
    // mes en el mismo sentido y no se compensa.
    expect(bandaAcumulada(0, 1, 1, 50)).toBeCloseTo(50, 6);
    expect(bandaAcumulada(0, 4, 1, 50)).toBeCloseTo(200, 6); // ×4, no ×2
    expect(bandaAcumulada(0, 12, 1, 50)).toBeCloseTo(600, 6);
  });

  it('ruido y deriva se combinan en cuadrado', () => {
    // ruido a 9 meses = 30·3 = 90; deriva = 40·9 = 360 → √(90² + 360²)
    expect(bandaAcumulada(30, 9, 1, 40)).toBeCloseTo(Math.hypot(90, 360), 2);
  });

  it('a largo plazo manda la deriva', () => {
    // Mismo sigma, misma z: a 36 meses el término lineal es varias veces el de
    // la raíz. Es el motivo de que la banda se vea: ignorarlo la dejaba plana.
    const soloRuido = bandaAcumulada(300, 36);
    const conDeriva = bandaAcumulada(300, 36, 1, 300 / Math.sqrt(6));
    expect(conDeriva).toBeGreaterThan(2 * soloRuido);
  });
});

describe('bandaDeConfianza', () => {
  const fiable = medirVariabilidad([analisis([mes('2026-04', 100, 110), mes('2026-05', 100, 90), mes('2026-06', 100, 100)])]);

  const extracto = [
    { fecha: '2026-07-15', saldoAcum: 10000 },
    { fecha: '2026-08-15', saldoAcum: 10500 },
    { fecha: '2026-11-15', saldoAcum: 12000 },
  ];

  it('sin datos fiables no pinta nada', () => {
    const sinDatos = medirVariabilidad([]);
    expect(bandaDeConfianza(extracto, sinDatos)).toEqual([]);
  });

  it('con extracto vacío tampoco', () => {
    expect(bandaDeConfianza([], fiable)).toEqual([]);
  });

  it('el primer punto no tiene incertidumbre acumulada', () => {
    const b = bandaDeConfianza(extracto, fiable);
    expect(b[0]).toMatchObject({ fecha: '2026-07-15', saldo: 10000, arriba: 10000, abajo: 10000 });
  });

  it('la banda se ensancha con los meses', () => {
    const b = bandaDeConfianza(extracto, fiable);
    // σ = 10 sobre 3 meses → deriva 10/√3. Ancho(m) = √((10·√m)² + (10/√3·m)²)
    const ancho = (m: number) => Math.hypot(10 * Math.sqrt(m), (10 / Math.sqrt(3)) * m);
    expect(b[1].arriba - b[1].saldo).toBeCloseTo(ancho(1), 2);
    expect(b[2].arriba - b[2].saldo).toBeCloseTo(ancho(4), 2);
    // Y crece más deprisa que la pura raíz del tiempo: ×4 meses ensancha más
    // que ×2, porque el término de deriva es lineal.
    expect(b[2].arriba - b[2].saldo).toBeGreaterThan(2 * (b[1].arriba - b[1].saldo));
  });

  it('es simétrica alrededor del saldo proyectado', () => {
    for (const p of bandaDeConfianza(extracto, fiable)) {
      expect(p.arriba - p.saldo).toBeCloseTo(p.saldo - p.abajo, 6);
    }
  });

  it('la banda inferior puede quedar en negativo: es una previsión, no un tope', () => {
    // σ = 10 sobre 3 meses, a 12 meses vista: √(34,64² + 69,28²) ≈ 77,46, que
    // se come un saldo de 20.
    const pobre = [
      { fecha: '2026-07-15', saldoAcum: 15 },
      { fecha: '2027-07-15', saldoAcum: 20 },
    ];
    const b = bandaDeConfianza(pobre, fiable);
    // A dos decimales: la salida va redondeada a céntimos, como todo el dinero.
    expect(b[1].abajo).toBeCloseTo(20 - Math.hypot(10 * Math.sqrt(12), (10 / Math.sqrt(3)) * 12), 2);
    expect(b[1].abajo).toBeLessThan(0);
  });

  it('con sigma cero la banda existe pero tiene ancho cero', () => {
    // Caso real: unas estimaciones que se desvían siempre lo mismo. Los puntos
    // se devuelven igualmente —el gráfico no tiene que distinguir casos— pero
    // arriba y abajo caen sobre la línea.
    const sinRuido = medirVariabilidad([analisis([mes('2026-04', 100, 120), mes('2026-05', 100, 120), mes('2026-06', 100, 120)])]);
    const b = bandaDeConfianza(extracto, sinRuido);
    expect(b).toHaveLength(3);
    for (const p of b) {
      expect(p.arriba).toBe(p.saldo);
      expect(p.abajo).toBe(p.saldo);
    }
  });

  it('el origen de la acumulación se puede fijar', () => {
    const b = bandaDeConfianza(extracto, fiable, { desde: '2026-06-01' });
    // 2026-07 está a un mes de 2026-06, así que ya no arranca en cero
    expect(b[0].arriba - b[0].saldo).toBeCloseTo(Math.hypot(10, 10 / Math.sqrt(3)), 2);
  });

  it('z ensancha la banda', () => {
    const uno = bandaDeConfianza(extracto, fiable, { z: 1 });
    const dos = bandaDeConfianza(extracto, fiable, { z: 2 });
    expect(dos[2].arriba - dos[2].saldo).toBeCloseTo(2 * (uno[2].arriba - uno[2].saldo), 6);
  });
});

describe('describirBanda', () => {
  it('sin datos explica qué falta', () => {
    expect(describirBanda(medirVariabilidad([]))).toContain('3 meses');
  });

  it('con datos dice sobre qué se ha medido', () => {
    const v = medirVariabilidad([analisis([mes('2026-04', 100, 110), mes('2026-05', 100, 90), mes('2026-06', 100, 100)])]);
    const t = describirBanda(v);
    expect(t).toContain('68 %');
    expect(t).toContain('1 estimación');
  });

  it('con sigma cero no promete precisión: señala el sesgo', () => {
    // Desviarse SIEMPRE 20 € no es incertidumbre, es una estimación mal puesta.
    const v = medirVariabilidad([analisis([mes('2026-04', 100, 120), mes('2026-05', 100, 120), mes('2026-06', 100, 120)])]);
    expect(v.fiable).toBe(true);
    expect(v.sigmaMensual).toBe(0);
    const t = describirBanda(v);
    expect(t).toContain('siempre lo mismo');
    expect(t).toContain('cierre de mes');
    // Y no dice el «68 %» de una banda que no existe.
    expect(t).not.toContain('68 %');
  });

  it('con z=2 habla del 95 %', () => {
    const v = medirVariabilidad([analisis([mes('2026-04', 100, 110), mes('2026-05', 100, 90), mes('2026-06', 100, 100)])]);
    expect(describirBanda(v, 2)).toContain('95 %');
  });
});
