// ==================== FINANCE_MATH ====================
// Depends on: State (common/state.js)
const FinanceMath = (() => {
  function cuotaMensual(capital, tinAnual, meses) {
    const r = tinAnual / 100 / 12;
    if (r === 0) return capital / meses;
    return capital * r * Math.pow(1+r, meses) / (Math.pow(1+r, meses) - 1);
  }
  function calcTAE(capital, tinAnual, meses, comApertura=0) {
    const cuota = cuotaMensual(capital, tinAnual, meses);
    const neto = capital * (1 - comApertura/100);
    let r = tinAnual/100/12;
    for (let i=0; i<200; i++) {
      const vp = cuota * (1-Math.pow(1+r,-meses))/r;
      const f = vp - neto;
      const df = cuota*(meses*Math.pow(1+r,-(meses+1))/r - (1-Math.pow(1+r,-meses))/(r*r));
      const nr = r - f/df;
      if (Math.abs(nr-r)<1e-10) { r=nr; break; } r=nr;
    }
    return (Math.pow(1+r,12)-1)*100;
  }

  // ── Día efectivo ──────────────────────────────────────────────────────────
  // Formato diaPago:
  //   ''               → sin ajuste
  //   'dia:N'          → día N del mes (1-31, clamped)
  //   'dia:ultimo'     → último día del mes
  //   'nthweekday:N:W' → N-ésimo (1-5) día de la semana W (0=Dom…6=Sáb)
  //                      N=-1 → último de ese weekday en el mes

  // Dado año y mes (0-based), devuelve la fecha ISO del día efectivo
  function resolverDiaEfectivo(year, month0, diaPago) {
    if (!diaPago) return null;
    if (diaPago.startsWith('dia:')) {
      const spec = diaPago.slice(4);
      if (spec === 'ultimo') return new Date(year, month0+1, 0).toISOString().slice(0,10);
      const n = parseInt(spec);
      if (!isNaN(n)) {
        const maxDay = new Date(year, month0+1, 0).getDate();
        return new Date(year, month0, Math.min(n, maxDay)).toISOString().slice(0,10);
      }
    }
    if (diaPago.startsWith('nthweekday:')) {
      const parts = diaPago.split(':');
      const nth = parseInt(parts[1]), wd = parseInt(parts[2]);
      if (nth === -1) {
        const last = new Date(year, month0+1, 0);
        while (last.getDay() !== wd) last.setDate(last.getDate()-1);
        return last.toISOString().slice(0,10);
      }
      const d = new Date(year, month0, 1);
      while (d.getDay() !== wd) d.setDate(d.getDate()+1);
      d.setDate(d.getDate() + (nth-1)*7);
      if (d.getMonth() !== month0) d.setDate(d.getDate()-7);
      return d.toISOString().slice(0,10);
    }
    return null;
  }

  // Aplica diaPago a una fecha ISO manteniendo año/mes, cambiando sólo el día
  function ajustarFechaPago(fechaISO, diaPago) {
    if (!diaPago) return fechaISO;
    const d = new Date(fechaISO+'T00:00:00');
    return resolverDiaEfectivo(d.getFullYear(), d.getMonth(), diaPago) || fechaISO;
  }

  // Etiqueta legible
  const _DIAS_SEMANA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const _ORDINAL = {'-1':'último','1':'1º','2':'2º','3':'3º','4':'4º','5':'5º'};
  function labelDiaPago(diaPago) {
    if (!diaPago) return '';
    if (diaPago.startsWith('dia:')) {
      const s = diaPago.slice(4);
      return s === 'ultimo' ? 'Último día del mes' : `Día ${s} del mes`;
    }
    if (diaPago.startsWith('nthweekday:')) {
      const parts = diaPago.split(':');
      const nth = parts[1], wd = parseInt(parts[2]);
      return `${_ORDINAL[nth]||nth+'º'} ${_DIAS_SEMANA[wd]} del mes`;
    }
    return diaPago;
  }
  // ── Fin día efectivo ───────────────────────────────────────────────────────

  function tablaAmortizacion(capital, tinAnual, meses, fechaInicio, comAmort=0, amortizaciones=[], loan={}) {
    const rows = [];
    let cap = capital;
    let cur = new Date(fechaInicio+'T00:00:00');
    const r = tinAnual/100/12;
    let mr = meses;
    let cuota = cuotaMensual(cap, tinAnual, mr);
    const amorts = [...amortizaciones].sort((a,b) => new Date(a.fecha)-new Date(b.fecha));
    let ai = 0;
    for (let mes=1; mes<=meses*2 && cap>0.01; mes++) {
      const fd = new Date(cur);
      cur.setMonth(cur.getMonth()+1);
      const fs = ajustarFechaPago(fd.toISOString().slice(0,10), loan.diaPago||'');
      while (ai<amorts.length && amorts[ai].fecha<=fs) {
        const am = amorts[ai];
        const cost = am.cantidad*(comAmort/100);
        cap -= am.cantidad; cap=Math.max(0,cap);
        if (am.tipo==='plazo') { mr=Math.ceil(-Math.log(1-cap*r/cuota)/Math.log(1+r)); }
        else { mr=meses-mes+1; cuota=cuotaMensual(cap,tinAnual,mr); }
        rows.push({ mes:'AMORT', fecha:am.fecha, cuota:0, interes:0, amortizacion:am.cantidad, comisionAmort:cost, capitalPendiente:cap, esAmortizacion:true, simulacion:am.simulacion||false });
        ai++;
        if (cap<0.01) break;
      }
      if (cap<0.01) break;
      const int = cap*r;
      const am = Math.min(cuota-int, cap);
      cap -= am; if (cap<0.01) cap=0;
      rows.push({ mes, fecha:fs, cuota, interes:int, amortizacion:am, comisionAmort:0, capitalPendiente:cap, esAmortizacion:false, simulacion:false });
      mr--;
      if (mr<=0||cap<0.01) break;
    }
    return rows;
  }

  function resumenPrestamo(loan) {
    const { capital, tin, meses, fechaInicio, comisionAmort, amortizaciones, comisionApertura } = loan;
    const tabla = tablaAmortizacion(capital, tin, meses, fechaInicio, comisionAmort||0, amortizaciones||[], loan);
    const totalIntereses = tabla.reduce((s,r)=>s+r.interes,0);
    const totalComAm = tabla.reduce((s,r)=>s+r.comisionAmort,0);
    const comAp = capital*((comisionApertura||0)/100);
    return { cuota:cuotaMensual(capital,tin,meses), totalIntereses, tae:calcTAE(capital,tin,meses,comisionApertura||0), costoTotal:totalIntereses+totalComAm+comAp, comAp, totalComAm, fechaFin:(tabla.filter(r=>!r.esAmortizacion).slice(-1)[0]?.fecha||''), mesesReales:tabla.filter(r=>!r.esAmortizacion).length, tabla };
  }

  function proyectarGastos(expenses, dateStart, dateEnd, filtroAccounts=null) {
    const events = [];
    const dS = new Date(dateStart+'T00:00:00'), dE = new Date(dateEnd+'T00:00:00');
    for (const exp of expenses) {
      if (!exp.activo) continue;
      if (filtroAccounts && filtroAccounts.length>0 && !filtroAccounts.includes(exp.cuenta||'default')) continue;
      const dI = new Date((exp.fechaInicio||dateStart)+'T00:00:00');
      const dF = exp.fechaFin ? new Date(exp.fechaFin+'T00:00:00') : dE;
      const push = (fecha) => events.push({
        fecha, concepto:exp.concepto, cuantia:exp.cuantia, tipo:exp.tipo,
        tags:exp.tags, cuenta:exp.cuenta||'default', sourceId:exp._id, sourceType:'expense'
      });

      if (exp.tipoFrecuencia === 'extraordinario') {
        if (dI >= dS && dI <= dE && dI <= dF) push(exp.fechaInicio);

      } else if (exp.tipoFrecuencia === 'mensual') {
        const freq = Math.max(1, exp.frecuencia || 1);
        // Punto de partida: mes de dI
        let year = dI.getFullYear(), month = dI.getMonth();
        // Límite de seguridad: no más de 20 años hacia adelante
        const maxIter = freq > 0 ? Math.ceil(240 / freq) + 2 : 300;
        for (let iter = 0; iter < maxIter; iter++) {
          // Calcular día efectivo en este mes
          const fechaEfectiva = resolverDiaEfectivo(year, month, exp.diaPago||'') ||
            (() => {
              const dayOfMonth = dI.getDate();
              const lastDay = new Date(year, month+1, 0).getDate();
              return new Date(year, month, Math.min(dayOfMonth, lastDay)).toISOString().slice(0,10);
            })();
          const dEfect = new Date(fechaEfectiva+'T00:00:00');
          // Salir si superamos el fin del rango o de la vigencia
          if (dEfect > dE || dEfect > dF) break;
          // Emitir sólo si está dentro del rango y después del inicio
          if (dEfect >= dS && dEfect >= dI) push(fechaEfectiva);
          // Avanzar freq meses
          month += freq;
          if (month >= 12) { year += Math.floor(month/12); month = month % 12; }
        }

      } else if (exp.tipoFrecuencia === 'diaria') {
        const stepMs = Math.max(1, exp.frecuencia) * 86400000;
        let d = new Date(Math.max(dI.getTime(), dS.getTime()));
        if (dI < dS) {
          const steps = Math.ceil((dS.getTime() - dI.getTime()) / stepMs);
          d = new Date(dI.getTime() + steps * stepMs);
        }
        while (d <= dE && d <= dF) {
          push(d.toISOString().slice(0,10));
          d = new Date(d.getTime() + stepMs);
        }
      }
    }
    return events;
  }

  function proyectarPrestamos(loans, dateStart, dateEnd, filtroAccounts=null) {
    const events = [];
    for (const loan of loans) {
      if (!loan.activo) continue;
      if (filtroAccounts && filtroAccounts.length>0 && !filtroAccounts.includes(loan.cuenta||'default')) continue;
      const { tabla } = resumenPrestamo(loan);
      for (const row of tabla) {
        if (row.fecha>=dateStart && row.fecha<=dateEnd) {
          if (!row.esAmortizacion) events.push({ fecha:row.fecha, concepto:`Cuota ${loan.nombre}`, cuantia:-row.cuota, tipo:'gasto', tags:['prestamo'], cuenta:loan.cuenta||'default', sourceId:loan._id, sourceType:'loan', simulacion:loan.simulacion||false });
          else events.push({ fecha:row.fecha, concepto:`Amort. ${loan.nombre}`, cuantia:-(row.amortizacion+row.comisionAmort), tipo:'gasto', tags:['amortizacion'], cuenta:loan.cuenta||'default', sourceId:loan._id, sourceType:'loan-amort', simulacion:row.simulacion||false });
        }
      }
    }
    return events;
  }

  // Transferencias: tipo especial que resta de origen y suma a destino
  function proyectarTransferencias(expenses, dateStart, dateEnd, filtroAccounts=null) {
    const events = [];
    const dS = new Date(dateStart+'T00:00:00'), dE = new Date(dateEnd+'T00:00:00');
    for (const exp of expenses) {
      if (!exp.activo || exp.tipo !== 'transferencia') continue;
      if (filtroAccounts && filtroAccounts.length > 0) {
        const involucra = filtroAccounts.includes(exp.cuenta||'default') || filtroAccounts.includes(exp.cuentaDestino||'default');
        if (!involucra) continue;
      }
      const dI = new Date((exp.fechaInicio||dateStart)+'T00:00:00');
      const dF = exp.fechaFin ? new Date(exp.fechaFin+'T00:00:00') : dE;
      const pushPair = (fecha) => {
        const addOrigen  = !filtroAccounts || filtroAccounts.length===0 || filtroAccounts.includes(exp.cuenta||'default');
        const addDestino = !filtroAccounts || filtroAccounts.length===0 || filtroAccounts.includes(exp.cuentaDestino||'default');
        if (addOrigen)  events.push({ fecha, concepto:`Transf. → ${State.accountName(exp.cuentaDestino||'default')}: ${exp.concepto}`, cuantia: exp.cuantia, tipo:'gasto',   tags:['transferencia',...(exp.tags||[])], cuenta:exp.cuenta||'default',        sourceId:exp._id, sourceType:'transfer-out' });
        if (addDestino) events.push({ fecha, concepto:`Transf. ← ${State.accountName(exp.cuenta||'default')}: ${exp.concepto}`,      cuantia: exp.cuantia, tipo:'ingreso', tags:['transferencia',...(exp.tags||[])], cuenta:exp.cuentaDestino||'default',  sourceId:exp._id, sourceType:'transfer-in'  });
        // Si la cuenta origen es un fondo de pensiones, generar evento de impuesto
        if (addOrigen) {
          const allAccounts = typeof State !== 'undefined' ? State.get('accounts') : [];
          const cuentaOrigen = allAccounts.find(a => a._id === (exp.cuenta||'default'));
          if (cuentaOrigen?.esFondoPension) {
            const impuesto = calcImpuestoPension(cuentaOrigen, exp.cuantia);
            if (impuesto > 0) {
              events.push({ fecha, concepto:`Impuesto retirada ${cuentaOrigen.nombre} (${cuentaOrigen.impuestoRetirada}% beneficio)`, cuantia: impuesto, tipo:'gasto', tags:['impuesto','pension'], cuenta:exp.cuenta||'default', sourceId:exp._id, sourceType:'pension-tax' });
            }
          }
        }
      };
      if (exp.tipoFrecuencia === 'extraordinario') {
        if (dI >= dS && dI <= dE && dI <= dF) pushPair(exp.fechaInicio);
      } else if (exp.tipoFrecuencia === 'mensual') {
        const freq = Math.max(1, exp.frecuencia||1);
        let year = dI.getFullYear(), month = dI.getMonth();
        const maxIter = Math.ceil(240/freq)+2;
        for (let i=0; i<maxIter; i++) {
          const fe = resolverDiaEfectivo(year,month,exp.diaPago||'') || (() => { const d=dI.getDate(),l=new Date(year,month+1,0).getDate(); return new Date(year,month,Math.min(d,l)).toISOString().slice(0,10); })();
          const dE2 = new Date(fe+'T00:00:00');
          if (dE2 > dE || dE2 > dF) break;
          if (dE2 >= dS && dE2 >= dI) pushPair(fe);
          month += freq; if (month>=12){year+=Math.floor(month/12);month=month%12;}
        }
      } else if (exp.tipoFrecuencia === 'diaria') {
        const stepMs = Math.max(1,exp.frecuencia)*86400000;
        let d = new Date(Math.max(dI.getTime(),dS.getTime()));
        if (dI<dS){const st=Math.ceil((dS-dI)/stepMs);d=new Date(dI.getTime()+st*stepMs);}
        while(d<=dE&&d<=dF){pushPair(d.toISOString().slice(0,10));d=new Date(d.getTime()+stepMs);}
      }
    }
    return events;
  }

  // Interés de cuenta remunerada con saldo dinámico por periodo.
  // Recibe todos los eventos proyectados (gastos, préstamos, transferencias) SIN intereses,
  // y por cada cuenta remunerada calcula el saldo real periodo a periodo incluyendo
  // entradas y salidas de esa cuenta (incluidas transferencias de/hacia ella).
  function proyectarInteresesCuentas(accounts, dateStart, dateEnd, filtroAccounts=null, extractoSinIntereses=[]) {
    const events = [];
    for (const acc of accounts) {
      if (!acc.activo || !acc.interes || acc.interes <= 0) continue;
      if (filtroAccounts && filtroAccounts.length>0 && !filtroAccounts.includes(acc._id)) continue;
      const dS = new Date(dateStart+'T00:00:00'), dE = new Date(dateEnd+'T00:00:00');
      const periodoMs = { diario:86400000, semanal:7*86400000, mensual:30.44*86400000 }[acc.periodoCobro||'mensual'];
      const pa = periodoMs / (365.25*86400000);

      // Saldo de arranque = último histórico real
      let saldoCuenta = saldoRealCuenta(acc);

      // Movimientos que afectan a esta cuenta, ordenados cronológicamente.
      // El delta se calcula aquí a partir de tipo+cuantia porque los eventos aún
      // no tienen el campo .delta (ese lo añade generarExtracto después).
      // Se incluyen: gastos/ingresos de esta cuenta, transferencias de/hacia esta cuenta.
      const movsCuenta = extractoSinIntereses
        .filter(e => e.cuenta === acc._id)
        .map(e => ({
          fecha: e.fecha,
          delta: e.tipo === 'ingreso' ? Math.abs(e.cuantia) : -Math.abs(e.cuantia),
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));

      let movIdx = 0;
      let d = new Date(dS);

      while (d <= dE) {
        const periodoFin = new Date(Math.min(d.getTime() + periodoMs, dE.getTime() + 1));
        const periodoFinStr = periodoFin.toISOString().slice(0, 10);

        // Aplicar movimientos que caen en este periodo para llegar al saldo al final del periodo
        let deltaTotal = 0;
        while (movIdx < movsCuenta.length && movsCuenta[movIdx].fecha < periodoFinStr) {
          deltaTotal += movsCuenta[movIdx].delta;
          movIdx++;
        }

        // Saldo medio del periodo = media entre saldo inicio y saldo fin
        // Saldo inicio = saldoCuenta (antes de aplicar deltas de este periodo)
        // Saldo fin    = saldoCuenta + deltaTotal
        const saldoInicio = saldoCuenta;
        const saldoFin    = saldoCuenta + deltaTotal;
        const saldoMedio  = Math.max(0, (saldoInicio + saldoFin) / 2);

        // Actualizar saldo para el siguiente periodo
        saldoCuenta = saldoFin;

        const ip = saldoMedio * (Math.pow(1 + acc.interes / 100, pa) - 1);
        if (ip > 0.001) {
          events.push({
            fecha: d.toISOString().slice(0, 10),
            concepto: `Interés ${acc.nombre}`,
            cuantia: ip,
            tipo: 'ingreso',
            tags: ['interes', 'cuenta'],
            cuenta: acc._id,
            sourceId: acc._id,
            sourceType: 'account-interest',
          });
        }

        d = new Date(d.getTime() + periodoMs);
      }
    }
    return events;
  }

  // ── Fondos de pensiones ──────────────────────────────────────────────────────
  // Calcula qué parte del saldo está disponible (bloqueo cumplido) y qué está bloqueada.
  // FIFO: las aportaciones más antiguas se consideran disponibles primero.
  function calcFondosPension(acc) {
    if (!acc.esFondoPension) return null;
    const hoy     = new Date();
    const bloqueo = acc.bloqueoMeses || 120; // meses de bloqueo por defecto = 10 años
    const saldo   = saldoRealCuenta(acc);

    // Fecha límite: aportaciones anteriores a esta fecha ya están disponibles
    const fechaLimite = new Date(hoy.getFullYear(), hoy.getMonth() - bloqueo, hoy.getDate())
      .toISOString().slice(0, 10);

    // Ordenar aportaciones FIFO (más antigua primero)
    const aportaciones = [...(acc.aportaciones || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));

    let disponible = 0;
    let bloqueado  = 0;
    let costBase   = aportaciones.reduce((s, a) => s + a.cantidad, 0);

    for (const ap of aportaciones) {
      if (ap.fecha <= fechaLimite) disponible += ap.cantidad;
      else bloqueado += ap.cantidad;
    }

    // Limitar disponible al saldo real (puede haber ganado intereses)
    const beneficio = Math.max(0, saldo - costBase);
    // Los fondos disponibles incluyen su proporción del beneficio
    const ratioDisp = costBase > 0 ? disponible / costBase : 0;
    const dispConBeneficio = Math.min(saldo, disponible + beneficio * ratioDisp);
    const bloqReal = Math.max(0, saldo - dispConBeneficio);

    return {
      saldo,
      disponible:   dispConBeneficio,
      bloqueado:    bloqReal,
      costBase,
      beneficio,
      numAportaciones: aportaciones.length,
      proxDesbloqueo: aportaciones.find(a => a.fecha > fechaLimite)?.fecha || null,
    };
  }

  // Calcula el impuesto a pagar al retirar `cantidadRetirada` de un fondo de pensiones.
  // El impuesto se aplica solo sobre la proporción del beneficio incluida en la retirada.
  function calcImpuestoPension(acc, cantidadRetirada) {
    if (!acc.esFondoPension || !acc.impuestoRetirada) return 0;
    const saldo    = saldoRealCuenta(acc);
    if (saldo <= 0) return 0;
    const costBase = (acc.aportaciones || []).reduce((s, a) => s + a.cantidad, 0);
    const beneficio = Math.max(0, saldo - costBase);
    if (beneficio <= 0) return 0;
    // Proporción del beneficio en la cantidad retirada
    const ratioBeneficio = beneficio / saldo;
    const beneficioRetirado = cantidadRetirada * ratioBeneficio;
    return +(beneficioRetirado * acc.impuestoRetirada / 100).toFixed(2);
  }

  // Retorna el gasto básico mensual (base para el colchón)
  function calcGastoBasicoMensual(expenses) {
    const hoy = new Date().toISOString().slice(0,10);
    const finMes = new Date(); finMes.setMonth(finMes.getMonth()+1);
    const finMesStr = finMes.toISOString().slice(0,10);
    const gastosBasicos = expenses.filter(e => e.basico && e.activo && e.tipo==='gasto');
    const expEvents = proyectarGastos(gastosBasicos, hoy, finMesStr);
    return expEvents.reduce((s,e)=>s+Math.abs(e.cuantia),0);
  }

  // Calcular colchón económico: por meses de gastos básicos o cantidad fija
  function calcColchon(expenses, config, loans) {
    if (config.colchonTipo === 'fijo' && config.colchonFijo > 0) return config.colchonFijo;
    const totalMes = calcGastoBasicoMensual(expenses);
    return totalMes * (config.colchonMeses||6);
  }

  // Saldo real de arranque: último histórico si existe, sino saldoInicial
  function saldoRealCuenta(acc) {
    const hist = [...(acc.historicoSaldos||[])].sort((a,b)=>b.fecha.localeCompare(a.fecha));
    return hist.length > 0 ? hist[0].saldo : (acc.saldoInicial || 0);
  }

  function generarExtracto(loans, expenses, accounts, config, filtroAccounts=null) {
    const gastos = expenses.filter(e=>e.tipo!=='transferencia');
    const transferencias = expenses.filter(e=>e.tipo==='transferencia');
    let events = [];
    events = events.concat(proyectarGastos(gastos, config.dashboardStart, config.dashboardEnd, filtroAccounts));
    events = events.concat(proyectarPrestamos(loans, config.dashboardStart, config.dashboardEnd, filtroAccounts));
    events = events.concat(proyectarTransferencias(transferencias, config.dashboardStart, config.dashboardEnd, filtroAccounts));
    // Pass the non-interest events so interest calc can use dynamic balances
    const intereses = proyectarInteresesCuentas(accounts, config.dashboardStart, config.dashboardEnd, filtroAccounts, events);
    events = events.concat(intereses);
    events.sort((a,b)=>a.fecha.localeCompare(b.fecha));
    const cuentasActivas = accounts.filter(a => a.activo && (!filtroAccounts || filtroAccounts.length===0 || filtroAccounts.includes(a._id)));
    let saldo = cuentasActivas.reduce((s, a) => s + saldoRealCuenta(a), 0);
    return events.map(ev => { const d = ev.tipo==='ingreso'?Math.abs(ev.cuantia):-Math.abs(ev.cuantia); saldo+=d; return {...ev, delta:d, saldoAcum:saldo}; });
  }

  function saldoHoy(extracto, accounts, filtroAccounts=null) {
    const today = new Date().toISOString().slice(0,10);
    // Saldo base = último histórico real (o saldoInicial si no hay histórico)
    const cuentasActivas = accounts.filter(a => a.activo && (!filtroAccounts || filtroAccounts.length===0 || filtroAccounts.includes(a._id)));
    let saldo = cuentasActivas.reduce((s, a) => s + saldoRealCuenta(a), 0);
    const past = extracto.filter(e=>e.fecha<=today);
    if (past.length===0) return saldo;
    return past[past.length-1].saldoAcum;
  }

  function agruparOHLC(extracto, ventana) {
    const groups = new Map();
    for (const ev of extracto) {
      const d=new Date(ev.fecha+'T00:00:00'); let key;
      if (ventana==='semana') { const sw=new Date(d); sw.setDate(d.getDate()-d.getDay()); key=sw.toISOString().slice(0,10); }
      else if (ventana==='mes') key=ev.fecha.slice(0,7);
      else key=ev.fecha.slice(0,4);
      if (!groups.has(key)) groups.set(key,[]);
      groups.get(key).push(ev.saldoAcum);
    }
    return Array.from(groups.entries()).map(([k,v])=>({ key:k, open:v[0], close:v[v.length-1], high:Math.max(...v), low:Math.min(...v) }));
  }

  function sumarPorTags(extracto, tipo) {
    const m=new Map();
    for (const ev of extracto) {
      if (ev.tipo!==tipo) continue;
      if (ev.sourceType==='transfer-out'||ev.sourceType==='transfer-in'||ev.sourceType==='loan-amort') continue; // skip transfers and amortizations
      for (const t of (ev.tags||['sin_tag'])) m.set(t,(m.get(t)||0)+Math.abs(ev.cuantia));
    }
    return m;
  }

  function mediaMensualGastos(extracto, config) {
    const totalGastos = extracto.filter(e=>e.tipo==='gasto'&&e.sourceType!=='loan-amort').reduce((s,e)=>s+Math.abs(e.cuantia),0);
    const dS = new Date(config.dashboardStart+'T00:00:00');
    const dE = new Date(config.dashboardEnd+'T00:00:00');
    const meses = Math.max(1, (dE - dS) / (30.44 * 86400000));
    return totalGastos / meses;
  }

  // Resumen con y sin amortizaciones para mostrar ahorro
  function resumenPrestamoConAhorro(loan) {
    const base = resumenPrestamo(loan);
    // Calcular sin amortizaciones
    const loanSinAmort = { ...loan, amortizaciones: [] };
    const sinAmort = resumenPrestamo(loanSinAmort);
    const ahorroIntereses = sinAmort.totalIntereses - base.totalIntereses;
    const ahorroTiempo = sinAmort.mesesReales - base.mesesReales;
    const costeTotalAmort = base.totalComAm;
    const ahorroNeto = ahorroIntereses - costeTotalAmort;
    // Total pagado = capital + intereses + comisiones apertura + comisiones amortizacion
    const totalPagado = loan.capital + base.totalIntereses + base.comAp + base.totalComAm;
    return { ...base, sinAmort, ahorroIntereses, ahorroTiempo, costeTotalAmort, ahorroNeto, totalPagado };
  }


  // ── Inflación aplicada a gastos ─────────────────────────────────────────────
  // proyectarGastos ya itera mes a mes; la inflación se aplica multiplicando
  // la cuantía por (1+inf)^(añosDesdeInicio). Lo hacemos como post-proceso:
  function aplicarInflacion(events, expenses, inflacionGlobal) {
    const now = new Date();
    return events.map(ev => {
      const exp = expenses.find(e => e._id === ev.sourceId);
      if (!exp) return ev;
      const inf = (exp.inflacion > 0 ? exp.inflacion : inflacionGlobal) / 100;
      if (inf === 0) return ev;
      const base = new Date((exp.fechaInicio||now.toISOString().slice(0,10))+'T00:00:00');
      const evDate = new Date(ev.fecha+'T00:00:00');
      const años = Math.max(0, (evDate - base) / (365.25*86400000));
      const factor = Math.pow(1 + inf, años);
      return { ...ev, cuantia: ev.tipo==='gasto' ? ev.cuantia * factor : ev.cuantia };
    });
  }

  // ── IRPF ────────────────────────────────────────────────────────────────────
  function calcIRPF(baseImponible, tramos) {
    // tramos: [[min, tipo%], ...] ordenados por min ascendente
    const sorted = [...tramos].sort((a,b)=>a[0]-b[0]);
    let impuesto = 0, base = baseImponible;
    for (let i = sorted.length-1; i >= 0; i--) {
      const [min, tipo] = sorted[i];
      if (base <= min) continue;
      impuesto += (base - min) * (tipo/100);
      base = min;
    }
    return impuesto;
  }

  // Retención mensual estimada = IRPF(salario_anual) / 12
  function retencionMensual(salarioAnual, tramos) {
    return calcIRPF(salarioAnual, tramos) / 12;
  }

  // Proyectar retencion IRPF como gastos mensuales para ingresos de trabajo
  function proyectarRetencionesFiscales(expenses, config, dateStart, dateEnd) {
    const events = [];
    const tramos = config.tramos_irpf || [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]];
    for (const exp of expenses) {
      if (!exp.activo || exp.tipo !== 'ingreso' || !exp.sujetoIRPF) continue;
      const salarioAnual = exp.cuantia * (exp.tipoFrecuencia==='mensual' ? 12 : 1);
      const ret = retencionMensual(salarioAnual, tramos);
      const mockGastoFiscal = { ...exp, _id: exp._id+'_irpf', concepto: `Retención IRPF (${exp.concepto})`, tipo:'gasto', cuantia: ret, tags:['irpf','fiscal'], basico:false };
      const evs = proyectarGastos([mockGastoFiscal], dateStart, dateEnd);
      events.push(...evs);
    }
    return events;
  }

  // ── Puntos críticos ─────────────────────────────────────────────────────────
  function detectarPuntosCriticos(extracto, colchon) {
    const pts = [];
    let dentroBajo = false;
    for (let i=0; i<extracto.length; i++) {
      const ev = extracto[i];
      if (ev.saldoAcum < 0 && (i===0 || extracto[i-1].saldoAcum >= 0)) {
        pts.push({ tipo:'saldo_negativo', fecha:ev.fecha, saldo:ev.saldoAcum, mensaje:`Saldo negativo (${eur(ev.saldoAcum)}) a partir del ${ev.fecha}` });
      }
      if (colchon > 0) {
        if (ev.saldoAcum < colchon && !dentroBajo) {
          dentroBajo = true;
          pts.push({ tipo:'bajo_colchon', fecha:ev.fecha, saldo:ev.saldoAcum, mensaje:`Saldo por debajo del colchón (${eur(ev.saldoAcum)} < ${eur(colchon)}) desde ${ev.fecha}` });
        } else if (ev.saldoAcum >= colchon && dentroBajo) {
          dentroBajo = false;
          pts.push({ tipo:'recuperacion_colchon', fecha:ev.fecha, saldo:ev.saldoAcum, mensaje:`Recuperación del colchón el ${ev.fecha} (${eur(ev.saldoAcum)})` });
        }
      }
    }
    return pts;
  }

  // ── Monte Carlo ──────────────────────────────────────────────────────────────
  function monteCarlo(loans, expenses, accounts, config, iteraciones=300) {
    // Only for expenses with varianza > 0
    const varExpenses = expenses.filter(e => e.varianza > 0);
    if (varExpenses.length === 0) return null;

    // Build date index
    const baseExtracto = generarExtracto(loans, expenses, accounts, config);
    if (baseExtracto.length === 0) return null;
    const fechas = baseExtracto.map(e=>e.fecha);
    const n = fechas.length;

    // Accumulate saldo samples per date index
    const samples = Array.from({length:n}, ()=>[]);

    const rand_normal = () => {
      // Box-Muller
      const u1 = Math.random(), u2 = Math.random();
      return Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2);
    };

    for (let iter=0; iter<iteraciones; iter++) {
      // Perturb expenses with varianza
      const pertExpenses = expenses.map(e => {
        if (!e.varianza || e.varianza===0) return e;
        const sigma = Math.abs(e.cuantia) * (e.varianza/100);
        const delta = rand_normal() * sigma;
        return { ...e, cuantia: e.cuantia + (e.tipo==='gasto' ? delta : -delta) };
      });
      const ext = generarExtracto(loans, pertExpenses, accounts, config);
      const dateMap = new Map(ext.map(ev=>[ev.fecha, ev.saldoAcum]));
      for (let i=0; i<n; i++) {
        const s = dateMap.get(fechas[i]);
        if (s !== undefined) samples[i].push(s);
      }
    }

    // Compute percentiles
    const pct_fn = (arr, p) => {
      const sorted = [...arr].sort((a,b)=>a-b);
      const idx = Math.floor((p/100)*(sorted.length-1));
      return sorted[idx] ?? null;
    };

    return fechas.map((fecha, i) => {
      const s = samples[i];
      if (s.length === 0) return null;
      return {
        x: new Date(fecha+'T00:00:00').getTime(),
        p10: pct_fn(s,10), p25: pct_fn(s,25), p50: pct_fn(s,50),
        p75: pct_fn(s,75), p90: pct_fn(s,90)
      };
    }).filter(Boolean);
  }

  // ── Score de salud financiera ────────────────────────────────────────────────
  function calcScore(extracto, loans, expenses, accounts, config) {
    // Interpolación lineal acotada
    function lerp(x, x0, x1, y0, y1) {
      if (x <= x0) return y0; if (x >= x1) return y1;
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }

    const ingresosMes = expenses
      .filter(e => e.activo && e.tipo === 'ingreso' && e.tipoFrecuencia === 'mensual')
      .reduce((s, e) => s + e.cuantia, 0);

    // ── 1. Gastos fijos ──────────────────────────────────────────────────────────
    const gastosFijosLista = expenses.filter(e => e.activo && e.tipo === 'gasto' && e.tipoFrecuencia === 'mensual');
    const gastosFijosMes = gastosFijosLista.reduce((s, e) => s + e.cuantia, 0);
    const pctFijosIngresos = ingresosMes > 0 ? (gastosFijosMes / ingresosMes) * 100 : null;
    const colorFijos = gastosFijosMes === 0 || pctFijosIngresos === null ? 'var(--text3)'
      : pctFijosIngresos < 40 ? '#00e5a0' : pctFijosIngresos < 60 ? '#ffd166' : '#ff4d6d';
    const scoreFijos = pctFijosIngresos === null ? 50
      : pctFijosIngresos < 30  ? 100
      : pctFijosIngresos < 50  ? lerp(pctFijosIngresos, 30, 50, 100, 70)
      : pctFijosIngresos < 70  ? lerp(pctFijosIngresos, 50, 70, 70, 30)
      : lerp(pctFijosIngresos, 70, 90, 30, 0);

    // ── 2. Gastos básicos ────────────────────────────────────────────────────────
    const gastosBasicosLista = gastosFijosLista.filter(e => e.basico);
    const gastosBasicosMes = gastosBasicosLista.reduce((s, e) => s + e.cuantia, 0);
    const pctBasicosIngresos = ingresosMes > 0 ? (gastosBasicosMes / ingresosMes) * 100 : null;
    const pctBasicosSobreFijos = gastosFijosMes > 0 ? (gastosBasicosMes / gastosFijosMes) * 100 : null;
    const colorBasicos = pctBasicosSobreFijos === null ? 'var(--text3)'
      : pctBasicosSobreFijos > 70 ? '#00e5a0' : pctBasicosSobreFijos > 40 ? '#ffd166' : '#ff4d6d';

    // ── 3. Ahorro mensual esperado ───────────────────────────────────────────────
    const mediaMensualGastos = FinanceMath.mediaMensualGastos(extracto, config);
    const ahorroMes = ingresosMes - mediaMensualGastos;
    const pctAhorroIngresos = ingresosMes > 0 ? (ahorroMes / ingresosMes) * 100 : null;
    const colorAhorro = pctAhorroIngresos === null ? 'var(--text3)'
      : pctAhorroIngresos > 20 ? '#00e5a0' : pctAhorroIngresos > 5 ? '#ffd166' : '#ff4d6d';
    const scoreAhorro = pctAhorroIngresos === null ? 50
      : pctAhorroIngresos >= 25  ? 100
      : pctAhorroIngresos >= 10  ? lerp(pctAhorroIngresos, 10, 25, 65, 100)
      : pctAhorroIngresos >= 0   ? lerp(pctAhorroIngresos, 0, 10, 20, 65)
      : 0;

    // ── 4. Endeudamiento — excluye préstamos ya finalizados ──────────────────────
    const today = new Date().toISOString().slice(0,10);
    const cuotasTotales = loans
      .filter(l => {
        if (!l.activo || l.simulacion) return false;
        const { tabla } = FinanceMath.resumenPrestamo(l);
        const ultimaCuota = tabla.filter(r => !r.esAmortizacion).slice(-1)[0];
        return ultimaCuota && ultimaCuota.fecha >= today; // excluye finalizados
      })
      .reduce((s, l) => s + FinanceMath.cuotaMensual(l.capital, l.tin, l.meses), 0);
    const pctDeudaIngresos = ingresosMes > 0 ? (cuotasTotales / ingresosMes) * 100 : null;
    const colorDeuda = cuotasTotales === 0 ? '#00e5a0'
      : pctDeudaIngresos === null ? 'var(--text3)'
      : pctDeudaIngresos < 20 ? '#00e5a0' : pctDeudaIngresos < 35 ? '#ffd166' : '#ff4d6d';
    const labelDeuda = cuotasTotales === 0 ? 'Sin préstamos activos'
      : pctDeudaIngresos === null ? '—'
      : pctDeudaIngresos < 20 ? 'Excelente' : pctDeudaIngresos < 35 ? 'Aceptable' : 'Elevado ⚠️';
    const scoreDeuda = cuotasTotales === 0 ? 100
      : pctDeudaIngresos === null ? 50
      : pctDeudaIngresos < 15  ? 100
      : pctDeudaIngresos < 35  ? lerp(pctDeudaIngresos, 15, 35, 95, 45)
      : pctDeudaIngresos < 50  ? lerp(pctDeudaIngresos, 35, 50, 45, 10)
      : 0;

    // ── Score global con pesos: ahorro 40%, deuda 35%, gastos fijos 25% ──────────
    const total = Math.round(scoreAhorro * 0.40 + scoreDeuda * 0.35 + scoreFijos * 0.25);
    const label = total >= 80 ? 'Excelente' : total >= 60 ? 'Buena' : total >= 40 ? 'Regular' : 'Atención';
    const color = total >= 80 ? '#00e5a0' : total >= 60 ? '#4d9fff' : total >= 40 ? '#ffd166' : '#ff4d6d';

    return {
      total, label, color,
      metricas: {
        fijos: {
          label: 'Gastos fijos',
          valor: eur(gastosFijosMes) + '/mes',
          pcts: [pctFijosIngresos !== null ? `${pctFijosIngresos.toFixed(1)}% de ingresos` : 'Sin ingresos registrados'],
          color: colorFijos,
          rec: gastosFijosMes === 0
            ? 'Registra tus gastos mensuales recurrentes para activar esta métrica.'
            : pctFijosIngresos < 40
            ? '✅ Tus gastos fijos son una proporción saludable de tus ingresos.'
            : pctFijosIngresos < 60
            ? '💡 Revisa si algún gasto fijo puede eliminarse o convertirse en variable (suscripciones, seguros...).'
            : '⚠️ Más del 60% de tus ingresos comprometido en gastos fijos. Ante una bajada de ingresos tendrías muy poco margen.',
        },
        basicos: {
          label: 'Gastos básicos',
          valor: eur(gastosBasicosMes) + '/mes',
          pcts: [
            pctBasicosIngresos !== null ? `${pctBasicosIngresos.toFixed(1)}% de ingresos` : '—',
            pctBasicosSobreFijos !== null ? `${pctBasicosSobreFijos.toFixed(1)}% de los gastos fijos son básicos` : 'Sin gastos fijos',
          ],
          color: colorBasicos,
          rec: gastosBasicosMes === 0
            ? 'Marca tus gastos esenciales como "básico" en la sección Gastos para activar esta métrica.'
            : pctBasicosSobreFijos > 70
            ? '✅ La mayoría de tus gastos fijos son básicos. Tu presupuesto tiene una base sólida.'
            : pctBasicosSobreFijos > 40
            ? '💡 Parte de tus gastos fijos son discrecionales. Revisa si todos son realmente necesarios.'
            : '⚠️ Menos del 40% de tus gastos fijos son básicos. Alto componente discrecional.',
        },
        ahorro: {
          label: 'Ahorro mensual esperado',
          valor: eur(ahorroMes) + '/mes',
          pcts: [pctAhorroIngresos !== null ? `${pctAhorroIngresos.toFixed(1)}% de ingresos` : 'Sin ingresos registrados'],
          color: colorAhorro,
          rec: pctAhorroIngresos === null
            ? 'Registra tus ingresos mensuales para activar esta métrica.'
            : ahorroMes > 0 && pctAhorroIngresos >= 20
            ? '✅ Ahorras más del 20% de tus ingresos. Considera invertir el excedente.'
            : ahorroMes > 0
            ? '💡 Tasa de ahorro baja. Objetivo recomendado: 20% de los ingresos.'
            : '⚠️ Tus gastos superan tus ingresos en la proyección. Revisa tus gastos recurrentes urgentemente.',
        },
        deuda: {
          label: 'Endeudamiento',
          valor: cuotasTotales > 0 ? eur(cuotasTotales) + '/mes' : 'Sin préstamos activos',
          pcts: cuotasTotales > 0 && pctDeudaIngresos !== null ? [`${pctDeudaIngresos.toFixed(1)}% de ingresos · ${labelDeuda}`] : [],
          color: colorDeuda,
          rec: cuotasTotales === 0
            ? '✅ No tienes préstamos activos en curso.'
            : pctDeudaIngresos < 20
            ? '✅ Ratio de deuda excelente (<20%). Cuotas muy manejables.'
            : pctDeudaIngresos < 35
            ? '💡 Ratio aceptable (20-35%). Dentro de umbrales bancarios estándar. Las amortizaciones anticipadas pueden mejorar este ratio.'
            : '⚠️ Ratio de deuda elevado (>35%). Los bancos suelen rechazar nuevos créditos por encima de este umbral.',
        },
      },
      breakdown: {}
    };
  }

  // ── Optimizador de amortizaciones ────────────────────────────────────────────
  function optimizarAmortizaciones(loans, expenses, accounts, config, {
    frecuencia = 1,
    mesesHorizonte = 36,
    minAmortizable = 500,
    tipoAmort = 'plazo'
  } = {}) {

    const colchon   = calcColchon(expenses, config, loans);
    const hoy       = new Date();
    const horizonte = Math.min(120, Math.max(1, mesesHorizonte));
    const hoyStr    = hoy.toISOString().slice(0, 10);

    const loansActivos = loans
      .filter(l => l.activo && !l.simulacion)
      .sort((a, b) => b.tin - a.tin);

    if (loansActivos.length === 0) {
      return { plan: [], colchon, totalAmortizado: 0, totalComisiones: 0, totalAhorroIntereses: 0, resumenPorLoan: [] };
    }

    // Amortizaciones del plan por préstamo (se acumulan durante la simulación)
    const amortsPorLoan = {};
    for (const l of loansActivos) amortsPorLoan[l._id] = [];

    const plan = [];

    // ── Helper: fecha correcta mes i (evita "2026-36") ──────────────────────────
    function mesInfo(i) {
      // Date con rollover automático del año
      const d = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
      const year  = d.getFullYear();
      const month = d.getMonth(); // 0-based
      const label = `${year}-${String(month + 1).padStart(2, '0')}`;
      const ini   = `${label}-01`;
      // Último día del mes: día 0 del mes siguiente
      const fin   = new Date(year, month + 1, 0).toISOString().slice(0, 10);
      // Día 15 del mes para la amortización (o último día si el mes es corto)
      const dia15 = new Date(year, month, Math.min(15, new Date(year, month + 1, 0).getDate())).toISOString().slice(0, 10);
      return { label, ini, fin, dia15 };
    }

    // ── Helper: capital pendiente de un préstamo justo antes de una fecha ──────
    // Usa la tabla actualizada (con amortizaciones del plan ya añadidas).
    function capPendienteAntes(loan, fechaAmort) {
      const loanActual = {
        ...loan,
        amortizaciones: [...(loan.amortizaciones || []), ...amortsPorLoan[loan._id]]
      };
      const tabla = tablaAmortizacion(
        loanActual.capital, loanActual.tin, loanActual.meses, loanActual.fechaInicio,
        loanActual.comisionAmort || 0, loanActual.amortizaciones, loanActual
      );
      // Última fila de cuota ordinaria anterior a la fecha (no amortizaciones)
      const filas = tabla.filter(r => !r.esAmortizacion && r.fecha <= fechaAmort);
      if (filas.length > 0) return filas[filas.length - 1].capitalPendiente;
      // Sin filas pasadas: el préstamo aún no ha pagado ninguna cuota
      // Devolver capital original menos amortizaciones ya registradas
      const yaAmort = loanActual.amortizaciones
        .filter(a => a.fecha <= fechaAmort)
        .reduce((s, a) => s + a.cantidad, 0);
      return Math.max(0, loanActual.capital - yaAmort);
    }

    // ── Helper: saldo mínimo del mes con el estado actual del plan ─────────────
    function saldoMinDelMes(ini, fin) {
      const loansActualizados = loans.map(l => ({
        ...l,
        amortizaciones: [...(l.amortizaciones || []), ...(amortsPorLoan[l._id] || [])]
      }));
      const cfg      = { ...config, dashboardStart: hoyStr, dashboardEnd: fin };
      const extracto = generarExtracto(loansActualizados, expenses, accounts, cfg);
      const saldoBase = accounts.filter(a => a.activo).reduce((s, a) => s + saldoRealCuenta(a), 0);
      const antsMes   = extracto.filter(e => e.fecha < ini);
      const saldoIni  = antsMes.length > 0 ? antsMes[antsMes.length - 1].saldoAcum : saldoBase;
      const enMes     = extracto.filter(e => e.fecha >= ini && e.fecha <= fin);
      return Math.min(saldoIni, ...enMes.map(e => e.saldoAcum));
    }

    // ── Bucle principal ─────────────────────────────────────────────────────────
    // Buffer de seguridad para absorber redondeos y evitar bajar del colchón
    const SAFETY_BUFFER = 2;

    for (let i = 0; i < horizonte; i++) {
      if (i % frecuencia !== 0) continue;

      const { label, ini, fin, dia15 } = mesInfo(i);

      // Si la fecha de amortización ya pasó, el evento quedaría antes de
      // dashboardStart y no aparecería en el extracto → saldo incorrecto.
      if (dia15 < hoyStr) continue;

      const saldoMin  = saldoMinDelMes(ini, fin);
      const excedente = saldoMin - colchon - SAFETY_BUFFER;
      if (excedente < minAmortizable) continue;

      // Snapshot para rollback si el mes siguiente queda por debajo del colchón
      const planLenAntes = plan.length;
      const amortSnap = {};
      for (const l of loansActivos) amortSnap[l._id] = [...amortsPorLoan[l._id]];

      let excedentRestante = excedente;
      let totalAmortizadoEsteMes = 0;

      for (const loan of loansActivos) {
        if (excedentRestante < minAmortizable) break;

        const capActual = capPendienteAntes(loan, dia15);
        if (capActual < 1) continue; // préstamo terminado

        const comAmort     = loan.comisionAmort || 0;
        const factorCom    = 1 + comAmort / 100;
        const maxAmortNeto = Math.floor(excedentRestante / factorCom);
        const cantidadF    = Math.min(maxAmortNeto, capActual);
        if (cantidadF < minAmortizable) continue;

        const cantidad   = Math.min(Math.floor(cantidadF), Math.floor(capActual));
        const comision   = +(cantidad * comAmort / 100).toFixed(2);
        const costeTotal = cantidad + comision;

        // Verificación: el coste no puede superar el excedente restante
        if (costeTotal > excedentRestante) continue;

        amortsPorLoan[loan._id].push({
          _id: `opt_${label}_${loan._id}`,
          fecha: dia15, cantidad, tipo: tipoAmort, simulacion: true,
        });

        totalAmortizadoEsteMes += costeTotal;
        plan.push({
          mes: label, fechaAmort: dia15,
          loanId: loan._id, loanNombre: loan.nombre, tin: loan.tin,
          capitalAntes: capActual, cantidadAmort: cantidad, comision,
          capitalDespues: Math.max(0, capActual - cantidad),
          saldoMin, excedente,
          saldoDespuesMes: saldoMin - totalAmortizadoEsteMes,
          tipoAmort,
        });

        excedentRestante -= costeTotal;
      }

      // Verificar que el mes siguiente no baje del colchón por las amortizaciones
      // de este mes. Si lo hace, se deshacen todas las amortizaciones del mes.
      if (plan.length > planLenAntes) {
        const next = mesInfo(i + 1);
        const saldoMinSiguiente = saldoMinDelMes(next.ini, next.fin);
        if (saldoMinSiguiente < colchon) {
          plan.length = planLenAntes;
          for (const l of loansActivos) amortsPorLoan[l._id] = amortSnap[l._id];
        }
      }
    }

    // ── Resumen: comparar cada préstamo sin plan vs con plan ───────────────────
    const totalAmortizado = plan.reduce((s, p) => s + p.cantidadAmort, 0);
    const totalComisiones = plan.reduce((s, p) => s + p.comision, 0);

    const resumenPorLoan = loansActivos.map(loan => {
      const amorts = amortsPorLoan[loan._id];
      if (!amorts.length) return null;
      // Comparar partiendo del mismo estado base (sin amorts del plan)
      const resSin = resumenPrestamo(loan);
      const loanCon = { ...loan, amortizaciones: [...(loan.amortizaciones || []), ...amorts] };
      const resCon  = resumenPrestamo(loanCon);
      return {
        loanId: loan._id, nombre: loan.nombre, tin: loan.tin,
        fechaFinSin: resSin.fechaFin, fechaFinCon: resCon.fechaFin,
        mesesAhorrados: resSin.mesesReales - resCon.mesesReales,
        interesesSin: resSin.totalIntereses, interesesCon: resCon.totalIntereses,
        ahorroIntereses: resSin.totalIntereses - resCon.totalIntereses,
        numAmortizaciones: amorts.length,
        totalAmortizado: amorts.reduce((s, a) => s + a.cantidad, 0),
      };
    }).filter(Boolean);

    const totalAhorroIntereses = resumenPorLoan.reduce((s, r) => s + r.ahorroIntereses, 0);

    return { plan, colchon, totalAmortizado, totalComisiones, totalAhorroIntereses, resumenPorLoan };
  }
  // ── Comparador de frecuencias de amortización ────────────────────────────────
  // Corre optimizarAmortizaciones para cada frecuencia candidata y calcula el
  // saldo proyectado a una fecha objetivo, devolviendo una tabla comparativa.
  function compararFrecuencias(loans, expenses, accounts, config, {
    horizonte      = 60,
    minAmortizable = 500,
    tipoAmort      = 'plazo',
    fechaObjetivo  = null,   // ISO string, si null usa fin del horizonte
    frecuencias    = [1, 2, 3, 6, 12],
  } = {}) {

    // Fecha objetivo para medir el saldo
    const hoy = new Date();
    const fechaObj = fechaObjetivo ||
      new Date(hoy.getFullYear(), hoy.getMonth() + horizonte, 1).toISOString().slice(0, 10);

    // Función interna: saldo proyectado a fechaObj con un plan de amortizaciones dado
    function saldoConPlan(amortsPorLoan) {
      const loansConPlan = loans.map(l => ({
        ...l,
        amortizaciones: [...(l.amortizaciones || []), ...(amortsPorLoan[l._id] || [])]
      }));
      // Calcular extracto hasta fechaObj
      const cfgObj = { ...config, dashboardStart: hoy.toISOString().slice(0, 10), dashboardEnd: fechaObj };
      const extracto = generarExtracto(loansConPlan, expenses, accounts, cfgObj);
      if (extracto.length === 0) {
        return accounts.filter(a => a.activo).reduce((s, a) => s + saldoRealCuenta(a), 0);
      }
      // Saldo en la fecha objetivo (último evento en o antes de fechaObj)
      const evs = extracto.filter(e => e.fecha <= fechaObj);
      return evs.length > 0 ? evs[evs.length - 1].saldoAcum : extracto[0].saldoAcum;
    }

    // Saldo base sin ninguna amortización optimizada
    const saldoBase = saldoConPlan({});

    // Correr el optimizador para cada frecuencia
    const resultados = frecuencias.map(frec => {
      const res = optimizarAmortizaciones(loans, expenses, accounts, config, {
        frecuencia: frec,
        mesesHorizonte: horizonte,
        minAmortizable,
        tipoAmort,
      });

      // Reconstruir amortsPorLoan desde el plan para calcular saldo
      const amortsPorLoan = {};
      for (const l of loans) amortsPorLoan[l._id] = [];
      for (const p of res.plan) {
        amortsPorLoan[p.loanId].push({
          _id: p.mes + '_' + p.loanId,
          fecha: p.fechaAmort,
          cantidad: p.cantidadAmort,
          tipo: tipoAmort,
          simulacion: true,
        });
      }

      const saldo = saldoConPlan(amortsPorLoan);

      return {
        frecuencia:          frec,
        label:               frec === 1 ? 'Mensual' : `Cada ${frec} meses`,
        numAmortizaciones:   res.plan.length,
        totalAmortizado:     res.totalAmortizado,
        totalComisiones:     res.totalComisiones,
        ahorroIntereses:     res.totalAhorroIntereses,
        saldoObjetivo:       saldo,
        gananciaSaldo:       saldo - saldoBase,   // respecto a no amortizar nada
        // métrica combinada: ahorro intereses + saldo extra (ambos son dinero tuyo)
        valorTotal:          res.totalAhorroIntereses + (saldo - saldoBase),
        plan:                res.plan,
        resumenPorLoan:      res.resumenPorLoan,
      };
    }).filter(r => r.numAmortizaciones > 0);

    // Identificar mejores por cada métrica
    if (resultados.length > 0) {
      const maxIntereses = Math.max(...resultados.map(r => r.ahorroIntereses));
      const maxSaldo     = Math.max(...resultados.map(r => r.saldoObjetivo));
      const maxValor     = Math.max(...resultados.map(r => r.valorTotal));
      resultados.forEach(r => {
        r.esMejorIntereses = r.ahorroIntereses === maxIntereses;
        r.esMejorSaldo     = r.saldoObjetivo   === maxSaldo;
        r.esMejorValor     = r.valorTotal       === maxValor;
      });
    }

    return { resultados, saldoBase, fechaObjetivo: fechaObj };
  }

  function calcDesviacion(extracto, accounts) {
    // Sum all historico saldos by date across all accounts (same logic as the chart).
    // This way the "real" value is the total portfolio at each date, comparable with
    // extracto.saldoAcum which is also the total portfolio.
    const today = new Date().toISOString().slice(0,10);
    const byFecha = {};
    for (const acc of accounts) {
      for (const h of (acc.historicoSaldos||[])) {
        if (h.fecha > today) continue; // solo pasadas
        if (!byFecha[h.fecha]) byFecha[h.fecha] = 0;
        byFecha[h.fecha] += h.saldo;
      }
    }
    const rows = [];
    for (const [fecha, saldoReal] of Object.entries(byFecha).sort(([a],[b])=>a.localeCompare(b))) {
      const ev = extracto.filter(e => e.fecha <= fecha);
      const estimado = ev.length > 0 ? ev[ev.length-1].saldoAcum : null;
      if (estimado === null) continue;
      const desv = saldoReal - estimado;
      const pct = estimado !== 0 ? (desv/Math.abs(estimado))*100 : 0;
      rows.push({ cuenta:'Total', fecha, estimado, real:saldoReal, desv, pct });
    }
    return rows;
  }

  function eur(n) { return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n||0); }
  function pct(n) { return (n||0).toFixed(2)+'%'; }

  return { saldoRealCuenta, calcFondosPension, calcImpuestoPension, cuotaMensual, calcTAE, tablaAmortizacion, resumenPrestamo, resumenPrestamoConAhorro, proyectarGastos, proyectarTransferencias, proyectarPrestamos, generarExtracto, saldoHoy, agruparOHLC, sumarPorTags, mediaMensualGastos, calcColchon, calcGastoBasicoMensual, aplicarInflacion, calcIRPF, retencionMensual, proyectarRetencionesFiscales, detectarPuntosCriticos, monteCarlo, calcScore, calcDesviacion, optimizarAmortizaciones, compararFrecuencias, resolverDiaEfectivo, ajustarFechaPago, labelDiaPago, eur, pct };
})();

