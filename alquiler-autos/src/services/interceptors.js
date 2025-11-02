import axios from "axios";
import { startLoading, stopLoading } from "../core/loading-bus";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    validateStatus: (s) => s < 500,
});


api.interceptors.request.use((config) => {
    startLoading();
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
  (res) => { stopLoading(); return res; },
  (error) => {
    stopLoading();

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