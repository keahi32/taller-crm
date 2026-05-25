// inventory.js — Gestión de inventario
function renderInventory() {
  const productos = DB.getProductos();
  const proveedores = [...new Set(productos.map(p => p.proveedor).filter(Boolean))];

  document.getElementById('app').innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Inventario</h1>
        <p class="page-subtitle">${productos.length} productos registrados &mdash;
          Valor total: <strong>${fmt(DB.getValorInventario())}</strong></p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="exportInventarioCSV()">
          <i data-lucide="download"></i> Exportar CSV
        </button>
        <button class="btn btn-primary" onclick="openProductoModal()">
          <i data-lucide="plus"></i> Nuevo producto
        </button>
      </div>
    </div>

    <div class="filters-bar">
      <div class="search-wrap">
        <i data-lucide="search" class="search-icon"></i>
        <input type="text" id="inv-search" class="input inv-search-input"
               placeholder="Buscar por nombre, SKU o proveedor…" oninput="filterInventario()">
      </div>
      <select id="inv-prov" class="input input--select" onchange="filterInventario()">
        <option value="">Todos los proveedores</option>
        ${proveedores.map(p => `<option value="${p}">${p}</option>`).join('')}
      </select>
      <select id="inv-stock" class="input input--select" onchange="filterInventario()">
        <option value="">Todo el stock</option>
        <option value="bajo">Stock bajo</option>
        <option value="ok">Stock OK</option>
      </select>
    </div>

    <div class="card card--table">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre / Descripción</th>
            <th>SKU</th>
            <th>Proveedor</th>
            <th class="text-right">Stock</th>
            <th class="text-right">P. Compra</th>
            <th class="text-right">P. Venta</th>
            <th class="text-right">Margen</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="inv-tbody">${renderFilasInventario(productos)}</tbody>
      </table>
    </div>

    <div id="modal-producto" class="modal-overlay hidden" onclick="closeModalIfBg(event,'modal-producto')">
      <div class="modal">
        <div class="modal-header">
          <h2 id="modal-p-title" class="modal-title">Nuevo producto</h2>
          <button class="btn-icon" onclick="closeModal('modal-producto')"><i data-lucide="x"></i></button>
        </div>
        <form id="form-producto" class="modal-body" onsubmit="submitProducto(event)">
          <div class="form-grid">
            <div class="form-group">
              <label class="label" for="p-nombre">Nombre *</label>
              <input type="text" id="p-nombre" class="input" required>
            </div>
            <div class="form-group">
              <label class="label" for="p-sku">SKU / Código *</label>
              <input type="text" id="p-sku" class="input" required>
            </div>
            <div class="form-group form-group--full">
              <label class="label" for="p-desc">Descripción</label>
              <textarea id="p-desc" class="input" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label class="label" for="p-stock">Stock actual *</label>
              <input type="number" id="p-stock" class="input" min="0" required>
            </div>
            <div class="form-group">
              <label class="label" for="p-smin">Stock mínimo *</label>
              <input type="number" id="p-smin" class="input" min="0" required>
            </div>
            <div class="form-group">
              <label class="label" for="p-pcompra">Precio compra (€) *</label>
              <input type="number" id="p-pcompra" class="input" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label class="label" for="p-pventa">Precio venta (€) *</label>
              <input type="number" id="p-pventa" class="input" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label class="label" for="p-prov">Proveedor</label>
              <input type="text" id="p-prov" class="input">
            </div>
          </div>
          <input type="hidden" id="p-id">
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('modal-producto')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar producto</button>
          </div>
        </form>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function renderFilasInventario(lista) {
  if (!lista.length) return `<tr><td colspan="8"><div class="empty-state">
    <i data-lucide="package" class="empty-icon"></i>
    <p>No hay productos. Añade el primero.</p></div></td></tr>`;

  return lista.map(p => {
    const margen = p.precioCompra > 0
      ? ((p.precioVenta - p.precioCompra) / p.precioCompra * 100).toFixed(1)
      : '—';
    const cls = p.stock <= p.stockMinimo ? 'stock-badge--low'
              : p.stock <= p.stockMinimo * 1.5 ? 'stock-badge--med'
              : 'stock-badge--ok';
    return `<tr>
      <td>
        <div class="cell-main">${p.nombre}</div>
        ${p.descripcion ? `<div class="cell-sub">${p.descripcion.substring(0,55)}${p.descripcion.length>55?'…':''}</div>` : ''}
      </td>
      <td><code class="sku">${p.sku}</code></td>
      <td>${p.proveedor || '—'}</td>
      <td class="text-right"><span class="stock-badge ${cls}">${p.stock}</span></td>
      <td class="text-right">${fmt(p.precioCompra)}</td>
      <td class="text-right">${fmt(p.precioVenta)}</td>
      <td class="text-right"><span class="margen">${margen}%</span></td>
      <td class="text-right">
        <button class="btn-icon" title="Editar" onclick="editProducto('${p.id}')"><i data-lucide="pencil"></i></button>
        <button class="btn-icon btn-icon--danger" title="Eliminar" onclick="deleteProducto('${p.id}')"><i data-lucide="trash-2"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function filterInventario() {
  const q    = (document.getElementById('inv-search').value || '').toLowerCase();
  const prov = document.getElementById('inv-prov').value;
  const stk  = document.getElementById('inv-stock').value;
  const filtered = DB.getProductos().filter(p => {
    const mQ = !q || p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.proveedor||'').toLowerCase().includes(q);
    const mP = !prov || p.proveedor === prov;
    const mS = !stk  || (stk === 'bajo' ? p.stock <= p.stockMinimo : p.stock > p.stockMinimo);
    return mQ && mP && mS;
  });
  document.getElementById('inv-tbody').innerHTML = renderFilasInventario(filtered);
  lucide.createIcons();
}

function openProductoModal(id) {
  if (id) {
    const p = DB.getProducto(id);
    document.getElementById('modal-p-title').textContent = 'Editar producto';
    document.getElementById('p-id').value      = p.id;
    document.getElementById('p-nombre').value  = p.nombre;
    document.getElementById('p-sku').value     = p.sku;
    document.getElementById('p-desc').value    = p.descripcion || '';
    document.getElementById('p-stock').value   = p.stock;
    document.getElementById('p-smin').value    = p.stockMinimo;
    document.getElementById('p-pcompra').value = p.precioCompra;
    document.getElementById('p-pventa').value  = p.precioVenta;
    document.getElementById('p-prov').value    = p.proveedor || '';
  } else {
    document.getElementById('modal-p-title').textContent = 'Nuevo producto';
    document.getElementById('form-producto').reset();
    document.getElementById('p-id').value = '';
  }
  document.getElementById('modal-producto').classList.remove('hidden');
}

function editProducto(id) { openProductoModal(id); }

function submitProducto(e) {
  e.preventDefault();
  const id = document.getElementById('p-id').value;
  const data = {
    nombre:       document.getElementById('p-nombre').value.trim(),
    sku:          document.getElementById('p-sku').value.trim(),
    descripcion:  document.getElementById('p-desc').value.trim(),
    stock:        parseInt(document.getElementById('p-stock').value),
    stockMinimo:  parseInt(document.getElementById('p-smin').value),
    precioCompra: parseFloat(document.getElementById('p-pcompra').value),
    precioVenta:  parseFloat(document.getElementById('p-pventa').value),
    proveedor:    document.getElementById('p-prov').value.trim(),
  };
  if (id) DB.updateProducto(id, data); else DB.addProducto(data);
  closeModal('modal-producto');
  renderInventory();
  showToast(id ? 'Producto actualizado' : 'Producto añadido');
}

function deleteProducto(id) {
  if (!confirm(`¿Eliminar "${DB.getProducto(id).nombre}"?`)) return;
  DB.deleteProducto(id);
  renderInventory();
  showToast('Producto eliminado');
}

function exportInventarioCSV() {
  const header = ['Nombre','SKU','Descripción','Stock','Stock Mínimo','P. Compra','P. Venta','Proveedor','Margen %'];
  const rows = DB.getProductos().map(p => {
    const m = p.precioCompra > 0 ? ((p.precioVenta-p.precioCompra)/p.precioCompra*100).toFixed(1) : '0';
    return [
      `"${p.nombre}"`, p.sku, `"${(p.descripcion||'').replace(/"/g,'""')}"`,
      p.stock, p.stockMinimo, p.precioCompra, p.precioVenta, `"${p.proveedor||''}"`, m
    ].join(',');
  });
  downloadCSV([header.join(','), ...rows].join('\n'), 'inventario.csv');
  showToast('CSV exportado');
}
