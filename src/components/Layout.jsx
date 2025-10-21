import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Footer from "./Footer";

export default function Layout({ children, user }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
    setDrawerOpen(false);
  };

  // Items del menú
  const menuItems = [
    { label: "Escanear", to: "/scanner" },
    { label: "Manual", to: "/manual" },
    { label: "Internos", to: "/internos" },
    { label: "Por Interno", to: "/interno" },
    { label: "Por Legajo", to: "/legajos" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <AppBar position="sticky" color="primary">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Control Taller / Limpieza</Typography>

          {user ? (
            <>
              {/* Botón hamburguesa sólo en xs/sm */}
              <IconButton
                color="inherit"
                sx={{ display: { xs: "inline-flex", md: "none" } }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              {/* Botones normales sólo en md+ */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                {menuItems.map((item) => (
                  <Button
                    key={item.to}
                    color="inherit"
                    component={Link}
                    to={item.to}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button color="inherit" onClick={handleLogout}>
                  Salir
                </Button>
              </Stack>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer lateral en móvil */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { md: "none" } }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Salir" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflowX: "hidden",
          px: { xs: 1, sm: 2, md: 3 },
          py: 2,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1800 }}>{children}</Box>
      </Box>

      <Footer />
    </Box>
  );
}
