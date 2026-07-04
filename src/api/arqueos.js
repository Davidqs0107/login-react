import { LoginApi } from "./settings";

export const getResumenDiaRequest = (params = {}) => LoginApi.get(`/arqueos/resumen`, { params });
export const cerrarArqueoRequest = (data) => LoginApi.post(`/arqueos`, data);
export const getArqueosRequest = (params = {}) => LoginApi.get(`/arqueos`, { params });
export const resolverArqueoRequest = (id, estado) => LoginApi.put(`/arqueos/${id}/resolver`, { estado });
