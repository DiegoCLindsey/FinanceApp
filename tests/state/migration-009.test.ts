// Migración a v9: siembra la persona por defecto donde antes no había ninguna.
import { describe, it, expect } from 'vitest';
import { migrateTo9 } from '@/state/migrations/009-personas';
import type { Persona } from '@/state/schema';

const CTX = { hoyISO: '2026-08-30', finISO: '2027-08-30' };

describe('migración a v9', () => {
  it('siembra una única persona por defecto cuando no hay ninguna', () => {
    const out = migrateTo9({}, CTX);
    const personas = out.personas as Persona[];
    expect(personas).toHaveLength(1);
    expect(personas[0]._id).toBe('default');
    expect(personas[0].esPorDefecto).toBe(true);
    expect(personas[0].activo).toBe(true);
  });

  it('no toca nada si ya hay una persona por defecto (idempotente)', () => {
    const conPersonas = { personas: [{ _id: 'default', nombre: 'Diego', esPorDefecto: true, activo: true }] };
    const out = migrateTo9(conPersonas, CTX);
    expect(out.personas).toBe(conPersonas.personas); // ni siquiera copia el array
  });

  it('conserva personas ya creadas por el usuario, junto a la de por defecto', () => {
    const conOtras = { personas: [{ _id: 'p2', nombre: 'Pareja', esPorDefecto: false, activo: true }] };
    const out = migrateTo9(conOtras, CTX);
    const personas = out.personas as Persona[];
    expect(personas).toHaveLength(2);
    expect(personas.map((p) => p._id)).toEqual(['default', 'p2']);
  });

  it('no toca ninguna otra colección', () => {
    const estado = { expenses: [{ _id: 'e1' }], loans: [{ _id: 'l1' }] };
    const out = migrateTo9(estado, CTX);
    expect(out.expenses).toBe(estado.expenses);
    expect(out.loans).toBe(estado.loans);
  });

  it('es idempotente corriendo dos veces seguidas', () => {
    const una = migrateTo9({}, CTX);
    const dos = migrateTo9(una, CTX);
    expect((dos.personas as Persona[]).length).toBe(1);
  });
});
