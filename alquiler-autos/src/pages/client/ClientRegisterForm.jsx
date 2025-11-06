import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientContext } from "../../contexts/ClientContext";

export default function ClientRegisterForm() { 
    const { registerClient } = useContext(ClientContext);
    const navigate = useNavigate();

    const nombreRef = useRef(null);
    const apellidoRef = useRef(null);
    const documentoRef = useRef(null);
    const correoRef = useRef(null);
    const telefonoRef = useRef(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onlyDigits = (s) => (s || "").replace(/\D+/g, "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const payload = {
        nombre: (nombreRef.current?.value || "").trim(),
        apellido: (apellidoRef.current?.value || "").trim(),
        documento: onlyDigits(documentoRef.current?.value),
        correo: (correoRef.current?.value || "").trim(),
        telefono: onlyDigits(telefonoRef.current?.value),
        };

        if (!payload.nombre || !payload.apellido || !payload.documento) {
        setError("Nombre, apellido y documento son obligatorios.");
        return;
        }

        try {
        setLoading(true);
        const { ok, message } = await registerClient(payload);
        if (!ok) {
            setError(message || "No se pudo registrar el cliente.");
            return;
        }
        
        navigate("/clients");
        } catch (err) {
        setError(err?.message || "Error inesperado.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "60px auto" }}>
            <h2>Registrar Cliente</h2>

            <div className="mb-3">
                <label className="form-label">Nombre *</label>
                <input ref={nombreRef} className="form-control" placeholder="Juan" />
            </div>

            <div className="mb-3">
                <label className="form-label">Apellido *</label>
                <input ref={apellidoRef} className="form-control" placeholder="Pérez" />
            </div>

            <div className="mb-3">
                <label className="form-label">Documento (DNI) *</label>
                <input
                ref={documentoRef}
                className="form-control"
                placeholder="30123456"
                inputMode="numeric"
                onInput={(e) => (e.target.value = onlyDigits(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Correo</label>
                <input ref={correoRef} type="email" className="form-control" placeholder="correo@ejemplo.com" />
            </div>

            <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                ref={telefonoRef}
                className="form-control"
                placeholder="3512345678"
                inputMode="numeric"
                onInput={(e) => (e.target.value = onlyDigits(e.target.value))}
                />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Registrar"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
                Cancelar
                </button>
            </div>
        </form>
    );
}
