import { Routes, Route } from "react-router-dom";
import UserRegisterForm from "./UserRegisterForm";
import UserList from "./UserList";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<UserRegisterForm />} /> 
            <Route path="edit/:id" element={<UserRegisterForm />} /> 
            <Route path="list" element={<UserList />}/>
        </Routes>
    );
};
export default UserRoutes;
