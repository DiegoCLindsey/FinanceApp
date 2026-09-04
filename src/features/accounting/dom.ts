// Helpers de presentación (escapado, formato, delegación de eventos) usados
// por casi todas las vistas del paquete nuevo, no solo por contabilidad —
// nace aquí porque fue el primer módulo escrito, y mover un import usado en
// una docena de ficheros no compensaba el riesgo. Sin dependencias del
// legacy: solo el design system (clases CSS existentes).

import { formatEUR } from '@/core/money';

/** Escapa texto que va a interpolarse en HTML. */
export function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Importe con color según el signo. */
export function eurColor(n: number): string {
  const color = n < 0 ? 'var(--red)' : n > 0 ? 'var(--accent)' : 'var(--text2)';
  return `<span style="color:${color}">${esc(formatEUR(n))}</span>`;
}

/** Porcentaje de precisión con color de semáforo. */
export function precisionBadge(p: number | null): string {
  if (p === null) return '<span style="color:var(--text3);font-size:12px">sin datos</span>';
  const color = p >= 90 ? 'var(--accent)' : p >= 70 ? 'var(--yellow)' : 'var(--red)';
  return `<span style="color:${color};font-weight:600">${p.toFixed(1)}%</span>`;
}

export function tagChips(tags: string[]): string {
  if (tags.length === 0) return '<span style="color:var(--text3);font-size:11px">—</span>';
  return tags.map((t) => `<span class="tag">${esc(t)}</span>`).join(' ');
}

/** Nombre legible de un mes 'YYYY-MM'. */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function nombreMes(mes: string): string {
  const [y, m] = mes.split('-').map(Number);
  return `${MESES[m - 1]} ${y}`;
}

/** Notifica al usuario usando el toast del shell si está disponible. */
export function toast(mensaje: string, tipo: 'ok' | 'err' | 'warn' = 'ok'): void {
  const legacy = (globalThis as { UI?: { toast?: (m: string, t?: string) => void } }).UI;
  if (legacy?.toast) return legacy.toast(mensaje, tipo);
  console.info('[FinanceApp]', mensaje);
}

/** Confirmación; usa la del shell si existe. */
export function confirmar(mensaje: string): boolean {
  const legacy = (globalThis as { UI?: { confirm?: (m: string) => boolean } }).UI;
  if (legacy?.confirm) return legacy.confirm(mensaje);
  return typeof confirm === 'function' ? confirm(mensaje) : true;
}

/** Delegación de eventos: un solo listener por contenedor y acción. */
export function onClick(container: HTMLElement, selector: string, handler: (el: HTMLElement, ev: Event) => void): void {
  container.addEventListener('click', (ev) => {
    const el = (ev.target as HTMLElement | null)?.closest(selector) as HTMLElement | null;
    if (el && container.contains(el)) handler(el, ev);
  });
}

export function onChange(container: HTMLElement, selector: string, handler: (el: HTMLElement, ev: Event) => void): void {
  container.addEventListener('change', (ev) => {
    const el = (ev.target as HTMLElement | null)?.closest(selector) as HTMLElement | null;
    if (el && container.contains(el)) handler(el, ev);
  });
}

export function valor(container: HTMLElement, selector: string): string {
  return (container.querySelector(selector) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
}

export function numero(container: HTMLElement, selector: string): number {
  const v = parseFloat(valor(container, selector));
  return Number.isFinite(v) ? v : 0;
}
