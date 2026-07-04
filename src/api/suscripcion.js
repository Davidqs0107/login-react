import { LoginApi } from "./settings";

// Estado de la suscripción de la empresa logueada (para banner)
export const getMiSuscripcionRequest = () => LoginApi.get(`/empresa/suscripcion`);
// Panel del super_admin: todas las suscripciones
export const getSuscripcionesRequest = (params = {}) => LoginApi.get(`/admin/suscripciones`, { params });
