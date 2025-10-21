import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { resource } from "../../services/api";
import "primeflex/primeflex.css";

const registerService = resource("register", "Autenticación");

export default function RegisterForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toast = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.current.show({ severity: "warn", summary: "Advertencia", detail: "Las contraseñas no coinciden", life: 2000 });
            return;
        }

        if (form.password.length < 8) {
            toast.current.show({ severity: "warn", summary: "Advertencia", detail: "La contraseña debe tener al menos 8 caracteres", life: 2500 });
            return;
        }

        setLoading(true);

        try {
            await registerService.create({ nombre: form.name, correo: form.email.trim(), password: form.password });

            toast.current.show({ severity: "success", summary: "Éxito", detail: "Registro exitoso, ahora inicia sesión.", life: 2500 });
            navigate("/login", { replace: true });
        } catch (error) {
            const msg = error?.message || "No se pudo conectar con el servidor";
            toast.current.show({ severity: "error", summary: "Error", detail: msg, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="flex flex-col md:flex-row h-screen w-screen">
            <Toast ref={toast} />

            <div className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-4 md:p-6" style={{ backgroundColor: '#1F2937', color: 'white' }}>
                <h1 className="text-4xl md:text-6xl font-bold mb-2 md:mb-3">AutoGo!</h1>
                <h2 className="text-lg md:text-2xl mb-3 md:mb-4" style={{ color: '#BFDBFE' }}>Crea tu cuenta</h2>
                <p className="text-sm md:text-lg text-gray-300 text-center">Gestioná tus reservas de forma fácil y rápida.</p>
            </div>

            <div className="flex align-items-center justify-content-center flex-1 bg-gray-100 p-6">
                <Card 
                    title="Crear Cuenta" 
                    className="w-full" 
                    style={{ maxWidth: '25rem', minWidth: '300px', padding: '2rem' }}
                >
                    <form onSubmit={handleRegister} className="flex flex-column gap-3">
                        <div className="p-field">
                            <label htmlFor="name" className="font-medium text-sm mb-1 block">Nombre completo</label>
                            <InputText id="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required className="w-full" />
                        </div>

                        <div className="p-field">
                            <label htmlFor="email" className="font-medium text-sm mb-1 block">Correo electrónico</label>
                            <InputText id="email" type="email" value={form.email} onChange={handleChange} placeholder="ejemplo@correo.com" required className="w-full" />
                        </div>

                        <div className="flex flex-column gap-1">
                            <div className="p-field">
                                <label htmlFor="password" className="font-medium text-sm mb-1 block">Contraseña</label>
                                <Password 
                                    id="password" 
                                    value={form.password} 
                                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} 
                                    toggleMask 
                                    feedback={false} 
                                    placeholder="********" 
                                    required 
                                    className="w-full" 
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="confirmPassword" className="font-medium text-sm mb-1 block">Confirmar</label>
                                <Password 
                                    id="confirmPassword" 
                                    value={form.confirmPassword} 
                                    onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))} 
                                    toggleMask 
                                    feedback={false} 
                                    placeholder="********" 
                                    required 
                                    className="w-full" 
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label="Registrarse"
                            icon="pi pi-user-plus"
                            className="w-full p-button-rounded font-bold text-sm"
                            style={{ backgroundColor: "#FF6B35", border: "none", padding: '0.6rem 1rem' }}
                            loading={loading}
                            disabled={loading}
                        />
                    </form>

                    <Divider className="hidden md:block my-4" />

                    <div className="text-center mt-1 md:mt-0">
                        <p className="mb-2">¿Ya tienes cuenta?</p>
                        <Button
                            label="Iniciar Sesión"
                            className="p-button-text text-primary font-bold"
                            onClick={() => navigate("/login")}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
