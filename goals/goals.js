// Depends on: State, FinanceMath, UI
const GoalsModule = (() => {

  // ── Proyección de fecha de cumplimiento ─────────────────────────────────────
  // Itera mes a mes desde hoy proyectando el extracto futuro para encontrar
  // el primer mes en que el saldo acumulado de las cuentas asociadas >= targetAmount.
  function proyectarFechaCumplimiento(g, accounts, config, loans, expenses) {
    if (!g.targetAmount || g.targetAmount <= 0) return null;
    const hoy = new Date();
    const ids = g.cuentaIds && g.cuentaIds.length > 0 ? g.cuentaIds : null;
    const cuentas = ids
      ? accounts.filter(a => ids.includes(a._id))
      : accounts.filter(a => a.activo && !a.simulacion);
    if (!cuentas.length) return null;

    const colchon = g.usarColchon !== false ? FinanceMath.calcColchon(expenses, config, loans) : 0;
    const horizonte = 120; // máx 10 años

    for (let i = 1; i <= horizonte; i++) {
      const mesD  = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
      const mesLabel = mesD.getFullYear() + '-' + String(mesD.getMonth()+1).padStart(2,'0');
      const mesFin   = new Date(mesD.getFullYear(), mesD.getMonth()+1, 0).toISOString().slice(0,10);

      // Proyectar extracto de cada cuenta hasta fin de ese mes
      let saldoTotal = 0;
      for (const acc of cuentas) {
        const cfgMes = { ...config, dashboardStart: hoy.toISOString().slice(0,10), dashboardEnd: mesFin };
        const ext = FinanceMath.generarExtracto(loans, expenses, [acc], cfgMes);
        const evs = ext.filter(e => e.fecha <= mesFin);
        const saldoAcc = evs.length > 0 ? evs[evs.length-1].saldoAcum : FinanceMath.saldoRealCuenta(acc);
        saldoTotal += saldoAcc;
      }
      if (saldoTotal - colchon >= g.targetAmount) return mesLabel;
    }
    return null; // no se alcanza en el horizonte
  }

  // ── Saldo real para un objetivo ──────────────────────────────────────────────
  // Suma el último histórico (o saldoInicial) de las cuentas asociadas.
  // Si usarColchon=true, resta el colchón económico.
  function saldoParaObjetivo(g, accounts, config, loans, expenses) {
    const ids    = g.cuentaIds && g.cuentaIds.length > 0 ? g.cuentaIds : null;
    const cuentas = ids
      ? accounts.filter(a => ids.includes(a._id))
      : accounts.filter(a => a.activo && !a.simulacion);

    const total = cuentas.reduce((s, acc) => {
      const hist = [...(acc.historicoSaldos||[])].sort((a,b)=>b.fecha.localeCompare(a.fecha));
      return s + (hist[0] ? hist[0].saldo : (acc.saldoInicial||0));
    }, 0);

    if (g.usarColchon !== false) {
      const colchon = FinanceMath.calcColchon(expenses, config, loans);
      return Math.max(0, total - colchon);
    }
    return total;
  }

  // ── Render sección Cuentas ───────────────────────────────────────────────────
  function renderGoalsSection(container) {
    const goals    = (State.get('goals') || []).slice().sort((a,b)=>(a.prioridad||99)-(b.prioridad||99));
    const accounts = State.get('accounts');
    const config   = State.get('config');
    const loans    = State.get('loans');
    const expenses = State.get('expenses');
    const colchon  = FinanceMath.calcColchon(expenses, config, loans);

    const cards = goals.map((g, idx) => {
      const saldo     = saldoParaObjetivo(g, accounts, config, loans, expenses);
      const prog      = g.targetAmount > 0 ? Math.min(100, (saldo / g.targetAmount) * 100) : 0;
      const alcanzado = !g.completado && saldo >= g.targetAmount && g.targetAmount > 0;
      const mesesRest = g.targetDate ? Math.max(0, Math.round((new Date(g.targetDate)-Date.now())/(30.44*86400000))) : null;
      const ahorroNec = mesesRest > 0 ? Math.max(0, g.targetAmount - saldo) / mesesRest : null;
      // Proyección de fecha de cumplimiento basada en extracto futuro
      const fechaEstimada = !g.completado && !alcanzado
        ? proyectarFechaCumplimiento(g, accounts, config, loans, expenses)
        : null;
      const cuentaNombres = (g.cuentaIds||[]).length > 0
        ? (g.cuentaIds||[]).map(id => accounts.find(a=>a._id===id)?.nombre||id).join(', ')
        : 'Todas las cuentas activas';

      const badges = [
        g.completado ? '<span class="badge badge-active">✓ Completado</span>' : '',
        alcanzado    ? '<span class="badge" style="background:rgba(0,229,160,0.2);color:var(--accent)">🎉 ¡Meta alcanzada!</span>' : '',
        g.usarColchon !== false ? '<span class="badge badge-inactive" title="Colchón descontado del saldo">🛡 −colchón</span>' : '',
      ].filter(Boolean).join('');

      const completarBtn = alcanzado
        ? `<button class="btn-primary btn-sm" data-complete-goal="${g._id}">Marcar completado</button>`
        : '';

      const cardClass  = ['card mb-8', g.completado ? 'goal-completado' : '', alcanzado ? 'goal-alcanzado' : ''].filter(Boolean).join(' ');
      const cardBorder = alcanzado ? 'border:1px solid var(--accent)' : 'border:1px solid var(--border)';
      const progColor  = prog >= 100 ? 'var(--accent)' : prog >= 70 ? 'var(--yellow)' : 'var(--text2)';

      const meta     = g.targetDate ? `<span>Meta fijada: ${g.targetDate}</span>` : '';
      const estimada = fechaEstimada ? `<span style="color:var(--accent)">📈 Estimado: ${fechaEstimada}</span>` : (!g.completado && !alcanzado ? '<span style="color:var(--text3)">Sin proyección</span>' : '');
      const ahorro   = ahorroNec !== null ? `<span>Necesitas ${FinanceMath.eur(ahorroNec)}/mes</span>` : '';
      const colchStr = g.usarColchon !== false ? `<span>Colchón: ${FinanceMath.eur(colchon)}</span>` : '';

      return `<div class="${cardClass}" style="padding:14px;${cardBorder}">
        <div class="flex justify-between items-center mb-8">
          <div class="flex gap-8 items-center flex-wrap">
            <span class="goal-priority-badge">#${g.prioridad||idx+1}</span>
            <span style="font-weight:600;font-size:14px${g.completado ? ';text-decoration:line-through;color:var(--text3)' : ''}">${g.nombre}</span>
            ${badges}
          </div>
          <div class="flex gap-8">
            ${completarBtn}
            <button class="btn-icon" data-edit-goal="${g._id}"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
            <button class="btn-danger btn-sm" data-del-goal="${g._id}">✕</button>
          </div>
        </div>
        <div class="flex justify-between mb-4">
          <span class="text-sm">${FinanceMath.eur(saldo)} / ${FinanceMath.eur(g.targetAmount)}</span>
          <span class="text-sm" style="color:${progColor}">${prog.toFixed(0)}%${mesesRest !== null ? ` · ${mesesRest}m restantes` : ''}</span>
        </div>
        <div class="goal-bar">
          <div class="goal-bar-fill" style="width:${prog}%;background:${g.color||'var(--accent)'}"></div>
        </div>
        <div class="flex gap-12 mt-8 flex-wrap" style="font-size:11px;color:var(--text3)">
          ${ahorro}${meta}${estimada}${colchStr}
          <span>Cuentas: ${cuentaNombres}</span>
        </div>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="flex justify-between items-center mb-12">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro</div>
        <button class="btn-primary btn-sm" id="btn-new-goal">+ Objetivo</button>
      </div>
      ${goals.length === 0
        ? '<div class="text-sm" style="color:var(--text3)">Sin objetivos. Define metas de ahorro para seguirlas aquí y en el Dashboard.</div>'
        : cards}
    `;

    container.querySelector('#btn-new-goal')?.addEventListener('click', () => openForm());
    goals.forEach(g => {
      container.querySelector(`[data-edit-goal="${g._id}"]`)?.addEventListener('click', () => openForm(g._id));
      container.querySelector(`[data-del-goal="${g._id}"]`)?.addEventListener('click', () => {
        if (!UI.confirm('¿Eliminar objetivo?')) return;
        State.removeItem('goals', g._id);
        renderGoalsSection(container);
      });
      container.querySelector(`[data-complete-goal="${g._id}"]`)?.addEventListener('click', () => {
        State.updateItem('goals', g._id, { completado: true });
        UI.toast('Objetivo marcado como completado ✓');
        renderGoalsSection(container);
      });
    });
  }

  // ── Formulario ────────────────────────────────────────────────────────────────
  function openForm(id=null) {
    const g        = id ? (State.get('goals')||[]).find(g=>g._id===id) : null;
    const accounts = State.get('accounts').filter(a => a.activo && !a.simulacion);
    const goals    = State.get('goals') || [];
    const nextPrio = g ? (g.prioridad||1) : Math.max(0, ...goals.map(g=>g.prioridad||0)) + 1;

    const colorOpts = ['#00e5a0','#4d9fff','#ffd166','#ff4d6d','#a855f7','#fb923c']
      .map(col => `<option value="${col}" ${(g?.color||'#00e5a0')===col?'selected':''}>${col}</option>`).join('');

    const accChecks = accounts.map(acc => {
      const checked = (g?.cuentaIds||[]).includes(acc._id);
      return `<label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
        <input type="checkbox" class="goal-acc-check" value="${acc._id}" ${checked?'checked':''}/>
        ${acc.nombre}
      </label>`;
    }).join('');

    const html = `
      ${UI.input('goal-nombre','Nombre del objetivo','text',g?.nombre||'','Ej: Fondo de emergencia')}
      <div class="grid-3 mt-8">
        ${UI.input('goal-amount','Importe objetivo (€)','number',g?.targetAmount||'','10000')}
        ${UI.input('goal-date','Fecha límite (opcional)','date',g?.targetDate||'')}
        ${UI.input('goal-prio','Prioridad (1=mayor)','number',nextPrio,'1')}
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas a considerar (vacío = todas las activas)</label>
        <div style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--bg3);border-radius:var(--radius)">
          ${accChecks || '<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Descontar colchón económico</label>
        <label class="toggle"><input type="checkbox" id="goal-colchon" ${g?.usarColchon!==false?'checked':''}/><span class="toggle-slider"></span></label>
        <span class="text-sm" style="margin-left:6px;color:var(--text3)">Muestra el excedente sobre el mínimo de seguridad</span>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Marcar como completado</label>
        <label class="toggle"><input type="checkbox" id="goal-completado" ${g?.completado?'checked':''}/><span class="toggle-slider"></span></label>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <select class="form-select" id="goal-color">${colorOpts}</select>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="GoalsModule.saveGoal('${id||''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id ? 'Editar objetivo' : 'Nuevo objetivo');
  }

  function saveGoal(id) {
    const nombre     = document.getElementById('goal-nombre')?.value.trim();
    const amount     = parseFloat(document.getElementById('goal-amount')?.value)||0;
    const date       = document.getElementById('goal-date')?.value||null;
    const prio       = parseInt(document.getElementById('goal-prio')?.value)||1;
    const color      = document.getElementById('goal-color')?.value||'#00e5a0';
    const colchon    = document.getElementById('goal-colchon')?.checked !== false;
    const completado = document.getElementById('goal-completado')?.checked||false;
    const cuentaIds  = [...document.querySelectorAll('.goal-acc-check:checked')].map(el=>el.value);

    if (!nombre) { UI.toast('Nombre obligatorio','err'); return; }
    const g = { nombre, targetAmount:amount, targetDate:date, prioridad:prio, color, usarColchon:colchon, completado, cuentaIds };
    if (id) { State.updateItem('goals', id, g); UI.toast('Actualizado'); }
    else    { State.addItem('goals', g); UI.toast('Objetivo creado'); }
    UI.closeModal();
    const cont = document.getElementById('goals-section');
    if (cont) renderGoalsSection(cont);
  }

  return { renderGoalsSection, saveGoal, openForm, _saldoParaObjetivo: saldoParaObjetivo, _proyectarFechaCumplimiento: proyectarFechaCumplimiento };
})();
