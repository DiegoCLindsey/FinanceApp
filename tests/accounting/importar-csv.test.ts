import { describe, expect, it } from 'vitest';
import {
  analizarCsv,
  detectarMapeo,
  detectarSeparador,
  parsearFecha,
  parsearImporte,
  prepararFilas,
  resumir,
  trocearLinea,
} from '@/accounting/importar-csv';

describe('trocearLinea', () => {
  it('trocea por el separador', () => {
    expect(trocearLinea('a;b;c', ';')).toEqual(['a', 'b', 'c']);
  });

  it('respeta las comillas y el separador que va dentro', () => {
    expect(trocearLinea('01/02/2026;"PAGO EN TIENDA, S.L.";-45,20', ';')).toEqual(['01/02/2026', 'PAGO EN TIENDA, S.L.', '-45,20']);
  });

  it('entiende las comillas escapadas duplicándolas', () => {
    expect(trocearLinea('a;"dijo ""hola""";b', ';')).toEqual(['a', 'dijo "hola"', 'b']);
  });

  it('conserva las celdas vacías', () => {
    expect(trocearLinea('a;;c', ';')).toEqual(['a', '', 'c']);
  });
});

describe('parsearImporte', () => {
  it('formato español: punto de millar, coma decimal', () => {
    expect(parsearImporte('1.234,56')).toBe(123456);
    expect(parsearImporte('-45,20')).toBe(-4520);
    expect(parsearImporte('0,01')).toBe(1);
  });

  it('formato inglés: coma de millar, punto decimal', () => {
    expect(parsearImporte('1,234.56')).toBe(123456);
    expect(parsearImporte('-1234.56')).toBe(-123456);
  });

  it('un solo separador que agrupa de tres en tres es de millar, no decimal', () => {
    expect(parsearImporte('1,234')).toBe(123400);
    expect(parsearImporte('1.234')).toBe(123400);
  });

  it('un solo separador que NO agrupa de tres es decimal', () => {
    expect(parsearImporte('12,5')).toBe(1250);
    expect(parsearImporte('12.5')).toBe(1250);
    expect(parsearImporte('0,5')).toBe(50);
  });

  it('entero sin decimales', () => {
    expect(parsearImporte('250')).toBe(25000);
  });

  it('signo detrás, como hacen algunos bancos', () => {
    expect(parsearImporte('45,20-')).toBe(-4520);
  });

  it('paréntesis significan negativo', () => {
    expect(parsearImporte('(45,20)')).toBe(-4520);
  });

  it('quita el símbolo de moneda y los espacios, incluido el duro', () => {
    expect(parsearImporte('1.234,56 €')).toBe(123456);
    expect(parsearImporte('1 234,56')).toBe(123456);
    expect(parsearImporte('1 234,56')).toBe(123456);
  });

  it('trunca más de dos decimales en vez de redondear', () => {
    // Un extracto no debería traerlos; si los trae, no inventamos un céntimo.
    expect(parsearImporte('10,9999')).toBe(1099);
  });

  it('«10,999» se lee como millar, no como tres decimales', () => {
    // Es ambiguo de verdad: un separador seguido de EXACTAMENTE tres dígitos es
    // un grupo de millar en las dos convenciones, y ningún banco da tres
    // decimales. Queda fijado aquí para que el criterio no cambie sin querer.
    expect(parsearImporte('10,999')).toBe(1099900);
    expect(parsearImporte('10.999')).toBe(1099900);
  });

  it('completa un solo decimal', () => {
    expect(parsearImporte('10,5')).toBe(1050);
  });

  it('devuelve null con lo que no es un número', () => {
    expect(parsearImporte('')).toBeNull();
    expect(parsearImporte('   ')).toBeNull();
    expect(parsearImporte('N/A')).toBeNull();
    expect(parsearImporte('—')).toBeNull();
  });

  it('millones con dos separadores de millar', () => {
    expect(parsearImporte('1.234.567,89')).toBe(123456789);
  });
});

describe('parsearFecha', () => {
  it('ISO', () => {
    expect(parsearFecha('2026-02-01')).toBe('2026-02-01');
  });

  it('dd/mm/aaaa, que es lo que exportan los bancos españoles', () => {
    expect(parsearFecha('01/02/2026')).toBe('2026-02-01');
    expect(parsearFecha('1/2/2026')).toBe('2026-02-01');
  });

  it('acepta guiones y puntos', () => {
    expect(parsearFecha('01-02-2026')).toBe('2026-02-01');
    expect(parsearFecha('01.02.2026')).toBe('2026-02-01');
  });

  it('año de dos cifras', () => {
    expect(parsearFecha('01/02/26')).toBe('2026-02-01');
    expect(parsearFecha('01/02/99')).toBe('1999-02-01');
  });

  it('rechaza fechas que no existen', () => {
    expect(parsearFecha('31/02/2026')).toBeNull();
    expect(parsearFecha('32/01/2026')).toBeNull();
    expect(parsearFecha('01/13/2026')).toBeNull();
  });

  it('devuelve null con basura', () => {
    expect(parsearFecha('')).toBeNull();
    expect(parsearFecha('Fecha')).toBeNull();
  });
});

describe('detectarSeparador', () => {
  it('prefiere el punto y coma aunque haya comas dentro del concepto', () => {
    const lineas = ['Fecha;Concepto;Importe', '01/02/2026;PAGO TIENDA, S.L.;-45,20', '02/02/2026;OTRA COSA, S.A.;-12,00'];
    expect(detectarSeparador(lineas)).toBe(';');
  });

  it('detecta la coma cuando es el separador de verdad', () => {
    const lineas = ['Date,Description,Amount', '2026-02-01,SHOP,-45.20', '2026-02-02,OTHER,-12.00'];
    expect(detectarSeparador(lineas)).toBe(',');
  });

  it('detecta el tabulador', () => {
    const lineas = ['Fecha\tConcepto\tImporte', '01/02/2026\tPAGO\t-45,20'];
    expect(detectarSeparador(lineas)).toBe('\t');
  });
});

describe('detectarMapeo', () => {
  it('reconoce las columnas por el nombre de la cabecera', () => {
    const m = detectarMapeo(['Fecha', 'Concepto', 'Importe', 'Saldo'], [['01/02/2026', 'PAGO', '-45,20', '1.000,00']]);
    expect(m.fecha).toBe(0);
    expect(m.concepto).toBe(1);
    expect(m.importe).toBe(2);
  });

  it('no confunde la columna de saldo con la de importe', () => {
    const m = detectarMapeo(['Fecha', 'Concepto', 'Saldo'], [['01/02/2026', 'PAGO', '1.000,00']]);
    expect(m.importe).not.toBe(2);
  });

  it('reconoce Debe y Haber por separado', () => {
    const m = detectarMapeo(['Fecha', 'Concepto', 'Debe', 'Haber'], [['01/02/2026', 'PAGO', '45,20', '']]);
    expect(m.debe).toBe(2);
    expect(m.haber).toBe(3);
    expect(m.importe).toBe(-1);
  });

  it('sin cabeceras útiles, deduce por el contenido', () => {
    const filas = [
      ['01/02/2026', 'COMPRA SUPERMERCADO', '-45,20'],
      ['02/02/2026', 'NOMINA MENSUAL', '1.800,00'],
      ['03/02/2026', 'RECIBO LUZ', '-73,15'],
    ];
    const m = detectarMapeo(['', '', ''], filas);
    expect(m.fecha).toBe(0);
    expect(m.importe).toBe(2);
    expect(m.concepto).toBe(1);
  });
});

describe('analizarCsv', () => {
  it('extracto típico de banco español', () => {
    const csv = [
      'Fecha;Concepto;Importe;Saldo',
      '01/02/2026;COMPRA SUPERMERCADO;-45,20;1.954,80',
      '03/02/2026;NOMINA;1.800,00;3.754,80',
    ].join('\n');
    const a = analizarCsv(csv);
    expect(a.separador).toBe(';');
    expect(a.cabeceras).toEqual(['Fecha', 'Concepto', 'Importe', 'Saldo']);
    expect(a.filas).toHaveLength(2);
    expect(a.mapeo.fecha).toBe(0);
    expect(a.mapeo.importe).toBe(2);
  });

  it('se salta las líneas sueltas de antes de la tabla', () => {
    const csv = [
      'Extracto de movimientos',
      'Titular: FULANO DE TAL',
      '',
      'Fecha;Concepto;Importe',
      '01/02/2026;COMPRA;-45,20',
      '02/02/2026;OTRA;-10,00',
    ].join('\n');
    const a = analizarCsv(csv);
    expect(a.cabeceras).toEqual(['Fecha', 'Concepto', 'Importe']);
    expect(a.filas).toHaveLength(2);
  });

  it('fichero sin cabecera: la primera línea también son datos', () => {
    const csv = ['01/02/2026;COMPRA SUPERMERCADO;-45,20', '02/02/2026;NOMINA;1.800,00'].join('\n');
    const a = analizarCsv(csv);
    expect(a.filas).toHaveLength(2);
    expect(a.cabeceras[0]).toBe('Columna 1');
  });

  it('se traga el BOM y los saltos de Windows', () => {
    const csv = '﻿Fecha;Concepto;Importe\r\n01/02/2026;COMPRA;-45,20\r\n';
    const a = analizarCsv(csv);
    expect(a.cabeceras[0]).toBe('Fecha');
    expect(a.filas).toHaveLength(1);
  });

  it('texto vacío no revienta', () => {
    const a = analizarCsv('');
    expect(a.filas).toEqual([]);
    expect(a.cabeceras).toEqual([]);
  });
});

describe('prepararFilas', () => {
  const csv = ['Fecha;Concepto;Importe', '01/02/2026;COMPRA SUPERMERCADO;-45,20', '03/02/2026;NOMINA;1.800,00'].join('\n');

  it('convierte a movimientos con el signo correcto', () => {
    const a = analizarCsv(csv);
    const filas = prepararFilas(a, a.mapeo);
    expect(filas).toHaveLength(2);
    expect(filas[0]).toMatchObject({ fecha: '2026-02-01', concepto: 'COMPRA SUPERMERCADO', importeCts: -4520, errores: [] });
    expect(filas[1]).toMatchObject({ fecha: '2026-02-03', importeCts: 180000, errores: [] });
  });

  it('señala la línea original de cada fila', () => {
    const a = analizarCsv(csv);
    const filas = prepararFilas(a, a.mapeo);
    expect(filas[0].linea).toBe(2);
    expect(filas[1].linea).toBe(3);
  });

  it('el Debe es salida aunque venga sin signo', () => {
    const conDebeHaber = ['Fecha;Concepto;Debe;Haber', '01/02/2026;RECIBO;45,20;', '02/02/2026;INGRESO;;120,00'].join('\n');
    const a = analizarCsv(conDebeHaber);
    const filas = prepararFilas(a, a.mapeo);
    expect(filas[0].importeCts).toBe(-4520);
    expect(filas[1].importeCts).toBe(12000);
  });

  it('marca los errores sin tumbar el resto', () => {
    const malo = ['Fecha;Concepto;Importe', '01/02/2026;BUENA;-45,20', 'no-es-fecha;MALA;-10,00', '03/02/2026;SIN IMPORTE;N/A'].join('\n');
    const a = analizarCsv(malo);
    const filas = prepararFilas(a, a.mapeo);
    expect(filas[0].errores).toEqual([]);
    expect(filas[1].errores[0]).toContain('fecha ilegible');
    expect(filas[2].errores[0]).toContain('importe ilegible');
  });

  it('un importe de cero es un error, no un movimiento', () => {
    const a = analizarCsv(['Fecha;Concepto;Importe', '01/02/2026;NADA;0,00'].join('\n'));
    const filas = prepararFilas(a, a.mapeo);
    expect(filas[0].errores).toContain('importe cero');
  });

  it('sin concepto pone uno por defecto', () => {
    const a = analizarCsv(['Fecha;Concepto;Importe', '01/02/2026;;-45,20'].join('\n'));
    const filas = prepararFilas(a, a.mapeo);
    expect(filas[0].concepto).toBe('Movimiento importado');
  });

  it('marca lo que ya existe como duplicado', () => {
    const a = analizarCsv(csv);
    const filas = prepararFilas(a, a.mapeo, [{ fecha: '2026-02-01', importeCts: -4520, concepto: 'compra supermercado' }]);
    expect(filas[0].duplicada).toBe(true);
    expect(filas[1].duplicada).toBe(false);
  });

  it('marca también los repetidos dentro del propio fichero', () => {
    const repetido = ['Fecha;Concepto;Importe', '01/02/2026;COMPRA;-45,20', '01/02/2026;COMPRA;-45,20'].join('\n');
    const a = analizarCsv(repetido);
    const filas = prepararFilas(a, a.mapeo);
    expect(filas[0].duplicada).toBe(false);
    expect(filas[1].duplicada).toBe(true);
  });

  it('un duplicado sigue siendo importable: la decisión es del usuario', () => {
    const a = analizarCsv(csv);
    const filas = prepararFilas(a, a.mapeo, [{ fecha: '2026-02-01', importeCts: -4520, concepto: 'COMPRA SUPERMERCADO' }]);
    expect(filas[0].errores).toEqual([]);
  });
});

describe('resumir', () => {
  const csv = [
    'Fecha;Concepto;Importe',
    '01/02/2026;COMPRA;-45,20',
    '03/02/2026;NOMINA;1.800,00',
    'malo;ROTA;-10,00',
    '01/02/2026;COMPRA;-45,20',
  ].join('\n');

  it('cuenta e informa del rango y el neto', () => {
    const a = analizarCsv(csv);
    const filas = prepararFilas(a, a.mapeo);
    const r = resumir(filas, false);
    expect(r.total).toBe(4);
    expect(r.conError).toBe(1);
    expect(r.duplicadas).toBe(1);
    expect(r.importables).toBe(2);
    expect(r.sumaCts).toBe(-4520 + 180000);
    expect(r.desde).toBe('2026-02-01');
    expect(r.hasta).toBe('2026-02-03');
  });

  it('incluyendo duplicados cuenta uno más', () => {
    const a = analizarCsv(csv);
    const filas = prepararFilas(a, a.mapeo);
    expect(resumir(filas, true).importables).toBe(3);
  });
});
