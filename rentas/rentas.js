// Depends on: State, FinanceMath, UI, EscenariosModule
const RentasModule = (() => {
  let _tab = 'mobiliario';

  // ── Entry point ──────────────────────────────────────────────────────────────
  function render() {
    const view = document.getElementById('view-rentas');
    if (!view) return;
    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Rentas <span>Fiscales</span></h1>
      </div>
      <div style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border)">
        ${_tabBtn('mobiliario', '📈 Capital Mobiliario')}
        ${_tabBtn('trabajo',    '💼 Rendimientos del Trabajo')}
        ${_tabBtn('inmobiliario','🏠 Capital Inmobiliario')}
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
    if (_tab === 'mobiliario')   return _capitalMobiliario();
    if (_tab === 'trabajo')      return _rendimientosTrabajo();
    return _capitalInmobiliario();
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
          Ve a <strong>Cuentas e Inversiones</strong> y crea una cuenta de tipo "Fondo de inversión" para ver su análisis fiscal aquí.
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
          Configura los tramos en <strong>Cuentas e Inversiones → ⚙ Tramos ganancias capital</strong>.
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
      ? `<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Crea una cuenta de tipo "Plan de pensiones" en <strong>Cuentas e Inversiones</strong>.</div>`
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

  return { render, setTab };
})();
