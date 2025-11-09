import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useToast } from "../../contexts/ToastContext";
import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import { AUTH_TYPE } from "../../constants/authType";

export default function UserRegisterForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const { showToast } = useToast();
    const { user, status } = useContext(AuthContext);
    const { roles, registerUser, editUser, getUserById } = useContext(UserContext);

    const isAdmin = user?.rol === "admin";

    const [initialValues, setInitialValues] = useState({
        nombre: "",
        correo: "",
        password: "",
        confirmPassword: "",
        rol: ""
    });

    const createSchema = Yup.object({
        nombre: Yup.string().required("Nombre requerido"),
        correo: Yup.string().email("Correo inválido").required("Correo requerido"),
        password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
            .required("Confirmación requerida"),
        ...(isAdmin ? { rol: Yup.string().required("Rol requerido") } : {})
    });

    const editSchema = Yup.object({
        nombre: Yup.string().required("Nombre requerido"),
        correo: Yup.string().email("Correo inválido").required("Correo requerido"),
        ...(isAdmin ? { rol: Yup.string().required("Rol requerido") } : {})
    });

    const validationSchema = isEdit ? editSchema : createSchema;

    useEffect(() => {
        const run = async () => {
            if (!isEdit || !id) return;
            const res = await getUserById(Number(id));
            const data = res?.data ?? res;
            if (data) {
                setInitialValues({
                    nombre: data.nombre || "",
                    correo: data.correo || data.email || "",
                    password: "",
                    confirmPassword: "",
                    rol: data.rol || ""
                });
            }
        };
        run();
    }, [id, isEdit, getUserById]);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            if (isEdit) {
                const payload = {
                    nombre: values.nombre.trim(),
                    correo: values.correo.trim(),
                    ...(values.password ? { password: values.password } : {}),
                    ...(isAdmin && values.rol ? { rol: values.rol } : {})
                };

                const { ok, message } = await editUser(Number(id), payload);
                if (ok) {
                    showToast({ severity: "success", summary: "Actualizado", detail: message, life: 1800 });
                    navigate("/user/list", { replace: true });
                } else {
                    showToast({ severity: "error", summary: "Error", detail: message, life: 2800 });
                    setFieldError("correo", message || "Error al actualizar");
                }
                return;
            }

            const payload = {
                nombre: values.nombre.trim(),
                correo: values.correo.trim(),
                password: values.password,
                ...(isAdmin ? (values.rol ? { rol: values.rol } : {}) : { rol: "empleado" })
            };

            const { ok, message } = await registerUser(payload);
            if (ok) {
                showToast({ severity: "success", summary: "Registrado", detail: message, life: 1800 });
                navigate("/", { replace: true });
            } else {
                showToast({ severity: "error", summary: "Error", detail: message, life: 2800 });
                setFieldError("correo", message || "Error en el registro");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (status === AUTH_TYPE.UNAUTH) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
                <Card style={{ width: 380, textAlign: "center" }}>
                    <h3 style={{ marginTop: 0, marginBottom: 8 }}>No autorizado</h3>
                    <p style={{ marginTop: 0 }}>Debes iniciar sesión para acceder a esta página.</p>
                    <Button
                        label="Ir al login"
                        icon="pi pi-sign-in"
                        onClick={() => navigate("/login")}
                        className="p-button-primary"
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Card style={{ width: 760, maxWidth: "95vw" }}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>
                    {isEdit ? "Editar usuario" : "Registro de usuario"}
                </h2>
                <p style={{ marginTop: 0, color: "#666" }}>
                    {isEdit ? "Actualizá los datos del usuario" : "Completá los datos para crear la cuenta"}
                </p>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, touched, errors, setFieldValue, values }) => (
                        <Form className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div className="p-field">
                                <label htmlFor="nombre">Nombre *</label>
                                <Field name="nombre">
                                    {({ field }) => (
                                        <InputText
                                            id="nombre"
                                            {...field}
                                            placeholder="Juan"
                                            className={touched.nombre && errors.nombre ? "p-invalid" : ""}
                                        />
                                    )}
                                </Field>
                                <small className="p-error"><ErrorMessage name="nombre" /></small>
                            </div>

                            <div className="p-field">
                                <label htmlFor="correo">Correo *</label>
                                <Field name="correo">
                                    {({ field }) => (
                                        <InputText
                                            id="correo"
                                            {...field}
                                            type="email"
                                            placeholder="correo@dominio.com"
                                            className={touched.correo && errors.correo ? "p-invalid" : ""}
                                        />
                                    )}
                                </Field>
                                <small className="p-error"><ErrorMessage name="correo" /></small>
                            </div>

                            {isAdmin && (
                                <div className="p-field">
                                    <label htmlFor="rol">Rol {isEdit ? "*" : ""}</label>
                                    <Dropdown
                                        id="rol"
                                        value={values.rol}
                                        onChange={(e) => setFieldValue("rol", e.value)}
                                        options={roles || []}      // [{ nombre: "admin" }, { nombre: "empleado" }]
                                        optionLabel="nombre"
                                        optionValue="nombre"
                                        placeholder="-- Elegir rol --"
                                        className={touched.rol && errors.rol ? "p-invalid" : ""}
                                    />
                                    <small className="p-error"><ErrorMessage name="rol" /></small>
                                </div>
                            )}

                            {!isEdit && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    <div className="p-field">
                                        <label htmlFor="password">Contraseña *</label>
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
                                        <small className="p-error"><ErrorMessage name="password" /></small>
                                    </div>

                                    <div className="p-field">
                                        <label htmlFor="confirmPassword">Confirmar *</label>
                                        <Field name="confirmPassword">
                                            {({ field }) => (
                                                <Password
                                                    id="confirmPassword"
                                                    {...field}
                                                    feedback={false}
                                                    toggleMask
                                                    placeholder="••••••"
                                                    inputClassName={
                                                        touched.confirmPassword && errors.confirmPassword ? "p-invalid" : ""
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <small className="p-error"><ErrorMessage name="confirmPassword" /></small>
                                    </div>
                                </div>
                            )}

                            {isEdit && (
                                <div className="p-field">
                                    <label htmlFor="password">Nueva contraseña (opcional)</label>
                                    <Field name="password">
                                        {({ field }) => (
                                            <Password
                                                id="password"
                                                {...field}
                                                feedback={false}
                                                toggleMask
                                                placeholder="Dejar vacío para mantener la actual"
                                                inputClassName={touched.password && errors.password ? "p-invalid" : ""}
                                            />
                                        )}
                                    </Field>
                                </div>
                            )}

                            <Button
                                type="submit"
                                label={isEdit ? "Actualizar" : "Registrarme"}
                                icon={isEdit ? "pi pi-check" : "pi pi-user-plus"}
                                className="p-button-primary"
                                loading={isSubmitting}
                                style={{ marginTop: 6 }}
                            />

                            <Button
                                type="button"
                                label="Volver"
                                icon="pi pi-arrow-left"
                                className="p-button-text"
                                onClick={() => navigate(-1)}
                                style={{ marginTop: 2 }}
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}
