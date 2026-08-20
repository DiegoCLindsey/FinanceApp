// ==================== STORAGE_ADAPTER ====================
// Almacenamiento local únicamente — localStorage como store principal.
// La nube (Firebase/Dropbox) es copia de seguridad, no store primario.
const StorageAdapter = (() => {
  const P = 'financeapp_';
  /** Clave del sello: cuándo se tocó por última vez algo de los datos. */
  const SELLO = 'state__modificadoEn';

  function get(key)        { const r = localStorage.getItem(P + key); return r ? JSON.parse(r) : null; }
  function remove(key)     { localStorage.removeItem(P + key); return true; }

  function _escribir(key, value) { localStorage.setItem(P + key, JSON.stringify(value)); return true; }

  /**
   * Escribe y sella la hora.
   *
   * El sello existe para poder responder a "¿cuál de las dos copias es más
   * reciente, la local o la de la nube?". Antes no se podía: al arrancar se
   * descargaba el backup y se volcaba encima del local SIN comparar nada, y
   * como el autoguardado viene apagado de fábrica, cualquier cambio que no
   * hubieras subido a mano desaparecía en la siguiente recarga. Borrabas un
   * gasto y volvía.
   */
  function set(key, value) {
    const ok = _escribir(key, value);
    if (key !== SELLO && key.startsWith('state_')) _escribir(SELLO, Date.now());
    return ok;
  }

  /**
   * Escribe SIN mover el sello. La usa la restauración desde la nube: los datos
   * que acaban de bajar no son una modificación tuya, y sellarlos como tal haría
   * que el local pareciera siempre el más nuevo.
   */
  function setRestaurando(key, value) { return _escribir(key, value); }

  /** Momento de la última modificación local (ms), o null si nunca se tocó. */
  function modificadoEn() { return get(SELLO); }

  /** Fija el sello a la hora de la copia restaurada. */
  function sellar(ms) { return _escribir(SELLO, ms || Date.now()); }

  return { get, set, remove, setRestaurando, modificadoEn, sellar };
})();
