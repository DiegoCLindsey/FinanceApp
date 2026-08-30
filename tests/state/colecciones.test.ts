import { describe, expect, it } from 'vitest';
import { aplicarCopia, COLECCIONES, esEstadoVacioOPorDefecto, faltantesEnCopia, snapshotParaCopia } from '@/state/colecciones';
import { createMemoryAdapter, KEY_PREFIX } from '@/state/storage/local';

describe('COLECCIONES', () => {
  it('incluye lo que las cuatro listas escritas a mano se dejaban', () => {
    // El planificador entero, la contabilidad real y los puntos de control no
    // estaban en NINGUNA copia de seguridad. Este test es el que impide que
    // vuelva a pasar.
    for (const k of ['planes', 'transacciones', 'puntosControl']) {
      expect(COLECCIONES).toContain(k);
    }
  });

  it('cubre el esquema entero, sin sobras ni faltas', () => {
    expect([...COLECCIONES].sort()).toEqual(
      [
        'accounts',
        'config',
        'escenarios',
        'expenses',
        'goals',
        'inflacion',
        'loans',
        'nominas',
        'personas',
        'planes',
        'puntosControl',
        'tramosGananciasCapitalHistorico',
        'tramosIRPFHistorico',
        'transacciones',
      ].sort(),
    );
  });

  it('no arrastra `history`, que ya no existe', () => {
    expect(COLECCIONES).not.toContain('history');
  });
});

describe('snapshotParaCopia', () => {
  it('lee del almacenamiento, no de una copia en memoria', () => {
    const a = createMemoryAdapter();
    a.set(`${KEY_PREFIX}expenses`, [{ _id: 'e1' }]);
    a.set(`${KEY_PREFIX}transacciones`, [{ _id: 't1' }]);
    const s = snapshotParaCopia(a);
    expect(s.expenses).toEqual([{ _id: 'e1' }]);
    expect(s.transacciones).toEqual([{ _id: 't1' }]);
  });

  it('omite lo que no está en vez de escribir nulos', () => {
    const a = createMemoryAdapter();
    a.set(`${KEY_PREFIX}expenses`, []);
    const s = snapshotParaCopia(a) as Record<string, unknown>;
    expect('expenses' in s).toBe(true);
    expect('planes' in s).toBe(false);
  });

  it('con el almacén vacío devuelve un objeto vacío, no basura', () => {
    expect(snapshotParaCopia(createMemoryAdapter())).toEqual({});
  });
});

describe('aplicarCopia', () => {
  it('escribe cada colección con la clave lógica correcta', () => {
    const escrito: Record<string, unknown> = {};
    const escritas = aplicarCopia((k, v) => (escrito[k] = v), { expenses: [1], planes: [2] });
    expect(escrito[`${KEY_PREFIX}expenses`]).toEqual([1]);
    expect(escrito[`${KEY_PREFIX}planes`]).toEqual([2]);
    expect(escritas.sort()).toEqual(['expenses', 'planes']);
  });

  it('una copia ANTIGUA no borra lo que no trae', () => {
    // Restaurar un backup de antes de que existiera la contabilidad no puede
    // llevarse por delante los movimientos de este dispositivo.
    const escrito: Record<string, unknown> = {};
    const escritas = aplicarCopia((k, v) => (escrito[k] = v), { expenses: [1], history: ['viejo'] });
    expect(escritas).toEqual(['expenses']);
    expect(Object.keys(escrito)).toEqual([`${KEY_PREFIX}expenses`]);
  });

  it('ignora las claves que la copia trae a null', () => {
    const escrito: Record<string, unknown> = {};
    aplicarCopia((k, v) => (escrito[k] = v), { expenses: null, loans: [1] });
    expect(Object.keys(escrito)).toEqual([`${KEY_PREFIX}loans`]);
  });
});

describe('faltantesEnCopia', () => {
  it('dice qué se queda como estaba', () => {
    const f = faltantesEnCopia({ expenses: [], loans: [] });
    expect(f).toContain('transacciones');
    expect(f).not.toContain('expenses');
  });
});

describe('esEstadoVacioOPorDefecto', () => {
  const CUENTA_DEFAULT = { _id: 'default', saldoInicial: 0, historicoSaldos: [] };

  it('un snapshot vacío es de fábrica', () => {
    expect(esEstadoVacioOPorDefecto({})).toBe(true);
  });

  it('la cuenta default sin saldo ni histórico es de fábrica', () => {
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT] })).toBe(true);
  });

  it('un gasto real ya no es de fábrica', () => {
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], expenses: [{ _id: 'e1' }] })).toBe(false);
  });

  it('un préstamo, una nómina o un movimiento real tampoco', () => {
    expect(esEstadoVacioOPorDefecto({ loans: [{ _id: 'l1' }] })).toBe(false);
    expect(esEstadoVacioOPorDefecto({ nominas: [{ _id: 'n1' }] })).toBe(false);
    expect(esEstadoVacioOPorDefecto({ transacciones: [{ _id: 't1' }] })).toBe(false);
  });

  it('un movimiento o un punto de control real ya no son de fábrica', () => {
    expect(esEstadoVacioOPorDefecto({ puntosControl: [{ _id: 'c1' }] })).toBe(false);
  });

  it('el plan_base que crea la migración 008 en TODA instalación nueva sigue siendo de fábrica', () => {
    // Migración 008: cada instalación nueva arranca con un plan `plan_base`
    // (un vehículo por cuenta, cero objetivos), tenga o no el usuario datos
    // reales. Sin este caso especial, `planes` nunca estaría vacía y esta
    // función no detectaría NUNCA un dispositivo recién estrenado — que es
    // justo el caso que existe para cubrir. Encontrado probando en un
    // navegador real con localStorage limpio de verdad, no solo con datos de
    // prueba fabricados a mano.
    const planBase = { _id: 'plan_base', nombre: 'Plan base', objetivos: [], vehiculos: [{ _id: 'veh_default' }] };
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], planes: [planBase] })).toBe(true);
  });

  it('un objetivo real dentro del plan sí es un dato real', () => {
    const planConObjetivo = { _id: 'plan_base', objetivos: [{ _id: 'o1', nombre: 'Entrada del piso' }] };
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], planes: [planConObjetivo] })).toBe(false);
  });

  it('un segundo plan (aunque esté vacío) ya no es de fábrica: solo se crea uno solo', () => {
    const planBase = { _id: 'plan_base', objetivos: [] };
    const otroPlan = { _id: 'otro', objetivos: [] };
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], planes: [planBase, otroPlan] })).toBe(false);
  });

  it('un plan con OTRO id (el usuario borró plan_base y creó uno nuevo) ya no es de fábrica', () => {
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], planes: [{ _id: 'propio', objetivos: [] }] })).toBe(false);
  });

  it('una cuenta con OTRO id ya no es de fábrica, aunque esté vacía', () => {
    expect(esEstadoVacioOPorDefecto({ accounts: [{ _id: 'cc', saldoInicial: 0, historicoSaldos: [] }] })).toBe(false);
  });

  it('un saldo inicial mayor que cero es un dato real', () => {
    expect(esEstadoVacioOPorDefecto({ accounts: [{ _id: 'default', saldoInicial: 8400, historicoSaldos: [] }] })).toBe(false);
  });

  it('saldo inicial NEGATIVO también cuenta: solo el cero pasa desapercibido', () => {
    expect(esEstadoVacioOPorDefecto({ accounts: [{ _id: 'default', saldoInicial: -50, historicoSaldos: [] }] })).toBe(false);
  });

  it('un punto de control en el histórico es un dato real, aunque el saldo inicial siga en cero', () => {
    expect(
      esEstadoVacioOPorDefecto({
        accounts: [{ _id: 'default', saldoInicial: 0, historicoSaldos: [{ _id: 'h1', fecha: '2026-01-01', saldo: 100 }] }],
      }),
    ).toBe(false);
  });

  it('varias cuentas, todas de fábrica, siguen siendo de fábrica', () => {
    // No debería poder pasar en la práctica (la app garantiza una sola default),
    // pero la función no debe asumirlo.
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT, { ...CUENTA_DEFAULT }] })).toBe(true);
  });

  it('config no cuenta para nada: son preferencias, no datos', () => {
    expect(esEstadoVacioOPorDefecto({ config: { colchonMeses: 12, autoSave: true, onboardingDone: true } })).toBe(true);
  });

  it('la persona por defecto que crea la migración 009 en TODA instalación nueva sigue siendo de fábrica', () => {
    // Mismo caso que plan_base: la migración 009 siembra una persona en
    // cualquier instalación, tenga o no el usuario datos reales.
    const personaDefecto = { _id: 'default', nombre: 'Yo', esPorDefecto: true, activo: true };
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], personas: [personaDefecto] })).toBe(true);
  });

  it('una segunda persona ya no es de fábrica: alguien la ha creado a mano', () => {
    const personaDefecto = { _id: 'default', esPorDefecto: true, activo: true };
    const pareja = { _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true };
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], personas: [personaDefecto, pareja] })).toBe(false);
  });

  it('una persona con OTRO id (renombrada o recreada) ya no es de fábrica', () => {
    expect(esEstadoVacioOPorDefecto({ accounts: [CUENTA_DEFAULT], personas: [{ _id: 'yo', esPorDefecto: true, activo: true }] })).toBe(
      false,
    );
  });
});
