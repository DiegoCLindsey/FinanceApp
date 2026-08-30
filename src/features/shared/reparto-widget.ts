// ── features/shared/reparto-widget ──────────────────────────────────────────
// Widget de reparto entre personas, para Gastos, Nóminas y Préstamos. Un mismo
// elemento (gasto, nómina, cuota) puede llevar DOS repartos independientes —
// consumo y pago—, así que `prefijo` los distingue dentro del mismo formulario
// (mismo patrón que `shared/dia-pago.ts`: HTML + sincronizar + leer, por
// contenedor, no por id global, para que puedan convivir varios).
//
// Sin al menos dos personas ACTIVAS no hay nada que repartir — el widget
// entero se omite (`repartoWidget` devuelve `''`) en vez de enseñar un
// selector que no puede hacer nada útil.

import type { ModoReparto, Persona, Reparto } from '@/state/schema';
import { esc } from '../accounting/dom';

const ETIQUETAS_MODO: Record<ModoReparto, string> = {
  partesIguales: 'partes iguales',
  porcentaje: '%',
  importe: '€ exactos',
};

function personasSeleccionables(personas: Persona[], reparto: Reparto | undefined): Persona[] {
  const enElReparto = new Set((reparto?.participantes ?? []).map((p) => p.personaId));
  // Activas, más cualquiera que ya estuviera en el reparto aunque se haya
  // desactivado después — si no, editar un elemento antiguo la haría
  // desaparecer del formulario sin que nadie la haya quitado a propósito.
  return personas.filter((p) => p.activo || enElReparto.has(p._id));
}

/**
 * HTML del selector de reparto. `''` si no hay al menos dos personas activas
 * (con una sola, todo es suyo por definición y no hay nada que elegir).
 */
export function repartoWidget(titulo: string, reparto: Reparto | undefined, personas: Persona[], prefijo: string): string {
  if (personas.filter((p) => p.activo).length < 2) return '';

  const modo = reparto?.modo ?? '';
  const valores = new Map((reparto?.participantes ?? []).map((p) => [p.personaId, p.valor]));
  const mostrarValor = modo === 'porcentaje' || modo === 'importe';

  const filaPersona = (p: Persona): string => {
    const marcado = valores.has(p._id);
    const valor = valores.get(p._id);
    return `<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${esc(prefijo)}" value="${esc(p._id)}"${marcado ? ' checked' : ''}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${esc(prefijo)}" data-persona="${esc(p._id)}"
             value="${valor ?? ''}" step="0.01" min="0" placeholder="${modo === 'porcentaje' ? '%' : '€'}"
             style="width:64px;padding:4px 6px;${mostrarValor ? '' : 'display:none'}"/>
    </label>`;
  };

  return `<div class="form-group mt-8" data-reparto="${esc(prefijo)}">
    <label class="form-label">${esc(titulo)}</label>
    <select class="form-select" data-reparto-modo="${esc(prefijo)}">
      <option value=""${!modo ? ' selected' : ''}>Sin reparto (100% persona por defecto)</option>
      <option value="partesIguales"${modo === 'partesIguales' ? ' selected' : ''}>Partes iguales</option>
      <option value="porcentaje"${modo === 'porcentaje' ? ' selected' : ''}>Porcentaje</option>
      <option value="importe"${modo === 'importe' ? ' selected' : ''}>Importe exacto</option>
    </select>
    <div data-reparto-participantes="${esc(prefijo)}" style="margin-top:6px;${modo ? '' : 'display:none'}">
      ${personasSeleccionables(personas, reparto).map(filaPersona).join('')}
    </div>
  </div>`;
}

/** Muestra/oculta las piezas del widget según el modo elegido. Idempotente. */
export function sincronizarRepartoWidget(raiz: ParentNode, prefijo: string): void {
  const widget = raiz.querySelector(`[data-reparto="${prefijo}"]`);
  if (!widget) return;
  const modo = (widget.querySelector(`[data-reparto-modo="${prefijo}"]`) as HTMLSelectElement | null)?.value ?? '';
  const participantesEl = widget.querySelector<HTMLElement>(`[data-reparto-participantes="${prefijo}"]`);
  if (participantesEl) participantesEl.style.display = modo ? '' : 'none';
  const mostrarValor = modo === 'porcentaje' || modo === 'importe';
  widget.querySelectorAll<HTMLElement>(`[data-reparto-valor="${prefijo}"]`).forEach((el) => {
    el.style.display = mostrarValor ? '' : 'none';
  });
}

/** Reparto actual del widget, o `undefined` si está en "sin reparto" (o no hay widget / nadie marcado). */
export function leerRepartoWidget(raiz: ParentNode, prefijo: string): Reparto | undefined {
  const widget = raiz.querySelector(`[data-reparto="${prefijo}"]`);
  if (!widget) return undefined;
  const modo = ((widget.querySelector(`[data-reparto-modo="${prefijo}"]`) as HTMLSelectElement | null)?.value ?? '') as ModoReparto | '';
  if (!modo) return undefined;

  const marcados = [...widget.querySelectorAll<HTMLInputElement>('.reparto-persona:checked')];
  if (marcados.length === 0) return undefined;

  const participantes = marcados.map((chk) => {
    const personaId = chk.value;
    const valorInput = widget.querySelector<HTMLInputElement>(`[data-reparto-valor="${prefijo}"][data-persona="${personaId}"]`);
    const valor = valorInput ? parseFloat(valorInput.value) : NaN;
    return Number.isFinite(valor) ? { personaId, valor } : { personaId };
  });
  return { modo, participantes };
}

/** Texto compacto de un reparto, para enseñar en una fila de lista. `''` si no hay reparto. */
export function resumenReparto(reparto: Reparto | undefined, personas: Persona[]): string {
  if (!reparto || reparto.participantes.length === 0) return '';
  const nombres = reparto.participantes.map((p) => personas.find((x) => x._id === p.personaId)?.nombre ?? '?').join(', ');
  return `${nombres} (${ETIQUETAS_MODO[reparto.modo]})`;
}

/** Resumen de los dos repartos juntos («Paga: X · Consume: Y»), o `''` si ninguno tiene reparto. */
export function resumenRepartoDoble(repartoConsumo: Reparto | undefined, repartoPago: Reparto | undefined, personas: Persona[]): string {
  const consumo = resumenReparto(repartoConsumo, personas);
  const pago = resumenReparto(repartoPago, personas);
  if (!consumo && !pago) return '';
  if (consumo === pago) return `Reparto: ${consumo}`;
  return [pago && `Paga: ${pago}`, consumo && `Consume: ${consumo}`].filter(Boolean).join(' · ');
}
