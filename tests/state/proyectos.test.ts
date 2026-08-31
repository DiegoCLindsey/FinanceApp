import { describe, expect, it } from 'vitest';
import {
  PROYECTO_DEFECTO_ID,
  crearServicioProyectos,
  leerColeccionesDeProyecto,
  namespaceDeProyecto,
  remapearIds,
} from '@/state/proyectos';
import { createMemoryAdapter } from '@/state/storage/local';

/** `Storage` real respaldado en memoria, para no depender de `localStorage` en los tests. */
function storageDeMemoria(): Storage {
  const mem = createMemoryAdapter();
  return {
    getItem: (k) => (mem.get(k) as string | null) ?? null,
    setItem: (k, v) => mem.set(k, v),
    removeItem: (k) => mem.remove(k),
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage;
}

describe('namespaceDeProyecto', () => {
  it('el proyecto default usa el espacio de nombres de siempre, sin segmento', () => {
    expect(namespaceDeProyecto(PROYECTO_DEFECTO_ID)).toBe('financeapp_');
  });
  it('cualquier otro proyecto lleva su id en el espacio de nombres', () => {
    expect(namespaceDeProyecto('abc123')).toBe('financeapp_p_abc123_');
  });
});

describe('listar', () => {
  it('sin nada guardado, ya aparece "Mis finanzas" como default', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const lista = svc.listar();
    expect(lista).toHaveLength(1);
    expect(lista[0]._id).toBe(PROYECTO_DEFECTO_ID);
    expect(lista[0].nombre).toBe('Mis finanzas');
  });

  it('si el registro existe pero perdió la entrada default, se repone sin borrar el resto', () => {
    const storage = storageDeMemoria();
    storage.setItem('financeapp_meta_proyectos', JSON.stringify([{ _id: 'otro', nombre: 'Otro', creadoEn: 1, actualizadoEn: 1 }]));
    const svc = crearServicioProyectos(storage);
    const lista = svc.listar();
    expect(lista.map((p) => p._id).sort()).toEqual(['default', 'otro']);
  });
});

describe('activo / establecerActivo', () => {
  it('sin nada guardado, el activo es default', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    expect(svc.activo()).toBe(PROYECTO_DEFECTO_ID);
  });

  it('cambia y se mantiene', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const p = svc.crear('Negocio');
    svc.establecerActivo(p._id);
    expect(svc.activo()).toBe(p._id);
  });
});

describe('crear / renombrar', () => {
  it('crea con id único y lo añade a la lista', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const a = svc.crear('Casa');
    const b = svc.crear('Negocio');
    expect(a._id).not.toBe(b._id);
    expect(
      svc
        .listar()
        .map((p) => p.nombre)
        .sort(),
    ).toEqual(['Casa', 'Mis finanzas', 'Negocio']);
  });

  it('un nombre en blanco no se acepta, cae a un nombre por defecto', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const p = svc.crear('   ');
    expect(p.nombre).toBe('Proyecto sin nombre');
  });

  it('renombrar cambia el nombre sin tocar el id', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const p = svc.crear('Casa');
    svc.renombrar(p._id, 'Casa nueva');
    expect(svc.listar().find((x) => x._id === p._id)?.nombre).toBe('Casa nueva');
  });

  it('renombrar con blanco no hace nada', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const p = svc.crear('Casa');
    svc.renombrar(p._id, '   ');
    expect(svc.listar().find((x) => x._id === p._id)?.nombre).toBe('Casa');
  });

  it('renombrar el proyecto default funciona igual que cualquier otro', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    svc.renombrar(PROYECTO_DEFECTO_ID, 'Personal');
    expect(svc.listar().find((x) => x._id === PROYECTO_DEFECTO_ID)?.nombre).toBe('Personal');
  });
});

describe('duplicar', () => {
  it('copia el estado a un espacio de nombres nuevo e independiente', () => {
    const storage = storageDeMemoria();
    const svc = crearServicioProyectos(storage);
    storage.setItem('financeapp_state_expenses', JSON.stringify([{ _id: 'e1', concepto: 'Alquiler' }]));
    storage.setItem('financeapp_state__schemaVersion', JSON.stringify(8));

    const copia = svc.duplicar(PROYECTO_DEFECTO_ID, 'Copia de pruebas');
    expect(copia._id).not.toBe(PROYECTO_DEFECTO_ID);
    expect(copia.nombre).toBe('Copia de pruebas');

    const ns = namespaceDeProyecto(copia._id);
    expect(JSON.parse(storage.getItem(`${ns}state_expenses`)!)).toEqual([{ _id: 'e1', concepto: 'Alquiler' }]);
    expect(JSON.parse(storage.getItem(`${ns}state__schemaVersion`)!)).toBe(8);

    // El original sigue intacto y es independiente: tocar la copia no lo toca a él.
    storage.setItem(`${ns}state_expenses`, JSON.stringify([]));
    expect(JSON.parse(storage.getItem('financeapp_state_expenses')!)).toEqual([{ _id: 'e1', concepto: 'Alquiler' }]);
  });

  it('duplicar el proyecto default NO arrastra el registro de proyectos ni otros proyectos', () => {
    const storage = storageDeMemoria();
    const svc = crearServicioProyectos(storage);
    svc.crear('Otro');
    storage.setItem('financeapp_state_expenses', JSON.stringify([{ _id: 'e1' }]));

    const copia = svc.duplicar(PROYECTO_DEFECTO_ID);
    const ns = namespaceDeProyecto(copia._id);
    // Nada de meta ni de "otro" proyecto se coló en el espacio de nombres nuevo.
    expect(storage.getItem(`${ns}meta_proyectos`)).toBeNull();
    expect(svc.listar().map((p) => p.nombre)).toContain('Mis finanzas (copia)');
  });

  it('un proyecto sin ese id da error', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    expect(() => svc.duplicar('no-existe')).toThrow();
  });
});

describe('eliminar', () => {
  it('borra el proyecto y su estado', () => {
    const storage = storageDeMemoria();
    const svc = crearServicioProyectos(storage);
    const p = svc.crear('Temporal');
    const ns = namespaceDeProyecto(p._id);
    storage.setItem(`${ns}state_expenses`, JSON.stringify([{ _id: 'x' }]));

    svc.eliminar(p._id);

    expect(svc.listar().some((x) => x._id === p._id)).toBe(false);
    expect(storage.getItem(`${ns}state_expenses`)).toBeNull();
  });

  it('no se puede eliminar el proyecto default', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    expect(() => svc.eliminar(PROYECTO_DEFECTO_ID)).toThrow();
  });

  it('no se puede eliminar el proyecto activo', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const p = svc.crear('Temporal');
    svc.establecerActivo(p._id);
    expect(() => svc.eliminar(p._id)).toThrow();
  });

  it('eliminar uno no toca el estado de los demás', () => {
    const storage = storageDeMemoria();
    const svc = crearServicioProyectos(storage);
    const a = svc.crear('A');
    const b = svc.crear('B');
    storage.setItem(`${namespaceDeProyecto(a._id)}state_expenses`, JSON.stringify([{ _id: 'a1' }]));
    storage.setItem(`${namespaceDeProyecto(b._id)}state_expenses`, JSON.stringify([{ _id: 'b1' }]));

    svc.eliminar(a._id);

    expect(storage.getItem(`${namespaceDeProyecto(b._id)}state_expenses`)).not.toBeNull();
  });
});

describe('fusionarRemotos', () => {
  it('añade un proyecto remoto que no existe localmente', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const remoto = { _id: 'r1', nombre: 'Del móvil', creadoEn: 1, actualizadoEn: 1 };
    const fusionada = svc.fusionarRemotos([remoto]);
    expect(fusionada.map((p) => p._id).sort()).toEqual(['default', 'r1']);
    expect(svc.listar().find((p) => p._id === 'r1')?.nombre).toBe('Del móvil');
  });

  it('no borra un proyecto local que no está en la lista remota', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    const local = svc.crear('Solo en este dispositivo');
    svc.fusionarRemotos([]);
    expect(svc.listar().some((p) => p._id === local._id)).toBe(true);
  });

  it('un conflicto de nombre lo gana el más reciente por actualizadoEn', () => {
    const storage = storageDeMemoria();
    const svc = crearServicioProyectos(storage);
    const p = svc.crear('Nombre viejo');
    const actual = storage.getItem('financeapp_meta_proyectos');
    const antiguo = JSON.parse(actual!).find((x: { _id: string }) => x._id === p._id);

    // La copia remota es más reciente: gana su nombre.
    svc.fusionarRemotos([{ ...antiguo, nombre: 'Nombre nuevo desde otro dispositivo', actualizadoEn: antiguo.actualizadoEn + 1000 }]);
    expect(svc.listar().find((x) => x._id === p._id)?.nombre).toBe('Nombre nuevo desde otro dispositivo');

    // Una copia remota más VIEJA no pisa el nombre local.
    svc.fusionarRemotos([{ ...antiguo, nombre: 'Nombre desfasado', actualizadoEn: antiguo.actualizadoEn - 1000 }]);
    expect(svc.listar().find((x) => x._id === p._id)?.nombre).toBe('Nombre nuevo desde otro dispositivo');
  });

  it('ignora entradas remotas sin id válido, sin reventar', () => {
    const svc = crearServicioProyectos(storageDeMemoria());
    expect(() => svc.fusionarRemotos([null as never, {} as never, { _id: 123 } as never])).not.toThrow();
    expect(svc.listar()).toHaveLength(1); // solo el default
  });
});

describe('leerColeccionesDeProyecto', () => {
  it('lee colecciones de otro proyecto sin activarlo', () => {
    const storage = storageDeMemoria();
    const svc = crearServicioProyectos(storage);
    const otro = svc.crear('Otro');
    storage.setItem(`${namespaceDeProyecto(otro._id)}state_expenses`, JSON.stringify([{ _id: 'e1', concepto: 'Luz' }]));
    storage.setItem(`${namespaceDeProyecto(otro._id)}state_accounts`, JSON.stringify([{ _id: 'c1', nombre: 'Cuenta' }]));

    const leidas = leerColeccionesDeProyecto(storage, otro._id, ['expenses', 'accounts', 'loans']);
    expect(leidas.expenses).toEqual([{ _id: 'e1', concepto: 'Luz' }]);
    expect(leidas.accounts).toEqual([{ _id: 'c1', nombre: 'Cuenta' }]);
    expect(leidas.loans).toEqual([]); // colección sin datos en el origen: vacía, no falla
  });
});

describe('remapearIds', () => {
  it('da un id nuevo a cada elemento y actualiza referencias cruzadas', () => {
    const colecciones = {
      accounts: [{ _id: 'c1', nombre: 'Cuenta' }],
      expenses: [{ _id: 'e1', concepto: 'Alquiler', cuenta: 'c1', escenarioIds: ['s1'] }],
    };
    const out = remapearIds(colecciones);

    const cuentaNueva = (out.accounts[0] as { _id: string })._id;
    const gastoNuevo = out.expenses[0] as { _id: string; cuenta: string; escenarioIds: string[] };
    expect(cuentaNueva).not.toBe('c1');
    expect(gastoNuevo._id).not.toBe('e1');
    expect(gastoNuevo.cuenta).toBe(cuentaNueva); // la referencia cruzada sigue apuntando bien
    expect(gastoNuevo.escenarioIds).toEqual(['s1']); // s1 no se importó, así que no hay id nuevo que ponerle
  });

  it('dos elementos que comparten el mismo id antiguo comparten el mismo id nuevo', () => {
    const colecciones = {
      accounts: [{ _id: 'c1', nombre: 'Cuenta' }],
      expenses: [
        { _id: 'e1', cuenta: 'c1' },
        { _id: 'e2', cuenta: 'c1' },
      ],
    };
    const out = remapearIds(colecciones);
    const cuentaNueva = (out.accounts[0] as { _id: string })._id;
    expect((out.expenses[0] as { cuenta: string }).cuenta).toBe(cuentaNueva);
    expect((out.expenses[1] as { cuenta: string }).cuenta).toBe(cuentaNueva);
  });

  it('un texto libre que por casualidad coincidiera con un id no se toca si no es exactamente igual', () => {
    const colecciones = { accounts: [{ _id: 'c1', nombre: 'La cuenta c1 del banco' }] };
    const out = remapearIds(colecciones);
    expect((out.accounts[0] as { nombre: string }).nombre).toBe('La cuenta c1 del banco');
  });

  it('no revienta con colecciones vacías', () => {
    expect(remapearIds({ expenses: [] })).toEqual({ expenses: [] });
  });
});
