import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
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
import CategoryFilter from "../components/CategoryFilter"; // 👈 Importa el mismo componente visual

export default function Scanner() {
  const videoRef = useRef(null);
  const [categoria, setCategoria] = useState("");
  const [interno, setInterno] = useState("");
  const [scanned, setScanned] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  const legajo = user ? user.email.split("@")[0] : "";

  // 🎯 Lector QR
  useEffect(() => {
    if (!videoRef.current) return;
    const codeReader = new BrowserMultiFormatReader();
    let controls;

    codeReader
      .decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err, controls_) => {
          controls = controls_;
          if (result && !scanned) {
            let text = result.getText();
            try {
              const parsed = JSON.parse(text);
              text = parsed.interno || text;
            } catch {}
            setInterno(text);
            setScanned(true);
            setMensaje("Código escaneado. Revisá los datos y pulsá Enviar.");
          }
        }
      )
      .catch((err) => {
        console.error(err);
        setMensaje("Error al acceder a la cámara: " + err.message);
      });

    return () => {
      if (controls) controls.stop();
    };
  }, [scanned]);

  // 🧾 Enviar registro
  const handleEnviar = async () => {
    setError("");
    setMensaje("");

    if (!categoria) return setError("Debes seleccionar una categoría");
    if (!interno) return setError("No se detectó el número de interno");

    try {
      await addInspection({
        legajo,
        interno,
        categoria,
        metodo: "qr",
      });

      setMensaje(`Registro guardado correctamente para interno ${interno}`);
      setInterno("");
      setScanned(false);
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
        <Stack spacing={2} mb={2}>
          {/* ✅ Filtro de categoría */}
          <CategoryFilter
            categoria={categoria}
            onChange={(cat) => {
              setCategoria(cat);
            }}
          />
        </Stack>

        {/* 🎥 Vista de cámara */}
        {!scanned && (
          <video
            ref={videoRef}
            style={{
              width: "100%",
              border: "2px solid #ccc",
              borderRadius: 8,
            }}
          />
        )}

        {/* ✅ Datos escaneados */}
        {scanned && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: "2px solid green",
              borderRadius: 2,
              bgcolor: "#eaffea",
              textAlign: "center",
            }}
          >
            <Typography variant="subtitle1">
              <strong>Interno:</strong> {interno}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEnviar}
              >
                Enviar
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setInterno("");
                  setScanned(false);
                  setMensaje("");
                  setError("");
                }}
              >
                Escanear otro
              </Button>
            </Stack>
          </Box>
        )}

        {/* Mensajes */}
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
