// Depends on: State, FinanceMath, UI
const NominasModule = (() => {

  function render() {
    const view    = document.getElementById('view-nominas');
    const config  = State.get('config');
    const tramos  = FinanceMath.tramosIRPFParaAño(new Date().getFullYear());
    const inflacionPeriodos = State.get('inflacion') || [];

    // Sort all nominas by bruto descending
    const nominas = [...(State.get('nominas') || [])].sort((a, b) => (b.bruto || 0) - (a.bruto || 0));

    // Group nominas by grupoNomina (empty = standalone)
    const grupos = {};
    const standalone = [];
    for (const n of nominas) {
      const g = n.grupoNomina || '';
      if (!g) { standalone.push(n); continue; }
      if (!grupos[g]) grupos[g] = [];
      grupos[g].push(n);
    }

    // Helper: marginal IRPF for a nómina within its group (considers all higher brutos in group)
    function irpfMarginal(nom, grupoNoms) {
      const bruto = nom.bruto || 0;
      if (nom.irpfModo === 'manual') return bruto * ((nom.irpfPct || 0) / 100);
      const baseAcum = (grupoNoms || [])
        .filter(n => n._id !== nom._id && (n.bruto || 0) > bruto)
        .reduce((s, n) => s + (n.bruto || 0), 0);
      return FinanceMath.calcIRPF(baseAcum + bruto, tramos) - FinanceMath.calcIRPF(baseAcum, tramos);
    }

    // Render a group block with summary header + individual rows
    function renderGrupo(nombre, noms) {
      const totalBruto = noms.reduce((s, n) => s + (n.bruto || 0), 0);
      // IRPF total using group stacking
      const irpfTotal = (() => {
        const sorted = [...noms].sort((a, b) => (b.bruto || 0) - (a.bruto || 0));
        let base = 0, total = 0;
        for (const n of sorted) {
          if (n.irpfModo === 'manual') { total += (n.bruto || 0) * ((n.irpfPct || 0) / 100); base += (n.bruto || 0); continue; }
          const b = n.bruto || 0;
          total += FinanceMath.calcIRPF(base + b, tramos) - FinanceMath.calcIRPF(base, tramos);
          base  += b;
        }
        return total;
      })();
      const irpfPct = totalBruto > 0 ? (irpfTotal / totalBruto * 100) : 0;
      return `
        <div style="margin-bottom:16px">
          <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
            <span style="font-weight:600;font-size:13px">Grupo: ${nombre}</span>
            <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${FinanceMath.eur(totalBruto)}</strong></span>
            <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${irpfPct.toFixed(1)}%</strong> (${FinanceMath.eur(irpfTotal)}/año)</span>
          </div>
          <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
            ${noms.map(n => renderRow(n, tramos, noms)).join('')}
          </div>
        </div>`;
    }

    const gruposHTML = Object.entries(grupos).map(([g, noms]) => renderGrupo(g, noms)).join('');
    const standaloneHTML = standalone.length > 0 ? `
      <div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
        <div class="exp-table-head">
          <span class="exp-col-head">Concepto</span>
          <span class="exp-col-head">Bruto anual</span>
          <span class="exp-col-head">Pagas</span>
          <span class="exp-col-head">IRPF efectivo</span>
          <span class="exp-col-head">Modo</span>
          <span class="exp-col-head exp-col-hide">Cuenta</span>
          <span></span>
        </div>
        ${standalone.map(n => renderRow(n, tramos, null)).join('')}
      </div>` : '';

    const inflMsg = inflacionPeriodos.length > 0
      ? `<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>`
      : '';

    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" id="btn-new-pension">+ Nuevo plan de pensiones</button>
          <button class="btn-primary" id="btn-new-nomina">+ Nueva nómina</button>
        </div>
      </div>
      ${inflMsg}
      ${nominas.length === 0 ? '<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>' : ''}
      ${gruposHTML}
      ${standaloneHTML}

      <div class="page-header" style="margin-top:8px">
        <h2 class="page-title" style="font-size:1.1rem">Configuración IRPF</h2>
        <button class="btn-secondary btn-sm" id="btn-edit-tramos">Editar tramos</button>
      </div>
      <div class="card" style="padding:16px">
        <table style="width:100%;font-size:13px;border-collapse:collapse">
          <thead><tr style="color:var(--text2)"><th style="text-align:left;padding:4px 8px">Desde (€)</th><th style="text-align:left;padding:4px 8px">Tipo (%)</th></tr></thead>
          <tbody>
            ${tramos.map(([min,tipo]) => `<tr><td style="padding:4px 8px">${FinanceMath.eur(min)}</td><td style="padding:4px 8px">${tipo}%</td></tr>`).join('')}
          </tbody>
        </table>
        <p class="text-sm" style="margin-top:12px;color:var(--text2)">Si no hay tramos configurados, se usan los oficiales de España 2024.</p>
      </div>

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales). Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div id="pensiones-list">${_renderPensionesSection(tramos, nominas)}</div>`;

    document.getElementById('btn-new-nomina').onclick  = () => openForm();
    document.getElementById('btn-edit-tramos').onclick = () => openTramosForm();
    document.getElementById('btn-new-pension').onclick = () => openPensionForm();
    (State.get('accounts')||[]).filter(a=>(a.modeloFondo||(a.esFondoPension?'pension':'cuenta'))==='pension').forEach(p => {
      view.querySelector(`[data-edit-pen="${p._id}"]`)?.addEventListener('click', () => openPensionForm(p._id));
      view.querySelector(`[data-del-pen="${p._id}"]`)?.addEventListener('click', () => deletePension(p._id));
    });

    nominas.forEach(n => {
      const be = view.querySelector(`[data-edit-nom="${n._id}"]`); if (be) be.onclick = () => openForm(n._id);
      const bd = view.querySelector(`[data-del-nom="${n._id}"]`);  if (bd) bd.onclick = () => deleteNomina(n._id);
      const tog = view.querySelector(`[data-tog-nom="${n._id}"]`); if (tog) tog.onchange = e => { State.updateItem('nominas', n._id, {activo: e.target.checked}); render(); };
    });
  }

  function renderRow(n, tramos, grupoNoms) {
    const brutoAnual = n.bruto || 0;
    const nPagas = n.nPagas || 12;
    const irpfAnual = (() => {
      if (n.irpfModo === 'manual') return brutoAnual * ((n.irpfPct || 0) / 100);
      if (grupoNoms) {
        const baseAcum = grupoNoms
          .filter(m => m._id !== n._id && (m.bruto || 0) > brutoAnual)
          .reduce((s, m) => s + (m.bruto || 0), 0);
        return FinanceMath.calcIRPF(baseAcum + brutoAnual, tramos) - FinanceMath.calcIRPF(baseAcum, tramos);
      }
      return FinanceMath.calcIRPF(brutoAnual, tramos);
    })();
    const irpfPct = brutoAnual > 0 ? (irpfAnual / brutoAnual * 100) : 0;
    const modoBadge = n.representacion === 'simplificado'
      ? `<span class="badge badge-orange">Simplificado</span>`
      : `<span class="badge badge-purple">Detallado</span>`;
    const ipcBadge = n.mesActualizacionIPC
      ? `<span class="badge badge-blue" title="Actualización IPC en mes ${n.mesActualizacionIPC}">IPC m${n.mesActualizacionIPC}</span>`
      : '';
    const varianzaBadge = n.varianza > 0
      ? `<span class="badge" style="background:rgba(100,200,255,0.1);color:var(--accent)">±${n.varianza}% MC</span>`
      : '';
    return `<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${n.nombre || '—'}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${ipcBadge}${varianzaBadge}</div>
      </div>
      <div class="num">${FinanceMath.eur(brutoAnual)}<div class="text-sm" style="color:var(--text2)">${FinanceMath.eur(brutoAnual/nPagas)}/paga</div></div>
      <div class="text-sm">${nPagas} pagas</div>
      <div class="text-sm ${grupoNoms && n.irpfModo !== 'manual' ? 'neg' : ''}">${n.irpfModo === 'manual' ? n.irpfPct+'% (manual)' : irpfPct.toFixed(1)+'% (auto)'}${grupoNoms && n.irpfModo !== 'manual' ? ' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>' : ''}</div>
      <div>${modoBadge}</div>
      <div class="text-sm exp-col-hide">${State.accountName(n.cuenta||'default')}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-tog-nom="${n._id}" ${n.activo!==false?'checked':''}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-edit-nom="${n._id}"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-del-nom="${n._id}">✕</button>
      </div>
    </div>`;
  }

  function openForm(id = null) {
    const n = id ? (State.get('nominas') || []).find(x => x._id === id) : null;
    const meses = ['', 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const html = `
      <div class="grid-2">
        ${UI.input('nf-nombre', 'Nombre / Empresa', 'text', n?.nombre||'', 'Ej: Empresa S.A.')}
        ${UI.input('nf-bruto', 'Bruto anual (€)', 'number', n?.bruto||'', '30000')}
      </div>
      <div class="grid-2 mt-8">
        ${UI.input('nf-grupo', 'Grupo (opcional)', 'text', n?.grupoNomina||'', 'Ej: Empresa principal')}
        <div class="form-group">
          <label class="form-label">Mes actualización IPC (opcional)</label>
          <select class="form-select" id="nf-mes-ipc">
            <option value="">Sin ajuste IPC</option>
            ${meses.slice(1).map((m,i)=>`<option value="${i+1}" ${(n?.mesActualizacionIPC)===(i+1)?'selected':''}>${m} (${i+1})</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        <div class="form-group">
          <label class="form-label">Número de pagas</label>
          <select class="form-select" id="nf-npagas">
            ${[12,14,16].map(v=>`<option value="${v}" ${(n?.nPagas||12)===v?'selected':''}>${v} pagas</option>`).join('')}
            <option value="custom" ${![12,14,16].includes(n?.nPagas||12)?'selected':''}>Personalizado</option>
          </select>
        </div>
        <div class="form-group" id="nf-custom-pagas-wrap" style="${![12,14,16].includes(n?.nPagas||12)?'':'display:none'}">
          <label class="form-label">Nº pagas (personalizado)</label>
          <input class="form-input" type="number" id="nf-npagas-custom" min="1" max="24" value="${n?.nPagas||12}"/>
        </div>
        <div class="form-group">
          <label class="form-label">Modo IRPF</label>
          <select class="form-select" id="nf-irpfmodo">
            <option value="auto" ${(n?.irpfModo||'auto')==='auto'?'selected':''}>Auto (tramos)</option>
            <option value="manual" ${n?.irpfModo==='manual'?'selected':''}>Manual (%)</option>
          </select>
        </div>
      </div>
      <div id="nf-irpfpct-wrap" class="mt-8" style="${n?.irpfModo==='manual'?'':'display:none'}">
        ${UI.input('nf-irpfpct', 'Retención IRPF (%)', 'number', n?.irpfPct||0, '20')}
      </div>
      <div class="grid-2 mt-8">
        <div class="form-group">
          <label class="form-label">Representación en predicciones</label>
          <select class="form-select" id="nf-representacion">
            <option value="detallado" ${(n?.representacion||'detallado')==='detallado'?'selected':''}>Detallado (bruto + gasto IRPF)</option>
            <option value="simplificado" ${n?.representacion==='simplificado'?'selected':''}>Simplificado (neto directo)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Varianza ± % (Monte Carlo)</label>
          <input class="form-input" type="number" id="nf-varianza" value="${n?.varianza||0}" min="0" max="100" placeholder="0"/>
          <div class="text-sm mt-4" style="color:var(--text3)">Desviación estándar del bruto en MC</div>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${UI.input('nf-fecha-ini', 'Fecha inicio', 'date', n?.fechaInicio||new Date().toISOString().slice(0,10))}
        ${UI.input('nf-fecha-fin', 'Fecha fin (opcional)', 'date', n?.fechaFin||'')}
      </div>
      <div class="mt-8">${UI.accountSelect('nf-cuenta', 'Cuenta', n?.cuenta||State.getPrincipalAccountId())}</div>
      ${EscenariosModule.checkboxesHtml(n?.escenarioIds||[])}
      <div id="nf-preview" class="card mt-16" style="background:var(--surface2);padding:12px;font-size:13px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="NominasModule.saveNomina('${id||''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id ? 'Editar nómina' : 'Nueva nómina');
    setTimeout(() => {
      const updatePreview = () => {
        const bruto = parseFloat(document.getElementById('nf-bruto')?.value) || 0;
        const npagasSel = document.getElementById('nf-npagas')?.value;
        const nPagas = npagasSel === 'custom'
          ? (parseInt(document.getElementById('nf-npagas-custom')?.value) || 12)
          : parseInt(npagasSel) || 12;
        const irpfModo = document.getElementById('nf-irpfmodo')?.value;
        const config = State.get('config');
        const tramos = config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]];
        const irpfAnual = irpfModo === 'manual'
          ? bruto * ((parseFloat(document.getElementById('nf-irpfpct')?.value)||0) / 100)
          : FinanceMath.calcIRPF(bruto, tramos);
        const netoAnual = bruto - irpfAnual;
        const brutoPorPaga = bruto / nPagas;
        const irpfPorPaga  = irpfAnual / nPagas;
        const netoPorPaga  = brutoPorPaga - irpfPorPaga;
        const repr = document.getElementById('nf-representacion')?.value;
        const grupo = document.getElementById('nf-grupo')?.value.trim();
        // Show group hint if other nominas in same group exist
        const otrasEnGrupo = grupo ? (State.get('nominas') || []).filter(m => m.grupoNomina === grupo && m._id !== (id||'')) : [];
        const grupoHint = grupo && otrasEnGrupo.length > 0
          ? `<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${grupo}" con ${otrasEnGrupo.map(m=>m.nombre).join(', ')} — IRPF calculado al tipo marginal.</div>`
          : '';
        const box = document.getElementById('nf-preview');
        if (box) box.innerHTML = `
          <strong>Vista previa</strong>
          <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
            <span style="color:var(--text2)">Bruto anual:</span><span>${FinanceMath.eur(bruto)}</span>
            <span style="color:var(--text2)">IRPF anual:</span><span class="neg">${FinanceMath.eur(irpfAnual)} (${bruto>0?(irpfAnual/bruto*100).toFixed(1):0}%)</span>
            <span style="color:var(--text2)">Neto anual:</span><span class="pos">${FinanceMath.eur(netoAnual)}</span>
            <span style="color:var(--text2)">Bruto/paga:</span><span>${FinanceMath.eur(brutoPorPaga)}</span>
            <span style="color:var(--text2)">IRPF/paga:</span><span class="neg">${FinanceMath.eur(irpfPorPaga)}</span>
            <span style="color:var(--text2)">En predicciones:</span><span>${repr==='simplificado' ? `ingreso ${FinanceMath.eur(netoPorPaga)}/paga` : `ingreso ${FinanceMath.eur(brutoPorPaga)} + gasto IRPF ${FinanceMath.eur(irpfPorPaga)}`}</span>
          </div>${grupoHint}`;
      };
      ['nf-bruto','nf-irpfpct','nf-npagas-custom','nf-grupo'].forEach(id => document.getElementById(id)?.addEventListener('input', updatePreview));
      ['nf-npagas','nf-irpfmodo','nf-representacion'].forEach(id => document.getElementById(id)?.addEventListener('change', () => {
        const npagasSel = document.getElementById('nf-npagas')?.value;
        document.getElementById('nf-custom-pagas-wrap').style.display = npagasSel === 'custom' ? '' : 'none';
        document.getElementById('nf-irpfpct-wrap').style.display = document.getElementById('nf-irpfmodo')?.value === 'manual' ? '' : 'none';
        updatePreview();
      }));
      updatePreview();
    }, 50);
  }

  function saveNomina(id) {
    const npagasSel = document.getElementById('nf-npagas').value;
    const nPagas = npagasSel === 'custom'
      ? (parseInt(document.getElementById('nf-npagas-custom').value) || 12)
      : parseInt(npagasSel) || 12;
    const mesIPC = parseInt(document.getElementById('nf-mes-ipc').value) || null;
    const nom = {
      nombre:           document.getElementById('nf-nombre').value.trim(),
      bruto:            parseFloat(document.getElementById('nf-bruto').value) || 0,
      nPagas,
      irpfModo:         document.getElementById('nf-irpfmodo').value,
      irpfPct:          parseFloat(document.getElementById('nf-irpfpct')?.value) || 0,
      representacion:   document.getElementById('nf-representacion').value,
      fechaInicio:      document.getElementById('nf-fecha-ini').value,
      fechaFin:         document.getElementById('nf-fecha-fin').value || null,
      cuenta:           document.getElementById('nf-cuenta').value,
      activo:           true,
      tags:             ['nomina'],
      grupoNomina:      document.getElementById('nf-grupo').value.trim(),
      mesActualizacionIPC: mesIPC,
      varianza:         parseFloat(document.getElementById('nf-varianza').value) || 0,
      escenarioIds:     EscenariosModule.readCheckedEscenarios(),
    };
    if (!nom.nombre || nom.bruto <= 0) { UI.toast('Nombre y bruto anual son obligatorios', 'err'); return; }
    if (id) { State.updateItem('nominas', id, nom); UI.toast('Nómina actualizada'); }
    else     { State.addItem('nominas', nom); UI.toast('Nómina creada'); }
    UI.closeModal();
    render();
  }

  function deleteNomina(id) {
    if (!UI.confirm('¿Eliminar esta nómina?')) return;
    State.removeItem('nominas', id);
    UI.toast('Eliminada');
    render();
  }

  let _irpfEditYear = null;
  let _irpfEditRows = [];

  function openTramosForm(añoEdit) {
    _irpfEditYear = (añoEdit === undefined) ? null : añoEdit;
    const config    = State.get('config');
    const historico = State.get('tramosIRPFHistorico') || [];

    if (_irpfEditYear === null) {
      // ── VISTA LISTA ───────────────────────────────────────────────────────────
      const sorted    = [...historico].sort((a,b) => a.año - b.año);
      const defTramos = config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]];
      const _label    = t => t.slice(0,3).map(([,p])=>`${p}%`).join(' · ') + (t.length > 3 ? ' …' : '');
      const rowStyle  = 'display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center';
      const html = `
        <div class="text-sm mb-12" style="color:var(--text2)">
          Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
          Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
        </div>
        <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
          <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
            <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
          </div>
          <div style="${rowStyle}">
            <span style="font-weight:600;font-size:13px">Por defecto</span>
            <span class="text-sm" style="color:var(--text2)">${_label(defTramos)}</span>
            <button class="btn-secondary btn-sm" onclick="NominasModule.openTramosForm('default')">Editar</button>
          </div>
          ${sorted.map(e => `
          <div style="${rowStyle}">
            <span style="font-weight:600;font-size:13px">${e.año}</span>
            <span class="text-sm" style="color:var(--text2)">${_label(e.tramos)}</span>
            <div class="flex gap-6">
              <button class="btn-secondary btn-sm" onclick="NominasModule.openTramosForm(${e.año})">Editar</button>
              <button class="btn-danger btn-sm" onclick="NominasModule._irpfDeleteYear(${e.año})">✕</button>
            </div>
          </div>`).join('')}
        </div>
        <div class="flex gap-8 items-center mt-4">
          <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${new Date().getFullYear()})" style="width:130px;flex:none" min="2000" max="2100"/>
          <button class="btn-secondary" onclick="NominasModule._irpfAddYear()">+ Añadir tabla para año</button>
        </div>
        <div class="flex gap-8 mt-16" style="justify-content:flex-end">
          <button class="btn-secondary" onclick="UI.closeModal()">Cerrar</button>
        </div>`;
      UI.openModal(html, 'Tramos IRPF por ejercicio');
    } else {
      // ── VISTA EDITOR ─────────────────────────────────────────────────────────
      const isDefault = _irpfEditYear === 'default';
      if (isDefault) {
        _irpfEditRows = (config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]]).map(t=>[...t]);
      } else {
        const entry = historico.find(e => e.año === _irpfEditYear);
        _irpfEditRows = (entry ? entry.tramos : (config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]])).map(t=>[...t]);
      }
      const label = isDefault ? 'tabla por defecto' : `ejercicio ${_irpfEditYear}`;
      const html = `
        <button class="btn-secondary btn-sm mb-12" onclick="NominasModule.openTramosForm()">← Volver a la lista</button>
        <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${label}. Orden ascendente por base imponible.</div>
        <div id="irpf-tramos-rows">${_irpfRowsHtml()}</div>
        <button class="btn-secondary btn-sm mt-8" onclick="NominasModule._addTramo()">+ Añadir tramo</button>
        <div class="flex gap-8 mt-16" style="justify-content:flex-end">
          <button class="btn-secondary" onclick="NominasModule.openTramosForm()">Cancelar</button>
          <button class="btn-primary" onclick="NominasModule._saveTramos()">Guardar</button>
        </div>`;
      UI.openModal(html, `Tramos IRPF — ${isDefault ? 'Por defecto' : _irpfEditYear}`);
    }
  }

  function _irpfRowsHtml() {
    return _irpfEditRows.map((t, i) => `
      <div class="grid-2 mt-8">
        <input class="form-input" type="number" id="tr-min-${i}" value="${t[0]}" placeholder="Desde €" min="0"/>
        <div class="flex gap-8">
          <input class="form-input" type="number" id="tr-pct-${i}" value="${t[1]}" placeholder="%" min="0" max="100" style="flex:1"/>
          <button class="btn-danger" onclick="NominasModule._removeTramo(${i})">✕</button>
        </div>
      </div>`).join('');
  }

  function _collectTramos() {
    const rows = []; let i = 0;
    while (document.getElementById(`tr-min-${i}`)) {
      rows.push([parseFloat(document.getElementById(`tr-min-${i}`).value)||0, parseFloat(document.getElementById(`tr-pct-${i}`).value)||0]);
      i++;
    }
    return rows;
  }

  function _removeTramo(i) {
    _irpfEditRows = _collectTramos(); _irpfEditRows.splice(i, 1);
    document.getElementById('irpf-tramos-rows').innerHTML = _irpfRowsHtml();
  }

  function _addTramo() {
    _irpfEditRows = _collectTramos(); _irpfEditRows.push([0, 0]);
    document.getElementById('irpf-tramos-rows').innerHTML = _irpfRowsHtml();
  }

  function _irpfAddYear() {
    const año = parseInt(document.getElementById('irpf-new-year')?.value);
    if (!año || año < 2000 || año > 2100) { UI.toast('Año inválido','err'); return; }
    const historico = State.get('tramosIRPFHistorico') || [];
    if (historico.find(e => e.año === año)) { UI.toast('Ya existe una tabla para ese año','err'); return; }
    const defTramos = (State.get('config').tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]]).map(t=>[...t]);
    State.set('tramosIRPFHistorico', [...historico, { _id: Date.now().toString(36), año, tramos: defTramos }]);
    openTramosForm(año);
  }

  function _irpfDeleteYear(año) {
    State.set('tramosIRPFHistorico', (State.get('tramosIRPFHistorico')||[]).filter(e => e.año !== año));
    UI.toast(`Tabla ${año} eliminada`);
    openTramosForm();
  }

  function _saveTramos() {
    const tramos = _collectTramos().sort((a,b)=>a[0]-b[0]);
    if (!tramos.length) { UI.toast('Añade al menos un tramo','err'); return; }
    if (_irpfEditYear === 'default') {
      State.set('config', { ...State.get('config'), tramos_irpf: tramos });
      UI.toast('Tabla por defecto guardada');
    } else {
      const historico = (State.get('tramosIRPFHistorico')||[]).map(e => e.año === _irpfEditYear ? {...e, tramos} : e);
      State.set('tramosIRPFHistorico', historico);
      UI.toast(`Tabla ${_irpfEditYear} guardada`);
    }
    openTramosForm();
  }

  // ── Planes de pensiones ──────────────────────────────────────────────────────
  function _renderPensionesSection(tramos, nominasActivas) {
    const planes = (State.get('accounts')||[]).filter(a => {
      const m = a.modeloFondo || (a.esFondoPension ? 'pension' : 'cuenta');
      return m === 'pension';
    });
    if (planes.length === 0) {
      return `<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
        Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
      </div>`;
    }
    return `<div class="grid-3">${planes.map(p => _renderPensionCard(p, tramos, nominasActivas)).join('')}</div>`;
  }

  function _renderPensionCard(p, tramos, nominasActivas) {
    const pension = FinanceMath.calcFondosPension(p);
    if (!pension) return '';
    const tipoEf = FinanceMath.calcTipoMarginalPension(p, nominasActivas, tramos);
    const tipoLabel = p.grupoNomina
      ? `Tipo marginal grupo "${p.grupoNomina}": ${tipoEf}%`
      : `Tipo fijo configurado: ${p.impuestoRetirada || 0}%`;
    const hoy = new Date();
    const inicioAnyo = `${hoy.getFullYear()}-01-01`;
    const aportEsteAnyo = (p.aportaciones||[]).filter(a=>a.fecha>=inicioAnyo).reduce((s,a)=>s+a.cantidad,0);
    const LIMITE = 1500;
    const ahorro = Math.min(aportEsteAnyo, LIMITE) * (tipoEf / 100);
    return `
      <div class="card">
        <div class="flex justify-between items-center mb-10">
          <div class="flex gap-8 items-center" style="flex-wrap:wrap">
            <span class="card-title" style="margin:0">${p.nombre}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
            ${p.grupoNomina ? `<span class="badge badge-blue">Grupo: ${p.grupoNomina}</span>` : ''}
          </div>
          <div class="flex gap-8">
            <button class="btn-icon" data-edit-pen="${p._id}"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
            <button class="btn-danger btn-sm" data-del-pen="${p._id}">✕</button>
          </div>
        </div>
        <div class="grid-2" style="gap:6px;margin-bottom:8px">
          <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${FinanceMath.eur(pension.saldo)}</div></div>
          <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${FinanceMath.eur(pension.costBase)}</div></div>
        </div>
        <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${pension.beneficio>=0?'pos':'neg'}">${FinanceMath.eur(pension.beneficio)}</span></div>
        <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${FinanceMath.eur(pension.disponible)}</span></div>
        <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${FinanceMath.eur(pension.bloqueado)}</span></div>
        <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
          <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${hoy.getFullYear()}</div>
          <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${aportEsteAnyo>LIMITE?'neg':''}">${FinanceMath.eur(aportEsteAnyo)}</span></div>
          <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${FinanceMath.eur(ahorro)}</span></div>
        </div>
        <div style="margin-top:6px;font-size:11px;color:var(--text3)">${tipoLabel}</div>
        ${pension.proxDesbloqueo ? `<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${pension.proxDesbloqueo}</div>` : ''}
      </div>`;
  }

  let _editPensionPlan = [];

  function openPensionForm(id = null) {
    const acc = id ? (State.get('accounts')||[]).find(a=>a._id===id) : null;
    const config = State.get('config');
    const hist = [...(acc?.historicoSaldos||[])].sort((a,b)=>b.fecha.localeCompare(a.fecha));
    const saldoActual = hist[0] ? hist[0].saldo : (acc?.saldo??0);
    _editPensionPlan = [...(acc?.planAportaciones||[])];

    // Distinct grupos from nóminas
    const grupos = [...new Set((State.get('nominas')||[]).filter(n=>n.grupoNomina).map(n=>n.grupoNomina))];
    const grupoOpts = grupos.map(g => `<option value="${g}" ${acc?.grupoNomina===g?'selected':''}>${g}</option>`).join('');
    const usaGrupo = !!acc?.grupoNomina;

    const html = `
      <div class="grid-2">
        ${UI.input('pen-nombre','Nombre del plan','text',acc?.nombre||'','Ej: Plan de Pensiones ING')}
        ${UI.input('pen-saldo','Saldo actual (€)','number',saldoActual,'5000')}
      </div>
      <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
      <div class="grid-2 mt-8">
        ${UI.input('pen-saldo-ini','Saldo inicial (€)','number',acc?.saldoInicial??0,'0')}
        ${UI.input('pen-fecha-ini','Fecha saldo inicial','date',acc?.fechaInicialSaldo||new Date().toISOString().slice(0,10))}
      </div>
      <div class="grid-2 mt-8">
        ${UI.input('pen-interes','Rentabilidad anual (%)','number',acc?.interes??0,'4')}
        ${UI.select('pen-periodo','Capitalización',[['diario','Diario'],['mensual','Mensual'],['anual','Anual']],acc?.periodoCobro||'mensual')}
      </div>
      <div class="grid-2 mt-8">
        ${UI.input('pen-bloqueo','Bloqueo (meses)','number',acc?.bloqueoMeses??120,'120')}
        <div id="pen-impuesto-wrap" style="${usaGrupo?'display:none':''}">
          ${UI.input('pen-impuesto','% impuesto retirada (fijo)','number',acc?.impuestoRetirada??0,'24')}
        </div>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Grupo (para IRPF marginal real)</label>
        <select class="form-select" id="pen-grupo" onchange="document.getElementById('pen-impuesto-wrap').style.display=this.value?'none':''">
          <option value="">Sin grupo — usar tipo fijo</option>
          ${grupoOpts}
        </select>
        ${grupos.length===0 ? '<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>' : ''}
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Aportaciones programadas</label>
        <div id="pen-aport-container">${_pensionPlanHtml(_editPensionPlan)}</div>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción</label><input class="form-input" type="text" id="pen-desc" value="${acc?.descripcion||''}" placeholder="Plan de pensiones..."/></div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label><label class="toggle"><input type="checkbox" id="pen-activo" ${acc?.activo!==false?'checked':''}/><span class="toggle-slider"></span></label>
        <label class="form-label" style="margin-left:12px">Simulación</label><label class="toggle"><input type="checkbox" id="pen-sim" ${acc?.simulacion?'checked':''}/><span class="toggle-slider"></span></label>
      </div>
      ${EscenariosModule.checkboxesHtml(acc?.escenarioIds||[])}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="NominasModule.savePension('${id||''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id ? 'Editar plan de pensiones' : 'Nuevo plan de pensiones');
  }

  function _pensionPlanHtml(plan) {
    const rows = (plan||[]).map((p,i) => `
      <div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p.fechaInicio||'—'}</span>
        <span style="flex:1;font-size:12px">${FinanceMath.eur(p.importe)} / ${p.periodicidad}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${p.fechaFin||'indefinido'}</span>
        <button class="btn-danger btn-sm" onclick="NominasModule._removePensionAport(${i})">✕</button>
      </div>`).join('');
    return `<div id="pen-aport-list">${rows||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
      <div class="grid-2 mt-6" style="gap:6px">
        <input class="form-input" type="number" id="paport-importe" placeholder="Importe €" style="font-size:12px"/>
        ${UI.select('paport-periodo',[''],[['mensual','Mensual'],['trimestral','Trimestral'],['semestral','Semestral'],['anual','Anual']],'mensual')}
      </div>
      <div class="grid-2 mt-4" style="gap:6px">
        <input class="form-input" type="date" id="paport-inicio" style="font-size:12px"/>
        <input class="form-input" type="date" id="paport-fin" placeholder="Fin (opcional)" style="font-size:12px"/>
      </div>
      <button class="btn-secondary btn-sm mt-6" onclick="NominasModule._addPensionAport()">+ Añadir aportación</button>`;
  }

  function _addPensionAport() {
    const imp = parseFloat(document.getElementById('paport-importe')?.value)||0;
    if (!imp) { UI.toast('Importe requerido','err'); return; }
    _editPensionPlan.push({ _id: Date.now().toString(36), importe: imp,
      periodicidad: document.getElementById('paport-periodo')?.value||'mensual',
      fechaInicio: document.getElementById('paport-inicio')?.value||new Date().toISOString().slice(0,10),
      fechaFin: document.getElementById('paport-fin')?.value||'' });
    const c = document.getElementById('pen-aport-container'); if (c) c.innerHTML = _pensionPlanHtml(_editPensionPlan);
  }

  function _removePensionAport(idx) {
    _editPensionPlan.splice(idx, 1);
    const c = document.getElementById('pen-aport-container'); if (c) c.innerHTML = _pensionPlanHtml(_editPensionPlan);
  }

  function savePension(id) {
    const nombre = document.getElementById('pen-nombre')?.value?.trim();
    if (!nombre) { UI.toast('Nombre obligatorio','err'); return; }
    const nuevoSaldo  = parseFloat(document.getElementById('pen-saldo')?.value)||0;
    const grupoNomina = document.getElementById('pen-grupo')?.value || '';
    const acc = {
      nombre, grupoNomina,
      saldo:            nuevoSaldo,
      saldoInicial:     parseFloat(document.getElementById('pen-saldo-ini')?.value)||0,
      fechaInicialSaldo: document.getElementById('pen-fecha-ini')?.value,
      interes:          parseFloat(document.getElementById('pen-interes')?.value)||0,
      periodoCobro:     document.getElementById('pen-periodo')?.value||'mensual',
      modeloFondo:      'pension',
      esFondoPension:   true,
      bloqueoMeses:     parseInt(document.getElementById('pen-bloqueo')?.value)||120,
      impuestoRetirada: grupoNomina ? 0 : (parseFloat(document.getElementById('pen-impuesto')?.value)||0),
      planAportaciones: _editPensionPlan,
      descripcion:      document.getElementById('pen-desc')?.value?.trim()||'',
      activo:           document.getElementById('pen-activo')?.checked !== false,
      simulacion:       document.getElementById('pen-sim')?.checked||false,
      escenarioIds:     EscenariosModule.readCheckedEscenarios(),
    };
    if (id) {
      const existing = (State.get('accounts')||[]).find(a=>a._id===id);
      let hist = [...(existing?.historicoSaldos||[])];
      let aportaciones = [...(existing?.aportaciones||[])];
      const histOrd = [...hist].sort((a,b)=>b.fecha.localeCompare(a.fecha));
      const saldoAnt = histOrd[0]?.saldo ?? (existing?.saldo??null);
      if (saldoAnt===null || Math.abs(nuevoSaldo-saldoAnt)>0.005) {
        const hoy = new Date().toISOString().slice(0,10);
        hist.push({ _id: Date.now().toString(36), fecha: hoy, saldo: nuevoSaldo, nota: 'Actualización manual' });
        if (nuevoSaldo > (saldoAnt||0)) aportaciones.push({ _id: Date.now().toString(36)+'a', fecha: hoy, cantidad: nuevoSaldo-(saldoAnt||0) });
      }
      State.updateItem('accounts', id, {...acc, historicoSaldos: hist, aportaciones});
      UI.toast('Plan actualizado');
    } else {
      const hoy = new Date().toISOString().slice(0,10);
      const hist = [], aportaciones = [];
      if (nuevoSaldo > 0) {
        hist.push({ _id: Date.now().toString(36), fecha: hoy, saldo: nuevoSaldo, nota: 'Saldo inicial' });
        aportaciones.push({ _id: Date.now().toString(36)+'a', fecha: acc.fechaInicialSaldo||hoy, cantidad: nuevoSaldo });
      }
      State.addItem('accounts', {...acc, historicoSaldos: hist, aportaciones});
      UI.toast('Plan creado');
    }
    UI.closeModal(); render();
  }

  function deletePension(id) {
    if (!UI.confirm('¿Eliminar este plan de pensiones?')) return;
    State.removeItem('accounts', id);
    UI.toast('Plan eliminado');
    render();
  }

  return { render, saveNomina, deleteNomina, openTramosForm, _removeTramo, _addTramo, _saveTramos, _irpfAddYear, _irpfDeleteYear, openPensionForm, savePension, deletePension, _addPensionAport, _removePensionAport };
})();
