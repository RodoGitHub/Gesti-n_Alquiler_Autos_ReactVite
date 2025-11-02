import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AUTH_TYPE } from "../../constants/authType";

export default function Home() {
    const { user, status, signOut } = useContext(AuthContext);
    const navigate = useNavigate();
    if (status === AUTH_TYPE.LOADING) {
        return <div>Cargando información...</div>;
    }

    if (!user) {
        return (
            <div>
                <h1> Bienvenido.</h1>
                <p>No hay usuario logueado.</p>
                <button onClick={() => navigate('/auth/login')}>
                    Sign In
                </button>
                <button onClick={() => navigate('/user/register')}>
                    Register
                </button>
            </div>
        );
    }

    return(
        <div>
            <h1> Este es el home.</h1>
            <h3>Hola: {user.nombre}</h3>
            <p>Usuario logueado: {user.correo} </p>
            <p>Rol: {user.rol} </p>
            <p>Status: {status} </p>
            <button onClick={() => signOut()}>
                sign Out
            </button>
        </div> 
    );
}