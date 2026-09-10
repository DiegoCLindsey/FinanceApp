// Ledger de contabilidad real: transacciones, puntos de control y saldos
// derivados (F4, tareas 4.1 y 4.4).
import { describe, it, expect, beforeEach } from 'vitest';
import { createLedger, importeConSigno } from '@/accounting/ledger';
import { createStore } from '@/state/store';
import { createMemoryAdapter, KEY_PREFIX, VERSION_KEY } from '@/state/storage/local';
import { runMigrations } from '@/state/migrations';
import { SCHEMA_VERSION } from '@/state/schema';

const HOY = new Date(2026, 6, 30); // 2026-07-30

function entorno() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  store.set('accounts', [
    { ...store.get('accounts')[0], _id: 'default', nombre: 'Principal' },
    {
      _id: 'ahorro',
      nombre: 'Ahorro',
      activo: true,
      esCuentaPrincipal: false,
      saldoInicial: 0,
      fechaInicialSaldo: '2026-01-01',
      historicoSaldos: [],
      interes: 0,
      modeloFondo: 'cuenta',
    },
  ]);
  return { store, ledger: createLedger(store) };
}

describe('signo del importe', () => {
  it('gasto negativo, ingreso positivo, ajuste según se pida', () => {
    expect(importeConSigno('gasto', 12.34)).toBe(-1234);
    expect(importeConSigno('gasto', -12.34)).toBe(-1234); // el signo lo manda el tipo
    expect(importeConSigno('ingreso', 12.34)).toBe(1234);
    expect(importeConSigno('ajuste', 5)).toBe(500);
    expect(importeConSigno('ajuste', 5, true)).toBe(-500);
  });
});

describe('transacciones', () => {
  let env: ReturnType<typeof entorno>;
  beforeEach(() => {
    env = entorno();
  });

  it('registra en céntimos y devuelve la transacción creada', () => {
    const tx = env.ledger.registrar({
      fecha: '2026-07-05',
      cuentaId: 'default',
      importe: 42.99,
      concepto: 'Compra',
      tipo: 'gasto',
      tags: ['super'],
    });
    expect(tx.importeCts).toBe(-4299);
    expect(tx.origen).toBe('manual');
    expect(tx.estimacionId).toBeNull();
    expect(env.store.get('transacciones')).toHaveLength(1);
  });

  it('filtra por cuenta, rango, tipo, tags, estimación y texto', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-06-01', cuentaId: 'default', importe: 100, concepto: 'Luz junio', tipo: 'gasto', tags: ['casa'] });
    ledger.registrar({
      fecha: '2026-07-01',
      cuentaId: 'default',
      importe: 110,
      concepto: 'Luz julio',
      tipo: 'gasto',
      tags: ['casa'],
      estimacionId: 'e1',
    });
    ledger.registrar({ fecha: '2026-07-02', cuentaId: 'ahorro', importe: 500, concepto: 'Nómina', tipo: 'ingreso', tags: ['salario'] });

    expect(ledger.transacciones({ cuentaId: 'ahorro' })).toHaveLength(1);
    expect(ledger.transacciones({ desde: '2026-07-01' })).toHaveLength(2);
    expect(ledger.transacciones({ hasta: '2026-06-30' })).toHaveLength(1);
    expect(ledger.transacciones({ tipo: 'ingreso' })).toHaveLength(1);
    expect(ledger.transacciones({ tags: ['casa'] })).toHaveLength(2);
    expect(ledger.transacciones({ estimacionId: 'e1' })).toHaveLength(1);
    expect(ledger.transacciones({ texto: 'luz' })).toHaveLength(2);
    expect(ledger.transacciones({ texto: 'LUZ JULIO' })).toHaveLength(1);
  });

  it('devuelve las transacciones ordenadas por fecha', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-07-20', cuentaId: 'default', importe: 1, concepto: 'c', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-01', cuentaId: 'default', importe: 2, concepto: 'a', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 3, concepto: 'b', tipo: 'gasto' });
    expect(ledger.transacciones().map((t) => t.fecha)).toEqual(['2026-07-01', '2026-07-10', '2026-07-20']);
  });

  it('actualiza importe manteniendo el signo del tipo, y elimina', () => {
    const { ledger } = env;
    const tx = ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 50, concepto: 'x', tipo: 'gasto' });
    ledger.actualizar(tx._id, { importe: 75 });
    expect(ledger.transacciones()[0].importeCts).toBe(-7500);
    ledger.actualizar(tx._id, { concepto: 'y', tags: ['nuevo'] });
    expect(ledger.transacciones()[0].concepto).toBe('y');
    expect(ledger.transacciones()[0].tags).toEqual(['nuevo']);
    ledger.eliminar(tx._id);
    expect(ledger.transacciones()).toHaveLength(0);
  });

  it('asigna y desasigna la estimación relacionada', () => {
    const { ledger } = env;
    const tx = ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 10, concepto: 'x', tipo: 'gasto' });
    ledger.asignarEstimacion(tx._id, 'exp-1');
    expect(ledger.transacciones()[0].estimacionId).toBe('exp-1');
    ledger.asignarEstimacion(tx._id, null);
    expect(ledger.transacciones()[0].estimacionId).toBeNull();
  });
});

describe('puntos de control y saldos derivados', () => {
  let env: ReturnType<typeof entorno>;
  beforeEach(() => {
    env = entorno();
  });

  it('el saldo es el último punto de control más las transacciones posteriores', () => {
    const { ledger } = env;
    ledger.registrarPuntoControl('default', '2026-07-01', 1000);
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 200, concepto: 'gasto', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 50, concepto: 'ingreso', tipo: 'ingreso' });

    expect(ledger.saldoCuenta('default', '2026-07-01')).toBe(1000);
    expect(ledger.saldoCuenta('default', '2026-07-05')).toBe(800);
    expect(ledger.saldoCuenta('default', '2026-07-31')).toBe(850);
  });

  it('un punto de control posterior manda sobre las transacciones anteriores', () => {
    const { ledger } = env;
    ledger.registrarPuntoControl('default', '2026-07-01', 1000);
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 200, concepto: 'gasto', tipo: 'gasto' });
    // El banco dice que el día 10 había 900: eso es la verdad, no 800
    ledger.registrarPuntoControl('default', '2026-07-10', 900);
    expect(ledger.saldoCuenta('default', '2026-07-15')).toBe(900);
    ledger.registrar({ fecha: '2026-07-20', cuentaId: 'default', importe: 100, concepto: 'otro', tipo: 'gasto' });
    expect(ledger.saldoCuenta('default', '2026-07-31')).toBe(800);
  });

  it('sin punto de control previo arranca de cero', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 30, concepto: 'g', tipo: 'gasto' });
    expect(ledger.saldoCuenta('default', '2026-07-31')).toBe(-30);
  });

  it('reemplaza el punto de control de la misma cuenta y fecha (una sola verdad por día)', () => {
    const { ledger } = env;
    ledger.registrarPuntoControl('default', '2026-07-01', 1000);
    ledger.registrarPuntoControl('default', '2026-07-01', 1200);
    expect(ledger.puntosControl('default')).toHaveLength(1);
    expect(ledger.saldoCuenta('default', '2026-07-01')).toBe(1200);
  });

  it('los puntos de control se replican en historicoSaldos para el legacy', () => {
    const { ledger, store } = env;
    ledger.registrarPuntoControl('default', '2026-07-01', 1000, 'extracto banco');
    ledger.registrarPuntoControl('default', '2026-07-15', 1234.56);

    const cuenta = store.get('accounts').find((a) => a._id === 'default');
    expect(cuenta?.historicoSaldos).toEqual([
      { _id: expect.any(String), fecha: '2026-07-01', saldo: 1000, nota: 'extracto banco' },
      { _id: expect.any(String), fecha: '2026-07-15', saldo: 1234.56 },
    ]);

    // Y al eliminar uno, el puente se mantiene coherente
    const punto = ledger.puntosControl('default')[0];
    ledger.eliminarPuntoControl(punto._id);
    expect(store.get('accounts').find((a) => a._id === 'default')?.historicoSaldos).toHaveLength(1);
  });

  it('eliminarPuntosControlEnRango borra solo los puntos manuales dentro del rango, de esa cuenta', () => {
    const { ledger, store } = env;
    ledger.registrarPuntoControl('default', '2026-06-15', 500); // antes del rango: se queda
    ledger.registrarPuntoControl('default', '2026-07-05', 800); // dentro: se borra
    ledger.registrarPuntoControl('default', '2026-07-20', 900); // dentro: se borra
    ledger.registrarPuntoControl('default', '2026-08-01', 1000); // después: se queda
    ledger.registrarPuntoControl('ahorro', '2026-07-10', 5000); // otra cuenta: se queda

    const borrados = ledger.eliminarPuntosControlEnRango('default', '2026-07-01', '2026-07-31');

    expect(borrados).toBe(2);
    expect(ledger.puntosControl('default').map((p) => p.fecha)).toEqual(['2026-06-15', '2026-08-01']);
    expect(ledger.puntosControl('ahorro')).toHaveLength(1);
    // El puente con el legacy también refleja el borrado
    expect(store.get('accounts').find((a) => a._id === 'default')?.historicoSaldos).toHaveLength(2);
  });

  it('eliminarPuntosControlEnRango no toca nada ni sincroniza si no hay puntos en rango', () => {
    const { ledger } = env;
    ledger.registrarPuntoControl('default', '2026-06-01', 500);
    expect(ledger.eliminarPuntosControlEnRango('default', '2026-07-01', '2026-07-31')).toBe(0);
    expect(ledger.puntosControl('default')).toHaveLength(1);
  });

  it('sincronizarHistoricoImportado repite el barrido sobre el rango ya importado de cada cuenta', () => {
    const { ledger, store } = env;
    ledger.registrarPuntoControl('default', '2026-07-10', 800); // dentro de lo importado: se borra
    ledger.registrarPuntoControl('default', '2026-06-01', 500); // fuera: se queda
    ledger.registrarPuntoControl('ahorro', '2026-07-15', 900); // dentro de lo importado de ahorro: se borra
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 20, concepto: 'a', tipo: 'gasto', origen: 'importado' });
    ledger.registrar({ fecha: '2026-07-20', cuentaId: 'default', importe: 30, concepto: 'b', tipo: 'gasto', origen: 'importado' });
    ledger.registrar({ fecha: '2026-07-12', cuentaId: 'ahorro', importe: 40, concepto: 'c', tipo: 'ingreso', origen: 'importado' });
    ledger.registrar({ fecha: '2026-07-18', cuentaId: 'ahorro', importe: 50, concepto: 'd', tipo: 'ingreso', origen: 'importado' });
    // Un movimiento manual no cuenta como "importado": no debería crear rango propio.
    ledger.registrar({ fecha: '2026-05-01', cuentaId: 'default', importe: 10, concepto: 'manual', tipo: 'gasto' });

    const resultados = ledger.sincronizarHistoricoImportado();

    expect(resultados.sort((a, b) => a.cuentaId.localeCompare(b.cuentaId))).toEqual([
      { cuentaId: 'ahorro', eliminados: 1, semanales: 2 },
      { cuentaId: 'default', eliminados: 1, semanales: 12 },
    ]);
    // El punto manual de fuera del rango sigue ahí; el de dentro se ha ido.
    expect(
      ledger
        .puntosControl('default')
        .filter((p) => p.origen !== 'derivado')
        .map((p) => p.fecha),
    ).toEqual(['2026-06-01']);
    expect(ledger.puntosControl('ahorro').filter((p) => p.origen !== 'derivado')).toHaveLength(0);
    // Y el histórico queda con curva semanal en vez de con un punto suelto.
    expect(store.get('accounts').find((a) => a._id === 'default')?.historicoSaldos?.length).toBeGreaterThan(5);
  });

  it('sincronizarHistoricoImportado se puede acotar a una sola cuenta', () => {
    const { ledger } = env;
    ledger.registrarPuntoControl('default', '2026-07-10', 800);
    ledger.registrarPuntoControl('ahorro', '2026-07-15', 900);
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 20, concepto: 'a', tipo: 'gasto', origen: 'importado' });
    ledger.registrar({ fecha: '2026-07-20', cuentaId: 'default', importe: 25, concepto: 'e', tipo: 'gasto', origen: 'importado' });
    ledger.registrar({ fecha: '2026-07-12', cuentaId: 'ahorro', importe: 40, concepto: 'c', tipo: 'ingreso', origen: 'importado' });
    ledger.registrar({ fecha: '2026-07-18', cuentaId: 'ahorro', importe: 50, concepto: 'd', tipo: 'ingreso', origen: 'importado' });

    expect(ledger.sincronizarHistoricoImportado('default')).toEqual([{ cuentaId: 'default', eliminados: 1, semanales: 4 }]);
    expect(ledger.puntosControl('ahorro')).toHaveLength(1); // no tocada: sigue solo con su punto manual
  });

  it('sincronizarHistoricoImportado no devuelve nada si no hay movimientos importados', () => {
    const { ledger } = env;
    expect(ledger.sincronizarHistoricoImportado()).toEqual([]);
    // Con movimientos importados sí hay fila, aunque no hubiera puntos manuales que borrar.
    ledger.registrar({ fecha: '2026-07-05', cuentaId: 'default', importe: 20, concepto: 'a', tipo: 'gasto', origen: 'importado' });
    expect(ledger.sincronizarHistoricoImportado()).toEqual([{ cuentaId: 'default', eliminados: 0, semanales: 1 }]);
  });

  it('genera un punto por semana con el saldo del domingo, cubriendo todas las semanas con datos', () => {
    const { ledger, store } = env;
    // 2026-06-01 es lunes; los domingos de esas semanas son 07, 14 y 21.
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.registrar({ fecha: '2026-06-09', cuentaId: 'default', importe: 30, concepto: 'b', tipo: 'gasto' });
    ledger.registrar({ fecha: '2026-06-16', cuentaId: 'default', importe: 10, concepto: 'c', tipo: 'gasto' });

    expect(ledger.generarPuntosSemanales('default')).toBe(3);
    const puntos = ledger.puntosControl('default');
    expect(puntos.map((p) => [p.fecha, p.saldoCts])).toEqual([
      ['2026-06-07', 10000],
      ['2026-06-14', 7000],
      ['2026-06-16', 6000], // la última semana se cierra en el último dato, no en el domingo
    ]);
    expect(puntos.every((p) => p.origen === 'derivado')).toBe(true);
    // Y el puente con el legacy los replica: es lo que dibuja el histórico.
    expect(store.get('accounts').find((a) => a._id === 'default')?.historicoSaldos).toHaveLength(3);
  });

  it('cubre también las semanas sin ningún movimiento, arrastrando el saldo', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.registrar({ fecha: '2026-06-23', cuentaId: 'default', importe: 40, concepto: 'b', tipo: 'gasto' });

    ledger.generarPuntosSemanales('default');
    expect(ledger.puntosControl('default').map((p) => [p.fecha, p.saldoCts])).toEqual([
      ['2026-06-07', 10000],
      ['2026-06-14', 10000], // sin movimientos: el saldo se mantiene
      ['2026-06-21', 10000],
      ['2026-06-23', 6000],
    ]);
  });

  it('una semana con punto manual conserva el suyo y no recibe uno derivado', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.registrar({ fecha: '2026-06-09', cuentaId: 'default', importe: 30, concepto: 'b', tipo: 'gasto' });
    // El banco dice que el día 10 había 500: manda sobre lo calculado.
    ledger.registrarPuntoControl('default', '2026-06-10', 500, 'extracto');

    const puntos = ledger.puntosControl('default');
    expect(puntos.map((p) => [p.fecha, p.saldoCts, p.origen ?? 'manual'])).toEqual([
      ['2026-06-07', 10000, 'derivado'],
      ['2026-06-10', 50000, 'manual'], // su semana (7-14) no lleva punto derivado
    ]);
    // Y el ancla manual manda en el saldo posterior.
    expect(ledger.saldoCuenta('default', '2026-06-14')).toBe(500);
  });

  it('los puntos derivados no anclan el saldo: un movimiento nuevo se suma igual', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.generarPuntosSemanales('default');
    // Un movimiento anterior al punto derivado del día 7 debe seguir contando:
    // si el derivado anclara, este gasto quedaría fuera del saldo.
    ledger.registrar({ fecha: '2026-06-03', cuentaId: 'default', importe: 40, concepto: 'b', tipo: 'gasto' });
    expect(ledger.saldoCuenta('default', '2026-06-30')).toBe(60);
  });

  it('regenerar reemplaza los derivados anteriores en vez de acumularlos', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.generarPuntosSemanales('default');
    ledger.generarPuntosSemanales('default');
    ledger.generarPuntosSemanales('default');
    expect(ledger.puntosControl('default')).toHaveLength(1);
  });

  it('sin datos no genera nada y limpia los derivados que hubiera', () => {
    const { ledger } = env;
    const tx = ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.generarPuntosSemanales('default');
    expect(ledger.puntosControl('default')).toHaveLength(1);

    ledger.eliminar(tx._id);
    expect(ledger.generarPuntosSemanales('default')).toBe(0);
    expect(ledger.puntosControl('default')).toHaveLength(0);
  });

  it('retrasa el arranque de la cuenta hasta el primer movimiento si lo estaba tapando', () => {
    const { ledger, store } = env;
    // Cuenta creada DESPUÉS de los movimientos (o tras «Actualizar saldo
    // base»): su arranque taparía toda la curva semanal en saldoEnFecha y en
    // la gráfica del dashboard.
    store.set(
      'accounts',
      store.get('accounts').map((a) => (a._id === 'default' ? { ...a, saldoInicial: 0, fechaInicialSaldo: '2026-07-30' } : a)),
    );
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.registrar({ fecha: '2026-06-16', cuentaId: 'default', importe: 30, concepto: 'b', tipo: 'gasto' });

    ledger.generarPuntosSemanales('default');

    const cuenta = store.get('accounts').find((a) => a._id === 'default');
    expect(cuenta?.fechaInicialSaldo).toBe('2026-06-02');
    expect(cuenta?.saldoInicial).toBe(100); // el saldo que había ese día
  });

  it('no toca el arranque si ya es anterior al primer movimiento', () => {
    const { ledger, store } = env;
    store.set(
      'accounts',
      store.get('accounts').map((a) => (a._id === 'default' ? { ...a, saldoInicial: 4200, fechaInicialSaldo: '2026-01-01' } : a)),
    );
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });

    ledger.generarPuntosSemanales('default');

    const cuenta = store.get('accounts').find((a) => a._id === 'default');
    expect(cuenta?.fechaInicialSaldo).toBe('2026-01-01');
    expect(cuenta?.saldoInicial).toBe(4200);
  });

  it('generarPuntosSemanalesTodas recorre las cuentas con movimientos', () => {
    const { ledger } = env;
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'ingreso' });
    ledger.registrar({ fecha: '2026-06-02', cuentaId: 'ahorro', importe: 50, concepto: 'b', tipo: 'ingreso' });
    expect(ledger.generarPuntosSemanalesTodas()).toBe(2);
    expect(ledger.puntosControl('default')).toHaveLength(1);
    expect(ledger.puntosControl('ahorro')).toHaveLength(1);
  });

  it('saldoTotal suma las cuentas activas', () => {
    const { ledger } = env;
    ledger.registrarPuntoControl('default', '2026-07-01', 1000);
    ledger.registrarPuntoControl('ahorro', '2026-07-01', 5000);
    expect(ledger.saldoTotal('2026-07-31')).toBe(6000);
    expect(ledger.saldoTotal('2026-07-31', ['ahorro'])).toBe(5000);
  });

  it('precisión: 1000 sumas de 0,01 € dan exactamente 10 €', () => {
    const { ledger } = env;
    ledger.registrarPuntoControl('default', '2026-01-01', 0);
    for (let i = 0; i < 1000; i++) {
      ledger.registrar({ fecha: '2026-02-01', cuentaId: 'default', importe: 0.01, concepto: 'céntimo', tipo: 'ingreso' });
    }
    expect(ledger.saldoCuenta('default', '2026-03-01')).toBe(10);
  });

  it('tieneDatos y ultimaFecha reflejan el estado del ledger', () => {
    const { ledger } = env;
    expect(ledger.tieneDatos()).toBe(false);
    expect(ledger.ultimaFecha()).toBeNull();
    ledger.registrar({ fecha: '2026-05-05', cuentaId: 'default', importe: 1, concepto: 'x', tipo: 'gasto' });
    ledger.registrarPuntoControl('default', '2026-07-01', 10);
    expect(ledger.tieneDatos()).toBe(true);
    expect(ledger.ultimaFecha()).toBe('2026-07-01');
  });
});

describe('agregados del ledger', () => {
  it('total, totalPorMes y totalPorTag en euros con signo', () => {
    const { ledger } = entorno();
    ledger.registrar({ fecha: '2026-06-10', cuentaId: 'default', importe: 100, concepto: 'a', tipo: 'gasto', tags: ['casa', 'luz'] });
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 150, concepto: 'b', tipo: 'gasto', tags: ['casa'] });
    ledger.registrar({ fecha: '2026-07-15', cuentaId: 'default', importe: 2000, concepto: 'c', tipo: 'ingreso', tags: ['salario'] });

    expect(ledger.total({ tipo: 'gasto' })).toBe(-250);
    expect([...ledger.totalPorMes({ tipo: 'gasto' })]).toEqual([
      ['2026-06', -100],
      ['2026-07', -150],
    ]);
    const porTag = ledger.totalPorTag();
    expect(porTag.get('casa')).toBe(-250);
    expect(porTag.get('luz')).toBe(-100);
    expect(porTag.get('salario')).toBe(2000);
  });

  it('las transacciones sin tag se agrupan en sin_tag', () => {
    const { ledger } = entorno();
    ledger.registrar({ fecha: '2026-07-10', cuentaId: 'default', importe: 20, concepto: 'suelto', tipo: 'gasto' });
    expect(ledger.totalPorTag().get('sin_tag')).toBe(-20);
  });
});

describe('migración v6', () => {
  const ctx = { hoyISO: '2026-07-30', finISO: '2027-07-30' };

  it('importa historicoSaldos y la colección history al ledger', () => {
    const raw = {
      accounts: [
        {
          _id: 'default',
          nombre: 'Principal',
          esCuentaPrincipal: true,
          activo: true,
          historicoSaldos: [
            { _id: 'h1', fecha: '2026-01-01', saldo: 1000, nota: 'inicio' },
            { _id: 'h2', fecha: '2026-06-01', saldo: 1500.55 },
          ],
        },
        { _id: 'ahorro', nombre: 'Ahorro', activo: true, historicoSaldos: [{ _id: 'h3', fecha: '2026-03-01', saldo: 5000 }] },
      ],
      history: [
        { _id: 'x1', fecha: '2025-12-01', saldo: 800 }, // sin cuenta → principal
        { _id: 'x2', fecha: '2025-11-01', saldo: 400, cuenta: 'ahorro' },
      ],
      config: {},
    };
    const { state, applied } = runMigrations(raw, 4, ctx);
    expect(applied).toEqual([5, 6, 7, 8, 9, 10]);

    const puntos = state.puntosControl;
    expect(puntos).toHaveLength(5);
    // Importes convertidos a céntimos y ordenados por fecha
    expect(puntos.map((p) => p.fecha)).toEqual(['2025-11-01', '2025-12-01', '2026-01-01', '2026-03-01', '2026-06-01']);
    expect(puntos.find((p) => p.fecha === '2026-06-01')?.saldoCts).toBe(150055);
    expect(puntos.find((p) => p.fecha === '2025-12-01')?.cuentaId).toBe('default');
    expect(puntos.find((p) => p.fecha === '2025-11-01')?.cuentaId).toBe('ahorro');
    expect(puntos.find((p) => p.fecha === '2026-01-01')?.nota).toBe('inicio');

    // La clave legacy ya no se arrastra, pero historicoSaldos se conserva
    expect(state).not.toHaveProperty('history');
    expect(state.accounts[0].historicoSaldos).toHaveLength(2);
    expect(state.transacciones).toEqual([]);
  });

  it('es idempotente y no duplica puntos al re-migrar', () => {
    const raw = {
      accounts: [
        { _id: 'default', nombre: 'P', activo: true, esCuentaPrincipal: true, historicoSaldos: [{ fecha: '2026-01-01', saldo: 100 }] },
      ],
      config: {},
    };
    const una = runMigrations(raw, 4, ctx).state;
    const dos = runMigrations(JSON.parse(JSON.stringify(una)), 5, ctx).state;
    expect(dos.puntosControl).toHaveLength(1);
  });

  it('no pierde la contabilidad al re-migrar un backup nuevo declarado como antiguo', () => {
    // Regresión: la 005 construía el estado desde cero y descartaba las
    // colecciones que no conocía, así que importar un backup v6 con
    // fromVersion=4 borraba transacciones y puntos de control del usuario.
    const v6 = {
      accounts: [{ _id: 'default', nombre: 'P', activo: true, esCuentaPrincipal: true, historicoSaldos: [] }],
      transacciones: [
        {
          _id: 'tx1',
          fecha: '2026-05-01',
          cuentaId: 'default',
          importeCts: -1500,
          concepto: 'Compra',
          tags: [],
          tipo: 'gasto',
          origen: 'manual',
        },
      ],
      puntosControl: [{ _id: 'pc1', fecha: '2026-05-01', cuentaId: 'default', saldoCts: 100000 }],
      config: {},
    };
    const { state } = runMigrations(v6, 4, ctx);
    expect(state.transacciones).toHaveLength(1);
    expect(state.transacciones[0]._id).toBe('tx1');
    expect(state.puntosControl).toHaveLength(1);
    expect(state.puntosControl[0].saldoCts).toBe(100000);
  });

  it('ignora entradas con fecha o saldo inválidos', () => {
    const raw = {
      accounts: [
        {
          _id: 'default',
          nombre: 'P',
          activo: true,
          esCuentaPrincipal: true,
          historicoSaldos: [
            { fecha: 'ayer', saldo: 100 },
            { fecha: '2026-01-01', saldo: 'mucho' },
            { fecha: '2026-02-01', saldo: 50 },
          ],
        },
      ],
      config: {},
    };
    const { state } = runMigrations(raw, 4, ctx);
    expect(state.puntosControl).toHaveLength(1);
    expect(state.puntosControl[0].fecha).toBe('2026-02-01');
  });

  it('el store carga la clave huérfana state_history y la migra', () => {
    const seed: Record<string, unknown> = {
      [VERSION_KEY]: 5,
      [`${KEY_PREFIX}accounts`]: [{ _id: 'default', nombre: 'P', activo: true, esCuentaPrincipal: true, historicoSaldos: [] }],
      [`${KEY_PREFIX}history`]: [{ _id: 'h', fecha: '2026-04-01', saldo: 777 }],
    };
    const store = createStore({ adapter: createMemoryAdapter(seed), hoy: HOY });
    const { applied } = store.load();
    expect(applied).toEqual([6, 7, 8, 9, 10]);
    expect(store.get('puntosControl')).toHaveLength(1);
    expect(store.get('puntosControl')[0].saldoCts).toBe(77700);
    expect(store.schemaVersion).toBe(SCHEMA_VERSION);
  });
});
