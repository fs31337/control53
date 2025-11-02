import { useState } from "react";
import { addInspection } from "../services";
import { auth } from "../../firebaseConfig";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import CategoryFilter from "../components/CategoryFilter"; // 👈 Importa tu componente de filtro

export default function ManualForm() {
  const [categoria, setCategoria] = useState("");
  const [interno, setInterno] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [resetTrigger, setResetTrigger] = useState(0);

  const user = auth.currentUser;
  const legajo = user ? user.email.split("@")[0] : "";

  const handleClear = () => {
    setInterno("");
    setCategoria("");
    setMensaje("");
    setError("");
    setResetTrigger((prev) => prev + 1); // 🔁 reinicia el filtro
  };

  const handleSubmit = async () => {
    setError("");
    setMensaje("");

    if (!categoria) return setError("Debes seleccionar una categoría");
    if (!interno.trim()) return setError("Debes ingresar el número de interno");

    try {
      await addInspection({
        legajo,
        interno,
        categoria,
        metodo: "manual",
      });

      setMensaje(`Registro guardado correctamente para el interno ${interno}`);
      setInterno("");
    } catch (err) {
      setError("Error guardando: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 2,
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Stack spacing={3} mb={2}>
          {/* ✅ Selector de categoría visual*/}
          <CategoryFilter
            categoria={categoria}
            resetTrigger={resetTrigger}
            onChange={(cat) => {
              setCategoria(cat);
            }}
          />

          {/* Número de interno */}
          <TextField
            fullWidth
            label="Número de interno"
            value={interno}
            onChange={(e) => setInterno(e.target.value)}
          />
        </Stack>

        {/* Botones */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Limpiar
          </Button>
        </Stack>

        {mensaje && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
