// ── accounting/importar-csv ───────────────────────────────────────────────────
// Lectura de extractos bancarios en CSV. Puro: entra texto, salen filas. Sin
// DOM y sin almacenamiento, porque aquí es donde el dinero se puede corromper y
// eso tiene que poder probarse a solas.
//
// El objetivo NO es soportar «cualquier CSV», sino los que exportan los bancos
// españoles, que comparten manías:
//
//   · separador `;` (porque la coma es el decimal);
//   · importes «1.234,56» — punto de millar y coma decimal;
//   · fechas «dd/mm/aaaa»;
//   · a veces DOS columnas de importe (Debe / Haber) en vez de una con signo;
//   · varias líneas de cabecera antes de la tabla de verdad.
//
// Todo eso se detecta solo y el usuario puede corregirlo antes de importar.

import type { ISODate } from '@/core/dates';

export type TipoColumna = 'fecha' | 'concepto' | 'importe' | 'debe' | 'haber' | 'saldo' | 'ignorar';

export interface Mapeo {
  /** Índice de columna por rol. -1 = no hay. */
  fecha: number;
  concepto: number;
  importe: number;
  debe: number;
  haber: number;
}

export interface FilaImportada {
  /** Nº de línea dentro del CSV, 1-based, para poder señalarla. */
  linea: number;
  fecha: ISODate | null;
  concepto: string;
  /** Céntimos con signo. Negativo = salida. `null` si no se pudo leer. */
  importeCts: number | null;
  /** Por qué esta fila no se puede importar. Vacío = correcta. */
  errores: string[];
  /** Coincide con un movimiento que ya existe. */
  duplicada: boolean;
}

export interface AnalisisCsv {
  separador: string;
  cabeceras: string[];
  /** Filas de datos, ya troceadas, sin la cabecera. */
  filas: string[][];
  /** Línea (1-based) donde empieza la tabla. */
  lineaCabecera: number;
  mapeo: Mapeo;
}

const SEPARADORES = [';', ',', '\t', '|'];

/** Pistas de nombre de columna, en minúsculas y sin acentos. */
const PISTAS: Record<Exclude<TipoColumna, 'ignorar' | 'saldo'>, string[]> = {
  fecha: ['fecha', 'f. valor', 'fecha valor', 'fecha operacion', 'date', 'f.operacion', 'f. operacion'],
  concepto: ['concepto', 'descripcion', 'detalle', 'movimiento', 'referencia', 'description', 'observaciones'],
  importe: ['importe', 'cantidad', 'amount', 'euros', 'import'],
  debe: ['debe', 'cargo', 'salida', 'pago', 'debito'],
  haber: ['haber', 'abono', 'entrada', 'ingreso', 'credito'],
};

/** Quita acentos y baja a minúsculas, para comparar nombres de columna. */
function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/**
 * Trocea una línea de CSV respetando las comillas dobles, incluidas las
 * escapadas duplicándolas (`""`), que es como las escriben Excel y los bancos.
 */
export function trocearLinea(linea: string, separador: string): string[] {
  const out: string[] = [];
  let actual = '';
  let entreComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (entreComillas) {
      if (c === '"') {
        if (linea[i + 1] === '"') {
          actual += '"';
          i++;
        } else {
          entreComillas = false;
        }
      } else {
        actual += c;
      }
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === separador) {
      out.push(actual.trim());
      actual = '';
    } else {
      actual += c;
    }
  }
  out.push(actual.trim());
  return out;
}

/**
 * Separador más probable: el que produce más columnas de forma CONSISTENTE.
 * Contar apariciones a secas se equivoca con conceptos que llevan comas.
 */
export function detectarSeparador(lineas: string[]): string {
  let mejor = ';';
  let mejorPuntuacion = -1;

  for (const sep of SEPARADORES) {
    const cuentas = lineas.slice(0, 20).map((l) => trocearLinea(l, sep).length);
    const columnas = Math.max(...cuentas);
    if (columnas < 2) continue;
    const consistentes = cuentas.filter((c) => c === columnas).length;
    // Se premia tener varias columnas y que casi todas las líneas coincidan.
    const puntuacion = consistentes * 10 + columnas;
    if (puntuacion > mejorPuntuacion) {
      mejorPuntuacion = puntuacion;
      mejor = sep;
    }
  }
  return mejor;
}

/**
 * Importe en céntimos. Devuelve `null` si no hay número.
 *
 * Acepta «1.234,56», «1,234.56», «1234.56», «1 234,56», «-45,20», «45,20-»
 * (signo detrás, que usan algunos bancos) y «(45,20)» (paréntesis = negativo).
 */
export function parsearImporte(bruto: string): number | null {
  let s = (bruto ?? '').trim();
  if (!s) return null;

  let negativo = false;

  if (/^\(.*\)$/.test(s)) {
    negativo = true;
    s = s.slice(1, -1).trim();
  }
  if (s.endsWith('-')) {
    negativo = true;
    s = s.slice(0, -1).trim();
  }
  if (s.startsWith('-')) {
    negativo = true;
    s = s.slice(1).trim();
  }
  if (s.startsWith('+')) s = s.slice(1).trim();

  // Fuera moneda y espacios (incluido el duro, que se cuela al copiar y pegar).
  s = s.replace(/[€$£\s  ]/g, '');
  if (!s) return null;

  const ultimaComa = s.lastIndexOf(',');
  const ultimoPunto = s.lastIndexOf('.');

  let decimal = '';
  if (ultimaComa >= 0 && ultimoPunto >= 0) {
    // El que va más a la derecha es el separador decimal.
    decimal = ultimaComa > ultimoPunto ? ',' : '.';
  } else if (ultimaComa >= 0) {
    // Con un solo símbolo: es decimal salvo que agrupe de tres en tres
    // («1,234» es mil doscientos treinta y cuatro, no 1,234 €).
    decimal = /,\d{3}$/.test(s) && s.replace(/,/g, '').length > 3 ? '' : ',';
  } else if (ultimoPunto >= 0) {
    decimal = /\.\d{3}$/.test(s) && s.replace(/\./g, '').length > 3 ? '' : '.';
  }

  let entero: string;
  let centimos = '0';
  if (decimal) {
    const corte = decimal === ',' ? ultimaComa : ultimoPunto;
    entero = s.slice(0, corte).replace(/[.,]/g, '');
    centimos = s.slice(corte + 1).replace(/[.,]/g, '');
  } else {
    entero = s.replace(/[.,]/g, '');
  }

  if (!/^\d*$/.test(entero) || !/^\d*$/.test(centimos)) return null;
  if (entero === '' && centimos === '') return null;

  // Se normaliza a dos dígitos: «,5» son 50 céntimos, «,5678» se trunca a 56.
  const cts = (centimos + '00').slice(0, 2);
  const valor = Number(entero || '0') * 100 + Number(cts);
  if (!Number.isFinite(valor)) return null;
  return negativo ? -valor : valor;
}

/** Fecha en ISO. Devuelve `null` si no se reconoce. */
export function parsearFecha(bruto: string): ISODate | null {
  const s = (bruto ?? '').trim();
  if (!s) return null;

  // aaaa-mm-dd o aaaa/mm/dd
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) return componer(Number(m[1]), Number(m[2]), Number(m[3]));

  // dd/mm/aaaa, dd-mm-aaaa, dd.mm.aaaa (y con año de dos cifras)
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (m) {
    let año = Number(m[3]);
    if (año < 100) año += año < 70 ? 2000 : 1900;
    return componer(año, Number(m[2]), Number(m[1]));
  }

  return null;
}

function componer(año: number, mes: number, dia: number): ISODate | null {
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  // Se comprueba que la fecha exista de verdad: el 31 de febrero no vale.
  const d = new Date(año, mes - 1, dia);
  if (d.getFullYear() !== año || d.getMonth() !== mes - 1 || d.getDate() !== dia) return null;
  return `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/** ¿Cuántas de estas celdas parecen fechas? */
function proporcionFechas(celdas: string[]): number {
  const utiles = celdas.filter((c) => c.trim());
  if (utiles.length === 0) return 0;
  return utiles.filter((c) => parsearFecha(c) !== null).length / utiles.length;
}

function proporcionImportes(celdas: string[]): number {
  const utiles = celdas.filter((c) => c.trim());
  if (utiles.length === 0) return 0;
  return utiles.filter((c) => parsearImporte(c) !== null).length / utiles.length;
}

/**
 * Adivina qué columna es qué. Primero por el nombre de la cabecera; lo que
 * quede sin asignar, por el contenido de las filas.
 */
export function detectarMapeo(cabeceras: string[], filas: string[][]): Mapeo {
  const mapeo: Mapeo = { fecha: -1, concepto: -1, importe: -1, debe: -1, haber: -1 };
  const usadas = new Set<number>();

  const columna = (i: number) => filas.map((f) => f[i] ?? '');

  for (const rol of ['fecha', 'importe', 'debe', 'haber', 'concepto'] as const) {
    for (let i = 0; i < cabeceras.length; i++) {
      if (usadas.has(i)) continue;
      const nombre = normalizar(cabeceras[i]);
      if (!nombre) continue;
      if (PISTAS[rol].some((p) => nombre === p || nombre.startsWith(p) || nombre.includes(p))) {
        // Una columna de saldo se parece mucho a una de importe: si la cabecera
        // dice «saldo», no es el importe del movimiento.
        if (rol === 'importe' && normalizar(cabeceras[i]).includes('saldo')) continue;
        mapeo[rol] = i;
        usadas.add(i);
        break;
      }
    }
  }

  // Por contenido, para lo que no tenga cabecera reconocible.
  if (mapeo.fecha < 0) {
    let mejor = -1;
    let mejorProp = 0.6; // hace falta bastante confianza
    for (let i = 0; i < cabeceras.length; i++) {
      if (usadas.has(i)) continue;
      const p = proporcionFechas(columna(i));
      if (p > mejorProp) {
        mejorProp = p;
        mejor = i;
      }
    }
    if (mejor >= 0) {
      mapeo.fecha = mejor;
      usadas.add(mejor);
    }
  }

  if (mapeo.importe < 0 && mapeo.debe < 0 && mapeo.haber < 0) {
    let mejor = -1;
    let mejorProp = 0.6;
    for (let i = 0; i < cabeceras.length; i++) {
      if (usadas.has(i)) continue;
      // Una columna de saldo se parece a una de importe hasta el último dígito:
      // aquí es donde hay que descartarla, no en el paso por cabecera, porque
      // «Saldo» no coincide con ninguna pista de importe y llegaba entera.
      if (normalizar(cabeceras[i]).includes('saldo')) continue;
      const p = proporcionImportes(columna(i));
      if (p > mejorProp) {
        mejorProp = p;
        mejor = i;
      }
    }
    if (mejor >= 0) {
      mapeo.importe = mejor;
      usadas.add(mejor);
    }
  }

  if (mapeo.concepto < 0) {
    // El concepto es la columna de texto más larga de media.
    let mejor = -1;
    let mejorLargo = 0;
    for (let i = 0; i < cabeceras.length; i++) {
      if (usadas.has(i)) continue;
      const celdas = columna(i);
      if (proporcionImportes(celdas) > 0.5 || proporcionFechas(celdas) > 0.5) continue;
      const largo = celdas.reduce((s, c) => s + c.length, 0) / Math.max(1, celdas.length);
      if (largo > mejorLargo) {
        mejorLargo = largo;
        mejor = i;
      }
    }
    if (mejor >= 0) mapeo.concepto = mejor;
  }

  return mapeo;
}

/**
 * Analiza el texto completo: separador, dónde empieza la tabla y qué es cada
 * columna.
 *
 * Los bancos suelen meter líneas sueltas antes de la cabecera («Titular: …»,
 * «Periodo: …»), así que se toma como cabecera la primera línea que tenga
 * tantas columnas como la mayoría.
 */
export function analizarCsv(texto: string): AnalisisCsv {
  const lineas = texto
    .replace(/^﻿/, '') // BOM
    .split(/\r\n|\n|\r/)
    .filter((l) => l.trim() !== '');

  if (lineas.length === 0) {
    return {
      separador: ';',
      cabeceras: [],
      filas: [],
      lineaCabecera: 0,
      mapeo: { fecha: -1, concepto: -1, importe: -1, debe: -1, haber: -1 },
    };
  }

  const separador = detectarSeparador(lineas);
  const anchos = lineas.map((l) => trocearLinea(l, separador).length);
  const anchoTabla = Math.max(...anchos);

  let iCabecera = anchos.findIndex((a) => a === anchoTabla);
  if (iCabecera < 0) iCabecera = 0;

  const cabeceras = trocearLinea(lineas[iCabecera], separador);
  let filas = lineas.slice(iCabecera + 1).map((l) => trocearLinea(l, separador));

  // Si la «cabecera» ya trae datos (fichero sin cabecera), se trata como fila.
  const cabeceraEsDatos = parsearFecha(cabeceras[0] ?? '') !== null || cabeceras.some((c) => parsearImporte(c) !== null && /\d/.test(c));
  if (cabeceraEsDatos) {
    filas = [cabeceras, ...filas];
  }

  const mapeo = detectarMapeo(cabeceraEsDatos ? cabeceras.map(() => '') : cabeceras, filas.slice(0, 40));

  return {
    separador,
    cabeceras: cabeceraEsDatos ? cabeceras.map((_, i) => `Columna ${i + 1}`) : cabeceras,
    filas,
    lineaCabecera: iCabecera + 1,
    mapeo,
  };
}

export interface MovimientoExistente {
  fecha: ISODate;
  importeCts: number;
  concepto: string;
}

/** Clave de comparación para detectar repetidos: fecha, importe y concepto. */
function clave(fecha: ISODate, importeCts: number, concepto: string): string {
  return `${fecha}|${importeCts}|${normalizar(concepto).replace(/\s+/g, ' ')}`;
}

/**
 * Convierte las filas troceadas en movimientos, marcando errores y repetidos.
 *
 * Los repetidos se marcan pero NO se descartan: la decisión es del usuario,
 * porque dos compras idénticas el mismo día en el mismo sitio existen.
 */
export function prepararFilas(analisis: AnalisisCsv, mapeo: Mapeo, existentes: MovimientoExistente[] = []): FilaImportada[] {
  const yaHay = new Set(existentes.map((m) => clave(m.fecha, m.importeCts, m.concepto)));
  const vistas = new Set<string>();

  return analisis.filas.map((celdas, i) => {
    const errores: string[] = [];

    const fecha = mapeo.fecha >= 0 ? parsearFecha(celdas[mapeo.fecha] ?? '') : null;
    if (mapeo.fecha < 0) errores.push('sin columna de fecha');
    else if (!fecha) errores.push(`fecha ilegible: «${celdas[mapeo.fecha] ?? ''}»`);

    let importeCts: number | null = null;
    if (mapeo.importe >= 0) {
      importeCts = parsearImporte(celdas[mapeo.importe] ?? '');
      if (importeCts === null) errores.push(`importe ilegible: «${celdas[mapeo.importe] ?? ''}»`);
    } else if (mapeo.debe >= 0 || mapeo.haber >= 0) {
      const debe = mapeo.debe >= 0 ? parsearImporte(celdas[mapeo.debe] ?? '') : null;
      const haber = mapeo.haber >= 0 ? parsearImporte(celdas[mapeo.haber] ?? '') : null;
      if (debe === null && haber === null) errores.push('sin importe en Debe ni en Haber');
      // El Debe es salida: se fuerza el signo negativo aunque venga sin él.
      else if (debe !== null && debe !== 0) importeCts = -Math.abs(debe);
      else if (haber !== null && haber !== 0) importeCts = Math.abs(haber);
      else importeCts = 0;
    } else {
      errores.push('sin columna de importe');
    }

    if (importeCts === 0) errores.push('importe cero');

    const concepto = (mapeo.concepto >= 0 ? (celdas[mapeo.concepto] ?? '') : '').trim() || 'Movimiento importado';

    let duplicada = false;
    if (fecha && importeCts !== null) {
      const k = clave(fecha, importeCts, concepto);
      // Repetido respecto a lo ya guardado, o respecto a otra fila del propio
      // fichero (algunos extractos repiten el último movimiento del periodo
      // anterior en la primera línea del siguiente).
      duplicada = yaHay.has(k) || vistas.has(k);
      vistas.add(k);
    }

    return {
      linea: analisis.lineaCabecera + 1 + i,
      fecha,
      concepto,
      importeCts,
      errores,
      duplicada,
    };
  });
}

export interface ResumenImportacion {
  total: number;
  importables: number;
  conError: number;
  duplicadas: number;
  sumaCts: number;
  desde: ISODate | null;
  hasta: ISODate | null;
}

export function resumir(filas: FilaImportada[], incluirDuplicadas: boolean): ResumenImportacion {
  const validas = filas.filter((f) => f.errores.length === 0 && (incluirDuplicadas || !f.duplicada));
  const fechas = validas
    .map((f) => f.fecha)
    .filter((f): f is ISODate => !!f)
    .sort();
  return {
    total: filas.length,
    importables: validas.length,
    conError: filas.filter((f) => f.errores.length > 0).length,
    duplicadas: filas.filter((f) => f.duplicada).length,
    sumaCts: validas.reduce((s, f) => s + (f.importeCts ?? 0), 0),
    desde: fechas[0] ?? null,
    hasta: fechas[fechas.length - 1] ?? null,
  };
}
