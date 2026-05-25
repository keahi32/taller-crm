// db.js — Capa de datos con localStorage
const DB_KEY = 'tallercrm_v1';

const DB = {
  _data: null,

  load() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      this._data = JSON.parse(raw);
    } else {
      this.seed();
    }
    return this._data;
  },

  save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this._data));
  },

  seed() {
    this._data = {
      productos: window.SEED_DATA.productos.map(p => ({ ...p })),
      costos:    window.SEED_DATA.costos.map(c => ({ ...c })),
      ventas:    window.SEED_DATA.ventas.map(v => ({ ...v })),
    };
    this.save();
  },

  reset() {
    localStorage.removeItem(DB_KEY);
    this.seed();
  },

  // ── Productos ──────────────────────────────────────────────────────────────
  getProductos()  { return this._data.productos; },
  getProducto(id) { return this._data.productos.find(p => p.id === id); },

  addProducto(p) {
    p.id = 'p' + Date.now();
    this._data.productos.push(p);
    this.save();
    return p;
  },

  updateProducto(id, cambios) {
    const idx = this._data.productos.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this._data.productos[idx] = { ...this._data.productos[idx], ...cambios };
    this.save();
    return this._data.productos[idx];
  },

  deleteProducto(id) {
    this._data.productos = this._data.productos.filter(p => p.id !== id);
    this.save();
  },

  // ── Costos ─────────────────────────────────────────────────────────────────
  getCostos()  { return this._data.costos; },
  getCosto(id) { return this._data.costos.find(c => c.id === id); },

  addCosto(c) {
    c.id = 'c' + Date.now();
    this._data.costos.push(c);
    this.save();
    return c;
  },

  updateCosto(id, cambios) {
    const idx = this._data.costos.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this._data.costos[idx] = { ...this._data.costos[idx], ...cambios };
    this.save();
    return this._data.costos[idx];
  },

  deleteCosto(id) {
    this._data.costos = this._data.costos.filter(c => c.id !== id);
    this.save();
  },

  // ── Ventas ─────────────────────────────────────────────────────────────────
  getVentas()  { return this._data.ventas; },
  getVenta(id) { return this._data.ventas.find(v => v.id === id); },

  addVenta(v) {
    v.id = 'v' + Date.now();
    this._data.ventas.push(v);
    this.save();
    return v;
  },

  updateVenta(id, cambios) {
    const idx = this._data.ventas.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this._data.ventas[idx] = { ...this._data.ventas[idx], ...cambios };
    this.save();
    return this._data.ventas[idx];
  },

  deleteVenta(id) {
    this._data.ventas = this._data.ventas.filter(v => v.id !== id);
    this.save();
  },

  // ── Métricas ───────────────────────────────────────────────────────────────
  getMetricasMes(year, month) {
    const ingresos = this._data.ventas
      .filter(v => { const d = new Date(v.fecha); return d.getFullYear()===year && d.getMonth()+1===month; })
      .reduce((s, v) => s + v.importe, 0);
    const gastos = this._data.costos
      .filter(c => { const d = new Date(c.fecha); return d.getFullYear()===year && d.getMonth()+1===month; })
      .reduce((s, c) => s + c.importe, 0);
    const costoVentas = this._data.ventas
      .filter(v => { const d = new Date(v.fecha); return d.getFullYear()===year && d.getMonth()+1===month; })
      .reduce((s, v) => s + (v.costo || 0), 0);
    return { ingresosMes: ingresos, gastosMes: gastos, gananciasMes: ingresos - gastos - costoVentas };
  },

  getValorInventario() {
    return this._data.productos.reduce((s, p) => s + p.stock * p.precioVenta, 0);
  },

  getProductosStockBajo() {
    return this._data.productos.filter(p => p.stock <= p.stockMinimo);
  },

  getTopVentas(n = 5) {
    const map = {};
    this._data.ventas.forEach(v => { map[v.descripcion] = (map[v.descripcion] || 0) + v.importe; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([desc, total]) => ({ desc, total }));
  },

  getIngresosMensuales(meses = 6) {
    const result = [];
    const now = new Date();
    for (let i = meses - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear(), m = d.getMonth() + 1;
      const label = d.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
      const ingresos = this._data.ventas
        .filter(v => { const vd = new Date(v.fecha); return vd.getFullYear()===y && vd.getMonth()+1===m; })
        .reduce((s, v) => s + v.importe, 0);
      const gastos = this._data.costos
        .filter(c => { const cd = new Date(c.fecha); return cd.getFullYear()===y && cd.getMonth()+1===m; })
        .reduce((s, c) => s + c.importe, 0);
      result.push({ label, ingresos, gastos });
    }
    return result;
  }
};
