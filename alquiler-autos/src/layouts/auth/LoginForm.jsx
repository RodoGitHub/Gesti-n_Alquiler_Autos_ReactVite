import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import "../../App.css";

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD
        const url = isLogin 
        ? "http://localhost:3000/register/login" 
        : "http://localhost:3000/register/register";

        const body = isLogin 
        ? { correo: email, password } 
        : { nombre: name, correo: email, password };

        try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: isLogin ? "Login exitoso!" : "Registro exitoso!",
            life: 3000,
            });

            if (data.token) localStorage.setItem("token", data.token);
            setEmail("");
            setPassword("");
            setName("");
            navigate("/");
        } else {
            toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message || "Ocurrió un error",
            life: 3000,
            });
        }
=======
        console.log({ correo: email, password });

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    orreo: email, password })
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
                navigate("/");
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: data.message || "Credenciales incorrectas",
                    life: 3000,
                });
            }
>>>>>>> 25bbe8a995e9ad89352a53e78463974f046d13c9
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
        <div className="auth-hero">
        {/* Lado izquierdo */}
        <div className="auth-hero-left">
            Bienvenido a <br /> Mi Plataforma
        </div>

        {/* Lado derecho: formulario */}
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
