// Depends on: DashboardModule, AccountsModule, NominasModule, EscenariosModule, RentasModule
//
// Durante la migración a src/ este router aloja DOS tipos de vista:
//   · las legacy, declaradas en `views`/`mods` aquí abajo;
//   · las del paquete nuevo, registradas en window.FinanceApp.app (ver
//     src/app/feature-registry.ts), que se montan solas y traen su propio
//     contenedor y su botón de sidebar.
// Cuando todas las vistas estén portadas, este fichero se sustituye por el
// router de src/app/ (docs/02-plan-refactor.md, tarea 1.7).
const Router = (() => {
  // margenes, inflacion, expenses y loans se han portado a src/features/ (tarea 1.7)
  const views=['dashboard','accounts','nominas','escenarios','rentas'];
  const mods={ dashboard:DashboardModule, accounts:AccountsModule, nominas:NominasModule, escenarios:EscenariosModule, rentas:RentasModule };
  let _current = 'dashboard';
  // Registro de vistas del paquete nuevo (ausente si el bundle no está compilado)
  const _nuevas = () => window.FinanceApp?.app ?? null;
  function _esNueva(view) { return !!_nuevas()?.has(view); }
  function _todasLasRutas() { return [...views, ...(_nuevas()?.routes() ?? [])]; }
  function navigate(view) {
    if(!views.includes(view) && !_esNueva(view))return;
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
