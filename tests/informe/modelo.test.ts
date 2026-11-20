// «Crear informe» contra el SALDO DE LAS CUENTAS: lo real son los saldos
// anotados (y el inicial) de cada cuenta; lo previsto, el extracto del motor.
// Lo que se comprueba aquí es que todo cuadra: el puente, la tabla mes a mes y
// las cuentas encajan en el último saldo real conocido (el corte).
import { describe, expect, it } from 'vitest';
import { construirInforme, type EntradaInforme } from '@/informe/modelo';
import { informeHtml } from '@/informe/html';
import type { CashEvent } from '@/engine/types';
import type { Account, Expense } from '@/state/schema';

const HOY = '2026-11-20';

/** Saldos anotados por cuenta: [fecha, saldo al empezar ese día]. */
type Saldos = Record<string, [string, number][]>;

function entorno(saldos: Saldos = {}, reservas: [string, number][] = []) {
  const anotados: Saldos = {
    // Septiembre cuadra; en octubre faltan 150; del 1 al 15 de noviembre, 50 más.
    default: [
      ['2026-09-01', 3000],
      ['2026-10-01', 3800],
      ['2026-11-01', 4450],
      ['2026-11-15', 3200],
    ],
    // El ahorro no se actualiza desde septiembre.
    aho: [['2026-09-01', 500]],
    ...saldos,
  };
  const cuentas = [
    { _id: 'default', nombre: 'Nómina', activo: true },
    { _id: 'aho', nombre: 'Ahorro', activo: true },
  ] as unknown as Account[];
  const gastos = [
    { _id: 'alq', concepto: 'Alquiler', tipo: 'gasto', tipoFrecuencia: 'mensual' },
    { _id: 'sup', concepto: 'Supermercado', tipo: 'gasto', tipoFrecuencia: 'mensual' },
    { _id: 'sue', concepto: 'Sueldo', tipo: 'ingreso', tipoFrecuencia: 'mensual' },
  ] as unknown as Expense[];

  const entrada_ = (c: Account, fecha: string) => (anotados[c._id] ?? []).filter(([f]) => f <= fecha).at(-1);

  /** Extracto «del motor»: alquiler y súper el día 1, sueldo el 28. */
  const generarExtracto = (desde: string, hasta: string): CashEvent[] => {
    const out: CashEvent[] = [];
    for (let y = 2026, m = 1; y < 2028; m === 12 ? ((m = 1), y++) : m++) {
      const mm = `${y}-${String(m).padStart(2, '0')}`;
      const ev = (dia: string, concepto: string, cuantia: number, tipo: 'gasto' | 'ingreso', sourceId: string) =>
        out.push({ fecha: `${mm}-${dia}`, concepto, cuantia, tipo, tags: [], cuenta: 'default', sourceId, sourceType: 'expense' });
      ev('01', 'Alquiler', 900, 'gasto', 'alq');
      ev('01', 'Supermercado', 300, 'gasto', 'sup');
      ev('28', 'Sueldo', 2000, 'ingreso', 'sue');
    }
    // La reserva para imprevistos que mete el motor con «Contar imprevistos».
    for (const [fecha, cuantia] of reservas)
      out.push({
        fecha,
        concepto: 'Imprevistos estimados',
        cuantia,
        tipo: 'gasto',
        tags: [],
        cuenta: 'default',
        sourceId: 'imp',
        sourceType: 'imprevisto-estimado',
      } as CashEvent);
    return out.filter((e) => e.fecha >= desde && e.fecha <= hasta);
  };

  const entrada = (desde: string, hasta: string, extra: Partial<EntradaInforme> = {}): EntradaInforme => ({
    desde,
    hasta,
    hoy: HOY,
    proyecto: 'Mis finanzas',
    cuentas,
    gastos,
    prestamos: [],
    generarExtracto,
    saldoEnFecha: (c, fecha) => entrada_(c, fecha)?.[1] ?? 0,
    ultimoSaldoConocido: (c, fecha) => entrada_(c, fecha)?.[0] ?? '',
    ...extra,
  });
  return { cuentas, entrada };
}

describe('construirInforme (contra el saldo de las cuentas)', () => {
  it('parte en el último saldo real y todo cuadra', () => {
    const { entrada } = entorno();
    const inf = construirInforme(entrada('2026-09-01', '2026-12-31'));

    expect(inf.comprobaciones.every((c) => c.ok)).toBe(true);
    expect(inf.corte).toBe('2026-11-15');
    expect(inf.saldoInicio).toBe(3500);
    // Previsto hasta el corte: sep +800, oct +800, 1 nov −1200
    expect(inf.saldoPrevistoCorte).toBe(3900);
    // Real en el corte: 3200 de la nómina + 500 del ahorro
    expect(inf.saldoCorte).toBe(3700);
    expect(inf.diferencia).toBe(-200);
    // Futuro: sueldo de noviembre y diciembre entero
    expect(inf.saldoFinal).toBe(3700 + 2000 + 800);

    const paso = (c: string) => inf.puente.find((p) => p.concepto === c)?.importe;
    expect(paso('Diferencia con el saldo real')).toBe(-200);
    expect(paso('Ingresos previstos hasta el corte')).toBe(4000);
    expect(paso('Gastos previstos hasta el corte')).toBe(-3600);
    expect(paso('Ingresos previstos desde el corte')).toBe(4000);
    expect(paso('Gastos previstos desde el corte')).toBe(-1200);
  });

  it('mes a mes: el saldo final de los meses pasados es el real y la diferencia lo explica', () => {
    const { entrada } = entorno();
    const inf = construirInforme(entrada('2026-09-01', '2026-12-31'));
    expect(inf.meses.map((m) => m.tipo)).toEqual(['real', 'real', 'en-curso', 'previsto']);
    expect(inf.meses.map((m) => m.desviacion)).toEqual([0, -150, -50, 0]);
    // septiembre y octubre acaban en el saldo real del día 1 siguiente
    expect(inf.meses[0].saldoFinal).toBe(4300);
    expect(inf.meses[1].saldoFinal).toBe(4950);
    for (let i = 0; i < inf.meses.length; i++) {
      const m = inf.meses[i];
      expect(m.saldoInicial + m.ingresos - m.gastos + m.otros + m.desviacion).toBeCloseTo(m.saldoFinal, 2);
      if (i > 0) expect(m.saldoInicial).toBeCloseTo(inf.meses[i - 1].saldoFinal, 2);
    }
    expect(inf.meses.at(-1)!.saldoFinal).toBe(inf.saldoFinal);
    // lo previsto desde el inicio, sin corregir con los saldos reales
    expect(inf.meses.at(-1)!.saldoPrevistoDesdeInicio).toBe(3500 + 800 * 4);
  });

  it('por cuenta: previsto frente a real en el corte, y avisa de la que no se actualiza', () => {
    const { entrada } = entorno();
    const inf = construirInforme(entrada('2026-09-01', '2026-12-31'));
    const nomina = inf.cuentas.find((c) => c._id === 'default')!;
    expect(nomina).toMatchObject({ saldoInicio: 3000, saldoPrevisto: 3400, saldoReal: 3200, diferencia: -200, saldoFinal: 6000 });
    const aho = inf.cuentas.find((c) => c._id === 'aho')!;
    expect(aho).toMatchObject({ saldoInicio: 500, saldoReal: 500, diferencia: 0, ultimoDato: '2026-09-01' });
    expect(inf.avisos.some((a) => a.includes('«Ahorro»') && a.includes('2026-09-01'))).toBe(true);
    expect(inf.avisos.some((a) => a.includes('2026-11-15') && a.includes('previsión'))).toBe(true);
  });

  it('lo previsto del pasado, por grupo, sin repartir la diferencia', () => {
    const { entrada } = entorno();
    const inf = construirInforme(entrada('2026-09-01', '2026-12-31'));
    const g = (n: string) => inf.previstoPasado.find((f) => f.nombre === n)?.importe;
    expect(g('Ingresos netos')).toBe(4000);
    expect(g('Facturas')! + g('Otros gastos')!).toBe(-3600);
  });

  it('reserva para imprevistos: la del extracto, descontada del saldo final', () => {
    const { entrada } = entorno({}, [
      ['2026-12-01', 100],
      ['2027-01-01', 100],
      ['2027-02-01', 100],
    ]);
    const inf = construirInforme(entrada('2026-09-01', '2027-01-15'));
    expect(inf.reservaImprevistos).toBe(200);
    expect(inf.puente.find((p) => p.concepto === 'Reserva para imprevistos')?.importe).toBe(-200);
    // sueldo de noviembre; diciembre +800; enero −1200; y la reserva
    expect(inf.saldoFinal).toBe(3700 + 2000 + 800 - 1200 - 200);
    expect(inf.comprobaciones.every((c) => c.ok)).toBe(true);
    const dic = inf.meses.find((m) => m.mes === '2026-12')!;
    expect(dic).toMatchObject({ gastos: 1300, reserva: 100, otros: 0 });
  });

  it('solo pasado y solo futuro también cuadran', () => {
    const { entrada } = entorno({
      default: [
        ['2026-09-01', 3000],
        ['2026-10-01', 3800],
        ['2026-11-01', 4450],
        ['2026-11-15', 3200],
        ['2026-11-20', 3180],
      ],
    });
    const pasado = construirInforme(entrada('2026-09-01', '2026-10-31'));
    expect(pasado.tieneFuturo).toBe(false);
    expect(pasado.corte).toBe('2026-11-01');
    expect(pasado.saldoFinal).toBe(4950);
    expect(pasado.diferencia).toBe(-150);
    expect(pasado.comprobaciones.every((c) => c.ok)).toBe(true);

    const futuro = construirInforme(entrada('2026-12-01', '2027-03-31'));
    expect(futuro.tienePasado).toBe(false);
    expect(futuro.meses.every((m) => m.tipo === 'previsto')).toBe(true);
    expect(futuro.comprobaciones.every((c) => c.ok)).toBe(true);
  });

  it('compara con el saldo final del cuadro de mando', () => {
    const { entrada } = entorno();
    const igual = construirInforme(entrada('2026-09-01', '2026-12-31', { cuadroDeMando: { saldoFinal: 6500 } }));
    expect(igual.comprobaciones.find((x) => x.texto.includes('cuadro de mando'))?.ok).toBe(true);
    const distinto = construirInforme(entrada('2026-09-01', '2026-12-31', { cuadroDeMando: { saldoFinal: 6000 } }));
    const c = distinto.comprobaciones.find((x) => x.texto.includes('cuadro de mando'));
    expect(c?.ok).toBe(false);
  });

  it('el HTML es una página autónoma y escapa el texto del usuario', () => {
    const { entrada, cuentas } = entorno();
    cuentas[1].nombre = '<img src=x onerror=alert(1)>';
    const html = informeHtml(construirInforme(entrada('2026-09-01', '2026-12-31')));
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).not.toMatch(/<script[^>]*src=/);
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x');
    expect(html).toContain('saldo previsto frente a saldo real');
    expect(html).not.toContain('Gasto sin prever');
  });
});
