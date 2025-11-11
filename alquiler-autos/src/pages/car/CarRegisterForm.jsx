import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { BrandContext } from "../../contexts/BrandsContext";
import { CarContext } from "../../contexts/CarsContext";

export default function CarRegisterForm() {
    const { fetchBrands } = useContext(BrandContext);
    const { getCarById, registerCar, editCar } = useContext(CarContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id) && id !== "new";

    const toast = useRef(null);

    const [initialValues, setInitialValues] = useState({
        marcaId: "",
        modelo: "",
        anio: "",
        precio_dia: "",
        disponible: true,
        is_active: true
    });

    const [brands, setBrands] = useState([]);

    const schema = Yup.object({
        marcaId: Yup.number().typeError("Seleccioná una marca").required("Marca requerida"),
        modelo: Yup.string().required("Modelo requerido"),
        anio: Yup.number().typeError("Año inválido").min(1900, "Mínimo 1900").max(2035, "Máximo 2035").required("Año requerido"),
        precio_dia: Yup.number().typeError("Precio inválido").min(0, "No puede ser negativo").required("Precio requerido"),
        disponible: Yup.boolean(),
        is_active: Yup.boolean()
    });

    const loadBrands = async () => {
        try {
            const res = await fetchBrands();
            const data = res?.data?.data ?? res?.data ?? [];
            const items = Array.isArray(data) ? data : [];
            setBrands(items.map(b => ({ label: b.nombre, value: b.id })));
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err?.response?.data?.message || err?.message || "No se pudieron cargar las marcas."
            });
        }
    };

    const loadCar = async (carId) => {
        try {
            const res = await  getCarById(carId); 
            const d = res?.data?.data ?? res?.data;
            if (!d) return;
            setInitialValues({
                marcaId: d.marcaId || d.marcaId || d.Brand?.id || "",
                modelo: d.modelo || "",
                anio: d.anio ?? "",
                precio_dia: d.precio_dia ?? "",
                disponible: d.disponible !== false,
                is_active: d.is_active !== false
            });
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err?.response?.data?.message || err?.message || "No se pudo cargar el auto."
            });
        }
    };

    useEffect(() => {
        loadBrands();
        if (isEdit) loadCar(Number(id));
    }, [id, isEdit]);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            const payload = {
                marcaId: Number(values.marcaId),
                modelo: values.modelo.trim(),
                anio: Number(values.anio),
                precio_dia: Number(values.precio_dia),
                disponible: !!values.disponible,
                ...(isEdit ? { is_active: !!values.is_active } : {}) 
            };

            if (isEdit) {
                const res = await editCar(Number(id), payload); 
                toast.current?.show({
                    severity: "success",
                    summary: "Actualizado",
                    detail: res?.data?.message || "Auto actualizado correctamente",
                    life: 1800
                });
            } else {
                const res = await registerCar(payload); 
                toast.current?.show({
                    severity: "success",
                    summary: "Creado",
                    detail: res?.data?.message || "Auto registrado correctamente",
                    life: 1800
                });
            }

            navigate("/car/list", { replace: true });
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Error al guardar";
            toast.current?.show({ severity: "error", summary: "Error", detail: msg, life: 2600 });
            setFieldError("modelo", msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: "90vh", display: "grid", placeItems: "center", padding: 16 }}>
            <Toast ref={toast} />
            <Card style={{ width: 760, maxWidth: "95vw" }}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>
                    {isEdit ? "Editar auto" : "Registro de auto"}
                </h2>
                <p style={{ marginTop: 0, color: "#666" }}>
                    {isEdit ? "Actualizá los datos del vehículo" : "Completá los datos para agregar un vehículo"}
                </p>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, touched, errors, values, setFieldValue }) => (
                        <Form className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div className="p-field">
                                <label htmlFor="marcaId">Marca *</label>
                                <Dropdown
                                    id="marcaId"
                                    value={values.marcaId}
                                    onChange={(e) => setFieldValue("marcaId", e.value)}
                                    options={brands}
                                    placeholder="-- Elegir marca --"
                                    className={touched.marcaId && errors.marcaId ? "p-invalid" : ""}
                                />
                                <small className="p-error"><ErrorMessage name="marcaId" /></small>
                            </div>

                            <div className="p-field">
                                <label htmlFor="modelo">Modelo *</label>
                                <Field name="modelo">
                                    {({ field }) => (
                                        <InputText
                                            id="modelo"
                                            {...field}
                                            placeholder="Corolla, Onix, etc."
                                            className={touched.modelo && errors.modelo ? "p-invalid" : ""}
                                        />
                                    )}
                                </Field>
                                <small className="p-error"><ErrorMessage name="modelo" /></small>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div className="p-field">
                                    <label htmlFor="anio">Año *</label>
                                    <Field name="anio">
                                        {({ field }) => (
                                            <InputText
                                                id="anio"
                                                {...field}
                                                type="number"
                                                placeholder="2023"
                                                className={touched.anio && errors.anio ? "p-invalid" : ""}
                                            />
                                        )}
                                    </Field>
                                    <small className="p-error"><ErrorMessage name="anio" /></small>
                                </div>

                                <div className="p-field">
                                    <label htmlFor="precio_dia">Precio por día *</label>
                                    <Field name="precio_dia">
                                        {({ field }) => (
                                            <InputText
                                                id="precio_dia"
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                placeholder="10000"
                                                className={touched.precio_dia && errors.precio_dia ? "p-invalid" : ""}
                                            />
                                        )}
                                    </Field>
                                    <small className="p-error"><ErrorMessage name="precio_dia" /></small>
                                </div>
                            </div>

                            <div className="p-field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <label style={{ marginRight: 6 }}>Disponible</label>
                                <InputSwitch
                                    checked={values.disponible}
                                    onChange={(e) => setFieldValue("disponible", e.value)}
                                />
                                <span>{values.disponible ? "Disponible" : "No disponible"}</span>
                            </div>


                            <Button
                                type="submit"
                                label={isEdit ? "Actualizar" : "Registrar"}
                                icon={isEdit ? "pi pi-check" : "pi pi-plus"}
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
