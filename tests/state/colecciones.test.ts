import { describe, expect, it } from 'vitest';
import { aplicarCopia, COLECCIONES, faltantesEnCopia, snapshotParaCopia } from '@/state/colecciones';
import { createMemoryAdapter, KEY_PREFIX } from '@/state/storage/local';

describe('COLECCIONES', () => {
  it('incluye lo que las cuatro listas escritas a mano se dejaban', () => {
    // El planificador entero, la contabilidad real y los puntos de control no
    // estaban en NINGUNA copia de seguridad. Este test es el que impide que
    // vuelva a pasar.
    for (const k of ['planes', 'transacciones', 'puntosControl']) {
      expect(COLECCIONES).toContain(k);
    }
  });

  it('cubre el esquema entero, sin sobras ni faltas', () => {
    expect([...COLECCIONES].sort()).toEqual(
      [
        'accounts',
        'config',
        'escenarios',
        'expenses',
        'goals',
        'inflacion',
        'loans',
        'nominas',
        'planes',
        'puntosControl',
        'tramosGananciasCapitalHistorico',
        'tramosIRPFHistorico',
        'transacciones',
      ].sort(),
    );
  });

  it('no arrastra `history`, que ya no existe', () => {
    expect(COLECCIONES).not.toContain('history');
  });
});

describe('snapshotParaCopia', () => {
  it('lee del almacenamiento, no de una copia en memoria', () => {
    const a = createMemoryAdapter();
    a.set(`${KEY_PREFIX}expenses`, [{ _id: 'e1' }]);
    a.set(`${KEY_PREFIX}transacciones`, [{ _id: 't1' }]);
    const s = snapshotParaCopia(a);
    expect(s.expenses).toEqual([{ _id: 'e1' }]);
    expect(s.transacciones).toEqual([{ _id: 't1' }]);
  });

  it('omite lo que no está en vez de escribir nulos', () => {
    const a = createMemoryAdapter();
    a.set(`${KEY_PREFIX}expenses`, []);
    const s = snapshotParaCopia(a) as Record<string, unknown>;
    expect('expenses' in s).toBe(true);
    expect('planes' in s).toBe(false);
  });

  it('con el almacén vacío devuelve un objeto vacío, no basura', () => {
    expect(snapshotParaCopia(createMemoryAdapter())).toEqual({});
  });
});

describe('aplicarCopia', () => {
  it('escribe cada colección con la clave lógica correcta', () => {
    const escrito: Record<string, unknown> = {};
    const escritas = aplicarCopia((k, v) => (escrito[k] = v), { expenses: [1], planes: [2] });
    expect(escrito[`${KEY_PREFIX}expenses`]).toEqual([1]);
    expect(escrito[`${KEY_PREFIX}planes`]).toEqual([2]);
    expect(escritas.sort()).toEqual(['expenses', 'planes']);
  });

  it('una copia ANTIGUA no borra lo que no trae', () => {
    // Restaurar un backup de antes de que existiera la contabilidad no puede
    // llevarse por delante los movimientos de este dispositivo.
    const escrito: Record<string, unknown> = {};
    const escritas = aplicarCopia((k, v) => (escrito[k] = v), { expenses: [1], history: ['viejo'] });
    expect(escritas).toEqual(['expenses']);
    expect(Object.keys(escrito)).toEqual([`${KEY_PREFIX}expenses`]);
  });

  it('ignora las claves que la copia trae a null', () => {
    const escrito: Record<string, unknown> = {};
    aplicarCopia((k, v) => (escrito[k] = v), { expenses: null, loans: [1] });
    expect(Object.keys(escrito)).toEqual([`${KEY_PREFIX}loans`]);
  });
});

describe('faltantesEnCopia', () => {
  it('dice qué se queda como estaba', () => {
    const f = faltantesEnCopia({ expenses: [], loans: [] });
    expect(f).toContain('transacciones');
    expect(f).not.toContain('expenses');
  });
});
