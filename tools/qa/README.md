# Banco de QA

Recorre **todas las vistas** de la aplicación real en un navegador sin cabecera
y comprueba tres cosas por vista:

1. **Errores de consola** — `console.error`, `window.onerror` y promesas sin
   capturar. Se enganchan antes que ningún script de la aplicación.
2. **Desbordes** — elementos cuyo rectángulo se sale del viewport sin que
   ningún ancestro los recorte con `overflow-x`.
3. **Texto que no cabe en su caja** — hojas con texto cuyo `scrollWidth` supera
   su `clientWidth`. Esto detecta lo que el punto 2 no ve: un importe que se
   pinta fuera de su tarjeta sin ensanchar el documento.

## Uso

```bash
# 1 · Copias locales de Chart.js (el navegador del entorno no tiene salida a
#     internet; el registro de npm sí es accesible)
mkdir -p tools/qa/vendor && cd /tmp
npm pack chart.js@4.4.3 && tar xzf chart.js-4.4.3.tgz
npm pack chartjs-adapter-date-fns@3.0.0 && tar xzf chartjs-adapter-date-fns-3.0.0.tgz
cp package/dist/chart.umd.js               <repo>/tools/qa/vendor/
cp package/dist/chartjs-adapter-date-fns.bundle.min.js <repo>/tools/qa/vendor/adapter.js

# 2 · Generar y servir
cd <repo>
npm run build
python3 tools/qa/generar.py     # escribe qa.html en la raíz
python3 -m http.server 8099

# 3 · Escritorio
/opt/pw-browsers/chromium --headless --no-sandbox --hide-scrollbars \
  --force-prefers-reduced-motion --window-size=1400,600 \
  --virtual-time-budget=50000 --screenshot=qa.png \
  "http://localhost:8099/qa.html"

# 4 · Móvil (ver más abajo por qué hace falta el iframe)
/opt/pw-browsers/chromium --headless --no-sandbox --hide-scrollbars \
  --force-prefers-reduced-motion --window-size=1400,600 \
  --virtual-time-budget=50000 --screenshot=qa-movil.png \
  "http://localhost:8099/tools/qa/movil.html"
```

`qa.html?solo=cuentas` abre esa vista y **no** vuelca el informe, para poder
mirarla con calma.

`qa.html` y `tools/qa/vendor/` están en `.gitignore`: son artefactos.

## Tres trampas del entorno sin cabecera

- **`--window-size` no baja de 500 px de viewport.** Chromium lo recorta ahí:
  pedir 390 renderiza a 500 y luego recorta la imagen, así que todo parece
  desbordar. Por eso el modo móvil mete la aplicación en un `<iframe>` de
  390 px, que sí crea su propio viewport. `tools/qa/movil.html` hace eso y
  copia el informe de dentro hacia fuera.
- **El navegador no tiene red.** Sin las copias locales de Chart.js los
  `<canvas>` se quedan en sus 300×150 por defecto y aparecen como desbordes que
  en producción no existen. Las fuentes de Google tampoco cargan: las capturas
  salen con una tipografía de reserva y el maquetado es algo más ancho que el
  real, o sea que el informe peca de estricto, no de laxo.
- **`--virtual-time-budget` congela las animaciones.** Un modal capturado a
  media animación `pop-in` parece translúcido y no lo es. De ahí
  `--force-prefers-reduced-motion`.

## Datos

`tools/qa/datos.js` siembra `localStorage` antes de que arranque la aplicación:
cuatro cuentas (corriente, ahorro remunerado, fondo indexado y plan de
pensiones), ocho gastos e ingresos de periodicidades distintas, dos nóminas
encadenadas, dos préstamos —uno con amortización extraordinaria—, inflación por
años y un escenario. Está pensado para que ninguna vista salga vacía.
