// ── features/accounting/import-panel ──────────────────────────────────────────
// Importación de extractos bancarios en CSV.
//
// El análisis vive en `@/accounting/importar-csv` (puro y con tests); aquí solo
// hay lectura del fichero, presentación y cableado.
//
// Tres decisiones de producto:
//
//  · Se enseña SIEMPRE una previsualización antes de escribir nada. Importar a
//    ciegas un extracto mal interpretado ensucia la contabilidad con decenas de
//    movimientos que luego hay que borrar a mano.
//  · Los duplicados se marcan y se excluyen POR DEFECTO, pero se pueden
//    incluir: dos compras idénticas el mismo día en el mismo sitio existen.
//  · Las filas con error no se importan nunca, pero no impiden importar el
//    resto: un extracto con una línea de totales al final no debe bloquear las
//    doscientas buenas.

import { formatEUR, fromCents } from '@/core/money';
import type { ISODate } from '@/core/dates';
import type { Ledger } from '@/accounting/ledger';
import { analizarCsv, prepararFilas, resumir, type AnalisisCsv, type FilaImportada, type Mapeo } from '@/accounting/importar-csv';
import type { Account } from '@/state/schema';
import { esc, eurColor, onChange, onClick, toast } from '../accounting/dom';

export interface ImportPanelDeps {
  ledger: Ledger;
  accounts: () => Account[];
  onDatosCambiados: () => void;
}

export interface EstadoImport {
  abierto: boolean;
  nombreFichero: string;
  analisis: AnalisisCsv | null;
  mapeo: Mapeo | null;
  filas: FilaImportada[];
  cuentaId: string;
  incluirDuplicadas: boolean;
  error: string;
}

export function estadoImportInicial(): EstadoImport {
  return {
    abierto: false,
    nombreFichero: '',
    analisis: null,
    mapeo: null,
    filas: [],
    cuentaId: '',
    incluirDuplicadas: false,
    error: '',
  };
}

const ROLES: { clave: keyof Mapeo; etiqueta: string }[] = [
  { clave: 'fecha', etiqueta: 'Fecha' },
  { clave: 'concepto', etiqueta: 'Concepto' },
  { clave: 'importe', etiqueta: 'Importe (con signo)' },
  { clave: 'debe', etiqueta: 'Debe (salidas)' },
  { clave: 'haber', etiqueta: 'Haber (entradas)' },
];

/** Recalcula las filas contra lo que ya hay en el ledger de esa cuenta. */
export function recalcular(deps: ImportPanelDeps, estado: EstadoImport): void {
  if (!estado.analisis || !estado.mapeo) {
    estado.filas = [];
    return;
  }
  const existentes = deps.ledger
    .transacciones(estado.cuentaId ? { cuentaId: estado.cuentaId } : {})
    .map((t) => ({ fecha: t.fecha, importeCts: t.importeCts, concepto: t.concepto }));
  estado.filas = prepararFilas(estado.analisis, estado.mapeo, existentes);
}

export function renderImportPanel(deps: ImportPanelDeps, estado: EstadoImport): string {
  const cuentas = deps.accounts().filter((a) => a.activo);

  if (!estado.abierto) {
    return `
      <div class="card">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <div>
            <div class="card-title" style="margin:0">Importar extracto</div>
            <div class="text-sm mt-4" style="color:var(--text3)">
              Sube el CSV que descargas del banco en vez de teclear los movimientos.
            </div>
          </div>
          <button class="btn-secondary btn-sm" data-imp-abrir>Importar CSV</button>
        </div>
      </div>`;
  }

  const opcionesCuenta = cuentas
    .map((a) => `<option value="${esc(a._id)}"${a._id === estado.cuentaId ? ' selected' : ''}>${esc(a.nombre)}</option>`)
    .join('');

  return `
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${estado.error ? `<div class="alert-card alert-danger mb-12"><div class="alert-body">${esc(estado.error)}</div></div>` : ''}

      <div class="form-row mb-12">
        <div class="form-group" style="flex:1;min-width:190px">
          <label class="form-label" for="imp-cuenta">Cuenta de destino</label>
          <select class="form-select" id="imp-cuenta">
            <option value="">— elige una cuenta —</option>
            ${opcionesCuenta}
          </select>
        </div>
        <div class="form-group" style="flex:1;min-width:190px">
          <label class="form-label" for="imp-fichero">Fichero CSV</label>
          <input class="form-input" type="file" id="imp-fichero" accept=".csv,.txt,text/csv" />
        </div>
      </div>

      ${estado.analisis && estado.mapeo ? bloqueAnalisis(estado, estado.analisis, estado.mapeo) : ayuda()}
    </div>`;
}

function ayuda(): string {
  return `
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`;
}

function bloqueAnalisis(estado: EstadoImport, analisis: AnalisisCsv, mapeo: Mapeo): string {
  const resumen = resumir(estado.filas, estado.incluirDuplicadas);
  const opcionesColumna = (seleccionada: number) =>
    `<option value="-1"${seleccionada < 0 ? ' selected' : ''}>— ninguna —</option>` +
    analisis.cabeceras
      .map((c, i) => `<option value="${i}"${i === seleccionada ? ' selected' : ''}>${esc(c || `Columna ${i + 1}`)}</option>`)
      .join('');

  const conError = estado.filas.filter((f) => f.errores.length > 0);
  const muestra = estado.filas.slice(0, 12);

  return `
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${esc(estado.nombreFichero)}</strong> · ${analisis.filas.length} línea${analisis.filas.length !== 1 ? 's' : ''}
      · separador <code>${esc(analisis.separador === '\t' ? 'tabulador' : analisis.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${ROLES.map(
        (r) => `<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${esc(r.etiqueta)}</label>
          <select class="form-select" id="imp-col-${r.clave}" data-imp-col="${r.clave}">${opcionesColumna(mapeo[r.clave])}</select>
        </div>`,
      ).join('')}
    </div>
    <div class="text-sm mb-12" style="color:var(--text3)">
      Usa <em>Importe</em> si tu banco da una sola columna con signo, o <em>Debe</em> y <em>Haber</em> si las separa.
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px">
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Se importarán</div>
        <div class="stat-value" style="font-size:1.15rem">${resumen.importables}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Neto</div>
        <div class="stat-value" style="font-size:1.15rem">${eurColor(fromCents(resumen.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${resumen.desde ? `${esc(resumen.desde)} → ${esc(resumen.hasta ?? '')}` : '—'}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Repetidos</div>
        <div class="stat-value" style="font-size:1.15rem;color:${resumen.duplicadas > 0 ? 'var(--yellow)' : 'var(--text)'}">${resumen.duplicadas}</div>
      </div>
    </div>

    ${
      resumen.duplicadas > 0
        ? `<label class="flex items-center gap-8 mb-12" style="font-size:13px;cursor:pointer">
             <input type="checkbox" id="imp-duplicadas"${estado.incluirDuplicadas ? ' checked' : ''} />
             Importar también los ${resumen.duplicadas} repetido${resumen.duplicadas !== 1 ? 's' : ''}
             <span style="color:var(--text3);font-size:12px">(ya hay un movimiento igual en fecha, importe y concepto)</span>
           </label>`
        : ''
    }

    ${
      conError.length > 0
        ? `<div class="alert-card alert-warning mb-12">
             <div class="alert-icon">⚠️</div>
             <div class="alert-body">
               <div class="alert-title">${conError.length} línea${conError.length !== 1 ? 's' : ''} no se puede${conError.length !== 1 ? 'n' : ''} importar</div>
               <div class="alert-sub">${conError
                 .slice(0, 4)
                 .map((f) => `línea ${f.linea}: ${esc(f.errores[0])}`)
                 .join(' · ')}${conError.length > 4 ? ' …' : ''}</div>
             </div>
           </div>`
        : ''
    }

    <div class="card-title mb-8">Previsualización</div>
    <div class="table-wrap mb-12">
      <table style="min-width:420px">
        <thead><tr>
          <th style="cursor:default">Fecha</th>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Importe</th>
          <th style="cursor:default">Estado</th>
        </tr></thead>
        <tbody>
          ${muestra
            .map((f) => {
              const mal = f.errores.length > 0;
              const estadoTxt = mal ? f.errores[0] : f.duplicada ? 'repetido' : 'se importa';
              const color = mal ? 'var(--red)' : f.duplicada ? 'var(--yellow)' : 'var(--accent)';
              return `<tr style="${mal ? 'opacity:0.55' : ''}">
                <td style="font-family:var(--font-mono);font-size:12px">${esc(f.fecha ?? '—')}</td>
                <td style="font-size:12px">${esc(f.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${f.importeCts === null ? '—' : esc(formatEUR(fromCents(f.importeCts)))}</td>
                <td style="font-size:11px;color:${color}">${esc(estadoTxt)}</td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
    ${estado.filas.length > muestra.length ? `<div class="text-sm mb-12" style="color:var(--text3)">…y ${estado.filas.length - muestra.length} más.</div>` : ''}

    <div class="flex gap-8" style="justify-content:flex-end;flex-wrap:wrap">
      <button class="btn-secondary" data-imp-cerrar>Cancelar</button>
      <button class="btn-primary" data-imp-confirmar${resumen.importables === 0 || !estado.cuentaId ? ' disabled' : ''}>
        Importar ${resumen.importables} movimiento${resumen.importables !== 1 ? 's' : ''}
      </button>
    </div>
    ${!estado.cuentaId ? '<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>' : ''}`;
}

export function wireImportPanel(raiz: HTMLElement, deps: ImportPanelDeps, estado: EstadoImport, refrescar: () => void): void {
  onClick(raiz, '[data-imp-abrir]', () => {
    const cuentas = deps.accounts().filter((a) => a.activo);
    Object.assign(estado, estadoImportInicial(), {
      abierto: true,
      // Con una sola cuenta no tiene sentido preguntar.
      cuentaId: cuentas.length === 1 ? cuentas[0]._id : '',
    });
    refrescar();
  });

  onClick(raiz, '[data-imp-cerrar]', () => {
    Object.assign(estado, estadoImportInicial());
    refrescar();
  });

  onChange(raiz, '#imp-cuenta', (el) => {
    estado.cuentaId = (el as HTMLSelectElement).value;
    recalcular(deps, estado);
    refrescar();
  });

  onChange(raiz, '#imp-duplicadas', (el) => {
    estado.incluirDuplicadas = (el as HTMLInputElement).checked;
    refrescar();
  });

  onChange(raiz, '[data-imp-col]', (el) => {
    const sel = el as HTMLSelectElement;
    const rol = sel.dataset.impCol as keyof Mapeo;
    if (!estado.mapeo) return;
    estado.mapeo[rol] = Number(sel.value);
    recalcular(deps, estado);
    refrescar();
  });

  const entrada = raiz.querySelector<HTMLInputElement>('#imp-fichero');
  entrada?.addEventListener('change', () => {
    const fichero = entrada.files?.[0];
    if (!fichero) return;
    leerFichero(fichero)
      .then((texto) => {
        const analisis = analizarCsv(texto);
        estado.nombreFichero = fichero.name;
        estado.error = analisis.filas.length === 0 ? 'El fichero no tiene ninguna línea de datos reconocible.' : '';
        estado.analisis = analisis;
        estado.mapeo = { ...analisis.mapeo };
        recalcular(deps, estado);
        refrescar();
      })
      .catch((err: Error) => {
        estado.error = `No se ha podido leer el fichero: ${err.message}`;
        refrescar();
      });
  });

  onClick(raiz, '[data-imp-confirmar]', () => {
    if (!estado.cuentaId) return;
    const aImportar = estado.filas.filter((f) => f.errores.length === 0 && (estado.incluirDuplicadas || !f.duplicada));
    if (aImportar.length === 0) return;

    for (const f of aImportar) {
      deps.ledger.registrar({
        fecha: f.fecha as ISODate,
        cuentaId: estado.cuentaId,
        // El ledger espera euros y decide el signo por el tipo; aquí el signo ya
        // viene del extracto, así que se manda el valor absoluto y el tipo.
        importe: Math.abs(fromCents(f.importeCts as number)),
        tipo: (f.importeCts as number) < 0 ? 'gasto' : 'ingreso',
        concepto: f.concepto,
        origen: 'importado',
      });
    }

    toast(`${aImportar.length} movimiento${aImportar.length !== 1 ? 's' : ''} importado${aImportar.length !== 1 ? 's' : ''}`);
    Object.assign(estado, estadoImportInicial());
    deps.onDatosCambiados();
    refrescar();
  });
}

/**
 * Lee el fichero como texto.
 *
 * Se intenta UTF-8 y, si el resultado trae caracteres de reemplazo (el rombo
 * con la interrogación), se reintenta en ISO-8859-1: media banca española
 * exporta en Latin-1 y con UTF-8 salen «NÃ³mina» y «LUZ Y GÃ S».
 */
export function leerFichero(fichero: Blob): Promise<string> {
  return fichero.arrayBuffer().then((buffer) => {
    const utf8 = new TextDecoder('utf-8').decode(buffer);
    if (!utf8.includes('�')) return utf8;
    try {
      return new TextDecoder('iso-8859-1').decode(buffer);
    } catch {
      return utf8;
    }
  });
}
