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
      reporter: ['text', 'lcov', 'html'],
      // Thresholds se activan en Fase 3 (ver docs/02-plan-refactor.md, tarea 3.5)
    },
  },
});
