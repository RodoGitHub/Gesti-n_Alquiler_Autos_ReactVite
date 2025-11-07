import { resource } from "./api";

const base = "client";
const label = "Cliente";
const api = resource(base, label);

export const clientService = {
    ...api,
    // Si el backend requiere una ruta específica para registro, usar:
    // register: (payload) => api.post("register", payload),
};