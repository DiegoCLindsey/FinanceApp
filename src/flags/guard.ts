// ── flags/guard ───────────────────────────────────────────────────────────────
// Segunda línea de defensa de los feature flags.
//
// La primera línea es visual (`ui/gating`): lo desactivado no se pinta. Pero
// ocultar un botón no impide ejecutar la función — basta un DOM viejo en
// pantalla, un enlace guardado, una llamada desde la consola o un fallo del
// propio gating. Y una función que se ejecuta cuando no debería no se queda
// callada: devuelve números, y el usuario no tiene forma de saber que no son de
// fiar. Pasó exactamente eso con el optimizador de amortizaciones.
//
// Así que las operaciones de las funcionalidades opcionales piden permiso aquí
// antes de calcular nada, y si no lo tienen **fallan**, en vez de responder.
//
// La consulta se instala en el arranque (`main.ts`). Mientras no haya ninguna
// instalada el guarda deja pasar todo: el dominio y el motor son puros y se
// prueban sin flags, y no queremos que importar `engine/optimizer` en un test
// arrastre medio arranque de la aplicación.

/** Se ha intentado ejecutar una funcionalidad que está desactivada. */
export class FeatureDeshabilitadaError extends Error {
  readonly featureId: string;

  constructor(featureId: string, accion: string) {
    super(`La funcionalidad "${featureId}" está desactivada; no se puede ${accion}. Actívala en ⚙ Funcionalidades.`);
    this.name = 'FeatureDeshabilitadaError';
    this.featureId = featureId;
  }
}

type Consulta = (featureId: string) => boolean;

let consulta: Consulta | null = null;

/**
 * Conecta el guarda con el servicio de flags. Devuelve la función para
 * desinstalarlo, que es lo que usan los tests para no filtrar estado entre
 * ficheros.
 */
export function instalarConsultaFlags(fn: Consulta): () => void {
  const previa = consulta;
  consulta = fn;
  return () => {
    consulta = previa;
  };
}

/** ¿Está activa? Sin consulta instalada se asume que sí (ver cabecera). */
export function featureActiva(featureId: string): boolean {
  return consulta ? consulta(featureId) : true;
}

/**
 * Corta la ejecución si la funcionalidad está desactivada.
 *
 * `accion` completa la frase "no se puede …", y sale en el mensaje que ve el
 * usuario: usa un infinitivo que describa lo que se iba a hacer ("calcular el
 * plan de amortización"), no el nombre interno de la función.
 */
export function exigirFeature(featureId: string, accion: string): void {
  if (!featureActiva(featureId)) throw new FeatureDeshabilitadaError(featureId, accion);
}
