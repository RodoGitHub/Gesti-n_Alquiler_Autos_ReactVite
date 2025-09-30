import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "../auth/LoginForm";

export default function HomeView() {
  const { user, status } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);

  if (status === "loading") return <p>Cargando...</p>;

  return (
    <div className="home-container">
      <Card title="Alquiler de Autos" className="home-card">
        {!user && !showLogin && (
          <div className="home-buttons">
            <Button
              label="Iniciar Sesión"
              className="p-button-primary"
              onClick={() => setShowLogin(true)}
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <Link to="/register">
              <Button
                label="Registrarse"
                className="p-button-secondary"
                style={{ width: "100%" }}
              />
            </Link>
          </div>
        )}

        {!user && showLogin && (
          <LoginForm onLoginSuccess={() => setShowLogin(false)} />
        )}

        {user && (
          <div>
            <p>Bienvenido, {user.name || user.email}!</p>
            <Link to="/usuarios">
              <Button label="Ir a Usuarios" className="p-button-success" style={{ width: "100%", marginBottom: "1rem" }} />
            </Link>
            <Link to="/productos">
              <Button label="Ir a Productos" className="p-button-info" style={{ width: "100%" }} />
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
