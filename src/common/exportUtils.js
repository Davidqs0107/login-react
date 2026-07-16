import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, columns, filename = 'reporte') => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }
    const worksheetData = data.map(row => {
        const newRow = {};
        columns.forEach(col => {
            const raw = col.key.split('.').reduce((obj, key) => obj?.[key], row);
            newRow[col.label] = col.format ? col.format(raw, row) : (raw ?? '');
        });
        return newRow;
    });

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (data, columns, title) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 20);

    const tableData = data.map(row =>
        columns.map(col => {
            const raw = col.key.split('.').reduce((obj, key) => obj?.[key], row);
            const value = col.format ? col.format(raw, row) : raw;
            return value ?? '';
        })
    );

    doc.autoTable({
        head: [columns.map(col => col.label)],
        body: tableData,
        startY: 30
    });

    doc.save(`${title}.pdf`);
};