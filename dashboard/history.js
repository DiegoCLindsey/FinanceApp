// Depends on: State, FinanceMath, UI
// History is now embedded in Dashboard. Module kept for utility functions only.
const HistoryModule = (() => {
  let histChart = null;

  function destroyChart() { try { histChart?.destroy(); } catch {} histChart = null; }

  function render() {
    destroyChart();
    const view=document.getElementById('view-history'); if(!view) return;
    const accounts=State.get('accounts');
    // Collect all historial points from accounts (new approach: per-account)
    // Also keep old standalone history records for backwards compat
    const standalonHistory=State.get('history')||[];

    // Merge all historial points: from accounts and standalone
    const allPoints = [];
    for (const acc of accounts) {
      for (const h of (acc.historicoSaldos||[])) {
        allPoints.push({ ...h, cuentaNombre: acc.nombre, cuentaId: acc._id });
      }
    }
    // Standalone (legacy)
    for (const r of standalonHistory) {
      allPoints.push({ _id: r._id, fecha: `${r.anio}-${String(r.mes).padStart(2,'0')}-01`, saldo: r.close, nota: `Open:${r.open} H:${r.high} L:${r.low}`, cuentaNombre: r.cuenta, cuentaId: null, _legacy: true, ...r });
    }

    // Group by account
    const byAccount = {};
    for (const p of allPoints) {
      const key = p.cuentaNombre;
      if (!byAccount[key]) byAccount[key] = { id: p.cuentaId, points: [] };
      byAccount[key].points.push(p);
    }

    const config = State.get('config');
    const loans = State.get('loans'), expenses = State.get('expenses');

    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Historial <span>comparativo</span></h1>
        <button class="btn-primary" id="btn-new-ohlc">+ Registro OHLC</button>
      </div>

      <!-- Chart: Estimado vs Real -->
      <div class="card mb-14">
        <div class="card-title">Saldo estimado vs histórico real</div>
        <div class="chart-wrap-lg"><canvas id="chart-hist-comparison"></canvas></div>
      </div>

      <!-- Per-account historical tables -->
      ${Object.entries(byAccount).map(([nombre, data])=>`
        <div class="card mb-14">
          <div class="card-title">${nombre}</div>
          <div style="display:grid;grid-template-columns:110px 1fr 2fr auto;gap:8px;padding:6px 8px;border-bottom:1px solid var(--border2);font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <span>Fecha</span><span>Saldo</span><span>Nota</span><span></span>
          </div>
          ${data.points.sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(p=>`
            <div style="display:grid;grid-template-columns:110px 1fr 2fr auto;gap:8px;padding:8px;border-bottom:1px solid var(--border);align-items:center">
              <span class="num">${p.fecha}</span>
              <span class="num">${FinanceMath.eur(p.saldo)}</span>
              <span class="text-sm">${p.nota||''}</span>
              <div class="flex gap-8">
                ${p._legacy?`<span class="badge badge-inactive">OHLC</span>`:''} 
                ${!p._legacy&&p.cuentaId?`<button class="btn-danger btn-sm" onclick="HistoryModule.deleteAccHist('${p.cuentaId}','${p._id}')">✕</button>`:''}
                ${p._legacy?`<button class="btn-danger btn-sm" onclick="HistoryModule.deleteRecord('${p._id}')">✕</button>`:''}
              </div>
            </div>`).join('')}
        </div>`).join('')}

      ${Object.keys(byAccount).length===0?'<div class="text-sm" style="text-align:center;padding:40px">Sin registros históricos. Añade puntos de control en la sección Cuentas o usa el botón OHLC.</div>':''}
    `;

    document.getElementById('btn-new-ohlc').onclick=()=>openOHLCForm(accounts);
    setTimeout(()=>renderComparisonChart(accounts, config, loans, expenses, allPoints), 60);
  }

  function renderComparisonChart(accounts, config, loans, expenses, allPoints) {
    destroyChart();
    const ctx = document.getElementById('chart-hist-comparison'); if (!ctx) return;

    // Generate estimated line across full range of history + config period
    // Use all dates to determine range
    const allDates = allPoints.map(p=>p.fecha).filter(Boolean).sort();
    const estimStart = allDates.length>0 ? allDates[0] : config.dashboardStart;
    const estimEnd = config.dashboardEnd;

    const extConfig = { ...config, dashboardStart: estimStart, dashboardEnd: estimEnd };
    const extracto = FinanceMath.generarExtracto(loans, expenses, accounts, extConfig, null);

    // Estimated line dataset
    const estimData = extracto.map(e=>({ x: new Date(e.fecha+'T00:00:00').getTime(), y: e.saldoAcum }));

    // Real points per account — scatter datasets
    const COLORS = ['#ffd166','#4d9fff','#fb923c','#a855f7','#f472b6','#34d399'];
    const byAccount = {};
    for (const p of allPoints) {
      const k = p.cuentaNombre;
      if (!byAccount[k]) byAccount[k] = [];
      byAccount[k].push({ x: new Date(p.fecha+'T00:00:00').getTime(), y: p.saldo });
    }

    const datasets = [
      {
        label: 'Estimado (todas las cuentas)',
        data: estimData,
        type: 'line',
        borderColor: '#00e5a0',
        backgroundColor: 'rgba(0,229,160,0.07)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHitRadius: 16,
        borderWidth: 2,
        order: 10,
      },
      ...Object.entries(byAccount).map(([nombre, pts], i) => ({
        label: nombre,
        data: pts.sort((a,b)=>a.x-b.x),
        type: 'scatter',
        backgroundColor: COLORS[i % COLORS.length],
        borderColor: COLORS[i % COLORS.length],
        pointRadius: 6,
        pointHoverRadius: 9,
        showLine: pts.length > 1,
        borderWidth: 1.5,
        borderDash: [4,3],
        order: i,
      }))
    ];

    histChart = new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#8b92a8', font: { size: 11 }, boxWidth: 12 } },
          tooltip: {
            backgroundColor: '#13161e', borderColor: '#252a38', borderWidth: 1,
            titleColor: '#8b92a8', bodyColor: '#e8eaf2',
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y)}` }
          }
        },
        scales: {
          x: { type: 'time', time: { unit: 'month' }, ticks: { color: '#555d77' }, grid: { color: '#252a38' } },
          y: { ticks: { color: '#555d77', callback: v => FinanceMath.eur(v) }, grid: { color: '#252a38' } }
        }
      }
    });
  }

  function openOHLCForm(accounts) {
    const now=new Date();
    const cuentaOpts=accounts.map(a=>[a.nombre,a.nombre]);
    const html=`
      <div class="grid-2">
        ${accounts.length>0?UI.select('oh-cuenta','Cuenta',cuentaOpts,accounts[0]?.nombre):UI.input('oh-cuenta-txt','Nombre cuenta','text','','Ej: ING Nómina')}
        <div class="grid-2" style="gap:8px">${UI.input('oh-anio','Año','number',now.getFullYear())}${UI.input('oh-mes','Mes','number',now.getMonth()+1)}</div>
      </div>
      <div class="grid-4 mt-8">${UI.input('oh-open','Open','number','','5000')}${UI.input('oh-close','Close','number','','5200')}${UI.input('oh-high','High','number','','5500')}${UI.input('oh-low','Low','number','','4900')}</div>
      <div class="auth-hint mt-8">El valor <strong>Close</strong> se usa como saldo del punto en la gráfica comparativa.</div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="HistoryModule.saveRecord(${accounts.length>0})">Guardar</button>
      </div>`;
    UI.openModal(html,'Nuevo registro OHLC (legacy)');
  }

  function saveRecord(hasAccounts) {
    const cuentaEl=hasAccounts?document.getElementById('oh-cuenta'):document.getElementById('oh-cuenta-txt');
    const rec={ cuenta:cuentaEl?.value?.trim()||'', anio:parseInt(document.getElementById('oh-anio').value), mes:parseInt(document.getElementById('oh-mes').value), open:parseFloat(document.getElementById('oh-open').value), close:parseFloat(document.getElementById('oh-close').value), high:parseFloat(document.getElementById('oh-high').value), low:parseFloat(document.getElementById('oh-low').value) };
    if (!rec.cuenta||[rec.open,rec.close,rec.high,rec.low].some(isNaN)) { UI.toast('Completa todos los campos','err'); return; }
    State.addItem('history',rec); UI.toast('Registro añadido'); UI.closeModal(); render();
  }

  function deleteRecord(id) { if(!UI.confirm('¿Eliminar?'))return; State.removeItem('history',id); render(); }

  function deleteAccHist(accId, hId) {
    const acc=State.get('accounts').find(a=>a._id===accId);
    if (!acc) return;
    const hist=(acc.historicoSaldos||[]).filter(h=>h._id!==hId);
    State.updateItem('accounts',accId,{historicoSaldos:hist});
    UI.toast('Eliminado'); render();
  }

  return { render, saveRecord, deleteRecord, deleteAccHist };
})();
