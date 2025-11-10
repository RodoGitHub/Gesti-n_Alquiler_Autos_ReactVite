import { Routes, Route } from "react-router-dom";
import { RequireRole } from "../../utils/RequireRole";
import CarList from "./CarList";
import CarRegisterForm from "./CarRegisterForm";


const CarRoutes = () => {
    return (
        <Routes>
            <Route
                path="register"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <CarRegisterForm />
                    </RequireRole>
                }
            />
            <Route
                path="edit/:id"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <CarRegisterForm />
                    </RequireRole>
                }
            />
            <Route
                path="list"
                element={
                    <CarList />
                }
            />
        </Routes>
    );
};

export default CarRoutes;
