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
        if(password !== confirmPassword) {
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
        <div className="h-screen w-screen flex overflow-hidden">
            <Toast ref={toast} />

            
            <div className="hidden md:flex md:w-1/2 bg-blue-900 flex-col justify-center items-center text-white p-8">
                <h1 className="text-5xl font-bold mb-2">AutoGo!</h1>
                <h2 className="text-2xl font-medium text-blue-200 mb-4">Tu viaje comienza aquí</h2>
                <p className="text-lg text-gray-300 max-w-md text-center">
                    Alquiler de autos fácil, rápido y seguro.
                </p>
            </div>

            
            <div className="flex flex-1 justify-center items-center bg-gray-100 p-8">
                <Card title="Crear Cuenta" className="w-full max-w-md p-6 rounded-lg shadow-lg">
                    <form onSubmit={handleRegister} className="p-fluid flex flex-col gap-4">
                        <div className="p-field">
                            <label htmlFor="name">Nombre completo</label>
                            <InputText
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre"
                                required
                                className="rounded-md border border-gray-400 p-2"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                required
                                className="rounded-md border border-gray-400 p-2"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="password">Contraseña</label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                toggleMask
                                feedback={false}
                                required
                                placeholder="Contraseña"
                                inputClassName="rounded-md border border-gray-400 p-2"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="confirmPassword">Confirmar contraseña</label>
                            <Password
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                toggleMask
                                feedback={false}
                                required
                                placeholder="Repite tu contraseña"
                                inputClassName="rounded-md border border-gray-400 p-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            label="Registrarse"
                            icon="pi pi-user-plus"
                            className="p-button-rounded w-full"
                            style={{ backgroundColor: "#FF6B35", border: "none", fontWeight: "bold" }}
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
