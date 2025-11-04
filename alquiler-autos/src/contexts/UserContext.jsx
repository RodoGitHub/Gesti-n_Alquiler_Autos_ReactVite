import { createContext, useEffect, useMemo, useState } from "react";
import { userService } from "../services/user"; 

export const UserContext = createContext()
export const UserProvider = ({children}) =>{
  
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

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

    const fetchUsers = async () => {
        try {
            const res = await userService.list();
            const data = res?.data?.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setUsers([]);
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

    const editUser = async (id, { nombre, correo, password, rol }) => {
        try {
            const payload = { nombre, correo, ...(password && { password }), rol };
            const res = await userService.update(id, payload);

            const ok = res.status === 200 || res.status === 201;
            const msg = res?.data?.message || (ok ? "Usuario actualizado." : "Error al actualizar el usuario.");

            return { ok, message: msg, data: res?.data };
        } catch (err) {
            console.error("Error al actualizar usuario:", err);
            const msg = err?.response?.data?.message || err?.message || "Error al actualizar el usuario.";

            return { ok: false, message: msg };
        }
    };

    const getUserById = async (id) => {
        try {
            console.log(`[API CALL] getUserById(${id}) - Verifica en Network tab que solo se ejecuta cuando editas`);
            const res = await userService.get(id);
            return res?.data?.data || null;
        } catch (err) {
            console.error("Error al obtener usuario:", err);
            return null;
        }
    };

    const value = useMemo(() => ({
        roles,
        users,
        registerUser,
        editUser,
        fetchUsers,
        getUserById
    }),[roles, users]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
