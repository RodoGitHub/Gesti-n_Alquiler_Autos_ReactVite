import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AUTH_TYPE } from "../../constants/authType";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function Home() {
    const { user, status, signOut } = useContext(AuthContext);
    const navigate = useNavigate();
    if (status === AUTH_TYPE.LOADING) {
        return <div>Cargando información...</div>;
    }

    if (!user) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16, backgroundColor: "#0D3B66" }}>
                <Card className="auth-card no-hover" style={{ maxWidth: 520, width: "100%", textAlign: "center", margin: "0 auto" }}>
                    <h2 style={{ marginTop: 0 }}>Bienvenido</h2>
                    <p style={{ marginTop: 0 }}>No hay usuario logueado.</p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%" }}>
                        <Button label="Iniciar sesión" icon="pi pi-sign-in" className="p-button-primary" onClick={() => navigate('/auth/login')} />
                        <Button label="Crear cuenta" icon="pi pi-user-plus" className="p-button-secondary" onClick={() => navigate('/user/register')} />
                    </div>
                </Card>
            </div>
        );
    }

    return(
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16, backgroundColor: "#0D3B66" }}>
            <Card className="auth-card no-hover" style={{ maxWidth: 520, width: "100%", textAlign: "center", margin: "0 auto" }}>
                <h2 style={{ marginTop: 0 }}>Inicio</h2>
                <h3 style={{ marginTop: 0 }}>Hola: {user.nombre}</h3>
                <p>Usuario logueado: {user.correo}</p>
                <p>Rol: {user.rol}</p>
                <p>Status: {status}</p>
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Button label="Cerrar sesión" icon="pi pi-sign-out" className="p-button-danger" onClick={() => signOut()} />
                </div>
            </Card>
        </div>
    );
}