// «Crear informe»: lo que se comprueba aquí es que TODO CUADRA. El pasado sale
// del libro de movimientos, el futuro del extracto, y las dos mitades tienen que
// encajar en el saldo real de hoy, en el puente, en la tabla mes a mes y en las
// cuentas.
import { describe, expect, it } from 'vitest';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createLedger } from '@/accounting/ledger';
import { construirInforme, type EntradaInforme } from '@/informe/modelo';
import { informeHtml } from '@/informe/html';
import type { CashEvent } from '@/engine/types';
import type { Expense } from '@/state/schema';

const HOY = '2026-11-20';

function entorno() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: new Date(2026, 10, 20) });
  store.load();
  store.set('accounts', [
    { ...store.get('accounts')[0], nombre: 'Nómina', saldoInicial: 3000, fechaInicialSaldo: '2026-08-31' },
    {
      ...store.get('accounts')[0],
      _id: 'aho',
      nombre: 'Ahorro',
      esCuentaPrincipal: false,
      saldoInicial: 500,
      fechaInicialSaldo: '2026-08-31',
    },
  ]);
  const ledger = createLedger(store);
  const g = (concepto: string, cuantia: number, extra: Partial<Expense> = {}) =>
    store.addItem('expenses', {
      concepto,
      cuantia,
      tipo: 'gasto',
      tipoFrecuencia: 'mensual',
      frecuencia: 1,
      fechaInicio: '2026-01-01',
      fechaFin: null,
      cuenta: 'default',
      activo: true,
      tags: [],
      ...extra,
    } as Omit<Expense, '_id'>);
  const alquiler = g('Alquiler', 900, { diaPago: 'dia:1' });
  const superm = g('Supermercado', 300);
  const sueldo = g('Sueldo', 2000, { tipo: 'ingreso', diaPago: 'dia:28' });

  ledger.registrarPuntoControl('default', '2026-08-31', 3000);
  ledger.registrarPuntoControl('aho', '2026-08-31', 500);
  for (const m of ['09', '10']) {
    ledger.registrar({
      fecha: `2026-${m}-01`,
      cuentaId: 'default',
      importe: 900,
      concepto: 'ALQUILER',
      tipo: 'gasto',
      estimacionId: alquiler._id,
    });
    ledger.registrar({
      fecha: `2026-${m}-12`,
      cuentaId: 'default',
      importe: m === '10' ? 450 : 300,
      concepto: 'SUPER',
      tipo: 'gasto',
      estimacionId: superm._id,
    });
    ledger.registrar({
      fecha: `2026-${m}-28`,
      cuentaId: 'default',
      importe: 2000,
      concepto: 'NOMINA',
      tipo: 'ingreso',
      estimacionId: sueldo._id,
    });
    ledger.registrar({
      fecha: `2026-${m}-29`,
      cuentaId: 'default',
      importe: 200,
      concepto: 'A AHORRO',
      tipo: 'transferencia',
      negativo: true,
    });
    ledger.registrar({ fecha: `2026-${m}-29`, cuentaId: 'aho', importe: 200, concepto: 'DESDE NOMINA', tipo: 'transferencia' });
  }
  ledger.registrar({
    fecha: '2026-11-01',
    cuentaId: 'default',
    importe: 900,
    concepto: 'ALQUILER',
    tipo: 'gasto',
    estimacionId: alquiler._id,
  });
  ledger.registrar({ fecha: '2026-11-04', cuentaId: 'default', importe: 120, concepto: 'TALLER', tipo: 'gasto', imprevisto: true });
  // Un saldo anotado a mano que no explican los movimientos: faltan 25 €.
  ledger.registrarPuntoControl('default', '2026-10-31', ledger.saldoCuenta('default', '2026-10-31') - 25);

  /** Extracto «del motor»: las tres estimaciones, en las fechas de cada mes. */
  const generarExtracto = (desde: string, hasta: string): CashEvent[] => {
    const out: CashEvent[] = [];
    for (let y = 2026, m = 1; y < 2028; m === 12 ? ((m = 1), y++) : m++) {
      const mm = `${y}-${String(m).padStart(2, '0')}`;
      const ev = (dia: string, concepto: string, cuantia: number, tipo: 'gasto' | 'ingreso', sourceId: string) =>
        out.push({ fecha: `${mm}-${dia}`, concepto, cuantia, tipo, tags: [], cuenta: 'default', sourceId, sourceType: 'expense' });
      ev('01', 'Alquiler', 900, 'gasto', alquiler._id);
      ev('01', 'Supermercado', 300, 'gasto', superm._id);
      ev('28', 'Sueldo', 2000, 'ingreso', sueldo._id);
    }
    return out.filter((e) => e.fecha >= desde && e.fecha <= hasta);
  };

  const entrada = (desde: string, hasta: string, extra: Partial<EntradaInforme> = {}): EntradaInforme => ({
    desde,
    hasta,
    hoy: HOY,
    proyecto: 'Mis finanzas',
    cuentas: store.get('accounts'),
    gastos: store.get('expenses'),
    ledger,
    generarExtracto,
    saldoSinLibro: (c) => c.saldoInicial,
    opcionesCierre: { hoy: HOY, nominas: [], loans: [] },
    ...extra,
  });
  return { store, ledger, entrada };
}

describe('construirInforme', () => {
  it('pasado y futuro: el puente, la tabla mes a mes y las cuentas cuadran', () => {
    const { entrada } = entorno();
    const inf = construirInforme(entrada('2026-09-01', '2027-02-28'));

    expect(inf.comprobaciones.every((c) => c.ok)).toBe(true);
    expect(inf.saldoInicio).toBe(3500);
    // Pasado: +4000 − (900+300+900+450+900+120) − 25 (saldo anotado)
    expect(inf.saldoHoy).toBe(3500 + 4000 - 3570 - 25);
    const ajuste = inf.puente.find((p) => p.concepto === 'Ajuste por saldos anotados');
    expect(ajuste?.importe).toBe(-25);
    // Los traspasos se compensan: no aparecen
    expect(inf.puente.some((p) => p.concepto.startsWith('Traspasos'))).toBe(false);

    // Futuro desde mañana: la nómina de noviembre y tres meses enteros
    expect(inf.puente.find((p) => p.concepto === 'Ingresos previstos')?.importe).toBe(2000 * 4);
    expect(inf.puente.find((p) => p.concepto === 'Gastos previstos')?.importe).toBe(-1200 * 3);
    expect(inf.saldoFinal).toBe(inf.saldoHoy + 8000 - 3600);

    // Tabla mes a mes: cada fila encadena con la siguiente y la última es el final
    for (let i = 0; i < inf.meses.length; i++) {
      const m = inf.meses[i];
      expect(m.saldoInicial + m.neto + m.otros).toBeCloseTo(m.saldoFinal, 2);
      if (i > 0) expect(m.saldoInicial).toBeCloseTo(inf.meses[i - 1].saldoFinal, 2);
    }
    expect(inf.meses.map((m) => m.tipo)).toEqual(['real', 'real', 'en-curso', 'previsto', 'previsto', 'previsto']);
    expect(inf.meses[inf.meses.length - 1].saldoFinal).toBeCloseTo(inf.saldoFinal, 2);
    // El saldo anotado aparece como «otros» en octubre
    expect(inf.meses[1].otros).toBeCloseTo(-25, 2);

    // Cuentas: el ahorro recibe 400 por traspasos
    const aho = inf.cuentas.find((c) => c._id === 'aho');
    expect(aho).toMatchObject({ saldoInicio: 500, saldoHoy: 900, fuente: 'movimientos' });
  });

  it('el pasado: lo previsto frente a lo real, por grupo y por estimación', () => {
    const { entrada } = entorno();
    const inf = construirInforme(entrada('2026-09-01', '2027-02-28'));
    const grupo = (g: string) => inf.grupos.find((x) => x.grupo === g);
    expect(grupo('ingresos')).toMatchObject({ previsto: 4000, real: 4000 });
    expect(grupo('sinPrever')).toMatchObject({ previsto: 0, real: 120 });
    // súper: previstos 3 × 300 (también el del 1 de noviembre); reales 300 + 450 y
    // ninguno en noviembre → 150 por debajo
    expect(inf.desviaciones[0]).toMatchObject({ concepto: 'Supermercado', estimado: 900, real: 750, desviacion: -150 });
    // Debías tener hoy = inicio + neto previsto; la diferencia con lo real se explica entera
    const neto = inf.cierre!;
    expect(inf.saldoHoyPrevisto).toBeCloseTo(3500 + neto.netoEstimado, 2);
    expect(inf.saldoHoy - inf.saldoHoyPrevisto).toBeCloseTo(neto.desviacionNeta - 25, 2);
  });

  it('reserva para imprevistos: lo que falta este mes y la media en los siguientes', () => {
    const { entrada } = entorno();
    const inf = construirInforme(
      entrada('2026-09-01', '2027-01-15', {
        imprevistos: { mediaMensual: 100, total: 600, meses: 6, desde: '2026-05', hasta: '2026-10' },
        imprevistosMesEnCurso: 120,
      }),
    );
    // noviembre: ya se han ido 120 > 100, no reserva; diciembre 100; enero 15/31 de 100
    expect(inf.reservaImprevistos).toBeCloseTo(100 + 48.39, 2);
    expect(inf.saldoFinalConReserva).toBeCloseTo(inf.saldoFinal - inf.reservaImprevistos, 2);
  });

  it('solo pasado y solo futuro también cuadran', () => {
    const { entrada } = entorno();
    const pasado = construirInforme(entrada('2026-09-01', '2026-10-31'));
    expect(pasado.tieneFuturo).toBe(false);
    expect(pasado.saldoFinal).toBe(pasado.saldoHoy);
    expect(pasado.comprobaciones.every((c) => c.ok)).toBe(true);

    const futuro = construirInforme(entrada('2026-12-01', '2027-03-31'));
    expect(futuro.tienePasado).toBe(false);
    expect(futuro.meses.every((m) => m.tipo === 'previsto')).toBe(true);
    expect(futuro.comprobaciones.every((c) => c.ok)).toBe(true);
  });

  it('avisa si el cuadro de mando parte de otro saldo', () => {
    const { entrada } = entorno();
    const inf = construirInforme(entrada('2026-09-01', '2027-02-28', { cuadroDeMando: { saldoHoy: 1000, saldoFinal: 5400 } }));
    const c = inf.comprobaciones.find((x) => x.texto.includes('cuadro de mando'));
    expect(c?.ok).toBe(false);
    expect(c?.texto).toContain('Parte de');
  });

  it('el HTML es una página autónoma y escapa el texto del usuario', () => {
    const { entrada, store } = entorno();
    store.updateItem('accounts', 'aho', { nombre: '<img src=x onerror=alert(1)>' });
    const html = informeHtml(construirInforme(entrada('2026-09-01', '2027-02-28')));
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).not.toMatch(/<script[^>]*src=/);
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x');
  });
});
