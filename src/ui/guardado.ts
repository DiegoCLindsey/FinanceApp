// ── ui/guardado ───────────────────────────────────────────────────────────────
// «Tienes cambios sin guardar».
//
// La copia en la nube es manual salvo que actives el autoguardado, así que hasta
// ahora nada te decía que llevabas media hora de trabajo sin subir. El aviso
// cuelga del MISMO registro de cambios que usa el cuadro de mando para saber si
// tiene que recalcular (`state/cambios`): una sola señal, dos interesados con su
// propia marca de agua.
//
// Ciclo de vida, tal como se pidió:
//
//   sin cambios ──cambia algo──▶ «tienes cambios sin guardar»
//                                  │            │
//                          «Ocultar»│            │«Guardar ahora» / el temporizador
//                                  ▼            ▼
//                              oculto      «Subiendo…» ──▶ «¡Guardado!» ──▶ se cierra
//
// Dos detalles que se decidieron pensando en qué pasa cuando falla:
//
//  · **Ocultar no es guardar.** Se esconde este aviso, pero si más tarde entra
//    otro cambio vuelve a aparecer: lo contrario sería enseñar «todo guardado»
//    con cosas sin subir.
//  · **Lo que se confirma es la revisión que se subió**, no la de cuando terminó
//    la subida. Un cambio hecho mientras la copia volaba sigue contando como
//    pendiente en cuanto acaba.

import type { RegistroCambios } from '@/state/cambios';

export type EstadoGuardado = 'oculto' | 'pendiente' | 'subiendo' | 'guardado' | 'error';

export interface DepsGuardado {
  cambios: RegistroCambios;
  /** ¿Hay un destino de copia configurado? Sin nube no hay nada que avisar. */
  hayDestino: () => boolean;
  /** Lanza la subida. Debe resolver cuando la copia está arriba. */
  guardar: () => Promise<void>;
  contenedor?: () => HTMLElement | null;
  doc?: Document;
  /** Cuánto se enseña «¡Guardado!» antes de cerrarse solo. */
  msExito?: number;
}

export interface Guardado {
  /** Estado visible ahora mismo. */
  estado(): EstadoGuardado;
  /** Lanza el guardado desde fuera (el temporizador de autoguardado). */
  guardarAhora(): Promise<void>;
  detener(): void;
}

const ID = 'aviso-guardado';

export function instalarAvisoGuardado(deps: DepsGuardado): Guardado {
  const doc = deps.doc ?? document;
  const contenedor = deps.contenedor ?? (() => doc.getElementById('toast-container'));
  const msExito = deps.msExito ?? 1800;

  const marca = deps.cambios.crearMarca('guardado');
  let estado: EstadoGuardado = 'oculto';
  let ocultadoPorElUsuario = false;
  let cierre: ReturnType<typeof setTimeout> | null = null;
  let enVuelo: Promise<void> | null = null;

  function quitar() {
    if (cierre) clearTimeout(cierre);
    cierre = null;
    doc.getElementById(ID)?.remove();
  }

  function pintar() {
    if (estado === 'oculto') return quitar();
    const host = contenedor();
    if (!host) return;

    let el = doc.getElementById(ID);
    if (!el) {
      el = doc.createElement('div');
      el.id = ID;
      host.appendChild(el);
    }
    el.className = `toast toast-guardado toast-guardado--${estado}`;
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.gap = '12px';
    el.textContent = '';

    const texto = doc.createElement('span');
    texto.style.flex = '1';
    el.appendChild(texto);

    if (estado === 'pendiente') {
      texto.textContent = 'Tienes cambios sin guardar.';
      el.appendChild(boton('Guardar ahora', 'btn-primary btn-sm', () => void guardarAhora()));
      el.appendChild(
        boton('Ocultar', 'btn-secondary btn-sm', () => {
          ocultadoPorElUsuario = true;
          estado = 'oculto';
          pintar();
        }),
      );
    } else if (estado === 'subiendo') {
      texto.textContent = 'Subiendo…';
      const giro = doc.createElement('span');
      giro.className = 'guardado-giro';
      giro.setAttribute('aria-hidden', 'true');
      el.appendChild(giro);
    } else if (estado === 'guardado') {
      texto.textContent = '¡Guardado!';
    } else if (estado === 'error') {
      texto.textContent = 'No se ha podido guardar.';
      el.appendChild(boton('Reintentar', 'btn-primary btn-sm', () => void guardarAhora()));
    }
  }

  function boton(etiqueta: string, clase: string, alPulsar: () => void): HTMLButtonElement {
    const b = doc.createElement('button');
    b.type = 'button';
    b.className = clase;
    b.textContent = etiqueta;
    b.style.flexShrink = '0';
    b.addEventListener('click', alPulsar);
    return b;
  }

  async function guardarAhora(): Promise<void> {
    // Una subida a la vez. Si el temporizador salta mientras el usuario ya le ha
    // dado al botón, se engancha a la que hay en vuelo en vez de lanzar otra.
    if (enVuelo) return enVuelo;
    if (cierre) clearTimeout(cierre);

    // La revisión que se lleva ESTA subida. Lo que entre a partir de ahora
    // seguirá contando como pendiente cuando esto termine.
    const revisionSubida = deps.cambios.revision();
    estado = 'subiendo';
    pintar();

    enVuelo = (async () => {
      try {
        await deps.guardar();
        marca.alDia(revisionSubida);
        estado = 'guardado';
        pintar();
        cierre = setTimeout(() => {
          // Si mientras se subía entró otro cambio, el aviso no se va: vuelve a
          // «pendiente», que es la verdad.
          estado = marca.pendiente() ? 'pendiente' : 'oculto';
          if (estado === 'pendiente') ocultadoPorElUsuario = false;
          pintar();
        }, msExito);
      } catch (e) {
        console.error('[guardado] no se ha podido subir la copia:', e);
        estado = 'error';
        pintar();
      } finally {
        enVuelo = null;
      }
    })();

    return enVuelo;
  }

  const desuscribir = deps.cambios.suscribir(() => {
    if (!deps.hayDestino()) return; // sin nube configurada no hay nada que avisar
    // Un cambio nuevo reabre el aviso aunque se hubiera ocultado: ocultar valía
    // para los cambios de entonces, no para los de ahora.
    ocultadoPorElUsuario = false;
    if (estado === 'subiendo') return; // ya se está pintando el progreso
    estado = 'pendiente';
    pintar();
  });

  return {
    estado: () => (ocultadoPorElUsuario && estado === 'oculto' ? 'oculto' : estado),
    guardarAhora,
    detener() {
      desuscribir();
      quitar();
    },
  };
}
