// ── planner/simulador ─────────────────────────────────────────────────────────
// Motor de simulación del gestor de objetivos (§3.2 del documento).
//
// Puro y aislado: entra un `Plan`, sale un `ResultadoSimulacion`. Sin DOM, sin
// almacenamiento, sin reloj — el mes de arranque viene en el plan. Mismo input,
// mismo output, siempre.
//
// El valor del módulo está en el ENCADENAMIENTO: los objetivos compiten por el
// mismo flujo mensual y, cuando uno se completa, su cuota deja de reservarse y
// pasa sola al siguiente por prioridad. De ahí sale el efecto «en cuanto termine
// el coche, se acelera el colchón».

import { capitalParaRenta, cuotaNecesaria, rendimientoMensual } from './finanzas';
import type {
  AsignacionMes,
  Aviso,
  Centimos,
  EstadoObjetivo,
  Evento,
  Fase,
  FilaMensual,
  Hito,
  Mes,
  Objetivo,
  Plan,
  PropuestaAjuste,
  ResultadoSimulacion,
  Vehiculo,
} from './tipos';

// ── Utilidades de mes ─────────────────────────────────────────────────────────

/** Suma meses a un 'YYYY-MM'. Aritmética de calendario, sin objetos Date. */
export function sumarMeses(mes: Mes, n: number): Mes {
  const [a, m] = mes.split('-').map(Number);
  const total = a * 12 + (m - 1) + n;
  const año = Math.floor(total / 12);
  const mm = (total % 12) + 1;
  return `${año}-${String(mm).padStart(2, '0')}`;
}

/** Meses entre dos 'YYYY-MM'; negativo si `hasta` es anterior. */
export function diferenciaMeses(desde: Mes, hasta: Mes): number {
  const [a1, m1] = desde.split('-').map(Number);
  const [a2, m2] = hasta.split('-').map(Number);
  return (a2 - a1) * 12 + (m2 - m1);
}

const año = (mes: Mes): number => Number(mes.slice(0, 4));

// ── Importe efectivo de un objetivo ───────────────────────────────────────────

/**
 * Importe que hay que alcanzar.
 *
 * En INVERSION_PERPETUA puede venir derivado de la renta deseada en vez de
 * escrito a mano (§2.6); ahí manda la derivación, porque es lo que el usuario
 * está editando en la UI.
 */
export function importeObjetivoEfectivo(obj: Objetivo): Centimos {
  if (obj.rentaDeseada) return capitalParaRenta(obj.rentaDeseada).capitalNecesario;
  return obj.importeObjetivo ?? 0;
}

// ── Estado interno de la corrida ──────────────────────────────────────────────

interface EstadoObj {
  def: Objetivo;
  objetivo: Centimos;
  saldo: Centimos;
  estado: EstadoObjetivo;
  vehiculo: Vehiculo | undefined;
  /** Aportado en el año natural en curso, para el tope fiscal. */
  aportadoEnAño: number;
  añoEnCurso: number;
  /** Último importe que reclamó, para poder informar de la cuota liberada. */
  ultimaSolicitud: Centimos;
  /** Suma de lo reclamado y meses reclamando, para razonar sobre la MEDIA. */
  solicitadoAcumulado: Centimos;
  mesesReclamando: number;
}

const VEHICULO_POR_DEFECTO: Vehiculo = {
  _id: '__sin_vehiculo__',
  nombre: 'Sin vehículo',
  rentabilidadRealAnual: 0,
  liquidez: 'INMEDIATA',
  fiscalidadRetirada: 0,
  riesgo: 'NULO',
};

// ── Simulación ────────────────────────────────────────────────────────────────

export function simular(plan: Plan): ResultadoSimulacion {
  const horizonte = Math.max(0, Math.floor(plan.horizonteMeses));
  const vehiculos = new Map(plan.vehiculos.map((v) => [v._id, v]));

  const estados: EstadoObj[] = [...plan.objetivos]
    .sort((a, b) => a.prioridad - b.prioridad)
    .map((def) => ({
      def,
      objetivo: importeObjetivoEfectivo(def),
      saldo: def.saldoActual,
      // Un objetivo que ya nace cubierto no debería reclamar nada nunca. Ojo con
      // el importe 0: eso no es «cubierto», es un cubo sin meta (pensiones en
      // modo FIJO, fondo residual). Sin el `> 0` nacían completados y no
      // reclamaban nada en toda la simulación.
      estado:
        importeObjetivoEfectivo(def) > 0 && def.saldoActual >= importeObjetivoEfectivo(def) && def.modoAsignacion !== 'ABSORBE_RESIDUAL'
          ? 'COMPLETADO'
          : 'PENDIENTE',
      vehiculo: vehiculos.get(def.vehiculoId),
      aportadoEnAño: 0,
      añoEnCurso: año(plan.fechaInicio),
      ultimaSolicitud: 0,
      solicitadoAcumulado: 0,
      mesesReclamando: 0,
    }));

  const eventosPorMes = new Map<Mes, Evento[]>();
  for (const ev of plan.eventos) {
    const lista = eventosPorMes.get(ev.fecha) ?? [];
    lista.push(ev);
    eventosPorMes.set(ev.fecha, lista);
  }

  const serieMensual: FilaMensual[] = [];
  const hitos: Hito[] = [];
  const avisos: Aviso[] = [];

  let neto = plan.perfil.netoMensual;
  let gastos = plan.perfil.gastosFijosMensuales;
  let totalAportado = 0;
  let totalDisfrute = 0;
  const mesesConDeficit: { mes: Mes; deficit: Centimos }[] = [];

  for (let i = 0; i < horizonte; i++) {
    const mes = sumarMeses(plan.fechaInicio, i);
    const añoActual = año(mes);

    // 1 · Eventos del mes ────────────────────────────────────────────────────
    for (const ev of eventosPorMes.get(mes) ?? []) {
      if (ev.tipo === 'CAMBIO_INGRESOS') neto = ev.importe;
      else if (ev.tipo === 'CAMBIO_GASTOS_FIJOS') gastos = ev.importe;
      else if (ev.tipo === 'NUEVA_DEUDA') gastos += ev.importe;
      else if (ev.tipo === 'INYECCION_CAPITAL') {
        const destino = ev.objetivoDestinoId ? estados.find((e) => e.def._id === ev.objetivoDestinoId) : undefined;
        if (destino) {
          destino.saldo += ev.importe;
        } else {
          // Sin destino, la inyección entra como ingreso extraordinario del mes.
          neto += ev.importe;
        }
      }
    }

    // Reinicio del acumulado anual para los topes fiscales
    for (const e of estados) {
      if (e.añoEnCurso !== añoActual) {
        e.añoEnCurso = añoActual;
        e.aportadoEnAño = 0;
      }
    }

    // 2 · Capital disponible ─────────────────────────────────────────────────
    const sobrante = Math.max(0, neto - gastos);
    const disfrute = Math.round(sobrante * clamp01(plan.pctDisfrute));
    let disponible = sobrante - disfrute;
    const disponibleInicial = disponible;

    // 3 · Cascada de asignación ──────────────────────────────────────────────
    const activos = estados.filter((e) => e.estado !== 'COMPLETADO');
    const asignaciones: AsignacionMes[] = [];
    let solicitadoTotal = 0;

    // Los residuales se sirven al final, con lo que quede.
    const residuales = activos.filter((e) => e.def.modoAsignacion === 'ABSORBE_RESIDUAL');
    const reclamantes = activos.filter((e) => e.def.modoAsignacion !== 'ABSORBE_RESIDUAL');

    for (const e of reclamantes) {
      const solicitado = solicitud(e, mes, i, plan);
      e.ultimaSolicitud = solicitado;
      if (solicitado > 0) {
        e.solicitadoAcumulado += solicitado;
        e.mesesReclamando += 1;
      }
      // Solo cuentan como COMPROMISO los modos que fijan un importe. ABSORBE_TODO
      // reclama todo lo que le falta por definición: contarlo como déficit
      // marcaría inviable cualquier plan con una amortización pendiente.
      if (e.def.modoAsignacion === 'CUOTA_POR_FECHA' || e.def.modoAsignacion === 'FIJO') solicitadoTotal += solicitado;

      const asignado = Math.max(0, Math.min(solicitado, disponible));
      disponible -= asignado;
      e.saldo += asignado;
      e.aportadoEnAño += asignado;
      totalAportado += asignado;
      if (asignado > 0 && e.estado === 'PENDIENTE') e.estado = 'EN_CURSO';

      asignaciones.push({ objetivoId: e.def._id, asignado, solicitado, saldoTrasMes: e.saldo });
    }

    // Residual: se reparte lo que quede, por peso.
    if (residuales.length > 0 && disponible > 0) {
      const pesos = residuales.map((e) => Math.max(0, e.def.pesoResidual ?? 1));
      const suma = pesos.reduce((s, p) => s + p, 0) || residuales.length;
      let repartido = 0;
      residuales.forEach((e, idx) => {
        // El último se lleva el resto, para que no se pierdan céntimos al dividir.
        const parte = idx === residuales.length - 1 ? disponible - repartido : Math.floor((disponible * pesos[idx]) / suma);
        repartido += parte;
        e.saldo += parte;
        e.aportadoEnAño += parte;
        totalAportado += parte;
        if (parte > 0 && e.estado === 'PENDIENTE') e.estado = 'EN_CURSO';
        asignaciones.push({ objetivoId: e.def._id, asignado: parte, solicitado: 0, saldoTrasMes: e.saldo });
      });
      disponible -= repartido;
    } else {
      for (const e of residuales) {
        asignaciones.push({ objetivoId: e.def._id, asignado: 0, solicitado: 0, saldoTrasMes: e.saldo });
      }
    }

    // Déficit: lo pedido no cabe en lo disponible.
    if (solicitadoTotal > disponibleInicial) {
      mesesConDeficit.push({ mes, deficit: solicitadoTotal - disponibleInicial });
    }

    // 4 · Rentabilidad del mes ───────────────────────────────────────────────
    for (const e of estados) {
      if (e.saldo <= 0) continue;
      e.saldo += rendimientoMensual(e.saldo, e.vehiculo?.rentabilidadRealAnual ?? 0);
    }

    // 5 · Estados: quien llega, completa y libera su cuota ───────────────────
    for (const e of estados) {
      if (e.estado === 'COMPLETADO') continue;
      // El residual no se «completa»: es un cubo, no una meta con importe.
      if (e.def.modoAsignacion === 'ABSORBE_RESIDUAL' && e.objetivo <= 0) continue;
      if (e.objetivo > 0 && e.saldo >= e.objetivo) {
        e.estado = 'COMPLETADO';
        hitos.push({
          objetivoId: e.def._id,
          nombre: e.def.nombre,
          mes,
          indice: i,
          importeFinal: e.saldo,
          cuotaLiberada: e.ultimaSolicitud,
        });
      }
    }

    // Los ya completados también salen en la fila, con 0. La serie mensual
    // alimenta la tabla y el CSV: si las columnas aparecen y desaparecen según
    // se van completando objetivos, no hay tabla que valga.
    for (const e of estados) {
      if (!asignaciones.some((a) => a.objetivoId === e.def._id)) {
        asignaciones.push({ objetivoId: e.def._id, asignado: 0, solicitado: 0, saldoTrasMes: e.saldo });
      }
    }

    const patrimonioTotal = estados.reduce((s, e) => s + e.saldo, 0);
    totalDisfrute += disfrute;

    serieMensual.push({
      indice: i,
      mes,
      netoMensual: neto,
      gastosFijos: gastos,
      sobrante,
      disfrute,
      disponible: disponibleInicial,
      sinAsignar: disponible,
      asignaciones: asignaciones.sort((a, b) => orden(estados, a.objetivoId) - orden(estados, b.objetivoId)),
      patrimonioTotal,
    });

    // Todos completados: no hay más que simular. Con la lista vacía `every` es
    // true, así que un plan sin objetivos se cortaba en el primer mes.
    if (estados.length > 0 && estados.every((e) => e.estado === 'COMPLETADO')) break;
  }

  // ── Avisos y propuestas (§3.3) ──────────────────────────────────────────────
  const propuestas: PropuestaAjuste[] = [];

  if (mesesConDeficit.length > 0) {
    const deficitMedio = Math.round(mesesConDeficit.reduce((s, d) => s + d.deficit, 0) / mesesConDeficit.length);
    avisos.push({
      severidad: 'error',
      codigo: 'INVIABLE',
      mensaje:
        `El plan no cabe en el flujo de caja durante ${mesesConDeficit.length} mes${mesesConDeficit.length !== 1 ? 'es' : ''} ` +
        `(desde ${mesesConDeficit[0].mes}). Déficit medio: ${(deficitMedio / 100).toFixed(2)} €/mes.`,
      mes: mesesConDeficit[0].mes,
      deficitMensual: deficitMedio,
    });

    // Los que no llegan a tiempo se marcan, para que la UI los señale
    for (const e of estados) {
      if (e.estado !== 'COMPLETADO' && e.def.fechaLimite && e.def.modoAsignacion === 'CUOTA_POR_FECHA') {
        e.estado = 'INVIABLE';
      }
    }

    propuestas.push(...proponerAjustes(estados, plan, deficitMedio));
  }

  // Topes fiscales rebasados
  for (const e of estados) {
    const tope = e.vehiculo?.topeAportacionAnual;
    if (tope && e.def.modoAsignacion === 'FIJO' && (e.def.importeFijoMensual ?? 0) * 12 > tope) {
      avisos.push({
        severidad: 'atencion',
        codigo: 'TOPE_FISCAL',
        objetivoId: e.def._id,
        mensaje:
          `«${e.def.nombre}» pide ${((e.def.importeFijoMensual ?? 0) / 100).toFixed(2)} €/mes, que supera el tope anual ` +
          `de ${(tope / 100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`,
      });
    }
  }

  // Objetivos que no llegan dentro del horizonte
  for (const e of estados) {
    if (e.estado !== 'COMPLETADO' && e.objetivo > 0 && e.def.modoAsignacion !== 'ABSORBE_RESIDUAL') {
      avisos.push({
        severidad: 'atencion',
        codigo: 'NUNCA_COMPLETADO',
        objetivoId: e.def._id,
        mensaje: `«${e.def.nombre}» no se completa dentro del horizonte de ${horizonte} meses.`,
      });
    }
  }

  const perpetuo = estados.find((e) => e.def.tipo === 'INVERSION_PERPETUA');
  const hitoPerpetuo = perpetuo ? hitos.find((h) => h.objetivoId === perpetuo.def._id) : undefined;

  const patrimonioPorVehiculo: Record<string, Centimos> = {};
  for (const e of estados) {
    const v = e.vehiculo?._id ?? VEHICULO_POR_DEFECTO._id;
    patrimonioPorVehiculo[v] = (patrimonioPorVehiculo[v] ?? 0) + e.saldo;
  }

  const estadoFinal: Record<string, EstadoObjetivo> = {};
  for (const e of estados) estadoFinal[e.def._id] = e.estado;

  return {
    viable: mesesConDeficit.length === 0,
    mesesSimulados: serieMensual.length,
    serieMensual,
    hitos,
    fases: derivarFases(serieMensual, hitos),
    avisos,
    propuestas,
    estadoFinal,
    resumen: {
      patrimonioFinal: estados.reduce((s, e) => s + e.saldo, 0),
      patrimonioPorVehiculo,
      totalAportado,
      totalDisfrute,
      mesIndependencia: hitoPerpetuo?.mes ?? null,
    },
  };
}

// ── Piezas ────────────────────────────────────────────────────────────────────

const clamp01 = (v: number): number => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

const orden = (estados: EstadoObj[], id: string): number => estados.findIndex((e) => e.def._id === id);

/** Cuánto reclama un objetivo este mes, según su modo (§2.4). */
function solicitud(e: EstadoObj, mes: Mes, indice: number, plan: Plan): Centimos {
  const falta = Math.max(0, e.objetivo - e.saldo);

  switch (e.def.modoAsignacion) {
    case 'ABSORBE_TODO':
      // Todo lo que quede, hasta completarse. El mínimo con `falta` evita que se
      // pase de largo y se coma capital que el siguiente objetivo necesita.
      return falta;

    case 'FIJO': {
      const base = e.def.importeFijoMensual ?? 0;
      const tope = e.vehiculo?.topeAportacionAnual;
      if (!tope) return e.objetivo > 0 ? Math.min(base, falta) : base;
      // Política del tope: se aporta hasta agotarlo y se reanuda en enero. Es
      // más fiel a cómo funciona la desgravación que prorratear el año entero.
      const margen = Math.max(0, tope - e.aportadoEnAño);
      const pedido = Math.min(base, margen);
      return e.objetivo > 0 ? Math.min(pedido, falta) : pedido;
    }

    case 'CUOTA_POR_FECHA': {
      if (falta <= 0) return 0;
      // Se RECALCULA cada mes con el saldo real: si un mes fue sobrado, este
      // pide menos. Es la auto-corrección del §2.4.
      const restantes = e.def.fechaLimite ? diferenciaMeses(mes, e.def.fechaLimite) : plan.horizonteMeses - indice;
      return cuotaNecesaria(e.objetivo, e.saldo, Math.max(0, restantes), e.vehiculo?.rentabilidadRealAnual ?? 0);
    }

    default:
      return 0;
  }
}

/** Tramos entre hitos, con los objetivos que estaban recibiendo dinero (§4). */
function derivarFases(serie: FilaMensual[], hitos: Hito[]): Fase[] {
  if (serie.length === 0) return [];
  const cortes = [...new Set(hitos.map((h) => h.indice))].sort((a, b) => a - b);
  const limites = [0, ...cortes.map((c) => c + 1)].filter((v, idx, arr) => arr.indexOf(v) === idx && v < serie.length);

  const fases: Fase[] = [];
  for (let k = 0; k < limites.length; k++) {
    const desdeIdx = limites[k];
    const hastaIdx = (k + 1 < limites.length ? limites[k + 1] : serie.length) - 1;
    if (hastaIdx < desdeIdx) continue;
    const activos = new Set<string>();
    for (let m = desdeIdx; m <= hastaIdx; m++) {
      for (const a of serie[m].asignaciones) if (a.asignado > 0) activos.add(a.objetivoId);
    }
    fases.push({
      desde: serie[desdeIdx].mes,
      hasta: serie[hastaIdx].mes,
      meses: hastaIdx - desdeIdx + 1,
      objetivosActivos: [...activos],
    });
  }
  return fases;
}

/**
 * Propuestas cuantificadas para volver a hacer viable el plan (§3.3).
 *
 * No basta con decir «no cabe»: hay que decir cuánto hay que mover y de dónde.
 */
function proponerAjustes(estados: EstadoObj[], plan: Plan, deficitMensual: Centimos): PropuestaAjuste[] {
  const propuestas: PropuestaAjuste[] = [];

  // a) Bajar el disfrute. Es la palanca más directa: sale del mismo sobrante.
  const sobrante = Math.max(0, plan.perfil.netoMensual - plan.perfil.gastosFijosMensuales);
  if (sobrante > 0 && plan.pctDisfrute > 0) {
    const puntos = Math.ceil(Math.min(plan.pctDisfrute, deficitMensual / sobrante) * 100);
    if (puntos > 0) {
      const actual = Math.round(plan.pctDisfrute * 100);
      propuestas.push({
        clase: 'REDUCIR_DISFRUTE',
        magnitud: puntos,
        mensaje: `Bajar el disfrute ${puntos} punto${puntos !== 1 ? 's' : ''} (del ${actual} % al ${Math.max(0, actual - puntos)} %) libera ${(Math.min(deficitMensual, sobrante * plan.pctDisfrute) / 100).toFixed(0)} €/mes.`,
      });
    }
  }

  // b) y c) sobre el objetivo con fecha que más aprieta.
  //
  // Se mide por la cuota MEDIA reclamada, no por la del último mes: el último
  // mes de un objetivo con fecha es el pago de recuperación y sale anormalmente
  // alto, lo que descuadraba por completo el cálculo del retraso necesario.
  const conFecha = estados.filter((e) => e.def.modoAsignacion === 'CUOTA_POR_FECHA' && e.def.fechaLimite && e.estado !== 'COMPLETADO');
  const media = (e: EstadoObj) => (e.mesesReclamando > 0 ? e.solicitadoAcumulado / e.mesesReclamando : 0);
  const masCaro = [...conFecha].sort((a, b) => media(b) - media(a))[0];

  if (masCaro) {
    const falta = Math.max(0, masCaro.objetivo - masCaro.saldo);
    const cuotaMedia = media(masCaro);
    const mesesActuales = Math.max(1, diferenciaMeses(plan.fechaInicio, masCaro.def.fechaLimite as Mes));

    // Cuánto de ese objetivo cabe de verdad en el flujo
    const cuotaAsumible = Math.max(1, cuotaMedia - deficitMensual);
    const mesesNecesarios = Math.ceil(falta / cuotaAsumible);
    const retraso = Math.max(1, mesesNecesarios - mesesActuales);
    propuestas.push({
      clase: 'RETRASAR_FECHA',
      objetivoId: masCaro.def._id,
      magnitud: retraso,
      mensaje: `Retrasar «${masCaro.def.nombre}» ${retraso} mes${retraso !== 1 ? 'es' : ''}, hasta ${sumarMeses(masCaro.def.fechaLimite as Mes, retraso)}, baja su cuota a lo que cabe en el flujo.`,
    });

    // Recortar el importe: el déficit repartido sobre los meses que quedan.
    const reduccion = Math.min(Math.round(deficitMensual * mesesActuales), Math.max(0, masCaro.objetivo - 1));
    if (reduccion > 0) {
      propuestas.push({
        clase: 'REDUCIR_IMPORTE',
        objetivoId: masCaro.def._id,
        magnitud: reduccion,
        mensaje: `O reducir «${masCaro.def.nombre}» en ${(reduccion / 100).toFixed(0)} €, de ${(masCaro.objetivo / 100).toFixed(0)} € a ${((masCaro.objetivo - reduccion) / 100).toFixed(0)} €.`,
      });
    }
  }

  if (conFecha.length > 1) {
    propuestas.push({
      clase: 'REORDENAR',
      magnitud: conFecha.length,
      mensaje: `Hay ${conFecha.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`,
    });
  }

  // Un plan inviable SIEMPRE tiene que salir con algo accionable. Si ningún
  // objetivo con fecha lo provocó (por ejemplo, todo el déficit viene de
  // aportaciones FIJO), al menos se dice cuánto falta.
  if (propuestas.length === 0) {
    propuestas.push({
      clase: 'REDUCIR_IMPORTE',
      magnitud: deficitMensual,
      mensaje: `Faltan ${(deficitMensual / 100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`,
    });
  }

  return propuestas;
}
