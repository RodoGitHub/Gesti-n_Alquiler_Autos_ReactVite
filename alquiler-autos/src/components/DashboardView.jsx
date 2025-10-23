import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "primeflex/primeflex.css";

export default function DashboardView() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-column md:flex-row h-screen w-screen">

            {/* Lado izquierdo: bienvenida */}
            <div
                className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-4"
                style={{ backgroundColor: "#dbeeff", color: "#1f3d5a" }}
            >
                <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>AutoGo!</h1>
                <h2 style={{ fontSize: "1.4rem" }}>Bienvenido al panel</h2>
                <p style={{ maxWidth: "280px", textAlign: "center", fontSize: "0.85rem" }}>
                    Gestioná tus módulos de manera rápida y centralizada.
                </p>
            </div>

            {/* Lado derecho: tarjetas centradas */}
            <div
                className="flex flex-1 flex-column justify-content-center align-items-center"
                style={{ backgroundColor: "#ffffff", padding: "1rem", boxSizing: "border-box" }}
            >
                <div
                    className="flex flex-row flex-wrap justify-content-center gap-4"
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        padding: "0 1rem",
                        boxSizing: "border-box",
                    }}
                >

                    {/* Vehículos */}
                    <div style={{ flex: "1 1 300px", minWidth: "280px", maxWidth: "320px" }}>
                        <Card className="shadow-2 border-round-xl flex flex-column justify-content-between" style={{ height: "200px", padding: "1rem" }}>
                            <div className="flex flex-column h-full">
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Vehículos</h3>
                                    <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>Catálogo de vehículos.</p>
                                </div>
                                <div className="mt-auto">
                                    <Button
                                        label="Ir a Vehículos"
                                        className="w-full p-button-sm"
                                        style={{ backgroundColor: "#FF6B35", border: "none", color: "#ffffff" }}
                                        onClick={() => navigate("/productos")}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Reservas */}
                    <div style={{ flex: "1 1 300px", minWidth: "280px", maxWidth: "320px" }}>
                        <Card className="shadow-2 border-round-xl flex flex-column justify-content-between" style={{ height: "200px", padding: "1rem" }}>
                            <div className="flex flex-column h-full">
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Reservas</h3>
                                    <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>Control de todas las reservas y citas.</p>
                                </div>
                                <div className="mt-auto">
                                    <Button
                                        label="Ir a Reservas"
                                        className="w-full p-button-sm"
                                        style={{ backgroundColor: "#FF6B35", border: "none", color: "#ffffff" }}
                                        onClick={() => navigate("/reservas")}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>

        </div>
    );
}
