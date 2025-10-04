import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { toast } from "react-toastify";
import "../../App.css";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo: email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Login exitoso!", { autoClose: 2000 });

            if (data.token) localStorage.setItem("token", data.token);

            // Redirigir al dashboard
            navigate("/dashboard");
        } else {
            toast.error(data.message || "Error de login", { autoClose: 3000 });
        }
        } catch (error) {
        toast.error("Error de conexión con el servidor", { autoClose: 3000 });
        console.error(error);
        }
    };

    return (
        <div className="auth-hero">
        <div className="auth-hero-left">
            <h1>AutoGo!</h1>
            <h2>Tu viaje comienza aquí</h2>
            <p>Alquiler de autos fácil, rápido y seguro.</p>
        </div>

        <div className="auth-hero-right">
            <Card title="Iniciar Sesión" className="auth-card">
            <form onSubmit={handleSubmit} className="login-form flex flex-column gap-4">
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

                <Button
                type="submit"
                label="Ingresar"
                icon="pi pi-sign-in"
                className="p-button-primary p-button-rounded full-width"
                />
            </form>

            <Divider className="my-4" />

            <div className="text-center">
                <p>¿No tienes cuenta?</p>
                <Button
                label="Registrarse"
                className="p-button-text"
                onClick={() => navigate("/register")}
                />
            </div>
            </Card>
        </div>
        </div>
    );
}
