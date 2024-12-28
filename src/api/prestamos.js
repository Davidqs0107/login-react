import { LoginApi } from "./settings";

export const registerLoanRequest = (loan) => LoginApi.post(`/prestamos`, loan);
export const getLoanByIdRequest = (id, mostrarCuotas) => LoginApi.get(`/prestamos/${id}`, { params: { mostrarCuotas } });