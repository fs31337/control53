import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [legajo, setLegajo] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ← para redirigir después del login

  const handleLogin = async () => {
    setError("");
    try {
      const email = `${legajo.trim()}@empresa.local`;
      const userCred = await signInWithEmailAndPassword(auth, email, dni);
      onLogin(userCred.user);
      navigate("/internos"); // ← redirige después de logear
    } catch (err) {
      console.error(err);
      setError("Legajo o DNI incorrecto");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "hidden", // evita scroll horizontal
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Ingresar
        </Typography>

        <Stack spacing={2} mb={2}>
          <TextField
            fullWidth
            label="Legajo"
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
          />
          <TextField
            fullWidth
            label="DNI"
            type="password"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </Stack>

        <Stack direction="row" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Ingresar
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
