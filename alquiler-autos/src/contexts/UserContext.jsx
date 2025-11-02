import { createContext, useEffect, useMemo, useState } from "react";
import { userService } from "../services/user"; 

export const UserContext = createContext()
export const UserProvider = ({children}) =>{
  
    const [roles, setRoles] = useState([]);

    const fetchRoles = async () => {
        try {
            const res = await userService.roles();
            const data = res?.data?.data 
            setRoles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al obtener roles:", err);
            setRoles([]); 
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []); 

    const registerUser = async ({ nombre, correo, password, rol }) => {
        try {
            const payload = { nombre, correo, password, rol };
            const res = await userService.register(payload);

            const ok = res.status === 200 || res.status === 201;
            const msg = res?.data?.message || (ok ? "Usuario registrado." : "Error al registrar el usuario.");

            return { ok, message: msg, data: res?.data };
        } catch (err) {
            console.error("Error al registrar usuario:", err);
            const msg = err?.response?.data?.message || err?.message || "Error al registrar el usuario.";

            return { ok: false, message: msg };
        }
        };

    const value = useMemo(() => ({
        roles,
        registerUser
    }),[roles]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
