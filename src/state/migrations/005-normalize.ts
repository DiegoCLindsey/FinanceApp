// ── Migración → v5 ────────────────────────────────────────────────────────────
// Normaliza cualquier estado anterior (v4 y previos, incluidos backups JSON) al
// esquema tipado de state/schema.ts:
//   · rellena los campos que falten con sus valores por defecto
//   · unifica `escenarioId` (singular) → `escenarioIds[]`
//   · normaliza el formato antiguo de `diaPago`
//   · deriva `modeloFondo` de `esFondoPension`
//   · elimina los restos de las features retiradas en 1.8: `varianza`,
//     `inflacion` por gasto, `config.inflacionGlobal`, `showMC` y `mcIteraciones`
//     (la colección `history` se preserva aquí y la consume la migración 006)
//   · garantiza una cuenta `default` y exactamente una cuenta principal
//   · añade `config.features` (feature flags, F2)

import { defaultAccount, defaultConfig, TRAMOS_AHORRO_FALLBACK, TRAMOS_IRPF_FALLBACK } from '../schema';
import type { MigrationContext, RawState } from './types';

type Obj = Record<string, unknown>;

const asArray = (v: unknown): Obj[] => (Array.isArray(v) ? (v as Obj[]) : []);
const asObj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {});

/** escenarioId (singular, legado) → escenarioIds[] */
function migrarEscenarioIds(item: Obj): Obj {
  if (Array.isArray(item.escenarioIds)) return item;
  const ids = item.escenarioId ? [item.escenarioId as string] : [];
  const { escenarioId: _drop, ...rest } = item;
  return { ...rest, escenarioIds: ids };
}

/** Formato antiguo de diaPago → 'dia:N' | 'dia:ultimo' | 'nthweekday:N:W' */
export function migrarDiaPago(v: unknown): string {
  if (!v || typeof v !== 'string') return '';
  if (v.startsWith('dia:') || v.startsWith('nthweekday:')) return v;
  if (v === 'ultimo') return 'dia:ultimo';
  if (v === 'primer-lunes') return 'nthweekday:1:1';
  const n = parseInt(v);
  return isNaN(n) ? '' : `dia:${n}`;
}

/** Quita las claves de features eliminadas en 1.8. */
function limpiarCamposRetirados(item: Obj): Obj {
  const { varianza: _v, inflacion: _i, ...rest } = item;
  return rest;
}

export function migrateTo5(raw: RawState, ctx: MigrationContext): RawState {
  const { hoyISO, finISO } = ctx;
  // Se parte del estado recibido y solo se sobrescribe lo que esta migración
  // normaliza. Es deliberado: construirlo desde cero descartaría colecciones que
  // esta versión no conoce (las de migraciones posteriores), y entonces importar
  // un backup nuevo declarándolo como v4 borraría datos del usuario.
  const out: Obj = { ...raw };

  // ── config ──────────────────────────────────────────────────────────────────
  const cfgIn = asObj(raw.config);
  const cfgDefaults = defaultConfig(hoyISO, finISO) as unknown as Obj;
  const cfg: Obj = { ...cfgDefaults };
  for (const [k, v] of Object.entries(cfgIn)) {
    if (v !== undefined && v !== null) cfg[k] = v;
  }
  // Campos obsoletos
  delete cfg.saldoInicial;
  delete cfg.saldoInicialFecha;
  delete cfg.inflacionGlobal;
  delete cfg.showMC;
  delete cfg.mcIteraciones;
  // Tablas fiscales: si venían vacías o corruptas, restaurar fallback
  if (!Array.isArray(cfg.tramos_irpf) || (cfg.tramos_irpf as unknown[]).length === 0) cfg.tramos_irpf = TRAMOS_IRPF_FALLBACK;
  if (!Array.isArray(cfg.tramosGananciasCapital) || (cfg.tramosGananciasCapital as unknown[]).length === 0)
    cfg.tramosGananciasCapital = TRAMOS_AHORRO_FALLBACK;
  if (!Array.isArray(cfg.saludRegla) || (cfg.saludRegla as unknown[]).length !== 3) cfg.saludRegla = [50, 30, 20];
  if (typeof cfg.features !== 'object' || cfg.features === null || Array.isArray(cfg.features)) cfg.features = {};
  out.config = cfg;

  // ── accounts ────────────────────────────────────────────────────────────────
  let accounts = asArray(raw.accounts).map((a) => {
    const base: Obj = {
      saldoInicial: 0,
      fechaInicialSaldo: hoyISO,
      historicoSaldos: [],
      interes: 0,
      periodoCobro: 'mensual',
      activo: true,
      simulacion: false,
      esCuentaPrincipal: false,
      aportaciones: [],
      planAportaciones: [],
      bloqueoMeses: 120,
      impuestoRetirada: 0,
      grupoNomina: '',
      ...a,
    };
    if (!base.modeloFondo) base.modeloFondo = base.esFondoPension ? 'pension' : 'cuenta';
    delete base.esFondoPension;
    if (!Array.isArray(base.historicoSaldos)) base.historicoSaldos = [];
    return migrarEscenarioIds(base);
  });
  if (accounts.length === 0) accounts = [defaultAccount(hoyISO) as unknown as Obj];
  // Exactamente una cuenta principal
  const principales = accounts.filter((a) => a.esCuentaPrincipal);
  if (principales.length === 0) {
    const target = accounts.find((a) => a._id === 'default') || accounts[0];
    accounts = accounts.map((a) => ({ ...a, esCuentaPrincipal: a._id === target._id }));
  } else if (principales.length > 1) {
    let visto = false;
    accounts = accounts.map((a) => {
      if (!a.esCuentaPrincipal) return a;
      if (!visto) {
        visto = true;
        return a;
      }
      return { ...a, esCuentaPrincipal: false };
    });
  }
  out.accounts = accounts;

  // ── expenses ────────────────────────────────────────────────────────────────
  out.expenses = asArray(raw.expenses).map((e) => {
    const base: Obj = { basico: false, activo: true, tags: [], historialPrecios: [], ...e };
    if (!Array.isArray(base.tags)) base.tags = [];
    if (!Array.isArray(base.historialPrecios)) base.historialPrecios = [];
    base.diaPago = migrarDiaPago(base.diaPago);
    return limpiarCamposRetirados(migrarEscenarioIds(base));
  });

  // ── loans ───────────────────────────────────────────────────────────────────
  out.loans = asArray(raw.loans).map((l) => {
    const base: Obj = {
      tipoTasa: 'fijo',
      mostrarFechaFinEnDashboard: true,
      basico: true,
      tags: [],
      activo: true,
      amortizaciones: [],
      ...l,
    };
    if (!Array.isArray(base.tags)) base.tags = [];
    base.diaPago = migrarDiaPago(base.diaPago);
    base.amortizaciones = asArray(base.amortizaciones).map((a) => migrarEscenarioIds(a));
    return limpiarCamposRetirados(migrarEscenarioIds(base));
  });

  // ── nominas ─────────────────────────────────────────────────────────────────
  out.nominas = asArray(raw.nominas).map((n) => {
    const base: Obj = {
      activo: true,
      nPagas: 12,
      irpfModo: 'auto',
      irpfPct: 0,
      bruto: 0,
      representacion: 'detallado',
      tags: [],
      fechaFin: null,
      cuenta: 'default',
      grupoNomina: '',
      mesActualizacionIPC: null,
      retribucionFlexible: [],
      ...n,
    };
    if (!Array.isArray(base.tags)) base.tags = [];
    if (!Array.isArray(base.retribucionFlexible)) base.retribucionFlexible = [];
    return limpiarCamposRetirados(migrarEscenarioIds(base));
  });

  // ── goals ───────────────────────────────────────────────────────────────────
  out.goals = asArray(raw.goals).map((g, i) => {
    const cuentaIds = Array.isArray(g.cuentaIds) ? g.cuentaIds : g.cuentaId ? [g.cuentaId] : [];
    const { cuentaId: _drop, ...rest } = g;
    return { prioridad: i + 1, completado: false, usarColchon: true, targetAmount: 0, ...rest, cuentaIds };
  });

  // ── colecciones simples ─────────────────────────────────────────────────────
  out.inflacion = asArray(raw.inflacion);
  out.tramosIRPFHistorico = asArray(raw.tramosIRPFHistorico);
  out.tramosGananciasCapitalHistorico = asArray(raw.tramosGananciasCapitalHistorico);
  // Escenarios: se descarta `inversiones` (modelo retirado, migrado a cuentas)
  out.escenarios = asArray(raw.escenarios).map(({ inversiones: _drop, ...e }) => e);

  // `history` sale del esquema (la colección se retiró en 1.8) pero sobrevive
  // aquí por el spread inicial, para que la migración 006 pueda importar esos
  // puntos al ledger de contabilidad; es ella la que finalmente la elimina.

  return out;
}
