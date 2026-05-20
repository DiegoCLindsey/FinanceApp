// Depends on: State, FinanceMath, UI
const MargenesModule = (() => {

  let _container = null;

  function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function getMargenes() {
    return (State.get('config').margenesSeguridad || []);
  }

  function saveMargenes(list) {
    const cfg = State.get('config');
    State.set('config', { ...cfg, margenesSeguridad: list });
  }

  function render(container) {
    _container = container || document.getElementById('view-margenes');
    container = _container;
    const margenes = getMargenes();
    const accounts = State.get('accounts');
    const expenses = State.get('expenses');
    const config   = State.get('config');
    const loans    = State.get('loans');
    const hoy      = today();

    const cards = margenes.map(m => {
      const cuentasText = (m.cuentas && m.cuentas.length > 0)
        ? m.cuentas.map(id => accounts.find(a => a._id === id)?.nombre || id).join(', ')
        : 'Todas las cuentas activas';

      let valorActual = '';
      try {
        const val = FinanceMath.calcMargenEnFecha(m, expenses, config, loans, hoy);
        valorActual = FinanceMath.eur(val);
      } catch(e) {
        valorActual = '—';
      }

      const puntosRows = (m.puntos || [])
        .slice()
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .map(p => {
          const tipoOpts = ['fijo', 'meses'].map(t =>
            `<option value="${t}" ${p.tipo === t ? 'selected' : ''}>${t === 'fijo' ? 'Fijo €' : 'Meses'}</option>`
          ).join('');

          const importeCell = p.tipo === 'fijo'
            ? `<input type="number" class="form-input" style="width:90px" value="${p.importe || 0}"
                 onchange="MargenesModule.updatePunto('${m._id}','${p._id}','importe',parseFloat(this.value)||0)"/>`
            : `<span style="color:var(--text3)">—</span>`;

          const mesesCell = p.tipo === 'meses'
            ? `<input type="number" class="form-input" style="width:70px" value="${p.meses || 0}"
                 onchange="MargenesModule.updatePunto('${m._id}','${p._id}','meses',parseFloat(this.value)||0)"/>`
            : `<span style="color:var(--text3)">—</span>`;

          let equivalente = '';
          if (p.tipo === 'meses') {
            try {
              const gastoMensual = FinanceMath.calcGastoBasicoMensual(expenses);
              equivalente = `<span class="text-sm" style="color:var(--text3)">${FinanceMath.eur((p.meses || 0) * gastoMensual)}</span>`;
            } catch(e) { equivalente = ''; }
          }

          return `<tr>
            <td style="padding:4px 6px">
              <input type="date" class="form-input" style="width:130px" value="${p.fecha}"
                onchange="MargenesModule.updatePunto('${m._id}','${p._id}','fecha',this.value)"/>
            </td>
            <td style="padding:4px 6px">
              <select class="form-input" style="width:100px"
                onchange="MargenesModule.updatePunto('${m._id}','${p._id}','tipo',this.value)">
                ${tipoOpts}
              </select>
            </td>
            <td style="padding:4px 6px">${importeCell}</td>
            <td style="padding:4px 6px">${mesesCell}</td>
            <td style="padding:4px 6px">${equivalente}</td>
            <td style="padding:4px 6px">
              <button class="btn-icon" style="color:var(--red)"
                onclick="MargenesModule.removePunto('${m._id}','${p._id}')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </td>
          </tr>`;
        }).join('');

      const bodyHtml = m.activo ? `
        <div class="mt-8 text-sm" style="color:var(--text2)">
          <span style="color:var(--text3)">Cuentas:</span> ${cuentasText}
        </div>
        <div class="mt-8 text-sm flex gap-8 items-center">
          <span style="color:var(--text3)">Umbral hoy:</span>
          <strong style="color:var(--accent)">${valorActual}</strong>
        </div>
        <div class="mt-8" style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr style="color:var(--text3);text-align:left;border-bottom:1px solid var(--border)">
                <th style="padding:4px 6px;font-weight:500">Fecha</th>
                <th style="padding:4px 6px;font-weight:500">Tipo</th>
                <th style="padding:4px 6px;font-weight:500">Importe €</th>
                <th style="padding:4px 6px;font-weight:500">Meses</th>
                <th style="padding:4px 6px;font-weight:500">Equiv. €</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${puntosRows || `<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>`}
            </tbody>
          </table>
        </div>
        <div class="mt-8">
          <button class="btn-secondary btn-sm" onclick="MargenesModule.addPunto('${m._id}')">+ Añadir punto</button>
        </div>` : '';

      return `<div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${m.nombre}</span>
            <span class="badge ${m.activo ? 'badge-active' : 'badge-inactive'}">${m.activo ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${m.activo ? 'Desactivar' : 'Activar'}">
              <input type="checkbox" ${m.activo ? 'checked' : ''}
                onchange="MargenesModule.toggleActivo('${m._id}')"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" onclick="MargenesModule.openForm('${m._id}')">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" onclick="MargenesModule.deleteMargen('${m._id}')">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
        ${bodyHtml}
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
        <div>
          <h1 class="page-title" style="margin:0 0 4px">Márgenes de seguridad</h1>
          <p class="text-sm" style="color:var(--text3);margin:0">Define umbrales de saldo mínimo por cuenta o grupo de cuentas. Se mostrarán como advertencias en el dashboard cuando se crucen.</p>
        </div>
        <button class="btn-primary" onclick="MargenesModule.openForm()">+ Añadir margen</button>
      </div>
      ${margenes.length === 0
        ? `<div class="card" style="padding:24px;text-align:center">
             <p class="text-sm" style="color:var(--text3);margin:0">Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo de una cuenta baje del umbral establecido.</p>
           </div>`
        : cards}
    `;
  }

  function openForm(id) {
    const margenes = getMargenes();
    const m = id ? margenes.find(x => x._id === id) : null;
    const accounts = State.get('accounts').filter(a => a.activo);

    const accChips = accounts.map(acc => {
      const sel = (m?.cuentas || []).includes(acc._id);
      return `<label style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;cursor:pointer;font-size:13px;border:1px solid ${sel ? 'var(--accent)' : 'var(--border)'};background:${sel ? 'rgba(0,229,160,0.1)' : 'var(--bg2)'};margin:3px" id="chip-wrap-${acc._id}">
        <input type="checkbox" class="margenes-acc-chip" value="${acc._id}" ${sel ? 'checked' : ''}
          style="display:none"
          onchange="(function(el){var w=document.getElementById('chip-wrap-${acc._id}');w.style.border='1px solid '+(el.checked?'var(--accent)':'var(--border)');w.style.background=el.checked?'rgba(0,229,160,0.1)':'var(--bg2)'})(this)"/>
        ${acc.nombre}
      </label>`;
    }).join('');

    const punto = (m?.puntos || [])[0] || { fecha: today(), tipo: 'fijo', importe: 0, meses: 1 };

    const html = `
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${m?.nombre || ''}" placeholder="Ej: Colchón mínimo cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:2px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${accChips || '<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${!m ? `<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Waypoint inicial</div>
        <div class="grid-3 gap-8">
          <div class="form-group">
            <label class="form-label">Fecha</label>
            <input class="form-input" type="date" id="mg-p-fecha" value="${punto.fecha}"/>
          </div>
          <div class="form-group">
            <label class="form-label">Tipo</label>
            <select class="form-input" id="mg-p-tipo"
              onchange="(function(v){document.getElementById('mg-p-importe-wrap').style.display=v==='fijo'?'':'none';document.getElementById('mg-p-meses-wrap').style.display=v==='meses'?'':'none'})(this.value)">
              <option value="fijo">Fijo €</option>
              <option value="meses">Meses de gastos</option>
            </select>
          </div>
          <div>
            <div class="form-group" id="mg-p-importe-wrap">
              <label class="form-label">Importe (€)</label>
              <input class="form-input" type="number" id="mg-p-importe" value="${punto.importe || 0}" min="0"/>
            </div>
            <div class="form-group" id="mg-p-meses-wrap" style="display:none">
              <label class="form-label">Nº meses</label>
              <input class="form-input" type="number" id="mg-p-meses" value="${punto.meses || 1}" min="0" step="0.5"/>
            </div>
          </div>
        </div>
      </div>` : ''}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="MargenesModule.saveMargen('${id || ''}')">Guardar</button>
      </div>`;

    UI.openModal(html, id ? 'Editar margen' : 'Nuevo margen de seguridad');
  }

  function saveMargen(id) {
    const nombre = document.getElementById('mg-nombre')?.value.trim();
    if (!nombre) { UI.toast('El nombre es obligatorio', 'err'); return; }

    const cuentas = [...document.querySelectorAll('.margenes-acc-chip:checked')].map(el => el.value);
    const margenes = getMargenes();

    if (id) {
      const idx = margenes.findIndex(m => m._id === id);
      if (idx === -1) { UI.toast('Margen no encontrado', 'err'); return; }
      margenes[idx] = { ...margenes[idx], nombre, cuentas };
    } else {
      const pfecha  = document.getElementById('mg-p-fecha')?.value  || today();
      const ptipo   = document.getElementById('mg-p-tipo')?.value   || 'fijo';
      const pimporte = parseFloat(document.getElementById('mg-p-importe')?.value) || 0;
      const pmeses  = parseFloat(document.getElementById('mg-p-meses')?.value)   || 1;

      const punto = { _id: newId(), fecha: pfecha, tipo: ptipo, importe: pimporte, meses: pmeses };
      margenes.push({ _id: newId(), nombre, activo: true, cuentas, puntos: [punto] });
    }

    saveMargenes(margenes);
    UI.toast(id ? 'Margen actualizado' : 'Margen creado');
    UI.closeModal();
    if (_container) render(_container);
  }

  function deleteMargen(id) {
    if (!UI.confirm('¿Eliminar este margen de seguridad?')) return;
    const margenes = getMargenes().filter(m => m._id !== id);
    saveMargenes(margenes);
    UI.toast('Margen eliminado');
    if (_container) render(_container);
  }

  function addPunto(margenId) {
    const margenes = getMargenes();
    const m = margenes.find(x => x._id === margenId);
    if (!m) return;
    m.puntos = m.puntos || [];
    m.puntos.push({ _id: newId(), fecha: today(), tipo: 'fijo', importe: 0, meses: 1 });
    saveMargenes(margenes);
    if (_container) render(_container);
  }

  function removePunto(margenId, puntoId) {
    const margenes = getMargenes();
    const m = margenes.find(x => x._id === margenId);
    if (!m) return;
    m.puntos = (m.puntos || []).filter(p => p._id !== puntoId);
    saveMargenes(margenes);
    if (_container) render(_container);
  }

  function updatePunto(margenId, puntoId, field, value) {
    const margenes = getMargenes();
    const m = margenes.find(x => x._id === margenId);
    if (!m) return;
    const p = (m.puntos || []).find(x => x._id === puntoId);
    if (!p) return;
    p[field] = value;
    saveMargenes(margenes);
    if (_container) render(_container);
  }

  function toggleActivo(id) {
    const margenes = getMargenes();
    const m = margenes.find(x => x._id === id);
    if (!m) return;
    m.activo = !m.activo;
    saveMargenes(margenes);
    if (_container) render(_container);
  }

  const api = { render, openForm, saveMargen, deleteMargen, addPunto, removePunto, updatePunto, toggleActivo };
  window.MargenesModule = api;
  return api;
})();
