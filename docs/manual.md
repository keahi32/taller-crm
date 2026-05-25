# 📖 Manual de Usuario — Taller CRM

## Índice
1. [Primeros pasos](#primeros-pasos)
2. [Dashboard](#dashboard)
3. [Inventario](#inventario)
4. [Control de Costos](#control-de-costos)
5. [Ventas](#ventas)
6. [Exportación de datos](#exportación-de-datos)
7. [Preguntas frecuentes](#preguntas-frecuentes)

---

## Primeros pasos

Al abrir la aplicación por primera vez se cargan automáticamente **datos de ejemplo**:
- 15 productos en el inventario
- 10 registros de costos
- 12 ventas históricas

Estos datos te permiten explorar todas las funcionalidades sin necesidad de introducir nada manualmente. Cuando estés listo para trabajar con datos reales, ve a **Sidebar → Restablecer datos** o simplemente empieza a editar/eliminar los registros existentes.

> ⚠️ Los datos se guardan en el navegador (`localStorage`). Si limpias el almacenamiento del navegador, los datos se perderán. Para persistencia real, consulta el [Roadmap](../README.md#-roadmap).

---

## Dashboard

El Dashboard es la vista principal. Muestra un resumen en tiempo real:

| Indicador | Descripción |
|---|---|
| **Valor Inventario** | Suma del stock actual × precio de venta de cada producto |
| **Ganancias del mes** | Ingresos del mes − costos del mes − costos directos de ventas |
| **Gastos del mes** | Total de costos registrados en el mes actual |
| **Stock bajo** | Número de productos por debajo de su stock mínimo |

El **gráfico de barras** muestra ingresos vs gastos de los últimos 6 meses.

El panel **Top Servicios/Ventas** agrupa las ventas por descripción y muestra las 5 con mayor importe acumulado.

---

## Inventario

### Añadir un producto
1. Haz clic en **Nuevo producto**
2. Rellena los campos obligatorios (marcados con *)
3. Haz clic en **Guardar producto**

### Campos del producto

| Campo | Descripción |
|---|---|
| Nombre | Nombre descriptivo del producto |
| SKU / Código | Código único de referencia (ej: FLT-001) |
| Descripción | Texto libre opcional |
| Stock actual | Unidades disponibles actualmente |
| Stock mínimo | Umbral de alerta — cuando el stock baje de este valor, aparecerá la alerta |
| Precio compra | Coste de adquisición (sin IVA) |
| Precio venta | Precio de venta al cliente |
| Proveedor | Nombre del proveedor principal |

### Indicadores de stock
- 🟢 **Verde**: Stock por encima del mínimo
- 🟡 **Amarillo**: Stock entre 1× y 1.5× el mínimo (zona de atención)
- 🔴 **Rojo**: Stock igual o por debajo del mínimo (reposición urgente)

### Filtros
- **Búsqueda libre**: filtra por nombre, SKU o proveedor en tiempo real
- **Proveedor**: filtra por proveedor concreto
- **Estado de stock**: muestra solo los productos con stock bajo u OK

### Margen
Se calcula automáticamente como: `(P. Venta - P. Compra) / P. Compra × 100`

---

## Control de Costos

### Categorías disponibles

| Categoría | Uso |
|---|---|
| **Compra de piezas** | Reposición de inventario, compras a proveedores |
| **Servicios externos** | Trabajos subcontratados, asesorías, limpiezas |
| **Gastos generales** | Alquiler, suministros, seguros, gestoría |

### Añadir un gasto
1. Haz clic en **Nuevo gasto**
2. Selecciona la fecha y categoría
3. Introduce la descripción e importe
4. Haz clic en **Guardar gasto**

### Gráfico de distribución
El gráfico donut muestra el reparto total del gasto por categoría (sobre todos los registros, no solo el mes actual).

---

## Ventas

### Tipos de venta
- **Producto**: venta de un artículo del inventario
- **Servicio**: trabajo realizado en el taller (mano de obra, diagnosis, etc.)

### Campo "Costo asociado"
Este campo recoge el coste directo de la venta (p.ej. el precio de compra de las piezas utilizadas). La ganancia se calcula como:

```
Ganancia = Importe cobrado − Costo asociado
```

La preview de ganancia se actualiza en tiempo real al escribir en el formulario.

### Filtros de historial
- **Desde / Hasta**: rango de fechas
- **Tipo**: filtrar solo productos o solo servicios

---

## Exportación de datos

| Vista | Botón | Archivo generado |
|---|---|---|
| Inventario | Exportar CSV | `inventario.csv` |
| Ventas | Exportar CSV | `ventas.csv` |

Los archivos CSV son compatibles con **Excel**, **LibreOffice Calc** y **Google Sheets**. Para abrirlos correctamente en Excel:
1. Abre Excel → Datos → Desde texto/CSV
2. Selecciona el archivo descargado
3. Elige delimitador: **coma (,)**
4. Codificación: **UTF-8**

---

## Preguntas frecuentes

**¿Dónde se guardan los datos?**
En el `localStorage` del navegador. Son locales a ese navegador y dispositivo. No se sincronizan entre dispositivos.

**¿Puedo usar la app sin conexión a internet?**
Sí, una vez cargada en el navegador funciona completamente offline. Solo necesitas conexión para cargar los iconos y la fuente Inter (CDN).

**¿Qué pasa si borro el historial del navegador?**
Se perderán todos los datos. Exporta los CSV antes de limpiar el navegador.

**¿Cómo cambio entre modo claro y oscuro?**
Usa el botón **Modo oscuro** en la parte inferior del sidebar. Respeta la preferencia del sistema por defecto.

**¿Puedo añadir más usuarios?**
La versión actual es monousuario. El roadmap incluye autenticación multiusuario en la versión con backend.
