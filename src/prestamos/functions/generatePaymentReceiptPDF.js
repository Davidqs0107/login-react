import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { formatDateWithDateFns } from "../../common/functions";

export const generatePaymentReceiptPDF = (cliente, pago, usuario, formato = "carta") => {
    const doc = new jsPDF({
        orientation: formato === "voucher" ? "portrait" : "portrait",
        unit: "mm",
        format: formato === "voucher" ? [80, 200] : "letter",
    });

    // Título del PDF
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Comprobante de Pago", 14, 20);

    // Información del Cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Información del Cliente", 14, 30);

    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: `, 14, 36);
    doc.setFont("helvetica", "bold");
    doc.text(`${cliente.nombre} ${cliente.apellido}`, 40, 36);

    doc.setFont("helvetica", "normal");
    doc.text(`CI: `, 14, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`${cliente.ci}`, 40, 42);

    // Información del Pago
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Pago", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.text(`Monto del Pago: `, 14, 58);
    doc.setFont("helvetica", "bold");
    doc.text(`${pago.monto}`, 50, 58);

    doc.setFont("helvetica", "normal");
    doc.text(`Tipo de Pago: `, 14, 64);
    doc.setFont("helvetica", "bold");
    doc.text(`${pago.tipo_pago}`, 50, 64);

    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: `, 14, 70);
    doc.setFont("helvetica", "bold");
    doc.text(`${formatDateWithDateFns(pago.fecha)}`, 50, 70);

    // Información del Usuario que realizó el cobro
    doc.setFont("helvetica", "bold");
    doc.text("Información del Usuario", 14, 80);

    doc.setFont("helvetica", "normal");
    doc.text(`Usuario: `, 14, 86);
    doc.setFont("helvetica", "bold");
    doc.text(`${usuario.nombre} (${usuario.id})`, 40, 86);

    // Footer
    if (formato === "carta") {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Gracias por su pago.", 14, 200);
    }

    // Guardar el PDF
    // const fileName = `comprobante_pago_${pago.id}.pdf`;
    // doc.save(fileName);

    const pdfBlob = doc.output("blob"); // Genera el PDF como un Blob
    const pdfURL = URL.createObjectURL(pdfBlob); // Crea un URL temporal
    window.open(pdfURL, "_blank");
};
