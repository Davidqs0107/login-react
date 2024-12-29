import { LoginApi } from "./settings";

export const registerLoanRequest = (loan) => LoginApi.post(`/prestamos`, loan);
export const getLoanByIdRequest = (id, mostrarCuotas) => LoginApi.get(`/prestamos/${id}`, { params: { mostrarCuotas } });
export const getLoansRequest = (data) => LoginApi.get(`/prestamos`, { params: { ...data } });
export const updateLoanRequest = (id, loan) => LoginApi.put(`/prestamos/${id}`, loan);