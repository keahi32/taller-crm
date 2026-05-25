# 🔧 Taller CRM

CRM básico para taller mecánico — control de inventario, costos, ventas y dashboard analítico.

> Aplicación 100% frontend (HTML + CSS + JS). Datos persistidos en `localStorage`. Lista para clonar y ejecutar sin dependencias ni servidor.

---

## 📋 Características

### 📦 Inventario
- Alta, baja y edición de productos con todos los campos: nombre, descripción, SKU, stock, precio compra/venta, proveedor
- Alertas visuales de stock bajo (verde / amarillo / rojo)
- Búsqueda y filtros en tiempo real
- Exportación a CSV

### 💰 Control de Costos
- Registro de gastos por categoría: compra de piezas, servicios externos, gastos generales
- Resumen mensual con gráfica donut
- Histórico completo filtrable

### 🛒 Ventas
- Registro de ventas de productos o servicios
- Cálculo automático de ganancia (ingresos − costos)
- Historial con filtro por fecha y tipo

### 📊 Dashboard
- KPIs: valor total del inventario, ganancias del mes, gastos del mes, alertas stock
- Gráfico ingresos vs gastos (últimos 6 meses)
- Top 5 servicios/ventas

---

## 🚀 Instalación y uso

```bash
git clone https://github.com/keahi32/taller-crm.git
cd taller-crm
# Abre index.html en tu navegador
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

**Con servidor local (recomendado):**
```bash
python3 -m http.server 8080
# Abre http://localhost:8080
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
├── docs/manual.md
└── README.md
```

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| UI | HTML5 + CSS3 (custom properties, grid) |
| Lógica | JavaScript ES2020 (vanilla) |
| Datos | localStorage |
| Gráficos | Chart.js v4 (CDN) |
| Iconos | Lucide Icons (CDN) |
| Fuentes | Inter (Google Fonts) |

---

## 📄 Licencia

MIT
