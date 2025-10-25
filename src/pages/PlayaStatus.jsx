import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Button,
  Tooltip,
  TextField,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";

const ALL_INTERNALS = Array.from({ length: 108 }, (_, i) => i + 1);

const colores = {
  gris: "#e0e0e0",
  verde: "#c8e6c9",
  azul: "#bbdefb",
  rojo: "#ffcdd2",
  naranja: "#ffe0b2",
};

export default function PlayaStatus() {
  const [internos, setInternos] = useState({});
  const [estado, setEstado] = useState(() => {
    const saved = localStorage.getItem("estadoInternos");
    return saved ? JSON.parse(saved) : {};
  });
  const [sortBy, setSortBy] = useState("numero");

  // ✅ Cargar kms desde localStorage si existen
  useEffect(() => {
    const savedData = localStorage.getItem("kmsInternos");
    if (savedData) {
      try {
        setInternos(JSON.parse(savedData));
      } catch (err) {
        console.error("Error al leer datos guardados:", err);
      }
    }
  }, []);

  const handleEstadoChange = (num, nuevo) => {
    const newEstado = { ...estado, [num]: nuevo };
    setEstado(newEstado);
    localStorage.setItem("estadoInternos", JSON.stringify(newEstado));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets["53"];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const data = {};
      json.slice(1).forEach((row, idx) => {
        const interno = row[0];
        const km = parseFloat(row[1]);
        const puesto = idx + 1;
        if (interno && !isNaN(km))
          data[interno] = { km, puesto, total: json.length - 1 };
      });

      setInternos(data);
      localStorage.setItem("kmsInternos", JSON.stringify(data));
    };
    reader.readAsBinaryString(file);
  };

  const colorPuesto = (puesto, total) => {
    if (!puesto) return "#999";
    const ratio = puesto / total;
    const r = Math.round(255 * ratio);
    const g = Math.round(200 * (1 - ratio));
    return `rgb(${r},${g},100)`;
  };

  const handleDragEnd = (num, info) => {
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    const threshold = 50;

    if (offsetY < -threshold) handleEstadoChange(num, "verde");
    else if (offsetX > threshold) handleEstadoChange(num, "azul");
    else if (offsetY > threshold) handleEstadoChange(num, "rojo");
    else if (offsetX < -threshold) handleEstadoChange(num, "naranja");
    else handleEstadoChange(num, "gris");
  };

  const sortedInternals = () => {
    const entries = ALL_INTERNALS.map((num) => ({
      num,
      info: internos[num],
    }));

    if (sortBy === "puesto") {
      return entries.sort((a, b) => {
        const pa = a.info?.puesto || 9999;
        const pb = b.info?.puesto || 9999;
        return pa - pb;
      });
    }
    return entries.sort((a, b) => a.num - b.num);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={2}
        spacing={2}
      >
        <Typography variant="h5">Estado de coches en playa</Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" component="label">
            Cargar Excel
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
              accept=".xlsx"
            />
          </Button>

          <TextField
            select
            size="small"
            label="Ordenar por"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="numero">Número de coche</MenuItem>
            <MenuItem value="puesto">Puesto por km</MenuItem>
          </TextField>
        </Stack>
      </Stack>

      <Grid container spacing={1.5} justifyContent="center">
        {sortedInternals().map(({ num, info }) => {
          const color = colores[estado[num] || "gris"];
          const km = info?.km?.toFixed(0) || "—";
          const puesto = info?.puesto;
          const puestoColor = colorPuesto(puesto, info?.total || 108);

          return (
            <Grid item key={num}>
              <Tooltip
                title={
                  info
                    ? `Interno ${num} • ${km} km • Puesto ${puesto}/${info.total}`
                    : `Interno ${num} • Sin datos`
                }
                arrow
              >
                <motion.div
                  drag
                  dragElastic={0.2}
                  dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  onDragEnd={(e, info) => handleDragEnd(num, info)}
                >
                  <Paper
                    sx={{
                      width: 90,
                      height: 90,
                      bgcolor: color,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "grab",
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                      transition: "all 0.2s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      #{num}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#555", lineHeight: 1.2 }}
                    >
                      {km} km
                    </Typography>
                    {puesto && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: puestoColor,
                          fontWeight: "bold",
                        }}
                      >
                        Puesto {puesto}
                      </Typography>
                    )}
                  </Paper>
                </motion.div>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      {/* Leyenda */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        mt={4}
      >
        {Object.entries(colores).map(([key, value]) => (
          <Stack
            key={key}
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ bgcolor: "background.paper", p: 1, borderRadius: 1 }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                bgcolor: value,
                border: "1px solid #999",
                borderRadius: "4px",
              }}
            />
            <Typography variant="caption">{key}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
