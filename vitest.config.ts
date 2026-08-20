import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    // Los tests corren en el huso del usuario, NO en UTC.
    //
    // Corriendo en UTC toda una familia de errores es invisible: `toISOString()`
    // sobre una fecha local, contar días restando milisegundos, el último día
    // del mes… En UTC todo eso cuadra, y en Europe/Madrid se va un día o una
    // hora. Llegó a producción un motor que colocaba CADA día de pago un día
    // antes —`dia:1` de noviembre caía el 31 de octubre, y `dia:1` de enero en
    // el 31 de diciembre del año anterior— con 626 tests en verde.
    //
    // Con desfase positivo y horario de verano, este huso detecta las dos cosas.
    // No lo cambies a UTC para "arreglar" un test que falle: si falla aquí y no
    // en UTC, el fallo es real y lo sufre el usuario.
    env: { TZ: 'Europe/Madrid' },
    include: ['tests/**/*.test.{ts,js}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'finance-math/**/*.js', 'common/state.js'],
      // `main.ts` es el arranque del bundle: publica en `window` y solo tiene
      // sentido ejecutado en un navegador, donde se verifica de punta a punta.
      exclude: ['src/main.ts'],
      reporter: ['text', 'lcov', 'html'],
      // Suelos, no fotos del estado actual: se fijan en los objetivos del plan
      // (docs/02-plan-refactor.md, tarea 3.5) para que el margen que haya por
      // encima se pueda gastar sin que el CI se ponga rojo por un decimal.
      thresholds: {
        lines: 85,
        branches: 75,
        'src/core/**/*.ts': { lines: 95, branches: 90 },
      },
    },
  },
});
