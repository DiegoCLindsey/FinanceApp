// Registro y servicio de feature flags (F2, tareas 2.1 y 2.2).
import { describe, it, expect, beforeEach } from 'vitest';
import { createFlags } from '@/flags/service';
import { FEATURES, defaultFlags, dependientesDe, featuresPorGrupo, getFeature } from '@/flags/registry';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';

const HOY = new Date(2026, 6, 30);

function nuevoStore() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  return store;
}

describe('registro de features', () => {
  it('los ids son únicos', () => {
    const ids = FEATURES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('todas las dependencias declaradas existen', () => {
    for (const f of FEATURES) {
      for (const dep of f.dependencias || []) {
        expect(getFeature(dep), `dependencia desconocida ${dep} en ${f.id}`).toBeDefined();
      }
    }
  });
  it('el grafo de dependencias no tiene ciclos', () => {
    const visitar = (id: string, cadena: string[]): void => {
      expect(cadena, `ciclo detectado: ${[...cadena, id].join(' → ')}`).not.toContain(id);
      for (const dep of getFeature(id)?.dependencias || []) visitar(dep, [...cadena, id]);
    };
    for (const f of FEATURES) visitar(f.id, []);
  });
  it('ninguna feature núcleo depende de features desactivables', () => {
    for (const f of FEATURES.filter((x) => x.nucleo)) {
      expect(f.dependencias ?? []).toEqual([]);
    }
  });
  it('cada feature pertenece a un grupo y los grupos cubren el catálogo', () => {
    const total = featuresPorGrupo().reduce((s, g) => s + g.features.length, 0);
    expect(total).toBe(FEATURES.length);
  });
  it('dependientesDe encuentra la relación inversa', () => {
    expect(dependientesDe('accounts').map((f) => f.id)).toContain('contabilidad');
    expect(dependientesDe('optimizador').map((f) => f.id)).toContain('comparador-frecuencias');
  });
});

describe('servicio de flags', () => {
  let store: ReturnType<typeof nuevoStore>;
  let flags: ReturnType<typeof createFlags>;

  beforeEach(() => {
    store = nuevoStore();
    flags = createFlags(store);
  });

  it('parte de los valores por defecto del catálogo', () => {
    for (const f of FEATURES) {
      expect(flags.isEnabled(f.id), f.id).toBe(f.porDefecto);
    }
  });

  it('un id desconocido nunca está activo', () => {
    expect(flags.isEnabled('feature-inexistente')).toBe(false);
  });

  it('la feature núcleo no se puede desactivar', () => {
    const res = flags.setEnabled('dashboard', false);
    expect(res.motivo).toBe('nucleo-inmutable');
    expect(flags.isEnabled('dashboard')).toBe(true);
  });

  it('activar arrastra las dependencias (transitivas)', () => {
    flags.setEnabled('accounts', false);
    flags.setEnabled('loans', false);
    expect(flags.isEnabled('optimizador')).toBe(false);

    const res = flags.setEnabled('comparador-frecuencias', true);
    expect(res.motivo).toBe('dependencias-activadas');
    expect(flags.isEnabled('loans')).toBe(true);
    expect(flags.isEnabled('optimizador')).toBe(true);
    expect(flags.isEnabled('comparador-frecuencias')).toBe(true);
    expect(res.cambiadas).toContain('comparador-frecuencias');
  });

  it('desactivar apaga en cascada a quien depende (transitivo)', () => {
    flags.setEnabled('optimizador', true);
    flags.setEnabled('comparador-frecuencias', true);
    expect(flags.isEnabled('comparador-frecuencias')).toBe(true);

    const res = flags.setEnabled('loans', false);
    expect(res.motivo).toBe('cascada-apagado');
    expect(flags.isEnabled('optimizador')).toBe(false);
    expect(flags.isEnabled('comparador-frecuencias')).toBe(false);
    expect(res.cambiadas).toEqual(expect.arrayContaining(['loans', 'optimizador', 'comparador-frecuencias']));
  });

  it('isEnabled respeta las dependencias aunque la configuración diga lo contrario', () => {
    // Estado inconsistente escrito a mano (p.ej. perfil de una versión antigua)
    store.patchConfig({ features: { ...defaultFlags(), accounts: false, contabilidad: true } });
    expect(flags.isEnabled('contabilidad')).toBe(false);
    expect(flags.bloqueadaPor('contabilidad')).toEqual(['accounts']);
  });

  it('estado y estadoPorGrupo marcan lo bloqueado', () => {
    store.patchConfig({ features: { ...defaultFlags(), accounts: false, contabilidad: true } });
    const contabilidad = flags.estado().find((f) => f.id === 'contabilidad');
    expect(contabilidad?.activa).toBe(false);
    expect(contabilidad?.bloqueadaPor).toEqual(['accounts']);

    const grupos = flags.estadoPorGrupo();
    expect(grupos.length).toBeGreaterThan(1);
    expect(grupos.flatMap((g) => g.features)).toHaveLength(FEATURES.length);
  });

  it('la configuración se persiste en config.features del usuario', () => {
    flags.setEnabled('autoguardado', true);
    expect(store.get('config').features.autoguardado).toBe(true);
    // Otro servicio sobre el mismo store ve el cambio (viaja con los datos)
    expect(createFlags(store).isEnabled('autoguardado')).toBe(true);
  });

  it('reset vuelve a los valores por defecto', () => {
    flags.setEnabled('autoguardado', true);
    flags.setEnabled('expenses', false);
    flags.reset();
    expect(flags.isEnabled('autoguardado')).toBe(false);
    expect(flags.isEnabled('expenses')).toBe(true);
  });
});

describe('perfiles exportables', () => {
  it('roundtrip export → import conserva los flags', () => {
    const storeA = nuevoStore();
    const flagsA = createFlags(storeA);
    flagsA.setEnabled('autoguardado', true);
    flagsA.setEnabled('margenes', true);
    flagsA.setEnabled('nominas', false);
    const perfil = flagsA.exportProfile('mi perfil');

    expect(perfil._tipo).toBe('feature-profile');
    expect(perfil.nombre).toBe('mi perfil');

    const storeB = nuevoStore();
    const flagsB = createFlags(storeB);
    const { aplicadas, ignoradas } = flagsB.importProfile(JSON.parse(JSON.stringify(perfil)));

    expect(ignoradas).toEqual([]);
    expect(aplicadas.length).toBeGreaterThan(0);
    for (const f of FEATURES) {
      expect(flagsB.isEnabled(f.id), f.id).toBe(flagsA.isEnabled(f.id));
    }
  });

  it('ignora ids desconocidos y valores no booleanos, y completa los ausentes', () => {
    const store = nuevoStore();
    const flags = createFlags(store);
    const { aplicadas, ignoradas } = flags.importProfile({
      features: { autoguardado: true, 'feature-de-otra-version': true, margenes: 'sí' },
    });
    expect(aplicadas).toEqual(['autoguardado']);
    expect(ignoradas).toEqual(expect.arrayContaining(['feature-de-otra-version', 'margenes']));
    expect(flags.isEnabled('autoguardado')).toBe(true);
    // Ausentes → valor por defecto
    expect(flags.isEnabled('expenses')).toBe(true);
    expect(flags.isEnabled('margenes')).toBe(false);
  });

  it('un perfil inválido lanza un error claro', () => {
    const flags = createFlags(nuevoStore());
    expect(() => flags.importProfile(null)).toThrow(/features/);
    expect(() => flags.importProfile({ nope: 1 })).toThrow(/features/);
  });

  it('los flags viajan en el snapshot del estado (backups y export JSON)', () => {
    const store = nuevoStore();
    createFlags(store).setEnabled('autoguardado', true);
    expect(store.snapshot().config.features.autoguardado).toBe(true);
  });
});
