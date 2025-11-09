import { createContext, useEffect, useState } from "react";
import { authService } from "../services/auth";
import { AUTH_TYPE } from "../constants/authType";
import { startLoading, stopLoading } from "../core/loading-bus";

export const AuthContext = createContext();

const getMessageFromResponse = (res, fallback) =>
    res?.data?.message || res?.message || fallback;

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

export const AuthProvider = ({ children }) => {
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
        startLoading();
        try {
            const res = await authService.me();
            setUser(res.data);
            setStatus(AUTH_TYPE.AUTH);
            const message = getMessageFromResponse(res, "Usuario autenticado.");
            return { ok: true, message };
        } catch (e) {
            clearTokens();
            setUser(null);
            setStatus(AUTH_TYPE.UNAUTH);
            const message = getErrorMessage(e, "No autenticado.");
            return { ok: false, message, error: e };
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        const init = async () => {
            startLoading();
            try {
                if (!hasToken()) {
                    setStatus(AUTH_TYPE.UNAUTH);
                    return;
                }
                await fetchUser();
            } finally {
                stopLoading();
            }
        };
        init();
    }, []);

    const signIn = async (credentials) => {
        startLoading();
        try {
            const res = await authService.login(credentials);
            if (res.status === 200) {
                saveTokens(res.data);
                await fetchUser();
                const message = getMessageFromResponse(res, "Inicio de sesión exitoso.");
                return { ok: true, message };
            }
            const message = getMessageFromResponse(res, "Error al iniciar sesión.");
            return { ok: false, message };
        } catch (err) {
            const message = getErrorMessage(err, "Usuario o contraseña incorrectos.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const signOut = async () => {
        startLoading();
        try {
            const res = await authService.logout(); // opcional según backend
            const message = getMessageFromResponse(res, "Sesión cerrada.");
            return { ok: true, message };
        } catch (e) {
            const message = getErrorMessage(e, "Sesión finalizada localmente.");
            return { ok: false, message };
        } finally {
            clearTokens();
            setUser(null);
            setStatus(AUTH_TYPE.UNAUTH);
            stopLoading();
        }
    };

    const refreshSession = async () => {
        startLoading();
        try {
            const refresh = localStorage.getItem("refresh");
            if (!refresh) return null;
            const res = await authService.refresh(refresh);
            saveTokens(res.data);
            const message = getMessageFromResponse(res, "Sesión renovada.");
            return { ok: true, message, data: res.data };
        } catch (e) {
            clearTokens();
            setUser(null);
            setStatus(AUTH_TYPE.UNAUTH);
            const message = getErrorMessage(e, "No se pudo renovar la sesión.");
            return { ok: false, message, error: e };
        } finally {
            stopLoading();
        }
    };

    const value = {
        user,
        status,
        signIn,
        signOut,
        refreshSession,
        fetchUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
