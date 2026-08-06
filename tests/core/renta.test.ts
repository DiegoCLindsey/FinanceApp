// Borrador de la declaración de la renta (core/tax/renta). Fija las
// correcciones deliberadas respecto a la vista legacy y la coherencia con la
// aritmética de las nóminas.
import { describe, it, expect } from 'vitest';
import { calcIRPF, calcBaseImponibleTrabajo, desgloseBaseTrabajo, TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';
import { TRAMOS_AHORRO_DEFAULT } from '@/core/tax/ahorro';
import { irpfGrupo } from '@/core/tax/nomina-grupo';
import { calcularDeclaracion, ingresoAnual, retencionesNomina, LIMITE_APORTACION_PENSION, type NominaDeclaracion } from '@/core/tax/renta';

const TRAMOS = TRAMOS_IRPF_DEFAULT;

const nomina = (extra: Partial<NominaDeclaracion> = {}): NominaDeclaracion => ({
  _id: 'n1',
  bruto: 40000,
  nPagas: 12,
  irpfModo: 'auto',
  irpfPct: 0,
  grupoNomina: '',
  activo: true,
  ...extra,
});

const base = {
  aportacionesPension: 0,
  otrosIngresos: 0,
  tramosGeneral: TRAMOS,
  tramosAhorro: TRAMOS_AHORRO_DEFAULT,
};

describe('desglose de la base del trabajo', () => {
  it('descompone el camino de bruto a base imponible sin cambiar el total', () => {
    const d = desgloseBaseTrabajo(40000, 2400);
    expect(d.baseIRPF).toBe(37600);
    expect(d.cotizSS).toBeCloseTo(40000 * 0.0635, 10);
    expect(d.gastosArt19).toBe(2000);
    expect(d.RNT).toBeCloseTo(37600 - 40000 * 0.0635 - 2000, 10);
    expect(d.reducArt20).toBe(0); // RNT > 21.622
    expect(d.baseImponible).toBeCloseTo(calcBaseImponibleTrabajo(40000, 2400), 10);
  });

  it('aplica la reducción del art. 20 en el tramo bajo y en el degresivo', () => {
    expect(desgloseBaseTrabajo(15000, 0).reducArt20).toBe(7302);
    const medio = desgloseBaseTrabajo(23000, 0);
    expect(medio.reducArt20).toBeGreaterThan(0);
    expect(medio.reducArt20).toBeLessThan(7302);
    expect(desgloseBaseTrabajo(60000, 0).reducArt20).toBe(0);
  });
});

describe('anualización de otros ingresos', () => {
  it('un ingreso mensual se multiplica por doce', () => {
    expect(ingresoAnual({ cuantia: 100, tipoFrecuencia: 'mensual' })).toBe(1200);
  });

  it('la frecuencia es un PERIODO: trimestral son cuatro cobros, no treinta y seis', () => {
    // El legacy hacía cuantia × frecuencia × 12 → 100 × 3 × 12 = 3.600
    expect(ingresoAnual({ cuantia: 100, tipoFrecuencia: 'mensual', frecuencia: 3 })).toBe(400);
  });

  it('anualiza los diarios, que el legacy dejaba sin anualizar', () => {
    expect(ingresoAnual({ cuantia: 10, tipoFrecuencia: 'diaria' })).toBeCloseTo(3652.5, 6);
    expect(ingresoAnual({ cuantia: 10, tipoFrecuencia: 'diaria', frecuencia: 7 })).toBeCloseTo(3652.5 / 7, 6);
  });

  it('un extraordinario cuenta una sola vez', () => {
    expect(ingresoAnual({ cuantia: 500, tipoFrecuencia: 'extraordinario' })).toBe(500);
  });
});

describe('retenciones de nómina', () => {
  it('coinciden exactamente con el IRPF del grupo', () => {
    const grupo = [nomina({ _id: 'a', bruto: 30000, grupoNomina: 'G' }), nomina({ _id: 'b', bruto: 30000, grupoNomina: 'G' })];
    expect(retencionesNomina(grupo, TRAMOS)).toBeCloseTo(irpfGrupo(grupo, TRAMOS), 8);
  });

  it('dos nóminas del mismo bruto en grupo retienen más que si tributaran sueltas', () => {
    // Es lo que la copia de la vista legacy perdía: sin desempate, ambas
    // arrancaban desde el primer tramo.
    const grupo = [nomina({ _id: 'a', bruto: 30000, grupoNomina: 'G' }), nomina({ _id: 'b', bruto: 30000, grupoNomina: 'G' })];
    const sueltas = grupo.map((n) => ({ ...n, grupoNomina: '' }));
    expect(retencionesNomina(grupo, TRAMOS)).toBeGreaterThan(retencionesNomina(sueltas, TRAMOS));
  });

  it('respeta el modo manual', () => {
    const manual = [nomina({ irpfModo: 'manual', irpfPct: 10, bruto: 40000 })];
    expect(retencionesNomina(manual, TRAMOS)).toBeCloseTo(4000, 8);
  });
});

describe('declaración', () => {
  it('sin datos da todo a cero', () => {
    const r = calcularDeclaracion({ ...base, nominas: [] });
    expect(r.brutoTotal).toBe(0);
    expect(r.baseGeneral).toBe(0);
    expect(r.cuotaIntegra).toBe(0);
    expect(r.resultado).toBe(0);
  });

  it('una sola nómina se retiene exactamente lo que tributa: ni pagar ni devolver', () => {
    const r = calcularDeclaracion({ ...base, nominas: [nomina({ bruto: 40000 })] });
    expect(r.baseGeneral).toBeCloseTo(calcBaseImponibleTrabajo(40000, 0), 8);
    expect(r.resultado).toBeCloseTo(0, 8);
  });

  it('la retribución flexible sale de la base y aparece en el desglose', () => {
    const conFlex = calcularDeclaracion({
      ...base,
      nominas: [nomina({ bruto: 40000, retribucionFlexible: [{ importe: 200 }] })],
    });
    expect(conFlex.flexTotal).toBe(2400);
    expect(conFlex.brutoIRPF).toBe(37600);
    expect(conFlex.baseGeneral).toBeLessThan(calcularDeclaracion({ ...base, nominas: [nomina({ bruto: 40000 })] }).baseGeneral);
  });

  it('las aportaciones a planes de pensiones se deducen hasta el límite legal', () => {
    const sinPP = calcularDeclaracion({ ...base, nominas: [nomina()] });
    const conPP = calcularDeclaracion({ ...base, nominas: [nomina()], aportacionesPension: 1000 });
    expect(conPP.deducPP).toBe(1000);
    expect(conPP.baseGeneral).toBeCloseTo(sinPP.baseGeneral - 1000, 8);
    // Y devuelve, porque la retención de nómina no conoce la aportación
    expect(conPP.resultado).toBeLessThan(0);
  });

  it('el límite deducible es 1.500 €, el mismo dato en toda la aplicación', () => {
    const r = calcularDeclaracion({ ...base, nominas: [nomina()], aportacionesPension: 9000 });
    expect(r.limPP).toBe(LIMITE_APORTACION_PENSION);
    expect(r.limPP).toBe(1500);
    expect(r.deducPP).toBe(1500);
  });

  it('la base del ahorro tributa por sus propios tramos', () => {
    const r = calcularDeclaracion({
      ...base,
      nominas: [],
      extras: { capMobiliario: 5000, gananciasFondos: 3000 },
    });
    expect(r.baseAhorro).toBe(8000);
    expect(r.cuotaAho).toBeCloseTo(calcIRPF(8000, TRAMOS_AHORRO_DEFAULT), 8);
    expect(r.cuotaGen).toBe(0);
  });

  it('una base del ahorro negativa no resta de la cuota', () => {
    const r = calcularDeclaracion({ ...base, nominas: [], extras: { gananciasFondos: -4000 } });
    expect(r.baseAhorro).toBe(0);
    expect(r.cuotaAho).toBe(0);
  });

  it('las retenciones de capital declaradas reducen el resultado', () => {
    const sin = calcularDeclaracion({ ...base, nominas: [], extras: { capMobiliario: 5000 } });
    const con = calcularDeclaracion({ ...base, nominas: [], extras: { capMobiliario: 5000, retCapital: 950 } });
    expect(con.resultado).toBeCloseTo(sin.resultado - 950, 8);
  });

  it('los otros ingresos y el capital inmobiliario suben la base general', () => {
    const r = calcularDeclaracion({ ...base, nominas: [], otrosIngresos: 3000, extras: { capInmobiliario: 2000 } });
    expect(r.baseGeneral).toBe(5000);
  });

  it('un grupo de nóminas retiene lo mismo que declara: resultado cero', () => {
    const grupo = [nomina({ _id: 'a', bruto: 35000, grupoNomina: 'G' }), nomina({ _id: 'b', bruto: 20000, grupoNomina: 'G' })];
    const r = calcularDeclaracion({ ...base, nominas: grupo });
    expect(r.retNomina).toBeCloseTo(irpfGrupo(grupo, TRAMOS), 8);
    expect(r.resultado).toBeCloseTo(0, 8);
  });

  it('acepta extras escritos como texto (vienen de inputs)', () => {
    const r = calcularDeclaracion({
      ...base,
      nominas: [],
      extras: { capMobiliario: '2500' as unknown as number, retCapital: 'no es un número' as unknown as number },
    });
    expect(r.capMobiliario).toBe(2500);
    expect(r.retCapital).toBe(0);
  });
});
