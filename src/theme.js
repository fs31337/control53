import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1565c0" }, // azul
    success: { main: "#2e7d32" }, // verde
    warning: { main: "#fbc02d" }, // amarillo (pastel-ish)
    error: { main: "#e53935" }, // rojo
    info: { main: "#0288d1" },
    grey: { 500: "#9e9e9e" },
  },
  shape: { borderRadius: 12 },
});

export default theme;
