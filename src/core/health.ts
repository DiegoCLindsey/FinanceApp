// ── core/health ───────────────────────────────────────────────────────────────
// Salud financiera: tasa de ahorro, DTI y regla 50/30/20 con semáforos.
// Paridad exacta con FinanceMath.calcSaludFinanciera.

export type Semaforo = 'verde' | 'amarillo' | 'rojo' | 'neutral';

export interface MetricasSalud {
  ingresos?: number;
  cuotas?: number;
  cuotasHipoteca?: number;
  gastosBasicos?: number;
  gastosOtros?: number;
  amortizaciones?: number;
}

export interface ConfigSalud {
  saludUmbralAhorroVerde?: number;
  saludUmbralAhorroAmarillo?: number;
  saludUmbralDTIVerde?: number;
  saludUmbralDTIAmarillo?: number;
  saludRegla?: [number, number, number] | number[];
  saludExcluirHipoteca?: boolean;
}

export interface SaludFinanciera {
  ingresos: number;
  cuotas: number;
  cuotasHipoteca: number;
  gastosBasicos: number;
  gastosOtros: number;
  amortizaciones: number;
  ahorroBruto: number;
  ahorroReal: number;
  tasaAhorro: number | null;
  dti: number | null;
  dtiTotal: number | null;
  excluyeHipoteca: boolean;
  pctNecesidades: number | null;
  pctDeseos: number | null;
  semAhorro: Semaforo;
  semDTI: Semaforo;
  semNecesidades: Semaforo;
  semDeseos: Semaforo;
  semAhorroRegla: Semaforo;
  umbralAhorroVerde: number;
  umbralAhorroAmarillo: number;
  umbralDTIVerde: number;
  umbralDTIAmarillo: number;
  regla: number[];
}

export function calcSaludFinanciera(met: MetricasSalud, config: ConfigSalud): SaludFinanciera {
  const uAV = config.saludUmbralAhorroVerde ?? 20;
  const uAA = config.saludUmbralAhorroAmarillo ?? 10;
  const uDV = config.saludUmbralDTIVerde ?? 30;
  const uDA = config.saludUmbralDTIAmarillo ?? 40;
  const regla = config.saludRegla || [50, 30, 20];
  const exclHip = config.saludExcluirHipoteca || false;

  const { ingresos = 0, cuotas = 0, cuotasHipoteca = 0, gastosBasicos = 0, gastosOtros = 0, amortizaciones = 0 } = met;

  const ahorroBruto = ingresos - cuotas - amortizaciones - gastosBasicos - gastosOtros;
  const ahorroReal = ahorroBruto;
  const tasaAhorro = ingresos > 0 ? (ahorroReal / ingresos) * 100 : null;

  const cuotasDTI = exclHip ? cuotas - cuotasHipoteca : cuotas;
  const dti = ingresos > 0 ? (cuotasDTI / ingresos) * 100 : null;
  const dtiTotal = ingresos > 0 ? (cuotas / ingresos) * 100 : null;

  const pctNecesidades = ingresos > 0 ? ((gastosBasicos + cuotas + amortizaciones) / ingresos) * 100 : null;
  const pctDeseos = ingresos > 0 ? (gastosOtros / ingresos) * 100 : null;

  const semHigh = (v: number | null, verde: number, rojo: number): Semaforo => {
    if (v === null) return 'neutral';
    if (v >= verde) return 'verde';
    if (v >= rojo) return 'amarillo';
    return 'rojo';
  };
  const semLow = (v: number | null, verde: number, rojo: number): Semaforo => {
    if (v === null) return 'neutral';
    if (v <= verde) return 'verde';
    if (v <= rojo) return 'amarillo';
    return 'rojo';
  };

  return {
    ingresos, cuotas, cuotasHipoteca, gastosBasicos, gastosOtros, amortizaciones,
    ahorroBruto, ahorroReal, tasaAhorro,
    dti, dtiTotal, excluyeHipoteca: exclHip,
    pctNecesidades, pctDeseos,
    semAhorro: semHigh(tasaAhorro, uAV, uAA),
    semDTI: semLow(dti, uDV, uDA),
    semNecesidades: semLow(pctNecesidades, regla[0], regla[0] + 15),
    semDeseos: semLow(pctDeseos, regla[1], regla[1] + 10),
    semAhorroRegla: semHigh(tasaAhorro, regla[2], regla[2] * 0.5),
    umbralAhorroVerde: uAV, umbralAhorroAmarillo: uAA,
    umbralDTIVerde: uDV, umbralDTIAmarillo: uDA,
    regla,
  };
}
