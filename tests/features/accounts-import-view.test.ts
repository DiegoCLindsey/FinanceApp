// @vitest-environment happy-dom
// Panel de importación de extractos CSV, ahora pestaña "Importar CSV" de la
// vista fusionada Cuentas y Contabilidad: previsualización, corrección del
// mapeo, duplicados y escritura en el ledger.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFeatureRegistry } from '@/app/feature-registry';
import { createAccountsFeature } from '@/features/accounts';
import { leerFichero } from '@/features/accounts/import-panel';
import { createLedger } from '@/accounting/ledger';
import { createTagService } from '@/accounting/tags';
import { createPrecisionAnalyzer } from '@/accounting/precision';
import { createAdjuster } from '@/accounting/adjust';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { createFlags } from '@/flags/service';

const HOY = new Date(2026, 6, 30);

const CSV = ['Fecha;Concepto;Importe;Saldo', '01/07/2026;COMPRA SUPERMERCADO;-45,20;1.954,80', '03/07/2026;NOMINA;1.800,00;3.754,80'].join(
  '\n',
);

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section"><button class="nav-btn" data-view="expenses"></button></li>
    </ul></nav>
    <div class="main-area"><main class="view-container">
      <div id="view-dashboard" class="view active"></div>
    </main></div>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

function entorno() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const ledger = createLedger(store);
  const flags = createFlags(store);
  const onDatosCambiados = vi.fn();

  const registry = createFeatureRegistry({ isEnabled: (id) => flags.isEnabled(id) });
  registry.register(
    createAccountsFeature({
      store,
      ledger,
      tags: createTagService(store),
      precision: createPrecisionAnalyzer(ledger),
      adjuster: createAdjuster(store),
      hoy: () => '2026-07-30',
      onDatosCambiados,
    }),
  );
  return { store, ledger, registry, onDatosCambiados };
}

const vista = () => document.getElementById('view-accounts') as HTMLElement;
const clic = (sel: string) => vista().querySelector<HTMLElement>(sel)?.click();

/** Monta la vista fusionada y va directamente a la pestaña de importación. */
function montarEnImportar(registry: ReturnType<typeof entorno>['registry']): void {
  registry.mount('accounts');
  (vista().querySelector('[data-cuentas-tab="importar"]') as HTMLElement).click();
}

/** Simula elegir un fichero: se inyecta el texto ya analizado por el panel. */
async function cargar(texto: string, nombre = 'extracto.csv') {
  const entrada = vista().querySelector<HTMLInputElement>('#imp-fichero') as HTMLInputElement;
  const fichero = new File([texto], nombre, { type: 'text/csv' });
  Object.defineProperty(entrada, 'files', { value: [fichero], configurable: true });
  entrada.dispatchEvent(new Event('change'));
  // La lectura es asíncrona (arrayBuffer): se deja correr la microcola.
  await new Promise((r) => setTimeout(r, 0));
}

describe('importación de extractos', () => {
  beforeEach(() => montarShell());

  it('ofrece importar sin desplegar nada hasta que se pide', () => {
    montarEnImportar(entorno().registry);
    expect(vista().innerHTML).toContain('data-imp-abrir');
    expect(vista().querySelector('#imp-fichero')).toBeNull();
  });

  it('al abrir con una sola cuenta la elige sola', () => {
    montarEnImportar(entorno().registry);
    clic('[data-imp-abrir]');
    const sel = vista().querySelector<HTMLSelectElement>('#imp-cuenta') as HTMLSelectElement;
    expect(sel.value).toBe('default');
  });

  it('previsualiza el extracto sin escribir nada todavía', async () => {
    const { ledger, registry } = entorno();
    montarEnImportar(registry);
    clic('[data-imp-abrir]');
    await cargar(CSV);

    const html = vista().innerHTML;
    expect(html).toContain('COMPRA SUPERMERCADO');
    expect(html).toContain('extracto.csv');
    expect(html).toContain('Importar 2 movimientos');
    // Nada se ha guardado aún.
    expect(ledger.transacciones()).toHaveLength(0);
  });

  it('no confunde la columna de saldo con la de importe', async () => {
    montarEnImportar(entorno().registry);
    clic('[data-imp-abrir]');
    await cargar(CSV);
    // Se comprueba el atributo, no `select.value`: happy-dom no refleja
    // `selected` en la propiedad al asignar innerHTML, así que `.value`
    // devuelve la primera opción aunque el HTML marque otra.
    const marcada = vista().querySelector('#imp-col-importe option[selected]') as HTMLOptionElement | null;
    expect(marcada?.value).toBe('2'); // Importe, no Saldo (índice 3)
  });

  it('importa con el signo correcto y marca el origen', async () => {
    const { ledger, registry, onDatosCambiados } = entorno();
    montarEnImportar(registry);
    clic('[data-imp-abrir]');
    await cargar(CSV);
    clic('[data-imp-confirmar]');

    const tx = ledger.transacciones();
    expect(tx).toHaveLength(2);
    expect(tx[0]).toMatchObject({ fecha: '2026-07-01', concepto: 'COMPRA SUPERMERCADO', importeCts: -4520, origen: 'importado' });
    expect(tx[1]).toMatchObject({ fecha: '2026-07-03', importeCts: 180000, tipo: 'ingreso' });
    expect(onDatosCambiados).toHaveBeenCalled();
  });

  it('el panel se cierra tras importar', async () => {
    montarEnImportar(entorno().registry);
    clic('[data-imp-abrir]');
    await cargar(CSV);
    clic('[data-imp-confirmar]');
    expect(vista().querySelector('#imp-fichero')).toBeNull();
    expect(vista().innerHTML).toContain('data-imp-abrir');
  });

  it('detecta lo ya importado y lo excluye por defecto', async () => {
    const { ledger, registry } = entorno();
    montarEnImportar(registry);

    clic('[data-imp-abrir]');
    await cargar(CSV);
    clic('[data-imp-confirmar]');
    expect(ledger.transacciones()).toHaveLength(2);

    // Se vuelve a subir el MISMO extracto.
    clic('[data-imp-abrir]');
    await cargar(CSV);
    expect(vista().innerHTML).toContain('Importar 0 movimientos');

    clic('[data-imp-confirmar]');
    expect(ledger.transacciones()).toHaveLength(2); // no se ha duplicado nada
  });

  it('pero permite forzar los repetidos', async () => {
    const { ledger, registry } = entorno();
    montarEnImportar(registry);
    clic('[data-imp-abrir]');
    await cargar(CSV);
    clic('[data-imp-confirmar]');

    clic('[data-imp-abrir]');
    await cargar(CSV);
    const check = vista().querySelector<HTMLInputElement>('#imp-duplicadas') as HTMLInputElement;
    check.checked = true;
    check.dispatchEvent(new Event('change', { bubbles: true }));
    clic('[data-imp-confirmar]');

    expect(ledger.transacciones()).toHaveLength(4);
  });

  it('las líneas con error se avisan y no bloquean al resto', async () => {
    const { ledger, registry } = entorno();
    montarEnImportar(registry);
    clic('[data-imp-abrir]');
    await cargar(['Fecha;Concepto;Importe', '01/07/2026;BUENA;-45,20', 'TOTALES;;-45,20'].join('\n'));

    expect(vista().innerHTML).toContain('no se puede importar');
    expect(vista().innerHTML).toContain('Importar 1 movimiento');

    clic('[data-imp-confirmar]');
    expect(ledger.transacciones()).toHaveLength(1);
    expect(ledger.transacciones()[0].concepto).toBe('BUENA');
  });

  it('corregir el mapeo a mano recalcula la previsualización', async () => {
    montarEnImportar(entorno().registry);
    clic('[data-imp-abrir]');
    await cargar(CSV);
    expect(vista().innerHTML).toContain('45,20');

    // Se fuerza el importe a la columna de saldo: deben cambiar las cifras.
    // `selectedIndex` en vez de `value` por lo mismo que arriba (las opciones
    // son -1, 0, 1, 2, 3 → la de valor "3" es la quinta).
    const sel = vista().querySelector<HTMLSelectElement>('#imp-col-importe') as HTMLSelectElement;
    sel.selectedIndex = 4;
    sel.dispatchEvent(new Event('change', { bubbles: true }));

    const html = vista().innerHTML;
    expect(html).toContain('954,80');
    expect(html).not.toContain('45,20');
  });

  it('sin cuenta de destino no deja importar', async () => {
    const { store, registry } = entorno();
    // Con dos cuentas no se elige sola, así que queda vacía.
    store.addItem('accounts', { ...store.get('accounts')[0], _id: 'otra', nombre: 'Ahorro', esCuentaPrincipal: false });
    montarEnImportar(registry);
    clic('[data-imp-abrir]');
    await cargar(CSV);

    const boton = vista().querySelector<HTMLButtonElement>('[data-imp-confirmar]') as HTMLButtonElement;
    expect(boton.disabled).toBe(true);
    expect(vista().innerHTML).toContain('Elige antes la cuenta de destino');
  });

  it('un CSV sin datos lo dice en vez de fallar en silencio', async () => {
    montarEnImportar(entorno().registry);
    clic('[data-imp-abrir]');
    await cargar('');
    expect(vista().innerHTML).toContain('ninguna línea de datos');
  });
});

describe('leerFichero', () => {
  it('lee UTF-8 tal cual', async () => {
    const texto = await leerFichero(new Blob(['Nómina;LUZ Y GÁS'], { type: 'text/csv' }));
    expect(texto).toBe('Nómina;LUZ Y GÁS');
  });

  it('reintenta en Latin-1 cuando UTF-8 sale con caracteres de reemplazo', async () => {
    // Media banca española exporta en ISO-8859-1: «Nómina» son los bytes
    // 4E F3 6D 69 6E 61, que en UTF-8 no son texto válido.
    const bytes = new Uint8Array([0x4e, 0xf3, 0x6d, 0x69, 0x6e, 0x61]);
    const texto = await leerFichero(new Blob([bytes]));
    expect(texto).toBe('Nómina');
  });
});
