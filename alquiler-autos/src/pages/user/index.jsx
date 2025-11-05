import { Routes, Route } from "react-router-dom";
import { RequireRole } from "../../utils/RequireRole";
import PrivateRoute from "../../utils/PrivateRoute";
import UserRegisterForm from "./UserRegisterForm";
import UserList from "./UserList";

const UserRoutes = () => {
    return (
        <Routes>
            <Route 
                path="register" 
                element={
                        <UserRegisterForm />
                } 
            /> 
            <Route 
                path="edit/:id" 
                element={
                    <PrivateRoute>
                    <RequireRole roles={['admin']}>
                        <UserRegisterForm />
                    </RequireRole>
                    </PrivateRoute>  
                } 
            /> 
            <Route 
                path="list" 
                element={
                    <PrivateRoute>
                    <RequireRole roles={['admin']}>
                        <UserList />
                    </RequireRole>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};
export default UserRoutes;
