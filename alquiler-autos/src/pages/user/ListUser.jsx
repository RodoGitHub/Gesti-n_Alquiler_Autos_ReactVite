import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

export default function UserList() {
    const { fetchUser, deleteUser, users } = useContext(UserContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        const loadUsers = async () => {
        const { ok, message } = await fetchUser();
        alert(message);
        };

        loadUsers();
    }, []);

    const handleEdit = (id) => {
        navigate(`/user/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (confirm("¿Estás seguro de que querés eliminar este usuario?")) {
            const { ok, message } = await deleteUser(id);
            alert(message);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
        <h1>Lista de Usuarios</h1>

        <table
            style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            }}
        >
            <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>ID</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Nombre</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Correo</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Rol</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{user.id}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{user.nombre}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{user.correo}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{user.rol}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    <button onClick={() => handleEdit(user.id)} style={{ marginRight: "0.5rem" }}>
                    Editar
                    </button>
                    <button onClick={() => handleDelete(user.id)} style={{ color: "red" }}>
                    Eliminar
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}
