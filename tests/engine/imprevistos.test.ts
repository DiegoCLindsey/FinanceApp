import { describe, expect, it } from 'vitest';
import {
  desgloseDelMes,
  desglosePorMeses,
  esMovimientoImprevisto,
  mediaDeDesgloses,
  estimarImprevistos,
  mesEnCurso,
  mesesEntre,
  primerDatoDeSeguimiento,
  sumarDesgloses,
  type MovimientoReal,
} from '@/engine/mes';
import type { CashEvent } from '@/engine/types';

const ev = (extra: Partial<CashEvent>): CashEvent =>
  ({
    fecha: '2026-11-05',
    concepto: 'x',
    cuantia: -10,
    tipo: 'gasto',
    tags: [],
    cuenta: 'default',
    sourceType: 'expense',
    ...extra,
  }) as CashEvent;
const mov = (extra: Partial<MovimientoReal>): MovimientoReal => ({
  _id: 'm',
  fecha: '2026-11-08',
  concepto: 'Taller',
  importeCts: -12000,
  tipo: 'gasto',
  estimacionId: null,
  imprevisto: true,
  ...extra,
});

const gastos = [
  { _id: 'luz', concepto: 'Luz', tipoFrecuencia: 'mensual' },
  { _id: 'averia', concepto: 'Avería lavadora', tipoFrecuencia: 'extraordinario', imprevisto: true, fechaInicio: '2026-05-03' },
  // marcado imprevisto Y con pinta de factura: manda imprevisto
  { _id: 'seguro', concepto: 'Seguro: franquicia', tipoFrecuencia: 'mensual', imprevisto: true },
];

describe('qué cuenta como imprevisto', () => {
  it('un movimiento real solo si está marcado, es una salida, no es traspaso y no está asignado', () => {
    expect(esMovimientoImprevisto(mov({}))).toBe(true);
    expect(esMovimientoImprevisto(mov({ imprevisto: false }))).toBe(false);
    expect(esMovimientoImprevisto(mov({ importeCts: 5000 }))).toBe(false);
    expect(esMovimientoImprevisto(mov({ tipo: 'transferencia' }))).toBe(false);
    expect(esMovimientoImprevisto(mov({ estimacionId: 'luz' }))).toBe(false);
  });

  it('en el desglose del mes, los gastos marcados van a imprevistos antes que a facturas', () => {
    const d = desgloseDelMes(
      [ev({ sourceId: 'luz', cuantia: -60 }), ev({ sourceId: 'averia', cuantia: -250 }), ev({ sourceId: 'seguro', cuantia: -150 })],
      gastos,
      [],
      '2026-11-17',
      {
        movimientos: [
          mov({ _id: 'a' }),
          mov({ _id: 'b', fecha: '2026-11-20', concepto: 'TALLER ' }),
          mov({ _id: 'c', estimacionId: 'luz' }),
        ],
      },
    );
    expect(d.facturas.total).toBe(60);
    expect(d.imprevistos.total).toBe(250 + 150 + 120 + 120);
    // los dos del taller, en una sola fila con dos cargos
    const taller = d.imprevistos.partidas.find((p) => p.concepto === 'Taller');
    expect(taller).toMatchObject({ total: 240, fechas: ['2026-11-08', '2026-11-20'], vencido: 120 });
    expect(d.gastosTotales).toBe(60 + 640);
  });
});

describe('reserva para imprevistos', () => {
  const ingreso = ev({ tipo: 'ingreso', cuantia: 2000, sourceType: 'nomina', sourceId: 'n' });

  it('aparta la estimación menos lo ya gastado en imprevistos este mes', () => {
    const d = desgloseDelMes([ingreso, ev({ sourceId: 'luz', cuantia: -60 })], gastos, [], '2026-11-17', {
      movimientos: [mov({ importeCts: -4000 })],
      estimacionImprevistos: 100,
    });
    expect(d.imprevistos.total).toBe(40);
    expect(d.reservaImprevistos).toBe(60);
    expect(d.margen).toBe(2000 - 60 - 40 - 60);
  });

  it('si ya se ha gastado más de lo estimado, no reserva nada más', () => {
    const d = desgloseDelMes([ingreso], gastos, [], '2026-11-17', {
      movimientos: [mov({ importeCts: -30000 })],
      estimacionImprevistos: 100,
    });
    expect(d.reservaImprevistos).toBe(0);
    expect(d.margen).toBe(1700);
  });

  it('sin estimación no hay reserva', () => {
    expect(desgloseDelMes([ingreso], gastos, [], '2026-11-17').reservaImprevistos).toBe(0);
  });

  it('el acumulado suma imprevistos y reservas', () => {
    const a = desgloseDelMes([ingreso], gastos, [], '2026-11-17', { movimientos: [mov({})], estimacionImprevistos: 200 });
    const b = desgloseDelMes([ingreso], gastos, [], '2026-11-17', { movimientos: [mov({ fecha: '2026-10-02' })] });
    const acc = sumarDesgloses([a, b]);
    expect(acc.imprevistos.total).toBe(240);
    expect(acc.reservaImprevistos).toBe(80);
    expect(acc.margen).toBe(4000 - 240 - 80);
  });
});

describe('estimación de imprevistos', () => {
  const meses = mesesEntre('2025-11', '2026-10');
  const movimientos = [
    mov({ _id: '1', fecha: '2026-01-10', importeCts: -60000 }),
    mov({ _id: '2', fecha: '2026-06-10', importeCts: -24000 }),
    mov({ _id: '3', fecha: '2026-11-03', importeCts: -99900 }), // mes en curso: no entra
    mov({ _id: '4', fecha: '2025-10-30', importeCts: -50000 }), // hace más de 12 meses: no entra
  ];
  const porMes = desglosePorMeses([], gastos, [], meses, '2026-11-17', { movimientos });

  it('media de los 12 meses anteriores, sin el mes en curso', () => {
    const e = estimarImprevistos(porMes, '2026-11', '2025-01-01');
    expect(e).toMatchObject({ total: 840, meses: 12, mediaMensual: 70, desde: '2025-11', hasta: '2026-10' });
  });

  it('con menos de un año de seguimiento, divide entre los meses que hay', () => {
    const e = estimarImprevistos(porMes, '2026-11', '2026-05-20');
    // de mayo a octubre: 6 meses, solo entra lo de junio
    expect(e).toMatchObject({ total: 240, meses: 6, mediaMensual: 40, desde: '2026-05' });
  });

  it('sin ningún dato no hay estimación', () => {
    expect(estimarImprevistos(porMes, '2026-11', null)).toMatchObject({ mediaMensual: 0, meses: 0 });
    expect(estimarImprevistos(porMes, '2026-11', '2026-11-02')).toMatchObject({ mediaMensual: 0, meses: 0 });
  });

  it('el primer dato es el primer movimiento o el primer gasto imprevisto', () => {
    expect(primerDatoDeSeguimiento({ gastos, movimientos: [mov({ fecha: '2026-07-01' })] })).toBe('2026-05-03');
    expect(primerDatoDeSeguimiento({ gastos: [], movimientos: [mov({ fecha: '2026-07-01' }), mov({ fecha: '2026-02-01' })] })).toBe(
      '2026-02-01',
    );
  });

  it('mesEnCurso aplica la estimación como reserva del mes', () => {
    const generarExtracto = (desde: string, hasta: string) =>
      [
        ev({ fecha: '2026-11-28', tipo: 'ingreso', cuantia: 2000, sourceType: 'nomina', sourceId: 'n' }),
        ev({ fecha: '2026-03-15', sourceId: 'averia', cuantia: -360 }),
      ].filter((e) => e.fecha >= desde && e.fecha <= hasta);
    const { desglose, estimacion } = mesEnCurso(
      { generarExtracto, gastos, prestamos: [], movimientos: [mov({ fecha: '2026-11-03', importeCts: -1000 })], hoy: '2026-11-17' },
      generarExtracto('2026-11-01', '2026-11-30'),
    );
    // primer dato: la avería (2026-05-03) → de mayo a octubre, 6 meses; en marzo
    // no había seguimiento, así que su gasto queda fuera de la ventana
    expect(estimacion).toMatchObject({ meses: 6, total: 0, mediaMensual: 0 });
    expect(desglose.estimacionImprevistos).toBe(0);
    expect(desglose.imprevistos.total).toBe(10);
  });
});

describe('media del periodo', () => {
  const ingreso = (fecha: string) => ev({ fecha, tipo: 'ingreso', cuantia: 2000, sourceType: 'nomina', sourceId: 'n' });
  const meses = desglosePorMeses(
    [
      ingreso('2026-08-28'),
      ingreso('2026-09-28'),
      ingreso('2026-10-28'),
      ev({ fecha: '2026-08-10', sourceId: 'luz', cuantia: -60 }),
      ev({ fecha: '2026-09-10', sourceId: 'luz', cuantia: -70 }),
      ev({ fecha: '2026-10-10', sourceId: 'luz', cuantia: -80 }),
      ev({ fecha: '2026-09-14', sourceId: 'averia', cuantia: -600 }),
    ],
    gastos,
    [],
    ['2026-08', '2026-09', '2026-10'],
    '2026-11-17',
  ).map((m) => m.desglose);
  const media = mediaDeDesgloses(meses);

  it('divide cada grupo y cada concepto entre los meses del periodo, vacíos incluidos', () => {
    expect(media.ingresosNetos).toBe(2000);
    expect(media.facturas.total).toBe(70);
    expect(media.facturas.partidas[0]).toMatchObject({ concepto: 'Luz', total: 70, fechas: ['2026-08-10', '2026-09-10', '2026-10-10'] });
    // la avería solo pasó en septiembre, pero pesa en la media de los tres meses
    expect(media.imprevistos.total).toBe(200);
  });

  it('el margen cuadra con las cifras medias ya redondeadas', () => {
    expect(media.gastosTotales).toBe(270);
    expect(media.margen).toBe(1730);
    expect(media.margenPct).toBeCloseTo(86.5, 5);
  });

  it('redondea al céntimo', () => {
    const tres = desglosePorMeses(
      [ev({ fecha: '2026-08-10', sourceId: 'luz', cuantia: -100 })],
      gastos,
      [],
      ['2026-08', '2026-09', '2026-10'],
      '2026-11-17',
    );
    expect(mediaDeDesgloses(tres.map((m) => m.desglose)).facturas.total).toBe(33.33);
  });

  it('con un solo mes, la media es ese mes', () => {
    expect(mediaDeDesgloses([meses[0]])).toEqual(meses[0]);
  });
});
