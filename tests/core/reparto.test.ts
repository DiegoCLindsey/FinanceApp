import { describe, it, expect } from 'vitest';
import {
  agregarPorPersona,
  calcularReparto,
  idPersonaPorDefecto,
  personasImplicadas,
  type EventoConFuente,
  type ItemConReparto,
} from '@/core/reparto';
import type { Persona, Reparto } from '@/state/schema';

const DEFECTO = 'default';

describe('calcularReparto — sin reparto', () => {
  it('sin Reparto, el 100% es de la persona por defecto', () => {
    expect(calcularReparto(100, undefined, DEFECTO)).toEqual([{ personaId: DEFECTO, importe: 100 }]);
  });

  it('null se trata igual que undefined', () => {
    expect(calcularReparto(50, null, DEFECTO)).toEqual([{ personaId: DEFECTO, importe: 50 }]);
  });

  it('una lista de participantes vacía se trata como "sin reparto"', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [] };
    expect(calcularReparto(75, reparto, DEFECTO)).toEqual([{ personaId: DEFECTO, importe: 75 }]);
  });
});

describe('calcularReparto — partes iguales', () => {
  it('dos personas, importe que divide exacto', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'a' }, { personaId: 'b' }] };
    expect(calcularReparto(100, reparto, DEFECTO)).toEqual([
      { personaId: 'a', importe: 50 },
      { personaId: 'b', importe: 50 },
    ]);
  });

  it('tres personas, 100€: el céntimo sobrante no se pierde ni se duplica', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'a' }, { personaId: 'b' }, { personaId: 'c' }] };
    const partes = calcularReparto(100, reparto, DEFECTO);
    expect(partes.map((p) => p.importe)).toEqual([33.34, 33.33, 33.33]);
    expect(partes.reduce((s, p) => s + p.importe, 0)).toBeCloseTo(100, 2);
  });

  it('un solo participante se lleva el 100%', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'a' }] };
    expect(calcularReparto(42.5, reparto, DEFECTO)).toEqual([{ personaId: 'a', importe: 42.5 }]);
  });

  it('un importe negativo (un ingreso repartido) también cuadra exacto', () => {
    const reparto: Reparto = { modo: 'partesIguales', participantes: [{ personaId: 'a' }, { personaId: 'b' }, { personaId: 'c' }] };
    const partes = calcularReparto(-100, reparto, DEFECTO);
    expect(partes.reduce((s, p) => s + p.importe, 0)).toBeCloseTo(-100, 2);
    expect(partes.every((p) => p.importe <= 0)).toBe(true);
  });
});

describe('calcularReparto — porcentaje', () => {
  it('porcentajes que suman 100 exacto', () => {
    const reparto: Reparto = {
      modo: 'porcentaje',
      participantes: [
        { personaId: 'a', valor: 70 },
        { personaId: 'b', valor: 30 },
      ],
    };
    expect(calcularReparto(200, reparto, DEFECTO)).toEqual([
      { personaId: 'a', importe: 140 },
      { personaId: 'b', importe: 60 },
    ]);
  });

  it('porcentajes que NO llegan a 100: el resto cae en la persona por defecto', () => {
    const reparto: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'pareja', valor: 40 }] };
    expect(calcularReparto(100, reparto, DEFECTO)).toEqual([
      { personaId: 'pareja', importe: 40 },
      { personaId: DEFECTO, importe: 60 },
    ]);
  });

  it('si la persona por defecto YA es participante, el resto se le suma en vez de duplicar la entrada', () => {
    const reparto: Reparto = {
      modo: 'porcentaje',
      participantes: [
        { personaId: DEFECTO, valor: 20 },
        { personaId: 'pareja', valor: 30 },
      ],
    };
    const partes = calcularReparto(100, reparto, DEFECTO);
    expect(partes).toHaveLength(2);
    expect(partes.find((p) => p.personaId === DEFECTO)?.importe).toBe(70); // 20 explícito + 50 de resto
    expect(partes.find((p) => p.personaId === 'pareja')?.importe).toBe(30);
  });

  it('el 100% para una sola persona ajena (ni un céntimo para la persona por defecto)', () => {
    // El ejemplo del pedido: "mi pareja paga el 100% de las cosas de los gatos".
    const reparto: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'pareja', valor: 100 }] };
    expect(calcularReparto(60, reparto, DEFECTO)).toEqual([{ personaId: 'pareja', importe: 60 }]);
  });

  it('porcentajes que suman MÁS de 100 se escalan para que quepan exactos', () => {
    const reparto: Reparto = {
      modo: 'porcentaje',
      participantes: [
        { personaId: 'a', valor: 70 },
        { personaId: 'b', valor: 60 },
      ],
    };
    const partes = calcularReparto(100, reparto, DEFECTO);
    // 70/130 y 60/130 de 100, sin que la persona por defecto reciba nada:
    // ya está todo sobre-reclamado.
    expect(partes).toHaveLength(2);
    expect(partes.reduce((s, p) => s + p.importe, 0)).toBeCloseTo(100, 2);
    expect(partes.find((p) => p.personaId === 'a')!.importe).toBeGreaterThan(partes.find((p) => p.personaId === 'b')!.importe);
  });

  it('un porcentaje negativo se trata como cero, no como que "quita" a otro', () => {
    const reparto: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'a', valor: -20 }] };
    expect(calcularReparto(100, reparto, DEFECTO)).toEqual([
      { personaId: 'a', importe: 0 },
      { personaId: DEFECTO, importe: 100 },
    ]);
  });
});

describe('calcularReparto — importe exacto', () => {
  it('importes que suman el total exacto', () => {
    const reparto: Reparto = {
      modo: 'importe',
      participantes: [
        { personaId: 'a', valor: 30 },
        { personaId: 'b', valor: 20 },
      ],
    };
    expect(calcularReparto(50, reparto, DEFECTO)).toEqual([
      { personaId: 'a', importe: 30 },
      { personaId: 'b', importe: 20 },
    ]);
  });

  it('importes que no llegan al total: el resto cae en la persona por defecto', () => {
    const reparto: Reparto = { modo: 'importe', participantes: [{ personaId: 'pareja', valor: 25 }] };
    expect(calcularReparto(100, reparto, DEFECTO)).toEqual([
      { personaId: 'pareja', importe: 25 },
      { personaId: DEFECTO, importe: 75 },
    ]);
  });

  it('importes que exceden el total se escalan para caber exactos', () => {
    const reparto: Reparto = {
      modo: 'importe',
      participantes: [
        { personaId: 'a', valor: 80 },
        { personaId: 'b', valor: 80 },
      ],
    };
    const partes = calcularReparto(100, reparto, DEFECTO);
    expect(partes.reduce((s, p) => s + p.importe, 0)).toBeCloseTo(100, 2);
    expect(partes.find((p) => p.personaId === 'a')!.importe).toBe(50);
    expect(partes.find((p) => p.personaId === 'b')!.importe).toBe(50);
  });

  it('un importe exacto igual al total, para una sola persona, no deja nada para la persona por defecto', () => {
    const reparto: Reparto = { modo: 'importe', participantes: [{ personaId: 'a', valor: 45.5 }] };
    expect(calcularReparto(45.5, reparto, DEFECTO)).toEqual([{ personaId: 'a', importe: 45.5 }]);
  });
});

describe('calcularReparto — invariante de suma exacta', () => {
  it('la suma de las partes es siempre el total, para una batería de importes con decimales feos', () => {
    const importes = [10.01, 33.33, 99.99, 0.01, 1234.56, 7.77, 0.02, 3];
    const repartos: Reparto[] = [
      { modo: 'partesIguales', participantes: [{ personaId: 'a' }, { personaId: 'b' }, { personaId: 'c' }] },
      {
        modo: 'porcentaje',
        participantes: [
          { personaId: 'a', valor: 33 },
          { personaId: 'b', valor: 33 },
          { personaId: 'c', valor: 33 },
        ],
      },
      { modo: 'importe', participantes: [{ personaId: 'a', valor: 1.11 }] },
    ];
    for (const importe of importes) {
      for (const reparto of repartos) {
        const partes = calcularReparto(importe, reparto, DEFECTO);
        const suma = partes.reduce((s, p) => s + Math.round(p.importe * 100), 0) / 100;
        expect(suma).toBeCloseTo(importe, 2);
      }
    }
  });
});

describe('personasImplicadas', () => {
  it('sin ningún reparto, solo la persona por defecto', () => {
    expect(personasImplicadas(undefined, undefined, DEFECTO)).toEqual(new Set([DEFECTO]));
  });

  it('el ejemplo del pedido: pago 100% mío, consumo repartido con mi pareja', () => {
    const pago: Reparto = { modo: 'porcentaje', participantes: [{ personaId: DEFECTO, valor: 100 }] };
    const consumo: Reparto = { modo: 'partesIguales', participantes: [{ personaId: DEFECTO }, { personaId: 'pareja' }] };
    expect(personasImplicadas(consumo, pago, DEFECTO)).toEqual(new Set([DEFECTO, 'pareja']));
  });

  it('el otro ejemplo: paga la pareja, consumen los gatos — ninguno es la persona por defecto', () => {
    const pago: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'pareja', valor: 100 }] };
    const consumo: Reparto = { modo: 'porcentaje', participantes: [{ personaId: 'gatos', valor: 100 }] };
    expect(personasImplicadas(consumo, pago, DEFECTO)).toEqual(new Set(['gatos', 'pareja']));
  });

  it('solo reparto de pago: el consumo, sin reparto, sigue siendo de la persona por defecto', () => {
    const pago: Reparto = { modo: 'importe', participantes: [{ personaId: 'pareja', valor: 20 }] };
    expect(personasImplicadas(undefined, pago, DEFECTO)).toEqual(new Set([DEFECTO, 'pareja']));
  });

  it('un reparto con una lista de participantes vacía cuenta como "sin reparto"', () => {
    const vacio: Reparto = { modo: 'partesIguales', participantes: [] };
    expect(personasImplicadas(vacio, vacio, DEFECTO)).toEqual(new Set([DEFECTO]));
  });
});

describe('idPersonaPorDefecto', () => {
  it('la persona marcada esPorDefecto, sea cual sea su id', () => {
    const personas: Persona[] = [
      { _id: 'default', nombre: 'Yo', esPorDefecto: false, activo: true },
      { _id: 'p2', nombre: 'Pareja', esPorDefecto: true, activo: true },
    ];
    // La marca se ha movido a "Pareja" desde la ventana de Personas: no es 'default'.
    expect(idPersonaPorDefecto(personas)).toBe('p2');
  });

  it('sin nadie marcado (no debería pasar en la práctica), cae en la primera', () => {
    const personas: Persona[] = [{ _id: 'x', nombre: 'X', esPorDefecto: false, activo: true }];
    expect(idPersonaPorDefecto(personas)).toBe('x');
  });

  it('sin ninguna persona, cae en el id de fábrica', () => {
    expect(idPersonaPorDefecto([])).toBe('default');
  });
});

describe('agregarPorPersona', () => {
  const PERSONAS: Persona[] = [
    { _id: 'default', nombre: 'Yo', esPorDefecto: true, activo: true },
    { _id: 'pareja', nombre: 'Pareja', esPorDefecto: false, activo: true },
  ];

  it('un gasto sin reparto va entero a pago y consumo de la persona por defecto', () => {
    const eventos: EventoConFuente[] = [{ cuantia: 100, tipo: 'gasto', sourceType: 'expense', sourceId: 'e1' }];
    const fuentes = { expenses: [{ _id: 'e1' }], loans: [], nominas: [] };
    const out = agregarPorPersona(eventos, fuentes, PERSONAS);
    expect(out.find((p) => p.personaId === 'default')).toMatchObject({ pago: 100, consumo: 100, ingresos: 0 });
    expect(out.find((p) => p.personaId === 'pareja')).toMatchObject({ pago: 0, consumo: 0, ingresos: 0 });
  });

  it('el ejemplo del pedido: pago 100% mío, consumo repartido a medias con mi pareja', () => {
    const luz: ItemConReparto = {
      _id: 'e1',
      repartoPago: { modo: 'porcentaje', participantes: [{ personaId: 'default', valor: 100 }] },
      repartoConsumo: { modo: 'partesIguales', participantes: [{ personaId: 'default' }, { personaId: 'pareja' }] },
    };
    const eventos: EventoConFuente[] = [{ cuantia: 60, tipo: 'gasto', sourceType: 'expense', sourceId: 'e1' }];
    const out = agregarPorPersona(eventos, { expenses: [luz], loans: [], nominas: [] }, PERSONAS);
    expect(out.find((p) => p.personaId === 'default')).toMatchObject({ pago: 60, consumo: 30 });
    expect(out.find((p) => p.personaId === 'pareja')).toMatchObject({ pago: 0, consumo: 30 });
  });

  it('varios gastos del mismo origen (recurrencia mensual) se suman', () => {
    const eventos: EventoConFuente[] = [
      { cuantia: 50, tipo: 'gasto', sourceType: 'expense', sourceId: 'e1' },
      { cuantia: 50, tipo: 'gasto', sourceType: 'expense', sourceId: 'e1' },
      { cuantia: 50, tipo: 'gasto', sourceType: 'expense', sourceId: 'e1' },
    ];
    const out = agregarPorPersona(eventos, { expenses: [{ _id: 'e1' }], loans: [], nominas: [] }, PERSONAS);
    expect(out.find((p) => p.personaId === 'default')?.pago).toBe(150);
  });

  it('una cuota de préstamo (cuantia negativa) se toma en valor absoluto', () => {
    const prestamo: ItemConReparto = {
      _id: 'l1',
      repartoPago: { modo: 'porcentaje', participantes: [{ personaId: 'pareja', valor: 100 }] },
    };
    const eventos: EventoConFuente[] = [{ cuantia: -300, tipo: 'gasto', sourceType: 'loan', sourceId: 'l1' }];
    const out = agregarPorPersona(eventos, { expenses: [], loans: [prestamo], nominas: [] }, PERSONAS);
    expect(out.find((p) => p.personaId === 'pareja')?.pago).toBe(300);
  });

  it('los ingresos de nómina se atribuyen por repartoConsumo, no repartoPago', () => {
    const nomina: ItemConReparto = {
      _id: 'n1',
      repartoConsumo: { modo: 'porcentaje', participantes: [{ personaId: 'pareja', valor: 100 }] },
    };
    const eventos: EventoConFuente[] = [{ cuantia: 2000, tipo: 'ingreso', sourceType: 'nomina', sourceId: 'n1' }];
    const out = agregarPorPersona(eventos, { expenses: [], loans: [], nominas: [nomina] }, PERSONAS);
    expect(out.find((p) => p.personaId === 'pareja')?.ingresos).toBe(2000);
    expect(out.find((p) => p.personaId === 'default')?.ingresos).toBe(0);
  });

  it('los eventos de IRPF/SS de una nómina (sufijo en el sourceId) se atribuyen a la misma nómina', () => {
    const nomina: ItemConReparto = {
      _id: 'n1',
      repartoConsumo: { modo: 'porcentaje', participantes: [{ personaId: 'pareja', valor: 100 }] },
    };
    const eventos: EventoConFuente[] = [
      { cuantia: 2000, tipo: 'ingreso', sourceType: 'nomina', sourceId: 'n1' },
      { cuantia: 400, tipo: 'gasto', sourceType: 'nomina', sourceId: 'n1_irpf' }, // no cuenta: no es 'ingreso'
      { cuantia: 130, tipo: 'ingreso', sourceType: 'nomina', sourceId: 'n1_flex_transporte' },
    ];
    const out = agregarPorPersona(eventos, { expenses: [], loans: [], nominas: [nomina] }, PERSONAS);
    expect(out.find((p) => p.personaId === 'pareja')?.ingresos).toBe(2130);
  });

  it('otros orígenes (intereses, aportaciones, impuestos) no cuentan en el desglose', () => {
    const eventos: EventoConFuente[] = [
      { cuantia: 50, tipo: 'ingreso', sourceType: 'account-interest', sourceId: 'c1' },
      { cuantia: 100, tipo: 'ingreso', sourceType: 'aportacion-in', sourceId: 'ap1' },
      { cuantia: 30, tipo: 'gasto', sourceType: 'investment-tax', sourceId: 'e1' },
    ];
    const out = agregarPorPersona(eventos, { expenses: [], loans: [], nominas: [] }, PERSONAS);
    expect(out.every((p) => p.pago === 0 && p.consumo === 0 && p.ingresos === 0)).toBe(true);
  });

  it('un gasto de tipo "ingreso" (no ligado a persona por defecto de forma distinta) no se cuenta como gasto', () => {
    const eventos: EventoConFuente[] = [{ cuantia: 200, tipo: 'ingreso', sourceType: 'expense', sourceId: 'e1' }];
    const out = agregarPorPersona(eventos, { expenses: [{ _id: 'e1' }], loans: [], nominas: [] }, PERSONAS);
    expect(out.every((p) => p.pago === 0 && p.consumo === 0)).toBe(true);
  });

  it('todas las personas aparecen en el resultado aunque no tengan movimientos', () => {
    const out = agregarPorPersona([], { expenses: [], loans: [], nominas: [] }, PERSONAS);
    expect(out.map((p) => p.personaId).sort()).toEqual(['default', 'pareja']);
  });

  it('un evento cuyo origen ya no existe se atribuye por defecto a la persona por defecto', () => {
    const eventos: EventoConFuente[] = [{ cuantia: 20, tipo: 'gasto', sourceType: 'expense', sourceId: 'borrado' }];
    const out = agregarPorPersona(eventos, { expenses: [], loans: [], nominas: [] }, PERSONAS);
    expect(out.find((p) => p.personaId === 'default')?.pago).toBe(20);
  });
});
