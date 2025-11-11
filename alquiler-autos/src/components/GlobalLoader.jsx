import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { onLoadingChange } from "../core/loading-bus";
import { ProgressSpinner } from "primereact/progressspinner";

export default function GlobalLoader() {
    const [visible, setVisible] = useState(false);

    useEffect(() => onLoadingChange(setVisible), []);

    if (!visible) return null;

    const overlay = (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 9999,
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.92)",
                    borderRadius: 16,
                    padding: "24px 28px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid rgba(255,255,255,0.6)"
                }}
            >
                <ProgressSpinner strokeWidth="4" style={{ width: 44, height: 44 }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    Cargando…
                </span>
            </div>
        </div>
    );

    return createPortal(overlay, document.body);
}
