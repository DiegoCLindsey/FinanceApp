// Depends on: State, FinanceMath, UI
const EscenariosModule = (() => {
  let chartComparacion = null;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function _uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  function escenarioOptions(includeNone = true) {
    const escenarios = State.get('escenarios') || [];
    const opts = includeNone ? [['', '— Realidad base (sin escenario) —']] : [];
    return opts.concat(escenarios.map(e => [e._id, e.nombre]));
  }

  function escenarioName(id) {
    if (!id) return 'Base';
    const e = (State.get('escenarios')||[]).find(e => e._id === id);
    return e ? e.nombre : id;
  }

  // Runs a full extracto projection for the given escenario (or base if null).
  // Uses config.dashboardStart / dashboardEnd as the projection horizon,
  // then extends to fechaFin if needed.
  function _extractoParaEscenario(esc) {
    const config   = State.get('config');
    const loans    = State.get('loans')    || [];
    const expenses = State.get('expenses') || [];
    const nominas  = State.get('nominas')  || [];
    const accounts = State.get('accounts') || [];
    const inflPeriodos = State.get('inflacion') || [];

    const escId    = esc ? esc._id : null;
    const filtered = FinanceMath.filtrarPorEscenario(loans, expenses, nominas, escId);

    // Extend the projection to cover fechaFin if beyond dashboardEnd
    const horizonte = esc && esc.fechaFin && esc.fechaFin > config.dashboardEnd
      ? esc.fechaFin
      : config.dashboardEnd;
    const cfgExt = { ...config, dashboardEnd: horizonte };

    let eventos = FinanceMath.generarExtracto(
      filtered.loans, filtered.expenses, accounts, cfgExt,
      null, filtered.nominas, inflPeriodos
    );

    // Add scenario-specific investments
    if (esc && esc.inversiones && esc.inversiones.length > 0) {
      const invEvents = FinanceMath.proyectarInversiones(esc.inversiones, config.dashboardStart, horizonte);
      const combined  = [...eventos, ...invEvents].sort((a,b) => a.fecha.localeCompare(b.fecha));
      eventos = FinanceMath.recomputarSaldoAcum(combined, accounts, cfgExt);
    }

    return { eventos, horizonte };
  }

  // Returns the saldo at a given date from an extracto array
  function _saldoEnFecha(eventos, fecha) {
    const past = eventos.filter(e => e.fecha <= fecha);
    return past.length > 0 ? past[past.length-1].saldoAcum : null;
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
               <div style="font-size:13px">Crea un escenario para comparar estrategias: amortizar vs invertir, cambios de vida, etc.</div>
             </div>`
          : escenarios.map(e => renderCard(e, activo)).join('')}
      </div>

      ${escenarios.length > 0 ? `
      <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
      <div class="card" style="padding:16px">
        <canvas id="chart-comparacion" height="220"></canvas>
      </div>` : ''}`;

    document.getElementById('btn-new-esc').onclick = () => openForm();

    if (escenarios.length > 0) {
      setTimeout(() => renderChart(escenarios), 50);
    }
  }

  function renderCard(esc, activo) {
    const isActive = activo === esc._id;
    const invCount = (esc.inversiones||[]).length;
    const color    = esc.color || '#6366f1';

    // Count items tagged to this scenario
    const loans    = State.get('loans')    || [];
    const expenses = State.get('expenses') || [];
    const nominas  = State.get('nominas')  || [];
    const nLoans    = loans.filter(l => l.escenarioId === esc._id).length;
    const nAmorts   = loans.flatMap(l => l.amortizaciones||[]).filter(a => a.escenarioId === esc._id).length;
    const nExpenses = expenses.filter(e => e.escenarioId === esc._id).length;
    const nNominas  = nominas.filter(n => n.escenarioId === esc._id).length;
    const totalItems = nLoans + nAmorts + nExpenses + nNominas + invCount;

    return `
    <div class="card mb-12" style="border-left:3px solid ${color};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${color};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${esc.nombre}</span>
        ${isActive ? `<span class="badge badge-yellow">● Activo</span>` : ''}
        ${esc.fechaFin ? `<span class="badge badge-inactive">📅 ${esc.fechaFin}</span>` : ''}
        <div class="flex gap-8">
          ${!isActive ? `<button class="btn-primary btn-sm" onclick="EscenariosModule.activar('${esc._id}')">Activar</button>` : `<button class="btn-secondary btn-sm" onclick="EscenariosModule.desactivar()">Desactivar</button>`}
          <button class="btn-secondary btn-sm" onclick="EscenariosModule.openForm('${esc._id}')">Editar</button>
          <button class="btn-danger btn-sm" onclick="EscenariosModule.deleteEscenario('${esc._id}')">✕</button>
        </div>
      </div>
      ${esc.descripcion ? `<div class="text-sm mb-8" style="color:var(--text2)">${esc.descripcion}</div>` : ''}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${totalItems === 0
          ? '<span>Sin elementos asignados. Asigna préstamos, gastos o nóminas desde sus módulos.</span>'
          : [
              nLoans    > 0 ? `${nLoans} préstamo${nLoans!==1?'s':''}` : '',
              nAmorts   > 0 ? `${nAmorts} amortización${nAmorts!==1?'es':''}` : '',
              nExpenses > 0 ? `${nExpenses} gasto${nExpenses!==1?'s':''}` : '',
              nNominas  > 0 ? `${nNominas} nómina${nNominas!==1?'s':''}` : '',
              invCount  > 0 ? `${invCount} inversión${invCount!==1?'es':''}` : '',
            ].filter(Boolean).join(' · ')}
      </div>
    </div>`;
  }

  // ── Gráfico de comparación ───────────────────────────────────────────────────
  function renderChart(escenarios) {
    const ctx = document.getElementById('chart-comparacion');
    if (!ctx) return;

    const config = State.get('config') || {};

    // Base extracto
    const base = _extractoParaEscenario(null);

    const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316'];
    const datasets = [];

    // Base line
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

    // One line per scenario
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
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${FinanceMath.eur(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            type: 'time', time: { unit: 'month', displayFormats: { month: 'MMM yy' } },
            ticks: { color: 'var(--text3)', maxTicksLimit: 12 },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            ticks: {
              color: 'var(--text3)',
              callback: v => FinanceMath.eur(v),
            },
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
    const inversiones = esc ? (esc.inversiones || []) : [];

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

      <div class="card-title mt-16" style="margin-bottom:8px">Inversiones del escenario</div>
      <div id="esc-inversiones-list">
        ${inversiones.map((inv, i) => renderInvRow(inv, i)).join('') || '<div class="text-sm" style="color:var(--text3);padding:8px 0">Sin inversiones. Añade una abajo.</div>'}
      </div>
      <button class="btn-secondary btn-sm mt-8" onclick="EscenariosModule._addInv()">+ Añadir inversión</button>

      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="EscenariosModule.saveForm('${id||''}')">
          ${id ? 'Guardar cambios' : 'Crear escenario'}
        </button>
      </div>`;

    UI.openModal(html, id ? 'Editar escenario' : 'Nuevo escenario');
  }

  function renderInvRow(inv, i) {
    const accounts = State.get('accounts') || [];
    const cuentaOpts = accounts.filter(a => a.activo).map(a => `<option value="${a._id}" ${inv.cuenta===a._id?'selected':''}>${a.nombre}</option>`).join('');
    return `
    <div class="card mb-8 esc-inv-row" data-inv-i="${i}" style="padding:10px 12px;background:var(--bg2)">
      <div class="flex gap-8 items-center mb-8">
        <span style="font-size:12px;font-weight:600;color:var(--accent);flex:1">Inversión ${i+1}</span>
        <button class="btn-danger btn-sm" onclick="EscenariosModule._removeInv(${i})">✕</button>
      </div>
      <div class="grid-2" style="gap:8px">
        <div>${UI.input(`inv-nombre-${i}`, 'Nombre', 'text', inv.nombre||'', 'Ej: Fondo indexado')}</div>
        <div>
          <label class="form-label">Tipo</label>
          <select id="inv-tipo-${i}" class="form-input" onchange="EscenariosModule._refreshInvRow(${i})">
            <option value="capital_inicial"  ${inv.tipo==='capital_inicial'?'selected':''}>Capital inicial</option>
            <option value="aportacion_periodica" ${inv.tipo==='aportacion_periodica'?'selected':''}>Aportación periódica</option>
          </select>
        </div>
        <div>${UI.input(`inv-importe-${i}`, inv.tipo==='aportacion_periodica'?'Aportación mensual (€)':'Capital inicial (€)', 'number', inv.importe||'', '10000')}</div>
        <div>${UI.input(`inv-tir-${i}`, 'TIR anual (%)', 'number', inv.tir||'', '7')}</div>
        <div>${UI.input(`inv-inicio-${i}`, 'Inicio', 'date', inv.inicio||'')}</div>
        <div>${UI.input(`inv-fin-${i}`, 'Fin', 'date', inv.fin||'')}</div>
        <div>
          <label class="form-label">Cuenta</label>
          <select id="inv-cuenta-${i}" class="form-input">${cuentaOpts}</select>
        </div>
      </div>
    </div>`;
  }

  function _pickColor(color) {
    document.getElementById('esc-color').value = color;
    document.querySelectorAll('.esc-color-opt').forEach(el => {
      el.style.border = el.dataset.color === color ? '2px solid white' : '2px solid transparent';
    });
  }

  function _addInv() {
    const rows = document.querySelectorAll('.esc-inv-row');
    const newInv = { _id: _uid(), tipo: 'capital_inicial', nombre: '', importe: 0, tir: 7, inicio: '', fin: '', cuenta: 'default' };
    const i = rows.length;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderInvRow(newInv, i);
    document.getElementById('esc-inversiones-list').appendChild(wrapper.firstElementChild);
  }

  function _removeInv(i) {
    document.querySelector(`.esc-inv-row[data-inv-i="${i}"]`)?.remove();
    // Re-index
    document.querySelectorAll('.esc-inv-row').forEach((el, j) => el.dataset.invI = j);
  }

  function _refreshInvRow(i) {
    const tipo  = document.getElementById(`inv-tipo-${i}`)?.value;
    const label = document.getElementById(`inv-importe-${i}`)?.previousElementSibling;
    if (label) label.textContent = tipo === 'aportacion_periodica' ? 'Aportación mensual (€)' : 'Capital inicial (€)';
  }

  function _readInversiones() {
    const rows = document.querySelectorAll('.esc-inv-row');
    const inversiones = [];
    rows.forEach((el, i) => {
      inversiones.push({
        _id:     _uid(),
        nombre:  document.getElementById(`inv-nombre-${i}`)?.value || '',
        tipo:    document.getElementById(`inv-tipo-${i}`)?.value || 'capital_inicial',
        importe: parseFloat(document.getElementById(`inv-importe-${i}`)?.value) || 0,
        tir:     parseFloat(document.getElementById(`inv-tir-${i}`)?.value) || 0,
        inicio:  document.getElementById(`inv-inicio-${i}`)?.value || '',
        fin:     document.getElementById(`inv-fin-${i}`)?.value || '',
        cuenta:  document.getElementById(`inv-cuenta-${i}`)?.value || 'default',
      });
    });
    return inversiones;
  }

  function saveForm(id) {
    const nombre = document.getElementById('esc-nombre')?.value?.trim();
    if (!nombre) { UI.toast('El nombre es obligatorio', 'err'); return; }

    const data = {
      nombre,
      fechaFin:    document.getElementById('esc-fecha-fin')?.value || '',
      color:       document.getElementById('esc-color')?.value || '#6366f1',
      descripcion: document.getElementById('esc-desc')?.value || '',
      inversiones: _readInversiones(),
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
    if (!UI.confirm('¿Eliminar este escenario? Los items asignados a él permanecerán pero perderán su asignación.')) return;
    // Clear escenarioId from items that referenced this scenario
    const loans = State.get('loans') || [];
    State.set('loans', loans.map(l => ({
      ...l,
      escenarioId: l.escenarioId === id ? null : l.escenarioId,
      amortizaciones: (l.amortizaciones||[]).map(a => ({ ...a, escenarioId: a.escenarioId === id ? null : a.escenarioId })),
    })));
    const expenses = State.get('expenses') || [];
    State.set('expenses', expenses.map(e => ({ ...e, escenarioId: e.escenarioId === id ? null : e.escenarioId })));
    const nominas = State.get('nominas') || [];
    State.set('nominas', nominas.map(n => ({ ...n, escenarioId: n.escenarioId === id ? null : n.escenarioId })));
    // If this was the active scenario, deactivate
    const config = State.get('config');
    if (config.escenarioActivo === id) State.set('config', { ...config, escenarioActivo: null });
    State.removeItem('escenarios', id);
    UI.toast('Escenario eliminado');
    render();
  }

  // ── Selector HTML reutilizable por otros módulos ─────────────────────────────
  // Renders a <select> for assigning an item to a scenario.
  function selectHtml(fieldId, currentValue) {
    const opts = escenarioOptions(true);
    const optsHtml = opts.map(([v, l]) => `<option value="${v}" ${currentValue===v?'selected':''}>${l}</option>`).join('');
    return `<div>
      <label class="form-label">Escenario</label>
      <select id="${fieldId}" class="form-input">${optsHtml}</select>
    </div>`;
  }

  return {
    render, activar, desactivar,
    openForm, saveForm, deleteEscenario,
    escenarioOptions, escenarioName, selectHtml,
    _pickColor, _addInv, _removeInv, _refreshInvRow,
  };
})();
