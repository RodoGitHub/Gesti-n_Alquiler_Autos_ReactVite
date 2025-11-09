import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";
import { AUTH_TYPE } from "../../constants/authType";

export default function UserList() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { user, status } = useContext(AuthContext);
    const { users, fetchUsers, deleteUser } = useContext(UserContext);

    const isAdmin = user?.rol === "admin";
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchUsers();

    }, []);


    const sourceUsers = useMemo(() => {
        const list = users || [];
        return isAdmin ? list : list.filter(u => u?.is_active === true);
    }, [users, isAdmin]);

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return sourceUsers;
        return sourceUsers.filter((u) => {
            const nombre = (u?.nombre ?? "").toLowerCase();
            const correo = (u?.correo ?? u?.email ?? "").toLowerCase();
            const rol = (u?.rol ?? "").toLowerCase();
            return nombre.includes(q) || correo.includes(q) || rol.includes(q);
        });
    }, [sourceUsers, query]);

    const handleEdit = (row) => {
        if (!row?.id) return;
        navigate(`/user/edit/${row.id}`);
    };

    const handleDelete = (row) => {
        confirmDialog({
            message: `¿Eliminar al usuario "${row.nombre ?? row.correo}"?`,
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sí, eliminar",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-danger",
            accept: async () => {
                const res = await deleteUser(row.id);
                if (res?.ok) {
                    showToast({
                        severity: "success",
                        summary: "Eliminado",
                        detail: res?.message || "Usuario eliminado.",
                        life: 1600,
                    });
                    fetchUsers();
                } else {
                    showToast({
                        severity: "error",
                        summary: "Error",
                        detail: res?.message || "No se pudo eliminar el usuario.",
                        life: 2400,
                    });
                }
            },
        });
    };

    if (status === AUTH_TYPE.UNAUTH) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
                <Card style={{ width: 420, textAlign: "center" }}>
                    <h3 style={{ marginTop: 0, marginBottom: 8 }}>No autorizado</h3>
                    <p style={{ marginTop: 0 }}>Debes iniciar sesión para ver los usuarios.</p>
                    <Button
                        label="Ir al login"
                        icon="pi pi-sign-in"
                        onClick={() => navigate("/auth/login")}
                        className="p-button-primary"
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16}}>
            <Card style={{ width: 1500, maxWidth: "95vw"}}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Usuarios</h2>
                        <p style={{ marginTop: 0, color: "#666" }}>Listado de usuarios del sistema</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="p-input-icon-left">

                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nombre, correo o rol"
                                style={{ width: 280 }}
                            />
                        </span>
                        {isAdmin && (
                            <Button
                                label="Nuevo"
                                icon="pi pi-user-plus"
                                onClick={() => navigate("/user/register")}
                            />
                        )}
                    </div>
                </div>

                <div style={{ marginTop: 8 }}>
                    <DataTable
                        value={filteredUsers}
                        paginator
                        rows={10}
                        emptyMessage="No hay usuarios para mostrar."
                        stripedRows
                        responsiveLayout="scroll"
                    >
                        <Column
                            header="#"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ width: 60, textAlign: "center" }}
                        />
                        <Column field="nombre" header="Nombre" sortable style={{ minWidth: 160 }} />
                        <Column
                            header="Correo"
                            body={(row) => row?.correo || row?.email || "-"}
                            sortable
                            style={{ minWidth: 220 }}
                        />

                        {isAdmin && (
                            <Column field="rol" header="Rol" sortable style={{ width: 140 }} />
                        )}

                        <Column
                            header="Estado"
                            body={(row) => (
                                <Tag
                                    value={row?.is_active ? "Activo" : "Inactivo"}
                                    severity={row?.is_active ? "success" : "danger"}
                                />
                            )}
                            style={{ width: 140, textAlign: "center" }}
                        />

                        <Column
                            header="Acciones"
                            body={(row) => (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-sm p-button-rounded p-button-text"
                                        onClick={() => handleEdit(row)}
                                        aria-label="Editar"
                                        tooltip="Editar"
                                    />
                                    {isAdmin && row?.id !== user?.id && (
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-sm p-button-rounded p-button-text p-button-danger"
                                            onClick={() => handleDelete(row)}
                                            aria-label="Borrar"
                                            tooltip="Borrar"
                                        />
                                    )}
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
