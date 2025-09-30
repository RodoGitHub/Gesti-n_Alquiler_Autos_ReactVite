import { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import "../../App.css"; // ajustá según tu ruta

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Login exitoso!",
            life: 3000,
            });
            if (data.token) localStorage.setItem("token", data.token);
            setEmail("");
            setPassword("");
        } else {
            toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message || "Credenciales incorrectas",
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
    };

    return (
        <div className="login-container">
        <Toast ref={toast} />
        <Card title="Iniciar Sesión" className="login-card">
            <form onSubmit={handleSubmit} className="login-form">
            <div className="p-field">
                <label htmlFor="email">Email</label>
                <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="p-inputtext-sm full-width"
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
                className="p-inputtext-sm full-width"
                />
            </div>

            <Button
                type="submit"
                label="Ingresar"
                icon="pi pi-sign-in"
                className="p-button-rounded p-button-primary full-width"
            />
            </form>

            <Divider />

            <div className="register-link">
            <p>
                ¿No tenés cuenta?{" "}
                <Button
                label="Registrarse"
                className="p-button-text p-button-sm"
                onClick={() => console.log("Ir a registro")}
                />
            </p>
            </div>
        </Card>
        </div>
    );
}
