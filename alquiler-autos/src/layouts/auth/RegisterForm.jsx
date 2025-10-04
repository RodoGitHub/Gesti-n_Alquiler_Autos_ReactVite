import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import "../../App.css";

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
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
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, correo: email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.current.show({
                    severity: "success",
                    summary: "Éxito",
                    detail: "Usuario registrado correctamente!",
                    life: 2000,
                });
                setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: data.message || `Error ${response.status}: No se pudo registrar`,
                    life: 3000,
                });
            }
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Error de conexión: ${error.message}`,
                life: 3000,
            });
            console.error(error);
        }
    };

    const handleLoginRedirect = () => navigate("/login");

    return (
        <div className="auth-hero">
            <div className="auth-hero-left">
                <h1>Crea tu cuenta</h1>
                <h2>Tu viaje, tu libertad</h2>
                <p>Disfruta de alquiler de autos simple, confiable y sin estrés.</p>

            </div>

            <div className="auth-hero-right">
                <Toast ref={toast} />
                <Card title="" className="auth-card compact-card">
                    <form onSubmit={handleSubmit} className="login-form flex flex-column gap-2">
                        <div className="p-field">
                            <label htmlFor="name">Nombre completo</label>
                            <InputText
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre"
                                required
                                className="full-width compact-input"
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                required
                                className="full-width compact-input"
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
                                className="full-width compact-input"
                                inputClassName="full-width"
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
                                placeholder="Repite tu contraseña"
                                required
                                className="full-width compact-input"
                                inputClassName="full-width"
                            />
                        </div>

                        <Button
                            type="submit"
                            label="Registrarse"
                            icon="pi pi-user-plus"
                            className="p-button-primary p-button-rounded full-width compact-button"
                        />
                    </form>

                    <Divider className="my-2" />

                    <div className="text-center compact-login-redirect">
                        <p>¿Ya tienes cuenta?</p>
                        <Button
                            label="Iniciar Sesión"
                            className="p-button-text p-button-sm"
                            onClick={handleLoginRedirect}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
