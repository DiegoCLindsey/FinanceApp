// Depends on: State, FinanceMath, UI
const InflacionModule = (() => {

  function render() {
    const view     = document.getElementById('view-inflacion');
    const periodos = State.get('inflacion') || [];
    const config   = State.get('config');
    const activo   = config.usarInflacion || false;

    // Ordenar por año descendente para mostrar los más recientes primero
    const sorted = [...periodos].sort((a, b) => b.year - a.year);

    // Calcular inflación acumulada desde hoy hasta +5 y +10 años (si hay datos)
    const hoy = new Date().toISOString().slice(0, 10);
    const d5  = new Date(new Date().getFullYear() + 5,  0, 1).toISOString().slice(0, 10);
    const d10 = new Date(new Date().getFullYear() + 10, 0, 1).toISOString().slice(0, 10);
    const f5  = activo && periodos.length > 0 ? FinanceMath.calcFactorInflacion(periodos, hoy, d5)  : null;
    const f10 = activo && periodos.length > 0 ? FinanceMath.calcFactorInflacion(periodos, hoy, d10) : null;

    view.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>Inflación</span></h1>
        <div class="page-actions">
          <button class="btn-primary" id="btn-new-periodo">+ Añadir período</button>
        </div>
      </div>

      ${!activo && periodos.length === 0 ? `
      <div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
        <div style="font-weight:600;font-size:14px;margin-bottom:6px">Módulo de inflación — configuración opcional</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6;margin-bottom:10px">
          Si activas este módulo podrás registrar la tasa de inflación estimada para cada año.
          Las proyecciones de gastos, ingresos y préstamos mostrarán el coste ajustado en <strong>euros de hoy</strong>,
          para que veas el impacto real de la inflación en tu poder adquisitivo.<br><br>
          <strong>¿Cuándo activarlo?</strong> Cuando quieras comparar el coste real de un préstamo a largo plazo
          o proyectar cómo evoluciona tu ahorro descontando la pérdida de poder adquisitivo.
          Para un uso básico de la app, puedes ignorar este módulo.
        </div>
        <div class="text-sm" style="color:var(--text3)">Activa la opción de abajo y añade las tasas anuales para empezar.</div>
      </div>` : ''}

      <!-- Toggle global -->
      <div class="card mb-14" style="padding:16px 20px">
        <div class="flex gap-16 items-center" style="flex-wrap:wrap;justify-content:space-between">
          <div>
            <div style="font-weight:600;font-size:15px">Usar estimaciones de inflación</div>
            <div class="text-sm" style="color:var(--text3);margin-top:4px">
              Activa esta opción para que las proyecciones de movimientos esperados
              apliquen la inflación acumulada año a año.
            </div>
          </div>
          <label class="toggle" style="flex-shrink:0">
            <input type="checkbox" id="tog-usar-inflacion" ${activo ? 'checked' : ''}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${f5 !== null ? `
        <div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${f5.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((f5-1)*100).toFixed(1)}%)</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +10 años</div>
            <div class="stat-value neg">×${f10.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((f10-1)*100).toFixed(1)}%)</span></div>
          </div>
        </div>` : ''}
      </div>

      <!-- Tabla de períodos -->
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          <span class="exp-col-head">Año</span>
          <span class="exp-col-head">Tasa anual (%)</span>
          <span class="exp-col-head">Equivalente mensual</span>
          <span class="exp-col-head">Factor acumulado desde hoy</span>
          <span></span>
        </div>
        ${sorted.length === 0
          ? '<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin períodos configurados. Añade el primer registro.</div>'
          : sorted.map(p => renderRow(p, hoy)).join('')}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro, se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la fecha del movimiento usando el tipo del período
        correspondiente. Si no hay tipo para un año concreto, se aplica el último conocido.
        Los préstamos a <strong>tipo fijo</strong> muestran el coste ajustado: cada cuota vale menos
        en términos reales conforme avanza el tiempo.
      </div>`;

    document.getElementById('tog-usar-inflacion').onchange = (e) => {
      const cfg = State.get('config');
      State.set('config', { ...cfg, usarInflacion: e.target.checked });
      UI.toast(e.target.checked ? 'Estimaciones de inflación activadas' : 'Estimaciones de inflación desactivadas');
      render();
    };

    document.getElementById('btn-new-periodo').onclick = () => openForm();

    sorted.forEach(p => {
      view.querySelector(`[data-edit-inf="${p._id}"]`)?.addEventListener('click', () => openForm(p._id));
      view.querySelector(`[data-del-inf="${p._id}"]`)?.addEventListener('click', () => deletePeriodo(p._id));
    });
  }

  function renderRow(p, hoy) {
    const mensual = (Math.pow(1 + p.tasa / 100, 1 / 12) - 1) * 100;
    // Factor acumulado desde hoy hasta 31-dic de ese año
    const toDate = `${p.year}-12-31`;
    const factor = toDate > hoy ? FinanceMath.calcFactorInflacion([p], hoy, toDate) : null;
    return `<div class="exp-table-row">
      <div style="font-weight:600;font-family:var(--font-mono)">${p.year}</div>
      <div class="num" style="color:var(--yellow);font-weight:600">${p.tasa.toFixed(2)}%</div>
      <div class="text-sm" style="color:var(--text2)">${mensual.toFixed(3)}%/mes</div>
      <div class="num">${factor !== null ? `×${factor.toFixed(3)}` : '—'}</div>
      <div class="flex gap-8 items-center">
        <button class="btn-icon" data-edit-inf="${p._id}">
          <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </button>
        <button class="btn-danger" data-del-inf="${p._id}">✕</button>
      </div>
    </div>`;
  }

  function openForm(id = null) {
    const p    = id ? (State.get('inflacion') || []).find(x => x._id === id) : null;
    const html = `
      <div class="grid-2">
        ${UI.input('inf-year', 'Año', 'number', p?.year || new Date().getFullYear(), '2024')}
        ${UI.input('inf-tasa', 'Tasa anual (%)', 'number', p?.tasa ?? '', '3.5')}
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" onclick="UI.closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="InflacionModule.savePeriodo('${id || ''}')">Guardar</button>
      </div>`;
    UI.openModal(html, id ? 'Editar período de inflación' : 'Nuevo período de inflación');

    setTimeout(() => {
      const updatePreview = () => {
        const tasa = parseFloat(document.getElementById('inf-tasa')?.value) || 0;
        const men  = (Math.pow(1 + tasa / 100, 1 / 12) - 1) * 100;
        const f5   = Math.pow(1 + tasa / 100, 5);
        const box  = document.getElementById('inf-preview');
        if (box) box.innerHTML = tasa > 0
          ? `Con un ${tasa}% anual: <strong>${men.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${f5.toFixed(3)}</strong> (+${((f5-1)*100).toFixed(1)}%)`
          : '';
      };
      document.getElementById('inf-tasa')?.addEventListener('input', updatePreview);
      updatePreview();
    }, 50);
  }

  function savePeriodo(id) {
    const year = parseInt(document.getElementById('inf-year').value);
    const tasa = parseFloat(document.getElementById('inf-tasa').value);
    if (isNaN(year) || year < 1900 || year > 2200) { UI.toast('Año inválido', 'err'); return; }
    if (isNaN(tasa) || tasa < 0 || tasa > 100)     { UI.toast('Tasa inválida (0–100%)', 'err'); return; }

    const periodos = State.get('inflacion') || [];
    if (!id) {
      // No permitir duplicados por año
      if (periodos.some(p => p.year === year)) { UI.toast('Ya existe un período para ese año', 'err'); return; }
      State.addItem('inflacion', { year, tasa });
      UI.toast('Período añadido');
    } else {
      const otros = periodos.filter(p => p._id !== id);
      if (otros.some(p => p.year === year)) { UI.toast('Ya existe un período para ese año', 'err'); return; }
      State.updateItem('inflacion', id, { year, tasa });
      UI.toast('Período actualizado');
    }
    UI.closeModal();
    render();
  }

  function deletePeriodo(id) {
    if (!UI.confirm('¿Eliminar este período de inflación?')) return;
    State.removeItem('inflacion', id);
    UI.toast('Período eliminado');
    render();
  }

  return { render, savePeriodo, deletePeriodo };
})();
