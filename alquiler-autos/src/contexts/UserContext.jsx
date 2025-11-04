import { createContext, useEffect, useMemo, useState } from "react";
import { userService } from "../services/user"; 

export const UserContext = createContext()
export const UserProvider = ({children}) =>{
  
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([])

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

    const fetchUser = async () => {
        try {
            const res = await userService.list();
            const ok = res.status === 200 || res.status === 201;
            const msg = res?.message || (ok ? "Lista de usuarios exitosa" : "Error al consultar usuarios.");
            console.log(res.data)
            if (ok && res?.data?.data) {
                setUsers(res.data.data.filter(user => user.is_active));

            }
            return { ok, message: msg};
        } catch (err) {
            console.error("Error al consultar usuarios:", err);
            const msg = err?.response?.data?.message || err?.message || "Error al consultar usuarios.";

            return { ok: false, message: msg };
        }

    };

    const editUser = async (id, updated) => {
        try {
            await userService.update(id, updated);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...u, ...updated } : u))
            );
        } catch (err) {
            console.error("Error al editar usuario:", err);
            alert(err?.response?.data?.message || err.message || "Error al editar usuario.");
        }
    };


    const deleteUser = async (id) => {
        try {
            const res = await userService.delete(id);
            const ok = res.status === 200 || res.status === 204;
            const message = res.message || (ok ? "Usuario eliminado exitosamente." : "Error al eliminar usuario.");
            
            return { ok, message };
        } catch (err) {
            console.error("Error al eliminar usuario:", err?.response || err);
            const message = err?.response?.data?.message || err?.message || "Error al eliminar usuario.";
            
            return { ok: false, message };
        } finally {
            fetchUser();
        }
    };


    const value = useMemo(() => ({
        users,
        roles,
        editUser,
        deleteUser,
        fetchUser,
        registerUser
    }),[roles,users]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
