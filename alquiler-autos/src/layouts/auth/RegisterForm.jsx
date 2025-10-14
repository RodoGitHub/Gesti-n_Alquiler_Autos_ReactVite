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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.current.show({
                severity: "warn",
                summary: "Advertencia",
                detail: "Las contraseñas no coinciden",
                life: 2000,
            });
            return;
        }

        try {
            await registerService.create({
                nombre: form.name,
                correo: form.email,
                password: form.password,
            });

            toast.current.show({
                severity: "success",
                summary: "Éxito",
                detail: "Registro exitoso, ahora inicia sesión.",
                life: 2500,
            });

            navigate("/login");
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message || "No se pudo conectar con el servidor",
                life: 3000,
            });
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <Toast ref={toast} />

            <div className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-6" style={{ backgroundColor: "#1F2937", color: "white" }}>
                <h1 className="text-6xl font-bold mb-3">AutoGo!</h1>
                <h2 className="text-2xl mb-4" style={{ color: "#BFDBFE" }}>Tu viaje comienza aquí</h2>
                <p className="text-lg text-center" style={{ color: "#D1D5DB", maxWidth: "20rem" }}>Alquiler de autos fácil, rápido y seguro.</p>
            </div>

            <div className="flex align-items-center justify-center flex-1 bg-gray-100 p-6">
                <Card className="w-full max-w-25rem p-5 shadow-3 border-round-xl">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-semibold">Crear Cuenta</h2>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-column gap-3">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="name" className="font-medium">Nombre completo</label>
                            <InputText id="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="email" className="font-medium">Email</label>
                            <InputText id="email" type="email" value={form.email} onChange={handleChange} placeholder="ejemplo@correo.com" required />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="password" className="font-medium">Contraseña</label>
                            <Password id="password" value={form.password} onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} toggleMask feedback={false} placeholder="Contraseña" required className="w-full" />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="confirmPassword" className="font-medium">Confirmar contraseña</label>
                            <Password id="confirmPassword" value={form.confirmPassword} onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))} toggleMask feedback={false} placeholder="Repite tu contraseña" required className="w-full" />
                        </div>

                        <Button type="submit" label="Registrarse" icon="pi pi-user-plus" className="w-full p-button-rounded font-bold" style={{ backgroundColor: "#FF6B35", border: "none" }} />
                    </form>

                    <Divider />
                    <div className="text-center">
                        <p>¿Ya tienes cuenta?</p>
                        <Button label="Iniciar Sesión" className="p-button-text" onClick={() => navigate("/login")} />
                    </div>
                </Card>
            </div>
        </div>
    );
}
