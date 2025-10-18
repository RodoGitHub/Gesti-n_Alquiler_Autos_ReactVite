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
        <div 
            className="p-d-flex p-jc-center p-ai-center p-overlay p-component" 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.15)' // overlay más sutil
            }}
        >
            <ProgressSpinner strokeWidth="3" style={{ width: '3rem', height: '3rem' }} />
        </div>
    );
};

export default GlobalLoader;
