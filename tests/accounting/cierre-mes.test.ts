import { beforeEach, describe, expect, it } from 'vitest';
import { cerrarMes, cerrarPeriodo, mesAnterior, mesesConDatos, mesesDelPeriodo, rangoDelMes } from '@/accounting/cierre-mes';
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

  it('las transferencias entre cuentas propias no cuentan como gasto ni ingreso real', () => {
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 130, 'Endesa', { tags: ['casa'] });
    // Traspaso a la otra cuenta donde luego se paga de verdad: no es gasto ni
    // "sin estimación", solo dinero cambiando de sitio.
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 300, concepto: 'Traspaso a Ahorro', tipo: 'transferencia' });
    ledger.registrar({
      fecha: '2026-07-05',
      cuentaId: 'default',
      importe: 300,
      concepto: 'Traspaso de Principal',
      tipo: 'transferencia',
      negativo: true,
    });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.real).toBe(130);
    expect(c.ingresosReales).toBe(0);
    expect(c.totalSinEstimacion).toBe(0);
    expect(c.sinEstimacion).toEqual([]);
  });

  it('ignora las estimaciones desactivadas, pero los ingresos sí cuentan', () => {
    store.addItem('expenses', gasto({ concepto: 'Vieja', cuantia: 50, activo: false }));
    store.addItem('expenses', gasto({ concepto: 'Nómina', cuantia: 1800, tipo: 'ingreso' }));
    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.filas.map((f) => [f.concepto, f.tipo])).toEqual([['Nómina', 'ingreso']]);
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

// El cierre no siempre es de un mes natural: la cabecera del dashboard tiene un
// intervalo configurable ("del 15 de abril al 20 de junio") y el cierre tiene
// que poder calcularse sobre él tal cual, sin obligar a cerrar mes a mes.
describe('cerrarPeriodo', () => {
  let ledger: Ledger;
  let store: ReturnType<typeof entorno>['store'];

  beforeEach(() => {
    const e = entorno();
    ledger = e.ledger;
    store = e.store;
  });

  it('suma el real de todos los meses del intervalo', () => {
    store.addItem('expenses', gasto()); // 100 €/mes, día 10
    registrar(ledger, '2026-04-10', 90, 'LUZ', { tags: ['casa'] });
    registrar(ledger, '2026-05-10', 110, 'LUZ', { tags: ['casa'] });
    registrar(ledger, '2026-06-10', 100, 'LUZ', { tags: ['casa'] });

    const c = cerrarPeriodo(ledger, store.get('expenses'), '2026-04-01', '2026-06-30');
    expect(c.real).toBe(300);
    expect(c.estimado).toBe(300); // tres pagos proyectados dentro del rango
    expect(c.desviacion).toBe(0);
  });

  it('un intervalo que corta el mes por la mitad no se lleva lo de antes', () => {
    store.addItem('expenses', gasto());
    registrar(ledger, '2026-04-10', 90, 'LUZ', { tags: ['casa'] });
    registrar(ledger, '2026-05-10', 110, 'LUZ', { tags: ['casa'] });
    registrar(ledger, '2026-06-10', 100, 'LUZ', { tags: ['casa'] });

    // Empieza el 15 de abril: el recibo del 10 de abril queda fuera, y el
    // estimado tampoco cuenta ese pago (si no, saldría una desviación falsa).
    const c = cerrarPeriodo(ledger, store.get('expenses'), '2026-04-15', '2026-06-20');
    expect(c.real).toBe(210);
    expect(c.estimado).toBe(200);
    expect(c.desviacion).toBe(10);
  });

  it('devuelve el intervalo que se ha cerrado y el mes en que empieza', () => {
    store.addItem('expenses', gasto());
    registrar(ledger, '2026-05-10', 110, 'LUZ', { tags: ['casa'] });
    const c = cerrarPeriodo(ledger, store.get('expenses'), '2026-04-15', '2026-06-20');
    expect(c.desde).toBe('2026-04-15');
    expect(c.hasta).toBe('2026-06-20');
    expect(c.mes).toBe('2026-04');
  });

  it('el gasto sin estimación también se agrupa en todo el intervalo', () => {
    registrar(ledger, '2026-04-20', 30, 'SUPER MERCADONA 123');
    registrar(ledger, '2026-05-02', 40, 'SUPER MERCADONA 998');

    const c = cerrarPeriodo(ledger, store.get('expenses'), '2026-04-01', '2026-06-30');
    expect(c.sinEstimacion).toHaveLength(1);
    expect(c.sinEstimacion[0].movimientos).toBe(2);
    expect(c.totalSinEstimacion).toBe(70);
  });

  it('un intervalo sin ningún movimiento se marca vacío', () => {
    store.addItem('expenses', gasto());
    registrar(ledger, '2026-04-10', 90, 'LUZ', { tags: ['casa'] });
    expect(cerrarPeriodo(ledger, store.get('expenses'), '2026-05-01', '2026-05-31').vacio).toBe(true);
  });

  it('cerrar el mes es cerrar su intervalo', () => {
    store.addItem('expenses', gasto());
    registrar(ledger, '2026-07-10', 120, 'LUZ', { tags: ['casa'] });
    const porMes = cerrarMes(ledger, store.get('expenses'), '2026-07');
    const porRango = cerrarPeriodo(ledger, store.get('expenses'), '2026-07-01', '2026-07-31');
    expect(porRango).toEqual(porMes);
  });
});

// Mirar solo los gastos daba una desviación enorme en cuanto había traspasos
// entre cuentas propias sin marcar: el cargo cuenta como gasto y el abono de la
// otra cuenta no lo compensaba en ninguna parte.
describe('el cierre también compara los ingresos', () => {
  let ledger: Ledger;
  let store: ReturnType<typeof entorno>['store'];

  beforeEach(() => {
    const e = entorno();
    ledger = e.ledger;
    store = e.store;
  });

  const ingreso = (extra: Partial<Expense> = {}) =>
    gasto({ tipo: 'ingreso', concepto: 'Nómina', cuantia: 2000, tags: ['nomina'], ...extra });

  it('las estimaciones de ingreso salen como filas propias', () => {
    store.addItem('expenses', ingreso());
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 2100, concepto: 'NOMINA', tipo: 'ingreso', tags: ['nomina'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    const fila = c.filas.find((f) => f.tipo === 'ingreso');
    expect(fila?.real).toBe(2100);
    expect(fila?.estimado).toBe(2000);
    expect(c.ingresosEstimados).toBe(2000);
    expect(c.desviacionIngresos).toBe(100);
  });

  it('el neto compensa el traspaso: sale gasto por un lado y entra por el otro', () => {
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100 }));
    registrar(ledger, '2026-07-10', 100, 'ENDESA', { tags: ['casa'] });
    // Traspaso a la otra cuenta sin marcar como transferencia: 300 fuera y 300 dentro.
    registrar(ledger, '2026-07-12', 300, 'TRASPASO A CUENTA 2');
    ledger.registrar({ fecha: '2026-07-12', cuentaId: 'default', importe: 300, concepto: 'TRASPASO DESDE CUENTA 1', tipo: 'ingreso' });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.real).toBe(400); // mirando solo el gasto, 300 de desviación
    expect(c.desviacion).toBe(300);
    expect(c.ingresosReales).toBe(300);
    expect(c.netoReal).toBe(-100);
    expect(c.netoEstimado).toBe(-100);
    expect(c.desviacionNeta).toBe(0); // en neto, clavado
  });

  it('el ingreso que no preveía ninguna estimación se agrupa aparte', () => {
    ledger.registrar({ fecha: '2026-07-12', cuentaId: 'default', importe: 300, concepto: 'BIZUM DE ANA', tipo: 'ingreso' });
    ledger.registrar({ fecha: '2026-07-19', cuentaId: 'default', importe: 50, concepto: 'BIZUM DE ANA 2', tipo: 'ingreso' });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.ingresosSinPrever).toHaveLength(1);
    expect(c.totalIngresosSinPrever).toBe(350);
  });

  it('una estimación de ingreso no se queda con un gasto por compartir etiqueta', () => {
    store.addItem('expenses', ingreso({ tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 100, 'ENDESA', { tags: ['casa'] });

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    expect(c.filas.find((f) => f.tipo === 'ingreso')?.real).toBe(0);
    expect(c.totalSinEstimacion).toBe(100);
  });
});

// «Lo previsto» no vive solo en `expenses`: la nómina está en su colección y la
// cuota del préstamo sale de su cuadro de amortización. Mientras el cierre solo
// miraba las estimaciones, los ingresos previstos salían a cero y la hipoteca
// aparecía como gasto imprevisto todos los meses.
describe('nóminas y préstamos también son previsión', () => {
  let ledger: Ledger;

  beforeEach(() => {
    ledger = entorno().ledger;
  });

  const nomina = {
    _id: 'n1',
    nombre: 'Sueldo',
    bruto: 30000,
    nPagas: 12,
    irpfModo: 'manual' as const,
    irpfPct: 15,
    representacion: 'simplificado' as const,
    fechaInicio: '2025-01-05',
    fechaFin: null,
    cuenta: 'default',
    activo: true,
    tags: ['nomina'],
    grupoNomina: '',
  };

  const prestamo = {
    _id: 'l1',
    nombre: 'Coche',
    capital: 12000,
    tin: 5,
    meses: 48,
    fechaInicio: '2025-06-01',
    comisionApertura: 0,
    comisionAmort: 0,
    amortizaciones: [],
    cuenta: 'default',
    tags: ['coche'],
    activo: true,
  };

  it('la nómina cuenta como ingreso previsto, por su neto', () => {
    const c = cerrarMes(ledger, [], '2026-07', { nominas: [nomina] });
    // 2500 brutos − SS 6,35 % (158,75) − IRPF 15 % (375) = 1966,25
    expect(c.ingresosEstimados).toBeCloseTo(1966.25, 2);
    expect(c.filas.find((f) => f.origen === 'nomina')?.concepto).toBe('Sueldo');
  });

  it('el ingreso real de la nómina se le asigna por etiqueta y deja de ser imprevisto', () => {
    ledger.registrar({
      fecha: '2026-07-05',
      cuentaId: 'default',
      importe: 1966.25,
      concepto: 'NOMINA JULIO',
      tipo: 'ingreso',
      tags: ['nomina'],
    });
    const c = cerrarMes(ledger, [], '2026-07', { nominas: [nomina] });
    expect(c.filas.find((f) => f.origen === 'nomina')?.real).toBeCloseTo(1966.25, 2);
    expect(c.ingresosSinPrever).toEqual([]);
    expect(c.desviacionNeta).toBeCloseTo(0, 2);
  });

  it('la cuota del préstamo es gasto previsto, no un imprevisto', () => {
    const c = cerrarMes(ledger, [], '2026-07', { loans: [prestamo] });
    const fila = c.filas.find((f) => f.origen === 'prestamo');
    expect(fila?.concepto).toBe('Cuota Coche');
    expect(fila?.estimado).toBeGreaterThan(0);

    registrar(ledger, '2026-07-01', fila?.estimado ?? 0, 'CUOTA COCHE', { tags: ['coche'] });
    const conPago = cerrarMes(ledger, [], '2026-07', { loans: [prestamo] });
    expect(conPago.sinEstimacion).toEqual([]);
    expect(conPago.desviacion).toBeCloseTo(0, 2);
  });

  it('ni la nómina ni el préstamo proponen ajuste: no son estimaciones ajustables', () => {
    const c = cerrarMes(ledger, [], '2026-07', { nominas: [nomina], loans: [prestamo] });
    expect(c.filas.every((f) => f.sugerencia === null)).toBe(true);
  });
});

describe('omitir conceptos del cierre', () => {
  let ledger: Ledger;

  beforeEach(() => {
    ledger = entorno().ledger;
  });

  it('un concepto omitido no cuenta como gasto ni sale en la lista', () => {
    registrar(ledger, '2026-07-10', 100, 'ENDESA');
    registrar(ledger, '2026-07-12', 300, 'TRASPASO A CUENTA 2');
    registrar(ledger, '2026-07-20', 250, 'TRASPASO A CUENTA 2');

    const c = cerrarMes(ledger, [], '2026-07', { omitidos: ['traspaso a cuenta'] });
    expect(c.real).toBe(100);
    expect(c.sinEstimacion.map((g) => g.concepto)).toEqual(['ENDESA']);
    expect(c.totalOmitido).toBe(550);
    expect(c.omitidos[0].movimientos).toBe(2);
  });

  it('cada grupo lleva su clave y los ids de sus movimientos, para asignarlos de una vez', () => {
    const a = registrar(ledger, '2026-07-10', 30, 'SUPER 1');
    const b = registrar(ledger, '2026-07-11', 40, 'SUPER 2');
    const c = cerrarMes(ledger, [], '2026-07');
    expect(c.sinEstimacion[0].clave).toBe('super');
    expect(c.sinEstimacion[0].ids.sort()).toEqual([a._id, b._id].sort());
  });
});

describe('duración del periodo y gasto por etiqueta', () => {
  it('mesesDelPeriodo cuenta los trozos de mes, no los días entre 30', () => {
    expect(mesesDelPeriodo('2026-07-01', '2026-07-31')).toBeCloseTo(1, 6);
    expect(mesesDelPeriodo('2026-04-01', '2026-06-30')).toBeCloseTo(3, 6);
    // Del 16 al 30 de abril es medio mes (15 de 30 días).
    expect(mesesDelPeriodo('2026-04-16', '2026-04-30')).toBeCloseTo(0.5, 6);
    expect(mesesDelPeriodo('2026-04-16', '2026-05-31')).toBeCloseTo(1.5, 6);
    expect(mesesDelPeriodo('2026-07-10', '2026-07-01')).toBe(0);
  });

  it('porTag compara previsto y real por etiqueta, incluido lo que nadie preveía', () => {
    const { store, ledger } = entorno();
    store.addItem('expenses', gasto({ concepto: 'Luz', cuantia: 100, tags: ['casa'] }));
    registrar(ledger, '2026-07-10', 130, 'ENDESA', { tags: ['casa'] });
    registrar(ledger, '2026-07-12', 60, 'BAR', { tags: ['ocio'] });
    registrar(ledger, '2026-07-13', 20, 'SIN NADA');

    const c = cerrarMes(ledger, store.get('expenses'), '2026-07');
    const porTag = Object.fromEntries(c.porTag.map((t) => [t.tag, t]));
    expect(porTag.casa).toMatchObject({ estimado: 100, real: 130, desviacion: 30 });
    expect(porTag.ocio).toMatchObject({ estimado: 0, real: 60 });
    expect(porTag['sin etiqueta']).toMatchObject({ real: 20 });
  });
});
