import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useToast } from "../../contexts/ToastContext";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { user } = useContext(AuthContext);
  const { roles, registerUser } = useContext(UserContext);

  const isAdmin = user?.rol === "admin";

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Nombre requerido"),
    correo: Yup.string().email("Correo inválido").required("Correo requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("Confirmación requerida"),
    rol: Yup.string().when([], (schema) => (isAdmin ? schema.required("Rol requerido") : schema))
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const payload = {
      nombre: values.nombre,
      correo: values.correo,
      password: values.password,
      rol: isAdmin && values.rol ? values.rol : undefined,
    };

    const { ok, message } = await registerUser(payload);
    if (ok) {
      showToast({ severity: "success", summary: "Registrado", detail: message, life: 2000 });
      navigate("/");
    } else {
      showToast({ severity: "error", summary: "Error", detail: message, life: 3000 });
      setFieldError("correo", message || "Error en el registro");
      navigate("/auth/login");
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-hero">
      <div className="auth-hero-left">
        <h1>Gestion de autos</h1>
        <h2>Crear una cuenta</h2>
        <p>Completa el formulario para registrarte</p>
      </div>
      <div className="auth-hero-right">
        <Card className="auth-card no-hover">
          <h2 style={{ marginTop: 0 }}>Registro</h2>
          <Formik
            initialValues={{ nombre: "", correo: "", password: "", confirmPassword: "", rol: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="p-field">
                  <label htmlFor="nombre">Nombre</label>
                  <Field name="nombre">
                    {({ field }) => <InputText id="nombre" {...field} placeholder="Tu nombre" className={touched.nombre && errors.nombre ? "p-invalid" : ""} />}
                  </Field>
                  <small className="p-error"><ErrorMessage name="nombre" /></small>
                </div>

                <div className="p-field">
                  <label htmlFor="correo">Correo</label>
                  <Field name="correo">
                    {({ field }) => <InputText id="correo" {...field} placeholder="correo@dominio.com" className={touched.correo && errors.correo ? "p-invalid" : ""} />}
                  </Field>
                  <small className="p-error"><ErrorMessage name="correo" /></small>
                </div>

                {isAdmin && (
                  <div className="p-field">
                    <label htmlFor="rol">Rol</label>
                    <Dropdown
                      id="rol"
                      value={values.rol}
                      onChange={(e) => setFieldValue("rol", e.value)}
                      options={(roles || []).map((r) => ({ label: r?.nombre ?? r, value: r?.nombre ?? r }))}
                      placeholder="-- Elegir rol --"
                      className={touched.rol && errors.rol ? "p-invalid" : ""}
                    />
                    <small className="p-error"><ErrorMessage name="rol" /></small>
                  </div>
                )}

                <div className="p-field">
                  <label htmlFor="password">Contraseña</label>
                  <Field name="password">
                    {({ field }) => (
                      <Password id="password" {...field} feedback={false} toggleMask placeholder="••••••" inputClassName={touched.password && errors.password ? "p-invalid" : ""} />
                    )}
                  </Field>
                  <small className="p-error"><ErrorMessage name="password" /></small>
                </div>

                <div className="p-field">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <Password id="confirmPassword" {...field} feedback={false} toggleMask placeholder="••••••" inputClassName={touched.confirmPassword && errors.confirmPassword ? "p-invalid" : ""} />
                    )}
                  </Field>
                  <small className="p-error"><ErrorMessage name="confirmPassword" /></small>
                </div>

                <Button type="submit" label="Registrarme" className="p-button-primary" loading={isSubmitting} icon="pi pi-user-plus" />

                <div style={{ textAlign: "center" }}>
                  <Button type="button" label="Atrás" icon="pi pi-arrow-left" className="p-button-text p-button-sm" onClick={() => navigate(-1)} />
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
}
