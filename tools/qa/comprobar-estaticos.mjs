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
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// `import.meta.dirname` es de Node 20.11+ y `globSync` de node:fs es de Node 22:
// CI corre Node 20 y el script reventaba al importar. Se recorren los
// directorios a mano, que funciona en cualquier versión.
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const problemas = [];

const IGNORAR = new Set(['node_modules', '.git', 'assets', 'coverage', 'dist', '_site']);

/** Ficheros con esa extensión bajo `dir`, en rutas relativas a la raíz. */
function buscar(dir, ext, profundidad = 0) {
  const abs = path.join(raiz, dir);
  let entradas;
  try {
    entradas = readdirSync(abs, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const e of entradas) {
    if (IGNORAR.has(e.name) || e.name.startsWith('.')) continue;
    const rel = dir ? `${dir}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (profundidad < 3) out.push(...buscar(rel, ext, profundidad + 1));
    } else if (e.name.endsWith(ext)) {
      out.push(rel);
    }
  }
  return out;
}

// ── JS que se sirve tal cual (no pasa por Vite) ──────────────────────────────
// Fuera `src/` y `tests/`, que ya cubren tsc y ESLint.
const JS = buscar('', '.js').filter((f) => !f.startsWith('src/') && !f.startsWith('tests/'));

for (const rel of JS) {
  try {
    execFileSync(process.execPath, ['--check', path.join(raiz, rel)], { stdio: 'pipe' });
  } catch (e) {
    const salida = String(e.stderr || e.message).split('\n').slice(0, 4).join('\n');
    problemas.push(`${rel}\n    ${salida.replace(/\n/g, '\n    ')}`);
  }
}

// ── CSS: comentarios y llaves ────────────────────────────────────────────────
const CSS = buscar('', '.css');

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

// Si un día el recorrido deja de encontrar nada, esto pasaría en verde sin
// comprobar absolutamente nada. Mejor que reviente.
if (JS.length === 0 || CSS.length === 0) {
  console.error(`\n✗ el recorrido no encontró ficheros (JS: ${JS.length}, CSS: ${CSS.length}). ¿Ha cambiado la estructura del repositorio?\n`);
  process.exit(1);
}

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s) en ficheros estáticos:\n`);
  for (const p of problemas) console.error('  · ' + p);
  console.error('');
  process.exit(1);
}

console.log(`✓ ${JS.length} ficheros JS y ${CSS.length} CSS sin problemas de sintaxis`);
