// sales.js — Registro de ventas
function renderSales() {
  const ventas = DB.getVentas().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const totalIng = ventas.reduce((s, v) => s + v.importe, 0);
  const totalCos = ventas.reduce((s, v) => s + (v.costo || 0), 0);
  const totalGan = totalIng - totalCos;

  document.getElementById('app').innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Ventas</h1>
        <p class="page-subtitle">${ventas.length} registros en total</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="exportVentasCSV()">
          <i data-lucide="download"></i> Exportar CSV
        </button>
        <button class="btn btn-primary" onclick="openVentaModal()">
          <i data-lucide="plus"></i> Nueva venta
        </button>
      </div>
    </div>

    <div class="ventas-kpis">
      <div class="mini-kpi">
        <span class="mini-kpi-label">Total ingresos</span>
        <span class="mini-kpi-value">${fmt(totalIng)}</span>
      </div>
      <div class="mini-kpi">
        <span class="mini-kpi-label">Total costos</span>
        <span class="mini-kpi-value mini-kpi-value--red">${fmt(totalCos)}</span>
      </div>
      <div class="mini-kpi mini-kpi--highlight">
        <span class="mini-kpi-label">Ganancia neta</span>
        <span class="mini-kpi-value mini-kpi-value--green">${fmt(totalGan)}</span>
      </div>
    </div>

    <div class="card card--table">
      <div class="card-header">
        <h2 class="card-title">Historial de ventas</h2>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <input type="date" id="v-desde" class="input input--sm" onchange="filterVentas()" placeholder="Desde">
          <input type="date" id="v-hasta" class="input input--sm" onchange="filterVentas()" placeholder="Hasta">
          <select id="v-tipo" class="input input--select input--sm" onchange="filterVentas()">
            <option value="">Todos los tipos</option>
            <option value="producto">Producto</option>
            <option value="servicio">Servicio</option>
          </select>
        </div>
      </div>
      <table class="table">
        <thead><tr>
          <th>Fecha</th><th>Tipo</th><th>Descripción</th>
          <th class="text-right">Importe</th>
          <th class="text-right">Costo</th>
          <th class="text-right">Ganancia</th>
          <th></th>
        </tr></thead>
        <tbody id="ven-tbody">${renderFilasVentas(ventas)}</tbody>
      </table>
    </div>

    <div id="modal-venta" class="modal-overlay hidden" onclick="closeModalIfBg(event,'modal-venta')">
      <div class="modal">
        <div class="modal-header">
          <h2 id="modal-v-title" class="modal-title">Nueva venta</h2>
          <button class="btn-icon" onclick="closeModal('modal-venta')"><i data-lucide="x"></i></button>
        </div>
        <form id="form-venta" class="modal-body" onsubmit="submitVenta(event)">
          <div class="form-grid">
            <div class="form-group">
              <label class="label" for="v-fecha">Fecha *</label>
              <input type="date" id="v-fecha" class="input" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label class="label" for="v-tipo-f">Tipo *</label>
              <select id="v-tipo-f" class="input" required>
                <option value="servicio">Servicio</option>
                <option value="producto">Producto</option>
              </select>
            </div>
            <div class="form-group form-group--full">
              <label class="label" for="v-desc">Descripción *</label>
              <input type="text" id="v-desc" class="input" required>
            </div>
            <div class="form-group">
              <label class="label" for="v-importe">Importe cobrado (€) *</label>
              <input type="number" id="v-importe" class="input" min="0" step="0.01" required oninput="calcGanancia()">
            </div>
            <div class="form-group">
              <label class="label" for="v-costo">Costo asociado (€)</label>
              <input type="number" id="v-costo" class="input" min="0" step="0.01" value="0" oninput="calcGanancia()">
            </div>
            <div class="form-group">
              <label class="label">Ganancia estimada</label>
              <div id="ganancia-prev" class="ganancia-preview">—</div>
            </div>
          </div>
          <input type="hidden" id="v-id">
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('modal-venta')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar venta</button>
          </div>
        </form>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function renderFilasVentas(lista) {
  if (!lista.length) return `<tr><td colspan="7"><div class="empty-state">
    <i data-lucide="shopping-cart" class="empty-icon"></i><p>Sin ventas registradas.</p></div></td></tr>`;
  return lista.map(v => {
    const gan = v.importe - (v.costo || 0);
    return `<tr>
      <td>${fmtFecha(v.fecha)}</td>
      <td><span class="badge badge--${v.tipo==='servicio'?'blue':'green'}">${v.tipo}</span></td>
      <td>${v.descripcion}</td>
      <td class="text-right">${fmt(v.importe)}</td>
      <td class="text-right text-muted">${fmt(v.costo||0)}</td>
      <td class="text-right"><strong class="${gan>=0?'text-success':'text-error'}">${fmt(gan)}</strong></td>
      <td class="text-right">
        <button class="btn-icon" onclick="editVenta('${v.id}')"><i data-lucide="pencil"></i></button>
        <button class="btn-icon btn-icon--danger" onclick="deleteVenta('${v.id}')"><i data-lucide="trash-2"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function filterVentas() {
  const desde = document.getElementById('v-desde').value;
  const hasta = document.getElementById('v-hasta').value;
  const tipo  = document.getElementById('v-tipo').value;
  const f = DB.getVentas()
    .sort((a,b)=>new Date(b.fecha)-new Date(a.fecha))
    .filter(v => {
      if (desde && v.fecha < desde) return false;
      if (hasta && v.fecha > hasta) return false;
      if (tipo  && v.tipo !== tipo)  return false;
      return true;
    });
  document.getElementById('ven-tbody').innerHTML = renderFilasVentas(f);
  lucide.createIcons();
}

function calcGanancia() {
  const imp = parseFloat(document.getElementById('v-importe').value) || 0;
  const cos = parseFloat(document.getElementById('v-costo').value)   || 0;
  const el  = document.getElementById('ganancia-prev');
  if (!el) return;
  const gan = imp - cos;
  el.textContent = fmt(gan);
  el.className   = 'ganancia-preview ' + (gan >= 0 ? 'text-success' : 'text-error');
}

function openVentaModal(id) {
  if (id) {
    const v = DB.getVenta(id);
    document.getElementById('modal-v-title').textContent = 'Editar venta';
    document.getElementById('v-id').value      = v.id;
    document.getElementById('v-fecha').value   = v.fecha;
    document.getElementById('v-tipo-f').value  = v.tipo;
    document.getElementById('v-desc').value    = v.descripcion;
    document.getElementById('v-importe').value = v.importe;
    document.getElementById('v-costo').value   = v.costo || 0;
  } else {
    document.getElementById('modal-v-title').textContent = 'Nueva venta';
    document.getElementById('form-venta').reset();
    document.getElementById('v-id').value    = '';
    document.getElementById('v-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('v-costo').value = '0';
  }
  document.getElementById('modal-venta').classList.remove('hidden');
  setTimeout(calcGanancia, 10);
}

function editVenta(id) { openVentaModal(id); }

function submitVenta(e) {
  e.preventDefault();
  const id = document.getElementById('v-id').value;
  const data = {
    fecha:       document.getElementById('v-fecha').value,
    tipo:        document.getElementById('v-tipo-f').value,
    descripcion: document.getElementById('v-desc').value.trim(),
    importe:     parseFloat(document.getElementById('v-importe').value),
    costo:       parseFloat(document.getElementById('v-costo').value) || 0,
  };
  if (id) DB.updateVenta(id, data); else DB.addVenta(data);
  closeModal('modal-venta');
  renderSales();
  showToast(id ? 'Venta actualizada' : 'Venta registrada');
}

function deleteVenta(id) {
  if (!confirm(`¿Eliminar venta "${DB.getVenta(id).descripcion}"?`)) return;
  DB.deleteVenta(id);
  renderSales();
  showToast('Venta eliminada');
}

function exportVentasCSV() {
  const header = ['Fecha','Tipo','Descripción','Importe','Costo','Ganancia'];
  const rows = DB.getVentas().map(v => [
    v.fecha, v.tipo,
    `"${v.descripcion.replace(/"/g,'""')}"`,
    v.importe, v.costo||0, v.importe-(v.costo||0)
  ].join(','));
  downloadCSV([header.join(','), ...rows].join('\n'), 'ventas.csv');
  showToast('CSV exportado');
}
