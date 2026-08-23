#!/usr/bin/env python3
"""Genera `qa.html` en la raíz: la aplicación real con Chart.js servido en local,
captura de errores de consola y un piloto que recorre todas las vistas midiendo
desbordes.

    python3 tools/qa/generar.py       # escribe qa.html (ignorado por git)
    python3 -m http.server 8099
    # y se abre http://localhost:8099/qa.html

Requiere las copias de Chart.js en tools/qa/vendor/ (ver tools/qa/README.md).
`qa.html?solo=<vista>` abre una sola vista y no vuelca el informe."""
import re, sys, pathlib

raiz = pathlib.Path(__file__).resolve().parent.parent.parent
html = (raiz / 'index.html').read_text(encoding='utf-8')

# 1 · Chart.js desde el CDN → copias locales (el navegador del entorno no tiene red)
html = html.replace(
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js',
    './tools/qa/vendor/chart.umd.js')
html = html.replace(
    'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js',
    './tools/qa/vendor/adapter.js')
# Fuentes: sin red tampoco, se quitan para no esperar por ellas
html = re.sub(r'<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>', '', html)

# 2 · Captura de errores ANTES que nada
captura = """<script>
window.__qa = { errores: [], avisos: [] };
(function(){
  var reg = function(tipo, txt){ window.__qa[tipo].push(String(txt).slice(0, 300)); };
  window.addEventListener('error', function(e){
    reg('errores', e.message + (e.filename ? ' @ ' + e.filename.split('/').pop() + ':' + e.lineno : ''));
  }, true);
  window.addEventListener('unhandledrejection', function(e){ reg('errores', 'promesa: ' + (e.reason && e.reason.message || e.reason)); });
  var ce = console.error, cw = console.warn;
  console.error = function(){ reg('errores', Array.prototype.join.call(arguments, ' ')); ce.apply(console, arguments); };
  console.warn  = function(){ reg('avisos',  Array.prototype.join.call(arguments, ' ')); cw.apply(console, arguments); };
})();
</script>"""
siembra = '<script src="./tools/qa/datos.js"></script>'
html = html.replace('<head>', '<head>' + captura + siembra, 1)

# 3 · Piloto: recorre las vistas y deja el informe en window.__qa.informe
piloto = """<script>
(function(){
  var esperar = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };

  function desc(el){
    var c = (el.className && typeof el.className === 'string')
      ? '.' + el.className.trim().split(/\\s+/).slice(0,3).join('.') : '';
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + c;
  }

  function medir(){
    var vw = document.documentElement.clientWidth, fuera = [], tinta = [];
    document.querySelectorAll('.view-container *').forEach(function(el){
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > vw + 1 || r.left < -1) {
        var p = el.parentElement, recortado = false;
        while (p) { var ox = getComputedStyle(p).overflowX;
          if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') { recortado = true; break; }
          p = p.parentElement; }
        if (!recortado) fuera.push(desc(el) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
      }
      // Solo HOJAS con texto real: un contenedor cuyo primer hijo es un salto
      // de línea da falsos positivos a puñados.
      if (el.children.length === 0 && el.textContent.trim().length > 0 &&
          el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0) {
        tinta.push(desc(el) + ' caja=' + el.clientWidth + ' cont=' + el.scrollWidth +
                   ' «' + el.textContent.trim().slice(0, 32) + '»');
      }
    });
    return { fuera: fuera, tinta: tinta };
  }

  async function correr(){
    await esperar(2500);
    var botones = Array.prototype.slice.call(document.querySelectorAll('.nav-btn'));
    var informe = [];
    for (var i = 0; i < botones.length; i++) {
      var b = botones[i];
      var nombre = b.textContent.trim().replace(/\\s+/g, ' ');
      var antesErr = window.__qa.errores.length, antesAvi = window.__qa.avisos.length;
      try { b.click(); } catch (e) { window.__qa.errores.push('click ' + nombre + ': ' + e.message); }
      await esperar(1400);
      var m = medir();
      var vista = document.querySelector('.view-container .view.active, .view-container .view:not(.hidden)') || document.querySelector('.view-container');
      informe.push({
        vista: nombre,
        errores: window.__qa.errores.slice(antesErr),
        avisos: window.__qa.avisos.slice(antesAvi),
        fuera: m.fuera,
        tinta: m.tinta,
        vacia: !vista || vista.textContent.trim().length < 40,
        canvas: document.querySelectorAll('.view-container canvas').length,
        botones: document.querySelectorAll('.view-container button').length
      });
    }
    window.__qa.informe = informe;
    window.__qa.listo = true;

    // Volcado legible para la captura
    var pre = document.createElement('pre');
    pre.id = 'qa-out';
    pre.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;color:#0f0;' +
      'font:11px/1.35 monospace;padding:10px;overflow:auto;white-space:pre-wrap;margin:0';
    var t = 'ancho=' + document.documentElement.clientWidth + '  vistas=' + informe.length + '\\n';
    var totalErr = 0, totalFuera = 0, totalTinta = 0;
    informe.forEach(function(v){
      totalErr += v.errores.length; totalFuera += v.fuera.length; totalTinta += v.tinta.length;
    });
    t += 'ERRORES=' + totalErr + '  DESBORDES=' + totalFuera + '  TEXTO-QUE-NO-CABE=' + totalTinta + '\\n\\n';
    informe.forEach(function(v){
      var mal = v.errores.length || v.fuera.length || v.tinta.length || v.vacia;
      t += (mal ? '✗ ' : '· ') + v.vista + '  [canvas=' + v.canvas + ' botones=' + v.botones + (v.vacia ? ' VACÍA' : '') + ']\\n';
      v.errores.forEach(function(e){ t += '    ERROR  ' + e + '\\n'; });
      v.avisos.slice(0,3).forEach(function(e){ t += '    aviso  ' + e + '\\n'; });
      v.fuera.slice(0,6).forEach(function(e){ t += '    fuera  ' + e + '\\n'; });
      v.tinta.slice(0,6).forEach(function(e){ t += '    tinta  ' + e + '\\n'; });
    });
    pre.textContent = t;
    document.body.appendChild(pre);
  }
  var solo = new URLSearchParams(location.search).get('solo');
  if (solo) {
    window.addEventListener('load', function(){
      setTimeout(function(){
        var b = Array.prototype.slice.call(document.querySelectorAll('.nav-btn'))
          .find(function(x){ return x.textContent.trim().toLowerCase().indexOf(solo.toLowerCase()) >= 0; });
        if (b) b.click();
      }, 2500);
    });
  } else {
    window.addEventListener('load', function(){ correr(); });
  }
})();
</script>
</body>"""
html = html.replace('</body>', piloto, 1)

salida = raiz / 'qa.html'
salida.write_text(html, encoding='utf-8')
print('escrito', salida)
