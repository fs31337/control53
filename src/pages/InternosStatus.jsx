import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import InspectionDetailsDialog from "../components/InspectionDetailDialog";
import { fetchLastByInternoForCategory } from "../services";

dayjs.extend(relativeTime);

const ALL_INTERNALS = Array.from({ length: 105 }, (_, i) => i + 1);

function colorByDays(deltaDays) {
  if (deltaDays == null) return { border: "2px solid #9e9e9e", bg: "#f5f5f5" };
  if (deltaDays > 5) return { border: "2px solid #e53935", bg: "#fdecea" };
  if (deltaDays >= 3) return { border: "2px solid #fb8c00", bg: "#fff3e0" };
  if (deltaDays >= 1) return { border: "2px solid #fbc02d", bg: "#fff9e6" };
  return { border: "2px solid #2e7d32", bg: "#e8f5e9" };
}

export default function InternosStatus() {
  const [category, setCategory] = useState("limpieza");
  const [search, setSearch] = useState("");
  const [sortByStale, setSortByStale] = useState("none");
  const [lastMap, setLastMap] = useState(new Map());
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const cat = category === "limpieza" ? "limpieza" : "taller";
    fetchLastByInternoForCategory(cat).then(setLastMap);
  }, [category]);

  const rows = useMemo(() => {
    const term = search.trim();
    let internos = ALL_INTERNALS.map((n) => String(n));
    if (term) internos = internos.filter((v) => v.includes(term));

    const enriched = internos.map((interno) => {
      const rec = lastMap.get(interno);
      let date = null,
        deltaDays = null,
        label = "N/A";
      if (rec?.createdAt?.toDate) {
        date = rec.createdAt.toDate();
        const diff = dayjs().diff(dayjs(date), "day", true);
        deltaDays = Math.floor(diff);
        label = dayjs(date).format("DD/MM/YYYY HH:mm");
      }
      return { interno, rec, date, deltaDays, label };
    });

    if (sortByStale === "desc") {
      enriched.sort((a, b) => (b.deltaDays ?? 9999) - (a.deltaDays ?? 9999));
    } else if (sortByStale === "asc") {
      enriched.sort((a, b) => (a.deltaDays ?? 9999) - (b.deltaDays ?? 9999));
    } else {
      enriched.sort((a, b) => Number(a.interno) - Number(b.interno));
    }

    return enriched;
  }, [lastMap, search, sortByStale]);

  const handleOpenDetails = (rec) => {
    if (!rec) return;
    setSelected(rec);
    setDetailsOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default", // fondo blanco de Material UI
        display: "flex",
        justifyContent: "center",
        overflowX: "hidden",
        py: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "6000px" }}>
        <Stack
          direction={{ size: "column", sm: "row" }}
          spacing={3}
          alignItems={{ size: "flex-start", sm: "center" }}
          mb={8}
        >
          <Typography variant="h5">Estado de internos</Typography>
          <ToggleButtonGroup
            size="small"
            value={category}
            exclusive
            onChange={(_, val) => val && setCategory(val)}
          >
            <ToggleButton value="limpieza">Limpieza interior</ToggleButton>
            <ToggleButton value="radiador">Limpieza radiador</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            size="small"
            label="Buscar interno"
            placeholder="Ej: 12"
            id="buscar-interno"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <TextField
            size="small"
            select
            id="ordenar-por"
            label="Ordenar por"
            value={sortByStale}
            onChange={(e) => setSortByStale(e.target.value)}
          >
            <MenuItem value="none">Número (1→105)</MenuItem>
            <MenuItem value="desc">Más días sin revisar</MenuItem>
            <MenuItem value="asc">Menos días sin revisar</MenuItem>
          </TextField>
        </Stack>

        <Grid container spacing={1.5} justifyContent="center">
          {rows.map(({ interno, rec, deltaDays, label }) => {
            const { border, bg } = colorByDays(deltaDays);
            return (
              <Grid size="auto" key={interno}>
                <Tooltip
                  title={rec ? `Última revisión: ${label}` : "Sin registros"}
                >
                  <Box
                    onClick={() => rec && handleOpenDetails(rec)}
                    sx={{
                      border,
                      backgroundColor: bg,
                      borderRadius: "10px", // más rectangular
                      width: 120,
                      height: 70,
                      px: 1.5,
                      py: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      color: "#212121",
                      cursor: rec ? "pointer" : "default",
                      userSelect: "none",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.15s ease",
                      "&:hover": rec
                        ? {
                            transform: "scale(1.05)",
                            boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                          }
                        : {},
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      #{interno}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.3,
                        color: "text.secondary",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                      }}
                    >
                      {rec
                        ? dayjs(label, "DD/MM/YYYY HH:mm").format("DD/MM HH:mm")
                        : "Sin datos"}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>

        <InspectionDetailsDialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          inspection={selected}
        />
      </Box>
    </Box>
  );
}
