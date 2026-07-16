
import { useApi } from '../../hooks/useApi';
import { deleteClientRequest, getClientRequest, registerClientRequest, updateClientRequest } from '../../api/clientes';
import { useAuth } from '../../context/AuthContex';
export const useClient = () => {

    const { call, loading, error } = useApi();
    const createClient = (client) => call(() => registerClientRequest(client));
    const updateClient = (client) => call(() => updateClientRequest(client));
    const deleteClient = async ({ id, estado = true }) => (await call(() => deleteClientRequest(id, estado))) !== null;
    const getClients = (page = 1, pageSize = 10) => call(() => getClientRequest(page, pageSize));
    return {
        // metodos
        createClient,
        updateClient,
        deleteClient,
        getClients,
        // variables
        loading,
        error
    }
}
