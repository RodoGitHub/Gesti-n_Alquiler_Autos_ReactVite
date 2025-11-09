import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AUTH_TYPE } from "../constants/authType";

export function RequireRole({ roles = [], children }) {
    const { user, status } = useContext(AuthContext);
    const location = useLocation();
    const LOGIN_PATH = "/auth/login";

    if (status === AUTH_TYPE.LOADING) {
        return null;
    }

    // Sin sesión: redirigir a login
    if (status === AUTH_TYPE.UNAUTH || !user) {
        return (
            <Navigate
                to={LOGIN_PATH}
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    // Con sesión pero sin rol permitido
    if (roles.length && !roles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
