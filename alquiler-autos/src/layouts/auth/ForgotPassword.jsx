import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../../App.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: `Se ha enviado un correo a ${email} para restablecer la contraseña.`,
        life: 3000,
        });
        setEmail("");
    };

    return (
        <div className="auth-hero">
        <div className="auth-hero-left">
            <h1>Recuperar contraseña</h1>
            <h2>Olvidaste tu contraseña?</h2>
            <p>Ingresá tu correo y te enviaremos un enlace para restablecerla.</p>
        </div>
        <div className="auth-hero-right">
            <Toast ref={toast} />
            <Card className="auth-card">
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
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
                <Button
                type="submit"
                label="Enviar enlace"
                className="p-button-primary p-button-rounded full-width"
                />
            </form>
            </Card>
        </div>
        </div>
    );
}
