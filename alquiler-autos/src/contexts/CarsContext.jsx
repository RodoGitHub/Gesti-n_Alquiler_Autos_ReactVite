import { createContext, useEffect, useState } from "react";
import { carService } from "../services/cars";
import { startLoading, stopLoading } from "../core/loading-bus";

export const CarContext = createContext();

const getMessageFromResponse = (res, fallback) =>
    res?.data?.message || res?.message || fallback;

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

export const CarProvider = ({ children }) => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        startLoading();
        try {
            const res = await carService.list(); 
            const ok = res?.ok === true;
            const data = res?.data?.data ?? res?.data ?? [];
            setCars(Array.isArray(data) ? data : []);
            const message = getMessageFromResponse(res, ok ? "Autos obtenidos." : "Error al obtener autos.");
            return { ok, message, data };
        } catch (err) {
            setCars([]);
            const message = getErrorMessage(err, "Error al obtener autos.");
            return { ok: false, message, data: [] };
        } finally {
            stopLoading();
        }
    };

    const getCarById = async (id) => {
        startLoading();
        try {
            const res = await carService.get(id);
            const data = res?.data?.data ?? res?.data ?? null;
            const ok = !!data;
            const message = getMessageFromResponse(res, ok ? "Auto obtenido." : "Auto no encontrado.");
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al obtener auto.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const registerCar = async (payload) => {
        // payload: { brandId, modelo, anio, precio_dia, disponible, is_active? }
        startLoading();
        try {
            const res = await carService.create(payload);
            const ok = res?.ok === true;
            const data = res?.data?.data ?? res?.data ?? null;
            const message = getMessageFromResponse(res, ok ? "Auto creado." : "Error al crear auto.");
            if (ok && data) setCars((prev) => [data, ...prev]);
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al registrar auto.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const editCar = async (id, payload) => {
        startLoading();
        try {
            const res = await carService.update(id, payload);
            const ok = res?.ok === true;
            const data = res?.data?.data ?? res?.data ?? null;
            const message = getMessageFromResponse(res, ok ? "Auto actualizado." : "Error al actualizar auto.");
            if (ok && data) {
                setCars((prev) => prev.map((c) => (c.id === id ? data : c)));
            }
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al actualizar auto.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const deleteCar = async (id) => {
        startLoading();
        try {
            const res = await carService.delete(id);
            const ok = res?.ok === true;
            const message = getMessageFromResponse(res, ok ? "Auto eliminado." : "Error al eliminar auto.");
            if (ok) setCars((prev) => prev.filter((c) => c.id !== id));
            return { ok, message };
        } catch (err) {
            const message = getErrorMessage(err, "Error al eliminar auto.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const toggleDisponible = async (id, disponible) => {
        // si tu back soporta PATCH, podés cambiar a carService.patch(id, { disponible })
        return await editCar(id, { disponible });
    };

    const value = {
        cars,
        fetchCars,
        getCarById,
        registerCar,
        editCar,
        deleteCar,
        toggleDisponible,
    };

    return (
        <CarContext.Provider value={value}>
            {children}
        </CarContext.Provider>
    );
};
