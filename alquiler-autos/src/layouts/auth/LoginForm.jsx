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
        <div className="flex flex-col md:flex-row h-screen w-screen">
            {/* Panel lateral solo visible en pantallas medianas y grandes */}
            <div className="hidden md:flex md:flex-1 bg-blue-900 flex-col justify-center items-center p-10 text-white">
                <h1 className="text-5xl font-bold mb-4">AutoGo!</h1>
                <h2 className="text-2xl font-medium text-blue-200 mb-6">Tu viaje comienza aquí</h2>
                <p className="text-lg text-gray-300 text-center">Alquiler de autos fácil, rápido y seguro.</p>
            </div>

            {/* Formulario */}
            <div className="flex flex-1 justify-center items-center p-6 bg-gray-100">
                <Card title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"} className="w-full max-w-md p-6 shadow-2 flex flex-col gap-4">
                    <Toast ref={toast} />
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!isLogin && (
                            <div className="p-field">
                                <label htmlFor="name">Nombre completo</label>
                                <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required className="w-full" />
                            </div>
                        )}
                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required className="w-full" />
                        </div>
                        <div className="p-field">
                            <label htmlFor="password">Contraseña</label>
                            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} required placeholder="Contraseña" className="w-full" />
                        </div>
                        {!isLogin && (
                            <div className="p-field">
                                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                <Password id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask feedback={false} required placeholder="Repite tu contraseña" className="w-full" />
                            </div>
                        )}
                        <Button type="submit" label={isLogin ? "Ingresar" : "Registrarse"} icon={isLogin ? "pi pi-sign-in" : "pi pi-user-plus"} className="p-button-rounded w-full" style={{ backgroundColor: "#FF6B35", border: "none", fontWeight: "bold" }} />
                    </form>
                    <Divider />
                    <div className="text-center">
                        <p>{isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</p>
                        <Button label={isLogin ? "Registrarse" : "Iniciar Sesión"} className="p-button-text" onClick={() => setIsLogin(!isLogin)} />
                    </div>
                </Card>
            </div>
        </div>
    );
}
