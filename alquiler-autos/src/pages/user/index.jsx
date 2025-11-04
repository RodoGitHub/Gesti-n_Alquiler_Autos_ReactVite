import { Routes, Route } from "react-router-dom";
import RegisterForm from "./RegisterForm";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<RegisterForm />} />
            <Route path=":id" element={<RegisterForm />} />
        </Routes>
    );
};
export default UserRoutes;
