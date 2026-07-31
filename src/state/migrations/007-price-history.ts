// ── Migración → v7 ────────────────────────────────────────────────────────────
// Retira `historialPrecios` de las estimaciones (F4, tarea 4.8 — aprobada por el
// usuario el 2026-07-30).
//
// Era una segunda contabilidad encubierta: importes reales de facturas anotados
// por gasto, que además el motor usaba en silencio (media del año más reciente
// en lugar de la cuantía configurada). Con el módulo de contabilidad real ese
// papel lo hacen las transacciones, que además alimentan el análisis de
// precisión y el "sugerir ajuste".
//
// No se pierde nada: cada entrada del historial se convierte en una transacción
// real enlazada a su estimación (`estimacionId`), que es exactamente lo que
// representaba.
//
// OJO — cambio de comportamiento visible: las proyecciones de un gasto con
// historial pasan a usar su cuantía configurada en vez de la media implícita.
// Es el cambio que se buscaba (la media era invisible y no se podía desactivar);
// para reajustar la cuantía a lo que se gasta de verdad está "sugerir ajuste",
// que ahora se apoya en las transacciones importadas aquí.

import { toCents } from '@/core/money';
import type { MigrationContext, RawState } from './types';

type Obj = Record<string, unknown>;

const asArray = (v: unknown): Obj[] => (Array.isArray(v) ? (v as Obj[]) : []);
const esFechaISO = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const esImporte = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;

let contador = 0;
function idTransaccion(): string {
  contador += 1;
  return `tx_hp_${contador.toString(36)}`;
}

export function migrateTo7(raw: RawState, _ctx: MigrationContext): RawState {
  const out: Obj = { ...raw };
  contador = 0;

  const transacciones = [...asArray(raw.transacciones)];
  // Evita duplicar si la migración se reaplica sobre un estado ya migrado o
  // sobre un backup mezclado: la clave natural es estimación + fecha + importe.
  const vistas = new Set(transacciones.map((t) => `${t.estimacionId}|${t.fecha}|${t.importeCts}`));

  const expenses = asArray(raw.expenses).map((exp) => {
    const historial = asArray(exp.historialPrecios);
    const estimacionId = typeof exp._id === 'string' ? exp._id : null;
    const cuentaId = typeof exp.cuenta === 'string' && exp.cuenta ? exp.cuenta : 'default';
    // 'transferencia' no tenía UI de historial; si algo llega así, se trata
    // como gasto para no inventar un movimiento de signo dudoso.
    const tipo = exp.tipo === 'ingreso' ? 'ingreso' : 'gasto';
    const tags = Array.isArray(exp.tags) ? exp.tags.filter((t) => typeof t === 'string') : [];

    if (estimacionId) {
      for (const h of historial) {
        if (!h || !esFechaISO(h.fecha) || !esImporte(h.cuantia)) continue;
        const importeCts = tipo === 'ingreso' ? toCents(h.cuantia) : -toCents(h.cuantia);
        const clave = `${estimacionId}|${h.fecha}|${importeCts}`;
        if (vistas.has(clave)) continue;
        vistas.add(clave);
        transacciones.push({
          _id: idTransaccion(),
          fecha: h.fecha,
          cuentaId,
          importeCts,
          concepto: typeof exp.concepto === 'string' ? exp.concepto : 'Movimiento',
          tags,
          estimacionId,
          tipo,
          origen: 'importado',
          nota: typeof h.nota === 'string' && h.nota ? h.nota : 'Importado del historial de precios',
        });
      }
    }

    const { historialPrecios: _retirado, ...resto } = exp;
    return resto;
  });

  out.expenses = expenses;
  out.transacciones = transacciones.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  return out;
}
