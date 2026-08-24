import { describe, expect, it } from 'vitest';
import { colchonComoMargen, construirAvisos, describirPlazo, diasEntreISO, fechaEnPalabras } from '@/engine/avisos';
import { calcMargenEnFecha, calcColchonEnFecha } from '@/engine/margins';
import type { PuntoCritico } from '@/engine/analysis';
import type { AlertaMargen } from '@/engine/margins';

const HOY = '2026-08-24';

const critico = (tipo: PuntoCritico['tipo'], fecha: string, saldo: number): PuntoCritico => ({
  tipo,
  fecha,
  saldo,
  mensaje: '',
});

const margen = (nombre: string, fecha: string, saldo: number, target: number): AlertaMargen => ({
  tipo: 'bajo_margen',
  fecha,
  saldo,
  target,
  nombre,
  mensaje: '',
});

describe('diasEntreISO', () => {
  it('cuenta días naturales', () => {
    expect(diasEntreISO('2026-08-24', '2026-08-25')).toBe(1);
    expect(diasEntreISO('2026-08-24', '2026-09-24')).toBe(31);
    expect(diasEntreISO('2026-08-24', '2026-08-24')).toBe(0);
  });

  it('el pasado sale negativo', () => {
    expect(diasEntreISO('2026-08-24', '2026-08-20')).toBe(-4);
  });

  it('un cambio de hora no se come un día', () => {
    // El último domingo de octubre en Europe/Madrid: entre esas dos medianoches
    // hay 25 horas, y truncar en vez de redondear daría 0.
    expect(diasEntreISO('2026-10-25', '2026-10-26')).toBe(1);
    expect(diasEntreISO('2026-03-28', '2026-03-30')).toBe(2);
  });
});

describe('fechaEnPalabras', () => {
  it('dice la fecha en castellano, sin el año si es el mismo', () => {
    expect(fechaEnPalabras('2026-11-24', HOY)).toBe('24 de noviembre');
    expect(fechaEnPalabras('2026-01-01', HOY)).toBe('1 de enero');
  });

  it('con el año cuando cambia, que si no se pierde el contexto', () => {
    expect(fechaEnPalabras('2027-03-09', HOY)).toBe('9 de marzo de 2027');
  });
});

describe('describirPlazo', () => {
  it('habla como una persona', () => {
    expect(describirPlazo(0)).toBe('hoy');
    expect(describirPlazo(1)).toBe('mañana');
    expect(describirPlazo(4)).toBe('en 4 días');
    expect(describirPlazo(9)).toBe('en una semana');
    expect(describirPlazo(21)).toBe('en 3 semanas');
    expect(describirPlazo(35)).toBe('en un mes');
    expect(describirPlazo(180)).toBe('en 6 meses');
  });
});

describe('colchonComoMargen', () => {
  // Un gasto básico mensual, para que el colchón "de N meses" no salga a cero.
  const expenses = [
    {
      _id: 'e1',
      concepto: 'Alquiler',
      cuantia: 900,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      diaPago: 'dia:1',
      fechaInicio: '2020-01-01',
      fechaFin: null,
      activo: true,
      basico: true,
    },
  ] as never[];

  it('apagado no produce margen', () => {
    expect(colchonComoMargen({ showColchon: false, colchonMeses: 6 })).toBeNull();
    expect(colchonComoMargen(null)).toBeNull();
  });

  it('0 meses significa «el valor por defecto», como en calcColchon', () => {
    expect(colchonComoMargen({ colchonMeses: 0 })?.puntos?.[0].meses).toBe(6);
  });

  it('da el MISMO objetivo que calcColchonEnFecha, que es el motivo de existir', () => {
    for (const config of [
      { colchonTipo: 'meses' as const, colchonMeses: 6 },
      { colchonTipo: 'fijo' as const, colchonFijo: 12000 },
      { colchonTipo: 'meses' as const, colchonMeses: 3, colchonPuntos: [{ fecha: '2026-01-01', tipo: 'fijo', importe: 5000 }] },
    ]) {
      const m = colchonComoMargen(config);
      expect(m).not.toBeNull();
      for (const fecha of ['2026-08-24', '2027-03-15']) {
        expect(calcMargenEnFecha(m as never, expenses, config, [], fecha)).toBeCloseTo(calcColchonEnFecha(expenses, config, [], fecha), 6);
      }
    }
  });

  it('con waypoints propios los respeta tal cual', () => {
    const puntos = [{ fecha: '2026-01-01', tipo: 'fijo', importe: 5000 }];
    expect(colchonComoMargen({ colchonPuntos: puntos })?.puntos).toEqual(puntos);
  });
});

describe('construirAvisos', () => {
  it('sin cruces no hay avisos', () => {
    expect(construirAvisos({}, { hoy: HOY })).toEqual([]);
  });

  it('el saldo negativo es crítico y dice la fecha', () => {
    const a = construirAvisos({ puntosCriticos: [critico('saldo_negativo', '2026-09-15', -420)] }, { hoy: HOY });
    expect(a).toHaveLength(1);
    expect(a[0].gravedad).toBe('critico');
    expect(a[0].dias).toBe(22);
    expect(a[0].plazo).toBe('en 3 semanas');
    expect(a[0].titulo).toBe('Te quedas en números rojos');
    expect(a[0].detalle).toContain('15 de septiembre');
  });

  it('lo que ya ha pasado no se avisa', () => {
    const a = construirAvisos({ puntosCriticos: [critico('saldo_negativo', '2026-07-01', -420)] }, { hoy: HOY });
    expect(a).toEqual([]);
  });

  it('un cruce hoy mismo sí se avisa', () => {
    const a = construirAvisos({ puntosCriticos: [critico('saldo_negativo', HOY, -50)] }, { hoy: HOY });
    expect(a).toHaveLength(1);
    expect(a[0].plazo).toBe('hoy');
  });

  it('las recuperaciones no son avisos', () => {
    const a = construirAvisos({ puntosCriticos: [critico('recuperacion_colchon', '2026-09-15', 8000)] }, { hoy: HOY });
    expect(a).toEqual([]);
  });

  it('de la misma causa solo avisa la PRIMERA vez', () => {
    // Una proyección que va y viene del colchón produce un cruce por vaivén.
    const a = construirAvisos(
      {
        puntosCriticos: [
          critico('bajo_colchon', '2026-11-01', 2000),
          critico('bajo_colchon', '2026-09-10', 1500),
          critico('bajo_colchon', '2026-10-05', 1800),
        ],
      },
      { hoy: HOY },
    );
    expect(a).toHaveLength(1);
    expect(a[0].fecha).toBe('2026-09-10');
  });

  it('cada margen avisa por su cuenta', () => {
    const a = construirAvisos(
      { crucesMargenes: [margen('Colchón 6 meses', '2026-09-10', 1500, 9000), margen('Fondo de obras', '2026-10-01', 200, 3000)] },
      { hoy: HOY },
    );
    expect(a.map((x) => x.id)).toEqual(['margen:Colchón 6 meses', 'margen:Fondo de obras']);
  });

  it('lo grave se avisa a un año; lo demás, no', () => {
    const dentroDe10Meses = '2027-06-24';
    const soloAviso = construirAvisos({ puntosCriticos: [critico('bajo_colchon', dentroDe10Meses, 1000)] }, { hoy: HOY });
    expect(soloAviso).toEqual([]);
    const grave = construirAvisos({ puntosCriticos: [critico('saldo_negativo', dentroDe10Meses, -1000)] }, { hoy: HOY });
    expect(grave).toHaveLength(1);
  });

  it('ni siquiera lo grave se avisa más allá del horizonte', () => {
    const a = construirAvisos({ puntosCriticos: [critico('saldo_negativo', '2029-01-01', -1000)] }, { hoy: HOY });
    expect(a).toEqual([]);
  });

  it('ordena por fecha, no por gravedad', () => {
    // Quedarte sin colchón la semana que viene se atiende antes que un
    // descubierto dentro de ocho meses.
    const a = construirAvisos(
      {
        puntosCriticos: [critico('saldo_negativo', '2027-04-01', -300), critico('bajo_colchon', '2026-08-31', 500)],
      },
      { hoy: HOY },
    );
    expect(a.map((x) => x.id)).toEqual(['bajo-colchon', 'saldo-negativo']);
  });

  it('respeta el máximo', () => {
    const a = construirAvisos(
      {
        crucesMargenes: [
          margen('A', '2026-09-01', 1, 100),
          margen('B', '2026-09-02', 1, 100),
          margen('C', '2026-09-03', 1, 100),
          margen('D', '2026-09-04', 1, 100),
          margen('E', '2026-09-05', 1, 100),
        ],
      },
      { hoy: HOY, maximo: 3 },
    );
    expect(a).toHaveLength(3);
    expect(a.map((x) => x.id)).toEqual(['margen:A', 'margen:B', 'margen:C']);
  });

  describe('regla 3: la incertidumbre matiza el aviso', () => {
    it('un cruce que cabe en el margen de error se sugiere, no se afirma', () => {
      const a = construirAvisos({ crucesMargenes: [margen('Colchón', '2026-11-24', 8700, 9000)] }, { hoy: HOY, incertidumbre: () => 2000 });
      expect(a[0].incierto).toBe(true);
      expect(a[0].titulo).toBe('Podrías bajar de «Colchón»');
    });

    it('un cruce mayor que el margen de error se afirma', () => {
      const a = construirAvisos({ crucesMargenes: [margen('Colchón', '2026-11-24', 4000, 9000)] }, { hoy: HOY, incertidumbre: () => 2000 });
      expect(a[0].incierto).toBe(false);
      expect(a[0].titulo).toBe('Bajas de «Colchón»');
    });

    it('sin función de incertidumbre nada es incierto', () => {
      const a = construirAvisos({ crucesMargenes: [margen('Colchón', '2026-11-24', 8999, 9000)] }, { hoy: HOY });
      expect(a[0].incierto).toBe(false);
    });

    it('la incertidumbre se pide para el plazo del aviso, no para hoy', () => {
      const plazos: number[] = [];
      construirAvisos(
        { puntosCriticos: [critico('saldo_negativo', '2026-10-23', -100)] },
        { hoy: HOY, incertidumbre: (d) => (plazos.push(d), 0) },
      );
      expect(plazos).toEqual([60]);
    });
  });
});
