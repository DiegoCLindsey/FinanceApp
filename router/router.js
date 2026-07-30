// Depends on: DashboardModule, LoansModule, ExpensesModule, AccountsModule
//
// Durante la migración a src/ este router aloja DOS tipos de vista:
//   · las legacy, declaradas en `views`/`mods` aquí abajo;
//   · las del paquete nuevo, registradas en window.FinanceApp.app (ver
//     src/app/feature-registry.ts), que se montan solas y traen su propio
//     contenedor y su botón de sidebar.
// Cuando todas las vistas estén portadas, este fichero se sustituye por el
// router de src/app/ (docs/02-plan-refactor.md, tarea 1.7).
const Router = (() => {
  // 'margenes' se ha portado a src/features/margins (tarea 1.7)
  const views=['dashboard','loans','expenses','accounts','nominas','inflacion','escenarios','rentas'];
  const mods={ dashboard:DashboardModule, loans:LoansModule, expenses:ExpensesModule, accounts:AccountsModule, nominas:NominasModule, inflacion:InflacionModule, escenarios:EscenariosModule, rentas:RentasModule };
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
  function init() {
    // Las vistas nuevas insertan su contenedor y su botón antes de cablear clicks
    _nuevas()?.attachToShell();
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn=>btn.onclick=()=>navigate(btn.dataset.view));
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
