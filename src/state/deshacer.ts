// ── state/deshacer ────────────────────────────────────────────────────────────
// Deshacer el último borrado.
//
// Borrar un gasto, una cuenta o un movimiento era inmediato e irreversible. En
// una aplicación cuyo valor entero es la confianza en sus datos, eso hace que el
// usuario dude antes de tocar nada, y un usuario que no limpia sus datos acaba
// con una proyección peor.
//
// Dos decisiones, las dos por lo mismo —que deshacer sea de fiar o no exista—:
//
//  · **Una sola posición.** Cubre el susto real («no era ese») sin abrir la
//    pregunta «¿deshacer qué?», que sin un historial a la vista no tiene
//    respuesta. Un segundo borrado tapa al primero, igual que en el aviso
//    flotante solo cabe uno.
//  · **Con caducidad.** Un «deshacer» que sigue ahí media hora después es una
//    trampa: para entonces el usuario ya ha tocado otras cosas y devolver la
//    fila a su sitio le sorprende más que le ayuda. Vive lo que vive el aviso.

/** Elemento borrado, con lo justo para devolverlo a su sitio. */
export interface BorradoRegistrado {
  col: string;
  item: { _id: string } & Record<string, unknown>;
  /** Posición que ocupaba: se restaura donde estaba, no al final. */
  indice: number;
  cuando: number;
}

export interface OpcionesHistorial {
  /** Cuánto se puede deshacer, en milisegundos. Por defecto 15 s. */
  ventanaMs?: number;
  /** Reloj inyectable para los tests. */
  ahora?: () => number;
}

export interface HistorialBorrados {
  registrar(borrado: Omit<BorradoRegistrado, 'cuando'>): void;
  /** El borrado vigente, o `null` si no hay o ya ha caducado. */
  pendiente(): BorradoRegistrado | null;
  /** Lo devuelve y lo consume: deshacer dos veces no restaura dos veces. */
  tomar(): BorradoRegistrado | null;
  limpiar(): void;
}

export function crearHistorialBorrados({ ventanaMs = 15_000, ahora = () => Date.now() }: OpcionesHistorial = {}): HistorialBorrados {
  let ultimo: BorradoRegistrado | null = null;

  function vigente(): BorradoRegistrado | null {
    if (!ultimo) return null;
    if (ahora() - ultimo.cuando > ventanaMs) {
      ultimo = null;
      return null;
    }
    return ultimo;
  }

  return {
    registrar(borrado) {
      ultimo = { ...borrado, cuando: ahora() };
    },
    pendiente: vigente,
    tomar() {
      const b = vigente();
      ultimo = null;
      return b;
    },
    limpiar() {
      ultimo = null;
    },
  };
}

/** Artículo y nombre de cada colección, para la frase del aviso. */
const NOMBRES: Record<string, { articulo: string; que: string }> = {
  expenses: { articulo: 'El', que: 'gasto' },
  accounts: { articulo: 'La', que: 'cuenta' },
  loans: { articulo: 'El', que: 'préstamo' },
  nominas: { articulo: 'La', que: 'nómina' },
  inflacion: { articulo: 'El', que: 'periodo de inflación' },
  transacciones: { articulo: 'El', que: 'movimiento' },
  puntosControl: { articulo: 'El', que: 'punto de control' },
};

/** Cómo se llama lo borrado, mirando el campo que cada colección usa. */
export function describirItem(col: string, item: Record<string, unknown>): string {
  const n = NOMBRES[col] ?? { articulo: 'El', que: 'elemento' };
  // Cada colección guarda su nombre en un campo distinto —herencia de que
  // crecieron por separado— y la inflación no tiene nombre ninguno: se la
  // identifica por el año.
  const etiqueta = item.concepto ?? item.nombre ?? item.titulo ?? (item.year !== undefined ? String(item.year) : null);
  return etiqueta ? `${n.articulo} ${n.que} «${String(etiqueta)}»` : `${n.articulo} ${n.que}`;
}
