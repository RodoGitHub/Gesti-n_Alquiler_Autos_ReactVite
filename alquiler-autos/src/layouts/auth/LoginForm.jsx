import { useState } from "react";
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

export default function LoginForm({ setLoading, toast }) {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await loginService.create({ correo: correo.trim(), password });
            localStorage.setItem("token", data.token);

            toast?.current.show({
                severity: "success",
                summary: "¡Excelente!",
                detail: "Iniciaste correctamente",
                life: 4000
            });

            navigate("/", { replace: true });
        } catch (error) {
            const msg = error?.message || "Credenciales incorrectas o error de conexión";

            toast?.current.show({
                severity: "error",
                summary: "Error",
                detail: msg,
                life: 4000
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen">
            <div className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-6" style={{ backgroundColor: '#1F2937', color: 'white' }}>
                <h1 className="text-6xl font-bold mb-3">AutoGo!</h1>
                <h2 className="text-2xl mb-4" style={{ color: '#BFDBFE' }}>Bienvenido nuevamente</h2>
                <p className="text-lg text-gray-300 text-center">Gestioná tus reservas de forma fácil y rápida.</p>
            </div>

            <div className="flex align-items-center justify-content-center flex-1 bg-gray-100 p-6">
                {/* NO poner Toast acá, ya está en App.jsx */}
                <Card title="Iniciar Sesión" className="w-full max-w-25rem p-5 shadow-3 border-round-xl">
                    <form onSubmit={handleSubmit} className="flex flex-column gap-3">
                        <div className="p-field">
                            <label htmlFor="correo" className="font-medium mb-1 block">Correo electrónico</label>
                            <InputText
                                id="correo"
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="password" className="font-medium mb-1 block">Contraseña</label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                toggleMask
                                feedback={false}
                                placeholder="********"
                                required
                                className="w-full"
                            />
                        </div>
                        <Button
                            type="submit"
                            label="Ingresar"
                            icon="pi pi-sign-in"
                            className="w-full p-button-rounded font-bold"
                            style={{ backgroundColor: "#FF6B35", border: "none" }}
                            loading={false}
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