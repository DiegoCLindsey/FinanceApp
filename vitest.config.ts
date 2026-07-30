import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.{ts,js}'],
    coverage: {
      provider: 'v8',
      include: ['finance-math/**/*.js', 'common/state.js'],
      reporter: ['text', 'lcov', 'html'],
      // Thresholds se activan en Fase 3 (ver docs/02-plan-refactor.md, tarea 3.5)
    },
  },
});
