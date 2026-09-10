// Funciones puras de transactions-panel.ts: agrupar por concepto y conciliar
// un grupo de transferencias con el gasto real que cubre.
import { describe, it, expect } from 'vitest';
import { agruparPorConcepto, paginar, reconciliarGrupo } from '@/features/accounts/transactions-panel';
import type { Transaccion } from '@/state/schema';

const tx = (over: Partial<Transaccion> & { _id: string; fecha: string; importeCts: number; concepto: string }): Transaccion => ({
  cuentaId: 'default',
  tags: [],
  tipo: 'gasto',
  origen: 'manual',
  estimacionId: null,
  ...over,
});

describe('agruparPorConcepto', () => {
  it('agrupa por concepto exacto tras recortar espacios, y descarta los que no se repiten', () => {
    const movimientos = [
      tx({ _id: '1', fecha: '2026-05-01', importeCts: -1299, concepto: 'Netflix' }),
      tx({ _id: '2', fecha: '2026-06-01', importeCts: -1599, concepto: ' Netflix ' }),
      tx({ _id: '3', fecha: '2026-07-01', importeCts: -2000, concepto: 'Único' }),
    ];
    const grupos = agruparPorConcepto(movimientos);
    expect(grupos).toHaveLength(1);
    expect(grupos[0]).toMatchObject({ concepto: 'Netflix', total: -2898 });
    expect(grupos[0].movimientos.map((t) => t._id)).toEqual(['1', '2']);
  });

  it('estimacionComun es null si los movimientos del grupo no comparten la misma asignación', () => {
    const iguales = agruparPorConcepto([
      tx({ _id: '1', fecha: '2026-05-01', importeCts: -100, concepto: 'A', estimacionId: 'e1' }),
      tx({ _id: '2', fecha: '2026-06-01', importeCts: -100, concepto: 'A', estimacionId: 'e1' }),
    ]);
    expect(iguales[0].estimacionComun).toBe('e1');

    const distintos = agruparPorConcepto([
      tx({ _id: '1', fecha: '2026-05-01', importeCts: -100, concepto: 'B', estimacionId: 'e1' }),
      tx({ _id: '2', fecha: '2026-06-01', importeCts: -100, concepto: 'B', estimacionId: 'e2' }),
    ]);
    expect(distintos[0].estimacionComun).toBeNull();
  });

  it('tagsComunes es la unión ordenada de las etiquetas de todos los movimientos', () => {
    const grupos = agruparPorConcepto([
      tx({ _id: '1', fecha: '2026-05-01', importeCts: -100, concepto: 'A', tags: ['super'] }),
      tx({ _id: '2', fecha: '2026-06-01', importeCts: -100, concepto: 'A', tags: ['gasolina', 'super'] }),
    ]);
    expect(grupos[0].tagsComunes).toEqual(['gasolina', 'super']);
  });

  it('ordena por nº de repeticiones y, a igualdad, por concepto', () => {
    const grupos = agruparPorConcepto([
      tx({ _id: '1', fecha: '2026-05-01', importeCts: -1, concepto: 'Z' }),
      tx({ _id: '2', fecha: '2026-05-02', importeCts: -1, concepto: 'Z' }),
      tx({ _id: '3', fecha: '2026-05-01', importeCts: -1, concepto: 'A' }),
      tx({ _id: '4', fecha: '2026-05-02', importeCts: -1, concepto: 'A' }),
      tx({ _id: '5', fecha: '2026-05-03', importeCts: -1, concepto: 'A' }),
    ]);
    expect(grupos.map((g) => g.concepto)).toEqual(['A', 'Z']); // A tiene 3, Z tiene 2
  });
});

describe('reconciliarGrupo', () => {
  it('null si el grupo no tiene etiquetas asignadas', () => {
    const [grupo] = agruparPorConcepto([
      tx({ _id: '1', fecha: '2026-06-01', importeCts: -30000, concepto: 'Traspaso' }),
      tx({ _id: '2', fecha: '2026-07-01', importeCts: -30000, concepto: 'Traspaso' }),
    ]);
    expect(reconciliarGrupo(grupo, [])).toBeNull();
  });

  it('compara lo traspasado con el gasto real de otros movimientos que comparten etiqueta', () => {
    const traspaso1 = tx({ _id: '1', fecha: '2026-06-01', importeCts: -30000, concepto: 'Traspaso', tags: ['gasolina', 'super'] });
    const traspaso2 = tx({ _id: '2', fecha: '2026-07-01', importeCts: -30000, concepto: 'Traspaso', tags: ['gasolina', 'super'] });
    const gasolina = tx({ _id: '3', fecha: '2026-06-10', importeCts: -15000, concepto: 'Gasolinera', tags: ['gasolina'] });
    const super_ = tx({ _id: '4', fecha: '2026-06-15', importeCts: -10000, concepto: 'Super', tags: ['super'] });
    const sinRelacion = tx({ _id: '5', fecha: '2026-06-20', importeCts: -5000, concepto: 'Otra cosa', tags: ['ocio'] });

    const [grupo] = agruparPorConcepto([traspaso1, traspaso2]);
    const rec = reconciliarGrupo(grupo, [traspaso1, traspaso2, gasolina, super_, sinRelacion]);

    expect(rec).toEqual({
      tags: ['gasolina', 'super'],
      transferidoCts: 60000,
      gastadoCts: 25000,
      diferenciaCts: -35000,
    });
  });

  it('no cuenta los propios movimientos del grupo como "gasto en esas etiquetas"', () => {
    // Un traspaso mal etiquetado con su propia etiqueta no debe contarse dos veces.
    const traspaso = tx({ _id: '1', fecha: '2026-06-01', importeCts: -30000, concepto: 'Traspaso', tags: ['gasolina'] });
    const [grupo] = agruparPorConcepto([traspaso, { ...traspaso, _id: '2', fecha: '2026-07-01' }]);
    const rec = reconciliarGrupo(grupo, grupo.movimientos);
    expect(rec?.gastadoCts).toBe(0);
  });

  it('ignora ingresos y transferencias al sumar el gasto real de las etiquetas', () => {
    const traspaso1 = tx({ _id: '1', fecha: '2026-06-01', importeCts: -30000, concepto: 'Traspaso', tags: ['casa'] });
    const traspaso2 = tx({ _id: '2', fecha: '2026-07-01', importeCts: -30000, concepto: 'Traspaso', tags: ['casa'] });
    const ingreso = tx({ _id: '3', fecha: '2026-06-05', importeCts: 20000, concepto: 'Reembolso', tags: ['casa'], tipo: 'ingreso' });
    const otraTransferencia = tx({
      _id: '4',
      fecha: '2026-06-06',
      importeCts: -10000,
      concepto: 'Otro traspaso',
      tags: ['casa'],
      tipo: 'transferencia',
    });

    const [grupo] = agruparPorConcepto([traspaso1, traspaso2]);
    const rec = reconciliarGrupo(grupo, [traspaso1, traspaso2, ingreso, otraTransferencia]);
    expect(rec?.gastadoCts).toBe(0);
  });
});

describe('paginar', () => {
  const items = Array.from({ length: 120 }, (_, i) => i + 1);

  it('corta la página pedida y dice de dónde a dónde va', () => {
    const p = paginar(items, 2, 50);
    expect(p.pagina).toHaveLength(50);
    expect(p.pagina[0]).toBe(51);
    expect(p).toMatchObject({ actual: 2, paginas: 3, total: 120, desde: 51, hasta: 100 });
  });

  it('la última página puede ir corta', () => {
    const p = paginar(items, 3, 50);
    expect(p.pagina).toHaveLength(20);
    expect(p).toMatchObject({ desde: 101, hasta: 120 });
  });

  it('una página fuera de rango se acota, no deja la tabla vacía', () => {
    expect(paginar(items, 99, 50).actual).toBe(3);
    expect(paginar(items, 0, 50).actual).toBe(1);
    expect(paginar(items, -3, 50).pagina[0]).toBe(1);
  });

  it('porPagina 0 significa todos', () => {
    const p = paginar(items, 5, 0);
    expect(p.pagina).toHaveLength(120);
    expect(p).toMatchObject({ actual: 1, paginas: 1, desde: 1, hasta: 120 });
  });

  it('sin elementos no hay ni primera ni última', () => {
    expect(paginar([], 1, 50)).toMatchObject({ total: 0, paginas: 1, desde: 0, hasta: 0 });
  });
});
