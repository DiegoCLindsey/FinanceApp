// Motor de simulación del gestor de objetivos. Los casos «§9» son los de
// referencia del documento de diseño.
import { describe, it, expect } from 'vitest';
import { diferenciaMeses, importeObjetivoEfectivo, simular, sumarMeses } from '@/planner/simulador';
import type { Objetivo, Plan, Vehiculo } from '@/planner/tipos';

const eu = (euros: number): number => Math.round(euros * 100);
const eur = (centimos: number): number => centimos / 100;

const CUENTA: Vehiculo = {
  _id: 'v-cuenta',
  nombre: 'Cuenta remunerada',
  rentabilidadRealAnual: 0,
  liquidez: 'INMEDIATA',
  fiscalidadRetirada: 0,
  riesgo: 'NULO',
};
const FONDO: Vehiculo = { ...CUENTA, _id: 'v-fondo', nombre: 'Fondo indexado', rentabilidadRealAnual: 0.05, riesgo: 'MEDIO' };
const PENSIONES: Vehiculo = { ...CUENTA, _id: 'v-pension', nombre: 'Plan de pensiones', topeAportacionAnual: eu(1500) };

const objetivo = (o: Partial<Objetivo> & Pick<Objetivo, '_id' | 'nombre'>): Objetivo => ({
  tipo: 'AHORRO_OBJETIVO',
  importeObjetivo: eu(10000),
  prioridad: 1,
  modoAsignacion: 'ABSORBE_TODO',
  vehiculoId: CUENTA._id,
  saldoActual: 0,
  estado: 'PENDIENTE',
  ...o,
});

const plan = (p: Partial<Plan> = {}): Plan => ({
  _id: 'p1',
  nombre: 'Base',
  fechaInicio: '2026-01',
  horizonteMeses: 120,
  pctDisfrute: 0,
  activo: true,
  perfil: { netoMensual: eu(4000), gastosFijosMensuales: eu(1000) },
  vehiculos: [CUENTA, FONDO, PENSIONES],
  objetivos: [],
  eventos: [],
  ...p,
});

describe('aritmética de meses', () => {
  it('suma y resta cruzando el año', () => {
    expect(sumarMeses('2026-01', 0)).toBe('2026-01');
    expect(sumarMeses('2026-11', 3)).toBe('2027-02');
    expect(sumarMeses('2026-03', -5)).toBe('2025-10');
    expect(sumarMeses('2026-12', 1)).toBe('2027-01');
  });

  it('cuenta la diferencia con signo', () => {
    expect(diferenciaMeses('2026-01', '2026-01')).toBe(0);
    expect(diferenciaMeses('2026-01', '2027-01')).toBe(12);
    expect(diferenciaMeses('2027-01', '2026-01')).toBe(-12);
  });
});

describe('§9 — amortización que absorbe todo', () => {
  it('10.000 € con 3.000 €/mes disponibles se cubren en 4 meses', () => {
    const r = simular(
      plan({
        perfil: { netoMensual: eu(4000), gastosFijosMensuales: eu(1000) }, // disponible 3.000
        objetivos: [objetivo({ _id: 'o1', nombre: 'Coche', tipo: 'AMORTIZAR_DEUDA', importeObjetivo: eu(10000) })],
      }),
    );
    expect(r.hitos).toHaveLength(1);
    expect(r.hitos[0].indice).toBe(3); // meses 0,1,2,3 → el cuarto mes
    expect(r.hitos[0].mes).toBe('2026-04');
    expect(r.viable).toBe(true);
  });
});

describe('§9 — encadenamiento', () => {
  // «La cuota liberada aparece íntegra en el siguiente objetivo el mes posterior
  // a completarse». Es la funcionalidad central del módulo.
  const p = plan({
    perfil: { netoMensual: eu(3000), gastosFijosMensuales: eu(1000) }, // disponible 2.000
    objetivos: [
      objetivo({ _id: 'coche', nombre: 'Coche', prioridad: 1, modoAsignacion: 'ABSORBE_TODO', importeObjetivo: eu(4000) }),
      objetivo({ _id: 'colchon', nombre: 'Colchón', prioridad: 2, modoAsignacion: 'ABSORBE_TODO', importeObjetivo: eu(6000) }),
    ],
  });

  it('el primero se lleva todo hasta completarse', () => {
    const r = simular(p);
    const dame = (i: number, id: string) => r.serieMensual[i].asignaciones.find((a) => a.objetivoId === id)!.asignado;
    expect(dame(0, 'coche')).toBe(eu(2000));
    expect(dame(0, 'colchon')).toBe(0);
    expect(dame(1, 'coche')).toBe(eu(2000));
    expect(dame(1, 'colchon')).toBe(0);
  });

  it('en cuanto el primero se completa, el segundo recibe TODO el flujo', () => {
    const r = simular(p);
    const dame = (i: number, id: string) => r.serieMensual[i].asignaciones.find((a) => a.objetivoId === id)!.asignado;
    // Mes 1 (índice 1) el coche llega a 4.000 y completa
    expect(r.hitos[0].objetivoId).toBe('coche');
    expect(r.hitos[0].indice).toBe(1);
    // Mes siguiente: el colchón recibe los 2.000 íntegros
    expect(dame(2, 'colchon')).toBe(eu(2000));
    expect(dame(2, 'coche')).toBe(0);
  });

  it('no se pierde ni se duplica capital en el traspaso', () => {
    const r = simular(p);
    for (const fila of r.serieMensual) {
      const repartido = fila.asignaciones.reduce((s, a) => s + a.asignado, 0);
      expect(repartido + fila.sinAsignar).toBe(fila.disponible);
    }
  });

  it('el hito registra qué cuota quedó liberada', () => {
    const r = simular(p);
    expect(r.hitos[0].cuotaLiberada).toBeGreaterThan(0);
  });
});

describe('cuota por fecha, con recálculo mensual', () => {
  it('reparte para llegar justo en la fecha límite', () => {
    const r = simular(
      plan({
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({
            _id: 'boda',
            nombre: 'Boda',
            modoAsignacion: 'CUOTA_POR_FECHA',
            importeObjetivo: eu(12000),
            fechaLimite: '2027-01', // 12 meses
          }),
        ],
      }),
    );
    // 12.000 en 12 meses sin rentabilidad = 1.000/mes. La fecha límite es
    // «tenerlo PARA 2027-01», así que la última aportación cae en 2026-12 y el
    // objetivo se completa ese mes: llega a tiempo, no tarde.
    expect(r.serieMensual[0].asignaciones[0].asignado).toBe(eu(1000));
    expect(r.hitos[0].mes).toBe('2026-12');
    expect(diferenciaMeses(r.hitos[0].mes, '2027-01')).toBe(1);
  });

  it('si un mes va sobrado, el siguiente pide menos (auto-corrección)', () => {
    const r = simular(
      plan({
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({ _id: 'boda', nombre: 'Boda', modoAsignacion: 'CUOTA_POR_FECHA', importeObjetivo: eu(12000), fechaLimite: '2027-01' }),
        ],
        eventos: [{ _id: 'ev', fecha: '2026-02', tipo: 'INYECCION_CAPITAL', importe: eu(3000), objetivoDestinoId: 'boda' }],
      }),
    );
    const pedido = (i: number) => r.serieMensual[i].asignaciones[0].solicitado;
    // Tras la inyección del mes 1, la cuota exigida cae
    expect(pedido(2)).toBeLessThan(pedido(0));
  });
});

describe('modo FIJO y tope fiscal (§9)', () => {
  it('corta al agotar el tope anual y reanuda en enero', () => {
    const r = simular(
      plan({
        horizonteMeses: 24,
        perfil: { netoMensual: eu(3000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({
            _id: 'pension',
            nombre: 'Plan de pensiones',
            tipo: 'APORTACION_FIJA',
            modoAsignacion: 'FIJO',
            importeFijoMensual: eu(200),
            importeObjetivo: eu(100000),
            vehiculoId: PENSIONES._id,
          }),
        ],
      }),
    );
    const dame = (i: number) => r.serieMensual[i].asignaciones[0].asignado;
    // 1.500 € / 200 € = 7 meses completos + 100 € el octavo
    expect(dame(0)).toBe(eu(200));
    expect(dame(6)).toBe(eu(200));
    expect(dame(7)).toBe(eu(100)); // se agota el tope
    expect(dame(8)).toBe(0); // resto del año, nada
    expect(dame(11)).toBe(0);
    expect(dame(12)).toBe(eu(200)); // enero siguiente: se reanuda
  });

  it('avisa de que la aportación configurada supera el tope', () => {
    const r = simular(
      plan({
        horizonteMeses: 12,
        objetivos: [
          objetivo({
            _id: 'pension',
            nombre: 'Pensiones',
            modoAsignacion: 'FIJO',
            importeFijoMensual: eu(200),
            importeObjetivo: eu(100000),
            vehiculoId: PENSIONES._id,
          }),
        ],
      }),
    );
    const aviso = r.avisos.find((a) => a.codigo === 'TOPE_FISCAL');
    expect(aviso).toBeDefined();
    expect(aviso!.mensaje).toContain('tope anual');
  });
});

describe('modo residual', () => {
  it('recibe lo que sobra tras servir a los de prioridad superior', () => {
    const r = simular(
      plan({
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({
            _id: 'fijo',
            nombre: 'Pensiones',
            prioridad: 1,
            modoAsignacion: 'FIJO',
            importeFijoMensual: eu(300),
            importeObjetivo: 0,
          }),
          objetivo({
            _id: 'fondo',
            nombre: 'Fondo',
            prioridad: 2,
            modoAsignacion: 'ABSORBE_RESIDUAL',
            importeObjetivo: 0,
            vehiculoId: FONDO._id,
          }),
        ],
      }),
    );
    const dame = (id: string) => r.serieMensual[0].asignaciones.find((a) => a.objetivoId === id)!.asignado;
    expect(dame('fijo')).toBe(eu(300));
    expect(dame('fondo')).toBe(eu(1700));
    expect(r.serieMensual[0].sinAsignar).toBe(0);
  });

  it('con varios residuales reparte por peso sin perder céntimos', () => {
    const r = simular(
      plan({
        horizonteMeses: 1,
        perfil: { netoMensual: eu(1000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({ _id: 'a', nombre: 'A', prioridad: 1, modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0, pesoResidual: 3 }),
          objetivo({ _id: 'b', nombre: 'B', prioridad: 2, modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0, pesoResidual: 1 }),
        ],
      }),
    );
    const dame = (id: string) => r.serieMensual[0].asignaciones.find((a) => a.objetivoId === id)!.asignado;
    expect(dame('a')).toBe(eu(750));
    expect(dame('b')).toBe(eu(250));
    expect(dame('a') + dame('b')).toBe(eu(1000));
  });
});

describe('§9 — inviabilidad', () => {
  it('detecta el déficit, lo cuantifica y propone ajustes', () => {
    const r = simular(
      plan({
        horizonteMeses: 12,
        perfil: { netoMensual: eu(3000), gastosFijosMensuales: 0 }, // disponible 3.000
        objetivos: [
          objetivo({
            _id: 'a',
            nombre: 'Boda',
            prioridad: 1,
            modoAsignacion: 'CUOTA_POR_FECHA',
            importeObjetivo: eu(24000),
            fechaLimite: '2027-01',
          }),
          objetivo({
            _id: 'b',
            nombre: 'Entrada',
            prioridad: 2,
            modoAsignacion: 'CUOTA_POR_FECHA',
            importeObjetivo: eu(18000),
            fechaLimite: '2027-01',
          }),
        ],
      }),
    );
    // Piden 2.000 + 1.500 = 3.500 con 3.000 disponibles
    expect(r.viable).toBe(false);
    const inviable = r.avisos.find((a) => a.codigo === 'INVIABLE')!;
    expect(inviable).toBeDefined();
    expect(eur(inviable.deficitMensual!)).toBeGreaterThan(0);
    expect(r.propuestas.length).toBeGreaterThan(0);
  });

  it('las propuestas vienen cuantificadas, no en abstracto', () => {
    const r = simular(
      plan({
        horizonteMeses: 12,
        pctDisfrute: 0.3,
        perfil: { netoMensual: eu(3000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({ _id: 'a', nombre: 'Boda', modoAsignacion: 'CUOTA_POR_FECHA', importeObjetivo: eu(30000), fechaLimite: '2027-01' }),
        ],
      }),
    );
    expect(r.viable).toBe(false);
    for (const p of r.propuestas) {
      expect(p.magnitud).toBeGreaterThan(0);
      expect(p.mensaje.length).toBeGreaterThan(10);
    }
    expect(r.propuestas.some((p) => p.clase === 'REDUCIR_DISFRUTE')).toBe(true);
  });

  it('un plan que cabe es viable y no propone nada', () => {
    const r = simular(
      plan({
        horizonteMeses: 12,
        perfil: { netoMensual: eu(3000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({ _id: 'a', nombre: 'Boda', modoAsignacion: 'CUOTA_POR_FECHA', importeObjetivo: eu(12000), fechaLimite: '2027-01' }),
        ],
      }),
    );
    expect(r.viable).toBe(true);
    expect(r.propuestas).toHaveLength(0);
  });
});

describe('§9 — eventos', () => {
  it('una inyección dirigida completa el objetivo antes de tiempo y libera su cuota', () => {
    const r = simular(
      plan({
        horizonteMeses: 24,
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({ _id: 'entrada', nombre: 'Entrada casa', prioridad: 1, modoAsignacion: 'ABSORBE_TODO', importeObjetivo: eu(80000) }),
          objetivo({ _id: 'fondo', nombre: 'Fondo', prioridad: 2, modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0 }),
        ],
        eventos: [{ _id: 'venta', fecha: '2026-07', tipo: 'INYECCION_CAPITAL', importe: eu(80000), objetivoDestinoId: 'entrada' }],
      }),
    );
    const hito = r.hitos.find((h) => h.objetivoId === 'entrada')!;
    expect(hito).toBeDefined();
    expect(hito.mes).toBe('2026-07');
    // Desde el mes siguiente, todo el flujo va al residual
    const sig = r.serieMensual.find((f) => f.mes === '2026-08')!;
    expect(sig.asignaciones.find((a) => a.objetivoId === 'fondo')!.asignado).toBe(eu(2000));
  });

  it('un cambio de ingresos altera el disponible desde su mes', () => {
    const r = simular(
      plan({
        horizonteMeses: 6,
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: 0 },
        objetivos: [objetivo({ _id: 'f', nombre: 'Fondo', modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0 })],
        eventos: [{ _id: 'subida', fecha: '2026-04', tipo: 'CAMBIO_INGRESOS', importe: eu(3000) }],
      }),
    );
    expect(r.serieMensual[2].disponible).toBe(eu(2000));
    expect(r.serieMensual[3].disponible).toBe(eu(3000));
  });

  it('una nueva deuda se suma a los gastos fijos', () => {
    const r = simular(
      plan({
        horizonteMeses: 4,
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: eu(500) },
        objetivos: [objetivo({ _id: 'f', nombre: 'Fondo', modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0 })],
        eventos: [{ _id: 'hipoteca', fecha: '2026-03', tipo: 'NUEVA_DEUDA', importe: eu(700) }],
      }),
    );
    expect(r.serieMensual[1].disponible).toBe(eu(1500));
    expect(r.serieMensual[2].disponible).toBe(eu(800));
  });
});

describe('disfrute', () => {
  it('aparta su porcentaje del sobrante antes de la cascada', () => {
    const r = simular(
      plan({
        horizonteMeses: 1,
        pctDisfrute: 0.25,
        perfil: { netoMensual: eu(3000), gastosFijosMensuales: eu(1000) },
        objetivos: [objetivo({ _id: 'f', nombre: 'Fondo', modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0 })],
      }),
    );
    expect(r.serieMensual[0].sobrante).toBe(eu(2000));
    expect(r.serieMensual[0].disfrute).toBe(eu(500));
    expect(r.serieMensual[0].disponible).toBe(eu(1500));
  });

  it('se ignoran los porcentajes imposibles en vez de romper el reparto', () => {
    const conNaN = simular(plan({ horizonteMeses: 1, pctDisfrute: NaN, objetivos: [objetivo({ _id: 'f', nombre: 'F' })] }));
    expect(conNaN.serieMensual[0].disfrute).toBe(0);
    const conExceso = simular(plan({ horizonteMeses: 1, pctDisfrute: 5, objetivos: [objetivo({ _id: 'f', nombre: 'F' })] }));
    expect(conExceso.serieMensual[0].disponible).toBe(0);
  });
});

describe('rentabilidad y patrimonio', () => {
  it('el vehículo con rentabilidad crece más que la cuenta sin remunerar', () => {
    const base = { horizonteMeses: 60, perfil: { netoMensual: eu(1000), gastosFijosMensuales: 0 } };
    const enCuenta = simular(
      plan({
        ...base,
        objetivos: [objetivo({ _id: 'x', nombre: 'X', modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0, vehiculoId: CUENTA._id })],
      }),
    );
    const enFondo = simular(
      plan({
        ...base,
        objetivos: [objetivo({ _id: 'x', nombre: 'X', modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0, vehiculoId: FONDO._id })],
      }),
    );
    expect(enFondo.resumen.patrimonioFinal).toBeGreaterThan(enCuenta.resumen.patrimonioFinal);
  });

  it('reparte el patrimonio final por vehículo', () => {
    const r = simular(
      plan({
        horizonteMeses: 12,
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({
            _id: 'a',
            nombre: 'A',
            prioridad: 1,
            modoAsignacion: 'FIJO',
            importeFijoMensual: eu(500),
            importeObjetivo: 0,
            vehiculoId: CUENTA._id,
          }),
          objetivo({ _id: 'b', nombre: 'B', prioridad: 2, modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0, vehiculoId: FONDO._id }),
        ],
      }),
    );
    expect(r.resumen.patrimonioPorVehiculo[CUENTA._id]).toBeGreaterThan(0);
    expect(r.resumen.patrimonioPorVehiculo[FONDO._id]).toBeGreaterThan(0);
  });
});

describe('independencia económica', () => {
  it('deriva el capital de la renta deseada en vez de pedirlo a mano', () => {
    const obj = objetivo({
      _id: 'fi',
      nombre: 'Independencia',
      tipo: 'INVERSION_PERPETUA',
      importeObjetivo: null,
      rentaDeseada: { rentaNetaMensual: eu(2000), tasaRetiroSeguro: 0.04, tipoFiscalEfectivo: 0.2 },
    });
    expect(eur(importeObjetivoEfectivo(obj))).toBeCloseTo(750000, 0);
  });

  it('registra el mes de independencia en el resumen', () => {
    const r = simular(
      plan({
        horizonteMeses: 24,
        perfil: { netoMensual: eu(10000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({
            _id: 'fi',
            nombre: 'Independencia',
            tipo: 'INVERSION_PERPETUA',
            modoAsignacion: 'ABSORBE_TODO',
            importeObjetivo: eu(50000),
          }),
        ],
      }),
    );
    expect(r.resumen.mesIndependencia).toBe('2026-05');
  });
});

describe('determinismo y consistencia', () => {
  it('mismo plan, mismo resultado', () => {
    const p = plan({
      horizonteMeses: 36,
      objetivos: [
        objetivo({ _id: 'a', nombre: 'A', prioridad: 1 }),
        objetivo({ _id: 'b', nombre: 'B', prioridad: 2, modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0 }),
      ],
    });
    expect(JSON.stringify(simular(p))).toBe(JSON.stringify(simular(p)));
  });

  it('no muta el plan que recibe', () => {
    const p = plan({ horizonteMeses: 12, objetivos: [objetivo({ _id: 'a', nombre: 'A' })] });
    const antes = JSON.stringify(p);
    simular(p);
    expect(JSON.stringify(p)).toBe(antes);
  });

  it('un plan sin objetivos no revienta', () => {
    const r = simular(plan({ horizonteMeses: 6, objetivos: [] }));
    expect(r.viable).toBe(true);
    expect(r.serieMensual).toHaveLength(6);
    expect(r.hitos).toHaveLength(0);
  });

  it('se detiene en cuanto todo está completado', () => {
    const r = simular(
      plan({
        horizonteMeses: 480,
        perfil: { netoMensual: eu(5000), gastosFijosMensuales: 0 },
        objetivos: [objetivo({ _id: 'a', nombre: 'A', importeObjetivo: eu(10000) })],
      }),
    );
    expect(r.mesesSimulados).toBe(2);
  });

  it('un objetivo que nace cubierto no reclama nada', () => {
    const r = simular(
      plan({
        horizonteMeses: 3,
        objetivos: [
          objetivo({ _id: 'hecho', nombre: 'Hecho', prioridad: 1, importeObjetivo: eu(1000), saldoActual: eu(1000) }),
          objetivo({ _id: 'sig', nombre: 'Siguiente', prioridad: 2, importeObjetivo: eu(100000) }),
        ],
      }),
    );
    // Sale en la fila (todas las columnas están siempre) pero con 0
    expect(r.serieMensual[0].asignaciones.find((a) => a.objetivoId === 'hecho')!.asignado).toBe(0);
    expect(r.serieMensual[0].asignaciones.find((a) => a.objetivoId === 'sig')!.asignado).toBe(eu(3000));
  });
});

describe('fases', () => {
  it('parte la línea temporal en los hitos', () => {
    const r = simular(
      plan({
        horizonteMeses: 12,
        perfil: { netoMensual: eu(2000), gastosFijosMensuales: 0 },
        objetivos: [
          objetivo({ _id: 'a', nombre: 'A', prioridad: 1, importeObjetivo: eu(4000) }),
          objetivo({ _id: 'b', nombre: 'B', prioridad: 2, modoAsignacion: 'ABSORBE_RESIDUAL', importeObjetivo: 0 }),
        ],
      }),
    );
    expect(r.fases.length).toBeGreaterThanOrEqual(2);
    expect(r.fases[0].objetivosActivos).toContain('a');
    expect(r.fases[1].objetivosActivos).toContain('b');
  });
});
