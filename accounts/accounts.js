// Depends on: State, FinanceMath, UI
const AccountsModule = (() => {
  function render() {
    const view=document.getElementById('view-accounts');
    const accounts=State.get('accounts');
    view.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas e <span>Inversiones</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" id="btn-tramos-ganancias" title="Configurar tramos impuesto ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" id="btn-reset-base">↻ Actualizar saldo base</button>
          <button class="btn-primary" id="btn-new-acc">+ Nueva cuenta</button>
        </div>
      </div>
      <div class="grid-3" id="accounts-list">
        ${accounts.map(renderCard).join('')}
      </div>
      <div class="card mt-14" id="goals-section"></div>`;
    document.getElementById('btn-new-acc').onclick=()=>openForm();
    document.getElementById('btn-reset-base').onclick=()=>resetSaldoBase();
    document.getElementById('btn-tramos-ganancias').onclick=()=>openTramosGananciasForm();
    // Render Goals section
    const goalsSection = view.querySelector('#goals-section');
    if (goalsSection) GoalsModule.renderGoalsSection(goalsSection);
    accounts.forEach(acc=>{
      view.querySelector(`[data-edit-acc="${acc._id}"]`)?.addEventListener('click',()=>openForm(acc._id));
      view.querySelector(`[data-del-acc="${acc._id}"]`)?.addEventListener('click',()=>{
        const accounts = State.get('accounts');
        if(accounts.length <= 1){UI.toast('Debe existir al menos una cuenta','err');return;}
        if(!UI.confirm('¿Eliminar cuenta?'))return;
        State.removeItem('accounts',acc._id);
        State.ensureDefaultAccount();
        render();
      });
      view.querySelector(`[data-principal-acc="${acc._id}"]`)?.addEventListener('click',()=>setAsPrincipal(acc._id));
      view.querySelector(`[data-hist-acc="${acc._id}"]`)?.addEventListener('click',()=>openHistorico(acc._id));
    });
  }

  function setAsPrincipal(id) {
    const accounts = State.get('accounts').map(a => ({...a, esCuentaPrincipal: a._id === id}));
    State.set('accounts', accounts);
    UI.toast('Cuenta marcada como principal');
    render();
  }

  function renderCard(acc) {
    const isPrincipal=acc.esCuentaPrincipal;
    const hist=[...(acc.historicoSaldos||[])].sort((a,b)=>b.fecha.localeCompare(a.fecha));
    const lastHist=hist[0];
    const saldoActual = lastHist ? lastHist.saldo : (acc.saldo||0);
    const modeloFondo = acc.modeloFondo || (acc.esFondoPension ? 'pension' : 'cuenta');
    const pension   = modeloFondo === 'pension'   ? FinanceMath.calcFondosPension(acc) : null;
    const inversion = modeloFondo === 'inversion' ? FinanceMath.calcFondoInversion(acc, State.get('config')?.tramosGananciasCapital) : null;

    // Remuneration summary: projected interest for the dashboard period
    const remuneracionBlock = (() => {
      if (!acc.activo || !acc.interes || acc.interes <= 0) return '';
      const config = State.get('config');
      const usarInflacion = config.usarInflacion || false;
      const inflPeriodos  = State.get('inflacion') || [];
      const dS = config.dashboardStart;
      const dE = config.dashboardEnd;
      const dStart = new Date(dS+'T00:00:00'), dEnd = new Date(dE+'T00:00:00');
      const meses = Math.max(1, (dEnd - dStart) / (30.44 * 86400000));
      // Simple interest estimate using saldo actual and annualized rate
      const saldoBase = FinanceMath.saldoEnFecha(acc, dS);
      const interesAnual = acc.interes / 100;
      const interesEstimado = saldoBase * (Math.pow(1 + interesAnual, meses / 12) - 1);

      let realBlock = '';
      if (usarInflacion && inflPeriodos.length > 0) {
        const factorInfl = FinanceMath.calcFactorInflacion(inflPeriodos, dS, dE);
        const perdidaPoder = saldoBase * (factorInfl - 1);
        const beneficioReal = interesEstimado - perdidaPoder;
        const color = beneficioReal >= 0 ? 'var(--accent)' : 'var(--red)';
        realBlock = `
          <div class="flex justify-between mt-6">
            <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
            <span class="num neg">${FinanceMath.eur(perdidaPoder)}</span>
          </div>
          <div class="flex justify-between mt-6">
            <span class="text-sm" style="font-weight:600">Beneficio real</span>
            <span class="num" style="color:${color};font-weight:600">${FinanceMath.eur(beneficioReal)}</span>
          </div>`;
      }

      return `<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${dS.slice(0,7)} → ${dE.slice(0,7)})</div>
        <div class="flex justify-between">
          <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
          <span class="num pos">${FinanceMath.eur(interesEstimado)}</span>
        </div>${realBlock}
      </div>`;
    })();

    const pensionBlock = pension ? `
      <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
        <div class="flex justify-between mb-6">
          <span class="text-sm" style="color:var(--text2)">🔓 Disponible</span>
          <span class="num pos">${FinanceMath.eur(pension.disponible)}</span>
        </div>
        <div class="flex justify-between mb-6">
          <span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span>
          <span class="num" style="color:var(--yellow)">${FinanceMath.eur(pension.bloqueado)}</span>
        </div>
        <div class="flex justify-between mb-6">
          <span class="text-sm" style="color:var(--text2)">📈 Revalorización</span>
          <span class="num ${pension.beneficio>=0?'pos':'neg'}">${FinanceMath.eur(pension.beneficio)}</span>
        </div>
        <div class="flex justify-between mb-6">
          <span class="text-sm" style="color:var(--text2)">💰 Coste base</span>
          <span class="num">${FinanceMath.eur(pension.costBase)}</span>
        </div>
        <div style="font-size:10px;color:var(--text3);margin-top:4px">
          ${pension.proxDesbloqueo ? `Próx. desbloqueo: ${pension.proxDesbloqueo}` : 'Todas las aportaciones disponibles'}
          · ${acc.impuestoRetirada}% sobre beneficio al retirar · ${pension.numAportaciones} aportaciones
        </div>
      </div>` : '';

    const inversionBlock = inversion ? (() => {
      const pctPlusvalia = inversion.costBase > 0 ? (inversion.plusvalia / inversion.costBase * 100).toFixed(1) : '0';
      return `
      <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Inversión</div>
        <div class="flex justify-between mb-6">
          <span class="text-sm" style="color:var(--text2)">💰 Coste base</span>
          <span class="num">${FinanceMath.eur(inversion.costBase)}</span>
        </div>
        <div class="flex justify-between mb-6">
          <span class="text-sm" style="color:var(--text2)">📈 Plusvalía (${pctPlusvalia}%)</span>
          <span class="num ${inversion.plusvalia>=0?'pos':'neg'}">${FinanceMath.eur(inversion.plusvalia)}</span>
        </div>
        <div class="flex justify-between mb-6">
          <span class="text-sm" style="color:var(--text2)">🏛️ Imp. ganancias estimado</span>
          <span class="num neg">${FinanceMath.eur(inversion.impuesto)}</span>
        </div>
        <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:2px">
          <span class="text-sm" style="font-weight:600">Neto tras impuestos</span>
          <span class="num pos" style="font-weight:600">${FinanceMath.eur(inversion.neto)}</span>
        </div>
      </div>`;
    })() : '';

    return `<div class="card" style="${isPrincipal?'border-color:var(--accent2)':''}">
      <div class="flex justify-between items-center mb-12">
        <div class="flex gap-8 items-center" style="flex-wrap:wrap">
          <span class="card-title" style="margin:0">${acc.nombre}</span>
          ${isPrincipal?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':''}
          ${modeloFondo==='pension'?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':''}
          ${modeloFondo==='inversion'?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':''}
          ${acc.simulacion?'<span class="badge badge-sim">SIM</span>':''}
          ${(acc.escenarioIds||[]).map(id=>`<span class="badge badge-yellow">🔭 ${EscenariosModule.escenarioName(id)}</span>`).join('')}
        </div>
        <div class="flex gap-8">
          ${!isPrincipal?`<button class="btn-icon" data-principal-acc="${acc._id}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`:''}
          <button class="btn-icon" data-hist-acc="${acc._id}" title="Histórico de saldos">
            <svg viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
          </button>
          <button class="btn-icon" data-edit-acc="${acc._id}"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
          <button class="btn-danger" data-del-acc="${acc._id}">✕</button>
        </div>
      </div>
      <div class="grid-2 mb-8" style="gap:8px">
        <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${FinanceMath.eur(acc.saldoInicial||0)}</div><div class="stat-sub">${acc.fechaInicialSaldo||'—'}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${FinanceMath.eur(saldoActual)}</div>${lastHist?`<div class="stat-sub">Registro: ${lastHist.fecha}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
      </div>
      ${acc.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${acc.interes}% rentabilidad</span><span class="badge badge-blue">Cap. ${acc.periodoCobro}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
      ${remuneracionBlock}
      ${pensionBlock}
      ${inversionBlock}
      ${hist.length>0?`<div class="text-sm mt-8">${hist.length} punto${hist.length>1?'s':''} en histórico · último ${lastHist.fecha}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
      ${acc.descripcion?`<div class="mt-8 text-sm">${acc.descripcion}</div>`:''}
    </div>`;
  }

  function _planAportacionesHtml(plan) {
    const rows = (plan||[]).map((p,i) => `
      <div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)" data-aport-idx="${i}">
        <span style="min-width:70px;font-size:12px">${p.fechaInicio||'—'}</span>
        <span style="flex:1;font-size:12px">${FinanceMath.eur(p.importe)} / ${p.periodicidad}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${p.fechaFin||'indefinido'}</span>
        <button class="btn-danger btn-sm" onclick="AccountsModule._removeAport(${i})">✕</button>
      </div>`).join('');
    return `<div id="aport-list">${rows || '<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
      <div class="grid-2 mt-8" style="gap:6px">
        <input class="form-input" type="number" id="aport-importe" placeholder="Importe €" style="font-size:12px"/>
        ${UI.select('aport-periodo',[''],[['mensual','Mensual'],['trimestral','Trimestral'],['semestral','Semestral'],['anual','Anual']],'mensual')}
      </div>
      <div class="grid-2 mt-6" style="gap:6px">
        <input class="form-input" type="date" id="aport-inicio" style="font-size:12px"/>
        <input class="form-input" type="date" id="aport-fin" placeholder="Fin (opcional)" style="font-size:12px"/>
      </div>
      <button class="btn-secondary btn-sm mt-6" onclick="AccountsModule._addAport()">+ Añadir aportación</button>`;
  }

  let _editPlan = [];

  function _addAport() {
    const importe = parseFloat(document.getElementById('aport-importe')?.value)||0;
    if (!importe) { UI.toast('Importe requerido','err'); return; }
    const periodicidad = document.getElementById('aport-periodo')?.value || 'mensual';
    const fechaInicio  = document.getElementById('aport-inicio')?.value  || new Date().toISOString().slice(0,10);
    const fechaFin     = document.getElementById('aport-fin')?.value     || '';
    _editPlan.push({ _id: Date.now().toString(36), importe, periodicidad, fechaInicio, fechaFin });
    const el = document.getElementById('aport-list');
    if (el) el.parentElement.querySelector('#aport-list') && (el.outerHTML = _planAportacionesHtml(_editPlan).split('</div>')[0] + '</div>');
    const container = document.getElementById('aport-container');
    if (container) container.innerHTML = _planAportacionesHtml(_editPlan);
  }

  function _removeAport(idx) {
    _editPlan.splice(idx, 1);
    const container = document.getElementById('aport-container');
    if (container) container.innerHTML = _planAportacionesHtml(_editPlan);
  }

  function openForm(id=null) {
    const acc=id?State.get('accounts').find(a=>a._id===id):null;
    const hist=[...(acc?.historicoSaldos||[])].sort((a,b)=>b.fecha.localeCompare(a.fecha));
    const saldoActual = hist[0] ? hist[0].saldo : (acc?.saldo??0);
    const modeloFondo = acc?.modeloFondo || (acc?.esFondoPension ? 'pension' : 'cuenta');
    _editPlan = [...(acc?.planAportaciones||[])];

    const html=`
      <div class="grid-2">
        ${UI.input('ac-nombre','Nombre','text',acc?.nombre||'','Ej: Fondo Indexado Vanguard')}
        ${UI.input('ac-saldo','Saldo actual (€)','number',saldoActual,'5000')}
      </div>
      <div class="auth-hint mt-8">Cambiar el <strong>saldo actual</strong> añade automáticamente un registro al histórico con la fecha de hoy.</div>
      <div class="grid-2 mt-8">
        ${UI.input('ac-saldo-ini','Saldo inicial (€)','number',acc?.saldoInicial??0,'5000')}
        ${UI.input('ac-fecha-ini','Fecha saldo inicial','date',acc?.fechaInicialSaldo||new Date().toISOString().slice(0,10))}
      </div>
      <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto proyectado en el Dashboard.</div>
      <div class="grid-2 mt-8">
        ${UI.input('ac-interes','Rentabilidad anual (%)','number',acc?.interes??0,'7')}
        ${UI.select('ac-periodo','Capitalización',[['diario','Diario'],['semanal','Semanal'],['mensual','Mensual']],acc?.periodoCobro||'mensual')}
      </div>
      <div class="form-group mt-8">
        ${UI.select('ac-modelo','Tipo de cuenta/fondo',[
          ['cuenta','Cuenta bancaria'],
          ['inversion','Fondo de inversión (ganancias de capital)'],
          ['pension','Plan de pensiones (FIFO + IRPF)'],
        ], modeloFondo)}
      </div>
      <div id="pension-fields" style="${modeloFondo==='pension'?'':'display:none'}">
        <div class="auth-hint mt-8" style="border-color:var(--yellow)">
          🔒 <strong>Plan de pensiones:</strong> las aportaciones quedan bloqueadas N meses; al retirar se aplica el % sobre beneficio.
        </div>
        <div class="grid-2 mt-8">
          ${UI.input('ac-bloqueo','Bloqueo (meses)','number',acc?.bloqueoMeses??120,'120')}
          ${UI.input('ac-impuesto-ret','Impuesto retirada (% beneficio)','number',acc?.impuestoRetirada??24,'24')}
        </div>
      </div>
      <div id="inversion-hint" style="${modeloFondo==='inversion'?'':'display:none'}">
        <div class="auth-hint mt-8" style="border-color:#10b981">
          📈 <strong>Fondo de inversión:</strong> la tarjeta mostrará plusvalía e impuesto estimado sobre ganancias de capital usando los tramos configurados en Ajustes.
        </div>
      </div>
      <script>
        document.getElementById('ac-modelo').onchange = function() {
          document.getElementById('pension-fields').style.display = this.value==='pension' ? '' : 'none';
          document.getElementById('inversion-hint').style.display = this.value==='inversion' ? '' : 'none';
        };
      </script>
      <div class="form-group mt-12">
        <label class="form-label">Aportaciones programadas</label>
        <div id="aport-container">${_planAportacionesHtml(_editPlan)}</div>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción</label><input class="form-input" type="text" id="ac-desc" value="${acc?.descripcion||''}" placeholder="Fondo indexado global..."/></div>
      <div class="form-row mt-8">
        <label class="form-label">Activa</label><label class="toggle"><input type="checkbox" id="ac-activo" ${acc?.activo!==false?'checked':''}/><span class="toggle-slider"></span></label>
        <label class="form-label" style="margin-left:12px">Simulación</label><label class="toggle"><input type="checkbox" id="ac-sim" ${acc?.simulacion?'checked':''}/><span class="toggle-slider"></span></label>
      </div>
      ${EscenariosModule.checkboxesHtml(acc?.escenarioIds||[])}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="AccountsModule.saveAccount('${id||''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id?'Editar cuenta/fondo':'Nueva cuenta / fondo');
  }

  function saveAccount(id) {
    const nuevoSaldo  = parseFloat(document.getElementById('ac-saldo').value)||0;
    const modeloFondo = document.getElementById('ac-modelo')?.value || 'cuenta';
    const esPension   = modeloFondo === 'pension';
    const esInversion = modeloFondo === 'inversion';
    const acc={
      nombre:           document.getElementById('ac-nombre').value.trim(),
      saldo:            nuevoSaldo,
      saldoInicial:     parseFloat(document.getElementById('ac-saldo-ini').value)||0,
      fechaInicialSaldo: document.getElementById('ac-fecha-ini').value,
      interes:          parseFloat(document.getElementById('ac-interes').value)||0,
      periodoCobro:     document.getElementById('ac-periodo').value,
      descripcion:      document.getElementById('ac-desc').value.trim(),
      activo:           document.getElementById('ac-activo').checked,
      simulacion:       document.getElementById('ac-sim').checked,
      escenarioIds:     EscenariosModule.readCheckedEscenarios(),
      modeloFondo,
      esFondoPension:   esPension,
      planAportaciones: _editPlan,
      bloqueoMeses:     esPension ? (parseInt(document.getElementById('ac-bloqueo')?.value)||120) : 120,
      impuestoRetirada: esPension ? (parseFloat(document.getElementById('ac-impuesto-ret')?.value)||0) : 0,
    };
    if (!acc.nombre) { UI.toast('Nombre obligatorio','err'); return; }
    if (id) {
      const existing   = State.get('accounts').find(a=>a._id===id);
      let hist         = [...(existing?.historicoSaldos||[])];
      let aportaciones = [...(existing?.aportaciones||[])];
      const histOrd    = [...hist].sort((a,b)=>b.fecha.localeCompare(a.fecha));
      const saldoAnt   = histOrd[0] ? histOrd[0].saldo : (existing?.saldo??null);
      if (saldoAnt === null || Math.abs(nuevoSaldo - saldoAnt) > 0.005) {
        const hoy = new Date().toISOString().slice(0,10);
        hist.push({ _id: Date.now().toString(36), fecha: hoy, saldo: nuevoSaldo, nota: 'Actualización manual' });
        if ((esPension || esInversion) && nuevoSaldo > (saldoAnt||0)) {
          aportaciones.push({ _id: Date.now().toString(36)+'a', fecha: hoy, cantidad: nuevoSaldo - (saldoAnt||0) });
        }
      }
      State.updateItem('accounts', id, {...acc, historicoSaldos: hist, aportaciones});
      UI.toast('Actualizada');
    } else {
      const hoy  = new Date().toISOString().slice(0,10);
      const hist = [];
      const aportaciones = [];
      if (nuevoSaldo > 0) {
        hist.push({ _id: Date.now().toString(36), fecha: hoy, saldo: nuevoSaldo, nota: 'Saldo inicial' });
        if (esPension || esInversion) {
          aportaciones.push({ _id: Date.now().toString(36)+'a', fecha: acc.fechaInicialSaldo||hoy, cantidad: nuevoSaldo });
        }
      }
      State.addItem('accounts', {...acc, historicoSaldos: hist, aportaciones});
      UI.toast('Cuenta / fondo creado');
    }
    UI.closeModal(); render();
  }

  function openHistorico(accId) {
    const acc=State.get('accounts').find(a=>a._id===accId);
    if (!acc) return;
    const hist=[...(acc.historicoSaldos||[])].sort((a,b)=>b.fecha.localeCompare(a.fecha));
    const rows=hist.map(h=>`
      <div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${h.fecha}</span>
        <span class="num" style="flex:1;${h.saldo>=(acc.saldoInicial||0)?'color:var(--accent)':'color:var(--red)'}">${FinanceMath.eur(h.saldo)}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${h.nota||''}</span>
        <button class="btn-secondary btn-sm" title="Reestablecer punto inicial" onclick="AccountsModule.resetearPuntoInicial('${accId}','${h._id}')">⟲ Inicio</button>
        <button class="btn-danger btn-sm" onclick="AccountsModule.deleteHistorico('${accId}','${h._id}')">✕</button>
      </div>`).join('');
    const html=`
      <div class="card-title">Histórico — ${acc.nombre}</div>
      <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
        ${hist.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':rows}
      </div>
      <div class="divider"></div>
      <div class="card-title">Añadir punto de control</div>
      <div class="grid-3">
        ${UI.input('hi-fecha','Fecha','date',new Date().toISOString().slice(0,10))}
        ${UI.input('hi-saldo','Saldo real (€)','number','','5000')}
        ${UI.input('hi-nota','Nota (opcional)','text','','Extracto enero...')}
      </div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cerrar</button>
        <button class="btn-primary" onclick="AccountsModule.saveHistorico('${accId}')">Añadir</button>
      </div>`;
    UI.openModal(html,'Histórico de saldos');
  }

  function saveHistorico(accId) {
    const fecha=document.getElementById('hi-fecha').value;
    const saldo=parseFloat(document.getElementById('hi-saldo').value);
    const nota=document.getElementById('hi-nota')?.value.trim()||'';
    if (!fecha||isNaN(saldo)) { UI.toast('Fecha y saldo requeridos','err'); return; }
    const acc=State.get('accounts').find(a=>a._id===accId);
    const hist=[...(acc.historicoSaldos||[]), { _id:Date.now().toString(36), fecha, saldo, nota }];
    State.updateItem('accounts',accId,{historicoSaldos:hist});
    UI.toast('Punto añadido');
    render();
    openHistorico(accId);
  }

  function deleteHistorico(accId, hId) {
    const acc=State.get('accounts').find(a=>a._id===accId);
    const hist=(acc.historicoSaldos||[]).filter(h=>h._id!==hId);
    State.updateItem('accounts',accId,{historicoSaldos:hist});
    UI.toast('Eliminado');
    render();
    openHistorico(accId);
  }

  function resetSaldoBase() {
    const accounts = State.get('accounts');
    const activas = accounts.filter(a => a.activo);
    if (!activas.length) { UI.toast('No hay cuentas activas','err'); return; }
    const hoy = new Date().toISOString().slice(0,10);
    const lineas = activas.map(a => {
      const hist = [...(a.historicoSaldos||[])].sort((x,y)=>y.fecha.localeCompare(x.fecha));
      const saldoActual = hist.length > 0 ? hist[0].saldo : (a.saldoInicial||0);
      return `• ${a.nombre}: ${FinanceMath.eur(saldoActual)}`;
    }).join('\n');
    if (!UI.confirm(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${hoy})?\n\n${lineas}\n\nEsto recalibra el punto de arranque del dashboard.`)) return;
    for (const a of activas) {
      const hist = [...(a.historicoSaldos||[])].sort((x,y)=>y.fecha.localeCompare(x.fecha));
      const saldoActual = hist.length > 0 ? hist[0].saldo : (a.saldoInicial||0);
      State.updateItem('accounts', a._id, { saldoInicial: saldoActual, fechaInicialSaldo: hoy });
    }
    UI.toast('Saldo base actualizado');
    render();
  }

  function resetearPuntoInicial(accId, hId) {
    const acc=State.get('accounts').find(a=>a._id===accId);
    const h=(acc?.historicoSaldos||[]).find(e=>e._id===hId);
    if (!acc||!h) return;
    State.updateItem('accounts',accId,{saldoInicial:h.saldo, fechaInicialSaldo:h.fecha});
    UI.toast(`Punto inicial → ${h.fecha} (${FinanceMath.eur(h.saldo)})`);
    render();
    openHistorico(accId);
  }

  let _tramosGanEd = [];
  function openTramosGananciasForm() {
    const config = State.get('config');
    _tramosGanEd = (config.tramosGananciasCapital || [[0,19],[6000,21],[50000,23],[200000,27],[300000,28]]).map(t=>[...t]);
    const _rows = () => _tramosGanEd.map((t, i) => `
      <div class="grid-2 mt-8">
        <input class="form-input" type="number" id="tg-min-${i}" value="${t[0]}" placeholder="Desde €" min="0"/>
        <div class="flex gap-8">
          <input class="form-input" type="number" id="tg-pct-${i}" value="${t[1]}" placeholder="%" min="0" max="100" style="flex:1"/>
          <button class="btn-danger" onclick="AccountsModule._rmTG(${i})">✕</button>
        </div>
      </div>`).join('');
    const html = `
      <div class="text-sm" style="color:var(--text2);margin-bottom:8px">Tramos marginales para el impuesto sobre ganancias de capital (art. 49 LIRPF).</div>
      <div id="tg-rows">${_rows()}</div>
      <button class="btn-secondary btn-sm mt-8" onclick="AccountsModule._addTG()">+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="AccountsModule._saveTG()">Guardar</button>
      </div>`;
    UI.openModal(html, 'Tramos — Ganancias de capital');
  }
  function _collectTG() {
    const rows = []; let i = 0;
    while (document.getElementById(`tg-min-${i}`)) {
      rows.push([parseFloat(document.getElementById(`tg-min-${i}`).value)||0, parseFloat(document.getElementById(`tg-pct-${i}`).value)||0]);
      i++;
    }
    return rows;
  }
  function _renderTGRows() {
    document.getElementById('tg-rows').innerHTML = _tramosGanEd.map((t, i) => `
      <div class="grid-2 mt-8">
        <input class="form-input" type="number" id="tg-min-${i}" value="${t[0]}" placeholder="Desde €" min="0"/>
        <div class="flex gap-8">
          <input class="form-input" type="number" id="tg-pct-${i}" value="${t[1]}" placeholder="%" min="0" max="100" style="flex:1"/>
          <button class="btn-danger" onclick="AccountsModule._rmTG(${i})">✕</button>
        </div>
      </div>`).join('');
  }
  function _addTG() { _tramosGanEd = _collectTG(); _tramosGanEd.push([0,0]); _renderTGRows(); }
  function _rmTG(i) { _tramosGanEd = _collectTG(); _tramosGanEd.splice(i,1); _renderTGRows(); }
  function _saveTG() {
    const tramos = _collectTG().sort((a,b)=>a[0]-b[0]);
    if (!tramos.length) { UI.toast('Añade al menos un tramo','err'); return; }
    State.set('config', { ...State.get('config'), tramosGananciasCapital: tramos });
    UI.toast('Tramos guardados'); UI.closeModal(); render();
  }

  return { render, saveAccount, openHistorico, saveHistorico, deleteHistorico, setAsPrincipal, resetearPuntoInicial, _addAport, _removeAport, openTramosGananciasForm, _addTG, _rmTG, _saveTG };
})();
