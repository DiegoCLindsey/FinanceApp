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

    // ── Inflación ─────────────────────────────────────────────────────────────
    const config       = State.get('config');
    const periodos     = State.get('inflacion') || [];
    const conInflac    = config.usarInflacion && periodos.length > 0;
    const inflGlobal   = config.inflacionGlobal || 0;
    const hoyStr       = new Date().toISOString().slice(0, 10);

    // ── Tipo de interés real (Fisher) ─────────────────────────────────────────
    // Usamos periodos de inflación + fallback a inflacionGlobal, independientemente
    // de si el módulo de inflación está activo para gastos (usarInflacion).
    const hasInflData  = periodos.length > 0 || inflGlobal > 0;
    const fechaInicioLoan = loan.fechaInicio || hoyStr;
    const fechaFinLoan    = res.fechaFin || hoyStr;
    const inflMedia    = hasInflData
      ? FinanceMath.calcInflacionMediaAnual(periodos, fechaInicioLoan, fechaFinLoan, inflGlobal)
      : 0;
    const tinReal      = hasInflData
      ? FinanceMath.calcTipoRealFisher(loan.tin || 0, inflMedia)
      : null;

    // ── Ahorro real por amortizaciones (intereses en € de hoy) ───────────────
    let ahorroRealIntereses = null;
    let ahorroRealNeto      = null;
    const amortizacionesSavings = []; // [{nominalSaving, realSaving}] por amortización
    if (tieneAmorts && hasInflData && periodos.length > 0) {
      // Ahorro total real: diferencia de intereses deflactados entre plan sin/con amorts
      const interesesPV = (tabla) => tabla.reduce((s, r) => {
        if (r.esAmortizacion) return s;
        const f = FinanceMath.calcFactorInflacion(periodos, hoyStr, r.fecha);
        return s + (f > 0 ? r.interes / f : r.interes);
      }, 0);
      ahorroRealIntereses = interesesPV(res.sinAmort.tabla) - interesesPV(res.tabla);
      ahorroRealNeto = ahorroRealIntereses - res.costeTotalAmort;

      // Por amortización: análisis marginal secuencial
      const amorts = loan.amortizaciones || [];
      for (let idx = 0; idx < amorts.length; idx++) {
        const loanBase = { ...loan, amortizaciones: amorts.slice(0, idx) };
        const loanWith = { ...loan, amortizaciones: amorts.slice(0, idx + 1) };
        const tBase    = FinanceMath.resumenPrestamo(loanBase).tabla;
        const tWith    = FinanceMath.resumenPrestamo(loanWith).tabla;
        const nomSaving  = FinanceMath.resumenPrestamo(loanBase).totalIntereses
                         - FinanceMath.resumenPrestamo(loanWith).totalIntereses;
        const realSaving = interesesPV(tBase) - interesesPV(tWith);
        amortizacionesSavings.push({ nominalSaving: nomSaving, realSaving });
      }
    } else if (tieneAmorts && hasInflData && inflGlobal > 0) {
      // Solo inflacionGlobal sin periodos: usar factor promedio desde hoy hasta fechaFin
      const factorTotal = FinanceMath.calcFactorInflacion(
        [{ year: new Date().getFullYear(), tasa: inflGlobal }], hoyStr, fechaFinLoan
      );
      ahorroRealIntereses = factorTotal > 0 ? res.ahorroIntereses / factorTotal : res.ahorroIntereses;
      ahorroRealNeto = ahorroRealIntereses - res.costeTotalAmort;
      const amorts = loan.amortizaciones || [];
      amorts.forEach((_, idx) => {
        const loanBase   = { ...loan, amortizaciones: amorts.slice(0, idx) };
        const loanWith   = { ...loan, amortizaciones: amorts.slice(0, idx + 1) };
        const nomSaving  = FinanceMath.resumenPrestamo(loanBase).totalIntereses
                         - FinanceMath.resumenPrestamo(loanWith).totalIntereses;
        const realSaving = factorTotal > 0 ? nomSaving / factorTotal : nomSaving;
        amortizacionesSavings.push({ nominalSaving: nomSaving, realSaving });
      });
    }

    let costoRealTotal = null;
    let costoRealSinAmort = null;
    if (conInflac) {
      // Compute real cost (today's €) for the plan WITH amortizations
      costoRealTotal = res.tabla.reduce((s, r) => {
        const f = FinanceMath.calcFactorInflacion(periodos, hoyStr, r.fecha);
        const amount = r.esAmortizacion ? (r.amortizacion + r.comisionAmort) : r.cuota;
        return s + (f > 0 ? amount / f : amount);
      }, 0) + (res.comAp || 0);

      // Compute real cost WITHOUT amortizations to get a meaningful comparison
      if (res.sinAmort && res.sinAmort.tabla) {
        costoRealSinAmort = res.sinAmort.tabla.reduce((s, r) => {
          const f = FinanceMath.calcFactorInflacion(periodos, hoyStr, r.fecha);
          const amount = r.esAmortizacion ? (r.amortizacion + r.comisionAmort) : r.cuota;
          return s + (f > 0 ? amount / f : amount);
        }, 0) + (res.comAp || 0);
      }
    }

    return `<div class="loan-card" id="loan-${loan._id}" style="${completado?'opacity:0.65':''}">
      <div class="loan-card-header" data-loan-id="${loan._id}">
        <div class="flex gap-8 items-center" style="flex-wrap:wrap">
          <span class="loan-card-title">${loan.nombre}</span>
          ${completado?'<span class="badge badge-active" style="background:rgba(0,229,160,0.15);color:var(--accent)">✓ Finalizado</span>':''}
          ${loan.simulacion?'<span class="badge badge-sim">SIM</span>':''}
          ${!loan.activo?'<span class="badge badge-inactive">Inactivo</span>':''}
          ${loan.tipoTasa==='variable'?'<span class="badge badge-orange">Variable</span>':''}
          ${loan.basico!==false?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':''}
          ${(loan.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}
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
          <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
            <div><div class="stat-label">TAE</div><div class="stat-value">${FinanceMath.pct(res.tae)}</div></div>
            <div><div class="stat-label">TIN</div><div class="stat-value">${loan.tin}%</div></div>
            ${tinReal !== null ? `<div title="Tipo de interés real (Fisher): TIN ajustado por inflación media del ${inflMedia.toFixed(2)}% anual durante el préstamo">
              <div class="stat-label">TIN real</div>
              <div class="stat-value" style="color:${tinReal<=0?'var(--accent)':tinReal<loan.tin?'var(--yellow)':'var(--text)'}">${tinReal.toFixed(2)}%
                <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${inflMedia.toFixed(1)}%)</span>
              </div>
            </div>` : ''}
            <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${loan.meses} meses</div></div>
          </div>
          <div class="stat-card" style="display:flex;gap:16px;align-items:center">
            <div><div class="stat-label">Capital</div><div class="stat-value">${FinanceMath.eur(loan.capital)}</div></div>
            <div><div class="stat-label">Apertura</div><div class="stat-value neg">${FinanceMath.eur(loan.capital*(loan.comisionApertura||0)/100)}</div></div>
            <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${loan.fechaInicio}</div></div>
          </div>
        </div>

        ${!tieneAmorts ? `
        <div class="loan-optim-cta">
          <div class="loan-optim-cta-text">
            <strong>¿Quieres pagar menos intereses?</strong>
            Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
          </div>
          <button class="btn-primary btn-sm" data-amort-loan="${loan._id}">+ Amortizar</button>
          <button class="btn-secondary btn-sm" onclick="LoansModule.openOptimizador()">✨ Optimizar</button>
        </div>` : ''}
        ${tieneAmorts ? `
        <div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
          <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
          ${ahorroRealIntereses !== null ? `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
            <div>
              <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div>
              <div class="num pos">${FinanceMath.eur(res.ahorroIntereses)}</div>
            </div>
            <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
              <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
              <div class="num pos" style="color:var(--yellow)">${FinanceMath.eur(ahorroRealIntereses)}</div>
            </div>
            <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${FinanceMath.eur(res.costeTotalAmort)}</div></div>
            <div>
              <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div>
              <div class="num ${res.ahorroNeto>=0?'pos':'neg'}">${FinanceMath.eur(res.ahorroNeto)}</div>
            </div>
            <div title="Ahorro neto en euros de hoy">
              <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
              <div class="num ${ahorroRealNeto>=0?'pos':'neg'}" style="color:var(--yellow)">${FinanceMath.eur(ahorroRealNeto)}</div>
            </div>
            <div><div class="stat-label">Plazo acortado</div><div class="num pos">${mesesAhorrados > 0 ? mesesAhorrados+' meses' : '—'}</div></div>
          </div>
          <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando inflación media ${inflMedia.toFixed(1)}% anual</div>
          ` : `
          <div class="grid-4" style="gap:8px">
            <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${FinanceMath.eur(res.ahorroIntereses)}</div></div>
            <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${FinanceMath.eur(res.costeTotalAmort)}</div></div>
            <div><div class="stat-label">Ahorro neto</div><div class="num ${res.ahorroNeto>=0?'pos':'neg'}">${FinanceMath.eur(res.ahorroNeto)}</div></div>
            <div><div class="stat-label">Plazo acortado</div><div class="num pos">${mesesAhorrados > 0 ? mesesAhorrados+' meses' : '—'}</div></div>
          </div>
          `}
        </div>` : ''}

        ${conInflac && costoRealTotal !== null ? (() => {
          const tieneAmortConReal = tieneAmorts && costoRealSinAmort !== null;
          if (tieneAmortConReal) {
            const ahorro = costoRealSinAmort - costoRealTotal;
            const esAhorro = ahorro >= 0;
            const ahorroLabel = esAhorro ? 'Ahorro real neto' : 'Sobrecoste real neto';
            const ahorroValor = esAhorro
              ? `−${FinanceMath.eur(ahorro)}`
              : `+${FinanceMath.eur(-ahorro)}`;
            return `
        <div class="card mb-12" style="background:var(--bg3);padding:12px">
          <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
          <div class="grid-3" style="gap:8px">
            <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${FinanceMath.eur(costoRealSinAmort)}</div></div>
            <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${FinanceMath.eur(costoRealTotal)}</div></div>
            <div><div class="stat-label">${ahorroLabel}</div><div class="num ${esAhorro?'pos':'neg'}">${ahorroValor}</div></div>
          </div>
          <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
          ${loan.tipoTasa==='variable'?`<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>`:''}
        </div>`;
          } else {
            const beneficio = res.totalPagado - costoRealTotal;
            const esBeneficio = beneficio >= 0;
            const beneficioLabel = esBeneficio ? 'Ahorro por inflación' : 'Sobrecoste real';
            const beneficioValor = esBeneficio
              ? `−${FinanceMath.eur(beneficio)}`
              : `+${FinanceMath.eur(-beneficio)}`;
            return `
        <div class="card mb-12" style="background:var(--bg3);padding:12px">
          <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
          <div class="grid-3" style="gap:8px">
            <div><div class="stat-label">Coste total nominal</div><div class="num neg">${FinanceMath.eur(res.totalPagado)}</div></div>
            <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${esBeneficio?'pos':'neg'}">${FinanceMath.eur(costoRealTotal)}</div></div>
            <div><div class="stat-label">${beneficioLabel}</div><div class="num ${esBeneficio?'pos':'neg'}">${beneficioValor}</div></div>
          </div>
          ${loan.tipoTasa==='variable'?`<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>`:''}
        </div>`;
          }
        })() : ''}

        <div class="card-title">Cuadro de amortización</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>${conInflac?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':''}<th></th></tr></thead>
          <tbody>${res.tabla.map(row=>{
            let precioReal = '';
            if (conInflac && !row.esAmortizacion) {
              const f = FinanceMath.calcFactorInflacion(periodos, hoyStr, row.fecha);
              precioReal = FinanceMath.eur(f > 0 ? row.cuota / f : row.cuota);
            }
            return `<tr ${row.esAmortizacion?'style="background:var(--yellow-dim)"':''}>
              <td class="num">${row.esAmortizacion?'—':row.mes}</td>
              <td class="num">${row.fecha}</td>
              <td class="num">${row.esAmortizacion?'—':FinanceMath.eur(row.cuota)}</td>
              <td class="num ${row.interes>0?'neg':''}">${FinanceMath.eur(row.interes)}</td>
              <td class="num">${FinanceMath.eur(row.amortizacion)}</td>
              <td class="num">${FinanceMath.eur(row.capitalPendiente)}</td>
              ${conInflac?`<td class="num pos" style="font-size:11px">${precioReal}</td>`:''}
              <td>${row.esAmortizacion?`<span class="badge badge-sim">AMORT${row.simulacion?' SIM':''}</span>`:''}</td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>

        ${tieneAmorts?`
          <div class="card-title mt-12">Amortizaciones programadas</div>
          ${(loan.amortizaciones||[]).map((am, idx)=>{
            const sav = amortizacionesSavings[idx] || null;
            return `<div class="amort-item" style="flex-wrap:wrap">
              <span class="num">${am.fecha}</span>
              <span class="num">${FinanceMath.eur(am.cantidad)}</span>
              <span class="badge ${am.simulacion?'badge-sim':'badge-active'}">${am.simulacion?'SIM':'REAL'}</span>
              <span class="badge badge-blue">${am.tipo==='plazo'?'↓ plazo':'↓ cuota'}</span>
              ${(am.escenarioIds||[]).map(id=>`<span class="badge badge-yellow">🔭 ${EscenariosModule.escenarioName(id)}</span>`).join('')}
              ${sav ? `<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses marginal atribuible a esta amortización">
                Ahorro: <span class="pos">${FinanceMath.eur(sav.nominalSaving)}</span> nominal
                · <span style="color:var(--yellow)">${FinanceMath.eur(sav.realSaving)} real</span>
              </span>` : ''}
              <button class="btn-icon" onclick="LoansModule.openAmortForm('${loan._id}','${am._id}')"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
              <button class="btn-danger btn-sm" onclick="LoansModule.deleteAmort('${loan._id}','${am._id}')">✕</button>
            </div>`;
          }).join('')}
        `:''}
      </div>
    </div>`;
  }

  function toggleBody(id) { document.getElementById(`loan-body-${id}`)?.classList.toggle('open'); }

  function openForm(id=null) {
    const loan = id ? State.get('loans').find(l=>l._id===id) : null;
    const escenarios = State.get('escenarios') || [];
    const html = `
      <!-- Campos básicos -->
      <div class="grid-2">${UI.input('f-nombre','Nombre del préstamo','text',loan?.nombre||'','Ej: Hipoteca ING')}${UI.input('f-capital','Importe pendiente (€)','number',loan?.capital||'','150000')}</div>
      <div class="grid-3 mt-8">${UI.input('f-tin','Tipo de interés TIN (%)','number',loan?.tin||'','2.5')}${UI.input('f-meses','Plazo (meses)','number',loan?.meses||'','360')}${UI.input('f-fecha','Fecha de inicio','date',loan?.fechaInicio||new Date().toISOString().slice(0,10))}</div>

      <!-- Opciones avanzadas -->
      <details class="form-advanced mt-12" ${id ? 'open' : ''}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="grid-2 mt-8">
            ${UI.accountSelect('f-cuenta','Cuenta bancaria',loan?.cuenta||'default')}
            ${UI.diaPagoWidget('loan', loan?.diaPago||'')}
          </div>
          <div class="mt-8">
            ${UI.select('f-tipo-tasa','Tipo de interés',[['fijo','Tipo fijo — la cuota no varía'],['variable','Tipo variable — la cuota puede cambiar con el mercado']], loan?.tipoTasa||'fijo')}
          </div>
          <div class="grid-2 mt-8">${UI.input('f-com-ap','Com. apertura (%)','number',loan?.comisionApertura||0,'1')}${UI.input('f-com-am','Com. amort. anticipada (%)','number',loan?.comisionAmort||0,'0.5')}</div>
          <div class="form-group mt-8">
            <label class="form-label">Etiquetas (separadas por coma)</label>
            <input class="form-input" type="text" id="f-tags" value="${(loan?.tags||[]).join(', ')}" placeholder="hipoteca, vivienda"/>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Gasto básico</label>
            <label class="toggle"><input type="checkbox" id="f-basico" ${loan?.basico!==false?'checked':''}/><span class="toggle-slider"></span></label>
            <span class="text-sm" style="margin-left:6px">Incluir la cuota en el cálculo del colchón económico</span>
          </div>
          ${escenarios.length > 0 ? EscenariosModule.checkboxesHtml(loan?.escenarioIds||[]) : ''}
          <div class="form-row mt-8">
            <label class="form-label">Activo</label>
            <label class="toggle"><input type="checkbox" id="f-activo" ${loan?.activo!==false?'checked':''}/><span class="toggle-slider"></span></label>
            <label class="form-label" style="margin-left:12px">Simulación</label>
            <label class="toggle"><input type="checkbox" id="f-sim" ${loan?.simulacion?'checked':''}/><span class="toggle-slider"></span></label>
            <label class="form-label" style="margin-left:12px">Mostrar fin en dashboard</label>
            <label class="toggle"><input type="checkbox" id="f-mostrar-fin" ${loan?.mostrarFechaFinEnDashboard!==false?'checked':''}/><span class="toggle-slider"></span></label>
          </div>
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="LoansModule.saveLoan('${id||''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id ? 'Editar préstamo' : 'Nuevo préstamo');
  }

  function saveLoan(id) {
    const loan = {
      nombre:                    document.getElementById('f-nombre').value.trim(),
      capital:                   parseFloat(document.getElementById('f-capital').value),
      tin:                       parseFloat(document.getElementById('f-tin').value),
      meses:                     parseInt(document.getElementById('f-meses').value),
      fechaInicio:               document.getElementById('f-fecha').value,
      comisionApertura:          parseFloat(document.getElementById('f-com-ap').value)||0,
      comisionAmort:             parseFloat(document.getElementById('f-com-am').value)||0,
      diaPago:                   UI.getDiaPagoValue('loan'),
      cuenta:                    document.getElementById('f-cuenta').value,
      simulacion:                document.getElementById('f-sim').checked,
      activo:                    document.getElementById('f-activo').checked,
      mostrarFechaFinEnDashboard:document.getElementById('f-mostrar-fin').checked,
      tipoTasa:                  document.getElementById('f-tipo-tasa').value,
      escenarioIds:              EscenariosModule.readCheckedEscenarios(),
      basico:                    document.getElementById('f-basico').checked,
      tags:                      (document.getElementById('f-tags')?.value||'').split(',').map(t=>t.trim()).filter(Boolean),
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
      ${EscenariosModule.checkboxesHtml(am?.escenarioIds||[])}
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
    const escIds   = EscenariosModule.readCheckedEscenarios();
    if (!fecha||isNaN(cantidad)||cantidad<=0) { UI.toast('Fecha y cantidad requeridas','err'); return; }
    const loan = State.get('loans').find(l=>l._id===loanId);
    let amorts = [...(loan.amortizaciones||[])];
    if (amortId) {
      amorts = amorts.map(a => a._id===amortId ? {...a, fecha, cantidad, tipo, simulacion:sim, escenarioIds:escIds} : a);
      UI.toast('Amortización actualizada');
    } else {
      amorts.push({ _id:Date.now().toString(36), fecha, cantidad, tipo, simulacion:sim, escenarioIds:escIds });
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

    const loanCheckboxes = loans.map(l => `
      <label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
        <input type="checkbox" class="opt-loan-check" value="${l._id}" ${l.tin >= 5 ? 'checked' : ''} style="accent-color:var(--accent)"/>
        <span style="font-size:13px;flex:1">${l.nombre}</span>
        <span class="badge badge-yellow" style="font-size:11px">${l.tin}% TIN</span>
      </label>`).join('');

    const allAccounts = State.get('accounts').filter(a => a.activo && !a.simulacion);
    const principalId = allAccounts.find(a => a.esCuentaPrincipal)?._id || allAccounts[0]?._id;
    const accountRadios = allAccounts.map(a => `
      <label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
        <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${a._id}" ${a._id === principalId ? 'checked' : ''} style="accent-color:var(--accent)" onchange="LoansModule._updateOptMargins()"/>
        <span style="font-size:13px;flex:1">${a.nombre}${a._id === principalId ? ' <span class="badge badge-blue" style="font-size:10px">principal</span>' : ''}</span>
        <span class="text-sm" style="color:var(--text3)">${FinanceMath.eur(FinanceMath.saldoRealCuenta(a))}</span>
      </label>`).join('');

    const html = `
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen nunca baje de los límites configurados.
        Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${accountRadios || '<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
      </div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${loanCheckboxes}
      </div>
      <button class="btn-secondary btn-sm mb-12" onclick="LoansModule._toggleAllLoans()">Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${UI.input('opt-horizonte','Horizonte (meses)','number','60','60')}
        ${UI.input('opt-frecuencia','Frecuencia manual (cada N meses)','number','1','1')}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${UI.input('opt-min','Importe mínimo por amortización (€)','number','500','500')}
        ${UI.select('opt-tipo','Efecto de la amortización',[['plazo','Reducir plazo (mantener cuota)'],['cuota','Reducir cuota (mantener plazo)']],'plazo')}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${UI.input('opt-fecha-primera','Fecha primera amortización','date','')}
        ${UI.input('opt-fecha-obj','Fecha objetivo para comparar saldo','date', fechaSugerida)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-secondary" onclick="LoansModule.runComparador()">📊 Comparar frecuencias</button>
        <button class="btn-primary" onclick="LoansModule.runOptimizador()">Calcular plan manual</button>
      </div>`;
    UI.openModal(html, '✨ Optimizar amortizaciones');
    _updateOptMargins();
  }

  function _toggleAllLoans() {
    const checks = [...document.querySelectorAll('.opt-loan-check')];
    const allChecked = checks.every(c => c.checked);
    checks.forEach(c => c.checked = !allChecked);
  }

  function _getSelectedLoanIds() {
    const checks = [...document.querySelectorAll('.opt-loan-check')];
    if (checks.length === 0) return null;
    const selected = checks.filter(c => c.checked).map(c => c.value);
    return selected.length === checks.length ? null : selected;
  }

  function _getSelectedAccountId() {
    return document.querySelector('.opt-acc-radio:checked')?.value || null;
  }

  function _getSelectedMarginIds() {
    return [...document.querySelectorAll('.opt-margin-check:checked')].map(el => el.value);
  }

  function _updateOptMargins() {
    const accId = document.querySelector('.opt-acc-radio:checked')?.value;
    const config = State.get('config');
    const margenes = (config.margenesSeguridad || []).filter(m => m.activo !== false);
    const applicable = margenes.filter(m => !m.cuentas || m.cuentas.length === 0 || (accId && m.cuentas.includes(accId)));
    const wrap = document.getElementById('opt-margenes-wrap');
    if (!wrap) return;
    if (applicable.length === 0) {
      wrap.innerHTML = '<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>';
      return;
    }
    wrap.innerHTML = applicable.map(m => `
      <label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
        <input type="checkbox" class="opt-margin-check" value="${m._id}" checked style="accent-color:var(--accent)"/>
        <span style="font-size:13px;flex:1">${m.nombre}</span>
        <span class="text-sm" style="color:var(--text3)">${!m.cuentas || m.cuentas.length === 0 ? 'Todas las cuentas' : 'Esta cuenta'}</span>
      </label>`).join('');
  }

  function runComparador() {
    const horizonte        = Math.max(1, parseInt(document.getElementById('opt-horizonte')?.value) || 60);
    const minAmort         = Math.max(0, parseFloat(document.getElementById('opt-min')?.value) || 500);
    const tipoAmort        = document.getElementById('opt-tipo')?.value || 'plazo';
    const fechaObj         = document.getElementById('opt-fecha-obj')?.value || null;
    const fechaPrimeraAmort= document.getElementById('opt-fecha-primera')?.value || null;
    const loanIds          = _getSelectedLoanIds();
    // Read DOM values BEFORE opening the loading modal (which replaces the form)
    const sourceAccountId  = _getSelectedAccountId();
    const selectedMarginIds = _getSelectedMarginIds();

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
    const nominas  = State.get('nominas') || [];

    UI.openModal(`<div style="text-align:center;padding:30px">
      <div style="font-size:24px;margin-bottom:10px">⏳</div>
      <div class="text-sm">Calculando comparativa de frecuencias…</div>
    </div>`, 'Comparando…');

    // Defer so the loading modal renders before the synchronous computation
    setTimeout(() => {
      const comparativa = FinanceMath.compararFrecuencias(loans, expenses, accounts, config, {
        horizonte, minAmortizable: minAmort, tipoAmort, fechaObjetivo: fechaObj,
        frecuencias: [1, 2, 3, 6, 12], fechaPrimeraAmort, loanIds, nominas, sourceAccountId, selectedMarginIds,
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
    const horizonte        = Math.max(1, parseInt(document.getElementById('opt-horizonte')?.value) || 60);
    const frecuencia       = Math.max(1, parseInt(document.getElementById('opt-frecuencia')?.value) || 1);
    const minAmort         = Math.max(0, parseFloat(document.getElementById('opt-min')?.value) || 500);
    const tipoAmort        = document.getElementById('opt-tipo')?.value || 'plazo';
    const fechaPrimeraAmort= document.getElementById('opt-fecha-primera')?.value || null;
    const loanIds          = _getSelectedLoanIds();

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
    const nominas  = State.get('nominas') || [];

    const sourceAccountId = _getSelectedAccountId();
    const selectedMarginIds = _getSelectedMarginIds();
    const resultado = FinanceMath.optimizarAmortizaciones(loans, expenses, accounts, config, {
      frecuencia, mesesHorizonte: horizonte, minAmortizable: minAmort, tipoAmort,
      fechaPrimeraAmort, loanIds, nominas, sourceAccountId, selectedMarginIds,
    });

    if (resultado.plan.length === 0) {
      UI.openModal(`
        <div style="text-align:center;padding:20px">
          <div style="font-size:32px;margin-bottom:12px">🔍</div>
          <div class="card-title">Sin excedente disponible</div>
          <div class="text-sm mt-8">No hay excedente suficiente respetando los ${resultado.margenesAplicados} márgenes de seguridad activos
          en los próximos ${horizonte} meses para generar amortizaciones por encima del mínimo de ${FinanceMath.eur(minAmort)}.</div>
          <div class="text-sm mt-8" style="color:var(--text3)">
            Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.
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
        <td class="num" style="color:var(--text3)">${FinanceMath.eur(p.saldoDisponible)} → ${FinanceMath.eur(p.saldoDespues)}</td>
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
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${resultado.margenesAplicados}</div></div>
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

  return { render, saveLoan, deleteAmort, openAmortForm, saveAmort, openOptimizador, runOptimizador, runComparador, aplicarDesdeComparador, aplicarPlanOptimizado, toggleFinalizados, _toggleAllLoans, _getSelectedLoanIds, _updateOptMargins };
})();
