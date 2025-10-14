import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const start = (
        <span
        style={{
            fontWeight: "bold",
            color: "white",
            fontSize: "1.3rem",
            marginLeft: "0.5rem",
        }}
        >
        AutoGo!
        </span>
    );

    const end = (
        <div className="flex align-items-center gap-2">
        <Button
            label="Iniciar Sesión"
            className="p-button-rounded p-button-sm p-button-secondary"
            onClick={() => navigate("/login")}
        />
        <Button
            label="Registrarse"
            className="p-button-rounded p-button-sm p-button-primary"
            onClick={() => navigate("/register")}
        />
        </div>
    );

    return (
        <Menubar
        start={start}
        end={end}
        style={{
            background: "#007ad9",
            border: "none",
            padding: "0.5rem 1rem",
        }}
        />
    );
};

export default Navbar;
