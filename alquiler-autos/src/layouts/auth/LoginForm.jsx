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
const registerService = resource("auth/register", "Autenticación");

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const { data } = await loginService.create({ correo: email, password });
                localStorage.setItem("token", data.token);
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Inicio de sesión correcto", life: 2000 });
                navigate("/usuarios");
            } else {
                if (password !== confirmPassword) {
                    toast.current.show({ severity: "warn", summary: "Advertencia", detail: "Las contraseñas no coinciden", life: 2000 });
                    return;
                }
                await registerService.create({ nombre: name, correo: email, password });
                toast.current.show({ severity: "success", summary: "Éxito", detail: "Registro exitoso, ahora inicia sesión.", life: 2500 });
                setIsLogin(true);
            }
            setEmail(""); setPassword(""); setConfirmPassword(""); setName("");
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: error.message || "No se pudo conectar con el servidor", life: 3000 });
        }
    };

    return (
        <div className="flex flex-column md:flex-row h-screen w-screen surface-900">
            <Toast ref={toast} />

            {/* LADO IZQUIERDO */}
            <div className="hidden md:flex md:flex-column md:justify-content-center md:align-items-center flex-1 text-white p-8">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-3">AutoGo!</h1>
                    <h2 className="text-2xl font-medium mb-6">Tu viaje comienza aquí</h2>
                    <p className="text-lg text-gray-300">Alquiler de autos fácil, rápido y seguro.</p>
                </div>
            </div>

            {/* LADO DERECHO */}
            <div className="flex align-items-center justify-content-center flex-1 bg-gray-100">
                <Card className="w-full max-w-25rem p-5 shadow-3 border-round-xl">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-semibold">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-column gap-3">
                        {!isLogin && (
                            <div className="flex flex-column gap-2">
                                <label htmlFor="name" className="font-medium">Nombre completo</label>
                                <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                            </div>
                        )}
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email" className="font-medium">Email</label>
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="password" className="font-medium">Contraseña</label>
                            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} required placeholder="Contraseña" />
                        </div>
                        {!isLogin && (
                            <div className="flex flex-column gap-2">
                                <label htmlFor="confirmPassword" className="font-medium">Confirmar contraseña</label>
                                <Password id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask feedback={false} required placeholder="Repite tu contraseña" />
                            </div>
                        )}
                        <Button
                            type="submit"
                            label={isLogin ? "Ingresar" : "Registrarse"}
                            icon={isLogin ? "pi pi-sign-in" : "pi pi-user-plus"}
                            className="w-full p-button-rounded font-bold"
                            style={{ backgroundColor: "#FF6B35", border: "none" }}
                        />
                    </form>

                    <Divider />
                    <div className="text-center">
                        <p className="mb-2">{isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</p>
                        <Button
                            label={isLogin ? "Registrarse" : "Iniciar Sesión"}
                            className="p-button-text text-primary font-bold"
                            onClick={() => setIsLogin(!isLogin)}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
