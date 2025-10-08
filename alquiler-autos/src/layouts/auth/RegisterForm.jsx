import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { resource } from "../../services/api";
import "primeflex/primeflex.css";

const registerService = resource("auth/register", "Autenticación");

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.current.show({
                severity: "warn",
                summary: "Advertencia",
                detail: "Las contraseñas no coinciden",
                life: 2000,
            });
            return;
        }
        try {
            await registerService.create({ nombre: name, correo: email, password });
            toast.current.show({
                severity: "success",
                summary: "Éxito",
                detail: "Registro exitoso, ahora inicia sesión.",
                life: 2500,
            });
            navigate("/login");
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message || "No se pudo conectar con el servidor",
                life: 3000,
            });
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <Toast ref={toast} />

            {/* Mitad izquierda */}
            <div className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-6" style={{ backgroundColor: '#1F2937', color: 'white' }}>
                <h1 className="text-6xl font-bold mb-3">AutoGo!</h1>
                <h2 className="text-2xl mb-4" style={{ color: '#BFDBFE' }}>Tu viaje comienza aquí</h2>
                <p className="text-lg text-center" style={{ color: '#D1D5DB', maxWidth: '20rem' }}>
                    Alquiler de autos fácil, rápido y seguro.
                </p>
            </div>

            {/* Mitad derecha */}
            <div className="flex align-items-center justify-content-center flex-1 bg-gray-100 p-6">
                <Card className="w-full max-w-25rem p-5 shadow-3 border-round-xl">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-semibold">Crear Cuenta</h2>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-column gap-3">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="name" className="font-medium">Nombre completo</label>
                            <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="email" className="font-medium">Email</label>
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="password" className="font-medium">Contraseña</label>
                            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} required placeholder="Contraseña" />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="confirmPassword" className="font-medium">Confirmar contraseña</label>
                            <Password id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask feedback={false} required placeholder="Repite tu contraseña" />
                        </div>

                        <Button
                            type="submit"
                            label="Registrarse"
                            icon="pi pi-user-plus"
                            className="w-full p-button-rounded font-bold"
                            style={{ backgroundColor: "#FF6B35", border: "none" }}
                        />
                    </form>

                    <Divider />
                    <div className="text-center">
                        <p>¿Ya tienes cuenta?</p>
                        <Button
                            label="Iniciar Sesión"
                            className="p-button-text"
                            onClick={() => navigate("/login")}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
