// ── informe/html ──────────────────────────────────────────────────────────────
// El informe como una página HTML AUTÓNOMA: estilos y gráfica dentro, sin
// scripts externos ni fuentes de la red. Así se abre igual sin conexión, se
// guarda como fichero y se imprime o se guarda como PDF desde el navegador.
//
// Fondo claro a propósito, aunque la aplicación sea oscura: es un documento
// para leer con calma e imprimir, no una pantalla.

import { formatEUR } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { FilaMes, Informe, PasoPuente } from './modelo';

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fecha = (iso: ISODate) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
};
const nombreMes = (mes: string) => {
  const [y, m] = mes.split('-').map(Number);
  return `${MESES[m - 1]} ${y}`;
};
const eur = (n: number) => esc(formatEUR(n));
const conSigno = (n: number) => `${n > 0.004 ? '+' : n < -0.004 ? '−' : ''}${esc(formatEUR(Math.abs(n)))}`;
const clase = (n: number) => (n > 0.004 ? 'pos' : n < -0.004 ? 'neg' : '');

// ── Gráfica de saldo: real, previsto al inicio y previsión ─────────────────────

const COLOR = { real: '#1f6fd1', previstoInicio: '#8a94a6', prevision: '#0f9d6b', hoy: '#b4232c' };

function grafica(inf: Informe): string {
  const puntos = inf.serie;
  if (puntos.length < 2) return '';
  const W = 760;
  const H = 260;
  const m = { izq: 70, der: 16, arr: 14, aba: 30 };
  const t = (f: ISODate) => new Date(`${f}T00:00:00`).getTime();
  const t0 = t(puntos[0].fecha);
  const t1 = t(puntos[puntos.length - 1].fecha);
  const valores = puntos.flatMap((p) => [p.real, p.previstoInicio, p.prevision].filter((v): v is number => v !== undefined));
  if (inf.minimo) valores.push(inf.minimo.saldo);
  let vmin = Math.min(...valores);
  let vmax = Math.max(...valores);
  const margen = (vmax - vmin) * 0.08 || Math.abs(vmax) * 0.05 || 1;
  vmin -= margen;
  vmax += margen;
  const x = (f: ISODate) => m.izq + ((t(f) - t0) / Math.max(1, t1 - t0)) * (W - m.izq - m.der);
  const y = (v: number) => m.arr + (1 - (v - vmin) / (vmax - vmin)) * (H - m.arr - m.aba);
  const linea = (clave: 'real' | 'previstoInicio' | 'prevision', estilo: string) => {
    const pts = puntos.filter((p) => p[clave] !== undefined);
    if (pts.length < 2) return '';
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.fecha).toFixed(1)},${y(p[clave] as number).toFixed(1)}`).join(' ');
    const marcas = pts
      .map((p) => `<circle cx="${x(p.fecha).toFixed(1)}" cy="${y(p[clave] as number).toFixed(1)}" r="3" fill="${COLOR[clave]}"/>`)
      .join('');
    return `<path d="${d}" fill="none" stroke="${COLOR[clave]}" stroke-width="2" ${estilo}/>${marcas}`;
  };
  const compacto = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 });
  const ticks = Array.from({ length: 5 }, (_, i) => vmin + ((vmax - vmin) * i) / 4);
  const rejilla = ticks
    .map(
      (v) =>
        `<line x1="${m.izq}" x2="${W - m.der}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="#e6e9ef"/><text x="${m.izq - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" class="eje">${esc(compacto.format(v))}</text>`,
    )
    .join('');
  // Etiquetas de mes en el eje x, sin amontonarse.
  const fechasX = puntos.map((p) => p.fecha);
  const paso = Math.max(1, Math.ceil(fechasX.length / 8));
  const etiquetasX = fechasX
    .filter((_, i) => i % paso === 0 || i === fechasX.length - 1)
    .map((f) => {
      const [yy, mm] = f.split('-').map(Number);
      return `<text x="${x(f).toFixed(1)}" y="${H - 8}" text-anchor="middle" class="eje">${MESES_CORTOS[mm - 1]} ${String(yy).slice(2)}</text>`;
    })
    .join('');
  const hoy =
    inf.tienePasado && inf.tieneFuturo
      ? `<line x1="${x(inf.corte).toFixed(1)}" x2="${x(inf.corte).toFixed(1)}" y1="${m.arr}" y2="${H - m.aba}" stroke="${COLOR.hoy}" stroke-dasharray="3 3"/><text x="${(x(inf.corte) + 4).toFixed(1)}" y="${m.arr + 10}" class="eje" fill="${COLOR.hoy}">último saldo real</text>`
      : '';
  const minimo = inf.minimo
    ? `<circle cx="${x(inf.minimo.fecha).toFixed(1)}" cy="${y(inf.minimo.saldo).toFixed(1)}" r="5" fill="none" stroke="${COLOR.hoy}" stroke-width="2"/>`
    : '';
  const resumen = `Saldo real de ${eur(inf.saldoInicio)} al empezar${inf.tienePasado ? ` y ${eur(inf.saldoCorte)} el ${esc(fecha(inf.corte))}` : ''}; previsto ${eur(inf.saldoFinal)} al final.`;
  return `<figure class="grafica">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${resumen}">
      ${rejilla}${etiquetasX}${hoy}
      ${linea('previstoInicio', 'stroke-dasharray="2 4"')}
      ${linea('real', '')}
      ${linea('prevision', 'stroke-dasharray="7 4"')}
      ${minimo}
    </svg>
    <figcaption>
      <span><i style="background:${COLOR.real}"></i>Saldo real</span>
      ${inf.tienePasado ? `<span><i class="punteada" style="border-color:${COLOR.previstoInicio}"></i>Lo previsto al empezar el periodo</span>` : ''}
      ${inf.tieneFuturo ? `<span><i class="discontinua" style="border-color:${COLOR.prevision}"></i>Previsión desde el último saldo real</span>` : ''}
      ${inf.minimo ? `<span><i class="anillo"></i>Saldo mínimo previsto</span>` : ''}
    </figcaption>
  </figure>`;
}

// ── Bloques ───────────────────────────────────────────────────────────────────

function puente(pasos: PasoPuente[]): string {
  const filas = pasos
    .map((p) =>
      p.saldo
        ? `<tr class="saldo"><th scope="row">${esc(p.concepto)}</th><td class="num">${eur(p.importe)}</td></tr>`
        : `<tr><th scope="row">${esc(p.concepto)}${p.nota ? `<span class="nota">${esc(p.nota)}</span>` : ''}</th><td class="num ${clase(p.importe)}">${conSigno(p.importe)}</td></tr>`,
    )
    .join('');
  return `<div class="tabla-ancha"><table class="puente"><tbody>${filas}</tbody></table></div>`;
}

function tablaMeses(meses: FilaMes[]): string {
  const etiqueta = { real: 'Real', 'en-curso': 'Real + previsto', previsto: 'Previsto' } as const;
  const conDesviacion = meses.some((m) => m.tipo !== 'previsto');
  const filas = meses
    .map(
      (m) => `<tr class="${m.tipo}">
      <th scope="row">${esc(nombreMes(m.mes))}<span class="nota">${etiqueta[m.tipo]}${m.tipo !== 'previsto' && !m.conSaldoReal ? ' · sin saldo anotado' : ''}${m.reserva > 0 ? ` · gastos con ${eur(m.reserva)} de reserva para imprevistos` : ''}</span></th>
      <td class="num">${eur(m.saldoInicial)}</td>
      <td class="num pos">${eur(m.ingresos)}</td>
      <td class="num neg">${eur(m.gastos)}</td>
      <td class="num tenue">${conSigno(m.otros)}</td>
      ${conDesviacion ? `<td class="num ${clase(m.desviacion)}">${m.tipo === 'previsto' ? '—' : conSigno(m.desviacion)}</td>` : ''}
      <td class="num fuerte">${eur(m.saldoFinal)}</td>
    </tr>`,
    )
    .join('');
  return `<div class="tabla-ancha"><table class="datos meses">
    <thead><tr>
      <th>Mes</th><th class="num">Saldo inicial</th><th class="num" title="Ingresos previstos, netos">Ingresos</th><th class="num" title="Gastos previstos">Gastos</th>
      <th class="num" title="Intereses y traspasos previstos: lo que mueve el saldo sin ser ingreso ni gasto">Otros</th>
      ${conDesviacion ? '<th class="num" title="Saldo real menos el saldo que daban las previsiones">Diferencia</th>' : ''}
      <th class="num">Saldo final</th>
    </tr></thead>
    <tbody>${filas}</tbody>
  </table></div>
  <p class="pie-tabla">Ingresos y gastos son siempre los previstos. En cada fila, saldo inicial + ingresos − gastos + otros${conDesviacion ? ' + diferencia' : ''} = saldo final. ${conDesviacion ? 'En los meses pasados el saldo final es el real de tus cuentas, y la diferencia es lo que no explican las previsiones.' : ''} En los meses de previsión, el saldo final es el previsto.</p>`;
}

function seccionPasado(inf: Informe): string {
  if (!inf.tienePasado) return '';
  const previsto = inf.previstoPasado
    .map((f) => `<tr><th scope="row">${esc(f.nombre)}</th><td class="num ${clase(f.importe)}">${conSigno(f.importe)}</td></tr>`)
    .join('');
  const total = inf.saldoPrevistoCorte - inf.saldoInicio;
  return `<section>
    <h2>2 · El pasado: saldo previsto frente a saldo real</h2>
    <p class="intro">Del ${esc(fecha(inf.desde))} al ${esc(fecha(inf.corte))}, el último saldo real que tienes anotado. Lo real es el saldo de tus cuentas; lo previsto, lo que tus estimaciones, nóminas y préstamos decían que pasaría con él. No se mira movimiento a movimiento: solo si el saldo cuadra.</p>
    <div class="cifras">
      <div><span>Debías tener</span><strong>${eur(inf.saldoPrevistoCorte)}</strong><em>saldo al empezar + lo previsto</em></div>
      <div><span>Tienes</span><strong>${eur(inf.saldoCorte)}</strong><em>saldo real · ${esc(fecha(inf.corte))}</em></div>
      <div class="${clase(inf.diferencia)}"><span>Diferencia</span><strong>${conSigno(inf.diferencia)}</strong><em>${inf.diferencia >= 0 ? 'mejor de lo previsto' : 'peor de lo previsto'}</em></div>
    </div>
    ${
      previsto
        ? `<h3>Lo que estaba previsto en ese tramo</h3>
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Grupo</th><th class="num">Previsto</th></tr></thead>
      <tbody>${previsto}</tbody>
      <tfoot><tr><th scope="row">Total previsto</th><td class="num ${clase(total)}">${conSigno(total)}</td></tr></tfoot>
    </table></div>
    <p class="pie-tabla">Solo previsto: el informe no reparte la diferencia entre grupos, porque se hace contra el saldo de las cuentas. Mira en la tabla mes a mes en qué meses aparece.</p>`
        : ''
    }
  </section>`;
}

function seccionCuentas(inf: Informe): string {
  const p = inf.tienePasado;
  const filas = inf.cuentas
    .map(
      (c) => `<tr><th scope="row">${esc(c.nombre)}</th>
      <td class="num">${eur(c.saldoInicio)}</td>
      ${p ? `<td class="num">${eur(c.saldoPrevisto)}</td><td class="num">${eur(c.saldoReal)}</td><td class="num ${clase(c.diferencia)}">${conSigno(c.diferencia)}</td>` : ''}
      <td class="num">${inf.tieneFuturo ? eur(c.saldoFinal) : '—'}</td>
      <td>${c.ultimoDato ? esc(fecha(c.ultimoDato)) : 'ninguno'}</td></tr>`,
    )
    .join('');
  const sumaPrev = inf.cuentas.reduce((s, c) => s + c.saldoPrevisto, 0);
  const sumaFinal = inf.cuentas.reduce((s, c) => s + c.saldoFinal, 0);
  const sinCuenta = (p && Math.abs(sumaPrev - inf.saldoPrevistoCorte) >= 0.01) || Math.abs(sumaFinal - inf.saldoFinal) >= 0.01;
  return `<section>
    <h2>4 · Cuentas</h2>
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Cuenta</th><th class="num">Al empezar</th>
      ${p ? `<th class="num">Previsto al ${esc(fecha(inf.corte))}</th><th class="num">Real al ${esc(fecha(inf.corte))}</th><th class="num">Diferencia</th>` : ''}
      <th class="num">Al final (previsto)</th><th>Último saldo anotado</th></tr></thead>
      <tbody>${filas}</tbody>
      <tfoot><tr><th scope="row">Total</th><td class="num">${eur(inf.saldoInicio)}</td>
      ${p ? `<td class="num">${eur(inf.saldoPrevistoCorte)}</td><td class="num">${eur(inf.saldoCorte)}</td><td class="num ${clase(inf.diferencia)}">${conSigno(inf.diferencia)}</td>` : ''}
      <td class="num">${inf.tieneFuturo ? eur(inf.saldoFinal) : '—'}</td><td></td></tr></tfoot>
    </table></div>
    ${sinCuenta ? '<p class="pie-tabla">El total no es la suma de las filas porque hay previsiones sin cuenta asignada o de cuentas archivadas: cuentan en el total, no en ninguna fila.</p>' : ''}
  </section>`;
}

// ── Documento ─────────────────────────────────────────────────────────────────

export function informeHtml(inf: Informe): string {
  const titulo = `Informe · ${inf.proyecto} · ${fecha(inf.desde)} – ${fecha(inf.hasta)}`;
  const comprobaciones = inf.comprobaciones
    .map(
      (c) =>
        `<li class="${c.ok ? 'ok' : 'mal'}"><span aria-hidden="true">${c.ok ? '✓' : '✗'}</span> ${esc(c.texto)}${c.ok ? '' : ' <strong>No cuadra.</strong>'}</li>`,
    )
    .join('');
  const avisos = inf.avisos.map((a) => `<li>${esc(a)}</li>`).join('');
  const futuroTexto = inf.tieneFuturo
    ? `<div><span>Previsto al final</span><strong>${eur(inf.saldoFinal)}</strong><em>${esc(fecha(inf.hasta))}${inf.reservaImprevistos > 0 ? ` · apartados ${eur(inf.reservaImprevistos)} para imprevistos` : ''}</em></div>

       ${inf.minimo ? `<div class="${inf.minimo.saldo < 0 ? 'neg' : ''}"><span>Saldo mínimo previsto</span><strong>${eur(inf.minimo.saldo)}</strong><em>${esc(fecha(inf.minimo.fecha))}</em></div>` : ''}`
    : '';
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<style>
  :root { --tinta:#1b2330; --suave:#5b6577; --tenue:#8a94a6; --linea:#e3e7ee; --fondo:#ffffff; --zona:#f5f7fa; --pos:#0f7a52; --neg:#b4232c; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #eef1f5; color: var(--tinta); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .hoja { max-width: 900px; margin: 24px auto; background: var(--fondo); padding: 40px 44px; border-radius: 10px; box-shadow: 0 2px 18px rgba(20,30,50,.08); }
  .acciones { max-width: 900px; margin: 16px auto 0; display: flex; gap: 8px; justify-content: flex-end; padding: 0 16px; }
  .acciones button { font: inherit; padding: 8px 14px; border-radius: 8px; border: 1px solid #c9d1dd; background: #fff; cursor: pointer; }
  .acciones button.principal { background: #1b2330; color: #fff; border-color: #1b2330; }
  header { border-bottom: 2px solid var(--tinta); padding-bottom: 14px; margin-bottom: 22px; }
  header h1 { font-size: 24px; margin: 0 0 4px; letter-spacing: -.01em; }
  header p { margin: 0; color: var(--suave); }
  h2 { font-size: 17px; margin: 30px 0 8px; padding-top: 8px; border-top: 1px solid var(--linea); }
  h3 { font-size: 14px; margin: 20px 0 6px; }
  .intro, .pie-tabla { color: var(--suave); font-size: 12.5px; margin: 4px 0 12px; }
  .pie-tabla { margin-top: 6px; }
  .cifras { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin: 12px 0 16px; }
  .cifras div { background: var(--zona); border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; }
  .cifras span { font-size: 11.5px; color: var(--suave); text-transform: uppercase; letter-spacing: .04em; }
  .cifras strong { font-size: 20px; font-variant-numeric: tabular-nums; margin: 2px 0; }
  .cifras em { font-style: normal; font-size: 12px; color: var(--tenue); }
  .cifras .pos strong { color: var(--pos); } .cifras .neg strong { color: var(--neg); }
  table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  th, td { padding: 6px 8px; text-align: left; vertical-align: top; }
  thead th { font-size: 11.5px; color: var(--suave); text-transform: uppercase; letter-spacing: .03em; border-bottom: 1px solid var(--tinta); font-weight: 600; }
  tbody tr { border-bottom: 1px solid var(--linea); }
  tbody th { font-weight: 500; }
  tfoot th, tfoot td { border-top: 2px solid var(--tinta); font-weight: 700; }
  .num { text-align: right; white-space: nowrap; }
  .pos { color: var(--pos); } .neg { color: var(--neg); } .tenue { color: var(--tenue); } .fuerte { font-weight: 700; }
  .nota { display: block; font-size: 11.5px; color: var(--tenue); font-weight: 400; }
  .puente { max-width: 620px; }
  .puente tr.saldo th, .puente tr.saldo td { font-weight: 700; background: var(--zona); border-top: 1px solid var(--tinta); }
  .meses tr.previsto th, .meses tr.previsto td { color: #3d4757; background: #fafbfc; }
  .meses tr.en-curso { background: #fff8e8; }
  .meses td, .meses th { font-size: 12.5px; padding: 5px 6px; }
  .grafica { margin: 8px 0 4px; }
  .grafica svg { width: 100%; height: auto; display: block; }
  .grafica .eje { font-size: 11px; fill: var(--suave); }
  figcaption { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--suave); margin-top: 4px; }
  figcaption i { display: inline-block; width: 18px; height: 3px; vertical-align: middle; margin-right: 6px; }
  figcaption i.punteada { height: 0; border-top: 2px dotted; } figcaption i.discontinua { height: 0; border-top: 2px dashed; }
  figcaption i.anillo { width: 10px; height: 10px; border: 2px solid ${COLOR.hoy}; border-radius: 50%; }
  ul.comprobaciones { list-style: none; padding: 0; margin: 8px 0; }
  ul.comprobaciones li { padding: 3px 0; } ul.comprobaciones li.ok span { color: var(--pos); font-weight: 700; } ul.comprobaciones li.mal { color: var(--neg); }
  ul.avisos { margin: 8px 0; padding-left: 20px; color: #6b4e00; }
  footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid var(--linea); font-size: 11.5px; color: var(--tenue); }
  .tabla-ancha { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  @media (max-width: 640px) {
    .hoja { margin: 0; padding: 22px 16px; border-radius: 0; }
    th, td { padding: 5px 5px; font-size: 12px; }
    .cifras strong { font-size: 17px; }
    h2 { font-size: 16px; }
  }
  @media print {
    body { background: #fff; } .hoja { box-shadow: none; margin: 0; padding: 0; max-width: none; } .acciones { display: none; }
    h2 { break-after: avoid; } table, figure, .cifras { break-inside: avoid; } @page { margin: 16mm 14mm; }
  }
</style>
</head>
<body>
<div class="acciones"><button type="button" class="principal" onclick="window.print()">Imprimir o guardar como PDF</button></div>
<main class="hoja">
  <header>
    <h1>Informe financiero · ${esc(inf.proyecto)}</h1>
    <p>Del ${esc(fecha(inf.desde))} al ${esc(fecha(inf.hasta))} · ${inf.tienePasado && inf.tieneFuturo ? `saldo real hasta el ${esc(fecha(inf.corte))}, previsión desde entonces` : inf.tieneFuturo ? 'todo el periodo es previsión' : 'todo el periodo tiene saldo real'} · generado el ${esc(fecha(inf.generadoEl))}</p>
  </header>

  <section>
    <h2 style="border-top:0;margin-top:0">1 · Resumen: del saldo inicial al final</h2>
    <div class="cifras">
      <div><span>Saldo al empezar</span><strong>${eur(inf.saldoInicio)}</strong><em>real</em></div>
      ${inf.tienePasado ? `<div><span>Último saldo real</span><strong>${eur(inf.saldoCorte)}</strong><em>${esc(fecha(inf.corte))}</em></div><div class="${clase(inf.diferencia)}"><span>Frente a lo previsto</span><strong>${conSigno(inf.diferencia)}</strong><em>${inf.diferencia >= 0 ? 'mejor' : 'peor'} de lo previsto</em></div>` : ''}
      ${futuroTexto}
    </div>
    ${grafica(inf)}
    <h3>El puente de saldo</h3>
    <p class="intro">Cada línea suma a la anterior. Lo real es el saldo de tus cuentas; lo previsto, tus estimaciones, nóminas y préstamos. El último saldo real anotado cierra el pasado y abre la previsión.</p>
    ${puente(inf.puente)}
  </section>

  ${seccionPasado(inf)}

  <section>
    <h2>3 · Mes a mes</h2>
    ${tablaMeses(inf.meses)}
  </section>

  ${seccionCuentas(inf)}

  <section>
    <h2>5 · Comprobaciones</h2>
    <ul class="comprobaciones">${comprobaciones}</ul>
    ${avisos ? `<h3>A tener en cuenta</h3><ul class="avisos">${avisos}</ul>` : ''}
  </section>

  <footer>Generado con FinanceApp. Las cifras previstas son estimaciones: dependen de los gastos, nóminas y préstamos que tengas dados de alta.${inf.imprevistos && inf.imprevistos.meses > 0 && inf.tieneFuturo ? ` ${inf.contarImprevistos ? `La previsión aparta para imprevistos la media de lo marcado como imprevisto en ${inf.imprevistos.meses} meses (${eur(inf.imprevistos.mediaMensual)}/mes).` : `«Contar imprevistos» está apagado: la previsión no aparta nada para imprevistos (la media de lo marcado es ${eur(inf.imprevistos.mediaMensual)}/mes).`}` : ''}</footer>
</main>
</body>
</html>`;
}
