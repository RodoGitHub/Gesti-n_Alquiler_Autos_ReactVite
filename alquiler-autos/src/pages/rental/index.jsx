import { Routes, Route } from "react-router-dom";
import { RequireRole } from "../../utils/RequireRole";
import RentalForm from "./RentalForm";
import RentalList from "./RentalList";

const RentalRoutes = () => {
    return (
        <Routes>
            <Route
                path="register"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <RentalForm />
                    </RequireRole>
                }
            />
            <Route
                path="edit/:id"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <RentalForm />
                    </RequireRole>
                }
            />
            <Route
                path="/list"
                element={
                    <RequireRole roles={["admin", "empleado"]}>
                        <RentalList />
                    </RequireRole>
                }
            />
        </Routes>
    );
};
export default RentalRoutes;