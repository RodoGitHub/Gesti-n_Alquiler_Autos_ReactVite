import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function LoginForm() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const { ok, message } = await signIn({ correo, password });

  if (ok) {
    navigate("/");
    alert(message);
  } else {
    setError(message || "Usuario o contraseña incorrectos");
    alert(message);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 320,
        margin: "100px auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h2>Iniciar sesión</h2>

      <input
        type="text"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Entrar</button>
    </form>
  );
}
