// Depends on: State, UI

// Fecha civil de HOY en local. `new Date().toISOString().slice(0,10)` devuelve
// AYER entre medianoche y las 01:00/02:00 en husos con desfase positivo, que es
// el nuestro. Ver la nota larga en finance-math.js.
function _hoyLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const OnboardingModule = (() => {
  let step = 0;
  // Lo contestado en cada paso. Se escribe UNA vez, al terminar: antes cada
  // «Siguiente» hacía `State.addItem`, así que volver atrás y avanzar otra vez
  // duplicaba el ingreso y el gasto (docs/14, BUG-07).
  let resp = {};
  const _escAttr = v => String(v ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
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
    resp = {};
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
      const def = State.get('accounts').find(a=>a._id===State.getPrincipalAccountId())||{};
      fields = `<div class="grid-2">${UI.input('wiz-saldo','Saldo inicial de tu cuenta principal (€)','number',resp.saldo ?? (def.saldoInicial||0),'5000')}${UI.input('wiz-fecha','Fecha de referencia','date',resp.fecha||def.fechaInicialSaldo||_hoyLocal())}</div>`;
    } else if (s.fields === 'step-income') {
      fields = `<div class="grid-2">${UI.input('wiz-inc-concepto','Nombre del ingreso','text',_escAttr(resp.incConcepto),'Ej: Salario nómina')}${UI.input('wiz-inc-cuantia','Cuantía mensual (€)','number',resp.incCuantia||'','2500')}</div>`;
    } else if (s.fields === 'step-expense') {
      fields = `<div class="grid-2">${UI.input('wiz-exp-concepto','Nombre del gasto','text',_escAttr(resp.expConcepto),'Ej: Alquiler')}${UI.input('wiz-exp-cuantia','Cuantía mensual (€)','number',resp.expCuantia||'','800')}</div>
                <div class="form-row mt-8"><label class="form-label">Marcar como gasto básico</label><label class="toggle"><input type="checkbox" id="wiz-exp-basico" ${resp.expBasico === false ? '' : 'checked'}/><span class="toggle-slider"></span></label></div>`;
    } else if (s.fields === 'step-colchon') {
      const cfg = State.get('config');
      fields = `<div class="flex gap-12 items-center">${UI.input('wiz-colchon','Meses de colchón','number',resp.colchonMeses ?? (cfg.colchonMeses||6),'6')}<div class="text-sm" style="margin-top:20px">meses de gastos básicos como reserva de emergencia</div></div>`;
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

  /** Recoge lo tecleado en el paso actual. No escribe nada en el estado. */
  function saveCurrentStep() {
    const s = STEPS[step];
    const val = id => document.getElementById(id)?.value ?? '';
    if (s.fields === 'step-account') {
      resp.saldo = parseFloat(val('wiz-saldo')) || 0;
      resp.fecha = val('wiz-fecha') || _hoyLocal();
    } else if (s.fields === 'step-income') {
      resp.incConcepto = val('wiz-inc-concepto').trim();
      resp.incCuantia  = parseFloat(val('wiz-inc-cuantia')) || 0;
    } else if (s.fields === 'step-expense') {
      resp.expConcepto = val('wiz-exp-concepto').trim();
      resp.expCuantia  = parseFloat(val('wiz-exp-cuantia')) || 0;
      resp.expBasico   = document.getElementById('wiz-exp-basico')?.checked || false;
    } else if (s.fields === 'step-colchon') {
      const meses = parseInt(val('wiz-colchon'), 10);
      resp.colchonMeses = Number.isFinite(meses) && meses >= 0 ? meses : 6;
    }
  }

  /** Vuelca las respuestas al estado. Solo lo llama `finish()`. */
  function _aplicarRespuestas() {
    const cuenta = State.getPrincipalAccountId();
    if (resp.saldo !== undefined) {
      State.updateItem('accounts', cuenta, { saldoInicial: resp.saldo, fechaInicialSaldo: resp.fecha, saldo: resp.saldo });
    }
    const base = { frecuencia:1, tipoFrecuencia:'mensual', fechaInicio:_hoyLocal(), fechaFin:null, diaPago:'', cuenta, activo:true, sujetoIRPF:false, tags:[] };
    if (resp.incConcepto && resp.incCuantia > 0) State.addItem('expenses', { ...base, concepto:resp.incConcepto, tipo:'ingreso', cuantia:resp.incCuantia, basico:false });
    if (resp.expConcepto && resp.expCuantia > 0) State.addItem('expenses', { ...base, concepto:resp.expConcepto, tipo:'gasto', cuantia:resp.expCuantia, basico:!!resp.expBasico, clasificacion:'necesidad' });
    if (resp.colchonMeses !== undefined) State.set('config', { ...State.get('config'), colchonMeses: resp.colchonMeses });
  }

  function next() {
    saveCurrentStep();
    if (step < STEPS.length-1) { step++; renderStep(); }
    else { finish(); }
  }
  function prev() { saveCurrentStep(); step--; renderStep(); }
  function skip() { finish(); }
  function finish() {
    _aplicarRespuestas();
    const cfg = State.get('config');
    State.set('config',{...cfg, onboardingDone:true});
    document.getElementById('wizard-overlay')?.classList.add('hidden');
    // La barra de periodo enseña el saldo de anclaje: sin esto seguía en 0 €.
    if (typeof PeriodBar !== 'undefined') PeriodBar.init(State.get('config'));
    Router.navigate('dashboard');
  }

  return { show, skip, next, prev };
})();

// Publicado para el paquete nuevo: ver la nota al final de common/state.js.
globalThis.OnboardingModule = OnboardingModule;
