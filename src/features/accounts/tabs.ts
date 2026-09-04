// ── features/accounts/tabs ────────────────────────────────────────────────────
// Barra de pestañas de "Cuentas y contabilidad". Cuentas y Contabilidad eran
// dos vistas separadas; se fusionan porque en la práctica ya dependían una de
// la otra: Contabilidad exigía tener Cuentas activa, y el histórico de saldos
// de Cuentas pasa por el ledger de Contabilidad desde F4. Dos rutas para lo
// mismo solo añadía un salto de navegación.

export type PestanaCuentas = 'cuentas' | 'movimientos' | 'importar' | 'cierre';

export const PESTANAS_CUENTAS: { id: PestanaCuentas; etiqueta: string }[] = [
  { id: 'cuentas', etiqueta: 'Cuentas' },
  { id: 'movimientos', etiqueta: 'Movimientos' },
  { id: 'importar', etiqueta: 'Importar CSV' },
  { id: 'cierre', etiqueta: 'Cierre y precisión' },
];

export function pestanasCuentasHtml(activa: PestanaCuentas): string {
  return `<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${PESTANAS_CUENTAS.map(
      (p) =>
        `<button class="btn-secondary btn-sm" data-cuentas-tab="${p.id}" style="${
          p.id === activa ? 'background:var(--accent);color:#04120c;border-color:var(--accent)' : ''
        }">${p.etiqueta}</button>`,
    ).join('')}
  </div>`;
}
