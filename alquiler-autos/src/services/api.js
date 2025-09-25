import api from "./interceptors";

/**
 * Crea un cliente CRUD para un recurso de la API.
 *
 * @param {string} basePath - Ruta base del recurso (ej: "users", "products").
 * @param {string} [label="Recurso"] - Nombre legible del recurso (para mensajes).
 *
 * @returns {{
 *   list:   (config?: object) => Promise<{data:any,status:number,message:string,headers:any}>,
 *   get:    (id: number|string, config?: object) => Promise<...>,
 *   create: (payload: object, config?: object) => Promise<...>,
 *   update: (id: number|string, payload: object, config?: object) => Promise<...>,
 *   remove: (id: number|string, config?: object) => Promise<...>,
 * }}
 *
 * @example
 * // Definición
 * export const usersService = resource("users", "Usuario");
 * export const productsService = resource("products", "Producto");
 *
 * // Uso
 * const res = await usersService.list({ params: { page: 1 } });
 * console.log(res.data);
 * console.log(res.status);
 * console.log(res.message);
 *
 * const created = await productsService.create({ name: "Manzana" });
 * console.log(created.message); // "Producto creado correctamente"
 */
export const resource = (basePath, label = "Recurso") => ({
    list: (config) => api.get(basePath, config).then((r) => ({
        data: r.data,
        status: r.status,
        message: r.data?.message ?? `${label}s obtenidos`,
        headers: r.headers
    })),
    get: (config) => api.get(basePath, config).then((r) => ({
        data: r.data,
        status: r.status,
        message: r.data?.message ?? `${label} obtenido`,
        headers: r.headers
    })),
    getByID: (id, config) => api.get(`${basePath}/${id}`, config).then((r) => ({
        data: r.data,
        status: r.status,
        message: r.data?.message ?? `${label} obtenido`,
        headers: r.headers
    })),
    create: (payload, config) => api.post(basePath, payload, config).then((r) => ({
        data: r.data,
        status: r.status,
        message: r.data?.message ?? `${label} creado`,
        headers: r.headers
    })),
    update: (id, payload, config) => api.patch(`${basePath}/${id}`, payload, config).then((r) => ({
        data: r.data,
        status: r.status,
        message: r.data?.message ?? `${label} actualizado`,
        headers: r.headers
    })),
    remove: (id, config) => api.delete(`${basePath}/${id}`, config).then((r) => ({
        data: r.data,
        status: r.status,
        message: r.data?.message ?? `${label} eliminado`,
        headers: r.headers
    })),
});
