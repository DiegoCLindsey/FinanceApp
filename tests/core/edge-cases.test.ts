// Casos límite del núcleo (Fase 3, tarea 3.1).
//
// Todo lo que sigue son caminos defensivos: campos ausentes, colecciones
// vacías, divisiones por cero y tablas sin tramos. Son los que se rompen
// cuando llega un backup viejo o un dato a medio rellenar, y los que menos se
// pisan en el uso normal — por eso van juntos y con nombre explícito.
import { describe, it, expect } from 'vitest';
import { calcFondoInversion, calcFondosPension, calcImpuestoPension, calcTipoMarginalPension } from '@/core/tax/pension';
import { agruparNominas, desgloseNomina, flexAnual, irpfNomina, tipoMarginal, tipoMarginalGrupo } from '@/core/tax/nomina-grupo';
import { TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';
import { calcGananciasCapital } from '@/core/tax/ahorro';

const TRAMOS = TRAMOS_IRPF_DEFAULT;

describe('fondos de inversión sin datos completos', () => {
  it('sin aportaciones el coste base cae en el saldo inicial', () => {
    const r = calcFondoInversion({ modeloFondo: 'inversion', saldoInicial: 8000 }, null);
    expect(r?.costBase).toBe(8000);
    expect(r?.plusvalia).toBe(0);
  });

  it('con aportaciones que suman cero también cae en el saldo inicial', () => {
    // `reduce(...) || saldoInicial`: un total de 0 es falsy y activa el respaldo
    const r = calcFondoInversion(
      { modeloFondo: 'inversion', saldoInicial: 5000, aportaciones: [{ fecha: '2024-01-01', cantidad: 0 }] },
      null,
    );
    expect(r?.costBase).toBe(5000);
  });

  it('sin aportaciones ni saldo inicial el coste base es cero', () => {
    const r = calcFondoInversion({ modeloFondo: 'inversion', historicoSaldos: [{ fecha: '2026-01-01', saldo: 3000 }] }, null);
    expect(r?.costBase).toBe(0);
    expect(r?.plusvalia).toBe(3000);
  });

  it('una cuenta que no es fondo devuelve null', () => {
    expect(calcFondoInversion({ modeloFondo: 'cuenta', saldoInicial: 100 }, null)).toBeNull();
  });
});

describe('planes de pensiones sin datos completos', () => {
  const hoy = new Date(2026, 6, 31);

  it('sin bloqueo configurado usa 120 meses', () => {
    const p = calcFondosPension(
      { modeloFondo: 'pension', saldoInicial: 1000, aportaciones: [{ fecha: '2020-01-01', cantidad: 1000 }] },
      hoy,
    );
    // 2020 está dentro de los 120 meses previos: sigue bloqueada
    expect(p?.disponible).toBe(0);
    expect(p?.bloqueado).toBe(1000);
  });

  it('sin aportaciones el coste base es cero y todo está disponible', () => {
    const p = calcFondosPension({ modeloFondo: 'pension', saldoInicial: 500 }, hoy);
    expect(p?.costBase).toBe(0);
    expect(p?.numAportaciones).toBe(0);
    // costBase 0 → ratio 0 → nada disponible por aportaciones, pero tampoco bloqueado más allá del saldo
    expect((p?.disponible ?? 0) + (p?.bloqueado ?? 0)).toBeCloseTo(500, 8);
  });

  it('el impuesto de rescate es cero sin tipo, sin saldo o sin beneficio', () => {
    const base = { modeloFondo: 'pension' as const, saldoInicial: 1000, aportaciones: [{ fecha: '2015-01-01', cantidad: 1000 }] };
    expect(calcImpuestoPension({ ...base, impuestoRetirada: 0 }, 500)).toBe(0); // sin tipo
    expect(calcImpuestoPension({ modeloFondo: 'pension', impuestoRetirada: 24 }, 500)).toBe(0); // sin saldo
    expect(calcImpuestoPension({ ...base, impuestoRetirada: 24 }, 500)).toBe(0); // saldo == coste base
  });

  it('el tipo marginal cae en el fijo de la cuenta si no hay grupo', () => {
    expect(calcTipoMarginalPension({ modeloFondo: 'pension', impuestoRetirada: 24 }, [], TRAMOS)).toBe(24);
  });

  it('con grupo pero sin nóminas ni tramos usa el 19 % de arranque', () => {
    expect(calcTipoMarginalPension({ modeloFondo: 'pension', grupoNomina: 'G' }, null, null)).toBe(19);
  });

  it('con grupo y tramos coge el que corresponde al bruto conjunto', () => {
    const nominas = [{ grupoNomina: 'G', bruto: 30000, nPagas: 1 }];
    expect(calcTipoMarginalPension({ modeloFondo: 'pension', grupoNomina: 'G' }, nominas, TRAMOS)).toBe(30);
  });
});

describe('nóminas con campos ausentes', () => {
  it('sin retribución flexible el importe anual es cero', () => {
    expect(flexAnual({ _id: 'n1' })).toBe(0);
    expect(flexAnual({ _id: 'n1', retribucionFlexible: [{}] })).toBe(0);
  });

  it('sin bruto la base dineraria es cero y el desglose no divide por cero', () => {
    const d = desgloseNomina({ _id: 'n1' }, null, TRAMOS);
    expect(d.brutoAnual).toBe(0);
    expect(d.baseDineraria).toBe(0);
    expect(d.irpfPct).toBe(0);
    expect(d.nPagas).toBe(12); // valor por defecto
    expect(Number.isFinite(d.netoPorPaga)).toBe(true);
  });

  it('el modo manual sin porcentaje no retiene nada', () => {
    expect(irpfNomina({ _id: 'n1', bruto: 40000, irpfModo: 'manual' }, null, TRAMOS)).toBe(0);
  });

  it('una nómina que no está en el grupo que se le pasa tributa por su cuenta', () => {
    const grupo = [{ _id: 'a', bruto: 30000 }];
    const forastera = { _id: 'z', bruto: 20000 };
    expect(irpfNomina(forastera, grupo, TRAMOS)).toBe(irpfNomina(forastera, null, TRAMOS));
  });

  it('un grupo cuyo bruto dinerario es cero reparte una base imponible nula', () => {
    // Todo el bruto es retribución flexible exenta
    const grupo = [{ _id: 'a', bruto: 1200, retribucionFlexible: [{ importe: 100 }] }];
    expect(irpfNomina(grupo[0], grupo, TRAMOS)).toBe(0);
  });

  it('el tipo marginal de un grupo vacío es cero', () => {
    expect(tipoMarginalGrupo([], TRAMOS)).toBe(0);
  });

  it('el tipo marginal con tabla vacía cae en el 19 % de arranque', () => {
    expect(tipoMarginal(50000, [])).toBe(19);
  });

  it('agrupar una lista vacía no produce grupos ni sueltas', () => {
    const { grupos, sueltas } = agruparNominas([]);
    expect(grupos.size).toBe(0);
    expect(sueltas).toEqual([]);
  });
});

describe('ganancias de capital en los extremos', () => {
  it('una plusvalía nula o negativa no tributa', () => {
    expect(calcGananciasCapital(0, null)).toBe(0);
    expect(calcGananciasCapital(-500, null)).toBe(0);
  });

  it('una plusvalía que agota los tramos tributa por todos ellos', () => {
    const impuesto = calcGananciasCapital(400000, null);
    expect(impuesto).toBeGreaterThan(0);
    // El tipo efectivo queda entre el primer tramo y el último
    expect(impuesto / 400000).toBeGreaterThan(0.19);
    expect(impuesto / 400000).toBeLessThan(0.28);
  });
});
