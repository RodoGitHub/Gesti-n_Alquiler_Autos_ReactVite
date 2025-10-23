import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resource } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "primeflex/primeflex.css";

const registerService = resource("register", "Autenticación");

export default function RegisterForm() {
    const toast = useRef(null);
    const navigate = useNavigate();
    const { signIn } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: { name: "", email: "", password: "", confirmPassword: "" },
        validationSchema: Yup.object({
            name: Yup.string().required("El nombre es obligatorio"),
            email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
            password: Yup.string().min(8, "La contraseña debe tener al menos 8 caracteres").required("La contraseña es obligatoria"),
            confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas no coinciden").required("Confirmar la contraseña es obligatorio"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await registerService.create({
                    nombre: values.name,
                    correo: values.email.trim(),
                    password: values.password,
                });

                await signIn({ correo: values.email.trim(), password: values.password });

                toast.current.show({ severity: "success", summary: "Éxito", detail: "Registro e inicio de sesión exitosos", life: 2500 });
                navigate("/", { replace: true });
            } catch (error) {
                toast.current.show({ severity: "error", summary: "Error", detail: error?.message || "No se pudo conectar con el servidor", life: 3000 });
            } finally { setSubmitting(false); }
        },
    });

    const inputStyle = { backgroundColor: "#eff7ff", borderRadius: "8px", height: "2rem", fontSize: "0.9rem" };
    const labelStyle = { color: "#1f3d3d", fontSize: "0.85rem", marginBottom: "0.2rem" };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen" style={{ backgroundColor: "#ffffff" }}>
            <Toast ref={toast} />

            <div className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-4" style={{ backgroundColor: "#dbeeff", color: "#1f3d5a" }}>
                <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>AutoGo!</h1>
                <h2 style={{ fontSize: "1.4rem" }}>Crea tu cuenta</h2>
                <p style={{ maxWidth: "280px", textAlign: "center", fontSize: "0.85rem" }}>Gestioná tus reservas de forma fácil y rápida.</p>
            </div>

            <div className="flex align-items-center justify-content-center flex-1 p-2">
                <Card
                    title="Crear Cuenta"
                    className="w-full"
                    style={{ maxWidth: "20rem", borderRadius: "1.2rem", backgroundColor: "#ffffff", padding: "1rem" }}
                >
                    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                        {["name","email","password","confirmPassword"].map((field) => (
                            <div key={field}>
                                <label htmlFor={field} style={labelStyle}>
                                    {field === "name" ? "Nombre completo" : field === "email" ? "Correo electrónico" : field === "password" ? "Contraseña" : "Confirmar contraseña"}
                                </label>
                                {field === "password" || field === "confirmPassword" ? (
                                    <Password
                                        id={field} 
                                        name={field} 
                                        value={formik.values[field]}
                                        onChange={formik.handleChange} 
                                        onBlur={formik.handleBlur}
                                        toggleMask
                                        feedback={false} 
                                        placeholder="********"
                                        className={`w-full ${formik.touched[field] && formik.errors[field] ? "p-invalid" : ""}`}
                                        inputStyle={inputStyle}
                                    />
                                ) : (
                                    <InputText
                                        id={field} 
                                        name={field} 
                                        type={field==="email"?"email":"text"}
                                        value={formik.values[field]} 
                                        onChange={formik.handleChange} 
                                        onBlur={formik.handleBlur}
                                        placeholder={field==="name"?"Tu nombre":"ejemplo@correo.com"}
                                        className={`w-full ${formik.touched[field] && formik.errors[field] ? "p-invalid" : ""}`}
                                        style={inputStyle}
                                    />
                                )}
                                {formik.touched[field] && formik.errors[field] && <small className="p-error" style={{ fontSize: "0.75rem" }}>{formik.errors[field]}</small>}
                            </div>
                        ))}

                        <Button
                            type="submit" label="Registrarse" icon="pi pi-user-plus"
                            className="w-full p-button-rounded font-bold"
                            style={{ backgroundColor: "#FF6B35", border: "none", color: "#ffffff", fontSize: "0.9rem", height: "2.5rem" }}
                            loading={formik.isSubmitting} disabled={formik.isSubmitting}
                        />
                    </form>

                    <Divider style={{ margin: "0.5rem 0" }} />

                    <div className="text-center mt-1">
                        <p style={{ color: "#1f3d3d", fontSize: "0.8rem" }}>¿Ya tienes cuenta?</p>
                        <Button label="Iniciar Sesión" className="p-button-text font-bold" style={{ color: "#FF6B35", fontSize: "0.85rem" }} onClick={() => navigate("/login")} />
                    </div>
                </Card>
            </div>
        </div>
    );
}
