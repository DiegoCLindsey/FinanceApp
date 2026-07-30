// ── engine/providers/transfers ────────────────────────────────────────────────
// Transferencias entre cuentas: par gasto/ingreso, detección de traspasos entre
// fondos (sin tributación) y fiscalidad de reembolsos (retención 19 % sobre
// plusvalía proporcional) y rescates de pensión (tipo marginal del grupo).
// Paridad exacta con FinanceMath.proyectarTransferencias. Diferencia de diseño:
// las cuentas, nóminas y resolvers de tramos se inyectan (el legacy lee State).

import { formatLocalDate, parseLocalDate, resolverDiaEfectivo, type ISODate } from '@/core/dates';
import { modeloFondoDe, type AccountLike } from '@/core/accounts';
import { calcFondoInversion, calcImpuestoPension, calcTipoMarginalPension, type NominaLike } from '@/core/tax/pension';
import { TRAMOS_IRPF_DEFAULT, type Tramos } from '@/core/tax/irpf';
import { TRAMOS_AHORRO_DEFAULT } from '@/core/tax/ahorro';
import type { ExpenseLike } from './expenses';
import type { AccountFilter, CashEvent, DateRange } from '../types';

export interface TransferExpense extends ExpenseLike {
  cuentaDestino?: string;
}

export interface NamedAccount extends AccountLike {
  _id: string;
  nombre: string;
  impuestoRetirada?: number;
  grupoNomina?: string;
}

export interface TransferDeps {
  accounts: NamedAccount[];
  nominas?: NominaLike[];
  resolverTramosIRPF?: (año: number) => Tramos;
  resolverTramosGanancias?: (año: number) => Tramos;
}

export function proyectarTransferencias(
  expenses: TransferExpense[],
  range: DateRange,
  filtroAccounts: AccountFilter = null,
  deps: TransferDeps = { accounts: [] },
): CashEvent[] {
  const events: CashEvent[] = [];
  const dS = parseLocalDate(range.start);
  const dE = parseLocalDate(range.end);
  const allAccounts = deps.accounts || [];
  const nominas = deps.nominas || [];
  const tramosIRPF = deps.resolverTramosIRPF || (() => TRAMOS_IRPF_DEFAULT);
  const tramosGan = deps.resolverTramosGanancias || (() => TRAMOS_AHORRO_DEFAULT);
  const accountName = (id: string) => allAccounts.find((a) => a._id === id)?.nombre ?? id;

  for (const exp of expenses) {
    if (!exp.activo || exp.tipo !== 'transferencia') continue;
    if (filtroAccounts && filtroAccounts.length > 0) {
      const involucra = filtroAccounts.includes(exp.cuenta || 'default') || filtroAccounts.includes(exp.cuentaDestino || 'default');
      if (!involucra) continue;
    }
    const dI = parseLocalDate(exp.fechaInicio || range.start);
    const dF = exp.fechaFin ? parseLocalDate(exp.fechaFin) : dE;
    const pushPair = (fecha: ISODate) => {
      const cuentaOrigen = allAccounts.find((a) => a._id === (exp.cuenta || 'default'));
      const cuentaDest = allAccounts.find((a) => a._id === (exp.cuentaDestino || 'default'));
      const originModel = modeloFondoDe(cuentaOrigen);
      const destModel = modeloFondoDe(cuentaDest);

      const esTraspaso =
        (originModel === 'inversion' && destModel === 'inversion') || (originModel === 'pension' && destModel === 'pension');
      const tagsBase = ['transferencia', ...(esTraspaso ? ['traspaso'] : []), ...(exp.tags || [])];
      const srcOut = esTraspaso ? 'traspaso-out' : 'transfer-out';
      const srcIn = esTraspaso ? 'traspaso-in' : 'transfer-in';

      const addOrigen = !filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(exp.cuenta || 'default');
      const addDestino = !filtroAccounts || filtroAccounts.length === 0 || filtroAccounts.includes(exp.cuentaDestino || 'default');

      if (addOrigen)
        events.push({
          fecha,
          concepto: `Transf. → ${accountName(exp.cuentaDestino || 'default')}: ${exp.concepto}`,
          cuantia: exp.cuantia,
          tipo: 'gasto',
          tags: tagsBase,
          cuenta: exp.cuenta || 'default',
          sourceId: exp._id,
          sourceType: srcOut,
        });
      if (addDestino)
        events.push({
          fecha,
          concepto: `Transf. ← ${accountName(exp.cuenta || 'default')}: ${exp.concepto}`,
          cuantia: exp.cuantia,
          tipo: 'ingreso',
          tags: tagsBase,
          cuenta: exp.cuentaDestino || 'default',
          sourceId: exp._id,
          sourceType: srcIn,
        });

      if (addOrigen && !esTraspaso && cuentaOrigen) {
        if (originModel === 'inversion') {
          // REEMBOLSO: retención 19 % sobre la plusvalía proporcional retirada
          const añoFecha = parseInt(fecha.slice(0, 4));
          const inv = calcFondoInversion(cuentaOrigen, tramosGan(añoFecha));
          if (inv && inv.saldo > 0 && inv.plusvalia > 0) {
            const proporcion = Math.min(1, exp.cuantia / inv.saldo);
            const plusvProp = inv.plusvalia * proporcion;
            const retencion = plusvProp * 0.19; // Art. 101 LIRPF
            if (retencion > 0.01) {
              events.push({
                fecha,
                concepto: `Retención IRPF reembolso ${cuentaOrigen.nombre} (19% s/plusvalía)`,
                cuantia: retencion,
                tipo: 'gasto',
                tags: ['impuesto', 'capital-mobiliario', 'retencion'],
                cuenta: exp.cuenta || 'default',
                sourceId: exp._id,
                sourceType: 'investment-tax',
              });
            }
          }
        } else if (originModel === 'pension') {
          // RESCATE: rendimiento del trabajo; tipo marginal real del grupo si existe
          const tramos_ = tramosIRPF(parseInt(fecha.slice(0, 4)));
          const tipoEf = calcTipoMarginalPension(cuentaOrigen, nominas, tramos_);
          const impuesto = calcImpuestoPension(cuentaOrigen, exp.cuantia, tipoEf || undefined);
          if (impuesto > 0) {
            const label = cuentaOrigen.grupoNomina
              ? `IRPF rescate ${cuentaOrigen.nombre} (tipo marginal grupo "${cuentaOrigen.grupoNomina}": ${tipoEf}%)`
              : `Retención rescate ${cuentaOrigen.nombre} (${cuentaOrigen.impuestoRetirada}% s/beneficio)`;
            events.push({
              fecha,
              concepto: label,
              cuantia: impuesto,
              tipo: 'gasto',
              tags: ['impuesto', 'rendimientos-trabajo', 'pension'],
              cuenta: exp.cuenta || 'default',
              sourceId: exp._id,
              sourceType: 'pension-tax',
            });
          }
        }
      }
    };
    if (exp.tipoFrecuencia === 'extraordinario') {
      if (dI >= dS && dI <= dE && dI <= dF) pushPair(exp.fechaInicio!);
    } else if (exp.tipoFrecuencia === 'mensual') {
      const freq = Math.max(1, exp.frecuencia || 1);
      let year = dI.getFullYear();
      let month = dI.getMonth();
      const maxIter = Math.ceil(240 / freq) + 2;
      for (let i = 0; i < maxIter; i++) {
        const fe =
          resolverDiaEfectivo(year, month, exp.diaPago || '') ||
          (() => {
            const d = dI.getDate();
            const l = new Date(year, month + 1, 0).getDate();
            return formatLocalDate(new Date(year, month, Math.min(d, l)));
          })();
        const dE2 = parseLocalDate(fe);
        if (dE2 > dE || dE2 > dF) break;
        if (dE2 >= dS && dE2 >= dI) pushPair(fe);
        month += freq;
        if (month >= 12) {
          year += Math.floor(month / 12);
          month = month % 12;
        }
      }
    } else if (exp.tipoFrecuencia === 'diaria') {
      const stepMs = Math.max(1, exp.frecuencia || 1) * 86400000;
      let d = new Date(Math.max(dI.getTime(), dS.getTime()));
      if (dI < dS) {
        const st = Math.ceil((dS.getTime() - dI.getTime()) / stepMs);
        d = new Date(dI.getTime() + st * stepMs);
      }
      while (d <= dE && d <= dF) {
        pushPair(formatLocalDate(d));
        d = new Date(d.getTime() + stepMs);
      }
    }
  }
  return events;
}
