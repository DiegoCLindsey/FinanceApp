// ── features/shared/dia-pago ──────────────────────────────────────────────────
// Widget de "día efectivo" de un movimiento recurrente. Port de UI.diaPagoWidget
// (ui/ui.js) sin `onchange=` inline y con lectura desde un contenedor concreto
// en lugar de por id global, para que puedan convivir varios en la misma página.
//
// Formato serializado (el mismo que entiende el motor, ver core/dates):
//   ''                      → sin ajuste
//   'dia:<1..31|ultimo>'    → día fijo del mes
//   'nthweekday:<n>:<wd>'   → n-ésimo día de la semana (n = -1 → último)

import type { DiaPago } from '@/core/dates';
import { esc } from '../accounting/dom';

const DIAS_MES = [...Array.from({ length: 31 }, (_, i) => String(i + 1)), 'ultimo'];
const ORDINALES: [string, string][] = [
  ['1', '1º'],
  ['2', '2º'],
  ['3', '3º'],
  ['4', '4º'],
  ['5', '5º'],
  ['-1', 'Último'],
];
const DIAS_SEMANA: [string, string][] = [
  ['1', 'lunes'],
  ['2', 'martes'],
  ['3', 'miércoles'],
  ['4', 'jueves'],
  ['5', 'viernes'],
  ['6', 'sábado'],
  ['0', 'domingo'],
];

type Modo = 'none' | 'dia' | 'nthweekday';

interface Partes {
  modo: Modo;
  dia: string;
  nth: string;
  wd: string;
}

/** Descompone el valor serializado en las piezas que muestra el widget. */
export function partesDiaPago(diaPago: DiaPago | undefined): Partes {
  const v = diaPago || '';
  if (v.startsWith('dia:')) return { modo: 'dia', dia: v.slice(4) || '1', nth: '1', wd: '1' };
  if (v.startsWith('nthweekday:')) {
    const [, nth = '1', wd = '1'] = v.split(':');
    return { modo: 'nthweekday', dia: '1', nth, wd };
  }
  return { modo: 'none', dia: '1', nth: '1', wd: '1' };
}

const opciones = (items: [string, string][], sel: string) =>
  items.map(([v, l]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`).join('');

/** HTML del widget. `prefijo` evita colisiones de id si hay más de uno. */
export function diaPagoWidget(diaPago: DiaPago | undefined, prefijo = 'dp'): string {
  const { modo, dia, nth, wd } = partesDiaPago(diaPago);
  const diasOpts = opciones(
    DIAS_MES.map((d) => [d, d === 'ultimo' ? 'Último día' : d] as [string, string]),
    dia,
  );
  return `<div class="form-group" data-diapago="${esc(prefijo)}">
    <label class="form-label">Día efectivo</label>
    <div class="flex gap-8 items-center" style="flex-wrap:wrap;row-gap:6px">
      <select class="form-select" data-dp-modo style="width:auto;min-width:145px">
        <option value="none"${modo === 'none' ? ' selected' : ''}>Sin ajuste</option>
        <option value="dia"${modo === 'dia' ? ' selected' : ''}>Día del mes</option>
        <option value="nthweekday"${modo === 'nthweekday' ? ' selected' : ''}>Día de la semana</option>
      </select>
      <span data-dp-dia class="flex gap-8 items-center"${modo !== 'dia' ? ' style="display:none"' : ''}>
        el día <select class="form-select" data-dp-dnum style="width:auto;min-width:80px">${diasOpts}</select>
      </span>
      <span data-dp-nth class="flex gap-8 items-center"${modo !== 'nthweekday' ? ' style="display:none"' : ''}>
        el
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${opciones(ORDINALES, nth)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${opciones(DIAS_SEMANA, wd)}</select>
        del mes
      </span>
    </div>
  </div>`;
}

/** Muestra u oculta las piezas según el modo elegido. Idempotente. */
export function sincronizarDiaPago(raiz: ParentNode): void {
  const widget = raiz.querySelector('[data-diapago]');
  if (!widget) return;
  const modo = (widget.querySelector('[data-dp-modo]') as HTMLSelectElement | null)?.value ?? 'none';
  (widget.querySelector('[data-dp-dia]') as HTMLElement | null)?.style.setProperty('display', modo === 'dia' ? '' : 'none');
  (widget.querySelector('[data-dp-nth]') as HTMLElement | null)?.style.setProperty('display', modo === 'nthweekday' ? '' : 'none');
}

/** Valor serializado actual del widget. */
export function leerDiaPago(raiz: ParentNode): DiaPago {
  const widget = raiz.querySelector('[data-diapago]');
  if (!widget) return '';
  const val = (sel: string) => (widget.querySelector(sel) as HTMLSelectElement | null)?.value ?? '';
  const modo = val('[data-dp-modo]');
  if (modo === 'dia') return `dia:${val('[data-dp-dnum]')}`;
  if (modo === 'nthweekday') return `nthweekday:${val('[data-dp-n]')}:${val('[data-dp-wd]')}`;
  return '';
}
