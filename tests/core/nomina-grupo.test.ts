// IRPF de grupos de nóminas (core/tax/nomina-grupo).
//
// La aritmética venía triplicada dentro de la vista legacy. Estos tests fijan el
// comportamiento contra un "oráculo" que reproduce literalmente el cálculo de la
// vista, para garantizar que la extracción no mueve ningún número — salvo el
// caso de brutos empatados, que la vista calculaba mal y aquí se corrige a
// propósito (hay un test que lo documenta).
import { describe, it, expect } from 'vitest';
import {
  agruparNominas,
  desgloseNomina,
  flexAnual,
  irpfGrupo,
  irpfNomina,
  SS_PCT_DEFECTO,
  type NominaGrupoLike,
} from '@/core/tax/nomina-grupo';
import { calcBaseImponibleTrabajo, calcIRPF, TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';

const TRAMOS = TRAMOS_IRPF_DEFAULT;

const nomina = (extra: Partial<NominaGrupoLike> & { _id: string }): NominaGrupoLike => ({ nPagas: 12, irpfModo: 'auto', ...extra });

/** Cálculo de la fila tal como lo hacía `nominas/nominas.js` (renderRow). */
function oraculoFilaLegacy(n: NominaGrupoLike, grupo: NominaGrupoLike[] | null): number {
  const brutoAnual = n.bruto || 0;
  const flexRow = (n.retribucionFlexible || []).reduce((s, c) => s + (c.importe || 0) * 12, 0);
  const baseRow = Math.max(0, brutoAnual - flexRow);
  if (n.irpfModo === 'manual') return baseRow * ((n.irpfPct || 0) / 100);
  if (grupo) {
    const totalBruto = grupo.reduce((s, m) => s + (m.bruto || 0), 0);
    const totalFlex = grupo.reduce((s, m) => s + (m.retribucionFlexible || []).reduce((ss, c) => ss + (c.importe || 0) * 12, 0), 0);
    const totalBaseIRPF = Math.max(0, totalBruto - totalFlex);
    const groupImponible = calcBaseImponibleTrabajo(totalBruto, totalFlex);
    const nomBase = Math.max(0, brutoAnual - flexRow);
    const nomImponible = totalBaseIRPF > 0 ? groupImponible * (nomBase / totalBaseIRPF) : 0;
    const imponibleAcum = grupo
      .filter((m) => m._id !== n._id && (m.bruto || 0) > brutoAnual)
      .reduce((s, m) => {
        const mFlex = (m.retribucionFlexible || []).reduce((ss, c) => ss + (c.importe || 0) * 12, 0);
        const mBase = Math.max(0, (m.bruto || 0) - mFlex);
        return s + (totalBaseIRPF > 0 ? groupImponible * (mBase / totalBaseIRPF) : 0);
      }, 0);
    return calcIRPF(imponibleAcum + nomImponible, TRAMOS) - calcIRPF(imponibleAcum, TRAMOS);
  }
  return calcIRPF(calcBaseImponibleTrabajo(brutoAnual, flexRow), TRAMOS);
}

describe('paridad con el cálculo de la vista legacy', () => {
  const casos: [string, NominaGrupoLike[]][] = [
    ['una sola nómina', [nomina({ _id: 'a', bruto: 32000 })]],
    ['dos nóminas de brutos distintos', [nomina({ _id: 'a', bruto: 45000 }), nomina({ _id: 'b', bruto: 12000 })]],
    [
      'tres nóminas con retribución flexible',
      [
        nomina({ _id: 'a', bruto: 60000, retribucionFlexible: [{ importe: 100 }, { importe: 50 }] }),
        nomina({ _id: 'b', bruto: 24000, retribucionFlexible: [{ importe: 70 }] }),
        nomina({ _id: 'c', bruto: 9000 }),
      ],
    ],
    [
      'grupo con una nómina en modo manual',
      [nomina({ _id: 'a', bruto: 50000 }), nomina({ _id: 'b', bruto: 15000, irpfModo: 'manual', irpfPct: 12 })],
    ],
    ['brutos a cero', [nomina({ _id: 'a', bruto: 0 }), nomina({ _id: 'b', bruto: 0 })]],
  ];

  it.each(casos)('%s: cada fila coincide con el legacy', (_caso, grupo) => {
    for (const n of grupo) {
      expect(irpfNomina(n, grupo, TRAMOS)).toBeCloseTo(oraculoFilaLegacy(n, grupo), 8);
    }
  });

  it('una nómina sin grupo tributa sola, igual que antes', () => {
    const n = nomina({ _id: 'a', bruto: 38000, retribucionFlexible: [{ importe: 60 }] });
    expect(irpfNomina(n, null, TRAMOS)).toBeCloseTo(oraculoFilaLegacy(n, null), 10);
  });
});

describe('coherencia del grupo', () => {
  it('las filas suman exactamente el total del grupo', () => {
    const grupo = [
      nomina({ _id: 'a', bruto: 55000, retribucionFlexible: [{ importe: 120 }] }),
      nomina({ _id: 'b', bruto: 21000 }),
      nomina({ _id: 'c', bruto: 8000 }),
    ];
    const suma = grupo.reduce((s, n) => s + irpfNomina(n, grupo, TRAMOS), 0);
    expect(irpfGrupo(grupo, TRAMOS)).toBeCloseTo(suma, 10);
  });

  it('con brutos EMPATADOS las filas siguen cuadrando (el legacy se quedaba corto)', () => {
    const grupo = [nomina({ _id: 'a', bruto: 30000 }), nomina({ _id: 'b', bruto: 30000 })];

    const suma = grupo.reduce((s, n) => s + irpfNomina(n, grupo, TRAMOS), 0);
    const totalReal = calcIRPF(calcBaseImponibleTrabajo(60000, 0), TRAMOS);
    expect(suma).toBeCloseTo(totalReal, 8);

    // El legacy repartía mal: su filtro `> bruto` descartaba a la empatada, así
    // que ambas filas se calculaban desde cero y sumaban MENOS que el impuesto
    // real del grupo. Se corrige a propósito.
    const sumaLegacy = grupo.reduce((s, n) => s + oraculoFilaLegacy(n, grupo), 0);
    expect(sumaLegacy).toBeLessThan(totalReal);
  });

  it('el orden de la lista no altera el resultado de cada nómina', () => {
    const a = nomina({ _id: 'a', bruto: 44000 });
    const b = nomina({ _id: 'b', bruto: 17000 });
    const c = nomina({ _id: 'c', bruto: 5000 });
    const directo = [a, b, c];
    const inverso = [c, b, a];
    for (const n of directo) {
      expect(irpfNomina(n, directo, TRAMOS)).toBeCloseTo(irpfNomina(n, inverso, TRAMOS), 10);
    }
  });

  it('la nómina mayor soporta el tipo bajo y la menor el marginal', () => {
    const grande = nomina({ _id: 'a', bruto: 60000 });
    const pequena = nomina({ _id: 'b', bruto: 6000 });
    const grupo = [grande, pequena];

    const tipoPequenaSola = irpfNomina(pequena, null, TRAMOS) / 6000;
    const tipoPequenaEnGrupo = irpfNomina(pequena, grupo, TRAMOS) / 6000;
    // Es el sentido del apilado: sumada a la grande, paga mucho más que sola
    expect(tipoPequenaEnGrupo).toBeGreaterThan(tipoPequenaSola);
  });

  it('una nómina manual no apila tramo sobre las automáticas', () => {
    const auto = nomina({ _id: 'a', bruto: 30000 });
    const manual = nomina({ _id: 'b', bruto: 90000, irpfModo: 'manual', irpfPct: 30 });
    const grupo = [auto, manual];

    expect(irpfNomina(manual, grupo, TRAMOS)).toBeCloseTo(90000 * 0.3, 10);

    // La automática arranca desde el primer tramo: no se le apilan los 90.000 €
    // de la manual. Sí comparte con ella las reducciones del grupo, que se
    // reparten sobre el total —por eso no coincide con calcularla aislada—, y
    // eso es exactamente lo que hacía la vista legacy.
    const conManual = irpfNomina(auto, grupo, TRAMOS);
    const apilada = irpfNomina(
      nomina({ _id: 'x', bruto: 30000 }),
      [nomina({ _id: 'y', bruto: 90000 }), nomina({ _id: 'x', bruto: 30000 })],
      TRAMOS,
    );
    expect(conManual).toBeLessThan(apilada);
    expect(conManual / 30000).toBeLessThan(0.3);
  });
});

describe('desglose de una nómina', () => {
  it('calcula flexible, base dineraria, SS, IRPF y neto por paga', () => {
    const n = nomina({ _id: 'a', bruto: 36000, nPagas: 14, retribucionFlexible: [{ importe: 100 }] });
    const d = desgloseNomina(n, null, TRAMOS);

    expect(d.flexAnual).toBe(1200);
    expect(d.baseDineraria).toBe(34800);
    expect(d.ssPct).toBe(SS_PCT_DEFECTO);
    expect(d.ssAnual).toBeCloseTo(34800 * 0.0635, 10);
    expect(d.nPagas).toBe(14);
    expect(d.netoPorPaga).toBeCloseTo((34800 - d.ssAnual - d.irpfAnual) / 14, 10);
    expect(d.irpfPct).toBeCloseTo((d.irpfAnual / 34800) * 100, 10);
  });

  it('respeta una cotización de SS personalizada', () => {
    const d = desgloseNomina(nomina({ _id: 'a', bruto: 20000, ssPct: 4.7 }), null, TRAMOS);
    expect(d.ssAnual).toBeCloseTo(20000 * 0.047, 10);
  });

  it('un bruto de cero no divide por cero', () => {
    const d = desgloseNomina(nomina({ _id: 'a', bruto: 0 }), null, TRAMOS);
    expect(d.irpfPct).toBe(0);
    expect(Number.isFinite(d.netoPorPaga)).toBe(true);
  });

  it('la retribución flexible no puede dejar la base en negativo', () => {
    const n = nomina({ _id: 'a', bruto: 1000, retribucionFlexible: [{ importe: 500 }] });
    expect(flexAnual(n)).toBe(6000);
    expect(desgloseNomina(n, null, TRAMOS).baseDineraria).toBe(0);
  });
});

describe('agrupación', () => {
  it('separa las agrupadas de las sueltas', () => {
    const { grupos, sueltas } = agruparNominas([
      { _id: 'a', bruto: 1, grupoNomina: 'casa' },
      { _id: 'b', bruto: 2, grupoNomina: 'casa' },
      { _id: 'c', bruto: 3 },
      { _id: 'd', bruto: 4, grupoNomina: '' },
    ]);
    expect([...grupos.keys()]).toEqual(['casa']);
    expect(grupos.get('casa')).toHaveLength(2);
    expect(sueltas.map((n) => n._id)).toEqual(['c', 'd']);
  });

  it('una lista vacía no rompe nada', () => {
    const { grupos, sueltas } = agruparNominas([]);
    expect(grupos.size).toBe(0);
    expect(sueltas).toEqual([]);
  });
});
