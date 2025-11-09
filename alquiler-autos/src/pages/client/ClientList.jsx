import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputSwitch } from "primereact/inputswitch";

import { ClientContext } from "../../contexts/ClientContext";

export default function ClientList() {
    const navigate = useNavigate();
    const { clients, fetchClients, deleteClient, editClient } = useContext(ClientContext);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            const { ok, message } = await fetchClients();
            if (mounted && !ok) {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: message || "No se pudieron obtener los clientes."
                });
            }
            if (mounted) setLoading(false);
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const filteredClients = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return clients || [];
        return (clients || []).filter((c) => {
            const nombre = (c?.nombre ?? "").toLowerCase();
            const apellido = (c?.apellido ?? "").toLowerCase();
            const documento = (c?.documento ?? "").toLowerCase();
            const correo = (c?.correo ?? "").toLowerCase();
            const telefono = (c?.telefono ?? "").toLowerCase();
            return (
                nombre.includes(q) ||
                apellido.includes(q) ||
                documento.includes(q) ||
                correo.includes(q) ||
                telefono.includes(q)
            );
        });
    }, [clients, query]);

    const handleDelete = (row) => {
        confirmDialog({
            message: `¿Eliminar a "${row.apellido}, ${row.nombre}"?`,
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sí, eliminar",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-danger",
            accept: async () => {
                const { ok, message } = await deleteClient(row.id);
                toast.current?.show({
                    severity: ok ? "success" : "error",
                    summary: ok ? "Eliminado" : "Error",
                    detail: message || (ok ? "Cliente eliminado." : "No se pudo eliminar.")
                });
            }
        });
    };

    const onToggleActive = async (row, value) => {
        const { ok, message } = await editClient(row.id, { ...row, is_active: value });
        toast.current?.show({
            severity: ok ? "success" : "error",
            summary: ok ? "OK" : "Error",
            detail: ok ? "Estado actualizado" : (message || "No se pudo actualizar el estado.")
        });
    };

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Toast ref={toast} />
            <Card style={{ width: 1500, maxWidth: "95vw" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Clientes</h2>
                        <p style={{ marginTop: 0, color: "#666" }}>Listado de clientes del sistema</p>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="p-input-icon-left">
                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nombre, apellido, DNI, correo o teléfono"
                                style={{ width: 320 }}
                            />
                        </span>
                        <Button
                            label="Nuevo"
                            icon="pi pi-user-plus"
                            onClick={() => navigate("/client/register")}
                        />
                    </div>
                </div>


                <div style={{ marginTop: 8 }}>
                    <DataTable
                        value={filteredClients}
                        loading={loading}
                        paginator
                        rows={10}
                        emptyMessage="No hay clientes para mostrar."
                        stripedRows
                        responsiveLayout="scroll"
                    >
                        <Column
                            header="#"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ width: 60, textAlign: "center" }}
                        />

                        <Column
                            header="Cliente"
                            body={(row) => (
                                <div className="flex flex-column">
                                    <span className="text-900 font-medium">
                                        {row.apellido}, {row.nombre}
                                    </span>
                                </div>
                            )}
                            sortable
                            style={{ minWidth: 220 }}
                        />

                        <Column
                            header="Documento"
                            body={(row) => row?.documento || "-"}
                            sortable
                            style={{ minWidth: 160 }}
                        />

                        <Column
                            header="Correo"
                            body={(row) => row?.correo || "-"}
                            sortable
                            style={{ minWidth: 220 }}
                        />

                        <Column
                            header="Teléfono"
                            body={(row) => row?.telefono || "-"}
                            sortable
                            style={{ minWidth: 160 }}
                        />

                        <Column
                            header="Estado"
                            body={(row) => (
                                <div className="flex align-items-center gap-2">
                                    <Tag
                                        value={row?.is_active ? "Activo" : "Inactivo"}
                                        severity={row?.is_active ? "success" : "danger"}
                                    />
                                    <InputSwitch
                                        checked={!!row?.is_active}
                                        onChange={(e) => onToggleActive(row, e.value)}
                                    />
                                </div>
                            )}
                            style={{ width: 200 }}
                        />

                        <Column
                            header="Acciones"
                            body={(row) => (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-sm p-button-rounded p-button-text"
                                        onClick={() => navigate(`/client/${row.id}/edit`)}
                                        aria-label="Editar"
                                        tooltip="Editar"
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-sm p-button-rounded p-button-text p-button-danger"
                                        onClick={() => handleDelete(row)}
                                        aria-label="Borrar"
                                        tooltip="Borrar"
                                    />
                                </div>
                            )}
                            style={{ width: 160 }}
                        />
                    </DataTable>
                </div>
            </Card>

            <ConfirmDialog />
        </div>
    );
}
