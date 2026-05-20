// Depends on: State, FinanceMath, UI, EscenariosModule
const RentasModule = (() => {
  let _tab = 'declaracion';
  let _rentaExtras = {}; // manual overrides for declaración

  // ── Resumen fiscal consolidado ───────────────────────────────────────────────
  function _resumenFiscal() {
    const config   = State.get('config');
    const accounts = State.get('accounts') || [];
    const nominas  = (State.get('nominas') || []).filter(n => n.activo);
    const tramos   = config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]];
    const tramosGanancia = config.tramosGananciasCapital || [[0,19],[6000,21],[50000,23],[200000,27],[300000,28]];

    const totalBruto = nominas.reduce((s, n) => s + (n.bruto || 0), 0);
    const totalIRPF  = nominas.reduce((s, n) => {
      if (n.irpfModo === 'manual') return s + (n.bruto || 0) * ((n.irpfPct || 0) / 100);
      return s + FinanceMath.calcIRPF(n.bruto || 0, tramos);
    }, 0);

    const fondos = accounts.filter(a => (a.modeloFondo||'cuenta') === 'inversion');
    let totalPlusvalia = 0, totalImpuestoInv = 0;
    for (const f of fondos) {
      const inv = FinanceMath.calcFondoInversion(f, tramosGanancia);
      if (inv) { totalPlusvalia += inv.plusvalia; totalImpuestoInv += inv.impuesto; }
    }

    const hasData = totalBruto > 0 || fondos.length > 0;
    if (!hasData) return '';

    return `
    <div class="exec-summary mb-14">
      ${totalBruto > 0 ? `
      <div class="exec-item">
        <div class="exec-item-label">IRPF trabajo</div>
        <div class="exec-item-val neg">${FinanceMath.eur(totalIRPF)}/año</div>
      </div>
      <div class="exec-item">
        <div class="exec-item-label">Neto trabajo</div>
        <div class="exec-item-val pos">${FinanceMath.eur((totalBruto * 12) - totalIRPF * 12)}/año</div>
      </div>` : ''}
      ${fondos.length > 0 ? `
      <div class="exec-item">
        <div class="exec-item-label">Plusvalía latente</div>
        <div class="exec-item-val ${totalPlusvalia >= 0 ? 'pos' : 'neg'}">${FinanceMath.eur(totalPlusvalia)}</div>
      </div>
      <div class="exec-item">
        <div class="exec-item-label">Imp. potencial (inversión)</div>
        <div class="exec-item-val neg">${FinanceMath.eur(totalImpuestoInv)}</div>
      </div>` : ''}
    </div>`;
  }

  // ── Entry point ──────────────────────────────────────────────────────────────
  function render() {
    const view = document.getElementById('view-rentas');
    if (!view) return;
    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Fiscalidad</h1>
      </div>
      ${_resumenFiscal()}
      <div style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${_tabBtn('declaracion', 'Declaración Renta')}
        ${_tabBtn('mobiliario',  'Capital Mobiliario')}
        ${_tabBtn('trabajo',     'Rendimientos del Trabajo')}
        ${_tabBtn('inmobiliario','Capital Inmobiliario')}
      </div>
      <div id="rentas-tab-content">${_renderTab()}</div>
    `;
  }

  function _tabBtn(id, label) {
    const active = _tab === id;
    return `<button onclick="RentasModule.setTab('${id}')" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${active ? '600' : '400'};
      color:${active ? 'var(--accent)' : 'var(--text2)'};
      border-bottom:2px solid ${active ? 'var(--accent)' : 'transparent'};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${label}</button>`;
  }

  function setTab(tab) {
    _tab = tab;
    const content = document.getElementById('rentas-tab-content');
    if (content) content.innerHTML = _renderTab();
    document.querySelectorAll('[data-rentas-tab]').forEach(el => {
      el.style.fontWeight = el.dataset.rentasTab === tab ? '600' : '400';
    });
    // Re-render full to update tab styles
    render();
  }

  function _renderTab() {
    if (_tab === 'declaracion')  return _declaracionRenta();
    if (_tab === 'mobiliario')   return _capitalMobiliario();
    if (_tab === 'trabajo')      return _rendimientosTrabajo();
    return _capitalInmobiliario();
  }

  // ── Declaración de la Renta ──────────────────────────────────────────────────
  function _calcRenta() {
    const config  = State.get('config');
    const nominas = (State.get('nominas') || []).filter(n => n.activo && !n.simulacion);
    const accounts = State.get('accounts') || [];
    const expenses = (State.get('expenses') || []).filter(e => e.activo && !e.simulacion);
    const tramos  = FinanceMath.tramosIRPFParaAño(new Date().getFullYear());
    const tramosA = FinanceMath.tramosGananciasParaAño(new Date().getFullYear());
    const ex      = _rentaExtras;

    // Rendimientos del trabajo
    const brutoTotal   = nominas.reduce((s, n) => s + (n.bruto || 0), 0);
    const cotizSS      = brutoTotal * 0.0635; // 4.70% CC + 1.55% desempleo + 0.10% FP
    const gastosArt19  = Math.min(2000, brutoTotal); // Art. 19.2 — otros gastos deducibles
    const RNT          = Math.max(0, brutoTotal - cotizSS - gastosArt19);
    // Reducción Art. 20 LIRPF 2025
    let reducArt20 = 0;
    if (RNT <= 15876)      reducArt20 = 7302;
    else if (RNT <= 21622) reducArt20 = Math.max(0, 7302 - 1.75 * (RNT - 15876));
    // Aportaciones PP deducibles
    const año = new Date().getFullYear();
    const aportPP = accounts
      .filter(a => a.modeloFondo === 'pension' || a.esFondoPension)
      .reduce((s, a) => s + (a.aportaciones || [])
        .filter(ap => (ap.fecha || '').startsWith(String(año)))
        .reduce((ss, ap) => ss + (ap.cantidad || 0), 0), 0);
    const limPP     = Math.min(8000, RNT * 0.30);
    const deducPP   = Math.min(aportPP, limPP);
    const RNTred    = Math.max(0, RNT - reducArt20 - deducPP);

    // Otros ingresos sujetos a IRPF (prestaciones, etc.) — annualized from monthly
    const otrosIngresos = expenses
      .filter(e => e.sujetoIRPF && e.tipo === 'ingreso')
      .reduce((s, e) => s + (e.cuantia || 0) * (e.frecuencia || 1) * (e.tipoFrecuencia === 'mensual' ? 12 : 1), 0);

    // Extras manuales
    const capInmobiliario   = parseFloat(ex.capInmobiliario) || 0;
    const capMobiliario     = parseFloat(ex.capMobiliario) || 0;
    const gananciasFondos   = parseFloat(ex.gananciasFondos) || 0;
    const otrasCorto        = parseFloat(ex.otrasCorto) || 0;
    const retCapital        = parseFloat(ex.retCapital) || 0;

    // Bases
    const baseGeneral = Math.max(0, RNTred + otrosIngresos + capInmobiliario + otrasCorto);
    const baseAhorro  = Math.max(0, capMobiliario + gananciasFondos);
    const cuotaGen    = FinanceMath.calcIRPF(baseGeneral, tramos);
    const cuotaAho    = FinanceMath.calcIRPF(baseAhorro, tramosA);
    const cuotaIntegra = cuotaGen + cuotaAho;

    // Retenciones
    const retNomina = nominas.reduce((s, n) => {
      if (n.irpfModo === 'manual') return s + (n.bruto || 0) * ((n.irpfPct || 0) / 100);
      return s + FinanceMath.calcIRPF(n.bruto || 0, tramos);
    }, 0);
    const totalRet = retNomina + retCapital;

    // Resultado
    const resultado = cuotaIntegra - totalRet;

    return { brutoTotal, cotizSS, gastosArt19, RNT, reducArt20, aportPP, limPP, deducPP, RNTred,
             otrosIngresos, capInmobiliario, capMobiliario, gananciasFondos, otrasCorto,
             baseGeneral, baseAhorro, cuotaGen, cuotaAho, cuotaIntegra,
             retNomina, retCapital, totalRet, resultado };
  }

  function _recalcRenta() {
    _rentaExtras = {
      capInmobiliario: document.getElementById('rex-inmobiliario')?.value || '0',
      capMobiliario:   document.getElementById('rex-mobiliario')?.value   || '0',
      gananciasFondos: document.getElementById('rex-ganancias')?.value    || '0',
      otrasCorto:      document.getElementById('rex-otras')?.value        || '0',
      retCapital:      document.getElementById('rex-ret-cap')?.value      || '0',
    };
    const el = document.getElementById('renta-cuadro');
    if (el) el.innerHTML = _rentaCuadro(_calcRenta());
  }

  function _rentaRow(label, value, color, indent) {
    const eur = FinanceMath.eur;
    const style = `padding:5px ${indent ? '20px' : '10px'} 5px 10px;font-size:12px;`;
    const valStyle = `text-align:right;font-weight:600;color:${color || 'var(--text)'};font-size:12px;padding:5px 10px;`;
    return `<tr><td style="${style}color:var(--text2)">${label}</td><td style="${valStyle}">${eur(value)}</td></tr>`;
  }

  function _rentaSection(label) {
    return `<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${label}</td></tr>`;
  }

  function _rentaCuadro(r) {
    const eur = FinanceMath.eur;
    const hasOtros = r.otrosIngresos > 0;
    const ahorroRows = (r.capMobiliario !== 0 || r.gananciasFondos !== 0) ? `
      ${_rentaRow('Capital mobiliario (dividendos, intereses)', r.capMobiliario, 'var(--text)', true)}
      ${_rentaRow('Ganancias patrimoniales (fondos/acciones)', r.gananciasFondos, r.gananciasFondos >= 0 ? 'var(--text)' : 'var(--green)', true)}
    ` : `<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>`;

    const resultColor = r.resultado > 0 ? 'var(--red)' : 'var(--green)';
    const resultLabel = r.resultado > 0 ? '🔴 A PAGAR' : '🟢 A DEVOLVER';

    return `
      <table style="width:100%;border-collapse:collapse">
        ${_rentaSection('RENDIMIENTOS DEL TRABAJO')}
        ${_rentaRow('Ingresos íntegros del trabajo', r.brutoTotal, 'var(--text)', true)}
        ${_rentaRow('− Cotizaciones SS (≈6.35%)', -r.cotizSS, 'var(--red)', true)}
        ${_rentaRow('− Gastos deducibles (Art. 19.2 LIRPF)', -r.gastosArt19, 'var(--red)', true)}
        ${_rentaRow('= Rendimiento neto trabajo', r.RNT, 'var(--text)', false)}
        ${_rentaRow('− Reducción Art. 20 LIRPF', -r.reducArt20, 'var(--green)', true)}
        ${r.deducPP > 0 ? _rentaRow(`− Aportaciones planes de pensiones (${eur(r.aportPP)}, límite ${eur(r.limPP)})`, -r.deducPP, 'var(--green)', true) : ''}
        ${hasOtros ? _rentaRow('+ Otros ingresos sujetos a IRPF', r.otrosIngresos, 'var(--text)', true) : ''}
        ${r.capInmobiliario !== 0 ? _rentaRow('+ Capital inmobiliario neto', r.capInmobiliario, r.capInmobiliario >= 0 ? 'var(--text)' : 'var(--green)', true) : ''}
        ${r.otrasCorto !== 0 ? _rentaRow('± Otras ganancias corto plazo', r.otrasCorto, 'var(--text)', true) : ''}
        <tr style="background:var(--bg3)"><td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
          <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${eur(r.baseGeneral)}</td></tr>
        <tr><td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
          <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${eur(r.cuotaGen)}</td></tr>

        ${_rentaSection('BASE DEL AHORRO')}
        ${ahorroRows}
        <tr style="background:var(--bg3)"><td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
          <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${eur(r.baseAhorro)}</td></tr>
        <tr><td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base ahorro (ganancias capital)</td>
          <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${eur(r.cuotaAho)}</td></tr>

        ${_rentaSection('RESULTADO')}
        ${_rentaRow('Cuota íntegra total', r.cuotaIntegra, 'var(--red)', false)}
        ${_rentaRow('− Retenciones en nómina', -r.retNomina, 'var(--green)', true)}
        ${r.retCapital !== 0 ? _rentaRow('− Retenciones capital mobiliario', -r.retCapital, 'var(--green)', true) : ''}
        <tr style="border-top:2px solid var(--border)">
          <td style="padding:10px;font-weight:700;font-size:14px">${resultLabel}</td>
          <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${resultColor}">${eur(Math.abs(r.resultado))}</td>
        </tr>
      </table>
    `;
  }

  function _declaracionRenta() {
    const nominas = (State.get('nominas') || []).filter(n => n.activo && !n.simulacion);
    const res = _calcRenta();
    const añoActual = new Date().getFullYear();

    const noNominas = nominas.length === 0 ? `
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        ⚠️ No tienes nóminas configuradas. Ve a <strong>Nóminas</strong> para añadir tus ingresos del trabajo.
      </div>` : '';

    return `
      <div class="auth-hint mb-12" style="border-color:var(--accent)">
        📋 Estimación orientativa de tu declaración de la renta <strong>${añoActual}</strong> basada en los datos de la app.
        Los rendimientos del trabajo se detectan automáticamente. Introduce manualmente los datos que la app no tiene.
        <strong>No sustituye el asesoramiento fiscal profesional.</strong>
      </div>
      ${noNominas}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">

        <!-- Columna izquierda: datos manuales -->
        <div>
          <div class="card" style="padding:16px;margin-bottom:12px">
            <div class="card-title mb-12">Datos adicionales</div>
            <div class="text-sm mb-8" style="color:var(--text2)">
              Introduce los importes anuales que la app no calcula automáticamente.
            </div>
            <div class="form-group">
              <label class="form-label">Capital inmobiliario neto (alquileres − gastos)</label>
              <input type="number" id="rex-inmobiliario" class="form-input" value="${_rentaExtras.capInmobiliario || 0}"
                     placeholder="0" oninput="RentasModule._recalcRenta()"/>
            </div>
            <div class="form-group mt-8">
              <label class="form-label">Capital mobiliario (dividendos, intereses)</label>
              <input type="number" id="rex-mobiliario" class="form-input" value="${_rentaExtras.capMobiliario || 0}"
                     placeholder="0" oninput="RentasModule._recalcRenta()"/>
            </div>
            <div class="form-group mt-8">
              <label class="form-label">Ganancias / pérdidas patrimoniales (fondos, acciones)</label>
              <input type="number" id="rex-ganancias" class="form-input" value="${_rentaExtras.gananciasFondos || 0}"
                     placeholder="0" oninput="RentasModule._recalcRenta()"/>
              <div style="font-size:11px;color:var(--text3);margin-top:4px">Positivo = ganancia · Negativo = pérdida compensable</div>
            </div>
            <div class="form-group mt-8">
              <label class="form-label">Otras ganancias corto plazo (menos de 1 año)</label>
              <input type="number" id="rex-otras" class="form-input" value="${_rentaExtras.otrasCorto || 0}"
                     placeholder="0" oninput="RentasModule._recalcRenta()"/>
            </div>
            <div class="form-group mt-8">
              <label class="form-label">Retenciones capital ya aplicadas</label>
              <input type="number" id="rex-ret-cap" class="form-input" value="${_rentaExtras.retCapital || 0}"
                     placeholder="0" oninput="RentasModule._recalcRenta()"/>
              <div style="font-size:11px;color:var(--text3);margin-top:4px">Retenciones del 19% sobre dividendos, intereses y fondos ya retenidas en origen</div>
            </div>
          </div>
          <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
            <strong style="color:var(--text2)">Autodetectado de la app:</strong><br>
            ${nominas.map(n => `• ${n.nombre}: ${FinanceMath.eur(n.bruto || 0)} bruto/año`).join('<br>') || '— Sin nóminas —'}
            ${(State.get('accounts')||[]).filter(a=>a.modeloFondo==='pension'||a.esFondoPension).length > 0
              ? `<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${
                  (State.get('accounts')||[]).filter(a=>a.modeloFondo==='pension'||a.esFondoPension)
                  .map(a=>`• ${a.nombre}`).join('<br>')
                }` : ''}
          </div>
        </div>

        <!-- Columna derecha: cuadro de declaración -->
        <div class="card" style="padding:16px">
          <div class="card-title mb-12">Borrador — Ejercicio ${añoActual}</div>
          <div id="renta-cuadro">${_rentaCuadro(res)}</div>
        </div>
      </div>
    `;
  }

  // ── Tabla de tramos ──────────────────────────────────────────────────────────
  function _tramosTable(tramos) {
    const rows = tramos.map((t, i) => {
      const hasta = i < tramos.length - 1 ? tramos[i + 1][0] : null;
      const range = hasta !== null
        ? `${FinanceMath.eur(t[0])} – ${FinanceMath.eur(hasta)}`
        : `Más de ${FinanceMath.eur(t[0])}`;
      return `<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${range}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${t[1]}%</td>
      </tr>`;
    }).join('');
    return `<table style="border-collapse:collapse;min-width:280px">
      <tr style="color:var(--text3)">
        <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
        <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
      </tr>
      ${rows}
    </table>`;
  }

  // ── TAB 1: Capital Mobiliario ────────────────────────────────────────────────
  function _capitalMobiliario() {
    const accounts = State.get('accounts') || [];
    const config   = State.get('config');
    const tramos   = config.tramosGananciasCapital || [[0,19],[6000,21],[50000,23],[200000,27],[300000,28]];
    const fondos   = accounts.filter(a => {
      const m = a.modeloFondo || (a.esFondoPension ? 'pension' : 'cuenta');
      return m === 'inversion';
    });

    if (fondos.length === 0) {
      return `<div class="card" style="text-align:center;padding:48px">
        <div style="font-size:36px;margin-bottom:12px">📈</div>
        <div style="font-size:15px;font-weight:600;margin-bottom:8px">Sin fondos de inversión</div>
        <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">
          Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver su análisis fiscal aquí.
        </div>
      </div>`;
    }

    let totalSaldo = 0, totalCostBase = 0, totalImpuesto = 0;
    const cards = fondos.map(f => {
      const inv = FinanceMath.calcFondoInversion(f, tramos);
      if (!inv) return '';
      totalSaldo    += inv.saldo;
      totalCostBase += inv.costBase;
      totalImpuesto += inv.impuesto;
      const pct = inv.costBase > 0 ? (inv.plusvalia / inv.costBase * 100) : 0;
      const escBadges = (f.escenarioIds||[]).map(id =>
        `<span class="badge badge-yellow">🔭 ${EscenariosModule.escenarioName(id)}</span>`
      ).join('');
      return `
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${f.nombre}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${escBadges}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            <div class="stat-card">
              <div class="stat-label">Valor actual</div>
              <div class="stat-value">${FinanceMath.eur(inv.saldo)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Coste base (aportado)</div>
              <div class="stat-value">${FinanceMath.eur(inv.costBase)}</div>
            </div>
          </div>
          <div class="grid-2" style="gap:8px">
            <div class="stat-card">
              <div class="stat-label">Plusvalía latente (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)</div>
              <div class="stat-value ${inv.plusvalia >= 0 ? 'pos' : 'neg'}">${FinanceMath.eur(inv.plusvalia)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Imp. ganancias capital (est.)</div>
              <div class="stat-value neg">${FinanceMath.eur(inv.impuesto)}</div>
            </div>
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${FinanceMath.eur(inv.neto)}</span>
          </div>
        </div>`;
    }).join('');

    const totalPlusvalia = totalSaldo - totalCostBase;
    const totalNeto = totalSaldo - totalImpuesto;

    return `
      <!-- Resumen de cartera -->
      <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
        <div class="card-title">Cartera de fondos — resumen</div>
        <div class="grid-3" style="gap:8px;margin-bottom:10px">
          <div class="stat-card">
            <div class="stat-label">Valor total cartera</div>
            <div class="stat-value">${FinanceMath.eur(totalSaldo)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total aportado (coste base)</div>
            <div class="stat-value">${FinanceMath.eur(totalCostBase)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Plusvalía latente total</div>
            <div class="stat-value ${totalPlusvalia >= 0 ? 'pos' : 'neg'}">${FinanceMath.eur(totalPlusvalia)}</div>
          </div>
        </div>
        <div class="grid-2" style="gap:8px">
          <div class="stat-card">
            <div class="stat-label">Impuesto estimado si se liquida todo</div>
            <div class="stat-value neg">${FinanceMath.eur(totalImpuesto)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Neto tras impuestos (cartera completa)</div>
            <div class="stat-value pos">${FinanceMath.eur(totalNeto)}</div>
          </div>
        </div>
      </div>

      <!-- Fondos individuales -->
      ${cards}

      <!-- Marco fiscal -->
      <div class="card mt-16">
        <div class="card-title mb-12">Marco fiscal — Fondos de inversión</div>
        <div class="grid-2" style="gap:16px;margin-bottom:16px">
          <div style="padding:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius)">
            <div style="font-weight:600;margin-bottom:6px;color:#10b981">✓ Traspaso (fondo → fondo)</div>
            <div class="text-sm" style="color:var(--text2);line-height:1.6">
              <strong>Sin tributación</strong> (Art. 94 LIRPF). Diferimiento fiscal total. La plusvalía latente queda acumulada y la base de coste se traslada al nuevo fondo. Ideal para cambiar estrategia o gestora sin coste fiscal.
            </div>
          </div>
          <div style="padding:14px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius)">
            <div style="font-weight:600;margin-bottom:6px;color:var(--red)">€ Reembolso (fondo → cuenta corriente)</div>
            <div class="text-sm" style="color:var(--text2);line-height:1.6">
              Tributa como <strong>ganancia patrimonial</strong> en la base del ahorro. Retención automática del <strong>19%</strong> sobre la plusvalía proporcional al importe retirado. Liquidación definitiva en la declaración anual.
            </div>
          </div>
        </div>
        <div style="margin-bottom:4px;font-size:12px;font-weight:600;color:var(--text2)">Tramos ganancias patrimoniales (base del ahorro)</div>
        ${_tramosTable(tramos)}
        <div class="text-sm mt-8" style="color:var(--text3)">
          Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
        </div>
      </div>
    `;
  }

  // ── TAB 2: Rendimientos del Trabajo ─────────────────────────────────────────
  function _rendimientosTrabajo() {
    const config   = State.get('config');
    const tramos   = config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]];
    const nominas  = (State.get('nominas') || []).filter(n => n.activo);
    const accounts = State.get('accounts') || [];
    const planes   = accounts.filter(a => {
      const m = a.modeloFondo || (a.esFondoPension ? 'pension' : 'cuenta');
      return m === 'pension';
    });

    // Aggregate nóminas
    const totalBruto = nominas.reduce((s, n) => s + (n.bruto || 0), 0);
    const totalIRPF  = nominas.reduce((s, n) => {
      if (n.irpfModo === 'manual') return s + (n.bruto || 0) * ((n.irpfPct || 0) / 100);
      return s + FinanceMath.calcIRPF(n.bruto || 0, tramos);
    }, 0);
    const totalNeto  = totalBruto - totalIRPF;

    const LIMITE_APORT = 1500; // límite individual 2024/2025

    const nominaCards = nominas.length === 0
      ? `<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>`
      : nominas.map(n => {
          const irpf = n.irpfModo === 'manual'
            ? (n.bruto || 0) * ((n.irpfPct || 0) / 100)
            : FinanceMath.calcIRPF(n.bruto || 0, tramos);
          const neto = (n.bruto || 0) - irpf;
          return `
            <div class="card">
              <div class="card-title" style="margin-bottom:10px">${n.nombre}</div>
              <div class="flex justify-between mb-5">
                <span class="text-sm" style="color:var(--text2)">Bruto mensual</span>
                <span class="num">${FinanceMath.eur(n.bruto || 0)}</span>
              </div>
              <div class="flex justify-between mb-5">
                <span class="text-sm" style="color:var(--text2)">IRPF estimado</span>
                <span class="num neg">${FinanceMath.eur(irpf)}</span>
              </div>
              <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
                <span class="text-sm" style="font-weight:600">Neto</span>
                <span class="num pos">${FinanceMath.eur(neto)}</span>
              </div>
            </div>`;
        }).join('');

    // Find marginal tramo based on total annual income
    const brutoAnual = totalBruto * 12;
    const tramoMarginal = [...tramos].reverse().find(t => brutoAnual >= t[0]);
    const pctMarginal = tramoMarginal ? tramoMarginal[1] : (tramos[0] ? tramos[0][1] : 19);

    const hoy = new Date();
    const inicioAnyo = `${hoy.getFullYear()}-01-01`;

    const planesCards = planes.length === 0
      ? `<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Crea una cuenta de tipo "Plan de pensiones" en <strong>Cuentas y Ahorro</strong>.</div>`
      : planes.map(p => {
          const pension = FinanceMath.calcFondosPension(p);
          if (!pension) return '';
          const aportEsteAnyo = (p.aportaciones || [])
            .filter(a => a.fecha >= inicioAnyo)
            .reduce((s, a) => s + a.cantidad, 0);
          const deducible = Math.min(aportEsteAnyo, LIMITE_APORT);
          const ahorroPension = deducible * (pctMarginal / 100);
          const superaLimite = aportEsteAnyo > LIMITE_APORT;
          return `
            <div class="card">
              <div class="flex gap-8 items-center mb-10">
                <span class="card-title" style="margin:0">${p.nombre}</span>
                <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
              </div>
              <div class="flex justify-between mb-5">
                <span class="text-sm" style="color:var(--text2)">Valor actual</span>
                <span class="num">${FinanceMath.eur(pension.saldo)}</span>
              </div>
              <div class="flex justify-between mb-5">
                <span class="text-sm" style="color:var(--text2)">Coste base (total aportado)</span>
                <span class="num">${FinanceMath.eur(pension.costBase)}</span>
              </div>
              <div class="flex justify-between mb-5">
                <span class="text-sm" style="color:var(--text2)">Revalorización</span>
                <span class="num ${pension.beneficio >= 0 ? 'pos' : 'neg'}">${FinanceMath.eur(pension.beneficio)}</span>
              </div>
              <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
                <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${hoy.getFullYear()}</div>
                <div class="flex justify-between mb-5">
                  <span class="text-sm" style="color:var(--text2)">Aportado</span>
                  <span class="num ${superaLimite ? 'neg' : ''}">${FinanceMath.eur(aportEsteAnyo)}${superaLimite ? ' ⚠' : ''}</span>
                </div>
                <div class="flex justify-between mb-5">
                  <span class="text-sm" style="color:var(--text2)">Límite deducible</span>
                  <span class="num">${FinanceMath.eur(LIMITE_APORT)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm" style="color:var(--text2)">Ahorro IRPF est. (tramo ${pctMarginal}%)</span>
                  <span class="num pos">${FinanceMath.eur(ahorroPension)}</span>
                </div>
                ${superaLimite ? `<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${FinanceMath.eur(LIMITE_APORT)})</div>` : ''}
              </div>
              <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
                Al rescatar tributa como <strong>rendimiento del trabajo</strong> (IRPF tramos generales), no en la base del ahorro.
                ${pension.proxDesbloqueo ? `· Próx. desbloqueo: ${pension.proxDesbloqueo}` : ''}
              </div>
            </div>`;
        }).join('');

    return `
      <!-- Resumen nóminas -->
      <div class="card mb-16">
        <div class="card-title mb-10">Nóminas activas</div>
        <div class="grid-3" style="gap:8px;margin-bottom:14px">
          <div class="stat-card">
            <div class="stat-label">Bruto mensual total</div>
            <div class="stat-value">${FinanceMath.eur(totalBruto)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">IRPF estimado mensual</div>
            <div class="stat-value neg">${FinanceMath.eur(totalIRPF)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Neto mensual</div>
            <div class="stat-value pos">${FinanceMath.eur(totalNeto)}</div>
          </div>
        </div>
        <div class="grid-3">${nominaCards}</div>
      </div>

      <!-- Planes de pensiones -->
      <div class="card-title mb-8">Planes de pensiones</div>
      <div class="auth-hint mb-14" style="border-color:var(--yellow)">
        💼 <strong>Diferencia clave frente a fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47%), <em>no</em> en la base del ahorro. Las aportaciones son deducibles hasta <strong>${FinanceMath.eur(LIMITE_APORT)}/año</strong> (plan individual, 2025).
      </div>
      <div class="grid-3 mb-16">${planesCards}</div>

      <!-- Tramos IRPF -->
      <div class="card">
        <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
        ${_tramosTable(tramos)}
        <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
      </div>
    `;
  }

  // ── TAB 3: Capital Inmobiliario (WIP) ────────────────────────────────────────
  function _capitalInmobiliario() {
    return `
      <div class="card" style="text-align:center;padding:56px 32px;border:2px dashed var(--border)">
        <div style="font-size:44px;margin-bottom:16px">🏠</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px">Capital Inmobiliario</div>
        <span class="badge" style="margin-bottom:20px;font-size:12px;padding:5px 14px;background:rgba(99,102,241,0.12);color:var(--accent)">En construcción</span>
        <div class="text-sm" style="color:var(--text2);max-width:480px;margin:0 auto 28px;line-height:1.6">
          Aquí podrás gestionar <strong>ingresos por alquiler</strong>, calcular la reducción del 60% para arrendamiento de vivienda habitual, y deducir los gastos correspondientes.
        </div>
        <div class="grid-2" style="max-width:480px;margin:0 auto;gap:12px;text-align:left">
          <div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-weight:600;margin-bottom:4px;font-size:13px">Rendimientos íntegros</div>
            <div class="text-sm" style="color:var(--text3)">Alquileres, subarriendos, cesión de derechos sobre inmuebles</div>
          </div>
          <div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-weight:600;margin-bottom:4px;font-size:13px">Gastos deducibles</div>
            <div class="text-sm" style="color:var(--text3)">IBI, seguros, reparaciones, amortización (3%/año sobre valor construcción), financiación</div>
          </div>
          <div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-weight:600;margin-bottom:4px;font-size:13px">Reducción 60%</div>
            <div class="text-sm" style="color:var(--text3)">Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)</div>
          </div>
          <div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-weight:600;margin-bottom:4px;font-size:13px">Base general del IRPF</div>
            <div class="text-sm" style="color:var(--text3)">Tributa a tramos ordinarios (no base del ahorro). Sin diferimiento fiscal.</div>
          </div>
        </div>
      </div>
    `;
  }

  return { render, setTab, _recalcRenta };
})();
