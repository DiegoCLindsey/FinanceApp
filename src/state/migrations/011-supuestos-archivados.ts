// ── Migración → v11 ───────────────────────────────────────────────────────────
// Termina lo que la 010 creyó haber hecho.
//
// La 010 retiraba Supuestos (escenarios), `goals` y el planificador, pero nunca
// llegó a ver esas colecciones: `store.load()` solo leía del almacenamiento las
// claves del esquema vigente más `LEGACY_KEYS = ['history']`, así que
// `escenarios`, `planes` y `goals` no entraban en el estado crudo. La 010, al no
// encontrarlas, daba por hecho que ya se había ejecutado y salía sin tocar nada.
// Resultado (docs/14, BUG-06):
//
//   · los elementos conservaban `escenarioIds`, y como ya nadie filtra por
//     escenario, un gasto que SOLO existía dentro de un supuesto pasó a contar
//     en la proyección real;
//   · los planes con objetivos no se archivaron en ningún sitio;
//   · las tres claves quedaron huérfanas en localStorage.
//
// Qué hace esta:
//
//   · Lo que pertenecía solo a un supuesto (`escenarioIds` no vacío) NO se
//     borra: se desactiva y se etiqueta `supuesto-archivado`, para que deje de
//     contar pero el usuario pueda revisarlo y decidir. Las amortizaciones de
//     préstamo no tienen «activo», así que las de un supuesto se sacan del
//     préstamo y se guardan en el archivo.
//   · Los planes con datos reales se archivan en `config.archivoMigracion011`,
//     que viaja en las copias de seguridad.
//   · Se retiran `escenarios`, `planes`, `goals` y `config.escenarioActivo`.
//     El borrado físico de las claves lo hace `store.load()` (CLAVES_RETIRADAS).
//
// Es idempotente por contenido: sobre un estado ya limpio no cambia nada.

import type { MigrationContext, RawState } from './types';

type Obj = Record<string, unknown>;

export const ETIQUETA_SUPUESTO = 'supuesto-archivado';

const asArray = (v: unknown): Obj[] => (Array.isArray(v) ? (v as Obj[]) : []);
const deSupuesto = (item: Obj): boolean => Array.isArray(item.escenarioIds) && item.escenarioIds.length > 0;

export interface ArchivoMigracion011 {
  /** Planes del planificador retirado que tenían objetivos de verdad. */
  planes: Obj[];
  /** Amortizaciones que solo existían dentro de un supuesto. */
  amortizaciones: (Obj & { loanId: string; loanNombre?: string })[];
  /** Cuántos elementos se desactivaron por venir de un supuesto. */
  desactivados: number;
  /** El usuario ya ha visto el aviso. */
  avisado?: boolean;
}

function esPlanConDatosReales(plan: Obj): boolean {
  if (plan._id !== 'plan_base') return true;
  return Array.isArray(plan.objetivos) && plan.objetivos.length > 0;
}

export function migrateTo11(raw: RawState, _ctx: MigrationContext): RawState {
  const out: RawState = { ...raw };
  let desactivados = 0;
  const amortizacionesArchivadas: ArchivoMigracion011['amortizaciones'] = [];

  const limpiar = (item: Obj): Obj => {
    const { escenarioIds: _ids, ...resto } = item;
    if (!deSupuesto(item)) return resto;
    desactivados += 1;
    const tags = Array.isArray(resto.tags) ? (resto.tags as string[]) : [];
    return { ...resto, activo: false, tags: tags.includes(ETIQUETA_SUPUESTO) ? tags : [...tags, ETIQUETA_SUPUESTO] };
  };

  out.expenses = asArray(out.expenses).map(limpiar);
  out.nominas = asArray(out.nominas).map(limpiar);
  out.accounts = asArray(out.accounts).map((a) => {
    // La cuenta por defecto y la principal no se desactivan nunca: sin ellas la
    // aplicación no tiene dónde apuntar nada.
    if (a._id === 'default' || a.esCuentaPrincipal) {
      const { escenarioIds: _ids, ...resto } = a;
      return resto;
    }
    return limpiar(a);
  });
  out.loans = asArray(out.loans).map((loan) => {
    const limpio = limpiar(loan);
    if (Array.isArray(limpio.amortizaciones)) {
      const quedan: Obj[] = [];
      for (const am of limpio.amortizaciones as Obj[]) {
        const { escenarioIds: _ids, ...resto } = am;
        if (deSupuesto(am)) {
          amortizacionesArchivadas.push({ ...resto, loanId: String(loan._id ?? ''), loanNombre: loan.nombre as string | undefined });
        } else {
          quedan.push(resto);
        }
      }
      limpio.amortizaciones = quedan;
    }
    return limpio;
  });

  // Planes: los que la 010 pudo dejar en su clave inerte, más los que sigan en
  // la colección original.
  const planes = [...asArray(out._migracion010_planesArchivados), ...asArray(out.planes).filter(esPlanConDatosReales)];
  delete out._migracion010_planesArchivados;
  delete out.planes;
  delete out.goals;
  delete out.escenarios;

  const config: Obj = out.config && typeof out.config === 'object' ? { ...(out.config as Obj) } : {};
  delete config.escenarioActivo;
  if (planes.length > 0 || amortizacionesArchivadas.length > 0 || desactivados > 0) {
    const previo = (config.archivoMigracion011 as Partial<ArchivoMigracion011> | undefined) ?? {};
    const archivo: ArchivoMigracion011 = {
      planes: [...(previo.planes ?? []), ...planes],
      amortizaciones: [...(previo.amortizaciones ?? []), ...amortizacionesArchivadas],
      desactivados: (previo.desactivados ?? 0) + desactivados,
    };
    config.archivoMigracion011 = archivo;
  }
  if (out.config !== undefined || config.archivoMigracion011) out.config = config;

  return out;
}
