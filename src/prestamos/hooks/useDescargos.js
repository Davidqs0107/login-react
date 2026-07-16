import { useApi } from "../../hooks/useApi";
import { aprobarDescargoRequest, createDescargoRequest, getDescargosByUserRequest, getDescargosRequest } from "../../api/descargos";

export const useDescargos = () => {
    const { call, loading, error } = useApi();

    const getDescargos = (payload) => call(() => getDescargosRequest(payload));
    const getDescargosByUser = (payload) => call(() => getDescargosByUserRequest(payload));
    const createDescargo = (descargo) => call(() => createDescargoRequest(descargo));
    const aprobarDescargo = (descargo) => call(() => aprobarDescargoRequest(descargo));
    return {
        //metodos
        getDescargos,
        getDescargosByUser,
        createDescargo,
        aprobarDescargo,
        //variables
        loading,
        error,
    }
}
