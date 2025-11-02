import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Pagination,
} from "@mui/material";
import { fetchByLegajo } from "../services";

const PAGE_SIZE = 20;

export default function LegajoHistory() {
  const [legajo, setLegajo] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);

  const load = async () => {
    const data = await fetchByLegajo(legajo.trim());
    setRows(data);
    setPage(1);
  };

  useEffect(() => {
    // opcional: autoload si querés un default
  }, []);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box p={2}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5">Historial por legajo</Typography>
        <TextField
          size="small"
          label="Legajo"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              load();
            }
          }}
        />
        <Button variant="contained" onClick={load} disabled={!legajo.trim()}>
          Buscar
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Legajo</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Interno</TableCell>
              <TableCell>Categoría</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((r) => {
              const fecha = r.createdAt?.toDate?.()
                ? r.createdAt.toDate().toLocaleString()
                : "—";
              return (
                <TableRow key={r.id}>
                  <TableCell>{r.legajo}</TableCell>
                  <TableCell>{fecha}</TableCell>
                  <TableCell>{r.interno}</TableCell>
                  <TableCell>{r.categoria}</TableCell>
                </TableRow>
              );
            })}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="center" mt={2}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, p) => setPage(p)}
          color="primary"
        />
      </Stack>
    </Box>
  );
}
