import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    root: resolve(__dirname, 'src/v2'),
    base: env.VITE_BASE_URL ?? '/',
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/v2'),
      },
    },
  };
});
