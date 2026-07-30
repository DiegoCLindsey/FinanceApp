// ── features/inflation/ipc-source ─────────────────────────────────────────────
// Descarga del IPC histórico de España desde el Banco Mundial
// (indicador FP.CPI.TOTL.ZG: "Inflation, consumer prices, annual %").
// Sin API key y con CORS abierto. Se aísla en su propio módulo para poder
// testear el parseo sin red, inyectando el `fetch`.

export interface TasaAnual {
  year: number;
  tasa: number;
}

const WB_URL = 'https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65';

/** Respuesta del Banco Mundial: [paginación, datos], más reciente primero. */
type RespuestaWB = [unknown, { date: string; value: number | null }[] | null];

/** Normaliza la respuesta: descarta huecos, redondea a 2 decimales y ordena. */
export function parsearRespuestaWB(json: unknown): TasaAnual[] {
  const datos = Array.isArray(json) ? ((json as RespuestaWB)[1] ?? []) : [];
  if (!Array.isArray(datos)) return [];
  return datos
    .filter((d) => d && d.value !== null && d.value !== undefined && Number.isFinite(Number(d.value)))
    .map((d) => ({ year: parseInt(d.date), tasa: parseFloat(Number(d.value).toFixed(2)) }))
    .filter((d) => Number.isFinite(d.year))
    .sort((a, b) => a.year - b.year);
}

export interface IpcSourceDeps {
  fetchImpl?: typeof fetch;
  url?: string;
}

/**
 * Fuente de IPC con caché en memoria durante la sesión. Devuelve `null` si la
 * descarga falla, para que la UI pueda avisar sin romperse.
 */
export function createIpcSource({ fetchImpl, url = WB_URL }: IpcSourceDeps = {}) {
  let cache: TasaAnual[] | null = null;
  let cargando = false;

  async function obtener(forzarRecarga = false): Promise<TasaAnual[] | null> {
    if (cache && !forzarRecarga) return cache;
    if (cargando) return null; // ya hay una petición en vuelo
    cargando = true;
    try {
      const f = fetchImpl ?? fetch;
      const res = await f(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      cache = parsearRespuestaWB(await res.json());
      return cache;
    } catch (err) {
      console.error('[inflacion] No se pudo cargar el IPC del Banco Mundial:', err);
      return null;
    } finally {
      cargando = false;
    }
  }

  return {
    obtener,
    invalidar: () => {
      cache = null;
    },
    get enCache() {
      return cache;
    },
  };
}

export type IpcSource = ReturnType<typeof createIpcSource>;
