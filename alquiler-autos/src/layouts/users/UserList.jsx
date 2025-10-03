// UsersView.jsx
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
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

    return (
        <div className="p-d-flex p-jc-center p-ai-start" style={{ padding: "2rem" }}>
        <div style={{ width: "800px" }}>
            <h1>Usuarios</h1>
            <Button label="Nuevo Usuario" className="p-button-success p-mb-3" onClick={() => openForm()} />

            <DataTable value={users} stripedRows responsiveLayout="scroll">
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

            <Dialog
            header={editingIndex !== null ? "Editar Usuario" : "Nuevo Usuario"}
            visible={showForm}
            onHide={closeForm}
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
