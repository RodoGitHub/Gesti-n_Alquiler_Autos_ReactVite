import { Route, Routes} from "react-router-dom";
import RegisterForm from "./RegisterForm";

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="/register" element={<RegisterForm />} />
        </Routes>    
    );
};

export default AuthRoutes