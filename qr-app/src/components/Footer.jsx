import { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BadgeIcon from "@mui/icons-material/Badge";
import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // solo mostrar en tablet/móvil
  const isMobile = useMediaQuery("(max-width:900px)");

  // sincronizar seleccionado con ruta actual
  useEffect(() => {
    switch (location.pathname) {
      case "/scanner":
        setValue(0);
        break;
      case "/manual":
        setValue(1);
        break;
      case "/internos":
        setValue(2);
        break;
      case "/interno":
        setValue(3);
        break;
      case "/legajos":
        setValue(4);
        break;
      default:
        break;
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/scanner");
        break;
      case 1:
        navigate("/manual");
        break;
      case 2:
        navigate("/internos");
        break;
      case 3:
        navigate("/interno");
        break;
      case 4:
        navigate("/legajos");
        break;
      default:
        break;
    }
  };

  // no renderizar nada en desktop
  if (!isMobile) return null;

  return (
    <Paper
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
      }}
      elevation={3}
    >
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction label="Escanear" icon={<QrCodeScannerIcon />} />
        <BottomNavigationAction label="Manual" icon={<EditNoteIcon />} />
        <BottomNavigationAction label="Internos" icon={<ListAltIcon />} />
        <BottomNavigationAction
          label="Por Interno"
          icon={<PersonSearchIcon />}
        />
        <BottomNavigationAction label="Por Legajo" icon={<BadgeIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
