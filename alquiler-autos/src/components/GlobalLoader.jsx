import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { onLoadingChange } from "../core/loading-bus";

const GlobalLoader = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = onLoadingChange(setVisible);
        return unsubscribe;
    }, []);

    if (!visible) return null;

    return (
        <div className="p-d-flex p-jc-center p-ai-center" style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 9999
        }}>
        <ProgressSpinner />
        </div>
    );
};

export default GlobalLoader;
