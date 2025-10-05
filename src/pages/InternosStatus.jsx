import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  IconButton,
  Tooltip,
  useMediaQuery,
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
  const [page, setPage] = useState(1);
  const [lastMap, setLastMap] = useState(new Map());
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Detectar pantallas chicas (<400px)
  const isSmall = useMediaQuery("(max-width:400px)");
  const PAGE_SIZE = isSmall ? 10 : 24;

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

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
      <Box sx={{ width: "100%", maxWidth: 1200 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={2}
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
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
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

        <Grid container spacing={2} justifyContent="center">
          {paged.map(({ interno, rec, deltaDays, label }) => {
            const { border, bg } = colorByDays(deltaDays);
            return (
              <Grid item xs={12} sm={6} md={3} lg={2} key={interno}>
                <Card variant="outlined" sx={{ border, background: bg }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">#{interno}</Typography>
                      {rec && (
                        <Tooltip title="Ver detalle">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDetails(rec)}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Última revisión:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        cursor: rec ? "pointer" : "default",
                        textDecoration: rec ? "underline" : "none",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                      onClick={() => rec && handleOpenDetails(rec)}
                    >
                      {label}
                    </Typography>
                    {deltaDays != null && (
                      <Typography variant="caption" color="text.secondary">
                        Hace {deltaDays} día(s)
                      </Typography>
                    )}
                    {!rec && (
                      <Typography variant="caption" color="text.secondary">
                        Sin registros
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Stack alignItems="center" mt={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Stack>

        <InspectionDetailsDialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          inspection={selected}
        />
      </Box>
    </Box>
  );
}
