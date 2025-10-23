import { Outlet, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { useRef, useContext, useState, useEffect } from "react";
import GlobalLoader from "./GlobalLoader";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => {
    const toast = useRef(null);
    const navigate = useNavigate();
    const { user, signOut } = useContext(AuthContext); // CORREGIDO
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const today = new Date().toLocaleDateString("es-AR", {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    const handleLogout = () => {
        signOut(); // CORREGIDO
        navigate("/login");
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const leftContents = (
        <div style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem", lineHeight: 1 }}>
            <span style={{ fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || user?.email}
            </span>
            <span style={{ color: "#555" }}>{today}</span>
        </div>
    );

    const rightButtons = [
        { label: "Home", icon: "pi pi-home", command: () => navigate("/") },
        { label: "Vehículos", icon: "pi pi-car", command: () => navigate("/productos") },
        { label: "Reservas", icon: "pi pi-calendar", command: () => navigate("/reservas") },
        { label: "Cerrar sesión", icon: "pi pi-sign-out", command: handleLogout, className: "p-button-danger" },
    ];

    const rightContents = isMobile ? (
        <SplitButton
            label="Menú"
            model={rightButtons}
            className="p-button-sm p-button-rounded"
            style={{ height: "1.5rem", fontSize: "0.75rem", minWidth: "auto" }}
        />
    ) : (
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
            {rightButtons.map((btn, idx) => (
                <Button
                    key={idx}
                    label={btn.label}
                    icon={btn.icon}
                    onClick={btn.command}
                    className={`p-button-sm p-button-rounded ${btn.className || ""}`}
                    style={{ height: "1.5rem", fontSize: "0.75rem", minWidth: "auto", width: "fit-content" }}
                />
            ))}
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflowX: "hidden" }}>
            <GlobalLoader />
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Toolbar
                    start={leftContents}
                    end={rightContents}
                    style={{
                        padding: "0.1rem 0.25rem",
                        height: "2rem",
                        maxWidth: "1300px",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                />
            </div>
            <main style={{ flexGrow: 1, padding: "1rem" }}>
                <Outlet context={{ toast }} />
            </main>
            <Toast ref={toast} />
        </div>
    );
};

export default MainLayout;
