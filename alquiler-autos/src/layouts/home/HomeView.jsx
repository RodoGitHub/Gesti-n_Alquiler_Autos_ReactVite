import { useContext } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";

export default function HomeView() {
  const { user, status } = useContext(AuthContext);

  if (status === "loading") {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "100vh", width: "100vw" }}>
        <ProgressSpinner style={{ width: "60px", height: "60px" }} strokeWidth="4" />
      </div>
    );
  }

  return (
    <div className="auth-hero">
      <div className="auth-hero-left">
        <h1>{user ? `¡Hola, ${user.name || user.email}!` : "Bienvenido a AutoGo!"}</h1>
        <h2>{user ? "Gestioná tu app desde aquí" : "Tu viaje comienza aquí"}</h2>
        <p>{user ? "Usá los paneles de la derecha para gestionar usuarios y productos." : "Alquiler de autos fácil, rápido y seguro."}</p>
      </div>

      <div className="auth-hero-right">
        {!user ? (
          <Card className="auth-card">
            <h2 className="text-center">Para empezar, iniciá sesión o registrate</h2>
            <div className="flex justify-content-center gap-3 mt-4">
              <Link to="/login">
                <Button label="Iniciar Sesión" className="p-button-primary p-button-rounded" />
              </Link>
              <Link to="/register">
                <Button label="Registrarse" className="p-button-success p-button-rounded" />
              </Link>
            </div>
          </Card>
        ) : (
          <div className="flex flex-column align-items-center gap-6 w-full max-w-5xl">
            <div className="flex flex-wrap justify-content-center gap-6">
              <Card className="auth-card" style={{ width: "250px" }}>
                <Panel header="Usuarios">
                  <p>Gestioná los usuarios de la aplicación.</p>
                  <Link to="/usuarios">
                    <Button label="Ir a Usuarios" icon="pi pi-users" className="p-button-success w-full mt-3" />
                  </Link>
                </Panel>
              </Card>

              <Card className="auth-card" style={{ width: "250px" }}>
                <Panel header="Productos">
                  <p>Gestioná los productos disponibles.</p>
                  <Link to="/productos">
                    <Button label="Ir a Productos" icon="pi pi-box" className="p-button-info w-full mt-3" />
                  </Link>
                </Panel>
              </Card>
            </div>

            <Divider className="my-6" />

            <p className="text-center text-sm text-gray-500">
              Seleccioná una sección para comenzar a trabajar con la app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
