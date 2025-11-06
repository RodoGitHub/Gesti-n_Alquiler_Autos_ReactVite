import { Routes, Route } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import UserList from "./ListUser";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<RegisterForm />} /> 
            <Route path="edit/:id" element={<RegisterForm />} /> 
            <Route path="list" element={<UserList />}/>
        </Routes>
    );
};
export default UserRoutes;
