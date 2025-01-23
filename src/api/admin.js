
import { LoginApi } from "./settings";

export const getEmpresasAdminRequest = (data) => LoginApi.get(`/admin`, { params: { ...data } });
export const getUsuariosEmpresaRequest = (data) => LoginApi.get(`/admin/usuarios/${data}`);
export const getPlanesRequest = (data) => LoginApi.get(`/admin/planes`, { params: { ...data } });
export const updatePlanesRequest = (data) => LoginApi.put(`/admin`, data);
