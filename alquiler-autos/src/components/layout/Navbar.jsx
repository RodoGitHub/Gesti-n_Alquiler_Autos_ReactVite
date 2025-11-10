import { useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { AuthContext } from "../../contexts/AuthContext";

const routes = {
    home: "/",
    client: "/client/list",
    user: "/user/list",
    vehicles: "/car/list",
    rental: "/rental",
    about: "/about",
    login: "/auth/login",
};

export default function AppNavbar() {
    const { user, signOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isActive = (to) =>
        pathname === to || pathname.startsWith(to + "/")
        ? "text-primary-500 font-semibold"
        : "";

    function getEmail(u) {
        return u?.email ?? u?.correo ?? "";
    }

    function getDisplayName(u) {
        const email = getEmail(u);
        return u?.nombre ?? u?.name ?? (email ? email.split("@")[0] : "Usuario");
    }

    function getInitial(u) {
        const name = getDisplayName(u);
        return name?.trim()?.charAt(0)?.toUpperCase() || "?";
    }

    const menuItems = useMemo(
        () => [
        { label: "Home", icon: "pi pi-home", command: () => navigate(routes.home), className: isActive(routes.home) },
        { label: "Clientes", icon: "pi pi-users", command: () => navigate(routes.client), className: isActive(routes.client) },
        { label: "Usuarios", icon: "pi pi-user", command: () => navigate(routes.user), className: isActive(routes.user) },
        { label: "Vehículos", icon: "pi pi-car", command: () => navigate(routes.vehicles), className: isActive(routes.vehicles) },
        {
            label: "Alquiler",
            icon: "pi pi-calendar",
            command: () => navigate(routes.rental),
            className: isActive(routes.rental),
            template: (item, options) => (
            <a className={options.className + " flex align-items-center gap-2"} onClick={(e) => options.onClick(e)}>
                <i className={item.icon} />
                <span>{item.label}</span>
                <Badge value="Nuevo" className="ml-2" />
            </a>
            ),
        },
        { label: "Sobre nosotros", icon: "pi pi-info-circle", command: () => navigate(routes.about), className: isActive(routes.about) },
        ],
        [pathname]
    );

    const end = (
    <div className="flex align-items-center gap-3">
        {user ? (
            <>
                <div
                    className="flex align-items-center gap-2 px-3 py-2 border-round-2xl surface-100"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}
                    title={getEmail(user)}
                >
                    <Avatar
                        label={getInitial(user)}
                        shape="circle"
                        size="large"
                        className="text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%)",
                            fontWeight: 700
                        }}
                    />
                    <div className="flex flex-column line-height-2">
                        <span className="text-900 font-semibold">
                            {getDisplayName(user)}
                        </span>
                        <span className="text-600 text-sm">
                            {getEmail(user)}
                        </span>
                    </div>
                </div>

                <Button
                    label="Logout"
                    icon="pi pi-sign-out"
                    className="p-button-text p-button-danger"
                    onClick={async () => {
                        try {
                            await signOut();
                        } finally {
                            navigate(routes.home);
                        }
                    }}
                />
            </>
            ) : (
                <Button
                    label="Login"
                    icon="pi pi-sign-in"
                    onClick={() => navigate(routes.login)}
                />
            )}
        </div>
    );


    return (
        <div className="hidden lg:block">
        <Menubar model={menuItems} end={end} />
        </div>
    );
}
