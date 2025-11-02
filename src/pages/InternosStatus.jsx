import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import InspectionDetailsDialog from "../components/InspectionDetailDialog";
import { subscribeToCategoryChanges } from "../services";
import CategoryFilter from "../components/CategoryFilter";

dayjs.extend(relativeTime);

const ALL_INTERNALS = Array.from({ length: 108 }, (_, i) => i + 1);

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
  const [flashInternos, setFlashInternos] = useState(new Set());

  // ✅ Cache + subscripción unificada
  useEffect(() => {
    if (!category) return;

    const cacheKey = `lastMap_${category}`;

    // Cargar cache inicial
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) setLastMap(new Map(JSON.parse(cached)));

    // Bandera para evitar el flash en el primer render
    let firstRender = true;

    const handleUpdate = (data, changed) => {
      setLastMap(data);
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify(Array.from(data.entries()))
      );

      // Solo mostrar el flash si no es el primer render y hay cambios
      if (!firstRender && changed.size > 0) {
        setFlashInternos(changed);
        setTimeout(() => setFlashInternos(new Set()), 1500);
      }

      firstRender = false;
    };

    // Suscribirse a Firestore según haya subcategoría o no
    const unsubscribe = subscribeToCategoryChanges(category, handleUpdate);

    return () => unsubscribe();
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

    if (sortByStale === "desc")
      enriched.sort((a, b) => (b.deltaDays ?? 9999) - (a.deltaDays ?? 9999));
    else if (sortByStale === "asc")
      enriched.sort((a, b) => (a.deltaDays ?? 9999) - (b.deltaDays ?? 9999));
    else enriched.sort((a, b) => Number(a.interno) - Number(b.interno));

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
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        overflowX: "hidden",
        py: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "6000px" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={8}
        >
          <Typography variant="h5">Estado de internos</Typography>
          <CategoryFilter
            categoria={category}
            onChange={(cat) => {
              setCategory(cat);
            }}
          />
          <TextField
            size="small"
            label="Buscar interno"
            placeholder="Ej: 12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            size="small"
            select
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
          {rows.map(({ interno, rec, deltaDays, label, date }) => {
            const { border, bg } = colorByDays(deltaDays);
            const isFlashing = flashInternos.has(interno);
            return (
              <Grid key={interno}>
                <Tooltip
                  title={rec ? `Última revisión: ${label}` : "Sin registros"}
                >
                  <Box
                    onClick={() => rec && handleOpenDetails(rec)}
                    sx={{
                      border,
                      backgroundColor: bg,
                      borderRadius: "10px",
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
                      boxShadow: isFlashing
                        ? "0 0 10px 4px rgba(0, 200, 0, 0.4)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": rec ? { transform: "scale(1.05)" } : {},
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      #{interno}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.3, color: "text.secondary" }}
                    >
                      {rec && date
                        ? dayjs(date).format("DD/MM HH:mm")
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
