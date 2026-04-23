// Depends on: State, FinanceMath, UI
const CalendarModule = (() => {
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  function render() {
    const view = document.getElementById('view-calendar'); if(!view) return;
    const config   = State.get('config');
    const loans    = State.get('loans');
    const expenses = State.get('expenses');
    const accounts = State.get('accounts');
    const today    = new Date().toISOString().slice(0,10);

    // Generate events for the full month
    const firstDay = new Date(currentYear, currentMonth, 1).toISOString().slice(0,10);
    const lastDay  = new Date(currentYear, currentMonth+1, 0).toISOString().slice(0,10);
    const monthConfig = { ...config, dashboardStart: firstDay, dashboardEnd: lastDay };
    const events = FinanceMath.generarExtracto(loans, expenses, accounts, monthConfig);

    // Group events by date
    const byDate = {};
    for (const ev of events) {
      if (!byDate[ev.fecha]) byDate[ev.fecha] = [];
      byDate[ev.fecha].push(ev);
    }

    // Calendar grid
    const firstWeekday = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth  = new Date(currentYear, currentMonth+1, 0).getDate();
    const prevMonthDays= new Date(currentYear, currentMonth, 0).getDate();
    const dayNames = ['D','L','M','X','J','V','S'];
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    let cells = '';
    // Leading days from previous month
    for (let d = firstWeekday-1; d >= 0; d--) {
      cells += `<div class="cal-day other-month"><div class="cal-day-num">${prevMonthDays-d}</div></div>`;
    }
    // Current month days
    for (let d=1; d<=daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dayEvs  = byDate[dateStr] || [];
      const isToday = dateStr === today;
      const hasCrit = dayEvs.some(e=>e.tipo==='gasto' && Math.abs(e.cuantia)>500);
      const chips   = dayEvs.slice(0,3).map(ev => {
        let cls = ev.sourceType==='loan'||ev.sourceType==='loan-amort' ? 'prestamo' :
                  ev.tipo==='transferencia'||ev.sourceType?.startsWith('transfer') ? 'transferencia' :
                  ev.tipo==='ingreso' ? 'ingreso' : 'gasto';
        return `<div class="cal-chip ${cls}" title="${ev.concepto}: ${FinanceMath.eur(ev.cuantia)}">${ev.concepto.slice(0,14)}</div>`;
      }).join('');
      const more = dayEvs.length > 3 ? `<div class="cal-chip" style="background:var(--bg3);color:var(--text3)">+${dayEvs.length-3}</div>` : '';
      cells += `<div class="cal-day ${isToday?'today':''} ${hasCrit?'has-critical':''}" onclick="CalendarModule.showDay('${dateStr}')">
        <div class="cal-day-num">${d}</div>
        ${chips}${more}
      </div>`;
    }
    // Trailing days
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    for (let d=1; d <= totalCells - firstWeekday - daysInMonth; d++) {
      cells += `<div class="cal-day other-month"><div class="cal-day-num">${d}</div></div>`;
    }

    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Calen<span>dario</span></h1>
      </div>
      <div class="cal-nav">
        <button class="btn-icon" onclick="CalendarModule.prevMonth()"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>
        <span class="cal-month-title">${monthNames[currentMonth]} ${currentYear}</span>
        <button class="btn-icon" onclick="CalendarModule.nextMonth()"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>
        <button class="btn-secondary btn-sm" onclick="CalendarModule.goToday()">Hoy</button>
      </div>
      <div class="cal-header">${dayNames.map(d=>`<div class="cal-day-name">${d}</div>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
    `;
  }

  function showDay(dateStr) {
    const config   = State.get('config');
    const loans    = State.get('loans');
    const expenses = State.get('expenses');
    const accounts = State.get('accounts');
    const dayConfig = { ...config, dashboardStart: dateStr, dashboardEnd: dateStr };
    const events   = FinanceMath.generarExtracto(loans, expenses, accounts, dayConfig)
      .filter(e=>e.fecha===dateStr);
    if (!events.length) { UI.toast('Sin movimientos este día'); return; }
    const total = events.reduce((s,e)=>s+(e.tipo==='ingreso'?e.cuantia:-e.cuantia),0);
    const html = `
      <div class="card-title">Movimientos del ${dateStr}</div>
      ${events.map(ev=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:13px">${ev.concepto}</span>
        <span class="num ${ev.tipo==='ingreso'?'pos':'neg'}">${ev.tipo==='ingreso'?'+':'−'}${FinanceMath.eur(Math.abs(ev.cuantia))}</span>
      </div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding:10px 0;font-weight:600">
        <span>Balance del día</span><span class="num ${total>=0?'pos':'neg'}">${total>=0?'+':''}${FinanceMath.eur(total)}</span>
      </div>
      <div class="flex gap-8 mt-8" style="justify-content:flex-end"><button class="btn-secondary" onclick="UI.closeModal()">Cerrar</button></div>`;
    UI.openModal(html, `📅 ${dateStr}`);
  }

  function prevMonth() { currentMonth--; if(currentMonth<0){currentMonth=11;currentYear--;} render(); }
  function nextMonth() { currentMonth++; if(currentMonth>11){currentMonth=0;currentYear++;} render(); }
  function goToday()   { const n=new Date(); currentYear=n.getFullYear(); currentMonth=n.getMonth(); render(); }

  return { render, showDay, prevMonth, nextMonth, goToday };
})();
