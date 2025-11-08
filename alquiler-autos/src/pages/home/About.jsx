import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function About() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gridColumns = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

    return(
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", maxHeight: "100vh", padding: isMobile ? "0.5rem" : "1rem", backgroundColor: "#0D3B66", overflow: "hidden" }}>
            <Card 
                className="auth-card no-hover" 
                pt={{ 
                    root: { style: { maxWidth: isMobile ? "100%" : isTablet ? "90%" : "920px", width: "100%", maxHeight: "calc(100vh - 2rem)", overflow: "auto", padding: isMobile ? "0.75rem" : "1rem" } } 
                }}
            >
                <h2 style={{ margin: 0, marginBottom: "0.5rem", fontSize: isMobile ? "1.2rem" : "1.5rem" }}>Sobre nosotros</h2>
                <p style={{ marginTop: "0.5rem", marginBottom: "0.5rem", color: "#5f6368", fontSize: isMobile ? "0.85rem" : "0.9rem" }}>
                    Somos una empresa dedicada al <strong>alquiler de autos</strong> con foco en la
                    calidad del servicio, precios transparentes y una experiencia simple de principio a fin.
                </p>

                <Divider pt={{ root: { style: { margin: "0.5rem 0" } } }} />

                <div style={{ display: "grid", gridTemplateColumns: gridColumns, gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Card 
                        className="no-hover" 
                        pt={{ 
                            root: { style: { boxShadow: "none", padding: "0.5rem" } },
                            body: { style: { padding: "0.5rem" } }
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
                            <i className="pi pi-car" style={{ fontSize: "20px", color: "#FF6B35" }} />
                            <div>
                                <h3 style={{ margin: 0, fontSize: "1rem" }}>Flota moderna</h3>
                                <p style={{ margin: 0, color: "#5f6368", fontSize: "0.85rem" }}>Vehículos nuevos y mantenidos.</p>
                            </div>
                        </div>
                    </Card>
                    <Card 
                        className="no-hover" 
                        pt={{ 
                            root: { style: { boxShadow: "none", padding: "0.5rem" } },
                            body: { style: { padding: "0.5rem" } }
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
                            <i className="pi pi-shield" style={{ fontSize: "20px", color: "#FF6B35" }} />
                            <div>
                                <h3 style={{ margin: 0, fontSize: "1rem" }}>Seguro incluido</h3>
                                <p style={{ margin: 0, color: "#5f6368", fontSize: "0.85rem" }}>Coberturas claras y confiables.</p>
                            </div>
                        </div>
                    </Card>
                    <Card 
                        className="no-hover" 
                        pt={{ 
                            root: { style: { boxShadow: "none", padding: "0.5rem" } },
                            body: { style: { padding: "0.5rem" } }
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
                            <i className="pi pi-map-marker" style={{ fontSize: "20px", color: "#FF6B35" }} />
                            <div>
                                <h3 style={{ margin: 0, fontSize: "1rem" }}>Entrega flexible</h3>
                                <p style={{ margin: 0, color: "#5f6368", fontSize: "0.85rem" }}>Retiro y devolución prácticos.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Divider pt={{ root: { style: { margin: "0.5rem 0" } } }} />

                <div style={{ display: "grid", gridTemplateColumns: gridColumns, gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ margin: 0, color: "#0D3B66", fontSize: isMobile ? "1.2rem" : "1.5rem" }}>+1000</h2>
                        <span style={{ color: "#5f6368", fontSize: "0.85rem" }}>Viajes completados</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ margin: 0, color: "#0D3B66", fontSize: isMobile ? "1.2rem" : "1.5rem" }}>4.8/5</h2>
                        <span style={{ color: "#5f6368", fontSize: "0.85rem" }}>Satisfacción clientes</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ margin: 0, color: "#0D3B66", fontSize: isMobile ? "1.2rem" : "1.5rem" }}>24/7</h2>
                        <span style={{ color: "#5f6368", fontSize: "0.85rem" }}>Soporte</span>
                    </div>
                </div>

                <Divider pt={{ root: { style: { margin: "0.5rem 0" } } }} />

                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "0.5rem" }}>
                    <Button 
                        label="Ver nuestra flota" 
                        icon="pi pi-list" 
                        className="p-button-primary" 
                        onClick={() => navigate('/')}
                        pt={{ root: { style: { padding: "0.6rem" } } }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Button 
                        label="Contáctanos" 
                        icon="pi pi-send" 
                        className="p-button-outlined" 
                        onClick={() => navigate('/about')}
                        pt={{ root: { style: { padding: "0.6rem" } } }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "0.5rem" }}>
                    <Button 
                        label="Volver" 
                        icon="pi pi-arrow-left" 
                        className="p-button-text p-button-sm" 
                        onClick={() => navigate(-1)}
                        style={{ fontSize: "0.9rem" }}
                    />
                </div>
            </Card>
        </div>
    );
}