import { describe, expect, it } from 'vitest';
import { buscar, calidadCoincidencia, catalogar, normalizar } from '@/app/buscar';

/* eslint-disable @typescript-eslint/no-explicit-any */

const estado = {
  accounts: [
    { _id: 'cc', nombre: 'Cuenta corriente', saldoInicial: 8400 },
    { _id: 'aho', nombre: 'Ahorro remunerado', saldoInicial: 15200 },
  ],
  expenses: [
    { _id: 'e1', concepto: 'Seguro coche', cuantia: 480, tipo: 'gasto', cuenta: 'cc', tags: ['coche'] },
    { _id: 'e2', concepto: 'Seguro de hogar ampliado', cuantia: 210, tipo: 'gasto', cuenta: 'cc', tags: ['vivienda'] },
    { _id: 'e3', concepto: 'Revisión del seguro', cuantia: 30, tipo: 'gasto', cuenta: 'cc', tags: [] },
    { _id: 'e4', concepto: 'Alquiler trastero', cuantia: 60, tipo: 'ingreso', cuenta: 'cc', tags: ['extra'] },
    { _id: 'e5', concepto: 'Nómina antigua', cuantia: 10, tipo: 'gasto', cuenta: 'cc', tags: [] },
  ],
  loans: [{ _id: 'l1', nombre: 'Hipoteca', capital: 120000, cuenta: 'cc', tags: ['vivienda'] }],
  nominas: [{ _id: 'n1', nombre: 'Nómina actual', bruto: 42000 }],
  transacciones: [{ _id: 't1', fecha: '2026-07-05', cuentaId: 'cc', importeCts: -51100, concepto: 'SUPERMERCADO', tags: ['comida'] }],
} as any;

describe('normalizar', () => {
  it('quita tildes y mayúsculas, que es como se teclea con prisa', () => {
    expect(normalizar('Nómina')).toBe('nomina');
    expect(normalizar('  ÁÉÍÓÚ Ñ ')).toBe('aeiou n');
  });

  it('con null o undefined devuelve cadena vacía', () => {
    expect(normalizar(null)).toBe('');
    expect(normalizar(undefined)).toBe('');
  });
});

describe('calidadCoincidencia', () => {
  it('0 al principio, 1 empezando palabra, 2 dentro de una', () => {
    expect(calidadCoincidencia('Seguro coche', 'seg')).toBe(0);
    expect(calidadCoincidencia('Revisión del seguro', 'seg')).toBe(1);
    expect(calidadCoincidencia('Riesgo segmentado', 'seg')).toBe(1);
    expect(calidadCoincidencia('Presegmentado', 'seg')).toBe(2);
  });

  it('el guion y la barra cuentan como principio de palabra', () => {
    expect(calidadCoincidencia('Auto-seguro', 'seg')).toBe(1);
    expect(calidadCoincidencia('Luz/gas', 'gas')).toBe(1);
  });

  it('−1 cuando no aparece o la aguja está vacía', () => {
    expect(calidadCoincidencia('Seguro', 'zzz')).toBe(-1);
    expect(calidadCoincidencia('Seguro', '')).toBe(-1);
  });
});

describe('catalogar', () => {
  it('recoge todas las colecciones buscables', () => {
    const tipos = new Set(catalogar(estado).map((c) => c.tipo));
    expect(tipos).toEqual(new Set(['gasto', 'ingreso', 'cuenta', 'prestamo', 'nomina', 'movimiento']));
  });

  it('un estado vacío no revienta', () => {
    expect(catalogar({})).toEqual([]);
  });

  it('resuelve el nombre de la cuenta en el detalle', () => {
    const gasto = catalogar(estado).find((c) => c.id === 'e1');
    expect(gasto?.detalle).toContain('Cuenta corriente');
  });
});

describe('buscar', () => {
  it('con menos de dos letras no devuelve nada', () => {
    expect(buscar(estado, 's')).toEqual([]);
    expect(buscar(estado, '')).toEqual([]);
  });

  it('ordena por DÓNDE empieza la coincidencia, no por cuánto coincide', () => {
    const r = buscar(estado, 'seguro');
    expect(r.map((x) => x.titulo)).toEqual(['Seguro coche', 'Seguro de hogar ampliado', 'Revisión del seguro']);
  });

  it('a igual posición gana el más corto, que es el más específico', () => {
    const r = buscar(estado, 'seguro');
    expect(r[0].titulo).toBe('Seguro coche'); // más corto que «Seguro de hogar ampliado»
  });

  it('encuentra sin tildes', () => {
    expect(buscar(estado, 'nomina').map((x) => x.titulo)).toContain('Nómina actual');
  });

  it('busca en todas las vistas a la vez, que es el motivo de existir', () => {
    expect(buscar(estado, 'hipoteca')[0]).toMatchObject({ etiqueta: 'Préstamo', ruta: 'loans' });
    expect(buscar(estado, 'supermercado')[0]).toMatchObject({ etiqueta: 'Movimiento', ruta: 'contabilidad' });
  });

  it('distingue gasto de ingreso en la etiqueta', () => {
    expect(buscar(estado, 'alquiler trastero')[0].etiqueta).toBe('Ingreso');
    expect(buscar(estado, 'seguro coche')[0].etiqueta).toBe('Gasto');
  });

  it('encuentra por etiqueta, pero siempre por detrás del nombre', () => {
    const r = buscar(estado, 'vivienda');
    // «Seguro de hogar ampliado» e «Hipoteca» llevan la etiqueta `vivienda`;
    // ninguno la lleva en el nombre.
    expect(r.map((x) => x.titulo).sort()).toEqual(['Hipoteca', 'Seguro de hogar ampliado']);
    // Y si algo coincidiera por nombre, iría antes.
    const conNombre = buscar(
      { ...estado, expenses: [...estado.expenses, { _id: 'x', concepto: 'Vivienda', tipo: 'gasto', tags: [] }] },
      'vivienda',
    );
    expect(conNombre[0].titulo).toBe('Vivienda');
  });

  it('respeta el máximo', () => {
    expect(buscar(estado, 'a', { maximo: 2 })).toHaveLength(0); // una letra, nada
    expect(buscar(estado, 'se', { maximo: 2 })).toHaveLength(2);
  });

  it('no ofrece lo que vive en una vista apagada', () => {
    const r = buscar(estado, 'hipoteca', { rutasDisponibles: ['expenses', 'accounts'] });
    expect(r).toEqual([]);
    // Y con la vista disponible sí aparece.
    expect(buscar(estado, 'hipoteca', { rutasDisponibles: ['loans'] })).toHaveLength(1);
  });

  it('sin datos no encuentra nada, pero tampoco falla', () => {
    expect(buscar({}, 'seguro')).toEqual([]);
  });
});
