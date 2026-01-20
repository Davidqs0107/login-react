import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { formatDate, formtaTipoPrestamo } from "../../common/functions";
import { tipoPrestamo } from "../../common/constans";

export const generatePDF = (prestamo, cuotas) => {
    const doc = new jsPDF();

    // ============ FUNCIONES DE CÁLCULO ============

    // Calcula el interés total del préstamo
    const interesMontoTotal = () => {
        if (prestamo.monto && prestamo.tasa_interes && prestamo.tipo_prestamo === tipoPrestamo.Fijo) {
            const monto = parseFloat(prestamo.monto);
            const tasa = parseFloat(prestamo.tasa_interes);
            return monto * (tasa / 100) * prestamo.total_cuotas;
        } else {
            const monto = parseFloat(prestamo.monto || 0);
            const tasa = parseFloat(prestamo.tasa_interes || 0);
            return monto * (tasa / 100);
        }
    };

    // Calcula cuánto capital hay en cada cuota
    const capitalPorCuota = (cuota) => {
        if (!prestamo.monto || !prestamo.total_cuotas) return 0;
        const monto = parseFloat(prestamo.monto);

        if (prestamo.tipo_prestamo === tipoPrestamo.Fijo) {
            return cuota.numero_cuota === prestamo.total_cuotas ? monto : 0;
        }
        return monto / prestamo.total_cuotas;
    };

    // Calcula cuánto interés hay en cada cuota
    const interesPorCuota = (cuota) => {
        const capital = capitalPorCuota(cuota);
        return parseFloat(cuota.monto) - capital;
    };

    // Saldo Capital: capital que aún NO se ha pagado
    const saldoCapital = () => {
        if (!prestamo.monto || !prestamo.total_cuotas) return "0.00";
        const monto = parseFloat(prestamo.monto);

        if (prestamo.tipo_prestamo === tipoPrestamo.Fijo) {
            const ultimaCuota = cuotas.find(c => c.numero_cuota === prestamo.total_cuotas);
            if (!ultimaCuota) return monto.toFixed(2);

            const montoPagado = parseFloat(ultimaCuota.monto_pagado || 0);
            const capitalPagado = Math.min(montoPagado, monto);
            return (monto - capitalPagado).toFixed(2);
        }

        const capitalPagadoTotal = cuotas.reduce((acc, cuota) => {
            const montoPagado = parseFloat(cuota.monto_pagado || 0);
            const capitalCuota = capitalPorCuota(cuota);
            const interesCuota = interesPorCuota(cuota);
            const capitalPagado = Math.max(0, montoPagado - interesCuota);
            return acc + Math.min(capitalPagado, capitalCuota);
        }, 0);

        return (monto - capitalPagadoTotal).toFixed(2);
    };

    // Interés Ganado
    const interesGanado = () => {
        if (prestamo.tipo_prestamo === tipoPrestamo.Fijo) {
            return cuotas.reduce((acc, cuota) => {
                const montoPagado = parseFloat(cuota.monto_pagado || 0);
                const interesCuota = interesPorCuota(cuota);

                if (cuota.numero_cuota === prestamo.total_cuotas) {
                    const interesGanadoCuota = Math.min(montoPagado, interesCuota);
                    return acc + interesGanadoCuota;
                }
                return acc + montoPagado;
            }, 0).toFixed(2);
        }

        return cuotas.reduce((acc, cuota) => {
            const montoPagado = parseFloat(cuota.monto_pagado || 0);
            const interesCuota = interesPorCuota(cuota);
            const interesGanadoCuota = Math.min(montoPagado, interesCuota);
            return acc + interesGanadoCuota;
        }, 0).toFixed(2);
    };

    // Saldo de Interés
    const saldoInteres = () => {
        return (interesMontoTotal() - parseFloat(interesGanado())).toFixed(2);
    };

    // Saldo por cuota
    const saldoCuota = (cuota) => {
        return parseFloat(cuota.monto) - parseFloat(cuota.monto_pagado || 0);
    };

    // ============ GENERACIÓN DEL PDF ============

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

    // Resumen Financiero
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Resumen Financiero", 14, 116);
    doc.setFont(undefined, 'normal');

    const capitalPagado = (parseFloat(prestamo.monto) - parseFloat(saldoCapital())).toFixed(2);
    const saldoCapitalValue = saldoCapital();
    const interesGanadoValue = interesGanado();
    const saldoInteresValue = saldoInteres();

    doc.text(`Capital Pagado: ${capitalPagado}`, 14, 122);
    doc.text(`Saldo Capital Pendiente: ${saldoCapitalValue}`, 14, 128);
    doc.text(`Interés Ganado: ${interesGanadoValue}`, 110, 122);
    doc.text(`Saldo Interés Pendiente: ${saldoInteresValue}`, 110, 128);

    // Tabla de Cuotas
    const tableColumn = [
        "N° Cuota",
        "Fecha",
        "Capital",
        "Interés",
        "Monto",
        "Pagado",
        "Saldo",
        "Estado"
    ];

    const tableRows = cuotas.map(cuota => {
        const monto = parseFloat(prestamo.monto);
        const capitalCuota = capitalPorCuota(cuota);
        const interesCuota = interesPorCuota(cuota);

        // Calcular saldo capital después de esta cuota
        let saldoCapitalCuota;
        if (prestamo.tipo_prestamo === tipoPrestamo.Fijo) {
            saldoCapitalCuota = cuota.numero_cuota === prestamo.total_cuotas && cuota.estado !== "pagada"
                ? monto.toFixed(2)
                : "0.00";
        } else {
            const capitalPorCuotaNormal = monto / prestamo.total_cuotas;
            const cuotasRestantes = prestamo.total_cuotas - cuota.numero_cuota;
            saldoCapitalCuota = (capitalPorCuotaNormal * cuotasRestantes).toFixed(2);
        }

        return [
            cuota.numero_cuota,
            formatDate(cuota.fecha_pago),
            capitalCuota.toFixed(2),
            interesCuota.toFixed(2),
            parseFloat(cuota.monto).toFixed(2),
            parseFloat(cuota.monto_pagado || 0).toFixed(2),
            saldoCuota(cuota).toFixed(2),
            cuota.estado
        ];
    });

    doc.autoTable({
        startY: 135,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [66, 139, 202], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 15 },  // N° Cuota
            1: { cellWidth: 20 },  // Fecha
            2: { cellWidth: 18 },  // Monto
            3: { cellWidth: 18 },  // Pagado
            4: { cellWidth: 18 },  // Saldo
            5: { cellWidth: 18 },  // Capital
            6: { cellWidth: 18 },  // Interés
            7: { cellWidth: 25 },  // Saldo Capital
            8: { cellWidth: 20 }   // Estado
        },
        margin: { top: 10, left: 14, right: 14 }
    });

    // Guardar el PDF
    // doc.save(`detalle_prestamo_${prestamo.id}.pdf`);

    const pdfBlob = doc.output("blob"); // Genera el PDF como un Blob
    const pdfURL = URL.createObjectURL(pdfBlob); // Crea un URL temporal
    window.open(pdfURL, "_blank");
};
