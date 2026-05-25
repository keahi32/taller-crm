// dashboard.js — Vista Dashboard
let _chartMensual = null;

function renderDashboard() {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  const metricas  = DB.getMetricasMes(y, m);
  const valorInv  = DB.getValorInventario();
  const stockBajo = DB.getProductosStockBajo();
  const topVentas = DB.getTopVentas(5);
  const mensual   = DB.getIngresosMensuales(6);
  const nCostosMes = DB.getCostos().filter(c => {
    const d = new Date(c.fecha);
    return d.getFullYear() === y && d.getMonth() + 1 === m;
  }).length;

  document.getElementById('app').innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Resumen de ${now.toLocaleString('es-ES',{month:'long',year:'numeric'})}</p>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon kpi-icon--blue"><i data-lucide="package"></i></div>
        <div class="kpi-body">
          <span class="kpi-label">Valor Inventario</span>
          <span class="kpi-value">${fmt(valorInv)}</span>
          <span class="kpi-sub">${DB.getProductos().length} productos en stock</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon kpi-icon--green"><i data-lucide="trending-up"></i></div>
        <div class="kpi-body">
          <span class="kpi-label">Ganancias del mes</span>
          <span class="kpi-value kpi-value--green">${fmt(metricas.gananciasMes)}</span>
          <span class="kpi-sub">Ingresos: ${fmt(metricas.ingresosMes)}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon kpi-icon--red"><i data-lucide="receipt"></i></div>
        <div class="kpi-body">
          <span class="kpi-label">Gastos del mes</span>
          <span class="kpi-value kpi-value--red">${fmt(metricas.gastosMes)}</span>
          <span class="kpi-sub">${nCostosMes} transacciones</span>
        </div>
      </div>
      <div class="kpi-card ${stockBajo.length > 0 ? 'kpi-card--warn' : ''}">
        <div class="kpi-icon kpi-icon--orange"><i data-lucide="alert-triangle"></i></div>
        <div class="kpi-body">
          <span class="kpi-label">Stock bajo</span>
          <span class="kpi-value kpi-value--orange">${stockBajo.length}</span>
          <span class="kpi-sub">productos bajo mínimo</span>
        </div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="card dash-chart">
        <div class="card-header">
          <h2 class="card-title">Ingresos vs Gastos</h2>
          <span class="badge badge--muted">Últimos 6 meses</span>
        </div>
        <div style="padding:var(--space-4)">
          <canvas id="chartMensual" height="200"></canvas>
        </div>
      </div>

      <div class="card dash-top">
        <div class="card-header"><h2 class="card-title">Top Servicios / Ventas</h2></div>
        <ul class="top-list" style="padding:0 var(--space-4)">
          ${topVentas.length ? topVentas.map((t, i) => `
            <li class="top-item">
              <span class="top-rank">${i + 1}</span>
              <span class="top-desc">${t.desc}</span>
              <span class="top-val">${fmt(t.total)}</span>
            </li>`).join('') : '<li class="top-item" style="color:var(--color-text-muted);font-size:var(--text-sm)">Sin datos aún</li>'}
        </ul>
      </div>

      <div class="card dash-alerts ${stockBajo.length === 0 ? 'dash-alerts--ok' : ''}">
        ${stockBajo.length > 0 ? `
          <div class="card-header">
            <h2 class="card-title"><i data-lucide="alert-triangle" class="icon-warn"></i> Alertas de Stock</h2>
          </div>
          <ul class="alert-list" style="padding:var(--space-3) var(--space-4)">
            ${stockBajo.map(p => `
              <li class="alert-item">
                <span class="alert-name">${p.nombre}</span>
                <span class="stock-badge stock-badge--low">${p.stock} uds</span>
                <span class="alert-min">Mín: ${p.stockMinimo}</span>
              </li>`).join('')}
          </ul>` : `
          <div class="empty-state">
            <i data-lucide="check-circle" class="empty-icon" style="color:var(--color-success)"></i>
            <p>Todo el stock en niveles correctos</p>
          </div>`}
      </div>
    </div>
  `;

  lucide.createIcons();

  const ctx = document.getElementById('chartMensual').getContext('2d');
  if (_chartMensual) _chartMensual.destroy();
  _chartMensual = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: mensual.map(m => m.label),
      datasets: [
        { label: 'Ingresos', data: mensual.map(m => m.ingresos), backgroundColor: 'rgba(1,105,111,0.75)', borderRadius: 4 },
        { label: 'Gastos',   data: mensual.map(m => m.gastos),   backgroundColor: 'rgba(161,44,123,0.5)', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => '€' + v.toLocaleString('es-ES') } }
      }
    }
  });
}
