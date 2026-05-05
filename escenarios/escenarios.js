// Depends on: State, FinanceMath, UI
const EscenariosModule = (() => {
  let chartComparacion = null;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function escenarioName(id) {
    if (!id) return 'Base';
    const e = (State.get('escenarios')||[]).find(e => e._id === id);
    return e ? e.nombre : id;
  }

  // Multi-checkbox HTML for assigning an item to one or more scenarios.
  // currentValues: string[] of scenario _ids currently selected.
  function checkboxesHtml(currentValues = []) {
    const escenarios = State.get('escenarios') || [];
    if (escenarios.length === 0) return '';
    const items = escenarios.map(e => `
      <label class="esc-check-label" style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;
             background:var(--bg2);border-radius:20px;cursor:pointer;font-size:12px;
             border:1px solid ${(currentValues||[]).includes(e._id) ? (e.color||'var(--accent)') : 'var(--border)'}">
        <input type="checkbox" class="esc-scenario-check" value="${e._id}"
               ${(currentValues||[]).includes(e._id) ? 'checked' : ''}
               style="accent-color:${e.color||'var(--accent)'}"/>
        ${e.nombre}
      </label>`).join('');
    return `<div class="form-group mt-8">
      <label class="form-label">Escenarios</label>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${items}</div>
    </div>`;
  }

  // Read checked escenario IDs from the currently open modal.
  function readCheckedEscenarios() {
    return [...document.querySelectorAll('.esc-scenario-check:checked')].map(el => el.value);
  }

  // Runs a full extracto projection for the given escenario (or base if null).
  function _extractoParaEscenario(esc) {
    const config   = State.get('config');
    const allLoans    = State.get('loans')    || [];
    const allExpenses = State.get('expenses') || [];
    const allNominas  = State.get('nominas')  || [];
    const allAccounts = State.get('accounts') || [];
    const inflPeriodos = State.get('inflacion') || [];

    const escId    = esc ? esc._id : null;
    const filtered = FinanceMath.filtrarPorEscenario(allLoans, allExpenses, allNominas, allAccounts, escId);

    const horizonte = esc && esc.fechaFin && esc.fechaFin > config.dashboardEnd
      ? esc.fechaFin
      : config.dashboardEnd;
    const cfgExt = { ...config, dashboardEnd: horizonte };

    const eventos = FinanceMath.generarExtracto(
      filtered.loans, filtered.expenses, filtered.accounts, cfgExt,
      null, filtered.nominas, inflPeriodos
    );
    return { eventos, horizonte };
  }

  // ── Render principal ─────────────────────────────────────────────────────────
  function render() {
    if (chartComparacion) { try { chartComparacion.destroy(); } catch {} chartComparacion = null; }

    const escenarios = State.get('escenarios') || [];
    const config     = State.get('config') || {};
    const activo     = config.escenarioActivo || null;

    const view = document.getElementById('view-escenarios');
    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Mis <span>Escenarios</span></h1>
        <div class="page-actions">
          <button class="btn-primary" id="btn-new-esc">+ Nuevo escenario</button>
        </div>
      </div>

      ${activo ? `
      <div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🔭</span>
        <div style="flex:1">
          <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${escenarioName(activo)}</span>
          <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este escenario</span>
        </div>
        <button class="btn-secondary btn-sm" onclick="EscenariosModule.desactivar()">Volver a base</button>
      </div>` : ''}

      <div id="esc-list">
        ${escenarios.length === 0
          ? `<div class="card" style="text-align:center;padding:48px;color:var(--text3)">
               <div style="font-size:32px;margin-bottom:12px">🔭</div>
               <div style="font-size:16px;font-weight:600;margin-bottom:8px">Sin escenarios todavía</div>
               <div style="font-size:13px;max-width:400px;margin:0 auto">Crea un escenario y asígnale elementos desde Préstamos, Movimientos, Cuentas o Amortizaciones.</div>
             </div>`
          : escenarios.map(e => renderCard(e, activo)).join('')}
      </div>

      ${escenarios.length > 0 ? `
      <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
      <div class="card" style="padding:16px">
        <canvas id="chart-comparacion" height="220"></canvas>
      </div>
      <div class="card mt-12" style="padding:14px">
        ${renderTablaComparativa(escenarios)}
      </div>` : ''}`;

    document.getElementById('btn-new-esc').onclick = () => openForm();

    if (escenarios.length > 0) {
      setTimeout(() => renderChart(escenarios), 50);
    }
  }

  function renderCard(esc, activo) {
    const isActive = activo === esc._id;
    const color    = esc.color || '#6366f1';

    // Count items tagged to this scenario
    const loans    = State.get('loans')    || [];
    const expenses = State.get('expenses') || [];
    const nominas  = State.get('nominas')  || [];
    const accounts = State.get('accounts') || [];
    const nLoans    = loans.filter(l => (l.escenarioIds||[]).includes(esc._id)).length;
    const nAmorts   = loans.flatMap(l => l.amortizaciones||[]).filter(a => (a.escenarioIds||[]).includes(esc._id)).length;
    const nExpenses = expenses.filter(e => (e.escenarioIds||[]).includes(esc._id)).length;
    const nNominas  = nominas.filter(n => (n.escenarioIds||[]).includes(esc._id)).length;
    const nAccounts = accounts.filter(a => (a.escenarioIds||[]).includes(esc._id)).length;
    const totalItems = nLoans + nAmorts + nExpenses + nNominas + nAccounts;

    return `
    <div class="card mb-12" style="border-left:3px solid ${color};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${color};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${esc.nombre}</span>
        ${isActive ? `<span class="badge badge-yellow">● Activo</span>` : ''}
        ${esc.fechaFin ? `<span class="badge badge-inactive">📅 ${esc.fechaFin}</span>` : ''}
        <div class="flex gap-8">
          ${!isActive
            ? `<button class="btn-primary btn-sm" onclick="EscenariosModule.activar('${esc._id}')">Activar</button>`
            : `<button class="btn-secondary btn-sm" onclick="EscenariosModule.desactivar()">Desactivar</button>`}
          <button class="btn-secondary btn-sm" onclick="EscenariosModule.openForm('${esc._id}')">Editar</button>
          <button class="btn-danger btn-sm" onclick="EscenariosModule.deleteEscenario('${esc._id}')">✕</button>
        </div>
      </div>
      ${esc.descripcion ? `<div class="text-sm mb-8" style="color:var(--text2)">${esc.descripcion}</div>` : ''}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${totalItems === 0
          ? '<span>Sin elementos asignados. Asígnalos desde Préstamos, Movimientos o Cuentas.</span>'
          : [
              nLoans    > 0 ? `${nLoans} préstamo${nLoans!==1?'s':''}` : '',
              nAmorts   > 0 ? `${nAmorts} amortización${nAmorts!==1?'es':''}` : '',
              nExpenses > 0 ? `${nExpenses} gasto${nExpenses!==1?'s':''}` : '',
              nAccounts > 0 ? `${nAccounts} cuenta${nAccounts!==1?'s':''}` : '',
              nNominas  > 0 ? `${nNominas} nómina${nNominas!==1?'s':''}` : '',
            ].filter(Boolean).join(' · ')}
      </div>
    </div>`;
  }

  // ── Tabla comparativa ────────────────────────────────────────────────────────
  function renderTablaComparativa(escenarios) {
    const config = State.get('config');
    const fechaRef = config.dashboardEnd;

    const base = _extractoParaEscenario(null);
    const saldoBase = _saldoEnFechaArr(base.eventos, fechaRef);

    const rows = escenarios.map(esc => {
      const { eventos, horizonte } = _extractoParaEscenario(esc);
      const fechaComp = esc.fechaFin || fechaRef;
      const saldoEsc = _saldoEnFechaArr(eventos, fechaComp);
      const diff = saldoEsc !== null && saldoBase !== null ? saldoEsc - saldoBase : null;
      const color = esc.color || '#6366f1';
      return `<tr>
        <td style="padding:6px 10px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:6px"></span>
          ${esc.nombre}
        </td>
        <td class="num" style="padding:6px 10px">${fechaComp}</td>
        <td class="num" style="padding:6px 10px">${saldoEsc !== null ? FinanceMath.eur(saldoEsc) : '—'}</td>
        <td class="num ${diff===null?'':diff>=0?'pos':'neg'}" style="padding:6px 10px">
          ${diff === null ? '—' : (diff >= 0 ? '+' : '') + FinanceMath.eur(diff)}
        </td>
      </tr>`;
    }).join('');

    return `
      <div class="card-title" style="margin-bottom:10px">Saldo en fecha objetivo vs base</div>
      <table style="width:100%;font-size:13px;border-collapse:collapse">
        <thead>
          <tr style="color:var(--text2);border-bottom:1px solid var(--border)">
            <th style="text-align:left;padding:6px 10px">Escenario</th>
            <th style="text-align:right;padding:6px 10px">Fecha objetivo</th>
            <th style="text-align:right;padding:6px 10px">Saldo estimado</th>
            <th style="text-align:right;padding:6px 10px">vs Base</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function _saldoEnFechaArr(eventos, fecha) {
    const past = eventos.filter(e => e.fecha <= fecha);
    return past.length > 0 ? past[past.length-1].saldoAcum : null;
  }

  // ── Gráfico de comparación ───────────────────────────────────────────────────
  function renderChart(escenarios) {
    const ctx = document.getElementById('chart-comparacion');
    if (!ctx) return;

    const base = _extractoParaEscenario(null);
    const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316'];
    const datasets = [];

    datasets.push({
      label: 'Base (sin escenario)',
      data: base.eventos.map(e => ({ x: new Date(e.fecha+'T00:00:00').getTime(), y: e.saldoAcum })),
      borderColor: '#6b7280',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderDash: [4,3],
      pointRadius: 0,
      tension: 0.3,
    });

    escenarios.forEach((esc, i) => {
      const { eventos } = _extractoParaEscenario(esc);
      const color = esc.color || COLORS[i % COLORS.length];
      datasets.push({
        label: esc.nombre,
        data: eventos.map(e => ({ x: new Date(e.fecha+'T00:00:00').getTime(), y: e.saldoAcum })),
        borderColor: color,
        backgroundColor: color + '18',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      });
    });

    chartComparacion = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: 'var(--text2)', font: { size: 11 } } },
          tooltip: {
            callbacks: { label: ctx => `${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y)}` },
          },
        },
        scales: {
          x: {
            type: 'time', time: { unit: 'month', displayFormats: { month: 'MMM yy' } },
            ticks: { color: 'var(--text3)', maxTicksLimit: 12 },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            ticks: { color: 'var(--text3)', callback: v => FinanceMath.eur(v) },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
        },
      },
    });
  }

  // ── Activar / desactivar escenario ───────────────────────────────────────────
  function activar(id) {
    const config = State.get('config');
    State.set('config', { ...config, escenarioActivo: id });
    render();
    UI.toast(`Escenario "${escenarioName(id)}" activado`);
  }

  function desactivar() {
    const config = State.get('config');
    State.set('config', { ...config, escenarioActivo: null });
    render();
    UI.toast('Volviendo a realidad base');
  }

  // ── Formulario de escenario ──────────────────────────────────────────────────
  function openForm(id = null) {
    const escenarios = State.get('escenarios') || [];
    const esc = id ? escenarios.find(e => e._id === id) : null;

    const colorOpts = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899'];

    const html = `
      <div class="form-group">
        ${UI.input('esc-nombre', 'Nombre del escenario', 'text', esc?.nombre || '', 'Ej: Amortizo agresivo')}
      </div>
      <div class="form-group mt-8">
        ${UI.input('esc-fecha-fin', 'Fecha objetivo de comparación', 'date', esc?.fechaFin || '')}
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div id="esc-color-picker" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${colorOpts.map(c => `
            <div class="esc-color-opt" data-color="${c}" onclick="EscenariosModule._pickColor('${c}')"
              style="width:26px;height:26px;border-radius:50%;background:${c};cursor:pointer;
                     border:2px solid ${(esc?.color||'#6366f1')===c?'white':'transparent'};transition:border .15s">
            </div>`).join('')}
        </div>
        <input type="hidden" id="esc-color" value="${esc?.color||'#6366f1'}"/>
      </div>
      <div class="form-group mt-8">
        ${UI.input('esc-desc', 'Descripción (opcional)', 'text', esc?.descripcion || '', 'Qué evalúa este escenario')}
      </div>

      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="EscenariosModule.saveForm('${id||''}')">
          ${id ? 'Guardar cambios' : 'Crear escenario'}
        </button>
      </div>`;

    UI.openModal(html, id ? 'Editar escenario' : 'Nuevo escenario');
  }

  function _pickColor(color) {
    document.getElementById('esc-color').value = color;
    document.querySelectorAll('.esc-color-opt').forEach(el => {
      el.style.border = el.dataset.color === color ? '2px solid white' : '2px solid transparent';
    });
  }

  function saveForm(id) {
    const nombre = document.getElementById('esc-nombre')?.value?.trim();
    if (!nombre) { UI.toast('El nombre es obligatorio', 'err'); return; }

    const data = {
      nombre,
      fechaFin:    document.getElementById('esc-fecha-fin')?.value || '',
      color:       document.getElementById('esc-color')?.value || '#6366f1',
      descripcion: document.getElementById('esc-desc')?.value || '',
    };

    if (id) {
      State.updateItem('escenarios', id, data);
      UI.toast('Escenario actualizado');
    } else {
      State.addItem('escenarios', data);
      UI.toast('Escenario creado');
    }
    UI.closeModal();
    render();
  }

  function deleteEscenario(id) {
    if (!UI.confirm('¿Eliminar este escenario? Los items asignados perderán esta asignación.')) return;
    // Remove this id from escenarioIds of all items
    const rmId = items => items.map(i => ({ ...i, escenarioIds: (i.escenarioIds||[]).filter(x => x !== id) }));
    State.set('loans', (State.get('loans')||[]).map(l => ({
      ...rmId([l])[0],
      amortizaciones: rmId(l.amortizaciones||[]),
    })));
    State.set('expenses', rmId(State.get('expenses')||[]));
    State.set('nominas',  rmId(State.get('nominas') ||[]));
    State.set('accounts', rmId(State.get('accounts')||[]));
    const config = State.get('config');
    if (config.escenarioActivo === id) State.set('config', { ...config, escenarioActivo: null });
    State.removeItem('escenarios', id);
    UI.toast('Escenario eliminado');
    render();
  }

  return {
    render, activar, desactivar,
    openForm, saveForm, deleteEscenario,
    escenarioName, checkboxesHtml, readCheckedEscenarios,
    _pickColor,
  };
})();
