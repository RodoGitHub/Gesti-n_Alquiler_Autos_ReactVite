import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams();

  const { user } = useContext(AuthContext);
  const { roles, registerUser, editUser, getUserById } = useContext(UserContext);

  const isAdmin = user?.rol === "admin";
  const isEdit = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
    rol: ""
  });

  const validationSchema = useMemo(() => {
    console.log("[VALIDATION] Schema recreado - solo debería pasar cuando cambia isEdit o isAdmin");
    return Yup.object({
      nombre: Yup.string().required("Nombre requerido"),
      correo: Yup.string().email("Correo inválido").required("Correo requerido"),
      password: isEdit 
        ? Yup.string().min(6, "Mínimo 6 caracteres")
        : Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
      confirmPassword: isEdit
        ? Yup.string().oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        : Yup.string()
            .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
            .required("Confirmación requerida"),
      rol: isAdmin 
        ? Yup.string().required("Rol requerido")
        : Yup.string()
    });
  }, [isEdit, isAdmin]);

  const loadUserData = useCallback(async () => {
    if (!isEdit || !id) return;
    
    console.log("[API] Cargando datos del usuario - solo debería ejecutarse una vez al montar en modo edición");
    const userData = await getUserById(Number(id));
    if (userData) {
      setInitialValues({
        nombre: userData.nombre || "",
        correo: userData.correo || userData.email || "",
        password: "",
        confirmPassword: "",
        rol: userData.rol || ""
      });
    }
  }, [id, isEdit, getUserById]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const roleOptions = useMemo(() => {
    const rolesCount = roles?.length || 0;
    console.log(`[OPTIONS] RoleOptions recalculado - ${rolesCount} roles`, {
      rolesLength: rolesCount,
      isInitialLoad: rolesCount === 0,
      note: rolesCount === 0 
        ? "Roles aún no cargados (normal al montar el componente)"
        : "Roles cargados correctamente. En desarrollo verás 2 logs por StrictMode"
    });
    return (roles || []).map((r) => ({ label: r?.nombre ?? r, value: r?.nombre ?? r }));
  }, [roles]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const payload = {
      nombre: values.nombre,
      correo: values.correo,
      ...(values.password && { password: values.password }),
      rol: isAdmin && values.rol ? values.rol : undefined,
    };

    let result;
    if (isEdit) {
      result = await editUser(Number(id), payload);
    } else {
      result = await registerUser(payload);
    }

    const { ok, message } = result;
    if (ok) {
      showToast({ 
        severity: "success", 
        summary: isEdit ? "Actualizado" : "Registrado", 
        detail: message, 
        life: 2000 
      });
      navigate(isEdit ? "/usuarios" : "/");
    } else {
      showToast({ severity: "error", summary: "Error", detail: message, life: 3000 });
      setFieldError("correo", message || (isEdit ? "Error al actualizar" : "Error en el registro"));
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-hero">
      <div className="auth-hero-left">
        <h1>Gestion de autos</h1>
        <h2>{isEdit ? "Editar usuario" : "Crear una cuenta"}</h2>
        <p>{isEdit ? "Modifica los datos del usuario" : "Completa el formulario para registrarte"}</p>
      </div>
      <div className="auth-hero-right">
        <Card className="auth-card no-hover" pt={{
          root: { style: { padding: "1rem", maxHeight: "calc(100vh - 4rem)" } },
          body: { style: { overflow: "hidden" } }
        }}>
          <h2>{isEdit ? "Editar Usuario" : "Registro"}</h2>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form className="p-fluid" pt={{ root: { style: { display: "flex", flexDirection: "column", gap: "0.4rem" } } }}>
                <div className="p-field">
                  <label htmlFor="nombre">Nombre</label>
                  <Field name="nombre">
                    {({ field }) => (
                      <InputText 
                        id="nombre" 
                        {...field} 
                        placeholder="Tu nombre" 
                        className={touched.nombre && errors.nombre ? "p-invalid" : ""}
                        pt={{ root: { style: { padding: "0.6rem" } } }}
                      />
                    )}
                  </Field>
                  <small className="p-error"><ErrorMessage name="nombre" /></small>
                </div>

                <div className="p-field">
                  <label htmlFor="correo">Correo</label>
                  <Field name="correo">
                    {({ field }) => (
                      <InputText 
                        id="correo" 
                        {...field} 
                        placeholder="correo@dominio.com" 
                        className={touched.correo && errors.correo ? "p-invalid" : ""}
                        pt={{ root: { style: { padding: "0.6rem" } } }}
                      />
                    )}
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
                      options={roleOptions}
                      placeholder="-- Elegir rol --"
                      className={touched.rol && errors.rol ? "p-invalid" : ""}
                      pt={{ root: { style: { padding: "0.6rem" } } }}
                    />
                    <small className="p-error"><ErrorMessage name="rol" /></small>
                  </div>
                )}

                {!isEdit && (
                  <>
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
                            pt={{ input: { style: { padding: "0.6rem" } } }}
                          />
                        )}
                      </Field>
                      <small className="p-error"><ErrorMessage name="password" /></small>
                    </div>

                    <div className="p-field">
                      <label htmlFor="confirmPassword">Confirmar contraseña</label>
                      <Field name="confirmPassword">
                        {({ field }) => (
                          <Password 
                            id="confirmPassword" 
                            {...field} 
                            feedback={false} 
                            toggleMask 
                            placeholder="••••••" 
                            inputClassName={touched.confirmPassword && errors.confirmPassword ? "p-invalid" : ""}
                            pt={{ input: { style: { padding: "0.6rem" } } }}
                          />
                        )}
                      </Field>
                      <small className="p-error"><ErrorMessage name="confirmPassword" /></small>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  label={isEdit ? "Actualizar" : "Registrarme"} 
                  className="p-button-primary" 
                  loading={isSubmitting} 
                  icon={isEdit ? "pi pi-check" : "pi pi-user-plus"}
                  pt={{ root: { style: { marginTop: "0.5rem", padding: "0.6rem" } } }}
                />

                <div className="p-field">
                  <Button 
                    type="button" 
                    label="Atrás" 
                    icon="pi pi-arrow-left" 
                    className="p-button-text p-button-sm" 
                    onClick={() => navigate(-1)}
                    pt={{ root: { style: { padding: "0.4rem 0.8rem", margin: "0 auto", display: "block" } } }}
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
