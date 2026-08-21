// ── planner/tipos ─────────────────────────────────────────────────────────────
// Modelo de dominio del gestor de objetivos financieros (§2 del documento).
//
// Todos los importes son CÉNTIMOS ENTEROS. Todas las rentabilidades son REALES
// (nominal − inflación) y anuales en tanto por uno: 0.05 = 5 %.
//
// Reutilización frente a lo que ya existe en la aplicación:
//   · `Vehiculo.cuentaId` apunta a una `Account` del estado. Una cuenta ya trae
//     `interes`, `bloqueoMeses` e `impuestoRetirada`, así que el vehículo solo
//     añade lo que falta y no duplica lo que ya está.
//   · `Vehiculo.prestamoId` apunta a un `Loan`: en AMORTIZAR_DEUDA la
//     "rentabilidad" es el TIN evitado.
//   · `PerfilFinanciero` se deriva de nóminas y gastos básicos, con override.

import type { Centimos, TasaAnual } from './finanzas';

export type { Centimos, TasaAnual };

/** 'YYYY-MM'. El planificador razona en meses, no en días. */
export type Mes = string;

// ── Vehículos (§2.5) ──────────────────────────────────────────────────────────

export type Liquidez = 'INMEDIATA' | 'MEDIA' | 'BLOQUEADA_HASTA_JUBILACION';
export type Riesgo = 'NULO' | 'BAJO' | 'MEDIO' | 'ALTO';

export interface Vehiculo {
  _id: string;
  nombre: string;
  rentabilidadRealAnual: TasaAnual;
  liquidez: Liquidez;
  /** Tipo efectivo estimado sobre la plusvalía al retirar. 0.19 = 19 %. */
  fiscalidadRetirada: number;
  /** Tope legal de aportación anual, en céntimos. 1.500 € en pensiones. */
  topeAportacionAnual?: Centimos | null;
  riesgo: Riesgo;
  /** Cuenta de la aplicación de la que sale este vehículo, si la hay. */
  cuentaId?: string | null;
  /** Préstamo al que amortiza, en vehículos de deuda. */
  prestamoId?: string | null;
  /**
   * Amortizar deuda no es invertir, pero rinde: el TIN que dejas de pagar es un
   * retorno garantizado, y por eso suele encabezar la prioridad. Se marca para
   * que la UI pueda explicarlo, porque es contraintuitivo (§2.5).
   */
  esDeuda?: boolean;
  /**
   * La rentabilidad vino de una fuente NOMINAL (el `interes` de una cuenta) y
   * nadie la ha revisado todavía. La UI avisa mientras esté puesta; se quita al
   * guardar el vehículo desde el formulario, que sí explica la diferencia.
   */
  revisarRentabilidad?: boolean;
}

// ── Objetivos (§2.3, §2.4) ────────────────────────────────────────────────────

export type TipoObjetivo = 'AMORTIZAR_DEUDA' | 'AHORRO_OBJETIVO' | 'INVERSION_PERPETUA' | 'APORTACION_FIJA';

/**
 * Cómo pide dinero cada objetivo en la cascada mensual.
 *
 * · CUOTA_POR_FECHA — el PMT necesario para llegar a tiempo, RECALCULADO cada
 *   mes con el saldo real. Si un mes va sobrado, el siguiente pide menos.
 * · ABSORBE_TODO — reclama todo lo disponible hasta completarse.
 * · ABSORBE_RESIDUAL — no reclama; recibe lo que sobre.
 * · FIJO — importe fijo mensual, con tope anual opcional.
 */
export type ModoAsignacion = 'CUOTA_POR_FECHA' | 'ABSORBE_TODO' | 'ABSORBE_RESIDUAL' | 'FIJO';

export type EstadoObjetivo = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'INVIABLE';

/** Derivación del capital a partir de la renta deseada (§2.6). */
export interface RentaDeseada {
  rentaNetaMensual: Centimos;
  /** SWR anual. 0.04 = 4 %. */
  tasaRetiroSeguro: number;
  tipoFiscalEfectivo: number;
}

export interface Objetivo {
  _id: string;
  nombre: string;
  tipo: TipoObjetivo;
  /** Nulo solo en INVERSION_PERPETUA cuando se deriva de `rentaDeseada`. */
  importeObjetivo: Centimos | null;
  /** Null = «lo antes posible». */
  fechaLimite?: Mes | null;
  /** Orden en la cascada; menor number = antes. */
  prioridad: number;
  modoAsignacion: ModoAsignacion;
  vehiculoId: string;
  saldoActual: Centimos;
  estado: EstadoObjetivo;
  notas?: string;
  /** Solo en modo FIJO: importe mensual. */
  importeFijoMensual?: Centimos;
  /** Solo en INVERSION_PERPETUA con capital derivado. */
  rentaDeseada?: RentaDeseada | null;
  /** Peso para repartir el residual cuando hay varios ABSORBE_RESIDUAL. */
  pesoResidual?: number;
}

// ── Eventos (§2.7) ────────────────────────────────────────────────────────────

export type TipoEvento = 'INYECCION_CAPITAL' | 'CAMBIO_GASTOS_FIJOS' | 'CAMBIO_INGRESOS' | 'NUEVA_DEUDA';

export interface Evento {
  _id: string;
  fecha: Mes;
  tipo: TipoEvento;
  /**
   * INYECCION_CAPITAL: importe que entra.
   * CAMBIO_GASTOS_FIJOS / CAMBIO_INGRESOS: NUEVO valor mensual, no el delta.
   * NUEVA_DEUDA: cuota mensual que se suma a los gastos fijos.
   */
  importe: Centimos;
  /** Solo en INYECCION_CAPITAL: a qué objetivo va dirigida. Null = al reparto. */
  objetivoDestinoId?: string | null;
  notas?: string;
}

// ── Perfil (§2.2) ─────────────────────────────────────────────────────────────

export interface PerfilFinanciero {
  /** Neto mensual disponible. Se deriva de las nóminas o se fija a mano. */
  netoMensual: Centimos;
  gastosFijosMensuales: Centimos;
  /** True si los valores vienen escritos a mano en vez de derivados. */
  manual?: boolean;
}

// ── Plan (§2.1) ───────────────────────────────────────────────────────────────

export interface Plan {
  _id: string;
  nombre: string;
  /** Mes de arranque de la simulación. */
  fechaInicio: Mes;
  horizonteMeses: number;
  /** Fracción del sobrante que NO se asigna a objetivos. 0.2 = 20 %. */
  pctDisfrute: number;
  notas?: string;
  activo: boolean;
  perfil: PerfilFinanciero;
  vehiculos: Vehiculo[];
  objetivos: Objetivo[];
  eventos: Evento[];
  /** Sello de creación, para poder comparar versiones del plan (§6). */
  creadoEn?: string;
}

// ── Resultado de la simulación (§4) ───────────────────────────────────────────

export interface AsignacionMes {
  objetivoId: string;
  asignado: Centimos;
  /** Lo que el objetivo PEDÍA este mes; si supera a `asignado`, hubo déficit. */
  solicitado: Centimos;
  saldoTrasMes: Centimos;
}

export interface FilaMensual {
  indice: number;
  mes: Mes;
  netoMensual: Centimos;
  gastosFijos: Centimos;
  /** Lo que queda tras gastos fijos, antes de apartar el disfrute. */
  sobrante: Centimos;
  disfrute: Centimos;
  /** Lo que entra en la cascada. */
  disponible: Centimos;
  /** Disponible que nadie reclamó. */
  sinAsignar: Centimos;
  asignaciones: AsignacionMes[];
  patrimonioTotal: Centimos;
}

export interface Hito {
  objetivoId: string;
  nombre: string;
  mes: Mes;
  indice: number;
  importeFinal: Centimos;
  /** Cuota que este objetivo dejó de reclamar al completarse. */
  cuotaLiberada: Centimos;
}

export interface Fase {
  desde: Mes;
  hasta: Mes;
  meses: number;
  /** Objetivos que estaban recibiendo dinero durante el tramo. */
  objetivosActivos: string[];
}

export type SeveridadAviso = 'info' | 'atencion' | 'error';

export interface Aviso {
  severidad: SeveridadAviso;
  codigo: 'INVIABLE' | 'TOPE_FISCAL' | 'SIN_ASIGNAR' | 'NUNCA_COMPLETADO' | 'LIQUIDEZ';
  mensaje: string;
  objetivoId?: string;
  mes?: Mes;
  /** Déficit mensual medio del tramo inviable, en céntimos. */
  deficitMensual?: Centimos;
}

export interface PropuestaAjuste {
  clase: 'RETRASAR_FECHA' | 'REDUCIR_IMPORTE' | 'REDUCIR_DISFRUTE' | 'REORDENAR';
  objetivoId?: string;
  mensaje: string;
  /** Magnitud del ajuste: meses, céntimos o puntos porcentuales según la clase. */
  magnitud: number;
}

export interface ResumenSimulacion {
  patrimonioFinal: Centimos;
  patrimonioPorVehiculo: Record<string, Centimos>;
  totalAportado: Centimos;
  totalDisfrute: Centimos;
  /** Mes en que se completa el objetivo de INVERSION_PERPETUA, si lo hay. */
  mesIndependencia?: Mes | null;
}

export interface ResultadoSimulacion {
  viable: boolean;
  mesesSimulados: number;
  serieMensual: FilaMensual[];
  hitos: Hito[];
  fases: Fase[];
  avisos: Aviso[];
  propuestas: PropuestaAjuste[];
  estadoFinal: Record<string, EstadoObjetivo>;
  resumen: ResumenSimulacion;
}
