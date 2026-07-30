// ── flags/registry ────────────────────────────────────────────────────────────
// Catálogo de funcionalidades activables por el usuario (F2, tarea 2.1).
// Cada feature se declara UNA vez aquí; el gating (sidebar, router, tarjetas del
// dashboard, providers del motor) consulta el registro en lugar de repartir
// condicionales por el código.
//
// Reglas al añadir una feature:
//   · `id` estable y en kebab-case: se persiste en config.features del usuario.
//   · `dependencias`: ids sin los que la feature no tiene sentido. Al desactivar
//     una feature se desactivan en cascada las que dependen de ella.
//   · `porDefecto`: qué ve un usuario nuevo. Lo de nicho arranca apagado.
//   · `nucleo: true` para lo que no se puede desactivar (el dashboard mínimo).

export interface FeatureDefinition {
  id: string;
  nombre: string;
  descripcion: string;
  grupo: string;
  porDefecto: boolean;
  dependencias?: string[];
  nucleo?: boolean;
}

export const GRUPOS = {
  nucleo: 'Esenciales',
  dinero: 'Mi dinero',
  planificacion: 'Planificación',
  analisis: 'Análisis del dashboard',
  datos: 'Datos y sincronización',
} as const;

export const FEATURES: FeatureDefinition[] = [
  // ── Esenciales ──────────────────────────────────────────────────────────────
  {
    id: 'dashboard',
    nombre: 'Dashboard',
    descripcion: 'Saldo actual, extracto proyectado y evolución. No se puede desactivar.',
    grupo: GRUPOS.nucleo,
    porDefecto: true,
    nucleo: true,
  },

  // ── Mi dinero ───────────────────────────────────────────────────────────────
  {
    id: 'expenses',
    nombre: 'Gastos e ingresos',
    descripcion: 'Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.',
    grupo: GRUPOS.dinero,
    porDefecto: true,
  },
  {
    id: 'loans',
    nombre: 'Préstamos',
    descripcion: 'Tablas de amortización, TAE y amortizaciones anticipadas.',
    grupo: GRUPOS.dinero,
    porDefecto: true,
  },
  {
    id: 'nominas',
    nombre: 'Nóminas',
    descripcion: 'Salarios con IRPF por tramos, pagas extra y retribución flexible.',
    grupo: GRUPOS.dinero,
    porDefecto: true,
  },
  {
    id: 'accounts',
    nombre: 'Cuentas y ahorro',
    descripcion: 'Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.',
    grupo: GRUPOS.dinero,
    porDefecto: true,
  },
  {
    id: 'goals',
    nombre: 'Objetivos de ahorro',
    descripcion: 'Metas con importe y fecha, con proyección de cumplimiento.',
    grupo: GRUPOS.dinero,
    porDefecto: true,
    dependencias: ['accounts'],
  },
  {
    id: 'contabilidad',
    nombre: 'Contabilidad real',
    descripcion: 'Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.',
    grupo: GRUPOS.dinero,
    porDefecto: true,
    dependencias: ['accounts'],
  },

  // ── Planificación ───────────────────────────────────────────────────────────
  {
    id: 'supuestos',
    nombre: 'Supuestos',
    descripcion: 'Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.',
    grupo: GRUPOS.planificacion,
    porDefecto: true,
  },
  {
    id: 'inflacion',
    nombre: 'Inflación',
    descripcion: 'Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.',
    grupo: GRUPOS.planificacion,
    porDefecto: false,
  },
  {
    id: 'fiscalidad',
    nombre: 'Fiscalidad',
    descripcion: 'Simulador de la declaración de la renta y tablas de tramos por ejercicio.',
    grupo: GRUPOS.planificacion,
    porDefecto: false,
  },
  {
    id: 'margenes',
    nombre: 'Márgenes de seguridad',
    descripcion: 'Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.',
    grupo: GRUPOS.planificacion,
    porDefecto: false,
  },
  {
    id: 'optimizador',
    nombre: 'Optimizador de amortizaciones',
    descripcion: 'Planifica amortizaciones anticipadas con el excedente disponible cada mes.',
    grupo: GRUPOS.planificacion,
    porDefecto: false,
    dependencias: ['loans'],
  },
  {
    id: 'comparador-frecuencias',
    nombre: 'Comparador de frecuencias',
    descripcion: 'Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.',
    grupo: GRUPOS.planificacion,
    porDefecto: false,
    dependencias: ['optimizador'],
  },

  // ── Análisis del dashboard ──────────────────────────────────────────────────
  {
    id: 'salud-financiera',
    nombre: 'Salud financiera',
    descripcion: 'Tasa de ahorro, ratio de endeudamiento y regla 50/30/20 con semáforos.',
    grupo: GRUPOS.analisis,
    porDefecto: true,
  },
  {
    id: 'resumen-ejecutivo',
    nombre: 'Resumen ejecutivo',
    descripcion: 'Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.',
    grupo: GRUPOS.analisis,
    porDefecto: true,
  },
  {
    id: 'graficos-etiquetas',
    nombre: 'Gráficos por etiqueta',
    descripcion: 'Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.',
    grupo: GRUPOS.analisis,
    porDefecto: true,
  },
  {
    id: 'flujo-mensual',
    nombre: 'Flujo de caja mensual',
    descripcion: 'Entradas y salidas mes a mes del periodo analizado.',
    grupo: GRUPOS.analisis,
    porDefecto: true,
  },
  {
    id: 'puntos-criticos',
    nombre: 'Puntos críticos',
    descripcion: 'Avisos de saldo negativo o por debajo del colchón en la proyección.',
    grupo: GRUPOS.analisis,
    porDefecto: true,
  },
  {
    id: 'desviacion',
    nombre: 'Desviación real vs estimado',
    descripcion: 'Compara el saldo real registrado con el proyectado en cada fecha.',
    grupo: GRUPOS.analisis,
    porDefecto: true,
    dependencias: ['contabilidad'],
  },
  {
    id: 'precision-estimaciones',
    nombre: 'Precisión de estimaciones',
    descripcion: 'Acierto de cada estimación frente al gasto real, con ajuste sugerido.',
    grupo: GRUPOS.analisis,
    porDefecto: true,
    dependencias: ['contabilidad', 'expenses'],
  },

  // ── Datos ───────────────────────────────────────────────────────────────────
  {
    id: 'sync-nube',
    nombre: 'Sincronización en la nube',
    descripcion: 'Copia cifrada en Firebase o Dropbox, además del almacenamiento local.',
    grupo: GRUPOS.datos,
    porDefecto: true,
  },
  {
    id: 'autoguardado',
    nombre: 'Autoguardado',
    descripcion: 'Sube una copia a la nube cada cierto intervalo automáticamente.',
    grupo: GRUPOS.datos,
    porDefecto: false,
    dependencias: ['sync-nube'],
  },
];

const BY_ID = new Map(FEATURES.map((f) => [f.id, f]));

export function getFeature(id: string): FeatureDefinition | undefined {
  return BY_ID.get(id);
}

export function featureIds(): string[] {
  return FEATURES.map((f) => f.id);
}

/** Features que declaran `id` entre sus dependencias (para la cascada de apagado). */
export function dependientesDe(id: string): FeatureDefinition[] {
  return FEATURES.filter((f) => (f.dependencias || []).includes(id));
}

/** Valores por defecto del catálogo. */
export function defaultFlags(): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const f of FEATURES) out[f.id] = f.porDefecto;
  return out;
}

/** Agrupación para la ventana de configuración, en el orden declarado. */
export function featuresPorGrupo(): { grupo: string; features: FeatureDefinition[] }[] {
  const orden: string[] = [];
  const mapa = new Map<string, FeatureDefinition[]>();
  for (const f of FEATURES) {
    if (!mapa.has(f.grupo)) {
      mapa.set(f.grupo, []);
      orden.push(f.grupo);
    }
    (mapa.get(f.grupo) as FeatureDefinition[]).push(f);
  }
  return orden.map((grupo) => ({ grupo, features: mapa.get(grupo) as FeatureDefinition[] }));
}
