// Migración a v8: los «Objetivos de ahorro» se absorben dentro de un Plan.
// Aquí se toca la colección que ya tiene datos del usuario, así que lo que se
// comprueba sobre todo es que NO se pierde nada.
import { describe, it, expect } from 'vitest';
import { migrateTo8 } from '@/state/migrations/008-planner';

// El tipo `Plan` vivía en `@/planner/tipos`, retirado junto con el
// planificador (v10). La migración 008 sigue siendo necesaria para
// backups antiguos que la migración 010 limpia justo después, así que este
// test se queda pero con un tipo mínimo propio en vez de importarlo.
interface PlanMigrado {
  nombre: string;
  activo: boolean;
  fechaInicio: string;
  notas: string;
  objetivos: Array<{
    _id: string;
    nombre: string;
    importeObjetivo: number;
    fechaLimite: string | null;
    modoAsignacion: string;
    estado: string;
    prioridad: number;
    vehiculoId: string;
    saldoActual: number;
  }>;
  vehiculos: Array<{
    _id: string;
    nombre: string;
    rentabilidadRealAnual: number;
    fiscalidadRetirada: number;
    cuentaId: string;
    liquidez: string;
    topeAportacionAnual: number | null;
  }>;
}

const CTX = { hoyISO: '2026-08-21', finISO: '2027-08-21' };

const estado = (extra: Record<string, unknown> = {}) => ({
  accounts: [
    { _id: 'c1', nombre: 'Corriente', interes: 0, modeloFondo: 'cuenta', activo: true },
    { _id: 'c2', nombre: 'Fondo', interes: 5, modeloFondo: 'inversion', activo: true, impuestoRetirada: 19, bloqueoMeses: 12 },
    { _id: 'c3', nombre: 'Pensiones', interes: 4, modeloFondo: 'pension', activo: true },
  ],
  goals: [
    { _id: 'g1', nombre: 'Boda', targetAmount: 30000, targetDate: '2027-06-15', cuentaIds: ['c1'], prioridad: 1, completado: false },
    { _id: 'g2', nombre: 'Colchón', targetAmount: 12000, targetDate: null, cuentaIds: ['c2'], prioridad: 2, completado: false },
    { _id: 'g3', nombre: 'Portátil', targetAmount: 1500, cuentaIds: [], prioridad: 3, completado: true },
  ],
  ...extra,
});

const migrar = (e: Record<string, unknown> = estado()): PlanMigrado => (migrateTo8(e, CTX).planes as PlanMigrado[])[0];

describe('migración a v8', () => {
  it('crea un plan base con los tres objetivos', () => {
    const plan = migrar();
    expect(plan.nombre).toBe('Plan base');
    expect(plan.activo).toBe(true);
    expect(plan.fechaInicio).toBe('2026-08');
    expect(plan.objetivos).toHaveLength(3);
  });

  it('no pierde ningún objetivo ni le cambia el nombre', () => {
    const nombres = migrar().objetivos.map((o) => o.nombre);
    expect(nombres).toEqual(['Boda', 'Colchón', 'Portátil']);
  });

  it('conserva los identificadores, para no romper referencias', () => {
    expect(migrar().objetivos.map((o) => o._id)).toEqual(['g1', 'g2', 'g3']);
  });

  it('convierte los importes a céntimos enteros', () => {
    const [boda] = migrar().objetivos;
    expect(boda.importeObjetivo).toBe(3000000);
    expect(Number.isInteger(boda.importeObjetivo)).toBe(true);
  });

  it('recorta la fecha a mes y respeta la ausencia de fecha', () => {
    const [boda, colchon] = migrar().objetivos;
    expect(boda.fechaLimite).toBe('2027-06');
    expect(colchon.fechaLimite).toBeNull();
  });

  it('deduce el modo: con fecha hay cuota, sin fecha se llena con lo que haya', () => {
    const [boda, colchon] = migrar().objetivos;
    expect(boda.modoAsignacion).toBe('CUOTA_POR_FECHA');
    expect(colchon.modoAsignacion).toBe('ABSORBE_TODO');
  });

  it('respeta el estado completado', () => {
    const objetivos = migrar().objetivos;
    expect(objetivos[2].estado).toBe('COMPLETADO');
    expect(objetivos[0].estado).toBe('PENDIENTE');
  });

  it('conserva la prioridad', () => {
    expect(migrar().objetivos.map((o) => o.prioridad)).toEqual([1, 2, 3]);
  });
});

describe('vehículos derivados de las cuentas', () => {
  it('crea uno por cuenta, sin duplicar lo que la cuenta ya sabe', () => {
    const plan = migrar();
    expect(plan.vehiculos).toHaveLength(3);
    const fondo = plan.vehiculos.find((v) => v.nombre === 'Fondo')!;
    expect(fondo.rentabilidadRealAnual).toBeCloseTo(0.05, 4);
    expect(fondo.fiscalidadRetirada).toBeCloseTo(0.19, 4);
    expect(fondo.cuentaId).toBe('c2');
  });

  it('marca la liquidez según el tipo de cuenta', () => {
    const v = migrar().vehiculos;
    expect(v.find((x) => x.nombre === 'Corriente')!.liquidez).toBe('INMEDIATA');
    expect(v.find((x) => x.nombre === 'Fondo')!.liquidez).toBe('MEDIA');
    expect(v.find((x) => x.nombre === 'Pensiones')!.liquidez).toBe('BLOQUEADA_HASTA_JUBILACION');
  });

  it('pone el tope de 1.500 € solo a los planes de pensiones', () => {
    const v = migrar().vehiculos;
    expect(v.find((x) => x.nombre === 'Pensiones')!.topeAportacionAnual).toBe(150000);
    expect(v.find((x) => x.nombre === 'Corriente')!.topeAportacionAnual).toBeNull();
  });

  it('enlaza cada objetivo con el vehículo de su cuenta', () => {
    const plan = migrar();
    const veh = (id: string) => plan.vehiculos.find((v) => v._id === id)!;
    expect(veh(plan.objetivos[0].vehiculoId).cuentaId).toBe('c1');
    expect(veh(plan.objetivos[1].vehiculoId).cuentaId).toBe('c2');
  });

  it('un objetivo sin cuentas cae en el primer vehículo, no se queda huérfano', () => {
    const plan = migrar();
    expect(plan.objetivos[2].vehiculoId).toBe(plan.vehiculos[0]._id);
  });
});

describe('seguridad de la migración', () => {
  it('NO copia el saldo de las cuentas como saldo de partida', () => {
    // Un goal medía el saldo VIVO de sus cuentas. Copiarlo aquí contaría el
    // mismo dinero dos veces en cuanto la cuenta siguiera alimentándose.
    expect(migrar().objetivos.every((o) => o.saldoActual === 0)).toBe(true);
  });

  it('no borra `goals`: si la conversión sale mal, el original sigue ahí', () => {
    const salida = migrateTo8(estado(), CTX);
    expect(Array.isArray(salida.goals)).toBe(true);
    expect((salida.goals as unknown[]).length).toBe(3);
  });

  it('es idempotente: correr dos veces no duplica planes', () => {
    const una = migrateTo8(estado(), CTX);
    const dos = migrateTo8(una, CTX);
    expect((dos.planes as PlanMigrado[]).length).toBe(1);
    expect(JSON.stringify(dos.planes)).toBe(JSON.stringify(una.planes));
  });

  it('aguanta un estado sin objetivos ni cuentas', () => {
    const plan = migrar({ goals: [], accounts: [] });
    expect(plan.objetivos).toHaveLength(0);
    expect(plan.vehiculos).toHaveLength(0);
    expect(plan.notas).toBe('');
  });

  it('aguanta datos corruptos sin lanzar', () => {
    const plan = migrar({
      accounts: [{ _id: 'c1' }],
      goals: [{ _id: 'g1' }, { nombre: 42, targetAmount: 'mucho', cuentaIds: 'no-es-array' }],
    } as unknown as Record<string, unknown>);
    expect(plan.objetivos).toHaveLength(2);
    expect(plan.objetivos[0].importeObjetivo).toBe(0);
    expect(plan.objetivos[1].nombre).toBe('Objetivo 2');
  });

  it('deja una nota que explica de dónde viene el plan', () => {
    expect(migrar().notas).toContain('migrar');
  });
});
