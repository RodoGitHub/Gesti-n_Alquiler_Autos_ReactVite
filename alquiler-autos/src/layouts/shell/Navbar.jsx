// src/components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
    const { user, status, signOut } = useContext(AuthContext);

    return (
        <div className="navbar p-d-flex p-jc-between p-ai-center p-p-3 p-shadow-2">
        <h2 className="navbar-title">Alquiler de Autos</h2>
        
        <div className="navbar-buttons p-d-flex p-gap-2">
            {status === "authenticated" && user ? (
            <>
                <Link to="/usuarios">
                <Button label="Usuarios" className="p-button-outlined p-button-light" />
                </Link>
                <Link to="/productos">
                <Button label="Productos" className="p-button-outlined p-button-light" />
                </Link>
                <Button 
                label="Cerrar Sesión" 
                className="p-button-danger" 
                onClick={signOut} 
                />
            </>
            ) : (
            <>
                <Link to="/login">
                <Button label="Iniciar Sesión" className="p-button-primary" />
                </Link>
                <Link to="/register">
                <Button label="Registrarse" className="p-button-secondary" />
                </Link>
            </>
            )}
        </div>
        </div>
    );
    };

export default Navbar;
