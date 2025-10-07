import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, status, signOut } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            background: "#1976d2",
            flexWrap: "nowrap",
        }}
        >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h2 style={{ margin: 0, color: "#fff", whiteSpace: "nowrap" }}>
            AutoGo!
            </h2>
            {status === "authenticated" && user && (
            <Button
                icon="pi pi-home"
                className="p-button-rounded p-button-outlined"
                onClick={() => navigate("/")}
                title="Inicio"
            />
            )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            {status === "authenticated" && user ? (
            <>
                <Link to="/usuarios">
                <Button label="Usuarios" icon="pi pi-users" className="p-button-outlined" />
                </Link>
                <Link to="/productos">
                <Button label="Productos" icon="pi pi-box" className="p-button-outlined" />
                </Link>
                <Button
                label="Cerrar Sesión"
                className="p-button-danger"
                onClick={signOut}
                />
            </>
            ) : (
            <>
                <Link to="/login">
                <Button label="Iniciar Sesión" className="p-button-primary" />
                </Link>
                <Link to="/register">
                <Button label="Registrarse" className="p-button-secondary" />
                </Link>
            </>
            )}
        </div>
        </div>
    );
};

export default Navbar;
