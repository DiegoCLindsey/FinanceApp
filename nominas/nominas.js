// Depends on: State, FinanceMath, UI
const NominasModule = (() => {

  function render() {
    const view = document.getElementById('view-nominas');
    const nominas = State.get('nominas') || [];
    const config  = State.get('config');
    const tramos  = config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]];

    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Nóminas</h1>
        <button class="btn-primary" id="btn-new-nomina">+ Nueva nómina</button>
      </div>
      <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px">
        <div class="exp-table-head">
          <span class="exp-col-head">Concepto</span>
          <span class="exp-col-head">Bruto anual</span>
          <span class="exp-col-head">Pagas</span>
          <span class="exp-col-head">IRPF</span>
          <span class="exp-col-head">Modo</span>
          <span class="exp-col-head exp-col-hide">Cuenta</span>
          <span class="exp-col-head exp-col-hide">Desde</span>
          <span></span>
        </div>
        ${nominas.length === 0
          ? '<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin nóminas configuradas.</div>'
          : nominas.map(n => renderRow(n, tramos)).join('')
        }
      </div>

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
      </div>`;

    document.getElementById('btn-new-nomina').onclick = () => openForm();
    document.getElementById('btn-edit-tramos').onclick = () => openTramosForm();

    nominas.forEach(n => {
      const be = view.querySelector(`[data-edit-nom="${n._id}"]`); if (be) be.onclick = () => openForm(n._id);
      const bd = view.querySelector(`[data-del-nom="${n._id}"]`);  if (bd) bd.onclick = () => deleteNomina(n._id);
      const tog = view.querySelector(`[data-tog-nom="${n._id}"]`); if (tog) tog.onchange = e => { State.updateItem('nominas', n._id, {activo: e.target.checked}); render(); };
    });
  }

  function renderRow(n, tramos) {
    const brutoAnual = n.bruto || 0;
    const nPagas = n.nPagas || 12;
    const irpfAnual = n.irpfModo === 'manual'
      ? brutoAnual * ((n.irpfPct || 0) / 100)
      : FinanceMath.calcIRPF(brutoAnual, tramos);
    const irpfPct = brutoAnual > 0 ? (irpfAnual / brutoAnual * 100) : 0;
    const modoBadge = n.representacion === 'simplificado'
      ? `<span class="badge badge-orange">Simplificado</span>`
      : `<span class="badge badge-purple">Detallado</span>`;
    return `<div class="exp-table-row">
      <div style="font-weight:500">${n.nombre || '—'}</div>
      <div class="num">${FinanceMath.eur(brutoAnual)}</div>
      <div class="text-sm">${nPagas} pagas · ${FinanceMath.eur(brutoAnual/nPagas)}/paga</div>
      <div class="text-sm">${n.irpfModo === 'manual' ? n.irpfPct+'% (manual)' : irpfPct.toFixed(1)+'% (auto)'}</div>
      <div>${modoBadge}</div>
      <div class="text-sm exp-col-hide">${State.accountName(n.cuenta||'default')}</div>
      <div class="text-sm exp-col-hide">${n.fechaInicio||'—'}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-tog-nom="${n._id}" ${n.activo!==false?'checked':''}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-edit-nom="${n._id}"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-del-nom="${n._id}">✕</button>
      </div>
    </div>`;
  }

  function openForm(id = null) {
    const n = id ? (State.get('nominas') || []).find(x => x._id === id) : null;
    const html = `
      <div class="grid-2">
        ${UI.input('nf-nombre', 'Nombre / Empresa', 'text', n?.nombre||'', 'Ej: Empresa S.A.')}
        ${UI.input('nf-bruto', 'Bruto anual (€)', 'number', n?.bruto||'', '30000')}
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
      <div class="mt-8">
        <label class="form-label">Representación en predicciones</label>
        <select class="form-select" id="nf-representacion">
          <option value="detallado" ${(n?.representacion||'detallado')==='detallado'?'selected':''}>Detallado (bruto + gasto IRPF)</option>
          <option value="simplificado" ${n?.representacion==='simplificado'?'selected':''}>Simplificado (neto directo)</option>
        </select>
      </div>
      <div class="grid-2 mt-8">
        ${UI.input('nf-fecha-ini', 'Fecha inicio', 'date', n?.fechaInicio||new Date().toISOString().slice(0,10))}
        ${UI.input('nf-fecha-fin', 'Fecha fin (opcional)', 'date', n?.fechaFin||'')}
      </div>
      <div class="mt-8">${UI.accountSelect('nf-cuenta', 'Cuenta', n?.cuenta||State.getPrincipalAccountId())}</div>
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
          </div>`;
      };
      ['nf-bruto','nf-irpfpct','nf-npagas-custom'].forEach(id => document.getElementById(id)?.addEventListener('input', updatePreview));
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
    const nom = {
      nombre:        document.getElementById('nf-nombre').value.trim(),
      bruto:         parseFloat(document.getElementById('nf-bruto').value) || 0,
      nPagas,
      irpfModo:      document.getElementById('nf-irpfmodo').value,
      irpfPct:       parseFloat(document.getElementById('nf-irpfpct')?.value) || 0,
      representacion:document.getElementById('nf-representacion').value,
      fechaInicio:   document.getElementById('nf-fecha-ini').value,
      fechaFin:      document.getElementById('nf-fecha-fin').value || null,
      cuenta:        document.getElementById('nf-cuenta').value,
      activo:        true,
      tags:          ['nomina'],
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

  function openTramosForm() {
    const config = State.get('config');
    const tramos = (config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]]).map(t=>[...t]);
    let rows = tramos;
    const renderRows = () => rows.map((t, i) => `
      <div class="grid-2 mt-8">
        <input class="form-input" type="number" id="tr-min-${i}" value="${t[0]}" placeholder="Desde €" min="0"/>
        <div class="flex gap-8">
          <input class="form-input" type="number" id="tr-pct-${i}" value="${t[1]}" placeholder="%" min="0" max="100" style="flex:1"/>
          <button class="btn-danger" onclick="NominasModule._removeTramo(${i})">✕</button>
        </div>
      </div>`).join('');
    const openModal = () => {
      const html = `
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px">Define los tramos marginales del IRPF (orden ascendente por base).</div>
        <div id="tramos-rows">${renderRows()}</div>
        <button class="btn-secondary btn-sm mt-8" onclick="NominasModule._addTramo()">+ Añadir tramo</button>
        <div class="flex gap-8 mt-16" style="justify-content:flex-end">
          <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
          <button class="btn-primary" onclick="NominasModule._saveTramos()">Guardar</button>
        </div>`;
      UI.openModal(html, 'Tramos IRPF');
    };
    window._tramosEditing = rows;
    openModal();
  }

  function _removeTramo(i) {
    window._tramosEditing = _collectTramos();
    window._tramosEditing.splice(i, 1);
    document.getElementById('tramos-rows').innerHTML = window._tramosEditing.map((t, j) => `
      <div class="grid-2 mt-8">
        <input class="form-input" type="number" id="tr-min-${j}" value="${t[0]}" placeholder="Desde €" min="0"/>
        <div class="flex gap-8">
          <input class="form-input" type="number" id="tr-pct-${j}" value="${t[1]}" placeholder="%" min="0" max="100" style="flex:1"/>
          <button class="btn-danger" onclick="NominasModule._removeTramo(${j})">✕</button>
        </div>
      </div>`).join('');
  }

  function _addTramo() {
    window._tramosEditing = _collectTramos();
    window._tramosEditing.push([0, 0]);
    document.getElementById('tramos-rows').innerHTML = window._tramosEditing.map((t, j) => `
      <div class="grid-2 mt-8">
        <input class="form-input" type="number" id="tr-min-${j}" value="${t[0]}" placeholder="Desde €" min="0"/>
        <div class="flex gap-8">
          <input class="form-input" type="number" id="tr-pct-${j}" value="${t[1]}" placeholder="%" min="0" max="100" style="flex:1"/>
          <button class="btn-danger" onclick="NominasModule._removeTramo(${j})">✕</button>
        </div>
      </div>`).join('');
  }

  function _collectTramos() {
    const rows = [];
    let i = 0;
    while (document.getElementById(`tr-min-${i}`)) {
      rows.push([parseFloat(document.getElementById(`tr-min-${i}`).value)||0, parseFloat(document.getElementById(`tr-pct-${i}`).value)||0]);
      i++;
    }
    return rows;
  }

  function _saveTramos() {
    const tramos = _collectTramos().sort((a,b)=>a[0]-b[0]);
    if (tramos.length === 0) { UI.toast('Añade al menos un tramo', 'err'); return; }
    const config = State.get('config');
    State.set('config', { ...config, tramos_irpf: tramos });
    UI.toast('Tramos IRPF guardados');
    UI.closeModal();
    render();
  }

  return { render, saveNomina, deleteNomina, openTramosForm, _removeTramo, _addTramo, _saveTramos };
})();
