import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { useAuth } from "../../context/AuthContext"; 
import "../../App.css";

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();
    const { signIn } = useAuth(); // ✅ usamos el contexto correctamente

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLogin && password !== confirmPassword) {
            toast.current.show({
                severity: "warn",
                summary: "Advertencia",
                detail: "Las contraseñas no coinciden",
                life: 1500,
            });
            return;
        }

        if (isLogin) {
            // 🔹 Login usando el contexto
            try {
                await signIn({ correo: email, password });
                toast.current.show({
                    severity: "success",
                    summary: "Éxito",
                    detail: "Login exitoso!",
                    life: 1500,
                });
                navigate("/usuarios"); // 🔹 redirige al dashboard o lista de usuarios
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Correo o contraseña incorrectos",
                    life: 3000,
                });
                console.error(error);
            }
        } else {
            // 🔹 Registro
            try {
                const res = await fetch("http://localhost:3000/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: name, correo: email, password }),
                });
                const data = await res.json();

                if (res.ok) {
                    toast.current.show({
                        severity: "success",
                        summary: "Éxito",
                        detail: "Registro exitoso! Ahora inicia sesión.",
                        life: 2000,
                    });
                    setIsLogin(true); // vuelve a modo login
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: data.message || "Ocurrió un error al registrarse",
                        life: 3000,
                    });
                }
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Error de conexión con el servidor",
                    life: 3000,
                });
                console.error(error);
            }
        }

        // 🔹 limpiar campos
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
    };

    return (
        <div className="auth-hero">
            <div className="auth-hero-left">
                <h1>AutoGo!</h1>
                <h2>Tu viaje comienza aquí</h2>
                <p>Alquiler de autos fácil, rápido y seguro.</p>
            </div>

            <div className="auth-hero-right">
                <Toast ref={toast} />
                <Card
                    title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                    className="auth-card"
                >
                    <form onSubmit={handleSubmit} className="login-form flex flex-column gap-4">
                        {!isLogin && (
                            <div className="p-field">
                                <label htmlFor="name">Nombre completo</label>
                                <InputText
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tu nombre"
                                    required
                                    className="full-width"
                                />
                            </div>
                        )}

                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                required
                                className="full-width"
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
                                placeholder="Contraseña"
                                required
                                className="full-width"
                                inputClassName="full-width"
                            />
                        </div>

                        {!isLogin && (
                            <div className="p-field">
                                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                <Password
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    toggleMask
                                    feedback={false}
                                    placeholder="Repite tu contraseña"
                                    required
                                    className="full-width"
                                    inputClassName="full-width"
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            label={isLogin ? "Ingresar" : "Registrarse"}
                            icon={isLogin ? "pi pi-sign-in" : "pi pi-user-plus"}
                            className="p-button-primary p-button-rounded full-width"
                        />
                    </form>

                    <Divider className="my-4" />

                    <div className="text-center">
                        <p>{isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</p>
                        <Button
                            label={isLogin ? "Registrarse" : "Iniciar Sesión"}
                            className="p-button-text"
                            onClick={() => setIsLogin(!isLogin)}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
