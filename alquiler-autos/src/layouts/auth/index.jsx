import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthRoutes = ({ toast }) => {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm toast={toast} />} />
            <Route path="/register" element={<RegisterForm toast={toast} />} />
        </Routes>
    );
};

export default AuthRoutes;
