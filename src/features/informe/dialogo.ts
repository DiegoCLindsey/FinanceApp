// ── features/informe/dialogo ──────────────────────────────────────────────────
// Ventana «Crear informe»: elegir el periodo y abrir o descargar el informe.
//
// El informe se abre en una pestaña nueva como página autónoma (blob), que es
// lo que permite imprimirlo o guardarlo como PDF con el diálogo normal del
// navegador. Si el navegador bloquea la pestaña (algunas aplicaciones
// instaladas lo hacen), se descarga como fichero.

import { sumarDias, type ISODate } from '@/core/dates';
import { finDeMes, sumarMesesA } from '@/engine/mes';
import { contenedorModalLimpio, esc, onChange, onClick, toast } from '../accounting/dom';

export interface DialogoInformeDeps {
  /** Construye el HTML del informe del periodo. */
  construir: (desde: ISODate, hasta: ISODate) => string;
  hoy: ISODate;
  /** Nombre del proyecto, para el nombre del fichero. */
  proyecto: string;
  doc?: Document;
  win?: Pick<Window, 'open'>;
}

type Preset = 'alrededor' | 'ultimos12' | 'anio' | 'proximos12' | 'personalizado';

const recuerdo: { preset: Preset; desde?: ISODate; hasta?: ISODate } = { preset: 'alrededor' };

/** Periodo de cada opción. «Hoy» siempre cae dentro salvo en las personalizadas. */
export function periodoDe(preset: Preset, hoy: ISODate, desde?: ISODate, hasta?: ISODate): { desde: ISODate; hasta: ISODate } {
  const mes = hoy.slice(0, 7);
  switch (preset) {
    case 'ultimos12':
      return { desde: `${sumarMesesA(mes, -11)}-01`, hasta: hoy };
    case 'anio':
      return { desde: `${hoy.slice(0, 4)}-01-01`, hasta: `${hoy.slice(0, 4)}-12-31` };
    case 'proximos12':
      return { desde: sumarDias(hoy, 1), hasta: finDeMes(sumarMesesA(mes, 12)) };
    case 'personalizado':
      if (desde && hasta) return desde <= hasta ? { desde, hasta } : { desde: hasta, hasta: desde };
      // Sin fechas todavía: como la opción por defecto.
      return { desde: `${sumarMesesA(mes, -6)}-01`, hasta: finDeMes(sumarMesesA(mes, 6)) };
    default:
      return { desde: `${sumarMesesA(mes, -6)}-01`, hasta: finDeMes(sumarMesesA(mes, 6)) };
  }
}

const nombreFichero = (proyecto: string, desde: ISODate, hasta: ISODate) =>
  `informe-${
    proyecto
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'financeapp'
  }-${desde}-a-${hasta}.html`;

export function abrirCrearInforme(deps: DialogoInformeDeps): HTMLElement | null {
  const doc = deps.doc ?? document;
  const win = deps.win ?? window;
  const overlay = doc.getElementById('modal-overlay');
  const limpio = contenedorModalLimpio(doc);
  if (!overlay || !limpio) return null;
  const content: HTMLElement = limpio;

  function render(): void {
    const p = periodoDe(recuerdo.preset, deps.hoy, recuerdo.desde, recuerdo.hasta);
    const opcion = (valor: Preset, texto: string, ayuda: string) =>
      `<label class="inf-opcion${recuerdo.preset === valor ? ' activa' : ''}">
        <input type="radio" name="inf-periodo" value="${valor}"${recuerdo.preset === valor ? ' checked' : ''}/>
        <span><strong>${texto}</strong><em>${ayuda}</em></span>
      </label>`;
    content.innerHTML = `
      <div class="modal-title">Crear informe</div>
      <p class="text-sm" style="color:var(--text2);line-height:1.6;margin:0 0 14px">
        Un documento para leer con calma o imprimir: une lo que ha pasado en tus cuentas con lo que está previsto,
        cuadrado al céntimo, y compara lo que preveías con lo que pasó de verdad.
      </p>
      <fieldset class="inf-opciones">
        <legend class="form-label">Periodo</legend>
        ${opcion('alrededor', 'Seis meses atrás y seis adelante', 'El pasado real y la previsión, con hoy en medio')}
        ${opcion('ultimos12', 'Los últimos 12 meses', 'Solo pasado: lo previsto frente a lo real')}
        ${opcion('anio', `Todo ${deps.hoy.slice(0, 4)}`, 'Del 1 de enero al 31 de diciembre')}
        ${opcion('proximos12', 'Los próximos 12 meses', 'Solo previsión, desde mañana')}
        ${opcion('personalizado', 'Elegir fechas', 'Cualquier periodo, antes o después de hoy')}
      </fieldset>
      ${
        recuerdo.preset === 'personalizado'
          ? `<div class="grid-2 mt-8">
              <div class="form-group"><label class="form-label" for="inf-desde">Desde</label><input class="form-input" type="date" id="inf-desde" value="${esc(p.desde)}"/></div>
              <div class="form-group"><label class="form-label" for="inf-hasta">Hasta</label><input class="form-input" type="date" id="inf-hasta" value="${esc(p.hasta)}"/></div>
            </div>`
          : `<p class="text-sm mt-8" style="color:var(--text3)">Del ${esc(p.desde)} al ${esc(p.hasta)}</p>`
      }
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button type="button" class="btn-secondary" data-inf-descargar>Descargar</button>
        <button type="button" class="btn-primary" data-inf-ver>Ver informe</button>
      </div>`;
  }

  /** Construye el HTML; si falla, lo dice y devuelve null. */
  function generar(): { html: string; desde: ISODate; hasta: ISODate } | null {
    const p = periodoDe(recuerdo.preset, deps.hoy, recuerdo.desde, recuerdo.hasta);
    try {
      return { html: deps.construir(p.desde, p.hasta), ...p };
    } catch (e) {
      console.error('[informe] No se ha podido generar:', e);
      toast('No se ha podido generar el informe', 'err');
      return null;
    }
  }

  function descargar(r: { html: string; desde: ISODate; hasta: ISODate }): void {
    const url = URL.createObjectURL(new Blob([r.html], { type: 'text/html;charset=utf-8' }));
    const a = doc.createElement('a');
    a.href = url;
    a.download = nombreFichero(deps.proyecto, r.desde, r.hasta);
    doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  onChange(content, 'input[name="inf-periodo"]', (el) => {
    recuerdo.preset = (el as HTMLInputElement).value as Preset;
    if (recuerdo.preset === 'personalizado' && !recuerdo.desde) {
      const p = periodoDe('alrededor', deps.hoy);
      recuerdo.desde = p.desde;
      recuerdo.hasta = p.hasta;
    }
    render();
  });
  onChange(content, '#inf-desde, #inf-hasta', () => {
    recuerdo.desde = (content.querySelector('#inf-desde') as HTMLInputElement | null)?.value || recuerdo.desde;
    recuerdo.hasta = (content.querySelector('#inf-hasta') as HTMLInputElement | null)?.value || recuerdo.hasta;
  });
  onClick(content, '[data-inf-ver]', () => {
    const r = generar();
    if (!r) return;
    const url = URL.createObjectURL(new Blob([r.html], { type: 'text/html;charset=utf-8' }));
    const pestana = win.open(url, '_blank');
    if (!pestana) {
      descargar(r);
      toast('El navegador no ha dejado abrir una pestaña: el informe se ha descargado');
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  });
  onClick(content, '[data-inf-descargar]', () => {
    const r = generar();
    if (r) {
      descargar(r);
      toast('Informe descargado');
    }
  });

  render();
  overlay.classList.remove('hidden');
  return content;
}
