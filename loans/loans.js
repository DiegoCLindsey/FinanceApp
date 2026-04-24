// Depends on: State, FinanceMath, UI
const LoansModule = (() => {
  let mostrarFinalizados = false;

  function isLoanCompleted(loan) {
    if (!loan.activo || loan.simulacion) return false;
    const today = new Date().toISOString().slice(0,10);
    const { tabla } = FinanceMath.resumenPrestamo(loan);
    const regularRows = tabla.filter(r => !r.esAmortizacion);
    if (regularRows.length === 0) return true;
    return regularRows[regularRows.length - 1].fecha < today;
  }

  function render(keepOpen=null) {
    const view = document.getElementById('view-loans');
    const openIds = keepOpen ?? [...view.querySelectorAll('.loan-card-body.open')].map(el => el.id.replace('loan-body-',''));
    const allLoans = [...State.get('loans')].sort((a,b)=>b.tin-a.tin);

    // Classify
    const completedIds = new Set(allLoans.filter(l => isLoanCompleted(l)).map(l => l._id));
    const loans = mostrarFinalizados ? allLoans : allLoans.filter(l => !completedIds.has(l._id));
    const numFinalizados = completedIds.size;

    // ── Cuota del mes actual — solo préstamos activos y no finalizados ────────
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}`;
    let totalCuotaMes = 0;
    const cuotaMesMap = {};
    allLoans.filter(l => l.activo && !l.simulacion && !completedIds.has(l._id)).forEach(loan => {
      const { tabla } = FinanceMath.resumenPrestamo(loan);
      const filasMes = tabla.filter(r => !r.esAmortizacion && r.fecha.startsWith(mesActual));
      const cuota = filasMes.length > 0 ? filasMes[0].cuota : 0;
      cuotaMesMap[loan._id] = cuota;
      totalCuotaMes += cuota;
    });

    const activosConCuota = allLoans.filter(l => l.activo && !l.simulacion && !completedIds.has(l._id) && cuotaMesMap[l._id] > 0).length;

    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${numFinalizados > 0 ? `<button class="btn-secondary btn-sm" onclick="LoansModule.toggleFinalizados()">${mostrarFinalizados?'Ocultar':'Mostrar'} finalizados (${numFinalizados})</button>` : ''}
          <button class="btn-secondary" id="btn-optimizar">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" id="btn-new-loan">+ Nuevo préstamo</button>
        </div>
      </div>
      ${totalCuotaMes > 0 ? `
      <div class="card mb-14" style="padding:14px 18px">
        <div class="flex gap-24 items-center flex-wrap">
          <div>
            <div class="stat-label">Cuotas este mes (${hoy.toLocaleDateString('es-ES',{month:'long',year:'numeric'})})</div>
            <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${FinanceMath.eur(totalCuotaMes)}</div>
          </div>
          <div class="text-sm" style="color:var(--text3)">${activosConCuota} préstamo${activosConCuota!==1?'s':''} con cuota activa este mes</div>
        </div>
      </div>` : ''}
      <div id="loans-list">
        ${loans.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':loans.map(l=>renderCard(l, cuotaMesMap[l._id]||0, completedIds.has(l._id))).join('')}
      </div>`;
    document.getElementById('btn-new-loan').onclick = () => openForm();
    document.getElementById('btn-optimizar').onclick = () => openOptimizador();
    loans.forEach(loan => {
      const h  = view.querySelector(`[data-loan-id="${loan._id}"]`);  if(h)  h.onclick  = () => toggleBody(loan._id);
      const be = view.querySelector(`[data-edit-loan="${loan._id}"]`); if(be) be.onclick = e => { e.stopPropagation(); openForm(loan._id); };
      const bd = view.querySelector(`[data-del-loan="${loan._id}"]`);  if(bd) bd.onclick = e => { e.stopPropagation(); deleteLoan(loan._id); };
      const ba = view.querySelector(`[data-amort-loan="${loan._id}"]`);if(ba) ba.onclick = e => { e.stopPropagation(); openAmortForm(loan._id); };
    });
    // Restore open bodies
    openIds.forEach(id => {
      document.getElementById(`loan-body-${id}`)?.classList.add('open');
    });
  }

  function toggleFinalizados() { mostrarFinalizados = !mostrarFinalizados; render(); }

  function renderCard(loan, cuotaMes=0, completado=false) {
    const res = FinanceMath.resumenPrestamoConAhorro(loan);
    const tieneAmorts = (loan.amortizaciones||[]).length > 0;
    const diaPagoLabel = FinanceMath.labelDiaPago(loan.diaPago||'');

    // ── Fecha fin ─────────────────────────────────────────────────────────────
    const fechaFinActual   = res.fechaFin || '—';
    const fechaFinOriginal = res.sinAmort.fechaFin || '—';
    const mesesAhorrados   = res.ahorroTiempo; // positivo = se acorta

    // ── Intereses totales ─────────────────────────────────────────────────────
    const interesesActual   = res.totalIntereses;
    const interesesOriginal = res.sinAmort.totalIntereses;

    return `<div class="loan-card" id="loan-${loan._id}" style="${completado?'opacity:0.65':''}">
      <div class="loan-card-header" data-loan-id="${loan._id}">
        <div class="flex gap-8 items-center" style="flex-wrap:wrap">
          <span class="loan-card-title">${loan.nombre}</span>
          ${completado?'<span class="badge badge-active" style="background:rgba(0,229,160,0.15);color:var(--accent)">✓ Finalizado</span>':''}
          ${loan.simulacion?'<span class="badge badge-sim">SIM</span>':''}
          ${!loan.activo?'<span class="badge badge-inactive">Inactivo</span>':''}
          <span class="badge badge-blue">${State.accountName(loan.cuenta||'default')}</span>
          ${diaPagoLabel?`<span class="badge badge-inactive">📅 ${diaPagoLabel}</span>`:''}
        </div>
        <div class="loan-card-meta">
          <span class="loan-tin">${loan.tin}%</span>
          <span class="text-sm">${FinanceMath.eur(loan.capital)}</span>
          <span class="text-sm">${loan.meses}m</span>
          <button class="btn-icon" data-amort-loan="${loan._id}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
          <button class="btn-icon" data-edit-loan="${loan._id}"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
          <button class="btn-danger" data-del-loan="${loan._id}">✕</button>
        </div>
      </div>
      <div class="loan-card-body" id="loan-body-${loan._id}">

        <!-- Stats principales: 2 filas de 4 -->
        <div class="grid-4 mb-12">
          <div class="stat-card">
            <div class="stat-label">Cuota mensual</div>
            <div class="stat-value">${FinanceMath.eur(res.cuota)}</div>
            ${cuotaMes > 0 ? `<div class="stat-sub" style="color:var(--accent)">Este mes: ${FinanceMath.eur(cuotaMes)}</div>` : ''}
          </div>
          <div class="stat-card">
            <div class="stat-label">Total intereses</div>
            <div class="stat-value neg">${FinanceMath.eur(interesesActual)}</div>
            ${tieneAmorts ? `<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${FinanceMath.eur(interesesOriginal)}</div>` : ''}
          </div>
          <div class="stat-card">
            <div class="stat-label">Fecha fin</div>
            <div class="stat-value" style="font-size:14px">${fechaFinActual}</div>
            ${tieneAmorts && fechaFinActual !== fechaFinOriginal ? `<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${fechaFinOriginal}${mesesAhorrados>0?` (−${mesesAhorrados}m)`:''}</div>` : ''}
          </div>
          <div class="stat-card">
            <div class="stat-label">Total pagado</div>
            <div class="stat-value neg">${FinanceMath.eur(res.totalPagado)}</div>
            <div class="stat-sub">${loan.capital ? `Capital: ${FinanceMath.eur(loan.capital)}` : ''}</div>
          </div>
        </div>
        <div class="grid-2 mb-12" style="gap:10px">
          <div class="stat-card" style="display:flex;gap:16px;align-items:center">
            <div><div class="stat-label">TAE</div><div class="stat-value">${FinanceMath.pct(res.tae)}</div></div>
            <div><div class="stat-label">TIN</div><div class="stat-value">${loan.tin}%</div></div>
            <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${loan.meses} meses</div></div>
          </div>
          <div class="stat-card" style="display:flex;gap:16px;align-items:center">
            <div><div class="stat-label">Capital</div><div class="stat-value">${FinanceMath.eur(loan.capital)}</div></div>
            <div><div class="stat-label">Apertura</div><div class="stat-value neg">${FinanceMath.eur(loan.capital*(loan.comisionApertura||0)/100)}</div></div>
            <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${loan.fechaInicio}</div></div>
          </div>
        </div>

        ${tieneAmorts ? `
        <div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
          <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
          <div class="grid-4" style="gap:8px">
            <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${FinanceMath.eur(res.ahorroIntereses)}</div></div>
            <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${FinanceMath.eur(res.costeTotalAmort)}</div></div>
            <div><div class="stat-label">Ahorro neto</div><div class="num ${res.ahorroNeto>=0?'pos':'neg'}">${FinanceMath.eur(res.ahorroNeto)}</div></div>
            <div><div class="stat-label">Plazo acortado</div><div class="num pos">${mesesAhorrados > 0 ? mesesAhorrados+' meses' : '—'}</div></div>
          </div>
        </div>` : ''}

        <div class="card-title">Cuadro de amortización</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th><th></th></tr></thead>
          <tbody>${res.tabla.map(row=>`<tr ${row.esAmortizacion?'style="background:var(--yellow-dim)"':''}>
            <td class="num">${row.esAmortizacion?'—':row.mes}</td>
            <td class="num">${row.fecha}</td>
            <td class="num">${row.esAmortizacion?'—':FinanceMath.eur(row.cuota)}</td>
            <td class="num ${row.interes>0?'neg':''}">${FinanceMath.eur(row.interes)}</td>
            <td class="num">${FinanceMath.eur(row.amortizacion)}</td>
            <td class="num">${FinanceMath.eur(row.capitalPendiente)}</td>
            <td>${row.esAmortizacion?`<span class="badge badge-sim">AMORT${row.simulacion?' SIM':''}</span>`:''}</td>
          </tr>`).join('')}</tbody>
        </table></div>

        ${tieneAmorts?`
          <div class="card-title mt-12">Amortizaciones programadas</div>
          ${loan.amortizaciones.map(am=>`<div class="amort-item">
            <span class="num">${am.fecha}</span>
            <span class="num">${FinanceMath.eur(am.cantidad)}</span>
            <span class="badge ${am.simulacion?'badge-sim':'badge-active'}">${am.simulacion?'SIM':'REAL'}</span>
            <span class="badge badge-blue">${am.tipo==='plazo'?'↓ plazo':'↓ cuota'}</span>
            <button class="btn-icon" onclick="LoansModule.openAmortForm('${loan._id}','${am._id}')"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
            <button class="btn-danger btn-sm" onclick="LoansModule.deleteAmort('${loan._id}','${am._id}')">✕</button>
          </div>`).join('')}
        `:''}
      </div>
    </div>`;
  }

  function toggleBody(id) { document.getElementById(`loan-body-${id}`)?.classList.toggle('open'); }

  function openForm(id=null) {
    const loan = id ? State.get('loans').find(l=>l._id===id) : null;
    const html = `
      <div class="grid-2">${UI.input('f-nombre','Nombre','text',loan?.nombre||'','Ej: Hipoteca ING')}${UI.input('f-capital','Capital (€)','number',loan?.capital||'','150000')}</div>
      <div class="grid-3 mt-8">${UI.input('f-tin','TIN (%)','number',loan?.tin||'','2.5')}${UI.input('f-meses','Plazo (meses)','number',loan?.meses||'','360')}${UI.input('f-fecha','Fecha inicio','date',loan?.fechaInicio||new Date().toISOString().slice(0,10))}</div>
      <div class="grid-2 mt-8">${UI.input('f-com-ap','Com. apertura (%)','number',loan?.comisionApertura||0,'1')}${UI.input('f-com-am','Com. amort. (%)','number',loan?.comisionAmort||0,'0.5')}</div>
      <div class="grid-2 mt-8">
        ${UI.diaPagoWidget('loan', loan?.diaPago||'')}
        ${UI.accountSelect('f-cuenta','Cuenta bancaria',loan?.cuenta||'default')}
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Simulación</label>
        <label class="toggle"><input type="checkbox" id="f-sim" ${loan?.simulacion?'checked':''}/><span class="toggle-slider"></span></label>
        <label class="form-label" style="margin-left:12px">Activo</label>
        <label class="toggle"><input type="checkbox" id="f-activo" ${loan?.activo!==false?'checked':''}/><span class="toggle-slider"></span></label>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="LoansModule.saveLoan('${id||''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id ? 'Editar préstamo' : 'Nuevo préstamo');
  }

  function saveLoan(id) {
    const loan = {
      nombre:          document.getElementById('f-nombre').value.trim(),
      capital:         parseFloat(document.getElementById('f-capital').value),
      tin:             parseFloat(document.getElementById('f-tin').value),
      meses:           parseInt(document.getElementById('f-meses').value),
      fechaInicio:     document.getElementById('f-fecha').value,
      comisionApertura:parseFloat(document.getElementById('f-com-ap').value)||0,
      comisionAmort:   parseFloat(document.getElementById('f-com-am').value)||0,
      diaPago:         UI.getDiaPagoValue('loan'),
      cuenta:          document.getElementById('f-cuenta').value,
      simulacion:      document.getElementById('f-sim').checked,
      activo:          document.getElementById('f-activo').checked,
    };
    if (!loan.nombre||isNaN(loan.capital)||isNaN(loan.tin)||isNaN(loan.meses)) {
      UI.toast('Completa los campos obligatorios','err'); return;
    }
    if (id) { State.updateItem('loans',id,loan); UI.toast('Préstamo actualizado'); }
    else    { State.addItem('loans',{...loan,amortizaciones:[]}); UI.toast('Préstamo creado'); }
    UI.closeModal(); render();
  }

  function deleteLoan(id) {
    if (!UI.confirm('¿Eliminar préstamo?')) return;
    State.removeItem('loans',id); UI.toast('Eliminado'); render();
  }

  function openAmortForm(loanId, amortId=null) {
    const loan = State.get('loans').find(l=>l._id===loanId);
    const am = amortId ? (loan.amortizaciones||[]).find(a=>a._id===amortId) : null;
    const html = `
      <div class="grid-2">${UI.input('am-fecha','Fecha','date',am?.fecha||new Date().toISOString().slice(0,10))}${UI.input('am-cant','Cantidad (€)','number',am?.cantidad||'','10000')}</div>
      <div class="mt-8">${UI.select('am-tipo','Efecto',[['cuota','Reducir cuota (mantener plazo)'],['plazo','Reducir plazo (mantener cuota)']], am?.tipo||'cuota')}</div>
      <div class="form-row mt-8">
        <label class="form-label">Simulación</label>
        <label class="toggle"><input type="checkbox" id="am-sim" ${am?.simulacion?'checked':''}/><span class="toggle-slider"></span></label>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="LoansModule.saveAmort('${loanId}','${amortId||''}')">
          ${amortId ? 'Guardar cambios' : 'Añadir'}
        </button>
      </div>`;
    UI.openModal(html, amortId ? 'Editar amortización' : 'Añadir amortización');
  }

  function saveAmort(loanId, amortId='') {
    const fecha    = document.getElementById('am-fecha').value;
    const cantidad = parseFloat(document.getElementById('am-cant').value);
    const tipo     = document.getElementById('am-tipo').value;
    const sim      = document.getElementById('am-sim').checked;
    if (!fecha||isNaN(cantidad)||cantidad<=0) { UI.toast('Fecha y cantidad requeridas','err'); return; }
    const loan = State.get('loans').find(l=>l._id===loanId);
    let amorts = [...(loan.amortizaciones||[])];
    if (amortId) {
      amorts = amorts.map(a => a._id===amortId ? {...a, fecha, cantidad, tipo, simulacion:sim} : a);
      UI.toast('Amortización actualizada');
    } else {
      amorts.push({ _id:Date.now().toString(36), fecha, cantidad, tipo, simulacion:sim });
      UI.toast('Amortización añadida');
    }
    State.updateItem('loans',loanId,{amortizaciones:amorts});
    UI.closeModal(); render([loanId]);
  }

  function deleteAmort(loanId, amId) {
    const loan = State.get('loans').find(l=>l._id===loanId);
    State.updateItem('loans',loanId,{amortizaciones:(loan.amortizaciones||[]).filter(a=>a._id!==amId)});
    UI.toast('Amortización eliminada'); render([loanId]);
  }

  // ── Optimizador de amortizaciones ────────────────────────────────────────────
  function openOptimizador() {
    const loans = State.get('loans').filter(l => l.activo && !l.simulacion);
    if (loans.length === 0) { UI.toast('No hay préstamos activos para optimizar', 'err'); return; }
    const config = State.get('config');
    // Fecha objetivo sugerida: fin del horizonte del dashboard o +5 años
    const fechaSugerida = config.dashboardEnd ||
      new Date(new Date().getFullYear() + 5, 0, 1).toISOString().slice(0, 10);

    const html = `
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar usando el excedente mensual
        por encima del colchón económico (${FinanceMath.eur(FinanceMath.calcColchon(State.get('expenses'), config, loans))}).
        Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>
      <div class="grid-2" style="gap:10px">
        ${UI.input('opt-horizonte','Horizonte (meses)','number','60','60')}
        ${UI.input('opt-frecuencia','Frecuencia manual (cada N meses)','number','1','1')}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${UI.input('opt-min','Importe mínimo por amortización (€)','number','500','500')}
        ${UI.select('opt-tipo','Efecto de la amortización',[['plazo','Reducir plazo (mantener cuota)'],['cuota','Reducir cuota (mantener plazo)']],'plazo')}
      </div>
      <div class="mt-8">
        ${UI.input('opt-fecha-obj','Fecha objetivo para comparar saldo','date', fechaSugerida)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-secondary" onclick="LoansModule.runComparador()">📊 Comparar frecuencias</button>
        <button class="btn-primary" onclick="LoansModule.runOptimizador()">Calcular plan manual</button>
      </div>`;
    UI.openModal(html, '✨ Optimizar amortizaciones');
  }

  function runComparador() {
    const horizonte  = Math.max(1, parseInt(document.getElementById('opt-horizonte')?.value) || 60);
    const minAmort   = Math.max(0, parseFloat(document.getElementById('opt-min')?.value) || 500);
    const tipoAmort  = document.getElementById('opt-tipo')?.value || 'plazo';
    const fechaObj   = document.getElementById('opt-fecha-obj')?.value || null;

    // Limpiar opt_ previas
    const loansActuales = State.get('loans');
    for (const loan of loansActuales) {
      const sinOpt = (loan.amortizaciones || []).filter(a => !String(a._id).startsWith('opt_'));
      if (sinOpt.length !== (loan.amortizaciones || []).length)
        State.updateItem('loans', loan._id, { amortizaciones: sinOpt });
    }

    const loans    = State.get('loans');
    const expenses = State.get('expenses');
    const accounts = State.get('accounts');
    const config   = State.get('config');

    UI.openModal(`<div style="text-align:center;padding:30px">
      <div style="font-size:24px;margin-bottom:10px">⏳</div>
      <div class="text-sm">Calculando comparativa de frecuencias…</div>
    </div>`, 'Comparando…');

    // Defer para que el modal de "cargando" se pinte antes del cálculo síncrono
    setTimeout(() => {
      const comparativa = FinanceMath.compararFrecuencias(loans, expenses, accounts, config, {
        horizonte, minAmortizable: minAmort, tipoAmort, fechaObjetivo: fechaObj,
        frecuencias: [1, 2, 3, 6, 12],
      });

      if (comparativa.resultados.length === 0) {
        UI.openModal(`<div style="text-align:center;padding:20px">
          <div style="font-size:32px;margin-bottom:12px">🔍</div>
          <div class="card-title">Sin excedente disponible</div>
          <div class="text-sm mt-8">No hay excedente suficiente en ninguna frecuencia.</div>
          <div class="flex gap-8 mt-16" style="justify-content:center">
            <button class="btn-secondary" onclick="LoansModule.openOptimizador()">← Volver</button>
          </div>
        </div>`, 'Sin resultados');
        return;
      }

      const { resultados, saldoBase, fechaObjetivo } = comparativa;

      // Tabla comparativa
      const filas = resultados.map(r => {
        const mejores = [r.esMejorIntereses && '💰 +intereses', r.esMejorSaldo && '🏦 +saldo', r.esMejorValor && '⭐ +valor total']
          .filter(Boolean).join(' ');
        return `<tr style="${r.esMejorValor ? 'background:rgba(0,229,160,0.06);' : ''}">
          <td style="font-weight:600">${r.label}</td>
          <td class="num">${r.numAmortizaciones}</td>
          <td class="num neg">${FinanceMath.eur(r.totalAmortizado)}</td>
          <td class="num pos">${FinanceMath.eur(r.ahorroIntereses)}</td>
          <td class="num ${r.saldoObjetivo >= saldoBase ? 'pos' : 'neg'}">${FinanceMath.eur(r.saldoObjetivo)}</td>
          <td class="num pos">${FinanceMath.eur(r.valorTotal)}</td>
          <td style="font-size:11px">${mejores}</td>
          <td><button class="btn-secondary btn-sm" onclick="LoansModule.aplicarDesdeComparador(${r.frecuencia})">Usar</button></td>
        </tr>`;
      }).join('');

      // Guardar resultados para poder aplicar el seleccionado
      window._comparadorResultados = comparativa;

      const html = `
        <div class="auth-hint mb-12">
          Saldo base sin amortizaciones a ${fechaObjetivo}: <strong>${FinanceMath.eur(saldoBase)}</strong>.
          "Valor total" = ahorro intereses + ganancia de saldo vs no amortizar.
          ⭐ marca la frecuencia que maximiza valor total.
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;font-size:12px">
            <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
              <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th>
              <th>Ahorro int.</th><th>Saldo ${fechaObjetivo.slice(0,7)}</th>
              <th>Valor total</th><th>Mejor en</th><th></th>
            </tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
        <div class="flex gap-8 mt-16" style="justify-content:flex-end">
          <button class="btn-secondary" onclick="LoansModule.openOptimizador()">← Cambiar parámetros</button>
          <button class="btn-secondary" onclick="UI.closeModal()">Cerrar</button>
        </div>`;
      UI.openModal(html, `📊 Comparativa de frecuencias · hasta ${fechaObjetivo}`);
    }, 30);
  }

  function aplicarDesdeComparador(frecuencia) {
    const comp = window._comparadorResultados;
    if (!comp) return;
    const r = comp.resultados.find(r => r.frecuencia === frecuencia);
    if (!r) return;
    // Limpiar opt_ previas
    const loansActuales = State.get('loans');
    for (const loan of loansActuales) {
      const sinOpt = (loan.amortizaciones || []).filter(a => !String(a._id).startsWith('opt_'));
      if (sinOpt.length !== (loan.amortizaciones || []).length)
        State.updateItem('loans', loan._id, { amortizaciones: sinOpt });
    }
    // Aplicar el plan de la frecuencia seleccionada
    aplicarPlanOptimizado(r.plan, r.plan[0]?.tipoAmort || 'plazo');
    // Mostrar detalle del plan seleccionado
    const tipoAmort = r.plan[0]?.tipoAmort || 'plazo';
    setTimeout(() => {
      // Mostrar resumen del plan aplicado
      const planRows = r.plan.map(p => `
        <tr>
          <td class="num">${p.mes}</td>
          <td>${p.loanNombre}</td>
          <td class="num" style="color:var(--yellow)">${p.tin.toFixed(2)}%</td>
          <td class="num">${FinanceMath.eur(p.capitalAntes)}</td>
          <td class="num neg">${FinanceMath.eur(p.cantidadAmort)}${p.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${FinanceMath.eur(p.comision)} com.</span>`:''}</td>
          <td class="num">${FinanceMath.eur(p.capitalDespues)}</td>
        </tr>`).join('');
      const resumenRows = r.resumenPorLoan.map(rl => `
        <div class="card mb-8" style="padding:12px">
          <div class="flex justify-between items-center mb-8">
            <span style="font-weight:600">${rl.nombre}</span>
            <span class="badge badge-yellow">${rl.tin}% TIN</span>
          </div>
          <div class="grid-4" style="gap:8px;font-size:12px">
            <div><div class="stat-label">Fecha fin</div>
              <div class="num" style="text-decoration:line-through;color:var(--text3)">${rl.fechaFinSin}</div>
              <div class="num pos">${rl.fechaFinCon}</div></div>
            <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${rl.mesesAhorrados > 0 ? rl.mesesAhorrados+'m' : '—'}</div></div>
            <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${FinanceMath.eur(rl.ahorroIntereses)}</div></div>
            <div><div class="stat-label">${rl.numAmortizaciones} amorts.</div><div class="num">${FinanceMath.eur(rl.totalAmortizado)}</div></div>
          </div>
        </div>`).join('');
      const html = `
        <div class="grid-4 mb-14" style="gap:10px">
          <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${FinanceMath.eur(r.totalAmortizado)}</div></div>
          <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${FinanceMath.eur(r.ahorroIntereses)}</div></div>
          <div class="stat-card"><div class="stat-label">Saldo ${comp.fechaObjetivo.slice(0,7)}</div><div class="stat-value pos">${FinanceMath.eur(r.saldoObjetivo)}</div></div>
          <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${FinanceMath.eur(r.totalComisiones)}</div></div>
        </div>
        ${resumenRows}
        <div class="card-title mt-12 mb-8">Plan mes a mes (${r.plan.length} amortizaciones)</div>
        <div style="max-height:260px;overflow-y:auto">
          <table class="table-wrap" style="width:100%">
            <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
            <tbody>${planRows}</tbody>
          </table>
        </div>
        <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertir en real.</div>
        <div class="flex gap-8 mt-12" style="justify-content:flex-end">
          <button class="btn-secondary" onclick="UI.closeModal()">Cerrar</button>
        </div>`;
      UI.openModal(html, `✨ Plan ${r.label} · aplicado`);
    }, 50);
  }

  function runOptimizador() {
    const horizonte    = Math.max(1, parseInt(document.getElementById('opt-horizonte')?.value) || 60);
    const frecuencia   = Math.max(1, parseInt(document.getElementById('opt-frecuencia')?.value) || 1);
    const minAmort     = Math.max(0, parseFloat(document.getElementById('opt-min')?.value) || 500);
    const tipoAmort    = document.getElementById('opt-tipo')?.value || 'plazo';

    // Limpiar amortizaciones optimizadas previas antes de calcular
    // (por si el usuario ya aplicó un plan y quiere recalcular con parámetros distintos)
    const loansActuales = State.get('loans');
    let habiaPlan = false;
    for (const loan of loansActuales) {
      const amortsSinOpt = (loan.amortizaciones || []).filter(a => !String(a._id).startsWith('opt_'));
      if (amortsSinOpt.length !== (loan.amortizaciones || []).length) {
        State.updateItem('loans', loan._id, { amortizaciones: amortsSinOpt });
        habiaPlan = true;
      }
    }
    if (habiaPlan) UI.toast('Plan anterior eliminado, recalculando…');

    const loans    = State.get('loans');
    const expenses = State.get('expenses');
    const accounts = State.get('accounts');
    const config   = State.get('config');

    const resultado = FinanceMath.optimizarAmortizaciones(loans, expenses, accounts, config, {
      frecuencia, mesesHorizonte: horizonte, minAmortizable: minAmort, tipoAmort
    });

    if (resultado.plan.length === 0) {
      UI.openModal(`
        <div style="text-align:center;padding:20px">
          <div style="font-size:32px;margin-bottom:12px">🔍</div>
          <div class="card-title">Sin excedente disponible</div>
          <div class="text-sm mt-8">Con el colchón configurado de <strong>${FinanceMath.eur(resultado.colchon)}</strong>,
          no hay excedente suficiente en los próximos ${horizonte} meses para generar amortizaciones
          por encima del mínimo de ${FinanceMath.eur(minAmort)}.</div>
          <div class="text-sm mt-8" style="color:var(--text3)">
            Prueba a reducir el colchón económico, el mínimo de amortización, o ampliar el horizonte.
          </div>
          <div class="flex gap-8 mt-16" style="justify-content:center">
            <button class="btn-secondary" onclick="LoansModule.openOptimizador()">← Cambiar parámetros</button>
            <button class="btn-secondary" onclick="UI.closeModal()">Cerrar</button>
          </div>
        </div>`, 'Sin resultados');
      return;
    }

    // Tabla del plan
    const planRows = resultado.plan.map(p => `
      <tr>
        <td class="num">${p.mes}</td>
        <td>${p.loanNombre}</td>
        <td class="num" style="color:var(--yellow)">${p.tin.toFixed(2)}%</td>
        <td class="num">${FinanceMath.eur(p.capitalAntes)}</td>
        <td class="num neg">${FinanceMath.eur(p.cantidadAmort)}${p.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${FinanceMath.eur(p.comision)} com.</span>`:''}</td>
        <td class="num">${FinanceMath.eur(p.capitalDespues)}</td>
        <td class="num" style="color:var(--text3)">${FinanceMath.eur(p.saldoMinMes)} → ${FinanceMath.eur(p.saldoDespuesMes)}</td>
      </tr>`).join('');

    // Resumen por préstamo
    const resumenRows = resultado.resumenPorLoan.map(r => `
      <div class="card mb-8" style="padding:12px">
        <div class="flex justify-between items-center mb-8">
          <span style="font-weight:600">${r.nombre}</span>
          <span class="badge badge-yellow">${r.tin}% TIN</span>
        </div>
        <div class="grid-4" style="gap:8px;font-size:12px">
          <div>
            <div class="stat-label">Fecha fin original</div>
            <div class="num" style="text-decoration:line-through;color:var(--text3)">${r.fechaFinSin}</div>
            <div class="num pos">${r.fechaFinCon}</div>
          </div>
          <div>
            <div class="stat-label">Plazo ahorrado</div>
            <div class="num pos">${r.mesesAhorrados > 0 ? r.mesesAhorrados+' meses' : '—'}</div>
          </div>
          <div>
            <div class="stat-label">Ahorro intereses</div>
            <div class="num pos">${FinanceMath.eur(r.ahorroIntereses)}</div>
          </div>
          <div>
            <div class="stat-label">${r.numAmortizaciones} amortizaciones</div>
            <div class="num">${FinanceMath.eur(r.totalAmortizado)}</div>
          </div>
        </div>
      </div>`).join('');

    const stateKey = `_opt_${Date.now()}`; // para pasar el resultado al aplicar

    const html = `
      <!-- Resumen global -->
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${FinanceMath.eur(resultado.totalAmortizado)}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${FinanceMath.eur(resultado.totalAhorroIntereses)}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${FinanceMath.eur(resultado.totalComisiones)}</div></div>
        <div class="stat-card"><div class="stat-label">Colchón respetado</div><div class="stat-value">${FinanceMath.eur(resultado.colchon)}</div></div>
      </div>

      <!-- Resumen por préstamo -->
      ${resumenRows}

      <!-- Tabla detalle del plan -->
      <div class="card-title mt-12 mb-8">Plan mes a mes (${resultado.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr>
            <th>Mes</th><th>Préstamo</th><th>TIN</th>
            <th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th>
          </tr></thead>
          <tbody>${planRows}</tbody>
        </table>
      </div>

      <div class="auth-hint mt-12">
        Las amortizaciones se añaden como <strong>simulaciones</strong> y no afectan tus datos reales
        hasta que las conviertas en reales manualmente desde cada préstamo.
      </div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" onclick="LoansModule.openOptimizador()">← Cambiar parámetros</button>
        <button class="btn-secondary" onclick="UI.closeModal()">Descartar</button>
        <button class="btn-primary" onclick="LoansModule.aplicarPlanOptimizado(${JSON.stringify(resultado.plan).replace(/"/g,'&quot;')}, '${tipoAmort}')">
          Aplicar plan como simulación
        </button>
      </div>`;
    UI.openModal(html, `✨ Plan de optimización · ${frecuencia === 1 ? 'Mensual' : `Cada ${frecuencia} meses`} · ${horizonte}m`);
  }

  function aplicarPlanOptimizado(plan, tipoAmort) {
    if (!plan || plan.length === 0) return;
    const loans = State.get('loans');

    // Agrupar amortizaciones por préstamo
    const porLoan = {};
    for (const p of plan) {
      if (!porLoan[p.loanId]) porLoan[p.loanId] = [];
      porLoan[p.loanId].push({
        _id:       `opt_${p.mes}_${p.loanId}`,
        fecha:     p.fechaAmort,
        cantidad:  p.cantidadAmort,
        tipo:      tipoAmort,
        simulacion: true,
      });
    }

    let aplicados = 0;
    for (const loan of loans) {
      if (!porLoan[loan._id]) continue;
      // Eliminar amortizaciones optimizadas previas (por si se re-aplica)
      const amortsSinOpt = (loan.amortizaciones || []).filter(a => !a._id.startsWith('opt_'));
      const nuevasAmorts = [...amortsSinOpt, ...porLoan[loan._id]];
      State.updateItem('loans', loan._id, { amortizaciones: nuevasAmorts });
      aplicados++;
    }

    UI.toast(`Plan aplicado: ${plan.length} amortizaciones en ${aplicados} préstamo${aplicados!==1?'s':''} (simulación)`);
    UI.closeModal();
    render(Object.keys(porLoan));
  }

  return { render, saveLoan, deleteAmort, openAmortForm, saveAmort, openOptimizador, runOptimizador, runComparador, aplicarDesdeComparador, aplicarPlanOptimizado, toggleFinalizados };
})();
