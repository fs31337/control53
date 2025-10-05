import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Stack, Typography } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Layout from "./components/Layout";
import Login from "./Login";
import Scanner from "./Scanner/Scanner";
import ManualForm from "./ManualForm/ManualForm";
import InternosStatus from "./pages/InternosStatus";
import LegajoHistory from "./pages/LegajoHistory";
import InternoHistory from "./pages/InternoHistory";

export default function App() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) nav("/login");
    });
  }, [nav]);

  return (
    <Layout user={user}>
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
