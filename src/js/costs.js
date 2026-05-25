// costs.js — Control de costos
let _chartCostos = null;

const CATS = {
  piezas:  { label: 'Compra de piezas',   icon: 'wrench',     color: 'blue'   },
  externo: { label: 'Servicios externos', icon: 'users',      color: 'purple' },
  general: { label: 'Gastos generales',   icon: 'building-2', color: 'orange' },
};

function renderCosts() {
  const costos = DB.getCostos().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const now = new Date();
  const totalMes = costos
    .filter(c => { const d = new Date(c.fecha); return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth(); })
    .reduce((s, c) => s + c.importe, 0);

  document.getElementById('app').innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Control de Costos</h1>
        <p class="page-subtitle">Total acumulado: <strong>${fmt(costos.reduce((s,c)=>s+c.importe,0))}</strong>
          &mdash; Este mes: <strong>${fmt(totalMes)}</strong></p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCostoModal()">
          <i data-lucide="plus"></i> Nuevo gasto
        </button>
      </div>
    </div>

    <div class="costos-stats">
      ${Object.entries(CATS).map(([k, cat]) => {
        const total = costos.filter(c => c.categoria===k).reduce((s,c)=>s+c.importe,0);
        return `<div class="stat-card">
          <div class="stat-icon stat-icon--${cat.color}"><i data-lucide="${cat.icon}"></i></div>
          <div>
            <p class="stat-label">${cat.label}</p>
            <p class="stat-value">${fmt(total)}</p>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="costos-layout">
      <div class="card card--table">
        <div class="card-header">
          <h2 class="card-title">Historial de gastos</h2>
          <select id="cos-cat" class="input input--select input--sm" onchange="filterCostos()">
            <option value="">Todas las categorías</option>
            ${Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <table class="table">
          <thead><tr>
            <th>Fecha</th><th>Categoría</th><th>Descripción</th>
            <th>Proveedor</th><th class="text-right">Importe</th><th></th>
          </tr></thead>
          <tbody id="cos-tbody">${renderFilasCostos(costos)}</tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">Distribución por categoría</h2></div>
        <div style="padding:var(--space-4)">
          <canvas id="chartCostos" height="240"></canvas>
        </div>
      </div>
    </div>

    <div id="modal-costo" class="modal-overlay hidden" onclick="closeModalIfBg(event,'modal-costo')">
      <div class="modal">
        <div class="modal-header">
          <h2 id="modal-c-title" class="modal-title">Nuevo gasto</h2>
          <button class="btn-icon" onclick="closeModal('modal-costo')"><i data-lucide="x"></i></button>
        </div>
        <form id="form-costo" class="modal-body" onsubmit="submitCosto(event)">
          <div class="form-grid">
            <div class="form-group">
              <label class="label" for="c-fecha">Fecha *</label>
              <input type="date" id="c-fecha" class="input" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label class="label" for="c-cat">Categoría *</label>
              <select id="c-cat" class="input" required>
                ${Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group form-group--full">
              <label class="label" for="c-desc">Descripción *</label>
              <input type="text" id="c-desc" class="input" required>
            </div>
            <div class="form-group">
              <label class="label" for="c-importe">Importe (€) *</label>
              <input type="number" id="c-importe" class="input" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label class="label" for="c-prov">Proveedor / Concepto</label>
              <input type="text" id="c-prov" class="input">
            </div>
          </div>
          <input type="hidden" id="c-id">
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('modal-costo')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar gasto</button>
          </div>
        </form>
      </div>
    </div>
  `;
  lucide.createIcons();
  buildChartCostos(costos);
}

function renderFilasCostos(lista) {
  if (!lista.length) return `<tr><td colspan="6"><div class="empty-state">
    <i data-lucide="receipt" class="empty-icon"></i><p>Sin gastos registrados.</p></div></td></tr>`;
  return lista.map(c => {
    const cat = CATS[c.categoria] || { label: c.categoria, color: 'muted' };
    return `<tr>
      <td>${fmtFecha(c.fecha)}</td>
      <td><span class="badge badge--${cat.color}">${cat.label}</span></td>
      <td>${c.descripcion}</td>
      <td>${c.proveedor||'—'}</td>
      <td class="text-right"><strong>${fmt(c.importe)}</strong></td>
      <td class="text-right">
        <button class="btn-icon" onclick="editCosto('${c.id}')"><i data-lucide="pencil"></i></button>
        <button class="btn-icon btn-icon--danger" onclick="deleteCosto('${c.id}')"><i data-lucide="trash-2"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function filterCostos() {
  const cat = document.getElementById('cos-cat').value;
  const todos = DB.getCostos().sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
  const f = cat ? todos.filter(c=>c.categoria===cat) : todos;
  document.getElementById('cos-tbody').innerHTML = renderFilasCostos(f);
  lucide.createIcons();
}

function buildChartCostos(costos) {
  const data = Object.entries(CATS).map(([k,v]) => ({
    label: v.label,
    value: costos.filter(c=>c.categoria===k).reduce((s,c)=>s+c.importe,0)
  }));
  const ctx = document.getElementById('chartCostos').getContext('2d');
  if (_chartCostos) _chartCostos.destroy();
  _chartCostos = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d=>d.label),
      datasets: [{ data: data.map(d=>d.value),
        backgroundColor: ['rgba(0,100,148,0.75)','rgba(122,57,187,0.75)','rgba(218,113,1,0.75)'],
        borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.parsed) } }
      }
    }
  });
}

function openCostoModal(id) {
  if (id) {
    const c = DB.getCosto(id);
    document.getElementById('modal-c-title').textContent = 'Editar gasto';
    document.getElementById('c-id').value      = c.id;
    document.getElementById('c-fecha').value   = c.fecha;
    document.getElementById('c-cat').value     = c.categoria;
    document.getElementById('c-desc').value    = c.descripcion;
    document.getElementById('c-importe').value = c.importe;
    document.getElementById('c-prov').value    = c.proveedor||'';
  } else {
    document.getElementById('modal-c-title').textContent = 'Nuevo gasto';
    document.getElementById('form-costo').reset();
    document.getElementById('c-id').value   = '';
    document.getElementById('c-fecha').value = new Date().toISOString().split('T')[0];
  }
  document.getElementById('modal-costo').classList.remove('hidden');
}

function editCosto(id) { openCostoModal(id); }

function submitCosto(e) {
  e.preventDefault();
  const id = document.getElementById('c-id').value;
  const data = {
    fecha:       document.getElementById('c-fecha').value,
    categoria:   document.getElementById('c-cat').value,
    descripcion: document.getElementById('c-desc').value.trim(),
    importe:     parseFloat(document.getElementById('c-importe').value),
    proveedor:   document.getElementById('c-prov').value.trim(),
  };
  if (id) DB.updateCosto(id, data); else DB.addCosto(data);
  closeModal('modal-costo');
  renderCosts();
  showToast(id ? 'Gasto actualizado' : 'Gasto registrado');
}

function deleteCosto(id) {
  if (!confirm(`¿Eliminar gasto "${DB.getCosto(id).descripcion}"?`)) return;
  DB.deleteCosto(id);
  renderCosts();
  showToast('Gasto eliminado');
}
