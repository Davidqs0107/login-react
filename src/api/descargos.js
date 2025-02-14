import { LoginApi } from "./settings";

export const getDescargosRequest = (data) => LoginApi.get(`/descargos`, { params: { ...data } });
export const getDescargosByUserRequest = (data) => LoginApi.get(`/descargos/usuario`, { params: { ...data } });
export const createDescargoRequest = (data) => LoginApi.post(`/descargos`, data);
export const aprobarDescargoRequest = (data) => LoginApi.put(`/descargos`, data);
