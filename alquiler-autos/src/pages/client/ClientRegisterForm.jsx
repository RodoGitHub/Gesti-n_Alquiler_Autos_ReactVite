import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { ClientContext } from "../../contexts/ClientContext";

export default function ClientForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id) && id !== "new";

    const toast = useRef(null);
    const { getClientById, registerClient, editClient } = useContext(ClientContext);

    const [initialValues, setInitialValues] = useState({
        nombre: "",
        apellido: "",
        documento: "",
        correo: "",
        telefono: "",
        is_active: true
    });

    const validationSchema = Yup.object({
        nombre: Yup.string().required("Nombre requerido"),
        apellido: Yup.string().required("Apellido requerido"),
        documento: Yup.string().required("Documento requerido"),
        correo: Yup.string().email("Correo inválido").required("Correo requerido"),
        telefono: Yup.string().nullable(),
        is_active: Yup.boolean().required()
    });

    useEffect(() => {
        const run = async () => {
            if (!isEdit) return;
            const { ok, data, message } = await getClientById(Number(id));
            if (!ok || !data) {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: message || "No se pudo cargar el cliente."
                });
                return;
            }
            setInitialValues({
                nombre: data?.nombre || "",
                apellido: data?.apellido || "",
                documento: data?.documento || "",
                correo: data?.correo || "",
                telefono: data?.telefono || "",
                is_active: data?.is_active !== false
            });
        };
        run();
    }, [id, isEdit, getClientById]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (isEdit) {
                const { ok, message } = await editClient(Number(id), values);
                toast.current?.show({
                    severity: ok ? "success" : "error",
                    summary: ok ? "Actualizado" : "Error",
                    detail: message || (ok ? "Cliente actualizado." : "No se pudo actualizar.")
                });
                if (ok) navigate("/client/list", { replace: true });
                return;
            }

            const { ok, message } = await registerClient(values);
            toast.current?.show({
                severity: ok ? "success" : "error",
                summary: ok ? "Registrado" : "Error",
                detail: message || (ok ? "Cliente registrado." : "No se pudo registrar.")
            });
            if (ok) navigate("/client/list", { replace: true });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Toast ref={toast} />
            <Card style={{ width: 760, maxWidth: "95vw" }}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>
                    {isEdit ? "Editar cliente" : "Registro de cliente"}
                </h2>
                <p style={{ marginTop: 0, color: "#666" }}>
                    {isEdit ? "Actualizá los datos del cliente" : "Completá los datos para crear el cliente"}
                </p>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, touched, errors, values, setFieldValue }) => (
                        <Form className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
                                    <label htmlFor="apellido">Apellido *</label>
                                    <Field name="apellido">
                                        {({ field }) => (
                                            <InputText
                                                id="apellido"
                                                {...field}
                                                placeholder="Pérez"
                                                className={touched.apellido && errors.apellido ? "p-invalid" : ""}
                                            />
                                        )}
                                    </Field>
                                    <small className="p-error"><ErrorMessage name="apellido" /></small>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div className="p-field">
                                    <label htmlFor="documento">Documento *</label>
                                    <Field name="documento">
                                        {({ field }) => (
                                            <InputText
                                                id="documento"
                                                {...field}
                                                placeholder="DNI / CI"
                                                className={touched.documento && errors.documento ? "p-invalid" : ""}
                                            />
                                        )}
                                    </Field>
                                    <small className="p-error"><ErrorMessage name="documento" /></small>
                                </div>

                                <div className="p-field">
                                    <label htmlFor="correo">Correo *</label>
                                    <Field name="correo">
                                        {({ field }) => (
                                            <InputText
                                                id="correo"
                                                {...field}
                                                type="email"
                                                placeholder="cliente@dominio.com"
                                                className={touched.correo && errors.correo ? "p-invalid" : ""}
                                            />
                                        )}
                                    </Field>
                                    <small className="p-error"><ErrorMessage name="correo" /></small>
                                </div>
                            </div>

                            <div className="p-field">
                                <label htmlFor="telefono">Teléfono</label>
                                <Field name="telefono">
                                    {({ field }) => (
                                        <InputText
                                            id="telefono"
                                            {...field}
                                            placeholder="+54 9 351 123 4567"
                                            className={touched.telefono && errors.telefono ? "p-invalid" : ""}
                                        />
                                    )}
                                </Field>
                                <small className="p-error"><ErrorMessage name="telefono" /></small>
                            </div>

                            <Button
                                type="submit"
                                label={isEdit ? "Actualizar" : "Registrar"}
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
