import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-6 surface-0 border-top-1 border-gray-300"
      style={{
        background: "linear-gradient(135deg, #003366 0%, #006699 100%)",
        color: "white",
      }}
    >
      <div className="p-5">
        <div className="grid align-items-center">
          <div className="col-12 md:col-5 text-center md:text-left mb-4 md:mb-0">
            <div className="flex align-items-center justify-content-center md:justify-content-start mb-3">
              <i
                className="pi pi-car mr-2"
                style={{ fontSize: "1.8rem", color: "#00ccff" }}
              />
              <span className="font-bold text-2xl">AlquilerAutos</span>
            </div>
            <p className="m-0 line-height-3 text-gray-200">
              Hacemos que alquilar un vehículo sea rápido, confiable y sin
              complicaciones.  
              <br />
              Tu viaje empieza con nosotros 🚗💨
            </p>
          </div>

          <div className="col-12 md:col-2 flex justify-content-center">
            <div className="flex gap-2">
              <Button
                icon="pi pi-whatsapp"
                className="p-button-rounded p-button-text text-white"
                tooltip="WhatsApp"
              />
              <Button
                icon="pi pi-envelope"
                className="p-button-rounded p-button-text text-white"
                tooltip="Email"
              />
              <Button
                icon="pi pi-map-marker"
                className="p-button-rounded p-button-text text-white"
                tooltip="Ubicación"
              />
              <Button
                icon="pi pi-github"
                className="p-button-rounded p-button-text text-white"
                tooltip="GitHub"
              />
            </div>
          </div>

          <div className="col-12 md:col-4 text-center md:text-right mt-4 ml-8 md:mt-0">
            <h4 className="m-0 text-gray-200 text-sm">Horarios de atención</h4>
            <p className="m-0 mt-2 text-gray-100">
              Lunes a Viernes <br />
              <strong>09:00 a 18:00 hs</strong>
            </p>
          </div>
        </div>

        <Divider className="my-4 border-gray-400 opacity-50" />

        <div className="flex flex-column md:flex-row align-items-center justify-content-between text-sm text-gray-300">
          <span>© {year} AlquilerAutos — Todos los derechos reservados</span>

          <div className="flex gap-3 mt-3 md:mt-0">
            <a href="/terms" className="no-underline text-gray-300 hover:text-white transition-colors">
              Términos
            </a>
            <a href="/privacy" className="no-underline text-gray-300 hover:text-white transition-colors">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
