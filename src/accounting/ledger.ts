// ── accounting/ledger ─────────────────────────────────────────────────────────
// Contabilidad real (F4, tareas 4.1 y 4.4). El ledger es el **source of truth
// del pasado**: el saldo real de una cuenta en una fecha es el último punto de
// control conocido más las transacciones posteriores hasta esa fecha.
//
// Precisión: todo se calcula en céntimos enteros, así que sumar miles de
// movimientos no arrastra error de coma flotante. Los euros solo aparecen en la
// frontera (entrada de formularios y presentación).
//
// PUENTE CON EL LEGACY: mientras la vista de cuentas siga siendo la legacy, los
// puntos de control se escriben también en `accounts[].historicoSaldos`, que es
// lo que leen el motor legacy y esa vista. Se retira al portarla (tarea 1.7).

import { todayISO, type ISODate } from '@/core/dates';
import { fromCents, toCents } from '@/core/money';
import type { AppState, PuntoControl, TipoTransaccion, Transaccion } from '@/state/schema';

/** Claves del estado que necesita el ledger. */
type LedgerKey = 'transacciones' | 'puntosControl' | 'accounts';

export interface LedgerStoreLike {
  get<K extends LedgerKey>(key: K): AppState[K];
  set<K extends LedgerKey>(key: K, value: AppState[K]): void;
}

export interface NuevaTransaccion {
  fecha: ISODate;
  cuentaId: string;
  /** Importe en euros, SIN signo. El signo lo determina `tipo`. */
  importe: number;
  concepto: string;
  tags?: string[];
  estimacionId?: string | null;
  tipo: TipoTransaccion;
  origen?: 'manual' | 'importado';
  nota?: string;
  /** Solo para 'ajuste': permite importe negativo explícito. */
  negativo?: boolean;
}

export interface FiltroTransacciones {
  cuentaId?: string;
  desde?: ISODate;
  hasta?: ISODate;
  tags?: string[];
  tipo?: TipoTransaccion;
  estimacionId?: string;
  /** Búsqueda por texto en el concepto (case-insensitive). */
  texto?: string;
}

/** Signo canónico de una transacción según su tipo. */
export function importeConSigno(tipo: TipoTransaccion, importeEuros: number, negativo = false): number {
  const abs = Math.abs(toCents(importeEuros));
  if (tipo === 'ingreso') return abs;
  if (tipo === 'gasto') return -abs;
  return negativo ? -abs : abs; // ajuste
}

export function createLedger(store: LedgerStoreLike) {
  function uid(prefijo: string): string {
    return `${prefijo}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }

  // ── Transacciones ───────────────────────────────────────────────────────────

  function transacciones(filtro: FiltroTransacciones = {}): Transaccion[] {
    const texto = filtro.texto?.trim().toLowerCase();
    return store
      .get('transacciones')
      .filter((t) => {
        if (filtro.cuentaId && t.cuentaId !== filtro.cuentaId) return false;
        if (filtro.desde && t.fecha < filtro.desde) return false;
        if (filtro.hasta && t.fecha > filtro.hasta) return false;
        if (filtro.tipo && t.tipo !== filtro.tipo) return false;
        if (filtro.estimacionId && t.estimacionId !== filtro.estimacionId) return false;
        if (filtro.tags && filtro.tags.length > 0 && !filtro.tags.some((tag) => t.tags.includes(tag))) return false;
        if (texto && !t.concepto.toLowerCase().includes(texto)) return false;
        return true;
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a._id.localeCompare(b._id));
  }

  function registrar(entrada: NuevaTransaccion): Transaccion {
    const tx: Transaccion = {
      _id: uid('tx'),
      fecha: entrada.fecha,
      cuentaId: entrada.cuentaId,
      importeCts: importeConSigno(entrada.tipo, entrada.importe, entrada.negativo),
      concepto: entrada.concepto,
      tags: entrada.tags ?? [],
      estimacionId: entrada.estimacionId ?? null,
      tipo: entrada.tipo,
      origen: entrada.origen ?? 'manual',
      ...(entrada.nota ? { nota: entrada.nota } : {}),
    };
    store.set('transacciones', [...store.get('transacciones'), tx]);
    return tx;
  }

  function actualizar(id: string, patch: Partial<Omit<Transaccion, '_id'>> & { importe?: number }): void {
    store.set(
      'transacciones',
      store.get('transacciones').map((t) => {
        if (t._id !== id) return t;
        const { importe, ...resto } = patch;
        const siguiente = { ...t, ...resto };
        if (importe !== undefined) {
          siguiente.importeCts = importeConSigno(siguiente.tipo, importe, siguiente.importeCts < 0);
        }
        return siguiente;
      }),
    );
  }

  function eliminar(id: string): void {
    store.set(
      'transacciones',
      store.get('transacciones').filter((t) => t._id !== id),
    );
  }

  /** Asigna (o desasigna) la estimación relacionada de una transacción. */
  function asignarEstimacion(id: string, estimacionId: string | null): void {
    actualizar(id, { estimacionId });
  }

  // ── Puntos de control ───────────────────────────────────────────────────────

  function puntosControl(cuentaId?: string): PuntoControl[] {
    return store
      .get('puntosControl')
      .filter((p) => !cuentaId || p.cuentaId === cuentaId)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  /**
   * Registra un saldo real conocido. Reemplaza el punto de esa cuenta y fecha si
   * ya existía, para que no haya dos verdades el mismo día.
   */
  function registrarPuntoControl(cuentaId: string, fecha: ISODate, saldoEuros: number, nota?: string): PuntoControl {
    const punto: PuntoControl = {
      _id: uid('pc'),
      fecha,
      cuentaId,
      saldoCts: toCents(saldoEuros),
      ...(nota ? { nota } : {}),
    };
    const resto = store.get('puntosControl').filter((p) => !(p.cuentaId === cuentaId && p.fecha === fecha));
    store.set(
      'puntosControl',
      [...resto, punto].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    );
    sincronizarConLegacy(cuentaId);
    return punto;
  }

  function eliminarPuntoControl(id: string): void {
    const punto = store.get('puntosControl').find((p) => p._id === id);
    store.set(
      'puntosControl',
      store.get('puntosControl').filter((p) => p._id !== id),
    );
    if (punto) sincronizarConLegacy(punto.cuentaId);
  }

  /**
   * Puente temporal: replica los puntos de control en
   * `accounts[].historicoSaldos`, que es lo que leen el motor y la vista legacy.
   * Se elimina al portar la vista de cuentas (tarea 1.7).
   */
  function sincronizarConLegacy(cuentaId: string): void {
    const puntos = puntosControl(cuentaId);
    const accounts = store.get('accounts');
    if (!accounts.some((a) => a._id === cuentaId)) return;
    store.set(
      'accounts',
      accounts.map((a) =>
        a._id === cuentaId
          ? {
              ...a,
              historicoSaldos: puntos.map((p) => ({
                _id: p._id,
                fecha: p.fecha,
                saldo: fromCents(p.saldoCts),
                ...(p.nota ? { nota: p.nota } : {}),
              })),
            }
          : a,
      ),
    );
  }

  // ── Saldos derivados (el ledger manda en el pasado) ─────────────────────────

  /**
   * Saldo real de una cuenta en una fecha, en céntimos: último punto de control
   * en o antes de `fecha`, más las transacciones entre ese punto y `fecha`.
   * Si no hay ningún punto de control previo, arranca de 0 y suma lo que haya.
   */
  function saldoCuentaCts(cuentaId: string, fecha: ISODate = todayISO()): number {
    const punto = puntosControl(cuentaId)
      .filter((p) => p.fecha <= fecha)
      .pop();
    const desde = punto?.fecha;
    const base = punto?.saldoCts ?? 0;
    const movimientos = store
      .get('transacciones')
      .filter((t) => t.cuentaId === cuentaId && t.fecha <= fecha && (desde === undefined || t.fecha > desde));
    return movimientos.reduce((s, t) => s + t.importeCts, base);
  }

  function saldoCuenta(cuentaId: string, fecha?: ISODate): number {
    return fromCents(saldoCuentaCts(cuentaId, fecha));
  }

  /** Saldo total de un conjunto de cuentas (todas las activas si se omite). */
  function saldoTotal(fecha: ISODate = todayISO(), cuentaIds?: string[]): number {
    const ids =
      cuentaIds ??
      store
        .get('accounts')
        .filter((a) => a.activo)
        .map((a) => a._id);
    return fromCents(ids.reduce((s, id) => s + saldoCuentaCts(id, fecha), 0));
  }

  /** ¿Hay algún dato real registrado? Sirve para decidir qué mostrar en la UI. */
  function tieneDatos(): boolean {
    return store.get('transacciones').length > 0 || store.get('puntosControl').length > 0;
  }

  /** Fecha del último movimiento o punto de control registrado. */
  function ultimaFecha(): ISODate | null {
    const fechas = [...store.get('transacciones').map((t) => t.fecha), ...store.get('puntosControl').map((p) => p.fecha)];
    return fechas.length > 0 ? (fechas.sort().pop() ?? null) : null;
  }

  // ── Agregados para el análisis ──────────────────────────────────────────────

  /** Total real (en euros, con signo) del filtro dado. */
  function total(filtro: FiltroTransacciones = {}): number {
    return fromCents(transacciones(filtro).reduce((s, t) => s + t.importeCts, 0));
  }

  /** Suma por mes ('YYYY-MM') del filtro dado, en euros con signo. */
  function totalPorMes(filtro: FiltroTransacciones = {}): Map<string, number> {
    const acc = new Map<string, number>();
    for (const t of transacciones(filtro)) {
      const mes = t.fecha.slice(0, 7);
      acc.set(mes, (acc.get(mes) ?? 0) + t.importeCts);
    }
    return new Map([...acc.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([mes, cts]) => [mes, fromCents(cts)]));
  }

  /** Suma por etiqueta, en euros con signo. Una transacción cuenta en cada tag. */
  function totalPorTag(filtro: FiltroTransacciones = {}): Map<string, number> {
    const acc = new Map<string, number>();
    for (const t of transacciones(filtro)) {
      for (const tag of t.tags.length > 0 ? t.tags : ['sin_tag']) {
        acc.set(tag, (acc.get(tag) ?? 0) + t.importeCts);
      }
    }
    return new Map([...acc.entries()].map(([tag, cts]) => [tag, fromCents(cts)]));
  }

  return {
    transacciones,
    registrar,
    actualizar,
    eliminar,
    asignarEstimacion,
    puntosControl,
    registrarPuntoControl,
    eliminarPuntoControl,
    saldoCuenta,
    saldoCuentaCts,
    saldoTotal,
    tieneDatos,
    ultimaFecha,
    total,
    totalPorMes,
    totalPorTag,
  };
}

export type Ledger = ReturnType<typeof createLedger>;
