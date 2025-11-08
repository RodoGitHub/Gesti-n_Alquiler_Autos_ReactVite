import axios from "axios";
import { startLoading, stopLoading } from "../core/loading-bus";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    validateStatus: (s) => s < 500,
});


api.interceptors.request.use((config) => {
    // Solo activar loading global si no se especifica skipGlobalLoading
    if (!config.skipGlobalLoading) {
        startLoading();
    }
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
  (res) => { 
    // Solo detener loading global si no se especificó skipGlobalLoading
    if (!res.config?.skipGlobalLoading) {
        stopLoading(); 
    }
    return res; 
  },
  (error) => {
    // Solo detener loading global si no se especificó skipGlobalLoading
    if (!error.config?.skipGlobalLoading) {
        stopLoading();
    }

    const status = error?.response?.status;
    const normalized = {
      status,
      data: error?.response?.data,
      message: error?.response?.data?.message || error.message || "Request failed",
    };
    return Promise.reject(normalized);
  }
);
export default api