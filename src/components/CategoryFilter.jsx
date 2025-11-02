import { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { CATEGORIAS } from "../constants/categories";

/**
 * CategoryFilter simple, más grande y persistente
 */
export default function CategoryFilter({ categoria, onChange, resetTrigger }) {
  const [selected, setSelected] = useState(
    () => localStorage.getItem("ultimaCategoria") || categoria || ""
  );

  // 🔄 Reset manual (al presionar "Limpiar")
  useEffect(() => {
    if (!resetTrigger) return;
    setSelected("");
    localStorage.removeItem("ultimaCategoria");
  }, [resetTrigger]);

  const handleChange = (_, val) => {
    if (!val) return;
    setSelected(val);
    localStorage.setItem("ultimaCategoria", val);
    onChange(val);
  };

  return (
    <Stack direction="column" spacing={1}>
      <ToggleButtonGroup
        size="large"
        exclusive
        value={selected}
        onChange={handleChange}
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
          "& .MuiToggleButton-root": {
            fontSize: "1rem",
            padding: "14px 20px",
            margin: "4px",
            borderRadius: "10px",
            minWidth: "120px",
            minHeight: "60px",
            fontWeight: "bold",
          },
        }}
      >
        {CATEGORIAS.map((cat) => (
          <ToggleButton key={cat} value={cat}>
            {cat.replace("_", " ")}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
