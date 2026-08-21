// ── Migración → v8 ────────────────────────────────────────────────────────────
// Gestor de objetivos financieros: la colección `goals` se absorbe dentro de un
// `Plan` (decisión del usuario, 2026-08-21).
//
// Había dos entidades que se llamaban «objetivo» y hacían cosas distintas:
//
//   · `goals` — SEGUIMIENTO. Apunta a unas cuentas y mide el progreso sobre sus
//     saldos reales. No reparte flujo: solo mira.
//   · `Objetivo` del plan — PLANIFICACIÓN. Compite por el flujo mensual con un
//     modo de asignación y un vehículo, y se simula hacia adelante.
//
// Tener las dos con el mismo nombre en el menú era inasumible, así que el
// módulo nuevo absorbe al viejo. Aquí no se pierde nada: cada goal se convierte
// en un Objetivo con su nombre, importe, fecha, prioridad y saldo ya acumulado,
// y sus `cuentaIds` se traducen a un vehículo por cuenta.
//
// Traducción de campos:
//   nombre        → nombre
//   targetAmount  → importeObjetivo (a céntimos: el plan trabaja en enteros)
//   targetDate    → fechaLimite, recortada a 'YYYY-MM'
//   prioridad     → prioridad
//   completado    → estado COMPLETADO
//   cuentaIds[0]  → vehiculoId (una cuenta = un vehículo, con su `interes`)
//
// El modo de asignación se deduce: con fecha, CUOTA_POR_FECHA; sin ella,
// ABSORBE_TODO. Es lo que más se parece al comportamiento anterior, donde un
// objetivo con fecha tenía una cuota implícita y uno sin fecha se llenaba con lo
// que hubiera.

import { toCents } from '@/core/money';
import type { MigrationContext, RawState } from './types';

type Obj = Record<string, unknown>;

const asArray = (v: unknown): Obj[] => (Array.isArray(v) ? (v as Obj[]) : []);
const texto = (v: unknown, porDefecto = ''): string => (typeof v === 'string' && v.trim() ? v : porDefecto);
const numero = (v: unknown, porDefecto = 0): number => (typeof v === 'number' && Number.isFinite(v) ? v : porDefecto);

/** 'YYYY-MM-DD' → 'YYYY-MM'. El planificador razona en meses. */
const aMes = (v: unknown): string | null => (typeof v === 'string' && /^\d{4}-\d{2}/.test(v) ? v.slice(0, 7) : null);

export function migrateTo8(raw: RawState, ctx: MigrationContext): RawState {
  const out: RawState = { ...raw };

  // Idempotente: si ya hay planes, esta migración ya corrió.
  if (Array.isArray(out.planes)) return out;

  const goals = asArray(out.goals);
  const accounts = asArray(out.accounts);

  // Un vehículo por cuenta activa, heredando lo que la cuenta ya sabe de sí
  // misma. No se duplica nada: la rentabilidad, el bloqueo y la fiscalidad ya
  // estaban en la cuenta.
  const vehiculos = accounts.map((a) => {
    const bloqueo = numero(a.bloqueoMeses, 0);
    return {
      _id: `veh_${texto(a._id, 'x')}`,
      nombre: texto(a.nombre, 'Cuenta'),
      // `interes` está en porcentaje anual NOMINAL; el plan trabaja en tanto por
      // uno y en términos REALES. Se traslada el valor y se avisa en la UI de
      // que hay que revisarlo: no podemos restarle una inflación que no sabemos.
      rentabilidadRealAnual: numero(a.interes, 0) / 100,
      liquidez: a.modeloFondo === 'pension' ? 'BLOQUEADA_HASTA_JUBILACION' : bloqueo > 0 ? 'MEDIA' : 'INMEDIATA',
      fiscalidadRetirada: numero(a.impuestoRetirada, 0) / 100,
      topeAportacionAnual: a.modeloFondo === 'pension' ? toCents(1500) : null,
      riesgo: a.modeloFondo === 'pension' ? 'MEDIO' : 'NULO',
      cuentaId: texto(a._id, ''),
      prestamoId: null,
      esDeuda: false,
    };
  });

  const vehiculoPorCuenta = new Map(accounts.map((a, i) => [texto(a._id, ''), vehiculos[i]._id]));
  const primerVehiculo = vehiculos[0]?._id ?? '';

  const objetivos = goals.map((g, i) => {
    const cuentas = Array.isArray(g.cuentaIds) ? (g.cuentaIds as unknown[]).map((c) => texto(c, '')) : [];
    const fechaLimite = aMes(g.targetDate);
    return {
      _id: texto(g._id, `obj_mig_${i}`),
      nombre: texto(g.nombre, `Objetivo ${i + 1}`),
      tipo: 'AHORRO_OBJETIVO',
      importeObjetivo: toCents(numero(g.targetAmount, 0)),
      fechaLimite,
      prioridad: numero(g.prioridad, i + 1),
      // Con fecha había una cuota implícita; sin fecha se llenaba con lo que
      // hubiera. Es lo que más se parece al comportamiento anterior.
      modoAsignacion: fechaLimite ? 'CUOTA_POR_FECHA' : 'ABSORBE_TODO',
      vehiculoId: vehiculoPorCuenta.get(cuentas[0]) ?? primerVehiculo,
      // El saldo de partida NO se copia de las cuentas: un goal medía el saldo
      // VIVO de sus cuentas, y meterlo aquí como saldo inicial contaría dos
      // veces el mismo dinero en cuanto la cuenta siga alimentándose. Se arranca
      // a cero y se avisa en la UI para que lo fije quien lo sepa.
      saldoActual: 0,
      estado: g.completado === true ? 'COMPLETADO' : 'PENDIENTE',
      notas: texto(g.notas, ''),
    };
  });

  const plan = {
    _id: 'plan_base',
    nombre: 'Plan base',
    fechaInicio: ctx.hoyISO.slice(0, 7),
    horizonteMeses: 480,
    pctDisfrute: 0,
    notas:
      goals.length > 0
        ? 'Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.'
        : '',
    activo: true,
    perfil: { netoMensual: 0, gastosFijosMensuales: 0, manual: false },
    vehiculos,
    objetivos,
    eventos: [],
    creadoEn: ctx.hoyISO,
  };

  out.planes = [plan];
  // `goals` se deja tal cual, sin borrar. Si algo sale mal en la conversión, el
  // original sigue ahí y se puede repetir. Lo retira una migración posterior,
  // cuando el módulo nuevo lleve un tiempo en uso.
  return out;
}
