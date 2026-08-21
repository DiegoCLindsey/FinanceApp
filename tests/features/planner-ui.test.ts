// @vitest-environment happy-dom
// Vista del gestor de objetivos: formularios, línea de eventos y escenarios.
import { describe, it, expect } from 'vitest';
import {
  AYUDA_MODO,
  MODO_SUGERIDO,
  capitalDerivado,
  formularioObjetivo,
  formularioVehiculo,
  leerObjetivo,
  leerVehiculo,
} from '@/features/planner/form';
import { formularioEvento, leerCampos, panelEventos, previsualizar } from '@/features/planner/eventos-ui';
import { panelEscenarios } from '@/features/planner/escenarios-ui';
import { panelObjetivos } from '@/features/planner/objetivos';
import { panelSimulacion } from '@/features/planner/simulacion';
import { plantillaPorId } from '@/planner/eventos';
import { analizarSensibilidad } from '@/planner/sensibilidad';
import { simular } from '@/planner/simulador';
import type { Plan, Vehiculo } from '@/planner/tipos';

const eu = (euros: number): number => Math.round(euros * 100);

const pintar = (html: string): HTMLElement => {
  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.replaceChildren(div);
  return div;
};

const VEH: Vehiculo = {
  _id: 'v1',
  nombre: 'Fondo indexado',
  rentabilidadRealAnual: 0.05,
  liquidez: 'MEDIA',
  fiscalidadRetirada: 0.19,
  riesgo: 'MEDIO',
};

const plan = (p: Partial<Plan> = {}): Plan => ({
  _id: 'p1',
  nombre: 'Base',
  fechaInicio: '2026-01',
  horizonteMeses: 120,
  pctDisfrute: 0.1,
  activo: true,
  perfil: { netoMensual: eu(3000), gastosFijosMensuales: eu(1000) },
  vehiculos: [VEH],
  objetivos: [
    {
      _id: 'o1',
      nombre: 'Coche',
      tipo: 'AHORRO_OBJETIVO',
      importeObjetivo: eu(10000),
      prioridad: 1,
      modoAsignacion: 'ABSORBE_TODO',
      vehiculoId: 'v1',
      saldoActual: 0,
      estado: 'PENDIENTE',
    },
  ],
  eventos: [],
  ...p,
});

// ── Formulario de objetivo ────────────────────────────────────────────────────

describe('formulario de objetivo', () => {
  it('en alta viene vacío y sin botón de borrar', () => {
    const r = pintar(formularioObjetivo(null, [VEH], 3));
    expect((r.querySelector('#ob-nombre') as HTMLInputElement).value).toBe('');
    expect((r.querySelector('#ob-prioridad') as HTMLInputElement).value).toBe('3');
    expect(r.querySelector('[data-ob-borrar]')).toBeNull();
  });

  it('en edición trae los valores y sí ofrece borrar', () => {
    const o = plan().objetivos[0];
    const r = pintar(formularioObjetivo(o, [VEH], 2));
    expect((r.querySelector('#ob-nombre') as HTMLInputElement).value).toBe('Coche');
    expect((r.querySelector('#ob-importe') as HTMLInputElement).value).toBe('10000.00');
    expect(r.querySelector('[data-ob-borrar]')).not.toBeNull();
  });

  it('avisa cuando no hay vehículos en vez de ofrecer un desplegable vacío', () => {
    const r = pintar(formularioObjetivo(null, [], 1));
    expect(r.textContent).toContain('crea uno primero');
  });

  it('lee lo escrito y convierte a céntimos', () => {
    const r = pintar(formularioObjetivo(null, [VEH], 1));
    (r.querySelector('#ob-nombre') as HTMLInputElement).value = 'Entrada piso';
    (r.querySelector('#ob-importe') as HTMLInputElement).value = '60000';
    (r.querySelector('#ob-saldo') as HTMLInputElement).value = '1500,50';

    const o = leerObjetivo(r, null, 1)!;
    expect(o.nombre).toBe('Entrada piso');
    expect(o.importeObjetivo).toBe(eu(60000));
    // Acepta coma decimal, que es como se escribe aquí
    expect(o.saldoActual).toBe(eu(1500.5));
  });

  it('sin nombre devuelve null: no se crea un objetivo anónimo', () => {
    const r = pintar(formularioObjetivo(null, [VEH], 1));
    expect(leerObjetivo(r, null, 1)).toBeNull();
    (r.querySelector('#ob-nombre') as HTMLInputElement).value = '   ';
    expect(leerObjetivo(r, null, 1)).toBeNull();
  });

  it('conserva el id al editar, para no duplicar el objetivo', () => {
    const anterior = plan().objetivos[0];
    const r = pintar(formularioObjetivo(anterior, [VEH], 1));
    expect(leerObjetivo(r, anterior, 1)!._id).toBe('o1');
  });

  it('genera un id nuevo en el alta', () => {
    const r = pintar(formularioObjetivo(null, [VEH], 1));
    (r.querySelector('#ob-nombre') as HTMLInputElement).value = 'X';
    expect(leerObjetivo(r, null, 1)!._id).toMatch(/^obj_/);
  });

  it('el importe fijo solo se guarda en modo FIJO', () => {
    const r = pintar(formularioObjetivo(null, [VEH], 1));
    (r.querySelector('#ob-nombre') as HTMLInputElement).value = 'Pensiones';
    (r.querySelector('#ob-modo') as HTMLSelectElement).value = 'FIJO';
    (r.querySelector('#ob-fijo') as HTMLInputElement).value = '200';
    expect(leerObjetivo(r, null, 1)!.importeFijoMensual).toBe(eu(200));

    (r.querySelector('#ob-modo') as HTMLSelectElement).value = 'ABSORBE_TODO';
    expect(leerObjetivo(r, null, 1)!.importeFijoMensual).toBeUndefined();
  });

  it('escapa el nombre al repintarlo', () => {
    const o = { ...plan().objetivos[0], nombre: '"><script>alert(1)</script>' };
    expect(formularioObjetivo(o, [VEH], 1)).not.toContain('<script>');
  });

  it('cada tipo sugiere el modo que le corresponde', () => {
    expect(MODO_SUGERIDO.AMORTIZAR_DEUDA).toBe('ABSORBE_TODO');
    expect(MODO_SUGERIDO.INVERSION_PERPETUA).toBe('ABSORBE_RESIDUAL');
    expect(MODO_SUGERIDO.APORTACION_FIJA).toBe('FIJO');
    expect(MODO_SUGERIDO.AHORRO_OBJETIVO).toBe('CUOTA_POR_FECHA');
  });

  it('cada modo tiene su explicación', () => {
    for (const texto of Object.values(AYUDA_MODO)) expect(texto.length).toBeGreaterThan(30);
  });
});

describe('independencia económica en el formulario', () => {
  const conRenta = pintar(formularioObjetivo(null, [VEH], 1));

  it('deriva el capital en vivo — el caso de referencia de la §9', () => {
    (conRenta.querySelector('#ob-renta') as HTMLInputElement).value = '2000';
    (conRenta.querySelector('#ob-swr') as HTMLInputElement).value = '4';
    (conRenta.querySelector('#ob-fiscal') as HTMLInputElement).value = '20';
    expect(capitalDerivado(conRenta)).toContain('750.000');
  });

  it('con parámetros imposibles lo dice en vez de mostrar infinito', () => {
    (conRenta.querySelector('#ob-swr') as HTMLInputElement).value = '0';
    expect(capitalDerivado(conRenta)).toContain('no calculable');
  });

  it('advierte del significado del SWR', () => {
    const html = formularioObjetivo(null, [VEH], 1);
    expect(html).toContain('30 años');
    expect(html).toContain('3–3,5');
  });

  it('al derivar, el importe queda a null: manda la derivación', () => {
    const r = pintar(formularioObjetivo(null, [VEH], 1));
    (r.querySelector('#ob-nombre') as HTMLInputElement).value = 'FI';
    (r.querySelector('#ob-tipo') as HTMLSelectElement).value = 'INVERSION_PERPETUA';
    (r.querySelector('input[name="ob-derivar"][value="renta"]') as HTMLInputElement).checked = true;
    (r.querySelector('#ob-renta') as HTMLInputElement).value = '2000';
    (r.querySelector('#ob-swr') as HTMLInputElement).value = '4';
    (r.querySelector('#ob-fiscal') as HTMLInputElement).value = '20';

    const o = leerObjetivo(r, null, 1)!;
    expect(o.importeObjetivo).toBeNull();
    expect(o.rentaDeseada!.rentaNetaMensual).toBe(eu(2000));
    expect(o.rentaDeseada!.tasaRetiroSeguro).toBeCloseTo(0.04, 4);
  });
});

// ── Formulario de vehículo ────────────────────────────────────────────────────

describe('formulario de vehículo', () => {
  it('explica por qué amortizar deuda cuenta como inversión', () => {
    const html = formularioVehiculo(null, [], []);
    expect(html).toContain('garantizado');
    expect(html).toContain('Amortizar deuda también rinde');
  });

  it('recuerda que la rentabilidad debe ser REAL', () => {
    expect(formularioVehiculo(null, [], [])).toContain('Nominal menos inflación');
  });

  it('lee porcentajes como tanto por uno', () => {
    const r = pintar(formularioVehiculo(null, [], []));
    (r.querySelector('#ve-nombre') as HTMLInputElement).value = 'Fondo';
    (r.querySelector('#ve-rent') as HTMLInputElement).value = '5';
    (r.querySelector('#ve-fiscal') as HTMLInputElement).value = '19';
    const v = leerVehiculo(r, null)!;
    expect(v.rentabilidadRealAnual).toBeCloseTo(0.05, 6);
    expect(v.fiscalidadRetirada).toBeCloseTo(0.19, 6);
  });

  it('un tope vacío es «sin tope», no cero', () => {
    const r = pintar(formularioVehiculo(null, [], []));
    (r.querySelector('#ve-nombre') as HTMLInputElement).value = 'Cuenta';
    expect(leerVehiculo(r, null)!.topeAportacionAnual).toBeNull();
    (r.querySelector('#ve-tope') as HTMLInputElement).value = '1500';
    expect(leerVehiculo(r, null)!.topeAportacionAnual).toBe(eu(1500));
  });

  it('sin nombre no crea nada', () => {
    expect(leerVehiculo(pintar(formularioVehiculo(null, [], [])), null)).toBeNull();
  });

  it('el préstamo solo se guarda si está marcado como deuda', () => {
    const r = pintar(formularioVehiculo(null, [], [{ _id: 'l1', nombre: 'Coche', tin: 9.8 }]));
    (r.querySelector('#ve-nombre') as HTMLInputElement).value = 'Amortizar';
    (r.querySelector('#ve-prestamo') as HTMLSelectElement).value = 'l1';
    expect(leerVehiculo(r, null)!.prestamoId).toBeNull();
    (r.querySelector('#ve-deuda') as HTMLInputElement).checked = true;
    expect(leerVehiculo(r, null)!.prestamoId).toBe('l1');
  });

  it('guardar desde el formulario quita la marca de «revisar rentabilidad»', () => {
    // El aviso solo tiene sentido mientras nadie haya pasado por aquí
    const migrado: Vehiculo = { ...VEH, revisarRentabilidad: true };
    const r = pintar(formularioVehiculo(migrado, [], []));
    expect(leerVehiculo(r, migrado)!.revisarRentabilidad).toBeUndefined();
  });
});

// ── Eventos ───────────────────────────────────────────────────────────────────

describe('línea temporal de eventos', () => {
  it('sin eventos explica para qué sirven', () => {
    const html = panelEventos(plan());
    expect(html).toContain('Todavía no hay eventos');
  });

  it('ofrece las plantillas de los casos frecuentes', () => {
    const html = panelEventos(plan());
    expect(html).toContain('Venta de vivienda');
    expect(html).toContain('Subida de sueldo');
  });

  it('ordena por fecha aunque se guarden desordenados', () => {
    const p = plan({
      eventos: [
        { _id: 'b', fecha: '2028-05', tipo: 'CAMBIO_INGRESOS', importe: eu(3500) },
        { _id: 'a', fecha: '2027-01', tipo: 'INYECCION_CAPITAL', importe: eu(5000) },
      ],
    });
    const html = panelEventos(p);
    expect(html.indexOf('2027-01')).toBeLessThan(html.indexOf('2028-05'));
  });

  it('marca los eventos que caen fuera del horizonte', () => {
    const p = plan({ horizonteMeses: 12, eventos: [{ _id: 'a', fecha: '2030-01', tipo: 'CAMBIO_INGRESOS', importe: eu(4000) }] });
    expect(panelEventos(p)).toContain('fuera del horizonte');
  });

  it('nombra el objetivo destino de una inyección dirigida', () => {
    const p = plan({ eventos: [{ _id: 'a', fecha: '2027-01', tipo: 'INYECCION_CAPITAL', importe: eu(5000), objetivoDestinoId: 'o1' }] });
    expect(panelEventos(p)).toContain('«Coche»');
  });
});

describe('formulario de evento', () => {
  const venta = plantillaPorId('venta-vivienda')!;

  it('pinta un campo por cada dato de la plantilla', () => {
    const r = pintar(formularioEvento(venta, null, plan(), {}));
    expect(r.querySelector('#ev-precio')).not.toBeNull();
    expect(r.querySelector('#ev-hipoteca')).not.toBeNull();
    expect(r.querySelector('#ev-gastos')).not.toBeNull();
  });

  it('calcula el importe con el desglose, no con el precio a secas', () => {
    const r = pintar(formularioEvento(venta, null, plan(), {}));
    (r.querySelector('#ev-precio') as HTMLInputElement).value = '300000';
    (r.querySelector('#ev-hipoteca') as HTMLInputElement).value = '180000';
    (r.querySelector('#ev-gastos') as HTMLInputElement).value = '20000';
    expect(previsualizar(venta, leerCampos(r, venta))).toContain('100.000');
  });

  it('rellena el valor actual en las plantillas de cambio', () => {
    const hijo = plantillaPorId('hijo')!;
    const r = pintar(formularioEvento(hijo, null, plan(), { actuales: eu(1000) }));
    expect((r.querySelector('#ev-actuales') as HTMLInputElement).value).toBe('1000.00');
  });

  it('solo las inyecciones preguntan a qué objetivo van', () => {
    expect(formularioEvento(venta, null, plan(), {})).toContain('ev-destino');
    expect(formularioEvento(plantillaPorId('subida-sueldo')!, null, plan(), {})).not.toContain('ev-destino');
  });

  it('los campos vacíos se leen como cero, sin NaN', () => {
    const r = pintar(formularioEvento(venta, null, plan(), {}));
    expect(leerCampos(r, venta)).toEqual({ precio: 0, hipoteca: 0, gastos: 0 });
  });
});

// ── Escenarios ────────────────────────────────────────────────────────────────

describe('pestaña de escenarios', () => {
  it('lista los planes y marca el activo', () => {
    const html = panelEscenarios([plan(), plan({ _id: 'p2', nombre: 'Optimista', activo: false })], 'p1', null);
    expect(html).toContain('Base');
    expect(html).toContain('Optimista');
    expect(html).toContain('activo');
  });

  it('con un solo plan no pinta comparativa', () => {
    expect(panelEscenarios([plan()], 'p1', null)).not.toContain('Comparativa');
  });

  it('con dos planes compara los hitos', () => {
    const otro = plan({ _id: 'p2', nombre: 'Optimista', activo: false, perfil: { netoMensual: eu(5000), gastosFijosMensuales: eu(1000) } });
    const html = panelEscenarios([plan(), otro], 'p1', null);
    expect(html).toContain('Comparativa');
    expect(html).toContain('Coche');
  });

  it('no deja borrar cuando solo queda un plan', () => {
    expect(panelEscenarios([plan()], 'p1', null)).not.toContain('data-pl-borrar-plan');
    expect(panelEscenarios([plan(), plan({ _id: 'p2' })], 'p1', null)).toContain('data-pl-borrar-plan');
  });

  it('la sensibilidad no se calcula sola: ofrece el botón', () => {
    const html = panelEscenarios([plan()], 'p1', null);
    expect(html).toContain('data-pl-sensibilidad');
    expect(html).toContain('solo cuando lo pides');
  });

  it('con la sensibilidad calculada muestra los tres ejes', () => {
    const html = panelEscenarios([plan()], 'p1', analizarSensibilidad(plan()));
    expect(html).toContain('Rentabilidad de los vehículos');
    expect(html).toContain('Porcentaje de disfrute');
    expect(html).toContain('Ingresos');
    expect(html).toContain('Plan actual');
  });

  it('escapa el nombre del plan', () => {
    expect(panelEscenarios([plan({ nombre: '<img src=x>' })], 'p1', null)).not.toContain('<img src=x>');
  });
});

// ── Paneles ya existentes, con las piezas nuevas ──────────────────────────────

describe('panel de objetivos', () => {
  it('sin objetivos explica qué es un objetivo', () => {
    expect(panelObjetivos(plan({ objetivos: [] }), simular(plan({ objetivos: [] })))).toContain('Todavía no hay objetivos');
  });

  it('las tarjetas son arrastrables y editables', () => {
    const p = plan();
    const html = panelObjetivos(p, simular(p));
    expect(html).toContain('draggable="true"');
    expect(html).toContain('data-pl-objetivo="o1"');
    expect(html).toContain('data-pl-editar-objetivo="o1"');
  });

  it('muestra lo que el objetivo pide este mes', () => {
    const p = plan();
    expect(panelObjetivos(p, simular(p))).toContain('Pide ahora');
  });
});

describe('tabla mes a mes', () => {
  it('pagina en vez de pintar cientos de filas', () => {
    const p = plan({ horizonteMeses: 200, objetivos: [{ ...plan().objetivos[0], importeObjetivo: eu(10000000) }] });
    const res = simular(p);
    const html = panelSimulacion(p, res, 0);
    expect(html).toContain('data-pl-pagina');
    expect(html).toContain('Meses 1–60');
  });

  it('la segunda página empieza donde acaba la primera', () => {
    const p = plan({ horizonteMeses: 200, objetivos: [{ ...plan().objetivos[0], importeObjetivo: eu(10000000) }] });
    expect(panelSimulacion(p, simular(p), 1)).toContain('Meses 61–120');
  });

  it('con pocos meses no hay navegación', () => {
    const p = plan({ horizonteMeses: 6 });
    expect(panelSimulacion(p, simular(p), 0)).not.toContain('data-pl-pagina');
  });
});
