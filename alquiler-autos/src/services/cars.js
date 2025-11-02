import { resource } from "./resource";

export const carsService = resource("cars", "Auto");

// Ejemplos:
// carsService.list({ params: { page: 1, brand: "Ford" } });
// carsService.create({ plate: "ABC123", model: "Fiesta" });
