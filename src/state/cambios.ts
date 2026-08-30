// ── state/cambios ─────────────────────────────────────────────────────────────
// «Ha cambiado algo». Una sola señal, varios interesados.
//
// Dos problemas distintos tenían la misma raíz:
//
//   · Las gráficas no se enteraban de que los datos habían cambiado, así que
//     había que darle a «Actualizar» a mano. Recalcularlas en cada repintado
//     tampoco vale: son caras y la mayoría de repintados no cambian nada.
//   · Nada avisaba de que había cambios sin subir a la nube.
//
// ── Por qué un CONTADOR y no un booleano ─────────────────────────────────────
//
// Un solo `sucio = true` no puede servir a los dos, porque **se limpian en
// momentos distintos**: las gráficas dejan de estar sucias cuando se repintan,
// y los datos dejan de estar sin guardar cuando se suben. Con un booleano
// compartido, repintar el cuadro de mando borraría el aviso de «sin guardar» y
// el usuario se iría convencido de haber guardado.
//
// Así que la señal es un contador que solo sube, y cada interesado se queda con
// la marca de agua de la última revisión que atendió. Es el mismo flag —una
// única fuente de verdad sobre «cuándo cambió algo por última vez»— con un
// consumo independiente por interesado.

export type OrigenCambio = string;

export interface MarcaDeAgua {
  /** Nombre del interesado, para depurar. */
  readonly nombre: string;
  /** ¿Ha cambiado algo desde la última vez que este interesado se puso al día? */
  pendiente(): boolean;
  /**
   * Marca como atendido hasta `hasta`, o hasta la revisión actual si se omite.
   *
   * El parámetro NO es un adorno: subir a la nube tarda, y quien sube confirma
   * la revisión que se llevó, no la de cuando terminó. Sin esto, un cambio
   * hecho mientras la copia estaba en vuelo se daría por guardado y el aviso
   * desaparecería con el cambio todavía en el aire.
   */
  alDia(hasta?: number): void;
  /** Revisión que este interesado atendió por última vez. */
  vista(): number;
}

export interface RegistroCambios {
  /** Revisión actual de los datos. Solo sube. */
  revision(): number;
  /** Qué provocó el último cambio (clave de colección, import, restauración…). */
  ultimoOrigen(): OrigenCambio | null;
  /** Registra un cambio. Devuelve la revisión nueva. */
  marcar(origen: OrigenCambio): number;
  /** Avisa a los suscriptores en cada cambio. Devuelve el `desuscribir`. */
  suscribir(cb: (revision: number, origen: OrigenCambio) => void): () => void;
  /** Crea una marca de agua independiente. Nace al día con lo que hay. */
  crearMarca(nombre: string): MarcaDeAgua;
}

export function crearRegistroCambios(): RegistroCambios {
  let revision = 0;
  let origen: OrigenCambio | null = null;
  const suscriptores = new Set<(r: number, o: OrigenCambio) => void>();

  function marcar(o: OrigenCambio): number {
    revision += 1;
    origen = o;
    // Un suscriptor que falle no puede impedir que se entere el siguiente: aquí
    // cuelgan avisos de la interfaz, y perder uno deja al usuario sin saber que
    // tiene cambios sin guardar.
    for (const cb of suscriptores) {
      try {
        cb(revision, o);
      } catch (e) {
        console.error('[cambios] un suscriptor ha fallado:', e);
      }
    }
    return revision;
  }

  return {
    revision: () => revision,
    ultimoOrigen: () => origen,
    marcar,
    suscribir(cb) {
      suscriptores.add(cb);
      return () => suscriptores.delete(cb);
    },
    crearMarca(nombre) {
      // Nace al día: al arrancar, lo que hay en pantalla ya refleja lo que hay
      // en disco. Nacer «pendiente» haría que la aplicación se abriera siempre
      // diciendo que tienes cambios sin guardar.
      let vista = revision;
      return {
        nombre,
        pendiente: () => revision > vista,
        alDia: (hasta?: number) => {
          // Nunca hacia atrás: confirmar una revisión vieja no «desconfirma» lo
          // que ya se había dado por atendido.
          vista = Math.max(vista, hasta ?? revision);
        },
        vista: () => vista,
      };
    },
  };
}
