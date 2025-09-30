import { Outlet } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GlobalLoader from "./GlobalLoader"; 
const MainLayout = () => {
    const toast = useRef(null);

    return (
        <div className="p-d-flex p-flex-column" style={{ minHeight: "100vh" }}>
        {/* Spinner global */}
        <GlobalLoader />

        {/* Barra de navegación */}
        <Navbar toast={toast} />

        {/* Contenido principal */}
        <div className="p-flex-1 p-p-3" style={{ flexGrow: 1 }}>
            <Outlet context={{ toast }} />
        </div>

        {/* Footer */}
        <Footer />

        {/* Toast global */}
        <Toast ref={toast} />
        </div>
    );
};

export default MainLayout;
