import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function UnAuth() {
    const navigate = useNavigate();
    return(
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16, backgroundColor: "#0D3B66" }}>
            <Card className="auth-card no-hover" style={{ textAlign: "center" }}>
                <h2 style={{ marginTop: 0 }}>403 - Acceso denegado</h2>
                <p>No tienes permisos para ver esta página.</p>
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Button label="Volver al inicio" icon="pi pi-home" className="p-button-primary" onClick={() => navigate('/')} />
                </div>
            </Card>
        </div> 
    );
}