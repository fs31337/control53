import { useState } from "react";
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
import { fetchByInterno } from "../services";

const PAGE_SIZE = 20;

export default function InternoHistory() {
  const [interno, setInterno] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);

  const handleSearch = async () => {
    const data = await fetchByInterno(interno.trim());
    setRows(data);
    setPage(1);
  };

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box p={2}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5">Historial por Interno</Typography>
        <TextField
          size="small"
          label="Interno"
          value={interno}
          onChange={(e) => setInterno(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!interno.trim()}
        >
          Buscar
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Interno</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Legajo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>SubCategoria</TableCell>
              <TableCell>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((r) => {
              const fecha = r.createdAt?.toDate?.()
                ? r.createdAt.toDate().toLocaleString()
                : "—";
              return (
                <TableRow key={r.id}>
                  <TableCell>{r.interno}</TableCell>
                  <TableCell>{fecha}</TableCell>
                  <TableCell>{r.legajo}</TableCell>
                  <TableCell>{r.categoria}</TableCell>
                  <TableCell>{r.subcategoria}</TableCell>
                  <TableCell>{r.observaciones || "—"}</TableCell>
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
