
import { LoginApi } from "./settings";

export const getEmpresasAdminRequest = (data) => LoginApi.get(`/admin`, { params: { ...data } });
export const getPlanesRequest = (data) => LoginApi.get(`/admin/planes`, { params: { ...data } });
export const updatePlanesRequest = (data) => LoginApi.put(`/admin`, data);
