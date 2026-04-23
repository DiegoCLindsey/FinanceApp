// Depends on: State, FinanceMath, UI
const ExpensesModule = (() => {
  // Sort/filter state
  let showExpired=false, sortKey='concepto', sortDir=1;
  let filterTipo='', filterCuenta='', filterFechaMin='', filterFechaMax='', filterSearch='';

  function render() {
    const view=document.getElementById('view-expenses');
    const today=new Date().toISOString().slice(0,10);
    let expenses=[...State.get('expenses')];
    if (!showExpired) expenses=expenses.filter(e=>!e.fechaFin||e.fechaFin>=today);
    // Filtros
    if (filterTipo) expenses=expenses.filter(e=>e.tipo===filterTipo);
    if (filterCuenta) expenses=expenses.filter(e=>(e.cuenta||'default')===filterCuenta);
    if (filterFechaMin) expenses=expenses.filter(e=>e.fechaInicio>=filterFechaMin);
    if (filterFechaMax) expenses=expenses.filter(e=>e.fechaInicio<=filterFechaMax);
    if (filterSearch) expenses=expenses.filter(e=>e.concepto.toLowerCase().includes(filterSearch.toLowerCase()));
    // Sort
    expenses.sort((a,b)=>{
      let av=a[sortKey]??'', bv=b[sortKey]??'';
      if (typeof av==='number') return (av-bv)*sortDir;
      return String(av).localeCompare(String(bv))*sortDir;
    });

    const accOpts=State.accountOptions();
    view.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Gastos e <span>Ingresos</span></h1>
        <div class="page-actions">
          <label class="flex gap-8 items-center" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" id="toggle-expired" ${showExpired?'checked':''}/><span class="toggle-slider"></span></label>
            Expirados
          </label>
          <button class="btn-primary" id="btn-new-exp">+ Nuevo</button>
        </div>
      </div>
      <div class="filter-bar">
        <input class="form-input" type="text" id="flt-search" placeholder="Buscar…" value="${filterSearch}" style="min-width:160px"/>
        <select class="form-select" id="flt-tipo"><option value="">Todos</option><option value="gasto" ${filterTipo==='gasto'?'selected':''}>Gastos</option><option value="ingreso" ${filterTipo==='ingreso'?'selected':''}>Ingresos</option><option value="transferencia" ${filterTipo==='transferencia'?'selected':''}>Transferencias</option></select>
        <select class="form-select" id="flt-cuenta"><option value="">Todas las cuentas</option>${accOpts.map(([v,l])=>`<option value="${v}"${filterCuenta===v?' selected':''}>${l}</option>`).join('')}</select>
        <input class="form-input" type="date" id="flt-fecha-min" value="${filterFechaMin}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" id="flt-fecha-max" value="${filterFechaMax}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" onclick="ExpensesModule.clearFilters()">Limpiar</button>
      </div>
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${sortHead('concepto','Concepto')} ${sortHead('tipo','Tipo')} ${sortHead('cuantia','Cuantía')} ${sortHead('tipoFrecuencia','Frecuencia')} <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${expenses.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':expenses.map(renderRow).join('')}
      </div>`;

    document.getElementById('btn-new-exp').onclick=()=>openForm();
    document.getElementById('toggle-expired').onchange=e=>{showExpired=e.target.checked;render();};
    document.getElementById('flt-search').oninput=e=>{filterSearch=e.target.value;render();};
    document.getElementById('flt-tipo').onchange=e=>{filterTipo=e.target.value;render();};
    document.getElementById('flt-cuenta').onchange=e=>{filterCuenta=e.target.value;render();};
    document.getElementById('flt-fecha-min').onchange=e=>{filterFechaMin=e.target.value;render();};
    document.getElementById('flt-fecha-max').onchange=e=>{filterFechaMax=e.target.value;render();};
    // Sort headers
    view.querySelectorAll('[data-sort]').forEach(el=>{ el.onclick=()=>{ if(sortKey===el.dataset.sort) sortDir*=-1; else{ sortKey=el.dataset.sort; sortDir=1; } render(); }; });
    // Row events
    expenses.forEach(exp=>{
      const be=view.querySelector(`[data-edit-exp="${exp._id}"]`); if(be)be.onclick=()=>openForm(exp._id);
      const bd=view.querySelector(`[data-del-exp="${exp._id}"]`); if(bd)bd.onclick=()=>deleteExpense(exp._id);
      const tog=view.querySelector(`[data-tog-exp="${exp._id}"]`); if(tog)tog.onchange=e=>{State.updateItem('expenses',exp._id,{activo:e.target.checked});render();};
    });
  }

  function sortHead(key, label) {
    const arrow = sortKey===key ? (sortDir===1?'↑':'↓') : '';
    return `<span class="exp-col-head" data-sort="${key}">${label} <span class="sort-arrow">${arrow}</span></span>`;
  }

  function renderRow(exp) {
    const diaPagoLabel = FinanceMath.labelDiaPago(exp.diaPago||'');
    const isTransfer = exp.tipo === 'transferencia';
    const freq = exp.tipoFrecuencia==='extraordinario'
      ? 'Único'
      : `Cada ${exp.frecuencia} ${exp.tipoFrecuencia==='diaria'?'día(s)':'mes(es)'}${diaPagoLabel ? ` · ${diaPagoLabel}` : ''}`;
    const today = new Date().toISOString().slice(0,10);
    const expirado = exp.fechaFin && exp.fechaFin < today;
    let tipoBadge;
    if (isTransfer) {
      tipoBadge = `<span class="badge badge-purple">⇄ transf.</span>`;
    } else if (exp.tipo==='ingreso') {
      tipoBadge = `<span class="badge badge-active">ingreso</span>`;
    } else {
      tipoBadge = `<span class="badge badge-red">gasto</span>`;
    }
    const cuentaLabel = isTransfer
      ? `${State.accountName(exp.cuenta||'default')} → ${State.accountName(exp.cuentaDestino||'default')}`
      : State.accountName(exp.cuenta||'default');
    return `<div class="exp-table-row">
      <div><div style="font-weight:500">${exp.concepto}</div><div class="tag-list mt-8">${(exp.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>
      <div>${tipoBadge}</div>
      <div class="num ${exp.tipo==='ingreso'?'pos':isTransfer?'':'neg'}">${isTransfer?'⇄ ':''}${FinanceMath.eur(exp.cuantia)}</div>
      <div class="text-sm">${freq}</div>
      <div class="text-sm exp-col-hide">${cuentaLabel}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-tog-exp="${exp._id}" ${exp.activo?'checked':''}/><span class="toggle-slider"></span></label>
        ${exp.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':''}
        ${expirado?'<span class="badge badge-inactive">Exp.</span>':''}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-edit-exp="${exp._id}"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-del-exp="${exp._id}">✕</button>
      </div>
    </div>`;
  }

  function clearFilters() { filterTipo=''; filterCuenta=''; filterFechaMin=''; filterFechaMax=''; filterSearch=''; render(); }

  function openForm(id=null) {
    const exp = id ? State.get('expenses').find(e=>e._id===id) : null;
    const isTransfer = exp?.tipo === 'transferencia';
    const html = `
      <div class="grid-2">
        ${UI.input('ef-concepto','Concepto','text',exp?.concepto||'','Ej: Alquiler')}
        ${UI.select('ef-tipo','Tipo',[['gasto','Gasto'],['ingreso','Ingreso'],['transferencia','Transferencia entre cuentas']],exp?.tipo||'gasto')}
      </div>
      <div class="grid-3 mt-8">
        ${UI.input('ef-cuantia','Cuantía (€)','number',exp?.cuantia||'','500')}
        ${UI.input('ef-frecuencia','Frecuencia','number',exp?.frecuencia||1,'1')}
        ${UI.select('ef-tipo-frec','Tipo frecuencia',[['extraordinario','Extraordinario'],['diaria','Diaria'],['mensual','Mensual']],exp?.tipoFrecuencia||'mensual')}
      </div>
      <div class="grid-2 mt-8">
        ${UI.input('ef-fecha-ini','Fecha inicio','date',exp?.fechaInicio||new Date().toISOString().slice(0,10))}
        ${UI.input('ef-fecha-fin','Fecha fin (opcional)','date',exp?.fechaFin||'')}
      </div>
      <div class="mt-8">${UI.diaPagoWidget('exp', exp?.diaPago||'')}</div>
      <div id="ef-varianza-wrap" class="grid-2 mt-8" style="${isTransfer?'display:none':''}"><div class="form-group"><label class="form-label">Varianza ± % (para simulación Monte Carlo)</label><input class="form-input" type="number" id="ef-varianza" value="${exp?.varianza||0}" min="0" max="100" placeholder="0"/></div><div class="form-group"><label class="form-label">Inflación anual % (0 = global)</label><input class="form-input" type="number" id="ef-inflacion" value="${exp?.inflacion||0}" min="0" max="30" placeholder="0"/></div></div>
      <div class="grid-2 mt-8">
        ${UI.accountSelect('ef-cuenta','Cuenta origen',exp?.cuenta||'default')}
        <div id="ef-destino-wrap" style="${isTransfer?'':'display:none'}">
          ${UI.accountSelect('ef-cuenta-dest','Cuenta destino',exp?.cuentaDestino||'default')}
        </div>
      </div>
      <div id="ef-basico-wrap" style="${isTransfer?'display:none':''}">
        <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label><input class="form-input" type="text" id="ef-tags" value="${(exp?.tags||[]).join(', ')}" placeholder="alquiler, vivienda"/></div>
        <div class="form-row mt-8">
          <label class="form-label">Gasto básico</label>
          <label class="toggle"><input type="checkbox" id="ef-basico" ${exp?.basico?'checked':''}/><span class="toggle-slider"></span></label>
          <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
        </div>
        <div class="form-row mt-8" id="ef-irpf-wrap" style="display:none">
          <label class="form-label">Sujeto a retención IRPF</label>
          <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF" ${exp?.sujetoIRPF?'checked':''}/><span class="toggle-slider"></span></label>
          <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
        </div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo" ${exp?.activo!==false?'checked':''}/><span class="toggle-slider"></span></label>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="ExpensesModule.saveExpense('${id||''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id ? 'Editar' : 'Nuevo gasto/ingreso');
    // Show/hide destino and basico based on tipo selection
    setTimeout(()=>{
      const sel = document.getElementById('ef-tipo');
      if (sel) sel.onchange = () => {
        const t = sel.value;
        document.getElementById('ef-destino-wrap').style.display   = t==='transferencia' ? '' : 'none';
        document.getElementById('ef-basico-wrap').style.display    = t==='transferencia' ? 'none' : '';
        document.getElementById('ef-varianza-wrap').style.display  = t==='transferencia' ? 'none' : '';
        const irpfWrap = document.getElementById('ef-irpf-wrap');
        if(irpfWrap) irpfWrap.style.display = t==='ingreso' ? '' : 'none';
      };
    }, 50);
  }

  function saveExpense(id) {
    const tipo = document.getElementById('ef-tipo').value;
    const isTransfer = tipo === 'transferencia';
    const exp = {
      concepto:      document.getElementById('ef-concepto').value.trim(),
      tipo,
      cuantia:       parseFloat(document.getElementById('ef-cuantia').value),
      frecuencia:    parseInt(document.getElementById('ef-frecuencia').value)||1,
      tipoFrecuencia:document.getElementById('ef-tipo-frec').value,
      fechaInicio:   document.getElementById('ef-fecha-ini').value,
      fechaFin:      document.getElementById('ef-fecha-fin').value||null,
      diaPago:       UI.getDiaPagoValue('exp'),
      cuenta:        document.getElementById('ef-cuenta').value,
      cuentaDestino: isTransfer ? document.getElementById('ef-cuenta-dest')?.value||'default' : null,
      activo:        document.getElementById('ef-activo').checked,
      basico:        !isTransfer && (document.getElementById('ef-basico')?.checked||false),
      varianza:      isTransfer ? 0 : (parseFloat(document.getElementById('ef-varianza')?.value)||0),
      inflacion:     isTransfer ? 0 : (parseFloat(document.getElementById('ef-inflacion')?.value)||0),
      sujetoIRPF:    !isTransfer && (document.getElementById('ef-sujetoIRPF')?.checked||false),
      tags:          isTransfer ? ['transferencia'] : (document.getElementById('ef-tags')?.value||'').split(',').map(t=>t.trim()).filter(Boolean),
    };
    if (!exp.concepto||isNaN(exp.cuantia)) { UI.toast('Concepto y cuantía obligatorios','err'); return; }
    if (id) { State.updateItem('expenses',id,exp); UI.toast('Actualizado'); }
    else { State.addItem('expenses',exp); UI.toast('Creado'); }
    UI.closeModal(); render();
  }

  function deleteExpense(id) { if(!UI.confirm('¿Eliminar?'))return; State.removeItem('expenses',id); UI.toast('Eliminado'); render(); }

  return { render, saveExpense, deleteExpense, clearFilters };
})();
