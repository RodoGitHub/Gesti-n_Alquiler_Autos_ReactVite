import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import "primeflex/primeflex.css";

export default function LoginForm({ setLoading, toast }) {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const validationSchema = Yup.object({
        correo: Yup.string().email("Ingrese un correo válido").required("El correo es obligatorio"),
        password: Yup.string().required("La contraseña es obligatoria"),
    });

    const formik = useFormik({
        initialValues: { correo: "", password: "" },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await signIn({ correo: values.correo.trim(), password: values.password });
                toast?.current.show({
                    severity: "success",
                    summary: "¡Excelente!",
                    detail: "Iniciaste correctamente",
                    life: 4000,
                });
                navigate("/", { replace: true });
            } catch (error) {
                const msg = error?.response?.data?.message || "Credenciales incorrectas o error de conexión";
                toast?.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: msg,
                    life: 4000,
                });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="flex flex-column md:flex-row h-screen w-screen" style={{ backgroundColor: "#ffffff" }}>
            <div className="hidden md:flex md:flex-1 flex-column justify-content-center align-items-center p-6" style={{ backgroundColor: "#dbeeff", color: "#1f3d5a" }}>
                <h1 style={{ fontSize: "4rem", fontWeight: "bold", color: "#1f3d5a" }}>AutoGo!</h1>
                <h2 style={{ fontSize: "1.8rem", color: "##1f3d5a" }}>Bienvenido nuevamente</h2>
                <p style={{ color: "#1f3d5a", maxWidth: "320px", textAlign: "center" }}>
                    Gestioná tus reservas de forma fácil y rápida.
                </p>
            </div>

            <div className="flex align-items-center justify-content-center flex-1 p-6" style={{ backgroundColor: "#ffffff" }}>
                <Card title="Iniciar Sesión" className="w-full p-5 shadow-1 border-round-2xl" style={{ maxWidth: "25rem", borderRadius: "1.5rem", backgroundColor: "#ffffff" }}>
                    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
                        <div>
                            <label htmlFor="correo" className="font-medium mb-1 block" style={{ color: "#1f3d3d" }}>
                                Correo electrónico
                            </label>
                            <InputText
                                id="correo"
                                type="email"
                                value={formik.values.correo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="ejemplo@correo.com"
                                className={`w-full ${formik.touched.correo && formik.errors.correo ? "p-invalid" : ""}`}
                                style={{ backgroundColor: "#eff7ff", borderRadius: "10px" }}
                            />
                            {formik.touched.correo && formik.errors.correo && (
                                <small className="p-error">{formik.errors.correo}</small>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="font-medium mb-1 block" style={{ color: "#1f3d3d" }}>
                                Contraseña
                            </label>
                            <Password
                                id="password"
                                value={formik.values.password}
                                onChange={(e) => formik.setFieldValue("password", e.target.value)}
                                onBlur={formik.handleBlur}
                                toggleMask
                                feedback={false}
                                placeholder="********"
                                className={`w-full ${formik.touched.password && formik.errors.password ? "p-invalid" : ""}`}
                                inputStyle={{ backgroundColor: "#eff7ff", borderRadius: "10px" }}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <small className="p-error">{formik.errors.password}</small>
                            )}
                        </div>

                        <Button
                            type="submit"
                            label="Ingresar"
                            icon="pi pi-sign-in"
                            className="w-full p-button-rounded font-bold"
                            style={{ backgroundColor: "#FF6B35", border: "none", color: "#ffffff" }}
                            loading={formik.isSubmitting}
                        />
                    </form>

                    <Divider />

                    <div className="text-center">
                        <p className="mb-2" style={{ color: "#1f3d5a" }}>
                            ¿No tienes cuenta?
                        </p>
                        <Button
                            label="Registrarse"
                            className="p-button-text font-bold"
                            style={{ color: "#FF6B35" }}
                            onClick={() => navigate("/register")}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
