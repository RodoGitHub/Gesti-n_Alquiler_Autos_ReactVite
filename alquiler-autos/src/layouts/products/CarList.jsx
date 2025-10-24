import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import axios from "axios";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

export default function CarList() {
    const { user, status } = useAuth();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [newCar, setNewCar] = useState({
        marcaId: "",
        modelo: "",
        anio: "",
        precio_dia: "",
        disponible: true,
        is_active: true,
    });

    // Obtener autos
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Token usado:", token);

                const res = await axios.get("http://localhost:3000/car", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Respuesta completa del backend:", res);
                console.log("Datos de autos recibidos:", res.data.data);

                setCars(res.data.data || []);
            } catch (err) {
                console.error("Error capturado al obtener autos:", err);
                if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Data:", err.response.data);
                }
                alert("Error al obtener los autos");
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    // Agregar un auto
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token usado para POST:", token);
            console.log("Datos del nuevo auto:", newCar);

            const res = await axios.post("http://localhost:3000/car", newCar, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Respuesta POST del backend:", res);

            setCars([...cars, res.data.data]);
            setShowDialog(false);
            setNewCar({
                marcaId: "",
                modelo: "",
                anio: "",
                precio_dia: "",
                disponible: true,
                is_active: true,
            });
        } catch (err) {
            console.error("Error capturado al agregar auto:", err);
            if (err.response) {
                console.error("Status:", err.response.status);
                console.error("Data:", err.response.data);
            }
            alert("Error al agregar vehículo");
        }
    };

    if (status === "loading") return <p>Cargando...</p>;
    if (status === "unauthenticated") return <p>No estás autenticado.</p>;

    return (
        <div className="flex flex-row h-screen w-screen">
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

            <div className="flex flex-1 justify-content-center align-items-stretch p-4" style={{ backgroundColor: "#ffffff" }}>
                <Card
                    title="Listado de Vehículos"
                    className="w-full flex flex-column"
                    style={{ maxWidth: "900px", borderRadius: "1.2rem", padding: "1rem", height: "100%" }}
                >
                    <div className="flex justify-content-between align-items-center mb-3">
                        <h3 style={{ margin: 0 }}>{user?.nombre || user?.email}</h3>
                        <Button
                            label="Agregar Vehículo"
                            icon="pi pi-plus"
                            onClick={() => setShowDialog(true)}
                            style={{ backgroundColor: "#1f3d5a", border: "none" }}
                        />
                    </div>

                    <DataTable value={cars} loading={loading} className="p-datatable-sm flex-grow-1" style={{ fontSize: "0.9rem" }}>
                        <Column field="brand.nombre" header="Marca" body={(row) => row.brand?.nombre || "-"} />
                        <Column field="modelo" header="Modelo" />
                        <Column field="anio" header="Año" />
                        <Column field="precio_dia" header="Precio Día" body={(row) => `$ ${row.precio_dia}`} />
                        <Column field="disponible" header="Disponible" body={(row) => (row.disponible ? "Sí" : "No")} />
                        <Column field="is_active" header="Activo" body={(row) => (row.is_active ? "Sí" : "No")} />
                    </DataTable>
                </Card>
            </div>

            <Dialog
                header="Agregar Vehículo"
                visible={showDialog}
                style={{ width: "25rem" }}
                modal
                onHide={() => setShowDialog(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" className="p-button-text" onClick={() => setShowDialog(false)} />
                        <Button label="Guardar" onClick={handleSave} />
                    </div>
                }
            >
                <div className="flex flex-column gap-3 p-3">
                    <span className="p-float-label">
                        <InputText id="marcaId" value={newCar.marcaId} onChange={(e) => setNewCar({ ...newCar, marcaId: e.target.value })} />
                        <label htmlFor="marcaId">Marca ID</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="modelo" value={newCar.modelo} onChange={(e) => setNewCar({ ...newCar, modelo: e.target.value })} />
                        <label htmlFor="modelo">Modelo</label>
                    </span>
                    <span className="p-float-label">
                        <InputNumber id="anio" value={newCar.anio} onValueChange={(e) => setNewCar({ ...newCar, anio: e.value })} />
                        <label htmlFor="anio">Año</label>
                    </span>
                    <span className="p-float-label">
                        <InputNumber
                            id="precio_dia"
                            value={newCar.precio_dia}
                            onValueChange={(e) => setNewCar({ ...newCar, precio_dia: e.value })}
                            mode="currency"
                            currency="USD"
                        />
                        <label htmlFor="precio_dia">Precio por día</label>
                    </span>
                    <div className="flex align-items-center gap-2">
                        <Checkbox inputId="disponible" checked={newCar.disponible} onChange={(e) => setNewCar({ ...newCar, disponible: e.checked })} />
                        <label htmlFor="disponible">Disponible</label>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Checkbox inputId="is_active" checked={newCar.is_active} onChange={(e) => setNewCar({ ...newCar, is_active: e.checked })} />
                        <label htmlFor="is_active">Activo</label>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
