// Plantillas de evento (§2.7) y utilidades de escenarios (§5, pestaña 5).
import { describe, it, expect } from 'vitest';
import { PLANTILLAS, compararHitos, describirEvento, duplicarPlan, plantillaPorId } from '@/planner/eventos';
import type { Plan } from '@/planner/tipos';

const eu = (euros: number): number => Math.round(euros * 100);

describe('plantilla de venta de vivienda', () => {
  const p = plantillaPorId('venta-vivienda')!;

  it('resta hipoteca y gastos: ese ES el cálculo', () => {
    // Meter el precio de venta a secas infla el plan por decenas de miles
    expect(p.calcular({ precio: eu(300000), hipoteca: eu(180000), gastos: eu(20000) })).toBe(eu(100000));
  });

  it('nunca devuelve negativo aunque la venta no cubra la hipoteca', () => {
    expect(p.calcular({ precio: eu(100000), hipoteca: eu(180000), gastos: eu(5000) })).toBe(0);
  });

  it('deja constancia del desglose en las notas', () => {
    const texto = p.resumir({ precio: eu(300000), hipoteca: eu(180000), gastos: eu(20000) });
    expect(texto).toContain('300.000');
    expect(texto).toContain('180.000');
  });

  it('es una inyección de capital', () => {
    expect(p.tipo).toBe('INYECCION_CAPITAL');
  });
});

describe('plantillas de cambio', () => {
  it('la llegada de un hijo suma el incremento al gasto actual', () => {
    // El motor espera el NUEVO valor absoluto; quien rellena piensa en el delta
    const p = plantillaPorId('hijo')!;
    expect(p.calcular({ actuales: eu(1200), incremento: eu(400) })).toBe(eu(1600));
    expect(p.tipo).toBe('CAMBIO_GASTOS_FIJOS');
  });

  it('la subida de sueldo suma al neto actual', () => {
    const p = plantillaPorId('subida-sueldo')!;
    expect(p.calcular({ actual: eu(2500), subida: eu(300) })).toBe(eu(2800));
    expect(p.tipo).toBe('CAMBIO_INGRESOS');
  });

  it('la nueva hipoteca se suma a los gastos, no los reemplaza', () => {
    const p = plantillaPorId('nueva-hipoteca')!;
    expect(p.tipo).toBe('NUEVA_DEUDA');
    expect(p.calcular({ cuota: eu(750) })).toBe(eu(750));
  });

  it('todas las plantillas tienen los cuatro casos del documento', () => {
    const ids = PLANTILLAS.map((p) => p.id);
    expect(ids).toContain('venta-vivienda');
    expect(ids).toContain('nueva-hipoteca');
    expect(ids).toContain('hijo');
    expect(ids).toContain('subida-sueldo');
  });

  it('aguantan campos vacíos sin devolver NaN', () => {
    for (const p of PLANTILLAS) {
      const v = p.calcular({});
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('descripción de un evento guardado', () => {
  const ev = (tipo: string, importe: number, destino?: string) =>
    ({ _id: 'e', fecha: '2027-01', tipo, importe, objetivoDestinoId: destino ?? null }) as never;

  it('distingue una inyección dirigida de una al reparto general', () => {
    expect(describirEvento(ev('INYECCION_CAPITAL', eu(80000), 'o1'), 'Entrada casa')).toContain('«Entrada casa»');
    expect(describirEvento(ev('INYECCION_CAPITAL', eu(80000)))).toContain('reparto general');
  });

  it('dice si el valor es nuevo total o un incremento', () => {
    expect(describirEvento(ev('CAMBIO_GASTOS_FIJOS', eu(1600)))).toContain('pasan a');
    expect(describirEvento(ev('NUEVA_DEUDA', eu(750)))).toContain('suben');
  });
});

// ── Escenarios ────────────────────────────────────────────────────────────────

const plan: Plan = {
  _id: 'p1',
  nombre: 'Base',
  fechaInicio: '2026-01',
  horizonteMeses: 120,
  pctDisfrute: 0.1,
  activo: true,
  perfil: { netoMensual: eu(3000), gastosFijosMensuales: eu(1000) },
  vehiculos: [{ _id: 'v1', nombre: 'Cuenta', rentabilidadRealAnual: 0.01, liquidez: 'INMEDIATA', fiscalidadRetirada: 0, riesgo: 'NULO' }],
  objetivos: [
    {
      _id: 'o1',
      nombre: 'Coche',
      tipo: 'AHORRO_OBJETIVO',
      importeObjetivo: eu(10000),
      prioridad: 1,
      modoAsignacion: 'ABSORBE_TODO',
      vehiculoId: 'v1',
      saldoActual: 0,
      estado: 'PENDIENTE',
    },
  ],
  eventos: [{ _id: 'e1', fecha: '2027-01', tipo: 'INYECCION_CAPITAL', importe: eu(5000), objetivoDestinoId: 'o1' }],
};

describe('duplicar plan', () => {
  it('renueva TODOS los identificadores', () => {
    // Si dos planes compartieran ids, editar uno tocaría el otro
    const copia = duplicarPlan(plan, 'Optimista', 'p2', '2026-08-21');
    expect(copia._id).toBe('p2');
    expect(copia.vehiculos[0]._id).not.toBe('v1');
    expect(copia.objetivos[0]._id).not.toBe('o1');
    expect(copia.eventos[0]._id).not.toBe('e1');
  });

  it('reescribe las referencias internas para que sigan apuntando dentro', () => {
    const copia = duplicarPlan(plan, 'Optimista', 'p2', '2026-08-21');
    expect(copia.objetivos[0].vehiculoId).toBe(copia.vehiculos[0]._id);
    expect(copia.eventos[0].objetivoDestinoId).toBe(copia.objetivos[0]._id);
  });

  it('el duplicado NO nace activo: el usuario decide cuándo cambiarse', () => {
    expect(duplicarPlan(plan, 'Optimista', 'p2', '2026-08-21').activo).toBe(false);
  });

  it('conserva todo lo demás', () => {
    const copia = duplicarPlan(plan, 'Optimista', 'p2', '2026-08-21');
    expect(copia.nombre).toBe('Optimista');
    expect(copia.pctDisfrute).toBe(plan.pctDisfrute);
    expect(copia.perfil).toEqual(plan.perfil);
    expect(copia.objetivos[0].importeObjetivo).toBe(plan.objetivos[0].importeObjetivo);
  });

  it('no muta el original', () => {
    const antes = JSON.stringify(plan);
    duplicarPlan(plan, 'Optimista', 'p2', '2026-08-21');
    expect(JSON.stringify(plan)).toBe(antes);
  });

  it('una inyección sin destino sigue sin destino', () => {
    const sinDestino = { ...plan, eventos: [{ ...plan.eventos[0], objetivoDestinoId: null }] };
    expect(duplicarPlan(sinDestino, 'X', 'p3', '2026-08-21').eventos[0].objetivoDestinoId).toBeNull();
  });
});

describe('comparar hitos entre planes', () => {
  const hito = (nombre: string, mes: string, indice: number) => ({ objetivoId: `id_${nombre}`, nombre, mes, indice });

  it('empareja POR NOMBRE, que es lo único común entre planes distintos', () => {
    const filas = compararHitos([
      { nombre: 'A', hitos: [hito('Coche', '2026-06', 5), hito('Boda', '2028-01', 24)] },
      { nombre: 'B', hitos: [hito('Coche', '2026-04', 3), hito('Boda', '2027-07', 18)] },
    ]);
    expect(filas.map((f) => f.nombre)).toEqual(['Coche', 'Boda']);
    expect(filas[0].meses).toEqual(['2026-06', '2026-04']);
    expect(filas[0].diferencias).toEqual([0, -2]);
    expect(filas[1].diferencias).toEqual([0, -6]);
  });

  it('un hito que solo alcanza un plan sale como null, no como cero', () => {
    const filas = compararHitos([
      { nombre: 'A', hitos: [hito('Coche', '2026-06', 5)] },
      { nombre: 'B', hitos: [] },
    ]);
    expect(filas[0].meses).toEqual(['2026-06', null]);
    expect(filas[0].diferencias).toEqual([0, null]);
  });

  it('recoge hitos que solo existen en el segundo plan', () => {
    const filas = compararHitos([
      { nombre: 'A', hitos: [] },
      { nombre: 'B', hitos: [hito('Boda', '2027-07', 18)] },
    ]);
    expect(filas.map((f) => f.nombre)).toEqual(['Boda']);
    expect(filas[0].diferencias).toEqual([null, null]);
  });
});
