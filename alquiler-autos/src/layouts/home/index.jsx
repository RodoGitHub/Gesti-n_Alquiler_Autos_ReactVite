import { Outlet, Link } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const MainLayout = () => {
    const items = [
        { label: "Inicio", icon: "pi pi-home", url: "/" },
        { label: "Usuarios", icon: "pi pi-users", url: "/usuarios" },
        { label: "Productos", icon: "pi pi-box", url: "/productos" },
    ];

    return (
        <div className="min-h-screen flex flex-column">
        <Menubar model={items} />
        <div className="p-4">            
            <Outlet />
        </div>
        </div>
    );
};

export default MainLayout;
