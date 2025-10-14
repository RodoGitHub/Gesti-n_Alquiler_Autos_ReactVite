import { useContext } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { AuthContext } from "../../context/AuthContext";

export default function HomeView() {
  const { status } = useContext(AuthContext);

  if (status === "loading") {
    return (
      <div className="flex justify-content-center align-items-center h-screen w-screen" style={{ backgroundColor: '#1e1e1e' }}>
        <ProgressSpinner strokeWidth="4" />
      </div>
    );
  }

  return (
    <div className="flex justify-content-center align-items-center h-screen w-screen" style={{ backgroundColor: '#1e1e1e' }}>
      <Card 
        className="shadow-4 w-full h-full flex flex-column justify-content-center align-items-center text-center" 
        style={{ backgroundColor: '#1e1e1e', border: 'none', color: 'white' }}
      >
        <h2 className="mb-3 text-3xl">Bienvenido a la App "Gestión Alquiler de Vehículos"</h2>
        <p className="text-lg">Iniciá sesión o registrate desde el menú superior para comenzar</p>
      </Card>
    </div>
  );
}
