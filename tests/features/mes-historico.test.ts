// @vitest-environment happy-dom
// Ventana «Meses anteriores»: periodo seleccionable, un desglose por mes,
// selección de mes y acumulado del periodo. Sin Chart.js (como sin red): las
// fichas de cada mes tienen que bastar para todo.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { abrirHistoricoMeses, rangoDe } from '@/features/dashboard/mes-historico';
import type { CashEvent } from '@/engine/types';

const ev = (fecha: string, cuantia: number, extra: Partial<CashEvent> = {}): CashEvent =>
  ({
    fecha,
    concepto: 'x',
    cuantia,
    tipo: cuantia > 0 ? 'ingreso' : 'gasto',
    tags: [],
    cuenta: 'default',
    sourceType: 'expense',
    ...extra,
  }) as CashEvent;

/** Un mes tipo: nómina 2000, hipoteca 700, luz 60, súper 300 (y en octubre 900). */
function extracto(desde: string, hasta: string): CashEvent[] {
  const out: CashEvent[] = [];
  for (let d = new Date(`${desde.slice(0, 7)}-01T00:00:00`); d <= new Date(`${hasta}T00:00:00`); d.setMonth(d.getMonth() + 1)) {
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    out.push(ev(`${m}-28`, 2000, { sourceType: 'nomina', sourceId: 'n' }));
    out.push(ev(`${m}-01`, -700, { sourceType: 'loan', sourceId: 'hip' }));
    out.push(ev(`${m}-10`, -60, { sourceId: 'luz' }));
    out.push(ev(`${m}-15`, m === '2026-10' ? -900 : -300, { sourceId: 'super' }));
  }
  return out.filter((e) => e.fecha >= desde && e.fecha <= hasta);
}

const deps = () => ({
  generarExtracto: vi.fn(extracto),
  gastos: [
    { _id: 'luz', concepto: 'Luz', tipoFrecuencia: 'mensual' },
    { _id: 'super', concepto: 'Supermercado', tipoFrecuencia: 'mensual' },
  ],
  prestamos: [{ _id: 'hip', nombre: 'Hipoteca' }],
  hoy: '2026-11-17',
});

const $ = (sel: string) => document.querySelector(sel) as HTMLElement;
const $$ = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];

const mesesDel2026 = Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, '0')}`);

describe('rangoDe', () => {
  it('los atajos terminan en el mes en curso', () => {
    expect(rangoDe('3', '2026-11')).toEqual(['2026-09', '2026-10', '2026-11']);
    expect(rangoDe('anio', '2026-03')).toEqual(['2026-01', '2026-02', '2026-03']);
  });
  it('la previsión: los próximos meses empiezan en el siguiente al en curso', () => {
    expect(rangoDe('f3', '2026-11')).toEqual(['2026-12', '2027-01', '2027-02']);
    expect(rangoDe('f12', '2026-11')).toHaveLength(12);
    expect(rangoDe('aniocompleto', '2026-11')).toEqual(mesesDel2026);
  });
  it('el personalizado puede llegar al futuro, con 36 meses como mucho', () => {
    expect(rangoDe('personalizado', '2026-11', '2026-10', '2027-01')).toEqual(['2026-10', '2026-11', '2026-12', '2027-01']);
    // del pasado lejano se quedan los 36 más cercanos a hoy; del futuro, los 36 primeros
    expect(rangoDe('personalizado', '2026-11', '2020-01', '2026-11').at(-1)).toBe('2026-11');
    expect(rangoDe('personalizado', '2026-11', '2027-01', '2035-01')[0]).toBe('2027-01');
    expect(rangoDe('personalizado', '2026-11', '2027-01', '2035-01')).toHaveLength(36);
  });
});

describe('ventana «Meses anteriores»', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="modal-overlay" class="hidden"><div id="modal-box" class="modal-box"><div id="modal-content"></div></div></div>`;
  });

  it('abre con los últimos 6 meses y el mes anterior seleccionado', () => {
    const d = deps();
    abrirHistoricoMeses(d);
    expect($('#modal-overlay').classList.contains('hidden')).toBe(false);
    expect($('#modal-box').classList.contains('modal-box--ancho')).toBe(true);
    expect($$('[data-hist-mes]').map((b) => b.dataset.histMes)).toEqual(['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
    expect(d.generarExtracto).toHaveBeenCalledWith('2026-06-01', '2026-11-30');
    expect($('[data-hist-mes].activa').dataset.histMes).toBe('2026-10');
    expect($('[data-hist-detalle]').textContent).toContain('octubre 2026');
    expect($('[data-hist-detalle]').textContent).toContain('900,00');
  });

  it('pulsar un mes enseña su desglose por grupo y concepto', () => {
    abrirHistoricoMeses(deps());
    ($$('[data-hist-mes]').find((b) => b.dataset.histMes === '2026-08') as HTMLElement).click();
    const det = $('[data-hist-detalle]').textContent ?? '';
    expect(det).toContain('agosto 2026');
    expect(det).toContain('Hipoteca');
    expect(det).toContain('Supermercado');
    // 2000 − 700 − 60 − 300
    expect(det).toContain('+940,00');
  });

  it('el acumulado suma los tres grupos en el periodo y da la media', () => {
    abrirHistoricoMeses(deps());
    $('[data-hist-preset="3"]').click();
    $('[data-hist-vista="acumulado"]').click();
    const det = $('[data-hist-detalle]').textContent ?? '';
    expect(det).toContain('Acumulado · 3 meses');
    // Préstamos 3 × 700; margen 940 + 340 + 940 (el mes en curso cuenta entero)
    expect(det).toContain('2100,00');
    expect(det).toContain('+2220,00');
    expect(det).toContain('Media +740,00');
    expect($$('.hist-ficha.activa')).toHaveLength(0);
  });

  it('la media del periodo divide cada grupo entre los meses y recuerda el total', () => {
    abrirHistoricoMeses(deps());
    $('[data-hist-preset="3"]').click();
    $('[data-hist-vista="media"]').click();
    expect($('[data-hist-vista="media"]').getAttribute('aria-pressed')).toBe('true');
    const det = $('[data-hist-detalle]').textContent ?? '';
    expect(det).toContain('Media mensual · 3 meses');
    expect(det).toContain('incluye el mes en curso');
    // súper: 300 + 900 + 300 → 500 al mes
    expect(det).toContain('500,00');
    // préstamos: 700 al mes, 2100 en el periodo
    expect(det).toContain('700,00');
    expect(det).toContain('2100,00');
    // margen medio 740 al mes, 2220 en los tres
    expect(det).toContain('+740,00');
    expect(det).toContain('+2220,00');
    expect($$('.hist-ficha.activa')).toHaveLength(0);
  });

  it('pulsar un mes desde la media vuelve a «Mes seleccionado»', () => {
    abrirHistoricoMeses(deps());
    $('[data-hist-vista="media"]').click();
    ($$('[data-hist-mes]').find((b) => b.dataset.histMes === '2026-09') as HTMLElement).click();
    expect($('[data-hist-vista="mes"]').getAttribute('aria-pressed')).toBe('true');
    expect($('[data-hist-detalle]').textContent).toContain('septiembre 2026');
  });

  it('la previsión: meses futuros con la reserva de imprevistos descontada del margen', () => {
    const d = deps();
    // un imprevisto real en octubre: la estimación sale de él
    (d as { movimientos?: unknown[] }).movimientos = [
      { _id: 'm1', fecha: '2026-10-08', concepto: 'Taller', importeCts: -60000, tipo: 'gasto', imprevisto: true },
    ];
    abrirHistoricoMeses(d);
    $('[data-hist-preset="f3"]').click();
    expect($$('[data-hist-mes]').map((b) => b.dataset.histMes)).toEqual(['2026-12', '2027-01', '2027-02']);
    expect($$('.hist-ficha.es-futuro')).toHaveLength(3);
    expect(d.generarExtracto).toHaveBeenLastCalledWith('2026-12-01', '2027-02-28');
    // sin pasado en el periodo, se selecciona el primer mes
    const det = $('[data-hist-detalle]').textContent ?? '';
    expect(det).toContain('diciembre 2026 · previsión');
    expect(det).toContain('Entrarán');
    // el mes futuro reserva la estimación de imprevistos (aquí, los 600 € de
    // octubre en el único mes de seguimiento)
    expect(det).toContain('Reservado');
    expect(det).toContain('600,00');
    // la nota explica de dónde sale la previsión
    expect(document.body.textContent).toContain('salen de lo que tienes configurado');
  });

  it('«Contar imprevistos» apagado: los meses futuros no reservan nada', () => {
    const d = deps();
    (d as { movimientos?: unknown[] }).movimientos = [
      { _id: 'm1', fecha: '2026-10-08', concepto: 'Taller', importeCts: -60000, tipo: 'gasto', imprevisto: true },
    ];
    const cambios: boolean[] = [];
    (d as { onContarImprevistos?: unknown }).onContarImprevistos = (v: boolean) => {
      cambios.push(v);
      return { ...d, contarImprevistos: v };
    };
    abrirHistoricoMeses(d);
    $('[data-hist-preset="f3"]').click();
    const toggle = $('[data-contar-imprevistos]') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    expect($('[data-hist-detalle]').textContent).toContain('Reservado');
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));
    expect(cambios).toEqual([false]);
    expect(($('[data-contar-imprevistos]') as HTMLInputElement).checked).toBe(false);
    const det = $('[data-hist-detalle]').textContent ?? '';
    expect(det).not.toContain('Reservado');
    expect(det).toContain('«Contar imprevistos» está apagado');
    // diciembre: 2000 − 700 − 60 − 300, sin reserva
    expect(det).toContain('+940,00');
  });

  it('con intereses previstos, el margen dice cuánto se mueve el saldo', () => {
    const d = deps();
    const base = d.generarExtracto;
    d.generarExtracto = vi.fn((desde: string, hasta: string) =>
      [...base(desde, hasta), ev('2026-10-30', 25, { sourceType: 'account-interest', sourceId: 'aho' })].filter(
        (e) => e.fecha >= desde && e.fecha <= hasta,
      ),
    );
    abrirHistoricoMeses(d);
    // la ventana recuerda el periodo anterior: se fija y se elige octubre
    $('[data-hist-preset="6"]').click();
    ($$('[data-hist-mes]').find((x) => x.dataset.histMes === '2026-10') as HTMLElement).click();
    const det = $('[data-hist-detalle]').textContent ?? '';
    // octubre: margen 2000 − 700 − 60 − 900 = 340; con 25 de intereses el saldo sube 365
    expect(det).toContain('+340,00');
    expect(det).toContain('+25,00');
    expect(det).toContain('el saldo sube 365,00');
  });

  it('la media de un periodo futuro lo dice', () => {
    abrirHistoricoMeses(deps());
    $('[data-hist-preset="f6"]').click();
    $('[data-hist-vista="media"]').click();
    expect($('[data-hist-detalle]').textContent).toContain('todo previsión');
  });

  it('«Todo el año» mezcla pasado y previsión y lo cuenta', () => {
    abrirHistoricoMeses(deps());
    $('[data-hist-preset="aniocompleto"]').click();
    $('[data-hist-vista="acumulado"]').click();
    const det = $('[data-hist-detalle]').textContent ?? '';
    expect(det).toContain('Acumulado · 12 meses');
    expect(det).toContain('incluye el mes en curso y 1 mes de previsión');
  });

  it('el periodo personalizado se elige por meses', () => {
    const d = deps();
    abrirHistoricoMeses(d);
    $('[data-hist-preset="personalizado"]').click();
    // La ventana recuerda el periodo anterior: se fijan los dos extremos.
    ($('[data-hist-hasta]') as HTMLInputElement).value = '2026-11';
    const desde = $('[data-hist-desde]') as HTMLInputElement;
    desde.value = '2026-09';
    desde.dispatchEvent(new Event('change', { bubbles: true }));
    expect($$('[data-hist-mes]').map((b) => b.dataset.histMes)).toEqual(['2026-09', '2026-10', '2026-11']);
    expect(d.generarExtracto).toHaveBeenLastCalledWith('2026-09-01', '2026-11-30');
  });

  it('escapa el texto del usuario', () => {
    const d = deps();
    d.gastos[1].concepto = '<b data-inyectado>Súper</b>';
    abrirHistoricoMeses(d);
    expect(document.querySelector('[data-hist-detalle] [data-inyectado]')).toBeNull();
    expect($('[data-hist-detalle]').textContent).toContain('<b data-inyectado>Súper</b>');
  });
});
