#!/usr/bin/env node
// Comprueba los ficheros que NO pasan por el compilador ni por ESLint: el JS
// legacy de la raíz y todo el CSS.
//
// Existe porque dos regresiones llegaron a producción por este agujero:
//
//   · un comentario CSS mal cerrado en dashboard.css, cuyo `*/` prematuro dejó
//     texto suelto que se comió la regla siguiente;
//   · un comentario HTML con backticks dentro de un template literal de
//     dashboard.js, que cortó la cadena y dejó el fichero sin parsear — con el
//     dashboard entero en blanco.
//
// Ninguna de las dos las veía nadie: `tsc` solo mira `src/`, ESLint solo mira
// `src/` y `tests/`, y del CSS no se ocupaba nada.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..', '..');
const problemas = [];

// ── JS que se sirve tal cual (no pasa por Vite) ──────────────────────────────
const JS = globSync(
  ['*.js', 'auth/*.js', 'common/*.js', 'dashboard/*.js', 'data-io/*.js', 'finance-math/*.js', 'firebase/*.js', 'ui/*.js', 'tools/**/*.js'],
  { cwd: raiz },
).filter((f) => !f.includes('node_modules') && !f.startsWith('assets/'));

for (const rel of JS) {
  try {
    execFileSync(process.execPath, ['--check', path.join(raiz, rel)], { stdio: 'pipe' });
  } catch (e) {
    const salida = String(e.stderr || e.message).split('\n').slice(0, 4).join('\n');
    problemas.push(`${rel}\n    ${salida.replace(/\n/g, '\n    ')}`);
  }
}

// ── CSS: comentarios y llaves ────────────────────────────────────────────────
const CSS = globSync(['*.css', '*/*.css'], { cwd: raiz }).filter((f) => !f.includes('node_modules'));

for (const rel of CSS) {
  const s = readFileSync(path.join(raiz, rel), 'utf8');

  // CSS no anida comentarios: el primer `*/` cierra el `/*` abierto.
  let i = 0;
  for (;;) {
    const a = s.indexOf('/*', i);
    if (a === -1) break;
    const c = s.indexOf('*/', a + 2);
    if (c === -1) {
      problemas.push(`${rel}: comentario sin cerrar en la línea ${s.slice(0, a).split('\n').length}`);
      break;
    }
    i = c + 2;
  }

  const limpio = s.replace(/\/\*[\s\S]*?\*\//g, '');
  if (limpio.includes('*/')) {
    const p = limpio.indexOf('*/');
    problemas.push(`${rel}: `+
      `«*/» suelto fuera de comentario (línea ${limpio.slice(0, p).split('\n').length} del fichero sin comentarios). ` +
      'Suele significar que un comentario cerró antes de tiempo y dejó texto huérfano, que se traga la regla siguiente.');
  }

  const abre = (limpio.match(/\{/g) || []).length;
  const cierra = (limpio.match(/\}/g) || []).length;
  if (abre !== cierra) problemas.push(`${rel}: llaves descuadradas — ${abre} «{» frente a ${cierra} «}»`);
}

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s) en ficheros estáticos:\n`);
  for (const p of problemas) console.error('  · ' + p);
  console.error('');
  process.exit(1);
}

console.log(`✓ ${JS.length} ficheros JS y ${CSS.length} CSS sin problemas de sintaxis`);
