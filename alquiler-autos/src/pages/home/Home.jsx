import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AUTH_TYPE } from "../../constants/authType";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
// Para usar una imagen local, descomenta la siguiente línea y coloca tu imagen en src/assets/
// import autoImagen from "../../assets/tu-imagen.jpg";
// Fuentes de imágenes gratuitas: Unsplash.com, Pexels.com, Pixabay.com

export default function Home() {
    const { user, status, signOut } = useContext(AuthContext);
    const navigate = useNavigate();
    if (status === AUTH_TYPE.LOADING) {
        return <div>Cargando información...</div>;
    }

    // Para cambiar la imagen:
    // 1. Opción URL directa: Reemplaza la URL de abajo con una de Unsplash/Pexels
    // 2. Opción imagen local: Descomenta el import arriba y usa: backgroundImage: `url(${autoImagen})`,
    //    Para específicos, descarga la imagen y colócala en src/assets/
    const backgroundStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 16,
        backgroundColor: "#0D3B66",
        backgroundImage: "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative"
    };

    const overlayStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(13, 59, 102, 0.7)",
        zIndex: 1
    };

    const contentStyle = {
        position: "relative",
        zIndex: 2
    };

    if (!user) {
        return (
            <div style={backgroundStyle} className="home-container">
                <div style={overlayStyle}></div>
                <div style={contentStyle}>
                    <Card className="auth-card no-hover" style={{ maxWidth: 520, width: "100%", textAlign: "center", margin: "0 auto" }}>
                        <h2 style={{ marginTop: 0 }}>Bienvenido</h2>
                        <p style={{ marginTop: 0 }}>No hay usuario logueado.</p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%", marginBottom: "1rem", flexWrap: "wrap" }}>
                            <Button label="Iniciar sesión" icon="pi pi-sign-in" className="p-button-primary" onClick={() => navigate('/auth/login')} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <Button 
                                label="Sobre Nosotros" 
                                icon="pi pi-info-circle"
                                className="p-button-text p-button-secondary"
                                onClick={() => navigate('/about')}
                                style={{ fontSize: "0.9rem" }}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return(
        <div style={backgroundStyle}>
            <div style={overlayStyle}></div>
            <div style={contentStyle}>
                <Card className="auth-card no-hover" style={{ maxWidth: 520, width: "100%", textAlign: "center", margin: "0 auto" }}>
                    <h2 style={{ marginTop: 0 }}>Inicio</h2>
                    <h3 style={{ marginTop: 0 }}>Hola: {user.nombre}</h3>
                    <p> {user.correo}</p>
                    
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", width: "100%", marginBottom: "1rem", flexWrap: "wrap" }}>
                        {user?.rol === "admin" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                                <Button label="Lista de Usuarios" icon="pi pi-users" className="p-button-secondary" onClick={() => navigate('/user/list')} />
                                <Button label="Registrar Usuario" icon="pi pi-user-plus" className="p-button-secondary" onClick={() => navigate('/user/register')} />
                            </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                            <Button label="Lista de Clientes" icon="pi pi-users" className="p-button-secondary" onClick={() => navigate('/client/list')} />
                            {user?.rol === "admin" && (
                                <Button label="Registrar Cliente" icon="pi pi-user-plus" className="p-button-secondary" onClick={() => navigate('/client/register')} />
                            )}
                        </div>
                    </div>
                    
                    {(user?.rol === "admin" || user?.rol === "empleado") && (
                        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%", marginBottom: "1rem", flexWrap: "wrap" }}>
                            <Button label="Flota" icon="pi pi-car" className="p-button-secondary" onClick={() => navigate('/car/list')} style={{ minWidth: "140px" }} />
                            <Button label="Reservas" icon="pi pi-calendar" className="p-button-secondary" onClick={() => navigate('/rental/list')} style={{ minWidth: "140px" }} />
                        </div>
                    )}
                    
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <Button label="Cerrar sesión" icon="pi pi-sign-out" className="p-button-danger" onClick={() => signOut()} />
                    </div>
                    
                    <p style={{ marginTop: "2.5rem", marginBottom: 0 }}>Estas conectado como: {user.rol}</p>
                </Card>
            </div>
        </div>
    );
}