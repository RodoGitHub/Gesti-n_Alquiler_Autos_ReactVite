import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { RentalContext } from "../../contexts/RentalsContext";
import { ClientContext } from "../../contexts/ClientContext";
import { CarContext } from "../../contexts/CarsContext";
import { AuthContext } from "../../contexts/AuthContext";

import { RENTAL_STATES } from "../../constants/rentalStates";

const canCrud = (rol) => {
    const r = (rol ?? "").toString().trim().toLowerCase();
    return r === "admin" || r === "empleado";
};

export default function RentalForm() {
    const { id } = useParams();
    const isEdit = Boolean(id) && id !== "new";
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const allowed = canCrud(user?.rol);

    const { fetchClients, clients } = useContext(ClientContext);
    const { fetchCars, cars } = useContext(CarContext);
    const { getRentalById, registerRental, editRental } = useContext(RentalContext);

    const toast = useRef(null);

    const [initialValues, setInitialValues] = useState({
        clientId: "",
        carId: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "pendiente",
        metodo_pago: "efectivo",
        total: ""
    });

    const schema = Yup.object({
        clientId: Yup.number().typeError("Seleccioná un cliente").required("Cliente requerido"),
        carId: Yup.number().typeError("Seleccioná un auto").required("Auto requerido"),
        fecha_inicio: Yup.date().typeError("Fecha inválida").required("Inicio requerido"),
        fecha_fin: Yup.date().typeError("Fecha inválida").min(Yup.ref("fecha_inicio"), "Fin debe ser ≥ inicio").required("Fin requerido"),
        estado: Yup.string().oneOf(RENTAL_STATES.map(s => s.value)).required("Estado requerido"),
        metodo_pago: Yup.string().required("Método de pago requerido"),
        total: Yup.number().typeError("Total inválido").min(0, "No puede ser negativo").required("Total requerido")
    });

    useEffect(() => {
        (async () => {
            await Promise.all([fetchClients?.(), fetchCars?.()]);
            if (isEdit) {
                const { ok, data, message } = await getRentalById(Number(id));
                if (!ok || !data) {
                    toast.current?.show({ severity: "error", summary: "Error", detail: message || "No se pudo cargar el alquiler." });
                    return;
                }
                setInitialValues({
                    clientId: data?.clientId ?? data?.Client?.id ?? "",
                    carId: data?.carId ?? data?.Car?.id ?? "",
                    fecha_inicio: data?.fecha_inicio ?? "",
                    fecha_fin: data?.fecha_fin ?? "",
                    estado: data?.estado ?? "pendiente",
                    metodo_pago: data?.metodo_pago ?? "efectivo",
                    total: Number(data?.total ?? 0)
                });
            }
        })();
    }, [id, isEdit]);

    const clientOptions = useMemo(() => {
        return (clients ?? []).map(c => ({
            label: `${c.apellido} ${c.nombre} - DNI:${c.documento}`,
            documento: c.documento ?? "-",
            value: c.id
        }));
    }, [clients]);

    const availableCars = useMemo(() => {
        return (cars ?? []).filter(c => c?.disponible === true);
    }, [cars]);

    const carOptions = useMemo(() => {
        return availableCars.map(c => ({
            label: `${c?.Brand?.nombre ? c.Brand.nombre + " - " : ""}${c.modelo} (${c.anio})`,
            value: c.id,
            price: Number(c?.precio_dia ?? 0)
        }));
    }, [availableCars]);

    const priceByCarId = useMemo(() => {
        const dict = {};
        for (const opt of carOptions) dict[opt.value] = opt.price;
        return dict;
    }, [carOptions]);

    const diffDays = (a, b) => {
        try {
            const d1 = new Date(a);
            const d2 = new Date(b);
            const ms = d2.setHours(12,0,0,0) - d1.setHours(12,0,0,0);
            return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
        } catch {
            return 0;
        }
    };

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            if (!allowed) {
                toast.current?.show({ severity: "error", summary: "Acceso denegado", detail: "No tenés permisos." });
                return;
            }
            const payload = {
                clientId: Number(values.clientId),
                carId: Number(values.carId),
                fecha_inicio: values.fecha_inicio,
                fecha_fin: values.fecha_fin,
                estado: values.estado,
                metodo_pago: values.metodo_pago,
                total: Number(values.total)
            };

            if (isEdit) {
                const { ok, message } = await editRental(Number(id), payload);
                toast.current?.show({
                    severity: ok ? "success" : "error",
                    summary: ok ? "Actualizado" : "Error",
                    detail: message || (ok ? "Alquiler actualizado." : "No se pudo actualizar.")
                });
            } else {
                const { ok, message } = await registerRental(payload);
                toast.current?.show({
                    severity: ok ? "success" : "error",
                    summary: ok ? "Creado" : "Error",
                    detail: message || (ok ? "Alquiler creado." : "No se pudo crear.")
                });
            }
            navigate("/rental/list", { replace: true });
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Error al guardar";
            toast.current?.show({ severity: "error", summary: "Error", detail: msg });
            setFieldError("clientId", msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Toast ref={toast} />
            <Card style={{ width: 820, maxWidth: "95vw" }}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>
                    {isEdit ? "Editar alquiler" : "Nuevo alquiler"}
                </h2>
                <p style={{ marginTop: 0, color: "#666" }}>
                    {isEdit ? "Actualizá los datos del alquiler" : "Completá los datos para registrar un alquiler"}
                </p>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, touched, errors, values, setFieldValue }) => {

                        const carPrice = priceByCarId[values.carId] ?? 0;
                        const days = values.fecha_inicio && values.fecha_fin ? diffDays(values.fecha_inicio, values.fecha_fin) : 0;
                        const computed = Math.max(0, Math.round(days * carPrice));

                        const totalValue = values.total === "" || Number(values.total) === computed
                            ? computed
                            : values.total;

                        useEffect(() => {
                            if (Number(values.total) !== computed) {
                                setFieldValue("total", computed, false);
                            }
                        }, [values.carId, values.fecha_inicio, values.fecha_fin, carPrice]);

                        return (
                            <Form className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div className="p-field">
                                    <label htmlFor="clientId">Cliente *</label>
                                    <Dropdown
                                        id="clientId"
                                        value={values.clientId}
                                        onChange={(e) => setFieldValue("clientId", e.value)}
                                        options={clientOptions}
                                        placeholder="-- Elegir cliente --"
                                        className={touched.clientId && errors.clientId ? "p-invalid" : ""}
                                    />
                                    <small className="p-error"><ErrorMessage name="clientId" /></small>
                                </div>

                                <div className="p-field">
                                    <label htmlFor="carId">Auto *</label>
                                    <Dropdown
                                        id="carId"
                                        value={values.carId}
                                        onChange={(e) => setFieldValue("carId", e.value)}
                                        options={carOptions}
                                        placeholder="-- Elegir auto disponible --"
                                        className={touched.carId && errors.carId ? "p-invalid" : ""}
                                    />
                                    <small className="p-error"><ErrorMessage name="carId" /></small>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    <div className="p-field">
                                        <label htmlFor="fecha_inicio">Fecha inicio *</label>
                                        <Calendar
                                            id="fecha_inicio"
                                            value={values.fecha_inicio ? new Date(values.fecha_inicio) : null}
                                            onChange={(e) => setFieldValue("fecha_inicio", e.value?.toISOString().slice(0,10))}
                                            dateFormat="yy-mm-dd"
                                            showIcon
                                        />
                                        <small className="p-error"><ErrorMessage name="fecha_inicio" /></small>
                                    </div>

                                    <div className="p-field">
                                        <label htmlFor="fecha_fin">Fecha fin *</label>
                                        <Calendar
                                            id="fecha_fin"
                                            value={values.fecha_fin ? new Date(values.fecha_fin) : null}
                                            onChange={(e) => setFieldValue("fecha_fin", e.value?.toISOString().slice(0,10))}
                                            dateFormat="yy-mm-dd"
                                            showIcon
                                        />
                                        <small className="p-error"><ErrorMessage name="fecha_fin" /></small>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    <div className="p-field">
                                        <label htmlFor="estado">Estado *</label>
                                        <Dropdown
                                            id="estado"
                                            value={values.estado}
                                            onChange={(e) => setFieldValue("estado", e.value)}
                                            options={RENTAL_STATES}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="-- Seleccionar estado --"
                                            className={touched.estado && errors.estado ? "p-invalid" : ""}
                                        />
                                        <small className="p-error"><ErrorMessage name="estado" /></small>
                                    </div>


                                    <div className="p-field">
                                        <label htmlFor="metodo_pago">Método de pago *</label>
                                        <Field name="metodo_pago">
                                            {({ field }) => (
                                                <InputText
                                                    id="metodo_pago"
                                                    {...field}
                                                    placeholder="efectivo / tarjeta / transferencia"
                                                    className={touched.metodo_pago && errors.metodo_pago ? "p-invalid" : ""}
                                                />
                                            )}
                                        </Field>
                                        <small className="p-error"><ErrorMessage name="metodo_pago" /></small>
                                    </div>
                                </div>

                                <div className="p-field">
                                    <label htmlFor="total">Total *</label>
                                    <InputText
                                        id="total"
                                        value={totalValue}
                                        onChange={(e) => setFieldValue("total", e.target.value)}
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        className={touched.total && errors.total ? "p-invalid" : ""}
                                    />
                                    <small className="p-error"><ErrorMessage name="total" /></small>
                                </div>

                                <Button
                                    type="submit"
                                    label={isEdit ? "Actualizar" : "Registrar"}
                                    icon={isEdit ? "pi pi-check" : "pi pi-plus"}
                                    className="p-button-primary"
                                    loading={isSubmitting}
                                    style={{ marginTop: 6 }}
                                    disabled={!allowed}
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
                        );
                    }}
                </Formik>
            </Card>
        </div>
    );
}
