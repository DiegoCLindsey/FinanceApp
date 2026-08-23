// Datos de QA. Se ejecuta ANTES que la app (va inyectado en <head>).
// Fichero TEMPORAL de QA.
(function () {
  var P = 'financeapp_';
  var set = function (k, v) { localStorage.setItem(P + k, JSON.stringify(v)); };
  var hoy = new Date();
  var iso = function (d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  var desplazar = function (meses, dias) {
    var d = new Date(hoy); d.setMonth(d.getMonth() + (meses || 0)); d.setDate(d.getDate() + (dias || 0)); return iso(d);
  };
  var añoQueViene = function (n) { var d = new Date(hoy); d.setFullYear(d.getFullYear() + n); return iso(d); };

  localStorage.clear();

  set('state_accounts', [
    { _id: 'cc', nombre: 'Cuenta corriente', saldo: 8400, saldoInicial: 8400, fechaInicialSaldo: desplazar(-6),
      interes: 0, periodoCobro: 'mensual', descripcion: 'Nómina y recibos', activo: true, simulacion: false,
      esCuentaPrincipal: true,
      historicoSaldos: [
        { _id: 'h1', fecha: desplazar(-4), saldo: 9100, nota: 'Punto de control' },
        { _id: 'h2', fecha: desplazar(-2), saldo: 10250, nota: 'Punto de control' },
        { _id: 'h3', fecha: iso(hoy), saldo: 11800, nota: 'Actualización manual' },
      ] },
    { _id: 'aho', nombre: 'Ahorro remunerado', saldo: 15200, saldoInicial: 14000, fechaInicialSaldo: desplazar(-6),
      interes: 2.4, periodoCobro: 'mensual', descripcion: '', activo: true, simulacion: false,
      historicoSaldos: [{ _id: 'h4', fecha: desplazar(-1), saldo: 15200, nota: '' }] },
    { _id: 'fi', nombre: 'Fondo indexado', saldo: 22000, saldoInicial: 18000, fechaInicialSaldo: desplazar(-12),
      interes: 6.5, periodoCobro: 'anual', descripcion: '', activo: true, simulacion: false,
      modeloFondo: 'inversion', historicoSaldos: [], aportaciones: [] },
    { _id: 'pp', nombre: 'Plan de pensiones', saldo: 9000, saldoInicial: 9000, fechaInicialSaldo: desplazar(-12),
      interes: 4, periodoCobro: 'anual', descripcion: '', activo: true, simulacion: false,
      modeloFondo: 'pension', esFondoPension: true, bloqueoMeses: 240, impuestoRetirada: 20,
      topeAportacionAnual: 1500, historicoSaldos: [], aportaciones: [] },
  ]);

  // Forma CANÓNICA de src/state/schema.ts (concepto/cuantia/tipoFrecuencia), no
  // la del legacy: con `nombre`/`importe` la proyección da cero y medio QA sale
  // con importes vacíos sin que nada falle a gritos.
  set('state_expenses', [
    { _id: 'e1', concepto: 'Alquiler', cuantia: 950, tipo: 'gasto', clasificacion: 'basico',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:1',
      fechaInicio: desplazar(-12), fechaFin: null, cuenta: 'cc', activo: true, tags: ['vivienda'], escenarioIds: [] },
    { _id: 'e2', concepto: 'Supermercado', cuantia: 420, tipo: 'gasto', clasificacion: 'basico',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:5',
      fechaInicio: desplazar(-12), fechaFin: null, cuenta: 'cc', activo: true, tags: ['comida'], escenarioIds: [] },
    { _id: 'e3', concepto: 'Suscripciones', cuantia: 38, tipo: 'gasto', clasificacion: 'deseo',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:12',
      fechaInicio: desplazar(-12), fechaFin: null, cuenta: 'cc', activo: true, tags: ['ocio'], escenarioIds: [] },
    { _id: 'e4', concepto: 'Seguro coche', cuantia: 480, tipo: 'gasto', clasificacion: 'basico',
      tipoFrecuencia: 'anual', frecuencia: 1, diaPago: 'dia:15',
      fechaInicio: desplazar(-12), fechaFin: null, cuenta: 'cc', activo: true, tags: ['coche'], escenarioIds: [] },
    { _id: 'e5', concepto: 'Gimnasio', cuantia: 45, tipo: 'gasto', clasificacion: 'deseo',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:3',
      fechaInicio: desplazar(-12), fechaFin: desplazar(3), cuenta: 'cc', activo: true, tags: ['salud'], escenarioIds: [] },
    { _id: 'e6', concepto: 'Clases de inglés', cuantia: 120, tipo: 'gasto', clasificacion: 'deseo',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:20',
      fechaInicio: desplazar(1), fechaFin: null, cuenta: 'cc', activo: true, tags: ['formacion'], escenarioIds: [] },
    { _id: 'e7', concepto: 'Alquiler trastero', cuantia: 60, tipo: 'ingreso', clasificacion: 'basico',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:10',
      fechaInicio: desplazar(-6), fechaFin: null, cuenta: 'cc', activo: true, tags: ['extra'], escenarioIds: [] },
    { _id: 'e8', concepto: 'Reforma baño', cuantia: 3200, tipo: 'gasto', clasificacion: 'deseo',
      tipoFrecuencia: 'unico', frecuencia: 1, diaPago: 'dia:8',
      fechaInicio: desplazar(4), fechaFin: null, cuenta: 'aho', activo: true, tags: ['obras'], escenarioIds: [] },
  ]);

  set('state_nominas', [
    { _id: 'n1', nombre: 'Nómina actual', bruto: 42000, nPagas: 14, irpfModo: 'auto', irpfPct: 0, representacion: 0,
      fechaInicio: desplazar(-24), fechaFin: desplazar(2), cuenta: 'cc', activo: true, tags: [] },
    { _id: 'n2', nombre: 'Nómina nueva', bruto: 48000, nPagas: 12, irpfModo: 'auto', irpfPct: 0, representacion: 0,
      fechaInicio: desplazar(3), fechaFin: null, cuenta: 'cc', activo: true, tags: [] },
  ]);

  set('state_loans', [
    { _id: 'l1', nombre: 'Hipoteca', capital: 120000, tin: 2.9, plazoMeses: 240, fechaInicio: desplazar(-36),
      cuenta: 'cc', activo: true, tipo: 'frances', tags: ['vivienda'],
      amortizaciones: [{ _id: 'a1', fecha: desplazar(6), cantidad: 5000, modo: 'plazo' }] },
    { _id: 'l2', nombre: 'Préstamo coche', capital: 18000, tin: 6.2, plazoMeses: 60, fechaInicio: desplazar(-18),
      cuenta: 'cc', activo: true, tipo: 'frances', tags: ['coche'], amortizaciones: [] },
  ]);

  // Movimientos reales de los tres últimos meses, para que el cierre de mes y
  // la precisión tengan de qué hablar. El súper va sistemáticamente por encima
  // de lo estimado y hay gasto que ninguna estimación prevé.
  var tx = [];
  var n = 0;
  var mesISO = function (m, d) {
    var f = new Date(hoy); f.setMonth(f.getMonth() + m); f.setDate(d); return iso(f);
  };
  [-3, -2, -1].forEach(function (m) {
    tx.push({ _id: 'tx' + (++n), fecha: mesISO(m, 1),  cuentaId: 'cc', importeCts: -95000, concepto: 'ALQUILER', tags: ['vivienda'], estimacionId: 'e1', tipo: 'gasto', origen: 'importado' });
    tx.push({ _id: 'tx' + (++n), fecha: mesISO(m, 5),  cuentaId: 'cc', importeCts: -51100, concepto: 'SUPERMERCADO', tags: ['comida'], estimacionId: 'e2', tipo: 'gasto', origen: 'importado' });
    tx.push({ _id: 'tx' + (++n), fecha: mesISO(m, 12), cuentaId: 'cc', importeCts: -3800,  concepto: 'SUSCRIPCIONES', tags: ['ocio'], estimacionId: 'e3', tipo: 'gasto', origen: 'importado' });
    tx.push({ _id: 'tx' + (++n), fecha: mesISO(m, 18), cuentaId: 'cc', importeCts: -6200,  concepto: 'BAR LA PLAZA', tags: [], tipo: 'gasto', origen: 'importado' });
    tx.push({ _id: 'tx' + (++n), fecha: mesISO(m, 22), cuentaId: 'cc', importeCts: -4150,  concepto: 'GASOLINERA', tags: [], tipo: 'gasto', origen: 'importado' });
    tx.push({ _id: 'tx' + (++n), fecha: mesISO(m, 25), cuentaId: 'cc', importeCts: 262500, concepto: 'NOMINA', tags: [], tipo: 'ingreso', origen: 'importado' });
  });
  set('state_transacciones', tx);
  set('state_puntosControl', []);

  set('state_goals', []);
  set('state_inflacion', [
    { _id: 'i1', year: hoy.getFullYear() - 1, tasa: 3.1 },
    { _id: 'i2', year: hoy.getFullYear(), tasa: 2.4 },
  ]);
  set('state_escenarios', [
    { _id: 's1', nombre: 'Cambio de coche', color: '#a78bfa', descripcion: 'Compra en 2 años', fechaFin: añoQueViene(2), inversiones: [] },
  ]);
  set('state_tramosGananciasCapitalHistorico', []);
  set('state_tramosIRPFHistorico', []);

  set('state_config', {
    dashboardStart: iso(hoy), dashboardEnd: añoQueViene(3), fechaReferencia: iso(hoy),
    colchonMeses: 6, showColchon: true, showHistorico: true, histCuenta: '',
    usarInflacion: true,
    tramos_irpf: [[0, 19], [12450, 24], [20200, 30], [35200, 37], [60000, 45], [300000, 47]],
    tramosGananciasCapital: [[0, 19], [6000, 21], [50000, 23], [200000, 27], [300000, 28]],
    onboardingDone: true, showExecSummary: true, colchonTipo: 'meses', colchonFijo: 0,
    escenarioActivo: null, activeTagsFilter: [], tagCategorias: ['vivienda'], tagGrupos: [],
    saludUmbralAhorroVerde: 20, saludUmbralAhorroAmarillo: 10, saludUmbralDTIVerde: 30,
    saludUmbralDTIAmarillo: 40, saludRegla: [50, 30, 20], saludExcluirHipoteca: false,
    saludTagHipoteca: 'hipoteca', storageMode: 'local', autoSave: false, autoSaveInterval: 15,
    analisisCollapsed: false,
  });

  localStorage.setItem('financeapp_session', JSON.stringify({ modo: 'local', creadaEn: Date.now(), ultimoUso: Date.now() }));
})();
