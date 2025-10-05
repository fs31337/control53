import { useState } from "react";
import { addInspection } from "../services";
import { auth } from "../firebase";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";

export default function ManualForm() {
  const [categoria, setCategoria] = useState("limpieza");
  const [interno, setInterno] = useState("");
  const [accion, setAccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const user = auth.currentUser;
  const legajo = user ? user.email.split("@")[0] : "";

  const handleSubmit = async () => {
    setError("");
    setMensaje("");
    if (!interno) {
      setError("Debes ingresar el número de interno");
      return;
    }
    try {
      await addInspection({
        legajo,
        interno,
        categoria,
        accion,
        observaciones,
        metodo: "manual",
      });
      setMensaje(`Registro guardado para interno ${interno}`);
      setInterno("");
      setAccion("");
      setObservaciones("");
    } catch (err) {
      setError("Error guardando: " + err.message);
    }
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Carga Manual
        </Typography>

        <Stack spacing={2} mb={2}>
          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            fullWidth
          >
            <MenuItem value="limpieza">Limpieza</MenuItem>
            <MenuItem value="taller">Taller</MenuItem>
            <MenuItem value="inspeccion">Inspección</MenuItem>
            <MenuItem value="otro">Otro</MenuItem>
          </Select>

          <TextField
            fullWidth
            label="Número de interno"
            value={interno}
            onChange={(e) => setInterno(e.target.value)}
          />

          <TextField
            fullWidth
            label="Acción (opcional)"
            value={accion}
            onChange={(e) => setAccion(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setInterno("");
              setAccion("");
              setObservaciones("");
              setMensaje("");
              setError("");
            }}
          >
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
