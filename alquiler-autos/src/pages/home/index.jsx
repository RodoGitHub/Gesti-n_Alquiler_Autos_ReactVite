import { Routes, Route } from "react-router-dom";
import Home from "./Home";


const HomeRoutes = () => {
    return (
        <Routes>
            <Route index element={<Home />} />

        </Routes>
    );
};
export default HomeRoutes;