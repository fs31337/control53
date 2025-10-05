// src/main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// MUI
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import "./index.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";

registerSW(); // auto-update del service worker

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resetea estilos y aplica paleta */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
