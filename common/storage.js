// ==================== STORAGE_ADAPTER ====================
// Almacenamiento local únicamente — localStorage como store principal.
// Google Drive actúa como backup externo (ver auth/auth.js), no como store primario.
const StorageAdapter = (() => {
  const P = 'financeapp_';
  function get(key)        { const r = localStorage.getItem(P + key); return r ? JSON.parse(r) : null; }
  function set(key, value) { localStorage.setItem(P + key, JSON.stringify(value)); return true; }
  function remove(key)     { localStorage.removeItem(P + key); return true; }
  return { get, set, remove };
})();
