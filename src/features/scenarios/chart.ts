// ── features/scenarios/chart ──────────────────────────────────────────────────
// Gráfico comparativo de escenarios. Chart.js llega por CDN en el shell legacy,
// así que se accede con guarda: si no está, la vista sigue funcionando y solo
// se queda sin gráfico (la tabla comparativa da la misma información).

import { formatEUR } from '@/core/money';
import type { PuntoMensual } from '@/core/scenarios';

export interface SerieGrafico {
  label: string;
  color: string;
  puntos: PuntoMensual[];
  /** La línea base se dibuja discontinua y en gris. */
  esBase?: boolean;
}

interface ChartLike {
  destroy(): void;
}
type ChartCtor = new (el: HTMLCanvasElement, cfg: unknown) => ChartLike;

const chartGlobal = (): ChartCtor | null => (globalThis as { Chart?: ChartCtor }).Chart ?? null;

/**
 * Dibuja (o redibuja) el gráfico. Devuelve la instancia para poder destruirla:
 * Chart.js no libera el canvas solo, y el legacy dejaba instancias vivas cada
 * vez que se repintaba la vista.
 */
export function dibujarComparativa(canvas: HTMLCanvasElement, series: SerieGrafico[]): ChartLike | null {
  const Chart = chartGlobal();
  if (!Chart) return null;

  const datasets = series.map((s) => ({
    label: s.label,
    data: s.puntos.map((p) => ({ x: p.x, y: p.y })),
    borderColor: s.esBase ? '#6b7280' : s.color,
    backgroundColor: s.esBase ? 'transparent' : `${s.color}18`,
    borderWidth: s.esBase ? 1.5 : 2,
    ...(s.esBase ? { borderDash: [4, 3] } : { fill: false }),
    pointRadius: 2,
    tension: 0.3,
  }));

  return new Chart(canvas, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: 'var(--text2)', font: { size: 11 } } },
        tooltip: {
          callbacks: { label: (c: { dataset: { label: string }; parsed: { y: number } }) => `${c.dataset.label}: ${formatEUR(c.parsed.y)}` },
        },
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'month', displayFormats: { month: 'MMM yy' } },
          ticks: { color: 'var(--text3)', maxTicksLimit: 12 },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          ticks: { color: 'var(--text3)', callback: (v: number) => formatEUR(v) },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
      },
    },
  });
}

export const hayChartJs = (): boolean => chartGlobal() !== null;
