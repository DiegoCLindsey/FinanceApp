// Segunda línea de defensa de los flags: lo desactivado falla, no responde.
import { describe, it, expect, afterEach } from 'vitest';
import { FeatureDeshabilitadaError, exigirFeature, featureActiva, instalarConsultaFlags } from '@/flags/guard';

let desinstalar: (() => void) | null = null;

const conFlags = (estado: Record<string, boolean>) => {
  desinstalar = instalarConsultaFlags((id) => estado[id] ?? false);
};

afterEach(() => {
  desinstalar?.();
  desinstalar = null;
});

describe('guarda de funcionalidades', () => {
  it('sin consulta instalada deja pasar todo', () => {
    // El dominio y el motor son puros: importarlos en un test no debe exigir
    // arrancar el servicio de flags.
    expect(featureActiva('lo-que-sea')).toBe(true);
    expect(() => exigirFeature('lo-que-sea', 'hacer algo')).not.toThrow();
  });

  it('deja pasar lo activado', () => {
    conFlags({ margenes: true });
    expect(() => exigirFeature('margenes', 'calcular el plan')).not.toThrow();
  });

  it('corta lo desactivado con un error identificable', () => {
    conFlags({ margenes: false });
    expect(() => exigirFeature('margenes', 'calcular el plan')).toThrow(FeatureDeshabilitadaError);
    try {
      exigirFeature('margenes', 'calcular el plan');
      expect.unreachable('tenía que lanzar');
    } catch (e) {
      expect(e).toBeInstanceOf(FeatureDeshabilitadaError);
      expect((e as FeatureDeshabilitadaError).featureId).toBe('margenes');
      // El mensaje es para el usuario: dice qué pasa y dónde se arregla
      expect((e as Error).message).toContain('margenes');
      expect((e as Error).message).toContain('no se puede calcular el plan');
      expect((e as Error).message).toContain('Funcionalidades');
    }
  });

  it('una funcionalidad desconocida se considera desactivada', () => {
    conFlags({ margenes: true });
    expect(featureActiva('no-existe')).toBe(false);
  });

  it('desinstalar restaura la consulta anterior', () => {
    conFlags({ a: true });
    const quitar = instalarConsultaFlags(() => false);
    expect(featureActiva('a')).toBe(false);
    quitar();
    expect(featureActiva('a')).toBe(true);
  });
});
