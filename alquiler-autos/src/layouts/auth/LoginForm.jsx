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

const loginService = resource("auth/login", "Autenticación");

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginService.create({ correo: email, password });
            localStorage.setItem("token", data.token);
            toast.current.show({ severity: "success", summary: "Éxito", detail: "Inicio de sesión correcto", life: 2000 });
            navigate("/usuarios");
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message || "No se pudo conectar con el servidor", life: 3000 });
        }
    };

    return (
        <div className="flex flex-column md:flex-row h-screen w-screen surface-900">
            <Toast ref={toast} />

            <div className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-6" style={{ backgroundColor: '#1F2937', color: 'white' }}>
                <h1 className="text-6xl font-bold mb-3">AutoGo!</h1>
                <h2 className="text-2xl mb-4" style={{ color: '#BFDBFE' }}>Tu viaje comienza aquí</h2>
                <p className="text-lg text-center" style={{ color: '#D1D5DB', maxWidth: '20rem' }}>
                    Alquiler de autos fácil, rápido y seguro.
                </p>
            </div>

            <div className="flex align-items-center justify-content-center flex-1 bg-gray-100 p-6">
                <Card className="w-full max-w-25rem p-5 shadow-3 border-round-xl">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-semibold">Iniciar Sesión</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-column gap-3">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email" className="font-medium">Email</label>
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="password" className="font-medium">Contraseña</label>
                            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} required placeholder="Contraseña" />
                        </div>
                        <Button
                            type="submit"
                            label="Ingresar"
                            icon="pi pi-sign-in"
                            className="w-full p-button-rounded font-bold"
                            style={{ backgroundColor: "#FF6B35", border: "none" }}
                        />
                    </form>

                    <Divider />
                    <div className="text-center">
                        <p className="mb-2">¿No tienes cuenta?</p>
                        <Button
                            label="Registrarse"
                            className="p-button-text text-primary font-bold"
                            onClick={() => navigate("/register")}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
