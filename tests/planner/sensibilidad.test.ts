// Análisis de sensibilidad (§4): cuánto adelanta o retrasa cada palanca.
import { describe, it, expect } from 'vitest';
import { analizarSensibilidad, describirDesplazamiento, planVariado } from '@/planner/sensibilidad';
import { simular } from '@/planner/simulador';
import type { Plan } from '@/planner/tipos';

const eu = (euros: number): number => Math.round(euros * 100);

const plan = (p: Partial<Plan> = {}): Plan => ({
  _id: 'p1',
  nombre: 'Base',
  fechaInicio: '2026-01',
  horizonteMeses: 240,
  pctDisfrute: 0.2,
  activo: true,
  perfil: { netoMensual: eu(3000), gastosFijosMensuales: eu(1000) },
  vehiculos: [
    { _id: 'v1', nombre: 'Cuenta', rentabilidadRealAnual: 0.01, liquidez: 'INMEDIATA', fiscalidadRetirada: 0, riesgo: 'NULO' },
    { _id: 'v2', nombre: 'Fondo', rentabilidadRealAnual: 0.05, liquidez: 'MEDIA', fiscalidadRetirada: 0.19, riesgo: 'MEDIO' },
  ],
  objetivos: [
    {
      _id: 'o1',
      nombre: 'Colchón',
      tipo: 'AHORRO_OBJETIVO',
      importeObjetivo: eu(60000),
      prioridad: 1,
      modoAsignacion: 'ABSORBE_TODO',
      vehiculoId: 'v2',
      saldoActual: 0,
      estado: 'PENDIENTE',
    },
  ],
  eventos: [],
  ...p,
});

describe('variación del plan', () => {
  it('la rentabilidad se mueve en PUNTOS, no en porcentaje relativo', () => {
    // Bajar 2 puntos un fondo al 5 % lo deja al 3 %, no al 4,9 %
    const v = planVariado(plan(), 'rentabilidad', -2);
    expect(v.vehiculos.find((x) => x._id === 'v2')!.rentabilidadRealAnual).toBeCloseTo(0.03, 6);
    expect(v.vehiculos.find((x) => x._id === 'v1')!.rentabilidadRealAnual).toBeCloseTo(0, 6);
  });

  it('la rentabilidad no baja de cero', () => {
    // Una rentabilidad real negativa sostenida no es un escenario, es otro supuesto
    const v = planVariado(plan(), 'rentabilidad', -10);
    expect(v.vehiculos.every((x) => x.rentabilidadRealAnual >= 0)).toBe(true);
  });

  it('el disfrute se mueve en puntos y se queda entre 0 y 100', () => {
    expect(planVariado(plan({ pctDisfrute: 0.2 }), 'disfrute', 10).pctDisfrute).toBeCloseTo(0.3, 6);
    expect(planVariado(plan({ pctDisfrute: 0.05 }), 'disfrute', -10).pctDisfrute).toBe(0);
    expect(planVariado(plan({ pctDisfrute: 0.95 }), 'disfrute', 10).pctDisfrute).toBe(1);
  });

  it('los ingresos se mueven en porcentaje relativo', () => {
    expect(planVariado(plan(), 'ingresos', 20).perfil.netoMensual).toBe(eu(3600));
    expect(planVariado(plan(), 'ingresos', -20).perfil.netoMensual).toBe(eu(2400));
  });

  it('un delta de cero devuelve el mismo plan, sin copiar', () => {
    const p = plan();
    expect(planVariado(p, 'rentabilidad', 0)).toBe(p);
  });

  it('no muta el plan original', () => {
    const p = plan();
    const antes = JSON.stringify(p);
    planVariado(p, 'rentabilidad', -2);
    planVariado(p, 'ingresos', 20);
    expect(JSON.stringify(p)).toBe(antes);
  });
});

describe('análisis completo', () => {
  it('devuelve los tres ejes del documento', () => {
    const ejes = analizarSensibilidad(plan());
    expect(ejes.map((e) => e.palanca)).toEqual(['rentabilidad', 'disfrute', 'ingresos']);
  });

  it('la rentabilidad se explora de −2 a +2 puntos', () => {
    const [rent] = analizarSensibilidad(plan());
    expect(rent.variantes.map((v) => v.delta)).toEqual([-2, -1, 0, 1, 2]);
  });

  it('cada eje incluye el plan actual como referencia, con desplazamiento cero', () => {
    for (const eje of analizarSensibilidad(plan())) {
      const base = eje.variantes.find((v) => v.esBase)!;
      expect(base.etiqueta).toBe('Plan actual');
      expect(base.desplazamientoMeses).toBe(0);
    }
  });

  it('más ingresos adelantan el objetivo y menos lo retrasan', () => {
    const ingresos = analizarSensibilidad(plan()).find((e) => e.palanca === 'ingresos')!;
    const mas = ingresos.variantes.find((v) => v.delta === 20)!;
    const menos = ingresos.variantes.find((v) => v.delta === -20)!;
    expect(mas.desplazamientoMeses!).toBeLessThan(0);
    expect(menos.desplazamientoMeses!).toBeGreaterThan(0);
  });

  it('más disfrute retrasa: es dinero que deja de ir a los objetivos', () => {
    const disfrute = analizarSensibilidad(plan()).find((e) => e.palanca === 'disfrute')!;
    const mas = disfrute.variantes.find((v) => v.delta === 10)!;
    expect(mas.desplazamientoMeses!).toBeGreaterThan(0);
  });

  it('más rentabilidad adelanta o al menos no retrasa', () => {
    const rent = analizarSensibilidad(plan()).find((e) => e.palanca === 'rentabilidad')!;
    const mas = rent.variantes.find((v) => v.delta === 2)!;
    expect(mas.desplazamientoMeses!).toBeLessThanOrEqual(0);
    expect(mas.patrimonioFinal).toBeGreaterThan(rent.variantes.find((v) => v.esBase)!.patrimonioFinal);
  });

  it('registra la fecha de cada hito, no solo el desplazamiento', () => {
    const [rent] = analizarSensibilidad(plan());
    const base = rent.variantes.find((v) => v.esBase)!;
    expect(base.hitos.o1).toMatch(/^\d{4}-\d{2}$/);
    expect(base.hitos.o1).toBe(simular(plan()).hitos[0].mes);
  });

  it('sin hitos alcanzables, el desplazamiento es null en vez de un cero engañoso', () => {
    const imposible = plan({
      horizonteMeses: 6,
      objetivos: [
        {
          _id: 'o1',
          nombre: 'Imposible',
          tipo: 'AHORRO_OBJETIVO',
          importeObjetivo: eu(10000000),
          prioridad: 1,
          modoAsignacion: 'ABSORBE_TODO',
          vehiculoId: 'v1',
          saldoActual: 0,
          estado: 'PENDIENTE',
        },
      ],
    });
    for (const eje of analizarSensibilidad(imposible)) {
      for (const v of eje.variantes) expect(v.desplazamientoMeses).toBeNull();
    }
  });
});

describe('redacción del impacto', () => {
  it('traduce meses a años y meses', () => {
    expect(describirDesplazamiento(-14)).toBe('1 año y 2 meses antes');
    expect(describirDesplazamiento(25)).toBe('2 años y 1 mes más tarde');
    expect(describirDesplazamiento(-3)).toBe('3 meses antes');
    expect(describirDesplazamiento(12)).toBe('1 año más tarde');
  });

  it('dice «sin cambio» y «no comparable» en vez de un número vacío', () => {
    expect(describirDesplazamiento(0)).toBe('sin cambio');
    expect(describirDesplazamiento(null)).toBe('no comparable');
  });
});
