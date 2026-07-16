import { useApi } from "../../hooks/useApi";
import { getEmpresasAdminRequest, getEmpresasByNameRequest, getPlanesRequest, getUsuariosEmpresaRequest, limpiarDatosEmpresaRequest, updatePlanesRequest, updatePlanMaxUsuariosRequest } from "../../api/admin";
import { registerRequest } from "../../api/auth";

export const useAdmin = () => {
    const { call, loading, error } = useApi();

    const getEmpresasAdmin = (payload) => call(() => getEmpresasAdminRequest(payload));
    const getEmpresasByName = (payload) => call(() => getEmpresasByNameRequest(payload));
    const getUsuariosEmpresa = (payload) => call(() => getUsuariosEmpresaRequest(payload));
    const getPlanes = (payload) => call(() => getPlanesRequest(payload));
    const updatePlan = (payload) => call(() => updatePlanesRequest(payload));
    const updatePlanMaxUsuarios = (id, max_usuarios) => call(() => updatePlanMaxUsuariosRequest(id, max_usuarios));
    const createEmpresa = (payload) => call(() => registerRequest(payload));
    const limpiarDatosEmpresa = (empresa_id) => call(() => limpiarDatosEmpresaRequest(empresa_id));

    return (
        {
            // metodos
            getEmpresasAdmin,
            getEmpresasByName,
            getUsuariosEmpresa,
            getPlanes,
            updatePlan,
            updatePlanMaxUsuarios,
            createEmpresa,
            limpiarDatosEmpresa,
            // variables
            loading,
            error
        }
    )
}
