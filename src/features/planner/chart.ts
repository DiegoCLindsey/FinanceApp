// ── features/planner/chart ────────────────────────────────────────────────────
// Gráfico de área apilada: patrimonio por vehículo a lo largo del tiempo (§5).
//
// Chart.js llega por CDN en el shell legacy, así que se accede con guarda: si no
// está, la vista sigue funcionando y solo se queda sin gráfico. La tabla mes a
// mes y los hitos dan la misma información.

import { formatEUR } from '@/core/money';
import type { Plan, ResultadoSimulacion } from '@/planner/tipos';

interface ChartLike {
  destroy(): void;
}
type ChartCtor = new (el: HTMLCanvasElement, cfg: unknown) => ChartLike;

const chartGlobal = (): ChartCtor | null => (globalThis as { Chart?: ChartCtor }).Chart ?? null;

const PALETA = ['#00e5a0', '#4d9fff', '#a855f7', '#f97316', '#eab308', '#22d3ee', '#fb7185', '#34d399'];

/** Una instancia viva por canvas, para no dejar gráficos huérfanos al repintar. */
const vivos = new WeakMap<HTMLCanvasElement, ChartLike>();

export function graficoPatrimonio(canvas: HTMLCanvasElement, plan: Plan, res: ResultadoSimulacion): ChartLike | null {
  const Chart = chartGlobal();
  if (!Chart) return null;

  const previo = vivos.get(canvas);
  if (previo) {
    try {
      previo.destroy();
    } catch {
      /* el canvas ya no existía */
    }
  }

  // Saldo acumulado por vehículo mes a mes. La serie mensual trae el saldo por
  // OBJETIVO, así que hay que sumarlos por su vehículo.
  const porVehiculo = new Map<string, number[]>();
  const vehiculoDe = new Map(plan.objetivos.map((o) => [o._id, o.vehiculoId]));
  const usados = new Set(plan.objetivos.map((o) => o.vehiculoId));
  for (const v of usados) porVehiculo.set(v, []);

  for (const fila of res.serieMensual) {
    const acumulado = new Map<string, number>();
    for (const a of fila.asignaciones) {
      const v = vehiculoDe.get(a.objetivoId);
      if (!v) continue;
      acumulado.set(v, (acumulado.get(v) ?? 0) + a.saldoTrasMes);
    }
    for (const v of usados) porVehiculo.get(v)!.push((acumulado.get(v) ?? 0) / 100);
  }

  const nombre = (id: string) => plan.vehiculos.find((v) => v._id === id)?.nombre ?? 'Sin vehículo';
  const lista = [...usados];

  // Los datos van ACUMULADOS: con `fill: '-1'` Chart.js pinta la banda entre una
  // línea y la anterior, así que si cada serie llevara su valor suelto las
  // bandas se solaparían en vez de apilarse. El tooltip resta la anterior para
  // volver a enseñar la aportación individual.
  const acumuladas = lista.map((_, i) =>
    res.serieMensual.map((__, m) => lista.slice(0, i + 1).reduce((s, v) => s + (porVehiculo.get(v)![m] ?? 0), 0)),
  );

  const datasets = lista.map((v, i) => ({
    label: nombre(v),
    data: acumuladas[i],
    borderColor: PALETA[i % PALETA.length],
    backgroundColor: `${PALETA[i % PALETA.length]}33`,
    fill: i === 0 ? 'origin' : '-1',
    borderWidth: 1.5,
    pointRadius: 0,
    tension: 0.25,
  }));

  const grafico = new Chart(canvas, {
    type: 'line',
    data: { labels: res.serieMensual.map((f) => f.mes), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#8b92a8', font: { size: 11 }, boxWidth: 12 } },
        tooltip: {
          backgroundColor: '#13161e',
          borderColor: '#252a38',
          borderWidth: 1,
          titleColor: '#8b92a8',
          bodyColor: '#e8eaf2',
          callbacks: {
            // Los datasets vienen apilados (`fill: '-1'`), así que el valor
            // crudo de cada uno ya es acumulado: se resta el anterior para
            // enseñar lo que aporta ESE vehículo y no la suma hasta él.
            label: (c: {
              dataset: { label: string };
              parsed: { y: number };
              datasetIndex: number;
              dataIndex: number;
              chart: { data: { datasets: { data: number[] }[] } };
            }) => {
              const previo = c.datasetIndex > 0 ? (c.chart.data.datasets[c.datasetIndex - 1].data[c.dataIndex] ?? 0) : 0;
              return ` ${c.dataset.label}: ${formatEUR(c.parsed.y - previo)}`;
            },
          },
        },
      },
      scales: {
        x: { ticks: { color: '#555d77', maxTicksLimit: 12 }, grid: { display: false } },
        y: { ticks: { color: '#555d77', callback: (v: number) => formatEUR(v) }, grid: { color: '#252a38' } },
      },
    },
  });

  vivos.set(canvas, grafico);
  return grafico;
}
