// Store tipado, migraciones y resolvers de tablas fiscales (F1, tareas 1.3 y 1.6).
import { describe, it, expect, beforeAll } from 'vitest';
import { createStore } from '@/state/store';
import { createMemoryAdapter, KEY_PREFIX, VERSION_KEY } from '@/state/storage/local';
import { runMigrations } from '@/state/migrations';
import { migrarDiaPago } from '@/state/migrations/005-normalize';
import { SCHEMA_VERSION } from '@/state/schema';
import { resolverTablaAnual, crearResolverTramos } from '@/core/tax/tables';
import { TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';

/* eslint-disable @typescript-eslint/no-explicit-any */
const HOY = new Date(2026, 6, 30); // 2026-07-30 local

// Backup v4 realista: campos legados, colección retirada y datos incompletos
const backupV4: Record<string, unknown> = {
  loans: [
    {
      _id: 'l1',
      nombre: 'Hipoteca',
      capital: 120000,
      tin: 3,
      meses: 300,
      fechaInicio: '2024-01-01',
      diaPago: 'ultimo',
      escenarioId: 'esc1',
      varianza: 10,
      amortizaciones: [{ _id: 'a1', fecha: '2026-01-01', cantidad: 3000, tipo: 'plazo', escenarioId: 'esc1' }],
    },
  ],
  expenses: [
    {
      _id: 'e1',
      concepto: 'Alquiler',
      cuantia: 800,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      fechaInicio: '2025-01-01',
      diaPago: '5',
      varianza: 15,
      inflacion: 3,
      escenarioId: null,
    },
    {
      _id: 'e2',
      concepto: 'Nómina vieja',
      cuantia: 2000,
      tipo: 'ingreso',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      diaPago: 'primer-lunes',
      tags: null,
    },
  ],
  accounts: [
    { _id: 'default', nombre: 'Default', saldoInicial: 5000, fechaInicialSaldo: '2026-01-01', esFondoPension: false },
    { _id: 'plan', nombre: 'Plan', saldoInicial: 10000, esFondoPension: true, historicoSaldos: null },
  ],
  nominas: [{ _id: 'n1', nombre: 'Sueldo', bruto: 30000, varianza: 8 }],
  goals: [{ _id: 'g1', nombre: 'Coche', targetAmount: 15000, cuentaId: 'default' }],
  inflacion: [{ _id: 'i1', year: 2026, tasa: 2.5 }],
  escenarios: [{ _id: 'esc1', nombre: 'Escenario A', inversiones: [{ _id: 'inv1', importe: 1000 }] }],
  history: [{ _id: 'h1', fecha: '2025-01-01', saldo: 4000 }],
  config: {
    dashboardStart: '2026-01-01',
    dashboardEnd: '2027-01-01',
    inflacionGlobal: 2,
    showMC: true,
    mcIteraciones: 500,
    colchonMeses: 8,
    saldoInicial: 999,
    tramos_irpf: [],
  },
};

describe('migración a v5', () => {
  const ctx = { hoyISO: '2026-07-30', finISO: '2027-07-30' };

  it('normaliza un backup v4 completo', () => {
    const { state, applied } = runMigrations(structuredClone(backupV4), 4, ctx);
    expect(applied).toEqual([5, 6, 7]); // la cadena completa desde v4

    // escenarioId → escenarioIds (también en amortizaciones anidadas)
    expect(state.loans[0].escenarioIds).toEqual(['esc1']);
    expect(state.loans[0].amortizaciones[0].escenarioIds).toEqual(['esc1']);
    expect(state.expenses[0].escenarioIds).toEqual([]);

    // diaPago legado → formato nuevo
    expect(state.loans[0].diaPago).toBe('dia:ultimo');
    expect(state.expenses[0].diaPago).toBe('dia:5');
    expect(state.expenses[1].diaPago).toBe('nthweekday:1:1');

    // Campos de features eliminadas fuera
    expect(state.loans[0]).not.toHaveProperty('varianza');
    expect(state.expenses[0]).not.toHaveProperty('varianza');
    expect(state.expenses[0]).not.toHaveProperty('inflacion');
    expect(state.nominas[0]).not.toHaveProperty('varianza');
    expect(state.config).not.toHaveProperty('inflacionGlobal');
    expect(state.config).not.toHaveProperty('showMC');
    expect(state.config).not.toHaveProperty('mcIteraciones');
    expect(state.config).not.toHaveProperty('saldoInicial');
    expect(state).not.toHaveProperty('history');

    // esFondoPension → modeloFondo
    expect(state.accounts[0].modeloFondo).toBe('cuenta');
    expect(state.accounts[1].modeloFondo).toBe('pension');
    expect(state.accounts[1]).not.toHaveProperty('esFondoPension');

    // Arrays nulos saneados
    expect(state.accounts[1].historicoSaldos).toEqual([]);
    expect(state.expenses[1].tags).toEqual([]);

    // goals: cuentaId → cuentaIds
    expect(state.goals[0].cuentaIds).toEqual(['default']);
    expect(state.goals[0]).not.toHaveProperty('cuentaId');

    // escenarios sin inversiones
    expect(state.escenarios[0]).not.toHaveProperty('inversiones');

    // config: conserva lo del usuario, rellena defaults, repara tablas vacías
    expect(state.config.colchonMeses).toBe(8);
    expect(state.config.dashboardStart).toBe('2026-01-01');
    expect(state.config.tramos_irpf).toEqual(TRAMOS_IRPF_DEFAULT);
    expect(state.config.features).toEqual({});
    expect(state.config.saludRegla).toEqual([50, 30, 20]);
  });

  it('es idempotente: migrar dos veces da el mismo resultado', () => {
    const una = runMigrations(structuredClone(backupV4), 4, ctx).state;
    const dos = runMigrations(structuredClone(una) as any, 4, ctx).state;
    // Los _id de los puntos de control se generan por contador en cada pasada,
    // así que se comparan sin ellos.
    const sinIds = (s: typeof una) => ({ ...s, puntosControl: s.puntosControl.map(({ _id: _drop, ...p }) => p) });
    expect(sinIds(dos)).toEqual(sinIds(una));
  });

  it('no lanza con estado vacío ni con basura', () => {
    expect(() => runMigrations({}, null, ctx)).not.toThrow();
    const vacio = runMigrations({}, null, ctx).state;
    expect(vacio.accounts).toHaveLength(1);
    expect(vacio.accounts[0]._id).toBe('default');
    const basura = runMigrations({ loans: 'nope', expenses: 42, config: 'x' } as any, null, ctx).state;
    expect(basura.loans).toEqual([]);
    expect(basura.expenses).toEqual([]);
    expect(basura.config.colchonMeses).toBe(6);
  });

  it('no reaplica migraciones ya hechas', () => {
    const { applied } = runMigrations(structuredClone(backupV4), SCHEMA_VERSION, ctx);
    expect(applied).toEqual([]);
  });

  it('migrarDiaPago cubre todos los formatos', () => {
    expect(migrarDiaPago('ultimo')).toBe('dia:ultimo');
    expect(migrarDiaPago('primer-lunes')).toBe('nthweekday:1:1');
    expect(migrarDiaPago('15')).toBe('dia:15');
    expect(migrarDiaPago('dia:20')).toBe('dia:20');
    expect(migrarDiaPago('nthweekday:-1:5')).toBe('nthweekday:-1:5');
    expect(migrarDiaPago('')).toBe('');
    expect(migrarDiaPago(null)).toBe('');
    expect(migrarDiaPago('basura')).toBe('');
  });
});

describe('store', () => {
  it('carga datos legacy de localStorage (mismas claves) y persiste la versión', () => {
    const seed: Record<string, unknown> = { [VERSION_KEY]: 4 };
    for (const [k, v] of Object.entries(backupV4)) seed[`${KEY_PREFIX}${k}`] = v;
    const adapter = createMemoryAdapter(seed);
    const store = createStore({ adapter, hoy: HOY });
    const { applied } = store.load();

    expect(applied).toEqual([5, 6, 7]);
    expect(adapter.get(VERSION_KEY)).toBe(SCHEMA_VERSION);
    expect(store.get('loans')[0].diaPago).toBe('dia:ultimo');
    expect(store.get('config').colchonMeses).toBe(8);
    // La colección retirada sale del estado, pero su clave en storage NO se
    // destruye: la migración de Contabilidad (F4, tarea 4.1) importará esos
    // puntos históricos al ledger.
    expect(store.snapshot()).not.toHaveProperty('history');
    expect(adapter.get(`${KEY_PREFIX}history`)).not.toBeNull();
  });

  it('arranca en limpio con una cuenta default y config por defecto', () => {
    const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
    store.load();
    expect(store.get('accounts')).toHaveLength(1);
    expect(store.get('accounts')[0].esCuentaPrincipal).toBe(true);
    expect(store.get('config').dashboardStart).toBe('2026-07-30');
    expect(store.get('config').dashboardEnd).toBe('2027-07-30');
  });

  it('garantiza exactamente una cuenta principal', () => {
    const seed = {
      [VERSION_KEY]: SCHEMA_VERSION,
      [`${KEY_PREFIX}accounts`]: [
        {
          _id: 'a',
          nombre: 'A',
          esCuentaPrincipal: true,
          activo: true,
          saldoInicial: 0,
          fechaInicialSaldo: '2026-01-01',
          historicoSaldos: [],
          interes: 0,
          modeloFondo: 'cuenta',
          escenarioIds: [],
        },
        {
          _id: 'b',
          nombre: 'B',
          esCuentaPrincipal: true,
          activo: true,
          saldoInicial: 0,
          fechaInicialSaldo: '2026-01-01',
          historicoSaldos: [],
          interes: 0,
          modeloFondo: 'cuenta',
          escenarioIds: [],
        },
      ],
    };
    const store = createStore({ adapter: createMemoryAdapter(seed), hoy: HOY });
    store.load();
    expect(store.get('accounts').filter((a) => a.esCuentaPrincipal)).toHaveLength(1);
    expect(store.getPrincipalAccountId()).toBe('a');
  });

  it('CRUD tipado con notificación por clave', () => {
    const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
    store.load();
    const notificadas: string[] = [];
    const unsub = store.subscribe((k) => notificadas.push(k));

    const nuevo = store.addItem('expenses', {
      concepto: 'Gym',
      cuantia: 40,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      tags: [],
      activo: true,
      escenarioIds: [],
    } as any);
    expect(nuevo._id).toBeTruthy();
    expect(store.get('expenses')).toHaveLength(1);

    store.updateItem('expenses', nuevo._id, { cuantia: 55 });
    expect(store.get('expenses')[0].cuantia).toBe(55);

    store.patchConfig({ colchonMeses: 9 });
    expect(store.get('config').colchonMeses).toBe(9);

    store.removeItem('expenses', nuevo._id);
    expect(store.get('expenses')).toHaveLength(0);

    expect(notificadas).toEqual(['expenses', 'expenses', 'config', 'expenses']);
    unsub();
    store.patchConfig({ colchonMeses: 10 });
    expect(notificadas).toHaveLength(4); // ya no notifica tras desuscribirse
  });

  it('snapshot es inmutable y replaceAll migra el backup importado', () => {
    const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
    store.load();
    const snap = store.snapshot();
    snap.config.colchonMeses = 999;
    expect(store.get('config').colchonMeses).not.toBe(999);

    const { applied } = store.replaceAll(structuredClone(backupV4), 4);
    expect(applied).toEqual([5, 6, 7]);
    expect(store.get('loans')).toHaveLength(1);
    expect(store.get('loans')[0].diaPago).toBe('dia:ultimo');
  });
});

describe('resolvers de tablas fiscales (cierra 1.3)', () => {
  let FM: any;
  beforeAll(async () => {
    await import('../../finance-math/finance-math.js');
    FM = (globalThis as any).FinanceMath;
  });

  const historico = [
    {
      _id: 't1',
      año: 2024,
      tramos: [
        [0, 18],
        [20000, 28],
      ] as [number, number][],
    },
    {
      _id: 't2',
      año: 2026,
      tramos: [
        [0, 20],
        [25000, 32],
      ] as [number, number][],
    },
  ];

  it('coincidencia exacta, entrada anterior más reciente y fallback', () => {
    expect(resolverTablaAnual(historico, TRAMOS_IRPF_DEFAULT, 2026)).toEqual(historico[1].tramos);
    expect(resolverTablaAnual(historico, TRAMOS_IRPF_DEFAULT, 2025)).toEqual(historico[0].tramos);
    expect(resolverTablaAnual(historico, TRAMOS_IRPF_DEFAULT, 2030)).toEqual(historico[1].tramos);
    expect(resolverTablaAnual(historico, TRAMOS_IRPF_DEFAULT, 2020)).toEqual(TRAMOS_IRPF_DEFAULT);
    expect(resolverTablaAnual([], TRAMOS_IRPF_DEFAULT, 2026)).toEqual(TRAMOS_IRPF_DEFAULT);
    expect(resolverTablaAnual(null, TRAMOS_IRPF_DEFAULT, 2026)).toEqual(TRAMOS_IRPF_DEFAULT);
  });

  it('paridad con el legacy tramosIRPFParaAño / tramosGananciasParaAño', () => {
    const stateData: Record<string, unknown> = {
      tramosIRPFHistorico: historico,
      tramosGananciasCapitalHistorico: historico,
      config: { tramos_irpf: TRAMOS_IRPF_DEFAULT, tramosGananciasCapital: TRAMOS_IRPF_DEFAULT },
    };
    (globalThis as any).State = { get: (k: string) => stateData[k] };
    const resolver = crearResolverTramos(historico, TRAMOS_IRPF_DEFAULT);
    for (const año of [2020, 2024, 2025, 2026, 2027, 2030]) {
      expect(resolver(año)).toEqual(FM.tramosIRPFParaAño(año));
      expect(resolver(año)).toEqual(FM.tramosGananciasParaAño(año));
    }
  });

  it('el store expone los resolvers cableados a sus datos', () => {
    const seed = {
      [VERSION_KEY]: SCHEMA_VERSION,
      [`${KEY_PREFIX}tramosIRPFHistorico`]: historico,
      [`${KEY_PREFIX}config`]: { tramos_irpf: TRAMOS_IRPF_DEFAULT },
    };
    const store = createStore({ adapter: createMemoryAdapter(seed), hoy: HOY });
    store.load();
    expect(store.resolverTramosIRPF()(2026)).toEqual(historico[1].tramos);
    expect(store.resolverTramosGanancias()(2026)).toEqual(store.get('config').tramosGananciasCapital);
  });
});
