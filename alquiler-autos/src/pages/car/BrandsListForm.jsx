import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BrandContext } from "../../contexts/BrandsContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

export default function BrandsListForm() {
    const {
        brands,
        fetchBrands,
        registerBrand,
        editBrand,
        deleteBrand,
    } = useContext(BrandContext);

    const toastRef = useRef(null);

    const [editingId, setEditingId] = useState(null);
    const [nombre, setNombre] = useState("");

    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        fetchBrands?.();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setNombre("");
    };

    const onEditRow = (row) => {
        setEditingId(row.id);
        setNombre(row.nombre ?? "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDeleteRow = (row) => {
        confirmDialog({
            message: `¿Eliminar la marca "${row.nombre}"?`,
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-danger",
            accept: async () => {
                const { ok, message } = await deleteBrand(row.id);
                toastRef.current?.show({
                    severity: ok ? "success" : "error",
                    summary: ok ? "OK" : "Error",
                    detail: message,
                });
                if (ok && editingId === row.id) resetForm();
                if (ok) fetchBrands?.();
            },
        });
    };

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        const trimmed = (nombre ?? "").trim();
        if (!trimmed) {
            toastRef.current?.show({
                severity: "warn",
                summary: "Validación",
                detail: "El nombre es obligatorio.",
            });
            return;
        }

        if (editingId) {
            const { ok, message } = await editBrand(editingId, {
                nombre: trimmed,
                is_active: isActive,
            });
            toastRef.current?.show({
                severity: ok ? "success" : "error",
                summary: ok ? "Actualizado" : "Error",
                detail: message,
            });
            if (ok) {
                resetForm();
                fetchBrands?.();
            }
        } else {
            const { ok, message } = await registerBrand({
                nombre: trimmed,
                is_active: isActive,
            });
            toastRef.current?.show({
                severity: ok ? "success" : "error",
                summary: ok ? "Creado" : "Error",
                detail: message,
            });
            if (ok) {
                resetForm();
                fetchBrands?.();
            }
        }
    };

    const actionsTemplate = (row) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-sm p-button-rounded p-button-info"
                onClick={() => onEditRow(row)}
                tooltip="Editar"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-sm p-button-rounded p-button-danger"
                onClick={() => onDeleteRow(row)}
                tooltip="Eliminar"
            />
        </div>
    );

    const activeTemplate = (row) => (
        <span className={`px-2 py-1 text-sm rounded ${row.is_active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
            {row.is_active ? "Activo" : "Inactivo"}
        </span>
    );

    const filtered = useMemo(() => {
        const q = globalFilter.trim().toLowerCase();
        if (!q) return brands ?? [];
        return (brands ?? []).filter((b) =>
            (b.nombre ?? "").toLowerCase().includes(q)
        );
    }, [brands, globalFilter]);

    return (
        <div className="p-3" style={{ minHeight: "90vh", display: "grid", placeItems: "center" }}>
            <Toast ref={toastRef} />
            <ConfirmDialog />

            <Card                
                title={editingId ? "Editar Marca" : "Nueva Marca"}
                subTitle={editingId ? "Modificá los datos y guardá los cambios" : "Completá el formulario para crear una marca"}
                className="mb-3 shadow-2"
                style={{ width: 760, maxWidth: "95vw" }}
            >
                <form onSubmit={handleSubmit} className="flex flex-column gap-3">
                    <div className="flex align-items-center gap-2">
                        <label htmlFor="nombre" className="w-8rem">Nombre</label>
                        <InputText
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Toyota"
                            className="w-full"
                            maxLength={60}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            icon={editingId ? "pi pi-save" : "pi pi-plus"}
                            label={editingId ? "Guardar cambios" : "Crear"}
                        />
                        {editingId && (
                            <Button
                                type="button"
                                severity="secondary"
                                icon="pi pi-times"
                                label="Cancelar"
                                onClick={resetForm}
                                outlined
                            />
                        )}
                    </div>
                </form>
            </Card>

            <Divider />

            <Card 
                title="Listado de Marcas" 
                className="shadow-1"
                style={{ width: 760, maxWidth: "95vw" }}
            >
                <div className="flex justify-content-between align-items-center mb-2">
                    <span className="text-sm text-color-secondary">
                        Total: {(brands ?? []).length}
                    </span>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Buscar por nombre..."
                        />
                    </span>
                </div>

                <DataTable
                    value={filtered}
                    paginator
                    rows={10}
                    stripedRows
                    emptyMessage="No hay marcas."
                    responsiveLayout="scroll"
                    rowHover
                >
                    <Column field="id" header="#" style={{ width: "6rem" }} />
                    <Column field="nombre" header="Nombre" sortable />
                    <Column header="Estado" body={activeTemplate} style={{ width: "10rem" }} />
                    <Column header="Acciones" body={actionsTemplate} style={{ width: "10rem" }} />
                </DataTable>
            </Card>
        </div>
    );
}
