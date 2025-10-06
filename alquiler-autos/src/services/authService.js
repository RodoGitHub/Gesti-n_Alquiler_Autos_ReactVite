import api from "./api"; // tu configuración base (axios o fetch con token)

export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error al iniciar sesión";
    }
    };

    export const registerUser = async (formData) => {
    try {
        const response = await api.post("/auth/register", formData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error al registrar usuario";
    }
};
