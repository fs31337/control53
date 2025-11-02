import {
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { CATEGORIAS } from "../constants/categories";

export default function CategoryFilter({ categoria, onChange }) {
  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Categoría
      </Typography>

      <ToggleButtonGroup
        size="small"
        exclusive
        value={categoria}
        onChange={(_, val) => val && onChange(val)}
        sx={{ flexWrap: "wrap" }}
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
