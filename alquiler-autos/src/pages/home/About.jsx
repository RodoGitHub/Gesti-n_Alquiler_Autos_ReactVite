import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";

export default function About() {
    const navigate = useNavigate();
    return(
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16, backgroundColor: "#0D3B66" }}>
            <Card className="auth-card no-hover" style={{ maxWidth: 920, width: "100%" }}>
                <h2 style={{ margin: 0 }}>Sobre nosotros</h2>
                <p style={{ marginTop: 8, color: "#5f6368" }}>
                    Somos una empresa dedicada al <strong>alquiler de autos</strong> con foco en la
                    calidad del servicio, precios transparentes y una experiencia simple de principio a fin.
                </p>

                <Divider />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    <Card className="no-hover" style={{ boxShadow: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <i className="pi pi-car" style={{ fontSize: 24, color: "#FF6B35" }} />
                            <div>
                                <h3 style={{ margin: 0 }}>Flota moderna</h3>
                                <p style={{ margin: 0, color: "#5f6368" }}>Vehículos nuevos y mantenidos.</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="no-hover" style={{ boxShadow: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <i className="pi pi-shield" style={{ fontSize: 24, color: "#FF6B35" }} />
                            <div>
                                <h3 style={{ margin: 0 }}>Seguro incluido</h3>
                                <p style={{ margin: 0, color: "#5f6368" }}>Coberturas claras y confiables.</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="no-hover" style={{ boxShadow: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <i className="pi pi-map-marker" style={{ fontSize: 24, color: "#FF6B35" }} />
                            <div>
                                <h3 style={{ margin: 0 }}>Entrega flexible</h3>
                                <p style={{ margin: 0, color: "#5f6368" }}>Retiro y devolución prácticos.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Divider />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ margin: 0, color: "#0D3B66" }}>+1000</h2>
                        <span style={{ color: "#5f6368" }}>Viajes completados</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ margin: 0, color: "#0D3B66" }}>4.8/5</h2>
                        <span style={{ color: "#5f6368" }}>Satisfacción clientes</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ margin: 0, color: "#0D3B66" }}>24/7</h2>
                        <span style={{ color: "#5f6368" }}>Soporte</span>
                    </div>
                </div>

                <Divider />

                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Button label="Ver nuestra flota" icon="pi pi-list" className="p-button-primary" onClick={() => navigate('/')} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
                    <Button label="Contáctanos" icon="pi pi-send" className="p-button-outlined" onClick={() => navigate('/about')} />
                </div>
            </Card>
        </div>
    );
}