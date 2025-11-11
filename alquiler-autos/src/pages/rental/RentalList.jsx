import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { RentalContext } from "../../contexts/RentalsContext";
import { AuthContext } from "../../contexts/AuthContext";

const canCrud = (rol) => {
    const r = (rol ?? "").toString().trim().toLowerCase();
    return r === "admin" || r === "empleado";
};

export default function RentalList() {
    const navigate = useNavigate();
    const { rentals, fetchRentals, deleteRental } = useContext(RentalContext);
    const { user } = useContext(AuthContext);
    const isPriv = canCrud(user?.rol);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            const { ok, message } = await fetchRentals();
            if (mounted && !ok) {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: message || "No se pudieron obtener los alquileres."
                });
            }
            if (mounted) setLoading(false);
        })();
        return () => { mounted = false; };
    }, [fetchRentals]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = Array.isArray(rentals) ? rentals : [];
        if (!q) return list;
        return list.filter((r) => {
            const car = (r?.Car?.modelo ?? "").toLowerCase();
            const cli = `${r?.Client?.apellido ?? ""} ${r?.Client?.nombre ?? ""}`.trim().toLowerCase();
            const estado = (r?.estado ?? "").toLowerCase();
            const metodo = (r?.metodo_pago ?? "").toLowerCase();
            return car.includes(q) || cli.includes(q) || estado.includes(q) || metodo.includes(q);
        });
    }, [rentals, query]);

    const handleDelete = (row) => {
        confirmDialog({
            message: `¿Eliminar alquiler del auto "${row?.Car?.modelo ?? "-"}"?`,
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sí, eliminar",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-danger",
            accept: async () => {
                const { ok, message } = await deleteRental(row.id);
                toast.current?.show({
                    severity: ok ? "success" : "error",
                    summary: ok ? "Eliminado" : "Error",
                    detail: message || (ok ? "Alquiler eliminado." : "No se pudo eliminar.")
                });
            }
        });
    };

    const handleEdit = (row) => {
        if (!row?.id) return;
        navigate(`/rental/edit/${row.id}`);
    };

    const actionsBody = (row) => {
        if (!isPriv) return null;
        return (
            <div style={{ display: "flex", gap: 8 }}>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-sm p-button-rounded p-button-text"
                    onClick={() => handleEdit(row)}
                    tooltip="Editar"
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-rounded p-button-text p-button-danger"
                    onClick={() => handleDelete(row)}
                    tooltip="Borrar"
                />
            </div>
        );
    };

    const fmtDate = (iso) => {
        if (!iso) return "-";
        try {
            const d = new Date(iso);
            return d.toISOString().slice(0, 10);
        } catch {
            return iso;
        }
    };

    const money = (n) => {
        const x = Number(n);
        if (!Number.isFinite(x)) return "-";
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(x);
    };

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Toast ref={toast} />
            <Card style={{ width: 1500, maxWidth: "95vw" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Alquileres</h2>
                        <p style={{ marginTop: 0, color: "#666" }}>Relación de clientes con vehículos</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por auto, cliente, estado o pago"
                                style={{ width: 320 }}
                            />
                        </span>
                        {isPriv && (
                            <Button
                                label="Nuevo"
                                icon="pi pi-plus"
                                onClick={() => navigate("/rental/register")}
                            />
                        )}
                    </div>
                </div>

                <div style={{ marginTop: 8 }}>
                    <DataTable
                        key={`rentals-priv-${isPriv}`}
                        value={filtered}
                        loading={loading}
                        paginator
                        rows={10}
                        emptyMessage="No hay alquileres para mostrar."
                        stripedRows
                        responsiveLayout="scroll"
                    >
                        <Column header="#" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: 60, textAlign: "center" }} />
                        <Column header="Auto" body={(r) => r?.Car?.modelo ?? "-"} sortable style={{ minWidth: 160 }} />
                        <Column header="Cliente" body={(r) => `${r?.Client?.apellido ?? ""}, ${r?.Client?.nombre ?? ""}`} sortable style={{ minWidth: 220 }} />
                        <Column header="Inicio" body={(r) => fmtDate(r?.fecha_inicio)} sortable style={{ minWidth: 120 }} />
                        <Column header="Fin" body={(r) => fmtDate(r?.fecha_fin)} sortable style={{ minWidth: 120 }} />
                        <Column header="Estado" field="estado" sortable style={{ minWidth: 120 }} />
                        <Column header="Pago" field="metodo_pago" sortable style={{ minWidth: 120 }} />
                        <Column header="Total" body={(r) => money(r?.total)} sortable style={{ minWidth: 140, textAlign: "right" }} />
                        <Column header="Acciones" body={actionsBody} style={{ width: 160 }} hidden={!isPriv} />
                    </DataTable>
                </div>
            </Card>

            <ConfirmDialog />
        </div>
    );
}
