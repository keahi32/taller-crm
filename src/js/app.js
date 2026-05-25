// app.js — Enrutador principal y utilidades globales
let currentView = 'dashboard';

const VIEWS = {
  dashboard: { label: 'Dashboard',  icon: 'layout-dashboard', render: renderDashboard },
  inventory: { label: 'Inventario', icon: 'package',          render: renderInventory },
  costs:     { label: 'Costos',     icon: 'receipt',          render: renderCosts     },
  sales:     { label: 'Ventas',     icon: 'shopping-cart',    render: renderSales     },
};

function navigate(view) {
  if (!VIEWS[view]) return;
  currentView = view;
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('nav-item--active', el.dataset.view === view)
  );
  VIEWS[view].render();
}

// ── Utilidades globales ────────────────────────────────────────────────────────
function fmt(n) {
  return (n || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
}

function fmtFecha(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function closeModalIfBg(e, id) {
  if (e.target.id === id) closeModal(id);
}

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i> ${msg}`;
  document.getElementById('toast-container').appendChild(t);
  lucide.createIcons({ nodes: [t] });
  setTimeout(() => { t.classList.add('toast--hide'); setTimeout(() => t.remove(), 300); }, 2800);
}

function resetData() {
  if (!confirm('¿Restablecer todos los datos de ejemplo? Se perderán los cambios actuales.')) return;
  DB.reset();
  navigate(currentView);
  showToast('Datos restablecidos');
}

// ── Inicialización ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  DB.load();

  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = Object.entries(VIEWS).map(([key, v]) => `
    <button class="nav-item ${key === 'dashboard' ? 'nav-item--active' : ''}"
            data-view="${key}" onclick="navigate('${key}')">
      <i data-lucide="${v.icon}" class="nav-icon"></i>
      <span class="nav-label">${v.label}</span>
    </button>
  `).join('');

  lucide.createIcons();
  navigate('dashboard');
});
