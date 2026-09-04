// @vitest-environment happy-dom
// Cabecera del cuadro de mando (1.7 — 9/9, en curso).
import { describe, it, expect } from 'vitest';
import { heroKpis, pastillasCuentas, proximosCargos } from '@/features/dashboard/hero';
import type { CashEvent } from '@/engine/types';

const ev = (fecha: string, concepto: string, cuantia: number, extra: Partial<CashEvent> = {}): CashEvent => ({
  fecha,
  concepto,
  cuantia,
  tipo: 'gasto',
  sourceType: 'expense',
  sourceId: 'e1',
  tags: [],
  cuenta: 'a1',
  ...extra,
});

describe('KPIs del hero', () => {
  it('pinta los cuatro indicadores con el mes en curso', () => {
    const html = heroKpis({ saldoHoy: 12000, ingresosMes: 3000, gastosMes: 1800 }, '2026-03-14');
    expect(html).toContain('Saldo actual');
    expect(html).toContain('2026-03-14');
    expect(html).toContain('2026-03');
    expect(html).toContain('Ingresos este mes');
    expect(html).toContain('Gastos este mes');
    expect(html).toContain('Ahorro est. mes');
  });

  it('el ahorro es ingresos menos gastos, con signo explícito', () => {
    expect(heroKpis({ saldoHoy: 0, ingresosMes: 3000, gastosMes: 1800 }, '2026-03-14')).toContain('+1200,00');
    expect(heroKpis({ saldoHoy: 0, ingresosMes: 1000, gastosMes: 1800 }, '2026-03-14')).toContain('-800,00');
  });

  it('marca en negativo el saldo bajo cero', () => {
    const html = heroKpis({ saldoHoy: -50, ingresosMes: 0, gastosMes: 0 }, '2026-03-14');
    expect(html).toContain('dash-hero-val neg');
  });

  it('sin gastos no marca la tarjeta de gastos en rojo', () => {
    const valorDe = (html: string, label: string): HTMLElement => {
      const div = document.createElement('div');
      div.innerHTML = html;
      const tarjeta = [...div.querySelectorAll('.dash-hero-item')].find((t) => t.textContent?.includes(label));
      return tarjeta!.querySelector('.dash-hero-val') as HTMLElement;
    };
    expect(valorDe(heroKpis({ saldoHoy: 10, ingresosMes: 0, gastosMes: 0 }, '2026-03-14'), 'Gastos este mes').className).not.toContain(
      'neg',
    );
    expect(valorDe(heroKpis({ saldoHoy: 10, ingresosMes: 0, gastosMes: 5 }, '2026-03-14'), 'Gastos este mes').className).toContain('neg');
  });
});

describe('próximos cargos', () => {
  const extracto = [
    ev('2026-03-14', 'Hoy mismo', -10),
    ev('2026-03-18', 'Dentro de la ventana', -20),
    ev('2026-03-21', 'Último día de la ventana', -30),
    ev('2026-03-22', 'Ya fuera', -40),
    ev('2026-03-13', 'Ayer', -50),
    ev('2026-03-16', 'Un ingreso', 100, { tipo: 'ingreso' }),
    ev('2026-03-16', 'Traspaso', -60, { sourceType: 'transfer-out' }),
  ];

  it('coge solo gastos dentro de la ventana, sin traspasos', () => {
    const html = proximosCargos(extracto, '2026-03-14');
    expect(html).toContain('Hoy mismo');
    expect(html).toContain('Dentro de la ventana');
    expect(html).toContain('Último día de la ventana');
    expect(html).not.toContain('Ya fuera');
    expect(html).not.toContain('Ayer');
    expect(html).not.toContain('Un ingreso');
    expect(html).not.toContain('Traspaso');
  });

  it('la ventana se calcula sobre el calendario, no sumando milisegundos', () => {
    // 2026-03-29 es el cambio de hora en la zona europea: sumar 7×86400000 ms
    // deja el instante en el día 4 a las 23:00 y `toISOString()` lo redondeaba
    // al 4 en vez de al 5.
    const html = proximosCargos([ev('2026-04-05', 'Justo en el borde', -10)], '2026-03-29');
    expect(html).toContain('Justo en el borde');
  });

  it('no pinta la tarjeta si no hay nada próximo', () => {
    expect(proximosCargos([], '2026-03-14')).toBe('');
    expect(proximosCargos([ev('2026-05-01', 'Lejos', -10)], '2026-03-14')).toBe('');
  });

  it('respeta el máximo de filas', () => {
    const muchos = Array.from({ length: 10 }, (_, i) => ev('2026-03-15', `Cargo ${i}`, -1));
    const html = proximosCargos(muchos, '2026-03-14');
    expect(html).toContain('Cargo 5');
    expect(html).not.toContain('Cargo 6');
  });

  it('escapa el concepto', () => {
    const html = proximosCargos([ev('2026-03-15', '<b>Luz</b>', -10)], '2026-03-14');
    expect(html).not.toContain('<b>Luz');
    expect(html).toContain('&lt;b&gt;Luz');
  });

  it('la ventana es configurable', () => {
    expect(proximosCargos([ev('2026-03-20', 'A seis días', -10)], '2026-03-14', 3)).toBe('');
    expect(proximosCargos([ev('2026-03-20', 'A seis días', -10)], '2026-03-14', 30)).toContain('A seis días');
  });
});

describe('pastillas de cuentas', () => {
  const cuentas = [
    { _id: 'a1', nombre: 'Corriente' },
    { _id: 'a2', nombre: 'Ahorro', simulacion: true },
  ];

  it('marca las activas y las simuladas', () => {
    const div = document.createElement('div');
    div.innerHTML = pastillasCuentas(cuentas, ['a1']);
    const pills = [...div.querySelectorAll('.acc-pill')];
    expect(pills[0].className).toContain('active');
    expect(pills[1].className).not.toContain('active');
    expect(pills[1].className).toContain('sim');
    expect(pills[1].textContent).toContain('◌');
  });

  it('van por data-attr y no por onclick global', () => {
    const html = pastillasCuentas(cuentas, []);
    expect(html).toContain('data-dash-cuenta="a1"');
    expect(html).not.toContain('onclick');
  });

  it('escapa el nombre de la cuenta', () => {
    const html = pastillasCuentas([{ _id: 'x', nombre: '"><script>' }], []);
    expect(html).not.toContain('<script>');
  });
});
