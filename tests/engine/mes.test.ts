import { describe, expect, it } from 'vitest';
import { desgloseDelMes, esFactura, mesesDeCalendario } from '@/engine/mes';
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

describe('esFactura', () => {
  const g = (extra: object) => ({ _id: 'a', concepto: 'Cosa', tipoFrecuencia: 'mensual', frecuencia: 1, tags: [], ...extra });
  it('la marca explícita manda en los dos sentidos', () => {
    expect(esFactura(g({ concepto: 'Cena', esFactura: true }))).toBe(true);
    expect(esFactura(g({ concepto: 'Luz', esFactura: false }))).toBe(false);
  });
  it('reconoce recibos por el concepto, con o sin acentos y por palabra entera', () => {
    for (const c of ['Luz y gas', 'Seguro del coche', 'Alquiler piso', 'Teléfono móvil', 'IBI', 'Suscripción Netflix'])
      expect(esFactura(g({ concepto: c })), c).toBe(true);
    // «gas» dentro de otra palabra no cuenta
    for (const c of ['Gasolina', 'Regalos', 'Aguacates']) expect(esFactura(g({ concepto: c })), c).toBe(false);
  });
  it('reconoce recibos por la etiqueta', () => {
    expect(esFactura(g({ concepto: 'Mapfre', tags: ['seguros'] }))).toBe(true);
  });
  it('un presupuesto mensual sin día fijo no es una factura', () => {
    expect(esFactura(g({ concepto: 'Supermercado', basico: true, clasificacion: 'necesidad' }))).toBe(false);
  });
  it('con día de cargo fijo y siendo necesidad, sí', () => {
    expect(esFactura(g({ concepto: 'Fisio', diaPago: 'dia:5', clasificacion: 'necesidad' }))).toBe(true);
    expect(esFactura(g({ concepto: 'Capricho', diaPago: 'dia:5', clasificacion: 'deseo' }))).toBe(false);
  });
  it('lo puntual y lo que va por días nunca es factura automática', () => {
    expect(esFactura(g({ concepto: 'Seguro', tipoFrecuencia: 'extraordinario' }))).toBe(false);
    expect(esFactura(g({ concepto: 'Luz', tipoFrecuencia: 'diaria', frecuencia: 7 }))).toBe(false);
  });
});

describe('desgloseDelMes', () => {
  const gastos = [
    { _id: 'luz', concepto: 'Luz', tipoFrecuencia: 'mensual' },
    { _id: 'super', concepto: 'Supermercado', tipoFrecuencia: 'mensual', clasificacion: 'necesidad' },
    { _id: 'cafe', concepto: 'Café', tipoFrecuencia: 'diaria', frecuencia: 7 },
  ];
  const prestamos = [{ _id: 'hip', nombre: 'Hipoteca' }];
  const eventos = [
    ev({ tipo: 'ingreso', cuantia: 3000, sourceType: 'nomina', sourceId: 'n1', fecha: '2026-11-28' }),
    ev({ cuantia: -400, sourceType: 'nomina', sourceId: 'n1', concepto: 'IRPF', tags: ['fiscal'], fecha: '2026-11-28' }),
    ev({ cuantia: -200, sourceType: 'nomina', sourceId: 'n1', concepto: 'SS', tags: ['fiscal'], fecha: '2026-11-28' }),
    ev({ cuantia: -700, sourceType: 'loan', sourceId: 'hip', fecha: '2026-11-01' }),
    ev({ cuantia: -90.1, sourceId: 'luz', fecha: '2026-11-10' }),
    ev({ cuantia: -420.2, sourceId: 'super', fecha: '2026-11-03' }),
    ev({ cuantia: -3, sourceId: 'cafe', fecha: '2026-11-06' }),
    ev({ cuantia: -3, sourceId: 'cafe', fecha: '2026-11-20' }),
    ev({ cuantia: -300, sourceType: 'transfer-out', sourceId: 't' }),
    ev({ tipo: 'ingreso', cuantia: 300, sourceType: 'transfer-in', sourceId: 't' }),
    ev({ cuantia: -100, sourceType: 'aportacion-out', sourceId: 'p' }),
    ev({ tipo: 'ingreso', cuantia: 100, sourceType: 'aportacion-in', sourceId: 'p' }),
  ];

  const d = desgloseDelMes(eventos, gastos, prestamos, '2026-11-16');

  it('los ingresos son netos de las retenciones de la nómina', () => {
    expect(d.ingresosNetos).toBe(2400);
  });
  it('separa préstamos, facturas y resto, sin contar movimientos internos', () => {
    expect(d.prestamos.total).toBe(700);
    expect(d.prestamos.partidas[0].concepto).toBe('Hipoteca');
    expect(d.facturas.total).toBe(90.1);
    expect(d.otros.total).toBe(426.2);
    expect(d.otros.partidas.map((p) => p.concepto)).toEqual(['Supermercado', 'Café']);
    expect(d.otros.partidas[1].fechas).toEqual(['2026-11-06', '2026-11-20']);
  });
  it('lo vencido y lo pendiente suman el total de cada bloque', () => {
    expect(d.prestamos).toMatchObject({ vencido: 700, pendiente: 0 });
    expect(d.otros).toMatchObject({ vencido: 423.2, pendiente: 3 });
    for (const b of [d.prestamos, d.facturas, d.otros]) expect(b.vencido + b.pendiente).toBeCloseTo(b.total, 10);
  });
  it('el margen cuadra al céntimo', () => {
    expect(d.gastosTotales).toBe(1216.3);
    expect(d.margen).toBe(1183.7);
    expect(d.margenPct).toBeCloseTo(49.32, 2);
  });
  it('no depende del día en que se mira, salvo el reparto vencido/pendiente', () => {
    const principio = desgloseDelMes(eventos, gastos, prestamos, '2026-11-01');
    const fin = desgloseDelMes(eventos, gastos, prestamos, '2026-11-30');
    expect(principio.margen).toBe(fin.margen);
    expect(principio.gastosTotales).toBe(fin.gastosTotales);
    expect(fin.otros.pendiente).toBe(0);
  });
  it('sin ingresos no hay porcentaje', () => {
    expect(desgloseDelMes([], [], [], '2026-11-16').margenPct).toBeNull();
  });
});

describe('mesesDeCalendario', () => {
  it('meses naturales completos dan un entero exacto', () => {
    expect(mesesDeCalendario('2026-09-01', '2027-12-31')).toBe(16);
    expect(mesesDeCalendario('2026-02-01', '2026-02-28')).toBe(1);
    expect(mesesDeCalendario('2024-02-01', '2024-02-29')).toBe(1);
    expect(mesesDeCalendario('2026-01-01', '2026-12-31')).toBe(12);
  });
  it('de un día al anterior del mismo día, N meses exactos', () => {
    expect(mesesDeCalendario('2026-11-16', '2027-11-15')).toBe(12);
    expect(mesesDeCalendario('2026-11-16', '2026-12-15')).toBe(1);
  });
  it('el pico se mide en días del mes en que cae', () => {
    expect(mesesDeCalendario('2026-11-16', '2027-11-16')).toBeCloseTo(12 + 1 / 30, 10);
    expect(mesesDeCalendario('2026-11-01', '2026-11-15')).toBeCloseTo(0.5, 10);
  });
  it('fin de mes sin día equivalente no descuadra', () => {
    expect(mesesDeCalendario('2026-01-31', '2026-02-27')).toBeCloseTo(27 / 28 + 0, 1);
    expect(mesesDeCalendario('2026-01-31', '2026-03-30')).toBe(2);
  });
  it('mover el periodo unos días no cambia el número de meses', () => {
    expect(mesesDeCalendario('2026-03-10', '2027-03-09')).toBe(mesesDeCalendario('2026-03-13', '2027-03-12'));
  });
});
