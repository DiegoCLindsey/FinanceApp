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
      tipoFrecuencia: 'mensual', frecuencia: 12, diaPago: 'dia:15',
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
      tipoFrecuencia: 'extraordinario', frecuencia: 1, diaPago: 'dia:8',
      fechaInicio: desplazar(4), fechaFin: null, cuenta: 'aho', activo: true, tags: ['obras'], escenarioIds: [] },
    { _id: 'e9', concepto: 'Luz y gas', cuantia: 95, tipo: 'gasto', clasificacion: 'basico',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:14',
      fechaInicio: desplazar(-12), fechaFin: null, cuenta: 'cc', activo: true, tags: ['casa'], escenarioIds: [] },
    { _id: 'e10', concepto: 'Ocio y varios', cuantia: 250, tipo: 'gasto', clasificacion: 'deseo',
      tipoFrecuencia: 'mensual', frecuencia: 1, diaPago: 'dia:28',
      fechaInicio: desplazar(-12), fechaFin: null, cuenta: 'cc', activo: true, tags: ['varios'], escenarioIds: [] },
    // Gasto único y gordo a tres meses: hunde la cuenta corriente por debajo de
    // su margen de liquidez y es lo que hace que los avisos del dashboard y la
    // tarjeta de gastos extraordinarios tengan algo que enseñar.
    { _id: 'e11', concepto: 'Entrada coche nuevo', cuantia: 14000, tipo: 'gasto', clasificacion: 'deseo',
      tipoFrecuencia: 'extraordinario', frecuencia: 1, diaPago: 'dia:10',
      fechaInicio: desplazar(3), fechaFin: null, cuenta: 'cc', activo: true, tags: ['coche'], escenarioIds: [] },
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

  // Movimientos reales de los SEIS últimos meses cerrados (el analizador de
  // precisión ignora el mes en curso, así que un mes «-0» no aportaría nada).
  //
  // Los importes VARÍAN de mes a mes a propósito. Con cifras idénticas cada mes
  // la desviación típica de cada estimación es 0, y entonces la banda de
  // confianza del dashboard se calcula bien pero se dibuja con ancho cero: en
  // QA parece que la funcionalidad no está. Cada estimación aporta aquí un
  // patrón distinto:
  //   · Alquiler      → recibo fijo, σ = 0 (así se ve que el caso existe).
  //   · Luz y gas     → estacional, se pasa y se queda corto alternando.
  //   · Supermercado  → sistemáticamente por encima de lo estimado (sesgo).
  //   · Ocio y varios → gasto a saltos; es el que domina la banda.
  // Bar y gasolinera van sin estimación: son el «gasto que no tenías previsto»
  // del cierre de mes.
  var tx = [];
  var n = 0;
  var mesISO = function (m, d) {
    var f = new Date(hoy);
    // Día 1 ANTES de mover el mes: desde un día 29-31, setMonth se desborda al
    // mes siguiente y el movimiento acaba cayendo en el mes que no es.
    f.setDate(1); f.setMonth(f.getMonth() + m); f.setDate(d); return iso(f);
  };
  // mes, alquiler, súper, luz, suscripciones, ocio, bar, gasolinera (céntimos)
  var reales = [
    [-6, 95000, 51100,  7820, 3800, 12000, 6200, 4150],
    [-5, 95000, 46850, 14240, 4290, 64000, 3110, 5980],
    [-4, 95000, 55320, 10410, 3800, 31000, 8740, 3920],
    [-3, 95000, 40210,  6190, 3800, 89000, 4560, 6310],
    [-2, 95000, 61940,  8830, 4580, 18000, 9930, 4470],
    [-1, 95000, 48730, 13370, 3800, 42000, 5280, 5140],
  ];
  reales.forEach(function (r) {
    var m = r[0];
    var apunte = function (dia, cts, concepto, tags, estimacionId) {
      tx.push({ _id: 'tx' + (++n), fecha: mesISO(m, dia), cuentaId: 'cc', importeCts: -cts,
        concepto: concepto, tags: tags, estimacionId: estimacionId, tipo: 'gasto', origen: 'importado' });
    };
    apunte(1,  r[1], 'ALQUILER',      ['vivienda'], 'e1');
    apunte(5,  r[2], 'SUPERMERCADO',  ['comida'],   'e2');
    apunte(14, r[3], 'LUZ Y GAS',     ['casa'],     'e9');
    apunte(12, r[4], 'SUSCRIPCIONES', ['ocio'],     'e3');
    apunte(28, r[5], 'OCIO Y VARIOS', ['varios'],   'e10');
    apunte(18, r[6], 'BAR LA PLAZA',  [],           undefined);
    apunte(22, r[7], 'GASOLINERA',    [],           undefined);
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
    margenesSeguridad: [
      { _id: 'm1', nombre: 'Liquidez cuenta corriente', activo: true, cuentas: ['cc'],
        puntos: [{ _id: 'mp1', fecha: desplazar(-12), tipo: 'fijo', importe: 6000 }] },
    ],
    saludUmbralAhorroVerde: 20, saludUmbralAhorroAmarillo: 10, saludUmbralDTIVerde: 30,
    saludUmbralDTIAmarillo: 40, saludRegla: [50, 30, 20], saludExcluirHipoteca: false,
    saludTagHipoteca: 'hipoteca', storageMode: 'local', autoSave: false, autoSaveInterval: 15,
    analisisCollapsed: false,
  });

  localStorage.setItem('financeapp_session', JSON.stringify({ modo: 'local', creadaEn: Date.now(), ultimoUso: Date.now() }));

  // Autocomprobación. El motor solo entiende tres periodicidades; cualquier otra
  // proyecta CERO eventos sin quejarse, y entonces media aplicación sale a 0 € y
  // el QA da por buena una pantalla vacía. Ya ha pasado dos veces con estos
  // datos: primero con `nombre`/`importe` en vez de `concepto`/`cuantia`, y
  // después con `tipoFrecuencia: 'anual'` y `'unico'`, que no existen. Como el
  // piloto cuenta los console.error, un fallo aquí tiñe el informe de rojo.
  var FRECUENCIAS = ['mensual', 'diaria', 'extraordinario'];
  JSON.parse(localStorage.getItem(P + 'state_expenses')).forEach(function (e) {
    if (FRECUENCIAS.indexOf(e.tipoFrecuencia) < 0) {
      console.error('[datos QA] ' + e._id + ' (' + e.concepto + ') usa tipoFrecuencia "' + e.tipoFrecuencia + '", que el motor ignora: proyectará 0 €.');
    }
    if (e.concepto === undefined || e.cuantia === undefined) {
      console.error('[datos QA] ' + e._id + ' no está en la forma canónica (concepto/cuantia).');
    }
  });
})();
