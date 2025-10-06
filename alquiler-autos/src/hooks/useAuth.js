import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/authService";

export const useAuth = () => {
    const { setUser, setStatus } = useContext(AuthContext);

    const login = async (email, password) => {
        setStatus("loading");
        try {
        const userData = await loginUser(email, password);
        setUser(userData.user);
        localStorage.setItem("token", userData.token);
        setStatus("success");
        return true;
        } catch (error) {
        setStatus("error");
        throw error;
        }
    };

    const register = async (formData) => {
        setStatus("loading");
        try {
        await registerUser(formData);
        setStatus("success");
        return true;
        } catch (error) {
        setStatus("error");
        throw error;
        }
    };

    return { login, register };
};
