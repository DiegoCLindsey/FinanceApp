// Análisis de precisión de estimaciones, tags compartidos y ajuste automático
// (F4, tareas 4.2, 4.5, 4.6 y 4.7).
import { describe, it, expect, beforeEach } from 'vitest';
import { createLedger } from '@/accounting/ledger';
import { createPrecisionAnalyzer, precisionMes } from '@/accounting/precision';
import { createAdjuster, sugerirAjuste } from '@/accounting/adjust';
import { createTagService, normalizarTag } from '@/accounting/tags';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import type { Expense } from '@/state/schema';

const HOY = new Date(2026, 6, 30); // 2026-07-30
const HOY_ISO = '2026-07-30';

const estimacion = (over: Partial<Expense> = {}): Expense => ({
  _id: 'e1',
  concepto: 'Luz',
  cuantia: 100,
  tipo: 'gasto',
  tipoFrecuencia: 'mensual',
  frecuencia: 1,
  fechaInicio: '2025-01-10',
  fechaFin: null,
  tags: ['casa'],
  activo: true,
  ...over,
});

function entorno(expenses: Expense[] = [estimacion()]) {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.set('expenses', expenses);
  const ledger = createLedger(store);
  return { store, ledger, precision: createPrecisionAnalyzer(ledger), adjuster: createAdjuster(store), tags: createTagService(store) };
}

describe('precisión de un mes', () => {
  it('acierto exacto es 100 y el error se resta proporcionalmente', () => {
    expect(precisionMes(100, 100)).toBe(100);
    expect(precisionMes(100, 90)).toBe(90);
    expect(precisionMes(100, 110)).toBe(90); // el error es simétrico
    expect(precisionMes(100, 150)).toBe(50);
  });
  it('se acota a [0,100] cuando el error supera el 100 %', () => {
    expect(precisionMes(100, 250)).toBe(0);
    expect(precisionMes(100, 0)).toBe(0);
  });
  it('estimado 0: 100 si no hubo gasto, 0 si lo hubo', () => {
    expect(precisionMes(0, 0)).toBe(100);
    expect(precisionMes(0, 30)).toBe(0);
  });
});

describe('análisis por estimación', () => {
  let env: ReturnType<typeof entorno>;
  beforeEach(() => {
    env = entorno();
  });

  it('solo compara meses cerrados que tengan dato real', () => {
    const { ledger, precision } = env;
    // Reales en mayo y junio; julio (mes en curso) no debe contar
    ledger.registrar({ fecha: '2026-05-10', cuentaId: 'default', importe: 120, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 130, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 999, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });

    const a = precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    expect(a.meses.map((m) => m.mes)).toEqual(['2026-05', '2026-06']);
    expect(a.meses[0]).toEqual({ mes: '2026-05', estimado: 100, real: 120, desviacion: 20, precision: 80 });
    expect(a.estimadoTotal).toBe(200);
    expect(a.realTotal).toBe(250);
    expect(a.desviacionTotal).toBe(50);
    expect(a.infraestimada).toBe(true);
  });

  it('una estimación sin datos reales no tiene precisión (no es un 0 %)', () => {
    const a = env.precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    expect(a.meses).toEqual([]);
    expect(a.precision).toBeNull();
    expect(a.mediaRealReciente).toBeNull();
  });

  it('la precisión agregada se pondera por el importe estimado', () => {
    const { ledger, precision } = env;
    // Estimación con frecuencia mensual de 100 €: mayo perfecto, junio a la mitad
    ledger.registrar({ fecha: '2026-05-10', cuentaId: 'default', importe: 100, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 50, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    const a = precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    // (100*100 + 50*100) / 200 = 75
    expect(a.precision).toBeCloseTo(75, 10);
  });

  it('usa el importe que proyecta el motor, no la cuantía nominal', () => {
    const { ledger, precision } = env;
    // Bimestral: en un mes sin pago el estimado es 0
    const exp = estimacion({ frecuencia: 2, fechaInicio: '2026-01-10' });
    ledger.registrar({ fecha: '2026-05-10', cuentaId: 'default', importe: 100, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 10, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    const a = precision.analizarEstimacion(exp, { hoy: HOY_ISO });
    expect(a.meses.find((m) => m.mes === '2026-05')?.estimado).toBe(100);
    expect(a.meses.find((m) => m.mes === '2026-06')?.estimado).toBe(0); // no toca pago
  });

  it('si no hay transacciones asignadas, relaciona por etiqueta', () => {
    const { ledger, precision } = env;
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 140, concepto: 'Endesa', tipo: 'gasto', tags: ['casa'] });
    const a = precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    expect(a.meses).toHaveLength(1);
    expect(a.meses[0].real).toBe(140);
  });

  it('la asignación explícita tiene prioridad sobre las etiquetas', () => {
    const { ledger, precision } = env;
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 140, concepto: 'Endesa', tipo: 'gasto', tags: ['casa'] });
    ledger.registrar({ fecha: '2026-06-15', cuentaId: 'default', importe: 90, concepto: 'Luz real', tipo: 'gasto', estimacionId: 'e1' });
    const a = precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    expect(a.meses[0].real).toBe(90); // ignora la de solo-tag
  });

  it('mediaRealReciente usa los últimos N meses comparables', () => {
    const { ledger, precision } = env;
    for (const [fecha, importe] of [
      ['2026-02-10', 60],
      ['2026-03-10', 100],
      ['2026-04-10', 110],
      ['2026-05-10', 120],
      ['2026-06-10', 130],
    ] as [string, number][]) {
      ledger.registrar({ fecha, cuentaId: 'default', importe, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    }
    const a = precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO, mesesMedia: 3 });
    expect(a.mediaRealReciente).toBe(120); // (110+120+130)/3
    const b = precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO, mesesMedia: 2 });
    expect(b.mediaRealReciente).toBe(125);
  });

  it('analizarTodas ordena por peor precisión y deja sin datos al final', () => {
    const exps = [
      estimacion({ _id: 'buena', concepto: 'Buena' }),
      estimacion({ _id: 'mala', concepto: 'Mala' }),
      estimacion({ _id: 'nueva', concepto: 'Nueva' }),
    ];
    const env2 = entorno(exps);
    env2.ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 100, concepto: 'x', tipo: 'gasto', estimacionId: 'buena' });
    env2.ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 300, concepto: 'y', tipo: 'gasto', estimacionId: 'mala' });

    const orden = env2.precision.analizarTodas(exps, { hoy: HOY_ISO }).map((a) => a.estimacionId);
    expect(orden).toEqual(['mala', 'buena', 'nueva']);
  });

  it('ignora las transferencias', () => {
    const exps = [estimacion({ _id: 't1', tipo: 'transferencia' })];
    const env2 = entorno(exps);
    expect(env2.precision.analizarTodas(exps, { hoy: HOY_ISO })).toHaveLength(0);
  });
});

describe('precisión agregada por etiqueta', () => {
  it('suma las estimaciones de cada tag y pondera su precisión', () => {
    const exps = [
      estimacion({ _id: 'e1', concepto: 'Luz', tags: ['casa', 'energia'] }),
      estimacion({ _id: 'e2', concepto: 'Agua', cuantia: 50, tags: ['casa'] }),
    ];
    const env2 = entorno(exps);
    // Luz: estimado 100, real 150 → precisión 50
    env2.ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 150, concepto: 'l', tipo: 'gasto', estimacionId: 'e1' });
    // Agua: estimado 50, real 50 → precisión 100
    env2.ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 50, concepto: 'a', tipo: 'gasto', estimacionId: 'e2' });

    const analisis = env2.precision.analizarTodas(exps, { hoy: HOY_ISO });
    const porTag = env2.precision.analizarPorTag(analisis);

    const casa = porTag.find((t) => t.tag === 'casa');
    expect(casa?.estimadoTotal).toBe(150);
    expect(casa?.realTotal).toBe(200);
    expect(casa?.estimaciones).toBe(2);
    // (50*100 + 100*50) / 150 = 66.67
    expect(casa?.precision).toBeCloseTo(66.6667, 3);

    const energia = porTag.find((t) => t.tag === 'energia');
    expect(energia?.precision).toBe(50);
    expect(energia?.estimaciones).toBe(1);
  });
});

describe('sugerencia de ajuste', () => {
  it('sugiere la media real reciente cuando la precisión es baja', () => {
    const env2 = entorno();
    for (const [fecha, importe] of [
      ['2026-04-10', 150],
      ['2026-05-10', 160],
      ['2026-06-10', 170],
    ] as [string, number][]) {
      env2.ledger.registrar({ fecha, cuentaId: 'default', importe, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    }
    const a = env2.precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    const s = sugerirAjuste(a, 100);

    expect(s).not.toBeNull();
    expect(s?.cuantiaSugerida).toBe(160);
    expect(s?.diferencia).toBe(60);
    expect(s?.variacionPct).toBeCloseTo(60, 10);
    expect(s?.motivo).toContain('supera');
  });

  it('no sugiere nada si la precisión ya es buena', () => {
    const env2 = entorno();
    env2.ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 100, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    const a = env2.precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    expect(sugerirAjuste(a, 100)).toBeNull();
  });

  it('no sugiere nada sin datos ni por variaciones insignificantes', () => {
    const env2 = entorno();
    const sinDatos = env2.precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    expect(sugerirAjuste(sinDatos, 100)).toBeNull();

    // Real 102 sobre estimado 100: precisión 98 → por encima del umbral
    env2.ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 102, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    const casi = env2.precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    expect(sugerirAjuste(casi, 100)).toBeNull();
    // Bajando el umbral sí entra, pero la variación (2 %) sigue siendo pequeña
    expect(sugerirAjuste(casi, 100, { umbralPrecision: 99, variacionMinimaPct: 5 })).toBeNull();
    expect(sugerirAjuste(casi, 100, { umbralPrecision: 99, variacionMinimaPct: 1 })).not.toBeNull();
  });

  it('detecta también la sobreestimación', () => {
    const env2 = entorno();
    env2.ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 40, concepto: 'Luz', tipo: 'gasto', estimacionId: 'e1' });
    const a = env2.precision.analizarEstimacion(estimacion(), { hoy: HOY_ISO });
    const s = sugerirAjuste(a, 100);
    expect(s?.cuantiaSugerida).toBe(40);
    expect(s?.diferencia).toBe(-60);
    expect(s?.motivo).toContain('inferior');
  });
});

describe('aplicar ajuste', () => {
  it('cierra la estimación hoy y crea la copia ajustada enlazada', () => {
    const env2 = entorno([estimacion({ fechaFin: '2027-12-31' })]);
    const { estimacionCerrada, estimacionNueva } = env2.adjuster.aplicar('e1', 160, { hoy: HOY_ISO });

    expect(estimacionCerrada.fechaFin).toBe(HOY_ISO);
    expect(estimacionCerrada.cuantia).toBe(100);
    expect(estimacionNueva.fechaInicio).toBe(HOY_ISO);
    expect(estimacionNueva.fechaFin).toBe('2027-12-31'); // hereda el fin original
    expect(estimacionNueva.cuantia).toBe(160);
    expect(estimacionNueva.ajustadaDesdeId).toBe('e1');
    expect(estimacionNueva.ajustadaEn).toBe(HOY_ISO);
    expect(estimacionNueva._id).not.toBe('e1');

    const expenses = env2.store.get('expenses');
    expect(expenses).toHaveLength(2);
    // Hereda el resto de la configuración
    expect(estimacionNueva.tags).toEqual(['casa']);
    expect(estimacionNueva.cuenta).toBe(estimacionCerrada.cuenta);
  });

  it('una estimación sin fechaFin genera una copia sin fechaFin', () => {
    const env2 = entorno([estimacion({ fechaFin: null })]);
    const { estimacionNueva } = env2.adjuster.aplicar('e1', 160, { hoy: HOY_ISO });
    expect(estimacionNueva.fechaFin).toBeNull();
  });

  it('lanza un error claro si la estimación no existe', () => {
    const env2 = entorno();
    expect(() => env2.adjuster.aplicar('nope', 10)).toThrow(/no existe/);
  });

  it('el pasado sigue proyectándose con la estimación antigua', () => {
    // Es el motivo de cerrar en vez de sobrescribir: la desviación histórica
    // se mantiene comparable.
    const env2 = entorno();
    env2.adjuster.aplicar('e1', 160, { hoy: HOY_ISO });
    const [antigua, nueva] = env2.store.get('expenses');
    expect(antigua.cuantia).toBe(100);
    expect(antigua.fechaFin).toBe(HOY_ISO);
    expect(nueva.cuantia).toBe(160);
    expect(nueva.fechaInicio).toBe(HOY_ISO);
  });

  it('aplicarTodas ajusta en bloque y reporta los fallos', () => {
    const exps = [estimacion({ _id: 'a', concepto: 'A' }), estimacion({ _id: 'b', concepto: 'B' })];
    const env2 = entorno(exps);
    const sugerencias = [
      {
        estimacionId: 'a',
        concepto: 'A',
        cuantiaActual: 100,
        cuantiaSugerida: 150,
        diferencia: 50,
        variacionPct: 50,
        precision: 50,
        mesesConsiderados: 1,
        motivo: 'x',
      },
      {
        estimacionId: 'b',
        concepto: 'B',
        cuantiaActual: 100,
        cuantiaSugerida: 80,
        diferencia: -20,
        variacionPct: -20,
        precision: 80,
        mesesConsiderados: 1,
        motivo: 'y',
      },
      {
        estimacionId: 'fantasma',
        concepto: '?',
        cuantiaActual: 0,
        cuantiaSugerida: 0,
        diferencia: 0,
        variacionPct: 0,
        precision: 0,
        mesesConsiderados: 0,
        motivo: 'z',
      },
    ];
    const { aplicadas, errores } = env2.adjuster.aplicarTodas(sugerencias, { hoy: HOY_ISO });

    expect(aplicadas).toHaveLength(2);
    expect(errores).toHaveLength(1);
    expect(errores[0].estimacionId).toBe('fantasma');
    expect(env2.store.get('expenses')).toHaveLength(4); // 2 cerradas + 2 nuevas
  });

  it('cadena devuelve el historial de ajustes en orden', () => {
    const env2 = entorno();
    const primero = env2.adjuster.aplicar('e1', 150, { hoy: '2026-03-01' });
    const segundo = env2.adjuster.aplicar(primero.estimacionNueva._id, 180, { hoy: HOY_ISO });

    const cadena = env2.adjuster.cadena(segundo.estimacionNueva._id);
    expect(cadena.map((e) => e.cuantia)).toEqual([100, 150, 180]);
    // Da igual desde qué eslabón se pregunte
    expect(env2.adjuster.cadena('e1').map((e) => e.cuantia)).toEqual([100, 150, 180]);
  });
});

describe('servicio de etiquetas compartido', () => {
  it('normaliza a minúsculas y sin espacios', () => {
    expect(normalizarTag('  Casa  ')).toBe('casa');
    expect(normalizarTag('LUZ')).toBe('luz');
  });

  it('el uso agrega estimaciones y transacciones en el mismo espacio de nombres', () => {
    const env2 = entorno([estimacion({ tags: ['casa', 'luz'] })]);
    env2.ledger.registrar({ fecha: '2026-06-01', cuentaId: 'default', importe: 10, concepto: 'x', tipo: 'gasto', tags: ['casa'] });
    env2.ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 10, concepto: 'y', tipo: 'gasto', tags: ['ocio'] });

    const uso = env2.tags.uso();
    expect(uso.find((u) => u.tag === 'casa')).toEqual({ tag: 'casa', estimaciones: 1, reales: 1, total: 2 });
    expect(uso.find((u) => u.tag === 'luz')).toEqual({ tag: 'luz', estimaciones: 1, reales: 0, total: 1 });
    expect(uso.find((u) => u.tag === 'ocio')).toEqual({ tag: 'ocio', estimaciones: 0, reales: 1, total: 1 });
    // Un tag creado en contabilidad está disponible para las estimaciones
    expect(env2.tags.todas()).toContain('ocio');
  });

  it('soloEn detecta descuadres entre estimado y real', () => {
    const env2 = entorno([estimacion({ tags: ['prevista'] })]);
    env2.ledger.registrar({ fecha: '2026-06-01', cuentaId: 'default', importe: 10, concepto: 'x', tipo: 'gasto', tags: ['imprevista'] });
    expect(env2.tags.soloEn('estimaciones')).toEqual(['prevista']);
    expect(env2.tags.soloEn('reales')).toEqual(['imprevista']);
  });

  it('renombrar actúa sobre estimaciones, transacciones, préstamos, nóminas y config', () => {
    const env2 = entorno([estimacion({ tags: ['casa'] })]);
    env2.store.set('loans', [
      {
        _id: 'l1',
        nombre: 'H',
        capital: 1,
        tin: 1,
        meses: 1,
        fechaInicio: '2026-01-01',
        amortizaciones: [],
        tags: ['casa'],
        activo: true,
      },
    ]);
    env2.store.set('nominas', [
      {
        _id: 'n1',
        nombre: 'S',
        bruto: 1,
        nPagas: 12,
        irpfModo: 'auto',
        irpfPct: 0,
        representacion: 'simplificado',
        cuenta: 'default',
        activo: true,
        tags: ['casa'],
        grupoNomina: '',
      },
    ]);
    env2.store.patchConfig({ tagCategorias: ['casa'], tagGrupos: ['casa'], activeTagsFilter: ['casa'] });
    env2.ledger.registrar({ fecha: '2026-06-01', cuentaId: 'default', importe: 10, concepto: 'x', tipo: 'gasto', tags: ['casa'] });

    const { cambiados } = env2.tags.renombrar('casa', 'hogar');
    expect(cambiados).toBe(4);
    expect(env2.store.get('expenses')[0].tags).toEqual(['hogar']);
    expect(env2.store.get('transacciones')[0].tags).toEqual(['hogar']);
    expect(env2.store.get('loans')[0].tags).toEqual(['hogar']);
    expect(env2.store.get('nominas')[0].tags).toEqual(['hogar']);
    expect(env2.store.get('config').tagCategorias).toEqual(['hogar']);
    expect(env2.store.get('config').tagGrupos).toEqual(['hogar']);
    expect(env2.store.get('config').activeTagsFilter).toEqual(['hogar']);
  });

  it('renombrar sobre un tag existente fusiona sin duplicar', () => {
    const env2 = entorno([estimacion({ tags: ['casa', 'hogar'] })]);
    env2.tags.renombrar('casa', 'hogar');
    expect(env2.store.get('expenses')[0].tags).toEqual(['hogar']);
  });

  it('fusionar varias etiquetas en una', () => {
    const env2 = entorno([estimacion({ _id: 'e1', tags: ['luz'] }), estimacion({ _id: 'e2', tags: ['agua'] })]);
    env2.tags.fusionar(['luz', 'agua'], 'suministros');
    const tags = env2.store.get('expenses').flatMap((e) => e.tags);
    expect(tags).toEqual(['suministros', 'suministros']);
  });

  it('eliminar quita la etiqueta de todos los items', () => {
    const env2 = entorno([estimacion({ tags: ['casa', 'luz'] })]);
    env2.ledger.registrar({ fecha: '2026-06-01', cuentaId: 'default', importe: 10, concepto: 'x', tipo: 'gasto', tags: ['casa'] });
    env2.tags.eliminar('casa');
    expect(env2.store.get('expenses')[0].tags).toEqual(['luz']);
    expect(env2.store.get('transacciones')[0].tags).toEqual([]);
  });

  it('renombrar a vacío es un error', () => {
    const env2 = entorno();
    expect(() => env2.tags.renombrar('casa', '   ')).toThrow(/vacío/);
  });
});
