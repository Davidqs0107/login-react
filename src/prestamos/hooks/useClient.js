
import { useState } from 'react'
import { deleteClientRequest, getClientRequest, registerClientRequest, updateClientRequest } from '../../api/clientes';
export const useClient = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const createClient = async (client) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await registerClientRequest(client);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const updateClient = async (client) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await updateClientRequest(client);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const deleteClient = async ({ id, estado = true }) => {
        setLoading(true);
        setError(null);
        try {
            await deleteClientRequest(id, estado);
            return true;
        } catch (err) {
            let error = "Error desconocido";
            if (err.response.data.msg) {
                error = err.response.data.msg;
            }
            setError(err.response?.data?.message || error);
            return false;
        } finally {
            setLoading(false);
        }
    };
    const getClients = async (page = 1, pageSize = 10) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getClientRequest(page, pageSize);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
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
