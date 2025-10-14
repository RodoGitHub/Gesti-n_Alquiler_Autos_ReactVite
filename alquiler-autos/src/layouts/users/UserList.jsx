import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Card } from "primereact/card";
import UserForm from "./UserForm";

const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: "", email: "" });
    const [editingIndex, setEditingIndex] = useState(null);

    const openForm = (user = null, index = null) => {
        if (user) {
            setCurrentUser(user);
            setEditingIndex(index);
        } else {
            setCurrentUser({ name: "", email: "" });
            setEditingIndex(null);
        }
        setShowForm(true);
    };

    const closeForm = () => setShowForm(false);

    const handleSave = (userData) => {
        if (editingIndex !== null) {
            const updated = [...users];
            updated[editingIndex] = userData;
            setUsers(updated);
        } else {
            setUsers([...users, userData]);
        }
        closeForm();
    };

    const handleDelete = (index) => {
        const updated = users.filter((_, i) => i !== index);
        setUsers(updated);
    };

    const leftToolbarTemplate = () => (
        <Button label="Nuevo Usuario" icon="pi pi-plus" className="p-button-success" onClick={() => openForm()} />
    );

    return (
        <div className="p-d-flex p-jc-center p-m-4" style={{ width: "100vw" }}>
            <div className="p-d-flex p-flex-column" style={{ width: "100%" }}>
                <Card className="p-mb-4" title="Gestión de Usuarios">
                    <Toolbar className="p-mb-3" left={leftToolbarTemplate} />

                    <DataTable
                        value={users}
                        stripedRows
                        responsiveLayout="scroll"
                        className="p-datatable-sm"
                        style={{ width: "100%" }}
                    >
                        <Column field="name" header="Nombre" />
                        <Column field="email" header="Email" />
                        <Column
                            header="Acciones"
                            body={(rowData, { rowIndex }) => (
                                <div className="p-d-flex p-jc-start p-ai-center p-gap-2">
                                    <Button label="Editar" icon="pi pi-pencil" className="p-button-warning" onClick={() => openForm(rowData, rowIndex)} />
                                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowIndex)} />
                                </div>
                            )}
                        />
                    </DataTable>
                </Card>

                <Dialog
                    header={editingIndex !== null ? "Editar Usuario" : "Nuevo Usuario"}
                    visible={showForm}
                    onHide={closeForm}
                    style={{ width: "50vw" }}
                    breakpoints={{ "960px": "75vw", "640px": "90vw" }}
                >
                    <UserForm
                        userData={currentUser}
                        onSave={handleSave}
                        onCancel={closeForm}
                    />
                </Dialog>
            </div>
        </div>
    );
};

export default UsersView;
