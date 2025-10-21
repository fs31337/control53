import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { addInspection } from "../services";
import { auth } from "../../firebaseConfig";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

export default function Scanner() {
  const videoRef = useRef(null);
  const [categoria, setCategoria] = useState("limpieza");
  const [observaciones, setObservaciones] = useState("");
  const [interno, setInterno] = useState("");
  const [scanned, setScanned] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  const legajo = user ? user.email.split("@")[0] : "";

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
            setMensaje("Código escaneado, revisa y pulsa Enviar");
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

  const handleEnviar = async () => {
    if (!interno) return;
    try {
      await addInspection({
        legajo,
        interno,
        categoria,
        subcategoria,
        observaciones,
        metodo: "qr",
      });
      setMensaje(`Registro guardado para interno ${interno}`);
      setInterno("");
      setObservaciones("");
      setScanned(false);
    } catch (err) {
      setMensaje("Error guardando: " + err.message);
    }
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Escanear QR
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
            multiline
            rows={3}
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </Stack>

        {!scanned && (
          <video
            ref={videoRef}
            style={{ width: "100%", border: "2px solid #ccc", borderRadius: 8 }}
          />
        )}

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
                }}
              >
                Escanear otro
              </Button>
            </Stack>
          </Box>
        )}

        {mensaje && (
          <Typography
            variant="body2"
            color="text.secondary"
            mt={2}
            textAlign="center"
          >
            {mensaje}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
