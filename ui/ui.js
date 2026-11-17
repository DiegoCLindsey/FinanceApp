// ==================== UI_UTILS ====================
// Depends on: State (common/state.js)
const UI = (() => {
  function toast(msg, type='ok') { const el=document.createElement('div'); el.className=`toast toast-${type}`; el.textContent=msg; document.getElementById('toast-container').appendChild(el); setTimeout(()=>el.remove(),3500); }
  function openModal(html, title='') { document.getElementById('modal-box')?.classList.remove('modal-box--ancho'); document.getElementById('modal-content').innerHTML=(title?`<div class="modal-title">${title}</div>`:'')+html; document.getElementById('modal-overlay').classList.remove('hidden'); }
  function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
  function confirm(msg) { return window.confirm(msg); }
  function input(id, label, type='text', value='', placeholder='', extra='') {
    return `<div class="form-group"><label class="form-label" for="${id}">${label}</label><input class="form-input" type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" ${extra}/></div>`;
  }
  function select(id, label, options, value='') {
    const opts=options.map(([v,l])=>`<option value="${v}"${v==value?' selected':''}>${l}</option>`).join('');
    return `<div class="form-group"><label class="form-label" for="${id}">${label}</label><select class="form-select" id="${id}">${opts}</select></div>`;
  }
  function accountSelect(id, label, value='') {
    const accounts = State.get('accounts') || [];
    const principalId = State.getPrincipalAccountId();
    const useValue = value || principalId;
    const sorted = [...accounts].sort((a, b) => {
      if (a.esCuentaPrincipal && !b.esCuentaPrincipal) return -1;
      if (!a.esCuentaPrincipal && b.esCuentaPrincipal) return 1;
      return a.nombre.localeCompare(b.nombre);
    });
    const opts = sorted.map(a => [
      a._id,
      a.nombre + (a.simulacion ? ' (SIM)' : '') + (a.esCuentaPrincipal ? ' ★' : '')
    ]);
    return select(id, label, opts, useValue);
  }

  // ── Widget día efectivo ────────────────────────────────────────────────────
  function diaPagoWidget(id, currentValue='') {
    let mode = 'none', diaNum = '1', nth = '1', wd = '1';
    if (currentValue && currentValue.startsWith('dia:')) {
      mode = 'dia'; diaNum = currentValue.slice(4);
    } else if (currentValue && currentValue.startsWith('nthweekday:')) {
      mode = 'nthweekday';
      const p = currentValue.split(':'); nth = p[1]; wd = p[2];
    }
    const diasOpts = [
      ...Array.from({length:28}, (_,i) => `<option value="${i+1}" ${diaNum==i+1?'selected':''}>${i+1}</option>`),
      `<option value="29" ${diaNum==='29'?'selected':''}>29</option>`,
      `<option value="30" ${diaNum==='30'?'selected':''}>30</option>`,
      `<option value="31" ${diaNum==='31'?'selected':''}>31</option>`,
      `<option value="ultimo" ${diaNum==='ultimo'?'selected':''}>Último día</option>`,
    ].join('');
    const nthOpts = [['1','1º'],['2','2º'],['3','3º'],['4','4º'],['5','5º'],['-1','Último']]
      .map(([v,l]) => `<option value="${v}" ${nth==v?'selected':''}>${l}</option>`).join('');
    const wdOpts = [['1','lunes'],['2','martes'],['3','miércoles'],['4','jueves'],['5','viernes'],['6','sábado'],['0','domingo']]
      .map(([v,l]) => `<option value="${v}" ${wd==v?'selected':''}>${l}</option>`).join('');
    return `<div class="form-group">
      <label class="form-label">Día efectivo</label>
      <div class="flex gap-8 items-center" style="flex-wrap:wrap;row-gap:6px">
        <select class="form-select" id="dp-mode-${id}" style="width:auto;min-width:145px" onchange="UI.onDiaPagoModeChange('${id}')">
          <option value="none" ${mode==='none'?'selected':''}>Sin ajuste</option>
          <option value="dia" ${mode==='dia'?'selected':''}>Día del mes</option>
          <option value="nthweekday" ${mode==='nthweekday'?'selected':''}>Día de la semana</option>
        </select>
        <span id="dp-dia-${id}" class="flex gap-8 items-center" style="${mode!=='dia'?'display:none':''}">
          el día <select class="form-select" id="dp-dnum-${id}" style="width:auto;min-width:80px">${diasOpts}</select>
        </span>
        <span id="dp-nth-${id}" class="flex gap-8 items-center" style="${mode!=='nthweekday'?'display:none':''}">
          el
          <select class="form-select" id="dp-nth-n-${id}" style="width:auto;min-width:72px">${nthOpts}</select>
          <select class="form-select" id="dp-nth-w-${id}" style="width:auto;min-width:105px">${wdOpts}</select>
          del mes
        </span>
      </div>
    </div>`;
  }

  function onDiaPagoModeChange(id) {
    const mode = document.getElementById('dp-mode-'+id)?.value;
    document.getElementById('dp-dia-'+id).style.display  = mode==='dia'         ? '' : 'none';
    document.getElementById('dp-nth-'+id).style.display  = mode==='nthweekday'  ? '' : 'none';
  }

  function getDiaPagoValue(id) {
    const mode = document.getElementById('dp-mode-'+id)?.value;
    if (!mode || mode === 'none') return '';
    if (mode === 'dia')
      return 'dia:' + document.getElementById('dp-dnum-'+id).value;
    if (mode === 'nthweekday')
      return 'nthweekday:' + document.getElementById('dp-nth-n-'+id).value +
             ':' + document.getElementById('dp-nth-w-'+id).value;
    return '';
  }
  // ── Fin widget día efectivo ────────────────────────────────────────────────

  return { toast, openModal, closeModal, confirm, input, select, accountSelect,
           diaPagoWidget, onDiaPagoModeChange, getDiaPagoValue };
})();

// Publicado para el paquete nuevo: ver la nota al final de common/state.js.
globalThis.UI = UI;

// ── El modal como diálogo: foco al abrir, foco de vuelta al cerrar ────────────
// Todos los formularios (legacy y nuevos) abren el mismo #modal-overlay quitando
// la clase `hidden`, cada uno por su cuenta. En vez de tocar cada punto, se
// observa esa clase: al abrirse se guarda quién tenía el foco y se lleva al
// primer campo; al cerrarse se devuelve. Antes el foco se quedaba en el botón
// de detrás y el teclado seguía actuando sobre la página tapada (docs/14, UX-03).
(() => {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
  const ov = document.getElementById('modal-overlay');
  const caja = document.getElementById('modal-box');
  if (!ov || !caja) return;
  let anterior = null;
  let abierto = !ov.classList.contains('hidden');
  const enfocables = () => [...caja.querySelectorAll('input:not([type=hidden]), select, textarea, button, [href], [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.disabled && el.offsetParent !== null);
  const alAbrir = () => {
    anterior = document.activeElement;
    const titulo = caja.querySelector('.modal-title')?.textContent?.trim();
    caja.setAttribute('aria-label', titulo || 'Ventana');
    // Con dedo no se enfoca un campo de texto: abriría el teclado y taparía
    // media ventana antes de haberla visto. Se enfoca la propia ventana.
    const tactil = window.matchMedia?.('(pointer: coarse)').matches;
    const primero = enfocables().find(el => !el.classList.contains('modal-close') && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName));
    setTimeout(() => (tactil || !primero ? caja : primero).focus({ preventScroll: true }), 30);
  };
  const alCerrar = () => { if (anterior && document.contains(anterior)) anterior.focus?.({ preventScroll: true }); anterior = null; };
  new MutationObserver(() => {
    const ahora = !ov.classList.contains('hidden');
    if (ahora === abierto) return;
    abierto = ahora;
    (abierto ? alAbrir : alCerrar)();
  }).observe(ov, { attributes: true, attributeFilter: ['class'] });
  // El tabulador no sale de la ventana mientras esté abierta.
  ov.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !abierto) return;
    const lista = enfocables();
    if (lista.length === 0) { e.preventDefault(); return; }
    const primero = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && (document.activeElement === primero || document.activeElement === caja)) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
})();
