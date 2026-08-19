// @vitest-environment happy-dom
// Panel de salud financiera del dashboard (1.7 — 9/9, en curso).
import { describe, it, expect } from 'vitest';
import { calcSaludFinanciera, type SaludFinanciera } from '@/core/health';
import { formularioUmbrales, leerUmbrales, panelSalud, pct, UMBRALES_RECOMENDADOS } from '@/features/dashboard/salud';

const CONFIG = {
  saludUmbralAhorroVerde: 20,
  saludUmbralAhorroAmarillo: 10,
  saludUmbralDTIVerde: 30,
  saludUmbralDTIAmarillo: 40,
  saludRegla: [50, 30, 20],
  saludExcluirHipoteca: false,
};

const salud = (met: Partial<Parameters<typeof calcSaludFinanciera>[0]> = {}): SaludFinanciera =>
  calcSaludFinanciera(
    { ingresos: 3000, cuotas: 600, cuotasHipoteca: 400, gastosBasicos: 900, gastosOtros: 300, amortizaciones: 0, ...met },
    CONFIG,
  );

const pintar = (html: string): HTMLElement => {
  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.replaceChildren(div);
  return div;
};

describe('formato de porcentaje', () => {
  it('un decimal, y guion cuando no hay dato', () => {
    expect(pct(12.345)).toBe('12.3%');
    expect(pct(0)).toBe('0.0%');
    expect(pct(null)).toBe('—');
    expect(pct(undefined)).toBe('—');
  });
});

describe('panel de salud', () => {
  it('sin ingresos proyectados lo dice en vez de pintar ceros', () => {
    expect(panelSalud(null)).toContain('Sin ingresos proyectados');
    expect(panelSalud(salud({ ingresos: 0 }))).toContain('Sin ingresos proyectados');
  });

  it('muestra los tres indicadores con sus umbrales', () => {
    const html = panelSalud(salud());
    expect(html).toContain('Capacidad de ahorro');
    expect(html).toContain('Endeudamiento (DTI)');
    expect(html).toContain('Distribución (regla 50/30/20)');
    expect(html).toContain('🟢 ≥20%');
    expect(html).toContain('🟢 &lt;30%');
  });

  it('con hipoteca excluida enseña el DTI total aparte', () => {
    const s = calcSaludFinanciera(
      { ingresos: 3000, cuotas: 600, cuotasHipoteca: 400, gastosBasicos: 900, gastosOtros: 300, amortizaciones: 0 },
      { ...CONFIG, saludExcluirHipoteca: true },
    );
    const html = panelSalud(s);
    expect(html).toContain('DTI total (con hipoteca)');
    // La cuota que se muestra es la de DTI, ya sin la hipoteca: 600 − 400
    expect(html).toContain('200,00');
  });

  it('sin hipoteca excluida no añade el bloque extra', () => {
    expect(panelSalud(salud())).not.toContain('DTI total (con hipoteca)');
  });
});

describe('formulario de umbrales', () => {
  it('pinta los valores actuales', () => {
    const raiz = pintar(formularioUmbrales({ ...UMBRALES_RECOMENDADOS, saludUmbralAhorroVerde: 25, saludTagHipoteca: 'casa' }));
    expect((raiz.querySelector('#salud-ahorro-verde') as HTMLInputElement).value).toBe('25');
    expect((raiz.querySelector('#salud-tag-hipoteca') as HTMLInputElement).value).toBe('casa');
  });

  it('cae en los recomendados si la configuración viene vacía', () => {
    const raiz = pintar(formularioUmbrales({}));
    expect((raiz.querySelector('#salud-regla-0') as HTMLInputElement).value).toBe('50');
    expect((raiz.querySelector('#salud-dti-verde') as HTMLInputElement).value).toBe('30');
  });

  it('lee lo escrito', () => {
    const raiz = pintar(formularioUmbrales(UMBRALES_RECOMENDADOS));
    (raiz.querySelector('#salud-ahorro-verde') as HTMLInputElement).value = '35';
    (raiz.querySelector('#salud-regla-1') as HTMLInputElement).value = '25';
    (raiz.querySelector('#salud-excl-hipoteca') as HTMLInputElement).checked = true;
    (raiz.querySelector('#salud-tag-hipoteca') as HTMLInputElement).value = '  vivienda  ';

    const u = leerUmbrales(raiz);
    expect(u.saludUmbralAhorroVerde).toBe(35);
    expect(u.saludRegla).toEqual([50, 25, 20]);
    expect(u.saludExcluirHipoteca).toBe(true);
    expect(u.saludTagHipoteca).toBe('vivienda');
  });

  it('sanea los valores fuera de rango en vez de guardarlos tal cual', () => {
    // El legacy los guardaba crudos y dejaba el semáforo en un estado imposible
    const raiz = pintar(formularioUmbrales(UMBRALES_RECOMENDADOS));
    (raiz.querySelector('#salud-ahorro-verde') as HTMLInputElement).value = '250';
    (raiz.querySelector('#salud-dti-verde') as HTMLInputElement).value = '-30';
    (raiz.querySelector('#salud-regla-0') as HTMLInputElement).value = 'no es un número';

    const u = leerUmbrales(raiz);
    expect(u.saludUmbralAhorroVerde).toBe(100);
    expect(u.saludUmbralDTIVerde).toBe(0);
    expect(u.saludRegla[0]).toBe(50); // vuelve al valor por defecto
  });

  it('una etiqueta de hipoteca vacía cae en "hipoteca"', () => {
    const raiz = pintar(formularioUmbrales(UMBRALES_RECOMENDADOS));
    (raiz.querySelector('#salud-tag-hipoteca') as HTMLInputElement).value = '   ';
    expect(leerUmbrales(raiz).saludTagHipoteca).toBe('hipoteca');
  });

  it('los botones van por data-attr, sin onclick global', () => {
    const raiz = pintar(formularioUmbrales(UMBRALES_RECOMENDADOS));
    expect(raiz.querySelector('[data-salud-guardar]')).not.toBeNull();
    expect(raiz.querySelector('[data-salud-reset]')).not.toBeNull();
    expect(raiz.innerHTML).not.toContain('onclick');
  });
});
