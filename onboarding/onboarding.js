// Depends on: State, UI
const OnboardingModule = (() => {
  let step = 0;
  const STEPS = [
    {
      title: 'Bienvenido a FinanceApp',
      sub: 'En 4 pasos configuramos tu primera proyección financiera. Solo necesitas tu saldo actual, un ingreso y un gasto para empezar.',
      hint: '¿Qué obtendrás? Un dashboard con tu saldo proyectado, gastos del mes y horizonte financiero personalizado.',
      fields: null
    },
    { title:'Tu cuenta principal', sub:'¿Cuánto tienes ahora mismo en tu cuenta principal? Este valor es el punto de partida de todas las proyecciones.', fields: 'step-account' },
    { title:'Tus ingresos', sub:'Añade tu ingreso mensual principal (p. ej. tu nómina neta). Podrás añadir más fuentes de ingreso después.', fields: 'step-income' },
    { title:'Tus gastos fijos', sub:'¿Cuál es tu gasto más importante cada mes? Empieza por el más grande (alquiler, hipoteca...). Añadirás el resto después.', fields: 'step-expense' },
    { title:'Colchón de seguridad', sub:'El colchón es la reserva que quieres mantener siempre disponible. Lo habitual son 3-6 meses de gastos básicos.', fields: 'step-colchon' },
  ];

  function show() {
    step = 0;
    const overlay = document.getElementById('wizard-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    renderStep();
  }

  function renderStep() {
    const overlay = document.getElementById('wizard-overlay');
    if (!overlay) return;
    const s = STEPS[step];
    const dots = STEPS.map((_,i)=>`<div class="wizard-step-dot ${i===step?'active':i<step?'done':''}"></div>`).join('');
    let fields = '';
    if (s.fields === 'step-account') {
      const def = State.get('accounts').find(a=>a._id==='default')||{};
      fields = `<div class="grid-2">${UI.input('wiz-saldo','Saldo inicial de tu cuenta principal (€)','number',def.saldoInicial||0,'5000')}${UI.input('wiz-fecha','Fecha de referencia','date',def.fechaInicialSaldo||new Date().toISOString().slice(0,10))}</div>`;
    } else if (s.fields === 'step-income') {
      fields = `<div class="grid-2">${UI.input('wiz-inc-concepto','Nombre del ingreso','text','','Ej: Salario nómina')}${UI.input('wiz-inc-cuantia','Cuantía mensual (€)','number','','2500')}</div>`;
    } else if (s.fields === 'step-expense') {
      fields = `<div class="grid-2">${UI.input('wiz-exp-concepto','Nombre del gasto','text','','Ej: Alquiler')}${UI.input('wiz-exp-cuantia','Cuantía mensual (€)','number','','800')}</div>
                <div class="form-row mt-8"><label class="form-label">Marcar como gasto básico</label><label class="toggle"><input type="checkbox" id="wiz-exp-basico" checked/><span class="toggle-slider"></span></label></div>`;
    } else if (s.fields === 'step-colchon') {
      const cfg = State.get('config');
      fields = `<div class="flex gap-12 items-center">${UI.input('wiz-colchon','Meses de colchón','number',cfg.colchonMeses||6,'6')}<div class="text-sm" style="margin-top:20px">meses de gastos básicos como reserva de emergencia</div></div>`;
    }
    overlay.innerHTML = `<div class="wizard-card">
      <div class="wizard-step-indicator">${dots}</div>
      <div class="wizard-title">${s.title}</div>
      <div class="wizard-sub">${s.sub}</div>
      ${s.hint ? `<div class="auth-hint" style="margin-top:10px;font-size:12px">${s.hint}</div>` : ''}
      ${fields}
      <div class="wizard-actions">
        ${step===0 ? `<button class="btn-secondary" onclick="OnboardingModule.skip()">Configurar después</button>` : `<button class="btn-secondary" onclick="OnboardingModule.prev()">← Anterior</button>`}
        <button class="btn-primary" onclick="OnboardingModule.next()">${step===STEPS.length-1?'¡Listo, al Dashboard!':'Siguiente →'}</button>
      </div>
    </div>`;
  }

  function saveCurrentStep() {
    const s = STEPS[step];
    if (s.fields === 'step-account') {
      const saldo = parseFloat(document.getElementById('wiz-saldo')?.value)||0;
      const fecha = document.getElementById('wiz-fecha')?.value||new Date().toISOString().slice(0,10);
      const acc = State.get('accounts').find(a=>a._id==='default');
      if (acc) State.updateItem('accounts','default',{ saldoInicial:saldo, fechaInicialSaldo:fecha, saldo });
    } else if (s.fields === 'step-income') {
      const concepto = document.getElementById('wiz-inc-concepto')?.value.trim();
      const cuantia  = parseFloat(document.getElementById('wiz-inc-cuantia')?.value)||0;
      if (concepto && cuantia) State.addItem('expenses',{ concepto, tipo:'ingreso', cuantia, frecuencia:1, tipoFrecuencia:'mensual', fechaInicio:new Date().toISOString().slice(0,10), fechaFin:null, diaPago:'', cuenta:'default', activo:true, basico:false, varianza:0, inflacion:0, sujetoIRPF:false, tags:[] });
    } else if (s.fields === 'step-expense') {
      const concepto = document.getElementById('wiz-exp-concepto')?.value.trim();
      const cuantia  = parseFloat(document.getElementById('wiz-exp-cuantia')?.value)||0;
      const basico   = document.getElementById('wiz-exp-basico')?.checked||false;
      if (concepto && cuantia) State.addItem('expenses',{ concepto, tipo:'gasto', cuantia, frecuencia:1, tipoFrecuencia:'mensual', fechaInicio:new Date().toISOString().slice(0,10), fechaFin:null, diaPago:'', cuenta:'default', activo:true, basico, varianza:0, inflacion:0, sujetoIRPF:false, tags:[] });
    } else if (s.fields === 'step-colchon') {
      const meses = parseInt(document.getElementById('wiz-colchon')?.value)||6;
      const cfg = State.get('config');
      State.set('config',{...cfg, colchonMeses:meses});
    }
  }

  function next() {
    saveCurrentStep();
    if (step < STEPS.length-1) { step++; renderStep(); }
    else { finish(); }
  }
  function prev() { step--; renderStep(); }
  function skip() { finish(); }
  function finish() {
    const cfg = State.get('config');
    State.set('config',{...cfg, onboardingDone:true});
    document.getElementById('wizard-overlay')?.classList.add('hidden');
    Router.navigate('dashboard');
  }

  return { show, skip, next, prev };
})();
