import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeflex/primeflex.css";

export default function RentalList() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/rental") // Ajusta la URL según tu backend
            .then(res => res.json())
            .then(data => setRentals(data))
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
                <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Reservas</h2>
                <p style={{ maxWidth: "280px", textAlign: "center", fontSize: "0.85rem" }}>
                    Lista de reservas de vehículos con toda la información relevante.
                </p>
            </div>

            {/* Lado derecho: listado de reservas */}
            <div
                className="flex flex-1 justify-content-center align-items-stretch p-4"
                style={{ backgroundColor: "#ffffff", padding: "1rem" }}
            >
                <Card
                    title="Listado de Reservas"
                    className="w-full flex flex-column"
                    style={{ maxWidth: "900px", borderRadius: "1.2rem", padding: "1rem", height: "100%" }}
                >
                    <DataTable
                        value={rentals}
                        loading={loading}
                        className="p-datatable-sm flex-grow-1"
                        style={{ fontSize: "0.9rem", height: "100%" }}
                    >
                        <Column field="clientId" header="Cliente" body={(row) => `Cliente ${row.clientId}`} />
                        <Column field="carId" header="Vehículo" body={(row) => `Vehículo ${row.carId}`} />
                        <Column field="fecha_inicio" header="Desde" body={(row) => new Date(row.fecha_inicio).toLocaleDateString()} />
                        <Column field="fecha_fin" header="Hasta" body={(row) => new Date(row.fecha_fin).toLocaleDateString()} />
                        <Column field="total" header="Total" body={(row) => `$ ${row.total}`} />
                        <Column field="estado" header="Estado" />
                        <Column field="metodo_pago" header="Método Pago" />
                        <Column
                            header="Acciones"
                            body={(row) => (
                                <Button
                                    label="Ver"
                                    className="p-button-sm p-button-rounded"
                                    style={{ backgroundColor: "#FF6B35", border: "none", color: "#ffffff" }}
                                    onClick={() => alert(`Ver reserva de cliente ${row.clientId}`)}
                                />
                            )}
                        />
                    </DataTable>
                </Card>
            </div>

        </div>
    );
}
