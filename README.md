# 🔧 Taller CRM

CRM básico para taller mecánico — control de inventario, costos, ventas y dashboard analítico.

> Aplicación 100% frontend (HTML + CSS + JS). Datos persistidos en `localStorage`. Lista para clonar y ejecutar sin dependencias ni servidor.

---

## 📋 Características

### 📦 Inventario
- Alta, baja y edición de productos
- Campos: nombre, descripción, SKU, stock, precio compra/venta, proveedor
- Alertas visuales de stock bajo
- Búsqueda y filtros en tiempo real
- Exportación a CSV

### 💰 Control de Costos
- Registro de gastos: compra de piezas, servicios externos, gastos generales
- Resumen mensual con gráfica de evolución
- Histórico completo

### 🛒 Ventas
- Registro de ventas de productos o servicios
- Cálculo automático de ganancia (ingresos − costos)
- Historial con filtro por fecha

### 📊 Dashboard
- Valor total del inventario, ganancias y gastos del mes
- Gráfico ingresos vs gastos (últimos 6 meses)
- Top servicios más vendidos
- Alertas de stock crítico

---

## 🚀 Instalación y uso

```bash
git clone https://github.com/keahi32/taller-crm.git
cd taller-crm
```

**Opción 1 — Abrir directo:**
```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

**Opción 2 — Servidor local (recomendado):**
```bash
# Python
python3 -m http.server 8080
# Node.js
npx serve .
```

---

## 🗂️ Estructura

```
taller-crm/
├── index.html
├── src/
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       ├── db.js
│       ├── dashboard.js
│       ├── inventory.js
│       ├── costs.js
│       └── sales.js
├── seed/data.js
└── README.md
```

---

## 💾 Datos de ejemplo

Al primer inicio se cargan automáticamente: **15 productos, 10 costos, 12 ventas**.

Para resetear: botón **Restablecer datos** en el sidebar.

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| UI | HTML5 + CSS3 (custom properties, grid) |
| Lógica | JavaScript ES2020 (vanilla) |
| Datos | localStorage |
| Gráficos | Chart.js v4 |
| Iconos | Lucide Icons |
| Fuentes | Inter (Google Fonts) |

---

## 🔮 Roadmap

- [ ] Backend Node.js + Express + SQLite
- [ ] API REST multi-dispositivo
- [ ] Módulo de clientes y órdenes de trabajo
- [ ] Facturación con PDF
- [ ] Autenticación de usuarios

---

## 📄 Licencia

MIT
