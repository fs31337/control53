import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ onLogin }) {
  const [legajo, setLegajo] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const email = `${legajo.trim()}@empresa.local`; // mismo patrón que usaste en Firebase Console
      const userCred = await signInWithEmailAndPassword(auth, email, dni);
      onLogin(userCred.user);
    } catch (err) {
      setError("Legajo o DNI incorrecto");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input
        placeholder="Legajo"
        value={legajo}
        onChange={(e) => setLegajo(e.target.value)}
      />
      <input
        placeholder="DNI"
        type="password"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
      />
      <button onClick={handleLogin}>Ingresar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
