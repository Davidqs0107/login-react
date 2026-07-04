import { LoginApi } from "./settings";

export const getConfiguracionRequest = () => LoginApi.get(`/configuracion`);
export const updateConfiguracionRequest = (data) => LoginApi.put(`/configuracion`, data);
