export const RENTAL_STATES = [
    { label: "Pendiente", value: "pendiente" },
    { label: "Confirmado", value: "confirmado" },
    { label: "Finalizado", value: "finalizado" },
    { label: "Cancelado", value: "cancelado" }
];

export const RENTAL_STATE_STYLE = {
    pendiente:  { className: "bg-yellow-100 text-yellow-800", label: "Pendiente" },
    confirmado: { className: "bg-blue-100 text-blue-800",   label: "Confirmado" },
    finalizado: { className: "bg-green-100 text-green-800",  label: "Finalizado" },
    cancelado:  { className: "bg-gray-200 text-gray-700",    label: "Cancelado" }
};
