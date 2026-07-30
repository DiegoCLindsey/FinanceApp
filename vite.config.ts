import { defineConfig } from 'vite';
import { resolve } from 'path';

// Build del paquete nuevo (src/) como un único script clásico que la app
// estática carga antes de los módulos legacy (ver src/main.ts).
//
// Se emite a `assets/financeapp-core.js` con nombre fijo (sin hash) para que
// `index.html` lo referencie directamente y el despliegue estático de GitHub
// Pages siga funcionando sin plantillas ni manifiestos.
//
// El fichero generado está en .gitignore: se compila en CI antes de desplegar y
// en local con `npm run build`. La app legacy funciona igual si no existe
// (nada legacy depende todavía de window.FinanceApp).
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'assets'),
    emptyOutDir: false, // assets/ puede contener recursos estáticos versionados
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      // OJO: el wrapper IIFE asigna `window[name] = exports` DESPUÉS de ejecutar
      // el módulo, así que este nombre no puede ser `FinanceApp` — sobrescribiría
      // el namespace que publica src/main.ts.
      name: 'FinanceAppBundle',
      formats: ['iife'],
      fileName: () => 'financeapp-core.js',
    },
  },
});
