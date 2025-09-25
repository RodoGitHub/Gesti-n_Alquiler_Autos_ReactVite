import { Route, Routes} from "react-router-dom";
import UserForm from "./UserForm";
import UserList from "./UserList";

const User = () => {
    return (
        <Routes>
            <Route path="user-new" element={<UserForm />} />
            <Route path="list" element={<UserList />} />
        </Routes>    
    );
};

export default User