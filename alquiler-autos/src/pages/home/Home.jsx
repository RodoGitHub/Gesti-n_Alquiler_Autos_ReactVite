import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const slides = [
    {
        id: 1,
        title: "Encontrá tu vehículo ideal",
        subtitle: "Autos, SUVs y utilitarios para cada necesidad",
        img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop",
        ctaLabel: "Ver vehículos",
        to: "/vehicles"
    },
    {
        id: 2,
        title: "Reservá en minutos",
        subtitle: "Proceso simple, claro y sin vueltas",
        img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop",
        ctaLabel: "Alquilar ahora",
        to: "/rental"
    },
    {
        id: 3,
        title: "Atención personalizada",
        subtitle: "Estamos para ayudarte de lunes a viernes",
        img: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
        ctaLabel: "Contactar",
        to: "/about"
    }
];

const infoCards = [
    {
        id: "c1",
        title: "Cobertura y seguros",
        text: "Agregá aquí info sobre tu cobertura, asistencia y pólizas.",
        img: "https://plus.unsplash.com/premium_photo-1661375337384-b6e1f64d7d3d?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyJTIwcHJvdGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200&auto=format&fit=crop",
        to: "/about"
    },
    {
        id: "c2",
        title: "Flota renovada",
        text: "Modelos recientes, mantenimiento al día y variedad de segmentos.",
        img: "https://images.unsplash.com/photo-1630165356623-266076eaceb6?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FyJTIwZmxlZXR8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=80&w=1200&auto=format&fit=crop",
        to: "/vehicles"
    },
    {
        id: "c3",
        title: "Beneficios y promos",
        text: "Espacio para promociones, cupones o beneficios por fidelidad.",
        img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
        to: "/rental"
    }
];

export default function Home() {
    const navigate = useNavigate();
    const carouselRef = useRef(null);

    const slideTemplate = (item) => (
        <div
            className="border-round-xl overflow-hidden"
            style={{
                position: "relative",
                height: 420,
                backgroundImage: `url('${item.img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.15) 100%)"
                }}
            />
            <div
                className="p-4 md:p-6"
                style={{
                    position: "absolute",
                    bottom: 0,
                    color: "white",
                    width: "100%"
                }}
            >
                <h2 style={{ margin: 0 }}>{item.title}</h2>
                <p style={{ margin: "6px 0 12px", opacity: 0.95 }}>{item.subtitle}</p>
                <Button
                    label={item.ctaLabel}
                    icon="pi pi-arrow-right"
                    onClick={() => navigate(item.to)}
                />
            </div>
        </div>
    );

    return (
        <div className="p-3 md:p-4" style={{ maxWidth: 1500, margin: "0 auto" }}>

            <div className="card surface-card border-round-2xl p-2" style={{ boxShadow: "0 4px 16px rgba(0,0,0,.08)" }}>
                <Carousel
                    ref={carouselRef}
                    value={slides}
                    itemTemplate={slideTemplate}
                    numVisible={1}
                    numScroll={1}
                    circular
                    autoplayInterval={5000}
                    showNavigators
                    showIndicators
                />
            </div>

            <div className="grid mt-4">
                {infoCards.map((c) => (
                    <div key={c.id} className="col-12 md:col-4">
                        <Card
                            className="h-full border-round-xl overflow-hidden"
                            header={
                                <div
                                    style={{
                                        height: 160,
                                        backgroundImage: `url('${c.img}')`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }}
                                />
                            }
                            title={<span className="text-900">{c.title}</span>}
                            footer={
                                <div className="flex justify-content-end">
                                    <Button
                                        label="Ver más"
                                        icon="pi pi-arrow-right"
                                        className="p-button-text"
                                        onClick={() => navigate(c.to)}
                                    />
                                </div>
                            }
                        >
                            <p className="m-0 text-700" style={{ minHeight: 54 }}>
                                {c.text}
                            </p>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
