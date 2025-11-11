import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";

export default function About() {
    return (
        <div className="p-3" style={{ display: "grid", placeItems: "center", minHeight: "90vh" }}>
            <div style={{ width: 1200, maxWidth: "95vw" }}>

                <Card className="mb-3" style={{ overflow: "hidden" }}>
                    <div
                        className="p-4"
                        style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%)",
                            color: "white"
                        }}
                    >
                        <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4">
                            <div className="flex-1">
                                <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>
                                    Gestión de Alquiler de Autos
                                </h2>
                                <p style={{ margin: "8px 0 0", opacity: 0.95 }}>
                                    Simplificamos el alquiler de vehículos para que tu equipo trabaje más rápido,
                                    con menos errores y mejor información en tiempo real.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    label="Ver vehículos"
                                    icon="pi pi-car"
                                    className="p-button-rounded  p-button-sm"
                                    onClick={() => (window.location.href = "/car/list")}
                                />
                               
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid">
                    <div className="col-12 md:col-12">
                        <Card className="h-full">
                            <h3 style={{ marginTop: 0 }}>Nuestra misión</h3>
                            <p className="text-700" style={{ marginTop: 6 }}>
                                Brindar una herramienta clara y eficiente para administrar clientes, vehículos y alquileres,
                                con foco en la seguridad de datos, trazabilidad de estados y una experiencia ágil para
                                empleados y administradores.
                            </p>
                            <ul className="mt-3" style={{ paddingLeft: 18 }}>
                                <li>Procesos simples y consistentes</li>
                                <li>Visibilidad total del estado de los autos</li>
                                <li>Menos tiempo operativo, más resultados</li>
                            </ul>
                        </Card>
                    </div>
                    
                </div>

                {/* Métricas simpáticas */}
                <Card className="mb-3">
                    <div className="grid text-center">
                        <div className="col-6 md:col-3">
                            <h3 className="m-0">+99%</h3>
                            <span className="text-600">Disponibilidad del sistema</span>
                        </div>
                        <div className="col-6 md:col-3">
                            <h3 className="m-0">-60%</h3>
                            <span className="text-600">Tiempo operativo</span>
                        </div>
                        <div className="col-6 md:col-3">
                            <h3 className="m-0">100%</h3>
                            <span className="text-600">Trazabilidad de estados</span>
                        </div>
                        <div className="col-6 md:col-3">
                            <h3 className="m-0">24/7</h3>
                            <span className="text-600">Acceso seguro</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    

                    <div className="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between gap-2">
                        <span className="text-700">
                            ¿Querés sumar una mejora o integraciones nuevas?
                        </span>
                        <div className="flex gap-2">
                            <Button
                                label="Contactar"
                                icon="pi pi-envelope"
                                className="p-button-sm p-button-outlined"
                                onClick={() => (window.location.href = "mailto:contacto@tuapp.com")}
                            />
            
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
