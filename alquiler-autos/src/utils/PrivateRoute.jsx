import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { user, status } = useContext(AuthContext);
  const location = useLocation();

  const LOGIN_PATH = "/auth/login";

  if (status === "loading") {
    return null; // o spinner global
  }

  if (status === "authenticated") {
    if (roles && !roles.some(r => user.roles?.includes(r))) {
      return <Navigate to="/inicio-sesion" replace state={{ from: location }} />;
    }
    return children;
  }

  // No autenticado
   return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
};

export default PrivateRoute;