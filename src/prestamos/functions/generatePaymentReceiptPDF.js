import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { formatDateWithDateFns } from "../../common/functions";

export const generatePaymentReceiptPDF = (cliente, pago, usuario, formato = "carta") => {
    const isVoucher = formato === "voucher";

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: isVoucher ? [80, 200] : "letter",
    });

    let y = 20; // Control de posición vertical

    // Título del PDF
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
    const nombreCliente = doc.splitTextToSize(`${cliente.nombre} ${cliente.apellido}`, isVoucher ? 40 : 100);
    doc.text(nombreCliente, 40, y);
    y += nombreCliente.length * 6;

    doc.setFont("helvetica", "normal");
    doc.text("CI:", 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${cliente.ci}`, 40, y);
    y += 6;

    // Información del Pago
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Pago", 14, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text("Monto del Pago:", 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${pago.monto}`, 50, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text("Tipo de Pago:", 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${pago.tipo_pago}`, 50, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text("Fecha:", 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${formatDateWithDateFns(pago.fecha)}`, 50, y);
    y += 6;

    // Información del Usuario que realizó el cobro
    doc.setFont("helvetica", "bold");
    doc.text("Información del Usuario", 14, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text("Usuario:", 14, y);
    doc.setFont("helvetica", "bold");

    // Separar nombre y ID en una sola línea si es posible
    const nombreUsuario = `${usuario.nombre} (${usuario.id})`;
    const nombreUsuarioLines = doc.splitTextToSize(nombreUsuario, isVoucher ? 30 : 100);
    doc.text(nombreUsuarioLines, 40, y);
    y += nombreUsuarioLines.length * 6;

    // Footer
    if (!isVoucher) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Gracias por su pago.", 14, y + 10);
    }

    // Crear un Blob del PDF y abrirlo en una nueva pestaña
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, "_blank");
};
