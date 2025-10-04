import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./Login";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div>
      <h1>Bienvenido legajo: {user.email.split("@")[0]}</h1>
      <button onClick={() => signOut(auth)}>Cerrar sesión</button>
      {/* aquí luego agregás escaneo QR y registro */}
    </div>
  );
}

export default App;
