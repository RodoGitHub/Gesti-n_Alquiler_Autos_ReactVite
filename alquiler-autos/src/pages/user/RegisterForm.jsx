import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";

export default function RegisterForm() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { roles, message, registerUser } = useContext(UserContext);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(null);     

  const isAdmin = user?.rol === "admin" ;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      correo,
      password,
      rol: isAdmin && rol ? rol : undefined,
    };

    const { ok, message } = await registerUser(payload);

    if (ok) {
      alert(message);
      navigate("/"); 
    } else {
      navigate("/auth/login");
      alert(message);
    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 380,
        margin: "80px auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h2>Crear cuenta</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      {isAdmin && (
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">-- Elegir rol --</option>
          {(roles || []).map((r, i) => (
            <option key={i} value={r?.nombre ?? r}>
              {r?.nombre ?? r}
            </option>
          ))}
        </select>
      )}

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Registrarme</button>
    </form>
  );
}
