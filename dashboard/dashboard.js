// Depends on: State, FinanceMath, UI
const DashboardModule = (() => {
  let charts={}, ventana='mes', activeTags=new Set(), filtroAccounts=[], chartMode='summed', tagGroupsMode='desglosado', saludView='mes';
  // Stable color palette for promoted tags (index 0 reserved for base categories)
  const _TAG_PROMO_PALETTE = ['#f97316','#eab308','#22d3ee','#a78bfa','#34d399','#fb7185','#60a5fa','#c084fc','#4ade80','#f472b6'];
  // colchon + historial toggles driven from config, no local state needed

  function destroyCharts() { Object.values(charts).forEach(c=>{try{c.destroy();}catch{}}); charts={}; }

  const _SEM_COLOR = { verde:'#00e5a0', amarillo:'#ffd166', rojo:'#ff4d6d', neutral:'var(--text3)' };
  function _dot(sem) {
    return `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${_SEM_COLOR[sem]};flex-shrink:0"></span>`;
  }
  function _pct(v) { return v !== null && v !== undefined ? v.toFixed(1)+'%' : '—'; }

  function renderSaludFinanciera(s) {
    if (!s || s.ingresos < 0.01) return '<div class="text-sm" style="text-align:center;padding:20px;color:var(--text3)">Sin ingresos proyectados en el período seleccionado.</div>';
    const e = FinanceMath.eur;
    return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px">

      <!-- Ahorro -->
      <div style="background:var(--bg3);border-radius:var(--radius);padding:14px;border:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
          ${_dot(s.semAhorro)}
          <span style="font-size:12px;font-weight:600;color:var(--text2)">Capacidad de ahorro</span>
        </div>
        <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:${_SEM_COLOR[s.semAhorro]};line-height:1">${_pct(s.tasaAhorro)}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:3px">${e(s.ahorroReal)}/mes</div>
        ${s.amortizaciones > 0.01 ? `
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--text3)">
          Ahorro bruto: ${e(s.ahorroBruto)}/mes<br>
          <span style="color:var(--accent)">+ ${e(s.amortizaciones)}/mes amortizaciones</span>
        </div>` : ''}
        <div style="margin-top:8px;font-size:10px;color:var(--text3)">🟢 ≥${s.umbralAhorroVerde}% &nbsp;🟡 ≥${s.umbralAhorroAmarillo}% &nbsp;🔴 debajo</div>
      </div>

      <!-- DTI -->
      <div style="background:var(--bg3);border-radius:var(--radius);padding:14px;border:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
          ${_dot(s.semDTI)}
          <span style="font-size:12px;font-weight:600;color:var(--text2)">Endeudamiento (DTI)</span>
        </div>
        <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:${_SEM_COLOR[s.semDTI]};line-height:1">${_pct(s.dti)}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:3px">Cuotas: ${e(s.excluyeHipoteca ? s.cuotas - s.cuotasHipoteca : s.cuotas)}/mes</div>
        ${s.excluyeHipoteca && s.cuotasHipoteca > 0.01 ? `
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--text3)">
          DTI total (con hipoteca): ${_pct(s.dtiTotal)}<br>
          Hipoteca: ${e(s.cuotasHipoteca)}/mes
        </div>` : ''}
        <div style="margin-top:8px;font-size:10px;color:var(--text3)">🟢 &lt;${s.umbralDTIVerde}% &nbsp;🟡 &lt;${s.umbralDTIAmarillo}% &nbsp;🔴 encima</div>
      </div>

      <!-- Distribución 50/30/20 -->
      <div style="background:var(--bg3);border-radius:var(--radius);padding:14px;border:1px solid var(--border)">
        <div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:10px">Distribución (regla ${s.regla.join('/')})</div>
        ${[
          { label:'Necesidades', val:s.pctNecesidades, sem:s.semNecesidades, obj:`≤${s.regla[0]}%`, eur:s.gastosBasicos+s.cuotas },
          { label:'Deseos',      val:s.pctDeseos,      sem:s.semDeseos,      obj:`≤${s.regla[1]}%`, eur:s.gastosOtros },
          { label:'Ahorro',      val:s.tasaAhorro,     sem:s.semAhorroRegla, obj:`≥${s.regla[2]}%`, eur:s.ahorroReal },
        ].map(r=>`
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px">
          <span style="display:flex;align-items:center;gap:5px;font-size:12px;color:var(--text2)">${_dot(r.sem)} ${r.label}</span>
          <span style="font-family:var(--font-mono);font-size:12px">
            <span style="color:${_SEM_COLOR[r.sem]}">${_pct(r.val)}</span>
            <span style="color:var(--text3);font-size:10px;margin-left:3px">${r.obj}</span>
          </span>
        </div>`).join('')}
        <div style="font-size:10px;color:var(--text3);margin-top:4px">Ajustable en ⚙ Umbrales</div>
      </div>

    </div>`;
  }

  function renderSaludConfig(config) {
    const r = config.saludRegla || [50,30,20];
    return `
      <div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:12px">Configurar umbrales</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
        <div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Tasa de ahorro</div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-size:11px;color:var(--text2)">🟢 ≥</span>
            <input type="number" class="form-input" id="salud-ahorro-verde" value="${config.saludUmbralAhorroVerde??20}" min="0" max="100" style="width:60px;font-size:12px;padding:3px 6px">
            <span style="font-size:11px;color:var(--text2)">% &nbsp;🔴 &lt;</span>
            <input type="number" class="form-input" id="salud-ahorro-rojo" value="${config.saludUmbralAhorroAmarillo??10}" min="0" max="100" style="width:60px;font-size:12px;padding:3px 6px">
            <span style="font-size:11px;color:var(--text2)">%</span>
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Endeudamiento (DTI)</div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-size:11px;color:var(--text2)">🟢 &lt;</span>
            <input type="number" class="form-input" id="salud-dti-verde" value="${config.saludUmbralDTIVerde??30}" min="0" max="100" style="width:60px;font-size:12px;padding:3px 6px">
            <span style="font-size:11px;color:var(--text2)">% &nbsp;🔴 ≥</span>
            <input type="number" class="form-input" id="salud-dti-rojo" value="${config.saludUmbralDTIAmarillo??40}" min="0" max="100" style="width:60px;font-size:12px;padding:3px 6px">
            <span style="font-size:11px;color:var(--text2)">%</span>
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Regla de distribución <span style="color:var(--text3)">(Nec./Deseos/Ahorro — recomendado: 50/30/20)</span></div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <input type="number" class="form-input" id="salud-regla-0" value="${r[0]}" min="0" max="100" style="width:55px;font-size:12px;padding:3px 6px">
            <span style="color:var(--text3)">/</span>
            <input type="number" class="form-input" id="salud-regla-1" value="${r[1]}" min="0" max="100" style="width:55px;font-size:12px;padding:3px 6px">
            <span style="color:var(--text3)">/</span>
            <input type="number" class="form-input" id="salud-regla-2" value="${r[2]}" min="0" max="100" style="width:55px;font-size:12px;padding:3px 6px">
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Hipoteca en el DTI</div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <label class="toggle"><input type="checkbox" id="salud-excl-hipoteca" ${config.saludExcluirHipoteca?'checked':''}><span class="toggle-slider"></span></label>
            <span style="font-size:12px;color:var(--text2)">Excluir hipoteca del DTI principal</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:11px;color:var(--text3)">Tag hipoteca:</span>
            <input type="text" class="form-input" id="salud-tag-hipoteca" value="${config.saludTagHipoteca||'hipoteca'}" style="width:100px;font-size:12px;padding:3px 6px">
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;align-items:center">
        <button class="btn-primary btn-sm" onclick="DashboardModule.applySaludConfig()">Guardar</button>
        <button class="btn-secondary btn-sm" onclick="DashboardModule.resetSaludConfig()">Restaurar recomendados (50/30/20)</button>
      </div>
    `;
  }

  function toggleExecSummary() {
    const cfg = State.get('config');
    State.set('config', {...cfg, showExecSummary: !cfg.showExecSummary});
    render();
  }

  function toggleAnalisis() {
    const cfg = State.get('config');
    State.set('config', {...cfg, analisisCollapsed: !cfg.analisisCollapsed});
    render();
  }

  function render() {
    destroyCharts();
    const view=document.getElementById('view-dashboard');
    const config=State.get('config');
    const allLoans=State.get('loans'), allExpenses=State.get('expenses'), accounts=State.get('accounts'), allNominas=State.get('nominas')||[];

    // Filter by active scenario
    const escenarioActivo = config.escenarioActivo || null;
    const filtered = FinanceMath.filtrarPorEscenario(allLoans, allExpenses, allNominas, accounts, escenarioActivo);
    const loans    = filtered.loans;
    const expenses = filtered.expenses;
    const nominas  = filtered.nominas;
    // Use filtered accounts for projection (scenario accounts only appear when active)
    const accountsForExtracto = escenarioActivo ? filtered.accounts : accounts;

    // Apply inflation on top of base extracto
    const inflGlobal    = config.inflacionGlobal||0;
    const usarInflacion = config.usarInflacion||false;
    const inflPeriodos  = State.get('inflacion') || [];
    // When usarInflacion is active, generarExtracto already includes inflation events;
    // only apply the legacy per-expense inflation factor when the module is NOT active.
    let extracto=FinanceMath.generarExtracto(loans,expenses,accountsForExtracto,config, filtroAccounts.length>0?filtroAccounts:null, nominas, inflPeriodos);
    if (!usarInflacion) {
      const debeInflar = inflGlobal > 0 || expenses.some(e=>e.inflacion>0);
      if (debeInflar) {
        const allExpEvents = extracto.filter(e=>e.sourceType==='expense');
        const inflated = FinanceMath.aplicarInflacion(allExpEvents, expenses, inflGlobal, null, false);
        const inflMap = new Map(inflated.map(e=>[e.sourceId+'_'+e.fecha, e.cuantia]));
        extracto = extracto.map(e => e.sourceType==='expense' ? {...e, cuantia: inflMap.get(e.sourceId+'_'+e.fecha)||e.cuantia} : e);
        extracto = FinanceMath.recomputarSaldoAcum(extracto, accounts, config, filtroAccounts.length>0?filtroAccounts:null);
      }
    }
    const cuentasActivas=accountsForExtracto.filter(a=>a.activo&&(filtroAccounts.length===0||filtroAccounts.includes(a._id)));
    const saldoBase=cuentasActivas.reduce((s,a)=>s+FinanceMath.saldoRealCuenta(a),0);
    const saldoFinal=extracto.length>0?extracto[extracto.length-1].saldoAcum:saldoBase;
    const saldoHoy=FinanceMath.saldoHoy(extracto, accountsForExtracto, filtroAccounts.length>0?filtroAccounts:null);
    const totalGastos=extracto.filter(e=>e.tipo==='gasto').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const totalIngresos=extracto.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const mediaMensual=FinanceMath.mediaMensualGastos(extracto, config);
    const allTags=[...new Set(extracto.flatMap(e=>e.tags||[]))];
    const alertas = FinanceMath.detectarPuntosCriticos(extracto, 0).slice(0,5);
    const saldosPorCuentaRender = FinanceMath.saldosPorCuentaEnExtracto(extracto, accounts);
    const margenesActivosRender = (config.margenesSeguridad||[]).filter(m => m.activo !== false);
    const alertasMargRender = FinanceMath.detectarCrucesMargenes(margenesActivosRender, extracto, saldosPorCuentaRender, expenses, config, loans);
    const goals = State.get('goals') || [];
    if (activeTags.size===0) {
      const saved = config.activeTagsFilter;
      if (saved && saved.length > 0) saved.forEach(t=>activeTags.add(t));
      else allTags.forEach(t=>activeTags.add(t));
    }

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
      loans, expenses, accountsForExtracto, cfgMesActual,
      filtroAccounts.length > 0 ? filtroAccounts : null, nominas, inflPeriodos
    );
    // Mismo filtro que el gráfico breakdown: sin transferencias
    const evsMesActual = extractoMesActual.filter(e =>
      e.sourceType !== 'transfer-out' && e.sourceType !== 'transfer-in'
    );

    const ingresosMesActual      = evsMesActual.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    // Solo préstamos cuya fechaInicio <= hoy (ya arrancados)
    const _loanIdsIniciados = new Set(loans.filter(l=>(l.fechaInicio||'')<=hoyStr).map(l=>l._id));
    const cuotasMesActual        = evsMesActual.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto'&&_loanIdsIniciados.has(e.sourceId)).reduce((s,e)=>s+Math.abs(e.cuantia),0);
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

    // ── Salud financiera — métricas para mes actual y media ──────────────────────
    const _hipotecaIds = new Set(loans.filter(l => (l.tags||[]).includes(config.saludTagHipoteca||'hipoteca')).map(l => l._id));
    const amortizacionesMesActual = evsMesActual.filter(e=>e.sourceType==='loan-amort').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const cuotasHipotecaMesActual = evsMesActual.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto'&&_hipotecaIds.has(e.sourceId)).reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const cuotasHipotecaMedia = evSinTransf.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto'&&_hipotecaIds.has(e.sourceId)).reduce((s,e)=>s+Math.abs(e.cuantia),0)/numMeses;

    const _metSaludMes = { ingresos:ingresosMesActual, cuotas:cuotasMesActual, cuotasHipoteca:cuotasHipotecaMesActual, gastosBasicos:gastosBasicosMesActual, gastosOtros:gastosOtrosMesActual, amortizaciones:amortizacionesMesActual };
    const _metSaludMedia = { ingresos:ingresosMediaMes, cuotas:cuotasMediaMes, cuotasHipoteca:cuotasHipotecaMedia, gastosBasicos:gastosBasicosMediaMes, gastosOtros:gastosMediaMes-gastosBasicosMediaMes, amortizaciones:amortizacionesMediaMes };
    const saludMes   = FinanceMath.calcSaludFinanciera(_metSaludMes, config);
    const saludMedia = FinanceMath.calcSaludFinanciera(_metSaludMedia, config);

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
    const loansFinEnPeriodo  = loansActivos.filter(l => l.mostrarFechaFinEnDashboard !== false).map(l => {
      const { fechaFin } = FinanceMath.resumenPrestamo(l);
      if (!fechaFin || fechaFin < config.dashboardStart || fechaFin > config.dashboardEnd) return null;
      return { loan: l, fechaFin };
    }).filter(Boolean);
    // Cuotas al inicio y fin del periodo, leídas de las tablas de amortización
    const _tablasAmort = loansActivos.map(l => FinanceMath.resumenPrestamo(l).tabla);
    const _cuotasDelMes = (mes) => {
      const ini = mes+'-01';
      const fin = new Date(parseInt(mes.slice(0,4)), parseInt(mes.slice(5,7)), 0).toISOString().slice(0,10);
      return _tablasAmort.reduce((s, tabla) => {
        const row = tabla.find(r => !r.esAmortizacion && r.fecha >= ini && r.fecha <= fin);
        return s + (row ? row.cuota : 0);
      }, 0);
    };
    const cuotasInicio = _cuotasDelMes(config.dashboardStart.slice(0,7));
    const cuotasFin    = _cuotasDelMes(config.dashboardEnd.slice(0,7));


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
    // All unique tags from expenses (for promoted-tags config UI)
    const allExpTags=[...new Set(expenses.flatMap(e=>e.tags||[]))].filter(Boolean).sort();
    const tagCategorias = config.tagCategorias || [];
    const grupoTags = new Set(config.tagGrupos || []);

    // Helper: returns the first promoted tag for an expense, or null
    const _tagPromocionada = (expId) => {
      const ex = expenses.find(ex => ex._id === expId);
      if (!ex) return null;
      for (const t of tagCategorias) { if ((ex.tags || []).includes(t)) return t; }
      return null;
    };

    // Media mensual por tag promovida (period average) — must be computed before view.innerHTML
    const _tagPromoMediaMes = {};
    for (const t of tagCategorias) _tagPromoMediaMes[t] = 0;
    evSinTransf.filter(e => e.tipo === 'gasto' && e.sourceType === 'expense').forEach(e => {
      const ex = expenses.find(ex => ex._id === e.sourceId);
      if (!ex || ex.basico) return;
      const tp = _tagPromocionada(e.sourceId);
      if (tp) _tagPromoMediaMes[tp] = (_tagPromoMediaMes[tp] || 0) + Math.abs(e.cuantia) / numMeses;
    });
    const totalTagPromoMediaMes = Object.values(_tagPromoMediaMes).reduce((s, v) => s + v, 0);

    view.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuadro de <span>Mando</span></h1>
      </div>

      ${escenarioActivo ? (() => {
        const esc = (State.get('escenarios')||[]).find(e=>e._id===escenarioActivo);
        const color = esc?.color || '#6366f1';
        return `<div class="card mb-14" style="padding:10px 16px;background:rgba(99,102,241,0.07);border:1px solid ${color}44;display:flex;align-items:center;gap:12px">
          <span style="font-size:16px">🔭</span>
          <div style="flex:1;font-size:13px">
            <span style="font-weight:600;color:${color}">Escenario: ${esc?.nombre||escenarioActivo}</span>
            ${esc?.descripcion ? `<span style="color:var(--text3);margin-left:8px">${esc.descripcion}</span>` : ''}
          </div>
          <button class="btn-secondary btn-sm" onclick="EscenariosModule.desactivar();Router.navigate('dashboard')">✕ Salir</button>
        </div>`;
      })() : ''}

      <!-- Hero KPIs -->
      <div class="dash-hero mb-14">
        <div class="dash-hero-item">
          <div class="dash-hero-label">Saldo actual</div>
          <div class="dash-hero-val ${saldoHoy>=0?'pos':'neg'}">${FinanceMath.eur(saldoHoy)}</div>
          <div class="dash-hero-sub">${new Date().toISOString().slice(0,10)}</div>
        </div>
        <div class="dash-hero-item">
          <div class="dash-hero-label">Ingresos este mes</div>
          <div class="dash-hero-val pos">${FinanceMath.eur(ingresosMesActual)}</div>
          <div class="dash-hero-sub">${mesActualLabel}</div>
        </div>
        <div class="dash-hero-item">
          <div class="dash-hero-label">Gastos este mes</div>
          <div class="dash-hero-val ${gastosTosMesActual>0?'neg':''}">${FinanceMath.eur(gastosTosMesActual)}</div>
          <div class="dash-hero-sub">cuotas + básicos + otros</div>
        </div>
        ${(()=>{
          const ahorro = ingresosMesActual - gastosTosMesActual;
          return `<div class="dash-hero-item">
            <div class="dash-hero-label">Ahorro est. mes</div>
            <div class="dash-hero-val ${ahorro>=0?'pos':'neg'}">${ahorro>=0?'+':''}${FinanceMath.eur(ahorro)}</div>
            <div class="dash-hero-sub">${mesActualLabel}</div>
          </div>`;
        })()}
      </div>

      ${(()=>{
        const hoyD = new Date().toISOString().slice(0,10);
        const en7D  = new Date(Date.now()+7*86400000).toISOString().slice(0,10);
        const prox  = extracto.filter(e=>e.fecha>=hoyD&&e.fecha<=en7D&&e.tipo==='gasto'&&e.sourceType!=='transfer-out').slice(0,6);
        if (!prox.length) return '';
        return `<div class="card mb-14" style="padding:12px 16px">
          <div class="card-title mb-10">📅 Próximos 7 días</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${prox.map(e=>`<div style="display:flex;justify-content:space-between;align-items:center;font-size:13px">
              <div><span style="color:var(--text3);font-size:11px;margin-right:8px;font-family:var(--font-mono)">${e.fecha.slice(5)}</span>${e.concepto}</div>
              <span style="font-family:var(--font-mono);color:var(--red)">${FinanceMath.eur(e.cuantia)}</span>
            </div>`).join('')}
          </div>
        </div>`;
      })()}

      <!-- Config (colapsable) -->
      <div class="card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;${config.configCollapsed?'':'margin-bottom:14px'}">
          <span class="card-title" style="margin:0">Configuración</span>
          <button class="btn-secondary btn-sm" style="padding:4px 10px;font-size:18px;line-height:1" onclick="DashboardModule.toggleConfig()" title="${config.configCollapsed?'Expandir':'Colapsar'}">${config.configCollapsed?'▸':'▾'}</button>
        </div>
        ${config.configCollapsed ? '' : `
        <div class="grid-2" style="gap:10px">
          <div class="form-group">
            <label class="form-label">Fecha referencia</label>
            <input class="form-input" type="date" id="cfg-ref" value="${config.fechaReferencia||new Date().toISOString().slice(0,10)}"/>
            <div class="text-sm mt-4" style="color:var(--text3)">Saldo conocido en esta fecha</div>
          </div>
        </div>
        <div class="mt-8">
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" id="cfg-show-hist" ${config.showHistorico?'checked':''}/><span class="toggle-slider"></span></label>
            Mostrar histórico real en gráfica
          </label>
          <div class="text-sm mt-6" style="color:var(--text3)">Los márgenes de seguridad se configuran en <a href="#" onclick="Router.navigate('margenes');return false" style="color:var(--accent)">Márgenes de seguridad</a>.</div>
        </div>
        <div class="flex gap-8 mt-8 items-center flex-wrap">
          <span class="text-sm">Filtrar cuentas:</span>
          ${accPills}
          <button class="btn-secondary btn-sm" onclick="DashboardModule.clearAccFilter()">Todas</button>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;row-gap:6px">
            <label class="form-inline gap-8" style="font-size:12px;color:var(--text2)">
              <label class="toggle"><input type="checkbox" id="cfg-show-mc" ${config.showMC?'checked':''}/><span class="toggle-slider"></span></label>
              Monte Carlo
            </label>
            <button class="btn-primary btn-sm" onclick="DashboardModule.applyConfig()">Actualizar</button>
          </div>
        </div>
        ${allExpTags.length>0?`<div class="mt-10">
          <div class="form-label mb-6">Etiquetas como categoría propia</div>
          <div class="tag-filter-bar" id="cfg-tag-cat-bar">
            ${allExpTags.map((t,i)=>{
              const idx=tagCategorias.indexOf(t);
              const active=idx>=0;
              const color=active?_TAG_PROMO_PALETTE[idx%_TAG_PROMO_PALETTE.length]:'';
              const safeName=t.replace(/'/g,"\\'");
              return `<span class="tag${active?' active':''}" style="${active?`background:${color}22;color:${color};border-color:${color}`:''};cursor:pointer" onclick="DashboardModule.toggleTagCategoria('${safeName}')">${t}</span>`;
            }).join('')}
          </div>
          <div class="text-sm mt-4" style="color:var(--text3)">Las etiquetas activas aparecen como segmento propio en los gráficos en lugar de "Otros gastos".</div>
        </div>`:''}
        ${cuentasActivas.length>0?`<div class="mt-8 text-sm" style="color:var(--text3)">Ref. ${config.fechaReferencia||'—'}: ${cuentasActivas.map(a=>`${a.nombre} ${FinanceMath.eur(FinanceMath.saldoEnFecha(a, config.fechaReferencia||config.dashboardStart))}`).join(' · ')} · Total: ${FinanceMath.eur(cuentasActivas.reduce((s,a)=>s+FinanceMath.saldoEnFecha(a,config.fechaReferencia||config.dashboardStart),0))}</div>`:''}
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
          <div class="exec-item-label">Salud financiera</div>
          ${(()=>{
            const s=saludMes;
            const sc={'verde':'#00e5a0','amarillo':'#ffd166','rojo':'#ff4d6d','neutral':'var(--text3)'};
            const sems=[s.semAhorro,s.semDTI,s.semNecesidades];
            const dots=sems.map(sem=>`<span style="width:8px;height:8px;border-radius:50%;background:${sc[sem]||'var(--text3)'};display:inline-block"></span>`).join('');
            const worst=sems.includes('rojo')?'rojo':sems.includes('amarillo')?'amarillo':sems.every(x=>x==='verde')?'verde':'neutral';
            const lbl={'verde':'Saludable','amarillo':'Atención','rojo':'Revisar','neutral':'Sin datos'}[worst]||'—';
            return `<div class="exec-item-val" style="color:${sc[worst]};display:flex;align-items:center;gap:5px">${dots}<span>${lbl}</span></div>`;
          })()}
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
          <div class="exec-item-label">Márgenes</div>
          ${(()=>{
            if (margenesActivosRender.length === 0) return `<div class="exec-item-val" style="color:var(--text3)">Sin definir</div>`;
            const cruces = alertasMargRender.filter(a => a.tipo === 'bajo_margen').length;
            const color = cruces === 0 ? 'var(--accent)' : 'var(--red)';
            return `<div class="exec-item-val" style="color:${color}">${margenesActivosRender.length} activo${margenesActivosRender.length>1?'s':''}</div>
                    <div style="font-size:10px;color:${color};margin-top:1px">${cruces === 0 ? '✓ sin cruces' : `⚠ ${cruces} cruce${cruces>1?'s':''}`}</div>`;
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
        ${(()=>{
          const today = new Date().toISOString().slice(0, 10);
          const evExtraord = extracto.filter(e =>
            e.tipo === 'gasto' && e.sourceType === 'expense' &&
            e.fecha >= config.dashboardStart && e.fecha <= today
          ).filter(e => {
            const ex = expenses.find(ex => ex._id === e.sourceId);
            return ex?.tipoFrecuencia === 'extraordinario';
          });
          const totalExtraord = evExtraord.reduce((s, e) => s + Math.abs(e.cuantia), 0);
          if (!evExtraord.length) return `<div class="stat-card">
            <div class="stat-label">Gastos extraordinarios</div>
            <div class="stat-value" style="color:var(--text3)">0,00 €</div>
            <div class="stat-sub">Sin gastos únicos en el periodo</div>
          </div>`;
          const agrup = {};
          evExtraord.forEach(e => {
            const ex = expenses.find(ex => ex._id === e.sourceId);
            const key = ex?.concepto || e.concepto || '—';
            agrup[key] = (agrup[key] || 0) + Math.abs(e.cuantia);
          });
          const items = Object.entries(agrup).sort((a, b) => b[1] - a[1]).slice(0, 4);
          const resto = Object.entries(agrup).length - items.length;
          return `<div class="stat-card">
            <div class="stat-label">Gastos extraordinarios</div>
            <div class="stat-value neg" style="font-size:18px">${FinanceMath.eur(totalExtraord)}</div>
            <div style="display:flex;flex-direction:column;gap:3px;margin-top:6px">
              ${items.map(([label, val]) => `
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:11px">
                  <span style="color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px" title="${label}">${label}</span>
                  <span style="font-family:var(--font-mono);color:var(--red);flex-shrink:0">${FinanceMath.eur(val)}</span>
                </div>`).join('')}
              ${resto > 0 ? `<div style="font-size:10px;color:var(--text3);margin-top:1px">+${resto} más…</div>` : ''}
            </div>
            <div class="stat-sub" style="margin-top:4px">${evExtraord.length} evento${evExtraord.length !== 1 ? 's' : ''} · desde ${config.dashboardStart}</div>
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
            <!-- Cuota mensual total -->
            ${(()=>{
              const cuotasDelta = cuotasFin - cuotasInicio;
              const cuotasColor = cuotasDelta <= 0 ? 'var(--accent)' : 'var(--red)';
              return `<div style="background:var(--bg3);border-radius:var(--radius);padding:12px;border:1px solid var(--border)">
              <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Cuota mensual total</div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Inicio</span><span style="font-family:var(--font-mono)">${FinanceMath.eur(cuotasInicio)}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--text3)">Fin</span><span style="font-family:var(--font-mono)">${FinanceMath.eur(cuotasFin)}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;border-top:1px solid var(--border);padding-top:4px;margin-top:2px">
                  <span style="color:var(--text3)">Diferencia</span>
                  <span style="font-family:var(--font-mono);font-weight:700;color:${cuotasColor}">${cuotasDelta<=0?'':'+'}${FinanceMath.eur(cuotasDelta)}</span>
                </div>
              </div>
            </div>`;
            })()}
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

      <!-- KPI financieros: donut distribución + rendimiento + desglose otros -->
      <div class="grid-2 mb-14" style="gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">

        <!-- Donut distribución de ingresos (media mensual del periodo) -->
        <div class="card">
          <div class="card-title mb-8">Distribución media mensual (periodo)</div>
          ${(()=>{
            const otrosGastosMed = Math.max(0, gastosMediaMes - gastosBasicosMediaMes - totalTagPromoMediaMes);
            const ahorroMed      = Math.max(0, ingresosMediaMes - cuotasMediaMes - gastosMediaMes - amortizacionesMediaMes);
            const totalRef       = ingresosMediaMes > 0 ? ingresosMediaMes : (cuotasMediaMes + gastosMediaMes + amortizacionesMediaMes + 0.01);
            const pctBasicos = (gastosBasicosMediaMes / totalRef * 100).toFixed(1);
            const pctOtros   = (otrosGastosMed / totalRef * 100).toFixed(1);
            const pctDeuda   = (cuotasMediaMes / totalRef * 100).toFixed(1);
            const pctAmort   = (amortizacionesMediaMes / totalRef * 100).toFixed(1);
            const pctAhorro  = (ahorroMed / totalRef * 100).toFixed(1);
            const ahorroColor = ahorroMed > 0 ? 'var(--accent)' : 'var(--text3)';
            const legendRow = (color, label, amount, pct) =>
              `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px">
                <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:${color};display:inline-block"></span><span style="color:var(--text2)">${label}</span></span>
                <span style="font-family:var(--font-mono)">${FinanceMath.eur(amount)}<span style="color:var(--text3);margin-left:4px">${pct}%</span></span>
              </div>`;
            return `
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
              <div style="position:relative;width:140px;height:140px;flex-shrink:0"><canvas id="chart-expense-donut"></canvas></div>
              <div style="flex:1;min-width:130px;display:flex;flex-direction:column;gap:7px">
                ${legendRow('#4d9fff','Básicos',gastosBasicosMediaMes,pctBasicos)}
                ${tagCategorias.map((t,i)=>{
                  const v=_tagPromoMediaMes[t]||0; if(v<0.01)return '';
                  const c=_TAG_PROMO_PALETTE[i%_TAG_PROMO_PALETTE.length];
                  return legendRow(c,t,v,(v/totalRef*100).toFixed(1));
                }).join('')}
                ${legendRow('#ff4d6d','Otros gastos',otrosGastosMed,pctOtros)}
                ${legendRow('#a855f7','Deuda',cuotasMediaMes,pctDeuda)}
                ${amortizacionesMediaMes > 0.01 ? legendRow('#fb923c','Amortizaciones',amortizacionesMediaMes,pctAmort) : ''}
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;border-top:1px solid var(--border);padding-top:6px">
                  <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#00e5a0;display:inline-block"></span><span style="color:var(--text2)">Ahorro est.</span></span>
                  <span style="font-family:var(--font-mono);font-weight:700;color:${ahorroColor}">${FinanceMath.eur(ahorroMed)}<span style="margin-left:4px">${pctAhorro}%</span></span>
                </div>
                <div style="font-size:10px;color:var(--text3);margin-top:2px">Ingresos: ${FinanceMath.eur(ingresosMediaMes)}/mes</div>
              </div>
            </div>`;
          })()}
        </div>

        <!-- Donut desglose "Otros gastos" por categoría/tag -->
        <div class="card">
          <div class="card-title mb-8">Desglose otros gastos</div>
          <div id="dash-otros-donut-wrap" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
            <div style="position:relative;width:140px;height:140px;flex-shrink:0"><canvas id="chart-otros-donut"></canvas></div>
            <div id="dash-otros-legend" style="flex:1;min-width:120px;display:flex;flex-direction:column;gap:6px;font-size:12px"></div>
          </div>
        </div>

        <div class="card">
          <div class="card-title mb-8">Distribución de saldos</div>
          ${(()=>{
            const cuentasActivas = accounts.filter(a => a.activo && !a.simulacion);
            const saldoTotal = cuentasActivas.reduce((s, a) => s + FinanceMath.saldoRealCuenta(a), 0);
            // Límite más alto activo hoy: max(colchón, márgenes de seguridad)
            const colchonHoy = FinanceMath.calcColchonEnFecha(expenses, config, loans, hoyStr);
            const margenesHoy = margenesActivosRender.map(m =>
              FinanceMath.calcMargenEnFecha(m, expenses, config, loans, hoyStr, true)
            );
            const limiteHoy = Math.max(colchonHoy, ...margenesHoy, 0);
            const saldoDisponible = saldoTotal - limiteHoy;
            const _SALDO_PALETTE = ['#00e5a0','#4d9fff','#a855f7','#f97316','#eab308','#22d3ee','#fb7185','#34d399','#60a5fa','#c084fc'];
            const segments = cuentasActivas
              .map((a, i) => ({ label: a.nombre, value: Math.max(0, FinanceMath.saldoRealCuenta(a)), color: _SALDO_PALETTE[i % _SALDO_PALETTE.length] }))
              .filter(s => s.value > 0.01);
            if (!segments.length) return '<div style="font-size:12px;color:var(--text3);padding:20px 0">Sin cuentas con saldo</div>';
            const legendRow = (color, label, amount) =>
              `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px">
                <span style="display:flex;align-items:center;gap:5px"><span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span><span style="color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px" title="${label}">${label}</span></span>
                <span style="font-family:var(--font-mono);flex-shrink:0">${FinanceMath.eur(amount)}</span>
              </div>`;
            return `
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
              <div style="position:relative;width:140px;height:140px;flex-shrink:0"><canvas id="chart-saldos-donut"></canvas></div>
              <div style="flex:1;min-width:130px;display:flex;flex-direction:column;gap:6px">
                ${segments.map(s => legendRow(s.color, s.label, s.value)).join('')}
                <div style="border-top:1px solid var(--border);padding-top:6px;margin-top:2px;display:flex;flex-direction:column;gap:4px">
                  <div style="display:flex;justify-content:space-between;font-size:12px">
                    <span style="color:var(--text3)">Total</span>
                    <span style="font-family:var(--font-mono);font-weight:700">${FinanceMath.eur(saldoTotal)}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:12px" title="Saldo total menos el límite más alto activo hoy (colchón/margen: ${FinanceMath.eur(limiteHoy)})">
                    <span style="color:var(--text3)">Disponible</span>
                    <span style="font-family:var(--font-mono);font-weight:700;color:${saldoDisponible>=0?'var(--accent)':'var(--red)'}">${FinanceMath.eur(saldoDisponible)}</span>
                  </div>
                  ${limiteHoy > 0 ? `<div style="font-size:10px;color:var(--text3)">Reserva: ${FinanceMath.eur(limiteHoy)}</div>` : ''}
                </div>
              </div>
            </div>`;
          })()}
        </div>
      </div>

      <!-- Charts row 1 -->
      <div class="card mb-14">
        <div class="flex justify-between items-center mb-8" style="flex-wrap:wrap;gap:6px">
          <div class="card-title" style="margin:0">Evolución del saldo</div>
          <div class="flex gap-8 items-center flex-wrap">
            <div class="period-selector">
              <button class="period-btn ${chartMode==='summed'?'active':''}" onclick="DashboardModule.setChartMode('summed')" title="Suma de cuentas seleccionadas">∑ Total</button>
              <button class="period-btn ${chartMode==='lines'?'active':''}" onclick="DashboardModule.setChartMode('lines')" title="Una línea independiente por cuenta">∥ Líneas</button>
              <button class="period-btn ${chartMode==='stacked'?'active':''}" onclick="DashboardModule.setChartMode('stacked')" title="Apilado — más área debajo">▲ Apilado</button>
              <button class="period-btn ${chartMode==='stacked-rev'?'active':''}" onclick="DashboardModule.setChartMode('stacked-rev')" title="Apilado — menos área debajo">▽ Apilado</button>
            </div>
            ${alertas.length>0?`<button class="btn-secondary btn-sm" style="font-size:11px;color:${config.showCriticos!==false?'var(--yellow)':'var(--text3)'}" onclick="DashboardModule.toggleCriticos()">
              ⚠️ ${alertas.length} punto${alertas.length>1?'s':''} crítico${alertas.length>1?'s':''} ${config.showCriticos!==false?'(visible)':'(oculto)'}
            </button>`:''}
          </div>
        </div>
        <div class="chart-wrap-lg"><canvas id="chart-saldo"></canvas></div>
      </div>

      <!-- ── Análisis avanzado (colapsable) ─────────────────────────────────── -->
      <div class="card mb-14" style="padding:12px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="DashboardModule.toggleAnalisis()">
          <span class="card-title" style="margin:0">Análisis avanzado</span>
          <button class="btn-secondary btn-sm" style="pointer-events:none">${config.analisisCollapsed?'▸ Mostrar':'▾ Ocultar'}</button>
        </div>
      </div>
      ${config.analisisCollapsed ? '' : `

      <!-- Salud financiera -->
      <div class="card mb-14">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
          <div class="card-title" style="margin:0">Salud financiera</div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            <div class="period-selector">
              <button class="period-btn ${saludView==='mes'?'active':''}" onclick="DashboardModule.setSaludView('mes')">Mes actual</button>
              <button class="period-btn ${saludView==='media'?'active':''}" onclick="DashboardModule.setSaludView('media')">Media período</button>
            </div>
            <button class="btn-secondary btn-sm" onclick="DashboardModule.toggleSaludConfig()">⚙ Umbrales</button>
          </div>
        </div>
        ${renderSaludFinanciera(saludView==='mes'?saludMes:saludMedia)}
        <div id="salud-config-panel" style="display:none;margin-top:14px;padding:14px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
          ${renderSaludConfig(config)}
        </div>
      </div>

      <!-- Charts row 2 -->
      <div class="grid-2 mb-14">
        <div class="card">
          <div class="card-title">Ingresos vs Gastos por categoría (mensual)</div>
          <div class="chart-wrap-lg"><canvas id="chart-breakdown-mensual"></canvas></div>
        </div>
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">
            <div class="card-title" style="margin:0">Gastos por etiqueta</div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <div class="period-selector">
                <button class="period-btn ${tagGroupsMode==='desglosado'?'active':''}" onclick="DashboardModule.setTagGroupsMode('desglosado')" title="Muestra cada etiqueta de forma independiente">Desglosado</button>
                <button class="period-btn ${tagGroupsMode==='porgrupos'?'active':''}" onclick="DashboardModule.setTagGroupsMode('porgrupos')" title="Agrupa los gastos bajo su etiqueta de grupo">Por grupos</button>
              </div>
              <button class="btn-secondary btn-sm" onclick="DashboardModule.toggleGruposPanel()" title="Configurar qué etiquetas actúan como grupos">⚙ Grupos</button>
            </div>
          </div>
          <div id="dash-grupos-panel" style="display:none;margin-bottom:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px">Marca una etiqueta como <strong style="color:var(--text2)">grupo</strong>: en modo "Por grupos" los gastos que tengan esa etiqueta junto a otras se mostrarán solo bajo el grupo.</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${allTags.map(t=>`<span class="tag ${grupoTags.has(t)?'active':''}" onclick="DashboardModule.toggleTagGrupo('${t}')" style="cursor:pointer" title="${grupoTags.has(t)?'Quitar como grupo':'Marcar como grupo'}">${t}${grupoTags.has(t)?' <span style="font-size:9px;opacity:.8">GRUPO</span>':''}</span>`).join('')}
            </div>
          </div>
          <div class="tag-list mb-8">${allTags.map(t=>`<span class="tag ${activeTags.has(t)?'active':''}" onclick="DashboardModule.toggleTag('${t}')" title="${grupoTags.has(t)?'Etiqueta de grupo':''}">${t}${grupoTags.has(t)?'&nbsp;<span style="font-size:9px;opacity:.6">●</span>':''}</span>`).join('')}</div>
          <div class="chart-wrap"><canvas id="chart-gastos-tags"></canvas></div>
        </div>
      </div>
      <!-- Charts row 3 -->
      <div class="grid-2 mb-14">
        <div class="card">
          <div class="card-title">Media mensual de gastos por etiqueta <span style="font-size:11px;color:var(--text3);font-weight:400">(${tagGroupsMode==='porgrupos'?'por grupos':'desglosado'})</span></div>
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
          ${extracto.slice(0,300).map(ev=>{
            const srcBadge = ev.sourceType==='nomina'
              ? '<span style="font-size:9px;background:rgba(0,229,160,0.15);color:var(--accent);padding:1px 5px;border-radius:3px;margin-right:4px;flex-shrink:0">💼</span>'
              : ev.sourceType==='account-interest'
              ? '<span style="font-size:9px;background:rgba(77,159,255,0.15);color:#4d9fff;padding:1px 5px;border-radius:3px;margin-right:4px;flex-shrink:0">%</span>'
              : ev.sourceType==='loan'||ev.sourceType==='loan-amort'
              ? '<span style="font-size:9px;background:rgba(255,77,109,0.12);color:var(--red);padding:1px 5px;border-radius:3px;margin-right:4px;flex-shrink:0">🔒</span>'
              : '';
            return `<div class="extr-row">
            <span class="num">${ev.fecha}</span>
            <span style="display:flex;align-items:center;gap:0;min-width:0">${srcBadge}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ev.concepto}${ev.simulacion?' <span class="badge badge-sim" style="font-size:9px">SIM</span>':''}</span></span>
            <span class="num ${ev.tipo==='ingreso'?'pos':'neg'}">${FinanceMath.eur(ev.cuantia)}</span>
            <span class="text-sm extr-col-hide">${State.accountName(ev.cuenta||'default')}</span>
            <span class="num ${ev.delta>=0?'pos':'neg'} extr-col-hide">${ev.delta>=0?'+':''}${FinanceMath.eur(ev.delta)}</span>
            <span class="num ${ev.saldoAcum>=0?'':'neg'}">${FinanceMath.eur(ev.saldoAcum)}</span>
          </div>`;}).join('')}
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
            const p = 'padding:6px 8px';
            return '<tr style="' + (esHoy ? 'background:rgba(0,229,160,0.05)' : '') + '">' +
              '<td class="num" style="' + p + ';font-weight:' + (esHoy?'700':'400') + '">' + ml + (esHoy?' ◉':'') + '</td>' +
              '<td class="num pos" style="' + p + '">' + FinanceMath.eur(ing) + '</td>' +
              '<td class="num neg" style="' + p + '">' + FinanceMath.eur(cuotas) + '</td>' +
              '<td class="num neg" style="' + p + '">' + FinanceMath.eur(basicos) + '</td>' +
              '<td class="num neg" style="' + p + '">' + FinanceMath.eur(otros) + '</td>' +
              (amorts > 0 ? '<td class="num neg" style="' + p + ';color:var(--text3)">' + FinanceMath.eur(amorts) + '</td>' : '<td class="num" style="' + p + ';color:var(--text3)">—</td>') +
              '<td class="num ' + (neto>=0?'pos':'neg') + '" style="' + p + ';font-weight:600">' + (neto>=0?'+':'') + FinanceMath.eur(neto) + '</td>' +
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
          <div class="text-sm mb-8" style="color:var(--text2)">Precisión del modelo: <span class="num" style="color:${(100-mape)>90?'var(--accent)':(100-mape)>75?'var(--yellow)':'var(--red)'}">${(100-mape).toFixed(1)}%</span></div>
          <div class="dev-row dev-head"><span>Fecha</span><span>Estimado</span><span>Real</span><span>Desviación</span><span>%</span></div>
          ${desv.slice(-20).reverse().map(r=>`<div class="dev-row">
            <span class="num">${r.fecha}</span>
            <span class="num">${FinanceMath.eur(r.estimado)}</span>
            <span class="num ${r.real>=r.estimado?'pos':'neg'}">${FinanceMath.eur(r.real)}</span>
            <span class="num ${r.desv>=0?'pos':'neg'}">${r.desv>=0?'+':''}${FinanceMath.eur(r.desv)}</span>
            <span class="num ${Math.abs(r.pct)<10?'pos':Math.abs(r.pct)<25?'':'neg'}">${r.pct>=0?'+':''}${r.pct.toFixed(1)}%</span>
          </div>`).join('')}
        </div>`;
      })()}

      `}
`;

    // Pass computed metrics to chart functions
    const _metricasGraficos = { loans, expenses, config, numMeses, extracto, tagCategorias };
    const _donutMetrics = { gastosBasicosMediaMes, gastosMediaMes, cuotasMediaMes, ingresosMediaMes, amortizacionesMediaMes, tagPromoMediaMes: _tagPromoMediaMes };
    // Breakdown "otros gastos" por tag (media mensual del periodo), excluding promoted tags
    const _otrosTagMap = {};
    evSinTransf.filter(e => e.tipo === 'gasto' && e.sourceType === 'expense').forEach(e => {
      const ex = expenses.find(ex => ex._id === e.sourceId);
      if (!ex || ex.basico) return;
      if (_tagPromocionada(e.sourceId)) return; // already a promoted category
      const cat = (ex.tags && ex.tags.length > 0) ? ex.tags[0] : (ex.concepto || 'Sin categoría');
      _otrosTagMap[cat] = (_otrosTagMap[cat] || 0) + Math.abs(e.cuantia);
    });
    const _otrosTagData = Object.entries(_otrosTagMap)
      .map(([label, total]) => ({ label, value: total / numMeses }))
      .sort((a, b) => b.value - a.value);
    setTimeout(()=>{
      renderChartSaldo(extracto);
      renderChartVelas(extracto);
      renderChartTags(extracto, activeTags, grupoTags, tagGroupsMode);
      renderChartBreakdown(_metricasGraficos);
      renderChartExpenseDonut(_donutMetrics);
      renderChartOtrosDonut(_otrosTagData);
      renderChartSaldosDonut(accounts.filter(a => a.activo && !a.simulacion));
    }, 60);
  }

  function renderChartSaldo(extracto) {
    const ctx=document.getElementById('chart-saldo'); if(!ctx)return;
    const config = State.get('config');
    const expenses = State.get('expenses');
    const loans = State.get('loans');
    const accounts = State.get('accounts');
    const nominas = State.get('nominas') || [];
    const SCN_COLORS = ['#a855f7','#fb923c','#f472b6','#60a5fa','#34d399','#facc15'];

    // Convert extracto to {x: timestamp, y: saldo} for time axis (summed total)
    const saldoXY = extracto.map(e=>({ x: new Date(e.fecha+'T00:00:00').getTime(), y: e.saldoAcum }));

    // Per-account running saldos using ev.delta (correctly signed: + ingreso, - gasto).
    // Computed inline to avoid the cuantia sign-convention bug in saldosPorCuentaEnExtracto.
    const ACC_COLORS = ['#00e5a0','#a855f7','#fb923c','#f472b6','#60a5fa','#34d399','#facc15','#f87171','#e879f9','#22d3ee'];
    const selectedAccs = accounts.filter(a => a.activo && (filtroAccounts.length === 0 || filtroAccounts.includes(a._id)));
    const _running = {};
    for (const acc of selectedAccs) _running[acc._id] = FinanceMath.saldoRealCuenta(acc);
    const perAccXY = extracto.map(ev => {
      const d = ev.delta ?? (ev.tipo === 'ingreso' ? Math.abs(ev.cuantia) : -Math.abs(ev.cuantia));
      if (ev.cuenta && _running[ev.cuenta] !== undefined) _running[ev.cuenta] += d;
      return { ts: new Date(ev.fecha+'T00:00:00').getTime(), saldos: { ..._running } };
    });

    // Sort accounts by area under curve for stacked modes.
    const _auc = acc => perAccXY.reduce((s, pt) => s + Math.max(0, pt.saldos[acc._id] ?? 0), 0);
    if (chartMode === 'stacked') selectedAccs.sort((a, b) => _auc(b) - _auc(a));       // largest at bottom
    if (chartMode === 'stacked-rev') selectedAccs.sort((a, b) => _auc(a) - _auc(b));   // smallest at bottom

    // Historial scatter — LOCF por cuenta: para cada fecha en cualquier cuenta,
    // suma el saldo más reciente de CADA cuenta hasta esa fecha.
    let histDataset = null;
    if (config.showHistorico) {
      const visibles = accounts.filter(a =>
        filtroAccounts.length === 0 || filtroAccounts.includes(a._id)
      );
      // Recoger todas las fechas únicas; deduplicar por cuenta.
      // saldoInicial at fechaInicialSaldo is the anchor — pre-floor entries are excluded.
      const allDates = new Set();
      const dedupedHist = visibles.map(acc => {
        const floor = acc.fechaInicialSaldo || '';
        const byD = {};
        if (floor) byD[floor] = acc.saldoInicial || 0;
        for (const h of (acc.historicoSaldos || [])) {
          if (!floor || h.fecha >= floor) byD[h.fecha] = h.saldo;
        }
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
    if (config.showMC && (expenses.some(e=>e.varianza>0) || nominas.some(n=>n.activo&&(n.varianza||0)>0))) {
      const mcResult = FinanceMath.monteCarlo(loans, expenses, accounts, config, config.mcIteraciones||300, nominas);
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

    // Per-account running saldo for margen crossing detection
    const margenesSeguridad = (config.margenesSeguridad || []).filter(m => m.activo !== false);
    const saldosPorCuenta = FinanceMath.saldosPorCuentaEnExtracto(extracto, accounts);

    // Margen threshold lines — one per active margen
    const MARGEN_COLORS = ['rgba(251,146,60,0.8)','rgba(244,114,182,0.8)','rgba(167,139,250,0.8)','rgba(52,211,153,0.8)','rgba(96,165,250,0.8)','rgba(250,204,21,0.8)'];
    const margenDatasets = margenesSeguridad.map((mg, idx) => {
      const color = MARGEN_COLORS[idx % MARGEN_COLORS.length];
      const data = saldoXY.map(({x}) => ({ x, y: FinanceMath.calcMargenEnFecha(mg, expenses, config, loans, new Date(x).toISOString().slice(0,10)) }));
      const valorHoy = FinanceMath.calcMargenEnFecha(mg, expenses, config, loans, new Date().toISOString().slice(0,10));
      return { label: `${mg.nombre} — ${FinanceMath.eur(valorHoy)}`, data, borderColor: color, backgroundColor: 'transparent', borderWidth: 1.5, borderDash: [3,3], pointRadius: 0, tension: 0, fill: false, order: 4 };
    });

    // Critical point vertical lines (saldo negativo + márgenes)
    const alertasChart = FinanceMath.detectarPuntosCriticos(extracto, 0);
    const alertasMargenes = FinanceMath.detectarCrucesMargenes(margenesSeguridad, extracto, saldosPorCuenta, expenses, config, loans);
    const todasAlertas = [...alertasChart, ...alertasMargenes];
    const criticoDatasets = (config.showCriticos !== false) ? todasAlertas.map(alerta => {
      const ts = new Date(alerta.fecha+'T00:00:00').getTime();
      const yVals = saldoXY.map(p=>p.y);
      const yMin = Math.min(...yVals), yMax = Math.max(...yVals);
      const span = Math.abs(yMax - yMin) * 0.05;
      const color = alerta.tipo==='saldo_negativo' ? 'rgba(255,77,109,0.6)' :
                    alerta.tipo==='bajo_colchon'    ? 'rgba(255,209,102,0.5)' :
                    alerta.tipo==='bajo_margen'     ? 'rgba(251,146,60,0.6)' : 'rgba(0,229,160,0.4)';
      return { label:alerta.mensaje, data:[{x:ts,y:yMin-span},{x:ts,y:yMax+span}],
        borderColor:color, backgroundColor:color, borderWidth:1.5, borderDash:[4,4],
        pointRadius:[6,0], pointStyle:['crossRot',false], showLine:true, tension:0, fill:false, order:3 };
    }) : [];

    // Stacked area: pass CUMULATIVE values per dataset so the y-axis stays
    // unstacked (decorative overlays — limits, flags, historical — render at
    // their true y values). fill:'-1' draws each band between adjacent lines.
    const stackedDatasets = selectedAccs.map((acc, idx) => {
      const hex = ACC_COLORS[idx % ACC_COLORS.length];
      return {
        label: acc.nombre,
        data: perAccXY.map(pt => ({
          x: pt.ts,
          y: selectedAccs.slice(0, idx + 1).reduce((s, a) => s + (pt.saldos[a._id] ?? 0), 0),
        })),
        borderColor: hex,
        backgroundColor: hex + '40',
        fill: idx === 0 ? 'origin' : '-1',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1.5,
        pointHitRadius: 20,
        order: 6 + idx,
      };
    });

    // Independent lines: one dataset per account, raw (non-cumulative) values, no fill.
    const linesDatasets = selectedAccs.map((acc, idx) => {
      const hex = ACC_COLORS[idx % ACC_COLORS.length];
      return {
        label: acc.nombre,
        data: perAccXY.map(pt => ({ x: pt.ts, y: pt.saldos[acc._id] ?? 0 })),
        borderColor: hex,
        backgroundColor: hex + '22',
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1.5,
        pointHitRadius: 20,
        order: 6 + idx,
      };
    });

    const isStacked = chartMode === 'stacked' || chartMode === 'stacked-rev';
    const datasets = [
      ...mcDatasets,
      ...(isStacked
        ? stackedDatasets
        : chartMode === 'lines'
          ? linesDatasets
          : [{ label:'Saldo estimado', data:saldoXY, borderColor:'#00e5a0', backgroundColor:'rgba(0,229,160,0.07)',
               fill:true, tension:0.3, pointRadius:0, borderWidth:2, pointHitRadius:20, order:5 }]
      ),
    ];
    if (histDataset) datasets.push(histDataset);
    margenDatasets.forEach(d => datasets.push(d));

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
      const loansActivosChart = loans.filter(l => l.activo && !l.simulacion && l.mostrarFechaFinEnDashboard !== false);
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
            display: isStacked || (histDataset != null) || margenDatasets.length>0 || mcDatasets.length>0 || criticoDatasets.length>0 || datasets.some(d=>d.label?.startsWith('🏁')),
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
              label: ctx => {
                if (isStacked) {
                  const dsIdx = stackedDatasets.findIndex(d => d.label === ctx.dataset.label);
                  if (dsIdx >= 0) {
                    const prevY = dsIdx > 0 ? (ctx.chart.data.datasets[ctx.chart.data.datasets.indexOf(ctx.dataset) - 1]?.data[ctx.dataIndex]?.y ?? 0) : 0;
                    return ` ${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y - prevY)}`;
                  }
                }
                return ` ${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y)}`;
              },
              ...(isStacked ? {
                footer: items => {
                  const accItems = items.filter(i => stackedDatasets.some(d => d.label === i.dataset.label));
                  if (!accItems.length) return '';
                  const total = accItems[accItems.length - 1]?.parsed.y ?? 0;
                  return `Total: ${FinanceMath.eur(total)}`;
                }
              } : {})
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
            grid: { color: ctx => ctx.tick.value === 0 ? 'rgba(255,255,255,0.22)' : '#252a38' }
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

  // Builds a tag→total map from extracto applying the group mode.
  // 'desglosado': group tags are stripped; expense appears under its remaining tags.
  // 'porgrupos' : if an expense has ≥1 group tag, it counts only under that/those group tags;
  //               otherwise it counts under its regular tags (same as desglosado for ungrouped).
  function _tagMapConGrupos(extracto, grupoTags, mode) {
    if (!grupoTags || grupoTags.size === 0) return FinanceMath.sumarPorTags(extracto, 'gasto');
    const map = new Map();
    for (const ev of extracto) {
      if (ev.tipo !== 'gasto') continue;
      const tags = ev.tags || [];
      const grp  = tags.filter(t => grupoTags.has(t));
      let effective;
      if (mode === 'porgrupos') {
        effective = grp.length > 0 ? grp : tags.filter(t => !grupoTags.has(t));
      } else {
        // desglosado: remove group tags; if all tags were group tags skip entirely
        effective = tags.filter(t => !grupoTags.has(t));
      }
      for (const tag of effective) map.set(tag, (map.get(tag) || 0) + Math.abs(ev.cuantia));
    }
    return map;
  }

  function renderChartTags(extracto, activeTags, grupoTags=new Set(), mode='desglosado') {
    const COLORS=['#00e5a0','#4d9fff','#ffd166','#ff4d6d','#a855f7','#fb923c','#34d399','#f472b6','#60a5fa','#facc15'];

    // Donut gastos con valor en leyenda
    const ctx=document.getElementById('chart-gastos-tags'); if(!ctx) return;
    const tagMap=_tagMapConGrupos(extracto, grupoTags, mode);
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
    renderChartMediaMensual(extracto, activeTags, COLORS, grupoTags, mode);
  }

  function renderChartMediaMensual(extracto, activeTags, COLORS=['#00e5a0','#4d9fff','#ffd166','#ff4d6d','#a855f7','#fb923c','#34d399','#f472b6'], grupoTags=new Set(), mode='desglosado') {
    const config=State.get('config');
    const ctx=document.getElementById('chart-media-mensual'); if(!ctx) return;
    const tagMap=_tagMapConGrupos(extracto, grupoTags, mode);
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

  function renderChartBreakdown({ loans, expenses, config, numMeses, extracto, tagCategorias=[] }) {
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

    const dataIngresos = [], dataCuotas = [], dataBasicos = [], dataOtros = [], dataFiscal = [];
    const dataTagPromo = tagCategorias.map(() => []);

    // Helper: first promoted tag for expense (same priority logic as render)
    const _tagPromo = (expId) => {
      const ex = expenses.find(ex => ex._id === expId);
      if (!ex) return null;
      for (const t of tagCategorias) { if ((ex.tags || []).includes(t)) return t; }
      return null;
    };

    for (const mesLabel of months) {
      const mesIni = mesLabel + '-01';
      const [_my, _mm] = mesLabel.split('-').map(Number);
      const mesFin = new Date(_my, _mm, 0).toISOString().slice(0,10);

      // Misma fuente que los KPIs: el extracto proyectado, sin transferencias
      const evsMes = extracto.filter(e =>
        e.fecha >= mesIni && e.fecha <= mesFin &&
        e.sourceType !== 'transfer-out' && e.sourceType !== 'transfer-in'
      );

      const esFiscal = e => e.tipo === 'gasto' && (e.tags || []).includes('fiscal');

      dataIngresos.push(evsMes.filter(e=>e.tipo==='ingreso').reduce((s,e)=>s+Math.abs(e.cuantia),0));
      dataCuotas.push(evsMes.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto').reduce((s,e)=>s+Math.abs(e.cuantia),0));
      dataFiscal.push(evsMes.filter(esFiscal).reduce((s,e)=>s+Math.abs(e.cuantia),0));
      const gastoExpNoFiscal = evsMes.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense'&&!esFiscal(e));
      dataBasicos.push(gastoExpNoFiscal.filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return ex?.basico;}).reduce((s,e)=>s+Math.abs(e.cuantia),0));
      // Promoted tags: per-tag buckets
      tagCategorias.forEach((tag, ti) => {
        dataTagPromo[ti].push(gastoExpNoFiscal.filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return !ex?.basico&&_tagPromo(e.sourceId)===tag;}).reduce((s,e)=>s+Math.abs(e.cuantia),0));
      });
      // Otros: non-basic, non-promoted
      dataOtros.push(gastoExpNoFiscal.filter(e=>{const ex=expenses.find(ex=>ex._id===e.sourceId);return !ex?.basico&&!_tagPromo(e.sourceId);}).reduce((s,e)=>s+Math.abs(e.cuantia),0));
    }

    const labels = months.map(m => {
      const [y, mo] = m.split('-');
      return new Date(+y, +mo-1, 1).toLocaleDateString('es-ES', {month:'short', year:'2-digit'});
    });

    const promoDatasets = tagCategorias.map((tag, i) => ({
      label: tag,
      data: dataTagPromo[i],
      backgroundColor: _TAG_PROMO_PALETTE[i % _TAG_PROMO_PALETTE.length] + 'bf',
      borderWidth: 0, borderRadius: 2, stack: 'gastos', order: 2,
    }));

    charts['chart-breakdown-mensual'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label:'Ingresos', data:dataIngresos, backgroundColor:'rgba(0,229,160,0.7)', borderWidth:0, borderRadius:2, order:1 },
          { label:'Cuotas préstamos', data:dataCuotas, backgroundColor:'rgba(168,85,247,0.75)', borderWidth:0, borderRadius:2, stack:'gastos', order:2 },
          { label:'Gastos básicos', data:dataBasicos, backgroundColor:'rgba(77,159,255,0.75)', borderWidth:0, borderRadius:2, stack:'gastos', order:2 },
          { label:'Fiscal / IRPF', data:dataFiscal, backgroundColor:'rgba(251,146,60,0.75)', borderWidth:0, borderRadius:2, stack:'gastos', order:2 },
          ...promoDatasets,
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

  function renderChartExpenseDonut({ gastosBasicosMediaMes, gastosMediaMes, cuotasMediaMes, ingresosMediaMes, amortizacionesMediaMes=0, tagPromoMediaMes={} }) {
    const ctx = document.getElementById('chart-expense-donut'); if (!ctx) return;
    const tagCategorias = State.get('config').tagCategorias || [];
    const totalTagPromo = tagCategorias.reduce((s, t) => s + (tagPromoMediaMes[t] || 0), 0);
    const otrosGastos = Math.max(0, gastosMediaMes - gastosBasicosMediaMes - totalTagPromo);
    const ahorro      = Math.max(0, ingresosMediaMes - cuotasMediaMes - gastosMediaMes - amortizacionesMediaMes);
    const promoSegments = tagCategorias
      .map((t, i) => ({ label: t, value: tagPromoMediaMes[t] || 0, color: _TAG_PROMO_PALETTE[i % _TAG_PROMO_PALETTE.length] }))
      .filter(s => s.value > 0.01);
    const segments = [
      { label:'Básicos',         value: gastosBasicosMediaMes, color:'#4d9fff' },
      ...promoSegments,
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

  // Paleta de colores para el desglose de otros gastos
  const _OTROS_PALETTE = ['#ff4d6d','#f97316','#eab308','#22d3ee','#a78bfa','#34d399','#fb7185','#60a5fa','#c084fc','#4ade80'];

  function renderChartOtrosDonut(tagData) {
    const ctx = document.getElementById('chart-otros-donut'); if (!ctx) return;
    const legend = document.getElementById('dash-otros-legend');

    if (!tagData.length) {
      if (legend) legend.innerHTML = `<span style="color:var(--text3);font-size:11px">Sin gastos no básicos en el periodo</span>`;
      return;
    }

    // Agrupar en "Otros" si hay más de 8 categorías
    let segments = tagData.slice(0, 8);
    if (tagData.length > 8) {
      const resto = tagData.slice(8).reduce((s, x) => s + x.value, 0);
      segments = [...segments, { label: 'Otros', value: resto }];
    }
    const total = segments.reduce((s, x) => s + x.value, 0);
    segments = segments.map((s, i) => ({ ...s, color: _OTROS_PALETTE[i % _OTROS_PALETTE.length] }));

    if (charts['chart-otros-donut']) { try { charts['chart-otros-donut'].destroy(); } catch {} }
    charts['chart-otros-donut'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: segments.map(s => s.label),
        datasets: [{ data: segments.map(s => s.value), backgroundColor: segments.map(s => s.color), borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor:'#13161e', borderColor:'#252a38', borderWidth:1,
            titleColor:'#8b92a8', bodyColor:'#e8eaf2',
            callbacks: { label: c => ` ${c.label}: ${FinanceMath.eur(c.parsed)} (${(c.parsed/(total||1)*100).toFixed(1)}%)` }
          }
        }
      }
    });

    if (legend) legend.innerHTML = segments.map(s => `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <span style="display:flex;align-items:center;gap:5px">
          <span style="width:10px;height:10px;border-radius:2px;background:${s.color};display:inline-block;flex-shrink:0"></span>
          <span style="color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px" title="${s.label}">${s.label}</span>
        </span>
        <span style="font-family:var(--font-mono);white-space:nowrap">${FinanceMath.eur(s.value)}<span style="color:var(--text3);margin-left:4px">${(s.value/total*100).toFixed(1)}%</span></span>
      </div>`).join('');
  }

  function renderChartSaldosDonut(cuentasActivas) {
    const ctx = document.getElementById('chart-saldos-donut'); if (!ctx) return;
    const _SALDO_PALETTE = ['#00e5a0','#4d9fff','#a855f7','#f97316','#eab308','#22d3ee','#fb7185','#34d399','#60a5fa','#c084fc'];
    const segments = cuentasActivas
      .map((a, i) => ({ label: a.nombre, value: Math.max(0, FinanceMath.saldoRealCuenta(a)), color: _SALDO_PALETTE[i % _SALDO_PALETTE.length] }))
      .filter(s => s.value > 0.01);
    if (!segments.length) return;
    const total = segments.reduce((s, x) => s + x.value, 0);
    if (charts['chart-saldos-donut']) { try { charts['chart-saldos-donut'].destroy(); } catch {} }
    charts['chart-saldos-donut'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: segments.map(s => s.label),
        datasets: [{ data: segments.map(s => s.value), backgroundColor: segments.map(s => s.color), borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor:'#13161e', borderColor:'#252a38', borderWidth:1,
            titleColor:'#8b92a8', bodyColor:'#e8eaf2',
            callbacks: { label: c => ` ${c.label}: ${FinanceMath.eur(c.parsed)} (${(c.parsed/(total||1)*100).toFixed(1)}%)` }
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
      fechaReferencia: document.getElementById('cfg-ref')?.value || existing.fechaReferencia || new Date().toISOString().slice(0,10),
      showHistorico:   document.getElementById('cfg-show-hist')?.checked??true,
      showMC:          document.getElementById('cfg-show-mc')?.checked??false,
    };
    State.set('config',config); render();
  }
  function applyPreset(preset) { PeriodBar.applyPreset(preset); }
  function setVentana(v) { ventana=v; render(); }
  function setChartMode(m) { chartMode=m; render(); }
  function setTagGroupsMode(m) { tagGroupsMode=m; render(); }
  function toggleTagGrupo(tag) {
    const cfg = State.get('config');
    const grupos = [...(cfg.tagGrupos || [])];
    const idx = grupos.indexOf(tag);
    if (idx >= 0) grupos.splice(idx, 1); else grupos.push(tag);
    State.set('config', { ...cfg, tagGrupos: grupos });
    render();
  }
  function toggleGruposPanel() {
    const panel = document.getElementById('dash-grupos-panel');
    if (panel) panel.style.display = panel.style.display === 'none' ? '' : 'none';
  }
  function toggleTag(t) {
    if(activeTags.has(t))activeTags.delete(t); else activeTags.add(t);
    State.set('config', {...State.get('config'), activeTagsFilter: [...activeTags]});
    render();
  }
  function toggleTagCategoria(tag) {
    const cfg = State.get('config');
    const cats = [...(cfg.tagCategorias || [])];
    const idx = cats.indexOf(tag);
    if (idx >= 0) cats.splice(idx, 1); else cats.push(tag);
    State.set('config', { ...cfg, tagCategorias: cats });
    render();
  }
  function toggleAccFilter(id) { if(filtroAccounts.includes(id)) filtroAccounts=filtroAccounts.filter(a=>a!==id); else filtroAccounts.push(id); render(); }
  function clearAccFilter() { filtroAccounts=[]; render(); }
  function toggleCriticos() {
    const cfg = State.get('config');
    State.set('config', {...cfg, showCriticos: !(cfg.showCriticos !== false)});
    render();
  }

  function setSaludView(v) { saludView=v; render(); }
  function toggleSaludConfig() {
    const p=document.getElementById('salud-config-panel');
    if(p) p.style.display=p.style.display==='none'?'':'none';
  }
  function applySaludConfig() {
    const cfg=State.get('config');
    State.set('config',{...cfg,
      saludUmbralAhorroVerde:   parseFloat(document.getElementById('salud-ahorro-verde')?.value)||20,
      saludUmbralAhorroAmarillo:parseFloat(document.getElementById('salud-ahorro-rojo')?.value)||10,
      saludUmbralDTIVerde:      parseFloat(document.getElementById('salud-dti-verde')?.value)||30,
      saludUmbralDTIAmarillo:   parseFloat(document.getElementById('salud-dti-rojo')?.value)||40,
      saludRegla:[
        parseFloat(document.getElementById('salud-regla-0')?.value)||50,
        parseFloat(document.getElementById('salud-regla-1')?.value)||30,
        parseFloat(document.getElementById('salud-regla-2')?.value)||20,
      ],
      saludExcluirHipoteca: document.getElementById('salud-excl-hipoteca')?.checked||false,
      saludTagHipoteca: document.getElementById('salud-tag-hipoteca')?.value||'hipoteca',
    });
    render();
  }
  function resetSaludConfig() {
    const cfg=State.get('config');
    State.set('config',{...cfg,
      saludUmbralAhorroVerde:20, saludUmbralAhorroAmarillo:10,
      saludUmbralDTIVerde:30, saludUmbralDTIAmarillo:40,
      saludRegla:[50,30,20], saludExcluirHipoteca:false, saludTagHipoteca:'hipoteca',
    });
    render();
  }

  return { render, applyConfig, applyPreset, setVentana, setChartMode, setTagGroupsMode, toggleTag, toggleTagGrupo, toggleGruposPanel, toggleTagCategoria, toggleAccFilter, clearAccFilter, toggleExecSummary, toggleCriticos, toggleConfig, toggleAnalisis, setSaludView, toggleSaludConfig, applySaludConfig, resetSaludConfig };
})();
