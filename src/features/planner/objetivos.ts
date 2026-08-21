// ── features/planner/objetivos ────────────────────────────────────────────────
// Pestaña 2: lista de objetivos con su progreso, la cuota que están exigiendo
// ahora mismo y su semáforo de viabilidad (§5, pestaña 2).
//
// El reordenamiento por arrastre queda para la siguiente sesión; de momento la
// prioridad se ve y se entiende, que es lo que hace falta para leer la cascada.

import { formatEUR } from '@/core/money';
import { importeObjetivoEfectivo } from '@/planner/simulador';
import type { ModoAsignacion, Objetivo, Plan, ResultadoSimulacion } from '@/planner/tipos';
import { esc } from '../accounting/dom';

const eur = (centimos: number): string => formatEUR(centimos / 100);

const ETIQUETA_MODO: Record<ModoAsignacion, string> = {
  CUOTA_POR_FECHA: 'Cuota para llegar a la fecha',
  ABSORBE_TODO: 'Se lleva todo lo disponible',
  ABSORBE_RESIDUAL: 'Recibe lo que sobre',
  FIJO: 'Importe fijo al mes',
};

const EXPLICA_MODO: Record<ModoAsignacion, string> = {
  CUOTA_POR_FECHA: 'Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.',
  ABSORBE_TODO: 'Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.',
  ABSORBE_RESIDUAL: 'No reclama nada; recoge lo que quede tras servir a los de prioridad superior.',
  FIJO: 'Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene.',
};

const COLOR_ESTADO: Record<string, string> = {
  COMPLETADO: 'var(--accent)',
  EN_CURSO: 'var(--text)',
  PENDIENTE: 'var(--text3)',
  INVIABLE: 'var(--red)',
};

export function panelObjetivos(plan: Plan, res: ResultadoSimulacion): string {
  if (plan.objetivos.length === 0) {
    return `<div class="card" style="text-align:center;padding:34px 20px">
      <div style="font-size:26px;margin-bottom:10px">🎯</div>
      <div class="card-title" style="margin-bottom:6px">Todavía no hay objetivos</div>
      <div class="text-sm" style="color:var(--text2);max-width:52ch;margin:0 auto;line-height:1.7">
        Un objetivo es algo a lo que quieres llegar —amortizar el coche, la entrada de un piso, un colchón—
        con un importe y, si la tiene, una fecha. Compiten por el mismo dinero cada mes, y cuando uno se
        completa su cuota pasa sola al siguiente.
      </div>
    </div>`;
  }

  const ordenados = [...plan.objetivos].sort((a, b) => a.prioridad - b.prioridad);
  const primeraFila = res.serieMensual[0];
  const vehiculo = (id: string) => plan.vehiculos.find((v) => v._id === id);

  return `
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      El orden es la <strong>prioridad</strong>: el de arriba se sirve primero y los de abajo reciben lo que quede.
      La columna «pide ahora» es lo que cada objetivo está reclamando este mes.
    </div>
    ${ordenados.map((o) => tarjeta(o, res, primeraFila, vehiculo(o.vehiculoId)?.nombre)).join('')}`;
}

function tarjeta(
  o: Objetivo,
  res: ResultadoSimulacion,
  primeraFila: ResultadoSimulacion['serieMensual'][number] | undefined,
  nombreVehiculo: string | undefined,
): string {
  const objetivo = importeObjetivoEfectivo(o);
  const estado = res.estadoFinal[o._id] ?? o.estado;
  const asignacion = primeraFila?.asignaciones.find((a) => a.objetivoId === o._id);
  const pideAhora = asignacion?.solicitado ?? 0;
  const hito = res.hitos.find((h) => h.objetivoId === o._id);
  const progreso = objetivo > 0 ? Math.min(100, (o.saldoActual / objetivo) * 100) : 0;

  const avisos = res.avisos.filter((a) => a.objetivoId === o._id);

  return `
    <div class="card mb-10" style="padding:14px 16px;border-left:3px solid ${COLOR_ESTADO[estado] ?? 'var(--text3)'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${esc(o.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${esc(o.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${esc(ETIQUETA_MODO[o.modoAsignacion])}</span>
            ${estado === 'INVIABLE' ? '<span class="badge badge-red" style="font-size:10px">no llega</span>' : ''}
            ${estado === 'COMPLETADO' ? '<span class="badge badge-green" style="font-size:10px">completado</span>' : ''}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${esc(EXPLICA_MODO[o.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${esc(objetivo > 0 ? eur(objetivo) : '— sin meta —')}</div>
          ${o.fechaLimite ? `<div class="text-sm" style="color:var(--text3)">para ${esc(o.fechaLimite)}</div>` : ''}
        </div>
      </div>

      ${
        objetivo > 0
          ? `<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${progreso.toFixed(1)}%;background:${COLOR_ESTADO[estado] ?? 'var(--accent)'}"></div></div>`
          : ''
      }

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${esc(eur(pideAhora))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${esc(eur(o.saldoActual))}</span></div>
        ${nombreVehiculo ? `<div><span style="color:var(--text3)">Vehículo:</span> ${esc(nombreVehiculo)}</div>` : ''}
        ${hito ? `<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${esc(hito.mes)}</strong></div>` : ''}
      </div>

      ${
        avisos.length > 0
          ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${avisos.map((a) => `⚠ ${esc(a.mensaje)}`).join('<br>')}
             </div>`
          : ''
      }
      ${o.notas ? `<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${esc(o.notas)}</div>` : ''}
    </div>`;
}
