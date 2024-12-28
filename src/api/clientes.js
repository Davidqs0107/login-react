import { LoginApi } from "./settings";
export const registerClientRequest = (client) => LoginApi.post(`/clientes`, client);
export const updateClientRequest = (client) => LoginApi.put(`/clientes/${client.id}`, client);
export const deleteClientRequest = (id, estado = true) => LoginApi.delete(`/clientes/soft/${id}`, { params: { estado } });
export const getClientRequest = (page = 1, pageSize = 10) =>
    LoginApi.get(`/clientes?page=${page}&pageSize=${pageSize}`);
