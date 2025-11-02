import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<LoginForm />} />
        </Routes>
    );
};
export default AuthRoutes;
