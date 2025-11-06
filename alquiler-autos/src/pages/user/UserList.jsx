import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function UserList() {
    const { fetchUsers, deleteUser, users } = useContext(UserContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            const { ok, message } = await fetchUsers();
            showToast({
                severity: ok ? "success" : "error",
                summary: ok ? "Éxito" : "Error",
                detail: message
            });
            setLoading(false);
        };

        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEdit = (userData) => {
        navigate(`/user/${userData.id}`, { state: { userData } });
    };

    const handleDelete = async (id) => {
        confirmDialog({
            message: "¿Estás seguro de que querés eliminar este usuario?",
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            accept: async () => {
                setLoading(true);
                const { ok, message } = await deleteUser(id);
                showToast({
                    severity: ok ? "success" : "error",
                    summary: ok ? "Éxito" : "Error",
                    detail: message
                });
                setLoading(false);
            },
            reject: () => {}
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-sm"
                    onClick={() => handleEdit(rowData)}
                    tooltip="Editar"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        backgroundColor: "#6B7280",
                        borderColor: "#6B7280"
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-sm"
                    onClick={() => handleDelete(rowData.id)}
                    tooltip="Eliminar"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        backgroundColor: "#DC2626",
                        borderColor: "#DC2626"
                    }}
                />
            </div>
        );
    };

    const rolBodyTemplate = (rowData) => {
        const getRolBadgeStyle = (rol) => {
            const styles = {
                admin: { backgroundColor: "#EF4444", color: "white" },
                empleado: { backgroundColor: "#3B82F6", color: "white" },
                cliente: { backgroundColor: "#10B981", color: "white" }
            };
            return styles[rol?.toLowerCase()] || { backgroundColor: "#6B7280", color: "white" };
        };

        return (
            <span
                style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    ...getRolBadgeStyle(rowData.rol)
                }}
            >
                {rowData.rol}
            </span>
        );
    };

    return (
        <div style={{ 
            minHeight: "100vh", 
            padding: "2rem", 
            backgroundColor: "#0D3B66",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Card 
                style={{ 
                    width: "100%", 
                    maxWidth: "1200px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
            >
                <div style={{ marginBottom: "1.5rem" }}>
                    <h1 style={{ margin: 0, color: "#1F2937", fontSize: "1.875rem", fontWeight: "600" }}>
                        Lista de Usuarios
                    </h1>
                    <p style={{ margin: "0.5rem 0 0 0", color: "#6B7280" }}>
                        Gestiona todos los usuarios del sistema
                    </p>
                </div>

                <DataTable
                    value={users}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    emptyMessage="No hay usuarios disponibles"
                    style={{ marginTop: "1rem" }}
                    stripedRows
                    showGridlines
                    responsiveLayout="scroll"
                >
                    <Column 
                        field="id" 
                        header="ID" 
                        sortable 
                        style={{ width: "80px" }}
                    />
                    <Column 
                        field="nombre" 
                        header="Nombre" 
                        sortable
                        style={{ minWidth: "150px" }}
                    />
                    <Column 
                        field="correo" 
                        header="Correo" 
                        sortable
                        style={{ minWidth: "200px" }}
                    />
                    <Column 
                        field="rol" 
                        header="Rol" 
                        body={rolBodyTemplate}
                        sortable
                        style={{ minWidth: "120px" }}
                    />
                    <Column 
                        header="Acciones" 
                        body={actionBodyTemplate}
                        style={{ width: "120px", textAlign: "center" }}
                    />
                </DataTable>
            </Card>
            <ConfirmDialog />
        </div>
    );
}
