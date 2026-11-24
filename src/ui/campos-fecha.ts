// ── ui/campos-fecha ───────────────────────────────────────────────────────────
// Que se pueda ESCRIBIR una fecha entera en cualquier campo de fecha.
//
// Chrome dispara `change` en un campo de fecha cada vez que lo que hay escrito
// forma una fecha completa, y como los campos llegan rellenos (hoy, la fecha
// guardada…) eso pasa con la primera tecla: al escribir el día ya hay fecha. Las
// pantallas que guardan y repintan en `change` —los puntos de un margen de
// seguridad, la barra de periodo, los filtros de Cuentas, «Otros meses»—
// sustituían el campo a mitad de escribir y el año no había forma de meterlo.
//
// Aquí, en un solo sitio y para todas las pantallas: mientras se está tecleando
// en un campo de fecha, su `change` se aguanta hasta que se confirma (al salir
// del campo o con Intro) y entonces se dispara una vez, con la fecha final. Lo
// que no es teclear —elegir en el calendario, un valor puesto por código— pasa
// como siempre, al momento.

const TIPOS = new Set(['date', 'month', 'datetime-local', 'time', 'week']);
/** Teclas que editan el campo (dígitos, flechas, borrar): lo demás no cuenta. */
const TECLA_DE_EDICION = /^(\d|Arrow(Up|Down|Left|Right)|Backspace|Delete)$/;

const INSTALADO = Symbol.for('financeapp.camposFecha');

/**
 * ¿Sigue el usuario dentro del campo? Al disparar `change` mientras se teclea,
 * Chrome deja el foco en las piezas internas del campo (día, mes, año): el
 * documento dice que el elemento activo es el `<body>` y solo `:focus-within`
 * lo ve.
 */
function tieneFoco(t: HTMLInputElement): boolean {
  if (t.ownerDocument.activeElement === t) return true;
  try {
    return t.matches(':focus-within');
  } catch {
    return false;
  }
}

function esCampoFecha(t: EventTarget | null): t is HTMLInputElement {
  return !!t && (t as HTMLElement).tagName === 'INPUT' && TIPOS.has((t as HTMLInputElement).type);
}

/**
 * Instala el comportamiento en la ventana (una vez; llamarlo otra vez no hace
 * nada). Devuelve una función que lo retira.
 */
export function instalarCamposFecha(win: Window & { [INSTALADO]?: () => void } = window): () => void {
  if (win[INSTALADO]) return win[INSTALADO] as () => void;
  /** Campos en los que se está tecleando ahora mismo. */
  const tecleando = new WeakSet<HTMLInputElement>();
  /** Campos con un `change` aguantado, a la espera de confirmar. */
  const pendientes = new WeakSet<HTMLInputElement>();
  /** El `change` que se dispara al confirmar no se vuelve a aguantar. */
  const reenviando = new WeakSet<HTMLInputElement>();

  function confirmar(campo: HTMLInputElement): void {
    tecleando.delete(campo);
    if (!pendientes.has(campo)) return;
    pendientes.delete(campo);
    if (!campo.isConnected) return;
    reenviando.add(campo);
    try {
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    } finally {
      reenviando.delete(campo);
    }
  }

  const alTeclear = (ev: KeyboardEvent) => {
    if (!esCampoFecha(ev.target)) return;
    if (ev.key === 'Enter') confirmar(ev.target);
    else if (TECLA_DE_EDICION.test(ev.key)) tecleando.add(ev.target);
  };
  // En la fase de captura y en la ventana: llega antes que cualquier manejador
  // de la página, también los `onchange="…"` escritos en el HTML.
  const alCambiar = (ev: Event) => {
    const t = ev.target;
    if (!esCampoFecha(t) || reenviando.has(t) || !tecleando.has(t)) return;
    if (!tieneFoco(t)) return;
    ev.stopImmediatePropagation();
    pendientes.add(t);
  };
  const alSalir = (ev: FocusEvent) => {
    if (esCampoFecha(ev.target)) confirmar(ev.target);
  };

  win.addEventListener('keydown', alTeclear, true);
  win.addEventListener('change', alCambiar, true);
  win.addEventListener('blur', alSalir as EventListener, true);
  const retirar = () => {
    win.removeEventListener('keydown', alTeclear, true);
    win.removeEventListener('change', alCambiar, true);
    win.removeEventListener('blur', alSalir as EventListener, true);
    delete win[INSTALADO];
  };
  win[INSTALADO] = retirar;
  return retirar;
}
