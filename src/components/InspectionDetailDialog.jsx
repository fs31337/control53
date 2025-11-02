import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from "@mui/material";

export default function InspectionDetailsDialog({ open, onClose, inspection }) {
  if (!inspection) return null;
  const fecha = inspection.createdAt?.toDate?.()
    ? inspection.createdAt.toDate().toLocaleString()
    : "—";

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Detalle de revisión</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <Typography>
            <b>Interno:</b> {inspection.interno}
          </Typography>
          <Typography>
            <b>Categoría:</b> {inspection.categoria}
          </Typography>
          <Typography>
            <b>Legajo:</b> {inspection.legajo}
          </Typography>
          <Typography>
            <b>Fecha:</b> {fecha}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
