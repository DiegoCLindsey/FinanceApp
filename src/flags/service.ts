// ── flags/service ─────────────────────────────────────────────────────────────
// Servicio de feature flags (F2, tarea 2.2). Lee y escribe `config.features`
// del store, de modo que la configuración viaja con los datos del usuario
// (localStorage, backups en la nube y export/import JSON) sin trabajo extra.
//
// Integridad: las dependencias se respetan en ambos sentidos.
//   · activar una feature activa sus dependencias
//   · desactivar una feature apaga en cascada las que dependen de ella
//   · `isEnabled` además comprueba las dependencias en tiempo de lectura, así
//     un perfil importado inconsistente nunca deja una feature "encendida"
//     sin lo que necesita para funcionar.

import { defaultFlags, dependientesDe, FEATURES, featuresPorGrupo, getFeature, type FeatureDefinition } from './registry';

export interface FlagsStoreLike {
  get(key: 'config'): { features?: Record<string, boolean> };
  patchConfig(patch: { features: Record<string, boolean> }): void;
}

export interface EstadoFeature extends FeatureDefinition {
  activa: boolean;
  /** Activa en la configuración pero bloqueada por una dependencia apagada. */
  bloqueadaPor?: string[];
}

export interface PerfilFlags {
  _app: 'financeapp';
  _tipo: 'feature-profile';
  _v: 1;
  nombre?: string;
  features: Record<string, boolean>;
}

export interface ResultadoCambio {
  /** Ids cuyo valor efectivo ha cambiado, incluida la cascada. */
  cambiadas: string[];
  motivo?: 'dependencias-activadas' | 'cascada-apagado' | 'nucleo-inmutable';
}

export function createFlags(store: FlagsStoreLike) {
  function raw(): Record<string, boolean> {
    return { ...defaultFlags(), ...(store.get('config').features || {}) };
  }

  function persist(features: Record<string, boolean>) {
    store.patchConfig({ features });
  }

  /**
   * Valor efectivo: la feature está activa y todas sus dependencias
   * (transitivas) también. Protegido contra ciclos en el catálogo.
   */
  function isEnabled(id: string, snapshot = raw(), visitando = new Set<string>()): boolean {
    const def = getFeature(id);
    if (!def) return false; // id desconocido: nunca activo
    if (def.nucleo) return true;
    if (snapshot[id] === false) return false;
    if (visitando.has(id)) return true; // ciclo: no bloquear indefinidamente
    visitando.add(id);
    for (const dep of def.dependencias || []) {
      if (!isEnabled(dep, snapshot, visitando)) return false;
    }
    return true; // activa en config (comprobado arriba) y con dependencias satisfechas
  }

  /** Dependencias apagadas que impiden que una feature activa funcione. */
  function bloqueadaPor(id: string, snapshot = raw()): string[] {
    const def = getFeature(id);
    if (!def) return [];
    return (def.dependencias || []).filter((dep) => !isEnabled(dep, snapshot));
  }

  function setEnabled(id: string, activa: boolean): ResultadoCambio {
    const def = getFeature(id);
    if (!def) return { cambiadas: [] };
    if (def.nucleo) return { cambiadas: [], motivo: 'nucleo-inmutable' };

    const antes = raw();
    const efectivoAntes = new Map(FEATURES.map((f) => [f.id, isEnabled(f.id, antes)]));
    const next = { ...antes, [id]: activa };
    let motivo: ResultadoCambio['motivo'];

    if (activa) {
      // Activar arrastra las dependencias (transitivas)
      const pendientes = [...(def.dependencias || [])];
      while (pendientes.length) {
        const dep = pendientes.pop() as string;
        if (next[dep] === false) {
          next[dep] = true;
          motivo = 'dependencias-activadas';
        }
        pendientes.push(...(getFeature(dep)?.dependencias || []));
      }
    } else {
      // Apagar arrastra a quien dependa de ella (transitivo)
      const pendientes = dependientesDe(id).map((f) => f.id);
      while (pendientes.length) {
        const hijo = pendientes.pop() as string;
        if (next[hijo] !== false) {
          next[hijo] = false;
          motivo = 'cascada-apagado';
        }
        pendientes.push(...dependientesDe(hijo).map((f) => f.id));
      }
    }

    persist(next);
    const cambiadas = FEATURES.filter((f) => isEnabled(f.id, next) !== efectivoAntes.get(f.id)).map((f) => f.id);
    return { cambiadas, motivo };
  }

  /** Estado completo para pintar la ventana de configuración. */
  function estado(): EstadoFeature[] {
    const snapshot = raw();
    return FEATURES.map((f) => {
      const bloq = bloqueadaPor(f.id, snapshot);
      return {
        ...f,
        activa: isEnabled(f.id, snapshot),
        ...(bloq.length > 0 && snapshot[f.id] !== false ? { bloqueadaPor: bloq } : {}),
      };
    });
  }

  function estadoPorGrupo(): { grupo: string; features: EstadoFeature[] }[] {
    const snapshot = raw();
    return featuresPorGrupo().map(({ grupo, features }) => ({
      grupo,
      features: features.map((f) => {
        const bloq = bloqueadaPor(f.id, snapshot);
        return {
          ...f,
          activa: isEnabled(f.id, snapshot),
          ...(bloq.length > 0 && snapshot[f.id] !== false ? { bloqueadaPor: bloq } : {}),
        };
      }),
    }));
  }

  /** Restaura los valores por defecto del catálogo. */
  function reset(): void {
    persist(defaultFlags());
  }

  /** Perfil exportable (JSON independiente del backup de datos). */
  function exportProfile(nombre?: string): PerfilFlags {
    return { _app: 'financeapp', _tipo: 'feature-profile', _v: 1, ...(nombre ? { nombre } : {}), features: raw() };
  }

  /**
   * Carga un perfil. Ignora ids desconocidos (perfiles de otra versión) y
   * completa los ausentes con su valor por defecto.
   */
  function importProfile(perfil: unknown): { aplicadas: string[]; ignoradas: string[] } {
    const obj = perfil as Partial<PerfilFlags> | null;
    const entrada = obj && typeof obj === 'object' && obj.features && typeof obj.features === 'object' ? obj.features : null;
    if (!entrada) throw new Error('El perfil no tiene una sección "features" válida');

    const next = defaultFlags();
    const aplicadas: string[] = [];
    const ignoradas: string[] = [];
    for (const [id, valor] of Object.entries(entrada)) {
      if (!getFeature(id)) {
        ignoradas.push(id);
        continue;
      }
      if (typeof valor !== 'boolean') {
        ignoradas.push(id);
        continue;
      }
      next[id] = valor;
      aplicadas.push(id);
    }
    persist(next);
    return { aplicadas, ignoradas };
  }

  return { isEnabled: (id: string) => isEnabled(id), setEnabled, estado, estadoPorGrupo, reset, exportProfile, importProfile, bloqueadaPor: (id: string) => bloqueadaPor(id) };
}

export type Flags = ReturnType<typeof createFlags>;
