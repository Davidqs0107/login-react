import { useApi } from "../../hooks/useApi";
import { getDocByIdRequest, getLoanByIdRequest, getLoansRequest, refinanciarPrestamoRequest, registerLoanRequest, updateLoanRequest, uploadDocRequest } from "../../api/prestamos";

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

    return {
        // metodos
        createLoan,
        getLoans,
        getLoanById,
        updateLoan,
        uploadDoc,
        getDoc,
        refinanciarLoan,
        // variables
        error,
        loading
    }
}
