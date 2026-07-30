// ── engine/providers/salaries ─────────────────────────────────────────────────
// Proyección de nóminas: pagas (≤12 espaciadas; >12 con extras jun/dic/mar/sep),
// IRPF por tramos del ejercicio con apilamiento marginal por grupo, retribución
// flexible (art. 42) y actualización por IPC.
// Paridad exacta con FinanceMath.proyectarNominas. Diferencia de diseño: los
// tramos por ejercicio se resuelven vía `resolverTramos` inyectado (el legacy
// lee el State global; sin State usa los defaults, contra los que se verifica).

import { formatLocalDate, parseLocalDate, type ISODate } from '@/core/dates';
import { calcFactorInflacion, type PeriodoInflacion } from '@/core/inflation';
import { calcBaseImponibleTrabajo, calcIRPF, TRAMOS_IRPF_DEFAULT, type Tramos } from '@/core/tax/irpf';
import type { AccountFilter, CashEvent, DateRange } from '../types';

export interface ComponenteFlexible {
  _id?: string;
  tipo: 'transporte' | 'restaurante' | 'otros' | string;
  importe: number;
  cuenta?: string;
}

export interface NominaItem {
  _id: string;
  nombre: string;
  bruto?: number;
  nPagas?: number;
  irpfModo?: 'auto' | 'manual' | string;
  irpfPct?: number;
  representacion?: 'detallado' | 'simplificado' | string;
  fechaInicio?: ISODate;
  fechaFin?: ISODate | null;
  cuenta?: string;
  activo?: boolean;
  tags?: string[];
  grupoNomina?: string;
  mesActualizacionIPC?: number | null;
  ssPct?: number;
  retribucionFlexible?: ComponenteFlexible[];
}

export type TramosResolver = (año: number) => Tramos;

// Meses de paga extra para nPagas > 12: junio, diciembre, marzo, septiembre
const EXTRA_PAGA_MONTHS = [5, 11, 2, 8];

const FLEX_TIPO_LABEL: Record<string, string> = { transporte: 'Transporte', restaurante: 'Restaurante', otros: 'Beneficio' };

export function proyectarNominas(
  nominas: NominaItem[],
  range: DateRange,
  filtroAccounts: AccountFilter = null,
  inflacionPeriodos: PeriodoInflacion[] = [],
  resolverTramos: TramosResolver = () => TRAMOS_IRPF_DEFAULT,
): CashEvent[] {
  const events: CashEvent[] = [];
  const dS = parseLocalDate(range.start);
  const dE = parseLocalDate(range.end);
  const usarIPC = inflacionPeriodos.length > 0;

  // Agrupación por grupoNomina para el apilamiento marginal del IRPF.
  const grupos: Record<string, NominaItem[]> = {};
  for (const nom of nominas) {
    const g = nom.grupoNomina || '';
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(nom);
  }
  for (const g of Object.keys(grupos)) {
    grupos[g].sort((a, b) => (b.bruto || 0) - (a.bruto || 0));
  }

  // Bruto anual ajustado por IPC en la fecha de pago dada.
  function brutoAjustado(nom: NominaItem, fechaStr: ISODate): number {
    if (!usarIPC || !nom.mesActualizacionIPC) return nom.bruto || 0;
    const startStr = nom.fechaInicio || range.start;
    const startD = parseLocalDate(startStr);
    const payD = parseLocalDate(fechaStr);
    let nUpdates = 0;
    for (let y = startD.getFullYear(); y <= payD.getFullYear(); y++) {
      const ud = new Date(y, nom.mesActualizacionIPC - 1, 1);
      if (ud > startD && ud <= payD) nUpdates++;
    }
    if (nUpdates === 0) return nom.bruto || 0;
    const toDate = formatLocalDate(new Date(startD.getFullYear() + nUpdates, 0, 1));
    return (nom.bruto || 0) * calcFactorInflacion(inflacionPeriodos, startStr, toDate);
  }

  // IRPF anual en la fecha de pago, con reparto proporcional dentro del grupo.
  function irpfAnualNomina(nom: NominaItem, fechaStr: ISODate): number {
    const bruto = brutoAjustado(nom, fechaStr);
    const flexAnual = (nom.retribucionFlexible || []).reduce((s, c) => s + (c.importe || 0) * 12, 0);
    const baseIRPF = Math.max(0, bruto - flexAnual);
    if (nom.irpfModo === 'manual') return baseIRPF * ((nom.irpfPct || 0) / 100);
    const tramosYear = resolverTramos(parseInt(fechaStr.slice(0, 4)));
    const g = nom.grupoNomina || '';
    if (!g) return calcIRPF(calcBaseImponibleTrabajo(bruto, flexAnual), tramosYear);
    const groupNoms = grupos[g].filter((n) => n.activo);
    const totalBruto = groupNoms.reduce((s, n) => s + brutoAjustado(n, fechaStr), 0);
    const totalFlex = groupNoms.reduce((s, n) => s + (n.retribucionFlexible || []).reduce((ss, c) => ss + (c.importe || 0) * 12, 0), 0);
    const totalBaseIRPF = Math.max(0, totalBruto - totalFlex);
    const groupImponible = calcBaseImponibleTrabajo(totalBruto, totalFlex);
    const nomBase = Math.max(0, bruto - flexAnual);
    const nomImponible = totalBaseIRPF > 0 ? groupImponible * (nomBase / totalBaseIRPF) : 0;
    const imponibleAcum = groupNoms
      .filter((n) => n._id !== nom._id && (n.bruto || 0) > (nom.bruto || 0))
      .reduce((s, n) => {
        const nFlex = (n.retribucionFlexible || []).reduce((ss, c) => ss + (c.importe || 0) * 12, 0);
        const nBase = Math.max(0, brutoAjustado(n, fechaStr) - nFlex);
        return s + (totalBaseIRPF > 0 ? groupImponible * (nBase / totalBaseIRPF) : 0);
      }, 0);
    return calcIRPF(imponibleAcum + nomImponible, tramosYear) - calcIRPF(imponibleAcum, tramosYear);
  }

  for (const nom of nominas) {
    if (!nom.activo) continue;
    const cuenta = nom.cuenta || 'default';
    if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(cuenta)) continue;

    const nPagas = Math.max(1, nom.nPagas || 12);
    const dI = parseLocalDate(nom.fechaInicio || range.start);
    const dF = nom.fechaFin ? parseLocalDate(nom.fechaFin) : dE;

    const pushPago = (fecha: ISODate) => {
      const bruto = brutoAjustado(nom, fecha);
      const irpf = irpfAnualNomina(nom, fecha);
      const flexAnual = (nom.retribucionFlexible || []).reduce((s, c) => s + (c.importe || 0) * 12, 0);
      const brutoCash = Math.max(0, bruto - flexAnual);
      const ssPct = (nom.ssPct ?? 6.35) / 100;
      const ssAnual = brutoCash * ssPct;
      const brutoCashPorPaga = brutoCash / nPagas;
      const irpfPorPaga = irpf / nPagas;
      const ssPorPaga = ssAnual / nPagas;
      const ingresoPorPaga = nom.representacion === 'simplificado' ? brutoCashPorPaga - ssPorPaga - irpfPorPaga : brutoCashPorPaga;
      events.push({
        fecha,
        concepto: nom.nombre,
        cuantia: ingresoPorPaga,
        tipo: 'ingreso',
        cuenta,
        tags: nom.tags || [],
        sourceId: nom._id,
        sourceType: 'nomina',
      });
      if (nom.representacion === 'detallado') {
        if (ssPorPaga > 0)
          events.push({
            fecha,
            concepto: `SS ${nom.nombre}`,
            cuantia: ssPorPaga,
            tipo: 'gasto',
            cuenta,
            tags: ['seguridad-social', 'fiscal'],
            sourceId: nom._id + '_ss',
            sourceType: 'nomina',
          });
        if (irpfPorPaga > 0)
          events.push({
            fecha,
            concepto: `IRPF ${nom.nombre}`,
            cuantia: irpfPorPaga,
            tipo: 'gasto',
            cuenta,
            tags: ['irpf', 'fiscal'],
            sourceId: nom._id + '_irpf',
            sourceType: 'nomina',
          });
      }
      for (const comp of nom.retribucionFlexible || []) {
        if (!comp.cuenta || !(comp.importe > 0)) continue;
        if (filtroAccounts && filtroAccounts.length > 0 && !filtroAccounts.includes(comp.cuenta)) continue;
        events.push({
          fecha,
          concepto: `${nom.nombre} — ${FLEX_TIPO_LABEL[comp.tipo] || comp.tipo}`,
          cuantia: comp.importe,
          tipo: 'ingreso',
          cuenta: comp.cuenta,
          tags: ['retribucion-flexible', comp.tipo],
          sourceId: `${nom._id}_flex_${comp._id || comp.tipo}`,
          sourceType: 'nomina',
        });
      }
    };

    if (nPagas <= 12) {
      const step = nPagas === 12 ? 1 : Math.round(12 / nPagas);
      const dayOfMonth = dI.getDate();
      let year = dI.getFullYear();
      let month = dI.getMonth();
      for (let iter = 0; iter < 300; iter++) {
        const lastDay = new Date(year, month + 1, 0).getDate();
        const d = new Date(year, month, Math.min(dayOfMonth, lastDay));
        if (d > dE || d > dF) break;
        if (d >= dS && d >= dI) pushPago(formatLocalDate(d));
        month += step;
        if (month >= 12) {
          year += Math.floor(month / 12);
          month = month % 12;
        }
      }
    } else {
      const nExtra = nPagas - 12;
      const dayOfMonth = dI.getDate();
      let year = dI.getFullYear();
      let month = dI.getMonth();
      for (let iter = 0; iter < 300; iter++) {
        const lastDay = new Date(year, month + 1, 0).getDate();
        const d = new Date(year, month, Math.min(dayOfMonth, lastDay));
        if (d > dE || d > dF) break;
        if (d >= dS && d >= dI) pushPago(formatLocalDate(d));
        month++;
        if (month >= 12) {
          year++;
          month = 0;
        }
      }
      const yStart = Math.max(dI.getFullYear(), dS.getFullYear());
      const yEnd = Math.min((nom.fechaFin ? dF : dE).getFullYear(), dE.getFullYear());
      for (let y = yStart; y <= yEnd; y++) {
        for (const em of EXTRA_PAGA_MONTHS.slice(0, nExtra)) {
          const d = new Date(y, em, 15);
          if (d >= dS && d <= dE && d >= dI && d <= dF) pushPago(formatLocalDate(d));
        }
      }
    }
  }
  return events;
}
