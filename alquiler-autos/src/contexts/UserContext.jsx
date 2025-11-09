import { createContext, useEffect, useState } from "react";
import { userService } from "../services/user";
import { startLoading, stopLoading } from "../core/loading-bus";

export const UserContext = createContext();

const getMessageFromResponse = (res, fallback) =>
    res?.data?.message || res?.message || fallback;

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

export const UserProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        startLoading();
        try {
            const res = await userService.roles();
            const data = res?.data?.data ?? res?.data ?? [];
            setRoles(Array.isArray(data) ? data : []);
            const message = getMessageFromResponse(res, "Roles obtenidos.");
            return { ok: true, message, data };
        } catch (err) {
            setRoles([]);
            const message = getErrorMessage(err, "Error al obtener roles.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const fetchUsers = async () => {
        startLoading();
        try {
            const res = await userService.list();
            const data = res?.data?.data ?? res?.data ?? [];
            setUsers(Array.isArray(data) ? data : []);
            const message = getMessageFromResponse(res, "Usuarios obtenidos.");
            return { ok: true, message, data };
        } catch (err) {
            setUsers([]);
            const message = getErrorMessage(err, "Error al obtener usuarios.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const registerUser = async (payload) => {
        startLoading();
        try {
            const res = await userService.register(payload);
            const ok = res?.status === 200 || res?.status === 201;
            const message = getMessageFromResponse(res, ok ? "Usuario registrado." : "Error al registrar usuario.");
            return { ok, message, data: res?.data ?? null };
        } catch (err) {
            const message = getErrorMessage(err, "Error al registrar usuario.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const editUser = async (id, payload) => {
        startLoading();
        try {
            const res = await userService.update(id, payload);
            const ok = res?.status === 200 || res?.status === 201;
            const message = getMessageFromResponse(res, ok ? "Usuario actualizado." : "Error al actualizar usuario.");
            return { ok, message, data: res?.data ?? null };
        } catch (err) {
            const message = getErrorMessage(err, "Error al actualizar usuario.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const deleteUser = async (id) => {
        startLoading();
        try {
            const res = await userService.delete(id);
            const ok = [200, 201, 204].includes(res?.status);
            const message = getMessageFromResponse(res, ok ? "Usuario eliminado." : "Error al eliminar usuario.");

            if (ok) {
                setUsers((prev) => prev.filter((u) => u.id !== id));
            }
            return { ok, message };
        } catch (err) {
            const message = getErrorMessage(err, "Error al eliminar usuario.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const getUserById = async (id) => {
        startLoading();
        try {
            const res = await userService.get(id);
            const data = res?.data?.data ?? res?.data ?? null;
            const ok = !!data;
            const message = getMessageFromResponse(res, ok ? "Usuario obtenido." : "Usuario no encontrado.");
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al obtener usuario.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const value = {
        roles,
        users,
        fetchRoles,
        fetchUsers,
        registerUser,
        editUser,
        deleteUser,
        getUserById
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
