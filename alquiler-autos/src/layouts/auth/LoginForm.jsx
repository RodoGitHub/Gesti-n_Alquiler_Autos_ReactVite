import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await login(email, password);
        toast.current.show({ severity: "success", summary: "Bienvenido", detail: "Inicio de sesión exitoso" });
        navigate("/home");
        } catch (error) {
        toast.current.show({ severity: "error", summary: "Error", detail: error });
        }
    };

    return (
        <Card title="Iniciar Sesión" className="max-w-md mx-auto mt-6">
        <form onSubmit={handleSubmit}>
            <div className="p-field mb-3">
            <label htmlFor="email">Correo electrónico</label>
            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="p-field mb-3">
            <label htmlFor="password">Contraseña</label>
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
            </div>

            <Button label="Ingresar" icon="pi pi-sign-in" type="submit" className="w-full" />
        </form>
        <Toast ref={toast} />
        </Card>
    );
}

