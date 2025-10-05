import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export default function Login({ onLogin }) {
  const [legajo, setLegajo] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const email = `${legajo.trim()}@empresa.local`;
      const userCred = await signInWithEmailAndPassword(auth, email, dni);
      onLogin(userCred.user);
    } catch (err) {
      console.error(err);
      setError("Legajo o DNI incorrecto");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflowX: "hidden", // evita scroll horizontal
        mt: 4,
      }}
    >
      <Box
        sx={{
          width: "100%", // ocupa todo el ancho disponible
          maxWidth: 400, // límite máximo en desktop
          px: 2, // padding lateral para que respire en móvil
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
