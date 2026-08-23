// Depends on: State, FinanceMath, UI
const DashboardModule = (() => {
  let charts={}, activeTags=new Set(), filtroAccounts=[], chartMode='summed', tagGroupsMode='desglosado', ventanaVelas='mes';
  // Stable color palette for promoted tags (index 0 reserved for base categories)
  const _TAG_PROMO_PALETTE = ['#f97316','#eab308','#22d3ee','#a78bfa','#34d399','#fb7185','#60a5fa','#c084fc','#4ade80','#f472b6'];
  // colchon + historial toggles driven from config, no local state needed

  // Fecha civil (YYYY-MM-DD) de un Date LOCAL. Ver la nota larga en
  // finance-math.js: toISOString() convierte a UTC y corre las fechas un día
  // atrás en husos con desfase positivo, que es el nuestro.
  function _fechaLocal(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function destroyCharts() { Object.values(charts).forEach(c=>{try{c.destroy();}catch{}}); charts={}; }

  /**
   * Modo de interacción "porFecha".
   *
   * El modo 'index' de Chart.js empareja las series por POSICIÓN EN EL ARRAY, no
   * por su valor en el eje. Con series de distinta densidad —el histórico real
   * tiene un puñado de puntos y el extracto proyectado cientos— el tooltip
   * cruzaba el punto n-ésimo de una con el n-ésimo de la otra, que caen en
   * fechas completamente distintas: al señalar julio, el histórico mostraba un
   * saldo de abril. Comparar real contra estimado así no significa nada.
   *
   * Este modo busca, en cada serie, el punto más cercano EN FECHA al cursor, y
   * lo descarta si se aleja más de `TOLERANCIA_PX`. Así una serie que no llega a
   * esa fecha simplemente no aparece en el tooltip, en vez de aportar un dato
   * de otro día.
   */
  const TOLERANCIA_PX = 24;
  function _registrarModoPorFecha() {
    const I = window.Chart?.Interaction?.modes;
    if (!I || I.porFecha) return;
    I.porFecha = (chart, e, options, useFinalPosition) => {
      const pos = window.Chart.helpers.getRelativePosition(e, chart);
      const items = [];
      for (let di = 0; di < chart.data.datasets.length; di++) {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden || !meta.visible) continue;
        let mejor = null, mejorDist = Infinity;
        for (let i = 0; i < meta.data.length; i++) {
          const el = meta.data[i];
          if (!el || el.skip) continue;
          const { x } = el.getProps(['x'], useFinalPosition);
          const dist = Math.abs(x - pos.x);
          if (dist < mejorDist) { mejorDist = dist; mejor = { element: el, datasetIndex: di, index: i }; }
        }
        if (mejor && mejorDist <= TOLERANCIA_PX) items.push(mejor);
      }
      return items;
    };
  }

  // Las seis gráficas se pintan en un temporizador diferido (hay que esperar a
  // que el navegador dé tamaño a los <canvas> recién insertados). Guardamos el
  // handle: si llega otro render antes de que dispare, el anterior se cancela.
  // Si no, dos renders seguidos encolan dos temporizadores y el destroyCharts()
  // del segundo se cuela entre los `new Chart()` del primero, dejando instancias
  // huérfanas que ya nadie destruye y gráficas que no cuadran con el DOM.
  let _chartTimer = null;
  /** Momento del último repintado completo, para poder mostrarlo. */
  let _ultimaActualizacion = null;


  // Salir del escenario activo. Vivía en EscenariosModule, que ya está portado
  // a src/features/scenarios; el dashboard es la última vista legacy y toca su
  // propia config directamente hasta que también se porte (1.7).
  /**
   * Refresco manual del cuadro de mando.
   *
   * Hace falta porque el dashboard solo se repinta al navegar hasta él: los
   * datos se editan en otras vistas (préstamos, gastos, cuentas…) y esas vistas
   * recargan el State pero no re-renderizan esta. Además el navegador puede
   * dejar la pestaña horas abierta, y entonces "hoy" ya no es hoy.
   *
   * Relee el State del almacenamiento antes de pintar: si el cambio lo escribió
   * el paquete nuevo, la copia en memoria del legacy puede estar atrasada.
   */
  function actualizar() {
    const btn = document.querySelector('[data-dash-actualizar]');
    if (btn) { btn.disabled = true; btn.classList.add('is-loading'); }
    try {
      State.load();
    } catch (e) {
      console.error('[Dashboard] No se ha podido releer el estado:', e);
    }
    try {
      render();
      UI?.toast?.('Cuadro de mando actualizado');
    } catch (e) {
      console.error('[Dashboard] Fallo al actualizar:', e);
      UI?.toast?.('No se ha podido actualizar el cuadro de mando', 'err');
      if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); }
    }
  }

  /** Escribe la hora del último repintado bajo el botón de actualizar. */
  function _pintarSelloActualizacion() {
    const sello = document.querySelector('[data-dash-sello]');
    if (!sello || !_ultimaActualizacion) return;
    sello.textContent = 'Actualizado ' + _ultimaActualizacion.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  function setVentanaVelas(v) { ventanaVelas = v; render(); }

  /**
   * Borra todo lo marcado como simulación. Toca datos del usuario, así que
   * confirma primero y dice exactamente qué va a borrar.
   *
   * Las amortizaciones del optimizador entran aquí: hasta ahora solo se podían
   * quitar volviendo a abrir el optimizador y recalculando, cosa que nadie
   * adivina.
   */
  function limpiarSimulaciones() {
    const loans = State.get('loans') || [];
    const expenses = State.get('expenses') || [];
    const accounts = State.get('accounts') || [];

    const nLoans  = loans.filter(l => l.simulacion).length;
    const nAmorts = loans.reduce((s,l) => s + (l.amortizaciones||[]).filter(a => a.simulacion).length, 0);
    const nExp    = expenses.filter(e => e.simulacion).length;
    const nAcc    = accounts.filter(a => a.simulacion).length;
    const total   = nLoans + nAmorts + nExp + nAcc;
    if (total === 0) { UI.toast('No hay nada simulado que quitar'); return; }

    const detalle = [
      nLoans  ? `${nLoans} préstamo${nLoans!==1?'s':''}` : '',
      nAmorts ? `${nAmorts} amortización${nAmorts!==1?'es':''}` : '',
      nExp    ? `${nExp} gasto${nExp!==1?'s':''}` : '',
      nAcc    ? `${nAcc} cuenta${nAcc!==1?'s':''}` : '',
    ].filter(Boolean).join(', ');

    if (!window.confirm(`Se va a borrar todo lo marcado como simulación:\n\n${detalle}\n\nEsto no se puede deshacer. ¿Continuar?`)) return;

    State.set('loans', loans
      .filter(l => !l.simulacion)
      .map(l => ({ ...l, amortizaciones: (l.amortizaciones||[]).filter(a => !a.simulacion) })));
    State.set('expenses', expenses.filter(e => !e.simulacion));
    State.set('accounts', accounts.filter(a => !a.simulacion));

    UI.toast(`Simulaciones eliminadas: ${detalle}`);
    render();
  }

  function salirEscenario() {
    const cfg = State.get('config');
    State.set('config', { ...cfg, escenarioActivo: null });
    UI.toast('Volviendo a la realidad base');
    render();
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
    if (_chartTimer !== null) { clearTimeout(_chartTimer); _chartTimer = null; }
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

    const usarInflacion = config.usarInflacion||false;
    const inflPeriodos  = State.get('inflacion') || [];
    const extracto=FinanceMath.generarExtracto(loans,expenses,accountsForExtracto,config, filtroAccounts.length>0?filtroAccounts:null, nominas, inflPeriodos);

    // ── Línea canónica ────────────────────────────────────────────────────────
    // Además del extracto de arriba —que incluye TODO, también lo marcado como
    // simulación— se proyecta una segunda versión sin nada simulado. La curva
    // pinta las dos: así una amortización que el optimizador dejó puesta hace
    // semanas se ve como lo que es, en vez de aparecer como un gasto grande
    // imposible de encontrar en la lista de gastos.
    //
    // Solo se calcula si de verdad hay algo simulado; si no, las dos líneas
    // serían idénticas y sobraría el doble de trabajo.
    // `core` es plano: src/core/index.ts reexporta todo sin sub-namespaces.
    const _scn = window.FinanceApp?.core;
    const _entradaSim = { loans, expenses, nominas, accounts: accountsForExtracto };
    const haySimulaciones = !!_scn?.haySimulaciones?.(_entradaSim);
    let extractoCanonico = null;
    if (haySimulaciones && _scn?.sinSimulaciones) {
      try {
        const c = _scn.sinSimulaciones(_entradaSim);
        extractoCanonico = FinanceMath.generarExtracto(
          c.loans, c.expenses, c.accounts, config,
          filtroAccounts.length>0?filtroAccounts:null, c.nominas, inflPeriodos,
        );
      } catch (e) {
        console.error('[Dashboard] No se ha podido proyectar la línea canónica:', e);
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
    const hoyStr        = _fechaLocal(new Date());
    const mesActualLabel = hoyStr.slice(0,7);
    const mesIni = mesActualLabel + '-01';
    const mesFin = _fechaLocal(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0));

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
    // clasificacion: 'necesidad'|undefined = necesidad (default); 'deseo' = deseo; null = excluido
    const _clas = ex => ex?.clasificacion;
    const gastosBasicosMesActual = evsMesActual.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const c=_clas(expenses.find(ex=>ex._id===e.sourceId));return c!=='deseo'&&c!==null;}).reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const gastosOtrosMesActual   = evsMesActual.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const c=_clas(expenses.find(ex=>ex._id===e.sourceId));return c==='deseo';}).reduce((s,e)=>s+Math.abs(e.cuantia),0);
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
    const gastosBasicosMediaMes = evSinTransf.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const c=_clas(expenses.find(ex=>ex._id===e.sourceId));return c!=='deseo'&&c!==null;}).reduce((s,e)=>s+Math.abs(e.cuantia),0) / numMeses;
    const gastosDeseoMediaMes   = evSinTransf.filter(e=>e.tipo==='gasto'&&e.sourceType==='expense').filter(e=>{const c=_clas(expenses.find(ex=>ex._id===e.sourceId));return c==='deseo';}).reduce((s,e)=>s+Math.abs(e.cuantia),0) / numMeses;

    // ── Salud financiera — métricas para mes actual y media ──────────────────────
    const _hipotecaIds = new Set(loans.filter(l => (l.tags||[]).includes(config.saludTagHipoteca||'hipoteca')).map(l => l._id));
    const amortizacionesMesActual = evsMesActual.filter(e=>e.sourceType==='loan-amort').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const cuotasHipotecaMesActual = evsMesActual.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto'&&_hipotecaIds.has(e.sourceId)).reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const cuotasHipotecaMedia = evSinTransf.filter(e=>e.sourceType==='loan'&&e.tipo==='gasto'&&_hipotecaIds.has(e.sourceId)).reduce((s,e)=>s+Math.abs(e.cuantia),0)/numMeses;

    const _metSaludMes = { ingresos:ingresosMesActual, cuotas:cuotasMesActual, cuotasHipoteca:cuotasHipotecaMesActual, gastosBasicos:gastosBasicosMesActual, gastosOtros:gastosOtrosMesActual, amortizaciones:amortizacionesMesActual };
    const saludMes   = FinanceMath.calcSaludFinanciera(_metSaludMes, config);

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
      const fin = _fechaLocal(new Date(parseInt(mes.slice(0,4)), parseInt(mes.slice(5,7)), 0));
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
        <div class="page-actions" style="display:flex;align-items:center;gap:10px">
          <span class="text-sm" data-dash-sello style="color:var(--text3);font-size:11px"></span>
          <button class="btn-secondary btn-sm" data-dash-actualizar onclick="DashboardModule.actualizar()" title="Volver a calcular con los datos actuales">&#8635; Actualizar</button>
        </div>
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
          <button class="btn-secondary btn-sm" onclick="DashboardModule.salirEscenario()">✕ Salir</button>
        </div>`;
      })() : ''}

      <!-- Hero KPIs -->
      <div class="dash-hero mb-14">
        <div class="dash-hero-item">
          <div class="dash-hero-label">Saldo actual</div>
          <div class="dash-hero-val ${saldoHoy>=0?'pos':'neg'}">${FinanceMath.eur(saldoHoy)}</div>
          <div class="dash-hero-sub">${_fechaLocal(new Date())}</div>
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
        const hoyD = _fechaLocal(new Date());
        const en7D  = _fechaLocal(new Date(Date.now()+7*86400000));
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
            <input class="form-input" type="date" id="cfg-ref" value="${config.fechaReferencia||_fechaLocal(new Date())}"/>
            <div class="text-sm mt-4" style="color:var(--text3)">Saldo conocido en esta fecha</div>
          </div>
        </div>
        <div class="mt-8">
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" id="cfg-show-hist" ${config.showHistorico?'checked':''}/><span class="toggle-slider"></span></label>
            Mostrar histórico real en gráfica
          </label>
          <div class="text-sm mt-6" data-feature="margenes" style="color:var(--text3)">Los márgenes de seguridad se configuran en <a href="#" onclick="Router.navigate('margenes');return false" style="color:var(--accent)">Márgenes de seguridad</a>.</div>
        </div>
        <div class="flex gap-8 mt-8 items-center flex-wrap">
          <span class="text-sm">Filtrar cuentas:</span>
          ${accPills}
          <button class="btn-secondary btn-sm" onclick="DashboardModule.clearAccFilter()">Todas</button>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;row-gap:6px">
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
      <div class="flex justify-between items-center mb-8" data-feature="resumen-ejecutivo">
        <div class="card-title" style="margin:0">Resumen ejecutivo</div>
        <button class="btn-secondary btn-sm" onclick="DashboardModule.toggleExecSummary()">${config.showExecSummary!==false?'Ocultar':'Mostrar'}</button>
      </div>
      ${config.showExecSummary!==false?`<div class="exec-summary mb-14" data-feature="resumen-ejecutivo">
        <div class="exec-item">
          <div class="exec-item-label">Saldo hoy</div>
          <div class="exec-item-val ${saldoHoy>=0?'pos':'neg'}">${FinanceMath.eur(saldoHoy)}</div>
        </div>
        <div class="exec-item">
          <div class="exec-item-label">Salud financiera</div>
          ${(()=>{
            const s=saludMes;
            const sc={'verde':'#2ee6a8','amarillo':'#ffb020','rojo':'#ff6b6b','neutral':'var(--text3)'};
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
            <div class="stat-sub" style="margin-top:4px">${_fechaLocal(new Date())} · ${cuentasActivas.length} cuenta${cuentasActivas.length!==1?'s':''}</div>
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
          const today = _fechaLocal(new Date());
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
        // El saldo de un objetivo lo calcula el paquete nuevo (core/goals); esta
        // tarjeta desaparece si el bundle no está disponible en vez de inventarse
        // cifras. El resto del dashboard sigue funcionando.
        const _core = window.FinanceApp?.core;
        if (!_core?.saldoParaObjetivo) return '';
        const colchonHoy = FinanceMath.calcColchonEnFecha(expenses, config, loans, _fechaLocal(new Date()));
        const goalsActivos = goals.filter(g=>!g.completado).slice().sort((a,b)=>(a.prioridad||99)-(b.prioridad||99)).slice(0,3);
        if (!goalsActivos.length) return '';
        return `<div class="card mb-14" style="padding:12px">
          <div class="card-title" style="margin-bottom:8px">🎯 Objetivos de ahorro</div>
          ${goalsActivos.map(g=>{
            const saldo = _core.saldoParaObjetivo(g, accounts, colchonHoy);
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
              <div style="display:flex;justify-content:space-between;align-items:center;background:var(--accent-dim);border:1px solid rgba(46,230,168,0.2);border-radius:var(--radius);padding:8px 12px;flex-wrap:wrap;gap:6px">
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
            const deseosMed      = Math.max(0, gastosDeseoMediaMes - totalTagPromoMediaMes);
            const ahorroMed      = Math.max(0, ingresosMediaMes - cuotasMediaMes - gastosBasicosMediaMes - gastosDeseoMediaMes - amortizacionesMediaMes);
            const totalRef       = ingresosMediaMes > 0 ? ingresosMediaMes : (cuotasMediaMes + gastosBasicosMediaMes + gastosDeseoMediaMes + amortizacionesMediaMes + 0.01);
            const pctBasicos = (gastosBasicosMediaMes / totalRef * 100).toFixed(1);
            const pctOtros   = (deseosMed / totalRef * 100).toFixed(1);
            const pctDeuda   = ((cuotasMediaMes + amortizacionesMediaMes) / totalRef * 100).toFixed(1);
            const pctAhorro  = (ahorroMed / totalRef * 100).toFixed(1);
            const ahorroColor = ahorroMed > 0 ? 'var(--accent)' : 'var(--text3)';
            const legendRow = (color, label, amount, pct) =>
              `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px">
                <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:${color};display:inline-block"></span><span style="color:var(--text2)">${label}</span></span>
                <span style="font-family:var(--font-mono)">${FinanceMath.eur(amount)}<span style="color:var(--text3);margin-left:4px">${pct}%</span></span>
              </div>`;
            return `
            <div class="chart-expense-donut-wrap">
              <div class="donut-canvas"><canvas id="chart-expense-donut"></canvas></div>
              <div style="flex:1;min-width:130px;display:flex;flex-direction:column;gap:7px">
                ${legendRow('#4d9fff','Necesidades',gastosBasicosMediaMes,pctBasicos)}
                ${tagCategorias.map((t,i)=>{
                  const v=_tagPromoMediaMes[t]||0; if(v<0.01)return '';
                  const c=_TAG_PROMO_PALETTE[i%_TAG_PROMO_PALETTE.length];
                  return legendRow(c,t,v,(v/totalRef*100).toFixed(1));
                }).join('')}
                ${deseosMed > 0.01 ? legendRow('#ffb020','Deseos',deseosMed,pctOtros) : ''}
                ${legendRow('#a855f7','Deuda',cuotasMediaMes + amortizacionesMediaMes,pctDeuda)}
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;border-top:1px solid var(--border);padding-top:6px">
                  <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#2ee6a8;display:inline-block"></span><span style="color:var(--text2)">Ahorro est.</span></span>
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
          <div id="dash-otros-donut-wrap" class="chart-expense-donut-wrap">
            <div class="donut-canvas"><canvas id="chart-otros-donut"></canvas></div>
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
            const _SALDO_PALETTE = ['#2ee6a8','#4d9fff','#a855f7','#f97316','#eab308','#22d3ee','#fb7185','#34d399','#60a5fa','#c084fc'];
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
            <div class="chart-expense-donut-wrap">
              <div class="donut-canvas"><canvas id="chart-saldos-donut"></canvas></div>
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

      ${haySimulaciones ? (()=>{
        // Inventario de lo que está alterando la proyección. Sin esto, una
        // amortización que dejó el optimizador es un gasto grande que no
        // aparece en ninguna lista y no hay forma de dar con él.
        const sims = [];
        for (const l of loans) {
          if (l.simulacion) sims.push(`préstamo «${l.nombre}»`);
          const na = (l.amortizaciones||[]).filter(a => a.simulacion).length;
          if (na) sims.push(`${na} amortización${na!==1?'es':''} simulada${na!==1?'s':''} en «${l.nombre}»`);
        }
        for (const e of expenses) if (e.simulacion) sims.push(`gasto «${e.concepto||e._id}»`);
        for (const a of accountsForExtracto) if (a.simulacion) sims.push(`cuenta «${a.nombre}»`);
        return `<div class="card mb-14" style="padding:11px 16px;background:rgba(255,209,102,0.06);border:1px solid rgba(255,209,102,0.28);display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-size:15px">🧪</span>
          <div style="flex:1;min-width:220px;font-size:12px;line-height:1.6">
            <strong style="color:var(--yellow)">Hay simulaciones activas</strong>
            <span style="color:var(--text2)"> — la línea gruesa las incluye; la discontinua atenuada es tu saldo sin ellas.</span>
            <div style="color:var(--text3);margin-top:3px">${sims.join(' · ')}</div>
          </div>
          <button class="btn-secondary btn-sm" onclick="DashboardModule.limpiarSimulaciones()">Quitar simulaciones</button>
        </div>`;
      })() : ''}

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
            ${alertas.length>0?`<button class="btn-secondary btn-sm" data-feature="puntos-criticos" style="font-size:11px;color:${config.showCriticos!==false?'var(--yellow)':'var(--text3)'}" onclick="DashboardModule.toggleCriticos()">
              ⚠️ ${alertas.length} punto${alertas.length>1?'s':''} crítico${alertas.length>1?'s':''} ${config.showCriticos!==false?'(visible)':'(oculto)'}
            </button>`:''}
          </div>
        </div>
        <div class="chart-wrap-lg"><canvas id="chart-saldo"></canvas></div>
      </div>

      <!-- Velas del saldo (mensual / anual) -->
      <div class="card mb-14" data-feature="velas-saldo">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <div class="card-title" style="margin:0">Velas del saldo</div>
          <div class="period-selector">
            <button class="period-btn ${ventanaVelas==='mes'?'active':''}" onclick="DashboardModule.setVentanaVelas('mes')">Mensual</button>
            <button class="period-btn ${ventanaVelas==='anio'?'active':''}" onclick="DashboardModule.setVentanaVelas('anio')">Anual</button>
          </div>
        </div>
        <div class="chart-wrap-lg"><canvas id="chart-velas"></canvas></div>
        <div class="text-sm" style="color:var(--text3);margin-top:6px">
          Cada vela abre donde cerró la anterior. El cuerpo va de apertura a cierre —verde si el saldo sube, rojo si baja— y la mecha marca el máximo y el mínimo del periodo.
        </div>
      </div>

      <!-- ── Análisis avanzado (colapsable) ─────────────────────────────────── -->
      <div class="card mb-14" style="padding:12px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="DashboardModule.toggleAnalisis()">
          <span class="card-title" style="margin:0">Análisis avanzado</span>
          <button class="btn-secondary btn-sm" style="pointer-events:none">${config.analisisCollapsed?'▸ Mostrar':'▾ Ocultar'}</button>
        </div>
      </div>
      ${config.analisisCollapsed ? '' : `

      <!-- Charts row 2 -->
      <div class="grid-2 mb-14">
        <div class="card">
          <div class="card-title">Ingresos vs Gastos por categoría (mensual)</div>
          <div class="chart-wrap-lg"><canvas id="chart-breakdown-mensual"></canvas></div>
        </div>
        <div class="card" data-feature="graficos-etiquetas">
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
        <div class="card" data-feature="graficos-etiquetas">
          <div class="card-title">Media mensual de gastos por etiqueta <span style="font-size:11px;color:var(--text3);font-weight:400">(${tagGroupsMode==='porgrupos'?'por grupos':'desglosado'})</span></div>
          <div class="chart-wrap"><canvas id="chart-media-mensual"></canvas></div>
        </div>
      </div>


      `}
`;

    // Pass computed metrics to chart functions
    const _metricasGraficos = { loans, expenses, config, numMeses, extracto, tagCategorias };
    const _donutMetrics = { gastosBasicosMediaMes, gastosDeseoMediaMes, gastosMediaMes, cuotasMediaMes, ingresosMediaMes, amortizacionesMediaMes, tagPromoMediaMes: _tagPromoMediaMes };
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
    _chartTimer = setTimeout(()=>{
      _chartTimer = null;
      _registrarModoPorFecha();
      // Cada gráfica va aislada: un fallo en una no puede dejar sin pintar a las
      // que vienen detrás, que es justo lo que pasó con `_tagMapConGrupos`.
      const _graficas = [
        ['saldo',      () => renderChartSaldo(extracto, extractoCanonico)],
        ['tags',       () => renderChartTags(extracto, activeTags, grupoTags, tagGroupsMode)],
        ['breakdown',  () => renderChartBreakdown(_metricasGraficos)],
        ['gastos',     () => renderChartExpenseDonut(_donutMetrics)],
        ['otros',      () => renderChartOtrosDonut(_otrosTagData)],
        ['saldos',     () => renderChartSaldosDonut(accounts.filter(a => a.activo && !a.simulacion))],
        ['velas',      () => renderChartVelas(extracto)],
      ];
      for (const [nombre, pintar] of _graficas) {
        try { pintar(); }
        catch (e) { console.error(`[Dashboard] La gráfica "${nombre}" no se ha podido pintar:`, e); }
      }
      _ultimaActualizacion = new Date();
      _pintarSelloActualizacion();
    }, 60);
  }

  function renderChartSaldo(extracto, extractoCanonico) {
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
    const ACC_COLORS = ['#2ee6a8','#a855f7','#fb923c','#f472b6','#60a5fa','#34d399','#facc15','#f87171','#e879f9','#22d3ee'];
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
      // Mismo predicado que el extracto (activa + filtrada). Sin el `activo` se
      // colaban cuentas cerradas en la serie real y no cuadraba con la estimada.
      const visibles = accounts.filter(a =>
        a.activo && (filtroAccounts.length === 0 || filtroAccounts.includes(a._id))
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
          backgroundColor: '#ffb020',
          borderColor: '#ffb020',
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

    // Per-account running saldo for margen crossing detection
    const margenesSeguridad = (config.margenesSeguridad || []).filter(m => m.activo !== false);
    const saldosPorCuenta = FinanceMath.saldosPorCuentaEnExtracto(extracto, accounts);

    // Margen threshold lines — one per active margen
    const MARGEN_COLORS = ['rgba(251,146,60,0.8)','rgba(244,114,182,0.8)','rgba(167,139,250,0.8)','rgba(52,211,153,0.8)','rgba(96,165,250,0.8)','rgba(250,204,21,0.8)'];
    const margenDatasets = margenesSeguridad.map((mg, idx) => {
      const color = MARGEN_COLORS[idx % MARGEN_COLORS.length];
      const data = saldoXY.map(({x}) => ({ x, y: FinanceMath.calcMargenEnFecha(mg, expenses, config, loans, _fechaLocal(new Date(x))) }));
      const valorHoy = FinanceMath.calcMargenEnFecha(mg, expenses, config, loans, _fechaLocal(new Date()));
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
                    alerta.tipo==='bajo_margen'     ? 'rgba(251,146,60,0.6)' : 'rgba(46,230,168,0.4)';
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
      ...(isStacked
        ? stackedDatasets
        : chartMode === 'lines'
          ? linesDatasets
          : [{ label:'Saldo estimado', data:saldoXY, borderColor:'#2ee6a8', backgroundColor:'rgba(46,230,168,0.07)',
               fill:true, tension:0.3, pointRadius:0, borderWidth:2, pointHitRadius:20, order:5 }]
      ),
    ];
    if (histDataset) datasets.push(histDataset);

    // Línea canónica: el saldo SIN nada de lo marcado como simulación. Va
    // atenuada y por detrás, como referencia contra la que comparar; la línea
    // gruesa sigue siendo la que incluye las simulaciones, que es la que
    // responde a "¿qué pasa si mantengo esto?".
    if (extractoCanonico && extractoCanonico.length > 0) {
      datasets.push({
        label: 'Saldo canónico (sin simulaciones)',
        data: extractoCanonico.map(e => ({ x: new Date(e.fecha+'T00:00:00').getTime(), y: e.saldoAcum })),
        borderColor: 'rgba(46,230,168,0.32)',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [5,4],
        pointRadius: 0,
        pointHitRadius: 20,
        fill: false,
        tension: 0.3,
        order: 7,
      });
    }

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
        const fechaSim = _fechaLocal(_db);
        const ts = _db.getTime();
        // Calcular fondos bloqueados en esa fecha simulando el estado del fondo
        let totalBloq = 0;
        for (const acc of pensionesActivas) {
          const bloqueo = acc.bloqueoMeses || 120;
          const fechaLim = _fechaLocal(new Date(_db.getFullYear(), _db.getMonth() - bloqueo, _db.getDate()));
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
          borderColor: 'rgba(46,230,168,0.85)',
          backgroundColor: ['transparent', 'rgba(46,230,168,0.9)'],
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
        interaction: { mode: 'porFecha', intersect: false },
        plugins: {
          legend: {
            display: isStacked || (histDataset != null) || margenDatasets.length>0 || criticoDatasets.length>0 || (extractoCanonico != null) || datasets.some(d=>d.label?.startsWith('🏁')),
            labels: { color:'#a9b6cc', font:{size:11}, boxWidth:12, filter: i => !['MC p25','MC p10','MC p75','MC p90'].includes(i.text) }
          },
          tooltip: {
            backgroundColor: '#111a28', borderColor: 'rgba(255,255,255,0.12)', borderWidth: 1,
            titleColor: '#a9b6cc', bodyColor: '#eef3fb',
            filter: item => item.dataset.label !== 'MC p25' && item.dataset.label !== 'MC p10' && item.dataset.label !== 'MC p75' && item.dataset.label !== 'MC p90',
            callbacks: {
              title: items => {
                const d = new Date(items[0].parsed.x);
                return d.toLocaleDateString('es-ES', { year:'numeric', month:'short', day:'numeric' });
              },
              // Cada serie aporta su punto más cercano en fecha, y no tienen por
              // qué caer todas en el mismo día: el histórico real se anota
              // cuando se anota. Si el punto es de otro día se dice, en vez de
              // dejar que parezca del día del título.
              afterLabel: ctx => {
                const dia = t => new Date(t).toLocaleDateString('es-ES', { year:'numeric', month:'short', day:'numeric' });
                const propio = dia(ctx.parsed.x);
                const titulo = dia(ctx.chart.tooltip?.dataPoints?.[0]?.parsed.x ?? ctx.parsed.x);
                return propio === titulo ? '' : `   ↳ dato del ${propio}`;
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
            ticks: { color: '#6b7b96', maxTicksLimit: 10 },
            grid: { color: 'rgba(255,255,255,0.07)' }
          },
          y: {
            ticks: { color: '#6b7b96', callback: v => FinanceMath.eur(v) },
            grid: { color: ctx => ctx.tick.value === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)' }
          }
        }
      }
    });
  }

  /**
   * Velas del saldo por mes o por año.
   *
   * Se dibuja con barras flotantes de Chart.js (`[min, max]`), no con el plugin
   * `chartjs-chart-financial` que traía la versión retirada en 8f64dfb: aquello
   * era una dependencia más de CDN, y ya sabemos lo que pasa cuando un recurso
   * externo no llega. Dos datasets superpuestos: la mecha (mínimo→máximo, fina)
   * y el cuerpo (apertura→cierre, grueso), coloreados según suba o baje.
   */
  function renderChartVelas(extracto) {
    const ctx = document.getElementById('chart-velas'); if (!ctx) return;
    const dash = window.FinanceApp?.engine?.dashboard;
    if (!dash?.agruparOHLC) {
      ctx.parentElement.innerHTML = '<div class="text-sm" style="text-align:center;padding:40px;color:var(--text3)">Las velas las calcula el módulo principal, que no se ha cargado.</div>';
      return;
    }
    const velas = dash.agruparOHLC(extracto, ventanaVelas);
    if (velas.length === 0) {
      ctx.parentElement.innerHTML = '<div class="text-sm" style="text-align:center;padding:40px;color:var(--text3)">Sin movimientos en el período seleccionado.</div>';
      return;
    }

    const sube = v => v.cierre >= v.apertura;
    const VERDE = '#2ee6a8', ROJO = '#ff6b6b';
    const etiquetas = velas.map(v => v.periodo);

    charts.velas = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Recorrido',
            // La mecha: del mínimo al máximo del periodo.
            data: velas.map(v => [v.minimo, v.maximo]),
            backgroundColor: velas.map(v => (sube(v) ? VERDE : ROJO) + '55'),
            barPercentage: 0.12,
            categoryPercentage: 0.9,
            order: 2,
          },
          {
            label: 'Apertura → cierre',
            // El cuerpo. Un periodo plano quedaría invisible como barra de
            // altura cero, así que se le da un grosor mínimo visible.
            data: velas.map(v => {
              const a = v.apertura, c = v.cierre;
              if (Math.abs(c - a) > 0.005) return [Math.min(a, c), Math.max(a, c)];
              const eps = Math.max(1, Math.abs(a) * 0.001);
              return [a - eps, a + eps];
            }),
            backgroundColor: velas.map(v => sube(v) ? VERDE : ROJO),
            barPercentage: 0.6,
            categoryPercentage: 0.9,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111a28', borderColor: 'rgba(255,255,255,0.12)', borderWidth: 1,
            titleColor: '#a9b6cc', bodyColor: '#eef3fb',
            // Un tooltip por vela, no uno por dataset: los dos datasets son la
            // misma vela partida en cuerpo y mecha.
            filter: item => item.datasetIndex === 0,
            callbacks: {
              title: items => items[0].label,
              label: item => {
                const v = velas[item.dataIndex];
                const signo = v.cierre - v.apertura;
                return [
                  ` Apertura: ${FinanceMath.eur(v.apertura)}`,
                  ` Cierre:   ${FinanceMath.eur(v.cierre)}`,
                  ` Máximo:   ${FinanceMath.eur(v.maximo)}`,
                  ` Mínimo:   ${FinanceMath.eur(v.minimo)}`,
                  ` Variación: ${signo >= 0 ? '+' : ''}${FinanceMath.eur(signo)}`,
                  ` ${v.eventos} movimiento${v.eventos !== 1 ? 's' : ''}`,
                ];
              },
            },
          },
        },
        scales: {
          x: { ticks: { color: '#6b7b96', maxTicksLimit: 14 }, grid: { display: false }, stacked: false },
          y: {
            ticks: { color: '#6b7b96', callback: v => FinanceMath.eur(v) },
            grid: { color: c => c.tick.value === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)' },
          },
        },
      },
    });
  }

  // Reparto del gasto por etiqueta, teniendo en cuenta los grupos de etiquetas.
  // Vivía aquí como `_tagMapConGrupos` y el commit que retiró el gráfico de velas
  // OHLC (8f64dfb, 2026-07-30) se la llevó por delante dejando las llamadas en
  // pie: desde entonces `renderChartTags` lanzaba ReferenceError y, como las seis
  // gráficas se pintan en el mismo setTimeout, tumbaba también las cuatro
  // siguientes. Ahora vive en engine/dashboard, con tests.
  function _tagMapConGrupos(extracto, grupoTags, mode) {
    const dash = window.FinanceApp?.engine?.dashboard;
    if (dash?.sumarGastosPorTag) return dash.sumarGastosPorTag(extracto, grupoTags, mode);
    return FinanceMath.sumarPorTags(extracto, 'gasto'); // sin bundle: sin agrupar
  }

  function renderChartTags(extracto, activeTags, grupoTags=new Set(), mode='desglosado') {
    const COLORS=['#2ee6a8','#4d9fff','#ffb020','#ff6b6b','#a855f7','#fb923c','#34d399','#f472b6','#60a5fa','#facc15'];

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
            legend:{ position:'right', labels:{ color:'#a9b6cc', font:{size:11}, boxWidth:12, padding:8 } },
            tooltip:{ callbacks:{ label:ctx=>` ${rawLabels[ctx.dataIndex]}: ${FinanceMath.eur(ctx.parsed)}` } }
          }
        }
      });
    }

    // Media mensual de gastos por tag — barra horizontal
    renderChartMediaMensual(extracto, activeTags, COLORS, grupoTags, mode);
  }

  function renderChartMediaMensual(extracto, activeTags, COLORS=['#2ee6a8','#4d9fff','#ffb020','#ff6b6b','#a855f7','#fb923c','#34d399','#f472b6'], grupoTags=new Set(), mode='desglosado') {
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
          tooltip:{ backgroundColor:'#111a28', borderColor:'rgba(255,255,255,0.12)', borderWidth:1, titleColor:'#a9b6cc', bodyColor:'#eef3fb',
            callbacks:{ label:ctx=>`Media: ${FinanceMath.eur(ctx.parsed.x)}/mes` }
          }
        },
        scales:{
          x:{ ticks:{color:'#6b7b96', callback:v=>FinanceMath.eur(v)}, grid:{color:'rgba(255,255,255,0.07)'} },
          y:{ ticks:{color:'#a9b6cc'}, grid:{color:'rgba(255,255,255,0.06)'} }
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
      const mesFin = _fechaLocal(new Date(_my, _mm, 0));

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
          { label:'Ingresos', data:dataIngresos, backgroundColor:'rgba(46,230,168,0.7)', borderWidth:0, borderRadius:2, order:1 },
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
          legend:{ labels:{ color:'#a9b6cc', font:{size:11}, boxWidth:12 } },
          tooltip:{
            backgroundColor:'#111a28', borderColor:'rgba(255,255,255,0.12)', borderWidth:1,
            titleColor:'#a9b6cc', bodyColor:'#eef3fb',
            callbacks:{ label: ctx => ` ${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y)}` }
          }
        },
        scales:{
          x:{ ticks:{color:'#6b7b96', maxTicksLimit:12}, grid:{color:'rgba(255,255,255,0.07)'} },
          y:{ stacked:true, ticks:{color:'#6b7b96', callback:v=>FinanceMath.eur(v)}, grid:{color:'rgba(255,255,255,0.07)'} }
        }
      }
    });
  }

  function renderChartExpenseDonut({ gastosBasicosMediaMes, gastosDeseoMediaMes=0, gastosMediaMes, cuotasMediaMes, ingresosMediaMes, amortizacionesMediaMes=0, tagPromoMediaMes={} }) {
    const ctx = document.getElementById('chart-expense-donut'); if (!ctx) return;
    const tagCategorias = State.get('config').tagCategorias || [];
    const totalTagPromo = tagCategorias.reduce((s, t) => s + (tagPromoMediaMes[t] || 0), 0);
    const otrosGastos = Math.max(0, gastosDeseoMediaMes - totalTagPromo);
    const ahorro      = Math.max(0, ingresosMediaMes - cuotasMediaMes - gastosBasicosMediaMes - gastosDeseoMediaMes - amortizacionesMediaMes);
    const promoSegments = tagCategorias
      .map((t, i) => ({ label: t, value: tagPromoMediaMes[t] || 0, color: _TAG_PROMO_PALETTE[i % _TAG_PROMO_PALETTE.length] }))
      .filter(s => s.value > 0.01);
    const segments = [
      { label:'Necesidades',     value: gastosBasicosMediaMes, color:'#4d9fff' },
      ...promoSegments,
      { label:'Deseos',          value: otrosGastos,           color:'#ffb020' },
      { label:'Deuda',           value: cuotasMediaMes + amortizacionesMediaMes, color:'#a855f7' },
      { label:'Ahorro est.',     value: ahorro,                color:'#2ee6a8' },
    ].filter(s => s.value > 0);
    if (!segments.length) return;
    const existing = charts['chart-expense-donut'];
    if (existing && existing.data.labels.length === segments.length) {
      // Update in place — avoids canvas teardown on every period change
      existing.data.labels = segments.map(s=>s.label);
      existing.data.datasets[0].data = segments.map(s=>s.value);
      existing.data.datasets[0].backgroundColor = segments.map(s=>s.color);
      // El tooltip se recalcula a partir de `existing.data`, NO del `segments`
      // capturado al crear la gráfica: al actualizar en sitio ese cierre se
      // queda con los importes viejos y el porcentaje mostrado no cuadraba con
      // el trozo del donut que estabas señalando.
      existing.update('none');
      return;
    }
    if (existing) { try { existing.destroy(); } catch{} }
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
            backgroundColor:'#111a28', borderColor:'rgba(255,255,255,0.12)', borderWidth:1,
            titleColor:'#a9b6cc', bodyColor:'#eef3fb',
            callbacks: { label: c => { const d=c.chart.data.datasets[0].data; const t=d.reduce((s,x)=>s+x,0); return ` ${c.label}: ${FinanceMath.eur(c.parsed)} (${(c.parsed/(t||c.parsed)*100).toFixed(1)}%)`; } }
          }
        }
      }
    });
  }

  // Paleta de colores para el desglose de otros gastos
  const _OTROS_PALETTE = ['#ff6b6b','#f97316','#eab308','#22d3ee','#a78bfa','#34d399','#fb7185','#60a5fa','#c084fc','#4ade80'];

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
            backgroundColor:'#111a28', borderColor:'rgba(255,255,255,0.12)', borderWidth:1,
            titleColor:'#a9b6cc', bodyColor:'#eef3fb',
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
    const _SALDO_PALETTE = ['#2ee6a8','#4d9fff','#a855f7','#f97316','#eab308','#22d3ee','#fb7185','#34d399','#60a5fa','#c084fc'];
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
            backgroundColor:'#111a28', borderColor:'rgba(255,255,255,0.12)', borderWidth:1,
            titleColor:'#a9b6cc', bodyColor:'#eef3fb',
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
      fechaReferencia: document.getElementById('cfg-ref')?.value || existing.fechaReferencia || _fechaLocal(new Date()),
      showHistorico:   document.getElementById('cfg-show-hist')?.checked??true,
    };
    State.set('config',config); render();
  }
  function applyPreset(preset) { PeriodBar.applyPreset(preset); }
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

  return { render, actualizar, setVentanaVelas, limpiarSimulaciones, salirEscenario, applyConfig, applyPreset, setChartMode, setTagGroupsMode, toggleTag, toggleTagGrupo, toggleGruposPanel, toggleTagCategoria, toggleAccFilter, clearAccFilter, toggleExecSummary, toggleCriticos, toggleConfig, toggleAnalisis };
})();
