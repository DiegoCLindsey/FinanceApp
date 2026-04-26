// Depends on: State, FinanceMath, UI
const DashboardModule = (() => {
  let charts={}, ventana='mes', activeTags=new Set(), filtroAccounts=[];
  // colchon + historial toggles driven from config, no local state needed

  function destroyCharts() { Object.values(charts).forEach(c=>{try{c.destroy();}catch{}}); charts={}; }

  function renderScoreGauge(score) {
    // Score summary number
    const summary = `<div style="text-align:center;padding:12px 0 16px">
      <div style="font-family:var(--font-mono);font-size:42px;font-weight:700;line-height:1;color:${score.color}">${score.total}</div>
      <div style="font-size:11px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;margin-top:5px">${score.label}</div>
      <div style="display:flex;justify-content:center;gap:4px;margin-top:8px">
        ${[20,40,60,80,100].map(v=>`<div style="width:24px;height:4px;border-radius:2px;background:${score.total>=v?score.color:'var(--border2)'}"></div>`).join('')}
      </div>
    </div>`;

    // 4 metric cards
    const cards = Object.entries(score.metricas).map(([key, m]) => `
      <div class="score-item" onclick="DashboardModule.toggleScoreDetail('${key}')">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div class="score-item-label">${m.label}</div>
          <div style="width:8px;height:8px;border-radius:50%;background:${m.color};flex-shrink:0"></div>
        </div>
        <div class="score-item-val" style="color:${m.color}">${m.valor}</div>
        ${m.pcts.map(p=>`<div style="font-size:10px;color:var(--text3);margin-top:2px">${p}</div>`).join('')}
        <div id="score-detail-${key}" class="hidden" style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);font-size:11px;color:var(--text2);line-height:1.6">${m.rec}</div>
      </div>`).join('');

    return `<div class="score-gauge">${summary}<div class="score-breakdown">${cards}</div></div>`;
  }

  function toggleScoreDetail(key) {
    const el = document.getElementById(`score-detail-${key}`);
    if (el) el.classList.toggle('hidden');
  }

  function toggleExecSummary() {
    const cfg = State.get('config');
    State.set('config', {...cfg, showExecSummary: !cfg.showExecSummary});
    render();
  }

  function render() {
    destroyCharts();
    const view=document.getElementById('view-dashboard');
    const config=State.get('config');
    const loans=State.get('loans'), expenses=State.get('expenses'), accounts=State.get('accounts');

    // Apply inflation and IRPF on top of base extracto
    let extracto=FinanceMath.generarExtracto(loans,expenses,accounts,config, filtroAccounts.length>0?filtroAccounts:null);
    const inflGlobal = config.inflacionGlobal||0;
    if (inflGlobal > 0 || expenses.some(e=>e.inflacion>0)) {
      // Re-run with inflated cuantias — apply factor to gasto events from expense source
      const allExpEvents = extracto.filter(e=>e.sourceType==='expense');
      const inflated = FinanceMath.aplicarInflacion(allExpEvents, expenses, inflGlobal);
      const inflMap = new Map(inflated.map(e=>[e.sourceId+'_'+e.fecha, e.cuantia]));
      extracto = extracto.map(e => e.sourceType==='expense' ? {...e, cuantia: inflMap.get(e.sourceId+'_'+e.fecha)||e.cuantia} : e);
      // Recompute saldoAcum
      const cuentasActivas2 = accounts.filter(a=>a.activo&&(filtroAccounts.length===0||filtroAccounts.includes(a._id)));
      let s2 = cuentasActivas2.reduce((s,a)=>s+FinanceMath.saldoRealCuenta(a),0);
      extracto = extracto.map(ev=>{ const d=ev.tipo==='ingreso'?Math.abs(ev.cuantia):-Math.abs(ev.cuantia); s2+=d; return {...ev,delta:d,saldoAcum:s2}; });
    }
    const cuentasActivas=accounts.filter(a=>a.activo&&(filtroAccounts.length===0||filtroAccounts.includes(a._id)));
    const saldoBase=cuentasActivas.reduce((s,a)=>s+FinanceMath.saldoRealCuenta(a),0);
    const saldoFinal=extracto.length>0?extracto[extracto.length-1].saldoAcum:saldoBase;
    const saldoHoy=FinanceMath.saldoHoy(extracto, accounts, filtroAccounts.length>0?filtroAccounts:null);
    const totalGastos=extracto.filter(e=>e.tipo==='gasto').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const totalIngresos=extracto.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const mediaMensual=FinanceMath.mediaMensualGastos(extracto, config);
    const allTags=[...new Set(extracto.flatMap(e=>e.tags||[]))];
    const colchon = FinanceMath.calcColchon(expenses, config, loans);
    const score = FinanceMath.calcScore(extracto, loans, expenses, accounts, config);
    const alertas = FinanceMath.detectarPuntosCriticos(extracto, colchon).slice(0,5);
    const goals = State.get('goals') || [];
    if (activeTags.size===0) allTags.forEach(t=>activeTags.add(t));

    // ── Métricas financieras KPI ────────────────────────────────────────────────
    // Los KPIs del "mes actual" usan un extracto propio para ese mes, independiente
    // del rango del dashboard. Así funcionan aunque el mes actual esté fuera del rango.
    // La media del intervalo sí usa el extracto del dashboard.
    const hoyStr        = new Date().toISOString().slice(0,10);
    const mesActualLabel = hoyStr.slice(0,7);
    const mesIni = mesActualLabel + '-01';
    const mesFin = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).toISOString().slice(0,10);

    // Extracto específico del mes actual (misma lógica: filtroAccounts, saldoReal, sin transferencias)
    const cfgMesActual = { ...config, dashboardStart: mesIni, dashboardEnd: mesFin };
    const extractoMesActual = FinanceMath.generarExtracto(
      loans, expenses, accounts, cfgMesActual,
      filtroAccounts.length > 0 ? filtroAccounts : null
    );
    // Mismo filtro que el gráfico breakdown: sin transferencias
    const evsMesActual = extractoMesActual.filter(e =>
      e.sourceType !== 'transfer-out' && e.sourceType !== 'transfer-in'
    );

    const ingresosMesActual      = evsMesActual.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const cuotasMesActual        = evsMesActual.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const gastosBasicosMesActual = evsMesActual.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const gastosOtrosMesActual   = evsMesActual.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return !ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const gastosTosMesActual     = cuotasMesActual + gastosBasicosMesActual + gastosOtrosMesActual;

    const dS = new Date(config.dashboardStart+'T00:00:00');
    const dE = new Date(config.dashboardEnd+'T00:00:00');
    const numMeses = Math.max(1, (dE - dS) / (30.44*86400000));

    // Media mensual en el intervalo del dashboard (extracto del dashboard, sin transferencias)
    const evSinTransf        = extracto.filter(e=>e.sourceType!=='transfer-out'&&e.sourceType!=='transfer-in');
    const ingresosMediaMes   = evSinTransf.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0) / numMeses;
    const cuotasMediaMes          = evSinTransf.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto').reduce((s,e)=>s+Math.abs(e.cuantia),0) / numMeses;
    const amortizacionesMediaMes  = evSinTransf.filter(e=>e.sourceType==='loan-amort').reduce((s,e)=>s+Math.abs(e.cuantia),0) / numMeses;
    const gastosMediaMes          = evSinTransf.filter(e=>e.tipo==='gasto'&&e.sourceType!=='loan'&&e.sourceType!=='loan-amort').reduce((s,e)=>s+Math.abs(e.cuantia),0) / numMeses;
    const gastosBasicosMediaMes = evSinTransf.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0) / numMeses;

    // Alias para los paneles KPI
    const gastosFijosMes    = gastosTosMesActual;
    const gastosBasicosMes  = gastosBasicosMesActual;
    const ingresosMensuales = ingresosMesActual;

    // ── Cálculos de préstamos compartidos ────────────────────────────────────────
    const loansActivos = loans.filter(l => l.activo && !l.simulacion && (l.fechaInicio||'') <= config.dashboardEnd);
    const _deudaEnFecha = (fecha) => loansActivos.reduce((s, l) => {
      const { tabla } = FinanceMath.resumenPrestamo(l);
      const rows = tabla.filter(r => !r.esAmortizacion && r.fecha <= fecha);
      return s + (rows.length > 0 ? rows[rows.length-1].capitalPendiente : (l.capital||0));
    }, 0);
    const deudaInicio = _deudaEnFecha(config.dashboardStart);
    const deudaFin    = _deudaEnFecha(config.dashboardEnd);
    const ahorroIntereses = loansActivos.reduce((s, l) => {
      const amortsPeriodo = (l.amortizaciones||[]).filter(a => a.fecha>=config.dashboardStart && a.fecha<=config.dashboardEnd);
      if (!amortsPeriodo.length) return s;
      const conAmorts = FinanceMath.resumenPrestamo(l).totalIntereses;
      const loanSin   = { ...l, amortizaciones: (l.amortizaciones||[]).filter(a => a.fecha<config.dashboardStart || a.fecha>config.dashboardEnd) };
      return s + Math.max(0, FinanceMath.resumenPrestamo(loanSin).totalIntereses - conAmorts);
    }, 0);
    const ahorroInteresesMes = numMeses > 0 ? ahorroIntereses / numMeses : 0;
    const loansFinEnPeriodo  = loansActivos.map(l => {
      const { fechaFin } = FinanceMath.resumenPrestamo(l);
      if (!fechaFin || fechaFin < config.dashboardStart || fechaFin > config.dashboardEnd) return null;
      return { loan: l, fechaFin };
    }).filter(Boolean);
    // Cashflow mensual (capacidad de ahorro = ingresos − gastos − cuotas, sin amortizaciones ni transferencias)
    const mesesCf = [...new Set(extracto.filter(e=>e.fecha>=config.dashboardStart&&e.fecha<=config.dashboardEnd).map(e=>e.fecha.slice(0,7)))].sort();
    const cashflowPorMes = mesesCf.map(mes => {
      const ini  = mes+'-01';
      const fin  = new Date(parseInt(mes.slice(0,4)), parseInt(mes.slice(5,7)), 0).toISOString().slice(0,10);
      const evs  = extracto.filter(e=>e.fecha>=ini&&e.fecha<=fin&&e.sourceType!=='transfer-out'&&e.sourceType!=='transfer-in');
      const ing    = evs.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0);
      const gastos = evs.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').reduce((s,e)=>s+Math.abs(e.cuantia),0);
      const cuotas = evs.filter(e=>e.tipo==='gasto'&&e.sourceType==='loan').reduce((s,e)=>s+Math.abs(e.cuantia),0);
      return { mes, cf: ing - gastos - cuotas };
    });
    const cfInicio = cashflowPorMes[0]?.cf ?? 0;
    const cfFin    = cashflowPorMes[cashflowPorMes.length-1]?.cf ?? 0;
    const cfMedio  = cashflowPorMes.length > 0 ? cashflowPorMes.reduce((s,m)=>s+m.cf,0)/cashflowPorMes.length : 0;

    // ── Intereses de cuentas remuneradas ─────────────────────────────────────────
    // Mes actual (extracto propio del mes)
    const interesesMesActual = evsMesActual
      .filter(e => e.sourceType==='account-interest')
      .reduce((s,e) => s+Math.abs(e.cuantia), 0);

    // Total acumulado en el intervalo del dashboard
    const interesesTotalIntervalo = evSinTransf
      .filter(e => e.sourceType==='account-interest')
      .reduce((s,e) => s+Math.abs(e.cuantia), 0);

    // Media mensual en el intervalo
    const interesesMediaMes = interesesTotalIntervalo / numMeses;

    // Desglose por cuenta
    const interesesPorCuenta = accounts
      .filter(a => a.activo && a.interes > 0)
      .map(a => {
        const totalAcc = evSinTransf
          .filter(e => e.sourceType==='account-interest' && e.sourceId===a._id)
          .reduce((s,e) => s+Math.abs(e.cuantia), 0);
        return { nombre: a.nombre, interes: a.interes, total: totalAcc };
      })
      .filter(a => a.total > 0)
      .sort((a,b) => b.total - a.total);

    // Helper porcentaje con fallback
    const pctFmt = (num, den) => den > 0 ? (num/den*100).toFixed(1)+'%' : '—';
    const semColor = (pct, umbrales) => {
      if (!pct || pct==='—') return 'var(--text3)';
      const v = parseFloat(pct);
      return v <= umbrales[0] ? 'var(--accent)' : v <= umbrales[1] ? 'var(--yellow)' : 'var(--red)';
    };

    const accPills=accounts.map(acc=>`<span class="acc-pill ${filtroAccounts.includes(acc._id)?'active':''} ${acc.simulacion?'sim':''}" onclick="DashboardModule.toggleAccFilter('${acc._id}')">${acc.nombre}${acc.simulacion?' ◌':''}</span>`).join('');

    view.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuadro de <span>Mando</span></h1>
      </div>

      <!-- Config (colapsable) -->
      <div class="card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;${config.configCollapsed?'':'margin-bottom:14px'}">
          <span class="card-title" style="margin:0">Configuración del periodo</span>
          <button class="btn-secondary btn-sm" style="padding:4px 10px;font-size:18px;line-height:1" onclick="DashboardModule.toggleConfig()" title="${config.configCollapsed?'Expandir':'Colapsar'}">${config.configCollapsed?'▸':'▾'}</button>
        </div>
        ${config.configCollapsed ? '' : `
        <div class="grid-2" style="gap:10px">
          <div class="form-group">
            <label class="form-label">Periodo inicio</label>
            <input class="form-input" type="date" id="cfg-start" value="${config.dashboardStart}"/>
          </div>
          <div class="form-group">
            <label class="form-label">Periodo fin</label>
            <div style="display:flex;flex-direction:column;gap:6px">
              <div class="flex gap-4 flex-wrap" style="row-gap:4px">
                ${['1M','3M','6M','1Y','5Y','10Y'].map(p=>`<button type="button" class="btn-secondary btn-sm" style="min-width:34px;padding:5px 8px" onclick="DashboardModule.applyPreset('${p}')">${p}</button>`).join('')}
              </div>
              <input class="form-input" type="date" id="cfg-end" value="${config.dashboardEnd}" style="width:100%;max-width:200px"/>
            </div>
          </div>
        </div>
        <div class="grid-2 mt-8" style="gap:10px">
          <div class="form-group">
            <label class="form-label">Colchón económico</label>
            <div class="flex gap-6 items-center mb-6">
              <button type="button" class="btn-sm ${(config.colchonTipo||'meses')==='meses'?'btn-primary':'btn-secondary'}" onclick="DashboardModule.setColchonTipo('meses')">Por meses</button>
              <button type="button" class="btn-sm ${config.colchonTipo==='fijo'?'btn-primary':'btn-secondary'}" onclick="DashboardModule.setColchonTipo('fijo')">Cantidad fija</button>
            </div>
            ${config.colchonTipo==='fijo'
              ? `<div class="flex gap-8 items-center"><input class="form-input" type="number" id="cfg-colchon-fijo" value="${config.colchonFijo||0}" min="0" style="width:130px"/><span class="text-sm" style="color:var(--text2)">€</span></div>`
              : `<div class="flex gap-8 items-center"><input class="form-input" type="number" id="cfg-colchon" value="${config.colchonMeses||6}" min="1" max="36" style="width:80px"/><span class="text-sm" style="color:var(--text2)">meses de gastos básicos</span></div>`
            }
            ${(()=>{
              const gastoBasMes = FinanceMath.calcGastoBasicoMensual(expenses);
              if (gastoBasMes <= 0) return `<div class="text-sm mt-6" style="color:var(--text3)">Marca gastos como "básico" para ver la recomendación.</div>`;
              const meses3 = gastoBasMes * 3, meses6 = gastoBasMes * 6;
              if (config.colchonTipo === 'fijo') {
                const equiv = config.colchonFijo > 0 ? (config.colchonFijo / gastoBasMes).toFixed(1) : 0;
                return `<div class="text-sm mt-6" style="color:var(--text3)">Equivale a <strong style="color:var(--text2)">${equiv} meses</strong> de gastos básicos. Recomendación: entre ${FinanceMath.eur(meses3)} (3m) y ${FinanceMath.eur(meses6)} (6m).</div>`;
              }
              const mesesActuales = config.colchonMeses || 6;
              const colchonActual = gastoBasMes * mesesActuales;
              const nivel = mesesActuales < 3 ? '⚠️ Por debajo del mínimo recomendado (3 meses).' : mesesActuales < 6 ? '💡 Aceptable. Lo ideal son 6 meses.' : '✅ Colchón sólido.';
              return `<div class="text-sm mt-6" style="color:var(--text3)">${nivel} Con ${FinanceMath.eur(gastoBasMes)}/mes de básicos: <strong style="color:var(--text2)">${FinanceMath.eur(colchonActual)}</strong>.</div>`;
            })()}
          </div>
          <div class="form-group" style="display:flex;align-items:flex-start;gap:10px;padding-top:8px;flex-direction:column">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2)">
              <label class="toggle"><input type="checkbox" id="cfg-show-hist" ${config.showHistorico?'checked':''}/><span class="toggle-slider"></span></label>
              Mostrar histórico real en gráfica
            </label>
          </div>
        </div>
        <div class="flex gap-8 mt-8 items-center flex-wrap">
          <span class="text-sm">Filtrar cuentas:</span>
          ${accPills}
          <button class="btn-secondary btn-sm" onclick="DashboardModule.clearAccFilter()">Todas</button>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;row-gap:6px">
            <label class="form-inline gap-8" style="font-size:12px;color:var(--text2)">
              <label class="toggle"><input type="checkbox" id="cfg-show-colchon" ${config.showColchon?'checked':''}/><span class="toggle-slider"></span></label>
              Colchón
            </label>
            <label class="form-inline gap-8" style="font-size:12px;color:var(--text2)">
              <label class="toggle"><input type="checkbox" id="cfg-show-mc" ${config.showMC?'checked':''}/><span class="toggle-slider"></span></label>
              Monte Carlo
            </label>
            <button class="btn-primary btn-sm" onclick="DashboardModule.applyConfig()">Actualizar</button>
          </div>
        </div>
        ${cuentasActivas.length>0?`<div class="mt-8 text-sm" style="color:var(--text3)">Saldo base: ${cuentasActivas.map(a=>`${a.nombre}: ${FinanceMath.eur(FinanceMath.saldoRealCuenta(a))} (${a.fechaInicialSaldo||'—'})`).join(' · ')}</div>`:''}
        `}
      </div>

      <!-- Exec summary strip -->
      <div class="flex justify-between items-center mb-8">
        <div class="card-title" style="margin:0">Resumen ejecutivo</div>
        <button class="btn-secondary btn-sm" onclick="DashboardModule.toggleExecSummary()">${config.showExecSummary!==false?'Ocultar':'Mostrar'}</button>
      </div>
      ${config.showExecSummary!==false?`<div class="exec-summary mb-14">
        <div class="exec-item">
          <div class="exec-item-label">Saldo hoy</div>
          <div class="exec-item-val ${saldoHoy>=0?'pos':'neg'}">${FinanceMath.eur(saldoHoy)}</div>
        </div>
        <div class="exec-item">
          <div class="exec-item-label">Score salud</div>
          <div class="exec-item-val" style="color:${score.color}">${score.total}/100 <span style="font-size:11px;font-family:var(--font-sans)">${score.label}</span></div>
        </div>
        <div class="exec-item">
          <div class="exec-item-label">Ahorro est./mes</div>
          ${(()=>{
            const ahorroEst = ingresosMesActual - gastosTosMesActual;
            const color = ahorroEst > 0 ? 'var(--accent)' : 'var(--red)';
            return `<div class="exec-item-val" style="color:${color}">${ahorroEst>=0?'+':''}${FinanceMath.eur(ahorroEst)}</div>`;
          })()}
        </div>
        <div class="exec-item">
          <div class="exec-item-label">Colchón (periodo)</div>
          ${(()=>{
            if (colchon <= 0) return `<div class="exec-item-val" style="color:var(--text3)">No configurado</div>`;
            const evTotal = extracto.length;
            const evBajo  = extracto.filter(e => e.saldoAcum < colchon).length;
            const pctBajo = evTotal > 0 ? evBajo / evTotal * 100 : 0;
            const color = pctBajo < 25 ? 'var(--accent)' : pctBajo < 50 ? '#ffd166' : 'var(--red)';
            const icono = pctBajo === 0 ? '✓' : '✗';
            const label = pctBajo === 0 ? 'cubierto' : `${pctBajo.toFixed(0)}% del tiempo sin cubrir`;
            return `<div class="exec-item-val" style="color:${color}">${FinanceMath.eur(colchon)} ${icono}</div>
                    <div style="font-size:10px;color:${color};margin-top:1px">${label}</div>`;
          })()}
        </div>
        <div class="exec-item">
          <div class="exec-item-label">Ingresos/mes</div>
          <div class="exec-item-val" style="color:var(--text)">${FinanceMath.eur(ingresosMesActual||ingresosMediaMes)}</div>
        </div>
        ${alertas.length>0?`<div class="exec-item"><div class="exec-item-label">Alertas</div><div class="exec-item-val" style="color:var(--yellow)">${alertas.length} punto${alertas.length>1?'s':''} crítico${alertas.length>1?'s':''}</div></div>`:''}
      </div>`:'<div class="mb-14"></div>'}

      <!-- Stats row -->
      <div class="grid-4 mb-14">
        ${(()=>{
          const diff   = saldoBase - saldoHoy;  // real − proyectado: positivo = mejor de lo esperado
          const diffPct = saldoHoy !== 0 ? diff / Math.abs(saldoHoy) * 100 : 0;
          const diffColor = diffPct > 20 ? 'var(--accent)' : diffPct < -20 ? 'var(--red)' : 'var(--text)';
          const diffSign  = diff >= 0 ? '+' : '';
          return `<div class="stat-card">
            <div class="stat-label">Saldo real vs proyectado hoy</div>
            <div style="display:flex;flex-direction:column;gap:4px;margin-top:2px">
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
                <span style="font-size:10px;color:var(--text3)">Real (histórico)</span>
                <span class="stat-value" style="font-size:16px">${FinanceMath.eur(saldoBase)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
                <span style="font-size:10px;color:var(--text3)">Proyectado</span>
                <span style="font-family:var(--font-mono);font-size:14px;color:var(--text2)">${FinanceMath.eur(saldoHoy)}</span>
              </div>
              <div style="border-top:1px solid var(--border);padding-top:5px;margin-top:2px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:10px;color:var(--text3)">Diferencia</span>
                <span style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:${diffColor}">${diffSign}${FinanceMath.eur(diff)} <span style="font-size:10px">(${diffSign}${diffPct.toFixed(1)}%)</span></span>
              </div>
            </div>
            <div class="stat-sub" style="margin-top:4px">${new Date().toISOString().slice(0,10)} · ${cuentasActivas.length} cuenta${cuentasActivas.length!==1?'s':''}</div>
          </div>`;
        })()}
        ${(()=>{
          const deltaFin  = saldoFinal - saldoBase;
          const deltaColor = deltaFin >= 0 ? 'var(--accent)' : 'var(--red)';
          const deltaSign  = deltaFin >= 0 ? '+' : '';
          return `<div class="stat-card">
            <div class="stat-label">Saldo estimado fin</div>
            <div class="stat-value ${saldoFinal>=0?'':'neg'}">${FinanceMath.eur(saldoFinal)}</div>
            <div style="font-family:var(--font-mono);font-size:12px;margin-top:4px;color:${deltaColor}">${deltaSign}${FinanceMath.eur(deltaFin)} vs hoy</div>
            <div class="stat-sub">${config.dashboardEnd}</div>
          </div>`;
        })()}
        ${(()=>{
          const pensiones = accounts.filter(a=>a.activo&&a.esFondoPension);
          if (!pensiones.length) return `<div class="stat-card"><div class="stat-label">Media mensual gastos</div><div class="stat-value">${FinanceMath.eur(mediaMensual)}</div><div class="stat-sub">Total: ${FinanceMath.eur(totalGastos)}</div></div>`;
          const totalBloq = pensiones.reduce((s,a)=>{const p=FinanceMath.calcFondosPension(a);return s+(p?.bloqueado||0);},0);
          const totalDisp = pensiones.reduce((s,a)=>{const p=FinanceMath.calcFondosPension(a);return s+(p?.disponible||0);},0);
          const totalBenef = pensiones.reduce((s,a)=>{const p=FinanceMath.calcFondosPension(a);return s+(p?.beneficio||0);},0);
          return `<div class="stat-card" style="border-color:var(--yellow)">
            <div class="stat-label">🔒 Fondos pensiones</div>
            <div class="stat-value" style="color:var(--yellow)">${FinanceMath.eur(totalBloq)}</div>
            <div class="stat-sub">bloqueado · ${FinanceMath.eur(totalDisp)} disponible</div>
            <div class="stat-sub pos" style="margin-top:2px">+${FinanceMath.eur(totalBenef)} beneficio</div>
          </div>`;
        })()}
      </div>
      ${(()=>{
        const goalsActivos = goals.filter(g=>!g.completado).slice().sort((a,b)=>(a.prioridad||99)-(b.prioridad||99)).slice(0,3);
        if (!goalsActivos.length) return '';
        return `<div class="card mb-14" style="padding:12px">
          <div class="card-title" style="margin-bottom:8px">🎯 Objetivos de ahorro</div>
          ${goalsActivos.map(g=>{
            const saldo = GoalsModule._saldoParaObjetivo(g, accounts, config, loans, expenses);
            const prog  = g.targetAmount>0 ? Math.min(100,(saldo/g.targetAmount)*100) : 0;
            const alcanzado = saldo >= g.targetAmount && g.targetAmount > 0;
            return '<div class="mb-8 ' + (alcanzado?'goal-alcanzado':'') + '" style="' + (alcanzado?'padding:4px;border-radius:6px;':'') + '"><div class="flex justify-between"><span style="font-size:12px;font-weight:500">#' + (g.prioridad||1) + ' ' + g.nombre + (alcanzado?' 🎉':'') + '</span><span class="num" style="font-size:11px">' + FinanceMath.eur(saldo) + ' / ' + FinanceMath.eur(g.targetAmount) + '</span></div><div class="goal-bar"><div class="goal-bar-fill" style="width:' + prog + '%;background:' + (g.color||'var(--accent)') + '"></div></div></div>';
          }).join('')}
        </div>`;
      })()}

      <!-- ── Sección Préstamos ── -->
      ${loansActivos.length > 0 ? (()=>{
        const deudaDelta    = deudaFin - deudaInicio;
        const deudaDeltaPct = deudaInicio > 0.01 ? deudaDelta / deudaInicio * 100 : 0;
        const deudaColor    = deudaDelta <= 0 ? 'var(--accent)' : 'var(--red)';
        const cfColor = (v) => v > 0 ? 'var(--accent)' : v < 0 ? 'var(--red)' : 'var(--text2)';
        return `<div class="card mb-14">
          <div class="card-title mb-12">Préstamos</div>
          <div class="grid-3" style="gap:10px;margin-bottom:${(loansFinEnPeriodo.length>0||ahorroIntereses>0.01)?'14px':'0'}">
            <!-- Deuda -->
            <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;border:1px solid var(--border)">
              <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Deuda viva</div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Inicio</span><span style="font-family:var(--font-mono)">${FinanceMath.eur(deudaInicio)}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Fin</span><span style="font-family:var(--font-mono)">${FinanceMath.eur(deudaFin)}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;border-top:1px solid var(--border);padding-top:4px;margin-top:2px">
                  <span style="color:var(--text3)">Reducción</span>
                  <span style="font-family:var(--font-mono);font-weight:700;color:${deudaColor}">${deudaDelta<=0?'':'+'}${FinanceMath.eur(deudaDelta)} <span style="font-size:10px">(${deudaDeltaPct.toFixed(1)}%)</span></span>
                </div>
              </div>
            </div>
            <!-- Cashflow -->
            <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;border:1px solid var(--border)">
              <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Cashflow mensual</div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Inicio periodo</span><span style="font-family:var(--font-mono);color:${cfColor(cfInicio)}">${cfInicio>=0?'+':''}${FinanceMath.eur(cfInicio)}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Media</span><span style="font-family:var(--font-mono);color:${cfColor(cfMedio)}">${cfMedio>=0?'+':''}${FinanceMath.eur(cfMedio)}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;border-top:1px solid var(--border);padding-top:4px;margin-top:2px"><span style="color:var(--text3)">Fin periodo</span><span style="font-family:var(--font-mono);font-weight:700;color:${cfColor(cfFin)}">${cfFin>=0?'+':''}${FinanceMath.eur(cfFin)}</span></div>
              </div>
            </div>
            <!-- Ahorro intereses -->
            <div style="background:var(--bg3);border-radius:var(--radius);padding:12px;border:1px solid var(--border)">
              <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Ahorro de intereses</div>
              ${ahorroIntereses > 0.01 ? `
              <div style="display:flex;flex-direction:column;gap:4px">
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Total periodo</span><span style="font-family:var(--font-mono);font-weight:700;color:var(--accent)">+${FinanceMath.eur(ahorroIntereses)}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Mensual medio</span><span style="font-family:var(--font-mono);color:var(--accent)">+${FinanceMath.eur(ahorroInteresesMes)}</span></div>
              </div>` : `<div style="font-size:12px;color:var(--text3)">Sin amortizaciones extraordinarias en el periodo.</div>`}
            </div>
          </div>
          ${loansFinEnPeriodo.length > 0 ? `
          <div style="border-top:1px solid var(--border);padding-top:12px">
            <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Préstamos que finalizan en el periodo</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${loansFinEnPeriodo.map(({loan,fechaFin})=>`
              <div style="display:flex;justify-content:space-between;align-items:center;background:var(--accent-dim);border:1px solid rgba(0,229,160,0.2);border-radius:var(--radius);padding:8px 12px;flex-wrap:wrap;gap:6px">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:16px">🏁</span>
                  <span style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--accent)">${loan.nombre}</span>
                </div>
                <span style="font-size:11px;color:var(--text2)">Última cuota: <strong>${fechaFin}</strong></span>
              </div>`).join('')}
            </div>
          </div>` : ''}
        </div>`;
      })() : ''}

      <!-- KPI financieros: donut distribución + rendimiento -->
      <div class="grid-2 mb-14" style="gap:14px">

        <!-- Donut distribución de ingresos (media mensual del periodo) -->
        <div class="card">
          <div class="card-title mb-8">Distribución media mensual (periodo)</div>
          ${(()=>{
            const otrosGastosMed = Math.max(0, gastosMediaMes - gastosBasicosMediaMes);
            const ahorroMed      = Math.max(0, ingresosMediaMes - cuotasMediaMes - gastosMediaMes - amortizacionesMediaMes);
            const totalRef       = ingresosMediaMes > 0 ? ingresosMediaMes : (cuotasMediaMes + gastosMediaMes + amortizacionesMediaMes + 0.01);
            const pctBasicos = (gastosBasicosMediaMes / totalRef * 100).toFixed(1);
            const pctOtros   = (otrosGastosMed / totalRef * 100).toFixed(1);
            const pctDeuda   = (cuotasMediaMes / totalRef * 100).toFixed(1);
            const pctAmort   = (amortizacionesMediaMes / totalRef * 100).toFixed(1);
            const pctAhorro  = (ahorroMed / totalRef * 100).toFixed(1);
            const ahorroColor = ahorroMed > 0 ? 'var(--accent)' : 'var(--text3)';
            return `
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
              <div style="position:relative;width:140px;height:140px;flex-shrink:0"><canvas id="chart-expense-donut"></canvas></div>
              <div style="flex:1;min-width:130px;display:flex;flex-direction:column;gap:7px">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px">
                  <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#4d9fff;display:inline-block"></span><span style="color:var(--text2)">Básicos</span></span>
                  <span style="font-family:var(--font-mono)">${FinanceMath.eur(gastosBasicosMediaMes)}<span style="color:var(--text3);margin-left:4px">${pctBasicos}%</span></span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px">
                  <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#ff4d6d;display:inline-block"></span><span style="color:var(--text2)">Otros gastos</span></span>
                  <span style="font-family:var(--font-mono)">${FinanceMath.eur(otrosGastosMed)}<span style="color:var(--text3);margin-left:4px">${pctOtros}%</span></span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px">
                  <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#a855f7;display:inline-block"></span><span style="color:var(--text2)">Deuda</span></span>
                  <span style="font-family:var(--font-mono)">${FinanceMath.eur(cuotasMediaMes)}<span style="color:var(--text3);margin-left:4px">${pctDeuda}%</span></span>
                </div>
                ${amortizacionesMediaMes > 0.01 ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px">
                  <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#fb923c;display:inline-block"></span><span style="color:var(--text2)">Amortizaciones</span></span>
                  <span style="font-family:var(--font-mono)">${FinanceMath.eur(amortizacionesMediaMes)}<span style="color:var(--text3);margin-left:4px">${pctAmort}%</span></span>
                </div>` : ''}
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;border-top:1px solid var(--border);padding-top:6px">
                  <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#00e5a0;display:inline-block"></span><span style="color:var(--text2)">Ahorro est.</span></span>
                  <span style="font-family:var(--font-mono);font-weight:700;color:${ahorroColor}">${FinanceMath.eur(ahorroMed)}<span style="margin-left:4px">${pctAhorro}%</span></span>
                </div>
                <div style="font-size:10px;color:var(--text3);margin-top:2px">Ingresos: ${FinanceMath.eur(ingresosMediaMes)}/mes</div>
              </div>
            </div>`;
          })()}
        </div>

        <div class="card">
          <div class="card-title mb-12">Rendimiento cuentas</div>
          ${interesesMesActual > 0
            ? `<div class="stat-value pos mb-8">${FinanceMath.eur(interesesMesActual)}<span class="stat-sub" style="font-size:11px;margin-left:6px">este mes</span></div>`
            : `<div class="stat-value mb-8" style="color:var(--text3)">0,00 €<span class="stat-sub" style="font-size:11px;margin-left:6px">este mes</span></div>`
          }
          <div style="font-size:11px;color:var(--text3);margin-bottom:10px">
            ${interesesMediaMes > 0 ? `~${FinanceMath.eur(interesesMediaMes)}/mes · ${FinanceMath.eur(interesesTotalIntervalo)} total período` : 'Sin cuentas remuneradas configuradas'}
          </div>
          <div style="display:flex;flex-direction:column;gap:5px">
            ${interesesPorCuenta.length > 0
              ? interesesPorCuenta.map(a =>
                  `<div style="display:flex;justify-content:space-between;font-size:12px">
                    <span style="color:var(--text2)">${a.nombre} (${a.interes}%)</span>
                    <span style="font-family:var(--font-mono);color:var(--accent)">${FinanceMath.eur(a.total)}</span>
                  </div>`
                ).join('')
              : `<div style="font-size:10px;color:var(--text3)">Añade un % de interés a tus cuentas para proyectar el rendimiento</div>`
            }
          </div>
        </div>
      </div>

      <!-- Charts row 1 -->
      <div class="card mb-14">
        <div class="flex justify-between items-center mb-8" style="flex-wrap:wrap;gap:6px">
          <div class="card-title" style="margin:0">Evolución del saldo</div>
          <div class="flex gap-8 items-center flex-wrap">
            ${alertas.length>0?`<button class="btn-secondary btn-sm" style="font-size:11px;color:${config.showCriticos!==false?'var(--yellow)':'var(--text3)'}" onclick="DashboardModule.toggleCriticos()">
              ⚠️ ${alertas.length} punto${alertas.length>1?'s':''} crítico${alertas.length>1?'s':''} ${config.showCriticos!==false?'(visible)':'(oculto)'}
            </button>`:''}
          </div>
        </div>
        <div class="chart-wrap-lg"><canvas id="chart-saldo"></canvas></div>
      </div>

      <!-- Charts row 2 -->
      <div class="grid-2 mb-14">
        <div class="card">
          <div class="card-title">Ingresos vs Gastos por categoría (mensual)</div>
          <div class="chart-wrap-lg"><canvas id="chart-breakdown-mensual"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">Gastos por etiqueta</div>
          <div class="tag-list mb-8">${allTags.map(t=>`<span class="tag ${activeTags.has(t)?'active':''}" onclick="DashboardModule.toggleTag('${t}')">${t}</span>`).join('')}</div>
          <div class="chart-wrap"><canvas id="chart-gastos-tags"></canvas></div>
        </div>
      </div>
      <!-- Charts row 3 -->
      <div class="grid-2 mb-14">
        <div class="card">
          <div class="card-title">Media mensual de gastos por etiqueta</div>
          <div class="chart-wrap"><canvas id="chart-media-mensual"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">Velas OHLC</div>
          <div class="flex justify-between items-center mb-8" style="flex-wrap:wrap;gap:8px">
            <div class="period-selector">
              <button class="period-btn ${ventana==='semana'?'active':''}" onclick="DashboardModule.setVentana('semana')">Sem</button>
              <button class="period-btn ${ventana==='mes'?'active':''}" onclick="DashboardModule.setVentana('mes')">Mes</button>
              <button class="period-btn ${ventana==='año'?'active':''}" onclick="DashboardModule.setVentana('año')">Año</button>
            </div>
          </div>
          <div class="chart-wrap-lg"><canvas id="chart-velas"></canvas></div>
        </div>
      </div>

      <!-- Extracto -->
      <div class="card">
        <div class="card-title">Extracto proyectado (${extracto.length} movimientos)</div>
        <div class="extr-head"><span>FECHA</span><span>CONCEPTO</span><span>IMPORTE</span><span class="extr-col-hide">CUENTA</span><span class="extr-col-hide">DELTA</span><span>SALDO</span></div>
        <div style="max-height:360px;overflow-y:auto">
          ${extracto.slice(0,300).map(ev=>`<div class="extr-row">
            <span class="num">${ev.fecha}</span>
            <span>${ev.concepto}${ev.simulacion?' <span class="badge badge-sim" style="font-size:9px">SIM</span>':''}</span>
            <span class="num ${ev.tipo==='ingreso'?'pos':'neg'}">${FinanceMath.eur(ev.cuantia)}</span>
            <span class="text-sm extr-col-hide">${State.accountName(ev.cuenta||'default')}</span>
            <span class="num ${ev.delta>=0?'pos':'neg'} extr-col-hide">${ev.delta>=0?'+':''}${FinanceMath.eur(ev.delta)}</span>
            <span class="num ${ev.saldoAcum>=0?'':'neg'}">${FinanceMath.eur(ev.saldoAcum)}</span>
          </div>`).join('')}
          ${extracto.length>300?`<div class="text-sm" style="text-align:center;padding:10px">… y ${extracto.length-300} más</div>`:''}
        </div>
      </div>

      <!-- Flujo de caja mensual -->
      <div class="card mt-14">
        <div class="card-title mb-12">Flujo de caja mensual</div>
        ${(()=>{
          const dSfc = new Date(config.dashboardStart+'T00:00:00');
          const dEfc = new Date(config.dashboardEnd+'T00:00:00');
          const meses = [];
          let _dm = new Date(dSfc.getFullYear(), dSfc.getMonth(), 1);
          while (_dm <= dEfc && meses.length < 60) {
            meses.push(_dm.getFullYear() + '-' + String(_dm.getMonth()+1).padStart(2,'0'));
            _dm = new Date(_dm.getFullYear(), _dm.getMonth()+1, 1);
          }
          if (!meses.length) return '';

          const rows = meses.map(ml => {
            const ini = ml + '-01';
            const fin = new Date(parseInt(ml.slice(0,4)), parseInt(ml.slice(5,7)), 0).toISOString().slice(0,10);
            const evs = extracto.filter(e => e.fecha >= ini && e.fecha <= fin && e.sourceType !== 'transfer-out' && e.sourceType !== 'transfer-in');
            const ing   = evs.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0);
            const cuotas= evs.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto').reduce((s,e)=>s+Math.abs(e.cuantia),0);
            const amorts= evs.filter(e=>e.sourceType==='loan-amort').reduce((s,e)=>s+Math.abs(e.cuantia),0);
            const basicos= evs.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0);
            const otros = evs.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return !ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0);
            const totalGasto = cuotas + basicos + otros;
            const neto  = ing - totalGasto;
            const esHoy = ml === hoyStr.slice(0,7);
            return '<tr style="' + (esHoy ? 'background:rgba(0,229,160,0.05)' : '') + '">' +
              '<td class="num" style="font-weight:' + (esHoy?'700':'400') + '">' + ml + (esHoy?' ◉':'') + '</td>' +
              '<td class="num pos">' + FinanceMath.eur(ing) + '</td>' +
              '<td class="num neg">' + FinanceMath.eur(cuotas) + '</td>' +
              '<td class="num neg">' + FinanceMath.eur(basicos) + '</td>' +
              '<td class="num neg">' + FinanceMath.eur(otros) + '</td>' +
              (amorts > 0 ? '<td class="num neg" style="color:var(--text3)">' + FinanceMath.eur(amorts) + '</td>' : '<td class="num" style="color:var(--text3)">—</td>') +
              '<td class="num ' + (neto>=0?'pos':'neg') + '" style="font-weight:600">' + (neto>=0?'+':'') + FinanceMath.eur(neto) + '</td>' +
              '</tr>';
          }).join('');

          const totIng   = meses.reduce((s,ml)=>{ const ini=ml+'-01',fin=new Date(parseInt(ml.slice(0,4)),parseInt(ml.slice(5,7)),0).toISOString().slice(0,10); return s+extracto.filter(e=>e.fecha>=ini&&e.fecha<=fin&&e.tipo==='ingreso'&&e.sourceType!=='transfer-in').reduce((ss,e)=>ss+Math.abs(e.cuantia),0);},0);
          const totGasto = meses.reduce((s,ml)=>{ const ini=ml+'-01',fin=new Date(parseInt(ml.slice(0,4)),parseInt(ml.slice(5,7)),0).toISOString().slice(0,10); return s+extracto.filter(e=>e.fecha>=ini&&e.fecha<=fin&&e.tipo==='gasto'&&e.sourceType!=='transfer-out'&&e.sourceType!=='loan-amort').reduce((ss,e)=>ss+Math.abs(e.cuantia),0);},0);
          const totNeto  = totIng - totGasto;

          return '<div style="overflow-x:auto"><table style="width:100%;font-size:12px;border-collapse:collapse">' +
            '<thead><tr style="color:var(--text3);font-size:10px;text-transform:uppercase;font-family:var(--font-mono)">' +
            '<th style="text-align:left;padding:6px 8px">Mes</th>' +
            '<th style="text-align:right;padding:6px 8px">Ingresos</th>' +
            '<th style="text-align:right;padding:6px 8px">Cuotas</th>' +
            '<th style="text-align:right;padding:6px 8px">Básicos</th>' +
            '<th style="text-align:right;padding:6px 8px">Otros</th>' +
            '<th style="text-align:right;padding:6px 8px">Amorts.</th>' +
            '<th style="text-align:right;padding:6px 8px">Neto</th>' +
            '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
            '<tfoot><tr style="border-top:1px solid var(--border2);font-weight:700;font-size:11px">' +
            '<td style="padding:6px 8px">TOTAL</td>' +
            '<td class="num pos" style="padding:6px 8px">' + FinanceMath.eur(totIng) + '</td>' +
            '<td colspan="3" class="num neg" style="padding:6px 8px">' + FinanceMath.eur(totGasto) + '</td>' +
            '<td></td>' +
            '<td class="num ' + (totNeto>=0?'pos':'neg') + '" style="padding:6px 8px">' + (totNeto>=0?'+':'') + FinanceMath.eur(totNeto) + '</td>' +
            '</tr></tfoot>' +
            '</table></div>';
        })()}
      </div>

      <!-- Desviación real vs estimado -->
      ${(()=>{
        const desv = FinanceMath.calcDesviacion(extracto, accounts);
        if (!desv.length) return '';
        const mape = desv.reduce((s,r)=>s+Math.abs(r.pct),0)/desv.length;
        return `<div class="card mt-14">
          <div class="card-title">Desviación real vs estimado</div>
          <div class="text-sm mb-8" style="color:var(--text2)">Precisión media del modelo (MAPE): <span class="num" style="color:${mape<10?'var(--accent)':mape<25?'var(--yellow)':'var(--red)'}">${mape.toFixed(1)}%</span></div>
          <div class="dev-row dev-head"><span>Fecha</span><span>Estimado</span><span>Real</span><span>Desviación</span><span>%</span></div>
          ${desv.slice(-20).reverse().map(r=>`<div class="dev-row">
            <span class="num">${r.fecha}</span>
            <span class="num">${FinanceMath.eur(r.estimado)}</span>
            <span class="num ${r.real>=r.estimado?'pos':'neg'}">${FinanceMath.eur(r.real)}</span>
            <span class="num ${r.desv>=0?'pos':'neg'}">${r.desv>=0?'+':''}${FinanceMath.eur(r.desv)}</span>
            <span class="num ${Math.abs(r.pct)<10?'pos':Math.abs(r.pct)<25?'':'neg'}">${r.pct>=0?'+':''}${r.pct.toFixed(1)}%</span>
          </div>`).join('')}
        </div>`;
      })()}`;

    // Pass computed metrics to chart functions
    const _metricasGraficos = { loans, expenses, config, numMeses, extracto };
    const _donutMetrics = { gastosBasicosMediaMes, gastosMediaMes, cuotasMediaMes, ingresosMediaMes, amortizacionesMediaMes };
    setTimeout(()=>{
      renderChartSaldo(extracto);
      renderChartVelas(extracto);
      renderChartTags(extracto, activeTags);
      renderChartBreakdown(_metricasGraficos);
      renderChartExpenseDonut(_donutMetrics);
    }, 60);
  }

  function renderChartSaldo(extracto) {
    const ctx=document.getElementById('chart-saldo'); if(!ctx)return;
    const config = State.get('config');
    const expenses = State.get('expenses');
    const loans = State.get('loans');
    const accounts = State.get('accounts');
    const SCN_COLORS = ['#a855f7','#fb923c','#f472b6','#60a5fa','#34d399','#facc15'];

    const labels = extracto.map(e=>e.fecha);
    const saldoData = extracto.map(e=>e.saldoAcum);

    // Colchon threshold
    const colchon = FinanceMath.calcColchon(expenses, config, loans);

    // Convert extracto to {x: timestamp, y: saldo} for time axis
    const saldoXY = extracto.map(e=>({ x: new Date(e.fecha+'T00:00:00').getTime(), y: e.saldoAcum }));

    // Colchon: use same x range as extracto
    let colchonDataset = null;
    if (config.showColchon && colchon > 0 && saldoXY.length > 0) {
      colchonDataset = {
        label: `Colchón (${config.colchonMeses||6}m básicos) — ${FinanceMath.eur(colchon)}`,
        data: [
          { x: saldoXY[0].x,                    y: colchon },
          { x: saldoXY[saldoXY.length-1].x,     y: colchon }
        ],
        borderColor: 'rgba(255,209,102,0.8)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [6,4],
        pointRadius: 0,
        tension: 0,
        fill: false,
        order: 4
      };
    }

    // Historial scatter — LOCF por cuenta: para cada fecha en cualquier cuenta,
    // suma el saldo más reciente de CADA cuenta hasta esa fecha.
    let histDataset = null;
    if (config.showHistorico) {
      const visibles = accounts.filter(a =>
        filtroAccounts.length === 0 || filtroAccounts.includes(a._id)
      );
      // Recoger todas las fechas únicas; deduplicar por cuenta (último en inserción)
      const allDates = new Set();
      const dedupedHist = visibles.map(acc => {
        const byD = {};
        for (const h of (acc.historicoSaldos || [])) byD[h.fecha] = h.saldo; // último gana
        for (const d of Object.keys(byD)) allDates.add(d);
        return byD;
      });
      const byFecha = {};
      for (const fecha of [...allDates].sort()) {
        let total = 0;
        for (let ai = 0; ai < visibles.length; ai++) {
          // Saldo más reciente de esta cuenta hasta `fecha`
          const entries = Object.entries(dedupedHist[ai]).filter(([d]) => d <= fecha);
          if (entries.length > 0) {
            entries.sort(([a],[b]) => b.localeCompare(a));
            total += entries[0][1];
          } else {
            total += visibles[ai].saldoInicial || 0;
          }
        }
        byFecha[fecha] = total;
      }
      const pts = Object.entries(byFecha)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([fecha, saldo]) => ({ x: new Date(fecha+'T00:00:00').getTime(), y: saldo }));
      if (pts.length > 0) {
        const label = filtroAccounts.length === 0
          ? 'Histórico (todas las cuentas)'
          : 'Histórico (' + visibles.map(a=>a.nombre).join(', ') + ')';
        histDataset = {
          label,
          data: pts,
          type: 'scatter',
          backgroundColor: '#ffd166',
          borderColor: '#ffd166',
          pointRadius: 3,
          pointHoverRadius: 6,
          showLine: pts.length > 1,
          borderWidth: 1.5,
          borderDash: [4,3],
          tension: 0.2,
          order: 0
        };
      }
    }

    // Monte Carlo bands
    let mcDatasets = [];
    if (config.showMC && expenses.some(e=>e.varianza>0)) {
      const mcResult = FinanceMath.monteCarlo(loans, expenses, accounts, config, config.mcIteraciones||300);
      if (mcResult && mcResult.length > 0) {
        mcDatasets = [
          { label:'MC p10', data:mcResult.map(r=>({x:r.x,y:r.p10})), borderColor:'transparent', backgroundColor:'rgba(77,159,255,0.05)', fill:'+1', borderWidth:0, pointRadius:0, tension:0.3, order:11 },
          { label:'MC p25', data:mcResult.map(r=>({x:r.x,y:r.p25})), borderColor:'rgba(77,159,255,0.15)', backgroundColor:'rgba(77,159,255,0.10)', fill:'+2', borderWidth:0.5, pointRadius:0, tension:0.3, order:10 },
          { label:'MC mediana', data:mcResult.map(r=>({x:r.x,y:r.p50})), borderColor:'rgba(77,159,255,0.7)', backgroundColor:'transparent', borderWidth:1.5, borderDash:[5,3], pointRadius:0, tension:0.3, fill:false, order:7 },
          { label:'MC p75', data:mcResult.map(r=>({x:r.x,y:r.p75})), borderColor:'rgba(77,159,255,0.15)', backgroundColor:'rgba(77,159,255,0.10)', fill:'-1', borderWidth:0.5, pointRadius:0, tension:0.3, order:10 },
          { label:'MC p90', data:mcResult.map(r=>({x:r.x,y:r.p90})), borderColor:'transparent', backgroundColor:'rgba(77,159,255,0.05)', fill:'-1', borderWidth:0, pointRadius:0, tension:0.3, order:11 },
        ];
      }
    }

    // Critical point vertical lines
    const alertasChart = FinanceMath.detectarPuntosCriticos(extracto, colchon);
    const criticoDatasets = (config.showCriticos !== false) ? alertasChart.map(alerta => {
      const ts = new Date(alerta.fecha+'T00:00:00').getTime();
      const yVals = saldoXY.map(p=>p.y);
      const yMin = Math.min(...yVals), yMax = Math.max(...yVals);
      const span = Math.abs(yMax - yMin) * 0.05;
      const color = alerta.tipo==='saldo_negativo' ? 'rgba(255,77,109,0.6)' :
                    alerta.tipo==='bajo_colchon'    ? 'rgba(255,209,102,0.5)' : 'rgba(0,229,160,0.4)';
      return { label:alerta.mensaje, data:[{x:ts,y:yMin-span},{x:ts,y:yMax+span}],
        borderColor:color, backgroundColor:color, borderWidth:1.5, borderDash:[4,4],
        pointRadius:[6,0], pointStyle:['crossRot',false], showLine:true, tension:0, fill:false, order:3 };
    }) : [];

    const datasets = [
      ...mcDatasets,
      { label:'Saldo estimado', data:saldoXY, borderColor:'#00e5a0', backgroundColor:'rgba(0,229,160,0.07)',
        fill:true, tension:0.3, pointRadius:0, borderWidth:2, pointHitRadius:20, order:5 }
    ];
    if (histDataset)    datasets.push(histDataset);
    if (colchonDataset) datasets.push(colchonDataset);

    // Fondos bloqueados en pensiones — línea horizontal por fecha de desbloqueo progresivo
    const pensionesActivas = accounts.filter(a => a.activo && a.esFondoPension);
    if (pensionesActivas.length > 0) {
      // Proyectar saldo bloqueado mes a mes en el horizonte
      const bloqPts = [];
      const dSb = new Date(config.dashboardStart+'T00:00:00');
      const dEb = new Date(config.dashboardEnd+'T00:00:00');
      let _db = new Date(dSb.getFullYear(), dSb.getMonth(), 1);
      while (_db <= dEb) {
        const fechaSim = _db.toISOString().slice(0,10);
        const ts = _db.getTime();
        // Calcular fondos bloqueados en esa fecha simulando el estado del fondo
        let totalBloq = 0;
        for (const acc of pensionesActivas) {
          const bloqueo = acc.bloqueoMeses || 120;
          const fechaLim = new Date(_db.getFullYear(), _db.getMonth() - bloqueo, _db.getDate()).toISOString().slice(0,10);
          const apBlq = (acc.aportaciones||[]).filter(ap => ap.fecha > fechaLim).reduce((s,ap)=>s+ap.cantidad,0);
          totalBloq += apBlq;
        }
        if (totalBloq > 0) bloqPts.push({ x: ts, y: totalBloq });
        _db = new Date(_db.getFullYear(), _db.getMonth()+1, 1);
      }
      if (bloqPts.length > 0) {
        datasets.push({
          label: '🔒 Fondos bloqueados (pensión)',
          data: bloqPts,
          borderColor: 'rgba(255,209,102,0.8)',
          backgroundColor: 'rgba(255,209,102,0.08)',
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
          borderDash: [6, 4],
          order: 4,
        });
      }
    }

    datasets.push(...criticoDatasets);

    // Hitos de préstamos: línea vertical en la fecha de última cuota/amortización total
    if (saldoXY.length > 0) {
      const yValsAll = saldoXY.map(p=>p.y);
      const yMinAll  = Math.min(...yValsAll), yMaxAll = Math.max(...yValsAll);
      const spanAll  = Math.max(Math.abs(yMaxAll - yMinAll) * 0.08, 1);
      const loansActivosChart = loans.filter(l => l.activo && !l.simulacion);
      for (const l of loansActivosChart) {
        const { fechaFin } = FinanceMath.resumenPrestamo(l);
        if (!fechaFin || fechaFin < config.dashboardStart || fechaFin > config.dashboardEnd) continue;
        const ts = new Date(fechaFin+'T00:00:00').getTime();
        datasets.push({
          label: `🏁 ${l.nombre}`,
          data: [{ x: ts, y: yMinAll - spanAll }, { x: ts, y: yMaxAll + spanAll }],
          borderColor: 'rgba(0,229,160,0.85)',
          backgroundColor: ['transparent', 'rgba(0,229,160,0.9)'],
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: [0, 7],
          pointStyle: ['false', 'triangle'],
          pointRotation: [0, 0],
          showLine: true,
          tension: 0,
          fill: false,
          order: 2,
        });
      }
    }

    charts.saldo = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: (histDataset != null) || (colchonDataset != null) || mcDatasets.length>0 || criticoDatasets.length>0 || datasets.some(d=>d.label?.startsWith('🏁')),
            labels: { color:'#8b92a8', font:{size:11}, boxWidth:12, filter: i => !['MC p25','MC p10','MC p75','MC p90'].includes(i.text) }
          },
          tooltip: {
            backgroundColor: '#13161e', borderColor: '#252a38', borderWidth: 1,
            titleColor: '#8b92a8', bodyColor: '#e8eaf2',
            filter: item => item.dataset.label !== 'MC p25' && item.dataset.label !== 'MC p10' && item.dataset.label !== 'MC p75' && item.dataset.label !== 'MC p90',
            callbacks: {
              title: items => {
                const d = new Date(items[0].parsed.x);
                return d.toLocaleDateString('es-ES', { year:'numeric', month:'short', day:'numeric' });
              },
              label: ctx => ` ${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y)}`
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'month', tooltipFormat: 'dd/MM/yyyy' },
            ticks: { color: '#555d77', maxTicksLimit: 10 },
            grid: { color: '#252a38' }
          },
          y: {
            ticks: { color: '#555d77', callback: v => FinanceMath.eur(v) },
            grid: { color: '#252a38' }
          }
        }
      }
    });
  }

  function renderChartVelas(extracto) {
    const ctx=document.getElementById('chart-velas'); if(!ctx)return;
    const ohlc=FinanceMath.agruparOHLC(extracto, ventana);
    if (ohlc.length===0) { ctx.parentElement.innerHTML='<div class="text-sm" style="text-align:center;padding:40px">Sin datos suficientes.</div>'; return; }

    // Convertir keys a timestamps numéricos
    const candleData=ohlc.map(d=>{
      let ts;
      if (d.key.length===4) ts=new Date(d.key+'-01-01').getTime();
      else if (d.key.length===7) ts=new Date(d.key+'-01').getTime();
      else ts=new Date(d.key).getTime();
      return { x:ts, o:d.open, h:d.high, l:d.low, c:d.close };
    });

    charts.velas=new Chart(ctx,{
      type:'candlestick',
      data:{ datasets:[{ data:candleData, color:{ up:'#00e5a0', down:'#ff4d6d', unchanged:'#8b92a8' } }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{display:false},
          tooltip:{
            backgroundColor:'#13161e', borderColor:'#252a38', borderWidth:1,
            titleColor:'#8b92a8', bodyColor:'#e8eaf2',
            callbacks:{ label:ctx=>{ const d=ctx.raw; return [`O: ${FinanceMath.eur(d.o)}`, `H: ${FinanceMath.eur(d.h)}`, `L: ${FinanceMath.eur(d.l)}`, `C: ${FinanceMath.eur(d.c)}`]; } }
          }
        },
        scales:{
          x:{ type:'time', time:{ unit: ventana==='semana'?'week':ventana==='año'?'year':'month' }, ticks:{color:'#555d77'}, grid:{color:'#252a38'} },
          y:{ ticks:{color:'#555d77', callback:v=>FinanceMath.eur(v)}, grid:{color:'#252a38'} }
        }
      }
    });
  }

  function renderChartTags(extracto, activeTags) {
    const COLORS=['#00e5a0','#4d9fff','#ffd166','#ff4d6d','#a855f7','#fb923c','#34d399','#f472b6','#60a5fa','#facc15'];

    // Donut gastos con valor en leyenda
    const ctx=document.getElementById('chart-gastos-tags'); if(!ctx) return;
    const tagMap=FinanceMath.sumarPorTags(extracto,'gasto');
    const filtered=[...tagMap.entries()].filter(([t])=>activeTags.size===0||activeTags.has(t)).sort((a,b)=>b[1]-a[1]);
    if (filtered.length===0) { ctx.parentElement.innerHTML='<div class="text-sm" style="text-align:center;padding:40px">Sin datos.</div>'; }
    else {
      const labels=filtered.map(([t,v])=>`${t} — ${FinanceMath.eur(v)}`);
      const rawLabels=filtered.map(([t])=>t);
      const data=filtered.map(([,v])=>v);
      charts['chart-gastos-tags']=new Chart(ctx,{
        type:'doughnut',
        data:{ labels, datasets:[{ data, backgroundColor:COLORS.slice(0,labels.length), borderWidth:0, hoverOffset:6 }] },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{
            legend:{ position:'right', labels:{ color:'#8b92a8', font:{size:11}, boxWidth:12, padding:8 } },
            tooltip:{ callbacks:{ label:ctx=>` ${rawLabels[ctx.dataIndex]}: ${FinanceMath.eur(ctx.parsed)}` } }
          }
        }
      });
    }

    // Media mensual de gastos por tag — barra horizontal
    renderChartMediaMensual(extracto, activeTags, COLORS);
  }

  function renderChartMediaMensual(extracto, activeTags, COLORS=['#00e5a0','#4d9fff','#ffd166','#ff4d6d','#a855f7','#fb923c','#34d399','#f472b6']) {
    const config=State.get('config');
    const ctx=document.getElementById('chart-media-mensual'); if(!ctx) return;
    const tagMap=FinanceMath.sumarPorTags(extracto,'gasto');
    const dS=new Date(config.dashboardStart+'T00:00:00'), dE=new Date(config.dashboardEnd+'T00:00:00');
    const meses=Math.max(1,(dE-dS)/(30.44*86400000));
    const filtered=[...tagMap.entries()]
      .filter(([t])=>activeTags.size===0||activeTags.has(t))
      .map(([t,v])=>({label:t, media:v/meses}))
      .sort((a,b)=>b.media-a.media);
    if (filtered.length===0) { ctx.parentElement.innerHTML='<div class="text-sm" style="text-align:center;padding:40px">Sin datos.</div>'; return; }
    charts['chart-media-mensual']=new Chart(ctx,{
      type:'bar',
      data:{
        labels:filtered.map(d=>d.label),
        datasets:[{ data:filtered.map(d=>d.media), backgroundColor:COLORS.slice(0,filtered.length), borderWidth:0, borderRadius:4 }]
      },
      options:{
        indexAxis:'y',
        responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{display:false},
          tooltip:{ backgroundColor:'#13161e', borderColor:'#252a38', borderWidth:1, titleColor:'#8b92a8', bodyColor:'#e8eaf2',
            callbacks:{ label:ctx=>`Media: ${FinanceMath.eur(ctx.parsed.x)}/mes` }
          }
        },
        scales:{
          x:{ ticks:{color:'#555d77', callback:v=>FinanceMath.eur(v)}, grid:{color:'#252a38'} },
          y:{ ticks:{color:'#8b92a8'}, grid:{color:'#1a1e28'} }
        }
      }
    });
  }

  function renderChartBreakdown({ loans, expenses, config, numMeses, extracto }) {
    const ctx = document.getElementById('chart-breakdown-mensual'); if (!ctx) return;
    const dS = new Date(config.dashboardStart+'T00:00:00');
    const dE = new Date(config.dashboardEnd+'T00:00:00');
    const months = [];
    let _d = new Date(dS.getFullYear(), dS.getMonth(), 1);
    while (_d <= dE) {
      months.push(_d.getFullYear() + '-' + String(_d.getMonth()+1).padStart(2,'0'));
      _d = new Date(_d.getFullYear(), _d.getMonth()+1, 1);
    }
    if (months.length > 48) {
      ctx.parentElement.innerHTML = '<div class="text-sm" style="text-align:center;padding:20px;color:var(--text3)">Intervalo demasiado largo para vista mensual. Reduce el período del dashboard.</div>';
      return;
    }

    const dataIngresos = [], dataCuotas = [], dataBasicos = [], dataOtros = [];

    for (const mesLabel of months) {
      const mesIni = mesLabel + '-01';
      const [_my, _mm] = mesLabel.split('-').map(Number);
      const mesFin = new Date(_my, _mm, 0).toISOString().slice(0,10);

      // Misma fuente que los KPIs: el extracto proyectado, sin transferencias
      const evsMes = extracto.filter(e =>
        e.fecha >= mesIni && e.fecha <= mesFin &&
        e.sourceType !== 'transfer-out' && e.sourceType !== 'transfer-in'
      );

      dataIngresos.push(evsMes.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0));
      dataCuotas.push(evsMes.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto').reduce((s,e)=>s+Math.abs(e.cuantia),0));
      dataBasicos.push(evsMes.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0));
      dataOtros.push(evsMes.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return !ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0));
    }

    const labels = months.map(m => {
      const [y, mo] = m.split('-');
      return new Date(+y, +mo-1, 1).toLocaleDateString('es-ES', {month:'short', year:'2-digit'});
    });

    charts['chart-breakdown-mensual'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label:'Ingresos', data:dataIngresos, backgroundColor:'rgba(0,229,160,0.7)', borderWidth:0, borderRadius:2, order:1 },
          { label:'Cuotas préstamos', data:dataCuotas, backgroundColor:'rgba(168,85,247,0.75)', borderWidth:0, borderRadius:2, stack:'gastos', order:2 },
          { label:'Gastos básicos', data:dataBasicos, backgroundColor:'rgba(77,159,255,0.75)', borderWidth:0, borderRadius:2, stack:'gastos', order:2 },
          { label:'Otros gastos', data:dataOtros, backgroundColor:'rgba(255,77,109,0.65)', borderWidth:0, borderRadius:2, stack:'gastos', order:2 },
        ]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        interaction:{ mode:'index', intersect:false },
        plugins:{
          legend:{ labels:{ color:'#8b92a8', font:{size:11}, boxWidth:12 } },
          tooltip:{
            backgroundColor:'#13161e', borderColor:'#252a38', borderWidth:1,
            titleColor:'#8b92a8', bodyColor:'#e8eaf2',
            callbacks:{ label: ctx => ` ${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y)}` }
          }
        },
        scales:{
          x:{ ticks:{color:'#555d77', maxTicksLimit:12}, grid:{color:'#252a38'} },
          y:{ stacked:true, ticks:{color:'#555d77', callback:v=>FinanceMath.eur(v)}, grid:{color:'#252a38'} }
        }
      }
    });
  }

  function renderChartExpenseDonut({ gastosBasicosMediaMes, gastosMediaMes, cuotasMediaMes, ingresosMediaMes, amortizacionesMediaMes=0 }) {
    const ctx = document.getElementById('chart-expense-donut'); if (!ctx) return;
    const otrosGastos = Math.max(0, gastosMediaMes - gastosBasicosMediaMes);
    const ahorro      = Math.max(0, ingresosMediaMes - cuotasMediaMes - gastosMediaMes - amortizacionesMediaMes);
    const segments = [
      { label:'Básicos',         value: gastosBasicosMediaMes, color:'#4d9fff' },
      { label:'Otros gastos',    value: otrosGastos,           color:'#ff4d6d' },
      { label:'Deuda',           value: cuotasMediaMes,        color:'#a855f7' },
      { label:'Amortizaciones',  value: amortizacionesMediaMes,color:'#fb923c' },
      { label:'Ahorro est.',     value: ahorro,                color:'#00e5a0' },
    ].filter(s => s.value > 0);
    if (!segments.length) return;
    if (charts['chart-expense-donut']) { try { charts['chart-expense-donut'].destroy(); } catch{} }
    charts['chart-expense-donut'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: segments.map(s=>s.label),
        datasets: [{ data: segments.map(s=>s.value), backgroundColor: segments.map(s=>s.color), borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor:'#13161e', borderColor:'#252a38', borderWidth:1,
            titleColor:'#8b92a8', bodyColor:'#e8eaf2',
            callbacks: { label: c => { const total=segments.reduce((s,x)=>s+x.value,0); return ` ${c.label}: ${FinanceMath.eur(c.parsed)} (${(c.parsed/(total||c.parsed)*100).toFixed(1)}%)`; } }
          }
        }
      }
    });
  }

  function toggleConfig() {
    const cfg = State.get('config');
    State.set('config', { ...cfg, configCollapsed: !cfg.configCollapsed });
    render();
  }

  function applyConfig() {
    const existing = State.get('config');
    const config={
      ...existing,
      dashboardStart:  document.getElementById('cfg-start').value || existing.dashboardStart,
      dashboardEnd:    document.getElementById('cfg-end').value || existing.dashboardEnd,
      colchonMeses:    parseInt(document.getElementById('cfg-colchon')?.value)||6,
      colchonFijo:     parseFloat(document.getElementById('cfg-colchon-fijo')?.value)||0,
      showColchon:     document.getElementById('cfg-show-colchon')?.checked??true,
      showHistorico:   document.getElementById('cfg-show-hist')?.checked??true,
      showMC:          document.getElementById('cfg-show-mc')?.checked??false,
    };
    State.set('config',config); render();
  }
  function applyPreset(preset) {
    const startEl = document.getElementById('cfg-start');
    const endEl   = document.getElementById('cfg-end');
    const base = startEl?.value || State.get('config').dashboardStart;
    const dS   = new Date(base + 'T00:00:00');
    const dE   = new Date(dS);
    switch(preset) {
      case '1M':  dE.setMonth(dE.getMonth()+1);    break;
      case '3M':  dE.setMonth(dE.getMonth()+3);    break;
      case '6M':  dE.setMonth(dE.getMonth()+6);    break;
      case '1Y':  dE.setFullYear(dE.getFullYear()+1); break;
      case '5Y':  dE.setFullYear(dE.getFullYear()+5); break;
      case '10Y': dE.setFullYear(dE.getFullYear()+10); break;
    }
    if (endEl) endEl.value = dE.toISOString().slice(0,10);
    applyConfig();
  }
  function setColchonTipo(tipo) {
    const cfg = State.get('config');
    State.set('config', {...cfg, colchonTipo: tipo});
    render();
  }
  function setVentana(v) { ventana=v; render(); }
  function toggleTag(t) { if(activeTags.has(t))activeTags.delete(t); else activeTags.add(t); render(); }
  function toggleAccFilter(id) { if(filtroAccounts.includes(id)) filtroAccounts=filtroAccounts.filter(a=>a!==id); else filtroAccounts.push(id); render(); }
  function clearAccFilter() { filtroAccounts=[]; render(); }
  function toggleCriticos() {
    const cfg = State.get('config');
    State.set('config', {...cfg, showCriticos: !(cfg.showCriticos !== false)});
    render();
  }

  return { render, applyConfig, applyPreset, setColchonTipo, setVentana, toggleTag, toggleAccFilter, clearAccFilter, toggleExecSummary, toggleScoreDetail, toggleCriticos, toggleConfig };
})();
