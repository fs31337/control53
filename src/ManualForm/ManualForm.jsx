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
  const [subcategoria, setSubcategoria] = useState("");
  const [interno, setInterno] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const user = auth.currentUser;
  const legajo = user ? user.email.split("@")[0] : "";

  const handleSubmit = async () => {
    setError("");
    setMensaje("");

    if (!categoria) return setError("Debes seleccionar una categoría");
    if (!subcategoria) return setError("Debes seleccionar una subcategoría");
    if (!interno.trim()) return setError("Debes ingresar el número de interno");

    try {
      await addInspection({
        legajo,
        interno,
        categoria,
        subcategoria,
        observaciones,
        metodo: "manual",
      });

      setMensaje(`Registro guardado correctamente para el interno ${interno}`);
      setInterno("");
      setObservaciones("");
      setCategoria("");
      setSubcategoria("");
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
        <Typography variant="h5" textAlign="center" mb={2}>
          Carga Manual
        </Typography>

        <Stack spacing={3} mb={2}>
          {/* ✅ Selector de categoría y subcategoría visual */}
          <CategoryFilter
            categoria={categoria}
            subcategoria={subcategoria}
            onChange={(cat, sub) => {
              setCategoria(cat);
              setSubcategoria(sub);
            }}
          />

          {/* Número de interno */}
          <TextField
            fullWidth
            label="Número de interno"
            value={interno}
            onChange={(e) => setInterno(e.target.value)}
          />

          {/* Observaciones */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </Stack>

        {/* Botones */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setInterno("");
              setObservaciones("");
              setCategoria("");
              setSubcategoria("");
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
