import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth";
import { AUTH_TYPE } from "../constants/authType";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(AUTH_TYPE.LOADING);

    const saveTokens = (data) => {
        if (!data) return;
        if (data.token) localStorage.setItem("token", data.token);
        if (data.access) localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
    };

    const clearTokens = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    };

    const hasToken = () =>
        !!(localStorage.getItem("token") || localStorage.getItem("access"));

    const fetchUser = async () => {
        try {
        const res = await authService.me();
        setUser(res.data);
        setStatus(AUTH_TYPE.AUTH);
        return { ok: true };
        } catch (e) {
        clearTokens();
        setUser(null);
        setStatus(AUTH_TYPE.UNAUTH);
        return { ok: false, error: e };
        }
    };

    useEffect(() => {
        const init = async () => {
        if (!hasToken()) {
            setStatus(AUTH_TYPE.UNAUTH);
            setLoading(false);
            return;
        }
        await fetchUser();
        setLoading(false);
        };
        init();
        
    }, []);

    const signIn = async (credentials) => {
        try {
        const res = await authService.login(credentials);
        if (res.status === 200) {
            saveTokens(res.data);
            await fetchUser();
            return { ok: true, message: "Inicio de sesión exitoso" };
        }
        return { ok: false, message: res?.data?.message || "Error al iniciar sesión" };
        } catch (err) {
        return {
            ok: false,
            message:
            err?.response?.data?.message ||
            err?.message ||
            "Usuario o contraseña incorrectos",
        };
        }
    };

    const signOut = async () => {
        try {
            await authService.logout(); //revisar al final del proyecto
        } finally {
            clearTokens();
            setUser(null);
            setStatus(AUTH_TYPE.UNAUTH);
        }
    };

    const refreshSession = async () => {
        try {
            const refresh = localStorage.getItem("refresh");
            if (!refresh) return null;
            const res = await authService.refresh(refresh);
            saveTokens(res.data);
            return res;
        } catch (e) {

            clearTokens();
            setUser(null);
            setStatus(AUTH_TYPE.UNAUTH);
            return null;
        }
    };

    const value = useMemo(
        () => ({
            user,
            status,
            loading,
            signIn,
            signOut,
            refreshSession,
            fetchUser,
        }),
        [user, status, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
