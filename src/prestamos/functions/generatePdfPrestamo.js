import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { formatDate, formtaTipoPrestamo } from "../../common/functions";

export const generatePDF = (prestamo, cuotas) => {
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text("Detalle de Préstamo", 14, 20);

    // Información del Cliente
    doc.setFontSize(12);
    doc.text("Información del Cliente", 14, 30);
    doc.text(`Nombre: ${prestamo.nombre} ${prestamo.apellido}`, 14, 36);
    doc.text(`CI: ${prestamo.ci}`, 14, 42);
    doc.text(`Email: ${prestamo.email}`, 14, 48);
    doc.text(`Dirección: ${prestamo.direccion}`, 14, 54);
    doc.text(`Teléfono: ${prestamo.telefono}`, 14, 60);

    // Detalles del Préstamo
    doc.text("Detalles del Préstamo", 14, 70);
    doc.text(`Monto: ${prestamo.monto}`, 14, 76);
    doc.text(`Tipo: ${formtaTipoPrestamo(prestamo.tipo_prestamo)}`, 14, 82);
    doc.text(`Tasa de Interés: ${prestamo.tasa_interes}%`, 14, 88);
    doc.text(`Frecuencia de Pago: ${prestamo.frecuencia_pago}`, 14, 94);
    doc.text(`Total de Cuotas: ${prestamo.total_cuotas}`, 14, 100);
    doc.text(`Fecha de Inicio: ${formatDate(prestamo.fecha_inicio)}`, 14, 106);

    // Tabla de Cuotas
    const tableColumn = ["N° Cuota", "Fecha de Pago", "Monto", "Monto Pagado", "Estado"];
    const tableRows = cuotas.map(cuota => [
        cuota.numero_cuota,
        new Date(cuota.fecha_pago).toLocaleDateString(),
        cuota.monto,
        cuota.monto_pagado,
        cuota.estado
    ]);

    doc.autoTable({
        startY: 120,
        head: [tableColumn],
        body: tableRows,
    });

    // Guardar el PDF
    doc.save(`detalle_prestamo_${prestamo.id}.pdf`);
};
