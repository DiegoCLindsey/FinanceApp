import { describe, expect, it } from 'vitest';
import { crearHistorialBorrados, describirItem } from '@/state/deshacer';

const item = (id: string, extra: Record<string, unknown> = {}) => ({ _id: id, ...extra });

describe('crearHistorialBorrados', () => {
  it('sin borrados no hay nada que deshacer', () => {
    const h = crearHistorialBorrados();
    expect(h.pendiente()).toBeNull();
    expect(h.tomar()).toBeNull();
  });

  it('guarda lo borrado con su posición', () => {
    const h = crearHistorialBorrados();
    h.registrar({ col: 'expenses', item: item('e1'), indice: 3 });
    expect(h.pendiente()).toMatchObject({ col: 'expenses', indice: 3 });
    expect(h.pendiente()?.item._id).toBe('e1');
  });

  it('una sola posición: el segundo borrado tapa al primero', () => {
    const h = crearHistorialBorrados();
    h.registrar({ col: 'expenses', item: item('e1'), indice: 0 });
    h.registrar({ col: 'accounts', item: item('a1'), indice: 1 });
    expect(h.pendiente()?.item._id).toBe('a1');
  });

  it('tomar consume: deshacer dos veces no restaura dos veces', () => {
    const h = crearHistorialBorrados();
    h.registrar({ col: 'expenses', item: item('e1'), indice: 0 });
    expect(h.tomar()?.item._id).toBe('e1');
    expect(h.tomar()).toBeNull();
    expect(h.pendiente()).toBeNull();
  });

  it('caduca pasada la ventana', () => {
    let t = 1000;
    const h = crearHistorialBorrados({ ventanaMs: 5000, ahora: () => t });
    h.registrar({ col: 'expenses', item: item('e1'), indice: 0 });
    t = 5999;
    expect(h.pendiente()).not.toBeNull();
    t = 6001;
    expect(h.pendiente()).toBeNull();
    expect(h.tomar()).toBeNull();
  });

  it('limpiar olvida el borrado', () => {
    const h = crearHistorialBorrados();
    h.registrar({ col: 'expenses', item: item('e1'), indice: 0 });
    h.limpiar();
    expect(h.pendiente()).toBeNull();
  });
});

describe('describirItem', () => {
  it('usa el campo de nombre de cada colección', () => {
    expect(describirItem('expenses', { concepto: 'Alquiler' })).toBe('El gasto «Alquiler»');
    expect(describirItem('accounts', { nombre: 'Ahorro' })).toBe('La cuenta «Ahorro»');
    expect(describirItem('loans', { nombre: 'Hipoteca' })).toBe('El préstamo «Hipoteca»');
    expect(describirItem('nominas', { nombre: 'Nómina nueva' })).toBe('La nómina «Nómina nueva»');
  });

  it('la inflación no tiene nombre: se identifica por el año', () => {
    expect(describirItem('inflacion', { year: 2025, tasa: 3.1 })).toBe('El periodo de inflación «2025»');
  });

  it('sin nada que mostrar, no inventa un nombre', () => {
    expect(describirItem('transacciones', {})).toBe('El movimiento');
  });

  it('una colección desconocida no rompe la frase', () => {
    expect(describirItem('loQueSea', { nombre: 'X' })).toBe('El elemento «X»');
  });
});
