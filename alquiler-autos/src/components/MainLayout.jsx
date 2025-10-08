import { Outlet } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GlobalLoader from "./GlobalLoader";

const MainLayout = () => {
    const toast = useRef(null);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "85vh", margin: 0, padding: 0 }}>
        <GlobalLoader />
        <Navbar toast={toast} style={{ margin: 0, padding: 0 }} />
        <div style={{ flexGrow: 1, padding: 0, margin: 0 }}>
            <Outlet context={{ toast }} />
        </div>
        <Footer style={{ margin: 0, padding: 0 }} />
        <Toast ref={toast} />
        </div>
    );
};

export default MainLayout;


