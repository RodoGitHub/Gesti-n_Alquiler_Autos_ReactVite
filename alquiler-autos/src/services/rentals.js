import { resource } from "./resource";

export const rentalsService = resource("rentals", "Alquiler");

// Ejemplos de endpoints “de acción” típicos en alquileres:
// rentalsService.post("start", { clientId, carId, from, to });
// rentalsService.post("return", { rentalId, fuelLevel, kilometers });
