import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ClientContext } from "../../contexts/ClientContext";

export default function ClientList() {
    const { user } = useContext(AuthContext);
    const { clients, fetchClients, deleteClient } = useContext(ClientContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, []);

    const handleEdit = (id) => {
        if (user?.rol !== "admin") {
            alert("Solo los administradores pueden editar clientes.");
            return;
        }
        navigate(`/client/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (user?.rol !== "admin") {
            alert("Solo los administradores pueden eliminar clientes.");
            return;
        }
        if (confirm("¿Estás seguro de que querés eliminar este cliente?")) {
            const { ok, message } = await deleteClient(id);
            alert(message);
            if (ok) await fetchClients();
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
        <h1>Lista de Clientes</h1>

        {clients.length === 0 ? (
            <p>No hay clientes registrados.</p>
        ) : (
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "1rem",
                }}
                >
                <thead>
                    <tr>
                    <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
                    <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Nombre</th>
                    <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Apellido</th>
                    <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Documento</th>
                    <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Correo</th>
                    <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Teléfono</th>
                    {user?.rol === "admin" && <th style={{ borderBottom: "1px solid #ccc" }}>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                    <tr key={client.id}>
                        <td>{client.id}</td>
                        <td>{client.nombre}</td>
                        <td>{client.apellido}</td>
                        <td>{client.documento}</td>
                        <td>{client.correo}</td>
                        <td>{client.telefono}</td>
                        {user?.rol === "admin" && (
                        <td>
                            <button
                            onClick={() => handleEdit(client.id)}
                            className="btn btn-sm btn-warning me-2"
                            >
                            Editar
                            </button>
                            <button
                            onClick={() => handleDelete(client.id)}
                            className="btn btn-sm btn-danger"
                            >
                            Eliminar
                            </button>
                        </td>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>
        )}
        </div>
    );
}
