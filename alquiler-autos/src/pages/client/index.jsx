import { Routes, Route } from "react-router-dom";
import { RequireRole } from "../../utils/RequireRole";
import ClientRegisterForm from "./ClientRegisterForm";
import ClientList from "./ClientList";

const ClientRoutes = () => {
    return (
        <Routes>
            <Route
                path="register"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <ClientRegisterForm />
                    </RequireRole>
                }
            />
            <Route
                path="edit/:id"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <ClientRegisterForm />
                    </RequireRole>
                }
            />
            <Route
                path="list"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <ClientList />
                    </RequireRole>
                }
            />
        </Routes>
    );
};

export default ClientRoutes;
