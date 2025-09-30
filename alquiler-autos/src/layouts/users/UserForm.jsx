import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const UserForm = ({ userData, onSave, onCancel }) => {
    const [name, setName] = useState(userData?.name || "");
    const [email, setEmail] = useState(userData?.email || "");

    useEffect(() => {
        setName(userData?.name || "");
        setEmail(userData?.email || "");
    }, [userData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, email });
    };

    return (
        <form onSubmit={handleSubmit} className="p-d-flex p-flex-column p-gap-3" style={{ width: "100%" }}>
        <InputText placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <InputText placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="p-d-flex p-jc-between">
            <Button type="submit" label="Guardar" className="p-button-success" />
            <Button type="button" label="Cancelar" className="p-button-secondary" onClick={onCancel} />
        </div>
        </form>
    );
};

export default UserForm;
