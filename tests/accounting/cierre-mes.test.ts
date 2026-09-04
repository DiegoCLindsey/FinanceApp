import { beforeEach, describe, expect, it } from 'vitest';
import { cerrarMes, mesAnterior, mesesConDatos, rangoDelMes } from '@/accounting/cierre-mes';
import { createLedger, type Ledger } from '@/accounting/ledger';
import { createPrecisionAnalyzer } from '@/accounting/precision';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import type { Expense } from '@/state/schema';

const HOY = new Date(2026, 7, 15); // 2026-08-15

const gasto = (extra: Partial<Expense> = {}): Omit<Expense, '_id'> => ({
  concepto: 'Luz',
  cuantia: 100,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  frecuencia: 1,
  fechaInicio: '2025-01-10',
  fechaFin: null,
  tags: ['casa'],
  activo: true,
  ...extra,
});

function entorno() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const ledger = createLedger(store);
  return { store, ledger };
}

const registrar = (ledger: Ledger, fecha: string, importe: number, concepto: string, extra: Record<string, unknown> = {}) =>
  ledger.registrar({ fecha, cuentaId: 'default', importe, concepto, tipo: 'gasto', ...extra });

describe('rangoDelMes', () => {
  it('primer y último día', () => {
    expect(rangoDelMes('2026-07')).toEqual({ desde: '2026-07-01', hasta: '2026-07-31' });
    expect(rangoDelMes('2026-02')).toEqual({ desde: '2026-02-01', hasta: '2026-02-28' });
  });

  it('febrero de un año bisiesto', () => {
    expect(rangoDelMes('2028-02').hasta).toBe('2028-02-29');
  });
});

describe('mesAnterior', () => {
  it('el mes de antes', () => {
    expect(mesAnterior('2026-08-15')).toBe('2026-07');
  });

  it('cruza el año hacia atrás', () => {
    expect(mesAnterior('2026-01-03')).toBe('2025-12');
  });
});

describe('cerrarMes', () => {
  let ledger: Ledger;
  let store: ReturnType<typeof entorno>['store'];

  beforeEach(() => {
    const e = entorno();
    ledger = e.ledger;
    store = e.store;
  });

  it('un mes sin movimientos se marca vacío', () => {
    store.addItem('expenses', gasto());
    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.vacio).toBe(true);
    expect(c.real).toBe(0);
  });

  it('compara estimado con real por estimación', () => {
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    registrar(ledger, '2026-07-10', 130, 'Endesa julio', { estimacionId: luz._id });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.estimado).toBe(100);
    expect(c.real).toBe(130);
    expect(c.desviacion).toBe(30);
    expect(c.filas[0]).toMatchObject({ concepto: 'Luz', estimado: 100, real: 130, desviacion: 30, sinMovimiento: false });
  });

  it('relaciona por etiqueta cuando no hay nada asignado', () => {
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 130, 'Endesa julio', { tags: ['casa'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.filas[0].real).toBe(130);
  });

  it('una estimación sin movimiento real se marca, no se esconde', () => {
    store.addItem('expenses', gasto({ concepto: 'Gimnasio', cuantia: 45, tags: ['salud'] }));
    registrar(ledger, '2026-07-10', 20, 'OTRA COSA', { tags: ['ocio'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    const fila = c.filas.find((f) => f.concepto === 'Gimnasio');
    expect(fila).toMatchObject({ sinMovimiento: true, real: 0, estimado: 45, desviacion: -45 });
  });

  it('agrupa el gasto que ninguna estimación preveía', () => {
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-02', 30, 'BAR PEPE 123', { tags: ['ocio'] });
    registrar(ledger, '2026-07-09', 25, 'BAR PEPE 456', { tags: ['ocio'] });
    registrar(ledger, '2026-07-20', 80, 'ZAPATOS', { tags: ['ropa'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.totalSinEstimacion).toBe(135);
    // Agrupado por concepto normalizado (sin los dígitos) y de mayor a menor.
    expect(c.sinEstimacion[0]).toMatchObject({ total: 80, movimientos: 1 });
    expect(c.sinEstimacion[1]).toMatchObject({ total: 55, movimientos: 2 });
  });

  it('un movimiento no se cuenta dos veces', () => {
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 130, 'Endesa', { estimacionId: luz._id, tags: ['casa'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.totalSinEstimacion).toBe(0);
    expect(c.real).toBe(130);
  });

  it('ordena por la desviación que más duele', () => {
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['luz'] }));
    store.addItem('expenses', gasto({ concepto: 'Súper', cuantia: 400, tags: ['super'] }));
    registrar(ledger, '2026-07-10', 105, 'LUZ', { tags: ['luz'] });
    registrar(ledger, '2026-07-11', 600, 'SUPER', { tags: ['super'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.filas[0].concepto).toBe('Súper'); // +200 duele más que +5
  });

  it('los ingresos van aparte del gasto', () => {
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 130, 'Endesa', { tags: ['casa'] });
    ledger.registrar({ fecha: '2026-07-25', cuentaId: 'default', importe: 1800, concepto: 'NOMINA', tipo: 'ingreso' });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.real).toBe(130); // el ingreso no ensucia el gasto
    expect(c.ingresosReales).toBe(1800);
  });

  it('ignora las estimaciones desactivadas y las que no son gasto', () => {
    store.addItem('expenses', gasto({ concepto: 'Vieja', cuantia: 50, activo: false }));
    store.addItem('expenses', gasto({ concepto: 'Nómina', cuantia: 1800, tipo: 'ingreso' }));
    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.filas).toHaveLength(0);
  });

  it('no mezcla meses', () => {
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    registrar(ledger, '2026-06-10', 500, 'JUNIO', { estimacionId: luz._id });
    registrar(ledger, '2026-07-10', 130, 'JULIO', { estimacionId: luz._id });

    expect(cerrarMes(ledger, store.get('expenses'), '2026-07').real).toBe(130);
    expect(cerrarMes(ledger, store.get('expenses'), '2026-06').real).toBe(500);
  });

  it('propone ajuste cuando la desviación es sistemática', () => {
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    for (const mes of ['2026-04', '2026-05', '2026-06', '2026-07']) {
      registrar(ledger, `${mes}-10`, 150, `Endesa ${mes}`, { estimacionId: luz._id });
    }
    const precision = createPrecisionAnalyzer(ledger);
    const analisis = precision.analizarTodas(store.get('expenses'), { hoy: '2026-08-15' });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07', { analisis, hoy: '2026-08-15' });
    const fila = c.filas[0];
    expect(fila.sugerencia).not.toBeNull();
    expect(fila.sugerencia?.cuantiaSugerida).toBeGreaterThan(100);
  });

  it('sin análisis no inventa sugerencias', () => {
    const luz = store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    registrar(ledger, '2026-07-10', 150, 'Endesa', { estimacionId: luz._id });
    expect(cerrarMes(ledger, store.get('expenses'), '2026-07').filas[0].sugerencia).toBeNull();
  });
});

describe('mesesConDatos', () => {
  it('devuelve los meses con movimientos, del más nuevo al más viejo', () => {
    const { ledger } = entorno();
    registrar(ledger, '2026-05-10', 10, 'A');
    registrar(ledger, '2026-07-10', 10, 'B');
    registrar(ledger, '2026-07-20', 10, 'C');
    expect(mesesConDatos(ledger)).toEqual(['2026-07', '2026-05']);
  });

  it('sin movimientos, lista vacía', () => {
    expect(mesesConDatos(entorno().ledger)).toEqual([]);
  });
});

describe('cerrarMes · un movimiento cuenta como mucho para UNA estimación', () => {
  let ledger: Ledger;
  let store: ReturnType<typeof entorno>['store'];

  beforeEach(() => {
    const e = entorno();
    ledger = e.ledger;
    store = e.store;
  });

  it('las filas más lo no previsto suman exactamente el gasto real', () => {
    // Dos estimaciones que comparten etiqueta: antes el mismo recibo se contaba
    // en las dos y la pantalla dejaba de cuadrar.
    store.addItem('expenses', gasto({ concepto: 'Alquiler', cuantia: 950, tags: ['vivienda'] }));
    store.addItem('expenses', gasto({ concepto: 'Reforma', cuantia: 3200, tags: ['vivienda'] }));
    registrar(ledger, '2026-07-01', 950, 'ALQUILER', { tags: ['vivienda'] });
    registrar(ledger, '2026-07-18', 62, 'BAR', { tags: [] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    const sumaFilas = c.filas.reduce((s, f) => s + f.real, 0);
    expect(sumaFilas + c.totalSinEstimacion).toBe(c.real);
    expect(c.real).toBe(1012);
  });

  it('gana la estimación que comparte más etiquetas', () => {
    store.addItem('expenses', gasto({ concepto: 'Genérica', cuantia: 100, tags: ['casa'] }));
    store.addItem('expenses', gasto({ concepto: 'Específica', cuantia: 100, tags: ['casa', 'luz'] }));
    registrar(ledger, '2026-07-10', 130, 'ENDESA', { tags: ['casa', 'luz'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.filas.find((f) => f.concepto === 'Específica')?.real).toBe(130);
    expect(c.filas.find((f) => f.concepto === 'Genérica')?.real).toBe(0);
  });

  it('la asignación explícita gana a cualquier coincidencia por etiqueta', () => {
    const alq = store.addItem('expenses', gasto({ concepto: 'Alquiler', cuantia: 950, tags: ['vivienda'] }));
    store.addItem('expenses', gasto({ concepto: 'Reforma', cuantia: 3200, tags: ['vivienda', 'obras'] }));
    registrar(ledger, '2026-07-01', 950, 'ALQUILER', { tags: ['vivienda', 'obras'], estimacionId: alq._id });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.filas.find((f) => f.concepto === 'Alquiler')?.real).toBe(950);
    expect(c.filas.find((f) => f.concepto === 'Reforma')?.real).toBe(0);
  });

  it('el reparto no depende del orden de las estimaciones', () => {
    const a = gasto({ concepto: 'A', cuantia: 100, tags: ['x'] });
    const b = gasto({ concepto: 'B', cuantia: 100, tags: ['x'] });
    registrar(ledger, '2026-07-10', 50, 'PAGO', { tags: ['x'] });

    store.addItem('expenses', a);
    store.addItem('expenses', b);
    const primero = cerrarMes(ledger, store.get('expenses'), '2026-07');
    const alReves = cerrarMes(ledger, [...store.get('expenses')].reverse(), '2026-07');

    const real = (c: typeof primero, concepto: string) => c.filas.find((f) => f.concepto === concepto)?.real;
    expect(real(primero, 'A')).toBe(real(alReves, 'A'));
    expect(real(primero, 'B')).toBe(real(alReves, 'B'));
  });
});
