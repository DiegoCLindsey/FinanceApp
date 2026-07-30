// ── ui/features-modal ─────────────────────────────────────────────────────────
// Ventana de configuración de funcionalidades (F2, tarea 2.3).
//
// Escrita sin dependencias del código legacy: reutiliza el modal existente
// (#modal-overlay / #modal-content) si está en el DOM y, si no, crea el suyo.
// Los estilos son las clases del design system (card, toggle, btn-*), así que
// no hay CSS nuevo que mantener en paralelo.

import type { Flags } from '@/flags/service';
import type { EstadoFeature } from '@/flags/service';

export interface FeaturesModalDeps {
  flags: Flags;
  /** Se llama tras cada cambio para re-aplicar el gating y refrescar la vista. */
  onChange?: (cambiadas: string[]) => void;
  /** Aviso al usuario; por defecto usa el toast legacy si existe. */
  notify?: (mensaje: string, tipo?: 'ok' | 'err' | 'warn') => void;
  document?: Document;
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function notificar(deps: FeaturesModalDeps, mensaje: string, tipo: 'ok' | 'err' | 'warn' = 'ok') {
  if (deps.notify) return deps.notify(mensaje, tipo);
  const legacy = (globalThis as { UI?: { toast?: (m: string, t?: string) => void } }).UI;
  if (legacy?.toast) return legacy.toast(mensaje, tipo);
  console.info('[FinanceApp]', mensaje);
}

function filaFeature(f: EstadoFeature): string {
  const bloqueada = (f.bloqueadaPor?.length ?? 0) > 0;
  const aviso = bloqueada
    ? `<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${f.bloqueadaPor?.map(esc).join(', ')}</div>`
    : '';
  const nucleo = f.nucleo
    ? '<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>'
    : '';
  return `
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${esc(f.id)}" ${f.activa ? 'checked' : ''} ${f.nucleo ? 'disabled' : ''}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${esc(f.nombre)}${nucleo}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${esc(f.descripcion)}</div>
        ${aviso}
      </div>
    </div>`;
}

function cuerpoHtml(flags: Flags): string {
  const grupos = flags.estadoPorGrupo();
  const secciones = grupos
    .map(
      ({ grupo, features }) => `
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${esc(grupo)}</div>
        ${features.map(filaFeature).join('')}
      </div>`,
    )
    .join('');

  return `
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${secciones}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`;
}

/** Contenedor del modal: el legacy si existe, o uno propio creado al vuelo. */
function obtenerHost(doc: Document): { overlay: HTMLElement; content: HTMLElement; cerrar: () => void } {
  const legacyOverlay = doc.getElementById('modal-overlay');
  const legacyContent = doc.getElementById('modal-content');
  if (legacyOverlay && legacyContent) {
    return {
      overlay: legacyOverlay,
      content: legacyContent,
      cerrar: () => legacyOverlay.classList.add('hidden'),
    };
  }
  let overlay = doc.getElementById('fa-features-overlay');
  if (!overlay) {
    overlay = doc.createElement('div');
    overlay.id = 'fa-features-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>';
    doc.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay?.classList.add('hidden');
    });
    overlay.querySelector('[data-feature-close]')?.addEventListener('click', () => overlay?.classList.add('hidden'));
  }
  return {
    overlay,
    content: doc.getElementById('fa-features-content') as HTMLElement,
    cerrar: () => overlay?.classList.add('hidden'),
  };
}

export function createFeaturesModal(deps: FeaturesModalDeps) {
  const doc = deps.document ?? document;
  const { flags } = deps;

  function render(content: HTMLElement) {
    content.innerHTML = `<div class="modal-title">Funcionalidades</div>${cuerpoHtml(flags)}`;
    cablear(content);
  }

  function cablear(content: HTMLElement) {
    content.querySelectorAll<HTMLInputElement>('[data-feature-toggle]').forEach((input) => {
      input.addEventListener('change', () => {
        const id = input.dataset.featureToggle as string;
        const res = flags.setEnabled(id, input.checked);
        if (res.motivo === 'dependencias-activadas') notificar(deps, 'Se han activado también las funcionalidades necesarias');
        if (res.motivo === 'cascada-apagado') notificar(deps, 'Se han desactivado las funcionalidades que dependían de esta', 'warn');
        deps.onChange?.(res.cambiadas);
        render(content); // refleja cascadas y avisos de dependencias
      });
    });

    const fileInput = content.querySelector<HTMLInputElement>('[data-feature-file]');

    content.querySelector('[data-feature-action="export"]')?.addEventListener('click', () => {
      const perfil = flags.exportProfile();
      const blob = new Blob([JSON.stringify(perfil, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = doc.createElement('a');
      a.href = url;
      a.download = `financeapp-funcionalidades-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      notificar(deps, 'Perfil de funcionalidades guardado');
    });

    content.querySelector('[data-feature-action="import"]')?.addEventListener('click', () => fileInput?.click());

    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      try {
        const { aplicadas, ignoradas } = flags.importProfile(JSON.parse(await file.text()));
        notificar(
          deps,
          ignoradas.length > 0
            ? `Perfil cargado (${aplicadas.length} aplicadas, ${ignoradas.length} ignoradas por ser de otra versión)`
            : `Perfil cargado (${aplicadas.length} funcionalidades)`,
        );
        deps.onChange?.(aplicadas);
        render(content);
      } catch (e) {
        notificar(deps, 'No se pudo cargar el perfil: ' + (e as Error).message, 'err');
      } finally {
        fileInput.value = '';
      }
    });

    content.querySelector('[data-feature-action="reset"]')?.addEventListener('click', () => {
      flags.reset();
      notificar(deps, 'Funcionalidades restablecidas');
      deps.onChange?.([]);
      render(content);
    });
  }

  function open() {
    const host = obtenerHost(doc);
    render(host.content);
    host.overlay.classList.remove('hidden');
  }

  return { open, renderInto: render };
}
