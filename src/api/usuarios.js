import { LoginApi } from "./settings";

export const registerUserRequest = (user) => LoginApi.post(`/user`, user);
export const updateUserRequest = (user) => LoginApi.put(`/user/${user.id}`, user);
export const updateUserCobradorRequest = (user) => LoginApi.put(`/user/cobrador/${user.id}`, user);
export const getUsersRequest = (page = 1, pageSize = 10) =>
    LoginApi.get(`/user?page=${page}&pageSize=${pageSize}`);
export const getUserRequest = (id) => LoginApi.get(`/user/${id}`);
export const deleteUserRequest = (id, estado) => LoginApi.delete(`/user/soft/${id}`, { params: { estado } });