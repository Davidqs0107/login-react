import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";
const { VITE_API_URL } = getEnvVariables();

export const LoginApi = axios.create({
    baseURL: `${VITE_API_URL}`,
});

LoginApi.interceptors.request.use(config => {

    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }
    return config;
})