import { useContext } from "react";
import { Link } from "react-router-dom"; 
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { AuthContext } from "../../context/AuthContext";

export default function HomeView() {
  const { user, status } = useContext(AuthContext);

  if (status === "loading") {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <ProgressSpinner style={{ width: "60px", height: "60px" }} strokeWidth="4" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-column justify-content-center align-items-center bg-gray-100 p-4"
      style={{ minHeight: "100vh", width: "100vw", boxSizing: "border-box" }}
    >
      {!user ? (
        <Card className="shadow-5 border-round-lg p-6" style={{ maxWidth: "600px", width: "100%" }}>
          <h2 className="text-center text-3xl font-semibold mb-4">
            Bienvenido a la App de Gestión
          </h2>
          <p className="text-center text-lg">
            Iniciá sesión o registrate desde el menú superior para comenzar
          </p>
        </Card>
      ) : (
        <>
          <h2 className="text-4xl font-bold mb-6">¡Hola, {user.name || user.email}!</h2>

          <div className="flex flex-wrap justify-content-center gap-6 w-full max-w-4xl">
            <Card className="shadow-5 border-round-lg" style={{ width: "250px" }}>
              <Panel header="Usuarios">
                <p>Gestioná los usuarios de la aplicación.</p>
                <Link to="/usuarios">
                  <Button label="Ir a Usuarios" icon="pi pi-users" className="p-button-success w-full mt-3" />
                </Link>
              </Panel>
            </Card>

            <Card className="shadow-5 border-round-lg" style={{ width: "250px" }}>
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
        </>
      )}
    </div>
  );
}
