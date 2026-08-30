import { describe, expect, it, vi } from 'vitest';
import { crearRegistroCambios } from '@/state/cambios';

describe('registro de cambios', () => {
  it('empieza en cero y sin origen', () => {
    const r = crearRegistroCambios();
    expect(r.revision()).toBe(0);
    expect(r.ultimoOrigen()).toBeNull();
  });

  it('cada cambio sube la revisión y recuerda de dónde vino', () => {
    const r = crearRegistroCambios();
    expect(r.marcar('expenses')).toBe(1);
    expect(r.marcar('accounts')).toBe(2);
    expect(r.revision()).toBe(2);
    expect(r.ultimoOrigen()).toBe('accounts');
  });

  it('avisa a los suscriptores, y desuscribirse funciona', () => {
    const r = crearRegistroCambios();
    const cb = vi.fn();
    const off = r.suscribir(cb);
    r.marcar('expenses');
    expect(cb).toHaveBeenCalledWith(1, 'expenses');
    off();
    r.marcar('loans');
    expect(cb).toHaveBeenCalledOnce();
  });

  it('un suscriptor que revienta no deja sin avisar al siguiente', () => {
    // Aquí cuelga el aviso de «cambios sin guardar»: perderlo por culpa de otro
    // suscriptor dejaría al usuario creyendo que está todo guardado.
    const r = crearRegistroCambios();
    const malo = vi.fn(() => {
      throw new Error('boom');
    });
    const bueno = vi.fn();
    r.suscribir(malo);
    r.suscribir(bueno);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => r.marcar('expenses')).not.toThrow();
    expect(bueno).toHaveBeenCalledOnce();
    error.mockRestore();
  });

  describe('marcas de agua', () => {
    it('nacen al día: la aplicación no arranca diciendo que hay cambios', () => {
      const r = crearRegistroCambios();
      r.marcar('expenses');
      const m = r.crearMarca('graficas');
      expect(m.pendiente()).toBe(false);
      expect(m.vista()).toBe(1);
    });

    it('quedan pendientes en cuanto algo cambia', () => {
      const r = crearRegistroCambios();
      const m = r.crearMarca('graficas');
      expect(m.pendiente()).toBe(false);
      r.marcar('accounts');
      expect(m.pendiente()).toBe(true);
      m.alDia();
      expect(m.pendiente()).toBe(false);
    });

    it('DOS interesados se limpian por separado: es el motivo de que sea un contador', () => {
      // Repintar las gráficas no debe borrar el aviso de «sin guardar».
      const r = crearRegistroCambios();
      const graficas = r.crearMarca('graficas');
      const guardado = r.crearMarca('guardado');

      r.marcar('expenses');
      expect(graficas.pendiente()).toBe(true);
      expect(guardado.pendiente()).toBe(true);

      graficas.alDia(); // se repintó el cuadro de mando
      expect(graficas.pendiente()).toBe(false);
      expect(guardado.pendiente()).toBe(true); // sigue sin subirse: correcto
    });

    it('un cambio hecho MIENTRAS se sube no se da por guardado', () => {
      // Subir tarda. Quien sube confirma la revisión que se llevó, no la de
      // cuando terminó; si no, un cambio en vuelo desaparecería del aviso.
      const r = crearRegistroCambios();
      const guardado = r.crearMarca('guardado');
      r.marcar('expenses'); // revisión 1: es lo que se sube
      const enVuelo = r.revision();
      r.marcar('loans'); // revisión 2: entra mientras se sube

      guardado.alDia(enVuelo); // termina la subida de la revisión 1
      expect(guardado.vista()).toBe(1);
      expect(guardado.pendiente()).toBe(true); // el cambio 2 sigue sin subir
    });

    it('confirmar una revisión vieja no desconfirma lo ya atendido', () => {
      const r = crearRegistroCambios();
      const m = r.crearMarca('guardado');
      r.marcar('a');
      r.marcar('b');
      m.alDia(); // al día con la 2
      m.alDia(1); // una subida lenta que salió antes termina después
      expect(m.vista()).toBe(2);
      expect(m.pendiente()).toBe(false);
    });
  });
});
