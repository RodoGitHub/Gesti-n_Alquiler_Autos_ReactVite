import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeflex/primeflex.css";

export default function CarList() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/car") // Ajusta la URL según tu backend
            .then(res => res.json())
            .then(data => setCars(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-row h-screen w-screen">

            {/* Lado izquierdo: bienvenida */}
            <div
                className="hidden md:flex flex-column justify-content-center align-items-center p-6"
                style={{ backgroundColor: "#dbeeff", color: "#1f3d5a", minWidth: "250px" }}
            >
                <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>AutoGo!</h1>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Vehículos</h2>
                <p style={{ maxWidth: "280px", textAlign: "center", fontSize: "0.85rem" }}>
                    Lista de vehículos disponibles y su información.
                </p>
            </div>

            {/* Lado derecho: lista de vehículos */}
            <div
                className="flex flex-1 justify-content-center align-items-stretch p-4"
                style={{ backgroundColor: "#ffffff", padding: "1rem" }}
            >
                <Card
                    title="Listado de Vehículos"
                    className="w-full flex flex-column"
                    style={{ maxWidth: "900px", borderRadius: "1.2rem", padding: "1rem", height: "100%" }}
                >
                    <DataTable
                        value={cars}
                        loading={loading}
                        className="p-datatable-sm flex-grow-1"
                        style={{ fontSize: "0.9rem", height: "100%" }}
                    >
                        <Column field="marcaId" header="Marca" body={(row) => `Marca ${row.marcaId}`} />
                        <Column field="modelo" header="Modelo" />
                        <Column field="anio" header="Año" />
                        <Column field="precio_dia" header="Precio Día" body={(row) => `$ ${row.precio_dia}`} />
                        <Column field="disponible" header="Disponible" body={(row) => (row.disponible ? "Sí" : "No")} />
                        <Column field="is_active" header="Activo" body={(row) => (row.is_active ? "Sí" : "No")} />
                        <Column
                            header="Acciones"
                            body={(row) => (
                                <Button
                                    label="Editar"
                                    className="p-button-sm p-button-rounded"
                                    style={{ backgroundColor: "#FF6B35", border: "none", color: "#ffffff" }}
                                    onClick={() => alert(`Editar vehículo: ${row.modelo}`)}
                                />
                            )}
                        />
                    </DataTable>
                </Card>
            </div>

        </div>
    );
}
