import { createContext, useMemo, useState } from "react";
import { clientService } from "../services/clients";
import { startLoading, stopLoading } from "../core/loading-bus";

export const ClientContext = createContext();

const getMessageFromResponse = (res, fallback) =>
    res?.data?.message || res?.message || fallback;

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

export const ClientProvider = ({ children }) => {
    const [clients, setClients] = useState([]);

    const fetchClients = async ({ includeInactive = false } = {}) => {
        startLoading();
        try {
            const res = await clientService.list();
            const data = res?.data?.data ?? res?.data ?? [];
            const arr = Array.isArray(data) ? data : [];
            const normalized = includeInactive ? arr : arr.filter(c => c?.is_active !== false);

            setClients(normalized);
            const message = getMessageFromResponse(res, "Clientes obtenidos.");
            return { ok: true, message, data: normalized };
        } catch (err) {
            setClients([]);
            const message = getErrorMessage(err, "Error al obtener clientes.");
            return { ok: false, message, data: [] };
        } finally {
            stopLoading();
        }
    };

    const getClientById = async (id) => {
        startLoading();
        try {
            const res = await clientService.get(id);
            const data = res?.data?.data ?? res?.data ?? null;
            const ok = !!data;
            const message = getMessageFromResponse(res, ok ? "Cliente obtenido." : "Cliente no encontrado.");
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al obtener cliente.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const registerClient = async (payload) => {
        startLoading();
        try {
            const res = await clientService.create(payload);
            const ok = [200, 201].includes(res?.status);
            const message = getMessageFromResponse(res, ok ? "Cliente registrado." : "Error al registrar cliente.");

            const created = res?.data?.data ?? null;
            if (ok && created) {
                setClients(prev => [created, ...prev]);
            }
            return { ok, message, data: created };
        } catch (err) {
            const message = getErrorMessage(err, "Error al registrar cliente.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const editClient = async (id, payload) => {
        startLoading();
        try {
            const res = await clientService.update(id, payload);
            const ok = [200, 201].includes(res?.status);
            const saved = res?.data?.data ?? null;
            if (ok && saved) {
                setClients(prev => prev.map(c => (c.id === id ? saved : c)));
            }
            const message = getMessageFromResponse(res, ok ? "Cliente actualizado." : "Error al actualizar cliente.");
            return { ok, message, data: saved };
        } catch (err) {
            const message = getErrorMessage(err, "Error al actualizar cliente.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const deleteClient = async (id) => {
        startLoading();
        try {
            const res = await clientService.delete(id);
            const ok = [200, 201, 204].includes(res?.status);
            const message = getMessageFromResponse(res, ok ? "Cliente eliminado." : "Error al eliminar cliente.");
            if (ok) {
                setClients(prev => prev.filter(c => c.id !== id));
            }
            return { ok, message };
        } catch (err) {
            const message = getErrorMessage(err, "Error al eliminar cliente.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const value = useMemo(
        () => ({
            clients,
            fetchClients,
            getClientById,
            registerClient,
            editClient,
            deleteClient,
        }),
        [clients]
    );

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    );
};
