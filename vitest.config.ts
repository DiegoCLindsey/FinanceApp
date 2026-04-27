import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/v2'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/v2/**/*.ts'],
      exclude: [
        'src/v2/**/*.test.ts',
        'src/v2/types/**',
        'src/v2/test-utils/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
      },
      reporter: ['text', 'lcov', 'html'],
    },
    include: ['src/v2/**/*.test.ts'],
  },
});
