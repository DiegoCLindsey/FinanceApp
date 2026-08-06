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
