import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "primeflex/primeflex.css";

export default function DashboardView() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-row h-screen w-screen">

            {/* Lado izquierdo: bienvenida */}
            <div
                className="hidden md:flex flex-grow-1 md:col-4 lg:col-3 flex-column justify-content-center align-items-center p-6"
                style={{ backgroundColor: '#1F2937', color: 'white' }}
            >
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>AutoGo!</h1>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#BFDBFE' }}>
                    Bienvenido al panel
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#D1D5DB', textAlign: 'center' }}>
                    Gestioná tus módulos de manera rápida y centralizada.
                </p>
            </div>

            {/* Lado derecho: tarjetas */}
            <div className="flex flex-1 md:col-8 lg:col-9 justify-content-center align-items-start" style={{ backgroundColor: '#F3F4F6', padding: '1.5rem' }}>
                <div className="grid" style={{ width: '100%', maxWidth: '1200px', gap: '1rem' }}>

                    {/* Contenedor para Vehículos y Reservas */}
                    <div className="col-12 flex flex-row flex-wrap gap-3 justify-content-center"> 
                        
                        {/* Vehículos */}
                        <div className="col-12 sm:col-6 lg:col-5">
                            <Card className="shadow-2 border-round-xl flex flex-column justify-content-between" style={{ height: '200px', padding: '1rem' }}>
                                <div className="flex flex-column h-full"> 
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Vehículos</h3>
                                        <p className="text-sm text-500 mb-3">Catálogo de vehículos.</p>
                                    </div>
                                    <div className="mt-auto">
                                        <Button
                                            label="Ir a Vehículos"
                                            className="w-full p-button-sm"
                                            style={{ backgroundColor: "#FF6B35", border: "none" }}
                                            onClick={() => navigate("/productos")}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Reservas */}
                        <div className="col-12 sm:col-6 lg:col-5">
                            <Card className="shadow-2 border-round-xl flex flex-column justify-content-between" style={{ height: '200px', padding: '1rem' }}>
                                <div className="flex flex-column h-full"> 
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Reservas</h3>
                                        <p className="text-sm text-500 mb-3">Control de todas las reservas y citas.</p>
                                    </div>
                                    <div className="mt-auto">
                                        <Button
                                            label="Ir a Reservas"
                                            className="w-full p-button-sm"
                                            style={{ backgroundColor: "#FF6B35", border: "none" }}
                                            onClick={() => navigate("/dashboard/reservas")}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Usuarios */}
                    <div className="col-12">
                        <Card className="shadow-2 border-round-xl flex flex-column justify-content-between" style={{ height: '200px', padding: '1rem' }}>
                            <div className="flex flex-column h-full"> 
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Usuarios</h3>
                                    <p className="text-sm text-500 mb-3">Gestión de usuarios y permisos.</p>
                                </div>
                                <div className="mt-auto">
                                    <Button
                                        label="Ir a Usuarios"
                                        className="w-full p-button-sm"
                                        style={{ backgroundColor: "#FF6B35", border: "none" }}
                                        onClick={() => navigate("/usuarios/nuevo")}
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
