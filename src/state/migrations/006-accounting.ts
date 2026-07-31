// ── Migración → v6 ────────────────────────────────────────────────────────────
// Módulo de contabilidad real (F4): crea `transacciones` y `puntosControl`.
//
// El histórico de saldos pasa a pertenecer a contabilidad, así que se importa
// desde las dos fuentes que existían:
//   1. `accounts[].historicoSaldos` — puntos de control por cuenta.
//   2. la clave huérfana `state_history` — colección del HistoryModule retirado
//      en 1.8, que se preservó a propósito en la migración v5 para poder
//      recuperarla aquí (ver docs/02-plan-refactor.md, tareas 1.6 y 4.1).
//
// `historicoSaldos` NO se borra: el motor legacy y el dashboard siguen
// leyéndolo. Mientras conviven, el ledger escribe en ambos sitios; el puente se
// retira al portar el dashboard (tarea 1.7).

import { toCents } from '@/core/money';
import type { MigrationContext, RawState } from './types';

type Obj = Record<string, unknown>;

const asArray = (v: unknown): Obj[] => (Array.isArray(v) ? (v as Obj[]) : []);

let contador = 0;
function idPunto(prefijo: string): string {
  contador += 1;
  return `${prefijo}_${contador.toString(36)}`;
}

const esFechaISO = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const esNumero = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function migrateTo6(raw: RawState, _ctx: MigrationContext): RawState {
  const out: Obj = { ...raw };
  contador = 0;

  // Un usuario que ya tenga contabilidad conserva la suya tal cual
  const transacciones = asArray(raw.transacciones);
  const puntosExistentes = asArray(raw.puntosControl);

  const puntos: Obj[] = [...puntosExistentes];
  // Evita duplicar (misma cuenta + misma fecha) al re-migrar
  const vistos = new Set(puntosExistentes.map((p) => `${p.cuentaId}|${p.fecha}`));

  const añadir = (cuentaId: string, fecha: unknown, saldo: unknown, nota?: unknown) => {
    if (!esFechaISO(fecha) || !esNumero(saldo)) return;
    const clave = `${cuentaId}|${fecha}`;
    if (vistos.has(clave)) return;
    vistos.add(clave);
    puntos.push({
      _id: idPunto('pc'),
      fecha,
      cuentaId,
      saldoCts: toCents(saldo),
      ...(typeof nota === 'string' && nota ? { nota } : {}),
    });
  };

  // 1. historicoSaldos de cada cuenta
  for (const acc of asArray(raw.accounts)) {
    const cuentaId = typeof acc._id === 'string' ? acc._id : null;
    if (!cuentaId) continue;
    for (const h of asArray(acc.historicoSaldos)) {
      añadir(cuentaId, h.fecha, h.saldo, h.nota);
    }
  }

  // 2. Colección `history` del módulo retirado. Sus entradas podían no llevar
  //    cuenta; en ese caso se asignan a la cuenta principal (o a 'default').
  const legacyHistory = asArray(raw.history);
  if (legacyHistory.length > 0) {
    const accounts = asArray(raw.accounts);
    const principal = accounts.find((a) => a.esCuentaPrincipal) || accounts.find((a) => a.activo) || accounts[0];
    const cuentaFallback = (typeof principal?._id === 'string' ? principal._id : 'default') as string;
    for (const h of legacyHistory) {
      const cuentaId = typeof h.cuenta === 'string' ? h.cuenta : typeof h.cuentaId === 'string' ? h.cuentaId : cuentaFallback;
      añadir(cuentaId, h.fecha, h.saldo, h.nota);
    }
  }
  // Ya importada: la clave deja de arrastrarse en el estado
  delete out.history;

  out.transacciones = transacciones;
  out.puntosControl = puntos.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));

  return out;
}
