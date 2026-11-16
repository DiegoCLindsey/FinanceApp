// BUG-27: una copia antigua importada o restaurada no pasaba por las migraciones.
import { describe, expect, it } from 'vitest';
import { inferirVersionDeCopia } from '@/state/colecciones';

const ACTUAL = 11;
const base = { expenses: [], loans: [], nominas: [], accounts: [], transacciones: [], personas: [], config: { features: {} } };

describe('inferirVersionDeCopia', () => {
  it('respeta la versión declarada, sin pasarse de la actual', () => {
    expect(inferirVersionDeCopia({ ...base, _schemaVersion: 9 }, ACTUAL)).toBe(9);
    expect(inferirVersionDeCopia({ ...base, _schemaVersion: 99 }, ACTUAL)).toBe(ACTUAL);
  });
  it('una copia actual sin versión declarada no se remigra', () => {
    expect(inferirVersionDeCopia(base, ACTUAL)).toBe(ACTUAL);
  });
  it('sin config.features es anterior al esquema formal', () => {
    expect(inferirVersionDeCopia({ expenses: [], config: { colchonMeses: 6 } }, ACTUAL)).toBe(4);
  });
  it('sin transacciones es anterior a la contabilidad', () => {
    const { transacciones: _t, ...sin } = base;
    expect(inferirVersionDeCopia(sin, ACTUAL)).toBe(5);
  });
  it('con historialPrecios es anterior a la 007', () => {
    expect(inferirVersionDeCopia({ ...base, expenses: [{ historialPrecios: [{ fecha: '2026-01-01', cuantia: 1 }] }] }, ACTUAL)).toBe(6);
  });
  it('sin personas es anterior a la 009', () => {
    const { personas: _p, ...sin } = base;
    expect(inferirVersionDeCopia(sin, ACTUAL)).toBe(8);
  });
  it('con restos de supuestos le falta la limpieza de la 011', () => {
    expect(inferirVersionDeCopia({ ...base, expenses: [{ escenarioIds: ['e1'] }] }, ACTUAL)).toBe(10);
    expect(inferirVersionDeCopia({ ...base, planes: [] }, ACTUAL)).toBe(10);
    expect(inferirVersionDeCopia({ ...base, loans: [{ amortizaciones: [{ escenarioIds: ['e'] }] }] }, ACTUAL)).toBe(10);
  });
  it('una copia parcial (solo algunas colecciones) no dispara migraciones', () => {
    expect(inferirVersionDeCopia({ transacciones: [] }, ACTUAL)).toBe(ACTUAL);
  });
});
