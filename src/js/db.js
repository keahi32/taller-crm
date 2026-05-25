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

  // ── Productos
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

  // ── Costos
  getCostos()    { return this._data.costos; },
  getCosto(id)   { return this._data.costos.find(c => c.id === id); },

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

  // ── Ventas
  getVentas()    { return this._data.ventas; },
  getVenta(id)   { return this._data.ventas.find(v => v.id === id); },

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
    this._data.ventas