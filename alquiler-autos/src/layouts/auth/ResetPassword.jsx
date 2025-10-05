import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../../App.css";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Las contraseñas no coinciden",
            life: 3000,
        });
        return;
        }
        toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Contraseña restablecida correctamente",
        life: 3000,
        });
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/login"), 2000);
    };

    return (
        <div className="auth-hero">
        <div className="auth-hero-left">
            <h1>Restablecer contraseña</h1>
            <h2>Nueva contraseña</h2>
            <p>Ingresá tu nueva contraseña para tu cuenta.</p>
        </div>
        <div className="auth-hero-right">
            <Toast ref={toast} />
            <Card className="auth-card">
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                <div className="p-field">
                <label htmlFor="password">Contraseña</label>
                <Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    toggleMask
                    feedback={false}
                    placeholder="Nueva contraseña"
                    required
                    className="full-width"
                />
                </div>
                <div className="p-field">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <Password
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    toggleMask
                    feedback={false}
                    placeholder="Repetir contraseña"
                    required
                    className="full-width"
                />
                </div>
                <Button
                type="submit"
                label="Restablecer contraseña"
                className="p-button-primary p-button-rounded full-width"
                />
            </form>
            </Card>
        </div>
        </div>
    );
}
