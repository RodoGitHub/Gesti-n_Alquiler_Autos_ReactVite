import api from "./interceptors";
import { resource } from "./api";

const base = "auth";
const label = "Auth";
const RESOURCE = resource(base, label);

const wrap = (promise, successMsg) =>
  promise
    .then(r => ({
      data: r.data,
      status: r.status,
      message: r.data?.message ?? successMsg,
      headers: r.headers,
    }))
    .catch(e => ({
      data: e.response?.data ?? null,
      status: e.response?.status ?? 500,
      message: e.response?.data?.detail ?? "Error en la solicitud",
      headers: e.response?.headers,
    }));

export const authService = {
  ...RESOURCE,

  // POST /auth/login/
  login: (credentials, config) =>
    RESOURCE.post("login", credentials, config),

  // POST /auth/refresh/
  refresh: (refreshToken, config) =>
    RESOURCE.post("refresh", { refresh: refreshToken }, config),

  // GET /auth/me/
  me: (config) =>
    wrap(api.get(`${base}/me`, config), "Perfil obtenido"),

  // POST /auth/logout/
  logout: (config) =>
    wrap(api.post(`${base}/logout`, null, config), "Sesión cerrada"),
};
