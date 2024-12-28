import { LoginApi } from "./settings";


export const registerRequest = (user) => LoginApi.post(`/auth/register`, user);

export const loginRequest = (user) => LoginApi.post(`/auth/login`, user);
export const renewToken = () => LoginApi.get(`/auth/renew`);