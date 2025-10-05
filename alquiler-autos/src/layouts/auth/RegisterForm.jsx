import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

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
        console.log("Enviando datos:", { name, email, password });
        
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: name, 
                correo: email,  // CAMBIO AQUÍ: email -> correo
                password: password 
            }),
        });

        console.log("Status de respuesta:", response.status);
        console.log("OK?", response.ok);

        const data = await response.json();
        console.log("Datos de respuesta:", data);

        if (response.ok) {
            toast.current.show({
                severity: "success",
                summary: "Éxito",
                detail: "Usuario registrado correctamente!",
                life: 3000,
            });
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } else {
            console.log("Error del servidor:", data);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: data.message || `Error ${response.status}: Error al registrar el usuario`,
                life: 3000,
            });
        }
    } catch (error) {
        console.error("Error completo:", error);
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `Error de conexión: ${error.message}`,
            life: 3000,
        });
    }
};
    const handleLoginRedirect = () => {
        navigate("/login");
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
                title="Registrarse" 
                className="shadow-5 border-round-lg"
                style={{ 
                    width: "100%", 
                    maxWidth: "450px",
                    minHeight: "550px", // Reducido de 600px
                    padding: "2rem"
                }}
            >
                <form onSubmit={handleSubmit} className="flex flex-column gap-2"> 
                    <div className="field">
                        <label htmlFor="name" className="block text-lg font-medium mb-1"> 
                            Nombre
                        </label>
                        <InputText
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre completo"
                            required
                            className="w-full"
                            size="large"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="email" className="block text-lg font-medium mb-1"> 
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
                        <label htmlFor="password" className="block text-lg font-medium mb-1"> 
                            Contraseña
                        </label>
                        <div className="w-full">
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
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="confirmPassword" className="block text-lg font-medium mb-1">
                            Confirmar Contraseña
                        </label>
                        <div className="w-full">
                            <Password
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                toggleMask
                                feedback={false}
                                placeholder="Confirmar contraseña"
                                required
                                className="w-full"
                                inputClassName="w-full"
                                size="large"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        label="Registrarse"
                        icon="pi pi-user-plus"
                        className="p-button-rounded p-button-success w-full mt-2" 
                        size="large"
                    />
                </form>

                <Divider className="my-3" /> 

                <div className="text-center">
                    <p className="text-lg mb-1"> 
                        ¿Ya tenés cuenta?
                    </p>
                    <Button
                        label="Iniciar Sesión"
                        className="p-button-text p-button-lg"
                        onClick={handleLoginRedirect}
                    />
                </div>
            </Card>
        </div>
    );
}
