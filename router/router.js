// Depends on: DashboardModule, LoansModule, ExpensesModule, AccountsModule, CalendarModule
const Router = (() => {
  const views=['dashboard','loans','expenses','accounts','calendar'];
  const mods={ dashboard:DashboardModule, loans:LoansModule, expenses:ExpensesModule, accounts:AccountsModule, calendar:CalendarModule };
  function navigate(view) {
    if(!views.includes(view))return;
    views.forEach(v=>document.getElementById(`view-${v}`).classList.toggle('hidden',v!==view));
    document.querySelectorAll('.nav-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
    mods[view]?.render();
    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.add('hidden');
  }
  function init() {
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
    navigate('dashboard');
  }
  return { init, navigate };
})();
