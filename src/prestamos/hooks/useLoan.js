import { useApi } from "../../hooks/useApi";
import { getDocByIdRequest, getLoanByIdRequest, getLoansRequest, refinanciarPrestamoRequest, registerLoanRequest, updateLoanRequest, uploadDocRequest, getFiniquitoRequest, cancelarPrestamoRequest } from "../../api/prestamos";

export const useLoan = () => {
    const { call, loading, error } = useApi();

    const createLoan = (loan) => call(() => registerLoanRequest(loan));
    const getLoanById = (id, mostrarCuotas) => call(() => getLoanByIdRequest(id, mostrarCuotas));
    const updateLoan = (id, loan) => call(() => updateLoanRequest(id, loan));
    const getLoans = (payload) => call(() => getLoansRequest(payload));

    // archivos

    const uploadDoc = (id, file) => {
        const formData = new FormData();
        formData.append("archivo", file);
        return call(() => uploadDocRequest(id, formData), "No se pudo subir el archivo");
    }

    const getDoc = (id) => call(() => getDocByIdRequest(id), "Error al obtener archivos");

    const refinanciarLoan = (id, payload) => call(() => refinanciarPrestamoRequest(id, payload), "Error al refinanciar");

    const getFiniquito = (id) => call(() => getFiniquitoRequest(id), "Error al calcular el finiquito");
    const cancelarLoan = (id, payload) => call(() => cancelarPrestamoRequest(id, payload), "Error al cancelar el préstamo");

    return {
        // metodos
        createLoan,
        getLoans,
        getLoanById,
        updateLoan,
        uploadDoc,
        getDoc,
        refinanciarLoan,
        getFiniquito,
        cancelarLoan,
        // variables
        error,
        loading
    }
}
