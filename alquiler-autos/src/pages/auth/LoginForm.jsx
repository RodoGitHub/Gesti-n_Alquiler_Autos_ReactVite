import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { AuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { AUTH_TYPE } from "../../constants/authType";

export default function Login() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, status, signIn, signOut } = useContext(AuthContext);

    const initialValues = {
        correo: "",
        password: ""
    };

    const validationSchema = Yup.object({
        correo: Yup.string().email("Correo inválido").required("Correo requerido"),
        password: Yup.string().min(5, "Mínimo 5 caracteres").required("Contraseña requerida")
    });

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            const { ok, message } = await signIn(values);
            if (ok) {
                showToast({
                    severity: "success",
                    summary: "Bienvenido",
                    detail: message,
                    life: 1500
                });
                navigate("/", { replace: true });
            } else {
                showToast({
                    severity: "error",
                    summary: "Error",
                    detail: message,
                    life: 2500
                });
                setFieldError("correo", message || "Credenciales inválidas");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (status === AUTH_TYPE.AUTH) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
                <Card style={{ width: 380, maxWidth: "95vw", textAlign: "center" }}>
                    <h2 style={{ marginBottom: 8 }}>Sesión iniciada</h2>
                    <p style={{ marginTop: 0, color: "#666" }}>
                        Ya estás logueado como <strong>{user?.nombre || user?.correo || "usuario"}</strong>.
                    </p>
                    <Button
                        label="Cerrar sesión"
                        icon="pi pi-sign-out"
                        className="p-button-danger"
                        onClick={async () => {
                            await signOut();
                            showToast({
                                severity: "info",
                                summary: "Sesión cerrada",
                                detail: "Has cerrado sesión correctamente.",
                                life: 2000
                            });
                            navigate("/auth/login", { replace: true });
                        }}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Card style={{ width: 500, maxWidth: "100vw"}}>
                <h2 style={{ marginTop: 0, marginRight: 0, marginBottom: 8, marginLeft: 0 }}>
                    Iniciar sesión
                </h2>
                <p style={{ marginTop: 0, color: "#666" }}>Ingresá tus credenciales</p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, touched, errors }) => (
                        <Form className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div className="p-field">
                                <label htmlFor="correo" style={{ fontSize: "0.9rem", marginBottom: 4 }}>
                                    Correo
                                </label>
                                <Field name="correo">
                                    {({ field }) => (
                                        <InputText
                                            id="correo"
                                            type="email"
                                            {...field}
                                            placeholder="correo@dominio.com"
                                            className={touched.correo && errors.correo ? "p-invalid" : ""}
                                        />
                                    )}
                                </Field>
                                <small className="p-error">
                                    <ErrorMessage name="correo" />
                                </small>
                            </div>

                            <div className="p-field">
                                <label htmlFor="password" style={{ fontSize: "0.9rem", marginBottom: 4 }}>
                                    Contraseña
                                </label>
                                <Field name="password">
                                    {({ field }) => (
                                        <Password
                                            id="password"
                                            {...field}
                                            feedback={false}
                                            toggleMask
                                            placeholder="••••••"
                                            inputClassName={touched.password && errors.password ? "p-invalid" : ""}
                                        />
                                    )}
                                </Field>
                                <small className="p-error">
                                    <ErrorMessage name="password" />
                                </small>
                            </div>

                            <Button
                                type="submit"
                                label="Ingresar"
                                icon="pi pi-sign-in"
                                className="p-button-primary"
                                loading={isSubmitting}
                                style={{ marginTop: 4 }}
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}
