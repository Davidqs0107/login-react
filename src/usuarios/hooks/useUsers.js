import { useState } from 'react';
import { deleteUserRequest, getUserRequest, getUsersRequest, registerUserRequest, updateUserCobradorRequest, updateUserRequest } from "../../api/usuarios";

export const useUsers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createUser = async (user) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await registerUserRequest(user);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const updateUser = async (user) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await updateUserRequest(user);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const updateUserCobrador = async (user) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await updateUserCobradorRequest(user);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const deleteUser = async ({ id, estado = true }) => {
        setLoading(true);
        setError(null);
        try {
            await deleteUserRequest(id, estado);
            return true;
        } catch (err) {
            let error = "Error desconocido";
            if (err.response.data.msg) {
                error = err.response.data.msg;
            }
            setError(err.response?.data?.msg || error);
            return false;
        } finally {
            setLoading(false);
        }
    };
    const getUsers = async (page = 1, pageSize = 10) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getUsersRequest(page, pageSize);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const getUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getUserRequest(id);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }
    return {
        //metodos
        createUser,
        updateUser,
        updateUserCobrador,
        deleteUser,
        getUsers,
        getUser,
        //variables
        loading, error
    };
};
