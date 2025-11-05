import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";

export default function UserList() {
    const { user } = useContext(AuthContext);
    const { fetchUser, deleteUser, users } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const handleEdit = (id) => {
        if (user?.rol !== "admin") {
            alert("Solo los administradores pueden editar usuarios.");
            return;
        }
        navigate(`/user/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (user?.rol !== "admin") {
            alert("Solo los administradores pueden eliminar usuarios.");
            return;
        }

        if (confirm("¿Estás seguro de que querés eliminar este usuario?")) {
            const { ok, message } = await deleteUser(id);
            alert(message);
        if (ok) await fetchUser();
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Lista de Usuarios</h1>

            {users.length === 0 ? (
                <p>No hay usuarios registrados.</p>
            ) : (
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
                        {user?.rol === "admin" && (
                            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Acciones</th>
                        )}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                        <tr key={u.id}>
                            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{u.id}</td>
                            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{u.nombre}</td>
                            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{u.correo}</td>
                            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{u.rol}</td>
                            {user?.rol === "admin" && (
                            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                                <button
                                onClick={() => handleEdit(u.id)}
                                className="btn btn-sm btn-warning me-2"
                                >
                                Editar
                                </button>
                                <button
                                onClick={() => handleDelete(u.id)}
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
