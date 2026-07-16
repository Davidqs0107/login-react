import { useApi } from '../../hooks/useApi';
import { deleteUserRequest, getUserRequest, getUsersRequest, registerUserRequest, updateUserCobradorRequest, updateUserRequest } from "../../api/usuarios";

export const useUsers = () => {
    const { call, loading, error } = useApi();

    const createUser = (user) => call(() => registerUserRequest(user));
    const updateUser = (user) => call(() => updateUserRequest(user));
    const updateUserCobrador = (user) => call(() => updateUserCobradorRequest(user));
    const deleteUser = async ({ id, estado = true }) => (await call(() => deleteUserRequest(id, estado))) !== null;
    const getUsers = (page = 1, pageSize = 10) => call(() => getUsersRequest(page, pageSize));
    const getUser = (id) => call(() => getUserRequest(id));
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
