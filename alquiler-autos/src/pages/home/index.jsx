import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";


const HomeRoutes = () => {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="about" element={<About/>} />

        </Routes>
    );
};
export default HomeRoutes;