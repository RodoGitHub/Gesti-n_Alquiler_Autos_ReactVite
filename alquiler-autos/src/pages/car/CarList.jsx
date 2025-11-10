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

import { useToast } from "../../contexts/ToastContext";
import { AuthContext } from "../../contexts/AuthContext";
import { carService } from "../../services/cars";
import { BrandContext } from "../../contexts/BrandsContext";

export default function CarList() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useContext(AuthContext);


    const brandCtx = useContext(BrandContext);

    const [cars, setCars] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await carService.list(); 
            const data = res?.data?.data ?? res?.data ?? [];
            setCars(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err?.response?.data?.message || err?.message || "No se pudieron obtener los autos."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
        // opcional: cargar marcas si usás BrandContext
        brandCtx?.fetchBrands?.();
    }, []);

    const filteredCars = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return cars || [];
        return (cars || []).filter((c) => {
            const marca = (c?.Brand?.nombre ?? "").toLowerCase();
            const modelo = (c?.modelo ?? "").toLowerCase();
            const anio = String(c?.anio ?? "");
            const precio = String(c?.precio_dia ?? "");
            return (
                marca.includes(q) ||
                modelo.includes(q) ||
                anio.includes(q) ||
                precio.includes(q)
            );
        });
    }, [cars, query]);

    const handleDelete = (row) => {
        confirmDialog({
            message: `¿Eliminar el auto "${row.Brand?.nombre} ${row.modelo} (${row.anio})"?`,
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sí, eliminar",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    const res = await carService.delete(row.id); // DELETE /car/:id
                    showToast({
                        severity: "success",
                        summary: "Eliminado",
                        detail: res?.data?.message || "Auto eliminado.",
                        life: 1600
                    });
                    fetchCars();
                } catch (err) {
                    showToast({
                        severity: "error",
                        summary: "Error",
                        detail: err?.response?.data?.message || err?.message || "No se pudo eliminar.",
                        life: 2400
                    });
                }
            }
        });
    };

    const handleToggleDisponible = async (row, value) => {
        try {
            // PATCH si tenés, sino PUT parcial
            const res = await carService.update(row.id, { disponible: value });
            showToast({
                severity: "success",
                summary: "OK",
                detail: res?.data?.message || "Disponibilidad actualizada",
                life: 1600
            });
            fetchCars();
        } catch (err) {
            showToast({
                severity: "error",
                summary: "Error",
                detail: err?.response?.data?.message || err?.message || "No se pudo actualizar.",
                life: 2400
            });
        }
    };

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Toast ref={toast} />
            <Card style={{ width: 1500, maxWidth: "95vw" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Autos</h2>
                        <p style={{ marginTop: 0, color: "#666" }}>Listado de vehículos disponibles en el sistema</p>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por marca, modelo, año o precio"
                                style={{ width: 320 }}
                            />
                        </span>
                        <Button
                            label="Nuevo"
                            icon="pi pi-plus"
                            onClick={() => navigate("/car/register")}
                        />
                    </div>
                </div>

                <div style={{ marginTop: 8 }}>
                    <DataTable
                        value={filteredCars}
                        loading={loading}
                        paginator
                        rows={10}
                        emptyMessage="No hay autos para mostrar."
                        stripedRows
                        responsiveLayout="scroll"
                    >
                        <Column
                            header="#"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ width: 60, textAlign: "center" }}
                        />

                        <Column
                            header="Marca / Modelo"
                            body={(row) => (
                                <div className="flex flex-column">
                                    <span className="text-900 font-medium">
                                        {row.Brand?.nombre ?? "-"} {row.modelo ?? ""}
                                    </span>
                                    <small className="text-600">Año: {row.anio ?? "-"}</small>
                                </div>
                            )}
                            sortable
                            style={{ minWidth: 240 }}
                        />

                        <Column
                            header="Precio/día"
                            body={(row) => (row?.precio_dia != null ? `$ ${Number(row.precio_dia).toLocaleString("es-AR")}` : "-")}
                            sortable
                            style={{ width: 160 }}
                        />

                        <Column
                            header="Disponibilidad"
                            body={(row) => (
                                <div className="flex align-items-center gap-2">
                                    <Tag
                                        value={row?.disponible ? "Disponible" : "No disponible"}
                                        severity={row?.disponible ? "success" : "danger"}
                                    />
                                    <InputSwitch
                                        checked={!!row?.disponible}
                                        onChange={(e) => handleToggleDisponible(row, e.value)}
                                    />
                                </div>
                            )}
                            style={{ width: 220 }}
                        />

                        <Column
                            header="Acciones"
                            body={(row) => (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-sm p-button-rounded p-button-text"
                                        onClick={() => navigate(`/car/edit/${row.id}`)}
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
