// ── core/tax/renta ────────────────────────────────────────────────────────────
// Borrador de la declaración de la renta: base general, base del ahorro,
// cuotas y resultado a pagar o devolver.
//
// Port de la aritmética que vivía dentro de `rentas/rentas.js`. Todo lo que se
// comparte con las nóminas viene de `irpf.ts` y `nomina-grupo.ts` en lugar de
// recalcularse: la vista de fiscalidad tenía la CUARTA copia del apilado de
// IRPF por grupo, y las reducciones del art. 19.2/20 escritas otra vez.
//
// Correcciones deliberadas respecto al legacy (todas con test):
//
//  · las retenciones de nómina salen de `irpfNomina`, que apila por grupo y
//    respeta el modo manual. La copia de la vista ordenaba el grupo solo por
//    bruto, sin desempate, así que con dos nóminas del mismo bruto perdía
//    tramo — el mismo fallo que ya se corrigió en nóminas;
//  · el límite de aportación deducible a planes de pensiones es 1.500 €/año.
//    La vista usaba `min(8000, 30 % del RNT)` en el cuadro de la declaración y
//    1.500 € tres pantallas más allá, en la misma vista, para el mismo dato;
//  · la anualización de "otros ingresos sujetos a IRPF" multiplicaba por la
//    frecuencia en vez de dividir: un ingreso trimestral (`mensual`, cada 3
//    meses) contaba 36 veces al año en lugar de 4. Los diarios ni se
//    anualizaban.

import { calcIRPF, desgloseBaseTrabajo, type Tramos } from './irpf';
import { flexAnual, irpfNomina, type NominaGrupoLike } from './nomina-grupo';

/** Límite anual de aportación con derecho a reducción (plan individual). */
export const LIMITE_APORTACION_PENSION = 1500;

/** Importes anuales que la aplicación no conoce y el usuario introduce. */
export interface ExtrasDeclaracion {
  capInmobiliario?: number;
  capMobiliario?: number;
  gananciasFondos?: number;
  otrasCorto?: number;
  retCapital?: number;
}

export interface NominaDeclaracion extends NominaGrupoLike {
  grupoNomina?: string;
  activo?: boolean;
  simulacion?: boolean;
}

export interface DeclaracionInput {
  /** Nóminas que entran en la declaración (ya filtradas). */
  nominas: NominaDeclaracion[];
  /** Aportaciones a planes de pensiones realizadas en el ejercicio. */
  aportacionesPension: number;
  /** Otros ingresos anuales sujetos a IRPF (ver `ingresoAnual`). */
  otrosIngresos: number;
  extras?: ExtrasDeclaracion;
  tramosGeneral: Tramos;
  tramosAhorro: Tramos;
}

export interface Declaracion {
  brutoTotal: number;
  flexTotal: number;
  brutoIRPF: number;
  cotizSS: number;
  gastosArt19: number;
  RNT: number;
  reducArt20: number;
  aportPP: number;
  limPP: number;
  deducPP: number;
  RNTred: number;
  otrosIngresos: number;
  capInmobiliario: number;
  capMobiliario: number;
  gananciasFondos: number;
  otrasCorto: number;
  baseGeneral: number;
  baseAhorro: number;
  cuotaGen: number;
  cuotaAho: number;
  cuotaIntegra: number;
  retNomina: number;
  retCapital: number;
  totalRet: number;
  /** Positivo = a pagar; negativo = a devolver. */
  resultado: number;
}

export interface IngresoRecurrente {
  cuantia?: number;
  tipoFrecuencia?: string;
  /** Cada cuántos meses (o días) se repite. */
  frecuencia?: number;
}

/**
 * Importe anual de un ingreso recurrente. `frecuencia` es el PERIODO (cada N
 * meses / cada N días), así que se divide, no se multiplica.
 */
export function ingresoAnual(e: IngresoRecurrente): number {
  const cuantia = e.cuantia || 0;
  const cada = Math.max(1, e.frecuencia || 1);
  if (e.tipoFrecuencia === 'mensual') return (cuantia * 12) / cada;
  if (e.tipoFrecuencia === 'diaria') return (cuantia * 365.25) / cada;
  return cuantia; // extraordinario: una vez
}

const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : 0;
};

/** Agrupa por `grupoNomina`; la cadena vacía significa "tributa sola". */
function grupoDe(n: NominaDeclaracion, nominas: NominaDeclaracion[]): NominaDeclaracion[] | null {
  const g = n.grupoNomina || '';
  return g ? nominas.filter((x) => (x.grupoNomina || '') === g) : null;
}

/** Retenciones practicadas en nómina durante el ejercicio. */
export function retencionesNomina(nominas: NominaDeclaracion[], tramos: Tramos): number {
  return nominas.reduce((s, n) => s + irpfNomina(n, grupoDe(n, nominas), tramos), 0);
}

export function calcularDeclaracion(input: DeclaracionInput): Declaracion {
  const { nominas, tramosGeneral, tramosAhorro } = input;
  const ex = input.extras ?? {};

  // ── Rendimientos del trabajo ────────────────────────────────────────────────
  const brutoTotal = nominas.reduce((s, n) => s + (n.bruto || 0), 0);
  const flexTotal = nominas.reduce((s, n) => s + flexAnual(n), 0);
  const d = desgloseBaseTrabajo(brutoTotal, flexTotal);

  const aportPP = input.aportacionesPension;
  const limPP = LIMITE_APORTACION_PENSION;
  const deducPP = Math.min(aportPP, limPP);
  // El art. 20 y la reducción por aportaciones se aplican sobre el RNT
  const RNTred = Math.max(0, d.RNT - d.reducArt20 - deducPP);

  // ── Bases y cuotas ──────────────────────────────────────────────────────────
  const capInmobiliario = num(ex.capInmobiliario);
  const capMobiliario = num(ex.capMobiliario);
  const gananciasFondos = num(ex.gananciasFondos);
  const otrasCorto = num(ex.otrasCorto);
  const retCapital = num(ex.retCapital);

  const baseGeneral = Math.max(0, RNTred + input.otrosIngresos + capInmobiliario + otrasCorto);
  const baseAhorro = Math.max(0, capMobiliario + gananciasFondos);
  const cuotaGen = calcIRPF(baseGeneral, tramosGeneral);
  const cuotaAho = calcIRPF(baseAhorro, tramosAhorro);
  const cuotaIntegra = cuotaGen + cuotaAho;

  const retNomina = retencionesNomina(nominas, tramosGeneral);
  const totalRet = retNomina + retCapital;

  return {
    brutoTotal,
    flexTotal,
    brutoIRPF: d.baseIRPF,
    cotizSS: d.cotizSS,
    gastosArt19: d.gastosArt19,
    RNT: d.RNT,
    reducArt20: d.reducArt20,
    aportPP,
    limPP,
    deducPP,
    RNTred,
    otrosIngresos: input.otrosIngresos,
    capInmobiliario,
    capMobiliario,
    gananciasFondos,
    otrasCorto,
    baseGeneral,
    baseAhorro,
    cuotaGen,
    cuotaAho,
    cuotaIntegra,
    retNomina,
    retCapital,
    totalRet,
    resultado: cuotaIntegra - totalRet,
  };
}
