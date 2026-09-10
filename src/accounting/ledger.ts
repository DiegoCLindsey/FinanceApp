// ── accounting/ledger ─────────────────────────────────────────────────────────
// Contabilidad real (F4, tareas 4.1 y 4.4). El ledger es el **source of truth
// del pasado**: el saldo real de una cuenta en una fecha es el último punto de
// control conocido más las transacciones posteriores hasta esa fecha.
//
// Precisión: todo se calcula en céntimos enteros, así que sumar miles de
// movimientos no arrastra error de coma flotante. Los euros solo aparecen en la
// frontera (entrada de formularios y presentación).
//
// PUENTE CON EL LEGACY: los puntos de control se replican en
// `accounts[].historicoSaldos`, que es de donde el motor legacy
// (`finance-math.js`) y el dashboard sacan el saldo real de una cuenta. Desde
// que la vista de cuentas está portada (1.7) este ledger es el ÚNICO escritor
// del campo; el puente se retira cuando el dashboard deje de leerlo.

import { finDeSemana, sumarDias, todayISO, type ISODate } from '@/core/dates';
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
   * Los puntos que de verdad ANCLAN el saldo: los manuales (los dijo el banco).
   * Los derivados son curva para el histórico, no una fuente de verdad — ver
   * `PuntoControl.origen` y `generarPuntosSemanales`.
   */
  function anclas(cuentaId: string): PuntoControl[] {
    return puntosControl(cuentaId).filter((p) => p.origen !== 'derivado');
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
    // Un ancla nueva cambia el saldo de todas las semanas siguientes, así que
    // la curva semanal se recalcula: si no, quedarían puntos derivados de un
    // saldo que el banco acaba de desmentir.
    generarPuntosSemanales(cuentaId);
    return punto;
  }

  function eliminarPuntoControl(id: string): void {
    const punto = store.get('puntosControl').find((p) => p._id === id);
    store.set(
      'puntosControl',
      store.get('puntosControl').filter((p) => p._id !== id),
    );
    if (!punto) return;
    if (punto.origen === 'derivado') sincronizarConLegacy(punto.cuentaId);
    else generarPuntosSemanales(punto.cuentaId); // ya sincroniza con el legacy
  }

  /**
   * Borra los puntos de control MANUALES de una cuenta dentro de un rango de
   * fechas. Lo usa la importación de extractos (F4): un extracto real es más
   * fiable que un punto tecleado a ojo, así que un checkpoint manual que caiga
   * dentro del periodo recién importado queda obsoleto — mandar ahí seguiría
   * ignorando los movimientos reales que ya se han traído para esas fechas.
   * Los puntos fuera del rango (el ancla de antes del extracto, o saldos
   * posteriores) no se tocan. Devuelve cuántos se han borrado.
   */
  function eliminarPuntosControlEnRango(cuentaId: string, desde: ISODate, hasta: ISODate): number {
    const enRango = (p: PuntoControl) => p.cuentaId === cuentaId && p.origen !== 'derivado' && p.fecha >= desde && p.fecha <= hasta;
    const afectados = store.get('puntosControl').filter(enRango).length;
    if (afectados === 0) return 0;
    store.set(
      'puntosControl',
      store.get('puntosControl').filter((p) => !enRango(p)),
    );
    sincronizarConLegacy(cuentaId);
    return afectados;
  }

  /**
   * Rellena el histórico de una cuenta con UN punto por semana, calculado del
   * ledger: el saldo al cierre (domingo) de cada semana con datos.
   *
   * Por qué: `historicoSaldos` es lo que dibuja la línea de histórico del
   * dashboard, y ahí cada entrada es un punto de la curva — sin sumar los
   * movimientos posteriores (`saldoEnFecha` en core/accounts). Con un único
   * punto (el último saldo real conocido) el pasado entero salía plano: la
   * curva no existía. Un punto por semana da la forma real del saldo sin
   * inflar el histórico con un punto por movimiento.
   *
   * Reglas:
   *  · una semana con punto MANUAL ya tiene su punto — no se le añade otro
   *    («un único punto por semana»), y el manual sigue mandando;
   *  · se cubren TODAS las semanas entre el primer y el último MOVIMIENTO de
   *    la cuenta, que son todas las que aportan algo: sin movimientos no hay
   *    curva que reconstruir, solo saldos sueltos que el usuario ya tecleó;
   *  · la última semana, si está a medias, se cierra en el último día con
   *    datos en vez de en un domingo que aún no ha llegado;
   *  · los derivados anteriores se reemplazan, así que llamar dos veces no
   *    duplica nada y siempre refleja los movimientos de ahora mismo.
   *
   * Devuelve cuántos puntos semanales ha dejado escritos.
   */
  function generarPuntosSemanales(cuentaId: string): number {
    const manuales = anclas(cuentaId);
    const movimientos = store
      .get('transacciones')
      .filter((t) => t.cuentaId === cuentaId)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    const primera = movimientos[0]?.fecha;
    const ultima = movimientos[movimientos.length - 1]?.fecha;

    // Sin movimientos no hay curva que dibujar; se limpian los derivados de
    // antes. El puente con el legacy se rehace SIEMPRE, también en este atajo:
    // quien llama (registrar un punto manual, por ejemplo) cuenta con que al
    // volver de aquí `historicoSaldos` ya está al día.
    const sinDerivados = store.get('puntosControl').filter((p) => !(p.cuentaId === cuentaId && p.origen === 'derivado'));
    if (!primera) {
      store.set('puntosControl', sinDerivados);
      sincronizarConLegacy(cuentaId);
      return 0;
    }

    // Cierres de semana a cubrir: el domingo de cada semana desde la primera
    // fecha con datos, sin pasarse de la última (la semana en curso se cierra
    // en `ultima`).
    const cierres: ISODate[] = [];
    for (let f = finDeSemana(primera); f <= ultima; f = finDeSemana(sumarDias(f, 1))) cierres.push(f);
    if (cierres[cierres.length - 1] !== ultima) cierres.push(ultima);

    const semanasConManual = new Set(manuales.map((p) => finDeSemana(p.fecha)));

    // Mismo cálculo que `saldoCuentaCts`, pero sobre los arrays ya leídos: el
    // ancla manual más reciente hasta esa fecha más los movimientos de después.
    // Todo se calcula ANTES de escribir, así ningún punto recién creado puede
    // colarse como ancla del siguiente.
    const saldoEn = (fecha: ISODate): number => {
      const ancla = manuales.filter((p) => p.fecha <= fecha).pop();
      return movimientos
        .filter((t) => t.fecha <= fecha && (!ancla || t.fecha > ancla.fecha))
        .reduce((s, t) => s + t.importeCts, ancla?.saldoCts ?? 0);
    };

    const nuevos: PuntoControl[] = cierres
      .filter((cierre) => !semanasConManual.has(finDeSemana(cierre)))
      .map((cierre) => ({ _id: uid('pcd'), fecha: cierre, cuentaId, saldoCts: saldoEn(cierre), origen: 'derivado' as const }));

    store.set(
      'puntosControl',
      [...sinDerivados, ...nuevos].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    );
    moverArranqueSiTapa(cuentaId, primera, saldoEn(primera));
    sincronizarConLegacy(cuentaId);
    return nuevos.length;
  }

  /**
   * Retrasa el punto de arranque de la cuenta (`saldoInicial` en
   * `fechaInicialSaldo`) hasta el primer movimiento, si estaba por delante.
   *
   * Ese arranque no es un dato más: `saldoEnFecha` (core/accounts) descarta
   * todo punto del histórico anterior a él, y la gráfica del dashboard hace lo
   * mismo. Una cuenta creada hoy —o a la que se le haya dado a «Actualizar
   * saldo base»— arranca hoy, así que tapaba entera la curva semanal recién
   * calculada y el dashboard seguía anclando en aquel saldo en vez de en el
   * último conocido. Moviéndolo al primer movimiento se ve la curva completa y
   * el ancla pasa a ser el último punto real.
   */
  function moverArranqueSiTapa(cuentaId: string, primera: ISODate, saldoCtsEnPrimera: number): void {
    const accounts = store.get('accounts');
    const cuenta = accounts.find((a) => a._id === cuentaId);
    if (!cuenta || (cuenta.fechaInicialSaldo && cuenta.fechaInicialSaldo <= primera)) return;
    store.set(
      'accounts',
      accounts.map((a) => (a._id === cuentaId ? { ...a, saldoInicial: fromCents(saldoCtsEnPrimera), fechaInicialSaldo: primera } : a)),
    );
  }

  /** `generarPuntosSemanales` para varias cuentas (todas, si se omite). */
  function generarPuntosSemanalesTodas(cuentaIds?: string[]): number {
    const ids = cuentaIds ?? [...new Set(store.get('transacciones').map((t) => t.cuentaId))];
    return ids.reduce((s, id) => s + generarPuntosSemanales(id), 0);
  }

  /**
   * Repite el barrido de `eliminarPuntosControlEnRango` a mano, sobre el rango
   * real de fechas ya importadas de cada cuenta (o de una sola, si se indica),
   * sin tener que volver a subir el CSV. Sirve para limpiar históricos
   * manuales que se colaron después de importar (p.ej. un punto de control
   * tecleado por error, o datos importados antes de que este barrido
   * existiera). Deja además el histórico semanal al día en cada cuenta que
   * toca. Devuelve una fila por cuenta con datos importados.
   */
  function sincronizarHistoricoImportado(cuentaId?: string): { cuentaId: string; eliminados: number; semanales: number }[] {
    const importadas = store.get('transacciones').filter((t) => t.origen === 'importado' && (!cuentaId || t.cuentaId === cuentaId));
    const porCuenta = new Map<string, ISODate[]>();
    for (const t of importadas) {
      const fechas = porCuenta.get(t.cuentaId);
      if (fechas) fechas.push(t.fecha);
      else porCuenta.set(t.cuentaId, [t.fecha]);
    }
    const resultados: { cuentaId: string; eliminados: number; semanales: number }[] = [];
    for (const [cid, fechas] of porCuenta) {
      fechas.sort();
      const eliminados = eliminarPuntosControlEnRango(cid, fechas[0], fechas[fechas.length - 1]);
      resultados.push({ cuentaId: cid, eliminados, semanales: generarPuntosSemanales(cid) });
    }
    return resultados;
  }

  /**
   * Puente temporal: replica los puntos de control en
   * `accounts[].historicoSaldos`, que es lo que leen el motor legacy y el
   * dashboard. Se elimina al portar el dashboard (tarea 1.7).
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
    const punto = anclas(cuentaId)
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
    eliminarPuntosControlEnRango,
    sincronizarHistoricoImportado,
    generarPuntosSemanales,
    generarPuntosSemanalesTodas,
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
