import { Routes, Route } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import ListUser from "./ListUser";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<RegisterForm />} />
            <Route path="list" element={<ListUser />} />
            <Route path=":id" element={<RegisterForm />} />
        </Routes>
    );
};
export default UserRoutes;
