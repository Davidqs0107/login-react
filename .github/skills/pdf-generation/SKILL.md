---
name: pdf-generation
description: "Use when: generating PDFs, creating reports, printing receipts, exporting documents. Implements PDF generation using jsPDF and jspdf-autotable with custom formatting for business documents."
---

# PDF Generation

Este skill guía la generación de PDFs usando jsPDF y jspdf-autotable siguiendo los patrones del proyecto.

## Instalación de Dependencias

```json
{
  "dependencies": {
    "jspdf": "^2.5.2",
    "jspdf-autotable": "^3.8.4"
  }
}
```

## Estructura de Archivos

```
src/{feature}/functions/
  generate{Document}PDF.js
```

Ejemplos:

- `src/prestamos/functions/generatePdfPrestamo.js`
- `src/prestamos/functions/generatePaymentReceiptPDF.js`

## Template Básico de PDF

```javascript
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { formatDate } from "../../common/functions";

export const generateBasicPDF = (data) => {
  // Crear instancia de jsPDF
  const doc = new jsPDF({
    orientation: "portrait", // "portrait" o "landscape"
    unit: "mm", // "mm", "cm", "in", "pt"
    format: "letter", // "letter", "a4", [width, height]
  });

  // Variable para controlar posición vertical
  let y = 20;

  // ============ TÍTULO ============
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Título del Documento", 14, y);
  y += 10;

  // ============ SECCIÓN 1 ============
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Sección 1", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.text(`Campo: ${data.campo}`, 14, y);
  y += 6;

  // ============ TABLA ============
  const tableColumn = ["Columna 1", "Columna 2", "Columna 3"];
  const tableRows = data.items.map((item) => [item.col1, item.col2, item.col3]);

  doc.autoTable({
    startY: y,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202], fontStyle: "bold" },
  });

  // ============ GUARDAR O ABRIR ============
  // Opción 1: Descargar directamente
  doc.save(`documento-${data.id}.pdf`);

  // Opción 2: Abrir en nueva pestaña
  const pdfBlob = doc.output("blob");
  const pdfURL = URL.createObjectURL(pdfBlob);
  window.open(pdfURL, "_blank");

  // Opción 3: Retornar el documento
  return doc;
};
```

## Configuración de Documento

### Formatos Comunes

```javascript
// Carta (Letter)
const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "letter", // 215.9 x 279.4 mm
});

// A4
const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4", // 210 x 297 mm
});

// Voucher/Ticket (pequeño)
const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: [80, 200], // Ancho x Alto personalizado
});

// Landscape (Horizontal)
const doc = new jsPDF({
  orientation: "landscape",
  unit: "mm",
  format: "letter",
});
```

### Formato Dinámico

```javascript
export const generateReceiptPDF = (data, formato = "carta") => {
  const isVoucher = formato === "voucher";

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: isVoucher ? [80, 200] : "letter",
  });

  // Ajustar contenido según formato
  const maxWidth = isVoucher ? 70 : 180;
  // ...
};
```

## Texto y Tipografía

### Fuentes

```javascript
// Familia de fuente: "helvetica", "times", "courier"
// Estilo: "normal", "bold", "italic", "bolditalic"

doc.setFont("helvetica", "bold");
doc.setFont("helvetica", "normal");
doc.setFont("times", "italic");
```

### Tamaños de Fuente

```javascript
doc.setFontSize(18); // Título principal
doc.setFontSize(14); // Subtítulos
doc.setFontSize(12); // Encabezados de sección
doc.setFontSize(10); // Texto normal
doc.setFontSize(8); // Texto pequeño (tablas)
```

### Agregar Texto

```javascript
// Texto simple
doc.text("Hola Mundo", x, y);

// Texto con alineación
doc.text("Centrado", x, y, { align: "center" });
doc.text("Derecha", x, y, { align: "right" });
doc.text("Izquierda", x, y, { align: "left" });

// Texto largo con saltos de línea
const texto =
  "Este es un texto muy largo que necesita ser dividido en múltiples líneas";
const lines = doc.splitTextToSize(texto, 180); // max width en mm
doc.text(lines, 14, y);
```

### Patrón de Label + Value

```javascript
let y = 20;

// Label en normal, Valor en bold
doc.setFont("helvetica", "normal");
doc.text("Nombre:", 14, y);
doc.setFont("helvetica", "bold");
doc.text(`${cliente.nombre}`, 40, y);
y += 6;

doc.setFont("helvetica", "normal");
doc.text("CI:", 14, y);
doc.setFont("helvetica", "bold");
doc.text(`${cliente.ci}`, 40, y);
y += 6;
```

## Tablas con autoTable

### Tabla Básica

```javascript
import "jspdf-autotable";

const tableColumn = ["Nombre", "Email", "Teléfono"];
const tableRows = clientes.map((cliente) => [
  cliente.nombre,
  cliente.email,
  cliente.telefono,
]);

doc.autoTable({
  startY: 100, // Posición vertical donde inicia
  head: [tableColumn], // Array de headers
  body: tableRows, // Array de rows
  theme: "striped", // 'striped', 'grid', 'plain'
});

// Obtener posición final de la tabla
const finalY = doc.lastAutoTable.finalY;
```

### Temas de Tabla

```javascript
// Tema "striped" (con rayas)
doc.autoTable({
  theme: "striped",
  headStyles: { fillColor: [66, 139, 202] },
});

// Tema "grid" (con bordes)
doc.autoTable({
  theme: "grid",
  headStyles: { fillColor: [100, 100, 100] },
});

// Tema "plain" (simple)
doc.autoTable({
  theme: "plain",
});
```

### Estilos de Tabla

```javascript
doc.autoTable({
  startY: 100,
  head: [tableColumn],
  body: tableRows,

  // Estilos generales
  styles: {
    fontSize: 10,
    cellPadding: 3,
    overflow: "linebreak",
    valign: "middle",
    halign: "left",
  },

  // Estilos del encabezado
  headStyles: {
    fillColor: [66, 139, 202], // Color de fondo RGB
    textColor: [255, 255, 255], // Color de texto RGB
    fontSize: 11,
    fontStyle: "bold",
    halign: "center",
  },

  // Estilos del cuerpo
  bodyStyles: {
    fontSize: 9,
    textColor: [0, 0, 0],
  },

  // Estilos alternados
  alternateRowStyles: {
    fillColor: [245, 245, 245],
  },

  // Anchos de columna específicos
  columnStyles: {
    0: { cellWidth: 15 }, // Primera columna
    1: { cellWidth: 40 }, // Segunda columna
    2: { cellWidth: 30 }, // Tercera columna
  },

  // Márgenes
  margin: { top: 10, left: 14, right: 14, bottom: 10 },
});
```

### Tabla con Formateo de Celdas

```javascript
const tableRows = cuotas.map((cuota) => {
  return [
    cuota.numero_cuota,
    formatDate(cuota.fecha_pago),
    parseFloat(cuota.monto).toFixed(2),
    parseFloat(cuota.monto_pagado || 0).toFixed(2),
    (cuota.monto - cuota.monto_pagado).toFixed(2),
    cuota.estado,
  ];
});

doc.autoTable({
  startY: 135,
  head: [["N°", "Fecha", "Monto", "Pagado", "Saldo", "Estado"]],
  body: tableRows,
  theme: "striped",
  styles: { fontSize: 8, cellPadding: 2 },
  headStyles: { fillColor: [66, 139, 202], fontStyle: "bold" },
  columnStyles: {
    0: { cellWidth: 15, halign: "center" },
    1: { cellWidth: 25 },
    2: { cellWidth: 20, halign: "right" },
    3: { cellWidth: 20, halign: "right" },
    4: { cellWidth: 20, halign: "right" },
    5: { cellWidth: 25, halign: "center" },
  },
});
```

### Múltiples Tablas

```javascript
// Primera tabla
doc.autoTable({
  startY: 50,
  head: [["Item", "Cantidad"]],
  body: [
    ["Producto A", "10"],
    ["Producto B", "5"],
  ],
});

// Segunda tabla después de la primera
const finalY1 = doc.lastAutoTable.finalY;
doc.autoTable({
  startY: finalY1 + 10, // 10mm de separación
  head: [["Total", "Monto"]],
  body: [
    ["Subtotal", "1000"],
    ["IVA", "130"],
  ],
});
```

## Layout y Posicionamiento

### Control de Posición Vertical

```javascript
export const generatePDF = (data) => {
  const doc = new jsPDF();
  let y = 20; // Posición inicial

  // Título
  doc.text("Título", 14, y);
  y += 10; // Avanzar 10mm

  // Subtítulo
  doc.text("Subtítulo", 14, y);
  y += 6; // Avanzar 6mm

  // Texto largo
  const lines = doc.splitTextToSize("Texto largo...", 180);
  doc.text(lines, 14, y);
  y += lines.length * 6; // 6mm por línea

  // Tabla
  doc.autoTable({
    startY: y,
    // ...
  });
  y = doc.lastAutoTable.finalY + 10; // Actualizar después de tabla

  // Continuar...
};
```

### Márgenes Estándar

```javascript
const marginLeft = 14; // mm desde la izquierda
const marginRight = 14; // mm desde la derecha
const pageWidth = 210; // A4 width en mm
const contentWidth = pageWidth - marginLeft - marginRight; // 182mm
```

### Saltos de Página

```javascript
const pageHeight = 297; // A4 height en mm
const marginBottom = 20;

if (y > pageHeight - marginBottom) {
  doc.addPage();
  y = 20; // Reset posición en nueva página
}
```

## Funciones Auxiliares del Proyecto

### formatDate

```javascript
// En src/common/functions.js
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "dd/MM/yyyy", { locale: es });
};
```

### Funciones de Cálculo

```javascript
// Cálculos complejos para préstamos
const interesMontoTotal = () => {
  const monto = parseFloat(prestamo.monto);
  const tasa = parseFloat(prestamo.tasa_interes);
  return monto * (tasa / 100) * prestamo.total_cuotas;
};

const saldoCapital = () => {
  const monto = parseFloat(prestamo.monto);
  const pagado = cuotas.reduce(
    (acc, cuota) => acc + parseFloat(cuota.monto_pagado || 0),
    0,
  );
  return (monto - pagado).toFixed(2);
};
```

## Patrones del Proyecto

### Documento de Préstamo Completo

Ver `src/prestamos/functions/generatePdfPrestamo.js`:

```javascript
export const generatePDF = (prestamo, cuotas) => {
  const doc = new jsPDF();
  let y = 20;

  // 1. Título
  doc.setFontSize(18);
  doc.text("Detalle de Préstamo", 14, y);
  y += 10;

  // 2. Información del Cliente
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Información del Cliente", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.text(`Nombre: ${prestamo.nombre} ${prestamo.apellido}`, 14, y);
  y += 6;
  // ... más campos

  // 3. Detalles del Préstamo
  doc.setFont("helvetica", "bold");
  doc.text("Detalles del Préstamo", 14, y);
  y += 6;
  // ... campos del préstamo

  // 4. Resumen Financiero
  doc.setFont("helvetica", "bold");
  doc.text("Resumen Financiero", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.text(`Capital Pagado: ${capitalPagado}`, 14, y);
  doc.text(`Interés Ganado: ${interesGanado}`, 110, y);
  y += 6;

  // 5. Tabla de Cuotas
  const tableColumn = [
    "N° Cuota",
    "Fecha",
    "Capital",
    "Interés",
    "Monto",
    "Pagado",
    "Saldo",
    "Estado",
  ];

  const tableRows = cuotas.map((cuota) => [
    cuota.numero_cuota,
    formatDate(cuota.fecha_pago),
    capitalPorCuota(cuota).toFixed(2),
    interesPorCuota(cuota).toFixed(2),
    parseFloat(cuota.monto).toFixed(2),
    parseFloat(cuota.monto_pagado || 0).toFixed(2),
    saldoCuota(cuota).toFixed(2),
    cuota.estado,
  ]);

  doc.autoTable({
    startY: y,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 139, 202], fontStyle: "bold" },
  });

  // 6. Generar output
  const pdfBlob = doc.output("blob");
  const pdfURL = URL.createObjectURL(pdfBlob);
  window.open(pdfURL, "_blank");
};
```

### Recibo de Pago (Voucher)

Ver `src/prestamos/functions/generatePaymentReceiptPDF.js`:

```javascript
export const generatePaymentReceiptPDF = (
  cliente,
  pago,
  usuario,
  formato = "carta",
) => {
  const isVoucher = formato === "voucher";

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: isVoucher ? [80, 200] : "letter",
  });

  let y = 20;

  // Título
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Comprobante de Pago", 14, y);
  y += 10;

  // Información del Cliente
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Información del Cliente", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.text("Nombre:", 14, y);
  doc.setFont("helvetica", "bold");
  const nombreCliente = doc.splitTextToSize(
    `${cliente.nombre} ${cliente.apellido}`,
    isVoucher ? 40 : 100,
  );
  doc.text(nombreCliente, 40, y);
  y += nombreCliente.length * 6;

  // Detalles del Pago
  doc.setFont("helvetica", "bold");
  doc.text("Detalles del Pago", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.text("Monto del Pago:", 14, y);
  doc.setFont("helvetica", "bold");
  doc.text(`${pago.monto}`, 50, y);
  y += 6;

  // Footer
  if (!isVoucher) {
    doc.setFontSize(10);
    doc.text("Gracias por su pago.", 14, y + 10);
  }

  // Abrir en nueva pestaña
  const pdfBlob = doc.output("blob");
  const pdfURL = URL.createObjectURL(pdfBlob);
  window.open(pdfURL, "_blank");
};
```

## Integración en Componentes

### Uso Básico

```javascript
import { generatePDF } from "../functions/generatePdfPrestamo";

export const PrestamoDetailPage = () => {
  const handleGeneratePDF = () => {
    generatePDF(prestamo, cuotas);
  };

  return <Button onClick={handleGeneratePDF}>Generar PDF</Button>;
};
```

### Con Hook Personalizado

```javascript
export const usePdfGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (data) => {
    setLoading(true);
    setError(null);
    try {
      generatePDF(data);
      return true;
    } catch (err) {
      setError("Error al generar PDF");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
};
```

## Buenas Prácticas

✅ **Usar variable `y`** para control de posición vertical
✅ **Separar funciones** de cálculo y generación
✅ **Formatear números** con `.toFixed(2)` para decimales
✅ **Usar `splitTextToSize`** para textos largos
✅ **Calcular anchos** según formato (voucher vs carta)
✅ **Incluir información** del usuario que genera el documento
✅ **Abrir en nueva ventana** con `window.open()` para preview
✅ **Naming consistente**: `generate{Document}PDF`

## Referencias del Proyecto

Ver implementaciones reales en:

- `src/prestamos/functions/generatePdfPrestamo.js`
- `src/prestamos/functions/generatePaymentReceiptPDF.js`
- `src/common/functions.js` (helpers de formateo)
