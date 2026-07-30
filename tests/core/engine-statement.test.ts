// Paridad legacy ↔ engine: transferencias y extracto completo (Fase 1, 1.4).
// El legacy lee State global en transferencias y tramos: aquí se monta un mock
// de State equivalente a las dependencias que el engine recibe inyectadas.
import { describe, it, expect, beforeAll } from 'vitest';
import { proyectarTransferencias, type TransferDeps } from '@/engine/providers/transfers';
import { generarExtracto, saldoHoy, sumarPorTags, type StatementAccount } from '@/engine/statement';
import { TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';
import { TRAMOS_AHORRO_DEFAULT } from '@/core/tax/ahorro';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;

const accounts: StatementAccount[] = [
  { _id: 'default', nombre: 'Principal', activo: true, esCuentaPrincipal: true, saldoInicial: 8000, fechaInicialSaldo: '2026-01-01', historicoSaldos: [], interes: 0 },
  { _id: 'remu', nombre: 'Remunerada', activo: true, saldoInicial: 12000, fechaInicialSaldo: '2026-01-01', historicoSaldos: [], interes: 2.5, periodoCobro: 'mensual' },
  { _id: 'fondo1', nombre: 'Indexado', activo: true, modeloFondo: 'inversion', saldoInicial: 10000, historicoSaldos: [{ fecha: '2026-01-15', saldo: 14000 }], aportaciones: [{ fecha: '2024-06-01', cantidad: 9000 }], planAportaciones: [{ _id: 'pa1', importe: 200, periodicidad: 'mensual', fechaInicio: '2026-02-10', cuentaOrigen: 'default' }] },
  { _id: 'fondo2', nombre: 'Indexado B', activo: true, modeloFondo: 'inversion', saldoInicial: 5000, historicoSaldos: [], aportaciones: [] },
  { _id: 'plan1', nombre: 'Plan pensiones', activo: true, modeloFondo: 'pension', impuestoRetirada: 30, grupoNomina: 'casa', saldoInicial: 0, historicoSaldos: [{ fecha: '2026-01-01', saldo: 20000 }], aportaciones: [{ fecha: '2015-01-01', cantidad: 12000 }] },
];

const nominas = [
  { _id: 'n1', nombre: 'Sueldo', activo: true, bruto: 36000, nPagas: 12, irpfModo: 'auto', representacion: 'simplificado', fechaInicio: '2025-01-05', cuenta: 'default', tags: [], grupoNomina: 'casa' },
];

const expenses: any[] = [
  { _id: 'e1', activo: true, concepto: 'Alquiler', cuantia: 900, tipo: 'gasto', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2025-01-01', tags: ['vivienda'], cuenta: 'default' },
  { _id: 'e2', activo: true, concepto: 'Freelance', cuantia: 1000, tipo: 'ingreso', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2026-01-10', tags: [], cuenta: 'remu', sujetoIRPF: true },
  // Transferencia normal, reembolso de fondo, rescate de plan y traspaso fondo↔fondo
  { _id: 't1', activo: true, concepto: 'Ahorro mensual', cuantia: 500, tipo: 'transferencia', tipoFrecuencia: 'mensual', frecuencia: 1, fechaInicio: '2026-01-20', tags: [], cuenta: 'default', cuentaDestino: 'remu' },
  { _id: 't2', activo: true, concepto: 'Reembolso parcial', cuantia: 3000, tipo: 'transferencia', tipoFrecuencia: 'extraordinario', fechaInicio: '2026-03-15', tags: [], cuenta: 'fondo1', cuentaDestino: 'default' },
  { _id: 't3', activo: true, concepto: 'Rescate plan', cuantia: 2000, tipo: 'transferencia', tipoFrecuencia: 'extraordinario', fechaInicio: '2026-05-02', tags: [], cuenta: 'plan1', cuentaDestino: 'default' },
  { _id: 't4', activo: true, concepto: 'Traspaso fondos', cuantia: 1500, tipo: 'transferencia', tipoFrecuencia: 'extraordinario', fechaInicio: '2026-06-01', tags: [], cuenta: 'fondo1', cuentaDestino: 'fondo2' },
];

const loans = [
  { _id: 'l1', nombre: 'Coche', activo: true, capital: 12000, tin: 5, meses: 48, fechaInicio: '2025-06-01', comisionApertura: 0, comisionAmort: 0, amortizaciones: [], cuenta: 'default', tags: [] },
];

const inflacionPeriodos = [{ year: 2026, tasa: 2.4 }];
const config = {
  dashboardStart: '2026-01-01',
  dashboardEnd: '2026-12-31',
  fechaReferencia: '2026-02-01',
  usarInflacion: true,
  tramos_irpf: TRAMOS_IRPF_DEFAULT,
  tramosGananciasCapital: TRAMOS_AHORRO_DEFAULT,
};

beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
  // Mock de State equivalente a las dependencias inyectadas del engine
  const stateData: Record<string, unknown> = {
    accounts,
    nominas,
    tramosIRPFHistorico: [],
    tramosGananciasCapitalHistorico: [],
    config,
    inflacion: inflacionPeriodos,
  };
  (globalThis as any).State = {
    get: (k: string) => stateData[k],
    accountName: (id: string) => accounts.find((a) => a._id === id)?.nombre ?? id,
  };
});

const deps: TransferDeps = { accounts, nominas };
const range = { start: config.dashboardStart, end: config.dashboardEnd };

describe('paridad provider de transferencias', () => {
  const transfers = expenses.filter((e) => e.tipo === 'transferencia');
  it('proyectarTransferencias idéntico (normal, reembolso, rescate, traspaso)', () => {
    expect(proyectarTransferencias(transfers, range, null, deps)).toEqual(
      FM.proyectarTransferencias(transfers, range.start, range.end, null),
    );
  });
  it('proyectarTransferencias idéntico con filtro de cuentas', () => {
    for (const filtro of [['default'], ['fondo1'], ['remu', 'fondo2']]) {
      expect(proyectarTransferencias(transfers, range, filtro, deps)).toEqual(
        FM.proyectarTransferencias(transfers, range.start, range.end, filtro),
      );
    }
  });
});

describe('paridad extracto completo', () => {
  it('generarExtracto idéntico (todos los providers + inflación + ancla)', () => {
    const nuestro = generarExtracto({ loans, expenses, accounts, config, nominas, inflacionPeriodos });
    const legacy = FM.generarExtracto(loans, expenses, accounts, config, null, nominas, inflacionPeriodos);
    expect(nuestro).toEqual(legacy);
    expect(nuestro.length).toBeGreaterThan(30);
  });
  it('generarExtracto idéntico con filtro de cuentas', () => {
    for (const filtro of [['default'], ['default', 'remu'], ['fondo1']]) {
      expect(generarExtracto({ loans, expenses, accounts, config, filtroAccounts: filtro, nominas, inflacionPeriodos })).toEqual(
        FM.generarExtracto(loans, expenses, accounts, config, filtro, nominas, inflacionPeriodos),
      );
    }
  });
  it('saldoHoy y sumarPorTags idénticos', () => {
    const nuestro = generarExtracto({ loans, expenses, accounts, config, nominas, inflacionPeriodos });
    expect(saldoHoy(nuestro, accounts)).toBe(FM.saldoHoy(nuestro, accounts, null));
    expect(sumarPorTags(nuestro, 'gasto')).toEqual(FM.sumarPorTags(nuestro, 'gasto'));
    expect(sumarPorTags(nuestro, 'ingreso')).toEqual(FM.sumarPorTags(nuestro, 'ingreso'));
  });
});
