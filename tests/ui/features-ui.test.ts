// @vitest-environment happy-dom
// Ventana de configuración de funcionalidades y gating del shell (F2, 2.3 y 2.4).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeaturesModal } from '@/ui/features-modal';
import { createGating, VISTA_POR_FEATURE } from '@/ui/gating';
import { createFlags } from '@/flags/service';
import { createStore } from '@/state/store';
import { createMemoryAdapter } from '@/state/storage/local';
import { FEATURES } from '@/flags/registry';

const HOY = new Date(2026, 6, 30);

function nuevoEntorno() {
  const store = createStore({ adapter: createMemoryAdapter(), hoy: HOY });
  store.load();
  const flags = createFlags(store);
  return { store, flags };
}

function montarShell() {
  document.body.innerHTML = `
    <nav class="sidebar"><ul class="nav-list">
      <li class="nav-section"><button class="nav-btn active" data-view="dashboard"></button></li>
      <li class="nav-section">
        <button class="nav-btn" data-view="expenses"></button>
        <button class="nav-btn" data-view="loans"></button>
        <button class="nav-btn" data-view="nominas"></button>
        <button class="nav-btn" data-view="accounts"></button>
      </li>
      <li class="nav-section">
        <button class="nav-btn" data-view="margenes"></button>
      </li>
    </ul></nav>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-content"></div></div>`;
}

const visible = (view: string): boolean => {
  const btn = document.querySelector<HTMLElement>(`.nav-btn[data-view="${view}"]`);
  return !!btn && btn.style.display !== 'none';
};

describe('ventana de funcionalidades', () => {
  beforeEach(() => montarShell());

  it('reutiliza el modal legacy y pinta una fila por feature', () => {
    const { flags } = nuevoEntorno();
    createFeaturesModal({ flags, notify: () => {} }).open();

    expect(document.getElementById('modal-overlay')?.classList.contains('hidden')).toBe(false);
    expect(document.querySelectorAll('[data-feature-toggle]')).toHaveLength(FEATURES.length);
    expect(document.querySelector('.modal-title')?.textContent).toBe('Funcionalidades');
    // Agrupada en secciones con título
    expect(document.querySelectorAll('.card-title').length).toBeGreaterThan(1);
  });

  it('crea su propio modal si el legacy no está en el DOM', () => {
    document.body.innerHTML = '';
    const { flags } = nuevoEntorno();
    createFeaturesModal({ flags, notify: () => {} }).open();
    expect(document.getElementById('fa-features-overlay')).not.toBeNull();
    expect(document.querySelectorAll('[data-feature-toggle]')).toHaveLength(FEATURES.length);
  });

  it('el toggle refleja el estado y la feature núcleo está deshabilitada', () => {
    const { flags } = nuevoEntorno();
    createFeaturesModal({ flags, notify: () => {} }).open();
    const dashboard = document.querySelector<HTMLInputElement>('[data-feature-toggle="dashboard"]');
    expect(dashboard?.disabled).toBe(true);
    expect(dashboard?.checked).toBe(true);
    expect(document.querySelector<HTMLInputElement>('[data-feature-toggle="autoguardado"]')?.checked).toBe(false);
    expect(document.querySelector<HTMLInputElement>('[data-feature-toggle="expenses"]')?.checked).toBe(true);
  });

  it('cambiar un toggle persiste el flag y avisa a onChange', () => {
    const { store, flags } = nuevoEntorno();
    const onChange = vi.fn();
    createFeaturesModal({ flags, onChange, notify: () => {} }).open();

    const input = document.querySelector<HTMLInputElement>('[data-feature-toggle="autoguardado"]') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(flags.isEnabled('autoguardado')).toBe(true);
    expect(store.get('config').features.autoguardado).toBe(true);
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(['autoguardado']));
  });

  it('la cascada de apagado se refleja en el re-render y se avisa al usuario', () => {
    const { flags } = nuevoEntorno();
    const notify = vi.fn();
    createFeaturesModal({ flags, notify }).open();

    const accounts = document.querySelector<HTMLInputElement>('[data-feature-toggle="accounts"]') as HTMLInputElement;
    accounts.checked = false;
    accounts.dispatchEvent(new Event('change'));

    expect(flags.isEnabled('contabilidad')).toBe(false);
    expect(notify).toHaveBeenCalledWith(expect.stringContaining('dependían'), 'warn');
    // Tras el re-render el toggle de contabilidad aparece apagado
    expect(document.querySelector<HTMLInputElement>('[data-feature-toggle="contabilidad"]')?.checked).toBe(false);
  });

  it('muestra qué dependencia bloquea una feature activa', () => {
    const { store, flags } = nuevoEntorno();
    store.patchConfig({ features: { ...store.get('config').features, accounts: false, contabilidad: true } });
    createFeaturesModal({ flags, notify: () => {} }).open();
    expect(document.body.innerHTML).toContain('Requiere: accounts');
  });

  it('restablecer vuelve a los valores por defecto', () => {
    const { flags } = nuevoEntorno();
    flags.setEnabled('autoguardado', true);
    const notify = vi.fn();
    createFeaturesModal({ flags, notify }).open();

    document.querySelector<HTMLElement>('[data-feature-action="reset"]')?.click();
    expect(flags.isEnabled('autoguardado')).toBe(false);
    expect(notify).toHaveBeenCalledWith('Funcionalidades restablecidas', 'ok');
  });

  it('escapa el contenido de texto para no inyectar HTML', () => {
    const { flags } = nuevoEntorno();
    createFeaturesModal({ flags, notify: () => {} }).open();
    // Ninguna descripción del catálogo introduce etiquetas sin escapar
    expect(document.querySelectorAll('[data-feature-toggle] script')).toHaveLength(0);
    expect(document.body.innerHTML).not.toContain('<script>');
  });
});

describe('gating del shell', () => {
  beforeEach(() => montarShell());

  it('oculta las vistas de las features desactivadas y muestra las activas', () => {
    const { flags } = nuevoEntorno();
    createGating({ flags }).apply();

    expect(visible('expenses')).toBe(true);
    expect(visible('loans')).toBe(true);
    expect(visible('margenes')).toBe(false); // off por defecto
    expect(visible('dashboard')).toBe(true); // no está en el mapa: nunca se toca
  });

  it('al activar una feature su vista reaparece', () => {
    const { flags } = nuevoEntorno();
    const gating = createGating({ flags });
    gating.apply();
    expect(visible('margenes')).toBe(false);

    flags.setEnabled('margenes', true);
    gating.apply();
    expect(visible('margenes')).toBe(true);
  });

  it('oculta la sección entera del sidebar si ninguna de sus vistas está activa', () => {
    const { flags } = nuevoEntorno();
    flags.setEnabled('margenes', false);
    createGating({ flags }).apply();

    const secciones = document.querySelectorAll<HTMLElement>('.nav-section');
    expect(secciones[2].style.display).toBe('none'); // Planificación
    expect(secciones[1].style.display).not.toBe('none'); // Mi dinero sigue activa
  });

  it('redirige al dashboard si se desactiva la vista abierta', () => {
    const { flags } = nuevoEntorno();
    const router = { navigate: vi.fn() };
    // Simula estar en la vista de préstamos
    document.querySelector('.nav-btn[data-view="dashboard"]')?.classList.remove('active');
    document.querySelector('.nav-btn[data-view="loans"]')?.classList.add('active');

    flags.setEnabled('loans', false);
    createGating({ flags, router }).apply();

    expect(router.navigate).toHaveBeenCalledWith('dashboard');
  });

  it('no redirige si la vista abierta sigue activa', () => {
    const { flags } = nuevoEntorno();
    const router = { navigate: vi.fn() };
    createGating({ flags, router }).apply();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('el mapa de vistas solo referencia features del catálogo', () => {
    for (const featureId of Object.keys(VISTA_POR_FEATURE)) {
      expect(FEATURES.map((f) => f.id)).toContain(featureId);
    }
  });
});

describe('gating de sub-funcionalidades (data-feature)', () => {
  // El sidebar solo cubre vistas. Lo que vive DENTRO de una vista —el botón de
  // optimizar amortizaciones, los paneles del dashboard— no tenía gating, y
  // salía en pantalla aunque su funcionalidad estuviera apagada.
  beforeEach(() => {
    montarShell();
  });

  const gate = () => {
    const { flags } = nuevoEntorno();
    return { flags, gating: createGating({ flags }) };
  };

  const pon = (html: string) => {
    const zona = document.createElement('div');
    zona.innerHTML = html;
    document.body.appendChild(zona);
    return zona;
  };

  it('oculta y deshabilita lo marcado cuando el flag está apagado', () => {
    const { flags, gating } = gate();
    flags.setEnabled('margenes', false);
    const zona = pon('<button data-feature="margenes">Optimizar</button>');
    gating.apply();

    const btn = zona.querySelector('button') as HTMLButtonElement;
    expect(btn.style.display).toBe('none');
    // Ocultar no basta: con display:none un .click() programático sigue
    // llegando, y en algunos navegadores el foco por teclado también.
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-hidden')).toBe('true');
  });

  it('lo deja visible y utilizable cuando el flag está encendido', () => {
    const { flags, gating } = gate();
    flags.setEnabled('margenes', true);
    const zona = pon('<button data-feature="margenes">Optimizar</button>');
    gating.apply();

    const btn = zona.querySelector('button') as HTMLButtonElement;
    expect(btn.style.display).not.toBe('none');
    expect(btn.disabled).toBe(false);
    expect(btn.hasAttribute('aria-hidden')).toBe(false);
  });

  it('vuelve a mostrarlo al reactivar sin necesidad de recargar', () => {
    const { flags, gating } = gate();
    flags.setEnabled('margenes', false);
    const zona = pon('<button data-feature="margenes">Optimizar</button>');
    gating.apply();
    const btn = zona.querySelector('button') as HTMLButtonElement;
    expect(btn.style.display).toBe('none');

    flags.setEnabled('margenes', true);
    gating.apply();
    expect(btn.style.display).not.toBe('none');
    expect(btn.disabled).toBe(false);
  });

  it('cubre varios elementos del mismo flag a la vez', () => {
    const { flags, gating } = gate();
    flags.setEnabled('margenes', false);
    const zona = pon('<button data-feature="margenes">A</button><div data-feature="margenes">B</div>');
    gating.apply();
    expect([...zona.querySelectorAll<HTMLElement>('[data-feature]')].every((el) => el.style.display === 'none')).toBe(true);
  });

  it('no toca lo que no está marcado', () => {
    const { flags, gating } = gate();
    flags.setEnabled('margenes', false);
    const zona = pon('<button id="otro">Nuevo préstamo</button>');
    gating.apply();
    expect((zona.querySelector('#otro') as HTMLElement).style.display).toBe('');
  });
});
