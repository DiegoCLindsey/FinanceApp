// ==================== STATE_MANAGER ====================
// Depends on: StorageAdapter (common/storage.js)
const State = (() => {
  // Cuenta Default siempre presente
  // saldo        = saldo actual (para intereses)
  // saldoInicial = saldo en fechaInicialSaldo (punto de arranque del extracto)
  // historicoSaldos = [{_id, fecha, saldo, nota}] puntos de control reales
  const DEFAULT_ACCOUNT = { _id: 'default', nombre: 'Default', saldo: 0, saldoInicial: 0, fechaInicialSaldo: new Date().toISOString().slice(0,10), interes: 0, periodoCobro: 'mensual', descripcion: 'Cuenta principal', activo: true, simulacion: false, historicoSaldos: [] };
  const DEFAULT_STATE = {
    loans: [], expenses: [], accounts: [DEFAULT_ACCOUNT], history: [],
    goals: [],      // [{_id,nombre,targetAmount,targetDate,cuentaId,color}]
    config: {
      dashboardStart: new Date().toISOString().slice(0,10),
      dashboardEnd: new Date(Date.now() + 365*24*60*60*1000).toISOString().slice(0,10),
      colchonMeses: 6, showColchon: true, showHistorico: true, histCuenta: '',
      showMC: false, mcIteraciones: 300,
      inflacionGlobal: 0,  // % anual por defecto para gastos indexados
      tramos_irpf: [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]],
      onboardingDone: false,
      showExecSummary: true,
    }
  };
  let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  function get(key) { return state[key]; }
  function set(key, value) { state[key] = value; _persist(key); }
  async function _persist(key) { await StorageAdapter.set(`state_${key}`, state[key]); }
  async function load() {
    const _stateKeys = Object.keys(DEFAULT_STATE);
    for (const k of _stateKeys) { const val = StorageAdapter.get(`state_${k}`); if (val !== null) state[k] = val; }
    // Migrate: ensure accounts have new fields
    state.accounts = (state.accounts || []).map(a => ({
      saldoInicial: 0, fechaInicialSaldo: new Date().toISOString().slice(0,10), historicoSaldos: [],
      esFondoPension: false, bloqueoMeses: 120, impuestoRetirada: 0, aportaciones: [],
      ...a
    }));
    // Migrate: remove obsolete config fields (saldoInicial, saldoInicialFecha)
    delete state.config.saldoInicial;
    delete state.config.saldoInicialFecha;
    // Migrate: ensure new config fields exist
    const cfgDefs = {
      colchonMeses:6, showColchon:true, showHistorico:true, histCuenta:'',
      showMC:false, mcIteraciones:300, inflacionGlobal:0,
      tramos_irpf:[[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]],
      onboardingDone:false, showExecSummary:true, showCriticos:true
    };
    for (const [k,v] of Object.entries(cfgDefs)) {
      if (state.config[k] === undefined) state.config[k] = v;
    }
    // Migrate: ensure expenses have basico and varianza fields
    state.expenses = (state.expenses || []).map(e => ({ basico: false, varianza: 0, inflacion: 0, ...e }));
    // Migrate: ensure loans have inflacion field
    state.loans = (state.loans || []).map(l => ({ ...l }));
    // Ensure new collections
    if (!Array.isArray(state.goals)) state.goals = [];
    // Migrate goals: add new fields if missing
    state.goals = state.goals.map((g, i) => ({
      prioridad: i + 1,
      completado: false,
      cuentaIds: g.cuentaId ? [g.cuentaId] : [],
      usarColchon: true,
      ...g,
    }));
    // Migrate: convert old diaPago format to new unified format
    const _migDia = v => {
      if (!v) return '';
      if (v.startsWith('dia:') || v.startsWith('nthweekday:')) return v; // already new
      if (v === 'ultimo') return 'dia:ultimo';
      if (v === 'primer-lunes') return 'nthweekday:1:1';
      const n = parseInt(v); if (!isNaN(n)) return `dia:${n}`;
      return '';
    };
    state.loans    = (state.loans    || []).map(l => ({ ...l, diaPago: _migDia(l.diaPago) }));
    state.expenses = (state.expenses || []).map(e => ({ ...e, diaPago: _migDia(e.diaPago||'') }));
    // Garantizar que siempre existe Default
    ensureDefaultAccount();
  }
  function ensureDefaultAccount() {
    const accounts = state.accounts || [];
    if (!accounts.find(a => a._id === 'default')) {
      state.accounts = [{ ...DEFAULT_ACCOUNT }, ...accounts];
      _persist('accounts');
    }
  }
  function addItem(col, item) { const arr = [...(state[col]||[])]; const ni = { ...item, _id: _uid() }; arr.push(ni); set(col, arr); return ni; }
  function updateItem(col, id, patch) { set(col, (state[col]||[]).map(i => i._id===id ? {...i,...patch} : i)); }
  function removeItem(col, id) { set(col, (state[col]||[]).filter(i => i._id!==id)); }
  function _uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
  // Helper: nombres de cuentas para selects
  function accountOptions() { return (state.accounts||[]).map(a => [a._id, a.nombre + (a.simulacion?' (SIM)':'')]); }
  function accountName(id) { const a = (state.accounts||[]).find(a=>a._id===id); return a ? a.nombre : id; }
  return { get, set, load, addItem, updateItem, removeItem, ensureDefaultAccount, accountOptions, accountName };
})();
