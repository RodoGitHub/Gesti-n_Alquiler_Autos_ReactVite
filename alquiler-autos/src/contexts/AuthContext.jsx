import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth";
import { userService } from "../services/user";
import { AUTH_TYPE } from "../constants/authType";

export const AuthContext = createContext()
export const AuthProvider = ({children}) =>{
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
    } catch {
      clearTokens();
      setUser(null);;
      setStatus(AUTH_TYPE.UNAUTH);
    }
  };

  useEffect(() => {
    if (hasToken()) {
      fetchUser();
    } else {
      setStatus(AUTH_TYPE.UNAUTH);
    }
  }, []);

  const signIn = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      if (res.status === 200) {
        saveTokens(res.data);
        await fetchUser();
        return { ok: true, message: "Inicio de sesión exitoso" };
      } else {
        return {
          ok: false,
          message: res?.data?.message || "Error al iniciar sesión",
        };
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
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
    } catch {

    } finally {
      clearTokens();
      setUser(null);
      setStatus(AUTH_TYPE.UNAUTH);
    }
  };

  const refreshSession = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return;
    const res = await authService.refresh(refresh);
    saveTokens(res.data);
    return res;
  };

  const value = useMemo(
    () => ({ 
      user, 
      status, 
      signIn, 
      signOut, 
      refreshSession,
    }),
    [user, status]
  );

  return (
    <AuthContext.Provider 
      value={value}
    >
      {children}
    </AuthContext.Provider>);
}

