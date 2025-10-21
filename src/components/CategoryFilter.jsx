import {
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { CATEGORIAS } from "../constants/categories";

/**
 * Componente de filtro de categorías y subcategorías
 * @param {string} categoria - Categoría seleccionada
 * @param {string} subcategoria - Subcategoría seleccionada
 * @param {function} onChange - Callback (categoria, subcategoria)
 */
export default function CategoryFilter({ categoria, subcategoria, onChange }) {
  return (
    <Stack direction="column" spacing={1}>
      {/* Selector de categoría principal */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Categoría
      </Typography>

      <ToggleButtonGroup
        size="small"
        exclusive
        value={categoria}
        onChange={(_, val) => val && onChange(val, "")}
      >
        {Object.keys(CATEGORIAS).map((cat) => (
          <ToggleButton key={cat} value={cat}>
            {cat.replace("_", " ")}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Selector de subcategoría (solo si aplica) */}
      {categoria &&
        Array.isArray(CATEGORIAS[categoria]) &&
        CATEGORIAS[categoria].length > 0 && (
          <>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Subcategoría
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={subcategoria}
              onChange={(_, val) => val && onChange(categoria, val)}
            >
              {CATEGORIAS[categoria].map((sub) => (
                <ToggleButton key={sub} value={sub}>
                  {sub}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </>
        )}
    </Stack>
  );
}
