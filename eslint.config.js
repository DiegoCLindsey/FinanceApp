import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.ts', 'tests/**/*.{ts,js}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // tests/nomina.test.cjs es legado y se retira en F3 (docs/02-plan-refactor.md, 3.5)
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '_site/**', '*.config.js', 'tests/nomina.test.cjs'],
  }
);
