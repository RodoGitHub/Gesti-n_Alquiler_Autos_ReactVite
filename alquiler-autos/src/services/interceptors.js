import axios from "axios";
import { startLoading, stopLoading } from "./loading-bus";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

//Interceptors
api.interceptors.request.use((config) => {
    startLoading();
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        stopLoading();
        const status = error?.response?.status;

        //refresh token, acá haría el refresh 
        if (status === 401) {
            localStorage.removeItem("token");
            // opcional: window.location.assign('/login');
        }

        const normalized = {
        status,
        data: error?.response?.data,
        message: error?.response?.data?.message || error.message || "Request failed",
        };
        return Promise.reject(normalized);
    }
);

export default api