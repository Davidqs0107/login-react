import { useApi } from "../../hooks/useApi";
import { getSummaryCobradorRequest, getSummaryRequest, getById, update } from "../../api/empresa";
import { useAuth } from "../../context/AuthContex";

export const useEmpresa = () => {

    const { call, loading, error } = useApi();
    const getSummary = () => call(() => getSummaryRequest());
    const getSummaryCobrador = () => call(() => getSummaryCobradorRequest());
    const getEmpresa = () => call(() => getById(), "Error al obtener la empresa");
    const updateEmpresa = (empresa) => call(() => update(empresa), "Error al actualizar la empresa");
    return (
        {
            //metodos
            getSummary,
            getSummaryCobrador,
            getEmpresa,
            updateEmpresa,
            //variables
            loading, error
        }
    )
}
