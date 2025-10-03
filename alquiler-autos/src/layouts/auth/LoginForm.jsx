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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ correo: email, password });

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({correo: email, password })
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

    const handleRegisterRedirect = () => {
        navigate("/register"); 
    };

    return (
        <div 
            className="flex justify-content-center align-items-center bg-gray-100"
            style={{ 
                height: "100vh", 
                width: "100vw",
                padding: "1rem",
                boxSizing: "border-box"
            }}
        >
            <Toast ref={toast} />
            <Card 
                title="Iniciar Sesión" 
                className="shadow-5 border-round-lg"
                style={{ 
                    width: "100%", 
                    maxWidth: "450px",
                    minHeight: "500px",
                    padding: "2rem"
                }}
            >
                <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                    <div className="field">
                        <label htmlFor="email" className="block text-lg font-medium mb-2">
                            Email
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            required
                            className="w-full"
                            size="large"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password" className="block text-lg font-medium mb-2">
                            Contraseña
                        </label>
                        
                        <div className="p-password p-component p-inputwrapper w-full">
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                toggleMask
                                feedback={false}
                                placeholder="Contraseña"
                                required
                                className="w-full"
                                inputClassName="w-full"
                                size="large"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        label="Ingresar"
                        icon="pi pi-sign-in"
                        className="p-button-rounded p-button-primary w-full mt-3"
                        size="large"
                    />
                </form>

                <Divider className="my-4" />

                <div className="text-center">
                    <p className="text-lg mb-2">
                        ¿No tenés cuenta?
                    </p>
                    <Button
                        label="Registrarse"
                        className="p-button-text p-button-lg"
                        onClick={handleRegisterRedirect}
                    />
                </div>
            </Card>
        </div>
    );
}
