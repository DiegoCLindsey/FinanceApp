// ── engine/providers/withholdings ─────────────────────────────────────────────
// Retención IRPF proyectada como gasto mensual para ingresos manuales marcados
// `sujetoIRPF`. Paridad con FinanceMath.proyectarRetencionesFiscales; diferencia
// de diseño: recibe los tramos explícitos en lugar del objeto config.

import { retencionMensual, TRAMOS_IRPF_DEFAULT, type Tramos } from '@/core/tax/irpf';
import { proyectarGastos, type ExpenseLike } from './expenses';
import type { AccountFilter, CashEvent, DateRange } from '../types';

export interface WithholdingExpense extends ExpenseLike {
  sujetoIRPF?: boolean;
}

export function proyectarRetencionesFiscales(
  expenses: WithholdingExpense[],
  tramos: Tramos | null | undefined,
  range: DateRange,
  filtroAccounts: AccountFilter = null,
): CashEvent[] {
  const events: CashEvent[] = [];
  const t = tramos || TRAMOS_IRPF_DEFAULT;
  for (const exp of expenses) {
    if (!exp.activo || exp.tipo !== 'ingreso' || !exp.sujetoIRPF) continue;
    const salarioAnual = exp.cuantia * (exp.tipoFrecuencia === 'mensual' ? 12 : 1);
    const ret = retencionMensual(salarioAnual, t);
    const mockGastoFiscal: ExpenseLike = {
      ...exp,
      _id: exp._id + '_irpf',
      concepto: `IRPF salario ${exp.concepto}`,
      tipo: 'gasto',
      cuantia: ret,
      tags: ['irpf', 'fiscal'],
    };
    events.push(...proyectarGastos([mockGastoFiscal], range, filtroAccounts));
  }
  return events;
}
