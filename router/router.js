// Depends on: DashboardModule, EscenariosModule, RentasModule
//
// Durante la migración a src/ este router aloja DOS tipos de vista:
//   · las legacy, declaradas en `views`/`mods` aquí abajo;
//   · las del paquete nuevo, registradas en window.FinanceApp.app (ver
//     src/app/feature-registry.ts), que se montan solas y traen su propio
//     contenedor y su botón de sidebar.
// Cuando todas las vistas estén portadas, este fichero se sustituye por el
// router de src/app/ (docs/02-plan-refactor.md, tarea 1.7).
const Router = (() => {
  // margenes, inflacion, expenses, loans, nominas y accounts (+goals) se han
  // portado a src/features/ (1.7)
  //
  // `mods` se construye con guardas `typeof` a propósito: si el navegador sirve
  // un index.html y un router.js de despliegues distintos, un módulo legacy
  // puede no estar cargado. Referenciarlo directo lanzaría un ReferenceError
  // aquí y dejaría `Router` sin definir — es decir, la aplicación entera muerta.
  //
  // Tiene que ser `typeof <identificador>` y NO `window['<nombre>']`: los módulos
  // legacy se declaran con `const` en el ámbito global, y una declaración `const`
  // de nivel superior NO crea propiedad en `window`. Buscarlos ahí devuelve
  // undefined para todos y deja las vistas en blanco.
  const views=['dashboard','escenarios','rentas'];
  const mods={
    dashboard: typeof DashboardModule !== 'undefined' ? DashboardModule : null,
    escenarios:typeof EscenariosModule!== 'undefined' ? EscenariosModule: null,
    rentas:    typeof RentasModule    !== 'undefined' ? RentasModule    : null,
  };
  let _current = 'dashboard';
  // Registro de vistas del paquete nuevo (ausente si el bundle no está compilado)
  const _nuevas = () => window.FinanceApp?.app ?? null;
  function _esNueva(view) { return !!_nuevas()?.has(view); }
  /** Registrada en el paquete nuevo pero apagada por su feature flag. */
  function _desactivada(view) { const r=_nuevas(); return !!r && !r.has(view) && view in (r.flagPorRuta?.() ?? {}); }
  function _todasLasRutas() { return [...views, ...(_nuevas()?.routes() ?? [])]; }
  function navigate(view) {
    if (!views.includes(view) && !_esNueva(view)) {
      // Nunca en silencio: un botón que no hace nada es lo más difícil de
      // diagnosticar. Puede ser una vista desactivada, o un despliegue servido
      // a medias desde la caché del navegador.
      if (_desactivada(view)) {
        UI.toast('Esa funcionalidad está desactivada. Actívala en Funcionalidades.', 'warn');
      } else {
        console.error(`[Router] La vista "${view}" no está disponible. Suele indicar que el navegador ha mezclado ficheros de dos versiones; recarga sin caché.`);
        UI.toast('Esta vista no se ha podido cargar. Recarga la página.', 'err');
      }
      return;
    }
    _current = view;
    _todasLasRutas().forEach(v=>document.getElementById(`view-${v}`)?.classList.toggle('hidden',v!==view));
    document.querySelectorAll('.nav-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
    if (_esNueva(view)) _nuevas().mount(view);
    else mods[view]?.render();
    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.add('hidden');
  }
  function rerender() {
    if (_esNueva(_current)) _nuevas().mount(_current);
    else mods[_current]?.render();
  }
  // El botón de Funcionalidades vive en el shell legacy, pero la ventana la
  // sirve el paquete nuevo. Si el paquete no está disponible hay que explicarle
  // al usuario qué ha pasado — no darle instrucciones de compilación.
  function _escapar(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function _abrirFuncionalidades() {
    if (window.FinanceApp?.ui?.openFeatures) { window.FinanceApp.ui.openFeatures(); return; }
    const detalle = window.FinanceAppError
      ? `<p>El módulo se ha descargado pero no ha podido arrancar:</p>
         <p style="font-family:var(--font-mono);font-size:12px;color:var(--red);word-break:break-word">${_escapar(window.FinanceAppError.mensaje)}</p>`
      : `<p>El módulo no se ha podido descargar. Suele deberse a una copia antigua
          guardada en el navegador o a una conexión interrumpida.</p>`;
    UI.openModal(
      `${detalle}
       <p class="mt-12">Tus datos están intactos: el resto de la aplicación sigue funcionando con normalidad.</p>
       <div class="flex gap-8 mt-12" style="justify-content:flex-end">
         <button class="btn-secondary" onclick="UI.closeModal()">Cerrar</button>
         <button class="btn-primary" id="btn-features-recargar">Recargar sin caché</button>
       </div>`,
      'Funcionalidades no disponibles'
    );
    document.getElementById('btn-features-recargar')?.addEventListener('click',()=>{
      // Fuerza a revalidar index.html y el bundle en vez de servirlos de caché
      const u = new URL(window.location.href);
      u.searchParams.set('_r', Date.now().toString(36));
      window.location.replace(u.toString());
    });
  }

  function init() {
    // Las vistas nuevas insertan su contenedor y su botón antes de cablear clicks
    _nuevas()?.attachToShell();
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn=>btn.onclick=()=>navigate(btn.dataset.view));
    document.getElementById('btn-features')?.addEventListener('click',_abrirFuncionalidades);
    // Mobile menu
    document.getElementById('mobile-menu-btn')?.addEventListener('click',()=>{
      const sb=document.getElementById('sidebar'), ov=document.getElementById('sidebar-overlay');
      sb.classList.toggle('open'); ov.classList.toggle('hidden',!sb.classList.contains('open'));
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click',()=>{
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('sidebar-overlay')?.classList.add('hidden');
    });
    window.FinanceApp?.ui?.applyGating?.();
    navigate('dashboard');
  }
  return { init, navigate, rerender };
})();

// `const Router` en el ámbito global NO crea `window.Router`: las declaraciones
// léxicas de nivel superior viven en el registro declarativo, no en el objeto
// global. Hay dos consumidores que sí lo buscan ahí porque no comparten ámbito
// con este script — el botón de sidebar que crea el registro de features y el
// re-render tras cambiar un flag (src/app/feature-registry.ts, src/main.ts) —,
// así que se publica explícitamente. Sin esto ambos fallaban en silencio.
window.Router = Router;
