import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
<<<<<<< Updated upstream
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
=======
import { Divider } from "primereact/divider";
import { resource } from "../../services/api";
import "primeflex/primeflex.css";

const loginService = resource("auth/login", "Autenticación");
const registerService = resource("auth/register", "Autenticación");

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
>>>>>>> Stashed changes
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();
<<<<<<< Updated upstream
    const { login } = useAuth();
=======
>>>>>>> Stashed changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
<<<<<<< Updated upstream
        await login(email, password);
        toast.current.show({ severity: "success", summary: "Bienvenido", detail: "Inicio de sesión exitoso" });
        navigate("/home");
        } catch (error) {
        toast.current.show({ severity: "error", summary: "Error", detail: error });
=======
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
>>>>>>> Stashed changes
        }
    };

    return (
<<<<<<< Updated upstream
        <Card title="Iniciar Sesión" className="max-w-md mx-auto mt-6">
        <form onSubmit={handleSubmit}>
            <div className="p-field mb-3">
            <label htmlFor="email">Correo electrónico</label>
            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
=======
        <div className="surface-0 flex h-screen w-screen">
        <Toast ref={toast} />
        <div className="hidden md:flex md:flex-1 bg-blue-900 flex-col justify-between p-8 h-full text-white">
            <div className="flex flex-col items-center">
                <h1 className="text-5xl font-bold mb-2">AutoGo!</h1>
                <h2 className="text-2xl font-medium text-blue-200 mt-2">Tu viaje comienza aquí</h2>
>>>>>>> Stashed changes
            </div>
            <p className="text-lg text-gray-300 text-center mt-auto">Alquiler de autos fácil, rápido y seguro.</p>
        </div>

<<<<<<< Updated upstream
            <div className="p-field mb-3">
            <label htmlFor="password">Contraseña</label>
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
            </div>

            <Button label="Ingresar" icon="pi pi-sign-in" type="submit" className="w-full" />
        </form>
        <Toast ref={toast} />
        </Card>
=======
        <div className="flex flex-1 justify-center items-center p-6 bg-gray-100">
            <Card title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"} className="w-full max-w-md p-6 shadow-2 flex flex-col gap-4">
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
>>>>>>> Stashed changes
    );
}

