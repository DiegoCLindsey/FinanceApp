// Paridad legacy ↔ engine: provider de nóminas (Fase 1, tarea 1.4).
// El legacy sin State resuelve los tramos por defecto; el core recibe el
// resolver inyectado (default = mismos tramos), así que la comparación es justa.
import { describe, it, expect, beforeAll } from 'vitest';
import { proyectarNominas, type NominaItem } from '@/engine/providers/salaries';
import { TRAMOS_IRPF_DEFAULT } from '@/core/tax/irpf';
import type { DateRange } from '@/engine/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
let FM: any;
beforeAll(async () => {
  await import('../../finance-math/finance-math.js');
  FM = (globalThis as any).FinanceMath;
});

const range: DateRange = { start: '2026-01-01', end: '2027-12-31' };
const config = { tramos_irpf: TRAMOS_IRPF_DEFAULT };
const periodos = [{ year: 2026, tasa: 2.5 }, { year: 2027, tasa: 3.1 }];

const nominas: NominaItem[] = [
  // Grupo con dos nóminas (apilamiento marginal), una con flex y detallado
  { _id: 'n1', nombre: 'Titular', activo: true, bruto: 42000, nPagas: 12, irpfModo: 'auto', representacion: 'detallado', fechaInicio: '2025-01-05', cuenta: 'default', tags: ['nomina'], grupoNomina: 'casa', retribucionFlexible: [{ _id: 'fx1', tipo: 'restaurante', importe: 180, cuenta: 'benef1' }] },
  { _id: 'n2', nombre: 'Pareja', activo: true, bruto: 28000, nPagas: 14, irpfModo: 'auto', representacion: 'simplificado', fechaInicio: '2025-03-10', cuenta: 'acc2', tags: [], grupoNomina: 'casa' },
  // Standalone con IRPF manual e IPC
  { _id: 'n3', nombre: 'Freelance', activo: true, bruto: 18000, nPagas: 12, irpfModo: 'manual', irpfPct: 12, representacion: 'simplificado', fechaInicio: '2026-02-01', fechaFin: '2027-06-30', cuenta: 'default', tags: [], grupoNomina: '', mesActualizacionIPC: 1 },
  // Inactiva
  { _id: 'n4', nombre: 'Off', activo: false, bruto: 50000, nPagas: 12, irpfModo: 'auto', representacion: 'simplificado', fechaInicio: '2026-01-01', cuenta: 'default', tags: [], grupoNomina: 'casa' },
];

describe('paridad provider de nóminas', () => {
  it('proyectarNominas idéntico sin IPC', () => {
    expect(proyectarNominas(nominas, range)).toEqual(
      FM.proyectarNominas(nominas, config, range.start, range.end, null, []),
    );
  });
  it('proyectarNominas idéntico con IPC activo', () => {
    expect(proyectarNominas(nominas, range, null, periodos)).toEqual(
      FM.proyectarNominas(nominas, config, range.start, range.end, null, periodos),
    );
  });
  it('proyectarNominas idéntico con filtro de cuentas (incluida la cuenta beneficio)', () => {
    for (const filtro of [['default'], ['acc2'], ['benef1'], ['default', 'benef1']]) {
      expect(proyectarNominas(nominas, range, filtro, periodos)).toEqual(
        FM.proyectarNominas(nominas, config, range.start, range.end, filtro, periodos),
      );
    }
  });
});
