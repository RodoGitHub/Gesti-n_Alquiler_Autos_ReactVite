import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { onLoadingChange } from "../core/loading-bus";

const GlobalLoader = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = onLoadingChange(setVisible);
        return unsubscribe;
    }, []);

    if (!visible) return null;

    return (
        <div className="p-d-flex p-jc-center p-ai-center p-overlay p-component" style={{ position: "fixed", top:0, left:0, width:"100%", height:"100%", zIndex: 9999, backgroundColor: "rgba(0,0,0,0.3)" }}>
            <Card className="p-d-flex p-jc-center p-ai-center p-flex-column" style={{ padding: '2rem', borderRadius: '1rem' }}>
                <ProgressSpinner strokeWidth="4" style={{ width: '4rem', height: '4rem' }} />
                <span className="p-mt-3" style={{ fontWeight: 600, fontSize: '1.2rem' }}>Cargando...</span>
            </Card>
        </div>
    );
};

export default GlobalLoader;
