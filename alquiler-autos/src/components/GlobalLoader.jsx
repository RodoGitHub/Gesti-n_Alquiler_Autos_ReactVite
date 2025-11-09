import { useEffect, useState } from "react";
import { onLoadingChange } from "../core/loading-bus";
import { ProgressSpinner } from "primereact/progressspinner";

export default function GlobalLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => onLoadingChange(setVisible), []);
  
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/20 backdrop-blur-sm">
      <div className="p-6 rounded-2xl bg-white/80 shadow-lg flex items-center gap-3">
        <ProgressSpinner strokeWidth="4" style={{ width: 36, height: 36 }} />
        <span className="font-medium text-gray-800">Cargando…</span>
      </div>
    </div>
  );
}
