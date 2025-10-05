import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

import Layout from "./components/Layout";
import Login from "./Login";
import Scanner from "./Scanner/Scanner";
import ManualForm from "./ManualForm/ManualForm";
import InternosStatus from "./pages/InternosStatus";
import LegajoHistory from "./pages/LegajoHistory";
import InternoHistory from "./pages/InternoHistory";

// 🔹 Konami Code Hook y Confetti
import { useKonami } from "./hooks/useKonami";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function App() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // Mantener sesión / redirigir
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) nav("/login");
    });
  }, [nav]);

  // Hook Konami: dispara confeti y alert
  useKonami(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 10000); // confeti 10 seg
  });

  return (
    <Layout user={user}>
      {/* Confeti */}
      {showConfetti && <Confetti width={width} height={height} />}

      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/manual" element={<ManualForm />} />
        <Route path="/internos" element={<InternosStatus />} />
        <Route path="/legajos" element={<LegajoHistory />} />
        <Route path="/interno" element={<InternoHistory />} />
        <Route
          path="/"
          element={user ? <InternosStatus /> : <Login onLogin={setUser} />}
        />
      </Routes>
    </Layout>
  );
}
