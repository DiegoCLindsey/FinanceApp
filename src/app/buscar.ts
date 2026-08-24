// ── app/buscar ────────────────────────────────────────────────────────────────
// Encontrar «aquel recibo del seguro» sin recordar en qué apartado estaba.
//
// Con doce vistas, buscar algo obliga hoy a saber de antemano dónde vive: los
// préstamos en Préstamos, las nóminas en Nóminas, los movimientos importados
// dentro de Contabilidad. Eso es pedirle al usuario que conozca la arquitectura
// de la aplicación para usarla.
//
// Este módulo es solo la parte que decide QUÉ sale y en qué orden. La ventana
// está en `ui/buscador`.
//
// ── Cómo se ordena, y por qué así ────────────────────────────────────────────
//
// Ordenar por «cuántas letras coinciden» da resultados absurdos en una lista
// corta. Lo que importa es DÓNDE empieza la coincidencia:
//
//   «seg» →  1. «Seguro coche»      (el nombre empieza por ahí)
//            2. «Préstamo segundo»  (empieza una palabra)
//            3. «Riesgo segmentado» (aparece a mitad de palabra)
//
// A igualdad de posición manda lo más corto, que es lo más específico: buscando
// «luz», «Luz» va antes que «Luz y gas del trastero».

import type { AppState } from '@/state/schema';

export type TipoResultado = 'gasto' | 'ingreso' | 'cuenta' | 'prestamo' | 'nomina' | 'supuesto' | 'plan' | 'objetivo' | 'movimiento';

export interface Resultado {
  tipo: TipoResultado;
  /** Etiqueta del tipo, para el usuario: «Gasto», «Préstamo»… */
  etiqueta: string;
  id: string;
  titulo: string;
  /** Contexto: importe, cuenta, fecha… lo que distinga uno de otro. */
  detalle: string;
  /** Vista a la que llevar al usuario. */
  ruta: string;
  /** Menor es mejor. Expuesto para poder fijar el orden en los tests. */
  peso: number;
}

/**
 * Normaliza para comparar: sin tildes, sin mayúsculas, sin espacios de sobra.
 *
 * Sin esto, «nomina» no encuentra «Nómina», que es exactamente lo que teclea
 * cualquiera con prisa.
 */
export function normalizar(s: unknown): string {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Posición de la coincidencia: 0 al principio, 1 en palabra, 2 dentro, −1 nada. */
export function calidadCoincidencia(texto: string, aguja: string): number {
  const t = normalizar(texto);
  const a = normalizar(aguja);
  if (!a) return -1;
  const i = t.indexOf(a);
  if (i < 0) return -1;
  if (i === 0) return 0;
  // Un separador delante = empieza palabra. Cuenta el guion y la barra porque
  // «seguro-coche» y «luz/gas» son nombres que la gente escribe así.
  return /[\s\-/_(«"']/.test(t[i - 1]) ? 1 : 2;
}

interface Candidato {
  tipo: TipoResultado;
  etiqueta: string;
  id: string;
  titulo: string;
  detalle: string;
  ruta: string;
  /** Texto adicional que también hace encontrar la ficha (etiquetas, cuenta…). */
  extra?: string;
}

const eur = (n: unknown): string => {
  const v = Number(n);
  return Number.isFinite(v) ? `${v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €` : '';
};

/** Todo lo buscable del estado, aplanado. */
export function catalogar(state: Partial<AppState>): Candidato[] {
  const out: Candidato[] = [];
  const cuenta = (id: unknown) => state.accounts?.find((a) => a._id === id)?.nombre ?? '';

  for (const e of state.expenses ?? []) {
    const esIngreso = e.tipo === 'ingreso';
    out.push({
      tipo: esIngreso ? 'ingreso' : 'gasto',
      etiqueta: esIngreso ? 'Ingreso' : 'Gasto',
      id: e._id,
      titulo: e.concepto,
      detalle: [eur(e.cuantia), cuenta(e.cuenta)].filter(Boolean).join(' · '),
      ruta: 'expenses',
      extra: [...(e.tags ?? []), cuenta(e.cuenta)].join(' '),
    });
  }
  for (const a of state.accounts ?? []) {
    out.push({ tipo: 'cuenta', etiqueta: 'Cuenta', id: a._id, titulo: a.nombre, detalle: eur(a.saldoInicial), ruta: 'accounts' });
  }
  for (const l of state.loans ?? []) {
    out.push({
      tipo: 'prestamo',
      etiqueta: 'Préstamo',
      id: l._id,
      titulo: l.nombre,
      detalle: eur(l.capital),
      ruta: 'loans',
      extra: [...(l.tags ?? []), cuenta(l.cuenta)].join(' '),
    });
  }
  for (const n of state.nominas ?? []) {
    out.push({ tipo: 'nomina', etiqueta: 'Nómina', id: n._id, titulo: n.nombre, detalle: `${eur(n.bruto)} brutos`, ruta: 'nominas' });
  }
  for (const s of state.escenarios ?? []) {
    out.push({ tipo: 'supuesto', etiqueta: 'Supuesto', id: s._id, titulo: s.nombre, detalle: s.descripcion ?? '', ruta: 'escenarios' });
  }
  for (const p of state.planes ?? []) {
    out.push({ tipo: 'plan', etiqueta: 'Plan', id: p._id, titulo: p.nombre, detalle: p.notas ?? '', ruta: 'planner' });
    // Los objetivos viven DENTRO del plan, y son justo lo que el usuario tiene
    // en la cabeza cuando busca («la entrada del piso»), no el plan que los
    // contiene.
    for (const o of p.objetivos ?? []) {
      out.push({
        tipo: 'objetivo',
        etiqueta: 'Objetivo',
        id: o._id,
        titulo: o.nombre,
        detalle: [o.importeObjetivo !== null ? eur(o.importeObjetivo / 100) : '', p.nombre].filter(Boolean).join(' · '),
        ruta: 'planner',
      });
    }
  }
  for (const g of state.goals ?? []) {
    out.push({ tipo: 'objetivo', etiqueta: 'Objetivo', id: g._id, titulo: g.nombre, detalle: eur(g.targetAmount), ruta: 'accounts' });
  }
  for (const t of state.transacciones ?? []) {
    out.push({
      tipo: 'movimiento',
      etiqueta: 'Movimiento',
      id: t._id,
      titulo: t.concepto,
      detalle: [t.fecha, eur(t.importeCts / 100), cuenta(t.cuentaId)].filter(Boolean).join(' · '),
      ruta: 'contabilidad',
      extra: (t.tags ?? []).join(' '),
    });
  }
  return out;
}

export interface OpcionesBusqueda {
  /** Cuántos resultados como mucho. Por defecto 12. */
  maximo?: number;
  /** Rutas visibles ahora mismo; el resto no se ofrece. */
  rutasDisponibles?: string[] | null;
}

/**
 * Busca en todo el estado.
 *
 * Con menos de dos letras no devuelve nada: con una sola coincide medio
 * catálogo y la lista deja de ayudar.
 */
export function buscar(state: Partial<AppState>, consulta: string, opciones: OpcionesBusqueda = {}): Resultado[] {
  const { maximo = 12, rutasDisponibles = null } = opciones;
  const aguja = normalizar(consulta);
  if (aguja.length < 2) return [];

  const permitida = (ruta: string) => rutasDisponibles === null || rutasDisponibles.includes(ruta);

  const resultados: Resultado[] = [];
  for (const c of catalogar(state)) {
    if (!permitida(c.ruta)) continue;
    const enTitulo = calidadCoincidencia(c.titulo, aguja);
    // Lo que coincide solo por etiqueta o por cuenta vale, pero siempre por
    // detrás de lo que coincide por nombre: se busca el nombre.
    const enExtra = enTitulo >= 0 ? -1 : Math.min(calidadCoincidencia(c.extra ?? '', aguja), 2);
    if (enTitulo < 0 && enExtra < 0) continue;
    const posicion = enTitulo >= 0 ? enTitulo : 3;
    resultados.push({
      tipo: c.tipo,
      etiqueta: c.etiqueta,
      id: c.id,
      titulo: c.titulo,
      detalle: c.detalle,
      ruta: c.ruta,
      // El título entra en el peso para que, a igual posición, gane lo más
      // corto: es lo más específico.
      peso: posicion * 1000 + Math.min(999, normalizar(c.titulo).length),
    });
  }

  resultados.sort((a, b) => a.peso - b.peso || a.titulo.localeCompare(b.titulo, 'es'));
  return resultados.slice(0, maximo);
}
