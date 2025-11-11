// src/contexts/RentalContext.jsx
import { createContext, useState, useCallback } from "react";
import { rentalService } from "../services/rentals";
import { carService } from "../services/cars";
import { startLoading, stopLoading } from "../core/loading-bus";
import { RENTAL_STATES } from "../constants/rentalStates";

export const RentalContext = createContext();

const getMessageFromResponse = (res, fallback) =>
    res?.data?.message || res?.message || fallback;

const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

const BLOCK_STATES = new Set(
    RENTAL_STATES
        .filter(s => ["pendiente", "confirmado"].includes(s.value))
        .map(s => s.value)
);
const FREE_STATES = new Set(
    RENTAL_STATES
        .filter(s => ["finalizado", "cancelado"].includes(s.value))
        .map(s => s.value)
);

const desiredDisponibilidad = (estado) => {
    const s = String(estado ?? "").trim().toLowerCase();
    if (BLOCK_STATES.has(s)) return false;
    if (FREE_STATES.has(s)) return true;
    return undefined;
};

const syncCarsFromRentalsSimple = async (rentals) => {
    const off = new Set(); 
    const on = new Set();  

    for (const r of rentals || []) {
        const carId = r?.carId;
        if (!carId) continue;
        const s = String(r?.estado ?? "").trim().toLowerCase();

        if (BLOCK_STATES.has(s)) {
            off.add(carId);
            on.delete(carId); 
        } else if (FREE_STATES.has(s)) {
            if (!off.has(carId)) on.add(carId);
        }

    }

    const ops = [];
    for (const id of off) ops.push(carService.update(id, { disponible: false }).catch(() => null));
    for (const id of on)  ops.push(carService.update(id, { disponible: true  }).catch(() => null));
    await Promise.all(ops);
};

export function RentalProvider({ children }) {
    const [rentals, setRentals] = useState([]);

    const fetchRentals = useCallback(async () => {
        startLoading();
        try {
            const res = await rentalService.list();
            const data = res?.data?.data ?? res?.data ?? [];
            const ok = Array.isArray(data);

            setRentals(ok ? data : []);

            if (ok) {
                await syncCarsFromRentalsSimple(data);
            }

            const message = getMessageFromResponse(res, ok ? "Alquileres obtenidos." : "Error al obtener alquileres.");
            return { ok, message, data: ok ? data : [] };
        } catch (err) {
            setRentals([]);
            const message = getErrorMessage(err, "Error al obtener alquileres.");
            return { ok: false, message, data: [] };
        } finally {
            stopLoading();
        }
    }, []);

    const getRentalById = async (id) => {
        startLoading();
        try {
            const res = await rentalService.get(id);
            const data = res?.data?.data ?? res?.data ?? null;
            const ok = !!data;
            const message = getMessageFromResponse(res, ok ? "Alquiler obtenido." : "Alquiler no encontrado.");
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al obtener el alquiler.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const registerRental = async (payload) => {
        startLoading();
        try {
            const toSend = {
                ...payload,
                estado: payload?.estado ?? "pendiente"
            };
            const res = await rentalService.create(toSend);
            const ok = !!res?.data;
            const data = res?.data?.data ?? res?.data ?? null;
            const message = getMessageFromResponse(res, ok ? "Alquiler creado." : "Error al crear alquiler.");

            if (ok && data) {
                setRentals((prev) => [data, ...prev]);

                const disp = desiredDisponibilidad(toSend.estado);
                if (toSend?.carId && disp !== undefined) {
                    try { await carService.update(toSend.carId, { disponible: disp }); } catch {}
                }
            }
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al registrar alquiler.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const editRental = async (id, payload) => {
        startLoading();
        try {
            const res = await rentalService.update(id, payload);
            const ok = !!res?.data;
            const data = res?.data?.data ?? res?.data ?? null;
            const message = getMessageFromResponse(res, ok ? "Alquiler actualizado." : "Error al actualizar alquiler.");

            if (ok && data) {
                setRentals((prev) => prev.map((r) => (r.id === id ? data : r)));

                const disp = desiredDisponibilidad(payload?.estado);
                if (payload?.carId && disp !== undefined) {
                    try { await carService.update(payload.carId, { disponible: disp }); } catch {}
                }
            }
            return { ok, message, data };
        } catch (err) {
            const message = getErrorMessage(err, "Error al actualizar alquiler.");
            return { ok: false, message, data: null };
        } finally {
            stopLoading();
        }
    };

    const deleteRental = async (id) => {
        startLoading();
        try {
            const res = await rentalService.delete(id);
            const ok = res?.status === 200 || res?.status === 204 || res?.data;
            const message = getMessageFromResponse(res, ok ? "Alquiler eliminado." : "Error al eliminar alquiler.");
            if (ok) setRentals((prev) => prev.filter((r) => r.id !== id));
            return { ok, message };
        } catch (err) {
            const message = getErrorMessage(err, "Error al eliminar alquiler.");
            return { ok: false, message };
        } finally {
            stopLoading();
        }
    };

    const value = {
        rentals,
        fetchRentals,
        getRentalById,
        registerRental,
        editRental,
        deleteRental
    };

    return (
        <RentalContext.Provider value={value}>
            {children}
        </RentalContext.Provider>
    );
}
