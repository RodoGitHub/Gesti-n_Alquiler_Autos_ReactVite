import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useToast } from "../../contexts/ToastContext";

export default function LoginForm() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validationSchema = Yup.object({
    correo: Yup.string().email("Correo inválido").required("Correo requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const { correo, password } = values;
    const { ok, message } = await signIn({ correo, password }); // 👈 CAMBIO CLAVE
    if (ok) {
      showToast({ severity: "success", summary: "Éxito", detail: message, life: 2000 });
      navigate("/");
    } else {
      setFieldError("password", message || "Usuario o contraseña incorrectos");
      showToast({ severity: "error", summary: "Error", detail: message, life: 3000 });
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-hero">
      <div className="auth-hero-left">
        <h1>Gestión de autos</h1>
        <h2>Bienvenido de nuevo</h2>
        <p>Ingresá tus credenciales</p>
      </div>
      <div className="auth-hero-right">
        <Card className="auth-card no-hover">
          <h2 style={{ marginTop: 0 }}>Iniciar sesión</h2>
          <Formik
            initialValues={{ correo: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="p-field">
                  <label htmlFor="correo">Correo</label>
                  <Field name="correo">
                    {({ field }) => (
                      <InputText
                        id="correo"
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
                  <label htmlFor="password">Contraseña</label>
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
                  label="Entrar"
                  className="p-button-primary"
                  loading={isSubmitting}
                  icon="pi pi-sign-in"
                />

                <div style={{ textAlign: "center" }}>
                  <span>¿No tenés cuenta? </span>
                  <Button
                    type="button"
                    label="¡Presioná aquí!"
                    className="p-button-text"
                    onClick={() => navigate("/user/register")}
                  />
                </div>

                <div style={{ textAlign: "center" }}>
                  <Button
                    type="button"
                    label="Sobre nosotros"
                    className="p-button-text p-button-sm"
                    onClick={() => navigate("/about")}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
}
