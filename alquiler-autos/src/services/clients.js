import { resource } from "./resource";

export const clientsService = resource("clients", "Cliente");

// Ejemplos:
// clientsService.get(5);
// clientsService.post("import", { fileId: "xxxx" });
